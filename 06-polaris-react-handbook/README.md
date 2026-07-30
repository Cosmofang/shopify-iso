# Polaris Design System for React 本地手册

本手册系统整理已归档的 [Polaris Design System for React](https://polaris-react.shopify.com/)，用于理解 Shopify Admin 设计语言、维护遗留 `@shopify/polaris` React 项目，并把仍有效的设计原则迁移到当前 Shopify App 开发。

它不是新 App 的安装指南。Polaris React 已弃用，官方仓库已于 2026-01-06 归档；新 App Home 默认使用 Polaris Web Components、App Bridge Web Components、App Home Patterns 和当前 Shopify 文档。

## 先判断你正在做什么

| 任务 | 本手册的角色 | 实现基线 |
|---|---|---|
| 新 Shopify App 或新页面 | 提供设计推理、内容与体验原则 | 当前 App Home Patterns + Polaris Web Components |
| 遗留 Polaris React 维护 | 提供组件语义、可访问性、迁移和风险参考 | 项目锁定的 `@shopify/polaris` 版本 |
| BFS 审核或整改 | 解释设计原则，但不能代替条款证据 | 当前 BFS requirements、Dev Dashboard 与 ISO 严格流程 |
| 自定义界面缺少官方组件 | 帮助判断布局、状态、内容和可访问性 | 先证明官方 Pattern/Web Component 无法表达 |

## 权威顺序

发生冲突时按以下顺序决策：

1. 当前 Shopify Dev 文档与 Dev Dashboard。
2. 当前 App Home Patterns、Polaris Web Components 与 App Bridge APIs。
3. 当前 App Store/BFS requirements。
4. 本 ISO 的执行规范与验证证据。
5. 本手册中标为“仍有效原则”的 Polaris React 历史内容。
6. Polaris React 组件 API、旧 token 和旧工具，仅用于遗留维护。

不得从本手册复制旧 React 组件、固定 hex、旧 token 值或旧页面 chrome，作为新 App 的默认实现。

## 阅读路线

1. [状态与来源优先级](01-status-and-source-priority.md)：先建立历史边界和判断方法。
2. [基础与设计语言](02-foundations-and-design.md)：体验价值、无障碍、国际化、颜色、布局、排版、深度、动效等。
3. [内容指南](03-content-guidelines.md)：商家语言、语法、错误、命名、替代文本和包容性语言。
4. [体验模式](04-patterns.md)：设置、卡片、资源列表/详情、日期、新功能和旧模式。
5. [组件总览](components/README.md)：进入完整 React 组件目录与当前实现映射。
6. [Tokens、Icons 与工具](06-tokens-icons-tools.md)：理解旧系统约束，但不把快照当当前值。
7. [遗留 React 维护](07-legacy-react-maintenance.md)：锁版本、迁移、测试和退役策略。
8. [当前 Shopify 映射](08-current-shopify-mapping.md)：从历史概念选择当前 Pattern、Web Component 或 App Bridge 能力。
9. [来源治理](09-source-governance.md)：260 个官方源码文件、243 个官网页面和覆盖验证。

## 本手册怎样证明“完整”

- 官方源码基准：`Shopify/polaris-react` commit `2b1ea88625e0613853ca8577c9acd1980a90f382`。
- `polaris.shopify.com/content`：260 个 MDX/模板来源文件。
- 官网递归导航：243 个去重页面路径。
- 官方固定源码中的 `@shopify/polaris` 13.10.1：121 个组件实现目录。
- 本机 npm 缓存中另行验证的 `@shopify/polaris` 13.9.5 发布包：120 个组件目录；它只用于说明不同发布快照会有差异，不代表固定 commit。
- `@shopify/polaris-types` 1.0.7：59 个当前 Polaris Web Components 标签。
- [source-manifest.json](source-manifest.json) 给每个官方内容文件记录 SHA-256、历史状态和手册落点。
- `node scripts/verify-polaris-react-handbook.mjs` 检查清单、章节与可选源码/官网 crawl 快照是否一致。

“清单有一行”只证明来源被路由，不证明正文已经正确解释。完成审计还必须检查每章的原则、反例、历史状态和当前映射。
