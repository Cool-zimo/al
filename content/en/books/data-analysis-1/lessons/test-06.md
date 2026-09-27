# Chapter 6 · Practice projects & next steps · Chapter Test

> Eight questions. This chapter tests no new API — it tests whether you can combine what you know.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: With a (12, 5) sales table (12 months × 5 products), each product's annual total comes from?
options:
- sum(axis=0)
- sum(axis=1)
- sum(axis=2)
- sum()
answer: 0
explain: axis=0 adds across rows (months), collapsing 12 months into one and leaving each product's total. axis=1 adds across products, giving 12 monthly totals. Mantra: axis=n collapses dimension n.
```

```quiz
type: choice
q: What's the length of np.convolve(x, kernel, mode='valid')?
options:
- The same as x
- len(x) + len(kernel) - 1
- len(x) - len(kernel) + 1
- len(x) - len(kernel)
answer: 2
explain: valid computes only where the window fully overlaps: n - k + 1. Use valid for moving averages — full and same produce distorted values at the ends.
```

```quiz
type: choice
q: In a (1080, 1920, 3) image, dimension 0 is?
options:
- Width (columns)
- Height (rows)
- The RGB channels
- The number of images
answer: 1
explain: The order is height × width × channels. Read a pixel with img[y, x] — row first, the reverse of the mathematical (x, y).
```

```quiz
type: choice
q: Why not call np.append inside a loop?
options:
- It changes the dtype
- It allocates a bigger array and copies everything each time — O(n²)
- It only appends one element
- It raises
answer: 1
explain: np.append looks in-place but allocates and copies every call. Pre-allocate np.empty(n) or collect in a list and convert once.
```

```quiz
type: choice
q: How do NumPy and pandas relate?
options:
- pandas replaces NumPy
- pandas is built on NumPy; a Series' .values is an ndarray
- They're independent
- NumPy is a simplified pandas
answer: 1
explain: pandas' foundation is NumPy, so broadcasting, axes and boolean indexing carry straight over. Groundwork, not obsolescence.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Take the 3-day moving average of [1,2,3,4,5,6] (valid mode) and print the second value
starter: |
  import numpy as np
  
  x = np.array([1., 2., 3., 4., 5., 6.])
  k = np.ones(3) / 3
  
  # np.convolve(x, k, mode='valid') → [2, 3, 4, 5]
  # the second value is 3
  
  print("edit here")
tests:
- assert "3" in __out
hint: print(np.convolve(x, k, mode='valid')[1]). valid's length is n-k+1 = 4; the result is [2,3,4,5].
explain: A moving average is an average over a sliding window. valid drops the incomplete end windows and in exchange every value comes from a full set of k points.
```

```quiz
type: function
q: Write top_n(scores, n): return the indices of the n highest scores, highest first
func: top_n
starter: |
  import numpy as np
  
  def top_n(scores, n):
      # scores is a 1-D array, n is how many to take
      # return the indices of the n highest, ordered highest first
      return None
cases: |
  [50,80,90,60], 2 -> [2, 1]
  [10,30,20], 1 -> [1]
hint: return np.argsort(np.array(scores))[::-1][:n]. argsort ascends; reversing gives descending; take the first n.
explain: The standard leaderboard implementation. It returns indices rather than values — with indices you can go back to the original table and pull out names, classes and every other field. That's argsort's real worth.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "sales dashboard": a 12-month × 5-product units table → revenue → best month and top 3 products → quarterly rollup → a full report
checklist:
- Used broadcasting to turn units × price into revenue
- Computed monthly and per-product totals with sum(axis=)
- Found the best month with argmax
- Ranked products with argsort(...)[::-1]
- Grouped into quarters with reshape and summed
- Printed a tidy report (with shares or a bar chart)
- The code runs clean with no errors
starter: |
  import numpy as np
  
  np.random.seed(42)
  products = ['Keyboard', 'Mouse', 'Monitor', 'Headset', 'Webcam']
  prices = np.array([199, 89, 1299, 399, 259])
  base = np.array([200, 500, 80, 300, 150])
  
  sales = np.random.randint(-30, 60, size=(12, 5)) + base
  sales = np.clip(sales, 0, None)          # units can't be negative
  
  # 1. revenue = units × price (broadcast)
  revenue = sales * prices
  
  # 2. monthly totals, product totals
  monthly = revenue.sum(axis=1)
  by_product = revenue.sum(axis=0)
  
  # 3. carry on: best month, product ranking, quarterly rollup, report
hint: Best month is np.argmax(monthly) + 1 (indices start at 0, months at 1). Rank with np.argsort(by_product)[::-1]. Quarters with revenue.reshape(4, 3, 5).sum(axis=(1, 2)). Add shares: by_product / by_product.sum() * 100.
explain: The closing project of the book, and it introduces nothing new — it's broadcasting, axis, argmax, argsort and reshape from the previous six chapters, combined. Get this running and you can take a structured dataset through analysis on your own.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on:**

```python
import numpy as np
x = np.array([1., 2., 3., 4., 5., 6.])
k = np.ones(3) / 3
print(np.convolve(x, k, mode='valid')[1])
```

**Function:**

```python
import numpy as np

def top_n(scores, n):
    return np.argsort(np.array(scores))[::-1][:n]
```

**Mini project:**

```python
import numpy as np

np.random.seed(42)
products = ['Keyboard', 'Mouse', 'Monitor', 'Headset', 'Webcam']
prices = np.array([199, 89, 1299, 399, 259])
base = np.array([200, 500, 80, 300, 150])

sales = np.random.randint(-30, 60, size=(12, 5)) + base
sales = np.clip(sales, 0, None)
revenue = sales * prices

monthly = revenue.sum(axis=1)
by_product = revenue.sum(axis=0)
order = np.argsort(by_product)[::-1]
q_rev = revenue.reshape(4, 3, 5).sum(axis=(1, 2))

line = "=" * 48
print(line)
print(f"  annual total {revenue.sum():,.0f}   monthly avg {monthly.mean():,.0f}")
print(f"  best month: #{np.argmax(monthly) + 1}")
print("\n  contribution by product:")
for rank, i in enumerate(order, 1):
    share = by_product[i] / by_product.sum() * 100
    print(f"    {rank}. {products[i]:<10} {by_product[i]:>9,.0f}  ({share:>4.1f}%)")
print("\n  quarterly trend:")
for q, v in enumerate(q_rev, 1):
    print(f"    Q{q}  {v:>9,.0f}  {'#' * int(v / q_rev.max() * 28)}")
print(line)
```

</details>

## *Python Data Analysis 1* ends here

Six chapters, thirty lessons. You can now:

- Replace lists with arrays for numeric work, and explain why it's faster
- Remove loops with broadcasting, computing across mismatched shapes
- Work out exactly which dimension an axis collapses
- Filter and summarise with boolean indexing, fancy indexing and aggregations
- Persist to npy / CSV and cope with missing and dirty values in real data
- Run the full "load → clean → analyse → rank → report" pipeline yourself
- Judge what belongs in NumPy and what belongs in pandas

**Recommended next:** *Algorithms 1* to train problem-solving, or *Data Analysis 2* for pandas and real tables.
