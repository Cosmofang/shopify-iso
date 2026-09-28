# 开发整改交接单

> 文档版本：`1.1.0`
> 最后修改：`2026-09-28 10:31 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP`，`main@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 证据类型：`App-specific audit evidence`；当前仓库是前端原型，生产配置、真实业务数据和 Dev Dashboard 未核实
> 官方核实日期：`2026-09-28`
> 补充官方来源：[App Design Guidelines — Marketing](https://shopify.dev/docs/apps/design/user-experience/marketing#promotion)
> 本次官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance)

本轮确认 **4 项 BFS 设计问题**：F-01、F-02、F-06、F-08，涉及 **3 个不同 requirement ID**：4.3.1、4.3.3、4.2.4。另有 **3 项工程检查失败**：F-04、F-05、F-07，以及 **1 项生产证据缺口**：F-03。确认范围是固定提交中可达的原型行为与当前代码，不能外推为线上生产已经发生，也不能据此声称完整 BFS 通过。

P1/P2 是本次工程排期，不是 Shopify 官方等级。源码链接均固定到 main@b39a0146；已有自动检查结果见 [verification.md](verification.md)。本报告没有修改应用。Plan、Commission 是目标仓库的受保护模块，实际修复需遵守其 [AGENTS.md](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/AGENTS.md) 的模块授权边界。

## F-01 — P1 — BFS 4.3.3：符合资格的 CPS modal 在页面加载时自动出现

**状态：fail，已确认可达代码行为。** 触发条件是加入 CPS、尚未被强制授权、店铺可访问、未同步中，且状态为 no-cps 或 plan-inactive、未展示/点击/静默屏蔽。不是所有商家每次加载都会触发。

**官方依据（Official hard requirement）：** [BFS 4.3.3 — Don't distract merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-distract-merchants)，拒审原因 #1 明确包含页面加载、定时或无关动作后自动出现 modal/popover。

**固定提交证据：**

- [cps-prompt.ts:40](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/lib/cps-prompt.ts#L40) 定义资格和首次展示决策；[prototype loader:158](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/routes/app._index.ts#L158) 返回 data.cpsPrompt。
- [Dashboard:119](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app._index.tsx#L119) 用 Boolean(data.cpsPrompt) 初始化 open；[228 行](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app._index.tsx#L228) 挂载弹窗。
- [CpsAuthorizationPrompt.tsx:101](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx#L101) 传入 autoShow；[ui.tsx:104](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/ui.tsx#L104) 调用 showOverlay()。

原型复现入口：/app?cps=no-cps&cps_program=1&cps_enforce=0&cps_prompt_reset=1。该参数建立原型首次展示状态，不代表生产资格数据。

**整改建议（本次工程方案）：** 首次披露改为页面内持久通知/卡片，由商家点击查看佣金方案后再开 modal。使用官方 modal 组件不能抵消触发时机问题。

**验收：** 首次状态、刷新、轮询和无关操作不自动开窗；对应 CTA 才开窗；关闭、Esc 和焦点回归正常。现有 qa:cps-prompt / qa:cps-modal 通过只证明其覆盖的状态机与组件生命周期，不覆盖本条产品触发规则。

## F-02 — P1 — BFS 4.3.1：可达页面强烈暗示订单、流量和推荐结果

**状态：fail，可达文案已确认。** 主要依据是直接呈现的未来结果/因果表述；原型使用 mock 数据本身不作为生产造假结论。

**官方依据（Official hard requirement）：** [BFS 4.3.1 — Don't make false claims](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-make-false-claims)：不得保证、承诺或强烈暗示商家结果。

**固定提交证据：**

- [CpsAuthorizationPrompt.tsx:87](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx#L87) 写有 “keep driving AI visits and Agentic Page attributed orders”；入口标题写 “already bringing you AI traffic and orders”。后者未以非零归因订单为展示条件；[loader:182](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/routes/app._index.ts#L182) 默认没有 orders 序列。
- [app.ai-traffic.tsx:135](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.ai-traffic.tsx#L135) 常驻说明写 “the more likely your products get recommended in AI answers”。[store-traffic.ts:427](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/store-traffic.ts#L427) 写 “the AI traffic you earn today is what turns into real shoppers tomorrow”；[route:114](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.ai-traffic.tsx#L114) 实际渲染该 FAQ。
- [ai-bot-traffic.ts:177](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/ai-bot-traffic.ts#L177) 写 “significantly increases the likelihood”，[187 行](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/ai-bot-traffic.ts#L187) 写 “The most effective way”。[traffic.server.ts:97](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/traffic.server.ts#L97) 保留 FAQ，[page traffic route:394](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.pages.%24id.traffic.tsx#L394) 渲染。
- [AiOrderGrowthPanel.tsx:147](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/AiOrderGrowthPanel.tsx#L147) 写 “Turn AI discovery into more orders”；[PlanStorePanels.tsx:119](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/PlanStorePanels.tsx#L119) 写 “Bring AI orders” 和转化结果。两组件由 [app.plan.tsx:245](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.plan.tsx#L245) 挂载。增长图已经在 [166 行](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/AiOrderGrowthPanel.tsx#L166) 标注 EXAMPLE，不报告为“没有示例标识”；标题的结果暗示仍需处理。

**同类文案待联调：** [AI Traffic 空态:285](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.ai-traffic.tsx#L285) 有 “within a few days / take 1 week”；[AiOrdersCard.tsx:141](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/store-traffic/AiOrdersCard.tsx#L141) 零订单分支有 “AI orders are on the way”。当前订单 mock 固定 [47 单](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/store-traffic.ts#L460)，未验证零订单真实入口，不把条件分支单独计为已复现问题。FAQ 的 [“real-time”](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/store-traffic.ts#L442) 另需核对生产时效，当前保持 unverified。

**整改建议：** 使用实际能力与观测结果描述功能；去掉必然订单/推荐增长、最高级和固定收录时间。具备店铺、时间窗、归因证据时才陈述已发生结果；示例继续明确标识。

**验收：** 可达页面及空态、零订单、无归因数据状态均无结果保证；数字、时效与归因说明有真实来源。搜索是发现手段，最终需核实命中上下文。

## F-03 — P1 — 生产隐私 webhook 证据不足

**状态：unverified，不计入已确认 BFS 设计问题。** 原型缺少配置不能证明另一个生产 App 没有履约。

**官方依据（Official hard requirement / API contract）：** [BFS 1.1.1 — Meet App Store requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#meet-app-store-requirements)；[Privacy law compliance — Mandatory compliance webhooks](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#mandatory-compliance-webhooks) 要求 App Store apps 订阅并验证 customers/data_request、customers/redact、shop/redact，包括无效 HMAC 返回 401，以及按规定完成请求。该指南没有独立 BFS 编号，不杜撰编号。

**固定提交证据：** [shopify.server.ts:18](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/shopify.server.ts#L18) 使用 App Store distribution；[shopify.app.toml:35](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/shopify.app.toml#L35) 注释本地 webhook 订阅，49–51 行包含三个 compliance topics。[文件头:3](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/shopify.app.toml#L3) 已明确当前是前端原型、生产在别处、不部署此配置。

**需要的证据：** 对正确生产 App 的已部署配置、订阅、handler、接收记录与数据履约结果做只读核实。后续测试属于用户自有 App 的授权防御验证，使用合成店铺/客户数据；本轮未发起线上 webhook 或修改生产数据。

**验收：** 三条 topic 有实际订阅及接收证据，无效 HMAC 被拒绝；数据请求和删除在官方时限内完成，法定保留例外另行记录。仅手动触发 webhook 不证明订阅正确，官方指南对此有明确说明。缺证据时保留 unverified。

## F-04 — P1 — 工程检查：qa:cps 导入不存在的导出

**状态：工程 fail，不直接等同 BFS fail。** 本轮已有执行结果见 [verification.md](verification.md)。

**固定提交证据（App-specific engineering evidence）：** [cps-gate-sanity.ts:15](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/scripts/qa/cps-gate-sanity.ts#L15) 导入 shouldGateToPlan；当前 [cps-onboarding.ts:206](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/lib/cps-onboarding.ts#L206) 接口为 cpsGateDestination，不存在前者。npm run qa:cps 报 No matching export ... shouldGateToPlan。

**整改建议：** 按当前经确认的路由/授权产品契约修复测试与实现接口漂移；可迁移断言，但不能只删失败断言，也不能为旧测试恢复已废弃锁门行为。

**验收：** qa:cps 完整通过，覆盖实际同步、授权、豁免和返回路径；typecheck/build 不回退。通过后仍需真实 Shopify 授权证据。

## F-05 — P2 — 工程检查：production baseline 未覆盖后续有意 UI 变更

**状态：工程 fail / 边界待更新，不直接等同 BFS fail。** 原型与历史基线不同，不代表新 UI 应恢复成旧 UI。本次准备的发布门禁将此检查作为 CI 警告和日志诊断，不作为发布阻断；实际执行结果仍保留 FAIL，不改写为 PASS。F-04 的 qa:cps 和 F-07 的 lint 错误仍是阻断项，门禁配置状态见 [verification.md](verification.md)。

**固定提交证据（App-specific engineering evidence）：** [verify-baseline.cjs:14](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/scripts/prototype/verify-baseline.cjs#L14) 对 exact 文件和 route declarations 做哈希比对；本轮 verify:production 报大量边界外变化。该脚本检查 [production-baseline.json](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/production-baseline.json) 的约定，不是 Shopify 官方 UI 规则。

生产等价性还受 mock 边界限制：[context.server.ts:5](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/context.server.ts#L5) 使用原型 CPS 状态，[prototype app.sync.ts:12](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/routes/app.sync.ts#L12) 返回固定完成态；[app.sync.tsx:263](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.sync.tsx#L263) 明确进度来自 elapsed time、生产应替换真实任务进度。这些是原型证据，不证明生产同步成功。

**整改建议：** 审核 diff，区分有意 UI 迭代、意外业务漂移和允许的 mock adapter。对有意变化更新版本化基线、边界与验证记录，保留业务隔离断言；不强制回滚新 UI，也不要求把前端原型改造成生产后端。

**验收：** 新基线变化有来源与审查记录，verify:production 按新约定通过；明确它只证明声明的原型边界。安装、计费、同步与隐私流程在正确生产仓库/测试店单独验证。

## F-06 — P2 — BFS 4.2.4：可达诊断失败信息使用非红色

**状态：fail，已确认可达错误态。**

**官方依据（Official hard requirement）：** [BFS 4.2.4 — Helpful error messages](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#helpful-error-messages)，拒审原因 #2 原文是 **“An error message appears in a color other than red.”** 这是官方明文，不能降格为 ISO 保守基线。

**固定提交证据：** [prototype/pages.server.ts:101](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/pages.server.ts#L101) 的 preview=failed 或失败页面产生 failure signal；[diagnosis route:393](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.pages.%24id.diagnosis.tsx#L393) 挂载 DiagnosisErrorState。[265 行](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.pages.%24id.diagnosis.tsx#L265) “Diagnosis failed” 为 #1a1a1a，266–267 行失败原因是 #6d7175。相邻红色图标没有改变错误文字颜色。

**同类未接入分支：** [BlogListSection.tsx:564](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/blog/BlogListSection.tsx#L564) 与 [BlogWizardForm.tsx:871](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/blog/BlogWizardForm.tsx#L871) 分类加载失败文案为琥珀色 #8a6116。但 [blog.loader.ts:260](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/blog.loader.ts#L260) 和 [761 行](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/blog.loader.ts#L761) 固定 blogsError: false，另两个返回分支亦为 false；仅列将来联调修复点，不单独计为当前可达问题。

**整改建议：** 真实错误标题和错误文案使用红色错误语义，保留重试动作。普通 warning、pending、低评分和非错误阻塞状态不作全局改红。

**验收：** 诊断失败及分类请求失败 fixture 中错误文案为红色、可恢复且不自动消失；普通提示没有误用错误语义。

## F-07 — P2 — 工程检查：lint 存在 2 个错误

**状态：工程 fail，不直接等同 BFS fail。** 本轮 npm run lint 有 2 个 severity-2 错误和 4 个 Hook warnings，未把 warning 计为新增错误；结果见 [verification.md](verification.md)。

**固定提交证据（App-specific engineering evidence）：**

- [commission.ts:901](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/lib/commission.ts#L901)：statusKey 的 _cfg 参数未使用。
- [app.commission.tsx:449](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.commission.tsx#L449)：CSV 字符串包含 literal BOM，触发非标准空白规则。

**整改建议：** Commission 获准修改后，按调用契约处理未使用参数；必要的 CSV BOM 写为显式 \uFEFF 转义，保留编码语义，不能直接删 BOM 导致 Excel 乱码。

**验收：** lint 无错误，CSV 仍以 UTF-8 BOM 起始且内容一致；4 个 Hook warnings 另行评估。工程门禁通过不替代 BFS 人工评审。

## F-08 — P2 — BFS 4.3.3：Plan 宣传流程在加载后持续循环动画

**状态：fail，已确认可达代码行为；实际视觉强度仍需页面复核。** 只基于可达的宣传动画，不把所有 animation 或所有入场效果判为违规。

**官方依据（Official hard requirement）：** [BFS 4.3.3 — Don't distract merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-distract-merchants)，拒审原因 #3 是与商家动作无关、用于吸引注意的动画。

**固定提交证据：** [app.plan.tsx:247](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.plan.tsx#L247) 无条件挂载 AiOrderGrowthPanel；[AiOrderGrowthPanel.tsx:134](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/AiOrderGrowthPanel.tsx#L134) 挂载后每 3200ms 循环 activeStep，没有用户开始/停止动作。[149 行](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/AiOrderGrowthPanel.tsx#L149) 将 active class 加到宣传步骤；[plan-hero.css:1353](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/public/plan-hero.css#L1353) 使用透明度、水平位移和阴影过渡。内容是增长宣传，不是实际任务进度。

**已排除的误报：** 5 秒 hero 轮播和大量旧 Health/SEO infinite 样式的宿主已从 [Plan 组成:249](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.plan.tsx#L249) 移除；[hero-runtime.ts:26](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/hero-runtime.ts#L26) 找不到宿主即退出，不能只凭 infinite 关键词认定仍显示。AI Traffic 的 [CoverageIngestAnimation.tsx:150](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/store-traffic/CoverageIngestAnimation.tsx#L150) 有 15 秒停止条件，不能写成无限循环；15 秒内停止也不是官方 BFS 豁免规则。

**整改建议：** Plan 获准修改后，宣传步骤改为静态说明或商家主动操作展示，取消自动循环。prefers-reduced-motion 支持不能免除普通偏好下的干扰问题。

**验收：** 普通与 reduced-motion 两种偏好下，进入 Plan 后等待超过两轮原周期，步骤均不自行循环；实际交互仍有必要反馈。

## 不计入当前 fail 的修正说明

### Review prompt 尚未接入当前原型 loader

旧版把注释中的“30 天静默”推断为会再次显示，现撤回。当前 [Dashboard:17](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app._index.tsx#L17) 使用 prototype loader；[buildDashboardData:425](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/dashboard.loader.ts#L425) 不设置 reviewPrompt，prototype loader 也未赋值；[Dashboard:267](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app._index.tsx#L267) 仅在非空时挂载。当前仓库没有注释所指的 review-prompt.server.ts，不能继承另一仓库的服务端行为。

官方 [Marketing — Promotion](https://shopify.dev/docs/apps/design/user-experience/marketing#promotion) 已明确把 “requests to rate the app” 列为 promotional messages，并要求同一用户关闭后不再显示。因此分类不是未知项；未知的是当前未接通代码以后的实际展示和关闭行为。以后接入时按 [BFS 4.3.3](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-distract-merchants) 核对触发时机，并按 [BFS 4.3.6](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dismissible-ads) 和 Marketing 指南验证永久关闭语义。本轮不对不可达功能出具通过或失败结论。

## 开发跟踪

| 交接项 | 负责人 | 修复或补证 PR | 当前状态 |
|---|---|---|---|
| F-01 首次自动弹窗 | 待分配 | 待填写 | 待整改 |
| F-02 结果承诺文案 | 待分配 | 待填写 | 待整改 |
| F-03 生产隐私证据 | 待分配 | 待填写 | 待补证 |
| F-04 CPS 测试接口 | 待分配 | 待填写 | 待整改 |
| F-05 生产快照边界 | 待分配 | 待填写 | 待审查 |
| F-06 错误文字颜色 | 待分配 | 待填写 | 待整改 |
| F-07 lint 错误 | 待分配 | 待填写 | 待整改 |
| F-08 Plan 自动动画 | 待分配 | 待填写 | 待整改 |

### Node 20 原型检查不等于 Node 24 应用运行冲突

旧版“CI Node 20 与应用 >=24 必然冲突”的结论撤回。[ci.yml:19](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/.github/workflows/ci.yml#L19) 使用 Node 20，但仅检查 prototype_pages/app.js 语法和页面引用，没有安装/构建 [要求 Node >=24 的应用](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/package.json#L35)。不同任务使用不同 Node major 不能单独证明失败；真正构建应用的门禁应满足该应用 engine，并以执行结果为准。

## 本次复核记录

- 修订只影响本报告，未改目标 App、生产配置或保护模块。
- 引用文件已逐一核对，审计工作树与 main@b39a0146 的这些应用文件无差异；不把后续发布治理提交当作 main 现有配置。
- 本报告 55 个固定提交源码链接、37 个不同文件均已检查存在性和引用行号；F-01 至 F-08 无重复，官方 requirement anchors 没有数字前缀。
- 重新打开官方 BFS 原文核实 4.3.1、4.3.3、4.3.6、4.2.4，并重新打开隐私合规指南。
- 复用本轮已保存的应用检查结果，没有为文档修订重复应用 QA；来源指纹、全仓链接与 diff 检查由主审计统一执行并写入 [verification.md](verification.md)。
