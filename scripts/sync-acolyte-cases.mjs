#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] || process.env.ACOLYTE_CASE_DATA_SOURCE || resolve(repoRoot, '../server-playbook/data/acolyte-cases-v1.json'));
const target = resolve(repoRoot, 'webapp/explore/data/cases-v1.json');
const manifestTarget = resolve(repoRoot, 'webapp/explore/data/manifest.json');

const raw = await readFile(source, 'utf8');
const cases = JSON.parse(raw);
if (!Array.isArray(cases) || cases.length === 0) throw new Error('The canonical case dataset must be a non-empty JSON array.');
if (cases.some((item) => !item.id || !item.title || !item.evidence_level)) throw new Error('Every case must expose id, title and evidence_level.');

const normalized = `${JSON.stringify(cases, null, 2)}\n`;
const sourceSha256 = createHash('sha256').update(raw).digest('hex');
await mkdir(dirname(target), { recursive: true });
await writeFile(target, normalized);
await writeFile(manifestTarget, `${JSON.stringify({
  source_repo: 'baptistepigaux-27/server-playbook',
  source_file: 'data/acolyte-cases-v1.json',
  source_revision: process.env.ACOLYTE_CASE_SOURCE_REVISION || 'external-source',
  source_sha256: sourceSha256,
  record_count: cases.length,
  generated_file: 'webapp/explore/data/cases-v1.json'
}, null, 2)}\n`);

console.log(`Synced ${cases.length} cases from ${source}`);
