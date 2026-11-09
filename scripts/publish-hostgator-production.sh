#!/usr/bin/env bash
# Wardenclyffe manual production release; never run from cron or cPanel Git deployment.
# Usage: bash scripts/publish-hostgator-production.sh check|publish|rollback
set -euo pipefail
MODE="$1"
HOME_ROOT="/home2/gfrancossh"
REPO="$HOME_ROOT/wardenclyffe-website-git"
WEB="$HOME_ROOT/public_html"
SAVE="$HOME_ROOT/wardenclyffe-production-backup"
GIT="/usr/local/cpanel/3rdparty/lib/path-bin/git"
case "$MODE" in check|publish|rollback) ;; *) echo "Usage: $0 check|publish|rollback" >&2; exit 2 ;; esac

if [[ ! -d "$WEB/wp-admin" || ! -f "$WEB/wp-config.php" || ! -f "$WEB/index.php" ]]; then
  echo "ABORT: expected legacy WordPress files missing" >&2; exit 1
fi
if [[ "$MODE" == rollback ]]; then
  if [[ ! -f "$SAVE/.release-marker" || ! -f "$SAVE/original.htaccess" ]]; then
    echo "ABORT: no saved managed release to roll back" >&2; exit 1
  fi
  cp -p "$SAVE/original.htaccess" "$WEB/.htaccess"
  rm -f "$WEB/index.html" "$WEB/404.html"
  echo "WordPress homepage restored. Static folders left in place for later safe cleanup."
  exit 0
fi

if [[ ! -f "$HOME_ROOT/wardenclyffe-htaccess-prelaunch-20261109.bak" ]] ||
   [[ ! -f "$WEB/wardenclyffe-staging/.htaccess" ]] ||
   ! grep -q '^AuthType Basic' "$WEB/wardenclyffe-staging/.htaccess"; then
  echo "ABORT: WordPress or protected staging backup is missing" >&2; exit 1
fi
if [[ "$("$GIT" -C "$REPO" branch --show-current)" != "main" ||
      -n "$("$GIT" -C "$REPO" status --porcelain)" ]]; then
  echo "ABORT: source repository not clean on main" >&2; exit 1
fi
for item in index.html 404.html assets data pages src; do
  if [[ ! -e "$REPO/$item" ]]; then echo "ABORT: source missing $item" >&2; exit 1; fi
  if [[ -e "$WEB/$item" ]]; then echo "ABORT: unexpected live path exists: $item" >&2; exit 1; fi
done
if [[ -e "$SAVE" ]]; then echo "ABORT: existing production release backup" >&2; exit 1; fi
if ! grep -Fq 'paymentsEnabled:false' "$REPO/src/commerce-config.js" ||
   ! grep -Fq 'const paymentsEnabled=window.WARDEN_COMMERCE?.paymentsEnabled===true;' "$REPO/src/commerce.js"; then
  echo "ABORT: checkout safety conditions not met" >&2; exit 1
fi
for policy in terms privacy cookies; do
  if grep -Eqi 'working draft|Draft for legal and technical review|policy-translation-disclaimer|name="robots" content="noindex' "$REPO/pages/$policy.html"; then
    echo "ABORT: $policy policy not yet approved for publication" >&2; exit 1
  fi
done
if find "$REPO/assets" "$REPO/data" "$REPO/pages" "$REPO/src" -type l -print -quit | grep -q .; then
  echo "ABORT: symlink in public website source" >&2; exit 1
fi
if [[ "$MODE" == check ]]; then
  echo "PASS: production preflight. No files changed."
  "$GIT" -C "$REPO" rev-parse --short HEAD
  exit 0
fi

# Explicit manual 'publish' only: preserve WordPress and its existing routing.
mkdir "$SAVE"
cp -p "$WEB/.htaccess" "$SAVE/original.htaccess"
"$GIT" -C "$REPO" rev-parse HEAD > "$SAVE/.release-marker"
for item in index.html 404.html; do cp "$REPO/$item" "$WEB/$item"; done
for item in assets data pages src; do
  mkdir "$WEB/$item"
  cp -R "$REPO/$item/." "$WEB/$item/"
done
rm -f "$WEB/pages/checkout-return.html" "$WEB/pages/order-management.html"
for item in assets data pages src; do
  find "$WEB/$item" -type d -exec chmod 755 {} +
  find "$WEB/$item" -type f ! -name '.htaccess' -exec chmod 644 {} +
done
chmod 644 "$WEB/index.html" "$WEB/404.html"
TMP="$(mktemp "$HOME_ROOT/.wardenclyffe-routing-XXXXXXXX")"
cat > "$TMP" <<'RULES'
# BEGIN Wardenclyffe manual static publication
DirectoryIndex index.html index.php
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^about/?$ /pages/about.html [R=302,L,NE]
RewriteRule ^about-2/?$ /pages/about.html [R=302,L,NE]
RewriteRule ^services/?$ /pages/services.html [R=302,L,NE]
RewriteRule ^our-locations/?$ /pages/contact.html [R=302,L,NE]
RewriteRule ^privacy-policy/?$ /pages/privacy.html [R=302,L,NE]
RewriteRule ^terms-and-conditions-of-service/?$ /pages/terms.html [R=302,L,NE]
</IfModule>
# END Wardenclyffe manual static publication
RULES
cat "$SAVE/original.htaccess" >> "$TMP"
chmod 644 "$TMP"
cp "$TMP" "$WEB/.htaccess"
rm -f "$TMP"
echo "PUBLISHED: static homepage and approved public files. Old WordPress remains installed."
echo "Redirects are temporarily 302 for verification."
echo "To roll back: bash $REPO/scripts/publish-hostgator-production.sh rollback"
