# 05 · Engineering 工程/代码规范

> 设计章(00–04)管「长什么样」;本章管「代码怎么写、怎么过 BFS 的**技术**关」。
> 全部对齐官方文档(2026-07 核准),每篇给官方链接 + ✅Do ❌Don't + BFS 映射。
> 新 App 不从本章单篇起手；先按 [../START-HERE.md](../START-HERE.md) 建立官方模板基线和阶段门，再按当前阶段查本章。

---

## BFS 完整要求骨架（不止设计）

官方 [Built for Shopify requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements) 分 5 大块；77 条叶子要求的逐项映射见 [官方要求总矩阵](../00-built-for-shopify/official-requirements-matrix.md)。其中 BFS 1.1.1 还会重新审计独立的 [App Store 174 条要求](../00-built-for-shopify/app-store-requirements.md)，两层都必须通过。

| # | 大块 | 内容 | 本库落点 |
|---|------|------|---------|
| 1 | Prerequisites | App Store 174 条、Partner 良好、**≥50 净安装 / ≥5 评价 / 评分门槛** | [App Store 前置](../00-built-for-shopify/app-store-requirements.md) + 本文件 |
| 2 | Performance | Admin Web Vitals、Storefront、Checkout | [performance.md](performance.md) |
| 3 | Integration | 最新 App Bridge 嵌入、主流程留 Shopify 内、干净卸载 | [integration.md](integration.md) |
| 4 | Design | Familiar / Helpful / User-friendly | 设计章 [00–03](../00-built-for-shopify/) |
| 5 | Category-specific | 各品类技术要求(Web Pixel / Functions 等) | [category-specific.md](category-specific.md) |

---

## 本章文档

- [authentication.md](authentication.md) — Session token / token exchange / 托管安装
- [api-usage.md](api-usage.md) — GraphQL Admin API / 速率限制 / bulk / API 版本
- [webhooks-compliance.md](webhooks-compliance.md) — 强制合规 webhook(GDPR)+ HMAC 验签
- [performance.md](performance.md) — Web Vitals 指标与门槛(BFS 2)
- [security-data.md](security-data.md) — 受保护客户数据 Level 0/1/2 + 最小 scopes
- [code-quality.md](code-quality.md) — ESLint / Prettier / stylelint / tsconfig / GraphQL codegen
- [integration.md](integration.md) — 嵌入 / 主流程 / 干净卸载(BFS 3)
- [category-specific.md](category-specific.md) — 品类专属技术要求(BFS 5)
- [frontend-code-conventions.md](frontend-code-conventions.md) — 前端代码约定(⚠️ 非官方要求,从真实代码提炼:注释风格/组件与状态/mock设计/安全/i18n/命名)

> 工具链清单与核准版本快照见 [../tooling.md](../tooling.md);脚手架起手见 [../scaffold/README.md](../scaffold/README.md)。
