# test-06 Chapter 6 · Check, publish, maintain

> Chapter 6 · Check, publish, maintain — the end-of-chapter check.


```quiz
type: choice
q: What does a warning in the review report mean?
options:
- You can publish, but it usually points at a real problem
- You must fix it before publishing
- It is a false positive from the system
- It affects nothing
answer: 0
```

```quiz
type: choice
multi: true
q: Which markers are needed for the bot to list your book? (three answers)
options:
- Repo name starting with al-book-
- topic: al-book
- format exactly al-book in albook.json
- The author name in README.md
answer: 0, 1, 2
```

```quiz
type: choice
q: Just published — how soon can you see your book?
options:
- Immediately if signed in, because the library searches live
- You must wait 6 hours
- 24 hours
- One week
answer: 0
```

```quiz
type: fill
q: The error says: in cases, "1 2 -> 3" args must be comma-separated. What should the line become?
answer: 1, 2 -> 3
placeholder: the whole line
hint: Add a comma between the arguments
explain: Arguments split on commas only, so write 1, 2 -> 3.
```

```quiz
type: choice
q: Where does the content readers see come from?
options:
- The author's GitHub repo, read live
- A copy stored on the main site
- A fixed CDN cache
- A file downloaded locally
answer: 0
```

```quiz
type: function
q: Write fmt_report(errors, warnings) returning a one-line summary like "3 errors 2 warnings"
func: fmt_report
starter: |
  def fmt_report(errors, warnings):
      return ""
cases: |
  ["a", "b", "c"], ["x", "y"] -> "3 errors 2 warnings"
  [], [] -> "0 errors 0 warnings"
  ["a"], [] -> "1 errors 0 warnings"
hint: Use len() of both lists in an f-string
explain: f"{len(errors)} errors {len(warnings)} warnings"
```

```quiz
type: function
q: Write is_valid_format(s) — True only if s is exactly al-book, with no surrounding spaces allowed
func: is_valid_format
starter: |
  def is_valid_format(s):
      return False
cases: |
  "al-book" -> True
  "albook" -> False
  "AL-BOOK" -> False
  "al-book " -> False
hint: Do not strip; compare directly
explain: s == "al-book". If you strip first, "al-book " would wrongly pass.
```

```quiz
type: project
q: Run the whole flow end to end: create a new book, write three lessons, run the review report until there are zero errors, publish it as a public repo, confirm you can find it in the library, change a lesson and republish, then confirm readers see the new version.
starter: |
  # The full flow:
  #
  # 1. Developer platform, new book
  # 2. Write a few lessons (use the snippet library)
  # 3. Review report, fix to zero errors
  # 4. Publish, choosing public
  # 5. Search the library
  # 6. Change one lesson and republish
checklist: |
  - Review report shows zero errors
  - Published, and the repo is public
  - The repo carries topic: al-book
  - Your book turns up in the library
  - After republishing, readers see the new version
  - You tried flipping visibility to private and back
```
