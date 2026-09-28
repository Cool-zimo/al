# Chapter 2 · Layout Management · Big Test

> 8 questions. This chapter answers "how do widgets arrange themselves to look good and adapt".
> **You must get all of them right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding setGeometry absolute positioning, which problem can it NOT solve?
options:
- Widgets don't follow when the window is resized
- Widget positions are wrong at different resolutions
- Layout is misaligned after DPI scaling
- There is spacing between widgets
answer: 3
explain: setGeometry hard-codes a widget's position and size, so window resizing, resolution changes, and DPI scaling all cause layout issues. Spacing between widgets can be set with setGeometry (by manually calculating coordinates), so that's not something it "can't solve".
```

```quiz
type: choice
q: Using QVBoxLayout with addStretch as shown below, how will the three buttons be arranged?
layout = QVBoxLayout()
layout.addWidget(btn1)
layout.addStretch()
layout.addWidget(btn2)
layout.addWidget(btn3)
options:
- The three buttons are evenly distributed with elastic space in the middle
- btn1 is at the very top; btn2 and btn3 are crammed at the bottom
- The three buttons are equally spaced
- btn2 and btn3 are at the top; btn1 is at the bottom
answer: 1
explain: addStretch() inserts a stretchy blank that absorbs all extra vertical space. So btn1 sits flush at the top, the stretch eats all the space in the middle, and btn2 and btn3 are pushed to the bottom, hugging each other.
```

```quiz
type: choice
q: In QGridLayout, what do the parameters of addWidget(widget, row, column, rowSpan, columnSpan) mean?
options:
- (widget, column, row, column span, row span)
- (widget, row, column, row span, column span)
- (widget, row, column, minimum width, minimum height)
- (widget, x coordinate, y coordinate, width, height)
answer: 1
explain: QGridLayout.addWidget's first two parameters are row and column (zero-indexed), and the last two are rowSpan (how many rows to span) and columnSpan (how many columns to span). For example, addWidget(w, 0, 0, 2, 1) means place at row 0 col 0, spanning 2 rows and 1 column.
```

```quiz
type: choice
q: What scenario is QFormLayout best suited for?
options:
- Grid-shaped data tables
- Form-style "label + input widget" paired arrangement
- A freeform drag-and-drop canvas
- Tab switching
answer: 1
explain: QFormLayout is purpose-built for form layouts. Each row has a QLabel on the left and an input widget (QLineEdit, QSpinBox, etc.) on the right, auto-aligned. It's far more convenient than manually building forms with QGridLayout.
```

```quiz
type: choice
q: Regarding sizePolicy and setStretch, which statement is correct?
options:
- sizePolicy controls a widget's stretch priority within a layout; setStretch controls the proportional weight
- sizePolicy and setStretch are exactly the same thing
- setStretch can only be used with QVBoxLayout
- sizePolicy can only be modified at runtime
answer: 0
explain: QSizePolicy describes a widget's attitude toward space (e.g. Expanding, Fixed, Preferred), determining whether it's willing to stretch. setStretch sets the stretch ratio for widgets in a layout — e.g. a 1:2 ratio means the two widgets split the extra space 1:2. They work together.
```

---

## Part 2 · Hands-On

```quiz
type: local
q: Use QVBoxLayout + addStretch to build a "top toolbar" layout: three buttons (New, Open, Save) horizontally arranged at the top of the window, and a QTextEdit below filling the remaining space. The button area should stay at the top, and the editor should fill all the space below. Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QTextEdit, QVBoxLayout, QHBoxLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Editor")
  window.resize(400, 300)

  # Complete here
  window.show()
  app.exec()
checklist:
- Three buttons (New/Open/Save) horizontally arranged at the top
- Uses QVBoxLayout + addStretch to keep the button area at the top
- QTextEdit fills the remaining space below
- Editor adapts when the window is resized
- Program displays and runs correctly
```

```quiz
type: local
q: Use QGridLayout to build a simple calculator interface: digits 0-9 arranged in a 3x3 grid, with "Clear" and "=" on row 4 ("Clear" spanning 2 columns, "=" in the remaining space). Also place a QLineEdit on row 0 spanning all 3 columns as the display. Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLineEdit, QGridLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Calculator")
  window.resize(250, 300)

  # Complete here
  window.show()
  app.exec()
checklist:
- QLineEdit on row 0 spanning 3 columns
- Digits 0-9 arranged in the grid (at least laid out reasonably)
- "Clear" button spans 2 columns
- "=" button in the appropriate position
- Uses QGridLayout's addWidget with rowSpan/columnSpan
- Program displays and runs correctly
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Build a "Login Window": use QFormLayout for the form area (Username QLineEdit + Password QLineEdit + Remember Me QCheckBox), add a title QLabel at the top, and use QHBoxLayout at the bottom for "Cancel" and "Login" buttons (Login on the right, via addStretch). Wrap the outermost layer with QVBoxLayout. The password field should be in password mode (setEchoMode). Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QLineEdit, QCheckBox,
      QPushButton, QVBoxLayout, QHBoxLayout, QFormLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Login")
  window.resize(300, 200)

  # Complete here
  window.show()
  app.exec()
checklist:
- Uses QFormLayout for the form (label + input widget pairs)
- Password field has setEchoMode set to Password
- Has a "Remember Me" QCheckBox
- "Cancel" and "Login" buttons use QHBoxLayout + addStretch to right-align Login
- Title QLabel at the very top
- Outermost layer nests everything with QVBoxLayout
- Program displays and runs correctly
```
