# 第 5 章章测：数据与网络

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 QSqlDatabase 的使用，下列说法正确的是？
options:
- addDatabase 之后不需要 open()，Qt 会自动打开
- 必须调用 db.open() 打开连接，否则所有查询静默返回空
- 每次查询都要重新 addDatabase 一次
- SQLite 驱动需要额外 pip 安装
answer: 1
explain: 连接必须 open() 才生效；addDatabase 配置一次即可；SQLite 驱动随 Qt 自带。
```

```quiz
type: choice
q: 关于 QSqlTableModel 绑定 QTableView，下列说法正确的是？
options:
- 设置表名后 Model 会自动加载数据，无需 select()
- setTable 之后必须调用 select() 才会从数据库拉取数据
- QSqlTableModel 只能用于只读展示
- select() 只能调用一次，调用两次会报错
answer: 1
explain: setTable 只指定表名，select() 才是加载数据；TableModel 默认可编辑；select 可多次调用刷新。
```

```quiz
type: choice
q: 关于 SQL 参数化查询，下列说法正确的是？
options:
- 用户输入可以用 f-string 拼进 SQL，Qt 会自动转义
- prepare + addBindValue 能防止 SQL 注入
- 参数化只支持整数，不支持字符串
- 参数化会让查询变慢很多，应该避免
answer: 1
explain: 参数化是防止 SQL 注入的标准做法，支持任意类型，性能开销可忽略。
```

```quiz
type: choice
q: 关于 QSqlQueryModel 与 QSqlTableModel 的取舍，下列说法正确的是？
options:
- QSqlQueryModel 支持双击单元格直接编辑并自动写库
- QSqlTableModel 的 setTable 可以传任意 JOIN SQL
- 需要展示 GROUP BY 聚合统计结果时应使用 QSqlQueryModel
- 两者都只能在主线程使用，且都不能绑定 QTableView
answer: 2
explain: QueryModel 适合任意只读查询；TableModel 才支持编辑且 setTable 只接受表名；两者都可绑 View。
```

```quiz
type: choice
q: 关于 QNetworkAccessManager 的异步机制，下列说法正确的是？
options:
- 可以在按钮槽里用 requests.get 同步等待，Qt 会自动放后台
- 请求通过 finished 信号回调，避免阻塞 UI 线程
- readAll 返回的是字符串，无需解码
- manager 声明为局部变量更安全，能避免并发
answer: 1
explain: Qt 网络请求异步通过信号回调；requests 会阻塞 UI；readAll 返回 QByteArray 需解码；manager 必须是长生命周期对象。
```

## 第二部分 · 动手题

```quiz
type: local
q: 用 QtSql 做一个"联系人管理"：表 contacts 字段 id(自增)/name/phone/email。要求：① 用 QSqlTableModel 绑到 QTableView，双击单元格可直接编辑；② 添加按钮用 insertRow 并给 name 默认值"新联系人"；③ 删除选中行后 select 刷新；④ 加一个 QLineEdit 搜索框，输入内容时按 name LIKE '%关键词%' 过滤（提示：用 model.setFilter 拼接条件，注意防 SQL 注入——setFilter 已经参数化处理，但要自己处理单引号转义，或用 model.setFilter(f"name LIKE '%{q.escape(text)}%'")）。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
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
          print("打开失败:", db.lastError().text())
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
      window.setWindowTitle("联系人管理")
      window.resize(650, 450)

      model = QSqlTableModel()
      model.setTable("contacts")
      model.setEditStrategy(QSqlTableModel.EditStrategy.OnRowChange)
      model.select()
      model.setHeaderData(0, Qt.Orientation.Horizontal, "编号")
      model.setHeaderData(1, Qt.Orientation.Horizontal, "姓名")
      model.setHeaderData(2, Qt.Orientation.Horizontal, "电话")
      model.setHeaderData(3, Qt.Orientation.Horizontal, "邮箱")

      view = QTableView()
      view.setModel(model)
      view.setSelectionBehavior(QTableView.SelectionBehavior.SelectRows)

      search = QLineEdit()
      search.setPlaceholderText("搜索姓名...")
      btn_add = QPushButton("添加")
      btn_del = QPushButton("删除选中")

      def on_add():
          model.insertRow(model.rowCount())
          model.setData(model.index(model.rowCount() - 1, 1), "新联系人")
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
- 数据库正确打开并建表
- Model 调用 select() 加载数据
- 表头正确设置四列
- 双击单元格可直接编辑并自动提交
- 添加按钮用 insertRow 并给默认值
- 删除选中行后 select 刷新
- 搜索框按 name 模糊过滤
- 搜索时对单引号做了转义
- 清空搜索恢复全部显示
- 程序正常显示并增删改查
```

```quiz
type: local
q: 用 QNetworkAccessManager + JSON 做一个"汇率查询"界面：输入一个货币代码（如 USD），点击按钮请求 https://open.etherscan.io/api 换成免费的汇率 API——用 https://api.exchangerate-api.com/v4/latest/USD 这个公开接口（或 jsonplaceholder 作为替代演示）。要求：① 解析返回的 JSON，把汇率数据填进 QTableView（Model 显示 币种/汇率 两列）；② 用 QLabel 显示"更新时间"和基础货币；③ 请求期间按钮禁用并显示"加载中..."；④ 错误处理：失败时在状态栏显示错误并恢复按钮。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys, json
  from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                                QPushButton, QLineEdit, QLabel, QTableView,
                                QHeaderView)
  from PySide6.QtCore import Qt, QUrl
  from PySide6.QtNetwork import QNetworkAccessManager, QNetworkRequest
  from PySide6.QtCore import QAbstractTableModel

  class RateModel(QAbstractTableModel):
      HEADERS = ["币种", "汇率"]
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
          self.setWindowTitle("汇率查询")
          self.resize(500, 500)
          self.status = QLabel("输入基础货币代码后点击查询")
          self.input = QLineEdit("USD")
          self.btn = QPushButton("查询")
          self.info = QLabel("基础货币: -  更新时间: -")
          self.table = QTableView()
          self.model = RateModel()
          self.table.setModel(self.model)
          self.table.horizontalHeader().setSectionResizeMode(
              QHeaderView.ResizeMode.Stretch)

          self.manager = QNetworkAccessManager(self)
          self.btn.clicked.connect(self.fetch)

          bar = QHBoxLayout()
          bar.addWidget(QLabel("基础货币:"))
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
              self.status.setText("请输入货币代码")
              return
          self.btn.setEnabled(False)
          self.status.setText("加载中...")
          url = QUrl(f"https://api.exchangerate-api.com/v4/latest/{base}")
          req = QNetworkRequest(url)
          reply = self.manager.get(req)
          reply.finished.connect(lambda: self.on_done(reply, base))

      def on_done(self, reply, base):
          self.btn.setEnabled(True)
          if reply.error() != reply.NetworkError.NoError:
              self.status.setText(f"错误: {reply.errorString()}")
              reply.deleteLater()
              return
          try:
              data = json.loads(bytes(reply.readAll()).decode("utf-8"))
          except (UnicodeDecodeError, json.JSONDecodeError) as e:
              self.status.setText(f"解析失败: {e}")
              reply.deleteLater()
              return

          rates = data.get("rates", {})
          # 只显示部分币种，避免太长
          show = ["CNY", "EUR", "GBP", "JPY", "HKD", "KRW"]
          rows = [[k, str(rates[k])] for k in show if k in rates]
          self.model.set_rates(rows)
          date = data.get("date", "?")
          self.info.setText(f"基础货币: {base}  更新时间: {date}")
          self.status.setText(f"加载完成，共 {len(rows)} 条")
          reply.deleteLater()

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = Demo()
      w.show()
      app.exec()
checklist:
- 使用 QNetworkAccessManager 异步请求
- 用输入的基础货币拼 URL
- 请求期间按钮禁用并显示加载中
- 解析 JSON 的 rates 字段
- Model 显示币种/汇率两列
- info 标签显示基础货币和更新时间
- 失败时状态栏显示错误并恢复按钮
- 回调末尾调用 reply.deleteLater()
- 程序正常显示并查询
```

## 第三部分 · 小项目

```quiz
type: local
q: 做一个"离线优先的记事本"小项目：左侧 QTableView 显示本地 SQLite 的 notes 表（id/title/content/updated_at），右侧 QPlainTextEdit 编辑选中笔记的内容。要求：① 启动时从数据库加载所有笔记到自定义 Model 并绑定表格；② 点击表格某行，右侧编辑区加载该笔记内容；③ 右侧内容修改后，离开焦点或点击"保存"按钮时写回数据库（用 QSqlQuery 参数化 UPDATE notes SET content=?, updated_at=? WHERE id=?）；④ 顶部有"新建"按钮，点击新增一条空笔记并自动选中；⑤ 加一个状态栏显示"共 X 条笔记，最后修改 Y"，Y 是当前时间格式化；⑥ 用 QTimer 每 30 秒自动保存一次当前正在编辑的笔记（防丢）。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
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
          print("打开失败:", db.lastError().text())
          return False
      q = QSqlQuery()
      q.exec("CREATE TABLE IF NOT EXISTS notes ("
             "id INTEGER PRIMARY KEY AUTOINCREMENT,"
             "title TEXT DEFAULT '新笔记',"
             "content TEXT DEFAULT '',"
             "updated_at TEXT DEFAULT '')")
      return True

  class NoteModel(QAbstractTableModel):
      HEADERS = ["编号", "标题", "更新时间"]
      def __init__(self, data=None):
          super().__init__()
          self._data = data or []      # 每行 [id, title, updated_at]
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
          self.setWindowTitle("离线记事本")
          self.resize(800, 500)

          self.model = NoteModel()
          self.table = QTableView()
          self.table.setModel(self.model)
          self.table.setSelectionBehavior(QTableView.SelectionBehavior.SelectRows)
          self.table.setSelectionMode(QTableView.SelectionMode.SingleSelection)
          self.table.verticalHeader().setVisible(False)

          self.editor = QPlainTextEdit()
          self.btn_new = QPushButton("新建")
          self.btn_save = QPushButton("保存")
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

          # 自动保存定时器
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
          # 选中新插入的第一行
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
              # 如果第一行是标题预览，这里可同步更新；简化处理
              self.model.load_all()
              self._refresh_status()

      def _refresh_status(self):
          cnt = self.model.rowCount()
          self.status_info.setText(f"共 {cnt} 条笔记")
          self.statusBar().showMessage(f"共 {cnt} 条笔记 | 已自动保存")

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      if not init_db():
          sys.exit(1)
      w = MainWindow()
      w.show()
      app.exec()
checklist:
- 启动时从 SQLite 加载笔记到自定义 Model
- 表格绑定 Model 并显示编号/标题/更新时间
- 点击表格行加载对应笔记内容到编辑器
- 保存用参数化 UPDATE 写库
- 新建按钮插入空笔记并自动选中
- 状态栏显示笔记总数
- 用 QTimer 每 30 秒自动保存
- 数据库路径用绝对路径或明确的工作目录
- 程序正常显示并支持增改查
```
