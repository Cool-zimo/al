# 第 5 章检测点（第 21–25 课）

> 五道选择题、两道编程题、一个综合项目。本检测点覆盖弹窗对话框、文件选择器、单值输入框、菜单和次级窗口。

## 第 1–5 题：选择题

**第 1 题。** 用户点了"是"时，`messagebox.askyesno("问题", "继续吗？")` 返回什么？

```quiz
type: choice
q: 用户点了"是"时，`messagebox.askyesno("问题", "继续吗？")` 返回什么？
options:
- 字符串 "yes"
- True
- False
- None
answer: 1
explain: 提问类对话框返回的是 Python 布尔值。askyesno 点"是"返回 True，"否"返回 False。
```

**第 2 题。** 用户没选文件就关掉对话框时，`askopenfilename` 返回什么？

```quiz
type: choice
q: 用户没选文件就关掉对话框时，`askopenfilename` 返回什么？
options:
- None
- 空字符串 ""
- False
- 抛出异常
answer: 1
explain: 取消时返回的是空字符串，不是 None。这就是要用 "if not path: return" 守护的原因。
```

**第 3 题。** 用户点了"取消"时，`simpledialog.askstring` 返回什么？

```quiz
type: choice
q: 用户点了"取消"时，`simpledialog.askstring` 返回什么？
options:
- 空字符串 ""
- False
- None
- 0
answer: 2
explain: 三个 simpledialog 函数取消时都返回 None，所以使用前必须判断，否则后续用到这个值的地方会出错。
```

**第 4 题。** 哪一行才真正让菜单栏出现在窗口里？

```quiz
type: choice
q: 哪一行才真正让菜单栏出现在窗口里？
options:
- menubar = tk.Menu(root)
- root.config(menu=menubar)
- menubar.add_command(...)
- menubar.pack()
answer: 1
explain: 创建 Menu 只是把它建在内存里；root.config(menu=menubar) 才把它挂到窗口框架并显示出来。
```

**第 5 题。** 哪个方法让 `Toplevel` 变成模态、阻塞其他窗口的输入？

```quiz
type: choice
q: 哪个方法让 Toplevel 变成模态、阻塞其他窗口的输入？
options:
- top.focus_set()
- top.grab_set()
- top.lift()
- top.wait_window()
answer: 1
explain: grab_set 通过抓取全部输入让窗口变成模态；wait_window 会暂停代码，但它本身不会阻塞其他窗口。
```

## 第 6 题：编程题（本地运行）

```quiz
type: local
exam: true
q: 做一个程序，三个按钮："信息"、"警告"、"错误"。信息弹 showinfo 说"系统一切正常"。警告弹 showwarning 说"磁盘空间不足"。错误弹 showerror 说"连接失败"。每个对话框都要用 parent=root。再加第四个按钮"你确定吗？"，用 askyesno("确认", "要删除全部内容吗？") 提问，点是就把一个 Label 的文字设成"已删除"，点否就设成"已保留"。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import messagebox

  root = tk.Tk()
  root.title("对话框示例")

  # 在这里写 Label 和四个按钮及其回调
checklist:
- 导入了 messagebox
- 三个对话框按钮用了正确的 showinfo/warning/error 调用
- 每个对话框都用了 parent=root
- 第四个按钮用了 askyesno，并按返回值分支
- Label 相应地更新为"已删除"或"已保留"
- 调用了 mainloop
```

## 第 7 题：编程题（本地运行）

```quiz
type: local
exam: true
q: 做一个迷你文本查看器：一个按钮"打开"，用 askopenfilename 选文件，filetypes 支持 .txt 和所有文件；一个 Label 显示所选路径（或"(无)"）；一个 Text 控件用 utf-8 读取文件内容并显示。再加一个按钮"词频统计"，用 askinteger("数量", "取前几个词？", minvalue=1, maxvalue=50, parent=root) 问个数，对加载的文本用正则统计词频，把前 N 个显示在 Listbox 里。每个对话框和回调都要处理取消与空输入。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk
  import re
  from collections import Counter
  from tkinter import filedialog, simpledialog

  root = tk.Tk()
  root.title("文本查看器")

  # 在这里写控件和回调
checklist:
- askopenfilename 用了 filetypes，并按 utf-8 读取
- 成功打开后路径 Label 会更新
- askinteger 用了 minvalue、maxvalue 和 parent=root
- 任一对话框返回 None 都能妥善处理，不崩溃
- 词频统计用了正则和 Counter
- Listbox 显示了要求数量的前几名词
- 调用了 mainloop
```

## 第 8 题：项目题（本地运行）

```quiz
type: local
exam: true
q: 做一个简单的"便签"程序。主窗口一个按钮"新建便签"，点击打开一个模态 Toplevel，里面有一个 Text 控件和两个按钮"保存"与"取消"。在 Text 里输入并点"保存"，把文字追加到主窗口的 Listbox，然后关闭 Toplevel。取消就只关闭它。Toplevel 必须用 grab_set 设为模态，并用 wait_window 让调用者能读到结果。同时加一条菜单栏，文件菜单里有"新建便签"和"退出"。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("便签")

  # 在这里写菜单栏、Listbox，以及创建并等待模态 Toplevel 的
  # 新建便签函数
checklist:
- 菜单栏用 root.config(menu=...) 挂上
- 文件菜单有"新建便签"和"退出"（中间有分隔线）
- "新建便签"打开一个含 Text 控件和保存/取消按钮的 Toplevel
- Toplevel 用 grab_set 设为模态
- 用了 wait_window 让调用者暂停到窗口关闭
- 保存按钮把 Text 内容复制到 Listbox 并销毁 Toplevel
- 取消按钮关闭 Toplevel，不往 Listbox 加东西
- 调用了 mainloop
```
