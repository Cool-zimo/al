# 第 6 章测验：递归

> 递归是"把大问题拆成小问题"的艺术。从三要素到执行过程，从改迭代到分治回溯，这一章走完了递归的完整闭环——也是《算法专攻 2》的收官。

## 一、选择（5 题）

```quiz
type: choice
exam: true
q: 关于递归的三要素，以下说法错误的是？
options:
- 递推关系决定了"大问题如何拆成小问题"，它决定了递归的形状（线性还是树形）
- 终止条件的作用是让递归能停下来，漏写会导致 RecursionError
- 返回值可以省略，Python 会自动把递归调用的结果传回上一层
- 三要素分别是终止条件、递推关系、返回值
answer: 2
explain: 漏写 return 时函数默认返回 None，上一层拿到 None 后会报 TypeError: unsupported operand type(s) for ...: '...' and 'NoneType'，而不是"自动传回结果"。
```

```quiz
type: choice
exam: true
q: 朴素递归计算 fib(n)（F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)）的时间复杂度约为？
options:
- O(2^n)
- O(n)
- O(log n)
- O(n log n)
answer: 0
explain: 每次调用都衍生两次调用，形成递归树，节点数约 2^n（严格约 1.618^n）。慢的根源是同一子问题被反复计算。
```

```quiz
type: choice
exam: true
q: 以下哪句话关于调用栈的描述是正确的？
options:
- 每层递归调用都会在调用栈上压入一帧，返回时弹出；栈深度就是递归深度
- 调用栈的空间是无限的，递归永远不会因栈溢出而报错
- 尾递归在 Python 中会被自动优化成循环，所以永远不会栈溢出
- 调用栈只存在于迭代中，递归不使用调用栈
answer: 0
explain: 每层递归占用一个栈帧，栈深度等于递归深度。Python 默认递归上限 1000 层；Python 不做尾调用优化，尾递归也会栈溢出。
```

```quiz
type: choice
exam: true
q: 归并排序的时间复杂度是 O(n log n)，这个复杂度是怎么来的？
options:
- 递归树有 log n 层，每层所有 merge 的工作量之和为 O(n)，所以 O(n log n)
- 每次 merge 是 O(n²)，递归深度 log n，所以 O(n² log n)
- 归并排序最坏情况下退化到 O(n²)
- 复杂度来自切片拷贝，是 O(n)
answer: 0
explain: 对半分得到 log n 层，每层覆盖全部 n 个元素做 merge，每层 O(n)，共 O(n log n)。归并的最坏情况也是 O(n log n)。
```

```quiz
type: choice
exam: true
q: 回溯算法中，把当前路径加入结果集时，正确的做法是？
options:
- result.append(path[:])，先拷贝再存，避免后续修改污染结果
- result.append(path)，直接存引用，更省内存也更快
- result.append(path.copy()) 会报错，因为列表不能拷贝
- 用全局变量存结果不需要拷贝，因为全局变量不会被修改
answer: 0
explain: path 在后续递归中会被 pop 修改，若直接 append 引用，结果集中所有项都指向同一个列表，最终会全是同一个（往往为空）的列表。
```

## 二、编程（2 题）

```quiz
type: function
exam: true
q: 用递归实现 is_palindrome(s)，判断字符串 s 是否为回文（正读反读都一样）。要求用递归（分治思想）：比较首尾字符是否相等，再递归判断去掉首尾后的子串。约定空字符串和单字符都是回文。只处理小写字母，忽略大小写问题（输入保证为小写）。例如 is_palindrome("aba") = True，is_palindrome("abca") = False。
func: is_palindrome
starter: |
  def is_palindrome(s):
      # 递归判断回文
      # 在这里改
      return None
cases: |
  is_palindrome("aba") -> True
  is_palindrome("abba") -> True
  is_palindrome("abca") -> False
  is_palindrome("a") -> True
  is_palindrome("") -> True
hint: 终止条件：长度 <= 1 返回 True。递推关系：首尾相等 且 is_palindrome(s[1:-1]) 也为 True。
explain: 终止条件为 len(s) <= 1 时返回 True。递推关系为 s[0] == s[-1] 且 is_palindrome(s[1:-1])。这是一个线性递归（每层调用一次），深度为 len(s)//2。
```

```quiz
type: function
exam: true
q: 用回溯实现 permutations(nums)，返回输入列表的所有全排列（列表的列表），要求**按字典序**输出。例如 permutations([1, 2, 3]) = [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]。用 used 数组标记已用元素，注意结果集里要拷贝路径。
func: permutations
starter: |
  def permutations(nums):
      # 回溯求全排列
      # 在这里改
      return []
cases: |
  permutations([1, 2, 3]) -> [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
  permutations([1, 2]) -> [[1, 2], [2, 1]]
  permutations([1]) -> [[1]]
hint: used 数组标记用过的下标，for 循环遍历所有未用元素，做选择-递归-撤销选择。结果集里 append(path[:])。
explain: 全排列用 used 数组避免重复选同一元素。for 循环遍历所有下标，若未用则做选择（used[i]=True、path.append(nums[i])），递归，再撤销（path.pop()、used[i]=False）。终止条件 len(path)==len(nums) 时 append(path[:])。为保证字典序，循环按原顺序遍历下标即可。
```

## 三、项目（1 题）

```quiz
type: project
exam: true
q: 实现一个支持"撤销"的表达式求值器 UndoCalculator。它维护一个当前值（初始为 0）和一个操作历史栈。要求实现三个方法，均用递归思想处理历史栈：add(x) 把当前值加 x 并入栈；subtract(x) 把当前值减 x 并入栈；undo() 撤销上一次操作（把当前值恢复到操作前的状态），若没有操作可撤销则不做任何事。请用"历史栈记录每次操作的类型和数值"的方式实现，让 undo 能正确恢复。示例：c = UndoCalculator(); c.add(5); c.add(3); c.subtract(2); 此时当前值为 6；c.undo() 后当前值为 8（撤销了减 2）；c.undo() 后当前值为 5（撤销了加 3）。注意：每次操作后可通过 get_value() 查看当前值。
starter: |
  class UndoCalculator:
      def __init__(self):
          self.value = 0
          self.history = []   # 每个元素为 ('add', x) 或 ('subtract', x)
      
      def add(self, x):
          # 在这里改
          pass
      
      def subtract(self, x):
          # 在这里改
          pass
      
      def undo(self):
          # 在这里改
          pass
      
      def get_value(self):
          return self.value
cases: |
  c=UndoCalculator(); c.add(5); c.add(3); c.subtract(2); c.get_value() -> 6
  c=UndoCalculator(); c.add(10); c.get_value() -> 10
  c=UndoCalculator(); c.add(10); c.undo(); c.get_value() -> 0
  c=UndoCalculator(); c.add(5); c.subtract(3); c.undo(); c.undo(); c.get_value() -> 0
  c=UndoCalculator(); c.undo(); c.get_value() -> 0
hint: add(x)：先 self.history.append(('add', x)) 再 self.value += x。subtract 同理但 value -= x。undo：若 history 非空，取出最后一个操作，若是 add 则 value -= x，若是 subtract 则 value += x。
explain: 核心是 history 栈存的是"操作"而不是"值"。add 入栈 ('add', x) 并 value += x；subtract 入栈 ('subtract', x) 并 value -= x。undo 时 pop 栈顶：若是 add 则 value -= x（撤销加法），若是 subtract 则 value += x（撤销减法）。这样就不需要在栈里存完整快照，也天然支持任意次撤销。
```
