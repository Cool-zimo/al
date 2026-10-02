# test-01 Chapter 1 · What a book is made of

> Chapter 1 · What a book is made of — the end-of-chapter check.


```quiz
type: choice
q: What is the strongest signal that a repo is an AnyLearn book?
options:
- albook.json at the root with format exactly al-book
- The repo name starts with al-book-
- It has a README.md
- It has a content folder
answer: 0
```

```quiz
type: choice
q: Where must a lesson file live?
options:
- content/en/lessons/01.md
- lessons/01.md
- content/01.md
- en/01.md
answer: 0
```

```quiz
type: choice
multi: true
q: Which of these are required fields in albook.json? (four answers)
options:
- id
- title
- tags
- langs
- author
answer: 0, 1, 3, 4
```

```quiz
type: choice
q: Which id is valid?
options:
- my-first-book
- My_First_Book
- -mybook
- my book
answer: 0
```

```quiz
type: fill
q: What should the chapter 3 test file be named?
answer: test-03.md
placeholder: include the .md suffix
hint: test- plus a two-digit chapter number
explain: Chapter tests are always test-NN.md, zero-padded to two digits.
```

```quiz
type: function
q: Write is_legal_id(s) — True if s is a valid book id (only lowercase letters, digits and hyphens, starting with a letter or digit)
func: is_legal_id
starter: |
  def is_legal_id(s):
      return False
cases: |
  "my-book" -> True
  "MyBook" -> False
  "-mybook" -> False
  "my_book" -> False
  "book2" -> True
hint: Check the first character, then check that every character is allowed
explain: The first character must be a letter or digit; after that only lowercase letters, digits and hyphens are allowed.
```

```quiz
type: function
q: Write lesson_path(lang, n) returning the relative path of lesson n, zero-padded to two digits
func: lesson_path
starter: |
  def lesson_path(lang, n):
      return ""
cases: |
  "en", 1 -> "content/en/lessons/01.md"
  "zh", 12 -> "content/zh/lessons/12.md"
  "en", 30 -> "content/en/lessons/30.md"
hint: Use an f-string with :02d
explain: f"content/{lang}/lessons/{n:02d}.md"
```

```quiz
type: project
q: Build the smallest possible book: albook.json with all nine required fields, a README.md, content/en/toc.json with one chapter of three lessons, and three lesson files. Then run the validator and confirm zero errors.
starter: |
  # Create these files:
  #
  # albook.json
  # README.md
  # content/en/toc.json
  # content/en/lessons/01.md
  # content/en/lessons/02.md
  # content/en/lessons/03.md
checklist: |
  - format in albook.json is exactly al-book
  - All nine required fields are present
  - The three lessons declared in toc all exist as files
  - Every lesson starts with a # heading
  - The validator reports zero errors
```
