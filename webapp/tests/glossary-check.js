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
  if (term.seo_title) assert.ok(term.seo_title.length <= 60, `${term.slug}: seo_title trop long (${term.seo_title.length})`);
  if (term.seo_description) assert.ok(term.seo_description.length <= 160, `${term.slug}: seo_description trop longue (${term.seo_description.length})`);
  for (const section of term.sections || []) assert.ok(section.title && ((section.paragraphs || []).length || (section.items || []).length), `${term.slug}: section vide`);
  for (const item of term.faq || []) assert.ok(item.question && item.answer, `${term.slug}: FAQ incomplète`);
  for (const [field, list] of Object.entries(term.maps || {})) {
    if (field === 'human_gate') { assert.equal(typeof list, 'boolean', `${term.slug}: human_gate booléen`); continue; }
    assert.ok(known[field], `${term.slug}: champ de correspondance inconnu ${field}`);
    for (const value of list) assert.ok(known[field].has(value), `${term.slug}: ${field} = ${value} inconnu`);
  }
}
for (const term of glossary.terms) for (const slug of term.related) assert.ok(slugs.has(slug), `${term.slug}: terme lié inconnu ${slug}`);

console.log(`Glossaire : ${glossary.terms.length} termes, correspondances et liens valides.`);
