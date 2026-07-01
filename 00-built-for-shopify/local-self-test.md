# 本地真机自测（shopify app dev）

> 提交 BFS 审核前**必跑**。用官方 CLI 在 dev store 上把桌面 + 移动两个视口都核一遍。
> CLI 基准 **4.3.0**（本机实测；4.0 起自动升级，关：`shopify config autoupgrade off`）。
> 逐条打勾走 [pre-submission-checklist.md](pre-submission-checklist.md)，本篇讲**怎么把环境跑起来、在哪看**。

---

## 一、`shopify app dev` 做了什么

```bash
cd lumi-app && shopify app dev
```

跑起来后 CLI 会：

- 引导登录 → 选 dev store（只有一个则自动选）。
- 在该 dev store 建 **dev preview** + 文件监听（改代码热重载）。
- 开**隧道**（默认 Cloudflare）或 **localhost** 反向代理。
- 更新 app URL 指向当前隧道/localhost（**仅对该 dev store**，不影响其他店）。
- 提供 Admin API 的 **GraphiQL**，用当前 app 的凭证与 scopes。

> ⚠️ 前提：要跑 `app dev` 的是**真正的 app 工程**（含 `shopify.app.toml`）。纯静态原型（`prototype_pages/`）跑不了，只能用浏览器直接开 HTML 自测视觉。

---

## 二、进入自测面板：Dev Console（按 `p`）

CLI 跑起来后，终端里按 **`p`** 打开预览。CLI 3.91+ 的 **Dev Console** 直接开在 Admin 里，可以：

- 拿 app / 各扩展的 **preview 链接**
- 生成**移动测试的 QR 码**
- 清理不再用的 dev preview
- 跳到 Dev Dashboard

---

## 三、桌面自测

1. Dev Console → 打开 app preview（Admin 内嵌）。
2. 浏览器 DevTools → 响应式视口，逐页核：
   - 多列 → 窄屏是否堆叠为单列
   - 水平内边距 16px、文字不贴边
   - 触控目标 ≥ 44×44px
   - 键盘 Tab 焦点环清晰可见
3. DevTools Accessibility 面板抽查文字对比度 ≥ 4.5:1。

---

## 四、移动真机自测

> BFS 4.1.2 是打回项，**桌面过了不代表移动过**，务必真机核。

1. 手机上登录 dev store 的 Shopify 手机 App。
2. Dev Console → 点**手机图标** → 生成 QR 码。
3. 手机相机 / 扫码 App 扫 → 在 **Shopify 手机 App** 里打开你的 app。
4. 逐页核：无整页横滚、多列堆叠、表格/图表局部滚动而非破版。

> 只有**隧道模式**能真机 QR；`--use-localhost` 不行（见下）。没有真机时退而求其次用 DevTools 设备模拟（iPhone SE / 375px），见 [../03-patterns/mobile.md](../03-patterns/mobile.md)。

---

## 五、网络两模式：隧道 vs `--use-localhost`

| | 默认（隧道） | `--use-localhost` |
|---|---|---|
| 入口 | Cloudflare 隧道 HTTPS URL | `localhost:3458`（`--localhost-port` 可改） |
| Webhook / App proxy / Flow | ✅ 支持 | ❌ 不支持 |
| POS / 跨设备真机 QR | ✅ 支持 | ❌ 不支持 |
| 适用 | 完整自测、真机、含 webhook 的功能 | 纯 UI 快速迭代、无需上述功能 |

> 呼应踩过的坑：lumi-app 走 `--use-localhost` 时 webhook 类功能失效——要测这些必须回隧道。

---

## 六、常用 flag + 收尾

| flag | 作用 |
|---|---|
| `-s, --store <url>` | 指定 dev store，跳过选店 |
| `--reset` | 重置本 app 的所有 dev 设置（换店/换 app 时用） |
| `-c, --config <name>` | 指定用哪个 `shopify.app.toml` 配置 |
| `--no-update` | 用 toml 里的 app URL，不自动改 |
| `--tunnel-url <url>` | 用自建隧道（须先起好） |
| `--localhost-port <n>` | 改 localhost 端口 |

收尾清掉 dev preview：

```bash
shopify app dev clean
```

---

## 七、自测 × BFS 映射表

| BFS 条款 | 在 `app dev` 里看什么 | 怎么触发 |
|---|---|---|
| 4.1.1 按钮 | 主按钮 computed bg = `rgb(48,48,48)`（hover `rgb(26,26,26)`）；无绿 `#008060` | 打开任意有主 CTA 的页，DevTools 查 computed |
| 4.1.1 对比度 | 正文/次要文字 ≥ 4.5:1 | DevTools Accessibility 抽查 |
| 4.1.2 移动 | 无横滚、列堆叠、触控 ≥44px | 真机 QR / DevTools 375px 逐页 |
| 4.1.3 App 名 | 左侧导航 unpin 后 App 名不被 `…` 截断 | Admin 左栏取消固定该 app |
| 4.1.4 导航 | 点 App 名直接进首页，无二跳 | Admin 左栏点 app 名 |
| 4.2.4 错误信息 | 出错字段有可行动文案，非只红框 | 逐个提交空/非法表单触发校验 |
| 4.3.3 弹窗 | 进页面静置 30s 不自动弹 modal/popover | 逐页停留观察 |
| 4.3.3 红色 | 红仅错误/破坏性；无红色装饰/标签 | 全 App 目视 + 搜色值 |

---

## 关联
- [pre-submission-checklist.md](pre-submission-checklist.md) — 逐条打勾清单
- [requirements.md](requirements.md) — 条款判据
- [../03-patterns/mobile.md](../03-patterns/mobile.md) — 移动端做法与坑
