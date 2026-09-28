# Chapter 4 Test: Dialogs and Menus

## Part 1 · Multiple Choice

```quiz
type: choice
q: After the user clicks Cancel, what does QMessageBox.question return?
options:
- The string "No"
- QMessageBox.No
- False
- None
answer: 1
explain: The return value is the QMessageBox.StandardButton enum; clicking Cancel returns QMessageBox.No. Comparing it to the string "No" or to False will fail silently.
```

```quiz
type: choice
q: Which code correctly detects that the user clicked OK in a QInputDialog?
options:
- if text:
- if ok:
- if text == "":
- if result == True:
answer: 1
explain: QInputDialog's static methods return a (value, ok) tuple; ok is a boolean and must be checked. Checking text is unreliable because an empty string could also be what the user actually entered.
```

```quiz
type: choice
q: You open a custom QDialog with show() and immediately read its input. What happens?
options:
- You get back what the user typed
- You get empty values, because show() is non-blocking and execution has already moved on
- It raises a RuntimeError
- It blocks waiting for user input
answer: 1
explain: show() is modeless and returns immediately, so the main flow continues. The dialog has only just appeared and the user has not typed anything yet, so you read empty values. Use exec() for a modal block.
```

```quiz
type: choice
q: You want a menu bar, but your main window inherits QWidget and it errors at runtime. What is the correct fix?
options:
- Call addMenu on QWidget
- Change the base class to QMainWindow
- Use setLayout instead
- QWidget does have a menu bar; it is just hidden
answer: 1
explain: The menu bar, toolbar, and status bar are all capabilities of QMainWindow; QWidget has none of them. You must change the base class to QMainWindow to use menuBar().
```

```quiz
type: choice
q: You created a QAction and connected its triggered signal, but it does not appear in either the menu or the toolbar. What is the most likely cause?
options:
- You did not call action.triggered.connect
- You did not call menu.addAction(action) or toolbar.addAction(action)
- You did not call action.setIcon
- The QAction has no setObjectName
answer: 1
explain: A QAction is only a definition; you must explicitly addAction it to a menu or toolbar for it to appear. Missing the signal connection, icon, or objectName would not make it completely invisible.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "confirm delete" program: the main window has 3 QPushButton widgets labeled with the filenames "report.docx / data.csv / photo.jpg". Clicking any of them opens a QMessageBox.warning titled "Delete Confirmation" with the text "Are you sure you want to delete report.docx?" (changing with the clicked file). The dialog has Delete and Cancel buttons. After Delete, show "Deleted: xxx" on the QLabel; after Cancel, show "Cancelled". Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLabel, QVBoxLayout, QMessageBox
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Confirm Delete")
  window.resize(300, 220)

  label = QLabel("Please select a file to delete")
  files = ["report.docx", "data.csv", "photo.jpg"]

  # Complete the code here
  window.show()
  app.exec()
checklist:
- The three file buttons are displayed correctly
- Clicking a button opens a warning dialog whose text contains the matching filename
- The dialog has Delete and Cancel buttons
- After Delete, the QLabel shows "Deleted: xxx"
- After Cancel, the QLabel shows "Cancelled"
- The program displays and runs normally
```

```quiz
type: local
q: Build an "info entry" dialog: create InfoDialog as a QDialog subclass using QFormLayout to hold two QLineEdit fields (name, phone). Add "OK" and "Cancel" buttons. Override accept: the name must not be empty, the phone must be all digits (check with isdigit), and on failure show a QMessageBox.warning and return to keep the dialog open. The main window opens the dialog with a button; after confirmation, show "Entered: name - phone" on the QLabel. Read the data with exec(). Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QPushButton, QLabel, QVBoxLayout,
      QDialog, QLineEdit, QFormLayout, QHBoxLayout, QMessageBox
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Info Entry")
  window.resize(320, 200)

  label = QLabel("Click the button to enter info")
  btn = QPushButton("Enter info")

  # Complete the code here
  window.show()
  app.exec()
checklist:
- The custom QDialog uses QFormLayout with two input fields
- accept is overridden: name non-empty, phone all digits
- Failed validation shows a warning and keeps the dialog open
- After exec() confirms Accepted, the entered info is displayed
- The program displays and runs normally
```

## Part 3 · Mini-Project

```quiz
type: local
q: Build a "simple text editor" desktop app, combining everything from Chapter 4: inherit QMainWindow with a QTextEdit as the central widget. The menu bar has two menus — "File" (New, Open, Save, Quit) and "Edit" (Clear). The toolbar has three actions: "Open", "Save", and "New". The status bar shows "Ready" on the left and a QLabel on the right showing the character count (updating live as you type). Clicking "Open" uses QFileDialog.getOpenFileName to load a txt file (with an empty check); "Save" uses getSaveFileName to write it back (with an empty check); "New" uses QMessageBox.question for confirmation and only clears the editor after Yes. The three actions must be mounted in both the menu and the toolbar (define once, use everywhere). Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QMainWindow, QTextEdit, QMenuBar, QToolBar,
      QStatusBar, QLabel, QFileDialog, QMessageBox
  )
  from PySide6.QtGui import QAction

  class MainWindow(QMainWindow):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("Simple Text Editor")
          self.resize(550, 400)
          self.editor = QTextEdit()
          self.setCentralWidget(self.editor)

          # Complete the code here: define QAction, menu bar, toolbar, status bar
          self.editor.textChanged.connect(self.update_count)

      def update_count(self):
          pass

  app = QApplication(sys.argv)
  win = MainWindow()
  win.show()
  app.exec()
checklist:
- Inherits QMainWindow; central widget is a QTextEdit
- "File" and "Edit" menus with the specified actions
- Toolbar has "Open", "Save", and "New" actions
- All three QAction objects are mounted in both the menu and the toolbar
- Open and save both use QFileDialog with empty checks
- New uses QMessageBox.question for confirmation
- Status bar shows "Ready" on the left and the live character count on the right
- The program displays and runs normally
```
