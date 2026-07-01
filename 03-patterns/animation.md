# 动效 Animation

> Polaris 无动效系统。装饰性动效（扫描入库、跑马灯、连接线滚动小球、圆点坠落…）自己写 CSS / `requestAnimationFrame`。核心约束：**在 React Router（SSR）里必须客户端跑 + 首帧空 + 尊重 reduced-motion + 卸载清理**。
>
> 来源：Deeplumen「Store Traffic」页动效移植沉淀。

---

## React + SSR 铁律

- rAF / 直接操作 DOM 的动效**只在 `useEffect` 里跑**（客户端）；服务端首帧渲染**空容器**（空 `<svg>` / 占位 div）。
- 这样 **server 与 client 首帧一致 → 无水合冲突**；动画在 `useEffect` 挂载后启动，用户几乎无感。
- **绝不**在渲染期用 `Date.now()` / `Math.random()` 决定首帧 DOM（会 server ≠ client → 水合报错）；随机只在 `useEffect` 内用。
- `useEffect` 必须返回 cleanup：`cancelAnimationFrame` + `removeEventListener` + `clearTimeout`；用一个 `runId` 令旧循环失效（resize 重建时旧 rAF 自动停）。
- 依赖布局尺寸的动效（如连接线量 `getBoundingClientRect`）：`useEffect` 里 `build()` + resize 防抖重建 + 一次 `setTimeout` settle 重量（等字体/嵌入样式就绪，避免量到旧布局）。

```jsx
useEffect(() => {
  const box = ref.current; if (!box) return;
  let runId = 0, raf = 0;
  function init() {
    runId++; const my = runId;
    /* …build DOM… */
    function frame(ts){ if (my !== runId) return; /* …*/ raf = requestAnimationFrame(frame); }
    raf = requestAnimationFrame(frame);
  }
  init();
  const onResize = () => { /* debounce */ init(); };
  window.addEventListener("resize", onResize);
  return () => { runId++; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
}, []);
```

## reduced-motion（无障碍，必做）

- 所有动效尊重 `prefers-reduced-motion: reduce`：
  - CSS：`@media (prefers-reduced-motion: reduce){ .track { animation: none !important; } }`
  - JS：`window.matchMedia('(prefers-reduced-motion: reduce)').matches` → 跳过 rAF，给**静态终态**（小球停中点、点阵直接点亮）。

## CSS 跑马灯 Marquee

- 轨道含**两组相同内容** + `@keyframes { from{translateX(0)} to{translateX(-50%)} }` linear infinite → 无缝循环；相邻行用 `reverse` 反向 = 交叉滑动。
- 两端淡出：`mask-image: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent)`。
- hover 暂停：`.row:hover .track { animation-play-state: paused; }`。

## rAF 示例：沿路径来回滚动的小球（甜甜圈连接线）

- 路径用三次贝塞尔 `<path>`；小球位置：
  `phase=(t*speed+offset)%2; tri = phase<1 ? phase : 2-phase; pt = path.getPointAtLength(len*ease(tri))`（三角波 = 来回）。
- 各条线 `speed` / `offset` 错开 → 交错运动；`ease` = easeInOutQuad。
- 首次描边绘入：`stroke-dasharray=len; stroke-dashoffset: len→0` + `transition`。

## 自适应挤压（不撑滚动条）

- 固定宽的装饰块（如 logo chips 区）在窄屏**别用 `flex:0 0 <w>`**（会溢出/撑出横向滚动条）→ 用 **`flex:0 1 <w>` + `min-width:0` + `overflow:hidden` + 边缘 mask**，让它**可收缩、向内挤压、边缘淡出**。
- 相邻的大字号（如 hero 数字）加 `white-space:nowrap`，让被淡出的块自然**叠盖**而非把数字换行/挤走。

---

## ✅ Do
- 动效在 `useEffect` 客户端跑，首帧渲染空容器。
- 提供 cleanup（cancel rAF / 移除监听）+ `runId` 失效旧循环。
- 一律实现 `prefers-reduced-motion` 降级。
- 只动 `transform` / `opacity`。

## ❌ Don't
- ❌ SSR 渲染期用随机/时间决定 DOM（水合报错）。
- ❌ 动效无清理（内存泄漏 / resize 后多循环并存）。
- ❌ 窄屏用固定宽装饰块撑出横向滚动条。
- ❌ 忽略 reduced-motion。
- ❌ 动画改 `width`/`top`/`left` 等触发 layout 的属性（抖动、伤 INP/CLS）。

## BFS 注意
- **BFS 2（性能）**：动效勿引发 CLS / 拖垮 INP —— 用 transform/opacity，避免布局抖动；控制同时动的节点数。
- **可达性**：纯装饰动效容器 `aria-hidden="true"`，不进读屏树；信息不能只靠动画传达。

> 自绘图表本身见 [../02-components/charts-dataviz.md](../02-components/charts-dataviz.md)。
