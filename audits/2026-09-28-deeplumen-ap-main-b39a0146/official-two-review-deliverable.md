# Deeplumen AP：BFS 官方双轮复核交付报告

> 文档版本：`1.0.3`
> 最后修改：`2026-09-28 12:13 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 证据范围：固定 main 提交的源码与可达路径；生产配置、真实店铺、Dev Dashboard、App Store listing 和手机端运行结果未取得
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe) · [App Design — Marketing](https://shopify.dev/docs/apps/design/user-experience/marketing) · [Post-purchase UX](https://shopify.dev/docs/apps/build/checkout/product-offers/ux-for-post-purchase-product-offers) · [Post-purchase API](https://shopify.dev/docs/api/checkout-extensions/post-purchase/api)

## 交付结论

已完成两轮相互独立的官方复核。原 [开发整改交接单](findings.md) 的官方条款、数字和主要源码证据均真实；本次仅修正 F-01 的 prototype loader 行号（`data.cpsPrompt` 在第 176 行，第 158 行是 `computedPrompt` 计算），没有发现需要撤回的 BFS 结论。需要保持来源边界：

- **4 项 BFS 设计不匹配**：F-01、F-02、F-06、F-08，涉及 3 个 BFS requirement ID：`4.3.1`、`4.3.3`、`4.2.4`。
- **1 项生产证据缺口**：F-03。它是 App Store 隐私合规与 BFS `1.1.1` 的生产核验缺口，不是已证明线上违规。
- **3 项工程交接项**：F-04、F-05、F-07。它们不是 Shopify 官方严重等级，也不能直接改写为 BFS fail。
- 当前结论是 **`not ready`**。源码和本地 QA 不能证明完整 BFS 通过；还缺生产、Dashboard、listing、真实安装/重装、移动端和人工审核证据。

## 官方源真实性记录

两轮都重新打开官方 Markdown/HTML，而不是只读取 ISO 快照。指纹和数量如下：

| 来源 | 官方 URL | 核验结果 |
|---|---|---|
| BFS | [requirements.md](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) | `77` 条叶子要求、`63` 条设计拒审理由；SHA-256 `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93` |
| App Store | [app-store-requirements.md](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements.md) | `173` 条；分区 `20/17/6/24/106`；SHA-256 `cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e`；当前没有 App Store `5.8.4` |
| Privacy | [privacy-law-compliance.md](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance.md) | SHA-256 `ea9dee13304ca6cef50f83e94bac56afde96022db9ae7a7109fe1fcfe25624ee` |
| Webhooks | [subscribe.md](https://shopify.dev/docs/apps/build/webhooks/subscribe.md) | SHA-256 `3f75be1ccee18f3bbcafbcc262fa0363cc1106453b0df42aabbc6399b14fc94a` |
| Marketing | [marketing.md](https://shopify.dev/docs/apps/design/user-experience/marketing.md) | SHA-256 `84420315cdacc43d45d98f1116499165f266276516f0a8930f7d47e883d6cab4` |
| Post-purchase UX | [ux-for-post-purchase-product-offers.md](https://shopify.dev/docs/apps/build/checkout/product-offers/ux-for-post-purchase-product-offers.md) | SHA-256 `4c8bbe6b28c3c741a885db06b778b2b09866cf86baf9245b8d3ff4df343bc05b` |
| Post-purchase API | [api.md](https://shopify.dev/docs/api/checkout-extensions/post-purchase/api.md) | SHA-256 `a8f9fc9c3fb08ae8beb8f09be0f539c76f65c72c6a32c74c07d798edd2c62ec9` |

## 双轮复核记录

### Review 1：BFS 条款与源码证据

逐项重读 BFS `4.2.4`、`4.3.1`、`4.3.3`、`4.3.6` 的当前正文和所有相关拒审理由，并按固定 `main@b39a0146` 重新查看源码行号。

官方原文支持以下判断：

| 条款 | 官方原文要点 | 报告证据核对 |
|---|---|---|
| `4.2.4` Helpful error messages | “Errors should be red”；拒审理由 #2：错误消息使用红色以外的颜色 | `DiagnosisErrorState` 的失败标题和正文分别为 `#1a1a1a`、`#6d7175`，红色图标不能改变文字颜色；F-06 真实 |
| `4.3.1` Don’t make false claims | “Don’t guarantee, promise, or strongly suggest merchant outcomes.” | CPS、AI Traffic FAQ/说明和 Plan 文案包含订单、推荐或增长结果暗示；F-02 真实，但只代表固定原型内容，不证明生产或 listing 同样违规 |
| `4.3.3` Don’t distract merchants | #1 首屏/延时/无关操作自动 modal；#3 与商家动作无关、用于吸引注意的动画 | CPS 首屏 `Boolean(data.cpsPrompt)` + `autoShow` 支持 F-01；Plan `AiOrderGrowthPanel` 无条件每 3200ms 改变步骤支持 F-08 |
| `4.3.6` Dismissible ads | 促销必须可关闭，关闭后相同或相似内容不得再次出现 | ReviewPrompt 当前未接入 prototype loader，因此报告没有把旧的“30 天静默”推断为现行 fail；该撤回结论正确 |

Review 1 还确认：死 CSS、未挂载的旧 Hero 动画、固定为 `false` 的 Blog 错误 mock 没有被错误升级为当前可达 fail；`EXAMPLE` 图表标识也没有被错误写成缺失。

### Review 2：App Store、隐私、营销和 Post-purchase 边界

2026-09-28 11:55 EDT，由独立复核对 Review 1 的官方条款、指纹和证据边界再次核验：BFS 仍为 77 条叶子要求/63 条设计拒审理由，App Store 仍为 173 条（分区 `20/17/6/24/106`）；隐私合规三条 mandatory topics、HMAC/响应/30 天履约、Marketing 促销分类与关闭后不再展示、Post-purchase 最多连续 3 个 upsell 及 `changesetApplicationsRemaining` 均与当前官方页面一致。结论保持不变：四项 BFS finding、一个生产证据缺口和三项工程交接项的分类成立。

#### App Store 与隐私

当前 App Store 主清单确实是 173 条。原 `5.8.4 Limit consecutive requests displayed to customers` 已移除，后续 `5.8.5`–`5.8.10` 编号未重排。不能因此推断 Post-purchase 无限展示：当前官方 UX 指南仍写 **maximum of three consecutive upsell offers**，API 另有 `changesetApplicationsRemaining`。

隐私官方页面明确要求 App Store app 在审核前订阅并验证三条 mandatory compliance topics：`customers/data_request`、`customers/redact`、`shop/redact`；无效 HMAC 返回 `401 Unauthorized`；收到请求返回 200 系列确认，并在 30 天内完成处理（存在法定保留例外）。因此 F-03 的官方依据真实，但因为当前 AP checkout 明确是前端原型且生产配置在另一仓库，最终状态必须是 `unverified`。

#### Marketing 与评价请求

Shopify Marketing 指南明确把“请求评价”“套餐/订阅升级”“下载其他 App”列为 promotional messages，并要求 App Home 促销可关闭；同一用户关闭后不应再次显示。报告对 ReviewPrompt 的修正是正确的：分类依据已明确，尚不确定的是当前代码没有接入后的实际展示/关闭行为，不能把不可达组件判为 fail。

#### Post-purchase

官方 Post-purchase UX 指南写明：透明披露费用、提供接受/拒绝选项、最多连续 3 个 upsell。官方 API 的 `applyChangeset` 返回 `changesetApplicationsRemaining`，且 `done()` 会回到 Order status page。报告把这些作为官方指导/API 合同，未冒充新增 BFS 或 App Store 编号，边界正确。

## 可交给开发的最终整改表

| 编号 | 优先级 | 最终状态 | 官方依据 | 固定代码证据 | 开发动作与验收 |
|---|---:|---|---|---|---|
| F-01 | P1 | BFS `4.3.3` 不匹配 | [BFS 4.3.3](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-distract-merchants)，拒审 #1 | `app._index.tsx:119–120,228–235`；`CpsAuthorizationPrompt.tsx:101–105` | 首屏只展示页面内通知/卡片；商家点击 CTA 后打开 modal；刷新、轮询、无关操作不自动开窗；补回归测试 |
| F-02 | P1 | BFS `4.3.1` 不匹配 | [BFS 4.3.1](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-make-false-claims) | `CpsAuthorizationPrompt.tsx:87–98`；`app.ai-traffic.tsx:129–137`；`AiOrderGrowthPanel.tsx:147–172` | 删除结果保证、最高级和固定时间承诺；真实结果必须有店铺、时间窗、数据源、归因规则；示例保留明确 `EXAMPLE` |
| F-03 | P1 | 生产 `unverified` | [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#mandatory-compliance-webhooks)；BFS `1.1.1` | `shopify.server.ts:18`；`shopify.app.toml:3–18,35–51` | 在正确生产仓库补/核实三条 compliance topics、签名校验、幂等和 30 天履约；用合成数据验证并提供生产订阅/投递证据 |
| F-04 | P1 | 工程 fail | App-specific test contract | `scripts/qa/cps-gate-sanity.ts:15–31` 导入不存在的 `shouldGateToPlan` | 同步测试和当前 `cpsGateDestination` 契约；`npm run qa:cps`、typecheck、build 全通过；不能删失败断言 |
| F-05 | P2 | 旧快照漂移诊断 | App-specific baseline；不是 BFS 条款 | `verify-baseline.cjs:14`；`production-baseline.json` | 区分有意 UI 变更与意外业务漂移；更新审查过的基线/边界，不回滚 UI 伪造通过；生产流程另在生产仓库验证 |
| F-06 | P2 | BFS `4.2.4` 不匹配 | [BFS 4.2.4](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#helpful-error-messages) | `app.pages.$id.diagnosis.tsx:259–268` | 失败标题和原因使用红色错误语义；保留可见原因和 Retry；warning/pending 不全局改红 |
| F-07 | P2 | 工程 fail | App-specific lint contract | `commission.ts:901`；`app.commission.tsx:449` | 处理未使用参数；BOM 使用显式 `\uFEFF` 保留 CSV 编码；lint 无 severity-2 error，Hook warning 单独评估 |
| F-08 | P2 | BFS `4.3.3` 不匹配（代码级已确认；视觉强度仍需页面复核） | [BFS 4.3.3](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-distract-merchants)，拒审 #3 | `app.plan.tsx:245–247`；`AiOrderGrowthPanel.tsx:131–139,147–159` | 宣传流程改静态，或改为商家主动触发；普通/`prefers-reduced-motion` 下等待两轮以上均不自动循环 |

## 验证与交付边界

复核期间再次通过：

```text
node scripts/verify-bfs-requirements.mjs       # 77/77 + 63/63
node scripts/verify-app-store-requirements.mjs # 173/173，20/17/6/24/106
node scripts/verify-links.mjs                  # 87 files
git diff --check
```

这四个命令证明 ISO 来源、矩阵、链接和文档格式完整；不证明 AP 已经通过 BFS。应用本地记录仍是：`typecheck/build/qa:bfs` 等通过，`lint` 和 `qa:cps` 失败；没有真实 Admin、手机端、生产、Dashboard 或 App Store listing 证据。

交付给开发时，应同时附上 [findings.md](findings.md)、[BFS 逐项账本](requirements-ledger.md)、[App Store 逐项账本](app-store-ledger.md) 和 [验证记录](verification.md)。整改后重新运行同一组官方源检查，并对 F-01/F-02/F-06/F-08 做实际页面复现；在生产和 Dashboard 证据补齐前，保持 `unverified`，不要写“BFS 已通过”。
