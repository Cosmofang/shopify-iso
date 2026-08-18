# 颜色用法（BFS 4.3.3）

> **红色只用于错误信息 & 破坏性操作。** 其他一律不用红。需全 App 排查。

---

## 语义色映射

| 意图 | 用色 | Token |
|------|------|-------|
| 主操作 | 当前 primary 视觉 | `s-button variant="primary"` |
| 链接/中性强调 | 当前 link/emphasis 视觉 | `s-link` / 当前语义属性 |
| 信息 | 蓝 | info surface/text |
| 成功/正向 | 绿 | success surface/text |
| 未开始/停滞但非阻断 | 黄 | caution |
| pending/进行中/可能需介入 | 橙 | warning |
| **错误 / 删除** | **红** | critical surface/text/fill |
| 普通正文 | 当前中性文字 | `s-text` / 当前语义属性 |

> `magic` 是 Shopify 自有 Magic/Sidekick 视觉语义。第三方 App 不得用 magic purple 或 Sidekick 图标标记 AI 功能（BFS 4.3.5）。

---

## 实现时先检查颜色关系

- `background` 只作页面基线；card、banner、modal、table 使用 `surface`。
- `fill` 只用于 button、badge 等小面积元素，且必须配对应 `on-fill` 文字/图标。
- `link` 色只给行内文字链接，不用于伪装 text button；独立图标用 `icon` 色，“图标 + 文字”整体用 `text` 色。
- 状态不能只靠颜色表达；同时提供文字、图标、形状或位置线索。
- disabled 使用组件属性和 disabled token，真正移除交互，不能只设 `opacity`。

完整配对、交互状态与历史来源见 [颜色 Foundations](../01-foundations/color.md)。

---

## 红色允许 / 禁止

✅ **允许用红：**
- 表单错误文字/边框
- 错误 Banner（`tone="critical"`）
- 失败状态 Badge（`tone="critical"`）
- 删除/破坏性按钮（`tone="critical"`）
- 持久连接错误等官方允许的特殊 error toast（不能作为唯一错误反馈）

❌ **禁止用红：**
- 普通标签 / 分类标记（「热门」「新品」「promo」）
- 装饰性高亮、图标点缀
- 非错误的强调文字、价格、数字
- 引导/营销文案
- 选中态、hover 态

---

## 排查方法

```bash
# 全 App 搜红色（源码 + 样式）
rg -n -i "#c70a24|#e22c38|#d00|#ff0000|#f00|tone=.critical.|color:\s*red|background:\s*red" \
  app --glob '!node_modules/**' --glob '*.{tsx,jsx,css}'
```
逐条判断：**是错误/删除吗？** 是则保留语义 tone；否则改用当前中性或合适的语义组件。

---

## ❌ 反例 → ✅ 改法

| ❌ 反例 | ✅ 改法 |
|--------|--------|
| 红色「限时」促销文字 | 当前中性或适当强调语义 |
| 红色「必看」标签 badge | 默认灰 badge 或 info 蓝 |
| 红色装饰分隔线 | `--p-color-border` 灰 |
| 红色数字（非错误） | 当前中性文字；下降趋势也不自动等于错误 |

## BFS 注意
- **4.3.3**：要求覆盖整个 App 和全部状态，不能只修 reviewer 举例的位置。
- 配合 [../02-components/badges.md](../02-components/badges.md)、[banners](../02-components/banners.md) 的 tone 规则。
