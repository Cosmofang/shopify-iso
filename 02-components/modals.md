# 弹窗 Modals

> BFS 4.3.3 核心：**禁止自动弹出。** 弹窗只能由商家主动点击触发。

---

## 何时可用 / 不可用

| 场景 | 可否用 Modal |
|------|-------------|
| 商家点「编辑/删除」后确认 | ✅ 可（用户主动触发） |
| 商家点「新建」打开表单 | ✅ 可 |
| 页面加载就弹引导/公告 | ❌ 禁止 → 改用 Banner |
| 停留 N 秒后自动弹 | ❌ 禁止 |
| 做 A 操作弹出无关的 B | ❌ 禁止 |
| 订阅/评分/促销自动弹 | ❌ 禁止 |

---

## 写法

```html
<!-- Web Components：由按钮点击打开 -->
<s-button onclick="document.getElementById('m').show()">Edit FAQ</s-button>
<s-modal id="m" heading="Edit FAQ">
  <s-text-field label="Question"></s-text-field>
  <s-button slot="primary-action" variant="primary">Save</s-button>
  <s-button slot="secondary-actions">Cancel</s-button>
</s-modal>
```
```jsx
/* React 对照 */
const [open, setOpen] = useState(false);   // ✅ 默认 false，由点击置 true
<Button onClick={() => setOpen(true)}>Edit FAQ</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Edit FAQ"
  primaryAction={{content:'Save', onAction:save}} />
```

---

## ✅ Do
- 默认关闭，`open`/`show()` 只在**用户点击**后调用。
- 焦点陷阱：打开时焦点进 modal，`Esc` 可关，关后焦点回触发元素（Polaris `s-modal`/`Modal` 自带）。
- 主操作黑按钮、破坏性红按钮。

## ❌ Don't
```jsx
// ❌ 加载即弹 —— BFS 4.3.3 直接打回
useEffect(() => { setOpen(true); }, []);
// ❌ 定时弹
setTimeout(() => setOpen(true), 3000);
```
- ❌ `useEffect(open, [])` / `setTimeout` 自动打开。
- ❌ 用 modal 做本该常驻页面的引导/公告。
- ❌ 无 `Esc`/关闭按钮的强制弹窗。

## BFS 注意
- **4.3.3**：全 App 搜 `useEffect`/`setTimeout` + open/show，清掉所有自动弹出。
- 引导/公告改 [banners.md](banners.md)。
- 焦点管理、键盘可达（通用 a11y 要求）。

## 复杂弹窗：硬化的自定义 overlay

`s-modal`（App Bridge）对**复杂实时交互内容**约束较多（常走 iframe、尺寸/交互受限）。当内容确实复杂（实时配额结算、内嵌编辑器、多步向导、带筛选的长列表）时，**允许用自定义 fixed-overlay `<div>`**，但必须**硬化到与 `s-modal` 同等的 a11y + 规范**：

- **不自动弹**：`open` 默认 false，只在用户点击后置 true（4.3.3）。
- **role/aria**：内容器 `role="dialog"` + `aria-modal="true"` + `aria-label`（或 `aria-labelledby` 指向标题）。
- **Esc 关闭** + 明确的关闭 ×。
- **焦点陷阱**：打开时焦点进入弹窗（首个可聚焦元素，或容器 `tabIndex=-1`）；`Tab`/`Shift+Tab` 在弹窗内循环。
- **焦点回归**：关闭时焦点回到触发元素（打开前存 `document.activeElement`，cleanup 里 `.focus()`）。
- **背板点击关闭** + 内容 `onClick` `event.stopPropagation()` 防穿透。
- **主按钮黑 / 破坏性红**（见 [buttons.md](buttons.md)），配色走 token（带 hex 兜底）。
- React 里键盘/焦点逻辑放 `useEffect`（客户端），cleanup 移除监听。

> 简单确认/表单类优先用官方 `s-modal`；仅当 `s-modal` 承载不了时才用硬化 overlay。参考实现：`deeplumen-app/app/components/ManagePagesModal.tsx`。

## 自检
- [ ] 进每页静置 30s 不自动弹任何浮层
- [ ] 所有 modal 都有明确的点击触发源
- [ ] Esc 与关闭按钮可用，焦点回归、焦点陷阱生效
- [ ] 自定义 overlay 带 `role="dialog"`/`aria-modal`，主按钮黑/破坏性红
