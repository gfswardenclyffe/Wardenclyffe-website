# Wardenclyffe Payment Sandbox (not production)

**This is intentionally test-only.** It cannot charge live cards: the Worker refuses any mode other than `sandbox` and requires Stripe keys beginning with `sk_test_`. The only server-side SKU is `sandbox-demo`, a $1.00 *test transaction* that delivers a plain text **non-legal sample** after verification. No actual contract templates are published or charged for.

## Architecture

- GitHub Pages hosts the public, static UI only.
- Cloudflare Worker handles sandbox checkout endpoints. Do **not** put API secrets in GitHub Pages HTML/JS.
- Cloudflare D1 records each order and enforces one-way fulfillment status.
- Stripe-hosted Checkout provides cards and eligible wallets (including Apple Pay / Google Pay where supported); the Worker validates the signed `checkout.session.completed` webhook and verifies `payment_status=paid` and the order amount.
- PayPal Sandbox creates and captures an order server-side; the Worker verifies its capture details before fulfillment.
- Resend sends a single email with the **sandbox sample** attached. The email uses an idempotency key to reduce duplicate fulfillment.
- Later, **approved jurisdiction-specific documents** can be held in a private Cloudflare R2 bucket and delivered as email attachments after purchase. That product registry is deliberately absent until documents are reviewed and published.

## Setup (nothing enabled automatically)

1. Create a Cloudflare account and a D1 database: `wrangler d1 create wardenclyffe-orders-sandbox`.
2. Copy `wrangler.example.toml` to `wrangler.toml` and replace `database_id`. The example intentionally excludes credentials and real IDs. Make sure `FRONTEND_BASE_URL` is your real GitHub Pages URL, and `ALLOWED_ORIGIN` is its browser origin (e.g. `https://gfswardenclyffe.github.io`).
3. `npm install`, then `npm run db:init` after authenticating with Cloudflare.
4. Configure the secrets with `wrangler secret put` for `STRIPE_SECRET_KEY` (**sk_test_... only**), `STRIPE_WEBHOOK_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM` (a verified sender domain). Never commit actual secrets.
5. Deploy the Worker using `npm run deploy` and configure Stripe's sandbox webhook destination to `https://YOUR-WORKER.workers.dev/api/webhooks/stripe`. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
6. In `src/commerce-config.js`, set `apiBase` to the Worker HTTPS URL and `mode` to `sandbox`. Keep `paymentsEnabled:false` for live products. The UI's payment buttons then redirect to **$1.00 test-only demo checkout**, not the selected contract.
7. Test a Stripe sandbox card and PayPal sandbox account. Confirm D1 status and a single Resend sample attachment. Test failure/retry and duplicate-event behavior.

## Before selling real documents

- Review and approve actual legal templates for each jurisdiction and service scope. Upload only authorized documents to private storage; never commit client documents or private templates to GitHub.
- Define refunds, delivery terms, taxes/VAT, merchant-of-record entity, currency, disputes, customer receipts, privacy retention, and professional-eligibility/conflicts checks.
- Build a server-owned real SKU/price inventory that authorizes checkout only for products with a reviewed, deliverable document. Separate instant downloads from professional drafting/review engagements.
- Implement stronger production access control and monitored webhook retries; extend from sandbox to live mode only after end-to-end audits.
- Test mail delivery and provide a support route for undelivered files.

## API endpoints

| Endpoint | Purpose |
|---|---|
| `GET /health` | Check sandbox service without secrets |
| `POST /api/checkout/stripe` | Create test Stripe Checkout Session |
| `POST /api/webhooks/stripe` | Verify Stripe signature, settled amount; send sample |
| `POST /api/checkout/paypal` | Create PayPal sandbox order |
| `POST /api/checkout/paypal/capture` | Verify PayPal capture; send sample |

The sample is **not a contract, legal advice, or a payable product**. The GitHub Pages site is safe to publish without the Worker: checkout remains an interactive nonpayment preview.
