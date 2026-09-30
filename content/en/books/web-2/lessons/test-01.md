# Chapter 1 test: JS basic syntax

## Part 1 · Multiple choice

```quiz
type: choice
exam: true
q: Which statement about let, const and var is correct?
options:
- A variable declared with const can be reassigned
- let and const are block-scoped, while var is not
- A variable declared with var cannot be redeclared
- let declarations are hoisted and initialised to undefined, so they can be accessed before declaration
answer: 1
explain: let and const are block-scoped and live in a temporal dead zone (inaccessible before declaration); var is only function-scoped and is hoisted. A const binding cannot be reassigned.
```

```quiz
type: choice
exam: true
q: Which statement about === and == is correct?
options:
- == and === have no difference
- === performs type conversion and == does not
- === performs no type conversion (strict equality), while == attempts type conversion before comparing
- == is stricter than ===
answer: 2
explain: === is strict equality and does no type conversion; == tries to convert types first. For example, 0 == false is true, but 0 === false is false.
```

```quiz
type: choice
exam: true
q: Which statement about NaN is correct?
options:
- NaN means "Not a Number", but typeof NaN returns "number"
- NaN === NaN returns true
- isNaN("hello") returns false
- NaN is a value of number type
answer: 0
explain: NaN's type is "number" (typeof NaN === "number"), and NaN is not equal to anything, including itself (NaN !== NaN). Use Number.isNaN() to test for it.
```

```quiz
type: choice
exam: true
q: Which statement about typeof null is correct?
options:
- typeof null returns "null"
- typeof null returns "undefined"
- typeof null returns "object" (a long-standing bug)
- typeof null returns "boolean"
answer: 2
explain: typeof null returns "object", a historical quirk of JS. To test for null, compare with === null.
```

```quiz
type: choice
exam: true
q: Which statement about function declarations and function expressions is correct?
options:
- The function expression function foo() {} is hoisted and can be called before it appears
- An arrow function has no this binding of its own
- The function declaration const foo = function() {} is fully hoisted
- An arrow function can be used as a constructor with new
answer: 1
explain: An arrow function has no this of its own; it inherits this from the surrounding scope. Function declarations (function foo(){}) are hoisted; function expressions are not. An arrow function cannot be used as a constructor.
```

## Part 2 · Hands-on

```quiz
type: js
exam: true
q: Write a function uniqueNumbers(arr) that returns a new array containing only the distinct numbers from arr, preserving the original order. For example [1, 2, 2, 3, 1] becomes [1, 2, 3].
func: uniqueNumbers
starter: |
  function uniqueNumbers(arr) {
      // return the deduplicated array
  }
cases: |
  [1,2,2,3,1,4,3] -> [1,2,3,4]
  [] -> []
  [5] -> [5]
  [1,1,1,1] -> [1]
hint: Use a Set or filter + indexOf. return [...new Set(arr)]; is the shortest form.
explain: Array deduplication is a common task. A Set removes duplicates by definition; spread it back into an array. You can also write filter((item, index) => arr.indexOf(item) === index).
```

```quiz
type: js
exam: true
q: Write a function getFullName(user) where user is an object { firstName, lastName }. Destructure firstName and lastName from the object and return the full name with a space between them. If lastName is absent, return only firstName.
func: getFullName
starter: |
  function getFullName(user) {
      // destructure user and return the full name
  }
checks:
- getFullName({firstName:"Sam",lastName:"Smith"}) === "Sam Smith"
- getFullName({firstName:"Lee"}) === "Lee"
- getFullName({firstName:"Pat",lastName:"Jones"}) === "Pat Jones"
hint: const { firstName, lastName } = user; return lastName ? `${firstName} ${lastName}` : firstName;
explain: Object destructuring is syntactic sugar for pulling properties out of an object. The conditional operator handles the case where lastName may be missing.
```

## Part 3 · Mini-project

```quiz
type: project
exam: true
q: Write a function analyzeNumbers(numbers) where numbers is an array of numbers. Return an object { sum, average, max, min, evenCount } containing the total, the average (rounded to two decimal places), the maximum, the minimum and the count of even numbers. For an empty array, return { sum:0, average:0, max:null, min:null, evenCount:0 }.
func: analyzeNumbers
starter: |
  function analyzeNumbers(numbers) {
      // return the statistics object
  }
checks:
- JSON.stringify(analyzeNumbers([1,2,3,4,5])) === JSON.stringify({"sum":15,"average":3,"max":5,"min":1,"evenCount":2})
- JSON.stringify(analyzeNumbers([])) === JSON.stringify({"sum":0,"average":0,"max":null,"min":null,"evenCount":0})
- JSON.stringify(analyzeNumbers([2,4,6])) === JSON.stringify({"sum":12,"average":4,"max":6,"min":2,"evenCount":3})
- JSON.stringify(analyzeNumbers([7])) === JSON.stringify({"sum":7,"average":7,"max":7,"min":7,"evenCount":0})
hint: Handle the empty array first and return the defaults. Use reduce for the sum, Math.max/min spread over the array for the extremes, and filter(n=>n%2===0).length for the even count.
explain: A combined exercise in array statistics: reduce for the sum, Math.max/min for the extremes, filter for counting. The boundary case of an empty array is the key challenge.
```
