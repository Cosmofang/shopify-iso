# BFS Section 4 设计/体验提交前清单

> 本清单覆盖官方 Section 4 的人工拒审判据，不是完整 BFS 资格清单。
> 同时检查 [App Store 174 条前置](app-store-requirements.md)、[BFS 77 条官方要求总矩阵](official-requirements-matrix.md)、[App Store + BFS 逐项证据账本](requirements-ledger.md)、Dev Dashboard → Distribution 和 [Engineering 技术骨架](../05-engineering/README.md)。

用法：在真实 dev store 中，用桌面和 Shopify 手机 App 逐页、逐状态验证。每项要有截图、录屏或可复现步骤，不能只凭代码搜索打勾。

## 4.1 Familiar

### 4.1.1 Follow UX best practices

- [ ] 页面无闪烁、反复加载进出、明显布局跳动或未完成/有 bug 的状态
- [ ] 大多数内容位于与 Shopify Admin 相似的 card-like 容器，且没有无意义嵌套卡片
- [ ] 主按钮使用当前 Polaris primary 语义样式，无绿、紫或品牌色 CSS 覆盖
- [ ] 正文没有大量使用 serif/script 字体，字号与 Admin 接近
- [ ] 页面背景与 Admin 一致，无整页黑底或强烈品牌底色
- [ ] Tabs 只改变其下方内容；切换时 tabs 位置不移动、不换行
- [ ] 同组/列表图标规则一致，不是部分有、部分无
- [ ] 页面间距遵循 Polaris scale，没有明显过密或过疏
- [ ] 正文和带文字组件满足 WCAG 2.1 AA 对比度
- [ ] 每个子页面都有返回父页面的 back button

### 4.1.2 Mobile-friendly

- [ ] Shopify 手机 App 中整页无需横向滚动
- [ ] 折叠、截断或宽内容都有展开、换行或局部滚动机制，没有内容完全不可访问
- [ ] 桌面多列在窄屏合理堆叠，没有不合理挤压
- [ ] 375px 等 ISO 保守视口下内容不贴边，表格/图表不撑破视口
- [ ] 触控目标足够大（团队保守基线 44×44px）

### 4.1.3 Concise app name

- [ ] 桌面 App pinned 后（pin icon 不再显示），名称完整可见、无 `…`
- [ ] Admin app name 不超过 20 字符；可短于 listing name，但两者可识别为同一 App

### 4.1.4 Use the nav menu

- [ ] 使用 App Bridge `s-app-nav`，没有自绘 App 主导航
- [ ] 进入子页面后正确高亮对应父导航项
- [ ] 点 App 名直接进入首页，未再添加重复 Home 导航项
- [ ] 导航项没有 emoji，标签简洁清楚

### 4.1.5 Use the contextual save bar

- [ ] 合理的设置/编辑表单在 dirty 时显示 Contextual Save Bar
- [ ] CSB 的 Save 和 Discard 都可用且结果正确
- [ ] CSB 出现后，商家不能绕过 Save/Discard 直接离开并丢失修改

### 4.1.6 Use modals appropriately

- [ ] `s-modal` 使用 `heading`，主/次操作位于 `primary-action` / `secondary-actions` slots
- [ ] 没有把 modal action 放在 slots 外
- [ ] 没有使用 deprecated Polaris Fullscreen bar；全屏流程使用当前 `s-app-window` / `s-page` 模式

## 4.2 Helpful

### 4.2.1 Spelling, grammar and phrasing

- [ ] headings、navigation、CTA 无明显拼写或语法错误
- [ ] 字段、单位、日期和操作文案有足够上下文，不使用难懂的孤立标签

### 4.2.2 Helpful onboarding

- [ ] Onboarding 能引导商家完成核心功能，并以真实 App 状态确认完成
- [ ] 内容简洁且容易定位；已特别检查官方点名的折叠或当前视野外风险
- [ ] 没有把安装另一个 App 暗示为必需步骤
- [ ] 索取商家信息时在字段附近明确说明具体用途
- [ ] 完成 onboarding 后可自动移除、关闭或收起相关 UI
- [ ] 官方推荐项已评估：不超过 5 步、自动勾选、显示进度、复杂流程可稍后继续
- [ ] 中途退出、刷新或换设备后进度正确；在 onboarding 外完成任务也会同步
- [ ] 首次加载不自动弹 onboarding modal/popover，使用页面内 Setup guide；ISO 保守方案为初始可视区域内展开

### 4.2.3 Helpful homepage

- [ ] 有 theme app block/embed 时，首页使用 `app.extensions()` 等当前 API 显示激活状态
- [ ] 首页显示对商家明显有价值的指标、状态或近期表现
- [ ] 关闭所有可 dismiss 内容后，首页仍有动态价值，不只剩欢迎语和静态链接

### 4.2.4 Helpful error messages

- [ ] 错误保持可见直到问题解决，不只用数秒后自动消失的 toast
- [ ] 错误使用红色；非错误不使用 critical 红
- [ ] 字段红框同时有具体错误文案
- [ ] 上下文错误显示在相关字段附近，而不是只放在页面顶部
- [ ] 字段错误在商家交互或提交后出现，不在首次加载时提前报错
- [ ] 文案说明问题和解决方向，不使用孤立的 `Error` / `Invalid`

### 4.2.5 Guide merchants to logical actions

- [ ] 相关操作组有清楚主次，不是所有按钮同一视觉权重
- [ ] 视觉最强的按钮代表最合理、最安全的下一步

### 4.2.6 Visible previews

- [ ] 可视化定制提供实时预览
- [ ] 桌面端控件与预览可同时看到，无需切换或上下滚动才能对照

## 4.3 User-friendly

### 4.3.1 Don't make false claims

- [ ] 没有保证、承诺或强烈暗示销售额、排名、转化等结果
- [ ] 展示其他 App 的评分时，与其当前 App Store 评分一致

### 4.3.2 Don't pressure merchants

- [ ] 没有用于逼迫升级的可见/动画倒计时
- [ ] CTA 没有羞辱、内疚或贬低商家的措辞
- [ ] 没有用奖励换取五星评价

### 4.3.3 Don't distract merchants

- [ ] 页面加载、固定延时或无关操作不会自动出现 modal/popover
- [ ] Banner/Card 等大元素不会在加载、延时或无关操作后夸张入场
- [ ] 没有与商家操作无关的吸睛动画，例如持续摇晃的升级按钮
- [ ] 红色只用于错误信息或破坏性操作

### 4.3.4 Don't overwhelm merchants

- [ ] 大型表单按逻辑分组，不一次展示未组织的复杂字段
- [ ] 同一区域没有两条或更多相邻 Banner
- [ ] 页面文案简洁、可扫读，不用多段大文本占据主要位置

### 4.3.5 Don't impersonate Shopify

- [ ] App 图标、品牌和界面不会被误认成 Shopify 官方 App
- [ ] AI 功能不使用 Sidekick 图标或类似 Shopify magic purple 的颜色

### 4.3.6 Dismissible ads

- [ ] 广告和促销内容可以关闭
- [ ] 关闭后相同或相似促销不会再次出现

### 4.3.7 Label and disable premium features

- [ ] 付费功能不会看似启用并允许操作，最后才揭示需要升级
- [ ] 视觉状态与交互状态一致：可交互不装成禁用，不可交互不装成启用
- [ ] 每个锁定功能清楚标明解锁所需套餐
- [ ] Shopify Plus 专属功能对非 Plus 商家完全隐藏

## ISO 追加质量门

以下不是官方页面列出的单独拒审示例，但用于防止常见质量回归：

- [ ] 异步操作有 loading/skeleton，不白屏、不重复提交
- [ ] 列表和表格有有意义的空状态与下一步
- [ ] 键盘 Tab 焦点清晰，modal 支持 Esc、焦点陷阱和焦点回归
- [ ] 同类操作使用一致组件；自定义 Zone B 说明官方组件为何不适用
- [ ] 浏览器 console 无阻断错误或重复 a11y warning

## 验证与提交

1. 进入含 `shopify.app.toml` 的真实 App 目录，运行 `shopify app dev`。
2. 桌面逐页验证全部正常和异常状态。
3. 用 Shopify 手机 App 真机验证，不只依赖 DevTools 模拟。
4. 用键盘完成主流程；用 DevTools Accessibility 抽查对比度。
5. 先核对 App Store 通用 67 条与所有适用类别，再核对 BFS 77 条。
6. 回到 Dev Dashboard → Distribution 核对前置、性能、集成和类别要求。
7. 检查 BFS changelog；未来生效要求记录适用条件、截止日期和负责人。
8. 所有适用项有证据且通过后再申请 BFS；获得 BFS 后按状态生命周期持续监控。

关联：[App Store 前置](app-store-requirements.md) · [Design 详细判据](requirements.md) · [官方总矩阵](official-requirements-matrix.md) · [逐项证据账本](requirements-ledger.md) · [状态生命周期](status-lifecycle.md) · [本地真机自测](local-self-test.md)
