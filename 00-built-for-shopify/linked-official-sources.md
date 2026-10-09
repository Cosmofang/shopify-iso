# BFS 正文链接审读台账

> 文档版本：`1.3.1`
> 最后修改：`2026-10-09 10:45 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 本次增补来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Post-purchase UX](https://shopify.dev/docs/apps/build/checkout/product-offers/ux-for-post-purchase-product-offers)
> 本次官方来源：[BFS requirements Markdown](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) · [BFS Changelog](https://shopify.dev/changelog?filter=built_for_shopify) · [App Design Guidelines](https://shopify.dev/docs/apps/design) · [Polaris Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) · [React Router official template](https://github.com/Shopify/shopify-app-template-react-router/blob/main/package.json)

> 目的：BFS requirements 是入口，不是全部实现说明。每个正文链接都要进入阅读，再把结论路由到开发阶段。

## 2026-10-09 审读结果

- BFS requirements 当前仍为 77 条叶子要求和 63 条 Section 4 拒审理由，SHA-256 `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93`；本次未发现编号、标题、正文语义或拒审理由变化。
- App Store requirements 当前为 173 条叶子要求，分区 `1=20`、`2=17`、`3=6`、`4=24`、`5=106`，SHA-256 `cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e`；此前移除 `5.8.4` 的变更仍是当前状态。
- Polaris Web Components versioning 当前文档仍声明 Polaris 1.1，稳定生产入口为 `polaris-1.js`；页面 SHA-256 `4d4e13a00f0810fff0ab10669e8b6fc9cf17e8fb4b52dad3eaf7757a21dcd964`。组件入口 SHA-256 为 `1f0fc4fede284a89f55c2f4ac171444b3c471efdbf825ba98ab5327518b348a1`。
- `@shopify/polaris-types` stable 为 `1.1.0`，`next` 为 `2.0.0-rc.2`（2026-10-05）；stable 与 RC2 均声明 62 个 tags。RC2 的 `dist/custom-elements.json` SHA-256 为 `4cdc4989ff94773ce5c015c27eac0308916dbacc54e2a4f1e469f6c95747add5`。
- 官方 CDN `polaris-2.0-rc.js` 返回 200；`polaris-2.js` 和 `polaris-2.0.js` 返回 404。本地 HTTP 状态是验证证据，稳定/预览分类仍以官方 versioning 文档与 changelog 为准。
- Polaris 2.0.0-rc.1（2026-10-01）更新了 Table、Tooltip/Section slot、Select、Badge、Banner、ColorPicker，并修复 Section/Page 窄屏布局、二级动作、slotted actions、事件冒泡和挂载性能；这些变化仍属于 RC 预览合同。
- Shopify CLI npm latest 为 `4.9.2`；`@shopify/shopify-app-react-router` npm latest 为 `3.0.2`；官方 React Router 模板当前使用 Node `>=22.12`、`@shopify/shopify-app-react-router ^3.0.1`、`@shopify/app-bridge-react ^4.2.4` 和 `@shopify/polaris-types 1.0.1`。npm latest、模板依赖和稳定 CDN 继续分开记录。

## 2026-09-28 审读结果

- BFS 当前 Markdown：77 条叶子要求、63 条设计拒审理由；当前 SHA-256 为 `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93`。本次漂移来自官方示意图/排版和部分链接更新；逐条标题、正文语义与拒审理由仍与本地快照一致。
- 3.2.2 Asset API 当前链接为 `/docs/api/admin-rest/latest/resources/asset`；5.1.2、5.6.3、5.7.1、5.13.3 customer segment action extension 当前统一链接到 `/docs/apps/build/marketing/customer-segments`。动态 `api-terms?shpxid=...` 不复制到 ISO，保留 canonical URL。
- [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) 当日复核由 174 条变为 **173 条**，全文 SHA-256 更新为 `cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e`。正文差异只有移除原 `5.8.4`“最多连续 2 次 post-purchase requests”；原 `5.8.5` 等编号保留。当前 [Post-purchase UX](https://shopify.dev/docs/apps/build/checkout/product-offers/ux-for-post-purchase-product-offers#user-experience) 写最多连续展示 3 个 offer；API 可应用次数仍需独立核对，详见 [App Store 变更边界](app-store-requirements.md)。
- 正文内去重后的 `shopify.dev` 文档目标：**59**。
- 当前 59 个目标全部可达；旧 `.../s-app-nav` 路径的当前替代页为 [App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)。
- 11 个 App Design Guidelines 页面中，`apps/design/content` 当前规范化指纹为 `7aba75af1ff7af6da955bbf4c87adb76667cacd3c5340b6382d44cb336bebae0`；其余页面指纹未变。Content 语义已复核，仍覆盖 voice/tone、plain language、grade 7、术语一致、主动语态、guide don't prescribe 和 grammar。
- Changelog 未找到本次认证措辞更新的独立公告；这是 requirements.md 的静默正文漂移。最新有记录的 BFS 指标变更仍是 2026-08-01 的 fulfillment services 三项阈值调整，已进入本仓 5.8.2、5.8.6、5.8.7。
- Partner Program Agreement 与 Shopify API License and Terms of Use 当前均标记 **Updated July 7, 2026**，本次复核未发现更新日期漂移；Partner standing 仍以 Distribution、违规通知和政策执行结果为证据。
- 另行进入：Partner Program Agreement、Shopify API License、政策执行、WCAG 2.1 AA、Web Vitals、Magic/Sidekick、Shopify Plus、归档 Fullscreen bar、dark patterns 等外部权威目标。
- Polaris 当前状态：生产稳定线为 `polaris-1.js`/`polaris-1.1.js`，`@shopify/polaris-types` 为 1.1.0（62 tags，官方公开组件页与 types manifest 口径分开）；`polaris-2.0-rc.js` 仍是 RC，BFS App Home 视觉适配截止 **2027-05-01**。App Bridge CDN 独立版本化。

### App Design Guidelines 全量补充

除 BFS 正文直接链接外，已逐页审读以下 11 个当前设计入口：Design overview、App structure、Layout、Visual design、Navigation、Content、App home page、Onboarding、Marketing、Forms、Alerts。

| 官方页面 | ISO 主要落点 |
|---|---|
| App Design Guidelines | [Start Here](../START-HERE.md)、[Design requirements](requirements.md) |
| App structure | [App structure](../03-patterns/app-structure.md)、[Modal/App window](../02-components/modals.md) |
| Layout | [Layout responsive](../01-foundations/layout-responsive.md)、[Sections](../02-components/cards-sections.md) |
| Visual design | [Color](../01-foundations/color.md)、[Typography](../01-foundations/typography.md)、[App icon](../04-partner-dashboard/app-icon.md) |
| Navigation | [Navigation](../02-components/navigation.md)、[Dashboard config](../04-partner-dashboard/config.md) |
| Content | [Content](../01-foundations/content.md) |
| App Home page | [App Home](../03-patterns/app-home.md) |
| Onboarding | [Onboarding](../03-patterns/onboarding.md) |
| Marketing | [Marketing](../03-patterns/marketing.md) |
| Forms | [Forms & fields](../02-components/forms-fields.md) |
| Alerts | [Banners](../02-components/banners.md)、[Toasts](../02-components/toasts.md)、[Errors](../03-patterns/errors-and-feedback.md) |

```bash
node scripts/verify-app-design-guidelines.mjs
```

该校验忽略 frontmatter 与图片 URL，但正文和实现链接变化会失败。失败后必须重新审读变化页面及其链接的当前 Web Components，再更新 ISO 与指纹。

运行以下命令可重新逐项读取并报告标题、最终 URL 和行数：

```bash
node scripts/audit-bfs-linked-sources.mjs
```

该脚本是人工审读工具，不放入每次 PR 的 CI；BFS 原文指纹变化时，先运行它并审查新增/变更链接。

## 按开发阶段路由

| 阶段 | 已进入的来源组 | ISO 落点 |
|---|---|---|
| 资格与治理 | BFS overview/changelog、App Store requirements/best practices、Partner/API 条款 | [App Store 前置](app-store-requirements.md)、[Start Here](../START-HERE.md) |
| 性能 | Performance overview、Admin/OAuth Web Vitals、Checkout performance、web.dev Web Vitals | [Performance](../05-engineering/performance.md) |
| Admin 集成 | App Bridge/App Home、ID token authentication、app nav、title bar、app window、modal、save bar、`app.extensions()` | [Integration](../05-engineering/integration.md)、[Authentication](../05-engineering/authentication.md)、组件章 |
| Storefront | Theme App Extensions/config、当前 Asset API reference、Online Store 2.0 | [Integration](../05-engineering/integration.md)、App Store Online store 类别 |
| 设计 | App Design Guidelines、WCAG、Magic/Sidekick、deprecated Fullscreen bar | [Design](requirements.md)、[Color](../01-foundations/color.md) |
| BFS 类别 API | Web Pixels、segments、discounts、Flow、bundles、fulfillment、returns、subscriptions、Customer Account | [Category-specific](../05-engineering/category-specific.md) |

## 审读纪律

1. requirements 的句子决定“必须做什么”；链接页决定“当前怎样实现”和“有哪些例外”。
2. 目标页比入口页宽松时，以 BFS 更严格条件为准；Asset API 的 4 类 scope 豁免与 BFS 3 类例外就是典型。
3. 链接跳转到归档页面时，只用于理解禁止/迁移背景，不作为新项目技术基线。
4. API reference 只在 App 命中对应类别时进入实现；不为“看起来合规”接入无关 API。
5. 官方链接失效或内容变更时，记录原 URL、当前 URL、影响条款、ISO 修改和验证日期。

## 三层规范边界

| 层级 | 来源 | 用法 |
|---|---|---|
| 官方硬要求 | App Store requirements、BFS requirements 与拒审理由 | 决定 pass/fail，保留 requirement ID 与证据 |
| 官方设计指导 | App Design Guidelines、Patterns、当前组件/API best practices | 决定推荐实现和质量方向；不能虚构成新的 BFS 叶子条款 |
| ISO 保守基线 | 多视口、44px 自定义触控目标、Zone B 额外测试等 | 扩大回归覆盖；必须明确标成内部质量门 |
