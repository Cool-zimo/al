# Chapter 3 · Common Widgets · Review Test

> 8 questions. This chapter answers "which widget do I use?": Entry, Text, Checkbutton, Radiobutton, Listbox, Scrollbar, Combobox, Spinbox, and Scale.
> **You need every answer right to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: What is the difference between Entry and Text?
options:
- Entry can hold multiple lines; Text holds one
- Entry holds one line; Text holds multiple lines
- They are identical
- Text cannot be bound to a StringVar
answer: 1
explain: Entry is a single-line input box, while Text is a multiline editing widget. Text uses line.column indexes and can be bound to a StringVar for reading and writing.
```

```quiz
type: choice
q: Which statement about StringVar is correct?
options:
- It is a plain str used to hold text
- It is a tkinter variable class; once bound to a widget with textvariable, calling set() refreshes the widget automatically
- It can only be bound to a Button
- It must be destroyed before mainloop runs
answer: 1
explain: StringVar is a tkinter variable class. Bind it to an Entry, Label, or similar widget with textvariable, and var.set() repaints the widget without manually deleting and re-inserting text. It is not a plain str.
```

```quiz
type: choice
q: What does Text index "1.0" refer to?
options:
- Line 0, column 1
- Line 1, column 0 - the start of the document
- Line 1, column 1
- The end of the document
answer: 1
explain: Text indexes are written line.column. Lines count from 1, columns from 0, so "1.0" is the first character of the document. "end" means the tail, and "0.0" is invalid.
```

```quiz
type: choice
q: How does Radiobutton enforce "pick exactly one"?
options:
- Give each Radiobutton a different variable
- Buttons in the same group share one variable, and each has a distinct value
- Radiobuttons are exclusive by nature and need no variable
- The variable must be a BooleanVar
answer: 1
explain: The trick is one shared variable. Every button in the group writes to the same variable, so selecting one overwrites the previous selection and creates the exclusive behaviour. Different variables make separate groups; no variable means no value is recorded; BooleanVar is only one possible type.
```

```quiz
type: choice
q: Which statement about wiring a Listbox to a Scrollbar is correct?
options:
- Only scrollbar.config(command=lb.yview) is needed
- Only lb.yscrollcommand=scrollbar.set on the Listbox is needed
- Both: the Listbox's yscrollcommand must point at scrollbar.set, and the Scrollbar's command must point at lb.yview
- The Scrollbar must be a child of the Listbox to work
answer: 2
explain: The binding is bidirectional: when the list scrolls it notifies the scrollbar, and when the scrollbar is dragged it notifies the list. The two widgets are siblings, each laid out separately.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a login window using grid layout: a "Username" label plus Entry, a "Password" label plus Entry (show="*"), a "Remember me" Checkbutton (BooleanVar), and a Login button. When Login is clicked, show the username and whether it should be remembered on a Label. Note: a window cannot open inside a web page - click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Login")

  # build the login interface here
checklist:
- There are two Entries, username and password, with show="*" on the password field
- "Remember me" is a Checkbutton bound to a BooleanVar
- There is a Login button
- Clicking it shows the username and remember-me state on a Label
- The layout uses grid
- mainloop is called
```

```quiz
type: local
q: Build a font picker using ttk.Combobox and tk.Scale: the Combobox selects a font name (read-only, options "Arial", "Times New Roman", "Courier New"), the Scale picks a font size from 8 to 72, and a Label shows the preview text "Hello, world", updating its font and size live as you change the controls. Hint: configure the font dynamically with font=(font_name, size). Note: a window cannot open inside a web page - click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  root = tk.Tk()
  root.title("Font Picker")

  # build the Combobox, Scale, and preview Label here
checklist:
- There is a read-only Combobox for the font name
- There is a Scale for the font size, ranging 8-72
- There is a preview Label showing "Hello, world"
- Changing the font or size updates the preview live
- mainloop is called
```

## Part 3 · Mini Project

```quiz
type: local
q: Build a mini notepad. The top toolbar (laid out horizontally in a Frame) holds three buttons: New, Open, and Save. The middle editing area is a Text widget that resizes with the window (rows and columns weighted, sticky="nsew"). The bottom status bar Frame holds a Label showing "characters: 0", which updates live as you type (bind the <KeyRelease> event to count characters). Use a monospaced font on the Text for a cleaner look. Note: get("1.0", "end") carries a trailing newline, so subtract 1 or call strip when counting.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Mini Notepad")
  root.geometry("500x400")

  # build the interface and bind the event to count characters
checklist:
- The top toolbar is a horizontally laid out Frame with three buttons
- The middle Text editing area resizes with the window
- The bottom status bar shows the character count
- <KeyRelease> is bound to update the count live
- The Text uses a monospaced font (e.g. Consolas or Courier)
- mainloop is called
```
