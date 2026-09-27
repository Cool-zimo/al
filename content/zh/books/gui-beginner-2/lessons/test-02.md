# 第 2 章 · 动画与定时 · 大测验

> 8 道题。这一章解决的是"怎么让图形自己动起来、动画在不同电脑上速度为什么不一样、键盘怎么控制方块"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 为什么 tkinter 程序里不能用 while True 配合 time.sleep 来做动画？
options:
- while True 会报错，语法不允许
- time.sleep 会让 Python 精度丢失
- while True 霸占了事件循环，界面卡死、无法重绘和响应
- tkinter 不支持循环语句
answer: 2
explain: tkinter 是单线程事件驱动模型，mainloop 负责取事件、处理事件、重绘。while True 会把这个循环堵死，事件循环出不来，窗口无法重绘、无法响应鼠标和关闭按钮。正确做法是用 after() 非阻塞地挂号未来任务。
```

```quiz
type: choice
q: 想让球在碰到右墙（画布宽 400）时反弹回来，下面哪种写法正确？
options:
- if x2 > 400: dx = dx + 1
- if x2 >= 400: dx = -dx
- if x2 >= 400: dx = abs(dx)
- if x2 >= 400: dy = -dy
answer: 1
explain: 反弹的核心是把速度方向取反：dx = -dx。A 是加速不是反弹；C 的 abs 让速度恒正（一直向右）不是反弹；D 改的是 dy，垂直方向和水平反弹无关。边界判断用 >= 能容忍球稍微越过边界。
```

```quiz
type: choice
q: 一段动画"每帧移动 3 像素"，在 60 帧/秒的机器上每秒移动 180 像素。如果换到 30 帧/秒的机器且仍用固定步长，球每秒移动多少像素？
options:
- 3
- 30
- 90
- 180
answer: 2
explain: 固定步长 = 每帧固定 3px。30 帧/秒的机器每秒 30 帧，所以每秒移动 3×30=90 像素，比 60 帧时慢了一半。这就是固定步长"帧率不同速度不同"的问题，需要用 delta time 解决。
```

```quiz
type: choice
q: 用 delta time 做匀速动画时，每帧的移动量应该怎么算？
options:
- 速度 ÷ 帧数
- 速度 × dt（当前时间减上一帧时间的秒数）
- 速度 + dt
- 固定 4 像素不变
answer: 1
explain: delta time（dt）= 当前时间 - 上一帧时间。移动量 = 速度 × dt，单位是"像素/秒 × 秒 = 像素"。dt 大（帧间隔长）就移动多，dt 小就移动少，平均速度恒定，跨设备一致。
```

```quiz
type: choice
q: 想把"按下左方向键"绑定到 move_left 函数，正确写法是？
options:
- root.bind("<Left>", move_left())
- root.bind("<Left>", move_left)
- root.bind("Left", move_left)
- root.bind("<Left>", lambda: move_left)
answer: 1
explain: bind 要的是函数对象，所以 move_left 不加括号。A 带括号会立即执行并把返回值传进去；C 缺了尖括号，键名格式不对；D 的 lambda 没传 event 参数，触发时 move_left 会报 TypeError。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"移动后停止"的方块：400x200 画布，橙色矩形从 (10,80) 移动到 (350,80)，每次移动 10 像素，每 30 毫秒移动一次。到达 x=350 后自动停止（不再 after）。提示：在 move_step 里用 canvas.coords 读坐标，超过边界就 return 不再挂号。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  canvas = tk.Canvas(root, width=400, height=200, bg="white")
  canvas.pack()

  rect = canvas.create_rectangle(10, 80, 60, 130, fill="orange")

  # 用 after 递归移动，到边界停止
checklist:
- 用 after 递归移动（非 while True / time.sleep）
- 每次移动 10 像素、间隔 30 毫秒
- 到达 x=350 左右后停止（不再挂号 after）
- 调用了 mainloop
```

```quiz
type: local
q: 做一个"带重力的下落球"：400x400 画布，绿色球从顶部 (190,10 到 230,50) 开始下落。每帧给 dy 加 0.5（重力），让球向下加速；碰到地面（y2>=400）时 dy 取反并乘以 0.9（能量损失），模拟弹跳几次后停下。提示：用 after(20, ...) 递归驱动，dy 趋于 0 时停止递归。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  canvas = tk.Canvas(root, width=400, height=400, bg="white")
  canvas.pack()

  ball = canvas.create_oval(190, 10, 230, 50, fill="green")
  dy = 0

  # 每帧 dy += 0.5，碰地反弹 dy = -dy*0.9
checklist:
- 球受重力不断加速下落
- 碰地后反弹，速度乘以 0.9
- 多次弹跳后最终停下（dy 趋于 0 时不再 after）
- 用 after 递归驱动
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"键盘控制的弹球小游戏"：500x400 白色画布。球是一个 20x20 的红色椭圆（外接矩形 240,190 到 260,210），初始每帧向右 4 像素、向下 3 像素移动，碰到左右墙和上下墙都反弹（dx=-dx / dy=-dy）。用方向键控制一个 80x15 的蓝色挡板，挡板只做水平移动（上下不动），初始在底部中间 (210,370)，步长 15，边界限制在 0~420。球碰到挡板（用 coords 判断球和挡板是否相交）就反弹向上（dy 取反）。加一个分数显示：球每碰到一次挡板加 10 分，画面左上角用 create_text 实时显示分数（蓝色、SimHei 18号）。用 after(20, ...) 递归驱动。提示：碰撞检测就是判断矩形是否相交——球的 x2 >= 挡板x1 且球的 x1 <= 挡板x2 且球的 y2 >= 挡板y1。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("弹球小游戏")
  canvas = tk.Canvas(root, width=500, height=400, bg="white")
  canvas.pack()

  ball = canvas.create_oval(240, 190, 260, 210, fill="red")
  paddle = canvas.create_rectangle(210, 370, 290, 385, fill="blue")
  dx, dy = 4, 3
  score = 0
  score_text = canvas.create_text(10, 10, text="分数 0", font=("SimHei", 18), fill="blue", anchor=tk.NW)
  paddle_x = 210

  def animate():
      global dx, dy, score
      # 移动球 + 边界反弹 + 挡板碰撞检测 + 更新分数

  def on_key(event):
      global paddle_x
      # 方向键移动挡板，clamp 边界 0~420

  root.bind("<Key>", on_key)
  animate()
  root.mainloop()
checklist:
- 球每帧移动并碰到四壁反弹（dx/dy 取反）
- 方向键能控制挡板水平移动，步长 15，边界 0~420
- 球碰到挡板会反弹向上（dy 取反）
- 碰撞检测用坐标判断矩形相交
- 每次碰到挡板分数加 10 并更新显示
- 用 after(20, ...) 递归驱动，非 while/sleep
- 分数文字在左上角，蓝色 SimHei 18号
- 调用了 mainloop
```
