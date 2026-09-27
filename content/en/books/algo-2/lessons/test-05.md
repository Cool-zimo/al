# Chapter 5 Quiz: Hash Tables

> A hash table is a skeleton key for algorithm problems. This chapter quiz covers hash-table fundamentals, collision resolution, Python's built-in implementations, common problem patterns, and practical applications.

## Multiple Choice

```quiz
type: choice
exam: true
q: The average lookup time of a hash table is O(1), but in the worst case it degrades to O(n). Which situation causes this worst case?
options:
- Every key hashes to the same position (total collision)
- The hash table's array capacity happens to be a prime number
- The hash function's output is very evenly distributed
- The load factor is below 0.5
answer: 0
explain: When every key maps to the same slot, whether you use separate chaining or open addressing, lookup degenerates into a linear scan, O(n). Even distribution and prime capacities both help reduce collisions.
```

```quiz
type: choice
exam: true
q: Regarding the ordering of dict in Python 3.7+, which statement is correct?
options:
- Traversal order equals insertion order, but is not sorted by key
- Traversal order is sorted by the key's alphabetical/numeric value
- Traversal order is random and differs on every run
- Traversal order is arranged by hash value from smallest to largest
answer: 0
explain: Python 3.7+ dict guarantees insertion-order preservation, not sorted order. {'zebra':1, 'apple':2} traverses in the order zebra, then apple, because zebra was inserted first.
```

```quiz
type: choice
exam: true
q: Which of the following cannot be used as a Python dict key?
options:
- A tuple containing only ints
- A frozenset
- A tuple containing a dict
- A str
answer: 2
explain: A tuple is immutable, but if it contains a mutable object (like a dict), the whole tuple becomes unhashable. frozenset is immutable and can be a key. int and str are naturally hashable.
```

```quiz
type: choice
exam: true
q: When solving "count subarrays with sum equal to K" using prefix sum + hash, what is the purpose of initializing prefix_count = {0: 1}?
options:
- When some prefix sum equals K exactly, need = 0, and we need a record of "prefix sum 0 has appeared once" to count that case
- To prevent a KeyError when the dict is empty
- To improve the hash table's load factor
- To guarantee the result always contains an empty subarray
answer: 0
explain: When pref[i] == K, need = pref[i] - K = 0. Without {0: 1} in prefix_count, this valid subarray is missed. {0: 1} represents "before the array starts, prefix sum 0 has occurred once."
```

```quiz
type: choice
exam: true
q: Regarding the load factor of a hash table, which statement is correct?
options:
- The closer the load factor gets to 1, the higher the collision probability and the worse the performance, so a resize is usually triggered past 0.75
- The closer the load factor gets to 0, the faster the lookup, so it should be kept near 0
- The load factor has no upper bound and can exceed 2 with no performance impact
- The load factor only affects insertion speed, not lookup speed
answer: 0
explain: Load factor = elements / capacity. As it approaches 1 (separate chaining) or higher, each bucket holds more elements and collisions get worse. Near 0 is fast but wastes memory. Past the threshold (typically 0.75) a resize is triggered.
```

## Coding Questions

```quiz
type: function
exam: true
q: Implement contains_duplicate(nums) to determine whether an integer array contains any duplicate values. If any two values are the same, return True; otherwise return False. Must run in O(n) using a set.
func: contains_duplicate
starter: |
  def contains_duplicate(nums):
      # fix here
      return False
cases: |
  [1,2,3,1] -> True
  [1,2,3,4] -> False
  [] -> False
  [1,1,1,3,3,4,3,2,4,2] -> True
hint: Iterate over nums, use a set to track elements seen so far. For each num, if it's already in the set return True; otherwise add it.
explain: Set lookup and insertion are both O(1), so one pass is O(n). If the element is already in the set, we've found a duplicate.
```

```quiz
type: function
exam: true
q: Implement longest_consecutive(nums) to find the length of the longest consecutive sequence in an unsorted integer array. Must run in O(n). For example, the longest consecutive sequence in [100, 4, 200, 1, 3, 2] is [1, 2, 3, 4], so return 4. Approach: put every number in a set; for each number, if it is the start of a sequence (num-1 is not in the set), extend forward and count.
func: longest_consecutive
starter: |
  def longest_consecutive(nums):
      # fix here
      return 0
cases: |
  [100,4,200,1,3,2] -> 4
  [0,3,7,2,5,8,4,6,0,1] -> 9
  [] -> 0
  [1,2,0,1] -> 3
hint: Convert to a set first. For each num, if num-1 is not in the set it's a sequence start; then while num+1 is in the set: num+=1 and count up.
explain: Use a set for O(1) lookups. Only extend from the start of each sequence (num-1 not in set), avoiding duplicate counting. Each element is visited at most twice (once in the loop, once while extending), so total is O(n).
```

## Comprehensive Project

```quiz
type: project
exam: true
q: Implement an LRU Cache (Least Recently Used Cache). It must support two methods: get(key) returns the value associated with key, or -1 if the key doesn't exist; put(key, value) inserts or updates a key-value pair. When the cache exceeds its capacity, evict the **least recently used** key (the one that hasn't been accessed via get or put for the longest time). Both get and put must run in O(1). Hint: use a dict (hash table) to map key -> (value, node), combined with a doubly linked list to maintain access order. In Python you can simplify this with OrderedDict or dict + deque, but the recommended approach is OrderedDict's move_to_end and popitem methods.
starter: |
  from collections import OrderedDict
  
  class LRUCache:
      def __init__(self, capacity):
          # fix here
          pass
      
      def get(self, key):
          # fix here
          return -1
      
      def put(self, key, value):
          # fix here
          pass
cases: |
  c=LRUCache(2); c.put(1,1); c.put(2,2); c.get(1); c.put(3,3); c.get(2) -> -1
  c=LRUCache(1); c.put(1,1); c.put(2,2); c.get(1); c.get(2) -> -1, 2
  c=LRUCache(2); c.put(1,1); c.put(1,10); c.get(1) -> 10
hint: Use OrderedDict. On get, if the key exists, move_to_end(key) then return the value. On put, if the key exists move_to_end and update the value; otherwise insert it, and if len exceeds capacity popitem(last=False).
explain: OrderedDict maintains insertion/access order. move_to_end(key) moves the key to the end (most recently used), popitem(last=False) removes the front entry (least recently used). On a get hit, move_to_end marks it as recently used. On put, if capacity is exceeded, popitem(last=False).
```
