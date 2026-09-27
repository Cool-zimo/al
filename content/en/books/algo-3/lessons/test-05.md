# Chapter 5 · Introduction to Dynamic Programming · Chapter Test

> This chapter covers the core concepts of dynamic programming: the essence of DP, state definition and transition equations, 1D DP (House Robber / LIS), 2D DP (LCS / Edit Distance), 0/1 Knapsack and Unbounded Knapsack.

## Part 1 · Multiple Choice

```quiz
type: choice
exam: true
q: Which of the following are classic applications of dynamic programming?
options:
- Fibonacci sequence, Longest Common Subsequence, Knapsack problems
- Binary search, Quick sort, Hash tables
- Breadth-first search, Depth-first search
- Bubble sort, Selection sort
answer: 0
explain: Fibonacci (overlapping subproblems), LCS (2D DP), and Knapsack (combinatorial optimization) are all classic dynamic programming applications. Binary search, sorting, search, and hash tables do not fall under the DP umbrella.
```

```quiz
type: choice
exam: true
q: In dynamic programming, what requirement should the definition of dp[i] satisfy?
options:
- It should be statable in one sentence with a concrete meaning, including context like "reach / ending at / choose" and a specific quantity
- The shorter the better—a single letter is ideal
- As long as the transition equation is correct, the meaning of dp doesn't matter
- It must be a 2D array
answer: 0
explain: The precise definition of dp[i] is the soul of DP. You must be able to say what it represents, what condition it's based on, and what quantity it measures. A vague definition leads to incorrect transition equations—the most common cause of DP failure.
```

```quiz
type: choice
exam: true
q: Why must the inner loop of 0/1 Knapsack traverse in reverse order (from W down to weight[i])?
options:
- Reverse order ensures dp[j-weight[i]] is from the previous round, so items aren't selected repeatedly
- Reverse order is just for code aesthetics
- Reverse order reduces memory usage
- Reverse order is because the items are too heavy
answer: 0
explain: 0/1 Knapsack requires each item at most once. In reverse order, the dp[j-w] needed to update dp[j] hasn't been overwritten yet this round—it's still the "without current item" state, ensuring each item is considered only once.
```

```quiz
type: choice
exam: true
q: In the Longest Common Subsequence (LCS) problem, when text1[i-1] != text2[j-1], the transition is dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Why take the max?
options:
- Because on a mismatch we must try both "dropping text1's character" and "dropping text2's character," taking the better one
- Because both characters can be ignored—just inherit the top-left value
- Because the answer is always 0 on a mismatch
- Because max runs faster
answer: 0
explain: When characters don't match, we try "skipping" one of them to find a longer common subsequence. Skipping text1's character corresponds to dp[i-1][j], skipping text2's to dp[i][j-1]. We take the max because we don't know which strategy yields a longer subsequence.
```

```quiz
type: choice
exam: true
q: Regarding the difference between memoization and bottom-up DP, which statement is correct?
options:
- Memoization is top-down (recursion + lookup table), bottom-up DP fills a table from base cases
- Memoization only works for Fibonacci; bottom-up works for all problems
- Memoization always has higher time complexity than bottom-up
- Bottom-up DP can't handle problems with overlapping subproblems
answer: 0
explain: Memoization is a top-down method: start from the big problem, recursively solve subproblems and cache results. Bottom-up DP starts from base cases and works upward. They solve the same class of problems and typically have the same time complexity.
```

## Part 2 · Coding Problems

```quiz
type: function
exam: true
q: Implement function fib(n) using bottom-up DP to compute the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). Time complexity O(n), space complexity O(1) (use only two variables, no array).
func: fib
starter: |
  def fib(n):
      # Compute the nth Fibonacci number bottom-up, O(1) space
      # Modify below
      return 0
cases: |
  fib(0) -> 0
  fib(1) -> 1
  fib(2) -> 1
  fib(10) -> 55
  fib(20) -> 6765
hint: Use two variables a and b to track F(i-2) and F(i-1). Each iteration: a, b = b, a+b. Initialize a=0, b=1.
explain: Fibonacci bottom-up only needs to maintain the two most recent values. Use a and b to track F(i-2) and F(i-1). Each iteration computes F(i) = a + b, then rolls the values forward. O(1) space, O(n) time.
```

```quiz
type: function
exam: true
q: Implement function longest_increasing_subsequence(nums) that returns the length of the longest strictly increasing subsequence (not necessarily contiguous). Use O(n²) DP: dp[i] is the LIS length ending at index i.
func: longest_increasing_subsequence
starter: |
  def longest_increasing_subsequence(nums):
      # Return the length of the longest strictly increasing subsequence
      # Modify below
      return 0
cases: |
  longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]) -> 4
  longest_increasing_subsequence([0, 1, 0, 3, 2, 3]) -> 4
  longest_increasing_subsequence([7, 7, 7, 7]) -> 1
  longest_increasing_subsequence([1]) -> 1
  longest_increasing_subsequence([]) -> 0
hint: Initialize dp to all 1s. For each i, iterate over all j < i; if nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). Return max(dp), or 0 for an empty array.
explain: dp[i] is the LIS length ending at index i, initialized to 1 (each element forms a subsequence of length 1). For each i, check all j < i; if nums[j] < nums[i], we can append nums[i] to the subsequence ending at j, updating dp[i]. The final answer is the maximum value in dp.
```

## Part 3 · Mini Project

```quiz
type: function
exam: true
q: |
  ## Project: Best Time to Buy and Sell Stock (Dynamic Programming)

  Given an array `prices` where the i-th element is the price of a stock on day i.
  You may complete at most one transaction (buy once, sell once), and you must buy before you sell.
  Find the maximum profit. If no positive profit is possible, return 0.

  Use a DP approach:
  - Define `dp[i]` as the maximum profit achievable if you sell on day i
  - Transition: track the minimum price seen so far
  - Or more simply: maintain "the lowest buy price so far" and "the maximum profit"

  Implement function `max_profit(prices)` that returns the maximum profit.

  Example: prices = [7, 1, 5, 3, 6, 4]
  - Buy on day 1 (price 1), sell on day 4 (price 6), profit = 5
  - Return 5

func: max_profit
starter: |
  def max_profit(prices):
      '''
      At most one buy and one sell. Maximum profit.
      Approach: track the minimum price seen so far.
      Each day, compute profit = prices[i] - min_price, update max profit.
      '''
      # Modify below
      return 0
cases: |
  max_profit([7, 1, 5, 3, 6, 4]) -> 5
  max_profit([7, 6, 4, 3, 1]) -> 0
  max_profit([1, 2, 3, 4, 5]) -> 4
  max_profit([2, 4, 1]) -> 2
  max_profit([3, 2, 6, 5, 0, 3]) -> 4
hint: Iterate through prices, maintaining min_price (the lowest price seen so far). Each day, compute profit = prices[i] - min_price and update the global maximum profit. Initialize min_price = prices[0], max_profit = 0.
explain: The DP essence of this problem is "the lowest buying price seen so far." Iterate through the array, updating min_price = min(min_price, prices[i]) each day, and computing the profit if sold today as prices[i] - min_price, tracking the global maximum. This is a classic example of "optimal substructure"—the global optimum is derived from local optima.
```
