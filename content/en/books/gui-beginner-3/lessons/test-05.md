# Chapter 5 · Charts and Statistics · Big Test

> 8 questions. This chapter is about turning the numbers in your ledger into something readable — from SQL aggregation to embedding matplotlib in tkinter, then fonts and auto-refresh.
> **You must get every question right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: To group records stored as YYYY-MM-DD by month and sum them, which approach is correct?
options:
- Filter with WHERE date contains "-09"
- Take substr(date, 1, 7) as the grouping key and GROUP BY it
- GROUP BY date
- Convert the date to a timestamp and divide by 86400
answer: 1
explain: The first 7 characters of YYYY-MM-DD are exactly YYYY-MM, so substr(date,1,7) extracts the month. GROUP BY date would group by each individual day, which is too fine-grained, and WHERE can only filter, not group.
```

```quiz
type: choice
q: When an aggregate function like SUM() has no matching rows, what does it return? Which of these is safest?
options:
- total = cur.fetchone()[0], then add 100 to it directly
- total = cur.fetchone()[0] or 0, then do arithmetic
- if total is None: total = None, and keep it as is
- An aggregate function always returns 0, so no handling is needed
answer: 1
explain: With no matching rows, an aggregate returns None rather than 0. None cannot take part in arithmetic and raises TypeError. Using "or 0" as a fallback is the cleanest safe idiom.
```

```quiz
type: choice
q: Why must you avoid plt.show() when embedding a matplotlib chart in a tkinter program?
options:
- Because plt.show() cannot draw bar charts
- Because plt.show() opens a separate window and blocks tkinter's main loop, freezing the main window
- Because plt.show() can only draw pie charts
- Because plt.show() needs to download fonts over the internet
answer: 1
explain: plt.show() starts matplotlib's own GUI main loop, which blocks tkinter's main loop. The main window becomes unresponsive and its buttons stop working. Inside tkinter you must use FigureCanvasTkAgg to render into a tkinter widget.
```

```quiz
type: choice
q: Regarding the timing of matplotlib.use("TkAgg"), which statement is correct?
options:
- It can be called anywhere in the program and the backend can be switched at any time
- It must be called before importing pyplot, and only once
- It can only be called after mainloop
- use("TkAgg") must be called again before every redraw
answer: 1
explain: matplotlib.use() must be set before importing pyplot, because the backend is initialised as soon as pyplot is first imported; setting it afterwards is too late, and it may only be called once. This project uses the Figure API rather than pyplot, so it can be omitted, but including it is safer.
```

```quiz
type: choice
q: When a pie chart has far too many categories (say, 20), what is the most sensible approach?
options:
- Draw every category anyway and accept slightly crowded labels
- Show only the top few by amount and merge the rest into a single "Other" slice
- Switch to a line chart
- Shrink the pie until the labels disappear
answer: 1
explain: Too many pie slices turn into an illegible tangle with overlapping labels. Showing the top few and merging the rest keeps things clear while still showing the overall structure (aim for seven slices or fewer). A line chart is not suitable for showing category share.
```

---

## Part 2 · Hands-On Questions

```quiz
type: local
q: Implement two aggregation functions, summarize_by_category(conn, rtype) and summarize_by_month(conn, rtype), to total expenses by category and by month. Requirements: GROUP BY plus SUM, pass rtype through a ? placeholder, use substr(date,1,7) for the month, and format the results to two decimal places. Then verify the output with fake data (at least 6 records, covering 3 categories and 2 months). sqlite3 runs locally, and windows cannot open in a web page — click 'Open in VS Code' to run it.
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
          ('expense','Food',1280.50,'2026-08-15'),
          ('expense','Transport',340.00,'2026-08-20'),
          ('expense','Shopping',856.00,'2026-08-25'),
          ('expense','Food',620.00,'2026-09-03'),
          ('expense','Housing',1500.00,'2026-09-01'),
          ('expense','Transport',120.00,'2026-09-10'),
          ('income','Salary',8000.00,'2026-08-01');
  """)

  def summarize_by_category(conn, rtype="expense"):
      cur = conn.cursor()
      cur.execute("""
          SELECT category, SUM(amount) AS total
          FROM records
          WHERE type = ?
          GROUP BY category
          ORDER BY total DESC
      """, (rtype,))
      return cur.fetchall()

  def summarize_by_month(conn, rtype="expense"):
      cur = conn.cursor()
      cur.execute("""
          SELECT substr(date,1,7) AS month, SUM(amount) AS total
          FROM records
          WHERE type = ?
          GROUP BY month
          ORDER BY month
      """, (rtype,))
      return cur.fetchall()

  print("By category:")
  for cat, total in summarize_by_category(conn):
      print(f"  {cat:6s} {total:>10.2f}")
  print("By month:")
  for month, total in summarize_by_month(conn):
      print(f"  {month}  {total:>10.2f}")
  conn.close()
checklist:
- Both functions use GROUP BY
- The rtype parameter is passed using a ? placeholder
- Monthly grouping uses substr(date,1,7)
- Results are formatted to two decimal places
- Category and monthly totals print correctly
```

```quiz
type: local
q: Use FigureCanvasTkAgg to embed a pie chart (category share) and a bar chart (monthly trend) side by side in a tkinter window. Requirements: the pie chart shows the top 6 plus an "Other" slice, the bar chart has a number above each bar, and both charts use add_subplot(121/122) side by side. A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  import tkinter as tk
  import matplotlib
  matplotlib.use("TkAgg")
  from matplotlib.figure import Figure
  from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

  root = tk.Tk()
  root.title("Charts")
  root.geometry("900x450")

  fig = Figure(figsize=(9, 4), dpi=100)
  ax1 = fig.add_subplot(121)
  ax2 = fig.add_subplot(122)

  # fake data
  data = [("Food", 1280), ("Transport", 340), ("Shopping", 856),
          ("Housing", 1500), ("Entertainment", 420), ("Medical", 200), ("Other", 180)]

  # TODO: pie - top 6 plus "Other" merged, autopct for percentages
  top = data[:6]
  other = data[6][1]
  ax1.pie([v for _, v in top] + [other],
          labels=[n for n, _ in top] + ["Other"],
          autopct="%1.1f%%", startangle=90)
  ax1.set_title("Spending by category")

  # TODO: bar - number above each bar
  ax2.bar([n for n, _ in data], [v for _, v in data], color="#4C8BF5")
  ax2.set_title("Spending by category")
  ax2.set_ylabel("Amount (£)")

  canvas = FigureCanvasTkAgg(fig, master=root)
  canvas.draw()
  canvas.get_tk_widget().pack(fill="both", expand=True)
  root.mainloop()
checklist:
- Uses FigureCanvasTkAgg rather than plt.show()
- The pie chart merges into "Other" and autopct shows percentages
- Both charts sit side by side using add_subplot(121/122)
- The bar chart shows a number above each bar
- canvas.draw() is called to display the charts
- Titles and axis labels are complete
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Independently build the "statistics page" module StatsFrame: a class inheriting from ttk.Frame, using ttk.Notebook for two tabs ("Category share" pie chart and "Monthly trend" bar chart). Requirements: 1) the constructor creates the Figure, FigureCanvasTkAgg, and two Axes, then packs itself; 2) implement refresh(), which clears self.fig, re-adds the two subplots, draws both charts, handles empty data (showing "No data yet"), and finally calls tight_layout() and canvas.draw(); 3) provide a set_data(rows) method for external code to pass in the aggregation results; 4) use platform.system() to configure the Chinese font (rcParams["font.sans-serif"] picks a font per platform, plus axes.unicode_minus=False). Finally, write a FakeDB class to simulate the data source and run it in a Notebook to confirm both tabs render correctly. A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  import platform
  import tkinter as tk
  import tkinter.ttk as ttk
  import matplotlib
  matplotlib.use("TkAgg")
  from matplotlib.figure import Figure
  from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
  from matplotlib import rcParams

  # Chinese font setup
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
          # TODO: clear, add_subplot(121/122), pie + bar, tight_layout, draw
          pass

      def set_data(self, cat_rows, month_rows):
          self.cat_rows = cat_rows
          self.month_rows = month_rows
          self.refresh()

  class FakeDB:
      def get_category_data(self):
          return [("Food", 1280), ("Transport", 340), ("Shopping", 856), ("Housing", 1500)]
      def get_month_data(self):
          return [("2026-08", 1800), ("2026-09", 3976)]

  root = tk.Tk()
  root.title("Ledger - statistics page")
  root.geometry("700x500")
  nb = ttk.Notebook(root)
  stats = StatsFrame(nb, FakeDB().get_category_data, FakeDB().get_month_data)
  nb.add(stats, text="Charts")
  nb.pack(fill="both", expand=True)
  root.mainloop()
checklist:
- StatsFrame inherits from ttk.Frame, and its constructor creates Figure + FigureCanvasTkAgg and packs them
- refresh() clears fig before add_subplot, then draws the pie and bar charts
- Empty data shows a "No data yet" message (ax.text plus axis off)
- After drawing, canvas.draw() and fig.tight_layout() are called
- setup_font() uses platform.system() for all three platforms and sets axes.unicode_minus=False
- ttk.Notebook provides two tabs showing the pie and bar charts
- The charts render correctly when running, and switching tabs raises no errors
```
