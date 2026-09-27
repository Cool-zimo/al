# Chapter 2 · Layout: Where Do the Widgets Go · Big Test

> 8 questions. This chapter solves the problem of "where the widgets go": the pack/grid/place geometry managers, grid's rows, columns, and weights, and place's absolute and relative positioning.
> **You must answer every question correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding the three geometry managers, which statement is correct?
options:
- pack arranges by row/column table, grid lines up along edges, and place positions by coordinates
- pack lines up along edges, grid arranges by row/column table, and place positions by coordinates
- The three managers can be freely mixed on the same parent
- place is the most recommended geometry manager
answer: 1
explain: pack lines up along edges, grid arranges by row/column table, and place positions by coordinates — that is how the three differ. Option C is wrong: one parent can use only one manager. Option D is wrong: place is only for special cases; grid is the most commonly used.
```

```quiz
type: choice
q: To make a widget fill horizontally inside its cell, what should sticky be?
options:
- sticky="n"
- sticky="ns"
- sticky="ew"
- sticky="center"
answer: 2
explain: sticky="ew" means both east and west edges, so it fills horizontally. Option B's "ns" fills vertically. Option A only hugs the top. "center" is not a valid sticky value.
```

```quiz
type: choice
q: After enlarging the window, the widgets still huddle in the top-left corner and do not move. What step is most likely missing?
options:
- mainloop was not called
- No weight was configured for the rows/columns, and the widgets have no sticky setting
- tkinter was not imported
- The widgets were not created
answer: 1
explain: The default weight is 0, so nobody claims the space and the widgets stay put. You need columnconfigure/rowconfigure to set the weight and make the cells grow, plus sticky to make the widgets fill those cells. Both are required.
```

```quiz
type: choice
q: To make a widget span two columns, which argument should you use?
options:
- sticky="ew"
- columnspan=2
- rowspan=2
- side="both"
answer: 1
explain: columnspan=2 makes a widget occupy two columns horizontally. rowspan spans rows vertically. sticky controls edge-hugging and filling. side is an argument for pack.
```

```quiz
type: choice
q: Regarding place's anchor, what does anchor="ne" mean?
options:
- The widget's top-left corner aligns with the coordinate point
- The widget's top-right corner aligns with the coordinate point
- The widget's center aligns with the coordinate point
- The widget's bottom-left corner aligns with the coordinate point
answer: 1
explain: anchor uses compass abbreviations: n=north (up), e=east (right), so "ne" means the widget's top-right corner aligns with the specified coordinate. The default "nw" is the top-left corner.
```

## Part 2 · Hands-On Questions

```quiz
type: local
q: Use grid to build a "registration form": row 0 has a "Username:" label (right-aligned) + Entry; row 1 has an "Email:" label (right-aligned) + Entry; row 2 has a "Password:" label (right-aligned) + Entry; row 3 has a "Register" button spanning both columns and filling horizontally. All widgets have a 5-pixel margin. Column 1 should be configured with weight=1 so the input boxes grow with the window. Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Registration Form")
  root.geometry("350x200")

  # Complete the form with grid here, and configure columnconfigure(1, weight=1)
checklist:
- All three labels use sticky="e" (right-aligned)
- All three Entry widgets are placed
- The Register button uses columnspan=2 and sticky="ew"
- columnconfigure(1, weight=1) is configured
- padx/pady margins are present
- mainloop is called
```

```quiz
type: local
q: Use place to create a "picture-in-picture" effect: a 500x400 window with a full-size gray Label at the bottom as the background, and a white Label in the middle that is 200 wide and 100 tall, kept centered with relx=0.5 rely=0.5 anchor="center". Note: a window cannot open inside a web page — click "Open in VS Code" to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.geometry("500x400")
  root.title("Picture in Picture")

  # Use place here to build the two stacked layers
checklist:
- The background Label uses place with relwidth=1, relheight=1 to fill the space
- The inner Label uses relx=0.5, rely=0.5, anchor="center"
- The inner Label is 200x100
- mainloop is called
```

## Part 3 · Mini Project

```quiz
type: local
q: Comprehensive project: use Frame + grid to build a "simple notepad" frame. The top Frame holds three buttons (New/Open/Save) arranged horizontally with side="left"; the middle Frame holds a multi-line text area (Text is covered in Lesson 20; here use tk.Label as a stand-in for the "editor area," with bg="white" filling the space); the bottom Frame holds a status-bar Label (text "Ready," left-aligned). The middle editor area must scale with the window (using weight + sticky="nsew"). All buttons have a 2-pixel margin.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Simple Notepad")
  root.geometry("500x400")

  # Use Frame partitioning and separate layouts to complete the frame here
checklist:
- There is a top Frame that fills horizontally and contains three buttons (side="left")
- There is a middle editor Frame that uses grid internally to place a fill-size Label (bg="white")
- The middle Frame's rows and columns are both configured with weight
- There is a bottom Frame containing a left-aligned status-bar Label
- The middle editor area grows with the window when it is resized
- mainloop is called
```
