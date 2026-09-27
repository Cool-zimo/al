# 第 3 章 · 常用控件 · 大测验

> 8 道题。这一章解决的是"用哪些控件"的问题：Entry、Text、Checkbutton、Radiobutton、Listbox、Scrollbar、Combobox、Spinbox、Scale。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: Entry 和 Text 的区别，正确的是？
options:
- Entry 能输入多行，Text 只能单行
- Entry 只能单行输入，Text 能输入多行
- 两者完全一样
- Text 不能绑定 StringVar
answer: 1
explain: Entry 是单行输入框，Text 是多行文本编辑控件。Text 索引用"行.列"格式，且能绑定 StringVar 做读写。
```

```quiz
type: choice
q: 关于 StringVar，正确的是？
options:
- 它是一个普通 str 类型，用来存字符串
- 它是 tkinter 变量类，用 textvariable 绑定控件后 set 值界面会自动更新
- 只能绑定 Button
- 必须在 mainloop 之前销毁
answer: 1
explain: StringVar 是 tkinter 变量类，用 textvariable 绑定到 Entry/Label 等控件后，var.set() 会自动刷新界面。它不是普通 str。
```

```quiz
type: choice
q: Text 的索引 "1.0" 表示？
options:
- 第 0 行第 1 列
- 第 1 行第 0 列，即文档开头
- 第 1 行第 1 列
- 文档末尾
answer: 1
explain: Text 索引格式是"行.列"，行从 1 开始、列从 0 开始，"1.0" 是文档最开头。"end" 才是末尾。
```

```quiz
type: choice
q: 关于 Radiobutton 的单选机制，正确的是？
options:
- 每个 Radiobutton 用不同 variable 就能单选
- 同一组共用一个 variable，各自 value 不同
- Radiobutton 天生单选，不需要 variable
- variable 必须是 BooleanVar
answer: 1
explain: 单选的关键是同一组共用一个 variable。勾选任一个都会把 variable 设成对应 value，从而实现互斥。用不同 variable 会变成两组不互斥。
```

```quiz
type: choice
q: 关于 Listbox 与 Scrollbar 的绑定，正确的是？
options:
- 只需要 scrollbar.config(command=lb.yview)
- 只需要 lb.yscrollcommand=scrollbar.set
- 需要双向绑定：lb.yscrollcommand=scrollbar.set 且 scrollbar.config(command=lb.yview)
- Scrollbar 必须是 Listbox 的子控件
answer: 2
explain: 绑定是双向的：列表滚动时通知滚动条，拖滚动条时通知列表。两者是兄弟控件，各自布局。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"登录界面"：用 grid 布局——"用户名"标签 + Entry、"密码"标签 + Entry（show="*"）、"记住密码"Checkbutton（BooleanVar）、"登录"按钮。点击登录按钮后，把用户名和是否记住密码显示在一个 Label 上。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("登录界面")

  # 在这里做登录界面
checklist:
- 用户名、密码两个 Entry（密码用 show="*"）
- 记住密码用 Checkbutton 绑 BooleanVar
- 有"登录"按钮
- 点击后 Label 显示用户名和是否记住
- 用 grid 布局
- 调用了 mainloop
```

```quiz
type: local
q: 用 ttk.Combobox 和 tk.Scale 做一个"字体设置器"：Combobox 选字体名（只读，选项含"微软雅黑""宋体""黑体"），Scale 选字号（8~72），一个 Label 实时显示预览文字"你好，世界"，文字随选择的字体和字号变化。提示：用 font=(font_name, size) 动态设置。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  root = tk.Tk()
  root.title("字体设置器")

  # 在这里做 Combobox、Scale、预览 Label
checklist:
- 有 Combobox（只读）选字体
- 有 Scale 选字号（8~72）
- 有预览 Label 显示"你好，世界"
- 字体和字号变化能实时更新预览
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: local
q: 综合项目：做一个"迷你记事本"界面。顶部工具栏 Frame（横向）放"新建""打开""保存"三个按钮；中间用 Text 做编辑区（可缩放、随窗口变宽变高）；底部状态栏 Frame 放一个 Label 显示"字符数：0"，要随编辑区内容实时更新（用 bind 绑 "<KeyRelease>" 事件统计字符数）。Text 用等宽字体更美观。提示：Text 的 get("1.0","end") 末尾自带换行，统计时要减 1 或用 strip。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("迷你记事本")
  root.geometry("500x400")

  # 在这里搭界面并绑事件统计字符数
checklist:
- 顶部工具栏 Frame 横向，三个按钮
- 中间 Text 编辑区可缩放（行列配 weight + sticky="nsew"）
- 底部状态栏显示字符数
- 绑定 <KeyRelease> 实时更新字符数
- Text 用等宽字体（如 Consolas 或 Courier）
- 调用了 mainloop
```