# 第 4 章 · 变形、拼接与排序 · 大测验

> 8 道题。这一章的函数大多很简单，难点在于"该用哪个"。
> **全对才算通过这一章**。

## 第一部分 · 选择题

```quiz
type: choice
q: 两个形状都是 (2,3) 的数组，用 concatenate(…, axis=0) 拼接，结果形状是？
options:
- (2, 6)
- (4, 3)
- (2, 3)
- 报错
answer: 1
explain: axis=0 是"往下堆"，行数相加、列数不变，得 (4, 3)。想横向接成 (2,6) 要用 axis=1。口诀：axis=n 拼第 n 维，其他维必须完全相同。
```

```quiz
type: choice
q: np.split 和 np.array_split 的区别是？
options:
- 完全一样
- split 要求能整除否则报错；array_split 允许不均分
- array_split 只支持二维数组
- split 返回数组，array_split 返回列表
answer: 1
explain: 这是两者唯一的区别但很关键，两者都返回列表。凡份数可能除不尽的场景（数据条数动态变化时几乎总是），都应该用 array_split。
```

```quiz
type: choice
q: 对数组 [1, 2] 分别做 repeat 和 tile 各 2 次，结果是？
options:
- repeat 得 [1,2,1,2]，tile 得 [1,1,2,2]
- repeat 得 [1,1,2,2]，tile 得 [1,2,1,2]
- 两者都是 [1,2,1,2]
- 两者都是 [1,1,2,2]
answer: 1
explain: repeat 作用在元素级别（每个元素各重复 N 次），tile 作用在数组级别（整块复制 N 份）。这是两者本质的区别。
```

```quiz
type: choice
q: 想让 (2,3) 的数组减去形状为 (3,) 的基准向量，最好的做法是？
options:
- 用 np.tile 先铺成 (2,3) 再减
- 直接相减，靠广播
- 用 np.repeat 展开
- 必须先 reshape
answer: 1
explain: 广播天生干这个，而且不会真的复制数据。用 tile 先铺开完全多余 —— 它会真分配一块 (2,3) 内存，数据大时代价明显。
```

```quiz
type: choice
q: np.argsort(arr) 返回的是？
options:
- 排好序的数组
- 排好序后各元素在原数组中的下标
- 每个元素的排名
- 最大值的位置
answer: 1
explain: argsort 返回下标而非值，这正是它比 sort 有用的地方：有了下标就知道"第几名是谁"，也能用它去索引同一张表的其他列。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 用 vstack 把两个一维数组堆成 2 行，打印结果
starter: |
  import numpy as np
  
  a = np.array([1, 2, 3])
  b = np.array([4, 5, 6])
  
  # np.vstack([a, b]) 会先把每个一维数组变成"一行"再上下堆
  # 结果应该是 [[1 2 3] [4 5 6]]
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "[[1 2 3]" in __out
- assert "[4 5 6]]" in __out
hint: print(np.vstack([a, b]))。v 是 vertical（竖直），它会自动把一维输入升级成"一行"再堆起来，得到 (2, 3)。
explain: vstack/hstack 的价值在于不用记 axis。而且它们会自动为一位数组补上"行/列"这一维 —— 用 concatenate 直接拼只能得到长度 6 的一维数组。
```

```quiz
type: function
q: 写 count_dups(arr)：统计有多少个"出现过不止一次"的不同值
func: count_dups
starter: |
  import numpy as np
  
  def count_dups(arr):
      # arr 是一维数组
      # 返回"出现过 2 次及以上"的不同值的个数
      # 提示：np.unique(arr, return_counts=True)
      return None
cases: |
  [1,2,2,3,3,3] -> 2
  [1,2,3] -> 0
hint: vals, counts = np.unique(np.array(arr), return_counts=True) 然后 return int(np.sum(counts > 1))。counts > 1 是布尔数组，求和就是个数。
explain: 这道题把 unique 的两个能力串起来了：去重拿到"有哪些值"，return_counts 拿到"各出现几次"，再用布尔求和数出"重复的有几种"。这是数据质量检查的常见动作。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「班级成绩榜」：拼接多科成绩表、计算总分、按总分排名、输出前 3 名并统计分数分布
checklist:
- 用 hstack 或 column_stack 拼接了不止一个数组
- 用 sum(axis=1) 算出了每人的总分
- 用 argsort 做了排名（降序）
- 用 unique + return_counts 统计了分数分布
- 用 f-string 输出了整齐的排行榜
- 代码能跑通，没有报错
starter: |
  import numpy as np
  
  # 5 个学生的语文、数学成绩
  chinese = np.array([80, 95, 88, 70, 92])
  maths   = np.array([90, 70, 85, 75, 88])
  
  # 1. 拼成 (5, 2) 的表
  scores = np.column_stack([chinese, maths])
  
  # 2. 总分
  totals = scores.sum(axis=1)
  print("总分：", totals)
  
  # 3. 继续：用 argsort 排名、输出前 3 名
  # 4. 继续：用 unique + return_counts 统计分布
hint: 排名用 np.argsort(totals)[::-1]，前 3 名取 [:3]。分数分布用 np.unique(totals, return_counts=True)。拼接两个一维数组成表用 np.column_stack。
explain: 这个项目把第 4 章串起来了：column_stack 拼表、axis 聚合、argsort 排名、unique 统计分布。真实的数据报表，本质上就是这些动作的组合。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题：**

```python
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.vstack([a, b]))
```

**函数题：**

```python
import numpy as np

def count_dups(arr):
    vals, counts = np.unique(np.array(arr), return_counts=True)
    return int(np.sum(counts > 1))
```

**小项目：**

```python
import numpy as np

chinese = np.array([80, 95, 88, 70, 92])
maths   = np.array([90, 70, 85, 75, 88])

scores = np.column_stack([chinese, maths])
totals = scores.sum(axis=1)
order = np.argsort(totals)[::-1]

line = "=" * 32
print(line)
for rank, i in enumerate(order[:3], start=1):
    print(f"  第 {rank} 名  学生{i+1}  总分 {totals[i]}")
    print(f"           语文 {chinese[i]}  数学 {maths[i]}")

print("\n分数分布：")
vals, counts = np.unique(totals, return_counts=True)
for v, c in zip(vals, counts):
    print(f"  {v} 分：{c} 人")
print(line)
```

</details>

## 这一章，你学会了什么

- **拼接**：`concatenate` + axis；记不住 axis 就用 `vstack` / `hstack`；拼表用 `column_stack`
- **分割**：`split` 要整除，`array_split` 不用；传数字是"分几份"，传列表是"在哪切"
- **repeat vs tile**：一个按元素抻长，一个整块复制；匹配形状优先用广播而不是 tile
- **排序**：`sort` 给值，`argsort` 给下标；`argsort(x)[::-1]` 降序；按某列排整表用 `tbl[argsort(tbl[:, col])]`
- **集合**：`unique`（含 return_counts）、`isin` 白名单筛选、intersect/union/setdiff

下一章讲**文件读写**——让数据能真正存下来、读回来。
