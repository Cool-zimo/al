# 第 4 章 · 事件：让程序动起来 · 大测验

> 8 道题。这一章解决的是"程序怎么响应用户"的问题：command 回调、lambda 传参、bind 事件、键盘鼠标、trace 变量追踪。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于按钮的 command，正确的是？
options:
- command=greet() 表示点击时调用 greet
- command=greet 表示点击时调用 greet（不加括号）
- command 后面必须跟 lambda
- command 参数必须是字符串
answer: 1
explain: command 需要函数对象本身，所以写 command=greet（不加括号）。加括号会在创建按钮时就立即执行，且点击失效。
```

```quiz
type: choice
q: 循环创建按钮时，下面哪种写法能正确让每个按钮打印自己的编号？
options:
- command=lambda: print(i)
- command=lambda idx=i: print(idx)
- command=print(i)
- command=lambda: print(idx)
answer: 1
explain: 不加默认参数时三个 lambda 共享同一个变量 i，循环结束后都是最后一个值。用 lambda idx=i: 把当前值冻结进默认参数，各 lambda 才有各自的值。
```

```quiz
type: choice
q: bind 的回调参数，正确的是？
options:
- 不需要任何参数
- 必须能接收一个事件对象 event
- 必须接收两个参数
- 只能是 lambda
answer: 1
explain: bind 的事件发生时 tkinter 会自动传入事件对象，回调必须定义参数来接收它。command= 的回调则相反，不收 event。
```

```quiz
type: choice
q: 关于 trace，正确的是？
options:
- 普通 str 也能 trace
- 只有 tkinter 变量类（StringVar 等）才能 trace，用 var.trace("w", callback)
- trace 只能在 mainloop 之后调用
- trace 回调不能接收参数
answer: 1
explain: trace 是 tkinter 变量类的方法，只有 StringVar/IntVar 等才有。普通 str 没有 trace。回调要兼容 tkinter 传入的参数，用 *args。
```

```quiz
type: choice
q: 关于焦点，正确的是？
options:
- 键盘事件发给所有控件
- 键盘事件只发给当前有焦点的控件，可用 focus_set() 主动设置
- 只有 root 能获取焦点
- 焦点不能编程设置
answer: 1
explain: 键盘事件只发给当前有焦点的控件，focus_set() 可以主动把焦点设给某个控件，常用于程序启动时让输入框自动获得焦点。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"鼠标跟随"程序：一个 Label 初始文字"移动鼠标"，绑定 <Motion> 事件到 root，鼠标移动时 Label 实时显示"鼠标在 (x, y)"。要求：用类组织代码。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("鼠标跟随")

  class App:
      def __init__(self, root):
          self.label = tk.Label(root, text="移动鼠标", font=("", 16))
          self.label.pack(padx=30, pady=30)
          # 在这里 bind <Motion> 事件

  App(root)
  root.mainloop()
checklist:
- 用类组织代码
- 绑定了 <Motion> 事件到 root
- 回调接收 event 并用 event.x / event.y
- 鼠标移动时 Label 实时更新坐标
- 调用了 mainloop
```

```quiz
type: local
q: 做一个"实时校验"程序：Entry 绑定 StringVar，一个 Label 显示校验结果。用 trace 监听变量变化，输入内容全部是数字时显示"✓ 合法"并绿色，否则显示"✗ 含非数字字符"并红色。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("实时校验")

  # 在这里做 Entry + StringVar + Label + trace
checklist:
- Entry 绑定 StringVar
- 用 var.trace("w", callback) 绑定回调
- 回调用 *args 接收参数
- 全是数字时绿色"✓ 合法"
- 否则红色"✗ 含非数字字符"
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: local
q: 综合项目：做一个"绘图板"——Canvas（400x300 白色）支持鼠标拖动画红色线条。实现拖动三步：<ButtonPress-1> 记录起点、<B1-Motion> 用 create_line 画线段并持续更新终点为新的起点（连成连续线条）、<ButtonRelease-1> 清理。再加一个"清空"按钮，点击用 delete("all") 清空画布。再加三个按钮"红""绿""蓝"切换画笔颜色。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("绘图板")
  root.geometry("420x350")

  # 在这里做 Canvas、清空按钮、颜色按钮，并 bind 三个鼠标事件
checklist:
- Canvas 400x300 白色
- 绑定 <ButtonPress-1>、<B1-Motion>、<ButtonRelease-1>
- 拖动时能连续画出线条
- 有"清空"按钮，点击 delete("all")
- 有红绿蓝三个按钮可切换画笔颜色
- 调用了 mainloop
```