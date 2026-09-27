# 第 6 章 · 滑动窗口 · 大测验

> 8 道题。这一章解决的是"如何在 O(n) 时间内处理连续子数组/子串的最值问题"。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 滑动窗口和双指针的本质区别是什么？
options:
- 滑动窗口用两个指针框住区间，双指针关注两个元素的关系
- 滑动窗口比双指针快
- 滑动窗口只能用于数组，双指针只能用于字符串
- 两者没有任何区别
answer: 0
explain: 滑动窗口的核心是"两指针之间的区间"，需要维护区间内某种聚合状态（和、集合、计数器）。双指针的核心是"两个指针协作找答案"，通常不需要维护区间状态。
```

```quiz
type: choice
q: 固定窗口滑动时，`window_sum` 的正确更新公式是？
options:
- window_sum = window_sum + nums[i] + nums[i-k]
- window_sum = window_sum - nums[i-k] + nums[i]
- window_sum = sum(nums[i-k:i+1])
- window_sum = window_sum - nums[i] + nums[i-k]
answer: 1
explain: 窗口右移时，离开窗口的是 nums[i-k]，进入窗口的是 nums[i]。先减旧值、再加新值。虽然选项3结果对，但每次重新求和O(k)，效率不如O(1)更新。
```

```quiz
type: choice
q: 用滑动窗口求"无重复字符最长子串"时，用 HashMap 记录字符最后出现位置的代码中，为什么要写 `>= left` 的判断？
options:
- 防止索引越界
- 忽略窗口外已经移出的旧记录，只检查窗口内的重复
- 加快查找速度
- 节省内存
answer: 1
explain: HashMap 记录的是字符"最后一次出现"的位置，但这个位置可能已经在窗口之外了（left 已经超过它）。>= left 确保只检查当前窗口内的字符是否重复。
```

```quiz
type: choice
q: 最小覆盖子串算法中，`formed` 变量的含义是什么？
options:
- 窗口内字符的总数量
- 窗口内"出现次数达到 t 中要求"的字符种类数
- 窗口的长度
- t 中字符的总数量
answer: 1
explain: formed 跟踪达标种类数。比如 need={'A':2,'B':1}，当 window['A']>=2 且 window['B']>=1 时 formed=2。它只关心种类是否全部达标，不关心总数。
```

```quiz
type: choice
q: 在正整数数组中找和 >= target 的**最短**子数组，收缩左边界的条件是什么？
options:
- window_sum > target 时收缩
- window_sum >= target 时收缩
- window_sum < target 时收缩
- window_sum == target 时收缩
answer: 1
explain: 求最短就是在满足条件的前提下尽量缩小。window_sum >= target 时窗口合法，此时收缩看能否更短。如果用 > 作为条件，恰好等于 target 时不会收缩，可能漏掉更短答案。
```

## 第二部分 · 动手题

```quiz
type: function
q: 实现 max_sum_subarray_of_size_k(nums, k)：返回长度为 k 的连续子数组的最大和。数组长度 >= k。
func: max_sum_subarray_of_size_k
starter: |
  def max_sum_subarray_of_size_k(nums, k):
      window_sum = sum(nums[:k])
      max_sum = window_sum
      for i in range(k, len(nums)):
          window_sum = window_sum - nums[i - k] + nums[i]
          max_sum = max(max_sum, window_sum)
      return max_sum
cases: |
  [1, 2, 3, 4, 5], 3 -> 12
  [5, 2, 8, 1, 9], 2 -> 10
  [10], 1 -> 10
hint: 标准固定窗口：初始和为前k个元素，然后每次减去nums[i-k]加上nums[i]。
explain: [1,2,3,4,5] k=3: 窗口 [1,2,3]=6, [2,3,4]=9, [3,4,5]=12, 最大12。[5,2,8,1,9] k=2: [5,2]=7,[2,8]=10,[8,1]=9,[1,9]=10, 最大10。
```

```quiz
type: function
q: 实现 longest_substring_without_repeating(s)：返回 s 中无重复字符的最长子串的长度。
func: longest_substring_without_repeating
starter: |
  def longest_substring_without_repeating(s):
      char_index = {}
      max_len = 0
      left = 0
      for right in range(len(s)):
          if s[right] in char_index and char_index[s[right]] >= left:
              left = char_index[s[right]] + 1
          char_index[s[right]] = right
          max_len = max(max_len, right - left + 1)
      return max_len
cases: |
  "abcabcbb" -> 3
  "bbbbb" -> 1
  "pwwkew" -> 3
hint: HashMap记录最后出现位置。如果字符在当前窗口内出现过，left跳到上次位置+1。更新max_len。
explain: "abcabcbb": 最长无重复子串是"abc"长度3。"bbbbb": 最长只有"b"长度1。"pwwkew": 最长"wke"或"kew"长度3。
```

## 第三部分 · 小项目

```quiz
type: project
q: 实现一个"实时股票分析器"函数 analyze_stock(prices, k)，它接收一个价格列表和窗口大小 k，返回一个列表，每个元素是该位置之前（含）长度为 k 的窗口内的平均价格。要求用滑动窗口 O(n) 实现，不能用 sum() 重算。
checklist:
- 函数签名为 analyze_stock(prices, k)
- 用滑动窗口维护窗口和，O(n) 时间
- 前 k-1 个位置返回 None（窗口不足 k 个元素）
- 第 k 个位置开始返回该窗口的平均值（浮点数）
- 用 / 不是 // 来计算平均值
- 对空列表返回空列表
starter: |
  def analyze_stock(prices, k):
      '''
      滑动窗口实时股票分析器
      返回每个位置（从0开始）长度为k的窗口平均价格
      前k-1个位置窗口不足，返回None
      '''
      if not prices:
          return []
      result = []
      window_sum = 0
      # 在这里补全代码
      return result
```
