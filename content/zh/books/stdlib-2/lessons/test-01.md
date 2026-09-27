# 第 1 章章测 · 时间基础

> 10 道题，覆盖为什么时间难处理、date/time/datetime 三兄弟、timedelta 不支持月份、strftime/strptime 占位符与 `%` 转义、timestamp 与 UTC 陷阱。

## 第一部分 · 选择题

```quiz
type: choice
q: 为什么处理时间数据时容易出错？（多选中最根本的原因是）
code: |
  a. 因为 Python 的时间模块有 bug
  b. 因为时区、夏令时、闰年、月份天数不统一等规则复杂
  c. 因为计算机无法存储大整数
  d. 因为 datetime 模块是第三方库
options:
- a
- b
- c
- d
answer: 1
explain: 时间的复杂性来自现实世界：夏令时跳变、闰年 2 月 29 天、时区偏移随时变。Python 的时间模块设计合理，问题不在库本身。
```

```quiz
type: choice
q: 以下哪个对象同时包含日期和时间信息？
code: |
  a. datetime.date
  b. datetime.time
  c. datetime.datetime
  d. 以上都包含
options:
- a
- b
- c
- d
answer: 2
explain: date 只有年/月/日，time 只有时/分/秒/微秒，datetime 同时包含日期和时间。
```

```quiz
type: choice
q: 以下代码的输出是什么？
code: |
  from datetime import timedelta
  d = timedelta(days=1, hours=12)
  print(d.total_seconds())
options:
- a. 86400
- b. 129600
- c. 36
- d. 会报错
answer: 1
explain: 1 天 = 86400 秒，12 小时 = 43200 秒，合计 129600 秒。
```

```quiz
type: choice
q: 关于 strftime 中 `%` 的转义，以下说法正确的是？
code: |
  a. % 不需要转义，直接写就行
  b. 要输出字面量的 %，需要写 %%
  c. % 只能在末尾出现
  d. % 会自动被忽略
options:
- a
- b
- c
- d
answer: 1
explain: strftime 中用 %% 表示一个字面量 %。比如 "完成度：%d%%" 会输出 "完成度：5%"。
```

```quiz
type: choice
q: 关于 UTC 陷阱，以下说法正确的是？
code: |
  a. datetime.now() 永远返回 UTC 时间
  b. datetime.utcnow() 返回的是 naive datetime（无时区信息）
  c. timestamp() 方法只在 UTC 时区有效
  d. fromtimestamp() 总是返回 UTC 时间
options:
- a
- b
- c
- d
answer: 1
explain: datetime.utcnow() 返回的是 naive datetime（没有 tzinfo），容易让人误以为它"带时区"。Python 3.12+ 已弃用 utcnow()，推荐用 datetime.now(timezone.utc)。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 days_between，接收两个日期字符串（格式 "YYYY-MM-DD"），返回它们之间相差的天数（绝对值，整数）。只做纯计算，不碰文件系统。
func: days_between
starter: |
  from datetime import datetime

  def days_between(date_str1, date_str2):
      return 0
cases: |
  "2024-01-01","2024-01-10" -> 9
  "2024-12-31","2024-01-01" -> 365
  "2024-02-28","2024-03-01" -> 2
hint: 用 datetime.strptime(s, "%Y-%m-%d") 解析，两个 date 相减得到 timedelta，取 .days。
explain: strptime 解析后 .date() 取日期部分，相减得 timedelta，.days 是绝对值的正数。
```

```quiz
type: code
q: 写一个函数 format_duration，接收秒数（整数），返回人类可读的时长字符串。规则：如果不足 60 秒返回 "X秒"；不足 3600 秒返回 "X分Y秒"；否则返回 "X小时Y分Z秒"。
starter: |
  def format_duration(seconds):
      return ""
tests:
- assert format_duration(45) == "45秒"
- assert format_duration(125) == "2分5秒"
- assert format_duration(3725) == "1小时2分5秒"
- assert format_duration(3600) == "1小时0分0秒"
hint: 用 // 和 % 依次取出小时、分钟、秒。
explain: hours = s // 3600, remainder = s % 3600, minutes = remainder // 60, secs = remainder % 60。
```

## 第三部分 · 小项目

```quiz
type: function
q: 实现一个简易的"日程倒计时"函数 make_countdown。接收一个事件名称（字符串）和一个目标日期字符串（"YYYY-MM-DD"），返回一个格式化字符串。规则：如果目标日期已过，返回 "{名称} 已过期"；否则返回 "{名称} 还有 N 天"（N 为目标日期与今天的日期差，用 date.today() 获取今天）。
func: make_countdown
starter: |
  from datetime import datetime, date

  def make_countdown(event_name, target_str):
      return ""
cases: |
  "项目截止","2030-01-01" -> "项目截止 还有 N 天"
  "生日","2000-01-01" -> "生日 已过期"
hint: 用 date.today() 和 datetime.strptime(target_str, "%Y-%m-%d").date() 比较。
explain: 目标日期 < 今天则已过期，否则算天数差。
```
