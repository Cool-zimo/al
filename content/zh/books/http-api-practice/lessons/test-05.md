# 第 5 章测验 · 认证、错误与文件

> 共 10 题，覆盖 21-25 课。这三块是"能不能上线"的关键：认证方式选对、失败能恢复、大文件不崩。

```quiz
type: choice
q: 关于 Base64，下列说法正确的是？
options:
- 是加密算法，能保护密码
- 是编码不是加密，无需密钥即可还原，只是让密码能放进 HTTP 头
- 比 MD5 安全
- 只有服务器能解码
answer: 1
explain: Base64 可逆且无需密钥。它的作用是让含冒号或非 ASCII 的密码变成安全的 ASCII 串以便放进 HTTP 头——不是保密。所以 Basic 认证必须配 HTTPS
```

```quiz
type: choice
q: Bearer 这个词的语义是？
options:
- 需要签名验证
- "持有者"——谁持有 token 谁就被认为是合法用户，所以 token 本身就是全部凭证
- 一种加密算法
- 表示已加密
answer: 1
explain: Bearer 意为持有者，语义是"谁拿着谁能用"。这意味着 token 泄露等于账号被盗用，所以必须通过 HTTPS 传输，且绝不出现在 URL、代码或日志里
```

```quiz
type: choice
q: OAuth 授权码流程中，为什么第 ④ 步（用 code 换 token）必须在服务器端做？
options:
- 前端做不到
- 因为需要 client_secret，它绝不能出现在前端；且这样 access_token 不会经过浏览器（URL 会留历史和各种日志）
- 规范要求必须用 POST
- 为了加快速度
answer: 1
explain: 换 token 需要 client_secret（只能存服务器端），且这个请求不经过浏览器，长期凭证 access_token 就不会出现在 URL、浏览器历史、Referer 头或各类日志里。code 是一次性且几分钟过期，泄露也用不了
```

```quiz
type: choice
q: 关于重试策略，下列说法正确的是？
options:
- 所有失败都重试 3 次
- 只对网络错误、429 和 5xx 重试；4xx 说明请求本身有错，重试无意义
- 固定间隔 1 秒最好
- 重试次数越多越好
answer: 1
explain: 判断标准是"再来一次会不会成功"。网络抖动和服务器临时故障能恢复；4xx 表示请求本身有问题。固定间隔还会引发惊群——所有客户端同时重试把刚恢复的服务器又打垮
```

```quiz
type: choice
q: 为什么不能对 POST 请求自动重试？
options:
- POST 请求比较慢
- POST 不幂等，重试可能造成重复下单、重复扣款
- POST 不允许重试
- POST 一定会超时
answer: 1
explain: 幂等性（第 6 课）在这里兑现：POST 每次调用都可能产生新效果，超时后你不知道服务器是否已经处理，重试就可能创建两份。urllib3 的 allowed_methods 默认只含幂等方法正是为此。要安全重试 POST 需要 Idempotency-Key
```

```quiz
type: choice
q: urllib3 的 Retry(total=3) 最多发几次请求？
options:
- 3 次
- 4 次（首次 + 3 次重试）
- 不确定
- 1 次
answer: 1
explain: total 是重试次数，不含首次请求。严格限流场景下这个"差一"会让你超预算
```

```quiz
type: choice
q: 下载 1GB 文件的正确做法是？
options:
- f.write(r.content)
- requests.get(url, stream=True) 然后 for chunk in r.iter_content(8192): f.write(chunk)
- 用 r.text 分块写
- 一次性读进内存再写
answer: 1
explain: r.content 会把整个响应读进内存可能导致 OOM。stream=True 只先取响应头，iter_content 是生成器每次产出 8KB，内存恒定。注意要用 "wb"
```

```quiz
type: choice
q: 断点续传时为什么要检查状态码 206？
options:
- 206 和 200 一样
- 206 表示服务器支持 Range 只返回部分内容；返回 200 说明不支持，会把完整文件从头发来，盲目追加会得到损坏文件
- 206 是错误
- 没有实际作用
answer: 1
explain: 服务器不支持 Range 时会忽略该头返回 200 加完整文件。此时用 "ab" 追加会把完整文件接到旧数据后面，得到一个大小翻倍且损坏的文件。不是 206 就改用 "wb" 从头写
```

```quiz
type: function
q: 写一个函数 is_retryable(status, method)，综合判断能否重试。规则：方法先转大写，不在 {"GET","HEAD","PUT","DELETE","OPTIONS"}（幂等方法）中时返回 False；状态码在 {429,500,502,503,504} 中返回 True；其他返回 False。
func: is_retryable
starter: |
  def is_retryable(status, method):
      # 提示：先判断方法是否幂等，再判断状态码
      return False
cases: |
  503, "GET" -> True
  503, "POST" -> False
  429, "get" -> True
  404, "GET" -> False
  200, "GET" -> False
  500, "PUT" -> True
hint: 用 `IDEMPOTENT = {"GET","HEAD","PUT","DELETE","OPTIONS"}`；`if method.upper() not in IDEMPOTENT: return False`；`return status in {429,500,502,503,504}`
explain: 两个判断缺一不可：状态码筛掉 4xx（请求有错，重试无用），方法筛掉 POST/PATCH（不幂等，重试可能造成重复下单）。这正是 urllib3 的 allowed_methods 做的事
```

```quiz
type: function
q: 计算带抖动的退避时间。写一个函数 backoff_jitter(attempt, base=1, cap=60)，返回指数退避值（不含随机）。规则：base * (2 ** attempt)，不超过 cap；attempt 为 0 时返回 base。要求同时返回这个值，格式为 (delay, capped)，其中 capped 是布尔值表示是否被 cap 截断。
func: backoff_jitter
starter: |
  def backoff_jitter(attempt, base=1, cap=60):
      # 提示：算出原始值，判断是否超过 cap，返回元组
      return (0, False)
cases: |
  0 -> (1, False)
  1 -> (2, False)
  3 -> (8, False)
  10 -> (60, True)
  20 -> (60, True)
hint: 用 `raw = base * (2 ** attempt)`；`if raw > cap: return (cap, True)`；`return (raw, False)`
explain: 返回是否被截断的标记很有用——调用方可以据此判断"已经退避到上限了，再试也没意义"。指数退避给服务器恢复时间，封顶防止第 20 次要等 12 天
```
