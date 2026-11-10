# Wardenclyffe public cutover — 2026-11-10

## Release scope
- Approved green Luminous Lake and original Tree / Warrior / Business / Starlings / Heart chapters, retaining the existing five-chapter auto sequence.
- Full public site (English, Spanish, French, Simplified Chinese), business pages, cookie controls, legal pages, and proposed catalog.
- Client payments remain disabled (`paymentsEnabled:false`). No real checkout, automated legal-service fulfillment or verified paid email delivery.
- Existing WordPress files, database, themes, and plugins are retained in `public_html`; static site served from `public_html/wardenclyffe-release-20261110/` after Apache routing changes.
- Existing private staging environment is left in place and excluded from crawlers.

## Prerequisites
1. Verify the live production `.htaccess` location and WordPress installation at `/home2/gfrancossh/public_html`. This script aborts if either differs.
2. **Create and download a complete HostGator backup** via cPanel Backup Wizard (all website files **and** MySQL WordPress database). Preserve backup off-host. Do not proceed if backup fails.
3. Confirm you have working HostGator SSH/cPanel access, can undo edits to `.htaccess`, and can resolve a temporary website outage if the host has custom rewrite rules.
4. Review unresolved legal-policy drafts/translated terms and licensure claims. Do not enable payments or promise automated services. Staging appearance alone is not legal/security QA.

## 1. Prepare an isolated release (does NOT affect public traffic)

```bash
cd /home2/gfrancossh/wardenclyffe-staging-dots-20261109
git fetch origin release/wardenclyffe-public-20261110
git worktree add --detach /home2/gfrancossh/wardenclyffe-public-20261110 FETCH_HEAD
cd /home2/gfrancossh/wardenclyffe-public-20261110
bash scripts/deploy-hostgator-production.sh prepare
```

The release is copied into a folder with access denied. Your WordPress homepage continues serving normally.

## 2. Explicitly activate production — ONLY after full HostGator backup

```bash
cd /home2/gfrancossh/wardenclyffe-public-20261110
WORDPRESS_BACKUP_CONFIRMED=YES bash scripts/deploy-hostgator-production.sh activate
```

This prepends reversible routing rules to the existing WordPress `.htaccess`. It does **not** delete or replace WordPress files or touch the database.

Immediately verify:
- Root `https://wardenclyffefirm.com/`, HTTPS, favicon, page metadata and navigation.
- Each of `/es/`, `/fr/`, `/zh/` and all five particle chapters, lake and performance.
- All `/pages/` business pages, contact, shop and policies; browser console and mobile layout.
- `/robots.txt` and `/sitemap.xml`; inspect Google Search Console only after live cutover.
- Legacy `/about/`, `/services/`, `/our-locations/`, `/terms-and-conditions-of-service/`, `/privacy-policy/` redirects.
- No real payments, no server-dependent checkout pages, and existing WordPress admin access if required.

## 3. Immediate rollback if any issue

```bash
cd /home2/gfrancossh/wardenclyffe-public-20261110
bash scripts/deploy-hostgator-production.sh rollback
```

Restores the byte-for-byte saved WordPress `.htaccess` (the public routing switch) and blocks the static release folder. WordPress files and database remain in place throughout.

## Important
The release script has NOT been executed on HostGator by ChatGPT. The website is **not** yet publicly migrated. The release is assembled on an isolated GitHub branch until HostGator activation is reported and verified. **Do not merge the release branch into `main` simply to deploy**: automated Netlify/GitHub Pages settings may differ from HostGator routing.

Once the migration succeeds, audit canonical indexing and old URL redirects; validate policy/SEO content and finish the manual release checklist.
