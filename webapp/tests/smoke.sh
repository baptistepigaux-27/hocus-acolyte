#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir/.."

test -f webapp/index.html
test -f webapp/styles.css
test -f webapp/app.js
test -f webapp/content/slides.js

node --check webapp/app.js
node --check webapp/content/slides.js

slide_count="$(rg -c '^  \{ id:' webapp/content/slides.js)"
test "$slide_count" -eq 23
test "$(rg -c 'interactive: true' webapp/content/slides.js)" -ge 1
test "$(rg -c 'demoType:' webapp/content/slides.js)" -ge 2

for required in 'data-action="next"' 'data-action="previous"' 'data-action="toggle-present"' 'data-action="toggle-index"' 'id="speaker-notes"' 'content/slides.js'; do
  rg -q "$required" webapp/index.html
done

test "$(rg -c 'class="topbar-nav-button"' webapp/index.html)" -eq 2

for visual in cover context memory compare agent-workflow roles timeline northstar sybil specialized consulting closing; do
  rg -q "visual: '$visual'" webapp/content/slides.js
done

if rg -n -i 'sk-[A-Za-z0-9]+|gh[pousr]_[A-Za-z0-9]+|BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY' webapp; then
  echo 'Potential secret found in webapp source.' >&2
  exit 1
fi

printf 'Hocus Acolyte webapp smoke checks passed (%s slides).\n' "$slide_count"
