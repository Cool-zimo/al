# Chapter 5 Quiz · Auth, Errors & Files

> 10 questions covering lessons 21-25. These three areas decide whether your code can ship: pick the right auth, recover from failures, and don't crash on big files.

```quiz
type: choice
q: Which statement about Base64 is correct?
options:
- It's encryption and protects passwords
- It's encoding, not encryption: reversible without a key, its only job is making a password safe to put in an HTTP header
- It's safer than MD5
- Only the server can decode it
answer: 1
explain: Base64 is reversible and needs no key. Its purpose is turning a password that may contain colons or non-ASCII into a safe ASCII string for an HTTP header — not secrecy. That's why Basic auth must be paired with HTTPS
```

```quiz
type: choice
q: What does the word Bearer mean semantically?
options:
- It requires signature verification
- "Holder" — whoever holds the token is treated as the legitimate user, so the token itself is the entire credential
- It's an encryption algorithm
- It means the content is encrypted
answer: 1
explain: Bearer means holder; the semantics are "whoever holds it may use it." That means a leaked token equals a compromised account, so it must travel over HTTPS and must never appear in URLs, code, or logs
```

```quiz
type: choice
q: In the OAuth authorization-code flow, why must step ④ (exchanging the code for a token) happen server-side?
options:
- Frontends can't do it
- Because it needs client_secret, which must never reach the frontend; and this way the access_token never passes through the browser (URLs leave history and various logs)
- The spec requires POST
- To make it faster
answer: 1
explain: The exchange needs client_secret (server-side only), and since the request bypasses the browser, the long-lived access_token never lands in a URL, browser history, the Referer header, or assorted logs. The code is single-use and expires in minutes, so leaking it is useless
```

```quiz
type: choice
q: Which statement about retry strategy is correct?
options:
- Retry every failure 3 times
- Retry only network errors, 429, and 5xx; 4xx means the request itself is wrong, so retrying is pointless
- A fixed 1-second interval is best
- More retries is always better
answer: 1
explain: The test is "would another attempt succeed?" Network hiccups and temporary server faults recover; 4xx means your request is broken. A fixed interval also causes thundering herds — every client retrying at once knocks the just-recovered server back down
```

```quiz
type: choice
q: Why shouldn't you auto-retry POST requests?
options:
- POST is slower
- POST isn't idempotent; retrying may create duplicate orders or double charges
- POST isn't allowed to be retried
- POST always times out
answer: 1
explain: Idempotency (lesson 6) pays off here: each POST call may produce a new effect, and after a timeout you don't know whether the server already processed it, so retrying may create two. urllib3's allowed_methods defaults to idempotent methods only for exactly this reason. Safe POST retrying requires an Idempotency-Key
```

```quiz
type: choice
q: With urllib3's Retry(total=3), what's the maximum number of requests sent?
options:
- 3
- 4 (the first attempt + 3 retries)
- It depends
- 1
answer: 1
explain: total counts retries, excluding the initial request. Under a strict rate budget this off-by-one pushes you over the limit
```

```quiz
type: choice
q: What's the correct way to download a 1GB file?
options:
- f.write(r.content)
- requests.get(url, stream=True) then for chunk in r.iter_content(8192): f.write(chunk)
- Write r.text in chunks
- Read it all into memory, then write
answer: 1
explain: r.content pulls the whole response into memory and can OOM. stream=True fetches only the headers first, and iter_content is a generator yielding 8KB at a time, so memory stays constant. Remember to use "wb"
```

```quiz
type: choice
q: When resuming an interrupted download, why check for status 206?
options:
- 206 is the same as 200
- 206 means the server supports Range and returned only part; a 200 means it doesn't support Range and sent the whole file from the start, so blindly appending yields a corrupt file
- 206 is an error
- It has no practical effect
answer: 1
explain: When a server doesn't support Range it ignores your header and returns 200 with the complete file. Appending with "ab" then splices that full file onto the old data, producing a doubled and corrupt file. If it isn't 206, switch to "wb" and write from scratch
```

```quiz
type: function
q: Write is_retryable(status, method) to decide whether a retry is allowed. Rules: uppercase the method first; if it's not in {"GET","HEAD","PUT","DELETE","OPTIONS"} (the idempotent methods), return False; return True when the status is in {429,500,502,503,504}; otherwise return False.
func: is_retryable
starter: |
  def is_retryable(status, method):
      # Hint: check idempotency first, then the status code
      return False
cases: |
  503, "GET" -> True
  503, "POST" -> False
  429, "get" -> True
  404, "GET" -> False
  200, "GET" -> False
  500, "PUT" -> True
hint: use `IDEMPOTENT = {"GET","HEAD","PUT","DELETE","OPTIONS"}`; `if method.upper() not in IDEMPOTENT: return False`; `return status in {429,500,502,503,504}`
explain: Both checks are required: the status filter drops 4xx (the request is wrong, retrying is useless) and the method filter drops POST/PATCH (not idempotent — retrying may duplicate an order). That's precisely what urllib3's allowed_methods does
```

```quiz
type: function
q: Compute a backoff delay with jitter. Write backoff_jitter(attempt, base=1, cap=60) returning the exponential backoff value (without randomness). Rules: base * (2 ** attempt), not exceeding cap; attempt 0 returns base. Return both values as a tuple (delay, capped), where capped is a boolean saying whether the cap truncated it.
func: backoff_jitter
starter: |
  def backoff_jitter(attempt, base=1, cap=60):
      # Hint: compute the raw value, check it against cap, return a tuple
      return (0, False)
cases: |
  0 -> (1, False)
  1 -> (2, False)
  3 -> (8, False)
  10 -> (60, True)
  20 -> (60, True)
hint: use `raw = base * (2 ** attempt)`; `if raw > cap: return (cap, True)`; `return (raw, False)`
explain: Returning the truncation flag is useful — the caller can infer "we're already at the ceiling, more tries won't help." Exponential backoff gives the server time to recover, and the cap prevents attempt 20 from waiting 12 days
```
