# 第 1 章 · Model/View 架构 · 大测验

> 8 道题。这一章解决的是"数据归数据、显示归显示"的问题：model 管数据、view 管显示，两者靠 index 和 role 通信。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: QTableWidget 与 QAbstractTableModel 的核心区别是什么？
options:
- QTableWidget 把数据存在 QTableWidgetItem 里，数据与显示耦合；Model/View 中数据由 model 管理，view 只负责显示
- QTableWidget 不能显示一万行数据，QAbstractTableModel 可以
- QTableWidget 是 Model/View 架构的一部分，两者没有本质区别
- QAbstractTableModel 比 QTableWidget 性能差，适合小数据量
answer: 0
explain: QTableWidget 的数据散落在各个 item 对象中，数据与显示耦合，改数据需手动同步界面；Model/View 中 model 管理数据，view 通过协议取数，两者解耦。B 错在两者都能显示大量数据，只是方式不同；C、D 错在混淆了两者的设计定位。
```

```quiz
type: choice
q: 关于 QModelIndex，以下说法正确的是？
options:
- QModelIndex 是 model 内部数据的直接引用，持有它就能修改数据
- QModelIndex 是一个轻量坐标凭证，包含行、列、父节点信息，由 view 用来向 model 提问
- 表格 model 可以忽略 QModelIndex 的 parent 参数，因为它永远指向根节点，没有任何实际作用
- 自定义 model 必须给每个 index 绑定一个 QWidget，否则 view 无法绘制
answer: 1
explain: QModelIndex 是临时的坐标凭证，记录行、列、父节点和一个指向 model 的指针。A 错在 index 不是数据引用；C 错在表格里 parent 通常无效，但树形结构必须用它定位父节点；D 错在 model 不认识 widget。
```

```quiz
type: choice
q: 自定义表格 model 必须实现哪三个方法？
options:
- __init__、rowCount、columnCount
- rowCount、columnCount、data
- data、headerData、flags
- rowCount、setData、clear
answer: 1
explain: QAbstractTableModel 子类必须实现 rowCount（几行）、columnCount（几列）、data（这个格子显示什么）三个方法。headerData 强烈建议实现但非必须；flags 和 setData 是可编辑时才需要。
```

```quiz
type: choice
q: data() 方法如果只处理了 Qt.EditRole 而没有处理 Qt.DisplayRole，会出现什么现象？
options:
- 程序会抛出 TypeError 异常
- 界面能正常显示数据，但无法编辑
- 界面每个单元格都是空的，但不会有任何报错
- view 会自动用 EditRole 的值作为显示内容
answer: 2
explain: QTableView 默认用 DisplayRole 取显示内容。如果 data() 没处理 DisplayRole 返回 None，格子就是空的且不报错。B 说反了——不能编辑是因为没设 flags。
```

```
纯逻辑片段：演示 begin/end 的顺序
class Demo:
    def insert(self, pos, item):
        self.begin()
        self._list.insert(pos, item)
        self.end()
    def begin(self): print("begin")
    def end(self): print("end")
d = Demo()
d._list = [1, 2, 3]
d.insert(1, 99)
print(d._list)
```

```quiz
type: choice
q: 关于 beginInsertRows 和 endInsertRows，以下说法正确的是？
options:
- 只调用 beginInsertRows 也可以，Qt 会自动调用 endInsertRows
- 必须先调用 beginInsertRows，再修改内部数据，最后调用 endInsertRows，顺序不可颠倒
- beginInsertRows 和 endInsertRows 之间应该调用 dataChanged 通知单元格刷新
- endInsertRows 必须在数据修改之前调用，否则 view 会显示错误的数据
answer: 1
explain: begin/end 是事务协议，顺序必须是 begin → 改数据 → end。A 错在 end 必须显式调用；C 错在 begin/end 之间不应发 dataChanged；D 说反了顺序。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个自定义 model：继承 QAbstractTableModel，内部用二维列表存"商品信息"（名称、价格、库存）。实现 rowCount/columnCount/data/headerData 四个方法。价格列 DisplayRole 显示为"¥XX,XXX"，EditRole 返回原始数值。加一个方法 add_product(name, price, stock)，用 beginInsertRows/endInsertRows 正确通知 view。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtWidgets import QApplication, QTableView

  class ProductModel(QAbstractTableModel):
      def __init__(self, rows=None):
          super().__init__()
          self._rows = rows or [["苹果", 580, 100], ["牛奶", 1290, 50]]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 3

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              if index.column() == 1:
                  return f"¥{int(value):,}"
              return str(value)
          if role == Qt.EditRole and index.column() == 1:
              return value
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["名称", "价格", "库存"][section]
          return None

      def add_product(self, name, price, stock):
          # 在这里补全：beginInsertRows/endInsertRows 包住插入
          pass

  app = QApplication(sys.argv)
  model = ProductModel()
  view = QTableView()
  view.setModel(model)
  view.show()

  model.add_product("面包", 850, 30)
  print("添加后行数：", model.rowCount())
  app.exec()
checklist:
- 四个方法都正确实现
- data() 第一行有 isValid 校验
- 价格列 DisplayRole 显示带 ¥ 和千分位
- add_product 用 beginInsertRows/endInsertRows 包住插入
- 添加后表格立即刷新
- 程序正常显示并运行
```

```quiz
type: local
q: 改进上面的 ProductModel，让它支持删除指定行：实现 remove_product(row)，用 beginRemoveRows/endRemoveRows 包住。再加一个方法 batch_add(products)，一次插入多行（从后往前插），只包一对 begin/end。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtWidgets import QApplication, QTableView

  class ProductModel(QAbstractTableModel):
      def __init__(self, rows=None):
          super().__init__()
          self._rows = rows or [["苹果", 580, 100], ["牛奶", 1290, 50], ["面包", 850, 30]]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 3

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              if index.column() == 1:
                  return f"¥{int(value):,}"
              return str(value)
          if role == Qt.EditRole and index.column() == 1:
              return value
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["名称", "价格", "库存"][section]
          return None

      def remove_product(self, row):
          # 在这里补全：beginRemoveRows/endRemoveRows
          pass

      def batch_add(self, products):
          # 在这里补全：一次 begin/end 插入多行（从后往前）
          pass

  app = QApplication(sys.argv)
  model = ProductModel()
  view = QTableView()
  view.setModel(model)
  view.show()

  model.remove_product(0)
  model.batch_add([["饼干", 650, 80], ["酸奶", 450, 120]])
  print("最终行数：", model.rowCount())
  app.exec()
checklist:
- remove_product 用 beginRemoveRows/endInsertRows 正确删除
- batch_add 从后往前插入，只包一对 begin/end
- 操作后表格行数和显示都正确
- 无 begin/end 失配导致的断言错误
- 程序正常显示并运行
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"简易记账本"：用自定义 model（继承 QAbstractTableModel）存账目（日期、类别、金额、备注），金额列 DisplayRole 显示"¥XX.XX"，EditRole 返回 float。实现 add_record 和 remove_record，都用正确的 begin/end 通知。界面用 QTableView + 一个"添加"按钮（弹 QInputDialog 输入）+ 一个"删除选中"按钮。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QPushButton, QVBoxLayout,
      QHBoxLayout, QInputDialog
  )

  class LedgerModel(QAbstractTableModel):
      def __init__(self, rows=None):
          super().__init__()
          self._rows = rows or [
              ["2024-01-15", "餐饮", 45.50, "午餐"],
              ["2024-01-16", "交通", 6.00, "地铁"],
          ]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 4

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              if index.column() == 2:
                  return f"¥{float(value):.2f}"
              return str(value)
          if role == Qt.EditRole and index.column() == 2:
              return float(value)
          return None

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["日期", "类别", "金额", "备注"][section]
          return None

      def add_record(self, record):
          # 在这里补全
          pass

      def remove_record(self, row):
          # 在这里补全
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("简易记账本")

  model = LedgerModel()
  view = QTableView()
  view.setModel(model)
  view.setSelectionBehavior(QTableView.SelectRows)

  def on_add():
      # 用 QInputDialog 分别获取日期、类别、金额、备注
      date, ok1 = QInputDialog.getText(win, "日期", "输入日期（如 2024-01-20）：")
      if not ok1:
          return
      category, ok2 = QInputDialog.getText(win, "类别", "输入类别：")
      if not ok2:
          return
      amount_str, ok3 = QInputDialog.getText(win, "金额", "输入金额：")
      if not ok3:
          return
      try:
          amount = float(amount_str)
      except ValueError:
          return
      note, ok4 = QInputDialog.getText(win, "备注", "输入备注：")
      if not ok4:
          return
      model.add_record([date, category, amount, note])

  def on_remove():
      idx = view.currentIndex()
      if idx.isValid():
          model.remove_record(idx.row())

  add_btn = QPushButton("添加记录")
  add_btn.clicked.connect(on_add)
  remove_btn = QPushButton("删除选中")
  remove_btn.clicked.connect(on_remove)

  h = QHBoxLayout()
  h.addWidget(add_btn)
  h.addWidget(remove_btn)

  layout = QVBoxLayout(win)
  layout.addWidget(view)
  layout.addLayout(h)
  win.resize(550, 350)
  win.show()
  app.exec()
checklist:
- 自定义 model 四个方法完整实现
- 金额列 DisplayRole 显示带 ¥ 和两位小数，EditRole 返回 float
- add_record 用 beginInsertRows/endInsertRows 包住
- remove_record 用 beginRemoveRows/endRemoveRows 包住
- 两个按钮功能正常
- 程序正常显示并运行
```
