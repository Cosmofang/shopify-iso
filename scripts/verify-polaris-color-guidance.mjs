#!/usr/bin/env node

import {createHash} from 'node:crypto';

const BASE =
  'https://raw.githubusercontent.com/Shopify/polaris-react/main/polaris.shopify.com/content/design/colors/';

// This archived source preserves design logic. Current Web Components and BFS
// requirements still take precedence when guidance conflicts.
const SOURCES = new Map([
  ['index.mdx', '42c2888955002163ca49c6a99feba11df082c97784dee76a71f1b41ac3e51902'],
  ['palettes-and-roles.mdx', '82915cc93c4f6970bd241f31f2674720f0d495a2892e5623d606a543e84e5ae8'],
  ['using-color.mdx', 'd6e56233aa9807c2d92741cbf6e74f326568e53dbc98af56c0c61ea1d1f3e368'],
  ['color-tokens.mdx', 'b00ca042cb1f72da9ad48d0d9574627a64de8f6d2e864925e1fa4674b85307fd'],
]);

let changed = false;

async function fetchSource(file) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${BASE}${file}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Unable to fetch ${file} after 3 attempts`, {
    cause: lastError,
  });
}

for (const [file, expected] of SOURCES) {
  const source = await fetchSource(file);
  const actual = createHash('sha256').update(source).digest('hex');
  console.log(`${file}: ${actual}`);

  if (actual !== expected) {
    changed = true;
    console.error(`${file} changed: expected ${expected}, received ${actual}`);
  }
}

if (changed) {
  console.error(
    'Review all changed MDX content, update 01-foundations/color.md, then accept the new fingerprints.',
  );
  process.exit(1);
}

console.log('All four reviewed Polaris color guidance sources are unchanged.');
