# 性能 Performance（BFS 2）

> Shopify 用 **Web Vitals** 在**每次加载**你的 app 时采集性能。达标是 BFS 硬门槛。
> 官方:https://shopify.dev/docs/apps/build/performance/admin-installation-oauth

---

## Admin Web Vitals 门槛（BFS 2.1）

统计口径:**75 百分位、28 天窗口、至少 100 次调用**。

| 指标 | 门槛 | 含义 |
|------|------|------|
| **LCP** 最大内容绘制 | **≤ 2.5s** | 主内容多快显示 |
| **CLS** 累积布局偏移 | **≤ 0.1** | 视觉稳定,元素别乱跳 |
| **INP** 交互到下一帧 | **≤ 200ms** | 点击/键盘响应速度(**仅最新 App Bridge 才采集**) |

## 前提:装最新 App Bridge

- 在 `<head>` 引入 `app-bridge.js` 脚本——**这是达到 BFS 的前提**,能和已作依赖安装的 App Bridge 共存。
- 监控:`shopify.webVitals.onReport` 回调把数据发自己服务器;排查用 `shopify-debug` meta(`content="web-vitals"`)。

## 其他性能门槛

- **Storefront**(BFS 2.2):不得使店面 Lighthouse 分**下降 >10 分**。
- **Checkout**(BFS 2.3):请求 **p95 ≤ 500ms**、失败率 0.1%。

---

## ✅ Do
- `<head>` 引入最新 App Bridge 脚本(开启指标采集)。
- 减少布局偏移(占位/骨架屏)、明确加载进度(降 CLS、提升体感)。
- OAuth 用 **token exchange**(免多重定向,见 [authentication.md](authentication.md))。

## ❌ Don't
- ❌ 只靠 Lighthouse 判断——admin app 跑在 iFrame,Lighthouse 未必准。
- ❌ 白屏无加载态;❌ 内容加载后大幅跳动(高 CLS)。

## 自检
- [ ] `<head>` 有最新 app-bridge.js。
- [ ] Partner Dashboard 里 LCP≤2.5s / CLS≤0.1 / INP≤200ms(p75/28天)。
- [ ] 异步操作有骨架屏/进度,无布局跳动。
