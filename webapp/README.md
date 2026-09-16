# Hocus Acolyte — draft webapp

Prototype statique du storyboard V2 validé.

## Lancer localement

Depuis la racine du dépôt :

```bash
python3 -m http.server 4173 --directory webapp
```

Puis ouvrir <http://127.0.0.1:4173/>.

## Navigation

- boutons `Avant` / `Après` dans la barre supérieure ;
- clic sur une slide dans le sommaire ;
- `←` / `→`, `PageUp` / `PageDown` ou espace ;
- `Home` / `End` pour aller au début ou à la fin ;
- `F` pour passer en mode présentation ;
- `N` pour afficher les notes orateur ;
- `/` pour chercher une slide ;
- `Escape` pour quitter le mode présentation.

Le contenu est structuré dans [`content/slides.js`](content/slides.js). Le rendu visuel est produit par [`app.js`](app.js), sans appel réseau et sans dépendance externe.

## Contrôles

```bash
node --check webapp/app.js
node --check webapp/content/slides.js
bash webapp/tests/smoke.sh
python3 webapp/tests/e2e.py
```

Le test navigateur utilise Playwright installé dans l’environnement de travail et lance un serveur statique local sur le port 4174. La webapp est un draft local/staging. Elle ne contient aucune authentification, donnée client, clé, API ou écriture de production.
