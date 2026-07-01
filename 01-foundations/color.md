# 颜色 Tokens（Color）

> 基准 Polaris v14+。**所有颜色用 token，不写死 hex。** hex 仅作 Figma/文档对照。
> ⚠️ 主按钮 = 黑（`--p-color-bg-fill-brand`），**不是**绿 `#008060`（旧值已废）。

---

## 1. 背景 Background

| Token | HEX | 用途 |
|-------|-----|------|
| `--p-color-bg` | `#f1f1f1` | 页面底色 |
| `--p-color-bg-surface` | `#ffffff` | 卡片/面板 |
| `--p-color-bg-surface-hover` | `#f7f7f7` | 悬停 |
| `--p-color-bg-surface-active` | `#f3f3f3` | 按下 |
| `--p-color-bg-surface-selected` | `#f1f1f1` | 选中 |
| `--p-color-bg-surface-secondary` | `#f7f7f7` | 次级面 |
| `--p-color-bg-surface-tertiary` | `#f3f3f3` | 三级面 |
| `--p-color-bg-inverse` | `#1a1a1a` | 反色背景 |

## 2. 语义背景 Semantic surfaces

| Token | HEX | 用途 |
|-------|-----|------|
| `--p-color-bg-surface-info` | `#eaf4ff` | 信息 |
| `--p-color-bg-surface-success` | `#cdfed4` | 成功 |
| `--p-color-bg-surface-caution` | `#fff8db` | 注意（轻） |
| `--p-color-bg-surface-warning` | `#fff1e3` | 警告 |
| `--p-color-bg-surface-critical` | `#fee8eb` | 错误/危险 |
| `--p-color-bg-surface-emphasis` | `#f0f2ff` | 强调 |
| `--p-color-bg-surface-magic` | `#f8f7ff` | AI / Magic |

## 3. 填充 Fill（按钮/标记实心色）

| Token | HEX | 用途 |
|-------|-----|------|
| **`--p-color-bg-fill-brand`** | **`#303030`** | **主按钮 rest**（深色，主操作） |
| `--p-color-bg-fill-brand-hover` | `#1a1a1a` | 主按钮悬停（官方变更深） |
| `--p-color-bg-fill-success` | `#047b5d` | 成功填充 |
| `--p-color-bg-fill-warning` | `#ffb800` | 警告填充 |
| `--p-color-bg-fill-caution` | `#ffe600` | 注意填充 |
| `--p-color-bg-fill-critical` | `#c70a24` | 错误/危险填充（含删除主按钮） |
| `--p-color-bg-fill-info` | `#91d0ff` | 信息填充 |

> ❌ **禁止**：`#008060`（旧品牌绿）、`#D86A2A`（deeplumen 品牌橙 `--dl-brand`）当主按钮色。品牌色只用于**店铺前台 widget**等自定义语境，不进 Admin 语义色。

## 4. 文字 Text

| Token | HEX | 对比(白底) | 用途 |
|-------|-----|-----------|------|
| `--p-color-text` | `#303030` | 12.6:1 ✅ | 主文字 |
| `--p-color-text-secondary` | `#616161` | 5.7:1 ✅ | 次要文字 |
| `--p-color-text-disabled` | `#b5b5b5` | 1.9:1 | **仅** disabled |
| `--p-color-text-critical` | `#8e0b21` | — | 错误文字 |
| `--p-color-text-caution` | `#4f4700` | — | 警告文字 |
| `--p-color-text-success` | `#014b40` | — | 成功文字 |
| `--p-color-text-info` | `#003a5a` | — | 信息文字 |
| `--p-color-text-emphasis` | `#005bd3` | — | 链接/强调 |
| `--p-color-text-brand-on-bg-fill` | `#ffffff` | 17.4:1 ✅ | 黑主按钮上的白字 |

> ⚠️ 禁用 `#8c9196`（3.4:1，不达 AA）。次要文字一律 `#616161` 起步。详见 [../00-built-for-shopify/wcag-contrast.md](../00-built-for-shopify/wcag-contrast.md)。

## 5. 边框 Border

| Token | HEX | 用途 |
|-------|-----|------|
| `--p-color-border` | `#e3e3e3` | 默认边框 |
| `--p-color-border-secondary` | `#ebebeb` | 次要 |
| `--p-color-border-focus` | `#005bd3` | 焦点环 |
| `--p-color-border-critical` | `#fec1c7` | 错误边框 |
| `--p-color-border-success` | `#92fcac` | 成功边框 |
| `--p-color-border-caution` | `#ffeb78` | 注意边框 |

## 6. 图标 Icon

| Token | HEX |
|-------|-----|
| `--p-color-icon` | `#4a4a4a` |
| `--p-color-icon-secondary` | `#8a8a8a` |
| `--p-color-icon-critical` | `#e22c38` |

---

## 语义用色总则（BFS 4.3.3）

| 颜色 | 只用于 |
|------|--------|
| 🔴 红 critical | 错误信息、破坏性操作（删除） |
| 🟢 绿 success | 成功状态/正向趋势 |
| 🟡 黄 caution/warning | 警告 |
| 🔵 蓝 emphasis/info | 链接、信息、中性强调 |
| ⚫ 黑 brand fill | 主操作按钮 |

> 详见 [../03-patterns/color-usage.md](../03-patterns/color-usage.md)。
