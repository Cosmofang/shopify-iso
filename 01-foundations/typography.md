# 字体 Tokens（Typography）

> 字体族 **Inter**（Polaris v14 默认）。行高全部对齐 **4px grid**。
> lumi-app 已在 `root.tsx` 加载 Inter：`https://cdn.shopify.com/static/fonts/inter/v4/styles.css`。

---

## 字体族

| Token | 值 |
|-------|-----|
| `--p-font-family-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| `--p-font-family-mono` | `ui-monospace, SFMono-Regular, Menlo, monospace` |

## 字号 Font size

| Token | px | | Token | px |
|-------|----|-|-------|----|
| `--p-font-size-275` | 11 | | `--p-font-size-500` | 20 |
| `--p-font-size-300` | 12 | | `--p-font-size-550` | 22 |
| `--p-font-size-325` | 13 | | `--p-font-size-600` | 24 |
| `--p-font-size-350` | 14 | | `--p-font-size-750` | 30 |
| `--p-font-size-400` | 16 | | `--p-font-size-800` | 32 |
| `--p-font-size-450` | 18 | | `--p-font-size-900` | 36 |

## 字重 Font weight

| Token | 值 | 用途 | Figma 映射 |
|-------|-----|------|-----------|
| `--p-font-weight-regular` | 450 | 正文 | Regular / 400 |
| `--p-font-weight-medium` | 550 | 中等 | Medium / 500 |
| `--p-font-weight-semibold` | 650 | 半粗（标题） | Semi Bold / 600 |
| `--p-font-weight-bold` | 700 | 粗体 | Bold / 700 |

> 标题用 **SemiBold（650）**，不是 Bold。之前 P1 整改已把标题从 700 调到 600。

## 行高 Line height（4px grid）

| Token | px | | Token | px |
|-------|----|-|-------|----|
| `--p-font-line-height-300` | 12 | | `--p-font-line-height-700` | 28 |
| `--p-font-line-height-400` | 16 | | `--p-font-line-height-800` | 32 |
| `--p-font-line-height-500` | 20 | | `--p-font-line-height-1000` | 40 |
| `--p-font-line-height-600` | 24 | | `--p-font-line-height-1200` | 48 |

---

## Text variants 速查（最常用）

| Variant | 字号 | 行高 | 字重 | 场景 |
|---------|------|------|------|------|
| heading2xl | 30 | 40 | Bold | 页面大标题 |
| headingXl | 24 | 32 | Bold | 区块大标题 |
| headingLg | 20 | 24 | SemiBold | 页面标题 |
| headingMd | 14 | 20 | SemiBold | 卡片标题 |
| headingSm | 13 | 20 | SemiBold | 小标题 |
| bodyLg | 14 | 20 | Regular | 正文（大） |
| bodyMd | 13 | 20 | Regular | **正文默认** |
| bodySm | 12 | 16 | Regular | 辅助文字 |
| bodyXs | 11 | 12 | Regular | 极小注释 |

Web Components 用 `<s-text>` / `<s-heading>`；React 用 `<Text variant="bodyMd">` / `<Text as="h2" variant="headingLg">`。

## ❌ 禁忌
- 不用 Inter 之外的字体（官方 Figma MCP 渲染只认自带字体，见项目 memory）。
- 字号不命中上表 scale（别用 15px/17px 等）。
- 标题用 Bold 而非 SemiBold（除页面级大标题外）。
