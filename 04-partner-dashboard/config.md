# Partner Dashboard 配置（4.1.3 / 4.1.4）

> 这两条**改后台配置，不改代码**。需要你登录 Partner Dashboard 手动操作。

---

## 4.1.3 App 名不截断

**问题**：桌面「取消固定」后，App 名在 Shopify 左侧导航被 `…` 截断。
**当前**：上架名 "Deeplumen: AI SEO Optimizer"（过长）。
**目标**：短到不截断（建议 ≤ ~30 字符，实测为准）。候选：**"Deeplumen SEO"** / **"Deeplumen"**。

**操作步骤**：
1. 登录 https://partners.shopify.com → **Apps** → 选中你的 App。
2. **App listing / Distribution**：改 App 展示名为短名。
3. 同步改 `lumi-app/shopify.app.toml` 的 `name`（当前是 "GWDG deeplumen"，统一成最终短名）。
   > ⚠️ 改 toml 属于 App 配置，不是改 lumi-app 的 UI 代码；若你要我改，单独说。
4. `shopify app deploy` 使配置生效（或在 Dashboard 保存）。

**验证**：桌面 Admin 左侧导航 unpin 后，App 名**完整无 `…`**。

---

## 4.1.4 导航指向首页

**问题**：App 名与首页跳转分离，或另设重复的首页导航项。
**目标**：点左侧「App 名」直接进 App 首页。

**操作步骤**：
1. Partner Dashboard → 你的 App → **Configuration** → **URLs**。
2. **App URL** 设为首页地址（生产域名下的首页路由，如 `https://<your-host>/app` 或 `/app/home`）。
3. 确认 `s-app-nav`（`lumi-app/app/routes/app.tsx`）里**没有**与「首页」重复的多余导航项。
   > 现状导航第一项是 `Home → /app/home`，且 App 名会走 App URL；确认二者不产生「双首页入口」。若重复，去掉多余项（此为下一轮代码整改，本轮不动 lumi-app）。

**验证**：在 Admin 点左侧 **App 名** → 直接落在首页（不是空白页或二次跳转）。

---

## 备注
- 这两项配置改完，务必回到**桌面 Admin 真机**核验截图，作为 BFS 复审证据。
- 其余 6 条（按钮/对比度/移动端/错误信息/自动弹窗/红色）是代码整改，见 [../00-built-for-shopify/rejection-2026-fixes.md](../00-built-for-shopify/rejection-2026-fixes.md)。
