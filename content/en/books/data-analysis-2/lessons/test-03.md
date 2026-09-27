# Chapter 3 · Cleaning and missing data · Chapter Test

> Eight questions. This chapter is the line between "practice data" and "real data".
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Why can't you use df[df['score'] == np.nan] to find missing values?
options:
- Invalid syntax
- NaN isn't equal to anything (including itself), so the comparison is always False
- np.nan doesn't exist in pandas
- You'd need df['score'] = np.nan instead
answer: 1
explain: NaN is defined as "not equal to anything" — np.nan == np.nan returns False. So the filter always yields nothing, and it doesn't raise, which makes it especially sneaky. Always use isna() / notna().
```

```quiz
type: choice
q: A column is 60% missing. What's the best approach?
options:
- Fill with the mean
- Fill with the median
- Drop the column
- Fill with 0
answer: 2
explain: Beyond about half missing, the column carries too little information — filling means guessing 60% of it from the other 40%, and those guesses mislead the analysis badly. Drop it. Core principle: don't invent data just to make gaps disappear.
```

```quiz
type: choice
q: You want to convert a column containing NaN to integers. What's correct?
options:
- Just astype(int)
- Fill first then astype(int), or use astype('Int64')
- Convert via astype(str)
- pandas integer columns can't be converted at all
answer: 1
explain: int has no "empty" state, so any NaN makes astype(int) raise IntCastingNaNError. Two routes: fill first then convert (most common), or convert to Int64 (capital I) — pandas' nullable integer type.
```

```quiz
type: choice
q: Why is the IQR method more reliable than "3 standard deviations from the mean"?
options:
- IQR is faster to compute
- The standard deviation is inflated by the outlier itself, causing misses; IQR uses quartiles and isn't affected
- IQR is built into pandas
- The standard deviation method is deprecated
answer: 1
explain: A value like 999 blows up the standard deviation, which raises the "3 standard deviations" threshold until it can no longer catch 999 — the masking effect. IQR is based on quartiles (Q1/Q3 are positions, not magnitudes), so extreme values can't move it.
```

```quiz
type: choice
q: When filtering with df[df['product'].str.contains('Apple')], what happens if "product" has gaps?
options:
- Gaps are skipped automatically
- It errors or misbehaves, because contains returns NaN rather than True/False for a gap
- Gaps count as True
- Gaps count as False
answer: 1
explain: contains returns NaN for a gap (neither True nor False), and NaN mixed into a boolean Series breaks the filter. Defensive form: contains('Apple', na=False).
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write clean_missing(df, col): fill the gaps in that column with its median, and return the filled Series
func: clean_missing
starter: |
  def clean_missing(df, col):
      # fill the gaps in df[col] with the median of df[col]
      # return the filled Series (don't modify df itself)
      return None
cases: |
  [{"v":[1.0,None,3.0,None,5.0]}], "v" -> [{"v":[1.0,3.0,3.0,3.0,5.0]}]
hint: return df[col].fillna(df[col].median()). median() skips NaN automatically and gives the median of the present values; fillna uses it for every gap.
explain: The median resists outliers better than the mean — with extreme values (incomes, house prices) the mean gets dragged off while the median doesn't. That makes it the first choice for filling numeric gaps.
```

```quiz
type: code
q: Clean a money column: strip '£' and commas, convert to numbers, then print the maximum
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({'price': ['£1,299', '£89', 'n/a']})
  
  # .str.replace to strip symbols and commas, then to_numeric(errors='coerce')
  # 1299 and 89 → the maximum is 1299
  
  print("TODO: replace this line with your output")
tests:
- assert "1299" in __out
hint: cleaned = df['price'].str.replace('£','').str.replace(',',''), then print(pd.to_numeric(cleaned, errors='coerce').max()). Two steps: clean the interfering characters, then convert.
explain: The standard two steps for money columns. Note that astype won't do — it collapses entirely on 'n/a', so you must use to_numeric(errors='coerce') to turn the failures into NaN.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "dirty-data cleaning pipeline": read a dirty table → check gaps → clean the money column → find and drop duplicates → find outliers with IQR → output a clean table plus a report
checklist:
- Counted gaps per column with isna().sum()
- Cleaned the money column with .str plus to_numeric(errors='coerce')
- Found duplicates with duplicated(subset=[...]) and dropped them with drop_duplicates
- Computed Q1/Q3/IQR with quantile and drew the outlier bounds
- Handled the outliers (dropped or clipped them)
- Printed a before/after row count
- The code runs clean with no errors
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({
      'order': ['A001', 'A002', 'A002', 'A003', 'A004', 'A005'],
      'amount': ['£1,299', '£89', '£89', '£99,999', 'n/a', '£150'],
      'city': ['London', 'Paris', 'Paris', 'Berlin', 'London', 'London']
  })
  
  print("rows before:", len(df))
  
  # 1. gaps: df.isna().sum()
  # 2. clean amount: strip £ and commas → to_numeric(errors='coerce')
  # 3. duplicates: duplicated(subset=['order']) → drop_duplicates
  # 4. IQR outliers: q1/q3/iqr → upper = q3 + 1.5*iqr
  # 5. handle outliers (drop or clip)
  # 6. print the row count after, plus remaining gaps
hint: Clean the amount with df['amount'].str.replace('£','').str.replace(',','') then pd.to_numeric(..., errors='coerce'); for outliers compute q1=df['amount'].quantile(0.25) and so on, then df[df['amount']<=upper].
explain: This project strings together all five lessons of Chapter 3 into one pipeline — which is exactly how cleaning works on real data. Run through it once and "what do I do with dirty data" becomes muscle memory.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
def clean_missing(df, col):
    return df[col].fillna(df[col].median())
```

**Hands-on:**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({'price': ['£1,299', '£89', 'n/a']})
cleaned = df['price'].str.replace('£', '').str.replace(',', '')
print(pd.to_numeric(cleaned, errors='coerce').max())
```

**Mini project:**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'order': ['A001', 'A002', 'A002', 'A003', 'A004', 'A005'],
    'amount': ['£1,299', '£89', '£89', '£99,999', 'n/a', '£150'],
    'city': ['London', 'Paris', 'Paris', 'Berlin', 'London', 'London']
})

print("rows before:", len(df))

# 1. gaps
print("\n--- gaps ---")
print(df.isna().sum())

# 2. clean the amount
df['amount'] = pd.to_numeric(
    df['amount'].str.replace('£', '').str.replace(',', ''),
    errors='coerce'
)
print("\namount dtype:", df['amount'].dtype, "| gaps:", df['amount'].isna().sum())

# 3. duplicates
print("\nduplicate orders:", df.duplicated(subset=['order']).sum())
df = df.drop_duplicates(subset=['order'], keep='first')
print("after de-duplicating:", len(df), "rows")

# 4. IQR outliers
q1, q3 = df['amount'].quantile(0.25), df['amount'].quantile(0.75)
iqr = q3 - q1
upper = q3 + 1.5 * iqr
print(f"\nnormal upper bound: {upper}")
print("suspect orders:")
print(df[df['amount'] > upper])

# 5. handle (drop)
df = df[df['amount'] <= upper]

# 6. report
print("\n=== cleaning report ===")
print("rows after:", len(df))
print("remaining gaps:")
print(df.isna().sum())
print("\nmean amount:", df['amount'].mean())
```

</details>

## What you learned in this chapter

- **What NaN is**: not equal to itself, so test with `isna()`; integer columns with a gap become float
- **Drop or fill**: >50% missing means drop the column; numbers take the median; time series use ffill; a gap in a key column means you must drop
- **Type conversion**: `to_numeric(errors='coerce')` is the master key for numeric columns; NaN can't become int
- **Duplicates and outliers**: `duplicated(subset=...)` with `keep=False` to inspect; IQR to draw the line; `clip` to squeeze
- **Text cleaning**: the `.str` accessor, `contains(na=False)` for safety, `split(expand=True)` to make columns

**Next chapter: grouping and aggregation** — `groupby` is the most powerful feature in pandas, and the core move of data analysis.
