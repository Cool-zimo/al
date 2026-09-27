# Chapter 3 · Indexing, aggregation & practice · Chapter Test

> Eight questions covering the view trap, boolean indexing, axis and missing values.
> **All correct to pass** — and this is the final gate of *Data Analysis 1*.

## Part 1 · Multiple choice

```quiz
type: choice
q: Which operation returns a VIEW (editing it affects the original)?
options:
- arr[[0, 2]] (fancy indexing)
- arr[arr > 3] (boolean indexing)
- arr[1:3] (basic slicing)
- arr.copy()
answer: 2
explain: Basic slices, stepped slices, reshape and transpose give views; fancy and boolean indexing give copies. The test is whether the result can be expressed as a contiguous memory window — if yes, a view; if not, a copy.
```

```quiz
type: choice
q: To take scores "at least 60 and below 90", the correct expression is?
options:
- scores[scores >= 60 and scores < 90]
- scores[(scores >= 60) & (scores < 90)]
- scores[scores >= 60 & scores < 90]
- scores[60 <= scores < 90]
answer: 1
explain: Boolean arrays need & and | (Python's and/or handle only single booleans), and each condition needs brackets because & binds tighter than comparisons.
```

```quiz
type: choice
q: An array of shape (3, 4) summed with axis=0 gives what shape?
options:
- (3,)
- (4,)
- (3, 4)
- a scalar
answer: 1
explain: axis=0 removes dimension 0 (length 3), leaving length 4 — so (4,), one sum per column. Mantra: delete position axis from the shape.
```

```quiz
type: choice
q: With a nan in the array, what does np.mean(arr) return?
options:
- It skips the nan and averages the valid values
- nan
- 0
- An error
answer: 1
explain: Aggregations return nan the moment they meet one; a single gap contaminates the result. Only np.nanmean skips it. Deliberate design: it forces you to face the missing data.
```

```quiz
type: choice
q: To find students with at least one failing grade, you'd write?
options:
- np.any(scores < 60, axis=0)
- np.any(scores < 60, axis=1)
- np.all(scores < 60, axis=1)
- np.sum(scores < 60)
answer: 1
explain: axis=1 collapses the subject dimension into "does this student have any failure". axis=0 answers per subject; all would mean every subject failed.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Use boolean indexing to take every element greater than 10 and print them
starter: |
  import numpy as np
  
  arr = np.array([5, 12, 8, 20, 3, 15])
  
  # boolean indexing: arr[arr > 10]
  # result should be [12 20 15]
  
  print("edit here")
tests:
- assert "[12 20 15]" in __out
hint: print(arr[arr > 10]). arr > 10 builds a boolean array; putting it in brackets keeps only the True positions.
explain: Boolean indexing is NumPy's workhorse filter, collapsing "loop + if + append" into brackets and running far faster. It returns a copy, so editing the result won't touch the original.
```

```quiz
type: function
q: Write row_min(m): return a 1-D array of each row's minimum
func: row_min
starter: |
  import numpy as np
  
  def row_min(m):
      # m is a 2-D array; return the minimum of each row
      # hint: the column dimension must vanish → axis=1
      return None
cases: |
  [[3,1,4],[5,9,2]] -> [1,2]
  [[7,7],[8,6]] -> [7,6]
hint: return np.min(np.array(m), axis=1). axis=1 computes across columns, giving one number per row.
explain: This tests axis and aggregation together: wanting "one number per row" (length equals the row count) means the column dimension must vanish, i.e. axis=1. With axis=0 you'd get one minimum per column instead.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "complete grade analyser": clean missing values, rank students, analyse subject difficulty, flag resits, and print a full report
checklist:
- Created a 2-D array (at least 4 rows, 3 columns)
- Handled missing values (nan marker + nan-safe functions)
- Used axis to get per-row totals and ranked with argsort
- Used axis=0 to analyse each subject's mean and standard deviation
- Used boolean indexing or np.any to find who needs a resit
- Printed a tidy report; the code runs clean
starter: |
  import numpy as np
  
  np.random.seed(7)
  scores = np.random.randint(40, 101, size=(5, 4)).astype(float)
  scores[2, 1] = np.nan        # simulate a missed exam
  
  line = "=" * 36
  print(line)
  
  # 1. totals and ranking
  totals = np.nansum(scores, axis=1)
  for rank, i in enumerate(np.argsort(totals)[::-1], start=1):
      print(f"  #{rank}  student {i+1}  {totals[i]:.0f} pts")
  
  # 2. subject difficulty (keep going)
  # 3. unevenness
  # 4. resits needed
  
  print(line)
hint: Subject means come from np.nanmean(scores, axis=0); unevenness from np.nanstd(scores, axis=1); resits from np.any(scores < 60, axis=1) with np.where. Rank with np.argsort(totals)[::-1] for highest first.
explain: The closing project of Data Analysis 1, tying all three chapters together: creating and cleaning, vectorised arithmetic, broadcasting, boolean indexing, axis aggregation and nan-safe functions. Finish this and you can handle real structured data.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on 1:**

```python
import numpy as np
arr = np.array([5, 12, 8, 20, 3, 15])
print(arr[arr > 10])
```

**Hands-on 2:**

```python
import numpy as np

def row_min(m):
    return np.min(np.array(m), axis=1)
```

**Mini project:**

```python
import numpy as np

np.random.seed(7)
scores = np.random.randint(40, 101, size=(5, 4)).astype(float)
scores[2, 1] = np.nan

line = "=" * 36
print(line)
print("1. totals and ranking")
totals = np.nansum(scores, axis=1)
for rank, i in enumerate(np.argsort(totals)[::-1], start=1):
    print(f"  #{rank}  student {i+1}  {totals[i]:.0f} pts")

print("\n2. subject difficulty")
print("  means:", np.round(np.nanmean(scores, axis=0), 1))
print("  stds:", np.round(np.nanstd(scores, axis=0), 1))

print("\n3. unevenness")
print("  ", np.round(np.nanstd(scores, axis=1), 1))

print("\n4. resits")
print("  students:", np.where(np.any(scores < 60, axis=1))[0] + 1)
print(line)
```

</details>

## What you learned in this chapter

- **View vs copy**: slicing, reshape and transpose give views; fancy and boolean indexing give copies. When unsure, `.copy()`
- **Boolean indexing**: `arr[arr > 5]` filters, `arr[cond] = v` bulk-edits; multiple conditions use `&` `|` with brackets
- **Aggregation**: `sum/mean/median/std/percentile`; `argmax` gives a position, not a value; the `nan` prefix handles gaps
- **axis**: one sentence — **axis=n makes dimension n vanish**, so the result shape is the input shape with position n deleted
- **keepdims**: keeps the collapsed dimension as a 1, a perfect partner for broadcasting

## *Python Data Analysis 1* complete

Three chapters in, you now have:

1. **Array thinking**: why arrays, how to create them, dtype and shape
2. **Vectorisation and broadcasting**: no loops, different shapes working together
3. **Indexing and aggregation**: precise selection, summarising, handling gaps

**Book 2 covers pandas** — it adds row labels, column names and time indexes to arrays, making operations feel like the spreadsheets you already know. The array thinking from this book is the prerequisite for understanding it.
