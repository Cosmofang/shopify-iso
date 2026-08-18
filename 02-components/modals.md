# Modal 与 App window

> BFS 4.1.6 要求正确使用 `s-modal`；BFS 4.3.3 禁止页面加载、固定延时或无关操作触发 modal / popover。复杂沉浸式任务使用当前 `s-app-window`，不使用 deprecated Fullscreen bar。

## 选择组件

| 场景 | 组件 |
|---|---|
| 简短确认、聚焦设置、有限字段或详情预览 | `s-modal` |
| 长表单、多动态区块、复杂编辑器、需要完整视口的预览 | 独立页面或 `s-app-window` |
| 页面内引导、公告或持久状态 | section、banner 或 setup guide |

大表单不塞进最大尺寸 modal。自定义 fixed overlay 不是默认合规路径；只有官方组件确实无法表达且有书面例外依据时才进入 Zone B，并补齐等价的键盘、焦点、关闭和可访问性测试。

## 当前 `s-modal` 写法

```html
<s-button commandFor="edit-modal" command="--show">Edit details</s-button>

<s-modal id="edit-modal" heading="Edit details">
  <s-text-field label="Name"></s-text-field>
  <s-button slot="primary-action" variant="primary">Save</s-button>
  <s-button slot="secondary-actions" commandFor="edit-modal" command="--hide">
    Cancel
  </s-button>
</s-modal>
```

- 标题使用 `heading` 属性。
- CTA 必须放在 `primary-action` / `secondary-actions` slots，不放进 modal body。
- 打开动作由有明确标签的用户操作触发；可使用 `commandFor` 和 `--show`。
- 依赖组件内建的焦点陷阱、Esc、关闭与焦点回归，再做键盘实测。

## `s-app-window`

```html
<s-app-window id="editor-window" src="/app/editor"></s-app-window>
<s-button commandFor="editor-window" command="--show">Open editor</s-button>
```

- 只从 App body 中明确说明“将打开全屏任务”的按钮启动，不能从 App nav 启动，也不能页面加载时自动启动。
- App window 内容用 `s-page` 提供标题和主次操作，不再嵌套 Fullscreen bar。
- 有未保存修改时接 Save Bar，在退出前让商家 Save 或 Discard。
- 关闭后回到启动前上下文，不意外跳去其他页面。

## BFS 硬性验收

- `s-modal` 的标题和 action slots 符合 4.1.6。
- 全 App 不存在页面加载、固定延时或无关操作自动打开 modal / popover。
- 不使用 deprecated Fullscreen bar 代替当前 App window / page 结构。
- 红色仅用于错误或破坏性动作。

## ISO 质量门

- [ ] 每个浮层都有可复现的直接用户触发源
- [ ] Esc、关闭按钮、Tab/Shift+Tab、打开与关闭后的焦点顺序正确
- [ ] 大型或复杂表单已转页面/App window，而非强塞 modal
- [ ] App window 不从 App nav 启动，并能处理未保存修改
- [ ] 自定义 overlay 有 Zone B 理由和等价 a11y 自动/人工证据
