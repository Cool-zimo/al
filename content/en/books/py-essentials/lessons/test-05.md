# Chapter 5 Review

## Multiple Choice

```quiz
type: choice
exam: true
q: What does the following code print?
code: |
  try:
      print("start")
      int("abc")
      print("end")
  except ValueError:
      print("caught")
  finally:
      print("cleanup")
options:
- start / end / cleanup
- start / caught / cleanup
- start / caught
- error
answer: 1
explain: int("abc") raises ValueError, so Python jumps to except and prints "caught"; finally always runs and prints "cleanup". "end" comes after the failing line and never executes.
```

```quiz
type: choice
exam: true
q: Which import lets you call sqrt(16) directly?
options:
- import math
- from math import sqrt
- import math.sqrt
- import sqrt from math
answer: 1
explain: from math import sqrt brings sqrt into the current namespace so it can be called by name. import math requires math.sqrt. C and D are not valid syntax.
```

```quiz
type: choice
exam: true
q: Which snippet correctly sorts contacts by their name field?
code: |
  # A
  sorted(contacts, key=lambda c: c["name"])
  # B
  sorted(contacts, key=c["name"])
  # C
  sorted(contacts, key="name")
  # D
  sorted(contacts)
options:
- A
- B
- C
- D
answer: 0
explain: key expects a callable, and A correctly passes a lambda that fetches the name field. B and C are not callable; D sorts by the whole dict by default, with unpredictable results.
```

```quiz
type: choice
exam: true
q: You want to build a double-clickable desktop window app fast. Which library ships with Python and is the easiest to start with?
options:
- requests
- tkinter
- flask
- pandas
answer: 1
explain: tkinter is part of the standard library and works as soon as Python is installed, so it is the easiest place to start. requests is for HTTP, flask is for the web, and pandas is for data analysis.
```

```quiz
type: choice
exam: true
q: What does the following code print?
code: |
  def make_counter():
      count = 0
      def counter():
          nonlocal count
          count += 1
          return count
      return counter

  c = make_counter()
  print(c(), c())
options:
- 1 1
- 1 2
- 2 2
- error
answer: 1
explain: nonlocal tells Python to use the count from the enclosing scope; each call increments it, so the two calls return 1 and 2.
```

## Hands-On Practice

```quiz
type: function
exam: true
q: Write a function long_words_sorted(words) that returns the words whose length is at least 3, sorted by length in descending order
func: long_words_sorted
starter: |
  def long_words_sorted(words):
      return []
cases: |
  ["a", "hello", "go", "python", "is", "great"] -> ["python", "great", "hello"]
  ["a", "b", "c"] -> []
  ["one", "two"] -> ["one", "two"]
hint: First use a list comprehension to keep only words with len(w) >= 3, then sort with sorted(..., key=len, reverse=True).
explain: Filtering followed by sorting is the standard pipeline before displaying data; key=len sorts by string length.
```

```quiz
type: function
exam: true
q: Write a function search_contacts(contacts, keyword) that returns a new list of contacts whose name or email contains the keyword, case-insensitively
func: search_contacts
starter: |
  def search_contacts(contacts, keyword):
      return []
cases: |
  [{"name":"Alice","phone":"138","email":"alice@x.com"},{"name":"Bob","phone":"139","email":"bob@x.com"}], "ali" -> [{"name":"Alice",...}]
  [{"name":"Alice"}], "wang" -> []
hint: Iterate over contacts and test with keyword.lower() in c["name"].lower() or keyword.lower() in c["email"].lower().
explain: Fuzzy search is a core feature of contact books and admin systems; combining string methods is a fundamental skill.
```

## Mini Project

```quiz
type: function
exam: true
q: Build a "sales ledger" with three functions: add_sale(ledger, region, amount) appends {"region": region, "amount": amount}; total_by_region(ledger) returns a dict of total sales per region; save_ledger(ledger, filename) writes the ledger to a JSON file with ensure_ascii=False and indent=2
func: add_sale
starter: |
  import json

  def add_sale(ledger, region, amount):
      pass

  def total_by_region(ledger):
      return {}

  def save_ledger(ledger, filename):
      pass
cases: |
  ledger = []; add_sale(ledger, "North", 100); add_sale(ledger, "South", 200); add_sale(ledger, "North", 50); total_by_region(ledger) -> {"North": 150, "South": 200}
  ledger = []; total_by_region(ledger) -> {}
hint: add_sale appends a dict; total_by_region builds a dict with ledger[r]["region"] = ledger[r].get(...) + amount; save_ledger uses json.dump(ledger, f, ensure_ascii=False, indent=2) inside a with block.
explain: This mini-project combines list operations, dictionary counting, JSON persistence, and with statements — a realistic end-of-book capstone.
```
