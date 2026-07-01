# Built for Shopify — 设计/UX 合规条款清单

> 来源：Built for Shopify 要求 **Section 4 Design** 全条款（4.1 Familiar / 4.2 Helpful / 4.3 User-friendly），每条给出 **pass / fail 判据**。技术要求（性能/安全/集成/API/webhook）见 [../05-engineering/](../05-engineering/)。
> 官方文档：https://shopify.dev/docs/apps/launch/built-for-shopify/requirements

图例：✅ = 达标示例，❌ = 会被打回。

---

## 4.1 Familiar 熟悉（视觉与布局）

### 4.1.1 遵循 UX 最佳实践（按钮 & 对比度）
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

### 4.1.2 移动端友好
**内容间距合理，且针对移动设备优化。**
官方 3 条打回判据：① 整页需横向滚动；② 部分内容**完全无法访问**（折叠了却无法展开，或既不换行也不滚动导致看不到）；③ 内容被**不合理压缩**（如两列桌面布局在手机上仍两列、不堆叠）。
- ✅ 窄屏下多列自动堆叠为单列；折叠内容可展开或可滚动；水平内边距 16px；触控目标 ≥ 44×44px（16px/44px/375px 为最佳实践，非官方判据）。
- ❌ 整页横滚；❌ 内容被隐藏取不到；❌ 两列不堆叠、元素挤压。
- 详见 [../03-patterns/mobile.md](../03-patterns/mobile.md)。

### 4.1.3 App 名简洁
**桌面端「取消固定（unpin）」后，App 名在 Shopify 左侧导航不能被 `…` 截断。**
- ✅ 导航显示名足够短，完整可见（建议 ≤ ~30 字符，实际以不截断为准）。
- ❌ "Deeplumen: AI SEO Optimizer" 这类长名被截断成 "Deeplumen: AI SEO…"。
- 配置见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。

### 4.1.4 使用导航菜单
**Shopify Admin 左侧导航里的「App 名」本身要直接进 App 首页，不要另设一个单独的导航项去跳首页。**
- ✅ 点 App 名 = 打开首页；`App URL` 指向首页路由。
- ❌ App 名下再挂一个 "Home / 首页" 项做重复跳转。
- 配置：Partner Dashboard → Configuration → URLs → **App URL**。见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。

### 4.1.5 使用上下文保存栏（Contextual Save Bar）
**表单输入应通过 App Bridge 的 Contextual Save Bar（CSB）保存。**
- ✅ 表单一改动即出现 CSB，商家用其 Save / Discard 保存或放弃。
- ❌ 该用 CSB 的表单没接；商家能不碰保存直接离开页面。

### 4.1.6 正确使用 Modal
**Modal 用 `heading` 属性作标题、primary/secondary action 槽放按钮。**
- ✅ 按钮放在组件的 action 槽内。
- ❌ 按钮放在组件槽外；用已废弃的 Polaris Fullscreen bar。
- 详见 [../02-components/modals.md](../02-components/modals.md)。

---

## 4.2 Helpful 有用（表单 / 内容 / 引导）

### 4.2.1 拼写、语法、措辞
**全程清晰语言、语法正确、拼写无误。**
- ✅ 标题/导航/CTA 无明显错误；标签有上下文（如时间输入注明单位）。
- ❌ 标题/导航/CTA 有醒目错误；措辞难懂或缺上下文。

### 4.2.2 有用的 onboarding
**提供简洁的引导，确立 app 核心功能。**
- ✅ 引导能走到完成、简洁、易找到。
- ❌ 引导不引向完成/不简洁/难找；暗示需装另一个 app；无理由索取商家信息；完成后引导 UI 无法移除。

### 4.2.3 有用的首页
**首页应显示 app 是否配好、是否在工作、表现如何。**
- ✅ 有主题 block/embed 的用 `app.extensions()` 显示其状态；露关键指标（如邮件 app 的打开率）。
- ❌ 不显示扩展状态；漏掉明显有用的指标；dismiss 后首页只剩静态内容。

### 4.2.4 有用的错误信息
**每个出错字段必须在旁边显示清晰、可行动的错误信息。只标红框不够。**
- ✅ 红框 + 具体文案：「请输入有效的邮箱地址，例如 name@store.com」。
- ✅ 文案说明**问题 + 解决方向**。
- ❌ 只把输入框边框变红、无任何文字。
- ❌ 泛泛的「出错了 / Invalid」无指引。
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

### 4.3.3 规则 A — 禁止自动弹窗
**不得在页面加载时 / 固定延时后 / 因无关操作 自动弹出 modal 或 popover。**
- ✅ 弹窗只由商家主动点击触发。
- ❌ 进页面就弹订阅/引导/公告 modal。
- ❌ 停留 N 秒后自动弹。
- ❌ 商家做 A 操作，却弹出与 A 无关的 B 弹窗。
- 详见 [../02-components/modals.md](../02-components/modals.md)。

### 4.3.3 规则 B — 红色仅限错误/破坏性
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
- ❌ 锁定功能看起来/用起来像启用，点了才弹付费墙；看似启用实则不可交互；Plus 专属功能对非 Plus 可见；不清楚哪个套餐解锁。

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
