# 官方工具 / 参考清单

> ISO 只放官方真相源、校验工具和指针，不 vendor 起手代码。
> 下表版本为 **2026-07-24 核准快照**，用于审计和排查，不是要求新模板降级的强制 pin。

## 版本优先级

1. Shopify 当前官方文档与 changelog。
2. 最新官方模板生成的 `package.json` 与 App 自己的 lockfile。
3. 本文件的核准快照。

升级时以 App 仓为单位升级、验证和提交；不要在 `~` 主目录安装 App 依赖。

---

## 工具链（按用途）

| 用途 | 官方工具 / 包 | 核准快照 | 说明 / 官方链接 |
|------|--------------|---------|----------------|
| 脚手架 & 本地开发 | Shopify CLI | **4.5.2** | CLI 当前要求 Node `>=22.12.0`；见 [本地自测](00-built-for-shopify/local-self-test.md) 与 [CLI 文档](https://shopify.dev/docs/api/shopify-cli) |
| App 后端框架 | `@shopify/shopify-app-react-router` | **1.2.1** | 官方推荐模板底座（OAuth/billing/webhook）。https://shopify.dev/docs/api/shopify-app-react-router |
| 嵌入 Admin | `@shopify/app-bridge-react` | **4.2.12** | React 绑定；最新 App Bridge 运行时仍以官方 `app-bridge.js` 为准 |
| App Bridge 类型 | `@shopify/app-bridge-types` | **0.7.2** | 仅 TypeScript 类型 |
| Polaris Web Components | `polaris.js` CDN | **自动保持最新** | 新 App UI 基线；[组件参考](https://shopify.dev/docs/api/app-home/web-components) |
| Polaris Web Components 类型 | `@shopify/polaris-types` | **1.0.7** | 仅 TypeScript 类型；模板版本可能不同，以模板 lockfile 为准 |
| 设计 token 快照 | `@shopify/polaris-tokens` | **9.4.2** | 自定义 Zone B 校验；用 [verify-tokens.mjs](scripts/verify-tokens.mjs) 核对 |
| Polaris React（遗留） | `@shopify/polaris` | **官方源码 13.10.1；本机 npm 快照 13.9.5** | **已弃用**；两套快照独立记录，只用于遗留代码对照，不用于新页面 |
| CSS lint（遗留工具） | `@shopify/stylelint-polaris` | **16.0.7** | peer 仅支持 stylelint 14/15；用于现有 Zone B 校验，不代表 Web Components 运行时 |

---

## 权威文档链接

- **App Design Guidelines**（BFS 设计判据源头）：https://shopify.dev/docs/apps/design
- **Built for Shopify requirements**：https://shopify.dev/docs/apps/launch/built-for-shopify/requirements
- **App Home Patterns**：https://shopify.dev/docs/api/app-home/patterns
- **Polaris Web Components**：https://shopify.dev/docs/api/app-home/web-components
- **App Bridge Web Components**：https://shopify.dev/docs/api/app-home/app-bridge-web-components
- **App 模板与库**：https://shopify.dev/docs/api/libraries-and-templates
- **创建 App**：https://shopify.dev/docs/apps/build/scaffold-app
- **本地自测**：https://shopify.dev/docs/apps/build/cli-for-apps/test-apps-locally
- **部署 Web App**：https://shopify.dev/docs/apps/launch/deployment/deploy-to-hosting-service
- **发布 App version**：https://shopify.dev/docs/apps/launch/deployment/deploy-app-versions

## 规范漂移校验

```bash
node scripts/verify-bfs-requirements.mjs
node scripts/verify-tokens.mjs
node scripts/verify-polaris-react-handbook.mjs
node scripts/verify-links.mjs
```

- 第一个脚本抓取官方 BFS Markdown，并校验本地总矩阵的叶子编号、标题与官方全文指纹；只要拒审正文变化也会失败。
- 第二个脚本校验自定义 Zone B token 快照。
- 第三个脚本校验归档 Polaris React 手册的 260 个来源落点与 121/534/59 系统清单；传入 `--source-root` 时还核对完整源码 hash。
- 第四个脚本校验仓库内 Markdown 相对链接。
- 脚本通过只代表“规范源和仓库结构对齐”，不代表任何真实 App 已满足要求。

GitHub Actions 会在 push、pull request、手动触发和每周一运行这些规范检查，配置见 [.github/workflows/verify-iso.yml](.github/workflows/verify-iso.yml)。

---

## 关键版本兼容坑

- **Node**：当前 CLI 要求 `>=22.12.0`；官方 React Router 模板支持 `>=20.19 <22 || >=22.12`。团队基线使用受支持的 Node 22 LTS。
- **Polaris 运行时**：`@shopify/polaris-types` 不包含组件运行时；新项目由 `polaris.js` CDN 加载 Web Components。
- **React 组件**：`@shopify/polaris` 仓库已归档；不能因为旧示例存在就继续作为新开发基线。
- **stylelint**：`@shopify/stylelint-polaris` 16.0.7 只兼容 stylelint 14/15；不要为了引入它破坏现代 App 的 lint 工具链。
- **token 快照**：改库 token 时先跑 `node scripts/verify-tokens.mjs`；升版本先看 diff，再同步资产、Figma 与文档。
- **部署**：`shopify app deploy` 发布配置和 extensions，不会部署 React Router Web App 服务器。

> 脚手架起手代码不放这里——见 [scaffold/README.md](scaffold/README.md)。
