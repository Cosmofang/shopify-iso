# 横幅 Banners

> 页面内的**上下文反馈/提示**。BFS 里是**替代自动弹窗**（4.3.3）的正确做法——引导、公告、状态提醒都用 Banner，不用 modal。

---

## 语气 tone

| tone | 底色 | 用途 |
|------|------|------|
| info（默认） | `#eaf4ff` | 一般信息、引导 |
| success | `#cdfed4` | 操作成功 |
| warning | `#fff1e3` | 需注意 |
| critical | `#fee8eb` | 错误/严重问题 |

## 写法

```html
<!-- Web Components -->
<s-banner tone="info" heading="连接你的店铺">
  <s-text>完成设置后即可开启 AI SEO 优化。</s-text>
  <s-button slot="action" variant="primary">去设置</s-button>
</s-banner>
```
```jsx
/* React 对照 */
<Banner title="连接你的店铺" tone="info" action={{content: '去设置', url: '/app/settings'}}>
  <p>完成设置后即可开启 AI SEO 优化。</p>
</Banner>
```

---

## ✅ Do
- 引导/公告/非阻断提醒用 Banner（页面内，不打断）。
- 可关闭的 Banner 给 `onDismiss`。
- tone 与语义匹配（成功=success，错误=critical）。

## ❌ Don't
- ❌ 用**自动弹出的 modal/popover** 做公告（违反 4.3.3）——改用 Banner。
- ❌ info/success 场景误用 critical（红）tone（违反 4.3.3 红色规则）。
- ❌ Banner 文字对底色对比不足。

## BFS 注意
- **4.3.3**：这是替代「自动弹窗」的推荐组件。引导类信息一律 Banner。
- **4.3.3**：红色 critical tone 只用于真正的错误/严重问题。
- **4.1.1**：Banner 文字对其底色 ≥ 4.5:1（用配套 text token）。

> 弹窗规则见 [modals.md](modals.md)；反馈模式见 [../03-patterns/errors-and-feedback.md](../03-patterns/errors-and-feedback.md)。
