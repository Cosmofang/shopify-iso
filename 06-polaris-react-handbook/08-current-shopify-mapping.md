# 当前 Shopify 实现映射

> 文档版本：`1.2.1`
> 最后修改：`2026-10-09 10:45 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[Polaris Web Components](https://shopify.dev/docs/api/app-home/latest/web-components) · [Polaris CDN 1.1 stable changelog](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable) · [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) · [Admin new look rollout](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) · [Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [React → Web Components migration](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react) · [App Bridge Web Components](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components)

本章把 Polaris React 的历史概念路由到当前 Shopify App 开发能力。映射基准是任务和 surface，不是名称相似度。

## 新 App 的选择顺序

1. 先选择 App Home Template：Homepage、Index、Details 或 Settings。
2. 再选择官方 Composition，例如 setup guide、metrics、index 或 empty state。
3. 页面 iframe 内使用 Polaris Web Components。
4. Shopify Admin chrome 使用 App Bridge Web Components/APIs。
5. 数据与行为使用官方模板认证、GraphQL Admin API 和适用 extension APIs。
6. 官方能力不能表达时才使用原生语义 HTML 或受控 custom UI，并承担完整测试。

当前入口见 [App Home Patterns](https://shopify.dev/docs/api/app-home/patterns)、[Polaris Web Components](https://shopify.dev/docs/api/app-home/latest/web-components)、[Polaris API](https://shopify.dev/docs/api/polaris) 与 [App Bridge](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components)。Polaris unified Web Components 也覆盖 Checkout、Customer Account 和 POS 等其他 surface；本章只描述 App Home 的 surface-specific 映射。

## 62 个当前 Web Components

本次固定的 `@shopify/polaris-types` 1.1.0 stable manifest 暴露 62 个 `s-*` 标签，新增 `s-empty-state`、`s-number`、`s-progress`。`2.0.0-rc.2` 预览 manifest 也有 62 个标签，但不改变当前稳定合同。这个包只提供 TypeScript 类型；`npm install @shopify/polaris-types` 不会把 Web Components 运行时装进 App，也不会自动让页面符合 Polaris 或 BFS。生产运行时应使用 `polaris-1.js` 稳定主线或精确固定 `polaris-1.1.js`，实际属性、事件和 availability 必须查当前文档。

### Polaris 1.1 变更摘要

官方 1.1 changelog（2026-09-22）还新增了 `Heading`/`Paragraph`/`Text` 的 `fontSize`、`DatePicker` 的 `visibleMonths`（`auto`、`1` 或 `2`）和 `Page` 的 `supplementalStart`。overlay 的 `show`、`hide`、`aftershow`、`afterhide`、`aftertoggle` 事件不再冒泡，监听应放在 overlay 本身或对应的 `on*` 属性上。数字排版优先使用新增的 `s-number`，不再把 `fontVariantNumeric` 作为新实现默认方案。

| 能力 | 当前标签 |
|---|---|
| 页面与布局 | `s-page`, `s-section`, `s-box`, `s-stack`, `s-grid`, `s-grid-item`, `s-divider`, `s-query-container`, `s-scroll-box` |
| 文字、媒体与状态 | `s-heading`, `s-paragraph`, `s-text`, `s-number`, `s-icon`, `s-image`, `s-thumbnail`, `s-avatar`, `s-badge`, `s-banner`, `s-empty-state`, `s-progress`, `s-spinner`, `s-tooltip` |
| 动作与导航 | `s-button`, `s-press-button`, `s-button-group`, `s-link`, `s-clickable`, `s-chip`, `s-clickable-chip` |
| 选择与输入 | `s-checkbox`, `s-choice-list`, `s-choice`, `s-switch`, `s-select`, `s-option`, `s-option-group`, `s-text-field`, `s-text-area`, `s-search-field`, `s-email-field`, `s-url-field`, `s-password-field`, `s-number-field`, `s-money-field`, `s-color-field`, `s-color-picker`, `s-date-field`, `s-date-picker`, `s-drop-zone` |
| 列表与表格 | `s-ordered-list`, `s-unordered-list`, `s-list-item`, `s-table`, `s-table-header`, `s-table-header-row`, `s-table-body`, `s-table-row`, `s-table-cell` |
| 局部 overlay/menu | `s-menu`, `s-popover`, `s-modal` |

这张表只证明标签出现在类型 manifest；不证明它在所有 surface、API version 或 runtime 中都可用。

## React 概念到当前能力

| 历史概念 | 当前选择 | 说明 |
|---|---|---|
| Page / Layout / Card | Template + `s-page` / `s-section` / layout components | 先确定页面信息架构，不把所有内容包成 card |
| ResourceList / IndexTable / Filters | Index Pattern + `s-table` family + current inputs | 搜索、筛选、排序、选择、分页与 URL state 是一套合同 |
| EmptyState | Direct：`s-empty-state`；也可使用 empty-state composition | 区分首次为空、筛选无结果、权限与失败 |
| FormLayout / fields | 原生 `<form>` + 当前 field components | server validation、字段错误、dirty/save/recovery 一起实现 |
| Banner / Badge / Toast | `s-banner` / `s-badge` / App Bridge toast | 持久问题不能只放会消失的 toast |
| Modal / Popover | 当前 `s-modal` / `s-popover` 或 App Bridge modal | 依据 surface、焦点与宿主能力选择，不按旧 prop 迁移 |
| Navigation / TopBar / Frame | Shopify Admin + App Bridge nav/title | 第三方 App 不自绘 Admin chrome |
| ContextualSaveBar | App Bridge save bar | 与真实 dirty、save、discard 和 route blocking 同步 |
| Tabs | route navigation 或可访问的 custom tabs | 官方迁移指南确认没有 direct `s-tabs`；不能猜造标签 |
| Autocomplete / Combobox / Listbox | search/select/menu composition | 按任务、选项规模与键盘模型设计，无安全一对一替代 |
| RangeSlider | 原生 range 或受控 custom | 当前没有 direct 标签，必须承担键盘、名称、错误和移动端测试 |
| ProgressBar | Direct：`s-progress` | 1.1.0 新增；按当前文档查 `accessibilityLabel`、value 和 tone 合同 |
| Sheet | `s-modal` 或 `s-app-window` | 按 surface、焦点 ownership 和是否需要独立窗口选择 |
| AppProvider | 官方模板/CDN/App Bridge 环境 | 不为 Web Components 套旧 React context |

完整逐组件映射见 [组件总览](components/README.md)。

## App Bridge 与 App Home 的边界

App Home 负责 App iframe 内的内容和工作流。Admin 顶栏、全局导航、宿主 modal、save bar、toast 等能力属于 App Bridge 或 Shopify Admin。相同的“modal”概念可能同时有 App Home 和 App Bridge 入口；选择要根据文档中的 surface 与 lifecycle，而不是只看标签名。

任何外部跳转、OAuth 连接、resource picker 或 extension surface 也要遵循对应平台 API。Polaris 只解决呈现的一部分，不能替代认证、权限、billing、webhook、数据保留或 App Store/BFS 要求。

## 从历史原则到当前验收

每次迁移或新实现至少回答：

- 商家任务是否对应正确 Template/Pattern？
- 正常、loading、empty、error、permission、success 与 recovery 是否都存在？
- 页面、section、行级动作是否层级清楚且不会重复？
- 键盘、focus、screen reader、touch 和 375px 是否可完成整个流程？
- Shopify 移动端、Admin 宿主导航和 back/forward state 是否正确？
- 当前 API、scopes、category 和 Dashboard 条件是否有证据？

严格 BFS 工作使用 `$shopify-app-iso` 的同一套规范，但必须在计划、实现和验证过程中逐项绑定 App Store/BFS requirement ID 和证据。本手册可以解释设计理由，不能把历史页面或代码检查直接变成 `pass`。

## 更新映射

当 `@shopify/polaris-types`、App Home 文档或 App Bridge 改变时：

1. 更新 `system-inventory.json` 的版本、62-tag 基线和 manifest hash。
2. 对新增/删除/改名标签逐一复核本章和四个组件分册。
3. 检查官方 Patterns 是否已经替代自定义 composition。
4. 运行 `node scripts/verify-polaris-react-handbook.mjs`。
5. 未完成 runtime 与 dev store 验证前，映射状态保持 `unverified`。
