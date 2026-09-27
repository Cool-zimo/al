# Chapter 4 Quiz: Queues

> Covers five topics: queues and deques, circular queues, BFS, monotonic queues, and shortest paths. 8 questions total: 5 multiple choice + 2 coding + 1 project.

## Multiple Choice

```quiz
type: choice
exam: true
q: Using a Python list to implement a sequence of n enqueue operations and n dequeue operations, what is the total time complexity?
options:
- O(n), because every operation is O(1)
- O(n log n), because sorting is required
- O(n²), because list.pop(0) shifts every remaining element on each call
- O(2ⁿ), because queues have exponential combinations
answer: 2
explain: A list is a contiguous array; pop(0) shifts every element behind it left by one position, O(n) per call. n dequeues gives O(n²). deque.popleft() achieves O(n).
```

```quiz
type: choice
exam: true
q: In a circular queue, how do you distinguish between "queue empty" and "queue full"?
options:
- Use an extra size variable to track the number of elements
- Reserve one empty slot: empty is front==rear, full is (rear+1)%capacity==front
- Fill all empty slots with None and count the Nones
- It's impossible; this is an inherent limitation of circular queues
answer: 1
explain: A circular queue sacrifices one storage slot (capacity = requested capacity + 1), so empty and full have different conditions: empty is front==rear, full is (rear+1)%capacity==front, both checkable in O(1).
```

```quiz
type: choice
exam: true
q: When traversing a graph with BFS, when should the visited set be marked?
options:
- When the node is dequeued
- Before enqueueing (check -> mark -> enqueue)
- After all neighbors have been processed
- visited isn't needed; BFS never revisits nodes
answer: 1
explain: Marking before enqueue prevents the same node from being discovered by multiple paths and enqueued repeatedly. If you mark on dequeue, the same node may already appear in the queue multiple times, wasting space and time.
```

```quiz
type: choice
exam: true
q: When using a monotonic queue to find the sliding-window maximum, what is the monotonic property of the queue's elements?
options:
- Increasing from front to back
- Decreasing from front to back
- Unordered, just happens to have size k
- Alternating between increasing and decreasing
answer: 1
explain: When finding the maximum, the queue decreases monotonically from front to back. Before enqueueing a new element, every back element <= it gets kicked out, keeping the queue decreasing. The front is always the current window's maximum.
```

```quiz
type: choice
exam: true
q: For shortest paths in an unweighted graph, why is BFS more appropriate than DFS?
options:
- Because DFS can't be used on graphs
- Because BFS expands by level, so the first time a node is reached the step count is already minimal; DFS may take a longer route
- Because BFS has a lower time complexity
- Because DFS modifies the graph's structure
answer: 1
explain: BFS expands by level (by step count). The first time it reaches a node, the number of steps taken is guaranteed to be minimal. DFS goes deep down one branch and may take many steps, so it isn't necessarily the shortest path.
```

---

## Coding Questions

```quiz
type: function
exam: true
q: Implement is_palindrome_queue(s): use two deques to determine whether string s is a palindrome. Extract every letter from s (ignoring case and non-letter characters) into a deque, then use two pointers (popleft from the left, pop from the right) to test for symmetry. For example "A man, a plan, a canal: Panama" -> True.
func: is_palindrome_queue
starter: |
  from collections import deque
  def is_palindrome_queue(s):
      # use deque's double-ended operations to test for palindrome
      return False
cases: |
  "A man, a plan, a canal: Panama" -> True
  "race a car" -> False
  "abba" -> True
  "a" -> True
  "" -> True
hint: First filter: letters = deque(c.lower() for c in s if c.isalpha()). Then while len(letters) > 1: if letters.popleft() != letters.pop(): return False. Finally return True.
explain: Filter to letters, lowercased, into a deque. Use popleft from the left and pop from the right to compare pairs one by one. Any mismatch means it isn't a palindrome. An empty string or a single character is always a palindrome.
```

```quiz
type: function
exam: true
q: Implement oranges_rotting(grid): a classic BFS multi-source shortest-path problem. grid is a 2D list: 0=empty, 1=fresh orange, 2=rotten orange. Every minute, a rotten orange rots its fresh neighbors in the four cardinal directions. Return the minimum number of minutes until all oranges are rotten; if any fresh orange can never rot, return -1.
func: oranges_rotting
starter: |
  from collections import deque
  def oranges_rotting(grid):
      # return the minimum minutes until all oranges rot, or -1 if impossible
      return 0
cases: |
  [[2,1,1],[1,1,0],[0,1,1]] -> 4
  [[2,1,1],[0,1,1],[1,0,1]] -> -1
  [[0,2]] -> 0
  [[1]] -> -1
hint: q=deque(); fresh=0; for i in range(n): for j in range(m): if grid[i][j]==2: q.append((i,j,0)); elif grid[i][j]==1: fresh+=1; if fresh==0: return 0; dirs=[(0,1),(0,-1),(1,0),(-1,0)]; while q: x,y,t=q.popleft(); for dx,dy in dirs: nx,ny=x+dx,y+dy; if 0<=nx<n and 0<=ny<m and grid[nx][ny]==1: grid[nx][ny]=2; fresh-=1; q.append((nx,ny,t+1)); if fresh==0: return t+1; return -1 if fresh>0 else 0
explain: Multi-source BFS: enqueue every initially rotten orange (time=0) at once. Each minute, spread to the four neighbors. When fresh hits 0, return the current time. If the loop ends with fresh still > 0, some oranges can never rot, so return -1. If there are no fresh oranges, return 0.
```

---

## Project Question

```quiz
type: project
exam: true
q: Implement a complete CircularQueue class supporting: __init__(k) initializes a circular queue of capacity k; enqueue(x) adds x, returning True on success and False if the queue is full; dequeue() removes the front element, returning True on success and False if the queue is empty; Front() returns the front element, or -1 if empty; Rear() returns the rear element (the most recently enqueued), or -1 if empty; isEmpty() returns a boolean; isFull() returns a boolean. Use a fixed-size array with front/rear pointers and modulo arithmetic.
func: CircularQueue
starter: |
  class CircularQueue:
      def __init__(self, k):
          # initialize the circular queue; actual array size is k+1
          pass

      def enqueue(self, value):
          # enqueue, return True on success, False if full
          return False

      def dequeue(self):
          # dequeue, return True on success, False if empty
          return False

      def Front(self):
          # return the front element, or -1 if empty
          return -1

      def Rear(self):
          # return the rear element (most recently enqueued), or -1 if empty
          return -1

      def isEmpty(self):
          return True

      def isFull(self):
          return False
cases: |
  __init__(3); enqueue(1); enqueue(2); enqueue(3); enqueue(4); Front(); Rear(); dequeue(); Rear(); isFull(); dequeue(); dequeue(); dequeue(); isEmpty(); enqueue(4); Front(); -> 3, True, 3, False, True, 4
hint: capacity=k+1; data=[0]*capacity; front=rear=0; enqueue: if isFull: return False; data[rear]=value; rear=(rear+1)%capacity; return True; dequeue: if isEmpty: return False; front=(front+1)%capacity; return True; Front: if isEmpty: return -1 else: return data[front]; Rear: if isEmpty: return -1 else: return data[(rear-1)%capacity]; isEmpty: front==rear; isFull: (rear+1)%capacity==front
explain: The keys to a circular queue: 1) capacity = k+1, reserving one empty slot; 2) empty is front==rear, full is (rear+1)%capacity==front; 3) Rear() returns data[(rear-1)%capacity] because rear points to the next empty slot; 4) all pointer movement uses modulo to wrap around.
```
