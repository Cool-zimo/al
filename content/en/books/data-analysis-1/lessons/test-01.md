# Chapter 1 · From lists to arrays · Chapter Test

> Eight questions. Multiple choice checks the concepts, hands-on tasks make you write real code, and the final mini project ties the chapter together.
> **All correct to pass** — anything you miss goes into your review schedule automatically.

## Part 1 · Multiple choice

```quiz
type: choice
q: What does np.linspace(0, 10, 5) produce?
options:
- [0, 2, 4, 6, 8]
- [0, 2.5, 5, 7.5, 10]
- [0, 3, 6, 9]
- [2, 4, 6, 8, 10]
answer: 1
explain: linspace's third argument is the count and it includes both ends. 0 to 10 split into 5 gives a step of 2.5. arange(0, 10, 2) would give [0,2,4,6,8] (by step, excluding the end).
```

```quiz
type: choice
q: After arr = np.array([1,2,3], dtype=int); arr[0] = 3.9, what is arr[0]?
options:
- 3.9
- 3
- 4
- An error
answer: 1
explain: An int array silently truncates the fraction: 3.9 becomes 3, with no error. These quiet conversions are a classic source of numeric bugs.
```

```quiz
type: choice
q: Which is true about an array slice arr[1:3]?
options:
- It copies the data, so editing it leaves the original alone
- It is a view of the original, so editing it changes the original
- It behaves exactly like a list slice
- It changes the length of the original array
answer: 1
explain: An array slice returns a view, not a copy. For an independent copy write arr[1:3].copy(). A list slice does copy — the two behave oppositely, which is why this trips people up.
```

```quiz
type: choice
q: Why are NumPy arrays faster than lists?
options:
- Because NumPy is written in Python and better optimised
- Because elements sit contiguously in memory and batch work runs in underlying C
- Because arrays don't support strings, so they're faster
- Because arrays silently drop precision
answer: 1
explain: Two reasons: contiguous memory (cache friendly) plus C-level loops that bypass the Python interpreter's per-instruction work. Nothing to do with the language it's written in or with dropping precision.
```

```quiz
type: choice
q: What is np.array([1,2,3]) * np.array([2,3,4])?
options:
- [2, 6, 12]
- 20
- An error
- [[2,3,4],[4,6,8],[6,9,12]]
answer: 0
explain: * on arrays is element-wise, giving [1×2, 2×3, 3×4] = [2,6,12]. Matrix multiplication needs @ or np.dot().
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Create the numbers 0–11, arrange them into 3 rows and 4 columns, and print
starter: |
  import numpy as np
  
  # np.arange(12) makes 0-11
  # then reshape into 3 rows, 4 columns
  # and print it
  
  print("TODO: replace this line with your output")
tests:
- assert "[[ 0  1  2  3]" in __out
- assert "[ 8  9 10 11]]" in __out
hint: arr = np.arange(12), then print(arr.reshape(3, 4)). reshape needs the total to match: 3 × 4 = 12.
explain: arange to make the data plus reshape to set the shape is the most common way to build 2-D data. reshape(3, -1) works too, letting NumPy work out the columns.
```

```quiz
type: code
q: Add 100 to every element of the array the vectorised way, then sum it
starter: |
  import numpy as np
  
  arr = np.array([1, 2, 3, 4, 5])
  
  # no loop needed: just arr + 100
  # then sum it (the answer should be 515)
  
  print("TODO: replace this line with your output")
tests:
- assert "515" in __out
hint: print((arr + 100).sum()). arr + 100 adds 100 to each element, giving [101,102,103,104,105], which sums to 515.
explain: A scalar is broadcast to every element — the most visible form of vectorisation. The whole thing is one line with no for loop anywhere.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "class score reporter": generate random scores, compute statistics with arrays, and print a tidy report
checklist:
- Generated a set of random scores with np.random (at least 20)
- Created arrays with np.zeros or similar, rather than Python lists
- Used at least 3 aggregation functions (mean / max / min / std, etc.)
- Used a comparison plus sum to count something like "how many passed"
- Printed a neatly formatted report with f-strings
- The code runs clean with no errors
starter: |
  import numpy as np
  
  np.random.seed(42)
  # 30 random integer scores from 0 to 100
  scores = np.random.randint(0, 101, 30)
  
  print("=" * 30)
  print(f"average: {np.mean(scores):.1f}")
  print(f"highest: {np.max(scores)}")
  print(f"lowest: {np.min(scores)}")
  
  # keep going: pass count (>= 60), std dev, distinction rate (>= 85)
  
  print("=" * 30)
hint: Count passes with np.sum(scores >= 60) — True counts as 1 when summing. Standard deviation is np.std(scores). The distinction rate could be np.mean(scores >= 85).
explain: This project ties chapter 1 together: creating arrays, vectorised arithmetic, comparisons, aggregation and formatted output. Real data analysis is essentially this same workflow applied to different data.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on 1:**

```python
import numpy as np
arr = np.arange(12)
print(arr.reshape(3, 4))
```

**Hands-on 2:**

```python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print((arr + 100).sum())
```

**Mini project:**

```python
import numpy as np

np.random.seed(42)
scores = np.random.randint(0, 101, 30)

line = "=" * 34
print(line)
print(f"  count: {scores.size}")
print(f"  average: {np.mean(scores):.1f}")
print(f"  highest: {np.max(scores)}")
print(f"  lowest: {np.min(scores)}")
print(f"  std dev: {np.std(scores):.1f}")
print(f"  passed: {np.sum(scores >= 60)}")
print(f"  distinction: {np.mean(scores >= 85) * 100:.1f}%")
print(line)
```

</details>

## What you learned in this chapter

- **Why arrays exist**: a list's `+` concatenates, loops are slow, memory is scattered; arrays are contiguous and compute in bulk underneath
- **Six ways to create**: `array`, `zeros`, `ones`, `arange`, `linspace`, random (shapes go in as tuples)
- **dtype and shape**: one shared type is the rule, silent truncation is the risk; `reshape` changes shape, `-1` infers a dimension
- **Basic arithmetic**: scalars broadcast, operations are element-wise, comparisons yield boolean arrays, `argmax` gives an index not a value
- **Choosing**: compute with arrays, store with lists; never loop on `np.append`; slices are views, not copies

Next chapter covers **vectorisation and broadcasting** — where NumPy is genuinely powerful, and genuinely confusing.
