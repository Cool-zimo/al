# Chapter 4 Test: Drawing

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding paintEvent and QPainter, which statement is correct?
options:
- You can create QPainter(self) in __init__ to pre-draw the background
- All drawing code belongs in paintEvent; everywhere else only changes data and calls update()
- paintEvent fires exactly once, when the window is first shown
- A QPainter can be created at any time; Qt queues it automatically until the window is ready
answer: 1
explain: Drawing only happens inside paintEvent; the window is not ready in __init__; paintEvent also fires on expose, resize and update.
```

```quiz
type: choice
q: Regarding the roles of QPen and QBrush, which statement is correct?
options:
- QPen fills the inside of closed shapes
- QBrush controls the colour, thickness and style of lines
- QPen draws the outline (border, lines) and QBrush fills the interior
- QPen and QBrush are interchangeable
answer: 2
explain: QPen handles the outline; QBrush handles the fill. Their responsibilities are distinct.
```

```quiz
type: choice
q: The main purpose of enabling QPainter.RenderHint.Antialiasing is:
options:
- To make the font larger
- To smooth the edges of diagonal lines and circles, reducing jaggies
- To speed up drawing
- To make colours more vivid
answer: 1
explain: Antialiasing softens edges by blending them, at the cost of a little extra computation.
```

```quiz
type: choice
q: Regarding the use of save() and restore(), which statement is correct?
options:
- save and restore do not need to be paired; Qt cleans up automatically
- Repeating rotate in a loop without restore causes the rotation angles to accumulate
- restore can jump to any earlier saved state at random
- A QPainter can only save once
answer: 1
explain: Transforms accumulate, so rotate in a loop without restore keeps adding up; save/restore must be paired and act as a stack (LIFO).
```

```quiz
type: choice
q: What unit does QPainter.drawArc use for its angle parameter?
options:
- Radians
- Degrees
- One-sixteenth of a degree
- Pixels
answer: 2
explain: Qt's drawArc/drawPie angles use 1/16 of a degree, so 270° must be written as 270*16.
```

## Part 2 · Hands-On

```quiz
type: local
q: Write a QWidget that draws three concentric "rings": circles with radii 30, 60 and 90, each rendered as a ring rather than a filled disc (draw an outer circle in colour with a thick pen, then draw a smaller filled circle in the background colour to hollow out the centre). The three colours are red, green and blue. Requirements: (1) enable antialiasing; (2) the centre of all three circles is fixed at the window centre, calculated from width()/height(); (3) each ring has a width of 12. Note: A window can't open inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import QApplication, QWidget
  from PySide6.QtCore import Qt, QRect
  from PySide6.QtGui import QPainter, QPen, QBrush, QColor

  COLORS = [Qt.GlobalColor.red, Qt.GlobalColor.green, Qt.GlobalColor.blue]

  class RingDemo(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("Concentric rings")
          self.resize(320, 320)

      def paintEvent(self, event):
          p = QPainter(self)
          p.setRenderHint(QPainter.RenderHint.Antialiasing)
          cx, cy = self.width() // 2, self.height() // 2
          radii = [30, 60, 90]
          # Draw the three rings:
          # for each radius r, draw the outer circle (coloured, thick pen width 12)
          # then draw the inner circle (background colour) to hollow out the centre
          pass

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = RingDemo()
      w.show()
      app.exec()
checklist:
- Antialiasing is enabled
- The three radii are 30, 60 and 90
- The centre is fixed at the window centre
- Each ring is drawn as an outer circle with a thick pen then hollowed out
- The three rings are red, green and blue
- Each ring is about 12 units wide
- The window opens and renders correctly
```

```quiz
type: local
q: Build a window that draws a clock face: a rounded-rectangle or circular dial background (light yellow fill, brown outline), a centre dot with a radial gradient, 12 tick marks (longer marks for the hour positions, shorter ones in between), and a short thick hour hand plus a long thin minute hand. Use QTimer to refresh once per second, and Python's datetime to read the current hour and minute. Hint: ticks rotate in a loop; hour angle = (hour % 12 + minute/60) * 30°, minute angle = minute * 6°. Note: A window can't open inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys, math
  from datetime import datetime
  from PySide6.QtWidgets import QApplication, QWidget
  from PySide6.QtCore import Qt, QTimer, QRect, QPointF
  from PySide6.QtGui import QPainter, QPen, QBrush, QColor, QRadialGradient

  class Clock(QWidget):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("Clock")
          self.resize(320, 320)
          t = QTimer(self)
          t.timeout.connect(self.update)
          t.start(1000)

      def paintEvent(self, event):
          p = QPainter(self)
          p.setRenderHint(QPainter.RenderHint.Antialiasing)
          cx, cy = self.width() // 2, self.height() // 2
          r = min(cx, cy) - 30

          # Dial background (rounded rect or circle)
          p.setBrush(QBrush(QColor(255, 250, 220)))
          p.setPen(QPen(QColor(120, 80, 40), 3))
          p.drawEllipse(QRect(cx - r, cy - r, r * 2, r * 2))

          # 12 tick marks
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

          # Centre dot with a radial gradient
          rad = QRadialGradient(cx, cy, 12, cx - 4, cy - 4)
          rad.setColorAt(0.0, QColor(255, 255, 255))
          rad.setColorAt(1.0, QColor(150, 150, 150))
          p.setBrush(QBrush(rad))
          p.setPen(Qt.PenStyle.NoPen)
          p.drawEllipse(QRect(cx - 8, cy - 8, 16, 16))

          # Hour and minute hands
          now = datetime.now()
          hour_angle = (now.hour % 12 + now.minute / 60) * 30
          minute_angle = now.minute * 6
          # Draw the short thick hour hand and the long thin minute hand here
          pass

  if __name__ == "__main__":
      app = QApplication(sys.argv)
      w = Clock()
      w.show()
      app.exec()
checklist:
- The dial is circular (light yellow fill, brown outline)
- 12 tick marks are evenly spaced (one every 30°)
- Hour ticks are longer and/or thicker to stand out
- The centre dot uses a radial gradient
- The hour-hand angle is calculated correctly (with minute compensation)
- The minute-hand angle is calculated correctly
- The hour hand is shorter and thicker than the minute hand
- QTimer refreshes once per second
- The window opens and the clock runs in real time
```

## Part 3 · Mini-Project

```quiz
type: local
q: Build a "custom progress dashboard" mini-project: on the left is a circular dashboard (a QWidget subclass) showing a value from 0 to 100, with a coloured arc (green to yellow to red), tick marks, a pointer, a centre value and a unit. On the right are a QSlider (0-100) and a QSpinBox (0-100) that update each other in both directions and drive the dashboard. Bonus: (1) a small decorative dot at the tip of the pointer; (2) the arc turns red for emphasis when the value exceeds 80; (3) the dashboard scales proportionally as the window resizes. Hint: to prevent signal loops in the two-way binding, use blockSignals temporarily inside the slot; compute the dashboard size from min(width, height). Note: A window can't open inside a web page — click "Open in VS Code" to run it.
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

          # Background arc
          p.setPen(QPen(QColor(230, 230, 230), 16,
                        Qt.PenStyle.SolidLine, Qt.PenCapStyle.RoundCap))
          p.drawArc(rect.adjusted(8, 8, -8, -8), 225 * 16, -270 * 16)

          # Progress arc (>80 turns red, otherwise green-yellow-red gradient)
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

          # Tick marks
          p.save()
          p.translate(cx, cy)
          for i in range(11):
              p.save()
              p.rotate(225 + i * 27)
              p.setPen(QPen(QColor(120, 120, 120), 2))
              p.drawLine(r - 6, 0, r + 8, 0)
              p.restore()
          p.restore()

          # Pointer
          p.save()
          p.translate(cx, cy)
          p.rotate(225 + 270 * ratio)
          p.setBrush(QBrush(QColor(60, 60, 60)))
          p.setPen(Qt.PenStyle.NoPen)
          p.drawPolygon([QPointF(-6, 0), QPointF(0, -(r - 22)),
                         QPointF(6, 0), QPointF(0, 14)])
          # Decorative dot at the tip of the pointer
          p.setBrush(QBrush(QColor(255, 100, 100)))
          p.drawEllipse(QRect(-4, -(r - 22) - 4, 8, 8))
          p.restore()

          # Centre circle
          rad = QRadialGradient(cx, cy, 22, cx - 6, cy - 6)
          rad.setColorAt(0.0, QColor(255, 255, 255))
          rad.setColorAt(1.0, QColor(200, 200, 200))
          p.setBrush(QBrush(rad))
          p.setPen(QPen(QColor(160, 160, 160), 1))
          p.drawEllipse(QRect(cx - 12, cy - 12, 24, 24))

          # Value + unit
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
          self.setWindowTitle("Custom progress dashboard")
          self.resize(600, 400)

          self.dash = Dashboard()
          self.slider = QSlider(Qt.Orientation.Horizontal)
          self.slider.setRange(0, 100)
          self.slider.setValue(68)
          self.spin = QSpinBox()
          self.spin.setRange(0, 100)
          self.spin.setValue(68)

          # Two-way binding: slider <-> spin <-> dash
          # blockSignals prevents signal loops
          self.slider.valueChanged.connect(self._on_slider)
          self.spin.valueChanged.connect(self._on_spin)

          ctrl = QVBoxLayout()
          ctrl.addWidget(QLabel("Drag the slider or type a value:"))
          ctrl.addWidget(self.slider)
          h = QHBoxLayout()
          h.addWidget(QLabel("Exact value:"))
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
- Dashboard is a standalone QWidget subclass with a complete paintEvent
- Coloured arc (green-yellow-red gradient, or red past 80)
- 11 evenly spaced tick marks
- Pointer rotates correctly and has a decorative dot at its tip
- Centre radial-gradient circle plus value and unit
- The dashboard scales proportionally with the window (using min(width, height))
- Slider and SpinBox are two-way bound
- blockSignals is used to prevent signal loops
- The dashboard updates live as the value changes
- The window opens and interaction is smooth
```
