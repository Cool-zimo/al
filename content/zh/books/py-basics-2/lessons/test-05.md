# 第 5 章 · 大测验

> 函数基础这一章学完了：从"为什么要有函数"，到定义调用、`return`、作用域。下面是验收——检验**记得牢不牢**、**会不会用**、**能不能做出东西**。
>
> 不用追求一次全对。**做错的题会在 1 天后自动回到你的复习列表**（艾宾浩斯记忆曲线），到时候再战。

---

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: '`def add(a, b): s = a + b`，调用 `add(3, 5)` 会返回什么？'
options:
- '8'
- 'None'
- '报错'
- '什么都不做'
answer: 1
explain: 函数里算了 s = a + b 但没写 return，Python 规定没有 return 的函数默认返回 None。这是第 5 章最核心的坑。
```

```quiz
type: choice
q: '下面哪个函数定义的参数顺序是正确的？'
options:
- 'def f(a=1, b): pass'
- 'def f(a, b=2): pass'
- 'def f(a=1, b, c=3): pass'
- 'def f(b=2, a, c=3): pass'
answer: 1
explain: 铁律是"位置参数在前、默认参数在后"。只有 B 符合。A、C、D 都把默认参数放在了位置参数前面，会 SyntaxError。
```

```quiz
type: choice
q: '已有全局变量 counter = 0，然后定义下面这个函数，调用 inc() 会怎样？'
code: |
  counter = 0

  def inc():
      counter += 1
options:
- 'counter 变成 1'
- '报错 UnboundLocalError'
- 'counter 变成 None'
- '什么也不做'
answer: 1
explain: inc 里对 counter 有赋值，Python 判定 counter 是局部变量；而 counter += 1 要先读局部变量 counter，此时还没赋值，于是 UnboundLocalError。想改全局变量要写 global。
```

```quiz
type: choice
q: '`def f(): return 1, 2, 3`，`x = f()` 后 `x` 的类型是什么？'
options:
- 'int'
- 'list'
- 'tuple'
- 'dict'
answer: 2
explain: return 1, 2, 3 等价于 return (1, 2, 3)，返回的是一个元组。多返回值只是语法糖，底层是元组解包。
```

```quiz
type: choice
q: 判断函数返回结果是否为 None，正确的写法是？
options:
- 'if x == None:'
- 'if x is None:'
- 'if not x:'
- 'if x == False:'
answer: 1
explain: None 是单例，习惯上用 is None / is not None 判断。而且当返回值可能是 0、空串、空列表这类假值时，if not x 会误判，必须用 is None。
```

---

## 第二部分 · 动手题

光记住概念不够，得能写出来。

```quiz
type: code
q: 写一个函数 `is_adult(age)`，判断年龄是否成年（>=18）：成年返回 True，否则返回 False。然后用它判断 20 和 15 并打印
starter: |
  def is_adult(age):
      # 返回 age >= 18

  print(is_adult(20))
  print(is_adult(15))
tests:
- assert "True" in __out
- assert "False" in __out
hint: 直接 return age >= 18，比较表达式本身就是布尔值。注意是 return 不是 print。
explain: 答案：def is_adult(age): return age >= 18。考的是"把布尔判断直接 return 回去"——最常见的函数用途之一。
```

```quiz
type: function
q: 写一个函数 `calculate(price, quantity, discount=0)`，返回 `price * quantity * (1 - discount)`（保留 2 位小数，用 `round(..., 2)`）。discount 默认为 0
func: calculate
starter: |
  def calculate(price, quantity, discount=0):
      return 0
cases: |
  100, 2, 0.1 -> 180
  50, 3 -> 150
  200, 1, 0.5 -> 100
hint: return round(price * quantity * (1 - discount), 2)。discount 有默认值 0，调用时可省略。
explain: 答案：def calculate(price, quantity, discount=0): return round(price * quantity * (1 - discount), 2)。考的是默认参数 + return 交回结果两个套路。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 用第 5 章学的函数知识，做一个"简易成绩管理器"：写三个函数 `add_score(scores, name, score)`（往字典 scores 里加一条）、`get_average(scores)`（返回所有分数的平均值，四舍五入保留 1 位）、`get_top_student(scores)`（返回分数最高的人的名字）。然后在主流程里：添加张三92、李四78、王五100三条记录，打印平均分和第一名
starter: |
  scores = {}

  def add_score(scores, name, score):
      # 往字典里加一条

  def get_average(scores):
      # 返回 round(平均值, 1)

  def get_top_student(scores):
      # 用 max(scores, key=scores.get) 找最高分的人

  # 主流程：添加三条记录，打印平均分和第一名
checklist:
- 用 add_score 往字典里加记录
- get_average 用 sum/len 计算并 round 保留 1 位
- get_top_student 用 max(..., key=scores.get) 找最高分的人
- 主流程清晰，三个函数各司其职
```
