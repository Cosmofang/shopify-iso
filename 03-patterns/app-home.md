# App Home page

> App Home 是商家进入 App 的默认页面。官方 App Home page 指南要求它提供日常价值；BFS 3.1.4 与 4.2.3进一步要求状态、关键指标和扩展状态可见。

## 首页要回答的问题

- App 是否已设置完成并正常工作？
- 当前有什么需要商家立即处理？
- App 最近产生了什么结果或关键状态？
- 商家现在可以执行哪些清晰、合理的动作？

优先使用当前 [Homepage pattern](https://shopify.dev/docs/api/app-home/patterns/templates/homepage)，再按任务选择 Setup guide、metrics、table、empty state 等 compositions。

## BFS 硬性要求

- App 包含 theme app block/embed 时，首页使用 `app.extensions()` 等当前 API 显示实际激活状态。
- 显示对商家明显有用的关键指标；复杂报表在外部时，Admin 内仍提供简化监控或 reporting。
- 商家关闭所有可 dismiss 内容后，首页仍有动态价值，不能只剩欢迎语、静态链接或空白。
- App URL / `rel="home"` 正确指向此首页，不创建重复可见 Home 导航项。

## 官方设计指导

- 首页快速提供 statistics、status updates 和 immediately actionable information。
- CTA 清楚描述当前可执行动作，相关动作有明确主次。
- 支持入口位置稳定、容易找到但不干扰主要工作；可放 App nav、页脚 link 或经过验证的 floating action button。
- 新商家 onboarding 容易定位；完成后 setup UI 可移除，首页转为运行状态、指标和下一步。
- 促销只轻量放在首页底部的可关闭容器，或进入独立促销页，不能压过工作内容。

## 状态覆盖

- 新安装：核心价值清晰，Setup guide 容易定位。
- 已配置：显示运行状态、近期结果、待处理事项和合理 CTA。
- 未激活/失联：准确指出受影响能力和解决路径，不做虚假成功展示。
- 无数据：说明尚无数据的原因、何时会出现和下一步，不用静态欢迎页填空。
- 加载/错误：稳定 skeleton/loading；错误持久、红色、就近并可行动。

## 验收

- [ ] 首页在新安装、已配置、无数据、失联、错误和 loading 状态都有真实数据依据
- [ ] 扩展激活状态来自当前 API，不靠浏览器猜测
- [ ] 关闭 onboarding / promotion 后仍有动态价值
- [ ] 关键指标有范围、单位和时间上下文，不能只靠图表颜色
- [ ] App name 直达首页，桌面与 Shopify mobile 的路由和高亮正确
