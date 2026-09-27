# Chapter 3 · The Interface Skeleton · Big Test

> 8 questions. This chapter answers the question "how is the interface laid out, which widgets are used, how is input validated?"
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: In tkinter, what is the most sensible way to build a three-layer layout of "top filter area / middle table area / bottom form area"?
options:
- Three Frames using pack(side="top") / pack(fill="both", expand=True) / pack(side="bottom")
- Absolute positioning for all three controls with place and pixel coordinates
- The middle table uses grid and the others use pack, mixed for flexibility
- One giant grid holding every control
answer: 0
explain: The typical approach is three Frames: the top filter uses pack(side="top"), the bottom form uses pack(side="bottom"), and the middle table uses pack(fill="both", expand=True) to fill the remaining space. This "fixed top and bottom plus elastic middle" structure is clean and easy to maintain.
```

```quiz
type: choice
q: Which is the correct way to define columns and insert data in a ttk.Treeview?
options:
- tree["columns"] = ("a", "b"); tree.heading("a", text="Amount"); tree.insert("", "end", values=(100, "Food"))
- tree.add_column("Amount"); tree.append(100, "Food")
- tree.configure(cols=["Amount", "Category"]); tree.add_row([100, "Food"])
- tree["show"] = "headings"; tree.insert(0, ["Amount", "Food"])
answer: 0
explain: A Treeview defines column identifiers through the columns attribute, sets headings with heading, and inserts a row with insert("", "end", values=...). This is the standard three-step sequence: define columns, set headers, insert data.
```

```quiz
type: choice
q: When a ttk.Combobox is used as the category selector, how can it support both dropdown selection and user typing?
options:
- Set state="readonly", allowing selection only
- Set state="normal" (the default), allowing both selection and typing
- Set state="disabled" to disable it
- A Combobox can only offer a dropdown and never allows typing
answer: 1
explain: A Combobox defaults to state="normal", letting the user either pick from the dropdown or type directly. state="readonly" allows selection only (useful when the category must be chosen from existing options), while state="disabled" makes it completely non-interactive.
```

```quiz
type: choice
q: What is the most sensible approach to validating an entry form?
options:
- No validation; let the user type anything and handle the database error later
- In the "save" button's callback, check each field one by one — empty amount / non-numeric amount, empty category, invalid date format — and give a clear message for each
- Wrap the whole callback in try/except, catch every exception and silently ignore it
- Replace application-level validation with CHECK constraints in the database
answer: 1
explain: Application-level validation should check every field on submit: empty or non-numeric amount, unselected category, wrong date format, each with a clear user message (such as highlighting the field or showing a dialog). Pushing everything to the database returns unfriendly errors, and silently ignoring exceptions leaves the user with no idea what went wrong.
```

```quiz
type: choice
q: When the list is empty (no records yet), how should the interface handle it?
options:
- Show nothing, leaving a blank space
- Show an empty-state hint such as "No records yet — use the area below to add your first transaction"
- Automatically insert a sample record
- Pop up an error box saying "data is empty"
answer: 1
explain: An empty state is basic user-experience work. A user opening the app for the first time is confused by a blank list; clear guidance text (ideally with a friendly icon) tells them "something should appear here, and here is what to do next". Auto-inserting sample data pollutes real records, and an error dialog turns a normal state into a problem.
```

---

## Part 2 · Hands-On

```quiz
type: local
q: Build the ledger's three-region interface skeleton: a top filter area (two date Entry widgets, a category Combobox and a filter button), a middle Treeview (columns: date / amount / category / note), and a bottom form (four controls for amount / category / date / note plus a save button). The structure must be clear when running, and clicking filter or save should print the corresponding input values to the console. Note: a tkinter window program cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  root = tk.Tk()
  root.title("Ledger")
  root.geometry("800x500")

  # TODO: top filter area
  top = ttk.LabelFrame(root, text="Filter"); top.pack(fill="x", padx=8, pady=4)
  # TODO: middle table area
  mid = ttk.LabelFrame(root, text="Records"); mid.pack(fill="both", expand=True, padx=8, pady=4)
  # TODO: bottom form area
  bot = ttk.LabelFrame(root, text="Entry"); bot.pack(fill="x", padx=8, pady=4)

  root.mainloop()
checklist:
- The three-region layout is clear (filter / table / entry)
- The top has two date Entry widgets, a category Combobox and a filter button
- The middle Treeview defines four columns (date / amount / category / note) with headings
- The bottom has controls for amount / category / date / note and a save button
- The filter button prints the filter input values
- The save button prints the form input values
- The interface runs and the controls are aligned neatly
```

```quiz
type: local
q: Add full validation to the entry form: the amount must be a number greater than 0, the category must be selected, and the date must match YYYY-MM-DD. On any failure, show a clear message in the interface (a ttk.Label can serve as a status bar showing the error). Also implement the empty state: when the Treeview has no data, show a "No records yet" hint. Note: a tkinter window program cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  import re
  from datetime import datetime

  root = tk.Tk()
  root.title("Validation exercise")
  root.geometry("500x350")

  frm = ttk.Frame(root, padding=12); frm.pack(fill="both", expand=True)

  ttk.Label(frm, text="Amount").grid(row=0, column=0, sticky="w", pady=4)
  amount_var = tk.StringVar()
  ttk.Entry(frm, textvariable=amount_var).grid(row=0, column=1, sticky="ew", padx=8)

  ttk.Label(frm, text="Category").grid(row=1, column=0, sticky="w", pady=4)
  cat_var = tk.StringVar()
  ttk.Combobox(frm, textvariable=cat_var, values=["Food", "Transport", "Salary", "Shopping"]).grid(row=1, column=1, sticky="ew", padx=8)

  ttk.Label(frm, text="Date").grid(row=2, column=0, sticky="w", pady=4)
  date_var = tk.StringVar(value="2026-01-01")
  ttk.Entry(frm, textvariable=date_var).grid(row=2, column=1, sticky="ew", padx=8)

  status = ttk.Label(frm, foreground="red")
  status.grid(row=4, column=0, columnspan=2, sticky="w", pady=8)

  def validate():
      # TODO: validate amount / category / date; on error status.config(text=...)
      status.config(text="Validation passed (demo)")

  ttk.Button(frm, text="Save", command=validate).grid(row=3, column=0, columnspan=2, pady=8)
  root.mainloop()
checklist:
- Amount validation: not empty, is a number, greater than 0, with a message on failure
- Category validation: must be selected, with a message on failure
- Date validation: matches YYYY-MM-DD (using datetime.strptime or a regex)
- On error, the status bar shows a clear red error message
- On full success there is a success message
- The empty state is demonstrated: the Treeview shows "No records yet" when empty
- Every failure branch of the validation logic is covered
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Turn the ledger interface skeleton into a runnable prototype that "can record, can list, can clear and start again": a three-region layout (top filter, middle Treeview, bottom form), form validation (amount / category / date), inserting the record into the Treeview list on save, clicking a row to echo it back into the form, and a delete button to remove the selected row. Data lives only in memory (a list), with no database. The interface must be well structured, with status-bar feedback and an empty-state hint. Note: a tkinter window program cannot run in a web page — click "Open in VS Code" to run it.
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  from datetime import datetime

  root = tk.Tk()
  root.title("Ledger prototype")
  root.geometry("820x540")

  # TODO: top filter area
  # TODO: middle Treeview + scrollbar
  # TODO: bottom form + save / delete / reset buttons
  # TODO: status-bar Label

  root.mainloop()
checklist:
- The three-region layout is complete (filter / list / entry)
- The Treeview has four columns (date / amount / category / note) with a scrollbar
- The form includes controls for amount / category / date / note
- Validation covers amount, category and date, with status-bar feedback on failure
- On a successful save the record appears in the Treeview list
- Selecting a row echoes it back into the form (preparing for edit)
- The delete button removes the selected row from the Treeview
- An empty-state hint ("No records yet") appears when there is no data
- The status bar gives success or failure feedback for key actions
- The program runs stably without crashing
```
