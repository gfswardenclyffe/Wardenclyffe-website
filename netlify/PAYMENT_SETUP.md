# Wardenclyffe checkout — first real sandbox payment test

## What is implemented

- **Stripe Checkout**, hosted by Stripe, test mode only. Supported Apple Pay / Google Pay options appear when Stripe and the shopper's device/browser support them.
- **PayPal Orders V2**, sandbox order approval and capture. No PayPal password or card is collected by Wardenclyffe.
- **Stripe server-side status and signed webhook** checks. The return page verifies the Stripe Checkout Session using the server's secret key.
- **PayPal server-side capture**, verifying the purchased sandbox sample and amount.
- Spanish/English checkout language selector.
- Only a **$1 USD TEST** nonlegal sample, no real money, no real contracts or automatic email attachment.

There is **no** Openpay, BBVA, Chase transfer, Shopify, or live paid document delivery in this version. We can add fulfillment after a successful sandbox payment and reviewed legal-document inventory.

## Set up a first Stripe test on the existing Netlify site

1. Open <https://dashboard.stripe.com/> and choose **Sandbox / Test mode**, then locate the API secret key starting with `sk_test_` (not the publishable key).
2. In **Netlify > wardenclyffe-preview > Environment variables**, add these values, using the secret/private option for sensitive variables:
   - `PAYMENTS_MODE` = `sandbox`
   - `APP_BASE_URL` = `https://wardenclyffe-preview.netlify.app`
   - `STRIPE_SECRET_KEY` = your **Stripe test secret key**. *Do not paste it in a chat or commit it.*
3. Trigger a new Netlify deploy so runtime variables are available.
4. Open <https://wardenclyffe-preview.netlify.app/.netlify/functions/checkout-status>. You should see `{ "mode":true, "stripe":true, "paypal":false }` (or `paypal:true` if set up). This returns readiness flags only, not secret values.
5. Open the Shop, select a draft contract, choose **Template**, enter the jurisdiction and a test email, choose **Card / Stripe**, and click **Start $1 test checkout**. It will redirect to Stripe's test checkout; the sample product is **not** the displayed draft-priced contract.
6. Use Stripe's published test card `4242 4242 4242 4242` with a valid future expiry, any CVC and a valid postal code. You will return to Wardenclyffe's verification page, which queries Stripe on the server and reports **TEST PAYMENT VERIFIED** only if the payment is paid and the SKU/amount/currency match.
7. Confirm the test payment in **Stripe Dashboard > Test Payments**. No money moves; do not use a real card in test mode.

### Add verified Stripe webhooks (after first success)

Create a webhook destination in your Stripe **test** account:
`https://wardenclyffe-preview.netlify.app/.netlify/functions/stripe-webhook`
Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
Add `STRIPE_WEBHOOK_SECRET=whsec_...` privately in Netlify and redeploy. The webhook verifies HMAC signatures and test product/amount, but intentionally **does not email contracts** until legal products and fulfillment are approved.

## Test PayPal next

1. Open <https://developer.paypal.com/dashboard/applications/sandbox>, create or select a Sandbox REST app.
2. Put `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in Netlify's private environment variables. Leave `PAYMENTS_MODE=sandbox`.
3. Redeploy and verify `/ .netlify/functions/checkout-status` (without the space) shows `paypal:true`.
4. Choose PayPal in the checkout; you will be redirected to sandbox.paypal.com to approve a $1 test payment with a **PayPal personal sandbox buyer account**.
5. The return page sends the PayPal order ID to a server function, captures/looks up the order, and confirms payment only if the amount, currency and test SKU match. Verify it in your Sandbox business account.

## Security and launch boundaries

- Never share account passwords, security codes, `sk_test_`, `whsec_`, or PayPal Client Secret in GitHub or chat.
- The merchant payment methods operate only in sandbox mode. Live secret keys are rejected.
- Card entry happens on Stripe/PayPal, not on the Wardenclyffe site.
- The success URL does **not** by itself prove payment. The server queries the provider.
- Payment status is not authorization to send a client-specific legal document. This prototype deliberately has **no automatic fulfillment**.
- Automatic receipt and approved document email require a private catalog, merchant policies, transactional email account, persistent order records, and verified provider event/replay handling. Those are the next milestones.
