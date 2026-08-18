# 品类专属技术要求（BFS 5）

> 官方真相源：[Built for Shopify requirements — Category-specific](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#category-specific)
> 核准日期：**2026-08-18**。若 App 属于某一类别，必须满足该类别的**全部适用要求**；带未来生效日或功能条件的条款按官方 Changelog 判断。

## 先判定类别

- 以 App 的真实功能与 Dev Dashboard → Distribution 显示的类别为准，不能只看营销名称。
- 一个 App 可能同时触发多个类别，需取全部适用要求的并集。
- “SEO App”不是当前单独列出的 BFS 类别；但提供店铺表现洞察时可能属于 **Analytics**，提供广告或营销能力时还可能触发其他类别。
- 每次新增功能都要重新判断类别，不能只在首次提交时判断一次。

Deeplumen 当前最先核对：

| 功能 | 可能触发 | 要求 |
|---|---|---|
| 流量、转化、AI 可见性等数据洞察 | 5.3 Analytics | 适用事件采集必须使用 Web Pixel extension |
| 广告归因、受众、retargeting | 5.1 Ads | Web Pixel + Shopify segments + customer segment action extension |
| 邮件或短信营销 | 5.6 / 5.13 | Web Pixel、客户同步、segments、visitors API（按功能适用） |
| 修改主题以实现 SEO | BFS 3.2.2 | 读取可用；写主题文件只在官方例外范围内，优先 Theme App Extension |

## 5.1 Ads apps

适用：创建或管理数字广告活动、归因、受众、细分、retargeting 等。

- **5.1.1 Web pixels**：广告归因、受众、细分、analytics、pixel、retargeting 或 lookalike targeting 需要事件时，必须使用 [Web Pixel extensions](https://shopify.dev/docs/apps/build/marketing/build-web-pixels)。不得用 script tag，也不得要求商家复制 JavaScript 到店铺。
- **5.1.2 Shopify segments**：广告或其他批量客户定向必须支持 Shopify Admin 中定义的任意 segment，并通过 [customer segment action extension](https://shopify.dev/docs/apps/build/marketing/customer-segments/build-an-action-extension) 暴露动作。

## 5.2 Affiliate program apps

适用：让商家建立由 influencer 按佣金推广商品的 affiliate program。

- **5.2.1 Web pixels**：必须使用 Web Pixel extensions 订阅所需事件；不得用 script tag 或要求商家手贴 JavaScript。

## 5.3 Analytics apps

适用：向商家提供店铺表现的数据洞察。

- **5.3.1 Web pixels**：需要 storefront 事件时必须使用 Web Pixel extensions；不得用 script tag 或要求商家手贴 JavaScript。

> SEO/AI visibility 产品若只读取 Admin API 数据，不应为了“看起来合规”虚构 Web Pixel；但只要通过 storefront 事件做分析，就必须使用 Web Pixel extension。

## 5.4 Carrier services apps

适用：连接 carrier service，为买家提供实时运费。Shopify 评估前要求最近 28 天至少 1000 次请求。

- **5.4.1 响应速度**：最近 28 天内，95% 的 rate endpoint 请求响应时间 **< 500ms**。
- **5.4.2 可靠性**：最近 28 天内，请求成功率 **>= 99.9%**。

## 5.5 Discount apps

适用：让商家定义和配置价格折扣。

- **5.5.1 使用 discount primitives**：自定义折扣使用 [Discount Functions](https://shopify.dev/docs/apps/build/discounts#build-with-shopify-functions)，普通折扣使用原生 GraphQL discount APIs。
- **5.5.2 不用 draft order 做自定义折扣**：不得通过自动创建带 custom discount 的 draft order 实现面向客户的折扣。
- **5.5.3 多兑换码归属同一折扣**：多个 redeem codes 使用 `discountRedeemCodeBulkAdd`，不能创建一组数值相同但 code 不同的独立折扣。
- **5.5.4 高质量链接**：Discounts 页 Create discount 按钮进入 App 后，必须落到能创建对应折扣的内嵌页面，并遵循 App Design Guidelines。

## 5.6 Email marketing apps

适用：通过定向邮件活动与客户沟通。

- **5.6.1 Web pixels**：提供 automation、segmentation、analytics 或 pixels 时，使用 Web Pixel extensions；不得用 script tag 或手贴 JavaScript。
- **5.6.2 客户数据同步**：按 Shopify API License 要求，将所需 customer information 与 Shopify 双向同步。
- **5.6.3 Shopify segments**：支持 Admin 中任意 segment，并提供 customer segment action extension。
- **5.6.4 Visitors API**：客户在 Online Store 提供邮箱或电话等身份信息时，用 visitors API 记录。

## 5.7 Forms apps

适用：让商家建立收集客户个人信息、偏好或咨询的自定义表单。

- **5.7.1 Shopify segments**：支持任意 Shopify segment，并提供 customer segment action extension。
- **5.7.2 Visitors API**：客户在 Online Store 提供身份信息时，用 visitors API 记录。
- **5.7.3 客户数据同步**：按 Shopify API License 要求，将所需 customer information 与 Shopify 双向同步。

## 5.8 Fulfillment services apps

适用：使用 App 自有 location，代表商家备货和发货。

- **5.8.1 活跃度**：最近 28 天完成或处理的 fulfillment orders **>= 100**。
- **5.8.2 完成率**：最近 28 天分配给 App 的 fulfillment orders 完成率 **>= 97%**；最近 7 天新建订单不计。官方列出的未完成状态包括 `open/submitted` 及相关 `in_progress` 状态。
- **5.8.3 Callback**：成功响应 Shopify callback requests 的比例 **>= 99%**。
- **5.8.4 等待商家请求**：只能在 merchant requests fulfillment 后履约。
- **5.8.5 Tracking**：App 创建的 fulfillments 中，**80%** 要在创建后 **1 小时内**添加 tracking information。
- **5.8.6 Fulfillment request**：**95%** 的请求在 **24 小时内**接受或拒绝。
- **5.8.7 Cancellation request**：**99%** 的取消请求在 **24 小时内**接受或拒绝。

## 5.9 Invoices and receipts apps

适用：生成 invoice 或 packing slip。

- **5.9.1 Orders 页面打印**：必须使用 admin print action extension，让商家能从单个 order detail 页面打印，也能在 orders index 对选中订单批量打印。

## 5.10 Product bundles apps

适用：把多个产品组合为一个销售单元。

- **5.10.1 Bundles primitives**：static bundles 使用 GraphQL Admin API；customized bundles 使用 `cartTransform` function。只有 Shopify primitives 尚不支持的场景（如不支持的 sales channel、bundle subscription、编辑订单增删 bundle）才使用其他方式，并记录例外依据。

## 5.11 Product reviews apps

适用：收集产品评价。

- **5.11.1 Flow trigger**：每当收集到新评价时，提供可启动 workflow 的 Flow trigger。
- **5.11.2 Admin block**：在 customer detail 页面提供 admin block，让商家查看该客户提交的评价。

## 5.12 Returns and exchanges apps

适用：管理退货、换货和退款。

- **5.12.1 同步退货生命周期**：通过对应 API 向 Shopify 同步创建退货、创建 reverse delivery、restock、移除 return item、取消、关闭和退款等全部事件。
- **5.12.2 Exchange line items**：换货时在订单中创建 exchange line items；不再需要时删除。
- **5.12.3 费用**：适用时把 shipping fee 和 restocking fee 写入订单。
- **5.12.4 客户认证**：自 **2026-12-01** 起，提供买家自助退换货体验时，Customer Account API 必须是客户认证的主要方式。截止日前作为未来生效项跟踪；没有 buyer-facing self-service 时记录具体排除理由。

## 5.13 SMS marketing apps

适用：通过定向短信活动与客户沟通。

- **5.13.1 Web pixels**：提供 automation、segmentation、analytics 或 pixels 时使用 Web Pixel extensions；不得用 script tag 或手贴 JavaScript。
- **5.13.2 客户数据同步**：按 Shopify API License 要求双向同步所需 customer information。
- **5.13.3 Shopify segments**：支持任意 Shopify segment，并提供 customer segment action extension。
- **5.13.4 Visitors API**：客户在 Online Store 提供身份信息时，用 visitors API 记录。

## 5.14 Subscription apps

适用：让客户按周期购买产品。

- **5.14.1 Subscription APIs**：必须使用 Selling plan API、Subscription contract API 和 Customer payment method API。
- **5.14.2 Theme app block**：产品详情页的订阅能力必须使用兼容 Online Store 2.0 的 theme app block。
- **5.14.3 Subscription UX**：产品、购物车和订单详情清楚展示 selling plan 名称、价格和节省金额；订阅选项默认匹配当前主题的颜色、字体、字号和字重。
- **5.14.4 Customer Account UI extensions**：客户通过该扩展查看和管理订阅。
- **5.14.5 客户认证**：自 **2026-12-01** 起，提供买家自助订阅管理体验时，Customer Account API 必须是客户认证的主要方式。截止日前作为未来生效项跟踪；没有 buyer-facing self-service 时记录具体排除理由。

## 提交证据清单

- [ ] Dev Dashboard 中的 App 类别已确认，且与真实功能一致。
- [ ] 所有适用类别及其全部编号已列出；不适用项有理由。
- [ ] 扩展、API、同步任务和指标有代码位置或 Dashboard 证据。
- [ ] Web Pixel 场景无 script tag，也不要求商家手贴 JavaScript。
- [ ] 新增功能后重新完成类别判断。

总编号映射见 [../00-built-for-shopify/official-requirements-matrix.md](../00-built-for-shopify/official-requirements-matrix.md)。
