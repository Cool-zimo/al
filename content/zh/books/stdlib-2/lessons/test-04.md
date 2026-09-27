# 第 4 章章测 · 文件操作与系统交互

> 8 道题，覆盖 with 与四种模式、shutil 各函数与 rmtree 危险、tempfile 用途与陷阱、os.environ 与平台判断、subprocess 与 shell=True 注入。

## 第一部分 · 选择题

```quiz
type: choice
q: 以下哪个 open 模式会在文件已存在时清空其内容？
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
explain: r 只读、a 追加保留原内容、x 存在抛异常，只有 w 会清空已有文件。
```

```quiz
type: choice
q: 关于 shutil.copytree，以下说法正确的是？
code: |
  a. 目标目录已存在时可以直接覆盖
  b. 目标目录已存在时会抛 FileExistsError
  c. ignore 参数只能跳过 .git 目录
  d. copytree 只能复制文件，不能复制目录
options:
- a
- b
- c
- d
answer: 1
explain: copytree 要求目标不存在，存在则抛 FileExistsError。可用 dirs_exist_ok=True 改变此行为，ignore 可自定义。
```

```quiz
type: choice
q: 关于 tempfile.NamedTemporaryFile，默认情况下以下说法正确的是？
code: |
  a. delete=True，退出 with 块时文件被删除
  b. delete=True，文件会一直保留直到系统重启
  c. 文件名一定以 .txt 结尾
  d. 必须手动调用 close 才能关闭
options:
- a
- b
- c
- d
answer: 0
explain: NamedTemporaryFile 默认 delete=True，退出上下文时删除。后缀由 suffix= 指定，with 语句自动关闭。
```

```quiz
type: choice
q: 在 Windows 上，sys.platform 的返回值通常是？
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
explain: sys.platform 在 Windows 上返回 "win32"，Linux 返回 "linux"，macOS 返回 "darwin"。
```

```quiz
type: choice
q: 以下哪种 subprocess 调用方式是安全的（filename 来自不可信用户输入）？
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
explain: 列表形式不经过 shell 解析，特殊字符按字面量处理。a/c/d 都用了 shell=True 拼字符串，存在命令注入。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 safe_rmtree_plan，接收一个模拟的目录树字典（key 为路径、value 为 "dir" 或 "file"）和一个目标路径，返回删除计划：先检查目标是否存在且为目录，返回 {"deleted": 被删除的路径列表（所有以目标为前缀的条目，递归）, "skipped": 跳过原因字符串或 None}。不存在返回 skipped="not found"，是文件返回 skipped="not a directory"。
func: safe_rmtree_plan
starter: |
  def safe_rmtree_plan(tree, target):
      return {"deleted": [], "skipped": None}
cases: |
  {"a/": "dir", "a/b.txt": "file", "a/c/": "dir", "other.txt": "file"}, "a/" -> {"deleted": ["a/", "a/b.txt", "a/c/"], "skipped": None}
  {"a.txt": "file"}, "a.txt" -> {"deleted": [], "skipped": "not a directory"}
  {"a/": "dir"}, "missing/" -> {"deleted": [], "skipped": "not found"}
hint: 规范化 target（去掉末尾斜杠后作为前缀），遍历 tree 找所有以 target 开头的键。
explain: 模拟 rmtree 的安全检查 + 计划生成，纯字典操作不碰文件系统。
```

```quiz
type: code
q: 写一个函数 parse_env_config，接收一个模拟的环境变量字典和一个必需项列表，返回配置字典。规则：逐项读取，缺失的项收集到错误信息里；值为 "true"/"false" 转布尔，"null"/"none"（大小写不敏感）转 None，纯数字转 int，否则保留字符串。若任何必需项缺失，抛 RuntimeError 列出所有缺失项。
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
hint: 先收集缺失项，有缺失就 raise。转换按 布尔→None→int→字符串 顺序。
explain: 模拟环境变量解析，含缺失校验和类型转换。
```

## 第三部分 · 小项目

```quiz
type: function
q: 实现一个临时文件生命周期模拟器 tempfile_lifecycle。接收操作列表，模拟 NamedTemporaryFile / mkdtemp 的创建与清理。操作列表形如 [("create_tempfile", name), ("create_tempfile", name2), ("create_dir", dirname), ("crash",), ("cleanup",)]。规则：create_tempfile 创建临时文件（存到列表），create_dir 创建临时目录（存到列表，需要 finally 清理），crash 模拟中途异常——若之后还有操作则跳过，cleanup 把所有已创建的文件和目录都清理掉。返回 {"files": 剩余文件数, "dirs": 剩余目录数, "cleaned": 已清理总数, "crashed": 是否发生过 crash}。
func: tempfile_lifecycle
starter: |
  def tempfile_lifecycle(operations):
      return {"files": 0, "dirs": 0, "cleaned": 0, "crashed": False}
cases: |
  [("create_tempfile","a"),("create_dir","d"),("cleanup",)] -> {"files": 0, "dirs": 0, "cleaned": 2, "crashed": False}
  [("create_tempfile","a"),("crash",),("create_tempfile","b")] -> {"files": 1, "dirs": 0, "cleaned": 0, "crashed": True}
  [] -> {"files": 0, "dirs": 0, "cleaned": 0, "crashed": False}
hint: 用两个列表维护已创建的文件和目录。遇到 cleanup 就清空（模拟 finally）。遇到 crash 之后不再执行后续操作。
explain: 综合考察 try/finally 生命周期管理。crash 模拟异常中断，验证清理逻辑。
```
