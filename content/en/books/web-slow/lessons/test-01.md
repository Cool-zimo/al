# Chapter 1 Review: What Programming Is

> This review covers lessons 01 to 05: how code runs, variables, data types, type conversion, and debugging output.

## Multiple choice

```quiz
type: choice
q: Where is the `<script>` tag usually placed in an HTML file?
options:
- inside the `<head>`
- at the very end of the `<body>`
- only in a separate .js file
- inside the `<title>`
answer: 1
explain: putting it at the end of the body means the page elements are parsed first, so the code can find them when it runs.
```

```quiz
type: choice
q: What is the difference between `let` and `const`?
options:
- they are exactly the same
- `let` declares a variable you can reassign, `const` does not allow reassignment
- `const` declares a variable you can reassign, `let` does not
- `let` can only be used for numbers
answer: 1
explain: const is for constants (the value cannot change); let is for variables (you can reassign them).
```

```quiz
type: choice
q: What does `typeof "hello"` return?
options:
- "number"
- "string"
- "boolean"
- undefined
answer: 1
explain: a value in quotes is a string, so typeof returns "string".
```

```quiz
type: choice
q: What is the result of `"5" + 3`?
options:
- 8
- "53"
- "8"
- an error
answer: 1
explain: when a string is involved, + does concatenation, so the number is converted to a string and joined on.
```

```quiz
type: choice
q: If you see `ReferenceError: x is not defined`, what is the most likely cause?
options:
- the browser is too old
- the variable name is misspelled or was never declared
- the network is down
- there is not enough memory
answer: 1
explain: "is not defined" means the browser cannot find that variable, usually because of a typo or a missing declaration.
```

## Hands-on tasks

```quiz
type: js
q: Write a function convertToNumber that takes a string parameter str containing digits and returns it converted to a real number.
func: convertToNumber
starter: |
  function convertToNumber(str) {
      // write your code here
  }
cases: |
  "100" -> 100
  "3.14" -> 3.14
hint: use Number() to convert
explain: Number() turns a string of digits into an actual number.
```

```quiz
type: js
q: Write a function greet that takes name and age and returns a string in the form "Hi, my name is NAME and I am AGE years old".
func: greet
starter: |
  function greet(name, age) {
      // write your code here
  }
cases: |
  "Alice", 20 -> "Hi, my name is Alice and I am 20 years old"
  "Bob", 25 -> "Hi, my name is Bob and I am 25 years old"
hint: use + to join the strings
explain: string concatenation lets you embed variables into a sentence.
```

## Mini project

```quiz
type: js
q: Write a function priceCalculator that takes two parameters, price (a string of digits) and count (a number). Convert price to a number first, then return the total price (price * count).
func: priceCalculator
starter: |
  function priceCalculator(price, count) {
      // write your code here
  }
cases: |
  "10", 3 -> 30
  "25.5", 4 -> 102
hint: Number(price) first, then multiply by count
explain: values read from inputs are always strings, so you must convert before doing maths.
```
