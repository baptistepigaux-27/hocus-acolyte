# E. Recommandations et arbitrages

## 1. Recommandation principale

Valider le deck sur **26 slides** avec un fil rouge unique : une intention métier qui devient successivement une conversation, une analyse outillée, une mémoire partagée, un workflow gouverné, puis un outil fonctionnel.

Le deck doit rester une présentation orale, pas une documentation exhaustive. Les détails techniques, les variantes de recettes et les noms de tous les composants restent dans les notes orateur ou dans la future webapp.

## 2. Slides à fusionner ou à ne pas créer

### À ne pas ajouter

- Une slide dédiée aux définitions de `embeddings`, `tokens`, `RAG`, `MCP`, `vector database` ou `CI/CD`.
- Une slide par agent Hocus : elle transformerait l’ensemble en catalogue produit.
- Une longue introduction à l’histoire de l’IA.
- Une comparaison de modèles ou de fournisseurs.
- Une slide « l’IA va remplacer les humains » : elle détourne la conclusion et contredit le rôle de gatekeeper.

### À garder compact

- Les notions de branche, commit, PR, tests, staging et production tiennent sur les slides 15–16 ; le glossaire complet est une note orateur.
- Les cinq exemples d’outils de la slide 12 restent des cartes rapides ; un seul est exécuté en profondeur.
- Cortex apparaît comme un cadre d’orchestration et de gouvernance ; son modèle Mission / Task / Evidence reste optionnel pour le public général.

## 3. Notions à reformuler

| Terme technique | Formulation première | Nom technique éventuel ensuite |
| --- | --- | --- |
| LLM | modèle qui a appris les relations entre les mots et les concepts | LLM |
| tool calling | l’IA demande à un outil de lire ou d’agir | appel d’outil |
| agent | IA avec objectif, outils et autonomie bornée | agent |
| mémoire | informations organisées et retrouvables entre les sessions | mémoire persistante |
| branche | espace isolé pour travailler sur une évolution | branch |
| commit | étape enregistrée dans l’historique | commit |
| PR | proposition de changement à relire | Pull Request |
| staging | version de test isolée de la production | préproduction |
| CI | contrôles automatiques rejoués sur le changement | intégration continue |
| orchestration | organisation des étapes, outils, rôles et décisions | orchestration |

## 4. Points à surveiller dans le récit

- Ne pas dire que le LLM « sait » une information interne si elle n’est pas fournie par le contexte ou un outil.
- Ne pas confondre mémoire de travail Obsidian et état opérationnel GitHub.
- Ne pas présenter Codex comme une autorité de merge ou de production.
- Ne pas présenter le nombre d’agents comme une preuve de maturité : la clarté des responsabilités et des contrôles compte davantage.
- Pour Northstar TEN, parler d’**Opportunity Score explicable** et de recommandation `go / review / no-go`, pas de probabilité de gain.
- Pour Sybil, présenter les résultats comme un POC sur des données publiques/fixtures, avec ses limites de transférabilité.
- Pour les exemples de repos, distinguer explicitement `fixture`, `synthetic`, `public`, `internal` et `client-confidential`.

## 5. Candidats prioritaires pour la future webapp

### Priorité 1 — Le parcours des niveaux

Un curseur `Chat → Copilot → Agent → Workflow → System` permet de modifier le nombre d’étapes, les outils accessibles, la mémoire et le niveau de contrôle.

### Priorité 2 — Le simulateur d’agent

L’utilisateur choisit un objectif ; la webapp révèle successivement plan, outil appelé, observation, décision suivante et résultat. Un panneau « ce que l’agent n’a pas le droit de faire » rend l’autonomie bornée visible.

### Priorité 3 — Le contexte builder

Comparer une instruction seule avec une mission contenant objectif, données, contraintes, historique et sortie attendue. Réutiliser le cas du rendez-vous client.

### Priorité 4 — Le système GPT / Obsidian / GitHub / Codex

Cliquer sur un rôle pour voir ce qu’il reçoit, ce qu’il produit et ce qu’il ne fait pas. Les liens doivent être directionnels et montrer les retours de contexte.

### Priorité 5 — Le workflow de livraison

Rejouer `SPEC → issue → branche → code → tests → PR → staging → validation humaine`. Chaque étape expose son artefact et sa preuve.

### Priorité 6 — Spec Driven vs POC Driven

Un commutateur fait varier la question dominante : « savons-nous quoi construire ? » ou « savons-nous si cela vaut la peine ? ».

### Priorité 7 — Explorer Hocus

Présenter les agents par responsabilité et non par fiche produit ; afficher un exemple de chaîne Gremlin/Zoltar → intelligence → Inat/Fumist/Yokai/Doppel.

## 6. Direction visuelle recommandée

- Fond clair cassé ou noir profond, avec un seul accent vif par slide.
- Titres courts, très contrastés, alignés sur une grille constante.
- Diagrammes en traits, nœuds et aplats ; pas d’icônes décoratives sans rôle sémantique.
- Captures limitées à une zone utile, avec annotation directe.
- Animations progressives pour les boucles et timelines ; version statique toujours lisible.
- Mascottes Hocus uniquement lorsqu’elles incarnent un rôle précis ; maximum deux apparitions dans le deck.
- Respecter la règle STORY : le message principal doit être compréhensible en 3–5 secondes.

## 7. Critères de validation de la Phase 1

Le storyboard est prêt à devenir PPT lorsque :

- [ ] une personne non technique peut expliquer chatbot, assistant, agent et système avec ses propres mots ;
- [ ] la différence prompt / contexte est visible sans note orateur ;
- [ ] la mémoire et les outils sont introduits avant l’écosystème Hocus ;
- [ ] GPT, Obsidian, GitHub et Codex ont chacun un rôle non ambigu ;
- [ ] le workflow montre une validation humaine explicite ;
- [ ] Northstar TEN et Sybil sont présentés avec leur statut de preuve et leurs limites ;
- [ ] chaque capture a un statut de confidentialité ;
- [ ] le deck fonctionne sans démonstration live ;
- [ ] aucune slide n’est un catalogue technique ;
- [ ] la conclusion revient à « relier connaissances, outils et personnes ».

## 8. Décisions encore nécessaires avant le PPT

1. Choisir le cas réel principal : Northstar TEN recommandé pour la compréhension métier ; Sybil en contrepoint POC.
2. Confirmer les droits de capture pour GitHub, Obsidian et les interfaces staging.
3. Choisir si le nom « ChatGPT » reste en couverture ou si « GPT » devient le terme générique du système.
4. Définir la durée de parole cible : 45 minutes (version courte) ou 60 minutes (version avec live B).
