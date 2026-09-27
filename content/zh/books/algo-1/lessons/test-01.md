# 第 1 章 · 复杂度与算法思维 · 大测验

> 8 道题。这一章没有太多代码，但它是后面所有算法题的"判断标准"。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 大 O 记号会忽略下面哪些东西？（选最完整的一项）
options:
- 只忽略常数倍数
- 只忽略低阶项
- 忽略常数倍数和低阶项，只看最高阶的增长趋势
- 什么都不忽略
answer: 2
explain: 比如 3n + 100 记作 O(n)，n²/2 + 5n 记作 O(n²)。常数倍数（那个 3 和 1/2）和低阶项（100 和 5n）都会被丢掉，因为 n 足够大时它们对增长趋势的影响可以忽略。
```

```quiz
type: choice
q: 一段代码里有一个 O(n) 的单层循环，后面还有一个 O(n²) 的双层循环，整体复杂度是？
options:
- O(n) + O(n²)
- O(n²)
- O(n³)
- O(2n²)
answer: 1
explain: 相加时取最大的那一项，而且大 O 里不会保留加号或系数。n² 在 n 很大时完全盖过 n（n=1000 时是 1000 倍），所以整体就是 O(n²)。
```

```quiz
type: choice
q: 一个算法每步都能把问题规模砍掉一半，它的时间复杂度是？
options:
- O(n)
- O(log n)
- O(n log n)
- O(n/2)
answer: 1
explain: 需要的步数就是"n 能被 2 除多少次"，即 log₂n。这是仅次于 O(1) 的好复杂度：n 从 1000 涨到 100 万（1000 倍），步数只从 10 涨到 20，只多了 10 步。
```

```quiz
type: choice
q: "两数之和"用字典辅助的解法，时间和空间复杂度分别是？
options:
- O(n) 时间、O(1) 空间
- O(n) 时间、O(n) 空间
- O(n²) 时间、O(1) 空间
- O(n²) 时间、O(n) 空间
answer: 1
explain: 只遍历一次所以时间 O(n)；字典最多存 n 个条目所以额外空间 O(n)。这是最典型的"用空间换时间"：多花一份内存，把 O(n²) 降到 O(n)。实测在 n=4000 时快 1183 倍。
```

```quiz
type: choice
q: 用"n 翻倍法"实测，发现 n 变成 2 倍时耗时变成约 4 倍，这段代码的复杂度是？
options:
- O(log n)
- O(n)
- O(n log n)
- O(n²)
answer: 3
explain: 耗时倍数就是复杂度的"阶"：翻 2 倍是 O(n)，翻 4 倍是 O(n²)，翻 8 倍是 O(n³)，几乎不变是 O(1) 或 O(log n)。这是不看代码判断瓶颈最实用的技巧。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 用"边走边记"的思路判断有没有重复元素，打印结果（这个列表有重复）
starter: |
  def has_duplicate(items):
      seen = set()
      for x in items:
          if x in seen:
              return True
          seen.add(x)
      return False
  
  # 这个列表里 7 出现了两次，应该打印 True
  
  print("在这里改")
tests:
- assert "True" in __out
hint: print(has_duplicate([3, 7, 1, 7, 9]))。set 的 in 查询是 O(1)，所以整体只遍历一次，是 O(n)；而两两比较是 O(n²)。
explain: 这是本章的核心例题。n=8000 时它用 0.228 毫秒，双重循环用 916 毫秒 —— 差 4000 倍。记住"用集合换掉内层循环"这个套路，后面无数题都能用。
```

```quiz
type: function
q: 写 count_pairs_sum(nums, target)：统计有多少对（i < j）两个数的和等于 target
func: count_pairs_sum
starter: |
  def count_pairs_sum(nums, target):
      # 要求 O(n) 解法：用字典记录每个数出现了几次
      # 遍历时查 target - x 出现过多少次，累加即可
      # 返回对数（不是下标）
      return None
cases: |
  [1,2,3,4,5], 6 -> 2
  [1,1,1], 2 -> 3
  [1,2], 99 -> 0
hint: from collections import defaultdict 或直接用 dict。先统计词频 cnt，再遍历：for x in nums: 需要 need=target-x，累加 cnt[need]，然后把 x 的处理时注意去重（或者先建完整词频表再遍历，最后除以 2）。
explain: 用字典存词频后，每对只需查一次表，整体 O(n)。注意 [1,1,1] target=2 的答案是 3 —— 三个 1 里任选两个有 C(3,2)=3 种组合，不是 1 种也不是 2 种。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「复杂度实测台」：写两个不同复杂度的解法（O(n²) 和 O(n)），用 perf_counter 在多个数据规模下测量耗时，打印表格并验证"n 翻倍时耗时翻几倍"
checklist:
- 写了两个解决同一问题的函数，一个 O(n²) 一个 O(n)
- 用 time.perf_counter() 计时，且跑了多次取最小值
- 至少测了 3 个不同的数据规模（如 500 / 1000 / 2000）
- 打印了每个规模的耗时，以及"相对上一次的倍数"
- 从倍数判断出了各自的复杂度并写在输出里
- 代码能跑通，没有报错
starter: |
  import time
  
  def solve_slow(items):        # O(n^2)：两两比较
      n = len(items)
      for i in range(n):
          for j in range(i + 1, n):
              if items[i] == items[j]:
                  return True
      return False
  
  def solve_fast(items):        # O(n)：用集合
      seen = set()
      for x in items:
          if x in seen:
              return True
          seen.add(x)
      return False
  
  def measure(fn, n, reps=3):
      items = list(range(n))           # 无重复，逼它跑满
      best = float('inf')
      for _ in range(reps):
          t0 = time.perf_counter()
          fn(items)
          best = min(best, (time.perf_counter() - t0) * 1000)
      return best
  
  # 继续：对 [500, 1000, 2000] 分别测量，打印耗时和倍数
hint: 用 prev 变量保存上一次的耗时，每次打印 best/prev 得到倍数。数据用 list(range(n)) 保证无重复（否则会提前返回，测不到最坏情况）。
explain: 这个项目把整章串起来了：写两种解法 → 科学计时 → 从"n 翻倍的耗时倍数"反推复杂度。做完你会亲眼看到 O(n²) 的耗时是 4 倍增长、O(n) 是 2 倍增长 —— 理论和数据完全对上。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
def has_duplicate(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False

print(has_duplicate([3, 7, 1, 7, 9]))     # True
```

**函数题：**

```python
def count_pairs_sum(nums, target):
    cnt = {}
    ans = 0
    for x in nums:
        need = target - x
        ans += cnt.get(need, 0)     # 之前出现过的 need 都能和 x 配对
        cnt[x] = cnt.get(x, 0) + 1
    return ans
```

**小项目：**

```python
import time

def solve_slow(items):
    n = len(items)
    for i in range(n):
        for j in range(i + 1, n):
            if items[i] == items[j]:
                return True
    return False

def solve_fast(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False

def measure(fn, n, reps=3):
    items = list(range(n))
    best = float('inf')
    for _ in range(reps):
        t0 = time.perf_counter()
        fn(items)
        best = min(best, (time.perf_counter() - t0) * 1000)
    return best

for name, fn in [("双重循环 O(n^2)", solve_slow), ("集合   O(n)", solve_fast)]:
    print(f"\n{name}")
    prev = None
    for n in [500, 1000, 2000]:
        ms = measure(fn, n)
        ratio = f"{ms/prev:.2f}x" if prev else "—"
        print(f"  n={n:>5}  {ms:>8.3f} ms   {ratio}")
        prev = ms
```

</details>

## 这一章，你学会了什么

- **复杂度为什么重要**：同一问题两种解法，n=8000 时能差 4000 倍；n=100 万时是"4 小时"和"0.03 秒"的区别
- **大 O 记号**：描述增长趋势，忽略常数和低阶项，顺序取最大、嵌套相乘
- **复杂度排队**：`O(1)` < `O(log n)` < `O(n)` < `O(n log n)` < `O(n²)` < `O(2ⁿ)`
- **空间复杂度**：用空间换时间（哈希辅助是典型），但内存紧张时要反过来想
- **亲手实测**：跑多次取最小值，用"n 翻倍法"反推复杂度

**下一章：数组与双指针**——把复杂度分析真正落到代码上，学会把 O(n²) 降到 O(n)。
