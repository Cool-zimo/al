# 第 3 章 · ttk 与界面美化 · 大测验

> 8 道题。这一章解决的是"tkinter 原生控件太丑、太老旧，怎么用 ttk 做出现代感的界面，以及怎么放表格、标签页和进度条，还要让耗时操作不卡死界面"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 tkinter 原生控件和 ttk 控件的区别，下列说法正确的是？
options:
- ttk 控件和原生控件外观完全一样，只是换了导入方式
- ttk 控件外观由主题引擎管理，跨平台更一致，但不接受 bg/fg 直接参数
- ttk 控件可以像原生控件一样直接用 bg、fg、font 参数改颜色
- Canvas 和 Notebook 都是 ttk 独有的控件
answer: 1
explain: ttk 的控件由主题引擎绘制，跨平台一致性好，但改外观必须用 Style 对象，不接受原生那种 bg/fg 直接参数。Canvas 反而是 ttk 没有、只能用 tk.Canvas 的控件。
```

```quiz
type: choice
q: 想把 ttk 所有按钮改成"白字 + 蓝色背景 + 内边距 8"，正确的做法是？
options:
- ttk.Button(root, text="确定", bg="blue", fg="white").pack()
- 先 style.theme_use("clam")，再 style.configure("TButton", foreground="white", background="#3498db", padding=8)，然后再创建按钮
- 先创建按钮，再调用 style.theme_use("clam") 切换主题
- style.configure("tbutton", background="blue")
answer: 1
explain: 定制 ttk 外观要用 Style：先切到支持自定义背景的 clam 主题，再 configure("TButton", ...)，而且必须在创建控件之前完成。样式类名是首字母大写的 TButton，原生控件的 bg/fg 参数对 ttk 无效。
```

```quiz
type: choice
q: 想做一个纯表格（不显示左侧可展开的树列），创建 Treeview 时应该写？
options:
- ttk.Treeview(root, columns=("name","age"), show="tree")
- ttk.Treeview(root, columns=("name","age"), show="headings")
- ttk.Treeview(root, columns=("name","age"), show="all")
- ttk.Treeview(root, columns=("name","age"))
answer: 1
explain: show="headings" 表示只显示自定义的列标题和数据，隐藏左侧的树列。show="tree" 会反过来只显示树列；不写 show 默认是树列和表头都显示，左侧会多出一列空白。
```

```quiz
type: choice
q: 关于 ttk.Notebook 标签页，下列说法正确的是？
options:
- 标签栏从左到右的顺序由 Frame 创建的先后顺序决定
- 标签栏从左到右的顺序由 add 调用的先后顺序决定
- 每个标签页必须是一个字符串
- 标签页的内容可以不用布局，Notebook 会自动排列
answer: 1
explain: Notebook 标签栏的顺序 = add 调用的顺序，先 add 的在左边。每个标签页必须是 Frame 等容器控件，而且 Frame 里的控件仍要自己 pack/grid，否则内容会显示不出来。
```

```quiz
type: choice
q: 一个按钮的回调里要做一个耗时 5 秒的计算，又不希望界面卡死，正确的做法是？
options:
- 在回调里直接 time.sleep(5) 再更新界面
- 把耗时操作放到后台线程里执行，完成后用 root.after(0, lambda: bar.configure(value=100)) 回到主线程更新界面
- 用多个 Button 轮流调用，分摊耗时
- 在子线程里直接写 bar["value"] = 100
answer: 1
explain: tkinter 是单线程且非线程安全的，耗时操作不能在回调里同步跑（会卡死事件循环），也不能在线程里直接改界面（会崩溃）。标准套路是后台线程 + root.after(0, ...) 把更新挂号到主线程。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"学生信息表"窗口：标题"学生信息"。用 ttk 控件 + grid 布局。第一列放三个标签"姓名""年龄""班级"，第二列放三个 ttk.Entry（年龄输入框加个校验提示：要求输入整数）。再加一个 ttk.Combobox 放"年级"下拉，预设 values=["一年级","二年级","三年级"]。最后一行放一个 ttk.Button 文字"提交"。另外在窗口上方加一个 ttk.Treeview 表格（列：姓名/年龄/班级），show="headings"，插入 3 行示例数据，绑定 <<TreeviewSelect>> 事件，选中某行时在终端打印该行的三个值（先判断 selection 非空）。提示：表格用 insert("", "end", values=...)。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  root = tk.Tk()
  root.title("学生信息")

  # 上方：Treeview 表格 + 选中事件
  # 下方：标签/输入框/Combobox/按钮，用 grid 布局
checklist:
- 用了 ttk 控件（Label/Entry/Button/Combobox/Treeview）
- Treeview 是 show="headings" 的纯表格
- 表格插入了 3 行示例数据
- 绑定了 <<TreeviewSelect>>，选中时打印该行值
- 选中事件里做了 selection 非空的判断
- Combobox 有预设的三个年级选项
- 表单用了 grid 布局
- 调用了 mainloop
```

```quiz
type: local
q: 做一个"三页设置面板"：ttk.Notebook 做标签页，三个页分别是"账户""外观""关于"。账户页放两个输入框（账号、密码，密码用 show="*"）；外观页放一个 ttk.Combobox 选择主题（values=["浅色","深色","护眼绿"]）和一个 ttk.Checkbutton "开机自启"；关于页放一行版本文字。每页用一个 ttk.Frame 做容器，页内控件用 pack 或 grid 布局。再给 Notebook 绑定 <<NotebookTabChanged>> 事件，切换时在终端打印"切换到了第 N 页"。提示：切换时用 notebook.select() 拿当前页 ID，notebook.index(id) 拿索引。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  root = tk.Tk()
  root.title("设置")

  notebook = ttk.Notebook(root)
  notebook.pack(fill="both", expand=True)

  # 三个 Frame 页面，分别 add 进去，绑切换事件
checklist:
- 有三个标签页，文字分别是账户/外观/关于
- 账户页有账号、密码两个输入框，密码 show="*"
- 外观页有主题 Combobox 和开机自启 Checkbutton
- 关于页有版本文字
- 每页都用 Frame 做容器，页内做了布局
- 绑定了 <<NotebookTabChanged>> 并打印切换信息
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"下载管理器"界面：顶部一个 ttk.Progressbar（determinate 模式，maximum=100）和一个 ttk.Label 显示进度文字（初始"0%"）。中部一个 ttk.Treeview 表格，列（文件名/大小/状态），show="headings"，插入 4 行示例数据。底部三个按钮："开始下载""暂停""清除完成"。功能：1）点"开始下载"后，用 root.after 递归模拟进度，每 150 毫秒 value 加 5，Label 同步显示百分比；到 100 后 Label 显示"下载完成"；2）用 clam 主题并把 TButton 配成白字 + #3498db 背景 + padding 8 + SimHei 12号字体；3）选中表格某一行点"清除完成"时，若该行状态是"完成"就删除该行，否则不删（用 selection + delete）；4）选中的行在终端打印其文件名和状态（先判断 selection 非空）。提示：进度逻辑用 after 递归，绝不用 sleep；样式要建控件前配置。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  root = tk.Tk()
  root.title("下载管理器")

  style = ttk.Style()
  # 切 clam 主题 + configure TButton 样式

  # 进度条 + 进度 Label
  bar = ttk.Progressbar(root, length=400, mode="determinate", maximum=100, value=0)
  label = ttk.Label(root, text="0%")

  # 表格：文件名/大小/状态 + 插入示例数据 + 选中事件
  tree = ttk.Treeview(root, columns=("name","size","status"), show="headings")

  def start():
      # after 递归更新进度

  def clear_done():
      # 删除选中且状态为"完成"的行

  # 三个按钮
checklist:
- 用了 clam 主题并配置了 TButton 样式（白字、#3498db、padding 8、SimHei 12）
- 进度条是 determinate、max 100
- 开始下载用 after 递归更新，每 150ms +5
- Label 同步显示百分比，到 100 显示"下载完成"
- Treeview 是纯表格，有 4 行示例数据
- "清除完成"只删状态为"完成"的选中行
- 选中行能在终端打印文件名和状态，且有非空判断
- 调用了 mainloop
```
