# Chapter 6 Test: The Qt Ledger with Charts

> This chapter brings the whole of "Python Qt, Step 2" to a close: rewriting the tkinter ledger with Model/View, drawing the charts by hand with QPainter, then packaging and shipping it. This test covers project layering, TransactionModel, ProxyModel filtering and sorting, selected-row deletion, the QPainter-versus-matplotlib trade-off, packaging plugins, and a full review of all five chapters.

## Part 1 · Multiple Choice

```quiz
type: choice
q: When migrating the tkinter ledger to Qt, the most reasonable layering strategy is:
options:
- Because the interface changes completely, the SQLite table-creation statements must also be rewritten using Qt's QtSql
- Reuse the data layer (SQL operations) as it is, rewrite the interface and chart layers, and let the model connect the two
- To gain performance, replace matplotlib charts with QPainter so the program runs noticeably faster
- Write the SQL directly inside the entry button's slot function to avoid creating a data.py
answer: 1
explain: The data layer has no dependency on the UI framework, so the SQL written for tkinter works unchanged in Qt — that is exactly the payoff of layering. Only the interface and chart layers need rewriting, and the model is what translates data into something the view can display. Putting SQL in a slot glues the two layers back together.
```


```quiz
type: choice
q: You use QSortFilterProxyModel for category filtering and override filterAcceptsRow. After the user picks a category from the dropdown, which approach is correct?
options:
- Simply changing the _category member variable is enough; the UI refreshes automatically
- After changing the condition, call invalidateFilter() so the proxy re-filters
- While filtered, proxy row numbers correspond exactly to source row numbers and can be mixed freely
- With sorting enabled, setSortingEnabled(True) is sufficient; the model does not need to supply UserRole
answer: 1
explain: Changing the filter condition requires invalidateFilter() (or invalidate()) before re-filtering; without it the proxy keeps its old result. While filtered, proxy row numbers no longer match the source, which is precisely why mapToSource exists.
```

```quiz
type: choice
q: When deleting multiple rows, selectedRows() from the selection model returns indexes in the proxy's coordinate space. To delete correctly you should:
options:
- Delete using the index's row() directly against the source model because the two are identical
- Call proxy.mapToSource(idx) to convert to a source-model index, then delete from back to front
- Use proxy.mapFromSource(idx) and delete from front to back
- Clear the selection first, then delete, to avoid selection-state interference
answer: 1
explain: selectedRows() yields proxy-space indexes and must be mapped to source; multiple rows must be deleted from back to front, otherwise each deletion shifts the remaining row numbers and you delete the wrong things.
```

```quiz
type: choice
q: When drawing the ledger's category-share pie chart and monthly-trend bar chart by hand with QPainter, which statement about mapping data to graphical elements is correct?
options:
- Qt's drawPie uses degrees directly, so passing 360 draws a full circle
- The pie's angle span must use abs(val) because expense amounts are negative
- Bar height should use v / sum so the tallest bar reaches the top
- QPainter is best stored as self.painter so it can be reused for multiple draws
answer: 1
explain: Qt's angle unit is 1/16 of a degree, so a full circle is 5760 rather than 360. The bar-height scale uses v / max rather than v / sum so the tallest bar reaches the top of the plotting area.
```

```quiz
type: choice
q: To package the Qt ledger into a shippable executable with PyInstaller, the correct command is:
options:
- pyinstaller main.py (identical to a normal script)
- pyinstaller --onefile --windowed --collect-all PySide6 main.py
- pyinstaller --onefile --console --collect-all PySide6 main.py
- pyinstaller --onedir --windowed --exclude-module PySide6 main.py
answer: 1
explain: A Qt build needs --collect-all PySide6 (or --hidden-import entries) so Qt's plugins and DLLs are included; otherwise it fails at runtime with "could not find or load the Qt platform plugin". --windowed hides the console window for an end-user release.
```

## Part 2 · Hands-On

### Question 7

Add "date-range filtering" to the ledger: two `QDateEdit` widgets (start date, end date) and an "Apply" button, showing only records whose date falls within the closed interval. Requirements: (1) the category dropdown filter must keep working, and the two conditions combine with AND; (2) compare the date using `QDateEdit.date().toString("yyyy-MM-dd")` against the date string stored in the record; (3) filtering and sorting must work at the same time; (4) after filtering, selected-row deletion must still be correct (using `mapToSource`).

Note: A window can't open inside a web page — click "Open in VS Code" to run it.

```quiz
type: local
q: Implement a ProxyModel with date-range filtering and the corresponding interface interaction
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
          # Date is column 0, category is column 1
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

  # Complete the main window: two QDateEdit widgets + Apply button +
  # category dropdown + table. The delete button should reuse the
  # mapToSource logic from lesson 28.

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      # Create and show MainWindow here
      # w = MainWindow(); w.show()
      app.exec()
checklist:
- filterAcceptsRow considers both category and date range, combined with AND
- Dates are compared as strings in yyyy-MM-dd order
- Category filtering and date filtering can be active together
- Switching the category dropdown refreshes live (invalidateFilter)
- After filtering, selected deletion uses mapToSource to recover the source row
- Multiple rows are deleted from back to front
- The window opens, filtering works, and deletion works
```

### Question 8

Add a friendly empty-data message to `ChartView` and draw the percentage in the middle of each pie wedge. Requirements: (1) when there is no data at all, the widget centres the message "No data yet — add your first entry"; (2) when there is data, draw the pie as before and put `xx%` (rounded to the nearest integer) at the midpoint of each wedge; (3) the percentage text should be white and bold, positioned along the radial midpoint of the arc.

Note: A window can't open inside a web page — click "Open in VS Code" to run it.

```quiz
type: local
q: Add percentage labels and an empty-data message to the pie chart
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
              # Draw a centred message here (larger, grey)
              painter.setPen(QPen(QColor(120,120,120)))
              painter.setFont(QFont("", 14))
              painter.drawText(self.rect(), Qt.AlignmentFlag.AlignCenter,
                               "No data yet - add your first entry")
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

              # Draw the percentage label here: white, bold, at the radial
              # midpoint of the wedge. Convert 1/16-degree units to degrees
              # with span/2/16 (or the equivalent conversion).
              mid_angle = (start + span/2) / 16.0   # in degrees
              import math
              rad = math.radians(mid_angle)
              tx = cx + int(r*0.6 * math.cos(rad))
              ty = cy - int(r*0.6 * math.sin(rad))
              painter.setPen(QPen(Qt.GlobalColor.white))
              painter.setFont(QFont("", 9, QFont.Weight.Bold))
              pct = round(abs(val)/total*100)
              painter.drawText(tx-12, ty+4, f"{pct}%")

              start += span

          # Legend (simplified)
          ly = 10
          for i,(cat,val) in enumerate(self._by_category.items()):
              painter.setBrush(QBrush(colors[i%len(colors)]))
              painter.drawRect(self.rect().right()-110, ly, 12, 12)
              painter.setPen(QPen())
              painter.drawText(self.rect().right()-92, ly+10,
                               f"{cat} £{abs(val):.0f}")
              ly += 22

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      c = ChartView()
      c.resize(600, 320)
      c.set_data({})              # test the empty-data message
      # c.set_data({"Food":-1200,"Salary":8000,"Travel":-200})  # test percentages
      c.show()
      app.exec()
checklist:
- When empty, the centred message "No data yet - add your first entry" is shown
- The empty-state message is large and grey
- When there is data, the pie chart draws normally
- Percentages are rounded to the nearest integer
- Percentage text is white and bold
- Each percentage sits along the radial midpoint of its wedge (calculated with trigonometry)
- 1/16-degree units are converted to degrees correctly
- The window opens and the pie chart with percentages renders correctly
```

## Part 3 · Mini-Project

### Question 9

Bring the whole ledger together as one runnable project across four files: `data.py` (SQLite table creation, create/delete/query, summaries by category and by month), `models.py` (`TransactionModel` plus `CategoryFilterProxy`), `charts.py` (`ChartView` with pie and bar charts), and `main.py` (main window: entry form, category filter, date sorting, selected deletion and charts). Requirements: (1) the interface layer contains no SQL at all; every database operation lives in data.py; (2) after entry, both the table and the chart refresh together; (3) selected deletion uses `mapToSource` and asks for confirmation; (4) it must be directly packable with PyInstaller, with the database at `data/ledger.db` inside the executable's directory; (5) the chart rescales with the window. When finished, write a short summary of under 100 words explaining the three biggest improvements the Qt version has over the original tkinter version.

Note: A window can't open inside a web page — click "Open in VS Code" to run it.

```quiz
type: project
q: Complete Qt ledger project, split across four files
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
      HEADERS = ["Date", "Category", "Amount", "Note"]

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
              painter.drawText(rect, Qt.AlignmentFlag.AlignCenter, "No data yet")
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
              painter.drawText(rect.right()-92, ly+10, f"{cat} £{abs(val):.0f}")
              ly += 22

      def _draw_bars(self, painter, rect):
          if not self._by_month:
              painter.setPen(QPen(QColor(120,120,120)))
              painter.setFont(QFont("", 13))
              painter.drawText(rect, Qt.AlignmentFlag.AlignCenter, "No data yet")
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
          self.setWindowTitle("Ledger - Qt Edition")
          self.resize(860, 720)
          init_db()

          # Top: category filter + entry form
          self.filter_combo = QComboBox()
          self.filter_combo.addItem("All categories", "")
          self.filter_combo.addItems(["Food", "Transport", "Housing", "Salary"])
          self.filter_combo.currentIndexChanged.connect(self.on_filter)

          self.form_cat = QComboBox()
          self.form_cat.addItems(["Food", "Transport", "Housing", "Salary"])
          self.form_amt = QLineEdit()
          self.form_amt.setPlaceholderText("Amount (negative for expenses)")
          self.form_note = QLineEdit()
          self.form_note.setPlaceholderText("Note")
          self.btn_add = QPushButton("Add")
          self.btn_add.clicked.connect(self.on_add)

          # Table
          self.model = TransactionModel()
          self.proxy = CategoryFilterProxy(self)
          self.proxy.setSourceModel(self.model)
          self.table = QTableView()
          self.table.setModel(self.proxy)
          self.table.setSortingEnabled(True)
          self.proxy.setSortRole(Qt.ItemDataRole.UserRole)
          self.table.setSelectionBehavior(
              QTableView.SelectionBehavior.SelectRows)

          # Delete
          self.btn_del = QPushButton("Delete selected")
          self.btn_del.clicked.connect(self.on_delete)
          QShortcut(Qt.Key.Key_Delete, self, activated=self.on_delete)

          # Chart
          self.chart = ChartView()

          # Assembly
          top = QHBoxLayout()
          top.addWidget(self.filter_combo)
          top.addStretch()

          form = QFormLayout()
          form.addRow("Category", self.form_cat)
          form.addRow("Amount", self.form_amt)
          form.addRow("Note", self.form_note)

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
              QMessageBox.warning(self, "Notice", "Amount must be a number")
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
              QMessageBox.information(self, "Notice", "Select a row to delete first")
              return
          if QMessageBox.question(self, "Confirm", f"Delete the selected {len(rows)} row(s)?") \
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
- data.py contains table creation, CRUD and both summary methods, with no SQL in the interface
- TransactionModel implements the three methods plus multiple roles (UserRole, alignment, colour)
- Insert and delete are wrapped in begin/end pairs
- CategoryFilterProxy overrides filterAcceptsRow and calls invalidateFilter
- The main window uses a QSortFilterProxyModel with sorting enabled
- After entry, both the table and the chart refresh together
- Selected deletion uses mapToSource to recover the source row number
- Multiple rows are deleted from back to front, with a confirmation step
- The database path resolves to data/ledger.db inside the exe directory
- ChartView's pie and bar charts rescale with the window
- Empty data shows a friendly message
- Entry, filtering, sorting, deletion and charts all work
- The project directory is cleanly split across data/models/charts/main
- The summary names the three biggest improvements over the tkinter version
```
