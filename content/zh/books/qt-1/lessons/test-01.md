# 第 1 章 · 信号与槽 · 大测验

> 8 道题。这一章解决的是"控件之间怎么通信"的问题——信号与槽是 Qt 的核心机制。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 下面哪段代码会导致窗口一闪而过、立即关闭？
options:
- app = QApplication(sys.argv); window = QWidget(); window.show(); app.exec()
- app = QApplication(sys.argv); window = QWidget(); window.show(); sys.exit(app.exec())
- app = QApplication(sys.argv); window = QWidget(); window.show()
- app = QApplication(sys.argv); window = QWidget(); app.exec(); window.show()
answer: 2
explain: 缺少 app.exec() 时，程序执行完 show() 后直接退出，事件循环没有启动，窗口一闪而过。show() 只是把窗口标记为可见，真正让窗口持续显示的是 app.exec() 开启的事件循环。
```

```quiz
type: choice
q: PySide6 和 PyQt6 的许可证区别是？
options:
- PySide6 用 GPL，PySide6 用 LGPL
- PySide6 用 LGPL，PySide6 用 GPL
- 两者都用 MIT 许可证
- 两者都用商业许可证
answer: 1
explain: PySide6 使用 LGPLv3 许可证，允许动态链接到闭源商业项目；PySide6 使用 GPLv3 许可证，要求衍生作品开源。这是两者最大的商业使用差异。
```

```quiz
type: choice
q: 信号与槽和 tkinter 的 command 回调相比，本质区别是什么？
options:
- 没有区别，只是写法不同
- 信号可以一对多（一个信号连接多个槽），command 只能一对一
- command 更快
- 信号不能跨线程
answer: 1
explain: Qt 的信号槽是松耦合的观察者模式：一个信号可以 connect 多个槽函数，一个槽也可以被多个信号连接。而 tkinter 的 command 是控件属性，只能绑定一个回调函数，是紧耦合的一对一关系。
```

```quiz
type: choice
q: 以下哪段代码正确连接了按钮的点击信号？
options:
- button.clicked.connect = on_click
- button.clicked.connect(on_click)
- connect(button.clicked, on_click)
- button.connectSignal("clicked", on_click)
answer: 1
explain: PySide6 中信号是对象，用 signal.connect(slot) 方法连接。不能赋值（信号不可覆盖），也不能用字符串传信号名。
```

```quiz
type: choice
q: 要在槽函数里传额外参数，推荐做法是什么？
options:
- def on_click(a, b): ... 直接 connect
- 用 lambda：button.clicked.connect(lambda: on_click(extra_arg))
- 用 global 声明
- 改 PySide6 源码
answer: 1
explain: lambda 是最常用的传参方式。注意 lambda 的闭包陷阱：如果循环里用 lambda 且引用了循环变量，需要用默认参数捕获当前值，如 lambda x=i: func(x)。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 写一个程序：窗口有一个 QLabel 显示"计数：0"和一个 QPushButton"点我"。每次点击按钮，计数 +1 并更新到 QLabel 上。要求用信号槽连接，不用全局变量（把计数存在实例属性里）。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QVBoxLayout

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("计数器")
  window.resize(250, 150)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- QLabel 初始显示"计数：0"
- QPushButton 文字为"点我"
- 点击按钮计数 +1，Label 实时更新
- 使用实例属性存储计数，不用全局变量
- 信号槽用 connect 连接
- 程序正常显示并运行
```

```quiz
type: local
q: 定义一个自定义 Signal：创建一个类 Counter，继承 QObject，里面声明一个 Signal(int) 叫 value_changed。再写一个槽函数，连接后每次调用 emit 发出信号，槽函数打印收到的值。用 lambda 方式 connect 并传额外参数。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import QObject, Signal

  # 在这里补全
checklist:
- 自定义 Signal(int) 声明为 value_changed
- Counter 继承 QObject
- 调用 emit 发出信号
- 槽函数正确接收并打印值
- 使用 lambda 传额外参数
- 程序运行无报错
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"简易事件总线"小项目：窗口上有三个 QPushButton（红、绿、蓝）和一个 QWidget 作为颜色面板。点击不同按钮，面板的背景色变为对应颜色（用 setStyleSheet）。同时用自定义 Signal(str) 传递颜色名，让一个 QLabel 显示"当前颜色：XX"。要求：自定义 Signal 定义在一个 QObject 子类里，按钮点击触发 emit，槽函数负责更新面板和标签。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLabel, QVBoxLayout, QHBoxLayout
  )
  from PySide6.QtCore import QObject, Signal

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("颜色切换器")
  window.resize(300, 200)

  # 在这里补全
  window.show()
  app.exec()
checklist:
- 自定义 Signal(str) 声明在 QObject 子类中
- 三个按钮（红/绿/蓝），点击触发 emit
- QWidget 面板背景色随按钮切换
- QLabel 显示"当前颜色：XX"
- 信号槽连接正确
- 程序正常显示并运行
```