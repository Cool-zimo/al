# Chapter 3 Test: Custom Widgets

## Multiple Choice

```quiz
type: choice
q: Which is the highest-leverage way to customise a QPushButton that already covers 90% of your needs and only requires a small amount of extra behaviour?
options:
- Subclass QPushButton and add the extra behaviour
- Copy the QPushButton source and edit it
- Subclass QWidget and paint everything from scratch
- Wrap it in a QSortFilterProxyModel
answer: 0
explain: Subclassing reuses all existing behaviour and lets you add signals, properties, and a little extra logic. Copying source is wrong, full custom painting is far heavier than necessary, and a proxy model belongs to Model/View, not widget customisation.
```

```quiz
type: choice
q: Where must a custom signal be defined in a PySide6 widget?
options:
- As an instance attribute inside __init__
- As a class attribute in the class body using Signal()
- As a module-level function
- As an ordinary method named my_signal
answer: 1
explain: Signal() must be a class attribute in the class body. Defining it inside __init__ makes it an ordinary instance attribute rather than a Qt signal, which breaks connect() and emit().
```

```quiz
type: choice
q: Where should all drawing with QPainter take place?
options:
- Inside any event handler, so the drawing is immediate
- Inside paintEvent, after obtaining a QPainter on the widget
- In the constructor, before the widget is shown
- Inside a QTimer callback, to repaint continuously
answer: 1
explain: Qt paints only during paint events, and the widget is a valid paint device only then. Drawing elsewhere either fails immediately or produces non-persistent output that vanishes on the next repaint.
```

```quiz
type: choice
q: What is the difference between event() and eventFilter()?
options:
- event() monitors another widget's events; eventFilter() monitors this widget's own events
- event() is the entry point for this widget's own events; eventFilter() monitors another widget's events without subclassing it
- They are interchangeable synonyms
- eventFilter() returns False to intercept the event; event() returns True to let it through
answer: 1
explain: event() is the single entry point for events arriving at this widget, while eventFilter() (used with installEventFilter) lets any QObject observe another widget's events. Their return-value semantics are the reverse of the incorrect option: True means handled/intercepted, False means continue.
```

```quiz
type: choice
q: Which is required to receive keyboard events on a plain QWidget?
options:
- Calling setMouseTracking(True)
- Setting a focus policy with setFocusPolicy
- Overriding eventFilter
- Installing a QTimer
answer: 1
explain: Keyboard events are delivered only to the widget that currently holds focus. A plain QWidget defaults to NoFocus, so setFocusPolicy must be called. setMouseTracking controls mouse-move delivery, not keyboard input.
```

## Hands-On

```quiz
type: local
q: Build a RatingWidget by subclassing QWidget and painting from scratch. It displays five stars based on an internal integer rating from 0 to 5. Clicking on a star sets the rating to that star's position and emits a custom signal rating_changed(value). All drawing must happen inside paintEvent, and the rating must be clamped to the valid range. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import Qt, Signal
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import QWidget, QApplication

  class RatingWidget(QWidget):
      rating_changed = Signal(int)

      def __init__(self, parent=None):
          super().__init__(parent)
          self._rating = 0
          self.setMinimumSize(200, 40)

      def set_rating(self, value):
          # Complete here: clamp to 0..5, update, emit rating_changed, and trigger a repaint
          pass

      def mousePressEvent(self, event):
          # Complete here: figure out which star was clicked and call set_rating
          pass

      def paintEvent(self, event):
          # Complete here: draw five stars, filled for indexes below _rating, outlined otherwise
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Star Rating")

  stars = RatingWidget()
  stars.rating_changed.connect(lambda v: print(f"Rating changed to {v}"))

  from PySide6.QtWidgets import QVBoxLayout
  layout = QVBoxLayout(win)
  layout.addWidget(stars)
  win.resize(300, 100)
  win.show()
  app.exec()
checklist:
- rating_changed is defined as a class attribute Signal
- set_rating clamps the value to 0..5 and emits rating_changed
- Clicking a star position sets the rating correctly
- All drawing happens inside paintEvent
- Five stars render, with filled and outlined states distinguishing the rating
- The program displays and runs normally
```

```quiz
type: local
q: Build an EventSpy widget that draws a small status panel. Install an event filter on itself (or on a child button) to log every mouse press, release, and move, counting how many of each occurred and displaying those counts as text. Use a separate QObject subclass as the filter and keep a reference to it. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import Qt, QObject, QEvent
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import QWidget, QPushButton, QVBoxLayout, QApplication

  class EventCounter(QObject):
      def __init__(self, widget, parent=None):
          super().__init__(parent)
          self._widget = widget
          self.presses = 0
          self.releases = 0
          self.moves = 0

      def eventFilter(self, watched, event):
          # Complete here: count presses, releases, and moves, then return False
          return False

  class SpyPanel(QWidget):
      def __init__(self, parent=None):
          super().__init__(parent)
          self._counter = None
          self.setMinimumSize(300, 200)

      def set_counter(self, counter):
          self._counter = counter

      def paintEvent(self, event):
          # Complete here: draw the three counts as centered text
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Event Spy")

  panel = SpyPanel()
  button = QPushButton("Click and move me")

  counter = EventCounter(panel)
  panel.set_counter(counter)
  button.installEventFilter(counter)       # Filter installed on the button
  button.clicked.connect(lambda: panel.update())

  layout = QVBoxLayout(win)
  layout.addWidget(panel)
  layout.addWidget(button)
  win.resize(350, 300)
  win.show()
  app.exec()
checklist:
- EventCounter subclasses QObject and overrides eventFilter
- Press, release, and move events are counted correctly
- eventFilter returns False so events are not intercepted
- The panel's paintEvent displays the current counts
- A reference to the counter is kept (not a local variable only)
- The program displays and runs normally
```

## Mini Project

```quiz
type: local
q: Build a fully custom "battery indicator" widget by subclassing QWidget. It shows a battery outline with a filled level that follows an internal charge percentage (0..100), uses custom painting for the outline, terminals, and fill, supports drag-to-set and click-to-toggle-charging, emits charge_changed(value) and charging_changed(state) signals, and includes a small control panel with Start/Stop/Reset buttons driving a QTimer-based animation. This is a windowed program that cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  import math
  from PySide6.QtCore import Qt, Signal, QTimer
  from PySide6.QtGui import QPainter, QColor
  from PySide6.QtWidgets import (
      QWidget, QPushButton, QHBoxLayout, QVBoxLayout, QApplication
  )

  class BatteryWidget(QWidget):
      charge_changed = Signal(int)
      charging_changed = Signal(bool)

      def __init__(self, parent=None):
          super().__init__(parent)
          self._charge = 100          # 0..100
          self._charging = False
          self._timer = QTimer(self)
          self._timer.timeout.connect(self._tick)
          self.setMinimumSize(260, 140)
          self.setMouseTracking(True)

      def set_charge(self, value):
          # Complete here: clamp, update, emit charge_changed, and repaint
          pass

      def set_charging(self, charging):
          # Complete here: update state, emit charging_changed, and repaint
          pass

      def mousePressEvent(self, event):
          # Complete here: if clicked on the body, drag-set; if clicked on the terminal, toggle charging
          pass

      def mouseMoveEvent(self, event):
          # Complete here: if dragging, update charge from horizontal position
          super().mouseMoveEvent(event)

      def paintEvent(self, event):
          # Complete here: draw the battery outline, terminal, fill level, and percentage text
          pass

      def start(self, step=2, interval=80):
          self._step = step
          self._timer.start(interval)

      def stop(self):
          self._timer.stop()

      def reset(self):
          self.set_charge(0)

      def _tick(self):
          # Complete here: if charging, raise charge; if discharging, lower it; stop at the limits
          pass

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Battery Indicator")

  battery = BatteryWidget()
  battery.charge_changed.connect(lambda v: print(f"Charge: {v}%"))
  battery.charging_changed.connect(lambda s: print(f"Charging: {s}"))

  start_btn = QPushButton("Start")
  stop_btn = QPushButton("Stop")
  reset_btn = QPushButton("Reset")
  toggle_btn = QPushButton("Toggle Charging")

  start_btn.clicked.connect(lambda: battery.start())
  stop_btn.clicked.connect(battery.stop)
  reset_btn.clicked.connect(battery.reset)
  toggle_btn.clicked.connect(lambda: battery.set_charging(not battery._charging))

  h = QHBoxLayout()
  h.addWidget(start_btn)
  h.addWidget(stop_btn)
  h.addWidget(reset_btn)
  h.addWidget(toggle_btn)

  layout = QVBoxLayout(win)
  layout.addWidget(battery)
  layout.addLayout(h)
  win.resize(360, 300)
  win.show()
  app.exec()
checklist:
- The battery is drawn from scratch in paintEvent: outline, terminal, fill, and text
- The fill width is proportional to the charge percentage
- Clicking and dragging horizontally sets the charge
- Clicking the terminal toggles the charging state
- charge_changed and charging_changed signals are defined and emitted correctly
- The Start/Stop/Reset buttons drive a QTimer animation without creating timers in paintEvent
- The program displays and runs normally
```
