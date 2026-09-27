# 第 3 章 · 容器 · 大测验

> 8 道题。这一章解决的是"一批数据怎么存、怎么取、怎么去重、怎么按名字查"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 列表 a = [10, 20, 30, 40, 50]，执行 a[1:4] 的结果是？
options:
- [10, 20, 30]
- [20, 30, 40]
- [20, 30, 40, 50]
- [30, 40]
answer: 1
explain: 切片左闭右开，从下标 1（20）取到下标 4 之前（40），得到 [20, 30, 40]。
```

```quiz
type: choice
q: 关于列表和元组，下列哪个说法是正确的？
options:
- 元组用方括号 [] 定义
- 元组创建后不能修改其中的元素，列表可以
- 元组不能进行下标访问和遍历
- 列表可以当字典的键，元组不可以
answer: 1
explain: 元组用圆括号 () 且不可变；它支持下标和遍历；反过来是列表不能当字典键、元组可以。
```

```quiz
type: choice
q: scores = {"语文": 90, "数学": 95}，要安全地取出"英语"的成绩，键不存在就返回 0，应该怎么写？
options:
- scores["英语"]
- scores.get("英语")
- scores.get("英语", 0)
- scores["英语"] or 0
answer: 2
explain: get 的第二个参数是默认值，键不存在时返回 0 且不报错；不加默认值则返回 None。
```

```quiz
type: choice
q: 执行下面代码后，nums 的值是什么？
code: |
  nums = [3, 1, 2]
  nums.sort()
options:
- [1, 2, 3]
- [3, 1, 2]
- None
- 报错
answer: 0
explain: sort 是原地排序，直接修改 nums 本身，返回值是 None。注意它和返回新列表的 sorted() 不一样。
```

```quiz
type: choice
q: a = {1, 2, 3}，b = {2, 3, 4}，则 a | b 的结果是？
options:
- {1, 2, 3, 4}
- {2, 3}
- {1, 4}
- {1, 2, 2, 3, 3, 4}
answer: 0
explain: | 是并集运算，两个集合的元素合在一起并自动去重，得到 {1, 2, 3, 4}。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数，输入一个列表，去除其中重复的元素（保持元素第一次出现的顺序），返回新列表
func: dedupe
starter: |
  def dedupe(items):
      return []
cases: |
  [1, 2, 2, 3, 1] -> [1, 2, 3]
  [3, 3, 3] -> [3]
  [] -> []
  ["a", "b", "a", "c"] -> ["a", "b", "c"]
hint: 用一个集合记录已经出现过的元素，遍历原列表，没见过就加入结果并登记。
explain: 集合的查找是 O(1)，非常适合做去重。本题同时考了"遍历中不能随便删"的意识。
```

```quiz
type: function
q: 写一个函数，输入一个字典（键是姓名，值是年龄），返回年龄最大的人名；若字典为空返回 None
func: oldest
starter: |
  def oldest(people):
      return None
cases: |
  {"张三": 18, "李四": 25, "王五": 20} -> "李四"
  {"a": 1} -> "a"
  {} -> None
  {"x": 100, "y": 100} -> "x"
hint: 用 for k, v in people.items() 遍历，随时记录当前最大年龄和对应的人名。
explain: 字典遍历加状态记录是数据聚合的常见模式，空字典边界也不能漏。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"词频统计"程序：读入一段英文文本（字符串），统计每个单词出现的次数，最后按次数从高到低打印出出现最多的前 3 个单词及其次数。
checklist:
- 用 split 把文本切分成单词列表
- 用字典记录每个单词的出现次数（键为单词，值为次数）
- 统计时统一处理大小写（如都转成小写），避免 "The" 和 "the" 被当成两个词
- 用 sorted 或列表排序按次数从高到低排列结果
- 切片取前 3 个并打印，格式清晰
- 能处理空文本和只有重复单词的极端情况
starter: |
  text = "the quick brown fox jumps over the lazy dog the fox is quick"

  counts = {}

  # 切分、统一大小写、统计词频到 counts 字典
  # 然后按次数排序，取前 3 个打印
```
