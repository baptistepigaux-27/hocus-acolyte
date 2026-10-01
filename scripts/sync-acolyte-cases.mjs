#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] || process.env.ACOLYTE_CASE_DATA_SOURCE || resolve(repoRoot, '../server-playbook/data/acolyte-cases-v1.json'));
const target = resolve(repoRoot, 'webapp/explore/data/cases-v1.json');
const manifestTarget = resolve(repoRoot, 'webapp/explore/data/manifest.json');
/* Référentiel des outils (server-playbook data/acolyte-tools-v1.json), à côté du corpus de cas. */
const toolsSource = resolve(process.argv[3] || process.env.ACOLYTE_TOOL_DATA_SOURCE || resolve(dirname(source), 'acolyte-tools-v1.json'));
const toolsTarget = resolve(repoRoot, 'webapp/explore/data/tools-v1.json');

const raw = await readFile(source, 'utf8');
const cases = JSON.parse(raw);
if (!Array.isArray(cases) || cases.length === 0) throw new Error('The canonical case dataset must be a non-empty JSON array.');
if (cases.some((item) => !item.id || !item.title || !item.evidence_level)) throw new Error('Every case must expose id, title and evidence_level.');

const toolsRaw = await readFile(toolsSource, 'utf8');
const tools = JSON.parse(toolsRaw);
if (!Array.isArray(tools) || tools.some((tool) => !tool.id || !tool.name || !tool.family)) throw new Error('The tool referential must be a JSON array of tools with id, name and family.');
const toolIds = new Set(tools.map((tool) => tool.id));
const dangling = cases.flatMap((item) => (item.tool_ids || []).filter((id) => !toolIds.has(id)));
if (dangling.length) throw new Error(`Cases reference unknown tools: ${[...new Set(dangling)].join(', ')}`);

const normalized = `${JSON.stringify(cases, null, 2)}\n`;
const sourceSha256 = createHash('sha256').update(raw).digest('hex');
await mkdir(dirname(target), { recursive: true });
await writeFile(target, normalized);
await writeFile(toolsTarget, `${JSON.stringify(tools, null, 2)}\n`);
await writeFile(manifestTarget, `${JSON.stringify({
  source_repo: 'baptistepigaux-27/server-playbook',
  source_file: 'data/acolyte-cases-v1.json',
  source_revision: process.env.ACOLYTE_CASE_SOURCE_REVISION || 'external-source',
  source_sha256: sourceSha256,
  record_count: cases.length,
  generated_file: 'webapp/explore/data/cases-v1.json',
  tools_source_file: 'data/acolyte-tools-v1.json',
  tools_sha256: createHash('sha256').update(toolsRaw).digest('hex'),
  tool_count: tools.length,
  tools_generated_file: 'webapp/explore/data/tools-v1.json'
}, null, 2)}\n`);

console.log(`Synced ${cases.length} cases and ${tools.length} tools from ${dirname(source)}`);
