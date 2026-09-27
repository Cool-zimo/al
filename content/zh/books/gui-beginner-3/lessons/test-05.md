# 第 5 章 · 统计图表 · 大测验

> 8 道题。这一章解决的是"把账本里的数字变成能看懂的图"的问题——从 SQL 聚合到 matplotlib 嵌入 tkinter，再到中文字体和自动刷新。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 从存成 YYYY-MM-DD 的 records 表里按"月份"分组求和，正确的做法是什么？
options:
- WHERE date 包含 "-09"
- SELECT substr(date, 1, 7) 作为分组键，再 GROUP BY
- GROUP BY date
- 把日期转成时间戳再整除 86400
answer: 1
explain: YYYY-MM-DD 的前 7 位正好是 YYYY-MM，substr(date,1,7) 取出它就是月份。GROUP BY date 会按每一天分组（粒度太细），WHERE 只能过滤不能分组。
```

```quiz
type: choice
q: 聚合函数 SUM() 在没有匹配行时返回什么？下面哪段代码最安全？
options:
- total = cur.fetchone()[0]，直接拿来加 100
- total = cur.fetchone()[0] or 0，再做运算
- if total is None: total = None，保持原样
- 聚合函数永远返回 0，不需要处理
answer: 1
explain: 聚合函数无匹配行时返回 None 而不是 0。None 参与算术运算会抛 TypeError。用 `or 0` 兜底是最简洁安全的写法。
```

```quiz
type: choice
q: 在 tkinter 程序里嵌入 matplotlib 图表，为什么不能用 plt.show()？
options:
- 因为 plt.show() 画不出柱状图
- 因为 plt.show() 会弹出独立窗口并阻塞 tkinter 主循环，导致主窗口卡死
- 因为 plt.show() 只能画饼图
- 因为 plt.show() 需要联网下载字体
answer: 1
explain: plt.show() 启动 matplotlib 自己的 GUI 主循环，会阻塞 tkinter 的主循环，主窗口失去响应、按钮点不动。嵌入必须用 FigureCanvasTkAgg 把图渲染进 tkinter 控件。
```

```quiz
type: choice
q: 关于 matplotlib.use("TkAgg") 的调用时机，以下说法正确的是？
options:
- 可以在程序任意位置调用，随时切换后端
- 必须在 import pyplot 之前调用，且只能调一次
- 只能在 mainloop 之后调用
- use("TkAgg") 每次重绘前都要再调一次
answer: 1
explain: matplotlib.use() 必须在 import pyplot 之前设置，因为后端在 pyplot 首次导入时就初始化了，之后再设就太晚了。且只能调一次。本项目用 Figure API 不走 pyplot，可省略但写上更保险。
```

```quiz
type: choice
q: 饼图分类太多（比如 20 个）时，最合理的处理方式是？
options:
- 把所有分类都画上去，标签挤一点没关系
- 只显示金额前 N 名，其余合并为"其他"一项
- 改用折线图
- 把饼图缩小到看不见标签
answer: 1
explain: 饼图类别太多会糊成一片、标签重叠看不清。只显示前几名并合并"其他"既清晰又能反映整体结构（保持在 7 块以内）。折线图不适合展示分类占比。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 实现两个聚合函数 summarize_by_category(conn, rtype) 和 summarize_by_month(conn, rtype)，分别按分类和按月份汇总支出。要求：用 GROUP BY + SUM、? 占位符传参、按月用 substr(date,1,7)、结果格式化成两位小数。然后用假数据（至少 6 条记录，覆盖 3 个分类、2 个月份）验证输出。注意：sqlite3 本地运行，窗口程序在网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sqlite3

  conn = sqlite3.connect(":memory:")
  conn.executescript("""
      CREATE TABLE records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          category TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL
      );
      INSERT INTO records(type, category, amount, date) VALUES
          ('支出','餐饮',1280.50,'2026-08-15'),
          ('支出','交通',340.00,'2026-08-20'),
          ('支出','购物',856.00,'2026-08-25'),
          ('支出','餐饮',620.00,'2026-09-03'),
          ('支出','居住',1500.00,'2026-09-01'),
          ('支出','交通',120.00,'2026-09-10'),
          ('收入','工资',8000.00,'2026-08-01');
  """)

  def summarize_by_category(conn, rtype="支出"):
      cur = conn.cursor()
      cur.execute("""
          SELECT category, SUM(amount) AS total
          FROM records
          WHERE type = ?
          GROUP BY category
          ORDER BY total DESC
      """, (rtype,))
      return cur.fetchall()

  def summarize_by_month(conn, rtype="支出"):
      cur = conn.cursor()
      cur.execute("""
          SELECT substr(date,1,7) AS month, SUM(amount) AS total
          FROM records
          WHERE type = ?
          GROUP BY month
          ORDER BY month
      """, (rtype,))
      return cur.fetchall()

  print("按分类：")
  for cat, total in summarize_by_category(conn):
      print(f"  {cat:6s} {total:>10.2f}")
  print("按月：")
  for month, total in summarize_by_month(conn):
      print(f"  {month}  {total:>10.2f}")
  conn.close()
checklist:
- 两个函数都用了 GROUP BY
- 用了 ? 占位符传 rtype 参数
- 按月用了 substr(date,1,7)
- 结果格式化成两位小数
- 正确打印出分类汇总和月度汇总
```

```quiz
type: local
q: 用 FigureCanvasTkAgg 把一个饼图（分类占比）和一个柱状图（月度趋势）并排嵌入 tkinter 窗口。要求：饼图显示前 6 名 + "其他"，柱状图柱顶标数字，两个图用 add_subplot(121/122) 并排。窗口程序在网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import matplotlib
  matplotlib.use("TkAgg")
  from matplotlib.figure import Figure
  from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

  root = tk.Tk()
  root.title("统计图表")
  root.geometry("900x450")

  fig = Figure(figsize=(9, 4), dpi=100)
  ax1 = fig.add_subplot(121)
  ax2 = fig.add_subplot(122)

  # 假数据
  data = [("餐饮", 1280), ("交通", 340), ("购物", 856),
          ("居住", 1500), ("娱乐", 420), ("医疗", 200), ("其他", 180)]

  # TODO: 饼图——前 6 名 + "其他"合并，autopct 显示百分比
  top = data[:6]
  other = data[6][1]
  ax1.pie([v for _, v in top] + [other],
          labels=[n for n, _ in top] + ["其他"],
          autopct="%1.1f%%", startangle=90)
  ax1.set_title("支出分类占比")

  # TODO: 柱状图——柱顶标数字
  ax2.bar([n for n, _ in data], [v for _, v in data], color="#4C8BF5")
  ax2.set_title("各类支出")
  ax2.set_ylabel("金额（元）")

  canvas = FigureCanvasTkAgg(fig, master=root)
  canvas.draw()
  canvas.get_tk_widget().pack(fill="both", expand=True)
  root.mainloop()
checklist:
- 用了 FigureCanvasTkAgg 而不是 plt.show()
- 饼图合并了"其他"项，autopct 显示百分比
- 两个图用 add_subplot(121/122) 并排
- 柱状图柱顶标了数字
- 调用了 canvas.draw() 显示图表
- 图表标题和坐标轴标签齐全
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 独立完成"统计页 StatsFrame"模块：一个继承自 ttk.Frame 的类，用 ttk.Notebook 做两个标签页（"分类占比"饼图 + "月度趋势"柱状图）。要求：1) 构造函数里创建 Figure、FigureCanvasTkAgg、两个 Axes，pack 进自身；2) 实现 refresh() 方法，先 self.fig.clear() 再重新 add_subplot 画两张图，处理空数据（显示"暂无数据"），最后 tight_layout() + canvas.draw()；3) 提供 set_data(rows) 方法供外部传入聚合结果；4) 用 platform.system() 设置中文字体（rcParams["font.sans-serif"] 按平台选字体 + axes.unicode_minus=False）。最后写一个 FakeDB 类模拟数据来源，在 Notebook 里跑起来验证两个标签页都能正常显示图表。窗口程序在网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import platform
  import tkinter as tk
  import tkinter.ttk as ttk
  import matplotlib
  matplotlib.use("TkAgg")
  from matplotlib.figure import Figure
  from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
  from matplotlib import rcParams

  # 中文字体设置
  def setup_font():
      sysname = platform.system()
      if sysname == "Windows":
          rcParams["font.sans-serif"] = ["Microsoft YaHei"]
      elif sysname == "Darwin":
          rcParams["font.sans-serif"] = ["PingFang SC", "STHeiti"]
      else:
          rcParams["font.sans-serif"] = ["WenQuanYi Micro Hei", "Noto Sans CJK SC"]
      rcParams["axes.unicode_minus"] = False

  setup_font()

  class StatsFrame(ttk.Frame):
      def __init__(self, master, get_category_data, get_month_data):
          super().__init__(master)
          self.get_category_data = get_category_data
          self.get_month_data = get_month_data
          self.fig = Figure(figsize=(6, 4), dpi=100)
          self.canvas = FigureCanvasTkAgg(self.fig, master=self)
          self.canvas.get_tk_widget().pack(fill="both", expand=True)
          self.refresh()

      def refresh(self):
          # TODO: clear -> add_subplot(121/122) -> 饼图 + 柱状图 -> tight_layout -> draw
          pass

      def set_data(self, cat_rows, month_rows):
          self.cat_rows = cat_rows
          self.month_rows = month_rows
          self.refresh()

  class FakeDB:
      def get_category_data(self):
          return [("餐饮", 1280), ("交通", 340), ("购物", 856), ("居住", 1500)]
      def get_month_data(self):
          return [("2026-08", 1800), ("2026-09", 3976)]

  root = tk.Tk()
  root.title("记账本 · 统计页")
  root.geometry("700x500")
  nb = ttk.Notebook(root)
  stats = StatsFrame(nb, FakeDB().get_category_data, FakeDB().get_month_data)
  nb.add(stats, text="统计图表")
  nb.pack(fill="both", expand=True)
  root.mainloop()
checklist:
- StatsFrame 继承 ttk.Frame，构造函数创建 Figure + FigureCanvasTkAgg + pack
- refresh() 先 fig.clear() 再 add_subplot，画饼图和柱状图
- 空数据时显示"暂无数据"文字（ax.text + axis off）
- 画完调用 canvas.draw() 和 fig.tight_layout()
- setup_font() 用 platform.system() 三平台判断 + axes.unicode_minus=False
- 用 ttk.Notebook 两个标签页分别展示饼图和柱状图
- 运行时图表正常显示，切换标签页不报错
```
