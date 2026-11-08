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
