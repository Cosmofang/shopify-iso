# 卡片与区块 Cards & Sections

> 使用当前 `s-section` 组织有明确主题的内容。组件会按嵌套层级自动处理视觉容器、间距和语义标题；固定 12px 圆角、16px padding 或某个 shadow 不是 BFS 合同。

## 当前写法

```html
<s-section heading="Setup guide">
  <s-stack gap="base">
    <s-paragraph>Complete these steps before publishing.</s-paragraph>
    <s-button variant="primary">Start setup</s-button>
  </s-stack>
</s-section>
```

- `heading` 自动选择合适的标题层级；需要额外屏幕阅读器上下文时用 `accessibilityLabel`。
- `padding="none"` 只用于表格或图片需要贴到 section 边缘的情况，再用 `s-box padding="base"` 恢复局部内容间距。
- 使用 `s-stack`、`s-grid`、`s-box` 的语义值，不把历史 token 或 px 写成当前视觉合同。
- 纯分隔但不需要标题时使用 divider，不为每段内容制造卡片。

## 组织规则

- 大多数页面内容应位于与 Shopify Admin 相似的 card-like containers，但容器必须对应真实信息分组。
- 可交互 Card 最多一个 primary styled action；辅助操作使用 secondary、tertiary、link 或 menu。
- 嵌套 section 只在层级确有意义时使用，通常限制在 2-3 层，避免无意义卡中卡。
- 不把长段文字直接铺在页面背景；用标题、短段落和列表提高可扫读性。
- Tooltip、FAQ 和 disclosure 按实际语义选择当前官方组件或具备完整键盘/ARIA 的 Zone B 实现，不能把某个项目 CSS 模板当成普遍标准。

## BFS 边界

- BFS 4.1.1：大多数内容使用类似 Admin 的容器；不出现大量 nested cards、异常间距、低对比文字或明显自绘风格。
- BFS 4.1.2：窄屏合理堆叠，内容不贴边、不被隐藏，也不造成整页横滚。
- BFS 4.2.5：Card 内相关动作有明确主次。
- BFS 4.3.3 / 4.3.4：红色只用于错误/破坏性；不在同一区域堆多个 banner 或大段文本。

## 自检

- [ ] 每个 section 都有真实内容主题和准确 heading
- [ ] 没有以固定 radius/padding/shadow 检查当前组件
- [ ] 交互式 Card 至多一个 primary，其他动作层级正确
- [ ] 嵌套不超过实际信息层级，移动端内容全部可访问
- [ ] 自定义 disclosure/tooltip 有键盘、焦点和可访问名称证据
