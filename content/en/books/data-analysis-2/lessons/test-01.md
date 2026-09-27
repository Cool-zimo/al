# Chapter 1 · Meet Series and DataFrame · Chapter Test

> Eight questions. This chapter is the foundation of pandas.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: How do pandas and NumPy relate?
options:
- pandas replaces NumPy — once you know pandas you can skip it
- pandas is built on NumPy; each DataFrame column's .values is an ndarray
- They're entirely independent
- NumPy is a simplified pandas
answer: 1
explain: NumPy is pandas' foundation — df['col'].values gives you an ndarray. So broadcasting, axes and boolean indexing from Data Analysis 1 all carry over. Groundwork, not obsolescence.
```

```quiz
type: choice
q: When adding two Series, how does pandas align them?
options:
- By position, like NumPy
- By index label; unmatched labels become NaN
- By length, padding the shorter one with 0
- You must sort them first
answer: 1
explain: Label alignment is a core pandas feature: reordering rows can't corrupt your maths. The flip side is that unmatched labels quietly produce NaN rather than an error — so check when results look odd.
```

```quiz
type: choice
q: What's the difference between df['score'] and df[['score']]?
options:
- Nothing; they're identical
- Single brackets give a Series; double brackets give a DataFrame
- Single brackets raise an error
- Double brackets select rows
answer: 1
explain: A single column name in single brackets gives a 1-D Series; a list in double brackets (even with one item) gives a 2-D DataFrame. It matters because a DataFrame has columns and supports multi-column work while a Series doesn't.
```

```quiz
type: choice
q: info() shows a "price" column as object, though it looks numeric. Why?
options:
- pandas stores all numbers as object
- The column contains thousands separators, currency symbols or text like "n/a"
- The dataset is too large
- The column has missing values
answer: 1
explain: pandas only falls back to object when a whole column can't be numeric. Numbers that show as object almost always mean '1,299', '£199' or 'n/a'. head() will confirm it at a glance.
```

```quiz
type: choice
q: What does a Series' idxmax() return?
options:
- The positional index of the maximum (which row)
- The index label of the maximum (that row's name)
- The maximum value itself
- The name of the column holding the maximum
answer: 1
explain: idxmax returns the label, while argmax returns the position. In a table you usually want the name (which city sold best) rather than a row number, so idxmax is the one you'll reach for.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Build a DataFrame and add a revenue column = price × units, then print the total
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      'product': ['Keyboard', 'Mouse'],
      'price': [199, 89],
      'units': [120, 500]
  })
  
  # df['revenue'] = df['price'] * df['units']
  # the total should be 199*120 + 89*500 = 68380
  
  print("edit here")
tests:
- assert "68380" in __out
hint: df['revenue'] = df['price'] * df['units'], then print(df['revenue'].sum()). Multiplying two Series aligns them by index and computes element by element.
explain: One of pandas' two most common moves: arithmetic between columns. No loop — pandas aligns by index automatically. The other is df.loc[label, column] for fetching by name.
```

```quiz
type: code
q: Use idxmax to find the top-selling city and print it
starter: |
  import pandas as pd
  
  s = pd.Series([10, 20, 30], index=['London', 'Paris', 'Berlin'])
  
  # s.idxmax() returns the index LABEL of the maximum (not a position)
  # it should be 'Berlin'
  
  print("edit here")
tests:
- assert "Berlin" in __out
hint: print(s.idxmax()). idxmax returns the label; argmax returns the position — in a table you usually want the name.
explain: idxmax returns the maximum's index label rather than a positional offset. "Which city sold best" wants a name, not a row number. idxmin does the same for the minimum.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "student scores" table: create it → add a total column → use idxmax to find the top student → use describe for statistics → use isna to check gaps → write to CSV
checklist:
- Created a DataFrame from a dictionary
- Added a column using arithmetic between columns (total or average)
- Used idxmax to find who came first
- Used describe() to print statistics for the numeric columns
- Used isna().sum() to check for missing values
- Used to_csv(index=False) to write the file
- The code runs clean with no errors
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({
      'name': ['Alice', 'Bob', 'Cara', 'Dan'],
      'maths': [80, 95, 88, 70],
      'science': [90, 70, 85, 75],
      'english': [85, 88, np.nan, 92]      # deliberately one gap
  })
  
  # 1. add a "total" column (sum(axis=1) skips NaN automatically)
  df['total'] = df[['maths', 'science', 'english']].sum(axis=1)
  
  # 2. find the top student (use idxmax)
  # 3. describe() for statistics
  # 4. isna().sum() for gaps
  # 5. to_csv('report.csv', index=False)
hint: For the top student: i = df['total'].idxmax() gives the index, then df.loc[i, 'name'] gives the name. Use df.describe() for stats, df.isna().sum() for gaps, and df.to_csv('report.csv', index=False) to write it out.
explain: This ties the whole chapter together: building a table, arithmetic between columns, fetching by label, statistical summaries, checking gaps and writing a file. Run through it once and you've covered the full path from "create a table" to "produce a report".
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on:**

```python
import pandas as pd

df = pd.DataFrame({
    'product': ['Keyboard', 'Mouse'],
    'price': [199, 89],
    'units': [120, 500]
})
df['revenue'] = df['price'] * df['units']
print(df['revenue'].sum())
```

```python
import pandas as pd
s = pd.Series([10, 20, 30], index=['London', 'Paris', 'Berlin'])
print(s.idxmax())
```

**Mini project:**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Cara', 'Dan'],
    'maths': [80, 95, 88, 70],
    'science': [90, 70, 85, 75],
    'english': [85, 88, np.nan, 92]
})

df['total'] = df[['maths', 'science', 'english']].sum(axis=1)

top = df['total'].idxmax()
print(f"top student: {df.loc[top, 'name']}, total {df.loc[top, 'total']}")

print("\n--- statistics ---")
print(df.describe())

print("\n--- missing ---")
print(df.isna().sum())

df.to_csv('report.csv', index=False)
print("\nwrote report.csv")
```

</details>

## What you learned in this chapter

- **Why pandas**: NumPy allows one type per array; pandas gives each column its own
- **Series**: a labelled column whose `.values` is an ndarray; **arithmetic aligns by index label**
- **DataFrame**: a dictionary of Series; the `shape` / `columns` / `index` trio; single brackets give a Series, double brackets a DataFrame
- **Looking at data**: the fixed routine of `head` / `info` / `describe` / `isna().sum()`
- **read_csv**: the four traps (thousands separators, encoding, placeholder text, ragged rows) and the fixes (`thousands`, `encoding`, `na_values`, `to_numeric`)

Next chapter: **selecting and filtering** — the difference between `loc` and `iloc`, the biggest source of confusion in pandas.
