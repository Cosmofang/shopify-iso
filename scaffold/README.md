# 官方脚手架（从零创建 App）

> ⚠️ **这里不放可跑的 app 代码。** 完整脚手架（含 `node_modules`、Prisma、构建产物）属于各自的真实 App 仓，不属于标准仓——放进来会仓库暴涨、职责混乱、随模板升级过期。
> 本目录只放：**怎么用官方脚手架起手 + 版本原则 + 结构↔ISO 标准的映射**。

---

## 先选模板

| 场景 | 模板 |
|---|---|
| 大多数公开 App，需要后端、多页面或 webhook | React Router（默认推荐） |
| 无后端且仅 custom distribution | Extension-only + App Home UI extension |
| 只需 API 凭证、没有内嵌 UI | 不建脚手架，在 Dev Dashboard 创建 App |

完整分流见 [../START-HERE.md](../START-HERE.md)。

## React Router 官方起手

```bash
shopify app init
```

输入 App 名称，并选择 **Build a React Router app**。CLI 会创建项目和依赖。进入新项目后再启动开发环境：

```bash
cd <app-directory>
shopify app dev
```

按 `p` 打开预览并在 dev store 安装。之后本地开发/自测见 [../00-built-for-shopify/local-self-test.md](../00-built-for-shopify/local-self-test.md)。

> 所有 `npm install` 都必须在含 App `package.json` 的项目目录执行，不能在 `~` 用户主目录执行。

---

## 模板底座与版本原则

1. 新项目以**最新官方模板生成的 `package.json` 和 lockfile** 为准。
2. ISO 的版本表是核准快照，不要求新模板降级到快照版本。
3. 升级依赖必须查看 Shopify changelog、运行自动检查并完成 dev store 回归。
4. Polaris Web Components 运行时由官方 CDN 加载，不安装已弃用的 `@shopify/polaris` 作为新项目 UI 基线。
5. `@shopify/polaris-types` 只是 TypeScript 类型；需要时在 App 目录安装，并跟随模板或官方当前建议。

完整清单见 [../tooling.md](../tooling.md)。

---

## 模板结构 ↔ ISO 标准映射

| 脚手架里的位置 | 对应 ISO 标准 |
|----------------|--------------|
| `shopify.app.toml` | URL、scopes、webhooks、API version；见 [../05-engineering/](../05-engineering/) |
| `app/shopify.server.ts` | 模板认证、session、GraphQL client；见 [../05-engineering/authentication.md](../05-engineering/authentication.md) |
| `app/routes/app.*` | 先套 [App Home Patterns](https://shopify.dev/docs/api/app-home/patterns)，再查 [../01-foundations/](../01-foundations/) 和 [../02-components/](../02-components/) |
| App Bridge title/nav/save bar | [../02-components/navigation.md](../02-components/navigation.md) 与 [../00-built-for-shopify/requirements.md](../00-built-for-shopify/requirements.md) |
| 自绘 CSS（Zone B） | token 回落 → [../assets/polaris-tokens.css](../assets/polaris-tokens.css)；lint → [../.stylelintrc.json](../.stylelintrc.json) |
| 表单 / 校验 | 错误信息 → [../02-components/forms-fields.md](../02-components/forms-fields.md)（4.2.4） |
| 合并前 | App 仓 `lint`、`typecheck`、`build`、测试 + dev store 回归 |
| 审核前 | Dev Dashboard + [../00-built-for-shopify/pre-submission-checklist.md](../00-built-for-shopify/pre-submission-checklist.md) + [../05-engineering/README.md](../05-engineering/README.md) |

---

## 基线验收

- [ ] App 在 Shopify Admin 内嵌打开。
- [ ] `shopify app dev` 使用正确的开发 App 与个人 dev store。
- [ ] 模板首页无阻断错误。
- [ ] `package.json` 与 lockfile 已提交到真实 App 仓库。
- [ ] 团队未复制或 vendor 本仓中的旧模板快照。

本标准仓不保存可运行模板源码。每个新 App 都用 `shopify app init` 获取当时的官方最新模板。
