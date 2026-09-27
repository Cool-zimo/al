# 第 6 章 综合实战 · 章测

> 本测试覆盖第 26 ~ 30 课的核心内容：数据范围反推、贪心 vs DP、二分答案、前缀和+哈希+滑动窗口、综合优化。共 8 题：5 选择 + 2 function + 1 project。

## 一、选择题

```quiz
type: choice
q: 一道题给出 n ≤ 10^5，以下哪种复杂度是安全的？
options:
- O(n log n)，约 1.7×10^6 次操作
- O(n^2)，约 10^10 次操作
- O(n^3)，约 10^15 次操作
- O(2^n)，无法计算
answer: 0
explain: n=10^5 时 O(n log n) ≈ 1.7×10^6 次操作，1 秒内轻松完成。O(n^2) ≈ 10^10 次操作会严重超时。数据范围直接决定算法复杂度上限。
```

```quiz
type: choice
q: 关于贪心算法和动态规划的区别，以下说法正确的是？
options:
- 贪心每一步只做局部最优选择，不一定得到全局最优；DP 考虑所有子问题，适用范围更广
- 贪心总是比 DP 更快且一定正确
- DP 只能用于求最值，不能用于计数
- 贪心和 DP 没有任何区别，只是写法不同
answer: 0
explain: 贪心每一步只做局部最优选择，只有满足"贪心选择性质"时才正确；DP 通过考虑所有子问题的最优解来递推，适用范围更广。贪心不一定正确（如 {1,3,4} 凑 6），DP 也可用于计数。
```

```quiz
type: choice
q: 在二分答案中，如果问题是"最小化某个最大值"，check(mid) 为 True 时应该怎么缩小范围？
options:
- 缩小上界，right = mid
- 缩小下界，left = mid + 1
- 扩大上界，right = mid + 1
- 缩小上下界，left = mid + 1, right = mid
answer: 0
explain: "最小化最大值"问题中，check(mid) 为 True 说明 mid 可行，答案可以更小，应缩小上界 right = mid。如果 check 为 False，说明 mid 太小不可行，应扩大下界 left = mid + 1。
```

```quiz
type: choice
q: 用前缀和 + 哈希表求"和为 K 的子数组个数"时，为什么要初始化 prefix_count[0] = 1？
options:
- 为了处理"从下标 0 开始的子数组"的情况（当前前缀和恰好等于 K）
- 为了提高哈希表的查询速度
- 为了节省内存空间
- 为了防止数组越界
answer: 0
explain: 当当前前缀和 cur 恰好等于 K 时，target = cur - K = 0，需要 prefix_count[0] 为 1 来计数"从下标 0 开始的子数组"。空前缀和为 0 且出现 1 次，这是合法的初始状态。
```

```quiz
type: choice
q: Kadane 算法中，cur = max(nums[i], cur + nums[i]) 的含义是？
options:
- 如果前面的子数组和是负数，就丢弃它从当前元素重新开始；否则接上前面
- 每次都从当前元素重新开始计算
- 每次都把当前元素加入前面的子数组
- 如果当前元素比前面的和大，就把前面的清空
answer: 0
explain: Kadane 算法的核心洞察：如果以位置 i-1 结尾的最大子数组和 cur 是负数，加上 nums[i] 只会让结果更小，所以不如从 nums[i] 重新开始（取 nums[i]）。如果 cur 是正数，加上 nums[i] 会让结果更大，所以接上前面。
```

## 二、编程题

```quiz
type: function
q: 写一个函数 min_speed(piles, h)，有 piles 堆香蕉，第 i 堆有 piles[i] 根。你每小时最多吃 k 根，如果某堆少于 k 根就吃完这堆然后这小时不再吃别的。求在 h 小时内吃完所有香蕉的最小 k。用二分答案：check(k) 计算以速度 k 吃完需要的时间，总时间 = sum(ceil(piles[i]/k))，用 (p+k-1)//k 计算上取整。二分范围 [1, max(piles)]。
func: min_speed
starter: |
  def min_speed(piles, h):
      # 返回最小吃香蕉速度
      # 在这里改
      return 0
cases: |
  min_speed([3, 6, 7, 11], 8) -> 4
  min_speed([30, 11, 23, 4, 20], 5) -> 30
  min_speed([30, 11, 23, 4, 20], 6) -> 23
  min_speed([1], 1) -> 1
  min_speed([10, 10], 4) -> 5
hint: 先写 check(k)：total = sum((p+k-1)//k for p in piles)，返回 total <= h。然后二分 [1, max(piles)]，最小化问题：check 为 True 时 right=mid，为 False 时 left=mid+1。
explain: check(k) 计算以速度 k 吃完所有堆的总时间：每堆需要 ceil(piles[i]/k) 小时，用 (p+k-1)//k 实现上取整。总时间 <= h 则 k 可行。二分范围 [1, max(piles)]，找最小满足条件的 k。这是二分答案 + 判定的经典组合拳。
```

```quiz
type: function
q: 写一个函数 longest_substring_k_distinct(s, k)，返回字符串 s 中最多含 k 个不同字符的最长子串长度。用滑动窗口 + 哈希表：哈希表记录窗口内每个字符的出现次数，当不同字符数超过 k 时，收缩左边界直到不超过 k。
func: longest_substring_k_distinct
starter: |
  def longest_substring_k_distinct(s, k):
      # 返回最多含 k 个不同字符的最长子串长度
      # 在这里改
      return 0
cases: |
  longest_substring_k_distinct("eceba", 2) -> 3
  longest_substring_k_distinct("aa", 1) -> 2
  longest_substring_k_distinct("abc", 0) -> 0
  longest_substring_k_distinct("aabbcc", 1) -> 2
  longest_substring_k_distinct("", 2) -> 0
hint: 用哈希表（或 Counter）记录窗口内字符计数。right 扩展窗口，如果不同字符数 > k，就移动 left 并减少计数（计数为 0 时删除 key）。维护最大窗口长度。
explain: 滑动窗口 + 哈希表。right 指针逐个扩展，用字典记录窗口内每个字符的计数。当字典的 key 数量（不同字符数）超过 k 时，移动 left 指针：对应字符计数减 1，如果减到 0 就从字典删除。每次更新最大窗口长度 right - left + 1。
```

## 三、综合项目题

```quiz
type: function
q: 综合项目：股票买卖最佳时机。写一个函数 max_profit(prices)，给定一个数组 prices，其中 prices[i] 是第 i 天的股票价格。你可以完成**任意多笔**交易（多次买入卖出），但必须先卖出再买入（同一天只能持有一只股票）。求最大利润。这是贪心：只要后一天比前一天价格高，就把这个差价加入利润。进一步要求：返回具体的交易方案（买入和卖出的天数对列表）。例如 prices=[7,1,5,3,6,4] 应该买入第1天(价格1)卖出第2天(价格5)获利4，买入第3天(价格3)卖出第4天(价格6)获利3，总利润7，返回 [(1,2),(3,4)]。
func: max_profit
starter: |
  def max_profit(prices):
      # 返回 (最大利润, 交易方案列表)
      # 交易方案是 [(买入下标, 卖出下标), ...]
      # 在这里改
      return (0, [])
cases: |
  max_profit([7, 1, 5, 3, 6, 4]) -> (7, [(1, 2), (3, 4)])
  max_profit([1, 2, 3, 4, 5]) -> (4, [(0, 4)])
  max_profit([7, 6, 4, 3, 1]) -> (0, [])
  max_profit([1]) -> (0, [])
  max_profit([2, 4, 1, 3, 5]) -> (6, [(0, 1), (2, 4)])
hint: 贪心：遍历 prices，如果 prices[i] > prices[i-1]，说明可以在 i-1 买入、i 卖出获利。把这些正差价全部累加就是最大利润。但要合并连续的上涨段（如 [1,2,3,4,5] 应该是一笔交易 (0,4) 获利 4，而不是三笔）。合并规则：如果上一次卖出是在 i-1 且这次买入也是 i-1（即连续上涨），就把上次交易延长到 i；否则新开一笔交易。
explain: 这是一个综合题，结合了贪心和区间合并。核心贪心思想：把所有正差价加起来就是最大利润（因为可以任意多次交易）。但要返回交易方案时需要合并：遍历时，如果 prices[i] > prices[i-1]，检查上一次交易是否刚好在 i-1 卖出（连续上涨），如果是就把卖出点延长到 i；否则新开一笔 (i-1, i)。这样 [1,2,3,4,5] 会被合并成一笔 (0,4)。
```
