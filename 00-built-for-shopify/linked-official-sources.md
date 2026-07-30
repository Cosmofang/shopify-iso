# BFS 正文链接审读台账

> 目的：BFS requirements 是入口，不是全部实现说明。每个正文链接都要进入阅读，再把结论路由到开发阶段。

## 2026-07-24 审读结果

- BFS 原始 Markdown：651 行、77 条叶子要求。
- 正文内去重后的 `shopify.dev` 文档目标：**59**。
- 直接可读取：**58**。
- 官方旧路径：**1** 个，即 `.../s-app-nav` 返回 404；当前替代页为 [App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)。
- 另行进入：Partner Program Agreement、Shopify API License、政策执行、WCAG 2.1 AA、Web Vitals、Magic/Sidekick、Shopify Plus、归档 Fullscreen bar、dark patterns 等外部权威目标。

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
