# 第 3 章 · 界面骨架 · 大测验

> 8 道题。这一章解决的是"界面怎么摆、控件怎么用、输入怎么校验"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 在 tkinter 中，实现"顶部筛选区 / 中部表格区 / 底部表单区"三层布局，最合理的做法是？
options:
- 用三个 Frame 分别 pack(side="top") / pack(fill="both", expand=True) / pack(side="bottom")
- 三个控件全用 place 绝对定位，按像素摆
- 中部表格用 grid，其他用 pack，混着来更灵活
- 用一个巨大的 grid 把全部控件铺满
answer: 0
explain: 典型做法是三个 Frame 分区：顶部筛选用 pack(side="top")、底部表单用 pack(side="bottom")、中部表格用 pack(fill="both", expand=True) 占满剩余空间。这种"上下固定 + 中间弹性"的结构清晰、易维护。
```

```quiz
type: choice
q: 关于 ttk.Treeview 的列定义与插入数据，以下写法正确的是？
options:
- tree["columns"] = ("a", "b"); tree.heading("a", text="金额"); tree.insert("", "end", values=(100, "餐饮"))
- tree.add_column("金额"); tree.append(100, "餐饮")
- tree.configure(cols=["金额", "分类"]); tree.add_row([100, "餐饮"])
- tree["show"] = "headings"; tree.insert(0, ["金额", "餐饮"])
answer: 0
explain: Treeview 用 columns 属性定义列标识，heading 设置列标题，insert("", "end", values=...) 插入一行。这是标准三步：定义列、设表头、插入数据。
```

```quiz
type: choice
q: ttk.Combobox 作为分类选择控件时，如何让它既能下拉选择又能允许用户输入？
options:
- 设置 state="readonly"，只能选不能输
- 设置 state="normal"（默认），既能选也能输
- 设置 state="disabled"，禁用
- Combobox 永远只能下拉选择，不能输入
answer: 1
explain: Combobox 的 state 默认为 "normal"，此时用户既可以从下拉列表选择，也可以直接键入。state="readonly" 时只能选不能输（常用于必须选已有分类的场景），state="disabled" 则完全不可交互。
```

```quiz
type: choice
q: 对录入表单做输入校验，以下做法最合理的是？
options:
- 不校验，让用户随便填，存库时报错再处理
- 在"保存"按钮的回调里逐一检查：金额为空/非数字、分类为空、日期格式错误，分别给出明确提示
- 用 try/except 包住整个回调，捕获所有异常后静默忽略
- 在数据库层用 CHECK 约束代替应用层校验
answer: 1
explain: 应用层校验应在提交时逐一检查每个字段：金额为空或非数字、分类未选、日期格式不对等，并给出明确的用户提示（如高亮错误字段、弹消息框）。把校验全丢给数据库会返回不友好的错误信息，静默忽略异常则让用户完全不知道出了什么问题。
```

```quiz
type: choice
q: 列表为空时（还没有任何记录），界面应该如何处理？
options:
- 什么都不显示，留一片空白
- 显示一个空状态提示，如"还没有记录，点击底部添加你的第一笔收支"
- 自动插入一条示例数据
- 弹出一个错误框提示"数据为空"
answer: 1
explain: 空状态是用户体验的基本功。首次使用的用户面对空白列表会感到困惑，明确的引导文案（配一个友好图标更好）能告诉用户"这里本该有东西、下一步该做什么"。自动插入示例数据会污染真实数据，弹错误框则把正常状态当成错误。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 实现记账本的三区界面骨架：顶部筛选区（起止日期两个 Entry + 分类 Combobox + 筛选按钮），中部 Treeview（列：日期/金额/分类/备注），底部表单（金额/分类/日期/备注四个控件 + 保存按钮）。运行后界面结构清晰，筛选和保存按钮点击后在控制台打印对应输入值。注意：tkinter 窗口程序网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  root = tk.Tk()
  root.title("记账本")
  root.geometry("800x500")

  # TODO: 顶部筛选区
  top = ttk.LabelFrame(root, text="筛选"); top.pack(fill="x", padx=8, pady=4)
  # TODO: 中部表格区
  mid = ttk.LabelFrame(root, text="记录"); mid.pack(fill="both", expand=True, padx=8, pady=4)
  # TODO: 底部表单区
  bot = ttk.LabelFrame(root, text="录入"); bot.pack(fill="x", padx=8, pady=4)

  root.mainloop()
checklist:
- 三区布局结构清晰（筛选/表格/录入）
- 顶部含两个日期 Entry + 分类 Combobox + 筛选按钮
- 中部 Treeview 定义了日期/金额/分类/备注四列并显示表头
- 底部含金额/分类/日期/备注控件和保存按钮
- 筛选按钮点击打印筛选条件输入值
- 保存按钮点击打印表单输入值
- 界面能正常运行，控件对齐美观
```

```quiz
type: local
q: 给录入表单加完整输入校验：金额必须是大于 0 的数字、分类必选、日期必须符合 YYYY-MM-DD 格式。任一不通过时在界面上给出明确提示（可用一个 ttk.Label 作为状态栏显示错误信息）。同时实现空状态：Treeview 没有任何数据时显示"暂无记录"提示。注意：tkinter 窗口程序网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  import re
  from datetime import datetime

  root = tk.Tk()
  root.title("录入校验练习")
  root.geometry("500x350")

  frm = ttk.Frame(root, padding=12); frm.pack(fill="both", expand=True)

  ttk.Label(frm, text="金额").grid(row=0, column=0, sticky="w", pady=4)
  amount_var = tk.StringVar()
  ttk.Entry(frm, textvariable=amount_var).grid(row=0, column=1, sticky="ew", padx=8)

  ttk.Label(frm, text="分类").grid(row=1, column=0, sticky="w", pady=4)
  cat_var = tk.StringVar()
  ttk.Combobox(frm, textvariable=cat_var, values=["餐饮", "交通", "工资", "购物"]).grid(row=1, column=1, sticky="ew", padx=8)

  ttk.Label(frm, text="日期").grid(row=2, column=0, sticky="w", pady=4)
  date_var = tk.StringVar(value="2026-01-01")
  ttk.Entry(frm, textvariable=date_var).grid(row=2, column=1, sticky="ew", padx=8)

  status = ttk.Label(frm, foreground="red")
  status.grid(row=4, column=0, columnspan=2, sticky="w", pady=8)

  def validate():
      # TODO: 校验金额/分类/日期，错误时 status.config(text=...) 并返回 False
      status.config(text="校验通过（演示）")

  ttk.Button(frm, text="保存", command=validate).grid(row=3, column=0, columnspan=2, pady=8)
  root.mainloop()
checklist:
- 金额校验：非空且为数字、大于 0，否则提示
- 分类校验：必须已选择，否则提示
- 日期校验：符合 YYYY-MM-DD 格式（用 datetime.strptime 或正则）
- 错误时状态栏显示明确的红色提示文字
- 全部通过时有成功提示
- 演示了空状态：Treeview 无数据时显示"暂无记录"提示
- 校验逻辑覆盖所有失败分支
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 把记账本界面骨架做成一个"能录入、能列表、能清空重来"的可运行原型：三区布局（顶部筛选、中部 Treeview、底部表单），表单校验（金额/分类/日期），保存时把记录插入 Treeview 列表，选中列表某行可回显到表单，点删除按钮移除选中行。数据只存在内存里（列表），不连数据库。要求界面结构清晰、状态栏有反馈、空状态有提示。注意：tkinter 窗口程序网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  from datetime import datetime

  root = tk.Tk()
  root.title("记账本原型")
  root.geometry("820x540")

  # TODO: 顶部筛选区
  # TODO: 中部 Treeview + 滚动条
  # TODO: 底部表单 + 保存/删除/重置按钮
  # TODO: 状态栏 Label

  root.mainloop()
checklist:
- 三区布局完整（筛选 / 列表 / 录入）
- Treeview 有日期/金额/分类/备注四列，带滚动条
- 表单含金额/分类/日期/备注控件
- 输入校验覆盖金额、分类、日期三项，失败时状态栏提示
- 保存成功时记录出现在 Treeview 列表中
- 选中某行可回显到表单（编辑准备）
- 删除按钮能移除 Treeview 中选中的行
- 无数据时显示"暂无记录"空状态提示
- 状态栏对关键操作有成功/失败反馈
- 程序能稳定运行、无崩溃
```
