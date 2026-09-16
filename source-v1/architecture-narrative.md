# B. Architecture narrative

## Thèse

Le deck raconte une montée en puissance, pas une liste de définitions :

```text
Répondre → contextualiser → utiliser des outils → agir → mémoriser
→ faire collaborer plusieurs rôles → construire un système
```

La question qui revient est toujours la même : **qu’est-ce que l’IA peut prendre en charge à l’étape suivante, et quel contrôle faut-il conserver ?**

## Les quatre mouvements

### Mouvement 1 — Comprendre (slides 1–6)

On part de l’image familière de ChatGPT, puis on corrige doucement le modèle mental : une IA générative n’est pas une base de réponses ; un LLM compose à partir de relations apprises ; ses capacités sont larges mais ses erreurs sont possibles.

**Transition vers le mouvement 2 :**

> Si la réponse dépend du contexte, la première compétence à développer n’est pas de poser une question magique. C’est de construire la bonne situation de travail.

### Mouvement 2 — Contextualiser (slides 7–8)

Le public voit immédiatement la différence entre une consigne isolée et une mission contextualisée. Le cas du rendez-vous client sert de pont : l’IA n’est pas encore un agent autonome, mais elle accompagne déjà une boucle de travail complète.

**Transition vers le mouvement 3 :**

> Jusqu’ici, l’utilisateur conduisait chaque étape. Que se passe-t-il lorsqu’on confie l’objectif, les outils et une marge d’initiative à l’IA ?

### Mouvement 3 — Combiner (slides 9–15)

On introduit les mots dans cet ordre : chatbot, assistant, agent, workflow, système. Puis on montre que l’agent n’est pas une personnalité mystérieuse : c’est une boucle objectif → décision → outil → observation. Les outils donnent accès au monde numérique ; la mémoire donne de la continuité.

Obsidian et GitHub arrivent après les concepts universels, chacun avec une fonction nette : mémoire de travail d’un côté, mémoire opérationnelle du produit de l’autre.

**Transition vers le mouvement 4 :**

> Une IA outillée et dotée d’un contexte peut préparer et exécuter. Pour que cela devienne un vrai système de travail, il faut encore relier les rôles et organiser les gates.

### Mouvement 4 — Agir et construire (slides 16–26)

Le workflow Hocus rend l’autonomie concrète et bornée. GPT, Obsidian, GitHub et Codex forment ensuite une architecture compréhensible. Northstar TEN sert de cas réel lisible ; le cycle SPEC → issue → code → tests → PR → staging montre les preuves. Spec Driven et POC Driven expliquent comment choisir le bon niveau d’investissement. Enfin, l’écosystème Hocus et le conseil augmenté élargissent la perspective.

**Atterrissage final :**

> Le sujet n’est pas de remplacer le jugement humain. Le sujet est de déplacer le travail humain vers le cadrage, le discernement et les décisions qui comptent.

## Progression pédagogique

| Étape | Question du public | Réponse du deck | Preuve / forme |
| --- | --- | --- | --- |
| 1. Comprendre | « De quoi parle-t-on ? » | IA générative et LLM en langage simple | schémas de flux |
| 2. Essayer | « Que puis-je faire demain ? » | boucle du rendez-vous client | mini-démo |
| 3. Combiner | « Que changent les outils ? » | agent, tools, mémoire | boucle + cartes |
| 4. Automatiser | « Comment éviter le bricolage ? » | workflow, preuves et gates | timeline |
| 5. Construire | « Comment arriver à un outil ? » | cas Northstar TEN, POC / spec | cycle réel + simulation |

## Rythme oral recommandé

- **Slides 1–3 :** 4 minutes — accroche et contrat de lecture.
- **Slides 4–8 :** 10 minutes — concepts et première boucle.
- **Slides 9–15 :** 14 minutes — agent, outils et mémoire.
- **Slides 16–20 :** 12 minutes — workflow Hocus et exemple produit.
- **Slides 21–24 :** 8 minutes — méthodes de construction et conseil.
- **Slides 25–26 :** 7–12 minutes — scénario et conclusion.

## Règles de narration

- Montrer un exemple avant de donner sa définition quand le concept est abstrait.
- Ne pas faire entrer Hocus avant que le public ait compris agent, outil et mémoire.
- Ne pas confondre « capable de produire » et « autorisé à décider ».
- Réserver les détails de Git, de gouvernance et d’architecture aux captures et aux notes orateur.
- Garder la phrase métier en haut des slides 3, 19, 20 et 25 pour maintenir le fil rouge.
- Faire apparaître les limites au moment où la capacité correspondante est introduite.

## Architecture réutilisable pour la webapp

Chaque séquence peut devenir une scène interactive autonome :

```text
Scene
├── concept_id
├── prerequisite_ids
├── one_sentence_message
├── visual_atoms
├── evidence_refs
├── demo_mode
├── interaction_candidate
└── speaker_notes
```

Le deck reste linéaire et lisible ; la webapp pourra ensuite permettre d’explorer les scènes dans plusieurs directions sans modifier les faits ni les preuves.
