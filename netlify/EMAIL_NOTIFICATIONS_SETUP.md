# Wardenclyffe — first verified payment + two email notifications (SANDBOX ONLY)

The first test Stripe Checkout payment already works. This stage extends the **signed Stripe webhook** to:

1. Record the verified $1 sandbox payment in the private Netlify Blobs store `wardenclyffe-sandbox-orders`.
2. Send a test payment-confirmation email to the **allowlisted customer**.
3. Send a separate internal test notification to Wardenclyffe (`ORDER_ALERT_EMAIL`).
4. Mark the payment notifications as sent; duplicate webhook events are deduplicated using an order record and Resend idempotency keys.

**These emails do NOT attach or promise any contract.** No production orders or documents are supported. The real catalog will need reviewed legal templates, secure document storage, order queue, refunds/taxes, merchant disclosures, retention controls, and professional eligibility checks.

## 1. Check Stripe's transaction

In the Stripe Dashboard, select **Sandbox**, open **Transactions**, and check the $1 payment status is **Succeeded**. This verifies the initial checkout but not webhooks or email delivery.

## 2. Create a verified transactional email sender

Create a Resend account at https://resend.com and verify that you control `wardenclyffefirm.com` using the DNS entries specified in Resend. Choose a sender such as `Wardenclyffe <orders@wardenclyffefirm.com>` after domain verification. This does not have to be a mailbox but the domain must be authorized with Resend. Create an API key.

Set the following variables **privately** in Netlify > `wardenclyffe-preview` > Project configuration > Environment variables (mark secret values as secret):

| Variable | Value | Secret? |
|---|---|---|
| `PAYMENTS_MODE` | `sandbox` (already configured) | No |
| `APP_BASE_URL` | `https://wardenclyffe-preview.netlify.app` (already configured) | No |
| `STRIPE_SECRET_KEY` | Your rotated `sk_test_...` key (already configured) | **Yes** |
| `ENABLE_SANDBOX_EMAILS` | `true` | No |
| `SANDBOX_TEST_EMAILS` | Email addresses allowed to receive test confirmations, e.g. `gfs@wardenclyffefirm.com` | No |
| `RESEND_API_KEY` | Your `re_...` API key | **Yes** |
| `RESEND_FROM_EMAIL` | `Wardenclyffe <orders@wardenclyffefirm.com>` after verifying the domain | No |
| `ORDER_ALERT_EMAIL` | `info@wardenclyffefirm.com` (or another mailbox your team actually monitors) | No |
| `STRIPE_WEBHOOK_SECRET` | The **signing secret** beginning `whsec_` from the webhook created below | **Yes** |

Never put payment or email secrets in GitHub, client-side code, forms, screenshots or chat. Only sandbox emails on the explicit allowlist will be sent, to avoid public test checkout abuse.

## 3. Connect Stripe's signed event notification

In **Stripe Dashboard > Sandbox > Workbench > Webhooks** (or Developers > Webhooks in alternate dashboard layouts), create a test **event destination** with:

`https://wardenclyffe-preview.netlify.app/.netlify/functions/stripe-webhook`

Choose these event types:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Copy the endpoint's **signing secret** to `STRIPE_WEBHOOK_SECRET` in Netlify (not the Stripe API key). Deploy the project again to load the new environment variables.

## 4. Run a new $1 simulated payment

A payment made before the webhook was connected won't automatically be re-notified; make **a new sandbox test checkout** using an email in `SANDBOX_TEST_EMAILS`.

After paying with Stripe's published test card, verify:

- Stripe reports payment as **Succeeded**.
- Stripe webhook dashboard shows a successful **2xx** event delivery.
- The customer receives the **sandbox payment confirmation** email.
- The internal alert email receives **[SANDBOX] Wardenclyffe payment recorded**.
- In Netlify Function Logs there are no notification errors.

If the webhook fails, do not conclude a document was delivered. Stripe can retry non-2xx events. The function returns a retriable error when configured notifications fail.

## 5. PayPal follows as a separate step

PayPal sandbox already supports the $1 hosted payment / server-side capture verification. To test it, you will add `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` privately in Netlify, then log in using a PayPal **sandbox buyer** account.

PayPal webhook-based automatic notifications and production fulfillment are **not active** in this Stripe-focused release. Do not treat the PayPal return page alone as an internal order-fulfillment queue.

## Future real order workflow

Customer buys an approved jurisdiction-specific product -> gateway verifies payment (signed server event) -> private order record is created -> customer receives receipt and fulfillment ETA -> internal team receives `Action required: review/deliver [product]` -> approved document is retrieved or prepared -> customer receives document securely -> order is marked delivered. Records must have authenticated staff access, retry/error handling, and a production-grade transactional database. No confidential client matter should go into a public repository or email without suitable safeguards.
