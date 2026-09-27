# Chapter 5 — Showtime — Big Test

> 8 questions. This chapter answers the question "combine the first four chapters to write a program that runs, persists, and tolerates errors" — exception handling, modules and packages, comprehensions and built-ins, and two integrated projects.
> **You must get all of them right to pass this chapter.**

## Part 1 — Multiple Choice

```quiz
type: choice
q: What does running this code output?
code: |
  try:
      x = 10 / 0
  except ZeroDivisionError:
      print("A")
  except Exception:
      print("B")
  else:
      print("C")
  finally:
      print("D")
options:
- A D
- B D
- A C D
- A B D
answer: 0
explain: 10 / 0 raises ZeroDivisionError, hitting the first except and printing A; finally always runs and prints D. else only runs when nothing was raised, so C is not printed; Exception is the parent and comes later, so it never gets a turn.
```

```quiz
type: choice
q: Which of the following is correct about module imports?
code: |
  from math import *
  sqrt = 3.14
  print(sqrt(9))
options:
- Prints 3.14, because sqrt was reassigned
- Prints 3.0, because function calls take priority over variables
- Raises TypeError, because sqrt has been overwritten with a float
- Syntax error
answer: 2
explain: from math import * brings sqrt into the current namespace, then sqrt = 3.14 shadows the function name with a variable. Calling sqrt(9) then tries to call a float as a function, producing TypeError: 'float' object is not callable. This is exactly why import * is dangerous.
```

```quiz
type: choice
q: What does running this code output?
code: |
  nums = [3, 1, 2]
  nums.sort()
  result = nums.sort(reverse=True)
  print(result)
options:
- "[3, 2, 1]"
- "None"
- "[1, 2, 3]"
- error
answer: 1
explain: list.sort() sorts in place and returns None. The first nums.sort() turns nums into [1,2,3]; the second nums.sort(reverse=True) turns it into [3,2,1] and returns None, which is assigned to result. So it prints None, not a sorted list.
```

```quiz
type: choice
q: Which of these expressions evaluates to True?
code: |
  A: all([])
  B: any([])
  C: all([1, 2, 3])
options:
- Only A
- Only C
- Both A and C
- All three
answer: 2
explain: all([]) is vacuously true, so it returns True; any([]) has no truthy witness, so it returns False; all([1,2,3]) has every element truthy, so it returns True. Thus both A and C are True.
```

```quiz
type: choice
q: What does running this code output?
code: |
  data = [("Alice", 88), ("Bob", 95), ("Carol", 70)]
  result = sorted(data, key=lambda t: t[1], reverse=True)
  print(result[1][0])
options:
- Alice
- Bob
- Carol
- error
answer: 1
explain: key=lambda t: t[1] sorts by score in descending order, giving [("Bob",95), ("Alice",88), ("Carol",70)]. result[1] is ("Alice",88), and result[1][0] is "Alice".
```

## Part 2 — Hands-On

```quiz
type: function
q: Write robust_parse(text): split text on commas, convert each piece to an integer, and return a list of integers. If a piece cannot be converted, skip it (do not raise). If there are no valid integers after splitting, return an empty list. Use try/except
func: robust_parse
starter: |
  def robust_parse(text):
      # split on commas, iterate over each piece, try int(), skip on failure
      return []
cases: |
  "1,2,3" -> [1, 2, 3]
  "1,abc,3,10" -> [1, 3, 10]
  "abc,xyz" -> []
  "" -> []
  "5, 6, 7" -> [5, 6, 7]
hint: text.split(",") gives the pieces; iterate, strip each one, try int(), and continue on ValueError.
explain: This ties together "string processing + exception handling + list building". An empty string's split is [""], int("") raises ValueError and is skipped, returning [] as expected. Be careful not to strip the whole string before splitting — that would turn "1, 2" into one piece "1, 2".
```

```quiz
type: function
q: Write make_roster(records): records is a list of strings, each in the form "name:subject:score" (e.g. "Alice:Math:92"). Return two things: a dict whose keys are names and whose values are that person's total score, and a list of the names of students with an absent/missing record (the score piece is not a number or is empty). Use zip/split to unpack, comprehensions or dict methods to aggregate, and try/except for score conversion
func: make_roster
starter: |
  def make_roster(records):
      # return (totals_dict, absent_list)
      # example: {"Alice": 180}  ["Bob"]
      return {}, []
cases: |
  ["Alice:Math:92", "Alice:English:88", "Bob:Math:75", "Bob:English:abc"] -> ({"Alice": 180, "Bob": 75}, ["Bob"])
  ["Carol:Science:60"] -> ({"Carol": 60}, [])
  [] -> ({}, [])
hint: Loop over records, split(":") into three pieces, try int(score) — on failure add the name to absent, on success accumulate the score into totals[name].
explain: This is an integrated problem: split unpacking + dict aggregation + exception handling + list collection. Returning two values is a very common Python pattern. Note that the absent list must be deduplicated — if one person misses two subjects, list them only once. Use a set as an intermediate or check if name not in absent.
```

## Part 3 — Small Project

```quiz
type: project
q: Write a "library lending register" program that supports: adding a book (title, author, lending status), finding books by substring in the title, toggling a book between borrowed and returned, listing all books, counting holdings by author, and quitting. Requirements: 1) data is a list of dicts, each with title/author/borrowed (boolean); 2) pure functions must not use input/print, and interaction logic is written separately; 3) when toggling status, warn the user if the book is not found; 4) count-by-author returns a structured dict ({author: count}), not a print; 5) substring search is case-insensitive; 6) before quitting, prompt to save (this problem does not require actual file writing — just print "saved" is enough)
starter: |
  books = []

  def add_book(books, title, author):
      # return True; borrowed defaults to False
      return True

  def find_books(books, keyword):
      # substring match, case-insensitive
      return []

  def toggle_borrow(books, title):
      # flip the lending status of the named book; return True/False
      return False

  def count_by_author(books):
      # return a dict {author: count}
      return {}

  def render(books):
      # only prints
      pass

  def main():
      # menu loop: 1 Add  2 Find  3 Borrow/Return  4 List all  5 Count by author  q Quit
      pass

  if __name__ == "__main__":
      main()
hint: Split the six tasks into six functions, each under 15 lines. keyword.lower() in title.lower() gives a case-insensitive substring match. For count_by_author, use a dict's setdefault or collections.Counter.
checklist:
- Data is a list of dicts with the three fields title/author/borrowed
- add_book correctly creates a dict and appends it; borrowed defaults to False
- find_books uses substring matching and is case-insensitive (lower() on both sides)
- toggle_borrow returns False when the book is not found, and main reports based on that; when found it flips the boolean
- count_by_author returns a structured dict and does not print inside the function
- render only prints and does not recompute statistics
- The menu has a quit option; on quit it prints "saved" (no real file write required)
- Unknown menu options have a fallback message
- Uses if __name__ == "__main__": as the entry guard
```
