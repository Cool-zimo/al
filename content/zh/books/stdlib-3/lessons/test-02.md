# 第 2 章 · 正则进阶 · 大测验

> 8 道题。这一章解决的是"正则怎么写得更好、更快、更合适"——编译与标志、实战模式、性能、边界、以及最终落地的日志解析器。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 哪个模式最可能引发灾难性回溯？
options:
- r'^(\w+)$'
- r'^(a+)+b$'
- r'^https?://\w+$'
- r'^\d{4}-\d{2}-\d{2}$'
answer: 1
explain: (a+)+ 是内层量词包外层量词，遇到"几乎匹配"的输入会指数级回溯。其余三个都没有嵌套量词，线性扫描。
```

```quiz
type: choice
q: 要从一段网页 HTML 里提取所有图片的 src 地址，最正确的做法是？
options:
- 用 re.findall(r'src="(.*?)"', html)
- 用 html.parser 或 BeautifulSoup 解析后取 src 属性
- 用 str.split('src=') 手工切
- 用 json.loads 解析
answer: 1
explain: HTML 有嵌套结构，属性顺序、引号、换行都可能变化，正则无法稳定处理。专门解析器会先建成 DOM 树再取值，最稳健。json.loads 用于 JSON，与 HTML 无关。
```

```quiz
type: choice
q: 关于 re.compile 和标志位，以下说法正确的是？
options:
- re.compile 后的对象不能再传 flags
- IGNORECASE 让 . 匹配换行符
- MULTILINE 让 ^ 和 $ 匹配每一行的行首行尾
- DOTALL 让 \d 匹配所有字符
answer: 2
explain: MULTILINE（re.M）让 ^ $ 逐行生效。IGNORECASE 管大小写；DOTALL 管点号匹配换行；compile 后仍可在调用方法时传 flags，或编译时一并传入。
```

```quiz
type: choice
q: 正则邮箱验证的正确态度是？
options:
- 写一个覆盖 RFC 所有规则的完美正则
- 正则只验证格式，真实性靠发验证邮件等业务手段
- 正则可以验证邮箱是否真实存在
- 邮箱不需要验证，直接存库
answer: 1
explain: 正则只能验证"格式像不像"，无法确认邮箱真实存在。追求完美正则会越来越难维护，且总有边界情况。真实存在性必须靠业务手段（发验证邮件、查 MX 记录）。
```

```quiz
type: choice
q: 用正则解析日志时，遇到不符合格式的行（如堆栈、空行）应该怎么处理？
options:
- 抛异常终止解析
- 用 try-except 捕获后忽略整段
- 用 if m 判断，匹配不上就跳过
- 把整行当成消息拼到上一条记录里
answer: 2
explain: 真实日志必然混杂格式不符的行。if m 判空后跳过是最稳健、最通用的做法。抛异常会让解析器遇到脏数据就崩；无脑拼接堆栈会污染消息内容。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 extract_dates，接收一个字符串，提取其中所有 "YYYY-MM-DD" 或 "YYYY/MM/DD" 格式的日期，返回日期字符串列表。
func: extract_dates
starter: |
  import re

  def extract_dates(text):
      return []
cases: |
  "今天2026-09-28明天2026/10/01" -> ["2026-09-28", "2026/10/01"]
  "无日期信息" -> []
  "日期1999-12-31和2000-01-01" -> ["1999-12-31", "2000-01-01"]
hint: 模式用 r'\d{4}[-/]\d{1,2}[-/]\d{1,2}'，直接 findall。
explain: 用 findall 一次扫出所有符合分隔符格式的日期串，是日志清洗的高频动作。
```

```quiz
type: function
q: 写一个函数 count_levels，接收一个多行日志字符串（每行格式 "日期 时间 级别 消息"），返回一个字典统计每个级别出现次数。不匹配的行忽略。
func: count_levels
starter: |
  import re
  from collections import Counter

  def count_levels(log_text):
      return {}
cases: |
  "2026-09-28 10:00:00 INFO a\n2026-09-28 10:01:00 ERROR b\n2026-09-28 10:02:00 INFO c" -> {"INFO": 2, "ERROR": 1}
  "" -> {}
  "这不是日志\n也是\n2026-09-28 10:00:00 WARN 磁盘满" -> {"WARN": 1}
hint: 编译命名分组正则，逐行 match，把 level 收集进列表，最后 Counter(levels)。
explain: 这是本章全部内容的浓缩：正则拆字段 + Counter 统计，真实且常用。
```

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"多格式日志分析器"。要求：能解析两种格式的日志行——格式 A 为 "YYYY-MM-DD HH:MM:SS LEVEL 消息"，格式 B 为 "LEVEL | YYYY/MM/DD | 消息"（注意分隔符和字段顺序不同）。把解析结果统一成 [{"date":..., "time":..., "level":..., "msg":...}] 的列表；统计每个级别的数量；额外挑出所有消息里含"失败"或"异常"字样的行。最后打印统计和告警列表。
checklist:
- 能识别并解析至少两种不同格式的日志行
- 解析结果统一成同一种字典结构
- 用 Counter 统计各级别数量
- 能筛选出消息含"失败"或"异常"的告警行
- 对不符合任何格式的行做容错（跳过或标记），不崩溃
- 有至少 5 行混合格式的测试日志
```