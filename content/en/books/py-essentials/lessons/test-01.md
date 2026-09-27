# Chapter 1 · Getting Started · Review Quiz

> 8 questions. This chapter answers: how do you set up your environment, store your first pieces of data, make your program talk, do arithmetic, and read an error message?
> **You must answer all of them correctly to pass this chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: During Python installation, which box is most often left unticked and causes the terminal to say "command not found"?
options:
- Add Python to PATH
- Install launcher
- Customize installation
- Set the install path
answer: 0
explain: Add Python to PATH registers Python in your system PATH. Without it the terminal cannot locate the python command. The other three options do not affect basic usage.
```

```quiz
type: choice
q: Which of these variable names is valid in Python?
options:
- 2score
- user-name
- score_2
- class
answer: 2
explain: score_2 contains only letters, digits, and underscores, and does not start with a digit, so it is valid. 2score starts with a digit, user-name contains a hyphen, and class is a keyword.
```

```quiz
type: choice
q: After the user types "25", which code correctly works out "26 next year"?
code: |
  age = input("Age: ")
  print(age + 1)
options:
- Yes — input returns a number
- No — input returns a string, you must convert with int() first
- No — Python does not support adding strings and numbers
- Yes — because 25 is already a number
answer: 1
explain: input always returns str, so "25" + 1 raises TypeError. You must use int(age) or int(input(...)) to get an integer.
```

```quiz
type: choice
q: Which of these expressions evaluates to 4?
options:
- -2 ** 2
- (-2) ** 2
- 10 // 3
- 10 % 3
answer: 1
explain: (-2)**2 = 4. -2**2 is parsed as -(2**2) = -4; 10//3 = 3; 10%3 = 1.
```

```quiz
type: choice
q: What happens when you run this code?
code: |
  print("Hello" + 18)
options:
- It prints Hello18
- It prints Hello 18
- It raises TypeError
- It raises SyntaxError
answer: 2
explain: A string and an integer cannot be concatenated, so this is a type mismatch — TypeError. SyntaxError is for malformed syntax, not for type errors at runtime.
```

---

## Part 2 · Hands-on exercises

```quiz
type: function
q: Write a function that takes a name and an age and returns "Hello, my name is XXX and I am X years old".
func: introduce
starter: |
  def introduce(name, age):
      return ""
cases: |
  "Alice", 18 -> "Hello, my name is Alice and I am 18 years old"
  "Bob", 25 -> "Hello, my name is Bob and I am 25 years old"
  "Charlie", 8 -> "Hello, my name is Charlie and I am 8 years old"
hint: An f-string is cleanest: return f"Hello, my name is {name} and I am {age} years old"
explain: Embedding variables in a string with an f-string is far cleaner than concatenation with +, and this is the pattern you will use constantly.
```

```quiz
type: function
q: Write a function that takes a number of seconds and returns a string in the format "Xh Ym Zs" (e.g. 3725 -> "1h 2m 5s").
func: format_time
starter: |
  def format_time(total_seconds):
      return ""
cases: |
  3725 -> "1h 2m 5s"
  60 -> "0h 1m 0s"
  3661 -> "1h 1m 1s"
  125 -> "0h 2m 5s"
hint: hours = total_seconds // 3600, then the remainder // 60 gives minutes, and finally % 60 gives seconds.
explain: Repeatedly applying // and % to unpack units is a basic skill — converting seconds into hours/minutes/seconds is a three-stage division with remainder.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "tip calculator" for a restaurant bill: the program reads the bill amount and the tip percentage (both from input), calculates the tip and the total, and prints a clear breakdown. Handle invalid (non-numeric) input so the program does not crash.
checklist:
- Use float(input(...)) to read the bill amount and tip percentage
- Calculate the tip as bill * percentage / 100, and the total as bill + tip
- Print the bill, the tip, and the total, each rounded to two decimal places
- Use an f-string so the output reads like a proper receipt
- Handle non-numeric input gracefully instead of crashing
- The code must actually run and end normally
starter: |
  bill = 0.0
  percent = 0.0

  # Read the inputs, calculate the tip and total
  # Print a clear receipt-style breakdown
```
