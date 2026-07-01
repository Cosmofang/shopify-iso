# 移动端适配（BFS 4.1.2）

> 内容合理间距、针对移动优化。桌面 + 移动都要过。

---

## 硬性要求

- **无横向滚动**：任意页面 375px 宽下不得整页横滚。
- **列堆叠**：多列在窄屏堆为单列。
- **触控目标 ≥ 44×44px**。
- **水平内边距 16px**，内容不贴边。
- **表格/图表**：放进局部横向滚动容器，不撑破视口。
- **正文 ≥ 13px**。
- **内容不可被隐藏**：折叠内容要能展开、或换行/滚动露出——手机上取不到内容 = 打回（官方 4.1.2 判据②）。

> 官方 4.1.2 的 3 条硬判据：①整页横滚 ②内容完全无法访问 ③内容不合理压缩(两列不堆叠)。上面的 16px/44px/375px 是最佳实践补充,非官方原文判据。

---

## 布局做法

```html
<!-- 用 s-grid 响应式列 + s-stack token 间距 -->
<s-grid gridTemplateColumns="1fr 1fr 1fr 1fr" gap="base"><!-- KPI 卡：窄屏堆叠 --></s-grid>
```
```jsx
<InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400"> … </InlineGrid>
```

- KPI/卡片网格：桌面多列 → 手机单列。
- 主 CTA 在移动端可 `fullWidth`。
- 图表容器：`overflow-x:auto` 局部滚动，宽度设 `min-width` 而非固定撑满。

---

## 逐页自测流程

> 真机 QR 扫码测（隧道模式）与完整环境搭建 → [../00-built-for-shopify/local-self-test.md](../00-built-for-shopify/local-self-test.md)。

1. `cd lumi-app && shopify app dev`
2. Chrome DevTools → 设备工具栏 → iPhone SE / 375px
3. 逐页检查：
   - [ ] 无整页横滚
   - [ ] 多列已堆叠
   - [ ] 按钮/链接可点（≥44px）
   - [ ] 文字不贴边、不挤压
   - [ ] 表格/图表局部滚动而非破版
   - [ ] 弹层/Banner 在窄屏正常

## ❌ 常见坑
- 固定 `width: 1200px` 容器 → 横滚。
- `grid-template-columns` 写死列数不响应。
- 表格直接铺满 → 溢出。
- 图标按钮点击区太小。
- 负 margin / 绝对定位元素移动端错位。

## BFS 注意
- **4.1.2**：这是打回项。桌面过了不代表移动过，**必须真机/模拟逐页验**。
- 与 [../01-foundations/layout-responsive.md](../01-foundations/layout-responsive.md) 配合。
