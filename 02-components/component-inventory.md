# Polaris App Home Web Components — 组件清单

> 文档版本：`1.1.1`
> 最后修改：`2026-09-28 00:55 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[App Home web components v1.1](https://shopify.dev/docs/api/app-home/latest/web-components) · [Polaris CDN 1.1 stable changelog](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable) · [Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · `@shopify/polaris-types@1.1.0` 的 `dist/custom-elements.json`（官方发布的组件契约）

**来源层级：第 1 层（官方组件契约）。** 本页只回答「官方提供了什么、没提供什么」，不含 ISO 基线或项目经验值。各组件的用法约束见 `02-components/` 下对应专题文件。

## 为什么需要这一页

审核和实现时反复出现同一个问题：**某个控件是自绘的，这算不算违反 BFS 4.1.1？** 答案取决于官方到底有没有提供替代组件——官方没有的，自绘不构成「不匹配 Shopify Admin」；官方有而不用的，才需要解释。

没有清单时，这个判断只能靠记忆，容易把「官方根本没有」的控件误报成违规。

## 全部 62 个组件

`@shopify/polaris-types@1.1.0` 的 `custom-elements.json` 中声明了 `tagName` 的组件共 **62** 个。新增标签是 `s-empty-state`、`s-number`、`s-progress`。当前 v1.1 文档入口去重后有 50 个组件参考页和 1 个 versioning 页；官方页面数量与 types manifest tag 数量是不同口径，不能混算。

Polaris 1.1 还为 `Heading`、`Paragraph` 和 `Text` 增加 `fontSize`，为 `DatePicker` 增加 `visibleMonths`（`auto`、`1` 或 `2`），为 `Page` 增加 `supplementalStart`；overlay 的 show/hide 相关事件不再冒泡。新建数字排版优先使用 `s-number`，不要把已标记为 deprecated 的 `fontVariantNumeric` 当作默认方案。

| 分类 | 组件 |
|---|---|
| 页面与布局（9） | `s-page` `s-section` `s-box` `s-grid` `s-grid-item` `s-stack` `s-divider` `s-query-container` `s-scroll-box` |
| 表格（6） | `s-table` `s-table-header-row` `s-table-header` `s-table-body` `s-table-row` `s-table-cell` |
| 排版与数值（7） | `s-heading` `s-paragraph` `s-text` `s-number` `s-ordered-list` `s-unordered-list` `s-list-item` |
| 动作（6） | `s-button` `s-button-group` `s-press-button` `s-clickable` `s-link` `s-menu` |
| 表单（20） | `s-checkbox` `s-choice` `s-choice-list` `s-color-field` `s-color-picker` `s-date-field` `s-date-picker` `s-drop-zone` `s-email-field` `s-money-field` `s-number-field` `s-option` `s-option-group` `s-password-field` `s-search-field` `s-select` `s-switch` `s-text-area` `s-text-field` `s-url-field` |
| 反馈与浮层（8） | `s-badge` `s-banner` `s-empty-state` `s-progress` `s-spinner` `s-tooltip` `s-modal` `s-popover` |
| 媒体与标识（6） | `s-avatar` `s-icon` `s-image` `s-thumbnail` `s-chip` `s-clickable-chip` |

## 官方未提供组件、但有官方替代

不要因为找不到同名组件就自绘——先确认是不是换了承载方式。

| 想要的控件 | 官方做法 |
|---|---|
| 分页 | `s-table` 的 `paginate` / `hasPreviousPage` / `hasNextPage` 属性 + `nextpage` / `previouspage` 事件 |
| 面包屑 / 返回父页 | `s-page` 的 `slot="breadcrumb-actions"`。**这是满足 BFS 4.1.1 第 11 条（子页须有返回父页入口）的官方入口** |
| 卡片容器 | `s-section`（带 heading 的区块）或 `s-box`（纯容器）。对应 4.1.1 第 2 条的 card-like 容器 |
| 标签 / Tag | `s-chip`（静态）/ `s-clickable-chip`（可点、可移除） |
| Toast | App Bridge **Toast API**，不是组件 |
| 索引表 / 资源列表 | `s-table` + [Index table composition](https://shopify.dev/docs/api/app-home/patterns/compositions/index-table) |
| 空状态 | 直接使用 [`s-empty-state`](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state)；需要完整页面引导时也可使用 [Empty state composition](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/empty-state) |
| 表单容器 | 无 `s-form`；用原生 `<form>` 承载，字段用 `s-*-field`。保存走 App Bridge Contextual Save Bar（BFS 4.1.5） |

## 官方在组件层面不提供、需自绘的控件

以下在 62 个组件中**不存在**，也没有等价组件：

`tabs` · `segmented control` · `toggle group` · `accordion` / `collapsible` · `skeleton` · `slider` / `range slider`

**自绘这些控件本身不违反 BFS 4.1.1。** 官方第 3 条拒审理由的判据是「按钮样式与 Shopify Admin **不匹配**，例如主按钮是与 Polaris **完全不同**的颜色（如绿或紫）」——用 Polaris token 值自绘、外观与 Admin 一致的控件不落入该条。

自绘时仍须满足这些条款（判据全文见 [../00-built-for-shopify/official-requirements-full.md](../00-built-for-shopify/official-requirements-full.md)）：

- **4.1.1 #7** —— tab 组：切换 tab 不得改动 **tab 上方**的内容
- **4.1.1 #2** —— 内容置于 card-like 容器内
- **4.1.1 #9** —— 间距不得显著偏离 Admin
- **4.1.1 #10** —— 文字对比度 ≥ 4.5:1（WCAG 2.1 AA）
- **4.1.2** —— 移动端三条：整页不横滚、内容不得完全不可达、桌面多列须塌陷
- **可访问性** —— 官方组件自带的键盘导航、焦点管理、ARIA 语义，自绘时须自行实现（参见 [modals.md](modals.md) 对自绘 modal 焦点陷阱的说明）

## 重新生成

组件集随 `@shopify/polaris-types` 版本变化。升级后重跑，并按 [SOURCE-GOVERNANCE.md](../SOURCE-GOVERNANCE.md) 第 3 节更新本页版本与时间：

```bash
node -e "
const j=require('@shopify/polaris-types/dist/custom-elements.json');
const t=[];for(const m of (j.modules||[]))for(const d of (m.declarations||[]))if(d.tagName)t.push(d.tagName);
console.log(t.length, t.sort().join(' '));
"
```

比对时同时打开 [App Home web components](https://shopify.dev/docs/api/app-home/latest/web-components) 官方页：npm 类型包与文档站偶有滞后，**以文档站为准**，冲突时在本页记录差异与核对日期。
