/* Structured slide source. The renderer is deliberately format-neutral so it can feed a later deck or web experience. */
window.ACOLYTE_SLIDES = [
  { id: 1, act: 1, actLabel: 'Ce que vous connaissez déjà', title: 'Vous connaissez déjà une partie de l’histoire', message: 'ChatGPT est déjà une première forme de travail augmenté. La suite consiste à comprendre ce qui se passe autour de la conversation.', bullets: ['Passer de « je pose une question » à « je fais avancer un travail ».', 'Partir d’un problème réel, pas d’un catalogue de fonctions.', 'Conserver une lecture calme, concrète et accessible.'], visual: 'cover', source: 'Ouverture · titre et promesse', speaker: 'Vous savez déjà utiliser une IA pour obtenir une réponse. Aujourd’hui, on regarde ce qu’il faut ajouter pour qu’elle participe à un vrai travail.', demo: 'Aucune démo · couverture native.', interactive: false },
  { id: 2, act: 1, actLabel: 'Ce que vous connaissez déjà', title: 'Question, résumé, rédaction, analyse', message: 'L’IA est déjà utile pour comprendre et produire, même sans agent ni automatisation.', bullets: ['Résumer un document.', 'Reformuler un message.', 'Comparer deux options.', 'Structurer un problème.', 'Transformer une analyse en présentation.'], visual: 'familiar', source: 'Usages familiers · sans Hocus', speaker: 'Rien de tout cela n’est magique : l’IA transforme une matière en une autre. Le premier saut arrive quand elle reçoit la situation complète.', demo: 'Animation courte : une phrase devient cinq sorties.', interactive: false },
  { id: 3, act: 1, actLabel: 'Ce que vous connaissez déjà', title: 'Le travail autour de la réponse', message: 'Dans un vrai travail, il faut comprendre la demande, vérifier les informations, préparer une action et suivre la suite.', bullets: ['Situation : préparer un rendez-vous client.', 'Synthétiser, questionner, repérer les incertitudes.', 'Préparer la réunion puis rendre compte.', 'La même IA peut aider avant, pendant et après.'], visual: 'meeting', source: 'Fil rouge · rendez-vous client', speaker: 'Le sujet n’est pas de demander une plus jolie réponse. Le sujet est de faire franchir au travail plusieurs étapes cohérentes.', demo: 'LIVE 1 commence ici : instruction seule, puis contexte ajouté en slide 5.', demoType: 'LIVE 1', wow: false, interactive: true },
  { id: 4, act: 1, actLabel: 'Ce que vous connaissez déjà', title: 'Ce qu’il y a derrière la réponse', message: 'Une IA générative compose une réponse probable à partir de ce qu’elle a appris et de la situation fournie. Elle ne consulte pas automatiquement une base de réponses vraies.', bullets: ['Contexte + instruction + connaissances apprises → réponse.', 'Un LLM a appris des relations entre mots, concepts et structures.', 'Utile ne veut pas dire toujours vrai.', 'Le contexte doit rester vérifiable.'], visual: 'model', source: 'IA générative · LLM · limites', speaker: 'Le modèle sait reconstruire une forme de réponse. Il ne sait pas, par ce seul mécanisme, que la réponse est vraie dans votre contexte.', demo: 'Animation : contexte vide puis contexte riche.', interactive: false },
  {
    id: 5,
    act: 2,
    actLabel: 'Ce qui change tout',
    title: 'Le contexte change la qualité du travail',
    message: '« Bonne question → bonne réponse » est un modèle trop pauvre. Objectif, données, contraintes et résultat attendu comptent autant.',
    bullets: ['Même instruction : « Prépare mon rendez-vous. »', 'Ajouter objectif, fiche client, historique et contraintes.', 'Demander questions, risques, trame et prochaines actions.', 'La situation de travail devient plus actionnable.'],
    visual: 'context',
    source: 'Wow · prompt contre contexte',
    speaker: 'La différence ne vient pas d’un prompt secret. Elle vient du fait que l’IA comprend mieux la situation dans laquelle elle doit être utile.',
    demo: 'LIVE 1 · 3–4 min · fallback : captures avant / après.',
    wow: true,
    demoType: 'LIVE 1',
    interactive: true,
    interaction: {
      kind: 'context-builder',
      prompt: 'Prépare mon rendez-vous.',
      base: {
        response: 'Voici une trame générale : objectifs, questions, points à aborder et prochaines étapes.',
        findings: ['Objectif de la réunion à préciser.', 'Questions encore génériques.', 'Prochaines étapes à confirmer.'],
        unknowns: 'objectif · client · historique · contraintes · format'
      },
      contexts: [
        { key: 'objective', label: 'Objectif', detail: 'Ce que la réunion doit débloquer', response: 'La trame se concentre sur la décision à obtenir pendant la réunion.', action: 'Cadrer la décision attendue', tool: 'objectif partagé', proof: 'objectif + résultat attendu', findings: ['Question prioritaire formulée.', 'Critère de réussite explicite.'] },
        { key: 'client', label: 'Fiche client', detail: 'Situation, rôle et enjeux connus', response: 'Les questions ciblent maintenant ce client, son rôle et ses enjeux spécifiques.', action: 'Cibler les questions', tool: 'fiche client', proof: 'enjeux + interlocuteur', findings: ['Questions pertinentes pour le client.', 'Risque de hors-sujet réduit.'] },
        { key: 'history', label: 'Historique', detail: 'Échanges, décisions et essais passés', response: 'La préparation relie les sujets ouverts aux décisions déjà prises.', action: 'Relier le passé au prochain échange', tool: 'historique projet', proof: 'échange daté + point ouvert', findings: ['Décision à reprendre identifiée.', 'Continuité entre les échanges.'] },
        { key: 'constraints', label: 'Contraintes', detail: 'Temps, budget, risques et limites', response: 'La trame fait apparaître les risques et les limites à traiter avant de promettre.', action: 'Tester les limites', tool: 'règles du projet', proof: 'contrainte + risque', findings: ['Risques à vérifier.', 'Questions de faisabilité ajoutées.'] },
        { key: 'format', label: 'Format attendu', detail: 'La forme de sortie utile après la réunion', response: 'La sortie devient un support directement exploitable : questions, risques et actions dans le bon format.', action: 'Préparer les prochaines actions', tool: 'format de restitution', proof: 'trame + actions', findings: ['Trame lisible en réunion.', 'Prochaines actions assignables.'] }
      ]
    }
  },
  { id: 6, act: 2, actLabel: 'Ce qui change tout', title: 'IA seule ≠ système IA', message: 'La puissance d’un système vient de la combinaison du modèle avec le contexte, la mémoire, les outils et les actions.', bullets: ['IA seule : génère une proposition.', 'Système IA : retrouve, observe, agit et rend compte.', 'Modèle + contexte + mémoire + outils + actions.', 'Le contrôle encadre l’ensemble.'], visual: 'equation', source: 'Thèse · système IA', speaker: 'Le modèle reste le moteur de langage. Le système est tout ce qu’on construit autour pour qu’il puisse travailler de façon utile et vérifiable.', demo: 'Aucune démo · respiration conceptuelle.', interactive: true },
  {
    id: 7,
    act: 2,
    actLabel: 'Ce qui change tout',
    title: 'Trois semaines plus tard : la mémoire',
    message: 'Sans mémoire organisée, une nouvelle conversation repart presque de zéro. Avec une mémoire de travail, elle retrouve décisions et contexte.',
    bullets: ['Sans mémoire : tout réexpliquer, risque d’incohérence.', 'Avec mémoire : brief, décisions, méthodes et points ouverts.', 'La mémoire garde aussi sources, limites et incertitudes.', 'Obsidian devient une continuité de travail.'],
    visual: 'memory',
    source: 'WOW 1 · mémoire de travail',
    speaker: 'La mémoire n’est pas un bonus de confort. Elle évite de perdre le travail déjà fait et permet à l’IA d’être cohérente dans le temps.',
    demo: 'Animation sans / avec mémoire · 12 s.',
    wow: true,
    interactive: true,
    interaction: {
      kind: 'memory-recall',
      scenario: 'Trois semaines plus tard, vous reprenez le projet.',
      without: {
        title: 'Tout réexpliquer',
        response: 'Cette session ne retrouve pas le travail passé : il faut reconstruire le contexte avant de pouvoir agir.',
        missing: [
          { tag: 'MANQUANT', text: 'Décisions prises' },
          { tag: 'MANQUANT', text: 'Essais et méthodes' },
          { tag: 'MANQUANT', text: 'Contraintes et points ouverts' }
        ]
      },
      with: {
        response: 'La mémoire de travail rend la reprise possible : le système retrouve ce qui a été décidé et ce qui reste à faire.',
        recovered: [
          { tag: 'RETROUVÉ', text: 'Brief et objectif' },
          { tag: 'RETROUVÉ', text: 'Décisions et méthodes' },
          { tag: 'RETROUVÉ', text: 'Sources et points ouverts' }
        ]
      },
      memories: [
        { key: 'decision', date: '12 JUIN', kind: 'DÉCISION', label: 'Décision du 12 juin', summary: 'Ne pas utiliser X dans ce contexte.', detail: 'Décision du 12 juin : ne pas utiliser X car les données disponibles ne permettent pas de vérifier sa fiabilité.', source: 'note projet / décisions' },
        { key: 'method', date: '14 JUIN', kind: 'MÉTHODE', label: 'Méthode de comparaison', summary: 'Comparer les options avec les mêmes critères.', detail: 'Pour comparer deux options, conserver les mêmes critères et noter les inconnues séparément.', source: 'note projet / méthode' }
      ]
    }
  },
  { id: 8, act: 2, actLabel: 'Ce qui change tout', title: 'Ajouter un objectif, des outils, une boucle', message: 'Un agent est une IA qui poursuit un objectif en choisissant plusieurs étapes dans un cadre autorisé.', bullets: ['Objectif + outils + autonomie bornée.', 'Planifier → appeler un outil → observer → décider.', 'L’utilisateur ne dicte pas chaque micro-étape.', 'Les permissions et points d’arrêt restent explicites.'], visual: 'agent-loop', source: 'Définition · agent', speaker: 'Un agent n’est pas une IA qui fait n’importe quoi toute seule. C’est une IA à qui l’on confie un objectif et une marge d’initiative définie.', demo: 'Aucune démo · préparer le choc visuel du slide suivant.', interactive: true },
  {
    id: 9,
    act: 3,
    actLabel: 'Un agent travaille',
    title: 'Chatbot contre agent — le déclic',
    message: 'Le chatbot répond à une question. L’agent poursuit un objectif en enchaînant observation, action et vérification.',
    bullets: ['Chatbot : question → réponse.', 'Agent : objectif → recherche → sources → comparaison.', 'Puis calcul → vérification → résultat.', 'La différence porte sur la boucle de travail.'],
    visual: 'compare',
    source: 'WOW 2 · chatbot contre agent',
    speaker: 'Le mot important n’est pas « plus intelligent ». Le mot important est « plus d’étapes prises en charge ».',
    demo: 'Animation conceptuelle · révélation de 15 s.',
    wow: true,
    interactive: true,
    interaction: {
      kind: 'chatbot-agent',
      mission: 'Analyse ce dossier et prépare une recommandation.',
      chatbotResponse: 'Je recommande de poursuivre l’analyse. Les informations disponibles ne permettent pas encore de conclure avec confiance.',
      steps: [
        { label: 'Comprendre', tool: 'cadre de travail', observation: 'Périmètre et critères identifiés.', proof: 'demande + critères' },
        { label: 'Chercher', tool: 'recherche autorisée', observation: 'Sources pertinentes repérées.', proof: 'liste des sources' },
        { label: 'Lire', tool: 'outil document', observation: 'Éléments clés extraits.', proof: 'source / page' },
        { label: 'Comparer', tool: 'tableau de comparaison', observation: 'Écarts et convergences visibles.', proof: 'comparaison sourcée' },
        { label: 'Calculer', tool: 'outil de calcul', observation: 'Indicateurs utiles produits.', proof: 'formule + valeurs' },
        { label: 'Vérifier', tool: 'contrôle de cohérence', observation: 'Inconnues et contradictions isolées.', proof: 'points à confirmer' },
        { label: 'Synthétiser', tool: 'rédaction structurée', observation: 'Recommandation prête à être relue.', proof: 'résultat + sources' }
      ],
      permissions: [
        { label: 'AUTORISÉ', value: 'lire · comparer · calculer', tone: 'allowed' },
        { label: 'À VALIDER', value: 'recommander · décider', tone: 'review' },
        { label: 'INTERDIT', value: 'publier · produire', tone: 'blocked' }
      ],
      finalResult: 'Recommandation structurée, avec sources et points à valider.'
    }
  },
  { id: 10, act: 3, actLabel: 'Un agent travaille', title: 'Démonstration conceptuelle : analyser un dossier', message: 'L’utilisateur donne un objectif. L’agent choisit et exécute les étapes nécessaires pour produire une synthèse vérifiable.', bullets: ['Comprendre la demande et le périmètre.', 'Chercher les informations autorisées.', 'Lire, comparer et calculer.', 'Produire une synthèse avec sources et inconnues.'], visual: 'agent-workflow', source: 'Scénario générique · dossier à analyser', speaker: 'Si je dois donner chacune de ces instructions, je pilote un chatbot. Si je donne l’objectif et que la boucle est bornée, on commence à parler d’agent.', demo: 'Simulation pré-enregistrée · aucune recherche réseau non contrôlée.', interactive: true },
  { id: 11, act: 3, actLabel: 'Un agent travaille', title: 'Un workflow, pas une boîte noire', message: 'Un agent produit des étapes, des artefacts et des preuves. Il ne transforme pas automatiquement une proposition en décision finale.', bullets: ['Chaque étape : entrée, action, observation, sortie.', 'Une erreur peut déclencher correction ou arrêt.', 'Une décision sensible peut demander un humain.', 'Proposition → exécution contrôlée → test → validation.'], visual: 'control', source: 'Contrôle · preuves · gate humain', speaker: 'Plus l’IA agit, plus il faut rendre son travail visible : ce qu’elle a vu, ce qu’elle a fait, ce qu’elle ignore et qui valide.', demo: 'Animation : arrêt sur validation humaine.', interactive: true },
  {
    id: 12,
    act: 4,
    actLabel: 'Voilà comment je travaille réellement',
    title: 'Quatre rôles, un système de travail',
    message: 'GPT, Obsidian, GitHub et Codex ne font pas la même chose. Leur valeur vient des handoffs entre eux.',
    bullets: ['GPT : réfléchir, cadrer, challenger.', 'Obsidian : mémoriser décisions et méthodes.', 'GitHub : porter l’état, les versions et les revues.', 'Codex : réaliser, tester et préparer une version.'],
    visual: 'roles',
    source: 'Acte 4 · système personnel',
    speaker: 'Je n’utilise pas quatre IA pour faire la même chose. J’utilise des rôles différents qui se passent un travail structuré.',
    demo: 'Aucune démo · cadrage de l’acte 4.',
    interactive: true,
    interaction: {
      kind: 'handoff',
      mission: 'Je veux un outil qui analyse un DCE et me dise si je dois répondre.',
      artifact: { name: 'DCE ANALYZER', id: 'BRIEF-001' },
      stages: [
        { actor: 'GPT', input: 'Je veux un outil qui…', output: 'BRIEF', proof: 'question + contexte', permission: 'proposer · cadrer' },
        { actor: 'Obsidian', input: 'BRIEF', output: 'BRIEF ENRICHI', proof: 'décision + règle + contexte', permission: 'mémoriser · retrouver' },
        { actor: 'GitHub', input: 'BRIEF ENRICHI', output: 'ISSUE', proof: 'objectif + critères', permission: 'formaliser le travail' },
        { actor: 'Codex', input: 'ISSUE', output: 'BRANCHE + CODE + TESTS', proof: 'diff + tests', permission: 'modifier dans un espace isolé' },
        { actor: 'GitHub', input: 'CODE + TESTS', output: 'PR + CI + STAGING', proof: 'revue + statut CI + URL', permission: 'exposer pour revue' },
        { actor: 'Humain', input: 'PR + STAGING', output: 'VALIDATION HUMAINE', proof: 'décision explicite', permission: 'valider ou demander une correction' }
      ]
    }
  },
  { id: 13, act: 4, actLabel: 'Voilà comment je travaille réellement', title: 'GPT + Obsidian : penser et se souvenir', message: 'GPT aide à clarifier et structurer. Obsidian conserve ce qui doit rester disponible demain.', bullets: ['GPT clarifie une idée et produit un brief.', 'Les décisions importantes passent dans la mémoire.', 'Une session future retrouve architecture et points ouverts.', 'Provenance et statut restent visibles.'], visual: 'handoff-memory', source: 'Handoff · conversation vers mémoire', speaker: 'GPT est le lieu de la conversation ; Obsidian devient le lieu de la continuité.', demo: 'Capture fixe ou mockup · pas de navigation live dans le vault.', interactive: true },
  { id: 14, act: 4, actLabel: 'Voilà comment je travaille réellement', title: 'GitHub + Codex : agir et laisser une trace', message: 'GitHub porte l’état opérationnel. Codex exécute une évolution dans un espace isolé et produit des changements vérifiables.', bullets: ['Issue : objectif, périmètre, critères.', 'Branche : espace isolé.', 'Codex : lire, modifier, tester.', 'PR, CI et staging : relire et vérifier.'], visual: 'handoff-code', source: 'Handoff · intention vers changement', speaker: 'Codex peut faire beaucoup de travail technique. Il ne reçoit pas pour autant le droit de décider seul de la production.', demo: 'Capture ou replay de cycle · aucun merge ou déploiement.', interactive: true },
  { id: 15, act: 4, actLabel: 'Voilà comment je travaille réellement', title: 'Le workflow réel : l’humain reste le gatekeeper', message: 'Le système propose et exécute sous contrôle. L’humain valide avant les décisions conséquentes et la production.', bullets: ['Idée → Issue → Branche → Développement.', 'Tests → PR → Préproduction.', 'Validation humaine → Production.', 'La production n’est jamais implicite.'], visual: 'timeline', source: 'Workflow Hocus · human gate', speaker: 'L’objectif n’est pas d’effacer l’humain. C’est de lui réserver le cadrage, le jugement et les décisions qui méritent son attention.', demo: 'Animation de timeline · fallback statique.', interactive: true },
  { id: 16, act: 4, actLabel: 'Voilà comment je travaille réellement', title: 'Créer une évolution sur ce produit', message: 'Une phrase ne déclenche pas un saut magique. Elle ouvre une chaîne de cadrage, capitalisation, formalisation et réalisation.', bullets: ['GPT clarifie objectif et critères.', 'Obsidian retrouve une décision.', 'GitHub reçoit une issue structurée.', 'Codex construit, teste et prépare la revue.'], visual: 'continuity', source: 'WOW 3 · continuité des outils', speaker: 'La continuité est la démonstration : le même travail change de forme sans perdre son intention ni sa trace.', demo: 'LIVE 2 ou replay · 5–7 min · ne pas attendre toute l’exécution Codex.', wow: true, demoType: 'LIVE 2', interactive: true },
  { id: 17, act: 5, actLabel: 'De l’idée au produit', title: 'Cas principal : Northstar TEN', message: 'Un problème de décision peut devenir une chaîne d’analyse puis un outil testable.', bullets: ['À quels appels d’offres répondre, pourquoi et avec quel risque ?', 'DCE + données marchés publics + données entreprise.', 'Faits, evidence, assessment et Opportunity Score explicable.', 'Décision : go / review / no-go.'], visual: 'northstar', source: 'Cas réel · Northstar TEN · synthetic/fake', speaker: 'Ce cas ne demande pas seulement de résumer un document : il relie extraction, données, analyse, provenance et décision.', demo: 'Replay ou capture de l’UI staging synthetic/fake.', demoType: 'PRE-RECORDED', interactive: true },
  {
    id: 18,
    act: 5,
    actLabel: 'De l’idée au produit',
    title: 'De la question au brief, puis à l’issue',
    message: 'L’IA aide à transformer une intention floue en contrat de travail vérifiable.',
    bullets: ['Question métier.', 'Discussion : utilisateurs, données, sorties, limites.', 'Brief / spec : périmètre, qualité, exclusions.', 'Issue GitHub : travail pilotable et relié à une branche.'],
    visual: 'spec',
    source: 'WOW 3 · formalisation',
    speaker: 'La spécification n’est pas de la bureaucratie : c’est ce qui permet à un agent de travailler sans deviner le problème.',
    demo: 'Animation phrase → brief → spec → issue.',
    wow: true,
    interactive: true,
    interaction: {
      kind: 'idea-product',
      sentence: 'Je veux un outil qui analyse un DCE et me dise si je dois répondre.',
      artifact: 'DCE ANALYZER · NORTHSTAR TEN',
      stages: [
        { label: 'Question', output: 'Question métier formulée', proof: 'intention de départ', validation: 'problème reconnu' },
        { label: 'Discussion', output: 'Utilisateurs, données et limites', proof: 'brief de discussion', validation: 'périmètre compris' },
        { label: 'Brief', output: 'Brief structuré', proof: 'objectif + exclusions', validation: 'brief accepté' },
        { label: 'SPEC', output: 'Contrat testable', proof: 'critères + scénarios', validation: 'spec relue' },
        { label: 'Issue', output: 'Issue GitHub', proof: 'issue + critères', validation: 'travail pilotable' },
        { label: 'Branche', output: 'Espace de travail isolé', proof: 'branche dédiée', validation: 'périmètre protégé' },
        { label: 'Code', output: 'Évolution implémentée', proof: 'diff lisible', validation: 'changement relu' },
        { label: 'Tests', output: 'Contrôles automatisés', proof: 'résultats de tests', validation: 'comportement vérifié' },
        { label: 'PR', output: 'Proposition relisible', proof: 'revue + CI', validation: 'retour demandé ou accepté' },
        { label: 'Staging', output: 'Version testable', proof: 'URL de préproduction', validation: 'validation fonctionnelle' },
        { label: 'Humain', output: 'Décision explicite', proof: 'go / ajuster / stop', validation: 'gate avant production' },
        { label: 'Outil utilisable', output: 'Résultat dans le bon niveau d’industrialisation', proof: 'application + mesure', validation: 'usage confirmé' }
      ],
      finalResult: 'Une idée devient un outil testable par accumulation de preuves et de validations.'
    }
  },
  { id: 19, act: 5, actLabel: 'De l’idée au produit', title: 'Du code à l’application testée', message: 'Le produit est construit par une chaîne d’artefacts, de contrôles et de validation humaine.', bullets: ['SPEC → ISSUE → CODE → TESTS.', 'PR → STAGING → APPLICATION.', 'Chaque étape laisse une preuve.', 'La dernière étape est visible, pas magique.'], visual: 'delivery', source: 'Northstar TEN · cycle traçable', speaker: 'Le résultat final n’est pas apparu d’un coup : chaque étape a laissé une preuve de ce qui a été décidé et produit.', demo: 'Capture / replay · pas de modification distante en direct.', wow: true, interactive: true },
  { id: 20, act: 5, actLabel: 'De l’idée au produit', title: 'Mini-cas secondaire : Sybil', message: 'Lorsque la question principale est la valeur ou la faisabilité, on teste rapidement avant d’industrialiser.', bullets: ['Question → POC → données → patterns.', 'Journey graph et comportements observés.', 'Résultat, stabilité, limites.', 'Value gate : GO / ITERATE / NO-GO.'], visual: 'sybil', source: 'Cas secondaire · Sybil · public/fixture', speaker: 'On ne construit pas systématiquement une usine pour découvrir ensuite que personne n’en a besoin.', demo: 'Replay 60–90 s ou capture du graphe · optionnel en version courte.', demoType: 'OPTIONAL', interactive: true },
  { id: 21, act: 5, actLabel: 'De l’idée au produit', title: 'Un même système, plusieurs agents spécialisés', message: 'Une architecture de travail peut réutiliser le même cadre avec des moteurs spécialisés par responsabilité.', bullets: ['Gremlin / Zoltar : collecter, lire.', 'Stolas / Sybil / Northstar / Maze : comprendre, comparer, modéliser.', 'Inat / Fumist / Yokai / Doppel : raconter, visualiser, produire.', 'Cortex : orchestrer, gouverner, demander des preuves.'], visual: 'specialized', source: 'WOW 4 · carte Hocus simplifiée', speaker: 'La spécialisation ne sert pas à multiplier les logos. Elle sert à donner à chaque moteur un travail clair et contrôlable.', demo: 'Simulation d’un dossier passant par trois agents.', wow: true, interactive: true },
  { id: 22, act: 5, actLabel: 'De l’idée au produit', title: 'Conseil augmenté : recommandation + outil', message: 'Une mission peut produire une analyse et le moyen de l’exécuter, au niveau d’industrialisation réellement justifié.', bullets: ['50 fichiers Excel + PDF + une question.', 'Import → nettoyage → analyse → IA → visualisation.', 'Notebook, script, dashboard, agent, mini-webapp ou produit.', 'Analyse → prototype → tests → mesure.'], visual: 'consulting', source: 'WOW 5 · conseil augmenté', speaker: 'La bonne réponse n’est pas toujours un SaaS. Parfois, un script ou un dashboard résout le problème plus vite et permet d’apprendre.', demo: 'Animation de pipeline · aucune donnée client.', wow: true, interactive: true },
  { id: 23, act: 5, actLabel: 'De l’idée au produit', title: 'Le basculement', message: 'L’IA devient une infrastructure de travail lorsqu’elle relie humain, raisonnement, mémoire, outils, données et action sous contrôle.', bullets: ['Chat → Copilot → Agent → Workflow → System.', 'Humain : décide, juge, arbitre.', 'IA : raisonne, orchestre, propose, exécute dans un cadre.', 'Mémoire + outils + données : continuité et action.'], visual: 'closing', source: 'Conclusion · modèle mental final', speaker: 'Le véritable changement ne commence pas quand l’IA parle mieux. Il commence quand elle devient une couche qui relie les connaissances, les outils et les personnes.', demo: 'Aucune démo · question finale au public.', interactive: true }
];
