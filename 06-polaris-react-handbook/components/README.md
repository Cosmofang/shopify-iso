# React 组件目录与阅读方法

官方内容树包含 110 个组件 MDX 文件：79 个常规 React 组件/栏目文件、23 个 deprecated 文件和 8 个 internal-only 文件。官网组件目录呈现 89 个页面路径。固定 commit 中的 `@shopify/polaris` 13.10.1 有 121 个组件实现目录；本机 npm 缓存另行核对的 13.9.5 发布包有 120 个。实现目录包含 internal primitive、provider 或辅助组件，不应与公开文档页数量混算。

## 不按名称迁移

React `Button` 与当前 `s-button` 的意图接近，但 prop、事件、slot、loading 行为和可访问性合同不同。其他组件更可能是多对一、一对多或无直接替代。迁移时按以下顺序：

1. 确认商家任务和页面 Pattern。
2. 查当前 App Home/Web Components 文档。
3. 查 `@shopify/polaris-types` 仅确认类型合同。
4. 用历史组件页补充 best practices、content 和 accessibility 意图。
5. 在 dev store 验证实际渲染、交互和移动端。

## 四种替代类型

| 类型 | 含义 |
|---|---|
| Direct | 当前有语义接近的 `s-*` 组件，仍需查新合同 |
| Composition/Pattern | 用多个当前组件或官方 Pattern 表达，不存在单标签替代 |
| App Bridge | 能力属于 Shopify Admin chrome 或宿主 API |
| Native/custom | 使用语义 HTML 或受控自定义实现，并承担完整测试 |

## 分册

- [动作、布局与结构](actions-layout.md)
- [输入、列表与表格](input-data.md)
- [反馈、媒体、导航、overlay 与 utilities](feedback-navigation.md)
- [Deprecated 与 internal-only](deprecated-internal.md)

## 每个组件都要检查的五件事

1. **Purpose**：是否解决正确任务，而不只是外观相似。
2. **Content**：标签、标题、帮助和错误是否让结果可预测。
3. **States**：default、hover、focus、active、selected、disabled、loading、error、empty。
4. **Accessibility**：语义、名称、键盘、焦点、状态公告和 touch target。
5. **Responsive**：内容重排、操作披露、截断和小屏可达性。

完整来源路径、SHA-256 和章节分配见 [source-manifest.json](../source-manifest.json)。
