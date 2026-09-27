# 第 1 章 · Canvas 绘图 · 大测验

> 8 道题。这一章解决的是"tkinter 里怎么画图、怎么让图动起来、图片怎么贴上去还不消失"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: tkinter Canvas 的坐标系里，(0, 0) 在哪个位置？y 轴的正方向指向哪里？
options:
- 左下角，y 向上
- 左上角，y 向下
- 中心，y 向上
- 右下角，y 向上
answer: 1
explain: Canvas 坐标系原点在左上角，x 向右增大，y 向下增大。这和数学里的直角坐标系不同，数学中 y 向上增大。画矩形、椭圆时坐标都是按这个规则算的。
```

```quiz
type: choice
q: 下面哪句代码能在画布上画出一个"内部透明、只有黑色边框"的正方形（左上 10,10，右下 60,60）？
options:
- canvas.create_rectangle(10, 10, 60, 60, fill="black")
- canvas.create_rectangle(10, 10, 60, 60)
- canvas.create_rectangle(10, 10, 60, 60, fill="", outline="black")
- canvas.create_rectangle(10, 10, 60, 60, outline="")
answer: 2
explain: 想要内部透明必须显式写 fill=""，想要黑色边框必须显式写 outline="black"。A 是实心黑；B 虽然默认也是透明+黑边，但不是明确写法；D 是无边框的透明框，几乎看不见。
```

```quiz
type: choice
q: 下面哪段代码能让图片在画布上持续显示，而不会因为垃圾回收消失？
options:
- 在函数内定义局部变量 img 并 create_image
- 把 img 保存为全局变量，再 create_image
- 用 del img 删除引用
- 把图片转成字符串再贴上去
answer: 1
explain: PhotoImage 对象如果被局部变量引用、函数结束后没有其他引用，会被 Python 的 GC 回收，图片就变成一片空白且不报错。必须保住引用：做成全局变量、挂在 canvas.image 上、或存成 self.img。
```

```quiz
type: choice
q: 想让 ID 为 5 的图形"向右移动 20 像素、向下移动 10 像素"，正确的写法是？
options:
- canvas.coords(5, 20, 10)
- canvas.move(5, 20, 10)
- canvas.itemconfig(5, x=20, y=10)
- canvas.delete(5, 20, 10)
answer: 1
explain: move(id, dx, dy) 是相对移动，"再走几步"。coords 是绝对定位，需传完整的 x1,y1,x2,y2；itemconfig 改的是 fill/outline 等属性；delete 只接受一个 ID 参数。
```

```quiz
type: choice
q: 画一个画板时，拖动画线用的是哪个鼠标事件？
options:
- <ButtonPress-1>
- <B1-Motion>
- <ButtonRelease-1>
- <Motion>
answer: 1
explain: <B1-Motion> 是按住左键并拖动，会高频触发，每次触发就从"上一个点"画一条短线到"当前点"，连续起来就是笔迹。ButtonPress-1 只是按下瞬间，ButtonRelease-1 是松开瞬间，<Motion> 是不按键的移动。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"靶子"图形：400x300 白色画布。画三个同心圆（椭圆），外接矩形分别是 (150,50)-(250,150)、(170,70)-(230,130)、(190,90)-(210,110)，填充色依次为 "red"、"white"、"red"。再加一个无边框、填充 "green" 的矩形（20,20 到 100,60），以及一条从 (10,180) 到 (120,180) 到 (120,280) 的蓝色折线，线宽 3。提示：椭圆用 create_oval，多边形会自动闭合。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  canvas = tk.Canvas(root, width=400, height=300, bg="white")
  canvas.pack()

  # 在这里画靶子：三个同心圆 + 一个矩形 + 一条折线
checklist:
- 三个椭圆填充色依次为 red、white、red
- 三个椭圆的外接矩形坐标正确，是同心结构
- 矩形填充为 green、无边框
- 折线为蓝色、线宽 3、顶点正确
- 调用了 mainloop
```

```quiz
type: local
q: 做一个"可换色画板"：500x400 白色画布。加三个颜色按钮"红""绿""蓝"，点击后把画笔颜色改成对应颜色（用全局变量 pen_color + lambda 回调）。拖动时画对应颜色的线，线宽 2。给笔迹打 tag "stroke"，加一个"清屏"按钮只删笔迹（不要删掉画布上的其他东西，本例只有笔迹）。提示：用 global 记录上一个点 last_x/last_y，bind 三个鼠标事件。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("可换色画板")
  canvas = tk.Canvas(root, width=500, height=400, bg="white")
  canvas.pack()

  pen_color = "black"
  last_x, last_y = None, None

  # 加三个颜色按钮 + 清屏按钮 + 绑定鼠标事件
checklist:
- 三个颜色按钮，点击能切换画笔颜色
- 拖动时画对应颜色的线，线宽 2
- 清屏按钮有效（用 delete("stroke") 只删笔迹）
- 使用了 global 记录上一个点
- 使用了 lambda 回调
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"完整版画图小工具"：600x500 白色画布，顶部一排按钮（红色、蓝色、绿色、黑色、清屏）。点击颜色按钮切换画笔颜色。拖动鼠标画对应颜色的线，线宽 3。要求：1）笔迹统一打 tag "stroke"，清屏按钮只删笔迹；2）加一个"显示文字"功能——点一下"写文字"按钮后，再点画布任意位置，就在该处居中写一行蓝色文字"你好"（用 create_text，font=("SimHei", 18)）；3）加一个"画圆"功能——点"画圆"按钮后，在画布中央画一个外接矩形 (250,200)-(350,300)、填充为橙色的椭圆。提示：用一个全局状态变量 mode 记录当前是 "draw" 还是 "text" 还是 "circle"，在鼠标事件函数里判断。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("画图小工具")

  canvas = tk.Canvas(root, width=600, height=500, bg="white")
  canvas.pack()

  pen_color = "black"
  last_x, last_y = None, None
  mode = "draw"   # draw / text / circle

  def set_mode(m):
      global mode
      mode = m

  def set_color(c):
      global pen_color
      pen_color = c

  def on_press(event):
      global last_x, last_y
      # 根据 mode 分别处理：draw 画线 / text 写文字 / circle 画圆

  def on_drag(event):
      global last_x, last_y
      # draw 模式下连线段

  def on_release(event):
      global last_x, last_y
      last_x, last_y = None, None

  def clear():
      # 只删笔迹

  # 按钮区 + bind 事件
checklist:
- 窗口 600x500，画布白色
- 颜色按钮能切换画笔颜色
- 拖动时画对应颜色的线，线宽 3
- 清屏只删笔迹（用 tag "stroke"）
- "写文字"模式能在点击处居中写蓝色"你好"，SimHei 18号
- "画圆"模式能在中央画橙色椭圆，外接矩形正确
- 用了全局变量 mode 区分三种模式
- 绑定了三个鼠标事件，用了 global
- 调用了 mainloop
```
