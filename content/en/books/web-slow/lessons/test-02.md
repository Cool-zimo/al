# Chapter 2 Review: Making the Program Decide

> This review covers lessons 06 to 10: comparisons, if/else, logical operators, for loops, and while loops.

## Multiple choice

```quiz
type: choice
q: What is the difference between `=` and `===`?
options:
- they are the same
- `=` assigns a value, `===` compares for equality
- `===` assigns a value, `=` compares
- only `==` can be used
answer: 1
explain: a single equals sign is the assignment operator; three equals signs is the strict equality comparison.
```

```quiz
type: choice
q: What is the result of `true && false || true`?
options:
- true
- false
- an error
- undefined
answer: 0
explain: && binds tighter than ||, so true && false is false first, then false || true is true.
```

```quiz
type: choice
q: How many times does the body of `for (let i = 0; i < 5; i++)` run?
options:
- 4 times
- 5 times
- 6 times
- forever
answer: 1
explain: i goes 0, 1, 2, 3, 4 — that is 5 rounds.
```

```quiz
type: choice
q: Which situation is best solved with a while loop?
options:
- printing the numbers 1 to 100
- reading input from the user until they type "quit"
- looping through an array of known length
- adding up the numbers from 1 to 50
answer: 1
explain: when you do not know how many rounds you need, only the stopping condition, while is the right choice.
```

```quiz
type: choice
q: What commonly causes an infinite loop?
options:
- the loop condition never becomes false
- the loop body is too short
- using let
- the variable name is too long
answer: 0
explain: a condition that is always true means the loop never stops, usually because the counter is never updated.
```

## Hands-on tasks

```quiz
type: js
q: Write a function isEven that takes a number n and returns true if n is even, otherwise false. (Hint: use % for remainder)
func: isEven
starter: |
  function isEven(n) {
      // write your code here
  }
cases: |
  4 -> true
  7 -> false
  0 -> true
hint: n % 2 === 0 means n is divisible by 2
explain: % is the remainder operator; n % 2 is what is left after dividing n by 2.
```

```quiz
type: js
q: Write a function factorial that takes a number n and uses a while loop to return n factorial (1*2*3*...*n).
func: factorial
starter: |
  function factorial(n) {
      // write your code here
  }
cases: |
  5 -> 120
  4 -> 24
  3 -> 6
hint: let result = 1, i = 1; while (i <= n) { result *= i; i++; }
explain: inside the while loop, update result and i, then return result.
```

## Mini project

```quiz
type: js
q: Write a function fizzBuzz that takes a number n and returns an array. For each number from 1 to n, put "Fizz" if it is divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both 3 and 5, and otherwise the number itself (as a string).
func: fizzBuzz
starter: |
  function fizzBuzz(n) {
      // write your code here
  }
cases: |
  5 -> ["1","2","Fizz","4","Buzz"]
  3 -> ["1","2","Fizz"]
hint: a for loop plus if/else if/else checking % 3 and % 5
explain: a classic interview problem that combines loops, conditions, and arrays.
```
