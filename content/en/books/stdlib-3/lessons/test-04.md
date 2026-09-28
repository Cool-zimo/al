# Chapter 4 Quiz · Logging and the Command Line

> This chapter quiz covers the five logging levels, `basicConfig`, logger/handler/formatter, not calling `basicConfig` in every module, argparse argument types and `choices`, and subcommands. Eight questions total: 5 multiple choice + 2 hands-on + 1 mini-project.

## Part 1 · Multiple Choice

### 1. What is the default behaviour of logging's five levels?

- The default level is DEBUG, and every level is emitted
- The default level is WARNING, and WARNING and above (WARNING/ERROR/CRITICAL) are emitted
- The default level is ERROR, and only ERROR and CRITICAL are emitted
- The default level is INFO, and INFO and above are emitted

```quiz
type: choice
exam: true
q: What is the default behaviour of logging's five levels?
options:
- The default level is DEBUG, and every level is emitted
- The default level is WARNING, and WARNING and above (WARNING/ERROR/CRITICAL) are emitted
- The default level is ERROR, and only ERROR and CRITICAL are emitted
- The default level is INFO, and INFO and above are emitted
answer: 1
explain: logging's default level is WARNING, so WARNING, ERROR, and CRITICAL are emitted while DEBUG and INFO are suppressed by default.
```

### 2. What is the correct way to use `basicConfig`?

- It can be called in every module for independent configuration per module
- basicConfig only takes effect before the first logging call; subsequent calls are ignored, so configure it once at the program entry point
- basicConfig can dynamically modify the level of an existing logger
- basicConfig must be called once before every log emission

```quiz
type: choice
exam: true
q: What is the correct way to use basicConfig?
options:
- It can be called in every module for independent configuration per module
- basicConfig only takes effect before the first logging call; subsequent calls are ignored, so configure it once at the program entry point
- basicConfig can dynamically modify the level of an existing logger
- basicConfig must be called once before every log emission
answer: 1
explain: basicConfig is globally unique and only runs on the first logging call; repeated calls do nothing. The correct approach is to configure it once at the program entry point.
```

### 3. A log record is emitted three times. What is the most likely cause?

- The log level is set too high
- The same logger received duplicate addHandler calls, and the child logger's propagate is True, causing it to bubble up to the parent logger
- The format string is wrong
- basicConfig was never called

```quiz
type: choice
exam: true
q: A log record is emitted three times. What is the most likely cause?
options:
- The log level is set too high
- The same logger received duplicate addHandler calls, and the child logger's propagate is True, causing it to bubble up to the parent logger
- The format string is wrong
- basicConfig was never called
answer: 1
explain: The two classic causes of duplicate output: multiple handlers on the same logger all passing the level through, or a child logger's propagate=True causing messages to bubble into a parent handler and be emitted again.
```

### 4. What does argparse's `choices` parameter do?

- It automatically converts the argument to an integer
- It restricts the argument to a fixed set of values and reports an error for anything outside that set
- It sets the argument's default value
- It determines whether the argument is required

```quiz
type: choice
exam: true
q: What does argparse's choices parameter do?
options:
- It automatically converts the argument to an integer
- It restricts the argument to a fixed set of values and reports an error for anything outside that set
- It sets the argument's default value
- It determines whether the argument is required
answer: 1
explain: choices limits the allowed values for a parameter; if the user supplies a value outside the set, argparse generates an error message automatically.
```

### 5. What does the `dest` parameter do for an argparse subcommand?

- dest is optional, and the subcommand name can still be retrieved without it
- dest="command" records which subcommand the user selected; without dest there is no command attribute
- dest sets the default value of the subcommand
- dest restricts the argument type of the subcommand

```quiz
type: choice
exam: true
q: What does the dest parameter do for an argparse subcommand?
options:
- dest is optional, and the subcommand name can still be retrieved without it
- dest="command" records which subcommand the user selected; without dest there is no command attribute
- dest sets the default value of the subcommand
- dest restricts the argument type of the subcommand
answer: 1
explain: dest="command" records which subcommand the user selected and is accessed via args.command after parsing. Without dest there is no command attribute.
```

## Part 2 · Hands-On

### 6. Configure a Logger and Add a Handler

```quiz
type: function
exam: true
q: Write a function setup_logger that takes a string name. Inside, create a logger named name, clear any existing handlers, attach a StreamHandler (level WARNING, format "%(levelname)s: %(message)s"), and set the logger's level to DEBUG. Return the logger's numeric level.
func: setup_logger
starter: |
  import logging

  def setup_logger(name):
      logger = logging.getLogger(name)
      logger.handlers.clear()
      handler = logging.StreamHandler()
      handler.setLevel(logging.WARNING)
      handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
      logger.addHandler(handler)
      logger.setLevel(logging.DEBUG)
      return logger.level
cases: |
  "app" -> 10
  "test" -> 10
hint: After logger.setLevel(logging.DEBUG), logger.level holds the numeric value 10.
explain: This tests setting a logger's level, attaching a handler, and pairing it with a formatter.
```

### 7. Parsing Command-Line Arguments with `choices` and `store_true`

```quiz
type: function
exam: true
q: Write a function parse_tool_args that takes a list argv. Using argparse, define: a positional argument "action" with choices ["encrypt", "decrypt"]; an optional argument "--key" of type str with default "secret"; and an optional argument "--verbose" with action="store_true". Return a dictionary {"action": ..., "key": ..., "verbose": ...}.
func: parse_tool_args
starter: |
  import argparse

  def parse_tool_args(argv):
      parser = argparse.ArgumentParser()
      parser.add_argument("action", choices=["encrypt", "decrypt"])
      parser.add_argument("--key", type=str, default="secret")
      parser.add_argument("--verbose", action="store_true")
      args = parser.parse_args(argv)
      return {"action": args.action, "key": args.key, "verbose": args.verbose}
cases: |
  ["encrypt"] -> {"action": "encrypt", "key": "secret", "verbose": False}
  ["decrypt", "--key", "mykey", "--verbose"] -> {"action": "decrypt", "key": "mykey", "verbose": True}
hint: The positional argument is required; --key has a default; --verbose is a store_true flag.
explain: This combines a positional argument, choices validation, type conversion, a default value, and store_true — a comprehensive use of argparse.
```

## Part 3 · Mini-Project

### 8. Mini CLI Tool: A Log Analyser

**Project requirements**: write a function `log_analyzer` that takes a list of command-line arguments `argv` and uses argparse to parse the following:

- A positional argument `logfile`: the log file path (a string)
- An optional argument `--level`: type=str, choices `["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]`, default="INFO"
- An optional argument `--follow`: action="store_true", whether to monitor continuously
- An optional argument `--limit`: type=int, default=100, maximum number of lines to display

Return a dictionary containing the parsed results: `{"logfile": ..., "level": ..., "follow": ..., "limit": ...}`.

Then **extend the functionality**: define a subcommand `stats` with positional argument `logfile` and optional argument `--top` (type=int, default=10, the N most frequent errors to show). Subcommand `tail` has positional argument `logfile` and optional argument `--lines` (type=int, default=50). The main parser (without a subcommand) returns the file-analysis arguments directly.

Final function signature: `def log_analyzer(argv):` — determine which parsing path to take based on whether the first element of `argv` is a subcommand name. Return the parsed dictionary.

```quiz
type: function
exam: true
q: Write a complete CLI parser for a log analyser. Requirements: 1) the main command supports positional logfile, --level (choices covering all five levels, default INFO), --follow (store_true), and --limit (type=int, default 100); 2) subcommand stats (arguments logfile and --top, type=int, default 10); 3) subcommand tail (arguments logfile and --lines, type=int, default 50). Determine whether to use the main command or a subcommand based on argv, and return the corresponding dictionary.
func: log_analyzer
starter: |
  import argparse

  def log_analyzer(argv):
      parser = argparse.ArgumentParser()
      parser.add_argument("logfile")
      parser.add_argument("--level", choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], default="INFO")
      parser.add_argument("--follow", action="store_true")
      parser.add_argument("--limit", type=int, default=100)

      sub = parser.add_subparsers(dest="cmd")

      p_stats = sub.add_parser("stats")
      p_stats.add_argument("logfile")
      p_stats.add_argument("--top", type=int, default=10)

      p_tail = sub.add_parser("tail")
      p_tail.add_argument("logfile")
      p_tail.add_argument("--lines", type=int, default=50)

      args = parser.parse_args(argv)

      if args.cmd == "stats":
          return {"cmd": "stats", "logfile": args.logfile, "top": args.top}
      elif args.cmd == "tail":
          return {"cmd": "tail", "logfile": args.logfile, "lines": args.lines}
      else:
          return {"logfile": args.logfile, "level": args.level, "follow": args.follow, "limit": args.limit}
cases: |
  ["app.log", "--level", "ERROR", "--limit", "50"] -> {"logfile": "app.log", "level": "ERROR", "follow": False, "limit": 50}
  ["stats", "app.log", "--top", "5"] -> {"cmd": "stats", "logfile": "app.log", "top": 5}
  ["tail", "app.log", "--lines", "20"] -> {"cmd": "tail", "logfile": "app.log", "lines": 20}
  ["app.log", "--follow"] -> {"logfile": "app.log", "level": "INFO", "follow": True, "limit": 100}
hint: Subcommands are distinguished by dest="cmd"; when args.cmd is None, take the main-command path.
explain: This is the chapter's capstone project, bringing together positional arguments, choices, store_true, type, default values, and subcommands to simulate the argument-parsing layer of a real CLI tool.
```
