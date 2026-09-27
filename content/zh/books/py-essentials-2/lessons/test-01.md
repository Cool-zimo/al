# 第 1 章 · 基础巩固 · 大测验

> 8 道题。这一章解决的是"把基础语法真正用对"的问题——变量与类型、输入输出、运算与字符串、报错阅读、综合应用。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 运行下面代码会输出什么？
code: |
  a = 3
  b = a
  a = a + 1
  print(a, b)
options:
- "4 4"
- "4 3"
- "3 4"
- 报错
answer: 1
explain: b = a 执行时 a 是 3，b 拿到的是值 3，不是和 a 绑定。之后 a 变成 4，b 不变。所以 a=4、b=3。这是"赋值是复制值，不是建立联系"。
```

```quiz
type: choice
q: 关于 Traceback，下列说法正确的是？
options:
- 应该从第一行往下读，第一行就是出错位置
- 最下面一行是错误类型和原因，箭头处指出出错的代码
- SyntaxError 也会打印完整的调用栈
- IndexError 和 ValueError 是一个意思
answer: 1
explain: Traceback 要"从下往上"读，最后一行是错误类型+原因，箭头指到出错的代码。SyntaxError 在语法检查阶段就被拦下，没有调用栈。IndexError 是下标越界，ValueError 是值的内容不合法（如 int("abc")），完全不同。
```

```quiz
type: choice
q: 下面哪个表达式的结果是 1？
code: |
  A: 17 % 4
  B: -17 % 4
  C: 17 // 4
options:
- 只有 A
- A 和 B 都是
- 只有 C
- B 和 C 都是
answer: 0
explain: 17 % 4 = 1（17 = 4×4 + 1）。-17 % 4 在 Python 里是 3：-17 // 4 = -5，-17 = -5×4 + 3。17 // 4 = 4。四个里只有 A 结果是 1。
```

```quiz
type: choice
q: 运行下面代码会报什么错？
code: |
  x = "123"
  y = x + 4
  print(y)
options:
- SyntaxError
- NameError
- TypeError
- ValueError
answer: 2
explain: x 是字符串 "123"，4 是整数。Python 不允许字符串和整数相加，报 TypeError: can only concatenate str to str。不是 ValueError——后者是"值的内容没法转换"，如 int("abc")。
```

```quiz
type: choice
q: 运行下面代码会报什么错？
code: |
  a, b = input().split()
  print(a * b)
  # 用户输入：3 4
options:
- SyntaxError
- NameError
- TypeError
- 输出 12
answer: 2
explain: input().split() 返回 ['3','4']，所以 a='3'、b='4'，都是字符串。字符串只能和整数做乘法，'3' * '4' 报 TypeError: can't multiply sequence by non-int。只有先用 map(int, ...) 转换，结果才是 12。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写 hide_middle(s)，把字符串中间部分替换成星号，只保留首尾各一个字符。若长度小于等于 2，原样返回。例如 "python" 返回 "p****n"，"ab" 返回 "ab"
func: hide_middle
starter: |
  def hide_middle(s):
      # 长度 <= 2 直接返回；否则 s[0] + '*'*(len-2) + s[-1]
      return s
cases: |
  "python" -> "p****n"
  "北京上海" -> "北**海"
  "ab" -> "ab"
  "a" -> "a"
  "hello world" -> "h*********d"
hint: 中间那段长度是 len(s)-2。s[-1] 取最后一个字符，避免写 len(s)-1 这种易错下标。
explain: 这题综合了 len()、乘法重复和正负索引。长度 <= 2 时要单独处理，否则中间段长度会 <= 0；不过本题中 len>=2 时 len-2>=0，len=1 仍需分支。
```

```quiz
type: function
q: 写 safe_divide(a, b)，返回 a / b 的结果（四舍五入保留两位小数）。若 b 为 0，返回字符串 "除数不能为0"
func: safe_divide
starter: |
  def safe_divide(a, b):
      # 先判断 b 是否为 0，否则做除法并 round(..., 2)
      return 0
cases: |
  (10, 3) -> 3.33
  (7, 2) -> 3.5
  (5, 0) -> "除数不能为0"
hint: if b == 0 提前处理，否则 return round(a / b, 2)。
explain: 这是"防御性编程"的基本功：先把不合法情况拦下来，再处理正常逻辑。若反例不判断直接除，b=0 时会抛异常而非返回提示字符串。
```

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"成绩小票"程序：读入学生姓名和三门课成绩（一行输入，用空格分隔），然后打印一张小票，格式如下（张三的例子）：「姓名：张三｜总分：270｜平均：90.0｜等级：优秀」。等级规则：平均 >=90 优秀，>=60 及格，否则不及格。平均分保留一位小数
starter: |
  name = input()
  # 用 map(int, input().split()) 读入三门成绩
  # 算 total、avg，按规则定 level，用 f-string 打印
  print("在这里改")
hint: 三步拆开写：读入（map+split）→ 计算（total、avg、level）→ 输出（f-string）。等级判定用 if-elif-else，先判高的。
checklist:
- 用 map(int, input().split()) 正确读入三个整数成绩
- 总分、平均分计算正确
- 平均分用 round 保留一位小数
- 等级按 >=90 / >=60 两档判定，边界值（正好 90、正好 60）归属正确
- 用 f-string 一次性输出，没有字符串拼接的 TypeError
```
