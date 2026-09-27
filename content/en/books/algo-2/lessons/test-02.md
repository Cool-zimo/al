# Chapter 2 · Advanced Linked Lists · Chapter Test

> 8 questions. This chapter answers the question: "When a linked list cannot step backward by index, how do you locate the target in one pass with fast and slow pointers, how do you detect a cycle, and how do you organize a linked list into an LRU cache?"
> **All correct to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: When using fast and slow pointers to detect a cycle, why is the relative speed set to 1 (slow moves 1 step, fast moves 2 steps)?
options:
- Fast moving 2 steps is just a way to write shorter code
- With slow at 1 step and fast at 2, if there is a cycle fast gains exactly 1 step on slow each round and must eventually catch it; if fast moved 3 steps it could "jump over" slow forever in an odd-length cycle
- The relative speed must be even for the algorithm to terminate
- Fast must be exactly twice as fast as slow to cover the whole list
answer: 1
explain: Inside the cycle, suppose its length is C. Fast gains 1 step on slow each round, so the distance between them shrinks by 1 each round and they must meet within C rounds. If fast moved 3 steps (gaining 2 each round), an odd cycle length with an odd initial offset can produce a permanent "off by one" leapfrog that needs extra handling. Moving 2 steps is the safe, standard choice.
```

```quiz
type: choice
q: In Floyd's cycle detection code, why compare pointers with `is` rather than `==`?
options:
- Because ListNode has no __eq__ method, so == would raise an error
- Because is compares identity (whether it is the same object) and we care about "both pointers point at the same node"; == compares values, so different nodes with equal values would be mistaken for a meeting
- Because is is faster than ==
- Because == only works on numbers, not on objects
answer: 1
explain: Cycle detection decides whether two references point at the very same node object in memory. is compares object identity (same id), while == compares values. If the list happens to contain two nodes with the same value, == would falsely report a meeting; is would not. This is the essential difference between identity and equality.
```

```quiz
type: choice
q: When removing the N-th node from the end, why does the fast pointer move N+1 steps first instead of N?
options:
- Because Python's range starts at 0, and the extra step is just conventional style
- The extra step makes the slow pointer land on the predecessor of the node to delete, so you can do prev.next = prev.next.next
- Fast must traverse the whole list, and N+1 merely prevents it from stopping early
- N+1 is meant to skip the dummy node itself
answer: 1
explain: Deletion in a linked list requires rewriting the predecessor's next. Moving fast N steps makes it stop on the node to delete, leaving slow one position short of its predecessor. Moving N+1 steps puts fast one step beyond the target, so slow lands exactly on the predecessor and deletion is just slow.next = slow.next.next.
```

```quiz
type: choice
q: When removing the N-th node from the end, why is a dummy head node always added?
options:
- To make the linked list look tidier
- Because the code will not pass syntax checking without dummy
- Because the node to delete might be the head itself; with dummy every node (including the original head) has a predecessor, so deleting the head only takes dummy.next = head.next and shares one logic path with every other case, while also avoiding the crash of accessing None.next when fast is None
- Because dummy speeds up the program
answer: 2
explain: When n equals the list length, the node to delete is exactly the head. Without dummy, slow sits on the head and slow.next = slow.next.next rewrites the second node, leaving the head untouched. With dummy, the head also has a predecessor, unifying the logic, and it prevents the AttributeError of None.next when the fast pointer walks off the list.
```

```quiz
type: choice
q: When implementing an LRU cache, why combine a hash table with a doubly linked list?
options:
- Because hash table lookup is O(1) and a doubly linked list can move any node to the head or delete it in O(1), complementing each other so both get and put are O(1)
- Because a doubly linked list can resize itself automatically
- Because a hash table can only store integers and needs the doubly linked list for other types
- Because this arrangement reduces hash collisions
answer: 0
explain: LRU needs two operations at O(1): key lookup (hash table, O(1)) and moving a node to the head or dropping the least recently used tail node in "most recently used order" (doubly linked list, O(1), since each node holds prev and next with no traversal). A hash table alone cannot maintain order, and a list alone cannot locate in O(1); together they are complete.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Detect whether a linked list has a cycle. Return True if it does, otherwise False. The input is given as a Python list (e.g. [3,2,0,-4]) together with the entry position pos (0 means the head; if there is a cycle, the tail points at that position; -1 means no cycle). Use fast and slow pointers (slow 1 step, fast 2 steps) and judge meeting with pointer identity only.
func: has_cycle
starter: |
  class ListNode:
      def __init__(self, val=0, next=None):
          self.val = val
          self.next = next

  def build(vals, pos):
      # pos: 0-based index of cycle entry, -1 means no cycle
      if not vals:
          return None
      nodes = [ListNode(v) for v in vals]
      for i in range(len(nodes) - 1):
          nodes[i].next = nodes[i + 1]
      if pos >= 0:
          nodes[-1].next = nodes[pos]
      return nodes[0]

  def has_cycle(head, pos):
      # head: ListNode, detect cycle with fast and slow pointers
      return False

  print(has_cycle(build([3, 2, 0, -4], 1), 1))
cases: |
  [3,2,0,-4], 1 -> True
  [1,2], 0 -> True
  [1], -1 -> False
  [1,2,3,4], -1 -> False
hint: slow=fast=head. while fast and fast.next: slow=slow.next; fast=fast.next.next; if slow is fast: return True. If the loop ends without a meeting, there is no cycle, so return False. Note is rather than ==.
explain: Fast moves twice as fast as slow. With no cycle, fast or fast.next reaches None first and the loop exits with False. With a cycle, once fast enters it, it gains 1 step on slow each round, the gap shrinks, and they must eventually meet—meeting means return True. Use is for identity so nodes with equal values cannot cause a false positive.
```

```quiz
type: function
q: Remove the N-th node from the end of a linked list and return the head of the new list (as a Python list). The input is a list of node values and an integer n, e.g. [1,2,3,4,5] and 2, with output [1,2,3,5]. Use a fast pointer that moves N+1 steps first, plus a dummy head node, and finish in one pass.
func: remove_nth_from_end
starter: |
  class ListNode:
      def __init__(self, val=0, next=None):
          self.val = val
          self.next = next

  def build(vals):
      dummy = ListNode(0); cur = dummy
      for v in vals:
          cur.next = ListNode(v); cur = cur.next
      return dummy.next

  def to_list(head):
      out = []
      while head:
          out.append(head.val); head = head.next
      return out

  def remove_nth_from_end(head, n):
      # head: ListNode, n counts from 1
      # use dummy + fast/slow pointers, fast moves n+1 steps first
      return None

  print(to_list(remove_nth_from_end(build([1, 2, 3, 4, 5]), 2)))
cases: |
  [1,2,3,4,5], 2 -> [1,2,3,5]
  [1], 1 -> []
  [1,2], 2 -> [2]
  [1,2,3], 3 -> [2,3]
hint: dummy=ListNode(0, head); fast=slow=dummy. First for _ in range(n+1): fast=fast.next. Then while fast: fast=fast.next; slow=slow.next. Finally slow.next=slow.next.next, and return dummy.next.
explain: The key is moving fast n+1 steps first. When fast becomes None, slow lands exactly on the predecessor of the node to delete, so slow.next=slow.next.next completes the removal. Dummy guarantees there is always a predecessor to operate on (as in [1,2], n=2 when deleting the head) and unifies every edge case.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Implement an LRUCache class: given a capacity on initialization; get(key) returns the corresponding value and moves that node to the "most recently used" head, or -1 if the key is absent; put(key, value) updates the value and moves the node to the head if the key exists, otherwise inserts a new node, and if capacity is exceeded it removes the least recently used tail node. Both get and put must be O(1), using a hash table plus a doubly linked list with head and tail sentinels so that no null-pointer checks are needed.
checklist:
- Define a doubly linked list node class DListNode with fields key, val, prev, next
- Maintain two sentinel nodes head and tail, where head.next is the most recently used node and tail.prev is the least recently used node
- Implement _add(node) to insert a node right after head, and _remove(node) to detach any node from the list; both change only pointers and run in O(1)
- Implement _move_to_head(node): first _remove(node), then _add(node)
- get(key): on a hash hit, _move_to_head and return the value; on a miss return -1
- put(key, value): if the key exists update its value and _move_to_head; otherwise create a new node, _add it, store it in the hash, and if over capacity delete tail.prev and also remove that key from the hash
- Verify with the sample interaction: capacity=2, put(1,1), put(2,2), get(1) returns 1, after put(3,3) get(2) returns -1
- Test the boundary: capacity=1 has correct coverage and deletion logic
starter: |
  class DListNode:
      def __init__(self, key=0, val=0):
          self.key = key
          self.val = val
          self.prev = None
          self.next = None


  class LRUCache:
      def __init__(self, capacity):
          self.capacity = capacity
          self.cache = {}          # key -> DListNode
          self.head = DListNode()  # sentinel for most recently used (head)
          self.tail = DListNode()  # sentinel for least recently used (tail)
          self.head.next = self.tail
          self.tail.prev = self.head

      def _add(self, node):
          # insert node right after head (most recent position)
          pass

      def _remove(self, node):
          # detach node from the doubly linked list
          pass

      def _move_to_head(self, node):
          # remove first, then insert right after head
          pass

      def get(self, key):
          return -1

      def put(self, key, value):
          pass


  if __name__ == "__main__":
      lru = LRUCache(2)
      lru.put(1, 1)
      lru.put(2, 2)
      print(lru.get(1))   # expect 1
      lru.put(3, 3)
      print(lru.get(2))   # expect -1
```
