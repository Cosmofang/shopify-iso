# Shopify ISO — Polaris + Built for Shopify 设计规范库

> **ISO = 内部设计标准（Internal Standard for shopify apps）。**
> 这是所有 Shopify App 设计与开发必须遵循的**唯一权威规范源**。
> 目标：任何页面/组件在提交 **Built for Shopify（BFS）** 徽章审核前，逐条对得上这里的标准，一次过审。

---

## 为什么有这个库

App **Deeplumen: AI SEO Optimizer** 提交 BFS 审核被打回，8 条问题全部是「设计不符合 Shopify 规范」。与其一条条被动整改，不如**先立标准**——以后所有设计按此制作，从源头不踩坑。

⚠️ Shopify 警告：**反复提交但没真正修好，可能导致 App 临时冻结。** 所以「提交前对照 [提交前清单](00-built-for-shopify/pre-submission-checklist.md) 逐条打勾」是硬性流程。

---

## 目录导航

### 00 · Built for Shopify 合规（先看这个）
- [requirements.md](00-built-for-shopify/requirements.md) — 完整 BFS 条款清单，逐条 pass/fail 判据
- [rejection-2026-fixes.md](00-built-for-shopify/rejection-2026-fixes.md) — 本次被打回的 8 条 → 逐条整改方案
- [wcag-contrast.md](00-built-for-shopify/wcag-contrast.md) — WCAG 2.1 AA 对比度规则 + Polaris 达标色对照
- [pre-submission-checklist.md](00-built-for-shopify/pre-submission-checklist.md) — **提交前逐条打勾清单**
- [local-self-test.md](00-built-for-shopify/local-self-test.md) — `shopify app dev` 本地真机自测（桌面 + 移动 QR）

### 01 · Foundations 基础
- [color.md](01-foundations/color.md) — 颜色 token 与语义用途
- [typography.md](01-foundations/typography.md) — 字号 / 字重 / 行高 / text variants
- [space-radius-shadow.md](01-foundations/space-radius-shadow.md) — 间距 / 圆角 / 边框 / 阴影
- [layout-responsive.md](01-foundations/layout-responsive.md) — 页宽 / 断点 / 移动端

### 02 · Components 组件（每个都含 ✅Do ❌Don't + 代码）
- [buttons.md](02-components/buttons.md) · [forms-fields.md](02-components/forms-fields.md) · [cards-sections.md](02-components/cards-sections.md)
- [banners.md](02-components/banners.md) · [toasts.md](02-components/toasts.md) · [modals.md](02-components/modals.md)
- [badges.md](02-components/badges.md) · [tables.md](02-components/tables.md) · [navigation.md](02-components/navigation.md)
- [charts-dataviz.md](02-components/charts-dataviz.md) — 图表/数据可视化（纯 CSS/SVG，Polaris 无图表组件）+ 品牌 logo + token 兜底坑

### 03 · Patterns 模式
- [color-usage.md](03-patterns/color-usage.md) — 红色只用于错误/破坏性
- [mobile.md](03-patterns/mobile.md) — 移动端适配清单
- [errors-and-feedback.md](03-patterns/errors-and-feedback.md) — 错误/成功/加载反馈统一模式
- [anti-patterns.md](03-patterns/anti-patterns.md) — 禁忌集
- [animation.md](03-patterns/animation.md) — 动效（rAF/CSS，SSR 安全 + reduced-motion + 跑马灯/连接线/自适应挤压）

### 04 · Partner Dashboard 配置（改后台，不改代码）
- [config.md](04-partner-dashboard/config.md) — App 名不截断（4.1.3）+ 导航指向首页（4.1.4）

### 05 · Engineering 工程/代码规范（对齐官方开发文档）
- [05-engineering/README.md](05-engineering/README.md) — 章索引 + BFS 技术骨架(1/2/3/5)
- [authentication.md](05-engineering/authentication.md) — Session token / token exchange / 托管安装
- [api-usage.md](05-engineering/api-usage.md) — GraphQL Admin API / 速率限制 / bulk / 版本
- [webhooks-compliance.md](05-engineering/webhooks-compliance.md) — 强制合规 webhook(GDPR)+ HMAC
- [performance.md](05-engineering/performance.md) — Web Vitals 门槛 LCP/CLS/INP(BFS 2)
- [security-data.md](05-engineering/security-data.md) — 受保护客户数据 L0/1/2 + 最小 scopes
- [code-quality.md](05-engineering/code-quality.md) — ESLint / Prettier / stylelint / tsconfig / codegen
- [integration.md](05-engineering/integration.md) — 嵌入 / 主流程留 Shopify / 干净卸载(BFS 3)
- [category-specific.md](05-engineering/category-specific.md) — 品类专属技术要求(BFS 5)

### assets · 可执行资产
- [polaris-tokens.css](assets/polaris-tokens.css) — 全部 `--p-*` 变量，可直接 `@import`
- [design-tokens.json](assets/design-tokens.json) — 机器可读 token（Figma / 校验）

### figma · 可视化组件库
- [figma/LINK.md](figma/LINK.md) — Figma Polaris+BFS 组件库文件链接

### tooling · 官方工具链（pin 版本 + 校验）
- [tooling.md](tooling.md) — 官方 CLI / 模板 / App Bridge / Polaris / stylelint 清单（版本 + 用途 + 链接）
- [scaffold/README.md](scaffold/README.md) — 官方脚手架起手（`shopify app init` + pin + 结构↔标准映射）
- [scripts/verify-tokens.mjs](scripts/verify-tokens.mjs) — 拉官方 `@shopify/polaris-tokens` 自动 diff 库，防漂移（CI 关卡）
- [.stylelintrc.json](.stylelintrc.json) — 官方 `@shopify/stylelint-polaris` 配置，挡写死 hex

---

## 技术前提

- 目标 App 使用 **Polaris Web Components（`s-*` 标签）**，非 Polaris React。
  代码示例**以 `s-*` 为主**，关键组件附 **Polaris React 对照**。
- Polaris 版本基准：**v14+**（token 来源 https://polaris-react.shopify.com/tokens ）。
- 嵌入式 App（`embedded = true`）：顶栏/搜索/面包屑由 Shopify Admin 提供，**不要自绘 Shopify chrome**。

## 使用方式

1. **设计前**：读 `01-foundations` + 相关 `02-components`，用 token，别写死颜色。
2. **设计中**：对照组件页的 ✅Do ❌Don't。
3. **提交前**：跑一遍 [提交前清单](00-built-for-shopify/pre-submission-checklist.md)。
4. **AI 协作**：本库同步进 `shopify-polaris` skill；在任意 Shopify 项目里触发「polaris 规范 / BFS 检查」即可调用。

## 三处同步关系

| 位置 | 角色 |
|------|------|
| GitHub `Cosmofang/shopify-iso` | **权威源**（公开） |
| 本地 `shopify iso/` | 权威源本地副本（=GitHub 仓库工作区） |
| `shopify/design-standards/` | 镜像，供各 App 开发时就近查阅 |
| `~/.claude/skills/shopify-polaris` | 精简版 + BFS 规则，供 AI 跨项目调用 |

> 改规范只改**权威源**，再同步下游。
