/**
 * Wardenclyffe sandbox ONLY: transactional payment confirmations and internal alerts.
 * This module never delivers contracts or accepts a live payment.
 * Call exclusively after a provider-verified $1.00 sandbox payment.
 */
import { SAMPLE, emailOK } from './common.mjs';
import { renderCustomerEmail, renderOfficeEmail, customerSubject, officeSubject, customerPlain, officePlain } from './email-templates.mjs';

const ORDER_STORE = 'wardenclyffe-sandbox-orders';
const STORE_PREFIX = 'verified/';
const normalize = value => String(value || '').trim().toLowerCase();
export function emailsConfigured(env = process.env) {
  return env.PAYMENTS_MODE === 'sandbox' &&
    env.ENABLE_SANDBOX_EMAILS === 'true' &&
    Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.ORDER_ALERT_EMAIL && env.SANDBOX_TEST_EMAILS);
}

export function allowedSandboxEmail(email, env = process.env) {
  if (!emailOK(email)) return false;
  const allowed = String(env.SANDBOX_TEST_EMAILS || '')
    .split(',').map(normalize).filter(Boolean);
  return allowed.includes(normalize(email));
}

function htmlEscape(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function orderKey(provider, orderId) {
  if (!['stripe', 'paypal'].includes(provider) || !/^[A-Za-z0-9_-]{8,255}$/.test(orderId))
    throw Error('Invalid sandbox order reference');
  return `${STORE_PREFIX}${provider}/${orderId}`;
}

async function resendSend({ to, subject, html, text, idempotencyKey }, env = process.env) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
      reply_to: 'info@wardenclyffefirm.com',
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.id) throw Error('Transactional email provider rejected the message');
  return result.id;
}

/**
 * @param {object} order - trusted information from a VERIFIED payment provider (never browser input)
 * @param {object} options - dependency injection for automated tests
 */
export async function notifyVerifiedSandboxOrder(order, { env = process.env, store, send = resendSend } = {}) {
  if (env.PAYMENTS_MODE !== 'sandbox' || order?.livemode !== false)
    throw Error('Live payments are not supported by this workflow');
  if (order?.sku !== SAMPLE.sku || order?.amount !== SAMPLE.amount ||
      normalize(order?.currency) !== SAMPLE.currency)
    throw Error('Unsupported product, currency, or payment amount');
  if (!allowedSandboxEmail(order.customerEmail, env))
    return { status: 'sandbox_email_not_allowlisted', emailed: false };
  if (env.ENABLE_SANDBOX_EMAILS !== 'true')
    return { status: 'email_notifications_disabled', emailed: false };
  if (!emailsConfigured(env)) throw Error('Notification configuration incomplete');
  if (!emailOK(env.ORDER_ALERT_EMAIL) || !emailOK(env.RESEND_FROM_EMAIL.replace(/^.*<([^<>]+)>$/, '$1')))
    throw Error('Invalid email sender or recipient');

  const key = orderKey(order.provider, order.orderId);
  if (!store) {
    // Lazy import keeps the module's validation and tests independent of Netlify's runtime.
    const { getStore } = await import('@netlify/blobs');
    store = getStore(ORDER_STORE);
  }
  const existing = await store.get(key, { type: 'json', consistency: 'strong' });
  if (existing?.status === 'notifications_sent') return { status: 'already_notified', emailed: true };
  const record = existing || {
    provider: order.provider,
    providerOrderId: order.orderId,
    sku: SAMPLE.sku,
    customerEmail: normalize(order.customerEmail),
    amount: SAMPLE.amount,
    currency: SAMPLE.currency,
    paidAt: new Date().toISOString(),
    status: 'payment_verified',
    documentStatus: 'sandbox_no_document_due',
    fulfillmentRequired: false,
    locale: order.locale === 'es' ? 'es' : 'en',
  };
  if (!existing) await store.setJSON(key, record, { onlyIfNew: true });

  const customer = normalize(order.customerEmail);
  const details = { orderId: order.orderId, customerEmail: customer, locale: order.locale === 'es' ? 'es' : 'en' };
  const internalPage = (env.APP_BASE_URL || 'https://wardenclyffe-preview.netlify.app').replace(/\/$/, '') + '/pages/order-management.html';
  const customerHTML = renderCustomerEmail(details);
  const officeHTML = renderOfficeEmail(details, internalPage);
  // Deterministic keys deduplicate repeated webhook deliveries at the email provider.
  await send({
    to: customer,
    subject: customerSubject(details.locale),
    html: customerHTML,
    text: customerPlain(details),
    idempotencyKey: `warden-${order.provider}-${order.orderId}-customer`,
  }, env);
  await send({
    to: normalize(env.ORDER_ALERT_EMAIL),
    subject: officeSubject(details.locale),
    html: officeHTML,
    text: officePlain(details),
    idempotencyKey: `warden-${order.provider}-${order.orderId}-office`,
  }, env);
  await store.setJSON(key, { ...record, status: 'notifications_sent', notifiedAt: new Date().toISOString() });
  return { status: 'notifications_sent', emailed: true };
}
