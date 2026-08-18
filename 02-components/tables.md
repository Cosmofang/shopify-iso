# 表格 Tables

> 当前 `s-table` 可在移动端转换为 list layout。优先配置 `listSlot`，只有确实无法重排的宽内容才使用局部横滚或替代视图。

---

## 写法

```html
<s-section padding="none">
  <s-table>
    <s-table-header-row>
      <s-table-header listSlot="primary">Product</s-table-header>
      <s-table-header listSlot="inline">Status</s-table-header>
      <s-table-header listSlot="labeled" format="numeric">Inventory</s-table-header>
    </s-table-header-row>
    <s-table-body>
      <s-table-row>
        <s-table-cell>Water bottle</s-table-cell>
        <s-table-cell><s-badge tone="success">Active</s-badge></s-table-cell>
        <s-table-cell>128</s-table-cell>
      </s-table-row>
    </s-table-body>
  </s-table>
</s-section>
```

## 内容与排版

- 表头明确描述列内容；数字列右对齐，并在自定义数据视图中使用 tabular numerals。
- 使用 `listSlot="primary|inline|labeled|secondary"` 定义移动列表结构，数值表头使用 `format="numeric"`。
- 大数据集使用当前 `paginate`、`hasPreviousPage`、`hasNextPage`；刷新时使用 `loading`。
- 文字和状态使用当前语义组件、属性与可访问名称，不写死颜色。

---

## 行内动作按钮

- 行尾的 View / Edit 等行内动作用 `variant="secondary"`、`variant="tertiary"`、图标按钮或 overflow menu。
- Table action 使用 secondary styling；不要在每一行重复 primary，也不要为品牌强调自绘彩色描边按钮。

## ✅ Do
- 表头清晰、列对齐（数字右对齐、tabular-nums）。
- 空表给有意义空状态 + 引导操作。
- 窄屏优先使用组件 list layout；必要时才使用局部横滚或专门的移动替代视图。
- 行内状态用 Badge（tone 语义）；行内动作用 secondary/tertiary/icon/menu。

## ❌ Don't
- ❌ 表格在移动端撑破视口（横滚溢出页面）。
- ❌ 单元格文字用低对比灰。
- ❌ 空表白屏无提示。
- ❌ 行内用红色做非错误标记。

## BFS 注意
- **4.1.2**：窄屏可滚动/转卡片，不横滚破版。
- **4.1.1**：单元格文字对比 ≥ 4.5:1。
- **通用**：空状态、加载 skeleton。
