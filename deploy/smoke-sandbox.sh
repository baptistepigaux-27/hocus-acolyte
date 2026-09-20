#!/usr/bin/env bash
# Smoke-test an Acolyte release locally or the active HTTPS sandbox.
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="${1:-}"
curl_auth=()

if [[ "$target" == http://* || "$target" == https://* ]]; then
  base_url="${target%/}"
  if [[ -n "${SANDBOX_BASIC_AUTH:-}" ]]; then
    curl_auth+=(--user "$SANDBOX_BASIC_AUTH")
  fi
  headers="$(mktemp)"
  body="$(mktemp)"
  trap 'rm -f "$headers" "$body"' EXIT
  curl "${curl_auth[@]}" --fail --silent --show-error --max-time 20 \
    -D "$headers" -o "$body" "$base_url/health"
  grep -qi '^x-robots-tag:.*noindex' "$headers"
  grep -q '"status":"ok"' "$body"
  grep -q '"service":"acolyte"' "$body"
  curl "${curl_auth[@]}" --fail --silent --show-error --max-time 20 \
    "$base_url/" | grep -q 'HOCUS ACOLYTE'
  curl "${curl_auth[@]}" --fail --silent --show-error --max-time 20 \
    "$base_url/ux/tutorial/" | grep -q 'tutorial-app.js'
  curl "${curl_auth[@]}" --fail --silent --show-error --max-time 20 \
    "$base_url/explore/" | grep -q 'explore.js'
  curl "${curl_auth[@]}" --fail --silent --show-error --max-time 20 \
    "$base_url/explore/?case=case-real-qonto-human-gate" | grep -q 'explore.js'
  printf 'Acolyte sandbox HTTPS smoke test OK: %s\n' "$base_url"
  exit 0
fi

root_dir="${target:-$repo_dir}"
test -f "$root_dir/server.py"
test -f "$root_dir/run.sh"
test -f "$root_dir/webapp/index.html"
test -f "$root_dir/webapp/ux/tutorial/index.html"
test -f "$root_dir/webapp/explore/index.html"
test -f "$root_dir/webapp/explore/data/cases-v1.json"

if [[ -n "${ACOLYTE_SMOKE_PORT:-}" ]]; then
  port="$ACOLYTE_SMOKE_PORT"
else
  port="$(python3 - <<'PY'
import socket

with socket.socket() as sock:
    sock.bind(("127.0.0.1", 0))
    print(sock.getsockname()[1])
PY
)"
fi
log_file="$(mktemp)"
trap 'if [[ -n "${server_pid:-}" ]]; then kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; fi; rm -f "$log_file"' EXIT
APP_ENV=sandbox python3 "$root_dir/server.py" --host 127.0.0.1 --port "$port" >"$log_file" 2>&1 &
server_pid=$!
for _ in {1..30}; do
  if curl --silent --fail "http://127.0.0.1:$port/health" >/dev/null; then
    break
  fi
  sleep 0.1
done
health="$(curl --silent --fail "http://127.0.0.1:$port/health")"
printf '%s' "$health" | grep -q '"status":"ok"'
printf '%s' "$health" | grep -q '"service":"acolyte"'
printf '%s' "$health" | grep -q '"environment":"sandbox"'
curl --silent --fail "http://127.0.0.1:$port/" | grep -q 'HOCUS ACOLYTE'
curl --silent --fail "http://127.0.0.1:$port/ux/tutorial/" | grep -q 'tutorial-app.js'
curl --silent --fail "http://127.0.0.1:$port/explore/" | grep -q 'explore.js'
case_json="$(curl --silent --fail "http://127.0.0.1:$port/explore/data/cases-v1.json")"
grep -q 'case-real-qonto-human-gate' <<<"$case_json"
printf 'Acolyte local smoke test OK: %s\n' "$root_dir"
