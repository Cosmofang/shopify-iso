# 反模式禁忌集（Anti-patterns）

> 一页速查「会被 BFS 打回」的高频错误。设计/评审时对着排除。

---

## 🔴 颜色
| ❌ 反模式 | ✅ 正解 | 条款 |
|----------|--------|------|
| 主按钮绿色 `#008060` | 黑 `--p-color-bg-fill-brand` | 4.1.1 |
| 主按钮写死品牌橙/蓝 | `variant="primary"` 继承黑 | 4.1.1 |
| 红色做普通标签/促销/装饰 | 中性灰或强调蓝 | 4.3.3 |
| 次要文字 `#8c9196`（3.4:1） | `#616161`（5.7:1） | 4.1.1 |
| 浅底按钮 + 白字 | 深底或深字，≥4.5:1 | 4.1.1 |

## 🟡 交互
| ❌ 反模式 | ✅ 正解 | 条款 |
|----------|--------|------|
| 加载即弹 modal/popover | Banner 常驻引导 | 4.3.3 |
| 定时/无关操作弹窗 | 只由主动点击触发 | 4.3.3 |
| 字段出错只标红框 | 红框 + 可行动文案 | 4.2.4 |
| 泛泛错误文案 "Invalid" | 说清问题+解决 | 4.2.4 |
| `outline:none` 裸删焦点 | box-shadow 焦点环 | 通用 a11y |
| 异步白屏无 loading | 按钮 loading / skeleton | 通用 |

## 🟢 布局/移动
| ❌ 反模式 | ✅ 正解 | 条款 |
|----------|--------|------|
| 固定宽容器致移动横滚 | 响应式 + 局部滚动 | 4.1.2 |
| 多列手机不堆叠 | `s-grid`/`InlineGrid` 响应 | 4.1.2 |
| 触控目标 <44px | ≥44×44px | 4.1.2 |
| 卡片圆角 8px / 内边距非16 | 12px / 16px | 规范 |

## ⚫ App 名/导航
| ❌ 反模式 | ✅ 正解 | 条款 |
|----------|--------|------|
| 冗长 App 名截断 | 短名不截断 | 4.1.3 |
| App 名与首页分离/重复首页项 | App 名直达首页 | 4.1.4 |
| 自绘 Shopify 顶栏/搜索 | 依赖 Admin chrome | 嵌入式 |

## 🎨 Token
| ❌ 反模式 | ✅ 正解 |
|----------|--------|
| 写死 hex/px | 用 `--p-*` token |
| 字号不命中 scale（15/17px） | 命中 Polaris scale |
| 间距非 4px 倍数 | 4px 倍数 |
| 非 Inter 字体 | Inter |

---

> 完整判据见 [../00-built-for-shopify/requirements.md](../00-built-for-shopify/requirements.md)；提交前跑 [../00-built-for-shopify/pre-submission-checklist.md](../00-built-for-shopify/pre-submission-checklist.md)。
