# Built for Shopify 官方要求总矩阵

> 外部真相源：[Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [Markdown](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) · [Changelog](https://shopify.dev/changelog?filter=built_for_shopify)
> 本地核准日期：**2026-08-18**。当前官方页面包含 **77 条叶子要求**。

本文件负责保证官方每个编号在 ISO 中都有落点。它不是完成证明：是否适用、是否通过以及自动评估结果，仍以 Dev Dashboard → Distribution 为准。

## 使用方法

1. 先运行 `node scripts/verify-bfs-requirements.mjs`，确认官方编号、标题和全文指纹未漂移。
2. 在 Dev Dashboard 确认 App 当前类别与适用项。
3. 按矩阵进入对应 ISO 文档执行检查。
4. 从 [合规证据账本模板](requirements-ledger.md) 生成 App Store + BFS 联合 ledger，在 App 仓保存适用性、代码位置、Dashboard 指标、截图或测试记录。

状态不能凭主观填写。自动评估项以 Dashboard 为证据，人工评估项以可复现步骤和真实页面为证据。

## 1. Prerequisites

| ID | 官方要求 | ISO 落点 | 主要证据 |
|---|---|---|---|
| `1.1.1` | Meet App Store requirements | [App Store 174 条前置](app-store-requirements.md) · [Engineering 总览](../05-engineering/README.md) | 通用 67 条 + 所有适用类别；Distribution 审计 |
| `1.1.2` | Have a good Partner standing | [Engineering 总览](../05-engineering/README.md) | Partner Account 无 active/outstanding infraction |
| `1.2.1` | Have a minimum number of installs | [Engineering 总览](../05-engineering/README.md) | 付费 active shops 净安装数 >= 50 |
| `1.2.2` | Have a minimum number of reviews | [Engineering 总览](../05-engineering/README.md) | App Store reviews >= 5 |
| `1.2.3` | Have a minimum app rating | [Engineering 总览](../05-engineering/README.md) | Distribution 显示 recent rating 达标 |

## 2. Performance

| ID | 官方要求 | ISO 落点 | 主要证据 |
|---|---|---|---|
| `2.1.1` | Minimize Largest Contentful Paint (LCP) | [Performance](../05-engineering/performance.md) | p75 <= 2.5s；28 天 >= 100 calls |
| `2.1.2` | Minimize Cumulative Layout Shift (CLS) | [Performance](../05-engineering/performance.md) | p75 <= 0.1；28 天 >= 100 calls |
| `2.1.3` | Minimize Interaction to Next Paint (INP) | [Performance](../05-engineering/performance.md) | p75 <= 200ms；28 天 >= 100 calls |
| `2.2.1` | Minimize the impact on store speed | [Performance](../05-engineering/performance.md) | Storefront Lighthouse 降幅 <= 10 分 |
| `2.3.1` | Minimize the impact on checkout speed | [Performance](../05-engineering/performance.md) | 28 天 >= 1000 requests；p95 <= 500ms；失败率 <= 0.1% |

## 3. Integration

| ID | 官方要求 | ISO 落点 | 主要证据 |
|---|---|---|---|
| `3.1.1` | Embed the app in the Shopify admin | [Integration](../05-engineering/integration.md) · [Authentication](../05-engineering/authentication.md) | 每个 document 加载最新 App Bridge；session token；无外站镜像 |
| `3.1.2` | Keep primary app workflows within Shopify | [Integration](../05-engineering/integration.md) | 核心流程可在 Admin 内完成，例外有合理依据 |
| `3.1.3` | Enable seamless sign up based on Shopify credentials | [Integration](../05-engineering/integration.md) | 安装后无二次注册；B2B 例外先支持连接已有账号 |
| `3.1.4` | Include simplified monitoring or reporting | [Integration](../05-engineering/integration.md) · [Design 4.2.3](requirements.md) | 首页有关键指标/简化报告 |
| `3.1.5` | Keep third-party connection settings within Shopify | [Integration](../05-engineering/integration.md) | 第三方连接可在内嵌页连接与断开 |
| `3.2.1` | Provide a clean uninstallation process | [Integration](../05-engineering/integration.md) | Storefront 元素使用 theme app extension；卸载完整清除 |
| `3.2.2` | Doesn't use the Asset API to create, modify, or delete files | [Integration](../05-engineering/integration.md) | API 使用审计；只有官方允许的例外 |

## 4. Design

| ID | 官方要求 | ISO 落点 | 主要证据 |
|---|---|---|---|
| `4.1.1` | Follow UX best practices | [Design](requirements.md) · [Foundations](../01-foundations/) | 桌面/移动逐页截图、无闪烁/布局抖动、Polaris 外观 |
| `4.1.2` | Mobile-friendly | [Design](requirements.md) · [Mobile](../03-patterns/mobile.md) | Shopify 手机 App 真机，无整页横滚/不可访问/挤压 |
| `4.1.3` | Concise app name | [Design](requirements.md) · [Dashboard config](../04-partner-dashboard/config.md) | 桌面 pinned 状态下名称无省略号 |
| `4.1.4` | Use the nav menu | [Design](requirements.md) · [Navigation](../02-components/navigation.md) | `s-app-nav`、父项高亮、无重复 Home/emoji |
| `4.1.5` | Use the contextual save bar | [Design](requirements.md) | 合理表单接 CSB；未保存时不能绕过 Save/Discard 离开 |
| `4.1.6` | Use modals appropriately | [Design](requirements.md) · [Modals](../02-components/modals.md) | heading/actions 使用 slots；无 deprecated Fullscreen bar |
| `4.2.1` | Spelling, grammar and phrasing | [Design](requirements.md) | headings/nav/CTA 校对；单位与上下文完整 |
| `4.2.2` | Helpful onboarding | [Design](requirements.md) · [Onboarding](../03-patterns/onboarding.md) | 六条拒审理由逐项验证；新装、续做、完成后证据 |
| `4.2.3` | Helpful homepage | [Design](requirements.md) | 扩展状态、指标、动态价值；dismiss 后不只剩静态链接 |
| `4.2.4` | Helpful error messages | [Design](requirements.md) · [Forms](../02-components/forms-fields.md) | 红色、持久、字段旁、交互后出现、可行动 |
| `4.2.5` | Guide merchants to logical actions | [Design](requirements.md) · [Buttons](../02-components/buttons.md) | 最合理动作视觉最强 |
| `4.2.6` | Visible previews | [Design](requirements.md) | 实时预览；桌面端控件和预览同时可见 |
| `4.3.1` | Don't make false claims | [Design](requirements.md) | 无结果保证；第三方评分与 App Store 一致 |
| `4.3.2` | Don't pressure merchants | [Design](requirements.md) | 无倒计时、羞辱文案、五星好评奖励 |
| `4.3.3` | Don't distract merchants | [Design](requirements.md) · [Animation](../03-patterns/animation.md) · [Color](../03-patterns/color-usage.md) | 无自动浮层/大元素入场/无关动效；红色只用于错误/破坏性 |
| `4.3.4` | Don't overwhelm merchants | [Design](requirements.md) | 表单分组、无相邻多 Banner、文案可扫读 |
| `4.3.5` | Don't impersonate Shopify | [Design](requirements.md) | 图标不仿官方；AI 不用 Sidekick/magic purple |
| `4.3.6` | Dismissible ads | [Design](requirements.md) | 促销可关闭且同类内容不复现 |
| `4.3.7` | Label and disable premium features | [Design](requirements.md) | 视觉和功能状态一致；套餐清晰；非 Plus 隐藏 Plus 功能 |

## 5. Category-specific

以下条款只在 App 属于相应类别时适用。类别以真实功能和 Dev Dashboard/审核结果为准，不能为规避要求而错误分类。细节统一见 [Category-specific](../05-engineering/category-specific.md)。

| ID | 官方要求 | ISO 落点 | 主要证据 |
|---|---|---|---|
| `5.1.1` | Use web pixels for ads apps | [Category-specific](../05-engineering/category-specific.md) | Web Pixel extension；无 script tag/手贴 JS |
| `5.1.2` | Use Shopify segments for ads apps | [Category-specific](../05-engineering/category-specific.md) | 任意 Shopify segment + customer segment action extension |
| `5.2.1` | Use web pixels for affiliate program apps | [Category-specific](../05-engineering/category-specific.md) | Web Pixel extension |
| `5.3.1` | Use web pixels for analytics apps | [Category-specific](../05-engineering/category-specific.md) | Web Pixel extension |
| `5.4.1` | Respond quickly to rate requests | [Category-specific](../05-engineering/category-specific.md) | 28 天 >= 1000 requests；95% < 500ms |
| `5.4.2` | Complete rate requests reliably | [Category-specific](../05-engineering/category-specific.md) | 成功率 >= 99.9% |
| `5.5.1` | Use discount primitives | [Category-specific](../05-engineering/category-specific.md) | Discount Functions 或原生 discount APIs |
| `5.5.2` | Don't use draft orders with custom discounts | [Category-specific](../05-engineering/category-specific.md) | 无自动化 draft-order custom discount |
| `5.5.3` | Use a single redeem code per discount | [Category-specific](../05-engineering/category-specific.md) | 多码使用 `discountRedeemCodeBulkAdd` |
| `5.5.4` | Create high quality links | [Category-specific](../05-engineering/category-specific.md) | Create discount 链接进入合规内嵌创建页 |
| `5.6.1` | Use web pixels for email marketing apps | [Category-specific](../05-engineering/category-specific.md) | 适用功能使用 Web Pixel extension |
| `5.6.2` | Sync customer data for email marketing apps | [Category-specific](../05-engineering/category-specific.md) | 客户数据按要求双向同步 |
| `5.6.3` | Use Shopify segments for email marketing apps | [Category-specific](../05-engineering/category-specific.md) | 任意 segment + action extension |
| `5.6.4` | Help merchants to identify visitors to their store for email marketing apps | [Category-specific](../05-engineering/category-specific.md) | visitors API |
| `5.7.1` | Use Shopify segments for forms apps | [Category-specific](../05-engineering/category-specific.md) | 任意 segment + action extension |
| `5.7.2` | Help merchants to identify visitors to their store for forms apps | [Category-specific](../05-engineering/category-specific.md) | visitors API |
| `5.7.3` | Sync customer data for forms apps | [Category-specific](../05-engineering/category-specific.md) | 客户数据双向同步 |
| `5.8.1` | Actively fulfill orders | [Category-specific](../05-engineering/category-specific.md) | 28 天 >= 100 fulfillment orders |
| `5.8.2` | Complete fulfillment orders | [Category-specific](../05-engineering/category-specific.md) | 完成率 >= 97%，排除最近 7 天新单 |
| `5.8.3` | Respond to callback requests | [Category-specific](../05-engineering/category-specific.md) | callback 成功率 >= 99% |
| `5.8.4` | Wait for merchant requests | [Category-specific](../05-engineering/category-specific.md) | 仅在 merchant request 后履约 |
| `5.8.5` | Add tracking information | [Category-specific](../05-engineering/category-specific.md) | 80% fulfillment 在创建后 1 小时内有 tracking |
| `5.8.6` | Respond to fulfillment requests | [Category-specific](../05-engineering/category-specific.md) | 95% 在 24 小时内接受/拒绝 |
| `5.8.7` | Respond to cancellation requests | [Category-specific](../05-engineering/category-specific.md) | 99% 在 24 小时内接受/拒绝 |
| `5.9.1` | Enable printing on orders pages | [Category-specific](../05-engineering/category-specific.md) | Order detail 和 index bulk 均有 admin print action |
| `5.10.1` | Use bundles primitives | [Category-specific](../05-engineering/category-specific.md) | static bundle API 或 `cartTransform`，例外有依据 |
| `5.11.1` | Provide a flow trigger | [Category-specific](../05-engineering/category-specific.md) | 收到新评价时触发 Flow |
| `5.11.2` | Use block extensions | [Category-specific](../05-engineering/category-specific.md) | Customer detail admin block 可查看该客户评价 |
| `5.12.1` | Sync returns information | [Category-specific](../05-engineering/category-specific.md) | return 全生命周期事件同步 Shopify |
| `5.12.2` | Include exchange line items | [Category-specific](../05-engineering/category-specific.md) | exchange lines 正确增删 |
| `5.12.3` | Include shipping and restocking fees | [Category-specific](../05-engineering/category-specific.md) | 适用费用写回订单 |
| `5.12.4` | Use the Customer Account API for customer authentication | [Category-specific](../05-engineering/category-specific.md) | 2026-12-01 起；提供买家自助退换货时以 Customer Account API 为主要认证方式 |
| `5.13.1` | Use web pixels for SMS marketing apps | [Category-specific](../05-engineering/category-specific.md) | 适用功能使用 Web Pixel extension |
| `5.13.2` | Sync customer data for SMS marketing apps | [Category-specific](../05-engineering/category-specific.md) | 客户数据双向同步 |
| `5.13.3` | Use Shopify segments for SMS marketing apps | [Category-specific](../05-engineering/category-specific.md) | 任意 segment + action extension |
| `5.13.4` | Help merchants to identify visitors to their store for SMS marketing apps | [Category-specific](../05-engineering/category-specific.md) | visitors API |
| `5.14.1` | Use subscription objects and APIs | [Category-specific](../05-engineering/category-specific.md) | Selling plan、Subscription contract、Customer payment method APIs |
| `5.14.2` | Use theme app block extensions | [Category-specific](../05-engineering/category-specific.md) | OS 2.0 product page app block |
| `5.14.3` | Follow subscriptions UX guidelines | [Category-specific](../05-engineering/category-specific.md) | 订阅信息完整并默认匹配主题视觉 |
| `5.14.4` | Use Customer Account UI extensions | [Category-specific](../05-engineering/category-specific.md) | 客户可查看/管理订阅 |
| `5.14.5` | Use the Customer Account API for customer authentication | [Category-specific](../05-engineering/category-specific.md) | 2026-12-01 起；提供买家自助订阅管理时以 Customer Account API 为主要认证方式 |

## 维护规则

- 官方编号或标题变化时，先核对 [BFS changelog](https://shopify.dev/changelog?filter=built_for_shopify)，再更新矩阵和细节文档。
- 不把 Dev Dashboard 的自动评估结果写成永久规则；阈值以官方页面当前内容为准。
- 新拒审原因应补进对应条款，而不是另建无法回溯官方编号的孤立规则。
- 任何“Not applicable”都要写明类别、功能和判断依据。
