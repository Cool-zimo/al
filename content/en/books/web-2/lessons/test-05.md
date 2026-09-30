# Chapter 5 test: forms, storage, debugging and timers

## Part 1 — Multiple choice

```quiz
type: choice
q: Which statement about reading form values is correct?
options:
- A checkbox's ticked state should be read from `checkbox.value`.
- A checkbox's ticked state should be read from `checkbox.checked`, which is a boolean.
- `select.value` returns the combined text of every option.
- `input.value` returns a number for `type="number"` inputs.
answer: 1
explain: `checked` is the boolean state of a checkbox. `select.value` returns the selected option's value, while `input.value` is always a string.
```

```quiz
type: choice
q: Which statement about `localStorage` is correct?
options:
- It can store JavaScript objects directly.
- It stores strings only, so objects must be stored with `JSON.stringify`.
- It offers unlimited storage.
- It clears itself automatically when the tab closes.
answer: 1
explain: `localStorage` stores strings only. Storing an object without `JSON.stringify` produces `"[object Object]"`. Its typical limit is around 5 MB, and it persists after a reload.
```

```quiz
type: choice
q: When does `setTimeout(fn, 0)` run its callback?
options:
- Immediately, before the next line of code.
- After every currently running synchronous task has finished.
- Exactly after zero milliseconds, regardless of other code.
- It blocks the main thread until the callback returns.
answer: 1
explain: A delay of `0` still moves the callback to the task queue. It runs only after the current synchronous code completes.
```

```quiz
type: choice
q: What is the best approach to form validation messages?
options:
- Show `alert("Error")` and let the user work it out.
- Name the field, explain the problem and give an example fix.
- Write only "Invalid format" to keep the message short.
- Never show a message; handle failures silently.
answer: 1
explain: A useful error identifies the field, states the exact problem and provides a concrete example. A bare "Error" does not tell the user what to change.
```

```quiz
type: choice
q: How should a JavaScript stack trace be read?
options:
- Start at the top, which is the event trigger.
- Start at the bottom, which is the event trigger, then follow the call chain upwards to the failing line at the top.
- Line numbers are irrelevant if the error type is known.
- The stack entries are arranged randomly.
answer: 1
explain: The bottom of the trace shows the trigger, such as a user click. Each higher line represents a caller, and the top line gives the file, line and column of the error.
```

## Part 2 — Hands-on

```quiz
type: js
q: Given the HTML `<form id="profile"><input type="text" name="nickname" placeholder="Nickname"><input type="email" name="email" placeholder="Email"><input type="checkbox" name="newsletter" id="news"><button type="submit">Save</button></form>`, write getProfileData() that returns `{ nickname: nickname input value, email: email input value, subscribe: checkbox checked state }`.
func: getProfileData
starter: |
  function getProfileData() {
      // return an object containing the form data
  }
html: |
  <form id="profile">
    <input type="text" name="nickname" placeholder="Nickname" value="Mittens">
    <input type="email" name="email" placeholder="Email" value="cat@test.com">
    <input type="checkbox" name="newsletter" id="news" checked>
    <button type="submit">Save</button>
  </form>
checks:
- (JSON.stringify(getProfileData()) === JSON.stringify({nickname:"Mittens",email:"cat@test.com",subscribe:true}))
hint: Read the text fields with `.value` and the checkbox with `.checked`. `form.elements` is a convenient way to access named fields.
explain: This combines two rules: text inputs expose their value through `.value`, while a checkbox exposes its state through `.checked`.
```

```quiz
type: js
q: Write debounce(fn, delay) that returns a new function. Each call should reset the timer so that `fn` runs only once `delay` milliseconds have passed without another call. Use `setTimeout` and `clearTimeout`.
func: debounce
starter: |
  function debounce(fn, delay) {
      // return a debounced function
      let timerId = null;
      return function (...args) {
          // clear the previous timer and start a new one
      };
  }
checks:
- (function(){ let count = 0; const inc = debounce(() => count++, 100); inc(); inc(); inc(); return new Promise(r => setTimeout(() => r(count === 1), 300)); })()
- (function(){ let n = 0; const f = debounce(() => n++, 100); f(); setTimeout(() => f(), 50); return new Promise(r => setTimeout(() => r(n === 1), 400)); })()
hint: Clear the existing timer on every call, then start a new one that invokes `fn` with the latest arguments.
explain: Debouncing resets the waiting period on each call. It is ideal for search inputs and resize handlers where only the final call should matter.
```

## Part 3 — Mini project

```quiz
type: project
q: Write createAutoSave(inputEl, delay), where `inputEl` is an input element. On the `input` event, debounce for `delay` milliseconds, then store `inputEl.value` in `localStorage` under the key 'autosave' and increment `window.__saveCount`. Return `{ destroy }`, where `destroy` clears the pending timer.
func: createAutoSave
starter: |
  function createAutoSave(inputEl, delay) {
      // bind the input event and debounce the save
      let timerId = null;
      return {
          destroy() {
              // clear the pending timer
          }
      };
  }
html: |
  <input id="note" value="Initial note">
checks:
- (function(){const input=document.querySelector('#note');const sa=createAutoSave(input,100);input.value="Updated note";input.dispatchEvent(new Event('input'));return new Promise(r => setTimeout(() => r(localStorage.getItem('autosave') === 'Updated note'), 200)).then(result => { sa.destroy(); return result; });})()
hint: On `input`, call `clearTimeout(timerId)` and set a new timer that writes to `localStorage` and increments the counter. `destroy` should cancel the pending timer.
explain: This combines event handling, debouncing and persistent storage. It is the same pattern used by autosave features in editors and note-taking apps.
```
