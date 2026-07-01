# BFS 提交前自查清单

> **每次重新提交 BFS 审核前，逐条打勾。** 全绿才提交。
> ⚠️ 反复提交但未修好可能导致 App 临时冻结——这份清单是硬性关卡。

用法：桌面 + 移动视口各跑一遍；在 `shopify app dev` 真机环境里核。

---

## 4.1.1 按钮 & 对比度
- [ ] 所有**主按钮为深色**（`--p-color-bg-fill-brand` / `#303030`，hover `#1a1a1a`），无绿 `#008060`、无自定义彩色主按钮
- [ ] 主按钮用 `<s-button variant="primary">`，无 CSS 背景覆盖
- [ ] 正文文字对背景 ≥ 4.5:1（`#303030` / `#616161`，无 `#8c9196`）
- [ ] 按钮/卡片/导航文字对比 ≥ 4.5:1
- [ ] 自定义（Zone B）元素文字也 ≥ 4.5:1

## 4.1.2 移动端
- [ ] 每页在 375px 宽下**无横向滚动**
- [ ] 多列在窄屏堆叠为单列，内容不挤压/不贴边
- [ ] 触控目标 ≥ 44×44px
- [ ] 移动端水平内边距 16px
- [ ] 表格/图表在窄屏用滚动容器，不撑破视口

## 4.1.3 App 名
- [ ] 桌面 unpin 后 App 名在左侧导航**完整可见、无 `…`**
- [ ] `shopify.app.toml` `name` 与 listing 名一致且够短

## 4.1.4 导航路由
- [ ] 点左侧 **App 名直接进首页**（无二跳、无空白）
- [ ] Partner Dashboard → URLs → **App URL** 指向首页
- [ ] `s-app-nav` 无与「首页」重复的多余项

## 4.2.4 错误信息
- [ ] 每个可校验字段出错时**有文字说明**（非只红框）
- [ ] 错误文案说清**问题 + 解决方向**（可行动）
- [ ] 已逐个触发所有校验分支确认

## 4.3.3 不打扰商家
- [ ] 进任意页面静置 30s **不自动弹** modal/popover
- [ ] 无「延时弹窗」「无关操作触发的弹窗」
- [ ] 引导/公告改用页面内 Banner
- [ ] **红色仅用于**错误信息 & 破坏性操作（删除）
- [ ] 全 App 已排查，无红色装饰/普通标签/促销红字

## 通用（BFS 会一并查）
- [ ] 异步操作有 loading 态（无白屏）
- [ ] 列表/表格有有意义的空状态
- [ ] 键盘 Tab 焦点环清晰可见（未 `outline:none` 裸删）
- [ ] `embedded=true`，未自绘 Shopify 顶栏/搜索/面包屑
- [ ] 同类操作用统一组件，未自绘与 Polaris 冲突的控件

---

## 验证方式
1. `cd lumi-app && shopify app dev` 起真机。
2. 桌面逐页 + DevTools 设备模拟（iPhone 375px）逐页。
3. DevTools Accessibility 面板抽查对比度。
4. 全绿 → Built for Shopify dashboard 重新申请。

> 环境怎么起、桌面/移动在哪看 → [local-self-test.md](local-self-test.md)。

## 关联条款详情
- [requirements.md](requirements.md) · [rejection-2026-fixes.md](rejection-2026-fixes.md) · [wcag-contrast.md](wcag-contrast.md) · [local-self-test.md](local-self-test.md)
