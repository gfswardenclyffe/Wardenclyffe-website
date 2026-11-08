import { createHmac, timingSafeEqual } from 'node:crypto';
import { SAMPLE, respond } from './_shared/common.mjs';
import { notifyVerifiedSandboxOrder } from './_shared/sandbox-notifications.mjs';

export function signatureValid(raw, header, secret, now = Math.floor(Date.now() / 1000)) {
  if (!header || !secret) return false;
  const parts = header.split(',').map(x => x.trim().split('=', 2));
  const timestamp = Number(parts.find(x => x[0] === 't')?.[1]);
  const signatures = parts.filter(x => x[0] === 'v1').map(x => x[1]);
  if (!Number.isInteger(timestamp) || Math.abs(now - timestamp) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
  return signatures.some(value => typeof value === 'string' &&
    value.length === expected.length &&
    timingSafeEqual(Buffer.from(value, 'utf8'), Buffer.from(expected, 'utf8')));
}

export default async req => {
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);
  if (process.env.PAYMENTS_MODE !== 'sandbox' || !process.env.STRIPE_WEBHOOK_SECRET)
    return respond({ error: 'Stripe sandbox webhook not configured' }, 503);
  const raw = await req.text();
  if (raw.length > 300000) return respond({ error: 'Event too large' }, 413);
  if (!signatureValid(raw, req.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET))
    return respond({ error: 'Invalid signature' }, 400);
  let event;
  try { event = JSON.parse(raw); } catch { return respond({ error: 'Malformed event' }, 400); }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type))
    return respond({ received: true, relevant: false });

  const session = event.data?.object;
  const paid = session?.livemode === false &&
    /^cs_test_/.test(session?.id || '') && session?.payment_status === 'paid' &&
    session?.amount_total === SAMPLE.amount &&
    String(session?.currency).toLowerCase() === SAMPLE.currency &&
    session?.metadata?.sku === SAMPLE.sku && session?.metadata?.test_only === 'true';
  if (!paid) return respond({ received: true, paid: false });

  const customerEmail = session.customer_details?.email || session.customer_email;
  try {
    const result = await notifyVerifiedSandboxOrder({
      provider: 'stripe', orderId: session.id, customerEmail,
      sku: SAMPLE.sku, amount: SAMPLE.amount, currency: SAMPLE.currency, livemode: false,
      locale: session.metadata?.locale === 'es' ? 'es' : 'en',
    });
    return respond({ received: true, paid: true, notifications: result.status, fulfillment: 'disabled_pending_document_approval', documentDelivery: 'disabled' });
  } catch (error) {
    console.error('Verified sandbox payment notification:', String(error.message || error));
    // For a configured webhook, return a retriable failure instead of falsely acknowledging email delivery.
    return respond({ error: 'Verified payment recorded; notification retry required' }, 503);
  }
};
