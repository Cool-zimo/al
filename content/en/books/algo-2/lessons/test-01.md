# Chapter 1 · Linked List Basics · Big Test

> 8 questions. This chapter answers the question: "Array insertion and deletion cost O(n) in shifts; how does a linked list use pointer rewrites to bring insertion and deletion down to O(1)?"
> **You must get every answer right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: In a Python array of length 100000, you call insert(0, x) at the head 10000 times. Roughly how many element shifts does that cause?
options:
- About 10000
- About 100000
- About 1 billion
- About 0, because head insertion is O(1)
answer: 2
explain: Each head insertion shifts every existing element one slot right. Before the i-th insertion there are 100000+i elements, so the total shift count is roughly 10000×100000 + 10000×9999/2, which is on the order of 1 billion. That is the real cost of list.insert(0, x) and the reason an array is the wrong choice for frequent head insertion.
```

```quiz
type: choice
q: Why can a linked list perform a middle insertion in O(1)?
options:
- Linked list elements are stored contiguously in memory
- Each linked list node only records the position of the next node, so insertion only requires changing the pointers of the predecessor and the new node
- Linked lists have a hash index that can locate any position
- Linked lists pre-allocate a large enough contiguous block of memory
answer: 1
explain: Linked list nodes can sit anywhere in memory; each node stores a next pointer. To insert, you make the predecessor point at the new node and the new node point at the predecessor's original successor—only two pointer changes, independent of list length. The trade-off is losing the random access that contiguous memory provides.
```

```quiz
type: choice
q: In the ListNode definition below, what is the purpose of the next field?
options:
- To store the current node's value
- To record the node's index in the list
- To point at the next node and form the chain's connections
- To point at the previous node
answer: 2
explain: class ListNode: def __init__(self, val=0, next=None): self.val=val; self.next=next. next holds a reference to the next node, and those references are exactly what link separate nodes into a chain. Without next, nodes would be isolated from one another and there would be no linked list.
```

```quiz
type: choice
q: When traversing a linked list, why is the loop condition while head preferable to while head.next?
options:
- while head skips the head node
- while head.next stops at the last node, so the last node needs extra handling
- while head has a worse time complexity
- while head.next cannot tell whether the list is empty
answer: 1
explain: while head lets the loop body execute one final time when head points at the last node, then head naturally becomes None and exits—boundary handling stays uniform. while head.next becomes false when head points at the last node, so the loop ends early and the last node never gets processed; you usually have to add cleanup code afterward.
```

```quiz
type: choice
q: When deleting a node from a linked list, why must you first obtain its predecessor?
options:
- Because you need to free the predecessor's memory
- Because you must modify the predecessor's next pointer to point at the deleted node's successor, disconnecting the deleted node
- Because you need to compare the predecessor's value
- Because the predecessor stores the list's length
answer: 1
explain: A linked list is only traversable front to back, so deletion means rewriting the edge "predecessor → deleted node" as "predecessor → deleted node's successor." If you only have a reference to the deleted node and not its predecessor, you cannot rewrite the predecessor's next, and the node cannot be removed. This is also why deleting the Nth node from the end requires locating its predecessor.
```

---

## Part 2 · Hands-On

```quiz
type: function
q: Reverse a singly linked list. The head is given as a Python list, e.g. [1,2,3,4,5], and you should return the reversed head as a list, e.g. [5,4,3,2,1]. Use the three pointers prev/cur/next to reverse in place with O(1) space.
func: reverse_list
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

  def reverse_list(head):
      # head: ListNode, reverse in place using prev/cur/next three pointers
      return None

  print(to_list(reverse_list(build([1, 2, 3, 4, 5]))))
cases: |
  [1,2,3,4,5] -> [5,4,3,2,1]
  [1] -> [1]
  [] -> []
  [1,2] -> [2,1]
hint: prev=None; cur=head. Each iteration: save nxt=cur.next, point cur.next at prev, then prev=cur and cur=nxt. When the loop ends, prev is the new head.
explain: The heart of the three-pointer reversal is "save next first"—once cur.next points at prev you can no longer reach the original successor. Each step reverses one arrow, so n nodes take exactly n iterations. prev starts as None, which becomes the None sentinel at the end of the new list.
```

```quiz
type: function
q: Merge two ascending linked lists into one ascending linked list and return it. The inputs are two Python lists, e.g. l1=[1,2,4], l2=[1,3,4], and the output is [1,1,2,3,4,4]. Use a dummy head node and keep space at O(1) (only rewire pointers, do not create new nodes).
func: merge_two_lists
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

  def merge_two_lists(l1, l2):
      # l1, l2 are both ListNodes; merge using dummy + tail pointers
      return None

  print(to_list(merge_two_lists(build([1, 2, 4]), build([1, 3, 4]))))
cases: |
  [1,2,4], [1,3,4] -> [1,1,2,3,4,4]
  [], [0] -> [0]
  [], [] -> []
  [5], [1,2,3] -> [1,2,3,5]
hint: dummy=ListNode(0); tail=dummy. While l1 and l2: compare l1.val and l2.val, attach the smaller one to tail.next, and advance the corresponding pointer and tail. At the end attach whichever list remains to tail.next. Return dummy.next.
explain: The dummy makes every "attach a node to the result" step logically identical, with no need to separately figure out which node is first. When the loop ends, exactly one list still has elements, and because it is already sorted you can attach it directly with tail.next. This is the linked-list version of the merge step in merge sort.
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Implement a complete singly linked list class SinglyLinkedList. It must use a dummy head node to uniformly manage all insertions and deletions, and expose reversal as an independent method using the three-pointer technique. The list must support: append (add at the tail), find (search by value), delete (first occurrence by value), display (print as a list), and reverse (in place).
checklist:
- Define a ListNode class with only val and next fields
- SinglyLinkedList's constructor creates a dummy node so that head-related boundary cases are unified
- append walks from dummy to the end and hangs the new node there (do not treat dummy as a data node when printing)
- find traverses and returns the index of the first occurrence, or -1 if not found
- delete uses prev to track the predecessor and does prev.next = prev.next.next; this must work for the head too
- reverse uses the prev/cur/next three-pointer technique in place, then makes dummy.next point at the new head
- display traverses starting at dummy.next and returns a list; an empty list returns []
- Test with an example interaction: append 1,2,3,4,5 and display; delete 3 and display; reverse and display; delete 1 (the head) and display
starter: |
  class ListNode:
      def __init__(self, val=0, next=None):
          self.val = val
          self.next = next


  class SinglyLinkedList:
      def __init__(self):
          self.dummy = ListNode(0)  # dummy head node

      def append(self, val):
          # walk from dummy to the end and hang the new node
          pass

      def find(self, val):
          # return the index of the first occurrence, or -1 if not found
          return -1

      def delete(self, val):
          # delete the first occurrence, return whether deletion succeeded
          return False

      def reverse(self):
          # reverse in place with prev/cur/next, then point dummy.next at the new head
          pass

      def display(self):
          # traverse starting at dummy.next and return a list
          return []


  if __name__ == "__main__":
      ll = SinglyLinkedList()
      for x in [1, 2, 3, 4, 5]:
          ll.append(x)
      print(ll.display())
      ll.delete(3)
      print(ll.display())
      ll.reverse()
      print(ll.display())
      ll.delete(1)
      print(ll.display())
```
