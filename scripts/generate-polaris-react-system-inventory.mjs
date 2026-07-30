#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {basename, join, relative, resolve, sep} from 'node:path';

function parseArguments(argv) {
  const options = {
    sourceRoot: '',
    webComponentsManifest: '',
    webComponentsPackage: '',
    output: '',
    commit: '',
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

  for (const required of [
    'sourceRoot',
    'webComponentsManifest',
    'webComponentsPackage',
    'output',
    'commit',
  ]) {
    if (!options[required]) throw new Error(`--${required.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)} is required`);
  }
  if (!/^[a-f0-9]{40}$/.test(options.commit)) {
    throw new Error('--commit must be a full 40-character Git commit');
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

const options = parseArguments(process.argv.slice(2));
const sourceRoot = resolve(options.sourceRoot);
const reactRoot = join(sourceRoot, 'polaris-react');
const componentRoot = join(reactRoot, 'src', 'components');
const tokenRoot = join(sourceRoot, 'polaris-tokens');
const iconRoot = join(sourceRoot, 'polaris-icons');

const reactPackage = JSON.parse(readFileSync(join(reactRoot, 'package.json'), 'utf8'));
const tokenPackage = JSON.parse(readFileSync(join(tokenRoot, 'package.json'), 'utf8'));
const iconPackage = JSON.parse(readFileSync(join(iconRoot, 'package.json'), 'utf8'));
const webComponentsPackage = JSON.parse(
  readFileSync(resolve(options.webComponentsPackage), 'utf8'),
);
const webComponentsManifestPath = resolve(options.webComponentsManifest);
const webComponentsManifest = JSON.parse(
  readFileSync(webComponentsManifestPath, 'utf8'),
);

const componentDirectories = readdirSync(componentRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const componentFiles = walk(componentRoot).filter((file) => statSync(file).isFile());

const tokenFiles = walk(join(tokenRoot, 'src')).filter((file) => statSync(file).isFile());
const tokenCategories = readdirSync(join(tokenRoot, 'src', 'themes', 'base'))
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
  .map((file) => file.replace(/\.ts$/, ''))
  .sort();

const iconSvgFiles = readdirSync(join(iconRoot, 'icons'))
  .filter((file) => file.endsWith('.svg'))
  .sort();
const iconMetadataFiles = readdirSync(join(iconRoot, 'icons'))
  .filter((file) => file.endsWith('.yml'))
  .sort();
const iconNames = iconSvgFiles.map((file) => file.replace(/\.svg$/, ''));
const iconFiles = [...iconSvgFiles, ...iconMetadataFiles].map((file) =>
  join(iconRoot, 'icons', file),
);

const webComponentTags = webComponentsManifest.modules
  .flatMap((module) => module.declarations ?? [])
  .filter((declaration) => declaration.tagName)
  .map((declaration) => declaration.tagName)
  .sort();

const inventory = {
  schemaVersion: 1,
  source: {
    repository: 'https://github.com/Shopify/polaris-react',
    commit: options.commit,
    capturedAt: options.capturedAt,
  },
  react: {
    package: reactPackage.name,
    version: reactPackage.version,
    componentDirectoryCount: componentDirectories.length,
    componentDirectories,
    componentTreeSha256: treeFingerprint(componentRoot, componentFiles),
  },
  tokens: {
    package: tokenPackage.name,
    version: tokenPackage.version,
    categories: tokenCategories,
    sourceFileCount: tokenFiles.length,
    sourceTreeSha256: treeFingerprint(join(tokenRoot, 'src'), tokenFiles),
  },
  icons: {
    package: iconPackage.name,
    version: iconPackage.version,
    iconCount: iconNames.length,
    metadataCount: iconMetadataFiles.length,
    iconNames,
    iconTreeSha256: treeFingerprint(join(iconRoot, 'icons'), iconFiles),
  },
  currentWebComponents: {
    package: webComponentsPackage.name,
    version: webComponentsPackage.version,
    tagCount: webComponentTags.length,
    tags: webComponentTags,
    manifestSha256: sha256(readFileSync(webComponentsManifestPath)),
  },
};

writeFileSync(resolve(options.output), `${JSON.stringify(inventory, null, 2)}\n`);
console.log(
  `Generated ${componentDirectories.length} React component directories, ${iconNames.length} icons, and ${webComponentTags.length} current Web Components in ${basename(options.output)}.`,
);
