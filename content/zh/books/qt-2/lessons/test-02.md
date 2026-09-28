# 第 2 章 · Model/View 进阶 · 大测验

> 8 道题。这一章解决的是"排序、过滤、编辑、选中"的问题：proxy 不改原数据做变换，delegate 决定单元格怎么画怎么改，selectionModel 管理选中。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 QSortFilterProxyModel 和源 model 的坐标问题，以下说法正确的是？
options:
- view.currentIndex() 返回的是源 model 的 index，可以直接用来访问源数据
- proxy 的 index 和 source 的 index 坐标系可能不同，需要用 mapToSource 转换
- 使用 proxy 后，源 model 的行顺序会被 proxy 自动修改
- filterKeyColumn 默认值是 -1，即所有列都参与过滤
answer: 1
explain: 过滤后 proxy 和 source 的行序可能不同，proxy 的 index 必须通过 mapToSource 转成 source 坐标。A 错在 currentIndex 是 proxy 的；C 错在 proxy 不会修改 source；D 错在 filterKeyColumn 默认是 0。
```

```quiz
type: choice
q: 关于 lessThan 和 filterAcceptsRow 的参数，以下说法正确的是？
options:
- lessThan 收到的 left/right 是 proxy 坐标系的 index，需要先 mapToSource 才能访问源数据
- filterAcceptsRow 的 source_row 是源 model 里的行号，可以直接用 model.index(source_row, col) 访问
- invalidateFilter 是可选的性能优化，不调用也能保证界面实时更新
- filterAcceptsRow 返回 False 表示这一行要显示，返回 True 表示过滤掉
answer: 1
explain: filterAcceptsRow 的 source_row 是源 model 行号，可直接配合 model.index 使用。A 错在 lessThan 收到的已经是 source 坐标；C 错在 invalidateFilter 必须调用否则不刷新；D 说反了。
```

```quiz
type: choice
q: 关于 Delegate 的 paint 方法，以下说法正确的是？
options:
- 重写 paint 时不需要调用 super().paint()，因为你要完全自定义绘制
- paint 里必须先调用 super().paint() 绘制背景，否则选中态和 hover 态会丢失
- QPainter 是每个单元格独立的对象，修改它的画笔状态不会影响其他单元格
- delegate 只能装到整个 view，不能指定某一列或某一行
answer: 1
explain: paint 中应先调用 super().paint() 保证选中态、hover 态等背景正常。A 错；C 错在 view 复用同一个 QPainter，不 save/restore 会污染相邻单元格；D 错在有 setItemDelegateForColumn/ForRow。
```

```quiz
type: choice
q: 关于 Delegate 的编辑流程，如果只重写了 createEditor 和 setEditorData，没有重写 setModelData，会出现什么现象？
options:
- 双击时编辑器不会弹出
- 编辑器能正常修改数值，但按回车或失焦后单元格显示的还是旧值
- model 的数据会被更新，但界面不刷新
- createEditor 返回 None，程序抛出异常
answer: 1
explain: setModelData 负责把编辑器的值写回 model。漏写它，model 数据没被更新，view 重画时还是旧值，表现为"编辑完一按回车值又变回去"。A 错在编辑器是 createEditor 控制的。
```

```quiz
type: choice
q: 关于 currentChanged 和 selectionChanged 的区别，以下说法正确的是？
options:
- 两者完全等价，随时可以互换使用
- currentChanged 在光标移动到新的 index 时触发，selectionChanged 在选中集合发生变化时触发
- selectionChanged 只在单选模式下触发，多选时无效
- currentChanged 的参数是单个 index，selectionChanged 没有参数
answer: 1
explain: currentChanged 随光标位置变化触发，selectionChanged 随选中集合的增减触发。用方向键移动光标会改变 current 但不一定改变 selection。C、D 均错误。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个 StatusSortProxy，继承 QSortFilterProxyModel。重写 lessThan 实现按状态优先级排序：让"待办"排在"进行中"前面、"进行中"排在"完成"前面。重写 filterAcceptsRow 实现"金额 ≥ 指定阈值"的过滤。提供 set_min_amount 方法，改完调用 invalidateFilter。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
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
              ["写文档", "完成", 500],
              ["改 bug", "待办", 1200],
              ["上线", "进行中", 800],
              ["买咖啡", "待办", 300],
          ]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
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
              return ["事项", "状态", "奖励"][section]
          return None

  class StatusSortProxy(QSortFilterProxyModel):
      _ORDER = {"待办": 0, "进行中": 1, "完成": 2}

      def __init__(self, parent=None):
          super().__init__(parent)
          self._min_amount = 0

      def set_min_amount(self, value):
          self._min_amount = value
          self.invalidateFilter()

      def lessThan(self, left, right):
          # 在这里补全：按状态优先级比较
          return False

      def filterAcceptsRow(self, source_row, source_parent):
          # 在这里补全：奖励 < 阈值 的过滤掉
          return True

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("排序+过滤代理")

  source = TaskModel()
  proxy = StatusSortProxy()
  proxy.setSourceModel(source)
  proxy.sort(1, Qt.AscendingOrder)

  spin = QSpinBox()
  spin.setRange(0, 2000)
  spin.setSingleStep(100)
  spin.valueChanged.connect(proxy.set_min_amount)

  view = QTableView()
  view.setModel(proxy)

  layout = QVBoxLayout(win)
  h = QHBoxLayout()
  h.addWidget(QLabel("最低奖励："))
  h.addWidget(spin)
  layout.addLayout(h)
  layout.addWidget(view)
  win.resize(450, 300)
  win.show()
  app.exec()
checklist:
- 重写了 lessThan 实现状态优先级排序
- 重写了 filterAcceptsRow 实现金额过滤
- set_min_amount 改完调用 invalidateFilter
- 拖动 spinbox 表格实时刷新
- 排序和过滤同时生效
- 程序正常显示并运行
```

```quiz
type: local
q: 写一个 RatingDelegate（继承 QStyledItemDelegate）：第 2 列（评分列）双击编辑时用 QSpinBox（0~5）。重写 createEditor/setEditorData/setModelData 三个方法。非编辑状态下用 paint 画"★"符号（评分几就画几个实心星）。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QSpinBox, QStyledItemDelegate
  )

  class MovieModel(QAbstractTableModel):
      def __init__(self):
          super().__init__()
          self._rows = [["肖申克的救赎", 5], ["泰坦尼克号", 4], ["阿凡达", 3]]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 2

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              return str(value)
          if role == Qt.EditRole and index.column() == 1:
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
              return ["电影", "评分"][section]
          return None

  class RatingDelegate(QStyledItemDelegate):
      def createEditor(self, parent, option, index):
          # 在这里补全：返回 0~5 的 QSpinBox
          pass

      def setEditorData(self, editor, index):
          # 在这里补全：用 EditRole 灌值
          pass

      def setModelData(self, editor, model, index):
          # 在这里补全：写回 model
          pass

      def paint(self, painter, option, index):
          super().paint(painter, option, index)
          if index.column() != 1:
              return
          value = index.data(Qt.EditRole)
          if value is None:
              value = 0
          painter.save()
          painter.setPen(QColor("#f5a623"))
          font = painter.font()
          font.setPointSize(14)
          painter.setFont(font)
          rect = option.rect
          stars = "★" * int(value) + "☆" * (5 - int(value))
          painter.drawText(rect, Qt.AlignCenter, stars)
          painter.restore()

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("星级委托")
  model = MovieModel()
  view = QTableView()
  view.setModel(model)
  view.setItemDelegateForColumn(1, RatingDelegate())
  view.show()
  app.exec()
checklist:
- createEditor 返回 0~5 的 QSpinBox
- setEditorData 用 EditRole 灌入当前值
- setModelData 把 spinbox 值写回 model
- paint 在非编辑状态画出星号（实心+空心）
- 双击评分列能编辑，编辑完显示更新
- 程序正常显示并运行
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"任务看板"：左侧 QTableView 显示任务列表（事项、状态、优先级数字），用 StatusSortProxy 按状态优先级排序，用 AmountFilterProxy（命名你定）按优先级 ≥ 阈值过滤。状态列用自定义 Delegate（QComboBox 编辑：低/中/高，存成 1/2/3）。右侧 QLabel 显示当前选中行的详情（用 selectionChanged + mapToSource）。界面顶部有搜索框（过滤关键字）、优先级阈值 SpinBox。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import QAbstractTableModel, Qt, QModelIndex, QSortFilterProxyModel
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTableView, QLineEdit, QSpinBox, QLabel,
      QComboBox, QStyledItemDelegate, QHBoxLayout, QVBoxLayout
  )

  class TaskModel(QAbstractTableModel):
      def __init__(self):
          super().__init__()
          self._rows = [
              ["写文档", "待办", 2],
              ["改 bug", "进行中", 3],
              ["上线", "完成", 1],
              ["买咖啡", "待办", 1],
              ["开会", "进行中", 2],
          ]

      def rowCount(self, parent=Qt.QModelIndex()):
          return len(self._rows)

      def columnCount(self, parent=Qt.QModelIndex()):
          return 3

      def data(self, index, role=Qt.DisplayRole):
          if not index.isValid():
              return None
          value = self._rows[index.row()][index.column()]
          if role == Qt.DisplayRole:
              if index.column() == 2:
                  return ["低", "中", "高"][value - 1]
              return str(value)
          if role == Qt.UserRole and index.column() == 2:
              return value
          if role == Qt.EditRole and index.column() == 2:
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
          if index.column() == 2:
              return f | Qt.ItemIsEditable
          return f

      def headerData(self, section, orientation, role=Qt.DisplayRole):
          if role == Qt.DisplayRole and orientation == Qt.Horizontal:
              return ["事项", "状态", "优先级"][section]
          return None

  # 在这里补全：StatusSortProxy 和 PriorityFilterProxy
  # StatusSortProxy：lessThan 按状态优先级排序
  # PriorityFilterProxy：filterAcceptsRow 按优先级 >= 阈值

  class PriorityDelegate(QStyledItemDelegate):
      _OPTIONS = [("低", 1), ("中", 2), ("高", 3)]

      def createEditor(self, parent, option, index):
          editor = QComboBox(parent)
          editor.addItems([name for name, _ in self._OPTIONS])
          return editor

      def setEditorData(self, editor, index):
          value = index.data(Qt.EditRole)
          if value in (1, 2, 3):
              editor.setCurrentIndex(value - 1)

      def setModelData(self, editor, model, index):
          model.setData(index, editor.currentIndex() + 1, Qt.EditRole)

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("任务看板")

  source = TaskModel()
  # proxy 链：source -> status_sort -> priority_filter
  sort_proxy = StatusSortProxy()
  sort_proxy.setSourceModel(source)
  filter_proxy = PriorityFilterProxy()
  filter_proxy.setSourceModel(sort_proxy)
  filter_proxy.setFilterKeyColumn(-1)

  search = QLineEdit()
  search.setPlaceholderText("搜索关键字...")
  search.textChanged.connect(filter_proxy.setFilterFixedString)

  priority_spin = QSpinBox()
  priority_spin.setRange(1, 3)
  priority_spin.valueChanged.connect(filter_proxy.set_min_priority)

  view = QTableView()
  view.setModel(filter_proxy)
  view.setSelectionBehavior(Qt.SelectRows)
  view.setItemDelegateForColumn(2, PriorityDelegate())

  detail = QLabel("请选中一行查看详情")
  detail.setWordWrap(True)

  def on_selection_changed(selected, deselected):
      indexes = selected.indexes()
      if not indexes:
          detail.setText("未选中任何行")
          return
      # 用 mapToSource 两次（经过两层 proxy）取真实数据
      idx = indexes[0]
      src_idx = filter_proxy.mapToSource(idx)
      src_idx = sort_proxy.mapToSource(src_idx)
      row = src_idx.row()
      row_data = source._rows[row]
      detail.setText(
          f"事项：{row_data[0]}\n状态：{row_data[1]}\n优先级：{row_data[2]}")

  view.selectionModel().selectionChanged.connect(on_selection_changed)

  toolbar = QHBoxLayout()
  toolbar.addWidget(QLabel("搜索："))
  toolbar.addWidget(search)
  toolbar.addWidget(QLabel("最低优先级："))
  toolbar.addWidget(priority_spin)

  layout = QVBoxLayout(win)
  layout.addLayout(toolbar)
  layout.addWidget(view)
  layout.addWidget(detail)
  win.resize(600, 400)
  win.show()
  app.exec()
checklist:
- StatusSortProxy 按状态优先级正确排序
- PriorityFilterProxy 按阈值正确过滤（set_min_priority + invalidateFilter）
- 搜索框能过滤关键字（所有列）
- 优先级列用 QComboBox 委托编辑，能写回 model
- 选中行右侧显示详情（用 mapToSource 两次转换）
- 三层变换同时生效，界面实时刷新
- 程序正常显示并运行
```
