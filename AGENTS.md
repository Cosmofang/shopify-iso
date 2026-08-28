# Shopify ISO Agent Rules

> Policy version: `1.0.0`
> Last modified: `2026-08-28 10:31 CST (Asia/Shanghai)`
> Last editor: `Codex (OpenAI)`
> Policy source: repository owner instruction on 2026-08-28
> Shopify truth sources: [Shopify developer documentation](https://shopify.dev/docs) · [Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · Dev Dashboard

These rules apply to every agent and every file in this repository.

## Mandatory official-source workflow

Before changing a Shopify rule, implementation recommendation, component contract, API statement, threshold, or review conclusion:

1. Find the current official Shopify source first. Prefer the exact requirement, API/component reference, design guideline, changelog entry, or Dev Dashboard criterion.
2. Open and verify the current source content. Search snippets, model memory, reviewer messages, another agent's answer, existing ISO text, and project code are discovery evidence, not authority.
3. Record the exact official URL and the verification date. Requirement work must also record the applicable App Store or BFS ID.
4. Classify the statement as one of: official hard requirement, official guidance/API contract, ISO conservative baseline, or app-specific evidence.
5. Only then edit the ISO. If the official source does not support a claim, do not present it as Shopify or BFS policy.

When official sources conflict with this repository, follow the current official source and update the ISO in the same scoped change. Dashboard-only state remains `unverified` without Dashboard evidence.

## Mandatory document provenance

Every normative Markdown file changed from this date forward must keep a metadata block at the top containing:

- document or policy version;
- last-modified date and time with timezone;
- last editor;
- the official sources used for that revision.

Increment the document version whenever its normative content changes. Each added or changed rule must be traceable to a nearby official link or an unambiguous source section. A general link list at the end is insufficient when the source of a rule would be unclear.

ISO conservative baselines must be labeled as ISO choices and cite the official requirement or guidance they protect. App-specific reviewer feedback, screenshots, runtime measurements, fixed pixel values, and implementation details must be labeled as app evidence; they cannot become universal ISO rules without independent official support.

Follow [SOURCE-GOVERNANCE.md](SOURCE-GOVERNANCE.md) for the required template, source hierarchy, versioning, and verification record.

## Verification before completion

Run the applicable repository verifiers after normative changes. At minimum, run source fingerprint checks for the sources affected, `node scripts/verify-links.mjs`, and `git diff --check`. Do not claim an app is BFS compliant based on handbook completeness or code inspection alone.
