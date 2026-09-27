# Chapter 4 Test

> This chapter covers Lessons 16 (defining and returning from functions), 17 (parameters and unpacking), 18 (scope and mutation), 19 (string methods), and 20 (file I/O) of the *Review* book.
> 8 questions total: Part 1 has 5 multiple-choice questions, Part 2 has 2 hands-on questions, and Part 3 has 1 small project. 100 points total; 60 to pass.

---

## Part 1 — Multiple Choice

```quiz
type: choice
q: 1. (Functions) What does this code output?
code: |
  def add(a, b):
      return a + b

  print(add(2, 3))
  print(add("2", "3"))
options:
- "5 and 5"
- "5 and 23"
- "5 and '23'"
- "TypeError"
answer: 2
explain: The same function add behaves differently depending on argument types: integers add to 5; strings concatenate to "23". This is Python's polymorphism (duck typing) in action. The return value is the string "23", not the number 23, so the answer is "5 and '23'".
```

```quiz
type: choice
q: 2. (Parameters) When calling `f(1, 2, 3, a=4)`, which function signature is valid?
code: |
  def f(...):
      pass
options:
- "def f(a, b, c, d)"
- "def f(*args, **kwargs)"
- "def f(a, b, c, d, e=5)"
- "Both B and C above"
answer: 3
explain: The positional arguments 1,2,3 need at least three parameters to catch them; the keyword argument a=4 requires that a be a parameter (or be caught by **kwargs). B's *args catches 1,2,3 and **kwargs catches a=4, so it is valid. C's a,b,c catch 1,2,3, d catches 4, and e takes its default 5, so it is also valid. In A, a is already occupied by the positional 1, so a=4 would be a duplicate and raise TypeError.
```

```quiz
type: choice
q: 3. (Scope) What does this code output?
code: |
  x = 10
  def func():
      x = 20
      print(x)
  func()
  print(x)
options:
- "20 and 20"
- "20 and 10"
- "10 and 20"
- "error"
answer: 1
explain: The x = 20 inside the function creates a **local variable x**, not the same as the global x. So func() prints the local 20, and the outer print(x) prints the global 10. Modifying a global requires global x. This is the most-tested scope trap.
```

```quiz
type: choice
q: 4. (String methods) What does `"  a  b  c  ".split()` produce?
options:
- "['  a', ' b', ' c  ']"
- "['a', 'b', 'c']"
- "['', 'a', '', 'b', '', 'c', '']"
- "error"
answer: 1
explain: With no argument, split() splits on any whitespace, collapses consecutive whitespace, and drops leading/trailing whitespace. So no matter how many spaces sit between them, the result is the clean ['a','b','c']. To keep the empty slots, use split(' ') explicitly.
```

```quiz
type: choice
q: 5. (File I/O) Which snippet will **erase** the existing contents of the file?
code: |
  A. open("report.txt", "r")
  B. open("report.txt", "w")
  C. open("report.txt", "a")
  D. open("report.txt", "x")
options:
- "Only B"
- "B and D"
- "A and C"
- "B, C, and D"
answer: 0
explain: Mode w truncates the file to 0 bytes when opening, so the original contents are lost. a appends, r reads only, and x creates only if the file does not exist (otherwise it raises FileExistsError) — none of them erase. This is the most dangerous file-mode behavior.
```

---

## Part 2 — Hands-On

```quiz
type: function
q: 6. Write word_count(text): count the number of **words** in an English text. A word is a sequence of one or more consecutive letters (either case). Every other character counts as a separator. Hint: you can use the no-argument behavior of split(), or iterate. For example, word_count("Hello, world! ni hao Python3") returns 3 (Hello, world, and ni are words; Python3 contains a digit so it does not count). Only process strings; no file I/O.
func: word_count
starter: |
  def word_count(text):
      # split and filter
      return 0
cases: |
  ("Hello, world! ni hao Python3") -> 3
  ("   a   b   c   ") -> 3
  ("") -> 0
  ("!!!,,,;;;") -> 0
  ("One-Two Three") -> 3
hint: Calling split() with no arguments splits on any whitespace and collapses consecutive whitespace; then check whether each piece consists only of letters with str.isalpha().
explain: First use split() to get pieces separated by whitespace, then filter each piece with isalpha() — isalpha() accepts only pure letter characters (including Chinese etc.), so "Python3" contains a digit and returns False. An empty string's split() gives [''], and isalpha() on '' is False, so empty input returns 0.
```

```quiz
type: function
q: 7. Write merge_reports(reports): simulate merging several logs. reports is a list of strings, each element being the contents of one log (possibly multi-line, with lines separated by \n). Merge all logs into one: separate logs with a divider line "----------", and **do not leave a trailing newline at the end**. An empty list returns an empty string. Do no real file I/O.
func: merge_reports
starter: |
  def merge_reports(reports):
      # join the logs with a divider line
      return ""
cases: |
  (["err1", "err2\nerr3", "err4"]) -> "err1\n----------\nerr2\nerr3\n----------\nerr4"
  (["only one"]) -> "only one"
  ([]) -> ""
hint: First strip the trailing newline from each log (if present), then join with "\n----------\n".
explain: The key is handling newlines and trailing separators. "\n----------\n".join(reports) is the cleanest approach: join never adds a separator before the first element or after the last, so there is no "trailing newline" problem. A single-element list joins to itself; an empty list joins to "".
```

---

## Part 3 — Small Project

```quiz
type: function
q: 8. Small project: score-sheet processor. Write process_scores(raw): raw is a **multi-line score sheet supplied in memory** (a string), each line in the format "name,score". The score may be an integer or a decimal, lines are separated by \n, and there may be blank lines and leading/trailing whitespace. Do the following: 1) parse every valid line (non-empty after stripping, and splittable into a name and a score); 2) compute the average score (rounded to two decimal places); 3) return a formatted result string in this exact format:

Line 1: "===== Score Report =====" (fixed);
Line 2: "Count: N" (N is the number of valid entries);
Line 3: "Average: XX.XX";
Then, in the original order, one line per entry: "name: score", with the score to one decimal place;
Final line: "==================".

Example: process_scores("Alice,95\nBob,88.5\n\nCarol,72\n") returns:
===== Score Report =====
Count: 3
Average: 85.17
Alice: 95.0
Bob: 88.5
Carol: 72.0
==================

Requirements: use round or an f-string to keep two decimal places; cast the score to float; if the input is empty, return "===== Score Report =====\nCount: 0\nAverage: 0.00\n==================". Process everything in memory; do no real file I/O.
func: process_scores
starter: |
  def process_scores(raw):
      lines = [line.strip() for line in raw.split("\n")]
      records = []
      for line in lines:
          if not line:
              continue
          if "," not in line:
              continue
          name, score = line.split(",", 1)
          name = name.strip()
          try:
              score = float(score.strip())
          except ValueError:
              continue
          records.append((name, score))
      if not records:
          return "===== Score Report =====\nCount: 0\nAverage: 0.00\n=================="
      # compute the average and build the formatted output
      return ""
cases: |
  ("Alice,95\nBob,88.5\n\nCarol,72\n") -> "===== Score Report =====\nCount: 3\nAverage: 85.17\nAlice: 95.0\nBob: 88.5\nCarol: 72.0\n=================="
  ("") -> "===== Score Report =====\nCount: 0\nAverage: 0.00\n=================="
  ("    \n  ,\nAlice,100\nabc\nBob,60.75\n") -> "===== Score Report =====\nCount: 2\nAverage: 80.38\nAlice: 100.0\nBob: 60.8\n=================="
hint: average = sum(s for _, s in records) / len(records); use f"{avg:.2f}" for two decimals. Build the output by joining lines with "\n".
explain: This comprehensively tests string splitting (split with no argument vs. split on ","), strip, exception handling, list comprehensions, and f-string formatting (:2f and :.1f). Lesson 7's core idea is "treat a string as a data structure to parse" — here every line must be split into name and score, with blank lines and malformed lines filtered out, which neatly combines the material from Lessons 19 and 20. Alice 95 + Bob 88.5 + Carol 72 = 255.5; divided by 3 that is 85.1666..., which rounds to 85.17.
```
