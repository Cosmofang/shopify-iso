#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SOURCE =
  'https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md';
const EXPECTED_SHA256 =
  '22fb100f84772089b484d47a22c511fdbb6fa13c4dc277833646f67f8f253b77';
const EXPECTED_REASON_COUNTS = new Map([
  ['4.1.1', 11],
  ['4.1.2', 3],
  ['4.1.3', 1],
  ['4.1.4', 4],
  ['4.1.5', 2],
  ['4.1.6', 2],
  ['4.2.1', 2],
  ['4.2.2', 6],
  ['4.2.3', 3],
  ['4.2.4', 5],
  ['4.2.5', 2],
  ['4.2.6', 2],
  ['4.3.1', 2],
  ['4.3.2', 2],
  ['4.3.3', 4],
  ['4.3.4', 3],
  ['4.3.5', 2],
  ['4.3.6', 2],
  ['4.3.7', 5],
]);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MATRIX = join(
  ROOT,
  '00-built-for-shopify',
  'official-requirements-matrix.md',
);
const FULL = join(
  ROOT,
  '00-built-for-shopify',
  'official-requirements-full.md',
);
const localOnly = process.argv.slice(2).includes('--local-only');
const unknownArguments = process.argv
  .slice(2)
  .filter((argument) => argument !== '--local-only');

if (unknownArguments.length) {
  throw new Error(`Unknown argument(s): ${unknownArguments.join(', ')}`);
}

function normalize(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\\`*_~]/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function sections(markdown) {
  const headings = [...markdown.matchAll(/^#{1,4}\s+(.+)$/gm)];
  const result = new Map();

  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index][1].trim().match(/^(\d+\.\d+\.\d+)\s+(.+)$/);
    if (!match) continue;
    const start = headings[index].index + headings[index][0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    result.set(match[1], {
      title: match[2].trim(),
      body: markdown.slice(start, end),
    });
  }

  return result;
}

function localRequirementBody(section) {
  return normalize(
    section.body
      .split('\n')
      .filter((line) => line.startsWith('>'))
      .map((line) => line.replace(/^>\s?/, '').trim())
      .filter(
        (line) =>
          line && !line.includes('官方示意图') && !line.startsWith('⚠️'),
      )
      .join(' '),
  );
}

function localRejectionReasons(section) {
  const marker = section.body.indexOf('**拒审理由');
  if (marker === -1) return [];
  const afterMarker = section.body.slice(marker);
  const end = afterMarker.indexOf('**中文要点**');
  const reasonBlock = end === -1 ? afterMarker : afterMarker.slice(0, end);
  return [...reasonBlock.matchAll(/^\d+\.\s+(.+)$/gm)].map(([, reason]) =>
    normalize(reason),
  );
}

function officialRequirementBody(section) {
  const marker = section.body.indexOf('Show reasons for rejection');
  return normalize(marker === -1 ? section.body : section.body.slice(0, marker));
}

function officialRejectionReasons(section) {
  const marker = section.body.indexOf('Show reasons for rejection');
  if (marker === -1) return [];
  return [...section.body.slice(marker).matchAll(/^\d+\.\s+(.+)$/gm)].map(
    ([, reason]) => normalize(reason),
  );
}

async function fetchSource() {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(SOURCE);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error('Unable to fetch BFS requirements after 3 attempts', {
    cause: lastError,
  });
}

const matrixMarkdown = readFileSync(MATRIX, 'utf8');
const fullMarkdown = readFileSync(FULL, 'utf8');
const matrix = new Map(
  [...matrixMarkdown.matchAll(
    /^\|\s*`(\d+\.\d+\.\d+)`\s*\|\s*([^|]+?)\s*\|/gm,
  )].map(([, id, title]) => [id, title.trim()]),
);
const localSections = sections(fullMarkdown);
const localFailures = [];

if (matrix.size !== 77) {
  localFailures.push(`Local matrix requirement count: ${matrix.size}/77`);
}
if (localSections.size !== 77) {
  localFailures.push(`Local full requirement count: ${localSections.size}/77`);
}

for (const [id, title] of matrix) {
  const localSection = localSections.get(id);
  if (!localSection) {
    localFailures.push(`Missing from full snapshot: ${id}`);
    continue;
  }
  if (localSection.title !== title) {
    localFailures.push(
      `Local title mismatch for ${id}: matrix="${title}" full="${localSection.title}"`,
    );
  }
  if (!localRequirementBody(localSection)) {
    localFailures.push(`Missing official English body in full snapshot: ${id}`);
  }
}

let localReasonTotal = 0;
for (const [id, expected] of EXPECTED_REASON_COUNTS) {
  const actual = localRejectionReasons(localSections.get(id) ?? {body: ''}).length;
  localReasonTotal += actual;
  if (actual !== expected) {
    localFailures.push(`Local rejection reasons for ${id}: ${actual}/${expected}`);
  }
}

console.log(`Local matrix requirement IDs: ${matrix.size}/77`);
console.log(`Local full requirement bodies: ${localSections.size}/77`);
console.log(`Local design rejection reasons: ${localReasonTotal}/63`);

if (localFailures.length) {
  console.error(localFailures.join('\n'));
  process.exit(1);
}

if (localOnly) {
  console.log(
    'Local BFS matrix, full requirement bodies, and rejection-reason structure are aligned. Remote source was not checked.',
  );
  process.exit(0);
}

const officialMarkdown = await fetchSource();
const officialSections = sections(officialMarkdown);
const sourceSha256 = createHash('sha256')
  .update(officialMarkdown)
  .digest('hex');
const remoteFailures = [];
let officialReasonTotal = 0;

if (officialSections.size !== 77) {
  remoteFailures.push(`Official BFS requirement count: ${officialSections.size}/77`);
}

for (const [id, localSection] of localSections) {
  const officialSection = officialSections.get(id);
  if (!officialSection) {
    remoteFailures.push(`Missing from official source: ${id}`);
    continue;
  }
  if (officialSection.title !== localSection.title) {
    remoteFailures.push(
      `Official title changed for ${id}: local="${localSection.title}" official="${officialSection.title}"`,
    );
  }

  const localBody = localRequirementBody(localSection);
  const officialBody = officialRequirementBody(officialSection);
  if (officialBody !== localBody) {
    remoteFailures.push(`Official body differs for ${id}`);
  }

  const localReasons = localRejectionReasons(localSection);
  const officialReasons = officialRejectionReasons(officialSection);
  officialReasonTotal += officialReasons.length;
  if (officialReasons.length !== localReasons.length) {
    remoteFailures.push(
      `Official rejection reason count for ${id}: local=${localReasons.length} official=${officialReasons.length}`,
    );
  }
  for (let index = 0; index < Math.max(localReasons.length, officialReasons.length); index += 1) {
    if (officialReasons[index] !== localReasons[index]) {
      remoteFailures.push(
        `Official rejection reason differs for ${id} item ${index + 1}: local="${localReasons[index] ?? ''}" official="${officialReasons[index] ?? ''}"`,
      );
    }
  }
}

if (officialReasonTotal !== 63) {
  remoteFailures.push(`Official design rejection reasons: ${officialReasonTotal}/63`);
}

if (sourceSha256 !== EXPECTED_SHA256) {
  remoteFailures.push(
    `Official content changed: expected ${EXPECTED_SHA256}, received ${sourceSha256}`,
  );
}

console.log(`Official BFS leaf requirements: ${officialSections.size}`);
console.log(`Official design rejection reasons: ${officialReasonTotal}/63`);
console.log(`Official source SHA-256: ${sourceSha256}`);

if (remoteFailures.length) {
  console.error(remoteFailures.join('\n'));
  console.error(
    'Review the full official diff and BFS changelog before updating the snapshot, matrix, ISO details, and expected fingerprint.',
  );
  process.exit(1);
}

console.log(
  'Official source fingerprint, local matrix, 77 requirement bodies, and 63 rejection reasons are aligned.',
);
