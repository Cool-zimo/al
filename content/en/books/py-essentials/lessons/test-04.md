# Chapter 4 Review

## Multiple Choice

```quiz
type: choice
exam: true
q: What does the following code print?
code: |
  x = 10
  def func():
      x = 20
      print(x)
  func()
  print(x)
options:
- 20 / 20
- 20 / 10
- 10 / 20
- 10 / 10
answer: 1
explain: x = 20 inside the function is local and only affects the function body; the global x remains 10, so the final print outputs 10.
```

```quiz
type: choice
exam: true
q: You want to add one new record to the end of a log file while keeping what is already there. Which mode should you use?
options:
- "r"
- "w"
- "a"
- "x"
answer: 2
explain: a is append mode and writes at the end; w would truncate the file; r is read-only; x creates a new file and errors if it exists.
```

```quiz
type: choice
exam: true
q: Which function definition raises a SyntaxError?
code: |
  # A
  def f(a, b=1):
      pass
  # B
  def g(a=1, b):
      pass
  # C
  def h(a, *args):
      pass
  # D
  def k(a, b=1, *args):
      pass
options:
- A
- B
- C
- D
answer: 1
explain: A parameter without a default cannot follow one with a default, so B violates the order. A, C, and D are all valid.
```

```quiz
type: choice
exam: true
q: After running the code below, what is the value of name?
code: |
  name = "  Alice  "
  name.strip()
  print(name)
options:
- "Alice"
- "  Alice"
- "  Alice  "
- error
answer: 2
explain: strip returns a new string rather than modifying the original, and the result is never assigned back, so name stays unchanged.
```

```quiz
type: choice
exam: true
q: What does list(zip([1, 2, 3], ['a', 'b'])) evaluate to?
options:
- [(1, 'a'), (2, 'b'), (3, None)]
- [(1, 'a'), (2, 'b')]
- [(1, 'a'), (2, 'b'), (3, 'b')]
- error
answer: 1
explain: zip stops at the shorter sequence, which has only two elements, so only two pairs are produced.
```

## Hands-On Practice

```quiz
type: function
exam: true
q: Write a function safe_divide(a, b) that returns None when b is 0 and None when a or b cannot be converted to a number, otherwise returns a / b as a float
func: safe_divide
starter: |
  def safe_divide(a, b):
      return 0
cases: |
  10, 2 -> 5.0
  10, 0 -> None
  "10", 2 -> 5.0
  "abc", 2 -> None
hint: Wrap the conversions and division in try/except: int(a), int(b), then return a / b; except returns None.
explain: Defensive programming turns uncontrollable input into a controlled return value with try/except.
```

```quiz
type: function
exam: true
q: Write a function acronym(text) that returns the acronym formed by the uppercase first letter of every word in text (e.g. "hyper text markup language" -> "HTML")
func: acronym
starter: |
  def acronym(text):
      return ""
cases: |
  "hyper text markup language" -> "HTML"
  "world health organization" -> "WHO"
  "a" -> "A"
hint: Split into words, take the first letter of each, uppercase it, then join; or use a list comprehension.
explain: split + per-word processing + join is the standard pipeline for normalising text.
```

## Mini Project

```quiz
type: function
exam: true
q: Build a tiny "gradebook" module with three functions in one file: add_student(book, name, score) appends {"name": name, "score": score} to the book list; average_score(book) returns the average of all scores (return 0 if the book is empty); top_student(book) returns the name of the student with the highest score (or None if empty)
func: add_student
starter: |
  def add_student(book, name, score):
      pass

  def average_score(book):
      return 0

  def top_student(book):
      return None
cases: |
  book = []; add_student(book, "Alice", 90); add_student(book, "Bob", 85); average_score(book) -> 87.5
  book = [{"name": "Carol", "score": 92}]; top_student(book) -> "Carol"
  book = []; average_score(book) -> 0; top_student(book) -> None
hint: add_student appends a dict; average_score sums the scores and divides by len(book), guarding against an empty book; top_student uses max(book, key=lambda s: s["score"])["name"].
explain: This mini-project combines dictionaries, lists, functions, and max with key — the core skills of a small real-world tool.
```
