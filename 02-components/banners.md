# 横幅 Banners

> Banner 是持久的页面级或局部系统提醒，可包含 action。它是自动弹窗的常用替代方案之一，但不是所有引导、成功或错误反馈的唯一组件。

## 选择 Banner 的条件

| 场景 | 推荐模式 |
|---|---|
| 页面级系统信息、持续状态、需要 action 的提醒 | Banner |
| 字段或局部任务错误 | 对应字段下方的 inline error |
| 用户刚完成动作的简短成功确认 | Toast |
| 延迟、需要持续显示或带下一步 CTA 的成功 | Success banner |
| Onboarding | 页面内 Setup guide / section；必要时配 banner |

```html
<s-banner tone="info" heading="Connect your store">
  <s-paragraph>Connect the store before publishing this configuration.</s-paragraph>
  <s-button slot="action" href="/app/settings">Open settings</s-button>
</s-banner>
```

使用当前组件和 tone，不写死背景 hex，也不根据某次渲染截图自绘 banner。

## 官方 Alerts 指南

- Informational banner 用于低优先级信息，应可关闭；同一用户会话内关闭后不再出现。
- Warning banner 用于需要注意或采取行动的信息，谨慎使用。
- Error / critical banner 使用红色，说明发生了什么并给出解决路径或支持入口。
- Banner 通常持续到商家关闭或问题解决；阻止继续工作的关键信息可以不可关闭。
- Success banner 只用于反馈延迟、需要持久展示或包含 CTA 的情况。用户即时动作成功通常用 toast。
- 同一区域避免同时出现两个或更多相邻 banner，这是 BFS 4.3.4 的明确拒审风险。

## BFS 边界

- BFS 4.3.3：页面加载、固定延时或无关操作不能自动出现 modal / popover；也不能让大型 Banner/Card 以夸张动画入场。页面内静态提醒、section 或 setup guide 均可按语义选择。
- BFS 4.2.4：字段错误必须持久、红色并在相关字段附近；不能只在页面顶部放一个 banner。
- BFS 4.3.3：红色只用于错误或破坏性语境。
- BFS 4.1.1：文字与背景满足 WCAG 2.1 AA，并使用当前语义组件。

## 自检

- [ ] Banner 的范围与问题范围一致，没有替代字段级错误
- [ ] 一组内容没有两个相邻 banner 造成信息过载
- [ ] Info 可关闭且会话内不重复；critical 是否可关闭由阻断性决定
- [ ] 即时成功使用 toast；success banner 确有延迟、持久或 CTA 理由
- [ ] 没有 hand-roll 固定色值或夸张入场动画
