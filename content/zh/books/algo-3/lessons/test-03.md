# 第 3 章 · 图论 · 大测验

> 8 道题。这一章解决的是"怎么表示图、怎么遍历图、怎么判断依赖关系、怎么找最短路径"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

---

```quiz
type: choice
exam: true
q: 关于邻接矩阵和邻接表的对比，下列说法正确的是？
options:
- 邻接矩阵空间复杂度 O(n)，适合稀疏图
- 邻接矩阵适合稠密图，判断两顶点是否相邻 O(1)；邻接表适合稀疏图，空间 O(n + m)
- 邻接表判断任意两点是否相邻是 O(1)，比邻接矩阵快
- 邻接矩阵无法表示带权图，只能表示无权图
answer: 1
explain: 邻接矩阵是 n×n 的二维数组，空间 O(n²)，判断边存在只需 O(1) 查表，适合边很多的稠密图；邻接表用列表存每个顶点的邻居，空间 O(n + m)，适合边少的稀疏图。邻接矩阵完全可以存权值（把 1/0 换成权重，无边用 ∞ 表示）。
```

```quiz
type: choice
exam: true
q: 用 DFS 和 BFS 遍历图时，以下关于它们的特性正确的是？
options:
- DFS 用队列、BFS 用栈，这是它们的唯一区别
- DFS 用栈（递归或显式栈），沿一条路走到头再回溯；BFS 用队列，按距离由近到远逐层扩展
- DFS 一定能找到最短路径，BFS 不能
- BFS 需要记录 visited 集合，DFS 不需要
answer: 1
explain: DFS 沿一条分支深入到底再回溯，通常用递归（调用栈）或显式栈实现；BFS 用队列保证先访问距离近的顶点，因此首次到达某个顶点时的距离就是最短距离。两者都需要 visited 集合来避免重复访问和环导致的死循环。
```

```quiz
type: choice
exam: true
q: 拓扑排序（Kahn 算法）的核心步骤是？
options:
- 每次从图中任选一个顶点删除
- 统计每个顶点的入度，反复把入度为 0 的顶点加入结果并删除它的出边，直到所有顶点处理完或找不到入度为 0 的顶点
- 对图做 DFS，按访问顺序输出顶点
- 用并查集把所有连通的顶点合并成一组，再输出
answer: 1
explain: Kahn 算法：先算所有点的入度，把入度为 0 的顶点入队作为起点；每次弹出队首加入结果，删掉它的所有出边（即邻居入度减 1），若有邻居入度变 0 则入队。若最终结果不足 n 个顶点，说明图中有环，不存在合法拓扑序。
```

```quiz
type: choice
exam: true
q: 关于并查集（Union-Find），下列说法正确的是？
options:
- 并查集只能判断两点是否连通，不能合并集合
- 并查集支持高效的合并（union）和查找（find）操作，配合路径压缩和按秩/大小合并，单次操作接近 O(1) 均摊
- 并查集用 BFS 遍历所有边才能判断连通性，时间 O(m)
- 并查集无法检测图中是否存在环
answer: 1
explain: 并查集维护若干不相交集合，find 查根、union 合并，路径压缩让树更平、按秩或大小合并减少深度，二者结合后单次操作均摊时间接近 O(1)。它正是 Kruskal 最小生成树和"动态连通性/环检测"的标准工具。
```

```quiz
type: choice
exam: true
q: Dijkstra 算法求单源最短路径，关于它的思路正确的是？
options:
- 从起点出发，每次从未确定最短距离的顶点中随机选一个松弛
- 每次从"尚未确定最终距离"的顶点中选出距离最小的，用它对邻居做松弛，加入已确定集合，重复直到所有顶点确定
- 从起点做 DFS，记录每条路径的长度取最小
- 先把所有边按权重排序，再从小到大逐个加入，直到图连通
answer: 1
explain: Dijkstra 用贪心策略：维护每个顶点当前已知的最短距离，每轮选距离最小且未确定的顶点 u，标记它已确定，然后遍历 u 的所有出边做松弛（若 dist[u]+w < dist[v] 则更新）。可用最小堆优化到 O(m log n)。要求所有边权非负。
```

## 第二部分 · 动手题

---

```quiz
type: function
exam: true
func: can_finish
q: 实现 can_finish(num_courses, prerequisites)，判断能否完成全部 num_courses 门课程。prerequisites 是若干先修关系对，如 [[1,0]] 表示要学课程 1 必须先学课程 0。本质上是判断有向图是否存在环。图用邻接表表示：一个列表，下标 i 对应课程 i，值为该课程的后续依赖列表。
starter: |
  def can_finish(num_courses, prerequisites):
      # num_courses: int，课程数 0..num_courses-1
      # prerequisites: List[List[int]]，每一对 [a, b] 表示 b 是 a 的先修
      # 返回 True 表示可以完成（无环），False 表示存在环
      # 在这里改
      return True
cases: |
  can_finish(2, [[1,0]]) -> True
  can_finish(2, [[1,0],[0,1]]) -> False
  can_finish(3, [[1,0],[2,1]]) -> True
  can_finish(4, [[1,0],[2,1],[3,2],[1,3]]) -> False
hint: 用邻接表建图，对每个顶点做 DFS，用一个"当前递归栈"集合记录在栈上的节点；若遇到已在栈上的邻居说明有环。也可用入度表 + 队列的 Kahn 拓扑排序思路。
explain: 这是拓扑排序/环检测的经典应用。DFS 三色标记法：未访问=白、在栈中=灰、已结束=黑；遇到灰色节点即发现回边（环）。Kahn 算法则是不断删入度为 0 的点，最终输出数不足 n 即有环。有环则无法安排课程顺序。
```

```quiz
type: function
exam: true
func: shortest_path
q: 实现 shortest_path(n, edges, src, dst)，在无权无向图中求从 src 到 dst 的最短路径长度（经过的边数）。若不可达返回 -1。n 是顶点数（编号 0..n-1），edges 是边列表 [[u,v], ...]。用 BFS 实现。
starter: |
  from collections import deque

  def shortest_path(n, edges, src, dst):
      # n: 顶点数；edges: 无向边列表；src: 起点；dst: 终点
      # 返回最短边数，不可达返回 -1
      # 在这里改
      return -1
cases: |
  shortest_path(6, [[0,1],[0,2],[1,3],[2,3],[3,4],[4,5]], 0, 5) -> 3
  shortest_path(3, [[0,1],[1,2]], 0, 2) -> 2
  shortest_path(3, [[0,1]], 0, 2) -> -1
  shortest_path(1, [], 0, 0) -> 0
hint: 先建邻接表，用 deque 做 BFS，维护距离数组 dist 初始为 -1（表示未访问），起点距离置 0 并入队，每弹出一层就把邻居距离设为 dist[u]+1。
explain: 无权图的最短路径用 BFS：队列保证先访问距离近的顶点，首次到达 dst 时的距离即为最短距离，可直接返回。用 dist 数组兼做 visited 标记，避免重复入队。起点等于终点时距离为 0。
```

## 第三部分 · 小项目

---

```quiz
type: project
exam: true
q: 实现一个并查集类 UnionFind，并基于它完成"岛屿数量"的扩展任务：给定一个二维网格（'1' 表示陆地、'0' 表示水），统计其中岛屿的数量。要求用并查集把相邻的陆地（上下左右）逐步合并，最终统计集合根的数量；同时提供基本的 union/find 接口和连通分量个数查询。
checklist:
- UnionFind 类有 parent 和 rank（或 size）两个数组，__init__ 时每个元素自成一个集合
- find(x) 实现路径压缩（递归或迭代），返回根
- union(x, y) 实现按秩/大小合并，返回布尔值表示是否发生了合并
- connected(x, y) 返回两者是否同属一个集合
- count() 返回当前连通分量总数
- num_islands(grid) 遍历网格，对每个 '1' 与它上方/左方的 '1' 做 union，最后统计根的个数
- 主程序用一个示例网格演示结果，并验证与逐格 DFS/BFS 的直观结果一致
starter: |
  class UnionFind:
      def __init__(self, n):
          self.parent = list(range(n))
          self.rank = [0] * n
          self._count = n

      def find(self, x):
          # 带路径压缩，返回 x 所在集合的根
          # 在这里改
          return x

      def union(self, x, y):
          # 按秩合并，返回是否发生了合并
          # 在这里改
          return False

      def connected(self, x, y):
          # 返回 x 和 y 是否连通
          # 在这里改
          return False

      def count(self):
          # 返回当前连通分量数
          # 在这里改
          return self._count


  def num_islands(grid):
      # grid: List[List[str]]，'1' 为陆地，'0' 为水
      # 返回岛屿数量
      # 在这里改
      return 0


  # 测试示例（可修改、可删除）
  if __name__ == "__main__":
      grid = [
          ["1", "1", "0", "0", "0"],
          ["1", "1", "0", "1", "0"],
          ["0", "0", "1", "1", "1"],
          ["0", "0", "0", "0", "0"],
      ]
      print(num_islands(grid))   # 3

      uf = UnionFind(5)
      print(uf.connected(0, 1))  # False
      print(uf.union(0, 1))     # True
      print(uf.union(1, 2))     # True
      print(uf.connected(0, 2)) # True
      print(uf.count())         # 3
```
