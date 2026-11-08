# Wardenclyffe Order Desk — Sandbox Operations (Phase 1)

The private Order Desk is a sandbox-only management system. It can list verified $1 tests, track customer/internal notifications, and record administrative review status and notes. It DOES NOT deliver files, process real customers, or create legal engagements.

## Set up the private staff token

On Netlify > wardenclyffe-preview > Project configuration > Environment variables, add:

- Key: OMS_ADMIN_TOKEN
- Value: generate a random 64-character hexadecimal string using a secure password generator, or run "openssl rand -hex 32" on your own computer.
- Mark as secret; enable the Functions scope, in Production context.
- Do not share it in chat, screenshots, code, or public links. Do not reuse any Stripe or Resend key.

Visit https://wardenclyffe-preview.netlify.app/pages/order-management.html and paste that private token in the access form. This is a temporary single-token gate only, suitable for non-sensitive sandbox test records. It is NOT suitable production authentication, and tokens are not stored in browser localStorage or URLs.

## Use

- Complete a NEW Stripe sandbox $1 payment to generate the newly designed bilingual emails and a new order entry.
- The customer receives a professional payment confirmation, with an explicit sandbox disclaimer.
- The internal operations mailbox receives a detailed notification with a link to the private Order Desk.
- The Order Desk shows customer address, payment reference, date, email status, and workflow stage.
- Change New → Reviewing → Validated → Closed to simulate internal review; save an optional note.
- No document uploads, email resends, or fulfillment occur from the console.
- Previously sent emails will not be reissued: Resend idempotency remains in place.

## Next production phase — not built

Replace the access token with MFA and role-based staff authentication. Use a transactional database (Netlify DB or equivalent) rather than Blobs for real orders, staff concurrency, payments, and fulfillment events. Add authorized professional review, secure uploads and malware scans, encrypted private storage, expiring delivery links, role-scoped downloads, delivery proofs, retention controls, refunds/chargebacks, failed email retries, audit logs, and carefully scoped jurisdiction-specific product terms.

Test credit card credentials exposed earlier in the conversation must be rotated before switching to live mode.
