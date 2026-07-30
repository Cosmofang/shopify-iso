# Shopify App Store + BFS 合规证据账本

> 本文件是账本模板和使用规范，不是任何 App 的通过证明。实际审核必须在 App 仓生成独立 ledger，并持续填写适用性、工作项、证据和状态。

## 1. 先记录审核范围

每份 ledger 顶部必须填写：

| 字段 | 必填内容 |
|---|---|
| App | 名称、生产 App ID 或 Dashboard 标识 |
| 分发 | public / custom；是否申请 App Store 与 BFS |
| 审核日期 | 当前复核日期与负责人 |
| App Store Section 5 | 所有命中类别；没有时写明产品功能和排除理由 |
| BFS Section 5 | 所有命中类别；没有时写明产品功能和排除理由 |
| Dashboard | Distribution 当前类别、自动前置项与检查日期 |
| BFS 生命周期 | not applied / applying / certified / at risk / lost；通知与检查日期 |
| 发布版本 | commit、部署版本、Shopify app version |

App Store 与 BFS 使用两套不同的 Section 5 类别。必须根据真实功能分别判断，多类别取并集；不能通过少选类别规避要求。

## 2. 生成逐项账本

在 ISO 根目录运行：

```bash
node scripts/build-requirements-ledger.mjs \
  --app-store-categories 5.1,5.6 \
  --bfs-categories 5.3 \
  > compliance-ledger.md
```

- 参数只填写已经完成书面判断的类别。
- 明确没有 Section 5 类别时可省略对应参数，但必须在生成文件顶部补充排除理由。
- `--all-categories` 只用于维护 ISO 或检查来源完整性，不用于单个 App 审核。
- 生成器包含 App Store Sections 1-4、BFS Sections 1-4，以及选择的两套 Section 5 条目。

## 3. 每条要求的固定字段

| Source | ID | Requirement | Applicability/reason | Work item | Evidence | Status |
|---|---|---|---|---|---|---|
| App Store / BFS | 官方 ID | 官方标题 | 适用原因；不适用时写具体产品/类别理由 | 页面、代码、配置或 Dashboard 工作项 | 命令输出、URL、截图、录屏、指标或审核记录 | `pending` / `pass` / `fail` / `unverified` / `not applicable` |

状态含义：

- `pending`：尚未完成判断或工作。
- `pass`：当前代码、运行结果、截图、API 结果或 Dashboard 证据满足精确判据。
- `fail`：当前行为或证据与要求冲突。
- `unverified`：看起来已实现，但缺少运行、生产、滚动指标、Dashboard 或人工审核证据。
- `not applicable`：基于明确的分发、功能或类别理由排除；不得只写“N/A”。

## 4. 证据最低要求

| 要求类型 | 最低证据 |
|---|---|
| 源码/配置 | 文件与行号、scope/extension/config 值、对应静态检查 |
| 核心流程 | dev store 或生产环境复现步骤、正常/空/错误/权限状态 |
| 设计与移动端 | 逐页桌面与 Shopify 移动端截图/录屏、键盘与焦点检查 |
| 性能和可靠性 | Distribution 或 Partner Dashboard 当前窗口指标；本地测试不能代替滚动指标 |
| App Store listing | 当前 listing、定价、语言、图片、测试凭证和 screencast |
| 类别专属 | 对应 API、extension、webhook、成功率或业务事件证据 |

## 5. 更新与完成规则

1. 每个实现或整改工作项必须关联 requirement ID，不能使用无编号的“BFS 杂项优化”。
2. 功能、scopes、extensions、billing 或分发变化后，重新判断两套类别和 listing 声明。
3. 同类问题要全 App 搜索，不只修 reviewer 截图页面。
4. 自动评估、生产流量、28 天窗口、Partner standing 和人工审核结果缺失时保持 `unverified`。
5. 只有所有适用项都有当前证据，且 Distribution 显示前置项满足，才能写 `ready to submit`。
6. 已获得 BFS 的 App 继续按 [状态生命周期](status-lifecycle.md) 记录自动 criteria、ongoing review、年度复审、60 天整改和恢复证据。

关联来源：[App Store 前置要求](app-store-requirements.md) · [BFS 全文快照](official-requirements-full.md) · [BFS 路由矩阵](official-requirements-matrix.md) · [状态生命周期](status-lifecycle.md) · [提交前清单](pre-submission-checklist.md)
