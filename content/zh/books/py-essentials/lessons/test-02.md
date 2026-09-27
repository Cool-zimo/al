# 第 2 章 · 判断与重复 · 大测验

> 8 道题。这一章解决的是"程序怎么自己拿主意、怎么把重复的事做一百遍"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 执行下面代码，会打印什么？
code: |
  x = 7
  if x > 10:
      print("大")
  elif x > 5:
      print("中")
  else:
      print("小")
options:
- 大
- 中
- 小
- 大 中
answer: 1
explain: x=7，第一个条件 x>10 不成立，进入 elif 判断 x>5 成立，于是打印"中"并跳出整个 if 结构，不会再走到 else。
```

```quiz
type: choice
q: 关于 Python 里的"真假规则"，下列哪个说法是对的？
options:
- 只有 True 和 False 才算布尔值，其他类型不能放在 if 后面
- 空列表 []、空字符串 ""、数字 0 在布尔语境下都视为假
- 字符串 "False" 在 if 后面会被当成假
- 列表 [0, 0] 在 if 后面会被当成假，因为它是空列表
answer: 1
explain: Python 里空容器、0、None 都视为假；"False" 是非空字符串所以为真；[0,0] 不是空列表所以也为真。
```

```quiz
type: choice
q: 下面哪段代码会陷入死循环？
code: |
  # A
  i = 0
  while i < 3:
      print(i)
      i += 1
  # B
  i = 0
  while i < 3:
      print(i)
  # C
  while False:
      print("hi")
  # D
  i = 3
  while i > 0:
      i -= 1
options:
- A
- B
- C
- D
answer: 1
explain: B 中 i 始终为 0，条件永远成立。A、D 都有更新变量的语句会正常结束，C 条件一开始就是假根本不进循环。
```

```quiz
type: choice
q: range(2, 10, 3) 产生的整数序列是？
options:
- [2, 5, 8, 11]
- [2, 5, 8]
- [2, 3, 4, 5, 6, 7, 8, 9]
- [5, 8]
answer: 1
explain: range 起点 2，步长 3，终点取不到 10，所以是 2、5、8 三项。11 已经超过终点被排除。
```

```quiz
type: choice
q: 下面代码打印的结果是？
code: |
  i = 0
  while i < 5:
      i += 1
      if i == 3:
          continue
      print(i)
options:
- 1 2 3 4 5
- 1 2 4 5
- 1 2
- 2 3 4 5
answer: 1
explain: i 从 1 递增到 5，遇到 i==3 时 continue 跳过本轮的 print，所以 3 不被打印，输出 1 2 4 5。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数，输入一个整数 n，判断它是"正数"、"负数"还是"零"，返回对应的中文字符串
func: judge_number
starter: |
  def judge_number(n):
      return ""
cases: |
  7 -> "正数"
  -3 -> "负数"
  0 -> "零"
  100 -> "正数"
hint: 先判断 n > 0，再判断 n < 0，剩下就是 0。用 if / elif / else 三段即可。
explain: 多分支判断的入门题，关键在于把"剩下的情况"交给 else，不要写多余的条件。
```

```quiz
type: function
q: 写一个函数，输入一个正整数 n，用 while 循环计算 1 到 n 的累加和并返回
func: sum_to
starter: |
  def sum_to(n):
      return 0
cases: |
  100 -> 5050
  10 -> 55
  1 -> 1
  0 -> 0
hint: total = 0，i 从 1 到 n，每轮 total += i 且 i += 1。注意 n=0 时返回 0。
explain: 累加是最基础的循环应用，也能检验循环三要素（初值、条件、更新）是否齐备。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"猜数字"小游戏：程序随机选一个 1~100 之间的整数，用户反复输入猜测，程序提示"太大""太小"，直到猜中为止，最后告诉用户猜了几次。
checklist:
- 用 random.randint(1, 100) 生成目标数字
- 用 while 循环持续接收用户输入
- 用 if/elif/else 分支给出"太大/太小/猜中"三种提示
- 用一个计数器变量记录猜测次数，猜中时打印出来
- 处理非法输入（比如用户乱敲非数字）不要直接崩溃
- 代码能真正跑通并正常结束，不会陷入死循环
starter: |
  import random

  secret = random.randint(1, 100)
  tries = 0

  # 用 while 循环反复猜，猜中后跳出
  # 记得更新 tries，并在最后打印猜了几次
```
