# 第 4 章 · 打包代码 · 大测验

> 8 道题。这一章解决的是"把代码打成函数、管住变量作用域、处理文本与文件"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 Python 函数，下列哪个说法是错误的？
options:
- 函数用 def 关键字定义
- 函数可以没有参数，也可以没有 return
- 函数一旦执行到 return，就会立刻结束并把值返回
- 一个函数里只能有一个 return 语句
answer: 3
explain: 函数里可以有多个 return（比如在不同分支里），执行到第一个遇到的 return 就结束。return 不是只能写一次。
```

```quiz
type: choice
q: 下面函数 greet 的默认参数是什么？执行 greet("小明") 会打印什么？
code: |
  def greet(name, prefix="你好"):
      print(prefix + "，" + name)
options:
- 默认参数是 "你好"，打印 "你好，小明"
- 默认参数是 "小明"，打印 "你好，小明"
- 默认参数是 "你好"，打印 "None，小明"
- 会报错，因为没有给 prefix 传值
answer: 0
explain: prefix="你好" 是默认参数，调用时没传 prefix 就使用默认值，打印"你好，小明"。
```

```quiz
type: choice
q: 关于变量作用域，下列哪个说法是正确的？
options:
- 函数内部无法读取函数外部的变量
- 函数内部想修改全局变量，必须用 global 声明
- 函数参数名和外部变量同名时，会自动修改外部变量
- 全局变量在任何地方都可以被重新赋值而无需声明
answer: 1
explain: 读取全局变量不需要声明，但要重新赋值就必须先用 global，否则 Python 会把它当成局部变量。
```

```quiz
type: choice
q: 执行下面代码后，name 的值是什么？
code: |
  name = "  张三  "
  name.strip()
  print(name)
options:
- "张三"
- "  张三"
- "  张三  "
- 报错
answer: 2
explain: strip 不修改原字符串，而是返回新字符串。没有赋值回去，name 保持不变。
```

```quiz
type: choice
q: 关于文件读写，下列哪个写法是正确的"用完自动关闭文件"的推荐方式？
options:
- f = open("a.txt"); f.read(); f.close()
- with open("a.txt") as f: content = f.read()
- open("a.txt").read()
- file = open "a.txt"
answer: 1
explain: with 语句会在代码块结束后自动关闭文件，即使中途发生异常也能正确释放资源，是推荐写法。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数，输入一个字符串，返回它的"缩写"：把每个单词的首字母大写后拼在一起（如 "hyper text markup language" → "HTML"）
func: acronym
starter: |
  def acronym(text):
      return ""
cases: |
  "hyper text markup language" -> "HTML"
  "world health organization" -> "WHO"
  "a" -> "A"
hint: 先用 split 拆成单词列表，再对每个单词取首字母 upper，最后 join。或用列表推导式。
explain: split + 逐词处理 + join 是文本规范化的标准流水线，也常和列表推导式配合使用。
```

```quiz
type: function
q: 写一个函数，输入一个文件名，返回该文件中的总行数（空文件返回 0）
func: count_lines
starter: |
  def count_lines(filename):
      return 0
cases: |
  __file_self__ -> 1
hint: 用 with open(...) as f 打开，遍历 f 的每一行并计数。不要一次性把整个文件读进内存。
explain: 用 with 管理文件、用遍历计数，是处理大文件的正确姿势；测试时会用一个真实的小文件来验证。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"成绩单生成器"：读入一个 CSV 格式的成绩字符串（第一行为表头，后面每行是"姓名,科目,分数"），把每位学生的各科成绩汇总，最后按总分从高到低输出一张格式化的成绩单。
checklist:
- 用 split("\n") 把字符串按行拆开，跳过表头
- 用字典嵌套字典存数据，结构形如 {"张三": {"语文": 90, "数学": 95}}
- 遇到某学生缺某科成绩时，用字典的 setdefault 或 get 妥善处理，不报错
- 计算每位学生的总分，用 sorted 按总分降序排列
- 用 f-string 或 format 格式化输出，对齐整齐、可读性高
- 用 with open 把结果写入文件（如 "成绩单.txt"），而不是只打印在屏幕上
starter: |
  csv_text = """姓名,科目,分数
张三,语文,90
张三,数学,95
李四,语文,85
李四,数学,88
王五,语文,92"""

  # 解析 CSV，用嵌套字典汇总每人成绩
  # 计算总分并排序，最后用 with open 写入结果文件
```
