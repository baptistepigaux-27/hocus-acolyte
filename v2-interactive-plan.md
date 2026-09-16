# Hocus Acolyte V2 interactive — audit et vertical slice

## Décision de première passe

La narration et le shell existants sont conservés. La V2 interactive commence par
un seul vertical slice : l’écran 9, « Chatbot contre agent ». Les quatre autres
interactions P0 restent hors implémentation jusqu’à validation humaine.

## A. Audit rapide de l’existant

### Ce qui est réutilisable

- `webapp/index.html` fournit le shell, le sommaire, le mode présentation, les
  notes orateur et les contrôles de navigation.
- `webapp/content/slides.js` sépare déjà le contenu déclaratif du rendu et porte
  les 23 écrans ainsi que leurs métadonnées.
- `webapp/app.js` centralise l’état de navigation, les deep links et le rendu
  des visuels.
- `webapp/styles.css` porte l’identité Hocus, les breakpoints et la préférence
  `prefers-reduced-motion`.

### Dette utile à traiter progressivement

- Les visuels étaient rendus par `app.js` et majoritairement statiques.
- Le canvas était marqué `aria-hidden`, ce qui n’est plus acceptable pour une
  visualisation pédagogique interactive.
- Le smoke test vérifiait surtout la présence des fichiers et des 23 slides ;
  il ne vérifiait pas encore les transitions d’état dans le navigateur.
- Le passage à 18–20 écrans et les interactions contexte, mémoire, handoff et
  idée → produit sont reportés après le vertical slice.

## B. Plan de refactor incrémental

1. Ajouter un champ `interaction` uniquement aux écrans qui en ont besoin.
2. Monter les interactions via un registre léger dans `webapp/interactions/`,
   avec un cycle `mount / destroy`.
3. Conserver `app.js` comme orchestrateur du shell et de la navigation ; ne pas
   introduire React, Vue ou une dépendance runtime.
4. Rendre accessible dans le DOM toute information essentielle produite par une
   interaction ; réserver `aria-hidden` aux visuels purement décoratifs.
5. Ajouter un test Playwright ciblé par vertical slice avant d’ouvrir le suivant.
6. Extraire les styles en sous-fichiers seulement si la croissance réelle le
   justifie.

## C. Vertical slice — écran 9

`webapp/interactions/chatbot-agent.js` implémente une mission déterministe et
hors ligne : « Analyse ce dossier et prépare une recommandation. »

- Le chatbot affiche une réponse unique, générique et immédiatement visible.
- Le bouton `LANCER LA MISSION` engage la même mission côté agent.
- `RÉVÉLER L’ÉTAPE SUIVANTE` révèle successivement comprendre, chercher, lire,
  comparer, calculer, vérifier et synthétiser.
- Chaque étape expose son outil, son observation et sa preuve.
- Les permissions sont visibles : autorisé, à valider, interdit.
- La sortie finale rappelle la validation humaine requise.
- Le parcours reste utilisable au clavier et sur petit écran sans scroll
  horizontal critique.

## Critères de validation

- En moins de 30 secondes, la différence `question → réponse` contre
  `objectif → boucle de travail` est compréhensible sans commentaire oral.
- Le deep link `?slide=9&present=1` conserve le mode présentation.
- Les transitions sont déterministes, rejouables et sans appel externe.
- Navigation, focus visible, labels, reduced motion et absence de débordement
  critique sont testés dans le navigateur.

## Hors périmètre jusqu’au retour humain

- Context Builder.
- Memory Recall.
- Handoff GPT → Obsidian → GitHub → Codex.
- Idea → Product.
- Réduction globale de 23 à 18–20 écrans.
- Toute connexion à des comptes, données client, LLM live ou environnement de
  production.
