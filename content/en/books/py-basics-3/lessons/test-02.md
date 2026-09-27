# Chapter 2 · with, paths and data formats · Chapter Test

> Eight questions. This chapter is about finding and reading files safely and correctly.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Compared with open() + close() by hand, what's the big win of with?
options:
- Shorter code
- The file is guaranteed closed when the block ends, even if the block raised
- It runs faster
- It can open several files at once
answer: 1
explain: "Shorter" is true but secondary. The real win is guaranteed cleanup: a hand-written close never runs when something raises in between, so data can be lost and the file stays locked.
```

```quiz
type: choice
q: What is a relative path relative to?
options:
- The directory holding the code file
- The current working directory (where you ran the program)
- The C drive
- Python's installation directory
answer: 1
explain: This is why "the file is right there but Python can't find it" happens — a relative path resolves against the directory you ran from, not where the script lives.
```

```quiz
type: choice
q: What's the difference between os.mkdir('a/b') and os.makedirs('a/b')?
options:
- They're identical
- makedirs creates any missing parent folders too; mkdir doesn't
- mkdir is faster
- makedirs can only make one level
answer: 1
explain: When 'a' doesn't exist, mkdir('a/b') raises, while makedirs builds both. Day to day, makedirs with exist_ok=True is the least trouble — it won't crash on a second run.
```

```quiz
type: choice
q: Why must you pass newline='' when writing with the csv module?
options:
- It raises without it
- On Windows the \r\n csv writes gets converted again by text mode, adding a blank line between rows
- It's faster
- It makes the encoding work
answer: 1
explain: csv writes \r\n itself; Windows text mode converts \n into \r\n again, giving \r\r\n and a blank line between rows. newline='' disables that conversion.
```

```quiz
type: choice
q: Why is ensure_ascii=False recommended with json.dump?
options:
- It errors without it
- Without it non-ASCII text becomes \uXXXX escapes humans can't read (though it loads back fine)
- It compresses the file
- For Python 2 compatibility
answer: 1
explain: By default json escapes non-ASCII characters. The data loads back correctly, but the file can't be eyeballed. ensure_ascii=False stores the characters directly.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write read_json_safe(path): read the JSON file and return the object; return {} if the file is missing or empty
func: read_json_safe
starter: |
  def read_json_safe(path):
      # read the JSON file and return the object
      # return {} if the file is missing or empty
      return None
cases: |
  "u.json" -> {"name": "Ann", "age": 20}
hint: import os, json; if not os.path.exists(path): return {}; read the text, then if not content.strip(): return {}; finally json.loads(content).
explain: In real life JSON files are often missing or empty, and json.load raises on the empty case. Check first, then parse — your program shouldn't die just because a file is blank.
```

```quiz
type: code
q: Write a dict to a JSON file with with (ensure_ascii=False), read it back and print the age
starter: |
  import json
  
  user = {'name': 'Ann', 'age': 20}
  
  # with open('u.json','w',encoding='utf-8') as f:
  #     json.dump(user, f, ensure_ascii=False, indent=2)
  # then read it back
  
  print("edit here")
tests:
- assert "20" in __out
hint: Write with json.dump(user, f, ensure_ascii=False, indent=2); read with json.load(f) then print(d['age']).
explain: The smallest complete JSON persistence loop. Two things matter: ensure_ascii=False for readable text, indent=2 so the file can be inspected by hand.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "JSON to-do list": tasks live in a JSON file (each with title and done); add, list, mark done, delete; tasks survive a restart; a missing or empty file starts cleanly
checklist:
- Read and write with json.dump / json.load (ensure_ascii=False, indent=2)
- Each task is a dict with title and done
- Can add a task (append to the list, then save)
- Can list them all (numbered, with a ✓ marker)
- Can mark one done or delete it by number
- Missing or empty file → empty list, program still starts
- A menu built with while True + input
starter: |
  import json
  import os
  
  FILE = 'tasks.json'
  
  
  def load():
      # missing → []; empty content → []; otherwise json.loads
      pass
  
  
  def save(tasks):
      # json.dump(tasks, f, ensure_ascii=False, indent=2)
      pass
  
  
  while True:
      print("\n1.add  2.list  3.done  4.delete  5.quit")
      c = input("choose: ")
      # ...
hint: In load, check os.path.exists(FILE) first and then if not content.strip() for emptiness. Delete with tasks.pop(i-1). Remember to save(tasks) after changes.
explain: This project combines JSON persistence with the two edge cases (missing file, empty file) — exactly the line between "a program that works" and "practice code". Finish it and your program remembers things for the first time.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
import os
import json


def read_json_safe(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.strip():
        return {}
    return json.loads(content)
```

**Hands-on:**

```python
import json

user = {'name': 'Ann', 'age': 20}
with open('u.json', 'w', encoding='utf-8') as f:
    json.dump(user, f, ensure_ascii=False, indent=2)

with open('u.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(data['age'])
```

**Mini project:**

```python
import json
import os

FILE = 'tasks.json'


def load():
    if not os.path.exists(FILE):
        return []
    with open(FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.strip():
        return []
    return json.loads(content)


def save(tasks):
    with open(FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


while True:
    print("\n1.add  2.list  3.done  4.delete  5.quit")
    choice = input("choose: ").strip()

    tasks = load()

    if choice == '1':
        title = input("task: ").strip()
        if title:
            tasks.append({'title': title, 'done': False})
            save(tasks)
            print("added ✓")

    elif choice == '2':
        if not tasks:
            print("nothing yet")
        for i, t in enumerate(tasks, 1):
            mark = '✓' if t['done'] else ' '
            print(f"{i}. [{mark}] {t['title']}")

    elif choice == '3':
        n = int(input("which one is done? "))
        if 1 <= n <= len(tasks):
            tasks[n - 1]['done'] = True
            save(tasks)
            print("marked ✓")

    elif choice == '4':
        n = int(input("delete which? "))
        if 1 <= n <= len(tasks):
            removed = tasks.pop(n - 1)
            save(tasks)
            print(f"deleted: {removed['title']}")

    elif choice == '5':
        print("bye")
        break

    else:
        print("please enter 1-5")
```

</details>

## What you learned in this chapter

- **`with`**: closes files automatically, **even on error**; one line can open several
- **Paths**: relative resolves against the run location, not the code location; **use `/`**; `os.path.join` for portability
- **`os`**: `makedirs(exist_ok=True)`, `listdir` / `walk`, `isfile` / `isdir`
- **CSV**: tabular data; `DictReader` / `DictWriter` are clearest; **`newline=''` when writing**
- **JSON**: nested data; `dump`/`load` for files, `dumps`/`loads` for strings; **`ensure_ascii=False`**

**Next chapter: errors are normal** — `try` / `except` / `finally`, so your program survives the unexpected.
