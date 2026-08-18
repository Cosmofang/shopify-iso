# 徽标 Badge

> 状态标记（在线/成功/警告/错误等）。**tone 决定语义色**，别写死颜色。

---

## tone 语义

| tone | 底/文字 | 用途 |
|------|---------|------|
| （默认 neutral） | 灰 | 中性状态、计数 |
| info | 蓝 | 信息 |
| success | 组件语义绿 | 成功、在线、正向 |
| warning | 橙 | 需注意 |
| **critical** | 组件语义红 | **错误/严重（红色仅此）** |

## 写法

```html
<s-badge tone="success">● Agent online</s-badge>
<s-badge tone="critical">Failed</s-badge>
<s-badge>Draft</s-badge>
```
```jsx
<Badge tone="success">Agent online</Badge>
<Badge tone="critical">Failed</Badge>
<Badge>Draft</Badge>
```

---

## ✅ Do
- 用 `tone` 取语义色。
- success = 正向/在线，critical = 错误/失败。
- 中性状态用默认（灰），别硬上彩色。

## ❌ Don't
- ❌ 用 `tone="critical"`（红）标非错误状态，如「热门」「新」「promo」（违反 4.3.3）。
- ❌ 写死 badge 颜色。
- ❌ 红 badge 当装饰/强调。

## BFS 注意
- **4.3.3**：红色 badge 只用于错误/失败/严重。普通强调用中性或蓝。
- **4.1.1**：使用当前组件 tone，并在真实渲染环境验证文字与背景对比。
