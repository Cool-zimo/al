# Chapter 3 · Common Widgets · Big Test

> 8 questions. This chapter answers "what ready-made widgets does Qt provide, and how do you use them".
> **You must get all of them right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding QLabel and QPushButton, which statement is correct?
options:
- QLabel can only display plain text — it cannot display images
- QPushButton's clicked signal can connect to a custom slot function
- QLabel has no signals and cannot be used as an interactive widget
- QPushButton cannot have a keyboard shortcut set
answer: 1
explain: QPushButton.clicked is one of the most commonly used signals and can connect to any callable. QLabel, while mainly for display, supports rich text via setTextFormat and can display images via setPixmap. QPushButton supports setShortcut for keyboard shortcuts.
```

```quiz
type: choice
q: After QTextEdit is set to read-only mode, which signal can still fire?
options:
- textChanged
- cursorPositionChanged
- selectionChanged
- All three above can fire
answer: 3
explain: In read-only mode, QTextEdit's textChanged won't fire from user input (since it's not editable), but can fire when setPlainText modifies it via code. cursorPositionChanged and selectionChanged remain effective in read-only mode because the user can still select text and move the cursor.
```

```quiz
type: choice
q: Three radio buttons are placed on a window without being grouped. What happens when the user interacts with them?
options:
- Compile error
- The three buttons are mutually exclusive — only one can be selected
- Multiple may be selected simultaneously; behavior is unpredictable
- The program crashes
answer: 2
explain: Radio button互斥 depends on "same parent container's layout" or "same QButtonGroup". Scattered directly on the window without explicit grouping, behavior is unpredictable — they may all merge into one group, or act independently allowing multiple selections. QButtonGroup is the recommended explicit grouping approach.
```

```quiz
type: choice
q: Regarding QTableWidget, which line of code is REQUIRED, otherwise data won't display?
options:
- table.setRowCount(3)
- table.setColumnCount(3)
- table.setEditTriggers(QAbstractItemView.NoEditTriggers)
- table.horizontalHeader().setVisible(True)
answer: 1
explain: QTableWidget must first use setColumnCount to set the column count; otherwise data set via setItem won't display (and won't error). This is the most common beginner pitfall. setRowCount isn't required — you can dynamically add rows with insertRow.
```

```quiz
type: choice
q: To achieve the linked effect of "drag slider → spin box follows → progress bar follows", the core mechanism is?
options:
- Override paintEvent
- Signal-slot: connect the slider's valueChanged to spin.setValue and bar.setValue
- Poll with QTimer
- Subclass QSlider and override mouseMoveEvent
answer: 1
explain: This is exactly the classic signal-slot use case. The slider's valueChanged(int) signal connects to QSpinBox.setValue and QProgressBar.setValue, triggering multiple linked updates from one signal — clean and elegant code.
```

---

## Part 2 · Hands-On

```quiz
type: local
q: Build an "Information Entry" interface: a QLabel title "User Info", a QFormLayout with QLineEdit (Name), QSpinBox (Age, 0~120), QComboBox (City: Beijing/Shanghai/Guangzhou/Shenzhen), and QCheckBox (Subscribe to notifications). A QLabel below实时 displays a summary (e.g. "Alice, 25, Beijing, Subscribed"). All widget changes update the summary. Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QLineEdit, QSpinBox,
      QComboBox, QCheckBox, QVBoxLayout, QFormLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Information Entry")
  window.resize(300, 250)

  # Complete here
  window.show()
  app.exec()
checklist:
- QFormLayout form (label + widget pairs)
- QLineEdit for name input
- QSpinBox for age (0~120)
- QComboBox for city (at least 4 items)
- QCheckBox for subscribe-to-notifications
- QLabel实时 displays the summary
- Program displays and runs correctly
```

```quiz
type: local
q: Build a "Task Progress" interface: QSlider (0~100) + QSpinBox (0~100) linked together, QProgressBar showing progress. Add a QCheckBox "Show Percentage" — when checked, the progress bar format is "%p%"; when unchecked, the format is an empty string (no text shown). Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QSlider, QSpinBox,
      QProgressBar, QCheckBox, QVBoxLayout
  )
  from PySide6.QtCore import Qt

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Task Progress")
  window.resize(300, 180)

  # Complete here
  window.show()
  app.exec()
checklist:
- QSlider + QSpinBox linked (0~100)
- QProgressBar shows progress
- QCheckBox controls whether progress bar text is shown/hidden
- When checked, shows "%p%"; when unchecked, hides text
- Program displays and runs correctly
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Build a "Mini Notebook" application: a QTextEdit above for editing text, a QLineEdit below for entering a filename, and two buttons "Save" and "Clear". On the right, a QListWidget displays the list of saved filenames (simulated — just addItem to add filenames). Clicking a filename in the list displays the corresponding content in QTextEdit (use a dict to simulate storage). Saving stores the QTextEdit content in the dict and adds the filename to QListWidget. Clear empties the editor. Note: this is a GUI program and cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QTextEdit, QLineEdit,
      QPushButton, QListWidget, QVBoxLayout, QHBoxLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Mini Notebook")
  window.resize(500, 400)

  # Complete here
  window.show()
  app.exec()
checklist:
- QTextEdit editor + QLineEdit for filename input
- "Save": stores content in dict + adds filename to QListWidget
- "Clear": empties the QTextEdit
- QListWidget click loads the corresponding content into QTextEdit
- Uses a dict to simulate file storage
- Program displays and runs correctly
```
