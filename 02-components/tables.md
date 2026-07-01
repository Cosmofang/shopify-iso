# 表格 Tables

> 列表数据展示。桌面用表格，窄屏要能滚动或转卡片列表。

---

## 写法

```html
<!-- Web Components -->
<s-table>
  <s-table-header-row>
    <s-table-header>Product</s-table-header>
    <s-table-header>Status</s-table-header>
  </s-table-header-row>
  <s-table-row>
    <s-table-cell>SEO title A</s-table-cell>
    <s-table-cell><s-badge tone="success">Optimized</s-badge></s-table-cell>
  </s-table-row>
</s-table>
```
```jsx
/* React 对照 */
<IndexTable resourceName={{singular:'page', plural:'pages'}} itemCount={rows.length}
  headings={[{title:'Product'},{title:'Status'}]}>
  {rows.map((r,i)=>(
    <IndexTable.Row id={r.id} key={r.id} position={i}>
      <IndexTable.Cell>{r.name}</IndexTable.Cell>
      <IndexTable.Cell><Badge tone="success">Optimized</Badge></IndexTable.Cell>
    </IndexTable.Row>
  ))}
</IndexTable>
```

## 规格
| 属性 | 值 |
|------|-----|
| 单元格内边距 | 6px (`space-150`) |
| 数字列 | 右对齐 + tabular-nums |
| 文字 | bodyMd 13px，`#303030` |

---

## ✅ Do
- 表头清晰、列对齐（数字右对齐、tabular-nums）。
- 空表给有意义空状态 + 引导操作。
- 窄屏放进横向滚动容器，或转为卡片列表。
- 行内状态用 Badge（tone 语义）。

## ❌ Don't
- ❌ 表格在移动端撑破视口（横滚溢出页面）。
- ❌ 单元格文字用低对比灰。
- ❌ 空表白屏无提示。
- ❌ 行内用红色做非错误标记。

## BFS 注意
- **4.1.2**：窄屏可滚动/转卡片，不横滚破版。
- **4.1.1**：单元格文字对比 ≥ 4.5:1。
- **通用**：空状态、加载 skeleton。
