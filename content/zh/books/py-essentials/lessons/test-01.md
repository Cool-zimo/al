# 第 1 章 · 先让程序跑起来 · 大测验

> 8 道题。这一章回答的是：环境怎么装、第一个数据怎么存、怎么让程序说话、怎么做运算、报错信息怎么读。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 安装 Python 时，最容易漏勾、导致终端提示「命令找不到」的是哪一项？
options:
- Add Python to PATH（把 Python 加入环境变量）
- Install launcher（安装启动器）
- Customize installation（自定义安装）
- Set the install path（设置安装路径）
answer: 0
explain: Add Python to PATH 会把 Python 注册到系统的 PATH 里。不勾它，终端就找不到 python 这个命令。另外三项都不影响基本使用。
```

```quiz
type: choice
q: 下面哪个变量名在 Python 里是合法的？
options:
- 2score
- user-name
- score_2
- class
answer: 2
explain: score_2 只含字母、数字、下划线，且不以数字开头，所以合法。2score 以数字开头，user-name 含连字符（会被当成减号），class 是 Python 的关键字。
```

```quiz
type: choice
q: 用户输入「25」之后，下面这段代码能正确算出「明年 26 岁」吗？
code: |
  age = input("年龄：")
  print(age + 1)
options:
- 能 —— input 返回的就是数字
- 不能 —— input 返回的是字符串，必须先用 int() 转换
- 不能 —— Python 不支持字符串和数字相加
- 能 —— 因为 25 本来就是数字
answer: 1
explain: input 永远返回字符串，所以 "25" + 1 会抛 TypeError。必须用 int(age)（或直接 int(input(...))）先转成整数。
```

```quiz
type: choice
q: 下面哪个表达式的结果是 4？
options:
- -2 ** 2
- (-2) ** 2
- 10 // 3
- 10 % 3
answer: 1
explain: (-2) ** 2 = 4。而 -2 ** 2 会被解析成 -(2 ** 2) = -4（** 的优先级高于一元负号）；10 // 3 = 3；10 % 3 = 1。
```

```quiz
type: choice
q: 运行下面这段代码会发生什么？
code: |
  print("你好" + 18)
options:
- 打印「你好18」
- 打印「你好 18」
- 抛 TypeError
- 抛 SyntaxError
answer: 2
explain: 字符串和整数不能拼接，这是类型不匹配，抛 TypeError。SyntaxError 用于语法写错了，不是运行时的类型错误。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 introduce(name, age)，返回「你好，我叫 XXX，今年 X 岁」
func: introduce
starter: |
  def introduce(name, age):
      return ""
cases: |
  "张三", 18 -> "你好，我叫张三，今年18岁"
  "李四", 25 -> "你好，我叫李四，今年25岁"
  "王五", 8 -> "你好，我叫王五，今年8岁"
hint: 用 f-string 最清爽：return f"你好，我叫{name}，今年{age}岁"
explain: 用 f-string 把变量嵌进字符串，比用 + 拼接干净得多，这是你以后天天要用的写法。注意 age 是整数，f-string 会自动帮你转成字符串，不用手动 str()。
```

```quiz
type: function
q: 写一个函数 format_time(total_seconds)，把秒数转成形如「X小时Y分Z秒」的字符串。例如 3725 → 「1小时2分5秒」
func: format_time
starter: |
  def format_time(total_seconds):
      return ""
cases: |
  3725 -> "1小时2分5秒"
  60 -> "0小时1分0秒"
  3661 -> "1小时1分1秒"
  125 -> "0小时2分5秒"
hint: 小时 = total_seconds // 3600；剩下的部分再 // 60 得分钟；最后 % 60 得秒。
explain: 反复用 // 和 % 拆单位是基本功：秒转时分秒就是「三次整除取余」。先 //3600 拿小时，再用余数 //60 拿分钟，最后 %60 拿秒。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「小费计算器」：程序读入账单金额和小费百分比，算出小费和总价，打印一张清楚的小票。如果用户输入的不是数字，程序要友好提示而不是崩溃。
checklist:
- 用 float(input(...)) 读入账单金额和小费百分比
- 小费 = 金额 × 百分比 ÷ 100，总价 = 金额 + 小费
- 打印金额、小费、总价三项，都保留两位小数
- 用 f-string 让输出像一张像样的小票
- 输入不是数字时友好提示，不能直接崩掉
- 代码要能真的跑起来并正常结束
starter: |
  bill = 0.0
  percent = 0.0

  # 读入金额和百分比，算出小费与总价
  # 打印一张清楚的小票
```
