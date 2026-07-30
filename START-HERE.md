# Start Here — Shopify App 官方开发流程

> 本文件是 ISO 仓库的唯一开发入口。新 App、重大功能和 BFS 整改都从这里开始。
> ISO 把 Shopify 官方要求转成团队可执行流程；若本仓与 Shopify 最新文档或 Dev Dashboard 冲突，以官方信息为准并回补本仓。
> AI 协作统一调用 `$shopify-app-iso`；严格 BFS 任务必须在工作过程中逐条对齐 requirement ID、状态与证据，而不是开发结束后一次性核对。

## 0. 先确认要构建哪种 App

先选形态，再生成代码。不要先装 UI 包或复制旧项目。

| 场景 | 官方起点 | 适用范围 |
|---|---|---|
| 大多数公开 App；需要后端、多页面、webhook 或完整浏览器能力 | **React Router 模板 + App Home iframe** | 默认选择 |
| 无后端、体积小、仅 custom distribution | **Extension-only + App Home UI extension** | 受 Preact、64 KB 和能力范围限制 |
| 只连接现有系统、只需 API 凭证、没有内嵌 UI | **Dev Dashboard 创建 App** | 不需要 App Home |

官方依据：

- [Scaffold an app](https://shopify.dev/docs/apps/build/scaffold-app)
- [Apps in App Home](https://shopify.dev/docs/apps/build/app-home)
- [Libraries and templates](https://shopify.dev/docs/api/libraries-and-templates)

本流程以下以 Shopify 推荐给大多数 App 的 **React Router + iframe** 为主。

## 1. 开发全流程与阶段门

| 阶段 | 要完成什么 | 通过条件 |
|---|---|---|
| 0. 资格预检 | 分发、商业模式、Partner/API 条款、App Store 与 BFS 类别 | 无禁止模式；两套类别和收费/权限路线有书面结论 |
| 1. 定义 | 明确商家问题、主流程、数据、分发方式和 App 类别 | 范围、类别、权限与主流程有书面结论 |
| 2. 准备 | 开发权限、dev store、Node、Shopify CLI | CLI 可登录，开发者有 dev store 访问权 |
| 3. 起手 | 用最新官方模板创建并安装基线 App | `shopify app dev` 可在 Admin 内打开 |
| 4. 架构 | 确定路由、Patterns、scopes、数据与 webhook | 首页和主流程设计完成，最小权限明确 |
| 5. 实现 | 按一个完整垂直流程开发 | 正常、加载、空、错误和权限状态都可用 |
| 6. 验证 | 自动检查、桌面、移动、键盘、性能和真店流程 | 所有适用检查有证据，无已知阻断问题 |
| 7. 发布 | 托管 Web App，发布配置与 extensions | 生产 URL、数据库、secrets 和 app version 可回滚 |
| 8. 分发/BFS | App Store 要求、BFS 要求和 Dashboard 状态 | 所有适用项通过后才提交审核 |

任何阶段未通过，不进入下一阶段。BFS 不是最后补样式，而是从阶段 1 起持续约束产品、架构和实现。

## 2. 阶段 0：资格与政策预检

写代码前完成 go/no-go：

1. 确认 public/custom distribution；BFS 只在满足其资格的分发与 App 状态下申请。
2. 阅读 [App Store 前置要求](00-built-for-shopify/app-store-requirements.md)，排除禁止/受限商业模式、绕过 Shopify Checkout、站外 App 收费、激励评价等问题。
3. Partner Account 无 active/outstanding infraction，并遵守 Partner Program Agreement 与 Shopify API License and Terms of Use。
4. 分别判断 **App Store 11 类**与 **BFS 14 类**；一个 App 可同时命中多个类别，两套适用项取并集。
5. 确定收费路线、最小/optional scopes、受保护客户数据级别、buyer optional charge 和安装 eligibility。
6. 在 Dev Dashboard → Distribution 查看自动评估前置项；未达 50 个付费活跃店净安装、5 条评价和当前评分门槛时，可以继续开发，但不能把 BFS 标记为可申请。

验收门：商业模式、收费、权限、数据和两套类别均有书面结论；任何禁止项或未获授权的受限能力先解决，不进入开发。

## 3. 阶段 1：定义 App

开发前记录以下内容：

- **商家问题**：一句话说明为谁解决什么问题。
- **主流程**：商家安装后完成核心价值的最短路径。
- **首页价值**：状态、待办、关键指标和下一步动作。
- **Shopify 数据**：要读写的资源、字段和保留期限。
- **最小权限**：只申请主流程必需的 access scopes。
- **App 类别**：分别记录 App Store 类别与 BFS 类别，类别会决定不同的专属要求。
- **扩展面**：App Home、Admin、Theme、Checkout、Customer Account、Flow、Web Pixel 等。
- **分发方式**：public 或 custom distribution。

验收门：不能说明“为什么需要该 scope、扩展或外部服务”的内容，不进入实现。

相关规范：

- [安全与受保护客户数据](05-engineering/security-data.md)
- [品类专属要求](05-engineering/category-specific.md)
- [集成要求](05-engineering/integration.md)

## 4. 阶段 2：准备环境

必需条件：

- Shopify 开发权限。
- 自己可访问的 dev store；团队成员应使用各自的 dev store 隔离预览。
- 最新 Shopify CLI 支持的 Node.js。当前 CLI 要求 `>=22.12.0`。
- 最新 Chrome 或 Firefox。

先检查，不要在用户主目录 `~` 安装 App 依赖：

```bash
node --version
shopify version
```

版本与安装策略见 [tooling.md](tooling.md)。

验收门：开发者能登录 Shopify CLI，能在 Dev Dashboard 看到自己的 dev store。

## 5. 阶段 3：创建可运行基线

在准备存放项目的父目录执行：

```bash
shopify app init
```

按提示输入名称，并选择 **Build a React Router app**。然后进入 CLI 新建的项目目录：

```bash
cd <app-directory>
shopify app dev
```

服务启动后按 `p`，在 dev store 安装并打开 App。

依赖只能安装在含该 App `package.json` 的项目目录：

```bash
cd <app-directory>
npm install <package>
```

不要执行 `cd ~ && npm install ...`。全局或主目录安装不会让 App 获得依赖，还会污染无关的 `package.json` 和审计结果。

验收门：

- App 在 Shopify Admin 内嵌打开，不是独立外站。
- 模板首页可加载，终端与浏览器没有阻断错误。
- `shopify.app.toml` 已连接正确的开发 App。
- 初始代码和 lockfile 已提交到真实 App 仓库。

详细说明见 [scaffold/README.md](scaffold/README.md)。

## 6. 阶段 4：先做架构，再画组件

### 5.1 页面先选官方 Pattern

页面结构的优先级：

1. [App Home Templates](https://shopify.dev/docs/api/app-home/patterns)：Homepage、Index、Details、Settings。
2. 官方 Compositions：Setup guide、Metrics card、Index table、Empty state 等。
3. [Polaris Web Components](https://shopify.dev/docs/api/app-home/web-components)。
4. 仅在官方组件无法表达时使用自定义 HTML/CSS。

官方 Patterns 已组合布局、Web Components 和 API，能更接近开箱满足相关 BFS 设计要求。只安装组件类型、逐个拼 `s-*` 标签，并不等于页面设计合规。

新商家首次体验使用当前 [Setup guide composition](https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide)，并按 [onboarding 规范](03-patterns/onboarding.md) 验证 BFS 4.2.2 的六条拒审条件。

### 5.2 分清三类能力

| 位置 | 使用什么 | 示例 |
|---|---|---|
| App iframe 内部 | Polaris Web Components | `s-page`、`s-section`、`s-button`、表单和表格 |
| Admin chrome | App Bridge Web Components / APIs | title bar、nav menu、save bar、toast、modal |
| 数据与工作流 | GraphQL Admin API / App Home APIs | 资源读取、picker、intent、authenticated fetch |

新项目不得以已弃用的 `@shopify/polaris` React 组件库作为默认 UI。`@shopify/polaris-types` 只提供 TypeScript 类型，Polaris Web Components 的运行时代码由官方 CDN 加载；最新 CLI 模板通常已经配置。

### 5.3 同时确定技术契约

- 路由与返回路径。
- `shopify.app.toml` 的最小 scopes、webhooks 和 API version。
- 使用模板认证能力，不自建一套重复 OAuth/session 逻辑。
- 新功能使用 GraphQL Admin API，不新增 REST Admin API 调用。
- 数据模型、同步方向、幂等、重试、卸载清理与隐私删除流程。
- 主流程留在 Shopify 内；第三方连接设置也要能在 App 内管理。

验收门：每个页面都能对应一个 Pattern 或说明偏离理由；每项权限、数据和外部跳转都有必要性。

## 7. 阶段 5：按完整垂直流程实现

不要一次铺开所有页面。先完成一个从 UI 到 Shopify API/数据库的主流程：

1. 通过 `authenticate.admin(request)` 或模板提供的等价能力认证请求。
2. 用 GraphQL Admin API 读取或写入最小字段集。
3. 用官方 Pattern 和 Web Components 呈现。
4. 提供加载、空数据、成功、错误、无权限和重试状态。
5. 表单提供字段级可行动错误；需要保存的设置使用 contextual save bar。
6. 异步动作防重复提交，webhook 处理验签、幂等和失败恢复。
7. 记录必要日志，但不记录 access token、客户敏感数据或 secrets。

完成一个流程后，再复制经过验证的结构开发下一个流程。

相关规范：

- [认证](05-engineering/authentication.md)
- [GraphQL API 使用](05-engineering/api-usage.md)
- [Webhook 与合规](05-engineering/webhooks-compliance.md)
- [错误与反馈](03-patterns/errors-and-feedback.md)
- [组件规范](02-components/)

验收门：不能只演示 happy path；错误、空状态、移动端和键盘操作必须同时可验证。

## 8. 阶段 6：持续验证

### 7.1 每次合并前

使用 App 项目自身 `package.json` 中定义的脚本。当前官方 React Router 模板包含：

```bash
npm run lint
npm run typecheck
npm run build
```

有测试脚本时同时运行测试。不要用“本地能打开”替代 lint、类型检查和生产构建。

### 7.2 在 dev store 验证

```bash
shopify app dev
```

至少覆盖：

- 桌面与 Shopify 移动端真机。
- 375px 窄屏，无整页横向滚动和不可访问内容。
- 键盘 Tab、焦点、Esc、modal 焦点回归。
- 所有表单错误、空状态、loading 和失败重试。
- 安装、更新 scopes、卸载、重装和合规 webhooks。
- 首页状态、核心指标和主流程。
- Partner Dashboard 中 Web Vitals 与适用自动检查。

详细步骤见 [本地真机自测](00-built-for-shopify/local-self-test.md)。

验收门：检查结果有可复现步骤或截图；“目测差不多”不算通过。

## 9. 阶段 7：部署与发布

React Router iframe App 包含两个不同发布对象，必须分别处理：

1. **Web App**：代码、数据库和服务器部署到自己的 hosting provider。
2. **Shopify app version**：`shopify.app.toml` 配置和 extensions 通过 Shopify CLI 发布。

`shopify app deploy` **不会部署 Web App 服务器**。

生产发布前：

1. 用 `shopify app config link` 建立独立生产配置。
2. 配置生产 `SHOPIFY_APP_URL`、数据库和 secrets；绝不提交 secret。
3. 执行 `npm ci`、`npm run build`、数据库 migration/setup。
4. 先部署 Web App 并验证健康检查、日志和数据库。
5. 用 `shopify app deploy --no-release` 创建未发布版本并复核。
6. 确认 URL、redirect URL、scopes、webhooks 和 extensions 后再 release。
7. 保留上一 app version 和 Web App 版本的回滚方式。

官方依据：

- [Deploy to a hosting service](https://shopify.dev/docs/apps/launch/deployment/deploy-to-hosting-service)
- [Deploy app versions](https://shopify.dev/docs/apps/launch/deployment/deploy-app-versions)

验收门：生产环境完成安装、核心流程、webhook、卸载与回滚演练。

## 10. 阶段 8：先过 App Store，再申请 Built for Shopify

先满足 App Store/分发要求，再申请 BFS。完整资格是两层门禁：App Store requirements **174 条**，再加 BFS requirements **77 条**。BFS 还包含自动评估项、Partner 状态、商家效用、性能、集成、设计和类别专属要求，不是单纯的 UI 审核。

提交前必须同时检查：

- Dev Dashboard / Distribution 页面列出的当前适用项。
- [App Store 174 条前置要求与类别路由](00-built-for-shopify/app-store-requirements.md)。
- [官方 Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements)。
- [本仓 77 条官方要求总矩阵](00-built-for-shopify/official-requirements-matrix.md)。
- [App Store + BFS 逐项合规证据账本](00-built-for-shopify/requirements-ledger.md)。
- [BFS 状态生命周期](00-built-for-shopify/status-lifecycle.md)。
- [本仓 BFS 设计与体验清单](00-built-for-shopify/pre-submission-checklist.md)。
- [Engineering BFS 技术骨架](05-engineering/README.md)。
- App 类别对应的专属要求。

只有具有 **Manage apps** 权限的成员可提交 BFS。相同 criterion 连续失败 3 次会暂停申请 3 个月；获得 BFS 后仍会持续监控人工和自动 criteria，并有年度复核。不再达标时通常有 60 天整改，重新满足全部 criteria 后会自动恢复 BFS，但 Shopify 仍可能复查人工 criteria 和当前 App Store requirements。因此规范检查必须进入日常发布循环，而不是一次性提交动作。

收到拒审后，把原文、条款、页面/代码位置、整改、验证证据和复审结果记录下来。不要只改截图中的单个页面；同类问题要全 App 搜索并建立自动或人工检查门。

验收门：只有 Dashboard 当前适用项与本仓适用检查都通过，才提交审核。

## 11. 日常开发循环

每个功能都按同一小循环执行：

1. 明确商家任务和验收条件。
2. 选官方 Pattern、API 和组件。
3. 完成最小的端到端流程。
4. 补齐所有状态、移动端与可访问性。
5. 跑 lint、typecheck、build 和测试。
6. 在 dev store 完成桌面与移动验证。
7. 功能变化后重新判断 App Store/BFS 类别、listing 声明、scopes 与收费影响。
8. 更新 ISO、设计稿或拒审记录中受影响的规范。

这条循环通过后，功能才算完成。
