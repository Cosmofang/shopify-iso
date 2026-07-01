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

## 自检
- [ ] 进每页静置 30s 不自动弹任何浮层
- [ ] 所有 modal 都有明确的点击触发源
- [ ] Esc 与关闭按钮可用，焦点回归
