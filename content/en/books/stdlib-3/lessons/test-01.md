# Chapter 1 · Regular Expressions · Big Quiz

> 8 questions. This chapter is about "finding things in text by pattern"—how to write patterns, how to match, how to replace, and how to split.
> **You must get all of them right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: To find ALL phone numbers matching "starts with 1 + 10 digits" in a text, which function should you use?
code: |
  import re
  text = "Phone 13812345678 and 13987654321"
options:
- re.search
- re.match
- re.findall
- re.split
answer: 2
explain: search/match return only the first match; findall returns a list of all matches; split cuts by pattern. To get "all", only findall works.
```

```quiz
type: choice
q: Which of the following is a valid raw-string form that correctly hands a backslash to the regex engine unchanged?
code: |
  a = '\d+'
  b = r'\d+'
  c = r"\\d+"
  d = "\\d+"
options:
- a
- b
- c
- d
answer: 1
explain: r'\d+' is a raw string—the two characters "backslash + d" go into the regex as-is. a is a normal string where Python interprets the backslash; c and d each carry an extra backslash, so the regex would see two backslashes.
```

```quiz
type: choice
q: For the string 'aaaab', what does the regex 'a.*b' match?
options:
- 'aab'
- 'aaab'
- 'aaaab'
- no match
answer: 2
explain: .* is greedy by default, so it eats as many a's as possible, all the way to the last b—the whole 'aaaab'. Written as a.*?b it would only match 'aaab'.
```

```quiz
type: choice
q: What does re.findall(r'(\d+)-(\d+)', 'range 100-200 and 300-400') return?
options:
- ['100-200', '300-400']
- [('100', '200'), ('300', '400')]
- ['100', '200', '300', '400']
- [('100-200',), ('300-400',)]
answer: 1
explain: When findall encounters capturing groups, it returns only the group contents. Two groups means a list of 2-tuples. For the whole match, remove the parentheses or wrap the whole thing in one more pair.
```

```quiz
type: choice
q: What is the correct result of re.sub(r'(\d+)', r'\1\1', '12 34')?
options:
- '12 34'
- '1122 3344'
- '1212 3434'
- error
answer: 2
explain: The replacement \1 refers to the entire matched content (each run of digits). Each number is duplicated in place: '12' becomes '1212', '34' becomes '3434'.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write a function extract_amounts that takes a string and returns a list of all monetary amounts (digits, possibly with decimals) followed by "pounds", e.g. "apples £5 bananas £3.5" returns [5.0, 3.5].
func: extract_amounts
starter: |
  import re

  def extract_amounts(text):
      return []
cases: |
  "apples £5 bananas £3.5" -> [5.0, 3.5]
  "no prices here" -> []
  "watermelon £12" -> [12.0]
hint: Use findall with pattern r'\d+\.?\d*', then convert results to float. Return an empty list when there are no matches.
explain: Extraction + type conversion is the most common regex combo: first pull out strings by pattern, then cast to the number type the business needs.
```

```quiz
type: function
q: Write a function mask_phone that takes a string and replaces the middle 4 digits of every 11-digit phone number with **** (keeping the first 3 and last 4 digits).
func: mask_phone
starter: |
  import re

  def mask_phone(text):
      return text
cases: |
  "phone 13812345678 and 13987654321" -> "phone 138****5678 and 139****4321"
  "no phone" -> "no phone"
  "phone 0571-88123456" -> "phone 0571-88123456"
hint: Pattern r'(1[3-9]\d{3})\d{4}(\d{4})', replacement r'\1****\2'. Remember the r prefix on the replacement.
explain: Anonymization is the classic real-world use of sub + group references; the r prefix on the replacement is the key trap.
```

## Part 3 · Mini-Project

```quiz
type: project
q: Write a simple "sensitive-word filter" module. Requirements: define a list of at least 3 sensitive words (e.g. "spam", "scam", "fake"); then write a function filter_text(text) that replaces every sensitive word in the text with a same-length string of asterisks (e.g. "spam" -> "****"), and returns the filtered text and a count of how many sensitive words were replaced. Print a few test cases to verify.
checklist:
- defines at least 3 sensitive words
- uses regex (re.sub) for the replacement, not a pile of if-statements
- replaces with asterisks of the same visual length as the original
- returns the number of replacements (count of replaced sensitive words)
- works correctly on multiple test sentences
```
