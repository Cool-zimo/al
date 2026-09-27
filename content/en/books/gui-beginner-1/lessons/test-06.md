# Capstone Project: Build the Text Statistics Tool (Lessons 26-30)

> This is the final checkpoint of Book 1 — and the graduation project. Questions 1-5 check the planning and engineering ideas from Chapters 5 and 6; questions 6 and 7 are coding tasks; question 8 is the capstone itself, where you build the complete text-statistics application you've been assembling since Lesson 26.

## Questions 1-5: Multiple Choice

**Question 1.** What does `text.count("\n") + 1` report for an empty string?

```quiz
type: choice
q: What does text.count("\n") + 1 report for an empty string?
options:
- 0
- 1
- -1
- it raises an exception
answer: 1
explain: An empty string has no newlines, so count is 0 and +1 gives 1 - which is wrong, since an empty file has 0 lines. Guard with "if text".
```

**Question 2.** Which error appears when you use both `pack` and `grid` in the same container?

```quiz
type: choice
q: Which error appears when you use both pack and grid in the same container?
options:
- NameError
- ValueError
- _tkinter.TclError: cannot use geometry manager grid inside . which already has slaves managed by pack
- no error, tkinter chooses one automatically
answer: 2
explain: Tkinter refuses to combine geometry managers in one container; pick one per container and stay consistent.
```

**Question 3.** What belongs inside a logic function rather than in the GUI class?

```quiz
type: choice
q: What belongs inside a logic function rather than in the GUI class?
options:
- creating a Label
- calling tk.mainloop()
- counting how often a word appears in a string
- opening a filedialog
answer: 2
explain: Counting occurrences is pure data work and stays in a plain function; widgets, the loop, and dialogs belong in the interface.
```

**Question 4.** Why avoid a bare `except:` when reading a file?

```quiz
type: choice
q: Why avoid a bare except: when reading a file?
options:
- it runs noticeably slower
- it catches SystemExit and KeyboardInterrupt, making the program hard to quit
- it only works on Windows
- it hides the file path
answer: 1
explain: A bare except catches every exception type including SystemExit and KeyboardInterrupt, so the program may ignore a quit request.
```

**Question 5.** How should you detect that the user opened a file containing only whitespace?

```quiz
type: choice
q: How should you detect that the user opened a file containing only whitespace?
options:
- if text == ""
- if len(text) == 0
- if not text.strip()
- check text.count(" ")
answer: 2
explain: not text.strip() is true for a file of any length that contains only spaces, tabs or newlines, so it catches the case "looks blank" rather than just "is empty".
```

## Question 6: Coding Task (Local)

```quiz
type: local
exam: true
q: Write a small app that demonstrates the logic/UI split. In one file define two plain functions: count_vowels(text) returning the number of vowels (a e i o u, case-insensitive) and most_common_letter(text) returning the most frequent alphabetic character as a string (or "-" if there is none). Build a GUI with a Text widget, a Button "Analyse", and a Label showing the result. The Button callback reads the Text, calls both functions, and shows e.g. "5 vowels, most common: 'e'". Handle empty/non-alphabetic input for most_common_letter by returning "-". The logic functions must not import tkinter. Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  app.py
starter: |
  import tkinter as tk

  def count_vowels(text):
      ...

  def most_common_letter(text):
      ...

  root = tk.Tk()
  root.title("Letter analyser")

  # build the Text widget, Button, and result Label
checklist:
- count_vowels is case-insensitive and returns an int
- most_common_letter returns "-" for empty or non-alphabetic input
- Neither logic function imports tkinter
- The callback reads the Text and calls both functions
- The result Label updates with a readable string
- mainloop is called
```

## Question 7: Coding Task (Local)

```quiz
type: local
exam: true
q: Build the text-statistics layout from Lessons 27-28: a top Frame with a Button "Load" (left) and a Label "(no file)" (left, padx 10); a middle Frame using grid with four rows, each a label "Characters:", "No spaces:", "Words:", "Lines:" on the left and a Label showing "0" on the right; and a bottom Listbox filling the remaining space. The value Labels must be stored in a dict keyed by stat name, and the Listbox stored on self, so a later method can update them. Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Text Stats layout")
  root.geometry("420x320")

  # build the three regions with Frame + pack/grid
  # store widget references for later updates
checklist:
- Three Frames are created for the three regions
- The top Frame uses pack for the Button and Label
- The middle Frame uses grid for all four label/value pairs
- All four value Labels are stored in a dict keyed by stat name
- The Listbox uses fill=both, expand=True and is stored on self
- mainloop is called
```

## Question 8: Capstone Project (Local)

```quiz
type: local
exam: true
q: Build the complete Text Statistics Tool - the graduation project for this book. Requirements: (1) A menu bar with a File menu containing Open, Save as, and Quit (separator before Quit), plus an Edit menu with Analyse (counts the current text) and Clear (empties the editor). (2) An editor area using tk.Text with wrap="word". (3) A stats panel built with Frame + grid showing Characters, Characters (no spaces), Words, Lines, each with a value Label stored in a dict. (4) A Listbox showing the top words and their counts. (5) Open reads a .txt file with askopenfilename (filetypes), utf-8, and updates a path label; Save as writes the editor text with defaultextension=".txt" and utf-8. (6) Separate the counting into plain functions (count_stats returning a dict, top_words returning a list of tuples) in the same file or a separate module - they must not use tkinter. (7) Harden it: wrap the file read in try/except OSError and report errors with showerror(parent=root); handle UnicodeDecodeError with a latin-1 fallback; if the text is empty or whitespace-only, show zeros and "(empty)"; refuse files over 5 MB using os.path.getsize and warn the user. Note: a window cannot open inside a web page - click "Open in VS Code" to run it.
files: |
  main.py
  stats.py
starter: |
  # stats.py
  import re
  from collections import Counter

  def count_stats(text):
      # return a dict with chars, no_spaces, words, lines
      # empty text must report 0 lines
      ...

  def top_words(text, n=10):
      # return a list of (word, count) tuples, lowercased, punctuation dropped
      ...

  # main.py
  import tkinter as tk
  import os
  from tkinter import filedialog, messagebox
  import stats   # or define the functions in this file

  MAX_BYTES = 5 * 1024 * 1024

  root = tk.Tk()
  root.title("Text Statistics Tool")
  root.geometry("520x420")

  # build the menu bar, editor, stats panel and results Listbox
  # implement open_file, save_file, _analyse, _clear and _display
checklist:
- A menu bar is attached with File (Open, Save as, Quit) and Edit (Analyse, Clear)
- The editor is a Text widget with wrap="word", stored on self
- The stats panel uses Frame + grid with all four label/value pairs
- Value Labels are stored in a dict keyed by stat name
- A Listbox shows the top words and their counts
- count_stats and top_words are plain functions with no tkinter use
- Open uses askopenfilename with filetypes and reads with utf-8
- Save as uses asksaveasfilename with defaultextension=".txt"
- The read is wrapped in try/except OSError with a parented error dialog
- UnicodeDecodeError falls back to latin-1
- Empty or whitespace-only text shows zeros and "(empty)"
- Files over 5 MB are refused with a warning before reading
- Analyse counts the current editor text; Clear empties it
- mainloop is called
```
