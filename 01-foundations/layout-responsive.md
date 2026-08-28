# 布局与响应式（Layout & Responsive）

> 文档版本：`1.1.0`
> 最后修改：`2026-08-28 10:31 CST (Asia/Shanghai)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[App Design Guidelines — Layout](https://shopify.dev/docs/apps/design/layout) · [Page](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page) · [Grid](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/grid) · [Stack](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/stack) · [BFS 4.1.2](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#mobile-friendly)
>
> 官方来源：[App Design Guidelines — Layout](https://shopify.dev/docs/apps/design/layout) · [Page](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page) · [Grid](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/grid) · [Stack](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/stack)。BFS 4.1.2 的硬判据仍以 [requirements.md](../00-built-for-shopify/requirements.md) 为准。

## 当前布局合同

- 页面先使用 App Home template，再用 `s-page`、`s-section`、`s-grid`、`s-stack` 组合。
- `s-page` 使用语义宽度 `inlineSize="small|base|large"`。官方 [Page reference](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page) 将 `base` 定义为默认 inline size，将 `large` 定义为保留留白的 full width；没有给出固定像素值。
- 官方示例用 `small` 承载表单/简单流程，用 `large` 承载数据密集 dashboard 或 analytics。普通页面从默认 `base` 开始，再按商家任务和信息密度选择。
- `large` 不等于无留白铺满浏览器，也不等于某个项目里的 1080px；`base` 同样不等于 998px。不要把 1280px、1080px、998px、660px 或历史页面宽度写成 Shopify/BFS 阈值。
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

## 一级页面宽度审计

同级页面不要求机械使用同一宽度，但宽度差异必须能由任务类型解释。逐页记录 `s-page inlineSize`、内层 max inline size、aside 使用和移动重排：

- 设置、编辑和单一任务页通常使用 `small` 或 `base`；dashboard、analytics 和列较多的 resource index 才评估 `large`。依据是当前 [Page use cases and examples](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/page)，不是项目视觉偏好。
- 不在语义 `s-page` 内再放一个未经说明的固定宽度容器，使实际宽度与 `inlineSize` 意图冲突。
- 确需自定义内层 max inline size 时，标记为 App 实现选择，并保存桌面、窄屏和内容溢出证据；不得称为 Polaris 或 BFS 固定宽度。
- `base` 页面需要 aside 时使用官方 `aside` slot；该 slot 在 `small` / `large` 下不会渲染。

## 验证基线

`375 / 390 / 412 / 768px`、16px 移动边距和 44x44px 触控目标是 ISO 的保守测试覆盖，不是 Shopify 公布的 BFS 数值阈值。最终状态必须同时通过 Shopify 手机 App 真机、键盘和内容可访问性验证。

## 禁止

- 固定大宽度导致整页横滚。
- 假定一个像素断点适用于所有 Web Components；优先使用组件响应行为和 container-relative layout。
- 用 `overflow:hidden` 裁掉商家需要操作或阅读的内容。
- 在 ISO 中把项目页面宽度、Figma frame 或历史 Polaris React breakpoint 写成官方 BFS 条件。
- 只比较 `s-page` 属性而忽略内层固定宽度、`min-width`、绝对定位或 body 横向溢出。
