#!/usr/bin/env node
/**
 * verify-tokens.mjs — 把 assets/polaris-tokens.css 与官方 @shopify/polaris-tokens 逐条比对。
 *
 * 为什么存在：库里的 token 是手写 px 版，容易悄悄偏离官方（曾偏离 9 处）。
 * 这个脚本把「严格按官方」变成可重复的关卡：拉官方包 → 解析亮色 :root → 归一化 → diff。
 * 有真实偏离则退出码 1（可用于 CI / pre-commit）。
 *
 * 用法：
 *   node scripts/verify-tokens.mjs            # 用 PINNED 版本核对
 *   POLARIS_TOKENS_VERSION=latest node scripts/verify-tokens.mjs
 *
 * 依赖：Node 18+、npm、tar（开发机自带）。无需 npm install。
 * 注意：归一化会把官方 rem 换算成 px、rgba 换算成 hex，
 *       因为库既定约定是「官方值的 px 写法」，单位差异不算偏离。
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PINNED = process.env.POLARIS_TOKENS_VERSION || '9.4.2';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB_CSS = join(ROOT, 'assets', 'polaris-tokens.css');

function parseRootBlock(css) {
  // 取第一个 { ... } 块（官方是 :root,.p-theme-light{}；库是 :root{}），即权威亮色。
  const body = css.slice(css.indexOf('{') + 1, css.indexOf('}'));
  const out = {};
  for (const m of body.matchAll(/(--p-[a-z0-9-]+)\s*:\s*([^;]+?)\s*(?:;|$)/g)) out[m[1]] = m[2].trim();
  return out;
}

function norm(v) {
  v = v.trim().toLowerCase();
  v = v.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g, (_, r, g, b, a) => {
    const hex = '#' + [r, g, b].map((x) => Number(x).toString(16).padStart(2, '0')).join('');
    return a !== undefined && Number(a) < 1 ? `${hex}@${a}` : hex;
  });
  v = v.replace(/([\d.]+)rem/g, (_, n) => `${Math.round(parseFloat(n) * 16)}px`);
  v = v.replace(/\b0px\b/g, '0');
  return v.replace(/\s+/g, ' ').trim();
}

function officialTokens(version) {
  const dir = mkdtempSync(join(tmpdir(), 'polaris-tok-'));
  execSync(`npm pack @shopify/polaris-tokens@${version}`, { cwd: dir, stdio: 'ignore' });
  const tgz = readdirSync(dir).find((f) => f.endsWith('.tgz'));
  execSync(`tar -xzf ${tgz}`, { cwd: dir, stdio: 'ignore' });
  return parseRootBlock(readFileSync(join(dir, 'package', 'dist', 'css', 'styles.css'), 'utf8'));
}

console.log(`▶ 核对 assets/polaris-tokens.css  vs  @shopify/polaris-tokens@${PINNED}\n`);
const off = officialTokens(PINNED);
const lib = parseRootBlock(readFileSync(LIB_CSS, 'utf8'));

const deviations = [];
let matched = 0;
for (const [k, lv] of Object.entries(lib)) {
  if (!(k in off)) continue; // 库不定义官方全集，只校对交集
  if (norm(lv) === norm(off[k])) matched++;
  else deviations.push({ k, lib: lv, official: off[k] });
}

console.log(`库定义 ${Object.keys(lib).length} 个 token；与官方交集一致 ${matched}；偏离 ${deviations.length}`);
for (const d of deviations) console.log(`  ❌ ${d.k}\n       库   = ${d.lib}\n       官方 = ${d.official}`);

if (deviations.length) {
  console.log('\n⚠️ 有偏离——请把库改到官方值后重跑。');
  process.exit(1);
}
console.log(`\n✅ 已严格对齐官方 Polaris v${PINNED}。`);
