# 动作、布局与结构

本分册覆盖官方组件目录中的 **Actions** 与 **Layout and structure** 两个栏目，共 19 个源码文件。

## 动作组件

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Account connection | 展示第三方账户连接状态并允许连接/断开 | Composition：`s-section` + 状态反馈 + `s-button`；认证和撤销必须真实可验证 |
| Button | 执行 Add、Save、Cancel、Close 等命令，或在 `url` 时导航 | Direct：`s-button`；特定按压语义查 `s-press-button`，链接优先 `s-link` |
| Button group | 排列多个相关动作并保持间距与层级 | Direct：`s-button-group`，仍限制主动作数量 |

### Button 决策

- 一个页面或当前任务只有一个最重要 primary action。
- 普通动作不使用 destructive tone；破坏性动作写清对象和后果。
- 按钮执行命令，链接导航；不能只为视觉样式互换语义。
- Icon-only 只用于熟悉动作，提供 tooltip 与可访问名称。
- loading 时防重复提交并保持按钮尺寸稳定；失败后恢复可操作状态。
- Disabled 不解释原因时会形成死路，优先给可执行条件或权限说明。

## 布局与结构组件

| React 组件 | 历史意图 | 当前方向 |
|---|---|---|
| Bleed | 用负 margin 让内容与容器边缘光学对齐 | Native/custom 或受控 `s-box` 组合；只有明确容器关系时使用 |
| Block stack | 垂直排列、统一 gap | Direct：`s-stack` 的当前 direction/布局合同 |
| Box | 最基础容器和 token 接口 | Direct：`s-box`，不要把每个 Box 变成可见卡片 |
| Callout card | 用媒体和动作突出机会 | Composition：优先 `s-section`/`s-banner`；第三方 App 严格限制推广式打扰 |
| Card | 把同一任务或概念分组 | Current semantic：通常是 `s-section` 或官方 Composition，不机械复制旧 Card |
| Divider | 分隔或组织内容 | Direct：`s-divider`；先用空间和层级，数据行之外少用分隔线 |
| Empty state | 整页或完整集合无数据时解释并推动下一步 | App Home Empty state composition；区分首次为空与筛选无结果 |
| Form layout | 给字段和字段组建立一致结构 | Composition：`s-stack`、`s-grid` 和当前字段组件 |
| Grid | CSS Grid 型复杂布局 | Direct：`s-grid` + `s-grid-item` |
| Inline grid | 水平列与响应式列 | Direct：`s-grid`；列数由任务和内容决定 |
| Inline stack | 水平排列与对齐 | Direct：`s-stack` 当前横向能力，窄屏允许换行/堆叠 |
| Layout | 页面内主次 section 组合 | Current Pattern first，再用 `s-grid`/`s-stack` 补充 |
| Media card | 图文介绍或高亮内容 | Composition；多数工作型 App 不需要营销型 media card |
| Page | Shopify Admin 页面容器、标题和页面级动作 | Direct：`s-page` + App Bridge title/navigation 能力；不要自绘 Admin chrome |

## 页面与 section 层级

- 先用 App Home Homepage、Index、Details、Settings template 定页面骨架。
- 页面级动作影响整个页面或资源；section 动作影响该 section；行级动作贴近行。
- 主内容与支持信息通过网格和顺序建立层级，不靠堆叠彩色卡片。
- 卡片/section 内不再嵌套装饰性卡片；需要 inset 时说明数据或交互关系。
- 宽度、列数、gap 和 padding 由当前组件约束与真实内容决定，不复制历史 token 数值。

## Empty state

| 状态 | 内容重点 | 动作 |
|---|---|---|
| 首次没有对象 | 价值、最短创建路径、必要前置 | 一个明确创建/连接动作 |
| 搜索无结果 | 当前 query/filter 造成无结果 | 清除筛选或修改查询 |
| 权限不足 | 缺失权限、谁能授权 | 请求权限或联系管理员 |
| 加载失败 | 影响范围与可恢复方式 | Retry；必要时支持路径 |
| 功能不适用 | 资格、计划或商店条件 | 查看条件，不伪装成空数据 |

## Account connection

连接组件必须展示当前 provider、账户标识、上次同步/健康状态和断开后果。连接动作进入明确的 OAuth/授权流程；失败不能显示已连接。断开要说明数据保留、同步停止和重新连接方式。第三方服务设置仍应能从 App 内查看和管理。
