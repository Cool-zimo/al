# Chapter 3 · ttk and Interface Polishing · Big Quiz

> 8 questions. This chapter answers: "tkinter's native widgets look too plain and old-fashioned, how do you use ttk to build a modern-looking interface, how do you add tables, tabbed pages and progress bars, and how do you keep long work from freezing the interface?"
> **You must answer every question correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which statement about the difference between tkinter native widgets and ttk widgets is correct?
options:
- ttk widgets look exactly the same as native widgets; only the import style differs
- ttk widgets are rendered by a theme engine, are more consistent across platforms, and do not accept direct bg/fg arguments
- ttk widgets can use bg, fg and font arguments directly to change colours just like native widgets
- Canvas and Notebook are both widgets unique to ttk
answer: 1
explain: ttk widgets are drawn by a theme engine, giving them good cross-platform consistency, but changing their appearance requires a Style object rather than native-style direct arguments such as bg/fg. Canvas is actually the widget that ttk lacks and must be created with tk.Canvas.
```

```quiz
type: choice
q: To change every ttk button to "white text + blue background + 8 padding", which is correct?
options:
- ttk.Button(root, text="OK", bg="blue", fg="white").pack()
- First style.theme_use("clam"), then style.configure("TButton", foreground="white", background="#3498db", padding=8), then create the buttons
- Create the buttons first, then call style.theme_use("clam") to switch the theme
- style.configure("tbutton", background="blue")
answer: 1
explain: Customising ttk appearance requires Style: switch to the clam theme, which supports custom backgrounds, then configure("TButton", ...), and this must all happen before creating the widgets. The style class name is capitalised as TButton; native bg/fg arguments have no effect on ttk.
```

```quiz
type: choice
q: To build a pure table (without the expandable tree column on the left), how should the Treeview be created?
options:
- ttk.Treeview(root, columns=("name","age"), show="tree")
- ttk.Treeview(root, columns=("name","age"), show="headings")
- ttk.Treeview(root, columns=("name","age"), show="all")
- ttk.Treeview(root, columns=("name","age"))
answer: 1
explain: show="headings" means display only the headings and data you defined, hiding the left tree column. show="tree" does the opposite and shows only the tree column; omitting show defaults to showing both the tree and the headings, leaving a blank column on the left.
```

```quiz
type: choice
q: Which statement about ttk.Notebook tab pages is correct?
options:
- The left-to-right order is determined by the order in which the Frames were created
- The left-to-right order is determined by the order in which add was called
- Each tab page must be a string
- A tab page's contents do not need layout; Notebook arranges them automatically
answer: 1
explain: The Notebook tab order equals the order of the add calls: the first add sits on the left. Each tab page must be a container widget such as a Frame, and the widgets inside that Frame must still be packed or gridded, or nothing will be visible.
```

```quiz
type: choice
q: A button callback needs to do 5 seconds of calculation without freezing the interface. Which is correct?
options:
- Call time.sleep(5) directly inside the callback, then update the interface
- Move the work into a background thread and, once it finishes, use root.after(0, lambda: bar.configure(value=100)) to get back to the main thread and update the interface
- Use several Buttons in rotation to spread the work out
- Write bar["value"] = 100 directly inside the child thread
answer: 1
explain: tkinter is single-threaded and not thread-safe, so long work must not run synchronously inside a callback (it would block the event loop) and must not modify the interface directly from another thread (it would crash). The standard pattern is a background thread plus root.after(0, ...) to register the update on the main thread.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "Student Information" window titled "Student Info" using ttk widgets and grid layout. Put three labels in the first column — "Name", "Age" and "Class" — and three ttk.Entry inputs in the second column (add a validation hint to the age input that it must be an integer). Also add a ttk.Combobox for "Grade" with preset values=["Grade 1","Grade 2","Grade 3"]. On the last row place a ttk.Button labelled "Submit". Above all that, add a ttk.Treeview table with columns Name/Age/Class, show="headings", containing 3 rows of sample data, and bind the <<TreeviewSelect>> event so that when a row is selected its three values are printed to the terminal (check that selection is not empty first). Hint: insert rows with insert("", "end", values=...). Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  root = tk.Tk()
  root.title("Student Info")

  # Above: the Treeview table + selection event
  # Below: labels/inputs/Combobox/button, using grid layout
checklist:
- ttk widgets were used (Label/Entry/Button/Combobox/Treeview)
- The Treeview is a pure table with show="headings"
- Three rows of sample data were inserted into the table
- <<TreeviewSelect>> is bound and prints the row values on selection
- The selection handler checks that selection is not empty
- The Combobox has the three preset grade options
- The form uses grid layout
- mainloop was called
```

```quiz
type: local
q: Build a "three-page settings panel": use ttk.Notebook for the tabs, with three pages labelled "Account", "Appearance" and "About". The Account page has two inputs (account and password, with the password using show="*"); the Appearance page has a ttk.Combobox to choose a theme (values=["Light","Dark","Eye-Friendly Green"]) and a ttk.Checkbutton labelled "Run at startup"; the About page has one line of version text. Each page uses a ttk.Frame as its container, with pack or grid for the inner layout. Also bind the <<NotebookTabChanged>> event on the Notebook so that switching tabs prints "Switched to page N" to the terminal. Hint: on switch, use notebook.select() to get the current page ID and notebook.index(id) to get its index. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  root = tk.Tk()
  root.title("Settings")

  notebook = ttk.Notebook(root)
  notebook.pack(fill="both", expand=True)

  # Three Frame pages, each added with add, plus the tab-change binding
checklist:
- There are three tabs labelled Account, Appearance and About
- The Account page has two inputs, account and password, with show="*" on the password
- The Appearance page has a theme Combobox and a "Run at startup" Checkbutton
- The About page has a version text line
- Each page uses a Frame as a container and lays out its inner widgets
- <<NotebookTabChanged>> is bound and prints the switch information
- mainloop was called
```

## Part 3 · Mini Project

```quiz
type: project
q: Build a "Download Manager" interface: at the top a ttk.Progressbar (determinate, maximum=100) and a ttk.Label showing the progress text (initially "0%"). In the middle a ttk.Treeview table with columns Filename/Size/Status, show="headings", containing 4 rows of sample data. At the bottom three buttons: "Start Download", "Pause" and "Clear Completed". Features: 1) when "Start Download" is clicked, simulate the progress with recursive after, adding 5 to the value every 150 milliseconds while the label stays in sync with the percentage; once it reaches 100 the label shows "Download complete"; 2) use the clam theme and configure TButton with white text, #3498db background, 8 padding and an Arial 12-point font; 3) when a row is selected and "Clear Completed" is clicked, delete that row only if its status is "completed", otherwise leave it (use selection + delete); 4) print the filename and status of the selected row to the terminal (check that selection is not empty first). Hint: drive the progress with recursive after, never sleep; configure the style before creating the widgets. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  root = tk.Tk()
  root.title("Download Manager")

  style = ttk.Style()
  # Switch to the clam theme + configure the TButton style

  # Progress bar + progress label
  bar = ttk.Progressbar(root, length=400, mode="determinate", maximum=100, value=0)
  label = ttk.Label(root, text="0%")

  # Table: Filename/Size/Status + sample data + selection event
  tree = ttk.Treeview(root, columns=("name","size","status"), show="headings")

  def start():
      # Update the progress recursively with after

  def clear_done():
      # Delete only the selected rows whose status is "completed"

  # Three buttons
checklist:
- The clam theme is used and TButton is configured (white text, #3498db, padding 8, Arial 12)
- The progress bar is determinate with a maximum of 100
- Start Download updates it recursively with after, +5 every 150ms
- The label stays in sync with the percentage and shows "Download complete" at 100
- The Treeview is a pure table with 4 rows of sample data
- "Clear Completed" deletes only the selected rows whose status is "completed"
- The selected row's filename and status are printed, with an empty-selection check
- mainloop was called
```
