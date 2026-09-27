# Chapter 3 · Containers · Review Quiz

> 8 questions. This chapter answers: how do you store, fetch, deduplicate, and look up a batch of data by name?
> **You must answer all of them correctly to pass this chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: For the list a = [10, 20, 30, 40, 50], what does a[1:4] evaluate to?
options:
- [10, 20, 30]
- [20, 30, 40]
- [20, 30, 40, 50]
- [30, 40]
answer: 1
explain: A slice is inclusive at the start and exclusive at the end, so it takes index 1 (20) up to but not including index 4 (40), giving [20, 30, 40].
```

```quiz
type: choice
q: Which statement about lists and tuples is correct?
options:
- A tuple is defined with square brackets []
- A tuple cannot be modified after it is created, but a list can
- A tuple does not support indexing or iteration
- A list can be a dictionary key, but a tuple cannot
answer: 1
explain: A tuple uses parentheses () and is immutable; it supports both indexing and iteration. The opposite is true: a list cannot be a dictionary key, but a tuple can.
```

```quiz
type: choice
q: Given scores = {"math": 90, "english": 95}, what is the safe way to fetch the "history" score, returning 0 if the key is absent?
options:
- scores["history"]
- scores.get("history")
- scores.get("history", 0)
- scores["history"] or 0
answer: 2
explain: The second argument to get is the default value, so when the key is missing it returns 0 without raising an error. Without a default, get would return None.
```

```quiz
type: choice
q: After running this code, what is the value of nums?
code: |
  nums = [3, 1, 2]
  nums.sort()
options:
- [1, 2, 3]
- [3, 1, 2]
- None
- an error
answer: 0
explain: sort is an in-place sort — it modifies nums directly and its return value is None. Note the difference from sorted(), which returns a new sorted list.
```

```quiz
type: choice
q: Given a = {1, 2, 3} and b = {2, 3, 4}, what is a | b?
options:
- {1, 2, 3, 4}
- {2, 3}
- {1, 4}
- {1, 2, 2, 3, 3, 4}
answer: 0
explain: | is the union operator: the elements of both sets combined with automatic deduplication, giving {1, 2, 3, 4}.
```

---

## Part 2 · Hands-on exercises

```quiz
type: function
q: Write a function that takes a list and removes duplicate elements while preserving the order of their first appearance, returning a new list.
func: dedupe
starter: |
  def dedupe(items):
      return []
cases: |
  [1, 2, 2, 3, 1] -> [1, 2, 3]
  [3, 3, 3] -> [3]
  [] -> []
  ["a", "b", "a", "c"] -> ["a", "b", "c"]
hint: Use a set to track elements you have already seen, iterate over the original list, and append unseen items to the result while registering them.
explain: Set lookups are O(1), which makes a set ideal for deduplication. The exercise also tests your awareness that you should not modify a list while iterating over it.
```

```quiz
type: function
q: Write a function that takes a dictionary (keys are names, values are ages) and returns the name of the oldest person; if the dictionary is empty, return None.
func: oldest
starter: |
  def oldest(people):
      return None
cases: |
  {"Alice": 18, "Bob": 25, "Charlie": 20} -> "Bob"
  {"a": 1} -> "a"
  {} -> None
  {"x": 100, "y": 100} -> "x"
hint: Use for k, v in people.items() to iterate, and keep track of the current maximum age and the corresponding name as you go.
explain: Dictionary iteration combined with state tracking is a common pattern for data aggregation, and the empty-dictionary edge case must not be overlooked.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "word frequency" program: read an English text string, count how many times each word appears, and finally print the top 3 most frequent words and their counts in descending order.
checklist:
- Use split to break the text into a list of words
- Use a dictionary to record each word's frequency (word as key, count as value)
- Normalise case while counting (e.g. convert everything to lower case) so that "The" and "the" are not counted as two different words
- Use sorted or list sorting to order the results from highest to lowest frequency
- Use a slice to take the top 3 and print them in a clear format
- Handle empty text and the case where every word is a duplicate
starter: |
  text = "the quick brown fox jumps over the lazy dog the fox is quick"

  counts = {}

  # Split, normalise case, and count word frequencies into the counts dictionary
  # Then sort by frequency, take the top 3, and print them
```
