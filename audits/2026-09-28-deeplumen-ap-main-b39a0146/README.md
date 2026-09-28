# Deeplumen App — BFS 全量核对报告

> 文档版本：`1.1.0`
> 最后修改：`2026-09-28 10:42 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP` 最新远程 `main@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 对照分支：`dev@0d83409fc2b5f5446172b69d836fd56dd978a6ca`、`cosmofff@69dd0f1d72e1c98ebbcca363363fd8158b00ee8b`；审计拉取时三分支文件树相同，历史不同。本次后续发布配置另行提交在 cosmofff。
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Manage webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe) · [App Design Guidelines](https://shopify.dev/docs/apps/design)
> 官方来源核验日期：`2026-09-28`

## 结论

这次按当前 **77 条 BFS + 173 条 App Store 前置要求** 完成全仓静态扫描、可达路径复核和本地检查。发现 **4 项 BFS 设计问题（涉及 3 个唯一条款）、2 项阻断发布检查的工程问题、1 项旧生产快照漂移诊断、1 项生产合规证据缺口**，共 8 张交接项。结果为 `not ready`，不能写成“BFS 已通过”。完整状态见 [BFS 逐项账本](requirements-ledger.md) 与 [App Store 逐项账本](app-store-ledger.md)，开发优先阅读 [整改交接单](findings.md)，命令结果见 [verification.md](verification.md)。

本报告中的优先级是本次工程排期用的 `P1/P2`，**不是 Shopify 官方严重等级**。状态含义如下：

- `confirmed fail`：当前原型可达代码路径与官方文字冲突；不是生产运行或 Shopify 拒审结论。
- `confirmed gap / production unverified`：当前 checkout 有缺口，但仓库明确声明生产配置在另一个仓库，不能把 checkout 结论扩展成线上结论。
- `unverified`：需要真实店铺、部署、Partner/Dev Dashboard、运行时或 listing 证据。
- 静态通过只证明脚本或具体代码命题，不给整个 requirement 自动判 `pass`。

## 发现摘要

| ID | 工程优先级 | 状态 | 官方依据 | 开发动作 |
|---|---:|---|---|---|
| F-01 | P1 | confirmed fail | BFS 4.3.3 `Don't distract merchants` | 首屏不要自动打开 CPS modal；改为持久卡片/通知，商家点击后再打开 `s-modal` |
| F-02 | P1 | confirmed fail | BFS 4.3.1 `Don't make false claims` | 删除订单、流量、推荐结果承诺；仅展示可验证、带时间窗口和归因方法的数据 |
| F-03 | P1 | production unverified | App Store 隐私合规；BFS 1.1.1 继承 App Store 要求 | 提供真实生产 App 三条 compliance topics 的注册、签名投递和履约证据；缺实现时再补齐 |
| F-04 | P1 | engineering fail | 发布门禁要求的 `qa:cps` | 修复测试导入的缺失 `shouldGateToPlan` 导出，或同步测试与实现后重新跑全套 gate |
| F-05 | P2 | diagnostic fail / boundary drift | 原型仓库 `production-baseline.json` 约束 | 对照旧快照解释合法漂移并独立核查适配器边界；此项在新 CI 中保留警告和日志，不要求恢复旧 UI |
| F-06 | P2 | confirmed fail（静态可达错误态） | BFS 4.2.4 `Helpful error messages` | 诊断失败文字使用红色错误语义；分类加载错误分支在联调时一并检查 |
| F-07 | P2 | engineering fail | ESLint 检查，非独立 BFS 等级 | 修复未使用变量和非标准空白，复核 4 个 Hook warning |
| F-08 | P2 | confirmed fail（静态可达） | BFS 4.3.3 `Don't distract merchants` | Plan 增长流程的 3.2 秒自动循环改成静态信息，或由商家主动触发 |

评价卡的“30 天后重现”和已移除的旧 Plan 动画未作为当前缺陷：前者没有接通 loader，后者缺少可达 DOM。原有 Node 20 workflow 只检查独立 prototype 脚本，不能据此断言它错误构建了要求 Node 24 的 App。

## 代码覆盖范围

固定提交共 395 个受 Git 管理的文件；`deeplumen-app/app/` 为 192 个，含 35 个路由文件、84 个组件文件、24 个 prototype 文件、11 个 mock 文件；应用 scripts 为 25 个文件，extensions 只有 `.gitkeep`。这些是扫描范围清单，不表示逐行阅读或全部浏览器状态已运行。检查覆盖认证入口、首页/CPS、Plan、佣金、AI Traffic、页面/诊断、Blog、技术 SEO/图片、同步、卸载、配置、扩展和发布脚本，并对可疑组件追踪实际调用路径。

审计快照：[main b39a0146](https://github.com/deeplumen-agents/deeplumen-AP/tree/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4)。本轮未在真实 Shopify Admin、手机端或生产环境执行交互验收。

## 不能从本仓库证明的事项

真实 Partner standing、BFS 自动评估、净安装/评价/评分、Web Vitals、真实安装/重装/OAuth、线上 billing、真实 App Store scopes、webhook 注册与投递、隐私导出/删除履约、卸载后 storefront 状态、生产 App version、数据库 migration、artifact/image digest 均为 `unverified`。`qa:bfs`、typecheck、build 通过，只说明本地静态/构建检查通过。

## 审计边界与来源分类

- **Official hard requirement**：BFS/App Store 页面及其 requirement ID；每条结论在 `findings.md` 附官方 URL。
- **Official guidance/API contract**：隐私合规、webhook 订阅、App Design Guidelines、Polaris/App Bridge reference；用于实现和验收，不伪装成 BFS 编号。
- **内部工程规则**：发布门禁、版本报告与回滚证据字段；不伪装为 Shopify 官方 BFS 条款。错误颜色依据 BFS 4.2.4 原文。
- **App-specific evidence**：固定 commit、代码行、脚本输出、原型声明和运行时限制；不能升级为通用 Shopify 规则。

应用审计与配置验证位于隔离工作树 `/private/tmp/deeplumen-ap-release-latest-20260928`，没有覆盖用户工作区。发布配置已验证后转入隔离 `cosmofff` 工作树 `/private/tmp/deeplumen-ap-release-cosmofff-20260928`，配置提交为 `1aa97b4`、`98b3e85`、`06e5727`、`0315d1f`，已推送并建立 [Draft PR #19 → dev](https://github.com/deeplumen-agents/deeplumen-AP/pull/19)；验证和保护设置限制见 [verification.md](verification.md)。未合并 `dev/main`、创建新 Release 或部署。
