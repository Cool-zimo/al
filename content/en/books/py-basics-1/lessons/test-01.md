# Chapter 1 · Mastery Test

> Five lessons down. Here's the check — three question types, testing whether you **remember**, whether you **can use it**, and whether you **can build something**.
>
> Don't chase a perfect first pass. **Questions you miss come back automatically in 1 day** (the Ebbinghaus curve) — you'll get another shot then.

---

## Part 1 · Multiple Choice

Checking whether the concepts actually stuck.

```quiz
type: choice
q: What does this code output?
  print("apple", "banana", sep="-")
options:
- apple-banana
- apple banana
- apple-banana-
- It raises an error
answer: 0
explain: The sep argument controls what goes between multiple items. Here it's "-", so you get apple-banana. Without sep, the default is a space.
```

```quiz
type: choice
q: Why does print(Hello) error while print("Hello") doesn't?
options:
- Because Chinese cannot be printed
- Without quotes, Python treats Hello as a variable name and goes looking for it, then raises NameError
- Because the print function requires quotes
- Because quotes make the text display more clearly
answer: 1
explain: Quotes draw a boundary: inside is data (plain text), outside is code (commands or names). Without them Python assumes you mean a variable called Hello.
```

```quiz
type: choice
q: Which of these is a "good comment"?
options:
- print("Hello")  # print "Hello"
- # Must be 0.1 here — the upstream API only accepts floats
- Add an explanation after every single line of code
- Delete code you don't want to run, rather than commenting it out
answer: 1
explain: Code already says what it does; comments should supply the "why" that code cannot express. Restating code is noise, and deleting is irreversible — commenting out is better for debugging.
```

```quiz
type: choice
q: Faced with an error message, what's the most efficient reading order?
options:
- Top to bottom, not skipping a word
- Last line first (the error type), then line N (the location)
- Only look at the red text
- Paste it into a translator and translate it all
answer: 1
explain: The last line tells you what went wrong; line N tells you where. Combined, they locate 90% of errors within 30 seconds.
```

```quiz
type: choice
q: The most likely reason print（"Hello"） errors is:
options:
- print is misspelled
- Full-width Chinese brackets （ ） were used instead of ASCII ( )
- The quotes are wrong
- Python cannot print Chinese
answer: 1
explain: Full-width and ASCII brackets look nearly identical, but Python only accepts the ASCII ones. Keeping your IME in English mode while coding avoids this trap almost everyone falls into.
```

---

## Part 2 · Algorithm

Not just "can use it" — "understands it". Both of these are **machine-graded**: one checks your program's output, the other actually calls your function and compares return values.

```quiz
type: function
q: Complete make_card(): join name and hobby into one line of card text, and return it
func: make_card
starter: |
  def make_card(name, hobby):
      # Join name and hobby into the format "Name: xxx · Hobby: xxx"
      # Key point: return the result — don't just print it
      return ""
cases: |
  "Alex", "coding" -> "Name: Alex · Hobby: coding"
  "Sam", "climbing" -> "Name: Sam · Hobby: climbing"
  "Jo", "drawing" -> "Name: Jo · Hobby: drawing"
hint: Join the pieces with +: return "Name: " + name + " · Hobby: " + hobby. Don't wrap the whole expression in extra quotes.
explain: This is the one question that actually calls your function — the page runs make_card("Alex", "coding") and compares the return value case by case. The key to a function is return: print shows something on screen, return hands a result back to the caller. Completely different things.
```

```quiz
type: code
q: Find the 3 errors in this code and fix it so it prints 4 lines
starter: |
  # This program has 3 errors — find them one by one
  print("Name: Alex"
  print(Hobby: coding)
  # print("City: London"
  print("Motto: a little better every day")
tests:
- assert "Name: Alex" in __out
- assert "Hobby: coding" in __out
- assert "City: London" in __out
hint: The three errors: line 2 is missing a closing bracket, line 3 has "Hobby: coding" without quotes, line 4 is commented out entirely.
explain: These three map exactly onto this chapter's classic traps: unmatched bracket (SyntaxError), string without quotes (NameError), and a line commented out (it never runs). Spotting all three first try means you genuinely absorbed the chapter.
```

---

## Part 3 · Mini Project

Turn this chapter's material into something you'd be happy to show someone.

```quiz
type: project
q: Build a "personal business card" — print a card with a border, using print
checklist:
- At least 5 lines of output (border included)
- Used characters like ─ │ ╭ ╮ ╰ ╯ or * = - to draw a border, so the card has a shape
- The content is really you (nickname, what you're learning, a tagline)
- Every line starts at the far left with no stray indentation (otherwise IndentationError)
- At least 1 comment explaining your layout choice
- Clicked "Run" and confirmed it really produces the shape you wanted
hint: Sketch the card on paper first, then "draw" it line by line with print. The border is just a string — don't overthink it.
explain: This project tests the full loop of "translating an idea into code" — picture the finished result first (in your head or on paper), then break it into lines of output. That's how programming actually works in practice.
```

### Reference answer (look after you've finished)

```python
# Using equals signs for the border — simple and tidy
print("========================")
print("  Nickname: Alex")
print("  Learning: Python")
print("  Motto: a little better every day")
print("========================")
```

Output:

```
========================
  Nickname: Alex
  Learning: Python
  Motto: a little better every day
========================
```

---

## What you learned in this chapter

- ✅ The essence of programming: breaking a task into **unambiguous, ordered steps**
- ✅ Python is **interpreted** — it needs an interpreter to run
- ✅ Using `print`: `sep`, `end`, the `\n` escape
- ✅ Quotes **draw a boundary**: data inside, code outside
- ✅ Comments explain **why**, not what
- ✅ Read errors: **last line first**, then the **line number**

**Next chapter** we start on "data" — the raw material programs work with: numbers, strings, booleans. That's where it begins to feel like real computation.
