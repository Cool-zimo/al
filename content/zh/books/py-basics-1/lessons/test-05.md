# 第 5 章 · 大测验

> 这一章的五课学完了。下面是验收 —— 检验**记得牢不牢**、**会不会用**、**能不能做出东西**。
>
> 不用追求一次全对。**做错的题会在 1 天后自动回到你的复习列表**（艾宾浩斯记忆曲线），到时候再战。

---

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: range(3) 会产生哪些数字？
options:
- 0 1 2
- 1 2 3
- 0 1 2 3
- 1 2
answer: 0
explain: 只给一个参数时，range 从 0 开始，到这个数结束（不含它）。所以 range(3) 是 0、1、2 —— 一共 3 个数字，正好等于参数本身。这是「前闭后开」最典型的例子。
```

```quiz
type: choice
q: 关于 while True，下面说法正确的是？
options:
- 它是一个语法错误，True 不能这么用
- 它会一直运行，必须在循环体内用 break 才能停下来
- 它会自动运行 10 次然后停止
- 它和 while 1 == 1 完全不是一回事
answer: 1
explain: True 是永远为真的布尔值，所以 while True 的条件永远不会不成立 —— 它自己停不下来，必须靠 break。它适合「不知道要跑几次，得先做一次才知道」的场景，比如菜单、猜数字。
```

```quiz
type: choice
q: continue 的作用是？
options:
- 结束整个循环
- 跳过本轮剩下的代码，回到循环开头开始下一轮
- 暂停程序等待用户输入
- 和 break 完全一样，只是写法不同
answer: 1
explain: 这是最容易和 break 混淆的一对。break 是「整个循环结束，跳到循环外面」；continue 是「本轮到此为止，回到循环开头」。continue 之后循环还会继续跑，break 之后不会。
```

```quiz
type: choice
q: 下面哪段代码会陷入死循环？
code: |
  # A
  count = 1
  while count <= 3:
      print(count)
      count = count + 1

  # B
  count = 1
  while count <= 3:
      print(count)

  # C
  for n in range(3):
      print(n)

  # D
  for n in range(3):
      if n == 1:
          break
      print(n)
options:
- A
- B
- C
- D
answer: 1
explain: B 里的 count 永远是 1，条件永远成立。判断死循环的方法就一条：循环体里有没有「让条件最终变成 False」的东西？A 有 count+1，C 和 D 用的是 for（次数固定，压根没有条件），只有 B 什么都没有。
```

```quiz
type: choice
q: 下面这段代码一共会打印多少次？
code: |
  for i in range(2):
      for j in range(3):
          print(i, j)
options:
- 5 次
- 6 次
- 3 次
- 2 次
answer: 1
explain: 嵌套循环的总轮数是「外层次数 × 内层次数」= 2 × 3 = 6。记住口诀：外层走一步，内层走完一整圈，而且外层每前进一格，内层都从头再来一遍。
```

---

## 第二部分 · 代码题

光记住概念不够，得能写出来。

```quiz
type: code
q: 用 while 循环计算 1 到 10 所有整数的和，并打印结果（应该是 55）
starter: |
  total = 0
  count = 1

  # 在这里写你的循环

  print(total)
tests:
- assert "55" in __out
hint: 循环条件是 count <= 10。循环体里做两件事：把 count 加进 total，然后让 count 加 1。
explain: 累加套路的两个变量分工明确 —— total 存结果（从 0 开始），count 记轮次（从 1 开始）。最容易错的是把 count = count + 1 写在循环外面，那样 count 永远不变，直接死循环。
```

```quiz
type: code
q: 用 for + range 打印 1 到 5 每个数的平方，每个一行（1、4、9、16、25）
starter: |
  for n in range(1, 6):
      # 在这里写一行

tests:
- assert "1" in __out
- assert "9" in __out
- assert "25" in __out
- assert "36" not in __out
hint: 平方是 n * n。注意 range 要写 (1, 6) 才能取到 5。
explain: 补的是 print(n * n)。这里再次遇到「结尾取不到」：想要 1 到 5，range 必须写 (1, 6)。写 (1, 5) 会少一个 5，于是 25 不出现 —— 而测试里的 36 not in __out 正是为了确认你没多跑一轮。
```

```quiz
type: code
q: 在 1 到 20 之间找出第一个能被 7 整除的数，打印它，然后立刻停止（不要继续往后找）
starter: |
  for n in range(1, 21):
      if n % 7 == 0:
          print(n)
          # 在这里补一行
tests:
- assert "7" in __out
- assert "14" not in __out
hint: 找到就该收手了。跳出循环用哪个关键字？
explain: 补的是 break。1 到 20 之间 7 的倍数有 7 和 14，题目要求「第一个」然后停 —— 没有 break 的话 14 也会被打印，测试的第二条就会失败。这正是 break 的典型用途：满足条件就拿结果走人。
```

```quiz
type: code
q: 打印 1 到 10 中所有**不是** 3 的倍数的数（也就是跳过 3、6、9）
starter: |
  for n in range(1, 11):
      if n % 3 == 0:
          # 在这里补一行
      print(n)
tests:
- assert "1" in __out
- assert "2" in __out
- assert "3" not in __out
- assert "10" in __out
hint: 倍数要「跳过」而不是「停止」—— 停止是 break，跳过本轮剩下部分用哪个？
explain: 补的是 continue。n 是 3 的倍数时，continue 让它跳过后面的 print(n)，直接开始下一轮。如果用 break，循环会在 n=3 时整个结束，4 到 10 都不会打印 —— 测试里的 10 in __out 就是用来区分这两种写法的。
```

```quiz
type: code
q: 用嵌套循环打印下面的图案（3 行，第 1 行 1 个星号，第 2 行 2 个，第 3 行 3 个）
starter: |
  for i in range(1, 4):
      # 在这里写内层循环（提示：用 end="" 可以不换行地打印）

      print()          # 换行，不用改
tests:
- assert __out.count("*") == 6
- assert "***" in __out
hint: 内层循环的次数取决于外层现在是第几行 —— 第 i 行要打印 i 个星号，所以内层写 range(i)。用 print("*", end="") 可以让星号排在同一行。
explain: 内层写 for j in range(i): print("*", end="")。注意这里 range(i) 不用 +1 —— 因为要对的是「个数」而不是「数值」：第 1 行要 1 个，range(1) 正好给 1 次。对比九九表的 range(1, i + 1)，那里对的是 j 的取值范围，两者极易搞混。
```
