# Chapter 4 · Sorting · Comprehensive Quiz

> This chapter covers: the Ω(n log n) lower bound for comparison sorts, the three O(n²) sorts, merge / quick / heap sort, and non-comparison sorting. Eight questions, sixty minutes — check your work against the reference solutions when done.

## Part 1 · Multiple Choice

```quiz
type: choice
exam: true
q: Which is the most accurate statement about "the Ω(n log n) lower bound for comparison sorts"?
options:
- Any algorithm that correctly sorts must take at least Ω(n log n) time
- Any sorting algorithm that decides its next step solely by comparing pairs of elements needs at least Ω(n log n) comparisons in the worst case
- Any recursive sorting algorithm needs at least Ω(n log n) time
- Any sorting algorithm using O(1) extra space needs at least Ω(n log n) time
answer: 1
explain: The lower bound holds under the premise that "the algorithm obtains information only through pairwise comparisons". Counting, radix, and bucket sorts do not compare elements, so they can run in O(n). Merge sort, heap sort, and others at O(n log n) already meet this lower bound.
```

```quiz
type: choice
exam: true
q: n distinct elements have n! permutations. In the decision-tree lower-bound argument, log₂(n!) is approximately (the order given by Stirling's approximation)?
options:
- n
- n log₂ n − O(n)
- n²
- 2ⁿ
answer: 1
explain: n! ≈ √(2πn)(n/e)^n. Taking log₂ gives log₂(n!) = n log₂n − n log₂e + O(log n) = n log₂n − O(n). This is far more precise than "n" or "n²".
```

```quiz
type: choice
exam: true
q: Which sorting algorithm is unstable?
options:
- Insertion sort
- Bubble sort (when not swapping equal elements)
- Merge sort (standard implementation)
- Selection sort
answer: 3
explain: Selection sort swaps across equal elements, changing their relative order, e.g. [5,5,2] → [2,5,5]. Insertion and bubble (without swapping equals) are naturally stable; merge sort can also be implemented stably.
```

```quiz
type: choice
exam: true
q: What is the main cost of merge sort?
options:
- It is not a stable sort
- It needs O(n) extra space for merging
- Its worst-case complexity is O(n²)
- It cannot handle linked lists
answer: 1
explain: Merge sort recursively sorts both halves and then uses an O(n) temporary array to merge them, so it requires O(n) extra space. In return, it achieves Θ(n log n) in both the average and worst cases and is stable.
```

```quiz
type: choice
exam: true
q: For quick sort (always picking the first element as pivot), on which input does it perform worst?
options:
- A completely random array
- An already fully sorted array
- An array where all elements are equal
- A completely reversed array
answer: 1
explain: When already sorted, the pivot is always the smallest element in the current range, so partitioning is extremely unbalanced (one side empty, the other with n-1 elements). Recursion depth is n, and comparisons total n+(n-1)+…+1 = O(n²). A fully reversed array is also O(n²) with a fixed first-element pivot, but "already sorted" is the classic worst case.
```

## Part 2 · Coding Problems

```quiz
type: function
exam: true
q: Implement merge_sort(a) that returns the sorted list. Use the classic "split in half, recursively sort, then merge" style; during merging, use two pointers over the left and right halves and place the smaller element into the result at each step. Do not use sorted() or list.sort().
func: merge_sort
starter: |
  def merge_sort(a):
      # Merge sort
      # Modify below
      return a
cases: |
  merge_sort([38, 27, 43, 3, 9, 82, 10]) -> [3, 9, 10, 27, 38, 43, 82]
  merge_sort([5, 2, 9, 1, 5, 6]) -> [1, 2, 5, 5, 6, 9]
  merge_sort([1, 2, 3]) -> [1, 2, 3]
  merge_sort([3, 2, 1]) -> [1, 2, 3]
  merge_sort([7]) -> [7]
  merge_sort([]) -> []
hint: The recursive base case len(a)<=1 returns immediately; mid=len(a)//2, recursively sort both halves, then merge. During merging, pointers i,j walk left/right respectively, take the smaller one, and append the leftover segment at the end.
explain: Merge sort breaks a problem of size n into two subproblems of size n/2; merging costs O(n). The recurrence T(n)=2T(n/2)+O(n) solves to Θ(n log n), which holds in the worst case. It is stable but requires O(n) extra space.
```

```quiz
type: function
exam: true
q: Implement bubble_sort_optimized(a) that returns the sorted list. Implement the "early termination" optimization: use a flag to record whether a swap occurred during the current pass; if a pass has zero swaps, return immediately — so on already sorted arrays it needs only O(n) comparisons. Do not use sorted().
func: bubble_sort_optimized
starter: |
  def bubble_sort_optimized(a):
      # Bubble sort with early-termination optimization (in-place, returns the list)
      # Modify below
      return a
cases: |
  bubble_sort_optimized([5, 2, 9, 1, 5, 6]) -> [1, 2, 5, 5, 6, 9]
  bubble_sort_optimized([1, 2, 3, 4, 5]) -> [1, 2, 3, 4, 5]
  bubble_sort_optimized([5, 4, 3, 2, 1]) -> [1, 2, 3, 4, 5]
  bubble_sort_optimized([2, 1]) -> [1, 2]
  bubble_sort_optimized([3, 3, 3]) -> [3, 3, 3]
hint: An outer while loop with a swapped flag; the inner loop runs j from 0 to len(a)-1-i, and if a[j]>a[j+1], swap and set swapped=True; after the inner loop, if swapped is still False, break.
explain: Without optimization, bubble sort always does n(n-1)/2 comparisons regardless of input. Adding a swapped flag means that on an already sorted array, the first pass finds zero swaps and returns immediately, dropping comparisons to n-1 = O(n). The maximum number of swaps remains O(n²).
```

## Part 3 · Mini Project

```quiz
type: function
exam: true
q: Implement compare_sorts(a, algorithms), which sorts the same input list a using each sorting function given in algorithms, measures the time each one takes, and returns a list of (algorithm name, elapsed seconds, whether the output passed a sortedness check). Requirements: (1) copy the input with a.copy() before each sort so that an in-place algorithm does not affect the next one; (2) use time.perf_counter() for timing; (3) verify correctness by comparing the result with sorted() (which generates the correct answer). algorithms is a list of [(name, function), ...].
func: compare_sorts
starter: |
  import time

  def compare_sorts(a, algorithms):
      # algorithms: [(name, func), ...], func takes a list and returns a sorted list
      # Return [(name, elapsed_seconds, is_correct), ...]
      # Modify below
      return []
cases: |
  compare_sorts([5,2,9,1,5,6], [("merge", merge_sort), ("bubble", bubble_sort_optimized)]) -> [('merge', ..., True), ('bubble', ..., True)]
  compare_sorts([1,2,3], [("merge", merge_sort)]) -> [('merge', ..., True)]
  compare_sorts([], [("merge", merge_sort), ("bubble", bubble_sort_optimized)]) -> [('merge', ..., True), ('bubble', ..., True)]
hint: For each (name, fn): t0=time.perf_counter(); b=a.copy(); out=fn(b); t1=time.perf_counter(); correct=(out==sorted(a)); append (name, t1-t0, correct). Make the validation self-contained using the instance attributes.
explain: This is a mini sorting-algorithm benchmarking framework. Its two key points are "copy the input to avoid cross-talk" and "verify the output against an independently correct implementation (sorted)". In real engineering, this kind of framework is used to pick the best sorting strategy for a given data distribution, and it makes the gap between "worst-case complexity" and "actual performance" tangible — for example, insertion sort on nearly sorted data often beats merge sort despite its worse asymptotic complexity.
```
