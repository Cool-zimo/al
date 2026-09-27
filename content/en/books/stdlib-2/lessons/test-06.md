# Chapter 6 Test · The Smart File Organiser

> This chapter is the final exercise: everything learned across the previous five chapters comes together in the Smart File Organiser project. This test has 8 questions: 5 multiple choice covering layered and safe design, scanning and classification, the rule engine and date-based archiving, execution and undo, and the command line; 2 hands-on questions practising pure functions; and 1 mini-project that ties the whole book together.

---

## Part 1 · Multiple Choice

```quiz
type: choice
q: In the layered design of the smart file organiser, what should the Scanner, Classifier, and Planner layers be?
code: |
  a. All three layers call shutil.move directly to move files.
  b. All three layers only process data (pure functions); only the Executor performs real I/O.
  c. Only the Classifier is a pure function; Scanner and Planner must read and write the filesystem.
  d. The layers do not need to be separated; one large function is clearer.
options:
- a
- b
- c
- d
answer: 1
explain: The whole point of layering is that the first three layers process data and stay easy to test, while real I/O is concentrated in the Executor. Options a, c, and d all break that separation.
```

```quiz
type: choice
q: When the scanner decides whether a file lives inside an ignored directory (such as __pycache__), what is the correct check?
code: |
  a. Check whether the file's direct parent directory is in the ignore set.
  b. Check every ancestor directory segment relative to the root and skip the file if any of them is in the ignore set.
  c. Use a substring check such as "in" against the full path string.
  d. Ignored directories do not need handling in the scanner because the classifier filters them later.
options:
- a
- b
- c
- d
answer: 1
explain: Nested layouts such as a/b/__pycache__/x.py are missed by checking only the immediate parent; substring checks cause false positives; and the classifier works by extension, not directory names. b is correct.
```

```quiz
type: choice
q: Which statement about conflict handling in the rule engine is correct?
code: |
  a. Name collisions can only be handled by raising an exception and asking the user to intervene.
  b. The conflict strategy may be set in configuration to one of suffix (add an index), skip (leave it), or overwrite (replace).
  c. .tar.gz should simply be classified as .gz with no special handling.
  d. Rules must be hardcoded in if-elif chains to take effect quickly.
options:
- a
- b
- c
- d
answer: 1
explain: Conflict strategies should be configurable. a is wrong because there must be a deterministic policy. c is wrong because compound suffixes need their own mapping. d is wrong because rules should be data, not hardcoded logic.
```

```quiz
type: choice
q: What is the correct execution and undo order?
code: |
  a. Move every file first, then write one log at the end.
  b. Write the complete log first, then move files one by one while updating each operation's status.
  c. For undo, iterate through the original operations in their original order.
  d. When the destination already exists, overwrite it silently with no conflict policy.
options:
- a
- b
- c
- d
answer: 1
explain: Logging first means the log remains complete after a crash. Undo must walk in reverse to avoid parent-directory issues. Silent overwrites cause permanent data loss.
```

```quiz
type: choice
q: When parsing command-line arguments manually with sys.argv, which boundary case must be handled?
code: |
  a. The user passed an unknown option.
  b. A valued option such as --undo happens to be the final argument and has no value after it.
  c. There are more than 100 arguments.
  d. The arguments contain non-ASCII characters.
options:
- a
- b
- c
- d
answer: 1
explain: If --undo is the last argument, reading argv[i+1] directly raises IndexError. The other cases do not cause a guaranteed crash.
```

---

## Part 2 · Hands-On Questions

```quiz
type: function
q: Implement scan_classify(files, ext_map, size_thresholds): files is a simulated file-info list (with ext and size). Return a category dictionary whose values are the src lists for each category, preserving the original order. When the extension is in ext_map, use it. Otherwise, apply size: smaller than t["tiny"] becomes "Tiny", greater than or equal to t["huge"] becomes "Huge", and the rest becomes "Other".
func: scan_classify
starter: |
  def scan_classify(files, ext_map, size_thresholds):
      return {}
cases: |
  [{"src":"a.jpg","ext":".jpg","size":100},{"src":"b.tmp","ext":".tmp","size":200},{"src":"c.iso","ext":".iso","size":500000000},{"src":"d.md","ext":".md","size":3000}], {".jpg":"Images",".md":"Docs"}, {"tiny":1024,"huge":104857600} -> {"Images": ["a.jpg"], "Tiny": ["b.tmp"], "Huge": ["c.iso"], "Docs": ["d.md"]}
  [], {".jpg":"Images"}, {"tiny":1024,"huge":104857600} -> {}
hint: Check ext_map first; on a miss, compare against tiny and huge; otherwise use "Other". Use setdefault or prebuilt lists to preserve order.
explain: A combined exercise in scanning and classification. Note the three levels: extension mapping, size thresholds, and the fallback category.
```

```quiz
type: function
q: Implement build_undo_plan(plan): plan is {dest_rel: src_abs}. Return an undo plan {original_dest: original_src} (a dictionary with keys and values swapped). Then implement apply_with_undo(plan, log_path): write the undo plan to log_path as a JSON string and return the written dictionary. This question performs no real file writes; return only the content that would be written.
func: apply_with_undo
starter: |
  import json

  def build_undo_plan(plan):
      return {}

  def apply_with_undo(plan, log_path):
      undo = build_undo_plan(plan)
      # Return (the undo dictionary, the JSON string that should be written).
      return undo, ""
cases: |
  {"Docs/a.pdf": "/d/a.pdf", "Images/b.jpg": "/d/b.jpg"}, "/tmp/ops.json" -> ({"/d/a.pdf": "Docs/a.pdf", "/d/b.jpg": "Images/b.jpg"}, '{"Docs/a.pdf": "Images/b.jpg"}')
  {}, "/tmp/ops.json" -> ({}, "{}")
hint: Swap the dictionary's keys and values. For JSON serialisation, use ensure_ascii=False and sort_keys=True for stable grading.
explain: The core of undo is reversing keys and values. sort_keys keeps dictionary serialisation deterministic.
```

---

## Part 3 · Mini Project

**Project: A Mini File Organiser (without real file I/O)**

Implement a `MiniOrganizer` class that wires together the core logic of the first three layers in this chapter. It receives a **simulated file list** and a **rules dictionary** and produces a complete organising plan.

Requirements:

1. `scan(files)`: standardise the simulated data (with `path`, `size`, and `mtime`) into a file-info list, with `ext` lowercased and `""` when there is no extension.
2. `classify(ext_map, size_thresholds)`: use extension mapping first; on a miss, classify by size into Tiny, Huge, or Other.
3. `plan_moves(rules)`: generate a destination dictionary `{dest_rel: src}`. `rules` contains `date_archive` (bool) and `date_format` (str); when true, the destination is `category/date-subfolder/name`, otherwise `category/name`.
4. `summary()`: return `{"total": count, "by_category": {category: count}}`, ordered by descending count.
5. Resolve name collisions with the suffix strategy.

**Reference implementation notes** (write your own first; check here if you get stuck):

```python
from datetime import datetime


class MiniOrganizer:
    def __init__(self, files):
        self.raw = files
        self.files = []
        self.plan = {}

    def scan(self):
        from pathlib import Path
        for f in self.raw:
            p = Path(f["path"])
            self.files.append({
                "src": f["path"], "name": p.name,
                "ext": p.suffix.lower(),
                "size": f["size"], "mtime": f["mtime"],
            })

    def classify(self, ext_map, size_thresholds):
        for f in self.files:
            cat = ext_map.get(f["ext"])
            if cat is None:
                if f["size"] < size_thresholds["tiny"]:
                    cat = "Tiny"
                elif f["size"] >= size_thresholds["huge"]:
                    cat = "Huge"
                else:
                    cat = "Other"
            f["category"] = cat

    def plan_moves(self, rules):
        existing = set()
        for f in self.files:
            cat = f["category"]
            if rules["date_archive"]:
                sub = datetime.fromisoformat(f["mtime"]).strftime(rules["date_format"])
                base = f"{cat}/{sub}/{f['name']}"
            else:
                base = f"{cat}/{f['name']}"
            dest = base
            if dest in existing:
                from pathlib import Path as _P
                p = _P(dest)
                stem, suffix = p.stem, p.suffix
                i = 1
                while dest in existing:
                    dest = f"{cat}/" + (f"{sub}/" if rules["date_archive"] else "") + f"{stem}_{i}{suffix}"
                    i += 1
            existing.add(dest)
            self.plan[dest] = f["src"]

    def summary(self):
        by_cat = {}
        for dest in self.plan:
            cat = dest.split("/")[0]
            by_cat[cat] = by_cat.get(cat, 0) + 1
        ordered = dict(sorted(by_cat.items(), key=lambda x: -x[1]))
        return {"total": len(self.plan), "by_category": ordered}


# Self-test
if __name__ == "__main__":
    files = [
        {"path": "a.jpg", "size": 100, "mtime": "2026-09-20T10:00:00"},
        {"path": "b.PDF", "size": 2000, "mtime": "2026-08-05T09:00:00"},
        {"path": "c.tmp", "size": 200, "mtime": "2026-09-01T08:00:00"},
    ]
    ext_map = {".jpg": "Images", ".pdf": "Docs"}
    rules = {"date_archive": True, "date_format": "%Y-%m"}

    m = MiniOrganizer(files)
    m.scan()
    m.classify(ext_map, {"tiny": 1024, "huge": 104857600})
    m.plan_moves(rules)
    print(m.plan)
    # {'Images/2026-09/a.jpg': 'a.jpg', 'Docs/2026-08/b.PDF': 'b.PDF', 'Tiny/c.tmp': 'c.tmp'}
    print(m.summary())
    # {'total': 3, 'by_category': {'Docs': 1, 'Images': 1, 'Tiny': 1}}
```

**Grading suggestion:** split these four methods into four separate function questions covering `scan`, `classify`, `plan_moves`, and `summary`, using simulated lists as input. The cases above can be reused.

**Extension (optional):** add an `undo_plan()` method that returns the reversed `{original_dest: original_src}` dictionary—this is exactly the undo logic from Lesson 29. Then add a `to_log()` method that serialises the plan as a JSON string. With those two additions, you have a complete organiser core that never touches the real filesystem.

---

## Quick Reference for the Whole Book

This test also closes out the entire book. The following knowledge points appeared in the previous five chapters and make a useful self-check:

| Chapter | Core API | One-line summary |
|---------|----------|------------------|
| 1. Time basics | `date` / `time` / `datetime` / `timedelta` / `strftime` / `timestamp` | Use `timedelta` for time arithmetic; use `strftime` for formatting |
| 2. Advanced time | `zoneinfo` / `perf_counter` / `calendar` | State time zones explicitly; use `perf_counter` for timing |
| 3. Paths and filesystem | `os.path` versus `pathlib`, `Path` operations, traversal, `stat` | New code uses `pathlib`; paths are objects |
| 4. Files and system interaction | `with` and modes / `shutil` / `tempfile` / `os.environ` / `subprocess` | `with` closes automatically; subprocess takes a list |
| 5. Archives and compression | `zipfile` / `tarfile` / compression ratios / `glob` / `fnmatch` | Text compresses, media barely does; use fnmatch for exclude rules |
| 6. The finish line | `sys.argv` / layered design / safety design / undo logging | Pure functions first, I/O last, log before executing |
