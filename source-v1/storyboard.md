# A. Storyboard du deck

## Paramètres

- **26 slides**, format 16:9.
- **45–60 minutes**, dont 10–15 minutes de démonstrations ou de replays.
- Une idée principale par slide ; les détails servent de notes orateur ou de matière pour la future webapp.
- Mode de présentation par défaut : **STORY** — message lisible en quelques secondes, interaction minimale et utile.

---

## 1. L’IA : du chatbot au système de travail

- **Objectif pédagogique :** installer le sujet et donner envie de suivre la montée en puissance.
- **Message principal :** l’IA peut devenir une couche de travail reliant connaissances, outils et actions.
- **Visuel proposé :** une conversation qui s’étend progressivement vers une carte de travail : personne → IA → mémoire / outils / données → résultat.
- **Contenu :**
  - Titre : *L’IA : du chatbot au système de travail*.
  - Sous-titre : *Passer d’une conversation avec ChatGPT à un système capable de travailler avec nous.*
  - Promesse : comprendre, essayer, combiner, automatiser, construire.
- **Démonstration éventuelle :** aucune ; ouverture orale de 30 secondes.

## 2. Une même demande, cinq niveaux de puissance

- **Objectif pédagogique :** donner la carte de la présentation avant les définitions.
- **Message principal :** le changement ne vient pas seulement de la qualité de la réponse, mais du nombre d’étapes et de capacités mobilisées.
- **Visuel proposé :** escalier ou ascenseur à cinq paliers : Chat → Copilot → Agent → Workflow → System.
- **Contenu :**
  - Niveau 1 : « Réponds à ma question. »
  - Niveau 2 : « Aide-moi à réaliser cette tâche. »
  - Niveau 3 : « Réalise cet objectif. »
  - Niveau 4 : « Plusieurs outils et agents collaborent. »
  - Niveau 5 : « L’IA est intégrée au fonctionnement de l’organisation. »
- **Démonstration éventuelle :** animation de révélation des cinq paliers ; pas de jargon.

## 3. Partir d’un travail réel, pas d’un catalogue de fonctions

- **Objectif pédagogique :** installer le fil rouge métier et éviter l’effet « visite guidée de logiciel ».
- **Message principal :** on ne commence pas par choisir une IA ; on commence par une question, des informations et un résultat attendu.
- **Visuel proposé :** une phrase unique au centre : *« J’ai 50 fichiers et une décision à prendre. »* ; autour, données, contraintes, livrable, personne à convaincre.
- **Contenu :**
  - Question de départ : *Que cherche-t-on à comprendre ou à décider ?*
  - Entrées : documents, données, historique, règles.
  - Sorties possibles : analyse, recommandation, prototype, application.
  - Fil rouge : un besoin de travail évolue d’une conversation vers un résultat utilisable.
- **Démonstration éventuelle :** aucune ; cette phrase sera reprise en slide 25.

## 4. Qu’est-ce qu’une IA générative ?

- **Objectif pédagogique :** donner un modèle mental simple et juste.
- **Message principal :** l’IA générative produit une réponse nouvelle à partir d’une instruction, d’un contexte et de ce qu’elle a appris.
- **Visuel proposé :** trois blocs qui alimentent une sortie : `CONTEXTE + INSTRUCTION + CONNAISSANCES APPRISES → RÉPONSE`.
- **Contenu :**
  - Elle ne va pas chercher une réponse déjà rangée dans une grande base de données.
  - Elle reconstruit une réponse probable adaptée à la situation.
  - La qualité dépend donc aussi de ce qu’on lui donne à voir.
  - « Probable » ne veut pas dire « toujours vrai ».
- **Démonstration éventuelle :** animation d’une même instruction avec contexte vide puis contexte riche.

## 5. Un LLM : une machine qui a appris des relations

- **Objectif pédagogique :** expliquer le LLM sans mathématiques.
- **Message principal :** un LLM a appris les relations entre mots, concepts, intentions, structures et formes de raisonnement.
- **Visuel proposé :** pipeline très simple : `millions de textes → apprentissage → modèle → instruction + contexte → réponse`.
- **Contenu :**
  - Analogie : avoir lu énormément d’exemples, puis savoir composer une réponse adaptée à une situation nouvelle.
  - Le modèle ne « pense » pas comme une personne et ne garantit pas la vérité.
  - Il est très bon pour transformer, relier et reformuler de l’information.
  - Le contexte de la mission reste indispensable.
- **Démonstration éventuelle :** aucune ; animation courte du pipeline.

## 6. Ce que l’IA sait faire — et ce qu’il faut surveiller

- **Objectif pédagogique :** présenter les capacités sans créer d’illusion d’omnipotence.
- **Message principal :** l’IA est polyvalente, mais elle doit être alimentée, outillée et contrôlée.
- **Visuel proposé :** grille 2×2, avec quatre familles à gauche et quatre garde-fous en bas.
- **Contenu :**
  - **Comprendre :** résumer, extraire, classer, traduire, comparer.
  - **Réfléchir :** formuler des hypothèses, structurer, planifier, analyser.
  - **Produire :** texte, code, image, présentation, rapport.
  - **Interagir :** lire un document, appeler une API, consulter GitHub, interroger une base.
  - Vigilances : erreurs, inventions, informations internes absentes, absence de mémoire durable, autonomie limitée sans outils.
  - Formule : `IA = puissance + contexte + outils + contrôle`.
- **Démonstration éventuelle :** afficher une réponse plausible mais insuffisamment sourcée, puis montrer le contrôle attendu.

## 7. Prompt contre contexte

- **Objectif pédagogique :** faire comprendre pourquoi « mieux prompter » ne suffit pas.
- **Message principal :** un bon résultat dépend de l’objectif, du contexte, des données, des contraintes, des outils et de l’historique.
- **Visuel proposé :** comparaison gauche/droite.
- **Contenu :**
  - **Modèle trop simple :** `bonne question → bonne réponse`.
  - **Modèle utile :** `objectif + contexte + données + contraintes + outils + historique → IA → résultat`.
  - Les contraintes rendent la réponse vérifiable et actionnable.
  - La question reste importante, mais elle n’est qu’une pièce du système.
- **Démonstration éventuelle :** live recommandé : même demande, d’abord seule puis accompagnée d’un brief, d’une cible et de critères.

## 8. Première boucle : préparer un rendez-vous client

- **Objectif pédagogique :** montrer une boucle concrète avant d’introduire les agents.
- **Message principal :** même sans autonomie avancée, l’IA peut déjà couvrir plusieurs moments d’un travail.
- **Visuel proposé :** boucle en cinq étapes autour d’un rendez-vous.
- **Contenu :**
  1. Synthétiser les informations disponibles.
  2. Proposer les questions à poser.
  3. Identifier les incertitudes et les points à vérifier.
  4. Construire la trame de réunion.
  5. Transformer les notes en compte-rendu et prochaines actions.
- **Démonstration éventuelle :** live court sur un dossier fictif et non confidentiel ; conserver la même situation pendant 3 minutes.

## 9. Chatbot, assistant, agent, workflow, système

- **Objectif pédagogique :** stabiliser les mots employés dans la suite.
- **Message principal :** la différence tient à l’objectif donné, au contexte disponible, aux outils et au degré d’autonomie.
- **Visuel proposé :** tableau comparatif horizontal, avec une ligne par niveau.
- **Contenu :**
  - **Chatbot :** une question, une réponse.
  - **Assistant / copilote :** aide à réaliser une tâche avec l’utilisateur.
  - **Agent :** poursuit un objectif en choisissant plusieurs étapes.
  - **Workflow :** plusieurs étapes et outils sont enchaînés avec des règles.
  - **Système :** cette capacité devient une partie du fonctionnement de l’organisation.
- **Démonstration éventuelle :** aucune ; servir de slide-repère.

## 10. Qu’est-ce qu’un agent ?

- **Objectif pédagogique :** donner la définition à retenir.
- **Message principal :** un agent reçoit un objectif, des outils et une autonomie bornée pour réaliser plusieurs étapes.
- **Visuel proposé :** boucle `objectif → plan → outil → observation → nouvelle décision → résultat`.
- **Contenu :**
  - L’utilisateur ne décrit pas forcément chaque étape.
  - L’agent réfléchit à l’étape suivante dans le cadre qui lui est donné.
  - Il observe le résultat, peut corriger et continuer.
  - L’autonomie n’efface pas les règles ni les gates humaines.
- **Démonstration éventuelle :** animation de la boucle ; révéler les étapes une par une.

## 11. Les outils donnent des yeux et des mains à l’IA

- **Objectif pédagogique :** introduire simplement l’appel d’outils.
- **Message principal :** le modèle raisonne ; les outils lui permettent d’observer ou d’agir dans le monde numérique.
- **Visuel proposé :** IA au centre, reliée à Web, documents, données, GitHub, calendrier, base métier et code.
- **Contenu :**
  - Lire un PDF ou un tableur.
  - Chercher une information à jour.
  - Interroger une base ou une API métier.
  - Lire et modifier un dépôt de code.
  - Créer un artefact : analyse, issue, rapport ou prototype.
- **Démonstration éventuelle :** montrer la différence entre une réponse sans accès au document et une réponse fondée sur le document.

## 12. Cinq gestes simples avec des outils

- **Objectif pédagogique :** rendre la notion de tool calling immédiatement concrète.
- **Message principal :** les outils transforment une capacité de langage en travail observable.
- **Visuel proposé :** cinq cartes, une entrée et une sortie pour chacune.
- **Contenu :**
  - **Document :** PDF → 5 risques principaux du contrat.
  - **Données :** CSV → segments au comportement atypique.
  - **Recherche :** sources → acteurs et tendances d’un marché.
  - **Création :** analyse → présentation pour un COMEX.
  - **Action :** décision → issue GitHub décrivant l’évolution.
- **Démonstration éventuelle :** séquence simulée avec un curseur qui passe de la source au livrable ; éviter cinq mini-démos live.

## 13. La mémoire change la continuité du travail

- **Objectif pédagogique :** expliquer pourquoi une conversation ne suffit pas.
- **Message principal :** sans mémoire durable, chaque nouvelle session doit reconstruire le contexte.
- **Visuel proposé :** deux lignes temporelles : conversation isolée contre base de connaissances cumulée.
- **Contenu :**
  - Sans mémoire : session 1 → information → fin → session 2 presque à zéro.
  - Avec mémoire : conversations, documents, décisions, projets et expériences → contexte réutilisable.
  - La mémoire n’est pas seulement un historique ; elle doit être organisée et retrouvable.
  - La mémoire doit aussi conserver les limites, la provenance et les incertitudes.
- **Démonstration éventuelle :** animation « session 2 » avec et sans une note de décision persistante.

## 14. Obsidian : la mémoire de travail

- **Objectif pédagogique :** présenter Obsidian par sa fonction dans le système, pas comme une simple application de notes.
- **Message principal :** Obsidian capitalise ce que l’organisation sait, décide, essaie et apprend.
- **Visuel proposé :** un réseau de cartes reliées : décisions, briefs, recherches, projets, méthodes, comptes-rendus, expériences.
- **Contenu :**
  - Il conserve les décisions et leur contexte.
  - Il permet de reprendre un sujet sans tout réexpliquer.
  - Il sert de mémoire de travail entre GPT, Codex et les projets.
  - Il ne remplace ni le code ni l’état opérationnel du produit.
- **Démonstration éventuelle :** capture anonymisée d’une note d’architecture ou d’un delivery board ; pas de navigation dans le vault réel pendant la présentation.

## 15. GitHub : la mémoire du produit et du travail réalisé

- **Objectif pédagogique :** démystifier GitHub pour un public non développeur.
- **Message principal :** GitHub rend le travail traçable : ce qui est demandé, modifié, testé, relu et versionné.
- **Visuel proposé :** une fiche produit avec cinq zones : issue, code, historique, tests, PR.
- **Contenu :**
  - **Issue :** le besoin et les critères de réussite.
  - **Branche :** un espace isolé pour travailler.
  - **Commit :** une étape enregistrée.
  - **Pull Request :** une proposition à relire.
  - **Tests / CI :** des contrôles reproductibles.
  - **Staging :** une version testable avant production.
- **Démonstration éventuelle :** capture d’une issue et d’une PR publiques ou autorisées, avec données sensibles masquées.

## 16. Le workflow réel : l’humain reste le gatekeeper

- **Objectif pédagogique :** montrer comment l’autonomie s’insère dans une chaîne contrôlée.
- **Message principal :** Codex peut réaliser une évolution, mais ne décide pas seul de la mise en production.
- **Visuel proposé :** timeline : `Idée → Issue → Branche → Développement → Tests → PR → Préprod → Validation humaine → Production`.
- **Contenu :**
  - Chaque étape laisse une trace.
  - Les contrôles automatiques filtrent les erreurs répétitives.
  - La revue humaine porte sur le résultat et les décisions conséquentes.
  - La production est une étape distincte et explicitement autorisée.
- **Démonstration éventuelle :** animation de la timeline avec arrêt visuel sur « Validation humaine ».

## 17. Quatre rôles dans le système de Baptiste

- **Objectif pédagogique :** rendre lisible la complémentarité GPT / Obsidian / GitHub / Codex.
- **Message principal :** chaque outil a un rôle distinct ; leur valeur vient de leur articulation.
- **Visuel proposé :** quatre cartes autour de « Utilisateur ».
- **Contenu :**
  - **GPT — penser / cadrer :** clarifier, challenger, structurer, produire un brief.
  - **Obsidian — mémoriser :** décisions, architecture, méthodes, expériences.
  - **GitHub — opérer :** code, issues, versions, tests, PR.
  - **Codex — réaliser :** lire le projet, modifier le code, tester, préparer une version.
- **Démonstration éventuelle :** capture composite ; ne pas présenter les outils comme quatre produits concurrents.

## 18. Le système complet : penser, se souvenir, agir, valider

- **Objectif pédagogique :** relier les rôles dans une architecture mémorisable.
- **Message principal :** l’utilisateur décide, GPT orchestre le raisonnement, Obsidian conserve le contexte, GitHub porte l’état du travail, Codex construit et l’humain valide.
- **Visuel proposé :** diagramme central : `Utilisateur → GPT ↔ Obsidian / GitHub → Codex → Application → Tests → Validation humaine`.
- **Contenu :**
  - GPT n’est pas le lieu unique de stockage.
  - Codex n’est pas l’autorité de mise en production.
  - GitHub n’est pas la mémoire de toutes les décisions métier.
  - La valeur vient de la circulation structurée entre les rôles.
- **Démonstration éventuelle :** animation de flux ; faire apparaître les responsabilités une par une.

## 19. Exemple réel : Northstar TEN

- **Objectif pédagogique :** montrer comment une question métier devient un outil.
- **Message principal :** l’IA peut rapprocher analyse documentaire, données, décision et interface.
- **Visuel proposé :** chaîne « DCE / données marchés publics → analyse → Opportunity Score explicable → décision go / review / no-go ».
- **Contenu :**
  - Besoin : analyser un appel d’offres et décider s’il mérite une réponse.
  - L’outil peut traiter DCE, échéances, pièces, critères, exigences et risques.
  - Il sépare faits extraits, inférences et scores.
  - La sortie aide à décider ; elle ne prétend pas connaître une probabilité de gain sans preuve.
- **Démonstration éventuelle :** capture de l’UI staging synthetic/fake ou scénario simulé avec un DCE sûr.

## 20. Un cycle traçable : SPEC → ISSUE → CODE → TESTS → PR → STAGING

- **Objectif pédagogique :** rendre visible la transformation concrète d’une intention en logiciel.
- **Message principal :** chaque étape produit une preuve et prépare la suivante.
- **Visuel proposé :** six vignettes reliées, chacune avec un extrait anonymisé : spec, issue, commit/code, résultat de tests, PR, écran de staging.
- **Contenu :**
  - La spec exprime le problème, le périmètre, les contraintes et la qualité attendue.
  - L’issue rend le travail pilotable.
  - Codex réalise dans une branche isolée et produit des changements vérifiables.
  - La PR et la CI ouvrent une revue ; le staging expose le résultat à l’humain.
- **Démonstration éventuelle :** capture ou replay GitHub réel ; si l’accès ou l’autorisation manque, utiliser le cycle Northstar TEN synthétique et le signaler.

## 21. Deux manières de construire : Spec Driven ou POC Driven

- **Objectif pédagogique :** montrer qu’un système de travail adapte son niveau d’investissement à l’incertitude.
- **Message principal :** on ne construit pas toujours une usine ; on choisit entre formaliser ce qui est connu et tester ce qui ne l’est pas.
- **Visuel proposé :** deux chemins parallèles.
- **Contenu :**
  - **Spec Driven :** vision → SPEC-000 → SPEC-001 → … → produit.
  - **POC Driven :** question → prototype rapide → données réelles → observation → value gate → go / no-go → industrialisation.
  - Spec Driven : architecture, tests, traçabilité.
  - POC Driven : apprentissage rapide, coût limité, décision de valeur.
- **Démonstration éventuelle :** aucune ; comparaison de deux curseurs « incertitude de conception » / « incertitude de valeur ».

## 22. Hocus : plusieurs agents spécialisés, une même organisation de travail

- **Objectif pédagogique :** introduire l’écosystème Hocus seulement après les concepts universels.
- **Message principal :** une organisation gagne souvent à composer des moteurs spécialisés plutôt qu’à demander à une IA omnipotente de tout faire.
- **Visuel proposé :** sources → collecte / documents → intelligence → analyse / narration → visualisation / média / ton, avec Cortex autour comme orchestration.
- **Contenu :**
  - **Gremlin :** collecter des données.
  - **Zoltar :** comprendre des documents.
  - **Stolas :** comprendre produits, offres et portfolios.
  - **Sybil :** comprendre comportements et parcours.
  - **Northstar :** comprendre entreprises et opportunités.
  - **Maze / Inat / Yokai / Doppel / Fumist :** modéliser, raconter, produire, adapter, visualiser.
  - **Cortex :** gouverner et orchestrer les missions, preuves, reviews et gates.
- **Démonstration éventuelle :** simulation d’un dossier passant entre trois agents ; pas de catalogue exhaustif en live.

## 23. Développement ad hoc : produire juste ce qu’il faut

- **Objectif pédagogique :** ouvrir le champ au-delà du SaaS.
- **Message principal :** une mission peut produire un notebook, un script, une analyse, un dashboard, un agent ou une mini-webapp.
- **Visuel proposé :** entonnoir de 50 fichiers Excel + PDF + question → import → nettoyage → analyse → IA → visualisation → recommandation.
- **Contenu :**
  - Le format du résultat dépend de la décision à prendre.
  - Un prototype jetable peut être plus utile qu’un produit complet.
  - L’IA raccourcit le passage entre données et premier artefact testable.
  - Le niveau d’industrialisation vient après l’apprentissage, si la valeur est démontrée.
- **Démonstration éventuelle :** animation du pipeline ; aucune donnée client réelle.

## 24. Le nouveau paradigme du conseil

- **Objectif pédagogique :** conclure la partie métier par un changement de modèle de livraison.
- **Message principal :** une mission peut produire à la fois une recommandation et l’outil qui permet de l’exécuter.
- **Visuel proposé :** avant / après.
- **Contenu :**
  - **Conseil classique :** consultant → analyse → PowerPoint → recommandations.
  - **Conseil augmenté :** consultant + IA + agents + données + outils → analyse → prototype → tests → application → mesure → amélioration.
  - La présentation reste un livrable, mais elle peut devenir le point de départ d’une action mesurable.
- **Démonstration éventuelle :** simulation d’une recommandation transformée en backlog puis en prototype.

## 25. Scénario live : « J’ai une entreprise de 50 personnes… »

- **Objectif pédagogique :** rejouer l’ensemble du système à partir d’une seule phrase.
- **Message principal :** l’utilisateur donne une intention ; les outils et agents la transforment progressivement en décision puis en artefact.
- **Visuel proposé :** parcours en cinq scènes, avec la phrase initiale toujours visible en haut.
- **Contenu :**
  1. GPT : clarifier les objectifs et les usages possibles.
  2. Web / documents : rechercher des éléments utiles et des contraintes.
  3. Obsidian : retrouver une méthode ou une décision existante.
  4. GitHub : formaliser une issue et le périmètre d’un projet.
  5. Codex : construire un prototype testable, puis préparer la revue humaine.
- **Démonstration éventuelle :** de préférence simulée ou enregistrée ; séparer les étapes pour garder le rythme et la fiabilité.

## 26. La vraie bascule

- **Objectif pédagogique :** vérifier que l’audience sait reformuler le modèle et laisser une idée forte.
- **Message principal :** l’IA devient stratégique lorsqu’elle cesse d’être une application isolée et devient une couche reliant connaissances, outils et personnes.
- **Visuel proposé :** retour sur les cinq niveaux, puis schéma final `Humain décide / juge → IA raisonne / orchestre → mémoire + outils + données → action`.
- **Contenu :**
  - À retenir : IA générative, agent, outils, mémoire, système de travail.
  - GPT cadre ; Obsidian mémorise ; GitHub trace ; Codex réalise ; l’humain valide.
  - Le résultat peut être une analyse, un livrable, un prototype ou un logiciel.
  - Phrase finale : *« Je pensais que l’IA était surtout ChatGPT. En fait, on peut construire tout un système de travail autour. »*
- **Démonstration éventuelle :** aucune ; terminer par une question orale : « Quel travail de votre semaine mérite cette première boucle ? »
