#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {basename, join, relative, resolve, sep} from 'node:path';

function parseArguments(argv) {
  const options = {
    sourceRoot: '',
    output: '',
    commit: '',
    archiveSha256: '',
    capturedAt: new Date().toISOString().slice(0, 10),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value || !key.startsWith('--')) {
      throw new Error(`Unknown or incomplete argument: ${key}`);
    }

    const optionName = key
      .slice(2)
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (!(optionName in options)) throw new Error(`Unknown argument: ${key}`);
    options[optionName] = value;
    index += 1;
  }

  if (!options.sourceRoot) throw new Error('--source-root is required');
  if (!options.output) throw new Error('--output is required');
  if (!options.commit) throw new Error('--commit is required');
  if (!/^[a-f0-9]{40}$/.test(options.commit)) {
    throw new Error('--commit must be a full 40-character Git commit');
  }
  if (options.archiveSha256 && !/^[a-f0-9]{64}$/.test(options.archiveSha256)) {
    throw new Error('--archive-sha256 must be a SHA-256 digest');
  }

  return options;
}

function walk(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function toPosix(path) {
  return path.split(sep).join('/');
}

function routeFor(path) {
  let route = `/${path.replace(/\.mdx$/, '')}`;
  route = route.replace(/\/variants\/(default|overview)$/, '');
  route = route.replace(/\/variants\//, '/');
  route = route.replace(/\/index$/, '');
  return route || '/';
}

function classify(path) {
  if (path.includes('/internal-only/')) return 'react-internal-only';
  if (path.includes('/deprecated/')) return 'react-deprecated';
  if (path.startsWith('components/')) return 'react-component-reference';
  if (path.startsWith('patterns-legacy/')) return 'legacy-pattern';
  if (path.startsWith('patterns/')) return 'historical-pattern';
  if (path.startsWith('previous-releases/')) return 'historical-release';
  if (path.startsWith('version-guides/')) return 'legacy-migration';
  if (path.startsWith('tokens/')) return 'legacy-token-snapshot';
  if (path.startsWith('tools/stylelint-polaris/')) return 'legacy-tooling';
  if (path.startsWith('tools/')) return 'legacy-tooling';
  if (path.startsWith('contributing/')) return 'repository-governance';
  if (path.startsWith('getting-started/')) return 'historical-onboarding';
  if (path === 'icons.mdx') return 'legacy-icon-catalog';
  if (
    path.startsWith('foundations/') ||
    path.startsWith('design/') ||
    path.startsWith('content/')
  ) {
    return 'principle-review';
  }
  return 'source-support';
}

function handbookTarget(path) {
  if (path.startsWith('getting-started/')) return '01-status-and-source-priority.md';
  if (path.startsWith('foundations/')) return '02-foundations-and-design.md';
  if (path.startsWith('design/')) return '02-foundations-and-design.md';
  if (path.startsWith('content/')) return '03-content-guidelines.md';
  if (path.startsWith('patterns')) return '04-patterns.md';
  if (path.startsWith('components/actions/')) return 'components/actions-layout.md';
  if (path.startsWith('components/layout-and-structure/')) {
    return 'components/actions-layout.md';
  }
  if (
    path.startsWith('components/selection-and-input/') ||
    path.startsWith('components/lists/') ||
    path.startsWith('components/tables/')
  ) {
    return 'components/input-data.md';
  }
  if (
    path.startsWith('components/deprecated/') ||
    path.startsWith('components/internal-only/')
  ) {
    return 'components/deprecated-internal.md';
  }
  if (path.startsWith('components/')) return 'components/feedback-navigation.md';
  if (path.startsWith('tokens/') || path === 'icons.mdx' || path.startsWith('tools/')) {
    return '06-tokens-icons-tools.md';
  }
  if (
    path.startsWith('previous-releases/') ||
    path.startsWith('version-guides/')
  ) {
    return '07-legacy-react-maintenance.md';
  }
  if (path.startsWith('contributing/')) return '09-source-governance.md';
  return '09-source-governance.md';
}

const options = parseArguments(process.argv.slice(2));
const repositoryRoot = resolve(options.sourceRoot);
const contentRoot = join(repositoryRoot, 'polaris.shopify.com', 'content');
const files = walk(contentRoot)
  .filter((path) => path.endsWith('.mdx') || path.endsWith('.template'))
  .sort();

const entries = files.map((file) => {
  const contents = readFileSync(file);
  const path = toPosix(relative(contentRoot, file));
  return {
    path,
    route: routeFor(path),
    status: classify(path),
    handbookTarget: handbookTarget(path),
    bytes: statSync(file).size,
    sha256: createHash('sha256').update(contents).digest('hex'),
  };
});

const bySection = {};
const byStatus = {};
for (const entry of entries) {
  const section = entry.path.split('/')[0].replace(/\.mdx$/, '');
  bySection[section] = (bySection[section] ?? 0) + 1;
  byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
}

const manifest = {
  schemaVersion: 1,
  source: {
    repository: 'https://github.com/Shopify/polaris-react',
    branch: 'main',
    commit: options.commit,
    archivedAt: '2026-01-06',
    capturedAt: options.capturedAt,
    archiveSha256: options.archiveSha256 || null,
  },
  counts: {
    files: entries.length,
    bySection,
    byStatus,
  },
  entries,
};

writeFileSync(resolve(options.output), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Generated ${entries.length} Polaris React source entries in ${basename(options.output)}.`,
);
