#!/usr/bin/env node

import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const markdownFiles = [];

function collectMarkdown(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) collectMarkdown(fullPath);
    else if (entry.name.endsWith('.md')) markdownFiles.push(fullPath);
  }
}

collectMarkdown(ROOT);

const failures = [];
const markdownLink = /\[[^\]]*\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(markdownLink)) {
    let target = match[1].trim().replace(/^<|>$/g, '');
    if (!target || /^(https?:|mailto:|#)/.test(target)) continue;

    target = decodeURIComponent(target.split('#')[0]);
    if (!existsSync(resolve(dirname(file), target))) {
      failures.push(`${relative(ROOT, file)} -> ${target}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Local Markdown links OK: ${markdownFiles.length} files checked.`);
