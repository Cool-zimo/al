# Chapter 4 · Events: Making the Program Respond · Review Test

> 8 questions. This chapter answers "how does the program react to the user?": command callbacks, lambda arguments, bind events, keyboard and mouse, and trace-based variable watching.
> **You need every answer right to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which statement about a button's command is correct?
options:
- command=greet() means "call greet when clicked"
- command=greet means "call greet when clicked" (no parentheses)
- command must always be followed by lambda
- The command argument must be a string
answer: 1
explain: command needs the function object itself, so write command=greet with no parentheses. Adding parentheses calls greet immediately while the window is being built and leaves the button dead.
```

```quiz
type: choice
q: When creating buttons in a loop, which version makes each button print its own index correctly?
options:
- command=lambda: print(i)
- command=lambda idx=i: print(idx)
- command=print(i)
- command=lambda: print(idx)
answer: 1
explain: Without a default argument, all three lambdas share the same variable i and end up printing its final value. Writing lambda idx=i: captures the current value as a default, so each lambda keeps its own copy.
```

```quiz
type: choice
q: Which statement about a callback bound with bind is correct?
options:
- It needs no parameters
- It must accept one event object as a parameter
- It must accept two parameters
- It can only be written as a lambda
answer: 1
explain: When an event fires, tkinter automatically passes the event object to the callback, so the callback must define a parameter to receive it. A command= callback, by contrast, receives nothing.
```

```quiz
type: choice
q: Which statement about trace is correct?
options:
- A plain str can be traced
- Only tkinter variable classes (StringVar and friends) can be traced, using var.trace("w", callback)
- trace can only be called after mainloop
- A trace callback cannot receive parameters
answer: 1
explain: trace is a method of tkinter's variable classes; only StringVar, IntVar and the rest have it. A plain str has no trace method. The callback must accept the arguments tkinter passes, conventionally written as *args.
```

```quiz
type: choice
q: Which statement about focus is correct?
options:
- Keyboard events go to every widget
- Keyboard events go only to the focused widget, and focus_set() can set focus programmatically
- Only root can receive focus
- Focus cannot be set in code
answer: 1
explain: Focus determines the keyboard target. Only the focused widget receives key events, and focus_set() can move focus under program control - commonly used to put the cursor straight into an entry on startup.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a mouse tracker: a Label initially reading "move the mouse", with the <Motion> event bound to root. As the mouse moves, the Label should show "mouse at (x, y)" in real time. The code must be organised in a class. Note: a window cannot open inside a web page - click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Mouse Tracker")

  class App:
      def __init__(self, root):
          self.label = tk.Label(root, text="move the mouse", font=("", 16))
          self.label.pack(padx=30, pady=30)
          # bind the <Motion> event here

  App(root)
  root.mainloop()
checklist:
- The code is organised in a class
- <Motion> is bound to root
- The callback accepts the event and uses event.x / event.y
- The Label updates with the coordinates as the mouse moves
- mainloop is called
```

```quiz
type: local
q: Build a live validator: an Entry bound to a StringVar, and a Label showing the validation result. Use trace to watch the variable, and show "valid" in green when the input contains only digits, or "not all digits" in red otherwise. Note: a window cannot open inside a web page - click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Live Validator")

  # build the Entry + StringVar + Label + trace here
checklist:
- The Entry is bound to a StringVar
- var.trace("w", callback) attaches the callback
- The callback uses *args to receive arguments
- Only digits shows "valid" in green
- Anything else shows "not all digits" in red
- mainloop is called
```

## Part 3 · Mini Project

```quiz
type: local
q: Build a drawing pad: a Canvas (400x300, white) supporting freehand drawing in red. Implement the three drag steps: <ButtonPress-1> records the start point, <B1-Motion> draws a line segment and continuously updates the endpoint to become the new start (producing a continuous stroke), and <ButtonRelease-1> cleans up. Add a Clear button that calls delete("all") to wipe the canvas, plus three buttons Red, Green, and Blue that switch the brush colour.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Drawing Pad")
  root.geometry("420x350")

  # build the Canvas, Clear button, colour buttons, and bind the three mouse events
checklist:
- Canvas is 400x300 and white
- <ButtonPress-1>, <B1-Motion>, and <ButtonRelease-1> are all bound
- Dragging produces a continuous line
- There is a Clear button that calls delete("all")
- Red, Green, and Blue buttons switch the brush colour
- mainloop is called
```
