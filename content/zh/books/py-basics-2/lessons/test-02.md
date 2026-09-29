# 第 2 章 · 大测验

> 元组、字符串、序列共性这一章学完了。下面是验收 —— 检验**记得牢不牢**、**会不会用**、**能不能做出东西**。
>
> 不用追求一次全对。**做错的题会在 1 天后自动回到你的复习列表**（艾宾浩斯记忆曲线），到时候再战。

---

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: '下面哪个能正确创建"只含数字 1"的元组？'
options:
- '(1)'
- '(1,)'
- '[1]'
- 'tuple(1)'
answer: 1
explain: (1) 只是把 1 括起来、结果还是 int；[1] 是列表；tuple(1) 报错（1 不可迭代）。只有 (1,) 才是单元素元组 —— 那个尾巴上的逗号不能省。
```

```quiz
type: choice
q: '`a, b = (1, 2, 3)` 会发生什么？'
options:
- 'a=1, b=2, 3 被丢弃'
- 'a=1, b=(2, 3)'
- '报错 ValueError'
- '报错 SyntaxError'
answer: 2
explain: 左边期待 2 个变量，右边给了 3 个元素，Python 报 ValueError "too many values to unpack"。想收剩余得写 a, *b = (1, 2, 3)，那时 b 才是 [2, 3]。
```

```quiz
type: choice
q: '`s = "  hello  "`，执行 `s.strip()` 后 `s` 本身变成什么？'
options:
- '"hello"'
- '"  hello  "'
- '报错'
- 'None'
answer: 1
explain: strip 返回新字符串、不改原串。要让 s 变，得写 s = s.strip()。这是字符串"不可变"特性的直接体现。
```

```quiz
type: choice
q: '下面哪个 f-string 能正确输出 `单价 12.50`？'
options:
- 'f"单价 {price:.2f}"（price=12.5）'
- 'f"单价 {price}"（price=12.5）'
- 'f"单价 {price:2f}"（price=12.5）'
- '"单价 {price:.2f}".format(price=12.5)'
answer: 0
explain: :.2f 表示按浮点数显示并保留 2 位小数。B 会输出 12.5（只有一位小数）；C 少了点号、语法不对；D 不是 f-string 但语法上其实也能输出正确结果，不过题干限定 f-string 场景，A 是标准答案。
```

```quiz
type: choice
q: '`rows = [[]] * 3`，然后 `rows[0].append(1)`，`rows` 最终是什么？'
options:
- '[[1], [], []]'
- '[[1], [1], [1]]'
- '[[1, 1, 1]]'
- '报错'
answer: 1
explain: [[]] * 3 里三个 [] 是同一个列表对象，改一个等于改三个。想让三个子列表互不相干，用 [[] for _ in range(3)]。
```

---

## 第二部分 · 动手题

光记住概念不够，得能写出来。

```quiz
type: code
q: 用 f-string 打印三行商品清单，格式为 `商品：XX，单价：YY.YY 元`，XX 来自列表 names，YY 来自列表 prices（两者一一对应）。每个商品一行
starter: |
  names = ["苹果", "牛奶", "面包"]
  prices = [5.5, 8.0, 3.5]

  # 遍历打印三行
tests:
- assert "商品：苹果，单价：5.50 元" in __out
- assert "商品：牛奶，单价：8.00 元" in __out
- assert "商品：面包，单价：3.50 元" in __out
hint: 用 zip 同时遍历两个列表，f-string 里用 :.2f 保留两位小数。
explain: 答案：for n, p in zip(names, prices): print(f"商品：{n}，单价：{p:.2f} 元")。考的是 f-string 小数位格式和 zip 并行遍历。
```

```quiz
type: function
q: 写一个函数 `reverse_words`，接收一个字符串（单词间用空格分隔），返回单词顺序颠倒后的字符串。例如 `"我 爱 Python"` 返回 `"Python 爱 我"`
func: reverse_words
starter: |
  def reverse_words(s):
      return ""
cases: |
  "我 爱 Python" -> "Python 爱 我"
  "a b c d" -> "d c b a"
hint: 先 split 成列表，再 [::-1] 反转，最后用 " ".join 粘回。
explain: 答案：return " ".join(s.split()[::-1])。考的是"字符串 → 列表 → 反转 → 字符串"这条管道，以及 join 的用法。split 默认按空白切，正好处理任意空格。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 用本章学的知识做一个"通讯录格式化工具"：给定 `contacts = [("张三", "13800138000"), ("李四", "13900139000"), ("王五", "13700137000")]`，遍历并用 f-string 打印出对齐的名片，格式为 `姓名：XX    电话：YY`（姓名占 4 字符宽左对齐，电话保持原样）。完成后思考：如果要把这些数据存成可查询的"姓名→电话"结构，你会用什么容器？
starter: |
  contacts = [
      ("张三", "13800138000"),
      ("李四", "13900139000"),
      ("王五", "13700137000"),
  ]

  # 遍历并用 f-string 打印
checklist:
- 用元组解包同时拿到姓名和电话
- 用 f-string 的 :<4 做姓名左对齐
- 输出格式为 `姓名：XX    电话：YY`
- 能说出"存成可查询结构该用字典"
```
