# Chapter 1 · Big Test

> The chapter on lists is finished. Now comes the check — do you **remember it**, can you **use it**, and can you actually **build something** with it?
>
> Do not worry about getting everything right first time. **Questions you miss will automatically return to your revision queue in 1 day** (Ebbinghaus forgetting curve), so you can try again then.

---

## Part 1 · Multiple Choice

These test whether the chapter's concepts have really stuck.

```quiz
type: choice
q: 'Given `nums = [10, 20, 30, 40]`, what are `nums[-1]` and `nums[3]`?'
options:
- 40 and 40
- 10 and 40
- 40 and 30
- An error — negative indexes do not exist
answer: 0
explain: A negative index of -1 is the last element, and the positive index 3 (the 4th) is also the last — both point to the same element, 40. Positive indexes start at 0, negative indexes start at -1; the two are just counted in opposite directions, and the final element is always nums[-1] or nums[len(nums)-1].
```

```quiz
type: choice
q: 'After running the code below, what is `result`?'
code: |
  scores = [87, 92, 78]
  result = scores.sort()
options:
- '[78, 87, 92]'
- None
- '[87, 92, 78]'
- An error — sort cannot be used this way
answer: 1
explain: sort() sorts in place — it changes scores itself to [78, 87, 92], but returns nothing, so result is None. To get a sorted result you either sort() and then print scores itself, or use sorted(scores) — that one returns a new list. This is the single most common mistake in the chapter.
```

```quiz
type: choice
q: 'Given `nums = [1, 2, 3, 2, 2]`, what does `nums` become after `nums.remove(2)`?'
options:
- '[1, 3]'
- '[1, 3, 2, 2]'
- '[1, 2, 3, 2]'
- An error, because there are duplicate elements
answer: 1
explain: remove deletes by value, and removes only the first match. So only the 2 at index 1 is removed; the two 2s after it stay put — the result is [1, 3, 2, 2]. To remove every 2 you would loop, or build a new list containing only the items that are not 2.
```

```quiz
type: choice
q: What does the following code print?
code: |
  a = [1, 2, 3]
  b = a
  b.append(4)
  print(a)
options:
- '[1, 2, 3]'
- '[1, 2, 3, 4]'
- '[1, 2, 3, 4, 4]'
- An error
answer: 1
explain: b = a is not a copy — it gives the same list a second name. a and b point at the same data, so changing b means changing a, and printing a also gives [1, 2, 3, 4]. For a genuine copy you write b = a[:] or b = list(a); then changing b no longer affects a.
```

```quiz
type: choice
q: 'Given `letters = ["a", "b", "c", "d"]`, how many elements are in `letters[1:3]`?'
options:
- 2
- 3
- 4
- 1
answer: 0
explain: The range is half-open — it includes index 1 but excludes index 3, so it contains only the elements at indexes 1 and 2, namely ["b", "c"]. The "end is excluded" rule is identical to range, so the two behave with exactly the same temperament.
```

---

## Part 2 · Code Questions

Remembering the concepts is not enough — you have to be able to write the code.

```quiz
type: code
q: Starting from an empty list, use append to add the strings "red", "green", and "blue" in that order, then print the list.
tests:
- assert "['red', 'green', 'blue']" in __out
hint: An empty list is []. append adds one element at a time, so three elements means three lines. The order matches the order you appended them in.
explain: Write lst = [] then three lines — lst.append("red") / lst.append("green") / lst.append("blue") — then print(lst). Remember that append returns None, so never write lst = lst.append("red") — that would turn lst into None and everything after it would break.
```

```quiz
type: code
q: 'Given the list `data = [5, 10, 15, 20]`, print its first element and its last element (using a negative index), each on its own line.'
starter: |
  data = [5, 10, 15, 20]

  # print the first element

  # print the last element (use a negative index)

tests:
- assert "5" in __out
- assert "20" in __out
- assert "10" not in __out
hint: The first element is at index 0, the last is at index -1. Print them on two separate lines.
explain: The answer is print(data[0]) and print(data[-1]). This tests indexing in both directions at once: positive counting starts at 0, negative counting starts at -1. The "10 not in __out" check stops you from cheating with data[1] — that would give you the second element instead.
```

```quiz
type: code
q: 'Given the list `nums = [1, 2, 3]`, change the second element to 99, then append 4 at the end, then print the whole list.'
starter: |
  nums = [1, 2, 3]

  # change the second element to 99

  # append 4 at the end

  print(nums)
tests:
- assert "[1, 99, 3, 4]" in __out
hint: The second element is at index 1. Change an element with assignment, add an element with append.
explain: The missing lines are nums[1] = 99 and nums.append(4). Two points are being tested: indexes start at 0 (the second element is 1, not 2), and append only adds at the end. Here the two operations do not interfere — changing index 1 and adding at the end means the order does not affect the result. But if the task were "change the last element to 99, then append", order really would matter.
```

```quiz
type: code
q: 'Given the list `nums = [10, 20, 30, 40, 50]`, take the **middle three** elements (20, 30, 40), put them in the variable `mid` and print it, then print the original list to confirm it was not changed.'
starter: |
  nums = [10, 20, 30, 40, 50]

  mid = # write the slice here

  print(mid)
  print(nums)
tests:
- assert "[20, 30, 40]" in __out
- assert "[10, 20, 30, 40, 50]" in __out
hint: 20 is at index 1 and 40 is at index 3 — what end position includes 40? Remember that the end is excluded.
explain: The answer is nums[1:4]. This is the classic "end is excluded" test: to capture indexes 1, 2, and 3, the end must be 4. Writing nums[1:3] would only give [20, 30]. The second assertion confirms you used a slice rather than pop/del — a slice never modifies the original list.
```

```quiz
type: code
q: 'Given the list `scores = [55, 90, 72, 48, 88]`, find all the **passing** scores (greater than or equal to 60), put them in a new list called `passed` and print it, then print the number of passing scores.'
starter: |
  scores = [55, 90, 72, 48, 88]
  passed = []

  for s in scores:
      # write the test and append the passing scores to passed here

  print(passed)
  print("Passing:", len(passed))
tests:
- assert "[90, 72, 88]" in __out
- assert "3" in __out
- assert "55" not in __out
- assert "48" not in __out
hint: Loop over each score, and if s >= 60 then passed.append(s). Get the count with len(passed) rather than counting by hand.
explain: The missing code is if s >= 60: passed.append(s) (two lines — watch the indentation). This is the core pattern of the chapter: loop, test, and collect into a new list. The result [90, 72, 88] keeps the original order, and the count of 3 is calculated with len rather than hard-coded — so swapping in different data would not require touching the code. Just do not remove items while iterating, or you will skip some.
```

