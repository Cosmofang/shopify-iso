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

## 卡内常见构件

**章节标题带帮助 ⓘ**（复刻原型 card-label）：14px/600 标签 + 一个 hover tooltip 图标。
```css
.help { position:relative; display:inline-flex; color:var(--p-color-text-secondary,#8a8a8a); cursor:help; }
.help::after { content:attr(data-tip); position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%);
  background:#1a1a1a; color:#fff; font-size:11px; padding:6px 12px; border-radius:8px; width:max-content; max-width:240px;
  opacity:0; pointer-events:none; transition:opacity .12s; z-index:10; }
.help:hover::after { opacity:1; }
```

**FAQ / 可折叠**：用**原生 `<details>/<summary>`** —— 零 JS、SSR 安全、无水合冲突。每条一个**浅灰圆角卡**（`--p-color-bg-surface-secondary`）+ 卡间留白；chevron 用 `[open]` CSS 旋转；答案在同一灰卡内展开。答案要行内加粗时，用「富文本 runs」数据（`{text, bold?}[]`）渲染，别拼 HTML 字符串。
```css
.faq { background:var(--p-color-bg-surface-secondary,#f7f7f7); border-radius:8px; padding:12px 16px; margin-bottom:8px; }
.faq summary { list-style:none; cursor:pointer; display:flex; justify-content:space-between; gap:12px; font-size:13px; font-weight:600; }
.faq summary::-webkit-details-marker { display:none; }
.faq[open] .chev { transform:rotate(180deg); }
```

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
