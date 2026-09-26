# Chapter 2 · Variables & Data Types · Chapter Test

> Eight questions. Multiple choice checks the concepts, hands-on tasks make you actually write code, and the final mini project ties the whole chapter together.
> **All correct to pass** — anything you miss goes into your review schedule automatically.

## Part 1 · Multiple choice

Check that the concepts really stuck.

```quiz
type: choice
q: After this code runs, what is the value of x?
code: |
  x = 5
  x = x + 1
  x = x * 2
options:
- 12
- 10
- 11
- An error
answer: 0
explain: Step by step: x=5 → x+1 is 6, stored back → x*2 is 12, stored back. The mantra: evaluate the right, store into the left.
```

```quiz
type: choice
q: What are the results of 10 / 4 and 10 // 4?
options:
- 2.5 and 2
- 2 and 2
- 2.5 and 2.5
- 2 and 2.5
answer: 0
explain: / always returns a float in Python 3, so 10 / 4 = 2.5. // is floor division, keeping the quotient and dropping the remainder, so 10 // 4 = 2.
```

```quiz
type: choice
q: Which statement about strings is correct?
options:
- Once created, you can change the first character with text[0] = "H"
- text = "Hello"; text.upper() turns text itself into uppercase
- Strings are immutable; text.upper() returns a new string and leaves the original alone
- Strings and numbers can be added with + directly
answer: 2
explain: Strings are immutable. Every method that looks like it edits (upper, strip, replace) returns a new string and leaves the original untouched. To keep the result you must reassign: text = text.upper().
```

```quiz
type: choice
q: Which of these values is treated as False in Python?
options:
- "False"
- 0
- "0"
- -1
answer: 1
explain: The rule is "empty and zero are false, everything else true". 0 is numeric zero so it's False; "False" and "0" are non-empty strings and therefore True; -1 is a non-zero number, so also True.
```

```quiz
type: choice
q: After age = input("Age: "), how should you compare age > 18?
options:
- Just write if age > 18
- Write if int(age) > 18
- Write if str(age) > 18
- Write if age > "18"
answer: 1
explain: input() always returns a string, and a string cannot be compared with a number (TypeError). Convert with int(age) first. The most practical rule in this chapter.
```

---

## Part 2 · Hands-on

Not just "can read it" — "can write it". Both are machine-graded: edit the code, hit "Run & check", and the page really executes it.

```quiz
type: code
q: Use variables and f-strings to print a business card with name, age and city on three lines
starter: |
  # Requirements:
  # 1. Store "Alex", 20 and "London" in name / age / city
  # 2. Use f-strings to print three lines:
  #    Name: Alex
  #    Age: 20
  #    City: London
  
  # write your code here
tests:
- assert "Name: Alex" in __out
- assert "Age: 20" in __out
- assert "City: London" in __out
hint: Three assignments first, then print(f"Name: {name}") and so on. f-strings convert the number 20 to text for you — no str() needed.
explain: Variables plus f-strings is the most common Python output combination. Variables manage the data that can change; f-strings embed it naturally in text. Together, one edit changes everything.
```

```quiz
type: code
q: Work out how many minutes and seconds 100 seconds is
starter: |
  total_seconds = 100
  
  # use // for minutes and % for the leftover seconds
  # output format: 100 seconds = 1 min 40 sec
  
  # write your code here
tests:
- assert "1 min" in __out
- assert "40 sec" in __out
hint: minutes = total_seconds // 60, seconds = total_seconds % 60. Then print(f"{total_seconds} seconds = {minutes} min {seconds} sec").
explain: // and % are the standard pair for unit conversion: one gives the count in the larger unit, the other the leftover. Time conversion, base conversion, pagination — all built on these two.
```

---

## Part 3 · Mini project

Turn this chapter into something complete enough to show off.

```quiz
type: project
q: Build a "personal info card generator": store your details in variables, then use concatenation and f-strings to print a tidy card
checklist:
- Used at least 3 variables (name, age, city, etc.)
- Combined variables with text using f-strings or +
- Drew a divider line with "=" * 30 or similar
- Used at least one string method (strip / upper / lower / title)
- The code runs clean with no errors
starter: |
  # Personal info card generator
  # hint: use input() to ask the user, or hard-code the values
  
  name = "your name"
  age = 18
  city = "your city"
  
  # a divider line
  print("=" * 30)
  
  # card contents with an f-string
  print(f"Name: {name}")
  
  # keep going…
  
  print("=" * 30)
hint: Get it running first, then make it pretty. A divider is one line: "=" * 30. Use name.upper() to standardise the case. You could also add input() so the user types their own details.
explain: This project pulls the whole chapter together: variables hold data, concatenation builds sentences, multiplication draws dividers, string methods normalise format, f-strings keep it readable. It looks simple, but every "text-generating" program — reports, logs, config files — is built on exactly this.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Hands-on 1:**

```python
name = "Alex"
age = 20
city = "London"
print(f"Name: {name}")
print(f"Age: {age}")
print(f"City: {city}")
```

**Hands-on 2:**

```python
total_seconds = 100
minutes = total_seconds // 60
seconds = total_seconds % 60
print(f"{total_seconds} seconds = {minutes} min {seconds} sec")
```

**Mini project (one way to do it):**

```python
name = input("Name: ").strip()
age = int(input("Age: "))
city = input("City: ").strip()

line = "=" * 34
print(line)
print(f"  Name: {name.title()}")
print(f"  Age: {age}")
print(f"  City: {city.upper()}")
print(line)
```

</details>

## What you learned in this chapter

- **Variables**: label your data; `=` means "put in", not "equals"; evaluate the right, store into the left
- **int / float**: `/` always gives a decimal, `//` gives the quotient and `%` the remainder; floats have precision issues, never compare them with `==`
- **str**: text in quotes; immutable; indexes start at 0; slices include the left and exclude the right; `[::-1]` reverses
- **bool**: only True/False; produced by comparisons; combined with `and` / `or` / `not`; "empty and zero are false"
- **Conversion**: `type()` inspects, `int()` / `float()` / `str()` convert, and **`input()` always returns a string**

One thing to keep in mind: **this whole chapter was about the kinds of data.** Lists, dicts, functions and classes later are all combinations built on these four basic types. A solid foundation here makes everything after it easier.
