# Chapter 2 · Arrays and Two Pointers · Final Test

> 8 questions. This chapter answers the question: "how do you replace one layer of nested loops with two pointers to bring O(n²) down to O(n)?"
> **You must get every question right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: When collision pointers solve two-sum on a sorted array, what are the movement rules for left and right?
options:
- when the sum is below target, move left right; when it is above target, move right left
- when the sum is below target, move right right; when it is above target, move left left
- move both left and right at the same time on every step
- move only left on every step
answer: 0
explain: The array is sorted, so a sum that is too small means you need a larger number -> move left right (toward the bigger end); a sum that is too large means you need a smaller number -> move right left (toward the smaller end). This is the core rule of collision pointers.
```

```quiz
type: choice
q: When using slow/fast pointers to remove elements in place, what does the slow pointer represent?
options:
- it traverses the whole array
- it points at the next free slot where an answer element can be written
- it records which element should be deleted
- it stays a fixed distance behind fast
answer: 1
explain: slow points at "the next slot where a valid element can be placed." Every time fast finds an element that is not the target, it copies that element into slow's position and then slow moves forward by one. The valid elements end up "compressed" at the front of the array.
```

```quiz
type: choice
q: For the sliding-window problem "shortest subarray with sum >= target", should you shrink with while or if, and why?
options:
- if, because shrinking once is enough
- while, because you may need to keep shrinking to discover a shorter answer
- if, because while would cause an infinite loop
- while, just to make the code look nicer
answer: 1
explain: The problem asks for the SHORTEST subarray. Once window_sum >= target, the current window is valid, but it might still be too long -- so you keep moving left rightward (subtracting nums[left]) until the condition breaks. Using if only shrinks once and misses shorter answers.
```

```quiz
type: choice
q: In three-sum, why do you skip duplicates for left and right after finding a valid triplet?
options:
- to make the code run faster
- because identical values can form the same triplet, so they must be skipped
- to avoid going out of bounds
- to save memory
answer: 1
explain: For example, after sorting you get [-2, -1, -1, 0, 1, 1, 2]. For a given target, several identical triplets may exist. Once you find one, the elements at left and right might be the same as the next ones, so skipping them avoids duplicate answers.
```

```quiz
type: choice
q: When removing elements in place with slow/fast pointers, what happens if you accidentally use append instead of overwriting?
options:
- the result is correct but slower
- the array keeps growing instead of being modified in place
- it raises IndexError
- there is no difference at all
answer: 1
explain: append adds elements to the end of the array, making it longer and longer instead of "overwriting" the valid elements toward the front. The correct move is nums[slow] = nums[fast].
```

---

## Part 2 · Coding Tasks

```quiz
type: function
q: Write reverse_str(s): reverse a string using collision pointers and return the result (do not use slicing [::-1]; swap manually)
func: reverse_str
starter: |
  def reverse_str(s):
      # strings are immutable, so convert to a list first, then join back
      # left starts at 0, right starts at the end
      # swap characters, return "".join(arr)
      return s
cases: |
  "hello" -> "olleh"
  "a" -> "a"
  "" -> ""
hint: arr = list(s); left=0; right=len(arr)-1; while left<right: arr[left],arr[right]=arr[right],arr[left]; left+=1; right-=1; return "".join(arr). When s is empty, len=0 so right=-1 and the loop never runs.
explain: Strings are immutable, so you must first call list(s) to get a mutable list, swap the characters, then join with "".join to get a string back. When the string is empty, right=-1 so the loop never executes and you return "" directly.
```

```quiz
type: function
q: Write remove_duplicates(nums): remove duplicates from a sorted array in place, keeping exactly one copy of each element, and return the new length
func: remove_duplicates
starter: |
  def remove_duplicates(nums):
      # return 0 for an empty list
      # slow starts at 1
      # fast iterates; if nums[fast] != nums[fast-1], keep it
      # return slow
      return 0
cases: |
  [1,1,2] -> 2
  [0,0,1,1,1,2,2,3,3,4] -> 5
  [] -> 0
hint: if not nums: return 0; slow=1; for fast in range(1,len(nums)): if nums[fast]!=nums[fast-1]: nums[slow]=nums[fast]; slow+=1; return slow. Handle the empty list first.
explain: The core of dedup is comparing "the current element with the previous element." slow starts at 1 because index 0 is always kept. Returning slow gives you the new length. You must handle the empty list, otherwise nums[0] raises IndexError.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Build a "Two-Pointer Practice Lab" that contains three functions -- collision pointers (two-sum on a sorted array), slow/fast pointers (remove a target value in place), and a sliding window (shortest subarray) -- and print the result of each one
checklist:
- implements two-sum on a sorted array (collision pointers) and prints at least one answer
- implements removing a target value in place (slow/fast pointers) and prints the new length and valid portion
- implements the shortest subarray (sliding window) and prints the shortest length
- all three functions handle their boundaries explicitly (empty array, single element, etc.)
- the code runs without errors
starter: |
  # ===== Collision pointers: two-sum on a sorted array =====
  def two_sum_sorted(nums, target):
      left, right = 0, len(nums) - 1
      while left < right:
          s = nums[left] + nums[right]
          if s == target:
              return [left, right]
          elif s < target:
              left += 1
          else:
              right -= 1
      return []
  
  # ===== Slow/fast pointers: remove a target value in place =====
  def remove_element(nums, val):
      slow = 0
      for fast in range(len(nums)):
          if nums[fast] != val:
              nums[slow] = nums[fast]
              slow += 1
      return slow
  
  # ===== Sliding window: shortest subarray =====
  def min_subarray_len(nums, target):
      left = 0
      window_sum = 0
      ans = float('inf')
      for right in range(len(nums)):
          window_sum += nums[right]
          while window_sum >= target:
              ans = min(ans, right - left + 1)
              window_sum -= nums[left]
              left += 1
      return ans if ans != float('inf') else 0
  
  # continue: prepare test data and print the results of all three functions
hint: Prepare a sorted array (two-sum), an array containing the target value (removal), and a positive-integer array (shortest subarray). When printing, use nums[:length] to show only the valid portion.
explain: This project strings together all three two-pointer patterns from Chapter 2. Once you finish, you will see that they all share the same underlying idea: use two position variables to replace one layer of loops and compress an O(n^2) operation down to O(n).
```

---

## Reference answers (peek after you finish)

<details>
<summary>Click to reveal the reference implementations</summary>

**Two-sum:**

```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []
```

**Remove element:**

```python
def remove_element(nums, val):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != val:
            nums[slow] = nums[fast]
            slow += 1
    return slow
```

**Shortest subarray:**

```python
def min_subarray_len(nums, target):
    left = 0
    window_sum = 0
    ans = float('inf')
    for right in range(len(nums)):
        window_sum += nums[right]
        while window_sum >= target:
            ans = min(ans, right - left + 1)
            window_sum -= nums[left]
            left += 1
    return ans if ans != float('inf') else 0
```

</details>

## What you learned in this chapter

- **Collision pointers**: one at each end, decide which one moves based on the comparison; solves two-sum, palindromes, and reversing in O(n)
- **Slow/fast pointers**: slow records the answer position, fast scouts ahead, compressing the array in place with O(1) space
- **Sliding window**: expand + shrink, maintaining information about the interval; solves range problems in O(n)
- **Three-sum**: sort + fix one + search with two; brings O(n³) down to O(n²)
- **Core idea**: use two position variables to replace one layer of loops, and never make a pointer step backward

**Next chapter: prefix sums and difference arrays** — preprocessing that brings interval operations from O(n) down to O(1).
