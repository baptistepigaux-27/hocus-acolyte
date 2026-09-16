# D. Liste des démonstrations

## Principes de sélection

- Deux démonstrations live maximum dans le fil principal.
- Chaque démo doit partir d’une entrée visible et se terminer par un résultat vérifiable.
- Un scénario de secours doit être disponible hors ligne pour chaque action qui dépend d’un service.
- Les captures montrent le produit ; les animations expliquent le concept ; les simulations racontent le système.

## 1. Live recommandé

### Live A — Même question, contexte différent

- **Slides :** 7–8.
- **Durée :** 4 minutes.
- **Entrée :** « Prépare mon rendez-vous avec ce client. »
- **Étape 1 :** instruction seule ; noter les hypothèses et les manques.
- **Étape 2 :** ajouter une fiche client fictive, l’objectif de la réunion, les contraintes et le format attendu.
- **Étape 3 :** demander une trame, cinq questions, trois incertitudes et les prochaines actions.
- **Message à faire verbaliser :** la réponse s’améliore parce que la situation de travail est meilleure, pas parce qu’une formule magique a été trouvée.
- **Fallback :** séquence pré-enregistrée ou screenshots de deux états, afin de ne pas dépendre d’un compte connecté.

### Live B — Document → analyse → décision

- **Slides :** 11–12 ou 19.
- **Durée :** 5–7 minutes.
- **Entrée :** un DCE/contrat de fixture sûr.
- **Étape 1 :** demander les cinq risques principaux.
- **Étape 2 :** demander de séparer faits, inférences et points à vérifier.
- **Étape 3 :** transformer le résultat en matrice d’actions ou recommandation `go / review / no-go`.
- **Message à faire verbaliser :** l’outil documentaire ne remplace pas le jugement ; il prépare une décision sourcée.
- **Source candidate :** Zoltar ou Northstar TEN, avec fixture vérifiée et UI staging explicitement marquée synthetic/fake.
- **Fallback :** capture locale de Zoltar ou simulation Northstar TEN ; aucun document client réel.

## 2. Live optionnel, hors du fil principal

### Live C — Issue → branche → test

- **Slides :** 16–20.
- **Durée :** 8 minutes maximum.
- **Entrée :** une petite évolution documentaire ou UI dans un dépôt jetable.
- **Étapes :** formuler l’issue, créer une branche, demander à Codex une modification limitée, exécuter un test, afficher la proposition de PR.
- **Condition :** environnement isolé et dépôt disposable ; aucun push, merge ou déploiement de production.
- **Message :** Codex est un agent de réalisation dans un cadre gouverné, pas un bouton « publier ».
- **Fallback :** replay de commits et captures issues d’un dépôt Hocus autorisé.

### Live D — POC Sybil

- **Slides :** 21–22.
- **Durée :** 5 minutes.
- **Entrée :** export GA4 public ou fixture locale.
- **Étapes :** reconstruire un parcours, afficher un graphe simple, montrer un pattern stable et sa limite.
- **Message :** un POC sert à apprendre et à passer un value gate avant d’industrialiser.
- **Fallback :** capture du `journey_graph.md` et de `FINDINGS.md` ; recommandé pour le deck oral.

## 3. Démonstrations simulées

| Simulation | Slides | Forme | Ce qu’elle montre |
| --- | --- | --- | --- |
| Agent de veille concurrentielle | 10–12 | 6 frames reliées | l’utilisateur donne un objectif, pas 10 micro-instructions |
| GPT + Obsidian + GitHub + Codex | 17–18 | diagramme animé | la complémentarité des rôles et les retours de contexte |
| Northstar TEN | 19–20 | carte avant / après | besoin métier → analyse sourcée → outil testable |
| Roster Hocus | 22 | pipeline avec agents spécialisés | chaque moteur a une responsabilité lisible |
| Conseil augmenté | 24–25 | transformation d’un livrable | recommandation → prototype → mesure → amélioration |

## 4. Captures fixes

### À privilégier

1. Une capture Zoltar de `review-queue` ou `evidence-explorer` avec provenance visible.
2. Une capture Northstar TEN de l’interface DCE Analyzer, marquée synthetic/fake.
3. Un graphe Sybil rendu proprement depuis les artifacts golden.
4. Une issue et une PR GitHub réelles, anonymisées, avec checks visibles si l’autorisation est confirmée.
5. Une vue Obsidian réduite à une note d’architecture ou une décision générique.
6. Une capture Inat/Fumist montrant un même contenu rendu en HTML et PPTX, si l’on souhaite parler de la future chaîne de publication.

### À éviter

- Capturer un terminal plein de logs.
- Afficher des fichiers JSON ou CSV sans traduction visuelle.
- Montrer une interface de staging sans expliquer ce qui est synthétique.
- Faire de la capture GitHub une preuve d’autonomie : la preuve porte sur le workflow, pas sur l’absence d’humain.

## 5. Animations conceptuelles

| Animation | Slide | Durée cible | Principe |
| --- | --- | --- | --- |
| Couches de la réponse générative | 4 | 10 s | contexte + instruction + apprentissage → sortie |
| Pipeline du LLM | 5 | 12 s | documents → modèle → réponse |
| Boucle de l’agent | 10 | 15 s | objectif → outil → observation → décision |
| Mémoire sans / avec continuité | 13 | 12 s | deux sessions, deux niveaux de contexte |
| Timeline de livraison | 16 | 15 s | arrêt sur la validation humaine |
| Deux chemins de construction | 21 | 12 s | Spec Driven / POC Driven |

Les animations restent conceptuelles et doivent pouvoir être remplacées par un slide statique dans le PDF ou le mode impression.

## 6. Ordre de répétition conseillé

1. Répéter le live A jusqu’à obtenir un résultat stable en moins de quatre minutes.
2. Répéter le live B uniquement avec des fixtures validées.
3. Enregistrer le cycle GitHub/Codex au lieu de le faire dépendre du réseau le jour de la présentation.
4. Tester le deck sans audio : le message principal doit rester compréhensible à la seule lecture des visuels.
