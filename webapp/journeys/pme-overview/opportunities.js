(() => {
  'use strict';

  const levelDefaults = {
    individual: {
      solutionCategory: 'general-copilots',
      solutionType: 'Copilote métier',
      implementation: 'BUY',
      inputs: ['emails', 'documents'],
      capabilities: ['synthèse', 'génération', 'analyse'],
      tools: ['modèle IA', 'copilote bureautique'],
      customWhen: 'Construire seulement si le contexte ou le résultat est vraiment propriétaire.',
      valueSignals: ['temps', 'qualité'],
      feasibilitySignals: ['données accessibles', 'usage simple'],
      risks: ['données sensibles', 'réponse à vérifier']
    },
    knowledge: {
      solutionCategory: 'knowledge',
      solutionType: 'Recherche documentaire augmentée',
      implementation: 'CONFIGURE',
      inputs: ['procédures', 'contrats', 'historique'],
      capabilities: ['recherche', 'extraction', 'réponse sourcée'],
      tools: ['stockage documentaire', 'recherche sémantique'],
      customWhen: 'Construire quand les règles, sources ou droits d’accès sont différenciants.',
      valueSignals: ['temps', 'fiabilité'],
      feasibilitySignals: ['sources identifiées', 'droits maîtrisés'],
      risks: ['source obsolète', 'droit d’accès']
    },
    process: {
      solutionCategory: 'automation',
      solutionType: 'Workflow métier augmenté',
      implementation: 'CONFIGURE',
      inputs: ['documents', 'emails', 'données métier'],
      capabilities: ['extraction', 'classification', 'contrôle', 'recommandation'],
      tools: ['workflow automation', 'connecteurs', 'modèle IA'],
      customWhen: 'Construire quand la logique métier ou la mesure exige un comportement spécifique.',
      valueSignals: ['délai', 'coût', 'qualité'],
      feasibilitySignals: ['processus décrit', 'systèmes connectables'],
      risks: ['erreur de classification', 'exception non traitée']
    },
    agent: {
      solutionCategory: 'agents',
      solutionType: 'Agent métier borné',
      implementation: 'CONFIGURE',
      inputs: ['objectif', 'historique', 'outils autorisés'],
      capabilities: ['planification', 'recherche', 'observation', 'action'],
      tools: ['modèle IA', 'outils métier', 'human gate'],
      customWhen: 'Construire si l’agent porte une méthode ou une décision propriétaire.',
      valueSignals: ['temps', 'capacité', 'réactivité'],
      feasibilitySignals: ['objectif clair', 'permissions définies'],
      risks: ['action non souhaitée', 'boucle difficile à contrôler']
    },
    product: {
      solutionCategory: 'app-builders',
      solutionType: 'Outil métier dédié',
      implementation: 'BUILD',
      inputs: ['données multiples', 'règles métier', 'historique'],
      capabilities: ['analyse', 'scoring', 'recommandation', 'visualisation'],
      tools: ['base de données', 'interface métier', 'API + LLM'],
      customWhen: 'Construire quand un actif métier différenciant mérite une interface et une mesure dédiées.',
      valueSignals: ['revenu', 'marge', 'différenciation'],
      feasibilitySignals: ['besoin récurrent', 'utilisateurs identifiés'],
      risks: ['intégration', 'dépendance', 'coût de maintenance']
    }
  };

  function makeOpportunity(data) {
    return {
      ...levelDefaults[data.level],
      why: 'Le bon niveau de solution dépend de la fréquence du besoin, du processus et de la preuve attendue.',
      successConditions: ['données accessibles', 'responsable métier', 'mesure possible'],
      ...data
    };
  }

  window.ACOLYTE_PME_OPPORTUNITIES = [
    makeOpportunity({ id: 'direction-codir', function: 'direction', level: 'individual', label: 'Préparer un CODIR', need: 'Synthétiser les sujets clés et préparer les décisions du CODIR.' }),
    makeOpportunity({ id: 'direction-knowledge', function: 'direction', level: 'knowledge', label: 'Retrouver les arbitrages', need: 'Retrouver une décision, son contexte et les points encore ouverts.' }),
    makeOpportunity({ id: 'direction-review', function: 'direction', level: 'process', label: 'Préparer la revue d’activité', need: 'Assembler les indicateurs et faire ressortir les écarts à discuter.' }),
    makeOpportunity({ id: 'direction-signals', function: 'direction', level: 'agent', label: 'Surveiller les signaux faibles', need: 'Repérer régulièrement les changements qui méritent un arbitrage.' }),
    makeOpportunity({ id: 'direction-cockpit', function: 'direction', level: 'product', label: 'Cockpit de pilotage', need: 'Relier indicateurs, décisions et plans d’action dans une vue métier.' }),

    makeOpportunity({ id: 'sales-meeting', function: 'commerce', level: 'individual', label: 'Préparer un rendez-vous', need: 'Préparer un rendez-vous commercial avec les bons faits, questions et prochaines actions.', inputs: ['CRM', 'emails', 'notes de rendez-vous'], capabilities: ['synthèse', 'recherche', 'génération'], solutionType: 'Copilote commercial connecté', tools: ['CRM', 'modèle IA', 'historique client'], valueSignals: ['temps commercial', 'qualité de préparation'], feasibilitySignals: ['CRM accessible', 'historique exploitable'], risks: ['information obsolète', 'surconfiance'] }),
    makeOpportunity({ id: 'sales-email', function: 'commerce', level: 'individual', label: 'Rédiger un mail', need: 'Adapter un mail commercial au contexte du client et à la prochaine étape.', capabilities: ['génération', 'reformulation', 'contrôle'], valueSignals: ['temps', 'réactivité'] }),
    makeOpportunity({ id: 'sales-knowledge', function: 'commerce', level: 'knowledge', label: 'Retrouver l’historique client', need: 'Retrouver l’historique, le catalogue et les offres précédentes avant un échange.', inputs: ['CRM', 'catalogue', 'offres précédentes'], solutionType: 'Knowledge commerciale', tools: ['CRM', 'base documentaire', 'recherche sémantique'], implementation: 'CONFIGURE', valueSignals: ['temps', 'cohérence commerciale'] }),
    makeOpportunity({ id: 'sales-tender', function: 'commerce', level: 'process', label: 'Répondre à un appel d’offres', need: 'Lire un DCE, vérifier les exigences, identifier les risques et préparer la réponse.', inputs: ['DCE', 'historique', 'données entreprise'], capabilities: ['extraction', 'recherche', 'comparaison', 'scoring', 'génération'], solutionType: 'Workflow documentaire augmenté', implementation: 'CONFIGURE', tools: ['stockage documentaire', 'workflow automation', 'modèle IA'], customWhen: 'Construire si la méthode de qualification ou le score devient un actif différenciant.', valueSignals: ['revenu', 'temps de réponse', 'risque'], feasibilitySignals: ['DCE accessibles', 'critères explicites', 'responsable commercial'], risks: ['oubli d’exigence', 'réponse non conforme'] }),
    makeOpportunity({ id: 'sales-agent', function: 'commerce', level: 'agent', label: 'Préparer un dossier commercial', need: 'Préparer automatiquement un dossier commercial avant un rendez-vous, sous validation humaine.', inputs: ['CRM', 'emails', 'web / data'], capabilities: ['recherche', 'analyse', 'synthèse', 'recommandation'], solutionType: 'Agent de préparation commerciale', implementation: 'CONFIGURE', tools: ['CRM', 'agent métier', 'human gate'], valueSignals: ['capacité commerciale', 'réactivité'], feasibilitySignals: ['objectif borné', 'outils en lecture'], risks: ['mauvaise interprétation', 'action prématurée'] }),
    makeOpportunity({ id: 'sales-product', function: 'commerce', level: 'product', label: 'Moteur d’opportunité', need: 'Comparer des opportunités commerciales avec des critères communs et explicables.', inputs: ['CRM', 'catalogue', 'données marché'], capabilities: ['scoring', 'comparaison', 'visualisation', 'recommandation'], solutionType: 'Outil de scoring propriétaire', implementation: 'BUILD', tools: ['base de données', 'dashboard', 'API + LLM'], valueSignals: ['revenu', 'priorisation', 'différenciation'], feasibilitySignals: ['critères stabilisés', 'données historiques'], risks: ['score trompeur', 'biais de données'] }),

    makeOpportunity({ id: 'marketing-campaign', function: 'marketing', level: 'individual', label: 'Produire une campagne', need: 'Décliner une campagne à partir d’un brief et de contenus validés.' }),
    makeOpportunity({ id: 'marketing-knowledge', function: 'marketing', level: 'knowledge', label: 'Retrouver les contenus validés', need: 'Retrouver les personas, messages et contenus déjà validés.' }),
    makeOpportunity({ id: 'marketing-brief', function: 'marketing', level: 'process', label: 'Qualifier un brief', need: 'Contrôler qu’un brief contient les informations nécessaires avant production.' }),
    makeOpportunity({ id: 'marketing-watch', function: 'marketing', level: 'agent', label: 'Surveiller une veille', need: 'Surveiller un périmètre et signaler les informations qui méritent lecture.' }),
    makeOpportunity({ id: 'marketing-observatory', function: 'marketing', level: 'product', label: 'Observatoire marché', need: 'Rassembler signaux, contenus et analyses dans une vue marché.' }),

    makeOpportunity({ id: 'sav-response', function: 'sav-adv', level: 'individual', label: 'Préparer une réponse', need: 'Préparer une réponse SAV cohérente avec le contrat et la procédure.' }),
    makeOpportunity({ id: 'sav-procedure', function: 'sav-adv', level: 'knowledge', label: 'Retrouver une procédure', need: 'Retrouver la bonne procédure et sa version applicable.' }),
    makeOpportunity({ id: 'sav-routing', function: 'sav-adv', level: 'process', label: 'Router une demande', need: 'Classifier une demande et la router vers le bon responsable.' }),
    makeOpportunity({ id: 'sav-dossier', function: 'sav-adv', level: 'agent', label: 'Préparer un dossier client', need: 'Assembler les éléments nécessaires avant le traitement d’une demande.' }),
    makeOpportunity({ id: 'sav-diagnostic', function: 'sav-adv', level: 'product', label: 'Outil de diagnostic client', need: 'Guider le diagnostic à partir des symptômes, contrats et historiques.' }),

    makeOpportunity({ id: 'finance-reporting', function: 'finance', level: 'individual', label: 'Préparer un reporting', need: 'Préparer un reporting lisible et expliquer les variations importantes.' }),
    makeOpportunity({ id: 'finance-rules', function: 'finance', level: 'knowledge', label: 'Retrouver une règle', need: 'Retrouver la règle applicable dans les contrats et référentiels.' }),
    makeOpportunity({ id: 'finance-invoice', function: 'finance', level: 'process', label: 'Contrôler une facture', need: 'Extraire, contrôler et signaler les anomalies d’une facture.' }),
    makeOpportunity({ id: 'finance-close', function: 'finance', level: 'agent', label: 'Préparer une clôture', need: 'Préparer les contrôles récurrents et remonter les écarts à valider.' }),
    makeOpportunity({ id: 'finance-cash', function: 'finance', level: 'product', label: 'Cockpit de trésorerie', need: 'Relier prévisions, encaissements et alertes dans une vue exploitable.' }),

    makeOpportunity({ id: 'rh-interview', function: 'rh', level: 'individual', label: 'Préparer un entretien', need: 'Préparer un entretien avec les éléments du poste et du parcours.' }),
    makeOpportunity({ id: 'rh-policy', function: 'rh', level: 'knowledge', label: 'Interroger le référentiel RH', need: 'Répondre aux demandes internes à partir des politiques à jour.' }),
    makeOpportunity({ id: 'rh-onboarding', function: 'rh', level: 'process', label: 'Guider un onboarding', need: 'Orchestrer les étapes d’arrivée et signaler les éléments manquants.' }),
    makeOpportunity({ id: 'rh-assistant', function: 'rh', level: 'agent', label: 'Préparer un parcours d’arrivée', need: 'Adapter le parcours d’arrivée au poste et aux règles de l’entreprise.' }),
    makeOpportunity({ id: 'rh-skills', function: 'rh', level: 'product', label: 'Observatoire des compétences', need: 'Relier compétences, besoins et évolutions dans une vue partagée.' }),

    makeOpportunity({ id: 'ops-intervention', function: 'operations', level: 'individual', label: 'Préparer une intervention', need: 'Préparer une intervention à partir des consignes et de l’historique.' }),
    makeOpportunity({ id: 'ops-quality', function: 'operations', level: 'knowledge', label: 'Interroger les fiches qualité', need: 'Retrouver une procédure qualité et les précédents utiles.' }),
    makeOpportunity({ id: 'ops-incident', function: 'operations', level: 'process', label: 'Qualifier un incident', need: 'Qualifier un incident, retrouver la procédure et préparer le compte rendu.' }),
    makeOpportunity({ id: 'ops-control', function: 'operations', level: 'agent', label: 'Proposer une séquence de contrôle', need: 'Choisir les contrôles adaptés à un dossier et demander les validations nécessaires.' }),
    makeOpportunity({ id: 'ops-cockpit', function: 'operations', level: 'product', label: 'Cockpit qualité', need: 'Suivre incidents, contrôles et actions correctives au même endroit.' }),

    makeOpportunity({ id: 'it-documentation', function: 'it-data', level: 'individual', label: 'Documenter un système', need: 'Produire une documentation claire à partir de sources techniques.' }),
    makeOpportunity({ id: 'it-catalogue', function: 'it-data', level: 'knowledge', label: 'Interroger le catalogue data', need: 'Retrouver les jeux de données, leurs propriétaires et leurs limites.' }),
    makeOpportunity({ id: 'it-delivery', function: 'it-data', level: 'process', label: 'Contrôler une livraison', need: 'Contrôler une livraison de données et signaler les écarts.' }),
    makeOpportunity({ id: 'it-triage', function: 'it-data', level: 'agent', label: 'Trier les alertes', need: 'Trier les alertes, enrichir le diagnostic et proposer la prochaine action.' }),
    makeOpportunity({ id: 'it-observatory', function: 'it-data', level: 'product', label: 'Observatoire data', need: 'Rendre visibles la qualité, les usages et les incidents data.' })
  ];
})();
