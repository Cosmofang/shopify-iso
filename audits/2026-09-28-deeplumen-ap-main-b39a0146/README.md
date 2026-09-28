# Deeplumen App — BFS 全量核对报告

> 文档版本：`1.0.0`
> 最后修改：`2026-09-28 10:05 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP` 最新远程 `main@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 对照分支：`dev@3b6978083fbbcb41ca408e88162a6e93d5e5af7`（旧于本次 main；不能替代最新 main 审计）
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Manage webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe) · [App Design Guidelines](https://shopify.dev/docs/apps/design)
> 官方来源核验日期：`2026-09-28`

## 结论

这次是对最新 `main` 的静态源码、配置、原型边界和可执行检查的全量核对。结果不能写成“BFS 已通过”：发现 **3 项 BFS 明确不匹配、1 项 App Store 合规配置缺口（生产状态仍未验证）、2 项可疑/需人工复核项、2 项工程门禁失败**。完整 requirement 状态见 [requirements-ledger.md](requirements-ledger.md)，整改交接见 [findings.md](findings.md)，命令和输出见 [verification.md](verification.md)。

本报告中的优先级是本次工程排期用的 `P1/P2`，**不是 Shopify 官方严重等级**。状态含义如下：

- `confirmed fail`：源码或配置直接违反官方文字，已有可复现证据。
- `confirmed gap / production unverified`：当前 checkout 有缺口，但仓库明确声明生产配置在另一个仓库，不能把 checkout 结论扩展成线上结论。
- `review`：存在官方审核风险，但当前证据不足以定性为必然拒审。
- `unverified`：需要真实店铺、部署、Partner/Dev Dashboard、运行时或 listing 证据。
- `pass (narrow static)`：只证明某个窄命题，不能推导 App 整体 BFS 通过。

## 发现摘要

| ID | 工程优先级 | 状态 | 官方依据 | 开发动作 |
|---|---:|---|---|---|
| F-01 | P1 | confirmed fail | BFS 4.3.3 `Don't distract merchants` | 首屏不要自动打开 CPS modal；改为持久卡片/通知，商家点击后再打开 `s-modal` |
| F-02 | P1 | confirmed fail | BFS 4.3.1 `Don't make false claims` | 删除订单、流量、推荐结果承诺；仅展示可验证、带时间窗口和归因方法的数据 |
| F-03 | P1 | confirmed gap / production unverified | App Store 隐私合规；BFS 1.1.1 继承 App Store 要求 | 在真实生产 App 注册三条 compliance topics，并验证签名投递和履约；不要只修原型注释 |
| F-04 | P1 | engineering fail | 发布门禁要求的 `qa:cps` | 修复测试导入的缺失 `shouldGateToPlan` 导出，或同步测试与实现后重新跑全套 gate |
| F-05 | P1 | engineering fail / boundary drift | 原型仓库 `production-baseline.json` 约束 | 明确生产源；更新合法边界或把生产改动搬回真实生产仓库，不能把原型当生产证据 |
| F-06 | P2 | confirmed fail（按官方错误语义） | BFS 4.2.4 `Helpful error messages` | `role=alert` 的真实加载错误使用错误语义和官方错误样式；保留原因与恢复动作 |
| F-07 | P2 | review | BFS 4.3.6 + App Design `Marketing/Promotion` | 30 天后重复显示 review prompt 可能违反“关闭后不再复现”；需确认 Shopify 对该卡片的促销分类并改为永久关闭或提交依据 |
| F-08 | P2 | engineering mismatch | package engine 与既有 CI | `package.json` 要求 Node `>=24`，既有 `.github/workflows/ci.yml` 使用 Node 20；统一运行时 |

## 不能从本仓库证明的事项

真实 Partner standing、BFS 自动评估、净安装/评价/评分、Web Vitals、真实安装/重装/OAuth、线上 billing、真实 App Store scopes、webhook 注册与投递、隐私导出/删除履约、卸载后 storefront 状态、生产 App version、数据库 migration、artifact/image digest 均为 `unverified`。`qa:bfs`、typecheck、build 通过，只说明本地静态/构建检查通过。

## 审计边界与来源分类

- **Official hard requirement**：BFS/App Store 页面及其 requirement ID；每条结论在 `findings.md` 附官方 URL。
- **Official guidance/API contract**：隐私合规、webhook 订阅、App Design Guidelines、Polaris/App Bridge reference；用于实现和验收，不伪装成 BFS 编号。
- **ISO conservative baseline**：颜色、错误语义、发布门禁和证据字段；在报告中明确标注为 ISO 选择。
- **App-specific evidence**：固定 commit、代码行、脚本输出、原型声明和运行时限制；不能升级为通用 Shopify 规则。

原始 app checkout 位于隔离工作树 `/private/tmp/deeplumen-ap-release-latest-20260928`，没有覆盖本地用户工作区。配置草案已在该最新基线上形成提交 `4959e225`，并以 `fa2e183` 修正旧报告标题兼容性；尚未合并 `dev/main`。
