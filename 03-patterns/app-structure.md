# App structure

> 官方 App structure 定义 Admin chrome、App nav、App header、page header、overflow menu 和 App body 的职责。App 只拥有合适的 body/extension 内容，不复制 Shopify chrome。

## 结构职责

- Shopify Admin 提供全局框架；App nav 负责 App 页面间移动。
- App header 由 icon、App name 和框架操作构成；page header 命名当前页面并承载页面级主次操作。
- Overflow menu 保留 About this app、Support 等平台内容，当前不可由 App 自定义。
- App body 承载主要工作，使用当前 Layout、Patterns 和 Web Components。

## App window

- 仅用于复杂编辑器、沉浸式预览等完整视口能明显改善体验的聚焦任务。
- 只能由 App body 中明确按钮启动，不能由 App nav 启动，也不能自动打开。
- 未保存修改使用 Save Bar；退出后返回启动上下文。
- 不在 App window 内使用 deprecated Fullscreen bar。详细实现见 [../02-components/modals.md](../02-components/modals.md)。

## Admin UI extensions

- Admin block 在资源详情页提供上下文数据/功能；建议内容高度低于 600px，过长时分页。
- 输入字段保持可见；需要更多空间或复杂交互时从 block 启动 Admin action，或通过 Admin link 路由到 App。
- Admin action 适合离散、快速动作；官方指导避免内容超过 1200px，并避免超过两步分页。
- 长表单、多动态 sections、多列编辑器等复杂任务应路由到 App，而不是硬塞 block/action。
- Block 有说明用途的 empty state；表单可接 extension form / Contextual Save Bar。
- 不在 Admin UI extension 中展示 App/相关 App 促销、广告或索取评论，这是 App Store 要求。
- Block 与 Action 可以组合，但不要重复同一内容和价值。

## BFS / App Store 验收

- BFS 4.1.1 / 4.1.4：不自绘 Admin chrome 或主导航，页面结构与 Admin 熟悉一致。
- BFS 4.1.6：Modal / App window 使用当前结构和 slots。
- BFS 3.1.2：主要工作流留在 Shopify 内，关键操作不无故送去外站。
- App Store：App window 不从 App nav 启动；Admin UI extensions 不承载促销/广告/评分请求。

## 自检

- [ ] 每个结构区域职责单一，没有重复 title/nav/header
- [ ] App window 有明确使用理由、启动入口、退出上下文和未保存处理
- [ ] Blocks/actions 尺寸、空状态、输入可见性和复杂度符合当前指导
- [ ] Extension 中无营销、交叉推广或评论请求
