# Chapter 1 · Complexity & algorithmic thinking · Chapter Test

> Eight questions. Not much code in this chapter, but it sets the standard you'll judge every later problem by.
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: What does big-O notation drop? (pick the most complete answer)
options:
- Only constant factors
- Only lower-order terms
- Both constant factors and lower-order terms — it keeps only the highest-order trend
- It drops nothing
answer: 2
explain: 3n + 100 becomes O(n), and n²/2 + 5n becomes O(n²). Constant factors (the 3 and the 1/2) and lower-order terms (100 and 5n) are discarded, because once n is large enough their effect on the trend is negligible.
```

```quiz
type: choice
q: Code with an O(n) single loop followed by an O(n²) nested loop has overall complexity?
options:
- O(n) + O(n²)
- O(n²)
- O(n³)
- O(2n²)
answer: 1
explain: When adding, keep the largest term — and big-O keeps neither plus signs nor coefficients. At large n the n² term completely dominates n (1000× at n=1000), so the answer is O(n²).
```

```quiz
type: choice
q: An algorithm that halves the problem size at every step has what time complexity?
options:
- O(n)
- O(log n)
- O(n log n)
- O(n/2)
answer: 1
explain: The step count is "how many times can n be divided by 2", which is log₂n. It's the best complexity after O(1): going from n=1000 to n=1 000 000 (1000×) moves the count from 10 to just 20 steps.
```

```quiz
type: choice
q: The dict-assisted two-sum solution has which time and space complexity?
options:
- O(n) time, O(1) space
- O(n) time, O(n) space
- O(n²) time, O(1) space
- O(n²) time, O(n) space
answer: 1
explain: One pass gives O(n) time; the dict holds up to n entries so extra space is O(n). The textbook space-for-time trade — spend memory to fall from O(n²) to O(n). Measured at n=4000 it was 1183× faster.
```

```quiz
type: choice
q: Using the doubling method, you find the time grows about 4× when n doubles. The complexity is?
options:
- O(log n)
- O(n)
- O(n log n)
- O(n²)
answer: 3
explain: The multiplier reveals the order: 2× means O(n), 4× means O(n²), 8× means O(n³), and barely changing means O(1) or O(log n). It's the most practical way to find a bottleneck without reading the code.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Use the "remember as you go" approach to check for duplicates, and print the result (this list has one)
starter: |
  def has_duplicate(items):
      seen = set()
      for x in items:
          if x in seen:
              return True
          seen.add(x)
      return False
  
  # this list contains 7 twice, so it should print True
  
  print("edit here")
tests:
- assert "True" in __out
hint: print(has_duplicate([3, 7, 1, 7, 9])). A set's `in` test is O(1), so the whole function is a single pass — O(n) — whereas pairwise comparison is O(n²).
explain: The core example of this chapter. At n=8000 it takes 0.228 ms while the nested loop takes 916 ms — 4000× apart. Remember "replace the inner loop with a set"; countless problems yield to it.
```

```quiz
type: function
q: Write count_pairs_sum(nums, target): count how many pairs (i < j) sum to target
func: count_pairs_sum
starter: |
  def count_pairs_sum(nums, target):
      # requires an O(n) solution: use a dict of how often each value occurs
      # while scanning, look up how many times target - x has appeared and add it up
      # return the number of pairs (not indices)
      return None
cases: |
  [1,2,3,4,5], 6 -> 2
  [1,1,1], 2 -> 3
  [1,2], 99 -> 0
hint: cnt = {}; ans = 0; then for x in nums: need = target - x; ans += cnt.get(need, 0); cnt[x] = cnt.get(x, 0) + 1; finally return ans.
explain: With a frequency dict, each pair costs one lookup, so the whole thing is O(n). Note [1,1,1] with target 2 gives 3 — choosing any two of three 1s gives C(3,2)=3 pairs, not 1 or 2.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "complexity bench": write two solutions to the same problem (O(n²) and O(n)), time them with perf_counter at several data sizes, print a table and verify what happens when n doubles
checklist:
- Wrote two functions solving the same problem, one O(n²) and one O(n)
- Timed with time.perf_counter(), running several times and keeping the minimum
- Measured at least three data sizes (e.g. 500 / 1000 / 2000)
- Printed the time at each size and the ratio versus the previous size
- Inferred each one's complexity from the ratio and printed it
- The code runs clean with no errors
starter: |
  import time
  
  def solve_slow(items):        # O(n^2): pairwise
      n = len(items)
      for i in range(n):
          for j in range(i + 1, n):
              if items[i] == items[j]:
                  return True
      return False
  
  def solve_fast(items):        # O(n): with a set
      seen = set()
      for x in items:
          if x in seen:
              return True
          seen.add(x)
      return False
  
  def measure(fn, n, reps=3):
      items = list(range(n))           # no duplicates, so it must run to the end
      best = float('inf')
      for _ in range(reps):
          t0 = time.perf_counter()
          fn(items)
          best = min(best, (time.perf_counter() - t0) * 1000)
      return best
  
  # carry on: measure at [500, 1000, 2000], print times and ratios
hint: Keep the previous time in a variable and print best/prev for the ratio. Use list(range(n)) so there are no duplicates — otherwise the function returns early and you never measure the worst case.
explain: This ties the chapter together: write two solutions → time them properly → infer complexity from the doubling ratio. Afterwards you'll have watched O(n²) grow 4× per doubling and O(n) grow 2× — theory and measurement agreeing exactly.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on:**

```python
def has_duplicate(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False

print(has_duplicate([3, 7, 1, 7, 9]))     # True
```

**Function:**

```python
def count_pairs_sum(nums, target):
    cnt = {}
    ans = 0
    for x in nums:
        need = target - x
        ans += cnt.get(need, 0)     # every earlier `need` pairs with this x
        cnt[x] = cnt.get(x, 0) + 1
    return ans
```

**Mini project:**

```python
import time

def solve_slow(items):
    n = len(items)
    for i in range(n):
        for j in range(i + 1, n):
            if items[i] == items[j]:
                return True
    return False

def solve_fast(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False

def measure(fn, n, reps=3):
    items = list(range(n))
    best = float('inf')
    for _ in range(reps):
        t0 = time.perf_counter()
        fn(items)
        best = min(best, (time.perf_counter() - t0) * 1000)
    return best

for name, fn in [("nested loops O(n^2)", solve_slow), ("set        O(n)", solve_fast)]:
    print(f"\n{name}")
    prev = None
    for n in [500, 1000, 2000]:
        ms = measure(fn, n)
        ratio = f"{ms/prev:.2f}x" if prev else "—"
        print(f"  n={n:>5}  {ms:>8.3f} ms   {ratio}")
        prev = ms
```

</details>

## What you learned in this chapter

- **Why complexity matters**: two solutions to one problem can differ by 4000× at n=8000; at a million items it's "four hours" versus "0.03 seconds"
- **Big-O**: describes the growth trend, drops constants and lower-order terms, sequential takes the max and nested multiplies
- **The ranking**: `O(1)` < `O(log n)` < `O(n)` < `O(n log n)` < `O(n²)` < `O(2ⁿ)`
- **Space complexity**: trade space for time (hash assistance is typical), but think the other way when memory is tight
- **Measuring**: run several times and keep the minimum; use the doubling method to infer complexity

**Next chapter: arrays and two pointers** — putting complexity analysis to work in real code, learning to bring O(n²) down to O(n).
