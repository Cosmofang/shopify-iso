# ISO Source Routing

Resolve `ISO_ROOT` first. Read `START-HERE.md` for every build or audit task, then load the smallest relevant set below.

| Task | Required ISO sources |
|---|---|
| App definition or scaffold | `START-HERE.md`, `scaffold/README.md`, `tooling.md` |
| App Store eligibility | `00-built-for-shopify/app-store-requirements.md` |
| Strict BFS | `00-built-for-shopify/official-requirements-matrix.md`, `00-built-for-shopify/requirements-ledger.md`, `00-built-for-shopify/status-lifecycle.md`, `00-built-for-shopify/pre-submission-checklist.md`, `05-engineering/category-specific.md` |
| BFS rejection | Above strict sources plus the actual current reviewer message and an app-specific rejection record; never treat another App's historical rejection file as authority |
| Layout and visual design | `01-foundations/`, relevant `02-components/`, relevant `03-patterns/` |
| Product content | `01-foundations/content.md`, relevant feedback/onboarding pattern, current official Content guideline |
| App name, URL, icon or listing asset | `04-partner-dashboard/`, applicable App Store/BFS requirement, current Dev Dashboard guidance |
| Historical Polaris rationale or legacy React maintenance | `06-polaris-react-handbook/README.md`, then its relevant chapter; current Shopify sources still take precedence |
| Onboarding | `03-patterns/onboarding.md`, `00-built-for-shopify/requirements.md` section 4.2.2 |
| App homepage | `03-patterns/app-home.md`, `03-patterns/onboarding.md`, `02-components/navigation.md` |
| In-app promotion or plan gating | `03-patterns/marketing.md`, `00-built-for-shopify/requirements.md` sections 4.3.1-4.3.7 |
| Authentication | `05-engineering/authentication.md`, `05-engineering/security-data.md` |
| API and data | `05-engineering/api-usage.md`, `05-engineering/webhooks-compliance.md`, `05-engineering/security-data.md` |
| Admin integration | `05-engineering/integration.md`, `02-components/navigation.md`, relevant App Bridge component page |
| App window or Admin UI extension structure | `03-patterns/app-structure.md`, `02-components/modals.md`, applicable App Store requirement |
| Performance | `05-engineering/performance.md` |
| Theme/storefront | `05-engineering/integration.md`, applicable App Store/BFS category requirements |
| Release and review | `START-HERE.md` stages 7-8, `00-built-for-shopify/local-self-test.md` |

Rules:

1. Read the whole selected file, not isolated search snippets.
2. Use repository scripts, including the App Design Guidelines verifier, for deterministic source checks; do not reproduce their logic ad hoc.
3. Follow current Shopify documentation for API signatures and component properties.
4. When a linked historical Polaris page conflicts with Web Components or BFS, use the current source.
5. Do not load every component or category file when the app cannot use it.
6. Treat `06-polaris-react-handbook/` as historical explanation and migration support, never as authority for current component APIs, token values, or BFS pass status.
