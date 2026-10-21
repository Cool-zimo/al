# Chapter 2 Quiz · Messages & Semantics

> 10 questions covering Lessons 06-10. The concepts in this chapter (idempotency, status codes, headers, encoding, cookies) are the basis for every judgement call in the code that follows — get them wrong and even elegant code is wrong.
> Answer them yourself first, then revisit the lessons for anything you miss.

```quiz
type: choice
q: DELETE is defined as idempotent, yet the first call returns 200 and the second returns 404. Which is correct?
options:
- It's not idempotent because the responses differ
- Idempotency looks at final server state: after both calls the user is absent, so the state is the same and it is idempotent
- Only a 204 response counts as idempotent
- Idempotency applies only to GET
answer: 1
explain: Idempotency means "1 call and N calls leave the server in the same final state", not "the response is identical". DELETE removes the user the first time and finds them gone the second — state is identical after both, so it's idempotent. This is the most common misunderstanding of idempotency
```

```quiz
type: choice
q: Which statement about POST is correct?
options:
- POST is safe because it transmits data in the body
- POST is neither safe nor idempotent, and that's exactly its purpose — use it when "every call should produce a new effect"
- POST is always slower than GET
- POST can't carry query parameters
answer: 1
explain: POST is the only commonly used method that is neither safe nor idempotent. Not a flaw: placing an order or sending a message should produce a new result every time. Precisely because it isn't idempotent, it needs mechanisms like Idempotency-Key to allow safe retries
```

```quiz
type: choice
q: What's the essential difference between 401 and 403?
options:
- 401 wrong password, 403 wrong username
- 401 means unauthenticated (adding credentials may succeed); 403 means identity known but insufficient permission (retrying is useless)
- 401 is for web pages, 403 for APIs
- There's no difference
answer: 1
explain: 401 actually means "you haven't proven who you are" — retrying with a token may work. 403 means "I know who you are but you're not allowed" — ten thousand retries won't help. This difference decides whether you write retry logic; retrying 403 only wastes time and quota
```

```quiz
type: choice
q: Which status code means "content unchanged, use your cache" and returns no body?
options:
- 200
- 204
- 304
- 404
answer: 2
explain: 304 Not Modified works with If-None-Match / ETag: the client sends the ETag it received last time, the server compares, and if unchanged returns 304 with no body so the client reuses its local cache. It skips the entire response body transfer
```

```quiz
type: choice
q: Regarding 204 No Content, which approach is correct?
options:
- Parse its body with r.json()
- Its body is always empty; test with == 204 and don't call .json()
- 204 means a redirect
- 204 is a client error
answer: 1
explain: 204 means success with no body. Calling .json() on it raises (nothing to parse). DELETE usually returns 204, so test `if r.status_code == 204` rather than blindly calling .json()
```

```quiz
type: choice
q: Which snippet gives you "the request headers you sent"?
options:
- r.headers
- r.request.headers
- r.response.headers
- r.req.headers
answer: 1
explain: r.headers is what the server returned; r.request.headers is what you sent. When debugging "I set Authorization but got 401", the first step is printing r.request.headers — a common cause is a cross-domain redirect stripping it for security
```

```quiz
type: choice
q: Which statement about X- prefixed custom headers is correct?
options:
- HTTP requires X- on all custom headers
- X- comes from the 1982 mail standard RFC 822; RFC 6648 advised against it in 2012, but existing code makes it impossible to remove, so it's still everywhere
- X- marks encrypted headers
- X- only works over HTTPS
answer: 1
explain: Once an X- header is widely adopted it becomes a de facto standard, and dropping the prefix later breaks everything — so in practice it can't be removed. RFC 6648 therefore advised against new ones, but developers largely ignored it. Just follow the API's documentation; don't improvise
```

```quiz
type: choice
q: Which is the correct way to download an image with requests?
options:
- f.write(r.text) with open(path, "w")
- f.write(r.content) with open(path, "wb")
- f.write(r.text) with open(path, "wb")
- f.write(r.content) with open(path, "w")
answer: 1
explain: An image is binary. r.text decodes it as text, replacing invalid byte sequences with replacement characters — permanently damaged, file won't open. You must use r.content (raw bytes) with "wb" (binary write)
```

```quiz
type: function
q: Write a function classify(code) telling you how to handle an HTTP status code. Rules: 2xx → "ok"; 3xx → "follow"; 429 → "retry-later"; 5xx → "retry"; other 4xx → "fix-request"; 1xx → "continue"; out of range (< 100 or >= 600) → "unknown".
func: classify
starter: |
  def classify(code):
      # Hint: handle out-of-range first, then branch on the first digit; check 429 before the 4xx branch
      return "unknown"
cases: |
  200 -> "ok"
  301 -> "follow"
  429 -> "retry-later"
  500 -> "retry"
  403 -> "fix-request"
  404 -> "fix-request"
  100 -> "continue"
  99 -> "unknown"
hint: First `if code < 100 or code >= 600: return "unknown"`; then `if code == 429: return "retry-later"`; then branch on code // 100: 1→continue, 2→ok, 3→follow, 4→fix-request, 5→retry
explain: This function is the decision table for "what do I do with this status code" — the core of retry logic and error handling. Note 429 must be checked before the 4xx branch: although it starts with 4, it's the only "friendly" error that explicitly tells you to come back later
```

```quiz
type: function
q: Lesson 10 explained that the Cookie header joins key-value pairs with "; ". Write a function count_cookies(header) counting how many pairs a Cookie header string contains. Rules: split on ";", strip each part, ignore empty parts. Empty string or None returns 0.
func: count_cookies
starter: |
  def count_cookies(header):
      # Hint: handle empty first, split on ";", filter out blank parts
      return 0
cases: |
  "a=1; b=2" -> 2
  "session=abc" -> 1
  "" -> 0
  None -> 0
  "a=1;; b=2" -> 2
hint: Use `if not header: return 0`; then `sum(1 for p in header.split(";") if p.strip())`
explain: Splitting on ";" can produce empty parts (a trailing semicolon, or two in a row), which must be filtered before counting. This is standard defensive practice when parsing HTTP headers — real server output is never as tidy as you imagine
```
