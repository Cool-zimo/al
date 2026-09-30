# Chapter 6 Test: Comprehensive Practice

## Part One · Multiple Choice

```quiz
type: choice
q: When calling a third-party API directly from the frontend, what must you confirm?
options:
- The response time must be under 100ms
- The response headers include CORS headers that allow cross-origin access
- The API must return XML
- The API only supports POST
answer: 1
explain: The browser same-origin policy blocks cross-origin responses without CORS, so check for Access-Control-Allow-Origin first.
```

```quiz
type: choice
q: Which statement about fetch error handling is correct?
options:
- fetch automatically throws and enters catch on a 404
- fetch only rejects on network-level failure; HTTP errors must be checked with res.ok
- await fetch(url) directly returns the parsed JSON
- fetch blocks page rendering until it finishes
answer: 1
explain: fetch only rejects on network failure; 404/500 are still successful responses and must be handled by checking res.ok.
```

```quiz
type: choice
q: To display a user-supplied city name on the page, the safest approach is?
options:
- el.innerHTML = city
- el.textContent = city
- document.write(city)
- el.outerHTML = city
answer: 1
explain: textContent treats content as plain text and avoids parsing HTML, preventing XSS; innerHTML carries an injection risk.
```

```quiz
type: choice
q: For the "last write wins" race condition in a search scenario, the correct solution is?
options:
- Use setTimeout to delay every request
- Stamp each request with a sequence number and discard the callback unless it is the latest
- Make the requests synchronous
- alert on request failure
answer: 1
explain: Use a sequence number: increment seq for each new request, compare seq in the callback, and discard stale results.
```

```quiz
type: choice
q: What must you watch out for when using localStorage?
options:
- Objects can be stored without conversion
- Only strings can be stored, so objects need JSON.stringify; wrap reads in try/catch to handle corrupt data
- Storage capacity is unlimited
- All origins share the same data
answer: 1
explain: localStorage only stores strings; JSON.parse can throw, so reads must be wrapped in try/catch.
```

## Part Two · Hands-on

```quiz
type: js
q: Write a pure function normalizeWeather(raw) that converts a raw weather object of the form {name, main:{temp}, weather:[{description}], main:{humidity}} into {city, temp, condition, humidity}. Round temp with Math.round; condition comes from weather[0].description.
func: normalizeWeather
starter: |
  function normalizeWeather(raw) {
      // name / main.temp / weather[0].description / main.humidity
  }
cases: |
  {"name": "Beijing", "main": {"temp": 23.6, "humidity": 45}, "weather": [{"description": "Sunny"}]} -> {"city": "Beijing", "temp": 24, "condition": "Sunny", "humidity": 45}
  {"name": "Shanghai", "main": {"temp": 19.2, "humidity": 80}, "weather": [{"description": "Cloudy"}]} -> {"city": "Shanghai", "temp": 19, "condition": "Cloudy", "humidity": 80}
```

```quiz
type: js
q: Given the HTML `<div id="box"></div><input id="kw" value="Guangzhou">`, write a function showKeyword() that writes the value of #kw into #box using textContent, sets #box's className to 'active', and returns #box.textContent.
func: showKeyword
starter: |
  function showKeyword() {
      // read the input value, write textContent, set className, return textContent
  }
html: |
  <div id="box"></div>
  <input id="kw" value="Guangzhou">
checks:
- (showKeyword(), document.querySelector('#box').textContent === 'Guangzhou' && document.querySelector('#box').className === 'active')
- (showKeyword(), document.querySelector('#box').textContent === document.querySelector('#kw').value)
hint: box.textContent = kw.value; box.className = 'active'; return box.textContent.
explain: Verifies the textContent assignment and the className update.
```

## Part Three · Mini Project

```quiz
type: project
q: Build a "weather card with cache": the page has an input (id="city"), a button (id="go"), a status area (id="status"), and a card area (id="card"). On click, read #city's value and first check localStorage (key="w_cache", storing a JSON string of the form {"city": name, "temp": number, "savedAt": timestamp}). If a cache exists, has not expired (current time - savedAt <= 60000 ms), and the city matches, reveal #card and set its textContent to "Cached: " + city + ", " + temp + "\u2103", while setting #status to "from cache". Otherwise set #status to "loading" and fetch the data by simulating a request with Promise.resolve returning {city, temp: Math.round(Math.random()*30)}, then write it to the cache and display it. Repeated clicks must not cause races: use a seq counter and only let the latest request update the page.
html: |
  <input id="city" value="Beijing">
  <button id="go">Query</button>
  <div id="status"></div>
  <div id="card" hidden></div>
starter: |
  // Implement: cache read/write + seq race protection + status switching + rendering
explain: The core is cache checks, seq validation to prevent races, and distinguishing the "from cache" and "loading" states.
```
