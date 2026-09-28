# 第 6 章章测：带图表的记账本 Qt 版

> 这一章我们把整个《Python Qt 进阶 2》收了尾：用 Model/View 把 tkinter 记账本重写一遍，用 QPainter 自绘图表，最后打包发布。这份章测覆盖项目分层、TransactionModel、ProxyModel 过滤排序、选中删除、自绘图表与 matplotlib 的取舍、打包插件，以及全书五章的回顾。

## 第一部分 · 选择题

```quiz
type: choice
q: 把 tkinter 记账本迁移到 Qt 时，最合理的分层策略是：
options:
- 因为界面全换了，SQLite 建表语句也要用 Qt 的 QtSql 重写一遍
- 数据层（SQL 操作）原样复用，界面层和图表层重写，Model 负责把两边接起来
- 为了追求性能，把 matplotlib 图表换成 QPainter，运行速度会明显提升
- 录入按钮的槽函数里直接写 SQL，省得再写一个 data.py
answer: 1
explain: 数据层跟界面框架无关——SQLite 那套 SQL 在 tkinter 版能用，在 Qt 版照样能用，这正是分层的收益。要重写的只有界面层（tkinter 控件换成 Qt）和图表层，而 Model 正好承担"把数据层的数据翻译成 View 能显示的样子"这一职责。在槽函数里直接写 SQL 就是把两层又粘回去了。
```
```quiz
type: choice
q: 关于 `TransactionModel` 的 `data()` 方法，下列说法正确的是：
options:
- 对于不处理的角色应该 `return ""`，这样 View 会显示空白
- 插入一行时用 `beginInsertRows(QModelIndex(), row, row+1)`，因为要插两行
- 整体刷新数据集应该用 `beginResetModel()` 修改数据 `endResetModel()` 包裹
- 金额列的对齐和颜色应该在 View 里用循环遍历所有单元格来设置
answer: 2
explain: 整体刷新要用 beginResetModel()/endResetModel() 包起来，View 才会重新去取数据。不处理的角色应该返回 None（不是空串），否则某些角色会被错误地当成有值。插入一行是 beginInsertRows(parent, row, row)——区间是闭区间，插一行首尾相同。
```
```quiz
type: choice
q: 使用 `QSortFilterProxyModel` 做分类过滤，自定义了 `filterAcceptsRow`。用户在下拉框改了分类之后，下列做法正确的是：
options:
- 直接改 `_category` 成员变量即可，界面会自动刷新
- 改完条件后调用 `invalidateFilter()` 通知 Proxy 重新过滤
- 过滤状态下 Proxy 的行号和源 Model 完全对应，可以直接混用
- 同时启用排序时 `setSortingEnabled(True)` 就够了，Model 不用提供 UserRole
answer: 1
explain: 改了过滤条件必须调 invalidateFilter()（或 invalidate()）才会重新过滤，改成员变量界面是不知道的。过滤状态下 Proxy 的行号和源 Model 不再一一对应，混用必然删错行——这就是 mapToSource 存在的原因。
```
```quiz
type: choice
q: 多选删除时，从 `selectionModel().selectedRows()` 拿到的是 Proxy 视角的索引。为了正确删除，应该：
options:
- 直接用索引的 `row()` 去源 Model 删，因为两者一致
- 用 `proxy.mapToSource(idx)` 转成源 Model 索引再删，且从后往前删
- 用 `proxy.mapFromSource(idx)` 转换，且从前往后删
- 先 `clearSelection()` 再删，避免选中状态干扰
answer: 1
explain: selectedRows() 给的是 Proxy 索引，必须 mapToSource 转成源索引；而且多个行要从后往前删，否则前面删掉一行会让后面的行号整体前移，越删越错。
```
```quiz
type: choice
q: 用 QPainter 自绘记账本的分类占比饼图和月度趋势柱状图，关于数据到图形元素的映射，下列说法正确的是：
options:
- Qt 的 `drawPie` 角度单位就是度，传 360 就能画整圆
- 饼图角度跨度要用 `abs(val)` 计算，因为支出金额是负数
- 柱状图高度比例应该用 `v / sum` 来保证最高的柱子顶到顶部
- QPainter 最好存成 `self.painter` 成员变量，方便多次绘制
answer: 0
explain: Qt 的角度单位是 1/16 度，所以整圆是 5760 而不是 360——这是从 Qt4 沿袭下来的约定，也是最常见的自绘 bug 来源。柱高比例用 v / max 而不是 v / sum 才能让最高的柱子顶到顶部。
```
```quiz
type: choice
q: 用 PyInstaller 把 Qt 记账本打包成可发布的 exe，正确的命令是：
options:
- `pyinstaller main.py`（和普通脚本完全一样）
- `pyinstaller --onefile --windowed --collect-all PySide6 main.py`
- `pyinstaller --onefile --console --collect-all PySide6 main.py`
- `pyinstaller --onedir --windowed --exclude-module PySide6 main.py`
answer: 1
explain: 打包 Qt 程序必须 --collect-all PySide6（或用 --hidden-import 逐个补），否则 Qt 的插件和 DLL 不会被打进去，运行时会报 "could not find or load the Qt platform plugin"。--windowed 是不弹控制台窗口，发布给终端用户该用它。
```## 第二部分 · 动手题

### 第 7 题

给记账本增加"按日期区间过滤"：加两个 `QDateEdit`（开始日期、结束日期）和一个"应用"按钮，只显示日期落在闭区间内的记录。要求：① 分类下拉框的过滤仍然生效，两个条件是"且"的关系；② 日期用 `QDateEdit.date().toString("yyyy-MM-dd")` 与记录里的日期字符串比较；③ 筛选与排序同时可用；④ 筛选后选中删除仍然正确（`mapToSource`）。

注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。

```quiz
type: local
q: 实现按日期区间过滤的 ProxyModel 与界面交互
starter: |
  import sys
  from PySide6.QtCore import QSortFilterProxyModel, Qt, QModelIndex
  from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                                QComboBox, QDateEdit, QPushButton, QTableView,
                                QLabel)
  from PySide6.QtGui import QBrush, QColor

  class DateRangeFilterProxy(QSortFilterProxyModel):
      def __init__(self, parent=None):
          super().__init__(parent)
          self._category = ""
          self._start = ""
          self._end = ""

      def set_category(self, cat):
          self._category = cat
          self.invalidateFilter()

      def set_range(self, start, end):
          self._start = start or ""
          self._end = end or ""
          self.invalidateFilter()

      def filterAcceptsRow(self, source_row, source_parent):
          model = self.sourceModel()
          # 日期在第 0 列，分类在第 1 列
          idx_date = model.index(source_row, 0, source_parent)
          date_val = str(model.data(idx_date) or "")
          if self._start and date_val < self._start:
              return False
          if self._end and date_val > self._end:
              return False
          if self._category:
              idx_cat = model.index(source_row, 1, source_parent)
              if model.data(idx_cat) != self._category:
                  return False
          return True

  # 请补全主窗口：两个 QDateEdit + 应用按钮 + 分类下拉框 + 表格
  # 提示：QDateEdit 的 dateChanged 信号可以实时过滤，按钮点击也可以
  # 删除按钮请复用第 28 课的 mapToSource 逻辑

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      # 这里请创建 MainWindow 并 show
      # w = MainWindow(); w.show()
      app.exec()
checklist:
- filterAcceptsRow 同时考虑分类和日期区间，取"且"
- 日期用字符串字典序比较（格式 yyyy-MM-dd）
- 分类过滤与日期过滤可以同时生效
- 分类下拉框切换时实时刷新（invalidateFilter）
- 筛选后选中删除用 mapToSource 转回源行号
- 多行删除从后往前
- 程序正常显示、筛选、删除
```

### 第 8 题

给 `ChartView` 增加"空数据"的友好提示，并让饼图的每个扇区中间显示百分比文字。要求：① 没有任何数据时整个控件居中显示"暂无数据，快去录入第一笔吧"；② 有数据时按原逻辑画饼图，并在每个扇区中间画上 `xx%`（百分比取整）；③ 百分比文字用白色、加粗，位置在扇区弧线的中点方向。

注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。

```quiz
type: local
q: 给饼图加百分比标注和空数据提示
starter: |
  import sys
  from PySide6.QtWidgets import QWidget
  from PySide6.QtCore import Qt
  from PySide6.QtGui import QPainter, QColor, QFont, QPen, QBrush

  class ChartView(QWidget):
      def __init__(self, parent=None):
          super().__init__(parent)
          self._by_category = {}
          self.setMinimumHeight(260)

      def set_data(self, by_category, by_month):
          self._by_category = by_category
          self.update()

      def paintEvent(self, event):
          painter = QPainter(self)
          painter.setRenderHint(QPainter.RenderHint.Antialiasing)

          if not self._by_category:
              # 在这里画居中提示文字（大一点、灰色）
              painter.setPen(QPen(QColor(120,120,120)))
              painter.setFont(QFont("", 14))
              painter.drawText(self.rect(), Qt.AlignmentFlag.AlignCenter,
                               "暂无数据，快去录入第一笔吧")
              return

          total = sum(self._by_category.values())
          colors = [QColor(66,133,244), QColor(52,168,83), QColor(251,188,4),
                    QColor(234,67,53), QColor(154,76,175)]
          cx, cy = self.rect().center().x(), self.rect().center().y()
          r = min(self.rect().width()-120, self.rect().height())//2 - 20
          start = 0

          for i,(cat,val) in enumerate(self._by_category.items()):
              span = int(360*16*abs(val)/total)
              color = colors[i % len(colors)]
              painter.setBrush(QBrush(color))
              painter.setPen(Qt.PenStyle.NoPen)
              painter.drawPie(cx-r, cy-r, r*2, r*2, start, span)

              # 在这里画百分比文字：弧线中点方向，白色加粗
              # 提示：中点角度 = start + span/2，用三角函数算坐标
              mid_angle = (start + span/2) / 16.0   # 转成度
              import math
              rad = math.radians(mid_angle)
              tx = cx + int(r*0.6 * math.cos(rad))
              ty = cy - int(r*0.6 * math.sin(rad))
              painter.setPen(QPen(Qt.GlobalColor.white))
              painter.setFont(QFont("", 9, QFont.Weight.Bold))
              pct = round(abs(val)/total*100)
              painter.drawText(tx-12, ty+4, f"{pct}%")

              start += span

          # 图例（简化）
          ly = 10
          for i,(cat,val) in enumerate(self._by_category.items()):
              painter.setBrush(QBrush(colors[i%len(colors)]))
              painter.drawRect(self.rect().right()-110, ly, 12, 12)
              painter.setPen(QPen())
              painter.drawText(self.rect().right()-92, ly+10,
                               f"{cat} {abs(val):.0f}元")
              ly += 22

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      c = ChartView()
      c.resize(600, 320)
      c.set_data({})              # 测试空数据提示
      # c.set_data({"餐饮":-1200,"工资":8000,"交通":-200})  # 测试百分比
      c.show()
      app.exec()
checklist:
- 空数据时居中显示"暂无数据，快去录入第一笔吧"
- 空数据提示文字较大且为灰色
- 有数据时正常画饼图
- 百分比用 round 取整
- 百分比文字白色加粗
- 百分比位置在扇区弧线中点方向（用三角函数计算）
- 角度从 1/16 度转成度时用 span/2/16 或对应换算
- 程序正常显示饼图和百分比
```

## 第三部分 · 小项目

### 第 9 题

把整个记账本项目串起来，做一个完整可运行的版本：`data.py`（SQLite 建表、增删查、按分类/月份汇总）、`models.py`（`TransactionModel` + `CategoryFilterProxy`）、`charts.py`（`ChartView` 饼图 + 柱状图）、`main.py`（主窗口：录入表单、分类过滤、日期排序、选中删除、图表）。要求：① 界面层不写任何 SQL，所有数据库操作都在 data.py；② 录入后表格和图表同时刷新；③ 选中删除用 `mapToSource` 并二次确认；④ 用 PyInstaller 能直接打包（数据库路径用 exe 所在目录下的 `data/ledger.db`）；⑤ 图表随窗口缩放。完成后写一段 100 字以内的总结，说明 Qt 版相比你原来 tkinter 版最大的三个改进。

注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。

```quiz
type: local
q: 完整的 Qt 记账本项目（分四个文件）
starter: |
  # ============ data.py ============
  import os, sys, sqlite3

  def app_dir():
      if getattr(sys, "frozen", False):
          return os.path.dirname(sys.executable)
      return os.path.dirname(os.path.abspath(__file__))

  DB_PATH = os.path.join(app_dir(), "data", "ledger.db")

  def connect():
      os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
      return sqlite3.connect(DB_PATH)

  def init_db():
      with connect() as conn:
          conn.execute("""
              CREATE TABLE IF NOT EXISTS transactions (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date TEXT NOT NULL,
                  category TEXT NOT NULL,
                  amount REAL NOT NULL,
                  note TEXT
              )
              """)

  def add(date, category, amount, note=""):
      with connect() as conn:
          conn.execute(
              "INSERT INTO transactions(date,category,amount,note) VALUES (?,?,?,?)",
              (date, category, amount, note))

  def delete(tid):
      with connect() as conn:
          conn.execute("DELETE FROM transactions WHERE id = ?", (tid,))

  def all_records():
      with connect() as conn:
          conn.row_factory = sqlite3.Row
          return conn.execute(
              "SELECT * FROM transactions ORDER BY date DESC").fetchall()

  def summary_by_category():
      with connect() as conn:
          rows = conn.execute(
              "SELECT category, SUM(amount) AS total FROM transactions GROUP BY category"
          ).fetchall()
          return {r["category"]: r["total"] for r in rows}

  def summary_by_month():
      with connect() as conn:
          rows = conn.execute(
              "SELECT substr(date,1,7) AS m, SUM(amount) AS total FROM transactions GROUP BY m"
          ).fetchall()
          return {r["m"]: r["total"] for r in rows}

  # ============ models.py ============
  from PySide6.QtCore import Qt, QAbstractTableModel, QModelIndex, QSortFilterProxyModel
  from data import all_records, add as db_add, delete as db_delete

  class TransactionModel(QAbstractTableModel):
      HEADERS = ["日期", "分类", "金额", "备注"]

      def __init__(self, parent=None):
          super().__init__(parent)
          self._records = []
          self.refresh()

      def rowCount(self, parent=QModelIndex()):
          return len(self._records)
      def columnCount(self, parent=QModelIndex()):
          return len(self.HEADERS)

      def data(self, index, role=Qt.ItemDataRole.DisplayRole):
          if not index.isValid():
              return None
          r = self._records[index.row()]
          c = index.column()
          if role == Qt.ItemDataRole.DisplayRole:
              if c == 0: return str(r["date"])
              if c == 1: return str(r["category"])
              if c == 2: return f"{r['amount']:.2f}"
              if c == 3: return str(r["note"] or "")
          if role == Qt.ItemDataRole.UserRole and c == 2:
              return r["amount"]
          if role == Qt.ItemDataRole.TextAlignmentRole and c == 2:
              return Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter
          if role == Qt.ItemDataRole.ForegroundRole and c == 2:
              if r["amount"] < 0:
                  return QBrush(QColor(200, 0, 0))
          return None

      def headerData(self, s, o, role=Qt.ItemDataRole.DisplayRole):
          if role == Qt.ItemDataRole.DisplayRole and o == Qt.Orientation.Horizontal:
              return self.HEADERS[s]
          return None

      def flags(self, index):
          return Qt.ItemFlag.ItemIsSelectable | Qt.ItemFlag.ItemIsEnabled

      def refresh(self):
          self.beginResetModel()
          self._records = list(all_records())
          self.endResetModel()

      def total_by_category(self):
          d = {}
          for r in self._records:
              d[r["category"]] = d.get(r["category"], 0.0) + r["amount"]
          return d

      def total_by_month(self):
          d = {}
          for r in self._records:
              d[r["date"][:7]] = d.get(r["date"][:7], 0.0) + r["amount"]
          return d

      def add_record(self, date, category, amount, note=""):
          db_add(date, category, amount, note)
          self.refresh()

      def remove_row(self, row):
          if 0 <= row < len(self._records):
              tid = self._records[row]["id"]
              self.beginRemoveRows(QModelIndex(), row, row)
              db_delete(tid)
              del self._records[row]
              self.endRemoveRows()

  class CategoryFilterProxy(QSortFilterProxyModel):
      def __init__(self, parent=None):
          super().__init__(parent)
          self._category = ""

      def set_category(self, cat):
          self._category = cat
          self.invalidateFilter()

      def filterAcceptsRow(self, source_row, source_parent):
          if not self._category:
              return True
          model = self.sourceModel()
          idx = model.index(source_row, 1, source_parent)
          return model.data(idx) == self._category

  # ============ charts.py ============
  from PySide6.QtWidgets import QWidget
  from PySide6.QtCore import Qt
  from PySide6.QtGui import QPainter, QColor, QFont, QPen, QBrush

  class ChartView(QWidget):
      def __init__(self, parent=None):
          super().__init__(parent)
          self._by_category = {}
          self._by_month = {}
          self.setMinimumHeight(260)

      def set_data(self, by_category, by_month):
          self._by_category = by_category
          self._by_month = by_month
          self.update()

      def paintEvent(self, event):
          painter = QPainter(self)
          painter.setRenderHint(QPainter.RenderHint.Antialiasing)
          rect = self.rect()
          left_w = rect.width() // 2
          self._draw_pie(painter, rect.adjusted(0, 0, -left_w, 0))
          self._draw_bars(painter, rect.adjusted(left_w, 0, 0, 0))

      def _draw_pie(self, painter, rect):
          if not self._by_category:
              painter.setPen(QPen(QColor(120,120,120)))
              painter.setFont(QFont("", 13))
              painter.drawText(rect, Qt.AlignmentFlag.AlignCenter, "暂无数据")
              return
          total = sum(abs(v) for v in self._by_category.values())
          colors = [QColor(66,133,244), QColor(52,168,83), QColor(251,188,4),
                    QColor(234,67,53), QColor(154,76,175), QColor(0,172,193)]
          import math
          cx, cy = rect.center().x(), rect.center().y()
          r = min(rect.width()-120, rect.height())//2 - 10
          start = 0
          ly = 10
          for i,(cat,val) in enumerate(self._by_category.items()):
              span = int(360*16*abs(val)/total)
              painter.setBrush(QBrush(colors[i%len(colors)]))
              painter.setPen(Qt.PenStyle.NoPen)
              painter.drawPie(cx-r, cy-r, r*2, r*2, start, span)
              mid = (start + span/2) / 16.0
              rad = math.radians(mid)
              tx = int(cx + r*0.62*math.cos(rad))
              ty = int(cy - r*0.62*math.sin(rad))
              painter.setPen(QPen(Qt.GlobalColor.white))
              painter.setFont(QFont("", 9, QFont.Weight.Bold))
              painter.drawText(tx-10, ty+4, f"{round(abs(val)/total*100)}%")
              start += span
              painter.setBrush(QBrush(colors[i%len(colors)]))
              painter.drawRect(rect.right()-110, ly, 12, 12)
              painter.setPen(QPen())
              painter.drawText(rect.right()-92, ly+10, f"{cat} {abs(val):.0f}元")
              ly += 22

      def _draw_bars(self, painter, rect):
          if not self._by_month:
              painter.setPen(QPen(QColor(120,120,120)))
              painter.setFont(QFont("", 13))
              painter.drawText(rect, Qt.AlignmentFlag.AlignCenter, "暂无数据")
              return
          months = sorted(self._by_month.keys())
          values = [abs(self._by_month[m]) for m in months]
          max_val = max(values) or 1
          margin = 30
          top, bottom = rect.top()+margin, rect.bottom()-margin
          left, right = rect.left()+margin, rect.right()-margin
          ph = bottom - top
          slot = (right-left)/len(months)
          bar_w = min(40, slot*0.6)
          painter.setPen(QPen(Qt.GlobalColor.gray))
          painter.drawLine(left, bottom, right, bottom)
          for i,(m,v) in enumerate(zip(months, values)):
              h = int(ph * v / max_val)
              bx = int(left + slot*i + (slot-bar_w)/2)
              painter.setBrush(QBrush(QColor(66,133,244)))
              painter.setPen(Qt.PenStyle.NoPen)
              painter.drawRect(bx, bottom-h, int(bar_w), h)
              painter.setPen(QPen())
              painter.drawText(bx, bottom+16, m[-2:])
              painter.drawText(bx, bottom-h-4, f"{v:.0f}")

  # ============ main.py ============
  import sys
  from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                                QComboBox, QLineEdit, QPushButton, QTableView,
                                QFormLayout, QMessageBox, QShortcut)
  from PySide6.QtCore import Qt
  from data import init_db
  from models import TransactionModel, CategoryFilterProxy
  from charts import ChartView

  class MainWindow(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("记账本 Qt 版")
          self.resize(860, 720)
          init_db()

          # 顶部：分类过滤 + 录入表单
          self.filter_combo = QComboBox()
          self.filter_combo.addItem("全部分类", "")
          self.filter_combo.addItems(["餐饮", "交通", "居住", "工资"])
          self.filter_combo.currentIndexChanged.connect(self.on_filter)

          self.form_cat = QComboBox()
          self.form_cat.addItems(["餐饮", "交通", "居住", "工资"])
          self.form_amt = QLineEdit()
          self.form_amt.setPlaceholderText("金额（负数表示支出）")
          self.form_note = QLineEdit()
          self.form_note.setPlaceholderText("备注")
          self.btn_add = QPushButton("录入")
          self.btn_add.clicked.connect(self.on_add)

          # 表格
          self.model = TransactionModel()
          self.proxy = CategoryFilterProxy(self)
          self.proxy.setSourceModel(self.model)
          self.table = QTableView()
          self.table.setModel(self.proxy)
          self.table.setSortingEnabled(True)
          self.proxy.setSortRole(Qt.ItemDataRole.UserRole)
          self.table.setSelectionBehavior(
              QTableView.SelectionBehavior.SelectRows)

          # 删除
          self.btn_del = QPushButton("删除选中")
          self.btn_del.clicked.connect(self.on_delete)
          QShortcut(Qt.Key.Key_Delete, self, activated=self.on_delete)

          # 图表
          self.chart = ChartView()

          # 装配
          top = QHBoxLayout()
          top.addWidget(self.filter_combo)
          top.addStretch()

          form = QFormLayout()
          form.addRow("分类", self.form_cat)
          form.addRow("金额", self.form_amt)
          form.addRow("备注", self.form_note)

          bottom = QHBoxLayout()
          bottom.addLayout(form)
          bottom.addWidget(self.btn_add)
          bottom.addWidget(self.btn_del)

          layout = QVBoxLayout(self)
          layout.addLayout(top)
          layout.addLayout(bottom)
          layout.addWidget(self.table, 1)
          layout.addWidget(self.chart)

      def on_filter(self):
          self.proxy.set_category(self.filter_combo.currentData() or "")

      def on_add(self):
          cat = self.form_cat.currentText()
          note = self.form_note.text()
          try:
              amt = float(self.form_amt.text())
          except ValueError:
              QMessageBox.warning(self, "提示", "金额必须是个数字")
              return
          date = __import__("datetime").date.today().isoformat()
          self.model.add_record(date, cat, amt, note)
          self.form_amt.clear()
          self.form_note.clear()
          self._refresh()

      def on_delete(self):
          sel = self.table.selectionModel()
          rows = sel.selectedRows()
          if not rows:
              QMessageBox.information(self, "提示", "请先选中要删除的行")
              return
          if QMessageBox.question(self, "确认", f"确定删除选中的 {len(rows)} 行？") \
                  != QMessageBox.StandardButton.Yes:
              return
          source_rows = [self.proxy.mapToSource(idx).row() for idx in rows]
          for r in sorted(source_rows, reverse=True):
              self.model.remove_row(r)
          sel.clearSelection()
          self._refresh()

      def _refresh(self):
          self.model.refresh()
          self.chart.set_data(
              self.model.total_by_category(),
              self.model.total_by_month())

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = MainWindow()
      w.show()
      app.exec()
checklist:
- data.py 包含建表、增删查、两类汇总，界面层无 SQL
- TransactionModel 实现三方法 + 多角色（UserRole/对齐/颜色）
- 增删均用 begin/end 对包裹
- CategoryFilterProxy 重写 filterAcceptsRow 并 invalidateFilter
- 主窗口用 QSortFilterProxyModel 接表格，支持排序
- 录入后表格和图表同时刷新
- 选中删除用 mapToSource 转回源行号
- 多行删除从后往前，并二次确认
- 数据库路径用 exe 目录下的 data/ledger.db
- ChartView 饼图+柱状图随窗口缩放
- 空数据有友好提示
- 能正常录入、筛选、排序、删除、显示图表
- 项目目录结构清晰（data/models/charts/main 四文件）
- 总结写明了 Qt 版相对 tkinter 版的三大改进
```
