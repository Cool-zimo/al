# 第 6 章 章测 · 智能文件整理器

> 这一章是收官战：前面五课学的东西，要在"智能文件整理器"这个项目里用起来。本测 8 题：5 道选择题覆盖分层与安全设计、扫描分类、规则引擎与日期归档、执行与撤销、命令行；2 道动手题练纯函数；1 道小项目把全书串起来。

---

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 智能文件整理器的分层设计中，Scanner/Classifier/Planner 三层应该是什么性质的函数？
code: |
  a. 三层都直接调用 shutil.move 移动文件
  b. 三层都只处理数据（纯函数），只有 Executor 做真实 IO
  c. 只有 Classifier 是纯函数，Scanner 和 Planner 必须读写文件系统
  d. 三层不需要区分，写在一个大函数里更清晰
options:
- a
- b
- c
- d
answer: 1
explain: 分层的核心价值就是让前三层只处理数据、便于测试，真实 IO 集中在 Executor。a/c/d 都破坏了这一点。
```

```quiz
type: choice
exam: true
q: 扫描层判断"文件是否位于忽略目录（如 __pycache__）"时，正确的判断方式是？
code: |
  a. 检查文件直接父目录的名字是否在忽略集合里
  b. 检查文件相对根目录的所有祖先目录段，任一段在忽略集合里就跳过
  c. 用字符串 in 做子串匹配即可
  d. 忽略目录不需要在扫描层处理，分类层会过滤
options:
- a
- b
- c
- d
answer: 1
explain: 嵌套目录（a/b/__pycache__/x.py）只看直接父目录会漏；子串匹配会误伤；分类层按扩展名不过滤目录。
```

```quiz
type: choice
exam: true
q: 关于规则引擎的冲突处理，以下说法正确的是？
code: |
  a. 同名文件冲突只能靠抛异常让用户介入
  b. 冲突策略可以在配置里指定为 suffix（加序号）、skip（跳过）、overwrite（覆盖）之一
  c. .tar.gz 只需按 .gz 归类，不需要特殊处理
  d. 规则必须硬编码在 if-elif 里才能快速生效
options:
- a
- b
- c
- d
answer: 1
explain: 冲突策略应可配置；a 错在必须有确定性策略；c 错在复合后缀需单独映射；d 错在规则应配置化。
```

```quiz
type: choice
exam: true
q: 执行与撤销的正确顺序是？
code: |
  a. 先移动所有文件，最后统一写一份日志
  b. 先写完整日志，再逐个移动，并实时更新每条操作的状态
  c. 撤销时按原操作顺序正向遍历即可
  d. 目标文件已存在时直接覆盖，不需要冲突策略
options:
- a
- b
- c
- d
answer: 1
explain: 先写日志再执行，崩溃后日志仍完整；撤销需反向遍历；覆盖会永久丢失文件。
```

```quiz
type: choice
exam: true
q: 用 sys.argv 手动解析命令行参数时，以下哪个边界情况必须处理？
code: |
  a. 用户传入了未知选项
  b. 带值选项（如 --undo）恰好是最后一个参数，其后没有值
  c. 参数个数超过 100 个
  d. 参数中包含中文字符
options:
- a
- b
- c
- d
answer: 1
explain: --undo 是最后一个参数时直接取 argv[i+1] 会 IndexError；其余三项不是必崩的边界。
```

---

## 第二部分 · 动手题

```quiz
type: function
exam: true
q: 实现 scan_classify(files, ext_map, size_thresholds)：files 为模拟文件信息列表（含 ext 和 size），返回按类别分组的字典，值为该类文件的 src 列表（保持原顺序）。扩展名在 ext_map 中按映射归类；不在则按大小：小于 t["tiny"] 归 "Tiny"，大于等于 t["huge"] 归 "Huge"，其余归 "其他"。
func: scan_classify
starter: |
  def scan_classify(files, ext_map, size_thresholds):
      return {}
cases: |
  [{"src":"a.jpg","ext":".jpg","size":100},{"src":"b.tmp","ext":".tmp","size":200},{"src":"c.iso","ext":".iso","size":500000000},{"src":"d.md","ext":".md","size":3000}], {".jpg":"Images",".md":"Docs"}, {"tiny":1024,"huge":104857600} -> {"Images": ["a.jpg"], "Tiny": ["b.tmp"], "Huge": ["c.iso"], "Docs": ["d.md"]}
  [], {".jpg":"Images"}, {"tiny":1024,"huge":104857600} -> {}
hint: 先查 ext_map；未命中比 tiny/huge；都不中归"其他"。用 setdefault 或提前建空列表保持顺序。
explain: 综合扫描与分类。注意扩展名映射、大小阈值、兜底分类三个层级。
```

```quiz
type: function
exam: true
q: 实现 build_undo_plan(plan)：plan 为 {dest_rel: src_abs} 的执行计划，返回撤销计划 {原dest: 原src}（键值互换的字典）。再实现 apply_with_undo(plan, log_path)：把撤销计划写入 log_path（JSON 字符串写入文件），并返回写入的字典。本题不真写文件，只返回要写的内容。
func: apply_with_undo
starter: |
  import json

  def build_undo_plan(plan):
      return {}

  def apply_with_undo(plan, log_path):
      undo = build_undo_plan(plan)
      # 返回 (undo 字典, 应写入的 JSON 字符串)
      return undo, ""
cases: |
  {"Docs/a.pdf": "/d/a.pdf", "Images/b.jpg": "/d/b.jpg"}, "/tmp/ops.json" -> ({"/d/a.pdf": "Docs/a.pdf", "/d/b.jpg": "Images/b.jpg"}, '{"/d/a.pdf": "Docs/a.pdf", "/d/b.jpg": "Images/b.jpg"}')
  {}, "/tmp/ops.json" -> ({}, "{}")
hint: 反转字典即可；JSON 序列化用 ensure_ascii=False，sort_keys=True 保证判分稳定。
explain: undo 的核心是键值反转。sort_keys 保证字典序列化结果稳定。
```

---

## 第三部分 · 小项目

**项目：迷你文件整理器（不读写真实文件）**

实现一个 `MiniOrganizer` 类，把本章前三层的核心逻辑串起来。它接收一份**模拟的文件列表**和一份**规则字典**，能给出完整的整理方案。

要求：

1. `scan(files)`：把模拟数据（含 path/size/mtime）标准化为文件信息列表，ext 统一小写，无后缀时 ext 为 ""
2. `classify(ext_map, size_thresholds)`：扩展名映射优先；未命中按大小归 Tiny/Huge/其他
3. `plan_moves(rules)`：生成目标路径字典 `{dest_rel: src}`。rules 含 date_archive(bool)、date_format(str)；为 True 时目标为 `category/日期子目录/name`，否则 `category/name`
4. `summary()`：返回 `{"total": 数量, "by_category": {类别: 数量}}`，按数量降序
5. 同名冲突用 suffix 策略加序号

**参考实现要点**（先自己写，卡住了再看）：

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
                    cat = "其他"
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


# 自测
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

**判分思路**：建议把这四类方法拆成 4 个 function 题，分别给 `scan`/`classify`/`plan_moves`/`summary` 出题，用模拟列表作为输入。可复用前面选择题里的 case。

**拓展（选做）**：给 `MiniOrganizer` 加一个 `undo_plan()` 方法，返回反转的 `{原dest: 原src}` 字典——这就是第 29 课撤销功能的全部逻辑。再加一个 `to_log()` 方法，把计划序列化成 JSON 字符串。做完这两个，你就拥有了一个"不真读写文件但逻辑完整"的整理器核心。

---

## 全书回顾速查

这一测同时是整本书的收尾回顾，下列知识点在前五章都出现过，可对照自查：

| 章节 | 核心 API | 一句话 |
|---|---|---|
| 第 1 章 时间基础 | `date`/`time`/`datetime`/`timedelta`/`strftime`/`timestamp` | 时间运算靠 `timedelta`，格式化靠 `strftime` |
| 第 2 章 时间进阶 | `zoneinfo`/`perf_counter`/`calendar` | 时区要显式声明，计时用 `perf_counter` |
| 第 3 章 路径与文件系统 | `os.path` vs `pathlib`、`Path` 操作/遍历/`stat` | 新代码一律 `pathlib`，路径是对象 |
| 第 4 章 文件与系统交互 | `with` 与模式/`shutil`/`tempfile`/`os.environ`/`subprocess` | `with` 自动关，`subprocess` 用列表传参 |
| 第 5 章 归档与压缩 | `zipfile`/`tarfile`/压缩率/`glob`/`fnmatch` | 文本可压媒体难压，排除规则用 fnmatch |
| 第 6 章 收官 | `sys.argv`/分层/安全设计/撤销日志 | 纯函数在前、IO 在后、先日志后执行 |
