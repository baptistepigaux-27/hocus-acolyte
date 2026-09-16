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

## Navigation

- boutons `Avant` / `Après` dans la barre supérieure ;
- clic sur une slide dans le sommaire ;
- `←` / `→`, `PageUp` / `PageDown` ou espace ;
- `Home` / `End` pour aller au début ou à la fin ;
- `F` pour passer en mode présentation ;
- `N` pour afficher les notes orateur ;
- `/` pour chercher une slide ;
- `Escape` pour quitter le mode présentation.

Le moteur partagé est dans [`app.js`](app.js). Le parcours Operating System reste dans [`content/slides.js`](content/slides.js) et est enregistré par [`journeys/operating-system/config.js`](journeys/operating-system/config.js). Le contenu PME et ses données déclaratives sont dans [`journeys/pme-overview/content.js`](journeys/pme-overview/content.js). Les interactions sont enregistrées dans [`interactions/`](interactions/). Aucun appel réseau n’est requis.

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
