# Déploiement d'Acolyte

Acolyte vit à deux endroits, déployés différemment :

| Environnement | URL | Contenu | Mécanisme |
|---|---|---|---|
| Production | `https://www.hocus.works/acolyte/` | V2 (`feat/acolyte-v2`) | copie statique dans la release hocus.works |
| Sandbox historique | `https://sandbox.hocus.works/acolyte/` | V1, gardée pour comparaison | service Python dédié (ce dossier) |

## Production (hocus.works)

La production ne passe pas par les scripts de ce dossier. Le dossier `webapp/`
porte un fichier `PUBLIC.md` : il est prêt pour le public et publié tel quel.

Le dépôt `hocus-prototype` l'importe à un commit donné, puis pré-rend une page
par fiche (`cas/{slug}/`) et le sitemap des fiches indexables :

```bash
# depuis un worktree de hocus-prototype
python3 scripts/sync-acolyte.py /home/ubuntu/hocus-acolyte <ref>
node tests/acolyte-smoke.mjs && node tests/seo-smoke.mjs
```

Le dossier `acolyte/` ainsi généré est commité dans `hocus-prototype`, puis la
release suit le circuit habituel du site (`deploy/deploy-staging.sh`, puis
`deploy/deploy-production.sh <ref validée>`). Le détail, y compris le retour
arrière, est dans `docs/acolyte.md` de `hocus-prototype`.

Points d'attention :

- **Cache** : les références CSS et JS de `webapp/` portent un `?v=AAAAMMJJ`.
  La production garde ces fichiers en cache ; changer la date à chaque
  publication qui les modifie.
- **Non publiés** : `ux/` (laboratoire UX), `tests/`, `README.md`, `PUBLIC.md`,
  `shared/acolyte-o.png`. `cas/_template.html` sert au pré-rendu seulement.
- **Noms internes** : le texte public ne cite que les moteurs présentés sur
  hocus.works. Northstar TEN, Sybil, Zoltar, Maze et Fumist n'y apparaissent pas.

## Sandbox historique (V1)

Le sandbox sert la V1 (`feat/acolyte-case-base-batch-01`) pour comparaison. Il
est indépendant de la production.

- Releases sous `/srv/acolyte-sandbox/releases`, lien atomique
  `/srv/acolyte-sandbox/current`.
- Service `acolyte-sandbox.service` (`server.py`, `127.0.0.1:8063`, expose
  `/health`), logs sous `/var/log/hocus-acolyte-sandbox/`.
- Route HTTPS protégée par Basic Auth et `noindex`.

En local, depuis un checkout de la branche applicative :

```bash
APP_ENV=local ./run.sh --port 4173
bash deploy/smoke-sandbox.sh
bash webapp/tests/smoke.sh
```

Livraison et retour arrière :

```bash
bash deploy/deploy-sandbox.sh feat/acolyte-case-base-batch-01
bash deploy/smoke-sandbox.sh https://sandbox.hocus.works/acolyte
bash deploy/rollback-sandbox.sh <nom-du-dossier-de-release>
```

Le sandbox reste sur la V1 : ne pas y déployer la V2. Celle-ci se prévisualise
dans les labs, sous `/prototype/acolyte-v2/` (voir `docs/acolyte.md` de
`hocus-prototype`).
