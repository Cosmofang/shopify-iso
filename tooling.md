# 官方工具 / 参考清单（pin 版本）

> ISO 只放官方的**真相源 + 校验工具 + 指针**，不 vendor 起手代码。
> 版本为 2026-07-01 核准值（`npm view` 实测）。用前 `npm view <pkg> version` 复核是否有更新。

---

## 工具链（按用途）

| 用途 | 官方工具 / 包 | pin 版本 | 说明 / 官方链接 |
|------|--------------|---------|----------------|
| 脚手架 & 本地开发 | Shopify CLI | **4.3.0** | `shopify app dev/deploy`；见 [00-built-for-shopify/local-self-test.md](00-built-for-shopify/local-self-test.md)。https://shopify.dev/docs/api/shopify-cli |
| App 后端框架 | `@shopify/shopify-app-react-router` | **1.2.1** | 官方推荐模板底座（OAuth/billing/webhook）。https://shopify.dev/docs/api/shopify-app-react-router |
| 嵌入 Admin | `@shopify/app-bridge-react` | **4.2.11** | 嵌入式导航/资源选择器等；App 名进首页(4.1.4)靠它。 |
| 设计 token（真相源） | `@shopify/polaris-tokens` | **9.4.2** | 本库 token 的权威来源；用 [scripts/verify-tokens.mjs](scripts/verify-tokens.mjs) 自动核对。 |
| Polaris React 组件 | `@shopify/polaris` | **13.9.5** | React 版组件（若用 React 而非 web components）。https://polaris-react.shopify.com |
| Polaris Web Components | App Home UI（`s-*` 标签） | 随 App Bridge | 本库组件示例主用 `s-*`；见 [02-components/](02-components/)。 |
| CSS lint 关卡 | `@shopify/stylelint-polaris` | **16.0.7** | 挡写死 hex 等；配置见 [.stylelintrc.json](.stylelintrc.json)。⚠️ peer = `stylelint ^14.15 || ^15`（**别用 stylelint 17**）。 |

---

## 权威文档链接

- **App Design Guidelines**（BFS 设计判据源头）：https://shopify.dev/docs/apps/design
- **Built for Shopify**：https://shopify.dev/docs/apps/launch/built-for-shopify
- **Polaris tokens**：https://polaris-react.shopify.com/tokens
- **App 模板与库**：https://shopify.dev/docs/apps/build/scaffold-app
- **本地自测**：https://shopify.dev/docs/apps/build/cli-for-apps/test-apps-locally

---

## 关键版本兼容坑

- **stylelint**：`@shopify/stylelint-polaris` 16.0.7 只兼容 stylelint **14/15**，装 `stylelint@^15`，别装最新 17。
- **polaris-tokens 版本**：改库 token 时先跑 `node scripts/verify-tokens.mjs`；升官方版本用 `POLARIS_TOKENS_VERSION=<新版> node scripts/verify-tokens.mjs` 看差异，再决定是否同步。
- Node：CLI 要求 **22.12+**。

> 脚手架起手代码不放这里——见 [scaffold/README.md](scaffold/README.md)。
