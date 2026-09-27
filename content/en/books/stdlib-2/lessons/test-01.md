# Chapter 1 Test · Time Basics

> 10 questions covering why time is hard to handle, the `date`/`time`/`datetime` trio, why `timedelta` does not support months, `strftime`/`strptime` placeholders and `%` escaping, and timestamps and the UTC trap.

## Part 1 · Multiple choice

```quiz
type: choice
q: Why is it so easy to get time data wrong? (The most fundamental reason.)
code: |
  a. Because Python's time module has bugs
  b. Because the rules are complex: time zones, DST, leap years, and variable month lengths
  c. Because computers cannot store large integers
  d. Because the datetime module is a third-party library
options:
- a
- b
- c
- d
answer: 1
explain: Time's complexity comes from the real world: DST jumps, leap-year Februaries with 29 days, and time-zone offsets that change. Python's time module is well designed; the problem is not in the library itself.
```

```quiz
type: choice
q: Which object contains both a date and a time?
code: |
  a. datetime.date
  b. datetime.time
  c. datetime.datetime
  d. All of the above
options:
- a
- b
- c
- d
answer: 2
explain: date holds only year/month/day, time holds only hour/minute/second/microsecond, and datetime holds both a date and a time.
```

```quiz
type: choice
q: What does the following code print?
code: |
  from datetime import timedelta
  d = timedelta(days=1, hours=12)
  print(d.total_seconds())
options:
- a. 86400
- b. 129600
- c. 36
- d. It raises an error
answer: 1
explain: 1 day = 86400 seconds, and 12 hours = 43200 seconds, for a total of 129600 seconds.
```

```quiz
type: choice
q: Which statement about escaping `%` in strftime is correct?
code: |
  a. `%` needs no escaping; just write it directly
  b. To output a literal `%`, you must write `%%`
  c. `%` can only appear at the end of a format string
  d. `%` is ignored automatically
options:
- a
- b
- c
- d
answer: 1
explain: In strftime, `%%` represents a literal percent sign. For example "Progress: %d%%" prints as "Progress: 5%".
```

```quiz
type: choice
q: Which statement about the UTC trap is correct?
code: |
  a. datetime.now() always returns UTC time
  b. datetime.utcnow() returns a naive datetime (no time zone)
  c. The timestamp() method is only valid in the UTC zone
  d. fromtimestamp() always returns UTC time
options:
- a
- b
- c
- d
answer: 1
explain: datetime.utcnow() returns a naive datetime (with no tzinfo), which can mislead you into thinking it "has a zone." Python 3.12+ deprecates utcnow() in favour of datetime.now(timezone.utc).
```

## Part 2 · Hands-on

```quiz
type: function
q: Write a function days_between that takes two date strings in the format "YYYY-MM-DD" and returns the absolute number of days between them as an integer. Pure computation only, no file system access.
func: days_between
starter: |
  from datetime import datetime

  def days_between(date_str1, date_str2):
      return 0
cases: |
  "2024-01-01","2024-01-10" -> 9
  "2024-12-31","2024-01-01" -> 365
  "2024-02-28","2024-03-01" -> 2
hint: Parse with datetime.strptime(s, "%Y-%m-%d"), subtract the dates to get a timedelta, and read .days.
explain: After parsing with strptime, take .date() for the date portion, subtract to get a timedelta, and .days gives the absolute value.
```

```quiz
type: code
q: Write a function format_duration that takes a number of seconds (int) and returns a human-readable duration string. Rules: under 60 seconds return "X seconds"; under 3600 return "X minutes Y seconds"; otherwise return "X hours Y minutes Z seconds".
starter: |
  def format_duration(seconds):
      return ""
tests:
- assert format_duration(45) == "45 seconds"
- assert format_duration(125) == "2 minutes 5 seconds"
- assert format_duration(3725) == "1 hours 2 minutes 5 seconds"
- assert format_duration(3600) == "1 hours 0 minutes 0 seconds"
hint: Use // and % to extract hours, minutes, and seconds in turn.
explain: hours = s // 3600, remainder = s % 3600, minutes = remainder // 60, secs = remainder % 60.
```

## Part 3 · Mini-project

```quiz
type: function
q: Implement a simple "event countdown" function make_countdown. It takes an event name (string) and a target date string ("YYYY-MM-DD"), and returns a formatted string. Rules: if the target date has already passed, return "{name} has expired"; otherwise return "{name} in N days" where N is the day difference between the target and today, obtained via date.today().
func: make_countdown
starter: |
  from datetime import datetime, date

  def make_countdown(event_name, target_str):
      return ""
cases: |
  "Project deadline","2030-01-01" -> "Project deadline in N days"
  "Birthday","2000-01-01" -> "Birthday has expired"
hint: Compare date.today() with datetime.strptime(target_str, "%Y-%m-%d").date().
explain: If the target is earlier than today it has expired; otherwise compute the day difference.
```
