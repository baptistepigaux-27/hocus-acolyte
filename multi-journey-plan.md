# Hocus Acolyte — architecture multi-journey

## Décision de première passe

Le shell, le moteur de navigation, le mode présentation, les notes, le responsive et les tests restent communs. Chaque journey expose seulement une configuration et une collection déclarative de slides. Une URL choisit le parcours :

```text
/acolyte/?journey=operating-system
/acolyte/?journey=pme
```

Le paramètre `slide` reste indépendant dans chaque parcours. En l’absence de `journey`, le moteur conserve `operating-system` comme défaut pour préserver les liens existants.

## Topologie

```text
webapp/
  app.js                         moteur partagé
  index.html                     shell partagé
  styles.css                     design system partagé
  content/slides.js              source historique Operating System
  journeys/
    operating-system/config.js   métadonnées + branchement du contenu OS
    pme-overview/content.js      contenu et données PME déclaratifs
  interactions/
    chatbot-agent.js             interaction OS
    context-builder.js           interaction OS
    memory-recall.js             interaction OS
    handoff.js                   interaction OS
    idea-product.js              interaction OS
    opportunity-map.js           interaction PME
```

`content/slides.js` reste à son emplacement pour limiter le risque de régression sur les URLs et la V2 déjà en staging. Il est enregistré comme journey Operating System par son fichier de configuration. Une migration physique vers `journeys/operating-system/content.js` pourra être faite séparément si elle apporte une valeur réelle.

## Vertical slice PME

La première passe couvre quatre écrans : ouverture, six niveaux de transformation, Opportunity Map filtrable par métier et priorisation. La matrice est déclarée dans le contenu PME ; le composant ne connaît ni les métiers ni leurs exemples.

L’interaction P0 affiche les huit fonctions métier et cinq niveaux de possibilités. La sélection d’une fonction recompose la ligne de matrice, sans appel externe ni état partagé avec Operating System.

## Extensions prévues

- ajouter les écrans PME par acte sans toucher au shell ;
- extraire les visuels génériques si plusieurs journeys les réutilisent ;
- ajouter un diagnostic PME dans un module de données séparé ;
- remplacer l’alias `pme` par un naming final si nécessaire, en conservant une redirection compatible.
