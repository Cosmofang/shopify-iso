# 状态与来源优先级

## 结论

Polaris React 是 Shopify Admin 设计系统的一份历史实现和知识档案，不再是新 Shopify App 的运行时基线。官方仓库 README 记录：Polaris Web Components 于 2025-10-01 发布；Polaris React 不再接受贡献、功能请求或维护；仓库于 2026-01-06 归档。

这并不意味着整站内容都失效。设计目标、信息架构、内容、可访问性和商家工作流原则仍有解释价值；React API、旧组件组合、固定 token 值、旧 Admin chrome 和旧安装步骤则必须被隔离。

## 五种状态

| 状态 | 含义 | 使用方式 |
|---|---|---|
| `current authority` | 当前 Shopify 文档、Dashboard、Patterns 和 Web Components | 新开发直接执行 |
| `principle review` | 仍可能有效的体验、内容、布局和可访问性原则 | 与当前来源核对后采用 |
| `historical pattern` | 旧 React 页面模式或组合 | 理解意图，不复制实现 |
| `legacy maintenance` | React 组件 API、迁移和旧工具 | 只用于已经依赖它的项目 |
| `superseded` | 已有明确当前替代或与当前规则冲突 | 不用于新实现 |

## 不能混用的三个层次

### 设计语义

解释为什么界面要可预测、可扫描、可访问、以任务为中心。这类原则通常可跨实现延续，但仍需接受当前 BFS 和 App Home Patterns 约束。

### 组件合同

React 的 prop、context、provider、组合约束和 DOM 行为属于 `@shopify/polaris`。同名 Web Component 不保证 prop、slot、事件或视觉细节相同，必须查当前文档或 `@shopify/polaris-types`。

### 视觉数值

颜色、间距、阴影、排版、断点和动效 token 是版本化产物。旧 token 页面可解释命名和角色，但不能为当前 Web Components 提供固定值。

## 新任务的判断流程

1. 确认是新 App、遗留 React 维护还是 BFS 审核。
2. 新 App 先选当前 App Home Pattern，再查 Web Components/App Bridge。
3. 用本手册解释商家任务、内容、层级、状态和可访问性。
4. 遇到同名历史组件时，只迁移意图，不迁移 API。
5. 任何 BFS `pass` 都必须来自当前条款与实际证据，不能来自本手册。

## 历史 Getting Started 中仍值得保留的认识

- Shopify Admin 是商家设置商店、管理订单、商品、客户和业务配置的工作环境。
- Polaris 是设计指导、组件库、开发意见和 API 文档组成的共享语言，不只是一个 React 包。
- App 体验应融入商家熟悉的 Admin 工作模型，而不是构造独立 SaaS 视觉壳。
- 设计资源、开发资源和内容指南必须一起使用；只安装组件不能保证体验质量。

## 已失效或需改写的 Getting Started 内容

- `npm install @shopify/polaris` 不再是新 App 的起点。
- 旧教程、旧 App Bridge 链接、旧 App Design Guidelines 链接可能已经迁移。
- 旧 Figma Community 文件不自动代表当前 App Home 组件契约。
- “用 React components 获得最佳体验”只适用于归档前的历史上下文。

当前开发入口统一回到仓库根目录的 [START-HERE.md](../START-HERE.md)。
