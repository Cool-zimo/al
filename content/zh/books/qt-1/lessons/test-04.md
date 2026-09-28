# 第 4 章测验：对话框与菜单

## 第一部分 · 选择题

```quiz
type: choice
q: 用户点取消后，QMessageBox.question 的返回值是？
options:
- 字符串 "No"
- QMessageBox.No
- False
- None
answer: 1
explain: 返回值是 QMessageBox.StandardButton 枚举，点取消对应 QMessageBox.No。写成字符串 "No" 或用 False 判断都会静默失败。
```

```quiz
type: choice
q: 以下哪段代码能正确判断 QInputDialog 里用户点了 OK？
options:
- if text:
- if ok:
- if text == "":
- if result == True:
answer: 1
explain: QInputDialog 的静态方法返回 (值, ok) 元组，ok 是布尔值，必须用它判断。用 text 判断不可靠，因为空字符串也可能是用户真的输入了空内容。
```

```quiz
type: choice
q: 自定义 QDialog 里用 show() 打开后立刻读取输入框内容，结果是？
options:
- 能读到用户填的内容
- 读到空值，因为 show() 是非阻塞的，代码已经往下走了
- 抛出 RuntimeError
- 阻塞等待用户输入
answer: 1
explain: show() 是非模态的，调用后立即返回，主流程继续。此时弹窗刚显示，用户还没输入，读到的自然是空值。要用 exec() 才是模态阻塞。
```

```quiz
type: choice
q: 想在 QMainWindow 里加菜单栏，但当前主窗口继承的是 QWidget，运行时报错。正确做法是？
options:
- 给 QWidget 调用 addMenu
- 把基类改成 QMainWindow
- 用 setLayout 代替
- QWidget 也有菜单栏，只是被隐藏了
answer: 1
explain: 菜单栏、工具栏、状态栏都是 QMainWindow 的专属能力，QWidget 没有。必须把基类改成 QMainWindow 才能用 menuBar()。
```

```quiz
type: choice
q: 创建了一个 QAction 并连接了 triggered 信号，但菜单和工具栏里都看不到它。最可能的原因是？
options:
- 没有调用 action.triggered.connect
- 没有调用 menu.addAction(action) 或 toolbar.addAction(action)
- 没有调用 action.setIcon
- QAction 没有 setObjectName
answer: 1
explain: QAction 只是定义了动作对象，必须显式调用 addAction 挂到菜单或工具栏才会出现。信号连接、图标、objectName 缺失都不会导致完全不显示。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"确认删除"程序：主窗口有 3 个 QPushButton 分别写着三个文件名"report.docx / data.csv / photo.jpg"，点击任何一个弹出 QMessageBox.warning，标题"删除确认"，正文"确定要删除 report.docx 吗？"（要随点击的文件变化）。按钮有 Delete 和 Cancel 两个。点 Delete 后在 QLabel 上显示"已删除：xxx"；点 Cancel 显示"已取消"。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLabel, QVBoxLayout, QMessageBox
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("确认删除")
  window.resize(300, 220)

  label = QLabel("请选择要删除的文件")
  files = ["report.docx", "data.csv", "photo.jpg"]

  # 在这里补全
  window.show()
  app.exec()
checklist:
- 三个文件按钮正确显示
- 点击按钮弹出 warning，正文含对应文件名
- 对话框有 Delete 和 Cancel 按钮
- 点 Delete 后 QLabel 显示"已删除：xxx"
- 点 Cancel 后 QLabel 显示"已取消"
- 程序正常显示并运行
```

```quiz
type: local
q: 做一个"信息录入"对话框：继承 QDialog 写 InfoDialog，用 QFormLayout 放两个 QLineEdit（姓名、电话）。有"确定"和"取消"两个按钮。重写 accept：姓名不能为空，电话必须纯数字（isdigit 判断），不合法时弹 QMessageBox.warning 并 return 保持对话框打开。主窗口一个按钮打开对话框，确认后在 QLabel 显示"已录入：姓名 - 电话"。用 exec() 取数据。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLabel, QVBoxLayout,
      QDialog, QLineEdit, QFormLayout, QHBoxLayout, QMessageBox
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("信息录入")
  window.resize(320, 200)

  label = QLabel("点击按钮录入")
  btn = QPushButton("录入信息")

  # 在这里补全
  window.show()
  app.exec()
checklist:
- 自定义 QDialog 用 QFormLayout 排两个输入框
- 重写 accept，姓名非空、电话纯数字
- 校验失败弹警告并保持对话框打开
- exec() 判断 Accepted 后显示录入信息
- 程序正常显示并运行
```

## 第三部分 · 小项目

```quiz
type: local
q: 做一个"简易文本编辑器"桌面应用，综合运用第 4 章所学：继承 QMainWindow，中央部件是 QTextEdit。菜单栏有"文件"（新建、打开、保存、退出）和"编辑"（清空）两个菜单。工具栏放"打开""保存""新建"三个动作。状态栏左侧显示"就绪"，右侧常驻 QLabel 显示字符数（随输入实时更新）。点击"打开"用 QFileDialog.getOpenFileName 选 txt 文件读入（判空）；"保存"用 getSaveFileName 写回（判空）；"新建"用 QMessageBox.question 确认，点 Yes 才清空编辑器。三个动作要同时挂到菜单和工具栏（一处定义多处使用）。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QMainWindow, QTextEdit, QMenuBar, QToolBar,
      QStatusBar, QLabel, QFileDialog, QMessageBox
  )
  from PySide6.QtGui import QAction

  class MainWindow(QMainWindow):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("简易文本编辑器")
          self.resize(550, 400)
          self.editor = QTextEdit()
          self.setCentralWidget(self.editor)

          # 在这里补全：定义 QAction、菜单栏、工具栏、状态栏
          self.editor.textChanged.connect(self.update_count)

      def update_count(self):
          pass

  app = QApplication(sys.argv)
  win = MainWindow()
  win.show()
  app.exec()
checklist:
- 继承 QMainWindow，中央是 QTextEdit
- "文件""编辑"两个菜单，含指定动作
- 工具栏挂"打开""保存""新建"三个动作
- 三个 QAction 同时挂到菜单和工具栏
- 打开/保存都用 QFileDialog 并判空
- 新建用 QMessageBox.question 确认
- 状态栏左侧"就绪"、右侧实时显示字符数
- 程序正常显示并运行
```
