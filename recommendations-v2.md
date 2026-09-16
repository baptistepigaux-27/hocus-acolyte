# Recommandations V2 et verdict

## Verdict

```text
READY_FOR_PPT
```

La narration est suffisamment figée pour produire un premier deck de 23 slides. Le verdict porte sur la **production du PPT en Phase 2**, après validation explicite de cette V2 ; il ne constitue pas une autorisation de publier, déployer ou démarrer la webapp.

## Ce qui change par rapport à V1

1. Passage de 26 à **23 slides**.
2. Passage d’une progression par définitions à une structure en **5 actes**.
3. ChatGPT est le point de départ de l’audience, pas seulement le sujet d’une couverture.
4. Contexte, outils, mémoire et agents sont révélés avant les noms Hocus.
5. Cinq moments wow sont placés dans le parcours, avec une phrase à retenir et un fallback.
6. Northstar TEN devient le cas principal réel ; Sybil devient le mini-cas POC Driven.
7. Les 11 composants Hocus tiennent sur une seule carte par responsabilité.
8. Le rôle de l’humain est visible avant et après Codex.
9. Les interactions futures sont identifiées sans développer la webapp.

## Choix du cas principal

### Northstar TEN — recommandé

Il donne le récit complet le plus accessible : question de décision → DCE/données → extraction → faits/evidence → score explicable → `go / review / no-go` → UI staging. Il permet aussi de montrer SPEC, issue, tests, PR et staging dans un seul cas.

La formulation financière de la V1 est abandonnée : le checkout local disponible est **Northstar TEN**, centré sur la tender intelligence. Aucun résultat financier non présent dans le dépôt ne sera inventé.

### Sybil — secondaire

Sybil sert à montrer une autre décision : quand on ne sait pas encore si la valeur ou la transférabilité sont démontrées, on fait un POC, on observe les patterns, puis on passe un value gate. Cela évite de faire deux visites produit complètes.

### Stolas — non retenu dans le récit principal

Stolas est un bon exemple de similarité catalogue, mais il introduit davantage de vocabulaire technique et ne renforce pas autant le passage idée → produit pour cette audience. Il reste une option courte ou un asset de la carte Hocus.

## Démos retenues

- **LIVE 1 :** même demande, puis ajout du contexte — 3–4 minutes.
- **LIVE 2 :** créer une évolution — 5–7 minutes, idéalement sous forme de replay.
- **PRE-RECORDED :** Northstar TEN, 60–90 secondes.
- **OPTIONAL PRE-RECORDED :** Sybil, 60–90 secondes.
- **ANIMATED CONCEPT :** chatbot/agent, mémoire, timeline, phrase/logiciel.

Le deck doit rester compréhensible avec uniquement les captures et animations. Le live est un accélérateur de compréhension, pas une dépendance de la narration.

## Assets à sécuriser avant le premier PPT

1. Capture Northstar TEN de la UI staging synthetic/fake.
2. Extraits SPEC-009, tests et montage du cycle réel.
3. Rendu lisible du journey graph Sybil.
4. Note Obsidian générique et anonymisée.
5. Issue/PR GitHub autorisées, ou mockups fidèles si l’autorisation n’est pas confirmée.
6. Une sortie Inat consulting sur fixture sûre.

Les diagrammes des slides 1, 4, 6, 8, 9, 11, 15, 18, 21, 22 et 23 seront créés en formes natives PowerPoint ou SVG éditable. Les captures réelles restent réservées aux endroits où elles prouvent une transformation.

## Recommandations de ton et de design

- Calme, concret, non techno-fétichiste.
- Aucun discours de remplacement généralisé des humains.
- Une idée dominante par slide.
- Labels directs et peu de légendes.
- Fond clair cassé ou noir profond, accent vif unique, grande respiration.
- Les mascottes Hocus n’incarnent un agent que si sa responsabilité est utile au récit.
- Les termes techniques viennent après leur explication en langage courant.
- Tout visuel animé a une version statique équivalente.

## Ce qui reste volontairement hors deck

- Historique de l’IA, mathématiques, tokens, embeddings, RAG, MCP et bases vectorielles.
- Catalogue complet des capacités ChatGPT.
- Architecture interne détaillée de Cortex.
- Une slide par moteur Hocus.
- Démonstration Stolas complète.
- Détails exhaustifs de Git et CI/CD.

## Contrôles à exécuter en Phase 2

- Vérifier 23 slides, titres et présence des cinq actes.
- Vérifier que chaque slide a une version statique lisible.
- Ouvrir le PPTX après génération et contrôler qu’il est éditable.
- Vérifier densité, hiérarchie, légibilité des captures et cohérence des diagrammes.
- Vérifier que les assets portent un statut `public / fixture / synthetic / internal`.
- Contrôler qu’aucune donnée confidentielle n’est présente.
- Faire une répétition sans démo live.

## Workflow exécuté

- Issue créée : [#1](https://github.com/baptistepigaux-27/hocus-acolyte/issues/1).
- Branche : `docs/issue-1-storyboard-review-v2`.
- Fichiers ajoutés : `README.md`, `storyboard-v1-review.md`, `storyboard-v2.md`, `wow-moments.md`, `assets-inventory-v2.md`, `demonstrations-v2.md`, `webapp-interaction-candidates.md`, `recommendations-v2.md` et la copie de référence `source-v1/`.
- Contrôles documentaires : 23 slides V2, cinq actes, cinq wow moments, deux LIVE principaux, aucune production/webapp.
- Étape suivante : validation humaine explicite de la V2, puis branche dédiée pour la génération/revue PPT.
