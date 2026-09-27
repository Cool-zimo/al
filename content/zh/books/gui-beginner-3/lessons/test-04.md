# 第 4 章 · 打通 · 大测验

> 8 道题。这一章解决的是"界面和数据怎么连起来、改动怎么同步"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 用 observer（观察者）模式解耦界面与数据的核心思想是？
options:
- 让界面类继承数据库类，直接调用父类方法
- 数据层发生变更时主动通知所有订阅者（界面），界面只订阅自己关心的事件并刷新，双方互不依赖具体实现
- 界面定时轮询数据库，每秒查一次有没有新数据
- 把数据库游标对象直接传给每个控件
answer: 1
explain: observer 模式的本质是发布-订阅：数据层在被修改后发出通知（如 on_records_changed），所有注册过的界面回调各自刷新自己关心的部分。这样数据层不 import tkinter，界面也不直接持有数据库连接，双方只依赖一个抽象的事件接口。
```

```quiz
type: choice
q: 加载数据到 Treeview 时，refresh_list 函数通常要做什么？
options:
- 直接把新数据 append 到 Treeview 末尾
- 先 tree.delete(*tree.get_children()) 清空现有行，再逐行 insert 新数据
- 只插入新数据，不删旧的
- 每次刷新都重建整个 Treeview 控件
answer: 1
explain: 全量刷新的标准流程是先清空所有现有行（delete(*get_children())），再遍历新数据逐行 insert。这样可以保证界面与数据源完全一致，是最简单可靠的同步方式。
```

```quiz
type: choice
q: 关于全量刷新与增量更新的取舍，以下说法正确的是？
options:
- 全量刷新永远优于增量，因为代码简单
- 数据量小、改动不频繁时全量刷新够用；数据量大或实时性要求高时，增量更新（只改变化的那一行）更高效
- 增量更新永远更简单，应该默认使用
- 两者效果完全一样，只是写法不同
answer: 1
explain: 全量刷新实现简单、不易出错，适合数据量小（几百条以内）的桌面应用；但当列表有上万行、或多人协作需要实时同步时，全量刷新会有明显卡顿，此时应只更新变化的部分（增量）。选择取决于数据规模和实时性需求。
```

```quiz
type: choice
q: 添加一条记录时，正确的调用链应该是？
options:
- 按钮回调里直接拼 SQL 写入数据库，然后手动 reload
- 按钮回调 → 校验输入 → 调用逻辑层 add_record → 数据层执行 SQL → 发出变更通知 → 界面刷新
- 按钮回调 → 直接操作 Treeview → 程序退出时一次性写库
- 按钮回调里同时更新数据库和 Treeview，写两遍同样的逻辑
answer: 1
explain: 标准的分层调用链是：界面收集输入并校验 → 调逻辑层业务函数 → 逻辑层调数据层执行 SQL → 数据层变更后通知界面刷新。这样每层只做自己的事，校验、持久化、界面刷新各司其职，代码可维护、可测试。
```

```quiz
type: choice
q: 删除记录时，以下做法正确的是？
options:
- 直接删掉 Treeview 里选中的行，不碰数据库
- 弹出二次确认对话框，用户确认后再调数据层删除并刷新列表
- 双击即删除，越快越好
- 把记录标为"已删除"但数据库里不删
answer: 1
explain: 删除是不可逆操作，应弹出二次确认对话框让用户确认；确认后再调用数据层执行 DELETE，然后刷新列表。这既是防止误操作的保险，也符合用户对"删除"的心理预期。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 实现 observer 解耦：写一个极简的 EventBus（或 Subject 类），支持 subscribe(event_name, callback) 和 emit(event_name, *args)。然后让数据层的 add_record / delete_record 在执行后 emit 对应事件，界面层订阅这些事件并刷新 Treeview。用 tkinter 演示：点保存后列表自动刷新（不靠手动调用 refresh）。注意：tkinter 窗口程序网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  class EventBus:
      def __init__(self):
          self._subs = {}
      def subscribe(self, event, cb):
          self._subs.setdefault(event, []).append(cb)
      def emit(self, event, *args):
          for cb in self._subs.get(event, []):
              cb(*args)

  bus = EventBus()
  store = []  # 模拟数据层

  def add_record(amount, category):
      store.append({"amount": amount, "category": category})
      bus.emit("records_changed")   # TODO: 数据层发出通知

  root = tk.Tk()
  root.title("Observer 演示")
  root.geometry("500x350")
  tree = ttk.Treeview(root, columns=("amount", "category"), show="headings")
  tree.heading("amount", text="金额"); tree.heading("category", text="分类")
  tree.pack(fill="both", expand=True, padx=8, pady=8)

  def refresh():
      tree.delete(*tree.get_children())
      for r in store:
          tree.insert("", "end", values=(r["amount"], r["category"]))

  bus.subscribe("records_changed", refresh)   # 界面订阅

  frm = ttk.Frame(root); frm.pack(fill="x", padx=8, pady=4)
  a_var = tk.StringVar(); c_var = tk.StringVar()
  ttk.Entry(frm, textvariable=a_var).pack(side="left", padx=4)
  ttk.Entry(frm, textvariable=c_var).pack(side="left", padx=4)
  ttk.Button(frm, text="保存", command=lambda: add_record(a_var.get(), c_var.get())).pack(side="left", padx=4)
  root.mainloop()
checklist:
- EventBus 实现了 subscribe 和 emit 两个方法
- 数据层（add_record/delete_record）在执行后 emit 对应事件
- 界面层只通过订阅事件触发刷新，不在按钮回调里手动调 refresh
- Treeview 在保存/删除后能自动同步显示
- 事件机制运行正常，界面与数据层解耦
- tkinter 程序能稳定运行
```

```quiz
type: local
q: 实现记账本的"加载 + 添加 + 删除"完整流程：用 sqlite3 建一个内存数据库（含 records 表），界面有 Treeview 列表、录入表单、保存/删除按钮。打开窗口时自动加载已有数据；点保存把表单数据写入数据库并刷新列表；选中某行点删除，弹出二次确认，确认后从数据库删除并刷新。全程用参数化查询。注意：tkinter 窗口程序网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  import sqlite3
  from tkinter import messagebox

  CONN = sqlite3.connect(":memory:")
  CONN.execute("""CREATE TABLE records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL, category TEXT NOT NULL, note TEXT DEFAULT '')""")
  CONN.commit()

  root = tk.Tk()
  root.title("记账本 · 打通演示")
  root.geometry("700x450")

  tree = ttk.Treeview(root, columns=("id","amount","category","note"), show="headings")
  for col, txt in [("id","ID"),("amount","金额"),("category","分类"),("note","备注")]:
      tree.heading(col, text=txt)
  tree.pack(fill="both", expand=True, padx=8, pady=8)

  frm = ttk.Frame(root); frm.pack(fill="x", padx=8, pady=4)
  amount_var = tk.StringVar(); cat_var = tk.StringVar(); note_var = tk.StringVar()
  ttk.Entry(frm, textvariable=amount_var, width=10).pack(side="left", padx=4)
  ttk.Entry(frm, textvariable=cat_var, width=10).pack(side="left", padx=4)
  ttk.Entry(frm, textvariable=note_var, width=16).pack(side="left", padx=4)

  def refresh():
      # TODO: SELECT * FROM records，清空 tree 后逐行插入
      pass

  def on_save():
      # TODO: INSERT，参数化，然后 refresh
      pass

  def on_delete():
      # TODO: 二次确认，DELETE by id，参数化，然后 refresh
      pass

  ttk.Button(frm, text="保存", command=on_save).pack(side="left", padx=4)
  ttk.Button(frm, text="删除选中", command=on_delete).pack(side="left", padx=4)

  refresh()
  root.mainloop()
checklist:
- 窗口打开时自动加载已有数据到 Treeview
- 保存时把表单数据 INSERT 进数据库（参数化查询）
- 保存后列表自动刷新，显示新记录
- 删除前弹出二次确认对话框
- 确认后 DELETE 数据库中对应记录（参数化查询）
- 删除后列表刷新，选中行消失
- 数据库操作使用参数化，无字符串拼接
- 全程运行稳定，无崩溃
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 把第 3、4 章的界面骨架与数据层真正打通，做成一个"能存盘"的记账本：界面（三区布局、Treeview、表单、校验、空状态）+ 数据层（db.py，建表、CRUD、参数化查询、事务）+ 逻辑层（service.py，业务规则、observer 通知）+ 数据持久化到真实文件 ledger.db。要求：支持添加/删除/修改（选中行回显表单，保存即修改）、删除二次确认、启动时加载、observer 解耦、关闭时可选导出一份 CSV。注意：tkinter 窗口程序网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  # 建议结构：
  #   db.py       数据层
  #   service.py  逻辑层（含 EventBus / observer）
  #   ui.py       界面层
  #   main.py     入口
  #
  # main.py 骨架：
  import tkinter as tk
  import tkinter.ttk as ttk
  import sqlite3

  DB_PATH = "ledger.db"

  def get_conn():
      conn = sqlite3.connect(DB_PATH)
      conn.row_factory = sqlite3.Row
      return conn

  def init_db(conn):
      conn.execute("""CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL, category TEXT NOT NULL,
          note TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')))""")
      conn.commit()

  # TODO: 在 main.py 里组装 UI 与数据层，实现完整增删改查
  root = tk.Tk()
  root.title("记账本 v1.0")
  root.geometry("850x550")
  root.mainloop()
checklist:
- 项目分三层：db.py / service.py / ui.py，职责清晰
- 数据持久化到真实 ledger.db 文件，重启后数据不丢
- 支持添加、删除、修改（选中回显、保存即更新）
- 删除有二次确认
- 启动时自动加载已有数据
- 全程使用参数化查询，事务管理正确
- observer/事件机制解耦界面与数据
- 界面有空状态提示与状态栏反馈
- 可选实现：关闭时导出 CSV
- 程序能稳定运行、功能完整
```
