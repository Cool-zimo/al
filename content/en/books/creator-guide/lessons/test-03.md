# test-03 Chapter 3 · Questions I: basic types

> Chapter 3 · Questions I: basic types — the end-of-chapter check.


```quiz
type: choice
q: A question has four options and the last one is correct. What is answer?
options:
- 3
- 4
- 1
- 0
answer: 0
```

```quiz
type: choice
q: To put code in the question text, what should you do?
options:
- Use the code: multi-line field
- Type three backticks directly
- Use inline code
- Put it in hint
answer: 0
```

```quiz
type: choice
multi: true
q: What does a multiple-choice question need? (three answers)
options:
- multi: true
- answer with comma-separated indices
- at least two options
- a statement in the question text of how many are correct
answer: 0, 1, 3
```

```quiz
type: fill
q: Which symbol separates several accepted answers in a fill-in question?
answer: '|'
placeholder: one symbol
hint: The pipe character
explain: Accepted answers are separated with a vertical bar, e.g. answer: len|length.
```

```quiz
type: choice
q: Does fill-in grading care about case?
options:
- No, and it trims surrounding spaces too
- Yes, strictly
- It only trims spaces
- It only ignores case
answer: 0
```

```quiz
type: function
q: Write check_answer(q) — True if the choice question is valid (at least two options and answer inside range)
func: check_answer
starter: |
  def check_answer(q):
      return False
cases: |
  {"options": ["a", "b"], "answer": "0"} -> True
  {"options": ["a", "b"], "answer": "5"} -> False
  {"options": ["a"], "answer": "0"} -> False
hint: Check the option count first, then convert answer to int and compare
explain: Fewer than 2 options is False; answer must be within [0, len(options)).
```

```quiz
type: function
q: Write is_multi(q) — True if the question is multiple choice (the multi field equals true, case-insensitive)
func: is_multi
starter: |
  def is_multi(q):
      return False
cases: |
  {"multi": "true"} -> True
  {"multi": "True"} -> True
  {"multi": "false"} -> False
  {} -> False
hint: Take the value out, lowercase it, compare
explain: str(q.get("multi", "")).lower() == "true"
```

```quiz
type: project
q: Write three questions for a lesson you are working on: one in-class (no exam) and two section quiz (exam: true), using at least two different question types. Confirm zero errors, then try answering them yourself to make sure they actually grade.
starter: |
  # Hint: insert snippets from the library and edit them
  #
  # in-class exercise goes in the body (no exam)
  # section quiz goes at the end (exam: true)
checklist: |
  - At least two different question types used
  - Exactly 2 questions carry exam: true
  - Distractors are plausible, not filler
  - The validator reports zero errors
  - You answered them yourself and they graded correctly
```
