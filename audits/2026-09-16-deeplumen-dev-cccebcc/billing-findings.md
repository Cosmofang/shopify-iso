# dev 分支 BFS 审计：CPS 收费、计价与商家账单说明

> 文档版本：`1.1.3`
> 最后修改：`2026-09-16 09:07 UTC`
> 最后修改者：`Codex (OpenAI), root review`
> 审计对象：`deepLumendev/shopify-deeplumen-app`，`dev`，`cccebcc9c7256a40d68cd6d7cd210761221bdf88`
> 官方来源核实日：`2026-09-16`
> 本次官方来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [Setup usage charges](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/setup-usage-charges) · [Build a billing event](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/build-billing-event) · [Active subscription](https://shopify.dev/docs/api/partner/latest/active-subscription)

这是用户授权的防御性代码审计；仅在隔离检出与合成测试数据上运行。未调用真实收费接口，未连接业务数据库，未修改应用代码或外部系统。以下是当前代码缺陷及其官方要求映射；不代表真实店铺已经产生同样的错账。

## 结论及规则适用范围

发现 3 项 P1 计价/收费链路缺陷、3 项 P2 商家收费说明缺陷。[BFS 1.1.1](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#111-meet-app-store-requirements) 继承 App Store 要求；[App Store 第 1.2 节](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements#12-bill-through-the-shopify-billing-api-or-shopify-app-pricing) 概述明确要求所有 App 费用经 Shopify 且 “be free of billing related errors”，这是 B-01～B-03 的直接官方依据。1.2.2 正文具体要求接受、拒绝收费和重装后重新申请授权；本轮没有证明这三条审批路径失败，故1.2.2保留unverified，不能用其标题泛指以下计价缺陷。具体佣金比例、冻结时间与促销规则是本 App 的业务合同，不是 Shopify 统一规定；其实现与披露不一致会影响§1.2收费要求。App Store 2.1.2 是展示/功能错误的补充映射。2.1.4要求平台间同步数据一致；本轮未建立已同步字段与Shopify对应字段不一致的独立证据，因此该条保留unverified，不用内部计价/展示矛盾代替。

不要把 App Store 4.2.1 直接当成所有应用内文案的规定：它约束 App Store 列表 Pricing details。本轮未打开此 App 的线上 listing，因此 4.2.1 仍待核实。BFS 4.3.1 的具体拒审例子集中于结果承诺/推广，本报告不把所有收费文案错误强行归入该 ID。

## 已确认问题

### B-01 / P1：已提交订单的商品分类变化会重新定价，未沿用已冻结的商品与公共费率

- 官方要求：**BFS 1.1.1 → App Store §1.2**，无收费相关错误。来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)。冻结费率是本 App 明确承诺和实现设计，而非 Shopify 给所有 App 规定的收费公式。
- 主位置：`apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts:315-320`。
- 精确边界：本问题仅指**首次 `SUBMISSION_STARTED` 之后**，不是首次提交前预估更新；`obligation.server.ts:429-445` 明确区分 PHASE_TWO 与可整笔替代的 PHASE_ONE，首次提交时 2184 起冻结原快照。品类编排只在 `HANDOFF_PENDING` / `CATEGORY_READ_ONLY` / `CATEGORY_ACTIVE` 执行（`recalc-orchestrator.server.ts:69-74,258-259`），`LEGACY_ONLY` 不执行；前两态可算快照但不能正式收费，真实收费后果限定 `CATEGORY_ACTIVE`。按订单创建日找不到品类费率版本的历史订单也会在 300-301 跳过。
- 触发链：`products/update` 写工作项 → `dispatcher/fanout.server.ts:106-126` 从所有历史快照查相关订单（没有提交后排除）→ `runCategoryPricingRecalc` 读取当前 Product 分类 → 调用 `calculateCategoryPricing` 时省略 `frozenRatesByProductGid`、`inheritedPublicRate` → `commitRecalculation` 写新的 current snapshot → `ledger.server.ts:1244-1250` 采用新 snapshot target → `obligation.server.ts:881-939` 创建收费差额。
- 这两个冻结参数只在纯函数/测试里出现，生产调用方均未提供。编排读取只取 `currentPricingRevision`，未读取已经提交的快照行/公共费率；`snapshot-writer.server.ts:73-95` 也没有建立商品行继承来源。`mocks/plan.ts:241` 承诺不追溯应用费率变更，`cps/approval-copy.ts:57` 承诺退款沿用冻结费率。
- 合成复现：当前商品从原 10% 分类移到 15% 分类，商品 $100、公共金额 $10；真实编排与真实计价函数生成 `$16.50` / `publicRateBasis=SELECTED`，未读取冻结 $11.00 的原合同。DB、API 全部 mock，提交阶段仅捕获快照入参，未证明真实数据库已提交或线上实际扣费。
- 修复方向：在编排阶段识别已开始提交的订单，加载对应冻结快照及商品身份，传入冻结商品费率和公共费率并记录继承出处；新增商品才适用明确的新商品规则。对产品分类变更、删除与退款重算覆盖同一条生产编排测试。
- 验收例子：首次提交后，仅把当前商品分类从10%改为15%，上述订单目标仍为$11、公共费率标为继承，不产生额外$5.50调整义务。提交时复核快照与事实版本；退款、删除和新增商品分别按已约定合同调整。

### B-02 / P1：AI referral 与专属合同订单进入重算后均被写成 AP 品类计价

- 官方要求：**BFS 1.1.1 → App Store §1.2**，无收费相关错误。来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)。
- 主位置：`apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts:337-348`，尤其 `pricingSource: 'AP_CATEGORY'`。
- 触发链：订单/退款/改单进入 `ORDER_PRICING_RECALC` → `loadOrder`（同文件 204-227）只检查店铺/订单/卸载，既不读取 `attributionType`、`rateOrigin`，也不排除已有 `EXCLUSIVE_CONTRACT` / `AI_REFERRAL` → 全部调用品类引擎 → 快照固定 `CATEGORY_V1` / `AP_CATEGORY` → ledger 仅看 snapshot 的 `pricingMode` 选择 target，未再核对来源（1244-1250）。
- 初始资格链路确实区分 AIR 的 `airValue` 与 AP 的 `value`（`qualification.ts:331-349`），所以不是产品从来只有一种价格。专属合同也有独立 `LEGACY_FLAT` 实现（`economics/legacy-pricing.ts`），但重算编排没有调用。
- 合成复现分别提供 `AI_REFERRAL + STANDARD + 5%`、`AP_UTM + CONTRACT + 5%` 输入；两个真实编排调用都生成 `AP_CATEGORY`、`CATEGORY_V1`、15% 对应的 `$16.50`，而不是原整单 `$5.50`。实际 SQL 连这些来源字段都不读取，合成输入包含它们仍被忽略。非零 AIR 配置才直接产生此收费差额；本轮未读取线上 AIR/合同配置。
- 修复方向：在计算前确定 AP_CATEGORY / AI_REFERRAL / EXCLUSIVE_CONTRACT 来源，并维持来源优先级和既有合同限制；未知来源转待核，不默认为 AP 品类。测试应从生产编排入口覆盖三类来源。
- 验收例子：$110有效金额、5%有效合同的AI referral和专属合同订单，重算后各为$5.50并保留原来源，不变成$16.50 / AP_CATEGORY；AP品类订单仍按自己的适用规则处理。

### B-03 / P1：品类计价未完成或被阻断，旧整单目标仍可进入正式收费

- 官方要求：**BFS 1.1.1 → App Store §1.2**，无收费相关错误。来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)。
- 主位置：`apps/shopify-app/app/lib/cps/obligation.server.ts:1141-1166`（`releaseEligibility`）。
- 证据链：初始资格始终用旧 `frozen.cpsRate` 计算整单 target（`ledger.server.ts:2188-2192`）；后续读取未发现 CATEGORY_V1 快照时仍回退整单费率（1248-1250）。分类解析错误会把工作项标为 `MANUAL_REVIEW`（`dispatcher/handlers.server.ts:170-180`），但不阻断同一订单的收款释放。`releaseEligibility` 只检查付款事实、确认期、水位等，没有检查 `pricingStatus`、适用规则是否为品类、快照是否完整/最新或计价工作项是否待核。`currentReleaseAuthority` 只检查 Shopify 合同与模式（508-565），也没有品类计价就绪门。
- 具体触发：`CATEGORY_ACTIVE` 下，订单已经有完整付款/归因，商家有有效 Shopify 计费授权，但该单品类解析长期 BLOCKED 或工作项重试未完成；确认期到期且同步水位已追平时，旧整单 target 符合现有释放 SQL，系统可建立正式义务；随后补成品类快照又会建立差额。
- 已在隔离 Postgres 实证：使用独立 `cps_test_*` schema、219 条真实迁移、生产 `syncCpsAuthorization`（Shopify 响应为 mock）与 `releaseDueCpsOrders`。夹具包含 CATEGORY_ACTIVE、已生效 15% 品类表、完整付款/归因、过确认期、同步水位已追平、旧整单目标 $10、`pricingStatus=BLOCKED`、对应工作项 `MANUAL_REVIEW`、无品类快照。函数实际返回 1，数据库新增一条 **$10 / PENDING / pricingSnapshotId=null** 的 `PLATFORM_OBLIGATION`，订单计价仍 BLOCKED。没有发送任何 App Event，不能把这个结果说成线上已扣费。隔离 schema 已由 runner 清理。
- 修复方向：统一来源判定和可提交目标校验，只有明确的 legacy 订单可以 legacy fallback；应按品类计算但快照缺失/过期/阻断的订单保持不可提交。首次释放和调整释放都使用同一个原子就绪判据；已经排队但尚未首次提交的义务在提交前也须复核，避免旧队列继续穿透。
- 验收例子：上述BLOCKED/待核/无快照夹具应零新增义务、零提交事件；$100订单完成15%有效快照后只生成一次$15义务，重复执行不重复创建，不先生成旧整单$10义务。

### B-04 / P2：Plan 与 Commission 仍展示整单旧费率，无法解释实际品类费用

- 官方要求：App Store **2.1.2**；收费部分关联 **1.2**。来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)。Listing **4.2.1** 另列待核，不在此判定。
- 主位置：`apps/shopify-app/app/lib/plan-data.server.ts:64-79`；`apps/shopify-app/app/lib/commission-data.server.ts:747-751`。
- Plan 只从 `Shop.cpsRateConfig ?? policy.standardRateSchedule` 读取单个 AP 比例；从未读取实际生效的品类费率表。页面直接渲染这一百分比（`app.plan.tsx:335-349`），FAQ 宣称整个订单总额乘同一比例（`mocks/plan.ts:175-181`）。Commission 行比例仍取资格阶段冻结的旧 `order.cpsRate`，不是已提交快照的商品费率/有效混合费率。
- 数值示例：旧 AP 配置 10%，本单 $100 商品适用 15%，另有 $10 公共部分也适用 15%，真实品类目标是 $16.50；Plan 和 Commission 仍显示 10%，文案让商家预期 $11.00。即使 B-01/B-02 已修复，这种合法的品类差异仍存在。
- 代码证据已确认；线上具体费率表/配置和 Dashboard 最终费用未核实。
- 修复方向：Plan 按商家实际适用合同披露品类费率、公共部分计费及例子；Commission 使用冻结计价快照解释每条收费，区分商品金额、公共部分、免佣、汇率，不用单个历史整单比例解释品类账单。

### B-05 / P2：从未享有免佣的商家也看到“前 N 单免费”

- 官方要求：App Store **2.1.2**；收费正确性关联 **1.2**。来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)。
- 主位置：`apps/shopify-app/app/mocks/plan.ts:51-66`。此文件虽名为 mocks，但 `app.plan.tsx:401` 在生产渲染调用 `planFeatures(plan)`。
- `PlanFeatureOptions` 只接受比例与 quotaTotal，没有 `enabled`、`applies`、是否曾冻结等事实；因此无条件渲染 `First ${promotionQuotaTotal} attributed orders free`。`deriveCpsPromotionAllowance` 明确能返回 `applies=false` 且 quotaTotal=3；真实分配器在 promotion enabled=false 时不免佣（`obligation.server.ts:328-329`）。
- 合成复现：`cpsPromotionEnabled=false, quotaConfig=3, frozen=null, used=0`，allowance.applies=false，但生产文案函数仍返回 `First 3 attributed orders free`。这区别于“历史已领完但仍介绍曾有权益”：该夹具从未有过权益。
- 修复方向：按真实 applies/冻结历史/剩余名额区分展示；不存在权益时不承诺免费；已有历史但用完应明确用完状态。

### B-06 / P2：承诺所有退款自动抵扣，与跨期人工退款分支冲突

- 官方要求：App Store **2.1.2**，收费正确性关联 **1.2**；API 合同来源：[Build a billing event — Reverse or correct usage](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/build-billing-event#reverse-or-correct-usage)。
- 主位置：`apps/shopify-app/app/mocks/plan.ts:212-218` 及 `:66`。
- UI 无条件宣称 `Refunded orders auto-credited`、`We submit a reversal, and it appears as a negative line on your bill`，包含后续账期。实现中当本期可逆额度不足时，`obligation.server.ts:916-937` 明确把剩余金额写成 `MANUAL_REFUND_REQUIRED`，并不发送该部分 negative App Event；无有效授权/卸载后还可能需要单独处理。Commission 本身已有 `returned separately`、待核等分支，因此产品真实支持的是多种退款结果。
- 具体触发：上期收取 $10 佣金，本期无正向计费，买家本期退款；自动可逆额度 0，$10 进入人工退款，不能兑现 FAQ 承诺的自动负数账单行。
- 修复方向：在 Plan 说明退款会核算并退回，明确可以经 Shopify 账单冲回或人工核实单独返还，展示状态和合理处理预期。不要把对账接收状态当作已退回。

## 其他已检查与尚待核实

- 收费出口全仓搜索覆盖 `apps/` 与 `packages/`：发现 App Events 和 Shopify hosted pricing，未发现 Stripe/PayPal/另一套站外收费实现。仅可说明代码实现路线，不据此宣称线上 App Store 1.2.1 全面通过。
- `app.cps-pricing.tsx` 使用 Shopify `_top` 跳转；`app.plan.tsx` 收到 plan_handle 后触发服务端授权复核；`enrollment.server.ts` 通过 Partner activeSubscription 校验店铺、周期、meter、合同指纹，关闭/重装生命周期有单独安装/协议身份。Shopify 拒绝/接受/重装、不同角色下真实执行仍 `unverified`。
- App Events 请求只发送 shop GID、meter、时间、64 位散列 idempotency key 和字符串 value；没有买家个人信息。请求使用 Shopify client-credentials；负数值用字符串；202 仅记作 `RECEIVED_202`，另有 checkpoint aggregate 对账，没有简单当成扣费成功。API 契约已用本次官方页面核实。
- 一单多次投递通过稳定经济动作 + 目标 revision 的 SHA-256 幂等键、不可变 envelope、租约和数据库账本约束处理。没有发现需要另报的静态双收费问题；并发、崩溃、超时和数据库不变量必须补真实临时 Postgres 测试，不能以本次 mock 测试替代 `pnpm test:cps:db`。
- 卸载代码有 24 小时剩余事件窗口与账期边界；当前官方文档仍是卸载后 24 小时补报，超出拒绝。跨期、取消/冻结、人工退款闭环存在实现；真实结果 `unverified`。
- `normalizePartnerContract` 接受单个开放 VOLUME tier，未在运行时强制每单位 $1 / tier base $0，发送端则以 USD 金额直接作为 quantity。`scripts/check-cps-meter-contract.ts` 专门校验 production $1、development smoke $0。**线上 meter 单价、discount、base amount、handle、Shopify 计费实际结果仍是必须核实的部署门**；本轮未读取 Dashboard，不把可能错配置报告为已发生错账。
- `economics/recalc-orchestrator.server.ts:3,204,354` 使用全站默认 Prisma，而不是项目规定的独立 CPS worker pool；同类 economics/ledger 扫描路径也有默认池。此项是项目明确的池隔离红线/工程风险，保护 Web 请求性能，**不是 Shopify 官方要求独立 DB pool**。若纳入主报告，标为工程观察项，并用负载/池指标验证影响，不直接断言 BFS 2.2/2.3 不达标。
- BFS 4.3.7 仅适用于具体 plan-gated 功能；这里存在历史免费/覆盖名单等产品策略，不能仅凭免费商家仍能使用 app 判失败。最终需要实际套餐、可见功能与授权态矩阵。
- App 自身按订单收入收佣，不等于“为商家销售商品订阅”的 subscription app，也不等于 affiliate program。是否属于 Analytics / Ads / Sales channel 必须按实际功能和 Distribution 另判；本子审计不凭 CPS 一词增加类别要求。

## 覆盖和验证

入口与实现追踪：`app.cps-pricing.tsx`、`app.plan.tsx`、`app.commission.tsx`、`cps-onboarding.*`、`plan-data.server.ts`、`commission-data.server.ts`、`mocks/plan.ts`，CPS enrollment/qualification/payment evidence、pricing engine/source/snapshots、ledger/obligation、App Events、checkpoint reconciliation、webhook receipts/work items、product fan-out、scheduler handlers、handover、promotion、人工退款与读模型；检查相关集成测试/单元测试、CPS migrations 约束；全仓搜索外部收费/Shopify 收费出口。此为端到端代码路径审计与同类搜索，未声称逐字符人工读完每个文件。

独立合成复现保存在审计目录：`billing-repro.test.ts`、`billing-repro.config.ts`。在隔离检出的 `apps/shopify-app` 运行：

```sh
./node_modules/.bin/vitest run --config /tmp/shopify-deeplumen-bfs-20260916.4YK5eB/billing-repro.config.ts
```

2026-09-16 执行结果：**1 file / 4 tests passed**。这些是断言当前错误行为的诊断，含 B-01、B-02 两种来源、B-05，不是修复后的通过证明；模拟 DB/外部 API，实际运行生产编排、实际纯计价及文案函数。初次运行因 mock 漏导出 rateVersionCategoryKeys 出现 3 个夹具错误；补齐部分 mock 后上述结果通过，未改生产文件。

B-03 追加独立数据库复现：`billing-db-repro.test.ts`、`billing-db-repro.config.ts`。先在主审计纯合成 `127.0.0.1:65432/bfs_audit` 的独立 schema 通过；为排除与主测试套件 public trigger 函数的并发影响，又新建纯合成独立 database `bfs_billing_repro` 于 08:43 UTC 重跑通过，夹具显式拒绝其他数据库。通过仓库 `scripts/run-cps-db-tests.ts -- node node_modules/vitest/vitest.mjs run --config /tmp/shopify-deeplumen-bfs-20260916.4YK5eB/billing-db-repro.config.ts` 执行；需要把 `CPS_TEST_DATABASE_URL` 指向这一隔离数据库。两次均 **1 file / 1 test passed**（断言当前缺陷），219 migrations 应用成功，真实 DB 产生未就绪订单的平台义务，测试结束自动清理各自独立 schema。没有使用生产凭证或网络计费调用。

B-04、B-06 为静态代码/数据来源交叉验证；业务生产数据库、商家审批、App Event 是否 billable、资金结算、上线配置与 listing 仍需独立证据。主代理统一跑 lint/typecheck/build/完整测试；本子报告不代报其结果。审计应用工作树 `git status --short` 为空。
