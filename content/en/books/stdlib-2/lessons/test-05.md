# Chapter 5 Test · Archives and Backups

> 8 questions covering zipfile, tarfile and its three compression formats, compression ratios and files that refuse to compress, glob and fnmatch, and the hands-on backup tool.

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which statement about the zipfile module is correct?
code: |
  a. zf.read(name) returns a string.
  b. ZipFile supports AES-256 encryption.
  c. extractall accepts a members argument to extract only selected files.
  d. If arcname is omitted when calling write, the archive entry has no name.
options:
- a
- b
- c
- d
answer: 2
explain: a is wrong: read returns bytes. b is wrong: only ZipCrypto is supported. d is wrong: without arcname, the original path is used. c is correct.
```

```quiz
type: choice
q: Which statement about the three tar compression formats is correct?
code: |
  a. .tar.gz has the highest compression ratio.
  b. .tar.xz has the highest compression ratio but is the slowest.
  c. .tar.bz2 has a higher compression ratio than .tar.xz.
  d. tar compresses data by itself.
options:
- a
- b
- c
- d
answer: 1
explain: a is wrong: xz is highest. c is wrong: xz beats bz2. d is wrong: tar only packages files, it does not compress them. b is correct.
```

```quiz
type: choice
q: Which file type is least likely to shrink noticeably when compressed?
code: |
  a. A 50MB plain-text log file.
  b. A 50MB mp4 video.
  c. A 50MB JSON data export.
  d. A 50MB directory of Python source code.
options:
- a
- b
- c
- d
answer: 1
explain: An mp4 is already compressed and has high entropy, so further compression yields almost nothing. Text, JSON, and source code all contain redundant patterns.
```

```quiz
type: choice
q: Which statement about fnmatch and glob is correct?
code: |
  a. fnmatch uses regular expression syntax.
  b. glob.glob("**/*.py") recurses through every subdirectory by default.
  c. fnmatch.fnmatch("a.txt", "[!.]*") returns False.
  d. glob.glob("*.py", recursive=True) is legal even though recursive has no effect on a single-level pattern.
options:
- a
- b
- c
- d
answer: 3
explain: a is wrong: fnmatch is shell-style. b is wrong: the default is recursive=False. c is wrong: a.txt does not start with a dot, so it matches [!.]* and returns True. d is correct.
```

```quiz
type: choice
q: Which statement about the backup tool design is correct?
code: |
  a. Matching only the basename of each file is sufficient for exclude rules.
  b. The benefit of naming archives with the timestamp YYYYMMDD_HHMMSS is that sorting filenames gives chronological order.
  c. During a backup, __pycache__ and .git should be included in the archive.
  d. Checksums have no value when verifying backup integrity.
options:
- a
- b
- c
- d
answer: 1
explain: a is wrong: the full path and directory segments must be matched. c is wrong: both should be excluded. d is wrong: checksums are essential for integrity verification. b is correct.
```

## Part 2 · Hands-On Questions

```quiz
type: function
q: Write a function scan_classify(files, ext_map, size_thresholds): files is a simulated file-info list (with ext and size). Return a category dictionary whose values are the src lists for each category, preserving the original order. When the extension is in ext_map, use it. Otherwise, apply size: smaller than t["tiny"] becomes "Tiny", greater than or equal to t["huge"] becomes "Huge", and the rest becomes "Other".
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
type: code
q: Write a function backup_excludes(files, rules): given a list of files and a list of exclusion rules (fnmatch patterns), return the list of excluded files (keeping the original order). A rule must match either the full path or any single directory segment.
starter: |
  from fnmatch import fnmatch

  def backup_excludes(files, rules):
      return []
tests:
- assert backup_excludes(["a.py", "__pycache__/x.py", ".git/config"], ["__pycache__", ".git", "*.pyc"]) == ["__pycache__/x.py", ".git/config"]
- assert backup_excludes(["main.py", "data.csv"], ["__pycache__"]) == []
- assert backup_excludes(["node_modules/x.js"], ["node_modules"]) == ["node_modules/x.js"]
hint: For each file, try every rule against both the full path and each directory segment split out with fnmatch.
explain: This models a backup tool's exclusion logic. Matching directory segments is the point — "__pycache__" should exclude anything inside that folder, not just a file literally named it.
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
