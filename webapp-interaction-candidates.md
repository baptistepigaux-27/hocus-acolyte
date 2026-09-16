# Candidats d’interaction pour la future webapp

La webapp reste hors périmètre de cette issue. Les interactions ci-dessous servent à décider quelles scènes du deck méritent ensuite une exploration.

## Priorités

### P1 — Ajouter progressivement les briques du système

- **Slides source :** 5–8, 23.
- **Tag deck :** `INTERACTIVE_CANDIDATE`.
- **Interaction :** écran initial `ChatGPT seul`, puis boutons `+ contexte`, `+ outil`, `+ mémoire`, `+ agent`, `+ GitHub`, `+ Codex`.
- **Effet visuel :** le système s’enrichit ; chaque ajout révèle ce qu’il permet et ce qu’il ne permet pas encore.
- **Déclic recherché :** la puissance vient de la composition, pas d’un prompt isolé.
- **Données :** exemples fictifs et contenus canoniques ; aucun accès live requis.

### P1 — Simulateur chatbot contre agent

- **Slide source :** 9–11.
- **Interaction :** choisir une demande ; le chatbot affiche une réponse unique ; l’agent révèle plan, outil, observation, correction et résultat.
- **Contrôles :** bouton pause, outil interdit, résultat insuffisant, demande de validation humaine.
- **Déclic recherché :** visualiser la boucle plutôt que lire une définition.
- **Données :** scénario générique « analyser un dossier ».

### P1 — Context builder

- **Slide source :** 5.
- **Interaction :** ajouter/retirer objectif, données, contraintes, historique et sortie attendue ; comparer les résultats attendus.
- **Contrôles :** afficher les hypothèses, manques et risques de chaque état.
- **Déclic recherché :** comprendre pourquoi le même prompt produit des résultats différents.
- **Données :** cas fictif du rendez-vous client.

### P1 — Mémoire trois semaines plus tard

- **Slide source :** 7, 13.
- **Interaction :** basculer `sans mémoire / avec mémoire` ; sélectionner une décision Obsidian à réinjecter dans une nouvelle session.
- **Contrôles :** montrer la provenance et la date de la note ; distinguer retrouvé, déduit et inconnu.
- **Déclic recherché :** éprouver la continuité du travail.
- **Données :** note générique, jamais le vault complet.

## Priorités de démonstration du système réel

### P2 — Workflow GPT ↔ Obsidian ↔ GitHub ↔ Codex

- **Slides source :** 12–16.
- **Interaction :** cliquer sur un rôle ; afficher entrées, sorties, permissions, artefacts et limites.
- **Contrôles :** visualiser les retours de contexte et le gate humain ; bloquer explicitement la production.
- **Déclic recherché :** comprendre la continuité entre outils.
- **Données :** snapshot structuré, pas de connexion aux comptes réels.

### P2 — Phrase → produit

- **Slides source :** 17–19.
- **Interaction :** révéler question, brief, spec, issue, code, tests, PR, staging, application.
- **Contrôles :** ouvrir l’artefact de chaque étape ; afficher le critère de validation et la preuve associée.
- **Déclic recherché :** voir une intention se préciser sans saut magique.
- **Données :** cas Northstar TEN, fixtures et captures autorisées.

### P2 — Spec Driven contre POC Driven

- **Slides source :** 20 et 22.
- **Interaction :** déplacer un curseur entre « incertitude de conception » et « incertitude de valeur » ; recommander un chemin.
- **Contrôles :** afficher coût, vitesse d’apprentissage, niveau de preuve et décision attendue.
- **Déclic recherché :** choisir la bonne méthode avant de construire.
- **Données :** exemples Northstar TEN et Sybil.

### P2 — Carte Hocus par responsabilité

- **Slide source :** 21.
- **Interaction :** cliquer sur une responsabilité pour voir source, transformation, sortie et limite ; faire passer un dossier entre trois agents.
- **Contrôles :** ne jamais afficher un graphe technique complet ; conserver la vue « sources → intelligence → restitution ».
- **Déclic recherché :** comprendre la spécialisation sans mémoriser onze noms.
- **Données :** descriptions publiques/fixtures des dépôts.

### P3 — Conseil augmenté

- **Slide source :** 22.
- **Interaction :** choisir une sortie — notebook, script, dashboard, agent, mini-webapp, produit — puis voir le niveau de contrôle et d’industrialisation requis.
- **Déclic recherché :** réaliser que le bon livrable dépend du problème et du niveau de valeur prouvé.
- **Données :** fixture Inat consulting.

## Principes UX à conserver

- Une interaction modifie la compréhension, pas seulement la décoration.
- Chaque état a une phrase principale lisible sans tooltip.
- Le même contenu analytique doit pouvoir être présenté en mode `STORY` ou exploré en mode `EXPLORE`.
- Les preuves, limites et décisions humaines sont accessibles au même niveau que les résultats.
- La webapp n’exécute pas de services réels par défaut ; elle rejoue des snapshots versionnés et anonymisés.
