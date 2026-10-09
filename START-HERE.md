# Start Here — Shopify App 官方开发流程

> 文档版本：`1.3.1`
> 最后修改：`2026-10-09 10:45 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[Shopify developer documentation](https://shopify.dev/docs) · [Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Polaris Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) · [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) · [Admin new look rollout](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look) · [React Router official template](https://github.com/Shopify/shopify-app-template-react-router/blob/main/package.json) · [React → Web Components migration](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react)
>
> 本文件是 ISO 仓库的唯一开发入口。新 App、重大功能和 BFS 整改都从这里开始。
> ISO 把 Shopify 官方要求转成团队可执行流程；若本仓与 Shopify 最新文档或 Dev Dashboard 冲突，以官方信息为准并回补本仓。
> AI 协作统一调用 `$shopify-app-iso`；严格 BFS 任务必须在工作过程中逐条对齐 requirement ID、状态与证据，而不是开发结束后一次性核对。

## 硬性来源门

任何设计、开发、审核或 ISO 修改都先执行 [官方来源与版本追踪规则](SOURCE-GOVERNANCE.md)：找到具体官方页面，打开并核实当前内容，记录 requirement ID 或 API/component URL，再开始修改。Reviewer 反馈、项目代码、另一份调研和 Agent 结论只能用于发现问题，不能替代官方依据。

写入规范时必须区分官方硬要求、官方指导/API 合同、ISO 保守基线和 App 项目证据。所有修改过的规范文档都要更新顶部版本、修改时间、最后修改者和本次官方来源。

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

新项目不得以已弃用的 `@shopify/polaris` React 组件库作为默认 UI。生产 App Home 使用单一稳定 Polaris build：推荐 `https://cdn.shopify.com/shopifycloud/polaris-1.js`；需要可复现构建时固定 `polaris-1.1.js`，并对齐 `@shopify/polaris-types@~1.1.0`。`@shopify/polaris-types` 只提供 TypeScript 类型，运行时由 CDN 加载；App Bridge 使用独立的 `https://cdn.shopify.com/shopifycloud/app-bridge.js`，不与 Polaris 一起版本化。React Router 模板要固定 CDN 版本时，必须同时在 `AppProvider.polarisUrl` 和服务端 `shopifyApp({polarisUrl})` 设置同一 URL，并使用官方要求的 `@shopify/shopify-app-react-router` 2.1.0 或更高版本；否则保持模板默认的稳定 channel。

Polaris 2.0 目前仍是 release candidate，不是稳定发行线；截至 2026-10-09，`@shopify/polaris-types` 的 `next` 为 `2.0.0-rc.2`。Shopify 官方允许现在接入 RC 并测试，已有 Web Components 的 App 可以把 CDN 改成 `https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js`；必须使用与 RC build 对齐的 `@shopify/polaris-types@2.0.0-rc.2`，并回归新旧 Admin 视觉和 Admin 外渲染。ISO 的保守生产基线默认仍选稳定 1.x；如果项目选择 RC 进入生产，必须把它记录为 App-specific decision，锁定 runtime/types、保留回滚方案和真实回归证据，不把 RC 结果写成“稳定 2.0”或单凭 RC 代码检查宣称 BFS 通过。2026-10-01 的 RC1 更新已使 Table、Select、Badge、Banner、Section、Page 等组件更贴近新 Admin 视觉，并修复布局、事件和挂载性能问题；这些变化仍属于预览输入。Shopify 已公布 BFS App Home 视觉适配截止日期为 **2027-05-01**，固定/粘性底部内容要考虑 `--shopify-safe-area-inset-bottom`。

React 迁移按 route 或 self-contained feature 分片推进，React controlled fields 需要 React 19；不要一次性替换全仓，也不要同时加载多个 Polaris build。完整迁移顺序与 App Bridge 替代关系见 [官方迁移指南](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react)。

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
- Shopify mobile 真机无整页横向滚动和不可访问内容；另以 375px 等 ISO 保守视口扩大测试覆盖。
- 键盘 Tab、焦点、Esc、modal 焦点回归。
- 所有表单错误、空状态、loading 和失败重试。
- 安装、更新 scopes、卸载、重装和合规 webhooks。
- 首页状态、核心指标和主流程。
- Dev Dashboard 中 Web Vitals 与适用自动检查。

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

先满足 App Store/分发要求，再申请 BFS。完整资格是两层门禁：App Store requirements **173 条**，再加 BFS requirements **77 条**。BFS 还包含自动评估项、Partner 状态、商家效用、性能、集成、设计和类别专属要求，不是单纯的 UI 审核。

提交前必须同时检查：

- Dev Dashboard / Distribution 页面列出的当前适用项。
- [App Store 173 条前置要求与类别路由](00-built-for-shopify/app-store-requirements.md)。
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
