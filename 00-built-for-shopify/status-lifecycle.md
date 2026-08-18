# Built for Shopify 状态生命周期

> 本页覆盖 BFS 的申请、持续监控、失效和恢复机制。它是审核治理规范，不增加或替代 [77 条官方要求](official-requirements-full.md)，也不把任何单个 App 的拒审邮件当成通用标准。
>
> 官方来源：[Built for Shopify overview](https://shopify.dev/docs/apps/launch/built-for-shopify) · [Regain lost status](https://shopify.dev/docs/apps/launch/built-for-shopify/regain-lost-status) · [Achievement criteria](https://shopify.dev/docs/apps/launch/built-for-shopify/achievement-criteria) · [BFS changelog](https://shopify.dev/changelog?filter=built_for_shopify)
>
> 核准日期：**2026-08-18**。实时状态仍以 Dev Dashboard → **Distribution** 和 Shopify 通知为准。

## 1. 申请阶段

- 前置 achievement criteria 会定期自动评估；未满足时不能提交 BFS 申请。
- 只有具有 **Manage apps** 权限的团队成员能从 Partner Dashboard → Apps → App → Distribution 提交。
- Shopify 会人工检查需要手动评估的标准，并要求逐项修复发现的问题。
- 同一 criterion 连续失败 **3 次**，申请暂停 **3 个月**。
- 申请审核必须同时覆盖 App Store requirements、BFS 77 条、适用类别和 Distribution 当前状态，不能只处理某次邮件或截图。

## 2. 获得 BFS 后的持续监控

以下自动 criteria 在 Distribution 中持续监控；失败可能触发质量检查，连续失败 60 天可能失去 BFS：

1. 干净卸载并使用 Theme App Extensions。
2. App 嵌入 Shopify Admin。
3. Checkout 性能。
4. Admin Web Vitals p75 指标。
5. 最低安装量。
6. 最低评价量。
7. 最低近期评分。

人工 criteria 也会持续监控：

- Shopify 可以随时对已获得 BFS 的 App 进行 ongoing review。
- Shopify 每年进行一次完整复审。
- 发现人工项不合格后通常有 **60 天**整改期；逾期会移除 BFS。
- App Store requirements 必须持续满足，不是申请当日的一次性门槛。

## 3. 失效与恢复

- 风险和失败状态以 Distribution、Shopify 邮件及 Partner Dashboard 通知为证据。
- 自动或人工标准失败后，记录失败 criterion、首次发现日期、60 天截止日、负责人、修复版本和复验证据。
- App 重新满足全部 criteria 后会**自动恢复 BFS，无需重新申请**。
- 自动恢复后，Shopify 仍可能复查全部人工 criteria 和当前 App Store requirements。
- 在恢复完成前，状态必须记为 `fail` 或 `unverified`，不能仅凭代码修复声明已恢复。

## 4. 生命周期审核清单

### 申请前

- [ ] Distribution 的当前自动前置项有截图或导出记录。
- [ ] App Store 与 BFS 两套类别都按真实功能完成适用性判断。
- [ ] 174 条 App Store requirements 和 77 条 BFS requirements 的适用项均有状态与证据。
- [ ] 当前 BFS changelog 已检查，未来生效要求已记录截止日期和负责人。
- [ ] 提交成员具有 Manage apps 权限；同一 criterion 的失败次数已核对。

### 已获得 BFS

- [ ] 发布流程持续执行 App Store、BFS、类别和 Distribution 回归检查。
- [ ] 自动 criteria 定期留存当前窗口指标，不用本地测试替代生产滚动数据。
- [ ] 功能、scopes、extensions、billing、分发或类别变化后重新生成适用项并审计。
- [ ] 年度复审和 Shopify ongoing review 的通知、问题、证据与结果有记录。

### 处于风险、失效或恢复中

- [ ] 每个失败项有首次发现日、60 天截止日、负责人和证据链接。
- [ ] 同类问题在整个 App 中搜索并修复，不只处理通知中的示例。
- [ ] 恢复前保持 `fail` / `unverified`；以 Distribution 或 Shopify 通知确认恢复。
- [ ] 自动恢复后再次核对人工 criteria 和当前 App Store requirements。

## 5. 权益与其他 achievements

以下是达到标准后的权益或独立 achievement，**不是合规通过证据，也不计入 77 条要求**：

- BFS listing highlight、App Store app card badge 和 BFS 搜索筛选。
- 未来提交其他 App 时进入 BFS 开发者优先审核队列。
- App Store Ads 可按特定 merchant plans 定向。
- 搜索排名提升，以及 App Store 首页、分类页、Admin `Picked for you` 和 story pages 的推广资格；个性化推荐不保证实际展示。
- `Works with the latest themes`、`Use directly in Shopify admin` 等 app highlights 会按适用 criteria 自动评估。
- `In the spotlight`、story pages 和 increased visibility 只代表达到入选资格，不保证被 Shopify 选中。

审核账本不得用 badge、highlight、搜索曝光或入选资格替代 requirement ID、Dashboard 指标和人工验证证据。
