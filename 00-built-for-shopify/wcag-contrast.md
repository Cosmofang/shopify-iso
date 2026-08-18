# WCAG 2.1 AA 对比度规范（BFS 4.1.1）

> BFS 要求带文字的组件（按钮/卡片/导航/表单）文字与背景对比度符合 **WCAG 2.1 AA**。
> 这是被打回的高频项，务必逐对核查。

---

## 达标阈值

| 内容 | 最低对比度 | 说明 |
|------|-----------|------|
| 正文 / 小于 18pt（约 24px），或小于 14pt（约 18.67px）粗体 | **4.5:1** | 绝大多数文字都按这条 |
| 大字 ≥ 18pt（约 24px），或 ≥14pt（约 18.67px）粗体 | **3:1** | 只有达到 WCAG 大字定义才可放宽 |
| 图形/UI 边界（图标、输入框边框、焦点环） | **3:1** | 非文字元素 |

> 保守做法：**一律按 4.5:1 要求**，避免边界争议。
> BFS 4.1.1 明列的是文字对比度拒审理由；UI 边界、图标和焦点环的 3:1 来自 WCAG 非文字对比度与 Shopify accessibility guidance，属于关联可访问性要求，不是另一条 BFS 叶子要求。

---

## 对比度怎么算

对比度 = (L1 + 0.05) / (L2 + 0.05)，L1/L2 为两色相对亮度（亮者为 L1）。手算麻烦，用工具即可：

- **Chrome DevTools**：选中文字元素 → Elements → Styles 里 color 色块，或 Accessibility 面板看 Contrast ratio（会直接标 AA/AAA 是否通过）。
- **在线**：WebAIM Contrast Checker（https://webaim.org/resources/contrastchecker/）。
- **Figma**：装 Able / Contrast 插件，选两图层看比值。

---

## Polaris 达标色对照（常用组合，均 ≥ 4.5:1）

| 前景（文字） | 背景 | 对比度 | 用途 |
|------|------|--------|------|
| `#303030` `--p-color-text` | `#ffffff` surface | **13.20:1** ✅ | 正文/主文字 |
| `#303030` | `#f1f1f1` `--p-color-bg` | **11.69:1** ✅ | 页面底色上的文字 |
| `#616161` `--p-color-text-secondary` | `#ffffff` | **6.19:1** ✅ | 次要文字 |
| `#ffffff` | `#303030` `--p-color-bg-fill-brand` | **13.20:1** ✅ | 当前参考值；实现使用组件和语义 token |
| `#8e0b21` `--p-color-text-critical` | `#fee8eb` critical surface | ✅ | 错误文字在错误底 |
| `#014b40` `--p-color-text-success` | `#cdfed4` success surface | ✅ | 成功文字在成功底 |
| `#4f4700` `--p-color-text-caution` | `#fff8db` caution surface | ✅ | 警告文字在警告底 |
| `#003a5a` `--p-color-text-info` | `#eaf4ff` info surface | ✅ | 信息文字在信息底 |
| `#005bd3` `--p-color-text-emphasis` | `#ffffff` | ✅ | 链接/强调 |

---

## ❌ 不达标（禁用）

| 前景 | 背景 | 对比度 | 问题 |
|------|------|--------|------|
| `#8c9196` | `#ffffff` | **3.18:1** ❌ | 旧的浅灰次要文字，**改用当前组件或语义 token** |
| `#b5b5b5` `--p-color-text-disabled` | `#ffffff` | 1.9:1 | 仅限 disabled 态，**不得**用于正常文字 |
| 白字 | 浅色/中灰按钮 | <4.5:1 | 浅底放白字，改深底或改深字 |
| 自定义品牌色上的白字 | — | 视值而定 | 不要覆盖当前 primary；其他 Zone B 组合逐对计算 |

---

## 检查清单

- [ ] 所有正文文字对背景 ≥ 4.5:1
- [ ] 按钮文字对按钮背景 ≥ 4.5:1（尤其非主按钮/自定义按钮）
- [ ] 卡片/Banner 内文字对其底色 ≥ 4.5:1
- [ ] 导航项文字 ≥ 4.5:1
- [ ] 占位符/次要说明文字未低于 4.5:1（`#616161` 起步）
- [ ] `#8c9196` 已全局清除
- [ ] disabled 灰只用于真正禁用的元素
- [ ] 输入框边框、图标、焦点环 ≥ 3:1

> 全 App 逐页核，重点查**自定义（Zone B）元素**——图表图例、头像/主题选择器、徽标等最容易踩坑。
