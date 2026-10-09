# BFS / App Store 全量 requirement ledger

> 文档版本：`1.1.0`
> 最后修改：`2026-09-28 10:34 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 审计对象：`deeplumen-agents/deeplumen-AP`，`main@b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4`
> 证据类型：`App-specific audit evidence`；当前仓库是前端原型，生产配置、真实业务数据和 Dev Dashboard 未核实
> 官方核实日期：`2026-09-28`
> 本次官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [BFS Markdown](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
> 来源指纹：BFS `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93`；App Store `cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e`

当前官方 BFS **77 条叶子要求**在下表逐项记录，每个 ID 独占一行；官方设计部分还有 **63 条拒审理由**，它们是这些 requirement 的判据，不是另加 63 个 requirement。官方标题与链接均来自本次核验的当前源，链接 fragment 已与官方 HTML 的实际 ID 核对，不加数字编号前缀。

当前状态：**3 个 fail、37 个 unverified、37 个源码范围 not applicable，0 个 pass**。已确认的四项设计问题 F-01、F-02、F-06、F-08 对应三个不同 BFS ID（4.3.1、4.3.3、4.2.4）；发现数量与 requirement 数量不能混算。详细证据见 [findings.md](findings.md)。

- `fail` 只指固定提交中已核实可达的原型代码行为与官方冲突，不等于线上生产已发生。
- `unverified` 表示没有足以覆盖完整 requirement 的真实页面、生产、Dashboard 或人工证据。单个组件/脚本的窄证据不能升级为整项 pass。
- `not applicable` 只限当前固定源码不提供该类别/触发能力；每行明确原因。真实生产、listing 或 Distribution 若包含相应功能，恢复为 unverified。
- 政策截止日期不是自动倒计时；不可达组件、死 CSS 和未挂载动画不作为已确认问题。ReviewPrompt 的旧30天复现结论已撤回。
- 安全相关核查为用户自有仓库的授权防御性只读审计；未主动测试第三方系统、写生产数据或执行真实收费。

## 证据索引

| 编号 | 固定提交证据/证据记录 | 范围 |
|---|---|---|
| B01 | [仓库身份及原型边界](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/shopify.app.toml#L3) | TOML 明确本仓为前端原型、不部署，生产在另一仓库；本报告不能外推为线上已发生。 |
| B02 | [认证与安装边界](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/context.server.ts#L5) | mockContext 首先 authenticate.admin；正式安装/重装未核实。auth.login/route.tsx 保留带回退说明的 shop domain 表单。 |
| B03 | [App shell 与导航](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/root.tsx#L72) | App Bridge 在 Polaris 前加载；app.tsx:72-86 使用 s-app-nav；宿主真实加载和高亮未验收。 |
| B04 | [首页及可达性](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app._index.tsx#L244) | 首页有 onboarding、workflow、StatsCards 等；prototype/routes/app._index.ts 未提供 reviewPrompt，旧30天重复索评结论撤回。 |
| B05 | [表单静态支持](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/blog/BlogWizardForm.tsx#L632) | Blog dirty 状态会 show/hide Save Bar；所有表单和导航逃逸路径尚未完整实测。 |
| B06 | [业务后端为原型](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/prototype/routes/app.sync.ts#L12) | sync action 固定 completed；app.sync.tsx:263-278 用经过时间推进；app.plan pricingUrl 指向 prototype/approval，没有真实订阅创建。 |
| B07 | [CPS modal](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/dashboard/CpsAuthorizationPrompt.tsx#L101) | ControlledModal 在 ui.tsx:212 输出 s-modal heading；CPS 主按钮:167 使用 primary-action slot；Dashboard:119-120 在有 data.cpsPrompt 时初始打开。资格条件及复现见 F-01。 |
| B08 | [可达诊断错误](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/routes/app.pages.%24id.diagnosis.tsx#L265) | DiagnosisErrorState 标题/错误正文为黑/灰；prototype/pages.server.ts:101 将 preview=failed 映射到失败状态，route:395-408 呈现。博客 mocks/blog.loader.ts 的 blogsError 固定 false，不计确认可达失败。 |
| B09 | [结果文案与真实循环](https://github.com/deeplumen-agents/deeplumen-AP/blob/b39a0146c11df89e50fa753bf1b4d93d1ff7c6c4/deeplumen-app/app/components/plan/AiOrderGrowthPanel.tsx#L131) | AiOrderGrowthPanel:135-137 无条件每3200ms改变 activeStep；Plan:245 起实际挂载。CPS、Traffic FAQ、Plan 可达结果文案见 F-02。旧 hero 死 CSS/未挂载动画不作为 F-08。 |
| B10 | [类别功能检索](app-store-ledger.md) | App Store 账本 E11 记录当前固定源码 app/routes、extensions 和 API/功能检索；extensions 仅 .gitkeep。类别排除限源码，不冒充生产/Distribution 分类证明。 |
| B11 | [已有自动检查](verification.md) | 复用已有 main 检查；静态 QA 通过只证明脚本覆盖范围。lint、qa:cps 是工程阻断；production baseline 是需更新边界的诊断，不直接等同 BFS 失败。 |
| B12 | [外部状态](https://dev.shopify.com/dashboard) | 本轮未读取正确生产 App 的 Distribution、Partner standing、listing、滚动性能指标或真实业务配置。该链接是后续核验入口，不是已经读取的证据。 |

## BFS 77 条逐项状态


### 1. Prerequisites — 5 条

| ID | 官方要求 | 状态 | 适用性/判断边界 | 证据 | 工作项/尚缺验收 |
|---|---|---|---|---|---|
| `1.1.1` | [Meet App Store requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#meet-app-store-requirements) | `unverified` | App Store 前置适用 | [App Store 173 条账本](app-store-ledger.md)：50 项待验证、123 项仅源码范围不适用；B01/B12。 | 补正式 listing、安装/重装、计费、数据合规及所有适用类别证据。 |
| `1.1.2` | [Have a good Partner standing](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#have-a-good-partner-standing) | `unverified` | Partner 账号前置适用 | B12：未读取账号状态、active/outstanding infractions 和历史 enforcement。 | 由 Partner/Distribution 证明良好状态；源码与文档完整性不能替代。 |
| `1.2.1` | [Have a minimum number of installs](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#have-a-minimum-number-of-installs) | `unverified` | 商家效用前置适用 | B12：未取得 active paid shops 的净安装数。 | Dev Dashboard 核实至少 50 净安装及店铺条件。 |
| `1.2.2` | [Have a minimum number of reviews](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#have-a-minimum-number-of-reviews) | `unverified` | 商家效用前置适用 | B12：未读取正式 App Store 的当前评价数。 | 核实至少 5 条评价及对应应用身份。 |
| `1.2.3` | [Have a minimum app rating](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#have-a-minimum-app-rating) | `unverified` | 商家效用前置适用 | B12：没有 Distribution 当前 recent rating 门槛/达标状态。 | 取得当前官方评估，不编造固定评分阈值。 |

### 2. Performance — 5 条

| ID | 官方要求 | 状态 | 适用性/判断边界 | 证据 | 工作项/尚缺验收 |
|---|---|---|---|---|---|
| `2.1.1` | [Minimize Largest Contentful Paint (LCP)](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#minimize-largest-contentful-paint-lcp) | `unverified` | App Home 性能适用 | B03/B12：有 App Bridge 脚本，缺生产 28 天 LCP 分布和采样数。 | 至少 100 次近 28 天 LCP 采样，p75 ≤2.5s；以 Dashboard 为证。 |
| `2.1.2` | [Minimize Cumulative Layout Shift (CLS)](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#minimize-cumulative-layout-shift-cls) | `unverified` | App Home 性能适用 | B03/B12：防闪烁 CSS 与 build 不能证明 CLS 达标。 | 至少 100 次近 28 天 CLS 采样，p75 ≤0.1。 |
| `2.1.3` | [Minimize Interaction to Next Paint (INP)](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#minimize-interaction-to-next-paint-inp) | `unverified` | App Home 性能适用 | B03/B12：没有真实用户 INP 分布和采样量。 | 至少 100 次近 28 天 INP 采样，p75 ≤200ms。 |
| `2.2.1` | [Minimize the impact on store speed](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#minimize-the-impact-on-store-speed) | `unverified` | 声明有店面能力，需生产检查 | B01/B06：本仓只提供 mock storefront，没有真实上线前后 Lighthouse。 | 同一真实店面条件核验性能分降幅不超过 10 分。 |
| `2.3.1` | [Minimize the impact on checkout speed](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#minimize-the-impact-on-checkout-speed) | `unverified` | 当前无 carrier 回调；生产适用性待确认 | B10/B12：未见 carrier service，未读取生产能力与 Distribution 的该项状态。 | 先确认是否适用；若适用，补 28 天≥1000请求、p95≤500ms、失败率≤0.1%。 |

### 3. Integration — 7 条

| ID | 官方要求 | 状态 | 适用性/判断边界 | 证据 | 工作项/尚缺验收 |
|---|---|---|---|---|---|
| `3.1.1` | [Embed the app in the Shopify admin](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#embed-the-app-in-the-shopify-admin) | `unverified` | 嵌入式 App 适用 | B02/B03：TOML embedded=true；authenticate.admin 与根文档 App Bridge 有代码支持。 | 真实 Admin、每份 document、ID token、无外站镜像逐项验证。 |
| `3.1.2` | [Keep primary app workflows within Shopify](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#keep-primary-app-workflows-within-shopify) | `unverified` | 主要商家流程适用 | B03/B06：核心页面在 /app；计费和店面后端为模拟。 | 真实 Admin 内完成全部主流程；任何外部流程记录官方例外依据。 |
| `3.1.3` | [Enable seamless sign up based on Shopify credentials](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#enable-seamless-sign-up-based-on-shopify-credentials) | `unverified` | 安装后使用流程适用 | B02：模板认证支持；auth/login 仍有带 fallback 说明的店铺域名表单。 | 证明新装无需额外注册/登录，回退页面不成为必经安装步骤。 |
| `3.1.4` | [Include simplified monitoring or reporting](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#include-simplified-monitoring-or-reporting) | `unverified` | 首页报告适用 | B04：首页有指标/状态模块，但来源为原型数据。 | 核验真实有用指标、时间窗与数据来源；外部复杂报告有内嵌简版。 |
| `3.1.5` | [Keep third-party connection settings within Shopify](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#keep-third-party-connection-settings-within-shopify) | `unverified` | 生产第三方连接范围待确认 | B01/B10/B12：原型没有完整可验证的第三方 connect/disconnect 流程。 | 列实际第三方集成，逐个验证 Admin 内可连接/断开；确无此功能再明确 N/A。 |
| `3.2.1` | [Provide a clean uninstallation process](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#provide-a-clean-uninstallation-process) | `unverified` | 声明有店面页面/SEO 功能 | B01/B10：无 Theme App Extension 实现；生产配置在另一仓库，不能直接判线上失败。 | 核验真正店面集成、extensions、卸载清除和残留。 |
| `3.2.2` | [Doesn't use the Asset API to create, modify, or delete files](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#doesnt-use-the-asset-api-to-create-modify-or-delete-files) | `unverified` | 主题/API 使用需要核实 | B01/B10：当前未发现 Asset API 写入；SEO 定位不自动证明所有写入获准。 | 审计真实生产主题操作、用途、最小权限及适用官方例外。 |

### 4. Design — 19 条

| ID | 官方要求 | 状态 | 适用性/判断边界 | 证据 | 工作项/尚缺验收 |
|---|---|---|---|---|---|
| `4.1.1` | [Follow UX best practices](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#follow-ux-best-practices) | `unverified` | 所有商家页面适用 | B11：qa:bfs 的颜色、焦点、token、圆角、命中区检查通过，仅为窄静态证据。 | 在真实 embedded Admin 逐页验 11 条拒审条件、布局、交互和无闪烁。 |
| `4.1.2` | [Mobile-friendly](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#mobile-friendly) | `unverified` | Shopify 手机 App 适用 | B11：responsive 类与静态检查不能证明真实手机使用。 | 真机与窄视口完成核心流程，无整页横滚、内容不可达或挤压。 |
| `4.1.3` | [Concise app name](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#concise-app-name) | `unverified` | App 名称在 Admin 显示适用 | B01/B12：本地 TOML 名称不等于正式 Dashboard/pinned 显示。 | 取得桌面 pinned 状态，验证名称没有省略截断。 |
| `4.1.4` | [Use the nav menu](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-the-nav-menu) | `unverified` | 多页面导航适用 | B03：s-app-nav 与 rel=home 有实现；未验证宿主导航渲染、高亮和完整层级。 | 真实 Admin 核查父项高亮、无独立重复 Home、无 emoji 和错链。 |
| `4.1.5` | [Use the contextual save bar](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-the-contextual-save-bar) | `unverified` | 合理的编辑/保存表单适用 | B05：BlogWizardForm:632-636 调 saveBar；其他编辑器及所有离开路径未完整验证。 | 遍历 dirty→Save/Discard→导航/tab/返回，禁止未处理的离开。 |
| `4.1.6` | [Use modals appropriately](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-modals-appropriately) | `unverified` | modal/全屏流程适用 | B07：仅确认 CPS 的 s-modal heading 与 primary-action slot 静态用法；不覆盖全 App modal。 | 列全量 modal/overlay，检查标题/actions slots、无废弃 Fullscreen bar、运行焦点/关闭；首屏触发另见 4.3.3。 |
| `4.2.1` | [Spelling, grammar and phrasing](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#spelling-grammar-and-phrasing) | `unverified` | 全产品可见文案适用 | B04/B06：有英文 UI；局部代码审读不等于全状态语言校对。 | 按 headings/nav/CTA/空态/错误/单位逐项审校。 |
| `4.2.2` | [Helpful onboarding](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#helpful-onboarding) | `unverified` | 初次设置和续做适用 | B04/B06：有 onboarding 与移除入口；sync 为 mock completion/经过时间进度。 | 真实新装、续做、完成、可移除、信息请求理由及六条拒审条件验收。 |
| `4.2.3` | [Helpful homepage](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#helpful-homepage) | `unverified` | 首页适用 | B04：存在指标和工作流；真实动态数据、扩展激活状态和全部 dismiss 后内容未验证。 | 验证当前 extension 状态、真正有用指标及 dismiss 后仍有动态价值。 |
| `4.2.4` | [Helpful error messages](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#helpful-error-messages) | `fail` | 可达诊断失败态适用 | [F-06](findings.md)；B08：DiagnosisErrorState:265-267 错误文字为黑/灰；pages.server.ts:101 可给 preview=failed。 | 使用红色错误语义，保留持久信息和 Retry；博客 blogsError 固定 false 的分支仅作联调风险，不算已复现。 |
| `4.2.5` | [Guide merchants to logical actions](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#guide-merchants-to-logical-actions) | `unverified` | 相关动作组适用 | B05/B07：部分 primary action 静态可见，未全产品验证语境中最合理动作。 | 逐个动作组核验主次权重及下一步合理性。 |
| `4.2.6` | [Visible previews](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#visible-previews) | `unverified` | 可视化定制流程是否适用需逐项确认 | B06：有页面/图片预览，但预览存在不证明所有可视化定制可实时同屏预览。 | 先列真正视觉编辑器；桌面控件与预览同屏、实时变化逐项检查。 |
| `4.3.1` | [Don't make false claims](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-make-false-claims) | `fail` | CPS/AI Traffic/Plan 可达文案适用 | [F-02](findings.md)；B07/B09：可达说明/FAQ/Plan 标题强烈暗示订单、推荐或增长结果。EXAMPLE 标识已存在。 | 移除结果保证/因果最高级；已发生结果需逐店、时间窗、归因证据；条件零态文案另行联调。 |
| `4.3.2` | [Don't pressure merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-pressure-merchants) | `unverified` | 收费/升级及索评等文案适用 | B07：Choose a plan before <date> 是静态政策截止日期，不自动等于可见倒计时；未证实羞辱文案或五星奖励。 | 核对真实 grace policy 与全部可达 CTA/索评；无证据不得列确认压力问题。 |
| `4.3.3` | [Don't distract merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-distract-merchants) | `fail` | 加载触发 modal 与 Plan 循环动效适用 | [F-01 / F-08](findings.md)；B07：符合资格时首屏 autoShow；B09：AiOrderGrowthPanel:135 每3200ms切换步骤，无商家动作。 | modal 改主动打开；营销流程改静态或用户控制。旧 hero 死 CSS/未挂载动画不列为已确认问题。 |
| `4.3.4` | [Don't overwhelm merchants](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-overwhelm-merchants) | `unverified` | 表单/文本/提示密度适用 | B04/B05：组件存在分组，但未穷举可同时出现的 banner 与最长文案状态。 | 真实状态组合核验大表单分组、相邻多 banner、可扫读文本。 |
| `4.3.5` | [Don't impersonate Shopify](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-impersonate-shopify) | `unverified` | 品牌与 AI 功能外观适用 | B01/B09/B12：当前未确认冒充 Shopify；没有完整正式 icon/listing/所有 AI 视觉的人工比对。 | 核对官方 App 图标、Sidekick 与 magic purple 混淆风险。 |
| `4.3.6` | [Dismissible ads](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dismissible-ads) | `unverified` | 可达广告/促销内容适用 | B04：当前 loader 未提供 reviewPrompt；ReviewPromptCard 30天注释不能证明可达重复展示，旧 review finding 撤回。 | 列真正可达促销，逐项验可关闭及跨会话持久化；真实生产索评行为另核。 |
| `4.3.7` | [Label and disable premium features](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#label-and-disable-premium-features) | `unverified` | CPS 及所有计划/Plus 限制适用 | B06/B11：状态与控制有原型实现；模拟 plan-active/approval 不能证明实际计费授权。 | 真实各计划/非Plus下逐控件验视觉/功能一致、required tier 清楚和 Plus 隐藏。 |

### 5. Category-specific — 41 条

| ID | 官方要求 | 状态 | 适用性/判断边界 | 证据 | 工作项/尚缺验收 |
|---|---|---|---|---|---|
| `5.1.1` | [Use web pixels for ads apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-web-pixels-for-ads-apps) | `unverified` | Ads 类别及归因功能范围待确认 | B10/B12：未读正式分类；源码有流量/归因分析但无广告 campaign 管理证据或 Web Pixel。 | 按真实功能确认类别；若命中，对采集事件核验 Web Pixel，禁用 script tag/手贴JS替代。 |
| `5.1.2` | [Use Shopify segments for ads apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-shopify-segments-for-ads-apps) | `unverified` | Ads 类别及多客户 targeting 待确认 | B10/B12：没有正式 targeting/segment 功能证据或 customer segment action extension。 | 若实际支持多客户 targeting，验证任意 Shopify segment 和 extension。 |
| `5.2.1` | [Use web pixels for affiliate program apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-web-pixels-for-affiliate-program-apps) | `unverified` | Affiliate program 类别待确认 | B06/B10/B12：App CPS 佣金本身不等于 influencer affiliate program；实际类别未读取。 | 确认是否管理影响者推广佣金体系；若命中核验需要的 Web Pixel 事件。 |
| `5.3.1` | [Use web pixels for analytics apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-web-pixels-for-analytics-apps) | `unverified` | Analytics 按实际流量/归因洞察需评估 | B04/B10：AI Traffic/订单表现 UI 可达，extensions 无 Web Pixel 实现；原型无真实数据采集链。 | 取得真实数据来源/事件/采集方式，判断所需 Web Pixel 与适用范围；不能由原型缺失直接判生产违规。 |
| `5.4.1` | [Respond quickly to rate requests](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#respond-quickly-to-rate-requests) | `not applicable` | 未发现提供买家实时运价的 carrier service/callback。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产提供此能力，补28天请求量、延迟与成功率。 |
| `5.4.2` | [Complete rate requests reliably](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#complete-rate-requests-reliably) | `not applicable` | 未发现提供买家实时运价的 carrier service/callback。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产提供此能力，补28天请求量、延迟与成功率。 |
| `5.5.1` | [Use discount primitives](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-discount-primitives) | `not applicable` | 未实现买家价格折扣配置；App 佣金免收名额不属于商品 discount。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增商品折扣后恢复适用，逐项核对 Functions/API、draft order、redeem code 和嵌入链接。 |
| `5.5.2` | [Don't use draft orders with custom discounts](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#dont-use-draft-orders-with-custom-discounts) | `not applicable` | 未实现买家价格折扣配置；App 佣金免收名额不属于商品 discount。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增商品折扣后恢复适用，逐项核对 Functions/API、draft order、redeem code 和嵌入链接。 |
| `5.5.3` | [Use a single redeem code per discount](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-a-single-redeem-code-per-discount) | `not applicable` | 未实现买家价格折扣配置；App 佣金免收名额不属于商品 discount。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增商品折扣后恢复适用，逐项核对 Functions/API、draft order、redeem code 和嵌入链接。 |
| `5.5.4` | [Create high quality links](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#create-high-quality-links) | `not applicable` | 未实现买家价格折扣配置；App 佣金免收名额不属于商品 discount。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增商品折扣后恢复适用，逐项核对 Functions/API、draft order、redeem code 和嵌入链接。 |
| `5.6.1` | [Use web pixels for email marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-web-pixels-for-email-marketing-apps) | `not applicable` | 未实现面向客户的定向 email campaign；支持邮件回复不属于 email marketing app。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 email marketing 后恢复适用，核 Web Pixel、双向客户数据、segments 与 visitors。 |
| `5.6.2` | [Sync customer data for email marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#sync-customer-data-for-email-marketing-apps) | `not applicable` | 未实现面向客户的定向 email campaign；支持邮件回复不属于 email marketing app。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 email marketing 后恢复适用，核 Web Pixel、双向客户数据、segments 与 visitors。 |
| `5.6.3` | [Use Shopify segments for email marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-shopify-segments-for-email-marketing-apps) | `not applicable` | 未实现面向客户的定向 email campaign；支持邮件回复不属于 email marketing app。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 email marketing 后恢复适用，核 Web Pixel、双向客户数据、segments 与 visitors。 |
| `5.6.4` | [Help merchants to identify visitors to their store for email marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#help-merchants-to-identify-visitors-to-their-store-for-email-marketing-apps) | `not applicable` | 未实现面向客户的定向 email campaign；支持邮件回复不属于 email marketing app。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 email marketing 后恢复适用，核 Web Pixel、双向客户数据、segments 与 visitors。 |
| `5.7.1` | [Use Shopify segments for forms apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-shopify-segments-for-forms-apps) | `not applicable` | 未实现店面买家自定义表单；商家支持反馈表单不属于该类别。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家表单后恢复适用，核 segments、visitors 与客户数据同步。 |
| `5.7.2` | [Help merchants to identify visitors to their store for forms apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#help-merchants-to-identify-visitors-to-their-store-for-forms-apps) | `not applicable` | 未实现店面买家自定义表单；商家支持反馈表单不属于该类别。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家表单后恢复适用，核 segments、visitors 与客户数据同步。 |
| `5.7.3` | [Sync customer data for forms apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#sync-customer-data-for-forms-apps) | `not applicable` | 未实现店面买家自定义表单；商家支持反馈表单不属于该类别。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家表单后恢复适用，核 segments、visitors 与客户数据同步。 |
| `5.8.1` | [Actively fulfill orders](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#actively-fulfill-orders) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.8.2` | [Complete fulfillment orders](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#complete-fulfillment-orders) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.8.3` | [Respond to callback requests](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#respond-to-callback-requests) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.8.4` | [Wait for merchant requests](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#wait-for-merchant-requests) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.8.5` | [Add tracking information](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#add-tracking-information) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.8.6` | [Respond to fulfillment requests](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#respond-to-fulfillment-requests) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.8.7` | [Respond to cancellation requests](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#respond-to-cancellation-requests) | `not applicable` | 未实现使用自有 location 替商家备货和发运的 fulfillment service。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产有该服务，逐项取得真实履约状态、callback、请求、追踪和28天指标。 |
| `5.9.1` | [Enable printing on orders pages](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#enable-printing-on-orders-pages) | `not applicable` | 诊断 PDF/CSV 导出不是订单 invoice/packing slip 生成产品。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增订单发票/装箱单后核详情页和订单列表批量 print action。 |
| `5.10.1` | [Use bundles primitives](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-bundles-primitives) | `not applicable` | 未实现将多个商品作为一个单位出售的 bundle/cartTransform。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 bundles 后核对应官方 primitives 及有依据的例外。 |
| `5.11.1` | [Provide a flow trigger](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#provide-a-flow-trigger) | `not applicable` | 未实现收集商品评价的产品；请求商家评价 App 不是 product reviews app。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增商品评价后核新评价 Flow trigger 和 customer detail block。 |
| `5.11.2` | [Use block extensions](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-block-extensions) | `not applicable` | 未实现收集商品评价的产品；请求商家评价 App 不是 product reviews app。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增商品评价后核新评价 Flow trigger 和 customer detail block。 |
| `5.12.1` | [Sync returns information](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#sync-returns-information) | `not applicable` | 佣金账本读取退款/调整，不替买家管理商品退换货；无 returns 执行或买家自助门户。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产管理退换货，恢复适用并核生命周期、交换行、费用及认证。 |
| `5.12.2` | [Include exchange line items](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#include-exchange-line-items) | `not applicable` | 佣金账本读取退款/调整，不替买家管理商品退换货；无 returns 执行或买家自助门户。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产管理退换货，恢复适用并核生命周期、交换行、费用及认证。 |
| `5.12.3` | [Include shipping and restocking fees](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#include-shipping-and-restocking-fees) | `not applicable` | 佣金账本读取退款/调整，不替买家管理商品退换货；无 returns 执行或买家自助门户。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产管理退换货，恢复适用并核生命周期、交换行、费用及认证。 |
| `5.12.4` | [Use the Customer Account API for customer authentication](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#returns-use-customer-account-api) | `not applicable` | 佣金账本读取退款/调整，不替买家管理商品退换货；无 returns 执行或买家自助门户。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 若生产管理退换货，恢复适用并核生命周期、交换行、费用及认证。 |
| `5.13.1` | [Use web pixels for SMS marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-web-pixels-for-sms-marketing-apps) | `not applicable` | 未实现面向买家的定向 SMS campaign。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 SMS marketing 后核 Web Pixel、双向客户数据、segments 和 visitors。 |
| `5.13.2` | [Sync customer data for SMS marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#sync-customer-data-for-sms-marketing-apps) | `not applicable` | 未实现面向买家的定向 SMS campaign。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 SMS marketing 后核 Web Pixel、双向客户数据、segments 和 visitors。 |
| `5.13.3` | [Use Shopify segments for SMS marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-shopify-segments-for-sms-marketing-apps) | `not applicable` | 未实现面向买家的定向 SMS campaign。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 SMS marketing 后核 Web Pixel、双向客户数据、segments 和 visitors。 |
| `5.13.4` | [Help merchants to identify visitors to their store for SMS marketing apps](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#help-merchants-to-identify-visitors-to-their-store-for-sms-marketing-apps) | `not applicable` | 未实现面向买家的定向 SMS campaign。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增 SMS marketing 后核 Web Pixel、双向客户数据、segments 和 visitors。 |
| `5.14.1` | [Use subscription objects and APIs](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-subscription-objects-and-apis) | `not applicable` | App 的 CPS/计费计划不是买家商品周期订阅；无 selling plan、contract 或买家订阅管理。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家订阅后恢复适用，逐项核 APIs、主题块、UX 和客户账户管理。 |
| `5.14.2` | [Use theme app block extensions](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-theme-app-block-extensions) | `not applicable` | App 的 CPS/计费计划不是买家商品周期订阅；无 selling plan、contract 或买家订阅管理。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家订阅后恢复适用，逐项核 APIs、主题块、UX 和客户账户管理。 |
| `5.14.3` | [Follow subscriptions UX guidelines](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#follow-subscriptions-ux-guidelines) | `not applicable` | App 的 CPS/计费计划不是买家商品周期订阅；无 selling plan、contract 或买家订阅管理。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家订阅后恢复适用，逐项核 APIs、主题块、UX 和客户账户管理。 |
| `5.14.4` | [Use Customer Account UI extensions](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#use-customer-account-ui-extensions) | `not applicable` | App 的 CPS/计费计划不是买家商品周期订阅；无 selling plan、contract 或买家订阅管理。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家订阅后恢复适用，逐项核 APIs、主题块、UX 和客户账户管理。 |
| `5.14.5` | [Use the Customer Account API for customer authentication](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#subscriptions-use-customer-account-api) | `not applicable` | App 的 CPS/计费计划不是买家商品周期订阅；无 selling plan、contract 或买家订阅管理。 | B10：固定提交路由、扩展和能力检索；只限当前源码范围，生产分类未核实。 | 新增买家订阅后恢复适用，逐项核 APIs、主题块、UX 和客户账户管理。 |

## App Store 173 条前置层

BFS [1.1.1 Meet App Store requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#meet-app-store-requirements) 要求持续满足 App Store 前置。当前 App Store 是 **173 条**，分区 **20 / 17 / 6 / 24 / 106**；此前174条中的 App Store 5.8.4 已不在当前源中。不要与仍然存在的 BFS 5.8.4 混淆。

完整逐项状态、官方标题、适用原因、代码证据和剩余验收见 [App Store 173 条账本](app-store-ledger.md)：**50 项 unverified、123 项仅当前源码范围 not applicable、0 项 pass**。这里不再用分区汇总替代逐项审计。原型缺 compliance 配置、缺真实业务后端和模拟计费不直接证明另一个生产 App 违规；生产材料未取得前保持待核实。

## 本轮修订与后续验证

本次只修改两份审计账本。4.1.6 从单组件静态 pass 改为 unverified；4.3.2 不将真实政策日期列为已确认压力问题；4.3.6 撤回不可达 ReviewPrompt 的重复展示推断；4.2.4 保留可达 DiagnosisErrorState 作为主证据，博客固定 false 分支降为联调风险；4.3.3 同时记录 F-01 自动 modal 与 F-08 真实3200ms循环，排除旧 hero 死代码。

文档结构检查：77个唯一 BFS ID 与本次官方 Markdown 的顺序/标题一致；所有77个官方 fragment 在本次官方 HTML中存在。已有应用检查记录见 [verification.md](verification.md)，本次不重复应用 QA。主 Agent 统一执行 source fingerprints、链接与 diff 校验，并记录最终提交状态。

当前有已确认 fail，且生产/Distribution/安装计费等证据缺失，结论仍为 **not ready**。这表示本次审计尚未完成合规验收，不能解释为真实生产 App 已被 Shopify 拒绝。
