# Chapter 5 Test: Data and Networking

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding the use of QSqlDatabase, which statement is correct?
options:
- After addDatabase you do not need to call open(); Qt opens it automatically
- You must call db.open() to open the connection, otherwise every query silently returns empty
- You must call addDatabase again before every query
- The SQLite driver requires a separate pip install
answer: 1
explain: The connection only becomes active after open(); addDatabase configures it once; the SQLite driver ships with Qt.
```

```quiz
type: choice
q: Regarding binding a QSqlTableModel to a QTableView, which statement is correct?
options:
- After setting the table name the model loads data automatically with no select() required
- After setTable you must call select() to fetch the data from the database
- QSqlTableModel is only for read-only display
- select() may only be called once; calling it twice is an error
answer: 1
explain: setTable only names the table; select() loads the data; TableModel is editable by default; select can be called repeatedly to refresh.
```

```quiz
type: choice
q: Regarding parameterised SQL queries, which statement is correct?
options:
- User input can be spliced into SQL with an f-string because Qt escapes it automatically
- prepare plus addBindValue prevents SQL injection
- Parameterisation only supports integers, not strings
- Parameterisation is so slow it should be avoided
answer: 1
explain: Parameterisation is the standard defence against SQL injection; it supports any type and the performance cost is negligible.
```

```quiz
type: choice
q: Regarding the choice between QSqlQueryModel and QSqlTableModel, which statement is correct?
options:
- QSqlQueryModel supports double-clicking a cell to edit it and writing back to the database
- QSqlTableModel's setTable accepts any JOIN SQL statement
- For GROUP BY aggregate results you should use QSqlQueryModel
- Both can only be used on the main thread and neither can be bound to a QTableView
answer: 2
explain: QueryModel suits arbitrary read-only queries; TableModel is the editable one and setTable only accepts a table name; both can bind to a view.
```

```quiz
type: choice
q: Regarding the asynchronous mechanism of QNetworkAccessManager, which statement is correct?
options:
- You can use requests.get synchronously inside a button slot and Qt moves it to a background thread
- Requests arrive through the finished signal, avoiding any block on the UI thread
- readAll returns a string that needs no decoding
- Declaring the manager as a local variable is safer because it prevents concurrency
answer: 1
explain: Qt network requests return through signals; requests would block the UI; readAll returns QByteArray and needs decoding; the manager must be long-lived.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "contacts manager" with QtSql: a contacts table with columns id (auto-increment), name, phone and email. Requirements: (1) bind a QSqlTableModel to a QTableView so double-clicking a cell lets you edit it directly; (2) the Add button uses insertRow and gives the name column a default of "New contact"; (3) after deleting the selected row, call select to refresh; (4) add a QLineEdit search box that filters by name LIKE '%keyword%' as you type. Hint: use model.setFilter to build the condition — setFilter is already parameterised, but you must handle single-quote escaping yourself, for example model.setFilter(f"name LIKE '%{text.replace("'", "''")}%'"). Note: A window can't open inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (QApplication, QTableView, QWidget, QVBoxLayout,
                                QHBoxLayout, QPushButton, QLineEdit)
  from PySide6.QtSql import QSqlDatabase, QSqlTableModel, QSqlQuery
  from PySide6.QtCore import Qt

  DB_PATH = "contacts.db"

  def init_db():
      db = QSqlDatabase.addDatabase("QSQLITE")
      db.setDatabaseName(DB_PATH)
      if not db.open():
          print("Failed to open:", db.lastError().text())
          return False
      q = QSqlQuery()
      q.exec("CREATE TABLE IF NOT EXISTS contacts ("
             "id INTEGER PRIMARY KEY AUTOINCREMENT,"
             "name TEXT, phone TEXT, email TEXT)")
      return True

  def main():
      app = QApplication(sys.argv)
      if not init_db():
          sys.exit(1)
      window = QWidget()
      window.setWindowTitle("Contacts")
      window.resize(650, 450)

      model = QSqlTableModel()
      model.setTable("contacts")
      model.setEditStrategy(QSqlTableModel.EditStrategy.OnRowChange)
      model.select()
      model.setHeaderData(0, Qt.Orientation.Horizontal, "ID")
      model.setHeaderData(1, Qt.Orientation.Horizontal, "Name")
      model.setHeaderData(2, Qt.Orientation.Horizontal, "Phone")
      model.setHeaderData(3, Qt.Orientation.Horizontal, "Email")

      view = QTableView()
      view.setModel(model)
      view.setSelectionBehavior(QTableView.SelectionBehavior.SelectRows)

      search = QLineEdit()
      search.setPlaceholderText("Search by name...")
      btn_add = QPushButton("Add")
      btn_del = QPushButton("Delete selected")

      def on_add():
          model.insertRow(model.rowCount())
          model.setData(model.index(model.rowCount() - 1, 1), "New contact")
      def on_del():
          idx = view.currentIndex()
          if idx.isValid():
              model.removeRow(idx.row())
              model.select()
      def on_search(text):
          if text.strip():
              safe = text.replace("'", "''")
              model.setFilter(f"name LIKE '%{safe}%'")
          else:
              model.setFilter("")
          model.select()

      btn_add.clicked.connect(on_add)
      btn_del.clicked.connect(on_del)
      search.textChanged.connect(on_search)

      toolbar = QHBoxLayout()
      toolbar.addWidget(search)
      toolbar.addWidget(btn_add)
      toolbar.addWidget(btn_del)
      layout = QVBoxLayout(window)
      layout.addLayout(toolbar)
      layout.addWidget(view)
      window.show()
      app.exec()

  if __name__ == "__main__":
      main()
checklist:
- The database opens correctly and the table is created
- The model calls select() to load the data
- The four headers are set correctly
- Double-clicking a cell allows direct editing that commits automatically
- The Add button uses insertRow and sets a default value
- After deleting the selected row, select refreshes the view
- The search box filters by name with a fuzzy match
- Single quotes are escaped in the search input
- Clearing the search restores the full list
- The window opens and supports full CRUD
```

```quiz
type: local
q: Use QNetworkAccessManager with JSON to build a "exchange-rate lookup" interface: enter a currency code (such as USD), click a button and request a public exchange-rate API. Requirements: (1) parse the returned JSON and fill the rates into a QTableView (the model shows two columns: Currency and Rate); (2) a QLabel shows the "last updated" time and the base currency; (3) while the request is in flight the button is disabled and shows "Loading..."; (4) error handling: on failure show the error in the status area and re-enable the button. Use a free public endpoint such as https://api.exchangerate-api.com/v4/latest/USD. Note: A window can't open inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys, json
  from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                                QPushButton, QLineEdit, QLabel, QTableView,
                                QHeaderView)
  from PySide6.QtCore import Qt, QUrl
  from PySide6.QtNetwork import QNetworkAccessManager, QNetworkRequest
  from PySide6.QtCore import QAbstractTableModel

  class RateModel(QAbstractTableModel):
      HEADERS = ["Currency", "Rate"]
      def __init__(self, data=None):
          super().__init__()
          self._data = data or []
      def rowCount(self, parent=None):
          return len(self._data)
      def columnCount(self, parent=None):
          return len(self.HEADERS)
      def data(self, index, role=Qt.ItemDataRole.DisplayRole):
          if not index.isValid() or role != Qt.ItemDataRole.DisplayRole:
              return None
          return str(self._data[index.row()][index.column()])
      def headerData(self, section, orientation, role=Qt.ItemDataRole.DisplayRole):
          if role == Qt.ItemDataRole.DisplayRole and orientation == Qt.Orientation.Horizontal:
              return self.HEADERS[section]
          return None
      def set_rates(self, rates):
          self.beginResetModel()
          self._data = rates
          self.endResetModel()

  class Demo(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("Exchange rates")
          self.resize(500, 500)
          self.status = QLabel("Enter a base currency code and click lookup")
          self.input = QLineEdit("USD")
          self.btn = QPushButton("Lookup")
          self.info = QLabel("Base: -  Updated: -")
          self.table = QTableView()
          self.model = RateModel()
          self.table.setModel(self.model)
          self.table.horizontalHeader().setSectionResizeMode(
              QHeaderView.ResizeMode.Stretch)

          self.manager = QNetworkAccessManager(self)
          self.btn.clicked.connect(self.fetch)

          bar = QHBoxLayout()
          bar.addWidget(QLabel("Base:"))
          bar.addWidget(self.input)
          bar.addWidget(self.btn)
          layout = QVBoxLayout(self)
          layout.addWidget(self.status)
          layout.addLayout(bar)
          layout.addWidget(self.info)
          layout.addWidget(self.table)

      def fetch(self):
          base = self.input.text().strip().upper()
          if not base:
              self.status.setText("Please enter a currency code")
              return
          self.btn.setEnabled(False)
          self.status.setText("Loading...")
          url = QUrl(f"https://api.exchangerate-api.com/v4/latest/{base}")
          req = QNetworkRequest(url)
          reply = self.manager.get(req)
          reply.finished.connect(lambda: self.on_done(reply, base))

      def on_done(self, reply, base):
          self.btn.setEnabled(True)
          if reply.error() != reply.NetworkError.NoError:
              self.status.setText(f"Error: {reply.errorString()}")
              reply.deleteLater()
              return
          try:
              data = json.loads(bytes(reply.readAll()).decode("utf-8"))
          except (UnicodeDecodeError, json.JSONDecodeError) as e:
              self.status.setText(f"Parse failed: {e}")
              reply.deleteLater()
              return

          rates = data.get("rates", {})
          show = ["CNY", "EUR", "GBP", "JPY", "HKD", "KRW"]
          rows = [[k, str(rates[k])] for k in show if k in rates]
          self.model.set_rates(rows)
          date = data.get("date", "?")
          self.info.setText(f"Base: {base}  Updated: {date}")
          self.status.setText(f"Loaded {len(rows)} rows")
          reply.deleteLater()

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = Demo()
      w.show()
      app.exec()
checklist:
- QNetworkAccessManager is used for an asynchronous request
- The URL is built from the base currency entered by the user
- The button is disabled while loading and "Loading..." is shown
- The JSON "rates" field is parsed
- The model shows two columns: Currency and Rate
- The info label shows the base currency and the update time
- On failure the status area shows the error and the button is re-enabled
- reply.deleteLater() is called at the end of the callback
- The window opens and the lookup works
```

## Part 3 · Mini-Project

```quiz
type: local
q: Build an "offline-first notebook" mini-project: a QTableView on the left displays the local SQLite notes table (id, title, content, updated_at), and a QPlainTextEdit on the right edits the content of the selected note. Requirements: (1) on startup load all notes into a custom model from the database and bind the table; (2) clicking a row loads that note's content into the editor on the right; (3) when the editor loses focus or the Save button is clicked, write back to the database using a parameterised QSqlQuery: UPDATE notes SET content=?, updated_at=? WHERE id=?; (4) a New button at the top inserts an empty note and auto-selects it; (5) a status bar shows "X notes, last modified Y", where Y is the current time formatted; (6) a QTimer autosaves the note currently being edited every 30 seconds. Note: A window can't open inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys, datetime
  from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
                                QHBoxLayout, QPushButton, QTableView, QPlainTextEdit,
                                QStatusBar, QLabel)
  from PySide6.QtCore import Qt, QTimer
  from PySide6.QtSql import QSqlDatabase, QSqlQuery
  from PySide6.QtCore import QAbstractTableModel

  DB_PATH = "notes.db"

  def init_db():
      db = QSqlDatabase.addDatabase("QSQLITE")
      db.setDatabaseName(DB_PATH)
      if not db.open():
          print("Failed to open:", db.lastError().text())
          return False
      q = QSqlQuery()
      q.exec("CREATE TABLE IF NOT EXISTS notes ("
             "id INTEGER PRIMARY KEY AUTOINCREMENT,"
             "title TEXT DEFAULT 'New note',"
             "content TEXT DEFAULT '',"
             "updated_at TEXT DEFAULT '')")
      return True

  class NoteModel(QAbstractTableModel):
      HEADERS = ["ID", "Title", "Updated"]
      def __init__(self, data=None):
          super().__init__()
          self._data = data or []      # each row: [id, title, updated_at]
      def rowCount(self, parent=None):
          return len(self._data)
      def columnCount(self, parent=None):
          return len(self.HEADERS)
      def data(self, index, role=Qt.ItemDataRole.DisplayRole):
          if not index.isValid() or role != Qt.ItemDataRole.DisplayRole:
              return None
          return str(self._data[index.row()][index.column()])
      def headerData(self, section, orientation, role=Qt.ItemDataRole.DisplayRole):
          if role == Qt.ItemDataRole.DisplayRole and orientation == Qt.Orientation.Horizontal:
              return self.HEADERS[section]
          return None
      def load_all(self):
          q = QSqlQuery("SELECT id, title, updated_at FROM notes ORDER BY updated_at DESC")
          rows = []
          while q.next():
              rows.append([int(q.value(0)), q.value(1), q.value(2) or ""])
          self.beginResetModel()
          self._data = rows
          self.endResetModel()
      def note_id(self, row):
          if 0 <= row < len(self._data):
              return self._data[row][0]
          return None

  class MainWindow(QMainWindow):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("Offline notebook")
          self.resize(800, 500)

          self.model = NoteModel()
          self.table = QTableView()
          self.table.setModel(self.model)
          self.table.setSelectionBehavior(QTableView.SelectionBehavior.SelectRows)
          self.table.setSelectionMode(QTableView.SelectionMode.SingleSelection)
          self.table.verticalHeader().setVisible(False)

          self.editor = QPlainTextEdit()
          self.btn_new = QPushButton("New")
          self.btn_save = QPushButton("Save")
          self.status_info = QLabel("")

          central = QWidget()
          toolbar = QHBoxLayout()
          toolbar.addWidget(self.btn_new)
          toolbar.addWidget(self.btn_save)
          toolbar.addStretch()
          left = QVBoxLayout()
          left.addLayout(toolbar)
          left.addWidget(self.table)
          left_w = QWidget()
          left_w.setLayout(left)
          splitter = QHBoxLayout()
          splitter.addWidget(left_w, 1)
          splitter.addWidget(self.editor, 2)
          main = QVBoxLayout()
          main.addLayout(splitter)
          central.setLayout(main)
          self.setCentralWidget(central)
          self.setStatusBar(QStatusBar())

          self._current_row = -1
          self.table.clicked.connect(self.on_select)
          self.btn_new.clicked.connect(self.on_new)
          self.btn_save.clicked.connect(self.save_current)

          # Autosave timer
          self._autosave = QTimer(self)
          self._autosave.timeout.connect(self.save_current)
          self._autosave.start(30000)

          self.model.load_all()
          self._refresh_status()

      def on_select(self, index):
          self._current_row = index.row()
          note_id = self.model.note_id(self._current_row)
          if note_id is None:
              return
          q = QSqlQuery()
          q.prepare("SELECT content FROM notes WHERE id = ?")
          q.addBindValue(note_id)
          if q.exec() and q.next():
              self.editor.setPlainText(q.value(0) or "")

      def on_new(self):
          q = QSqlQuery()
          q.exec("INSERT INTO notes (updated_at) VALUES ('')")
          self.model.load_all()
          self.table.selectRow(0)

      def save_current(self):
          note_id = self.model.note_id(self._current_row)
          if note_id is None:
              return
          content = self.editor.toPlainText()
          now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
          q = QSqlQuery()
          q.prepare("UPDATE notes SET content = ?, updated_at = ? WHERE id = ?")
          q.addBindValue(content)
          q.addBindValue(now)
          q.addBindValue(note_id)
          if q.exec():
              self.model.load_all()
              self._refresh_status()

      def _refresh_status(self):
          cnt = self.model.rowCount()
          self.status_info.setText(f"{cnt} notes")
          self.statusBar().showMessage(f"{cnt} notes | autosaved")

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      if not init_db():
          sys.exit(1)
      w = MainWindow()
      w.show()
      app.exec()
checklist:
- On startup notes are loaded from SQLite into a custom model
- The model is bound to the table and shows ID, Title and Updated
- Clicking a table row loads that note's content into the editor
- Saving uses a parameterised UPDATE statement
- The New button inserts an empty note and auto-selects it
- The status bar shows the total number of notes
- QTimer autosaves every 30 seconds
- The database path is absolute or otherwise clearly specified
- The window opens and supports create, read, update and delete
```
