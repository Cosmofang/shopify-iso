#!/usr/bin/env node

const REGISTRY = 'https://registry.npmjs.org';
const TEMPLATE_PACKAGE =
  'https://raw.githubusercontent.com/Shopify/shopify-app-template-react-router/main/package.json';

const EXPECTED_NPM = new Map([
  ['@shopify/cli', {version: '4.6.1', node: '>=22.12.0'}],
  ['@shopify/shopify-app-react-router', {version: '2.0.0', node: '>=22.0.0'}],
  ['@shopify/app-bridge-react', {version: '4.2.12'}],
  ['@shopify/app-bridge-types', {version: '0.7.2'}],
  ['@shopify/polaris-types', {version: '1.0.7'}],
  ['@shopify/polaris-tokens', {version: '9.4.2'}],
  ['@shopify/polaris', {version: '13.9.5'}],
  ['@shopify/stylelint-polaris', {version: '16.0.7'}],
]);

const EXPECTED_TEMPLATE = {
  node: '>=20.19 <22 || >=22.12',
  reactRouterPackage: '^1.1.0',
  polarisTypes: '1.0.1',
};

async function fetchJson(url, label) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Unable to fetch ${label} after 3 attempts`, {
    cause: lastError,
  });
}

const failures = [];

for (const [name, expected] of EXPECTED_NPM) {
  const encoded = name.replace('/', '%2f');
  const metadata = await fetchJson(`${REGISTRY}/${encoded}/latest`, name);
  const actualNode = metadata.engines?.node;
  console.log(
    `${name}: ${metadata.version}${actualNode ? ` (Node ${actualNode})` : ''}`,
  );

  if (metadata.version !== expected.version) {
    failures.push(
      `${name}: expected ${expected.version}, received ${metadata.version}`,
    );
  }
  if (expected.node && actualNode !== expected.node) {
    failures.push(
      `${name} Node engine: expected ${expected.node}, received ${actualNode ?? 'none'}`,
    );
  }
}

const template = await fetchJson(TEMPLATE_PACKAGE, 'official React Router template');
const actualTemplate = {
  node: template.engines?.node,
  reactRouterPackage:
    template.dependencies?.['@shopify/shopify-app-react-router'],
  polarisTypes: template.devDependencies?.['@shopify/polaris-types'],
};

for (const [field, expected] of Object.entries(EXPECTED_TEMPLATE)) {
  const actual = actualTemplate[field];
  console.log(`Official template ${field}: ${actual ?? 'missing'}`);
  if (actual !== expected) {
    failures.push(
      `Official template ${field}: expected ${expected}, received ${actual ?? 'missing'}`,
    );
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(
    'Shopify tooling drifted. Review release notes, the official template, Node support, and migration requirements before updating the ISO snapshot.',
  );
  process.exit(1);
}

console.log('Shopify tooling versions and official template constraints are aligned.');
