# Built for Shopify requirements —— 官方全文快照

> **外部真相源**
> HTML：<https://shopify.dev/docs/apps/launch/built-for-shopify/requirements>
> Markdown：<https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md>
> Changelog：<https://shopify.dev/changelog?filter=built_for_shopify>
> 概览与其他成就：<https://shopify.dev/docs/apps/launch/built-for-shopify#other-achievements>
>
> **本地快照日期**：2026-07-30
> **规模指纹**：**77 条叶子要求**（§1 = 5 · §2 = 5 · §3 = 7 · §4 = 19 · §5 = 41）；§4 共 **63 条拒审理由**（4.1 = 23 · 4.2 = 20 · 4.3 = 20）。
>
> 本文件是**官方原文的完整落地**：每条保留官方英文要求文本与拒审理由（官方公开的具体审核判据），并附中文要点。
> 它**不是完成证明**——是否适用、是否通过、以及自动评估结果，一律以 Partner Dashboard → **Distribution** 页为准。

## 本文件在 ISO 库中的位置

| 文件 | 分工 |
|---|---|
| **本文件** `official-requirements-full.md` | 官方 77 条全文 + 63 条拒审理由，快照式、可引用、可做指纹比对 |
| [`official-requirements-matrix.md`](official-requirements-matrix.md) | 编号 → ISO 落点 → 证据的路由矩阵 |
| [`requirements-ledger.md`](requirements-ledger.md) | App Store + BFS 逐项适用性、工作项、证据与状态的实时账本模板 |
| [`status-lifecycle.md`](status-lifecycle.md) | BFS 申请、持续监控、失效、自动恢复与权益边界 |
| [`requirements.md`](requirements.md) | §4 Design 的中文 pass/fail 判据展开 |
| [`app-store-requirements.md`](app-store-requirements.md) | §1.1.1 依赖的 App Store 前置要求 |
| [`linked-official-sources.md`](linked-official-sources.md) | BFS 正文内 59 个 shopify.dev 链接的审读台账 |
| [`pre-submission-checklist.md`](pre-submission-checklist.md) · [`local-self-test.md`](local-self-test.md) | 提交前清单与本地自测步骤 |
| [`wcag-contrast.md`](wcag-contrast.md) | 4.1.1 第 10 条拒审理由的对比度判据 |

重新校验（需网络）：

```bash
node scripts/verify-bfs-requirements.mjs      # 核对官方指纹，并逐条比对本文件的 77 条正文与 63 条拒审理由
node scripts/audit-bfs-linked-sources.mjs     # 逐个进入正文链接，报标题/最终 URL/行数
```

## 已知的官方链接问题（快照时）

| 位置 | 官方页写的 | 实际状态 |
|---|---|---|
| 4.1.4 | `…/app-bridge-web-components/s-app-nav` | **404**。当前替代页：[App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)。要求文本本身仍以 `s-app-nav` 为组件名，照写不算错 |

## 阅读纪律

1. **requirements 的句子决定"必须做什么"；链接页决定"当前怎样实现"和"有哪些例外"。**
2. 目标页比入口页宽松时，**以 BFS 更严格条件为准**。
3. 链接跳到归档页面时，只用于理解禁止/迁移背景，不作为新项目技术基线。
4. API reference 只在 App 命中对应类别时进入实现；**不为"看起来合规"接入无关 API**。
5. 官方链接失效或内容变更时，记录原 URL、当前 URL、影响条款、ISO 修改和验证日期。

---

# 1. Prerequisites 前置条件

部分前置项自动评估，部分需人工核验。完整拆解见 [Partner Dashboard](https://www.shopify.com/partners) 的 **Distribution** 页。

## 1.1 General

### 1.1.1 Meet App Store requirements

> The app needs to continue to meet the [requirements for distributing apps on the Shopify App Store](https://shopify.dev/docs/apps/launch/app-requirements-checklist).
>
> Your app will be audited for these requirements when you apply for Built for Shopify status.

**中文要点**：必须**持续**满足 App Store 分发要求；申请 BFS 时会就此审计。
**证据**：通用条款 + 所有适用类别条款；Distribution 审计结果。

### 1.1.2 Have a good Partner standing

> The app needs to comply with the [Partner Program Agreement](https://www.shopify.com/partners/terms) and [Shopify API License and Terms of Use](https://www.shopify.com/legal/api-terms). Your Partner Account must have no active or outstanding infractions. Resolving an outstanding infraction is the first step in getting your account back into Good Partner standing, however, even after resolving issues, previous violations can still temporarily impact your BFS status depending on their severity and frequency. Read more about [Enforcement of Shopify's Partner Program Policies](https://help.shopify.com/en/partners/faq/removal).

**中文要点**：Partner 账号**无 active / outstanding 违规**。注意：**已解决**的历史违规仍可能按严重度与频次**暂时**影响 BFS 状态——解决只是恢复的第一步，不等于立即恢复。

## 1.2 Merchant utility

### 1.2.1 Have a minimum number of installs

> Your app must have a minimum of 50 net installs from active shops on paid plans.

**中文要点**：**≥ 50 净安装**，且来自**付费方案的活跃店铺**。

### 1.2.2 Have a minimum number of reviews

> Your app must have a minimum of five reviews.

**中文要点**：App Store **≥ 5 条评价**。

### 1.2.3 Have a minimum app rating

> Your app must meet a minimum recent app rating threshold in the Shopify App Store.

**中文要点**：**近期评分**达到门槛（具体阈值以 Distribution 页显示为准，官方未公开固定数值）。

---

# 2. Performance 性能

> [Optimizing your app for performance](https://shopify.dev/docs/apps/build/performance) directly influences conversion rates, repeat business, and search engine rankings.

## 2.1 Admin performance

> Shopify uses [Web Vitals](https://web.dev/articles/vitals) to determine the performance of your app in the Shopify admin. To enable Shopify to gather Web Vitals metrics, your app needs to use the [latest version of App Bridge](https://shopify.dev/docs/api/app-bridge-library#getting-started).
>
> When your app loads in the Shopify admin, it needs to meet Web Vitals targets for the following metrics, at the **75th percentile** of page loads.

**前提条件（易被忽略）**：不接**最新版 App Bridge**，Shopify 采不到 Web Vitals，§2.1 全部无法评估。
参考：[在 Admin 中测量性能](https://shopify.dev/docs/apps/build/performance/admin-installation-oauth#improve-your-apps-loading-performance)

### 2.1.1 Minimize Largest Contentful Paint (LCP)

> Your app's [Largest Contentful Paint (LCP)](https://shopify.dev/docs/apps/build/performance/admin-installation-oauth#largest-contentful-paint) is 2.5 seconds or less. Your app needs to have a minimum of 100 calls for LCP over the last 28 days to be assessed.

**判据**：p75 **≤ 2.5s**；近 28 天 **≥ 100 次**采样才评估。

### 2.1.2 Minimize Cumulative Layout Shift (CLS)

> Your app's [Cumulative Layout Shift (CLS)](https://shopify.dev/docs/apps/build/performance/admin-installation-oauth#cumulative-layout-shift) is 0.1 or less. Your app needs to have a minimum of 100 calls for CLS over the last 28 days to be assessed.

**判据**：p75 **≤ 0.1**；近 28 天 **≥ 100 次**采样。

### 2.1.3 Minimize Interaction to Next Paint (INP)

> Your app's [Interaction to Next Paint (INP)](https://shopify.dev/docs/apps/build/performance/admin-installation-oauth#interaction-to-next-paint) is 200 milliseconds or less. Your app needs to have a minimum of 100 calls for INP over the last 28 days to be assessed.

**判据**：p75 **≤ 200ms**；近 28 天 **≥ 100 次**采样。

## 2.2 Storefront performance

### 2.2.1 Minimize the impact on store speed

> Your app must not reduce the storefront Lighthouse performance score by more than ten points.

**判据**：店面 Lighthouse 性能分**降幅 ≤ 10 分**。

## 2.3 Checkout performance

### 2.3.1 Minimize the impact on checkout speed

> You need to [optimize how your app fetches and stores carrier rates](https://shopify.dev/docs/apps/build/performance/checkout) to minimize impact on checkout speed.
>
> For Shopify to assess your impact on checkout speed, your app must make a minimum of 1000 requests over the last 28 days.
>
> Your requests must have a p95 value of 500ms or less, with a 0.1% failure rate.

**判据**：近 28 天 **≥ 1000 次**请求才评估；**p95 ≤ 500ms**；**失败率 ≤ 0.1%**。

---

# 3. Integration 集成

> Design your app so that all of its primary functionality is available within the Shopify admin. [Integrating your app into the Shopify admin](https://shopify.dev/docs/apps/build/integrating-with-shopify) makes it feel familiar, gives you access to Shopify UI elements, and lets users use it easily on mobile devices.

## 3.1 Embedded apps

### 3.1.1 Embed the app in the Shopify admin

> Apps should be embedded in the Shopify admin using the latest version of [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge) by adding the `app-bridge.js` script tag to the `<head>` of **every document** of your app. Use [session token authentication](https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens) to further optimize the merchant's experience.
>
> Embedding your app in the Shopify admin makes your app feel familiar, gives you access to Shopify UI elements, and lets merchants use your app more easily on mobile devices.
>
> Apps should not embed external web pages. For example, an app named Puzzlify should not have an embedded [app home](https://shopify.dev/docs/apps/build/admin#app-home) that looks identical to the puzzlify.com website.

**中文要点**：每个 document 的 `<head>` 都要加 `app-bridge.js`（最新版）；用 session token 认证；**禁止把外站页面塞进内嵌壳**（内嵌首页不能长得跟官网一模一样）。

### 3.1.2 Keep primary app workflows within Shopify

> By default, apps should be embedded in the Shopify admin with the latest version of [App Bridge](https://shopify.dev/docs/api/app-bridge). Merchants should be able to complete primary app workflows inside the Shopify admin. Merchants shouldn't need to access an external website or external surface to complete a primary workflow.
>
> [Exceptions](https://shopify.dev/docs/apps/build/integrating-with-shopify#exceptions) apply on apps that need a standalone site to provide more complex features in a user-friendly way. An example is messaging apps, where users need to continuously monitor their conversation inbox, while accessing other areas of the Shopify admin.

**中文要点**：主流程必须能在 Admin 内**走完**。例外须有正当依据（如消息类 App 需要常驻收件箱）。

### 3.1.3 Enable seamless sign up based on Shopify credentials

> Apps should make sign up seamless for merchants, without requiring an additional login or sign-up prompt. Users should be able to start using the app immediately after installing it, without having to complete another sign up.
>
> [Exceptions](https://shopify.dev/docs/apps/build/integrating-with-shopify#exceptions) apply on apps that can't be easily accessed by merchants in a self-service manner and require a more complex sign-up, which often involves a business-to-business contract.
>
> In these cases, the app's onboarding in the Shopify admin must first ask merchants to connect their store to their existing credentials. If your app offers both self-service and business-to-business sign up, then the onboarding must include an option to sign up for the service using the merchant's existing Shopify credentials.

**中文要点**：装完即用，**不得二次注册/二次登录**。B2B 例外：onboarding 必须**先**提供"连接已有账号"；若同时支持自助注册，必须提供用 Shopify 凭据注册的选项。

### 3.1.4 Include simplified monitoring or reporting

> Expose key metrics that are helpful for merchants on the app's home page. If your app includes monitoring or complex reports that can only exist on an external website or app surface, then you must include a simplified version of the monitoring or reporting in the Shopify admin.

**中文要点**：首页要有对商家有用的**关键指标**；复杂报表可留在外部，但 Admin 内**必须有简化版**。
**关联**：与 [4.2.3 Helpful homepage](#423-helpful-homepage) 互为印证。

### 3.1.5 Keep third-party connection settings within Shopify

> Any settings or configurations that control the connection between Shopify and a third-party system must be available inside the Shopify embedded app interface.
>
> For instance, when merchants link a social media account, they should have the ability to connect and disconnect it through the Shopify admin at any time.

**中文要点**：第三方连接的设置必须在内嵌页内可**连接与断开**，随时可操作。

## 3.2 Installation and asset management

### 3.2.1 Provide a clean uninstallation process

> If your app is meant to be used in a merchant's online store, then you need to use [theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) to build the elements to be included in the theme.
>
> Theme app extensions allow apps to integrate with themes seamlessly, without injecting code into the theme. When merchants uninstall apps, blocks that are associated with the apps are automatically and entirely removed from online store themes.

**中文要点**：要在店面呈现内容，**必须用 theme app extension**，不得注入代码。卸载时 block 随之自动完全移除。

### 3.2.2 Doesn't use the Asset API to create, modify, or delete files

> Your app shouldn't add, remove, or edit a merchant's theme files. There are three exceptions to this rule:
>
> * Your app is a page builder app that adds or replaces all layouts or templates files with the purpose of providing an alternative theme customization experience.
> * Your app backs up all theme files, and restores files from a backup.
> * Your app primarily provides **search engine optimization**, content locking, or developer tooling functionality. You can still use the [Asset API](https://shopify.dev/docs/apps/build/online-store/asset-legacy) to **read** theme files.
>
> Your app will be audited for Asset API usage when you apply for Built for Shopify status.

**中文要点**：不得增删改主题文件。对**写入/删除**只有三条例外：① 页面构建器（整体替换 layout/template）；② 主题备份还原；③ **主要提供 SEO / 内容锁定 / 开发者工具**功能。Asset API 的**读取**不属于增删改，任何 App 仍可读取主题文件，但要坚持最小权限并接受申请时的 API 使用审计。
申请 BFS 时会**审计 Asset API 使用**。

---

# 4. Design 设计

> The design of your app should not result in merchants feeling **confused, stressed, or misled**. Instead, your app should be designed to feel **familiar**, **helpful**, and **user-friendly**.

§4 是唯一逐条给出"拒审理由（reasons for rejection）"的章节，**共 63 条**。这些理由是官方公开的具体失败判据，下面全部照录；它们不能替代要求正文、链接实现文档、适用性判断或 Distribution 当前结果。

## 4.1 Familiar 熟悉

> Your app generally looks and behaves like the Shopify admin. It offers merchants a predictable and familiar experience. Your app should leverage Shopify [App Bridge](https://shopify.dev/docs/api/app-bridge) where appropriate.

### 4.1.1 Follow UX best practices

> Your app's UI should mimic Shopify's core look and feel to ensure merchants experience a consistent and familiar environment.

> 官方示意图：<https://shopify.dev/assets/follow-ux-best-practices-D78J6zaC.png>（标注了 admin 按钮样式、一致间距、内容置于 card 内）

**拒审理由（11 条）**

1. UI is generally buggy and/or unpolished. For example, content flickers, repeatedly loads in/out, or causes other content on the page to excessively shift around.
2. The majority of content does not reside in card-like containers where the container looks similar to the Shopify admin cards.
3. Button styles do not match the Shopify admin. For example, primary buttons are a completely different color than Polaris, such as green or purple.
4. A serif or script font is used for the majority of content.
5. Body text size is significantly different from the text size used throughout the Shopify admin.
6. An app's background color is significantly different from the Shopify admin. For example, an app has a black background.
7. Interacting with tabs in a tab group modifies content above the tabs.
8. In a group or list, some items feature icons while others do not.
9. An app's layout spacing is significantly different from the spacing used throughout the Shopify admin.
10. An app's text does not meet basic [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=141#contrast-minimum) contrast requirements.
11. A sub-page of an app does not offer a back button to the parent page.

**中文要点**：11 条覆盖面远超"按钮色 + 对比度"。逐条自查项：闪烁/重复加载/布局抖动 · 内容是否在类 Admin card 容器内 · 主按钮色（禁绿/紫）· 衬线或手写体 · 正文字号 · 背景色（禁黑底）· **tab 组切换不得改动 tab 上方内容** · 列表图标有无一致 · 间距 · 正文对比度 ≥ **4.5:1**（详见 [wcag-contrast.md](wcag-contrast.md)）· **子页须有返回父页入口**（面包屑可满足）。

### 4.1.2 Mobile-friendly

> Design your app to be responsive and adapt to different screen sizes and devices.

> 官方示意图：<https://shopify.dev/assets/mobile-friendly-DFPK0app.png>

**拒审理由（3 条）**

1. On a mobile device, an entire page requires horizontal scrolling.
2. On a mobile device, some content is entirely inaccessible. For example, content is collapsed with no mechanism to expand, or content does not wrap and has no mechanism to scroll horizontally to reveal the obscured portions.
3. On a mobile device, some content appears unreasonably condensed. For example, a two column layout on a desktop device, remains as a two-column layout on a mobile device rather than the two columns stacking.

**中文要点**：**整页横滚**、内容完全不可达（折叠无展开机制 / 不换行又不能横滚）、桌面双列在移动端不塌陷——三者皆拒。注意 #2 允许"局部**可**横滚"作为补救，禁的是整页横滚（#1）与无任何机制（#2）。

### 4.1.3 Concise app name

> App names in the admin should not truncate in the Shopify navigation menu.

> 官方示意图：<https://shopify.dev/assets/concise-app-name-C_i0SFrx.png>

**拒审理由（1 条）**

1. On a desktop device, when pinned (i.e. the pin icon is no longer visible), the app name is truncated with ellipsis in the Shopify navigation menu.

**中文要点**：判定场景是**桌面 + pinned 状态**（图钉图标已消失），此时导航里 App 名**不得出现省略号**。

### 4.1.4 Use the nav menu

> Use the App Bridge [s-app-nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/s-app-nav) to integrate your app's primary navigation into the Shopify admin navigation menu.

> 官方示意图：<https://shopify.dev/assets/use-the-nav-menu-D1KA7ZAG.png>
> ⚠️ 官方该链接快照时 **404**；当前页为 [App nav](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-nav)。

**拒审理由（4 条）**

1. An app has its own navigation menu instead of using the Shopify admin navigation menu.
2. Navigating to a sub-page fails to highlight the relevant parent navigation item. For example, navigating to the "Puzzles" sub-page of the "Templates" navigation item does not highlight the "Templates" navigation item.
3. An app has a separate navigation item in addition to the app name that redirects to the app's homepage. Instead, the app name should point at the app's homepage. This is controlled in the Partner Dashboard, under **Configuration > URLs > App URL**.
4. An app renders emojis within the Shopify admin navigation menu.

**中文要点**：用 `s-app-nav`，不自建导航 · 子页要**高亮父项** · **不得有独立 Home 项**（App 名本身即首页入口，在 Partner Dashboard 的 Configuration > URLs > App URL 配置）· 导航内**禁 emoji**。

### 4.1.5 Use the contextual save bar

> Form inputs should generally be saved using the App Bridge [Contextual Save Bar](https://shopify.dev/docs/api/app-home/apis/save-bar) (CSB).

> 官方示意图：<https://shopify.dev/assets/use-the-contextual-save-bar-DXlvVEh-.png>

**拒审理由（2 条）**

1. A form does not integrate with the CSB when it would be reasonable to do so. For example, an editor to customize a theme announcement bar has its own save button, but fails to integrate with the CSB.
2. When the CSB is present, a merchant is able to navigate away from the corresponding form without first being forced to interact with the CSB's "Save" or "Discard" buttons.

**中文要点**：合理表单都要接 CSB（自带 Save 按钮而不接 CSB 即拒）；CSB 存在时**任何离开路径**都必须先经过 Save / Discard——包括路由跳转、页内 tab 切换、导航点击。

### 4.1.6 Use modals appropriately

> In a [s-modal](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal), use the [heading](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal#properties-propertydetail-heading) attribute to display the modal's title and the [primary-action](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal#slots-propertydetail-primaryaction) and [secondary-actions](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal#slots-propertydetail-secondaryactions) slots to display the modal's call-to-action buttons.

> 官方示意图：<https://shopify.dev/assets/use-modals-appropriately-DMWFta4B.png>

**拒审理由（2 条）**

1. In a [s-modal](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal), the primary and/or secondary modal action buttons appear somewhere other than within the component [slots](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal#slots).
2. A modal uses the deprecated [Polaris Fullscreen bar component](https://polaris-react.shopify.com/components/deprecated/fullscreen-bar) instead of the [s-app-window](https://shopify.dev/docs/api/app-home/app-bridge-web-components/app-window) and [s-page](https://shopify.dev/docs/api/app-home/app-bridge-web-components/title-bar) components.

**中文要点**：#1 仅在使用 `s-modal` 时适用：标题和 action 必须放在官方属性/slots 中。#2 独立适用于任何 modal/全屏流程：不得使用废弃的 Polaris Fullscreen bar，应改用当前 `s-app-window` + `s-page`。要求正文没有规定所有 overlay 都必须改成 `s-modal`；自建 overlay 仍需按一致性、可访问性和其他适用条款单独评估。

## 4.2 Helpful 有用

> Your app generally works well and is easy to use. The steps required to set up and implement your app's core workflow should be clear and easy to follow. The process should be free of errors and bugs. If error messages are necessary, they should be clear and the method to rectify any errors should be obvious.

### 4.2.1 Spelling, grammar and phrasing

> Apps must use clear and easy to understand language, proper grammar, and proper spelling throughout.

> 官方示意图：<https://shopify.dev/assets/spelling-grammar-and-phrasing-DGZ-u5T_.png>（Polaris grammar and mechanics 页）

**拒审理由（2 条）**

1. One or more prominent spelling or grammatical errors (even if the meaning can still easily be inferred), where "prominent" refers to copy within headings, navigation items or calls to action (e.g. button labels).
2. Phrases, headings, labels or calls to action that are difficult to understand and/or lack sufficient context. For example, a text input with the label "Time" with no explanation of what unit of time is expected.

**中文要点**：#1 的"prominent"有明确定义 = **标题 / 导航项 / CTA（按钮文案）**；**即使能猜出意思也拒**。#2 要求**单位与上下文完整**（"Time" 不说单位即拒）。

### 4.2.2 Helpful onboarding

> Apps should have a concise onboarding experience that helps merchants establish the app's core functionality.

> 官方示意图：<https://shopify.dev/assets/helpful-onboarding-DuM6rdf2.png>

**拒审理由（6 条）**

1. An app's onboarding does not sufficiently guide merchants to completion.
2. An app's onboarding is not concise.
3. An app's onboarding is difficult to locate, for example, onboarding is collapsed or appears out of view.
4. It is implied or strongly suggested that installing an additional app is a required onboarding step. For example, a setup guide that features a primary button to install another app.
5. An app asks for merchant information without providing clear justification. For example, asking "What types of products do you sell" without any supporting copy, such as, "We'll use this information to automatically recommend appropriate templates".
6. After onboarding has been completed, there is no mechanism to remove UI related to onboarding.

**中文要点**：引导到**完成** · **简洁** · **易发现**（折叠或在视野外即拒）· **不得暗示装另一个 App 是必需步骤**（尤其别把它做成主按钮）· 索取商家信息必须给**理由文案** · 完成后**必须能移除引导 UI**。
参考实现：[Setup guide 组合模式](https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide) · [Onboarding 设计指南](https://shopify.dev/docs/apps/design/user-experience/onboarding)

### 4.2.3 Helpful homepage

> Your homepage should clearly indicate if the app is set up and working, and, if possible, indicate how well the app is performing.

> 官方示意图：<https://shopify.dev/assets/helpful-homepage-C17tOxEv.png>

**拒审理由（3 条）**

1. An app has an app block and/or app embed to be activated in a theme but fails to communicate the corresponding status(es) on the app's homepage using [app.extensions()](https://shopify.dev/docs/api/app-home/apis/app#extensions).
2. An app fails to include any metrics or analytics on the homepage when there are obvious metrics that would be helpful to merchants. For example, an email marketing app fails to display metrics related to open rates, engagement rates and/or recent campaigns.
3. After dismissing any and all dismissible elements, an app's homepage only contains static content. For example, a homepage only displays links to other parts of the app or a static welcome message.

**中文要点**：#1 **仅在有 app block / app embed 时适用**，且指定用 `app.extensions()` 报告激活状态 · #2 有明显有用指标却不展示即拒 · #3 判定方法是**把所有可关闭元素都关掉**，剩下的不能只是静态链接或欢迎语——这条决定了首页必须有**真实动态内容**。

### 4.2.4 Helpful error messages

> Errors should be **red**, guide merchants to solutions, and appear **next to relevant fields** when possible.

> 官方示意图：<https://shopify.dev/assets/helpful-error-messages-CUIiPai4.png>

**拒审理由（5 条）**

1. An error message automatically disappears from view after a set amount of time has elapsed. For example, an error message is displayed in a toast, which automatically disappears after 5 seconds.
2. An error message appears in a color other than red.
3. A field is highlighted in red but does not have a corresponding error message.
4. A contextual error is not displayed contextually. For example, a "Must be a valid email address" error is displayed at the top of the page rather than directly below the relevant form field.
5. One or more form fields display an error prior to any merchant interaction.

**中文要点**：错误**必须持久**（任何定时自动消失都拒，官方举例 5 秒 toast）· 错误**必须是红色** · 红框**必须配文案** · 就近显示 · **交互前不得报错**。
⚠️ 与 [4.3.3 #4](#433-dont-distract-merchants) 是**配对约束**：非错误场景去红，但错误场景**必须留红**——单向改色容易改出新违规。

### 4.2.5 Guide merchants to logical actions

> When presenting a group of related actions, the most logical action should appear visually dominant.

> 官方示意图：<https://shopify.dev/assets/guide-merchants-to-logical-actions-DNZ1xhUP.png>

**拒审理由（2 条）**

1. In a button group with related actions, all buttons are presented with the same visual treatment. For example, a button group contains two secondary buttons labelled "Save changes" and "Leave without saving".
2. In a button group, the most visually prominent button doesn't represent the most logical next action. For example, in a button group with "Save changes" and "Leave without saving", the "Leave without saving" button is more visually prominent.

**中文要点**：同组按钮**不得同权重**（两个都是次按钮也拒）；且**最强的那个必须是最合理动作**——主次搞反同样拒。

### 4.2.6 Visible previews

> If an app allows merchants to customize something visual, merchants must be able to see their changes in real-time.

> 官方示意图：<https://shopify.dev/assets/visible-previews-BgtuhK7A.png>

**拒审理由（2 条）**

1. An app allows merchants to customize something visual but fails to provide a live-preview.
2. On a desktop device, a merchant cannot simultaneously view editor controls and the corresponding preview. For example, a merchant must toggle between the editor and preview, or a merchant must scroll up/down to toggle between viewing the editor and preview.

**中文要点**：视觉定制必须有**实时**预览；桌面端**控件与预览须同屏可见**——需要来回切换或上下滚动才能各看一半，即拒。

## 4.3 User-friendly 友好

> Your app doesn't mislead, pressure or overwhelm merchants. Your app should not implement [dark patterns](https://en.wikipedia.org/wiki/Dark_pattern). Deceptive or manipulative practices erode merchant trust in your app and in Shopify.

### 4.3.1 Don't make false claims

> Don't guarantee, promise, or strongly suggest merchant outcomes.

> 官方示意图：<https://shopify.dev/assets/dont-make-false-claims-BvKs8i7u.png>

**拒审理由（2 条）**

1. An app includes language that states a merchant outcome. For example, "Upgrade to the Pro plan to increase your sales by 18%".
2. An app displays a promotion of another app which includes an average star rating of 4.5 stars. However, in the app store, the promoted app actually has a significantly different average rating of only 3 stars.

**中文要点**：禁**保证/承诺/强烈暗示**结果（"提升 18% 销量"类数字承诺是典型）。改写方向：把**效果承诺**降级为**能力描述**。#2 额外要求：引用第三方评分必须与 App Store 实际一致。

### 4.3.2 Don't pressure merchants

> Don't pressure merchants with visible timers, language that could cause guilt or shame, or offer rewards for 5-star reviews.

> 官方示意图：<https://shopify.dev/assets/dont-pressure-merchants-BRQmf74F.png>

**拒审理由（2 条）**

1. An app offers a 7-day free trial. The app displays an animated countdown timer and encourages merchants to upgrade to a paid plan.
2. An app features calls to action that could reasonably make a merchant feel guilt or shame. For example, forcing merchants to click a button labelled "No thanks, I prefer less sales" to sign-up for a lower-tier plan.

**中文要点**：禁**可见倒计时** · 禁**羞辱式文案**（"不用了，我不想要更多销量"这种拒绝按钮）· 禁**用奖励换五星好评**。

### 4.3.3 Don't distract merchants

> Don't distract merchants with unnecessary animations, modals, popovers, or colors.

> 官方示意图：<https://shopify.dev/assets/dont-distract-merchants-C9cIwNET.png>

**拒审理由（4 条）**

1. A modal or popover automatically appears on page load, after a set time has elapsed, or as a result of an unrelated merchant action. For example, a "Get started" or "Live chat" popover appears on page load, or a "Leave us a review" modal appears after three seconds has elapsed.
2. A large element like a banner or card dramatically animates into view on page load, after a set time has elapsed, or as a result of an unrelated merchant action.
3. Animation is used to draw attention and is unrelated to a merchant action. For example, an "Upgrade to Pro" button wiggles.
4. Red is used for a purpose unrelated to error messaging or a destructive action.

**中文要点**：#1 三种触发时机全禁（加载时 / 定时后 / 无关操作后），**"仅一次"也不豁免**；引导改用 Banner。#2 大元素**入场动画**同样按三种时机禁。#3 无关商家动作的吸引注意动画禁。#4 **红色仅限错误信息与破坏性操作**——涨跌、评分高低、状态标签等非错误语境用中性 / 琥珀 / 蓝，但见 [4.2.4 #2](#424-helpful-error-messages)：错误必须红。

### 4.3.4 Don't overwhelm merchants

> Don't overwhelm merchants with poorly organized forms, overwhelming amounts of text, or multiple banners.

> 官方示意图：<https://shopify.dev/assets/dont-overwhelm-merchants-DiLBMzaM.png>

**拒审理由（3 条）**

1. A single large and complex form is presented to merchants, rather than a form with fields subdivided into logical groupings.
2. Two or more banners appear in close proximity to one another. For example, at the top of a page or within a single card.
3. An app prominently features large amounts of text (i.e. multiple paragraphs), rather than concise and easily scannable copy. For example, an app displays a card with two paragraphs of text on the app homepage to welcome merchants.

**中文要点**：大表单必须**按逻辑分组** · **两个及以上 banner 不得相邻**（页面顶部或同一 card 内是官方点名的两个位置）· 禁**多段落大段文字**（官方举例：首页 card 里两段欢迎语即算）。
自查方法：数每页顶部同时可见的 banner / 提示块数量；量首页与各功能页最长文本块的段落数。

### 4.3.5 Don't impersonate Shopify

> Don't do anything that might reasonably lead a merchant to mistake your app (or a feature of your app) for a [first-party Shopify app](https://apps.shopify.com/partners/shopify) or for Shopify itself.

> 官方示意图：<https://shopify.dev/assets/dont-impersonate-shopify-3OMAK4JD.png>

**拒审理由（2 条）**

1. An app's icon could reasonably be mistaken for a [first-party Shopify app](https://apps.shopify.com/partners/shopify) icon. For example, an app icon features a striking similar gradient background to a first-party Shopify app icon.
2. An app uses the [Shopify Sidekick icon](https://www.shopify.com/ca/magic) and/or a color similar to [Shopify's magic purple color](https://polaris.shopify.com/tokens/color#color-bg-fill-magic) to denote an AI related feature.

**中文要点**：图标不得与一方 App 混淆（**相似渐变背景**是官方点名的具体形态）· **不得用 Sidekick 图标或近似 magic purple 的颜色来标示 AI 功能**。对 AI 类 App：AI 相关的图标与配色都要主动避开紫色系与星形/魔法符号。

### 4.3.6 Dismissible ads

> Advertisements and/or promotional content must be dismissible by merchants.

> 官方示意图：<https://shopify.dev/assets/dismissible-ads-DZL7ScZO.png>

**拒审理由（2 条）**

1. Promotional content is not dismissible.
2. Promotional content is dismissible, however, after being dismissed the same (or similar) content later appears again.

**中文要点**：可关闭 **且** 关闭后**同类内容不得再现**——#2 意味着关闭状态必须**持久化**（per-shop 存储），仅存内存或 sessionStorage 在刷新后复现即命中。注意"similar"覆盖换皮的同类促销。

### 4.3.7 Label and disable premium features

> Features that are gated by a particular plan, must be disabled (both visually and functionally) and clearly indicated. Features exclusive to [Shopify Plus](https://www.shopify.com/ca/plus) must be hidden for non-Plus merchants.

> 官方示意图：<https://shopify.dev/assets/label-and-disable-premium-features-C9fosk7K.png>

**拒审理由（5 条）**

1. A plan-gated feature is interactive and appears visually enabled. It is only later revealed (e.g. upon form submission) that the feature actually requires merchants to pay for a more expensive plan.
2. A plan-gated feature is interactive but visually appears disabled.
3. A plan-gated feature is non-interative but visually appears enabled.
4. A feature that is exclusive to [Shopify Plus](https://www.shopify.com/ca/plus) merchants is visible to non-Plus merchants.
5. When an app offers multiple tiers and it is not obvious which specific tier is required to unlock a specific feature.

**中文要点**：#1–#3 是**视觉态与功能态必须一致**的三种错配（能点但看着禁用、看着能点但不能点、能点且看着正常却在提交时才告知要付费）· Plus 专属功能对非 Plus 商家**必须隐藏**（不是禁用，是隐藏）· 多档套餐必须**明确标出**每个功能属哪一档。

---

# 5. Category-specific 类别专属

> Not all apps are the same. A great app for one workflow uses different APIs, has different extensions, and looks different from an app for another workflow. Category-specific requirements ensure that apps excel in meeting unique user needs.
>
> If your app belongs to one of the categories listed below, then it must meet all of the criteria listed for that category.

**共 14 个类别、41 条**。类别以**真实功能**和 Dev Dashboard / 审核结果为准，**不得为规避要求而错误分类**。

## 5.1 Ads apps（2 条）

> Any app that enables merchants to create and manage digital advertising campaigns to promote their stores and products.

### 5.1.1 Use web pixels for ads apps

> If your app provides ad attribution, audience creation, segmentation, analytics, pixels, retargeting, or lookalike targeting, it must create and use [Web Pixel extensions](https://shopify.dev/docs/apps/build/marketing/build-web-pixels) to subscribe to relevant events emitted by Shopify when needed. You may not use script tags or require merchants to copy JavaScript into their stores in order to gather this data.

**中文要点**：必须用 Web Pixel extension；**禁 script tag、禁让商家手贴 JS**。

### 5.1.2 Use Shopify segments for ads apps

> Your app must allow merchants to use any segment defined in the Shopify admin when targeting advertisements or any other operation that targets multiple customers. It must also make these actions available through a [customer segment action extension](https://shopify.dev/docs/apps/build/marketing/customer-segments/build-an-action-extension).

**中文要点**：支持 Admin 内**任意** segment，并通过 customer segment action extension 暴露这些动作。

## 5.2 Affiliate program apps（1 条）

> Any app that enables merchants to create and manage systems for influencers to promote their products for commissions.

### 5.2.1 Use web pixels for affiliate program apps

> Your app must create and use [Web Pixel extensions](https://shopify.dev/docs/apps/build/marketing/build-web-pixels) to subscribe to relevant events emitted by Shopify when needed. You may not use script tags or require merchants to copy JavaScript into their stores in order to gather this data.

## 5.3 Analytics apps（1 条）

> Any app that provides merchants with **data-driven insights about their store's performance**.

### 5.3.1 Use web pixels for analytics apps

> Your app must create and use [Web Pixel extensions](https://shopify.dev/docs/apps/build/marketing/build-web-pixels) to subscribe to relevant events emitted by Shopify when needed. You may not use script tags or require merchants to copy JavaScript into their stores in order to gather this data.

**注意**：类别定义宽泛——任何**提供店铺表现数据洞察**的 App 都可能被归入。若 App 含流量/转化分析面板并接真实数据，需按此条评估。

## 5.4 Carrier services apps（2 条）

> Any app that connects to a [carrier service](https://shopify.dev/docs/api/admin-graphql/latest/queries/carrierService) (also known as a carrier calculated service or shipping service) to provide real-time shipping rates to buyers. [Learn more](https://shopify.dev/docs/apps/build/performance/checkout#limit-calls-to-retrieve-carrier-rates) about how to optimize your app's carrier rates performance. To assess your app's performance, you must make a minimum of 1000 requests in the last 28 days.

### 5.4.1 Respond quickly to rate requests

> Over the last 28 days, the carrier rate endpoint provided by your app must respond in fewer than 500 milliseconds for 95% of calls.

### 5.4.2 Complete rate requests reliably

> Over the last 28 days, the carrier rate endpoint provided by your app must successfully respond to 99.9% of requests.

## 5.5 Discount apps（4 条）

> Any app that enables merchants to define and configure price reductions.

### 5.5.1 Use discount primitives

> Your app must either use [discount functions](https://shopify.dev/docs/apps/build/discounts#build-with-shopify-functions) to define custom discount types or use the native [discount APIs](https://shopify.dev/docs/apps/build/discounts#build-with-the-graphql-admin-api) to create discounts.

### 5.5.2 Don't use draft orders with custom discounts

> Your app must not create draft orders to give custom discounts. Drafts with custom discounts are designed for one-off merchant-driven flows rather than automated customer-driven flows and do not have the same reporting tools.

### 5.5.3 Use a single redeem code per discount

> Your app must use the [`discountRedeemCodeBulkAdd`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/discountRedeemCodeBulkAdd) mutation to create any discounts with multiple redeem codes.
>
> Instead of creating separate discounts with the same value and different codes through the GraphQL Admin API, using `discountRedeemCodeBulkAdd` ensures that all codes are linked to the same discount characteristics, making it easier to manage and update them as needed.

### 5.5.4 Create high quality links

> All [links to your app](https://shopify.dev/docs/apps/build/functions/input-output/metafields-for-input-queries#creating-your-merchant-interface) from the Create discount button on the Discounts page must direct to a page in your embedded app where merchants can create the corresponding discount. These pages must follow all relevant [App Design Guidelines](https://shopify.dev/docs/apps/design).

## 5.6 Email marketing apps（4 条）

> Any app that enables merchants to communicate with customers via targeted email campaigns.

### 5.6.1 Use web pixels for email marketing apps

> If your app provides automation, segmentation, analytics, or pixels, it must create and use [Web Pixel extensions](https://shopify.dev/docs/apps/build/marketing/build-web-pixels) to subscribe to relevant events emitted by Shopify when needed. You may not use script tags or require merchants to copy JavaScript into their stores in order to gather this data.

### 5.6.2 Sync customer data for email marketing apps

> Your app must sync all [customer](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerCreate) information to and from Shopify as required by the [Shopify API License and Terms of Use](https://www.shopify.com/legal/api-terms#2-using-the-shopify-a-p-i).

### 5.6.3 Use Shopify segments for email marketing apps

> Your app must allow merchants to use any segment defined in the Shopify admin when targeting advertisements or any other operation that targets multiple customers. It must also make these actions available through a [customer segment action extension](https://shopify.dev/docs/apps/build/marketing/customer-segments/build-an-action-extension).

### 5.6.4 Help merchants to identify visitors to their store for email marketing apps

> Your app must use the [visitors API](https://shopify.dev/docs/api/web-pixels-api/emitting-data#visitor-api) to log identifying information, such as emails or phone numbers, for any customers that provide this information on the Online Store.

## 5.7 Forms apps（3 条）

> Any app that enables merchants to create custom fields for customers to submit personal information, preferences, or inquiries on their stores.

### 5.7.1 Use Shopify segments for forms apps

> Your app must allow merchants to use any segment defined in the Shopify admin when targeting advertisements or any other operation that targets multiple customers. It must also make these actions available through a [customer segment action extension](https://shopify.dev/docs/apps/build/marketing/customer-segments/build-an-action-extension).

### 5.7.2 Help merchants to identify visitors to their store for forms apps

> Your app must use the [visitors API](https://shopify.dev/docs/api/web-pixels-api/emitting-data#visitor-api) to log identifying information, such as emails or phone numbers, for any customers that provide this information on the Online Store.

### 5.7.3 Sync customer data for forms apps

> Your app must sync all [customer](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerCreate) information to and from Shopify as required by the [Shopify API License and Terms of Use](https://www.shopify.com/legal/api-terms#2-using-the-shopify-a-p-i).

## 5.8 Fulfillment services apps（7 条）

> Any app that uses its own location to prepare and ship orders on behalf of merchants.

### 5.8.1 Actively fulfill orders

> Your app must be active and have fulfilled 100 or more [fulfillment orders](https://shopify.dev/docs/api/admin-graphql/latest/objects/FulfillmentOrder) in the last 28 days. If an app is not active, then it's not possible to accurately assess the other criteria for fulfillment services apps.

### 5.8.2 Complete fulfillment orders

> Your app must have completed 97% of the [fulfillment orders](https://shopify.dev/docs/api/admin-graphql/latest/objects/FulfillmentOrder) assigned to it in the last 28 days. New fulfillment orders that were created in the last 7 days are excluded. A fulfillment order is considered incomplete if it's in one of the following states:
>
> * `open`, `submitted`
> * `in_progress`, `accepted`
> * `in_progress`, `rejected`
> * `in_progress`, `cancellation_rejected`
> * `in_progress`, `cancellation_requested`

### 5.8.3 Respond to callback requests

> In the last 28 days, your app must have responded successfully to 99% of Shopify [callback requests](https://shopify.dev/docs/api/admin-graphql/latest/objects/FulfillmentService) that are sent to it, so merchants are not alerted to failing callback requests.

### 5.8.4 Wait for merchant requests

> Your app must only fulfill fulfillment orders after a [merchant requests](https://shopify.dev/docs/api/admin-graphql/latest/enums/FulfillmentOrderStatus) fulfillment.

### 5.8.5 Add tracking information

> In the last 28 days, your app must have [added tracking information](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentTrackingInfoUpdateV2) to 80% of the fulfillments that it creates within one hour of creation.
>
> In cases where precise tracking information isn't available from a shipping carrier URL, you can provide a custom URL to your app's site by:
>
> * Using [`fulfillmentCreateV2`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentCreateV2) to populate `fulfillment.trackingInfo.company` and `fulfillment.trackingInfo.url(s)` at the time of creation, OR
> * Using [`fulfillmentTrackingInfoUpdateV2`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentTrackingInfoUpdateV2) to mutate an existing entry and populate `trackinigInfoInput.company` and `trackingInfoInput.url(s)`.

### 5.8.6 Respond to fulfillment requests

> In the last 28 days, your app must have responded to 95% of fulfillment requests within 24 hours by either [accepting](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderAcceptFulfillmentRequest) or [rejecting](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderRejectFulfillmentRequest) the fulfillment request.

### 5.8.7 Respond to cancellation requests

> In the last 28 days, your app must have responded to 99% of cancellation requests within 24 hours by either [accepting](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderAcceptCancellationRequest) or [rejecting](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderRejectCancellationRequest) the cancellation request.

**中文要点**：5.8.2 完成率为 **97%**；5.8.6 为 **95% 在 24 小时内**响应 fulfillment requests；5.8.7 为 **99% 在 24 小时内**响应 cancellation requests。三项均按最近 28 天窗口评估。

## 5.9 Invoices and receipts apps（1 条）

> Any app that generates invoices or packing slips for orders.

### 5.9.1 Enable printing on orders pages

> Your app must use an [admin print action extension](https://shopify.dev/docs/apps/build/admin/actions-blocks) to let merchants print invoices or packing slips for an individual order directly from the orders detail page as well as for any selected orders from the orders index page.

**中文要点**：两个位置都要有——订单**详情页**单张打印 + 订单**列表页**批量打印。

## 5.10 Product bundles apps（1 条）

> Any app that groups products together to be sold as a single unit.

### 5.10.1 Use bundles primitives

> Your app must either use the GraphQL Admin API to create [static bundles](https://shopify.dev/docs/apps/build/product-merchandising/bundles/add-fixed-bundle) or use a `cartTransform` function to create [customized bundles](https://shopify.dev/docs/apps/build/product-merchandising/bundles/add-customized-bundle).
>
> However, if your app supports a bundles use case that is not yet supported through these APIs — such as selling bundles on unsupported sales channels, selling bundles as a part of a subscription, or editing orders to add or remove bundles after purchase — you may use other methods to create a bundle.

## 5.11 Product reviews apps（2 条）

> Any app that enables merchants to collect product reviews.

### 5.11.1 Provide a flow trigger

> Your app must provide a [Flow trigger](https://shopify.dev/docs/apps/build/flow/triggers/create) that starts a workflow whenever a new review is collected.

### 5.11.2 Use block extensions

> Your app must provide an [admin block extension](https://shopify.dev/docs/apps/build/admin/actions-blocks#admin-blocks) on customer detail pages that gives merchants access to any reviews submitted by the customer.

## 5.12 Returns and exchanges apps（4 条）

> Any app that facilitates the process of managing and processing product returns, exchanges, and refunds for customers.

### 5.12.1 Sync returns information

> Your app must use the appropriate APIs to communicate all lifecycle events of a return to Shopify. These include:
>
> * [Creating returns](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnCreate)
> * [Shipping creation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/reverseDeliveryCreateWithShipping)
> * [Restocking](https://shopify.dev/docs/api/admin-graphql/latest/mutations/reverseFulfillmentOrderDispose)
> * [Removing items from a return](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnLineItemRemoveFromReturn)
> * [Cancelling a return](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnCancel)
> * [Closing returns](https://shopify.dev/docs/api/admin-graphql/latest/mutations/returnClose)
> * [Providing refunds](https://shopify.dev/docs/api/admin-graphql/latest/mutations/refundCreate)

### 5.12.2 Include exchange line items

> Your app must create [exchange line items](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/ExchangeLineItemInput) on an order when managing exchanges. You must also remove exchange lines from the order if they are no longer needed.

### 5.12.3 Include shipping and restocking fees

> Your app must add [shipping fees](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/ReturnShippingFeeInput) and [restocking fees](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/RestockingFeeInput) on an order when applicable.

### 5.12.4 Use the Customer Account API for customer authentication

> Your app must support the [Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers) as the primary method for customer authentication.

**生效与适用性**：根据 [2026-06-17 Changelog](https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps)，本条自 **2026-12-01** 起适用于提供买家自助退换货体验的 Returns and exchanges apps。截止日前记录为未来生效项；没有 buyer-facing self-service 时写明排除理由，不可只按类别名称判定。

## 5.13 SMS marketing apps（4 条）

> Any app that enables merchants to communicate with customers via targeted SMS campaigns.

### 5.13.1 Use web pixels for SMS marketing apps

> If your app provides automation, segmentation, analytics, or pixels, it must create and use [Web Pixel extensions](https://shopify.dev/docs/apps/build/marketing/build-web-pixels) to subscribe to relevant events emitted by Shopify when needed. You may not use script tags or require merchants to copy JavaScript into their stores in order to gather this data.

### 5.13.2 Sync customer data for SMS marketing apps

> Your app must sync all [customer](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerCreate) information to and from Shopify as required by the [Shopify API License and Terms of Use](https://www.shopify.com/legal/api-terms#2-using-the-shopify-a-p-i).

### 5.13.3 Use Shopify segments for SMS marketing apps

> Your app must allow merchants to use any segment defined in the Shopify admin when targeting advertisements or any other operation that targets multiple customers. It must also make these actions available through a [customer segment action extension](https://shopify.dev/docs/apps/build/marketing/customer-segments/build-an-action-extension).

### 5.13.4 Help merchants to identify visitors to their store for SMS marketing apps

> Your app must use the [visitors API](https://shopify.dev/docs/api/web-pixels-api/emitting-data#visitor-api) to log identifying information, such as emails or phone numbers, for any customers that provide this information on the Online Store.

## 5.14 Subscription apps（5 条）

> Any app that enables customers to purchase products on a recurring basis.

### 5.14.1 Use subscription objects and APIs

> Your app must use the following subscriptions objects and APIs:
>
> * [Selling plan API](https://shopify.dev/docs/api/admin-graphql/latest/objects/sellingplan) to create and manage various ways to sell and buy products
> * [Subscription contract API](https://shopify.dev/docs/api/admin-graphql/latest/objects/subscriptioncontract) to create, manage, and update subscription agreements between a customer and merchant in real time
> * [Customer payment method API](https://shopify.dev/docs/api/admin-graphql/latest/objects/customerpaymentmethod) to store payment methods that can be used to pay for future orders without requiring the customer to manually go through checkout

### 5.14.2 Use theme app block extensions

> Your app must add subscriptions on product detail pages by using an [app block for themes](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration#app-blocks-for-themes) that is compatible with [Online Store 2.0](https://shopify.dev/docs/storefronts/themes/os20).

### 5.14.3 Follow subscriptions UX guidelines

> Your app must obey the following [subscriptions UX guidelines](https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines):
>
> * The subscription information — including selling plan name, price, and savings — must be clearly displayed on the product, cart, and order detail pages.
> * The subscription option information must automatically match the color palette, font, font-size, and font weight of the store's current theme by default.

### 5.14.4 Use Customer Account UI extensions

> Your app must use [Customer Account UI extensions](https://shopify.dev/docs/api/customer-account-ui-extensions) to enable customers to view and manage their subscriptions.

### 5.14.5 Use the Customer Account API for customer authentication

> Your app must support the [Customer Account API](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers) as the primary method for customer authentication.

**生效与适用性**：根据 [2026-06-17 Changelog](https://shopify.dev/changelog/built-for-shopify-requirements-for-returns-and-exchanges-and-subscription-apps)，本条自 **2026-12-01** 起适用于提供买家自助订阅管理体验的 Subscription apps。截止日前记录为未来生效项；没有 buyer-facing self-service 时写明排除理由，不可只按类别名称判定。

---

# 附录 A：编号总览（77 条）

| 章节 | 编号范围 | 条数 | 评估方式 |
|---|---|---|---|
| 1.1 General | 1.1.1 – 1.1.2 | 2 | 审计 / 人工 |
| 1.2 Merchant utility | 1.2.1 – 1.2.3 | 3 | 自动（Distribution） |
| 2.1 Admin performance | 2.1.1 – 2.1.3 | 3 | 自动（需 ≥100 采样 / 28 天） |
| 2.2 Storefront performance | 2.2.1 | 1 | 自动（Lighthouse） |
| 2.3 Checkout performance | 2.3.1 | 1 | 自动（需 ≥1000 请求 / 28 天） |
| 3.1 Embedded apps | 3.1.1 – 3.1.5 | 5 | 人工 |
| 3.2 Installation and asset management | 3.2.1 – 3.2.2 | 2 | 人工 + API 审计 |
| 4.1 Familiar | 4.1.1 – 4.1.6 | 6 | 人工（23 条拒审理由） |
| 4.2 Helpful | 4.2.1 – 4.2.6 | 6 | 人工（20 条拒审理由） |
| 4.3 User-friendly | 4.3.1 – 4.3.7 | 7 | 人工（20 条拒审理由） |
| 5.1 – 5.14 Category-specific | 见各节 | 41 | 视类别，人工 + 自动 |
| **合计** | | **77** | |

# 附录 B：§4 拒审理由数量分布（63 条）

| 条款 | 条数 | 条款 | 条数 | 条款 | 条数 |
|---|---|---|---|---|---|
| 4.1.1 | 11 | 4.2.1 | 2 | 4.3.1 | 2 |
| 4.1.2 | 3 | 4.2.2 | 6 | 4.3.2 | 2 |
| 4.1.3 | 1 | 4.2.3 | 3 | 4.3.3 | 4 |
| 4.1.4 | 4 | 4.2.4 | 5 | 4.3.4 | 3 |
| 4.1.5 | 2 | 4.2.5 | 2 | 4.3.5 | 2 |
| 4.1.6 | 2 | 4.2.6 | 2 | 4.3.6 | 2 |
| **4.1 小计** | **23** | **4.2 小计** | **20** | 4.3.7 | 5 |
| | | | | **4.3 小计** | **20** |

# 附录 C：跨条款配对约束（易改出新违规）

| 配对 | 约束 |
|---|---|
| 4.2.4 #2 ↔ 4.3.3 #4 | 错误**必须**红；非错误**不得**红。单向改色会制造另一侧违规 |
| 4.2.4 #1 ↔ 常见 toast 实现 | 承载错误的提示**不得定时自动消失**；纯成功态可以 |
| 4.2.2 #6 ↔ 4.3.6 #2 | 引导 UI 完成后要能移除；促销关闭后不得再现（需 per-shop 持久化） |
| 4.1.5 #2 ↔ 4.1.1 #7 | 表单离开须经 CSB；tab 切换既要被 CSB 拦，又不得改动 tab 上方内容 |
| 4.1.1 #11 ↔ 4.1.4 #3 | 子页要有返回父页入口；但不得为首页新增独立导航项 |
| 3.1.4 ↔ 4.2.3 #2 | 同一件事的两处要求：首页必须有关键指标 |
| 3.2.1 ↔ 3.2.2 | 店面内容走 theme app extension；Asset API **读取**仍允许，写入/删除只限官方三类例外 |

# 附录 D：外部权威链接

| 主题 | 链接 |
|---|---|
| Partner Program Agreement | <https://www.shopify.com/partners/terms> |
| Shopify API License and Terms of Use | <https://www.shopify.com/legal/api-terms> |
| Partner 政策执行 | <https://help.shopify.com/en/partners/faq/removal> |
| WCAG 2.1 AA 对比度 | <https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=141#contrast-minimum> |
| Web Vitals | <https://web.dev/articles/vitals> |
| Dark patterns | <https://en.wikipedia.org/wiki/Dark_pattern> |
| Shopify Magic / Sidekick | <https://www.shopify.com/ca/magic> |
| magic purple token | <https://polaris.shopify.com/tokens/color#color-bg-fill-magic> |
| 一方 Shopify App 列表 | <https://apps.shopify.com/partners/shopify> |
| Shopify Plus | <https://www.shopify.com/ca/plus> |
| App Design Guidelines | <https://shopify.dev/docs/apps/design> |
| 废弃 Fullscreen bar | <https://polaris-react.shopify.com/components/deprecated/fullscreen-bar> |

# 变更记录

| 日期 | 变更 | 依据 |
|---|---|---|
| 2026-07-30 | 对齐 5.8.2、5.8.6、5.8.7 最新指标；补充 5.12.4、5.14.5 的 2026-12-01 生效范围；接入 BFS 状态生命周期 | 官方 requirements.md、Regain lost status、2026-06-17 Changelog |
| 2026-07-29 | 修正 3.2.2 读取范围与 4.1.6 modal 前提；明确拒审理由不是唯一证据；接入实时账本与逐条全文校验 | 官方 requirements HTML 逐条复核 |
| 2026-07-29 | 建立官方全文快照：77 条要求 + §4 全部 63 条拒审理由 + 附录 A–D | 官方 requirements.md 全文 |
| 2026-07-24 | （前序）`official-requirements-matrix.md` 核准 77 条编号 | 官方页 651 行 / 59 个正文链接审读 |
