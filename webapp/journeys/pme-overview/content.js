(() => {
  'use strict';

  const journeys = window.ACOLYTE_JOURNEYS || (window.ACOLYTE_JOURNEYS = {});
  const opportunityCatalog = window.ACOLYTE_PME_OPPORTUNITIES || [];
  const solutionCatalog = window.ACOLYTE_PME_SOLUTIONS || [];

  const transformationLevels = [
    { key: 'individual', number: '01', label: 'Individu augmenté', detail: 'Une personne travaille mieux avec l’IA.', investment: 'léger', timeToImpact: 'jours' },
    { key: 'knowledge', number: '02', label: 'Connaissance', detail: 'L’entreprise retrouve et exploite son savoir.', investment: 'moyen', timeToImpact: 'semaines' },
    { key: 'process', number: '03', label: 'Processus augmentés', detail: 'Une chaîne de travail devient plus rapide ou fiable.', investment: 'moyen', timeToImpact: 'semaines' },
    { key: 'agent', number: '04', label: 'Agents', detail: 'Un objectif déclenche plusieurs actions.', investment: 'moyen à fort', timeToImpact: 'semaines à mois' },
    { key: 'product', number: '05', label: 'Outil métier', detail: 'Une capacité devient récurrente et dédiée.', investment: 'fort', timeToImpact: 'mois' },
    { key: 'company', number: '06', label: 'Entreprise AI-native', detail: 'Humains, données, logiciels et IA forment un système.', investment: 'transformation', timeToImpact: 'continu' }
  ];

  const opportunityLevels = [
    { key: 'individual', label: 'Individu augmenté', shortLabel: 'Individu', description: 'Le travail quotidien d’une personne.' },
    { key: 'knowledge', label: 'Connaissance', shortLabel: 'Connaissance', description: 'Les savoirs et documents utiles.' },
    { key: 'process', label: 'Processus', shortLabel: 'Processus', description: 'Une chaîne de travail mesurable.' },
    { key: 'agent', label: 'Agent', shortLabel: 'Agent', description: 'Un objectif et des étapes bornées.' },
    { key: 'product', label: 'Outil métier', shortLabel: 'Outil métier', description: 'Une capacité récurrente dédiée.' }
  ];

  const functionDefinitions = [
    { key: 'direction', label: 'Direction' },
    { key: 'commerce', label: 'Commerce' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'sav-adv', label: 'SAV / ADV' },
    { key: 'finance', label: 'Finance' },
    { key: 'rh', label: 'RH' },
    { key: 'operations', label: 'Opérations' },
    { key: 'it-data', label: 'IT / Data' }
  ];

  const opportunityFunctions = functionDefinitions.map((businessFunction) => ({
    ...businessFunction,
    opportunities: Object.fromEntries(opportunityLevels.map((level) => [
      level.key,
      opportunityCatalog.filter((opportunity) => opportunity.function === businessFunction.key && opportunity.level === level.key)
    ]))
  }));

  const priorityCards = [
    { key: 'quick-wins', label: 'QUICK WINS', detail: 'Faible complexité · impact rapide', example: 'Préparer les rendez-vous commerciaux', gate: 'Tester en jours' },
    { key: 'process-wins', label: 'PROCESS WINS', detail: 'Une chaîne métier devient mesurable', example: 'Classifier et router les demandes SAV', gate: 'Tester en semaines' },
    { key: 'strategic-bets', label: 'STRATEGIC BETS', detail: 'Outil propriétaire · différenciation', example: 'Moteur d’opportunité métier', gate: 'POC puis mesure' },
    { key: 'not-now', label: 'NOT NOW', detail: 'Intéressant mais données ou processus immatures', example: 'Automatisation sans responsable identifié', gate: 'Revenir plus tard' }
  ];

  const slides = [
    {
      id: 1,
      act: 1,
      actLabel: 'Ce que l’IA peut déjà changer demain matin',
      title: 'Une PME n’a pas « un cas d’usage IA »',
      message: 'L’IA peut intervenir à plusieurs niveaux, du travail individuel jusqu’au fonctionnement de l’entreprise.',
      bullets: ['Augmenter une personne sans changer tout le processus.', 'Rendre la connaissance de l’entreprise accessible.', 'Transformer un processus avant d’automatiser.', 'Construire un outil métier quand le besoin devient récurrent.'],
      visual: 'pme-levels',
      levels: transformationLevels,
      source: 'PME AI OVERVIEW · modèle mental',
      speaker: 'La première question n’est pas « quel outil IA acheter ? ». C’est « à quel niveau de travail voulons-nous obtenir un progrès mesurable ? »',
      demo: 'Ouverture · progression des six niveaux.',
      interactive: false
    },
    {
      id: 2,
      act: 1,
      actLabel: 'Ce que l’IA peut déjà changer demain matin',
      title: 'Six niveaux de transformation',
      message: 'On peut commencer petit sans limiter la vision : chaque niveau répond à un besoin différent.',
      bullets: ['Ce n’est pas une échelle de maturité obligatoire.', 'Un besoin peut être résolu au niveau individu ou processus.', 'Le niveau d’investissement va de léger à transformation.', 'Le time to impact est indicatif : jours, semaines, mois.'],
      visual: 'transformation-ladder',
      levels: transformationLevels,
      source: 'PME AI OVERVIEW · progression business',
      speaker: 'Ces niveaux ne sont pas une échelle de maturité obligatoire. Ils servent à choisir le bon niveau de solution pour le problème réel.',
      demo: 'Lecture guidée · niveau d’investissement et délai indicatif.',
      interactive: false
    },
    {
      id: 3,
      act: 2,
      actLabel: 'Explorer les possibles',
      title: 'Opportunity Map : où regarder dans votre entreprise ?',
      message: 'Choisissez une fonction métier pour voir comment les possibilités évoluent du travail individuel à l’outil métier.',
      bullets: ['Une même fonction peut avoir plusieurs niveaux d’opportunité.', 'Cliquez sur une carte pour ouvrir la fiche du cas d’usage.', 'La carte sert à discuter avant de choisir un premier sujet.'],
      visual: 'opportunity-map',
      source: 'PME AI OVERVIEW · matrice métiers × niveaux',
      speaker: 'La carte évite de partir d’une technologie. On part d’un métier, puis on regarde ce qui peut être augmenté, connecté, orchestré ou outillé.',
      demo: 'LIVE · sélectionner Commerce, ouvrir Répondre à un appel d’offres, puis comparer Finance.',
      demoType: 'LIVE',
      wow: true,
      interactive: true,
      interaction: {
        kind: 'opportunity-map',
        intro: 'Sélectionnez un métier, puis ouvrez une carte pour regarder le besoin, la solution et le mode de mise en œuvre.',
        levels: opportunityLevels,
        functions: opportunityFunctions,
        solutions: solutionCatalog,
        defaultFunction: 'commerce'
      }
    },
    {
      id: 4,
      act: 3,
      actLabel: 'Par où commencer ?',
      title: 'Toutes les opportunités ne se valent pas',
      message: 'Le bon premier sujet combine valeur visible, données accessibles, processus compris et risque maîtrisé.',
      bullets: ['Quick win : un progrès rapide sur un irritant concret.', 'Process win : une chaîne métier à rendre plus fiable.', 'Strategic bet : un outil propriétaire à tester avec un POC.', 'Not now : une idée à garder hors de la roadmap immédiate.'],
      visual: 'pme-prioritization',
      priorityCards,
      source: 'PME AI OVERVIEW · priorisation',
      speaker: 'Commencer petit ne signifie pas penser petit. Cela signifie obtenir assez de preuves pour décider du prochain niveau.',
      demo: 'Discussion · valeur, faisabilité, délai et risque.',
      interactive: false
    }
  ];

  const journey = {
    config: {
      key: 'pme',
      shortLabel: 'PME AI OVERVIEW',
      label: 'L’IA dans une PME',
      description: 'Explorer les transformations possibles et identifier les opportunités prioritaires.'
    },
    slides
  };

  journeys.pme = journey;
  journeys['pme-overview'] = journey;
})();
