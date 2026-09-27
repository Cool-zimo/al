# 第 4 章 · 大测验

> 这一章的五课学完了。下面是验收 —— 检验**记得牢不牢**、**会不会用**、**能不能做出东西**。
>
> 不用追求一次全对。**做错的题会在 1 天后自动回到你的复习列表**（艾宾浩斯记忆曲线），到时候再战。

---

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: 下面这段代码运行后会打印什么？
code: |
  age = 10
  if age >= 18:
      print("成年")
  print("结束")
options:
- 什么都不打印
- 成年
- 结束
- 成年 和 结束 都打印
answer: 2
explain: if 不成立的意思是「跳过属于它的那段」，不是「程序停止」。print("结束") 没有缩进，跟 if 无关，所以一定会执行。
```

```quiz
type: choice
q: 关于 Python 的缩进，下面说法正确的是？
options:
- 缩进只是为了好看，写不写都行
- 缩进决定了这行代码归谁管，是语法的一部分
- 缩进必须正好是 4 个空格，多一个少一个都报错
- 缩进只能用 Tab，不能用空格
answer: 1
explain: Python 用缩进代替其他语言的花括号来划分代码块，所以它是语法的一部分，不是排版习惯。空格数量不强制 4 个（但同一个代码块内必须一致），Tab 和空格都可以但不要混用。
```

```quiz
type: choice
q: 下面这段代码，score = 95 时会打印什么？
code: |
  score = 95
  if score >= 60:
      print("及格")
  elif score >= 90:
      print("优秀")
options:
- 优秀
- 及格
- 及格 和 优秀 都打印
- 什么都不打印
answer: 1
explain: elif 从上往下判断，命中一个就结束整个结构。95 >= 60 成立，于是第一个分支被执行，后面的 >= 90 根本没机会检查。这是条件顺序写反的经典后果。
```

```quiz
type: choice
q: if weather == "雨" or "雪": 这行代码有什么问题？
options:
- 语法错误，运行会报错
- 没有问题，写法完全正确
- 会永远成立，因为 "雪" 是非空字符串被当成 True
- or 的两边顺序写反了
answer: 2
explain: "雪" 是非空字符串，在需要布尔值时 Python 视为 True，所以整个条件恒为 True，不管 weather 是什么都会执行。这类 bug 不报错，特别危险。正确写法是 weather == "雨" or weather == "雪"。
```

---

## 第二部分 · 代码题

光记住概念不够，得能写出来。

```quiz
type: code
q: 写代码：当 num 是负数时打印「负数」，否则打印「非负数」
starter: |
  num = -7

  # 在这里写你的判断

tests:
- assert "负数" in __out
- assert "非负数" not in __out
hint: if 判断 num < 0，else 处理剩下所有情况。别忘了冒号和缩进。
explain: num < 0 成立，走 if 分支。if 和 else 必定执行其中一个，所以「非负数」不会出现在这次输出里。
```

```quiz
type: code
q: 修好这段代码的两处错误，让它在 age 满 18 岁时打印「可以进入」
starter: |
  age = 20

  if age >= 18
  print("可以进入")
tests:
- assert "可以进入" in __out
hint: 第一处：if 那行末尾少了冒号。第二处：print 应该缩进 4 格。
explain: 漏冒号和漏缩进，占了新手 if 报错的八成。遇到 if 相关报错，先检查这两处能省大量时间。
```

```quiz
type: code
q: 用 and 组合条件：只有当 age 大于等于 18 且 has_id 为 True 时，才打印「允许进入」
starter: |
  age = 20
  has_id = False

  # 在这里写你的判断

tests:
- assert "允许进入" not in __out
hint: 条件是 age >= 18 and has_id。注意 has_id 本身已经是布尔值，不用写 == True。
explain: has_id 是 False，所以 and 的结果为 False，什么都不打印。写 has_id 就够了，不用画蛇添足写 has_id == True。
```

```quiz
type: code
q: 把下面三个分支按「从严格到宽松」重新排序，让 score = 88 打印「良好」
starter: |
  score = 88

  if score >= 60:
      level = "及格"
  elif score >= 90:
      level = "优秀"
  elif score >= 75:
      level = "良好"

  print(level)
tests:
- assert "良好" in __out
- assert "及格" not in __out
- assert "优秀" not in __out
hint: 条件一个都不改，只调整顺序。范围最小的排最前面：90 → 75 → 60。
explain: 正确顺序是 >= 90 排第一，>= 75 第二，>= 60 第三。88 分会跳过 90，命中 75，得到「良好」。如果宽松的条件排前面，严格的永远等不到检查机会。
```
