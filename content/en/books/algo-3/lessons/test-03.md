# Chapter 3 · Graph Theory · Comprehensive Quiz

> 8 questions. This chapter answers: "How do we represent graphs, traverse them, determine dependencies, and find shortest paths?"
> **You must answer all correctly to pass this chapter.**

## Part 1 · Multiple Choice

---

```quiz
type: choice
exam: true
q: Which statement about adjacency matrices and adjacency lists is correct?
options:
- An adjacency matrix uses O(n) space and is ideal for sparse graphs
- An adjacency matrix is best for dense graphs with O(1) edge lookup; an adjacency list is best for sparse graphs with O(n + m) space
- An adjacency list checks whether any two nodes are adjacent in O(1), faster than an adjacency matrix
- An adjacency matrix cannot represent weighted graphs, only unweighted ones
answer: 1
explain: An adjacency matrix is an n×n 2D array using O(n²) space; checking for an edge takes O(1) by table lookup, ideal for dense graphs with many edges. An adjacency list stores each vertex's neighbors in a list, using O(n + m) space, ideal for sparse graphs with few edges. An adjacency matrix can absolutely store weights (replace 1/0 with the weight, and use ∞ for no edge).
```

```quiz
type: choice
exam: true
q: When traversing a graph with DFS and BFS, which statement about their characteristics is correct?
options:
- DFS uses a queue and BFS uses a stack — that is their only difference
- DFS uses a stack (recursion or explicit stack), going deep down one path before backtracking; BFS uses a queue, expanding level by level from near to far
- DFS always finds the shortest path, BFS does not
- BFS needs a visited set but DFS does not
answer: 1
explain: DFS follows one branch all the way down before backtracking, typically implemented with recursion (the call stack) or an explicit stack. BFS uses a queue to guarantee visiting nearer vertices first, so the first time it reaches a vertex, that distance is the shortest. Both need a visited set to avoid revisiting and to prevent infinite loops caused by cycles.
```

```quiz
type: choice
exam: true
q: What are the core steps of Kahn's algorithm for topological sort?
options:
- Pick any vertex from the graph and remove it
- Compute each vertex's in-degree, repeatedly add in-degree-0 vertices to the result and remove their outgoing edges, until all vertices are processed or no in-degree-0 vertex remains
- Run DFS on the graph and output vertices in visitation order
- Merge all connected vertices into groups using a disjoint set, then output
answer: 1
explain: Kahn's algorithm: compute all in-degrees first, enqueue in-degree-0 vertices as starting points; each time a vertex is popped into the result, remove all its outgoing edges (decrement neighbors' in-degrees), and enqueue any neighbor whose in-degree becomes 0. If the final result has fewer than n vertices, the graph contains a cycle and no valid topological order exists.
```

```quiz
type: choice
exam: true
q: Which statement about Disjoint Set Union (Union-Find) is correct?
options:
- Union-Find can only test whether two nodes are connected; it cannot merge sets
- Union-Find supports efficient merge (union) and find operations; combined with path compression and union by rank/size, each operation is nearly O(1) amortized
- Union-Find requires a full BFS over all edges to test connectivity, taking O(m)
- Union-Find cannot detect whether a graph contains a cycle
answer: 1
explain: Union-Find maintains several disjoint sets. find returns the root and union merges sets; path compression flattens the tree and union by rank/size limits its depth, so combined each operation is amortized nearly O(1). It is the standard tool for Kruskal's MST and dynamic connectivity / cycle detection.
```

```quiz
type: choice
exam: true
q: For Dijkstra's algorithm for single-source shortest paths, which description of its approach is correct?
options:
- From the start, pick an unconfirmed vertex at random and relax it
- Each round, pick the unconfirmed vertex with the smallest distance, use it to relax its neighbors, add it to the confirmed set, and repeat until all vertices are confirmed
- Run DFS from the start, record every path length, and take the minimum
- Sort all edges by weight first, then add them one by one from smallest to largest until the graph is connected
answer: 1
explain: Dijkstra uses a greedy strategy: maintain each vertex's currently known shortest distance, pick the smallest-distance unconfirmed vertex u each round and mark it confirmed, then relax all of u's outgoing edges (if dist[u]+w < dist[v], update). A min-heap brings this to O(m log n). All edge weights must be non-negative.
```

## Part 2 · Coding Problems

---

```quiz
type: function
exam: true
func: can_finish
q: Implement can_finish(num_courses, prerequisites) to determine whether all num_courses courses can be completed. prerequisites is a list of prerequisite pairs, e.g. [[1,0]] means course 1 requires course 0 first. Essentially this is detecting whether a directed graph has a cycle. Represent the graph as an adjacency list: a list where index i corresponds to course i, and the value is a list of courses that depend on it.
starter: |
  def can_finish(num_courses, prerequisites):
      # num_courses: int, courses 0..num_courses-1
      # prerequisites: List[List[int]], each pair [a, b] means b is a prerequisite for a
      # Return True if all courses can be finished (no cycle), False otherwise
      # Modify below
      return True
cases: |
  can_finish(2, [[1,0]]) -> True
  can_finish(2, [[1,0],[0,1]]) -> False
  can_finish(3, [[1,0],[2,1]]) -> True
  can_finish(4, [[1,0],[2,1],[3,2],[1,3]]) -> False
hint: Build the adjacency list, then run DFS on each vertex using a "current recursion stack" set to track nodes on the stack. If you encounter a neighbor already on the stack, a cycle exists. Kahn's in-degree + queue topological approach also works.
explain: This is the classic topological sort / cycle detection application. DFS with 3-color marking: white = unvisited, gray = on stack, black = finished. A gray node means a back edge (cycle). Kahn's algorithm repeatedly removes in-degree-0 nodes; fewer than n outputs means a cycle. A cycle makes scheduling impossible.
```

```quiz
type: function
exam: true
func: shortest_path
q: Implement shortest_path(n, edges, src, dst) to find the length of the shortest path (number of edges) from src to dst in an unweighted undirected graph. Return -1 if unreachable. n is the number of vertices (0..n-1), edges is a list of undirected edges [[u,v], ...]. Use BFS.
starter: |
  from collections import deque

  def shortest_path(n, edges, src, dst):
      # n: number of vertices; edges: undirected edge list; src: start; dst: destination
      # Return the minimum number of edges, or -1 if unreachable
      # Modify below
      return -1
cases: |
  shortest_path(6, [[0,1],[0,2],[1,3],[2,3],[3,4],[4,5]], 0, 5) -> 3
  shortest_path(3, [[0,1],[1,2]], 0, 2) -> 2
  shortest_path(3, [[0,1]], 0, 2) -> -1
  shortest_path(1, [], 0, 0) -> 0
hint: Build the adjacency list first, use deque for BFS, maintain a distance array dist initialized to -1 (meaning unvisited), set the start distance to 0 and enqueue it; each time you pop a level, set unvisited neighbors' distances to dist[u]+1.
explain: BFS finds shortest paths in unweighted graphs: the queue guarantees nearer vertices are visited first, so the first time dst is reached, that distance is the shortest and can be returned immediately. Use the dist array as the visited marker to avoid re-enqueueing. When start equals destination, the distance is 0.
```

## Part 3 · Mini Project

---

```quiz
type: project
exam: true
q: Implement a UnionFind class and, building on it, solve the "Number of Islands" extension task: given a 2D grid ('1' for land, '0' for water), count the number of islands. Use Union-Find to iteratively merge adjacent land cells (up/down/left/right), then count the number of set roots. Also provide basic union/find interfaces and a connected component count query.
checklist:
- UnionFind has parent and rank (or size) arrays; in __init__ each element starts in its own set
- find(x) implements path compression (recursive or iterative) and returns the root
- union(x, y) implements union by rank/size and returns a boolean indicating whether a merge occurred
- connected(x, y) returns whether x and y belong to the same set
- count() returns the current number of connected components
- num_islands(grid) iterates the grid, unions each '1' with the '1' above it and to its left, then counts roots
- The main program demonstrates the result with a sample grid and verifies it matches an intuitive result from cell-by-cell DFS/BFS
starter: |
  class UnionFind:
      def __init__(self, n):
          self.parent = list(range(n))
          self.rank = [0] * n
          self._count = n

      def find(self, x):
          # Path compression, return the root of x's set
          # Modify below
          return x

      def union(self, x, y):
          # Union by rank, return whether a merge occurred
          # Modify below
          return False

      def connected(self, x, y):
          # Return whether x and y are connected
          # Modify below
          return False

      def count(self):
          # Return the current number of connected components
          # Modify below
          return self._count


  def num_islands(grid):
      # grid: List[List[str]], '1' = land, '0' = water
      # Return the number of islands
      # Modify below
      return 0


  # Sample test (may be modified or deleted)
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
