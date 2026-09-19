# HOCUS ACOLYTE — modèle de données PME V2

Le contenu PME est déclaratif. Le moteur de slides et l’interaction Opportunity Map ne connaissent pas les cas métier à l’avance.

## 1. Cas d’usage

Un cas d’usage est une opportunité identifiable dans une fonction et à un niveau de transformation.

```js
{
  id: 'sales-tender',
  function: 'commerce',
  level: 'process',
  label: 'Répondre à un appel d’offres',

  need: 'Lire un DCE, vérifier les exigences, identifier les risques et préparer la réponse.',
  inputs: ['DCE', 'historique', 'données entreprise'],
  capabilities: ['extraction', 'recherche', 'comparaison', 'scoring', 'génération'],

  solutionType: 'Workflow documentaire augmenté',
  solutionCategory: 'automation',
  implementation: 'CONFIGURE',
  tools: ['stockage documentaire', 'workflow automation', 'modèle IA'],
  customWhen: 'Construire si la méthode de qualification ou le score devient un actif différenciant.',

  why: 'Le bon niveau de solution dépend de la fréquence du besoin, du processus et de la preuve attendue.',
  successConditions: ['données accessibles', 'responsable métier', 'mesure possible'],
  valueSignals: ['revenu', 'temps de réponse', 'risque'],
  feasibilitySignals: ['DCE accessibles', 'critères explicites', 'responsable commercial'],
  risks: ['oubli d’exigence', 'réponse non conforme']
}
```

Champs obligatoires : `id`, `function`, `level`, `label`, `need`, `inputs`, `capabilities`, `solutionType`, `solutionCategory`, `implementation`, `tools`, `customWhen`, `successConditions`, `valueSignals`, `feasibilitySignals`, `risks`.

Les valeurs de `function` et `level` sont des clés stables. Les libellés affichés restent dans les configurations du journey. Une opportunité peut être ouverte depuis une carte, mais le composant ne fabrique pas son contenu.

## 2. Niveaux de transformation

```js
{
  key: 'process',
  label: 'Processus',
  shortLabel: 'Processus',
  description: 'Une chaîne de travail mesurable.'
}
```

Les six niveaux narratifs sont : `individual`, `knowledge`, `process`, `agent`, `product`, `company`. La matrice Opportunity Map utilise les cinq premiers ; `company` reste un niveau de vision.

## 3. Familles de solutions

Le catalogue est séparé dans [`webapp/journeys/pme-overview/solutions.js`](webapp/journeys/pme-overview/solutions.js).

```js
{
  key: 'automation',
  family: 'AUTOMATION / WORKFLOW',
  description: 'Connecter des systèmes et automatiser une chaîne connue.',
  modes: ['BUY', 'CONFIGURE'],
  examples: ['n8n', 'Make', 'Power Automate', 'Zapier', 'UiPath']
}
```

Familles initiales :

- `general-copilots` — aider une personne ;
- `knowledge` — exploiter la connaissance ;
- `automation` — connecter et automatiser un processus ;
- `agents` — poursuivre un objectif dans un cadre donné ;
- `app-builders` — créer une capacité métier dédiée.

Une famille décrit une capacité et un type de solution. `examples` fournit des exemples de produits ou de briques, sans transformer ces marques en dépendances du modèle d’opportunités.

## 4. BUY / CONFIGURE / BUILD

| Mode | Sens | Quand l’utiliser |
|---|---|---|
| `BUY` | Acheter une solution qui couvre l’essentiel. | Le besoin est courant, le processus est standard et le produit est suffisant. |
| `CONFIGURE` | Assembler des briques existantes. | Les données, le workflow et les règles doivent être reliés, sans actif propriétaire majeur. |
| `BUILD` | Créer un actif métier spécifique. | La logique, la méthode, le score ou l’interface sont différenciants et récurrents. |

Le mode est une hypothèse de cadrage, pas une recommandation automatique. Le champ `customWhen` explicite le seuil à partir duquel le sur-mesure devient pertinent.

## 5. Scoring pour la discussion

Le modèle de scoring reste qualitatif et explicable.

```js
{
  value: 'HIGH',
  feasibility: 'MEDIUM',
  timeToImpact: 'WEEKS',
  risk: 'MEDIUM',
  evidence: ['historique disponible', 'critères à stabiliser']
}
```

Axes :

- `value` : revenu, marge, temps, qualité, satisfaction ou risque évité ;
- `feasibility` : données, processus, intégration, compétences ;
- `timeToImpact` : `DAYS`, `WEEKS`, `MONTHS` ;
- `risk` : données, juridique, erreur, impact humain, dépendance.

Le scoring ne doit pas agréger ces axes dans un nombre présenté comme objectif. Il doit rendre visibles les désaccords et les éléments à vérifier.

## 6. Catalogue et pré-diagnostic futur

La future couche de diagnostic pourra produire un objet distinct :

```js
{
  sector: '...',
  size: '...',
  functions: ['commerce', 'finance'],
  tools: ['CRM', 'ERP'],
  dataSources: ['PDF', 'Excel'],
  irritants: ['...'],
  processes: ['...'],
  constraints: ['...']
}
```

Elle pourra ensuite filtrer le catalogue vers une `AI Opportunity Map` contenant : métier, cas d’usage, niveau, solution type, mode, valeur, faisabilité, risque et horizon. Ce moteur n’est pas construit dans la première livraison.

## 7. Invariants de test

- chaque opportunité possède un identifiant stable et une fiche complète ;
- chaque cas référence une `solutionCategory` existante ;
- `implementation` vaut uniquement `BUY`, `CONFIGURE` ou `BUILD` ;
- le moteur ne contient pas de nom de produit dans ses règles de filtrage ;
- le changement de métier ne conserve pas une fiche ouverte d’un autre métier ;
- le rechargement d’un journey réinitialise l’état d’interaction ;
- les données PME restent hors des composants génériques.
