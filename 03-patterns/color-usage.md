# 颜色用法（BFS 4.3.3）

> **红色只用于错误信息 & 破坏性操作。** 其他一律不用红。需全 App 排查。

---

## 语义色映射

| 意图 | 用色 | Token |
|------|------|-------|
| 主操作 | 黑 | `--p-color-bg-fill-brand` |
| 链接/中性强调 | 蓝 | `--p-color-text-emphasis` `#005bd3` |
| 信息 | 蓝 | info surface/text |
| 成功/正向 | 绿 | success surface/text |
| 警告/注意 | 黄/橙 | caution/warning |
| **错误 / 删除** | **红** | critical surface/text/fill |
| 普通正文 | 深灰 | `--p-color-text` `#303030` |

---

## 红色允许 / 禁止

✅ **允许用红：**
- 表单错误文字/边框
- 错误 Banner（`tone="critical"`）
- 失败状态 Badge（`tone="critical"`）
- 删除/破坏性按钮（`tone="critical"`）
- 错误 toast（`isError`）

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
grep -rniE "#c70a24|#e22c38|#d00|#ff0000|#f00|tone=.critical.|color:\s*red|background:\s*red" \
  app/ pages*/ --include=*.tsx --include=*.jsx --include=*.css | grep -v node_modules
```
逐条判断：**是错误/删除吗？** 是→保留；否→改中性 `--p-color-text` 或强调蓝。

---

## ❌ 反例 → ✅ 改法

| ❌ 反例 | ✅ 改法 |
|--------|--------|
| 红色「限时」促销文字 | 中性 `#303030` 或强调蓝 |
| 红色「必看」标签 badge | 默认灰 badge 或 info 蓝 |
| 红色装饰分隔线 | `--p-color-border` 灰 |
| 红色数字（非负向） | `#303030`；负向趋势才用 critical |

## BFS 注意
- **4.3.3**：这是本次被打回项之一，要求**全 App 更新并测试**，不是改一处。
- 配合 [../02-components/badges.md](../02-components/badges.md)、[banners](../02-components/banners.md) 的 tone 规则。
