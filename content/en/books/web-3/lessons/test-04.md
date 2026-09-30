# Chapter 4 Test: Modern JavaScript Features

## Part One · Multiple Choice

```quiz
type: choice
q: Which statement about optional chaining (?.) and the nullish coalescing operator (??) is correct?
options:
- ?? treats 0 and '' as values that need a fallback
- ?. short-circuits and returns undefined when the base value is null or undefined
- || and ?? behave exactly the same
- ?? uses the right-hand value as a fallback when the left side is 0
answer: 1
explain: ?. short-circuits at null/undefined; ?? only falls back for null/undefined, whereas || would replace 0 and ''.
```

```quiz
type: choice
q: What kind of copy does the spread operator (...) produce?
options:
- A deep copy where nested objects are fully independent
- A shallow copy that only duplicates the first level, with nested objects still shared by reference
- It copies getters and setters as well
- It is completely equivalent to structuredClone
answer: 1
explain: Spread only copies the first level; nested objects remain shared by reference, so it is not a deep copy.
```

```quiz
type: choice
q: Which statement about generators is correct?
options:
- A generator is declared with the function keyword
- yield returns all values at once
- A generator is lazily evaluated, yielding values one by one
- A generator cannot be iterated with for...of
answer: 2
explain: A generator is declared with function*; it lazily yields values one at a time and can be iterated with for...of.
```

```quiz
type: choice
q: Inside a subclass constructor in a class, which is correct?
options:
- You may omit super()
- You must call super() before using this
- super() must be written on the last line
- A subclass cannot use extends
answer: 1
explain: In a subclass constructor, super() must be called before this can be accessed. This is a hard ES6 rule.
```

```quiz
type: choice
q: Which statement about debouncing and throttling is correct?
options:
- Throttling runs after a quiet period, while debouncing runs at fixed intervals
- Debouncing is a good fit for scroll listeners
- Debouncing fires once after the trigger stops, which suits search autocomplete
- Both guarantee that requests sent first will arrive first
answer: 2
explain: Debouncing fires once after a quiet period and suits search autocomplete; throttling fires at most once per fixed interval and suits scroll handling.
```

## Part Two · Hands-on

```quiz
type: js
q: Write a function getLast(arr) that uses arr.at(-1) to return the last element of the array; return undefined for an empty array.
func: getLast
starter: |
  function getLast(arr) {
      // use at(-1)
  }
cases: |
  [1,2,3] -> 3
  ["a"] -> "a"
  [] -> undefined
```

```quiz
type: js
q: Given the HTML `<ul id="list"></ul>`, write a function renderFlatDemo(items) that flattens the nested array items with flat(), then creates an li for each element with its textContent set to the element's value and appends it to #list. For example, [1,[2,3]] renders 3 li elements with text '1', '2', '2'.
func: renderFlatDemo
starter: |
  function renderFlatDemo(items) {
      // flat + append li
  }
html: |
  <ul id="list"></ul>
checks:
- (renderFlatDemo([1,[2,3]]), document.querySelectorAll('#list li').length === 3)
- (renderFlatDemo([[4,5]]), document.querySelectorAll('#list li').length === 2 && document.querySelectorAll('#list li')[0].textContent === '4')
hint: items.flat() then loop and append an li. Note that [1,[2,3]].flat() becomes [1,2,3] with 3 elements.
explain: Verifies that the array is flattened before rendering and the li count is correct.
```

## Part Three · Mini Project

```quiz
type: project
q: Build a "throttled counter": the page has a button (id="btn") and a number display (id="num"). Each click should increase #num by 1, but a throttle limits it so that no matter how fast you click, at most one increment happens within any 200ms window. Requirement: 5 rapid clicks within 200ms must increase num by no more than 1.
html: |
  <button id="btn">Click</button>
  <span id="num">0</span>
starter: |
  // Implement throttle and bind it to #btn click to control how often #num increases
explain: The core is the throttle function, which records the last execution time and ignores calls that fall inside the interval.
```
