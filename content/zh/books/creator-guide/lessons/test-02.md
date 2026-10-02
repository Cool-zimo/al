# test-02 第 2 章 · 写课文

> 第 2 章 · 写课文 —— 这一章的收尾测验。

```quiz
type: choice
q: 哪种代码块能被读者点运行？
options:
- 带 python 语言标记的块
- 不带语言标记的块
- 用引用块包裹的代码
- 缩进四格的块
answer: 0
```

```quiz
type: choice
q: 站上判定「这一课学完了」，依据是什么？
options:
- 这一课带 exam: true 的题全部做对
- 随堂练习做完了
- 课文滚动到底了
- 点了一下节课按钮
answer: 0
```

```quiz
type: choice
multi: true
q: 一篇课文的开头应该有哪些元素？（多选，2 个）
options:
- 第一行 # 标题
- 第二行 > 引言
- 第一行 ## 小标题
- 开头放一段目录
answer: 0, 1
```

```quiz
type: fill
q: 一课正文建议写多少行？
answer: 60~150|60-150|60 到 150
placeholder: 一个区间
hint: 太短讲不透，太长读不完
explain: 60 ~ 150 行是舒服的区间，少于 60 行会被提示可能是占位内容。
```

```quiz
type: choice
q: 一课应该有几道带 exam: true 的题？
options:
- 2 道
- 1 道
- 3 道
- 越多越好
answer: 0
```

```quiz
type: function
q: 写一个函数 split_lesson(md)，把一篇课文的正文按 "## " 分成小节，返回小节标题的列表（不含 # 号，不含第一个标题）
func: split_lesson
starter: |
  def split_lesson(md):
      return []
cases: |
  "# T\n\n> intro\n\n## A\n\nx\n\n## B\n\ny\n" -> ["A", "B"]
  "# T\n\n> i\n" -> []
hint: 按行找以 ## 开头的，去掉 # 和空格
explain: 遍历行，startswith("## ") 的取 [3:] 即可，注意别把 # 一级标题算进去。
```

```quiz
type: function
q: 写一个函数 first_title(md)，返回课文里第一个以「# 加空格」开头的行的标题文字（去掉井号、空格）；没有就返回空字符串
func: first_title
starter: |
  def first_title(md):
      return ""
cases: |
  "# 切片\n\n> 引言\n" -> "切片"
  "## 小标题\n" -> ""
  "" -> ""
  "#  多余空格  \n" -> "多余空格"
hint: 按行找第一个以 # 开头的，注意要去掉 # 和空格
explain: 用 startswith("# ") 认一级标题，这样 ## 开头的小标题不会被误认。取 [2:] 再 strip()。
```

```quiz
type: function
q: 写一个函数 count_sections(md)，返回课文里有多少个以 "## " 开头的二级小节
func: count_sections
starter: |
  def count_sections(md):
      return 0
cases: |
  "# T\n\n## A\n\n## B\n" -> 2
  "# T\n" -> 0
  "" -> 0
hint: 数行前缀，别用 split("##")
explain: sum(1 for l in md.split("\n") if l.startswith("## "))。
```

```quiz
type: project
q: 写一课完整的课文：一个具体的标题、一句能说清「解决什么问题」的引言、2~4 个 ## 小节、一个能跑的 python 代码块加它的输出、1 道随堂练习、2 道带 exam 的本节测验。用校验器确认 0 错误。
starter: |
  # 在这里写你的一课
  #
  # 记住顺序：
  #   第一行 # 标题
  #   空一行
  #   > 引言
  #   空一行
  #   正文
checklist: |
  - 标题是具体的一个问题，不是「XX（上）」
  - 引言读完就知道这一课值不值得看
  - 有 2~4 个 ## 小节
  - 代码块能跑，输出单独放在不带语言的块里
  - 正好 2 道带 exam: true 的题
  - 校验器 0 错误
```
