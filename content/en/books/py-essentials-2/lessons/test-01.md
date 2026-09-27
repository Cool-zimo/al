# Chapter 1 · Basics Review · Big Quiz

> 8 questions. This chapter is about using basic syntax correctly — variables and types, input and output, arithmetic and strings, reading error messages, and putting it all together.
> **You only pass the chapter if you get every question right.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: What does the following code print?
code: |
  a = 3
  b = a
  a = a + 1
  print(a, b)
options:
- "4 4"
- "4 3"
- "3 4"
- error
answer: 1
explain: When b = a runs, a is 3, so b gets the value 3 — it is not tied to a. After that, a becomes 4 and b stays put. So a=4, b=3. This is "assignment copies the value, it does not create a connection".
```

```quiz
type: choice
q: Which of the following is true about a Traceback?
options:
- Read it from the first line down; the first line is where the error occurred
- The bottom line is the error type and reason, and the arrow points at the broken code
- SyntaxError also prints a full call stack
- IndexError and ValueError mean the same thing
answer: 1
explain: A Traceback is read "bottom to top": the last line is the error type plus reason, and the arrow points at the line that broke. SyntaxError is caught during syntax checking, so there is no call stack. IndexError is an out-of-range index; ValueError is an invalid value (e.g. int("abc")) — completely different.
```

```quiz
type: choice
q: Which expression evaluates to 1?
code: |
  A: 17 % 4
  B: -17 % 4
  C: 17 // 4
options:
- Only A
- A and B
- Only C
- B and C
answer: 0
explain: 17 % 4 = 1 (17 = 4×4 + 1). In Python, -17 % 4 is 3: -17 // 4 = -5, and -17 = -5×4 + 3. 17 // 4 = 4. Of the three, only A gives 1.
```

```quiz
type: choice
q: What error does the following code raise?
code: |
  x = "123"
  y = x + 4
  print(y)
options:
- SyntaxError
- NameError
- TypeError
- ValueError
answer: 2
explain: x is the string "123" and 4 is an integer. Python will not add a string and an integer, raising TypeError: can only concatenate str to str. This is not ValueError — that one means "the value's content cannot be converted", like int("abc").
```

```quiz
type: choice
q: What error does the following code raise?
code: |
  a, b = input().split()
  print(a * b)
  # user input: 3 4
options:
- SyntaxError
- NameError
- TypeError
- prints 12
answer: 2
explain: input().split() returns ['3','4'], so a='3', b='4', both strings. Strings can only be multiplied by an integer, so '3' * '4' raises TypeError: can't multiply sequence by non-int. Only converting with map(int, ...) first gives 12.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write hide_middle(s): replace the middle part of the string with asterisks, keeping only the first and last character. If the length is 2 or less, return it unchanged. For example "python" returns "p****n", "ab" returns "ab".
func: hide_middle
starter: |
  def hide_middle(s):
      # length <= 2 -> return as is; otherwise s[0] + '*'*(len-2) + s[-1]
      return s
cases: |
  "python" -> "p****n"
  "BeijingShanghai" -> "B******i"
  "ab" -> "ab"
  "a" -> "a"
  "hello world" -> "h*********d"
hints: The middle section has length len(s)-2. Use s[-1] for the last character to avoid the error-prone len(s)-1.
explain: This combines len(), repetition with *, and positive/negative indexing. Lengths of 2 or less need special handling, otherwise the middle section would have length <= 0; with len >= 2 the count is non-negative, but len 1 still needs a branch.
```

```quiz
type: function
q: Write safe_divide(a, b): return the result of a / b rounded to two decimal places. If b is 0, return the string "division by zero".
func: safe_divide
starter: |
  def safe_divide(a, b):
      # check whether b is 0 first; otherwise divide and round(..., 2)
      return 0
cases: |
  (10, 3) -> 3.33
  (7, 2) -> 3.5
  (5, 0) -> "division by zero"
hints: Handle if b == 0 first; otherwise return round(a / b, 2).
explain: This is basic "defensive programming": reject the illegal case first, then handle the normal logic. Without the check, b=0 raises an exception instead of returning the prompt string.
```

## Part 3 · Mini Project

```quiz
type: project
q: Write a "score receipt" program: read a student's name and three scores (one line, space-separated), then print a receipt in the following format (example with Alice): "Name: Alice | Total: 270 | Avg: 90.0 | Grade: excellent". Grade rules: avg >=90 -> excellent, avg >=60 -> pass, otherwise fail. The average is kept to one decimal place.
starter: |
  name = input()
  # use map(int, input().split()) to read the three scores
  # compute total, avg, level, then print with an f-string
  print("change this")
hints: Break it into three steps: read (map + split) -> compute (total, avg, level) -> output (f-string). For the grade use if-elif-else, testing the higher thresholds first.
checklist:
- correctly reads three integer scores with map(int, input().split())
- total and average are computed correctly
- average is rounded to one decimal place
- grade uses the two tiers >=90 / >=60, with boundaries (exactly 90, exactly 60) assigned correctly
- printed in one f-string with no string-concatenation TypeError
```
