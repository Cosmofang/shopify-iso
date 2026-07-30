# 颜色 Tokens（Color）

> App 运行时以 Shopify CDN 的当前 Polaris Web Components 为准；本章自定义元素 token 快照为 `@shopify/polaris-tokens` 9.4.2。**所有颜色用语义 token，不写死 hex。** hex 仅作 Figma/文档对照。
> ⚠️ 主按钮 = 黑（`--p-color-bg-fill-brand`），**不是**绿 `#008060`（旧值已废）。

---

## 0. 官方来源与优先级

下列四页已于 **2026-07-24 逐页审读完整原始 MDX**，不是只看页面摘要：

| 页面 | 本章覆盖 |
|---|---|
| [Overview](https://polaris-react.shopify.com/design/colors) | 颜色必须有目的、有影响、可访问；颜色不能单独传意 |
| [Palettes and roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles) | 全局 palette 与 13 类通用/专用角色 |
| [Using color](https://polaris-react.shopify.com/design/colors/using-color) | background、surface、fill、border、text、link、icon 的组合关系 |
| [Tokens](https://polaris-react.shopify.com/design/colors/color-tokens) | 语义/专用 token 结构与 hover、active、focus、selected、disabled 状态 |

> 这些页面来自已归档的 `Shopify/polaris-react`，用于保留仍有效的颜色设计逻辑，不代表新 App 应安装 Polaris React。当前实现优先使用 [Polaris Web Components](https://shopify.dev/docs/api/app-home/web-components)；若这里与当前 Web Components、BFS requirements 或 Dev Dashboard 冲突，以当前官方要求为准。

## 1. 背景 Background

| Token | HEX | 用途 |
|-------|-----|------|
| `--p-color-bg` | `#f1f1f1` | 页面底色 |
| `--p-color-bg-surface` | `#ffffff` | 卡片/面板 |
| `--p-color-bg-surface-hover` | `#f7f7f7` | 悬停 |
| `--p-color-bg-surface-active` | `#f3f3f3` | 按下 |
| `--p-color-bg-surface-selected` | `#f1f1f1` | 选中 |
| `--p-color-bg-surface-secondary` | `#f7f7f7` | 次级面 |
| `--p-color-bg-surface-tertiary` | `#f3f3f3` | 三级面 |
| `--p-color-bg-inverse` | `#1a1a1a` | 反色背景 |

## 2. 语义背景 Semantic surfaces

| Token | HEX | 用途 |
|-------|-----|------|
| `--p-color-bg-surface-info` | `#eaf4ff` | 信息 |
| `--p-color-bg-surface-success` | `#cdfed4` | 成功 |
| `--p-color-bg-surface-caution` | `#fff8db` | 未开始/停滞但未被错误阻断，不需立即处理 |
| `--p-color-bg-surface-warning` | `#fff1e3` | pending/进行中/可能需商家介入，最强非阻断状态 |
| `--p-color-bg-surface-critical` | `#fee8eb` | 错误/危险 |
| `--p-color-bg-surface-emphasis` | `#f0f2ff` | 编辑器选中/交互焦点，不作普通装饰 |
| `--p-color-bg-surface-magic` | `#f8f7ff` | Shopify Magic 保留语义；第三方 App 不用来标 AI |

## 3. 填充 Fill（按钮/标记实心色）

| Token | HEX | 用途 |
|-------|-----|------|
| **`--p-color-bg-fill-brand`** | **`#303030`** | **主按钮 rest**（深色，主操作） |
| `--p-color-bg-fill-brand-hover` | `#1a1a1a` | 主按钮悬停（官方变更深） |
| `--p-color-bg-fill-success` | `#047b5d` | 成功填充 |
| `--p-color-bg-fill-warning` | `#ffb800` | 警告填充 |
| `--p-color-bg-fill-caution` | `#ffe600` | 注意填充 |
| `--p-color-bg-fill-critical` | `#c70a24` | 错误/危险填充（含删除主按钮） |
| `--p-color-bg-fill-info` | `#91d0ff` | 信息填充 |

> ❌ **禁止**：`#008060`（旧品牌绿）、`#D86A2A`（deeplumen 品牌橙 `--dl-brand`）当主按钮色。品牌色只用于**店铺前台 widget**等自定义语境，不进 Admin 语义色。

## 4. 文字 Text

| Token | HEX | 对比(白底) | 用途 |
|-------|-----|-----------|------|
| `--p-color-text` | `#303030` | 12.6:1 ✅ | 主文字 |
| `--p-color-text-secondary` | `#616161` | 5.7:1 ✅ | 次要文字 |
| `--p-color-text-disabled` | `#b5b5b5` | 1.9:1 | **仅** disabled |
| `--p-color-text-critical` | `#8e0b21` | — | 错误文字 |
| `--p-color-text-caution` | `#4f4700` | — | 警告文字 |
| `--p-color-text-success` | `#014b40` | — | 成功文字 |
| `--p-color-text-info` | `#003a5a` | — | 信息文字 |
| `--p-color-text-emphasis` | `#005bd3` | — | 链接/强调 |
| `--p-color-text-brand-on-bg-fill` | `#ffffff` | 17.4:1 ✅ | 黑主按钮上的白字 |

> ⚠️ 禁用 `#8c9196`（3.4:1，不达 AA）。次要文字一律 `#616161` 起步。详见 [../00-built-for-shopify/wcag-contrast.md](../00-built-for-shopify/wcag-contrast.md)。

## 5. 边框 Border

| Token | HEX | 用途 |
|-------|-----|------|
| `--p-color-border` | `#e3e3e3` | 默认边框 |
| `--p-color-border-secondary` | `#ebebeb` | 次要 |
| `--p-color-border-focus` | `#005bd3` | 焦点环 |
| `--p-color-border-critical` | `#fec1c7` | 错误边框 |
| `--p-color-border-success` | `#92fcac` | 成功边框 |
| `--p-color-border-caution` | `#ffeb78` | 注意边框 |

## 6. 图标 Icon

| Token | HEX |
|-------|-----|
| `--p-color-icon` | `#4a4a4a` |
| `--p-color-icon-secondary` | `#8a8a8a` |
| `--p-color-icon-critical` | `#e22c38` |

---

## 7. 三条颜色原则（Overview）

1. **有目的**：每次用色必须支持一个商家需要识别的消息、状态或操作；UI 中不以颜色装饰或诱导，装饰色仅限插画。
2. **有层级**：Admin 的中性黑白底让语义色天然醒目。仅对最重要的信息、操作和视觉提示使用更强 prominence，不能用弱颜色淡化严重消息，也不能到处用强色制造竞争。
3. **可访问**：采用既定 token 配对并验证对比度；状态必须同时有文字、图标、形状或位置等可辨信号，**颜色不能成为唯一信息载体**。

> “重要内容可以更鲜明”不是营销高亮许可。BFS 4.3.3 仍禁止用无必要颜色、弹层或动效分散商家注意力。

## 8. Color roles 使用规则

> 历史来源：[Polaris React — Palettes and roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles)。该站已归档；BFS 当前规则冲突时，以 [官方 BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) 为准。

全局 palette 有 12 个色相、每个 16 个 shade，基于 HSLuv 的感知均匀亮度构建；同编号 shade 跨色相替换时，亮度与对比关系保持可预测。它是角色 token 的底层色板，**不是 App 任意取色表**；没有绑定语义角色的颜色仅用于插画。

| Role | ✅ 使用 | ❌ 禁止 |
|---|---|---|
| Default | 默认 Admin 体验、中性消息；secondary/tertiary 表示附加层级 | 用 secondary/tertiary 给整个复杂页面换主题 |
| Brand | 引导当前区域唯一主操作 | 同一区域出现多个 brand 主操作 |
| Info | 提示、一般信息、非紧急但有益内容 | 同组件多处争抢注意；用于需立即处理的状态 |
| Success | 已完成、正常、正向且无需立即操作 | 用成功绿促销、诱导升级或展示优惠 |
| Caution | 未开始、停滞但尚未被错误阻断 | 用于公告 |
| Warning | pending、进行中或需要商家介入的非阻断状态 | 用于 “coming soon” / “under construction” |
| Critical | 错误、阻断、不可完成、破坏性操作 | 非行动性或低重要度信息；普通装饰 |
| Magic | Shopify 自有 Magic/Sidekick 标识 | 第三方 App 用 magic purple/Sidekick 标记 AI，或当装饰色 |
| Emphasis | 编辑器中的当前选中项、交互焦点 | 突出不可交互的普通内容 |
| Transparent | 信息密集界面里重复、低权重的小型操作 | 需要高可发现性的文字按钮 |
| Inverse | Shopify 框架中少量必须深色的较大区域 | 为抢注意给局部元素铺深色；第三方 App 自绘 Admin chrome |
| Input | 表单控件及行为等同表单控件的复杂选择器 | 非表单元素，避免让商家误判为可输入 |
| Nav | Shopify Admin menu 专用 | tabs、普通链接或 App 自绘导航 |

## 9. 语义用色总则（BFS 4.3.3）

| 颜色 | 只用于 |
|------|--------|
| 🔴 红 critical | 错误信息、破坏性操作（删除） |
| 🟢 绿 success | 成功状态/正向趋势 |
| 🟡 黄 caution | 未开始/停滞但非阻断 |
| 🟠 橙 warning | pending/需关注/可能需介入 |
| 🔵 蓝 emphasis/info | 链接、信息、中性强调 |
| ⚫ 黑 brand fill | 主操作按钮 |

> 详见 [../03-patterns/color-usage.md](../03-patterns/color-usage.md)。

## 10. 颜色关系（Using color）

| 元素 | 正确用法 | 禁止/风险 |
|---|---|---|
| Background | 整个 Admin 体验的基线底色；多个 background 只能并排出现 | 叠在另一个 background 上；用于 card 或单个元素 |
| Surface | card、table、banner、modal 等较高 prominence 容器；secondary/tertiary 可在复杂组件内分层 | 同一组件混用多个语义 role surface，或嵌套出刺眼组合 |
| Fill | button、badge 等面积较小且需要注意的元素；文字/图标必须使用对应 `on-fill` | 大组件或整页使用 fill；fill 上混普通 text/icon token |
| Border | 数据表、嵌套表或表格式区域的结构分隔；标准组件外观交给组件本身 | 靠分隔线组织普通信息，造成多余视觉噪声 |
| Text | 正文和“图标 + 文字”组合；default/secondary/tertiary 建立层级 | UI 文字使用 fill/icon 色；`on-fill` 离开对应 fill |
| Link | 仅用于段落/行内文字链接，以及包含图标的文字链接 | 用 link 色伪装 text button；应选择正确按钮组件和 role |
| Icon | 仅用于独立图标，并在对应 background/surface 上验证非文字对比度 | 用 icon token 给文字或“图标 + 文字”整体上色 |

不同角色可以并排表达复杂状态，也可能叠放，例如默认 card 上的 critical icon button。任何跨角色叠放都要重新验证对比度，并避免多个高强度角色互相争夺注意力。

### Disabled 统一方案

- 使用组件的 `disabled` 属性和对应 disabled token，同时真正移除点击、键盘与提交行为。
- 不为不同语义角色自创 disabled 颜色，也不只用 `opacity` 表示禁用。
- 历史页面指出 disabled 元素可不满足通常的对比度门槛；这不允许把仍需阅读的说明文字做成 disabled 灰。正常内容仍须满足 WCAG 2.1 AA。

### 其他颜色

- 未绑定 color role 的 palette 颜色严格保留给插画。
- 如果图表/示意图抽象表示 Admin 状态，仍须遵守语义角色和“颜色不单独传意”；不能借“插画”规避状态规则。

## 11. Token 结构与交互状态（Tokens）

语义 token 把 hex 与用途解耦。命名按以下信息逐步收窄：

1. **Element**：`bg`、`bg-surface`、`bg-fill`、`text`、`border`、`icon`。
2. **Role**：default、brand、info、success、caution、warning、critical 等语义。
3. **Prominence**：default、secondary、tertiary 等视觉层级。
4. **State**：`hover`、`active`、`selected`、`disabled` 等交互状态。

例如 `--p-color-bg-surface-secondary-hover` 表达“次级 surface 的 hover”，而不是某个固定灰色。专用 token 还会带 input、nav 等 concept；**专用 token 只能用于其命名概念**。

| 状态 | 要求 |
|---|---|
| Hover | 指针悬停时给可交互元素反馈，使用 `-hover` token |
| Active | 鼠标或触控按下时使用 `-active` token |
| Focus | 键盘导航可见；通常采用 hover 外观并增加 `--p-color-border-focus` 蓝色轮廓 |
| Selected | 明确表示 button、tab、checkbox、radio 或 navigation item 已被选择，使用 `-selected` token |
| Disabled | 使用 `-disabled` token、移除全部交互，并遵守上面的统一禁用方案 |

实现优先级：先让 `s-*` 组件通过 `variant`、`tone`、`disabled` 等属性生成正确 token 组合；只有官方组件无法覆盖的自定义 UI 才直接引用 CSS token，并逐态验证。Figma 中使用 Polaris library variables 的 fill、stroke 和 text 变量，不用吸管复制 hex。

## 12. 颜色验收清单

- [ ] 每一处非中性色都能说清对应的消息、状态或操作，没有纯装饰/促销诱导色。
- [ ] 颜色之外还有文字、图标、形状或位置线索。
- [ ] background、surface、fill、text、link、icon、border 没有跨用途混用。
- [ ] fill 上的文字/图标使用同角色 `on-fill`，跨角色组合已测对比度。
- [ ] hover、active、focus、selected、disabled 全部存在且语义一致。
- [ ] focus 可见；disabled 真正不可交互且不是只改 opacity。
- [ ] 第三方 AI 没有使用 Shopify Magic/Sidekick 紫色或图标。
- [ ] 运行 `node scripts/verify-polaris-color-guidance.mjs` 与 `node scripts/verify-tokens.mjs`。
