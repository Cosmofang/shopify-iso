---
name: shopify-app-iso
description: Use the Shopify ISO repository as the single standard for building, designing, reviewing, and shipping Shopify apps. Trigger for Shopify app scaffolding, App Home and Web Components implementation, Polaris design decisions, App Store compliance, Built for Shopify audits, rejection remediation, or requests to "use Shopify ISO". For strict BFS work, align every planning, implementation, and verification step with applicable App Store and BFS requirement IDs and evidence.
---

# Shopify App ISO

Use one mandatory Shopify App workflow. Never create a separate or weaker design standard for ordinary development. Strict BFS work adds requirement-by-requirement evidence obligations to every step of that same workflow.

## Resolve the ISO source

1. Run `node scripts/resolve-iso-root.mjs` from this skill directory.
2. Store the returned absolute path as `ISO_ROOT` for the current task.
3. Read `${ISO_ROOT}/START-HERE.md` completely before changing a Shopify app.
4. Treat Shopify's current documentation and Dev Dashboard as external truth. If they conflict with the ISO, follow the current official source and update the ISO in scope.

Do not use remembered Polaris React values, copied hex values, or the retired `shopify-polaris` skill as authority. New App Home work uses current Polaris Web Components and App Bridge Web Components.

## Apply the single workflow

Always follow **standard execution** for scaffolding, feature work, design, engineering, and review.

Also apply **strict BFS obligations** when the request mentions BFS, Built for Shopify, App Store/BFS submission, compliance audit, rejection, remediation, strict review, or requirement-by-requirement alignment. These obligations extend standard execution; they do not replace it or define a second design route.

If the user only says “use Shopify ISO” without a concrete task, ask whether they want to build/change the app or run a strict BFS audit. Do not ask when intent is inferable.

## Standard execution

1. Classify the app surface, distribution, merchant workflow, data, scopes, and both category systems before choosing implementation details.
2. Read [references/source-routing.md](references/source-routing.md) and load only the ISO files relevant to the current task.
3. Inspect the actual app repository, current dependencies, Shopify configuration, and existing patterns before proposing edits.
4. Prefer official templates, App Home Patterns, compositions, Web Components, App Bridge APIs, and GraphQL Admin API.
5. Implement the complete workflow, including loading, empty, error, permission, mobile, keyboard, and recovery states.
6. Run the app repository's lint, typecheck, build, tests, and proportional runtime checks.
7. Report changed behavior, verification, and any official requirement that remains unverified.

App Store policy, security, truthful behavior, minimum scopes, accessibility, and current platform APIs remain mandatory in standard execution. Standard execution is not a compliance bypass.

## Strict BFS obligations

Read [references/strict-bfs.md](references/strict-bfs.md) completely and follow it throughout the task.

Before editing:

1. Verify the ISO source fingerprints and local links.
2. Determine applicable App Store Section 5 and BFS Section 5 categories from actual functionality and Distribution data.
3. Generate or maintain a live requirement ledger. Use `scripts/build-requirements-ledger.mjs` when a fresh ledger is useful.
4. Mark every applicable requirement as `pending`, `pass`, `fail`, or `unverified`; give a reason for every `not applicable` item.
5. Map each implementation plan item to its requirement IDs and expected evidence.

During editing:

1. Update the ledger when each work item changes compliance status.
2. Cite relevant requirement IDs in material progress updates and code-review findings.
3. Search the entire app for the same issue class instead of fixing only the reviewer screenshot.
4. Preserve unresolved Dashboard, rolling-metric, mobile, production, or manual-review items as `unverified`.

Before completion:

1. Run all applicable automated, desktop, mobile, accessibility, performance, install/reinstall, and category checks.
2. Attach concrete evidence to every `pass` claim.
3. List remaining `fail` and `unverified` items before any summary.
4. Never claim “BFS compliant”, “ready to submit”, or “passed” when required evidence is unavailable.

## Status language

- `pass`: verified with current code, runtime output, screenshot/recording, API result, or Dashboard evidence.
- `fail`: current behavior or evidence contradicts the requirement.
- `unverified`: likely implemented but required runtime, rolling metric, production, reviewer, or Dashboard evidence is missing.
- `not applicable`: excluded with a concrete product/category reason.

Do not convert `unverified` into `pass` based on code inspection alone.

## Resources

- [references/source-routing.md](references/source-routing.md): choose the canonical ISO files for a task.
- [references/strict-bfs.md](references/strict-bfs.md): execute requirement-by-requirement BFS work.
- `scripts/resolve-iso-root.mjs`: locate the single source repository.
- `scripts/build-requirements-ledger.mjs`: print a filtered App Store + BFS Markdown ledger.
