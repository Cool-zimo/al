# Chapter 4 · Reshaping, joining & sorting · Chapter Test

> Eight questions. Most functions here are simple; the difficulty is knowing which one to reach for.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Two arrays of shape (2,3) joined with concatenate(..., axis=0) give what shape?
options:
- (2, 6)
- (4, 3)
- (2, 3)
- An error
answer: 1
explain: axis=0 stacks downwards: rows add, columns stay — (4, 3). Join sideways into (2,6) with axis=1. Mantra: axis=n joins along dimension n; every other dimension must match exactly.
```

```quiz
type: choice
q: What's the difference between np.split and np.array_split?
options:
- Nothing; they're identical
- split demands an exact division or errors; array_split allows uneven parts
- array_split only supports 2-D arrays
- split returns an array, array_split returns a list
answer: 1
explain: The only difference, but an important one — and both return lists. Anywhere the part count may not divide evenly, use array_split.
```

```quiz
type: choice
q: Applying repeat and tile to [1, 2], each with a count of 2, gives?
options:
- repeat gives [1,2,1,2], tile gives [1,1,2,2]
- repeat gives [1,1,2,2], tile gives [1,2,1,2]
- both give [1,2,1,2]
- both give [1,1,2,2]
answer: 1
explain: repeat acts per element (each duplicated N times); tile acts per array (the whole block N times). That's the essential distinction.
```

```quiz
type: choice
q: To subtract a (3,) baseline from a (2,3) array, the best approach is?
options:
- np.tile it to (2,3) first, then subtract
- Subtract directly and let broadcasting handle it
- Expand with np.repeat
- Reshape it first
answer: 1
explain: Broadcasting was built for this and copies nothing. Tiling first is pure waste — it allocates a real (2,3) block, which is costly at scale.
```

```quiz
type: choice
q: What does np.argsort(arr) return?
options:
- The sorted array
- The original index of each element, in sorted order
- Each element's rank
- The position of the maximum
answer: 1
explain: argsort returns indices rather than values — which is exactly why it beats sort: indices tell you who came first, and let you index other columns of the same table.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Use vstack to stack two 1-D arrays into 2 rows and print the result
starter: |
  import numpy as np
  
  a = np.array([1, 2, 3])
  b = np.array([4, 5, 6])
  
  # np.vstack([a, b]) promotes each to "one row", then stacks
  # result should be [[1 2 3] [4 5 6]]
  
  print("TODO: replace this line with your output")
tests:
- assert "[[1 2 3]" in __out
- assert "[4 5 6]]" in __out
hint: print(np.vstack([a, b])). v is vertical; it promotes 1-D inputs to rows and stacks them into (2, 3).
explain: vstack/hstack free you from remembering axis, and they add the missing row/column dimension automatically — plain concatenate would only give a length-6 1-D array.
```

```quiz
type: function
q: Write count_dups(arr): count how many distinct values appear more than once
func: count_dups
starter: |
  import numpy as np
  
  def count_dups(arr):
      # arr is a 1-D array
      # return the number of distinct values occurring 2+ times
      # hint: np.unique(arr, return_counts=True)
      return None
cases: |
  [1,2,2,3,3,3] -> 2
  [1,2,3] -> 0
hint: vals, counts = np.unique(np.array(arr), return_counts=True), then return int(np.sum(counts > 1)). counts > 1 is a boolean array; summing it counts.
explain: This chains two unique abilities: de-duplication tells you which values exist, return_counts tells you how often, and a boolean sum counts how many are repeats. A standard data-quality check.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "class leaderboard": join several subject tables, compute totals, rank by total, show the top 3 and report the score distribution
checklist:
- Joined more than one array with hstack or column_stack
- Computed each person's total with sum(axis=1)
- Ranked with argsort (descending)
- Reported the distribution with unique + return_counts
- Printed a tidy leaderboard with f-strings
- The code runs clean with no errors
starter: |
  import numpy as np
  
  # 5 students, language and maths
  lang   = np.array([80, 95, 88, 70, 92])
  maths  = np.array([90, 70, 85, 75, 88])
  
  # 1. join into a (5, 2) table
  scores = np.column_stack([lang, maths])
  
  # 2. totals
  totals = scores.sum(axis=1)
  print("totals:", totals)
  
  # 3. keep going: rank with argsort, print the top 3
  # 4. keep going: distribution with unique + return_counts
hint: Rank with np.argsort(totals)[::-1] and take [:3] for the top three. Distribution with np.unique(totals, return_counts=True). Build the table from two 1-D arrays with np.column_stack.
explain: This ties chapter 4 together: column_stack to build the table, axis aggregation, argsort to rank, unique for the distribution. Real reporting dashboards are combinations of exactly these moves.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on:**

```python
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.vstack([a, b]))
```

**Function:**

```python
import numpy as np

def count_dups(arr):
    vals, counts = np.unique(np.array(arr), return_counts=True)
    return int(np.sum(counts > 1))
```

**Mini project:**

```python
import numpy as np

lang  = np.array([80, 95, 88, 70, 92])
maths = np.array([90, 70, 85, 75, 88])

scores = np.column_stack([lang, maths])
totals = scores.sum(axis=1)
order = np.argsort(totals)[::-1]

line = "=" * 32
print(line)
for rank, i in enumerate(order[:3], start=1):
    print(f"  #{rank}  student {i+1}  total {totals[i]}")
    print(f"         lang {lang[i]}  maths {maths[i]}")

print("\ndistribution:")
vals, counts = np.unique(totals, return_counts=True)
for v, c in zip(vals, counts):
    print(f"  {v} pts: {c}")
print(line)
```

</details>

## What you learned in this chapter

- **Joining**: `concatenate` + axis; can't remember axis? use `vstack` / `hstack`; building a table? `column_stack`
- **Splitting**: `split` needs an exact division, `array_split` doesn't; a number means "N parts", a list means "cut here"
- **repeat vs tile**: one stretches elements, one copies blocks; prefer broadcasting to tile for shape matching
- **Sorting**: `sort` gives values, `argsort` gives indices; `argsort(x)[::-1]` descends; sort a table by a column with `tbl[argsort(tbl[:, col])]`
- **Sets**: `unique` (with return_counts), `isin` allow-lists, intersect / union / setdiff

Next: **reading and writing files** — so your data can actually be saved and loaded back.
