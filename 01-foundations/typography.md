# 字体与内容层级（Typography）

> 官方来源：[App Design Guidelines — Visual design](https://shopify.dev/docs/apps/design/visual-design) · [Text](https://shopify.dev/docs/api/app-home/web-components/typography-and-content/text) · [Heading](https://shopify.dev/docs/api/app-home/web-components/typography-and-content/heading)。标准 App Home UI 让 Polaris Web Components 管理字体、字号、字重和行高。

## BFS 4.1.1 硬判据

- 正文大面积使用 serif 或 script 字体会被拒审。
- 正文字号明显偏离 Shopify Admin 会被拒审。
- 文字必须满足 WCAG 2.1 AA 对比度；阈值见 [wcag-contrast.md](../00-built-for-shopify/wcag-contrast.md)。

BFS 没有规定第三方 App 必须手工加载 Inter、必须使用某个固定字重，或所有字号必须来自一张历史 px 表。使用当前 `s-text`、`s-paragraph`、`s-heading` 和 `s-page heading` 是默认实现。

## 当前官方设计指南

- 页面当前主题应是最大的 heading；section 标题依次降低层级。
- Heading 通过字号、字重或两者建立层级，不能只靠颜色；不要用下划线伪装标题。
- Heading、正文和交互文字最小 13px；caption、subheading 等较小辅助文字最小 12px。
- 使用真实语义 heading 顺序，不为视觉效果跳级；页面有明确主标题。
- 正常说明文字不能借 disabled/subdued 外观规避可读性要求。

```html
<s-page heading="Store settings" inlineSize="small">
  <s-section heading="Notifications">
    <s-paragraph>Choose when Shopify should notify your team.</s-paragraph>
    <s-text color="subdued">Last updated two hours ago</s-text>
  </s-section>
</s-page>
```

## 自定义 Zone B

- 继承 Admin/Polaris 字体栈，不单独下载品牌正文体。
- 只有官方组件不能表达的数据可视化、代码或特殊编辑器才自定义排版。
- 自定义文字仍满足 13px/12px 最小值、语义 heading、缩放和对比度要求。
- 归档的 `--p-font-*` 数值只用于遗留迁移核对，不能作为当前 Web Components API。

## 禁止

- 大量 serif/script 正文。
- 复制旧 Polaris React `bodyMd`、`headingMd` 等组件变体到新 Web Components 代码。
- 用颜色代替 heading 层级，或把正常内容做成低对比 disabled 文字。
- 在通用 ISO 中记录某个 App 的字体加载路径或项目整改值。
