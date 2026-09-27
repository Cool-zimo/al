# Chapter 3 Test · Stacks

> Five multiple-choice questions plus two hands-on questions plus one small project, covering basic stack operations, bracket matching, monotonic stacks, the recursion call stack, and expression evaluation. Suggested time limit: 40 minutes.

## Part 1 · Multiple Choice

```quiz
type: choice
exam: true
q: When implementing a stack with a Python list, which set of operations are all O(1)?
options:
- push with list.append(x), pop with list.pop(0)
- push with list.insert(0, x), pop with list.pop()
- push with list.append(x), pop with list.pop()
- push with list.append(x), peek with list.index(x)
answer: 2
explain: append writes at the tail and pop() with no argument pops from the tail; neither moves the other elements, so O(1). pop(0) moves n-1 elements, O(n); insert(0) is likewise O(n); index is a linear scan, O(n).
```

```quiz
type: choice
exam: true
q: When checking whether the bracket string `s = "()[]{}"` is valid, which of the following steps is redundant and does NOT cause a wrong answer?
options:
- checking whether the stack is empty when encountering a closing bracket
- checking whether the type matches after popping the top
- checking whether the stack is empty after the loop ends
- pushing the closing bracket onto the stack as well
answer: 3
explain: The first three are all necessary checks: empty stack prevents IndexError, type matching prevents misjudging ([)] as valid, and an empty stack at the end prevents leftover open brackets. "Pushing the closing bracket too" is wrong - a closing bracket only pops and compares; pushing it in would break the matching semantics.
```

```quiz
type: choice
exam: true
q: For a monotonic stack finding the "next greater element", indices are usually stored on the stack. What does popping the top mean at that moment?
options:
- the top element is smaller than the current element, so the current element is the first larger one to its right and the answer can be filled in
- the top element is larger than the current element, so the two should swap positions
- the current element should be discarded and not participate in later computation
- the stack is full, so a slot must be freed for the new element
answer: 0
explain: This is exactly the essence of a monotonic stack: nums[top] < x is what triggers the pop, and at that moment x is the first element to the right of nums[top] that is larger, so the answer is settled. It is not "freeing a slot", it is "settling".
```

```quiz
type: choice
exam: true
q: Which of the following statements about recursion and the call stack is correct?
options:
- Python has no call stack; recursion is automatically optimized by the interpreter
- when a recursive function has no termination condition, it triggers RecursionError because the frame count exceeded Python's recursion depth limit
- recursion is always slower than a loop, but it saves all memory overhead
- once the call stack is full Python expands it automatically and never raises an error
answer: 1
explain: Each function call pushes a frame; with no termination condition the frame count keeps growing and once it hits the default limit of 1000 Python raises RecursionError to protect memory. Recursion costs O(n) stack space, and Python does no tail-recursion optimization.
```

```quiz
type: choice
exam: true
q: When evaluating `3 + 5 * 2` with two stacks (operand stack + operator stack), why is the top `+` not evaluated immediately after `*` is read?
options:
- because addition and multiplication cannot be done together
- because `*` has higher precedence than the top `+`, so `*` must "go first" and `+` stays on the stack
- because the operator stack can only hold one element
- because the number stack is empty
answer: 1
explain: Before pushing a new operator, we only evaluate first if the top's precedence >= the new operator's. Here * has precedence 2 versus + at 1, so + stays and * is pushed, waiting for the next number to be pushed before multiplication runs.
```

## Part 2 · Hands-On Questions

```quiz
type: function
exam: true
q: Implement eval_postfix(tokens): evaluate a reverse Polish (postfix) expression. tokens is a list of strings, e.g. ["2","1","+","3","*"] means (2+1)*3=9. The operators are only + - * /, division truncates toward zero (use int(a/b)), and all operands are integers. One stack is enough.
func: eval_postfix
starter: |
  def eval_postfix(tokens):
      # evaluate a postfix (reverse Polish) expression, return the result
      return 0
cases: |
  ["2","1","+","3","*"] -> 9
  ["4","13","5","/","+"] -> 6
  ["10","6","9","3","+","-11","*","/","*","17","+","5","+"] -> 22
  ["42"] -> 42
hint: stack=[]; iterate t: if t is an operator, pop b=pop(), a=pop(), compute by t and push back; otherwise push int(t). Mind the a,b order (first out is the right operand). Single-element input returns directly.
explain: Postfix needs no precedence checks: push numbers, and on an operator pop two, compute one, push back. The pop order is b=pop(), a=pop(); subtraction and division must not be swapped. Division uses int(a/b) for truncation toward zero.
```

```quiz
type: function
exam: true
q: Implement largest_rectangle_area(heights): the largest rectangle area in a histogram. For example heights=[2,1,5,6,2,3] gives 10 (height 5 and 6, width 2). Use a monotonic stack, O(n) required. (Hint: for each bar find the first bar to its left/right that is shorter; the width of the rectangle using it as height is right-left-1.)
func: largest_rectangle_area
starter: |
  def largest_rectangle_area(heights):
      # return the largest rectangle area in the histogram
      return 0
cases: |
  [2,1,5,6,2,3] -> 10
  [2,4] -> 4
  [4,2,0,3,2,5] -> 6
  [] -> 0
hint: use a monotonically increasing stack. While iterating, maintain left: when the top is taller than the current, pop; the popped h's right boundary is the current i, left boundary is the new top position; area h*(i-left-1). After the loop, the right boundary for every remaining bar in the stack is n. Empty list returns 0.
explain: A classic monotonic-stack application: the range a bar's height can "dominate" is the distance between the first shorter bars on its left and right. Popping settles the answer - one more instance of "the answer is determined the moment it is popped". The empty list must be handled separately.
```

## Part 3 · Mini Project

```quiz
type: project
exam: true
q: Implement a command-line calculator (project `stack_calculator`): read one line of an infix expression (supporting `+ - * /`, parentheses, multi-digit positive integers, and spaces), and output the result, truncating division toward zero. Requirements: (1) implement it with two stacks, do not use Python's eval(); (2) print "invalid" instead of crashing on illegal input; (3) provide a function `calculate(expr: str) -> int` (returns the result when valid, raises ValueError when invalid) and write at least 8 test cases with `unittest` or `pytest` covering: basic four operations, precedence, parentheses, multi-digit numbers, spaces, division by zero, mismatched parentheses, and empty strings. You may use Lesson 15's algorithm skeleton as a reference, but you must fill in the robustness and tests yourself.
explain: Every topic in this chapter converges in this project: basic stack operations, nearest matching (parentheses), operator precedence (an extension of the monotonic-stack idea), and the crash points "read digits in a run", "pop order", and "division truncates toward zero". The focus is testing - turn the boundary cases into automated tests, and you truly understand it.
```
