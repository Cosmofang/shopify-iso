# App icon

> App icon 同时受 App Store requirements、官方 Visual design 指南和 BFS 4.3.5 约束。三层来源分别验收，不能只看尺寸。

## 官方文件规格

- PNG 或 JPG。
- 正方形 `1200 x 1200px`。
- 不预先制作圆角；Shopify 会在不同位置裁切和渲染。
- 图标用于白色和浅灰背景，主体必须清晰可辨。

## 官方构图指导

- 主体在横向或纵向占画布的 `10/16`（750px）到最多 `12/16`（900px）。
- 四周至少留 `1/16`（75px）无视觉元素的安全边距。
- 避免大量文字；图标在小尺寸仍需可识别。
- 不使用无权使用的图标或 Shopify logo 的任何部分。
- Admin navigation SVG 如有提供，应与 App Store icon 相似；不要求完全相同，也不是强制提交 SVG。

## BFS 4.3.5

- 不能让商家误认成 Shopify 或第一方 Shopify App；与第一方图标高度相似的渐变背景是官方明确示例。
- AI 功能不能使用 Sidekick icon，也不能使用近似 Shopify magic purple 的颜色来标示 AI。

## 插图与其他视觉资产

- 插图风格在整个 App 内保持一致，使用高分辨率资产。
- 图像要解释内容或任务，不用低清、失真或仅装饰的大图制造视觉噪声。
- 同一列表或重复元素中的 icon 使用规则一致，避免部分有、部分无导致错位和未完成感。

## 发布与验证

1. 在 [Dev Dashboard](https://dev.shopify.com/dashboard) 的 App Settings 更新 icon；具体入口以当前 Dashboard 为准。
2. 在 App Store listing、Apps page、Admin nav 的 active/inactive 状态和浅色背景逐一检查。
3. 与 Shopify 第一方 App 图标、Sidekick 和 magic purple 做并排审查。
4. 保存源文件、导出文件、版本记录和各触点截图作为证据。

注意：`1200px`、安全区和文件格式来自官方设计/上架规范；“不冒充 Shopify”是 BFS 硬判据。构图建议不应错误标成每一项都能单独触发 BFS 拒审。
