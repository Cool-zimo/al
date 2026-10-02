# test-01 第 1 章 · 先搞清楚一本书是什么

> 第 1 章 · 先搞清楚一本书是什么 —— 这一章的收尾测验。

```quiz
type: choice
q: 判断一个仓库是不是 AnyLearn 的书，最关键的依据是什么？
options:
- 根目录有 albook.json 且 format 精确等于 al-book
- 仓库名以 al-book- 开头
- 有 README.md
- 有 content 目录
answer: 0
```

```quiz
type: choice
q: 课文文件必须放在哪个路径下？
options:
- content/zh/lessons/01.md
- lessons/01.md
- content/01.md
- zh/01.md
answer: 0
```

```quiz
type: choice
multi: true
q: 下面哪些是 albook.json 的必需字段？（多选，4 个）
options:
- id
- title
- tags
- langs
- author
answer: 0, 1, 3, 4
```

```quiz
type: choice
q: 下面哪个 id 是合法的？
options:
- my-first-book
- My_First_Book
- -mybook
- my book
answer: 0
```

```quiz
type: fill
q: 第 3 章的章测文件名应该是什么？
answer: test-03.md
placeholder: 带 .md 后缀
hint: test- 开头加两位章号
explain: 章测统一叫 test-NN.md，章号补零到两位。
```

```quiz
type: function
q: 写一个函数 is_legal_id(s)，判断 s 是不是合法的书 id（只允许小写字母、数字、连字符，且以字母或数字开头）
func: is_legal_id
starter: |
  def is_legal_id(s):
      return False
cases: |
  "my-book" -> True
  "MyBook" -> False
  "-mybook" -> False
  "my_book" -> False
  "book2" -> True
hint: 先判断首字符，再判断剩下的字符是不是都在允许集合里
explain: 首字符必须是字母或数字，之后只允许小写字母、数字和连字符。
```

```quiz
type: function
q: 写一个函数 lesson_path(lang, n)，返回第 n 课的文件相对路径（n 补零到两位）
func: lesson_path
starter: |
  def lesson_path(lang, n):
      return ""
cases: |
  "zh", 1 -> "content/zh/lessons/01.md"
  "en", 12 -> "content/en/lessons/12.md"
  "zh", 30 -> "content/zh/lessons/30.md"
hint: 用 f-string 和 :02d
explain: f"content/{lang}/lessons/{n:02d}.md"
```

```quiz
type: project
q: 搭一本最小的书：albook.json（含 9 个必需字段）、README.md、content/zh/toc.json（1 章 3 课）、3 篇课文。然后用校验器跑一遍确认 0 错误。
starter: |
  # 在这个目录里创建文件：
  #
  # albook.json
  # README.md
  # content/zh/toc.json
  # content/zh/lessons/01.md
  # content/zh/lessons/02.md
  # content/zh/lessons/03.md
checklist: |
  - albook.json 的 format 精确等于 al-book
  - 九个必需字段都写全了
  - toc.json 声明的 3 课都有对应文件
  - 每篇课文第一行是 # 标题
  - 校验器跑出来 0 错误
```
