# 审计与发布配置验证记录

> 文档版本：`1.0.0`
> 最后修改：`2026-09-28 10:05 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [SOURCE-GOVERNANCE](../../SOURCE-GOVERNANCE.md)

## 固定版本与隔离

- 远程最新引用：`origin/main=b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`，`origin/dev=3b6978083fbbcb41ca408e88162a6e93d5e5af7`。
- 最新 main 的历史 release：`v1.0.1 -> b39a0146`，`v1.0.0 -> bc675b2`；旧 tag 未移动。
- 审计工作树：`/private/tmp/deeplumen-ap-release-latest-20260928`，基线分支 `codex/release-governance-20260928-latest`，应用最新 main 后含发布配置提交 `4959e225` 和 heading compatibility 修复 `fa2e183`。
- 原始本地 `/Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/shopify/deeplumen-AP` 有用户 WIP，未切换、未 reset、未覆盖。
- `npm ci --ignore-scripts` 成功；npm audit 报 `34` 个依赖漏洞（`3 moderate`, `31 high`），这不是 BFS requirement 的通过证据，建议单独安排依赖治理。

## ISO 官方来源校验

| 命令 | 结果 |
|---|---|
| `node scripts/verify-bfs-requirements.mjs` | PASS；77/77 leaf、63/63 design rejection reasons；SHA `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93` |
| `node scripts/verify-app-store-requirements.mjs` | PASS；174/174；分区 `20/17/6/24/107`；SHA `52dc6cb5f377a919077c58c6032a55fd2c86d14e898603efae8228d8230052d2` |
| `node scripts/verify-app-design-guidelines.mjs` | PASS；11 个页面未变化 |
| `node scripts/verify-links.mjs` | PASS；81 个 Markdown 文件 |

以上证明 ISO 快照与官方来源对齐，不证明目标 App 已通过 BFS。

## 最新 main 的应用检查

在 `/private/tmp/deeplumen-ap-release-latest-20260928/deeplumen-app` 执行，Node `25.6.1`（满足仓库 `>=24`）：

| 命令 | 结果 | 解释 |
|---|---|---|
| `npx prisma generate` | PASS | 生成 Prisma Client 6.19.3 |
| `npm run typecheck` | PASS | React Router typegen + TypeScript |
| `npm run qa:bfs` | PASS | 对比度、焦点、tokens、语义色、圆角、命中区、横向滚动 |
| `npm run qa:pagination` | PASS | 分页 sanity |
| `npm run qa:cps-prompt` | PASS | 18 项 CPS prompt/modal lifecycle 检查 |
| `npm run qa:cps-modal` | PASS | modal lifecycle |
| `npm run qa:frontend` | PASS | frontend loading/stable-row |
| `npm run qa:chart` | PASS | commission chart |
| `npm run qa:mock` | PASS | mock route/contract 断言 |
| `npm run build` | PASS | Vite client + SSR build |
| `npm run lint` | FAIL | 2 个 severity-2 错误：`app/lib/commission.ts:901` 未使用 `_cfg`；`app/routes/app.commission.tsx:449` 非标准空白；另有 4 个 Hook warning |
| `npm run qa:cps` | FAIL | `scripts/qa/cps-gate-sanity.ts` 导入 `app/lib/cps-onboarding.ts` 中不存在的 `shouldGateToPlan` |
| `npm run verify:production` | FAIL | production-baseline 声明边界外有大量 prototype/app 文件和语句，见 F-05 |

`qa:bfs` PASS 只说明脚本覆盖的静态条件通过；不覆盖 4.3.1/4.3.3 的产品语义和弹窗触发时机，也不覆盖 Dashboard/生产。

## 发布治理配置验证

配置提交：`4959e225` + `fa2e183`（基于最新 `main@b39a0146`）。新增/修改：

- `.github/workflows/release-gate.yml`：prototype integrity、Node 24、typecheck、lint、BFS QA、专项 sanity、production baseline、mock contract、build、版本报告检查。
- `scripts/release/verify-release-report.mjs`：报告唯一性/新增性、版本格式、annotated tag、tag 事件 SHA、远程 main 可追溯性。
- `docs/releases/ROLLBACK.md`、`RELEASING.md`、`docs/releases/TEMPLATE.md`、`AGENTS.md`：artifact/image digest、Shopify App version、migration、外部资源和不可移动 tag 的回滚追踪。

配置检查结果：YAML parse PASS；`node --check scripts/release/verify-release-report.mjs` PASS；`node scripts/release/verify-release-report.mjs --version v1.0.0 --tag` PASS；不存在的 `v9.9.9` 会失败。由于 `lint`、`qa:cps`、`verify:production` 当前失败，Release gate 现在应为红色，不能把它写成“发布门禁已通过”。

GitHub branch protection / required checks 不能由仓库文件自动开启；私有仓库接口当前返回 403（需 GitHub Pro 或公开仓库），所以 `main/dev` 的保护状态保持 `unverified`。

尝试推送 `codex/release-governance-20260928-latest` 时 GitHub 网络返回 HTTP/2 framing / port 443 connection failure；配置已保存在隔离工作树的两个本地提交中，但当前未能推送远端，也未合并 `dev/main`。

## 复核命令

开发修复后至少重复：

```text
node scripts/verify-bfs-requirements.mjs
node scripts/verify-app-store-requirements.mjs
node scripts/verify-app-design-guidelines.mjs
node scripts/verify-links.mjs
git diff --check
npm run typecheck
npm run lint
npm run qa:bfs
npm run qa:cps
npm run verify:production
npm run build
```

再补真实测试店的安装/重装、CPS hosted approval、webhook、隐私请求、卸载清理和 Dashboard 证据；在这些证据出现前，ledger 的 `unverified` 不得改成 `pass`。
