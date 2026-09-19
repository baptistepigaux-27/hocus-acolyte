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

  const solutionFamilies = solutionCatalog.map((solution) => ({
    key: solution.key,
    family: solution.family,
    description: solution.description,
    modes: solution.modes,
    examples: solution.examples
  }));

  const roleProfiles = [
    { key: 'direction', label: 'Direction', tasks: ['Préparer un CODIR', 'Comparer des options', 'Faire ressortir les décisions'], solutionCategory: 'general-copilots', approach: 'BUY', timeToImpact: 'JOURS' },
    { key: 'commerce', label: 'Commerce', tasks: ['Préparer un rendez-vous', 'Rédiger un mail contextualisé', 'Identifier les prochaines actions'], solutionCategory: 'general-copilots', approach: 'BUY', timeToImpact: 'JOURS' },
    { key: 'finance', label: 'Finance', tasks: ['Préparer un reporting', 'Expliquer une variation', 'Contrôler une facture'], solutionCategory: 'general-copilots', approach: 'BUY', timeToImpact: 'JOURS' },
    { key: 'rh', label: 'RH', tasks: ['Préparer un entretien', 'Adapter un parcours d’arrivée', 'Répondre à une question interne'], solutionCategory: 'general-copilots', approach: 'BUY', timeToImpact: 'JOURS' }
  ];

  const processSteps = [
    { label: 'DCE', detail: 'entrée' },
    { label: 'EXTRACTION', detail: 'faits' },
    { label: 'CRITÈRES', detail: 'règles' },
    { label: 'CONTRÔLE', detail: 'écarts' },
    { label: 'ANALYSE', detail: 'risques' },
    { label: 'RECOMMANDATION', detail: 'score' },
    { label: 'HUMAIN', detail: 'validation' },
    { label: 'ACTION', detail: 'réponse' }
  ];

  const automationModes = [
    { key: 'assistant', label: 'ASSISTANT', flow: 'demande → réponse', example: 'Résumer un document', family: 'Copilote' },
    { key: 'automation', label: 'AUTOMATISATION', flow: 'événement → règles → action', example: 'Router une facture', family: 'Workflow' },
    { key: 'agent', label: 'AGENT', flow: 'objectif → plan → outils → observations → actions', example: 'Préparer un dossier commercial', family: 'Agent métier' }
  ];

  const buildSteps = [
    { label: 'PROMPT', detail: 'usage ponctuel' },
    { label: 'TEMPLATE', detail: 'usage répétitif' },
    { label: 'WORKFLOW', detail: 'plusieurs étapes' },
    { label: 'AGENT', detail: 'décisions intermédiaires' },
    { label: 'APPLICATION', detail: 'utilisateurs + données + mesure' }
  ];

  const functionExamples = functionDefinitions.map((businessFunction) => {
    const opportunities = opportunityCatalog.filter((opportunity) => opportunity.function === businessFunction.key);
    const byLevel = (level) => opportunities.find((opportunity) => opportunity.level === level);
    return {
      key: businessFunction.key,
      label: businessFunction.label,
      quickWin: byLevel('individual'),
      processWin: byLevel('process'),
      strategicBet: byLevel('product')
    };
  });

  const decisionAxes = [
    { key: 'value', label: 'VALUE', question: 'Pourquoi cela compte ?', detail: 'Commerce · revenu à protéger' },
    { key: 'feasibility', label: 'FEASIBILITY', question: 'Peut-on réellement le faire ?', detail: 'Finance · factures disponibles' },
    { key: 'time', label: 'TIME TO IMPACT', question: 'Quand la valeur arrive-t-elle ?', detail: 'SAV · routage rapide' },
    { key: 'risk', label: 'RISK', question: 'Qu’est-ce qui peut mal se passer ?', detail: 'RH · données sensibles' }
  ];

  const scoringCases = [
    { opportunityId: 'sales-meeting', label: 'Préparer un rendez-vous commercial', value: 'HIGH', feasibility: 'HIGH', time: 'DAYS', risk: 'LOW', note: 'Commerce · une première preuve rapide sur un irritant quotidien.', evidence: ['historique CRM disponible', 'responsable commercial identifié'] },
    { opportunityId: 'finance-invoice', label: 'Contrôler une facture', value: 'MEDIUM / HIGH', feasibility: 'HIGH', time: 'WEEKS', risk: 'MEDIUM', note: 'Finance · une chaîne de contrôle avec règles et exceptions.', evidence: ['règles de contrôle stabilisées', 'système comptable accessible'] },
    { opportunityId: 'ops-incident', label: 'Qualifier un incident', value: 'HIGH', feasibility: 'MEDIUM', time: 'WEEKS', risk: 'MEDIUM', note: 'Opérations · réduire le délai tout en gardant le diagnostic vérifiable.', evidence: ['procédure qualité à jour', 'responsable de validation identifié'] }
  ];

  const portfolioCards = [
    { key: 'quick-wins', label: 'QUICK WINS', description: 'Tester en jours', opportunityId: 'sales-meeting' },
    { key: 'process-wins', label: 'PROCESS WINS', description: 'Rendre une chaîne mesurable', opportunityId: 'sav-routing' },
    { key: 'strategic-bets', label: 'STRATEGIC BETS', description: 'Construire une différenciation', opportunityId: 'direction-cockpit' },
    { key: 'not-now', label: 'NOT NOW', description: 'Garder l’idée sous surveillance', opportunityId: 'marketing-observatory' }
  ];

  const roadmapPhases = [
    { period: '0–30', title: 'CARTOGRAPHIER', items: ['irritants', 'formation', 'règles', 'quick wins'], gate: 'premières preuves' },
    { period: '30–60', title: 'CONNECTER', items: ['processus', 'données', 'POC'], gate: 'périmètre borné' },
    { period: '60–90', title: 'DÉCIDER', items: ['mesurer', 'comparer', 'arrêter / itérer / industrialiser'], gate: 'décision assumée' }
  ];

  const systemComponents = [
    { key: 'knowledge', label: 'CONNAISSANCE', detail: 'sources' },
    { key: 'data', label: 'DONNÉES', detail: 'faits' },
    { key: 'software', label: 'LOGICIELS', detail: 'interfaces' },
    { key: 'workflows', label: 'WORKFLOWS', detail: 'règles' },
    { key: 'agents', label: 'AGENTS', detail: 'orchestration' },
    { key: 'controls', label: 'CONTRÔLES', detail: 'preuves' }
  ];

  const conclusionSteps = ['IDENTIFIER', 'CARTOGRAPHIER', 'PRIORISER', 'PROTOTYPER', 'MESURER', 'INDUSTRIALISER'];

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
      act: 2,
      actLabel: 'Explorer les possibles',
      title: 'Les grandes familles de solutions',
      message: 'Une opportunité appelle une famille de réponse. Les marques viennent ensuite, comme exemples possibles.',
      bullets: ['Copilotes : aider une personne à comprendre et produire.', 'Knowledge / Search : retrouver une réponse avec ses sources.', 'Automation / Workflow : relier des étapes et des systèmes.', 'Agents et App Builders : orchestrer ou créer une capacité dédiée.'],
      visual: 'solution-families',
      families: solutionFamilies,
      source: 'PME AI OVERVIEW · familles de solutions',
      speaker: 'On choisit d’abord le type de capacité attendu. Une marque n’est jamais la réponse en soi : elle dépend du contexte, des données et des responsabilités.',
      demo: 'Lecture · famille, mode BUY / CONFIGURE / BUILD, exemples.',
      interactive: false
    },
    {
      id: 5,
      act: 3,
      actLabel: 'Comment le faire',
      title: 'Individu augmenté',
      message: 'L’IA crée déjà de la valeur quand elle améliore le travail quotidien d’une personne.',
      bullets: ['Partir d’un irritant visible et fréquent.', 'Faire produire, comparer ou préparer avec un copilote.', 'Mesurer le temps gagné et la qualité de sortie.', 'Approche fréquente : BUY · impact en jours.'],
      visual: 'role-selector',
      source: 'PME AI OVERVIEW · individu augmenté',
      speaker: 'Le premier niveau ne demande pas de refondre l’entreprise. Il demande de choisir un geste de travail, une personne responsable et une mesure simple.',
      demo: 'LIVE · comparer Direction, Commerce, Finance et RH.',
      interactive: true,
      interaction: { kind: 'role-selector', roles: roleProfiles, solutions: solutionCatalog, defaultRole: 'commerce' }
    },
    {
      id: 6,
      act: 3,
      actLabel: 'Comment le faire',
      title: 'Quand l’IA connaît l’entreprise',
      message: 'Le deuxième saut consiste à retrouver une réponse contextualisée, avec les sources qui permettent de la vérifier.',
      bullets: ['DOCUMENTS + DONNÉES + DÉCISIONS + HISTORIQUE.', 'Recherche puis réponse sourcée.', 'BUY pour commencer, CONFIGURE si les sources et droits deviennent spécifiques.', 'BUILD seulement si la méthode ou la restitution sont différenciantes.'],
      visual: 'knowledge-journey',
      source: 'PME AI OVERVIEW · connaissance d’entreprise',
      speaker: 'La question « avons-nous déjà répondu à ce type d’appel d’offres ? » change de qualité dès qu’elle peut retrouver un projet similaire, une décision passée et leurs sources.',
      demo: 'LIVE · basculer entre sans connaissance et avec connaissance.',
      interactive: true,
      interaction: { kind: 'knowledge-journey', solutions: solutionCatalog }
    },
    {
      id: 7,
      act: 3,
      actLabel: 'Comment le faire',
      title: 'Quand l’IA entre dans le processus',
      message: 'Le besoin devient récurrent : on relie les étapes, on traite les exceptions et on garde une validation humaine.',
      bullets: ['Le fil rouge AO devient une chaîne observable.', 'Chaque étape a une entrée et une preuve attendue.', 'L’automatisation accélère les règles connues.', 'L’humain garde la responsabilité de la réponse.'],
      visual: 'process-pipeline',
      steps: processSteps,
      source: 'PME AI OVERVIEW · processus augmenté',
      speaker: 'Le ROI devient souvent concret quand une chaîne répétée est assez claire pour être mesurée : délai, erreurs, passages manuels et exceptions.',
      demo: 'Lecture · du DCE à la validation puis à l’action.',
      interactive: false
    },
    {
      id: 8,
      act: 3,
      actLabel: 'Comment le faire',
      title: 'Assistant, automatisation ou agent ?',
      message: 'Tout ne doit pas devenir un agent. La bonne forme dépend du degré de variabilité et du niveau de décision attendu.',
      bullets: ['Assistant : demande → réponse.', 'Automatisation : événement → règles → action.', 'Agent : objectif → plan → outils → observations → actions.', 'Commencer par la forme la plus simple qui produit la preuve.'],
      visual: 'automation-compare',
      modes: automationModes,
      source: 'PME AI OVERVIEW · formes de solution',
      speaker: 'Un agent est utile quand il doit choisir plusieurs étapes dans un cadre borné. Ce n’est pas une médaille de maturité, encore moins un objectif systématique.',
      demo: 'Comparaison · résumer, router, préparer un dossier.',
      interactive: false
    },
    {
      id: 9,
      act: 3,
      actLabel: 'Comment le faire',
      title: 'Un agent métier, borné et vérifiable',
      message: '« Prépare mon rendez-vous commercial de demain » devient un objectif, pas une permission de tout faire.',
      bullets: ['Récupérer les sources autorisées.', 'Comparer les informations et signaler les manques.', 'Préparer un briefing exploitable.', 'CONFIGURE ou BUILD · validation humaine avant toute action conséquente.'],
      visual: 'agent-business',
      source: 'PME AI OVERVIEW · agent métier',
      speaker: 'L’agent peut chercher, comparer et préparer. Il ne décide pas seul de contacter le client, d’engager un prix ou de répondre à l’appel d’offres.',
      demo: 'LIVE · révéler les étapes puis le human gate.',
      interactive: true,
      interaction: { kind: 'agent-business' }
    },
    {
      id: 10,
      act: 4,
      actLabel: 'Avec quoi',
      title: 'Quand construire un outil métier ?',
      message: 'On évolue du prompt vers l’application quand le besoin devient récurrent, partagé, mesuré et réellement spécifique.',
      bullets: ['Prompt : usage ponctuel.', 'Template : usage répétitif.', 'Workflow : plusieurs étapes.', 'Application : utilisateurs, données, mesure et logique propriétaire.'],
      visual: 'build-threshold',
      steps: buildSteps,
      source: 'PME AI OVERVIEW · seuil de construction',
      speaker: 'Construire est une décision de produit et d’exploitation. Elle se justifie par la récurrence, le nombre d’utilisateurs, la donnée à structurer et la mesure à suivre.',
      demo: 'Lecture · le niveau de récurrence fait évoluer la réponse.',
      interactive: false
    },
    {
      id: 11,
      act: 4,
      actLabel: 'Avec quoi',
      title: 'Exemples par fonction',
      message: 'Chaque fonction peut identifier un quick win, un process win et un pari stratégique sans refaire toute la matrice.',
      bullets: ['Direction, Commerce, Marketing, SAV / ADV.', 'Finance, RH, Opérations, IT / Data.', 'Une première idée par horizon.', 'Un clic renvoie vers la carte métier pour approfondir.'],
      visual: 'function-overview',
      source: 'PME AI OVERVIEW · exemples par fonction',
      speaker: 'Cette vue sert à faire émerger une conversation. La fiche détaillée et les signaux de faisabilité restent dans l’Opportunity Map.',
      demo: 'LIVE · choisir une fonction puis ouvrir sa carte.',
      interactive: true,
      interaction: { kind: 'function-overview', functions: functionExamples }
    },
    {
      id: 12,
      act: 5,
      actLabel: 'Acheter ou construire',
      title: 'Toutes les opportunités ne se valent pas',
      message: 'Le bon premier sujet combine valeur visible, faisabilité réelle, délai acceptable et risque maîtrisé.',
      bullets: ['VALUE : pourquoi cela compte ?', 'FEASIBILITY : les données et le processus sont-ils accessibles ?', 'TIME TO IMPACT : quand la valeur arrive-t-elle ?', 'RISK : qui vérifie et que se passe-t-il en cas d’erreur ?'],
      visual: 'decision-axes',
      axes: decisionAxes,
      source: 'PME AI OVERVIEW · axes de décision',
      speaker: 'Ces quatre axes empêchent de confondre une idée séduisante avec un premier sujet praticable. Ils structurent la discussion, ils ne remplacent pas l’examen du terrain.',
      demo: 'Discussion · valeur, faisabilité, délai et risque.',
      interactive: false
    },
    {
      id: 13,
      act: 5,
      actLabel: 'Acheter ou construire',
      title: 'Opportunity Scoring',
      message: 'Un support de discussion, pas un chiffre pseudo-scientifique : comparer quelques cas avec les mêmes questions.',
      bullets: ['Préparation de rendez-vous : HIGH / HIGH / DAYS / LOW.', 'Réponse AO : HIGH / MEDIUM / WEEKS / MEDIUM.', 'Moteur d’opportunité : HIGH / MEDIUM / MONTHS / MEDIUM.', 'Le score ne remplace ni le processus, ni les données, ni les responsabilités.'],
      visual: 'opportunity-scoring',
      source: 'PME AI OVERVIEW · scoring de discussion',
      speaker: 'On ne fabrique pas un classement automatique. On rend visibles les hypothèses à vérifier avant de choisir un POC.',
      demo: 'LIVE · comparer les trois cas du fil rouge.',
      interactive: true,
      interaction: { kind: 'opportunity-scoring', cases: scoringCases, defaultCase: 'sales-tender' }
    },
    {
      id: 14,
      act: 5,
      actLabel: 'Acheter ou construire',
      title: 'Portfolio : décider où investir l’attention',
      message: 'Un portefeuille équilibré sépare les preuves rapides, les processus à sécuriser, les paris différenciants et les idées à remettre à plus tard.',
      bullets: ['QUICK WINS : tester en jours.', 'PROCESS WINS : rendre une chaîne mesurable.', 'STRATEGIC BETS : construire avec un POC.', 'NOT NOW : conserver sans encombrer la roadmap.'],
      visual: 'portfolio',
      source: 'PME AI OVERVIEW · portefeuille d’opportunités',
      speaker: 'Le portefeuille donne une place aux idées ambitieuses sans leur donner automatiquement la priorité. Chaque case porte un prochain geste différent.',
      demo: 'LIVE · cliquer une carte pour voir métier, niveau et approche.',
      interactive: true,
      interaction: { kind: 'portfolio-explorer', cards: portfolioCards, opportunities: opportunityCatalog, functions: functionDefinitions, levels: opportunityLevels }
    },
    {
      id: 15,
      act: 6,
      actLabel: 'Quoi faire maintenant',
      title: 'Une roadmap en 90 jours',
      message: 'Le POC sert à décider : il doit produire une preuve, une mesure et un choix clair pour la suite.',
      bullets: ['0–30 : cartographier, former, sélectionner, tester.', '30–60 : choisir un processus, connecter les données, lancer un POC.', '60–90 : mesurer, comparer, arrêter, itérer ou industrialiser.', 'Chaque phase se termine par une décision.'],
      visual: 'roadmap',
      phases: roadmapPhases,
      source: 'PME AI OVERVIEW · roadmap 90 jours',
      speaker: 'Une roadmap utile ne promet pas une mini-production éternelle. Elle crée des points de décision et accepte d’arrêter ce qui ne prouve pas sa valeur.',
      demo: 'Lecture · trois phases, trois gates de décision.',
      interactive: false
    },
    {
      id: 16,
      act: 6,
      actLabel: 'Vision',
      title: 'L’entreprise AI-native reste un système humain',
      message: 'Les humains restent au centre ; connaissance, données, logiciels, workflows, agents et contrôles renforcent leur capacité d’action.',
      bullets: ['L’IA orchestre des capacités, elle ne porte pas la responsabilité.', 'Les contrôles rendent les décisions conséquentes vérifiables.', 'La vision est un système de travail augmenté.', 'L’humain reste responsable des arbitrages.'],
      visual: 'ai-native',
      components: systemComponents,
      source: 'PME AI OVERVIEW · vision AI-native',
      speaker: 'AI-native ne veut pas dire agents partout. Cela veut dire que les bonnes sources, les bons logiciels, les bonnes règles et les bons contrôles travaillent ensemble autour des humains.',
      demo: 'Lecture · le système autour du centre humain.',
      interactive: false
    },
    {
      id: 17,
      act: 6,
      actLabel: 'Conclusion',
      title: 'La vraie question',
      message: 'Où pouvons-nous améliorer un travail important, avec des données accessibles et un résultat mesurable ?',
      bullets: ['Identifier un travail important.', 'Cartographier les niveaux de possibilité.', 'Prioriser trois opportunités.', 'Prototyper, mesurer puis décider de la suite.'],
      visual: 'pme-conclusion',
      steps: conclusionSteps,
      source: 'PME AI OVERVIEW · méthode de sortie',
      speaker: 'La sortie attendue n’est pas un catalogue d’outils. Ce sont trois opportunités prioritaires, chacune avec une preuve à obtenir et un prochain geste.',
      demo: 'Clôture · trois opportunités prioritaires.',
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
