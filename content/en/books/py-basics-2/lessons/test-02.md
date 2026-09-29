# Chapter 2 · Big Test

> The chapter on tuples, strings, and sequence commonalities is finished. Now comes the check — do you **remember it**, can you **use it**, and can you actually **build something** with it?
>
> Do not worry about getting everything right first time. **Questions you miss will automatically return to your revision queue in 1 day** (Ebbinghaus forgetting curve), so you can try again then.

---

## Part 1 · Multiple Choice

These test whether the chapter's concepts have really stuck.

```quiz
type: choice
q: Which of these correctly creates a tuple containing only the number 1?
options:
- '(1)'
- '(1,)'
- '[1]'
- 'tuple(1)'
answer: 1
explain: (1) just puts parentheses around 1 and the result is still an int; [1] is a list; tuple(1) raises an error (1 is not iterable). Only (1,) is a single-element tuple — that trailing comma cannot be omitted.
```

```quiz
type: choice
q: 'What happens when you run `a, b = (1, 2, 3)`?'
options:
- 'a=1, b=2, 3 is discarded'
- 'a=1, b=(2, 3)'
- 'Raises ValueError'
- 'Raises SyntaxError'
answer: 2
explain: The left side expects 2 variables but the right side supplies 3 elements, so Python raises ValueError "too many values to unpack". To collect the remainder you would write a, *b = (1, 2, 3), at which point b would be [2, 3].
```

```quiz
type: choice
q: 'Given `s = "  hello  "`, what does `s` itself become after `s.strip()`?'
options:
- '"hello"'
- '"  hello  "'
- An error
- None
answer: 1
explain: strip returns a new string and does not modify the original. To change s you must write s = s.strip(). This is a direct consequence of strings being immutable.
```

```quiz
type: choice
q: Which f-string correctly produces `Price 12.50`?
options:
- 'f"Price {price:.2f}" (price=12.5)'
- 'f"Price {price}" (price=12.5)'
- 'f"Price {price:2f}" (price=12.5)'
- '"Price {price:.2f}".format(price=12.5)'
answer: 0
explain: :.2f means "format as a float with 2 decimal places". B would print 12.5 (only one decimal place); C is missing the dot and is invalid syntax; D is not an f-string, and although it would produce the right output, the question specifies the f-string case, so A is the standard answer.
```

```quiz
type: choice
q: 'After `rows = [[]] * 3`, what does `rows` become once you run `rows[0].append(1)`?'
options:
- '[[1], [], []]'
- '[[1], [1], [1]]'
- '[[1, 1, 1]]'
- An error
answer: 1
explain: In [[]] * 3 the three [] are the same list object, so changing one changes all of them. For three genuinely independent sublists, use [[] for _ in range(3)].
```

---

## Part 2 · Hands-on Questions

Remembering the concepts is not enough — you have to be able to write the code.

```quiz
type: code
q: Use an f-string to print three lines of a product list, in the format `Product: XX, Price: YY.YY`, where XX comes from the list `names` and YY comes from the list `prices` (aligned one-to-one). One product per line.
starter: |
  names = ["apple", "milk", "bread"]
  prices = [0.55, 0.80, 0.35]

  # loop and print three lines
tests:
- assert "Product: apple, Price: 0.55" in __out
- assert "Product: milk, Price: 0.80" in __out
- assert "Product: bread, Price: 0.35" in __out
hint: Iterate the two lists together with zip, and use :.2f inside the f-string to keep two decimal places.
explain: The answer is for n, p in zip(names, prices): print(f"Product: {n}, Price: {p:.2f}"). This tests decimal formatting in f-strings combined with zip for parallel iteration.
```

```quiz
type: function
q: Write a function `reverse_words` that takes a string (words separated by spaces) and returns the string with the word order reversed. For example, `"I love Python"` returns `"Python love I"`.
func: reverse_words
starter: |
  def reverse_words(s):
      return ""
cases: |
  "I love Python" -> "Python love I"
  "a b c d" -> "d c b a"
hint: split into a list first, reverse it with [::-1], then join it back together with " ".join.
explain: The answer is return " ".join(s.split()[::-1]). This tests the pipeline "string → list → reversed → string" and the use of join. split with no arguments splits on any whitespace, which conveniently handles arbitrary spacing.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Using what you learned in this chapter, build a "contact card formatter": given `contacts = [("Alice", "02079460001"), ("Bob", "02079460002"), ("Carol", "02079460003")]`, loop over the contacts and print aligned cards with an f-string in the format `Name: XX     Phone: YY` (the name is left-aligned in a 6-character-wide field, the phone is printed as-is). Then consider: if you wanted to store this data in a structure you could query by name to find a phone number, which container would you choose?
starter: |
  contacts = [
      ("Alice", "02079460001"),
      ("Bob", "02079460002"),
      ("Carol", "02079460003"),
  ]

  # loop and print with an f-string
checklist:
- Unpack the tuple to get the name and phone at the same time
- Use :<6 in the f-string to left-align the name
- Output in the format `Name: XX     Phone: YY`
- Can name a dictionary as the right container for queryable name-to-phone storage
```
