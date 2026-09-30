# Chapter 3 Test: Data and Storage Advanced

## Multiple Choice Questions

```quiz
type: choice
q: What is the flaw of JSON.parse(JSON.stringify(obj)) deep cloning?
options:
- It perfectly preserves all types
- It throws on circular references and drops functions, Date, and other type information
- It copies an object's getters/setters
- It can only copy the first level
answer: 1
explain: JSON deep cloning throws on circular references, drops functions, undefined, Map, Set, and converts Date to a string.
```

```quiz
type: choice
q: Which statement about Set deduplication is correct?
options:
- Set deduplicates by object content; two objects with identical content count as one
- Set deduplicates by reference equality; two objects with identical content but different references do not count as duplicates
- Set keys are coerced to strings
- Set can be directly JSON.stringify'd
answer: 1
explain: Set deduplication is based on reference equality; different objects with identical content won't be deduplicated; Set itself also can't be directly serialized.
```

```quiz
type: choice
q: Approximately how much capacity does localStorage have?
options:
- Unlimited
- About 5MB
- About 500MB
- About 50MB
answer: 1
explain: Each origin gets about 5MB of localStorage; exceeding it throws QuotaExceededError.
```

```quiz
type: choice
q: Which statement about reading localStorage with JSON.parse is correct?
options:
- Stored data is always valid JSON; no need for try/catch
- When getItem returns null, JSON.parse(null) throws an error
- Reading should have a default value + try/catch protection
- localStorage can only store numbers
answer: 2
explain: Data may be corrupted or null, so reading should have a default value and be protected with try/catch. JSON.parse(null) evaluates to null and does not throw.
```

```quiz
type: choice
q: What is the correct order for an optimistic update?
options:
- Send the request first, update the UI after success
- Update the UI first, send the request, keep on success, roll back on failure
- Update the UI first, then ignore the request result
- Roll back first, then send the request
answer: 1
explain: An optimistic update immediately updates the interface, then sends the request, keeping the change on success and rolling back on failure.
```

## Hands-on Exercises

```quiz
type: js
q: Write a function dedupe(arr) that uses Set to deduplicate an array and returns the deduplicated array.
func: dedupe
starter: |
  function dedupe(arr) {
      // Use Set to deduplicate and return an array
  }
cases: |
  [1,2,2,3,3] -> [1,2,3]
  ['a','a','b'] -> ['a','b']
```

```quiz
type: js
q: Given the HTML `<div id="box"></div>`, write a function showStored(key) that reads the value for key from localStorage: if it exists, set #box text to 'Value: ' + value; if not, set it to 'No data'. No JSON parsing needed; read the string directly.
func: showStored
starter: |
  function showStored(key) {
      // Read from localStorage and update #box
  }
html: |
  <div id="box"></div>
checks:
- (localStorage.setItem('name','Alice'), showStored('name'), document.querySelector('#box').textContent === 'Value: Alice')
hint: Check whether getItem is null, then branch to set #box text.
explain: Read from localStorage and check for existence.
```

## Mini Project

```quiz
type: project
q: Build a "todo cache app": the page has an input (id="input"), an add button (id="add"), and a list (id="list"). When add is clicked, append an li with the input text to #list, and also store all current li text content in localStorage under the 'todos' key (JSON.stringify as an array). After refresh, it should read the cache and render. Requirement: after clicking add, #list gets a new corresponding li.
html: |
  <input id="input" value="Learn JS">
  <button id="add">Add</button>
  <ul id="list"></ul>
starter: |
  // On #add click: read input -> append li -> store all list text in localStorage
explain: The core is the linkage between DOM rendering and localStorage persistence.
```
