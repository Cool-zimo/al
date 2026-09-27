# 第 2 章 · 链表进阶：判环与删除倒数第 N 个 · 大测验

> 8 道题。这一章解决的是"链表无法按下标回退时，如何用快慢指针一次遍历定位目标、如何判断是否有环、如何把链表组织成 LRU 缓存"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 用快慢指针判断链表是否有环时，为什么两个指针的相对速度是 1（慢指针走 1 步、快指针走 2 步）？
options:
- 快指针走 2 步只是为了把代码写得更短
- 慢指针走 1 步、快指针走 2 步时，若有环，快指针每轮相对慢指针多走 1 步，最终必然在环内追上；若快指针走 3 步则可能在奇数环长时互相"跨过"而不相遇
- 相对速度必须是偶数才能保证算法终止
- 快指针必须比慢指针快一倍才能覆盖整条链表
answer: 1
explain: 在环内，设环长为 C，快指针相对慢指针每轮多走 1 步，二者距离每轮减 1，最多 C 轮必然相遇。若快指针走 3 步（相对 2 步），在环长为奇数且初始距离为奇数时，可能出现"擦肩而过"永远差一格的情况，需要额外处理。走 2 步是最稳妥的常用设定。
```

```quiz
type: choice
q: Floyd 判环代码中，比较指针为什么要用 `is` 而不是 `==`？
options:
- 因为链表节点没有实现 __eq__ 方法，用 == 会报错
- 因为 is 比较的是身份（是否为同一个对象），我们关心的是"两个指针指向同一个节点"；== 比较的是值，值相等的不同节点会被误判为相遇
- 因为 is 的速度比 == 更快
- 因为 == 只能用于数字，不能用于对象
answer: 1
explain: 判环要判定的是"两个引用是否指向内存中的同一个节点对象"。is 比较对象身份（id 是否相同），== 比较值是否相等。如果链表里恰好有两个值相同的节点，== 会误报相遇，is 则不会。这是身份判断与值判断的本质区别。
```

```quiz
type: choice
q: 删除倒数第 N 个节点时，为什么快指针要先走 N+1 步，而不是 N 步？
options:
- 因为 Python 的 range 从 0 开始计数，多走一步是习惯写法
- 多走那一步是为了让慢指针最后停在"被删节点的前驱"上，这样才能执行 prev.next = prev.next.next
- 快指针必须走完整个链表，N+1 是为了保证它不提前停下
- N+1 是为了跳过 dummy 节点本身
answer: 1
explain: 链表删除需要改前驱的 next。快指针先走 N 步会停在"被删节点"上，慢指针差一位停在它的前前驱；走 N+1 步快指针比被删节点再多走一步，慢指针恰好落在被删节点的前驱，删除时只需 slow.next = slow.next.next。
```

```quiz
type: choice
q: 删除倒数第 N 个节点时，为什么一定要加虚拟头节点 dummy？
options:
- 为了让链表看起来更整齐
- 因为不加 dummy 代码无法通过语法检查
- 因为删除的节点可能是头节点本身，加 dummy 后所有节点（含原头）都有前驱，删头只需 dummy.next = head.next，与其他情况走同一套逻辑，也避免了 fast 为 None 时访问 None.next 的崩溃
- 因为 dummy 能加快程序运行速度
answer: 2
explain: 当 n 等于链表长度时要删的正好是头节点，没有 dummy 时 slow 停在 head，执行 slow.next=slow.next.next 改的是第二个节点，头根本没动。加上 dummy 后头节点也拥有了前驱，统一了逻辑，同时在快指针走出链表时避免了 None.next 的 AttributeError。
```

```quiz
type: choice
q: 实现一个 LRU 缓存时，为什么要把哈希表和双向链表结合起来？
options:
- 因为哈希表查询是 O(1)，双向链表能在 O(1) 内把任意节点移到头部或删除，二者互补，使 get 和 put 都达到 O(1)
- 因为双向链表可以自动扩容
- 因为哈希表只能存整数，需要双向链表存其他类型
- 因为这样能减少哈希冲突
answer: 0
explain: LRU 需要两个操作都在 O(1)：按 key 查找（哈希表 O(1)）和在"最近使用顺序"中把节点移到头部、把最久未用的尾部节点删除（双向链表 O(1)，每个节点都持有一个 prev 和 next，无须遍历）。单独用哈希表无法维护顺序，单独用链表无法 O(1) 定位，二者结合才完整。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 判断一个链表是否有环，有则返回 True，否则返回 False。输入用 Python 列表表示（如 [3,2,0,-4]），并额外给出环的入口位置 pos（0 表示头节点，若有环则尾节点指向该位置，-1 表示无环）。使用快慢指针（慢 1 步、快 2 步），相遇时判定有环；全程只用 is 比较指针身份。
func: has_cycle
starter: |
  class ListNode:
      def __init__(self, val=0, next=None):
          self.val = val
          self.next = next

  def build(vals, pos):
      # pos: 环入口下标，-1 表示无环
      if not vals:
          return None
      nodes = [ListNode(v) for v in vals]
      for i in range(len(nodes) - 1):
          nodes[i].next = nodes[i + 1]
      if pos >= 0:
          nodes[-1].next = nodes[pos]
      return nodes[0]

  def has_cycle(head, pos):
      # head: ListNode，用快慢指针判环
      return False

  print(has_cycle(build([3, 2, 0, -4], 1), 1))
cases: |
  [3,2,0,-4], 1 -> True
  [1,2], 0 -> True
  [1], -1 -> False
  [1,2,3,4], -1 -> False
hint: slow=fast=head。while fast and fast.next: slow=slow.next; fast=fast.next.next; if slow is fast: return True。循环结束仍未相遇则无环，返回 False。注意用 is 而非 ==。
explain: 快指针速度是慢指针的两倍，若无环，fast 或 fast.next 会率先变为 None，循环退出返回 False。若有环，快指针进入环后相对慢指针每轮多走 1 步，距离不断缩小，最终必然相遇，相遇即 return True。用 is 判断身份，避免值相同的节点造成误判。
```

```quiz
type: function
q: 删除链表倒数第 N 个节点，返回新链表的头节点（以列表表示）。输入为链表节点值列表和整数 n，如 [1,2,3,4,5] 和 2，输出为 [1,2,3,5]。要求使用快慢指针（快指针先走 N+1 步）和虚拟头节点 dummy，一次遍历完成。
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
      # head: ListNode，n 从 1 开始计数
      # 用 dummy + 快慢指针，快指针先走 n+1 步
      return None

  print(to_list(remove_nth_from_end(build([1, 2, 3, 4, 5]), 2)))
cases: |
  [1,2,3,4,5], 2 -> [1,2,3,5]
  [1], 1 -> []
  [1,2], 2 -> [2]
  [1,2,3], 3 -> [2,3]
hint: dummy=ListNode(0, head); fast=slow=dummy。先 for _ in range(n+1): fast=fast.next。再 while fast: fast=fast.next; slow=slow.next。最后 slow.next=slow.next.next，返回 dummy.next。
explain: 快指针先走 n+1 步是关键，这样当快指针走到 None 时，慢指针恰好停在被删节点的前驱，从而 slow.next=slow.next.next 完成删除。dummy 保证删头节点时（如 [1,2], n=2）也有前驱可操作，且统一了所有边界情况。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 实现一个 LRUCache 类：初始化时给定容量 capacity；get(key) 若 key 存在则返回对应 value 并把该节点移到"最近使用"的头部，否则返回 -1；put(key, value) 若 key 已存在则更新其值并移到头部，否则插入新节点，若超过容量则删除最久未使用的尾部节点。要求 get 和 put 均为 O(1)，内部用哈希表 + 双向链表（带头尾哨兵，避免空指针判断）。
checklist:
- 定义双向链表节点类 DListNode，字段有 key、val、prev、next
- 维护 head、tail 两个哨兵节点，head.next 是最新使用的节点，tail.prev 是最久未使用的节点
- 实现 _add(node) 把节点插入 head 之后，_remove(node) 把任意节点从链中断开，两个操作都只改指针、O(1)
- 实现 _move_to_head(node)：先 _remove(node) 再 _add(node)
- get(key)：哈希命中则 _move_to_head 并返回 value，未命中返回 -1
- put(key, value)：已存在则更新值并 _move_to_head；不存在则新建节点、_add、存入哈希，若超容量则删除 tail.prev 并把哈希中对应 key 一并移除
- 用示例交互验证：capacity=2，依次 put(1,1)、put(2,2)、get(1) 返回 1、put(3,3) 后 get(2) 返回 -1
- 测试边界：capacity=1 时的覆盖与删除逻辑正确
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
          self.head = DListNode()  # 最近使用的哨兵（头）
          self.tail = DListNode()  # 最久未使用的哨兵（尾）
          self.head.next = self.tail
          self.tail.prev = self.head

      def _add(self, node):
          # 把 node 插入到 head 之后（最新位置）
          pass

      def _remove(self, node):
          # 把 node 从双向链表中移除
          pass

      def _move_to_head(self, node):
          # 先移除再插入到 head 之后
          pass

      def get(self, key):
          return -1

      def put(self, key, value):
          pass


  if __name__ == "__main__":
      lru = LRUCache(2)
      lru.put(1, 1)
      lru.put(2, 2)
      print(lru.get(1))   # 期望 1
      lru.put(3, 3)
      print(lru.get(2))   # 期望 -1
```
