# test-04 第 4 章 · 写题（下）：编程题

> 第 4 章 · 写题（下）：编程题 —— 这一章的收尾测验。

```quiz
type: choice
q: cases 里写 `1 2 -> 3`（空格分隔）会发生什么？
options:
- 整段被当成一个参数，调用时报缺少参数
- 正常切成两个参数
- 校验器自动改成逗号
- 报错说语法错误
answer: 0
```

```quiz
type: choice
q: 函数题的 starter 应该给什么？
options:
- 能跑起来但结果不对的版本
- 只有注释的占位
- 完整的正确答案
- 空文件
answer: 0
```

```quiz
type: choice
q: random.randrange(1, 6) 能掷出 6 吗？
options:
- 不能，右边界是开区间
- 能，和 randint 一样
- 有时能
- 取决于 Python 版本
answer: 0
```

```quiz
type: choice
multi: true
q: 区间用例 `1..6` 除了检查范围，还会检查什么？（多选，2 个）
options:
- 结果是否真的出现了多种不同的值
- 跨度小的整数区间要求每个值都出现过
- 调用次数是否为偶数
- 函数名是否以 roll 开头
answer: 0, 1
```

```quiz
type: choice
q: 程序题的 tests 里，__out 是什么？
options:
- 代码的完整标准输出，一个字符串
- 最后 print 的那一行的值
- 返回值
- 错误信息
answer: 0
```

```quiz
type: function
q: 写一个函数 abs_val(n)，返回 n 的绝对值（不要直接用 abs）
func: abs_val
starter: |
  def abs_val(n):
      return n
cases: |
  5 -> 5
  -5 -> 5
  0 -> 0
  -100 -> 100
hint: 负数返回它的相反数
explain: n < 0 时返回 -n，否则返回 n。这条 -5 -> 5 的用例就是为了挡住「直接返回原值」。
```

```quiz
type: function
q: 写一个函数 count_words(s)，返回字符串 s 里有多少个单词（按空白切分）
func: count_words
starter: |
  def count_words(s):
      return 0
cases: |
  "hello world" -> 2
  "one" -> 1
  "" -> 0
  "a  b   c" -> 3
hint: 用 split() 不带参数，它会自动处理多个空格
explain: s.split() 不带参数时会按任意空白切分并丢掉空串，直接 len 即可。
```

```quiz
type: project
q: 出一道函数题并验证它有区分度：写出 starter 和至少 3 条用例，确认「starter 原样提交」过不了，且正确解能过。
starter: |
  # 一条一条检查你的用例：
  #
  #   1. 正确解能过吗？
  #   2. starter 原样提交能过吗？（能过就是没区分度）
  #   3. 有没有一条用例能挡住常见错误写法？
checklist: |
  - 用例参数用逗号分隔
  - starter 能跑起来，只是结果不对
  - starter 原样提交过不了
  - 至少有一条用例能挡住常见错误写法
  - 校验器 0 错误
```
