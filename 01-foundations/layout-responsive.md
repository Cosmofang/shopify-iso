# 布局与响应式（Layout & Responsive）

> 覆盖页宽、断点、移动端间距（BFS 4.1.2 直接相关）。

---

## 0. Polaris 加载方式（基线）

嵌入式 App 用 Polaris **Web Components**。两种加载路径：

- **CLI / 框架自动（本 App 走这条）**：`@shopify/shopify-app-react-router` 的
  `<AppProvider embedded apiKey={apiKey}>` 会自动注入 App Bridge + `polaris.js` + `shopify-api-key` meta。**无需**手动加 script。
- **手动**（非框架项目）：在 `<head>` 加
  ```html
  <meta name="shopify-api-key" content="%SHOPIFY_API_KEY%" />
  <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
  ```
  TS 类型：`npm i @shopify/polaris-types@latest`（本 App 已装 1.0.1）。

> 结论：lumi-app 的 Polaris 加载**已合规**，不需改。

---

## 1. 页面宽度

| 属性 | 值 |
|------|-----|
| Page 最大宽度 | **1280px** |
| 表单页窄宽 narrowWidth | ~660px |
| 桌面水平内边距 | 32px |
| 移动水平内边距 | **16px** |
| 主内容 : 侧栏 | 2:1 |

> 之前 P2 待办里有「页宽 1180→1280」，整改时对齐 1280。

## 2. 断点 Breakpoints

| Token | 宽度 | 设备 |
|-------|------|------|
| `--p-breakpoints-sm` | 490px | 大手机 |
| `--p-breakpoints-md` | 768px | 平板 |
| `--p-breakpoints-lg` | 1040px | 桌面 |
| `--p-breakpoints-xl` | 1440px | 大屏 |

## 3. 移动端规则（BFS 4.1.2）

- **无横向滚动**：任何页面在 375px 宽不得出现横滚。
- **列自动堆叠**：`s-grid` 多列在窄屏堆成单列。用 `s-stack` 管间距（token 化）。
- **触控目标 ≥ 44×44px**：按钮/链接/图标点击区达标。
- **间距合理**：移动端边距 16px，元素不贴边、不挤压。
- **表格/图表**：放进可横向滚动容器，不撑破视口。
- **字号**：正文 ≥ 13px，别在移动端缩到过小。

### 布局写法（Web Components）
```html
<s-page>
  <s-grid gridTemplateColumns="1fr 1fr 1fr" gap="base">
    <!-- 窄屏自动堆叠 -->
  </s-grid>
  <s-stack gap="base"> … </s-stack>
</s-page>
```
```jsx
/* React 对照 */
<Page><InlineGrid columns={{ xs: 1, md: 3 }} gap="400"> … </InlineGrid></Page>
```

## ❌ 禁忌
- 固定像素宽容器导致移动端横滚。
- 桌面多列在手机不堆叠。
- 触控目标 < 44px。
- 移动端内容贴边（无水平内边距）。

> 自测：`shopify app dev` + DevTools 设备模拟（iPhone 375px），逐页翻。详见 [../03-patterns/mobile.md](../03-patterns/mobile.md)。
