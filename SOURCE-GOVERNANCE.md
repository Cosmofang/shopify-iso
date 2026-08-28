# 官方来源、文档版本与修改追踪规则

> 文档版本：`1.0.0`
> 最后修改：`2026-08-28 10:31 CST (Asia/Shanghai)`
> 最后修改者：`Codex (OpenAI)`
> 规则来源：仓库所有者于 2026-08-28 提出的硬性维护要求
> 官方真相源：[Shopify developer documentation](https://shopify.dev/docs) · [Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) · [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) · [Shopify developer changelog](https://shopify.dev/changelog) · Dev Dashboard

本规则约束 ISO 的人工维护、Agent 修改、BFS 整改回补和官方同步。目标是让任何规则都能回答四个问题：谁改的、何时改的、改的是哪个版本、依据哪一份当前官方文档。

## 1. 来源优先级

1. Shopify 当前 requirements、API/component reference、App Design Guidelines、Changelog 和 Dev Dashboard。
2. 本仓已经核实并保留指纹的官方快照与矩阵。
3. ISO 保守实现或测试基线。
4. App reviewer 反馈、项目代码、截图、实测尺寸和第三方调研。

第 4 层可以帮助发现缺口，但不能直接成为 Shopify 通用规则。必须回到第 1 层独立核实；找不到官方支持时，只能标记为“App-specific evidence”或不写入通用 ISO。

## 2. 修改前的强制步骤

1. 用准确主题或 API/component 名称查找官方文档，不用完整自然语言问题代替检索。
2. 打开官方页面或 `.md` 原文，核对属性、默认值、限制、要求 ID 和上下文。
3. 检查 Changelog；BFS/App Store 修改同时运行对应指纹脚本。
4. 判断该内容属于官方硬要求、官方指导/API 合同、ISO 保守基线还是 App 项目证据。
5. 在计划或证据账本中写明 requirement ID、官方 URL、预期修改和验证方式后再编辑。

## 3. 文档顶部元数据

从 2026-08-28 起，任何被修改的规范 Markdown 必须在标题下保留以下字段：

```markdown
> 文档版本：`1.2.0`
> 最后修改：`2026-08-28 10:31 CST (Asia/Shanghai)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[官方页面标题](https://shopify.dev/...)
```

版本采用语义化规则：

- `PATCH`：错字、链接或不改变含义的澄清。
- `MINOR`：新增经过官方核实的规则、示例、证据或测试口径。
- `MAJOR`：来源优先级、审核结论或实施合同发生不兼容变化。

最后修改者使用可识别的人名或 Agent 名称，不能写“AI”“系统”或留空。时间必须带时区。

## 4. 正文来源标注

- 官方要求：写 requirement ID，并链接到要求正文。
- 官方组件/API：链接到具体 component、query、mutation 或 guide 页面，不只链接 `shopify.dev` 首页。
- ISO 基线：明确写“ISO 保守基线”，并说明它保护哪条官方要求；不得伪装成 Shopify 公布的像素阈值。
- App 项目证据：注明 App、页面、reviewer/运行证据和日期；不得写成“所有 App 必须”。
- 历史 Polaris React：必须标为历史或迁移参考；当前 App Home Web Components 与 BFS 优先。

同一段混合多种来源时，拆开写。不能用一个模糊的“参考官方规范”同时支撑硬要求、设计建议和项目经验值。

## 5. 验证与交付

按修改范围运行：

```bash
node scripts/verify-bfs-requirements.mjs
node scripts/verify-app-store-requirements.mjs
node scripts/verify-app-design-guidelines.mjs
node scripts/verify-links.mjs
git diff --check
```

组件/API 的新增规则还要重新打开对应官方 reference。无法访问、内容冲突或 Dashboard 无权限时，将结论标为 `unverified`，不能用旧记忆补全。

## 6. 本规则的执行入口

- Agent：仓库根目录 [AGENTS.md](AGENTS.md)。
- 开发与审核：[START-HERE.md](START-HERE.md)。
- AI Skill：[skills/shopify-app-iso/SKILL.md](skills/shopify-app-iso/SKILL.md)。
- BFS 来源完整性：[00-built-for-shopify/official-requirements-matrix.md](00-built-for-shopify/official-requirements-matrix.md)。

以上入口不得维护互相冲突的另一套规则；本文件是来源和版本追踪的统一合同。
