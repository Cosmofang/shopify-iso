# 导航 Navigation

> 覆盖 App 内导航（`s-app-nav`）与 BFS 的 App 名/路由要求（4.1.3 / 4.1.4）。

---

## App 内导航写法

```jsx
// lumi-app app/routes/app.tsx（现状，合规结构）
<AppProvider embedded apiKey={apiKey}>
  <s-app-nav>
    <s-link href="/app/home">Home</s-link>
    <s-link href="/app/conversations">Conversations</s-link>
    <s-link href="/app/analytics">Analytics</s-link>
    <s-link href="/app/settings">Settings</s-link>
  </s-app-nav>
  <Outlet />
</AppProvider>
```

---

## 4.1.3 App 名不截断

- 桌面「取消固定」后，App 名在 Shopify 左侧导航**必须完整可见、无 `…`**。
- 显示名要短（建议 ≤ ~30 字符，实测不截断为准）。
- ❌ "Deeplumen: AI SEO Optimizer"（太长会截断）
- ✅ "Deeplumen SEO" / "Deeplumen"
- 配置：`shopify.app.toml` 的 `name` + Partner Dashboard listing。见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。

## 4.1.4 App 名指向首页

- Shopify Admin 左侧「App 名」点击 = 直接进 **App 首页**。
- **不要**再另设一个「Home/首页」导航项做重复跳转。
- `App URL`（Partner Dashboard → Configuration → URLs）指向首页路由。

---

## ✅ Do
- App 名短、不截断、点击进首页。
- `s-app-nav` 列真实页面，层级扁平清晰。
- 嵌入式 App 依赖 Shopify chrome，不自绘顶栏。

## ❌ Don't
- ❌ 冗长 App 名导致截断（4.1.3）。
- ❌ App 名与首页分离，或加重复首页项（4.1.4）。
- ❌ 自绘 Shopify 顶栏/搜索/面包屑。
- ❌ 导航项文字低对比。

## BFS 注意
- **4.1.3 / 4.1.4**：主要靠 Partner Dashboard 配置，见 [../04-partner-dashboard/config.md](../04-partner-dashboard/config.md)。
- **4.1.1**：导航文字 ≥ 4.5:1。
