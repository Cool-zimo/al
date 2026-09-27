# Chapter 4 · Modules and import · Chapter Test

> Eight questions. This chapter turns "a file" into "an organised project".
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: In Python, what is a "module"?
options:
- A special kind of function
- A .py file
- A folder
- A class
answer: 1
explain: A module is one .py file. A folder of modules is a "package"; a collection of packages is a "library". Three levels, easy to mix up.
```

```quiz
type: choice
q: Why is "from module import *" discouraged?
options:
- It raises an error
- You can't tell what got imported, it can overwrite existing names, and you lose track of where functions come from
- It's slower
- It only imports functions
answer: 1
explain: Two fatal problems: ① every name is dumped into your namespace and may silently overwrite your own functions; ② reading the code you can't tell which module add() came from.
```

```quiz
type: choice
q: What does "if __name__ == '__main__':" do?
options:
- Defines the main function
- Distinguishes "imported" from "run directly": the code below runs only when this file is executed directly
- Makes the code faster
- It's required syntax
answer: 1
explain: Python sets __name__ automatically: "__main__" when run directly, the module name when imported. So this guard makes entry-point or test code run only in the direct case.
```

```quiz
type: choice
q: What does __init__.py do?
options:
- It's required, or the package won't work
- Marks the folder as a package; can simplify imports and define __all__
- Holds class definitions
- Holds test code
answer: 1
explain: Since Python 3.3 a folder works without it, but keeping it is recommended. Its real value is simplifying imports — "from .helpers import format_date" there lets outsiders write "from utils import format_date".
```

```quiz
type: choice
q: What is requirements.txt for?
options:
- Recording which third-party libraries and versions a project uses, so others can install them at once
- A required Python config file
- Storing code
- Counting lines of code
answer: 0
explain: Without it, a recipient can't run your code for missing libraries. Generate: pip freeze > requirements.txt. Install: pip install -r requirements.txt.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write word_count(text): count word frequencies with collections.Counter and return the most common word
func: word_count
starter: |
  def word_count(text):
      # count word frequencies with collections.Counter
      # return the single most common word
      return None
cases: |
  "a b a c a" -> "a"
hint: from collections import Counter; return Counter(text.split()).most_common(1)[0][0]. most_common returns a list of (word, count) tuples.
explain: Counter(...).most_common(1) returns something like [('a', 3)], so you need [0][0] to get the word itself. The handiest counting tool in the standard library — far shorter than a dict loop.
```

```quiz
type: code
q: Use the math module to compute 2 to the power of 10 (with pow) and print it
starter: |
  import math
  
  # math.pow(2, 10) is 1024.0
  
  print("edit here")
tests:
- assert "1024" in __out
hint: print(math.pow(2, 10)). You could also use the built-in 2 ** 10, but this demonstrates calling through a module.
explain: After "import math", call as math.function. The module name is both a namespace (avoiding clashes) and a signal to readers about where the function came from.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "multi-file task manager": split it into config.py (constants), storage.py (JSON read/write), tasks.py (business logic) and main.py (menu entry point), guarding the entry with if __name__ == "__main__"
checklist:
- At least 3 modules, each owning one concern (constants / storage / logic)
- Import each other with "from ... import ..." or "import ..."
- storage.py handles errors (missing file, invalid content)
- Every module has an "if __name__ == '__main__':" block for self-testing
- main.py provides a menu (add / list / done / quit)
- Constants (filename, max length) live in config.py in ALL CAPS
- The code runs clean with no errors
starter: |
  # config.py
  FILE = 'tasks.json'
  MAX_TITLE = 50
  
  # storage.py
  import json
  import os
  from config import FILE
  
  
  def load():
      # missing → []; empty → []; invalid JSON → []
      pass
  
  
  def save(tasks):
      pass
  
  
  # tasks.py
  from storage import load, save
  
  
  def add(title):
      pass
  
  
  def list_all():
      pass
  
  
  # main.py
  from tasks import add, list_all
  
  
  def main():
      pass
  
  
  if __name__ == "__main__":
      main()
hint: Since the browser runs a single snippet, put all the parts in one file with comment separators. The point is the layering: constants → storage → logic → entry.
explain: This project tests your ability to organise code — the same features, split into four thin layers that are each easy to change. And "if __name__ == '__main__'" lets every module be imported yet still run standalone for testing.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
from collections import Counter


def word_count(text):
    return Counter(text.split()).most_common(1)[0][0]
```

**Hands-on:**

```python
import math
print(math.pow(2, 10))
```

**Mini project (layers shown together):**

```python
import json
import os

# ===== config.py =====
FILE = 'tasks.json'
MAX_TITLE = 50


# ===== storage.py =====
def load():
    try:
        with open(FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return []
    if not content.strip():
        return []
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return []


def save(tasks):
    try:
        with open(FILE, 'w', encoding='utf-8') as f:
            json.dump(tasks, f, ensure_ascii=False, indent=2)
        return True
    except OSError as e:
        print(f"save failed: {e}")
        return False


# ===== tasks.py =====
def add(title):
    title = title.strip()
    if not title:
        return "title can't be empty"
    if len(title) > MAX_TITLE:
        return f"title can't exceed {MAX_TITLE} characters"
    tasks = load()
    tasks.append({'title': title, 'done': False})
    save(tasks)
    return f"added: {title}"


def list_all():
    tasks = load()
    if not tasks:
        return "nothing yet"
    lines = []
    for i, t in enumerate(tasks, 1):
        mark = '✓' if t['done'] else ' '
        lines.append(f"{i}. [{mark}] {t['title']}")
    return "\n".join(lines)


# ===== main.py =====
def main():
    while True:
        print("\n1.add  2.list  3.quit")
        c = input("choose: ").strip()
        if c == '1':
            print(add(input("title: ")))
        elif c == '2':
            print(list_all())
        elif c == '3':
            break
        else:
            print("please enter 1-3")


if __name__ == "__main__":
    main()
```

</details>

## What you learned in this chapter

- **A module is one `.py` file**; a package is a folder of modules
- **Four imports**: `import m` (recommended), `import m as x`, `from m import f`, `from m import *` (**don't**)
- **`if __name__ == "__main__"`**: imported versus run directly
- **`__init__.py`**: marks a package, simplifies imports, defines `__all__`
- **pip**: install third-party libraries; **requirements.txt** records them
- **The standard library is vast**: `math` `random` `datetime` `os` `json` `collections` `re` …

**Next chapter: classes and objects** — bundling data with the operations on it.
