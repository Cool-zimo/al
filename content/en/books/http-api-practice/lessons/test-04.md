# Chapter 4 Quiz · Sending Data Out

> 10 questions covering Lessons 16-20. This chapter is about sending data out and getting it back safely.

```quiz
type: choice
q: Which statement about json= vs data= with the same dict is correct?
options:
- They're identical
- json= converts to a JSON string and sets application/json; data= converts to k=v&k=v form format and sets x-www-form-urlencoded
- data= is safer
- json= only works with GET
answer: 1
explain: The same dict produces a completely different body, and the server takes a different parsing path based on Content-Type. Post to httpbin.org/post to see it: with json= the form is empty; with data= the json is None
```

```quiz
type: choice
q: What happens with data='{"name": "张三"}'?
options:
- requests detects it and sets Content-Type
- requests sends it verbatim with no Content-Type, so the server doesn't know it's JSON and may fail to parse
- It raises
- It becomes a form automatically
answer: 1
explain: With a string, data= does no conversion and adds no Content-Type. Some servers guess (intermittently), some refuse outright. Use json= or add Content-Type: application/json manually
```

```quiz
type: choice
q: Which statement about multipart/form-data's boundary is correct?
options:
- Optional decoration
- A mandatory separator parameter; requests generates it with files=; setting Content-Type manually tends to omit it and break parsing
- It indicates file size
- Only used in GET
answer: 1
explain: Multipart segments fields with a boundary, so Content-Type must be multipart/form-data; boundary=xxx. A manually-set value usually lacks the boundary, so the server can't split the fields
```

```quiz
type: choice
q: What format do OAuth2 token endpoints usually require?
options:
- JSON (json=)
- A form (data=), even though the response is JSON (requested via Accept: application/json)
- multipart
- text/plain
answer: 1
explain: RFC 6749 specifies application/x-www-form-urlencoded for the token endpoint, so use data=. But the response format is governed by Accept, so Accept: application/json is perfectly normal — Content-Type and Accept are independent
```

```quiz
type: choice
q: With json={"name": "张三"}, the body reads {"name": "\u5f20\u4e09"}. Which is correct?
options:
- It's garbled and needs fixing
- That's json.dumps' default ensure_ascii=True producing legal JSON escapes; parsers restore the original
- Content-Type is wrong
- The server can't handle it
answer: 1
explain: JSON represents non-ASCII via ASCII escapes — legal and recommended, since all-ASCII content sidesteps every charset dispute. Standard parsers restore the original characters
```

```quiz
type: choice
q: You POST with JSON and the server redirects http to https. What happens?
options:
- The body is preserved
- 301/302 downgrade POST to GET, the body is lost, and nothing raises
- requests raises
- It retries automatically
answer: 1
explain: Early browsers changed POST to GET on 301/302 so refreshing wouldn't re-submit an order, and that became the de facto standard. The body is lost silently — the server may create an empty record. Easiest fix: write the API URL as https
```

```quiz
type: choice
q: Which statement about r.history is correct?
options:
- It contains the whole chain including the final response
- It contains only the intermediate 3xx responses; the final response is r itself — the full chain is r.history + [r]
- The responses in it have full bodies
- It only has a value when redirects are disabled
answer: 1
explain: r is the final response and isn't in history. Also, 3xx responses usually have no body, so don't expect content from history — look only at status_code and url
```

```quiz
type: choice
q: Which statement about normalisation is correct?
options:
- Convert everything to strings
- As data enters your code, unify it into one shape (e.g. both single values and lists become lists), so internals handle only one case
- Convert all numbers to integers
- Delete all empty values
answer: 1
explain: APIs often give a single value sometimes and an array other times for the same field. Unifying to a list at the boundary simplifies all downstream logic. Key trap: wrap strings whole as ["python"], never split into characters
```

```quiz
type: function
q: Write a function build_auth(scheme, token) producing the auth header **value** (not a dict). Rules: when both are non-empty return "scheme token" (one space between); if either is empty return "". scheme defaults to "Bearer". Convert both to strings.
func: build_auth
starter: |
  def build_auth(scheme, token):
      # Hint: handle the default, stringify, check for empty, concatenate
      return ""
cases: |
  "Bearer", "abc" -> "Bearer abc"
  "Token", "xyz" -> "Token xyz"
  "Bearer", "" -> ""
  None, "abc" -> ""
  "Bearer", None -> ""
hint: First `s = str(scheme) if scheme is not None else "Bearer"`; `if token is None: return ""`; `t = str(token)`; `if not s or not t: return ""`; `return f"{s} {t}"`
explain: The auth header format is "Bearer <token>" with a mandatory space — omitting it gives a 401 that's very hard to spot. Empty-value checking matters: producing "Bearer " tells the server "I have credentials but they're blank", which behaves unpredictably
```

```quiz
type: function
q: Pagination often requires deciding whether another page exists. Write a function has_next_page(current_page, total_pages). Rules: both arguments must be positive integers, else False; return True when current_page < total_pages, else False.
func: has_next_page
starter: |
  def has_next_page(current_page, total_pages):
      # Hint: validate both are positive ints, then compare
      return False
cases: |
  1, 5 -> True
  5, 5 -> False
  6, 5 -> False
  0, 5 -> False
  1, 0 -> False
  -1, 5 -> False
hint: Use `if not all(isinstance(x, int) and x > 0 for x in (current_page, total_pages)): return False`; then `return current_page < total_pages`
explain: This is the termination condition of a pagination loop. Validation is crucial — a total_pages of 0 or negative means the API returned abnormal data, and you should stop rather than keep requesting. Use isinstance because pagination info from APIs sometimes arrives as strings
```
