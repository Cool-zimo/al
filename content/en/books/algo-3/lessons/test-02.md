# Chapter 2 · Binary Tree Advanced · Big Quiz

> 8 questions. This chapter answers: how to use the universal recipe for tree recursion to break down any tree problem, and how to handle paths, LCA, reconstruction, and heaps.
> **You must get every question right to pass this chapter.**

## Part 1 · Multiple choice

---

```quiz
type: choice
exam: true
q: For the universal recipe of solving tree problems with recursion, which description best matches the "break down subproblems" mindset?
options:
- First traverse the whole tree, store the nodes in a list, then process the list with a loop
- Split the problem into three parts and combine them as "the result from the left subtree + the root's contribution + the result from the right subtree"
- First do a BFS level-order traversal, then use a dictionary to count layer by layer
- You must do both preorder and postorder traversals to get the right answer
answer: 1
explain: The universal skeleton of a tree recursion problem is: a termination condition (None) returns a base value, then recursively solve the left and right subtrees, and finally combine the results using the root's information. The pattern "left + root + right" gives rise to node count, depth, maximum path sum, and many other problems; it does not require storing nodes in a list or doing two traversals.
```

```quiz
type: choice
exam: true
q: Given a binary tree with preorder traversal [1, 2, 4, 5, 3] and inorder traversal [4, 2, 5, 1, 3], what is the key to reconstructing this tree?
options:
- The first element of preorder is the root of the current subtree, and inorder is used to split the sequence into the left and right subtrees
- The last element of preorder is the root of the current subtree, and it is used to split inorder into left and right parts
- The first element of inorder is the root of the current subtree, and it is used to split preorder into left and right parts
- Preorder alone uniquely determines the tree; inorder is not needed
answer: 0
explain: Preorder is "root → left → right," so the first element of the preorder sequence is the root of the current subtree. Find that root's position in the inorder sequence: everything to its left is the inorder of the left subtree, and everything to its right is the inorder of the right subtree. This gives the node counts of both subtrees, letting you split the preorder sequence accordingly and recurse. Neither preorder nor postorder alone determines the shape uniquely.
```

```quiz
type: choice
exam: true
q: Which statement about the lowest common ancestor (LCA) of two nodes is correct?
options:
- The LCA is always the node with the larger value among the two
- The LCA of two nodes is "the node that is an ancestor of both and has the greatest depth"; when both nodes are on one side of the root, the LCA is still the root
- The LCA can be None even when both nodes are in the tree
- You must first obtain the complete path of each node, then compare them with a hash table, which takes O(n²)
answer: 1
explain: The definition of an LCA is "the common ancestor with the greatest depth." For an ordinary binary tree (not necessarily a BST), one postorder traversal solves it in O(n): if the current node equals p or q, return it; if both recursive results are non-empty, the current node is the LCA; if only one side is non-empty, return that side. When the two nodes lie on opposite sides of the root, the LCA is the root itself.
```

```quiz
type: choice
exam: true
q: Python's heapq module implements a min-heap. If you want to use it to implement a "max-heap that always returns the maximum value," what is the correct approach?
options:
- heapq has no parameter to switch to a max-heap, so it cannot be done
- Store the negative -x when pushing, and negate the result again with -heapq.heappop(h) when popping
- Sort the values first and then put them into heapq; it will automatically become a max-heap
- Use heapq.heappop first and then negate the result; pushing does not need to change
answer: 1
explain: heapq only provides a min-heap, and push/pop cannot switch modes. Use the "store negatives" trick: push -x so that the most negative number (the original maximum) sits at the top, and negate again when popping to recover the maximum. Negating only on pop while leaving push unchanged would break the heap property.
```

```quiz
type: choice
exam: true
q: A heap's push and pop are implemented by "swimming up" and "sinking down." Which statement about their time complexity is correct?
options:
- Both are O(1) because a heap uses an array
- push is O(log n) and pop is O(n)
- Both are O(log n) because they walk at most one path from the root to a leaf
- heapify turns a list into a heap in O(n log n), which is faster than pushing elements one by one
answer: 2
explain: Push appends an element at the end and swims it up; pop moves the last element to the root and sinks it down. Both walk at most one path of height O(log n), so both are O(log n). heapify is O(n) (not O(n log n)); precisely because it adjusts the whole heap at once rather than pushing one by one, it is faster.
```

## Part 2 · Coding tasks

---

```quiz
type: function
exam: true
func: has_path_sum
q: Implement has_path_sum(root, target), checking whether there exists a root-to-leaf path whose node values sum to target. Return False for an empty tree. A leaf node is one with both left and right children empty.
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
      # Return whether a root-to-leaf path exists with sum equal to target
      # Edit below
      return False
cases: |
  has_path_sum(None, 0) -> False
  has_path_sum(build([5,4,8,11,None,13,4,7,2,None,None,None,1]), 22) -> True
  has_path_sum(build([1,2,3]), 5) -> False
  has_path_sum(build([1,2]), 1) -> False
hint: When you reach a leaf node, check whether target has been reduced to 0. For an ordinary node, subtract the current node's value from target, then recurse into the left and right subtrees; return True if either side is True.
explain: The key point is that you must reach a leaf to count a path; you cannot return True at an intermediate node. Subtract from target as you recurse, and exactly hitting 0 at a leaf means a path exists. An empty tree directly returns False because there is no root-to-leaf path.
```

```quiz
type: function
exam: true
func: build_tree
q: Implement build_tree(preorder, inorder), reconstructing a binary tree from its preorder and inorder traversals, and returning the root. The problem guarantees that the tree has no duplicate elements. Hint: you can use a hash table to map each inorder value to its index, locating the root in O(1).
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
      # Return the reconstructed root
      # Edit below
      return None
cases: |
  to_list(build_tree([3,9,20,15,7], [9,3,15,20,7])) -> [3,9,20,15,7]
  to_list(build_tree([1], [1])) -> [1]
  to_list(build_tree([1,2,3], [1,2,3])) -> [1,2,3]
  to_list(build_tree([1,2,3], [3,2,1])) -> [1,None,2,None,3]
hint: The first element of preorder is the root; locate it in inorder to split the sequence into left/right parts. Once the left-subtree size is known, preorder splits accordingly. Use a dict to store inorder indices and avoid linear lookup each time; use index intervals instead of slicing to reduce overhead.
explain: The core of reconstruction is that preorder provides the root and inorder provides the left/right split. Each recursion takes the next element from preorder as the root, looks up its position in the inorder table, splits the left and right subtree intervals, and constructs recursively. No duplicates guarantees unique lookup; index-interval recursion runs in O(n).
```

## Part 3 · Mini project

---

```quiz
type: project
exam: true
q: Implement a TopK system TopKTracker that maintains the largest K elements from a data stream in real time, and supports querying the Kth largest, dynamically updating K, and batch insertion. Use heapq and handle changes to K and an empty data stream correctly.
checklist:
- Use a heapq min-heap to store "the current largest K elements"; the top is the smallest among those K, i.e., the Kth largest
- __init__(self, k) initializes K and maintains the heap with an internal list heap
- add(self, val) inserts one element and keeps the heap size no larger than K
- add_all(self, vals) batch-inserts all elements from an iterable
- get_kth_largest(self) returns the Kth largest element; returns None when fewer than K elements are present
- set_k(self, k) dynamically changes K: shrink by popping excess elements, and when growing, do not affect the current heap (subsequent add calls will refill it naturally)
- peek_max(self) returns the top of the heap (the current Kth largest); used for verification
- A main block demonstrates all features with a sample data stream
starter: |
  import heapq


  class TopKTracker:
      def __init__(self, k):
          if k <= 0:
              raise ValueError("k must be a positive integer")
          self.k = k
          self.heap = []  # min-heap storing "the current largest k elements"

      def add(self, val):
          # Insert one element and maintain the heap
          # Edit below
          pass

      def add_all(self, vals):
          # Batch insertion
          # Edit below
          pass

      def get_kth_largest(self):
          # Return the kth largest; None if fewer than k elements exist
          # Edit below
          return None

      def set_k(self, k):
          # Dynamically change k
          # Edit below
          pass

      def peek_max(self):
          # Return the heap top (the current kth largest); None if empty
          # Edit below
          return None


  # Example tests (you may modify or delete them)
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
      print(t.get_kth_largest())   # 8 (only 4 elements present, fewer than 5, so None)
```
