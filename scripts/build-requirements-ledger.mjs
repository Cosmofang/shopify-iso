#!/usr/bin/env node

import {createHash} from 'node:crypto';

const APP_STORE_SOURCE =
  'https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements.md';
const BFS_SOURCE =
  'https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md';
const APP_STORE_CATEGORIES = new Set(
  Array.from({length: 11}, (_, index) => `5.${index + 1}`),
);
const BFS_CATEGORIES = new Set(
  Array.from({length: 14}, (_, index) => `5.${index + 1}`),
);

function parseCategoryList(value) {
  return [...new Set((value ?? '').split(',').map((item) => item.trim()).filter(Boolean))];
}

function parseArguments(argv) {
  const options = {
    appStoreCategories: [],
    bfsCategories: [],
    allCategories: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--all-categories') {
      options.allCategories = true;
    } else if (argument === '--app-store-categories') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--app-store-categories requires a comma-separated value');
      }
      options.appStoreCategories = parseCategoryList(value);
      index += 1;
    } else if (argument === '--bfs-categories') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--bfs-categories requires a comma-separated value');
      }
      options.bfsCategories = parseCategoryList(value);
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
  }

  for (const category of options.appStoreCategories) {
    if (!APP_STORE_CATEGORIES.has(category)) {
      throw new Error(`Invalid App Store category: ${category}`);
    }
  }
  for (const category of options.bfsCategories) {
    if (!BFS_CATEGORIES.has(category)) {
      throw new Error(`Invalid BFS category: ${category}`);
    }
  }

  if (
    options.allCategories &&
    (options.appStoreCategories.length || options.bfsCategories.length)
  ) {
    throw new Error(
      '--all-categories cannot be combined with category selection arguments',
    );
  }

  return options;
}

async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Unable to fetch ${url}`, {cause: lastError});
}

function includeRequirement(id, categories, allCategories) {
  if (!id.startsWith('5.')) return true;
  return allCategories || categories.some((category) => id.startsWith(`${category}.`));
}

function escapeCell(value) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function applicability(id, categories, allCategories) {
  if (!id.startsWith('5.')) return 'core requirement; confirm distribution/applicability';
  if (allCategories) return 'ISO maintenance: all categories selected';
  const category = categories.find((prefix) => id.startsWith(`${prefix}.`));
  return `selected category ${category}`;
}

const options = parseArguments(process.argv.slice(2));
const [appStoreMarkdown, bfsMarkdown] = await Promise.all([
  fetchWithRetry(APP_STORE_SOURCE),
  fetchWithRetry(BFS_SOURCE),
]);

const appStoreRequirements = [
  ...appStoreMarkdown.matchAll(/^(\d+\.\d+\.\d+)\*\*([^*]+)\*\*/gm),
].map(([, id, title]) => ({source: 'App Store', id, title: title.trim()}));
const bfsRequirements = [
  ...bfsMarkdown.matchAll(/^####\s+(\d+\.\d+\.\d+)\s+(.+)$/gm),
].map(([, id, title]) => ({source: 'BFS', id, title: title.trim()}));

if (appStoreRequirements.length !== 174 || bfsRequirements.length !== 77) {
  throw new Error(
    `Unexpected source counts: App Store ${appStoreRequirements.length}, BFS ${bfsRequirements.length}`,
  );
}

const selected = [
  ...appStoreRequirements
    .filter(({id}) =>
      includeRequirement(id, options.appStoreCategories, options.allCategories),
    )
    .map((requirement) => ({
      ...requirement,
      applicability: applicability(
        requirement.id,
        options.appStoreCategories,
        options.allCategories,
      ),
    })),
  ...bfsRequirements
    .filter(({id}) =>
      includeRequirement(id, options.bfsCategories, options.allCategories),
    )
    .map((requirement) => ({
      ...requirement,
      applicability: applicability(
        requirement.id,
        options.bfsCategories,
        options.allCategories,
      ),
    })),
];

const sourceHash = (value) => createHash('sha256').update(value).digest('hex');
const selectedLabel = (categories) => categories.join(', ') || 'none (record reason)';

console.log('# Shopify App compliance ledger\n');
console.log('- App: [required]');
console.log('- Distribution: [public/custom and submission target]');
console.log('- Owner: [required]');
console.log(`- Generated: ${new Date().toISOString()}`);
console.log(`- App Store source SHA-256: ${sourceHash(appStoreMarkdown)}`);
console.log(`- BFS source SHA-256: ${sourceHash(bfsMarkdown)}`);
console.log(
  `- App Store Section 5: ${options.allCategories ? 'all (ISO maintenance)' : selectedLabel(options.appStoreCategories)}`,
);
console.log(
  `- BFS Section 5: ${options.allCategories ? 'all (ISO maintenance)' : selectedLabel(options.bfsCategories)}\n`,
);
console.log(
  '| Source | ID | Requirement | Applicability/reason | Work item | Evidence | Status |',
);
console.log('|---|---|---|---|---|---|---|');
for (const requirement of selected) {
  console.log(
    `| ${requirement.source} | ${requirement.id} | ${escapeCell(requirement.title)} | ${requirement.applicability} | | | pending |`,
  );
}

console.error(`Generated ${selected.length} requirement rows.`);
