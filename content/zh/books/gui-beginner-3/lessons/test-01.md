# 第 1 章 · 想清楚再做 · 大测验

> 8 道题。这一章解决的是"动手前到底要想清楚什么"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 设计记账本的数据模型时，"每笔收支记录"这张表最合理的名字和主键设计是？
options:
- 表名 `record`，用自增整数 `id` 作主键
- 表名 `data`，用记录时间作联合主键
- 表名 `item`，不加主键，靠行号区分
- 表名 `records`，用金额字段作主键
answer: 0
explain: 表名应清晰表达"一条记录"的语义；自增整数 id 作为代理主键是最常见、最稳妥的做法，能唯一标识每一笔记录。用时间作主键会撞车（同一秒两笔），用金额作主键会大量重复。
```

```quiz
type: choice
q: 关于三层架构（数据层 / 逻辑层 / 界面层）的职责划分，以下说法正确的是？
options:
- 界面层直接写 SQL 查询数据，效率最高
- 数据层负责把数据库记录转换成业务对象，逻辑层放业务规则，界面层只负责展示与收集输入
- 逻辑层应该 import tkinter，方便直接弹错误提示框
- 三层架构只是概念，实际写代码时放一起更省事
answer: 1
explain: 标准分层：数据层管存取与 SQL，逻辑层放校验/计算等业务规则，界面层只管显示和收集输入。界面层 import 数据层、逻辑层 import 数据层，但反过来不应该依赖。让逻辑层 import tkinter 会破坏可测试性和可移植性。
```

```quiz
type: choice
q: 为什么记账本这类单机桌面程序适合选 SQLite 而不是 MySQL？
options:
- SQLite 性能永远比 MySQL 快
- SQLite 是文件型数据库，无需安装服务、零配置、单文件存储，正好契合桌面应用"数据存在用户机器上"的场景
- SQLite 支持更大的并发量，能服务上万个用户
- MySQL 不能存中文
answer: 1
explain: SQLite 是无服务的文件型数据库，一个 .db 文件就是整个数据库，不需要安装、启动、配置服务器，随程序一起分发，非常适合单机桌面应用。它的并发能力不如 MySQL，但桌面软件通常只有单个进程访问。
```

```quiz
type: choice
q: 画原型草图（纸面或工具）最主要的价值是什么？
options:
- 让界面看起来专业，方便截图发朋友圈
- 在动手写代码之前暴露布局、字段、流程上的问题，把不确定性提前消灭
- 原型草图是交付物，用户会照着验收
- 只是为了练习画图
answer: 1
explain: 原型草图的核心价值是"提前暴露问题"。在纸面上就能发现某个字段没地方放、某个流程走不通，成本几乎为零；一旦写成代码再改，代价就大了。它不是交付物，是给自己和团队思考的工具。
```

```quiz
type: choice
q: 需求清单里"分类"字段设计成另一张表（category）并用外键引用，而不是在主表里存分类名字字符串，主要好处是？
options:
- 查询速度更快，因为字符串比较慢
- 可以统一维护分类名（改一次全生效）、避免脏数据、支持扩展分类属性
- 外键约束会让程序报错，更安全
- 能省存储空间，整数比字符串小
answer: 1
explain: 外键引用分类表，让分类成为受控词汇表：改名只改一处、用户手输错字能被约束挡住、后续可以给分类加图标/颜色/排序等属性。这是关系型数据库规范化的基本操作，省空间只是附赠。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 为记账本设计完整的数据模型：写出四张表的 CREATE TABLE 语句（记录表 records、分类表 categories、账户表 accounts、预算表 budgets），每张表列出全部字段、主键、必要的外键约束。用 Python 的 sqlite3 连一个内存数据库（:memory:）依次执行建表，并打印 tables 列表验证。注意：只涉及 sqlite3，不涉及 tkinter 窗口，但为稳妥请点"在 VS Code 里打开"运行。
starter: |
  import sqlite3

  CONN = sqlite3.connect(":memory:")
  CONN.row_factory = sqlite3.Row

  def create_tables(conn):
      # TODO: 依次执行四张表的 CREATE TABLE
      pass

  def list_tables(conn):
      cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      return [r["name"] for r in cur.fetchall()]

  if __name__ == "__main__":
      create_tables(CONN)
      print("已创建的表:", list_tables(CONN))
checklist:
- 四张表都定义完整（records / categories / accounts / budgets）
- 每张表有主键（通常是 id INTEGER PRIMARY KEY AUTOINCREMENT）
- records 表有分类、账户外键，并定义 FOREIGN KEY 约束
- 字段类型合理（金额用 REAL 或 INTEGER 分，时间用 TEXT ISO8601）
- 用 :memory: 连接成功建表，list_tables 能正确列出四张表
```

```quiz
type: local
q: 用纸面/工具画出记账本的原型草图（可以手绘拍照、或用 ASCII、或用 tkinter 快速摆个骨架），并在图旁写出一份需求清单（功能点 8-10 条，分"必须有"和"可以有"两档）。然后对照草图，指出至少 3 处你在动笔前没想到的细节问题（例如：空状态怎么显示、删除要不要二次确认、日期默认填今天）。注意：这是设计题，不需要能运行的代码，但要用到一个 tkinter 骨架来验证布局想法，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  # 用 tkinter 快速搭个布局骨架，验证你的草图想法
  root = tk.Tk()
  root.title("记账本布局草图")
  root.geometry("800x500")

  top = ttk.Frame(root); top.pack(fill="x", padx=8, pady=8)
  mid = ttk.Frame(root); mid.pack(fill="both", expand=True, padx=8)
  bot = ttk.Frame(root); bot.pack(fill="x", padx=8, pady=8)

  ttk.Label(top, text="筛选区：起止日期 / 分类").pack(side="left")
  ttk.Label(mid, text="这里放 Treeview 列表").pack(expand=True)
  ttk.Label(bot, text="表单区：金额/分类/日期/备注").pack(side="left")

  root.mainloop()
checklist:
- 提交了原型草图（手绘/ASCII/工具图均可）
- 需求清单有 8-10 条，且区分了"必须有"和"可以有"
- 指出了至少 3 处动笔前没想到的细节问题
- 用 tkinter 骨架验证过布局分区（顶部/中部/底部）
- 草图与需求清单能对应上（图上有的功能清单里有）
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 独立完成"记账本项目启动包"：一份完整的需求文档 + 数据模型 + 项目骨架。要求：1) requirements.md（需求清单分优先级）；2) schema.sql（四张表完整建表语句，含注释）；3) 一个 tkinter 三区布局的空壳程序（顶部筛选、中部 Treeview 占位、底部表单），运行后界面结构与草图一致；4) 在 README 里写清项目目录结构和各模块职责（数据层/逻辑层/界面层）。
starter: |
  # 建议目录结构：
  #   requirements.md
  #   schema.sql
  #   README.md
  #   src/
  #     __init__.py
  #     db.py          (数据层)
  #     service.py     (逻辑层)
  #     ui.py          (界面层)
  #     main.py        (入口)
  #
  # 本期只需完成目录骨架 + 三区布局空壳 + 文档，业务逻辑可留空。
  import tkinter as tk
  import tkinter.ttk as ttk

  root = tk.Tk()
  root.title("记账本 v0.1 骨架")
  root.geometry("900x600")

  top = ttk.LabelFrame(root, text="筛选"); top.pack(fill="x", padx=8, pady=4)
  mid = ttk.LabelFrame(root, text="记录列表"); mid.pack(fill="both", expand=True, padx=8, pady=4)
  bot = ttk.LabelFrame(root, text="录入"); bot.pack(fill="x", padx=8, pady=4)

  ttk.Label(top, text="日期起 ___ 日期止 ___ 分类 [全部 v]   [筛选]").pack(anchor="w", padx=8, pady=8)
  ttk.Label(mid, text="（Treeview 将在第 3 章接入）").pack(expand=True)
  ttk.Label(bot, text="金额 ___ 分类 [v] 日期 ___ 备注 ___  [保存]").pack(anchor="w", padx=8, pady=8)

  root.mainloop()
checklist:
- requirements.md 存在，需求分优先级（必须有 / 可以有）
- schema.sql 包含四张表完整建表语句，字段、主键、外键、注释齐全
- tkinter 程序呈现三区布局（筛选/列表/录入）且能运行
- README 写清目录结构和各模块职责（数据/逻辑/界面三层）
- 项目整体结构清晰，为后续章节留有扩展空间
- 运行后界面结构与设计文档描述一致
```
