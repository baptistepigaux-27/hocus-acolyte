# Hocus Acolyte — draft webapp

Prototype offline/staging multi-journey du storyboard V2.

## Lancer localement

Depuis la racine du dépôt :

```bash
python3 -m http.server 4173 --directory webapp
```

Puis ouvrir <http://127.0.0.1:4173/>.

Parcours disponibles :

- <http://127.0.0.1:4173/?journey=operating-system> — du chatbot au système de travail ;
- <http://127.0.0.1:4173/?journey=pme> — PME AI Overview.

Modules conversationnels accessibles depuis `Explorer` ou directement par URL :

- <http://127.0.0.1:4173/?module=cases&journey=pme&slide=3> — Real Cases ;
- <http://127.0.0.1:4173/?module=agent-lab&journey=pme&slide=3> — Agent Lab ;
- <http://127.0.0.1:4173/?module=memory-map&journey=pme&slide=3> — Memory Map.

## Navigation

- boutons `Avant` / `Après` dans la barre supérieure ;
- clic sur une slide dans le sommaire ;
- `←` / `→`, `PageUp` / `PageDown` ou espace ;
- `Home` / `End` pour aller au début ou à la fin ;
- `F` pour passer en mode présentation ;
- `N` pour afficher les notes orateur ;
- `/` pour chercher une slide ;
- `Escape` pour quitter le mode présentation.

Le moteur partagé est dans [`app.js`](app.js). Le parcours Operating System reste dans [`content/slides.js`](content/slides.js) et est enregistré par [`journeys/operating-system/config.js`](journeys/operating-system/config.js). Le contenu PME est dans [`journeys/pme-overview/content.js`](journeys/pme-overview/content.js), avec les cas d’usage dans [`opportunities.js`](journeys/pme-overview/opportunities.js) et le catalogue de familles de solutions dans [`solutions.js`](journeys/pme-overview/solutions.js). Les interactions sont enregistrées dans [`interactions/`](interactions/). Les extensions conversationnelles sont dans [`modules/`](modules/) : données déclaratives des cas dans [`modules/real-cases/cases.js`](modules/real-cases/cases.js) et rendu/routage dans [`modules/module-app.js`](modules/module-app.js). Aucun appel réseau ni service externe n’est requis.

Le parcours PME comprend 17 slides. L’Opportunity Map (slide 3) conserve la matrice visible pendant l’ouverture d’un drawer latéral desktop ; sur mobile, la fiche devient un bottom sheet. Le drawer expose séparément les briques possibles, la famille de solution et ses exemples, avec fermeture `Escape` et retour du focus sur la carte source. Les slides 5, 6, 9, 11, 13 et 14 proposent des interactions légères et réutilisables.

Les trois modules sont secondaires et ne modifient pas le nombre ni le chemin des slides PME. `Real Cases` propose des filtres, des fiches détaillées, des sources et des passerelles vers `Agent Lab` ou `Memory Map`. `Agent Lab` est une simulation locale à permissions cyclables et human gate ; `Memory Map` visualise la différence entre conversation, mémoire durable, knowledge base et retrieval. Les actions externes sont toujours simulées.

## Contrôles

```bash
node --check webapp/app.js
node --check webapp/content/slides.js
node --check webapp/journeys/operating-system/config.js
node --check webapp/journeys/pme-overview/content.js
bash webapp/tests/smoke.sh
python3 webapp/tests/e2e.py
```

Le test navigateur utilise Playwright installé dans l’environnement de travail et lance un serveur statique local sur le port 4174. La webapp est un draft local/staging. Elle ne contient aucune authentification, donnée client, clé, API ou écriture de production.
