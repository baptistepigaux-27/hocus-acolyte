#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir/.."

test -f webapp/index.html
test -f webapp/styles.css
test -f webapp/app.js
test -f webapp/content/slides.js
test -f webapp/journeys/operating-system/config.js
test -f webapp/journeys/pme-overview/content.js
test -f webapp/journeys/pme-overview/opportunities.js
test -f webapp/journeys/pme-overview/solutions.js
test -f webapp/interactions/chatbot-agent.js
test -f webapp/interactions/opportunity-map.js
test -f webapp/interactions/role-selector.js
test -f webapp/interactions/knowledge-journey.js
test -f webapp/interactions/agent-business.js
test -f webapp/interactions/function-overview.js
test -f webapp/interactions/opportunity-scoring.js
test -f webapp/interactions/portfolio-explorer.js
test -f webapp/modules/real-cases/cases.js
test -f webapp/modules/module-app.js
test -f webapp/ux/ux-app.js
test -f webapp/ux/ux.css
test -f webapp/ux/editorial/index.html
test -f webapp/ux/playground/index.html
test -f webapp/ux/field-guide/index.html
test -f webapp/ux/current/index.html
test -f webapp/tests/ux_e2e.py
test -f webapp/tests/ux_round2_e2e.py
test -f webapp/ux/round-2/ux2-app.js
test -f webapp/ux/round-2/ux2.css
test -f webapp/ux/round-2/index.html
test -f webapp/ux/round-2/manual/index.html
test -f webapp/ux/round-2/lab/index.html
test -f webapp/ux/round-2/system/index.html
test -f webapp/ux/round-2/review/index.html
test -f webapp/ux/tutorial/index.html
test -f webapp/ux/tutorial/tutorial-app.js
test -f webapp/ux/tutorial/tutorial.css
test -f webapp/tests/tutorial_e2e.py
test -f webapp/tests/e2e.py
test -f webapp/tests/data-check.js
test -f webapp/shared/navigation.js
test -f webapp/shared/navigation.css
test -f webapp/shared/acolyte-o.png
test -f webapp/tests/navigation_e2e.py
test -f docs/acolyte-pages-tree.md

for page in $(find webapp -name 'index.html' ! -path 'webapp/index.html' | sort); do
  rg -q 'shared/navigation.css' "$page"
  rg -q 'shared/navigation.js' "$page"
done

node --check webapp/app.js
node --check webapp/content/slides.js
node --check webapp/journeys/operating-system/config.js
node --check webapp/journeys/pme-overview/content.js
node --check webapp/journeys/pme-overview/opportunities.js
node --check webapp/journeys/pme-overview/solutions.js
node --check webapp/modules/real-cases/cases.js
node --check webapp/modules/module-app.js
node --check webapp/ux/ux-app.js
node --check webapp/ux/round-2/ux2-app.js
node --check webapp/ux/tutorial/tutorial-app.js
node --check webapp/shared/navigation.js
for interaction in webapp/interactions/*.js; do
  node --check "$interaction"
done
node webapp/tests/data-check.js

slide_count="$(rg -o 'id: [0-9]+,' webapp/content/slides.js | wc -l | tr -d ' ')"
test "$slide_count" -eq 23
test "$(rg -c 'interactive: true' webapp/content/slides.js)" -ge 1
test "$(rg -c 'demoType:' webapp/content/slides.js)" -ge 2

for required in 'data-action="next"' 'data-action="previous"' 'data-action="toggle-present"' 'data-action="toggle-index"' 'id="speaker-notes"' 'content/slides.js'; do
  rg -q "$required" webapp/index.html
done

test "$(rg -c 'class="topbar-nav-button"' webapp/index.html)" -eq 2
test "$(rg -o 'journey-link' webapp/index.html | wc -l | tr -d ' ')" -eq 2
rg -q 'journey=pme' webapp/index.html
rg -q 'journeys/operating-system/config.js' webapp/index.html
rg -q 'journeys/pme-overview/opportunities.js' webapp/index.html
rg -q 'journeys/pme-overview/solutions.js' webapp/index.html
rg -q 'journeys/pme-overview/content.js' webapp/index.html
rg -q 'interactions/chatbot-agent.js' webapp/index.html
rg -q 'interactions/opportunity-map.js' webapp/index.html
rg -q 'modules/real-cases/cases.js' webapp/index.html
rg -q 'modules/module-app.js' webapp/index.html
rg -q 'class="site-nav"' webapp/index.html
test "$(rg -c 'class="site-nav-group"' webapp/index.html)" -eq 4
rg -q 'CATALOGUE · 100 CAS' webapp/index.html
rg -q 'module=cases' webapp/index.html
rg -q 'REAL CASES' webapp/modules/module-app.js
rg -q 'AGENT LAB' webapp/modules/module-app.js
rg -q 'MEMORY MAP' webapp/modules/module-app.js
rg -q 'EDITORIAL AIR' webapp/ux/ux-app.js
rg -q 'PRODUCT PLAYGROUND' webapp/ux/ux-app.js
rg -q 'FIELD GUIDE' webapp/ux/ux-app.js
rg -q 'MANUEL DE TERRAIN' webapp/ux/round-2/ux2-app.js
rg -q 'LAB / INSTRUMENT' webapp/ux/round-2/ux2-app.js
rg -q 'HOCUS SYSTEM' webapp/ux/round-2/ux2-app.js
rg -q 'REVUE / INTELLIGENCE APPLIQUÉE' webapp/ux/round-2/ux2-app.js
rg -q 'TUTORIAL BOARDS' webapp/ux/tutorial/tutorial-app.js
rg -q 'HUMAN GATE' webapp/ux/tutorial/tutorial-app.js
rg -q "kind: 'chatbot-agent'" webapp/content/slides.js
rg -q "kind: 'opportunity-map'" webapp/journeys/pme-overview/content.js
for kind in role-selector knowledge-journey agent-business function-overview opportunity-scoring portfolio-explorer; do
  rg -q "kind: '$kind'" webapp/journeys/pme-overview/content.js
done
rg -q 'APPROCHE FRÉQUENTE' webapp/interactions/opportunity-map.js
rg -q 'triggerElement' webapp/interactions/opportunity-map.js
rg -q 'opportunity-implementation-legend' webapp/interactions/opportunity-map.js
rg -q 'solutionCategory' webapp/journeys/pme-overview/opportunities.js
rg -q "FICHE CAS D’USAGE" webapp/interactions/opportunity-map.js
rg -q 'LANCER LA MISSION' webapp/interactions/chatbot-agent.js
rg -q 'Opportunity Map' webapp/interactions/opportunity-map.js

for visual in cover context memory compare agent-workflow roles timeline northstar sybil specialized consulting closing; do
  rg -q "visual: '$visual'" webapp/content/slides.js
done

if rg -n -i 'sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY' webapp; then
  echo 'Potential secret found in webapp source.' >&2
  exit 1
fi

printf 'Hocus Acolyte webapp smoke checks passed (%s slides).\n' "$slide_count"
