# 反馈、媒体、导航、Overlay 与 Utilities

## Feedback indicators 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Badge | 表达对象状态或 tone | Direct：`s-badge`；只写状态，不写长句或动作 |
| Banner | 突出持续条件、风险或重要变化 | Direct：`s-banner`；提供影响、恢复和必要动作 |
| Exception list | 用短列表突出异常项目 | Composition：`s-list-item` + 状态/icon，严重问题可配 `s-banner` |
| Progress bar | 展示可量化任务进度 | 无直接通用标签；有真实进度时自定义，未知进度用 `s-spinner` |
| Skeleton body text | 正文低保真占位 | Current loading composition；只为确实未知的正文保留结构 |
| Skeleton display text | 标题占位 | Current loading composition；能显示真实标题就直接显示 |
| Skeleton page | 页面级低保真结构 | Current Template 对应的 loading state，必须匹配最终布局 |
| Skeleton tabs | tabs 占位 | 遗留概念；优先显示稳定 view labels 或当前 Pattern loading |
| Skeleton thumbnail | 图片占位 | 受控 aspect ratio 的图片占位，避免布局位移 |
| Spinner | 无法量化的短时处理 | Direct：`s-spinner`；靠近正在加载的局部内容 |

### Badge 与 Banner

- Badge 描述对象状态，例如 Active、Draft、Failed，不承担完整解释。
- Banner 用于需要商家注意的持续条件，不用于每次普通成功。
- Tone 与真实严重程度一致，不能用 critical 促销或制造紧迫感。
- 多个相关问题合并为一条可操作信息，不在同一区域堆叠 banners。
- 可关闭 Banner 只有在问题可安全忽略时允许关闭；持久阻断条件不能关闭后消失无踪。

### Loading

先显示稳定真实内容，再用结构化占位表示未知部分。Spinner 不是页面模板。加载完成、失败或取消时正确更新 live 状态，避免重复朗读快速变化的百分比。

## Images and icons 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Avatar | 个人或商家的缩略识别 | Direct：`s-avatar`；缺图时使用稳定 initials/fallback |
| Icon | 动作、对象与 wayfinding | Direct：`s-icon`；采用当前 icon 名和可访问策略 |
| Keyboard key | 展示键盘快捷键 | Native `<kbd>`；快捷键仍需可发现且不能阻断标准操作 |
| Thumbnail | 作为对象的视觉锚点 | Direct：`s-thumbnail`，补正确 alt 与固定尺寸 |
| Video thumbnail | 打开视频的可点击预览 | Composition：`s-thumbnail`/`s-image` + button + 当前 modal；标签描述播放内容 |

图像尺寸和 aspect ratio 在加载前确定。对象图片的 alt 描述识别所需信息；相邻文本已经完整识别对象时避免重复朗读。图标颜色不能成为唯一状态信号。

## Typography

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Text | 统一语义元素、variant、tone、alignment 和截断 | `s-text`、`s-heading`、`s-paragraph`，先选语义再选外观 |

旧 Caption、DisplayText、Heading、Subheading、TextStyle 已合并到 React `Text`，当前又分为更明确的 Web Components。不要按视觉大小选 HTML heading；标题层级反映页面结构。截断必须保留查看完整值的方法。

## Navigation 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Footer help | 页面末尾的补充帮助 | 页面内必要帮助优先；外部帮助用 `s-link`，避免模板式固定 footer |
| Link | 导航到页面、资源或外部位置 | Direct：`s-link`；外部/新窗口行为明确 |
| Pagination | 在前后页或资源间移动 | Composition：当前 Pattern + buttons/links；API 优先 cursor |
| Tabs | 同一上下文切换相关 views | 当前 Pattern/composition；无 1.0.7 通用 `s-tabs` 标签，不能猜造 |

Shopify Admin 顶栏、主导航、breadcrumbs 和全局搜索属于宿主 chrome。App 只提供 App Bridge nav menu/title 等允许的入口，不能自绘第二套 Admin 导航。

### Tabs 与页面导航

- Tabs 只切换同一对象/上下文的对等 views，不用于流程步骤。
- 当前 view 在 URL、状态和辅助技术中可识别。
- 标签数量保持可扫描；大量目的地应重新设计信息架构。
- 后退/前进恢复 view、搜索和筛选状态。

## Overlays 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Popover | 按需显示次要信息或动作 | Direct：`s-popover`；短、局部、轻量 |
| Tooltip | 解释陌生图标或补充短说明 | Direct：`s-tooltip`；不放关键任务或交互内容 |

Popover 由明确 activator 打开，Esc/外部动作关闭，并把焦点返回 activator。内容过长、需要复杂表单或必须持续可见时，不使用 popover。Tooltip 不修复含糊按钮标签；触摸与键盘都必须可获得信息。

Modal 的历史与当前替代见 [Deprecated 与 internal-only](deprecated-internal.md)。

## Utilities 映射

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| App provider | 提供 i18n、link、theme 等 React context | 无当前 UI 标签；使用官方模板/CDN/App Bridge 环境，不自行套旧 provider |
| Collapsible | 隐藏可选内容并允许展开 | Native `<details>` 或当前 button + `s-box` composition；状态与关系可访问 |
| Scrollable | 在受限 overlay 内滚动长内容 | Direct：`s-scroll-box`；页面主体避免嵌套滚动区 |

Collapsible 不能隐藏完成任务所必需的信息，也不能作为减少页面长度的默认手段。Scrollable 必须保留键盘、触摸、焦点可见性和内容末端可达性。
