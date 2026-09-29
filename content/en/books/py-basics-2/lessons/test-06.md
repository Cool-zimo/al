# Chapter 6 · Big Test

> Chapter 6 — Advanced Functions — is done: functions as objects, `*args`/`**kwargs`, `lambda` and higher-order functions, recursion, and refactoring. Now the check: **do you remember it, can you use it, and can you build something with it?**
>
> Do not worry about getting everything right first time. **Questions you get wrong come back automatically in 1 day** (Ebbinghaus's forgetting curve), so you get another shot then.

---

## Part 1 · Multiple Choice

Checking that the concepts of this chapter really stuck.

```quiz
type: choice
q: Which is the correct way to store the function `double` in a list?
options:
- 'ops = [double()]'
- 'ops = [double]'
- 'ops = double'
- 'ops = call double'
answer: 1
explain: ops = [double] stores the function object itself. A stores the return value of double() (a number); C makes ops a single variable, not a list; D is a syntax error.
```

```quiz
type: choice
q: '`def f(a, *args, **kwargs): pass`. After `f(1, 2, 3, name="Alice")`, what are `args` and `kwargs`?'
options:
- 'args=(1,), kwargs={"name": "Alice"}'
- 'args=(2, 3), kwargs={"name": "Alice"}'
- 'args=(1, 2, 3), kwargs={}'
- 'args=(), kwargs={"a": 1, "name": "Alice"}'
answer: 1
explain: a first claims the positional argument 1; the remaining positionals 2 and 3 go into args as the tuple (2, 3); the keyword argument name="Alice" goes into kwargs as a dict.
```

```quiz
type: choice
q: Which `lambda` is written correctly?
options:
- 'f = lambda x: x = x + 1'
- 'f = lambda x: x * 2'
- 'f = lambda: x * 2'
- 'f = lambda x: if x > 0: return x'
answer: 1
explain: A lambda body can only be one expression — no assignment, and no if statement block. B's x * 2 is a valid expression. A has an assignment, C is missing a parameter, and D is a statement block.
```

```quiz
type: choice
q: '`nums = [{"score": 90}, {"score": 60}, {"score": 100}]`. Which option sorts them from highest score to lowest, and leaves `nums` itself reordered?'
options:
- 'sorted(nums, key=lambda s: s["score"])'
- 'sorted(nums, key=lambda s: s["score"], reverse=True)'
- 'sorted(nums, key=lambda s: s["score"] == 100)'
- 'nums.sort(key=lambda s: s["score"], reverse=True) and then print nums'
answer: 3
explain: B and D are both syntactically valid and both sort descending, but B returns a new list and leaves nums unchanged; D uses list.sort, which reorders nums in place, so printing nums shows the result. The question asks for nums itself to become descending, so only D does that.
```

```quiz
type: choice
q: Which recursive function is guaranteed to raise RecursionError?
options:
- 'def f(n): return 1 if n<=1 else n*f(n-1)'
- 'def f(n): return f(n+1)'
- 'def f(n):\n    if n<=0: return\n    f(n-1)'
- 'def f(): return 1'
answer: 1
explain: B's f(n+1) makes the problem larger on every call with no stopping condition to hit, so it always blows up. A has a stopping condition and shrinks by n-1; C stops at n<=0; D does not even recurse.
```

---

## Part 2 · Hands-On

Remembering is not enough — you have to be able to write it.

```quiz
type: code
q: Use `sorted` with a `key` lambda to sort the name list `names = ["Alice", "Bobby", "C", "Daisy"]` by **name length, shortest first**, and print the result.
starter: |
  names = ["Alice", "Bobby", "C", "Daisy"]
  # use sorted + lambda (key=lambda n: len(n))

  print(...)
tests:
- assert "['C', 'Alice', 'Bobby', 'Daisy']" in __out
hint: sorted(names, key=lambda n: len(n)). key wants the function itself, not a call result like len(names).
explain: The answer is sorted(names, key=lambda n: len(n)). This tests sorted's key parameter — sorting by name length rather than by the name itself.
```

```quiz
type: function
q: Write a function `sum_all(*numbers)` that accepts any number of numbers and returns their sum. With no arguments it returns 0.
func: sum_all
starter: |
  def sum_all(*numbers):
      return 0
cases: |
  1, 2, 3 -> 6
  10, 20 -> 30
  -> 0
hint: *numbers gathers the arguments into a tuple; just return sum(numbers). sum of an empty tuple is 0.
explain: The answer is def sum_all(*numbers): return sum(numbers). This tests *args gathering any number of positionals, plus sum.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Use what you learned in Chapter 6 to build a "shopping cart tool": write four functions — `add_item(cart, item, price)` (add a `{"item": item, "price": price}` dict to the cart list), `total_price(cart)` (return the cart's total price), `filter_affordable(cart, max_price)` (use `filter` + a lambda to return the items whose price is at most max_price), and `sort_by_price(cart)` (use `sorted` + a lambda key to return a new list sorted by price, highest first). Then in the main flow: add apple 5.5, milk 8 and bread 3.5; print the total, the items costing £6 or less, and the price-sorted list.
starter: |
  cart = []

  def add_item(cart, item, price):
      # add a dict to the list

  def total_price(cart):
      # use sum to compute the total

  def filter_affordable(cart, max_price):
      # use filter + lambda, and remember list()

  def sort_by_price(cart):
      # use sorted + a lambda key (key=lambda g: g["price"]), reverse=True

  # main flow: add the three items, print total, £6-or-less items, and the sorted list
checklist:
- add_item appends a dict to cart, modifying it in place
- total_price uses sum with dict lookups to get the total
- filter_affordable uses filter + lambda and converts with list()
- sort_by_price uses sorted + a lambda key, descending
- The main flow is clear and each of the four functions has one job
```
