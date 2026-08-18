#!/usr/bin/env node

import {createHash} from 'node:crypto';

const BASE = 'https://shopify.dev/docs/';
const SOURCES = new Map([
  ['apps/design', '791141f2b599e7026490c8f1ab3197237013f7e6f4b4970722b8077404a05192'],
  ['apps/design/app-structure', '1f5ae93aa7e37458daa96ed109f55b89da0790c0457513cb349aa08dd51c15c3'],
  ['apps/design/layout', '962e776c16e13c029dcde53803069b20105bc1ffc98bb6eefeeac73ef7228b32'],
  ['apps/design/visual-design', 'e7dfcf51954d20454532198eba5acdfd7830aad1e22736d4b5f23956e8284775'],
  ['apps/design/navigation', 'f5168e2987add650c9095701709fc89b87f898a6cc0af167360ac8314535a2f7'],
  ['apps/design/content', '763fd77f5b57c1fc6e267f63faa0c2d2f7c444e893f7d77ea04f15152e529cc3'],
  ['apps/design/user-experience/app-home-page', 'cfbb6a13952e7e7f76b4c4c19c0c1eee9d80073b7bba67338f6f50fe216d2241'],
  ['apps/design/user-experience/onboarding', '8a7682393e81c66c5ec3e4109ad77ece50bdbc5bf587f6f4582a7e11a28d3c53'],
  ['apps/design/user-experience/marketing', 'ca50510a8fb84fd2000def9ea1820050d149ab529fc08f7cdfeff0686030be7f'],
  ['apps/design/user-experience/forms', '0efaf258f06f1dcc01dac80fb592ee5676427888a4076a50c9c493f0f7440afb'],
  ['apps/design/user-experience/alerts', 'cb3b80a10790890fb6dd947bf1a506612d7a58add8642733dc731ab0eafe78ba'],
]);

function normalize(markdown) {
  return `${markdown
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '![$1]')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

async function fetchSource(path) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${BASE}${path}.md`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Unable to fetch ${path} after 3 attempts`, {
    cause: lastError,
  });
}

const failures = [];

for (const [path, expected] of SOURCES) {
  const source = await fetchSource(path);
  const actual = createHash('sha256')
    .update(normalize(source))
    .digest('hex');
  console.log(`${path}: ${actual}`);

  if (actual !== expected) {
    failures.push(`${path}: expected ${expected}, received ${actual}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(
    'Official App Design Guidelines changed. Review every changed page and its linked current APIs, update the ISO, then accept new fingerprints.',
  );
  process.exit(1);
}

console.log(`All ${SOURCES.size} reviewed App Design Guidelines pages are unchanged.`);
