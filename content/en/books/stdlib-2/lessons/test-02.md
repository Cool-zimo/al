# Chapter 2 Test · Time, Advanced

> 10 questions covering naive vs aware and why they cannot be compared, zoneinfo, perf_counter vs time.time, the last day of the month and calendar, multi-format parsing, and countdown utilities.

## Part 1 · Multiple choice

```quiz
type: choice
q: Which statement about naive and aware datetimes is correct?
code: |
  a. A naive datetime and an aware datetime can be compared directly
  b. A naive datetime has no tzinfo; an aware datetime has a tzinfo
  c. An aware datetime cannot call astimezone()
  d. Two aware datetimes in different zones cannot be compared
options:
- a
- b
- c
- d
answer: 1
explain: naive means no tzinfo; aware means a tzinfo is present. Python forbids comparing naive with aware (it raises TypeError), but two aware datetimes in different zones can be compared (they are converted automatically).
```

```quiz
type: choice
q: Which approach is best for high-precision timing (measuring how long code takes to run)?
code: |
  a. time.time()
  b. time.sleep()
  c. time.perf_counter()
  d. datetime.now()
options:
- a
- b
- c
- d
answer: 2
explain: time.perf_counter() provides a monotonic timer with the highest precision and is ideal for measuring short intervals. time.time() is affected by system clock adjustments such as NTP, so it is not suitable for accurate timing.
```

```quiz
type: choice
q: What does the following code print?
code: |
  import calendar
  print(calendar.monthrange(2024, 2)[1])
options:
- a. 28
- b. 29
- c. 30
- d. It raises an error
answer: 1
explain: The year 2024 is a leap year, so February has 29 days. monthrange(year, month) returns (weekday of the 1st, number of days); [1] is the day count.
```

```quiz
type: choice
q: When using zoneinfo, which of these is correct? (Assuming Python 3.9+.)
code: |
  a. from zoneinfo import ZoneInfo; tz = ZoneInfo("Europe/London")
  b. import zoneinfo; tz = zoneinfo("Europe/London")
  c. from zoneinfo import get_tz; tz = get_tz("Europe/London")
  d. import ZoneInfo from zoneinfo
options:
- a
- b
- c
- d
answer: 0
explain: The correct import is "from zoneinfo import ZoneInfo", then create a zone object with ZoneInfo("Europe/London").
```

```quiz
type: choice
q: To turn a naive datetime into an aware datetime in London time (BST, UTC+1), which is correct?
code: |
  a. dt.replace(tzinfo=timezone(timedelta(hours=1)))
  b. dt.astimezone(timezone(timedelta(hours=1)))
  c. dt.localize(timezone(timedelta(hours=1)))
  d. None of the above
options:
- a
- b
- c
- d
answer: 0
explain: For a naive datetime, use replace(tzinfo=...) to attach a zone. astimezone() converts an already-zoned datetime to a target zone; calling it on naive time treats the value as local time.
```

## Part 2 · Hands-on

```quiz
type: function
q: Write a function last_day_of_month that takes a year and a month (two integers) and returns the date of the last day of that month. Implement it using calendar.monthrange.
func: last_day_of_month
starter: |
  import calendar

  def last_day_of_month(year, month):
      return 0
cases: |
  2024,2 -> 29
  2023,2 -> 28
  2024,12 -> 31
  2024,4 -> 30
hint: calendar.monthrange(year, month) returns (_, days); take [1].
explain: The second element of monthrange is the number of days in that month, handling leap years and varying month lengths automatically.
```

```quiz
type: code
q: Write a function measure_time that takes a function object and its arguments, measures how long the function takes to run in seconds using time.perf_counter(), and returns that duration as a float. Hint: call func(*args) and return the difference in time.
starter: |
  import time

  def measure_time(func, *args):
      return 0.0
tests:
- assert isinstance(measure_time(lambda: sum(range(100))), float)
- assert measure_time(lambda x: x*2, 5) >= 0
hint: start = perf_counter(); func(*args); return perf_counter() - start
explain: perf_counter returns a monotonic clock value; the difference between two calls is the elapsed time.
```

## Part 3 · Mini-project

```quiz
type: function
q: Implement a "smart time parser" function smart_parse that takes a time string, tries several formats in order, and returns a datetime. The supported formats are: ["%Y-%m-%d %H:%M:%S", "%Y/%m/%d", "%d-%m-%Y", "%Y%m%d"]. Try each in order, return the first successful result, and raise ValueError if none work.
func: smart_parse
starter: |
  from datetime import datetime

  def smart_parse(time_str):
      formats = ["%Y-%m-%d %H:%M:%S", "%Y/%m/%d", "%d-%m-%Y", "%Y%m%d"]
      return None
cases: |
  "2024-05-30 10:00:00" -> datetime(2024, 5, 30, 10, 0, 0)
  "2024/05/30" -> datetime(2024, 5, 30)
  "30-05-2024" -> datetime(2024, 5, 30)
  "20240530" -> datetime(2024, 5, 30)
hint: Use "for fmt in formats: try: return datetime.strptime(s, fmt); except ValueError: continue".
explain: Try each format in turn; succeed and return on the first match; raise an exception if all fail.
```
