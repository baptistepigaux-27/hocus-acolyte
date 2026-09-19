# Review EXPLORE MVP — staging

Review réalisée le 18 septembre 2026 sur la branche `feat/issue-7-explore-catalog`, PR #8 (draft), avec les viewports desktop 1440 × 1000 et mobile 390 × 844. URL cible : `https://staging.hocus.works/acolyte/explore/`.

## 1. Ce qui fonctionne tel quel

- Le catalogue charge le corpus canonique de 48 fiches, affiche le compteur global et conserve la distinction entre `REAL CASE` et `OPPORTUNITÉ`.
- La recherche couvre le titre, le problème, la fonction, le secteur, le type de solution et le pattern IA. Les filtres se combinent, le reset fonctionne et les pastilles de recherche/filtres permettent maintenant un retrait unitaire.
- Les quatre niveaux de preuve sont compréhensibles dans la légende et sur les cartes, avec une explication au survol. Les quatre valeurs restent sélectionnables même si le corpus courant n’en contient pas toutes.
- La carte expose un point de départ utile : titre, problème, secteur, fonction, solution et autonomie. La grille reste lisible sur desktop et passe à une colonne sur mobile.
- La fiche détail distingue les faits de contexte, le mécanisme, les données, les outils, l’impact, les prérequis, les limites, la source, la provenance et la confiance. Les résultats sont étiquetés `RAPPORTÉ`, `PROJETÉ` ou `OBSERVÉ` quand le corpus le permet.
- Les fiches documentées testées (Qonto, RIS, Sharp) permettent d’atteindre une première sélection crédible en moins de deux minutes, avec source et résultats visibles. Les cas proches et les ponts LEARN permettent de continuer sans ajouter de recommandation automatique.
- Le drawer de filtres mobile, le retour catalogue, les deep links de détail et les ponts LEARN ↔ EXPLORE fonctionnent sans débordement horizontal.
- La route est servie publiquement par le bloc Nginx `/acolyte/` de staging, avec `noindex` et cache désactivé. Les tests webapp, Explore, Tutorial et les contrôles de syntaxe passent localement.

## 2. Ce qui doit être corrigé avant merge

- **Couverture du corpus :** les 48 fiches contiennent 41 `Pattern` et 7 `Documenté`, mais aucune fiche `Expérience` ou `Concept`. Le sélecteur et l’état vide rendent ce manque visible ; il faut enrichir le corpus ou assumer explicitement cette limite avant de présenter l’échelle complète comme représentative.
- **Promesse sectorielle / fonctionnelle :** 41 fiches ont le secteur `Non renseigné`. Les parcours demandés `PME industrielle → opérations → workflow/agent`, `Retail → marketing → copilote` et `Assurance → knowledge` aboutissent donc à un état vide dans le corpus actuel. Le parcours `RH → copilote` renvoie bien une fiche. Il faut compléter les métadonnées ou réduire la promesse de filtrage sectoriel avant merge public ; il ne faut pas fabriquer ces correspondances dans l’interface.
- **Validation staging :** la release doit rester rattachée à la branche de la PR #8, être vérifiée sur `/acolyte/explore/` et ses deep links, puis laisser la PR ouverte en draft jusqu’à validation explicite. Aucun merge ni changement production n’est inclus dans ce périmètre.
- **Décision :** GO pour la revue UX du MVP déployé ; NO-GO pour un merge produit tant que la couverture des preuves et des scénarios sectoriels n’est pas acceptée par le responsable du corpus.

## 3. Ce qui est intéressant mais doit rester hors MVP

- Recommandation personnalisée, embeddings, recherche vectorielle et classement automatique.
- Comptes, contributions, commentaires, forks, versioning, scoring, comparaison et shortlist.
- WORKSHOP, génération de plan d’action ou passage direct du cas à une implémentation.
- Facettes avancées par sous-secteur, normalisation économique détaillée et métriques comparables entre sources.
- Enrichissement éditorial massif du corpus : à traiter comme un chantier de données séparé, avec provenance et validation, pas comme une correction UX de cette PR.
