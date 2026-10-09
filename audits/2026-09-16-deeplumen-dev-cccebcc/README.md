# Deeplumen dev 分支 BFS 全仓代码审计

> 文档版本：`1.0.2`
> 最后修改：`2026-09-16 09:07 UTC`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：[deepLumendev/shopify-deeplumen-app](https://github.com/deepLumendev/shopify-deeplumen-app)，`dev@cccebcc9c7256a40d68cd6d7cd210761221bdf88`
> 官方来源核实日：`2026-09-16`
> 本次官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens) · [App Pricing billing events](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/build-billing-event) · [Marketing](https://shopify.dev/docs/apps/design/user-experience/marketing) · [Accessibility](https://shopify.dev/docs/apps/build/accessibility)

## 审核结论

**当前提交不建议直接用于 BFS 提审：确认 5 项 P1 和 10 项 P2 规范/功能问题，另有 1 项 P2 官方可访问性指导问题。** 这是代码审计结论，不是 Shopify 审核决定，也不表示线上已实际发生错账。P1/P2 是本次工程整改优先级。

扫描覆盖 2,800 个 Git 跟踪文件的全仓范围；执行全仓静态检查和各工作包测试，并对商家 UI、计费、安装卸载、鉴权、隐私和数据链路做重点追踪。没有声称逐行人工读完每个文件。审核方法、逐模块覆盖和类别判定见 [coverage.md](coverage.md)。

BFS 通过 **1.1.1** 继承 App Store 要求，因此收费和隐私问题同样会阻碍 BFS 准备。109 条核心/已选类别台账当前为 **10 条 fail、76 条 unverified、20 条 not applicable、3 条限定源码范围的 pass**。一项问题可映射多个要求，多项问题也可落在同一要求，不能把要求数与缺陷数直接相加；这些计数不构成“合规率”。章节级要求（例如 App Store §1.2 无计费错误）另有约束力，不另计入109个 leaf ID。

本轮是用户所有仓库的授权防御性审计，仅使用隔离检出和本地合成夹具。没有修改应用代码、提交、推送、部署或进行真实收费。原 ISO 工作区已有改动均保留；新增内容仅为本审计目录下的 App-specific evidence。

## P1：优先阻断项

| ID | 确认问题和具体后果 | 官方依据 | 核心代码证据 |
|---|---|---|---|
| B-01 | 首次提交之后，商品分类变化仍可用当前分类费率重算，未继承冻结费率/公共费率。合成示例原 $11 被算成 $16.50；正式收费后果限定 CATEGORY_ACTIVE 与适用品类订单。 | BFS 1.1.1 → App Store §1.2，无 billing-related errors | [recalc-orchestrator.server.ts:315](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts#L315) |
| B-02 | AI referral / 专属合同订单进入品类重算后，来源被固定写为 AP_CATEGORY，可覆盖原优惠/合同定价。两类合成输入均已复现。 | BFS 1.1.1 → App Store §1.2，无计费错误 | [recalc-orchestrator.server.ts:344](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server.ts#L344) |
| B-03 | 品类计价 BLOCKED、工作项 MANUAL_REVIEW、无快照时，旧整单金额仍能释放。真实临时 PostgreSQL 已生成 $10 / PENDING / 无快照的收费义务，未发送 App Event。 | BFS 1.1.1 → App Store §1.2，无计费错误 | [obligation.server.ts:1141](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/cps/obligation.server.ts#L1141) |
| PLATFORM-01 | app/uninstalled 后才用 Admin API 恢复主题，但 Shopify 已撤销 token。已部署 metafield 下可能留下指向失效 App Proxy 的 canonical。SEO 允许直接编辑主题的例外不解决卸载残留。 | BFS 3.2.1；官方 token revocation 合同 | [webhooks.app.uninstalled.tsx:316](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/routes/webhooks.app.uninstalled.tsx#L316) |
| PLATFORM-02 | customers/data_request 只统计订单行数、记日志；仓库流程明确认为无须导出，但实际保留订单关联数据。缺少向商家提供请求数据的履约流程。 | Mandatory privacy，BFS 1.1.1 继承；收到请求后30日完成 | [compliance-handlers.server.ts:89](https://github.com/deepLumendev/shopify-deeplumen-app/blob/cccebcc9c7256a40d68cd6d7cd210761221bdf88/apps/shopify-app/app/lib/compliance-handlers.server.ts#L89) |

完整触发条件、调用链、限制和整改方向见 [billing-findings.md](billing-findings.md) 与 [platform-findings.md](platform-findings.md)。PLATFORM-02 不要求同步自动导出；可验证的人工履约流程也能满足官方要求，但本仓库目前的声明明确排除了该义务。

## P2：文案、交互与收费解释

| ID | 问题 | 规则映射 / 主位置 |
|---|---|---|
| B-04 | Plan / Commission 展示旧整单费率，无法解释实际品类收费；商家看到的比例与最终目标可不一致。 | App Store 2.1.2 / 收费正确性；plan-data.server.ts:64、commission-data.server.ts:747 |
| B-05 | 从未有免佣权益的商家仍显示“前 N 单免费”；真实生产页调用了名为 mocks 的文案模块。 | App Store 2.1.2 / 收费正确性；mocks/plan.ts:51 |
| B-06 | 无条件承诺退款自动生成负数账单行，与跨期 MANUAL_REFUND_REQUIRED 分支不符。 | App Store 2.1.2 / App Events合同；mocks/plan.ts:212 |
| PLATFORM-03 | 公开落地页“不修改主题代码”与默认开启的 canonical 等主题写入矛盾。 | App Store 1.1.4；routes/_index/route.tsx:51 |
| UI-01 | 关闭索评推广只保留30天，31天后新里程碑可再次出现同类请求。 | BFS 4.3.6；review-prompt.server.ts:155 |
| UI-02 | onboarding 用固定约3.4秒展示“Sync Complete”，没有读取真实同步完成状态。 | BFS 4.2.2 / 官方 onboarding、成功反馈指导；app.sync.tsx:345 |
| UI-03 | 空态宣称新商品1周出现在AI答案中，并暗示未来AI订单。 | BFS 4.3.1；app.ai-traffic.tsx:392 |
| UI-04 | 平台跑马灯/订单装饰动画进入视口即播放，与商家任务无关。 | BFS 4.3.3 拒审原因3；PlatformChips.tsx:80 等 |
| UI-05 | 详情页切换tab后，页面Back返回兄弟tab而非父级页面。 | BFS 4.1.1 拒审原因11；app.pages.$id.tsx:149 |
| UI-06 | 真实博客分类加载失败使用amber文字，部分failed状态用warning/neutral。 | BFS 4.2.4 拒审原因2；BlogWizardForm.tsx:905 等 |

另有 **UI-07 / P2 官方指导项**：Settings 截图弹层只有 `role=dialog`，缺少焦点进入、约束、还原和可聚焦关闭控件。依据是官方 Accessibility — Drawers and modals，**没有把它虚构成独立 BFS 拒审子条款**。Esc关闭已实现，不属于缺失项。详见 [UI 审计与18个路由矩阵](ui-findings.md)。

上述代码路径均相对 `apps/shopify-app/app/`，精确范围、状态和官方链接在分报告中。收费金额/比例是本 App 的业务合同；Shopify 要求正确实施，不规定所有 App 必须采用这里的佣金公式。

## 已执行的验证

| 检查 | 最终结果 | 解释 |
|---|---|---|
| 全仓 lint | PASS，0 errors / 129 warnings | 警告未擅自修复 |
| 全仓 build | PASS | 生成 Prisma 后重跑通过；初跑缺生成类型不是源码缺陷 |
| 全仓 typecheck | PASS | 含各 workspace |
| 商家 App 单测 | 494 files / 8,022 tests PASS；67 files / 730 tests skipped | Node24 + Kafka依赖准备完成后完整重跑；skip不计通过 |
| 其余13个工作包单测 | 359 files / 4,623 distinct tests，无未解决断言失败 | 两个环境前置冲突定向重跑通过；排除了 integration 文件 |
| CPS 数据库测试 | 32 files / 351 tests PASS；1 test skipped | 独立PG16、219迁移；补齐历史迁移所需NOLOGIN角色后通过 |
| 新增审计诊断 | mock 4/4；独立PG 1/1，均复现当前缺陷 | 断言的是错误行为，不能当整改通过证明 |
| 官方要求指纹 | BFS 77条/63拒审原因、App Store174条均对齐 | 2026-09-16在线核实 |
| ISO设计指纹 | content页面发生漂移 | 本次按当前官网读取；没有把旧指纹假装通过 |

运行版本、初跑环境错误、命令、日志路径、来源指纹与未执行项见 [verification.md](verification.md)。测试存在交叉覆盖，表内数量不要直接加成“唯一测试总数”。临时 PostgreSQL 已停止；合成数据库文件仍保留在临时审计目录，可恢复，未删除用户数据。

## 必须补充的真实环境证据

以下均为 `unverified`，不是已经确认失败：

1. Dev Dashboard 的 Partner standing、净安装/评价/近期评分资格，以及最近28天 LCP/CLS/INP 样本和p75。前端源码或本地构建不能替代这些指标。
2. 已授权测试店：首次安装→授权接受/拒绝→重装→新手引导→主要工作流；桌面/移动端、SaveBar离开确认、modal键盘、错误恢复与preview。
3. 同一测试店 storefront 安装前后性能；直接在Shopify卸载后的canonical、主题块/文件、App Proxy和残留品牌检查。
4. 真实 App Pricing meter/单位价/discount/base amount/handle、有效订阅、App Event Billable状态、账单解释及退款闭环。当前 `202 Accepted` 仅说明收到事件，不能证明收费成功。
5. 公开 listing 的价格、语言、图文、类别和提交材料；`write_themes` / SEO例外和 protected customer data 所需审批。
6. Headless/Cloudflare功能是否属于公开App：若是，连接/断开控制需在embedded App内或有明确获准例外。Analytics实际数据来源也需确认。

没有把“使用自定义组件/圆角”“所有动画”“没有Web Pixel文件”“使用themeFilesUpsert”“存在auth/login fallback”一律判为违规。内部REST `shop.json` 的新公开App限制须结合创建/分发日期判断；应用主SDK已启用expiring offline tokens。

## 建议整改顺序与复查入口

先处理三项P1收费缺陷和两项P1平台/隐私缺陷；再让Plan、Commission、促销和退款说明与实际合同一致；最后逐项收敛UI问题，并补真实店铺与Dashboard证据。每项修复都应保留本报告ID、官方URL/核实日期、修复提交和验收证据。

- [109条逐项审核台账](requirements-ledger.md)：用于逐条关闭，不能将未验证改为通过而不补证据。
- [覆盖与全部类别排查](coverage.md)：包含剩余142条的类别适用性判断，覆盖77条BFS与174条App Store要求的全集。
- [收费细审](billing-findings.md)、[平台隐私细审](platform-findings.md)、[UI细审](ui-findings.md)：用于开发认领和另一Agent复核。
- [执行验证记录](verification.md)、[其他workspace单测明细](workspace-unit-summary.md)：区分通过、跳过、环境问题和生产证据缺口。

本次没有实施整改，也没有把审计报告推送到任一线上仓库。
