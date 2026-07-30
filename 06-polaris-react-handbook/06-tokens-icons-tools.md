# Tokens、Icons 与历史工具

本章覆盖归档站点的 12 个 token 页面、icons 入口和 56 个 tools 文件。它们解释 Polaris React 怎样把设计决定变成代码约束，但都是固定历史快照。新 App 的视觉值、组件属性和图标名称必须以当前 App Home 文档与实际 Web Component 合同为准。

## Token 系统解决什么问题

Token 用有意义、可复用的名字代替散落的颜色、间距、字体、阴影和动效数值。它让一次系统级调整能够一致传播，也让 lint 和迁移工具判断代码是在表达设计意图，还是写死偶然值。

归档源码 `@shopify/polaris-tokens` 9.4.2 有 25 个源码文件和 11 类基准数据：

| 类别 | 历史用途 | 迁移时要确认 |
|---|---|---|
| border | 边框宽度与圆角 | 边界是否真的表达 surface、focus 或分组 |
| breakpoints | 响应式阈值与 Sass media helpers | 当前组件是否已负责响应式；不要复制旧阈值 |
| color | 背景、填充、文字、图标、边框与交互状态 | 按语义角色选择；不能复制固定 rgba/hex |
| font / text | 字体、字号、行高、字重和组合文本样式 | 先保留语义层级，再查当前 typography 合同 |
| height / width | 少量稳定尺寸 | 不把历史尺寸当当前控件规格 |
| motion | duration、easing 与 keyframes | 必须服务反馈并尊重 reduced motion |
| shadow | surface 与 overlay 深度 | 不用阴影做装饰性漂浮 |
| space | gap、padding 与 margin | 空间表达关系，不按旧数值复刻截图 |
| zIndex | 历史 React overlay 层级 | 当前宿主 chrome 与 App Bridge 管理的层级优先 |

## Primitive 与 semantic

Polaris v12 将 token 明确分成两层：primitive 表示基础刻度，semantic 表示特定用途。能准确表达意图时使用 semantic；不存在合适 semantic 时才考虑 primitive。不能为了“通过 token 检查”而把任意 primitive 放进不匹配的语境。

这套思想仍有效，但历史名字和值并非当前权威。尤其要避免：

- 从归档 token 页复制 `--p-*` 到新 App 的自定义 CSS。
- 把 background token 与错误的 text/icon-on-background 角色配对。
- 用颜色、阴影或 motion token 合法化不必要的自定义视觉层。
- 把 v11、v12、v13 或 13.10.1 的 token 同时存在视为兼容。

## Breakpoints 的历史边界

归档页提供 xs、sm、md、lg、xl 的 Sass `up`、`down`、`only` 变量，并鼓励 mobile-first 的 `up` 查询。这能保留“从最窄任务流开始”的原则，但具体阈值属于旧包快照。新页面优先让 App Home Pattern 和 Web Components 处理布局；确需自定义 media query 时，按真实内容断点验证 375px、桌面和 Shopify 移动端，不从这里抄数值。

## Icons

固定源码的 `@shopify/polaris-icons` 9.3.1 含 534 个 SVG 和 534 个同名 YAML 元数据。历史 React 用法是把 icon export 传给 `<Icon source={...}>`；这不是当前 `s-icon` 的 API。

选择图标时保留以下原则：

1. 先按动作或对象语义查当前支持的 icon 名，不按外形猜。
2. 同一含义持续使用同一图标；同一图标不承担互相冲突的动作。
3. 陌生或低频动作保留可见文字，icon-only 必须有可访问名称与 tooltip。
4. 装饰图标退出无障碍树；状态不能只靠图标或颜色表达。
5. 不复制归档 SVG 来冒充当前 Shopify 官方能力，也不假设旧名称仍存在。

## Polaris Migrator

`@shopify/polaris-migrator` 是 AST/codemod 工具，用来批量升级旧 React、SCSS 和 token 用法。归档文档覆盖 v9 到 v14 的专用迁移以及通用 component/prop/custom-property 迁移。

安全工作流是：

1. 锁定依赖、干净工作树并建立可回退分支。
2. 先以 `--dry` / `--print` 检查范围，再在精确 glob 上运行 codemod。
3. 单独提交自动结果；搜索所有 `polaris-migrator:` 注释并人工处理。
4. 使用迁移指南给出的 RegExp 查漏，不把 codemod 成功当行为通过。
5. 格式化后运行 lint、类型、测试、构建、视觉、键盘与移动验证。

v11 到 v12 的主要变化包括：组件方向名称改为 Inline/Block、多个 boolean props 合并为 `variant`/`tone`、颜色/边框/字体/阴影/空间 token 分步重命名、Inter 字体、图标改名和自定义 surface 的视觉修复。颜色等有重叠名称的迁移必须按文档步骤顺序执行。

## Stylelint Polaris

归档的 `@shopify/stylelint-polaris` 用 40 多条规则提高旧 Admin 代码的 Polaris 覆盖率。56 个 tools 来源中的 49 个是规则索引、preamble/postamble 或具体规则页，覆盖：border、color、conventions、layout、media queries、motion、shadow、space、typography、z-index，另有 legacy 清理。

这些规则主要阻止：旧 Sass API、旧 custom properties、写死的颜色/间距/排版/阴影/动效值、不受控 z-index，以及绕过 React 组件的布局或文字样式。它们对遗留仓仍可作为迁移护栏，但有三个边界：

- 规则与 `@shopify/polaris` major 有版本配对，不能把归档配置盲目装进当前 Web Components 项目。
- lint 只证明源代码符合规则，不证明视觉、可访问性、BFS 或运行时正确。
- 为旧失败生成 disable 注释只是迁移隔离措施；新代码不得复制这些豁免。

本 ISO 根目录的 stylelint 配置是团队自己的检查资产。它是否适用于目标 App，要根据目标依赖和 CSS 范围决定，不能因为历史工具也叫 Polaris 就自动启用。

## 其他历史工具

| 工具 | 归档用途 | 当前处置 |
|---|---|---|
| Polaris for VS Code | 为旧 `--p-*` token 提供 CSS/Sass 自动完成与预览 | 仅帮助遗留 token 维护；建议列表不等于当前权威 |
| Sandbox | Alpha 状态的 React 组件原型环境 | 只读历史示例，不作为当前 App 起手模板 |
| Figma UI Kit / contributing 指南 | 同步旧 React 组件、tokens、icons 和文档贡献 | 用于理解协作方法；当前设计稿应核对当前 Shopify 资源 |

## 来源与校验

- Token 清单、类别和树指纹见 [system-inventory.json](system-inventory.json)。
- 534 个 icon 名称与 icon tree 指纹也在同一清单中。
- 69 个 `tokens/`、`icons.mdx` 和 `tools/` 来源的逐文件 hash 与手册落点见 [source-manifest.json](source-manifest.json)。
- 新 App 的实现选择转到 [当前 Shopify 映射](08-current-shopify-mapping.md)。
