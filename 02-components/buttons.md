# 按钮 Buttons

> 当前实现以 Polaris Web Components 的语义变体为准。BFS 审核看视觉层级、对比度和语义是否正确，不把某个固定 hex 或每个页面只能有一个按钮当作独立门槛。

## 当前 API

| 变体 | 用途 | Web Components |
|---|---|---|
| `auto`（默认） | 由所在组件决定合适强调级别 | `<s-button>` |
| `primary` | 当前页面或相关动作组最重要的动作，谨慎使用 | `<s-button variant="primary">` |
| `secondary` | 支持性动作 | `<s-button variant="secondary">` |
| `tertiary` | 低强调动作、工具栏和行内操作 | `<s-button variant="tertiary">` |
| `tone="critical"` | 难以撤销的破坏性动作 | `<s-button variant="primary" tone="critical">` |

`plain` 不是当前 `s-button` 变体；文字中的导航使用 `s-link`。`fullWidth` 也不是当前 `s-button` 属性，按钮宽度由所在布局组件和语义上下文处理。

## 状态与属性

| 场景 | 写法 |
|---|---|
| 加载 | `<s-button loading>`，同时传达进度并阻止重复操作 |
| 禁用 | `<s-button disabled>`；附近说明禁用原因 |
| 表单提交 | `<s-button type="submit">` |
| 链接式按钮 | `<s-button href="/app/items">View items</s-button>` |
| 图标按钮 | `icon` + `accessibilityLabel` |
| 控制浮层 | `commandFor="target-id"` + `command="--show|--hide|--toggle"` |

```html
<s-stack direction="inline" gap="base">
  <s-button variant="primary" type="submit">Save changes</s-button>
  <s-button variant="secondary">Cancel</s-button>
  <s-button
    variant="tertiary"
    icon="menu-horizontal"
    accessibilityLabel="More actions"
  ></s-button>
</s-stack>
```

## 层级规则

- BFS 4.2.5：在一组相关动作中，最合理、最安全的下一步应最突出。不是所有按钮都要同权重，也不是全页面机械地只能出现一个 primary。
- 官方 Layout 指南：交互式 Card 最多一个 primary action；Table action 使用 secondary styling。
- 页面标题栏的 `primary-action` 槽只放当前页面的一个主操作；其他动作放 `secondary-actions` 或菜单。
- `critical` 只用于错误或破坏性操作；普通取消、升级、促销和状态不使用红色。
- 标签以强动词开头，尽量使用“动词 + 名词”，sentence case，不加句号。

## Do / Don't

- 使用组件变体和语义 tone，让 Shopify 控制当前视觉值和交互态。
- 异步操作优先使用 `loading`；暂时禁用时说明原因。
- 图标按钮始终提供准确的 `accessibilityLabel`。
- 不用 CSS 覆盖官方按钮的背景、边框、圆角或状态色。
- 不把历史绿色、品牌色或当前碰巧渲染出的深色值写成永久 BFS 合同。
- 不用多个 primary 让同一相关动作组失去明确主次。

## BFS 与 ISO 验证

| 层级 | 验证 |
|---|---|
| BFS 4.1.1 | 视觉接近 Shopify Admin；文字对背景满足 WCAG 2.1 AA；无明显自绘或异常状态 |
| BFS 4.2.5 | 相关动作组的视觉最强按钮对应最合理动作 |
| BFS 4.3.3 | 红色只用于错误或破坏性操作 |
| ISO 质量门 | 键盘可达、焦点可见、loading 防重复、图标按钮名称准确 |

最终在真实 Admin 中验证组件实际渲染，不以 `rgb(...)` 或固定 hex 断言合规。
