# Chapter 4 · Wiring It Up · Big Test

> 8 questions. This chapter is about how the interface connects to the data, and how changes stay in sync.
> **You must get every question right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: What is the core idea of using the observer pattern to decouple the interface from the data?
options:
- Make the interface inherit from the database class and call parent methods directly
- When the data layer changes, it actively notifies every subscriber (the interface); the interface subscribes only to the events it cares about and refreshes, with neither side depending on the other's implementation
- The interface polls the database on a timer, checking for new data once a second
- Pass the database cursor object directly to every widget
answer: 1
explain: The observer pattern is publish-subscribe: after the data is modified, the data layer fires a notification (such as on_records_changed), and every registered interface callback refreshes its own part. The data layer does not import tkinter, and the interface does not hold a database connection directly; both depend only on an abstract event interface.
```

```quiz
type: choice
q: When loading data into a Treeview, what does the refresh_list function usually need to do?
options:
- Append the new data straight to the end of the Treeview
- First call tree.delete(*tree.get_children()) to clear the existing rows, then insert the new data row by row
- Only insert new rows and leave the old ones in place
- Rebuild the entire Treeview widget on every refresh
answer: 1
explain: The standard full-refresh flow clears every existing row with delete(*get_children()), then loops over the new data and inserts it row by row. This guarantees the interface matches the data source exactly and is the simplest reliable way to stay in sync.
```

```quiz
type: choice
q: Regarding the choice between full refresh and incremental update, which statement is correct?
options:
- Full refresh is always better because it is simpler
- When data is small and changes are infrequent, full refresh is sufficient; when the list has tens of thousands of rows or real-time sync is required, incremental update (changing only the affected row) is more efficient
- Incremental update is always simpler and should be the default
- The two approaches produce exactly the same result, only the syntax differs
answer: 1
explain: Full refresh is simple and hard to get wrong, which suits desktop apps with a few hundred rows. But with tens of thousands of rows, or in collaborative apps needing real-time sync, a full refresh visibly stalls; in those cases, only the changed portion should be updated. The choice depends on data size and how real-time it needs to be.
```

```quiz
type: choice
q: What is the correct call chain when adding a record?
options:
- In the button callback, hand-write SQL to write to the database, then reload manually
- Button callback, validate input, call add_record on the logic layer, have the data layer run the SQL, fire a change notification, then refresh the interface
- Button callback, manipulate the Treeview directly, and write to the database only when the program exits
- Button callback updates both the database and the Treeview directly, duplicating the same logic twice
answer: 1
explain: The standard layered chain is: the interface collects and validates input, calls a business function on the logic layer, the logic layer calls the data layer to run the SQL, and once the data changes, the data layer notifies the interface to refresh. Each layer has one job; validation, persistence, and interface refresh are properly separated, making the code maintainable and testable.
```

```quiz
type: choice
q: When deleting a record, which approach is correct?
options:
- Just delete the selected row from the Treeview and leave the database alone
- Show a confirmation dialog, and only after the user confirms should the data layer delete the record and refresh the list
- Double-click to delete, as fast as possible
- Mark the record as "deleted" but leave it in the database
answer: 1
explain: Delete is irreversible, so a confirmation dialog gives the user a chance to reconsider. Only after confirming should the data layer run the DELETE and the list be refreshed. This both prevents accidental data loss and matches what users expect from a delete action.
```

---

## Part 2 · Hands-On Questions

```quiz
type: local
q: Implement observer decoupling: write a minimal EventBus (or Subject class) supporting subscribe(event_name, callback) and emit(event_name, *args). Have the data-layer add_record and delete_record emit the corresponding event after execution, and have the interface subscribe to those events and refresh the Treeview. Demonstrate with tkinter: after clicking Save, the list refreshes automatically (without calling refresh manually). A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk

  class EventBus:
      def __init__(self):
          self._subs = {}
      def subscribe(self, event, cb):
          self._subs.setdefault(event, []).append(cb)
      def emit(self, event, *args):
          for cb in self._subs.get(event, []):
              cb(*args)

  bus = EventBus()
  store = []  # stand-in for the data layer

  def add_record(amount, category):
      store.append({"amount": amount, "category": category})
      bus.emit("records_changed")   # TODO: data layer fires the notification

  root = tk.Tk()
  root.title("Observer demo")
  root.geometry("500x350")
  tree = ttk.Treeview(root, columns=("amount", "category"), show="headings")
  tree.heading("amount", text="Amount"); tree.heading("category", text="Category")
  tree.pack(fill="both", expand=True, padx=8, pady=8)

  def refresh():
      tree.delete(*tree.get_children())
      for r in store:
          tree.insert("", "end", values=(r["amount"], r["category"]))

  bus.subscribe("records_changed", refresh)   # interface subscribes

  frm = ttk.Frame(root); frm.pack(fill="x", padx=8, pady=4)
  a_var = tk.StringVar(); c_var = tk.StringVar()
  ttk.Entry(frm, textvariable=a_var).pack(side="left", padx=4)
  ttk.Entry(frm, textvariable=c_var).pack(side="left", padx=4)
  ttk.Button(frm, text="Save", command=lambda: add_record(a_var.get(), c_var.get())).pack(side="left", padx=4)
  root.mainloop()
checklist:
- EventBus implements both subscribe and emit
- The data layer (add_record/delete_record) emits the corresponding event after execution
- The interface refreshes only by subscribing to the event, not by manually calling refresh in the button callback
- The Treeview stays in sync after save and delete
- The event mechanism works and the interface and data layer are decoupled
- The tkinter program runs stably
```

```quiz
type: local
q: Implement the ledger's full "load, add, delete" flow: create an in-memory SQLite database (with a records table), build an interface with a Treeview list, an entry form, and Save and Delete buttons. On startup, load any existing data automatically. Click Save to write the form data to the database and refresh the list. Select a row and click Delete, show a confirmation, then remove it from the database and refresh. Use parameterised queries throughout. A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  import sqlite3
  from tkinter import messagebox

  CONN = sqlite3.connect(":memory:")
  CONN.execute("""CREATE TABLE records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL, category TEXT NOT NULL, note TEXT DEFAULT '')""")
  CONN.commit()

  root = tk.Tk()
  root.title("Ledger - wiring demo")
  root.geometry("700x450")

  tree = ttk.Treeview(root, columns=("id","amount","category","note"), show="headings")
  for col, txt in [("id","ID"),("amount","Amount"),("category","Category"),("note","Note")]:
      tree.heading(col, text=txt)
  tree.pack(fill="both", expand=True, padx=8, pady=8)

  frm = ttk.Frame(root); frm.pack(fill="x", padx=8, pady=4)
  amount_var = tk.StringVar(); cat_var = tk.StringVar(); note_var = tk.StringVar()
  ttk.Entry(frm, textvariable=amount_var, width=10).pack(side="left", padx=4)
  ttk.Entry(frm, textvariable=cat_var, width=10).pack(side="left", padx=4)
  ttk.Entry(frm, textvariable=note_var, width=16).pack(side="left", padx=4)

  def refresh():
      # TODO: SELECT * FROM records, clear the tree, then insert row by row
      pass

  def on_save():
      # TODO: parameterised INSERT, then refresh
      pass

  def on_delete():
      # TODO: confirm, parameterised DELETE by id, then refresh
      pass

  ttk.Button(frm, text="Save", command=on_save).pack(side="left", padx=4)
  ttk.Button(frm, text="Delete selected", command=on_delete).pack(side="left", padx=4)

  refresh()
  root.mainloop()
checklist:
- On startup, any existing data loads into the Treeview automatically
- Save writes the form data to the database with a parameterised query
- After saving, the list refreshes and shows the new record
- Delete shows a confirmation dialog first
- After confirmation, the corresponding record is removed from the database with a parameterised query
- After deleting, the list refreshes and the selected row disappears
- All database operations use parameterised queries, with no string concatenation
- The program runs stably without crashing
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Take the interface skeleton from chapters 3 and 4 and truly wire it up into a "persistent" ledger: interface (three-zone layout, Treeview, form, validation, empty state) plus data layer (db.py, table creation, CRUD, parameterised queries, transactions) plus logic layer (service.py, business rules, observer notifications), persisted to a real ledger.db file. Requirements: add, delete, and edit (selecting a row echoes it into the form; saving updates it), a confirmation on delete, load on startup, observer decoupling, and an optional CSV export on close. A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  # suggested layout:
  #   db.py        data layer
  #   service.py   logic layer (includes EventBus / observer)
  #   ui.py        interface layer
  #   main.py      entry point
  #
  # main.py skeleton:
  import tkinter as tk
  import tkinter.ttk as ttk
  import sqlite3

  DB_PATH = "ledger.db"

  def get_conn():
      conn = sqlite3.connect(DB_PATH)
      conn.row_factory = sqlite3.Row
      return conn

  def init_db(conn):
      conn.execute("""CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL, category TEXT NOT NULL,
          note TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')))""")
      conn.commit()

  # TODO: assemble the UI and data layer in main.py and implement full CRUD
  root = tk.Tk()
  root.title("Ledger v1.0")
  root.geometry("850x550")
  root.mainloop()
checklist:
- The project has three layers: db.py / service.py / ui.py, with clear responsibilities
- Data persists to a real ledger.db file, and data survives a restart
- Add, delete, and edit all work (select to echo, save to update)
- Delete has a confirmation step
- Data loads automatically on startup
- Every query is parameterised and transactions are managed correctly
- An observer or event mechanism decouples the interface from the data
- The interface has an empty state and status bar feedback
- Optional: CSV export on close
- The program runs stably with all features working
```
