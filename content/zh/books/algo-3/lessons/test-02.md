# 第 2 章 · 二叉树进阶 · 大测验

> 8 道题。这一章解决的是"如何用递归通法拆解任意树题、如何处理路径/LCA/重建/堆"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

---

```quiz
type: choice
exam: true
q: 处理树题的递归通法，以下描述最符合"分解子问题"思路的是？
options:
- 先遍历整棵树把节点存进列表，再用循环处理
- 把问题拆成"左子树的结果 + 根节点的贡献 + 右子树的结果"三部分组合
- 先用 BFS 层序遍历，再按层用字典统计
- 必须同时用前序和后序遍历两次，才能得到正确答案
answer: 1
explain: 树递归题的通用骨架是：终止条件（None）返回基准值，然后递归求解左右子树，最后用根节点的信息把左右结果合并。"左 + 根 + 右"的句式可以派生出节点数、深度、最大路径和等大量问题，不一定要遍历存列表，也不一定要做两次遍历。
```

```quiz
type: choice
exam: true
q: 给定一棵二叉树的前序遍历 [1, 2, 4, 5, 3] 和中序遍历 [4, 2, 5, 1, 3]，重建这棵树的关键是？
options:
- 前序的第一个元素是当前子树的根，在中序里用它把序列分成左子树和右子树
- 前序的最后一个元素是当前子树的根，用它把中序分成左右两部分
- 中序的第一个元素是当前子树的根，用它把前序分成左右两部分
- 只用前序遍历就能唯一确定树，不需要中序
answer: 0
explain: 前序遍历的顺序是"根→左→右"，所以前序序列的首元素就是当前子树的根。在中序遍历里找到这个根的位置，其左边是左子树的中序、右边是右子树的中序，由此可算出左右子树的节点数，再回到前序序列切分左右子树的前序，递归重建。仅有前序或后序不能唯一确定形状。
```

```quiz
type: choice
exam: true
q: 关于两个节点的最近公共祖先（LCA），下列说法正确的是？
options:
- LCA 一定是两个节点中值较大的那个
- 两个节点的 LCA 是"同时是两者的祖先、且深度最大的那个节点"；两节点都在根的一侧时 LCA 仍是根
- LCA 可能是 None，即使两个节点都在树中
- 必须先知道两个节点各自的完整路径，再用哈希表比对，时间复杂度 O(n²)
answer: 1
explain: LCA 的定义是"深度最大的公共祖先"。对于二叉树（不一定是 BST），一次后序遍历即可在 O(n) 内求解：若当前节点等于 p 或 q 则返回该节点；左右递归结果都非空说明当前节点就是 LCA；只有一侧非空则返回那一侧。两节点分别位于根的左右两侧时 LCA 正是根。
```

```quiz
type: choice
exam: true
q: Python 的 heapq 模块是最小堆。如果想用它实现"每次取出最大值"的最大堆，正确做法是？
options:
- heapq 没有参数可以切换成最大堆，因此做不到
- 存入元素时存负数 -x，取出时再取负 -heapq.heappop(h)
- 先 sorted 排好序再放进 heapq，它就会自动变成最大堆
- 用 heapq.heappop 后再用负号反转结果即可，push 时不用改
answer: 1
explain: heapq 只提供最小堆，push/pop 都无法切换模式。用"存负数"技巧：push -x 让最小的负数（即原数的最大值）位于堆顶，pop 时再取负还原，就能得到最大堆语义。只在 pop 时取负而 push 时不变，会破坏堆性质。
```

```quiz
type: choice
exam: true
q: 堆的 push 和 pop 各由"上浮"和"下沉"完成，关于它们的时间复杂度，正确的是？
options:
- 两者都是 O(1)，因为堆用数组存储
- push 是 O(log n)，pop 是 O(n)
- 两者都是 O(log n)，因为最多走一条从根到叶子的路径
- heapify 把列表原地变成堆是 O(n log n)，比逐个 push 更快
answer: 2
explain: push 把元素放末尾再上浮，pop 把末尾元素补到根再下沉，两者最多都走一条高度为 O(log n) 的路径，因此都是 O(log n)。heapify 是 O(n)（不是 O(n log n)），正因为它是整体调整而非逐个 push，所以更快。
```

## 第二部分 · 动手题

---

```quiz
type: function
exam: true
func: has_path_sum
q: 实现 has_path_sum(root, target)，判断是否存在一条从根节点到叶子节点的路径，使得路径上所有节点值之和等于 target。空树返回 False。叶子节点是指左右子节点都为空的节点。
starter: |
  class TreeNode:
      def __init__(self, val=0, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def build(vals):
      if not vals or vals[0] is None:
          return None
      nodes = [None if v is None else TreeNode(v) for v in vals]
      for i in range(len(nodes)):
          if nodes[i] is None:
              continue
          left, right = 2 * i + 1, 2 * i + 2
          if left < len(nodes) and nodes[left] is not None:
              nodes[i].left = nodes[left]
          if right < len(nodes) and nodes[right] is not None:
              nodes[i].right = nodes[right]
      return nodes[0]

  def has_path_sum(root, target):
      # 返回是否存在根到叶子的路径和等于 target
      # 在这里改
      return False
cases: |
  has_path_sum(None, 0) -> False
  has_path_sum(build([5,4,8,11,None,13,4,7,2,None,None,None,1]), 22) -> True
  has_path_sum(build([1,2,3]), 5) -> False
  has_path_sum(build([1,2]), 1) -> False
hint: 递归到叶子节点时判断 target 是否减到 0。普通节点把 target 减去当前节点值后递归左/右子树，只要有一侧为 True 就返回 True。
explain: 关键点是"必须走到叶子"才算一条路径，不能在中途节点就返回 True。递归时把 target 逐层递减，到达叶子时恰好为 0 说明存在路径。空树直接返回 False，因为不存在根到叶子的路径。
```

```quiz
type: function
exam: true
func: build_tree
q: 实现 build_tree(preorder, inorder)，根据前序遍历和中序遍历重建二叉树，返回根节点。题目保证树中没有重复元素。提示：可以先用哈希表把中序遍历的值映射到下标，从而 O(1) 定位根。
starter: |
  class TreeNode:
      def __init__(self, val=0, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def to_list(root):
      if root is None:
          return []
      from collections import deque
      ans, q = [], deque([root])
      while q:
          n = q.popleft()
          if n is None:
              ans.append(None)
          else:
              ans.append(n.val)
              q.append(n.left)
              q.append(n.right)
      while ans and ans[-1] is None:
          ans.pop()
      return ans

  def build_tree(preorder, inorder):
      # 返回重建后的根节点
      # 在这里改
      return None
cases: |
  to_list(build_tree([3,9,20,15,7], [9,3,15,20,7])) -> [3,9,20,15,7]
  to_list(build_tree([1], [1])) -> [1]
  to_list(build_tree([1,2,3], [1,2,3])) -> [1,2,3]
  to_list(build_tree([1,2,3], [3,2,1])) -> [1,None,2,None,3]
hint: 前序首元素是根，在中序中定位根把序列分成左/右两部分；左子树长度确定后，前序序列也随之切分。用 dict 存中序下标避免每次线性查找，递归函数用下标区间而非切片，降低开销。
explain: 重建的核心是前序提供根、中序提供左右分界。递归每次取前序的下一个元素作根，查中序表定位，分出左右子树区间后递归构造。无重复元素保证定位唯一；用下标区间递归时间复杂度 O(n)。
```

## 第三部分 · 小项目

---

```quiz
type: project
exam: true
q: 实现一个 TopK 系统 TopKTracker，它能从数据流中实时维护最大的 K 个元素，并支持查询第 K 大、动态更新 K、以及批量添加。要求使用 heapq 实现，并正确处理 K 变化和数据流为空的情况。
checklist:
- 用 heapq 最小堆存储"当前最大的 K 个元素"，堆顶是这 K 个中最小的，即第 K 大
- __init__(self, k) 初始化 K，内部用一个列表 heap 维护堆
- add(self, val) 加入一个元素并维护堆大小不超过 K
- add_all(self, vals) 批量加入可迭代对象中的所有元素
- get_kth_largest(self) 返回第 K 大元素，元素不足 K 个时返回 None
- set_k(self, k) 动态修改 K：变小则弹出多余元素，变大则不影响现有堆（后续 add 会自然补齐）
- peek_max(self) 返回堆顶元素（当前第 K 大），用于验证
- 主程序用一个示例数据流演示全部功能
starter: |
  import heapq


  class TopKTracker:
      def __init__(self, k):
          if k <= 0:
              raise ValueError("k 必须是正整数")
          self.k = k
          self.heap = []  # 最小堆，存"当前最大的 k 个元素"

      def add(self, val):
          # 加入一个元素并维护堆
          # 在这里改
          pass

      def add_all(self, vals):
          # 批量加入
          # 在这里改
          pass

      def get_kth_largest(self):
          # 返回第 k 大，不足 k 个元素返回 None
          # 在这里改
          return None

      def set_k(self, k):
          # 动态修改 k
          # 在这里改
          pass

      def peek_max(self):
          # 返回堆顶（当前第 k 大），空返回 None
          # 在这里改
          return None


  # 测试示例（可修改、可删除）
  if __name__ == "__main__":
      t = TopKTracker(3)
      for x in [4, 5, 8, 2]:
          t.add(x)
      print(t.get_kth_largest())   # 4
      t.add_all([3, 9, 1, 7])
      print(t.get_kth_largest())   # 7
      print(t.peek_max())          # 7
      t.set_k(2)
      print(t.get_kth_largest())   # 8
      t.set_k(5)
      print(t.get_kth_largest())   # 8（此时只有 4 个元素，不足 5，返回 None）
```
