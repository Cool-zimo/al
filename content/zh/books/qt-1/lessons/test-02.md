# 第 2 章 · 布局管理 · 大测验

> 8 道题。这一章解决的是"控件怎么排列才好看、才自适应"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 setGeometry 绝对定位，以下哪个问题它无法解决？
options:
- 窗口缩放后控件不跟随变化
- 不同分辨率下控件位置错乱
- DPI 缩放后界面错位
- 控件之间有间距
answer: 3
explain: setGeometry 硬编码了控件的位置和大小，窗口缩放、分辨率变化、DPI 缩放都会导致界面错乱。控件之间有间距这个问题 setGeometry 本身可以设置（手动计算坐标），所以不是它"无法解决"的问题。
```

```quiz
type: choice
q: 以下代码使用 QVBoxLayout 加 addStretch，三个按钮会怎么排列？
layout = QVBoxLayout()
layout.addWidget(btn1)
layout.addStretch()
layout.addWidget(btn2)
layout.addWidget(btn3)
options:
- 三个按钮均匀分布，中间有弹性空间
- btn1 在最顶部，btn2 和 btn3 挤在最底部
- 三个按钮等距排列
- btn2 和 btn3 在最顶部，btn1 在最底部
answer: 1
explain: addStretch() 插入一个可伸缩的空白空间，它会占据所有多余的垂直空间。所以 btn1 在顶部紧贴，stretch 吃掉了中间所有空间，btn2 和 btn3 被推到底部紧挨在一起。
```

```quiz
type: choice
q: QGridLayout 中 addWidget(widget, row, column, rowSpan, columnSpan) 的参数含义是？
options:
- (控件, 列, 行, 列跨度, 行跨度)
- (控件, 行, 列, 行跨度, 列跨度)
- (控件, 行, 列, 最小宽, 最小高)
- (控件, x坐标, y坐标, 宽, 高)
answer: 1
explain: QGridLayout.addWidget 的前两个参数是 row 和 column（行列索引，从 0 开始），后两个是 rowSpan（跨几行）和 columnSpan（跨几列）。例如 addWidget(w, 0, 0, 2, 1) 表示放在第 0 行第 0 列，占 2 行 1 列。
```

```quiz
type: choice
q: QFormLayout 最适合什么场景？
options:
- 网格状数据表格
- 表单式的"标签+输入控件"成对排列
- 自由拖拽画布
- 选项卡切换
answer: 1
explain: QFormLayout 专门用来做表单布局，每一行左边是 QLabel（标签），右边是输入控件（QLineEdit、QSpinBox 等），自动对齐。比手动用 QGridLayout 写表单方便得多。
```

```quiz
type: choice
q: 关于 sizePolicy 和 setStretch，正确的是？
options:
- sizePolicy 控制控件在布局中的拉伸优先级，setStretch 控制比例权重
- sizePolicy 和 setStretch 是完全一样的东西
- setStretch 只能用于 QVBoxLayout
- sizePolicy 只能在运行时修改
answer: 0
explain: QSizePolicy 描述控件对空间的态度（如 Expanding、Fixed、Preferred），决定它是否愿意被拉伸。setStretch 给布局中的控件设置拉伸比例，比如 stretch 1:2 意味着两个控件按 1:2 分配多余空间。两者配合使用。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 用 QVBoxLayout + addStretch 做一个"顶部工具栏"布局：窗口顶部有三个按钮（新建、打开、保存）水平排列，下方是一个 QTextEdit 占满剩余空间。要求按钮区靠顶部，编辑器填满下方所有空间。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QTextEdit, QVBoxLayout, QHBoxLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("编辑器")
  window.resize(400, 300)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- 顶部三个按钮（新建/打开/保存）水平排列
- 使用 QVBoxLayout + addStretch 让按钮区靠顶部
- QTextEdit 填满下方剩余空间
- 窗口缩放时编辑器自适应
- 程序正常显示并运行
```

```quiz
type: local
q: 用 QGridLayout 做一个简易计算器界面：数字 0-9 排列成 3x3 网格，第 4 行放"清除"和"="按钮（"清除"跨 2 列，"="跨 1 列）。再加一个 QLineEdit 放在第 0 行跨 3 列作为显示屏。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLineEdit, QGridLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("计算器")
  window.resize(250, 300)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- QLineEdit 在第 0 行跨 3 列
- 数字 0-9 排列在网格中（至少排布合理）
- "清除"按钮跨 2 列
- "="按钮在合适位置
- 使用 QGridLayout 的 addWidget 带 rowSpan/columnSpan
- 程序正常显示并运行
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"登录窗口"：用 QFormLayout 做表单区（用户名 QLineEdit + 密码 QLineEdit + 记住密码 QCheckBox），上方加一个标题 QLabel，下方用 QHBoxLayout 放"取消"和"登录"两个按钮（登录在右侧，用 addStretch 实现）。最外层用 QVBoxLayout 嵌套。密码框设为密码模式（setEchoMode）。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QLineEdit, QCheckBox,
      QPushButton, QVBoxLayout, QHBoxLayout, QFormLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("登录")
  window.resize(300, 200)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- 使用 QFormLayout 排列表单（标签+输入控件成对）
- 密码框 setEchoMode 为 Password
- 有"记住密码" QCheckBox
- "取消"和"登录"按钮用 QHBoxLayout + addStretch 让登录靠右
- 标题 QLabel 在最上方
- 外层用 QVBoxLayout 嵌套所有子布局
- 程序正常显示并运行
```