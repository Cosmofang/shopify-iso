# BFS 正文链接审读台账

> 目的：BFS requirements 是入口，不是全部实现说明。每个正文链接都要进入阅读，再把结论路由到开发阶段。

## 2026-08-18 审读结果

- BFS 原始 Markdown：651 行、77 条叶子要求。
- BFS 全文 SHA-256 仍为 `22fb100f84772089b484d47a22c511fdbb6fa13c4dc277833646f67f8f253b77`；Section 4 仍为 63 条拒审理由。
- App Store requirements 仍为 174 条叶子要求，全文 SHA-256 仍为 `52dc6cb5f377a919077c58c6032a55fd2c86d14e898603efae8228d8230052d2`。
- 正文内去重后的 `shopify.dev` 文档目标：**59**。
- 当前 59 个目标全部可达；旧 `.../s-app-nav` 路径的当前替代页为 [App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)。
- 11 个 App Design Guidelines 页面语义指纹全部未变；Page、Box、Section、Button、Text field、Select、Table、Modal、App nav、App window 与 Save Bar 当前 API 已复核。
- Changelog 在 2026-08-10 后没有新增 BFS、App Store 或 Polaris 审核规则；最新 BFS 变更仍是 2026-08-01 的 fulfillment services 三项阈值调整，已进入本仓 5.8.2、5.8.6、5.8.7。
- Partner Program Agreement 与 Shopify API License and Terms of Use 当前均标记 **Updated July 7, 2026**，本次复核未发现更新日期漂移；Partner standing 仍以 Distribution、违规通知和政策执行结果为证据。
- 另行进入：Partner Program Agreement、Shopify API License、政策执行、WCAG 2.1 AA、Web Vitals、Magic/Sidekick、Shopify Plus、归档 Fullscreen bar、dark patterns 等外部权威目标。

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
| Admin 集成 | App Bridge/App Home、session token、app nav、title bar、app window、modal、save bar、`app.extensions()` | [Integration](../05-engineering/integration.md)、[Authentication](../05-engineering/authentication.md)、组件章 |
| Storefront | Theme App Extensions/config、Asset API legacy、Online Store 2.0 | [Integration](../05-engineering/integration.md)、App Store Online store 类别 |
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
