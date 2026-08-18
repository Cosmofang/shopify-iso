# 导航 Navigation

> BFS 4.1.3 / 4.1.4 与官方 Navigation 指南共同决定 App 名、首页入口和 App nav。BFS 硬判据与信息架构建议分开验收。

## 当前 App nav 写法

```html
<s-app-nav>
  <s-link href="/app" rel="home">Home</s-link>
  <s-link href="/app/orders">Orders</s-link>
  <s-link href="/app/analytics">Analytics</s-link>
  <s-link href="/app/settings">Settings</s-link>
</s-app-nav>
```

首页路由使用 `rel="home"`。它为 App name 提供首页目标，但不会渲染成重复的可见 Home 导航项。不要删除首页路由关系后仅依赖偶然重定向，也不要再添加另一个可见 Home 项。

## BFS 硬性判据

- 桌面 pinned 状态下，App 名完整可见且没有省略号。
- 使用 Shopify Admin 的 App nav，不自绘主导航。
- 进入子页面后，相关父导航项保持正确高亮。
- App name 直接打开首页，不存在额外的可见 Home 项。
- 导航项不使用 emoji。

## 官方 Navigation 指南

- Admin 内 App name 不超过 **20 个字符**；它可以短于 App Store listing name，但两者应保持可识别的一致性。
- 导航标签短、可扫读，优先使用名词，通常 1-2 个词。
- 使用尽可能少的类别。超过 7 个可见项后，第 7 项及以后会进入 View more，应主动精简。
- 不在 App body 复制一套导航，也不在 page header 放主导航。
- 关键操作和主工作流留在 Shopify Admin 内；子页提供 Back button 或 breadcrumb 返回父页。
- Tabs 仅作为少量二级导航；切换只改变 tabs 下方内容，tabs 不换行、不移动。

## App name 与页面标题

- App name 用于识别产品，不塞功能描述；描述放 App Store listing。
- 页面标题短且准确，一页聚焦一个主要目的。
- 页面操作标签清晰、可预测，以强动词开头，推荐“动词 + 名词”。

Dashboard 配置与版本发布流程见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。

## 自检

- [ ] `s-app-nav` 有 `rel="home"` 的首页 link，且页面上没有重复可见 Home 项
- [ ] App name 不超过 20 字符，并在桌面 pinned 后无截断
- [ ] 所有子路由都正确高亮父导航项并可返回父页
- [ ] 可见导航项精简、无 emoji、无动词句或重复 body 导航
- [ ] App Store listing name 与 Admin app name 可识别为同一 App
