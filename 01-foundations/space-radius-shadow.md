# 间距、圆角、边框与阴影

> 官方来源：[App Design Guidelines — Layout](https://shopify.dev/docs/apps/design/layout) · [Box](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/box) · [Section](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/section)。BFS 不公布“Card 必须 12px、按钮必须 8px、Modal 必须 20px”之类像素阈值。

## 1. 间距

- Shopify Admin 使用 4px spacing grid，这是当前官方 Layout 指南。
- App Home 优先使用组件语义值，例如 `padding="base"`、`gap="small"`，让 CDN 中的当前 Polaris 实现决定实际值。
- `s-section padding="base"` 会使用适合当前上下文的间距；需要 table 或 image 通栏时才用 `padding="none"`，并给其余内容恢复合适 padding。
- 自定义 Zone B 仍须保持 4px grid、同页信息密度一致，并记录官方组件不能满足需求的原因。

## 2. 圆角与边框

`s-box` 当前接受语义圆角：`small-200`、`small-100`、`small`、`base`、`large`、`large-100`、`large-200`、`none`。使用最接近组件层级的语义值，不从旧 token 快照复制 px。

```html
<s-box padding="base" background="subdued" border="base" borderRadius="base">
  <s-paragraph>Inventory is syncing.</s-paragraph>
</s-box>
```

- 标准按钮、字段、section、banner、modal 的圆角和边框交给组件。
- `s-box` 只用于官方结构组件无法表达的局部分组；不要用它重做一套 Card 系统。
- 边框承担控件识别、焦点或选中状态时，要满足适用的 WCAG 非文字对比度；纯装饰分隔线不自动等同于控件边界。

## 3. 阴影

- 标准容器和 overlay 的 elevation 由当前组件控制。例如 `s-section` 会按层级和设备选择合适外观。
- 不给每张卡片手工套固定 shadow，不用夸张阴影制造与 Admin 不一致的浮层层级。
- 自定义 overlay 是高风险例外；优先使用 `s-modal`、`s-app-window`、popover 和当前 App Home compositions。

## 4. 来源边界

`assets/polaris-tokens.css` 和 `assets/design-tokens.json` 是归档 Polaris React 的迁移快照，只供遗留 Zone B 审计。它们不是当前 Web Components 的视觉合同，也不能证明 BFS 通过。

## 验收

- [ ] 标准组件没有被 CSS 覆盖圆角、边框或阴影。
- [ ] 自定义容器有明确任务，不存在无意义嵌套卡片。
- [ ] 间距保持一致，没有明显偏离 Shopify Admin。
- [ ] 没有把项目 px 值标成官方 BFS 硬要求。
