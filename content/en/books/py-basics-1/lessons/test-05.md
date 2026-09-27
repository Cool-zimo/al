# Chapter 5 · Final Test

> The five lessons of this chapter are done. Below is the check — **do you remember it**, **can you use it**, **can you build something**.
>
> Don't aim for a perfect score on the first try. **Questions you get wrong come back to your review list after 1 day** (Ebbinghaus forgetting curve), and you can fight them again then.

---

## Part 1 · Multiple Choice

Checking whether the concepts actually stuck.

```quiz
type: choice
q: Which numbers does range(3) produce?
options:
- 0 1 2
- 1 2 3
- 0 1 2 3
- 1 2
answer: 0
explain: With a single argument, range starts at 0 and ends at that number (excluded). So range(3) is 0, 1, 2 — three numbers, exactly equal to the argument. The textbook example of "half-open."
```

```quiz
type: choice
q: Which statement about `while True` is correct?
options:
- It's a syntax error; True can't be used that way
- It runs forever and must be stopped with `break` inside the body
- It automatically runs 10 times and then stops
- It's completely unrelated to `while 1 == 1`
answer: 1
explain: True is a boolean that is always true, so the condition of `while True` never becomes false — it cannot stop on its own and must rely on `break`. It suits situations where "you don't know how many times, you have to act once to find out," like menus and guessing games.
```

```quiz
type: choice
q: What does `continue` do?
options:
- Ends the entire loop
- Skips the rest of this round and goes back to the top for the next round
- Pauses the program to wait for user input
- Exactly the same as `break`, just spelled differently
answer: 1
explain: This pair is the easiest to confuse. `break` means "the whole loop ends, jump outside it"; `continue` means "this round stops here, back to the top." After continue the loop keeps going; after break it doesn't.
```

```quiz
type: choice
q: Which of these gets stuck in an infinite loop?
code: |
  # A
  count = 1
  while count <= 3:
      print(count)
      count = count + 1

  # B
  count = 1
  while count <= 3:
      print(count)

  # C
  for n in range(3):
      print(n)

  # D
  for n in range(3):
      if n == 1:
          break
      print(n)
options:
- A
- B
- C
- D
answer: 1
explain: In B, count is always 1, so the condition always holds. There's one way to judge an infinite loop: does the body contain something that eventually makes the condition false? A has count+1; C and D use `for` (fixed count, no condition at all). Only B has nothing.
```

```quiz
type: choice
q: How many times does this code print?
code: |
  for i in range(2):
      for j in range(3):
          print(i, j)
options:
- 5 times
- 6 times
- 3 times
- 2 times
answer: 1
explain: Total rounds = "outer count × inner count" = 2 × 3 = 6. Remember the rhyme: the outer takes one step, the inner runs a full lap — and every time the outer advances, the inner starts over from the beginning.
```

---

## Part 2 · Coding

Remembering the concept isn't enough — you have to write it.

```quiz
type: code
q: Use a `while` loop to compute the sum of all integers from 1 to 10 and print it (should be 55)
starter: |
  total = 0
  count = 1

  # write your loop here

  print(total)
tests:
- assert "55" in __out
hint: The condition is `count <= 10`. The body does two things: add count into total, then add 1 to count.
explain: In the accumulate pattern the two variables have clear roles — total holds the result (starts at 0), count tracks the round (starts at 1). The most common error is writing `count = count + 1` outside the loop; then count never changes and you get an infinite loop.
```

```quiz
type: code
q: Use `for` + `range` to print the square of each number from 1 to 5, one per line (1, 4, 9, 16, 25)
starter: |
  for n in range(1, 6):
      # write one line here

tests:
- assert "1" in __out
- assert "9" in __out
- assert "25" in __out
- assert "36" not in __out
hint: A square is `n * n`. Note range must be `(1, 6)` to reach 5.
explain: The line is `print(n * n)`. Here's "the end is excluded" again: to get 1 through 5, range must be `(1, 6)`. Write `(1, 5)` and you lose the 5, so 25 never appears — and the `36 not in __out` assertion confirms you didn't run an extra round.
```

```quiz
type: code
q: Find the first number between 1 and 20 that is divisible by 7, print it, then stop immediately (don't keep looking)
starter: |
  for n in range(1, 21):
      if n % 7 == 0:
          print(n)
          # add one line here
tests:
- assert "7" in __out
- assert "14" not in __out
hint: Once found, you should stop. Which keyword leaves the loop?
explain: The missing line is `break`. Multiples of 7 between 1 and 20 include 7 and 14; the task says "the first" and then stop — without break, 14 gets printed too and the second assertion fails. This is break's classic use: take the result and leave once the condition is met.
```

```quiz
type: code
q: Print all numbers from 1 to 10 that are **not** multiples of 3 (skip 3, 6, 9)
starter: |
  for n in range(1, 11):
      if n % 3 == 0:
          # add one line here
      print(n)
tests:
- assert "1" in __out
- assert "2" in __out
- assert "3" not in __out
- assert "10" in __out
hint: Multiples should be "skipped," not "stopped" — stopping is `break`; which one skips the rest of the round?
explain: The missing line is `continue`. When n is a multiple of 3, continue skips the `print(n)` below and starts the next round. With `break` instead, the whole loop ends at n=3 and 4 through 10 never print — the `10 in __out` assertion exists to tell those two apart.
```

```quiz
type: code
q: Use nested loops to print this pattern (3 rows: row 1 has 1 star, row 2 has 2, row 3 has 3)
starter: |
  for i in range(1, 4):
      # write the inner loop here (hint: end="" prints without a newline)

      print()          # newline; don't change it
tests:
- assert __out.count("*") == 6
- assert "***" in __out
hint: The inner loop's count depends on which row the outer loop is on — row i needs i stars, so the inner uses range(i). `print("*", end="")` keeps the stars on one line.
explain: The inner loop is `for j in range(i): print("*", end="")`. Note there's no +1 here — because what matters is the *count*, not a *value*: row 1 needs 1, and range(1) gives exactly 1 round. Compare with the table's `range(1, i + 1)`, where you care about j's range of values. These two are easy to mix up.
```
