# Chapter 5 Test: Styling and Resources

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding the differences between QSS and CSS, which statement is correct?
options:
- QSS fully supports flex layout and grid layout
- QSS accesses sub-controls with ::, e.g. QComboBox::drop-down
- QSS pseudo-states use the :: prefix, e.g. QPushButton::hover
- In QSS, properties can be assigned with =, e.g. background-color = red
answer: 1
explain: QSS uniquely has sub-controls, accessed with ::, such as QComboBox::drop-down and QCheckBox::indicator. Pseudo-states use the : prefix; QSS does not support flex/grid; properties must use : and end with ;, never =.
```

```quiz
type: choice
q: In QSS, how do you make an input's border turn blue on focus without the text jittering?
options:
- Increase the padding by 1px when the border becomes 2px
- Decrease the padding by 1px to compensate when the border becomes 2px
- Set border-radius to 0
- Hide the border on focus
answer: 1
explain: Going from 1px to 2px takes 1px of interior space and shifts the text, so the padding must shrink by 1px to compensate. Alternatively, outline does not take layout space. Increasing padding makes the text more cramped.
```

```quiz
type: choice
q: You added a new icon new.png to resources.qrc, but at runtime QIcon(":/icons/new.png") is blank. Which step did you most likely skip?
options:
- You did not restart the computer
- You did not re-run pyrcc6 resources.qrc -o resources_rc.py
- You did not copy new.png into the Python installation directory
- You did not pass a parent to QIcon
answer: 1
explain: The qrc is a source file; the program actually reads the compiled output resources_rc.py. After adding a resource you must re-run pyrcc6, or the new resource will not exist in the old _rc.py.
```

```quiz
type: choice
q: Regarding QIcon's multi-resolution mechanism, which statement is correct?
options:
- QIcon can hold only one image
- After registering several sizes with addFile, Qt automatically picks the most suitable image for the display
- You must detect the DPI yourself and switch icons manually; Qt will not choose
- A blurry icon is fixed by restarting the program
answer: 1
explain: QIcon supports registering multiple images at different sizes, and Qt automatically picks the most suitable one at different DPIs. You do not need to detect DPI manually, and a blurry icon is usually caused by missing 2x images — restarting will not help.
```

```quiz
type: choice
q: When switching themes, which object should you set the QSS on so that every control (QPushButton, QLineEdit, etc.) changes together?
options:
- Only the main window window
- The app, i.e. app.setStyleSheet
- Just the QPushButton
- QSS takes effect globally on its own; you do not need to set it on any object
answer: 1
explain: Use app.setStyleSheet for a global effect so it covers every control. Setting it on window only leaves many controls behind, and QSS does not apply globally on its own.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "styled login card": the window background is #ecf0f1, with a white QFrame in the center (objectName "card") — 1px gray border, 12px rounded corners, white background, 24px padding. Inside the card, top to bottom: a QLabel title "Welcome back" (24px bold #2c3e50), an account QLineEdit (placeholder "Enter your account"), a password QLineEdit (placeholder "Enter your password", echo mode Password), and a "Log in" QPushButton. The inputs have a 1px border, 6px corners, 8px padding; on focus the border turns #3498db and the padding shrinks by 1px. The button has a #3498db background, white text, 6px corners, 8px padding; #2980b9 on hover, #1f6391 on press. The placeholder is gray #95a5a6 and italic. Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QFrame, QLabel, QLineEdit, QPushButton, QVBoxLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Login Card")
  window.resize(360, 420)

  # Complete the code here
  window.show()
  app.exec()
checklist:
- The white rounded card is created and laid out sensibly
- The title, account field, password field, and button are all inside the card
- The inputs get a focus border that changes color with no padding jitter
- The placeholder is gray and italic
- The button has three states: normal, hover, and pressed
- The program displays and runs normally
```

```quiz
type: local
q: Build a "two-theme calculator" interface: the main window has a QLineEdit as a display (read-only, right-aligned) and 16 buttons (0-9, +, -, *, /, =, C) arranged in a QGridLayout below it. Provide two QSS themes (light and dark) covering the display and the buttons. Light: white display with dark text, white buttons with dark text and a 1px gray border. Dark: dark-gray display with light text, dark-gray buttons with light text and no border. Clicking the "Theme" button switches between the two, and the button text updates to "Switch to dark/light". Use app.setStyleSheet for a global effect. Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLineEdit, QPushButton, QVBoxLayout, QGridLayout
  )

  app = QApplication(sys.argv)
  window = QWidget()
  window.setWindowTitle("Two-Theme Calculator")
  window.resize(300, 380)

  display = QLineEdit()
  display.setReadOnly(True)
  display.setAlignment(Qt.AlignRight)

  # Complete the buttons, layout, and theme switching here
  window.show()
  app.exec()
checklist:
- The display and all 16 buttons are created and laid out correctly
- Two complete QSS themes cover the display and the buttons
- app.setStyleSheet switches the theme globally
- The theme button text updates accordingly
- The program displays and runs normally
```

## Part 3 · Mini-Project

```quiz
type: local
q: Build a "themed notepad" combining everything from Chapter 5: inherit QMainWindow with a QTextEdit as the central widget. The menu bar has two menus — "File" (New, Open, Save, Quit) and "Theme" (Light, Dark). The toolbar has three actions: "Open", "Save", and "New". The status bar shows "Ready" and the character count. Three themes (light #ffffff/#2c3e50, dark #2c3e50/#ecf0f1, eye-friendly green #f0f7ee/#2e4d2e) must each cover QTextEdit, QMenuBar, QStatusBar, and QPushButton. Use qrc to bundle two icons (open.png, save.png), compile, import resources_rc, and set the icons on the Open and Save buttons (verify that commenting out the import makes the icons disappear). Use QSettings to remember the theme preference. Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  # import resources_rc   # try it commented out first, then uncomment to see the difference
  from PySide6.QtWidgets import (
      QApplication, QMainWindow, QTextEdit, QMenuBar, QToolBar,
      QStatusBar, QLabel, QFileDialog, QMessageBox
  )
  from PySide6.QtGui import QAction, QIcon
  from PySide6.QtCore import QSettings

  class MainWindow(QMainWindow):
      def __init__(self):
          super().__init__()
          self.setWindowTitle("Themed Notepad")
          self.resize(550, 420)
          self.editor = QTextEdit()
          self.setCentralWidget(self.editor)

          # Complete the code here: three QSS themes, menu bar, toolbar (with icons), status bar, theme switching
          self.editor.textChanged.connect(self.update_count)

      def update_count(self):
          pass

  app = QApplication(sys.argv)
  settings = QSettings("QtDemo", "ThemeNote")
  win = MainWindow()
  win.show()
  app.exec()
checklist:
- Inherits QMainWindow; central widget is a QTextEdit
- Three complete themes cover all the main controls
- Menu bar has "File" and "Theme" menus
- The toolbar has three actions with qrc icons
- Test the icon display with the import both commented and uncommented
- QSettings saves and restores the theme choice
- The status bar shows "Ready" and the character count
- The program displays and runs normally
```
