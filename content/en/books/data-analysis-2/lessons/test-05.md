# Chapter 5 Test · Joining and reshaping

> Joining, merging, and pivoting — these are all the tools for turning "many tables into one."

## Part 1 · Multiple choice

```quiz
type: choice
q: After stacking two DataFrames vertically with concat, the index has duplicates. What is the fix?
options:
- Nothing can be done; you must edit it by hand
- Use pd.concat([a, b], ignore_index=True) to renumber from 0
- You must call reset_index before concat
- Duplicate indexes are dropped automatically
answer: 1
explain: ignore_index=True discards the original indexes and renumbers everything from 0, which is the most direct way to clean up duplicate indexes.
```

```quiz
type: choice
q: What does a left join (merge with how='left') do to the row count?
options:
- It always equals the right table's row count
- It always equals the smaller of the two tables
- It is at least the left table's row count; unmatched right-side fields become NaN
- It always equals the sum of both row counts
answer: 2
explain: A left join keeps every row from the left table; any right-side field with no match is filled with NaN.
```

```quiz
type: choice
q: An orders table (unique order IDs) is joined to a lines table (the same order ID appears 3 times) on order ID with an inner join. What happens to the row count?
options:
- It stays the same as the orders table
- It becomes the lines table's row count
- The row count grows — one-to-many inflation occurs
- It errors out because the key is not unique
answer: 2
explain: One row in the orders table is duplicated 3 times to match the lines table; that is exactly why one-to-many joins make the row count grow.
```

```quiz
type: choice
q: The two tables use different names for the join key (left calls it code, right calls it ID). How should you write it?
options:
- merge(on='code') — pandas figures it out
- merge(left_on='code', right_on='ID')
- Rename the right table's ID column to code, then merge(on='code')
- concat is the only option
answer: 1
explain: left_on and right_on are designed for exactly this situation — different key names on each side. Renaming first works too, but left_on/right_on is the direct form.
```

```quiz
type: choice
q: A table has duplicate values in its key column [1, 1, 2, 3] and is merged with itself on that key. What happens?
options:
- The result has the same number of rows as the original
- A Cartesian product is produced and the row count inflates
- Duplicates are removed automatically before joining
- It raises an error immediately
answer: 1
explain: When both sides have duplicate keys, pandas computes the Cartesian product: key 1 appears twice on each side, so the result has 4 rows with key 1. This is the easiest trap to fall into.
```

## Part 2 · Hands-on

```quiz
type: function
q: Write a function combine(table_a, table_b) that takes two lists of dicts (each with "name" and "score"), stacks them vertically with pd.concat and ignore_index, and returns the total number of rows after stacking
starter: |
  import pandas as pd

  def combine(table_a, table_b):
      return 0

cases: |
  [{"name":"Alice","score":80}], [{"name":"Bob","score":90},{"name":"Carol","score":85}] -> 3
hint: pd.concat([pd.DataFrame(table_a), pd.DataFrame(table_b)], ignore_index=True), then return the length.
explain: 1 + 2 = 3 rows; after ignore_index the index is renumbered from 0.
```

```quiz
type: function
q: Write a function melt_down(wide) where wide is a list of dicts shaped like [{"name":"Alice","English":80,"Maths":90}]. Use pd.melt to turn it into a long table with id_vars=['name'], and return the number of rows in the melted result
starter: |
  import pandas as pd

  def melt_down(wide):
      return 0

cases: |
  [{"name":"Alice","English":80,"Maths":90},{"name":"Bob","English":70,"Maths":85}] -> 4
hint: df = pd.DataFrame(wide); m = pd.melt(df, id_vars=['name']); return len(m). 2 people x 2 subjects = 4 rows.
explain: melt turns the column names "English"/"Maths" into values in the variable column; each person expands into two rows for a total of 4.
```

## Part 3 · Mini-project

```quiz
type: function
q: Write a function sales_pivot(data) where data is a list of dicts shaped like [{"shop":"Camden","month":"Jan","revenue":3000},{"shop":"Camden","month":"Feb","revenue":3200},{"shop":"Canary Wharf","month":"Jan","revenue":5000}]. Use pivot_table with shops as the row index, months as columns, summing the revenue (aggfunc='sum'). Return the value for Canary Wharf in January (5000). If January is not a column or the value is NaN, return 0
starter: |
  import pandas as pd

  def sales_pivot(data):
      return 0

cases: |
  [{"shop":"Camden","month":"Jan","revenue":3000},{"shop":"Camden","month":"Feb","revenue":3200},{"shop":"Canary Wharf","month":"Jan","revenue":5000}] -> 5000
hint: df = pd.DataFrame(data); pt = pd.pivot_table(df, index='shop', columns='month', values='revenue', aggfunc='sum', fill_value=0); use .get or .loc to fetch the value, watching the column type.
explain: pivot_table aggregates any duplicate (shop, month) combinations automatically using aggfunc='sum', rather than erroring out on duplicates the way pivot does. Canary Wharf / Jan = 5000.
```
