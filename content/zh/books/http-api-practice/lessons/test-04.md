# 第 4 章测验 · 把数据送出去

> 共 10 题，覆盖 16-20 课。这一章讲怎么把数据发出去、以及怎么安全地把它取回来。

```quiz
type: choice
q: 关于 json= 和 data= 传同一个字典，下列说法正确的是？
options:
- 完全一样
- json= 转成 JSON 字符串并设 application/json；data= 转成 k=v&k=v 表单并设 x-www-form-urlencoded
- data= 更安全
- json= 只能用于 GET
answer: 1
explain: 同一个字典会产生完全不同的请求体，服务器按 Content-Type 走不同解析路径。用 httpbin.org/post 能看到：json= 时 form 是空的，data= 时 json 是 None
```

```quiz
type: choice
q: 用 data='{"name": "张三"}' 传 JSON 字符串会怎样？
options:
- requests 自动识别并设 Content-Type
- requests 原样发送且不设 Content-Type，服务器不知道这是 JSON，可能解析失败
- 会报错
- 自动转成表单
answer: 1
explain: data= 收到字符串时不做转换也不加 Content-Type。有些服务器会猜（时好时坏），有些直接拒绝。用 json= 或手动加 Content-Type: application/json
```

```quiz
type: choice
q: 关于 multipart/form-data 的 boundary，下列说法正确的是？
options:
- 可选装饰
- 必须的分隔符参数，用 files= 时 requests 自动生成；手动设 Content-Type 容易漏掉它导致解析失败
- 表示文件大小
- 只在 GET 中用
answer: 1
explain: multipart 靠 boundary 分段，Content-Type 必须是 multipart/form-data; boundary=xxx。手动设的值通常不带 boundary，服务器无法切分
```

```quiz
type: choice
q: OAuth2 换取 token 的接口通常要求什么格式？
options:
- JSON（json=）
- 表单（data=），即使响应是 JSON（用 Accept: application/json 指定）
- multipart
- text/plain
answer: 1
explain: RFC 6749 规定 token 接口用 application/x-www-form-urlencoded，所以要用 data=。但响应格式由 Accept 决定，写 Accept: application/json 完全正常——Content-Type 和 Accept 各管各的
```

```quiz
type: choice
q: 用 json={"name": "张三"} 发请求，看到请求体是 {"name": "\u5f20\u4e09"}。正确的是？
options:
- 乱码了，要修
- 这是 json.dumps 默认 ensure_ascii=True 产生的合法 JSON 转义，解析器会还原
- Content-Type 设错了
- 服务器无法处理
answer: 1
explain: JSON 用 ASCII 转义表示非 ASCII 字符，合法且推荐——内容全是 ASCII 就绕开了所有字符集争议。标准解析器会还原成原文
```

```quiz
type: choice
q: 你 POST 带 JSON 的请求，对方把 http 重定向到 https。会发生什么？
options:
- 请求体完整保留
- 301/302 会把 POST 降级成 GET，请求体丢失，且不报错
- requests 会报错
- 自动重试
answer: 1
explain: 早期浏览器为避免刷新导致重复提交订单，把 301/302 的 POST 改成了 GET，成了事实标准。请求体丢失且不报错——服务器可能创建空记录。最省事的解决方法是 API 地址直接写 https
```

```quiz
type: choice
q: 关于 r.history，下列说法正确的是？
options:
- 包含完整链条，包括最终响应
- 只含中间 3xx 响应，最终响应是 r 本身；完整链条是 r.history + [r]
- 里面的响应都有完整正文
- 只有关闭重定向时才有值
answer: 1
explain: r 本身就是最终响应，不在 history 里。另外 3xx 响应通常没有正文，别指望从 history 读内容——只看 status_code 和 url
```

```quiz
type: choice
q: 关于"归一化"，下列说法正确的是？
options:
- 把所有数据转成字符串
- 在数据进入你的代码时统一成一种形状（如单值和列表都转成列表），之后内部只处理一种情况
- 把数字都转成整数
- 删除所有空值
answer: 1
explain: API 常对同一字段有时给单值有时给数组。在边界处统一成列表后，后续逻辑大幅简化。关键陷阱：字符串必须包成 ["python"] 而不是拆成字符列表
```

```quiz
type: function
q: 写一个函数 build_auth(scheme, token)，生成认证头的**值**（不是字典）。规则：scheme 和 token 都非空时返回 "scheme token"（中间一个空格）；任一为空返回 ""。scheme 默认 "Bearer"。两者都转成字符串。
func: build_auth
starter: |
  def build_auth(scheme, token):
      # 提示：默认值处理、转字符串、空值检查、拼接
      return ""
cases: |
  "Bearer", "abc" -> "Bearer abc"
  "Token", "xyz" -> "Token xyz"
  "Bearer", "" -> ""
  None, "abc" -> ""
  "Bearer", None -> ""
hint: 先 `s = str(scheme) if scheme is not None else "Bearer"`；`if token is None: return ""`；`t = str(token)`；`if not s or not t: return ""`；`return f"{s} {t}"`
explain: 认证头的格式是 "Bearer <token>"，中间必须有空格——漏了会 401 且极难排查。空值检查很重要：token 为空时生成 "Bearer " 这样的头等于告诉服务器"我有认证但凭证是空的"，行为不可预测
```

```quiz
type: function
q: 处理分页时经常要判断是否还有下一页。写一个函数 has_next_page(current_page, total_pages)，判断是否还有下一页。规则：两个参数都必须是正整数，否则返回 False；current_page < total_pages 时返回 True，否则 False。
func: has_next_page
starter: |
  def has_next_page(current_page, total_pages):
      # 提示：先校验两个参数都是正整数，再比较
      return False
cases: |
  1, 5 -> True
  5, 5 -> False
  6, 5 -> False
  0, 5 -> False
  1, 0 -> False
  -1, 5 -> False
hint: 用 `if not all(isinstance(x, int) and x > 0 for x in (current_page, total_pages)): return False`；然后 `return current_page < total_pages`
explain: 这是分页循环的终止条件。参数校验很关键——total_pages 为 0 或负数说明 API 返回了异常数据，这时候应该停止而不是继续请求。注意用 isinstance 检查类型，因为 API 返回的分页信息可能是字符串
```
