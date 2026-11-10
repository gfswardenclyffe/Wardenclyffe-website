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
if find assets data pages src es fr zh -type l -print -quit | grep -q . ||
   find assets data pages src es fr zh -type f \( -name '*.php' -o -name '*.phtml' -o -name '.htaccess' -o -name '.env' \) -print -quit | grep -q .; then
  echo "ABORT: unexpected executable, configuration, or symlink file." >&2
  exit 1
fi

# Only publish the static website. Never deploy Git metadata, Netlify functions,
# internal staff/order pages, repository docs, or the cPanel password file.
for file in index.html 404.html; do
  test -f "$file"
  /bin/cp -f "$file" "$STAGING_ROOT/$file"
done
for directory in assets data pages src es fr zh; do
  test -d "$directory"
  /bin/mkdir -p "$STAGING_ROOT/$directory"
  /bin/cp -R "$directory/." "$STAGING_ROOT/$directory/"
done

# The original warrior favicon is preserved on the live HostGator server.
# Keep the password-protected staging assets in sync without copying WordPress.
FAVICON_SOURCE="/home2/gfrancossh/public_html/assets/wardenclyffe-warrior-favicon.jpg"
if [[ -f "$FAVICON_SOURCE" ]]; then
  /bin/cp -f "$FAVICON_SOURCE" "$STAGING_ROOT/assets/wardenclyffe-warrior-favicon.jpg"
fi

# Exclude server-dependent and internal operational pages.
for file in checkout-return.html order-management.html; do
  /bin/rm -f "$STAGING_ROOT/pages/$file"
done

# STAGING-ONLY ART TEST: draw the exact dot sculptures from the two owner-
# supplied demos during Law (chapter 02) and Business (chapter 03).
# Original user-uploaded dot animations override Origin (chapter 01),
# Technology (chapter 04) and Living Heart (chapter 05 / Beyond) on staging ONLY.
# The new lighter-green Luminous Lake replaces the landscape canvas in staging only.
# Original homepage source, chapter art, captions and all live files stay intact.
# This script is inserted ONLY into protected copies after the HTML is copied.
for homepage in "$STAGING_ROOT/index.html" "$STAGING_ROOT/es/index.html" "$STAGING_ROOT/fr/index.html" "$STAGING_ROOT/zh/index.html"; do
  test -f "$homepage"
  if ! grep -Fq 'living-field.js' "$homepage" || ! grep -Fq 'class="chapters"' "$homepage"; then
    echo "ABORT: original five-chapter homepage missing: $homepage" >&2
    exit 1
  fi
  if [[ "$homepage" == "$STAGING_ROOT/index.html" ]]; then
    art_src="src/living-precision.js?v=20261110-heart-preview2"
    dots_src="src/staging-dot-overlays.js?v=20261110-original-dots3"
    lake_src="src/staging-luminous-lake-green.js?v=20261110-lake-green1"
  else
    art_src="../src/living-precision.js?v=20261110-heart-preview2"
    dots_src="../src/staging-dot-overlays.js?v=20261110-original-dots3"
    lake_src="../src/staging-luminous-lake-green.js?v=20261110-lake-green1"
  fi
  ART_SRC="$art_src" DOTS_SRC="$dots_src" LAKE_SRC="$lake_src" /usr/bin/perl -0777 -i -pe '
    BEGIN { $script = $ENV{"ART_SRC"}; $dots = $ENV{"DOTS_SRC"}; $lake = $ENV{"LAKE_SRC"}; }
    s#</body>#<script defer src="$lake"></script><script defer src="$dots"></script><script defer src="$script"></script></body>#i
      or die "ABORT: staging homepage missing closing body tag";
  ' "$homepage"
  grep -Fq "$art_src" "$homepage" || { echo "ABORT: art test not installed: $homepage" >&2; exit 1; }
  grep -Fq "$dots_src" "$homepage" || { echo "ABORT: original dot demos not installed: $homepage" >&2; exit 1; }
  grep -Fq "$lake_src" "$homepage" || { echo "ABORT: green lake preview not installed: $homepage" >&2; exit 1; }
  # Fail visibly if the staging-only controllers or models were not copied.
  test -s "$STAGING_ROOT/src/staging-dot-overlays.js" || { echo "ABORT: missing updated dot controller" >&2; exit 1; }
  grep -Fq "function createTree(canvas)" "$STAGING_ROOT/src/staging-dot-overlays.js" || { echo "ABORT: Tree of Life model missing" >&2; exit 1; }
  grep -Fq "function createStarlings(canvas)" "$STAGING_ROOT/src/staging-dot-overlays.js" || { echo "ABORT: starling model missing" >&2; exit 1; }
  grep -Fq "function createHeart(canvas)" "$STAGING_ROOT/src/staging-dot-overlays.js" || { echo "ABORT: anatomical heart model missing" >&2; exit 1; }
done

# Preview pages must not be indexed. Production configuration comes later.
for html in "$STAGING_ROOT/index.html" "$STAGING_ROOT/404.html" "$STAGING_ROOT"/pages/*.html "$STAGING_ROOT"/es/*.html "$STAGING_ROOT"/fr/*.html "$STAGING_ROOT"/zh/*.html; do
  if ! grep -qi 'name="robots"' "$html"; then
    /usr/bin/perl -0777 -i -pe 's/(<head\b[^>]*>)/$1<meta name="robots" content="noindex,nofollow,noarchive">/i' "$html"
  fi
done

# Apache must be able to serve CSS/JS/HTML; preserve cPanel's auth .htaccess.
find "$STAGING_ROOT" -type d -exec /bin/chmod 755 {} +
find "$STAGING_ROOT" -type f ! -name '.htaccess' -exec /bin/chmod 644 {} +

echo "Wardenclyffe staging deployed. Live WordPress was not modified."
