# 审计与发布配置验证记录

> 文档版本：`1.1.0`
> 最后修改：`2026-09-28 10:42 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [SOURCE-GOVERNANCE](../../SOURCE-GOVERNANCE.md)

## 固定版本与隔离

- 拉取时远程引用：`origin/main=b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`，`origin/dev=0d83409fc2b5f5446172b69d836fd56dd978a6ca`，`origin/cosmofff=69dd0f1d72e1c98ebbcca363363fd8158b00ee8b`。GitHub API 和 git ls-remote 均核实；fetch 已取得最新分支与 tags。
- 三分支 Git tree 均为 `261b4ad7e4e818798587aea578e4147ea44cd50e`，两次分支 diff 均为空。main 在历史上分别领先 dev 36、cosmofff 41 个提交，但文件内容一致。后续 cosmofff 增加本次配置，因此这只是审计基线状态。
- 最新 main 的历史 release：`v1.0.1 -> b39a0146`，`v1.0.0 -> bc675b2`；旧 tag 未移动。
- 审计工作树：`/private/tmp/deeplumen-ap-release-latest-20260928`，基线为 main，配置提交为 `4959e225`、`fa2e183`、`43963b3`。应用目录未相对审计 main 改动。
- 按仓库分支流程，配置移入隔离 `cosmofff` 工作树 `/private/tmp/deeplumen-ap-release-cosmofff-20260928`，对应提交 `1aa97b4`、`98b3e85`、`06e5727`，此时整棵树与已验证的 `43963b3` 无 diff。之后 `0315d1f` 仅在门禁和发布说明加入本地已通过的 `qa:commission`，YAML 与 diff 检查通过。
- 原始本地 `/Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/shopify/deeplumen-AP` 有用户 WIP，未切换、未 reset、未覆盖。
- `npm ci --ignore-scripts` 成功；npm audit 报 `34` 个依赖漏洞（`3 moderate`, `31 high`），这不是 BFS requirement 的通过证据，建议单独安排依赖治理。

## ISO 官方来源校验

| 命令 | 结果 |
|---|---|
| `node scripts/verify-bfs-requirements.mjs` | PASS；77/77 leaf、63/63 design rejection reasons；SHA `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93` |
| `node scripts/verify-app-store-requirements.mjs` | 最终 PASS；173/173；分区 `20/17/6/24/106`；SHA `cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e` |
| `node scripts/verify-app-design-guidelines.mjs` | PASS；11 个页面未变化 |
| `node scripts/verify-links.mjs` | PASS；86 个 Markdown 文件 |
| `node scripts/build-requirements-ledger.mjs --app-store-categories 5.1 --bfs-categories 5.3` | PASS；生成 109 行，生成器已兼容主清单的 173 条 |

以上证明 ISO 快照与官方来源对齐，不证明目标 App 已通过 BFS。

当日早期 App Store 174 条检查通过；后续指纹检查失败后，逐字 diff 发现官网只删除了原 `5.8.4` 的标题和“最多连续 2 次”正文，没有重排后续编号。主审重新获取官方正文并确认新指纹后才更新 ISO 与校验脚本。另打开 [Post-purchase UX](https://shopify.dev/docs/apps/build/checkout/product-offers/ux-for-post-purchase-product-offers#user-experience)，现写最多连续展示 3 个 offer；[API](https://shopify.dev/docs/api/checkout-extensions/post-purchase/api#applychangesetresult) 的 changesetApplicationsRemaining 独立约束应用次数，不把主清单删除误解成无限加购。

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
| `npm run qa:commission` | PASS | 分品类计佣、展示状态守恒、费率明细、授权前订单与文案的原型合同测试；不是生产佣金校验 |
| `npm run qa:mock` | PASS | mock route/contract 断言 |
| `npm run build` | PASS | Vite client + SSR build |
| `npm run lint` | FAIL | 2 个 severity-2 错误：`app/lib/commission.ts:901` 未使用 `_cfg`；`app/routes/app.commission.tsx:449` 非标准空白；另有 4 个 Hook warning |
| `npm run qa:cps` | FAIL | `scripts/qa/cps-gate-sanity.ts` 导入 `app/lib/cps-onboarding.ts` 中不存在的 `shouldGateToPlan` |
| `npm run verify:production` | FAIL | production-baseline 声明边界外有大量 prototype/app 文件和语句，见 F-05 |

`qa:bfs` PASS 只说明脚本覆盖的静态条件通过；不覆盖 4.3.1/4.3.3 的产品语义和弹窗触发时机，也不覆盖 Dashboard/生产。

## 发布治理配置验证

配置在最新 main 上验证，再以内容相同的最新 cosmofff 为基线提交；远端交付 HEAD 为 `0315d1f`。新增/修改：

- `.github/workflows/release-gate.yml`：prototype integrity、Node 24、typecheck、lint、BFS QA、专项 sanity、mock contract、build、版本报告检查。production baseline 保留明确 warning 与 14 天日志 artifact，不因旧快照差异强迫回滚原型 UI。
- `scripts/release/verify-release-report.mjs`：读取待验 commit 内的报告；要求新增唯一报告、非空章节、版本递增、不复用旧 Tag、annotated tag、事件 SHA 和远程 main 可追溯性。
- `scripts/release/verify-release-report.test.mjs`：17 个合成 Git 正反例覆盖正常报告、空章节、旧版复用、工作目录伪装、tag 类型和提交关系等。
- `docs/releases/ROLLBACK.md`、`RELEASING.md`、`docs/releases/TEMPLATE.md`、`AGENTS.md`：artifact/image digest、Shopify App version、migration、外部资源和不可移动 tag 的回滚追踪。

配置检查结果：17 个 Git fixtures PASS；YAML parse PASS；Node syntax PASS；diff check PASS。现有 v1.0.1 报告内容校验通过，本地已取得 annotated v1.0.1，指向 b39a0146。由于当前应用的 `lint`、`qa:cps` 失败，App gate 尚不能通过；承认失败不等于允许跳过阻断检查。`verify:production` 仅改为漂移诊断，实测失败记录仍保留。

GitHub branch protection / required checks 不能由仓库文件自动开启。本轮凭仓库 admin 权限再次读取 main protection，GitHub 返回 HTTP 403：`Upgrade to GitHub Pro or make this repository public to enable this feature.` 当前未能配置平台强制保护，禁止强推/删除和 required checks 均不能宣称已生效；没有升级套餐、改可见性或权限。期望 required checks：`Prototype integrity`、`App typecheck, BFS QA and build`、`Release report`。

HTTPS 推送曾遇到网络超时；切换正常 SSH 传输后，已将本次 4 个配置提交推送到远端 cosmofff（`69dd0f1 -> 0315d1f`），没有 force push。待合并的配置 PR 指向 dev，当前保持 draft 以交开发修复已有检查失败；未合并 dev/main、打新 Tag、创建 Release 或部署。PR 链接和最终校验结果见下方交付记录。

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

## 交付记录

- 配置已推送 `cosmofff@0315d1fc11440f6137aedf53424093a7c44f1a6e`；[Draft PR #19：cosmofff → dev](https://github.com/deeplumen-agents/deeplumen-AP/pull/19)。PR 保持未合并。
- 首轮远端 [Release gate](https://github.com/deeplumen-agents/deeplumen-AP/actions/runs/36436989885) 在 `06e5727` 实际运行：`Prototype integrity`、`Release report` 成功，App job 在 lint 因同样的 `_cfg` 与 literal BOM 两个错误失败，日志还保留 4 个 Hook warning。其后的 typecheck/QA/build 步骤未执行，不能把本地通过冒充该轮 CI 通过。`0315d1f` 只增加佣金 QA 接入，尚未修复 lint 和本地已发现的 qa:cps 失败；新一轮以 PR 检查为准。
- BFS 账本为 77 个唯一 ID：3 fail、37 unverified、37 源码范围 not applicable；App Store 账本为 173 个唯一 ID：50 unverified、123 源码范围 not applicable。没有整项 pass 的无证据声明。
- 规范指纹、11 个设计来源、账本生成器与本地链接检查通过；`git diff --check` 通过。报告仅作静态审计交接，不是送审通过证明。
- ISO 原有未提交规范迭代完整保留。本次审计文件单独保存/提交；App Store 173 条来源修订已写入本地 ISO 和脚本，涉及既有未提交内容的文档没有整体暂存或冒称已在线上 ISO 生效。
