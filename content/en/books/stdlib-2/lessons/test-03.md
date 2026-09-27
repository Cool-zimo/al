# Chapter 3 Test · Paths and the File System

> 10 questions covering os.path vs pathlib, Path's `/` operator and name/stem/suffix/parent, iterdir/glob/rglob and os.walk, stat and timestamp conversion, and batch renaming.

## Part 1 · Multiple choice

```quiz
type: choice
q: Which statement about os.path and pathlib is correct?
code: |
  a. os.path is object-oriented; pathlib is functional
  b. pathlib is object-oriented; os.path is functional
  c. They are identical and have no differences
  d. pathlib only works on Windows
options:
- a
- b
- c
- d
answer: 1
explain: pathlib provides the object-oriented Path class with chainable method calls; os.path exposes a module-level functional API. They are similar under the hood but stylistically different.
```

```quiz
type: choice
q: For Path("/home/alice/docs/archive.tar.gz"), what does p.stem return?
code: |
  a. archive
  b. archive.tar
  c. tar.gz
  d. archive.tar.gz
options:
- a
- b
- c
- d
answer: 1
explain: stem is the name with the final suffix removed. archive.tar.gz -> remove .gz -> archive.tar.
```

```quiz
type: choice
q: Which glob pattern recursively matches every .py file in all subdirectories?
code: |
  a. base.glob("*.py")
  b. base.glob("**/*.py")
  c. base.iterdir()
  d. base.glob(".*")
options:
- a
- b
- c
- d
answer: 1
explain: `**` matches any number of directory levels. glob("*.py") matches only the current level; iterdir() does not recurse.
```

```quiz
type: choice
q: Which statement about the os.walk() tuple (dirpath, dirnames, filenames) is correct?
code: |
  a. dirpath is a Path object
  b. dirnames is the list of subdirectory names in the current directory
  c. filenames includes subdirectory names
  d. The tuple order is (filenames, dirnames, dirpath)
options:
- a
- b
- c
- d
answer: 1
explain: os.walk() yields (dirpath, dirnames, filenames): dirpath is a string, dirnames is the list of subdirectory names, and filenames is the list of filenames.
```

```quiz
type: choice
q: Which operation correctly converts a timestamp into a London-time (BST, UTC+1) string?
code: |
  a. datetime.fromtimestamp(ts).strftime(fmt)
  b. datetime.fromtimestamp(ts, tz=timezone(timedelta(hours=1))).strftime(fmt)
  c. str(ts)
  d. time.ctime(ts).encode()
options:
- a
- b
- c
- d
answer: 1
explain: Passing timezone(timedelta(hours=1)) fixes the zone at BST; without it, fromtimestamp would fall back on the system's local zone.
```

## Part 2 · Hands-on

```quiz
type: function
q: Write a function path_parts that takes a path string and returns a dict {"name": filename, "stem": name without extension, "suffix": last extension, "parent": parent directory}. Use PurePath for pure computation, with no file system access.
func: path_parts
starter: |
  from pathlib import PurePath

  def path_parts(path_str):
      return {}
cases: |
  "/home/alice/docs/report.pdf" -> {"name": "report.pdf", "stem": "report", "suffix": ".pdf", "parent": "/home/alice/docs"}
  "archive.tar.gz" -> {"name": "archive.tar.gz", "stem": "archive.tar", "suffix": ".gz", "parent": "."}
  "/data/logs/2024/01.log" -> {"name": "01.log", "stem": "01", "suffix": ".log", "parent": "/data/logs/2024"}
hint: PurePath(path_str).name / .stem / .suffix / .parent.
explain: PurePath provides the same path-parsing attributes as Path but performs no file-system access.
```

```quiz
type: code
q: Write a function filter_by_depth that takes a simulated directory listing (such as ["a.txt", "b/c.py", "d/e/f.md"]) and a maximum depth (int), and returns the paths whose depth does not exceed max_depth. Depth is defined as the number of "/" characters in the path.
starter: |
  def filter_by_depth(file_list, max_depth):
      return []
tests:
- assert filter_by_depth(["a.txt", "b/c.py", "d/e/f.md"], 1) == ["a.txt", "b/c.py"]
- assert filter_by_depth(["a.txt", "b/c.py", "d/e/f.md"], 0) == ["a.txt"]
- assert filter_by_depth(["a/b/c/d.txt"], 3) == ["a/b/c/d.txt"]
hint: depth = path_str.count('/'). Keep items where count <= max_depth.
explain: Counting '/' gives the path depth. Depth 0 means no slash (a file in the current directory); depth 1 means one subdirectory level.
```

## Part 3 · Mini-project

```quiz
type: function
q: Implement a batch-rename preview function batch_rename_preview. It takes a directory path string, a match pattern (such as "*.txt"), and a rule name ("upper" or "lower"), and returns the planned rename list — a list of tuples (original filename, new filename). Pure simulation, no file system access.
func: batch_rename_preview
starter: |
  from pathlib import PurePath

  def batch_rename_preview(directory, pattern, rule):
      # simulate here: assume the directory contains the files below (using PurePath)
      # you only need to transform the filenames by the rule and return the plan
      return []
cases: |
  "/tmp/docs","*.txt","upper" -> [("notes.txt", "NOTES.TXT"), ("readme.txt", "README.TXT")]
  "/tmp","*.md","lower" -> [("README.md", "readme.md")]
hint: Hard-code the simulated file list as ["notes.txt", "readme.txt"], then apply .upper() or .lower() per the rule.
explain: In practice this would walk the directory; for the test, transform the given filenames by the rule and return the plan.
```
