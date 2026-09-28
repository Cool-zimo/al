# Chapter 1 Test: Model/View Architecture

## Multiple Choice

```quiz
type: choice
q: In the Model/View architecture, which class is responsible for owning the data and exposing it through a row/column/role interface?
options:
- QTableView
- QAbstractItemModel
- QStyledItemDelegate
- QItemSelectionModel
answer: 1
explain: The model (a subclass of QAbstractItemModel) owns the data and exposes it via row/column/role. The view only displays, the delegate handles rendering and editing of individual cells, and the selection model tracks what is selected.
```

```quiz
type: choice
q: Which method must a custom table model override to tell the view how many rows it has?
options:
- columnCount
- rowCount
- data
- index
answer: 1
explain: rowCount returns the number of rows; columnCount returns the number of columns. data returns the value at a given index and role, while index locates an item by row and column.
```

```quiz
type: choice
q: When the internal list of a custom model changes, what must you do so the view refreshes correctly?
options:
- Call self.update() on the view
- Wrap the modification with beginInsertRows/endInsertRows (or the matching remove pair)
- Reassign the model with setModel again
- Call self.repaint() on the model
answer: 1
explain: Structural changes must be announced with begin/end pairs so the view can adjust its row count, scrollbar, and selection. Simply modifying the internal list without notifying is the classic "the view never refreshes" bug.
```

```quiz
type: choice
q: What is the correct order of operations when inserting a row into a custom model?
options:
- Modify the data, then call beginInsertRows, then call endInsertRows
- Call beginInsertRows, modify the data, then call endInsertRows
- Call endInsertRows, modify the data, then call beginInsertRows
- Modify the data and call endInsertRows only
answer: 1
explain: The begin/end pair is a transaction: announce the impending structural change, perform the modification, then close the transaction. Reversing the order or omitting either half causes incorrect updates or assertion failures.
```

```quiz
type: choice
q: Which signal or notification should you emit when a single cell's value changes, as opposed to a structural change?
options:
- rowsInserted
- layoutChanged
- dataChanged
- rowsRemoved
answer: 2
explain: dataChanged is the lightest notification and repaints only the affected region. rowsInserted/rowsRemoved describe structural changes, while layoutChanged is the heaviest and forces a full repaint.
```

## Hands-On

```quiz
type: local
q: Implement a minimal read-only table model backed by a list of lists. Override rowCount, columnCount, data, and headerData so a QTableView can display the data. Add two buttons: one appends a hard-coded row and one removes the currently selected row, wrapping both operations in the correct begin/end notification pairs. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QPushButton, QVBoxLayout, QHBoxLayout
  )

  class SimpleTableModel(QAbstractTableModel):
      def __init__(self, rows=None):
          super().__init__()
          self._rows = rows or [["Alice", 20], ["Bob", 25]]

      def rowCount(self, parent=Qt.QModelIndex()):
          # Complete here
          return 0

      def columnCount(self, parent=Qt.QModelIndex()):
          # Complete here
          return 0

      def data(self, index, role=Qt.DisplayRole):
          # Complete here
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          # Complete here
          return None

      def add_row(self):
          # Complete here: wrap the insertion with beginInsertRows/endInsertRows
          pass

      def remove_row(self, row):
          # Complete here: wrap the removal with beginRemoveRows/endRemoveRows
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Minimal Table Model")

  model = SimpleTableModel()
  view = QTableView()
  view.setModel(model)
  view.setSelectionBehavior(QTableView.SelectRows)

  def on_add():
      model.add_row()

  def on_remove():
      idx = view.currentIndex()
      if idx.isValid():
          model.remove_row(idx.row())

  add_btn = QPushButton("Add Row")
  add_btn.clicked.connect(on_add)
  remove_btn = QPushButton("Delete Selected")
  remove_btn.clicked.connect(on_remove)

  h = QHBoxLayout()
  h.addWidget(add_btn)
  h.addWidget(remove_btn)

  layout = QVBoxLayout(win)
  layout.addWidget(view)
  layout.addLayout(h)
  win.resize(400, 300)
  win.show()
  app.exec()
checklist:
- rowCount and columnCount return correct values
- data returns the right value for DisplayRole and None for invalid indexes
- headerData returns column headers for the horizontal orientation
- add_row wraps the insertion with beginInsertRows/endInsertRows
- remove_row wraps the removal with beginRemoveRows/endRemoveRows
- After either operation the table refreshes immediately
- The program displays and runs normally
```

```quiz
type: local
q: Extend the model above with a setData implementation so the score column is editable. When the user edits a cell, store the new integer value and emit dataChanged with the correct arguments. Also implement flags to mark the score column as editable. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex, QModelIndex as M
  from PySide6.QtWidgets import QApplication, QWidget, QTableView, QVBoxLayout

  class EditableTableModel(QAbstractTableModel):
      def __init__(self, rows=None):
          super().__init__()
          self._rows = rows or [["Alice", 92], ["Bob", 85], ["Carol", 78]]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 2

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          if role in (Qt.DisplayRole, Qt.EditRole):
              return self._rows[index.row()][index.column()]
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["Name", "Score"][section]
          return None

      def flags(self, index):
          f = super().flags(index)
          # Complete here: mark column 1 as editable
          return f

      def setData(self, index, value, role=Qt.EditRole):
          # Complete here: validate, store the integer, emit dataChanged, return True/False
          return False

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Editable Model")

  model = EditableTableModel()
  view = QTableView()
  view.setModel(model)
  view.resizeColumnsToContents()

  layout = QVBoxLayout(win)
  layout.addWidget(view)
  win.resize(400, 300)
  win.show()
  app.exec()
checklist:
- flags marks column 1 as editable while column 0 stays read-only
- setData validates that the value can be converted to int
- The new value is stored in the internal list
- dataChanged is emitted with the correct index range and roles
- setData returns True on success and False on failure
- Editing a cell in the UI updates the model and refreshes the view
- The program displays and runs normally
```

## Mini Project

```quiz
type: local
q: Build a small "todo list" application using Model/View. Create a custom model backed by a list of [task, status] pairs, a QTableView view, and buttons for Add, Delete, and Toggle Status. Editing the task name or status through the view should update the model, and structural changes must use the correct begin/end notifications. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QPushButton, QLineEdit,
      QLabel, QVBoxLayout, QHBoxLayout
  )

  class TodoModel(QAbstractTableModel):
      def __init__(self, rows=None):
          super().__init__()
          self._rows = rows or [["Write tests", "Pending"], ["Ship feature", "In Progress"]]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 2

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          if role in (Qt.DisplayRole, Qt.EditRole):
              return self._rows[index.row()][index.column()]
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["Task", "Status"][section]
          return None

      def flags(self, index):
          f = super().flags(index)
          # Complete here: make both columns editable
          return f

      def setData(self, index, value, role=Qt.EditRole):
          # Complete here
          return False

      def add_row(self, task="New task", status="Pending"):
          # Complete here
          pass

      def remove_row(self, row):
          # Complete here
          pass

      def toggle_status(self, row):
          # Complete here: toggle Pending <-> Done and emit dataChanged
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Todo List")

  model = TodoModel()
  view = QTableView()
  view.setModel(model)
  view.setSelectionBehavior(QTableView.SelectRows)

  input_field = QLineEdit()
  input_field.setPlaceholderText("New task name...")

  def on_add():
      text = input_field.text().strip() or "New task"
      model.add_row(text, "Pending")
      input_field.clear()

  def on_remove():
      idx = view.currentIndex()
      if idx.isValid():
          model.remove_row(idx.row())

  def on_toggle():
      idx = view.currentIndex()
      if idx.isValid():
          model.toggle_status(idx.row())

  add_btn = QPushButton("Add")
  add_btn.clicked.connect(on_add)
  remove_btn = QPushButton("Delete")
  remove_btn.clicked.connect(on_remove)
  toggle_btn = QPushButton("Toggle Status")
  toggle_btn.clicked.connect(on_toggle)

  h = QHBoxLayout()
  h.addWidget(input_field)
  h.addWidget(add_btn)
  h.addWidget(remove_btn)
  h.addWidget(toggle_btn)

  layout = QVBoxLayout(win)
  layout.addWidget(view)
  layout.addLayout(h)
  win.resize(500, 320)
  win.show()
  app.exec()
checklist:
- The custom model stores [task, status] pairs and exposes them through data()
- Both columns are editable and edits update the model
- add_row wraps its modification in beginInsertRows/endInsertRows
- remove_row wraps its modification in beginRemoveRows/endRemoveRows
- toggle_status updates the status and emits dataChanged
- The UI refreshes correctly after every operation
- The program displays and runs normally
```
