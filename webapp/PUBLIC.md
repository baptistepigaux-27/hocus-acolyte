# Acolyte V2 — version publique

Ce dossier est prêt à être publié tel quel sur hocus.works sous `/acolyte/`
(`scripts/sync-acolyte.py` du dépôt `hocus-prototype` le copie sans le
retoucher, puis pré-rend une page par fiche sous `cas/{slug}/`).

- Pas publiés : `ux/` (laboratoire UX), `tests/`, `README.md`,
  `shared/acolyte-o.png` (source haute définition du logo).
- `cas/_template.html` est le gabarit des pages de fiche ; il n'est pas publié.
- Les liens vers HOCUS (`/`, `/works/diagnostic/`, `/works/`, `/atelier/…`)
  sont absolus : ils visent le site qui héberge Acolyte.
- `explore/explore.js` porte la correspondance fiche → offre HOCUS
  (`hocusFor`) et redirige les anciens liens `?case=` vers `cas/{slug}/`.
