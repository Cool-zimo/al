# Chapter 4 Test · File Operations and System Interaction

> 8 questions covering `with` and the four modes, the shutil functions and the danger of `rmtree`, tempfile usage and its traps, `os.environ` and platform detection, and `subprocess` with command injection via `shell=True`.

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which open mode empties the file when it already exists?
code: |
  a. "r"
  b. "w"
  c. "a"
  d. "x"
options:
- a
- b
- c
- d
answer: 1
explain: r is read-only, a appends and keeps the original content, x raises an exception when the file exists, and only w truncates an existing file.
```

```quiz
type: choice
q: Which statement about shutil.copytree is correct?
code: |
  a. It overwrites the destination directory when that directory already exists.
  b. It raises FileExistsError when the destination directory already exists.
  c. The ignore argument can only skip .git directories.
  d. copytree can copy files but not directories.
options:
- a
- b
- c
- d
answer: 1
explain: copytree requires the destination to be absent and raises FileExistsError otherwise. dirs_exist_ok=True changes that behaviour, and ignore accepts custom patterns.
```

```quiz
type: choice
q: Which statement about tempfile.NamedTemporaryFile is correct by default?
code: |
  a. delete=True, so the file is removed when the with block ends.
  b. delete=True, and the file remains until the system restarts.
  c. The filename always ends with .txt.
  d. You must call close manually to close the file.
options:
- a
- b
- c
- d
answer: 0
explain: NamedTemporaryFile defaults to delete=True and removes the file on context exit. The suffix is set with suffix=, and the with statement closes it automatically.
```

```quiz
type: choice
q: What does sys.platform usually return on Windows?
code: |
  a. "linux"
  b. "darwin"
  c. "win32"
  d. "windows"
options:
- a
- b
- c
- d
answer: 2
explain: sys.platform returns "win32" on Windows, "linux" on Linux, and "darwin" on macOS.
```

```quiz
type: choice
q: Which subprocess invocation is safe when filename comes from untrusted user input?
code: |
  a. subprocess.run(f"cat {filename}", shell=True)
  b. subprocess.run(["cat", filename])
  c. subprocess.run("cat " + filename, shell=True, check=True)
  d. subprocess.run(f"cat '{filename}'", shell=True)
options:
- a
- b
- c
- d
answer: 1
explain: Only the list form bypasses shell parsing, so special characters are treated as literal text. Options a, c, and d concatenate strings with shell=True and are vulnerable to command injection.
```

## Part 2 · Hands-On Questions

```quiz
type: function
q: Write a function safe_rmtree_plan that receives a simulated directory-tree dictionary (keys are paths, values are "dir" or "file") and a target path. Return a deletion plan: first check whether the target exists and is a directory, then return {"deleted": the list of deleted paths (every entry whose path starts with the target, recursively), "skipped": a reason string or None}. If it does not exist, return skipped="not found"; if it is a file, return skipped="not a directory".
func: safe_rmtree_plan
starter: |
  def safe_rmtree_plan(tree, target):
      return {"deleted": [], "skipped": None}
cases: |
  {"a/": "dir", "a/b.txt": "file", "a/c/": "dir", "other.txt": "file"}, "a/" -> {"deleted": ["a/", "a/b.txt", "a/c/"], "skipped": None}
  {"a.txt": "file"}, "a.txt" -> {"deleted": [], "skipped": "not a directory"}
  {"a/": "dir"}, "missing/" -> {"deleted": [], "skipped": "not found"}
hint: Normalise the target (strip the trailing slash to use as a prefix) and iterate over the tree to find every key that starts with the target.
explain: A simulation of rmtree safety checks plus plan generation, using pure dictionary logic with no filesystem access.
```

```quiz
type: code
q: Write a function parse_env_config that receives a simulated environment-variable dictionary and a list of required keys, then returns a configuration dictionary. Rules: read each key in turn and collect missing keys into an error message; convert "true"/"false" to booleans, "null"/"none" (case-insensitive) to None, plain numbers to int, and keep everything else as a string. If any required key is missing, raise RuntimeError and list every missing key.
starter: |
  def parse_env_config(env, required):
      return {}
tests:
- assert parse_env_config({"DEBUG": "true", "PORT": "8080"}, ["DEBUG", "PORT"]) == {"DEBUG": True, "PORT": 8080}
- |
  try:
      parse_env_config({"DEBUG": "false"}, ["DEBUG", "DB"])
      assert False
  except RuntimeError as e:
      assert "DB" in str(e)
- assert parse_env_config({"X": "none"}, ["X"]) == {"X": None}
hint: Collect missing keys first and raise if any are missing. Convert in this order: boolean, then None, then int, then string.
explain: Simulated environment parsing with missing-key validation and type conversion.
```

## Part 3 · Mini Project

```quiz
type: function
q: Implement a temporary-file lifecycle simulator called tempfile_lifecycle. It receives a list of operations and simulates the creation and cleanup of NamedTemporaryFile and mkdtemp resources. The operations take the form [("create_tempfile", name), ("create_tempfile", name2), ("create_dir", dirname), ("crash",), ("cleanup",)]. Rules: create_tempfile creates a temporary file (append it to the list); create_dir creates a temporary directory (append it to the list, requiring finally-style cleanup); crash simulates a mid-run exception, so any later operations are skipped; cleanup removes every file and directory already created. Return {"files": remaining file count, "dirs": remaining directory count, "cleaned": total cleaned count, "crashed": whether a crash occurred}.
func: tempfile_lifecycle
starter: |
  def tempfile_lifecycle(operations):
      return {"files": 0, "dirs": 0, "cleaned": 0, "crashed": False}
cases: |
  [("create_tempfile","a"),("create_dir","d"),("cleanup",)] -> {"files": 0, "dirs": 0, "cleaned": 2, "crashed": False}
  [("create_tempfile","a"),("crash",),("create_tempfile","b")] -> {"files": 1, "dirs": 0, "cleaned": 0, "crashed": True}
  [] -> {"files": 0, "dirs": 0, "cleaned": 0, "crashed": False}
hint: Maintain two lists for created files and directories. On cleanup, empty both (simulating finally). After a crash, do not execute any later operations.
explain: A combined test of try/finally lifecycle management. crash simulates an interruption and verifies the cleanup logic.
```
