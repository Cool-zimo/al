# Chapter 4 · Big Test

> Chapter 4 — Sets and Choosing a Container — is done. Time to check: **do you remember it, can you use it, and can you build something with it?**
>
> Do not worry about getting everything right first time. **Questions you get wrong come back automatically in 1 day** (Ebbinghaus's forgetting curve), so you get another shot then.

---

## Part 1 · Multiple Choice

Checking that the concepts of this chapter really stuck.

```quiz
type: choice
q: '`s = {}` — what is `type(s)`?'
options:
- "<class 'set'>"
- "<class 'dict'>"
- 'error'
- 'None'
answer: 1
explain: In Python {} means an empty dict, not an empty set. To make an empty set you must write set(). This is the single most counter-intuitive fact in the chapter.
```

```quiz
type: choice
q: '`a = {1, 2, 3}` and `b = {2, 3, 4}`. What are `a - b` and `b - a`?'
options:
- '{1} and {4}'
- '{1, 2, 3} and {2, 3, 4}'
- '{1, 4} and {1, 4}'
- '{4} and {1}'
answer: 0
explain: Difference means "in the left set but not the right". a - b = {1} and b - a = {4}. Difference is not symmetric — direction changes the result.
```

```quiz
type: choice
q: When the data set is large and you must frequently test "is this item in there?", why prefer a set over a list?
options:
- 'A set sorts itself automatically, so it is faster'
- 'A set uses a hash table, so it jumps straight to the answer without scanning'
- 'A set holds fewer elements, so it is faster'
- 'The `in` operator errors on lists'
answer: 1
explain: A set uses a hash table — compute the item's hash once and you go straight to the right slot, usually in one hop. A list has to compare against every element, getting slower as it grows.
```

```quiz
type: choice
q: Requirement — store a list of city names where **duplicates are not allowed** and you must **frequently test whether a city is present**. Which container?
options:
- 'list, because it is the most flexible'
- 'tuple, because it is immutable'
- 'dict, because key lookup is fast'
- 'set, because it rejects duplicates and `in` is fast'
answer: 3
explain: Both signals point at a set: no duplicates (set elements are unique) and frequent `in` tests (hash tables are fast). A dict also looks up fast, but you have no "value" to store here, so a dict is wasteful.
```

```quiz
type: choice
q: '`count = {"a": 3, "b": 2, "c": 1}`. Which statement best describes `list(count.keys())` versus `set(count)`?'
options:
- 'They are identical — both are lists'
- 'The first is a list of the keys; the second is a set of the keys (deduplicated and unordered)'
- 'The first errors while the second works'
- 'Both contain only values, not keys'
answer: 1
explain: count.keys() is a view of the dict's keys; wrap it in list() and you get a list. set(count) converts the dict to a set — and a set's elements are precisely the dict's keys (which are already unique), but the set has no order. Same elements, different order and type.
```

---

## Part 2 · Hands-On

Remembering is not enough — you have to be able to write it.

```quiz
type: code
q: Given two lists of names, `group_a = ["Alice", "Bob", "Carol", "Dave"]` and `group_b = ["Bob", "Carol", "Eve"]`, use set operations to find: 1) the people in both groups (intersection), and 2) the people only in A, not in B (difference). Print one line for each.
starter: |
  group_a = ["Alice", "Bob", "Carol", "Dave"]
  group_b = ["Bob", "Carol", "Eve"]

  set_a = set(group_a)
  set_b = set(group_b)

  # compute and print the intersection and the difference
tests:
- assert "{'Bob', 'Carol'}" in __out or "'Carol', 'Bob'" in __out
- assert "{'Alice', 'Dave'}" in __out or "'Dave', 'Alice'" in __out
hint: Intersection uses &, difference (only in A) uses -. Set order is not fixed, and the assertions allow for either order.
explain: The answer is print("Both:", set_a & set_b) and print("Only in A:", set_a - set_b). This tests the two operators & and -, plus the fact that set order is not guaranteed so output order varies.
```

```quiz
type: function
q: Write a function `unique_ordered` that takes a list and returns a **deduplicated list that keeps the original order**. Use a set internally to make the check cheap.
func: unique_ordered
starter: |
  def unique_ordered(items):
      return []
cases: |
  [1, 2, 2, 3, 1] -> [1, 2, 3]
  ["a", "b", "a", "c", "b"] -> ["a", "b", "c"]
hint: seen = set(); result = []; iterate over items, and when an item is not yet in seen, add it to seen and append it to result.
explain: The answer: seen = set(); r = []; for x in items: if x not in seen: seen.add(x); r.append(x); return r. This is the standard "set does the O(1) dedup check, list holds the ordered result" pattern.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Use what you learned in this chapter to analyse "mutual friends": given two people's friend sets, `friends_a = {"Alice", "Bob", "Carol", "Dave"}` and `friends_b = {"Bob", "Carol", "Eve", "Frank"}`, print: 1) the mutual friends (intersection); 2) the friends only A has (difference); 3) every friend combined (union). Then think — if you also needed to test quickly whether two specific people are friends, would a set still be the right tool?
starter: |
  friends_a = {"Alice", "Bob", "Carol", "Dave"}
  friends_b = {"Bob", "Carol", "Eve", "Frank"}

  # use set operations to do all three analyses
checklist:
- Uses intersection & to find mutual friends
- Uses difference - to find the friends only A has
- Uses union | to combine all friends
- Can explain that a single person's friend list is a set, but testing "are A and B friends?" needs a dict mapping each person to a set
```
