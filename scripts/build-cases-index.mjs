#!/usr/bin/env node
/* Index léger du catalogue (webapp/explore/data/cases-index.json) : ce qu'il faut pour
   lister, filtrer et placer un cas (accueil, ciel des cas), sans le détail des fiches.
   À relancer après chaque synchronisation de cases-v1.json. */
import { readFile, writeFile } from 'node:fs/promises';
const clip = (t, n) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length <= n ? t : `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…`; };
const cases = JSON.parse(await readFile('webapp/explore/data/cases-v1.json', 'utf8'));
const index = cases.map((c) => ({
  id: c.id, slug: c.slug || c.id, title: c.title, short: clip(c.short_description || c.problem, 150),
  evidence: c.evidence_level, solution: c.solution_type, autonomy: c.autonomy_level,
  functions: [].concat(c.business_function || []), industry: c.industry, sizes: [].concat(c.company_size || []),
}));
await writeFile('webapp/explore/data/cases-index.json', JSON.stringify(index));
console.log(`cases-index.json : ${index.length} cas`);
