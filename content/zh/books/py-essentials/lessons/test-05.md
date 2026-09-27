# 第 5 章 · 能拿得出手 · 大测验

> 8 道题。这一章解决的是"程序怎么不轻易崩、怎么复用别人的代码、怎么把数据玩出花样"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 try / except / finally，下列哪个说法是正确的？
options:
- 只要写了 try，finally 就一定会被执行
- except 只能捕获一种指定异常
- 发生异常后程序立刻结束，finally 不会执行
- finally 只在没发生异常时才执行
answer: 0
explain: finally 的语义就是"无论是否发生异常都会执行"，常用于释放资源、关闭文件等清理动作。
```

```quiz
type: choice
q: 想在代码里用别人写好的第三方库，正确的两步是？
options:
- 先 import，再用 pip 安装
- 先 pip install，再 import
- 只要 pip install 一次，以后所有项目都能直接 import
- import 会自动联网下载所需的库
answer: 1
explain: 先用 pip install 把包装到当前环境，再用 import 导入。pip 装的是环境级别的，不同虚拟环境需要分别安装。
```

```quiz
type: choice
q: 列表推导式 [x*x for x in range(5) if x % 2 == 0] 的结果是？
options:
- [0, 1, 4, 9, 16]
- [0, 4, 16]
- [0, 4]
- [4, 16]
answer: 1
explain: range(5) 是 0~4，其中偶数是 0、2、4，平方后分别是 0、4、16。
```

```quiz
type: choice
q: a = [1, 2, 3]，b = ['x', 'y', 'z']，则 list(zip(a, b)) 的结果是？
options:
- [(1, 'x'), (2, 'y'), (3, 'z')]
- [[1, 'x'], [2, 'y'], [3, 'z']]
- [(1, 2, 3), ('x', 'y', 'z')]
- [1, 'x', 2, 'y', 3, 'z']
answer: 0
explain: zip 把多个序列按下标一一配对，生成的是由元组组成的迭代器，转成列表即为 [(1,'x'),(2,'y'),(3,'z')]。
```

```quiz
type: choice
q: sorted([3, 1, 2]) 执行后，原列表的值是什么？
options:
- [1, 2, 3]
- [3, 1, 2]
- None
- 报错
answer: 1
explain: sorted 返回一个新的排好序的列表，不会修改原列表；会修改原列表的是列表的 sort 方法。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数，输入一个列表，返回其中的所有偶数（用列表推导式实现）
func: even_numbers
starter: |
  def even_numbers(nums):
      return []
cases: |
  [1, 2, 3, 4, 5, 6] -> [2, 4, 6]
  [1, 3, 5] -> []
  [] -> []
  [0, -2, 7] -> [0, -2]
hint: 用 [x for x in nums if x % 2 == 0] 一行搞定。
explain: 列表推导式加条件过滤是最地道、最简洁的写法，比手写的 for 循环更 Pythonic。
```

```quiz
type: function
q: 写一个函数，安全地读取文件并返回内容；若文件不存在或读取出错，返回错误信息字符串而不是让程序崩溃
func: safe_read
starter: |
  def safe_read(filename):
      return ""
cases: |
  __file_exists__ -> "ok"
  "肯定不存在的文件.txt" -> "读取失败"
hint: 用 try/except 包住 open 和 read，捕获 FileNotFoundError 等异常，在 except 里返回"读取失败"。
explain: 防御式编程的核心就是"预期会出错的地方先 try 起来"，让程序优雅降级而不是崩溃。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"命令行通讯录"：支持添加联系人（姓名、电话、分组）、按姓名查找、按分组列出所有人，并把数据持久化保存到文件里。重启程序后数据仍在。
checklist:
- 用嵌套字典或列表存放通讯录数据，结构清晰
- 实现"添加 / 查找 / 按分组列出"三个核心功能，用函数拆分职责
- 用 def 给每个功能封装成函数，参数和返回值明确
- 用 try/except 处理用户输入非法（如电话非数字）时的异常
- 用 with open 把通讯录数据写入文件，程序启动时再读回
- 用列表推导式或 filter 实现按分组筛选
- 代码能真正跑通一个完整的"添加 → 保存 → 重启 → 读取 → 查找"流程
starter: |
  contacts = {}   # 结构自行设计，例如 {"好友": [{"name": ..., "phone": ...}, ...]}

  def add_contact(name, phone, group):
      pass

  def find_by_name(name):
      pass

  def list_by_group(group):
      pass

  # 实现文件保存与加载，并跑通一个完整的演示流程
```
