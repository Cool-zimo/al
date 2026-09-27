# 第 2 章 · 向量化与广播 · 大测验

> 8 道题。这是 NumPy 最核心也最容易绕晕的一章，测验里既有概念题，也有真正调用你写的函数来判分的题。
> **全对才算通过这一章** —— 没通过的题会自动进入你的复习计划。

## 第一部分 · 选择题

```quiz
type: choice
q: 向量化之所以快，根本原因是？
options:
- 因为它用 Python 写的循环，但优化过
- 因为批量运算由底层 C 代码完成，且数据在内存中连续存放
- 因为它会自动降低计算精度
- 因为它跳过了类型检查，所以结果可能不准
answer: 1
explain: 两条原因：连续内存（缓存友好）+ 底层 C 批量执行（不经 Python 解释器逐条走）。它不会降低精度，也不会跳过正确性检查。
```

```quiz
type: choice
q: np.where(scores < 60, 0, scores) 做了什么？
options:
- 返回所有低于 60 分的成绩
- 低于 60 的替换成 0，其余保留原值
- 把 0 替换成 60
- 统计低于 60 分的人数
answer: 1
explain: np.where(条件, 成立时的值, 不成立时的值) 是逐元素三元运算。这里低于 60 的位置取 0，其余位置取原成绩。想"只取满足条件的元素"要用布尔索引 scores[scores < 60]。
```

```quiz
type: choice
q: 形状 (2,3) 的数组加形状 (2,) 的数组，结果是？
options:
- (2,3)，(2,) 拉伸到每一列
- (2,3)，(2,) 拉伸到每一行
- 报错，无法广播
- (2,)，多余部分被丢弃
answer: 2
explain: 这是广播最经典的坑：(2,) 补 1 成 (1,2)，最后一位 2 与 (2,3) 的 3 对不上，无法广播。想按行加必须改写成 (2,1) —— reshape(-1,1) 或 v[:, np.newaxis]。
```

```quiz
type: choice
q: 关于 np.maximum 和 np.max，正确的是？
options:
- 两者完全一样
- np.maximum(a,b) 逐位置取大者返回数组；np.max(a) 找出全局最大的一个值
- np.max 返回数组，np.maximum 返回标量
- np.maximum 只能用于一维数组
answer: 1
explain: 带 mum 的是"逐元素两两比较"，返回数组；不带的是"聚合"，返回标量。这个命名区别贯穿整个 NumPy（minimum/min、maximum/max）。
```

```quiz
type: choice
q: 有一份 (3,4) 的成绩表，想按"每个学生自己的平均分"做中心化，正确的做法是？
options:
- scores - scores.mean(axis=1)
- scores - scores.mean(axis=1).reshape(-1, 1)
- scores - scores.mean(axis=0)
- scores - scores.mean()
answer: 1
explain: mean(axis=1) 得到 (3,)，会被对齐到列方向，与 (3,4) 对不上而报错。必须 reshape 成 (3,1)，明确"这是每个学生的一个数"，才能沿行方向广播。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 用 np.where 把数组中低于 0 的值全部改成 0，打印结果
starter: |
  import numpy as np
  
  arr = np.array([3, -2, 0, -9, 5])
  
  # 提示：np.where(arr < 0, 0, arr)
  # 结果应该是 [3 0 0 0 5]
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "[3 0 0 0 5]" in __out
hint: print(np.where(arr < 0, 0, arr))。三个参数：条件、成立时取的值、不成立时取的值。
explain: "截断负数"在数据清洗和机器学习里极常见（ReLU 激活函数就是它）。用 np.where 一行完成，语义清晰。
```

```quiz
type: function
q: 写 row_add(m, v)：给矩阵 m 的每一行分别加上向量 v 中对应的值
func: row_add
starter: |
  import numpy as np
  
  def row_add(m, v):
      # m 是 (2,3) 的二维数组
      # v 是长度为 2 的一维数组（每个行一个偏移量）
      # 提示：直接 m + v 会报错！需要先把 v 变成列 (2,1)
      return None
cases: |
  [[1,2,3],[4,5,6]], [10,20] -> [[11,12,13],[24,25,26]]
  [[0,0]], [5,7] -> [[5,5],[7,7]]
hint: return np.array(m) + np.array(v).reshape(-1, 1)。把 v 变成列向量 (2,1)，才能沿行方向广播到 3 列。
explain: 这道题考的是"按行广播"这个核心动作。直接相加会因为 (2,) 对齐到列方向而报错；reshape(-1,1) 明确表达"每个行一个值"后，广播就能顺利拉伸到每一列。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「成绩标准化器」：读入一份成绩表，按列标准化（z-score），输出每个人的相对强弱
checklist:
- 创建了二维数组（至少 3 行 3 列）
- 用 axis=0 算出了每一列的均分和标准差
- 用广播完成了 (原始值 - 均分) / 标准差
- 至少用了一次 np.where 或 np.clip 做额外处理
- 用 f-string 输出了整齐的结果
- 代码能跑通，没有报错
starter: |
  import numpy as np
  
  # 4 个学生 × 3 门课
  scores = np.array([[80, 90, 70],
                     [60, 75, 85],
                     [95, 88, 92],
                     [70, 65, 78]])
  
  # 每门课的均分和标准差（axis=0 表示跨行，得到每列的结果）
  col_mean = scores.mean(axis=0)
  col_std = scores.std(axis=0)
  
  # 用广播做标准化：(scores - col_mean) / col_std
  z = (scores - col_mean) / col_std
  
  print("标准化后（正数=高于平均）：")
  print(np.round(z, 2))
  
  # 继续补充：找出每个学生最强的科目（用 argmax(axis=1)）
hint: 每门课均分用 scores.mean(axis=0)。标准化后正数表示高于平均。找最强科目用 np.argmax(z, axis=1)。用 np.round(z, 2) 让输出更好看。
explain: 这个项目把第 2 章串起来了：向量化运算（不用循环）、axis 的概念、广播（把列均分应用到所有行）、条件处理、结果输出。真实的数据预处理流程，本质上就是这些动作的组合。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
import numpy as np
arr = np.array([3, -2, 0, -9, 5])
print(np.where(arr < 0, 0, arr))
```

**动手题 2：**

```python
import numpy as np

def row_add(m, v):
    m = np.array(m)
    v = np.array(v).reshape(-1, 1)
    return m + v
```

**小项目：**

```python
import numpy as np

scores = np.array([[80, 90, 70],
                   [60, 75, 85],
                   [95, 88, 92],
                   [70, 65, 78]])

col_mean = scores.mean(axis=0)
col_std = scores.std(axis=0)
z = (scores - col_mean) / col_std

subjects = ["语文", "数学", "英语"]
print("=" * 34)
for i in range(z.shape[0]):
    best = np.argmax(z[i])
    print(f"  学生{i+1}  最强科目：{subjects[best]}")
print("标准化矩阵：")
print(np.round(z, 2))
print("=" * 34)
```

</details>

## 这一章，你学会了什么

- **向量化**：把"逐个处理"变成"整体操作"，快一个数量级；`np.where` 替代 if-else 循环
- **ufunc**：逐元素的通用函数，数学/取整/三角/比较/累计一应俱全
- **广播规则**：维度少的左边补 1，从右往左逐位比，相等或有一个是 1 就能广播
- **两个方向**：`(n,)` 按列广播；想按行必须先 `reshape(-1, 1)`
- **读报错**：报错信息里已经列出了两个形状，右对齐一比就知道哪一维出问题
- **防御**：广播是静默的，做完立刻 `print(.shape)`

下一章讲**索引与聚合**——如何精确地取出你想要的那部分数据。
