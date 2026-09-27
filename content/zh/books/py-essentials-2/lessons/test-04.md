# 第 4 章章测

> 这一章测覆盖《巩固篇》第 16 课（函数定义与返回值）、第 17 课（参数与解包）、第 18 课（作用域与修改）、第 19 课（字符串方法）、第 20 课（文件读写）。
> 共 8 题：第一部分 5 道选择题，第二部分 2 道动手题，第三部分 1 个小项目。满分 100，60 分及格。

---

## 第一部分 · 选择题

```quiz
type: choice
q: 1.（函数）下面这段代码的输出是什么？
code: |
  def add(a, b):
      return a + b

  print(add(2, 3))
  print(add("2", "3"))
options:
- "5 和 5"
- "5 和 23"
- "5 和 '23'"
- "TypeError"
answer: 2
explain: 同一个函数 add 因为参数类型不同而表现不同：整数相加得 5，字符串拼接得 "23"。这正是 Python 多态（鸭子类型）的体现。返回值是字符串 "23"，不是数字 23，所以选"5 和 '23'"。
```

```quiz
type: choice
q: 2.（参数）执行 `f(1, 2, 3, a=4)` 时，函数签名必须是哪一个才合法？
code: |
  def f(...):
      pass
options:
- "def f(a, b, c, d)"
- "def f(*args, **kwargs)"
- "def f(a, b, c, d, e=5)"
- "以上 B 和 C 都合法"
answer: 3
explain: 位置参数 1,2,3 需要至少三个形参接住，关键字参数 a=4 要求形参里有 a（或 **kwargs 兜住）。B 的 *args 接住 1,2,3，但 a=4 会被 **kwargs 接住，合法；C 的 a,b,c 接住 1,2,3，d 接住 4，e 用默认值 5，也合法。A 里 a 被位置 1 占用了，a=4 重复赋值会 TypeError。
```

```quiz
type: choice
q: 3.（作用域）下面这段代码的输出是什么？
code: |
  x = 10
  def func():
      x = 20
      print(x)
  func()
  print(x)
options:
- "20 和 20"
- "20 和 10"
- "10 和 20"
- "报错"
answer: 1
explain: 函数内的 x = 20 创建的是**局部变量 x**，不会修改全局的 x。所以 func() 打印局部的 20，外面的 print(x) 打印全局的 10。要修改全局变量必须写 global x。这是作用域最常考的陷阱。
```

```quiz
type: choice
q: 4.（字符串方法）`"  a  b  c  ".split()` 的结果是？
options:
- "['  a', ' b', ' c  ']"
- "['a', 'b', 'c']"
- "['', 'a', '', 'b', '', 'c', '']"
- "报错"
answer: 1
explain: split() 不传参数时按任意空白切分，并自动合并连续空白，同时会丢掉首尾空白。所以无论中间有几个空格，结果都是干净的 ['a','b','c']。如果想保留空位，需要显式 split(' ')。
```

```quiz
type: choice
q: 5.（文件读写）下面哪段代码会在文件已存在时**清空**原有内容？
code: |
  A. open("report.txt", "r")
  B. open("report.txt", "w")
  C. open("report.txt", "a")
  D. open("report.txt", "x")
options:
- "只有 B"
- "B 和 D"
- "A 和 C"
- "B、C、D 都会"
answer: 0
explain: w 模式会在打开时把文件截断为 0 字节，原有内容丢失。a 是追加、r 是只读、x 只在文件不存在时创建（已存在会 FileExistsError），都不会清空。这是文件操作最危险的一个模式。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 6. 写函数 word_count(text)：统计一段英文文本里**单词**的个数。单词定义为由连续字母（大小写均可）组成的序列，其他字符都视为分隔符。提示：可以用 split() 不传参数的特性，或者用遍历。例如 word_count("Hello, world! 你好 Python3") 返回 3（Hello、world、你好 是单词，Python3 含数字不算）。只处理字符串，不做文件 I/O。
func: word_count
starter: |
  def word_count(text):
      # 用 split() 切分并过滤
      return 0
cases: |
  ("Hello, world! 你好 Python3") -> 3
  ("   a   b   c   ") -> 3
  ("") -> 0
  ("!!!,,,;;;") -> 0
  ("One-Two Three") -> 3
hint: 不传参数的 split() 会按任意空白切分并合并连续空白；再判断每个切出来的片段是否只由字母组成（用 str.isalpha()）。
explain: 先用 split() 拿到按空白切分后的片段列表，再对每个片段用 isalpha() 过滤——isalpha() 只认纯字母（含中文等字母字符），"Python3" 含数字会返回 False。空字符串 split() 得到 ['']，其中 '' 的 isalpha() 是 False，所以空输入返回 0。
```

```quiz
type: function
q: 7. 写函数 merge_reports(reports)：模拟合并多份日志。参数 reports 是字符串列表，每个元素是一份日志的内容（可能含多行，行之间用 \n 分隔）。请把所有日志合并成一份：每份日志之间用一个分隔行 "----------" 隔开，且**合并结果末尾不要有多余的换行**。空列表返回空字符串。不要做真实文件 I/O。
func: merge_reports
starter: |
  def merge_reports(reports):
      # 用分隔行把多份日志拼起来
      return ""
cases: |
  (["err1", "err2\nerr3", "err4"]) -> "err1\n----------\nerr2\nerr3\n----------\nerr4"
  (["only one"]) -> "only one"
  ([]) -> ""
hint: 先把每份日志 strip 掉末尾的换行（如果有），再用 "\n----------\n" 连接。
explain: 关键是处理换行和末尾多余分隔符。用 "\n----------\n".join(reports) 是最干净的做法：join 不会在开头或结尾多加分隔符，所以不存在"末尾多余换行"的问题。单元素列表 join 后原样返回，空列表 join 后返回 ""。
```

---

## 第三部分 · 小项目

```quiz
type: function
q: 8. 小项目：成绩单处理器。写函数 process_scores(raw)，参数 raw 是**内存中模拟的一份成绩单文本**（多行字符串，每行格式为"姓名,分数"，分数可能是整数或小数，行与行之间用 \n 分隔，可能含空行和首尾空白）。请完成：① 解析出所有有效行（去掉空白后非空、且能拆出姓名和分数的行）；② 计算平均分（保留两位小数）；③ 返回格式化结果字符串，格式如下：

第一行为"===== 成绩单统计 ====="（固定）；
第二行为"人数：N"（N 为有效人数）；
第三行为"平均分：XX.XX"；
之后按原顺序逐行输出"姓名：分数"，分数保留一位小数；
末尾一行"=================="。

示例：process_scores("张三,95\n李四,88.5\n\n王五,72\n") 返回：
===== 成绩单统计 =====
人数：3
平均分：85.17
张三：95.0
李四：88.5
王五：72.0
==================

要求：用 round 或 f-string 保留两位小数；分数转 float；空输入返回"===== 成绩单统计 =====\n人数：0\n平均分：0.00\n=================="。全部在内存中处理，不要做真实文件 I/O。
func: process_scores
starter: |
  def process_scores(raw):
      lines = [line.strip() for line in raw.split("\n")]
      records = []
      for line in lines:
          if not line:
              continue
          if "," not in line:
              continue
          name, score = line.split(",", 1)
          name = name.strip()
          try:
              score = float(score.strip())
          except ValueError:
              continue
          records.append((name, score))
      if not records:
          return "===== 成绩单统计 =====\n人数：0\n平均分：0.00\n=================="
      # 计算平均分并格式化输出
      return ""
cases: |
  ("张三,95\n李四,88.5\n\n王五,72\n") -> "===== 成绩单统计 =====\n人数：3\n平均分：85.17\n张三：95.0\n李四：88.5\n王五：72.0\n=================="
  ("") -> "===== 成绩单统计 =====\n人数：0\n平均分：0.00\n=================="
  ("    \n  ,\n张三,100\nabc\n李四,60.75\n") -> "===== 成绩单统计 =====\n人数：2\n平均分：80.38\n张三：100.0\n李四：60.8\n=================="
hint: 平均分 = sum(s for _, s in records) / len(records)，保留两位小数用 f"{avg:.2f}"。输出用 "\n".join 逐行拼起来。
explain: 综合考察了字符串切分（split 不传参数 vs 传 ","）、strip、异常处理、列表推导、以及 f-string 的格式化（:.2f 和 :.1f）。第 7 课的核心是"把字符串当作数据结构来解析"——这里每一行都要拆姓名和分数，还要过滤掉空行和格式错误的行，正好是对 19、20 两课的综合应用。张三 95 + 李四 88.5 + 王五 72 = 255.5，除以 3 得 85.1666...，保留两位是 85.17。
```
