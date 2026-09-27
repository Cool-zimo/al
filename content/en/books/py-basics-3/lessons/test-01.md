# Chapter 1 · Files: making data survive · Chapter Test

> Eight questions. This chapter solves "my data vanishes when the program closes".
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Why does data in variables disappear when a program ends?
options:
- Python deletes it on purpose
- Variables live in memory, which is reclaimed when the program ends; to keep data you must write it to a file on disk
- The variable names clashed
- The computer is too slow
answer: 1
explain: Memory (RAM) is reclaimed when the program ends or power is lost — everything in it is gone. Disk is different: data in a file stays until you delete it. That's persistence.
```

```quiz
type: choice
q: What happens when you open an existing file in mode 'w'?
options:
- It fails because the file already exists
- The file's existing content is wiped immediately
- Content is appended to the end
- Nothing happens
answer: 1
explain: 'w' is the most dangerous mode — it empties the file the moment you open it, even if you never write. Use 'a' to keep content, or 'x' to refuse when the file exists.
```

```quiz
type: choice
q: If you call f.write("one") then f.write("two"), what's in the file?
options:
- Two lines
- One line "onetwo", because write() doesn't add newlines
- An error
- "two" overwrites "one"
answer: 1
explain: write() writes exactly what you give it and adds nothing — newlines are your job. This is unlike print(), which appends a newline by default.
```

```quiz
type: choice
q: Why does every line you read end with \n, and how do you stop print() adding a blank line?
options:
- The file is corrupt
- The newline character is read in with the line; use rstrip() or print(line, end='')
- Python adds it automatically
- It's an encoding problem
answer: 1
explain: The newline is a real character in the file, read in along with the line. print then adds another, hence the blank line. Fix: line.rstrip(), or print(line, end='') so print doesn't add one.
```

```quiz
type: choice
q: Which modes do you need to copy an image?
options:
- 'r' and 'w'
- 'rb' and 'wb' (binary mode)
- 'a'
- 'x'
answer: 1
explain: Images, audio and video are binary. Opening them in text mode corrupts them (Python tries to decode the bytes). Use 'rb' / 'wb' — and don't pass encoding in binary mode.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write count_lines(filename): read the file and return its number of lines (return 0 if the file doesn't exist)
func: count_lines
starter: |
  def count_lines(filename):
      # read the file and return how many lines it has
      # return 0 if the file does not exist
      return None
cases: |
  "t.txt" -> 3
hint: try: with open(filename, encoding='utf-8') as f: return len(f.readlines()) except FileNotFoundError: return 0. Use try/except for the missing-file case.
explain: Reading a file that might not exist is exactly what try/except FileNotFoundError is for. readlines() returns a list, so len() is the line count; an empty file gives 0 with no extra check.
```

```quiz
type: code
q: Append "new" to log.txt with mode 'a', then read the whole file and print it (should contain both old and new)
starter: |
  with open('log.txt', 'w', encoding='utf-8') as f:
      f.write("old\n")
  
  # append "new\n" with mode 'a'
  # then read with 'r'
  
  print("edit here")
tests:
- assert "new" in __out and "old" in __out
hint: with open('log.txt','a',encoding='utf-8') as f: f.write("new\n"); then with open('log.txt','r',encoding='utf-8') as f: print(f.read()).
explain: Append mode is the standard way to write a log — each run adds to the end and the history survives. Contrast 'w': it wipes on open, leaving only the last thing written.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "contacts book": save name and phone to a file by appending, list all contacts, search by keyword; when the file is missing or empty show a friendly message instead of crashing
checklist:
- Append contacts with mode 'a' (format like "Alice,5551234")
- Read them all with mode 'r' plus readlines()
- Search with `if keyword in line` across the lines
- Handle a missing file with os.path.exists or try/except — no crash
- Show "no contacts yet" when the file is empty
- Build a menu with while True + input (1 add / 2 list / 3 search / 4 quit)
- The code runs clean with no errors
starter: |
  import os
  
  FILE = 'contacts.txt'
  
  
  def add():
      name = input("Name: ")
      phone = input("Phone: ")
      # append with mode 'a': f"{name},{phone}\n"
      with open(FILE, 'a', encoding='utf-8') as f:
          f.write(f"{name},{phone}\n")
      print("saved")
  
  
  def show():
      # missing file → message; empty file → message
      # otherwise print each line numbered
      pass
  
  
  def search():
      key = input("Search: ")
      # go line by line with: if key in line
      pass
  
  
  while True:
      print("\n1.add  2.list  3.search  4.quit")
      c = input("choose: ")
      if c == '1':
          add()
      elif c == '2':
          show()
      elif c == '3':
          search()
      elif c == '4':
          break
hint: Check os.path.exists(FILE) before reading; after reading, use if not lines for emptiness. Search with for line in lines: if key in line: print(line.rstrip()).
explain: This project turns chapter 1 into something usable — and the crux is those two edge cases: missing file and empty file. Real programs crash mostly because nobody handled those two.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
def count_lines(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except FileNotFoundError:
        return 0
```

**Hands-on:**

```python
with open('log.txt', 'a', encoding='utf-8') as f:
    f.write("new\n")

with open('log.txt', 'r', encoding='utf-8') as f:
    print(f.read())
```

**Mini project:**

```python
import os

FILE = 'contacts.txt'


def add():
    name = input("Name: ").strip()
    phone = input("Phone: ").strip()
    if not name or not phone:
        print("name and phone are both required")
        return
    with open(FILE, 'a', encoding='utf-8') as f:
        f.write(f"{name},{phone}\n")
    print("saved ✓")


def load():
    """return all contacts; empty list if missing or empty"""
    if not os.path.exists(FILE):
        return []
    with open(FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return [line.rstrip() for line in lines if line.strip()]


def show():
    contacts = load()
    if not contacts:
        print("no contacts yet")
        return
    print("\n--- contacts ---")
    for i, c in enumerate(contacts, 1):
        print(f"{i}. {c}")


def search():
    key = input("Search: ").strip()
    contacts = load()
    found = [c for c in contacts if key in c]
    if not found:
        print(f"nothing matching '{key}'")
        return
    print(f"\n{len(found)} found:")
    for c in found:
        print(" ", c)


while True:
    print("\n1.add  2.list  3.search  4.quit")
    choice = input("choose: ").strip()
    if choice == '1':
        add()
    elif choice == '2':
        show()
    elif choice == '3':
        search()
    elif choice == '4':
        print("bye")
        break
    else:
        print("please enter 1-4")
```

</details>

## What you learned in this chapter

- **Why files**: variables live in memory and die with the program; files live on disk and survive
- **Three modes**: `'r'` read (raises if missing), `'w'` write (**wipes**), `'a'` append (safe)
- **Four ways to read**: `read()` whole, `readline()` one line, `readlines()` list, **`for line in f` preferred**
- **Writing**: `write()` **adds no newline**, strings only, convert numbers
- **Edge cases**: missing file, empty file — where real programs most often break

**Next chapter: the `with` statement and file paths** — safer and less to remember.
