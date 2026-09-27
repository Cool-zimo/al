# 第 3 章 · 前缀和与差分 · 大测验

> 8 道题。这一章解决的是"如何通过预处理把区间操作从 O(n) 降到 O(1)"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 一维前缀和查询区间 [l, r] 的和，公式正确的是？
options:
- prefix[r] - prefix[l]
- prefix[r+1] - prefix[l]
- prefix[r] - prefix[l-1]
- prefix[r+1] - prefix[l+1]
answer: 1
explain: prefix[i] 表示前 i 个元素的和（nums[0..i-1]）。区间 [l,r] 的和 = 前 r+1 个元素的和 - 前 l 个元素的和 = prefix[r+1] - prefix[l]。推荐这种写法，因为 l=0 时 prefix[0]=0 天然成立，无需特判。
```

```quiz
type: choice
q: 二维前缀和构造时，容斥公式是？
options:
- prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] + prefix[i-1][j-1] + matrix[i-1][j-1]
- prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
- prefix[i][j] = prefix[i-1][j] * prefix[i][j-1] / prefix[i-1][j-1]
- prefix[i][j] = max(prefix[i-1][j], prefix[i][j-1]) + matrix[i-1][j-1]
answer: 1
explain: prefix[i-1][j] 和 prefix[i][j-1] 都包含了左上角那块区域，加在一起算了两次，所以要减去一次 prefix[i-1][j-1]。这就是容斥原理：加上边、加上边、减去重叠的左上角、加上当前元素。
```

```quiz
type: choice
q: 差分数组对区间 [l, r] 加 v 时，操作是？
options:
- diff[l] += v, diff[r] -= v
- diff[l] += v, diff[r+1] -= v（如果 r+1 < n）
- diff[l-1] += v, diff[r] -= v
- diff[l] += v, diff[r+1] += v
answer: 1
explain: 区间加 v 在 l 处产生"阶跃"（diff[l]+=v），在 r+1 处阶跃消失（diff[r+1]-=v）。这样还原时前缀和会把 v 自动传播到 l..r 的整个区间。必须判断 r+1<n，否则会越界。
```

```quiz
type: choice
q: 前缀和和差分数组的关系是什么？
options:
- 它们没有关系
- 差分是前缀和的逆运算：前缀和加速区间查询，差分加速区间修改
- 它们都是 O(n²) 的
- 前缀和用于字符串，差分用于数组
answer: 1
explain: 前缀和通过对原数组求前缀和来加速"区间求和"查询；差分通过对原数组做差分来加速"区间加减"修改。还原差分数组就是求前缀和。一个是查询、一个是修改，互为逆运算。
```

```quiz
type: choice
q: 前缀和数组为什么要比原数组多一位（长度 n+1 而不是 n）？
options:
- 为了对齐下标
- 因为 prefix[0] 必须是 0，这样查询 [0, r] 时公式 prefix[r+1]-prefix[0] 也成立
- 为了节省计算
- 为了美观
answer: 1
explain: prefix[0]=0 是"前 0 个元素的和为 0"的自然定义。有了它，查询 [0, r] 时不需要特判 —— prefix[r+1]-prefix[0] = prefix[r+1]-0，直接用同一个公式。如果没有前导 0，l=0 时就要特殊处理。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 range_sum_prefix(nums, queries)：先用前缀和处理，再返回所有查询 [l,r] 的和的列表
func: range_sum_prefix
starter: |
  def range_sum_prefix(nums, queries):
      # queries: [(l1, r1), (l2, r2), ...]
      # 先构造前缀和
      # 再逐个查询
      return []
cases: |
  [1,2,3,4,5], [(0,2),(1,3),(0,4)] -> [6,9,15]
  [10], [(0,0)] -> [10]
  [1,2,3], [(0,2)] -> [6]
hint: n=len(nums); prefix=[0]*(n+1); for i in range(n): prefix[i+1]=prefix[i]+nums[i]; result=[]; for l,r in queries: result.append(prefix[r+1]-prefix[l]); return result。单元素时 prefix=[0,10]，查询 [0,0]=prefix[1]-prefix[0]=10-0=10。
explain: 多个查询时前缀和的优势最明显：预处理一次 O(n)，每个查询 O(1)。如果每次查询都重新遍历，m 次查询就是 O(mn)。
```

```quiz
type: function
q: 写 range_add_all(nums, operations)：对 nums 执行所有区间加操作（用差分数组），返回最终数组
func: range_add_all
starter: |
  def range_add_all(nums, operations):
      # operations: [(l1, r1, v1), (l2, r2, v2), ...]
      # 构造差分数组
      # 执行所有操作
      # 还原并返回
      return nums
cases: |
  [0,0,0,0], [(0,2,1),(1,3,2)] -> [1,3,3,2]
  [5,5,5], [(0,2,10)] -> [15,15,15]
  [1,2,3,4], [(0,3,1),(1,2,-1)] -> [2,2,2,5]
hint: n=len(nums); diff=[0]*(n+1); diff[0]=nums[0]; for i in range(1,n): diff[i]=nums[i]-nums[i-1]; for l,r,v in operations: diff[l]+=v; if r+1<n: diff[r+1]-=v; result=[0]*n; result[0]=diff[0]; for i in range(1,n): result[i]=result[i-1]+diff[i]; return result。
explain: (0,2,1) 让位置 0,1,2 各加 1；(1,3,2) 让位置 1,2,3 各加 2。最终：位置0=1, 位置1=3, 位置2=3, 位置3=2。差分把每个 O(n) 的区间操作变成了 O(1)。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 实现一个「前缀和 + 差分综合工具」：包含一维前缀和构造与查询、二维前缀和构造与查询、差分数组区间加减三个功能模块
checklist:
- 实现一维前缀和：构造函数 + 查询函数，并打印至少一个查询结果
- 实现二维前缀和：构造函数 + 查询函数，并打印至少一个子矩阵和
- 实现差分数组：区间加减 + 还原，并打印最终结果
- 三个模块都有明确的边界处理（空数组、单元素等）
- 代码能跑通，没有报错
starter: |
  # ===== 一维前缀和 =====
  def build_prefix_1d(nums):
      prefix = [0] * (len(nums) + 1)
      for i in range(len(nums)):
          prefix[i + 1] = prefix[i] + nums[i]
      return prefix
  
  def query_1d(prefix, l, r):
      return prefix[r + 1] - prefix[l]
  
  # ===== 二维前缀和 =====
  def build_prefix_2d(matrix):
      m = len(matrix)
      n = len(matrix[0]) if m > 0 else 0
      prefix = [[0] * (n + 1) for _ in range(m + 1)]
      for i in range(1, m + 1):
          for j in range(1, n + 1):
              prefix[i][j] = (prefix[i-1][j] + prefix[i][j-1]
                           - prefix[i-1][j-1] + matrix[i-1][j-1])
      return prefix
  
  def query_2d(prefix, r1, c1, r2, c2):
      return (prefix[r2+1][c2+1] - prefix[r1][c2+1]
            - prefix[r2+1][c1] + prefix[r1][c1])
  
  # ===== 差分数组 =====
  def range_add_all(nums, operations):
      n = len(nums)
      diff = [0] * (n + 1)
      diff[0] = nums[0]
      for i in range(1, n):
          diff[i] = nums[i] - nums[i - 1]
      for l, r, v in operations:
          diff[l] += v
          if r + 1 < n:
              diff[r + 1] -= v
      result = [0] * n
      result[0] = diff[0]
      for i in range(1, n):
          result[i] = result[i - 1] + diff[i]
      return result
  
  # 继续：准备测试数据并打印三个模块的结果
hint: 一维用 [1,2,3,4,5] 查询 (1,3)；二维用 [[1,2,3],[4,5,6],[7,8,9]] 查询 (0,0,1,1)；差分用 [0,0,0,0] 和 [(0,2,1),(1,3,2)]。
explain: 这个项目把第 3 章三种核心技术串起来。它们的共同点是通过"预处理"把区间操作从 O(n) 降到 O(1) —— 前缀和管查询、差分管修改，是面试和竞赛中的高频工具。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**一维前缀和：**

```python
def build_prefix_1d(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

def query_1d(prefix, l, r):
    return prefix[r + 1] - prefix[l]
```

**二维前缀和：**

```python
def build_prefix_2d(matrix):
    m = len(matrix)
    n = len(matrix[0]) if m > 0 else 0
    prefix = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            prefix[i][j] = (prefix[i-1][j] + prefix[i][j-1]
                         - prefix[i-1][j-1] + matrix[i-1][j-1])
    return prefix

def query_2d(prefix, r1, c1, r2, c2):
    return (prefix[r2+1][c2+1] - prefix[r1][c2+1]
          - prefix[r2+1][c1] + prefix[r1][c1])
```

**差分数组：**

```python
def range_add_all(nums, operations):
    n = len(nums)
    diff = [0] * (n + 1)
    diff[0] = nums[0]
    for i in range(1, n):
        diff[i] = nums[i] - nums[i - 1]
    for l, r, v in operations:
        diff[l] += v
        if r + 1 < n:
            diff[r + 1] -= v
    result = [0] * n
    result[0] = diff[0]
    for i in range(1, n):
        result[i] = result[i - 1] + diff[i]
    return result
```

</details>

## 这一章，你学会了什么

- **一维前缀和**：预处理 O(n)，查询 O(1)，公式是 `prefix[r+1] - prefix[l]`
- **二维前缀和**：容斥原理，构造和查询都是四步加减
- **差分数组**：区间修改 O(1)，还原 O(n)，是前缀和的逆运算
- **适用场景**：区间查询用前缀和，区间修改用差分
- **典型应用**：人流统计、航班预订、会议室调度

**下一章：二分查找**——利用单调性，把 O(n) 的搜索降到 O(log n)。
