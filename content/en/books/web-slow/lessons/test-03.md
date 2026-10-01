# Chapter 3 Review: Containers for Your Data

> This review covers lessons 11 to 15: arrays, array operations, objects, arrays of objects, and putting it all together.

## Multiple choice

```quiz
type: choice
q: Which statement about array indexes is correct?
options:
- indexes start at 1
- indexes start at 0
- indexes can be any number
- arrays do not have indexes
answer: 1
explain: in JS, array indexes start at 0, so the first item is arr[0].
```

```quiz
type: choice
q: Which statement about push and pop is correct?
options:
- push adds at the start and pop removes from the start
- push adds at the end and pop removes from the end
- push removes and pop adds
- push and pop both work in the middle
answer: 1
explain: push adds one item to the end of the array; pop takes the last item off.
```

```quiz
type: choice
q: Given `let users = [{name:"Alice"}, {name:"Bob"}]`, which is the correct way to get "Bob"?
options:
- users.name[1]
- users[1].name
- users["name"][1]
- users.name
answer: 1
explain: index first with [1] to grab the second object, then .name to read the property.
```

```quiz
type: choice
q: When looping over an array of length n, what should the for condition be?
options:
- i <= n
- i < n
- i >= n
- i === n
answer: 1
explain: indexes run from 0 to n-1, so the condition is i < n, i.e. i < arr.length.
```

```quiz
type: choice
q: What is the standard way to filter items from an array of objects?
options:
- use delete to remove the ones that do not match
- loop + if check + push into a new array
- use splice to modify the original array
- manually build a new array by hand
answer: 1
explain: loop over the original, push the matches into a result array — that is the standard filter pattern.
```

## Hands-on tasks

```quiz
type: js
q: Write a function sum that takes an array of numbers and returns the sum of all the elements.
func: sum
starter: |
  function sum(arr) {
      // write your code here
  }
cases: |
  [1, 2, 3, 4, 5] -> 15
  [10, 20, 30] -> 60
hint: let total = 0; loop and add to the running total
explain: looping to build a running total is the basic array-statistics operation.
```

```quiz
type: js
q: Write a function getOldest that takes an array of student objects (each with name and age) and returns the name of the oldest student.
func: getOldest
starter: |
  function getOldest(students) {
      // write your code here
  }
cases: |
  [{"name":"Alice","age":20},{"name":"Bob","age":25},{"name":"Charlie","age":22}] -> "Bob"
hint: keep track of the highest age and the matching name, updating as you loop
explain: loop + compare + update the record is the standard "find the maximum" pattern.
```

## Mini project

```quiz
type: js
q: Write a function classReport that takes an array of student objects (each with name, score, and city) and returns an object with three properties: passCount (how many have score >= 60), avgScore (the average score), and londonCount (how many are from London).
func: classReport
starter: |
  function classReport(students) {
      // write your code here
  }
cases: |
  [{"name":"Alice","score":85,"city":"London"},{"name":"Bob","score":55,"city":"Paris"},{"name":"Charlie","score":90,"city":"London"}] -> {"passCount":2,"avgScore":76.66666666666667,"londonCount":2}
hint: do one loop and track all three counts at once, then return an object
explain: one pass handles several statistics, then you bundle the results into an object.
```
