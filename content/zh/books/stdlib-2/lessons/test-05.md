# 第 5 章章测 · 归档与压缩

> 8 道题，覆盖 zipfile 读写、tarfile 三种压缩格式选择、什么文件压了白压、glob/fnmatch、备份工具综合。

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 zipfile 的 read 方法，以下说法正确的是？
code: |
  a. 返回解码后的字符串
  b. 返回字节串 bytes
  c. 只能读取文本文件
  d. 读取时会自动解压并打印
options:
- a
- b
- c
- d
answer: 1
explain: ZipFile.read() 永远返回 bytes，文本需要手动 decode("utf-8")。
```

```quiz
type: choice
q: 关于 tar 的三种压缩格式，压缩率从高到低的正确排序是？
code: |
  a. .tar.gz > .tar.bz2 > .tar.xz
  b. .tar.xz > .tar.bz2 > .tar.gz
  c. .tar.bz2 > .tar.xz > .tar.gz
  d. 三者压缩率完全一样
options:
- a
- b
- c
- d
answer: 1
explain: xz(LZMA) 压缩率最高，bzip2 次之，gzip 最低（但速度最快）。
```

```quiz
type: choice
q: 以下哪种文件类型压缩后体积几乎不会减小？
code: |
  a. 大型纯文本日志
  b. 大型 JSON 数据导出
  c. mp4 视频
  d. Python 源码目录
options:
- a
- b
- c
- d
answer: 2
explain: mp4 内部已压缩，信息熵接近最大，再压基本无收益。文本、JSON、源码都有大量冗余。
```

```quiz
type: choice
q: 关于 fnmatch，以下说法正确的是？
code: |
  a. 使用正则表达式语法
  b. ? 匹配任意多个字符
  c. [!abc] 匹配不是 a、b、c 的单个字符
  d. * 只匹配单个字符
options:
- a
- b
- c
- d
answer: 2
explain: fnmatch 是 shell 风格：* 匹配任意个、? 匹配单个、[!abc] 是反向字符集。不用正则语法。
```

```quiz
type: choice
q: glob.glob("**/*.py") 默认行为（不传 recursive）是？
code: |
  a. 递归匹配所有子目录下的 .py
  b. 只匹配当前目录下的 .py，不递归
  c. 报错，因为 ** 必须配合 recursive=True
  d. 匹配名为 "**" 的目录下的 .py（若有）
options:
- a
- b
- c
- d
answer: 3
explain: 默认 recursive=False，此时 ** 是字面量，glob 会去找名为 ** 的目录。必须用 recursive=True 才递归。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 archive_summary，接收一个模拟的 zip/tar 条目列表（每项 {"name": str, "size": int, "csize": int}），返回归档摘要字典：{"count": 文件数, "raw_total": 原始总大小, "compressed_total": 压缩后总大小, "ratio": 压缩率(0~1), "space_saved": 节省百分比(0~100)}。空列表 ratio 和 space_saved 均为 0。
func: archive_summary
starter: |
  def archive_summary(entries):
      return {"count": 0, "raw_total": 0, "compressed_total": 0, "ratio": 0, "space_saved": 0}
cases: |
  [{"name": "a.txt", "size": 1000, "csize": 200}, {"name": "b.txt", "size": 1000, "csize": 200}] -> {"count": 2, "raw_total": 2000, "compressed_total": 400, "ratio": 0.2, "space_saved": 80.0}
  [] -> {"count": 0, "raw_total": 0, "compressed_total": 0, "ratio": 0, "space_saved": 0}
  [{"name": "x.jpg", "size": 1000, "csize": 980}] -> {"count": 1, "raw_total": 1000, "compressed_total": 980, "ratio": 0.98, "space_saved": 2.0}
hint: 聚合三档数值，ratio=csize合计/size合计，space_saved=(1-ratio)*100。
explain: 纯聚合计算，压缩率和节省空间都用比例表达。
```

```quiz
type: code
q: 写一个函数 backup_excludes，给定文件列表和排除规则列表（fnmatch 模式），返回被排除的文件列表（保持原顺序）。排除规则要同时匹配完整路径和任意一段目录名。
starter: |
  from fnmatch import fnmatch

  def backup_excludes(files, rules):
      return []
tests:
- assert backup_excludes(["a.py", "__pycache__/x.py", ".git/config"], ["__pycache__", ".git", "*.pyc"]) == ["__pycache__/x.py", ".git/config"]
- assert backup_excludes(["main.py", "data.csv"], ["__pycache__"]) == []
- assert backup_excludes(["node_modules/x.js"], ["node_modules"]) == ["node_modules/x.js"]
hint: 对每条文件的完整路径和每个目录段都用 fnmatch 试一遍所有规则。
explain: 模拟备份工具的排除逻辑，要匹配目录段，和本课的 should_exclude 一致。
```

## 第三部分 · 小项目

```quiz
type: function
q: 实现一个完整的备份工具函数 make_backup_report。接收三个参数：files（相对路径列表）、sizes（路径->字节数字典）、excludes（排除规则列表）。返回一个完整报告字典：{"archive_name": "myproject_20260928_143000.tar.gz", "included": 纳入文件列表, "excluded": 排除文件列表, "raw_total": 纳入总大小, "estimated": 按 0.4 压缩估算的归档大小, "manifest": 每个纳入文件的 {"path","size","checksum"} 列表（checksum 用 hashlib.md5(path.encode()).hexdigest()[:12]）, "ratio": estimated/raw_total}。archive_name 用固定时间戳 20260928_143000。空 files 时 included/maifest 为空、各项为 0、ratio 为 0。
func: make_backup_report
starter: |
  import hashlib

  def make_backup_report(files, sizes, excludes):
      return {}
cases: |
  ["main.py","__pycache__/x.py","data.txt"], {"main.py":1000,"__pycache__/x.py":500,"data.txt":2000}, ["__pycache__","*.pyc"] -> {"archive_name":"myproject_20260928_143000.tar.gz","included":["main.py","data.txt"],"excluded":["__pycache__/x.py"],"raw_total":3000,"estimated":1200,"manifest":[{"path":"main.py","size":1000,"checksum":...},{"path":"data.txt","size":2000,"checksum":...}],"ratio":0.4}
  [], {}, [] -> {"archive_name":"myproject_20260928_143000.tar.gz","included":[],"excluded":[],"raw_total":0,"estimated":0,"manifest":[],"ratio":0}
hint: 排除判断匹配完整路径和目录段；checksum 用 md5(path).hexdigest()[:12]；ratio = estimated/raw_total，raw 为 0 时 ratio 为 0。
explain: 综合项目：把本课所有知识点串起来——排除规则、大小聚合、压缩估算、清单与校验。
```
