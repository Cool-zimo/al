# Chapter 3 · Errors are normal · Chapter Test

> Eight questions. This chapter decides whether your program shatters or shrugs things off.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Where should you start reading a traceback?
options:
- The first line
- The last line (the exception type and message)
- The middle
- Everywhere is equally important
answer: 1
explain: The last line says what actually went wrong (e.g. IndexError: list index out of range); the lines above show how you got there. Start at the bottom, then look up for the source.
```

```quiz
type: choice
q: Why is a bare except: (no exception type) discouraged?
options:
- It raises an error
- It swallows every error, including bugs you didn't anticipate, hiding the real problem
- It's slower
- It can only catch one kind of error
answer: 1
explain: A bare except swallows typos (NameError) and Ctrl+C too. You see "something went wrong" forever and never find the real bug. For a fallback use Exception, which at least doesn't swallow Ctrl+C.
```

```quiz
type: choice
q: What's the difference between else and finally?
options:
- They're the same
- else runs only when nothing failed; finally runs either way
- else runs when something failed
- finally runs only when something failed
answer: 1
explain: except on failure, else on success, finally always. else moves unprotected code out of try so it can't be masked; finally does cleanup.
```

```quiz
type: choice
q: When should you raise rather than return None?
options:
- Always
- Raise when something shouldn't have happened (like an invalid argument); return None for normal cases like "not found"
- Only with files
- Never raise
answer: 1
explain: raise signals "this input is wrong, we shouldn't continue" — a negative age, say. "No search results" is a normal outcome where None fits better.
```

```quiz
type: choice
q: What's the right layering for a robust program?
options:
- Wrap everything in try/except
- Check what you can with if; use try/except for the uncontrollable; raise for things that shouldn't happen
- Use raise everywhere
- Let it crash — it's the user's fault
answer: 1
explain: Each level has its place: logic you control gets an if check; user input, files and networks get try/except; invalid arguments get raise. Good code uses all three.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write to_int_safe(s): try to convert s to an int and return it; return None if it can't be converted
func: to_int_safe
starter: |
  def to_int_safe(s):
      # try to convert s to an int and return it
      # return None if it cannot be converted
      return None
cases: |
  "42" -> 42
hint: try: return int(s) except (ValueError, TypeError): return None. Note that None itself makes int() raise TypeError.
explain: Type conversion is a ValueError hotspot. Catch ValueError (bad value) and TypeError (wrong type entirely, e.g. None was passed), returning None for "couldn't convert" — far friendlier than crashing.
```

```quiz
type: code
q: Use try/except/finally: print "conversion failed" when int("abc") fails, and print "cleanup done" no matter what
starter: |
  try:
      n = int("abc")
  except ValueError:
      print("conversion failed")
  finally:
      print("edit here")
tests:
- assert "cleanup done" in __out and "conversion failed" in __out
hint: After finally: write print("cleanup done"). Code in finally runs whether or not there was an error, and even if there's a return.
explain: finally is the "always happens" part — typically for closing files or dropping connections. with is essentially syntactic sugar for try/finally.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build an "unbreakable score manager": add student scores, list them, show the average, save to and load from JSON. Requirements — non-numeric or out-of-range (0-100) scores prompt again, an empty name is rejected, the average with no data doesn't crash, and a missing or corrupt file still starts up cleanly
checklist:
- Write an input_number function (while True + try/except, with optional min/max)
- On add, check the name isn't empty and the score is 0-100
- The average gives a message instead of crashing when there's no data
- Save and load with json (ensure_ascii=False, indent=2)
- Loading handles three cases: missing file, empty file, invalid JSON
- A failed save (OSError) reports rather than crashes
- A menu built with while True + input
starter: |
  import json
  
  FILE = 'students.json'
  
  
  def input_number(prompt, min_val=None, max_val=None):
      # while True: read → try float → on failure continue → check range → return
      pass
  
  
  def load():
      # FileNotFoundError → {}; empty content → {}; JSONDecodeError → {}
      pass
  
  
  def save(data):
      # json.dump; catch OSError and return False
      pass
  
  
  students = load()
  
  while True:
      print("\n1.add  2.list  3.average  4.save  5.quit")
      c = input("choose: ")
      # ...
hint: In the average branch, return early with if not students. In load, use three separate except clauses. In input_number, continue when the conversion fails.
explain: This is chapter 3's final exam — "unbreakable" means thinking through every silly thing a user might do: non-numeric input, out-of-range values, empty names, no data, corrupt files. Finish it and the quality of what you write jumps a level.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
def to_int_safe(s):
    try:
        return int(s)
    except (ValueError, TypeError):
        return None
```

**Hands-on:**

```python
try:
    n = int("abc")
except ValueError:
    print("conversion failed")
finally:
    print("cleanup done")
```

**Mini project:**

```python
import json

FILE = 'students.json'


def input_number(prompt, min_val=None, max_val=None):
    while True:
        raw = input(prompt).strip()
        try:
            n = float(raw)
        except ValueError:
            print("  ✗ please enter a number")
            continue
        if min_val is not None and n < min_val:
            print(f"  ✗ can't be below {min_val}")
            continue
        if max_val is not None and n > max_val:
            print(f"  ✗ can't be above {max_val}")
            continue
        return n


def load():
    try:
        with open(FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return {}
    except PermissionError:
        print("no permission to read")
        return {}
    if not content.strip():
        return {}
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("corrupt file — starting empty")
        return {}


def save(data):
    try:
        with open(FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except OSError as e:
        print(f"save failed: {e}")
        return False


students = load()
print(f"loaded {len(students)} student(s)")

while True:
    print("\n1.add  2.list  3.average  4.save  5.quit")
    choice = input("choose: ").strip()

    if choice == '1':
        name = input("name: ").strip()
        if not name:
            print("  ✗ name can't be empty")
            continue
        score = input_number("score: ", 0, 100)
        students[name] = score
        print(f"  ✓ added {name}")

    elif choice == '2':
        if not students:
            print("  no students yet")
        for n, s in students.items():
            print(f"  {n}: {s}")

    elif choice == '3':
        if not students:
            print("  no scores yet")
        else:
            avg = sum(students.values()) / len(students)
            print(f"  average: {avg:.1f}")

    elif choice == '4':
        if save(students):
            print("  ✓ saved")

    elif choice == '5':
        save(students)
        print("bye")
        break

    else:
        print("  please enter 1-5")
```

</details>

## What you learned in this chapter

- **What exceptions are**: a program stops and reports; **read the last line of a traceback**
- **`try/except`**: catch errors; **never a bare except**; `as e` for details; specific clauses first
- **`else` / `finally`**: success-only versus always (`with` is the latter in disguise)
- **`raise`**: refuse bad input; custom exceptions inherit `Exception`
- **Three levels**: check (if) → catch (try/except) → refuse (raise)

**Next chapter: modules and import** — splitting your code across files.
