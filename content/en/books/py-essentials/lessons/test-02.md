# Chapter 2 · Decisions and Repetition · Review Quiz

> 8 questions. This chapter answers: how does a program make up its own mind, and how does it do the same thing a hundred times?
> **You must answer all of them correctly to pass this chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: What does the following code print?
code: |
  x = 7
  if x > 10:
      print("big")
  elif x > 5:
      print("medium")
  else:
      print("small")
options:
- big
- medium
- small
- big medium
answer: 1
explain: x is 7, so the first condition x>10 is false and we move to elif; x>5 is true, so it prints "medium" and exits the whole if structure without reaching the else.
```

```quiz
type: choice
q: Which statement about Python's "rules of truthiness" is correct?
options:
- Only True and False count as booleans; other types cannot follow an if
- Empty lists [], empty strings "", and the number 0 are all treated as false in a boolean context
- The string "False" is treated as false after an if
- The list [0, 0] is treated as false because it is an empty list
answer: 1
explain: In Python, empty containers, 0, and None are all false; "False" is a non-empty string so it is true; [0,0] is not empty so it is also true.
```

```quiz
type: choice
q: Which of these snippets falls into an infinite loop?
code: |
  # A
  i = 0
  while i < 3:
      print(i)
      i += 1
  # B
  i = 0
  while i < 3:
      print(i)
  # C
  while False:
      print("hi")
  # D
  i = 3
  while i > 0:
      i -= 1
options:
- A
- B
- C
- D
answer: 1
explain: In B, i stays 0 forever and the condition is always true. A and D both update their variable and terminate; C is false from the start and never enters the loop at all.
```

```quiz
type: choice
q: What sequence does `range(2, 10, 3)` produce?
options:
- [2, 5, 8, 11]
- [2, 5, 8]
- [2, 3, 4, 5, 6, 7, 8, 9]
- [5, 8]
answer: 1
explain: range starts at 2, steps by 3, and stops before 10, so it yields 2, 5, 8. The next value, 11, has already passed the stop value.
```

```quiz
type: choice
q: What does this code print?
code: |
  i = 0
  while i < 5:
      i += 1
      if i == 3:
          continue
      print(i)
options:
- 1 2 3 4 5
- 1 2 4 5
- 1 2
- 2 3 4 5
answer: 1
explain: i increments from 1 to 5; when i==3, continue skips the print for that round, so 3 is not printed. The output is 1 2 4 5.
```

---

## Part 2 · Hands-on exercises

```quiz
type: function
q: Write a function that takes an integer n and returns "positive", "negative", or "zero".
func: judge_number
starter: |
  def judge_number(n):
      return ""
cases: |
  7 -> "positive"
  -3 -> "negative"
  0 -> "zero"
  100 -> "positive"
hint: Check n > 0 first, then n < 0, and whatever is left is zero. An if/elif/else of three branches is enough.
explain: This is the introductory exercise in multi-way decisions — the key is handing the "leftover case" to else without writing an unnecessary condition.
```

```quiz
type: function
q: Write a function that takes a positive integer n and uses a while loop to compute and return the sum of the integers from 1 to n.
func: sum_to
starter: |
  def sum_to(n):
      return 0
cases: |
  100 -> 5050
  10 -> 55
  1 -> 1
  0 -> 0
hint: total = 0, i from 1 to n, each round total += i and i += 1. Note that when n=0 it should return 0.
explain: Summation is the most basic loop application, and it also tests whether you have all three loop elements in place — initial value, condition, and update.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "guess the number" game: the program randomly picks an integer from 1 to 100, the user repeatedly enters guesses, the program hints "too high" or "too low" until the guess is correct, and finally reports how many attempts it took.
checklist:
- Use random.randint(1, 100) to generate the target number
- Use a while loop to keep receiving user input
- Use if/elif/else to give the three hints "too high" / "too low" / "correct"
- Use a counter variable to track the number of attempts and print it when the guess is correct
- Handle invalid input (e.g. the user types something that is not a number) so the program does not crash
- The code must actually run and end normally without looping forever
starter: |
  import random

  secret = random.randint(1, 100)
  tries = 0

  # Use a while loop to guess repeatedly, and break out once the guess is correct
  # Remember to update tries and print the attempt count at the end
```
