# 第 5 章测验：样式与资源

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 QSS 与 CSS 的差异，以下说法正确的是？
options:
- QSS 完全支持 flex 布局和 grid 布局
- QSS 用 :: 访问子控件，如 QComboBox::drop-down
- QSS 的伪状态用 :: 前缀，如 QPushButton::hover
- QSS 里属性赋值可以用 = 号
answer: 1
explain: QSS 独有子控件概念，用 :: 访问，如 QComboBox::drop-down、QCheckBox::indicator。伪状态用 : 前缀；QSS 不支持 flex/grid；属性必须用 : 和 ;，不能用 =。
```

```quiz
type: choice
q: 在 QSS 里想让输入框聚焦时边框变蓝且不抖动，正确做法是？
options:
- 边框变 2px 时把 padding 也加大 1px
- 边框变 2px 时把 padding 减小 1px 抵消
- 把 border-radius 设为 0
- 聚焦时隐藏边框
answer: 1
explain: 边框从 1px 变 2px 会挤占 1px 内部空间导致文字抖动，需同步把 padding 减小 1px。或者用 outline 属性，它不占布局空间。
```

```quiz
type: choice
q: 往 resources.qrc 里新增了一个图标 new.png，运行时 QIcon(":/icons/new.png") 显示为空白。最可能漏掉的步骤是？
options:
- 没有重启电脑
- 没有重新运行 pyrcc6 resources.qrc -o resources_rc.py
- 没有把 new.png 复制到 Python 安装目录
- 没有给 QIcon 传父对象
answer: 1
explain: qrc 是源文件，真正被读取的是编译产物 resources_rc.py。新增资源后必须重跑 pyrcc6 重新编译，否则新资源在旧 _rc.py 里不存在。
```

```quiz
type: choice
q: 关于 QIcon 的多分辨率机制，以下说法正确的是？
options:
- QIcon 只能装一张图
- QIcon 用 addFile 注册多尺寸后，Qt 会根据显示需求自动选择最合适的图
- 必须手动判断 DPI 并手动切换图标
- 图标模糊重启程序就能解决
answer: 1
explain: QIcon 支持 addFile 注册多张不同尺寸的图，Qt 会在不同 DPI 下自动选择最合适的那张。不需要手动判断 DPI，图标模糊通常是缺 2x 图。
```

```quiz
type: choice
q: 切换主题时，希望所有控件（QPushButton、QLineEdit 等）都跟着变，应该把 QSS 设给谁？
options:
- 只设给主窗口 window
- 设给 app，即 app.setStyleSheet
- 设给 QPushButton 即可
- QSS 会自动全局生效，不用设给任何对象
answer: 1
explain: 要用 app.setStyleSheet 做全局设置才能覆盖所有控件。只设给 window 时很多控件不继承；QSS 不会自动全局生效。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"美化的登录卡片"：窗口背景 #ecf0f1，中央一个白色 QFrame（objectName 设为"card"），1px 灰色边框、12px 圆角、白色背景、24px 内边距。卡片内垂直排列：一个 QLabel 标题"欢迎登录"（24px 加粗 #2c3e50）、一个账号 QLineEdit（占位符"请输入账号"）、一个密码 QLineEdit（占位符"请输入密码"，setEchoMode 为 Password）、一个"登录" QPushButton。输入框 1px 边框、6px 圆角、8px 内边距，聚焦时边框变 #3498db 且内边距同步减 1px；按钮背景 #3498db、白色文字、6px 圆角、8px 内边距，悬停 #2980b9、按下 #1f6391；占位符灰色 #95a5a6 斜体。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QFrame, QLabel, QLineEdit, QPushButton, QVBoxLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("登录卡片")
  window.resize(360, 420)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- 白色圆角卡片正确创建并合理排布
- 标题、账号框、密码框、按钮都在卡片内
- 输入框聚焦边框变色且内边距无抖动
- 占位符灰色斜体
- 按钮有正常/悬停/按下三种状态
- 程序正常显示并运行
```

```quiz
type: local
q: 做一个"双主题计算器"界面：主窗口一个 QLineEdit 做显示屏（只读、右对齐），下方用 QGridLayout 排 16 个按钮（0-9、+、-、*、/、=、C）。提供两套 QSS（浅色和深色），要求覆盖显示屏和按钮。浅色：显示屏白底深字、按钮白底深字 1px 灰边框；深色：显示屏深灰底浅字、按钮深灰底浅字无边框。点击"主题"按钮在两个主题间切换，按钮文字同步更新为"切换深色/浅色"。用 app.setStyleSheet 全局生效。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLineEdit, QPushButton, QVBoxLayout, QGridLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("双主题计算器")
  window.resize(300, 380)

  display = QLineEdit()
  display.setReadOnly(True)
  display.setAlignment(Qt.AlignRight)

  # 在这里补全按钮、布局和主题切换
  window.show()
  app.exec()
checklist:
- 显示屏和 16 个按钮正确创建排布
- 两套完整 QSS 覆盖显示屏和按钮
- app.setStyleSheet 全局切换主题
- 切换按钮文字同步更新
- 程序正常显示并运行
```

## 第三部分 · 小项目

```quiz
type: local
q: 做一个"主题化记事本"，综合运用第 5 章所学：继承 QMainWindow，中央 QTextEdit。菜单栏有"文件"（新建、打开、保存、退出）和"主题"（浅色、深色）两个菜单。工具栏放"打开""保存""新建"三个动作。状态栏显示"就绪"和字符数。三套主题（浅色 #ffffff/#2c3e50、深色 #2c3e50/#ecf0f1、护眼绿 #f0f7ee/#2e4d2e），每套都要覆盖 QTextEdit、QMenuBar、QStatusBar 和 QPushButton。用 qrc 打包两个图标（open.png、save.png），编译后 import resources_rc，给打开和保存按钮设置图标（要验证 import 漏掉时图标不显示）。QSettings 记住主题偏好。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  # import resources_rc   # 先注释试试，再打开看区别
  from PySide6.QtWidgets import (
      QApplication, QMainWindow, QTextEdit, QMenuBar, QToolBar,
      QStatusBar, QLabel, QFileDialog, QMessageBox
  )
  from PySide6.QtGui import QAction, QIcon
  from PySide6.QtCore import QSettings

  class MainWindow(QMainWindow):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("主题化记事本")
          self.resize(550, 420)
          self.editor = QTextEdit()
          self.setCentralWidget(self.editor)

          # 在这里补全：三套 QSS、菜单栏、工具栏（带图标）、状态栏、主题切换
          self.editor.textChanged.connect(self.update_count)

      def update_count(self):
          pass

  app = QApplication(sys.argv)
  settings = QSettings("QtDemo", "ThemeNote")
  win = MainWindow()
  win.show()
  app.exec()
checklist:
- 继承 QMainWindow，中央 QTextEdit
- 三套完整主题覆盖所有主要控件
- 菜单栏"文件""主题"两个菜单
- 工具栏三个动作带 qrc 图标
- import resources_rc 打开/注释分别测试图标显示差异
- QSettings 保存并恢复主题选择
- 状态栏显示"就绪"和字符数
- 程序正常显示并运行
```
