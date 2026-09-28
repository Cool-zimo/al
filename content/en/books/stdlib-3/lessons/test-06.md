# Chapter 6 · Comprehensive Project · Final Assessment

> 8 questions. This chapter pieces together everything from the first five into a working tool: regex parsing, Counter statistics, multi-format output, logging, argparse, and unittest.
> **You must answer all questions correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: When building a log analysis tool, what is the biggest benefit of splitting "parsing", "statistics", and "output" into three separate layers?
options:
- The code has fewer lines
- Each layer can be replaced and tested independently; for example, changing the log format only touches the parsing layer, while statistics and output stay untouched
- It runs faster
- It requires fewer comments
answer: 1
explain: The value of layering is decoupling. Changing the log format only modifies the parsing layer; switching from console output to JSON export only modifies the output layer. If everything were in one function, every change would ripple through — and you couldn't test each layer's logic on its own.
```

```quiz
type: choice
q: When parsing logs, what is the best way to handle a line in the wrong format?
options:
- Raise ValueError directly and terminate the program so the problem surfaces immediately
- Collect it in a "failed list", keep processing the remaining lines, and report how many could not be parsed
- Silently skip it without recording anything
- Return an empty string to pretend it succeeded
answer: 1
explain: Real log files almost always contain bad lines. Terminating the entire analysis because of one bad row makes the tool unusable. The correct approach is to collect the failures and continue, then report at the end that "987 of 1000 lines succeeded, 13 could not be parsed" — making the tool usable while keeping the problem visible. Silent skipping hides the issue, which is the worst option.
```

```quiz
type: choice
q: To count how many times each log level (ERROR/INFO/WARN) appears, what is the best approach?
options:
- Call list.count() once per level
- Manually check whether each key exists in a plain dict
- Use collections.Counter in a single pass
- Sort first, then count by hand
answer: 2
explain: Counter counts every level in a single pass — one line of code, with most_common() available for top-N results. Calling list.count() once per level scans the whole list each time, giving O(n x k); a hand-written dict check works but is verbose; sorting first turns O(n) into O(n log n).
```

```quiz
type: choice
q: When exporting statistics containing non-ASCII text as JSON and you want to see the real characters instead of \uXXXX, you should?
options:
- json.dumps(data) outputs non-ASCII correctly by default
- json.dumps(data, ensure_ascii=False)
- json.dumps(data, encoding="utf-8")
- Convert the non-ASCII text to bytes first, then call dumps
answer: 1
explain: ensure_ascii defaults to True, escaping every non-ASCII character as \uXXXX. Setting it to False outputs the original characters directly. Note that encoding is not a parameter of json.dumps — a common point of confusion; encoding is specified when writing to a file (open's encoding=).
```

```quiz
type: choice
q: In argparse, how do you make a positional argument optional (omitting it yields None)?
options:
- required=False
- nargs="?"
- optional=True
- action="store_true"
answer: 1
explain: Positional arguments are required by default. Adding nargs="?" makes them optional, defaulting to the value of default (or None if default is unset). required=False only makes sense for optional arguments (the --xxx kind); optional and store_true don't work this way — store_true makes a flag argument True when present.
```

---

## Part 2 · Hands-On

```quiz
type: function
q: Write parse_log_lines(lines): it takes a list of log-line strings and returns {"entries": [...], "failed": [...]}. Each successfully parsed line follows the format "2026-01-15 10:23:45 [ERROR] [auth] login failed"; each entry is {"timestamp":..., "level":..., "module":..., "message":...}. Lines that don't match the format (including blank lines) go into failed; do not raise an exception.
func: parse_log_lines
starter: |
  import re

  PATTERN = re.compile(
      r'^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'
      r' \[([A-Z]+)\] \[(\w+)\] (.+)$'
  )

  def parse_log_lines(lines):
      entries = []
      failed = []
      for line in lines:
          # strip first; blank lines and unmatched lines both go into failed
          m = PATTERN.match(line.strip())
          if not m:
              failed.append(line)
              continue
          entries.append({
              "timestamp": m.group(1),
              "level": m.group(2),
              "module": m.group(3),
              "message": m.group(4),
          })
      return {"entries": entries, "failed": failed}
cases: |
  ["2026-01-15 10:23:45 [ERROR] [auth] login failed", "bad line", ""] -> {"entries": [{"timestamp": "2026-01-15 10:23:45", "level": "ERROR", "module": "auth", "message": "login failed"}], "failed": ["bad line", ""]}
hint: After stripping, a blank line becomes an empty string that won't match the regex, so it naturally lands in failed — no separate blank-line check needed. Use capturing groups () for the fields and (?:...) for non-capturing groups; all four fields are needed here, so use capturing groups.
explain: This is the standard parsing-layer pattern: try each line, structure it on success, collect failures otherwise, and never let one bad line abort the whole batch. Note that level uses [A-Z]+ rather than an explicit enumeration, so adding a new DEBUG level requires no code changes.
```

```quiz
type: function
q: Write analyze(entries): it takes a list of already-parsed dictionaries and returns a statistics dictionary with three fields: level_counts (count per level), hourly_errors (ERROR entries counted by hour, with keys as two-digit hour strings such as "10"), and top_errors (top 3 error messages, formatted as [(message, count), ...]).
func: analyze
starter: |
  from collections import Counter

  def analyze(entries):
      level_counts = dict(Counter(e["level"] for e in entries))
      hourly_errors = dict(Counter(
          e["timestamp"][11:13]
          for e in entries if e["level"] == "ERROR"
      ))
      top_errors = Counter(
          e["message"] for e in entries if e["level"] == "ERROR"
      ).most_common(3)
      return {
          "level_counts": level_counts,
          "hourly_errors": hourly_errors,
          "top_errors": top_errors,
      }
cases: |
  [{"timestamp": "2026-01-15 10:00:00", "level": "ERROR", "module": "auth", "message": "login failed"}, {"timestamp": "2026-01-15 10:05:00", "level": "ERROR", "module": "db", "message": "connection timed out"}, {"timestamp": "2026-01-15 10:10:00", "level": "INFO", "module": "order", "message": "ok"}, {"timestamp": "2026-01-15 11:00:00", "level": "ERROR", "module": "auth", "message": "login failed"}, {"timestamp": "2026-01-15 11:05:00", "level": "WARN", "module": "db", "message": "slow query"}, {"timestamp": "2026-01-15 11:10:00", "level": "ERROR", "module": "payment", "message": "timeout"}] -> {"level_counts": {"ERROR": 4, "INFO": 1, "WARN": 1}, "hourly_errors": {"10": 2, "11": 2}, "top_errors": [["login failed", 2], ["connection timed out", 1], ["timeout", 1]]}
hint: The hour is at positions 11 through 13 of the timestamp ("10" in "2026-01-15 10:00:00"). Use most_common(3) for top_errors.
explain: Each of the three statistics needs only one Counter pass, for a total of three passes over the data — far clearer than a hand-written loop. Using string keys instead of integers for hourly_errors ensures that JSON exports keep valid string keys rather than numeric ones.
```

---

## Part 3 · Mini-Project

```quiz
type: project
q: Build a "mini log analyser": combine the parsing, statistics, and output layers from this chapter into a single-file module and add tests for it.
checklist:
- parse(lines) can parse standard-format log lines and returns two lists (entries, failed); bad lines do not raise
- stats(entries) returns level_counts / hourly_errors / top_errors
- to_json(stats) returns a JSON string using ensure_ascii=False so non-ASCII text displays correctly
- main(argv) uses argparse to provide two subcommands, analyze and export
- logging records the tool's own runtime information (such as "read N lines, M failed") at INFO level
- At least 3 unittest cases cover parse / stats / to_json
- An if __name__ == "__main__": entry point is included
starter: |
  import re
  import json
  import logging
  import argparse
  from collections import Counter

  logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
  log = logging.getLogger("logalyzer")

  PATTERN = re.compile(
      r'^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[([A-Z]+)\] \[(\w+)\] (.+)$'
  )


  def parse(lines):
      """Parsing layer: turn log lines into structured data, collecting bad lines separately"""
      entries, failed = [], []
      for line in lines:
          m = PATTERN.match(line.strip())
          if not m:
              failed.append(line)
              continue
          entries.append({
              "timestamp": m.group(1),
              "level": m.group(2),
              "module": m.group(3),
              "message": m.group(4),
          })
      return entries, failed


  def stats(entries):
      """Statistics layer: three dimensions"""
      return {
          "level_counts": dict(Counter(e["level"] for e in entries)),
          "hourly_errors": dict(Counter(
              e["timestamp"][11:13] for e in entries if e["level"] == "ERROR"
          )),
          "top_errors": Counter(
              e["message"] for e in entries if e["level"] == "ERROR"
          ).most_common(3),
      }


  def to_json(data):
      """Output layer: export as JSON"""
      return json.dumps(data, ensure_ascii=False, indent=2)


  def main(argv=None):
      p = argparse.ArgumentParser(prog="logalyzer")
      sub = p.add_subparsers(dest="cmd")

      a = sub.add_parser("analyze", help="print a console report")
      a.add_argument("--input", required=True)

      e = sub.add_parser("export", help="export a structured file")
      e.add_argument("--input", required=True)
      e.add_argument("--format", choices=["json", "csv"], default="json")

      args = p.parse_args(argv)
      if not args.cmd:
          p.print_help()
          return

      with open(args.input, encoding="utf-8") as f:
          lines = f.read().splitlines()

      entries, failed = parse(lines)
      log.info("read %d lines, %d succeeded, %d failed",
               len(lines), len(entries), len(failed))

      result = stats(entries)
      if args.cmd == "analyze":
          print("level distribution:", result["level_counts"])
          print("peak error hours:", result["hourly_errors"])
          print("top errors:", result["top_errors"])
      else:
          print(to_json(result) if args.format == "json" else result)


  if __name__ == "__main__":
      main()
```
