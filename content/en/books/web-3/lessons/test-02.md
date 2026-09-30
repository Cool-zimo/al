# Chapter 2 Test: Network Requests

## Multiple Choice Questions

```quiz
type: choice
q: What does the Promise returned by fetch resolve to?
options:
- A parsed JSON object
- A Response object
- A status code number
- A headers object
answer: 1
explain: The Promise returned by fetch resolves to a Response object; you must call methods like res.json() to read the response body.
```

```quiz
type: choice
q: Which statement about res.json() is correct?
options:
- It synchronously returns a parsed object
- It returns a Promise; you need await or .then
- It can only be used in POST requests
- It automatically checks res.ok
answer: 1
explain: res.json() returns a Promise; you must await or .then to get the actual data.
```

```quiz
type: choice
q: In which scenario does fetch reject?
options:
- HTTP 404
- HTTP 500
- Network is down or the server is unreachable
- The response body is not valid JSON
answer: 2
explain: fetch only rejects on network-level failures (no network, unreachable, CORS blocked). 404/500 resolve normally; you must manually check res.ok.
```

```quiz
type: choice
q: When sending a POST request with fetch, what type should the body be?
options:
- It must be a JS object
- It must be a string (e.g., the result of JSON.stringify)
- It must be FormData; a string is not allowed
- It can be any type; fetch converts it automatically
answer: 1
explain: fetch's body must be a string or binary at the network transport layer; for JSON, use JSON.stringify.
```

```quiz
type: choice
q: Which statement about CORS is correct?
options:
- CORS is a server-to-server policy
- When CORS reports an error, the request definitely never went out, so just retry
- CORS is a browser security policy; the error requires the backend to add response headers or use a proxy
- Only cross-origin POST requests trigger CORS
answer: 2
explain: CORS is a browser policy; when an error is reported, the request was sent but the response was blocked; the backend needs to add the Access-Control-Allow-Origin header or use a proxy.
```

## Hands-on Exercises

```quiz
type: js
q: Write a function fetchJson(url) that returns a Promise: simulate fetching a JSON endpoint — resolve with {data: 'mock'} after 80ms, then in .then call JSON.parse(JSON.stringify(...)) to simulate res.json() behavior. Here, just return a Promise that resolves with the specified object after 80ms.
func: fetchJson
starter: |
  function fetchJson(url) {
      // Return a Promise that resolves with {data:'mock'} after 80ms
  }
checks:
- (fetchJson('/api/x').then(v => window.__fetchVal = v), new Promise(r => setTimeout(() => { r(); }, 100)).then(() => window.__fetchVal && window.__fetchVal.data === 'mock'))
```

```quiz
type: js
q: Given the HTML `<input id="kw"><button id="go">Search</button><div id="out"></div>`, write a function bindSearch() that when #go is clicked, reads #kw's value, stringifies it as a JSON string in the form {"q":"value"}, and sets #out's textContent to that string. Implement with a click event.
func: bindSearch
starter: |
  function bindSearch() {
      // On button click, read the input, stringify, and display in #out
  }
html: |
  <input id="kw" value="London">
  <button id="go">Search</button>
  <div id="out"></div>
checks:
- (bindSearch(), document.querySelector('#go').click(), document.querySelector('#out').textContent === '{"q":"London"}')
hint: On click, read the input value, JSON.stringify({q: value}), and set textContent.
explain: Simulate constructing the request body string and displaying it after clicking.
```

## Mini Project

```quiz
type: project
q: Build a "mini request state demo" page: a button (id="btn") and a div (id="box"). After clicking the button, box's text should change to "Loading..." immediately, then to "Success" after a 200ms delay, simulating a request from start to finish. Requirement: box's final text should be "Success".
html: |
  <button id="btn">Request</button>
  <div id="box"></div>
starter: |
  // On button click: immediately set box text to "Loading...", then to "Success" after 200ms
explain: The core is: immediately show loading after clicking, then transition to the success state after a delay.
```
