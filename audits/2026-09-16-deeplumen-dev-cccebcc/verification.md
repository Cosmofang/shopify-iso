# 来源与执行验证记录

> 文档版本：`1.0.2`
> 最后修改：`2026-09-16 09:07 UTC`
> 最后修改者：`Codex (OpenAI)`
> 证据类型：`App-specific audit evidence`
> 本次官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [App Design Guidelines](https://shopify.dev/docs/apps/design)，2026-09-16核实。

## 审计隔离与固定版本

- 仓库：`deepLumendev/shopify-deeplumen-app`，分支 `dev`，提交 `cccebcc9c7256a40d68cd6d7cd210761221bdf88`。
- 独立 shallow clone：`/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/repo`；原工作环境没有被切分支或覆盖。
- 应用工作树在执行检查后仍干净；生成的 Prisma/build 文件属于忽略项。只有审计目录创建了诊断夹具和报告。
- 用户授权的防御性验证；合成环境通过 allowlist 传入。没有读取/输出生产凭证，没有连接业务数据库，没有运行生产 preflight 或收费接口。
- PostgreSQL 16.14 只绑定 `127.0.0.1:65432`，数据目录为临时审计根下的 `pgdata`，创建的数据库为 `bfs_audit` 和 `bfs_billing_repro`。未使用已有服务。测试结束已用精确 `pg_ctl -D .../pgdata -m fast -w stop` 停止；未删除数据目录。
- pnpm 10.32.1。全仓 lint/build/typecheck 和首次单测使用 Node 25.6.1；后续商家单测及部分定向重跑使用已安装的 Node 24.19.0（符合仓库 Node >=24 要求）。

## 官方真相源与指纹

| 来源 | 本次核实 | 作用 |
|---|---|---|
| [BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 77条 leaf / 63条设计拒审原因；SHA256 `25fc0494f40b41eb4af970a04894a72b7ce1668f4a60f6e189e9338b73ffbca2` | 全部BFS ID、适用类别、性能/设计/集成审核 |
| [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 174条；各节20/17/6/24/107；SHA256 `52dc6cb5f377a919077c58c6032a55fd2c86d14e898603efae8228d8230052d2` | BFS 1.1.1继承的收费、真实信息、功能、API和listing要求 |
| [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance#customers-data_request) | 已打开当前正文；确认资源应直接提供给商家，收到请求后30日完成 | PLATFORM-02；200确认收到不等于完成履约 |
| [Access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens#refresh-rotation-and-revocation) | 当前正文明确卸载结束token访问，后续请求401 | PLATFORM-01；本地保留Session不延长Shopify权限 |
| [Marketing — Promotion](https://shopify.dev/docs/apps/design/user-experience/marketing#promotion) | 当前正文明确索评属于推广，同一用户关闭后不再显示 | UI-01，配合BFS4.3.6 |
| [Onboarding](https://shopify.dev/docs/apps/design/user-experience/onboarding) / [Alerts](https://shopify.dev/docs/apps/design/user-experience/alerts) | 当前正文与指纹已核实 | UI-02真实进度、UI-06错误/成功反馈 |
| [Accessibility — Drawers and modals](https://shopify.dev/docs/apps/build/accessibility#drawers-and-modals) | 当前正文明确焦点进入、约束、返回 | UI-07，官方指导而非杜撰BFS子条款 |
| [Build a Billing Event](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/build-billing-event) | 当前正文已核实：hosted approval、activeSubscription、负数/小数事件、202与Billable区别、卸载24h窗口 | 收费实现与B-06边界；具体比例由App合同决定 |
| [Setup usage charges](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing/subscription-billing/setup-usage-charges) / [Active subscription](https://shopify.dev/docs/api/partner/latest/active-subscription) | 收费轨道读取当前官方内容 | meter/合同核验；线上Dashboard配置仍未验证 |

`verify-app-design-guidelines.mjs` **退出1**：仅 [Content](https://shopify.dev/docs/apps/design/content) 页指纹漂移。ISO预期为 `763fd77f5b57c1fc6e267f63faa0c2d2f7c444e893f7d77ea04f15152e529cc3`，当前为 `7aba75af1ff7af6da955bbf4c87adb76667cacd3c5340b6382d44cb336bebae0`；其余10页对齐。本次已读取当前Content内容，审计不依赖旧指纹。没有修改通用ISO内容或直接接受新指纹；这项来源维护工作仍需单独核实页面差异后处理。**不能将本轮来源校验概括为全部通过。**

要求指纹输出保存在 [check-results.json](evidence/check-results.json)。原始官网Markdown快照仍在临时审计根目录：`bfs-official.md`、`app-store-official.md`、`content-official.md`。

## 执行命令与结果

下列 `run-check.mjs` 是本次合成环境/日志封装，原位置在临时审计根目录，保存副本见 [evidence/run-check.mjs](evidence/run-check.mjs)。它不是应用新增代码。

| 检查/命令 | 退出与结果 | 日志名 |
|---|---|---|
| `pnpm install --frozen-lockfile --ignore-scripts` | 成功；最初有意不执行依赖安装脚本 | install.log |
| `pnpm --filter @deeplumen/shopify-app exec prisma generate` | 0；生成Prisma6.19.3 | prisma.log |
| `pnpm lint` | 0；129 warnings / 0 errors | lint.log |
| `pnpm build`（准备后） | 0；14.685s | build-prepared.log |
| `pnpm typecheck` | 0；44.448s | typecheck.log |
| `pnpm --filter @deeplumen/shopify-app test`（准备后完整重跑） | 0；494 files / 8,022 passed；67 files / 730 tests skipped；28.634s | merchant-tests-prepared.log |
| `pnpm --filter @deeplumen/shopify-app test:cps:db`（准备后） | 0；32 files / 351 passed / 1 skipped；219迁移；27.698s | cps-db-prepared.log |
| 其余13工作包单测，排除 `**/*.integration.test.ts` | 359 files / 4,623 distinct tests；无未解决断言失败，见下方说明 | workspace-unit.log + workspace-unit-dashboard-rerun.log |
| `node scripts/verify-bfs-requirements.mjs` | 0；当前源与本地要求内容/ID对齐 | check-results.json |
| `node scripts/verify-app-store-requirements.mjs` | 0；当前源/174条对齐 | check-results.json |
| `node scripts/verify-app-design-guidelines.mjs` | 1；Content来源漂移，见上文 | check-results.json |

其余workspace的初始递归命令退出1，包含误选根package（没有test脚本）和两项Dashboard环境前置冲突。清除审计注入的3个Partner变量后，两个受影响文件10/10通过；不能说原命令一次通过。完整包级结果和确切命令见 [workspace-unit-summary.md](workspace-unit-summary.md)。

初跑商家单测的12个套件加载失败源于Kafka原生binding缺失；另外3个DB runner断言源于历史迁移需要 `deeplumen` role。准备过程只在隔离环境进行：创建NOLOGIN测试角色，生成Prisma，切到已安装Node24并安装该包官方预编译binding。Node25没有对应预编译包、本机也无CLT，源码构建曾失败；没有安装或改动系统CLT。完成后重新跑全套商家单测通过。初始日志被保留，没有把环境错误伪装成代码回归或忽略最终失败。

全部日志路径与SHA256保存在 [check-results.json](evidence/check-results.json)。完整日志在 `/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/`，未复制冗长日志到ISO；JSON保留测试摘要与文件指纹。后续临时目录被系统清理时，摘要与诊断源码仍可查看。

## 诊断复现证据

这些测试断言的是**当前缺陷会发生**，所以PASS表示复现成功，不是App已整改通过。

| 诊断 | 结果/证据 |
|---|---|
| B-01/B-02/B-05 | 1 file / 4 tests。真实重算编排+真实计价/文案函数，DB/Shopify I/O mock；得到$16.50、AP_CATEGORY来源覆盖和无权益却显示前3单免费。 |
| B-03 | 独立数据库 `bfs_billing_repro` + 独立schema +219迁移，1 file /1 test。真实释放函数创建$10/PENDING/无快照平台义务，订单仍BLOCKED；未发送收费事件。 |
| UI-01 | 提取并执行真实evaluateReviewPrompt，合成日期/访问量：关闭后29天null，31天且新里程碑返回索评触发。证据与夹具参数见UI分报告；无应用测试文件改动。 |

保存的诊断源码：[billing-repro.test.ts](evidence/billing-repro.test.ts)、[billing-db-repro.test.ts](evidence/billing-db-repro.test.ts)，以及同目录配置文件。**它们是原审计工作目录的原样快照**，相对 `./repo/` import和配置绝对路径保留，不能假设在ISO目录直接执行就能跑。原临时目录中对应文件仍可按收费报告命令运行；迁移到新环境时必须显式指定同一SHA检出与新的隔离DB，保留数据库地址/名称防误连断言。不能用生产连接字符串执行诊断。

## 明确未执行/未取得的证据

- 未执行认证Shopify browser/Playwright E2E、移动端和真实视觉对比；没有登录测试店或Dev Dashboard。
- 未运行需要真实Partner API/meter的 `preflight:cps-meter`，未声称真实事件Billable或真实账单通过。
- 其余workspace的Redis/Kafka/外部服务integration明确排除，未连接既有本地Kafka/Redis实例。
- 生产TLS、实际数据删除、S3/search/Cloudflare撤销、外部CrawStart服务、第三方内容授权、公开listing与运营流程未审计。
- 未运行或声称获得真实最近28天性能/安装/评价指标。数据阈值见逐项台账。
- 未把已有历史evidence目录、代码注释、测试mock或手册完整性作为当前上线合规凭据。

交付检查：`node scripts/verify-links.mjs` 通过，共79个Markdown；`git diff --check` 通过。新增未跟踪审计文件另用逐文件 `git diff --no-index --check` 校验；初次发现文末多余空行，已规范化后重跑。台账有109个唯一要求ID，最终10 fail /76 unverified /20 not applicable /3限定源码范围pass。远端dev与本地检出仍同为上述SHA，应用工作树干净。原ISO已有两处工作区改动未修改。

2026-09-16 09:04 UTC再次打开官方BFS、App Store、隐私和token页面核实P1依据：B-01～B-03精确映射到§1.2章节级无计费错误要求，而非1.2.2审批路径要求；因此1.2.2从fail更正为unverified，P1缺陷数仍为5。冻结费率/来源/计价就绪修法属于本App合同的工程实现，不是Shopify统一CPS公式。
