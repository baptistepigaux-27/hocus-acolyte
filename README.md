# Hocus Acolyte — AI Operating System

Phase 1 — storyboard review V2.

## Scope

This repository freezes the narrative before producing the PowerPoint deck. It contains:

- the complete V1 source, preserved under [`source-v1/`](source-v1/);
- the slide-by-slide V1 audit in [`storyboard-v1-review.md`](storyboard-v1-review.md);
- the V2 storyboard in [`storyboard-v2.md`](storyboard-v2.md);
- the five memorable moments in [`wow-moments.md`](wow-moments.md);
- the selected real assets in [`assets-inventory-v2.md`](assets-inventory-v2.md);
- the demonstration plan in [`demonstrations-v2.md`](demonstrations-v2.md);
- the future interaction map in [`webapp-interaction-candidates.md`](webapp-interaction-candidates.md);
- the final recommendation in [`recommendations-v2.md`](recommendations-v2.md);
- the declarative V2 deck map in [`manifest-v2.yml`](manifest-v2.yml).
- the interactive storyboard draft in [`webapp/`](webapp/).
- the V2 interactive audit and vertical-slice plan in [`v2-interactive-plan.md`](v2-interactive-plan.md).
- the PME AI Overview multi-journey plan and vertical slice in [`webapp/journeys/`](webapp/journeys/).

The PPTX is intentionally not generated in this issue. The webapp is a local/staging draft for validating the 23-slide experience. No production environment is touched.

## Runtime

The webapp is executable locally without a build step or database:

```bash
APP_ENV=local ./run.sh --port 4173
```

The runtime serves the existing `webapp/` tree and exposes `GET /health` with
the service and environment. For sandbox releases, use `APP_ENV=sandbox` and
the scripts in [`deploy/`](deploy/); the deployment target is
`/srv/acolyte-sandbox/releases` with an atomic `current` symlink.

## Narrative decision

The V2 uses five acts:

```text
1. What you already know — ChatGPT
2. What changes everything — context, tools, memory, agents
3. An agent works — one objective becomes a workflow
4. How Baptiste really works — GPT, Obsidian, GitHub, Codex
5. From idea to product — Northstar TEN, Sybil, Hocus and augmented consulting
```

The recommended main case is **Northstar TEN**: it is easier to understand as a business decision workflow and has a real specification-to-staging path. **Sybil** is kept as the short secondary case for POC Driven thinking and the value gate.

## Workflow

- Issue: [#1 — review AI operating system storyboard V2](https://github.com/baptistepigaux-27/hocus-acolyte/issues/1)
- Issue: [#3 — expose storyboard V2 as an interactive webapp draft](https://github.com/baptistepigaux-27/hocus-acolyte/issues/3)
- Issue: [#5 — add PME AI Overview multi-journey vertical slice](https://github.com/baptistepigaux-27/hocus-acolyte/issues/5)
- V2 branch: `docs/issue-1-storyboard-review-v2-pr`
- Webapp branch: `feat/issue-3-webapp-draft`
- PME branch: `feat/issue-5-pme-overview`
- Next after human validation: decide whether to iterate the webapp, generate the PPT in a follow-up change, or both.
