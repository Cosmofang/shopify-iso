# Built for Shopify — 设计/UX 合规条款清单

> 来源：Built for Shopify 要求 **Section 4 Design** 全条款（4.1 Familiar / 4.2 Helpful / 4.3 User-friendly），每条给出 **pass / fail 判据**。技术要求（性能/安全/集成/API/webhook）见 [../05-engineering/](../05-engineering/)。
> 官方文档：https://shopify.dev/docs/apps/launch/built-for-shopify/requirements

图例：✅ = 达标示例，❌ = 会被打回。

---

## 4.1 Familiar 熟悉（视觉与布局）

### 4.1.1 遵循 UX 最佳实践
**规则 A — 按钮样式必须与 Shopify Admin 一致。主按钮用最新 Polaris `--p-color-bg-fill-brand`（深黑/深灰）。**
- ✅ 主操作按钮背景 `#303030`（`--p-color-bg-fill-brand`，hover 变深 `#1a1a1a`），文字白色。
- ✅ 用 `<s-button variant="primary">`（继承 Admin 主题，自动为黑）。
- ❌ 主按钮为绿色 `#008060`（旧品牌绿，已废弃）。
- ❌ 主按钮写死自定义品牌色（橙/蓝等）。

**规则 B — 文字/颜色对比度须符合 WCAG 2.1 AA。带文字的组件（按钮/卡片/导航），文字与背景对比 ≥ 4.5:1。**
- ✅ 正文 `#303030` on `#ffffff`（12.6:1）；次要文字 `#616161` on `#ffffff`（5.7:1）。
- ❌ 浅灰文字 `#8c9196` on 白（3.4:1，不达标）。
- ❌ 浅色按钮上放白字导致对比不足。
- 详见 [wcag-contrast.md](wcag-contrast.md)。

**其余官方拒审判据：**

- UI 有闪烁、反复加载进出、明显布局跳动或其他不完整表现。
- 大多数内容没有放在与 Shopify Admin 相似的 card-like 容器中。
- 正文大量使用 serif/script 字体，或正文字号明显偏离 Admin。
- App 背景明显偏离 Admin（例如整页黑底）。
- 切换同组 tabs 时改变 tabs 上方内容或使 tabs 自身移动。
- 同一组/列表中只有部分项目带图标，视觉规则不一致。
- 页面间距明显偏离 Admin。
- 子页面没有返回父页面的 back button。

### 4.1.2 移动端友好
**内容间距合理，且针对移动设备优化。**
官方 3 条打回判据：① 整页需横向滚动；② 部分内容**完全无法访问**（折叠了却无法展开，或既不换行也不滚动导致看不到）；③ 内容被**不合理压缩**（如两列桌面布局在手机上仍两列、不堆叠）。
- ✅ 窄屏下多列自动堆叠为单列；折叠内容可展开或可滚动；水平内边距 16px；触控目标 ≥ 44×44px（16px/44px/375px 为最佳实践，非官方判据）。
- ❌ 整页横滚；❌ 内容被隐藏取不到；❌ 两列不堆叠、元素挤压。
- 详见 [../03-patterns/mobile.md](../03-patterns/mobile.md)。

### 4.1.3 App 名简洁
**桌面端 App pinned 后（pin icon 不再显示），App 名在 Shopify 左侧导航不能被 `…` 截断。**
- ✅ 导航显示名足够短，完整可见（建议 ≤ ~30 字符，实际以不截断为准）。
- ❌ "Deeplumen: AI SEO Optimizer" 这类长名被截断成 "Deeplumen: AI SEO…"。
- 配置见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。

### 4.1.4 使用导航菜单
**使用 App Bridge `s-app-nav` 把主导航集成进 Shopify Admin 导航。**
- ✅ 点 App 名 = 打开首页；`App URL` 指向首页路由；子页面正确高亮父导航项。
- ❌ 自绘 App 内主导航，或 App 名下再挂一个 "Home / 首页" 项做重复跳转。
- ❌ 子页面未高亮对应父导航项；导航项使用 emoji。
- 配置：Partner Dashboard → Configuration → URLs → **App URL**。见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。

### 4.1.5 使用上下文保存栏（Contextual Save Bar）
**表单输入应通过 App Bridge 的 Contextual Save Bar（CSB）保存。**
- ✅ 表单一改动即出现 CSB，商家用其 Save / Discard 保存或放弃。
- ❌ 该用 CSB 的表单没接；CSB 出现后商家仍能绕过 Save/Discard 直接离开页面。

### 4.1.6 正确使用 Modal
**Modal 用 `heading` 属性作标题、primary/secondary action 槽放按钮。**
- ✅ 按钮放在组件的 action 槽内。
- ❌ 按钮放在组件槽外；用已废弃的 Polaris Fullscreen bar，而不是 `s-app-window` + `s-page`。
- 详见 [../02-components/modals.md](../02-components/modals.md)。

---

## 4.2 Helpful 有用（表单 / 内容 / 引导）

### 4.2.1 拼写、语法、措辞
**全程清晰语言、语法正确、拼写无误。**
- ✅ 标题/导航/CTA 无明显错误；标签有上下文（如时间输入注明单位）。
- ❌ 标题/导航/CTA 有醒目错误；措辞难懂或缺上下文。

### 4.2.2 有用的 onboarding
**提供简洁的引导，确立 app 核心功能。**
- ✅ 引导商家走到核心功能的明确完成状态，内容简洁，首次进入容易看到和找到。
- ❌ 引导不足以走到完成，或冗长、默认折叠、出现在首屏外。
- ❌ 暗示/强烈建议必须安装另一个 App，例如将“安装其他 App”设为 setup guide 主操作。
- ❌ 索取商家信息却不就近说明具体用途。
- ❌ 完成后 onboarding UI 没有自动移除、关闭或收起机制。
- 官方推荐：当前 [Setup guide composition](https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide)、不超过 5 步、自动完成、进度指示、复杂流程可稍后继续。
- 完整实现与验收见 [../03-patterns/onboarding.md](../03-patterns/onboarding.md)。

### 4.2.3 有用的首页
**首页应显示 app 是否配好、是否在工作、表现如何。**
- ✅ 有主题 block/embed 的用 `app.extensions()` 显示其状态；露关键指标（如邮件 app 的打开率）。
- ❌ 不显示扩展状态；漏掉明显有用的指标；dismiss 后首页只剩静态内容。

### 4.2.4 有用的错误信息
**每个出错字段必须在旁边显示清晰、可行动的错误信息。只标红框不够。**
- ✅ 红框 + 具体文案：「请输入有效的邮箱地址，例如 name@store.com」。
- ✅ 文案说明**问题 + 解决方向**。
- ❌ 错误自动在固定时间后消失（例如只用 5 秒后消失的 toast）。
- ❌ 错误使用红色以外的颜色；或只把输入框标红、无对应文字。
- ❌ 字段错误没有显示在相关字段旁，而是统一放在页面顶部。
- ❌ 商家尚未与字段交互就提前显示错误。
- ❌ 泛泛的「出错了 / Invalid」无解决指引。
- 详见 [../02-components/forms-fields.md](../02-components/forms-fields.md)。

### 4.2.5 引导到合理动作
**一组相关动作里，最合理的动作视觉上最突出。**
- ✅ 主操作 = 视觉最强按钮（一区一主按钮）。
- ❌ 一组按钮同一视觉权重；最突出的不是最合理的（如「不保存离开」比「保存」还强）。
- 配合 [../02-components/buttons.md](../02-components/buttons.md)。

### 4.2.6 可见预览
**商家自定义视觉内容时，必须实时看到变化。**
- ✅ 提供实时预览；桌面端控件与预览可同屏看。
- ❌ 无实时预览；桌面端要在控件和预览间来回切换/滚动。

---

## 4.3 User-friendly 友好（不打扰）

### 4.3.1 不做虚假承诺
**不得保证/承诺/强烈暗示商家能得到某结果。**
- ✅ 客观描述功能。
- ❌ 承诺具体销售增长；宣传别的 app 时用与真实 App Store 明显不符的星级。

### 4.3.2 不施压商家
**不用可见倒计时、愧疚/羞辱式措辞、或为五星好评给奖励。**
- ✅ 中性 CTA。
- ❌ 逼升级的动画倒计时；愧疚式按钮（如「不了，我不想要更多销量」）。

### 4.3.3 不分散商家注意力
**不得用无必要的动画、modal、popover 或颜色分散注意力。**
- ✅ 弹窗只由商家主动点击触发。
- ❌ 进页面就弹订阅/引导/公告 modal。
- ❌ 停留 N 秒后自动弹。
- ❌ 商家做 A 操作，却弹出与 A 无关的 B 弹窗。
- ❌ 大 Banner/Card 在页面加载、固定延时或无关操作后夸张入场。
- ❌ 与商家操作无关的吸睛动画，例如 Upgrade 按钮持续摇晃。
- 详见 [../02-components/modals.md](../02-components/modals.md)。

**红色仅限错误/破坏性：**
**红色只能用于「错误信息」或「破坏性操作（删除等）」，不得用于其他用途。**
- ✅ 错误文字/边框、删除按钮（`tone="critical"`）用红。
- ✅ 普通强调用中性色/`--p-color-text-emphasis` 蓝。
- ❌ 用红色做普通标签、装饰、非错误的高亮、促销文字。
- 需**全 App 排查**，不是改一处。详见 [../03-patterns/color-usage.md](../03-patterns/color-usage.md)。

### 4.3.4 不让商家不堪重负
**避免组织糟糕的表单、过多文字、多条 banner。**
- ✅ 字段按逻辑分组；文案简洁可扫读。
- ❌ 一个又大又复杂的表单；两条及以上 banner 挤在一起；大段文字。

### 4.3.5 不冒充 Shopify
**别让商家把你的 app 误认成 Shopify 官方一方或 Shopify 本身。**
- ✅ 有辨识度的自有图标/配色。
- ❌ 图标近似 Shopify 一方图标；用 Sidekick 图标或 Shopify「magic purple」紫来标 AI 功能。

### 4.3.6 广告可关闭
**广告与促销内容必须可 dismiss。**
- ✅ 促销可关，关掉不再复现。
- ❌ 促销不可关；关掉后同样/类似内容又出现。

### 4.3.7 付费功能要标注并禁用
**套餐限定功能要在视觉+功能上禁用并清晰标注；Plus 专属功能对非 Plus 商家隐藏。**
- ✅ 锁定功能明显置灰 + 标明解锁套餐。
- ❌ 功能看起来可用且可交互，提交时才揭示需要升级。
- ❌ 功能可交互但看起来禁用，或不可交互但看起来启用。
- ❌ Plus 专属功能对非 Plus 商家可见；或不清楚哪个套餐解锁。

---

## 其他常被忽略的通用要求（非本次打回，但会查）

| 条目 | 要求 |
|------|------|
| 加载状态 | 异步操作要有 loading（skeleton / spinner / 按钮 `loading`），别白屏。 |
| 空状态 | 列表/表格空时给有意义的空状态 + 引导操作。 |
| 焦点可见 | 键盘 Tab 时焦点环清晰可见（别 `outline:none` 一删了之）。 |
| 一致的组件 | 同类操作用同一组件，别自绘与 Polaris 冲突的控件。 |
| 嵌入式规范 | `embedded=true`，不自绘 Shopify 顶栏/搜索/面包屑。 |

---

## 提交流程

1. 逐条对照本文件 + [pre-submission-checklist.md](pre-submission-checklist.md)。
2. 用 `shopify app dev` 跑真机自测（桌面 + 移动视口）。
3. 全绿后到 **Built for Shopify dashboard** 重新申请审核。

> ⚠️ 反复提交但未真正修复，可能导致 App 临时冻结。务必一次改到位。
