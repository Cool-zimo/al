# 第 2 章章测 · 判断与循环

> 本测试覆盖《学习篇》第 2 章：if / elif / else、真假规则、while、for 与 range、break / continue / 嵌套。
> 先做完再对答案，遇到卡壳就回到对应那一课重看。

## 第一部分 · 选择题

```quiz
type: choice
q: 运行下面代码，输入 75，会输出什么？
code: |
  score = int(input())
  if score >= 60:
      print("及格")
  elif score >= 90:
      print("优秀")
options:
- 及格
- 优秀
- 什么都不输出
- 报错
answer: 0
explain: 75 >= 60 成立，命中第一个分支打印"及格"，第二个分支永远不会被判断。这就是把宽泛条件写前面的后果。若把两个分支调换顺序，75 才会落到 else。
```

```quiz
type: choice
q: 下面表达式的值是什么？
code: |
  0 or "" or [] or "上海"
options:
- 0
- ""
- []
- "上海"
answer: 3
explain: or 短路求值，返回第一个真值。0、""、[] 都是假值被跳过，"上海"是非空字符串、为真，直接返回。这就是 or 返回操作数本身、不是布尔值的特性。
```

```quiz
type: choice
q: 下面代码的输出是什么？
code: |
  i = 1
  while i <= 3:
      print(i)
      i = i - 1
options:
- 1 0 -1
- 1 2 3
- 不停地打印 1，永不停止
- 什么都不打印
answer: 2
explain: i 从 1 开始，每次 -1，越来越小，条件 i<=3 永远成立，是死循环。这正是"更新方向反了"的典型死法。
```

```quiz
type: choice
q: 下面代码输出什么？
code: |
  for i in range(5, 2, -1):
      print(i, end=" ")
options:
- 5 4 3 2 1
- 5 4 3
- 2 3 4 5
- 什么都不打印
answer: 1
explain: range(5, 2, -1) 起点 5，步长 -1，终点 2 取不到，依次取 5、4、3。反例 range(5, 2) 步长默认 +1，从 5 永远到不了 2，什么都不打印。
```

```quiz
type: choice
q: 下面代码会打印什么？
code: |
  for i in range(3):
      for j in range(3):
          if j == 1:
              break
          print(i, j, end=" | ")
options:
- 0 0 | 0 1 | 1 0 | 1 1 | 2 0 | 2 1 |
- 0 0 | 1 0 | 2 0 |
- 0 0 | 0 1 | 0 2 | 1 0 | 1 1 | 1 2 | 2 0 | 2 1 | 2 2 |
- 什么都不打印
answer: 1
explain: break 只跳出内层 for j，j==1 时内层终止，每次只打印 (i,0)。外层照常跑 3 次，共打印 0 0 / 1 0 / 2 0。
```

## 第二部分 · 动手题

```quiz
type: code
q: 读入一个 0~100 的整数，按规则输出等级：90 及以上输出"优秀"，80~89 输出"良好"，60~79 输出"及格"，60 以下输出"不及格"。系统会输入 88
starter: |
  # if-elif-else，条件从严到宽
  score = int(input())
  print("在这里改")
stdin: |
  88
tests:
- assert "良好" in __out
hint: 顺序写 >=90、>=80、>=60、else。边界值 80、90 亲自测一遍。
explain: 这题考条件顺序。反例把 if score>=60 写最前，90 分也会被判成"及格"。正好 80 分应判"良好"（走 elif >=80），正好 60 分应判"及格"（走 elif >=60）。
```

```quiz
type: function
exam: true
q: 写 count_down(n)，从 n 开始倒计时到 1（含），用 while 循环实现，每轮打印当前数字并把 n 减 1。n 小于等于 0 时什么都不做。返回 None
func: count_down
starter: |
  def count_down(n):
      # while 三要素：初始值、条件、更新，一个都不能少
      pass
cases: |
  3 -> 打印 3、2、1
  1 -> 打印 1
  0 -> 什么都不打印
  -2 -> 什么都不打印
hint: while n >= 1: 内打印 n 然后 n -= 1。条件 n>=1 保证 n<=0 时不进循环。
explain: while 三要素齐全就不会死循环。反例漏了 n -= 1 → 死循环不停打印同一个数；反例条件写成 while n > 0 也能对但终点判断更含糊；反例用 range 是 for 的写法，题目要求 while。
```

## 第三部分 · 小项目

```quiz
type: function
exam: true
q: 写 guess_number(secret)，实现一个"猜数字"交互：反复读入整数（通过 input 模拟），直到猜中 secret 为止。每轮读入一个整数 guess：若猜大了输出"大了"，猜小了输出"小了"，猜中输出"对了，猜了 N 次"并停止。N 是总共猜的次数（含最后一次）。若用户直接回车或输入非数字，算作一次无效输入，输出"无效输入"但不计入猜的次数。要求用 while True 配合 break 实现
func: guess_number
starter: |
  def guess_number(secret):
      # while True: 读入 → 判无效(continue) → 判大小 → 对了就 break
      pass
cases: |
  (42, 输入 10 50 abc 42) -> 输出 "小了" "大了" "无效输入" "对了，猜了 3 次"
  (7, 输入 7) -> 输出 "对了，猜了 1 次"
  (0, 输入 -5 0) -> 输出 "小了" "对了，猜了 2 次"
hint: 无效输入（空串或转 int 失败）用 try-except 捕获 ValueError，打印"无效输入"并 continue，且不增加计数。猜对时打印次数并 break。
explain: 这题把本章所有重点串起来：while True + break 控制循环、continue 跳过无效轮、try-except 处理输入转换、计数器的正确更新位置。无效输入不计入次数，所以计数只在有效数字路径上 +1。反例把计数放在 continue 之后会多算一次；反例用 break 写在无效分支里会在第一次输入错就退出；反例直接 int(input()) 不加 try-except 会在输入 abc 时抛 ValueError 崩溃。
```
