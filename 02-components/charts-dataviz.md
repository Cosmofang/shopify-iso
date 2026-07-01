# 图表与数据可视化 Charts & Data-viz

> Polaris（React 与 Web Components）**没有图表组件**。所有图表一律**纯 CSS/SVG 自绘**。本页给自绘图表的规范做法（甜甜圈 / 圆环 / 竖柱 / 折线趋势 / 进度条）+ 数据色板 + 品牌 logo + 一个必踩的 token 坑。
>
> 来源：Deeplumen「Store Traffic」页桌面 1:1 复刻沉淀。

---

## 核心原则

- Polaris 无 chart primitive → 用 `<div>` / `conic-gradient` / `<svg>` 自绘。
- **数据可视化用色 ≠ 语义 token。** 语义 token（success/critical…）只表达状态；多序列图表（按平台/按分类）用一套**固定数据色板**，别拿语义 token 硬凑。
- 品牌绿 = **`#008060`**（Shopify 绿）；别用随手挑的亮绿（如 `#00A67E`）。
- **进度/图表里的裸 `<div>`/`<svg>` 用 `var(--p-color-*)` 会取不到值 → 必须 hex 兜底**（见文末「坑」）。
- 纯装饰图形 `aria-hidden="true"`；关键数值必须**另有文本**（图例带数字、旁边表格）保证读屏可达。

---

## 数据色板（多序列）

| 序列 | 色 |
|------|------|
| 1 | `#008060`（绿） |
| 2 | `#2C6ECB`（蓝） |
| 3 | `#8C6FE6`（紫） |
| 4 | `#E08600`（橙） |
| 5 | `#9CA3AF`（灰，兜底/Others） |

> 甜甜圈、柱、折线、图例**共用同一映射**，跨图一致。

---

## 甜甜圈 Donut（`conic-gradient`）

```html
<div style="position:relative;width:128px;height:128px;border-radius:50%;
     background:conic-gradient(#008060 0% 52%, #2C6ECB 52% 76%, #8C6FE6 76% 90%, #E08600 90% 97%, #9CA3AF 97% 100%);">
  <div style="position:absolute;inset:24px;background:var(--p-color-bg-surface,#fff);border-radius:50%;
       display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <span style="font-size:18px;font-weight:700;">8,900</span><span style="font-size:11px;color:#616161;">visits</span>
  </div>
</div>
```
- 累加各段 pct 生成 `conic-gradient` 起止；中心白圆用 `absolute; inset` 挖空。

## 圆环进度 Ring（SVG arc）

```html
<svg width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
  <circle cx="52" cy="52" r="42" fill="none" stroke="var(--p-color-border,#e3e3e3)" stroke-width="11"/>
  <circle cx="52" cy="52" r="42" fill="none" stroke="#008060" stroke-width="11" stroke-linecap="round"
          stroke-dasharray="139.9 263.9" transform="rotate(-90 52 52)"/>
  <text x="52" y="52" text-anchor="middle" dominant-baseline="central" style="font-size:21px;font-weight:700;">53%</text>
</svg>
```
- 进度弧 `stroke-dasharray = 周长×pct  周长`；`rotate(-90)` 让 12 点起画。

## 竖向柱状图 Column chart

- 柱高用 **% 相对绘图区**（绘图区 `flex:1` 填满卡片），**不要固定 px** → 卡片变高时柱等比撑满、基线贴卡底、与相邻栏等高。
- 数值标在柱顶（列内 `justify-content:flex-end`）；分类名/百分比在**基线下方**单独一行（baseline 对齐）。
- 绘图区底部一条 `border-bottom` 作基线；柱顶留头（如 `height: (v/max)*82%`）给数值。

## 折线 / 面积趋势 Trend（平滑曲线 + 渐变）

- 平滑：**Catmull-Rom → 三次贝塞尔**（`smoothPath`），别用折线段。
- 面积渐变：`<linearGradient>` 顶 `stop-opacity:0.22` → 底 `0`。
- 描边 `stroke-width=1` + **`vector-effect="non-scaling-stroke"`**（横向拉伸不变粗）。
- **坐标轴文字别放进 `preserveAspectRatio="none"` 的 SVG**（会被横向拉变形）→ Y 轴刻度、X 轴日期用 **HTML** 放 SVG 外（左列 + 下行）；网格线放 SVG 内（横线 + non-scaling-stroke）。
- 图例常配**可点击切系列显隐**（纯 React state 过滤，非动效）；切换分段（By Platform / By Category）用分段控件（深色激活段）。

## 进度条 Bar

```html
<div style="height:8px;background:var(--p-color-border,#e3e3e3);border-radius:999px;overflow:hidden;">
  <div style="width:53%;height:100%;background:var(--p-color-bg-fill-success,#047b5d);"></div>
</div>
```
> hex 兜底**必写**，否则条消失（见坑）。

---

## 品牌 / 第三方 logo

- LLM/品牌 logo 用 **Google favicon 服务**：`https://www.google.com/s2/favicons?domain=<域名>&sz=64`
  （`openai.com` / `claude.ai` / `gemini.google.com` / `perplexity.ai` …）。
- **别用 simpleicons**：`openai` 已 404（商标下架）；`googlegemini` / `perplexity` 渲染不对。
- 上线级项目建议换成**随包的品牌 SVG 资产**（favicon 依赖外部服务 + 低清）。

---

## ⚠️ 坑：token 在裸 div/svg 上取不到值

`var(--p-color-*)` 的作用域**不覆盖任意裸 `<div>`/`<svg>`**（不在 Polaris 组件子树内时）→ 直接写 `background: var(--p-color-bg-fill-brand)` 解析为透明 → **条/块消失**。
**必须带 hex 兜底**：`var(--p-color-bg-fill-brand, #303030)`、`var(--p-color-border, #e3e3e3)`、`var(--p-color-bg-surface, #ffffff)`。

---

## 配套自定义 UI 小模式

- **章节标题带帮助 ⓘ**：14px/600 label + 一个 `.sav-help`（相对定位 + `::after { content: attr(data-tip) }` tooltip，hover 显示）。见 [cards-sections.md](cards-sections.md)。
- **FAQ / 折叠**：用**原生 `<details>/<summary>`** 做手风琴 —— 零 JS、SSR 安全、无水合问题；chevron 用 `[open]` CSS 旋转；每条做成浅灰圆角卡（`--p-color-bg-surface-secondary`）+ 卡间留白。
- **表格行内动作按钮**：`variant="tertiary"`/`plain`（轻）或浅描边小按钮；**黑主按钮每区仅 1 个，不入表**。见 [buttons.md](buttons.md) / [tables.md](tables.md)。
- **自绘 vs 真组件**：能用官方组件就别 hand-roll（例：「How it works」用真 `s-banner tone="info"`，别自己画浅蓝框 → [banners.md](banners.md)）。
- 动效（甜甜圈连接线小球、扫描点阵、跑马灯）见 [../03-patterns/animation.md](../03-patterns/animation.md)。

---

## ✅ Do
- 数据色板一致、跨图复用同一映射。
- 裸 div/svg 的 token 一律带 hex 兜底。
- 轴刻度/日期文字用 HTML 放在拉伸 SVG 外。
- 能用官方组件就用组件。

## ❌ Don't
- ❌ 拿语义 token（success/critical）当多序列图表色。
- ❌ 裸 div 直接 `var(--p-color-*)` 不兜底（透明消失）。
- ❌ 把轴文字塞进 `preserveAspectRatio="none"` 的 SVG（变形）。
- ❌ 用 simpleicons 取品牌 logo（缺失/过时）。
- ❌ 随手挑亮绿；品牌绿固定 `#008060`。

## BFS 注意
- **4.1.1**：语义色（成功绿/错误红）仍须对齐语义；装饰性数据色板可自定义，但文字对底色对比 ≥ 4.5:1。
- **可达性**：纯装饰图 `aria-hidden`；关键数字另有文本（图例/表格）呈现，不靠颜色单独传达。
- **性能（BFS 2）**：图表动效用 transform/opacity，勿改 layout 属性引发 CLS/INP —— 详见 [../03-patterns/animation.md](../03-patterns/animation.md)。
