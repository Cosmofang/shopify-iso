# App Store 前置要求（BFS 1.1.1）

> Built for Shopify 不是独立于 App Store 的 77 项检查。BFS `1.1.1 Meet App Store requirements` 会在申请时重新审计完整 App Store requirements。

## 官方来源与覆盖

本页于 **2026-07-30** 完整审读：

1. [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)：174 条叶子要求，硬性真相源。
2. [App Store best practices](https://shopify.dev/docs/apps/launch/shopify-app-store/best-practices)：安装、listing、支持和各类别推荐做法。
3. [BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements)：77 条叶子要求，其中 `1.1.1` 引用本层。
4. Partner Program Agreement、Shopify API License and Terms of Use 与政策执行页面：账号治理依据。

当前 App Store requirements 全文 SHA-256：

```text
52dc6cb5f377a919077c58c6032a55fd2c86d14e898603efae8228d8230052d2
```

运行 `node scripts/verify-app-store-requirements.mjs` 检查 174 条数量、各 section 数量和全文指纹。

本页是阶段门和类别路由摘要，不代替 174 条逐项结论。实际 App 必须按 [合规证据账本](requirements-ledger.md) 生成 App Store + BFS 联合 ledger，并为每条适用要求记录证据与状态。

## 两层资格门

| 层级 | 规模 | 何时检查 | 能否互相替代 |
|---|---:|---|---|
| Shopify App Store requirements | 174 条：通用 67 + 类别 107 | 立项、开发、发布、BFS 申请和持续运营 | 不能；这是 BFS 1.1.1 的前置层 |
| Built for Shopify requirements | 77 条：前置、性能、集成、设计、类别 | 从立项持续到申请与年度复核 | 不能；通过 App Store 不代表达到 BFS |

任何“BFS 77/77”结论必须同时注明 App Store 174 条适用项状态，否则只能称为 BFS 文档映射完成，不能称为完整资格通过。

## 通用 67 条：所有公开 App 都要检查

| Section | 数量 | 开发阶段门 |
|---|---:|---|
| 1. Policy | 20 | 商业模式、checkout、billing、评论和 Partner/API 条款在立项时通过 |
| 2. Functionality | 17 | API、App Bridge、GraphQL、安装/重装和功能完整性在实现时通过 |
| 3. Security | 6 | TLS 与最小 scopes 在架构、部署和提交时通过 |
| 4. App Store Listing | 24 | 名称、定价、内容、图片、分类、测试资料在分发前通过 |

### 1. Policy：先做 go/no-go

- 嵌入式 App 使用 session token，且在 Chrome incognito 下不依赖第三方 cookie 或 `localStorage` 完成认证。
- 订单和买家付款不绕开 Shopify Checkout；退款回到原支付处理方。
- 可选费用默认关闭，显示明确金额并获得买家主动同意；最低价配送默认选中。
- 不下载/分发主题，不复制无授权商品内容，不做 Shopify App Store 禁止的 agency marketplace、第三方 POS、桌面必装软件或资本借贷模式。
- 支付网关必须先获授权并使用指定 Payments API；普通 App 不能伪装支付能力。
- 所有 App 费用使用 Shopify App Pricing 或 Billing API；支持商家自助升级/降级，重装后重新走收费批准。
- 评论请求保持中性，不能以功能、折扣、赠品或其他激励换评价。
- App 必须唯一、事实真实，不复制自己已发布的相同 App。

### 2. Functionality：完整可运行

- 无阻断或局部阻断 review 的 UI bug、显示问题、404/3xx/5xx 页面；核心功能通过可交互 UI 提供。
- 与 Shopify 或第三方同步的数据准确、一致，并有失败恢复。
- 使用 Shopify API；新公开 App 只使用 GraphQL Admin API，不新增 REST Admin API。
- 最新 App Bridge 脚本在其他脚本之前加载，提供一致的 embedded experience。
- Admin/Sidekick extensions 必须 feature-complete、提供与声明一致的新功能，不放促销、广告、交叉销售或评价请求。
- Max modal 只能由商家交互启动，不能从导航或首次加载自动打开。
- 安装只能从 Shopify-owned surface 发起，不要求手输 shop domain；先 OAuth，再进入 UI；重装也重新认证。

### 3. Security：部署前硬门

- 所有客户端到 App server 的流量使用无错误的有效 TLS/SSL。
- scopes 只申请功能必需项；非所有商家都需要的能力优先 optional scopes。
- `read_all_orders`、`write_payment_mandate`、`write_checkout_extensions_apis`、`read_advanced_dom_pixel_events`、`read_checkout_extensions_chat` 等敏感 scope 必须有逐项功能证据。
- 受保护客户数据、合规 webhooks、保留/删除和访问控制继续按 [Security](../05-engineering/security-data.md) 与 [Webhooks](../05-engineering/webhooks-compliance.md) 执行。

### 4. Listing：分发前硬门

- Dev Dashboard/TOML 与 listing 名称一致或明显相似；名称以独特品牌开头，不仿其他 App、Shopify 产品或品牌。
- 所有价格、试用期和额外费用只在 Pricing details 的指定位置准确披露；图片、icon、介绍和详情不塞价格。
- listing 不写统计数据、保证、“第一/最好/唯一”、评价或 testimonials；图片也一样。
- 只声明 UI 真正完整支持的语言；准确选择 tags、地理条件、Online Store/plan/API eligibility。
- subtitle、details、feature list 描述商家价值和真实功能，不堆关键词；图片清晰、唯一，主要展示实际 UI，不含浏览器 chrome、PII 或 Shopify 商标。
- 提交英文或带英文字幕的完整 screencast，覆盖 onboarding、listing 声称的功能和预期结果。
- 第三方系统提供长期有效、可访问全部功能的测试凭证；提交前重新验证。
- Partner Dashboard 配置 emergency developer contact，并保持支持与隐私政策入口有效。

## App Store 类别 107 条：独立于 BFS 类别

App Store 与 BFS 使用不同的类别体系和编号。一个 App 可能同时命中多个类别，必须分别取并集。

| App Store 类别 | 数量 | 核心路由 |
|---|---:|---|
| 5.1 Online store | 5 | Theme App Extension、店面/Theme Editor 正常、详细 onboarding/deep link、有限 attribution、数据回传 |
| 5.2 Payment | 15 | 预授权、Payments Apps API、独立非 embedded、全浏览器证据、test mode、无 payment flow upsell |
| 5.3 Payment facilitator | 3 | 必须由 gateway owner 提交、无交易处理、对商家免费 |
| 5.4 Purchase option | 19 | scopes、selling plan/contract、产品页扩展、customer portal、取消/付款方式、多币种与清晰收费 |
| 5.5 Product sourcing | 5 | fulfillment request、COGS、PCI gateway、禁售高风险品、付款确认后履约 |
| 5.6 Checkout customization | 9 | feature-complete、无自促销、商品信息一致、可选费主动同意、无倒计时/重复采集/支付字段 |
| 5.7 Sales channel | 18 | channel scopes、发布/账号状态、反馈、Shopify Checkout、断开连接、sales attribution |
| 5.8 Post purchase | 10 | 透明 accept/decline、商品/价格一致、最多连续 2 次、回订单确认、无第三方广告/追踪页 |
| 5.9 Mobile app builders | 3 | 转 Sales Channel、商店提交说明、theme builder/presets |
| 5.10 Donation | 7 | 慈善资质/捐赠证明、成本透明、Theme/Checkout extension、Shopify Checkout/合规收款 |
| 5.11 Blockchain | 13 | 支付伙伴限制、NFT 状态/追踪、获批后销售、仅 primary sale、链上无个人数据、端到端测试 |

逐项以 [官方 App Store requirements section 5](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements#category-specific) 为准。BFS 的 Ads、Analytics、Carrier、Discount、Email、Forms、Fulfillment、Invoices、Bundles、Reviews、Returns、SMS、Subscription 等 14 类仍单独在 [BFS category-specific](../05-engineering/category-specific.md) 检查。

## 关键来源冲突如何处理

### Asset API

- App Store 链接的 Asset API legacy 页面列出 4 类“可能申请 `write_themes` 豁免”的用途，包括 adding Liquid to repeating blocks。
- BFS `3.2.2` 是更高且更窄的标准，只列出 **3 类**：完整 page builder、完整 backup/restore、主要功能为 SEO/content locking/developer tooling。
- 目标是 BFS 时按 3 类执行；“repeating blocks 可能获 App Store scope 豁免”不等于符合 BFS。任何写入都要有 Shopify 批准、必要性、回滚与卸载证据。

### 当前与归档组件

- BFS 原文中的旧 `s-app-nav` URL 当前返回 404；现行文档是 [App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)。
- Polaris Fullscreen bar 是归档反例；当前全屏/大流程使用 `s-app-window`、`s-page` 或由商家主动触发的当前 Max modal 模式。
- Polaris React 页面只保留历史设计逻辑；新 App 使用 Polaris Web Components 和 App Bridge Web Components。

## 阶段证据

- [ ] 立项文档明确 public/custom distribution、Partner standing、收费方式和禁止模式检查结果。
- [ ] App Store 11 类与 BFS 14 类分别判定，所有适用类别取并集。
- [ ] `shopify.app.toml` scopes 表逐项有功能理由，optional scope 已评估。
- [ ] Incognito 安装/重装、OAuth、session token、升级/降级/拒绝收费均已验证。
- [ ] TLS、同步一致性、错误状态、桌面/移动和卸载重装有证据。
- [ ] Listing 内容、定价、图片、语言、eligibility 与实际产品一致。
- [ ] Review screencast、测试账号、英文说明和 emergency contact 均有效。
- [ ] App Store 适用项通过后，再完成 BFS 77 条与 Distribution 自动评估。
