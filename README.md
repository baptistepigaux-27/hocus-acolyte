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
- the final recommendation in [`recommendations-v2.md`](recommendations-v2.md).
- the declarative V2 deck map in [`manifest-v2.yml`](manifest-v2.yml).

No PPTX is generated in this issue. No webapp is developed. No production environment is touched.

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
- Branch: `docs/issue-1-storyboard-review-v2`
- Next after explicit validation: generate the PPT in a follow-up change, then review it in staging / preview.
