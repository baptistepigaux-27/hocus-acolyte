# C. Inventaire des assets réels disponibles

## Légende de réemploi

- **Prêt** : peut être intégré après un contrôle éditorial et de confidentialité.
- **À capturer** : la source existe localement ou est documentée, mais il faut produire une capture propre.
- **À vérifier** : la source peut contenir des données sensibles ou un statut de fixture à confirmer.
- **À recréer** : le deck doit utiliser un diagramme ou mockup dédié plutôt qu’une capture technique.

## 1. Assets universels et direction visuelle

| Asset | Statut | Usage proposé | Source locale |
| --- | --- | --- | --- |
| Direction Hocus : fond clair/noir, typographie forte, beaucoup d’espace | Prêt | thème de deck et couverture | [Hocus prototype README](/home/ubuntu/hocus-prototype/README.md) |
| Bat Pig, Signal Valley, Field Notes | À capturer | 1–2 respirations visuelles maximum ; ne pas décorer chaque slide | `/home/ubuntu/hocus-prototype/v5-8/assets/` |
| Grammaire STORY / EXPLORE | Prêt | règle de lisibilité du deck et future webapp | [Fumist — STORY vs EXPLORE](/home/ubuntu/hocus-fumist/docs/visual-pattern-library/story-vs-explore.md) |
| Patterns de synthèse, benchmark et évolution | Prêt | inspiration pour les slides 6, 19, 21 et 24 | [Fumist — consulting visual grammar](/home/ubuntu/hocus-fumist/docs/consulting-visual-grammar.md) |
| Renderer PPTX éditable et layouts existants | À réutiliser plus tard | génération Phase 2 du deck, pas nécessaire pour le storyboard | [Inat — renderer PPTX](/home/ubuntu/hocus-inat/docs/pptx.md) |

## 2. Workflow, gouvernance et système de travail

| Asset | Statut | Usage proposé | Source locale |
| --- | --- | --- | --- |
| Workflow `Idée → Issue → branche → PR → préprod → validation humaine → production` | Prêt | slide 16 et fil rouge de la narration | [Server playbook](/home/ubuntu/server-playbook/Systeme-global-developpement.md) |
| Définition des gates humaines | Prêt | slide 6 et slide 16 ; encadré « l’humain reste gatekeeper » | [Cortex — Human Gates](/home/ubuntu/hocus-cortex/docs/HUMAN_GATES.md) |
| Modèle Mission → Spec → Task → Artifact → Evidence → Review → Gate | À simplifier | slide 18 ou notes orateur ; ne pas exposer le vocabulaire complet en façade | [Cortex — Vision](/home/ubuntu/hocus-cortex/docs/VISION.md) |
| Rôle de Codex comme exécuteur contrôlé | Prêt | slide 17 : lire, modifier, tester ; pas autorité | [Cortex — Codex runtime adapter](/home/ubuntu/hocus-cortex/docs/CODEX_RUNTIME_ADAPTER.md) |
| Adaptateur GitHub borné | Prêt | notes de slide 20 ; explique issue, branche, PR et CI | [Cortex — GitHub adapter](/home/ubuntu/hocus-cortex/docs/GITHUB_SOFTWARE_DELIVERY_ADAPTER.md) |

## 3. Dépôts Hocus et preuves de travail

| Source | Ce qui est exploitable | Slide(s) | Statut / précaution |
| --- | --- | --- | --- |
| **Northstar TEN** | specs `SPEC-000` à `SPEC-009`, fixtures DCE/DECP, UI staging explicitement synthetic/fake, Opportunity Score et recommandation `go / review / no-go` | 19–21 | **Prêt sous anonymisation** ; vérifier que les documents montrés sont bien des fixtures sûres. [README](/home/ubuntu/northstar-ten/README.md) |
| **Sybil** | `POC-000`, `FINDINGS.md`, journey graph, semantic states, patterns, quality/provenance reports | 21–23 | **Prêt** avec données publiques/fixtures ; utiliser un seul graphe lisible, pas les CSV bruts. [POC](/home/ubuntu/hocus-sybil/docs/POC-000.md) |
| **Gremlin** | specs de collecte, fixtures HTML/JSON, pilote Parfumsetmoi, artifacts/provenance et tests | 22 | **Prêt sous contrôle de confidentialité** ; préférer les fixtures génériques et ne pas montrer le site client. [Architecture](/home/ubuntu/hocus-gremlin/docs/architecture.md) |
| **Zoltar** | PDFs de fixture, screenshots de review queue, extraction, provenance et evidence explorer | 11–12, 22 | **À vérifier** ; confirmer le statut synthétique/autorisé des PDFs avant toute projection. [Screenshots](/home/ubuntu/hocus-zoltar/docs/screenshots/) |
| **Stolas** | specs de catalogue/similarité, fixtures de catalogues, golden similarity et relation avec Gremlin | 22 | **Prêt** avec les fixtures `retailer_a/b/c`; ne pas afficher les bases `var/*.db`. [Specs](/home/ubuntu/hocus-stolas/specs/) |
| **Inat** | recipes de consulting, case study publisher, product/repository explainer, outputs multi-formats | 20, 22–24 | **Prêt comme preuve de pipeline** ; générer une sortie dédiée avant capture. [Consulting golden paths](/home/ubuntu/hocus-inat/docs/consulting-golden-paths.md) |
| **Fumist** | studio, patterns visuels, fixtures et règles de rendu SVG/ECharts | 6, 19, 24 | **Prêt pour inspiration** ; éviter de transformer le deck en démonstration du moteur. [Index](/home/ubuntu/hocus-fumist/docs/index.md) |
| **Cortex** | fixtures consulting/software delivery, state model, reviews, policies, gates | 16–18, 22 | **Prêt sous simplification** ; garder le public hors du modèle interne complet. [Operating model](/home/ubuntu/hocus-cortex/docs/OPERATING_MODEL.md) |

## 4. Captures et interfaces repérables localement

### Captures directement présentes

- `/home/ubuntu/hocus-zoltar/docs/screenshots/spec-005/` : `home.png`, `extraction.png`, `document-sets.png`, `review-queue.png`.
- `/home/ubuntu/hocus-zoltar/docs/screenshots/spec-006/` : provenance et evidence explorer.
- `/home/ubuntu/hocus-prototype/v5-8/audit/` : captures desktop/mobile de la direction visuelle Hocus.
- `/home/ubuntu/hocus-prototype/v5-8/assets/` : assets de marque et illustrations.

### Interfaces ou sorties à capturer

- Northstar TEN staging : la UI est explicitement synthetic/fake dans le README ; capture à produire sur un scénario DCE sûr.
- GitHub : issue, branche, PR et checks ; les checkouts locaux confirment les branches et historiques, mais aucune capture GitHub n’est considérée comme intégrée tant que le contenu n’a pas été vérifié.
- Obsidian : préférer un mockup ou une note d’architecture générique ; le vault local contient des données de travail vivantes et des modifications non liées à ce livrable.
- Sybil : produire une capture vectorielle ou HTML du journey graph à partir de `artifacts/golden/`, plutôt que montrer un fichier brut.

## 5. Assets à ne pas copier dans le deck

- `.env`, clés, tokens, `.private`, credentials, logs non filtrés.
- Bases locales `var/*.db`, bases SQLite de travail et exports non qualifiés.
- Données client ou documents dont le statut de confidentialité n’est pas explicite.
- Le vault Obsidian entier : sélectionner des extraits autorisés ; ne pas reproduire de contenu sensible par défaut.
- Captures de production ou URLs protégées avec identifiants.

## 6. Assets à recréer pour la Phase 1

1. Diagramme vectoriel « conversation → système de travail ».
2. Animation conceptuelle du LLM et de la boucle agent.
3. Mockup propre GPT / Obsidian / GitHub / Codex, sans dépendre des interfaces propriétaires.
4. Carte Northstar TEN : DCE → facts/evidence → assessment → go/review/no-go.
5. Montage anonymisé SPEC → issue → code → tests → PR → staging.
6. Deux chemins visuels Spec Driven / POC Driven.
7. Roster Hocus simplifié avec seulement les agents nécessaires au récit.

Pour ces éléments, privilégier les formes natives PowerPoint ou SVG éditables. Une image générée ne doit être utilisée que pour une illustration conceptuelle qui n’a pas besoin d’être modifiée ou inspectée comme une donnée.

## 7. Checklist de validation avant intégration

- [ ] Statut public / fixture / interne documenté pour chaque capture.
- [ ] Pas de nom de client, URL privée, token, donnée réglementée ou export brut.
- [ ] Les résultats chiffrés ont une source et une date.
- [ ] Les termes « synthetic », « fixture », « démonstration » sont visibles lorsque nécessaire.
- [ ] La capture montre une action et un résultat, pas seulement un écran de produit.
- [ ] Les preuves et incertitudes ne sont pas remplacées par une promesse marketing.
