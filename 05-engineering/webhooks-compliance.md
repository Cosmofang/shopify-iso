# Webhooks & 合规 Compliance

> App Store 上架 app **必须**订阅 3 个合规 webhook(即使不收个人数据)。缺失/不合规会被拒。
> 官方:https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance

---

## 强制合规 webhook（GDPR）

| topic | 用途 |
|------|------|
| `customers/data_request` | 客户请求查看其存储数据 |
| `customers/redact` | 请求删除某客户数据 |
| `shop/redact` | 卸载 48 小时后请求删除店铺数据 |

- 在 `shopify.app.toml` 用 `compliance_topics` 配置:
```toml
[webhooks]
api_version = "2026-07"
[[webhooks.subscriptions]]
compliance_topics = ["customers/data_request", "customers/redact", "shop/redact"]
uri = "https://app.example.com/webhooks"
```

## 处理要求

- **HMAC 验签**:头无效 → 返 **401 Unauthorized**。
- 收到后用 **200 系列**状态确认;所请求动作 **30 天内完成**(法律要求留存的除外)。
- POST + JSON body;HTTPS 需有效 SSL。

## 标准 webhook

- `app/uninstalled`、`app/scopes_update` 等按需订阅,用于清理/同步。

---

## ⚠️ 本项目注意
真 app 为 `--use-localhost` 开发**临时移除了 webhook**(localhost URI 被 Shopify 拒),`shopify.app.toml` 有 re-add 注释——**部署前务必加回**合规 + `app/uninstalled`。

## ✅ Do / ❌ Don't
- ✅ 三个合规 topic 全订阅并实现;上线前用 CLI/真机验证。
- ✅ 每个 webhook 验 HMAC,失败返 401。
- ❌ 无效 HMAC 却返 200;❌ 忽略 `shop/redact`。

## 自检
- [ ] 3 个合规 webhook 已配 `compliance_topics` 并实现。
- [ ] HMAC 验签:无效→401,有效→200。
- [ ] 部署前已把 dev 期移除的 webhook 加回。
