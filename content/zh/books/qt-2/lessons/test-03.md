# 第 3 章 · 自定义控件 · 大测验

> 8 道题。这一章解决的是"现成控件拼不出你要的样子"的问题：继承扩展、完全自绘、事件处理，以及 event 与 eventFilter 的区别。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于自定义信号的定义位置，以下写法正确的是？
options:
- 在 __init__ 里写 self.my_signal = Signal()
- 在类体里写 my_signal = Signal()
- 在模块顶层写 my_signal = Signal()
- 用普通方法 def my_signal(self): 代替 Signal
answer: 1
explain: Signal() 必须作为类属性定义在类体中。A 错在写在 __init__ 里成了实例属性，不是真正的 Qt 信号；C 错在模块顶层无法绑定到类；D 错在普通方法不能当信号用。
```

```quiz
type: choice
q: 关于 drawArc 的角度参数和 QPainter 的生命周期，以下说法正确的是？
options:
- drawArc 的起始角和跨度用度为单位，90 度就传 90
- drawArc 的角度单位是 1/16 度，90 度要传 90 * 16；且 QPainter 只能在 paintEvent 期间使用
- QPainter 可以当作成员变量长期持有，在任意事件处理函数里调用它的绘制方法
- 修改了控件数据后，paintEvent 会自动被调用，无需手动触发
answer: 1
explain: drawArc 角度单位是 1/16 度，90° 需传 90*16；QPainter 只能在 paintEvent 期间活跃，不能长期持有。C 错在 painter 不能当成员；D 错在必须调用 update() 才会重绘。
```

```quiz
type: choice
q: 关于 event() 与 eventFilter() 的区别，以下说法正确的是？
options:
- event() 用于监听其他 widget 的事件，eventFilter() 用于监听自己的事件
- event() 监听自己的事件，eventFilter() 在不子类化的情况下监听别的 widget 的事件
- 两者没有区别，可以互换使用
- eventFilter() 返回 False 表示拦截事件，目标 widget 收不到该事件
answer: 1
explain: event() 是监听自己 widget 事件的总入口；eventFilter() 配合 installEventFilter 可以在不子类化的情况下监听别的 widget 的事件。A 说反了；D 错在返回 False 是放行，True 才是拦截。
```

```quiz
type: choice
q: 想在 widget 上"鼠标不按键也能持续收到 mouseMove 事件"（实现悬停高亮），应该怎么做？
options:
- 重写 mouseMoveEvent 即可，默认就会在悬停时触发
- 调用 setMouseTracking(True) 开启鼠标跟踪
- 调用 grabMouse() 抢占鼠标
- 在 enterEvent 里调用 mouseMoveEvent
answer: 1
explain: 默认情况下只有鼠标按钮按下时才持续收到 mouseMoveEvent。调用 setMouseTracking(True) 后，不按键移动鼠标也会触发。A 错在默认不触发；C 是抓取鼠标，不是跟踪。
```

```quiz
type: choice
q: 重写 mousePressEvent 时忘记调用 super().mousePressEvent(event)，会导致什么后果？
options:
- 程序崩溃，因为必须调用父类实现
- 父类的默认行为（如 QPushButton 的点击高亮、click 信号）会丢失
- 没有任何影响，是否调用 super 完全可选
- 只有键盘事件会受影响，鼠标事件不受影响
answer: 1
explain: 父类的 mousePressEvent 实现了点击高亮、状态切换、click 信号触发等逻辑。不调用 super 会导致这些默认行为丢失。A 错在不调用不会崩溃；C 错在多数场景需要保留父类行为。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个 ToggleSwitch 开关控件，继承 QWidget（完全自绘）。外观是一个圆角胶囊，内部有一个圆形滑块，开启时滑块在右侧（绿色胶囊）、关闭时在左侧（灰色胶囊）。点击切换状态，发出自定义信号 toggled(checked: bool)。重写 paintEvent 画胶囊和滑块，重写 mousePressEvent 切换状态。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import Qt, Signal
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout

  class ToggleSwitch(QWidget):
      toggled = Signal(bool)

      def __init__(self, parent=None):
          super().__init__(parent)
          self._checked = False
          self.setFixedSize(60, 30)
          self.setCursor(Qt.PointingHandCursor)

      def is_checked(self):
          return self._checked

      def set_checked(self, checked):
          if self._checked == checked:
              return
          self._checked = checked
          self.toggled.emit(self._checked)
          self.update()

      def paintEvent(self, event):
          painter = QPainter(self)
          painter.setRenderHint(QPainter.Antialiasing)

          rect = self.rect()
          radius = rect.height() // 2

          # 在这里补全：画圆角矩形胶囊（绿/灰）+ 圆形滑块
          # 胶囊：用 drawRoundedRect，圆角半径 = height/2
          # 滑块：圆形，开启时在右侧，关闭时在左侧

          painter.end()

      def mousePressEvent(self, event):
          if event.button() == Qt.LeftButton:
              self.set_checked(not self._checked)
          super().mousePressEvent(event)

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("开关控件")

  switch = ToggleSwitch()
  switch.toggled.connect(lambda c: print(f"开关变成：{'开' if c else '关'}"))

  layout = QVBoxLayout(win)
  layout.addWidget(switch)
  layout.setAlignment(switch, Qt.AlignCenter)
  win.resize(200, 120)
  win.show()
  app.exec()
checklist:
- 重写了 paintEvent 画出圆角胶囊和圆形滑块
- 开启时绿色胶囊、滑块在右；关闭时灰色胶囊、滑块在左
- 重写了 mousePressEvent 点击切换状态
- 切换时发出 toggled 信号（控制台有打印）
- set_checked 有防抖（相同值不发信号）
- 程序正常显示并运行
```

```quiz
type: local
q: 用事件过滤器（eventFilter）监控上面的 ToggleSwitch：不子类化 switch，写一个 HoverWatcher(QObject)，在鼠标进入 switch 时打印"进入"、离开时打印"离开"（用 QEvent.Enter 和 QEvent.Leave）。安装过滤器后验证打印。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import Qt, Signal, QObject, QEvent
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout

  class ToggleSwitch(QWidget):
      toggled = Signal(bool)

      def __init__(self, parent=None):
          super().__init__(parent)
          self._checked = False
          self.setFixedSize(60, 30)
          self.setMouseTracking(True)
          self.setCursor(Qt.PointingHandCursor)

      def set_checked(self, checked):
          if self._checked == checked:
              return
          self._checked = checked
          self.toggled.emit(self._checked)
          self.update()

      def paintEvent(self, event):
          painter = QPainter(self)
          painter.setRenderHint(QPainter.Antialiasing)
          rect = self.rect()
          radius = rect.height() // 2
          painter.setPen(Qt.NoPen)
          painter.setBrush(QColor("#4caf50") if self._checked else QColor("#9e9e9e"))
          painter.drawRoundedRect(rect, radius, radius)
          painter.setBrush(QColor("white"))
          cx = rect.width() - radius if self._checked else radius
          painter.drawEllipse(cx - radius + 4, 4, rect.height() - 8, rect.height() - 8)
          painter.end()

      def mousePressEvent(self, event):
          if event.button() == Qt.LeftButton:
              self.set_checked(not self._checked)
          super().mousePressEvent(event)

  class HoverWatcher(QObject):
      def eventFilter(self, watched, event):
          # 在这里补全：识别 Enter/Leave 并打印，返回 False 放行
          return False

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("事件过滤器")

  switch = ToggleSwitch()
  watcher = HoverWatcher()
  switch.installEventFilter(watcher)

  switch.toggled.connect(lambda c: print(f"开关：{'开' if c else '关'}"))

  layout = QVBoxLayout(win)
  layout.addWidget(switch)
  layout.setAlignment(switch, Qt.AlignCenter)
  win.resize(200, 120)
  win.show()
  app.exec()
checklist:
- 写了 HoverWatcher 继承 QObject 并重写 eventFilter
- eventFilter 能识别 QEvent.Enter 和 QEvent.Leave 并打印
- eventFilter 返回 False 放行，不影响开关正常点击
- 鼠标进入/离开时控制台有对应打印
- 程序正常显示并运行
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"可拖拽调色的颜色选择器"：继承 QWidget 完全自绘。控件分为上下两部分——上部是一个 200x200 的正方形色板（用 QPainter 画渐变：横向从左到右是色谱，纵向从上到下变暗），下部是一个横向的色相条。鼠标在色板上拖动时，根据鼠标位置计算出当前颜色（RGB），发出信号 color_picked(color: QColor)；鼠标在色相条上拖动时改变色相。控件右侧显示当前颜色的十六进制值和预览方块。这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtCore import Qt, Signal
  from PySide6.QtGui import QPainter, QColor, QLinearGradient
  from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel

  class ColorPicker(QWidget):
      color_picked = Signal(QColor)

      def __init__(self, parent=None):
          super().__init__(parent)
          self._hue = 0              # 当前色相 0~359
          self._current = QColor("#ff0000")
          self.setMinimumSize(320, 320)
          self.setMouseTracking(True)

          # 布局区域（在 paintEvent 里按固定矩形绘制）
          self._board_rect = None    # 色板区域
          self._hue_rect = None      # 色相条区域

      def set_hue(self, hue):
          self._hue = hue % 360
          self.update()

      def set_current(self, color):
          self._current = color
          self.color_picked.emit(color)
          self.update()

      def paintEvent(self, event):
          painter = QPainter(self)
          painter.setRenderHint(QPainter.Antialiasing)

          from PySide6.QtCore import QRect
          w, h = self.width(), self.height()
          board_h = 200
          board_w = 200
          board_rect = QRect(10, 10, board_w, board_h)
          hue_rect = QRect(10, board_h + 25, board_w, 20)

          self._board_rect = board_rect
          self._hue_rect = hue_rect

          # 在这里补全：
          # 1. 画色板：用两个渐变叠加（横向白→透明，纵向透明→黑）叠在纯色相上
          #    提示：先 fillRect 纯色相，再画两个 QLinearGradient
          # 2. 画色相条：横向渐变，红→黄→绿→青→蓝→洋红→红
          # 3. 画当前选中色预览方块（右侧）

          painter.end()

      def mousePressEvent(self, event):
          self._handle_pos(event.position().toPoint())
          self._dragging = True
          super().mousePressEvent(event)

      def mouseMoveEvent(self, event):
          if getattr(self, '_dragging', False):
              self._handle_pos(event.position().toPoint())
          super().mouseMoveEvent(event)

      def mouseReleaseEvent(self, event):
          self._dragging = False
          super().mouseReleaseEvent(event)

      def _handle_pos(self, pos):
          # 在这里补全：判断点在色板还是色相条，计算颜色并发信号
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("颜色选择器")

  picker = ColorPicker()

  preview = QWidget()
  preview.setFixedSize(60, 60)
  hex_label = QLabel("#ff0000")

  def on_color(color):
      preview.setStyleSheet(f"background-color: {color.name()}; border-radius: 6px;")
      hex_label.setText(color.name())

  picker.color_picked.connect(on_color)
  on_color(picker._current)   # 初始化

  side = QVBoxLayout()
  side.addWidget(preview)
  side.addWidget(hex_label)

  main = QHBoxLayout(win)
  main.addWidget(picker)
  main.addLayout(side)
  win.resize(400, 320)
  win.show()
  app.exec()
checklist:
- 完全自绘色板（两个渐变叠加）和色相条
- 鼠标拖动色板能计算并实时更新颜色
- 鼠标拖动色相条能改变色相
- 发出 color_picked 信号，右侧预览和十六进制值同步更新
- 坐标判断正确（区分点在色板还是色相条）
- 程序正常显示并运行
```
