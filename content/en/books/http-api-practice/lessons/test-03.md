# Chapter 3 Quiz · Your First Request

> 10 questions covering Lessons 11-15. This chapter is all immediately usable code — if these don't go smoothly, the engineering chapters will hurt.

```quiz
type: choice
q: What's the most serious problem with this line?
   r = requests.get("https://api.example.com/data")
options:
- The URL format is wrong
- No timeout; if the server never responds the program hangs forever
- It should be POST
- The return type is wrong
answer: 1
explain: Without a timeout requests waits indefinitely. In a script that stalls an overnight job; in a service it occupies a thread and can cascade into failure. The most important rule in this book: every requests call must carry a timeout
```

```quiz
type: choice
q: What's the correct step sequence behind one requests.get("https://api.github.com/user") call?
options:
- Send HTTP → DNS → TCP → TLS
- Parse URL → DNS lookup → TCP connect → TLS handshake → send HTTP → receive & wrap
- TCP → TLS → DNS → send
- DNS → send HTTP → TCP
answer: 1
explain: Parse the URL into scheme/host/port/path, DNS lookup for the IP, TCP three-way handshake, TLS handshake (https only), then send the HTTP message, then receive the response and wrap it in a Response object. Knowing the order lets you infer the failure point from the error
```

```quiz
type: choice
q: Which statement about the three forms of a Response body is correct?
options:
- .text and .json() are the same thing
- .content is raw bytes, .text is a decoded string, .json() is a method (needs parentheses) that parses into dict/list
- All three return strings
- .json is an attribute without parentheses
answer: 1
explain: .content is bytes (raw, for binary files); .text is str (decoded using encoding); .json() is the only one needing parentheses — it decodes and JSON-parses. Using .json as an attribute doesn't error immediately; it raises TypeError only when you index with [], which is very hard to trace
```

```quiz
type: choice
q: Which statement about r.history is correct?
options:
- It contains every response including the final 200
- It contains only the intermediate responses (3xx); the final response is r itself
- It's a string
- It only has a value when auto-redirect is disabled
answer: 1
explain: r is itself the final response object and isn't in history. History is the list of 3xx responses passed through before reaching it. For the full chain write r.history + [r]
```

```quiz
type: choice
q: What does r.elapsed measure?
options:
- Total time from DNS to receiving the whole body
- Time from sending the request to receiving the response headers, excluding body download
- Server processing time
- Only the TLS handshake
answer: 1
explain: r.elapsed is a timedelta from request sent to response headers received. It excludes body download, so for large downloads it's noticeably smaller than the real total. Measure the total yourself with time.time() before and after
```

```quiz
type: choice
q: A user searches "python & java". Which approach is correct?
options:
- url = f"...?q={keyword}"
- requests.get("...", params={"q": "python & java"}), so & is encoded as %26
- Replace & with a space
- Use POST instead
answer: 1
explain: & is a URL separator; concatenating it raw cuts the parameter — the server receives q="python " plus a nameless parameter, with no error but completely wrong results. params= encodes & as %26. The danger of this bug class is that it fails silently
```

```quiz
type: choice
q: With params={"page": None, "size": 10}, what's the final URL?
options:
- ...?page=None&size=10
- ...?page=&size=10
- ...?size=10 (page skipped)
- It raises
answer: 2
explain: requests skips parameters whose value is None, omitting them entirely. You can pass a batch of optional parameters unconditionally, using None to mean "not this time". Note None differs from "": the latter produces an empty-valued parameter like page=
```

```quiz
type: choice
q: What happens with this line?
   requests.get(url, {"Authorization": "Bearer xxx"}, timeout=10)
options:
- The auth header is set correctly
- The dict becomes query parameters; no auth header is set, and no error is raised
- It raises TypeError
- It's auto-detected as headers
answer: 1
explain: requests.get()'s second positional parameter is params, not headers. The dict is appended to the URL and no auth header is set at all. The danger is that it fails completely silently — you just see a 401. Write headers=... as a keyword argument
```

```quiz
type: function
q: Write a function build_request_summary(method, url, status, elapsed_ms) producing a readable one-line summary. Format: "{METHOD} {url} -> {status} ({elapsed}ms)", where METHOD is uppercased and elapsed keeps one decimal place. For example ("get", "https://a.com", 200, 123.456) → "GET https://a.com -> 200 (123.5ms)". If method is empty, use "GET".
func: build_request_summary
starter: |
  def build_request_summary(method, url, status, elapsed_ms):
      # Hint: default for empty method, uppercase it, format the decimal
      return ""
cases: |
  "get", "https://a.com", 200, 123.456 -> "GET https://a.com -> 200 (123.5ms)"
  "post", "https://b.com", 404, 12.0 -> "POST https://b.com -> 404 (12.0ms)"
  "", "https://c.com", 500, 0.5 -> "GET https://c.com -> 500 (0.5ms)"
hint: Use `m = (method or "GET").upper()`; then `return f"{m} {url} -> {status} ({elapsed_ms:.1f}ms)"`
explain: A common logging need. Two details: method may be empty (caller didn't pass it) so it needs a default, and HTTP method names are conventionally uppercase so upper() is right. :.1f formats to one decimal place
```

```quiz
type: function
q: Write a function needs_retry(status, is_network_error) deciding whether to retry. Rules: if it's a network error (is_network_error True) then retry; otherwise only 429 and 5xx (500-599) are retryable; 2xx/3xx and other 4xx are not.
func: needs_retry
starter: |
  def needs_retry(status, is_network_error):
      # Hint: check the network error first, then 429 and the 5xx range
      return False
cases: |
  500, False -> True
  429, False -> True
  404, False -> False
  200, False -> False
  0, True -> True
  400, True -> True
hint: Use `if is_network_error: return True`; then `return status == 429 or (500 <= status < 600)`
explain: Network errors come first — with no connection there's no status code at all, so retrying is the only option. With a status code, apply Lesson 07's rule: only 429 (rate limited, explicitly says come back later) and 5xx (transient server fault) are worth retrying. Note 400 returns True when paired with a network error, because the network error alone justifies a retry
```
