# Strict BFS Execution

Strict BFS is an evidence workflow over the same Shopify ISO, not a second standard.

## 1. Establish scope

1. Read `00-built-for-shopify/app-store-requirements.md` and `00-built-for-shopify/official-requirements-matrix.md` completely.
2. Treat App Store Sections 1-4 and BFS Sections 1-4 as the core review set where applicable to the distribution type.
3. Determine App Store Section 5 categories and BFS Section 5 categories independently. Multiple categories can apply.
4. Confirm automatic prerequisites and category assignments in Dev Dashboard > Distribution when access exists.
5. Record unknown Dashboard state as `unverified`, not `pass`.

## 2. Build the ledger

Use a table with these columns:

| Source | ID | Requirement | Applicability/reason | Work item | Evidence | Status |
|---|---|---|---|---|---|---|

Generate the initial rows when useful:

```bash
node scripts/build-requirements-ledger.mjs \
  --app-store-categories 5.1,5.6 \
  --bfs-categories 5.3
```

Omit category arguments only after explicitly concluding that no Section 5 category applies. Use `--all-categories` only for ISO maintenance, not an individual app audit.

## 3. Plan against requirements

For every implementation or remediation step, record:

- requirement IDs it addresses;
- files, pages, configurations, or Dashboard settings it affects;
- expected automated and manual evidence;
- same-class search needed across the whole app;
- dependencies on production traffic, rolling windows, reviewers, or external systems.

Do not create a “miscellaneous BFS cleanup” step without IDs.

## 4. Execute continuously

After each material work item:

1. Run the narrowest relevant test.
2. Update affected ledger rows immediately.
3. Keep `pass` only when evidence matches the exact acceptance criterion.
4. Re-run category classification when functionality, scopes, extensions, billing, or distribution changes.
5. Re-open official linked guidance when implementation details are unclear or the ISO fingerprint changes.

## 5. Verify in layers

1. **Source integrity**: ISO BFS/App Store/App Design Guidelines/color/token/link scripts pass.
2. **Static app checks**: lint, typecheck, build, tests, configuration, whole-repo anti-pattern searches.
3. **Runtime checks**: install, onboarding, core workflows, errors, empty/loading states, uninstall/reinstall.
4. **Interaction checks**: desktop, Shopify mobile, keyboard, focus, contrast, responsive layout.
5. **Platform checks**: scopes, extensions, webhooks, App Bridge, GraphQL, billing, category APIs.
6. **Dashboard checks**: prerequisites, Web Vitals rolling windows, category assignments, listing and Partner standing.
7. **Submission evidence**: screenshots, recordings, reviewer credentials, reproduction steps and production metrics.

## 6. Finish honestly

Lead with `fail` findings, then `unverified`, then passed scope. Include requirement IDs and evidence references.

The final readiness decision is one of:

- `not ready`: at least one applicable failure remains;
- `implementation complete, evidence pending`: no known code failure, but required evidence remains unverified;
- `ready to submit`: every applicable item has current evidence and Distribution shows prerequisites satisfied.
