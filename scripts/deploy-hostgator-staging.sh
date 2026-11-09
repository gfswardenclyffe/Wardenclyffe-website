#!/usr/bin/env bash
# Wardenclyffe cPanel deployment: ONLY the protected staging directory.
set -euo pipefail

STAGING_ROOT="/home2/gfrancossh/public_html/wardenclyffe-staging"
AUTH_FILE="$STAGING_ROOT/.htaccess"

# Never deploy if staging is missing or authentication has been changed.
if [[ ! -d "$STAGING_ROOT" || ! -f "$AUTH_FILE" ]] ||
   ! grep -q '^AuthType Basic' "$AUTH_FILE" ||
   ! grep -q '^Require valid-user' "$AUTH_FILE" ||
   ! grep -q '^ErrorDocument 401' "$AUTH_FILE"; then
  echo "ABORT: private staging authentication is missing." >&2
  exit 1
fi

# Ensure the HostGator static deployment cannot start payment checkouts.
if ! grep -Fq 'paymentsEnabled:false' src/commerce-config.js ||
   ! grep -Fq 'const paymentsEnabled=window.WARDEN_COMMERCE?.paymentsEnabled===true;' src/commerce.js; then
  echo "ABORT: payment safety configuration has changed." >&2
  exit 1
fi

# Fail closed if source folders contain symlinks or server-side code.
if find assets data pages src -type l -print -quit | grep -q . ||
   find assets data pages src -type f \( -name '*.php' -o -name '*.phtml' -o -name '.htaccess' -o -name '.env' \) -print -quit | grep -q .; then
  echo "ABORT: unexpected executable, configuration, or symlink file." >&2
  exit 1
fi

# Only publish the static website. Never deploy Git metadata, Netlify functions,
# internal staff/order pages, repository docs, or the cPanel password file.
for file in index.html 404.html; do
  test -f "$file"
  /bin/cp -f "$file" "$STAGING_ROOT/$file"
done
for directory in assets data pages src; do
  test -d "$directory"
  /bin/mkdir -p "$STAGING_ROOT/$directory"
  /bin/cp -R "$directory/." "$STAGING_ROOT/$directory/"
done

# Exclude server-dependent and internal operational pages.
for file in checkout-return.html order-management.html; do
  /bin/rm -f "$STAGING_ROOT/pages/$file"
done

# Preview pages must not be indexed. Production configuration comes later.
for html in "$STAGING_ROOT/index.html" "$STAGING_ROOT/404.html" "$STAGING_ROOT"/pages/*.html; do
  if ! grep -qi 'name="robots"' "$html"; then
    /usr/bin/perl -0777 -i -pe 's/(<head\b[^>]*>)/$1<meta name="robots" content="noindex,nofollow,noarchive">/i' "$html"
  fi
done

# Apache must be able to serve CSS/JS/HTML; preserve cPanel's auth .htaccess.
find "$STAGING_ROOT" -type d -exec /bin/chmod 755 {} +
find "$STAGING_ROOT" -type f ! -name '.htaccess' -exec /bin/chmod 644 {} +

echo "Wardenclyffe staging deployed. Live WordPress was not modified."
