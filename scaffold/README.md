# 官方脚手架（标准仓形态）

> ⚠️ **这里不放可跑的 app 代码。** 完整脚手架（含 `node_modules`、Prisma、构建产物）属于**真实 app 仓**（如 lumi-app），不属于标准仓——放进来会仓库暴涨、职责混乱、随模板升级过期。
> 本目录只放：**怎么用官方脚手架起手 + pin 版本 + 结构↔ISO 标准的映射**。

---

## 起手命令（官方）

```bash
# 官方推荐：React Router 模板（自带 OAuth / billing / webhook）
shopify app init --template react-router
# 其他 flavor：extension-only / express / ruby / php
```

CLI 会：引导登录 → 在 Dev Dashboard 建/连 app → 建 Prisma SQLite → 起隧道预览。
之后本地开发/自测见 [../00-built-for-shopify/local-self-test.md](../00-built-for-shopify/local-self-test.md)。

---

## 模板底座 & pin 版本

| 组成 | 包 | pin 版本 |
|------|----|---------|
| 后端框架 | `@shopify/shopify-app-react-router` | 1.2.1 |
| 嵌入 Admin | `@shopify/app-bridge-react` | 4.2.11 |
| UI（二选一或并用） | Polaris Web Components（`s-*`） / `@shopify/polaris` | 13.9.5 |
| 设计 token | `@shopify/polaris-tokens` | 9.4.2 |

完整清单见 [../tooling.md](../tooling.md)。

---

## 模板结构 ↔ ISO 标准映射

| 脚手架里的位置 | 对应 ISO 标准 |
|----------------|--------------|
| `app/shopify.server.ts`（`shopifyApp({...})`） | App 名/URL 配置 → [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)（4.1.3 / 4.1.4） |
| App Home 页面（`s-page` / Polaris 组件） | 布局与组件 → [../01-foundations/](../01-foundations/) · [../02-components/](../02-components/) |
| 自绘 CSS（Zone B） | token 回落 → [../assets/polaris-tokens.css](../assets/polaris-tokens.css)；lint → [../.stylelintrc.json](../.stylelintrc.json) |
| 表单 / 校验 | 错误信息 → [../02-components/forms-fields.md](../02-components/forms-fields.md)（4.2.4） |
| 提交前 | [../00-built-for-shopify/pre-submission-checklist.md](../00-built-for-shopify/pre-submission-checklist.md) |

---

## 如需在本仓保留源码快照

若确实想把模板**源码**（去掉 `node_modules` / 构建产物）作为参考快照放进来，建议：

```bash
# 只留源码，不留依赖与产物
git clone --depth 1 <官方模板仓> scaffold/react-router-template
rm -rf scaffold/react-router-template/.git scaffold/react-router-template/node_modules
```

> 但更推荐**不 vendor**：用上面的 `shopify app init` 现拉最新，标准仓只维护「命令 + pin + 映射」。
