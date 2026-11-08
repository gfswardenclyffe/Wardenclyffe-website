# Wardenclyffe — Payment Integration Lab (sandbox only)

The payment methods below are implemented as server-side **sandbox routes**, not merely front-end buttons. This repo never contains actual payment credentials or legal document templates. **No live transactions are enabled.**

### Supported sandbox flows

| Method | API route | Status and fulfillment | Test amount |
|---|---|---|---|
| Stripe cards / eligible Apple Pay and Google Pay | `/api/checkout/stripe` | Signed Stripe webhook, verifies paid order and USD amount | USD 1.00 |
| PayPal | `/api/checkout/paypal` | Server captures, then verifies completed payment and USD amount | USD 1.00 |
| Openpay México hosted card | `/api/checkout/openpay/card` | Redirect to Openpay; Basic-authenticated webhook AND independent charge retrieval | MXN 10.00 |
| Openpay México SPEI | `/api/checkout/openpay/spei` | Openpay issues a test CLABE/reference, waits for verified completed charge | MXN 10.00 |
| Chase direct transfer | `/api/checkout/bank` (`bank: chase`) | Creates pending USD order; authorized staff manually matches cleared transfer in bank ledger | USD 1.00 |
| BBVA direct transfer | `/api/checkout/bank` (`bank: bbva`) | Creates pending MXN order; authorized staff manually matches cleared transfer in bank ledger | MXN 10.00 |

The only purchasable sandbox SKU is `sandbox-demo` for a **plain-text, nonlegal sample attachment**. The actual contract shown in Shop is never charged or sent. The `test mode` price and currency must be displayed clearly.

### Set up in your private Cloudflare account

1. Install Node 20+ and `npm install` from this `payment-worker` directory. Authenticate: `npx wrangler login`.
2. Create D1: `npx wrangler d1 create wardenclyffe-orders-sandbox`. Copy `wrangler.example.toml` to an untracked `wrangler.toml` and insert its D1 ID.
3. Create tables: `npm run db:init`. This creates `orders`, `bank_reconciliations` and `webhook_verifications`.
4. Add secrets individually with `npx wrangler secret put NAME` (never share secrets in ChatGPT, GitHub, or screenshots). Required base secrets are `RESEND_API_KEY`, `RESEND_FROM`. Stripe: `STRIPE_SECRET_KEY` beginning `sk_test_` and `STRIPE_WEBHOOK_SECRET`. PayPal: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` from **Sandbox**. Openpay: `OPENPAY_MERCHANT_ID`, `OPENPAY_PRIVATE_KEY` (sandbox `sk_...`), `OPENPAY_WEBHOOK_USER`, `OPENPAY_WEBHOOK_PASSWORD`. Direct bank transfer reconciliation: `BANK_RECONCILIATION_TOKEN` (random, secret). Never store actual Chase/BBVA account or CLABE numbers in public source.
5. In `wrangler.toml` use `PAYMENTS_MODE = "sandbox"`, `ALLOWED_ORIGIN = "https://wardenclyffe-preview.netlify.app"`, and `FRONTEND_BASE_URL = "https://wardenclyffe-preview.netlify.app"`.
6. Deploy: `npm run deploy`. Save the Worker HTTPS URL. Check `/health`, which always reports `livePayments:false`.
7. In Stripe's test/sandbox account, register `https://WORKER.workers.dev/api/webhooks/stripe` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Record `whsec_...` privately in Worker secrets.
8. In Openpay México's *sandbox* dashboard, register `https://WORKER.workers.dev/api/webhooks/openpay` with HTTP Basic authentication using the chosen webhook user and password. Enable `charge.succeeded` and `verification`. Openpay sends a verification code: retrieve via the private D1 table `webhook_verifications`, then enter it in the Openpay dashboard. Do not expose that code in your website. Openpay sandbox API host: `sandbox-api.openpay.mx`.
9. Verify the `wardenclyffefirm.com` domain (or another sender domain you control) with Resend. Set `RESEND_FROM` to an authorized sender. Email is triggered **only after server-side payment verification**; the attached file is the nonlegal sandbox sample.
10. Update the public `src/commerce-config.js` with `apiBase:'https://WORKER.workers.dev', mode:'sandbox'`; **do not set live payments true**. GitHub → Netlify will deploy the UI. End-to-end test one provider at a time with real provider *test* accounts.

For demo-only review of the user interface, leave the `apiBase` empty: the checkout **walkthrough** explicitly simulates the steps without creating orders or sending emails.

### Manual Chase / BBVA transfers

The bank order endpoint creates a pending reference, but cannot confirm a bank transfer by itself. Chase and BBVA are **not hosted card gateways**; actual receiving bank instructions must be supplied through a verified channel after order creation. An authorized operator must reconcile cleared funds **in the bank ledger**, matching bank, reference, amount and currency, then invoke `POST /api/admin/bank/confirm` with the private bearer `BANK_RECONCILIATION_TOKEN`. Required JSON: `orderId`, `ledgerVerified:true`, `bankTransactionId` (unique), `bank` (`chase` or `bbva`), `currency` (`usd` or `mxn`), `amountMinor` (100 or 1000 test cents), and `reviewer`. This is a *manual operator process*; the code does not connect to Chase or BBVA APIs. The database uniquely records the bank transaction ID to prevent reuse. A screenshot/receipt submitted by a customer never triggers fulfillment.

### Security and production release gate

- Merchant credentials are server-only. The site never gathers card numbers and never authorizes a sale from a customer-supplied price.
- Enforce exact order ID, currency, amount, provider and completed status for third-party confirmations. Webhook retries and fulfillment are idempotent.
- Only reviewed, jurisdiction-appropriate legal document SKUs can eventually be authorized. PDFs must be kept in private storage and distributed after verified settlement.
- Production requires additional work: provisioned merchants, approval of individual legal products, validated tax and currency requirements, product-level refunds, chargeback handling, bank statement access controls, secure receipts, monitoring, webhook retry/runbook, privacy compliance, and real delivery tests. Do not switch this code to live mode without audit.

### Code tests

Run `npm test`. The tests include signature validation, Openpay hook authentication, checkout input safety, and manual reconciliation checks.
