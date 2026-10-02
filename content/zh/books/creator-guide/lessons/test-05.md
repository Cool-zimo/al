# test-05 第 5 章 · 特殊题型与进阶

> 第 5 章 · 特殊题型与进阶 —— 这一章的收尾测验。

```quiz
type: choice
q: 什么时候应该用 local 题型？
options:
- 浏览器沙箱跑不了，比如开图形窗口
- 题目比较难
- 想要读者自己思考
- 代码比较长
answer: 0
```

```quiz
type: choice
q: project 和 local 的主要区别是？
options:
- project 给初始代码且通常浏览器能跑，local 必须去本地跑
- project 更难
- local 有清单 project 没有
- 两者完全一样
answer: 0
```

```quiz
type: choice
multi: true
q: 好的 checklist 应该满足什么？（多选，2 个）
options:
- 每条都是读者能回答是或不是的可验证结果
- 一条对应一个功能
- 写得越抽象越好
- 条数越多越好
answer: 0, 1
```

```quiz
type: fill
q: 想写一本没有题目的小说，albook.json 里应该把 kind 设成什么？
answer: novel
placeholder: 一个英文单词
hint: 小说的英文
explain: kind: novel 表示小说，不强制要求题目。
```

```quiz
type: choice
q: kind: novel 的书里写了一道 answer 越界的选择题，会怎样？
options:
- 照样报错
- 因为是小说所以不查
- 只是警告
- 自动修正
answer: 0
```

```quiz
type: function
q: 写一个函数 needs_questions(kind)，判断这种 kind 的书是否要求题目（只有 textbook 要求）
func: needs_questions
starter: |
  def needs_questions(kind):
      return True
cases: |
  "textbook" -> True
  "novel" -> False
  "notes" -> False
  "" -> True
hint: 缺省值也是 textbook
explain: 不写 kind 就按 textbook 处理，所以空字符串也要返回 True。
```

```quiz
type: function
q: 写一个函数 kind_label(kind)，返回中文名：textbook→教材，novel→小说，notes→笔记，其它→其它
func: kind_label
starter: |
  def kind_label(kind):
      return ""
cases: |
  "textbook" -> "教材"
  "novel" -> "小说"
  "notes" -> "笔记"
  "banana" -> "其它"
hint: 用字典加默认值
explain: 字典查表，取不到就返回「其它」——未知 kind 按宽松处理也是这个思路。
```

```quiz
type: project
q: 做一件让你以后写书更快的事：把你最常用的一类题存成自定义片段（选中 quiz 块 → 题目库 → 存成自定义片段），然后在另一篇课文里插入它，确认插进来的题能正常判分。另外，如果你打算写一本非教材的书，试着把 kind 设成 novel，确认「一道题都没有」不再报错。
starter: |
  # 两件事：
  #
  # 1. 存一个自定义片段并复用它
  # 2. 试一下 kind: novel 的宽松校验
checklist: |
  - 自定义片段存好了
  - 在另一课里插入成功，且能判分
  - 试过 kind: novel，没有题也不报错
  - 换设备或清缓存后，自定义片段还能拉回来
```
