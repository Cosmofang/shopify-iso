#!/usr/bin/env node

import {existsSync, realpathSync} from 'node:fs';
import {dirname, join, parse, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const MARKERS = [
  'START-HERE.md',
  join('00-built-for-shopify', 'official-requirements-matrix.md'),
  join('05-engineering', 'README.md'),
];

function isIsoRoot(directory) {
  return MARKERS.every((marker) => existsSync(join(directory, marker)));
}

function ancestors(start) {
  const directories = [];
  let current = resolve(start);
  const root = parse(current).root;

  while (true) {
    directories.push(current);
    if (current === root) return directories;
    current = dirname(current);
  }
}

const scriptDirectory = dirname(realpathSync(fileURLToPath(import.meta.url)));
const starts = [process.env.SHOPIFY_ISO_ROOT, process.cwd(), scriptDirectory].filter(
  Boolean,
);
const candidates = [...new Set(starts.flatMap(ancestors))];
const isoRoot = candidates.find(isIsoRoot);

if (!isoRoot) {
  console.error(
    'Shopify ISO root not found. Set SHOPIFY_ISO_ROOT to the cloned shopify-iso repository.',
  );
  process.exit(1);
}

console.log(realpathSync(isoRoot));
