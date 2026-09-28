# Remaining workspace unit-test evidence

> Report version: `1.0.0`
> Verified: `2026-09-16 08:42 UTC`
> Reviewer: Codex (OpenAI), platform security subagent
> Target: `deepLumendev/shopify-deeplumen-app`, remote `dev`, commit `cccebcc9c7256a40d68cd6d7cd210761221bdf88`
> Evidence class: app-specific local test evidence, not a Shopify compliance rule or production verification.

This is authorized defensive verification in `/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/repo` using synthetic environment values. No app source was changed. `apps/shopify-app` is excluded because the root agent tested it separately. All `**/*.integration.test.ts` files were explicitly excluded; no live/integration flags were enabled.

## Outcome

The 13 remaining workspaces covered **359 test files and 4,623 distinct unit tests**. The initial run passed 4,621 tests and failed 2 assertions because the audit harness injected synthetic Partner API configuration into tests that assumed those variables were absent. The two affected files passed all 10 tests after those three variables were removed. This leaves **no unresolved assertion failure in the selected unit-test scope**. It is an aggregate result across the initial run and the targeted rerun, not a claim that the original command exited zero.

| Workspace | Files | Distinct tests | Result |
|---|---:|---:|---|
| `apps/admin-dashboard` | 151 | 2,129 | 2,127 initial passes; the 2 environment-dependent assertions passed on targeted rerun |
| `apps/headless-edge-worker` | 4 | 72 | Passed |
| `apps/navos-adapter` | 15 | 180 | Passed |
| `apps/worker-diagnosis` | 77 | 562 | Passed |
| `packages/diagnosis-core` | 8 | 125 | Passed |
| `packages/image-pipeline` | 21 | 357 | Passed |
| `packages/kafka` | 2 | 7 | Passed |
| `packages/logger` | 17 | 147 | Passed |
| `packages/queue` | 11 | 174 | Passed |
| `packages/scheduler-contracts` | 8 | 125 | Passed |
| `packages/scheduler-core` | 16 | 342 | Passed |
| `packages/search-ingest` | 2 | 15 | Passed |
| `packages/shared` | 27 | 388 | Passed |

## Initial invocation and harness issues

Log: `workspace-unit.log` in this audit directory. Wall time: 50.266 seconds. Process exit code: 1.

```sh
node run-check.mjs workspace-unit -r --workspace-concurrency=2 \
  --filter '!@deeplumen/shopify-app' --no-bail exec env \
  DATABASE_READ_URL=postgresql://bfs_audit:bfs_audit@127.0.0.1:65432/bfs_audit \
  DATABASE_WRITE_URL=postgresql://bfs_audit:bfs_audit@127.0.0.1:65432/bfs_audit \
  KAFKA_BROKERS=127.0.0.1:65434 \
  pnpm test --maxWorkers=2 --exclude '**/*.integration.test.ts'
```

The recursive selector also selected the repository root, which has no `test` script. `pnpm test` consequently reached the shell `test` utility and emitted `test: --maxWorkers=2: unexpected operator`. This is a runner selection error, not an app test failure. The command's `Summary: 2 fails, 12 passes` refers to the root runner error and the Dashboard workspace; it does not mean two failed app packages.

The two actual failed assertions were:

- `apps/admin-dashboard/tests/lib/partner-status.test.ts`: `getUninstallReasonFieldsMeta > 未配置 → upstream_not_ready + gateName`.
- `apps/admin-dashboard/tests/lib/partner-api/client.test.ts`: `partnerApiConfigured > 三 env 任一缺 → false`.

The harness set `PARTNER_API_ORG_ID`, `PARTNER_API_ACCESS_TOKEN`, and `PARTNER_API_APP_ID`. The first test did not clear any of them; the second stubbed two values and assumed `PARTNER_API_APP_ID` was absent. Code behaved correctly for the supplied synthetic configuration. This is not evidence of a product regression.

## Targeted rerun

Log: `workspace-unit-dashboard-rerun.log`. Wall time: 2.183 seconds. Exit code: 0. Result: **2 files / 10 tests passed**.

```sh
node run-check.mjs workspace-unit-dashboard-rerun \
  --filter @deeplumen/admin-dashboard exec env \
  -u PARTNER_API_ORG_ID -u PARTNER_API_ACCESS_TOKEN -u PARTNER_API_APP_ID \
  DATABASE_READ_URL=postgresql://bfs_audit:bfs_audit@127.0.0.1:65432/bfs_audit \
  DATABASE_WRITE_URL=postgresql://bfs_audit:bfs_audit@127.0.0.1:65432/bfs_audit \
  KAFKA_BROKERS=127.0.0.1:65434 \
  pnpm exec vitest run tests/lib/partner-status.test.ts \
  tests/lib/partner-api/client.test.ts --maxWorkers=2 \
  --exclude '**/*.integration.test.ts'
```

The initial workspace run used the current Node 25 environment; the root agent then set the harness PATH to installed Node 24.19.0 to support the merchant app's Kafka native dependency. The targeted Dashboard rerun used that Node 24 PATH. No native-binding failure occurred in the selected 13-workspace unit-test scope. Excluded integration tests are unexecuted, not passed or silently counted as skips.
