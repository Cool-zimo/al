# 第 6 章章测：多线程与实战

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 GUI 主线程阻塞，以下说法正确的是？
options:
- 只要把耗时操作放在单独的 Python 函数里，就不会阻塞界面
- 耗时操作放在槽函数里会导致事件循环卡住，界面"无响应"
- PySide6 会自动把耗时操作放到后台线程
- 用 QTimer 可以解决所有阻塞问题
answer: 1
explain: 槽函数在主线程同步执行，耗时操作不返回就会堵住事件循环。PySide6 不会自动后台化，QTimer 只是定时触发，不创建线程。
```

```quiz
type: choice
q: 关于 moveToThread 的正确使用，以下说法错误的是？
options:
- Worker 不能有父对象（parent），否则 moveToThread 会失败
- moveToThread 之后，Worker 的槽函数会在子线程中执行
- 子线程可以直接调用 QLabel.setText() 更新界面
- thread.started 信号可以连接到 Worker 的槽函数来启动任务
answer: 2
explain: 子线程绝不能碰 UI 控件，会导致崩溃或未定义行为。必须通过信号让主线程的槽函数更新 UI。
```

```quiz
type: choice
q: 以下哪个操作不适合放在主线程执行？
options:
- 创建 5 个 QPushButton 并添加到布局
- 用 requests.get 请求一个可能 3 秒才返回的 API
- 拼接两个字符串并显示在 QLabel 上
- 从 QLineEdit 读取文本并做正则匹配
answer: 1
explain: 网络请求可能耗时数秒，放在主线程会冻结界面。创建控件和字符串处理都是轻量操作，可以在主线程完成。
```

```quiz
type: choice
q: 关于 QTimer 和 time.sleep 的区别，正确的是？
options:
- 两者都会阻塞事件循环，只是 QTimer 精度更高
- time.sleep 会冻结事件循环，QTimer 通过信号机制不阻塞
- QTimer 内部也是用 time.sleep 实现的
- 在 QTimer 的 tick 函数里用 time.sleep 是安全的
answer: 1
explain: time.sleep 阻塞整个线程包括事件循环。QTimer 的 timeout 在事件循环间隙触发，tick 执行完立即返回。在 tick 里 sleep 同样会冻结界面。
```

```quiz
type: choice
q: 用 PyInstaller 打包 PySide6 程序时，如果运行时报 "Could not find the Qt platform plugin"，最可能的原因是？
options:
- Python 版本不对
- Qt 的 platforms 插件没有被正确打包进可执行文件
- QSS 文件路径错误
- 缺少 main 函数
answer: 1
explain: Qt 需要 platforms 插件（如 qwindows.dll）才能运行 GUI。PyInstaller 有时收集不全，需要用 --collect-all PySide6 或 --add-data 手动指定插件目录。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个程序：窗口有一个 QLabel（显示"点击次数"）、一个 QProgressBar、一个 QPushButton（"开始计时"）。点击按钮后，用 QTimer 做一个 10 秒倒计时，QLabel 每秒更新剩余秒数，QProgressBar 同步显示进度百分比。倒计时结束后 QLabel 显示"时间到！"。要求全程只用 QTimer，绝对不能用 time.sleep。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QProgressBar, QPushButton, QVBoxLayout
  )
  from PySide6.QtCore import QTimer

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("倒计时器")
  win.resize(300, 150)

  label = QLabel("点击次数: 0")
  bar = QProgressBar()
  bar.setRange(0, 100)
  btn = QPushButton("开始计时")

  # 在这里补全 QTimer 倒计时逻辑
  layout = QVBoxLayout(win)
  layout.addWidget(label)
  layout.addWidget(bar)
  layout.addWidget(btn)
  win.show()
  app.exec()
checklist:
- QTimer 正确实现 10 秒倒计时
- QLabel 每秒更新剩余秒数
- QProgressBar 同步更新百分比
- 倒计时结束后显示"时间到！"
- 全程无 time.sleep
- 界面始终响应
- 程序正常显示并运行
```

```quiz
type: local
q: 做一个"素数计算器"：窗口有 QSpinBox（输入上限 N，默认 10000）、QPushButton（"开始计算"）、QLabel（显示结果）、QProgressBar（进度）。点击开始后，用子线程计算 2~N 之间的所有素数，过程中通过信号更新进度条，计算完成后在主线程显示素数个数和耗时。要求：Worker 用 moveToThread 模式，子线程不直接碰任何 UI 控件。关闭窗口时正确退出线程。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  import time
  from PySide6.QtCore import QThread, QObject, Signal, Slot
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QProgressBar, QPushButton, QSpinBox, QVBoxLayout
  )

  # 在这里定义 Worker 和主窗口逻辑
  # 提示：用埃拉托斯特尼筛法计算素数

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("素数计算器")
  win.resize(350, 200)

  n_input = QSpinBox()
  n_input.setRange(10, 1000000)
  n_input.setValue(10000)
  btn = QPushButton("开始计算")
  result_label = QLabel("等待计算...")
  bar = QProgressBar()
  bar.setRange(0, 100)

  layout = QVBoxLayout(win)
  layout.addWidget(n_input)
  layout.addWidget(btn)
  layout.addWidget(bar)
  layout.addWidget(result_label)
  win.show()
  app.exec()
checklist:
- Worker 用 moveToThread 模式正确实现
- 素数计算逻辑正确（用筛法）
- 子线程不碰 UI，进度通过信号桥接
- 完成后在主线程显示素数个数和耗时
- 关闭窗口时线程正确退出
- 程序正常显示并运行
```

## 第三部分 · 小项目

```quiz
type: local
q: 做一个"图片缩略图生成器"：窗口有 QPushButton（"选择文件夹"）、QTableWidget（3 列：文件名、大小、状态）、QProgressBar、QTextEdit（日志区）。选择文件夹后，列出所有图片文件（.jpg/.png/.gif）到表格。点击"生成缩略图"后，用多线程把每张图片缩小到 128x128 像素并保存到子文件夹 "thumbnails/" 下。要求：缩略图生成在子线程执行，进度条和日志实时更新，状态列用 ✅ 和 ❌ 标记成功/失败。处理大图片时界面不能卡顿。如果目标文件夹已存在同名缩略图，跳过并日志记录。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  import os
  from PIL import Image
  from PySide6.QtCore import QThread, QObject, Signal, Slot
  from PySide6.QtWidgets import (
      QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
      QPushButton, QTableWidget, QTableWidgetItem, QProgressBar,
      QTextEdit, QFileDialog, QLabel
  )

  # 在这里补全缩略图生成 Worker 和主窗口逻辑
  # 提示：用 Pillow 的 Image.thumbnail() 方法

  app = QApplication(sys.argv)
  win = QMainWindow()
  win.setWindowTitle("图片缩略图生成器")
  win.resize(600, 400)

  central = QWidget()
  layout = QVBoxLayout(central)

  browse_btn = QPushButton("选择文件夹")
  table = QTableWidget()
  table.setColumnCount(3)
  table.setHorizontalHeaderLabels(["文件名", "大小(KB)", "状态"])
  progress = QProgressBar()
  progress.setRange(0, 100)
  log_area = QTextEdit()
  log_area.setReadOnly(True)
  log_area.setMaximumHeight(120)
  generate_btn = QPushButton("生成缩略图")

  layout.addWidget(browse_btn)
  layout.addWidget(table)
  layout.addWidget(progress)
  layout.addWidget(log_area)
  layout.addWidget(generate_btn)
  win.setCentralWidget(central)
  win.show()
  app.exec()
checklist:
- 文件对话框选择文件夹后能正确列出图片文件
- 表格显示文件名、大小、状态三列
- 缩略图生成在子线程执行
- 进度条和日志实时更新
- 状态列正确标记 ✅/❌
- 已存在的缩略图正确跳过
- 界面不卡顿，关闭时线程正确退出
- 程序正常显示并运行
```
