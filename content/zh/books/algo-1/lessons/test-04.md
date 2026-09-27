# 第 4 章 · 二分查找 · 大测验

> 8 道题。这一章解决的是"如何利用单调性，把 O(n) 的搜索/优化降到 O(log n)"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 标准二分（闭区间写法）中，循环条件是 while left <= right。为什么用 <= 而不是 <？
options:
- 为了对齐下标
- 因为闭区间 [left, right] 在 left==right 时还有一个元素没检查，必须再循环一次
- 为了加快速度
- 为了节省空间
answer: 1
explain: 闭区间 [left, right] 包含两个端点。当 left==right 时，区间内还有一个元素（mid=left=right）没检查。如果用 <，这个元素就被跳过了。只有 left>right 时区间才真正为空。
```

```quiz
type: choice
q: 二分查找中，如果 nums[mid] < target，应该写 left = mid 还是 left = mid + 1？为什么？
options:
- left = mid，因为 mid 可能就是答案
- left = mid + 1，因为 nums[mid] 已经判断过了，它不是答案，可以丢掉
- left = mid，为了死循环安全
- left = mid - 1，因为 target 在左边
answer: 1
explain: nums[mid] 已经和 target 比较过了（mid 太小），所以它不可能是答案，可以从搜索区间中移除。写 left=mid+1。如果写 left=mid，当区间缩小到 [0,1] 时 mid=0，left 不变，死循环。
```

```quiz
type: choice
q: lower_bound 和 upper_bound 的区别是什么？
options:
- 没有区别
- lower_bound 找第一个 >= target 的位置，upper_bound 找第一个 > target 的位置
- lower_bound 找第一个 > target，upper_bound 找第一个 >= target
- lower_bound 用于降序数组
answer: 1
explain: 两者只差一个等号：遇到 nums[mid]==target 时，lower_bound 往左走（right=mid，可能还有更小的），upper_bound 往右走（left=mid+1，找比 target 大的）。出现次数 = upper_bound - lower_bound。
```

```quiz
type: choice
q: 二分答案（如木头切割问题）为什么能用二分？
options:
- 因为答案一定在数组里
- 因为答案具有单调性：段长越小，能切出的段数越多
- 因为数组是有序的
- 因为木头长度是偶数
answer: 1
explain: 二分答案要求答案空间有单调性。木头切割中，段长越小 → 每段能切出的段数越多。这种单调性让我们可以用二分来找"最大的可行段长"——可行性判断函数是 can_cut(L) = 总段数 >= k。
```

```quiz
type: choice
q: 在旋转排序数组中搜索时，为什么每次取 mid 后至少有一半是有序的？
options:
- 因为数组是随机打乱的
- 因为旋转数组是从有序数组中切一刀再拼接，必然有一段保持完整升序
- 因为 mid 总是指向最大值
- 因为数组长度一定是 2 的幂
answer: 1
explain: 旋转 = 把有序数组前 k 个元素搬到末尾。无论怎么切，[left,mid] 和 [mid,right] 中至少有一段没被"切到"，保持完整升序。利用这段有序部分就能判断 target 在哪一侧。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 binary_search_first(nums, target)：在有序数组中找 target 第一次出现的位置，找不到返回 -1
func: binary_search_first
starter: |
  def binary_search_first(nums, target):
      # lower_bound 思路
      # 循环结束检查 nums[left] == target
      return -1
cases: |
  [1,2,2,2,3,4], 2 -> 1
  [1,2,3,4,5], 3 -> 2
  [1,2,3], 5 -> -1
hint: left=0; right=len(nums); while left<right: mid=(left+right)//2; if nums[mid]<target: left=mid+1; else: right=mid; return left if left<len(nums) and nums[left]==target else -1。
explain: lower_bound 模板找"第一个 >= target"的位置，然后检查那个位置的值是否等于 target。不等于说明 target 不存在。right 初始为 len(nums) 是为了处理"target 比所有元素都大"的情况。
```

```quiz
type: function
q: 写 is_perfect_square(num)：判断一个非负整数是否是完全平方数（用二分答案，不用 sqrt）
func: is_perfect_square
starter: |
  def is_perfect_square(num):
      # 二分查找 x，使得 x*x == num
      # 搜索范围 [0, num]
      # 注意用 x*x <= num 作为判定
      return False
cases: |
  16 -> True
  14 -> False
  0 -> True
hint: left=0; right=num; ans=-1; while left<=right: mid=(left+right)//2; sq=mid*mid; if sq==num: return True; elif sq<num: left=mid+1; else: right=mid-1; return False。0 的平方根是 0，返回 True。
explain: 判断完全平方数 = 二分找 x 使得 x²==num。搜索范围 [0,num]（因为 sqrt(num) <= num）。mid*mid 可能溢出？Python 不会，但其他语言要注意用 long。0 和 1 是边界情况。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 实现一个「二分工具箱」：包含标准二分查找、lower_bound、upper_bound、二分答案（木头切割）四个功能模块
checklist:
- 实现了标准二分查找（闭区间），并打印至少一个查询结果
- 实现了 lower_bound 和 upper_bound，并打印至少一个查询
- 用 lower_bound/upper_bound 计算了某个值的出现次数
- 实现了木头切割的二分答案，并打印结果
- 四个模块都有边界处理（空数组、单元素、不存在等）
- 代码能跑通，没有报错
starter: |
  # ===== 标准二分 =====
  def binary_search(nums, target):
      left, right = 0, len(nums) - 1
      while left <= right:
          mid = (left + right) // 2
          if nums[mid] == target:
              return mid
          elif nums[mid] < target:
              left = mid + 1
          else:
              right = mid - 1
      return -1
  
  # ===== lower_bound =====
  def lower_bound(nums, target):
      left, right = 0, len(nums)
      while left < right:
          mid = (left + right) // 2
          if nums[mid] < target:
              left = mid + 1
          else:
              right = mid
      return left
  
  # ===== upper_bound =====
  def upper_bound(nums, target):
      left, right = 0, len(nums)
      while left < right:
          mid = (left + right) // 2
          if nums[mid] <= target:
              left = mid + 1
          else:
              right = mid
      return left
  
  # ===== 木头切割（二分答案）=====
  def can_cut(lengths, k, L):
      return sum(l // L for l in lengths) >= k
  
  def max_cut_length(lengths, k):
      left, right = 1, max(lengths)
      ans = 0
      while left <= right:
          mid = (left + right) // 2
          if can_cut(lengths, k, mid):
              ans = mid
              left = mid + 1
          else:
              right = mid - 1
      return ans
  
  # 继续：准备测试数据并打印四个模块的结果
hint: 标准二分用 [1,3,5,7,9] 查 5；lower/upper 用 [1,2,2,2,3] 查 2；木头切割用 lengths=[10,20,30], k=5，答案 10。
explain: 这个项目把第 4 章四种二分形态串起来：标准二分找位置、lower/upper 找边界、二分答案找最优值。它们的共同点是利用"单调性"把 O(n) 降到 O(log n)。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**标准二分：**

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

**lower_bound：**

```python
def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

**upper_bound：**

```python
def upper_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = (left + right) // 2
        if nums[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return left
```

**木头切割：**

```python
def can_cut(lengths, k, L):
    return sum(l // L for l in lengths) >= k

def max_cut_length(lengths, k):
    left, right = 1, max(lengths)
    ans = 0
    while left <= right:
        mid = (left + right) // 2
        if can_cut(lengths, k, mid):
            ans = mid
            left = mid + 1
        else:
            right = mid - 1
    return ans
```

</details>

## 这一章，你学会了什么

- **标准二分**：闭区间 + `<=` + `±1`，不会出错的模板
- **lower/upper_bound**：找边界，只差一个等号
- **二分答案**：二分的是答案本身，不是下标
- **旋转数组**：局部有序即可二分
- **核心思想**：只要有单调性，就能用二分把 O(n) 降到 O(log n)

**下一章：字符串基础**——不可变性、哈希计数、双指针应用。
