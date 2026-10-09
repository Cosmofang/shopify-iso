# 官方工具 / 参考清单

> 文档版本：`1.3.1`
> 最后修改：`2026-10-09 10:45 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 本次数量修订来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
> 本次官方来源：[Shopify CLI npm](https://www.npmjs.com/package/@shopify/cli) · [React Router npm](https://www.npmjs.com/package/@shopify/shopify-app-react-router) · [Polaris CDN semantic versioning](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning) · [Polaris CDN 1.1 stable](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable) · [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) · [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) · [Admin new look rollout](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) · [Polaris Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [React → Web Components migration](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react) · [React Router official template](https://github.com/Shopify/shopify-app-template-react-router/blob/main/package.json)
>
> ISO 只放官方真相源、校验工具和指针，不 vendor 起手代码。
> 下表版本为 **2026-10-09 核准快照**，用于审计和排查，不是要求新模板降级的强制 pin。npm `latest`、官方 GitHub release、官方模板和官方 CDN channel 分开记录，不能互相替代。

## 版本优先级

1. Shopify 当前官方文档与 changelog。
2. 最新官方模板生成的 `package.json` 与 App 自己的 lockfile。
3. 本文件的核准快照。

升级时以 App 仓为单位升级、验证和提交；不要在 `~` 主目录安装 App 依赖。

---

## 工具链（按用途）

| 用途 | 官方工具 / 包 | 核准快照 | 说明 / 官方链接 |
|------|--------------|---------|----------------|
| 脚手架 & 本地开发 | Shopify CLI | **npm latest 4.9.2** | CLI 当前要求 Node `>=22.12.0`；[CLI 文档](https://shopify.dev/docs/api/shopify-cli) 与 [npm latest](https://www.npmjs.com/package/@shopify/cli) |
| App 后端框架 | `@shopify/shopify-app-react-router` | **npm latest 3.0.2；官方模板 `^3.0.1`** | 3.x 已进入官方模板基线；升级既有 App 时仍按 [React Router API](https://shopify.dev/docs/api/shopify-app-react-router/latest) 与迁移说明回归认证、webhooks 和路由。 |
| 嵌入 Admin | `@shopify/app-bridge-react` | **官方 release 4.2.13；npm `latest` dist-tag 3.7.12** | npm 标签与当前 [App Bridge GitHub release](https://github.com/Shopify/shopify-app-bridge/releases) 不一致；运行时以官方 `app-bridge.js` CDN 和模板为准，不能据 npm `latest` 宣称已使用最新 App Bridge。 |
| App Bridge 类型 | `@shopify/app-bridge-types` | **0.7.2** | 仅 TypeScript 类型 |
| Polaris Web Components | `polaris.js` CDN | **稳定主线 1.x：`polaris-1.js`；当前 1.1** | 生产推荐固定稳定主线；精确冻结用 `https://cdn.shopify.com/shopifycloud/polaris-1.1.js`。`polaris.js` 是 legacy 1.x 入口，不会自动跨到 2.x。 |
| Polaris Web Components 类型 | `@shopify/polaris-types` | **1.1.0（stable）；`next` 为 2.0.0-rc.2** | 仅 TypeScript 类型；稳定主线用 `^1.1.0`，精确 1.1 用 `~1.1.0`，生产可进一步 exact pin。官方允许 2.0 RC 接入测试；ISO 默认把它放在迁移/预览通道，若 App 选择 RC 生产，需单独记录风险、回滚和回归证据。 |
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
node scripts/verify-app-store-requirements.mjs
node scripts/verify-app-design-guidelines.mjs
node scripts/verify-tokens.mjs
node scripts/verify-polaris-color-guidance.mjs
node scripts/verify-polaris-react-handbook.mjs
node scripts/verify-tooling-versions.mjs
node scripts/verify-links.mjs
```

- BFS 与 [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) 脚本分别校验 77 / 173 条要求、正文、拒审理由、数量和官方全文指纹。
- App Design Guidelines 脚本校验 11 个已审读页面的语义指纹，变化后要求重新审读正文及链接的当前 API。
- Token 与 color guidance 脚本校验 Zone B 历史资产及已审读 Polaris 颜色来源。
- Polaris React 脚本校验归档手册的 260 个来源落点与 121/534/62 系统清单；传入 `--source-root` 时还核对完整源码 hash。
- Tooling 脚本核对 npm 当前版本、官方 React Router 模板的依赖范围与 Node engine；发现新主版本时必须先读迁移说明，不能只改版本号。
- Links 脚本校验仓库内 Markdown 相对链接。
- 脚本通过只代表“规范源和仓库结构对齐”，不代表任何真实 App 已满足要求。

GitHub Actions 会在 push、pull request、手动触发和每周一运行这些规范检查，配置见 [.github/workflows/verify-iso.yml](.github/workflows/verify-iso.yml)。

---

## 关键版本兼容坑

- **Node**：当前 CLI 要求 `>=22.12.0`；官方 React Router 模板当前要求 `>=22.12`。团队基线使用受支持的 Node 22 LTS。
- **Polaris 版本选择**：新项目加载 `https://cdn.shopify.com/shopifycloud/polaris-1.js`；需要可复现构建时固定 `polaris-1.1.js`，并将类型对齐到 `@shopify/polaris-types@~1.1.0`。截至 2026-10-09，Polaris 2.0 的最新类型预览是 `@shopify/polaris-types@2.0.0-rc.2`。官方允许加载 `polaris-2.0-rc.js` 做迁移和测试；ISO 默认将 RC 与稳定生产清单分开。若 App 选择 RC 生产，须记录为 App-specific decision、同步 runtime/types 并保留回滚与真实回归证据，不能把 RC 结果写成稳定 2.0。
- **React Router Polaris 固定**：React Router 模板要固定 `polaris-1.1.js` 时，`AppProvider.polarisUrl` 与服务端 `shopifyApp({polarisUrl})` 必须使用同一 URL，并要求 `@shopify/shopify-app-react-router` 2.1.0 或更高版本；版本未满足时保持官方模板默认的稳定 channel，不要只改其中一处。
- **Polaris 2.0 迁移窗口**：新 Admin 视觉正在逐步推出；BFS App Home 需要在 **2027-05-01** 前完成视觉适配。新旧 Admin、Admin 外页面都要回归；固定/粘性底部内容使用 `--shopify-safe-area-inset-bottom`。
- **React Router 3.0**：npm 当前主版本要求 Node `>=22`，官方模板已使用 `^3.0.1`；升级既有 App 时按官方迁移说明单独回归认证、登录、路由和 webhooks。
- **Polaris 运行时**：`@shopify/polaris-types` 不包含组件运行时；新项目由单一 Polaris CDN build 加载 Web Components。App Bridge 使用独立的 `https://cdn.shopify.com/shopifycloud/app-bridge.js`，不与 Polaris 一起版本化。
- **React → Web Components**：按 route/self-contained feature 迁移；React controlled fields 需要 React 19；`.Polaris-*` CSS 不能穿透 Shadow DOM。迁移前后不要同时加载多个 Polaris build。
- **React 组件**：`@shopify/polaris` 仓库已归档；不能因为旧示例存在就继续作为新开发基线。
- **stylelint**：`@shopify/stylelint-polaris` 16.0.7 只兼容 stylelint 14/15；不要为了引入它破坏现代 App 的 lint 工具链。
- **token 快照**：改库 token 时先跑 `node scripts/verify-tokens.mjs`；升版本先看 diff，再同步资产、Figma 与文档。
- **部署**：`shopify app deploy` 发布配置和 extensions，不会部署 React Router Web App 服务器。

> 脚手架起手代码不放这里——见 [scaffold/README.md](scaffold/README.md)。
