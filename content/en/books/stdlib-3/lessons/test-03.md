# Chapter 3 · Efficiency Tools · Big Quiz

> 8 questions. This chapter is about "handling data with less code, faster, and in a more robust structure"—the five families of tools in `Counter`, `defaultdict`, `deque`, `itertools`, and `functools`.
> **You must get all of them right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: For a sequence where you frequently remove from the front (like a FIFO queue), which should you choose?
options:
- list with pop(0)
- deque with popleft()
- a plain dict
- a set
answer: 1
explain: deque.popleft() is O(1); list.pop(0) is O(n), and the gap is huge at scale. dict and set are irrelevant to this scenario.
```

```quiz
type: choice
q: Which statement about Counter is correct?
options:
- Counter raises KeyError for missing keys
- Counter is a subclass of dict and supports most dict operations
- Counter only accepts strings as arguments
- Counter's most_common returns a list sorted alphabetically
answer: 1
explain: Counter is a subclass of dict—that's the source of all its convenience. Missing keys return 0 rather than erroring; it accepts any iterable; most_common sorts by frequency descending.
```

```quiz
type: choice
q: Which statement about dictionaries in Python 3.7+ is correct?
options:
- plain dict does not guarantee insertion order; you must use OrderedDict
- plain dict guarantees insertion order; OrderedDict is mainly for precise order-control operations
- OrderedDict is much faster than dict and should always be preferred
- dict and OrderedDict have identical == comparison behavior
answer: 1
explain: Since Python 3.7, plain dict guarantees insertion order. OrderedDict's remaining value lies in move_to_end/popitem-style precise order control and order-sensitive equality.
```

```quiz
type: choice
q: Which statement about itertools.groupby is correct?
options:
- it automatically sorts the sequence first
- it only merges adjacent elements with the same key; usually you must sorted first
- it's the same as list's groupby method
- it returns each group as a list
answer: 1
explain: groupby only merges adjacent elements with equal keys; it doesn't sort first—that's exactly the source of the "must sorted first" trap. It returns an iterator, and each group is an iterator, not a list.
```

```quiz
type: choice
q: Which statement about lru_cache is correct?
options:
- it can cache any function, including ones whose arguments are lists
- it caches repeated calls with identical arguments to avoid recomputation
- it automatically makes functions faster, regardless of argument types
- it can only be used on recursive functions
answer: 1
explain: lru_cache's core is "identical arguments hit the cache." List arguments are unhashable and raise TypeError; it doesn't magically speed things up—it only helps when there are repeated arguments; non-recursive functions can use it too.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write a function group_by_first_char that takes a list of words and returns a dict: the keys are each word's first letter (lowercase), and the values are lists of all words starting with that letter.
func: group_by_first_char
starter: |
  from collections import defaultdict

  def group_by_first_char(words):
      return {}
cases: |
  ["Apple", "ant", "Banana", "apple", "berry"] -> {"a": ["Apple", "ant", "apple"], "b": ["Banana", "berry"]}
  [] -> {}
  ["cat"] -> {"c": ["cat"]}
hint: d = defaultdict(list), then for w in words: d[w[0].lower()].append(w), finally return dict(d).
explain: Grouping and collecting is defaultdict(list)'s home turf; w[0].lower() unifies the first letter to lowercase.
```

```quiz
type: function
q: Write a function cartesian that takes two lists a and b and returns a list of all combinations, where each combination is a tuple (element from a, element from b).
func: cartesian
starter: |
  import itertools

  def cartesian(a, b):
      return []
cases: |
  "[1,2], ['x','y']" -> [(1, 'x'), (1, 'y'), (2, 'x'), (2, 'y')]
  "[1], [2]" -> [(1, 2)]
  "[], [1,2]" -> []
hint: Use itertools.product(a, b) and convert to a list.
explain: product is the primitive for Cartesian products; just convert to list. Empty lists naturally yield an empty result.
```

## Part 3 · Mini-Project

```quiz
type: project
q: Write a "product-combination generator." Requirements: given a list of product categories (e.g. ["phone", "earbuds", "case"]) and a bundle size k, use itertools.combinations to generate every "pick k categories" bundle option; use Counter to count how many times each category appears across all bundles (to gauge which categories are most popular); finally print each category and its count from highest to lowest. For example, with k=2, each of the 3 categories appears twice.
checklist:
- uses itertools.combinations to generate bundles
- bundle size k is controllable via a parameter
- uses Counter to count each category's appearances across all bundles
- uses most_common or sorting to print from highest to lowest count
- handles the boundary case where k exceeds the number of categories (empty result or a sensible message)
- tests with at least 4 categories
```
