#!/usr/bin/env bash
# Hourly GitHub -> HostGator STAGING synchronization only.
# Production WordPress and live domain root are deliberately out of scope.
set -euo pipefail
umask 077
REPO="/home2/gfrancossh/wardenclyffe-website-git"
GIT="/usr/local/cpanel/3rdparty/lib/path-bin/git"
UAPI="/usr/local/cpanel/bin/uapi"

# Never allow overlapping scheduled syncs.
exec 9>"/home2/gfrancossh/.wardenclyffe-staging-cron.lock"
if ! command -v flock >/dev/null 2>&1; then
  echo "ERROR: flock is unavailable; scheduled sync not started." >&2
  exit 1
fi
flock -n 9 || exit 0

cd "$REPO"
if [[ "$("$GIT" branch --show-current)" != "main" ]]; then
  echo "ERROR: Expected main branch; staging sync stopped." >&2
  exit 1
fi
if [[ -n "$("$GIT" status --porcelain)" ]]; then
  echo "ERROR: Repository has local changes; staging sync stopped." >&2
  exit 1
fi

"$GIT" fetch --quiet origin main
# Fail if history cannot be fast-forwarded; never reset or force-pull.
"$GIT" merge --ff-only --quiet origin/main

# cPanel deploy runs the guarded .cpanel.yml script, which only updates staging.
# Queue on each scheduled run so a previous failed deployment can be retried.
echo "Wardenclyffe staging deployment request: $(date -u +%FT%TZ) | $("$GIT" rev-parse --short HEAD)"
"$UAPI" --output=json VersionControlDeployment create "repository_root=$REPO"
