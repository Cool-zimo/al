# Chapter 5 · Big Test

> Chapter 5 — Function Basics — is done: from "why have functions at all", through defining and calling them, `return`, and scope. Now the check: **do you remember it, can you use it, and can you build something with it?**
>
> Do not worry about getting everything right first time. **Questions you get wrong come back automatically in 1 day** (Ebbinghaus's forgetting curve), so you get another shot then.

---

## Part 1 · Multiple Choice

Checking that the concepts of this chapter really stuck.

```quiz
type: choice
q: '`def add(a, b): s = a + b`. What does `add(3, 5)` return?'
options:
- '8'
- 'None'
- 'error'
- 'nothing happens'
answer: 1
explain: The function computes s = a + b but never writes return, and Python specifies that a function with no return gives back None. This is the single most important trap in Chapter 5.
```

```quiz
type: choice
q: Which of these function definitions has its parameters in the correct order?
options:
- 'def f(a=1, b): pass'
- 'def f(a, b=2): pass'
- 'def f(a=1, b, c=3): pass'
- 'def f(b=2, a, c=3): pass'
answer: 1
explain: The iron rule is "positionals before defaults". Only B obeys it. A, C and D all put a default before a positional and will raise SyntaxError.
```

```quiz
type: choice
q: There is a global variable `counter = 0`, then this function is defined. What happens when `inc()` is called?
code: |
  counter = 0

  def inc():
      counter += 1
options:
- 'counter becomes 1'
- 'it errors with UnboundLocalError'
- 'counter becomes None'
- 'nothing happens'
answer: 1
explain: inc assigns to counter, so Python treats counter as local; but counter += 1 reads the local counter first, and it has not been assigned yet, hence UnboundLocalError. To change a global you must write global.
```

```quiz
type: choice
q: '`def f(): return 1, 2, 3`. After `x = f()`, what is the type of `x`?'
options:
- 'int'
- 'list'
- 'tuple'
- 'dict'
answer: 2
explain: return 1, 2, 3 is the same as return (1, 2, 3), so a tuple comes back. "Several return values" is just sugar over tuple unpacking.
```

```quiz
type: choice
q: What is the correct way to test whether a function's result is None?
options:
- 'if x == None:'
- 'if x is None:'
- 'if not x:'
- 'if x == False:'
answer: 1
explain: None is a singleton, and the convention is is None / is not None. And when the result could be 0, an empty string or an empty list (all falsy), if not x misclassifies them — you must use is None.
```

---

## Part 2 · Hands-On

Remembering is not enough — you have to be able to write it.

```quiz
type: code
q: Write a function `is_adult(age)` that tests whether someone is an adult (>=18): return True if so, False otherwise. Then use it to test 20 and 15 and print the results.
starter: |
  def is_adult(age):
      # return age >= 18

  print(is_adult(20))
  print(is_adult(15))
tests:
- assert "True" in __out
- assert "False" in __out
hint: Just return age >= 18; a comparison expression is already a boolean. Note it is return, not print.
explain: The answer is def is_adult(age): return age >= 18. This tests the very common pattern of "returning a boolean test directly".
```

```quiz
type: function
q: Write a function `calculate(price, quantity, discount=0)` that returns `price * quantity * (1 - discount)` rounded to 2 decimal places with `round(..., 2)`. `discount` defaults to 0.
func: calculate
starter: |
  def calculate(price, quantity, discount=0):
      return 0
cases: |
  100, 2, 0.1 -> 180
  50, 3 -> 150
  200, 1, 0.5 -> 100
hint: return round(price * quantity * (1 - discount), 2). discount has a default of 0, so the call may omit it.
explain: The answer is def calculate(price, quantity, discount=0): return round(price * quantity * (1 - discount), 2). This tests default arguments plus returning the computed result.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Using what you learned in Chapter 5, build a "simple grade manager": write three functions, `add_score(scores, name, score)` (add one record to the dict `scores`), `get_average(scores)` (return the average of all scores, rounded to 1 decimal place), and `get_top_student(scores)` (return the name of the person with the highest score). Then in the main flow: add Alice 92, Bob 78 and Carol 100, and print the average and the top student.
starter: |
  scores = {}

  def add_score(scores, name, score):
      # add one record to the dict

  def get_average(scores):
      # return round(average, 1)

  def get_top_student(scores):
      # use max(scores, key=scores.get) to find the highest-scoring name

  # main flow: add three records, print the average and the top student
checklist:
- add_score adds records to the dict
- get_average uses sum/len and rounds to 1 decimal place
- get_top_student uses max(..., key=scores.get) to find the top name
- The main flow is clear and each of the three functions has one job
```
