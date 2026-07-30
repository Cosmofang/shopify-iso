# 集成 Integration（BFS 3）

> app 要真正「长在」Shopify Admin 里,主流程别甩到外部站点。
> 官方:https://shopify.dev/docs/apps/launch/built-for-shopify/requirements

---

## 3.1 嵌入式 app

- **3.1.1 嵌入 admin**:用最新 App Bridge(`app-bridge.js` 放 `<head>`);**不得嵌入外部网页**。
- **3.1.2 主流程留在 Shopify 内**:商家不该为完成**主要工作流**跳到外部网站/界面。
- **3.1.3 无缝注册**:装完即可用,**不需再单独注册**一次。
- **3.1.4 首页露关键指标**:在 app 首页展示对商家有用的核心数据。
- **3.1.5 第三方连接设置在 Shopify 内**:连接配置要能在嵌入界面里完成。

## 3.2 安装与资源管理

- **3.2.1 干净卸载**:主题相关用 **theme app extension**,卸载时区块**自动、完整移除**。
- **3.2.2 不动主题文件**:默认不得用 Asset API 增删改商家主题文件;读取仍可用。

官方只允许三类写入例外,且申请 BFS 时会审计 Asset API 使用:

1. Page builder 为提供替代主题定制体验而新增/替换全部 layout/template 文件。
2. 备份全部主题文件并从备份恢复。
3. App 的主要功能是 SEO、content locking 或 developer tooling。

> 命中例外不代表可以任意改主题。仍应优先 Theme App Extension,并为每个写操作记录必要性、回滚与卸载行为。

链接的 Asset API legacy 页面还列出“adding Liquid to repeating blocks”作为可能申请 `write_themes` scope 豁免的第 4 类用途，但 **BFS 3.2.2 没有把它列为 BFS 例外**。目标为 BFS 时继续按上面 3 类执行；App Store scope 获批不自动等于 BFS 合规。

---

## ✅ Do
- `<head>` 引最新 App Bridge;导航用 `s-app-nav`/App Bridge NavMenu(见设计章 4.1.4)。
- 首页(`app._index`)露关键指标。
- 主流程全在嵌入页内完成。

## ❌ Don't
- ❌ 嵌入外部网页 / 把主流程甩到外站。
- ❌ 装完还要求二次注册。
- ❌ 用 Asset API 改主题文件。

## 自检
- [ ] 最新 App Bridge 已嵌;无外部网页嵌入。
- [ ] 首页有关键指标;主流程不出 Shopify。
- [ ] 第三方账号可在内嵌 App 内连接和断开;安装后无无必要的二次注册。
- [ ] 若碰主题,用 theme app extension,卸载可干净移除。
- [ ] Asset API 写操作为 0,或逐项符合官方三类例外并有审计证据。
