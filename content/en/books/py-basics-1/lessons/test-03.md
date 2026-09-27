# Chapter 3 · Final Test

> The five lessons are done. This is the checkpoint — three kinds of questions, checking whether you **remember it**, **can use it**, and **can build with it**.
>
> Don't aim for a perfect run. **Wrong answers come back to your review queue automatically after 1 day** (Ebbinghaus forgetting curve) — you'll fight them again then.

---

## Part 1 · Multiple choice

Checking whether the concepts actually stuck.

```quiz
type: choice
q: With age = input("Age? ") and the user typing 18, what type is stored in age?
options:
- the integer 18
- the string "18"
- the float 18.0
- it depends on whether the user typed a number
answer: 1
explain: input() always returns a string, whatever the user types. That's the core of lesson 12. To compute you must convert with int() or float() — the single most common beginner trap.
```

```quiz
type: choice
q: With name = "Xiaohong", which line is missing the f before the quote?
code: |
  print("Hello, {name}")
options:
- print("Hello, {name}")
- print(f"Hello, {name}")
- both are missing it
- neither is missing it
answer: 0
explain: Without the f prefix, Python treats {name} as plain text and prints it literally: "Hello, {name}". Whenever braces show up in your output, check for a missing f first.
```

```quiz
type: choice
q: What does "  Hello  ".strip() produce?
options:
- "Hello"
- "  Hello"
- "Hello  "
- "  Hello  "
answer: 0
explain: strip() removes whitespace from both ends and keeps the middle. So "  Hello  " becomes "Hello". With "He llo", the inner space would survive.
```

```quiz
type: choice
q: You want to detect Beijing, but users may type "Beijing city", "Chaoyang, Beijing", or "  Beijing  ". Which test is most robust?
options:
- city == "Beijing"
- "Beijing" in city
- "Beijing" in city.strip()
- city.strip() == "Beijing"
answer: 2
explain: Two things matter: strip() first to kill stray spaces (handles "  Beijing  "), then in for substring matching (so "Beijing city" still hits). == alone is too strict; in alone works here but cleaning is the better habit.
```

```quiz
type: choice
q: Which of these cleaning habits is wrong?
options:
- using .strip() on a city name
- using .lower() on English menu choices
- using .strip() on a password
- using if not name to check for empty input
answer: 2
explain: Spaces at the ends of a password may be intentional; strip() would alter the password so that what was set and what gets verified no longer match. The rule: identifiers and choices get cleaned; content (passwords, article text, code) does not.
```

---

## Part 2 · Hands-on

Understanding isn't enough. Write the code and make it run.

```quiz
type: code
q: age_text is the "18" the user typed. Compute and print the birth year: "You were born in 2007" (counting from 2025)
starter: |
  # what the user typed arrives as the string "18"
  age_text = "18"
  
  # convert, compute 2025 - age, print in the required format
  print("fix this")
tests:
- assert "2007" in __out
hint: birth = 2025 - int(age_text), then print(f"You were born in {birth}"). The int() is the point — you cannot subtract from a string.
explain: Data from input must be converted before arithmetic; that is a hard rule. Without int() you get 2025 - "18" and a TypeError.
```

```quiz
type: code
q: Print name and age on one line: "Xiaohong is 18 years old!" (name already stripped, age is an int)
starter: |
  # already cleaned data
  name = "Xiaohong"
  age = 18
  
  # print with an f-string
  print("fix this")
tests:
- assert "Xiaohong is 18 years old!" in __out
hint: print(f"{name} is {age} years old!") — copy the spaces around "is" and before "years" exactly.
explain: An f-string makes layout "copy the finished sentence and punch holes for variables". In a real program name comes from input().strip() and age from int(input()).
```

---

## Part 3 · Mini project

Wire the whole chapter together into something you could hand to someone else.

```quiz
type: project
q: Build an "introduction generator" — ask at least 3 questions, clean the answers, then print a laid-out self-introduction
checklist:
- at least 3 input() calls (suggestion: name, age, hobby)
- every input followed by .strip()
- at least one value converted (int or float)
- output uses an f-string (f before the quote, {variable} inside)
- the layout has structure (dividers or alignment), not one long line
- you tested it with leading/trailing spaces and confirmed they don't show up
- you hit "Run" and confirmed it actually produces the result
hint: Follow the "personal info card" structure from lesson 15. Ask everything first (stripping each one), then convert and compute, then print everything at once. Using {label:<6} for alignment looks much neater.
explain: This project tests whether you can chain the whole chapter. Real programs are never one知识点 — they're the pipeline "ask → clean → convert → compute → lay out". Build it once and that flow is in your muscle memory.
```

### Reference answer (look after you finish)

```python
print("===== Introduction Generator =====")
print()

# ask, stripping each answer
name = input("Your name: ").strip()
age = int(input("Your age: ").strip())
hobby = input("Your hobby: ").strip()

# fallback for empty
if not hobby:
    hobby = "not decided yet"

# compute
birth_year = 2025 - age

# lay out and print
print()
print("------------------------------")
print(f"  {'Name':<6}{name}")
print(f"  {'Age':<6}{age} (born {birth_year})")
print(f"  {'Hobby':<6}{hobby}")
print("------------------------------")
print(f"Hi everyone, I'm {name}, {age} years old, and I like {hobby}.")
```

Output:

```
===== Introduction Generator =====

Your name:  Xiaohong
Your age:18
Your hobby:  drawing

------------------------------
  Name   Xiaohong
  Age    18 (born 2007)
  Hobby  drawing
------------------------------
Hi everyone, I'm Xiaohong, 18 years old, and I like drawing.
```

Even though the input carried stray spaces (deliberately added before "Xiaohong" and "drawing"), the output is clean — that's the value of `strip()`.

---

## What you learned in this chapter

- ✅ `input("prompt")` **stops and waits** for the user, and returns a string
- ✅ **input always returns a string** — convert with `int()` / `float()` before arithmetic
- ✅ `f"text {variable}"` — f before the quote, variables in `{}`, **no `str()` needed**, expressions allowed
- ✅ `strip()` trims the ends, `.lower()` unifies case, `in` tests containment
- ✅ The three moves of a robust program: **ask → clean → convert**, and only then output

## What's next

Your programs have one obvious limit right now: **they run top to bottom and never go back**.

Want the user to retry after a typo? Want a program to repeat something a hundred times? That needs **loops** and the **full form of conditionals** — the main event of *Python Basics 2*.

When you get there, you'll find that every "one-shot program" from this chapter can be upgraded into "a tool you can use over and over".
