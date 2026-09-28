# BFS / App Store 全量 requirement ledger

> 文档版本：`1.0.0`
> 最后修改：`2026-09-28 10:05 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [BFS Markdown](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
> ISO source verification：BFS `77/77` leaf + `63/63` design rejection reasons；App Store `174/174` leaf；核验日期 `2026-09-28`

本表是 App-specific audit evidence。`fail` 是当前 checkout 可直接复现的冲突；`review` 是需要产品/Shopify 人工分类；`unverified` 是没有真实生产、Dashboard、listing 或运行时证据。没有把任何“静态检查通过”写成 BFS 通过。

## BFS 77 条

### 1. Prerequisites — 5 条

| IDs | 状态 | 证据/缺口 |
|---|---|---|
| `1.1.1`, `1.1.2`, `1.2.1`, `1.2.2`, `1.2.3` | `unverified` | App Store 前置、Partner standing、净安装、评价和评分必须由真实 Partner/Dev Dashboard 证明；源码不能替代。 |

### 2. Performance — 5 条

| IDs | 状态 | 证据/缺口 |
|---|---|---|
| `2.1.1`, `2.1.2`, `2.1.3`, `2.2.1`, `2.3.1` | `unverified` | 没有生产 Web Vitals、Storefront Lighthouse、Checkout 28 天请求量/p95/失败率证据。build 通过不等于性能达标。 |

### 3. Integration — 7 条

| IDs | 状态 | 证据/缺口 |
|---|---|---|
| `3.1.1`, `3.1.2`, `3.1.3`, `3.1.4`, `3.1.5` | `unverified` | 原型静态使用 Shopify SDK/App Bridge，但真实安装、embedded 流程、第三方连接和 Dashboard 分发未验证。 |
| `3.2.1` | `unverified` | 当前 checkout 无 active Theme App Extension；生产主题写入/卸载清理在另一个仓库未知。 |
| `3.2.2` | `unverified` | 当前 checkout 未发现 active Asset API 写入；SEO 例外、生产实现及审批状态仍需真实生产证据。 |

### 4. Design — 19 条逐项

| ID | 状态 | 证据 |
|---|---|---|
| `4.1.1` | `unverified` | `qa:bfs` 的颜色、焦点、token、圆角和命中区检查通过；仍需 embedded Admin 真实页面验收。 |
| `4.1.2` | `unverified` | 静态 responsive 类和 `qa:bfs` 通过；真实 Shopify 手机 App/多宽度交互未验证。 |
| `4.1.3` | `unverified` | App 名 pinned 后是否截断需 Dev Dashboard/真实 Admin 证据。 |
| `4.1.4` | `unverified` | App nav 的真实宿主渲染和子页面高亮未验证。 |
| `4.1.5` | `unverified` | 部分表单使用 Save Bar；完整 dirty/离开/恢复流程未在真实宿主走通。 |
| `4.1.6` | `pass (narrow static)` | `CpsAuthorizationPrompt` 使用 `s-modal`、heading 和 action slot；这不覆盖首屏自动打开问题 F-01。 |
| `4.2.1` | `unverified` | 本地文本检查不等于全产品语言审校。 |
| `4.2.2` | `unverified` | onboarding 入口存在；完成态、续做、真实新装路径未验证。 |
| `4.2.3` | `unverified` | 首页有指标/状态模块；真实数据、dismiss 后价值和扩展状态未验证。 |
| `4.2.4` | `fail` | 真实 `blogsError` 在 `BlogListSection.tsx:564-568`、`BlogWizardForm.tsx:871-874` 用 amber；DiagnosisErrorState 的错误说明在 `app.pages.$id.diagnosis.tsx:259-268` 用灰色；见 F-06。 |
| `4.2.5` | `unverified` | 静态按钮层级存在；完整动作上下文未逐页验收。 |
| `4.2.6` | `unverified` | 预览页面存在；真实商家定制流程未验收。 |
| `4.3.1` | `fail` | CPS、AI order/traffic 文案承诺或强暗示结果；见 F-02。 |
| `4.3.2` | `review` | `Choose a plan before <date>` 可能形成压力，但不是倒计时；需审核真实 grace policy。 |
| `4.3.3` | `fail` | `data.cpsPrompt` 驱动首屏 `autoShow` modal；见 F-01。 |
| `4.3.4` | `unverified` | 有单 banner 设计意图；真实页面密度和文案长度未全量实测。 |
| `4.3.5` | `unverified` | 未发现明确 Shopify impersonation；图标、颜色和 listing 仍需真实审查。 |
| `4.3.6` | `review` | review prompt 关闭后 30 天静默，可能再次出现；见 F-07。 |
| `4.3.7` | `unverified` | 套餐锁定逻辑有源码/QA，但真实 pricing 状态和所有 premium controls 未验证。 |

### 5. Category-specific — 41 条

| ID 集合 | 状态 | 适用性/证据 |
|---|---|---|
| `5.1.1`, `5.1.2` | `unverified` | 未确认是否属于 ads app；若 listing/功能命中，必须补 Web Pixel/Segments 证据。 |
| `5.2.1` | `unverified` | Affiliate 分类及 Web Pixel 适用性未由 Dashboard 确认。 |
| `5.3.1` | `unverified` | AI traffic/订单表现可能命中 analytics；当前仅有源码数据路径，未证明 Web Pixel 或官方豁免适用。 |
| `5.4.1`, `5.4.2` | `not applicable (当前源码范围)` | 未发现 carrier rate callback；若公开功能改变，重新判定。 |
| `5.5.1`–`5.5.4` | `not applicable (当前源码范围)` | 未发现买家 discount 创建/管理功能。 |
| `5.6.1`–`5.6.4` | `not applicable (当前源码范围)` | 未发现 email marketing campaign 功能。 |
| `5.7.1`–`5.7.3` | `not applicable (当前源码范围)` | 未发现买家 forms 产品功能。 |
| `5.8.1`–`5.8.7` | `not applicable (当前源码范围)` | 未发现 fulfillment service。 |
| `5.9.1` | `not applicable (当前源码范围)` | 诊断 PDF/CSV 不是 Orders 页面发票打印功能。 |
| `5.10.1` | `not applicable (当前源码范围)` | 未发现 product bundles/cartTransform。 |
| `5.11.1`, `5.11.2` | `not applicable (当前源码范围)` | App 请求评价不等于 product reviews app。 |
| `5.12.1`–`5.12.4` | `not applicable (当前源码范围)` | App 佣金退款读取不等于买家退换货服务。 |
| `5.13.1`–`5.13.4` | `not applicable (当前源码范围)` | 未发现 SMS marketing campaign。 |
| `5.14.1`–`5.14.5` | `not applicable (当前源码范围)` | 未发现面向买家的商品订阅。 |

这些 `not applicable` 只针对固定 commit 的公开源码范围；如果 Dev Dashboard 分类、listing 或生产仓库声明了相应功能，必须恢复为 `unverified` 并重新逐项审计。

## App Store 174 条前置层

| 分区 | 数量 | 本次状态 | 说明 |
|---|---:|---|---|
| Policy | 20 | `unverified`；隐私配置见 F-03 | 代码是原型，listing、Partner standing、真实 billing、评论策略和生产合规未验证。 |
| Functionality | 17 | `unverified`；工程错误见 F-04/F-05 | typecheck/build/QA 不能替代安装、重装、同步和生产接口验证。 |
| Security | 6 | `unverified`；当前 checkout 的 compliance 配置存在 gap | scopes、TLS、Dev Dashboard、签名投递和数据履约需生产证据。 |
| App Store Listing | 24 | `unverified` | 未访问 listing、Pricing details、截图、视频、语言、测试账号和 emergency contact。 |
| Category-specific | 107 | `unverified / conditional` | 需按真实 App Store 分类取并集；本 checkout 的原型声明不能替代生产分类。 |

App Store 174 条的官方数量、分区计数和来源 SHA 已由 ISO verifier 逐条核对；本表将缺少 App/Dev Dashboard/生产证据的条目保持为 `unverified`，不把“文档有记录”当作“应用满足”。
