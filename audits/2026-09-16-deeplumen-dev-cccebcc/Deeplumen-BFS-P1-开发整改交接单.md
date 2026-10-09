# Deeplumen BFS：5 项 P1 开发整改交接单

> 文档版本：`1.0.0`
> 最后修改：`2026-09-16 09:19 UTC`
> 最后修改者：`Codex (OpenAI)`
> 官方来源核实日：`2026-09-16`，本次已重新打开正文核实
> 审计仓库：[deepLumendev/shopify-deeplumen-app](https://github.com/deepLumendev/shopify-deeplumen-app)
> 审计基线：`dev@cccebcc9c7256a40d68cd6d7cd210761221bdf88`
> 文档状态：`待开发认领；5 项尚未整改验收`
> 证据分类：`App-specific evidence`；修复建议与验收用例属于本项目工程方案
> 本次官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens)

## 交接范围与结论

请开发按下列 5 个 ID 实施整改，提交修复代码、回归测试和对应验收证据。本文可单独转交开发；代码链接均固定到审计提交，行号不会随 `dev` 更新漂移。开发开始前应比对当前分支，已经修复的项目用新提交与测试证据关闭，不重复实施。

P1 是本次工程整改优先级，不是 Shopify 官方评级。5 项缺陷不等于 5 条独立 BFS 条款：前三项由 BFS 继承 App Store 的无计费错误要求；卸载问题直接对应 BFS；数据请求涉及 Shopify 强制隐私要求。修完这 5 项不代表整体通过 BFS，其他审计问题、真实店铺流程和 Dashboard 指标仍需独立验收。

本次是用户所有仓库的授权防御性工程审计。已执行的复现只使用本地隔离仓库与合成数据；没有调用真实收费、连接业务数据库或修改应用代码。计费问题未证明线上已经错扣。卸载和隐私问题有源码/流程证据，真实店铺结果尚未验证。后续本地回归继续使用合成夹具；真实流程在获授权测试店验证。

### 任务总表

| ID | 问题 | 官方依据 | 建议认领角色 | 当前状态 |
|---|---|---|---|---|
| B-01 | 首次提交后，重算没有继承冻结费率 | BFS 1.1.1 → App Store §1.2 | Billing 后端 | fail；待整改 |
| B-02 | AI referral／专属合同被改为 AP 品类计价 | BFS 1.1.1 → App Store §1.2 | Billing 后端 | fail；待整改 |
| B-03 | 品类计价 BLOCKED、无快照，仍生成收费义务 | BFS 1.1.1 → App Store §1.2 | Billing 后端 | fail；待整改 |
| PLATFORM-01 | 卸载后使用已撤销权限恢复主题 | BFS 3.2.1；Token 撤销契约 | Shopify 集成后端 | fail；待整改 |
| PLATFORM-02 | 客户数据请求只统计/记日志，没有履约流程 | Mandatory privacy；BFS 1.1.1 基础合规 | 后端＋隐私履约负责人 | fail；待整改 |

建议 Billing 同一负责人统筹 B-01～B-03，统一计价来源、冻结快照与可收费状态，避免三个补丁使用不同判断。PLATFORM-01、PLATFORM-02 可以独立并行。

## 官方依据与适用边界

### S1：BFS 1.1.1 — Meet App Store requirements

官方原文：

> The app needs to continue to meet the requirements for distributing apps on the Shopify App Store.
>
> Your app will be audited for these requirements when you apply for Built for Shopify status.

含义：App 必须持续满足 App Store 要求，申请 BFS 时会复核。来源：[BFS 1.1.1](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#111-meet-app-store-requirements)，2026-09-16 核实。分类：**官方硬要求**。

### S2：App Store §1.2 — 收费不得存在错误

官方原文：

> Your app must use Shopify App Pricing or the Shopify Billing API for all app charges and be free of billing related errors.

来源：[App Store 第 1.2 节](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements#12-bill-through-the-shopify-billing-api-or-shopify-app-pricing)，2026-09-16 核实。分类：**官方硬要求**。

B-01～B-03 的主依据是此章节级要求。冻结时点、佣金比例、来源优先级和具体算法来自 Deeplumen 的有效合同、页面承诺及实现设计，不是 Shopify 统一制定的 CPS 公式。

不要把 **1.2.2** 写成冻结费率或品类计价条款：其正文具体要求接受、拒绝收费及重装后重新申请授权。本轮未证明这些审批路径失败，仍属 `unverified`。也不要用 **2.1.4** 的跨平台同步要求替代内部计价证据。

### S3：BFS 3.2.1 — Provide a clean uninstallation process

官方说明 Theme App Extensions 与主题集成，并明确：

> When merchants uninstall apps, blocks that are associated with the apps are automatically and entirely removed from online store themes.

来源：[BFS 3.2.1](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#321-provide-a-clean-uninstallation-process)，2026-09-16 核实。分类：**官方硬要求**。

[BFS 3.2.2](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#322-doesnt-use-the-asset-api-to-create-modify-or-delete-files) 存在 SEO 等直接编辑主题的例外；因此本文没有把“SEO App 修改主题”本身判成缺陷。主题写入审批与卸载是否干净是两个独立检查项。

### S4：卸载撤销 Token

官方 Token revocation 原文：

> A merchant uninstalling your app, or you revoking the client secret, ends all of a token's access. Requests then return `401` ...

来源：[Access tokens — Refresh, rotation, and revocation](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens#refresh-rotation-and-revocation)，2026-09-16 核实。分类：**官方 API 契约**。

### S5：客户数据请求必须履约

官方 `customers/data_request` 说明：

> The webhook contains the resource IDs of the customer data that you need to provide to the store owner directly.

官方响应要求：

> Complete the action within 30 days of receiving the request.

来源：[customers/data_request](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request)、[Respond to compliance webhooks](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#respond-to-compliance-webhooks)，2026-09-16 核实。分类：**官方强制隐私要求**。

返回 `200` 表示确认收到；完成交付是另一件事。官方未要求同步自动导出，可采用可追踪的人工履约。这里没有虚构 BFS 的独立“导出按钮”条款。

## B-01：已提交订单重算未继承冻结费率

**规则映射：S1＋S2。建议负责人：Billing 后端。**

### 证据与触发条件

主位置：[recalc-orchestrator.server.ts:315](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts#L315)。调用 `calculateCategoryPricing` 时未传 `frozenRatesByProductGid`、`inheritedPublicRate`，编排也未加载对应的已提交冻结费率。

业务承诺证据：[mocks/plan.ts:241](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/mocks/plan.ts#L241) 的不追溯费率变更说明，以及 [approval-copy.ts:57](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/approval-copy.ts#L57) 的退款冻结费率说明。这是 **App 合同/文案证据**。

触发路径：商品分类变更 → 历史订单重算任务 → 读取商品当前分类 → 用当前费率生成新快照 → 账本采用新目标 → 可能生成收费差额。

精确边界是首次 `SUBMISSION_STARTED` **之后**；首次提交前的预估更新不一律禁止。正式收费风险限定 `CATEGORY_ACTIVE` 与适用品类订单；`LEGACY_ONLY` 不执行此品类编排，其他只读/交接状态不能直接视为已收费。

现有合成复现：商品金额 $100、公共金额 $10，首次提交冻结 10%，原目标 $11；商品当前分类费率改为 15%，真实编排与计价函数算出 $16.50。DB/Shopify I/O 为 mock，未证明线上扣款。

### 修改建议（本项目工程方案）

1. 在编排入口识别是否已经开始首次提交，读取该阶段对应的冻结快照。
2. 按稳定商品身份继承既有商品费率，继承公共费率，并保存继承来源。
3. 缺少冻结依据时进入待核，不能静默采用当前费率。新增商品使用明确的有效合同规则；不要由开发临时猜定。
4. 提交时复核事实/快照版本，覆盖重算与首次提交的竞争条件。已提交义务与历史快照保留可追溯性，合法差额走现有调整流程。
5. 同类排查覆盖商品更新 fan-out、退款、改单、快照写入、账本目标和调整义务入口。

### 验收用例

- [ ] **B-01-T1**：上述 $110／10% 冻结订单，仅把商品当前分类改为15%，重算仍为 **$11**，公共费率标记为继承，不生成额外 $5.50 调整义务。
- [ ] **B-01-T2**：首次提交前更新预估仍符合合同；不把所有预估永远锁死。
- [ ] **B-01-T3**：部分退款、删除原商品、商品身份缺失、新增商品分别有确定结果；既有商品费率不被改写。
- [ ] **B-01-T4**：并发重算/首次提交、重复任务不改写已提交经济事实，不重复生成差额。

**关闭证据：** 修复提交＋生产编排入口回归测试＋独立数据库中的快照/义务断言。只测试纯计价函数不足以关闭调用方遗漏。

## B-02：AI referral／专属合同重算被固定写为 AP 品类

**规则映射：S1＋S2。建议负责人：Billing 后端。**

### 证据与触发条件

主位置：[recalc-orchestrator.server.ts:344](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts#L344) 固定 `pricingSource: 'AP_CATEGORY'`；[loadOrder:204](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts#L204) 未读取 `attributionType`、`rateOrigin` 等来源事实。

订单/退款/改单进入重算后，来源没有被正确分流。初始资格有 AIR 与 AP 的费率区别，专属合同也有独立计算实现；重算却统一使用品类引擎并记录 AP 来源。

现有合成复现：分别输入 AI referral 和专属合同，金额 $110、有效整单费率5%，当前 AP 品类费率15%；两者都变为 **$16.50 / AP_CATEGORY**，而非 $5.50。非零 AIR 配置才直接对应该金额差异，线上具体配置未读取。

### 修改建议（本项目工程方案）

1. 加载归因、来源、有效合同身份和冻结条款，在调用计价引擎前确定来源。
2. AP 品类、AI referral、专属合同分别使用有效合同对应的计算路径，快照记录真实来源。
3. 来源重叠时以有依据的现有合同优先级处理；合同未明确时记录待决事项，不自行发明优先级。未知/冲突来源进入待核。
4. 明确合法 `0%` 与缺失费率的区别，保留已有合同适用的上限和历史 legacy 规则。
5. 同类排查覆盖初始资格、重算、退款、账本目标选择和账单展示使用的来源字段。

### 验收用例

- [ ] **B-02-T1**：AI referral，$110、5%有效合同，重算仍 **$5.50**，来源保持 `AI_REFERRAL`。
- [ ] **B-02-T2**：专属合同，同样输入仍 **$5.50**，来源保持 `EXCLUSIVE_CONTRACT`；另覆盖合同上限。
- [ ] **B-02-T3**：AIR 合法0%得到合同约定的0收费；缺失费率进入待核，二者不能混同。
- [ ] **B-02-T4**：普通 AP 品类和明确 legacy 对照订单仍正确；未知/冲突来源不静默转 AP。
- [ ] **B-02-T5**：退款、改单、重复/并发重算后来源与合同保持一致。

**关闭证据：** 修复提交＋来源判定规则及业务依据＋从生产编排入口执行的参数化测试与快照结果。

## B-03：品类计价被阻断仍生成收费义务

**规则映射：S1＋S2。建议负责人：Billing 后端。**

### 证据与触发条件

主位置：[obligation.server.ts:1141](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/obligation.server.ts#L1141) 的 `releaseEligibility` 未检查品类计价是否就绪；[ledger.server.ts:1244](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/ledger.server.ts#L1244) 在缺少品类快照时回退旧整单目标。[currentReleaseAuthority:508](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/obligation.server.ts#L508) 只校验 Shopify 合同/模式，不能替代订单计价就绪检查。

已在独立 PostgreSQL 中复现：`CATEGORY_ACTIVE`、已生效15%品类表、完整付款/归因、有效计费授权、过确认期且同步水位追平；订单 `pricingStatus=BLOCKED`、工作项 `MANUAL_REVIEW`、没有品类快照，仍创建 **$10 / PENDING / pricingSnapshotId=null** 的 `PLATFORM_OBLIGATION`。订单计价状态仍为 BLOCKED。

这是实际数据库中的待提交义务证据；没有发送 App Event，也没有证明 Shopify 实际扣费。

### 修改建议（本项目工程方案）

1. 建立共用的“可收费目标”判定：来源已确定，合同有效，所需快照完整、最新并对应当前事实。
2. 应走品类计价但处于 BLOCKED、待核、无快照或快照过期的订单不得释放；只有明确 legacy 订单允许 legacy 路径。
3. 首次释放、调整释放、已排队但尚未首次提交的义务都应用该判定；在事务内复核版本，避免检查后状态已改变。
4. 缺陷修复后检查历史待提交队列是否需要重新核验。已发送或结果未知的义务保留原身份，按对账事实处理，不能直接删除记录或换幂等键重发。
5. 同类排查包括自动释放、手工触发/补跑、重试、调整和最终发送入口。

### 验收用例

- [ ] **B-03-T1**：上述 BLOCKED／MANUAL_REVIEW／无快照场景，**零新增收费义务、零提交事件**。
- [ ] **B-03-T2**：$100订单完成15%有效快照后，仅创建一次 **$15** 义务；不能先创建旧整单 $10 义务。
- [ ] **B-03-T3**：快照缺失、过期、事实版本不匹配分别阻断；计价恢复后可继续处理。
- [ ] **B-03-T4**：旧队列中尚未首次提交的项目不能绕过门禁；已发送/结果未知项目不因修复产生重复收费动作。
- [ ] **B-03-T5**：并发释放/重算、重复执行保持幂等；明确 legacy 正常订单不被误拦。

**关闭证据：** 修复提交＋独立数据库回归（包含队列/事务行为）＋发送入口零调用断言＋恢复后唯一义务断言。不能仅修改查询或加一条状态判断后就认定关闭。

## PLATFORM-01：卸载后的主题恢复依赖已撤销权限

**规则映射：S3＋S4。建议负责人：Shopify 集成后端。**

### 证据与触发条件

主位置：[webhooks.app.uninstalled.tsx:316](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/routes/webhooks.app.uninstalled.tsx#L316)；同文件382附近存在同类恢复路径。收到卸载事件后才创建 Admin client 并调用 `restoreCanonicalInLayoutTheme`，恢复函数仍需 Admin GraphQL。

部署场景中，[canonical-injector.server.ts:575](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/canonical-injector.server.ts#L575) 根据 `deeplumen.ap_deployed` 将 canonical 改为 `/a/shop/...`。该标记使用商家所有的命名空间，不能假定卸载后会自动清理。

卸载撤销 API 权限后，恢复请求可能返回401；主题可能保留指向失效 App Proxy 的 canonical，以及相关注入内容。现有模拟测试允许卸载后 Admin client 成功，不能证明真实卸载能恢复。

### 修改建议（本项目工程方案）

1. 先列出此功能写入的主题内容、标记及依赖，设计卸载时无需 Admin API 的自动移除或安全回落路径。
2. 能表达该功能的部分优先使用 Theme App Extension；SEO 例外下必须直接修改主题的部分，先核实平台支持的卸载安全机制并在测试店验证。本文未指定一个已经验证可行的具体替代实现。
3. 不把重试401、延迟删除本地Session、增加卸载前“恢复”按钮作为完成方案；它们不能覆盖商家直接卸载。
4. 覆盖已安装旧版本留下的注入状态，说明迁移与回滚办法。相同卸载权限依赖也排查 canonical、llms 等主题恢复路径。

### 验收用例

- [ ] **PLATFORM-01-T1**：本地模拟卸载后所有 Admin 调用401，代码不再将依赖这些调用的操作视为成功恢复。
- [ ] **PLATFORM-01-T2**：获授权测试店安装→部署，确认部署标记为真→直接从 Shopify 后台卸载，**不先点击 App 内恢复按钮**。
- [ ] **PLATFORM-01-T3**：卸载后检查商品、集合、文章页面 HTML：canonical 正常或按已批准方案安全回落，不依赖已失效 `/a/shop/...`；记录其他注入内容的清理结果。
- [ ] **PLATFORM-01-T4**：默认配置、曾部署后停用、重装和旧版本迁移均有证据；商家自己的主题改动不被覆盖。

**关闭证据：** 修复提交＋方案所依据的当前官方机制链接＋获授权测试店完整操作录像/步骤＋安装前后/卸载后HTML差异。仅通过401模拟测试只能完成本地回归，真实卸载证据仍记 `unverified`。

## PLATFORM-02：客户数据请求缺少交付履约

**规则映射：S5；BFS 1.1.1 的基础合规背景见 S1。建议负责人：后端＋隐私履约负责人。**

### 证据与触发条件

主位置：[compliance-handlers.server.ts:89](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/compliance-handlers.server.ts#L89)。`customers/data_request` 处理只统计匹配订单数量、写审计日志并返回，没有读取数据用于交付，也没有持久化后续履约任务和资源清单。

文档证据：[gdpr-compliance.md:85](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/docs/gdpr-compliance.md#L85) 及287附近称无需导出。但系统保留订单ID、金额、时间、付款/退款和旅程等关联数据，handler自身也承认属于假名化个人数据；因此不能用“不存客户姓名”推导“不需要履约”。

本条针对仓库实现与声明的流程。如果团队已有独立人工履约，应补充负责人、请求登记、资源映射、时限和交付证据，再重新评估缺口；不能仅口头声明已有人工流程。

### 修改建议（本项目工程方案）

1. 接收后持久化店铺、请求标识、资源清单、收到时间、30天截止时间、状态与负责人；资源数据存入受控位置。
2. 建立自动或人工处理流程，按请求范围提取当前保留的数据并安全提供给商家；记录完成时间与交付凭据。
3. 区分已接收、处理中、交付失败、已完成等状态。重复webhook幂等；数据库或交付失败可追踪、重试，不能当作已完成。
4. 普通日志只记录必要的状态/数量/引用，不写完整客户数据或导出正文；确保店铺隔离与接收方身份核验。
5. 修正文档的“无须导出”“不请求read_orders”等过时陈述；同步核实数据清单。`shop/redact` 的卸载后48小时发送时点与收到请求后30天履约期限必须区分（官方依据见 S5）。

### 验收用例

- [ ] **PLATFORM-02-T1**：含合成现存订单的有效数据请求，从接收到交付有完整记录，导出覆盖请求范围内实际保留的数据。
- [ ] **PLATFORM-02-T2**：重复请求不丢失状态或重复创建履约；零命中请求也有真实处理结论。
- [ ] **PLATFORM-02-T3**：数据库失败、导出失败、交付失败均可恢复，不提前标记完成。
- [ ] **PLATFORM-02-T4**：跨店资源不会混入导出；导出不出现在普通日志，交付给正确商家。
- [ ] **PLATFORM-02-T5**：自动或人工负责人有期限跟踪，能证明在收到请求后30天内完成；200回执不被当作完成证据。

**关闭证据：** 修复提交或经验证的人工流程＋数据字段清单＋合成请求的全链路履约记录＋更新后的操作文档。

## 共用回归与交付要求

以下是保护 S1～S5 的**本项目工程验收要求**，不是声称 Shopify 指定了某套测试工具。

1. 每个修复保留对应缺陷ID、官方URL/核实日和基线SHA。实现前重新核实涉及的新API或卸载机制，不把这份交接单当作永不过期的API合同。
2. 先跑上述定向测试，再执行仓库的 `pnpm lint`、`pnpm typecheck`、`pnpm build`、商家App测试。计费变更追加合成隔离数据库的 `pnpm --filter @deeplumen/shopify-app test:cps:db`。
3. 现有诊断测试的 passed 表示“缺陷成功复现”，**不是已修复**。整改后应新增/修改正确行为断言，并保留修复前后证据。
4. 修复与历史数据处理分开记录。历史待提交/已提交义务、旧主题注入和既有隐私请求各自列出影响范围与处理结果；本报告未授权执行生产资金调整或真实数据操作。
5. 提交修复PR时写明问题ID、行为变化、业务规则依据、测试命令/结果、迁移/回滚影响、仍待补充的真实环境证据。
6. 单测和构建通过只证明对应代码范围；真实收费授权/账单、卸载和隐私交付等需要相应运行证据。五项关闭后仍需继续整体BFS审核台账。

### 开发回填表

| ID | 负责人 | 修复 PR／commit | 自动化证据 | 真实环境／履约证据 | 复核结论与日期 |
|---|---|---|---|---|---|
| B-01 | 待认领 | 待补 | 待补 | 待补或说明适用范围 | 待复核 |
| B-02 | 待认领 | 待补 | 待补 | 待补或说明适用范围 | 待复核 |
| B-03 | 待认领 | 待补 | 待补 | 待补或说明适用范围 | 待复核 |
| PLATFORM-01 | 待认领 | 待补 | 待补 | 直接卸载证据必补 | 待复核 |
| PLATFORM-02 | 待认领 | 待补 | 待补 | 履约证据必补 | 待复核 |

## 原审计证据索引

本文包含开发必需的信息；需要深入追踪时，查看同目录文件：

- [收费细审](billing-findings.md)：调用链、适用模式和复现边界。
- [平台/隐私细审](platform-findings.md)：卸载、权限和数据请求证据。
- [执行验证记录](verification.md)：隔离环境、测试结果与未验证项。
- [逐项审核台账](requirements-ledger.md)：完整审计状态。
- [计费合成诊断源码](evidence/billing-repro.test.ts)、[计费数据库诊断源码](evidence/billing-db-repro.test.ts)：原始复现夹具，**需适配当前检出路径和隔离数据库后运行**；不能直接在生产执行。

## 文档维护硬规则

任何人或Agent修改本文时，必须同步更新顶部版本号、修改时间（带时区）、最后修改者和本次官方来源；修改官方结论前必须打开当前官方正文核实。新增规则须在附近标注官方链接，工程建议须明确是项目方案。状态只有在对应证据齐全后才能关闭，未验证项保持 `unverified`。

| 版本 | 修改时间 | 修改者 | 内容 |
|---|---|---|---|
| 1.0.0 | 2026-09-16 09:19 UTC | Codex (OpenAI) | 汇总5项P1的官方依据、固定提交证据、修改边界、验收用例与回填表；未实施应用整改。 |
