# 遗留 Polaris React 维护

本章面向已经运行 `@shopify/polaris` 的 App。它覆盖 7 个 previous release 页面与 2 个 version guide 来源，但不建议为新功能重新引入 Polaris React。

## 先建立可审计基线

在改代码前记录：

- `@shopify/polaris`、`@shopify/polaris-tokens`、`@shopify/polaris-icons`、React、App Bridge 与 Node 版本。
- lockfile 中实际解析版本，而不只看 `package.json` range。
- React 组件 imports、deprecated imports、直接 `--p-*`、旧 Sass helpers、自绘 Admin chrome 和自定义 overlay。
- 关键页面、交互、移动、键盘、截图与生产错误的现状证据。

本手册固定的官方源码是 13.10.1/121 个组件目录；本机 npm 缓存另有 13.9.5/120 个目录。维护目标 App 时，两者都不能替代目标 lockfile 的真实版本。

## 版本变化说明了什么

历史 release 内容记录了一条连续演进路线：

| 阶段 | 主要变化 | 维护含义 |
|---|---|---|
| v10 typography | 六个文字组件收敛为 `Text`，更新 type scale | 视觉相似不等于语义相同；检查 heading 与 HTML element |
| v11 color | palette/alias 角色重构，提高语义和可访问性 | 旧 token 不能只做字符串替换，要核对前景/背景配对 |
| v11 layout | Box、Bleed、Card、Divider、Grid、Inline/Block 组合 | 页面应从任务和关系重建，不要复制旧 Layout 嵌套 |
| v11 tokens | primitives、aliases、命名与覆盖率调整 | 迁移要搜索全部 CSS/SCSS/JS，不只组件 props |
| v12 | Pro 设计语言、密度、Inter、token refinement、API 对齐 | 需要视觉回归和自定义元素检查，不是纯 codemod |
| v13/v14 后续 | 继续移除/重命名旧 API 与字体 token | 逐 major 升级，不跨版本猜映射 |
| 2025-10-01 后 | Polaris Web Components 成为新方向 | React 稳定化与退役计划比继续扩展更重要 |

## v11 到 v12 的可靠迁移方式

官方指南把迁移分为自动和人工两段：

1. 升级一组相互匹配的 package majors。
2. 针对明确目录运行 `@shopify/polaris-migrator`。
3. 把无 `polaris-migrator:` 注释的自动结果单独格式化、测试和提交。
4. 逐条解决 migrator 留下的人工注释。
5. 使用指南的 RegExp 验证旧 component prop 与 token 没有漏网。
6. 处理无法由 codemod判断的字体、icons、divider、输入旁按钮、LegacyCard、z-index 和自定义元素。

组件变化集中在：AppProvider flags；Avatar size/shape；Badge/Banner 的 `status`→`tone`；Box radius 属性；Button boolean props→`variant`/`tone`；stack/grid 逻辑方向命名；Icon/Text color→tone；Layout section variants；Modal size；Page divider；TextField borderless。

Token 变化覆盖 border、color、font、shadow、space，并包含必须按顺序运行的 stepped migrations。自动替换后仍要检查 semantic role，因为同一个旧 token 在不同上下文可能需要不同新值。

## 不要停在“编译通过”

每个迁移批次至少验证：

- TypeScript、lint、unit/integration tests 和 production build。
- 关键页面截图与布局位移，尤其是 card 密度、divider、按钮和字体。
- hover、focus、active、selected、disabled、loading 与错误状态。
- modal/popover/save bar 的焦点、Esc、返回和未保存状态。
- 375px、桌面、Shopify 移动端真机和内容扩展语言。
- 安装、认证、核心流程、失败恢复与 App Bridge 能力。

## Deprecated 与 Admin chrome

先搜索 [Deprecated 与 internal-only](components/deprecated-internal.md) 中列出的组件。Frame、TopBar、Navigation、Loading、Toast、Modal 和 ContextualSaveBar 的历史存在不代表第三方 App 应继续复制 Shopify Admin。当前允许的宿主能力转到 App Bridge；页面内部才使用 App Home UI。

冻结库上的修复顺序是：安全与数据正确性、阻断错误、可访问性、平台兼容、性能，然后才是视觉整理。不要为了减少 diff 保留已经导致商家无法完成任务的旧交互。

## 逐流程退役，而非双系统永久共存

推荐以一个完整 workflow 为迁移单位：route、loader/action、API、UI、错误/空/loading、导航和验证一起迁移。避免同一页面让 React Polaris 与 Web Components 共同争夺表单、overlay 或 focus ownership。

每个流程迁移完成后：

1. 删除不再使用的 React imports、providers、CSS 和 token 覆盖。
2. 用当前 Pattern/Web Components 重新验证，而不是要求像素复制旧页面。
3. 记录仍依赖旧库的 routes 和阻断条件。
4. 更新 bundle、错误率、Web Vitals 和人工回归基线。

最终退役条件是目标仓不再运行 `@shopify/polaris`、旧 token CSS、旧 icons imports 或自绘 Admin chrome；在达到之前，依赖必须锁定并纳入安全与兼容性风险清单。

## 来源边界

Previous releases 和 v11→v12 guide 是历史迁移证据，不是当前 Shopify App 安装指南。`npx` 命令会使用当前 registry 状态；真正执行前必须固定版本、先 dry-run 并在目标仓查看包的 changelog。当前新实现决策见 [当前 Shopify 映射](08-current-shopify-mapping.md)。
