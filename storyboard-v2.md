# Hocus Acolyte — Storyboard V2

## Positionnement

**Titre recommandé :** *L’IA : du chatbot au système de travail*

La présentation part de ce que l’audience connaît déjà — ChatGPT — puis montre par révélations successives ce que changent le contexte, les outils, la mémoire, l’autonomie et l’organisation du travail.

**Format :** 23 slides, 16:9, présentation orale de 45–55 minutes, deux démonstrations live principales et des replays/captures pour le reste.

**Cas recommandé :** Northstar TEN en cas principal ; Sybil en mini-cas secondaire pour expliquer le POC Driven et le value gate.

**Fil rouge :** une question de travail devient un résultat vérifiable, puis éventuellement un outil.

---

## ACTE 1 — Ce que vous connaissez déjà

### 1. Vous connaissez déjà une partie de l’histoire

- **Objectif pédagogique :** commencer dans un territoire familier et réduire la distance avec le sujet.
- **Message :** ChatGPT est déjà une première forme de travail augmenté ; la suite consiste à comprendre ce qui se passe autour de la conversation.
- **Contenu :**
  - Titre : *L’IA : du chatbot au système de travail*.
  - Sous-titre : *Ce qui devient possible lorsque la conversation rencontre le contexte, les outils et la mémoire.*
  - Promesse : passer de « je pose une question » à « je fais avancer un travail ».
- **Visuel :** une bulle de chat seule à gauche, reliée à une carte de travail encore floutée à droite.
- **Narration orale :** « Vous savez déjà utiliser une IA pour obtenir une réponse. Aujourd’hui, on va regarder ce qu’il faut ajouter pour qu’elle puisse participer à un vrai travail. »
- **Asset réel :** aucun ; couverture native avec un traitement graphique Hocus discret.
- **Démo éventuelle :** aucune.
- **INTERACTIVE_CANDIDATE:** no

### 2. Question, résumé, rédaction, analyse

- **Objectif pédagogique :** faire reconnaître immédiatement les usages quotidiens.
- **Message :** l’IA est déjà utile pour comprendre et produire, même sans agent ni automatisation.
- **Contenu :**
  - « Résume ce document. »
  - « Reformule ce message. »
  - « Compare ces deux options. »
  - « Aide-moi à structurer ce problème. »
  - « Transforme cette analyse en présentation. »
- **Visuel :** cinq cartes entrée → sortie, avec une seule couleur d’accent ; pas d’interface produit détaillée.
- **Narration orale :** « Rien de tout cela n’est magique : l’IA transforme une matière en une autre. Le premier saut arrive quand elle reçoit la situation complète. »
- **Asset réel :** capture ou mockup ChatGPT facultatif ; privilégier un exemple fictif pour ne pas faire de la marque le sujet.
- **Démo éventuelle :** une phrase affichée, puis ses cinq transformations en animation courte.
- **INTERACTIVE_CANDIDATE:** no

### 3. Le travail autour de la réponse

- **Objectif pédagogique :** installer le fil rouge sans introduire encore Hocus.
- **Message :** dans un vrai travail, il faut comprendre la demande, vérifier les informations, préparer une action et suivre la suite.
- **Contenu :**
  - Situation : « Je dois préparer un rendez-vous avec un client. »
  - La réponse seule ne suffit pas : il faut le contexte, les questions, les incertitudes et les prochaines actions.
  - La même IA peut aider avant, pendant et après le rendez-vous.
- **Visuel :** boucle de cinq cartes : synthétiser → questionner → identifier les incertitudes → préparer → rendre compte.
- **Narration orale :** « Le sujet n’est pas de demander une plus jolie réponse. Le sujet est de faire franchir au travail plusieurs étapes cohérentes. »
- **Asset réel :** aucun ; cas fictif universel.
- **Démo éventuelle :** **LIVE 1** commence ici si retenue : instruction seule puis contexte ajouté en slide 5.
- **INTERACTIVE_CANDIDATE:** yes
### 4. Ce qu’il y a derrière la réponse

- **Objectif pédagogique :** expliquer IA générative et LLM sans cours académique.
- **Message :** une IA générative compose une réponse probable à partir de ce qu’elle a appris et de la situation fournie ; elle ne consulte pas automatiquement une base de réponses vraies.
- **Contenu :**
  - `CONTEXTE + INSTRUCTION + CONNAISSANCES APPRISES → RÉPONSE`.
  - Un LLM a appris les relations entre mots, concepts, intentions, structures et formes de documents.
  - Il peut être très utile et néanmoins se tromper ou inventer.
- **Visuel :** pipeline minimal `textes → modèle → instruction + contexte → réponse`, avec un petit marqueur « à vérifier ».
- **Narration orale :** « Le modèle sait très bien reconstruire une forme de réponse. Il ne sait pas, par ce seul mécanisme, que la réponse est vraie dans votre contexte. »
- **Asset réel :** aucun ; schéma natif éditable.
- **Démo éventuelle :** animation de la sortie avec contexte vide puis contexte riche.
- **INTERACTIVE_CANDIDATE:** no

---

## ACTE 2 — Ce qui change tout

### 5. Le contexte change la qualité du travail

- **Objectif pédagogique :** faire vivre la différence entre prompt et contexte.
- **Message :** `bonne question → bonne réponse` est un modèle trop pauvre ; objectif, données, contraintes et résultat attendu comptent autant.
- **Contenu :**
  - À gauche : « Prépare mon rendez-vous. »
  - À droite : objectif de la réunion, fiche client fictive, historique, contraintes, format de sortie.
  - Résultat attendu : questions, risques, trame et actions.
- **Visuel :** split screen avant / après, avec des pièces de contexte qui s’ajoutent autour de la même phrase.
- **Narration orale :** « La différence ne vient pas d’un prompt secret. Elle vient du fait que l’IA comprend mieux la situation dans laquelle elle doit être utile. »
- **Asset réel :** aucun ; utiliser le cas fictif du slide 3.
- **Démo éventuelle :** **LIVE 1** — même instruction, puis ajout du contexte ; durée totale 4 minutes.
- **INTERACTIVE_CANDIDATE:** yes

### 6. IA seule ≠ système IA

- **Objectif pédagogique :** formuler clairement la thèse de l’acte 2.
- **Message :** la puissance d’un système vient de la combinaison du modèle avec le contexte, la mémoire, les outils et les actions.
- **Contenu :**
  - **IA seule :** génère une proposition.
  - **Système IA :** connaît la mission, retrouve le contexte, observe des sources, utilise des outils et produit une action contrôlable.
  - Formule : `Modèle + Contexte + Mémoire + Outils + Actions = Système IA`.
- **Visuel :** équation qui s’enrichit de gauche à droite ; le mot « contrôle » encadre l’ensemble.
- **Narration orale :** « Le modèle reste le moteur de langage. Le système est tout ce qu’on construit autour pour qu’il puisse travailler de façon utile et vérifiable. »
- **Asset réel :** aucun ; diagramme vectoriel à créer.
- **Démo éventuelle :** aucune ; respiration conceptuelle de 45 secondes.
- **INTERACTIVE_CANDIDATE:** yes

### 7. Trois semaines plus tard : la mémoire

- **Objectif pédagogique :** créer le premier moment mémorable et expliquer la continuité.
- **Message :** sans mémoire organisée, une nouvelle conversation repart presque de zéro ; avec une mémoire de travail, elle retrouve les décisions et le contexte.
- **Contenu :**
  - Scène : « Je reprends le projet trois semaines plus tard. »
  - Sans mémoire : tout réexpliquer, risque d’incohérence.
  - Avec mémoire : retrouver brief, décisions, méthodes, essais et points ouverts.
  - La mémoire conserve aussi les sources, limites et incertitudes.
- **Visuel :** deux lignes temporelles ; à droite, une note « décision du 12 juin » réinjectée dans la nouvelle session.
- **Narration orale :** « La mémoire n’est pas un bonus de confort. Elle évite de perdre le travail déjà fait et permet à l’IA d’être cohérente dans le temps. »
- **Asset réel :** note Obsidian anonymisée ou mockup inspiré d’une note d’architecture ; ne pas ouvrir le vault réel.
- **Démo éventuelle :** animation sans / avec mémoire, 12 secondes.
- **INTERACTIVE_CANDIDATE:** yes

### 8. Ajouter un objectif, des outils, une boucle

- **Objectif pédagogique :** introduire l’agent comme une conséquence logique, pas comme un mot à la mode.
- **Message :** un agent est une IA qui poursuit un objectif en choisissant plusieurs étapes dans un cadre autorisé.
- **Contenu :**
  - Définition : objectif + outils + autonomie bornée.
  - Boucle : planifier → appeler un outil → observer → décider de la suite.
  - L’utilisateur ne dicte pas chaque micro-étape.
  - Les règles, permissions et points d’arrêt restent explicites.
- **Visuel :** une boucle simple avec un panneau latéral « autorisé / interdit / à valider ».
- **Narration orale :** « Un agent n’est pas une IA qui fait n’importe quoi toute seule. C’est une IA à qui l’on confie un objectif et une marge d’initiative définie. »
- **Asset réel :** aucun ; schéma natif éditable.
- **Démo éventuelle :** aucune ; préparer le choc visuel du slide 9.
- **INTERACTIVE_CANDIDATE:** yes

---

## ACTE 3 — Un agent travaille

### 9. Chatbot contre agent — le déclic

- **Objectif pédagogique :** rendre la différence immédiatement mémorisable.
- **Message :** le chatbot répond à une question ; l’agent poursuit un objectif en enchaînant observation, action et vérification.
- **Contenu :**
  - **CHATBOT :** question → réponse.
  - **AGENT :** objectif → recherche → fichiers → APIs → comparaison → calcul → vérification → résultat.
  - La différence porte sur la boucle de travail, pas sur un costume ou une personnalité.
- **Visuel :** écran coupé brutalement en deux ; la moitié agent se déploie en plusieurs étapes avec un curseur « autonomie bornée ».
- **Narration orale :** « Le mot important n’est pas “plus intelligent”. Le mot important est “plus d’étapes prises en charge”. »
- **Asset réel :** aucun ; animation conceptuelle à fort contraste.
- **Démo éventuelle :** **WOW 1** ; révélation animée de 15 secondes.
- **INTERACTIVE_CANDIDATE:** yes

### 10. Démonstration conceptuelle : analyser un dossier

- **Objectif pédagogique :** montrer un agent au travail, étape par étape.
- **Message :** l’utilisateur donne un objectif ; l’agent choisit et exécute les étapes nécessaires pour produire une synthèse vérifiable.
- **Contenu :**
  - Demande : « Évalue ce dossier et prépare une recommandation. »
  - Comprendre la demande et le périmètre.
  - Chercher les informations autorisées et lire les sources.
  - Comparer les éléments, calculer les indicateurs utiles.
  - Produire une synthèse avec sources, inconnues et prochaine action.
- **Visuel :** six frames reliées ; chaque frame affiche l’outil utilisé et la sortie produite.
- **Narration orale :** « Si je dois donner chacune de ces instructions, je pilote un chatbot. Si je donne l’objectif et que la boucle est bornée, on commence à parler d’agent. »
- **Asset réel :** les contrats d’evidence et provenance de [Northstar TEN](/home/ubuntu/northstar-ten/README.md) peuvent inspirer la séparation faits / inférences / score ; le scénario présenté reste générique.
- **Démo éventuelle :** simulation pré-enregistrée ; pas de recherche réseau non contrôlée.
- **INTERACTIVE_CANDIDATE:** yes

### 11. Un workflow, pas une boîte noire

- **Objectif pédagogique :** montrer que l’autonomie utile reste observable et contrôlée.
- **Message :** un agent produit des étapes, des artefacts et des preuves ; il ne transforme pas automatiquement une proposition en décision finale.
- **Contenu :**
  - À chaque étape : entrée autorisée, action, observation, sortie.
  - Les erreurs peuvent déclencher une correction ou un arrêt.
  - Une décision sensible peut demander une validation humaine.
  - Résultat : proposition → exécution contrôlée → test → validation → action.
- **Visuel :** une piste de workflow avec une loupe sur les preuves et un gate humain avant l’action conséquente.
- **Narration orale :** « Plus l’IA agit, plus il faut rendre son travail visible : ce qu’elle a vu, ce qu’elle a fait, ce qu’elle ignore et qui valide. »
- **Asset réel :** [Cortex — Human Gates](/home/ubuntu/hocus-cortex/docs/HUMAN_GATES.md), simplifié en langage non technique.
- **Démo éventuelle :** animation d’un arrêt sur `validation humaine`.
- **INTERACTIVE_CANDIDATE:** yes

---

## ACTE 4 — Voilà comment je travaille réellement

### 12. Quatre rôles, un système de travail

- **Objectif pédagogique :** introduire Hocus par les rôles concrets de Baptiste.
- **Message :** GPT, Obsidian, GitHub et Codex ne font pas la même chose ; leur valeur vient des handoffs entre eux.
- **Contenu :**
  - **GPT :** réfléchir, cadrer, challenger, orchestrer le dialogue.
  - **Obsidian :** mémoriser les décisions, briefs, méthodes et expériences.
  - **GitHub :** porter l’état du travail, les versions, tests et revues.
  - **Codex :** réaliser dans le code, tester et préparer une version.
- **Visuel :** quatre cartes autour d’un objectif utilisateur ; chaque carte a une entrée, une sortie et une limite.
- **Narration orale :** « Je n’utilise pas quatre IA pour faire la même chose. J’utilise des rôles différents qui se passent un travail structuré. »
- **Asset réel :** [architecture Obsidian locale](/home/ubuntu/obsidian-vault/Notes/System%20-%20architecture%20Hermes%20Obsidian.md) et [workflow Hocus](/home/ubuntu/obsidian-vault/Projets/Hocus%20-%20Delivery.md), après sélection d’extraits non sensibles.
- **Démo éventuelle :** aucune ; slide de cadrage de l’acte 4.
- **INTERACTIVE_CANDIDATE:** yes

### 13. GPT + Obsidian : penser et se souvenir

- **Objectif pédagogique :** rendre visible le premier handoff.
- **Message :** GPT aide à clarifier et à structurer ; Obsidian conserve ce qui doit rester disponible demain.
- **Contenu :**
  - GPT clarifie une idée, pose les questions difficiles et produit un brief.
  - Les décisions importantes passent dans la mémoire de travail.
  - Une session future peut retrouver l’architecture, les choix et les points ouverts.
  - Une note n’est pas une vérité automatique : provenance et statut restent visibles.
- **Visuel :** flux bidirectionnel `conversation → décision → note → contexte futur`.
- **Narration orale :** « GPT est le lieu de la conversation ; Obsidian devient le lieu de la continuité. »
- **Asset réel :** note générique issue du vault ou mockup ; aucune note client, aucun contenu privé.
- **Démo éventuelle :** capture fixe, pas de navigation live.
- **INTERACTIVE_CANDIDATE:** yes

### 14. GitHub + Codex : agir et laisser une trace

- **Objectif pédagogique :** rendre le passage de l’intention au changement technique compréhensible.
- **Message :** GitHub porte l’état opérationnel ; Codex exécute une évolution dans un espace isolé et produit des changements vérifiables.
- **Contenu :**
  - Issue : objectif, périmètre et critères de réussite.
  - Branche : espace isolé pour travailler.
  - Codex : lit, modifie, teste.
  - PR : proposition à relire ; CI : contrôles ; staging : version testable.
- **Visuel :** fiche d’issue qui se transforme en diff, test, PR puis écran staging.
- **Narration orale :** « Codex peut faire beaucoup de travail technique. Il ne reçoit pas pour autant le droit de décider seul de la production. »
- **Asset réel :** [Cortex — Codex runtime adapter](/home/ubuntu/hocus-cortex/docs/CODEX_RUNTIME_ADAPTER.md) et [GitHub adapter](/home/ubuntu/hocus-cortex/docs/GITHUB_SOFTWARE_DELIVERY_ADAPTER.md), traduits en schéma.
- **Démo éventuelle :** capture/replay de cycle ; aucune opération de merge ou de production.
- **INTERACTIVE_CANDIDATE:** yes

### 15. Le workflow réel : l’humain reste le gatekeeper

- **Objectif pédagogique :** ancrer l’autonomie dans une chaîne de contrôle explicite.
- **Message :** le système propose et exécute sous contrôle ; l’humain valide avant les décisions conséquentes et la production.
- **Contenu :**
  - `Idée → Issue → Branche → Développement → Tests → PR → Préprod → Validation humaine → Production`.
  - Les contrôles automatiques réduisent les erreurs répétitives.
  - La revue humaine juge le résultat, les risques et le périmètre.
  - La production est une étape distincte, jamais implicite.
- **Visuel :** timeline qui s’arrête en grand sur `Validation humaine` avant de continuer vers `Production`.
- **Narration orale :** « L’objectif n’est pas d’effacer l’humain. C’est de lui réserver le cadrage, le jugement et les décisions qui méritent son attention. »
- **Asset réel :** [server-playbook](/home/ubuntu/server-playbook/Systeme-global-developpement.md) et [Cortex human gates](/home/ubuntu/hocus-cortex/docs/HUMAN_GATES.md).
- **Démo éventuelle :** animation de la timeline ; fallback statique complet.
- **INTERACTIVE_CANDIDATE:** yes

### 16. Démonstration : « Crée une évolution sur ce produit »

- **Objectif pédagogique :** faire vivre la continuité GPT → Obsidian → GitHub → Codex.
- **Message :** une phrase ne déclenche pas un saut magique ; elle ouvre une chaîne de cadrage, capitalisation, formalisation et réalisation.
- **Contenu :**
  1. GPT clarifie l’objectif et les critères.
  2. Obsidian retrouve une décision ou une méthode existante.
  3. GitHub reçoit une issue structurée.
  4. Codex lit la spec, travaille dans une branche, ajoute les tests.
  5. PR / staging exposent le résultat à la revue humaine.
- **Visuel :** cinq scènes avec le même identifiant de mission et un artefact par scène.
- **Narration orale :** « La continuité est la démonstration : le même travail change de forme sans perdre son intention ni sa trace. »
- **Asset réel :** captures anonymisées issues d’un cycle autorisé ; à défaut, montage synthétique à partir de [Northstar TEN](/home/ubuntu/northstar-ten/README.md) et du workflow documenté.
- **Démo éventuelle :** **LIVE 2** ou replay de 5–7 minutes ; ne pas attendre toute l’exécution Codex.
- **INTERACTIVE_CANDIDATE:** yes

---

## ACTE 5 — De l’idée au produit

### 17. Cas principal : Northstar TEN

- **Objectif pédagogique :** montrer une transformation métier réelle et compréhensible.
- **Message :** un problème de décision peut devenir une chaîne d’analyse puis un outil testable.
- **Contenu :**
  - Question : « À quels appels d’offres répondre, pourquoi, avec quel risque et quelles chances ? »
  - Entrées : données de marchés publics, DCE, données entreprise.
  - Sorties : synthèse, échéances, exigences, risques, matrice de conformité et Opportunity Score explicable.
  - Décision : `go / review / no-go`, sans prétendre calculer une probabilité de gain sans preuve.
- **Visuel :** carte métier DCE / données → faits + evidence → assessment → décision.
- **Narration orale :** « Ce cas est intéressant parce qu’il ne demande pas seulement de résumer un document : il relie extraction, données, analyse, provenance et décision. »
- **Asset réel :** [Northstar TEN README](/home/ubuntu/northstar-ten/README.md), `specs/SPEC-007-dce-analyzer.md`, `specs/SPEC-009-dce-analyzer-ui.md`, fixtures DCE ; UI explicitement synthetic/fake.
- **Démo éventuelle :** replay ou capture de l’UI staging synthetic/fake.
- **INTERACTIVE_CANDIDATE:** yes

### 18. De la question au brief, puis à l’issue

- **Objectif pédagogique :** montrer la formalisation progressive avant le code.
- **Message :** l’IA aide à transformer une intention floue en contrat de travail vérifiable.
- **Contenu :**
  - Question métier.
  - Discussion GPT : utilisateurs, données, sorties, limites et critères.
  - Brief/spec : objectif, périmètre, exclusions, qualité attendue.
  - Issue GitHub : travail pilotable et relié à une branche.
- **Visuel :** une phrase qui se densifie en quatre documents, chacun plus précis que le précédent.
- **Narration orale :** « La spécification n’est pas de la bureaucratie : c’est ce qui permet à un agent de travailler sans deviner le problème. »
- **Asset réel :** [Northstar SPEC-009](/home/ubuntu/northstar-ten/specs/SPEC-009-dce-analyzer-ui.md) et [Cortex Spec Driven](/home/ubuntu/hocus-cortex/docs/SPEC_DRIVEN.md), avec extraits courts.
- **Démo éventuelle :** animation phrase → brief → spec → issue.
- **INTERACTIVE_CANDIDATE:** yes

### 19. Du code à l’application testée

- **Objectif pédagogique :** créer le troisième moment fort : la phrase devient un logiciel traçable.
- **Message :** le produit est construit par une chaîne d’artefacts, de contrôles et de validation humaine.
- **Contenu :**
  - `SPEC → ISSUE → CODE → TESTS → PR → STAGING → APPLICATION`.
  - Les tests rendent la modification vérifiable.
  - La PR rend le changement relisible.
  - Le staging rend l’expérience testable par l’humain.
- **Visuel :** six vignettes reliées, avec un « avant / après » sur la dernière.
- **Narration orale :** « Le résultat final est visible, mais il n’est pas apparu d’un coup : chaque étape a laissé une preuve de ce qui a été décidé et produit. »
- **Asset réel :** branch `feat/10-spec-009-dce-analyzer-ui`, commit local `102ab0d`, specs/tests/static UI de [Northstar TEN](/home/ubuntu/northstar-ten/), sous réserve de vérifier l’alignement distant avant capture GitHub.
- **Démo éventuelle :** **WOW 3** ; capture/replay, pas de modification distante en direct.
- **INTERACTIVE_CANDIDATE:** yes

### 20. Mini-cas secondaire : Sybil, apprendre avant d’industrialiser

- **Objectif pédagogique :** expliquer la logique POC Driven sans ouvrir un second catalogue produit.
- **Message :** lorsque la question principale est la valeur ou la faisabilité, on teste rapidement sur des données réelles/publics avant d’industrialiser.
- **Contenu :**
  - `Question → POC → données → patterns → observation → value gate → GO / NO-GO`.
  - Sybil reconstruit des parcours, produit un journey graph et teste des patterns comportementaux.
  - Les résultats gardent leurs sources, limites et statut de validation.
  - Un POC conclut aussi quand il faut itérer ou ne pas construire.
- **Visuel :** deux rails : expérimentation courte puis décision ; industrialisation seulement après le gate.
- **Narration orale :** « On ne construit pas systématiquement une usine pour découvrir ensuite que personne n’en a besoin. »
- **Asset réel :** [Sybil POC-000](/home/ubuntu/hocus-sybil/docs/POC-000.md), `FINDINGS.md`, `artifacts/golden/journey_graph.md`, `patterns.json`; données publiques/fixtures, pas de données client.
- **Démo éventuelle :** replay de 60–90 secondes ou capture du graphe ; optionnel dans la version courte.
- **INTERACTIVE_CANDIDATE:** yes

### 21. Un même système, plusieurs agents spécialisés

- **Objectif pédagogique :** ouvrir sur l’écosystème Hocus sans enseigner son architecture interne.
- **Message :** une architecture de travail peut réutiliser le même cadre avec des moteurs spécialisés par responsabilité.
- **Contenu :**
  - Sources → **Gremlin / Zoltar** : collecter, lire.
  - Intelligence → **Stolas / Sybil / Northstar / Maze** : comparer, comprendre, modéliser.
  - Restitution → **Inat / Fumist / Yokai / Doppel** : raconter, visualiser, produire, adapter.
  - **Cortex** autour : orchestrer, gouverner, demander des preuves et matérialiser les gates.
- **Visuel :** un seul pipeline à trois étages ; les noms sont secondaires et portés par des étiquettes de responsabilité.
- **Narration orale :** « La spécialisation ne sert pas à multiplier les logos. Elle sert à donner à chaque moteur un travail clair et contrôlable. »
- **Asset réel :** READMEs/specs des dépôts [Gremlin](/home/ubuntu/hocus-gremlin/README.md), [Stolas](/home/ubuntu/hocus-stolas/README.md), [Inat](/home/ubuntu/hocus-inat/README.md), [Cortex](/home/ubuntu/hocus-cortex/README.md) ; une seule composition graphique.
- **Démo éventuelle :** simulation d’un dossier passant par trois agents ; pas de démo technique multi-repo.
- **INTERACTIVE_CANDIDATE:** yes

### 22. Conseil augmenté : recommandation + prototype + outil

- **Objectif pédagogique :** relier le système IA à la pratique du conseil et à la résolution de problèmes métier.
- **Message :** une mission peut produire une analyse et le moyen de l’exécuter, au niveau d’industrialisation réellement justifié.
- **Contenu :**
  - Entrée : 50 fichiers Excel, quelques PDF, une question.
  - Pipeline : import → nettoyage → analyse → IA → visualisation → recommandation.
  - Sorties possibles : notebook, script, dashboard, agent, mini-webapp ou produit.
  - Conseil classique : analyse → PowerPoint.
  - Conseil augmenté : analyse → prototype → tests → application → mesure → amélioration.
- **Visuel :** avant / après avec sorties graduées ; la recommandation et l’outil apparaissent dans la même boucle.
- **Narration orale :** « La bonne réponse n’est pas toujours un SaaS. Parfois, un script ou un dashboard résout le problème plus vite et permet d’apprendre. »
- **Asset réel :** [Inat consulting golden paths](/home/ubuntu/hocus-inat/docs/consulting-golden-paths.md), [Inat product/repository explainer](/home/ubuntu/hocus-inat/docs/product-repository-explainer.md), fixtures uniquement.
- **Démo éventuelle :** animation de pipeline ; pas de données client.
- **INTERACTIVE_CANDIDATE:** yes

### 23. Le basculement

- **Objectif pédagogique :** synthétiser la progression et laisser le modèle mental final.
- **Message :** l’IA devient une infrastructure de travail lorsqu’elle relie humain, raisonnement, mémoire, outils, données et action sous contrôle.
- **Contenu :**
  - `Chat → Copilot → Agent → Workflow → System`.
  - Humain : décide, juge, arbitre.
  - IA : raisonne, orchestre, propose, exécute dans un cadre.
  - Mémoire + outils + données : donnent continuité et capacité d’action.
  - Phrase finale : « Je pensais que l’IA était surtout ChatGPT. En fait, on peut construire tout un système de travail autour. »
- **Visuel :** retour sur l’escalier de slide 1, puis schéma final `Humain → IA → mémoire / outils / données → action`, avec le gate humain visible.
- **Narration orale :** « Le véritable changement ne commence pas quand l’IA parle mieux. Il commence quand elle devient une couche qui relie les connaissances, les outils et les personnes. »
- **Asset réel :** aucun ; synthèse native à partir des motifs du deck.
- **Démo éventuelle :** aucune ; question finale au public : « Quel travail de votre semaine mérite cette première boucle ? »
- **INTERACTIVE_CANDIDATE:** yes
