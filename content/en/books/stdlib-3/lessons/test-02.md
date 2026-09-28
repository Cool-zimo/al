# Chapter 2 · Advanced Regex · Big Quiz

> 8 questions. This chapter is about "how to write regex better, faster, and more appropriately"—compiling and flags, real-world patterns, performance, boundaries, and the log parser where it all lands.
> **You must get all of them right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which pattern is most likely to cause catastrophic backtracking?
options:
- r'^(\w+)$'
- r'^(a+)+b$'
- r'^https?://\w+$'
- r'^\d{4}-\d{2}-\d{2}$'
answer: 1
explain: (a+)+ has an inner quantifier wrapping an outer quantifier; faced with "almost matching" input it backtracks exponentially. The other three have no nested quantifiers and scan linearly.
```

```quiz
type: choice
q: To extract every image's src URL from an HTML page, the most correct approach is?
options:
- use re.findall(r'src="(.*?)"', html)
- use html.parser or BeautifulSoup, then read the src attribute
- hand-split with str.split('src=')
- use json.loads
answer: 1
explain: HTML has nested structure; attribute order, quotes, and newlines can all vary, so regex can't handle it reliably. A dedicated parser builds a DOM tree first, then fetches values—the most robust approach. json.loads is for JSON, unrelated to HTML.
```

```quiz
type: choice
q: Which statement about re.compile and flags is correct?
options:
- an object from re.compile can no longer accept flags
- IGNORECASE makes . match newlines
- MULTILINE makes ^ and $ match the start/end of every line
- DOTALL makes \d match all characters
answer: 2
explain: MULTILINE (re.M) makes ^ and $ apply per-line. IGNORECASE handles case; DOTALL handles dot-vs-newline; after compiling you can still pass flags to the object's methods, or pass them in at compile time.
```

```quiz
type: choice
q: What is the correct attitude toward validating email with regex?
options:
- write a perfect regex that covers every RFC rule
- regex only validates format; real existence must be confirmed by business means like sending a verification email
- regex can confirm whether an email really exists
- emails don't need validation; just store them
answer: 1
explain: Regex can only check "does it look like the format"; it can't confirm the email actually exists. Chasing a perfect regex gets harder to maintain and there are always edge cases. Real existence requires business measures (sending a verification email, checking MX records).
```

```quiz
type: choice
q: When parsing logs with regex, how should you handle a line that doesn't match the format (e.g. a stack trace or blank line)?
options:
- raise an exception and stop parsing
- use try-except to swallow the whole block
- use if m to skip lines that don't match
- append the whole line as a message onto the previous record
answer: 2
explain: Real logs inevitably mix in malformed lines. Guarding with if m and skipping is the most robust, most general approach. Raising would crash the parser on dirty data; blindly concatenating stack traces pollutes the message content.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write a function extract_dates that takes a string and extracts all dates in "YYYY-MM-DD" or "YYYY/MM/DD" format, returning a list of date strings.
func: extract_dates
starter: |
  import re

  def extract_dates(text):
      return []
cases: |
  "today 2026-09-28 tomorrow 2026/10/01" -> ["2026-09-28", "2026/10/01"]
  "no date info" -> []
  "dates 1999-12-31 and 2000-01-01" -> ["1999-12-31", "2000-01-01"]
hint: Pattern r'\d{4}[-/]\d{1,2}[-/]\d{1,2}', then just findall.
explain: One findall pass to collect every date string matching the separator format—a high-frequency log-cleaning operation.
```

```quiz
type: function
q: Write a function count_levels that takes a multi-line log string (each line in "date time level message" format) and returns a dict counting how many times each level appears. Skip lines that don't match.
func: count_levels
starter: |
  import re
  from collections import Counter

  def count_levels(log_text):
      return {}
cases: |
  "2026-09-28 10:00:00 INFO a\n2026-09-28 10:01:00 ERROR b\n2026-09-28 10:02:00 INFO c" -> {"INFO": 2, "ERROR": 1}
  "" -> {}
  "not a log\nat all\n2026-09-28 10:00:00 WARN disk full" -> {"WARN": 1}
hint: Compile a named-group pattern, match line by line, collect levels into a list, then Counter(levels).
explain: This distills the whole chapter: regex for splitting fields + Counter for statistics. Real and commonly useful.
```

## Part 3 · Mini-Project

```quiz
type: project
q: Write a "multi-format log analyzer." Requirements: it must parse two log-line formats—Format A is "YYYY-MM-DD HH:MM:SS LEVEL message", Format B is "LEVEL | YYYY/MM/DD | message" (note the different separators and field order). Normalize the parsed results into a single list of [{"date":..., "time":..., "level":..., "msg":...}]; count how many of each level; additionally pick out every line whose message contains "failed" or "error". Finally, print the statistics and the alert list.
checklist:
- recognizes and parses at least two different log-line formats
- normalizes results into one consistent dict structure
- uses Counter to count log levels
- can filter for lines whose messages contain "failed" or "error"
- tolerates lines that don't match any format (skips or marks them) without crashing
- has at least 5 lines of mixed-format test logs
```
