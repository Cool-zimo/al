# Chapter 1 · Final Test

> The lists chapter is done. Here's the check — do you **remember it**, can you **use it**, can you **build something** with it?
>
> Don't aim for a perfect score on the first try. **Questions you get wrong come back to your review list automatically after 1 day** (Ebbinghaus forgetting curve), so you'll get another shot.

---

## Part 1 · Multiple Choice

Checking whether the concepts actually stuck.

```quiz
type: choice
q: With `nums = [10, 20, 30, 40]`, what are `nums[-1]` and `nums[3]`?
options:
- 40 and 40
- 10 and 40
- 40 and 30
- It errors — negative indexes don't exist
answer: 0
explain: The negative index -1 is the last element, and positive index 3 (the 4th) is also the last — they point at the same 40. Positive indexes count up from 0, negative indexes count down from -1; they're just opposite directions, and the last element is always nums[-1] or nums[len(nums)-1].
```

```quiz
type: choice
q: After running this code, what is `result`?
code: |
  scores = [87, 92, 78]
  result = scores.sort()
options:
- [78, 87, 92]
- None
- [87, 92, 78]
- It errors — sort can't be used that way
answer: 1
explain: sort() sorts in place — it turns scores itself into [78, 87, 92], but returns **nothing**, so result is None. To actually get the sorted result, either print scores after sort(), or use sorted(scores) — that one returns a new list. This is the single most frequent mistake in the chapter.
```

```quiz
type: choice
q: With `nums = [1, 2, 3, 2, 2]`, what does the list become after `nums.remove(2)`?
options:
- [1, 3]
- [1, 3, 2, 2]
- [1, 2, 3, 2]
- It errors, because there are duplicate elements
answer: 1
explain: remove deletes by *value*, and only the **first** match per call. So just the 2 at index 1 goes; the two 2s behind it stay put — the result is [1, 3, 2, 2]. To wipe out every 2 you'd need a loop, or build a new list of everything that isn't 2.
```

```quiz
type: choice
q: What does this code print?
code: |
  a = [1, 2, 3]
  b = a
  b.append(4)
  print(a)
options:
- [1, 2, 3]
- [1, 2, 3, 4]
- [1, 2, 3, 4, 4]
- It errors
answer: 1
explain: b = a is **not a copy** — it's a second name for the same list. a and b point at one piece of data, so changing b changes a, and printing a gives [1, 2, 3, 4]. To make a real copy write b = a[:] or b = list(a); then changing b leaves a alone.
```

```quiz
type: choice
q: With `letters = ["a", "b", "c", "d"]`, how many elements does `letters[1:3]` have?
options:
- 2
- 3
- 4
- 1
answer: 0
explain: Half-open — index 1 included, index 3 excluded — so only indexes 1 and 2, giving ["b", "c"]. "The stop isn't included" is exactly the same rule as range; two places, one temper.
```

---

## Part 2 · Code Questions

Remembering isn't enough — you have to be able to write it.

```quiz
type: code
q: Starting from an empty list, use append to add the strings "red", "green" and "blue" in that order, then print the list.
tests:
- assert "['red', 'green', 'blue']" in __out
hint: An empty list is []. append adds one element at a time, so three things means three lines. The order matches the order you added them.
explain: Write lst = [], then three lines lst.append("red"), lst.append("green"), lst.append("blue"), and finally print(lst). Note that append returns None — never write lst = lst.append("red"), which turns lst into None and breaks everything after it.
```

```quiz
type: code
q: Given `data = [5, 10, 15, 20]`, print its first element and its last element (using a negative index), each on its own line.
starter: |
  data = [5, 10, 15, 20]

  # print the first

  # print the last (using a negative index)

tests:
- assert "5" in __out
- assert "20" in __out
- assert "10" not in __out
hint: The first is index 0, the last is index -1. Use two separate print lines.
explain: The answer is print(data[0]) and print(data[-1]). This tests both counting directions at once: positive starts at 0, negative starts at -1. The assertion 10 not in __out stops you from sneaking through with data[1] — that's the second number.
```

```quiz
type: code
q: Given `nums = [1, 2, 3]`, change the second element to 99, then append 4 at the end, and print the whole list.
starter: |
  nums = [1, 2, 3]

  # change the second element to 99

  # append 4 at the end

  print(nums)
tests:
- assert "[1, 99, 3, 4]" in __out
hint: The index of "the second" is 1. Change an element with assignment; add one with append.
explain: You fill in nums[1] = 99 and nums.append(4). Two things tested: indexes start at 0 (the second is 1, not 2), and append only reaches the end — the result is [1, 99, 3, 4] with 4 last. Here the two operations don't interfere: one changes index 1, the other adds at the end, so the order doesn't matter. It would matter if you were changing the *last* element and then appending.
```

```quiz
type: code
q: Given `nums = [10, 20, 30, 40, 50]`, take the **middle three** (20, 30, 40) into a variable called `mid` and print it. Then print the original list to confirm it wasn't changed.
starter: |
  nums = [10, 20, 30, 40, 50]

  mid = # write the slice here

  print(mid)
  print(nums)
tests:
- assert "[20, 30, 40]" in __out
- assert "[10, 20, 30, 40, 50]" in __out
hint: 20 is at index 1 and 40 is at index 3 — what must the stop be to include 40? Remember the stop isn't included.
explain: You fill in nums[1:4]. This is the classic test of "the stop isn't included": to capture indexes 1, 2 and 3 you must write 4. With nums[1:3] you'd only get [20, 30]. The second assertion confirms you used a slice rather than pop or del — a slice leaves the original alone.
```

```quiz
type: code
q: Given `scores = [55, 90, 72, 48, 88]`, collect every score that **passes** (60 or above) into a new list called `passed` and print it; then print how many passed.
starter: |
  scores = [55, 90, 72, 48, 88]
  passed = []

  for s in scores:
      # write the test here, collecting passing scores into passed

  print(passed)
  print("Passed:", len(passed))
tests:
- assert "[90, 72, 88]" in __out
- assert "3" in __out
- assert "55" not in __out
- assert "48" not in __out
hint: Iterate every score, and if s >= 60 then passed.append(s). Get the count from len(passed) — don't hard-code it.
explain: You fill in if s >= 60: passed.append(s) — two lines, mind the indentation. This is the chapter's core pattern: iterate → test → collect into a new list. The result [90, 72, 88] keeps the original order, and the count 3 comes from len rather than being written by hand — swap in different data and the code still works. Don't remove while iterating; that skips elements.
```
