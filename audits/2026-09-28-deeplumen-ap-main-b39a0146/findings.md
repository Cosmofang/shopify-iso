# 开发整改交接单

> 文档版本：`1.0.0`
> 最后修改：`2026-09-28 10:05 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 证据类型：`App-specific audit evidence`
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Manage webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe) · [App Design Guidelines — Marketing](https://shopify.dev/docs/apps/design/user-experience/marketing)

以下 P1/P2 是本次工程排期，不是 Shopify 官方等级。开发修复后必须重新执行 [verification.md](verification.md)，并补真实店铺/生产证据；静态修复不等于 BFS 通过。

## F-01 — P1 — BFS 4.3.3：CPS modal 在首屏自动出现

**官方依据（Official hard requirement）：** [BFS 4.3.3 — Don’t distract merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#433-dont-distract-merchants)。该条拒审原因明确包含页面加载、延迟或无关动作后自动出现 modal/popover。

**证据：**

- `deeplumen-app/app/prototype/routes/app._index.ts:158-196` 在 loader 阶段计算 `data.cpsPrompt`。
- `deeplumen-app/app/routes/app._index.tsx:119-120` 用 `Boolean(data.cpsPrompt)` 初始化 `cpsPromptOpen`。
- `deeplumen-app/app/routes/app._index.tsx:228-235` 只要 loader 返回 prompt 就挂载弹窗。
- `deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx:101-105` 传入 `open={open}` 和 `autoShow`。
- `deeplumen-app/app/components/ui.tsx:104-112` 在 `open` 为真时调用 `showOverlay()` / `shopify.modal.show(id)`。

官方 `s-modal` 的 heading/action slot 使用可满足组件使用规范，但不能修复启动时机违规。

**修改建议：** 首次披露改成首页内持久通知/卡片；只有商家点击“查看佣金方案”后才打开 `s-modal`。弹窗保留 heading、primary action slot、Esc/关闭和焦点行为。

**验收：** 新装/首次进入 Dashboard 不会出现 modal；点击卡片 CTA 后出现一次；刷新、轮询、无关操作不会自动出现；键盘和关闭路径正常；增加一个能失败的回归断言，禁止 `Boolean(data.cpsPrompt)` 直接作为初始 open。

## F-02 — P1 — BFS 4.3.1：订单、流量和推荐结果承诺

**官方依据（Official hard requirement）：** [BFS 4.3.1 — Don’t make false claims](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#431-dont-make-false-claims)。不得保证、承诺或强烈暗示商家会取得某结果。

**证据：**

- `deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx:87-98` 写入 “keep driving AI visits and Agentic Page attributed orders” 和 “Your Agentic Pages are already bringing you AI traffic and orders”。前者是未来结果暗示；后者只有在展示时有逐店、可验证归因数据才可成立。
- `deeplumen-app/app/components/plan/AiOrderGrowthPanel.tsx:14,147,172` 使用 illustrative demo series、标题 “Turn AI discovery into more orders” 和 “Illustrative upward trends”。示例数据必须和真实店铺数据严格隔离，否则会被当成产品业绩或因果证明。
- `deeplumen-app/app/mocks/ai-bot-traffic.ts:175-187` 写 “significantly increases the likelihood” 和 “The most effective way to boost...”。这是无证据的因果/最高级宣传。
- `deeplumen-app/app/routes/app.ai-traffic.tsx:284-286` 写“几天内”“1 week to start appearing in AI answers”，属于没有可验证服务级保证的时间承诺。
- `deeplumen-app/app/components/store-traffic/AiOrdersCard.tsx:138-144` 零订单仍显示 “AI orders are on the way”，把未来订单写成预期结果。

**修改建议：** 使用 capability/measurement 语言，例如“已观察到的 AI crawler visits（时间窗口）”“归因订单（归因规则）”；示例图必须显著标注 `Illustrative example — not store data`，或删除；移除 “most effective”“significantly increases”“are on the way” 和固定收录时间。

**验收：** 在无数据、零订单和新店状态下不出现未来订单/推荐保证；每个展示数字有时间窗、数据源和归因说明；全仓搜索 `on the way|most effective|significantly increases|take 1 week|more orders` 后逐项复核。

## F-03 — P1 — App Store 隐私合规 webhook 在当前 checkout 被注释

**官方依据（Official guidance/API contract，BFS 1.1.1 通过 App Store 前置要求继承）：** [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) 要求 App Store app 订阅 `customers/data_request`、`customers/redact`、`shop/redact` 并处理请求；[Manage webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe) 说明 App Store app 的 mandatory compliance topics 必须注册。

**证据：**

- `deeplumen-app/app/shopify.server.ts:10-20` 声明 `distribution: AppDistribution.AppStore`。
- `deeplumen-app/shopify.app.toml:32-51` 将 `customers/data_request`、`customers/redact`、`shop/redact` 订阅整体注释。
- 当前 checkout 只有 `webhooks.app.uninstalled.tsx` 和 `webhooks.app.scopes_update.tsx`；没有 `/webhooks/compliance` 路由。
- 文件头 `deeplumen-app/shopify.app.toml:3-18` 明确生产配置在另一个仓库，因此本结论只对当前 checkout 成立。

**修改建议：** 在真实生产仓库完成 compliance handler、TOML/Dev Dashboard 订阅、签名校验、幂等处理、删除/导出履约和交付日志；若原型必须保持 localhost 调试配置，至少在 ISO/README 中明确“不是生产配置”，并把生产仓库作为验收对象。

**验收：** 用合成商店请求验证三条 topic 均可收到并签名校验；`customers/data_request` 在官方时限内把请求数据交给商家；redact 请求覆盖数据库、队列、对象存储和外部资源；生产 Dev Dashboard 与 TOML/部署路由一致。没有这些证据时保持 `unverified`。

## F-04 — P1 — `qa:cps` 失败，测试导入不存在的导出

**证据（App-specific engineering evidence）：** `deeplumen-app/scripts/qa/cps-gate-sanity.ts:15-31` 导入 `shouldGateToPlan`；`deeplumen-app/app/lib/cps-onboarding.ts:206-245` 当前只有 `cpsGateDestination`、`shouldNudgeCps` 等导出，缺少该符号。运行 `npm run qa:cps` 失败：`No matching export ... shouldGateToPlan`。

**修改建议：** 让测试和实现使用同一公开函数契约，补回经过评审的 `shouldGateToPlan`，或把测试改为当前 `cpsGateDestination` 的等价矩阵；不要删掉测试来获得绿色。

**验收：** `npm run qa:cps` 完整通过；5 个状态 × 是否计划内 × 是否可强制的矩阵有断言；`npm run typecheck` 与 build 仍通过。

## F-05 — P1 — prototype 与 production baseline 漂移

**证据：** `npm run verify:production` 失败，报告大量 `app/components/*`、路由、`app/root.tsx`、`app/tailwind.css` 和 `app.sync.tsx` 语句超出 `production-baseline.json` 声明边界。`app/prototype/context.server.ts:5-15` 仍以 mock state 作为原型业务上下文；`app/prototype/routes/app.sync.ts:12-23` 固定返回 `result.completed: true`；`app/routes/app.sync.tsx:126-137` 也写明生产必须替换为真实任务进度。

**修改建议：** 明确一个真实送审生产仓库；若当前仓库仅原型，就把报告、CI 和开发交接都标成 prototype，不用它证明真实 BFS。若要作为 production source，必须删除 mockContext/固定完成态，补真实 Shopify API、任务队列、billing、webhook、卸载和隐私履约，并更新 baseline 作为经过评审的边界变更。

**验收：** `npm run verify:production` 通过且 baseline 的 source commit/文件边界有审查记录；真实测试店可完成安装、同步、计费、卸载和隐私请求；原型和生产代码来源不再混淆。

## F-06 — P2 — BFS 4.2.4：真实错误使用琥珀色

**官方依据（Official hard requirement）：** [BFS 4.2.4 — Helpful error messages](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#424-helpful-error-messages)。错误需清晰、可行动并使用错误语义；当前 ISO 将真实错误按官方示例保守要求为红色，warning/非错误状态保持琥珀色。

**证据：**

- `deeplumen-app/app/components/blog/BlogListSection.tsx:564-568` 的 `blogsError` 使用 `role="alert"`，但文字颜色为 `text-[#8a6116]`。
- `deeplumen-app/app/components/blog/BlogWizardForm.tsx:871-874` 同一真实加载错误也使用 `text-[#8a6116]`。

**修改建议：** 改为 Polaris/官方错误 token（例如 `critical`/错误语义），保留“无法加载分类 + 刷新重试”文案；不要把 blocked、pending、低评分或普通提示全部改红。

**验收：** 真实请求失败时邻近错误文案、错误语义和恢复动作同时出现；不会自动消失；字段错误仍就近显示；普通 warning 不被误标为 error。

## F-07 — P2 — review prompt 的 30 天重复显示需要复核

**官方依据：** [BFS 4.3.6 — Dismissible ads](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dismissible-ads) 与 [App Design Guidelines — Promotion](https://shopify.dev/docs/apps/design/user-experience/marketing#promotion) 都要求促销内容关闭后不再重复出现。当前证据不足以确定 Shopify 是否把这张 review solicitation 卡归为促销广告，因此暂列 `review`，不要直接当作已确认 BFS fail。

**证据：** `deeplumen-app/app/components/dashboard/ReviewPromptCard.tsx:15-17,69-76` 关闭后写入 `review-dismiss`，代码注释明确为“30 天静默”；服务端因此可能在 30 天后重新展示同一求评价内容。

**修改建议：** 向 Shopify reviewer/产品负责人确认分类；保守方案是关闭后永久不再显示同一内容，并由 Reviews API 的官方资格/返回码控制；至少为不同内容、不同里程碑和关闭后的再次出现写测试与产品依据。

**验收：** 关闭后在 31 天、重新安装、刷新和新里程碑场景都有明确预期；若仍复现，报告中必须有官方分类依据，不能只引用内部 PRD。

## F-08 — P2 — CI Node 版本与应用 engine 不一致

**证据：** `deeplumen-app/package.json:35-37` 要求 Node `>=24.0.0`；现有 `.github/workflows/ci.yml:19` 使用 Node `20`。这是工程一致性问题，不直接等同 BFS fail。

**修改建议：** 把既有 CI 与 release gate 统一到 Node 24，并在 lockfile/build/typecheck 验收中固定版本。

**验收：** CI、release gate、本地开发文档和实际构建使用同一 Node major；没有“本地通过、CI 用旧 Node”的分叉。
