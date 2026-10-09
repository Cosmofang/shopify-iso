# Shopify 平台规范迭代审计

> 文档版本：`1.0.1`
> 最后修改：`2026-10-09 10:45 EDT (America/New_York)`
> 最后修改者：`Codex (OpenAI)`
> 官方来源：[BFS requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Polaris Web Components](https://shopify.dev/docs/api/app-home/latest/web-components) · [Polaris Web Components versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning) · [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) · [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) · [React Router official template](https://github.com/Shopify/shopify-app-template-react-router/blob/main/package.json)

## 结论

截至 **2026-10-09**，BFS 主规范没有新的条款迭代：官方 Markdown 仍为 **77 条叶子要求**、**63 条 Section 4 设计拒审理由**，SHA-256 为 `72a477c602b7a20242cd069998eec0c9dc5b767cc30432d4fcb8ec7b8db3fb93`。本次重新抓取、计数和仓库 verifier 均确认编号、标题、正文语义和拒审理由一致。

App Store 主规范当前为 **173 条叶子要求**，分区为 `1=20`、`2=17`、`3=6`、`4=24`、`5=106`，SHA-256 为 `cf6bb20375215dd8c9c59c1148b39a9ca1f521b6b044f618cf950c12d383a46e`。原 `5.8.4` 已移除，当前 `5.8.3` 后直接进入 `5.8.5`；这不是新的 BFS 条款，不能自行补号。

Polaris 的稳定生产线仍是 **1.1**。官方 versioning 页面仍以 `polaris-1.js` 为稳定 channel，页面 `api_version` 为 `v1.1`；当前页面 SHA-256 为 `4d4e13a00f0810fff0ab10669e8b6fc9cf17e8fb4b52dad3eaf7757a21dcd964`。组件总览页面 SHA-256 为 `1f0fc4fede284a89f55c2f4ac171444b3c471efdbf825ba98ab5327518b348a1`。

“Polaris 2.0 已经 GA”截至本次核验不成立：官方 CDN `polaris-2.0-rc.js` 可访问，`polaris-2.js` 与 `polaris-2.0.js` 返回 404；npm `@shopify/polaris-types` 的 `latest` 仍为 `1.1.0`，`next` 为 `2.0.0-rc.2`。官方 RC 公告明确允许现在接入并测试，因此“不能用于生产”不是 Shopify 硬性禁令；ISO 只是把稳定 1.x 作为默认生产基线，RC 生产采用需由 App 自己记录风险、回滚和真实回归证据。

## 官方来源核验

| 来源 | 2026-10-09 核验结果 | 分类 | ISO 动作 |
|---|---|---|---|
| [BFS requirements Markdown](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements.md) | 77 叶子、63 拒审理由；SHA `72a477…fb93` | 官方硬要求 | 保持全文快照、矩阵和 verifier；记录本次无语义变化 |
| [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements.md) | 173 叶子；`20/17/6/24/106`；SHA `cf6bb2…a46e` | 官方硬要求 | 保持当前 173 条与 `5.8.4` 移除记录 |
| [Polaris Web Components](https://shopify.dev/docs/api/app-home/latest/web-components.md) | `api_version: v1.1`；SHA `1f0fc4…48a1`；公开入口 50 个组件页 + 1 个 versioning 页 | 官方 API/组件合同 | 稳定组件清单仍锁定 `@shopify/polaris-types@1.1.0`、62 tags；10-09 重新下载 manifest，SHA 不变 |
| [Polaris versioning](https://shopify.dev/docs/api/app-home/latest/web-components/versioning.md) | 文档明确推荐 `polaris-1.js`，当前 release 1.1；SHA `4d4e13…d964` | 官方版本指导 | 稳定 channel 与精确 `polaris-1.1.js` 保持不变 |
| [Polaris 2.0 release candidate](https://shopify.dev/changelog/polaris-2-0-release-candidate) | 2026-09-24 发布 RC；公告明确可现在接入并测试，新旧 Admin 视觉并存，迁移测试覆盖 Admin 内新旧视觉和 Admin 外渲染 | 官方迁移指导 | 继续标记为 RC；ISO 默认不把它并入稳定清单；保留 2027-05-01 BFS App Home 适配期限 |
| [Polaris 2.0.0-rc.1 update](https://shopify.dev/changelog/posts/what-s-new-in-polaris-2-0-0-rc-1) | 2026-10-01；Table、Select、Badge、Banner、Section/Page 布局、事件和挂载性能修复/调整 | 官方预览变更 | 更新迁移注记；不改变稳定生产基线 |
| [`@shopify/polaris-types` registry](https://registry.npmjs.org/@shopify%2fpolaris-types) | stable `1.1.0`；`next` `2.0.0-rc.2`（2026-10-05）；RC2 manifest SHA `4cdc4989…7add5`；62 tags | 官方发布元数据 | RC2 单独记录，不混入 stable manifest |
| [Shopify CLI npm](https://www.npmjs.com/package/@shopify/cli) | `4.9.2`，Node `>=22.12.0` | 官方发布元数据 | 更新 tooling verifier 和快照 |
| [React Router npm](https://www.npmjs.com/package/@shopify/shopify-app-react-router) | `3.0.2`，Node `>=22.0.0` | 官方发布元数据 | 更新 tooling verifier 和迁移说明 |
| [官方 React Router template](https://github.com/Shopify/shopify-app-template-react-router/blob/main/package.json) | Node `>=22.12`；Router `^3.0.1`；App Bridge React `^4.2.4`；Polaris types `1.0.1` | 官方模板合同 | 与 npm latest 分开记录；不把模板 types 版本误当 Web Components versioning 页面版本 |

## 关键边界

- 规范源数量、指纹和组件清单对齐，只说明 ISO 来源库已更新；不证明任何具体 App 已通过 BFS、Dev Dashboard 自动评估、Web Vitals、生产审核或 App Store 审核。
- `@shopify/polaris-types` 是类型包，不提供 Polaris CDN 运行时；稳定运行时和 types 必须按 versioning 页面成对选择。
- Polaris 2.0 RC1/RC2 的视觉变化应进入迁移回归矩阵。RC 结果可以作为 App-specific 迁移证据，但不能把它写成“稳定 2.0 已 GA”或替代 Dev Dashboard 的 BFS 资格证据。
- Dev Dashboard、Partner standing、净安装、评价、评分、生产性能、移动端真机和人工审核状态本次均没有 App 级证据，保持 `unverified`。

## 本次执行

已更新 `START-HERE.md`、`tooling.md`、`scripts/verify-tooling-versions.mjs`、Polaris 当前映射与来源治理、Web Components 组件清单、BFS 链接审读台账和本审计文件。验证命令在提交前重新运行；tokens 使用隔离 npm cache，避免本机 root-owned cache 权限干扰。
