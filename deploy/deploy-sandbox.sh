#!/usr/bin/env bash
# Archive a committed Acolyte revision, smoke it, then atomically activate it.
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
release_root="${ACOLYTE_SANDBOX_RELEASE_ROOT:-/srv/acolyte-sandbox/releases}"
current_link="${ACOLYTE_SANDBOX_CURRENT:-/srv/acolyte-sandbox/current}"
ref="${1:-feat/acolyte-case-base-batch-01}"

commit="$(git -C "$repo_dir" rev-parse --verify "${ref}^{commit}")"
short_commit="$(git -C "$repo_dir" rev-parse --short "$commit")"
release_name="$(date -u +%Y%m%dT%H%M%SZ)-${short_commit}"
release_dir="${release_root}/${release_name}"

for path in webapp/index.html webapp/explore/index.html webapp/ux/tutorial/index.html server.py run.sh; do
  git -C "$repo_dir" cat-file -e "$commit:$path" || {
    echo "Refusing revision without $path: $commit" >&2
    exit 1
  }
done

if [[ -e "$release_dir" ]]; then
  echo "Release already exists: $release_dir" >&2
  exit 1
fi

umask 022
mkdir -m 755 -p "$release_dir"
git -C "$repo_dir" archive --format=tar "$commit" | tar -xf - -C "$release_dir"
find "$release_dir" -type d -exec chmod 755 {} +
find "$release_dir" -type f -exec chmod 644 {} +
chmod 755 "$release_dir/run.sh"

printf '%s\n' "$commit" > "$release_dir/REVISION"
printf 'environment=sandbox\nservice=acolyte\nsha=%s\nrelease=%s\n' \
  "$commit" "$release_name" > "$release_dir/RELEASE"

"$repo_dir/deploy/smoke-sandbox.sh" "$release_dir"

new_link="${current_link}.new"
ln -s "$release_dir" "$new_link"
mv -Tf "$new_link" "$current_link"

if systemctl is-enabled --quiet acolyte-sandbox.service 2>/dev/null || \
   systemctl is-active --quiet acolyte-sandbox.service 2>/dev/null; then
  sudo systemctl restart acolyte-sandbox.service
fi

printf 'Activated Acolyte sandbox release %s (%s)\n' "$release_name" "$commit"
printf 'Run deploy/smoke-sandbox.sh https://sandbox.hocus.works/acolyte with sandbox auth.\n'
