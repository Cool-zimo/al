# Chapter 5 · Reading and writing files · Chapter Test

> Eight questions. This is the chapter where data actually lands on disk.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: What's true about the suffix in np.save / np.load?
options:
- Both can omit .npy
- save appends .npy automatically; load needs it written out
- load appends .npy automatically; save needs it written out
- Both must be written out
answer: 1
explain: The classic small trap: np.save('data', arr) creates data.npy, but np.load('data') looks for a file literally named data and raises FileNotFoundError. When loading, write it in full.
```

```quiz
type: choice
q: np.loadtxt reading a CSV of integers gives what type by default?
options:
- int
- float
- str
- It infers
answer: 1
explain: loadtxt reads everything as float64 even from all-integer files — pass dtype=int for integers. npy differs: it remembers the original type.
```

```quiz
type: choice
q: What's the difference between loadtxt and genfromtxt?
options:
- Identical, just different names
- loadtxt errors on empty fields; genfromtxt turns them into nan
- genfromtxt is faster so always prefer it
- genfromtxt can't read CSV
answer: 1
explain: The crucial difference. loadtxt is simpler and faster, but one empty field kills it — and real data almost always has gaps. Clean data: loadtxt. Data with holes: genfromtxt.
```

```quiz
type: choice
q: Reading a CSV with just one row, np.loadtxt returns what shape?
options:
- (1, n)
- (n,)
- An error
- It depends on dtype
answer: 1
explain: A silent trap: a single-row file comes back as (n,), so 2-D code such as data[:, 0] breaks. Wrap it in np.atleast_2d() to be safe.
```

```quiz
type: choice
q: Why fill with the column mean rather than the whole-table mean?
options:
- Column means compute faster
- Columns can differ hugely in scale; a global mean contaminates them
- The whole-table mean errors
- No real difference
answer: 1
explain: If one column averages 800 and another 200, a global 500 drags both away from their true levels. Per-column filling is filling; a global mean is tampering.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Read a CSV with an empty field using genfromtxt and print the array (the gap should be nan)
starter: |
  import numpy as np
  
  open('m.csv', 'w').write('1,2\\n3,\\n5,6\\n')
  
  # np.genfromtxt('m.csv', delimiter=',')
  # loadtxt raises; genfromtxt turns the empty field into nan
  
  print("TODO: replace this line with your output")
tests:
- assert "nan" in __out
hint: print(np.genfromtxt('m.csv', delimiter=',')). np.loadtxt raises ValueError on an empty field; genfromtxt turns it into nan.
explain: The whole reason genfromtxt exists: real data has holes and loadtxt dies on the first one. nan then plugs straight into the nanmean / nanstd / nanargmax family.
```

```quiz
type: code
q: Read a CSV containing the sentinel -1 and replace it with nan, then print whether any -1 remains (it should be False)
starter: |
  import numpy as np
  
  open('s.csv', 'w').write('1,2\\n-1,4\\n5,6\\n')
  
  # 1. read with np.genfromtxt('s.csv', delimiter=',')
  # 2. replace the sentinel -1 with nan: arr[arr == -1] = np.nan
  # 3. print np.any(arr == -1) — should be False
  
  print("TODO: replace this line with your output")
tests:
- assert "False" in __out
hint: arr = np.genfromtxt('s.csv', delimiter=','), then arr[arr == -1] = np.nan, then print(np.any(arr == -1)). Boolean-index assignment is the most direct bulk replacement.
explain: The first step of real cleaning: unify every sentinel (-1, 999, -999) into nan so all the nan-safe functions skip them automatically. One uniform representation is the precondition for clean analysis code — mixed sentinels make it miserable.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "data pipeline": write dirty data to CSV → read back → fill gaps → analyse → print a report → save as npy
checklist:
- Wrote a CSV with savetxt (header, fmt specified)
- Read it back with genfromtxt (skipping the header)
- Handled missing values (nan or sentinel → filled with column means)
- Computed at least three statistics (totals, mean, std or ranking)
- Printed a tidy report
- Saved the cleaned data with np.save
- The code runs clean with no errors
starter: |
  import numpy as np
  
  np.random.seed(42)
  sales = np.random.randint(100, 1000, size=(12, 4)).astype(float)
  sales[2, 1] = np.nan      # a gap
  sales[5, 2] = -1          # a keying error
  
  cities = ['London', 'Paris', 'Berlin', 'Rome']
  
  # 1. write the CSV
  np.savetxt('sales.csv', sales, delimiter=',', fmt='%.0f',
             header='London,Paris,Berlin,Rome', comments='')
  
  # 2. read it back
  raw = np.genfromtxt('sales.csv', delimiter=',', skip_header=1)
  
  # 3. clean: -1 to nan, then fill with column means
  # 4. analyse: totals, monthly average, ranking
  # 5. report + np.save
hint: Clean with clean[clean == -1] = np.nan, then locate with np.where(np.isnan(clean)) and fill with np.take(col_mean, inds[1]). Rank with np.argsort(totals)[::-1]. Finish with np.save('clean.npy', clean).
explain: The closing project of chapter 5, turning the whole book into a real pipeline: write, read, clean, axis statistics, ranking, report, persist. Walk this once and you can handle a structured dataset end to end.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on 1:**

```python
import numpy as np
open('m.csv', 'w').write('1,2\n3,\n5,6\n')
print(np.genfromtxt('m.csv', delimiter=','))
```

**Hands-on 2:**

```python
import numpy as np
open('s.csv', 'w').write('1,2\n-1,4\n5,6\n')
arr = np.genfromtxt('s.csv', delimiter=',')
arr[arr == -1] = np.nan
print(np.any(arr == -1))
```

**Mini project:**

```python
import numpy as np

np.random.seed(42)
sales = np.random.randint(100, 1000, size=(12, 4)).astype(float)
sales[2, 1] = np.nan
sales[5, 2] = -1
cities = ['London', 'Paris', 'Berlin', 'Rome']

np.savetxt('sales.csv', sales, delimiter=',', fmt='%.0f',
           header='London,Paris,Berlin,Rome', comments='')

raw = np.genfromtxt('sales.csv', delimiter=',', skip_header=1)

clean = raw.copy()
clean[clean == -1] = np.nan
col_mean = np.nanmean(clean, axis=0)
inds = np.where(np.isnan(clean))
if len(inds[0]):
    clean[inds] = np.take(col_mean, inds[1])

totals = clean.sum(axis=0)
monthly = clean.sum(axis=1)

line = "=" * 38
print(line)
print(f"  total {clean.sum():,.0f}   monthly avg {monthly.mean():,.0f}")
print("  city ranking:")
for rank, i in enumerate(np.argsort(totals)[::-1], 1):
    print(f"    {rank}. {cities[i]}  {totals[i]:,.0f}")
print(f"  best month: #{np.argmax(monthly) + 1}")
print(line)
np.save('sales_clean.npy', clean)
```

</details>

## What you learned in this chapter

- **npy / npz**: binary archiving, fast and exact; save adds the suffix, load needs it typed; npz behaves like a dict
- **CSV**: `savetxt` uses `fmt` for formatting and `comments=''` to drop the `#`; `loadtxt` defaults to float and needs `skiprows` for headers
- **genfromtxt**: use it whenever there are gaps — empty fields become nan, `filling_values` fills directly
- **Reading errors**: missing file → check the path; ragged rows → check the line; can't convert → check the header; UnicodeDecodeError → try gbk
- **The pipeline**: make/read → inspect → clean → analyse → report → persist

The final chapter runs three practice projects and shows where NumPy's boundaries lie.
