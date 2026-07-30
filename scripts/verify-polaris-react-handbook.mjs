#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HANDBOOK = join(ROOT, '06-polaris-react-handbook');
const EXPECTED_TARGET_COUNTS = new Map([
  ['01-status-and-source-priority.md', 4],
  ['02-foundations-and-design.md', 33],
  ['03-content-guidelines.md', 7],
  ['04-patterns.md', 22],
  ['06-tokens-icons-tools.md', 69],
  ['07-legacy-react-maintenance.md', 9],
  ['09-source-governance.md', 6],
  ['components/actions-layout.md', 19],
  ['components/deprecated-internal.md', 31],
  ['components/feedback-navigation.md', 32],
  ['components/input-data.md', 28],
]);

function parseArguments(argv) {
  let sourceRoot = '';
  let siteCrawl = '';
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (!value || !['--source-root', '--site-crawl'].includes(argument)) {
      throw new Error(`Usage: node scripts/verify-polaris-react-handbook.mjs [--source-root <polaris-react-repository>] [--site-crawl <crawl.json>]`);
    }
    if (argument === '--source-root') sourceRoot = resolve(value);
    if (argument === '--site-crawl') siteCrawl = resolve(value);
    index += 1;
  }
  return {siteCrawl, sourceRoot};
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

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

function treeFingerprint(root, files) {
  const records = files
    .sort()
    .map((file) => `${toPosix(relative(root, file))}\0${sha256(readFileSync(file))}\n`)
    .join('');
  return sha256(records);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function sameMembers(actual, expected) {
  return (
    actual.length === expected.length &&
    [...actual].sort().every((item, index) => item === [...expected].sort()[index])
  );
}

const {siteCrawl, sourceRoot} = parseArguments(process.argv.slice(2));
const manifest = readJson(join(HANDBOOK, 'source-manifest.json'));
const inventory = readJson(join(HANDBOOK, 'system-inventory.json'));
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(manifest.schemaVersion === 1, 'source-manifest schemaVersion must be 1');
assert(manifest.counts?.files === 260, `expected 260 manifest files, found ${manifest.counts?.files}`);
assert(manifest.entries?.length === 260, `expected 260 manifest entries, found ${manifest.entries?.length}`);

const paths = manifest.entries.map((entry) => entry.path);
assert(new Set(paths).size === paths.length, 'source-manifest contains duplicate source paths');

const targetCounts = new Map();
for (const entry of manifest.entries) {
  assert(/^[a-f0-9]{64}$/.test(entry.sha256), `invalid SHA-256 for ${entry.path}`);
  assert(Number.isInteger(entry.bytes) && entry.bytes >= 0, `invalid byte count for ${entry.path}`);
  const target = join(HANDBOOK, entry.handbookTarget);
  assert(existsSync(target), `missing handbook target ${entry.handbookTarget} for ${entry.path}`);
  targetCounts.set(entry.handbookTarget, (targetCounts.get(entry.handbookTarget) ?? 0) + 1);
}

for (const [target, count] of EXPECTED_TARGET_COUNTS) {
  assert(targetCounts.get(target) === count, `expected ${count} sources routed to ${target}, found ${targetCounts.get(target) ?? 0}`);
}
assert(
  sameMembers([...targetCounts.keys()], [...EXPECTED_TARGET_COUNTS.keys()]),
  'manifest handbookTarget set differs from the reviewed target set',
);

for (const chapter of [
  'README.md',
  '01-status-and-source-priority.md',
  '02-foundations-and-design.md',
  '03-content-guidelines.md',
  '04-patterns.md',
  '06-tokens-icons-tools.md',
  '07-legacy-react-maintenance.md',
  '08-current-shopify-mapping.md',
  '09-source-governance.md',
  'components/README.md',
]) {
  assert(existsSync(join(HANDBOOK, chapter)), `missing required handbook chapter ${chapter}`);
}

assert(inventory.schemaVersion === 1, 'system-inventory schemaVersion must be 1');
assert(inventory.source?.commit === manifest.source?.commit, 'manifest and inventory commits differ');
assert(inventory.react?.package === '@shopify/polaris', 'unexpected React package name');
assert(inventory.react?.version === '13.10.1', `expected official source version 13.10.1, found ${inventory.react?.version}`);
assert(inventory.react?.componentDirectoryCount === 121, `expected 121 source component directories, found ${inventory.react?.componentDirectoryCount}`);
assert(inventory.react?.componentDirectories?.length === 121, 'React component directory list must contain 121 entries');
assert(new Set(inventory.react?.componentDirectories).size === 121, 'React component directory list contains duplicates');
assert(inventory.tokens?.version === '9.4.2', `expected token source version 9.4.2, found ${inventory.tokens?.version}`);
assert(inventory.tokens?.categories?.length === 11, 'expected 11 token categories');
assert(inventory.tokens?.sourceFileCount === 25, 'expected 25 token source files');
assert(inventory.icons?.version === '9.3.1', `expected icon source version 9.3.1, found ${inventory.icons?.version}`);
assert(inventory.icons?.iconCount === 534, `expected 534 icons, found ${inventory.icons?.iconCount}`);
assert(inventory.icons?.metadataCount === 534, `expected 534 icon metadata files, found ${inventory.icons?.metadataCount}`);
assert(inventory.icons?.iconNames?.length === 534, 'icon name list must contain 534 entries');
assert(inventory.currentWebComponents?.version === '1.0.7', `expected Web Component types 1.0.7, found ${inventory.currentWebComponents?.version}`);
assert(inventory.currentWebComponents?.tagCount === 59, `expected 59 Web Components, found ${inventory.currentWebComponents?.tagCount}`);
assert(inventory.currentWebComponents?.tags?.length === 59, 'Web Component tag list must contain 59 entries');
assert(new Set(inventory.currentWebComponents?.tags).size === 59, 'Web Component tag list contains duplicates');
assert(inventory.currentWebComponents?.tags?.every((tag) => /^s-[a-z0-9-]+$/.test(tag)), 'invalid Web Component tag name');

const handbookReadme = readFileSync(join(HANDBOOK, 'README.md'), 'utf8');
const governance = readFileSync(join(HANDBOOK, '09-source-governance.md'), 'utf8');
for (const text of ['13.10.1', '121', '13.9.5', '120']) {
  assert(handbookReadme.includes(text), `handbook README does not distinguish source snapshots: missing ${text}`);
  assert(governance.includes(text), `source governance does not distinguish source snapshots: missing ${text}`);
}

if (sourceRoot) {
  const contentRoot = join(sourceRoot, 'polaris.shopify.com', 'content');
  assert(existsSync(contentRoot), `source content directory does not exist: ${contentRoot}`);
  if (existsSync(contentRoot)) {
    const sourceFiles = walk(contentRoot)
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.template'))
      .map((file) => toPosix(relative(contentRoot, file)))
      .sort();
    const manifestFiles = [...paths].sort();
    for (const missing of manifestFiles.filter((path) => !sourceFiles.includes(path))) failures.push(`source file missing: ${missing}`);
    for (const extra of sourceFiles.filter((path) => !manifestFiles.includes(path))) failures.push(`unreviewed source file: ${extra}`);

    for (const entry of manifest.entries) {
      const file = join(contentRoot, entry.path);
      if (!existsSync(file)) continue;
      const contents = readFileSync(file);
      assert(contents.length === entry.bytes, `byte count changed for ${entry.path}`);
      assert(sha256(contents) === entry.sha256, `SHA-256 changed for ${entry.path}`);

      if (entry.path.startsWith('components/')) {
        const title = contents.toString('utf8').match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
        if (title) {
          const target = readFileSync(join(HANDBOOK, entry.handbookTarget), 'utf8').toLowerCase();
          assert(target.includes(title.toLowerCase()), `component title "${title}" is absent from ${entry.handbookTarget}`);
        }
      }
    }
  }

  const reactRoot = join(sourceRoot, 'polaris-react');
  const componentRoot = join(reactRoot, 'src', 'components');
  const tokenRoot = join(sourceRoot, 'polaris-tokens', 'src');
  const iconRoot = join(sourceRoot, 'polaris-icons', 'icons');
  for (const directory of [componentRoot, tokenRoot, iconRoot]) {
    assert(existsSync(directory), `source inventory directory does not exist: ${directory}`);
  }

  if (existsSync(componentRoot)) {
    const directories = readdirSync(componentRoot, {withFileTypes: true})
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    assert(sameMembers(directories, inventory.react.componentDirectories), 'React component directory inventory changed');
    const files = walk(componentRoot).filter((file) => statSync(file).isFile());
    assert(treeFingerprint(componentRoot, files) === inventory.react.componentTreeSha256, 'React component tree fingerprint changed');
  }

  if (existsSync(tokenRoot)) {
    const files = walk(tokenRoot).filter((file) => statSync(file).isFile());
    assert(files.length === inventory.tokens.sourceFileCount, 'token source file count changed');
    assert(treeFingerprint(tokenRoot, files) === inventory.tokens.sourceTreeSha256, 'token source tree fingerprint changed');
  }

  if (existsSync(iconRoot)) {
    const files = readdirSync(iconRoot).filter((file) => file.endsWith('.svg') || file.endsWith('.yml'));
    assert(files.filter((file) => file.endsWith('.svg')).length === inventory.icons.iconCount, 'icon SVG count changed');
    assert(files.filter((file) => file.endsWith('.yml')).length === inventory.icons.metadataCount, 'icon metadata count changed');
    assert(treeFingerprint(iconRoot, files.map((file) => join(iconRoot, file))) === inventory.icons.iconTreeSha256, 'icon tree fingerprint changed');
  }
}

if (siteCrawl) {
  assert(existsSync(siteCrawl), `site crawl does not exist: ${siteCrawl}`);
  if (existsSync(siteCrawl)) {
    const crawl = readJson(siteCrawl);
    const pages = crawl.pages ?? [];
    assert(crawl.baseUrl === 'https://polaris-react.shopify.com', `unexpected crawl base URL: ${crawl.baseUrl}`);
    assert(crawl.capturedAt === '2026-07-29', `unexpected crawl date: ${crawl.capturedAt}`);
    assert(pages.length === 243, `expected 243 crawled website paths, found ${pages.length}`);
    assert(new Set(pages.map((page) => page.path)).size === pages.length, 'site crawl contains duplicate paths');
    assert(pages.every((page) => page.error === null), 'site crawl contains navigation errors');
    assert(pages.every((page) => page.actualUrl?.startsWith('https://polaris-react.shopify.com/')), 'site crawl contains an unexpected destination');
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `Polaris React handbook OK: ${manifest.entries.length}/260 sources, ${inventory.react.componentDirectoryCount} React directories, ${inventory.icons.iconCount} icons, ${inventory.currentWebComponents.tagCount} current Web Components${sourceRoot ? ', source hashes verified' : ''}${siteCrawl ? ', 243 website paths verified' : ''}.`,
);
