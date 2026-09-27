# Chapter 6 · Integrated Combat · Chapter Test

> This test covers the core content of Lessons 26–30: reverse-engineering from data ranges, greedy vs. DP, binary search on answer, prefix sums + hash + sliding window, and comprehensive optimization. 8 problems total: 5 multiple choice + 2 function + 1 project.

## Part 1 · Multiple Choice

```quiz
type: choice
exam: true
q: A problem states n ≤ 10⁵. Which complexity is safe?
options:
- O(n log n), about 1.7×10⁶ operations
- O(n²), about 10¹⁰ operations
- O(n³), about 10¹⁵ operations
- O(2ⁿ), incalculable
answer: 0
explain: At n=10⁵, O(n log n) ≈ 1.7×10⁶ operations, easily done within 1 second. O(n²) ≈ 10¹⁰ operations will cause a severe timeout. The data range directly determines the maximum allowable algorithm complexity.
```

```quiz
type: choice
exam: true
q: Regarding the difference between greedy algorithms and dynamic programming, which statement is correct?
options:
- Greedy makes only locally optimal choices at each step and doesn't always reach the global optimum; DP considers all subproblems and has broader applicability
- Greedy is always faster than DP and always correct
- DP can only be used for optimization, not counting
- Greedy and DP have no difference; they're just different writing styles
answer: 0
explain: Greedy makes only locally optimal choices at each step, and it's only correct when the "greedy choice property" holds; DP derives solutions by considering all subproblem optima and has broader applicability. Greedy isn't always correct (e.g., {1,3,4} for amount 6), and DP can be used for counting.
```

```quiz
type: choice
exam: true
q: In binary search on answer, if the problem is "minimize the maximum value," what should you do when check(mid) returns True?
options:
- Shrink the upper bound: right = mid
- Shrink the lower bound: left = mid + 1
- Expand the upper bound: right = mid + 1
- Shrink both bounds: left = mid + 1, right = mid
answer: 0
explain: In a "minimize the maximum" problem, check(mid) being True means mid is feasible and the answer can be smaller, so we shrink the upper bound right = mid. If check is False, mid is too small to be feasible, so we expand the lower bound left = mid + 1.
```

```quiz
type: choice
exam: true
q: When using prefix sums + a hash table to find "the number of subarrays with sum K," why do we initialize prefix_count[0] = 1?
options:
- To handle the case of "subarrays starting at index 0" (when the current prefix sum exactly equals K)
- To speed up hash table lookups
- To save memory
- To prevent array index out of bounds
answer: 0
explain: When the current prefix sum cur exactly equals K, target = cur - K = 0, and we need prefix_count[0] to be 1 to count "the subarray starting at index 0." The empty prefix sum is 0 and appears once—this is a valid initial state.
```

```quiz
type: choice
exam: true
q: In Kadane's Algorithm, what does cur = max(nums[i], cur + nums[i]) mean?
options:
- If the previous subarray sum is negative, discard it and restart from the current element; otherwise extend the previous subarray
- Always restart computation from the current element
- Always append the current element to the previous subarray
- If the current element is larger than the previous sum, clear the previous subarray
answer: 0
explain: The core insight of Kadane's Algorithm: if the maximum subarray sum ending at position i-1 is negative, adding nums[i] would only make the result smaller, so it's better to restart from nums[i] (take nums[i]). If cur is positive, adding nums[i] makes the result larger, so extend the previous subarray.
```

## Part 2 · Coding Problems

```quiz
type: function
exam: true
q: Write a function min_speed(piles, h) where you have piles of bananas, and the i-th pile has piles[i] bananas. You can eat at most k bananas per hour; if a pile has fewer than k bananas, you finish it and do nothing else that hour. Find the minimum eating speed k that lets you finish all bananas within h hours. Use binary search on answer: check(k) computes the total time needed at speed k, where total time = sum(ceil(piles[i]/k)), using (p+k-1)//k for ceiling division. Binary search range: [1, max(piles)].
func: min_speed
starter: |
  def min_speed(piles, h):
      # Return the minimum eating speed
      # Modify below
      return 0
cases: |
  min_speed([3, 6, 7, 11], 8) -> 4
  min_speed([30, 11, 23, 4, 20], 5) -> 30
  min_speed([30, 11, 23, 4, 20], 6) -> 23
  min_speed([1], 1) -> 1
  min_speed([10, 10], 4) -> 5
hint: First write check(k): total = sum((p+k-1)//k for p in piles), return total <= h. Then binary search [1, max(piles)], minimization: check True → right=mid, check False → left=mid+1.
explain: check(k) computes the total time to eat all piles at speed k: each pile takes ceil(piles[i]/k) hours, using (p+k-1)//k for ceiling division. If total time <= h, speed k is feasible. Binary search [1, max(piles)] for the minimum feasible k. This is the classic combination of binary search on answer + feasibility check.
```

```quiz
type: function
exam: true
q: Write a function longest_substring_k_distinct(s, k) that returns the length of the longest substring of s with at most k distinct characters. Use sliding window + hash table: the hash table tracks the count of each character in the window; when the number of distinct characters exceeds k, shrink the left boundary until it's at most k.
func: longest_substring_k_distinct
starter: |
  def longest_substring_k_distinct(s, k):
      # Return the length of the longest substring with at most k distinct characters
      # Modify below
      return 0
cases: |
  longest_substring_k_distinct("eceba", 2) -> 3
  longest_substring_k_distinct("aa", 1) -> 2
  longest_substring_k_distinct("abc", 0) -> 0
  longest_substring_k_distinct("aabbcc", 1) -> 2
  longest_substring_k_distinct("", 2) -> 0
hint: Use a hash table (or Counter) to track character counts in the window. Expand with right pointer; if distinct count > k, move left and decrement counts (remove the key when count reaches 0). Maintain the maximum window length.
explain: Sliding window + hash table. The right pointer expands one character at a time, with a dictionary tracking each character's count in the window. When the number of keys (distinct characters) exceeds k, move the left pointer: decrement the count, and remove the key if it reaches 0. Update the maximum window length as right - left + 1 each iteration.
```

## Part 3 · Comprehensive Project

```quiz
type: function
exam: true
q: |
  ## Comprehensive Project: Best Time to Buy and Sell Stock II

  Write a function max_profit(prices) where prices[i] is the stock price on day i.
  You may complete **as many transactions as you like** (multiple buys and sells), but you must sell before buying again (you can only hold one stock at a time).
  Find the maximum profit. Use greedy: whenever the next day's price is higher than today's, add the difference to your profit.
  Bonus requirement: also return the actual trading plan as a list of (buy day, sell day) pairs.
  For example, prices=[7,1,5,3,6,4] should buy on day 1 (price 1) and sell on day 2 (price 5) for profit 4, then buy on day 3 (price 3) and sell on day 4 (price 6) for profit 3, total profit 7, returning [(1,2),(3,4)].

func: max_profit
starter: |
  def max_profit(prices):
      # Return (maximum profit, list of trading pairs)
      # Trading pairs are [(buy_index, sell_index), ...]
      # Modify below
      return (0, [])
cases: |
  max_profit([7, 1, 5, 3, 6, 4]) -> (7, [(1, 2), (3, 4)])
  max_profit([1, 2, 3, 4, 5]) -> (4, [(0, 4)])
  max_profit([7, 6, 4, 3, 1]) -> (0, [])
  max_profit([1]) -> (0, [])
  max_profit([2, 4, 1, 3, 5]) -> (6, [(0, 1), (2, 4)])
hint: Greedy: iterate through prices; if prices[i] > prices[i-1], you can buy at i-1 and sell at i for profit. Sum all positive differences for maximum profit. But merge consecutive upward segments (e.g., [1,2,3,4,5] should be one transaction (0,4) for profit 4, not three). Merging rule: if the previous sale was at i-1 and this buy is also at i-1 (consecutive rise), extend the previous transaction to i; otherwise start a new one.
explain: This is a comprehensive problem combining greedy and interval merging. Core greedy idea: summing all positive differences gives the maximum profit (since unlimited transactions are allowed). But returning the trading plan requires merging: while iterating, if prices[i] > prices[i-1], check if the previous transaction ended exactly at i-1 (consecutive rise); if so, extend the sell point to i; otherwise start a new pair (i-1, i). This way [1,2,3,4,5] gets merged into one transaction (0,4).
```
