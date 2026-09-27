# 第 4 章测验：队列

> 覆盖队列与 deque、循环队列、BFS、单调队列、最短路径五大主题。共 8 题：5 选择 + 2 编程 + 1 项目。

## 选择题

```quiz
type: choice
exam: true
q: 用 Python list 实现一个有 n 次入队和 n 次出队的操作序列，总的时间复杂度是多少？
options:
- O(n)，因为每次操作都是 O(1)
- O(n log n)，因为需要排序
- O(n²)，因为 list.pop(0) 每次需要搬移剩余元素
- O(2ⁿ)，因为队列有指数级的组合
answer: 2
explain: list 是连续数组，pop(0) 需要把后面所有元素前移一位，单次 O(n)。n 次出队就是 O(n²)。用 deque.popleft() 才是 O(n)。
```

```quiz
type: choice
exam: true
q: 循环队列中，如何区分"队列空"和"队列满"这两种状态？
options:
- 用一个额外的 size 变量记录元素个数
- 多留一个空位：空是 front==rear，满是 (rear+1)%capacity==front
- 用 None 填充所有空位，通过统计 None 判断
- 不可能区分，这是循环队列的固有限制
answer: 1
explain: 循环队列牺牲一个存储单元（capacity = 用户容量 + 1），这样空和满的条件不同：空是 front==rear，满是 (rear+1)%capacity==front，可以在 O(1) 内区分。
```

```quiz
type: choice
exam: true
q: BFS 遍历图时，visited 集合应该在什么时候标记？
options:
- 出队时标记
- 入队前标记（检查→标记→入队）
- 处理完所有邻居后标记
- 不需要 visited，BFS 不会重复访问
answer: 1
explain: 入队前标记可以防止同一个节点被多条路径同时发现而多次入队。如果在出队时才标记，同一节点可能已在队列中出现多次，浪费空间和时间。
```

```quiz
type: choice
exam: true
q: 单调队列求滑动窗口最大值时，队列中元素的单调性是什么？
options:
- 从队首到队尾递增
- 从队首到队尾递减
- 无序，只是大小恰好等于 k
- 交替增减
answer: 1
explain: 找最大值时，队列从队首到队尾单调递减。新元素入队前，会踢掉所有 <= 它的队尾元素，保证队列递减。队首始终是当前窗口的最大值。
```

```quiz
type: choice
exam: true
q: 对于无权图的最短路径问题，为什么 BFS 比 DFS 更合适？
options:
- 因为 DFS 不能用于图
- 因为 BFS 按层扩展，第一次到达某节点时的步数就是最短步数；DFS 可能绕远路
- 因为 BFS 的时间复杂度更低
- 因为 DFS 会修改图的结构
answer: 1
explain: BFS 按层（按步数）扩展，第一次访问某节点时经过的步数一定是最少的。DFS 是一条路走到黑，可能走了很多步才到，不一定是最短路径。
```

---

## 编程题

```quiz
type: function
exam: true
q: 实现函数 is_palindrome_queue(s)：用两个 deque 判断字符串 s 是否是回文串。从 s 中取出所有字母（忽略大小写和非字母字符），放入一个 deque，然后用双指针（popleft 从左边取，pop 从右边取）判断是否对称。例如 "A man, a plan, a canal: Panama" → True。
func: is_palindrome_queue
starter: |
  from collections import deque
  def is_palindrome_queue(s):
      # 用 deque 双端操作判断回文
      return False
cases: |
  "A man, a plan, a canal: Panama" -> True
  "race a car" -> False
  "abba" -> True
  "a" -> True
  "" -> True
hint: 先过滤：letters = deque(c.lower() for c in s if c.isalpha())。然后 while len(letters) > 1: if letters.popleft() != letters.pop(): return False。return True。
explain: 过滤出字母并转小写放入 deque。然后用 popleft 从左边取、pop 从右边取，逐对比较。只要有一对不相等就不是回文。空串或单字符都是回文。
```

```quiz
type: function
exam: true
q: 实现函数 oranges_rotting(grid)：这是一个经典的 BFS 多源最短路径问题。grid 是二维列表：0=空，1=新鲜 orange，2=rotten orange。每分钟腐烂 orange 会使其上下左右的新鲜 orange 腐烂。返回所有 orange 都腐烂所需的最小分钟数；如果有 fresh orange 永远不会被腐烂，返回 -1。
func: oranges_rotting
starter: |
  from collections import deque
  def oranges_rotting(grid):
      # 返回所有 orange 腐烂的最小分钟数，不可能则返回 -1
      return 0
cases: |
  [[2,1,1],[1,1,0],[0,1,1]] -> 4
  [[2,1,1],[0,1,1],[1,0,1]] -> -1
  [[0,2]] -> 0
  [[1]] -> -1
hint: q=deque(); fresh=0; for i in range(n): for j in range(m): if grid[i][j]==2: q.append((i,j,0)); elif grid[i][j]==1: fresh+=1; if fresh==0: return 0; dirs=[(0,1),(0,-1),(1,0),(-1,0)]; while q: x,y,t=q.popleft(); for dx,dy in dirs: nx,ny=x+dx,y+dy; if 0<=nx<n and 0<=ny<m and grid[nx][ny]==1: grid[nx][ny]=2; fresh-=1; q.append((nx,ny,t+1)); if fresh==0: return t+1; return -1 if fresh>0 else 0
explain: 多源 BFS：把所有初始腐烂的橘子同时入队（时间=0）。每分钟向四周传播。当 fresh 减到 0 时返回当前时间。如果遍历结束 fresh 仍>0，说明有橘子永远不会腐烂，返回 -1。没有新鲜橘子直接返回 0。
```

---

## 项目题

```quiz
type: function
exam: true
q: 实现一个完整的「循环队列」类 CircularQueue，支持以下操作：__init__(k) 初始化容量为 k 的循环队列；enqueue(x) 入队，成功返回 True，队列已满返回 False；dequeue() 出队，成功返回 True，队列已空返回 False；Front() 返回队首元素，队列为空返回 -1；Rear() 返回队尾元素（最后入队的元素），队列为空返回 -1；isEmpty() 返回布尔值；isFull() 返回布尔值。要求用固定数组实现，front/rear 指针 + 取模运算。
func: CircularQueue
starter: |
  class CircularQueue:
      def __init__(self, k):
          # 初始化循环队列，实际数组大小为 k+1
          pass

      def enqueue(self, value):
          # 入队，成功返回 True，满则返回 False
          return False

      def dequeue(self):
          # 出队，成功返回 True，空则返回 False
          return False

      def Front(self):
          # 返回队首元素，空则返回 -1
          return -1

      def Rear(self):
          # 返回队尾元素（最后入队的元素），空则返回 -1
          return -1

      def isEmpty(self):
          return True

      def isFull(self):
          return False
cases: |
  __init__(3); enqueue(1); enqueue(2); enqueue(3); enqueue(4); Front(); Rear(); dequeue(); Rear(); isFull(); dequeue(); dequeue(); dequeue(); isEmpty(); enqueue(4); Front(); -> 3, True, 3, False, True, 4
hint: capacity=k+1; data=[0]*capacity; front=rear=0; enqueue时if isFull:return False; data[rear]=value; rear=(rear+1)%capacity; return True; dequeue时if isEmpty:return False; front=(front+1)%capacity;return True; Front时if isEmpty:return -1 else:return data[front]; Rear时if isEmpty:return -1 else:return data[(rear-1)%capacity]; isEmpty:front==rear; isFull:(rear+1)%capacity==front
explain: 循环队列的关键：① capacity = k+1 多留一个空位；② 判空 front==rear，判满 (rear+1)%capacity==front；③ Rear() 返回 data[(rear-1)%capacity]，因为 rear 指向下一个空位；④ 所有指针移动都用取模运算实现回绕。
```
