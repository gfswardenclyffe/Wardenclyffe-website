#!/usr/bin/env bash
# Reversible HostGator Wardenclyffe production cutover. WordPress files are preserved.
set -euo pipefail
umask 077
MODE="${1:-}"
DOCROOT="/home2/gfrancossh/public_html"
RELEASE_NAME="wardenclyffe-release-20261110"
RELEASE="$DOCROOT/$RELEASE_NAME"
BACKUPS="/home2/gfrancossh/wardenclyffe-production-backups"
ACTIVE="$BACKUPS/active-rollback-path"
HT="$DOCROOT/.htaccess"
abort(){ echo "ABORT: $*" >&2; exit 1; }
case "$MODE" in prepare|activate|rollback) ;; *) abort "usage: $0 prepare|activate|rollback";; esac
[[ -d "$DOCROOT" && ! -L "$DOCROOT" ]] || abort "HostGator docroot is not as expected"
[[ -d "$DOCROOT/wardenclyffe-staging" && -f "$DOCROOT/wardenclyffe-staging/.htaccess" ]] || abort "Protected staging not found"
if [[ "$MODE" == prepare ]]; then
 [[ ! -e "$ACTIVE" && ! -e "$RELEASE" ]] || abort "Production release already present; do not overwrite"
 [[ -f src/commerce-config.js && -f src/commerce.js ]] || abort "Commerce checks missing"
 grep -Fq 'paymentsEnabled:false' src/commerce-config.js || abort "Payments must stay disabled"
 grep -Fq 'const paymentsEnabled=window.WARDEN_COMMERCE?.paymentsEnabled===true;' src/commerce.js || abort "Payment safety gate mismatch"
 for file in index.html 404.html robots.txt sitemap.xml es/index.html fr/index.html zh/index.html \
 pages/about.html pages/services.html pages/work.html pages/shop.html pages/contact.html \
 pages/terms.html pages/privacy.html pages/cookies.html src/living-field.js \
 src/original-dot-chapters.js src/luminous-lake-green.js src/living-precision-public.js; do
   [[ -s "$file" ]] || abort "Missing required file: $file"
 done
 for page in index.html es/index.html fr/index.html zh/index.html; do
   grep -Fq 'luminous-lake-green.js?v=20261110-public1' "$page" || abort "Missing lake in $page"
   grep -Fq 'original-dot-chapters.js?v=20261110-public1' "$page" || abort "Missing dots in $page"
   grep -Fq 'living-precision-public.js?v=20261110-public1' "$page" || abort "Missing precision in $page"
 done
 if find assets data pages src es fr zh -type l -print -quit | grep -q .; then abort "Unexpected symlink in source"; fi
 if find assets data pages src es fr zh -type f \( -name '*.php' -o -name '*.phtml' -o -name '.htaccess' -o -name '.env' \) -print -quit | grep -q .; then
  abort "Unexpected executable/config file in static source"
 fi
 mkdir -p "$RELEASE"
 echo 'Require all denied' > "$RELEASE/.htaccess"
 for file in index.html 404.html robots.txt sitemap.xml; do cp -p "$file" "$RELEASE/$file"; done
 for dir in assets data pages src es fr zh; do mkdir -p "$RELEASE/$dir"; cp -R "$dir/." "$RELEASE/$dir/"; done
 find "$RELEASE/src" -maxdepth 1 -type f -name 'staging-*' -delete
 rm -f "$RELEASE/pages/checkout-return.html" "$RELEASE/pages/order-management.html"
 [[ -s "$RELEASE/src/original-dot-chapters.js" && -s "$RELEASE/src/luminous-lake-green.js" ]] || abort "Public animation assets missing"
 find "$RELEASE" -type d -exec chmod 755 {} +
 find "$RELEASE" -type f -exec chmod 644 {} +
 echo "PREPARED: new site copied to a protected release folder, WordPress untouched."
 echo "Take a FULL cPanel backup of WordPress FILES AND DATABASE before activation."
 exit 0
fi
if [[ "$MODE" == activate ]]; then
 [[ "${WORDPRESS_BACKUP_CONFIRMED:-}" == YES ]] || abort "Make full cPanel files + database backup first, then export WORDPRESS_BACKUP_CONFIRMED=YES"
 [[ ! -e "$ACTIVE" ]] || abort "Already activated; rollback first"
 [[ -f "$HT" && -f "$DOCROOT/wp-config.php" && -f "$DOCROOT/index.php" ]] || abort "Existing WordPress installation differs from expected; inspect manually"
 [[ -s "$RELEASE/index.html" && -s "$RELEASE/src/luminous-lake-green.js" ]] || abort "Run prepare before activate"
 grep -Fxq 'Require all denied' "$RELEASE/.htaccess" || abort "Release isn't protected as expected"
 grep -Fq '# BEGIN WARDENCLYFFE PUBLIC RELEASE' "$HT" && abort "Routing already active"
 mkdir -p "$BACKUPS"
 backup="$BACKUPS/$(date -u +%Y%m%dT%H%M%SZ)"
 mkdir -p "$backup"
 cp -p "$HT" "$backup/original-root.htaccess"
 echo "$backup" > "$ACTIVE"
 cat > "$backup/new-routes.htaccess" <<'APACHE'
# BEGIN WARDENCLYFFE PUBLIC RELEASE
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^wardenclyffe-release-20261110(?:/|$) - [L]
RewriteRule ^wardenclyffe-staging(?:/|$) - [L]
RewriteRule ^wp-admin(?:/|$) - [L]
RewriteRule ^wp-content(?:/|$) - [L]
RewriteRule ^wp-includes(?:/|$) - [L]
RewriteRule ^wp-login\.php$ - [L]
RewriteRule ^xmlrpc\.php$ - [L]
RewriteRule ^\.well-known(?:/|$) - [L]
RewriteRule ^about/?$ /pages/about.html [R=301,L]
RewriteRule ^services/?$ /pages/services.html [R=301,L]
RewriteRule ^our-locations/?$ /pages/contact.html [R=301,L]
RewriteRule ^terms-and-conditions-of-service/?$ /pages/terms.html [R=301,L]
RewriteRule ^privacy-policy/?$ /pages/privacy.html [R=301,L]
RewriteRule ^cookie-policy/?$ /pages/cookies.html [R=301,L]
RewriteRule ^(.*)$ /wardenclyffe-release-20261110/$1 [L]
</IfModule>
# END WARDENCLYFFE PUBLIC RELEASE
APACHE
 cat "$backup/new-routes.htaccess" "$backup/original-root.htaccess" > "$backup/new-root.htaccess"
 rm -f "$RELEASE/.htaccess"
 cp "$backup/new-root.htaccess" "$DOCROOT/.htaccess.wardenclyffe-pending"
 chmod 644 "$DOCROOT/.htaccess.wardenclyffe-pending"
 mv -f "$DOCROOT/.htaccess.wardenclyffe-pending" "$HT"
 echo "ACTIVATED: new site routed at root; WordPress files and database still present."
 echo "Check HTTPS, homepage, all languages, policies and old URL redirects immediately."
 echo "ROLLBACK: bash scripts/deploy-hostgator-production.sh rollback"
 exit 0
fi
[[ -s "$ACTIVE" ]] || abort "No active rollback record found"
backup="$(cat "$ACTIVE")"
case "$backup" in "$BACKUPS/"*) ;; *) abort "Invalid rollback record";; esac
[[ -s "$backup/original-root.htaccess" ]] || abort "Original routing backup not found"
cp -p "$backup/original-root.htaccess" "$DOCROOT/.htaccess.wardenclyffe-rollback"
mv -f "$DOCROOT/.htaccess.wardenclyffe-rollback" "$HT"
echo 'Require all denied' > "$RELEASE/.htaccess"
chmod 644 "$RELEASE/.htaccess"
rm -f "$ACTIVE"
echo "ROLLED BACK: original WordPress routing restored."
