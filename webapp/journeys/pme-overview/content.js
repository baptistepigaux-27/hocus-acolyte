(() => {
  'use strict';

  const journeys = window.ACOLYTE_JOURNEYS || (window.ACOLYTE_JOURNEYS = {});

  const transformationLevels = [
    { key: 'individual', number: '01', label: 'Individu augmenté', detail: 'Une personne travaille mieux avec l’IA.' },
    { key: 'knowledge', number: '02', label: 'Connaissance', detail: 'Les documents de l’entreprise deviennent interrogeables.' },
    { key: 'process', number: '03', label: 'Processus augmentés', detail: 'Une chaîne métier gagne en vitesse et en qualité.' },
    { key: 'agent', number: '04', label: 'Agents', detail: 'Un objectif déclenche plusieurs étapes bornées.' },
    { key: 'product', number: '05', label: 'Outil métier', detail: 'Un besoin récurrent devient une interface dédiée.' },
    { key: 'company', number: '06', label: 'Entreprise AI-native', detail: 'Humains, données, logiciels et contrôles forment un système.' }
  ];

  const opportunityLevels = [
    { key: 'individual', label: 'Individu augmenté', shortLabel: 'Individu', description: 'Le travail quotidien d’une personne.' },
    { key: 'knowledge', label: 'Connaissance', shortLabel: 'Connaissance', description: 'Les savoirs et documents utiles.' },
    { key: 'process', label: 'Processus', shortLabel: 'Processus', description: 'Une chaîne de travail mesurable.' },
    { key: 'agent', label: 'Agent', shortLabel: 'Agent', description: 'Un objectif et des étapes bornées.' },
    { key: 'product', label: 'Outil métier', shortLabel: 'Outil métier', description: 'Une capacité récurrente dédiée.' }
  ];

  const opportunities = [
    {
      key: 'direction',
      label: 'Direction',
      opportunities: {
        individual: ['préparer un CODIR', 'synthétiser une décision'],
        knowledge: ['retrouver les indicateurs clés', 'retracer les arbitrages passés'],
        process: ['préparer la revue d’activité', 'suivre les plans d’action'],
        agent: ['préparer une note de décision', 'surveiller des signaux faibles'],
        product: ['cockpit de pilotage', 'outil d’arbitrage']
      }
    },
    {
      key: 'commerce',
      label: 'Commerce',
      opportunities: {
        individual: ['préparer un rendez-vous', 'rédiger un mail', 'faire une synthèse'],
        knowledge: ['retrouver l’historique client', 'interroger le catalogue', 'retrouver les offres précédentes'],
        process: ['qualifier une demande', 'préparer un devis', 'répondre à un appel d’offres'],
        agent: ['préparer automatiquement un dossier commercial', 'proposer les prochaines actions'],
        product: ['sales intelligence', 'scoring commercial', 'moteur d’opportunité']
      }
    },
    {
      key: 'marketing',
      label: 'Marketing',
      opportunities: {
        individual: ['produire une campagne', 'adapter un message', 'analyser un retour'],
        knowledge: ['retrouver les personas', 'interroger les contenus validés'],
        process: ['qualifier les briefs', 'enchaîner contenu et validation'],
        agent: ['surveiller une veille', 'proposer des angles de campagne'],
        product: ['observatoire marché', 'moteur de contenu']
      }
    },
    {
      key: 'sav-adv',
      label: 'SAV / ADV',
      opportunities: {
        individual: ['préparer une réponse', 'résumer un dossier client'],
        knowledge: ['retrouver une procédure', 'retrouver les conditions contractuelles'],
        process: ['classifier une demande', 'router un ticket', 'contrôler une pièce'],
        agent: ['préparer le dossier avant traitement', 'relancer une information manquante'],
        product: ['assistant documentaire', 'outil de diagnostic client']
      }
    },
    {
      key: 'finance',
      label: 'Finance',
      opportunities: {
        individual: ['préparer un reporting', 'analyser une variation'],
        knowledge: ['retrouver une règle', 'interroger les contrats et référentiels'],
        process: ['contrôler une facture', 'rapprocher des écritures', 'signaler une anomalie'],
        agent: ['préparer une clôture', 'expliquer les écarts'],
        product: ['cockpit de trésorerie', 'moteur d’anomalies']
      }
    },
    {
      key: 'rh',
      label: 'RH',
      opportunities: {
        individual: ['préparer un entretien', 'rédiger une annonce'],
        knowledge: ['retrouver une politique interne', 'interroger le référentiel RH'],
        process: ['guider un onboarding', 'traiter une demande interne'],
        agent: ['préparer un parcours d’arrivée', 'rappeler les étapes manquantes'],
        product: ['assistant RH interne', 'observatoire des compétences']
      }
    },
    {
      key: 'operations',
      label: 'Opérations',
      opportunities: {
        individual: ['préparer une intervention', 'résumer un incident'],
        knowledge: ['retrouver une procédure', 'interroger les fiches qualité'],
        process: ['contrôler un document', 'qualifier un incident', 'suivre une non-conformité'],
        agent: ['préparer un dossier d’intervention', 'proposer une séquence de contrôle'],
        product: ['cockpit qualité', 'outil de diagnostic opérationnel']
      }
    },
    {
      key: 'it-data',
      label: 'IT / Data',
      opportunities: {
        individual: ['documenter un système', 'analyser un jeu de données'],
        knowledge: ['retrouver l’architecture', 'interroger le catalogue de données'],
        process: ['qualifier un incident', 'contrôler une livraison'],
        agent: ['trier les alertes', 'préparer un diagnostic'],
        product: ['observatoire data', 'assistant de support technique']
      }
    }
  ];

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
      bullets: ['Individu augmenté : mieux préparer, écrire, analyser.', 'Connaissance : retrouver les règles, sources et décisions.', 'Processus : extraire, contrôler, recommander, agir.', 'Agents, outils métier et système d’entreprise : seulement si le besoin le justifie.'],
      visual: 'transformation-ladder',
      levels: transformationLevels,
      source: 'PME AI OVERVIEW · progression',
      speaker: 'Ces niveaux ne sont pas une échelle de maturité obligatoire. Ils sont une carte pour choisir le bon niveau d’investissement.',
      demo: 'Lecture guidée · du niveau 1 au niveau 6.',
      interactive: false
    },
    {
      id: 3,
      act: 2,
      actLabel: 'Explorer les possibles',
      title: 'Opportunity Map : où regarder dans votre entreprise ?',
      message: 'Choisissez une fonction métier pour voir comment les possibilités évoluent du travail individuel à l’outil métier.',
      bullets: ['Une même fonction peut avoir plusieurs niveaux d’opportunité.', 'Chaque exemple reste à confronter aux données et au processus réel.', 'La carte sert à discuter et à choisir un premier sujet.'],
      visual: 'opportunity-map',
      source: 'PME AI OVERVIEW · matrice métiers × niveaux',
      speaker: 'La carte évite de partir d’une technologie. On part d’un métier, puis on regarde ce qui peut être augmenté, connecté, orchestré ou outillé.',
      demo: 'LIVE · sélectionner Commerce, puis comparer Finance ou Opérations.',
      demoType: 'LIVE',
      wow: true,
      interactive: true,
      interaction: {
        kind: 'opportunity-map',
        intro: 'Sélectionnez un métier : la même grille se recompose autour de ses opportunités.',
        levels: opportunityLevels,
        functions: opportunities,
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
