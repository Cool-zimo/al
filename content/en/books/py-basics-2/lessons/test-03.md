# Chapter 3 · Big Test

> The chapter on dictionaries is finished. Now comes the check — do you **remember it**, can you **use it**, and can you actually **build something** with it?
>
> Do not worry about getting everything right first time. **Questions you miss will automatically return to your revision queue in 1 day** (Ebbinghaus forgetting curve), so you can try again then.

---

## Part 1 · Multiple Choice

These test whether the chapter's concepts have really stuck.

```quiz
type: choice
q: 'Given `d = {"a": 1, "b": 2}`, what does `d` become after `d["c"] = 3`?'
options:
- An error, KeyError
- '{"a": 1, "b": 2, "c": 3}'
- '{"c": 3}'
- None
answer: 1
explain: Square-bracket assignment on a dictionary is "present updates, absent creates". Since c is absent, a new entry is added. This is unlike a list, where assigning past the end raises an IndexError.
```

```quiz
type: choice
q: 'Given `d = {"a": 1}`, which option safely returns 0 when the key is absent and leaves the dictionary unchanged?'
options:
- 'd["b"]'
- 'd.get("b", 0)'
- 'd.setdefault("b", 0)'
- 'd.pop("b")'
answer: 1
explain: get returns the default 0 when the key is absent and does not modify the dictionary. setdefault also returns a default, but it writes "b": 0 into the dictionary, which violates "leaves the dictionary unchanged". pop without a default raises an error.
```

```quiz
type: choice
q: What happens when you delete keys while iterating over a dictionary?
options:
- It is silently ignored and nothing is deleted
- It sometimes succeeds and sometimes raises RuntimeError
- It always raises KeyError
- It makes a copy first and then deletes
answer: 1
explain: Python forbids changing a dictionary's structure during iteration, but the exact moment of detection is not fixed — sometimes the loop happens to finish without triggering it, sometimes it raises at once. The safe approach is to iterate a list copy of keys(), or collect the keys and delete them afterwards.
```

```quiz
type: choice
q: Which of these can successfully be used as a dictionary key?
options:
- '[1, 2, 3]'
- '{"a": 1}'
- '(1, 2, [3, 4])'
- '(1, 2, 3)'
answer: 3
explain: The first three all contain mutable objects (a list, a dict, and a list nested inside a tuple), so none of them are hashable. Only (1, 2, 3) is a purely immutable tuple and can be used as a key. Pay special attention to the third option — a tuple containing a list is still rejected.
```

```quiz
type: choice
q: 'Given `count = {"a": 3, "b": 3, "c": 1}`, what does `max(count, key=count.get)` do?'
options:
- Raises ValueError
- Returns "a" (the first maximum encountered)
- Returns ["a", "b"]
- Returns "c"
answer: 1
explain: max returns only a single value. When several are tied for maximum, it returns the one encountered first during iteration. To collect every joint winner you must filter them yourself.
```

---

## Part 2 · Hands-on Questions

Remembering the concepts is not enough — you have to be able to write the code.

```quiz
type: code
q: 'Given the dictionary `scores = {"Alice": 92, "Bob": 78, "Carol": 55, "Diana": 100}`, loop over it and print the students who **failed** (score < 60) in the format `XX failed`, collect their names into a list called `failed`, then print `failed`.
starter: |
  scores = {"Alice": 92, "Bob": 78, "Carol": 55, "Diana": 100}
  failed = []

  # loop, print the failures, and collect them into failed

  print(failed)
tests:
- assert "Carol failed" in __out
- assert "['Carol']" in __out
- assert "Alice failed" not in __out
hint: Use items() to get the name and score together, then test for < 60, print, and append to failed.
explain: The answer is for name, s in scores.items(): if s < 60: print(f"{name} failed"); failed.append(name). Only Carol, with 55, fails. This tests iterating with items() and filtering by a condition while collecting results.
```

```quiz
type: function
q: Write a function `invert_dict` that takes a dictionary and returns a **new** dictionary with the keys and values swapped: the original values become the new keys and the original keys become the new values. You may assume that every value is hashable and that no two values are the same.
func: invert_dict
starter: |
  def invert_dict(d):
      return {}
cases: |
  {"a": 1, "b": 2} -> {1: "a", 2: "b"}
  {"Alice": "London", "Bob": "Paris"} -> {"London": "Alice", "Paris": "Bob"}
hint: Iterate over d.items(), and for each k, v write result[v] = k.
explain: The answer is r = {}; for k, v in d.items(): r[v] = k; return r. This tests dictionary iteration and building a "reverse mapping". Because the values are all distinct, there is no key collision.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Using the grouping pattern from this chapter, group students by grade band. Given `scores = [("Alice", 92), ("Bob", 55), ("Carol", 78), ("Diana", 45), ("Eve", 88)]`, divide them into three groups — excellent for >= 90, pass for >= 60, and fail for the rest — then print the roster for each group.
starter: |
  scores = [
      ("Alice", 92), ("Bob", 55), ("Carol", 78),
      ("Diana", 45), ("Eve", 88),
  ]

  # group by grade band and print
checklist:
- Build the grouping dictionary with setdefault or a membership check
- The grouping rule is excellent for >= 90, pass for >= 60, fail for the rest
- All three groups are correct (excellent: Alice; pass: Carol, Eve; fail: Bob, Diana)
- The output is clear and readable
```
