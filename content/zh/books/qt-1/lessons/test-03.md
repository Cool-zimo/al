# 第 3 章 · 常用控件 · 大测验

> 8 道题。这一章解决的是"Qt 提供了哪些现成控件、怎么用"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 QLabel 和 QPushButton，以下说法正确的是？
options:
- QLabel 只能显示纯文本，不能显示图片
- QPushButton 的 clicked 信号可以连接自定义槽函数
- QLabel 没有信号，不能作为交互控件使用
- QPushButton 不能设置快捷键
answer: 1
explain: QPushButton.clicked 信号是最常用的信号之一，可以 connect 到任何 callable。QLabel 虽然主要用于显示，但可以通过 setTextFormat 支持富文本，也可以通过 setPixmap 显示图片。QPushButton 支持 setShortcut 设置快捷键。
```

```quiz
type: choice
q: QTextEdit 设置为只读模式后，哪个信号仍然可以触发？
options:
- textChanged
- cursorPositionChanged
- selectionChanged
- 以上三个都可能触发
answer: 3
explain: 只读模式下 QTextEdit 的 textChanged 不会因用户输入触发（因为不能编辑），但可以通过代码 setPlainText 修改从而触发。cursorPositionChanged 和 selectionChanged 在只读模式下仍然有效，因为用户可以选择文本和移动光标。
```

```quiz
type: choice
q: 三个单选按钮放在窗口上但没有分组，用户操作时会发生什么？
options:
- 编译报错
- 三个按钮互斥，只能选一个
- 可能同时选中多个，行为不可控
- 程序崩溃
answer: 2
explain: 单选按钮的互斥依赖"同一个父容器的布局"或"同一个 QButtonGroup"。直接散落在窗口上没有显式分组时，行为不可控——可能全混在一起互斥，也可能各自独立可多选。用 QButtonGroup 是推荐的显式分组方式。
```

```quiz
type: choice
q: 关于 QTableWidget，以下哪行代码是必须的，否则数据不会显示？
options:
- table.setRowCount(3)
- table.setColumnCount(3)
- table.setEditTriggers(QAbstractItemView.NoEditTriggers)
- table.horizontalHeader().setVisible(True)
answer: 1
explain: QTableWidget 必须先用 setColumnCount 设置列数，否则通过 setItem 设置的数据不会显示（也不会报错）。这是最常见的初学者坑。setRowCount 不是必须的，可以用 insertRow 动态加行。
```

```quiz
type: choice
q: 要实现"拖动滑块 → 数字框跟着变 → 进度条跟着走"的联动效果，核心机制是？
options:
- 重写 paintEvent
- 信号槽：把滑块的 valueChanged 连接到 spin.setValue 和 bar.setValue
- 用 QTimer 轮询
- 继承 QSlider 重写 mouseMoveEvent
answer: 1
explain: 这正是信号槽的典型应用场景。滑块的 valueChanged(int) 信号 connect 到 QSpinBox.setValue 和 QProgressBar.setValue，一个信号触发多个联动更新，代码简洁优雅。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"信息录入"界面：QLabel 标题"用户信息"，QFormLayout 放 QLineEdit（姓名）、QSpinBox（年龄，0~120）、QComboBox（城市：北京/上海/广州/深圳）、QCheckBox（订阅通知）。下方一个 QLabel 实时显示汇总（比如"张三, 25岁, 北京, 已订阅"）。所有控件变化都更新汇总。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QLineEdit, QSpinBox,
      QComboBox, QCheckBox, QVBoxLayout, QFormLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("信息录入")
  window.resize(300, 250)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- QFormLayout 表单布局（标签+控件成对）
- QLineEdit 输入姓名
- QSpinBox 年龄（0~120）
- QComboBox 城市（至少 4 项）
- QCheckBox 订阅通知
- QLabel 实时显示汇总信息
- 程序正常显示并运行
```

```quiz
type: local
q: 做一个"任务进度"界面：QSlider（0~100）+ QSpinBox（0~100）联动，QProgressBar 显示进度。再加一个 QCheckBox"显示百分比"，勾选时进度条 format 为"%p%"，取消勾选时 format 为空字符串（不显示文字）。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QSlider, QSpinBox,
      QProgressBar, QCheckBox, QVBoxLayout
  )
  from PySide6.QtCore import Qt

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("任务进度")
  window.resize(300, 180)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- QSlider + QSpinBox 联动（0~100）
- QProgressBar 显示进度
- QCheckBox 控制进度条文字显示/隐藏
- 勾选时显示"%p%"，取消时隐藏文字
- 程序正常显示并运行
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"迷你笔记本"应用：上方 QTextEdit 用于编辑文本，下方 QLineEdit 输入文件名，两个按钮"保存"和"清空"。右侧用 QListWidget 显示已保存的文件列表（模拟，用 addItem 添加文件名即可）。点击列表中的文件名，QTextEdit 显示对应内容（用一个字典模拟存储）。保存时把 QTextEdit 内容存入字典，并在列表中添加文件名。清空按钮清空编辑区。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTextEdit, QLineEdit,
      QPushButton, QListWidget, QVBoxLayout, QHBoxLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("迷你笔记本")
  window.resize(500, 400)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- QTextEdit 编辑区 + QLineEdit 文件名输入
- "保存"按钮：内容存入字典 + 文件名加入 QListWidget
- "清空"按钮：清空 QTextEdit
- QListWidget 点击文件名，QTextEdit 显示对应内容
- 用字典模拟文件存储
- 程序正常显示并运行
```