# test-02 Chapter 2 · Writing lessons

> Chapter 2 · Writing lessons — the end-of-chapter check.


```quiz
type: choice
q: Which code block can the reader run?
options:
- One tagged python
- One with no language tag
- Code inside a blockquote
- Code indented four spaces
answer: 0
```

```quiz
type: choice
q: How does the site decide a lesson is finished?
options:
- Every question marked exam: true is correct
- The in-class exercise was attempted
- The lesson was scrolled to the bottom
- The next lesson was clicked
answer: 0
```

```quiz
type: choice
multi: true
q: What belongs at the top of a lesson? (two answers)
options:
- A # heading on line one
- A > intro on line two
- A ## subheading on line one
- A table of contents
answer: 0, 1
```

```quiz
type: fill
q: Roughly how many lines should a lesson body be?
answer: 60~150|60-150|60 to 150
placeholder: a range
hint: Too short teaches nothing; too long nobody finishes
explain: 60 to 150 lines is comfortable; under 60 warns about placeholder content.
```

```quiz
type: choice
q: How many questions should carry exam: true in a lesson?
options:
- 2
- 1
- 3
- As many as possible
answer: 0
```

```quiz
type: function
q: Write split_lesson(md) returning the list of section headings from lines starting with "## " (without the hashes or extra spaces)
func: split_lesson
starter: |
  def split_lesson(md):
      return []
cases: |
  "# T\n\n> intro\n\n## A\n\nx\n\n## B\n\ny\n" -> ["A", "B"]
  "# T\n\n> i\n" -> []
hint: Iterate the lines, take everything after the hashes and strip it
explain: [l[3:].strip() for l in md.split("\n") if l.startswith("## ")]
```

```quiz
type: function
q: Write first_title(md) returning the title of the first line that starts with "# " (hash plus space), without the hashes or surrounding spaces; return "" if there is none
func: first_title
starter: |
  def first_title(md):
      return ""
cases: |
  "# Slicing\n\n> intro\n" -> "Slicing"
  "## Subheading\n" -> ""
  "" -> ""
  "#  extra spaces  \n" -> "extra spaces"
hint: Look for startswith("# "), then take everything after it
explain: Use startswith("# ") so that ## subheadings are not mistaken for the title. Take [2:] and strip.
```

```quiz
type: function
q: Write count_sections(md) returning how many lines start with "## " (a level-2 heading)
func: count_sections
starter: |
  def count_sections(md):
      return 0
cases: |
  "# T\n\n## A\n\n## B\n" -> 2
  "# T\n" -> 0
  "" -> 0
hint: Count lines by prefix, do not split on "##"
explain: sum(1 for l in md.split("\n") if l.startswith("## ")).
```

```quiz
type: project
q: Write one complete lesson: a specific title, an intro that says what it solves, two to four ## sections, a runnable python block plus its output, one in-class exercise and two exam questions. Confirm zero errors with the validator.
starter: |
  # Write your lesson here
  #
  # Order matters:
  #   line one   # title
  #   blank line
  #   > intro
  #   blank line
  #   body
checklist: |
  - Title names one specific problem, not "Part 1"
  - The intro tells you whether the lesson is worth reading
  - Two to four ## sections
  - The code block runs, and output sits in a separate untagged block
  - Exactly 2 questions carry exam: true
  - The validator reports zero errors
```
