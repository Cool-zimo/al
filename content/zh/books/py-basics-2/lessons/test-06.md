# 第 6 章 · 大测验

> 函数进阶这一章学完了：函数作为对象、`*args`/`**kwargs`、lambda 与高阶函数、递归、重构。下面是验收——检验**记得牢不牢**、**会不会用**、**能不能做出东西**。
>
> 不用追求一次全对。**做错的题会在 1 天后自动回到你的复习列表**（艾宾浩斯记忆曲线），到时候再战。

---

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: '把函数 `double` 存进列表的正确写法是？'
options:
- 'ops = [double()]'
- 'ops = [double]'
- 'ops = double'
- 'ops = call double'
answer: 1
explain: ops = [double] 存的是函数对象本身。A 存的是 double() 的返回值（一个数字）；C 是单个变量不是列表；D 语法错误。
```

```quiz
type: choice
q: '`def f(a, *args, **kwargs): pass`，调用 `f(1, 2, 3, name="张三")` 后 `args` 和 `kwargs` 分别是什么？'
options:
- 'args=(1,), kwargs={"name":"张三"}'
- 'args=(2, 3), kwargs={"name":"张三"}'
- 'args=(1,2,3), kwargs={}'
- 'args=(), kwargs={"a":1,"name":"张三"}'
answer: 1
explain: a 先接住位置参数 1，剩下的位置参数 2、3 进 args 成元组 (2,3)，关键字参数 name="张三" 进 kwargs 成字典。
```

```quiz
type: choice
q: '下面哪个 lambda 的写法是正确的？'
options:
- 'f = lambda x: x = x + 1'
- 'f = lambda x: x * 2'
- 'f = lambda: x * 2'
- 'f = lambda x: if x > 0: return x'
answer: 1
explain: lambda 主体只能是一个表达式，不能写赋值语句、不能写 if 语句块。B 的 x * 2 是合法表达式。A 有赋值，C 缺参数，D 是语句块。
```

```quiz
type: choice
q: '`nums = [{"score":90}, {"score":60}, {"score":100}]`，按分数从高到低排序，正确的是？'
options:
- 'sorted(nums, key=lambda s: s["score"])'
- 'sorted(nums, key=lambda s: s["score"], reverse=True)'
- 'sorted(nums, key=lambda s: s["score"] == 100)'
- 'nums.sort(key=lambda s: s["score"], reverse=True) 且打印 nums'
answer: 3
explain: B 和 D 语法都对、都能排降序，但 B 返回的是新列表、原 nums 不变；D 用 list.sort 原地排序、打印 nums 能看到结果。题目问"排序后 nums 变成降序"，只有 D 原地修改了 nums。
```

```quiz
type: choice
q: '下面哪个递归函数一定会触发 RecursionError？'
options:
- 'def f(n): return 1 if n<=1 else n*f(n-1)'
- 'def f(n): return f(n+1)'
- 'def f(n):\n    if n<=0: return\n    f(n-1)'
- 'def f(): return 1'
answer: 1
explain: B 的 f(n+1) 每次问题反而变大，没有终止条件可命中，必炸。A 有终止条件且 n-1 变小；C 有终止条件；D 根本没递归。
```

---

## 第二部分 · 动手题

光记住概念不够，得能写出来。

```quiz
type: code
q: 用 `sorted` 配合 lambda 的 `key` 参数，把名字列表 `names = ["张三", "李四四", "王", "赵六六六"]` 按**名字长度从短到长**排序并打印
starter: |
  names = ["张三", "李四四", "王", "赵六六六"]
  # 用 sorted + lambda(key=lambda n: len(n))

  print(...)
tests:
- assert "['王', '张三', '李四四', '赵六六六']" in __out
hint: sorted(names, key=lambda n: len(n))。key 要传函数本身，不要传 len(names) 这种调用结果。
explain: 答案：sorted(names, key=lambda n: len(n))。考的是 sorted 的 key 参数——按名字长度而不是按名字本身排序。
```

```quiz
type: function
q: 写一个函数 `sum_all(*numbers)`，接收任意多个数字，返回它们的和。不传参数时返回 0
func: sum_all
starter: |
  def sum_all(*numbers):
      return 0
cases: |
  1, 2, 3 -> 6
  10, 20 -> 30
  -> 0
hint: *numbers 把参数收集成元组，直接 return sum(numbers)。空元组 sum 为 0。
explain: 答案：def sum_all(*numbers): return sum(numbers)。考的是 *args 收集任意多个位置参数，以及 sum 的用法。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 用第 6 章学的知识做一个"购物车工具"：写四个函数——`add_item(cart, item, price)`（往购物车列表 cart 里添加 {"item":item,"price":price}）、`total_price(cart)`（返回购物车总价）、`filter_affordable(cart, max_price)`（用 `filter` + lambda 返回价格不超过 max_price 的商品列表）、`sort_by_price(cart)`（用 `sorted` + lambda 的 key 参数，按价格从高到低返回新列表）。然后在主流程里：添加苹果5.5、牛奶8、面包3.5 三件商品，打印总价、打印 6 元以内能买的商品、打印按价格排序后的清单
starter: |
  cart = []

  def add_item(cart, item, price):
      # 往列表里加字典

  def total_price(cart):
      # 用 sum 算总价

  def filter_affordable(cart, max_price):
      # 用 filter + lambda，记得 list()

  def sort_by_price(cart):
      # 用 sorted + lambda(key=lambda g: g["price"]), reverse=True

  # 主流程：添加三件商品，打印总价、6元以内商品、排序清单
checklist:
- add_item 往 cart 里加字典，直接修改原列表
- total_price 用 sum + 字典取值算总价
- filter_affordable 用 filter + lambda 并 list() 转换
- sort_by_price 用 sorted + lambda 的 key 参数降序
- 主流程清晰，四个函数各司其职
```
