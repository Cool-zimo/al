# Chapter 6 Quiz: Recursion

> Recursion is the art of "breaking a big problem into smaller ones." From the three elements to the execution process, from converting to iteration to divide-and-conquer and backtracking, this chapter completes the full recursion loop — and closes out *Algorithm Intensive 2*.

## Part 1: Multiple Choice (5 questions)

```quiz
type: choice
exam: true
q: Which of the following statements about the three elements of recursion is FALSE?
options:
- The recursive relation decides "how to break the big problem into a smaller one" and determines the recursion's shape (linear or tree-like).
- The base case makes recursion stop; omitting it causes RecursionError.
- The return value can be omitted; Python automatically passes the recursive call's result back to the layer above.
- The three elements are the base case, the recursive relation, and the return value.
answer: 2
explain: When return is omitted the function returns None by default, and the upper layer receives None and raises TypeError: unsupported operand type(s) for ...: '...' and 'NoneType', rather than "automatically passing the result back."
```

```quiz
type: choice
exam: true
q: What is the approximate time complexity of the naive recursive computation of fib(n) (F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2))?
options:
- O(2^n)
- O(n)
- O(log n)
- O(n log n)
answer: 0
explain: Each call spawns two calls, forming a recursion tree with roughly 2^n nodes (strictly about 1.618^n). The root cause of slowness is the same subproblem being recomputed over and over.
```

```quiz
type: choice
exam: true
q: Which of the following statements about the call stack is correct?
options:
- Each recursive call pushes a frame onto the call stack and pops it when returning; stack depth is the recursion depth.
- The call stack's space is infinite, so recursion never errors out from a stack overflow.
- Tail recursion is automatically optimized into a loop in Python, so it never overflows the stack.
- The call stack exists only in iteration; recursion does not use the call stack.
answer: 0
explain: Each recursion occupies one stack frame, and stack depth equals recursion depth. Python's default recursion limit is 1000 frames; Python does no tail-call optimization, so tail recursion can also overflow the stack.
```

```quiz
type: choice
exam: true
q: Merge sort has time complexity O(n log n). Where does this complexity come from?
options:
- The recursion tree has log n layers, and the total work of all merges on each layer is O(n), so O(n log n) in total.
- Each merge is O(n^2), the recursion depth is log n, so O(n^2 log n).
- Merge sort degenerates to O(n^2) in the worst case.
- The complexity comes from slice copying and is O(n).
answer: 0
explain: Splitting in half gives log n layers; each layer covers all n elements with merges, so each layer is O(n), for O(n log n) total. Merge sort's worst case is also O(n log n).
```

```quiz
type: choice
exam: true
q: In a backtracking algorithm, when adding the current path to the result set, what is the correct approach?
options:
- result.append(path[:]), copy first then store, to avoid later modifications contaminating the result.
- result.append(path), store the reference directly; it saves memory and is faster.
- result.append(path.copy()) raises an error because lists cannot be copied.
- Using a global variable to store the result needs no copying because global variables are never modified.
answer: 0
explain: path is modified by pop operations later in the recursion; if you append the reference directly, every item in the result set points to the same list and ends up as the same (often empty) list.
```

## Part 2: Programming (2 questions)

```quiz
type: function
exam: true
q: Implement is_palindrome(s) recursively to determine whether the string s is a palindrome (reads the same forward and backward). Use recursion (divide-and-conquer thinking): compare whether the first and last characters are equal, then recursively judge the substring with the first and last characters removed. Agree that the empty string and a single character are both palindromes. Process only lowercase letters; ignore case issues (the input is guaranteed lowercase). For example is_palindrome("aba") = True, is_palindrome("abca") = False.
func: is_palindrome
starter: |
  def is_palindrome(s):
      # recursively determine whether it is a palindrome
      # modify below
      return None
cases: |
  is_palindrome("aba") -> True
  is_palindrome("abba") -> True
  is_palindrome("abca") -> False
  is_palindrome("a") -> True
  is_palindrome("") -> True
hint: Base case: length <= 1 returns True. Recursive relation: the first and last characters are equal AND is_palindrome(s[1:-1]) is also True.
explain: The base case is len(s) <= 1 returning True. The recursive relation is s[0] == s[-1] AND is_palindrome(s[1:-1]). This is a linear recursion (one call per layer) with depth len(s)//2.
```

```quiz
type: function
exam: true
q: Implement permutations(nums) with backtracking to return all permutations of the input list (a list of lists), requiring **lexicographical order** in the output. For example permutations([1, 2, 3]) = [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]. Use a used array to mark used elements, and be sure to copy the path when adding it to the result set.
func: permutations
starter: |
  def permutations(nums):
      # backtracking to find all permutations
      # modify below
      return []
cases: |
  permutations([1, 2, 3]) -> [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
  permutations([1, 2]) -> [[1, 2], [2, 1]]
  permutations([1]) -> [[1]]
hint: The used array marks used indices; the for loop iterates over all unused elements, making the choice, recursing, and undoing the choice. In the result set, append(path[:]).
explain: Permutations use a used array to avoid choosing the same element twice. The for loop iterates over all indices; if unused, make the choice (used[i]=True, path.append(nums[i])), recurse, then undo (path.pop(), used[i]=False). When len(path)==len(nums), append(path[:]). To guarantee lexicographical order, simply iterate over the indices in their original order.
```

## Part 3: Project (1 question)

```quiz
type: project
exam: true
q: Implement an undoable expression evaluator, UndoCalculator. It maintains a current value (initially 0) and an operation history stack. Implement three methods, all using recursion-like thinking to process the history stack: add(x) adds x to the current value and pushes onto the stack; subtract(x) subtracts x from the current value and pushes onto the stack; undo() reverses the most recent operation (restoring the current value to its pre-operation state), and does nothing if there is no operation to undo. Implement it by "recording the type and value of each operation on the history stack" so that undo can restore correctly. Example: c = UndoCalculator(); c.add(5); c.add(3); c.subtract(2); the current value is now 6; after c.undo() the current value is 8 (the subtract 2 was undone); after c.undo() the current value is 5 (the add 3 was undone). Note: after each operation you can check the current value with get_value().
starter: |
  class UndoCalculator:
      def __init__(self):
          self.value = 0
          self.history = []   # each element is ('add', x) or ('subtract', x)
      
      def add(self, x):
          # modify below
          pass
      
      def subtract(self, x):
          # modify below
          pass
      
      def undo(self):
          # modify below
          pass
      
      def get_value(self):
          return self.value
cases: |
  c=UndoCalculator(); c.add(5); c.add(3); c.subtract(2); c.get_value() -> 6
  c=UndoCalculator(); c.add(10); c.get_value() -> 10
  c=UndoCalculator(); c.add(10); c.undo(); c.get_value() -> 0
  c=UndoCalculator(); c.add(5); c.subtract(3); c.undo(); c.undo(); c.get_value() -> 0
  c=UndoCalculator(); c.undo(); c.get_value() -> 0
hint: add(x): first self.history.append(('add', x), then self.value += x. subtract does the same but value -= x. undo: if history is not empty, pop the last operation; if it is add then value -= x, if it is subtract then value += x.
explain: The core idea is that the history stack stores "operations" rather than "values." add pushes ('add', x) and does value += x; subtract pushes ('subtract', x) and does value -= x. When undoing, pop the top: if it is add then value -= x (undo the addition), if it is subtract then value += x (undo the subtraction). This way you do not need to store full snapshots on the stack, and it naturally supports any number of undos.
```
