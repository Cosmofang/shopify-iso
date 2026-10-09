# AP main App Store 逐项审计账本

> 文档版本：`1.1.0`
> 最后修改：`2026-09-28 10:34 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI), independent App Store audit`
> 审计对象：`deeplumen-agents/deeplumen-AP@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 证据类型：`App-specific audit evidence`；官方要求原文属于 `Official hard requirement`
> 本次官方来源：[App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [官方 Markdown](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements.md) · [BFS 1.1.1](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#meet-app-store-requirements) · [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) · [Webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe)
> 官方核验日期：`2026-09-28`；当前官方 Markdown SHA-256：`cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e`

本账本针对已确认的 AP main 固定提交，不使用此前 deepLumendev/dev 或 AP dev 的测试作为证据。审阅工作树为 `/private/tmp/deeplumen-ap-release-latest-20260928`；审计时 HEAD 是 `fa2e183`，但 `git diff b39a0146 -- deeplumen-app/app deeplumen-app/shopify.app.toml deeplumen-app/extensions` 为空，因此下面的应用证据均适用于固定的 `b39a0146`。不修改、提交或推送应用代码。

当前官方 **173 条**，分区为 **20 / 17 / 6 / 24 / 106**。App Store `5.8.4` 已不在当前源中，本文不虚构该行；这不影响 BFS 独立编号 `5.8.4`。旧 174 条统计和旧全文 SHA 不作为本轮现行标准。

## 判定边界

状态计数：`unverified=50`，`not applicable=123`，`pass=0`，`fail=0`。这不是“没有问题”：源码中有明确风险和实现缺口，但本仓明确是原型，缺少生产、正式 Listing 和 Dashboard 证据，不能把原型边界外的状态判成通过或生产失败。BFS 已确认失败另见 [findings.md](findings.md)，两套编号不能混用。

- `unverified`：适用或可能适用；记录已有支持/风险，以及缺少的验收。
- `not applicable`：仅当前固定源码不提供该触发能力；每行有具体原因。真实生产、Listing 或 Distribution 若包含该功能，立即恢复为 `unverified`。
- “源码支持”不是完整 requirement pass。当前没有产生任何生产端的 pass 声明。
- 安全相关内容属于对用户自有仓库的授权防御性只读审计；没有主动测试第三方系统，也没有使用真实买家数据进行测试。

## 证据索引

下表 E 编号是后文每一行的明确证据落点。代码链接固定到被审计提交；缺外部证据的 E12 只记录缺失状态，不把 Dashboard 链接当作已读取证明。

| 编号 | 证据 | 已核内容及限制 |
|---|---|---|
| E01 | [对象与原型边界](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/shopify.app.toml#L3) | shopify.app.toml:3-18 明确为前端原型、真实部署在另一仓库；:20-34 为 app identity、embedded 与 scope；:36-53 为当前被注释的 webhook 配置。 |
| E02 | [认证代码支持](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/context.server.ts#L5) | mockContext:5-15 首先 authenticate.admin，再返回模拟业务状态；app/shopify.server.ts:10-25 配置 AppStore distribution 与 PrismaSessionStorage；auth.$.tsx:5-8 调用模板认证。 |
| E03 | [Web/嵌入与脚本](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/root.tsx#L45) | root.tsx:45-82 为 HTML/React Router shell；:72-73 是 App Bridge 在 Polaris 前加载；API key 缺失时跳过 App Bridge。只证明代码路径，不能证明生产加载结果。 |
| E04 | [安装入口与登录回退](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/auth.login/route.tsx#L50) | routes/_index/route.tsx:6-25 引导 Admin；auth.login/route.tsx:50-93 包含 fallback 提示与 Shop domain 表单。缺真实安装路径证据。 |
| E05 | [计费为模拟](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/routes/app.plan.ts#L4) | prototype/routes/app.plan.ts:4-42 用 mockContext/planMock，pricingUrl 指向 prototype/approval；routes/prototype.approval.tsx:1-3 仅重定向模拟批准并明确不创建 subscription/charge。 |
| E06 | [结果暗示](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx#L87) | CPS 文案声称 already bringing traffic and orders；是否有逐店真实数据必须另验。此项是 App 内容风险，不能推定 listing 也违规。 |
| E07 | [业务与店面模拟](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/routes/app.sync.ts#L12) | app.sync action:12-23 固定 success/completed；routes/app.sync.tsx:263-278 用经过时间推进；prototype.storefront.$id.tsx:1-4 明示 Mock storefront / no live store changes。 |
| E08 | [AI 结果和时间文案](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.ai-traffic.tsx#L284) | app.ai-traffic.tsx:129-137、284-286 的推荐可能性和 one-week 文案；AiOrdersCard.tsx:137-145 零态写 AI orders are on the way。参见 findings F-02。 |
| E09 | [索评组件与可达性](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/dashboard/ReviewPromptCard.tsx#L82) | ReviewPromptCard:82-115 调用 Reviews API；当前 prototype/routes/app._index.ts 未赋 reviewPrompt，不能据组件中的 30 天注释直接判定生产重复展示。外部索评渠道未审计。 |
| E10 | [modal 类型边界](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx#L101) | CPS 使用 ControlledModal、autoShow、size=base；components/ui.tsx 输出 s-modal。这是 BFS 4.3.3 的触发时机问题，不是 App Store 2.2.7 所指 Max modal。 |
| E11 | [完整源码范围检索](https://github.com/deeplumen-agents/deeplumen-AP/tree/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes) | 对 app/、extensions/、shopify.app.toml 的路由/扩展/关键词检查：extensions 无实现；未找到业务 REST Admin、GraphQL 数据调用、checkout/payment/sellingPlan/subscriptionContract/refundCreate/returnProcess/cartTransform/ResourceFeedback、NFT/donation/外部 marketplace 实现。没有匹配只支持当前源码范围的排除，不证明真实生产类别。 |
| E12 | [外部证据缺失](https://dev.shopify.com/dashboard) | 本次没有读取正式 App Store listing、提交表、Partner Account、生产 app version、生产环境值或 Dev Dashboard Distribution；这些结论必须保留 unverified。 |
| E13 | [运行验证边界](verification.md) | 复用本轮固定 main 检查记录，不重复 QA；typecheck/build/部分静态 QA 的通过不能替代真实 review。lint、qa:cps、verify:production 的工程失败须见验证记录，不能无条件映射为 App Store 页面运行 fail。 |
| E14 | [卸载/隐私边界](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/webhooks.app.uninstalled.tsx#L5) | uninstalled handler 验签后清理多个 store-scoped 表；本 TOML 订阅被注释，没有 compliance handler，生产配置在另一仓库。代码存在不能证明 webhook 实际投递/履约。 |
| E15 | [免佣宣传与资格未对齐](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/mocks/plan.ts#L184) | planFeatures:184-210 无条件写 First N attributed orders free；prototype/routes/app.plan.ts:15-17 将 used/remaining 设为 null。不能由 total=3 推断当前店铺有可用名额。属于披露风险，正式 listing 和真实 eligibility 仍待查。 |

## 逐项账本

所有官方标题均逐字提取自本次已打开核验的 [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)。各 ID 对应其同名原文，分类与状态是本 App 的证据结论。官方要求没有被本文扩写为其他通用政策。

### 1. Policy — 20 条

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `1.1.1` | Use session tokens for authentication. | `unverified` | 源码支持；尚缺浏览器证据：认证经 authenticate.admin；未把 UI localStorage 计为认证依赖。 | E02、E03 | Chrome incognito 安装、跨页、刷新、令牌失效与重装。 |
| `1.1.2` | Use Shopify checkout. | `not applicable` | 未实现买家 checkout：当前路由为商家 SEO/页面/流量/佣金 UI，无买家结账或支付处理。 | E01、E11 | 若生产有购买链接或交易创建，恢复适用并验 Shopify Checkout。 |
| `1.1.3` | Direct merchants to the Shopify Theme Store. | `not applicable` | 无主题下载功能：本源码没有主题分发/下载入口。 | E01、E11 | 真实产品增加主题功能时重审。 |
| `1.1.4` | Use only factual information. | `unverified` | 存在内容真实性风险：存在 AI 推荐/订单结果暗示；CPS 指标、同步完成态来自 mock。原型示例本身不自动等于欺骗。 | E06、E07、E08；findings F-02 | 移除无法证实的宣传；生产逐店指标、时间窗、归因、示例标识逐项验真。 |
| `1.1.5` | Create unique apps. | `unverified` | 缺外部证据：单一源码无法判断 Partner 已发布的其他 App 是否 identical。 | E12 | 取得 Partner 应用清单、listing 和功能对比。 |
| `1.1.6` | Build single-merchant storefronts. Marketplaces should be sales channels. | `not applicable` | 无 marketplace：Agentic Page 展示自己店铺内容；未实现多商家 classifieds marketplace。 | E01、E11 | 若生产向外部 marketplace 发布商品，重新分类。 |
| `1.1.7` | Always build Payment Gateway apps using the Payments API and after obtaining authorization. | `not applicable` | 无 Payment Gateway：CPS 是商家支付给 App 的佣金，不是处理买家付款的 gateway。 | E05、E11 | 加入支付处理前重新走官方授权和 Payments API 评估。 |
| `1.1.8` | Build apps for Shopify POS only, not third-party systems. | `not applicable` | 无第三方 POS 集成：源码无 POS 系统连接功能。 | E01、E11 | 有新增 POS 集成时重审。 |
| `1.1.9` | Obtain explicit buyer consent before adding charges. | `not applicable` | 无买家可选附加费：App CPS 收费不修改买家 cart/checkout 总额。 | E05、E11 | 新增买家费用时检查默认值、金额披露和明确同意。 |
| `1.1.10` | Maintain the cheapest shipping option as default. | `not applicable` | 无运费排序修改：未见 delivery customization、carrier rate 或运费排序能力。 | E11 | 新增配送功能后重审最低价默认项。 |
| `1.1.11` | Offer browser extensions as optional features only. | `not applicable` | 无浏览器扩展依赖：当前是嵌入式 Web App，无扩展安装作为商家前置。 | E01、E11 | 新增浏览器扩展时验证可选性。 |
| `1.1.12` | Build web-based apps. | `unverified` | 源码支持 Web App：React Router 与 App Home 页面构成 Web UI；源码未要求桌面客户端。 | E01、E03 | 生产主要功能在支持浏览器可完成后才能全项 pass。 |
| `1.1.13` | Duplicate only authorized product information. | `unverified` | 缺授权与数据链证据：页面/商品示例来自 prototype；不足以证明生产内容全部来自商家授权资源。 | E01、E07 | 核对生产读取源、商品授权边界及复制类营销文案。 |
| `1.1.14` | Don't connect merchants to external agencies and developers. | `not applicable` | 无 agency/freelancer 撮合：没有连接外部开发者、机构的 marketplace 功能。 | E01、E11 | 新增服务撮合时重新做分发资格判断。 |
| `1.1.15` | Process refunds only through the original payment processor. | `not applicable` | 无买家退款执行：佣金账本的退款说明不等于替买家执行订单退款；未发现 refundCreate/returnProcess 执行。 | E05、E11 | 若生产处理买家退款则恢复适用；App 佣金返还另核 Billing。 |
| `1.1.16` | Don't provide capital lending. | `not applicable` | 无借贷功能：未发现贷款、垫资、应收账款购买产品。 | E01、E11 | 商业模式变更时重审。 |
| `1.2.1` | Use Shopify App Pricing or the Shopify Billing API. | `unverified` | 计费边界为模拟：pricingUrl 指向 prototype/approval，该页明确不创建 subscription 或 charge。 | E05 | 生产 App Pricing/Billing API 配置和真实批准/账单记录。 |
| `1.2.2` | Implement Shopify App Pricing or the Shopify Billing API correctly. | `unverified` | 缺完整收费验收：模拟 approval 返回 plan-active 不能证明接受、拒绝、重装重新批准或正确计费。 | E05 | 在测试店验证 accept/decline/reinstall、重复回调、额度、退款和记录一致性。 |
| `1.2.3` | Allow pricing plan changes. | `unverified` | 有前端选计划入口：Plan 有 CTA，但目标是模拟批准页，无法证明自助升级/降级。 | E05 | 真实 hosted pricing、升级/降级、有效订阅和 charge history。 |
| `1.3.1` | Do not offer incentives for reviews. | `unverified` | 组件支持中性请求路径但不可替代运营核验：ReviewPromptCard 调 Reviews API；当前 loader 未提供 reviewPrompt，无法据组件注释证明展示行为。 | E09 | 审查真实可达文案、所有外部索评渠道和无激励/无功能扣留证据。 |
### 2. Functionality — 17 条

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `2.1.1` | Build apps without critical errors to ensure review completion. | `unverified` | 缺真实完整流程：构建/静态 QA 不证明真实 review 流程无阻断；当前后端主要是 prototype。 | E01、E13 | 生产新装→核心流程→卸载/重装，保留网络与错误证据。 |
| `2.1.2` | Build apps without even minor errors to ensure review completion. | `unverified` | 有已知 UI 风险待复核：弹窗触发、错误色等见 findings；lint/qa:cps 失败属于工程证据，不能直接当本条运行失败。 | E13；findings F-01/F-04/F-06 | 修复后逐页桌面/移动、空/加载/失败、键盘复验。 |
| `2.1.3` | Have a user interface (UI) that merchants can interact with. | `unverified` | 源码有可交互 UI：存在 App Home、Blog、Traffic、Plan、Commission、Settings 路由。 | E01、E03 | 在真实安装环境验证交互可达，无 web error。 |
| `2.1.4` | Synchronize data accurately. | `unverified` | 同步是模拟，生产证据缺失：app.sync action 固定 success/completed；客户端百分比取经过时间。 | E07 | 真实 Shopify↔后端↔页面对账、失败/重试/幂等验证。 |
| `2.2.1` | Use Shopify APIs. | `unverified` | 认证集成存在，业务 API 未证实：使用 Shopify 认证 SDK；核心业务路由调用 mockContext/mocks，不能证明真实 Shopify API 数据交互。 | E02、E07 | 提交生产 GraphQL 调用、请求与 Shopify Admin 对账证据。 |
| `2.2.2` | Provide a consistent embedded experience. | `unverified` | 源码支持 embedded：TOML embedded=true，App shell 与 App Bridge 存在；外部跳转完整性未运行核验。 | E01、E03 | 真实 Admin 所有核心流程、会话与导航复验。 |
| `2.2.3` | Use the latest version of Shopify App Bridge. | `unverified` | 源码脚本顺序支持：root 在其他 script 前同步加载当前 app-bridge.js；apiKey 缺失时跳过。 | E03 | 验证生产每个 document 实际加载成功、只有所需实例及有效 API key。 |
| `2.2.4` | Use the GraphQL Admin API. | `unverified` | 未发现业务 REST，亦缺业务 GraphQL：SDK 认证不等于业务已使用 GraphQL；原型 API 边界不能证明生产合规。 | E02、E07、E11 | 审计真实业务 Admin API 调用，核对公共 App 新建时间与迁移。 |
| `2.2.5` | Admin extensions must be feature-complete. | `not applicable` | 未提供 Admin UI extensions：extensions 目录没有扩展配置，App Home 不等于 Admin extension。 | E11 | 新增 Admin block/action/link 时恢复适用。 |
| `2.2.6` | Don't display promotions or advertisements in admin extensions. | `not applicable` | 未提供 Admin UI extensions：没有 Admin block/action/link 承载广告或索评的实现。 | E11 | 新增扩展时检查其全部内容。 |
| `2.2.7` | Only launch Max modal with merchant interaction. | `not applicable` | 未使用 Max modal：当前 CPS 使用 size=base 的 s-modal，不是本条 Max modal；自动弹窗仍按 BFS 4.3.3 审核。 | E10 | 新增 Max modal 时验证仅直接商家交互触发。 |
| `2.2.8` | Sidekick app extensions must align with stated app functionality. | `not applicable` | 无 Sidekick extension：当前扩展清单未发现 Sidekick tools/intents/actions。 | E11 | 新增后比对实际功能、配置与 listing。 |
| `2.2.9` | Don't display promotions, advertisements, or cross-sell other services in Sidekick app extensions. | `not applicable` | 无 Sidekick extension：当前未实现 Sidekick 内容面。 | E11 | 新增后检查广告、交叉销售与索评。 |
| `2.3.1` | Initiate installation from a Shopify-owned surface. | `unverified` | 主入口支持，备用登录需运行核查：根路由引导 Shopify admin；auth/login 仍有 shop domain 输入，文案称仅作重认证回退。 | E04 | 证明真实安装/配置不进入手输域名流程；注释本身不能证明合规。 |
| `2.3.2` | Authenticate immediately after install. | `unverified` | 源码支持先认证：App loader 的 mockContext 首先 authenticate.admin；未做真实首次安装测试。 | E02 | 新店安装证明 OAuth 前不能操作商家 UI。 |
| `2.3.3` | Redirect to the app UI after installation. | `unverified` | 缺 OAuth 回跳证据：根路由存在携带 shop 跳转 /app 的逻辑，未验证真实权限接受回跳。 | E02、E04 | 新装批准权限后直接到 App UI，不落空页/错误页。 |
| `2.3.4` | Require OAuth authentication immediately after reinstall. | `unverified` | 源码支持重认证但缺重装证据：认证 SDK、uninstalled 删除 session/onboarding 实现存在；webhook 订阅在此 TOML 被注释。 | E02、E14 | 真实卸载投递、清理、重装 OAuth 与权限回跳。 |
### 3. Security — 6 条

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `3.1.1` | Use a valid TLS/SSL certificate. | `unverified` | 缺生产 TLS 证据：TOML 是脚手架 URL；不能由 https 字符串证明真实域名证书和链有效。 | E01 | 生产 App URL、重定向 URL、服务端端点 TLS/证书链检查。 |
| `3.2.1` | Request read_all_orders access scope only if it provides necessary app functionality. | `not applicable` | 当前配置未申请该 scope：TOML 只有 content/navigation/products scopes；运行时 SCOPES 可覆盖，生产配置未知。 | E01、E02 | 生产若申请 read_all_orders，补历史订单必要性及批准。 |
| `3.2.2` | Request write_payment_mandate scope only if it provides necessary app functionality. | `not applicable` | 当前配置未申请该 scope：未配置 write_payment_mandate，且当前无付款授权功能。 | E01、E02 | 生产授权 scope 与 env 必须另核。 |
| `3.2.3` | Request write_checkout_extensions_apis scope only if it provides necessary app functionality. | `not applicable` | 当前配置未申请该 scope：未配置 write_checkout_extensions_apis，且无 checkout extension。 | E01、E11 | 生产授权 scope 与 Dashboard 必须另核。 |
| `3.2.4` | Request read_advanced_dom_pixel_events scope only if it provides necessary app functionality. | `not applicable` | 当前配置未申请该 scope：未配置 read_advanced_dom_pixel_events，无 heatmap/session recording 实现。 | E01、E11 | 新增 checkout 行为分析时证明用途必要且符合条款。 |
| `3.2.5` | Request read_checkout_extensions_chat scope only when required. | `not applicable` | 当前配置未申请该 scope：未配置 read_checkout_extensions_chat，当前无 checkout 实时客服。 | E01、E11 | 生产授权 scope 与 Dashboard 必须另核。 |
### 4. App Store Listing — 24 条

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `4.1.1` | App name fields must be similar. | `unverified` | 缺正式名称比对：原型 TOML name=Deeplumen: AI SEO；文件注释的生产名称不是已验证 Dashboard。 | E01、E12 | 同时读取正式 TOML/Dev Dashboard/提交表名称。 |
| `4.1.2` | Use a unique name for your app. | `unverified` | 缺名称唯一性证据：Deeplumen 品牌前缀只是源码事实，不能证明不与其他品牌/应用混淆。 | E01、E12 | 核验当前 listing 名称、App Store 与品牌混淆。 |
| `4.2.1` | Provide accurate and complete pricing information. | `unverified` | 缺正式 Pricing details：有按品类佣金及免费额度 UI；正式 listing 与生产可用计划未读取。 | E05、E12、E15 | 所有费率、试用/免佣条件、额度、额外费用与真实后台对齐。 |
| `4.2.2` | Don't include pricing information in images. | `unverified` | 缺 listing 图片：public/ 图片不是实际已发布的 listing 图片集合。 | E12 | 检查当前 icon/media 中是否包含价格。 |
| `4.2.3` | Don't include pricing information elsewhere in the listing. | `unverified` | 缺 listing 文本：未读取当前正式 listing 各字段。 | E12 | 检查价格仅在 Pricing details 指定位置。 |
| `4.3.1` | Indicate if the Online Store sales channel is required. | `unverified` | 可能适用 Online Store 要求：App 有店面页面/SEO 功能；未读取安装 eligibility。 | E01、E07、E12 | 核对 Merchant must have online store 与真实功能。 |
| `4.3.2` | Only claim to be published in languages that you fully supported. | `unverified` | 缺语言字段与全 UI 对比：root lang=en 只能支持默认语言信息，不能证明 listing 所有声明语言完整。 | E03、E12 | 按 listing 声明语言逐流程检查。 |
| `4.3.3` | Don't use stats, data, or unsubstantiated claims such as guarantees in the listing. | `unverified` | 缺 listing 文本；App 内已有宣传风险：App 内 F-02 不能直接证明 listing 同样违规。 | E08、E12 | 检索正式 listing 的统计、保证、first/best/only。 |
| `4.3.4` | Don't use stats, data, or unsubstantiated claims such as guarantees in images. | `unverified` | 缺 listing 图片：未读取正式 media 的文字与图表。 | E12 | 逐图核对统计/保证/最高级声明。 |
| `4.3.5` | Use accurate tags. | `unverified` | 缺 Dashboard tags：源码显示 SEO、内容、流量统计，但不能推定实际已选 tags。 | E01、E12 | 用当前分类定义核验 tags 与主要功能。 |
| `4.3.6` | Don't include reviews or testimonials in images. | `unverified` | 缺 listing 图片：未读取发布图，不用应用内部截图替代。 | E12 | 检查所有 icon/media 的 reviews/testimonials。 |
| `4.3.7` | Don't include reviews or testimonials in the listing. | `unverified` | 缺 listing 文本：未取得发布 listing 内容。 | E12 | 检查所有未指定字段的 reviews/testimonials。 |
| `4.3.8` | Indicate geographic requirements. | `unverified` | 缺地理/API eligibility：源码中未能确认生产地区或计划限制。 | E01、E12 | 比对实际依赖与 listing 地区/计划/API eligibility。 |
| `4.4.1` | Write effective app card subtitles. | `unverified` | 缺 app card subtitle：本地产品文案不能替代正式 subtitle。 | E12 | 审读真实 subtitle 的价值、关键词、统计和个人信息。 |
| `4.4.2` | Follow the guidelines for app details. | `unverified` | 缺 app details：未取得正式详情文案。 | E12 | 完整功能说明与实际可达功能逐项对照。 |
| `4.4.3` | Don't misuse Shopify brand in graphics. | `unverified` | 缺正式图形资产集合：未核验 listing 所有 icon/banner/screenshot 的 Shopify 商标用法。 | E12 | 以正式提交图核对官方品牌允许范围。 |
| `4.4.4` | Provide clear, focused images. | `unverified` | 缺正式截图：未确认 listing 是否清晰展示真实 UI、无浏览器 chrome。 | E12 | 取得当前提交截图，逐张核验。 |
| `4.4.5` | Provide unique images. | `unverified` | 缺正式截图集合：没有完整 listing media，不能判断近似重复。 | E12 | 逐张比较内容与状态。 |
| `4.5.1` | Submit Sales Channels apps in their respective category. | `not applicable` | 当前源码非 Sales Channel：无 channel config、外部 marketplace 商品发布、买家交易创建；CPS 名称不决定类别。 | E01、E11 | 若实际生产符合 Sales Channel 定义，恢复本条及 5.7 全部要求。 |
| `4.5.2` | Submit as a regular app if not a Sales Channel. | `unverified` | 源码未见 channel config；部署未证实：需要 Dev Dashboard/已部署 app version 确认 regular app。 | E11、E12 | 取得正式分发配置和当前已发布版本证据。 |
| `4.5.3` | Include a demo screencast. | `unverified` | 缺提交 screencast：未取得英文/英文字幕、覆盖真实 onboarding 与全部 listing 功能的视频。 | E12 | 补当前版本完整操作录像。 |
| `4.5.4` | Include test credentials. | `unverified` | 缺提交测试资料：未访问 testing instructions；不在审计文档中存储凭证。 | E12 | 在提交平台核验所有必要账户资料已配置。 |
| `4.5.5` | Include functional test credentials. | `unverified` | 缺测试账号功能验证：没有用 reviewer 身份实际验证所需权限与全功能。 | E12 | 验证账号持续有效、无额外付费/人工开通阻断。 |
| `4.5.6` | Provide an emergency developer contact. | `unverified` | 缺 Partner 资料：紧急联系人不在此源码中。 | E12 | 读取 Partner account 当前 emergency contact 配置。 |
### 5.1. Online store — 5 条

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.1.1` | Use theme app extensions. | `unverified` | 店面能力适用；实现缺外部证据：无 theme app extension 文件；TOML 声明真实部署在另一仓库，不能直接判生产违规。 | E01、E07、E11 | 查真实主题修改方式、extension 配置；不要把原型缺失当生产缺失。 |
| `5.1.2` | Properly show theme app extension in the storefront. | `unverified` | 缺真实店面证据：prototype.storefront 明示 Mock storefront，不能证明 Theme Editor/Online Store 显示。 | E07 | 真实商店与 Theme Editor 正常/失败/移动端检查。 |
| `5.1.3` | Include detailed onboarding instructions for theme app extensions. | `unverified` | 缺真实 theme onboarding：有扫描引导但本仓无 extension install/preview 证据。 | E07、E11 | 按真实 app embed/block 补说明与 deep link 验收。 |
| `5.1.4` | Follow the criteria for App Name Branding. | `unverified` | 缺店面品牌核验：原型预览无法覆盖生产消费者可见组件。 | E07 | 检查真实店面 attribution、品牌删除、买家必要性依据。 |
| `5.1.5` | Send collected data back to the merchant. | `unverified` | 缺采集及回传链：流量/归因数据多为 mocks；不能验证生产 customer data 回传到 merchant admin。 | E07、E11 | 列采集字段、来源、用途、存储与 Shopify Admin 可访问映射。 |
### 5.2. Payment — 15 条

类别判定依据：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.2.1` | Include detailed testing instructions for Payment apps. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.2` | Submit screencasts of the app's payment flow for all supported browsers. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.3` | Provide a functional buyer flow on desktop and mobile devices. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.4` | Use correct payment API scopes. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.5` | Build payment apps as standalone, not embedded. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.6` | Allow buyers to cancel/abandon payment with the payment gateway. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.7` | Redirect merchants back to the Shopify admin using the proper URL. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.8` | Sign a revenue share agreement. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.9` | Match offsite payment information to checkout information. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.10` | Display only Shopify-approved payment methods. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.11` | Offer a test mode. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.12` | Don't upsell any product or features in the payment flow. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.13` | Appropriately name payment apps. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.14` | Use a single Checkout UI extension with permitted targets. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
| `5.2.15` | Don't use banners, logos, or graphics in the checkout interface. | `not applicable` | 当前源码不提供该类别能力：当前为商家 SEO/内容/流量分析原型，没有买家付款 gateway。CPS 是 App 费用，不使本 App 成为 Payment app。 | E01、E11 | 若真实产品加入 payment gateway，恢复适用并取得 Shopify 授权。 |
### 5.3. Payment facilitator — 3 条

类别判定依据：没有为某 payment gateway 展示付款品牌的 facilitator 功能。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.3.1` | Must be submitted by the partner who owns the payment gateway. | `not applicable` | 当前源码不提供该类别能力：没有为某 payment gateway 展示付款品牌的 facilitator 功能。 | E01、E11 | 若实际提供 gateway 配套能力，重新核分类、所有权及免费要求。 |
| `5.3.2` | Must be separate from any financial transactions. | `not applicable` | 当前源码不提供该类别能力：没有为某 payment gateway 展示付款品牌的 facilitator 功能。 | E01、E11 | 若实际提供 gateway 配套能力，重新核分类、所有权及免费要求。 |
| `5.3.3` | Must be free for merchants. | `not applicable` | 当前源码不提供该类别能力：没有为某 payment gateway 展示付款品牌的 facilitator 功能。 | E01、E11 | 若实际提供 gateway 配套能力，重新核分类、所有权及免费要求。 |
### 5.4. Purchase option — 19 条

类别判定依据：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.4.1` | Submit screencasts of purchase option app functionality for all supported browsers. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.2` | Use correct subscription API scopes. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.3` | Don't use incorrect API scopes for purchase option apps. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.4` | Support all browser versions on desktop and mobile. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.5` | Allow buyers to modify subscription payment methods. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.6` | Enable merchants to create and manage selling plans from the product page and choose products for subscriptions. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.7` | Include access to your subscription portal through Shopify's customer portal. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.8` | Enable buyers to cancel their purchase option, or clearly communicate cancellation conditions. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.9` | Navigate buyers to the customer portal. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.10` | Display purchase options and charge timing clearly. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.11` | Don't use selling plan and subscription contract APIs for prohibited actions. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.12` | Link subscriptions directly to the linked Customers in Shopify Admin. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.13` | Show buyers all of their purchased subscriptions in the Customer portal clearly. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.14` | Update multi-currency pricing and discount codes correctly on the product page. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.15` | Link subscriptions directly to the linked Orders in Shopify Admin. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.16` | Display selling plan name in the Cart page. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.17` | Communicate pre-order delays with pre-stated shipment times to buyers. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.18` | Clearly indicate details for prepaid items, including unit price, length of subscription, and price per delivery. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
| `5.4.19` | Enable variant-level product selection for buyers. | `not applicable` | 当前源码不提供该类别能力：未实现买家商品订阅、pre-order、try-before-you-buy、selling plans 或 subscription contracts；App 计费订阅与买家商品订阅不同。 | E01、E11 | 若新增买家 purchase option，恢复适用并逐项验收。 |
### 5.5. Product sourcing — 5 条

类别判定依据：没有向外部供应商选品、采购或履约服务；现有商品/页面内容来自原型数据。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.5.1` | Enable merchants to request fulfillment. | `not applicable` | 当前源码不提供该类别能力：没有向外部供应商选品、采购或履约服务；现有商品/页面内容来自原型数据。 | E01、E11 | 若生产含供应商采购/履约，重新核类别并补完整证据。 |
| `5.5.2` | Include details of cost of goods sold. | `not applicable` | 当前源码不提供该类别能力：没有向外部供应商选品、采购或履约服务；现有商品/页面内容来自原型数据。 | E01、E11 | 若生产含供应商采购/履约，重新核类别并补完整证据。 |
| `5.5.3` | Use a PCI compliant payment gateway. | `not applicable` | 当前源码不提供该类别能力：没有向外部供应商选品、采购或履约服务；现有商品/页面内容来自原型数据。 | E01、E11 | 若生产含供应商采购/履约，重新核类别并补完整证据。 |
| `5.5.4` | Don't sell high risk products. | `not applicable` | 当前源码不提供该类别能力：没有向外部供应商选品、采购或履约服务；现有商品/页面内容来自原型数据。 | E01、E11 | 若生产含供应商采购/履约，重新核类别并补完整证据。 |
| `5.5.5` | Verify payment before marking orders as fulfilled. | `not applicable` | 当前源码不提供该类别能力：没有向外部供应商选品、采购或履约服务；现有商品/页面内容来自原型数据。 | E01、E11 | 若生产含供应商采购/履约，重新核类别并补完整证据。 |
### 5.6. Checkout customization — 9 条

类别判定依据：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.6.1` | Display checkout extensions properly in the storefront. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.2` | Give merchants full control over promotional content. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.3` | Don't display self-promotion or advertisements in checkout extensions. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.4` | Display the same product name, image, and cost as the product in the merchant’s store. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.5` | Get explicit customer consent prior to making any changes that affect the order total in any way. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.6` | Don't add countdown timers to the checkout. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.7` | Use Chat UI components for customer service. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.8` | Don't collect information that is already captured by the standard checkout form field. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
| `5.6.9` | Don't request payment information in checkout UI extension. | `not applicable` | 当前源码不提供该类别能力：extensions 目录无 checkout 扩展；商家端 CPS 弹窗不属于买家 checkout customization。 | E01、E11 | 新增 checkout 扩展后恢复本项，按真实目标逐项验证。 |
### 5.7. Sales channel — 18 条

类别判定依据：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.7.1` | Add the `read_only_own_orders` scope. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.2` | Build with Polaris components and style guide. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.3` | Use the ResourceFeedback API to communicate issues. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.4` | Provide details in the publishing section. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.5` | Provide the marketplace link in the channel interface. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.6` | Communicate commission. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.7` | Open terms and conditions in a new window. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.8` | Use banners for approval or rejection of products. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.9` | Use Polaris cards in the publishing section. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.10` | Redirect to the account section after install. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.11` | Provide error feedback in the publishing section. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.12` | Must allow merchants to disconnect their account. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.13` | Display account information properly. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.14` | Take customers to Shopify's Checkout. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.15` | Must communicate account approval process. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.16` | Use Sales Attribution. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.17` | Communicate eligibility issues. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
| `5.7.18` | Include a Navigation Icon. | `not applicable` | 当前源码不提供该类别能力：未发现 channel config 或向 App 自有 marketplace 发布商品与创建交易能力；Agentic Page 在商家自身店面中呈现内容。 | E01、E11 | 真实功能/Dev Dashboard 若符合 Sales Channel 定义，全部恢复适用；佣金名称本身不能决定类别。 |
### 5.8. Post purchase — 9 条

类别判定依据：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.8.1` | Add the `write_checkout_extensions_apis` scope. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.2` | Ensure the upsell is transparent to the buyer and include accept and decline buttons. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.3` | Show the same product information on post purchase upsell. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.5` | Correctly assign the purchase option category for each selling plan created. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.6` | Redirect to the order confirmation page when done. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.7` | Use the calloutbanner component to display callout banners. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.8` | Update price breakdown to reflect price changes. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.9` | Don't display third party ads or promotions. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
| `5.8.10` | Exclude order tracking/status from your post purchase page. | `not applicable` | 当前源码不提供该类别能力：没有买家付款后的 upsell 扩展；商家端佣金/计划页不属于 post-purchase upsell。 | E01、E11 | 新增 post-purchase 能力后恢复适用。 |
### 5.9. Mobile app builders — 3 条

类别判定依据：未实现为商家构建消费者移动应用；Shopify mobile 的响应式界面不属于 mobile app builder。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.9.1` | Convert mobile app builders into sales channel. | `not applicable` | 当前源码不提供该类别能力：未实现为商家构建消费者移动应用；Shopify mobile 的响应式界面不属于 mobile app builder。 | E01、E11 | 新增移动 App 构建产品后按 Sales Channel 要求复核。 |
| `5.9.2` | Include submission info for the Apple App Store and Google Play. | `not applicable` | 当前源码不提供该类别能力：未实现为商家构建消费者移动应用；Shopify mobile 的响应式界面不属于 mobile app builder。 | E01、E11 | 新增移动 App 构建产品后按 Sales Channel 要求复核。 |
| `5.9.3` | Provide app theme customization or presets. | `not applicable` | 当前源码不提供该类别能力：未实现为商家构建消费者移动应用；Shopify mobile 的响应式界面不属于 mobile app builder。 | E01、E11 | 新增移动 App 构建产品后按 Sales Channel 要求复核。 |
### 5.10. Donation — 7 条

类别判定依据：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.10.1` | Give instruction on how to hide add-to-cart on donation products. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
| `5.10.2` | Provide merchants with proof of donation. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
| `5.10.3` | Indicate operating cost in UI and listing. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
| `5.10.4` | Verify charitable status or partnership. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
| `5.10.5` | Use a theme app block to add donation products. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
| `5.10.6` | Collect donation funds using PCI-compliant third party gateways or the Billing API. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
| `5.10.7` | Process customer’s donations through Shopify Checkout. | `not applicable` | 当前源码不提供该类别能力：未实现向买家收集捐赠、慈善分发或 donation products；App 佣金不是捐赠。 | E01、E11 | 新增 donation 功能后恢复适用并补慈善、成本和资金流证据。 |
### 5.11. Blockchain — 13 条

类别判定依据：未实现 NFT、fungible token、wallet、mint 或链上履约。 当前正式 Distribution 未读取；N/A 仅限此源码范围。

| ID | 官方要求 | 状态 | 源码结论与适用性 | 证据 | 还需完成的核验 |
|---|---|---|---|---|---|
| `5.11.1` | Don't sell, transfer, or modify fungible tokens unless they are a payment partner. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.2` | Provide an interface to review the state of each NFT order. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.3` | Write blockchain transaction ID by order fulfillment tracking_numbers. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.4` | Prevent merchants from listing NFTs until they are approved. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.5` | Provide an NFT claim message. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.6` | Allow creating and reviewing requests from embedded app. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.7` | Include only creator royalties, not secondary royalties. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.8` | NFTs must not qualify as a security or regulated financial instrument. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.9` | Support primary sales only. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.10` | Allow buyers to create a wallet after buying NFT. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.11` | Ensure no personal data is written or stored on-chain. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.12` | Don't allow parties to edit destination email. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |
| `5.11.13` | Enable Shopify to complete end-to-end test upon submission. | `not applicable` | 当前源码不提供该类别能力：未实现 NFT、fungible token、wallet、mint 或链上履约。 | E01、E11 | 新增 blockchain 能力后恢复适用并取得官方资格/端到端证据。 |

## 补充的官方合规前置

当前 173 条叶子清单之外仍有被上层政策继承的官方合同，不能因为没有独立叶子 ID 就省略：

- [Privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) 与 [webhook subscriptions](https://shopify.dev/docs/apps/build/webhooks/subscribe) 是 mandatory compliance topics 的官方依据。当前原型 TOML 注释三条 topics，缺 handler（E14）；“本仓实现缺口”已确认，真实生产订阅、签名校验、数据导出/删除履约保持 `unverified`。不能把隐私缺口错误挂到只描述 TLS 或某个 scope 的叶子 ID。
- App Store 3.2 的父级要求是只请求必要 scopes，不仅是五条特殊 scope。当前 TOML 的四项 scope 不能代表由环境 `SCOPES` 或生产 TOML 实际申请的集合（E01/E02）。仍需生产逐 scope 功能理由、optional scope 和受保护客户数据审查。
- 主报告的 BFS 4.3.3 首屏弹窗、4.2.4 错误色等是独立的 BFS 人工设计要求，不应为了凑 App Store fail 而误映射到 Max modal、TLS 或 Listing 条目。

## 完成条件

先修复 [findings.md](findings.md) 中适用的已确认问题，再以真实送审生产仓库和测试店补充安装/重装、GraphQL 数据同步、Shopify hosted approval、计费及 webhook/隐私证据。正式 Listing、Partner standing、类别与 Dashboard prerequisites 须逐行回填；当前不得宣称 App Store/BFS 全量通过或可提交。

## 本账本验证

- 官方原文 ID 与本文 ID 顺序完全相同：173 条、173 个唯一 ID，无遗漏/重复；状态为 50 个 unverified、123 个源码范围 not applicable。
- `node scripts/verify-app-store-requirements.mjs`：PASS，173/173；分区 20/17/6/24/106，SHA 与本文一致。
- `node scripts/verify-links.mjs`：PASS，86 个 Markdown 文件。
- `git diff --check`：PASS。
- 本次没有重跑应用 QA，没有安装、卸载、付款、部署或写入第三方服务。已有应用验证边界见 [verification.md](verification.md)。
