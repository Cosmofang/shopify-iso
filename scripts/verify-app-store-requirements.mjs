#!/usr/bin/env node

import {createHash} from 'node:crypto';

const SOURCE =
  'https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements.md';
const EXPECTED_SHA256 =
  '52dc6cb5f377a919077c58c6032a55fd2c86d14e898603efae8228d8230052d2';
const EXPECTED_COUNTS = new Map([
  ['1', 20],
  ['2', 17],
  ['3', 6],
  ['4', 24],
  ['5', 107],
]);

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

  throw new Error('Unable to fetch App Store requirements after 3 attempts', {
    cause: lastError,
  });
}

const source = await fetchSource();
const requirements = [
  ...source.matchAll(/^([1-5])\.\d+\.\d+\*\*([^*]+)\*\*/gm),
].map(([, section, title]) => ({section, title: title.trim()}));
const counts = new Map();

for (const {section} of requirements) {
  counts.set(section, (counts.get(section) ?? 0) + 1);
}

const sourceSha256 = createHash('sha256').update(source).digest('hex');
let failed = sourceSha256 !== EXPECTED_SHA256;

console.log(`Official App Store leaf requirements: ${requirements.length}`);
for (const [section, expected] of EXPECTED_COUNTS) {
  const actual = counts.get(section) ?? 0;
  console.log(`Section ${section}: ${actual}/${expected}`);
  if (actual !== expected) failed = true;
}
console.log(`Official source SHA-256: ${sourceSha256}`);

if (requirements.length !== 174) failed = true;

if (failed) {
  console.error(
    'App Store requirements changed. Review the full source and linked pages, then update the ISO, counts, and fingerprint.',
  );
  process.exit(1);
}

console.log('App Store requirement counts and source fingerprint are aligned.');
