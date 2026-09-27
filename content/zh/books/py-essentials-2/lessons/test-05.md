# 第 5 章 · 能拿得出手 · 大测验

> 8 道题。这一章解决的是"把前四章合起来，写出能跑、能存、能容错的程序"的问题——异常处理、模块与包、推导式与内置函数、两个综合实战。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 运行下面代码会输出什么？
code: |
  try:
      x = 10 / 0
  except ZeroDivisionError:
      print("A")
  except Exception:
      print("B")
  else:
      print("C")
  finally:
      print("D")
options:
- A D
- B D
- A C D
- A B D
answer: 0
explain: 10 / 0 抛 ZeroDivisionError，命中第一个 except 打印 A；finally 始终执行打印 D。else 只在没抛异常时执行，所以不打印 C；Exception 是父类排在后面，轮不到。
```

```quiz
type: choice
q: 关于模块导入，下列说法正确的是？
code: |
  from math import *
  sqrt = 3.14
  print(sqrt(9))
options:
- 打印 3.14，因为 sqrt 被重新赋值了
- 打印 3.0，函数调用优先于变量
- 报 TypeError，因为 sqrt 已被覆盖成浮点数
- 语法错误
answer: 2
explain: from math import * 把 sqrt 导入当前命名空间，随后 sqrt = 3.14 用变量覆盖了函数名。再调用 sqrt(9) 就是拿浮点数当函数调用，TypeError: 'float' object is not callable。这就是 import * 危险的原因。
```

```quiz
type: choice
q: 运行下面代码会输出什么？
code: |
  nums = [3, 1, 2]
  nums.sort()
  result = nums.sort(reverse=True)
  print(result)
options:
- "[3, 2, 1]"
- "None"
- "[1, 2, 3]"
- 报错
answer: 1
explain: list.sort() 原地排序、返回 None。第一次 nums.sort() 把 nums 改成 [1,2,3]；第二次 nums.sort(reverse=True) 把它改成 [3,2,1]，返回 None 赋给 result。所以打印的是 None，不是排序后的列表。
```

```quiz
type: choice
q: 下面哪个表达式的结果是 True？
code: |
  A: all([])
  B: any([])
  C: all([1, 2, 3])
options:
- 只有 A
- 只有 C
- A 和 C 都是
- 三个都是
answer: 2
explain: all([]) 是真空真，返回 True；any([]) 空集无正例，返回 False；all([1,2,3]) 所有元素都为真，返回 True。所以 A 和 C 都是 True。
```

```quiz
type: choice
q: 运行下面代码会输出什么？
code: |
  data = [("张三", 88), ("李四", 95), ("王五", 70)]
  result = sorted(data, key=lambda t: t[1], reverse=True)
  print(result[1][0])
options:
- 张三
- 李四
- 王五
- 报错
answer: 1
explain: key=lambda t: t[1] 按分数降序，排序后是 [("李四",95), ("张三",88), ("王五",70)]。result[1] 是 ("张三",88)，result[1][0] 是 "张三"。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写 robust_parse(text)，把字符串 text 按逗号分割成若干段，把每一段转成整数后返回整数列表。如果某一段没法转成整数，就跳过它（不报错）。如果分割后没有任何合法整数，返回空列表。要求用 try/except 实现
func: robust_parse
starter: |
  def robust_parse(text):
      # 按逗号 split，遍历每段，try int() 转换，失败就跳过
      return []
cases: |
  "1,2,3" -> [1, 2, 3]
  "1,abc,3,10" -> [1, 3, 10]
  "abc,xyz" -> []
  "" -> []
  "5, 6, 7" -> [5, 6, 7]
hint: 先 text.split(",") 得到段列表，遍历每段 strip 后 try int()，except ValueError 就 continue。
explain: 这题把"字符串处理 + 异常处理 + 列表构建"串起来了。空字符串 split 后是 [""]，int("") 抛 ValueError 被跳过，返回 []，符合预期。注意别在 split 前 strip 整个字符串——那样 "1, 2" 会被当成一段 "1, 2"。
```

```quiz
type: function
q: 写 make_roster(records)，records 是字符串列表，每个字符串形如 "姓名:科目:分数"（如 "张三:数学:92"）。返回两个东西：一个字典，键是姓名，值是该人的总分；一个列表，列出有缺考记录（分数段不是数字或为空）的学生姓名。要求用 zip/split 拆解，用推导式或字典方法聚合，用 try/except 处理分数转换
func: make_roster
starter: |
  def make_roster(records):
      # 返回 (totals_dict, absent_list)
      # 示例：{"张三": 180}  ["李四"]
      return {}, []
cases: |
  ["张三:数学:92", "张三:语文:88", "李四:数学:75", "李四:语文:abc"] -> ({"张三": 180, "李四": 75}, ["李四"])
  ["王五:英语:60"] -> ({"王五": 60}, [])
  [] -> ({}, [])
hint: 遍历 records，split(":") 得到三段；try int(分数) 失败就把姓名加进 absent，成功就把分数累加到 totals[name]。
explain: 这是综合题：split 拆解 + 字典聚合 + 异常处理 + 列表收集。返回两个值是 Python 很常见的模式。注意 absent 列表要去重——同一个人两科都缺考只列一次，可以用集合中转或 if name not in absent 判断。
```

## 第三部分 · 小项目

```quiz
type: project
q: 写一个"图书借阅登记"程序：支持添加图书（书名、作者、借阅状态）、按书名子串查找、把某本书标记为已借出/已归还、列出全部图书、按作者统计藏书数量、退出。要求：1) 数据用字典列表，每本有 title/author/borrowed（布尔）；2) 纯函数不写 input/print，交互逻辑单独写；3) 借阅状态转换时找不到书要提示；4) 按作者统计返回结构化的字典（{作者: 数量}），不打印；5) 子串查找大小写不敏感；6) 退出前提示保存（此题不要求真写文件，打印"已保存"即可）
starter: |
  books = []

  def add_book(books, title, author):
      # 返回 True，borrowed 默认 False
      return True

  def find_books(books, keyword):
      # 子串匹配，大小写不敏感
      return []

  def toggle_borrow(books, title):
      # 切换指定书的借阅状态，返回 True/False
      return False

  def count_by_author(books):
      # 返回 {作者: 数量} 的字典
      return {}

  def render(books):
      # 只负责打印
      pass

  def main():
      # 菜单循环：1添加 2查找 3借出/归还 4列出 5按作者统计 q退出
      pass

  if __name__ == "__main__":
      main()
hint: 把六件事拆成六个函数，每个函数体不超过 15 行。keyword.lower() in title.lower() 实现大小写不敏感的子串匹配。count_by_author 用字典的 setdefault 或 collections.Counter。
checklist:
- 数据用字典列表，含 title/author/borrowed 三个字段
- add_book 正确创建字典并追加，borrowed 默认为 False
- find_books 用子串匹配且大小写不敏感（用 lower() 两边）
- toggle_borrow 找不到书返回 False，main 据此提示；找到则翻转布尔值
- count_by_author 返回结构化字典，不在函数内打印
- render 只负责打印，不重新计算统计
- 菜单含退出选项，退出时打印"已保存"（不要求真写文件）
- 未知菜单选项有兜底提示
- 用 if __name__ == "__main__": 作为入口守卫
```
