# Onboarding 与 Setup guide（BFS 4.2.2）

> 目标：让新商家快速理解 App 的价值，完成核心功能的首次设置，并清楚知道下一步。

## 官方来源与优先级

本页于 **2026-07-24** 对照以下当前官方内容：

1. [Built for Shopify — Helpful onboarding](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#helpful-onboarding)：审核硬性判据。
2. [App design — Onboarding](https://shopify.dev/docs/apps/design/user-experience/onboarding)：体验建议。
3. [App Home composition — Setup guide](https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide)：当前 Web Components 实现模式。

有冲突时按以上顺序判断。旧指南曾写“没有现成 setup guide pattern”，但当前 App Home 已提供官方 Setup guide composition；新 App 使用当前 composition，不再照旧文手工猜结构。

## BFS 硬性要求：六种拒审理由

| # | 必须做到 | 会被拒审 |
|---|---|---|
| 1 | 步骤直接通向 App 核心功能的可验证完成状态 | 引导结束后商家仍不知道怎样完成设置或开始使用 |
| 2 | 内容简洁、指令直接 | 塞入功能巡游、营销内容或非必要配置，流程冗长 |
| 3 | 新商家容易看到和找到 | 默认折叠、放在首屏外，或藏在不明显的二级入口 |
| 4 | 当前 App 自身即可完成必要设置 | 把安装另一个 App 暗示或设计成必需步骤，例如用主按钮引导安装 |
| 5 | 只索取必要信息，并在字段附近解释用途 | 询问商品类型等信息，却不说明将如何使用 |
| 6 | 完成后可移除 onboarding UI | 已全部完成仍永久占据首页，且没有关闭、收起或自动移除机制 |

## 官方推荐模式

- 首先说明 App 能给商家带来的直接价值，然后尽快进入实际设置，不做长篇欢迎页。
- Setup guide 放在**首页首屏**或独立 onboarding 页面；首次进入默认可见，不默认折叠。
- 只保留完成核心价值所需的离散步骤，官方建议不超过 **5 步**，减少中途流失。
- 每步包含短标题、必要说明和一个明确动作；同一步不要放多个同权重主按钮。
- 步骤在真实任务完成后自动标记完成，并显示 `已完成 X/Y` 等进度反馈。
- 复杂流程提供 “Remind me later” / 稍后继续，恢复后保留真实进度，不阻断商家当前工作。
- 非必要 onboarding 使用带可访问名称的 `x` / Cancel 图标关闭；完成、关闭和折叠是不同状态。
- 索取信息前说明具体用途，例如“用于自动推荐适合的模板”，而不是泛泛称“改善体验”。

> “最多 5 步”、自动完成、进度指示和稍后继续来自官方体验指南，是强烈推荐做法，但没有单独列为 BFS 4.2.2 的拒审条目。六条硬性判据仍须全部通过。

## 当前 Web Components 结构

优先直接采用官方 [Setup guide composition](https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide)，典型结构为：

| 区域 | Web Components | 要求 |
|---|---|---|
| 容器 | `s-section` + `s-grid` | 与首页正常内容同流，不加载即弹 modal |
| 标题与进度 | `s-heading` + `s-paragraph` | 说明价值并显示 `X/Y`，不能只用颜色表示进度 |
| 关闭/折叠 | tertiary `s-button`，`icon="x"` / chevron | 提供准确 `accessibilityLabel`；首次默认展开 |
| 步骤 | `s-checkbox` + heading/description | checkbox 反映真实完成状态，不要求商家手工“自证完成” |
| 步骤动作 | `s-button variant="primary"` | 直接进入该步任务；一区只保留一个主操作 |
| 辅助说明 | `s-paragraph`、必要时 `s-image` | 图片必须有有意义 alt；不为装饰制造大卡片或自动动画 |

引导和公告使用页面内 setup guide / section / banner，**不能在首次加载时自动弹 modal 或 popover**，同时遵守 BFS 4.3.3。

## 状态与数据契约

至少区分以下状态，不能只存一个 `onboardingDone`：

| 状态 | 含义 | UI 行为 |
|---|---|---|
| `incomplete` | 必要任务尚未完成 | 首页首屏显示并默认展开；步骤状态来自真实 App 数据 |
| `deferred` | 商家选择稍后继续 | 不阻断当前工作；保留进度并提供稳定的重新进入入口 |
| `dismissed` | 非必要引导被主动关闭 | 当前界面移除；如仍未完成，在 Help/Settings 提供可预测入口 |
| `completed` | 核心任务全部真实完成 | 自动移除或允许立即关闭；首页改为状态、指标和下一步价值 |

- 完成状态应来自服务端配置、资源创建结果、extension 激活状态等事实，不只依赖浏览器 `localStorage`。
- 商家重新登录、换浏览器或返回 App 时，进度应保持一致。
- 如果任务可在 onboarding 外完成，guide 也必须自动同步为已完成。
- 不把付费升级、好评、推荐奖励或安装其他 App 计入核心 setup 完成度。

## 验收场景

1. **全新安装**：打开首页即可看到简洁 guide，首步动作可用，核心价值清楚。
2. **逐步完成**：完成真实任务后对应步骤自动勾选，刷新页面进度不回退。
3. **稍后继续**：中途离开不会丢失进度，返回后容易找到并继续。
4. **索取信息**：每个非显然字段旁都有具体用途说明，取消不会破坏非必要流程。
5. **完成后**：guide 可移除；首页继续显示配置状态、运行情况或关键指标。
6. **跨设备/移动端**：窄屏无横滚，所有步骤、关闭按钮和主要动作可访问。
7. **反模式扫描**：无自动 modal、无隐藏首屏引导、无额外 App 必装暗示、无超过 5 步的非必要流程。

## 提交证据

- 新安装首页截图：guide 在首屏且默认可见。
- 每步真实完成前后的截图或录屏：自动勾选与进度变化。
- “稍后继续”后重新进入的录屏：进度保持。
- 全部完成后的首页截图：onboarding UI 已移除，首页仍有动态价值。
- 桌面 Admin 与 Shopify mobile 的完整 walkthrough。
