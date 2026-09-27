# 第 5 章 · 动态规划入门 · 章测

> 本章涵盖动态规划的核心概念：DP 的本质、状态定义与转移方程、一维 DP（打家劫舍 / LIS）、二维 DP（LCS / 编辑距离）、01 背包与完全背包。

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 以下哪个问题是动态规划的经典应用？
options:
- 斐波那契数列、最长公共子序列、背包问题
- 二分查找、快速排序、哈希表
- 广度优先搜索、深度优先搜索
- 冒泡排序、选择排序
answer: 0
explain: 斐波那契（重叠子问题）、LCS（二维 DP）、背包问题（组合优化）都是动态规划的经典应用场景。二分查找、排序、搜索、哈希表不属于 DP 范畴。
```

```quiz
type: choice
exam: true
q: 在动态规划中，dp[i] 的定义应该满足什么要求？
options:
- 能用一句话说清具体含义，包含"到达/以...结尾/选择"等语境和具体量
- 越短越好，一个字母即可
- 只要写对转移方程，dp 含义无所谓
- 必须是一个二维数组
answer: 0
explain: dp[i] 的精确定义是 DP 的灵魂，必须能说清它表示什么、以什么条件为基准、度量的是什么量。含糊的定义会导致转移方程错误，这是 DP 最常见的失败原因。
```

```quiz
type: choice
exam: true
q: 为什么 01 背包的内层循环要倒序遍历（从 W 到 weight[i]）？
options:
- 倒序保证 dp[j-weight[i]] 是上一轮的值，物品不会被重复选取
- 倒序只是为了代码好看
- 倒序可以减少内存占用
- 倒序是因为物品重量太大
answer: 0
explain: 01 背包要求每件物品最多选一次。倒序遍历时，更新 dp[j] 所需的 dp[j-w] 尚未被本轮覆盖，仍是"不含当前物品"的旧状态，从而保证了每件物品只被考虑一次。
```

```quiz
type: choice
exam: true
q: 在最长公共子序列（LCS）问题中，当 text1[i-1] != text2[j-1] 时，转移方程是 dp[i][j] = max(dp[i-1][j], dp[i][j-1])。为什么取 max？
options:
- 因为不匹配时需要分别尝试"舍弃 text1 的字符"和"舍弃 text2 的字符"，取较优者
- 因为两个字符都不用管，直接继承左上角
- 因为不匹配时答案必然是 0
- 因为 max 运算速度更快
answer: 0
explain: 当字符不匹配时，我们需要尝试"跳过"其中一个字符来寻找更长的公共子序列。跳过 text1 的字符对应 dp[i-1][j]，跳过 text2 的字符对应 dp[i][j-1]。两者取最大值，因为不知道哪种策略能得到更长的公共子序列。
```

```quiz
type: choice
exam: true
q: 关于记忆化和递推的区别，以下说法正确的是？
options:
- 记忆化是自顶向下（递归+查表），递推是自底向上（填表）
- 记忆化只适用于斐波那契，递推适用于所有问题
- 记忆化的时间复杂度总是高于递推
- 递推不能处理有重叠子问题的情况
answer: 0
explain: 记忆化搜索是自顶向下的方法：从大问题出发，递归求解子问题并缓存结果；递推是自底向上的方法：从 base case 出发，逐步推导出大问题的解。两者本质上解决的是同一类问题，时间复杂度通常相同。
```

## 第二部分 · 动手题

```quiz
type: function
exam: true
q: 实现函数 fib(n)，用递推（Bottom-up）方式计算第 n 个斐波那契数。F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。时间复杂度 O(n)，空间复杂度 O(1)（只用两个变量，不用数组）。
func: fib
starter: |
  def fib(n):
      # 递推计算第 n 个斐波那契数，只用 O(1) 空间
      # 在这里改
      return 0
cases: |
  fib(0) -> 0
  fib(1) -> 1
  fib(2) -> 1
  fib(10) -> 55
  fib(20) -> 6765
hint: 用两个变量 a 和 b 分别记录 F(i-2) 和 F(i-1)，每次迭代更新 a, b = b, a+b。初始 a=0, b=1。
explain: 斐波那契递推只需维护最近两个值。用 a 和 b 记录 F(i-2) 和 F(i-1)，每次迭代计算 F(i) = a + b，然后滚动更新。只需 O(1) 空间和 O(n) 时间。
```

```quiz
type: function
exam: true
q: 实现函数 longest_increasing_subsequence(nums)，返回给定数组的最长严格递增子序列的长度（不要求连续）。用 O(n²) 的 DP 解法：dp[i] 表示以第 i 个元素结尾的 LIS 长度。
func: longest_increasing_subsequence
starter: |
  def longest_increasing_subsequence(nums):
      # 返回最长严格递增子序列的长度
      # 在这里改
      return 0
cases: |
  longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]) -> 4
  longest_increasing_subsequence([0, 1, 0, 3, 2, 3]) -> 4
  longest_increasing_subsequence([7, 7, 7, 7]) -> 1
  longest_increasing_subsequence([1]) -> 1
  longest_increasing_subsequence([]) -> 0
hint: dp 全初始化为 1。对每个 i，遍历所有 j < i，若 nums[j] < nums[i]，则 dp[i] = max(dp[i], dp[j]+1)。最终返回 max(dp)，注意空数组返回 0。
explain: dp[i] 定义为以第 i 个元素结尾的 LIS 长度，初始每个元素自己就是长度 1。对于每个 i，检查所有 j < i，如果 nums[j] < nums[i]，说明可以把 nums[i] 接在以 nums[j] 结尾的递增子序列后面，更新 dp[i]。最终答案是 dp 数组的最大值。
```

## 第三部分 · 小项目

```quiz
type: function
exam: true
q: |
  ## 项目：股票买卖最佳时机（动态规划版）

  给定一个数组 `prices`，它的第 i 个元素是一支股票第 i 天的价格。
  你只能进行一次买入和一次卖出（必须先买后卖），求最大利润。
  如果无法获得正利润，返回 0。

  要求用动态规划思路：
  - 定义 `dp[i]` 为第 i 天卖出时能获得的最大利润
  - 转移：`dp[i] = max(dp[i-1] + prices[i] - prices[i-1], prices[i] - min_price)`
  - 或者用更简单的方式：遍历过程中维护"到当前为止的最低买入价"和"最大利润"

  实现函数 `max_profit(prices)`，返回最大利润。

  示例：prices = [7, 1, 5, 3, 6, 4]
  - 第 1 天买入（价格 1），第 4 天卖出（价格 6），利润 5
  - 返回 5

func: max_profit
starter: |
  def max_profit(prices):
      '''
      只能买卖一次，求最大利润。
      思路：维护到当前为止的最低价格 min_price，
      每天计算 当天价格 - min_price，更新最大利润。
      '''
      # 在这里改
      return 0
cases: |
  max_profit([7, 1, 5, 3, 6, 4]) -> 5
  max_profit([7, 6, 4, 3, 1]) -> 0
  max_profit([1, 2, 3, 4, 5]) -> 4
  max_profit([2, 4, 1]) -> 2
  max_profit([3, 2, 6, 5, 0, 3]) -> 4
hint: 遍历 prices，维护 min_price（到当前为止见过的最低价格）。每天计算 profit = prices[i] - min_price，更新全局最大利润。初始 min_price = prices[0], max_profit = 0。
explain: 这个问题的 DP 本质是"到第 i 天为止的最低买入价"。遍历数组，每天更新 min_price = min(min_price, prices[i])，同时计算如果今天卖出能获得的利润 prices[i] - min_price，取全局最大值。这是 DP 中"最优子结构"的典型应用——全局最优解由局部最优解推导而来。
```
