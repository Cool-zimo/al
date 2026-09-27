# Chapter 6 · Sliding Window · Chapter Quiz

> 8 questions. This chapter answers one question: "how do you handle subarray/substring extremes in O(n)?"
> **You must answer every question correctly to pass the chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: What is the essential difference between a sliding window and two pointers?
options:
- A sliding window uses two pointers to frame an interval; two pointers focus on the relationship between two elements
- A sliding window is faster than two pointers
- A sliding window works only on arrays, while two pointers work only on strings
- There is no difference at all
answer: 0
explain: The core of a sliding window is "the interval between the two pointers" - it maintains some aggregate state across that interval (a sum, a set, a counter). Two pointers is about "two pointers collaborating to find an answer" and usually doesn't need to maintain interval state at all.
```

```quiz
type: choice
q: When sliding a fixed window, the correct update formula for `window_sum` is?
options:
- window_sum = window_sum + nums[i] + nums[i-k]
- window_sum = window_sum - nums[i-k] + nums[i]
- window_sum = sum(nums[i-k:i+1])
- window_sum = window_sum - nums[i] + nums[i-k]
answer: 1
explain: When the window slides right, nums[i-k] leaves the window and nums[i] enters. Subtract the old value first, then add the new one. Option 3 is correct in result but rescans k elements each time (O(k)), so it is not the efficient O(1) update.
```

```quiz
type: choice
q: When solving "longest substring without repeating characters" with a HashMap that stores each character's last seen index, why do we write the `>= left` check?
options:
- To prevent index out of bounds
- To ignore stale records that have already been evicted outside the window, checking only for duplicates inside the current window
- To speed up lookup
- To save memory
answer: 1
explain: The HashMap stores the "last seen" position of each character, but that position may already be to the left of the window (left has passed it). The >= left check guarantees we only flag characters that are actually inside the current window as duplicates.
```

```quiz
type: choice
q: In the minimum window substring algorithm, what does the `formed` variable represent?
options:
- The total number of characters in the window
- The number of distinct characters whose count in the window has reached their required count in t
- The length of the window
- The total number of characters in t
answer: 1
explain: formed tracks the count of met kinds. For need={'A':2,'B':1}, formed becomes 2 once window['A']>=2 and window['B']>=1. It cares only about whether every required kind is satisfied, never about the raw total.
```

```quiz
type: choice
q: In an array of positive integers, to find the SHORTEST subarray with sum >= target, when do you shrink the left boundary?
options:
- When window_sum > target
- When window_sum >= target
- When window_sum < target
- When window_sum == target
answer: 1
explain: For the shortest subarray you shrink while the condition holds. When window_sum >= target the window is already valid, so you contract left to see if it gets shorter. Using > would miss the moment window_sum lands exactly on target and you could skip a shorter answer.
```

## Part 2 · Coding Exercises

```quiz
type: function
q: Implement max_sum_subarray_of_size_k(nums, k) - return the maximum sum of any contiguous subarray of length k. The array length is >= k.
func: max_sum_subarray_of_size_k
starter: |
  def max_sum_subarray_of_size_k(nums, k):
      window_sum = sum(nums[:k])
      max_sum = window_sum
      for i in range(k, len(nums)):
          window_sum = window_sum - nums[i - k] + nums[i]
          max_sum = max(max_sum, window_sum)
      return max_sum
cases: |
  [1, 2, 3, 4, 5], 3 -> 12
  [5, 2, 8, 1, 9], 2 -> 10
  [10], 1 -> 10
hint: Standard fixed window: the initial sum is the first k elements, then repeatedly subtract nums[i-k] and add nums[i].
explain: [1,2,3,4,5] k=3: windows [1,2,3]=6, [2,3,4]=9, [3,4,5]=12, max is 12. [5,2,8,1,9] k=2: [5,2]=7,[2,8]=10,[8,1]=9,[1,9]=10, max is 10.
```

```quiz
type: function
q: Implement longest_substring_without_repeating(s) - return the length of the longest substring of s with no repeating characters.
func: longest_substring_without_repeating
starter: |
  def longest_substring_without_repeating(s):
      char_index = {}
      max_len = 0
      left = 0
      for right in range(len(s)):
          if s[right] in char_index and char_index[s[right]] >= left:
              left = char_index[s[right]] + 1
          char_index[s[right]] = right
          max_len = max(max_len, right - left + 1)
      return max_len
cases: |
  "abcabcbb" -> 3
  "bbbbb" -> 1
  "pwwkew" -> 3
hint: Use a HashMap to record the last seen index. If a character has already appeared inside the current window, jump left to one past its previous position. Update max_len each step.
explain: "abcabcbb": longest unique substring is "abc", length 3. "bbbbb": longest is just "b", length 1. "pwwkew": longest is "wke" or "kew", length 3.
```

## Part 3 · Mini Project

```quiz
type: project
q: Implement a real-time stock analyzer function analyze_stock(prices, k) that takes a list of prices and a window size k, and returns a list where each element is the average price over the window of length k ending at (and including) that position. The solution must use a sliding window and run in O(n) - you may NOT recompute the sum with sum() on every window.
checklist:
- Function signature is analyze_stock(prices, k)
- Maintains the window sum with a sliding window in O(n) time
- Returns None for the first k-1 positions (window not yet full)
- Returns a float average starting at the k-th position
- Uses / not // for the average
- Returns an empty list for an empty input list
starter: |
  def analyze_stock(prices, k):
      '''
      Sliding-window real-time stock analyzer.
      Returns the average price of the window of length k at each position (0-indexed).
      The first k-1 positions do not yet have a full window, so return None for them.
      '''
      if not prices:
          return []
      result = []
      window_sum = 0
      # Complete the implementation below
      return result
```
