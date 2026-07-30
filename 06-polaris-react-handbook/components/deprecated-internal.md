# Deprecated 与 Internal-only 组件

这些页面是最容易误导新项目的部分。`deprecated` 表示 React 组件已不应继续采用；`internal-only` 表示 Shopify 内部团队可直接使用，而第三方 App 应通过 App Bridge 或受支持的 App Home 能力接入。

官方栏目标题 **Internal (shopifolk only)** 本身就是访问边界，不是第三方可绕过的隐藏组件目录。

## 映射表

| React 组件 | 历史状态/问题 | 当前方向 |
|---|---|---|
| Caption | 字体过小，不适合一般阅读 | `s-text` 的当前弱化语义；仍满足可读性 |
| Contextual save bar | 表单有未保存变化时提供 Save/Discard | App Bridge save bar Web Component/API；与真实 dirty state 同步 |
| Display text | 营销式大标题、吸引注意 | `s-heading`/`s-text`；工作型 App 不使用 hero 排版 |
| Frame | 构造完整 Shopify Admin 框架 | 禁止第三方复制；Admin 宿主提供 frame |
| Fullscreen bar | 全屏编辑时替换 Admin chrome | 使用当前 App Bridge/extension 能力；无授权时保持 App Home 页面 |
| Heading | 旧标题组件 | `s-heading`，保持语义层级 |
| Legacy card | 旧 Card API | 当前 `s-section`/Composition |
| Legacy filters | 旧筛选复合组件 | Current Index Pattern 与当前字段组件 |
| Legacy stack | 旧 Flex 布局 | `s-stack` |
| Legacy tabs | 旧 Tabs API | Current Pattern/composition；不要假设 `s-tabs` |
| Loading | Frame 顶部全局加载指示 | 使用当前页面/局部 loading 或受支持 App Bridge 能力 |
| Modal | React overlay，历史页已指向 App Bridge Modal API | 当前 `s-modal`/App Bridge modal，按实际 surface 文档选择 |
| Navigation | App 自绘主导航 | App Bridge nav menu 或 Admin 宿主；不复制 Admin sidebar |
| Page actions | 页面底部重复关键动作 | 页面/section 当前 action slots 或 save bar；避免重复层级 |
| Setting toggle | Card 内开关和说明组合 | `s-switch` + `s-section` composition；说明生效时机 |
| Sheet | 移动端/侧边大 overlay | 重新选择页面、popover 或 modal；无通用直接替代 |
| Subheading | 旧小标题组件 | `s-heading`/`s-text`，按文档层级选择 |
| Text container | 给文字提供垂直间距 | `s-stack` + `s-paragraph`/`s-text` |
| Text style | 用 subdued/strong 等添加视觉语义 | 当前 text tone/emphasis；语义不能只靠颜色 |
| Toast | 短暂动作反馈 | App Bridge toast API；错误和必读信息不能只放 toast |
| Top bar | App 品牌、搜索和全局导航 | Shopify Admin 宿主；第三方 App 不自绘 |
| Visually hidden | 视觉隐藏但供辅助技术读取 | 原生可访问名称/语义或经过验证的 visually-hidden CSS；优先可见标签 |

## Internal-only 的真实含义

源码包含 Contextual save bar、Frame、Loading、Modal、Navigation、Toast 和 Top bar 的 internal-only 页面，与 deprecated 页面存在重复。这不是允许第三方继续 import 的漏洞。官方栏目说明外部 App 开发者应通过 App Bridge APIs 获得这些能力。

## Save bar

- dirty state 来自实际初始值与当前值比较，不因 focus 就出现。
- Save 只在可提交且有变化时可用；保存中防止重复提交。
- Discard 恢复服务器/初始状态并清除字段错误的派生状态。
- 路由离开、关闭和刷新时处理未保存变化。
- 保存成功后再清除 dirty；失败保留输入和 save bar，并给可操作错误。

## Modal

- 只用于必须先处理的短任务、确认或条件变化。
- 不放大型设置页、长表单、教程或持续参考信息。
- 标题写清动作/对象，正文先写后果，按钮不超过清晰层级所需数量。
- 支持 Esc、关闭、取消、外部点击的行为必须与数据风险一致。
- 打开后进入正确焦点，关闭后返回 activator；破坏性确认不能只靠颜色。

## Toast

Toast 适合无需后续动作的短确认，例如复制完成或保存成功。它会消失，因此不能承载错误恢复、权限要求、费用、数据丢失或审查结果。内容简短、避免重复页面已经呈现的状态。

## Admin chrome

Frame、Top bar 和 Navigation 的历史文档说明 Shopify 内部 Admin 结构，不是第三方视觉模板。嵌入式 App 不添加第二套顶部栏、Shopify logo、全局搜索、商店切换、通知区或复制侧边栏。页面 title、nav menu、save bar、modal 和 toast 通过当前 App Bridge 能力接入。

## 遗留项目处置

1. 记录当前 `@shopify/polaris`、React、App Bridge 和 token 版本。
2. 搜索所有 deprecated imports 和内部 chrome 模拟。
3. 先修安全、可访问性和阻断 bug，不在冻结库上扩展新设计系统。
4. 新功能采用当前 Web Components 的垂直流程，避免扩大 React 迁移面。
5. 用页面/流程逐步替换，保留视觉回归、键盘、移动和数据行为证据。

更完整的版本策略见 [遗留 React 维护](../07-legacy-react-maintenance.md)。
