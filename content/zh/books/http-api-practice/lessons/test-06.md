# 第 6 章测验 · 工程化

> 共 10 题，覆盖 26-30 课。这五课决定你的程序"能不能长时间稳定跑"：连接复用省下握手开销、分页不漏数据、尊重限流不被封、并发既快又不打挂对方、最后把它们封装成能用的工具。

```quiz
type: choice
q: requests.get() 比 session.get() 慢好几倍，根本原因是？
options:
- Session 用了更快的解析算法
- requests.get() 内部每次新建并立即销毁一个临时 Session，TCP/TLS 握手白做；Session 保留连接池，后续请求直接复用已建好的连接
- Session 会自动压缩数据
- 只是缓存了响应内容
answer: 1
explain: 一次 HTTPS 请求里，准备（DNS + TCP 握手 + TLS 握手）要 2~3 个 RTT，真正办事只要 1 个 RTT。requests.get() 用完即扔，每个请求都重付这笔"建连税"；Session 把连接留在池里，之后零成本。100 个请求、RTT 200ms 时，这就是 80 秒和 20 秒的差别
```

```quiz
type: choice
q: 多线程并发发请求时，requests.Session 的正确用法是？
options:
- 所有线程共享一个 Session，最大化连接复用
- 用 threading.local() 给每个线程一个独立 Session，既避开线程安全问题，又让同一线程内复用连接
- 每个请求都新建一个 Session
- Session 在多线程下完全安全
answer: 1
explain: requests 的 Session 不是线程安全的——cookie jar 和连接池是共享可变状态，并发读写会产生偶发且难以复现的错误。threading.local() 让每个线程持有自己的副本，消除竞态的同时保留了线程内的连接复用。注意这和 aiohttp 不同：aiohttp 的 Session 本来就设计为共享
```

```quiz
type: choice
q: 在实时变动的数据（消息流、时间线）上用 offset 分页，会发生什么？
options:
- 没有任何问题
- 遍历期间若有新数据插入，后续 offset 整体错位，导致部分数据重复、部分数据永远取不到
- 只是稍微慢一点
- 会自动去重
answer: 1
explain: offset 是"跳过 N 条"这个相对位置。前面插一条新数据，所有数据位置后移一位，下一次跳过 N 条就会重复看到上一页的最后一条，同时永远漏掉最新那条。游标（cursor）记录的是具体数据的 ID，不受插入影响，所以实时数据必须用游标
```

```quiz
type: choice
q: X-RateLimit-Reset 和 Retry-After 的正确用法是？
options:
- 都可以直接 time.sleep(值)
- X-RateLimit-Reset 是绝对 UTC 时间戳，要减去 time.time() 才是等待秒数；Retry-After 是相对秒数，可以直接 sleep
- 两者都是绝对时间戳
- 两者都是相对秒数
answer: 1
explain: 这是最容易犯的错。X-RateLimit-Reset 的值约 17 亿，直接 sleep 它会睡 55 年。正确写法是 time.sleep(max(0, reset - time.time() + 1))。而 Retry-After: 60 就是"等 60 秒"，可以直接用。一个数字拿到手，先分清它是"什么时候"还是"多久"
```

```quiz
type: choice
q: 关于 Python 的 GIL 与多线程发请求，正确的是？
options:
- GIL 让 Python 多线程完全无效，并发只能用 asyncio
- GIL 阻碍的是并行计算；线程在 I/O 时会释放 GIL，所以网络请求（几乎全在等待）能从多线程获得真实加速
- GIL 只影响单线程程序
- 多线程发请求会损坏数据
answer: 1
explain: 关键区分是"等待型"还是"计算型"。HTTP 请求 99% 的时间在等网络、CPU 空闲，这段时间线程释放 GIL 让别人跑，所以多线程有效。真正被 GIL 卡住的是 CPU 密集任务（大量数学计算），那种场景要用多进程
```

```quiz
type: choice
q: 在 async 函数里调用 requests.get() 或 time.sleep()，会发生什么？
options:
- 正常并发，只是稍慢
- 它们是同步阻塞调用，会卡住整个事件循环，所有协程都停住，完全失去并发甚至比串行还慢
- 会自动转成异步版本
- 只是有个警告
answer: 1
explain: asyncio 是单线程 + 事件循环，靠协程主动 await 让出控制权来实现并发。time.sleep 和 requests.get 会让整个线程卡死，事件循环无法切换到其他协程，所有任务被迫串行排队。正确做法：await asyncio.sleep()、aiohttp 的 session.get()
```

```quiz
type: choice
q: 用 requests 发送 JSON 请求体，正确写法是？
options:
- data=json.dumps(body)，并手动设置 Content-Type
- json=body，requests 会自动序列化并加上 Content-Type: application/json
- body=json.dumps(body)
- 直接把字典传给 data=
answer: 1
explain: json= 一次做两件事：json.dumps 序列化，以及设置 Content-Type: application/json。用 data=json.dumps(body) 只做了第一件，服务器可能按表单去解析请求体，导致解析失败或字段全空。而 data=字典 是表单编码（application/x-www-form-urlencoded），不是 JSON
```

```quiz
type: function
q: 构造分页参数。写一个函数 build_params(page, per_page, max_per_page=100)，返回参数字典。规则：per_page 超过 max_per_page 时截断为 max_per_page（很多 API 会静默截断，不如自己先截）；per_page 小于等于 0 时按 max_per_page 处理；page 小于 1 时按 1 处理。返回 {"page": 页面数, "per_page": 每页条数}。
func: build_params
starter: |
  def build_params(page, per_page, max_per_page=100):
      # 提示：先处理 per_page 的截断，再处理 page 的下界
      return {}
cases: |
  1, 30 -> {"page": 1, "per_page": 30}
  2, 200 -> {"page": 2, "per_page": 100}
  0, 30 -> {"page": 1, "per_page": 30}
  -5, 200, 50 -> {"page": 1, "per_page": 50}
  3, 0 -> {"page": 3, "per_page": 100}
  1, 100 -> {"page": 1, "per_page": 100}
hint: `if per_page <= 0: per_page = max_per_page`；`per_page = min(per_page, max_per_page)`；`if page < 1: page = 1`；`return {"page": page, "per_page": per_page}`
explain: 自己先截断有两个好处：一是拿到的条数和你请求的一致，不会出现"要了 200 只给 100 却以为拿全了"；二是页数计算准确。page 下界同理——上游传 0 或负数时不该算出负的偏移。这正是分页里"不要相信输入"的体现
```

```quiz
type: function
q: 计算被限流后要等多久。写一个函数 wait_seconds(retry_after=None, reset_ts=None, now_ts=None, default=60)，返回要等待的整数秒数。规则：retry_after 不为 None 时优先用它（相对秒数，直接返回整数）；否则 reset_ts 和 now_ts 都不为 None 时返回 int(reset_ts - now_ts)（绝对时间戳相减）；都没有则返回 default。任何情况下结果为负数时返回 0。
func: wait_seconds
starter: |
  def wait_seconds(retry_after=None, reset_ts=None, now_ts=None, default=60):
      # 提示：按优先级判断，最后统一把负数归零
      return 0
cases: |
  30 -> 30
  30, 2000 -> 30
  None, 2000, 1900 -> 100
  None, 1900, 2000 -> 0
  None, None, None -> 60
  None, 2000, None -> 60
hint: `if retry_after is not None: wait = int(retry_after)`；`elif reset_ts is not None and now_ts is not None: wait = int(reset_ts - now_ts)`；`else: wait = default`；`return max(0, wait)`
explain: 优先级来自"谁更权威"：服务器明确说等 30 秒（Retry-After）就听它的，比自己算更准。绝对时间戳相减要两个值都在——只有 reset 没有 now 时算不出时长，只能退回 default。最后 max(0, ...) 是因为"重置时间已过"不该返回负数，time.sleep 遇到负数会抛 ValueError
```

```quiz
type: function
q: 估算并发需要多少批。写一个函数 batch_count(n_requests, workers)，返回需要多少批（向上取整）。规则：workers 必须为正整数，否则返回 n_requests（退化为每批一个）；n_requests 小于等于 0 时返回 0。
func: batch_count
starter: |
  def batch_count(n_requests, workers):
      # 提示：workers 非法时退化，n 为 0 时返回 0，否则向上取整
      return 0
cases: |
  100, 10 -> 10
  95, 10 -> 10
  5, 10 -> 1
  0, 10 -> 0
  100, 0 -> 100
  7, 2 -> 4
hint: `if n_requests <= 0: return 0`；`if not isinstance(workers, int) or workers <= 0: return n_requests`；`import math`；`return math.ceil(n_requests / workers)`
explain: n 个请求、w 个并发需要 ceil(n/w) 批。95 个请求 10 并发仍是 10 批（最后一批只有 5 个）——这就是并发"收益递减"的数学来源：从 1 到 10 并发省 90%，但从 100 加到 200 并发在总量不大时几乎没区别，却多了一倍的风险
```
