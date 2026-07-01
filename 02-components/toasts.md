# 轻提示 Toast

> 短暂的操作反馈（保存成功、已复制等）。由**用户操作触发**，几秒后自动消失。

---

## 写法（App Bridge）

```js
// Web Components / App Bridge（lumi-app 用这个）
shopify.toast.show('已保存');
shopify.toast.show('保存失败，请重试', { isError: true });
```
```jsx
/* React 对照（Polaris Frame + Toast，或 App Bridge useAppBridge） */
const shopify = useAppBridge();
shopify.toast.show('已保存');
```

---

## ✅ Do
- 操作后给即时反馈（保存/删除/复制成功）。
- 错误 toast 用 `isError: true`。
- 文案简短明确。

## ❌ Don't
- ❌ 用 toast 承载需要操作的重要信息（那该用 Banner/Modal）。
- ❌ 页面加载就弹 toast（应由操作触发）。
- ❌ toast 堆叠刷屏。

## BFS 注意
- **4.3.3**：toast 由操作触发、自动消失，不算「打扰」；但**别在加载时自动弹**。
- 成功=普通 toast，失败=`isError`（红），符合红色只用于错误。

> 需要用户确认/阅读的信息用 [banners.md](banners.md) 或 [modals.md](modals.md)。
