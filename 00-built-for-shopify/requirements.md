# Built for Shopify — 设计/UX 合规条款清单

> 来源：Built for Shopify 要求（Design 4.x 系列）。本文件只收录**设计/UX 相关**条款（4.1 外观、4.2 表单/交互、4.3 不打扰商家），每条给出 **pass / fail 判据**。
> 官方文档：https://shopify.dev/docs/apps/launch/built-for-shopify

图例：✅ = 达标示例，❌ = 会被打回。

---

## 4.1 视觉与布局

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
- ✅ 窄屏下多列自动堆叠为单列；水平内边距 16px；触控目标 ≥ 44×44px。
- ❌ 手机上出现横向滚动、元素挤压、文字贴边、按钮过小。
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

---

## 4.2 表单与交互

### 4.2.4 有用的错误信息
**每个出错字段必须在旁边显示清晰、可行动的错误信息。只标红框不够。**
- ✅ 红框 + 具体文案：「请输入有效的邮箱地址，例如 name@store.com」。
- ✅ 文案说明**问题 + 解决方向**。
- ❌ 只把输入框边框变红、无任何文字。
- ❌ 泛泛的「出错了 / Invalid」无指引。
- 详见 [../02-components/forms-fields.md](../02-components/forms-fields.md)。

---

## 4.3 不打扰商家

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
