# Chapter 4 · Binary Search · Big Test

> 8 questions. This chapter answers the question: "how to use monotonicity to bring an O(n) search or optimization down to O(log n)."
> **You must answer all of them correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: In standard binary search (closed-interval style), the loop condition is while left <= right. Why <= and not <?
options:
- To align the index
- Because in the closed interval [left, right], when left==right there is still one unchecked element, so the loop must run once more
- To make it faster
- To save memory
answer: 1
explain: The closed interval [left, right] includes both endpoints. When left==right there is still one element inside (mid=left=right) that has not been checked. With <, that element is skipped. The interval is truly empty only when left>right.
```

```quiz
type: choice
q: In binary search, if nums[mid] < target, should you write left = mid or left = mid + 1? Why?
options:
- left = mid, because mid might be the answer
- left = mid + 1, because nums[mid] has already been checked and is not the answer, so it can be dropped
- left = mid, to be safe from infinite loops
- left = mid - 1, because target is on the left
answer: 1
explain: nums[mid] has already been compared with target (mid was too small), so it cannot be the answer and can be removed from the search interval. Write left=mid+1. If you write left=mid, then once the interval shrinks to [0,1], mid=0 and left never changes -> infinite loop.
```

```quiz
type: choice
q: What is the difference between lower_bound and upper_bound?
options:
- There is no difference
- lower_bound finds the first position >= target; upper_bound finds the first position > target
- lower_bound finds the first position > target; upper_bound finds the first position >= target
- lower_bound is for descending arrays
answer: 1
explain: The two differ by a single equals sign: when nums[mid]==target, lower_bound goes left (right=mid, there may be a smaller one), while upper_bound goes right (left=mid+1, looking for something larger than target). Occurrences = upper_bound - lower_bound.
```

```quiz
type: choice
q: Why can binary search on the answer (like the wood-cutting problem) use binary search?
options:
- Because the answer is always in the array
- Because the answer is monotonic: the shorter the piece, the more pieces you can cut
- Because the array is sorted
- Because the log lengths are even
answer: 1
explain: Binary search on the answer requires the answer space to be monotonic. In wood cutting, shorter pieces -> more pieces per log. That monotonicity lets us binary-search for "the largest feasible piece length," using the feasibility test can_cut(L) = total pieces >= k.
```

```quiz
type: choice
q: When searching in a rotated sorted array, why is at least one half sorted every time we pick a mid?
options:
- Because the array is shuffled randomly
- Because a rotated array is one cut in a sorted array then reassembled, so one segment is always a complete ascending sequence
- Because mid always points at the maximum
- Because the array length is always a power of two
answer: 1
explain: Rotation = move the first k elements of a sorted array to the end. No matter where you cut, at least one of [left,mid] and [mid,right] was not cut and stays fully ascending. Use that sorted segment to decide which side target is on.
```

---

## Part 2 · Hands-On Questions

```quiz
type: function
q: Write binary_search_first(nums, target): find the first occurrence of target in an ordered array, return -1 if not found
func: binary_search_first
starter: |
  def binary_search_first(nums, target):
      # lower_bound idea
      # After the loop, check whether nums[left] == target
      return -1
cases: |
  [1,2,2,2,3,4], 2 -> 1
  [1,2,3,4,5], 3 -> 2
  [1,2,3], 5 -> -1
hint: left=0; right=len(nums); while left<right: mid=(left+right)//2; if nums[mid]<target: left=mid+1; else: right=mid; return left if left<len(nums) and nums[left]==target else -1.
explain: The lower_bound template finds the first position >= target; then check whether the value there actually equals target. If not, target is absent. right starts at len(nums) so we can handle the case where target is larger than every element.
```

```quiz
type: function
q: Write is_perfect_square(num): decide whether a non-negative integer is a perfect square (use binary search on the answer, do not use sqrt)
func: is_perfect_square
starter: |
  def is_perfect_square(num):
      # Binary search for x such that x*x == num
      # Search range [0, num]
      # Note: use x*x <= num as the test
      return False
cases: |
  16 -> True
  14 -> False
  0 -> True
hint: left=0; right=num; ans=-1; while left<=right: mid=(left+right)//2; sq=mid*mid; if sq==num: return True; elif sq<num: left=mid+1; else: right=mid-1; return False. The square root of 0 is 0, so return True.
explain: Testing for a perfect square = binary search for x such that x squared == num. Search range [0,num] (since sqrt(num) <= num). mid*mid could overflow in other languages, so use a wider integer type there. 0 and 1 are boundary cases.
```

---

## Part 3 · Small Project

```quiz
type: project
q: Build a "binary search toolbox": standard binary search, lower_bound, upper_bound, and binary search on the answer (wood cutting) -- four modules in one
checklist:
- Implements standard binary search (closed interval) and prints at least one query result
- Implements lower_bound and upper_bound and prints at least one query
- Uses lower_bound/upper_bound to count how many times a value occurs
- Implements binary search on the answer for wood cutting and prints the result
- All four modules handle boundaries (empty array, single element, value not found, etc.)
- The code runs end to end with no errors
starter: |
  # ===== Standard binary search =====
  def binary_search(nums, target):
      left, right = 0, len(nums) - 1
      while left <= right:
          mid = (left + right) // 2
          if nums[mid] == target:
              return mid
          elif nums[mid] < target:
              left = mid + 1
          else:
              right = mid - 1
      return -1
  
  # ===== lower_bound =====
  def lower_bound(nums, target):
      left, right = 0, len(nums)
      while left < right:
          mid = (left + right) // 2
          if nums[mid] < target:
              left = mid + 1
          else:
              right = mid
      return left
  
  # ===== upper_bound =====
  def upper_bound(nums, target):
      left, right = 0, len(nums)
      while left < right:
          mid = (left + right) // 2
          if nums[mid] <= target:
              left = mid + 1
          else:
              right = mid
      return left
  
  # ===== Wood cutting (binary search on the answer) =====
  def can_cut(lengths, k, L):
      return sum(l // L for l in lengths) >= k
  
  def max_cut_length(lengths, k):
      left, right = 1, max(lengths)
      ans = 0
      while left <= right:
          mid = (left + right) // 2
          if can_cut(lengths, k, mid):
              ans = mid
              left = mid + 1
          else:
              right = mid - 1
      return ans
  
  # Keep going: prepare test data and print the results of all four modules
hint: Test standard binary search with [1,3,5,7,9] searching for 5; test lower/upper with [1,2,2,2,3] searching for 2; test wood cutting with lengths=[10,20,30], k=5, answer 10.
explain: This project ties together the four forms of binary search from Chapter 4 -- standard search for a position, lower/upper for boundaries, and binary search on the answer for an optimum. Their common foundation is using "monotonicity" to bring O(n) down to O(log n).
```

---

## Reference Answers (Look After You Finish)

<details>
<summary>Click to see the reference implementation</summary>

**Standard binary search:**

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

**lower_bound:**

```python
def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

**upper_bound:**

```python
def upper_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return left
```

**Wood cutting:**

```python
def can_cut(lengths, k, L):
    return sum(l // L for l in lengths) >= k

def max_cut_length(lengths, k):
    left, right = 1, max(lengths)
    ans = 0
    while left <= right:
        mid = (left + right) // 2
        if can_cut(lengths, k, mid):
            ans = mid
            left = mid + 1
        else:
            right = mid - 1
    return ans
```

</details>

## What You Learned in This Chapter

- **Standard binary search**: closed interval + `<=` + `+/-1`, a template that will not go wrong
- **lower / upper_bound**: finding boundaries, differing by one equals sign
- **Binary search on the answer**: binary-searching the answer itself, not an index
- **Rotated arrays**: local sortedness is enough for binary search
- **Core idea**: whenever there is monotonicity, binary search can turn O(n) into O(log n)

**Next chapter: string basics** -- immutability, frequency counting with a hash, and two-pointer techniques.
