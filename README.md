# Wardenclyffe — A Living Field of Ideas (v4.5)

Static GitHub Pages site with one immersive Living Tree homepage and four interactive sections: **Services, Work, Shop, Contact**.

## What works now
- Original living-cell animations on all pages.
- Services: Consultancy, Business, Cybersecurity & Encryption, UX & Digital Experiences.
- Work: six confidentiality-conscious types of representative work.
- Shop: 15 proposed contracts filtered by U.S., Mexico, or Europe, category; draft prices; three purchase paths (template, customization, review); working checkout preview and gateway choices.
- Contact: email-draft inquiry with preset topic.
- Shared deep-teal footer with existing legal-policy links.

**No live payments or actual document fulfillment.** All draft prices require business/legal approval and each product requires validated jurisdiction-specific materials.

## Payments sandbox (separate deployment)

The `payment-worker` folder holds a Cloudflare Worker for **Stripe test Checkout**, **PayPal Sandbox**, D1 orders and verified email attachment delivery via Resend. The GitHub Pages UI is configured in preview mode by default. Full setup is documented in `payment-worker/README.md`. The only server SKU is `sandbox-demo`, a $1.00 virtual test transaction delivering a plain text sample explicitly marked **not a legal contract**. No live-charge credentials are accepted. Never commit secrets.

## Preview

Serve the repository over HTTP locally, or use GitHub Pages (Settings → Pages → main / root). As a static site it does not need a build step. Configure payment backend separately when ready.

## Privacy

Do not upload client material or approved legal templates to public GitHub. The pages do not send user data to a server; the Contact inquiry composer creates a mailto draft. Actual payment processing will require the verified server, reviewed policies and domain/email configuration.

## Legal & privacy pages (V4.6 draft)

`pages/terms.html`, `pages/privacy.html`, and `pages/cookies.html` reproduce the supplied November 8, 2026 policy document. All three pages are marked `noindex,nofollow` and visibly `Draft for legal and technical review` until checked against deployed services and jurisdictional requirements. The cookie notice and preference manager are working on every page; `src/cookie-consent.js` records a local first-party preference only. **No optional analytics or marketing trackers are included or activated by the current site.** If added later, those scripts must be loaded only after applicable affirmative consent, and the cookie disclosures must be updated. The site has a dynamic decorative starling flock with a reduced-motion fallback.

To switch the legal page URLs to public final policies, remove the draft note and noindex only after review and approval; confirm that payment services, email delivery, analytics, advertising, and third-party embeds match disclosures. The live main-domain policy URLs still exist separately; this project has not overwritten them.

## Checkout integration V4.8 (preview)

The Shop now contains six country-aware payment choices (Stripe, PayPal, Openpay cards, Openpay SPEI, Chase and BBVA transfers), plus DIY legal-filings concept cards. Clicking a contract opens a clear payment-method chooser and a **simulation-only checkout walkthrough**. With the public `src/commerce-config.js` left in preview mode, no account is charged and no message is emailed.

Real provider *sandbox* API routes, webhook checks, a D1 order ledger, and sample-document email delivery are in `payment-worker/`. See `payment-worker/README.md` for the safe deployment process. The public Netlify website is static, so a separate Worker and private credentials are required for actual sandbox transactions. There is no live legal contract fulfillment yet.


## V4.9 — simpler hosted test checkout
The Netlify deployment builds from `dist/` via `netlify.toml`. There is **no Cloudflare, Openpay, BBVA, or bank-transfer integration** in this checkout. All server secrets belong in Netlify UI environment variables, not in GitHub. See `netlify/PAYMENT_SETUP.md`. **No real contracts or real money are supported.**
