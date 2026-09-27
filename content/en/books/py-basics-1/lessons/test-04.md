# Chapter 4 · Final Test

> The five lessons of this chapter are done. Here's the check — testing **whether you remember it**, **whether you can use it**, and **whether you can build something with it.**
>
> Don't aim for a perfect score on the first try. **Questions you get wrong come back to your review list automatically after 1 day** (Ebbinghaus forgetting curve), and you can fight them again then.

---

## Part 1 · Multiple Choice

Checking whether the concepts really stuck.

```quiz
type: choice
q: What does this code print when it runs?
code: |
  age = 10
  if age >= 18:
      print("Adult")
  print("Done")
options:
- Nothing at all
- Adult
- Done
- Both Adult and Done
answer: 2
explain: A failing if means "skip the block that belongs to it," not "stop the program." print("Done") has no indent, so it has nothing to do with the if and definitely runs.
```

```quiz
type: choice
q: Which statement about Python indentation is correct?
options:
- Indentation is only for looks; you can leave it out
- Indentation decides which block a line belongs to; it's part of the syntax
- Indentation must be exactly 4 spaces; one more or one less is an error
- Indentation must use tabs, not spaces
answer: 1
explain: Python uses indentation where other languages use curly braces to mark code blocks, so it's part of the syntax, not a style choice. The number of spaces isn't forced to be 4 (but it must be consistent within a block), and both tabs and spaces work — just never mix them.
```

```quiz
type: choice
q: What does this code print when score = 95?
code: |
  score = 95
  if score >= 60:
      print("Pass")
  elif score >= 90:
      print("Excellent")
options:
- Excellent
- Pass
- Both Pass and Excellent
- Nothing
answer: 1
explain: elif is checked top to bottom and ends the structure at the first match. 95 >= 60 holds, so the first branch runs and >= 90 never gets checked. This is the classic consequence of writing conditions in the wrong order.
```

```quiz
type: choice
q: What's wrong with the line if weather == "rain" or "snow":?
options:
- It's a syntax error and won't run
- Nothing, it's perfectly correct
- It's always true, because "snow" is a non-empty string treated as True
- The two sides of or are in the wrong order
answer: 2
explain: "snow" is a non-empty string, which Python treats as True where a boolean is needed, so the whole condition is always True no matter what weather is. Bugs like this raise no error, which makes them especially dangerous. The fix is weather == "rain" or weather == "snow".
```

---

## Part 2 · Coding

Remembering concepts isn't enough — you have to be able to write it.

```quiz
type: code
q: Write code that prints "Negative" when num is negative, and "Non-negative" otherwise.
starter: |
  num = -7

  # write your test here

tests:
- assert "Negative" in __out
- assert "Non-negative" not in __out
hint: Use if to test num < 0 and let else handle everything else. Don't forget the colon and the indent.
explain: num < 0 holds, so we take the if branch. Exactly one of if and else runs, so "Non-negative" won't appear in this output.
```

```quiz
type: code
q: Fix the two errors in this code so it prints "May enter" when age is 18 or over.
starter: |
  age = 20

  if age >= 18
  print("May enter")
tests:
- assert "May enter" in __out
hint: First: what symbol is missing at the end of the if line? Second: how many spaces should print be indented by?
explain: A missing colon and a missing indent account for most beginner if errors. Checking these two first whenever an if misbehaves will save you a lot of time.
```

```quiz
type: code
q: Combine conditions with and: only print "Allowed" when age is at least 18 and has_id is True.
starter: |
  age = 20
  has_id = False

  # write your test here

tests:
- assert "Allowed" not in __out
hint: The condition is age >= 18 and has_id. Note that has_id is already a boolean, so you don't need == True.
explain: has_id is False, so the and is False and nothing prints. Writing has_id alone is enough — adding == True is redundant.
```

```quiz
type: code
q: Reorder these three branches from strictest to loosest so that score = 88 prints "Good".
starter: |
  score = 88

  if score >= 60:
      level = "Pass"
  elif score >= 90:
      level = "Excellent"
  elif score >= 75:
      level = "Good"

  print(level)
tests:
- assert "Good" in __out
- assert "Pass" not in __out
- assert "Excellent" not in __out
hint: Don't change any condition, only the order. Narrowest first: 90 → 75 → 60.
explain: The correct order puts >= 90 first, >= 75 second, and >= 60 third. 88 skips past 90 and matches 75, giving "Good". If a loose condition sits first, the strict ones never get checked.
```
