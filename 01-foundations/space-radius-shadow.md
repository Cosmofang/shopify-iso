# 间距 / 圆角 / 边框 / 阴影

> 全部基于 **4px grid**。用 token，别写死 px。

---

## 1. 间距 Space（4px 基数）

| Token | px | | Token | px |
|-------|----|-|-------|----|
| `--p-space-0` | 0 | | `--p-space-500` | 20 |
| `--p-space-050` | 2 | | `--p-space-600` | 24 |
| `--p-space-100` | 4 | | `--p-space-800` | 32 |
| `--p-space-150` | 6 | | `--p-space-1000` | 40 |
| `--p-space-200` | 8 | | `--p-space-1200` | 48 |
| `--p-space-300` | 12 | | `--p-space-1600` | 64 |
| `--p-space-400` | 16 | | `--p-space-2000` | 80 |

### 组件常用间距
| 场景 | 值 |
|------|----|
| 按钮组间距 | 8px (`space-200`) |
| Card 内边距 | 16px (`space-400`) |
| Card 区块间距 | 16px |
| 表格单元格内边距 | 6px (`space-150`) |
| 页面区块纵向间距 | 16–24px |

## 2. 圆角 Border radius

| Token | px | 用途 |
|-------|----|------|
| `--p-border-radius-100` | 4 | 输入框、小元素 |
| `--p-border-radius-150` | 6 | 小按钮 |
| `--p-border-radius-200` | 8 | **按钮、下拉框** |
| `--p-border-radius-300` | 12 | **Card 卡片** |
| `--p-border-radius-400` | 16 | 大容器 |
| `--p-border-radius-500` | 20 | 弹窗 |
| `--p-border-radius-full` | 9999 | 圆形/胶囊（头像、Badge） |

> 常记：输入框 4px、按钮 8px、卡片 12px。

## 3. 边框宽度 Border width

| Token | px |
|-------|----|
| `--p-border-width-025` | 1（默认） |
| `--p-border-width-050` | 2 |
| `--p-border-width-100` | 4 |

## 4. 阴影 Shadow（分级）

| Token | 用途 |
|-------|------|
| `--p-shadow-0` | 无 |
| `--p-shadow-100` | Card 静态轻浮起 |
| `--p-shadow-200` | Card 悬停 |
| `--p-shadow-300` | 弹出层 |
| `--p-shadow-400` | 下拉菜单 |
| `--p-shadow-500` | 模态框 |
| `--p-shadow-600` | Toast/通知 |
| `--p-shadow-button` | 按钮默认 |
| `--p-shadow-button-primary` | 主按钮 |

## ❌ 禁忌
- 间距/圆角非 4px 倍数（别用 5px/10px/15px）。
- 卡片用 8px 圆角（应 12px）、按钮用 4px（应 8px）。
- 焦点用 `outline` 破坏圆角——**改用 box-shadow 焦点环**（保护圆角，见 [../02-components/forms-fields.md](../02-components/forms-fields.md)）。
- 自定义超大阴影，脱离 Polaris 分级。
