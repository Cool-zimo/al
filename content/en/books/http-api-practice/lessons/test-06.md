# Chapter 6 Quiz · Engineering

> 10 questions covering lessons 26-30. These five decide whether your program "runs stably for hours": connection reuse skips handshakes, pagination drops nothing, respecting limits avoids bans, concurrency is fast without hammering the other side, and it all gets wrapped into a usable tool.

```quiz
type: choice
q: Why is requests.get() several times slower than session.get()?
options:
- Session uses a faster parsing algorithm
- requests.get() internally creates and immediately destroys a temporary Session, wasting the TCP/TLS handshake; Session keeps a pool so later requests reuse the established connection
- Session compresses data automatically
- It just caches responses
answer: 1
explain: In one HTTPS request, setup (DNS + TCP handshake + TLS handshake) costs 2~3 RTTs while the actual work costs 1. requests.get() discards after use, re-paying the "connection tax" every time; Session keeps the connection pooled, so later requests cost nothing. At 100 requests with RTT 200ms, that's 80 seconds versus 20
```

```quiz
type: choice
q: When sending requests concurrently with threads, what's the correct use of requests.Session?
options:
- Share one Session across threads to maximize connection reuse
- Use threading.local() to give each thread its own Session: avoids thread-safety issues while still reusing connections within a thread
- Create a new Session per request
- Session is completely safe under multithreading
answer: 1
explain: requests' Session isn't thread-safe — the cookie jar and connection pool are shared mutable state, and concurrent access produces sporadic, hard-to-reproduce errors. threading.local() gives each thread its own copy, eliminating races while keeping intra-thread connection reuse. Note this differs from aiohttp, whose Session is designed to be shared
```

```quiz
type: choice
q: What happens when you use offset pagination on live-changing data (message streams, timelines)?
options:
- Nothing at all
- If new data is inserted during traversal, later offsets shift, so some items are duplicated and some are never fetched
- It's just slightly slower
- It deduplicates automatically
answer: 1
explain: offset is the relative position "skip N items." Insert one item at the front and everything shifts by one, so your next "skip N" re-shows the last item of the previous page while permanently missing the newest one. A cursor records a concrete item ID and is immune to insertions, so live data must use cursors
```

```quiz
type: choice
q: What's the correct usage of X-RateLimit-Reset versus Retry-After?
options:
- Both can be passed straight to time.sleep()
- X-RateLimit-Reset is an absolute UTC timestamp; subtract time.time() to get seconds to wait. Retry-After is relative seconds and can be slept directly
- Both are absolute timestamps
- Both are relative seconds
answer: 1
explain: This is the easiest mistake to make. X-RateLimit-Reset's value is around 1.7 billion — sleeping on it directly sleeps 55 years. The correct form is time.sleep(max(0, reset - time.time() + 1)). Whereas Retry-After: 60 means "wait 60 seconds" and is usable as-is. Whenever you get a number, first decide whether it's "when" or "how long"
```

```quiz
type: choice
q: Which statement about Python's GIL and multithreaded requests is correct?
options:
- The GIL makes Python threading useless, so concurrency requires asyncio
- The GIL blocks parallel computing; threads release it during I/O, so network requests (almost entirely waiting) get real speedup from threads
- The GIL only affects single-threaded programs
- Multithreaded requests corrupt data
answer: 1
explain: The key distinction is waiting versus computing. HTTP requests spend 99% of their time waiting on the network with the CPU idle; during that the thread releases the GIL so others run, making threads effective. What the GIL actually blocks is CPU-bound work (heavy math), where the answer is multiprocessing
```

```quiz
type: choice
q: What happens if you call requests.get() or time.sleep() inside an async function?
options:
- Concurrency works normally, just slightly slower
- They're synchronous blocking calls that freeze the entire event loop, stalling every coroutine and losing all concurrency — even slower than serial
- They're automatically converted to async versions
- Just a warning
answer: 1
explain: asyncio is single-threaded with an event loop; concurrency comes from coroutines yielding control via await. time.sleep and requests.get freeze the thread, so the loop can't switch to other coroutines and everything queues up serially. Correct: await asyncio.sleep() and aiohttp's session.get()
```

```quiz
type: choice
q: What's the correct way to send a JSON request body with requests?
options:
- data=json.dumps(body), and set Content-Type manually
- json=body; requests serializes it and adds Content-Type: application/json automatically
- body=json.dumps(body)
- pass the dict straight to data=
answer: 1
explain: json= does two things at once: json.dumps serialization and setting Content-Type: application/json. data=json.dumps(body) only does the first, so the server may parse the body as a form and fail or see empty fields. data=dict is form encoding (application/x-www-form-urlencoded), not JSON
```

```quiz
type: function
q: Build pagination parameters. Write build_params(page, per_page, max_per_page=100) returning a parameter dict. Rules: when per_page exceeds max_per_page, truncate it to max_per_page (many APIs truncate silently, so truncate yourself); when per_page <= 0, treat it as max_per_page; when page < 1, treat it as 1. Return {"page": page, "per_page": per_page}.
func: build_params
starter: |
  def build_params(page, per_page, max_per_page=100):
      # Hint: truncate per_page first, then fix page's lower bound
      return {}
cases: |
  1, 30 -> {"page": 1, "per_page": 30}
  2, 200 -> {"page": 2, "per_page": 100}
  0, 30 -> {"page": 1, "per_page": 30}
  -5, 200, 50 -> {"page": 1, "per_page": 50}
  3, 0 -> {"page": 3, "per_page": 100}
  1, 100 -> {"page": 1, "per_page": 100}
hint: `if per_page <= 0: per_page = max_per_page`; `per_page = min(per_page, max_per_page)`; `if page < 1: page = 1`; `return {"page": page, "per_page": per_page}`
explain: Truncating yourself has two benefits: the count you receive matches what you asked for, so you never "request 200, get 100, and assume it was everything"; and page math stays accurate. The page lower bound works the same way — upstream passing 0 or negatives shouldn't produce a negative offset. This is what "don't trust input" looks like in pagination
```

```quiz
type: function
q: Compute how long to wait after being rate limited. Write wait_seconds(retry_after=None, reset_ts=None, now_ts=None, default=60) returning the integer number of seconds to wait. Rules: when retry_after is not None, prefer it (relative seconds, return it as an int); otherwise when both reset_ts and now_ts are not None, return int(reset_ts - now_ts) (absolute timestamps subtracted); otherwise return default. Return 0 whenever the result would be negative.
func: wait_seconds
starter: |
  def wait_seconds(retry_after=None, reset_ts=None, now_ts=None, default=60):
      # Hint: check in priority order, then clamp negatives to zero
      return 0
cases: |
  30 -> 30
  30, 2000 -> 30
  None, 2000, 1900 -> 100
  None, 1900, 2000 -> 0
  None, None, None -> 60
  None, 2000, None -> 60
hint: `if retry_after is not None: wait = int(retry_after)`; `elif reset_ts is not None and now_ts is not None: wait = int(reset_ts - now_ts)`; `else: wait = default`; `return max(0, wait)`
explain: The priority comes from authority: if the server explicitly says wait 30 seconds (Retry-After), that beats your own calculation. Absolute timestamps need both values — with reset but no now you can't derive a duration, so fall back to default. The final max(0, ...) matters because "reset already passed" must not return a negative; time.sleep raises ValueError on negatives
```

```quiz
type: function
q: Estimate how many batches concurrency needs. Write batch_count(n_requests, workers) returning the number of batches (rounded up). Rules: workers must be a positive integer, otherwise return n_requests (degrade to one per batch); return 0 when n_requests <= 0.
func: batch_count
starter: |
  def batch_count(n_requests, workers):
      # Hint: degrade for invalid workers, return 0 for n<=0, otherwise round up
      return 0
cases: |
  100, 10 -> 10
  95, 10 -> 10
  5, 10 -> 1
  0, 10 -> 0
  100, 0 -> 100
  7, 2 -> 4
hint: `if n_requests <= 0: return 0`; `if not isinstance(workers, int) or workers <= 0: return n_requests`; `import math`; `return math.ceil(n_requests / workers)`
explain: n requests with w workers need ceil(n/w) batches. 95 requests at 10 concurrency is still 10 batches (the last holds only 5) — that's the mathematics behind concurrency's diminishing returns: going 1→10 workers saves 90%, but 100→200 barely helps at modest volumes while doubling the risk
```
