# 第 1 章 · 从列表到数组 · 大测验

> 8 道题。选择题检验概念，动手题让你真的写出代码，最后一道小项目把整章串起来。
> **全对才算通过这一章** —— 没通过的题会自动进入你的复习计划。

## 第一部分 · 选择题

```quiz
type: choice
q: np.linspace(0, 10, 5) 生成的是什么？
options:
- [0, 2, 4, 6, 8]
- [0, 2.5, 5, 7.5, 10]
- [0, 3, 6, 9]
- [2, 4, 6, 8, 10]
answer: 1
explain: linspace 第三个参数是"个数"，且包含首尾。0 到 10 等分 5 份，步长 2.5。arange(0, 10, 2) 才是 [0,2,4,6,8]（按步长、不含终点）。
```

```quiz
type: choice
q: 执行 arr = np.array([1,2,3], dtype=int); arr[0] = 3.9 后，arr[0] 是？
options:
- 3.9
- 3
- 4
- 报错
answer: 1
explain: int 类型数组会静默截断小数，3.9 变成 3，且不报错。这类"悄悄发生"的类型转换是数值 bug 的常见来源。
```

```quiz
type: choice
q: 关于数组的切片 arr[1:3]，正确的是？
options:
- 它复制出一份新数据，改它不影响原数组
- 它是原数组的一个视图，改它会影响原数组
- 它和列表切片行为完全一样
- 它会改变原数组的长度
answer: 1
explain: 数组切片返回视图（view），不复制数据。想要独立副本必须写 arr[1:3].copy()。列表切片则是复制 —— 两者行为相反，是最容易混淆的陷阱。
```

```quiz
type: choice
q: 为什么 NumPy 数组比列表快？
options:
- 因为 NumPy 是用 Python 写的，优化得更好
- 因为元素在内存里连续存放，且批量运算由底层 C 代码完成
- 因为数组不支持字符串，所以更快
- 因为数组会自动丢弃精度
answer: 1
explain: 两个原因：连续内存（缓存友好）+ 底层 C 循环（不经过 Python 解释器逐条执行）。跟"用什么语言写"和"丢精度"都没关系。
```

```quiz
type: choice
q: np.array([1,2,3]) * np.array([2,3,4]) 的结果是？
options:
- [2, 6, 12]
- 20
- 报错
- [[2,3,4],[4,6,8],[6,9,12]]
answer: 0
explain: 数组的 * 是逐元素相乘，得 [1×2, 2×3, 3×4] = [2,6,12]。矩阵乘法要用 @ 或 np.dot()。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 创建 0~11 的数组，排成 3 行 4 列并打印
starter: |
  import numpy as np
  
  # np.arange(12) 造出 0~11
  # 再 reshape 成 3 行 4 列
  # 打印它
  
  print("在这里改")
tests:
- assert "[[ 0  1  2  3]" in __out
- assert "[ 8  9 10 11]]" in __out
hint: arr = np.arange(12) 然后 print(arr.reshape(3, 4))。reshape 要求总数一致：3 × 4 = 12。
explain: arange 造数据 + reshape 定形状，这是创建二维数据最常用的组合。也可以用 reshape(3, -1) 让 NumPy 自己算列数。
```

```quiz
type: code
q: 用向量化方式，把数组里每个元素加 100，再求和
starter: |
  import numpy as np
  
  arr = np.array([1, 2, 3, 4, 5])
  
  # 不需要循环：直接 arr + 100
  # 然后求和（答案应该是 515）
  
  print("在这里改")
tests:
- assert "515" in __out
hint: print((arr + 100).sum())。arr + 100 会把 100 加到每个元素上，得到 [101,102,103,104,105]，求和是 515。
explain: 标量会自动"广播"到每个元素，这是向量化最直观的体现。整个操作一行完成，不需要任何 for 循环。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「班级成绩统计器」：生成随机成绩，用数组算出各项统计指标，输出一份整洁的报告
checklist:
- 用 np.random 生成了一组随机成绩（至少 20 个）
- 用 np.zeros 或类似方式创建了数组，而不是 Python 列表
- 至少用了 3 个聚合函数（mean / max / min / std 等）
- 用比较运算 + sum 统计了"及格人数"之类的数量
- 用 f-string 输出了格式整齐的报告
- 代码能跑通，没有报错
starter: |
  import numpy as np
  
  np.random.seed(42)
  # 生成 30 个 0~100 的随机成绩（整数）
  scores = np.random.randint(0, 101, 30)
  
  print("=" * 30)
  print(f"平均分：{np.mean(scores):.1f}")
  print(f"最高分：{np.max(scores)}")
  print(f"最低分：{np.min(scores)}")
  
  # 继续补充：及格人数（>= 60）、标准差、优秀率（>= 85）
  
  print("=" * 30)
hint: 数及格人数用 np.sum(scores >= 60) —— 布尔数组求和时 True 当 1。标准差用 np.std(scores)。优秀率可以用 np.mean(scores >= 85)。
explain: 这个项目把第 1 章串起来了：创建数组、向量化运算、比较运算、聚合统计、格式化输出。真实的数据分析工作，本质上就是把这套流程跑在不同的数据上。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
import numpy as np
arr = np.arange(12)
print(arr.reshape(3, 4))
```

**动手题 2：**

```python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print((arr + 100).sum())
```

**小项目：**

```python
import numpy as np

np.random.seed(42)
scores = np.random.randint(0, 101, 30)

line = "=" * 34
print(line)
print(f"  人数：{scores.size}")
print(f"  平均分：{np.mean(scores):.1f}")
print(f"  最高分：{np.max(scores)}")
print(f"  最低分：{np.min(scores)}")
print(f"  标准差：{np.std(scores):.1f}")
print(f"  及格人数：{np.sum(scores >= 60)}")
print(f"  优秀率：{np.mean(scores >= 85) * 100:.1f}%")
print(line)
```

</details>

## 这一章，你学会了什么

- **为什么需要数组**：列表的 `+` 是拼接、循环慢、内存散；数组是连续内存 + 底层批量运算
- **六种创建方式**：`array`、`zeros`、`ones`、`arange`、`linspace`、随机（形状参数要传元组）
- **dtype 与 shape**：同类型是前提，静默截断要当心；`reshape` 改形状，`-1` 自动推算
- **基本运算**：标量广播、逐元素运算、比较得布尔数组、`argmax` 给下标不给值
- **取舍**：算用数组，存用列表；别反复 `np.append`；切片是视图不是副本

下一章会讲**向量化与广播**——那是 NumPy 真正强大、也真正容易绕晕的地方。
