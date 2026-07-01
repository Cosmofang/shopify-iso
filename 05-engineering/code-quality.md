# 代码质量 Code Quality

> Lint / 格式化 / 类型 / GraphQL 类型生成的官方栈。工具版本见 [../tooling.md](../tooling.md)。

---

## 官方模板已内置的基线

React Router 模板默认带:

| 维度 | 内置 | 说明 |
|------|------|------|
| JS/TS lint | ESLint `eslint:recommended` + `react` + `react-hooks` + **`jsx-a11y`(无障碍)** + `@typescript-eslint/recommended` + `import` | `npm run lint` |
| 格式化 | Prettier | 统一风格 |
| 类型 | `tsconfig.json` + `tsc --noEmit` | `npm run typecheck` |
| GraphQL | `.graphqlrc.ts` + `@shopify/api-codegen-preset` | 类型化 API 查询 |
| 全局 | `shopify` readonly | App Bridge 全局 |

## 官方更严选项（可选升级）

- **`@shopify/eslint-plugin`**(v50)—— Shopify 自家更严的 ESLint 配置,替换/叠加模板的通用 recommended。
- **`@shopify/prettier-config`** —— 官方 Prettier 预设。
- **`@shopify/stylelint-polaris`**(v16)—— CSS lint,挡写死 hex 等;配置见 [../.stylelintrc.json](../.stylelintrc.json)。⚠️ peer 需 **stylelint 14/15**(别装 17)。

---

## ✅ Do
- CI / pre-commit 跑 `lint` + `typecheck` + `stylelint`。
- 自绘 CSS 用 Polaris token(见 [../assets/polaris-tokens.css](../assets/polaris-tokens.css)),别写死 hex(stylelint 会挡)。
- GraphQL 查询用 codegen 生成类型,别手写 any。
- 改 token 前跑 [../scripts/verify-tokens.mjs](../scripts/verify-tokens.mjs)。

## ❌ Don't
- ❌ 关掉 `jsx-a11y`(无障碍是 BFS 关注点)。
- ❌ 写死颜色 hex;❌ `tsc` 报错照提交;❌ stylelint 装成 17(与 stylelint-polaris 不兼容)。

## 自检
- [ ] `npm run lint` / `npm run typecheck` 通过。
- [ ] `.stylelintrc.json` 就位,CSS 无写死 hex。
- [ ] GraphQL 有 codegen 类型。
