# V1 review — slide-by-slide audit

## Decision legend

- **KEEP** — the slide earns its place with only minor copy or layout adjustment.
- **MERGE** — the idea is retained but combined with another slide to improve pace or avoid repetition.
- **REWRITE** — the slide has a valid job, but its framing, order or example must change materially.
- **DELETE** — the slide does not earn a separate place in a 20–24-slide oral deck.

## Audit

| Slide V1 | Decision | Reason | Destination V2 |
| ---: | :--- | :--- | :--- |
| 1 | REWRITE | The title is strong, but the opening should begin from the audience’s familiar use of ChatGPT before announcing the system thesis. | 1 |
| 2 | MERGE | The five-level ladder is useful as a map, but too early as an abstract promise; it works better as the final synthesis. | 23 |
| 3 | MERGE | The “real work, not feature catalogue” principle is essential but should become the opening tension and the recurring thread, not a standalone meta-slide. | 1–3 |
| 4 | MERGE | The generative-AI model is pedagogically sound; compress it with the simple explanation of what a model is. | 4 |
| 5 | MERGE | The LLM explanation is useful but currently follows too much definition; keep one analogy and one visual pipeline inside the first act. | 4 |
| 6 | REWRITE | Capabilities and limitations are both important, but the V1 grid is dense; start with familiar tasks and reveal limits as the price of trust. | 2–4 |
| 7 | KEEP | Prompt versus context is a core misconception to correct, and it naturally leads to the first demo. | 5 |
| 8 | MERGE | The client-meeting loop is a good universal example, but it should be the end of Act 1 / bridge to tools, not a full conceptual block. | 3 or demo 1 |
| 9 | REWRITE | The taxonomy is useful, but the five levels need to be introduced through an experience before they receive names. | 8–9 |
| 10 | REWRITE | The agent definition is correct; make the loop the visual “wow” immediately after a brutal chatbot/agent comparison. | 8–11 |
| 11 | KEEP | Tool calling is the key explanation for why the model can observe and act beyond the chat window. | 6 |
| 12 | MERGE | Five examples are too catalogue-like as a separate slide; reuse them as a single live/simulated tool menu. | 6 or demo 1 |
| 13 | REWRITE | Memory deserves a stronger human scenario: reopening a project three weeks later. | 7 |
| 14 | REWRITE | Obsidian’s role is central, but it should arrive as the concrete implementation of memory after the audience understands the problem. | 13 |
| 15 | REWRITE | GitHub’s “product memory” is a strong metaphor; remove the glossary feel and focus on traceability and review. | 14 |
| 16 | KEEP | The delivery workflow is one of the strongest real proofs and should remain prominent. | 15 |
| 17 | MERGE | The Obsidian explanation belongs with the four-role system rather than as another conceptual memory slide. | 12–13 |
| 18 | MERGE | GitHub concepts are useful only in service of the real workflow; keep them attached to issue, PR, tests and staging. | 14–15 |
| 19 | REWRITE | The workflow is the bridge to product construction; make the human gate explicit in the visual path. | 15–16 |
| 20 | REWRITE | The four roles are the core of Act 4; make the handoffs concrete and less like a role catalogue. | 12–16 |
| 21 | REWRITE | The global diagram is valuable, but V1 has too many arrows; simplify it around thinking, memory, state, execution and validation. | 16 |
| 22 | REWRITE | The Hocus roster is useful only as one specialization map after the audience understands a single agent; reduce it to responsibilities and keep the full architecture out of the deck. | 21 |
| 23 | MERGE | Ad hoc development is important for the consulting thesis, but it can be one concrete pipeline inside the augmented-consulting slide. | 22 |
| 24 | REWRITE | The classic / augmented comparison is a strong closing argument; connect it directly to the output of a mission. | 22 |
| 25 | MERGE | The live scenario is the best rehearsal of the whole system; use it as the second live demonstration or as the final case scene, not as another theory block. | 16 or 22 |
| 26 | REWRITE | The conclusion is right but should include the human gate and the concrete system roles before the final sentence. | 23 |

> The V1 source contains 26 numbered slides. The audit above maps those actual 26 headings; the brief’s later numbered sections are requirements, not additional V1 slides.

## Overall findings

1. V1 has the right concepts but introduces the abstraction ladder too early.
2. V1 repeats the same distinction across slides 9, 10, 21 and 31; V2 keeps the distinction but stages it as experience → name → system.
3. V1 has many potential demos but no single dramatic reveal; V2 assigns five explicit wow moments.
4. V1 says “Hocus appears progressively” but starts the second half with a large component map; V2 delays the map until after the real four-tool workflow is understood.
5. V1’s Northstar example risks factual drift because the local project is Northstar TEN; V2 uses the actual tender-intelligence use case and keeps Sybil for POC/value-gate learning.
6. V1 is conceptually 26 slides; V2 is reduced to **23 slides** with five acts and two principal live demonstrations.
