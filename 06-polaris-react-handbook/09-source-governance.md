# 来源治理与完整性

## 固定来源

| 来源 | 固定点 | 用途 |
|---|---|---|
| `Shopify/polaris-react` | commit `2b1ea88625e0613853ca8577c9acd1980a90f382` | 内容、React 组件源码、tokens、icons、迁移与工具 |
| `polaris-react-main.zip` | SHA-256 `c6d547b9fd4d9c1b89fb3a44e65b5db60cefc90520f647a152c769eb469039cc` | 本次本地来源快照 |
| 固定 commit 内的 `@shopify/polaris` | 13.10.1 / 121 个组件目录 | 官方源码快照中的 React API 与实现 |
| 本机 npm 缓存中的 `@shopify/polaris` tarball | 13.9.5 / 120 个组件目录 | 独立发布快照交叉检查，不代表固定 commit |
| `@shopify/polaris-types` | 1.0.7 | 当前 59 个 Polaris Web Components 类型合同 |
| `polaris-react.shopify.com` | 2026-07-29 递归采集 | 243 个可导航页面及重定向状态 |

## 两种覆盖口径

源码和网站不是一一对应：

- 源码 `polaris.shopify.com/content` 有 260 个 MDX/模板文件。
- 官网递归导航有 243 个去重路径。
- 源码含 partial、模板、internal-only、未公开旧页和 variant 文件。
- 官网含重定向别名，例如旧 content 路径重定向到 Fundamentals。
- 因此不能用网页数量证明源码覆盖，也不能用源码文件数量证明页面可访问。

## Manifest 字段

[source-manifest.json](source-manifest.json) 中每个来源包含：

- `path`：相对 `polaris.shopify.com/content` 的官方源码路径。
- `route`：推导出的站点路径，用于人工核对，不保证仍可访问。
- `status`：历史/当前使用边界。
- `handbookTarget`：本手册负责解释它的章节。
- `bytes` 与 `sha256`：固定快照证据。

## 更新流程

1. 下载或 clone 官方归档仓库的固定 commit。
2. 运行 `scripts/generate-polaris-react-manifest.mjs` 生成候选 manifest。
3. 对比新增、删除和 hash 变化，不直接覆盖现有解释。
4. 阅读所有变化文件并更新相应手册章节。
5. 更新 React/Web Components 映射时，分别记录两个包的版本。
6. 运行 `scripts/verify-polaris-react-handbook.mjs --source-root <repo>`。
   若保留了官网 crawl JSON，同时传入 `--site-crawl <crawl.json>` 校验 243 个唯一路径与导航错误。
7. 只有来源无遗漏、目标章节存在且映射已审读，才更新固定 commit。

## 历史 Contributing 来源留下的治理原则

6 个 contributing 文件分别覆盖 **Contributing to Polaris**、**Contributing to Polaris React**、**Contributing to the Figma UI Kit**、**Contributing to Polaris Icons**、**Documenting in Polaris** 与 **Creating layout**。仓库已经归档，因此其中的团队频道、Figma 分支和 PR 流程不能作为当前 Shopify 支持承诺；仍值得保留的是系统治理方法：

- 贡献必须解决已知、可复用的问题；独特的一次性需求不一定应进入系统。
- 大改先写问题、证据、影响、资源和兼容方案；bug、API、文档、测试与设计资产同步评审。
- 组件应可访问、高性能、可维护；props 过多通常说明需要 composition 或拆分。
- Figma 组件、代码组件、icons、metadata 和 release notes 保持可追踪的对应关系。
- 文档由领域人员和设计/工程共同复核；过时内容应尽快删除，而不是因为已有链接就永久保留。
- 旧站点的 MDX `LayoutSection`、`Text`、`Small/Medium/Large` 等只是文档站排版组件，不是 App UI API。

本 ISO 更新遵循同样原则，但以当前 Shopify 官方文档和可执行验证为上游；不向已归档 Polaris React 仓库提出新实现。

## 完成判据

- 260/260 来源文件都有唯一 manifest 行和手册落点。
- 所有 `handbookTarget` 文件存在。
- 89 个公开 React 组件页、23 个 deprecated 组件页和 8 个 internal-only 文件被明确区分。
- 13.10.1 官方源码的 121 个组件目录、13.9.5 本机 npm 快照的 120 个目录与 59 个当前 Web Components 被明确分开。
- 当前替代映射允许 `direct`、`composition`、`App Bridge`、`custom`、`no direct replacement`，不强行一对一。
- 历史 token、API 或视觉值没有被表述为当前实现权威。
- 全仓链接、manifest、源码 hash 与 Markdown 格式检查通过。
