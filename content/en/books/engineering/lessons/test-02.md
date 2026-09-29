# Chapter 2 · Code Quality · Final Test

> 8 questions. This chapter asks: how do you write code that others can read, modify, and keep correct?
> **You must answer all correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: For a boolean variable, which name best follows convention?
options:
- enabled_flag = True
- is_enabled = True
- e = True
- enable = True
answer: 1
explain: The is_ prefix expresses "whether or not" directly and reads like natural language. enabled_flag's _flag suffix is redundant; the single letter e carries no meaning; enable reads more like a verb or action.
```

```quiz
type: choice
q: When should a function be split into several?
options:
- Any function longer than 10 lines must be split
- When the function description contains "and" or "then", or the function mixes control-flow detail with high-level flow calls
- Any function with comments should be split
- Any function with more than one parameter should be split
answer: 1
explain: The criterion is whether the abstraction level is uniform, not a hard line count. Mixing flow with control-flow detail signals tangled levels; too many parameters is a separate concern (consider bundling them into an object).
```

```quiz
type: choice
q: Which statement about comments and docstrings is correct?
options:
- A docstring is a kind of ordinary comment and runs at execution time
- A docstring is a string wrapped in """ that help() and IDEs can read; a comment starts with # and is invisible at runtime
- Comments should describe in detail what every line of code does
- Comments need not be updated when code changes because they are only a reference
answer: 1
explain: A docstring is a special string literal placed at the start of a module/class/function and readable by help(). Comments explain why rather than what, and must stay in sync with the code.
```

```quiz
type: choice
q: Which statement about black and ruff is correct?
options:
- black only does static checks and never changes code; ruff only formats
- black mainly formats (rewriting code); ruff both formats and performs static checks, and is faster
- ruff is written in Python, so it is slow but accurate
- black and ruff are completely identical, so either is fine
answer: 1
explain: black's core is automatic formatting (rewriting code); ruff is a modern Rust-written tool with both formatting and linting capabilities, far faster than its Python-written counterparts.
```

```quiz
type: choice
q: Which statement about exception handling is correct?
options:
- You should swallow every exception with except: pass so the program never crashes
- assert and raise are completely interchangeable
- Catch only where you can handle the exception; never swallow with a bare except; use if + raise for parameter validation
- Custom exceptions are unnecessary; Exception is enough for everything
answer: 2
explain: Catch exceptions only when you can act on them; a bare except swallows KeyboardInterrupt and hides problems; assert is removed under -O and must not be used for parameter validation; custom exceptions let the caller distinguish error types precisely.
```

## Part 2 · Hands-on Exercises

```quiz
type: function
q: Implement `refactor_name(old_name)`, which suggests a renaming for a variable. Rules: if old_name is a single character in the set {"l", "O", "I"}, return "BAD_NAME" (these characters are easily confused with digits); if old_name is a constant in all uppercase letters, return it unchanged (valid constant naming); if old_name is all lowercase letters, return it unchanged; otherwise return "OK".
func: refactor_name
starter: |
  def refactor_name(old_name):
      bad = {"l", "O", "I"}
      # Fill in here
      return "OK"
cases: |
  ("l") -> "BAD_NAME"
  ("O") -> "BAD_NAME"
  ("MAX_RETRY") -> "MAX_RETRY"
  ("user_name") -> "user_name"
  ("i") -> "OK"
hint: First test whether it is a single character in the bad set; then test whether it is all uppercase letters (and length > 1); then test whether it is all lowercase letters; anything else returns OK.
explain: This is the simplified logic of a naming check, used by static analysis to flag easily confused single-character names.
```

```quiz
type: function
q: Implement `analyze_function_body(lines)`, which analyses a function body (a list of strings, one statement per line). Return a tuple (is_pure, side_effects): is_pure is True exactly when the body contains no calls to "print(", "db.", "file.", or "smtp." (i.e. no I/O side effects); side_effects is the list of detected side-effect types (in order of appearance, deduplicated), where the types are "print", "db", "file", and "smtp".
func: analyze_function_body
starter: |
  def analyze_function_body(lines):
      effects = []
      # Fill in here
      is_pure = len(effects) == 0
      return is_pure, effects
cases: |
  (["x = a + b", "return x * 2"]) -> (True, [])
  (["print('hi')", "db.save(x)", "smtp.send('ok')"]) -> (False, ["print", "db", "smtp"])
  (["file.write('x')", "y = 1"]) -> (False, ["file"])
hint: Check each line for the substrings "print(", "db.", "file.", and "smtp.", record the type in order, and deduplicate.
explain: Static analysis often needs to determine whether a function is pure and what side effects it has; this is the simplified detection logic.
```

## Part 3 · Mini Project

```quiz
type: project
q: In your project, pick one "large function" (over 50 lines, or doing three or more things) and refactor it according to the rules in this chapter. The acceptance checklist follows.
checklist:
- Find the places where "and" and "then" appear in the function, and split it into 2-3 smaller functions by responsibility
- Have each function operate at one level of abstraction (the top-level function reads like a flow checklist)
- Add the is_/has_/can_ prefix consistently to boolean variables
- Write a docstring for the core extracted function, including Args, Returns, and Raises
- Configure the editor to format on save (black or ruff), then run a formatter over the whole file once
- Scan the file with ruff or flake8 and confirm there are no F401 (unused import) or E501 (line too long) issues
- Split the changes into 2-3 commits, each doing exactly one thing, with commit messages in Conventional Commits format
starter: |
  # Reference flow
  # 1. Save the file in the editor and observe whether it auto-formats
  # 2. Run ruff
  ruff check your_file.py
  # 3. Split the function by responsibility, committing once per split
  git add -p
  git commit -m "refactor(xxx): extract the XXX function"
```
