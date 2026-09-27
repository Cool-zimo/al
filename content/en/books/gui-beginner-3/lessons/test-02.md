# Chapter 2 · The Data Layer · Big Test

> 8 questions. This chapter answers the question "how is data stored and retrieved safely?"
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which statement about the relationship between a connection and a cursor in sqlite3 is correct?
options:
- One connection can have many cursors, each maintaining its own query state independently
- One connection can have only one cursor, and the connection must be closed afterwards
- The cursor is responsible for the physical connection to the database
- The connection object can execute SQL directly without a cursor
answer: 0
explain: The connection object manages the physical channel to the database; the cursor is the working object that executes SQL and iterates results. One connection can create many cursors, each independent. The connection also has an execute shortcut (it creates a temporary cursor internally), but an explicit cursor is clearer.
```

```quiz
type: choice
q: What is the correct way to write a parameterised query in sqlite3?
options:
- cur.execute("INSERT INTO records VALUES (%s, %s)" % (amount, note))
- cur.execute("INSERT INTO records VALUES (?, ?)", (amount, note))
- cur.execute(f"INSERT INTO records VALUES ({amount}, '{note}')")
- cur.execute("INSERT INTO records VALUES (" + amount + ", " + note + ")")
answer: 1
explain: sqlite3 uses ? as a placeholder, with parameters passed as a tuple as the second argument to execute. This is the standard parameterised form; the database driver handles correct escaping and types, preventing SQL injection at the source.
```

```quiz
type: choice
q: Why must parameterised queries be used instead of building SQL with an f-string?
options:
- f-strings are slower
- Because user input may contain quotes, semicolons and similar characters that alter the SQL's meaning when concatenated, leading to SQL injection
- f-strings cannot handle integers
- Concatenated SQL is harder to read
answer: 1
explain: When SQL is concatenated, malicious input (such as a note reading "'); DROP TABLE records;--") closes the original statement and executes extra commands. Parameterised queries separate data from SQL structure so the driver never treats parameter content as code — the only reliable defence against injection.
```

```quiz
type: choice
q: Which statement about transactions is correct?
options:
- Every execute writes straight to disk with no need to commit
- Multiple changes should sit in one transaction, committed with commit and rolled back with rollback on error to guarantee atomicity
- rollback undoes every operation since the program started
- Data is still in memory after commit and is lost on restart
answer: 1
explain: A default connection uses deferred commit; grouping multiple changes in a transaction guarantees all-or-nothing (atomicity). commit makes changes permanent, rollback undoes changes within that transaction on error, and data is on disk after commit.
```

```quiz
type: choice
q: What is the typical benefit of managing an sqlite3 connection with a with statement?
options:
- with creates the table automatically
- The connection is closed automatically when the with block ends, and any uncommitted transaction is rolled back on exception
- with makes queries faster
- with prevents SQL injection
answer: 1
explain: Implementing a context manager for the connection (or a custom wrapper) closes it and releases resources at the end of the with block; a custom __exit__ can also judge whether an exception occurred and roll back, avoiding inconsistent data from a forgotten commit or rollback.
```

---

## Part 2 · Hands-On

```quiz
type: local
q: Implement a complete db.py data layer: init_db() (creates all four tables, idempotently), plus add_record / list_records / update_record / delete_record, all using parameterised queries. Test against an in-memory database: insert 3 records, list all, update one, delete one, and print the remaining records to verify. Note: involves sqlite3; click "Open in VS Code" to run it.
starter: |
  import sqlite3

  SCHEMA = """
  CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  """

  CONN = sqlite3.connect(":memory:")
  CONN.row_factory = sqlite3.Row

  def init_db(conn):
      # TODO: execute CREATE TABLE IF NOT EXISTS
      pass

  def add_record(conn, amount, category, note=""):
      # TODO: parameterised INSERT
      pass

  def list_records(conn):
      # TODO: SELECT * ORDER BY created_at DESC
      return []

  def update_record(conn, rid, **fields):
      # TODO: build the SET clause dynamically, parameterised
      pass

  def delete_record(conn, rid):
      # TODO: parameterised DELETE
      pass

  if __name__ == "__main__":
      init_db(CONN)
      add_record(CONN, 12.5, "Food", "Lunch")
      add_record(CONN, 3000, "Salary", "Monthly pay")
      add_record(CONN, 8.0, "Transport", "Tube")
      print("All records:", [dict(r) for r in list_records(CONN)])
      update_record(CONN, 1, note="Lunch (extra drumstick)")
      delete_record(CONN, 2)
      print("After changes:", [dict(r) for r in list_records(CONN)])
checklist:
- init_db uses CREATE TABLE IF NOT EXISTS and can be called repeatedly without error
- All four tables are created (the schema may be extended)
- add_record uses a parameterised query and returns the new record id
- list_records returns records ordered by time descending
- update_record can update specified fields dynamically while staying parameterised
- delete_record deletes by id and is parameterised
- The test flow runs end to end: insert 3, update 1, delete 1, leaving 2 with the correct content
```

```quiz
type: local
q: Write a deliberately vulnerable function and a fixed safe version, and compare them against the same in-memory database: use the malicious input `"); DROP TABLE records;--` as the note, observe whether the vulnerable version drops the table, and whether the safe version stores it correctly. Finally verify with list_tables that the table still exists. Note: involves sqlite3; click "Open in VS Code" to run it.
starter: |
  import sqlite3

  CONN = sqlite3.connect(":memory:")
  CONN.execute("CREATE TABLE records (id INTEGER PRIMARY KEY, note TEXT)")
  CONN.commit()

  def add_vulnerable(note):
      # TODO: concatenate with a string to create the injection hole
      sql = "INSERT INTO records (note) VALUES ('" + note + "')"
      CONN.execute(sql)
      CONN.commit()

  def add_safe(note):
      # TODO: parameterised query, stores correctly
      CONN.execute("INSERT INTO records (note) VALUES (?)", (note,))
      CONN.commit()

  def list_tables():
      return [r["name"] for r in CONN.execute(
          "SELECT name FROM sqlite_master WHERE type='table'")]

  evil = '"); DROP TABLE records;--'
  print("Vulnerable version:")
  try:
      add_vulnerable(evil)
  except Exception as e:
      print("  Error:", e)
  print("  Tables:", list_tables())

  # Recreate the table
  CONN.execute("CREATE TABLE records (id INTEGER PRIMARY KEY, note TEXT)")

  print("Safe version:")
  add_safe(evil)
  print("  Tables:", list_tables())
  print("  Records:", [dict(r) for r in CONN.execute("SELECT * FROM records")])
checklist:
- add_vulnerable genuinely builds SQL through string concatenation
- add_safe uses ? placeholders for a parameterised query
- The malicious input "); DROP TABLE records;-- is demonstrated
- The vulnerable version drops the table (or errors out), proving the injection works
- The safe version keeps the table and stores the malicious string as ordinary text
- The output clearly contrasts the two approaches
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Implement the ledger's "data layer + basic command-line interface": a complete db.py (create tables, CRUD, filtered queries, monthly and category summaries), plus cli.py offering four actions from the command line: "add a record / list this month's records / view category statistics / quit". All queries must be parameterised, with transaction management (with or try/except + rollback), and cli.py must show an init_db example at the top. Data is stored in a real file ledger_test.db (clean it up after testing).
starter: |
  # db.py skeleton
  import sqlite3
  from contextlib import contextmanager

  DB_PATH = "ledger_test.db"

  @contextmanager
  def get_conn():
      conn = sqlite3.connect(DB_PATH)
      conn.row_factory = sqlite3.Row
      try:
          yield conn
          conn.commit()
      except Exception:
          conn.rollback()
          raise
      finally:
          conn.close()

  def init_db(conn):
      # TODO: create tables
      pass

  def add_record(conn, amount, category, note=""):
      # TODO
      pass

  def list_records(conn, month=None, category=None):
      # TODO: optional filters
      return []

  def stats_by_category(conn, month=None):
      # TODO: GROUP BY category, sum(amount)
      return []

  # cli.py skeleton
  import db

  def main():
      with db.get_conn() as conn:
          db.init_db(conn)
      while True:
          print("\n1) Add  2) List this month  3) Category stats  4) Quit")
          c = input("> ")
          if c == "1":
              # TODO: read input, call db.add_record
              pass
          elif c == "2":
              # TODO
              pass
          elif c == "3":
              # TODO
              pass
          elif c == "4":
              break

  if __name__ == "__main__":
      main()
checklist:
- db.py creates all tables (four tables, or at least records)
- Every query is parameterised (no string concatenation)
- Transaction management is correct: commit on success, rollback on error
- All four cli.py actions work interactively from the command line
- Filtering supports month and category conditions
- Statistics use SQL GROUP BY to aggregate
- Data lives in a real ledger_test.db file, and persistence can be verified after running
- The code runs without errors and the flow is complete
```
