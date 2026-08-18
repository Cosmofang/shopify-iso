# 表单与字段 Forms & Fields

> BFS 4.2.4 要求错误持久、红色、就近且在商家交互后出现；BFS 4.1.5 要求合理表单接入 Contextual Save Bar。官方 Forms 指南还规定复杂表单的组织方式。

## 字段错误

```html
<s-text-field
  label="Email"
  name="email"
  error="Enter a valid email address, such as name@store.com"
></s-text-field>
```

- 直接在受影响字段下显示错误，说明问题和解决方向。
- 等商家离开字段或提交后再显示，不在输入过程中或首次加载时提前报错。
- 错误保持可见直到解决，不能只用会自动消失的 toast。
- 红色之外还要有文字，必要时配 error icon，不能只靠颜色。
- 页面、section 或 modal 范围的错误放在对应容器顶部；modal 只显示 modal 自身发生的错误。

## 组织复杂表单

- 输入内容随前面选择变化时使用 progressive disclosure，只展示当前相关字段。
- 超过 5 个输入时，在一个 Card 内用带标题的 sections 分组，或拆成多个带标题的 Cards。
- 一个对象的定义或编辑通常使用独立页面，帮助商家专注。
- 大型表单、多个动态 sections 或多列编辑器不要放进 max-size modal；改用页面或 App window。
- 字段使用可见 label；placeholder 只补充示例，不代替 label。

## Save Bar

```html
<form data-save-bar data-discard-confirmation>
  <s-text-field label="Store name" name="storeName"></s-text-field>
</form>
```

- 合理的设置和编辑表单使用当前 Save Bar；dirty 时提供 Save 与 Discard，并拦截所有离开路径。
- `data-save-bar` 与程序化 Save Bar 二选一，同一页面不混用。
- 官方 Forms 指南认为持续校验或 autosave 与标准 Shopify Admin 保存体验不一致。
- App window 内表单同样需要 Save Bar；退出前处理未保存修改。

## 焦点与可访问性

- 官方 `s-*` 字段负责其默认焦点样式，不覆盖或删除。
- Zone B 自定义控件必须有清晰的 `:focus-visible` 表示、键盘顺序和足够非文本对比度，但不强制只能用 `box-shadow`。
- 禁用字段或按钮时，附近说明原因；异步提交优先用 loading 反馈。

## BFS 硬性验收

- [ ] 每个错误分支都有持久、红色、就近且可行动的文字
- [ ] 字段在交互前不显示错误，错误不只在页面顶部或 toast 中
- [ ] dirty 表单的所有离开路径都经过 Save / Discard
- [ ] 红色只用于错误；非错误状态不误用 critical

## 官方指导 / ISO 质量门

- [ ] 条件字段采用 progressive disclosure
- [ ] 超过 5 个输入已按标题分组，大型表单不在 modal
- [ ] label、单位、格式和用途上下文完整
- [ ] 键盘焦点可见；提交有 loading，失败后输入不会无故丢失
