# Wardenclyffe — Publication Readiness / 2026-11-08

## Deployment status
- Netlify site `wardenclyffe-preview`: **publishing paused by team credit limits** (reported by Netlify UI). Existing deployment remains online; repository updates will not appear until the plan/cycle permits new production deployments.
- Source repository: `gfswardenclyffe/Wardenclyffe-website` main.
- Build: `npm run build` copies `index.html`, `pages/`, `src/`, `assets/`, `data/` into Netlify `dist/`, with functions in `netlify/functions/`.
- Do not copy this Netlify application directly to GitHub Pages: server-side Stripe verification, webhook signatures, order records, and private API keys need a compatible trusted backend.

## Public page inventory and language rollout
| Page | ES/FR/ZH interface | Important qualification |
|---|---|---|
| Home | Four-language selector, navigational labels and dynamic chapter captions | Check visual transitions and mobile typography |
| Our History / About | Narrative, timeline, founders | Use only the discreet Franco family reference; no individual founder names, specific timeline years or historical filing details |
| Services | Four disciplines, service items and calls to action | Verify individual licensure and geographic scope |
| Work | Featured categories and confidentiality notices | No named clients or confidential transactions without permission |
| Shop | Product catalog, legal directory, Texas notary, guided sandbox checkout | Templates not sold; notarial commissions not asserted |
| Contact | Calls to action, inquiry topics, form labels and privacy notices | Form invokes local email client only; no secure document intake |
| Terms | Multilingual interface, headings and navigation | Draft substantive translations are present in ES/FR/ZH but require professional legal review before publication |
| Privacy | Multilingual interface, headings and navigation | Draft substantive translations are present in ES/FR/ZH, verify actual tracking/processing and translate/review |
| Cookie Policy | Multilingual interface, headings and navigation | Draft substantive translations are present in ES/FR/ZH; verify actual third-party technology |
| Cookie consent | Multilingual controls and explanations | Confirm consent behavior by locale and screen size |
| Sandbox payment return | Multilingual page copy and some verification statuses | No real financial transactions |
| Order Desk | Translated visible labels and notes | Internal sandbox-only dashboard; dynamic server messages may remain English |
| 404 | Multilingual labels and home link | Verify 404 routing on Netlify |

A shared `lang=en|es|fr|zh` query parameter preserves navigation on public pages. The language selector uses the page URL, not a tracking cookie.

## Required before production release
1. **Deployment:** restore Netlify deployment availability and verify the newest SHA is marked Published. An uploaded/committed change is not live just because GitHub accepted it.
2. **Languages:** manually test main pages and menus at desktop and mobile widths in all four languages, including auto-changing homepage chapters, contact form, cookie modal, shop filters and sandbox checkout. Have a native or qualified reviewer approve translations; Chinese is Simplified Chinese.
3. **Legal policies:** complete professional translation and legal review of **every paragraph**, not just headings. Existing policies carry a `noindex,nofollow` directive and are explicitly marked draft; do not remove it until approved.
4. **Corporate history:** retain only symbolic timeline phases and the Franco family designation on public About pages. Do not publish individual founder names, specific dates, or filing references.
5. **Notary/legal services:** check Texas Secretary of State commission and authority before any notary marketing as available. Confirm attorney licenses, conflicts checks, jurisdiction, and representation limitations before offering legal services.
6. **Email:** verify SPF, DKIM, DMARC and Resend sender domain; test payment-confirmation and internal-alert delivery with real inboxes.
7. **Commerce:** keep Stripe/PayPal sandbox keys; do not activate real payments or legal-document delivery until product texts, pricing, refunds, terms, taxes, secure storage, fulfillment queue, and webhook handling are approved.
8. **Security:** confirm Netlify variables `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ORDER_ALERT_EMAIL`, and `OMS_ADMIN_TOKEN` remain server-only. Rotate any exposed secrets, disable former vendors' webhook destinations, and audit old user/team access.
9. **Operational workflow:** test paid → verified → customer confirmation → internal notification → review → approved delivery in a staging sandbox. Prevent duplicate webhooks and unauthorized dashboard updates.
10. **Final QA:** links, 404 behavior, accessibility, no horizontal overflow, keyboard operation, performance, browser consoles, mobile layout, HTTPS and domain DNS, cookie controls, sitemap/robots and published policy links.

## Launch gate
**NOT PUBLICATION READY YET.** The code and locale infrastructure can be reviewed from GitHub while Netlify deploys are paused. Do not advertise a fully translated legal agreement or accept live client orders until the required manual/legal verification is finished.

## Launch preparation update
- The multilingual and discreet family-history corrections were merged to `main` as `1dc9ffa`.
- Public About timeline now uses numbered symbolic phases without exact dates, filing history, or identifying individual founders.
- Commerce configuration remains sandbox with `paymentsEnabled:false`.
- Domain cutover to wardenclyffefirm.com has **not** been completed; validate successful Netlify deployment and working HTTPS before altering DNS.
- Older GitHub commits may still retain historical page contents; assess repository visibility and history separately from current page output.
