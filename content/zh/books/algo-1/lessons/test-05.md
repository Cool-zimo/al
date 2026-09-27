# 第 5 章 · 字符串基础 · 大测验

> 8 道题。这一章解决的是"字符串不可变性、计数哈希、双指针、回文判定与最长回文子串"的问题。
> **通过标准：8 题中对 6 题。**

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 为什么在循环里用 `+=` 拼接字符串是 O(n²) 的？
options:
- 因为字符串拼接总是平方时间，即使在循环外面也一样
- 因为字符串不可变，每次 `+=` 都要分配新空间并复制已累积的所有字符
- 因为 Python 在拼接前要先排序字符
- 因为 `+=` 运算符本身是用嵌套循环实现的
answer: 1
explain: 字符串不能原地修改。每次 s += x 都要构建一个全新的字符串并把已有内容复制进去。第 i 次迭代复制 i 个字符，总和是 1+2+...+n ~ n²/2 = O(n²)。
```

```quiz
type: choice
exam: true
q: 哪个函数正确地统计了字符串中每个字符出现的次数？
options:
- `count = {}; for ch in s: count[ch] += 1`
- `count = {}; for ch in s: count[ch] = count.get(ch, 0) + 1`
- `count = []; for ch in s: count.append(ch)`
- `count = set(s)`
answer: 1
explain: 第一个选项在 ch 不在字典中时会抛 KeyError。用 dict.get(ch, 0) 对缺失键返回 0 再加 1——标准的计数写法。列表只适用于已知连续字母表，集合只能告诉你哪些字符出现过，不能告诉出现次数。
```

```quiz
type: choice
exam: true
q: 用双指针判定回文串，最优的时间和空间复杂度是多少？
options:
- O(n) 时间，O(n) 空间
- O(n²) 时间，O(1) 空间
- O(n) 时间，O(1) 空间
- O(1) 时间，O(n) 空间
answer: 2
explain: 双指针最多做 n/2 次比较就到中间了，所以 O(n) 时间。只需要两个下标变量，所以 O(1) 额外空间。反转再比较也是 O(n) 时间但用 O(n) 空间，因为构建了新字符串。
```

```quiz
type: choice
exam: true
q: 以下哪个字符串在忽略大小写、只保留字母和数字后是一个合法的英文回文？
options:
- "race a car"
- "hello world"
- "A man a plan a canal Panama"
- "python"
answer: 2
explain: "A man a plan a canal Panama" 清理后是 "amanaplanacanalpanama"，正读反读一样。"race a car" 清理后是 "raceacar"（r != a）。另外两个无论如何都不是回文。
```

```quiz
type: choice
exam: true
q: 用中心扩展算法找最长回文子串，时间和空间复杂度是多少？
options:
- O(n³) 时间，O(1) 空间
- O(n²) 时间，O(n²) 空间
- O(n²) 时间，O(1) 空间
- O(n) 时间，O(1) 空间
answer: 2
explain: 有 n 个中心可以扩展，每个扩展最多 n/2 步，所以 O(n²) 时间。只用几个下标变量，所以 O(1) 空间。动态规划法也是 O(n²) 时间但需要 O(n²) 空间。
```

---

## 第二部分 · 动手题

```quiz
type: function
exam: true
q: 写 reverse_string(s) — 用双指针反转字符串。不能使用切片或内置 reversed()
func: reverse_string
starter: |
  def reverse_string(s):
      # 把 s 转成列表
      # 用双指针，left 在 0，right 在末尾
      # left < right 时交换
      # join 后返回
      return ""
cases: |
  "racecar" -> "racecar"
  "algorithm" -> "mhtirogla"
  "a" -> "a"
  "" -> ""
hint: chars = list(s); left, right = 0, len(chars)-1; while left < right: chars[left], chars[right] = chars[right], chars[left]; left += 1; right -= 1; return "".join(chars)。
explain: 转成列表才能原地交换。空字符串返回 ""（range 为空，join 空内容就是 ""），单字符已经是有序的。这是 O(n) 时间 O(n) 空间（列表开销）。
```

```quiz
type: function
exam: true
q: 写 is_anagram(s1, s2) — 如果 s1 和 s2 是异位词（字符相同、次数相同、顺序随意）返回 True，否则返回 False
func: is_anagram
starter: |
  def is_anagram(s1, s2):
      # 长度不同直接返回 False
      # 统计 s1 的字符
      # 遍历 s2 时减计数
      # 只有所有计数都回到 0 才返回 True
      return False
cases: |
  "listen", "silent" -> True
  "racecar", "carrace" -> True
  "hello", "world" -> False
  "a", "ab" -> False
  "" -> True
hint: if len(s1) != len(s2): return False。然后 count = {}; for ch in s1: count[ch] = count.get(ch, 0) + 1。然后 for ch in s2: if ch not in count or count[ch] == 0: return False; count[ch] -= 1。最后 return True。
explain: 先检查长度能立刻排除所有不相等的对。减计数并检查是否为 0 能捕获 s2 有 s1 没有的字符的情况（计数到 0 后再出现就变负数）。这是 O(n) 时间 O(n) 空间。
```

---

## 第三部分 · 小项目

```quiz
type: function
exam: true
q: 写 palindrome_report(s) — 返回一个字典，包含三个键 - "is_palindrome"：清理后（只保留字母数字、转小写）的字符串是否是回文 - "char_counts"：原始字符串中字符的频率字典 - "longest_palindrome"：原始字符串的最长回文子串（用中心扩展）例如 palindrome_report("Racecar") 应返回字典，其中 "is_palindrome" 为 True，"char_counts" 包含原始字符串中的 'R' 或 'r' 键，"longest_palindrome" 为 "Racecar"。函数必须用列表 + join 构建任何中间字符串（不能循环里用 +=），空字符串返回 {"is_palindrome": True, "char_counts": {}, "longest_palindrome": ""}。
func: palindrome_report
starter: |
  def palindrome_report(s):
      # 1. 清理后的字符串用双指针判定回文（isalnum + lower）
      # 2. 用字典统计原始字符串的字符频率
      # 3. 用中心扩展找最长回文子串
      #    （构建中间结果用列表，不用 +=）
      # 4. 返回包含三个键的字典
      return {}
cases: |
  "Racecar" -> {"is_palindrome": True, "char_counts": {"R": 1, "a": 2, "c": 2, "e": 1, "r": 1}, "longest_palindrome": "aceca"}
  "babad" -> {"is_palindrome": False, "char_counts": {"b": 2, "a": 2, "d": 1}, "longest_palindrome": "bab"}
  "" -> {"is_palindrome": True, "char_counts": {}, "longest_palindrome": ""}
  "aabb" -> {"is_palindrome": False, "char_counts": {"a": 2, "b": 2}, "longest_palindrome": "aa"}
hint: cleaned = "".join(ch.lower() for ch in s if ch.isalnum())。然后在 cleaned 上用双指针判定。用字典和 get 统计原始字符串。最长回文用 expand(left,right) 返回 right-left-1，遍历 i 从 0 到 len(s)-1，记录 max_len 和 start = i - (max_len-1)//2。用列表推导构建 cleaned，避免 += 循环。返回正好包含这三个键的字典。
explain: 这个项目结合了第 5 章三种技能：有效回文清理（isalnum + lower + 双指针）、字典计数、中心扩展找最长回文。它还测试你是否避免了 O(n²) 的 += 循环，用列表或推导式构建字符串。注意 char_counts 反映的是原始大小写，而 is_palindrome 是在清理并小写后的版本上判定的。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**reverse_string：**

```python
def reverse_string(s):
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)
```

**is_anagram：**

```python
def is_anagram(s1, s2):
    if len(s1) != len(s2):
        return False
    count = {}
    for ch in s1:
        count[ch] = count.get(ch, 0) + 1
    for ch in s2:
        if ch not in count or count[ch] == 0:
            return False
        count[ch] -= 1
    return True
```

**palindrome_report：**

```python
def palindrome_report(s):
    # 1. 清理 + 双指针判定回文
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    left, right = 0, len(cleaned) - 1
    is_palin = True
    while left < right:
        if cleaned[left] != cleaned[right]:
            is_palin = False
            break
        left += 1
        right -= 1
    
    # 2. 统计原始字符串的字符频率
    char_counts = {}
    for ch in s:
        char_counts[ch] = char_counts.get(ch, 0) + 1
    
    # 3. 中心扩展找最长回文子串
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1
    
    if not s:
        return {"is_palindrome": True, "char_counts": {}, "longest_palindrome": ""}
    
    start, max_len = 0, 1
    for i in range(len(s)):
        odd = expand(i, i)
        even = expand(i, i + 1)
        curr = max(odd, even)
        if curr > max_len:
            max_len = curr
            start = i - (curr - 1) // 2
    
    return {
        "is_palindrome": is_palin,
        "char_counts": char_counts,
        "longest_palindrome": s[start:start + max_len]
    }
```

</details>

## 这一章，你学会了什么

- **不可变性与拼接代价**：字符串不可变，`+=` 循环是 O(n²)，用列表 + join
- **字符计数/异位词**：字典 + `get(ch, 0)` 是标准写法，O(n) 时间
- **双指针**：对撞指针 O(n) 时间 O(1) 空间，判定回文最优
- **回文判定**：双指针 > 反转比较（空间更省）> 中心扩展（找最长更合适）
- **最长回文子串**：中心扩展 O(n²) 时间 O(1) 空间，奇数偶数都要处理

**下一章：滑动窗口**——把 O(n²) 的子串枚举压到 O(n)。
