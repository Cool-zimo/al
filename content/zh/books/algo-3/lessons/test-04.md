# 第 4 章章测 · 排序

> 本章覆盖：比较排序的 Ω(n log n) 下界、三大 O(n²) 排序、归并/快排/堆排、非比较排序。八道题，六十分钟，做完对照参考解自查。

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于"比较排序的 Ω(n log n) 下界"，最准确的表述是？
options:
- 任何能正确排序的算法都至少需要 Ω(n log n) 时间
- 任何只通过两两比较元素大小来决定下一步的排序算法，最坏情况下至少需要 Ω(n log n) 次比较
- 任何递归排序算法都至少需要 Ω(n log n) 时间
- 任何使用 O(1) 额外空间的排序算法都至少需要 Ω(n log n) 时间
answer: 1
explain: 下界成立的前提是"算法只能通过两两比较获取信息"。计数、基数、桶排序不比较元素，可以做到 O(n)。归并、堆排等 O(n log n) 算法已经达到了这个下界。
```

```quiz
type: choice
exam: true
q: n 个不同元素的全排列数是 n!。用决策树论证下界时，log₂(n!) 约等于（Stirling 近似给出的量级）？
options:
- n
- n log₂ n − O(n)
- n²
- 2ⁿ
answer: 1
explain: n! ≈ √(2πn)(n/e)^n，取 log₂ 得 log₂(n!) = n log₂n − n log₂e + O(log n) = n log₂n − O(n)。这比"选 n"或"选 n²"都精确得多。
```

```quiz
type: choice
exam: true
q: 以下哪种排序算法是不稳定的？
options:
- 插入排序
- 冒泡排序（不交换相等元素时）
- 归并排序（标准实现）
- 选择排序
answer: 3
explain: 选择排序会跨越相等元素做交换，改变相等键的相对顺序，例如 [5,5,2] → [2,5,5]。插入和冒泡（不交换相等）天然稳定；归并也可稳定实现。
```

```quiz
type: choice
exam: true
q: 归并排序的主要代价是？
options:
- 它是非稳定排序
- 它需要 O(n) 的额外空间来做合并
- 它的最坏复杂度是 O(n²)
- 它不能处理链表
answer: 1
explain: 归并排序递归地把两半各自排好，再用一个 O(n) 的临时数组把两半合并，因此额外空间 O(n)。作为回报，它最坏和平均都是 Θ(n log n)，且稳定。
```

```quiz
type: choice
exam: true
q: 快排（固定选第一个元素作 pivot）在处理以下哪种输入时表现最差？
options:
- 完全随机的数组
- 已经完全有序的数组
- 所有元素都相等的数组
- 完全逆序的数组
answer: 1
explain: 已有序时 pivot 永远取到当前区间最小元素，划分极度不平衡（一边空、一边剩 n-1），递归深度 n，比较次数 n+(n-1)+…+1 = O(n²)。完全逆序同样 O(n²)，但"完全有序"和"完全逆序"对固定选第一个 pivot 都是最坏，本题取其一；随机化 pivot 或三数取中可大幅降低该概率。
```

## 第二部分 · 动手题

```quiz
type: function
exam: true
q: 实现 merge_sort(a)，返回排序后的列表。用经典的"分两半、递归排序、再合并"写法；合并时用两个指针遍历左右两半，把较小者依次放入结果。不要用 sorted() 或列表的 sort()。
func: merge_sort
starter: |
  def merge_sort(a):
      # 归并排序
      # 在这里改
      return a
cases: |
  merge_sort([38, 27, 43, 3, 9, 82, 10]) -> [3, 9, 10, 27, 38, 43, 82]
  merge_sort([5, 2, 9, 1, 5, 6]) -> [1, 2, 5, 5, 6, 9]
  merge_sort([1, 2, 3]) -> [1, 2, 3]
  merge_sort([3, 2, 1]) -> [1, 2, 3]
  merge_sort([7]) -> [7]
  merge_sort([]) -> []
hint: 递归终止条件 len(a)<=1 直接返回；mid=len(a)//2，递归排左右，再合并。合并时 i,j 指针分别走 left/right，哪个小取哪个，剩余部分整段补上。
explain: 归并排序把规模 n 的问题拆成两个规模 n/2 的子问题，合并代价 O(n)，递推式 T(n)=2T(n/2)+O(n) 解得 Θ(n log n)，且最坏情况也是 Θ(n log n)。它是稳定排序，代价是需要 O(n) 额外空间。
```

```quiz
type: function
exam: true
q: 实现 bubble_sort_optimized(a)，返回排序后的列表。要求实现"提前结束"优化：用一个标志记录本轮是否发生过交换，若某一轮完全没有交换就直接返回——这样对已经有序的数组只需 O(n) 次比较。不要用 sorted()。
func: bubble_sort_optimized
starter: |
  def bubble_sort_optimized(a):
      # 带提前结束优化的冒泡排序（原地修改并返回）
      # 在这里改
      return a
cases: |
  bubble_sort_optimized([5, 2, 9, 1, 5, 6]) -> [1, 2, 5, 5, 6, 9]
  bubble_sort_optimized([1, 2, 3, 4, 5]) -> [1, 2, 3, 4, 5]
  bubble_sort_optimized([5, 4, 3, 2, 1]) -> [1, 2, 3, 4, 5]
  bubble_sort_optimized([2, 1]) -> [1, 2]
  bubble_sort_optimized([3, 3, 3]) -> [3, 3, 3]
hint: 外层 while 循环配 swapped 标志；内层 j 从 0 到 len(a)-1-i，若 a[j]>a[j+1] 则交换并置 swapped=True；内层结束后若 swapped 仍为 False 则 break。
explain: 无优化冒泡无论输入如何都做 n(n-1)/2 次比较。加 swapped 标志后，对已经有序的数组第一轮走完发现零次交换就立即返回，比较次数降到 n-1 即 O(n)；交换次数最多仍是 O(n²)。
```

## 第三部分 · 小项目

```quiz
type: function
exam: true
q: 实现一个函数 compare_sorts(a, algorithms)，对同一个输入列表 a 分别用 algorithms 里给出的排序函数排序，并测量每个算法消耗的时间，返回一个列表，元素为 (算法名, 耗时秒数, 是否已排序验证通过)。要求：(1) 每次排序前用 a.copy() 复制一份输入，避免上一个算法原地修改影响下一个；(2) 用 time.perf_counter() 计时；(3) 用 result.sort()==a.sorted 的方式验证结果是否正确（可用 sorted() 生成正确答案）。algorithms 是 [(名字, 函数), ...] 的列表。
func: compare_sorts
starter: |
  import time

  def compare_sorts(a, algorithms):
      # algorithms: [(name, func), ...]，func 接收列表返回排好序的列表
      # 返回 [(name, elapsed_seconds, is_correct), ...]
      # 在这里改
      return []
cases: |
  compare_sorts([5,2,9,1,5,6], [("merge", merge_sort), ("bubble", bubble_sort_optimized)]) -> [('merge', ..., True), ('bubble', ..., True)]
  compare_sorts([1,2,3], [("merge", merge_sort)]) -> [('merge', ..., True)]
  compare_sorts([], [("merge", merge_sort), ("bubble", bubble_sort_optimized)]) -> [('merge', ..., True), ('bubble', ..., True)]
hint: 对每个 (name, fn) 做 t0=time.perf_counter(); b=a.copy(); out=fn(b); t1=time.perf_counter(); correct=(out==sorted(a))；append (name, t1-t0, correct)。注意用实例属性做自包含验证。
explain: 这是一个排序算法性能基准的迷你框架。它的两个要点是"复制输入避免串扰"和"用独立的正确实现（sorted）验证输出"。在真实工程中，这类框架常用于在给定数据分布下选择最合适的排序策略，也是理解"最坏复杂度 ≠ 实际性能"的直观方式——比如插入排序在近乎有序数据上常常跑赢归并排序，尽管它的渐近复杂度更高。
```
