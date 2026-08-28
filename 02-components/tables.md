# 表格 Tables

> 文档版本：`1.1.0`
> 最后修改：`2026-08-28 10:31 CST (Asia/Shanghai)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[Table](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/table) · [Index table composition](https://shopify.dev/docs/api/app-home/patterns/compositions/index-table) · [Resource index template](https://shopify.dev/docs/api/app-home/patterns/templates/resource-index) · [BFS 4.1.1 / 4.1.2](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#design)
>
> 当前 `s-table` 的 `variant="auto"` 是默认值：宽屏显示 table，窄屏转换为 list layout。优先配置 `listSlot`，只有确实无法重排的宽内容才使用局部横滚或替代视图。

---

## 写法

```html
<s-section padding="none">
  <s-table variant="auto">
    <s-search-field
      slot="filters"
      label="Search products"
      labelAccessibilityVisibility="exclusive"
    ></s-search-field>
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
- 搜索和筛选控件放在 `slot="filters"`；`s-table` 只提供区域，不会替 App 实现搜索、筛选或排序逻辑。
- 大数据集使用当前 `paginate`、`hasPreviousPage`、`hasNextPage` 和对应事件；刷新或翻页期间使用 `loading`。使用原生分页时不要再重复渲染一套自定义分页。
- 官方 Table best practices 建议保持完成任务所需的最少列；数据超过约 50–100 行时使用分页，或提供搜索/筛选以帮助定位。
- 文字和状态使用当前语义组件、属性与可访问名称，不写死颜色。

## Index table、选择与行点击

当前 [Index table composition](https://shopify.dev/docs/api/app-home/patterns/compositions/index-table) 将搜索、筛选、排序、批量选择和分页组合为同一模式：

- 批量选择使用带可访问名称的 checkbox；部分选中时表头 checkbox 使用 indeterminate 状态。
- `clickDelegate` 指向行内真实交互元素。选择型表格可按官方 composition 指向 checkbox；详情型表格指向该行的主链接。目标必须仍在行内，让键盘和 screen reader 用户可以直接操作，因为 `clickDelegate` 本身只增加点击代理，不增加键盘或读屏语义。
- 有选中项时在 `filters` 区显示“X of Y selected”和批量动作；没有选中项时恢复搜索/筛选。破坏性批量动作先确认。
- 行动作只在需要时呈现，主次与单行任务一致；不要让整行点击、checkbox 和详情链接触发互相冲突的动作。

## 空态与无结果

- 真实空集合使用当前 [Resource index empty state](https://shopify.dev/docs/api/app-home/patterns/templates/resource-index)：解释价值并提供创建首个资源的清晰动作，不显示无意义的筛选器或空表头。
- 有资源但筛选无结果时保留筛选上下文，并提供清除搜索/筛选的恢复路径；不要误导商家去创建重复资源。

---

## 行内动作按钮

- 行尾的 View / Edit 等行内动作用 `variant="secondary"`、`variant="tertiary"`、图标按钮或 overflow menu。
- Table action 使用 secondary styling；不要在每一行重复 primary，也不要为品牌强调自绘彩色描边按钮。

## ✅ Do
- 表头清晰、列对齐（数字右对齐、tabular-nums）。
- 空表给有意义空状态 + 引导操作。
- 使用 `variant="auto"` 和有意设计的 `listSlot` 验证窄屏信息层级。
- 使用官方 `filters`、loading 和 pagination 接口组合列表状态。
- 窄屏优先使用组件 list layout；必要时才使用局部横滚或专门的移动替代视图。
- 行内状态用 Badge（tone 语义）；行内动作用 secondary/tertiary/icon/menu。

## ❌ Don't
- ❌ 表格在移动端撑破视口（横滚溢出页面）。
- ❌ 单元格文字用低对比灰。
- ❌ 空表白屏无提示。
- ❌ 同时渲染原生分页和自定义分页，或在选择状态仍显示冲突的筛选动作。
- ❌ 让 `clickDelegate` 代替行内真实、可聚焦且有可访问名称的交互目标。
- ❌ 行内用红色做非错误标记。

## BFS 注意
- **4.1.2**：窄屏可滚动/转卡片，不横滚破版。
- **4.1.1**：单元格文字对比 ≥ 4.5:1。
- **通用**：空状态、加载 skeleton。
