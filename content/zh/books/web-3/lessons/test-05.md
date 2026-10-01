# 第 5 章章测：Canvas

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 Canvas 路径，下列说法正确的是？
options:
- beginPath 可选，不调用也没影响
- 不调用 beginPath 会导致新旧轨迹累积在同一路径上
- arc 的角度用角度制（0~360）
- 每次 stroke 后路径会自动清空
answer: 1
explain: beginPath 必须调用否则轨迹累积；arc 用弧度；stroke 不会自动 beginPath。
```

```quiz
type: choice
q: 关于 requestAnimationFrame 与 setInterval，正确的是？
options:
- requestAnimationFrame 会自动无限循环，无需再调用
- 切到后台标签页时 requestAnimationFrame 会自动暂停
- setInterval 与屏幕刷新率完全同步
- cancelAnimationFrame 会自动清空画布
answer: 1
explain: rAF 单次预约需回调内再调用；切后台自动暂停；取消只阻止下一次回调，不清屏。
```

```quiz
type: choice
q: Canvas 画柱状图时，柱子顶边的 y 坐标应该是？
options:
- padT + plotH + h
- padT + plotH - h
- padT + h
- plotH - padL
answer: 1
explain: y 轴朝下，柱子从横轴向上长，顶边 = padT + plotH - h。
```

```quiz
type: choice
q: 关于 fillText，正确的是？
options:
- (x, y) 是文字框左上角
- font 和 fillStyle 必须在 fillText 之前设置
- measureText 返回文字高度
- 中文字体只写一个字体名即可保证显示
answer: 1
explain: 即时模式下样式在 fillText 那一刻生效；(x,y) 是基线左下角；中文应用候选列表兜底。
```

```quiz
type: choice
q: drawImage 画图片时，必须注意？
options:
- 图片 src 赋值后立即 drawImage 即可
- 必须在 img.onload 之后再 drawImage，否则画布空白
- drawImage 只能画同域图片
- 图片必须先转成 base64
answer: 1
explain: 图片异步加载，必须等 onload 之后再 drawImage，否则画布上是空白。
```

## 第二部分 · 动手题

```quiz
type: js
q: 写一个纯函数 valueToHeight(v, max, plotH)，把数值 v 映射到绘图区高度：返回 (v / max) * plotH。plotH=200、max=100 时 v=50 返回 100。
func: valueToHeight
starter: |
  function valueToHeight(v, max, plotH) {
      // (v / max) * plotH
  }
cases: |
  0, 100, 200 -> 0
  50, 100, 200 -> 100
  100, 100, 200 -> 200
  25, 100, 200 -> 50
```

```quiz
type: js
q: 给定 HTML：<canvas id="c" width="300" height="200"></canvas>。写一个函数 drawScene(ctx)，实现一帧动画逻辑：先清空整个画布（clearRect 全屏），再画一个从 x=10 开始向右移动的红色方块。要求使用全局变量 pos（初始 0）：每次调用把 pos 加 5，然后用 fillStyle='rgb(244, 67, 54)' 在 (pos, 80) 处画一个 20x20 填充矩形。
func: drawScene
starter: |
  let pos = 0;
  function drawScene(ctx) {
      // pos+=5; clearRect; fillStyle; fillRect
  }
html: |
  <canvas id="c" width="300" height="200"></canvas>
checks:
- (function(){var ctx=document.querySelector('#c').getContext('2d'); drawScene(ctx); return (pos===5) && (function(){var d=ctx.getImageData(pos+10,90,1,1).data; return d[0]>200&&d[1]<100&&d[2]<100;})();})()
hint: pos+=5；clearRect(0,0,300,200)；fillStyle 红；fillRect(pos,80,20,20)。
explain: 验证一帧状态更新与红色方块绘制。
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"Canvas 计数器方块"：页面有按钮（id="btn"）和一个 canvas（id="c"，宽 300 高 100）。点击按钮时，用 requestAnimationFrame 让一个蓝色方块（20x20，fillStyle 'rgb(33, 150, 243)'）从 x=0 平滑移动到 x=200：动画函数每帧让方块 x 加 4，清空画布后重绘，到达 200 后停止（不再预约下一帧）。要求连续点击时不会启动多个叠加动画（用一个布尔变量 isAnimating 控制，只在非动画中时才启动）。
html: |
  <button id="btn">开始</button>
  <canvas id="c" width="300" height="100"></canvas>
starter: |
  // 实现动画：isAnimating 控制防重入，每帧 x+=4，clearRect 全屏，fillRect，到 200 停止
explain: 核心是防重入布尔量 + 每帧 clearRect 与重绘 + 到边界取消 rAF。
```
