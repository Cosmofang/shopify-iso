# 审计覆盖范围与类别判定

> 文档版本：`1.0.0`
> 最后修改：`2026-09-16 08:46 UTC`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)，2026-09-16 核实。

本文件是 App-specific audit evidence。审计以 `dev@cccebcc9c7256a40d68cd6d7cd210761221bdf88` 为固定对象；审计结束前远端 dev 仍指向同一提交。

## 代码覆盖口径

`git ls-files -z` 和 `git ls-tree -r --name-only HEAD` 均确认 **2,800 个 tracked files**，包括隐藏目录。早期普通文件搜索得到的 2,725 未包含全部隐藏文件，不采用为最终分母。审计采用全仓清单/模式搜索、全仓 lint/build/typecheck、workspace 单元测试，加上高风险路径深读和定向合成复现。**不是逐行人工阅读全部 2,800 文件，也不是已执行每个生产状态。**

代码列按 ts/tsx/js/jsx/mjs/cjs/sql 扩展名统计（包括测试/迁移）；测试相关列按 tests/test/e2e 路径或 .test/.spec 后缀统计；这些是文件分类，不能相加作为互斥分组或测试执行条数。

| 模块 | tracked files | 代码/SQL文件 | 测试相关文件 | 本轮检查 |
|---|---:|---:|---:|---|
| 其他配置、文档、证据、脚本 | 379 | 15 | 20 | 全仓纳入文件清单与文本模式扫描；重点读取 Shopify TOML、Prisma/migrations、GDPR 文档、CPS 测试/脚本、官方约束。历史 evidence 未视作当前上线证据。 |
| apps/admin-dashboard | 368 | 359 | 158 | 运营端权限/内部接口、CPS 配置与查询、Cloudflare 管理、REST 使用；build/typecheck/unit。它不是商家 embedded UI。 |
| apps/headless-edge-worker | 17 | 13 | 4 | 签名 origin、缓存/降级、服务端流量日志、host 配置；build/typecheck/unit；生产 Cloudflare 未访问。 |
| apps/navos-adapter | 44 | 41 | 15 | HTTP 入口、凭据边界、速率限制、crawler 委派；build/typecheck/unit；独立 CrawStart 服务不在仓库。 |
| apps/shopify-app | 1507 | 1420 | 600 | 18 个商家/入口 UI 路由；收费、订单、鉴权、安装、主题、隐私、App Proxy、API、webhook、scheduler 重点追踪；全包 lint/typecheck/build/unit + CPS DB。 |
| apps/worker-diagnosis | 166 | 160 | 87 | GraphQL/API 版本、队列和诊断边界、共享流水线；build/typecheck/unit；外部 worker 完成态未实测。 |
| packages/diagnosis-core | 36 | 34 | 8 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/image-pipeline | 56 | 54 | 21 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/kafka | 13 | 11 | 3 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/logger | 38 | 36 | 18 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/queue | 29 | 27 | 13 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/scheduler-contracts | 24 | 21 | 8 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/scheduler-core | 51 | 48 | 16 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/search-ingest | 9 | 7 | 2 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |
| packages/shared | 63 | 57 | 27 | 共享包：全仓模式扫描、build/typecheck/unit；按业务调用涉及计价、队列、日志、图片、调度、搜索或数据合同追踪。 |

重点手工路径详见 [UI 路由矩阵](ui-findings.md)、[平台覆盖矩阵](platform-findings.md)、[收费覆盖](billing-findings.md)。跨仓库服务、生产密钥、真实客户数据、实际 Dev Dashboard、App Store listing 和认证 Shopify 浏览器未访问。没有对未知站点做探测，没有进行真实收费、部署或消息发送。

## 已选类别

| 来源 | 类别 | 判定依据 | 纳入台账 |
|---|---|---|---|
| App Store | 5.1 Online Store | SEO/theme 注入、App Proxy 和生成 storefront 页面 | 5.1.1–5.1.5，共5条；SEO例外/Shopify审批证据独立待核 |
| BFS | 5.3 Analytics | AI traffic、订单归因、店铺表现分析 | 5.3.1，共1条；服务端日志不等于必须注入浏览器Pixel |

## 其余类别的适用性排查

下表覆盖未纳入109条主台账的全部142条。`not applicable` 是对当前分支实际功能的判断；如果公开 listing、Dashboard 分发类别或实际商家功能与源码范围不同，须重新选择并逐条审计。尤其 Headless/外部分发若实际属于 marketplace/sales channel，应补开 App Store 5.7 全部18条，而不是仅用“SEO”名称排除。

| 官方来源 | 类别 | 覆盖的官方 IDs | 数量 | 状态 / 排除理由 |
|---|---|---|---:|---|
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.2 Payment | 5.2.1, 5.2.2, 5.2.3, 5.2.4, 5.2.5, 5.2.6, 5.2.7, 5.2.8, 5.2.9, 5.2.10, 5.2.11, 5.2.12, 5.2.13, 5.2.14, 5.2.15 | 15 | not applicable（当前代码范围）；没有支付网关/支付处理功能；App佣金不是gateway。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.3 Payment facilitator | 5.3.1, 5.3.2, 5.3.3 | 3 | not applicable（当前代码范围）；没有为付款网关展示关联品牌的payment facilitator功能。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.4 Purchase option | 5.4.1, 5.4.2, 5.4.3, 5.4.4, 5.4.5, 5.4.6, 5.4.7, 5.4.8, 5.4.9, 5.4.10, 5.4.11, 5.4.12, 5.4.13, 5.4.14, 5.4.15, 5.4.16, 5.4.17, 5.4.18, 5.4.19 | 19 | not applicable（当前代码范围）；没有面向买家的selling plans/subscription contracts；App自身收费不等同商品订阅。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.5 Product sourcing | 5.5.1, 5.5.2, 5.5.3, 5.5.4, 5.5.5 | 5 | not applicable（当前代码范围）；没有供货/采购/代履约产品功能。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.6 Checkout customization | 5.6.1, 5.6.2, 5.6.3, 5.6.4, 5.6.5, 5.6.6, 5.6.7, 5.6.8, 5.6.9 | 9 | not applicable（当前代码范围）；没有Checkout UI extension或checkout加费/营销控件。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.7 Sales channel | 5.7.1, 5.7.2, 5.7.3, 5.7.4, 5.7.5, 5.7.6, 5.7.7, 5.7.8, 5.7.9, 5.7.10, 5.7.11, 5.7.12, 5.7.13, 5.7.14, 5.7.15, 5.7.16, 5.7.17, 5.7.18 | 18 | not applicable（当前代码范围）；当前代码提供单店SEO/Headless页面，未发现聚合marketplace交易；真实分发类别仍待Dashboard确认。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.8 Post purchase | 5.8.1, 5.8.2, 5.8.3, 5.8.4, 5.8.5, 5.8.6, 5.8.7, 5.8.8, 5.8.9, 5.8.10 | 10 | not applicable（当前代码范围）；没有post-purchase upsell extension。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.9 Mobile app builders | 5.9.1, 5.9.2, 5.9.3 | 3 | not applicable（当前代码范围）；没有生成商家原生移动购物App的功能。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.10 Donation | 5.10.1, 5.10.2, 5.10.3, 5.10.4, 5.10.5, 5.10.6, 5.10.7 | 7 | not applicable（当前代码范围）；没有捐赠产品或募捐处理功能。 |
| [App Store](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) | 5.11 Blockchain | 5.11.1, 5.11.2, 5.11.3, 5.11.4, 5.11.5, 5.11.6, 5.11.7, 5.11.8, 5.11.9, 5.11.10, 5.11.11, 5.11.12, 5.11.13 | 13 | not applicable（当前代码范围）；没有NFT/token/blockchain订单功能。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.1 Ads | 5.1.1, 5.1.2 | 2 | not applicable（当前代码范围）；SEO/AI可见性不是广告campaign创建/管理；未发现投放功能。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.2 Affiliate program | 5.2.1 | 1 | not applicable（当前代码范围）；App按销售收佣不等于为商家管理influencer佣金计划。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.4 Carrier services | 5.4.1, 5.4.2 | 2 | not applicable（当前代码范围）；没有Carrier Service报价回调。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.5 Discount | 5.5.1, 5.5.2, 5.5.3, 5.5.4 | 4 | not applicable（当前代码范围）；没有商家买家折扣创建/管理功能；App免佣不是商品discount。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.6 Email marketing | 5.6.1, 5.6.2, 5.6.3, 5.6.4 | 4 | not applicable（当前代码范围）；支持/反馈邮件不等于商家定向email campaign。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.7 Forms | 5.7.1, 5.7.2, 5.7.3 | 3 | not applicable（当前代码范围）；商家反馈表单不是Online Store买家自定义表单产品。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.8 Fulfillment services | 5.8.1, 5.8.2, 5.8.3, 5.8.4, 5.8.5, 5.8.6, 5.8.7 | 7 | not applicable（当前代码范围）；没有以自有location代商家履约。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.9 Invoices and receipts | 5.9.1 | 1 | not applicable（当前代码范围）；佣金CSV/诊断PDF不是买家订单发票或packing slip产品。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.10 Product bundles | 5.10.1 | 1 | not applicable（当前代码范围）；没有商品组合销售/cartTransform。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.11 Product reviews | 5.11.1, 5.11.2 | 2 | not applicable（当前代码范围）；读取页面已公开评价作内容不是收集产品评价的review app；App索评另受4.3约束。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.12 Returns and exchanges | 5.12.1, 5.12.2, 5.12.3, 5.12.4 | 4 | not applicable（当前代码范围）；读取退款并冲回App佣金，不是为买家处理退换货服务。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.13 SMS marketing | 5.13.1, 5.13.2, 5.13.3, 5.13.4 | 4 | not applicable（当前代码范围）；没有定向SMS campaign功能。 |
| [BFS](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) | 5.14 Subscription | 5.14.1, 5.14.2, 5.14.3, 5.14.4, 5.14.5 | 5 | not applicable（当前代码范围）；没有买家周期性购买商品的订阅业务。 |

计数校验：App Store 174 = 主台账72 + 类别排查102；BFS 77 = 主台账37 + 类别排查40。该覆盖计数证明要求被纳入判断，不证明满足要求。
