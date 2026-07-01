# 表单与字段 Forms & Fields

> BFS 4.2.4 核心：**每个错误字段必须有清晰、可行动的文字提示，只标红框不够。**

---

## 错误信息模式（4.2.4）

**红框 + 具体文案 + 可行动指引。**

```html
<!-- ✅ Web Components：error 属性给文案 -->
<s-text-field
  label="Email"
  value=""
  error="请输入有效的邮箱地址，例如 name@store.com">
</s-text-field>
```
```jsx
/* ✅ React 对照 */
<TextField
  label="Email"
  value={email}
  onChange={setEmail}
  error="请输入有效的邮箱地址，例如 name@store.com"
  autoComplete="email"
/>
```

### 好文案 vs 坏文案
| ❌ 坏 | ✅ 好 |
|------|------|
| （只红框，无字） | 「请输入有效的邮箱地址，例如 name@store.com」 |
| "Invalid" | 「密码至少 8 位，需含字母和数字」 |
| "Error" | 「该店铺域名已被占用，请换一个」 |
| "必填" | 「请填写 API Key（在 设置 → 集成 获取）」 |

文案三要素：**哪里错 + 为什么 + 怎么解决**。

---

## 焦点环（保护圆角）

输入框/自定义控件聚焦时要有清晰焦点环，且**别用 `outline` 削掉圆角**——用 `box-shadow`：

```css
/* ✅ 焦点环用 box-shadow，保留圆角，对比 ≥ 3:1 */
.field:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--p-color-border-focus); /* #005bd3 */
}
/* ❌ 别这样：既丑又破坏圆角，或干脆删了没焦点提示 */
.field:focus { outline: none; }         /* ❌ 无焦点提示，键盘不可用 */
.field:focus { outline: 2px solid; }    /* ❌ 方角切掉圆角 */
```

> Polaris `s-text-field` 自带合规焦点环；**自定义（Zone B）控件**才需手动加。

---

## ✅ Do
- 每个字段都有 `label`（可见或 `labelHidden` + aria）。
- 校验失败时同时给：`error` 文案 + 红边框（组件自动）。
- 必填/格式/占位说明写清楚。
- 占位符文字用 `#616161` 起步（≥4.5:1）。
- 提交按钮在 loading 时 `loading` 态防重复提交。

## ❌ Don't
- ❌ 只把边框标红、无文字。
- ❌ 用 `placeholder` 代替 `label`。
- ❌ `outline:none` 裸删焦点。
- ❌ 错误文案泛泛（"出错了"）。
- ❌ 占位符/说明用 `#8c9196`（对比不足）。

---

## BFS 注意
- **4.2.4**：错误必须有可行动文案。逐个校验分支都要验到。
- **4.1.1**：字段文字/占位对比 ≥ 4.5:1；焦点环 ≥ 3:1。
- **通用**：键盘可达、焦点可见。

## 自检
- [ ] 触发每个校验分支都出现文字提示
- [ ] 文案含解决方向
- [ ] 焦点环可见且不破坏圆角
- [ ] 无 `#8c9196` 占位符
