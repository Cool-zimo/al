# Chapter 4 · Grouping and aggregation · Chapter Test

> Eight questions. groupby is the most powerful feature in pandas, and where "data analysis" truly begins.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: What's the difference between count() and size()?
options:
- They're identical
- count() counts only non-null values; size() counts every row in the group
- size() counts only non-null values
- count() is for numeric columns, size() for text
answer: 1
explain: With no missing data they match; with gaps, count() is smaller because it skips NaN. "How much valid data" is count(); "how many rows" is size().
```

```quiz
type: choice
q: You want to add a column showing each student's rank within their class. Which do you use?
options:
- groupby().mean()
- groupby().transform()
- groupby().filter()
- groupby().agg()
answer: 1
explain: Adding a column requires the result to match the original's row count — that's exactly what transform does, broadcasting the aggregate back onto each row of the group. Plain aggregation gives one row per group; filter drops rows.
```

```quiz
type: choice
q: What is pivot_table's default aggfunc?
options:
- 'sum'
- 'mean'
- 'count'
- 'max'
answer: 1
explain: The easiest trap when coming from Excel — Excel's pivot tables default to summing, pandas' pivot_table defaults to mean. Want a total? Write aggfunc='sum'.
```

```quiz
type: choice
q: What do unstack() and stack() each do?
options:
- unstack turns columns into an index, stack turns an index into columns
- unstack turns the inner index into columns (long to wide); stack turns columns back into an index (wide to long)
- Both sort
- Both drop a level
answer: 1
explain: Inverses: unstack spreads the innermost index across the columns (long to wide, good for presentation); stack folds the columns back into an index (wide to long, which most pandas analysis prefers).
```

```quiz
type: choice
q: With a new dataset in hand, what's the correct first step?
options:
- groupby and look at the totals straight away
- inspect the structure first (dtypes / head / isna), then clean, then aggregate
- build a pivot table first
- drop the rows with gaps first
answer: 1
explain: Acting without knowing the types guarantees trouble — if revenue is stored as text (with £ and commas), groupby fails or computes the wrong thing. Order: inspect → clean → fill gaps → group → pivot → conclude.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Write city_total(df): group by "city" and sum "revenue", then return the NAME of the city with the highest total
func: city_total
starter: |
  def city_total(df):
      # group by 'city', sum the 'revenue' column
      # return the NAME of the city with the highest total
      return None
cases: |
  [{"city":["London","Paris","London","Paris"],"revenue":[100,200,150,300]}] -> Paris
hint: return df.groupby('city')['revenue'].sum().idxmax(). idxmax returns the index LABEL of the maximum (the city name); argmax would give you a position.
explain: "Which city sold best" wants a name, not a row number — so idxmax, not argmax. This is the most common way to fetch a value after groupby.
```

```quiz
type: code
q: Use transform to add a "city total" column to each row, then print row 0's city total
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      'city': ['London', 'Paris', 'London', 'Paris'],
      'revenue': [100, 200, 150, 300]
  })
  
  # df.groupby('city')['revenue'].transform('sum') is as long as the original
  # row 0 is London → London's total = 100 + 150 = 250
  
  print("edit here")
tests:
- assert "250" in __out
hint: df['city_total'] = df.groupby('city')['revenue'].transform('sum'), then print(df.loc[0,'city_total']). transform broadcasts the aggregate back onto every row.
explain: The difference between transform and plain aggregation is the length of the result: aggregation gives one row per group, transform keeps the original's row count — because it writes the group value back onto every row. Use it for "share of my group".
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "sales analysis report": clean the dirty data → group by city (with counts) → use transform to add a share column → build a city-by-category pivot table with totals → state conclusions (grand total, top city, its share)
checklist:
- Cleaned the revenue column with to_numeric + .str (stripping £ and commas)
- Handled the gaps (dropped or filled, and said why)
- Used groupby + agg for each city's sum, mean and count
- Used transform to add a "share of city" column
- Used pivot_table for a city × category grid with margins
- Used idxmax to find the top city and computed its share
- The code runs clean with no errors
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({
      'city': ['London', 'Paris', 'London', 'Paris', 'Berlin', 'Berlin'],
      'category': ['peripheral', 'display', 'peripheral', 'display', 'audio', 'peripheral'],
      'revenue': ['£1,299', '£8,999', '£899', '£12,999', 'n/a', '£599']
  })
  
  print("rows before:", len(df))
  
  # 1. clean revenue (strip £ and commas → to_numeric)
  # 2. handle gaps ('n/a' becomes NaN → dropna)
  # 3. groupby + agg(['sum','mean','count'])
  # 4. transform to add a share column
  # 5. pivot_table(..., margins=True)
  # 6. idxmax for the top city, then its share
hint: Clean with df['revenue'].str.replace('£','').str.replace(',','') then pd.to_numeric(errors='coerce'); for the pivot remember aggfunc='sum' and fill_value=0.
explain: This project ties together every point in Chapter 4 — and more importantly it fixes the **order**: clean before aggregating, because the wrong order gives the wrong answer. Run through it once and "how do I analyse a dataset" becomes a complete sequence of moves.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

```python
def city_total(df):
    return df.groupby('city')['revenue'].sum().idxmax()
```

**Hands-on:**

```python
import pandas as pd

df = pd.DataFrame({
    'city': ['London', 'Paris', 'London', 'Paris'],
    'revenue': [100, 200, 150, 300]
})
df['city_total'] = df.groupby('city')['revenue'].transform('sum')
print(df.loc[0, 'city_total'])
```

**Mini project:**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'city': ['London', 'Paris', 'London', 'Paris', 'Berlin', 'Berlin'],
    'category': ['peripheral', 'display', 'peripheral', 'display', 'audio', 'peripheral'],
    'revenue': ['£1,299', '£8,999', '£899', '£12,999', 'n/a', '£599']
})

print("rows before:", len(df))

# 1. clean
df['revenue'] = pd.to_numeric(
    df['revenue'].str.replace('£', '').str.replace(',', ''),
    errors='coerce'
)
print("gaps after cleaning:", df['revenue'].isna().sum())

# 2. handle gaps (revenue is the core measure)
df = df.dropna(subset=['revenue'])
print("rows after:", len(df))

# 3. group (count shows the sample size)
g = df.groupby('city')['revenue'].agg(['sum', 'mean', 'count'])
print("\n=== by city ===")
print(g.sort_values('sum', ascending=False))

# 4. transform for shares
df['city_total'] = df.groupby('city')['revenue'].transform('sum')
df['city_share'] = (df['revenue'] / df['city_total'] * 100).round(1)
print("\n=== detail (with shares) ===")
print(df)

# 5. pivot
print("\n=== city x category ===")
print(df.pivot_table(index='city', columns='category', values='revenue',
                     aggfunc='sum', fill_value=0, margins=True,
                     margins_name='Total'))

# 6. conclusions
s = df.groupby('city')['revenue'].sum()
total = df['revenue'].sum()
print("\n=== conclusions ===")
print(f"total {total:,.0f}")
print(f"top city {s.idxmax()} ({s.max():,.0f}, {s.max()/total*100:.1f}%)")
```

</details>

## What you learned in this chapter

- **groupby's three steps**: split → apply → combine; syntax `groupby(key)[column].how`
- **count vs size**: the former skips nulls, the latter doesn't
- **transform adds columns, filter drops groups**: row count kept versus whole groups removed
- **Multi-level indexes**: `reset_index` to flatten, `unstack`/`stack` for long ↔ wide
- **pivot_table**: groupby + unstack, **default mean not sum**; crosstab counts
- **The order of an analysis**: inspect → clean → fill gaps → group → pivot → conclude

**Next chapter: joining and reshaping** — how to combine several tables (`merge` / `concat`).
