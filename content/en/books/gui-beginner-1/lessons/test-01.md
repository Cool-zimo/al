# Chapter 1 · Your First Window · Big Test

> 8 questions. This chapter solves the problem of "moving from the command line to a window": the three elements of a GUI, how to import tkinter, `Tk()` and `mainloop()`, window properties, Label/Button widgets, and Entry interaction.
> **You must answer every question correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding the three elements of a GUI, which statement is correct?
options:
- The three elements are window, widget, and event
- The three elements are input, processing, and output
- The three elements are variable, function, and class
- The three elements are file, path, and encoding
answer: 0
explain: A GUI consists of three elements: the window (which holds everything), widgets (the objects the user interacts with), and events (the user's actions). Option B describes the abstract flow of a typical program, not the three elements specific to a GUI.
```

```quiz
type: choice
q: Which line of code correctly imports tkinter and creates a window titled "Test"?
options:
- from tkinter import *; root = Tk(); root.title("Test")
- import tkinter as tk; root = tk.Tk(); root.title("Test")
- import Tkinter; root = Tkinter.Tk()
- import tkinter.ttk as tk; root = tk.Tk()
answer: 1
explain: The recommended style is "import tkinter as tk" followed by tk.Tk() and tk.title. Option A uses import *, which pollutes the namespace and is not recommended. Option C is the Python 2 spelling "Tkinter." Option D is wrong because ttk is a submodule and does not contain the Tk class.
```

```quiz
type: choice
q: What does mainloop() do?
options:
- It makes the program exit immediately
- It starts the event loop so the window stays visible and responds to the user
- It creates a new window
- It closes the current window
answer: 1
explain: mainloop() starts the event loop; the program stops there and waits for user input. It is the "final stop" of a window program. Option A is the opposite. Option C is what Tk() does. Option D is what destroy() does.
```

```quiz
type: choice
q: What do the parts of root.geometry("400x300+100+50") mean?
options:
- Width 400, height 300, position (100, 50)
- Width 400, height 300, position (400, 300)
- Width 400, height 300, maximum size 100x50
- Width 100, height 50, position (400, 300)
answer: 0
explain: The geometry format is "widthxheight+X+Y." The part before x is the size, and the numbers after + are the position. So it is width 400, height 300, with the top-left corner at screen coordinate (100, 50).
```

```quiz
type: choice
q: To center a window on the screen, the core calculation formula is?
options:
- x = screen_width / 2
- x = (screen_width - window_width) // 2
- x = screen_width + window_width
- x = 0
answer: 1
explain: To center something you first compute the difference between the screen and the window, then split that difference evenly between the left and right sides, giving (screen_width - window_width) // 2.
```

## Part 2 · Hands-On Questions

```quiz
type: local
q: Write a program whose window title is "Chapter 1 Test", size is 500x400, is locked so it cannot be resized, has a minimum size of 400x300, and contains a Label showing "Welcome to the GUI World". Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  # Complete this section: title, geometry, resizable, minsize, Label, mainloop
checklist:
- The title is "Chapter 1 Test"
- The size is 500x400
- It is locked and cannot be resized: resizable(False, False)
- The minimum size is 400x300
- The Label shows "Welcome to the GUI World"
- mainloop is called
```

```quiz
type: local
q: Write a "click counter": a Label initially shows "Clicks: 0", and each button click increments the count by 1 and updates the Label. Hint: declare the counter with global. Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Click Counter")
  count = 0

  # Write your code here: the count function (with global count), the Label, the Button, and mainloop
checklist:
- count starts at 0
- The function uses global count
- The Label initially shows "Clicks: 0"
- Each click increments the count and updates the Label
- mainloop is called
```

## Part 3 · Mini Project

```quiz
type: local
q: Comprehensive project: build a "BMI Calculator" window. The interface includes: a Label "Height (cm):" and an Entry; a Label "Weight (kg):" and an Entry; a Button "Calculate"; and a Label to display the result. When the button is clicked, calculate BMI = weight / (height/100)^2 and display the result rounded to two decimal places. Handle non-numeric input and division by zero (height is 0 or empty) by showing an error message in red.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("BMI Calculator")

  # Build the interface and write the calculation function here
checklist:
- There are two Entry input boxes (height and weight) with their matching Labels
- There is a "Calculate" button whose command correctly points to the function
- There is a result Label showing the BMI
- The BMI calculation is correct: weight / (height/100)^2, rounded to two decimal places
- Non-numeric input and a height of 0 are handled, with a red error message
- All widgets are placed correctly (pack/grid/place)
- mainloop is called
```
