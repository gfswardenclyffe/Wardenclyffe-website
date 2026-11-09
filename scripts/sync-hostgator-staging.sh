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

# Avoid repeated deployments for unchanged commits, but retry a failed deployment.
LAST_SUCCESS="/home2/gfrancossh/.wardenclyffe-staging-last-success-sha"
CURRENT_SHA="$("$GIT" rev-parse HEAD)"
if [[ -f "$LAST_SUCCESS" ]] && [[ "$(< "$LAST_SUCCESS")" == "$CURRENT_SHA" ]]; then
  exit 0
fi

# cPanel runs the guarded .cpanel.yml script, which updates staging only.
echo "Wardenclyffe staging deployment request: $(date -u +%FT%TZ) | ${CURRENT_SHA:0:8}"
RESPONSE="$("$UAPI" --output=json VersionControlDeployment create "repository_root=$REPO")"
if ! printf '%s' "$RESPONSE" | grep -q '"status":1'; then
  echo "ERROR: cPanel rejected the deployment request: $RESPONSE" >&2
  exit 1
fi

LOG_PATH="$(printf '%s' "$RESPONSE" | sed -n 's/.*"log_path":"\([^"]*\)".*/\1/p')"
case "$LOG_PATH" in
  /home2/gfrancossh/.cpanel/logs/vc_*_git_deploy.log) ;;
  *) echo "ERROR: Cannot identify a valid cPanel deployment log." >&2; exit 1 ;;
esac

# UAPI initially queues the task; wait until cPanel confirms its actual result.
for ((attempt=0;attempt<60;attempt++)); do
  if [[ -f "$LOG_PATH" ]]; then
    if grep -q 'Build completed with exit code 0' "$LOG_PATH"; then
      printf '%s\n' "$CURRENT_SHA" > "$LAST_SUCCESS"
      echo "SUCCESS: private staging deployment completed (${CURRENT_SHA:0:8})."
      exit 0
    fi
    if grep -q 'Build completed with exit code' "$LOG_PATH"; then
      echo "ERROR: staging deployment failed:" >&2
      tail -n 30 "$LOG_PATH" >&2
      exit 1
    fi
  fi
  sleep 2
done
echo "ERROR: deployment not confirmed within 120 seconds. Check $LOG_PATH" >&2
exit 1
