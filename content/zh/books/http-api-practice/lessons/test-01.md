# 第 1 章测验 · HTTP 的前世今生

> 共 8 题，覆盖 01-05 课。全部答对才算掌握这一章。
> 建议先自己答一遍，错了的地方回到对应课文再看一遍——历史部分看一遍容易忘，但这些概念后面会反复用到。

```quiz
type: choice
q: 1969 年 10 月 29 日人类第一次计算机网络传输，实际送过去了几个字母？
options:
- 五个（LOGIN 全部成功）
- 两个（LO，然后系统崩溃）
- 零个（完全没连上）
- 一个（只有 L）
answer: 1
explain: Charley Kline 打算打 LOGIN，打到第三个字母 G 时系统崩溃，实际只送到了 LO
```

```quiz
type: choice
q: 分组交换相比电路交换，最关键的差别是什么？
options:
- 分组交换速度更快
- 分组交换不建立独占线路，每个包独立选路，节点失效时能自动绕开
- 分组交换只能传文字
- 分组交换需要中央交换机调度
answer: 1
explain: 核心是"没有独占线路、没有中心节点"。这正是它最初的设计目的：在被打击的情况下仍能通信
```

```quiz
type: choice
q: 1993 年 4 月 30 日 CERN 做了一个什么决定，被认为是万维网战胜同期商业网络的关键？
options:
- 申请专利并收取授权费
- 宣布技术进入公共领域，任何人可免费使用
- 只向欧洲科研机构免费开放
- 把技术卖给了美国公司
answer: 1
explain: 无偿开放让任何人都能自由写浏览器、架服务器、做网站。对比同期的 AOL、Minitel 等围墙花园，这是 Web 爆炸式增长的根本原因
```

```quiz
type: choice
q: ENQUIRE（1980）和万维网的链接有一个关键差别，是什么？
options:
- ENQUIRE 的链接是双向的（两端都能看到关联），Web 的是单向的
- ENQUIRE 的链接只能指向文字
- ENQUIRE 的链接需要付费
- ENQUIRE 的链接会自动过期
answer: 0
explain: 双向链接要求两端在同一系统内统一管理，万维网是分布式的，无法强制别人的服务器维护反向链接。这是"分布式"必须付出的代价，Berners-Lee 本人后来对此表示遗憾
```

```quiz
type: choice
q: 为什么 HTTP/1.1 把 Host 头定为必需？
options:
- 为了标识客户端操作系统
- 为了让一台服务器（一个 IP）能托管多个不同域名的网站
- 为了加密请求内容
- 为了告诉服务器客户端支持哪些压缩格式
answer: 1
explain: 虚拟主机普及后，一个 IP 上跑几十个站点，服务器必须靠 Host 头判断你要访问哪个。规范要求：缺 Host 头的 HTTP/1.1 请求应返回 400
```

```quiz
type: choice
q: HTTP/2 用多路复用解决了应用层的队头阻塞，但为什么在高丢包网络下有时反而比 HTTP/1.1 更慢？
options:
- 头部压缩在丢包时失效
- 所有流共用一条 TCP 连接，TCP 要求按序交付，一个包丢失会让所有流都等重传
- HTTP/2 不支持并发
- HTTP/2 强制加密拖慢了速度
answer: 1
explain: HTTP/1.1 有 6-8 条连接，一条卡住其他还能走；HTTP/2 把所有流塞进一条 TCP 连接，一个丢包卡住全部。这是 HTTP/3 必须换掉 TCP 的根本原因
```

```quiz
type: function
q: HTTP/2 把数据切成帧传输。写一个函数 frames_needed(total, size)，计算 total 字节的数据按每帧 size 字节切分需要几帧（最后一帧没装满也算一帧）。total 为 0 时返回 0。
func: frames_needed
starter: |
  def frames_needed(total, size):
      # 提示：向上取整；0 要单独处理
      return 0
cases: |
  100, 10 -> 10
  105, 10 -> 11
  0, 10 -> 0
  16384, 16384 -> 1
hint: (total + size - 1) // size 是向上取整，但要先判断 total 是否为 0
explain: 和 01 课分组交换那个练习是同一个数学问题。协议分层里到处都是"切成固定大小的块"：TCP 分段、IP 分包、HTTP/2 分帧
```

```quiz
type: function
q: 浏览器在不写端口时用默认端口。写一个函数 default_port(scheme)：http → 80，https → 443，ftp → 21，其他返回 None。协议名可能大写，要先转小写。
func: default_port
starter: |
  def default_port(scheme):
      # 提示：先 lower()，再用字典 get
      return None
cases: |
  "http" -> 80
  "https" -> 443
  "HTTP" -> 80
  "ftp" -> 21
  "mysql" -> None
hint: 用 {"http":80,"https":443,"ftp":21}.get(scheme.lower())，字典 get 找不到时默认返回 None
explain: 这正是浏览器的行为：不写端口就按协议补默认值。端口 80 是 IANA 分配的，没有特殊含义，只是恰好被选中后就再也不能改了
```
