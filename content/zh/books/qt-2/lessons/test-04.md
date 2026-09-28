# 第 4 章章测：绘图

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 paintEvent 与 QPainter，下列说法正确的是？
options:
- 可以在 __init__ 里创建 QPainter(self) 预先画好背景
- 所有绘制代码都应写在 paintEvent 里，其他地方只改数据并调用 update()
- paintEvent 只在窗口第一次显示时触发一次
- QPainter 在任意时刻创建都可以，Qt 会自动排队等待窗口就绪
answer: 1
explain: 绘制只能在 paintEvent 里进行；__init__ 时窗口尚未就绪；paintEvent 在遮挡重现、resize、update 时都会触发。
```

```quiz
type: choice
q: 关于 QPen 与 QBrush 的作用，下列说法正确的是？
options:
- QPen 负责填充闭合图形的内部
- QBrush 负责线条的颜色、粗细和线型
- QPen 负责描边（边框、线条），QBrush 负责填充
- QPen 和 QBrush 功能完全一样，可以互相替代
answer: 2
explain: QPen 管描边，QBrush 管填充，分工明确。
```

```quiz
type: choice
q: 开启 QPainter.RenderHint.Antialiasing 的主要目的是？
options:
- 让文字字体变大
- 让斜线和圆的边缘更平滑，减少锯齿
- 加快绘制速度
- 让颜色更鲜艳
answer: 1
explain: 抗锯齿通过边缘羽化让斜线和圆形更平滑，代价是略多的计算开销。
```

```quiz
type: choice
q: 关于 save() 与 restore() 的使用，下列说法正确的是？
options:
- save 和 restore 可以不配对，Qt 会自动清理
- 在循环里反复 rotate 而不 restore，会导致旋转角度叠加
- restore 可以恢复到任意历史存档，支持随机跳转
- 一个 QPainter 只能 save 一次
answer: 1
explain: 变换是叠加的，循环里 rotate 不恢复会累加；save/restore 必须配对且是栈式后进先出。
```

```quiz
type: choice
q: QPainter.drawArc 的角度参数单位是？
options:
- 弧度
- 度
- 十六分之一度
- 像素
answer: 2
explain: Qt 的 drawArc/drawPie 角度单位是 1/16 度，270° 需写成 270*16。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个 QWidget，画一个"同心圆进度环"：三个同心圆，半径分别是 30、60、90，每个圆都是"圆环"而不是实心圆（用 drawEllipse 画圆后，再用背景色画一个更小的同心实心圆挖空中心），颜色分别是红、绿、蓝。要求：① 开启抗锯齿；② 三个圆的中心都固定在窗口中心（用 width()/height() 计算）；③ 每个圆环的宽度为 12。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import QApplication, QWidget
  from PySide6.QtCore import Qt, QRect
  from PySide6.QtGui import QPainter, QPen, QBrush, QColor

  COLORS = [Qt.GlobalColor.red, Qt.GlobalColor.green, Qt.GlobalColor.blue]

  class RingDemo(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("同心圆进度环")
          self.resize(320, 320)

      def paintEvent(self, event):
          p = QPainter(self)
          p.setRenderHint(QPainter.RenderHint.Antialiasing)
          cx, cy = self.width() // 2, self.height() // 2
          radii = [30, 60, 90]
          # 在这里画三个圆环：
          # 每个半径 r：画外圆（彩色，粗笔宽 12），再画内圆（背景色，挖空）
          pass

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = RingDemo()
      w.show()
      app.exec()
checklist:
- 开启抗锯齿
- 三个同心圆半径分别为 30/60/90
- 中心固定在窗口中心
- 每个圆环用粗笔宽画圆再挖空中心
- 三个圆环颜色分别为红/绿/蓝
- 圆环宽度约 12
- 程序正常显示
```

```quiz
type: local
q: 写一个窗口，画一个"时钟表盘"：外圈一个圆角矩形作为表盘底色（浅黄填充、棕色描边），中心一个圆点（径向渐变），12 根刻度线（长线代表整点，短的在中途），以及一根当前时间的时针（短、粗）和分针（长、细）。提示：用 QTimer 每秒刷新一次；用 Python 标准库 datetime 取当前时/分；刻度用 rotate 循环；时针角度 = (小时 % 12 + 分/60) * 30°，分针角度 = 分 * 6°。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys, math
  from datetime import datetime
  from PySide6.QtWidgets import QApplication, QWidget
  from PySide6.QtCore import Qt, QTimer, QRect, QPointF
  from PySide6.QtGui import QPainter, QPen, QBrush, QColor, QRadialGradient

  class Clock(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("时钟")
          self.resize(320, 320)
          t = QTimer(self)
          t.timeout.connect(self.update)
          t.start(1000)

      def paintEvent(self, event):
          p = QPainter(self)
          p.setRenderHint(QPainter.RenderHint.Antialiasing)
          cx, cy = self.width() // 2, self.height() // 2
          r = min(cx, cy) - 30

          # 表盘底色（圆角矩形或圆形）
          p.setBrush(QBrush(QColor(255, 250, 220)))
          p.setPen(QPen(QColor(120, 80, 40), 3))
          p.drawEllipse(QRect(cx - r, cy - r, r * 2, r * 2))

          # 刻度线（12 根）
          p.save()
          p.translate(cx, cy)
          for i in range(12):
              p.save()
              p.rotate(i * 30)
              is_hour = (i % 3 == 0)
              p.setPen(QPen(QColor(80, 60, 40), 3 if is_hour else 1))
              p.drawLine(r - (16 if is_hour else 8), 0, r, 0)
              p.restore()
          p.restore()

          # 中心圆
          rad = QRadialGradient(cx, cy, 12, cx - 4, cy - 4)
          rad.setColorAt(0.0, QColor(255, 255, 255))
          rad.setColorAt(1.0, QColor(150, 150, 150))
          p.setBrush(QBrush(rad))
          p.setPen(Qt.PenStyle.NoPen)
          p.drawEllipse(QRect(cx - 8, cy - 8, 16, 16))

          # 时针与分针
          now = datetime.now()
          hour_angle = (now.hour % 12 + now.minute / 60) * 30
          minute_angle = now.minute * 6
          # 在这里画时针（粗短）、分针（细长）
          pass

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = Clock()
      w.show()
      app.exec()
checklist:
- 表盘为圆形（浅黄填充、棕色描边）
- 12 根刻度线均匀分布（每 30° 一根）
- 整点刻度更长/更粗以作区分
- 中心圆用径向渐变
- 时针角度计算正确（含分钟补偿）
- 分针角度计算正确
- 时针比分针更短更粗
- 用 QTimer 每秒刷新
- 程序正常显示并实时走时
```

## 第三部分 · 小项目

```quiz
type: local
q: 做一个"自定义进度仪表盘"小项目：界面左侧是一个圆形仪表盘（继承自 QWidget），显示 0~100 的数值——有彩色弧（绿→黄→红）、刻度线、指针、中心值和单位；右侧是一个 QSlider（0~100）和一个 QSpinBox（0~100），二者双向联动并同步更新仪表盘。额外加分项：① 指针末端带一个小圆点装饰；② 数值超过 80 时弧线变红色强调；③ 窗口缩放时仪表盘等比缩放。提示：双向联动要防止信号循环——在槽函数里用 blockSignals 临时阻断；仪表盘尺寸用 min(width,height) 等比计算。注意：这是窗口程序，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys
  from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                                QSlider, QSpinBox, QLabel)
  from PySide6.QtCore import Qt, QRect, QPointF
  from PySide6.QtGui import (QPainter, QPen, QBrush, QColor, QFont,
                           QRadialGradient, QConicalGradient)

  class Dashboard(QWidget):
      def __init__(self, parent=None):
          super().__init__(parent)
          self.setMinimumSize(260, 260)
          self._value = 0
          self._unit = "%"

      def set_value(self, v):
          v = max(0, min(100, v))
          if v != self._value:
              self._value = v
              self.update()

      def paintEvent(self, event):
          p = QPainter(self)
          p.setRenderHint(QPainter.RenderHint.Antialiasing)
          side = min(self.width(), self.height())
          rect = QRect(0, 0, side, side)
          rect.adjust(20, 20, -20, -20)
          cx, cy = rect.center().x(), rect.center().y()
          r = rect.width() // 2

          # 背景弧
          p.setPen(QPen(QColor(230, 230, 230), 16,
                        Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
          p.drawArc(rect.adjusted(8, 8, -8, -8), 225 * 16, -270 * 16)

          # 进度弧（>80 红色，否则绿-黄-红渐变）
          ratio = self._value / 100
          span = int(270 * ratio)
          if self._value > 80:
              p.setPen(QPen(QColor(255, 60, 60), 16,
                            Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
              p.drawArc(rect.adjusted(8, 8, -8, -8), 225 * 16, -span * 16)
          else:
              grad = QConicalGradient(cx, cy, 225)
              grad.setColorAt(0.0, QColor(0, 200, 100))
              grad.setColorAt(0.5, QColor(255, 200, 0))
              grad.setColorAt(1.0, QColor(255, 60, 60))
              p.setPen(QPen(QBrush(grad), 16,
                            Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
              p.drawArc(rect.adjusted(8, 8, -8, -8), 225 * 16, -span * 16)

          # 刻度线
          p.save()
          p.translate(cx, cy)
          for i in range(11):
              p.save()
              p.rotate(225 + i * 27)
              p.setPen(QPen(QColor(120, 120, 120), 2))
              p.drawLine(r - 6, 0, r + 8, 0)
              p.restore()
          p.restore()

          # 指针
          p.save()
          p.translate(cx, cy)
          p.rotate(225 + 270 * ratio)
          p.setBrush(QBrush(QColor(60, 60, 60)))
          p.setPen(Qt.PenStyle.NoPen)
          p.drawPolygon([QPointF(-6, 0), QPointF(0, -(r - 22)),
                         QPointF(6, 0), QPointF(0, 14)])
          # 指针末端小圆点装饰
          p.setBrush(QBrush(QColor(255, 100, 100)))
          p.drawEllipse(QRect(-4, -(r - 22) - 4, 8, 8))
          p.restore()

          # 中心圆
          rad = QRadialGradient(cx, cy, 22, cx - 6, cy - 6)
          rad.setColorAt(0.0, QColor(255, 255, 255))
          rad.setColorAt(1.0, QColor(200, 200, 200))
          p.setBrush(QBrush(rad))
          p.setPen(QPen(QColor(160, 160, 160), 1))
          p.drawEllipse(QRect(cx - 12, cy - 12, 24, 24))

          # 数值 + 单位
          p.setPen(QPen(QColor(40, 40, 40)))
          p.setFont(QFont("Sans", 26, QFont.Weight.Bold))
          p.drawText(rect.adjusted(0, r // 2, 0, 0),
                     Qt.AlignmentFlag.AlignCenter, str(self._value))
          p.setFont(QFont("Sans", 12))
          p.drawText(rect.adjusted(0, r // 2 + 30, 0, 0),
                     Qt.AlignmentFlag.AlignCenter, self._unit)

  class MainWindow(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("自定义进度仪表盘")
          self.resize(600, 400)

          self.dash = Dashboard()
          self.slider = QSlider(Qt.Orientation.Horizontal)
          self.slider.setRange(0, 100)
          self.slider.setValue(68)
          self.spin = QSpinBox()
          self.spin.setRange(0, 100)
          self.spin.setValue(68)

          # 双向联动：slider <-> spin <-> dash
          # 用 blockSignals 防止信号循环
          self.slider.valueChanged.connect(self._on_slider)
          self.spin.valueChanged.connect(self._on_spin)

          ctrl = QVBoxLayout()
          ctrl.addWidget(QLabel("拖动滑块或输入数值："))
          ctrl.addWidget(self.slider)
          h = QHBoxLayout()
          h.addWidget(QLabel("精确值:"))
          h.addWidget(self.spin)
          ctrl.addLayout(h)

          layout = QHBoxLayout(self)
          layout.addWidget(self.dash)
          layout.addLayout(ctrl)

          self.dash.set_value(68)

      def _on_slider(self, v):
          self.spin.blockSignals(True)
          self.spin.setValue(v)
          self.spin.blockSignals(False)
          self.dash.set_value(v)

      def _on_spin(self, v):
          self.slider.blockSignals(True)
          self.slider.setValue(v)
          self.slider.blockSignals(False)
          self.dash.set_value(v)

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = MainWindow()
      w.show()
      app.exec()
checklist:
- Dashboard 是独立 QWidget 子类，paintEvent 完整绘制
- 彩色弧（绿-黄-红渐变或 >80 变红）
- 11 根刻度线均匀分布
- 指针旋转正确并带末端小圆点装饰
- 中心径向渐变圆 + 数值 + 单位显示
- 窗口缩放时仪表盘等比缩放（用 min(width,height)）
- Slider 与 SpinBox 双向联动
- 使用 blockSignals 防止信号循环
- 数值变化仪表盘实时更新
- 程序正常显示并交互流畅
```
