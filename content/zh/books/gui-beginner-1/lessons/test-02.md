# 第 2 章 · 布局：控件放哪儿 · 大测验

> 8 道题。这一章解决的是"控件放哪儿"的问题：pack/grid/place 三种布局管理器、grid 的行列与权重、place 的绝对/相对定位。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于三种布局管理器，下列说法正确的是？
options:
- pack 按行列表格布局，grid 按贴边排队，place 按坐标定位
- pack 按贴边排队，grid 按行列表格，place 按坐标定位
- 三种管理器可以随意在同一父控件上混用
- place 是最推荐使用的布局管理器
answer: 1
explain: pack 贴边排队、grid 行列表格、place 坐标定位，这是三者的定位。选项 C 错误，同一父控件只能用一种管理器；选项 D 错误，place 只在特殊场景用，grid 才是最常用的。
```

```quiz
type: choice
q: 想让控件在它的格子里左右撑满，sticky 应该写？
options:
- sticky="n"
- sticky="ns"
- sticky="ew"
- sticky="center"
answer: 2
explain: sticky="ew" 表示 east+west 两个方向都贴，横向撑满。选项 B 的 "ns" 是纵向撑满；选项 A 只是上贴；"center" 不是合法的 sticky 组合值。
```

```quiz
type: choice
q: 窗口放大后控件仍然挤在左上角不动，最可能缺了哪一步？
options:
- 没写 mainloop
- 没给行列配置 weight，也没给控件写 sticky
- 没 import tkinter
- 控件没创建
answer: 1
explain: 权重默认是 0，没人分空间所以控件不动。需要 columnconfigure/rowconfigure 设 weight 让格子变大，再加 sticky 让控件填满格子，两者缺一不可。
```

```quiz
type: choice
q: 想让一个控件横跨两列，应该用什么参数？
options:
- sticky="ew"
- columnspan=2
- rowspan=2
- side="both"
answer: 1
explain: columnspan=2 让控件横向占两列。rowspan 是纵向跨行；sticky 是贴边撑满；side 是 pack 的参数。
```

```quiz
type: choice
q: 关于 place 的 anchor，anchor="ne" 表示？
options:
- 控件的左上角对齐到坐标点
- 控件的右上角对齐到坐标点
- 控件的中心对齐到坐标点
- 控件的左下角对齐到坐标点
answer: 1
explain: anchor 用方位缩写，n=north 上、e=east 右，所以 "ne" 是控件右上角对齐到指定坐标。默认 "nw" 是左上角。
```

## 第二部分 · 动手题

```quiz
type: local
q: 用 grid 做一个"注册表单"：第 0 行"用户名："标签（右对齐）+ Entry；第 1 行"邮箱："标签（右对齐）+ Entry；第 2 行"密码："标签（右对齐）+ Entry；第 3 行一个"注册"按钮横跨两列、横向撑满。所有控件留 5 像素边距。第 1 列配置 weight=1 让输入框随窗口变宽。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("注册表单")
  root.geometry("350x200")

  # 在这里用 grid 完成表单，并配置 columnconfigure(1, weight=1)
checklist:
- 三个标签都 sticky="e" 右对齐
- 三个 Entry 已放置
- 注册按钮 columnspan=2 sticky="ew"
- 配置了 columnconfigure(1, weight=1)
- 有 padx/pady 边距
- 调用了 mainloop
```

```quiz
type: local
q: 用 place 做一个"画中画"效果：窗口 500x400，底部一个铺满的灰色 Label，中间放一个宽 200、高 100 的白色 Label，用 relx=0.5 rely=0.5 anchor="center" 让它始终居中。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.geometry("500x400")
  root.title("画中画")

  # 在这里用 place 做两层叠加
checklist:
- 背景 Label 用 place relwidth=1 relheight=1 铺满
- 内层 Label 用 relx=0.5 rely=0.5 anchor="center"
- 内层尺寸 200x100
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: local
q: 综合项目：用 Frame + grid 做一个"简易记事本"框架。顶部一个 Frame 放三个按钮（新建/打开/保存，横向排，side="left"）；中间一个 Frame 放一个多行文本框（第 20 课会讲 Text，这里用 tk.Label 模拟"编辑区"，bg="white" 占满空间）；底部一个 Frame 放一个状态栏 Label（文字"就绪"，左对齐）。要求：中间编辑区能随窗口缩放（用 weight + sticky="nsew"）。所有按钮留 2 像素边距。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("简易记事本")
  root.geometry("500x400")

  # 在这里用 Frame 分区 + 各自布局完成框架
checklist:
- 有顶部 Frame 横向撑满，内含三个按钮（side="left"）
- 有中间编辑区 Frame，内部用 grid 放一个占满的 Label（bg="white"）
- 中间 Frame 的行和列都配了 weight
- 有底部 Frame，内含左对齐状态栏 Label
- 窗口缩放时中间编辑区能跟随变大
- 调用了 mainloop
```