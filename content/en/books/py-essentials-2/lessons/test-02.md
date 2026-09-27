# Chapter 2 Test · Conditionals & Loops

> This test covers Chapter 2 of *Essential Python*: if / elif / else, truthiness rules, while, for and range, break / continue / nesting.
> Finish it before checking answers; if you get stuck, revisit the corresponding lesson.

## Part 1 · Multiple Choice

```quiz
type: choice
q: Running the following code with input 75, what is printed?
code: |
  score = int(input())
  if score >= 60:
      print("pass")
  elif score >= 90:
      print("excellent")
options:
- pass
- excellent
- nothing
- error
answer: 0
explain: 75 >= 60 holds, so the first branch is hit and prints "pass"; the second branch is never even evaluated. This is exactly what happens when a broad condition comes first. Swap the two branches and 75 falls through to else.
```

```quiz
type: choice
q: What is the value of the following expression?
code: |
  0 or "" or [] or "New York"
options:
- 0
- ""
- []
- "New York"
answer: 3
explain: or short-circuits and returns the first truthy value. 0, "" and [] are all falsy and skipped; "New York" is a non-empty string and truthy, so it is returned immediately. This is the property that or returns an operand, not a boolean.
```

```quiz
type: choice
q: What does the following code print?
code: |
  i = 1
  while i <= 3:
      print(i)
      i = i - 1
options:
- 1 0 -1
- 1 2 3
- keeps printing 1 forever
- nothing
answer: 2
explain: i starts at 1 and decreases by 1 each pass, so it only gets smaller; the condition i<=3 is always true — an infinite loop. This is the textbook "update in the wrong direction".
```

```quiz
type: choice
q: What does the following code print?
code: |
  for i in range(5, 2, -1):
      print(i, end=" ")
options:
- 5 4 3 2 1
- 5 4 3
- 2 3 4 5
- nothing
answer: 1
explain: range(5, 2, -1) starts at 5 with step -1; the stop 2 is excluded, yielding 5, 4, 3. Counter-example range(5, 2) defaults to step +1, so starting at 5 it can never reach 2 and prints nothing.
```

```quiz
type: choice
q: What does the following code print?
code: |
  for i in range(3):
      for j in range(3):
          if j == 1:
              break
          print(i, j, end=" | ")
options:
- 0 0 | 0 1 | 1 0 | 1 1 | 2 0 | 2 1 |
- 0 0 | 1 0 | 2 0 |
- 0 0 | 0 1 | 0 2 | 1 0 | 1 1 | 1 2 | 2 0 | 2 1 | 2 2 |
- nothing
answer: 1
explain: break only exits the inner for j; at j==1 the inner loop terminates, printing only (i,0) each time. The outer loop runs its 3 passes normally, printing 0 0 / 1 0 / 2 0 in total.
```

## Part 2 · Hands-On

```quiz
type: code
q: Read an integer from 0 to 100, then print the grade by the rules: 90 and above -> "excellent"; 80-89 -> "good"; 60-79 -> "pass"; below 60 -> "fail". The system will feed in 88.
starter: |
  # if-elif-else, strict to loose
  score = int(input())
  print("TODO: replace this line with your output")
stdin: |
  88
tests:
- assert "good" in __out
hints: Order it >=90, >=80, >=60, else. Test the boundaries 80 and 90 yourself.
explain: This tests condition order. A counter-example putting if score>=60 first would make 90 "pass". Exactly 80 should be "good" (takes elif >=80), exactly 60 should be "pass" (takes elif >=60).
```

```quiz
type: function
exam: true
q: Write count_down(n): count down from n to 1 inclusive using a while loop, printing the current number each pass and decrementing n. If n is 0 or negative, do nothing. Return None.
func: count_down
starter: |
  def count_down(n):
      # while has three parts: initial value, condition, update - none can be missing
      pass
cases: |
  3 -> prints 3, 2, 1
  1 -> prints 1
  0 -> prints nothing
  -2 -> prints nothing
hints: while n >= 1: print n then n -= 1. The condition n>=1 guarantees nothing happens when n<=0.
explain: With all three while parts present there is no infinite loop. A counter-example omitting n -= 1 loops forever printing the same number; the condition while n > 0 also works but the endpoint test is less clear; using range is the for style, but the question asks for while.
```

## Part 3 · Mini Project

```quiz
type: function
exam: true
q: Write guess_number(secret): implement a "guess the number" interaction that repeatedly reads integers (simulated via input) until secret is guessed. Each pass reads one integer guess: if it is too high print "too high"; too low print "too low"; correct print "correct, N guesses" and stop. N is the total number of guesses including the last one. If the user enters an empty line or a non-number, treat it as one invalid input, print "invalid input", and do not count it towards the guess total. Implement with while True plus break.
func: guess_number
starter: |
  def guess_number(secret):
      # while True: read -> check invalid (continue) -> check high/low -> break when correct
      pass
cases: |
  (42, inputs 10 50 abc 42) -> outputs "too low" "too high" "invalid input" "correct, 3 guesses"
  (7, inputs 7) -> outputs "correct, 1 guess"
  (0, inputs -5 0) -> outputs "too low" "correct, 2 guesses"
hints: Invalid input (empty string, or int conversion failing) is caught with try-except ValueError; print "invalid input" and continue without incrementing the counter. When correct, print the count and break.
explain: This ties together every topic of the chapter: while True + break controls the loop, continue skips invalid passes, try-except handles input conversion, and the counter updates in the right place. Invalid input does not count, so the counter only increments on valid numbers. A counter-example placing the counter after continue adds an extra count; putting break in the invalid branch exits on the first bad input; calling int(input()) with no try-except crashes on "abc" with ValueError.
```
