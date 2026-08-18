# Dev Dashboard 配置（BFS 4.1.3 / 4.1.4）

> App name 与 App URL 是发布配置。当前 Shopify 工作流在 Dev Dashboard 的 App version 中维护；BFS 拒审文本仍可能使用旧称 Partner Dashboard / Configuration。审核结果以实际 Admin 中的行为为准。

## Admin app name

- Admin 内 App name 不超过 **20 个字符**，桌面 pinned 后必须完整显示、没有省略号。
- App name 可以短于 Shopify App Store listing name；两者不要求逐字相同，但必须保持可识别的一致性。
- 不把功能描述、SEO 关键词或 slogan 塞进 Admin app name；描述留在 listing。

## App URL / 首页

- App URL 指向真正的 App homepage，例如 `https://app.example.com/app`。
- `s-app-nav` 声明首页路由时使用 `<s-link href="/app" rel="home">Home</s-link>`；它不会渲染成重复可见 Home 项。
- 不用二次重定向、空白中转页或独立可见 Home 导航项替代首页关系。

## 当前发布流程

1. 打开 [Dev Dashboard](https://dev.shopify.com/dashboard)，选择 App。
2. 进入 **Versions**，创建新 version。
3. 在 version 中确认 Admin app name 与 App URL，并检查其他受版本管理的配置。
4. 保存并发布 version；如果配置来自 `shopify.app.toml`，按当前 Shopify CLI deploy 流程创建/发布对应 version。
5. 在真实 dev store / production-like store 中重新打开 App，不能只依赖 Dashboard 表单值。

Dashboard 的标签和入口可能调整；如 UI 与本文不同，优先遵循当前 Dev Dashboard 文档和页面提示，不回退到历史路径猜测。

## 验收证据

- 桌面 Admin：pin App 后名称完整无 `...`。
- 桌面 Admin：点击 App name 直接进入首页，无空白页、二跳或重复 Home 项。
- Shopify mobile：App nav 标签简洁，首页和子页面路由、高亮正确。
- 配置证据：已发布 version 的 name / App URL 截图或导出，以及对应 commit / deploy 记录。

导航实现见 [../02-components/navigation.md](../02-components/navigation.md)。
