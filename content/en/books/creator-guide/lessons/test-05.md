# test-05 Chapter 5 · Special types and beyond

> Chapter 5 · Special types and beyond — the end-of-chapter check.


```quiz
type: choice
q: When should you use a local question?
options:
- When the browser sandbox cannot run it, e.g. opening a window
- When the question is hard
- When you want the reader to think
- When the code is long
answer: 0
```

```quiz
type: choice
q: How does project differ from local?
options:
- project ships starter code and usually runs in the browser; local must run locally
- project is harder
- local has a checklist and project does not
- They are identical
answer: 0
```

```quiz
type: choice
multi: true
q: What makes a checklist good? (two answers)
options:
- Every item is something the reader can answer yes or no
- One item per feature
- The more abstract the better
- The more items the better
answer: 0, 1
```

```quiz
type: fill
q: To write a novel with no questions, what should kind be set to?
answer: novel
placeholder: one English word
hint: What a novel is
explain: kind: novel means no question counts are enforced.
```

```quiz
type: choice
q: A novel includes a choice question with an out-of-range answer. What happens?
options:
- It still errors
- Nothing, novels are not checked
- Just a warning
- Auto-corrected
answer: 0
```

```quiz
type: function
q: Write needs_questions(kind) — True only when the kind requires questions (textbook only)
func: needs_questions
starter: |
  def needs_questions(kind):
      return True
cases: |
  "textbook" -> True
  "novel" -> False
  "notes" -> False
  "" -> True
hint: The default value is textbook too
explain: An empty string means textbook as well, so it must return True.
```

```quiz
type: function
q: Write kind_label(kind) returning a label: textbook to "Textbook", novel to "Novel", notes to "Notes", anything else to "Other"
func: kind_label
starter: |
  def kind_label(kind):
      return ""
cases: |
  "textbook" -> "Textbook"
  "novel" -> "Novel"
  "notes" -> "Notes"
  "banana" -> "Other"
hint: Use a dict with a default
explain: Look it up in a dict and fall back to "Other" — the same idea as treating unknown kinds leniently.
```

```quiz
type: project
q: Do two things that will make future writing faster: save the question shape you use most as a custom snippet (select the quiz block, then Snippets, then save), then insert it into another lesson and confirm it grades. Separately, if you plan a non-textbook, set kind to novel and confirm that "no questions at all" is no longer an error.
starter: |
  # Two tasks:
  #
  # 1. Save a custom snippet and reuse it
  # 2. Try kind: novel and its relaxed validation
checklist: |
  - A custom snippet is saved
  - It inserted into another lesson and grades correctly
  - Tried kind: novel, no error for having no questions
  - The snippet comes back on another device or after clearing the cache
```
