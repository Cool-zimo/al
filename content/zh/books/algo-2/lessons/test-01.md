# 第 1 章 · 链表基础 · 大测验

> 8 道题。这一章解决的是"数组插入删除要 O(n) 搬元素，链表如何靠改指针把插入删除降到 O(1)"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 在一个长度为 100000 的 Python 数组中，每次都在头部执行 insert(0, x)，插入 10000 次，大约要搬动多少次元素？
options:
- 约 10000 次
- 约 100000 次
- 约 10 亿次
- 约 0 次，因为头插是 O(1)
answer: 2
explain: 每次头插要把已有的全部元素后移一格。第 i 次插入前有 100000+i 个元素，搬动总量约为 10000×100000 + 10000×9999/2，量级在 10 亿次。这正是 list.insert(0, x) 的代价，也说明了"频繁头插"场景下数组不是正确选择。
```

```quiz
type: choice
q: 链表凭什么能在 O(1) 内完成中间插入？
options:
- 链表的元素在内存中连续存放
- 链表每个节点只记下一个节点的位置，插入时只需修改前驱和新节点的指针
- 链表有哈希索引可以定位任意位置
- 链表预先分配了足够大的连续空间
answer: 1
explain: 链表的节点可以散落在内存任意位置，节点本身保存 next 指针。插入时只需让前驱指向新节点、新节点指向前驱原来的后继，只改两处指针，与链表长度无关。代价是失去了连续内存带来的随机访问能力。
```

```quiz
type: choice
q: 下面的 ListNode 定义，next 字段的作用是什么？
options:
- 记录当前节点的值
- 记录节点在链表中的下标位置
- 指向下一个节点，构成链的连接关系
- 指向前一个节点
answer: 2
explain: class ListNode: def __init__(self, val=0, next=None): self.val=val; self.next=next。next 保存对下一个节点的引用，正是这些引用把离散的节点串成一条链。没有 next，节点之间彼此孤立，也就没有链表。
```

```quiz
type: choice
q: 遍历一条链表的正确写法，为什么循环条件是 while head 而不是 while head.next？
options:
- while head 会漏掉头节点
- while head.next 会停在最后一个节点上，处理最后一个节点时需要额外补代码
- while head 的时间复杂度更高
- while head.next 无法判断链表是否为空
answer: 1
explain: while head 让循环体在最后一个节点上也执行一次，然后 head 变成 None 自然退出，边界处理统一。while head.next 在 head 指向最后一个节点时条件为假，循环提前结束，最后一个节点不会被处理，往往要补一段收尾代码。
```

```quiz
type: choice
q: 删除链表中某个节点时，为什么必须先拿到它的前驱？
options:
- 因为要释放前驱节点的内存
- 因为要修改前驱节点的 next 指针，把它指向被删节点的后继，从而把被删节点从链中断开
- 因为要比较前驱节点的值
- 因为前驱节点存储了链表长度
answer: 1
explain: 链表只能从前往后访问，删除的本质是把"前驱→被删节点"这条边改成"前驱→被删节点的后继"。若只有被删节点的引用而没有前驱，就无法改写前驱的 next，节点也就删不掉。这也是删除倒数第 N 个节点要定位到"前驱"的根本原因。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 反转单链表。给定链表的头节点（用 Python 列表表示，如 [1,2,3,4,5]），返回反转后链表的头节点（以列表表示，如 [5,4,3,2,1]）。要求使用三指针 prev/cur/next 原地反转，空间复杂度 O(1)。
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
      # head: ListNode，用 prev/cur/next 三指针原地反转
      return None

  print(to_list(reverse_list(build([1, 2, 3, 4, 5]))))
cases: |
  [1,2,3,4,5] -> [5,4,3,2,1]
  [1] -> [1]
  [] -> []
  [1,2] -> [2,1]
hint: prev=None; cur=head。每次循环保存 nxt=cur.next，把 cur.next 指向 prev，再 prev=cur、cur=nxt。循环结束后 prev 就是新头。
explain: 三指针反转的核心在于"提前保存 next"，否则把 cur.next 指向 prev 之后就再也找不到原来的后继了。每一步完成一次箭头反向，n 个节点正好 n 次迭代。prev 初始为 None，正是新链表末尾那个 None 哨兵。
```

```quiz
type: function
q: 合并两个已按升序排序的链表，返回一个新的升序链表。输入是两个 Python 列表，如 l1=[1,2,4], l2=[1,3,4]，输出为列表 [1,1,2,3,4,4]。要求使用虚拟头节点 dummy，空间复杂度 O(1)（只改动指针，不新建节点）。
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
      # l1, l2 都是 ListNode，用 dummy + tail 指针归并
      return None

  print(to_list(merge_two_lists(build([1, 2, 4]), build([1, 3, 4]))))
cases: |
  [1,2,4], [1,3,4] -> [1,1,2,3,4,4]
  [], [0] -> [0]
  [], [] -> []
  [5], [1,2,3] -> [1,2,3,5]
hint: dummy=ListNode(0); tail=dummy。while l1 and l2 时比较 l1.val 与 l2.val，把较小的接到 tail.next，并前进对应的指针和 tail。最后把剩下那条链直接接到 tail.next。返回 dummy.next。
explain: dummy 让"往结果链上挂节点"的每一步逻辑完全一致，不再需要单独判断谁是第一个节点。循环结束后必有一条链还有剩余，直接 tail.next=那条链即可，因为剩余部分已经有序。这就是归并排序中 merge 步骤的链表版。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 实现一个完整的单向链表类 SinglyLinkedList，要求用虚拟头节点 dummy 统一管理所有插入删除，并用三指针反转作为独立方法。这个链表要支持：尾部追加 append、按值查找 find、按值删除（首次出现的节点）、打印成列表 display、原地反转 reverse。
checklist:
- 定义 ListNode 类，字段只有 val 和 next
- SinglyLinkedList 的构造里建一个 dummy 节点，让 head 操作的边界情况统一
- append 从 dummy 出发走到末尾再挂新节点（注意不要把 dummy 当成数据节点打印出来）
- find 遍历并返回目标值的下标，找不到返回 -1
- delete 用 prev 跟踪前驱，找到后执行 prev.next = prev.next.next，删头节点时同样成立
- reverse 用 prev/cur/next 三指针原地反转，反转后重新把 dummy.next 指向新头
- display 从 dummy.next 开始遍历输出列表，空表输出 []
- 用示例交互测试：追加 1,2,3,4,5，打印；删除 3，打印；反转，打印；删除 1（头节点），打印
starter: |
  class ListNode:
      def __init__(self, val=0, next=None):
          self.val = val
          self.next = next


  class SinglyLinkedList:
      def __init__(self):
          self.dummy = ListNode(0)  # 虚拟头节点

      def append(self, val):
          # 从 dummy 出发走到末尾，挂上新节点
          pass

      def find(self, val):
          # 返回首次出现的位置下标，找不到返回 -1
          return -1

      def delete(self, val):
          # 删除首次出现的节点，返回是否删除成功
          return False

      def reverse(self):
          # 三指针 prev/cur/next 原地反转，最后让 dummy.next 指向新头
          pass

      def display(self):
          # 从 dummy.next 开始遍历，返回列表形式
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
