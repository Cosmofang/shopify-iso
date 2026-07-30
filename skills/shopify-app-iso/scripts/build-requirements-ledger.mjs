#!/usr/bin/env node

import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const ledgerScript = join(
  scriptDirectory,
  '..',
  '..',
  '..',
  'scripts',
  'build-requirements-ledger.mjs',
);

if (!existsSync(ledgerScript)) {
  throw new Error(
    'Shopify ISO ledger generator not found. Run this skill from its source repository or set up the complete Shopify ISO first.',
  );
}

await import(pathToFileURL(ledgerScript).href);
