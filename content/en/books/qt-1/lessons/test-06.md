# Chapter 6 Test: Multi-Threading and the Capstone

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which statement about GUI main-thread blocking is correct?
options:
- As long as the slow operation is placed in a separate Python function, the interface will not block
- A slow operation inside a slot blocks the event loop and the interface becomes "not responding"
- PySide6 automatically moves slow operations to a background thread
- QTimer solves every blocking problem
answer: 1
explain: A slot runs synchronously on the main thread, so a slow operation that does not return will block the event loop. PySide6 does not background your code automatically, and QTimer only triggers on a schedule — it does not create a thread.
```

```quiz
type: choice
q: Regarding the correct use of moveToThread, which statement is FALSE?
options:
- A Worker must have no parent object, or moveToThread will fail
- After moveToThread, the Worker's slot runs on the background thread
- A background thread can call QLabel.setText() directly to update the interface
- The thread.started signal can be connected to a Worker slot to start the task
answer: 2
explain: A background thread must never touch a UI control; that causes a crash or undefined behavior. It must emit a signal so a main-thread slot updates the UI.
```

```quiz
type: choice
q: Which operation is NOT suitable for running on the main thread?
options:
- Creating 5 QPushButton widgets and adding them to a layout
- Using requests.get to call an API that might take 3 seconds to return
- Concatenating two strings and showing the result on a QLabel
- Reading text from a QLineEdit and running a regex match on it
answer: 1
explain: A network request can take several seconds and will freeze the interface if run on the main thread. Creating controls and string manipulation are both lightweight and perfectly safe on the main thread.
```

```quiz
type: choice
q: What is the difference between QTimer and time.sleep?
options:
- Both block the event loop; QTimer is just more precise
- time.sleep freezes the event loop, while QTimer uses signals and does not block it
- QTimer is internally implemented with time.sleep
- Using time.sleep inside a QTimer tick function is safe
answer: 1
explain: time.sleep blocks the whole thread, including the event loop. QTimer's timeout fires in the gaps of the event loop, and tick returns immediately. Sleeping inside tick freezes the interface just the same.
```

```quiz
type: choice
q: When packaging a PySide6 app with PyInstaller, if you get "Could not find the Qt platform plugin" at runtime, what is the most likely cause?
options:
- The Python version is wrong
- The Qt platforms plugin was not packaged into the executable correctly
- The QSS file path is wrong
- The program has no main function
answer: 1
explain: Qt needs the platforms plugin (e.g. qwindows.dll) to run its GUI. PyInstaller sometimes fails to collect it, so you need --collect-all PySide6 or --add-data to specify the plugin directory manually.
```

## Part 2 · Hands-On

```quiz
type: local
q: Write a program: the window has a QLabel (showing "Click count"), a QProgressBar, and a QPushButton ("Start timer"). When the button is clicked, use QTimer to run a 10-second countdown; the QLabel updates the remaining seconds every second, and the QProgressBar updates the percentage in sync. When the countdown ends, the QLabel shows "Time's up!". Use QTimer exclusively — absolutely no time.sleep. Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QProgressBar, QPushButton, QVBoxLayout
  )
  from PySide6.QtCore import QTimer

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Countdown Timer")
  win.resize(300, 150)

  label = QLabel("Click count: 0")
  bar = QProgressBar()
  bar.setRange(0, 100)
  btn = QPushButton("Start timer")

  # Complete the QTimer countdown logic here
  layout = QVBoxLayout(win)
  layout.addWidget(label)
  layout.addWidget(bar)
  layout.addWidget(btn)
  win.show()
  app.exec()
checklist:
- QTimer correctly implements a 10-second countdown
- The QLabel updates the remaining seconds every second
- The QProgressBar updates the percentage in sync
- When the countdown ends, "Time's up!" is displayed
- No time.sleep anywhere
- The interface stays responsive throughout
- The program displays and runs normally
```

```quiz
type: local
q: Build a "prime-number calculator": the window has a QSpinBox (upper limit N, default 10000), a QPushButton ("Start calculation"), a QLabel (showing the result), and a QProgressBar (progress). When you click start, a background thread calculates all primes between 2 and N, reporting progress via a signal during the calculation. When done, the main thread shows the prime count and elapsed time. Requirements: the Worker uses the moveToThread pattern; the background thread must not touch any UI control. The thread must exit cleanly when the window closes. Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
starter: |
  import sys
  import time
  from PySide6.QtCore import QThread, QObject, Signal, Slot
  from PySide6.QtWidgets import (
      QApplication, QWidget, QLabel, QProgressBar, QPushButton, QSpinBox, QVBoxLayout
  )

  # Define the Worker and main-window logic here
  # Hint: use the Sieve of Eratosthenes to find primes

  app = QApplication(sys.argv)
  win = QWidget()
  win.setWindowTitle("Prime Calculator")
  win.resize(350, 200)

  n_input = QSpinBox()
  n_input.setRange(10, 1000000)
  n_input.setValue(10000)
  btn = QPushButton("Start calculation")
  result_label = QLabel("Waiting...")
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
- The Worker correctly implements the moveToThread pattern
- The prime calculation is correct (using the sieve)
- The background thread never touches the UI; progress goes through signals
- When done, the main thread shows the prime count and elapsed time
- The thread exits cleanly when the window closes
- The program displays and runs normally
```

## Part 3 · Mini-Project

```quiz
type: local
q: Build an "image thumbnail generator": the window has a QPushButton ("Select folder"), a QTableWidget (3 columns: filename, size, status), a QProgressBar, and a QTextEdit (log area). After selecting a folder, list all image files (.jpg/.png/.gif) in the table. Clicking "Generate thumbnails" uses multiple threads to resize each image to 128x128 pixels and save it into a subfolder named "thumbnails/". Requirements: thumbnail generation runs on a background thread; the progress bar and log update live; the status column uses ✅ and ❌ to mark success/failure. The interface must not freeze while processing large images. If a thumbnail with the same name already exists in the target folder, skip it and log it. Note: this is a windowed program and cannot run inside a web page — click "Open in VS Code" to run it.
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

  # Complete the thumbnail-generation Worker and main-window logic here
  # Hint: use Pillow's Image.thumbnail() method

  app = QApplication(sys.argv)
  win = QMainWindow()
  win.setWindowTitle("Image Thumbnail Generator")
  win.resize(600, 400)

  central = QWidget()
  layout = QVBoxLayout(central)

  browse_btn = QPushButton("Select folder")
  table = QTableWidget()
  table.setColumnCount(3)
  table.setHorizontalHeaderLabels(["Filename", "Size(KB)", "Status"])
  progress = QProgressBar()
  progress.setRange(0, 100)
  log_area = QTextEdit()
  log_area.setReadOnly(True)
  log_area.setMaximumHeight(120)
  generate_btn = QPushButton("Generate thumbnails")

  layout.addWidget(browse_btn)
  layout.addWidget(table)
  layout.addWidget(progress)
  layout.addWidget(log_area)
  layout.addWidget(generate_btn)
  win.setCentralWidget(central)
  win.show()
  app.exec()
checklist:
- Selecting a folder lists the image files correctly
- The table shows the three columns: filename, size, status
- Thumbnail generation runs on a background thread
- The progress bar and log update live
- The status column marks ✅/❌ correctly
- Already-existing thumbnails are skipped and logged
- The interface never freezes; the thread exits cleanly on close
- The program displays and runs normally
```
