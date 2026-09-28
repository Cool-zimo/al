# Chapter 1 · Signals and Slots · Big Test

> 8 questions. This chapter answers "how do widgets communicate" — signals and slots are Qt's core mechanism.
> **You must get all of them right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which code snippet causes the window to flash and close immediately?
options:
- app = QApplication(sys.argv); window = QWidget(); window.show(); app.exec()
- app = QApplication(sys.argv); window = QWidget(); window.show(); sys.exit(app.exec())
- app = QApplication(sys.argv); window = QWidget(); window.show()
- app = QApplication(sys.argv); window = QWidget(); app.exec(); window.show()
answer: 2
explain: Without app.exec(), the program exits right after show() — the event loop never starts and the window flashes by. show() only marks the window as visible; what actually keeps it on screen is the event loop started by app.exec().
```

```quiz
type: choice
q: What is the license difference between PySide6 and PyQt6?
options:
- PySide6 uses GPL, PyQt6 uses LGPL
- PySide6 uses LGPL, PyQt6 uses GPL
- Both use the MIT license
- Both use a commercial license
answer: 1
explain: PySide6 uses LGPLv3, allowing dynamic linking in closed-source commercial projects. PyQt6 uses GPLv3, requiring derivative works to be open-sourced. This is their biggest commercial-use difference.
```

```quiz
type: choice
q: How does signals-and-slots fundamentally differ from tkinter's command callback?
options:
- There is no difference — only the syntax changes
- A signal can connect to multiple slots (one-to-many), whereas command is one-to-one
- command is faster
- Signals cannot cross threads
answer: 1
explain: Qt's signal-slot is a loosely-coupled observer pattern: one signal can connect to multiple slot functions, and one slot can be connected to multiple signals. tkinter's command is a widget property that binds only one callback — a tightly-coupled one-to-one relationship.
```

```quiz
type: choice
q: Which code correctly connects a button's click signal?
options:
- button.clicked.connect = on_click
- button.clicked.connect(on_click)
- connect(button.clicked, on_click)
- button.connectSignal("clicked", on_click)
answer: 1
explain: In PySide6, signals are objects with a signal.connect(slot) method. You cannot assign to a signal (they're not overwritable), nor pass the signal name as a string.
```

```quiz
type: choice
q: What is the recommended way to pass extra arguments to a slot function?
options:
- def on_click(a, b): ... and connect directly
- Use lambda: button.clicked.connect(lambda: on_click(extra_arg))
- Use a global declaration
- Modify the PySide6 source code
answer: 1
explain: lambda is the most common way to pass arguments. Beware the closure trap: if a lambda in a loop references a loop variable, capture the current value with a default argument, e.g. lambda x=i: func(x).
```

---

## Part 2 · Hands-On

```quiz
type: local
q: Write a program: the window has a QLabel showing "Count: 0" and a QPushButton labeled "Click Me". Each click increments the count and updates the QLabel. Use signals and slots — no global variables (store the count in an instance attribute). Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QVBoxLayout

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Counter")
  window.resize(250, 150)

  # Complete here
  window.show()
  app.exec()
checklist:
- QLabel initially shows "Count: 0"
- QPushButton reads "Click Me"
- Each click increments the count and updates the label live
- Uses an instance attribute to store the count, no global variables
- Signal-slot connection via connect
- Program displays and runs correctly
```

```quiz
type: local
q: Define a custom Signal: create a Counter class inheriting from QObject that declares a Signal(int) called value_changed. Then write a slot function that, after connecting, emits the signal and prints the received value. Use a lambda to connect and pass an extra argument. Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtCore import QObject, Signal

  # Complete here
checklist:
- Custom Signal(int) declared as value_changed
- Counter inherits from QObject
- Calls emit to fire the signal
- Slot correctly receives and prints the value
- Uses lambda to pass an extra argument
- Program runs without errors
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Build a "Simple Event Bus" mini-project: the window has three QPushButtons (Red, Green, Blue) and a QWidget serving as a color panel. Clicking different buttons changes the panel's background color (using setStyleSheet). Also use a custom Signal(str) to pass the color name and have a QLabel display "Current color: XX". Requirement: the custom Signal must be defined in a QObject subclass; button clicks trigger emit, and the slot updates both the panel and label. Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLabel, QVBoxLayout, QHBoxLayout
  )
  from PySide6.QtCore import QObject, Signal

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Color Switcher")
  window.resize(300, 200)

  # Complete here
  window.show()
  app.exec()
checklist:
- Custom Signal(str) declared in a QObject subclass
- Three buttons (Red/Green/Blue) that trigger emit on click
- QWidget panel background changes with the selected button
- QLabel shows "Current color: XX"
- Signal-slot connections are correct
- Program displays and runs correctly
```
