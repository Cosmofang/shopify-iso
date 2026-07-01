# 按钮 Buttons

> BFS 4.1.1 核心。**主按钮 = 黑（`--p-color-bg-fill-brand`），破坏性 = 红，其余中性。**

---

## 变体 Variants

| 变体 | 外观 | 用途 | Web Components | React |
|------|------|------|----------------|-------|
| Primary | **黑底白字** | 页面主操作（1 个/区域） | `<s-button variant="primary">` | `<Button variant="primary">` |
| Secondary（默认） | 白底 + 灰边 | 次要操作 | `<s-button>` | `<Button>` |
| Tertiary | 更轻 | 第三级操作 | `<s-button variant="tertiary">` | — |
| Plain / link | 无底纯文字 | 链接式操作 | `<s-button variant="plain">` | `<Button variant="plain">` |
| **Critical** | **红**（destructive） | 删除等破坏性 | `<s-button variant="primary" tone="critical">` | `<Button variant="primary" tone="critical">` |

## 尺寸 / 状态

| 状态 | 写法 |
|------|------|
| Loading | `<s-button loading>` / `<Button loading>` |
| Disabled | `<s-button disabled>` / `<Button disabled>` |
| 图标按钮 | 带 `icon`，仍需 `accessibilityLabel`/`aria-label` |
| 全宽 | `fullWidth`（移动端 CTA 常用） |

---

## ✅ Do

```html
<!-- 主操作：黑主按钮，继承 --p-color-bg-fill-brand -->
<s-button variant="primary" onclick="save()">Save</s-button>

<!-- 删除：红 critical -->
<s-button variant="primary" tone="critical" onclick="remove()">Delete</s-button>

<!-- 次要操作 -->
<s-button onclick="cancel()">Cancel</s-button>
```
```jsx
/* React 对照 */
<Button variant="primary" onClick={save}>Save</Button>
<Button variant="primary" tone="critical" onClick={remove}>Delete</Button>
<Button onClick={cancel}>Cancel</Button>
```

- 一个区域**只有一个**主按钮。
- 主按钮**永远靠 `variant="primary"` 取色**，让它继承 Admin 的黑。
- 破坏性操作才用 `tone="critical"`。

## ❌ Don't

```css
/* ❌ 写死绿色（旧品牌绿，BFS 4.1.1 直接打回） */
.cta { background: #008060; color:#fff; }
/* ❌ 写死品牌橙 */
.cta { background: #D86A2A; }
```
- ❌ 用 CSS 覆盖主按钮背景（哪怕改成黑，也应交给 token）。
- ❌ 一屏多个主按钮，主次不分。
- ❌ 非破坏性操作用红色按钮（违反 4.3.3）。
- ❌ 浅底按钮放白字（对比 < 4.5:1）。

---

## BFS 注意
- **4.1.1**：主按钮必须为 `--p-color-bg-fill-brand`（黑）。绿色/彩色主按钮 = 打回。
- **4.1.1**：按钮文字对背景 ≥ 4.5:1（黑底白字 17.4:1 ✅）。
- **4.3.3**：红仅用于破坏性/错误。
- **4.1.2**：移动端触控目标 ≥ 44px；主 CTA 可 `fullWidth`。

## 自检
- [ ] 主按钮 computed background = `rgb(26,26,26)`
- [ ] 无 `#008060` / 品牌色主按钮
- [ ] 红按钮仅出现在删除/破坏性
- [ ] 每区仅一个主按钮
