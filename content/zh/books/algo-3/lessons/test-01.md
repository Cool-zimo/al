# 第 1 章 · 二叉树基础 · 大测验

> 8 道题。这一章解决的是"为什么要有树、怎么遍历一棵树、BST 和平衡是怎么回事"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

---

```quiz
type: choice
exam: true
q: 有序数组用二分查找是 O(log n)，但插入要搬元素。树相比数组和链表，核心价值是哪一项？
options:
- 树在内存里连续存放，所以比链表快
- 树把"有序"藏在结构里，平衡时查找、插入、删除都能接近 O(log n)
- 树的节点数一定比数组少，所以天然更快
- 树不需要递归，可以完全用循环实现，因此没有调用栈开销
answer: 1
explain: 树靠分叉把搜索空间每次砍一半，平衡时高度为 O(log n)，查找、插入、删除都能接近 O(log n)。树的内存并不连续（链式表示靠指针），节点数也不比数组少，递归只是常见写法而非本质。
```

```quiz
type: choice
exam: true
q: 对如下这棵二叉树做前序遍历，正确的访问顺序是？
       1
      / \
     2   3
    / \
   4   5
options:
- [1, 2, 4, 5, 3]
- [4, 2, 5, 1, 3]
- [4, 5, 2, 3, 1]
- [1, 3, 2, 4, 5]
answer: 0
explain: 前序是"根→左→右"。先访问根 1，再递归前序遍历左子树 [2,4,5]，最后遍历右子树 [3]，结果为 [1,2,4,5,3]。中序是 [4,2,5,1,3]，后序是 [4,5,2,3,1]。
```

```quiz
type: choice
exam: true
q: 同一棵树的前序、中序、后序三种遍历，以下说法正确的是？
options:
- 三种遍历得到的序列长度不同，后序最短
- 三种遍历的访问顺序不同，但序列长度都等于节点数
- 三种遍历得到完全相同的序列，因为访问的是同一批节点
- 前序和后序可以确定唯一一棵二叉树，不需要中序
answer: 1
explain: 三种遍历都恰好访问每个节点一次，所以序列长度都等于节点数，区别只是根、左、右的相对顺序。仅有前序+后序通常不能唯一确定一棵二叉树（例如所有节点只有左孩子或只有右孩子时会有歧义），必须前序+中序（或后序+中序）才能重建。
```

```quiz
type: choice
exam: true
q: 用队列对下面的二叉树做层序遍历（BFS），出队顺序正确的是？
       1
      / \
     2   3
    / \   \
   4   5   6
options:
- [1, 2, 3, 4, 5, 6]
- [1, 3, 2, 4, 5, 6]
- [1, 2, 4, 5, 3, 6]
- [4, 5, 6, 2, 3, 1]
answer: 0
explain: 层序遍历按"层从上到下、同层从左到右"依次入队出队。第 1 层 [1]，第 2 层 [2,3]，第 3 层 [4,5,6]，结果为 [1,2,3,4,5,6]。BFS 用队列保证"先访问的节点先扩展其子节点"。
```

```quiz
type: choice
exam: true
q: 一棵二叉搜索树（BST）的中序遍历序列是 [1, 2, 3, 4, 5]，关于这棵 BST 的形状，下列说法正确的是？
options:
- 中序遍历严格递增，说明这棵树一定是满二叉树
- 中序遍历严格递增，只能说明它满足 BST 性质，树的形状无法仅凭中序遍历确定
- 中序遍历严格递增，说明这棵树一定退化成一条链
- BST 的中序遍历一定是降序的
answer: 1
explain: BST 的定义就是"左子树所有节点 < 根 < 右子树所有节点"，等价于中序遍历严格递增。但满足这个条件的树可以有很多形状（插入顺序不同就不同），中序序列本身不能还原出唯一形状，需要结合前序或后序。
```

## 第二部分 · 动手题

---

```quiz
type: function
exam: true
func: max_depth
q: 实现 max_depth(root)，返回二叉树的最大深度（根节点到最远叶子节点的边数）。空树返回 0。层序列表用 None 表示空缺，例如 [3,9,20,None,None,15,7]。
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

  def max_depth(root):
      # 返回二叉树的最大深度（边数）
      # 在这里改
      return 0
cases: |
  max_depth(None) -> 0
  max_depth(build([1])) -> 0
  max_depth(build([3,9,20,None,None,15,7])) -> 2
  max_depth(build([1,None,2,None,3,None,4])) -> 3
hint: 终止条件 root 为 None 返回 0。否则返回 1 + max(max_depth(root.left), max_depth(root.right))。
explain: 最大深度是左右子树最大深度的最大值再加 1。注意深度按边数定义，单节点树的深度为 0（根到叶子 0 条边）。"1 + max(左,右)"的句式是树递归的通用模板。
```

```quiz
type: function
exam: true
func: is_balanced
q: 实现 is_balanced(root)，判断一棵二叉树是否平衡。平衡的定义：对于树中任意一个节点，其左子树和右子树的高度差不超过 1，且左右子树也都平衡。空树视为平衡。
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

  def is_balanced(root):
      # 返回 True/False 表示是否平衡
      # 在这里改
      return True
cases: |
  is_balanced(None) -> True
  is_balanced(build([3,9,20,None,None,15,7])) -> True
  is_balanced(build([1,2,2,3,3,None,None,4,4])) -> False
  is_balanced(build([1,2,2,3,None,None,3,None,None,None,4])) -> False
hint: 写一个辅助函数 _height(node)，返回高度；若某侧返回 -1 表示已发现不平衡。平衡时返回 1 + max(左高, 右高)，否则返回 -1。
explain: 单纯自顶向下递归 height 会重复计算导致 O(n^2)。用后序遍历，让 height 返回正常高度或 -1（哨兵），一次遍历 O(n) 完成判断。高度按边数定义时叶子高度为 0，空树为 -1。
```

## 第三部分 · 小项目

---

```quiz
type: project
exam: true
q: 实现一个最小二叉搜索树（BST）类 MinBST，支持插入、查找、删除三种操作，并且提供中序遍历和统计信息方法。要求插入、查找、删除在平衡树中均为 O(log n)，删除需要处理三种情况（叶子、只有一个子节点、有两个子节点——此时用右子树的最小节点替代）。
checklist:
- TreeNode 类有 val/left/right 三个字段，BST 类有 root 字段
- insert(val) 按 BST 规则插入，重复值可以允许（放在右子树）或忽略，需说明策略
- search(val) 返回布尔值，表示是否存在该值
- delete(val) 删除成功返回 True，不存在返回 False；有两个子节点时用右子树最小值替代
- inorder() 返回中序遍历列表，应当是非降序的（用于验证 BST 性质）
- size() 返回节点总数，height() 返回树的最大深度（边数），min_val()/max_val() 返回最小/最大值 O(h)
- 提供 __init__ 接受可选的可迭代参数，批量插入
starter: |
  class TreeNode:
      def __init__(self, val, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right


  class MinBST:
      def __init__(self, vals=None):
          self.root = None
          if vals:
              for v in vals:
                  self.insert(v)

      def insert(self, val):
          # 按 BST 规则插入 val
          # 在这里改
          pass

      def search(self, val):
          # 返回 True/False
          # 在这里改
          return False

      def delete(self, val):
          # 删除 val，返回 True/False
          # 在这里改
          return False

      def inorder(self):
          # 返回中序遍历列表
          # 在这里改
          return []

      def size(self):
          # 返回节点总数
          # 在这里改
          return 0

      def height(self):
          # 返回最大深度（边数）
          # 在这里改
          return 0

      def min_val(self):
          # 返回最小值，空树返回 None
          # 在这里改
          return None

      def max_val(self):
          # 返回最大值，空树返回 None
          # 在这里改
          return None


  # 测试示例（可修改、可删除）
  if __name__ == "__main__":
      t = MinBST([5, 3, 7, 2, 4, 6, 8])
      print(t.inorder())      # [2, 3, 4, 5, 6, 7, 8]
      print(t.search(4))     # True
      print(t.search(9))     # False
      print(t.min_val(), t.max_val())  # 2 8
      print(t.delete(3))     # True（有两个子节点，用右子树最小节点 4 替代）
      print(t.inorder())     # [2, 4, 5, 6, 7, 8]
      print(t.size(), t.height())  # 6 2
```
