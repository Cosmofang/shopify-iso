# 卡片与区块 Cards & Sections

> 内容分组的基本容器。白底、12px 圆角、16px 内边距。

---

## 写法

```html
<!-- Web Components -->
<s-section heading="Setup guide">
  <s-stack gap="base">
    <s-text>Your AI assistant is ready.</s-text>
    <s-button variant="primary">Get started</s-button>
  </s-stack>
</s-section>
```
```jsx
/* React 对照 */
<Card>
  <BlockStack gap="400">
    <Text as="h2" variant="headingMd">Setup guide</Text>
    <Text as="p">Your AI assistant is ready.</Text>
    <Button variant="primary">Get started</Button>
  </BlockStack>
</Card>
```

## 规格
| 属性 | 值 |
|------|-----|
| 背景 | `--p-color-bg-surface` `#ffffff` |
| 圆角 | `--p-border-radius-300` 12px |
| 内边距 | `--p-space-400` 16px |
| 卡片间距 | 16px |
| 阴影 | `--p-shadow-100`（静态） |
| 标题 | headingMd (14 SemiBold) |

---

## ✅ Do
- 用 `s-section` / `Card` 分组，标题用语义 heading。
- 卡内元素用 `s-stack`/`BlockStack` 管间距（token）。
- 卡片文字对白底 ≥ 4.5:1。

## ❌ Don't
- ❌ 卡片圆角 8px（应 12px）、内边距非 16。
- ❌ 卡内写死背景/文字色。
- ❌ 卡片当装饰堆叠、无实际分组意义。
- ❌ 卡片标题用红色/装饰色。

## BFS 注意
- **4.1.1**：卡内文字对比 ≥ 4.5:1。
- **4.1.2**：卡片在窄屏堆叠、内边距不贴边。
- **4.3.3**：卡片内红色只用于错误/删除。
