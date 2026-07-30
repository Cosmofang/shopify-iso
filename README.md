# Shopify ISO — Shopify App 开发与 Built for Shopify 规范库

> **ISO = Shopify App 内部开发与设计标准。**
> 这是团队执行 Shopify App 开发与审核要求的统一入口，不替代 Shopify 官方文档。
> 若本仓与 Shopify 最新文档或 Dev Dashboard 冲突，以官方信息为准并更新本仓。

## 第一次进入仓库

从 **[START-HERE.md](START-HERE.md)** 开始。它按官方推荐顺序覆盖：

1. 选择 App 形态与分发方式。
2. 用 Shopify CLI 和 React Router 官方模板建立可运行基线。
3. 用 App Home Patterns 设计页面，再用 Polaris Web Components 实现。
4. 接入认证、GraphQL、webhook、数据与完整状态。
5. 完成自动检查、dev store 桌面/移动验证、部署、分发与 BFS 审核。

不要先从组件页挑样式，也不要在 `~` 目录安装 App 依赖。

---

## 为什么有这个库

本仓把 Shopify App Store requirements、Built for Shopify requirements、当前实现文档和 Dev Dashboard 证据要求组织成一套通用审核体系。它不绑定某个 App 或某次拒审；任何 Shopify App 都按相同的 requirement ID、适用性、证据和生命周期规则执行。

同一 BFS criterion 连续失败 3 次会暂停申请 3 个月，获得 BFS 后也会持续监控和年度复审。因此审核必须覆盖完整要求和整个 App，不能只修 reviewer 截图中的示例。

---

## 规范索引

### 00 · Built for Shopify 合规
- [official-requirements-full.md](00-built-for-shopify/official-requirements-full.md) — **官方全文快照：77 条要求原文 + §4 全部 63 条拒审理由**（引用与指纹比对基准）
- [app-store-requirements.md](00-built-for-shopify/app-store-requirements.md) — **BFS 1.1.1 前置：App Store 174 条、两套类别与阶段门**
- [official-requirements-matrix.md](00-built-for-shopify/official-requirements-matrix.md) — **官方 77 条叶子要求总矩阵：编号、ISO 落点、验证证据**
- [requirements-ledger.md](00-built-for-shopify/requirements-ledger.md) — **App Store + BFS 联合逐项账本：适用性、工作项、证据与状态**
- [status-lifecycle.md](00-built-for-shopify/status-lifecycle.md) — **BFS 申请、持续监控、失效、自动恢复与权益边界**
- [linked-official-sources.md](00-built-for-shopify/linked-official-sources.md) — BFS 正文 59 个开发文档目标 + 外部治理来源审读台账
- [requirements.md](00-built-for-shopify/requirements.md) — BFS Section 4 设计/UX 条款及 pass/fail 判据
- [wcag-contrast.md](00-built-for-shopify/wcag-contrast.md) — WCAG 2.1 AA 对比度规则 + Polaris 达标色对照
- [pre-submission-checklist.md](00-built-for-shopify/pre-submission-checklist.md) — **BFS 设计/体验提交前清单**
- [local-self-test.md](00-built-for-shopify/local-self-test.md) — `shopify app dev` 本地真机自测（桌面 + 移动 QR）

### 01 · Foundations 基础
- [color.md](01-foundations/color.md) — 已完整审读 Polaris 颜色四页：原则、13 类角色、元素配对、token/交互状态
- [typography.md](01-foundations/typography.md) — 字号 / 字重 / 行高 / text variants
- [space-radius-shadow.md](01-foundations/space-radius-shadow.md) — 间距 / 圆角 / 边框 / 阴影
- [layout-responsive.md](01-foundations/layout-responsive.md) — 页宽 / 断点 / 移动端

### 02 · Components 组件（每个都含 ✅Do ❌Don't + 代码）
- [buttons.md](02-components/buttons.md) · [forms-fields.md](02-components/forms-fields.md) · [cards-sections.md](02-components/cards-sections.md)
- [banners.md](02-components/banners.md) · [toasts.md](02-components/toasts.md) · [modals.md](02-components/modals.md)
- [badges.md](02-components/badges.md) · [tables.md](02-components/tables.md) · [navigation.md](02-components/navigation.md)
- [charts-dataviz.md](02-components/charts-dataviz.md) — 图表/数据可视化（纯 CSS/SVG，Polaris 无图表组件）+ 品牌 logo + token 兜底坑

### 03 · Patterns 模式
- [onboarding.md](03-patterns/onboarding.md) — BFS 4.2.2 六条硬判据 + 当前 Setup guide composition + 状态/验收证据
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
- [frontend-code-conventions.md](05-engineering/frontend-code-conventions.md) — 前端代码约定(⚠️ 非官方,从真实代码提炼)

### 06 · Polaris React 历史手册与当前映射
- [手册入口](06-polaris-react-handbook/README.md) — 归档 Polaris React 的完整本地索引、状态边界与阅读路线
- [基础与设计语言](06-polaris-react-handbook/02-foundations-and-design.md) — Foundations/Design 40 个来源的原则与当前边界
- [组件目录](06-polaris-react-handbook/components/README.md) — 110 个组件来源的 React → 当前 Shopify 映射
- [Tokens、Icons 与工具](06-polaris-react-handbook/06-tokens-icons-tools.md) — 归档 token/icon/tooling 的用途与风险
- [遗留 React 维护](06-polaris-react-handbook/07-legacy-react-maintenance.md) — 版本迁移、验证与退役流程
- [当前 Shopify 映射](06-polaris-react-handbook/08-current-shopify-mapping.md) — App Home、59 个 Web Components 与 App Bridge 的选择边界
- [来源治理](06-polaris-react-handbook/09-source-governance.md) — 260 个源码文件与 243 个官网路径的覆盖口径

### assets · 可执行资产
- [polaris-tokens.css](assets/polaris-tokens.css) — 9.4.2 历史快照，仅供现有自定义 Zone B/迁移校验；新 App 不直接导入
- [design-tokens.json](assets/design-tokens.json) — 同版本机器可读历史快照（遗留 Figma / 校验），不是当前 Web Components 视觉合同

### figma · 可视化组件库
- [deeplumen组件库](https://www.figma.com/design/wVNe7Qn7SOuWjarWLQJfqj/deeplumen%E7%BB%84%E4%BB%B6%E5%BA%93?node-id=491-51&p=f&t=cGffKO7V0Ryy7sAJ-0) — Deeplumen 官方 Figma 组件库（Components 页面）
- [figma/LINK.md](figma/LINK.md) — 组件库入口、覆盖范围与使用约定

### tooling · 官方工具链（版本快照 + 校验）
- [tooling.md](tooling.md) — 官方 CLI / 模板 / App Bridge / Polaris / stylelint 清单（版本 + 用途 + 链接）
- [scaffold/README.md](scaffold/README.md) — 官方脚手架起手（`shopify app init` + 版本原则 + 结构↔标准映射）
- [scripts/verify-tokens.mjs](scripts/verify-tokens.mjs) — 拉官方 `@shopify/polaris-tokens` 自动 diff 库，防漂移（CI 关卡）
- [scripts/verify-polaris-color-guidance.mjs](scripts/verify-polaris-color-guidance.mjs) — 校验四个 Polaris 颜色原始 MDX 的全文指纹，变更即要求重新审读
- [scripts/verify-bfs-requirements.mjs](scripts/verify-bfs-requirements.mjs) — 校验官方指纹、本地 77 条正文与 §4 全部 63 条拒审理由；网络不可用时支持 `--local-only`
- [scripts/verify-app-store-requirements.mjs](scripts/verify-app-store-requirements.mjs) — 校验 App Store 174 条数量、section 分布与全文指纹
- [scripts/build-requirements-ledger.mjs](scripts/build-requirements-ledger.mjs) — 按两套 Section 5 类别生成 App Store + BFS 联合证据账本
- [scripts/audit-bfs-linked-sources.mjs](scripts/audit-bfs-linked-sources.mjs) — 人工复核 BFS 正文全部 Shopify 开发文档链接
- [scripts/verify-links.mjs](scripts/verify-links.mjs) — 校验仓库内 Markdown 相对链接
- [scripts/verify-polaris-react-handbook.mjs](scripts/verify-polaris-react-handbook.mjs) — 校验 260 个手册来源、章节落点、源码 hash 与 121/534/59 系统清单
- [.github/workflows/verify-iso.yml](.github/workflows/verify-iso.yml) — push / PR / 每周自动运行全部规范校验
- [.stylelintrc.json](.stylelintrc.json) — 现有 Zone B 的 `@shopify/stylelint-polaris` 配置，挡写死 hex

---

## 技术基线

- 大多数新 App 使用 Shopify 推荐的 **React Router + App Home iframe**。
- 页面先使用官方 **App Home Patterns**，再使用 **Polaris Web Components（`s-*`）**。
- Web Components 由 Shopify CDN 保持最新；`@shopify/polaris-types` 仅提供 TypeScript 类型。
- `@shopify/polaris` React 组件库已弃用，只保留遗留代码对照，不作为新开发基线。
- 嵌入式 App（`embedded = true`）：顶栏/搜索/面包屑由 Shopify Admin 提供，**不要自绘 Shopify chrome**。

## 使用方式

1. **开始开发**：按 [START-HERE.md](START-HERE.md) 逐阶段通过验收门。
2. **页面设计**：先选官方 Pattern，再查 `01-foundations`、`02-components` 和 `03-patterns`。
3. **功能完成**：跑 App 仓的 lint、typecheck、build、测试和 dev store 真机验证。
4. **提交审核**：同时检查 Dev Dashboard、官方 BFS requirements 和本仓清单。
5. **AI 协作**：调用 `$shopify-app-iso`。规范只有一套；普通开发按相关章节执行，严格 BFS 工作则在计划、实现和验证过程中逐条维护 requirement ID 与证据。

### Shopify App ISO Skill

- Skill 源码：[skills/shopify-app-iso/SKILL.md](skills/shopify-app-iso/SKILL.md)。
- 普通开发示例：`使用 $shopify-app-iso 开发这个 Shopify App 功能`。
- 严格审核示例：`使用 $shopify-app-iso 严格执行 BFS 整改`。
- 严格模式会同时覆盖 App Store requirements 与 BFS requirements，先判断两套 Section 5 类别，再生成逐条合规台账。
- Skill 只是执行入口；本仓仍是唯一规范源，不能在 Skill 中维护另一份 token 或条款副本。

## 信息源与同步关系

| 位置 | 角色 |
|------|------|
| Shopify 官方文档 / Dev Dashboard | **外部真相源**，有冲突时优先 |
| GitHub `Cosmofang/shopify-iso` | **团队执行源**（公开） |
| 本地 `shopify iso/` | 团队执行源本地副本（=GitHub 仓库工作区） |
| `shopify/design-standards/` | 镜像，供各 App 开发时就近查阅 |
| `skills/shopify-app-iso/` | Skill 源码与严格 BFS 执行器，跟随本仓版本管理 |
| `~/.agents/skills/shopify-app-iso` | 本机发现入口，符号链接到本仓 Skill 源码 |

> Shopify 规则变化时先更新 GitHub 团队执行源，再同步下游镜像与技能。
