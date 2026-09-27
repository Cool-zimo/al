# Chapter 5 Checkpoint (Lessons 21-25)

> Five multiple-choice questions, two coding tasks, and one project. This checkpoint covers pop-up dialogs, file pickers, single-input dialogs, menus, and secondary windows.

## Questions 1-5: Multiple Choice

**Question 1.** What value does `messagebox.askyesno("Q", "Continue?")` return when the user clicks Yes?

```quiz
type: choice
q: What value does messagebox.askyesno("Q", "Continue?") return when the user clicks Yes?
options:
- the string "yes"
- True
- False
- None
answer: 1
explain: The question-family dialogs return Python booleans. askyesno returns True for Yes and False for No.
```

**Question 2.** What does `askopenfilename` return when the user closes the dialog without picking a file?

```quiz
type: choice
q: What does askopenfilename return when the user closes the dialog without picking a file?
options:
- None
- an empty string ""
- False
- raises an exception
answer: 1
explain: Cancelling returns an empty string, not None. That is why you guard with "if not path: return".
```

**Question 3.** What does `simpledialog.askstring` return when the user clicks Cancel?

```quiz
type: choice
q: What does simpledialog.askstring return when the user clicks Cancel?
options:
- an empty string ""
- False
- None
- 0
answer: 2
explain: All three simpledialog functions return None on cancel, so you must check for it before using the value.
```

**Question 4.** Which line actually makes the menu bar appear in the window?

```quiz
type: choice
q: Which line actually makes the menu bar appear in the window?
options:
- menubar = tk.Menu(root)
- root.config(menu=menubar)
- menubar.add_command(...)
- menubar.pack()
answer: 1
explain: Creating the Menu only builds it in memory; root.config(menu=menubar) attaches it to the window frame.
```

**Question 5.** Which method makes a `Toplevel` window modal, blocking input to the other windows?

```quiz
type: choice
q: Which method makes a Toplevel window modal, blocking input to the other windows?
options:
- top.focus_set()
- top.grab_set()
- top.lift()
- top.wait_window()
answer: 1
explain: grab_set makes the window modal by grabbing all input; wait_window pauses code but does not itself block other windows.
```

## Question 6: Coding Task (Local)

```quiz
type: local
exam: true
q: Build an app with three Buttons: "Info", "Warning", "Error". Info shows a showinfo box "All systems normal". Warning shows a showwarning "Low disk space". Error shows a showerror "Failed to connect". Each dialog must use parent=root. Add a fourth Button "Are you sure?" that asks askyesno("Confirm", "Delete everything?") and, if yes, sets a Label's text to "deleted"; if no, sets it to "kept". Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import messagebox

  root = tk.Tk()
  root.title("Dialog demo")

  # build the Label and the four Buttons with their callbacks
checklist:
- messagebox is imported
- Three dialog Buttons use the correct showinfo/warning/error calls
- Every dialog uses parent=root
- The fourth Button uses askyesno and branches on the return value
- The Label updates to "deleted" or "kept" accordingly
- mainloop is called
```

## Question 7: Coding Task (Local)

```quiz
type: local
exam: true
q: Build a mini text viewer: a Button "Open" using askopenfilename with filetypes for .txt and all files, a Label showing the chosen path (or "(none)"), and a Text widget that displays the file contents after reading with utf-8. Add a Button "Word count" that asks for a number with askinteger("Limit", "How many top words?", minvalue=1, maxvalue=50, parent=root), counts word frequencies with a regex on the loaded text, and shows the top N in a Listbox. Handle cancel and empty input in every dialog and callback. Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk
  import re
  from collections import Counter
  from tkinter import filedialog, simpledialog

  root = tk.Tk()
  root.title("Text viewer")

  # build the widgets and callbacks
checklist:
- askopenfilename uses filetypes and reads with utf-8
- The path Label updates after a successful open
- askinteger uses minvalue, maxvalue and parent=root
- A None result from either dialog is handled without crashing
- Word counting uses regex and Counter
- The Listbox shows the requested number of top words
- mainloop is called
```

## Question 8: Project (Local)

```quiz
type: local
exam: true
q: Build a simple "sticky notes" app. The main window has a Button "New note" that opens a modal Toplevel containing a Text widget and two Buttons, "Save" and "Cancel". Typing in the Text and clicking Save appends the text to a Listbox on the main window, then closes the Toplevel. Cancel just closes it. The Toplevel must use grab_set to be modal and wait_window so the caller can read the result. Also add a menu bar with a File menu containing "New note" and "Quit". Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Sticky notes")

  # build the menu bar, the Listbox, and the new-note function
  # that creates and waits on a modal Toplevel
checklist:
- A menu bar is attached with root.config(menu=...)
- The File menu has New note and Quit (with a separator)
- New note opens a Toplevel with a Text widget and Save/Cancel buttons
- The Toplevel is made modal with grab_set
- wait_window is used so the caller pauses until the window closes
- Save copies the Text content into the Listbox and destroys the Toplevel
- Cancel closes the Toplevel without adding to the Listbox
- mainloop is called
```
