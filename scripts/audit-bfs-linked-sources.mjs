#!/usr/bin/env node

const BFS_SOURCE =
  'https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md';
const CONCURRENCY = 6;
const MOVED_SOURCES = new Map([
  [
    'https://shopify.dev/docs/api/app-home/app-bridge-web-components/s-app-nav.md',
    'https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav.md',
  ],
]);

async function fetchWithRetry(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return {response, body: await response.text()};
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Unable to fetch ${url} after ${attempts} attempts`, {
    cause: lastError,
  });
}

function asMarkdownUrl(url) {
  const target = new URL(url);
  target.hash = '';
  target.search = '';
  if (target.pathname.startsWith('/docs/') && !target.pathname.endsWith('.md')) {
    target.pathname += '.md';
  }
  return target.href;
}

function extractTitle(markdown) {
  return (
    markdown.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ??
    markdown.match(/^#\s+(.+)$/m)?.[1] ??
    '(title unavailable)'
  );
}

const {body: bfsMarkdown} = await fetchWithRetry(BFS_SOURCE);
const linkedSources = [
  ...new Set(
    [...bfsMarkdown.matchAll(
      /\[[^\]]+\]\((https:\/\/shopify\.dev\/(?:docs|changelog)[^)]+)\)/g,
    )].map(([, url]) => asMarkdownUrl(url)),
  ),
].sort();

const results = [];

for (let index = 0; index < linkedSources.length; index += CONCURRENCY) {
  const batch = linkedSources.slice(index, index + CONCURRENCY);
  results.push(
    ...(await Promise.all(
      batch.map(async (url) => {
        try {
          const {response, body} = await fetchWithRetry(url);
          return {
            ok: true,
            url,
            finalUrl: response.url,
            title: extractTitle(body),
            lines: body.split('\n').length,
          };
        } catch (error) {
          const replacement = MOVED_SOURCES.get(url);
          if (replacement) {
            try {
              const {response, body} = await fetchWithRetry(replacement);
              return {
                ok: true,
                moved: true,
                url,
                finalUrl: response.url,
                title: extractTitle(body),
                lines: body.split('\n').length,
              };
            } catch (replacementError) {
              return {
                ok: false,
                url,
                error: `${error.message}; replacement failed: ${replacementError.message}`,
              };
            }
          }
          return {ok: false, url, error: error.message};
        }
      }),
    )),
  );
}

for (const result of results) {
  if (result.ok) {
    console.log(
      `${result.moved ? 'MOVED' : 'OK'}\t${result.title}\t${result.lines} lines\t${result.finalUrl}`,
    );
  } else {
    console.error(`FAIL\t${result.url}\t${result.error}`);
  }
}

const failures = results.filter((result) => !result.ok);
console.log(
  `Reviewed linked Shopify developer sources: ${results.length - failures.length}/${results.length} reachable.`,
);

if (failures.length) process.exit(1);
