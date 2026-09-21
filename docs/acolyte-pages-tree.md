# Acolyte — arbre des pages servies

Base de publication : `/acolyte/`

Le menu global est présent sur chacun de ces points d’entrée. Les barres
locales des parcours (filtres, variantes, contrôles de lecture) restent
disponibles lorsqu’elles apportent un contrôle spécifique à la page.

```text
/acolyte/
├── Home
│   ├── ?journey=operating-system&slide=N       Parcours Système de travail · 23 slides
│   ├── ?journey=pme&slide=N                    Parcours PME · 17 slides
│   ├── ?module=cases&journey=pme&slide=3       Module Real Cases
│   ├── ?module=agent-lab&journey=pme&slide=3   Module Agent Lab
│   └── ?module=memory-map&journey=pme&slide=3  Module Memory Map
│
├── explore/                                    EXPLORE · catalogue des 100 cas
│   └── ?case=<case-id>                          Fiche détaillée d’un cas
│
├── ux/                                         Comparer · UX Lab Round 01
│   ├── current/?view=<view>                    UX actuelle / témoin
│   ├── editorial/?view=<view>                  Editorial Air
│   ├── playground/?view=<view>                 Product Playground
│   ├── field-guide/?view=<view>                Field Guide
│   └── round-2/                                 Comparer · UX Lab Round 02
│       ├── manual/?view=<view>                 Manuel de terrain
│       ├── lab/?view=<view>                    Lab / instrument
│       ├── system/?view=<view>                 HOCUS System
│       └── review/?view=<view>                 Revue d’intelligence appliquée
│
└── ux/tutorial/?slide=N                         Apprendre · Tutorial Boards · 10 leçons
```

## Vues contextuelles

Les pages UX Round 01 et Round 02 partagent les vues suivantes :

`home` · `learn` · `agent` · `explore` · `case`

Les paramètres `case=<case-id>` et `slide=N` sont des états de lecture, pas
de nouvelles pages physiques. Ils permettent de relier directement le menu,
les cas EXPLORE et les planches pédagogiques.

## Menu global

Chaque page expose les mêmes catégories :

- **Parcourir** — les parcours Système et PME ;
- **Explorer** — catalogue EXPLORE, Real Cases, Agent Lab, Memory Map ;
- **Comparer** — les quatre directions Round 01 et les quatre variantes Round 02 ;
- **Apprendre** — Tutorial Boards et retours vers les deux rounds UX.
