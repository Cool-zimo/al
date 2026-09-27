# Chapter 1 · Binary Tree Basics · Big Quiz

> 8 questions. This chapter answers: why trees exist, how to traverse a tree, and what BSTs and balance are all about.
> **You must get every question right to pass this chapter.**

## Part 1 · Multiple choice

---

```quiz
type: choice
exam: true
q: A sorted array takes O(log n) to search using binary search, but inserting an element requires shifting. Compared with arrays and linked lists, what is the core value of a tree?
options:
- A tree is stored contiguously in memory, so it is faster than a linked list
- A tree bakes "order" into its structure, so search, insertion, and deletion all run close to O(log n) when balanced
- A tree always has fewer nodes than an array, so it is naturally faster
- A tree does not need recursion and can be implemented entirely with loops, avoiding call-stack overhead
answer: 1
explain: A tree uses branching to halve the search space each time; when balanced, the height is O(log n), so search, insertion, and deletion all run close to O(log n). A tree's memory is not contiguous (the linked representation uses pointers), it does not have fewer nodes than an array, and recursion is just a common implementation style rather than the essence of the tree.
```

```quiz
type: choice
exam: true
q: For the binary tree below, what is the correct order of a preorder traversal?
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
explain: Preorder is "root → left → right". Visit the root 1 first, then recursively preorder the left subtree [2,4,5], and finally the right subtree [3], giving [1,2,4,5,3]. Inorder is [4,2,5,1,3], and postorder is [4,5,2,3,1].
```

```quiz
type: choice
exam: true
q: For the same tree, comparing its preorder, inorder, and postorder traversals, which statement is correct?
options:
- The three traversals produce sequences of different lengths, with postorder being the shortest
- The three traversals visit nodes in different orders, but each sequence has length equal to the number of nodes
- The three traversals produce exactly the same sequence because they visit the same set of nodes
- Preorder plus postorder uniquely determines a binary tree, so inorder is not needed
answer: 1
explain: Each traversal visits every node exactly once, so the sequence length always equals the number of nodes; only the relative order of root, left, and right differs. Preorder+postorder alone usually cannot uniquely determine a binary tree (e.g., there is ambiguity when every node has only a left child or only a right child); you need preorder+inorder (or postorder+inorder) to reconstruct it.
```

```quiz
type: choice
exam: true
q: Using a queue to perform a level-order traversal (BFS) on the binary tree below, what is the correct dequeue order?
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
explain: Level-order traversal enqueues and dequeues "layer by layer from top to bottom, left to right within each layer." Layer 1 is [1], layer 2 is [2,3], and layer 3 is [4,5,6], giving [1,2,3,4,5,6]. BFS uses a queue to guarantee that "the node visited first expands its children first."
```

```quiz
type: choice
exam: true
q: A binary search tree (BST) has inorder traversal [1, 2, 3, 4, 5]. Which statement about the shape of this BST is correct?
options:
- The inorder sequence is strictly increasing, so the tree must be a full binary tree
- The inorder sequence is strictly increasing, which only proves that it satisfies the BST property; the shape cannot be determined from inorder alone
- The inorder sequence is strictly increasing, so the tree must degenerate into a single chain
- A BST's inorder traversal is always decreasing
answer: 1
explain: The definition of a BST is "all nodes in the left subtree < root < all nodes in the right subtree," which is equivalent to an inorder sequence that is strictly increasing. But many tree shapes can satisfy this condition (different insertion orders produce different shapes), and the inorder sequence alone cannot还原 a unique shape; you also need preorder or postorder.
```

## Part 2 · Coding tasks

---

```quiz
type: function
exam: true
func: max_depth
q: Implement max_depth(root), returning the maximum depth of a binary tree (the number of edges on the path from the root to the farthest leaf). Return 0 for an empty tree. A level-order list uses None for gaps, for example [3,9,20,None,None,15,7].
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
      # Return the maximum depth of the binary tree (in edges)
      # Edit below
      return 0
cases: |
  max_depth(None) -> 0
  max_depth(build([1])) -> 0
  max_depth(build([3,9,20,None,None,15,7])) -> 2
  max_depth(build([1,None,2,None,3,None,4])) -> 3
hint: The termination condition is root is None, return 0. Otherwise return 1 + max(max_depth(root.left), max_depth(root.right)).
explain: The maximum depth is one plus the larger of the maximum depths of the left and right subtrees. Depth is defined in edges, so a single-node tree has depth 0 (0 edges from root to leaf). The pattern "1 + max(left, right)" is the universal template for tree recursion.
```

```quiz
type: function
exam: true
func: is_balanced
q: Implement is_balanced(root), checking whether a binary tree is balanced. A balanced tree means that for every node, the height difference between its left and right subtrees is at most 1, and both subtrees are themselves balanced. An empty tree is considered balanced.
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
      # Return True/False for whether the tree is balanced
      # Edit below
      return True
cases: |
  is_balanced(None) -> True
  is_balanced(build([3,9,20,None,None,15,7])) -> True
  is_balanced(build([1,2,2,3,3,None,None,4,4])) -> False
  is_balanced(build([1,2,2,3,None,None,3,None,None,None,4])) -> False
hint: Write a helper _height(node) that returns the height; if either side returns -1 it means an imbalance was already found. When balanced, return 1 + max(left height, right height); otherwise return -1.
explain: Simply recursing top-down and recomputing height at every node leads to repeated work and O(n^2). Use postorder traversal so that height returns either the normal height or -1 (a sentinel); one traversal completes the check in O(n). With depth measured in edges, a leaf's height is 0 and an empty tree's is -1.
```

## Part 3 · Mini project

---

```quiz
type: project
exam: true
q: Implement a minimal binary search tree class MinBST that supports insertion, search, and deletion, and provides inorder traversal and statistics methods. Insertion, search, and deletion should all run in O(log n) on a balanced tree; deletion must handle the three cases (leaf, one child, two children — replace with the minimum node in the right subtree).
checklist:
- TreeNode has val/left/right fields; the BST class has a root field
- insert(val) inserts according to BST rules; duplicates may be allowed (placed in the right subtree) or ignored, and the strategy must be stated
- search(val) returns a boolean indicating whether the value exists
- delete(val) returns True on successful deletion and False if the value does not exist; when there are two children, replace with the minimum of the right subtree
- inorder() returns an inorder traversal list, which should be non-decreasing (to verify the BST property)
- size() returns the total node count; height() returns the maximum depth (in edges); min_val()/max_val() return the minimum/maximum value in O(h)
- __init__ accepts an optional iterable for batch insertion
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
          # Insert val according to BST rules
          # Edit below
          pass

      def search(self, val):
          # Return True/False
          # Edit below
          return False

      def delete(self, val):
          # Delete val, return True/False
          # Edit below
          return False

      def inorder(self):
          # Return the inorder traversal list
          # Edit below
          return []

      def size(self):
          # Return the total node count
          # Edit below
          return 0

      def height(self):
          # Return the maximum depth (in edges)
          # Edit below
          return 0

      def min_val(self):
          # Return the minimum value; None for an empty tree
          # Edit below
          return None

      def max_val(self):
          # Return the maximum value; None for an empty tree
          # Edit below
          return None


  # Example tests (you may modify or delete them)
  if __name__ == "__main__":
      t = MinBST([5, 3, 7, 2, 4, 6, 8])
      print(t.inorder())      # [2, 3, 4, 5, 6, 7, 8]
      print(t.search(4))     # True
      print(t.search(9))     # False
      print(t.min_val(), t.max_val())  # 2 8
      print(t.delete(3))     # True (has two children, replaced by the right subtree's minimum 4)
      print(t.inorder())     # [2, 4, 5, 6, 7, 8]
      print(t.size(), t.height())  # 6 2
```
