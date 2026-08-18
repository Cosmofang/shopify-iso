# 图表与数据可视化 Charts & Data-viz

> 当前 Polaris Web Components 没有专用 chart primitive。图表属于 Zone B：可使用维护良好的图表库或经过验证的 SVG/Canvas/HTML 实现，但必须与 App Design Guidelines、WCAG、响应式和性能要求共同验收。

## 先选表达方式

- 少量精确数值优先使用文字、summary 或 table；不要为装饰强行画图。
- 多对象比较使用 bar/table；时间变化使用 line；组成比例只有类别少且差异清楚时才考虑 donut。
- 复杂报表仍需在 App homepage 提供对商家有用的简化指标（BFS 3.1.4 / 4.2.3）。
- 商家需要读取精确值时，提供 data table、可访问描述或逐点详情，不能只靠像素位置和颜色。

## 颜色

- 状态色与类别色分开：success/warning/critical 只表达对应语义，类别序列使用独立、稳定的 categorical palette。
- 同一类别跨图保持同色；图例、tooltip 和表格使用同一名称。
- 红色不能用于普通类别、负向趋势装饰或吸引注意，除非数据确实表达错误/阻断状态（BFS 4.3.3）。
- AI 图表和图例同样不得用 Sidekick icon 或 magic purple 冒充 Shopify（BFS 4.3.5）。
- 不只靠颜色区分序列；同时使用标签、形状、线型、直接标注或可访问表格。
- 自定义色与其文字、背景、网格和交互状态分别做 WCAG 对比检查。

## 响应式

- 容器宽度随父布局变化，避免固定宽度撑破视口。
- 窄屏可减少非必要刻度、换成纵向列表、允许图表容器局部横滚，或提供 table 视图。
- 整页不能横滚；隐藏或截断内容必须有展开、换行、tooltip 或局部滚动机制。
- Resize 后保持轴、标签和点击区域稳定，不让 loading、legend 或数据变化造成明显布局跳动。

## 可访问性

- 图表标题说明指标、范围和时间段；单位不能只靠猜测。
- 关键趋势和异常提供文字摘要，精确数据提供表格或等价结构。
- 纯装饰图形 `aria-hidden="true"`；信息图形提供可访问名称/描述，但避免读屏重复播报同一数据。
- Tooltip 必须可由键盘和触控访问，不依赖 hover；焦点顺序与视觉顺序一致。
- 动画尊重 `prefers-reduced-motion`，且信息不能只通过动画出现。

## 品牌与资产

- 第三方 logo 使用有授权、随应用发布的高分辨率资产，并保留来源与更新责任。
- 不依赖 Google favicon 或临时 CDN 作为生产唯一来源；它们可能失效、低清或违反品牌规范。
- 同一列表中的 logo/icon 尺寸和有无规则一致，避免 BFS 4.1.1 的不完整视觉表现。

## Token 与 Zone B

- 先在目标 Admin 环境验证 CSS custom property 的实际作用域；不存在的 token 会使声明失效。
- 不把固定 hex fallback 当成通用 BFS 规则。需要自定义 palette 时在 App 自有 design token 中命名、记录用途和对比证据。
- 官方组件能表达的按钮、banner、badge、table、layout 仍使用官方组件，不随图表一起 hand-roll。

## 验收

- [ ] 每张图都有明确标题、单位、时间范围和文字/表格等价信息
- [ ] 类别不只靠颜色区分，红色和 AI 视觉符合 BFS 语义边界
- [ ] 键盘、触控、读屏和 reduced-motion 状态可用
- [ ] 多个移动视口无整页横滚，图表内容仍可访问
- [ ] 加载、空、部分数据、失败和大数据量状态均已验证
- [ ] 自定义库/代码有 Zone B 理由、依赖治理和性能证据

动效边界见 [../03-patterns/animation.md](../03-patterns/animation.md)，颜色语义见 [../03-patterns/color-usage.md](../03-patterns/color-usage.md)。
