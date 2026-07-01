# 本次 BFS 打回 8 条 → 逐条整改方案

> 对象：**Deeplumen: AI SEO Optimizer**。这是审核邮件列出的问题的可执行整改清单。
> 每条含：**问题 → 判据 → 怎么改（代码/配置）→ 自测**。
> 代码以 Polaris Web Components（`s-*`）为主；App 用 `@shopify/shopify-app-react-router` 的 `AppProvider embedded`。

---

## ① 4.1.1 主按钮颜色（绿 → 黑）

**问题**：部分主按钮仍是旧品牌绿 `#008060`。
**判据**：主按钮背景 = `--p-color-bg-fill-brand`（`#303030` 深色，hover `#1a1a1a`）。
**怎么改**：
- 用 `<s-button variant="primary">`，**不要**再用 CSS 覆盖背景色。
- 若某处自定义 CSS 写死了绿色，删除该覆盖，回落到 Polaris token：
  ```css
  /* ❌ 删除这类 */
  .cta { background:#008060; }
  /* ✅ 让 s-button variant="primary" 自己继承 --p-color-bg-fill-brand */
  ```
- 全局搜索：`#008060`、`008060`、`background.*green`、`--dl-brand`（品牌橙 `#D86A2A` 也不能当主按钮）。
**自测**：主按钮肉眼为深色；DevTools 查 computed background = `rgb(48,48,48)`（hover `rgb(26,26,26)`）。

---

## ② 4.1.1 文字对比度（WCAG AA 4.5:1）

**问题**：部分文字/背景对比不足。
**判据**：正文类文字与背景 ≥ 4.5:1。
**怎么改**：
- 正文 `--p-color-text`（`#303030`）、次要 `--p-color-text-secondary`（`#616161`），**别用 `#8c9196`**（3.4:1）。
- 按钮/卡片/导航文字统一用 token，别自定义浅灰。
- 逐对核对见 [wcag-contrast.md](wcag-contrast.md)。
**自测**：Chrome DevTools → 选中文字 → Accessibility → Contrast，或用 [wcag-contrast.md](wcag-contrast.md) 的公式/工具。

---

## ③ 4.1.2 移动端

**问题**：移动端间距/排版未优化。
**判据**：无横向滚动、内容不挤压、触控目标 ≥ 44px。
**怎么改**：
- 多列布局用 `s-grid` 并允许窄屏堆叠；容器用 `s-stack` 控制 gap（token 化间距）。
- 页面水平内边距移动端 16px。
- 图表/表格在窄屏可横向滚动容器内，别撑破视口。
- 详见 [../03-patterns/mobile.md](../03-patterns/mobile.md)。
**自测**：`shopify app dev` + DevTools 设备模拟（iPhone/375px）；逐页翻。

---

## ④ 4.1.3 App 名截断

**问题**："Deeplumen: AI SEO Optimizer" 太长，unpin 后被 `…` 截断。
**判据**：导航中完整可见、不截断。
**怎么改**（Partner Dashboard，不改代码）：
- 换更短的显示名，例如 **"Deeplumen SEO"** 或 **"Deeplumen"**。
- 位置：Partner Dashboard → Apps → 你的 App → **Distribution / App listing** 及 `shopify.app.toml` 的 `name`。
- 步骤详见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。
**自测**：桌面 Admin 左侧导航 unpin 后名字无 `…`。

---

## ⑤ 4.1.4 导航指向首页

**问题**：App 名与首页跳转分离 / 有重复的首页导航项。
**判据**：点 App 名直接进首页；`App URL` = 首页路由。
**怎么改**（Partner Dashboard）：
- Configuration → URLs → **App URL** 设为首页（如 `https://<host>/app` 或 `/app/home`）。
- 去掉 `s-app-nav` 里与「App 名/首页」重复的多余首页项（若有）。
- 步骤详见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。
**自测**：点左侧 App 名 → 落在首页，不是空白/二跳。

---

## ⑥ 4.2.4 错误信息

**问题**：字段出错只标红、无文案。
**判据**：每个错误字段旁有清晰、可行动的文案。
**怎么改**：
- 用组件的 error 槽/属性给出文案，而非只改边框色：
  ```html
  <!-- ✅ Web Components -->
  <s-text-field label="Email" error="请输入有效的邮箱地址，例如 name@store.com"></s-text-field>
  ```
  ```jsx
  /* ✅ Polaris React 对照 */
  <TextField label="Email" error="请输入有效的邮箱地址，例如 name@store.com" />
  ```
- 文案要说清**哪里错 + 怎么改**。
- 详见 [../02-components/forms-fields.md](../02-components/forms-fields.md)。
**自测**：每个校验分支都触发一次，确认都有文字提示。

---

## ⑦ 4.3.3 禁止自动弹窗

**问题**：页面加载/延时/无关操作自动弹 modal/popover。
**判据**：弹窗只由主动点击触发。
**怎么改**：
- 删除 `useEffect(()=>{ open() }, [])`、定时 `setTimeout(open, ...)` 之类的自动打开逻辑。
- 引导/公告改用**页面内 Banner**（`s-banner`），不用弹窗。
- 详见 [../02-components/modals.md](../02-components/modals.md) 与 [../02-components/banners.md](../02-components/banners.md)。
**自测**：进每个页面静置 30s，确认不自动弹任何浮层。

---

## ⑧ 4.3.3 红色滥用

**问题**：红色用在非错误/非破坏性场景。
**判据**：红色仅限错误信息 & 破坏性操作。
**怎么改**：
- 全 App 搜红色：`#c70a24`、`#e22c38`、`critical`、`red`、`#d00`、`#ff0000` 等。
- 非错误的红色改为中性 `--p-color-text` / 强调蓝 `--p-color-text-emphasis`。
- 删除按钮/错误保留红（`tone="critical"`）。
- 详见 [../03-patterns/color-usage.md](../03-patterns/color-usage.md)。
**自测**：全页扫一遍，红色只出现在错误与删除处。

---

## 整改顺序建议

1. 先做 **①②⑥⑦⑧**（代码，改起来快、影响大）。
2. 再做 **③④**（Partner Dashboard 配置）。
3. 最后 **③(名)/⑤** 配置生效后，桌面 + 移动**逐页复核**（含 ⑥ 移动端）。
4. 全绿 → 跑 [pre-submission-checklist.md](pre-submission-checklist.md) → 重新提交。
