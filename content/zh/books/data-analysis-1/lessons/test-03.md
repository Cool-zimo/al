# 第 3 章 · 索引、聚合与实战 · 大测验

> 8 道题，覆盖视图陷阱、布尔索引、axis 和缺失值处理。
> **全对才算通过这一章** —— 这也是《数据分析 1》的最后一道关。

## 第一部分 · 选择题

```quiz
type: choice
q: 下面哪个操作返回的是"视图"（改它会影响原数组）？
options:
- arr[[0, 2]]（花式索引）
- arr[arr > 3]（布尔索引）
- arr[1:3]（基本切片）
- arr.copy()
answer: 2
explain: 基本切片、步长切片、reshape、转置都返回视图；花式索引和布尔索引返回副本。判断依据是"能否用连续内存窗口表达" —— 能就是视图，不能只能复制。
```

```quiz
type: choice
q: 想取出"大于等于 60 且小于 90"的成绩，正确写法是？
options:
- scores[scores >= 60 and scores < 90]
- scores[(scores >= 60) & (scores < 90)]
- scores[scores >= 60 & scores < 90]
- scores[60 <= scores < 90]
answer: 1
explain: 布尔数组之间必须用 & 和 |（Python 的 and/or 只处理单个布尔值），且每个条件都要加括号，因为 & 的优先级高于比较运算符。
```

```quiz
type: choice
q: 形状 (3, 4) 的数组执行 sum(axis=0)，结果形状是？
options:
- (3,)
- (4,)
- (3, 4)
- 一个标量
answer: 1
explain: axis=0 让第 0 维（长度 3）消失，剩下长度 4，结果是 (4,) —— 即每一列的和。口诀：删掉原形状的第 axis 位。
```

```quiz
type: choice
q: 数组里有 nan 时，np.mean(arr) 返回什么？
options:
- 自动忽略 nan 后求平均
- nan
- 0
- 报错
answer: 1
explain: 聚合函数遇到 nan 会直接返回 nan，一个缺失值就污染整个结果。要跳过缺失值必须用 np.nanmean。这是刻意的设计：逼你正视"数据有缺失"。
```

```quiz
type: choice
q: 想找出"至少有一门不及格"的学生，应该用？
options:
- np.any(scores < 60, axis=0)
- np.any(scores < 60, axis=1)
- np.all(scores < 60, axis=1)
- np.sum(scores < 60)
answer: 1
explain: axis=1 让科目那一维消失，得到"每个学生是否（any）有不及格"。axis=0 会得到"每门课是否有人不及格"；用 all 则变成"全部科目都不及格"。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 用布尔索引取出数组中所有大于 10 的元素，打印它们
starter: |
  import numpy as np
  
  arr = np.array([5, 12, 8, 20, 3, 15])
  
  # 布尔索引：arr[arr > 10]
  # 结果应该是 [12 20 15]
  
  print("在这里改")
tests:
- assert "[12 20 15]" in __out
hint: print(arr[arr > 10])。arr > 10 先得到布尔数组，放进方括号就只保留 True 的位置。
explain: 布尔索引是 NumPy 最常用的筛选手段，把"循环 + if + append"压缩成一个方括号，而且快得多。返回的是副本，改它不影响原数组。
```

```quiz
type: function
q: 写 row_max(m)：返回矩阵每一行的最小值组成的一维数组
func: row_min
starter: |
  import numpy as np
  
  def row_min(m):
      # m 是二维数组，返回每一行的最小值
      # 提示：让"列"那一维消失 → axis=1
      return None
cases: |
  [[3,1,4],[5,9,2]] -> [1,2]
  [[7,7],[8,6]] -> [7,6]
hint: return np.min(np.array(m), axis=1)。axis=1 表示跨列计算，每行得到一个数。
explain: 这道题同时考了 axis 和聚合函数：想要"每行一个数"（结果长度等于行数），就必须让列那一维消失，即 axis=1。写成 axis=0 会得到"每列的最小值"，长度等于列数。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「完整成绩分析器」：含缺失值清洗、排名、科目难度分析、补考筛选，输出一份完整报告
checklist:
- 创建了二维数组（至少 4 行 3 列）
- 处理了缺失值（用 nan 标记 + nan 安全函数）
- 用 axis 算出了每行的总分并做了排名（argsort）
- 用 axis=0 分析了每门课的均分和标准差
- 用布尔索引或 np.any 找出了需要补考的人
- 输出了格式整齐的报告，代码能跑通
starter: |
  import numpy as np
  
  np.random.seed(7)
  scores = np.random.randint(40, 101, size=(5, 4)).astype(float)
  scores[2, 1] = np.nan        # 模拟缺考
  
  line = "=" * 36
  print(line)
  
  # 一、总分与排名
  totals = np.nansum(scores, axis=1)
  for rank, i in enumerate(np.argsort(totals)[::-1], start=1):
      print(f"  第 {rank} 名  学生{i+1}  {totals[i]:.0f} 分")
  
  # 二、每门课难度（继续补充）
  # 三、偏科指数
  # 四、需要补考的人
  
  print(line)
hint: 科目均分用 np.nanmean(scores, axis=0)，偏科指数用 np.nanstd(scores, axis=1)，补考用 np.any(scores < 60, axis=1) 配合 np.where。排名用 np.argsort(totals)[::-1] 得到从高到低的顺序。
explain: 这是《数据分析 1》的收官项目，把三章全部串起来了：创建与清洗、向量化运算、广播、布尔索引、axis 聚合、nan 安全函数。做完这个，你已经有能力处理真实的结构化数据了。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
import numpy as np
arr = np.array([5, 12, 8, 20, 3, 15])
print(arr[arr > 10])
```

**动手题 2：**

```python
import numpy as np

def row_min(m):
    return np.min(np.array(m), axis=1)
```

**小项目：**

```python
import numpy as np

np.random.seed(7)
scores = np.random.randint(40, 101, size=(5, 4)).astype(float)
scores[2, 1] = np.nan

line = "=" * 36
print(line)
print("一、总分与排名")
totals = np.nansum(scores, axis=1)
for rank, i in enumerate(np.argsort(totals)[::-1], start=1):
    print(f"  第 {rank} 名  学生{i+1}  {totals[i]:.0f} 分")

print("\n二、每门课难度")
print("  均分：", np.round(np.nanmean(scores, axis=0), 1))
print("  标准差：", np.round(np.nanstd(scores, axis=0), 1))

print("\n三、偏科指数")
print("  ", np.round(np.nanstd(scores, axis=1), 1))

print("\n四、需要补考")
print("  学生：", np.where(np.any(scores < 60, axis=1))[0] + 1)
print(line)
```

</details>

## 这一章，你学会了什么

- **视图 vs 副本**：切片、reshape、转置给视图；花式索引、布尔索引给副本。不确定就 `.copy()`
- **布尔索引**：`arr[arr > 5]` 筛选，`arr[cond] = v` 批量改；多条件用 `&` `|` 且要加括号
- **聚合函数**：`sum/mean/median/std/percentile`，`argmax` 给位置不给值；`nan` 前缀版本处理缺失值
- **axis**：一句话——**axis=n 让第 n 维消失**，结果的形状就是原形状删掉第 n 位
- **keepdims**：保留被压缩的维度为 1，是广播的好搭档

## 《Python 数据分析 1》全部完成

三章走完，你已经掌握了：

1. **数组思维**：为什么用数组、怎么创建、dtype 与 shape
2. **向量化与广播**：不用循环、让不同形状协同工作
3. **索引与聚合**：精确取数、统计归纳、处理缺失

**下一本书《数据分析 2》**会讲 pandas —— 它会给数组加上"行名、列名、时间索引"，让数据操作更接近你熟悉的表格。而 NumPy 的这套数组思维，是理解 pandas 的前提。
