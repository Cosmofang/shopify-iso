# 反模式禁忌集（Anti-patterns）

> 本页只把官方 BFS 拒审理由标成“硬判据”。经验值、设计建议和 ISO 质量门不能伪装成自动打回条件。

## BFS 硬判据速查

| 反模式 | 正确方向 | 条款 |
|---|---|---|
| 主按钮使用与 Shopify Admin 明显不一致的绿、紫或品牌色 | 使用当前 `s-button variant="primary"` 语义样式 | 4.1.1 |
| 文字/组件对比不足 | 当前语义组件 + WCAG 2.1 AA | 4.1.1 |
| 大量 serif/script、异常正文尺寸或不合理 card/spacing | 跟随当前 Web Components 与 Admin 视觉 | 4.1.1 |
| 整页横滚、内容不可访问、桌面列在手机不堆叠 | 响应式堆叠、展开或局部滚动 | 4.1.2 |
| App name 截断或存在重复 Home 项 | <=20 字符；`rel="home"` 路由，不渲染可见 Home | 4.1.3 / 4.1.4 |
| 字段只标红、错误消失或离字段太远 | 持久、红色、就近的可行动文案 | 4.2.4 |
| 相关动作没有主次或错误动作最突出 | 最合理、最安全动作视觉最强 | 4.2.5 |
| 加载、延时或无关操作自动弹 modal/popover | 用户直接触发；信息用页面内合适模式 | 4.3.3 |
| 红色用于促销、普通状态或装饰 | 红色只用于错误/破坏性 | 4.3.3 |
| 大表单无组织、同区多个 banner、大段难扫读文本 | 分组、精简、减少并列提醒 | 4.3.4 |
| 图标/AI 视觉冒充 Shopify 或 Sidekick | 独立品牌识别，避开 Shopify 标识和 magic purple | 4.3.5 |

## 过期 API / 错误实现假设

| 不再使用 | 当前做法 |
|---|---|
| `s-button variant="plain"` | `tertiary`，或正文导航使用 `s-link` |
| `s-button fullWidth` | 由父级 layout 控制可用列宽 |
| `onclick="modal.show()"` 作为首选示例 | `commandFor="id" command="--show"` |
| App nav 中可见 Home link | 首页 link 使用 `rel="home"` |
| 固定 `1280px` 页面宽、12px Card radius、固定 primary hex | 当前组件语义属性和真实 Admin 渲染 |
| 强制 Inter、固定字重、所有间距必须 4px 倍数 | 当前 Web Components 与官方可读性/层级指导 |

## ISO 质量门，不是 BFS 数值阈值

- `375/390/412/768px` 视口覆盖、16px 窄屏边距起点、44x44px 自定义触控目标。
- Zone B 自定义控件的键盘、焦点、非文本对比和状态测试。
- loading、skeleton、空状态、console 和 a11y warning 检查。

完整判据见 [../00-built-for-shopify/requirements.md](../00-built-for-shopify/requirements.md)，提交前使用 [../00-built-for-shopify/pre-submission-checklist.md](../00-built-for-shopify/pre-submission-checklist.md)。
