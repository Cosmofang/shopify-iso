# Shopify 平台规范迭代审计

> 文档版本：`1.0.0`
> 最后修改：`2026-09-28 01:05 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Polaris Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [Shopify developer changelog](https://shopify.dev/changelog)

## 结论

截至 2026-09-28，BFS 当前要求仍为 77 条叶子要求和 63 条 Section 4 设计拒审理由。当前官方 Markdown SHA-256 为 `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93`；本地逐条标题、正文语义、要求编号和拒审理由已对齐。指纹变化来自官方示意图、排版和链接更新，不能只改哈希而不记录链接漂移。

App Store 当前仍为 174 条叶子要求，分区为 `1=20`、`2=17`、`3=6`、`4=24`、`5=107`，SHA-256 为 `52dc6cb5f377a919077c58c6032a55fd2c86d14e898603efae8228d8230052d2`。BFS/App Store 的数量和指纹不等于任何真实 App 已通过审核。

BFS 正文链接审读工具在本次核验中确认 `59/59` 个 Shopify developer targets 可达；旧 `s-app-nav` 目标已记录为 `MOVED` 到当前 App nav 文档，其余链接为 `OK`。

Polaris 当前生产基线是 1.x：使用 `https://cdn.shopify.com/shopifycloud/polaris-1.js`，需要可复现构建时固定 `polaris-1.1.js`，类型对齐 `@shopify/polaris-types@1.1.0`。类型 manifest 的 62 个 tags 中新增 `s-empty-state`、`s-number`、`s-progress`；当前文档入口有 50 个去重组件参考页加 1 个 versioning 页，不能与 62 个 types tags 混算。Polaris 2.0 仍是 release candidate，加载 `polaris-2.0-rc.js` 只用于明确迁移评估。BFS App Home 视觉适配截止日期为 2027-05-01。

## BFS 与 App Store

| 来源 | 核验结果 | 类型 | ISO 动作 |
|---|---|---|---|
| [BFS requirements Markdown](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) | 77 叶子、63 拒审理由；SHA `72a477…fb93` | 官方硬要求 | 更新全文快照、矩阵和 verifier 指纹；保留逐条正文比较 |
| [BFS fulfillment changelog](https://shopify.dev/changelog/updated-built-for-shopify-requirements-for-fulfillment-services-apps) | 5.8.2 完成率 ≥97%（排除近 7 天新单）；5.8.6 24h ≥95%；5.8.7 24h ≥99% | 官方硬要求变更 | `05-engineering/category-specific.md` 与矩阵保持当前阈值 |
| [BFS returns/subscriptions changelog](https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps) | 2026-12-01 起，适用的买家自助退换货/订阅管理以 Customer Account API 为主要认证 | 官方硬要求，未来生效 | 5.12.4/5.14.5 保留未来生效标记；需按真实类别判定 |
| [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements.md) | 174 叶子；SHA `52dc6b…52d2` | 官方硬要求 | canonical URL 与 verifier 已统一 |
| [Unique app name changelog](https://shopify.dev/changelog/updated-app-store-requirements-4-1-2-use-a-unique-name-for-your-app) | App Store `4.1.2` 要求 unique/recognizable name，以 distinctive brand identifier 开头，不得与 App、开发者、品牌或 Shopify 产品混淆 | 官方硬要求变更 | 与 `1.1.5` 重复 App 政策分开记录 |
| [Honest review practices](https://shopify.dev/changelog/updated-app-store-requirements-13-always-use-honest-and-transparent-review-practices) | `1.3.1` 禁止以功能、折扣、赠品或 withholding features 换评价；请求应中性 | 官方硬要求/执行政策 | App Store 摘要已补 requirement ID、后果与 Reviews API 方向 |
| [App Pricing update](https://shopify.dev/changelog/unlimited-private-plans-and-target-stores-in-shopify-app-pricing) | private plans 与 target stores 不再受旧数量限制 | 官方平台能力变更 | 记录为定价流程来源，不把它当 BFS 通过证据 |

BFS 原文链接的当前漂移已记录：3.2.2 Asset API 使用 `/docs/api/admin-rest/latest/resources/asset`；customer segment action extension 使用 `/docs/apps/build/marketing/customer-segments`；动态 `api-terms?shpxid=...` 不复制到 ISO canonical URL。

## Polaris 与 App Bridge

| 来源 | 核验结果 | 类型 | ISO 动作 |
|---|---|---|---|
| [Polaris CDN semantic versioning](https://shopify.dev/changelog/the-polaris-cdn-is-adopting-semantic-versioning) | major 可能 breaking；minor 为兼容组件/API、无障碍、性能和视觉改进；types 与 CDN major 对齐 | 官方版本/API 指导 | tooling、START-HERE 和 Skill 改为稳定主线/固定版本分离 |
| [Polaris CDN 1.1 stable](https://shopify.dev/changelog/polaris-cdn-1-1-is-now-stable) | 1.1 稳定；新增 Empty state、Number、Progress；新增 `fontSize`、`visibleMonths`、`supplementalStart`；`fontVariantNumeric` 推荐迁移到 Number | 官方组件/API 合同 | inventory、mapping、component inventory 更新到 1.1.0/62 |
| [Polaris 2.0 RC](https://shopify.dev/changelog/polaris-2-0-release-candidate) | RC CDN；新 Admin visual style；2027-05-01 BFS App Home 适配截止；底部安全区变量 | 官方迁移指导/未来平台要求 | 明确 RC 不属于生产稳定基线，补新旧 Admin/外部渲染回归矩阵 |
| [Admin new look rollout](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) | 新 Admin 视觉自 2026-09-15 渐进推出；同一 App 可能遇到新旧 Admin；UI extensions 自动匹配，App Home 自绘界面需显式迁移 | 官方平台迁移指导 | 将新旧 Admin 并存写入迁移测试条件 |
| [React → Web Components migration](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react) | 按 route/self-contained feature 分片；React 19 controlled fields；不能让 `.Polaris-*` CSS 穿过 Shadow DOM；一次只加载一个 Polaris build | 官方迁移指导 | 更新历史手册映射、组件阅读路线和 scaffold |
| [App Bridge Web Components](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components) | App Bridge 不与 Polaris 一起版本化；运行时 `https://cdn.shopify.com/shopifycloud/app-bridge.js` | 官方 API 合同 | App Bridge 独立记录；BFS latest App Bridge 仍需真实 App 证据 |
| [Polaris React archive](https://github.com/Shopify/polaris-react-archive) | React 仓库已归档/弃用；当前权威入口为 Polaris API 与 Web Components | 历史来源边界 | 旧 React 只保留迁移和遗留维护参考 |

## 工具与来源冲突

- npm 核验：`@shopify/cli` `4.8.2`、`@shopify/shopify-app-react-router` `3.0.0`、`@shopify/polaris-types` `1.1.0`。官方 React Router 模板仍声明 `^1.1.0`，模板快照与 npm latest 是不同合同。
- App Bridge React 存在 npm dist-tag 与官方 release 差异：npm `latest` 为 `3.7.12`，GitHub 当前 release 为 `4.2.13`。这不是允许降级的理由；运行时以官方 App Bridge CDN、当前模板和实际 lockfile 为准，版本冲突状态记录为 `unverified`，不能在 ISO 中宣称已解决。
- 固定 Polaris CDN URL 配置需要 `@shopify/shopify-app-react-router >=2.1.0`，且 React `AppProvider.polarisUrl` 与服务端 `shopifyApp({polarisUrl})` 必须一致。

## 未验证项

- Dev Dashboard / Partner Dashboard 的真实分发、Partner standing、付费活跃店净安装、评价、近期评分和自动评估状态：本次没有 App 级 Dashboard 证据，均保持 `unverified`。
- 真实 App 的 Web Vitals、checkout/storefront 性能、移动端真机、生产卸载清理、App Store 审核结果：规范库更新不构成这些证据。
- Polaris 2.0 RC 的实际 App 迁移结果：仅完成官方来源和文档边界核验，未声称任何 App 已适配。
