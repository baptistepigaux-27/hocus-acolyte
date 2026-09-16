# Démonstrations V2

## Règles de production

- Deux démonstrations **LIVE** principales maximum.
- Chaque démonstration a un résultat visible en moins de sept minutes.
- Le deck doit fonctionner sans connexion, sans compte et sans manipulation fragile.
- Tout scénario réel est exécuté dans un environnement isolé ; aucun merge, push ou déploiement de production.
- Une démonstration peut être dite « réelle » tout en montrant une fixture, si son statut est affiché.

## LIVE — principales

### LIVE 1 — Même question, contexte différent

- **Slides :** 3–5.
- **But :** faire comprendre que le contexte compte autant que le prompt.
- **Entrée :** « Prépare mon rendez-vous avec ce client. »
- **Étapes :**
  1. demander une réponse avec l’instruction seule ;
  2. ajouter une fiche client fictive, l’objectif, les contraintes et le format attendu ;
  3. demander questions, incertitudes, trame et prochaines actions.
- **Durée :** 3–4 minutes.
- **Prérequis :** compte ChatGPT disponible ou capture prête ; fiche client entièrement fictive.
- **Fallback :** vidéo courte ou deux captures avant / après avec le même prompt.
- **Message :** la situation de travail est plus riche, donc la réponse devient plus actionnable.
- **Classement :** `LIVE` ; fallback `PRE-RECORDED`.

### LIVE — 2 — Créer une évolution sur un produit

- **Slides :** 12–16.
- **But :** montrer la continuité GPT → Obsidian → GitHub → Codex sans prétendre automatiser toute la chaîne en direct.
- **Entrée :** « Crée une évolution sur ce produit : permettre de revoir le résultat avant publication. »
- **Étapes :**
  1. GPT reformule objectif, périmètre et critères ;
  2. Obsidian fournit une décision/méthode existante ;
  3. GitHub matérialise une issue ;
  4. Codex reçoit une mission dans un workspace isolé ;
  5. une sortie de tests et une PR/staging sont montrées comme résultat.
- **Durée :** 5–7 minutes.
- **Prérequis :** dépôt disposable ou fixture de workflow ; captures GitHub et Obsidian autorisées ; Codex disponible si une étape est exécutée.
- **Fallback :** replay enregistré de la chaîne avec le même identifiant de mission, aucune écriture distante en live.
- **Message :** une phrase garde son intention en changeant de forme ; chaque outil prend un rôle précis.
- **Classement :** `LIVE` si la chaîne est préparée ; sinon `PRE-RECORDED`.

## PRE-RECORDED

### Replay A — Northstar TEN : DCE → décision

- **Slides :** 17–19.
- **Type :** `PRE-RECORDED`.
- **Durée :** 60–90 secondes.
- **Prérequis :** fixture DCE sûre, build UI staging synthetic/fake, capture des facts/evidence et de l’assessment.
- **Séquence :** upload/entrée → extraction → exigences/risques → Opportunity Score → `go / review / no-go` → vue testable.
- **Fallback :** six captures fixes annotées.
- **Pourquoi :** cas principal plus crédible et plus stable qu’une démo réseau.

### Replay B — Sybil : question → POC → value gate

- **Slides :** 20.
- **Type :** `PRE-RECORDED`, optionnel dans la version courte.
- **Durée :** 60–90 secondes.
- **Prérequis :** `artifacts/golden/` et `FINDINGS.md` ; données publiques/fixtures uniquement.
- **Séquence :** entrée GA4 → parcours → journey graph → pattern stable → résultat et limite → décision d’industrialisation.
- **Fallback :** une seule image du graphe avec un encadré « ce que le POC prouve / ne prouve pas ».
- **Pourquoi :** démontre le mode POC Driven sans ouvrir une seconde visite produit.

## SCREENSHOT

| Capture | Slide | Type | Durée / usage | Prérequis | Fallback |
| --- | ---: | --- | --- | --- | --- |
| Obsidian : note d’architecture/décision | 7, 13 | `SCREENSHOT` | 20–30 s de commentaire | note générique, anonymisée | mockup vectoriel |
| GitHub : issue structurée | 14, 16, 18 | `SCREENSHOT` | 30 s | repo, issue et personnes autorisés | issue recréée avec contenu fictif |
| GitHub : PR + checks | 14–16, 19 | `SCREENSHOT` | 30 s | PR réelle et checks vérifiés | replay de commits + test local |
| Northstar TEN UI | 17, 19 | `SCREENSHOT` | 30 s | staging synthetic/fake | montage static HTML |
| Sybil journey graph | 20 | `SCREENSHOT` | 30 s | rendu depuis `artifacts/golden/` | diagramme recréé |
| Inat consulting output | 22 | `SCREENSHOT` | 20 s | run sur fixture sûre | schéma du pipeline |

## ANIMATED CONCEPT

| Concept | Slide | Type | Durée cible | Message |
| --- | ---: | --- | ---: | --- |
| usages familiers → travail complet | 2–3 | `ANIMATED CONCEPT` | 10 s | la conversation ouvre une boucle |
| contexte ajouté autour du prompt | 5 | `ANIMATED CONCEPT` | 10 s | le contexte change le résultat |
| équation IA seule ≠ système IA | 6 | `ANIMATED CONCEPT` | 12 s | modèle + contexte + mémoire + outils + actions |
| mémoire trois semaines plus tard | 7 | `ANIMATED CONCEPT` | 12 s | continuité avec / sans mémoire |
| chatbot contre agent | 9 | `ANIMATED CONCEPT` | 15 s | **WOW 1** : question → réponse contre objectif → workflow |
| boucle contrôlée de l’agent | 10–11 | `ANIMATED CONCEPT` | 15 s | action, observation, preuve, gate |
| timeline de livraison | 15 | `ANIMATED CONCEPT` | 15 s | arrêt visible sur validation humaine |
| phrase → brief → spec → issue → code | 18–19 | `ANIMATED CONCEPT` | 15 s | **WOW 3** : intention devenue logiciel |

## OPTIONAL

### OPTIONAL — Stolas : catalogue → similarité

- **Slides :** 21, en note seulement.
- **Type :** `OPTIONAL`.
- **Durée :** 60 secondes.
- **Pourquoi :** très démonstratif mais plus technique ; peut brouiller le cas principal.
- **Fallback :** ne pas l’inclure dans la version orale.

### OPTIONAL — Codex dans un dépôt disposable

- **Slides :** 14–16.
- **Type :** `OPTIONAL`.
- **Durée :** 5–8 minutes hors fil principal.
- **Pourquoi :** intéressant pour un public technique, fragile pour la narration non technique.
- **Conditions :** workspace isolé, tests courts, aucun push/merge/deploy.
- **Fallback :** replay.

### OPTIONAL — Hocus multi-agents

- **Slide :** 21.
- **Type :** `OPTIONAL`.
- **Durée :** 45–60 secondes.
- **Pourquoi :** simuler le passage d’un dossier entre trois responsabilités, sans exécuter onze moteurs.
- **Fallback :** pipeline statique.

## Ordre de répétition

1. Stabiliser LIVE 1.
2. Enregistrer LIVE 2 au lieu de dépendre d’une chaîne live complète.
3. Capturer Northstar TEN et Sybil avec leurs statuts visibles.
4. Vérifier que chaque animation possède une version statique lisible en PDF.
