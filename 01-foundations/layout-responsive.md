# 布局与响应式（Layout & Responsive）

> 官方来源：[App Design Guidelines — Layout](https://shopify.dev/docs/apps/design/layout) · [Page](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page) · [Grid](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/grid) · [Stack](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/stack)。BFS 4.1.2 的硬判据仍以 [requirements.md](../00-built-for-shopify/requirements.md) 为准。

## 当前布局合同

- 页面先使用 App Home template，再用 `s-page`、`s-section`、`s-grid`、`s-stack` 组合。
- `s-page` 使用语义宽度 `inlineSize="small|base|large"`；不要把 1280px、998px、660px 或某个历史页面宽度写成 Shopify/BFS 阈值。
- 表单和单一任务通常从 `small` 开始；普通页面使用 `base`；数据密集 dashboard 或 resource index 评估 `large`。
- `s-page` 的 `aside` 只在 `inlineSize="base"` 渲染。页面需要 title、breadcrumb 和 actions 时使用对应 slots，不自绘重复 header。
- Shopify Admin 使用 4px spacing grid。优先让 `s-page`、`s-section` 和 `s-stack` 选择上下文相关间距，不复制历史像素表。

```html
<s-page heading="Products" inlineSize="large">
  <s-link slot="breadcrumb-actions" href="/app">Home</s-link>
  <s-button slot="primary-action" variant="primary">Create product</s-button>
  <s-section heading="Products">
    <s-grid gridTemplateColumns="repeat(auto-fit, minmax(16rem, 1fr))" gap="base">
      <!-- content -->
    </s-grid>
  </s-section>
</s-page>
```

## BFS 4.1.2 硬判据

1. 移动设备上整页不能依赖横向滚动。
2. 内容不能完全不可访问；折叠内容要能展开，宽内容要换行、重排或在局部容器内可访问。
3. 内容不能不合理压缩；桌面多列在窄屏应按任务重排或堆叠。

局部表格或图表可以使用明确、键盘可操作的局部横向滚动；不能让整个 App body 横滚，也不能裁掉没有恢复机制的内容。

## 官方设计指南

- Resource index 数据列较多时使用 full-width/`large` 页面。
- 视觉编辑器使用双列，使控件与实时预览同时可见；窄屏再重排。
- Settings 使用当前 Settings template，让设置标题、说明和字段保持清晰关系。
- 同一页面的信息密度保持一致；低密度任务使用宽松间距，数据密集任务使用紧凑但一致的间距。
- 多数内容放入 `s-section` 等容器，不把大段正文直接铺在页面背景上。

## 验证基线

`375 / 390 / 412 / 768px`、16px 移动边距和 44x44px 触控目标是 ISO 的保守测试覆盖，不是 Shopify 公布的 BFS 数值阈值。最终状态必须同时通过 Shopify 手机 App 真机、键盘和内容可访问性验证。

## 禁止

- 固定大宽度导致整页横滚。
- 假定一个像素断点适用于所有 Web Components；优先使用组件响应行为和 container-relative layout。
- 用 `overflow:hidden` 裁掉商家需要操作或阅读的内容。
- 在 ISO 中把项目页面宽度、Figma frame 或历史 Polaris React breakpoint 写成官方 BFS 条件。
