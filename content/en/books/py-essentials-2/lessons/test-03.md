# Chapter 3 · Chapter Test

> Eight questions covering the key points of lists, tuples, dictionaries and sets. **Hands-on questions should be `type: function` whenever possible** — actually run them before checking answers.
> This paper carries **no** `exam: true` marker; it is all self-test practice.

## Part 1 · Multiple Choice

```quiz
type: choice
q: After running the following code, what are a and b?
code: |
  a = [1, 2, 3]
  b = a[:]
  b.append(4)
options:
- a is [1, 2, 3], b is [1, 2, 3, 4]
- a is [1, 2, 3, 4], b is [1, 2, 3, 4]
- a is [1, 2, 3], b is [1, 2, 3]
- error
answer: 0
explain: b = a[:] is a slice copy, producing a brand-new list. So changing b does not affect a: a stays [1, 2, 3] while b becomes [1, 2, 3, 4]. This is the most basic list question.
```

```quiz
type: choice
q: Which snippet correctly deletes all even numbers from a list?
code: |
  nums = [1, 2, 3, 4, 5, 6]
options:
- "for x in nums:\n    if x % 2 == 0:\n        nums.remove(x)"
- "nums = [x for x in nums if x % 2 != 0]"
- "while x % 2 == 0:\n    nums.pop()"
- "nums.clear()"
answer: 1
explain: A skips elements when removing while iterating (4 is missed); B rebuilds the list with a comprehension, correct; C is wrong in syntax/logic; D simply clears the whole list. Filter with a comprehension every time.
```

```quiz
type: choice
q: Which of the following can be used as a dictionary key?
code: |
options:
- "[1, [2, 3]]"
- "(1, 2, 3)"
- "{\"a\": 1}"
- "[1, 2, (3, 4)]"
answer: 1
explain: Dictionary keys must be hashable. A contains a list, not hashable; B is a plain tuple, hashable; C is a dict, mutable; D is a list, not hashable. Only B works.
```

```quiz
type: choice
q: What does `set([1, 2, 2, 3, 1])` produce?
code: |
options:
- "{1, 2, 3, 1, 2}"
- "{1, 2, 3}"
- "set()"
- "[1, 2, 3]"
answer: 1
explain: A set deduplicates automatically, and order is not guaranteed. The result contains only the three elements 1, 2, 3, and the notation is curly braces like a set, not square brackets like a list.
```

```quiz
type: choice
q: Which of the following correctly creates an empty set?
code: |
options:
- "{}"
- "set()"
- "set([])"
- "none of the above"
answer: 1
explain: {} is an empty dict; set() is the empty set; set([]) also gives an empty set but is needlessly roundabout. The most direct correct form is set().
```

## Part 2 · Hands-On

```quiz
type: function
q: Write flatten(nested): flatten a list nested "at most two levels deep" into a one-dimensional list. For example [[1, 2], [3, 4], [5]] returns [1, 2, 3, 4, 5]; [1, [2, 3], 4] returns [1, 2, 3, 4]. Assume the nested list contains only integers and lists.
func: flatten
starter: |
  def flatten(nested):
      # iterate over each item: if it is a list, extend; otherwise append
      result = []
      return result
cases: |
  [[1, 2], [3, 4], [5]] -> [1, 2, 3, 4, 5]
  [1, [2, 3], 4] -> [1, 2, 3, 4]
  [] -> []
  [[1], []] -> [1]
hints: for item in nested: if isinstance(item, list) then result.extend(item), else result.append(item).
explain: Use isinstance(item, list) to test the element type. If it is a list, extend (adding its elements one by one); if not, append (adding the whole thing). This tests handling a list that mixes different element types — a simplified version of many real scenarios, such as parsing tabular data.
```

```quiz
type: function
q: Write word_frequency(text): count how many times each word appears in an English text, and return the top 3 words with their counts, ordered from most to least frequent. For equal counts, sort alphabetically ascending. text contains only lowercase letters and spaces. For example "go go python go java python c++ java java" returns [("go", 3), ("java", 3), ("python", 2)].
func: word_frequency
starter: |
  from collections import Counter

  def word_frequency(text):
      # Counter handles the counting; most_common is not enough (ties are not ordered), so sort manually
      return []
cases: |
  "go go python go java python c++ java java" -> [("go", 3), ("java", 3), ("python", 2)]
  "a b c d e" -> [("a", 1), ("b", 1), ("c", 1)]
  "one one one" -> [("one", 3)]
hints: After Counter counts, sort with key (-count, word), then take the first 3 and convert to a list.
explain: This combines Counter with custom sorting. most_common does not guarantee alphabetical order on ties, so when ordering matters you must sort manually with key=lambda x: (-x[1], x[0]). Then use a slice [:3] to take the top 3.
```

## Part 3 · Mini Project

**Topic: Simple Vote Counter**

Write a function `vote_result(votes)`: the input is a list of voting records, where each item is a candidate's name (a string) and may repeat. Return a dictionary containing:

1. `"winner"`: the name with the most votes; if several tie for first, return the one that is **lexicographically smallest**
2. `"ranking"`: a list of all candidates ordered from most votes to fewest, where each element is a `(name, votes)` tuple; for equal votes, sort by name ascending
3. `"total"`: the total number of votes cast

For example:

```
votes = ["Alice", "Bob", "Alice", "Carol", "Bob", "Alice", "Bob"]
# Alice 3 votes, Bob 3 votes, Carol 1 vote
# Alice and Bob tie for first; lexicographically smaller is "Alice"
```

It should return:

```python
{
    "winner": "Alice",
    "ranking": [("Alice", 3), ("Bob", 3), ("Carol", 1)],
    "total": 7
}
```

**Hints:**

- Count with `collections.Counter`
- Use the uniform sort key `key=lambda x: (-x[1], x[0])`
- For a tie, use `min(candidates, key=...)` to pick the lexicographically smallest
- An empty list `[]` is invalid input; return `None`

**Reference skeleton:**

```python
from collections import Counter

def vote_result(votes):
    if not votes:
        return None
    count = Counter(votes)
    ranking = sorted(count.items(), key=lambda x: (-x[1], x[0]))
    winner = min(count, key=lambda k: (-count[k], k))
    return {
        "winner": winner,
        "ranking": ranking,
        "total": len(votes)
    }
```

**Further thoughts:**

1. If the voting records change to "each vote carries a weight" (the list contains `(name, weight)` tuples), how would you adapt this?
2. If you need to support "spoiled votes" (empty strings or `None`), should they be counted separately? How would you design the return structure to keep it clean?

Work through both of these and you have truly mastered container operations for this chapter.
