# 第 3 章 · 效率工具 · 大测验

> 8 道题。这一章解决的是"用更少的代码、更快的速度、更稳的结构"处理数据——`Counter`、`defaultdict`、`deque`、`itertools`、`functools` 五个家族的工具。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 需要频繁从序列头部删除元素（类似 FIFO 队列），应该选哪个？
options:
- list 配合 pop(0)
- deque 配合 popleft()
- 普通 dict
- set
answer: 1
explain: deque.popleft() 是 O(1)，list.pop(0) 是 O(n)，数据量大时差距悬殊。dict 和 set 与此场景无关。
```

```quiz
type: choice
q: 关于 Counter 的行为，以下说法正确的是？
options:
- Counter 访问不存在的键会抛 KeyError
- Counter 是 dict 的子类，支持大部分字典操作
- Counter 只能接收字符串作为参数
- Counter 的 most_common 返回的是按字母排序的列表
answer: 1
explain: Counter 是 dict 的子类，是它所有便利的来源。访问不存在的键返回 0 而非报错；它可接受任何可迭代对象；most_common 按频次降序排列。
```

```quiz
type: choice
q: 关于 Python 3.7+ 的字典，以下说法正确的是？
options:
- 普通 dict 不保证插入顺序，必须用 OrderedDict
- 普通 dict 保证插入顺序，OrderedDict 主要用于精确的顺序控制操作
- OrderedDict 比 dict 快得多，应该总是优先使用
- dict 和 OrderedDict 的 == 比较行为完全一致
answer: 1
explain: Python 3.7+ 起普通 dict 已保证插入顺序，OrderedDict 现在主要价值在 move_to_end/popitem 等精确顺序控制，以及顺序敏感的相等比较。
```

```quiz
type: choice
q: 关于 itertools.groupby，以下说法正确的是？
options:
- 它会自动先对序列排序
- 它只把相邻的、键相等的元素归为一组，使用前通常需要先 sorted
- 它和 list 的 groupby 方法功能相同
- 它返回的每组是列表类型
answer: 1
explain: groupby 只归并相邻且键相等的元素，不自动排序；这就是"必须先 sorted"这个坑的来源。它返回的是迭代器，每组是迭代器而非列表。
```

```quiz
type: choice
q: 关于 lru_cache，以下说法正确的是？
options:
- 它可以缓存任意函数，包括参数是列表的
- 它会把相同入参的重复调用结果缓存，避免重复计算
- 它会自动让函数变快，不需要考虑参数类型
- 它只能用在递归函数上
answer: 1
explain: lru_cache 的核心是"相同入参命中缓存"。参数是列表等不可哈希类型时会 TypeError；它不自动变快——只有存在重复入参时才有效；非递归函数同样可用。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 group_by_first_char，接收一个单词列表，返回一个字典：键是每个单词的首字母（小写），值是"以该字母开头的所有单词组成的列表"。
func: group_by_first_char
starter: |
  from collections import defaultdict

  def group_by_first_char(words):
      return {}
cases: |
  ["Apple", "ant", "Banana", "apple", "berry"] -> {"a": ["Apple", "ant", "apple"], "b": ["Banana", "berry"]}
  [] -> {}
  ["cat"] -> {"c": ["cat"]}
hint: d = defaultdict(list)，遍历时 d[w[0].lower()].append(w)，最后 return dict(d)。
explain: 分组归并是 defaultdict(list) 的主场，首字母统一小写用 w[0].lower()。
```

```quiz
type: function
q: 写一个函数 cartesian，接收两个列表 a 和 b，返回它们所有组合的列表，每个组合是一个元组 (a元素, b元素)。
func: cartesian
starter: |
  import itertools

  def cartesian(a, b):
      return []
cases: |
  "[1,2], ['x','y']" -> [(1, 'x'), (1, 'y'), (2, 'x'), (2, 'y')]
  "[1], [2]" -> [(1, 2)]
  "[], [1,2]" -> []
hint: 用 itertools.product(a, b) 再转成 list。
explain: product 就是笛卡尔积的原语，转 list 返回即可。空列表时 product 自然返回空。
```

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"商品组合生成器"。要求：给定一个品类列表（如 ["手机", "耳机", "保护壳"]）和一个套餐尺寸 k，用 itertools.combinations 生成"任选 k 个品类"的所有搭配方案，用 Counter 统计每种品类在全部方案里出现了几次（用于评估哪些品类最受欢迎），最后按出现次数从高到低打印品类和次数。例如 k=2 时，3 个品类每个都会出现 2 次。
checklist:
- 使用 itertools.combinations 生成搭配
- 套餐尺寸 k 可由参数控制
- 用 Counter 统计每个品类在全部方案里的出现次数
- 用 most_common 或排序按次数从高到低打印
- 能处理 k 大于品类总数的边界情况（给出空结果或合理提示）
- 至少用 4 个品类做测试
```