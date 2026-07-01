# 品类专属技术要求（BFS 5）

> 不同品类有各自**技术**门槛。本 app 是 **SEO / Analytics 类**,重点看下面几条。
> 官方:https://shopify.dev/docs/apps/launch/built-for-shopify/requirements

---

## 与本项目(AI SEO / AI 可见性)相关

| 若涉及 | 官方要求 |
|--------|---------|
| **分析 / 埋点**(5.3) | **必须用 Web Pixel extension** 采集,**不得用 script tag** |
| **广告**(5.1) | Web Pixel extension + 支持 Shopify segments + customer segment action extension |
| **邮件营销**(5.6) | Web Pixel + 双向同步客户信息 + Shopify segments + visitors API |

> SEO app 若做流量/AI 可见性统计,任何埋点走 **Web Pixel extension**,别插 `<script>`。

## 其他品类速查

- **Carrier service**:响应 p95 <500ms、成功率 99.9%。
- **Discount**:用 discount functions / 原生 discount API,**不得用 draft order** 做自定义折扣。
- **Subscription**:用 Selling plan / Subscription contract / Customer payment method API + Customer Account UI extension。
- **Fulfillment**:28 天内 ≥100 单、完成率 99%、加追踪 1 小时内 80%。
- **Returns**:同步全生命周期 + 支持 Customer Account API。

---

## ✅ Do / ❌ Don't
- ✅ 埋点/分析一律 Web Pixel extension。
- ❌ 用 script tag 注入分析代码;❌ 用 draft order 变相打折。

## 自检
- [ ] 确认本 app 品类,对照上表技术要求。
- [ ] 若有埋点:走 Web Pixel extension,无 script tag。
