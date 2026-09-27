# Chapter 1 · Think First, Then Build · Big Test

> 8 questions. This chapter answers the question "what exactly must be clear before any code is written?"
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: When designing the ledger's data model, what is the most reasonable table name and primary key design for "each income or expense record"?
options:
- Table `record` with an auto-incrementing integer `id` as the primary key
- Table `data` with the timestamp as a composite primary key
- Table `item` with no primary key, relying on row position
- Table `records` with the amount field as the primary key
answer: 0
explain: The table name should clearly express the meaning of "one record"; an auto-incrementing integer id is the most common and robust choice for a surrogate primary key, uniquely identifying every entry. A timestamp as the primary key collides (two entries in the same second), and amount repeats far too often to be a key.
```

```quiz
type: choice
q: Which statement about the responsibilities in a three-layer architecture (data / logic / interface) is correct?
options:
- The interface layer writes SQL directly because it is the fastest approach
- The data layer converts database records into business objects, the logic layer holds the business rules, and the interface layer only displays and collects input
- The logic layer should import tkinter so it can show error dialogs directly
- Layers are just a concept; in real code it is easier to keep everything together
answer: 1
explain: The standard split is: the data layer handles storage and SQL, the logic layer holds validation and calculations, and the interface layer only displays and collects input. The interface imports the data layer, the logic imports the data layer, but not the other way round. Letting the logic import tkinter ruins testability and portability.
```

```quiz
type: choice
q: Why is SQLite a better fit than MySQL for a single-user desktop program like this ledger?
options:
- SQLite is always faster than MySQL
- SQLite is a file-based database that needs no service, no configuration and stores everything in one file — ideal for an application whose data lives on the user's machine
- SQLite supports far higher concurrency and can serve tens of thousands of users
- MySQL cannot store non-ASCII text
answer: 1
explain: SQLite is a serverless file-based database: one .db file is the whole database, with no installation, no service to start and no configuration, making it easy to ship with the program. Its concurrency is weaker than MySQL, but a desktop app usually has only one process accessing it.
```

```quiz
type: choice
q: What is the main value of drawing a prototype sketch (on paper or with a tool)?
options:
- It makes the interface look professional for sharing screenshots online
- It exposes layout, field and flow problems before any code is written, killing uncertainty early
- The sketch is a deliverable that the user will sign off against
- It is only practice for drawing
answer: 1
explain: The core value of a prototype sketch is "find problems early". On paper you can spot a missing field or a broken flow for almost no cost; once it is code, fixing it is expensive. It is not a deliverable, it is a thinking tool for you and your team.
```

```quiz
type: choice
q: In a requirements list, what is the main benefit of storing the "category" field in its own table (categories) and referencing it with a foreign key, rather than storing the category name as a string in the main table?
options:
- Queries run faster because string comparison is slow
- It allows categories to be maintained in one place (rename once, applied everywhere), prevents dirty data and supports adding category attributes later
- Foreign-key constraints make the program crash, which is safer
- It saves storage space because integers are smaller than strings
answer: 1
explain: A foreign key to a categories table turns categories into a controlled vocabulary: renaming happens in one place, typos by users are blocked by the constraint, and later you can add icons, colours and sort order. This is basic relational normalisation; saving space is just a side benefit.
```

---

## Part 2 · Hands-On

```quiz
type: local
q: Design the full data model for the ledger: write the CREATE TABLE statements for four tables (records, categories, accounts, budgets), listing every field, primary key and necessary foreign-key constraints. Connect to an in-memory database (:memory:) with sqlite3, execute the four CREATE TABLE statements in turn, and print the list of tables to verify. Note: this involves sqlite3 only, not a tkinter window, but to be safe click "Open in VS Code" to run it.
starter: |
  import sqlite3

  CONN = sqlite3.connect(":memory:")
  CONN.row_factory = sqlite3.Row

  def create_tables(conn):
      # TODO: execute CREATE TABLE for all four tables in turn
      pass

  def list_tables(conn):
      cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      return [r["name"] for r in cur.fetchall()]

  if __name__ == "__main__":
      create_tables(CONN)
      print("Tables created:", list_tables(CONN))
checklist:
- All four tables are defined in full (records / categories / accounts / budgets)
- Every table has a primary key (usually id INTEGER PRIMARY KEY AUTOINCREMENT)
- The records table has foreign keys for category and account, with FOREIGN KEY constraints defined
- Field types are sensible (amount as REAL or integer cents; time as TEXT ISO8601)
- The :memory: connection creates the tables successfully and list_tables returns all four
```

```quiz
type: local
q: Draw a prototype sketch of the ledger by hand, with a tool, or as ASCII, and next to it write a requirements list (8-10 items, split into "must have" and "nice to have"). Then, comparing your sketch with the list, identify at least 3 details you had not thought of before putting pen to paper (for example: how the empty state is shown, whether delete needs a second confirmation, whether the date should default to today). Note: this is a design task and no runnable code is required, but you should use a tkinter skeleton to verify your layout idea. Click "Open in VS Code" to run it.
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  # Use tkinter to throw together a quick layout skeleton and test your sketch idea
  root = tk.Tk()
  root.title("Ledger layout sketch")
  root.geometry("800x500")

  top = ttk.Frame(root); top.pack(fill="x", padx=8, pady=8)
  mid = ttk.Frame(root); mid.pack(fill="both", expand=True, padx=8)
  bot = ttk.Frame(root); bot.pack(fill="x", padx=8, pady=8)

  ttk.Label(top, text="Filter: start/end date / category").pack(side="left")
  ttk.Label(mid, text="Treeview list goes here").pack(expand=True)
  ttk.Label(bot, text="Form: amount/category/date/note").pack(side="left")

  root.mainloop()
checklist:
- A prototype sketch is submitted (hand-drawn, ASCII or a tool image all count)
- The requirements list has 8-10 items, split into "must have" and "nice to have"
- At least 3 details overlooked before starting are identified
- A tkinter skeleton was used to verify the layout regions (top / middle / bottom)
- The sketch and requirements list line up (every on-screen feature appears in the list)
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Independently produce a "ledger project starter kit": a complete requirements document + data model + project skeleton. Requirements: 1) requirements.md (requirements grouped by priority); 2) schema.sql (complete CREATE TABLE statements for all four tables, with comments); 3) an empty tkinter three-region shell (top filter, middle Treeview placeholder, bottom form) that matches the sketch when run; 4) a README explaining the directory structure and the responsibility of each module (data / logic / interface).
starter: |
  # Suggested structure:
  #   requirements.md
  #   schema.sql
  #   README.md
  #   src/
  #     __init__.py
  #     db.py          (data layer)
  #     service.py     (logic layer)
  #     ui.py          (interface layer)
  #     main.py        (entry point)
  #
  # This stage only needs the skeleton + three-region shell + documents;
  # business logic can be left empty.
  import tkinter as tk
  import tkinter.ttk as ttk

  root = tk.Tk()
  root.title("Ledger v0.1 skeleton")
  root.geometry("900x600")

  top = ttk.LabelFrame(root, text="Filter"); top.pack(fill="x", padx=8, pady=4)
  mid = ttk.LabelFrame(root, text="Record list"); mid.pack(fill="both", expand=True, padx=8, pady=4)
  bot = ttk.LabelFrame(root, text="Entry"); bot.pack(fill="x", padx=8, pady=4)

  ttk.Label(top, text="From ___ To ___ Category [All v]   [Filter]").pack(anchor="w", padx=8, pady=8)
  ttk.Label(mid, text="(Treeview arrives in chapter 3)").pack(expand=True)
  ttk.Label(bot, text="Amount ___ Category [v] Date ___ Note ___  [Save]").pack(anchor="w", padx=8, pady=8)

  root.mainloop()
checklist:
- requirements.md exists and requirements are grouped by priority (must have / nice to have)
- schema.sql contains complete CREATE TABLE statements for all four tables, with fields, keys, foreign keys and comments
- The tkinter program shows a three-region layout (filter / list / entry) and runs
- The README explains the directory structure and each module's responsibility (data / logic / interface)
- The overall structure is clean and leaves room for later chapters
- The running interface matches the description in the design document
```
