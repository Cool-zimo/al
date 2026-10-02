# test-04 Chapter 4 · Questions II: programming

> Chapter 4 · Questions II: programming — the end-of-chapter check.


```quiz
type: choice
q: What happens with cases written `1 2 -> 3` (space)?
options:
- The whole thing becomes one argument and the call reports a missing argument
- It splits into two arguments normally
- The validator rewrites it with a comma
- A syntax error is reported
answer: 0
```

```quiz
type: choice
q: What should a function question starter provide?
options:
- A version that runs but returns the wrong answer
- An empty comment placeholder
- The full correct answer
- An empty file
answer: 0
```

```quiz
type: choice
q: Can random.randrange(1, 6) roll a 6?
options:
- No, the upper bound is exclusive
- Yes, same as randint
- Sometimes
- Depends on the Python version
answer: 0
```

```quiz
type: choice
multi: true
q: Besides the range itself, what else does a range case check? (two answers)
options:
- That the results really vary
- For small integer ranges, that every value appeared
- That the number of calls is even
- That the function name starts with roll
answer: 0, 1
```

```quiz
type: choice
q: In a code question, what is __out?
options:
- The complete standard output, as one string
- The value of the last print
- The return value
- The error message
answer: 0
```

```quiz
type: function
q: Write abs_val(n) returning the absolute value of n without using the built-in abs
func: abs_val
starter: |
  def abs_val(n):
      return n
cases: |
  5 -> 5
  -5 -> 5
  0 -> 0
  -100 -> 100
hint: Negatives return their opposite
explain: If n < 0 return -n, otherwise n. The -5 -> 5 case exists to block "just return the input".
```

```quiz
type: function
q: Write count_words(s) returning how many words s contains, splitting on whitespace
func: count_words
starter: |
  def count_words(s):
      return 0
cases: |
  "hello world" -> 2
  "one" -> 1
  "" -> 0
  "a  b   c" -> 3
hint: split() with no argument handles runs of spaces
explain: s.split() with no argument splits on any whitespace and drops empties, so len is enough.
```

```quiz
type: project
q: Write a function question and prove it discriminates: a starter, at least three cases, confirm that submitting starter unchanged fails and that a correct solution passes.
starter: |
  # Check each case:
  #
  #   1. Does the correct solution pass?
  #   2. Does submitting starter unchanged pass? (if yes, no discrimination)
  #   3. Is there a case that blocks a common wrong answer?
checklist: |
  - Case arguments are comma-separated
  - starter runs, it just gives the wrong result
  - Submitting starter unchanged fails
  - At least one case blocks a common wrong answer
  - The validator reports zero errors
```
