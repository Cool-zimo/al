# 第 3 章 · 章测

> 八道题，覆盖列表、元组、字典、集合的巩固要点。**动手题优先 `type: function`**，请真正动手跑一遍再对答案。
> 本卷**不**包含 `exam: true` 标记，全部为自测练习。

## 第一部分 · 选择题

```quiz
type: choice
q: 执行下面代码后，a 和 b 分别是什么？
code: |
  a = [1, 2, 3]
  b = a[:]
  b.append(4)
options:
- a 是 [1, 2, 3]，b 是 [1, 2, 3, 4]
- a 是 [1, 2, 3, 4]，b 是 [1, 2, 3, 4]
- a 是 [1, 2, 3]，b 是 [1, 2, 3]
- 报错
answer: 0
explain: b = a[:] 是切片拷贝，得到一份新列表。所以改 b 不影响 a，a 保持 [1, 2, 3]，b 变成 [1, 2, 3, 4]。这是列表巩固最基础的一道题。
```

```quiz
type: choice
q: 下面哪段代码能正确删除列表里所有的偶数？
code: |
  nums = [1, 2, 3, 4, 5, 6]
options:
- "for x in nums:\n    if x % 2 == 0:\n        nums.remove(x)"
- "nums = [x for x in nums if x % 2 != 0]"
- "while x % 2 == 0:\n    nums.pop()"
- "nums.clear()"
answer: 1
explain: A 遍历时删除会跳过元素（4 会被漏掉）；B 列表推导式重建列表，正确；C 语法/逻辑都不对；D 是直接清空。过滤一律用推导式。
```

```quiz
type: choice
q: 下面哪个可以作为字典的键？
code: |
options:
- "[1, [2, 3]]"
- "(1, 2, 3)"
- "{\"a\": 1}"
- "[1, 2, (3, 4)]"
answer: 1
explain: 字典键必须可哈希。A 含列表，不可哈希；B 是纯元组，可哈希；C 是字典本身，可变；D 是列表，不可哈希。只有 B 可以。
```

```quiz
type: choice
q: 执行 `set([1, 2, 2, 3, 1])` 得到的结果是？
code: |
options:
- "{1, 2, 3, 1, 2}"
- "{1, 2, 3}"
- "set()"
- "[1, 2, 3]"
answer: 1
explain: 集合自动去重，且顺序不保证。结果里只有 1、2、3 三个元素，且输出形式是集合的花括号，不是列表的方括号。
```

```quiz
type: choice
q: 下面哪个写法能正确创建一个空集合？
code: |
options:
- "{}"
- "set()"
- "set([])"
- "以上都不对"
answer: 1
explain: {} 是空字典；set() 才是空集合；set([]) 虽然也能得到空集合，但多此一举。最直接正确的写法是 set()。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写 flatten(nested)：把一个"最多两层"的嵌套列表拍平成一维列表。例如 [[1, 2], [3, 4], [5]] 返回 [1, 2, 3, 4, 5]；[1, [2, 3], 4] 返回 [1, 2, 3, 4]。假设嵌套列表里只有整数和列表两种元素
func: flatten
starter: |
  def flatten(nested):
      # 遍历每个元素，是列表就 extend，不是就 append
      result = []
      return result
cases: |
  [[1, 2], [3, 4], [5]] -> [1, 2, 3, 4, 5]
  [1, [2, 3], 4] -> [1, 2, 3, 4]
  [] -> []
  [[1], []] -> [1]
hint: for item in nested: 如果 isinstance(item, list) 就 result.extend(item)，否则 result.append(item)。
explain: 判断元素类型用 isinstance(item, list)。是列表就 extend（把它的元素逐个加进来），不是列表就 append（整个加进去）。这题考的是对"列表里混着不同类型元素"的处理，也是很多真实场景（比如解析表格数据）的简化版。
```

```quiz
type: function
q: 写 word_frequency(text)：统计一段英文文本里每个单词出现的次数，返回出现最多的前 3 个单词及其次数，按次数从多到少排列，次数相同的按字典序从小到大。text 只有小写字母和空格。例如 "go go python go java python c++ java java" 返回 [("go", 3), ("java", 3), ("python", 2)]
func: word_frequency
starter: |
  from collections import Counter

  def word_frequency(text):
      # 用 Counter 计数，most_common 不够（次数相同排序不定），要自己 sorted
      return []
cases: |
  "go go python go java python java java" -> [("go", 3), ("java", 3), ("python", 2)]
  "a b c d e" -> [("a", 1), ("b", 1), ("c", 1)]
  "one one one" -> [("one", 3)]
hint: Counter 计数后，用 sorted 按 (-次数, 单词) 排序，再取前 3 个转成列表。
explain: 这道题把 Counter 和自定义排序连起来用。most_common 在次数相同时不保证字典序，所以题目要求排序时得自己 sorted，key 为 lambda x: (-x[1], x[0])。列表切片 [:3] 取前 3 个。
```

## 第三部分 · 小项目

**题目：简易投票统计器**

写一个函数 `vote_result(votes)`，输入是一串投票记录（列表），每一项是一个候选人姓名（字符串），可能有重复。返回一个字典，包含：

1. `"winner"`：得票最多的候选人姓名；如果多人并列第一，返回**字典序最小**的那位
2. `"ranking"`：所有候选人按得票数从多到少排列的列表，元素是 `(姓名, 票数)` 的元组；票数相同的按姓名字典序从小到大
3. `"total"`：总投票数

例如：

```
votes = ["张三", "李四", "张三", "王五", "李四", "张三", "李四"]
# 张三 3 票，李四 3 票，王五 1 票
# 并列第一是张三和李四，字典序更小的是"张三"
```

应返回：

```python
{
    "winner": "张三",
    "ranking": [("张三", 3), ("李四", 3), ("王五", 1)],
    "total": 7
}
```

**提示**：

- 用 `collections.Counter` 计数
- 排序规则统一为 `key=lambda x: (-x[1], x[0])`
- 并列第一用 `min(candidates, key=...)` 取字典序最小
- 空列表 `[]` 是非法输入，返回 `None`

**参考框架**：

```python
from collections import Counter

def vote_result(votes):
    if not votes:
        return None
    count = Counter(votes)
    ranking = sorted(count.items(), key=lambda x: (-x[1], x[0]))
    winner = min(count, key=lambda k: (-count[k], k))
    return {
        "winner": winner,
        "ranking": ranking,
        "total": len(votes)
    }
```

**拓展思考**：

1. 如果投票记录换成"每票带权重"（列表里是 `(姓名, 权重)` 元组），该怎么改？
2. 如果要支持"废票"（空字符串或 `None`），要不要单独统计？怎么设计返回结构更合理？

把这两点想清楚，这一章的容器操作你就算真正过关了。
