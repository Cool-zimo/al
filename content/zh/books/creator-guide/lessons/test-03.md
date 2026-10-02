# test-03 第 3 章 · 写题（上）：基础题型

> 第 3 章 · 写题（上）：基础题型 —— 这一章的收尾测验。

```quiz
type: choice
q: 一道选择题有 4 个选项，正确答案是最后一个，answer 应该写几？
options:
- 3
- 4
- 1
- 0
answer: 0
```

```quiz
type: choice
q: 题干里要放一段代码，正确的做法是？
options:
- 用 code: 多行字段
- 直接在题干里敲三个反引号
- 用行内代码
- 放在 hint 里
answer: 0
```

```quiz
type: choice
multi: true
q: 多选题需要哪些要素？（多选，3 个）
options:
- multi: true
- answer 用逗号分隔多个下标
- 至少 2 个选项
- 题干里写明有几个正确答案
answer: 0, 1, 3
```

```quiz
type: fill
q: 填空题的多个可接受答案之间用什么符号分隔？
answer: '|'
placeholder: 一个符号
hint: 和斜杠同一个键
explain: 用竖线分隔，比如 answer: len|length。
```

```quiz
type: choice
q: 填空题的判分会考虑大小写吗？
options:
- 不区分，也会忽略首尾空格
- 严格区分大小写
- 只忽略空格
- 只忽略大小写
answer: 0
```

```quiz
type: function
q: 写一个函数 check_answer(q)，检查一道选择题的 answer 是否合法（options 至少 2 个且 answer 在范围内），合法返回 True
func: check_answer
starter: |
  def check_answer(q):
      return False
cases: |
  {"options": ["a", "b"], "answer": "0"} -> True
  {"options": ["a", "b"], "answer": "5"} -> False
  {"options": ["a"], "answer": "0"} -> False
hint: 先判选项数量，再把 answer 转 int 比范围
explain: options 长度小于 2 直接 False；answer 必须在 [0, len(options)) 内。
```

```quiz
type: function
q: 写一个函数 is_multi(q)，判断一道题是不是多选题（multi 字段为 true，大小写不敏感）
func: is_multi
starter: |
  def is_multi(q):
      return False
cases: |
  {"multi": "true"} -> True
  {"multi": "True"} -> True
  {"multi": "false"} -> False
  {} -> False
hint: 先取出来，转小写再比
explain: 用 str(q.get("multi", "")).lower() == "true"。
```

```quiz
type: project
q: 为你正在写的一课出 3 道题：1 道随堂（不带 exam）、2 道本节测验（带 exam）。至少用两种不同题型。然后用校验器确认 0 错误，并自己试着做一遍确认能判分。
starter: |
  # 提示：可以从题目库里插入片段再改
  #
  # 随堂练习放正文里（不带 exam）
  # 本节测验放末尾（exam: true）
checklist: |
  - 用了至少两种不同题型
  - 正好 2 道带 exam: true
  - 选项题的干扰项像真的，不是随便凑的
  - 校验器 0 错误
  - 自己试着做了一遍，能正常判分
```
