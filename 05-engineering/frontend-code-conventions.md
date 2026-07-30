# 前端代码约定（从真实代码提炼）

> **来源与定位**:本文不是 Shopify 官方要求。规则全部从同事写的真实代码库
> `deeplumen-ui-prototype`（React Router 7 + TypeScript + Tailwind 4 的沙盒原型,
> **不用**官方 Polaris web components）提炼而来,每条附证据（file:line）。
> 用途:统一团队 review 标准、减少风格分歧、给新代码定调——**不是**过 BFS 审核的硬性关卡
> （那部分见本目录其他文档 + [00-built-for-shopify/](../00-built-for-shopify/)）。
>
> 该项目无 eslint/prettier 配置(`tsconfig.json` 仅开 `strict`),风格全靠约定而非工具强制——
> 正因如此才需要写下来。§4 的颜色写法(Tailwind arbitrary hex)是沙盒特有,若项目用官方
> `s-*` 组件,颜色规则改按 [../assets/polaris-tokens.css](../assets/polaris-tokens.css)
> 的 `--p-color-*` token,其余规则(状态管理/注释/mock设计/安全/命名)跨技术栈通用。

---

## 1. 沙盒 / 生产环境的 shim 边界

**规则**:真实依赖(App Bridge、内部共享包)通过 `tsconfig.json` `paths` + 构建工具的 `alias`
**双重映射**到本地轻量 shim,组件代码里的 import 语句原样不改——回搬到真实仓库时只删 alias,
不改业务代码一行。

```ts
// tsconfig.json
"paths": {
  "@shopify/app-bridge-react": ["./src/shims/app-bridge.ts"],
  "@deeplumen/shared": ["./src/shims/deeplumen-shared.ts"]
}
```
```ts
// vite.config.ts resolve.alias 做同样的映射(两处必须一致)
```

- Shim 只实现当前原型真正用到的能力(如 `useAppBridge().toast.show()`),用到新能力再补,
  **不要为了"完整"去实现整套官方 API**。
- Shim 文件顶部注明"回搬到真实仓库时组件不用改"，让后来者理解这层存在的目的。

**为什么**:让原型/沙盒和生产代码保持同一套 import 路径,原型验证过的组件可以整段迁移,
不用回头逐处替换 import。

---

## 2. 注释:解释 WHY,不解释 WHAT;关键决策留痕

- 复杂/反直觉逻辑处的注释解释**为什么这样写**(约束、坑、业务规则),不复述代码在做什么。
- 修过的 bug 在注释里留 **bug ID**,后来者遇到相关代码能查到历史决策依据。
- 类型文件里注明字段的**来源**(哪些是后端/loader 端派生、不入库、有时效性)。

```ts
/** ai-service 回的失败码：non_retryable_no_topics 等"改输入才能解"的失败，列表给 View 不给 Retry */
failErrorCode: string | null;
createdAt: string; // 已按店铺时区格式化的 'yyyy-MM-dd HH:mm'（loader 端 formatInTimeZone）
/** 超时派生(loader 端 isGenerationTimedOut,不写库)：generating 超 30min → 列表按 Failed 渲染 */
timedOut: boolean;
```

架构级决策也要留痕,比如为什么选轮询而不是 SSE:

```ts
// 使用 React Router 的 useRevalidator 而非 SSE，原因：
//   - Shopify 嵌入式 App 运行在 iframe 中，SSE 的 EventSource 面临 CSP 和认证限制
//   - Polling 方案零基础设施，保证在所有 iframe 场景下工作
```

**为什么**:嵌入式 Shopify app 的很多"奇怪写法"是平台约束逼出来的(iframe/CSP/token 时效)。
不写下来,下一个人会"优化掉"这个约束,然后线上炸。

---

## 3. 组件与 Props

- Props 用 `interface XxxProps`(不用 `type`,不用 `React.FC<Props>`);组件签名
  `export function Xxx(props: XxxProps)`。
- 一个文件里的私有子组件(只服务本文件、不复用)**不导出**,直接 `function SubComponent() {}`
  写在同文件里;真正跨处复用的才拆独立文件。
- 逻辑差异大的"步骤/阶段"各自独立文件(如向导 W1/W2/W3 分文件),即使共享外层布局。
- 判断放哪层:**有 JSX + 交互 → 组件;纯状态/可复用算法 → hook;纯函数无副作用 → lib**。

---

## 4. Modal / 弹层:统一 API 形状

所有 modal 组件用同一套 props 形状,降低认知负担:

```ts
interface XxxModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void; // 或 onApply / onSelect，按语义命名
}
```

- 点遮罩关闭:遮罩 `onClick={onClose}`,内容区 `onClick={(e) => e.stopPropagation()}` 阻止冒泡。
- 按钮靠右,取消在前、主操作在后。
- `role="dialog" aria-modal="true"`;**焦点陷阱和 Esc 关闭要显式做**,不要假设浏览器/框架
  会自动处理(自绘 modal 天生没有这些,官方组件才有,见 [02-components/modals.md](../02-components/modals.md))。

---

## 5. 状态与数据流(React Router 场景)

- **多字段状态拆分成多个 `useState`**,不要塞进一个大对象——独立字段才能独立触发精准重渲染。
- **提交态交给框架**:用 `useNavigation().state` / `useFetcher().state` 判断 loading,
  不要自己 `useState` 一个 `isSubmitting`。
- **一个表单多个提交意图,用单一 `intent` 字段区分**,而不是拆多个 action 端点:
  ```html
  <button name="intent" value="continue-w2">Continue</button>
  <button name="intent" value="back">Back</button>
  ```
  action 里 `switch (form.get('intent'))` 分支,返回统一的 `{ status, message, ... }` 形状。
- **筛选/搜索/分页状态放 URL query params**,不放纯 React state——可分享链接、刷新不丢、
  浏览器前进后退天然可用。loader 从 `new URL(request.url).searchParams` 读。

---

## 6. Mock/Loader 设计:接口先对齐真实后端形状

如果要在没有后端的情况下开发/验证 UI(沙盒、原型、demo):

- **mock loader 的函数签名和返回类型,必须和"真实版本最终会长成的样子"完全一致**——
  回接真实后端时只换函数体,调用方(组件)一行不改。
- 异步多步流程(如生成向导的 analyzing → generating)用**内存 store + 时间戳派生状态**模拟,
  不用随机数、不用真定时器回调——`elapsed = now - startedAt`,超过阈值即视为"完成"。
  这样状态 100% 确定性、可复现,截图/录屏/测试都稳定。

```ts
// 时序：analyzing / 生成动画的总停留时长（三个子步均分，逐个 running→done）。
const ANALYZE_MS = 4200;
function subSteps(elapsed: number, keys: string[], per: number) {
  // elapsed >= (i+1)*per → done；elapsed >= i*per → running
}
```

**为什么**:mock 是临时的,但"以后要接真数据"是必然的。接口形状对齐,替身换真身才是改一处而不是重写。

---

## 7. lib/ 工具函数:纯函数 + 命名前缀表达职责

| 前缀 | 语义 | 例子 |
|---|---|---|
| `build*` | 组装成完整的 loader 返回数据 | `buildDashboardData` |
| `compute*` / `calculate*` | 数值计算 | `calculateGrowthPercent` |
| `normalize*` | 把不可信/脏数据规整成安全类型,填充缺失字段默认值 | `normalizeOutline` |
| `friendly*` | 把技术性数据转成用户可读文案 | `friendlyBlogFailReason` |
| `derive*` | 从已有状态推导出新状态(不接受外部输入) | `deriveStepRows` |
| `make*` | 工厂函数,生成一份数据 | `makeW2()` |

- 工具函数保持**纯函数**(同输入同输出、无副作用),需要浏览器 API 的独立命名
  (如 `*.client.ts` 后缀标记"仅客户端可用")。
- 输入校验/脏数据兜底放在 lib 层(`normalize*`),不要让组件自己判断字段是否存在——
  这样"数据不可信"的复杂度只在一处处理。

---

## 8. 安全:外部 URL 渲染成可点击链接前必须做协议白名单

任何来自第三方/LLM/爬取结果的 URL,渲染成 `<a href>` 之前先校验协议:

```ts
/** URL 协议安全校验：只认 http / https。
 * 用于把外部来源（SERP 抓取 / LLM 产出）的 URL 渲染成可点击外链前过滤掉
 * javascript: / data: 等可执行或内联协议，防止点击触发脚本（XSS）。
 * 相对 URL / 空值 / 非法串一律视为不安全（返回 false）。 */
export function isHttpUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}
```

**适用场景**:任何"内容由 AI 生成/由外部数据源提供"的功能(博客生成引用链接、SERP 参考资料、
爬虫抓取结果)都要过这一关,不能假设外部数据天然安全。

---

## 9. 国际化:CJK 文本不能按英文口径量长度/词数

英文常见的两条经验规则,对中文/日文/韩文会严重失真:

- **标题长度**:纯 `.length` 计中文和英文等宽,但中文字符实际显示宽度约为英文 2 倍——
  中文标题会被"50-60 字符"的 SEO 长度建议误判成偏短。
- **词数统计**:按空格分词对中文无效(中文不用空格分词),整篇中文会被算成极少"词"。

```ts
/** SEO 标题"宽度"：CJK 字符计 2（≈英文 2 字符宽），其余计 1。
 * 与英文 50-60 区间落在同一量纲，中文/中英混排标题不再被误判过短。 */
export function seoTitleWidth(title: string): number {
  return title.length + cjkCount(title);
}
```

**适用场景**:任何面向多语言商家的 SEO/内容长度建议、字数统计、截断逻辑,先判断内容是否含 CJK,
按码点区间判断(不要在源码里直接写字面 CJK 字符,避免触发部分 lint 规则如
`no-irregular-whitespace`)。

---

## 10. 埋点:best-effort,绝不阻塞主流程

```ts
try {
  if (opts?.beacon && navigator.sendBeacon) {
    navigator.sendBeacon('/api/blog/track', payload);
  } else {
    void fetch('/api/blog/track', { method: 'POST', keepalive: true, body: payload });
  }
} catch {
  /* 埋点失败静默,不影响业务流程 */
}
```

- 一般事件 fire-and-forget;**页面即将卸载时的事件**(如"保存并退出")用
  `navigator.sendBeacon` 或 `fetch({ keepalive: true })`,确保请求不被浏览器取消。
- 失败静默 catch,埋点绝不能抛出异常影响主流程。
- 端点走同源路径(嵌入式 Shopify app 不能裸调第三方跨域埋点服务)。

---

## 11. 无障碍现状(该做的清单)

真实代码里已落实的:
- 非文字按钮有 `aria-label`(如图标按钮)。
- 键盘可交互的自定义元素(整卡可点)补 `role="button"` + `onKeyDown` 处理 Enter/Space。
- 装饰性 SVG/icon 加 `aria-hidden="true"`。
- 自绘 modal 有 `role="dialog" aria-modal="true"`。
- 表单错误字段加 `aria-invalid`。

发现的缺口(review 时留意):
- 颜色对比度未系统核查(灰色文字在浅底上可能不达 4.5:1,见
  [00-built-for-shopify/wcag-contrast.md](../00-built-for-shopify/wcag-contrast.md))。
- Loading spinner 类动画未加 `prefers-reduced-motion` 判断
  (对比 [03-patterns/animation.md](../03-patterns/animation.md) 的要求)。
- 自绘 modal 没做焦点陷阱(Tab 循环)和 Esc 关闭——**这正是官方 `s-modal` 组件免费帮你做的**,
  自绘等于要自己重新实现一遍。

---

## 12. 已发现的坏味道(review 时留意的信号)

| 信号 | 说明 | 怎么办 |
|---|---|---|
| 同类数值反复写死(如按钮高度 `h-[36px]` vs `h-[40px]`) | 视觉不齐,改起来要多处改 | 抽成常量或设计 token |
| 品牌色 hex 反复出现 20+ 次 | 改色要全项目搜替换 | 集中到一处(CSS 变量/Tailwind theme extend) |
| 同一份数据结构定义了两次(新旧 mock 并存) | 容易改一处漏一处 | 删掉过时版本,不要"留着以防"|
| 部分组件用 `useNavigation()`、部分用 `useFetcher()` 判断提交态 | 心智模型不统一 | 明确"什么场景用哪个"并写下来(单一表单用 Navigation,局部/多处提交用 Fetcher)|
| action 直接转发给底层函数、无 try/catch | 底层抛错会变成裸 500,前端拿不到友好错误 | action 统一兜底,返回 `{status:'error', message}` |
| 复杂逻辑的初始值计算堆了 20+ 行注释才说得清楚 | 说明这段逻辑本身该拆函数 | 提炼成命名清晰的小函数,注释才好落在"为什么"上 |

---

## 13. 五条最值得记住的规则

1. **mock/loader 的接口形状要和"真实版本"完全对齐**——回接后端时只换函数体,组件不动。
2. **表单提交态交给 React Router(`useNavigation`/`useFetcher`),不要自己维护 `isSubmitting`。**
3. **所有 modal 用统一的 `{ open, onClose, onConfirm }` 形状**——降低认知负担,新人看一个就懂全部。
4. **复杂/反直觉的代码旁边留 WHY 注释,带 bug ID 或架构约束依据**——决策要可追溯,不能只靠记忆。
5. **外部来源的 URL 渲染前必须协议白名单;多语言长度判断必须 CJK-aware**——这两类是真实会
   出安全/体验问题的坑,不是风格偏好。
