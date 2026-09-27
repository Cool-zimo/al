# 第 1 章 · 大测验

> 列表这一章学完了。下面是验收 —— 检验**记得牢不牢**、**会不会用**、**能不能做出东西**。
>
> 不用追求一次全对。**做错的题会在 1 天后自动回到你的复习列表**（艾宾浩斯记忆曲线），到时候再战。

---

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: `nums = [10, 20, 30, 40]`，`nums[-1]` 和 `nums[3]` 分别是什么？
options:
- 40 和 40
- 10 和 40
- 40 和 30
- 报错，负索引不存在
answer: 0
explain: 负索引 -1 是最后一个，正索引 3（第 4 个）也是最后一个 —— 它们指向同一个元素 40。正索引从 0 数起，负索引从 -1 数起，两者只是数法相反，最后一个元素永远是 nums[-1] 或 nums[len(nums)-1]。
```

```quiz
type: choice
q: 执行下面这段代码后，`result` 是什么？
code: |
  scores = [87, 92, 78]
  result = scores.sort()
options:
- [78, 87, 92]
- None
- [87, 92, 78]
- 报错，sort 不能这么用
answer: 1
explain: sort() 是就地排序 —— 它把 scores 自己改成 [78, 87, 92]，但**不返回任何东西**，所以 result 是 None。想拿到排序结果，要么 sort() 之后打印 scores 本身，要么用 sorted(scores) —— 那才返回新列表。这是本章最高频的错误。
```

```quiz
type: choice
q: `nums = [1, 2, 3, 2, 2]`，执行 `nums.remove(2)` 之后列表变成什么？
options:
- [1, 3]
- [1, 3, 2, 2]
- [1, 2, 3, 2]
- 报错，因为有重复元素
answer: 1
explain: remove 按「值」删，而且一次只删**第一个**匹配的。所以只有索引 1 那个 2 被去掉，后面两个 2 原地不动 —— 结果是 [1, 3, 2, 2]。想把 2 全删光得循环删，或者建新列表装「不等于 2 的」。
```

```quiz
type: choice
q: 下面这段代码打印出什么？
code: |
  a = [1, 2, 3]
  b = a
  b.append(4)
  print(a)
options:
- [1, 2, 3]
- [1, 2, 3, 4]
- [1, 2, 3, 4, 4]
- 报错
answer: 1
explain: b = a **不是复制**，而是给同一个列表起了第二个名字 —— a 和 b 指向同一份数据，所以改 b 等于改 a，打印 a 也是 [1, 2, 3, 4]。想真正复制一份要写 b = a[:] 或 b = list(a)，那样改 b 就不会影响 a。
```

```quiz
type: choice
q: `letters = ["a", "b", "c", "d"]`，`letters[1:3]` 有几个元素？
options:
- 2 个
- 3 个
- 4 个
- 1 个
answer: 0
explain: 前闭后开 —— 含索引 1，不含索引 3，所以只有索引 1、2 两个元素，即 ["b", "c"]。「终点取不到」这个规则和 range 完全一致，两个地方是同一个脾气。
```

---

## 第二部分 · 代码题

光记住概念不够，得能写出来。

```quiz
type: code
q: 从空列表开始，依次用 append 加入 "red"、"green"、"blue" 三个字符串，然后打印这个列表
tests:
- assert "['red', 'green', 'blue']" in __out
hint: 空列表是 []。append 一次只加一个元素，加三个就写三行。顺序跟你添加的顺序一致。
explain: 写法是 lst = [] 然后三行 lst.append("red") / lst.append("green") / lst.append("blue")，最后 print(lst)。注意 append 返回 None，别写 lst = lst.append("red") —— 那会把 lst 变成 None，后面全崩。
```

```quiz
type: code
q: 列表 `data = [5, 10, 15, 20]`。请打印它的第一个元素、最后一个元素（用负索引），各占一行
starter: |
  data = [5, 10, 15, 20]

  # 打印第一个

  # 打印最后一个（用负索引）

tests:
- assert "5" in __out
- assert "20" in __out
- assert "10" not in __out
hint: 第一个是索引 0，最后一个是索引 -1。分开两行 print。
explain: 答案是 print(data[0]) 和 print(data[-1])。这里把两个方向的索引一起考了：正数从 0 起、负数从 -1 起。测试里的 10 not in __out 是防止你用 data[1] 蒙混过关 —— 那拿到的是第二个数。
```

```quiz
type: code
q: 列表 `nums = [1, 2, 3]`。请把第二个元素改成 99，然后在末尾追加 4，最后打印整个列表
starter: |
  nums = [1, 2, 3]

  # 把第二个元素改成 99

  # 在末尾追加 4

  print(nums)
tests:
- assert "[1, 99, 3, 4]" in __out
hint: 第二个的索引是 1。改元素用赋值，加元素用 append。
explain: 补的是 nums[1] = 99 和 nums.append(4)。两个考点：索引从 0 数（第二个是 1 不是 2），以及 append 只在末尾加。这里两个操作互不干扰 —— 改的是索引 1，加的是末尾，所以先做哪个结果都一样。但如果改成「把最后一个改成 99 再追加」，顺序就真的会影响结果了。
```

```quiz
type: code
q: 列表 `nums = [10, 20, 30, 40, 50]`。请取出**中间三个**（20、30、40）装进变量 `mid` 并打印，再打印原列表确认它没被改动
starter: |
  nums = [10, 20, 30, 40, 50]

  mid = # 在这里写切片

  print(mid)
  print(nums)
tests:
- assert "[20, 30, 40]" in __out
- assert "[10, 20, 30, 40, 50]" in __out
hint: 20 在索引 1，40 在索引 3 —— 终点要写几才能把 40 包含进来？记住终点取不到。
explain: 补的是 nums[1:4]。这是「终点取不到」最经典的考法：想拿到索引 1、2、3 三个元素，终点必须写 4。写 nums[1:3] 只会得到 [20, 30]。第二条断言确认你用的是切片而不是 pop/del —— 切片不改原列表。
```

```quiz
type: code
q: 列表 `scores = [55, 90, 72, 48, 88]`。请找出所有**及格**（大于等于 60）的分数，装进新列表 `passed` 并打印；再打印及格人数
starter: |
  scores = [55, 90, 72, 48, 88]
  passed = []

  for s in scores:
      # 在这里写判断，把及格的装进 passed

  print(passed)
  print("及格人数:", len(passed))
tests:
- assert "[90, 72, 88]" in __out
- assert "3" in __out
- assert "55" not in __out
- assert "48" not in __out
hint: 遍历每个分数，if s >= 60 就 passed.append(s)。人数用 len(passed)，别自己数。
explain: 补的是 if s >= 60: passed.append(s)（两行，注意缩进）。这是本章最核心的套路：遍历 → 判断 → 装进新列表。结果 [90, 72, 88] 保持原顺序，人数 3 用 len 算出来而不是写死 —— 这样换一批数据代码也不用改。注意别在遍历时 remove，那会漏元素。
```
