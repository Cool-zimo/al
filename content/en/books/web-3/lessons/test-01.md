# Chapter 1 Test: Asynchrony

## Multiple Choice Questions

```quiz
type: choice
q: What does JavaScript being single-threaded mean?
options:
- It can only make one network request at a time
- At any given moment only one instruction can execute, and long synchronous operations freeze the page
- It cannot use multi-threading libraries
- All code must be written inside callbacks
answer: 1
explain: Single-threaded means only one instruction can execute at a time. Rendering, events, and JS execution share the main thread, so a synchronous long-running operation blocks the page.
```

```quiz
type: choice
q: What is the output order of the following code? console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D');
options:
- A → B → C → D
- A → D → C → B
- A → C → D → B
- A → D → B → C
answer: 1
explain: Synchronous code A and D run first; microtask C runs before macrotask B.
```

```quiz
type: choice
q: What is the essential problem of callback hell?
options:
- Callback function names are too long
- Multiple layers of nesting cause runaway indentation, redundant error handling, and poor reusability
- Callbacks cannot accept parameters
- Callback functions must run synchronously
answer: 1
explain: Callback hell is rightward-arrow code produced by multiple layers of async nesting. The main problems are runaway indentation, redundant error handling, and poor reusability.
```

```quiz
type: choice
q: Which statement about Promise states is correct?
options:
- A state can change from fulfilled back to pending
- Once a state is determined, it is irreversible
- A Promise can be both fulfilled and rejected at the same time
- When a new Promise is created, its state is already fulfilled
answer: 1
explain: A Promise has three states: pending, fulfilled, rejected. Once it transitions from pending to either of the other two, it is irreversible.
```

```quiz
type: choice
q: Which statement about async/await and Promise.all is correct?
options:
- await can be used inside regular functions
- Promise.all([await a(), await b()]) achieves parallelism
- An async function's return value is automatically wrapped in a Promise
- Promise.all succeeds as soon as any one Promise succeeds
answer: 2
explain: An async function's return value is automatically wrapped in a Promise; await must be used inside async functions; Promise.all needs the Promises themselves to run in parallel, and it is "one failure means total failure."
```

## Hands-on Exercises

```quiz
type: js
q: Write a function delay(ms) that returns a Promise: after ms milliseconds it resolves with the string 'done'.
func: delay
starter: |
  function delay(ms) {
      // Return a Promise that resolves with 'done' after ms milliseconds
  }
checks:
- (delay(100).then(v => window.__delayVal = v), new Promise(r => setTimeout(() => { r(); }, 150)).then(() => window.__delayVal === 'done'))
- (delay(50).then(v => window.__delayVal2 = v), new Promise(r => setTimeout(() => { r(); }, 80)).then(() => window.__delayVal2 === 'done'))
```

```quiz
type: js
q: Given the HTML `<button id="btn">Click</button><div id="out"></div>`, write a function bindBtn() that when #btn is clicked, waits 100ms with a Promise, then sets #out's textContent to 'Clicked' and sets the button's disabled property to true.
func: bindBtn
starter: |
  function bindBtn() {
      // After clicking the button, wait 100ms, update #out text, and disable the button
  }
html: |
  <button id="btn">Click</button><div id="out"></div>
checks:
- (bindBtn(), new Promise(r => setTimeout(() => { r(); }, 50)).then(() => document.querySelector('#btn').click()).then(() => new Promise(r => setTimeout(() => { r(); }, 150))).then(() => document.querySelector('#out').textContent === 'Clicked' && document.querySelector('#btn').disabled === true))
hint: Attach a click listener; inside the callback, use new Promise(resolve => setTimeout(...)) to delay before modifying the DOM.
explain: Async operations only modify the DOM after the delay completes, so the check must wait in steps.
```

## Mini Project

```quiz
type: project
q: Build an "async task queue demo" page: the page has 3 buttons (with ids t1, t2, t3) and an empty list (id="log"). After clicking any button, append an li to log with the button's id as text (representing "task started"); then simulate async execution with a 200ms delay, and after completion append another li with the text "id done". Requirement: after clicking t1, log should show t1, then t1 done in sequence.
html: |
  <button id="t1">Task 1</button>
  <button id="t2">Task 2</button>
  <button id="t3">Task 3</button>
  <ul id="log"></ul>
starter: |
  // Bind click handlers to all three buttons; on click append a "started" li to #log, then after 200ms append a "done" li
explain: The core is: on click, first append the "started" item, then after a delay append the "done" item, simulating the lifecycle of an async task.
```
