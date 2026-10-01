# Chapter 4 Test: Functions

## Part One · Multiple Choice

```quiz
type: choice
q: Which line of code actually calls the function greet?
options:
- function greet() {}
- greet
- greet()
- def greet()
answer: 2
explain: Calling a function requires the name followed by parentheses greet(). Writing just greet is only a function reference.
```

```quiz
type: choice
q: When you call add(3), what is 3 called?
options:
- parameter
- argument
- return value
- function name
answer: 1
explain: The real value passed in at call time is called an "argument"; the name inside the parentheses in the definition is the "parameter".
```

```quiz
type: choice
q: What is the return value of a function that has no return statement?
options:
- 0
- ""
- undefined
- null
answer: 2
explain: When a function reaches the end without hitting a return, its return value is undefined.
```

```quiz
type: choice
q: Which of the following function calls returns undefined?
options:
- function f(){ return 1; }
- function f(){ return true; }
- function f(){ console.log("hi"); }
- function f(){ return "ok"; }
answer: 2
explain: Only console.log runs with no return, so the function returns undefined.
```

```quiz
type: choice
q: To "double every item in an array and get a new array", which method should you use?
options:
- forEach
- map
- filter
- push
answer: 1
explain: map transforms each item and collects the results into a new array, which is exactly what "double" needs.
```

## Part Two · Hands-on

```quiz
type: js
q: Write a function sayHi that takes a name parameter and uses console.log to print "Hello, " + name.
func: sayHi
starter: |
  function sayHi(name) {
      // write your code here
  }
checks:
- (function(){ var logs = []; var orig = console.log; console.log = function (a) { logs.push(String(a)); }; try { sayHi('Alice'); } finally { console.log = orig; } return logs.length === 1 && logs[0] === 'Hello, Alice'; })()
- (function(){ var logs = []; var orig = console.log; console.log = function (a) { logs.push(String(a)); }; try { sayHi('Bob'); } finally { console.log = orig; } return logs.length === 1 && logs[0] === 'Hello, Bob'; })()
hint: Inside the function body, console.log('Hello, ' + name)
explain: When the function is called, the console.log inside the body executes and outputs.
```

```quiz
type: js
q: Write a function isOdd that takes a number n and returns true if it is odd, false if it is even.
func: isOdd
starter: |
  function isOdd(n) {
      // write your code here
  }
cases: |
  3 -> true
  4 -> false
  0 -> false
hint: Use the remainder n % 2 !== 0
explain: An odd number divided by 2 has a non-zero remainder; the result of the check is already a boolean, so you can return it directly.
```

## Part Three · Mini Project

```quiz
type: js
q: Build a "score toolkit". Write three functions: 1) average(scores) returns the average score (sum of array divided by length); 2) topScorer(students) takes an array of student objects [{name,score}] and returns the name of the student with the highest score; 3) getPass(students) returns an array of students whose score is >= 60. Define all three functions in the same starter.
func: average
starter: |
  function average(scores) {
      // return the average
  }
  function topScorer(students) {
      // return the name of the top scorer
  }
  function getPass(students) {
      // return an array of students with score >= 60
  }
checks:
- average([80,90,100]) === 90
- topScorer([{name:"Alice",score:85},{name:"Bob",score:92},{name:"Charlie",score:78}]) === 'Bob'
- getPass([{name:"Alice",score:85},{name:"Bob",score:55}]).length === 1
hint: average loops to accumulate then divides by length; topScorer loops to compare and track the highest score's name; getPass uses filter or a loop with push
explain: Three small functions combine into a "score toolkit", using iteration, comparison, and filtering.
```
