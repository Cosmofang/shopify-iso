# Polaris 双轨设计门

> 文档版本：`1.0.0`
> 最后修改：`2026-10-09 10:50 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[Polaris Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) · [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) · [BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Design Guidelines](https://shopify.dev/docs/apps/design)

## 这条门解决什么问题

新 App 的设计采用一条双轨流程：先用当前稳定 Polaris 1.x 建立可交付基础，再用 Polaris 2.0 release candidate 做第二轮视觉和交互审查，最后才进入 BFS 证据验证。

这里的“1.0 基础”按 Shopify 当前版本合同理解为 **Polaris 1.x 稳定线**。官方 versioning 页面目前记录的稳定版本是 **1.1**：生产推荐 `polaris-1.js`，需要可复现构建时固定 `polaris-1.1.js`。如果项目必须兼容固定的 `polaris-1.0.js`，要把该兼容约束记录为 App-specific decision，并仍完成 1.x 与 2.0 RC 的差异审查。

Polaris 2.0 RC 是官方允许接入和测试的预览输入。它不是 BFS 的独立要求，也不是“装上就合规”；BFS 审核的是完整商家体验、集成、性能、类别要求和真实证据。ISO 将“稳定 1.x 基础 + 2.0 RC 复核”设为内部设计门，是保守基线，不是 Shopify 禁止 RC 生产使用。

## 双轨执行顺序

### Track A：稳定基础实现

1. 先选 App Home Template 和官方 Pattern，再选择当前 Web Components。
2. 使用单一稳定 build：`polaris-1.js` 或固定的 `polaris-1.1.js`。
3. 类型与运行时成对：稳定 channel 使用 `@shopify/polaris-types@^1.1.0`，固定 1.1 使用 `@shopify/polaris-types@~1.1.0`；精确可复现构建可以进一步 pin 到确切版本。
4. 完成页面结构、信息层级、状态、表单、导航、错误恢复、键盘和移动端基础实现。
5. 记录每个页面的 Template/Pattern、组件合同、数据状态和偏离官方能力的理由。

Track A 的通过条件是：页面在稳定 1.x 下可运行，且没有已知阻断问题。它不是 BFS 通过证明。

### Track B：Polaris 2.0 RC 复核

1. 在隔离的预览构建或明确记录的 App-specific 环境中加载 `https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js`。
2. 同步使用 `@shopify/polaris-types@2.0.0-rc.2`，不要让 RC runtime 与 1.x types 混用。
3. 逐页比较 1.x 与 RC 的颜色、排版、间距、图标、组件尺寸、slot、事件、loading、overlay、表格和响应式行为。
4. 按官方 RC 公告测试三个上下文：使用新 Admin 视觉的店铺、仍使用旧 Admin 视觉的店铺、Admin 外渲染。固定/粘性底部内容同时验证 `--shopify-safe-area-inset-bottom`。
5. 把差异分成四类：无需修改、需要布局/内容调整、需要 API/事件调整、无法确认而保持 `unverified`。每项记录截图或可复现步骤。

Track B 的结果是迁移和回归证据。它可以支持 App 选择 RC 进入生产，但不能被写成“Polaris 2.0 已稳定”或替代 Dev Dashboard 证据。

### Reconcile：合并设计决策

1. 保留商家任务、信息架构、语义颜色和可访问名称；不要为了追逐视觉差异重写已经清楚的流程。
2. 解决两条轨道之间的布局、文本、组件属性、事件和安全区差异。
3. 生产只加载一个 Polaris build；不能在同一页面同时加载 1.x 和 2.0 RC。
4. 如果生产选择 RC，提交 runtime URL、types 版本、回滚 URL、兼容范围和真实回归证据；该选择标为 App-specific evidence。
5. 在版本差异关闭或明确标记 `unverified` 后，才进入 BFS 逐项证据账本。

## BFS 收口门

双轨审查完成后，按 [BFS 设计条款](../00-built-for-shopify/requirements.md) 和适用 requirement ID 验证：

| BFS 关注点 | 双轨必须留下的证据 |
|---|---|
| `4.1.1` Familiar | 1.x 基础截图、2.0 RC 对照截图、组件与 Admin 视觉差异说明、键盘/focus 结果 |
| `4.1.2` Mobile-friendly | 新旧 Admin 视觉下的窄屏流程、无整页横滚、内容可达和布局堆叠证据 |
| `4.2.x` Helpful | onboarding、加载、空、错误、权限和恢复状态在两条轨道中的一致任务语义 |
| `4.3.x` User-friendly | 无干扰、无误导、真实状态反馈、可撤销和可恢复行为的录屏或复现步骤 |
| 性能/集成/类别要求 | App 自己的 Web Vitals、卸载、API、权限、类别和 Dev Dashboard 证据；不能由 Polaris 版本替代 |

只有 Track A、Track B、Reconcile 和 BFS 证据都完成，才可以把某个 requirement 标成 `pass`。规范库本身通过校验，只能说明来源和流程对齐，不代表具体 App 已通过 BFS。

## 更新触发器

- Polaris 1.x 稳定版本、2.0 RC、types manifest、组件事件或 slot 合同变化时，重新跑两条轨道。
- Shopify Admin 新视觉 rollout、BFS 适配截止日期、App Design Guidelines 或 BFS Section 4 变化时，重新跑两条轨道。
- 任意一条轨道出现布局跳动、可访问性回归、组件行为差异或性能回归时，暂停 BFS `pass`，直到补齐证据。
