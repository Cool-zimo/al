# 第 2 章 · 数组与双指针 · 大测验

> 8 道题。这一章解决的是"如何用两个指针代替一重循环，把 O(n²) 降到 O(n)"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 对撞指针解决有序数组两数之和时，left 和 right 的移动规则是什么？
options:
- 和小于 target 时 left 右移，和大于 target 时 right 左移
- 和小于 target 时 right 右移，和大于 target 时 left 左移
- 每次 left 和 right 都同时移动
- 每次只移动 left
answer: 0
explain: 数组有序，所以和太小说明需要更大的数 → left 右移（往大的方向）；和太大说明需要更小的数 → right 左移（往小的方向）。这是对撞指针的核心规则。
```

```quiz
type: choice
q: 用快慢指针原地移除元素时，slow 指针的含义是什么？
options:
- 遍历整个数组
- 指向下一个可以放答案的位置
- 记录要删除的元素
- 和 fast 保持固定距离
answer: 1
explain: slow 指向"下一个可以放置有效元素的位置"。fast 每发现一个不是目标值的元素，就把它放到 slow 的位置，然后 slow 前进一格。这样有效元素被"压缩"到数组前面。
```

```quiz
type: choice
q: 滑动窗口求"和 ≥ target 的最短子数组"，收缩时应该用 while 还是 if？为什么？
options:
- if，收缩一次就够了
- while，因为可能还能继续收缩得到更短的答案
- if，用 while 会死循环
- while，为了代码好看
answer: 1
explain: 题目要求"最短"子数组。一旦 window_sum >= target，当前窗口合法，但可能还能更短 —— 所以要把 left 不断右移（减去 nums[left]），直到不满足为止。if 只收缩一次会漏掉更短的答案。
```

```quiz
type: choice
q: 三数之和中，为什么要在找到一组答案后去重 left 和 right？
options:
- 为了加快速度
- 因为可能有多个相同的元素组成相同的三元组，需要跳过
- 为了防止越界
- 为了节省空间
answer: 1
explain: 比如排序后是 [-2, -1, -1, 0, 1, 1, 2]，target 为某个值时可能有多组相同数值的三元组。找到一组后，left 和 right 指向的元素可能和下一个相同，直接跳过就能避免重复答案。
```

```quiz
type: choice
q: 快慢指针原地移除元素时，如果误用 append 而不是覆盖赋值会怎样？
options:
- 结果正确但慢
- 数组会越来越长，而不是原地修改
- 会报 IndexError
- 没有任何区别
answer: 1
explain: append 会在数组末尾添加元素，导致数组越来越长，而不是把有效元素"覆盖"到前面。正确的做法是用 nums[slow] = nums[fast] 覆盖。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 reverse_str(s)：用对撞指针反转字符串并返回结果（不能只用切片 [::-1]，要手动交换）
func: reverse_str
starter: |
  def reverse_str(s):
      # 字符串不可变，所以先转成列表操作，再拼回来
      # left 从 0，right 从末尾
      # 交换字符，返回 "".join(arr)
      return s
cases: |
  "hello" -> "olleh"
  "a" -> "a"
  "" -> ""
hint: arr = list(s); left=0; right=len(arr)-1; while left<right: arr[left],arr[right]=arr[right],arr[left]; left+=1; right-=1; return "".join(arr)。空字符串时 len=0，right=-1，循环不执行。
explain: 字符串不可变，所以必须先 list(s) 转成列表，交换完再 "".join 拼回字符串。空字符串时 right=-1，循环不执行直接返回 ""。
```

```quiz
type: function
q: 写 remove_duplicates(nums)：原地删除有序数组中的重复元素，每个元素只保留一个，返回新长度
func: remove_duplicates
starter: |
  def remove_duplicates(nums):
      # 空列表返回 0
      # slow 从 1 开始
      # fast 遍历，如果 nums[fast] != nums[fast-1] 就保留
      # 返回 slow
      return 0
cases: |
  [1,1,2] -> 2
  [0,0,1,1,1,2,2,3,3,4] -> 5
  [] -> 0
hint: if not nums: return 0; slow=1; for fast in range(1,len(nums)): if nums[fast]!=nums[fast-1]: nums[slow]=nums[fast]; slow+=1; return slow。空列表先判断。
explain: 去重的核心是比较"当前元素和前一个元素"。slow 从 1 开始是因为第 0 个元素一定保留。返回 slow 就是新长度。注意必须处理空列表，否则 nums[0] 会 IndexError。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 实现一个「双指针综合练习器」：包含对撞指针（有序数组两数之和）、快慢指针（原地移除元素）、滑动窗口（最短子数组）三个函数，并打印每个的运行结果
checklist:
- 实现了有序数组两数之和（对撞指针），并打印了至少一组答案
- 实现了原地移除指定值（快慢指针），并打印了新长度和有效部分
- 实现了最短子数组（滑动窗口），并打印了最短长度
- 三个函数都有明确的边界处理（空数组、单元素等）
- 代码能跑通，没有报错
starter: |
  # ===== 对撞指针：有序数组两数之和 =====
  def two_sum_sorted(nums, target):
      left, right = 0, len(nums) - 1
      while left < right:
          s = nums[left] + nums[right]
          if s == target:
              return [left, right]
          elif s < target:
              left += 1
          else:
              right -= 1
      return []
  
  # ===== 快慢指针：原地移除元素 =====
  def remove_element(nums, val):
      slow = 0
      for fast in range(len(nums)):
          if nums[fast] != val:
              nums[slow] = nums[fast]
              slow += 1
      return slow
  
  # ===== 滑动窗口：最短子数组 =====
  def min_subarray_len(nums, target):
      left = 0
      window_sum = 0
      ans = float('inf')
      for right in range(len(nums)):
          window_sum += nums[right]
          while window_sum >= target:
              ans = min(ans, right - left + 1)
              window_sum -= nums[left]
              left += 1
      return ans if ans != float('inf') else 0
  
  # 继续：准备测试数据并打印三个函数的结果
hint: 分别准备有序数组（两数之和）、含目标值的数组（移除）、正整数数组（最短子数组）。打印时用 nums[:length] 只显示有效部分。
explain: 这个项目把第 2 章三种双指针形态串起来。写完你会发现它们共享同一个思想：用两个位置变量代替一重循环，把 O(n²) 的操作压缩到 O(n)。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**两数之和：**

```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []
```

**移除元素：**

```python
def remove_element(nums, val):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != val:
            nums[slow] = nums[fast]
            slow += 1
    return slow
```

**最短子数组：**

```python
def min_subarray_len(nums, target):
    left = 0
    window_sum = 0
    ans = float('inf')
    for right in range(len(nums)):
        window_sum += nums[right]
        while window_sum >= target:
            ans = min(ans, right - left + 1)
            window_sum -= nums[left]
            left += 1
    return ans if ans != float('inf') else 0
```

</details>

## 这一章，你学会了什么

- **对撞指针**：一头一尾，根据大小关系决定谁动，O(n) 解决两数之和、回文、反转
- **快慢指针**：slow 记录答案位置，fast 探路，原地压缩数组 O(1) 空间
- **滑动窗口**：扩张+收缩，维护窗口内信息，O(n) 解决区间问题
- **三数之和**：排序+定一找二，把 O(n³) 降到 O(n²)
- **核心思想**：用两个位置变量代替一重循环，让指针只往前走

**下一章：前缀和与差分**——通过预处理把区间操作从 O(n) 降到 O(1)。
