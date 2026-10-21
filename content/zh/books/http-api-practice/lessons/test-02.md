# 第 2 章测验 · 报文与语义

> 共 10 题，覆盖 06-10 课。这一章的概念（幂等、状态码、头部、编码、Cookie）是后面所有代码的判断依据——它们错了，后面写得再漂亮也是错的。
> 建议先自己答一遍，错了的地方回到对应课文再看一遍。

```quiz
type: choice
q: DELETE 方法被定义为幂等的，但第一次返回 200、第二次返回 404。下列说法正确的是？
options:
- 它不幂等，因为响应不一样
- 幂等看的是服务器最终状态：两次之后用户都不存在，状态相同，所以幂等
- 只有返回 204 才算幂等
- 幂等只针对 GET
answer: 1
explain: 幂等的定义是"做 1 次和做 N 次，服务器最终状态相同"，不是"响应相同"。DELETE 第一次删掉、第二次发现已经没了，两次之后状态一致，所以幂等。这是关于幂等最常见的误解
```

```quiz
type: choice
q: 关于 POST 方法，下列说法正确的是？
options:
- POST 是安全的，因为它用请求体传输数据
- POST 既不安全也不幂等，这正是它的用途——需要"每次调用都产生新效果"时就该用它
- POST 一定比 GET 慢
- POST 不能带查询参数
answer: 1
explain: POST 是唯一既不安全也不幂等的常用方法。这不是缺陷：下单、发消息这类操作本来就该每次都产生新结果。也正因为不幂等，它才需要 Idempotency-Key 这类机制来实现安全重试
```

```quiz
type: choice
q: 401 和 403 的本质区别是什么？
options:
- 401 密码错，403 用户名错
- 401 表示未认证（补上凭证可能成功），403 表示身份已知但权限不足（重试无用）
- 401 用于网页，403 用于 API
- 两者没有区别
answer: 1
explain: 401 实际含义是"没证明你是谁"，带上 token 重试可能成功。403 是"知道你是谁但不让你访问"，重试一万次也没用。这个区别直接决定要不要写重试逻辑——对 403 重试只会浪费时间和额度
```

```quiz
type: choice
q: 下列哪个状态码表示"服务器内容没变，你可以用缓存"，且不返回响应正文？
options:
- 200
- 204
- 304
- 404
answer: 2
explain: 304 Not Modified 配合 If-None-Match / ETag 使用：客户端带上上次拿到的 ETag，服务器比对发现没变就返回 304 且不发正文，客户端直接用本地缓存。它省掉了整个响应体的传输
```

```quiz
type: choice
q: 关于 204 No Content，下列做法正确的是？
options:
- 用 r.json() 解析它的响应体
- 它的响应体一定是空的，应该用 == 204 判断成功，不要调用 .json()
- 204 表示重定向
- 204 是客户端错误
answer: 1
explain: 204 表示成功但没有正文。对它调用 .json() 会抛异常（没有内容可解析）。DELETE 成功后通常返回 204，所以判断删除成功要写 `if r.status_code == 204` 而不是无脑 .json()
```

```quiz
type: choice
q: 下面哪段代码取到的是"你发出去的请求头"？
options:
- r.headers
- r.request.headers
- r.response.headers
- r.req.headers
answer: 1
explain: r.headers 是服务器返回的响应头；r.request.headers 才是你发出去的请求头。调试"我明明设了 Authorization 却 401"时，第一步就是打印 r.request.headers 看它到底发没发——常见原因是跨域重定向时被安全策略剥离了
```

```quiz
type: choice
q: 关于 X- 前缀的自定义头部，下列说法正确的是？
options:
- HTTP 强制要求所有自定义头部加 X-
- X- 来自 1982 年的邮件标准 RFC 822，2012 年 RFC 6648 建议不再使用，但因存量代码无法去掉，今天依然遍地都是
- X- 表示加密头部
- X- 只在 HTTPS 中有效
answer: 1
explain: 一旦某个 X- 头被广泛使用就成了事实标准，再去掉会破坏所有现存代码，所以前缀实际上无法移除。RFC 6648 因此建议新头部不要再加 X-，但开发者普遍无视。跟随你调用的 API 文档即可，别自作主张
```

```quiz
type: choice
q: 用 requests 下载一张图片，正确的写法是？
options:
- f.write(r.text) 配合 open(path, "w")
- f.write(r.content) 配合 open(path, "wb")
- f.write(r.text) 配合 open(path, "wb")
- f.write(r.content) 配合 open(path, "w")
answer: 1
explain: 图片是二进制数据。r.text 会把它当文本解码一次，非法字节序列被替换成替代字符，数据永久损坏，文件打不开。必须用 r.content（原始字节）配合 "wb"（二进制写）
```

```quiz
type: function
q: 写一个函数 classify(code)，判断一个 HTTP 状态码应该如何处理。规则：2xx 返回 "ok"；3xx 返回 "follow"；429 返回 "retry-later"；5xx 返回 "retry"；其他 4xx 返回 "fix-request"；1xx 返回 "continue"；越界（< 100 或 >= 600）返回 "unknown"。
func: classify
starter: |
  def classify(code):
      # 提示：先处理越界，再按首位数字分档，429 要单独提前判断
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
hint: 先 `if code < 100 or code >= 600: return "unknown"`；再 `if code == 429: return "retry-later"`；然后按 code // 100 分档：1→continue, 2→ok, 3→follow, 4→fix-request, 5→retry
explain: 这个函数就是"拿到状态码后该怎么办"的决策表，是重试逻辑和错误处理的核心。注意 429 必须在 4xx 之前单独判断——它虽然以 4 开头，却是唯一"友好"的、明确告诉你过会儿再来的错误
```

```quiz
type: function
q: 第 10 课讲过 Cookie 请求头把多个键值对用 "; " 拼接。写一个函数 count_cookies(header)，统计 Cookie 头字符串里有几个键值对。规则：按 ";" 分割，去掉每段首尾空白，忽略空段。空字符串或 None 返回 0。
func: count_cookies
starter: |
  def count_cookies(header):
      # 提示：处理空值，按 ";" 分割，过滤掉空白段
      return 0
cases: |
  "a=1; b=2" -> 2
  "session=abc" -> 1
  "" -> 0
  None -> 0
  "a=1;; b=2" -> 2
hint: 用 `if not header: return 0`；然后 `sum(1 for p in header.split(";") if p.strip())`
explain: 按 ";" 分割后可能出现空段（比如尾部多了个分号，或连续两个分号），必须过滤掉再计数。这是解析 HTTP 头部时的常见防御——真实服务器发来的字符串不会像你想象的那么规整
```
