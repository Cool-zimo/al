# Chapter 2 · Vectorisation & broadcasting · Chapter Test

> Eight questions. This is NumPy's most central and most confusing chapter, so the test includes both concept checks and a question that actually calls the function you write.
> **All correct to pass** — anything you miss goes into your review schedule automatically.

## Part 1 · Multiple choice

```quiz
type: choice
q: Why is vectorisation fast, fundamentally?
options:
- Because it uses Python loops that have been optimised
- Because the bulk work runs in C underneath and the data sits contiguously in memory
- Because it quietly reduces precision
- Because it skips type checks, so results may be slightly wrong
answer: 1
explain: Two reasons: contiguous memory (cache friendly) plus C-level bulk execution that never walks the Python interpreter. It doesn't reduce precision or skip correctness.
```

```quiz
type: choice
q: What does np.where(scores < 60, 0, scores) do?
options:
- Returns every score below 60
- Replaces anything below 60 with 0 and keeps the rest
- Replaces 0 with 60
- Counts how many scores are below 60
answer: 1
explain: np.where(condition, value if true, value if false) is an element-wise ternary. Here anything below 60 becomes 0; everything else keeps its value. To extract only the matching elements you'd use boolean indexing: scores[scores < 60].
```

```quiz
type: choice
q: An array of shape (2,3) added to one of shape (2,) gives?
options:
- (2,3), with the (2,) stretched across columns
- (2,3), with the (2,) stretched across rows
- An error; they cannot broadcast
- (2,), with the extra part dropped
answer: 2
explain: The classic broadcasting trap. (2,) becomes (1,2) after prepending, and its final 2 clashes with the final 3 of (2,3). For per-row you need (2,1) — reshape(-1,1) or v[:, np.newaxis].
```

```quiz
type: choice
q: Which is true of np.maximum versus np.max?
options:
- They are identical
- np.maximum(a,b) takes the larger at each position and returns an array; np.max(a) finds the single largest value
- np.max returns an array and np.maximum returns a scalar
- np.maximum only works on 1-D arrays
answer: 1
explain: The one with "mum" compares two arrays element-wise and returns an array; the one without aggregates to a scalar. The same naming pattern runs through NumPy (minimum/min, maximum/max).
```

```quiz
type: choice
q: With a (3,4) score table, how do you centre each student by their own average?
options:
- scores - scores.mean(axis=1)
- scores - scores.mean(axis=1).reshape(-1, 1)
- scores - scores.mean(axis=0)
- scores - scores.mean()
answer: 1
explain: mean(axis=1) gives (3,), which aligns to columns and clashes with (3,4). Reshape to (3,1) to say "one value per student" so it broadcasts across rows.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Use np.where to turn every value below 0 into 0, then print
starter: |
  import numpy as np
  
  arr = np.array([3, -2, 0, -9, 5])
  
  # hint: np.where(arr < 0, 0, arr)
  # result should be [3 0 0 0 5]
  
  print("TODO: replace this line with your output")
tests:
- assert "[3 0 0 0 5]" in __out
hint: print(np.where(arr < 0, 0, arr)). Three arguments: condition, value when true, value when false.
explain: Clamping negatives is ubiquitous in data cleaning and machine learning — the ReLU activation is exactly this. One line with np.where, and the intent reads clearly.
```

```quiz
type: function
q: Write row_add(m, v): add each value of v to the matching ROW of matrix m
func: row_add
starter: |
  import numpy as np
  
  def row_add(m, v):
      # m is a (2,3) 2-D array
      # v is a length-2 1-D array (one offset per row)
      # hint: plain m + v errors! make v a column (2,1) first
      return None
cases: |
  [[1,2,3],[4,5,6]], [10,20] -> [[11,12,13],[24,25,26]]
  [[0,0]], [5,7] -> [[5,5],[7,7]]
hint: return np.array(m) + np.array(v).reshape(-1, 1). Turning v into a (2,1) column lets it broadcast across the 3 columns.
explain: This tests the core "broadcast across rows" move. Adding directly fails because (2,) aligns to columns; reshape(-1,1) states "one value per row", after which broadcasting stretches it across every column.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "score standardiser": take a score table, standardise it per column (z-score), and report each person's relative strengths
checklist:
- Created a 2-D array (at least 3 rows, 3 columns)
- Computed per-column mean and standard deviation with axis=0
- Used broadcasting for (raw - mean) / std
- Used np.where or np.clip at least once for extra handling
- Printed tidy output with f-strings
- The code runs clean with no errors
starter: |
  import numpy as np
  
  # 4 students × 3 subjects
  scores = np.array([[80, 90, 70],
                     [60, 75, 85],
                     [95, 88, 92],
                     [70, 65, 78]])
  
  # mean and std per subject (axis=0 means across rows, one result per column)
  col_mean = scores.mean(axis=0)
  col_std = scores.std(axis=0)
  
  # standardise with broadcasting: (scores - col_mean) / col_std
  z = (scores - col_mean) / col_std
  
  print("standardised (positive = above average):")
  print(np.round(z, 2))
  
  # keep going: find each student's strongest subject with argmax(axis=1)
hint: Per-subject means come from scores.mean(axis=0). After standardising, positive means above average. Find the strongest subject with np.argmax(z, axis=1). Use np.round(z, 2) for tidier output.
explain: This project ties chapter 2 together: vectorised arithmetic (no loops), the idea of axis, broadcasting (applying a column mean to every row), conditional handling, and output. Real data preprocessing is essentially combinations of these same moves.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on 1:**

```python
import numpy as np
arr = np.array([3, -2, 0, -9, 5])
print(np.where(arr < 0, 0, arr))
```

**Hands-on 2:**

```python
import numpy as np

def row_add(m, v):
    m = np.array(m)
    v = np.array(v).reshape(-1, 1)
    return m + v
```

**Mini project:**

```python
import numpy as np

scores = np.array([[80, 90, 70],
                   [60, 75, 85],
                   [95, 88, 92],
                   [70, 65, 78]])

col_mean = scores.mean(axis=0)
col_std = scores.std(axis=0)
z = (scores - col_mean) / col_std

subjects = ["Lang", "Maths", "English"]
print("=" * 34)
for i in range(z.shape[0]):
    best = np.argmax(z[i])
    print(f"  student {i+1}  strongest: {subjects[best]}")
print("standardised matrix:")
print(np.round(z, 2))
print("=" * 34)
```

</details>

## What you learned in this chapter

- **Vectorisation**: turn per-element handling into whole-array operations, an order of magnitude faster; `np.where` replaces if-else loops
- **ufuncs**: element-wise universal functions — maths, rounding, trig, comparisons, cumulative
- **Broadcasting rules**: prepend 1s to the shorter shape, compare right to left, equal or one-is-1 means it works
- **Two directions**: `(n,)` broadcasts across columns; for rows you must `reshape(-1, 1)` first
- **Reading errors**: the message already lists both shapes — right-align them and the offending axis is obvious
- **Defence**: broadcasting is silent, so check `.shape` immediately

Next: **indexing and aggregation** — how to pull out exactly the data you want.
