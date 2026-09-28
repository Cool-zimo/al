# Chapter 2 Test: Advanced Model/View

## Multiple Choice

```quiz
type: choice
q: Which pair of methods must you override to fully customise both sorting and filtering in a QSortFilterProxyModel subclass?
options:
- paint and createEditor
- lessThan and filterAcceptsRow
- data and setData
- mapToSource and mapFromSource
answer: 1
explain: lessThan controls how two rows are compared during sorting, while filterAcceptsRow decides whether each row passes the filter. paint and createEditor belong to delegates; data/setData belong to the model; mapToSource/mapFromSource are coordinate-conversion helpers.
```

```quiz
type: choice
q: In a delegate's edit flow, what is the role of setModelData?
options:
- Create the editor widget and configure it
- Pour the model's current value into the editor
- Write the editor's value back into the model when editing finishes
- Draw the cell in its non-editing state
answer: 2
explain: createEditor builds the editor, setEditorData fills it from the model, setModelData writes the edited value back into the model, and paint draws the cell at rest. Forgetting setModelData is the classic bug where "the value snaps back after editing".
```

```quiz
type: choice
q: When is it mandatory to call invalidateFilter()?
options:
- Every time the view is resized
- After changing a property that affects which rows pass filterAcceptsRow
- Before calling setSourceModel
- Whenever the source model's data changes
answer: 1
explain: invalidateFilter tells the proxy to re-run filterAcceptsRow. Without it, a changed threshold or keyword will not be reflected in the display even though the property was updated.
```

```quiz
type: choice
q: In a delegate's paint method, what is the purpose of the save() and restore() calls around custom drawing?
options:
- They improve rendering performance
- They prevent the painter's pen, brush, and font state from leaking into neighbouring cells
- They make the cell editable
- They automatically call dataChanged
answer: 1
explain: The view reuses one QPainter across all cells. If you change its pen colour, font, or transform without restoring them, the next cell inherits the contaminated state. save/restore guarantees each cell starts from a clean baseline.
```

```quiz
type: choice
q: What does QItemSelectionModel.selectionChanged signal report?
options:
- Only the single index that the cursor moved to
- The set of indexes that entered the selection and the set that left it
- The current proxy index converted to source coordinates
- The result of the most recent sort operation
answer: 1
explain: selectionChanged receives two QItemSelection objects describing what was newly selected and what was deselected. currentChanged reports the cursor position and may fire without the selection changing.
```

## Hands-On

```quiz
type: local
q: Write a proxy that combines a custom filter with a custom sort: only rows whose numeric score (column 1) is at least a configurable threshold should appear, and among those, rows should be sorted by status priority (Pending < In Progress < Done). Expose a set_min_score setter that calls invalidateFilter. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex, QSortFilterProxyModel
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QSpinBox, QLabel, QVBoxLayout, QHBoxLayout
  )

  class TaskModel(QAbstractTableModel):
      def __init__(self):
          super().__init__()
          self._rows = [
              ["Write docs", "Pending", 40],
              ["Fix bugs", "In Progress", 90],
              ["Deploy", "Done", 75],
              ["Review PR", "Pending", 55],
          ]

      def rowCount(self, p=QModelIndex()):
          return len(self._rows)

      def columnCount(self, p=QModelIndex()):
          return 3

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              return f"{value} pts" if index.column() == 2 else str(value)
          if role == Qt.UserRole and index.column() == 2:
              return value
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["Task", "Status", "Score"][section]
          return None

  class ScoreStatusProxy(QSortFilterProxyModel):
      _ORDER = {"Pending": 0, "In Progress": 1, "Done": 2}

      def __init__(self, parent=None):
          super().__init__(parent)
          self._min_score = 0

      def set_min_score(self, value):
          # Complete here: store the value and call invalidateFilter
          pass

      def filterAcceptsRow(self, source_row, source_parent):
          # Complete here: keep only rows whose score meets the threshold
          return True

      def lessThan(self, left, right):
          # Complete here: compare by status priority using the status column
          return False

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Score + Status Proxy")

  source = TaskModel()
  proxy = ScoreStatusProxy()
  proxy.setSourceModel(source)

  spin = QSpinBox()
  spin.setRange(0, 100)
  spin.valueChanged.connect(proxy.set_min_score)

  view = QTableView()
  view.setModel(proxy)
  view.setSortingEnabled(True)

  h = QHBoxLayout()
  h.addWidget(QLabel("Minimum score:"))
  h.addWidget(spin)
  layout = QVBoxLayout(win)
  layout.addLayout(h)
  layout.addWidget(view)
  win.resize(500, 300)
  win.show()
  app.exec()
checklist:
- filterAcceptsRow keeps only rows meeting the configurable threshold
- set_min_score stores the value and calls invalidateFilter
- lessThan sorts by status priority using a dictionary lookup
- Sorting can be triggered by clicking a header
- The display updates correctly as the threshold changes
- The program displays and runs normally
```

```quiz
type: local
q: Write a delegate that renders column 2 of a score table as a coloured progress bar (green for >=80, orange for >=60, red otherwise) and also supports editing that column through a QSpinBox. Implement paint, createEditor, setEditorData, and setModelData. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QSpinBox, QStyledItemDelegate
  )

  class ScoreModel(QAbstractTableModel):
      def __init__(self):
          super().__init__()
          self._rows = [["Alice", 92], ["Bob", 45], ["Carol", 78], ["Dan", 15]]

      def rowCount(self, p=QModelIndex()):
          return len(self._rows)

      def columnCount(self, p=QModelIndex()):
          return 2

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              return f"{value}%" if index.column() == 1 else str(value)
          if role == Qt.UserRole and index.column() == 1:
              return value
          return None

      def setData(self, index, value, role=Qt.EditRole):
          if not index.isValid() or role != Qt.EditRole:
              return False
          self._rows[index.row()][index.column()] = int(value)
          self.dataChanged.emit(index, index, [role])
          return True

      def flags(self, index):
          f = super().flags(index)
          if index.column() == 1:
              return f | Qt.ItemIsEditable
          return f

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["Name", "Score"][section]
          return None

  class BarDelegate(QStyledItemDelegate):
      def paint(self, painter, option, index):
          # Complete here: call super().paint(), then draw a coloured bar with centered text
          pass

      def createEditor(self, parent, option, index):
          # Complete here: return a QSpinBox 0..100 with a % suffix
          pass

      def setEditorData(self, editor, index):
          # Complete here: read EditRole and fill the editor
          pass

      def setModelData(self, editor, model, index):
          # Complete here: write the editor value back via setData
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Progress Bar + Spin Delegate")

  model = ScoreModel()
  view = QTableView()
  view.setModel(model)
  view.setItemDelegateForColumn(1, BarDelegate())
  view.show()
  app.exec()
checklist:
- paint calls super().paint() first, then draws a bar whose colour matches the score band
- The three score bands map to three colours (green / orange / red)
- createEditor returns a 0..100 QSpinBox whose parent is the given parent
- setEditorData reads EditRole and fills the spinbox
- setModelData writes the value back through model.setData
- Double-clicking the score column opens the editor and updates the display
- The program displays and runs normally
```

## Mini Project

```quiz
type: local
q: Build a small "project dashboard" by combining a custom model, a sorting/filtering proxy, a delegate, and a selection-driven detail panel. The table has columns Task, Status, and Hours. Filter by a minimum-hours threshold, sort by status priority, render the Hours column as a progress bar capped at 40 hours, and show the selected row's details in a label beside the table. Use mapToSource when reading data from the selection. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex, QSortFilterProxyModel
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QLabel, QSpinBox, QHBoxLayout,
      QVBoxLayout, QStyledItemDelegate
  )

  class ProjectModel(QAbstractTableModel):
      def __init__(self):
          super().__init__()
          self._rows = [
              ["Design", "Done", 12],
              ["Frontend", "In Progress", 34],
              ["Backend", "Pending", 8],
              ["QA", "In Progress", 22],
              ["Deploy", "Pending", 4],
          ]

      def rowCount(self, p=QModelIndex()):
          return len(self._rows)

      def columnCount(self, p=QModelIndex()):
          return 3

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              return str(value)
          if role == Qt.UserRole and index.column() == 2:
              return value
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["Task", "Status", "Hours"][section]
          return None

  class DashboardProxy(QSortFilterProxyModel):
      _ORDER = {"Pending": 0, "In Progress": 1, "Done": 2}

      def __init__(self, parent=None):
          super().__init__(parent)
          self._min_hours = 0

      def set_min_hours(self, value):
          self._min_hours = value
          self.invalidateFilter()

      def filterAcceptsRow(self, source_row, source_parent):
          # Complete here
          return True

      def lessThan(self, left, right):
          # Complete here
          return False

  class HoursDelegate(QStyledItemDelegate):
      def paint(self, painter, option, index):
          # Complete here: draw a bar for hours, capped at 40, with centered text
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Project Dashboard")

  source = ProjectModel()
  proxy = DashboardProxy()
  proxy.setSourceModel(source)

  spin = QSpinBox()
  spin.setRange(0, 40)
  spin.valueChanged.connect(proxy.set_min_hours)

  view = QTableView()
  view.setModel(proxy)
  view.setSortingEnabled(True)
  view.setSelectionBehavior(QTableView.SelectRows)
  view.setItemDelegateForColumn(2, HoursDelegate())

  detail = QLabel("Select a row to see details")
  detail.setWordWrap(True)

  def on_selection_changed(selected, deselected):
      # Complete here: use mapToSource to read the real data and build detail text
      pass

  view.selectionModel().selectionChanged.connect(on_selection_changed)

  controls = QHBoxLayout()
  controls.addWidget(QLabel("Minimum hours:"))
  controls.addWidget(spin)

  left = QVBoxLayout()
  left.addLayout(controls)
  left.addWidget(view)

  layout = QHBoxLayout(win)
  layout.addLayout(left, 2)
  layout.addWidget(detail, 1)
  win.resize(700, 320)
  win.show()
  app.exec()
checklist:
- The proxy filters by a configurable minimum-hours threshold
- Sorting by status priority works via lessThan
- The Hours column renders as a progress bar capped at 40 hours
- The detail panel uses mapToSource to read real source data
- Selecting a row updates the detail label with that row's values
- The program displays and runs normally
```
