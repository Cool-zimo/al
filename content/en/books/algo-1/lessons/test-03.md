# Chapter 3 · Prefix Sums & Difference Arrays · Final Test

> 8 questions. This chapter is about how preprocessing can bring interval operations from O(n) down to O(1).
> **You must answer every question correctly to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: For a 1D prefix sum query of interval [l, r], which formula is correct?
options:
- prefix[r] - prefix[l]
- prefix[r+1] - prefix[l]
- prefix[r] - prefix[l-1]
- prefix[r+1] - prefix[l+1]
answer: 1
explain: prefix[i] stores the sum of the first i elements (nums[0..i-1]). The sum of interval [l,r] = sum of first r+1 elements - sum of first l elements = prefix[r+1] - prefix[l]. This style is recommended because when l=0, prefix[0]=0 holds naturally with no special case required.
```

```quiz
type: choice
q: In 2D prefix sum construction, the inclusion-exclusion formula is?
options:
- prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] + prefix[i-1][j-1] + matrix[i-1][j-1]
- prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
- prefix[i][j] = prefix[i-1][j] * prefix[i][j-1] / prefix[i-1][j-1]
- prefix[i][j] = max(prefix[i-1][j], prefix[i][j-1]) + matrix[i-1][j-1]
answer: 1
explain: prefix[i-1][j] and prefix[i][j-1] both contain the top-left region, so it gets counted twice - hence we subtract prefix[i-1][j-1] once. This is the inclusion-exclusion principle: add the top, add the left, subtract the overlapping top-left, add the current element.
```

```quiz
type: choice
q: For a difference array adding v to interval [l, r], the correct operation is?
options:
- diff[l] += v, diff[r] -= v
- diff[l] += v, diff[r+1] -= v (if r+1 < n)
- diff[l-1] += v, diff[r] -= v
- diff[l] += v, diff[r+1] += v
answer: 1
explain: Adding v to a range creates a "step" at l (diff[l]+=v) and the step disappears at r+1 (diff[r+1]-=v). During restoration the prefix sum propagates v across the entire interval l..r automatically. The r+1<n guard is mandatory to avoid an index overflow.
```

```quiz
type: choice
q: What is the relationship between prefix sums and difference arrays?
options:
- They are unrelated
- A difference array is the inverse of a prefix sum: prefix sums accelerate range queries, differences accelerate range updates
- They are both O(n^2)
- Prefix sums are for strings, differences are for arrays
answer: 1
explain: Prefix sums work by precomputing sums to accelerate "range sum" queries. Differences work by storing gaps between adjacent elements to accelerate "range addition" updates. Restoring a difference array is exactly a prefix sum. One handles queries, the other handles updates - they are inverse operations.
```

```quiz
type: choice
q: Why does the prefix sum array need to be one element longer than the original (length n+1 instead of n)?
options:
- To align indices
- Because prefix[0] must be 0, so that querying [0, r] with prefix[r+1]-prefix[0] is also valid
- To reduce computation
- For aesthetic reasons
answer: 1
explain: prefix[0]=0 is the natural definition of "the sum of zero elements." With it, querying [0, r] requires no special case - prefix[r+1]-prefix[0] = prefix[r+1]-0, using the same formula as every other query. Without the leading zero, l=0 would need explicit handling.
```

---

## Part 2 · Hands-On

```quiz
type: function
q: Write range_sum_prefix(nums, queries): preprocess with a prefix sum, then return a list of sums for all queries [l,r]
func: range_sum_prefix
starter: |
  def range_sum_prefix(nums, queries):
      # queries: [(l1, r1), (l2, r2), ...]
      # build the prefix sum
      # answer each query
      return []
cases: |
  [1,2,3,4,5], [(0,2),(1,3),(0,4)] -> [6,9,15]
  [10], [(0,0)] -> [10]
  [1,2,3], [(0,2)] -> [6]
hint: n=len(nums); prefix=[0]*(n+1); for i in range(n): prefix[i+1]=prefix[i]+nums[i]; result=[]; for l,r in queries: result.append(prefix[r+1]-prefix[l]); return result. For a single element, prefix=[0,10] and query [0,0]=prefix[1]-prefix[0]=10-0=10.
explain: Prefix sums shine brightest with multiple queries: one O(n) preprocessing pass, then O(1) per query. If you re-traverse the array for every query, m queries cost O(mn).
```

```quiz
type: function
q: Write range_add_all(nums, operations): apply every range-add operation to nums using a difference array, return the final array
func: range_add_all
starter: |
  def range_add_all(nums, operations):
      # operations: [(l1, r1, v1), (l2, r2, v2), ...]
      # build the difference array
      # apply every operation
      # restore and return
      return nums
cases: |
  [0,0,0,0], [(0,2,1),(1,3,2)] -> [1,3,3,2]
  [5,5,5], [(0,2,10)] -> [15,15,15]
  [1,2,3,4], [(0,3,1),(1,2,-1)] -> [2,2,2,5]
hint: n=len(nums); diff=[0]*(n+1); diff[0]=nums[0]; for i in range(1,n): diff[i]=nums[i]-nums[i-1]; for l,r,v in operations: diff[l]+=v; if r+1<n: diff[r+1]-=v; result=[0]*n; result[0]=diff[0]; for i in range(1,n): result[i]=result[i-1]+diff[i]; return result.
explain: (0,2,1) adds 1 to positions 0,1,2; (1,3,2) adds 2 to positions 1,2,3. Final: position 0=1, position 1=3, position 2=3, position 3=2. Differences turn every O(n) range operation into O(1).
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Build a "Prefix Sum + Difference Array Toolkit": it should include three modules - 1D prefix sum construction and query, 2D prefix sum construction and query, and difference-array range addition
checklist:
- Implement 1D prefix sums: a build function and a query function, and print at least one query result
- Implement 2D prefix sums: a build function and a query function, and print at least one submatrix sum
- Implement difference arrays: range addition plus restoration, and print the final result
- Every module must handle boundaries explicitly (empty arrays, single elements, etc.)
- The code runs cleanly with no errors
starter: |
  # ===== 1D Prefix Sum =====
  def build_prefix_1d(nums):
      prefix = [0] * (len(nums) + 1)
      for i in range(len(nums)):
          prefix[i + 1] = prefix[i] + nums[i]
      return prefix
  
  def query_1d(prefix, l, r):
      return prefix[r + 1] - prefix[l]
  
  # ===== 2D Prefix Sum =====
  def build_prefix_2d(matrix):
      m = len(matrix)
      n = len(matrix[0]) if m > 0 else 0
      prefix = [[0] * (n + 1) for _ in range(m + 1)]
      for i in range(1, m + 1):
          for j in range(1, n + 1):
              prefix[i][j] = (prefix[i-1][j] + prefix[i][j-1]
                           - prefix[i-1][j-1] + matrix[i-1][j-1])
      return prefix
  
  def query_2d(prefix, r1, c1, r2, c2):
      return (prefix[r2+1][c2+1] - prefix[r1][c2+1]
            - prefix[r2+1][c1] + prefix[r1][c1])
  
  # ===== Difference Array =====
  def range_add_all(nums, operations):
      n = len(nums)
      diff = [0] * (n + 1)
      diff[0] = nums[0]
      for i in range(1, n):
          diff[i] = nums[i] - nums[i - 1]
      for l, r, v in operations:
          diff[l] += v
          if r + 1 < n:
              diff[r + 1] -= v
      result = [0] * n
      result[0] = diff[0]
      for i in range(1, n):
          result[i] = result[i - 1] + diff[i]
      return result
  
  # Continue: prepare test data and print results from all three modules
hint: For 1D use [1,2,3,4,5] and query (1,3); for 2D use [[1,2,3],[4,5,6],[7,8,9]] and query (0,0,1,1); for differences use [0,0,0,0] and [(0,2,1),(1,3,2)].
explain: This project ties together the three core techniques of Chapter 3. Their common theme is using "preprocessing" to bring interval operations from O(n) down to O(1) - prefix sums handle queries, differences handle updates. These are high-frequency tools in interviews and competitive programming.
```

---

## Reference Solutions (check after completing)

<details>
<summary>Click to reveal reference implementations</summary>

**1D Prefix Sum:**

```python
def build_prefix_1d(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

def query_1d(prefix, l, r):
    return prefix[r + 1] - prefix[l]
```

**2D Prefix Sum:**

```python
def build_prefix_2d(matrix):
    m = len(matrix)
    n = len(matrix[0]) if m > 0 else 0
    prefix = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            prefix[i][j] = (prefix[i-1][j] + prefix[i][j-1]
                         - prefix[i-1][j-1] + matrix[i-1][j-1])
    return prefix

def query_2d(prefix, r1, c1, r2, c2):
    return (prefix[r2+1][c2+1] - prefix[r1][c2+1]
          - prefix[r2+1][c1] + prefix[r1][c1])
```

**Difference Array:**

```python
def range_add_all(nums, operations):
    n = len(nums)
    diff = [0] * (n + 1)
    diff[0] = nums[0]
    for i in range(1, n):
        diff[i] = nums[i] - nums[i - 1]
    for l, r, v in operations:
        diff[l] += v
        if r + 1 < n:
            diff[r + 1] -= v
    result = [0] * n
    result[0] = diff[0]
    for i in range(1, n):
        result[i] = result[i - 1] + diff[i]
    return result
```

</details>

## What You Learned in This Chapter

- **1D prefix sums**: preprocessing O(n), query O(1), formula is `prefix[r+1] - prefix[l]`
- **2D prefix sums**: inclusion-exclusion, four add/subtract steps for both construction and query
- **Difference arrays**: range updates O(1), restoration O(n), the inverse of prefix sums
- **When to use which**: interval queries call for prefix sums, interval updates call for differences
- **Classic applications**: people-flow statistics, flight bookings, meeting-room scheduling

**Next chapter: Binary Search** — using monotonicity to bring an O(n) search down to O(log n).
