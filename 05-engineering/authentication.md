# 鉴权 Authentication

> 文档版本：`2.0.0`
> 最后修改：`2026-08-28 10:31 CST (Asia/Shanghai)`
> 最后修改者：`Codex (OpenAI)`
> 本次官方来源：[ID tokens](https://shopify.dev/docs/apps/build/authentication-authorization/id-tokens) · [Access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens) · [React Router authenticate.admin](https://shopify.dev/docs/api/shopify-app-react-router/latest/authenticate/admin) · [BFS 3.1.1](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#embed-the-app-in-the-shopify-admin)

嵌入 Shopify Admin 的 App **必须使用 ID token authentication**，因为第三方 cookie 在该上下文中不可靠。`ID token` 是当前官方名称；旧文档和旧代码中的 `session token` 指同一类此前命名的短期 JWT，不应继续作为新规范标题。

术语迁移尚未在所有要求页同步：App Store `1.1.1` 的官方标题当前仍是 **Use session tokens for authentication**，而 BFS `3.1.1` 和认证指南已使用 **ID token authentication**。审核映射必须保留原要求标题，同时在实现文档中使用现行名称。

## ID token 与 access token

| Token | 证明什么 | 发给谁 | 能否调用 Shopify API |
|---|---|---|---|
| ID token | 已登录 Shopify 用户正在从特定店铺发起请求 | App 自己的后端 | 不能 |
| Access token | App 有权按 scopes 调用 Shopify API | Shopify GraphQL Admin API 等 | 能 |

当前官方 [ID tokens](https://shopify.dev/docs/apps/build/authentication-authorization/id-tokens) 合同：

- App Bridge 为嵌入式 App 签发 ID token；前端把它发给自己的后端。
- ID token 约 1 分钟过期。每次请求获取当前 token，不缓存或假定刚获取的 token 仍有完整 1 分钟寿命。
- 后端验证签名与 `exp`、`nbf`、`aud`、`iss` / `dest` 等 claims；官方 App 模板会代为处理大多数验证。
- 后端通过 token exchange 获得 access token；ID token 永远不直接发送给 Shopify API。
- 标准请求由 App Bridge 的 fetch interceptor 自动附加 ID token。只有 WebSocket 等非标准场景才直接调用 `shopify.idToken()`。
- ID token 只能发给 App 自己的后端，不能转交第三方服务。

## Token exchange 与托管安装

- Admin 内嵌 App 使用 [token exchange](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens#token-exchange-grant) 获取 access token，减少授权重定向。
- Shopify CLI 管理的配置使用 Shopify managed installation 处理安装与 scope 变化。
- 当前 React Router 官方模板已组合 App Bridge、认证、token exchange 与 session storage。路由 loader/action 使用 `authenticate.admin(request)`，不要在模板外再造一套重复 OAuth 或 token 验证流程。
- 独立站式、非嵌入式 App 不能使用 App Bridge ID token，应按官方认证文档使用适用的 authorization code grant。

## 嵌入式恢复与移动端

BFS 3.1.1 要求 App 通过当前 App Bridge 嵌入 Admin；App Store 2.3.2 与 2.3.4 要求安装和重装后立即完成认证。**ISO 保守恢复基线**：移动返回、iframe 重新载入或缺少旧 query 参数时，应由官方模板认证链路恢复到已认证 App UI，不能在 Admin iframe 中暴露项目自建的店铺域名登录表单。

这不等于所有 `/auth/login` 都应无条件跳转。顶层未认证访问、嵌入式恢复和 bot/错误响应必须按真实 request context 分开验证；具体恢复逻辑属于 App 实现，不能从单次 curl 或单个 reviewer 截图推导为 Shopify 通用路由规则。

## Do

- 每个 document 的 `<head>` 加载当前 `app-bridge.js`，并使用官方模板或库完成 ID token 认证。
- loader/action 先执行 `authenticate.admin(request)`；保留官方 `boundary.error` 与 `boundary.headers` 处理认证响应头。
- 将 ID token 与 access token 分开存取、记录和使用。
- 用真实 Shopify Admin 桌面与 Shopify mobile 验证首次安装、返回、刷新、session 过期、卸载和重装。

## Don't

- 不让嵌入式 App 依赖第三方 cookie 作为认证基础。
- 不缓存或复用过期 ID token。
- 不用 ID token 调 Shopify API，也不把 token 发给第三方。
- 不把“认证用户”误写成“已获 API 授权”。
- 不用自建登录页或重复 OAuth 流程替代当前官方模板能力。

## BFS / App Store 自检

- [ ] `3.1.1`：每个 document 加载当前 App Bridge，嵌入式请求使用 ID token authentication，无外站镜像。
- [ ] App Store `2.3.2 / 2.3.4`：首次安装和重装先认证，再进入 UI；不会要求手输 shop domain。
- [ ] ID token 每请求获取、后端验证、仅发给自身后端；access token 才调用 Shopify API。
- [ ] React Router 路由使用 `authenticate.admin(request)` 和官方错误/headers 边界。
- [ ] 桌面与 Shopify mobile 的返回、刷新、过期和重装均有运行证据；仅代码检查保持 `unverified`。
