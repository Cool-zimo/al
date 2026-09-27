# Chapter 2 · Selecting and filtering · Chapter Test

> Eight questions. loc/iloc is the biggest confusion in pandas and the thing you'll use most.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: A DataFrame has columns ['v'] and index [0,1,2]. What does df[1] do?
options:
- Selects row 1
- Selects the column named 1
- Raises KeyError
- Selects the first 1 row
answer: 2
explain: Brackets default to "select a column" — there's no column named 1, so KeyError. For row 1 use df.iloc[1] or the slice df[1:2]. Rule: a name or list means columns; a slice or boolean means rows.
```

```quiz
type: choice
q: How do loc and iloc differ when slicing?
options:
- Both include the end
- Both exclude the end
- loc includes the end, iloc excludes it
- loc excludes the end, iloc includes it
answer: 2
explain: The easiest way to miscount rows: with 0:2, df.loc[0:2] gives 3 rows (includes 2) while df.iloc[0:2] gives 2 (excludes 2). loc is inclusive because labels are names — "from a to c" includes c.
```

```quiz
type: choice
q: To filter "age>18 AND score>90", which is correct?
options:
- df[df['age'] > 18 and df['score'] > 90]
- df[df['age'] > 18 & df['score'] > 90]
- df[(df['age'] > 18) & (df['score'] > 90)]
- df[(df['age'] > 18) && (df['score'] > 90)]
answer: 2
explain: Three points: ① not and/or — those work on single booleans and raise on a Series, so use & / |; ② each condition needs parentheses or precedence bites; ③ negate with ~ rather than not.
```

```quiz
type: choice
q: Why might df[df['score']<60]['grade'] = 'F' fail to change anything?
options:
- Syntax error
- df[condition] returns a copy, so assigning to it doesn't affect the original
- Wrong column name
- Something's wrong with the condition
answer: 1
explain: df[condition] produces a new DataFrame (most pandas operations return a copy), so you assign into the copy. pandas warns with SettingWithCopyWarning, but that warning doesn't always surface. Always use df.loc[condition, 'col'] = value.
```

```quiz
type: choice
q: After df.sort_values('score', ascending=False), what happens to the index?
options:
- It's renumbered to 0,1,2...
- It keeps the original labels and travels with the data
- It all becomes NaN
- It's renumbered by score
answer: 1
explain: Sorting doesn't reset the index — original labels move with their data. To renumber, call .reset_index(drop=True), and drop=True matters: without it the old index becomes a new column called index.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write filter_top(df, n): return the n rows with the highest scores (use nlargest), keeping the original index
func: filter_top
starter: |
  def filter_top(df, n):
      # use nlargest on the 'score' column to take the top n rows
      # return the DataFrame (keep the original index — don't reset_index)
      return None
cases: |
  [{"name":["Alice","Bob","Cara"],"score":[89.5,92.0,78.0]}], 2 -> [{"name":["Bob","Alice"],"score":[92.0,89.5]}]
hint: return df.nlargest(n, 'score'). nlargest returns the top N complete rows, tidier than sort_values(...).head(n), and it doesn't reset the index.
explain: nlargest is purpose-built for "top N". It returns complete rows and leaves the index alone — exactly what "don't reset_index" asks for, and a good demonstration that pandas keeps labels travelling with the data.
```

```quiz
type: code
q: Filter, select and assign in one go: set grade to "A" where score >= 90, then print how many A's there are
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      'name': ['Alice', 'Bob', 'Cara', 'Dan'],
      'score': [89.5, 92.0, 95.0, 78.0]
  })
  
  # df.loc[df['score'] >= 90, 'grade'] = 'A'
  # Bob (92) and Cara (95) → 2 A's
  
  print("TODO: replace this line with your output")
tests:
- assert "2" in __out
hint: df.loc[df['score'] >= 90, 'grade'] = 'A', then print((df['grade'] == 'A').sum()). The shape is fixed: loc[row condition, column] = new value.
explain: Conditional assignment is the most frequent operation, and the shape is always df.loc[condition, 'column'] = value. Unmatched rows keep NaN (the column is new). This is exactly why loc beats the chained form — chaining edits a copy and silently does nothing.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "sales analyser": create a sales table → filter a category → compute revenue → flag strong sellers → sort by revenue → take each city's top sale
checklist:
- Created a DataFrame from a dict with city / category / price / units
- Added a revenue column using arithmetic between columns
- Filtered a category using multiple conditions (& or |)
- Used loc to assign a new value conditionally (e.g. flagging "key")
- Sorted with sort_values
- Used "sort then dedupe" to get each city's highest sale
- The code runs clean with no errors
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      'city': ['London', 'Paris', 'London', 'Paris', 'Berlin', 'Berlin'],
      'category': ['peripheral', 'peripheral', 'display', 'display', 'peripheral', 'audio'],
      'price': [199, 89, 1299, 999, 399, 599],
      'units': [120, 500, 30, 45, 200, 80]
  })
  
  # 1. add a revenue column
  df['revenue'] = df['price'] * df['units']
  
  # 2. filter: peripherals or audio (use | )
  # 3. flag revenue >= 40000 as "key"
  # 4. sort by revenue descending
  # 5. take each city's top sale (sort then drop_duplicates(subset=['city']))
hint: Filter with df[(df['category']=='peripheral') | (df['category']=='audio')]; flag with df.loc[df['revenue']>=40000, 'flag'] = 'key'; per-city top with df.sort_values('revenue', ascending=False).drop_duplicates(subset=['city']).
explain: This project strings together everything in Chapter 2: column arithmetic, multi-condition filtering, conditional assignment with loc, sorting, and "sort then dedupe" for the group maximum. Run through it once and the whole select-and-filter routine becomes second nature.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
def filter_top(df, n):
    return df.nlargest(n, 'score')
```

**Hands-on:**

```python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Cara', 'Dan'],
    'score': [89.5, 92.0, 95.0, 78.0]
})
df.loc[df['score'] >= 90, 'grade'] = 'A'
print((df['grade'] == 'A').sum())
```

**Mini project:**

```python
import pandas as pd

df = pd.DataFrame({
    'city': ['London', 'Paris', 'London', 'Paris', 'Berlin', 'Berlin'],
    'category': ['peripheral', 'peripheral', 'display', 'display', 'peripheral', 'audio'],
    'price': [199, 89, 1299, 999, 399, 599],
    'units': [120, 500, 30, 45, 200, 80]
})

df['revenue'] = df['price'] * df['units']

# peripherals or audio
sel = df[(df['category'] == 'peripheral') | (df['category'] == 'audio')]
print("--- peripheral / audio ---")
print(sel)

# flag the strong ones
df.loc[df['revenue'] >= 40000, 'flag'] = 'key'
print("\n--- after flagging ---")
print(df)

# each city's top sale
top = df.sort_values('revenue', ascending=False).drop_duplicates(subset=['city'])
print("\n--- top sale per city ---")
print(top)
```

</details>

## What you learned in this chapter

- **Columns and rows**: a name or list in brackets selects columns; a slice or boolean selects rows. `df[1]` raises because it's read as a column name
- **`loc` versus `iloc`**: one by label (inclusive slices), one by position (exclusive slices) — the biggest confusion in pandas
- **Boolean indexing**: `&` `|` `~`, every condition parenthesised, never `and`/`or`/`not`
- **Assignment**: always `df.loc[cond, 'col'] = value`; chained assignment edits a copy and does nothing
- **Sorting and de-duplicating**: the index travels with the data; "sort then dedupe" gets the row holding each group's maximum

**Next chapter: cleaning and missing data** — real data is never clean. Here's how to handle NaN, dirty types and duplicate values.
