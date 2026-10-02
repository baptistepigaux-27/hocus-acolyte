#!/usr/bin/env node
/* Contrôle du glossaire (explore/data/glossary-v1.json) : slugs uniques, termes liés existants,
   correspondances valides avec les taxonomies des cas et le référentiel des outils, descriptions courtes. */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const data = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'explore', 'data', file), 'utf8'));
const glossary = data('glossary-v1.json');
const cases = data('cases-v1.json');
const tools = data('tools-v1.json');

const values = (field) => new Set(cases.flatMap((item) => [].concat(item[field] ?? [])));
const known = {
  ai_pattern: values('ai_pattern'),
  solution_type: values('solution_type'),
  autonomy_level: values('autonomy_level'),
  tool_family: new Set(tools.map((tool) => tool.family)),
  tool_ids: new Set(tools.map((tool) => tool.id)),
  license: new Set(tools.map((tool) => tool.license)),
  case_ids: new Set(cases.map((item) => item.id)),
};

const slugs = new Set();
for (const term of glossary.terms) {
  assert.match(term.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${term.slug}: slug`);
  assert.ok(!slugs.has(term.slug), `${term.slug}: slug en double`);
  slugs.add(term.slug);
  assert.ok(glossary.groups[term.group], `${term.slug}: groupe inconnu ${term.group}`);
  assert.ok(term.short && term.short.length <= 200, `${term.slug}: description courte absente ou trop longue (${term.short?.length})`);
  assert.ok(Array.isArray(term.definition) && term.definition.length >= 1, `${term.slug}: définition`);
  for (const [field, list] of Object.entries(term.maps || {})) {
    if (field === 'human_gate') { assert.equal(typeof list, 'boolean', `${term.slug}: human_gate booléen`); continue; }
    assert.ok(known[field], `${term.slug}: champ de correspondance inconnu ${field}`);
    for (const value of list) assert.ok(known[field].has(value), `${term.slug}: ${field} = ${value} inconnu`);
  }
}
for (const term of glossary.terms) for (const slug of term.related) assert.ok(slugs.has(slug), `${term.slug}: terme lié inconnu ${slug}`);

console.log(`Glossaire : ${glossary.terms.length} termes, correspondances et liens valides.`);
