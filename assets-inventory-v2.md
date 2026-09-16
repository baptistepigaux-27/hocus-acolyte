# Assets retenus pour le deck V2

Ce document ne recense que les assets effectivement retenus dans la narration. Les sources brutes et les assets non sélectionnés restent dans les dépôts d’origine.

## Sélection principale

| Asset retenu | Rôle exact | Slides | Statut | Préparation |
| --- | --- | ---: | --- | --- |
| Northstar TEN `SPEC-009-dce-analyzer-ui.md` | matérialiser la question métier, le périmètre et la spécification | 17–18 | prêt | extraire 3–5 lignes sans saturer la slide |
| Northstar TEN UI staging | montrer le résultat testable d’un pipeline DCE → assessment | 17–19 | synthétique/fake documenté dans le README | capture propre avec bandeau `synthetic / staging` |
| Northstar TEN fixtures DCE et golden manifests | fournir une source sûre pour le cas principal | 17–19 | à vérifier fixture par fixture | valider le statut et masquer toute donnée non nécessaire |
| Northstar TEN tests / static UI | prouver code, contrôle et sortie testable | 19 | prêt | sélectionner un test et une vue UI, pas le dépôt entier |
| Sybil `POC-000.md` | raconter la logique question → POC → value gate | 20 | prêt | garder le vocabulaire métier, laisser les détails techniques en notes |
| Sybil `artifacts/golden/journey_graph.md` | donner une sortie visuelle lisible au mini-cas POC | 20 | public/fixture locale | convertir en capture ou diagramme ; ne pas afficher le JSON brut |
| Sybil `artifacts/golden/FINDINGS.md` / `patterns.json` | montrer résultat, stabilité et limites | 20 | public/fixture locale | ne retenir qu’un pattern et son statut, avec provenance |
| Hocus workflow playbook | crédibiliser la timeline et le gate humain | 15, 19 | prêt | reprendre le schéma `Idée → Issue → ... → Production` |
| Cortex Human Gates | justifier l’arrêt et la décision humaine | 11, 15 | prêt | traduire en « ce qui peut être automatique / ce qui demande un humain » |
| Cortex Codex Runtime Adapter | cadrer le rôle d’exécution de Codex | 14, 16 | prêt | utiliser comme source de schéma, pas comme screenshot de code |
| Cortex GitHub Adapter | relier issue, branche, PR et CI | 14, 16 | prêt | sélectionner le flux et les garanties, supprimer les DTO/termes internes |
| Inat consulting golden paths | donner une preuve de production de livrables | 22 | prêt comme recette/fixture | produire une capture dédiée avant le PPT |
| Inat product/repository explainer | inspirer le passage snapshot → concept map → story → PPTX | 22 | prêt comme référence | ne montrer qu’un flux simplifié |
| Hocus prototype `v5-8/assets/` | donner un accent visuel Hocus discret | 1, 21, 23 | prêt sous contrôle de droits | maximum deux apparitions ; aucun usage décoratif systématique |

## Sources Hocus utilisées pour la carte de spécialisation

Une seule visualisation sur la slide 21 réutilise les responsabilités documentées par :

- [Gremlin README](/home/ubuntu/hocus-gremlin/README.md) et [architecture](/home/ubuntu/hocus-gremlin/docs/architecture.md) — collecte et provenance.
- [Stolas README](/home/ubuntu/hocus-stolas/README.md) et `specs/` — représentation et similarité de catalogues.
- [Sybil POC](/home/ubuntu/hocus-sybil/docs/POC-000.md) — parcours et patterns comportementaux.
- [Northstar TEN README](/home/ubuntu/northstar-ten/README.md) — intelligence tender et DCE.
- [Inat README](/home/ubuntu/hocus-inat/README.md) — story, evidence et renderers.
- [Cortex vision](/home/ubuntu/hocus-cortex/docs/VISION.md) — orchestration et gouvernance.

Zoltar, Maze, Yokai, Doppel et Fumist sont nommés par rôle dans le schéma ; ils ne donnent pas lieu à une slide dédiée.

## Captures réellement nécessaires avant le PPT

1. **Northstar TEN staging** : une vue DCE Analyzer sûre, explicitement marquée `synthetic / fake`.
2. **Northstar TEN spec → tests** : montage de deux extraits courts montrant la continuité.
3. **Sybil journey graph** : une image lisible du graphe golden et un encadré de résultat.
4. **Obsidian** : une note générique de décision ou d’architecture, anonymisée ; pas le vault complet.
5. **GitHub** : issue, PR et checks d’un exemple autorisé ; l’URL et les personnes doivent être validées avant intégration.
6. **Inat** : une sortie de recette consulting en HTML ou PPTX, générée depuis une fixture sûre.

## Assets explicitement exclus

- Bases locales `var/*.db`, fichiers `.env`, tokens, logs non filtrés et contenu `.private`.
- Données clients ou PDFs dont le statut de confidentialité n’est pas prouvé.
- Captures de production ou accès staging protégés.
- Le vault Obsidian entier et les notes vivantes non sélectionnées.
- Un screenshot de terminal comme preuve principale.
- Une mascotte par agent : cela créerait un catalogue commercial.

## État de preuve GitHub

Les checkouts locaux apportent des branches, specs, commits, tests et README ; par exemple Northstar TEN est actuellement sur `feat/10-spec-009-dce-analyzer-ui` avec un commit local `102ab0d`, et Sybil documente `POC-000` / issue #1. Ils ne remplacent pas une capture GitHub validée : la PR, les checks et les droits de réutilisation doivent être confirmés au moment de la préparation du deck.

## Règle de sélection finale

Un asset n’entre dans le PPT que s’il répond à trois conditions :

1. il montre une transformation ou une preuve, pas seulement une interface ;
2. son statut `public / fixture / synthetic / internal / client-confidential` est connu ;
3. il peut être expliqué en une phrase à une audience non technique.
