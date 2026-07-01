# 鉴权 Authentication

> 嵌入式 app **必须用 session token**(第三方 cookie 在跨域受限浏览器里失效)。
> 官方:https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens

---

## Session token（会话令牌）

- **格式**:JWT(HS256),载荷含 `iss/dest/aud/sub/exp`。**寿命仅 1 分钟**。
- **每次请求经 App Bridge 现取**——不得复用过期 token。
- 前端把 token 放 **Authorization 头** 发给自己后端;后端用**共享密钥验签**。
- **是「认证」不是「授权」**;session token **不能直接调 Shopify API**——调 API 要 access token。

## Token exchange + 托管安装（推荐）

- admin 内渲染的 app 用 **token exchange** 作授权方式:拿 session token 换 access token,**免多次重定向**,性能更好。
- 用 CLI 管配置会自动启用 **Shopify managed installation**(托管安装),安装/改 scope 的流程由 Shopify 处理。
- **React Router 官方模板已内置 OAuth + token exchange**——别自己造。

---

## ✅ Do
- 每请求经 App Bridge `authenticatedFetch` 取新 token,放 Authorization 头。
- 后端用官方中间件验签(`@shopify/shopify-app-react-router`)。
- access token 与 session token 分开:前者调 API,后者仅认证。
- 用 token exchange + 托管安装。

## ❌ Don't
- ❌ 嵌入式 app 依赖 cookie 鉴权(会被质检打回)。
- ❌ 复用过期(>1分钟)token。
- ❌ 用 session token 直接调 Shopify API。
- ❌ 把认证当授权。

## BFS / 自检
- [ ] 嵌入式已用 session token,无 cookie 依赖(App Store 有自动检测)。
- [ ] 用 token exchange,非老式 OAuth 多重定向。
- [ ] `app.tsx` 用 `AppProvider embedded` + `authenticate.admin`。
