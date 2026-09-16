#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };

vm.runInNewContext(fs.readFileSync(path.join(root, 'content/slides.js'), 'utf8'), context, { filename: 'content/slides.js' });
for (const relativePath of [
  'journeys/pme-overview/solutions.js',
  'journeys/pme-overview/opportunities.js'
]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), context, { filename: relativePath });
}

const solutions = context.window.ACOLYTE_PME_SOLUTIONS;
const opportunities = context.window.ACOLYTE_PME_OPPORTUNITIES;
const solutionKeys = new Set(solutions.map((solution) => solution.key));
const functionKeys = new Set(opportunities.map((opportunity) => opportunity.function));
const levelKeys = ['individual', 'knowledge', 'process', 'agent', 'product'];
const requiredFields = [
  'id', 'function', 'level', 'label', 'need', 'inputs', 'capabilities',
  'solutionType', 'solutionCategory', 'implementation', 'tools', 'customWhen',
  'successConditions', 'valueSignals', 'feasibilitySignals', 'risks'
];

assert.equal(solutions.length, 5);
assert.equal(context.window.ACOLYTE_SLIDES.length, 23);
assert.equal(opportunities.length, 41);
assert.equal(functionKeys.size, 8);
assert.equal(new Set(opportunities.map((opportunity) => opportunity.id)).size, opportunities.length);

for (const opportunity of opportunities) {
  for (const field of requiredFields) assert.ok(opportunity[field], `${opportunity.id}: missing ${field}`);
  assert.ok(levelKeys.includes(opportunity.level), `${opportunity.id}: unknown level`);
  assert.ok(solutionKeys.has(opportunity.solutionCategory), `${opportunity.id}: unknown solution category`);
  assert.ok(['BUY', 'CONFIGURE', 'BUILD'].includes(opportunity.implementation), `${opportunity.id}: invalid implementation mode`);
}

for (const functionKey of functionKeys) {
  for (const levelKey of levelKeys) {
    assert.ok(opportunities.some((opportunity) => opportunity.function === functionKey && opportunity.level === levelKey), `${functionKey}/${levelKey}: no opportunity`);
  }
}

console.log(`PME data checks passed (${opportunities.length} opportunities, ${solutions.length} solution families).`);
