# 第 2 章章测 · 时间进阶

> 10 道题，覆盖 naive vs aware 与不能比较、zoneinfo、perf_counter vs time.time 计时、当月最后一天与 calendar、多格式解析、倒计时工具。

## 第一部分 · 选择题

```quiz
type: choice
q: 以下关于 naive datetime 和 aware datetime 的说法，正确的是？
code: |
  a. naive datetime 和 aware datetime 可以直接比较大小
  b. naive datetime 没有 tzinfo，aware datetime 有 tzinfo
  c. aware datetime 不能调用 astimezone()
  d. 两个不同时区的 aware datetime 不能比较
options:
- a
- b
- c
- d
answer: 1
explain: naive = 无 tzinfo，aware = 有 tzinfo。Python 不允许直接比较 naive 和 aware（会抛 TypeError），但两个不同时区的 aware datetime 是可以比较的（会自动转换）。
```

```quiz
type: choice
q: 用什么方法获取高精度计时（用于测量代码执行耗时）最合适？
code: |
  a. time.time()
  b. time.sleep()
  c. time.perf_counter()
  d. datetime.now()
options:
- a
- b
- c
- d
answer: 2
explain: time.perf_counter() 提供最高精度的单调计时器，适合测量短时间间隔。time.time() 受系统时钟调整影响（如 NTP 校时），不适合精确计时。
```

```quiz
type: choice
q: 以下代码的输出是什么？
code: |
  import calendar
  print(calendar.monthrange(2024, 2)[1])
options:
- a. 28
- b. 29
- c. 30
- d. 会报错
answer: 1
explain: 2024 年是闰年，2 月有 29 天。monthrange(year, month) 返回 (周几开始, 天数)，[1] 是天数。
```

```quiz
type: choice
q: 使用 zoneinfo 时，以下哪个写法正确？（假设 Python 3.9+）
code: |
  a. from zoneinfo import ZoneInfo; tz = ZoneInfo("Asia/Shanghai")
  b. import zoneinfo; tz = zoneinfo("Asia/Shanghai")
  c. from zoneinfo import get_tz; tz = get_tz("Asia/Shanghai")
  d. import ZoneInfo from zoneinfo
options:
- a
- b
- c
- d
answer: 0
explain: 正确导入方式是 from zoneinfo import ZoneInfo，然后用 ZoneInfo("Asia/Shanghai") 创建时区对象。
```

```quiz
type: choice
q: 要把一个 naive datetime 变成北京时间（UTC+8）的 aware datetime，正确的写法是？
code: |
  a. dt.replace(tzinfo=timezone(timedelta(hours=8)))
  b. dt.astimezone(timezone(timedelta(hours=8)))
  c. dt.localize(timezone(timedelta(hours=8)))
  d. 以上都不对
options:
- a
- b
- c
- d
answer: 0
explain: 对于 naive datetime，用 replace(tzinfo=...) 添加时区信息。astimezone() 是转换已有 tzinfo 的 datetime 到目标时区，对 naive 调用 astimezone 会假定本地时区。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 last_day_of_month，接收年份和月份（两个整数），返回该月最后一天是几号。用 calendar.monthrange 实现。
func: last_day_of_month
starter: |
  import calendar

  def last_day_of_month(year, month):
      return 0
cases: |
  2024,2 -> 29
  2023,2 -> 28
  2024,12 -> 31
  2024,4 -> 30
hint: calendar.monthrange(year, month) 返回 (_, days)，取 [1]。
explain: monthrange 的第二项就是该月天数，自动处理闰年和各月天数差异。
```

```quiz
type: code
q: 写一个函数 measure_time，接收一个函数对象和参数列表，用 time.perf_counter() 测量该函数执行耗时（秒），返回耗时浮点数。提示：调用 func(*args) 后返回时间差。
starter: |
  import time

  def measure_time(func, *args):
      return 0.0
tests:
- assert isinstance(measure_time(lambda: sum(range(100))), float)
- assert measure_time(lambda x: x*2, 5) >= 0
hint: start = perf_counter(); func(*args); return perf_counter() - start
explain: perf_counter 返回单调时钟值，两次调用之差即为耗时。
```

## 第三部分 · 小项目

```quiz
type: function
q: 实现一个"智能时间解析"函数 smart_parse，接收一个时间字符串，尝试按多种格式解析，返回 datetime 对象。支持的格式列表：["%Y-%m-%d %H:%M:%S", "%Y/%m/%d", "%d-%m-%Y", "%Y%m%d"]。按顺序尝试，第一个成功的格式返回结果；全部失败则抛出 ValueError。
func: smart_parse
starter: |
  from datetime import datetime

  def smart_parse(time_str):
      formats = ["%Y-%m-%d %H:%M:%S", "%Y/%m/%d", "%d-%m-%Y", "%Y%m%d"]
      return None
cases: |
  "2024-05-30 10:00:00" -> datetime(2024, 5, 30, 10, 0, 0)
  "2024/05/30" -> datetime(2024, 5, 30)
  "30-05-2024" -> datetime(2024, 5, 30)
  "20240530" -> datetime(2024, 5, 30)
hint: 用 for fmt in formats: try: return datetime.strptime(s, fmt); except ValueError: continue
explain: 依次尝试每种格式，成功即返回，全部失败抛异常。
```
