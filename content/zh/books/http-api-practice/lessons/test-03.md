# 第 3 章测验 · 第一个请求

> 共 10 题，覆盖 11-15 课。这一章全是能立刻上手的代码——如果这些题做不对，后面的工程化章节会很难受。

```quiz
type: choice
q: 下面这行代码最严重的问题是什么？
   r = requests.get("https://api.example.com/data")
options:
- URL 格式不对
- 缺少 timeout，服务器不响应时程序会无限期卡住
- 应该用 POST
- 返回值类型不对
answer: 1
explain: 不写 timeout 时 requests 会无限等待。在脚本里会让通宵任务卡死，在服务里会占住线程导致雪崩。这是全书最重要的规则：每一个 requests 调用都必须带 timeout
```

```quiz
type: choice
q: 一次 requests.get("https://api.github.com/user") 调用，正确的步骤顺序是？
options:
- 发送HTTP → DNS → TCP → TLS
- 解析URL → DNS查询 → TCP连接 → TLS握手 → 发送HTTP请求 → 接收并封装
- TCP → TLS → DNS → 发送
- DNS → 发送HTTP → TCP
answer: 1
explain: 先解析 URL 拆出协议/域名/端口/路径，再 DNS 查 IP，再 TCP 三次握手，再 TLS 握手（https 才有），然后才发送 HTTP 报文，最后接收响应并封装成 Response 对象。知道顺序才能从错误信息反推故障位置
```

```quiz
type: choice
q: 关于 Response 的正文三形态，下列说法正确的是？
options:
- .text 和 .json() 是同一个东西
- .content 是原始字节，.text 是解码后的字符串，.json() 是方法（要带括号）会解析成 dict/list
- 三者都返回字符串
- .json 是属性，不带括号
answer: 1
explain: .content 是 bytes（原始，用于二进制文件）；.text 是 str（已按 encoding 解码）；.json() 是唯一需要括号调用的方法，它解码并做 JSON 解析。把 .json 当属性用不会立刻报错，直到你用 [] 取键才抛 TypeError，极难排查
```

```quiz
type: choice
q: 关于 r.history，下列说法正确的是？
options:
- 包含所有响应，包括最终的 200
- 只包含重定向过程中的中间响应（3xx），最终响应是 r 本身
- 它是一个字符串
- 只有关闭自动重定向才有值
answer: 1
explain: r 本身就是最终响应对象，不在 history 里。history 是到达最终响应前经过的那些 3xx 响应列表。想要完整链条写 r.history + [r]
```

```quiz
type: choice
q: r.elapsed 测量的是什么？
options:
- 从 DNS 到接收完整个响应体的总时间
- 从发送请求到收到响应头的时间，不包括下载正文
- 服务器处理时间
- 只有 TLS 握手时间
answer: 1
explain: r.elapsed 是 timedelta，从请求发出到响应头接收完毕。它不含正文下载时间，所以下载大文件时 r.elapsed 会明显小于实际总耗时。要测总时间需自己用 time.time() 前后各记一次
```

```quiz
type: choice
q: 用户搜索 "python & java"，哪种写法正确？
options:
- url = f"...?q={keyword}"
- requests.get("...", params={"q": "python & java"})，& 会被编码成 %26
- 把 & 换成空格
- 用 POST 代替
answer: 1
explain: & 是 URL 分隔符，直接拼会切断参数——服务器收到 q="python " 加一个无名参数，不报错但结果全错。params= 会把 & 编码成 %26。这类 bug 危险就在于静默出错
```

```quiz
type: choice
q: 用 params={"page": None, "size": 10} 发请求，最终 URL 是？
options:
- ...?page=None&size=10
- ...?page=&size=10
- ...?size=10（page 被跳过）
- 报错
answer: 2
explain: requests 会跳过值为 None 的参数，让它完全不出现在 URL 里。这让你可以无条件传一堆可选参数，用 None 表示"这次不用"。注意 None 和 "" 不同："" 会生成 page= 这样的空值参数
```

```quiz
type: choice
q: 下面这行代码会发生什么？
   requests.get(url, {"Authorization": "Bearer xxx"}, timeout=10)
options:
- 正确设置了认证头
- 字典被当成查询参数，认证头没设上，且不报错
- 抛 TypeError
- 自动识别为 headers
answer: 1
explain: requests.get() 第二个位置参数是 params 不是 headers。字典会被拼进 URL，认证头根本没设。最危险的是完全不报错，你只看到 401。headers 必须写成关键字参数
```

```quiz
type: function
q: 写一个函数 build_request_summary(method, url, status, elapsed_ms)，生成一行可读的请求摘要。规则：格式为 "{METHOD} {url} -> {status} ({elapsed}ms)"，其中 METHOD 转大写，elapsed 保留一位小数。例如 ("get", "https://a.com", 200, 123.456) → "GET https://a.com -> 200 (123.5ms)"。method 为空时用 "GET"。status 必须是整数。
func: build_request_summary
starter: |
  def build_request_summary(method, url, status, elapsed_ms):
      # 提示：method 为空时的默认值，大写转换，格式化小数
      return ""
cases: |
  "get", "https://a.com", 200, 123.456 -> "GET https://a.com -> 200 (123.5ms)"
  "post", "https://b.com", 404, 12.0 -> "POST https://b.com -> 404 (12.0ms)"
  "", "https://c.com", 500, 0.5 -> "GET https://c.com -> 500 (0.5ms)"
hint: 用 `m = (method or "GET").upper()`；然后 `return f"{m} {url} -> {status} ({elapsed_ms:.1f}ms)"`
explain: 这是日志输出的常见需求。两个细节：method 可能为空（调用方没传）要有默认值，以及 HTTP 方法名规范是大写所以要 upper()。:.1f 是保留一位小数的格式化写法
```

```quiz
type: function
q: 写一个函数 needs_retry(status, is_network_error)，综合判断是否重试。规则：如果是网络错误（is_network_error 为 True）就可以重试；否则只有 429 和 5xx（500-599）可以重试；2xx/3xx 和其他 4xx 都不重试。
func: needs_retry
starter: |
  def needs_retry(status, is_network_error):
      # 提示：先判断网络错误，再判断 429 和 5xx
      return False
cases: |
  500, False -> True
  429, False -> True
  404, False -> False
  200, False -> False
  0, True -> True
  400, True -> True
hint: 用 `if is_network_error: return True`；然后 `return status == 429 or (500 <= status < 600)`
explain: 网络错误优先——连不上或超时时根本没有状态码，重试是唯一选择。有状态码时按第 7 课的规则：只有 429（限流，明确说等会儿再来）和 5xx（服务器临时故障）值得重试。注意 400 即使伴随网络错误也返回 True，是因为网络错误本身就该重试
```
