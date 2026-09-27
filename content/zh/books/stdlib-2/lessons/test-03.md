# 第 3 章章测 · 路径与文件系统

> 10 道题，覆盖 os.path vs pathlib、Path 的 `/` 运算符与 name/stem/suffix/parent、iterdir/glob/rglob 与 os.walk、stat 与时间戳转换、批量重命名。

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 os.path 和 pathlib 的区别，以下说法正确的是？
code: |
  a. os.path 是面向对象风格，pathlib 是函数式风格
  b. pathlib 是面向对象风格，os.path 是函数式风格
  c. 两者完全一样，没有任何区别
  d. pathlib 只能用于 Windows
options:
- a
- b
- c
- d
answer: 1
explain: pathlib 提供面向对象的 Path 类，方法链式调用；os.path 是模块级函数式 API。两者底层类似，但风格不同。
```

```quiz
type: choice
q: 对于 Path("/home/zhangsan/docs/archive.tar.gz")，p.stem 的返回值是什么？
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
explain: stem 是去掉最后一个后缀后的名字。archive.tar.gz → 去掉 .gz → archive.tar。
```

```quiz
type: choice
q: 以下哪个 glob 模式会递归匹配所有子目录下的 .py 文件？
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
explain: ** 表示匹配任意层级目录。glob("*.py") 只匹配当前层级，iterdir() 不递归。
```

```quiz
type: choice
q: 关于 os.walk() 返回的三元组 (dirpath, dirnames, filenames)，以下说法正确的是？
code: |
  a. dirpath 是 Path 对象
  b. dirnames 是当前目录下的子目录名列表
  c. filenames 包含子目录名
  d. 三元组的顺序是 (filenames, dirnames, dirpath)
options:
- a
- b
- c
- d
answer: 1
explain: os.walk() 返回 (dirpath, dirnames, filenames)，dirpath 是字符串，dirnames 是子目录名列表，filenames 是文件名列表。
```

```quiz
type: choice
q: 以下哪个操作正确地把时间戳转为北京时间字符串？
code: |
  a. datetime.fromtimestamp(ts).strftime(fmt)
  b. datetime.fromtimestamp(ts, tz=timezone(timedelta(hours=8))).strftime(fmt)
  c. str(ts)
  d. time.ctime(ts).encode()
options:
- a
- b
- c
- d
answer: 1
explain: 用 timezone(timedelta(hours=8)) 明确指定东八区，fromtimestamp 才不会依赖系统本地时区。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 path_parts，接收路径字符串，返回字典 {"name": 文件名, "stem": 主名, "suffix": 最后后缀, "parent": 父目录}。用 PurePath 纯计算，不碰文件系统。
func: path_parts
starter: |
  from pathlib import PurePath

  def path_parts(path_str):
      return {}
cases: |
  "/home/zhangsan/docs/report.pdf" -> {"name": "report.pdf", "stem": "report", "suffix": ".pdf", "parent": "/home/zhangsan/docs"}
  "archive.tar.gz" -> {"name": "archive.tar.gz", "stem": "archive.tar", "suffix": ".gz", "parent": "."}
  "/data/logs/2024/01.log" -> {"name": "01.log", "stem": "01", "suffix": ".log", "parent": "/data/logs/2024"}
hint: PurePath(path_str).name / .stem / .suffix / .parent
explain: PurePath 提供与 Path 相同的路径解析属性，但不涉及文件系统访问。
```

```quiz
type: code
q: 写一个函数 filter_by_depth，接收一个模拟目录列表（如 ["a.txt", "b/c.py", "d/e/f.md"]）和一个最大深度（整数），返回深度不超过 max_depth 的路径列表。深度定义为路径中 '/' 的个数。
starter: |
  def filter_by_depth(file_list, max_depth):
      return []
tests:
- assert filter_by_depth(["a.txt", "b/c.py", "d/e/f.md"], 1) == ["a.txt", "b/c.py"]
- assert filter_by_depth(["a.txt", "b/c.py", "d/e/f.md"], 0) == ["a.txt"]
- assert filter_by_depth(["a/b/c/d.txt"], 3) == ["a/b/c/d.txt"]
hint: 深度 = path_str.count('/')。过滤 count <= max_depth 的项。
explain: count('/') 就是路径深度。深度 0 = 无斜杠（当前目录文件），深度 1 = 一层子目录。
```

## 第三部分 · 小项目

```quiz
type: function
q: 实现一个批量重命名预览函数 batch_rename_preview。接收目录路径字符串、匹配模式（如 "*.txt"）、规则名称（"upper" 或 "lower"），返回将要执行的重命名列表——每个元素是 (原文件名, 新文件名) 的元组列表。纯模拟，不碰文件系统。
func: batch_rename_preview
starter: |
  from pathlib import PurePath

  def batch_rename_preview(directory, pattern, rule):
      # 这里用模拟方式：假设 directory 下有以下文件（用 PurePath 模拟）
      # 实际上你只需要根据规则对文件名做变换并返回计划列表
      return []
cases: |
  "/tmp/docs","*.txt","upper" -> [("notes.txt", "NOTES.TXT"), ("readme.txt", "README.TXT")]
  "/tmp","*.md","lower" -> [("README.md", "readme.md")]
hint: 模拟文件列表用 ["notes.txt", "readme.txt"] 硬编码，根据规则做 .upper() 或 .lower() 变换。
explain: 实战中这里会遍历目录，但测试只需对给定文件名按规则变换并返回计划。
```
