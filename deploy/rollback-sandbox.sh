#!/usr/bin/env bash
# Atomically repoint Acolyte sandbox to an existing release directory.
set -euo pipefail

release_root="${ACOLYTE_SANDBOX_RELEASE_ROOT:-/srv/acolyte-sandbox/releases}"
current_link="${ACOLYTE_SANDBOX_CURRENT:-/srv/acolyte-sandbox/current}"
release_name="${1:?Usage: rollback-sandbox.sh <release-directory-name>}"

case "$release_name" in
  */*|.|..|"") echo 'Release name must be a single directory name.' >&2; exit 1 ;;
esac

release_dir="${release_root}/${release_name}"
test -f "$release_dir/server.py"
test -f "$release_dir/webapp/index.html"

new_link="${current_link}.new"
ln -s "$release_dir" "$new_link"
mv -Tf "$new_link" "$current_link"
if systemctl is-enabled --quiet acolyte-sandbox.service 2>/dev/null || \
   systemctl is-active --quiet acolyte-sandbox.service 2>/dev/null; then
  sudo systemctl restart acolyte-sandbox.service
fi
printf 'Rolled Acolyte sandbox back to %s\n' "$release_name"
