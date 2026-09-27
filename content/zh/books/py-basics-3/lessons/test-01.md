# 第 1 章 · 文件：让数据活过关机 · 大测验

> 8 道题。这一章解决的是"程序一关数据就没了"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 程序运行结束后，变量里的数据为什么会消失？
options:
- Python 主动删除了它
- 变量存在内存中，程序结束内存被回收；要长期保存必须写入文件到硬盘
- 变量名冲突了
- 电脑太慢了
answer: 1
explain: 内存（RAM）在程序结束或断电后就被回收，里面的一切都不复存在。硬盘则不同 —— 数据写入文件后会一直保留到你主动删除。这就是"持久化"。
```

```quiz
type: choice
q: 用 'w' 模式打开一个已有文件，会发生什么？
options:
- 打开失败，因为文件已存在
- 文件原有内容立刻被清空
- 内容被追加到末尾
- 什么都不会发生
answer: 1
explain: 'w' 是三种模式里最危险的 —— 打开文件的瞬间就清空全部内容，哪怕你最后什么都没写。想保留原内容用 'a'（追加），想防止误覆盖用 'x'（文件存在则报错）。
```

```quiz
type: choice
q: f.write("第一行") 和 f.write("第二行") 连着写，文件里会是什么样？
options:
- 两行
- 挤成一行"第一行第二行"，因为 write() 不会自动加换行
- 报错
- 第二行覆盖第一行
answer: 1
explain: write() 完全按你给的字符串写，一个字符都不多加 —— 换行必须自己写 \n。这和 print() 不同，print 默认追加一个换行。
```

```quiz
type: choice
q: 读进来的一行末尾为什么会有 \n？直接 print 会多出空行怎么办？
options:
- 文件损坏了
- 行尾的换行符被一起读进来了；用 rstrip() 或 print(line, end='') 处理
- Python 自动加的
- 编码问题
answer: 1
explain: 文件里的换行是真实存在的字符 \n，读的时候会一起读进来。print 又会再追加一个换行，于是出现空行。解法：line.rstrip() 去掉右侧空白，或 print(line, end='') 让 print 别再加。
```

```quiz
type: choice
q: 想复制一张图片，应该用哪种模式？
options:
- 'r' 和 'w'
- 'rb' 和 'wb'（二进制模式）
- 'a'
- 'x'
answer: 1
explain: 图片、音频、视频都是二进制数据，用文本模式打开会被损坏（Python 会尝试按编码解释字节）。必须用 'rb' / 'wb'，而且二进制模式不要加 encoding 参数。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 count_lines(filename)：读文件返回它的行数（文件不存在时返回 0）
func: count_lines
starter: |
  def count_lines(filename):
      # read the file and return how many lines it has
      # if the file does not exist, return 0
      return None
cases: |
  "t.txt" -> 3
hint: try: with open(filename, encoding='utf-8') as f: return len(f.readlines()) except FileNotFoundError: return 0。用 try/except 处理"文件不存在"。
explain: 读一个可能不存在的文件，标准做法就是 try/except FileNotFoundError。readlines() 返回列表，len() 即行数；空文件返回 0，不用额外判断。
```

```quiz
type: code
q: 用 'a' 模式往 log.txt 追加 "new"，再读出全部内容并打印（应同时含 old 和 new）
starter: |
  with open('log.txt', 'w', encoding='utf-8') as f:
      f.write("old\n")
  
  # 用 'a' 模式追加 "new\n"
  # 再用 'r' 读出来
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "new" in __out and "old" in __out
hint: with open('log.txt','a',encoding='utf-8') as f: f.write("new\n")；然后 with open('log.txt','r',encoding='utf-8') as f: print(f.read())。
explain: 追加模式是写日志的标准做法 —— 每次运行把新内容加到末尾，历史记录都还在。对比 'w'：它会在打开瞬间清空，只留最后写的那次。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「通讯录」：能把姓名和电话追加保存到文件、能列出全部联系人、能按关键词搜索；文件不存在或为空时给出友好提示而不是崩溃
checklist:
- 用 'a' 模式追加保存联系人（格式如 "张三,13800138000"）
- 用 'r' 模式 + readlines() 读出全部
- 搜索功能用 `if 关键词 in line` 逐行过滤
- 文件不存在时用 os.path.exists 或 try/except 处理，不崩溃
- 文件为空时给出"还没有联系人"的提示
- 用 while True + input 做成菜单（1 添加 / 2 查看 / 3 搜索 / 4 退出）
- 代码能跑通，没有报错
starter: |
  import os
  
  FILE = 'contacts.txt'
  
  
  def add():
      name = input("姓名：")
      phone = input("电话：")
      # 'a' 模式追加写入 f"{name},{phone}\n"
      with open(FILE, 'a', encoding='utf-8') as f:
          f.write(f"{name},{phone}\n")
      print("已保存")
  
  
  def show():
      # 文件不存在 → 提示；存在但为空 → 提示
      # 否则逐行显示，带行号
      pass
  
  
  def search():
      key = input("搜索关键词：")
      # 逐行 if key in line
      pass
  
  
  while True:
      print("\n1.添加  2.查看  3.搜索  4.退出")
      c = input("选择：")
      if c == '1':
          add()
      elif c == '2':
          show()
      elif c == '3':
          search()
      elif c == '4':
          break
hint: 读取前先 os.path.exists(FILE) 判断；读出来后 if not lines 判空。搜索用 for line in lines: if key in line: print(line.rstrip())。
explain: 这个项目把第 1 章串成一件能用的东西 —— 关键是那两个边界处理：文件不存在、文件为空。真实程序崩掉，八成是因为没考虑这两种情况。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
def count_lines(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except FileNotFoundError:
        return 0
```

**动手题：**

```python
with open('log.txt', 'a', encoding='utf-8') as f:
    f.write("new\n")

with open('log.txt', 'r', encoding='utf-8') as f:
    print(f.read())
```

**小项目：**

```python
import os

FILE = 'contacts.txt'


def add():
    name = input("姓名：").strip()
    phone = input("电话：").strip()
    if not name or not phone:
        print("姓名和电话都不能为空")
        return
    with open(FILE, 'a', encoding='utf-8') as f:
        f.write(f"{name},{phone}\n")
    print("已保存 ✓")


def load():
    """读全部联系人；文件不存在或为空都返回空列表"""
    if not os.path.exists(FILE):
        return []
    with open(FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return [line.rstrip() for line in lines if line.strip()]


def show():
    contacts = load()
    if not contacts:
        print("还没有联系人")
        return
    print("\n--- 通讯录 ---")
    for i, c in enumerate(contacts, 1):
        print(f"{i}. {c}")


def search():
    key = input("搜索关键词：").strip()
    contacts = load()
    found = [c for c in contacts if key in c]
    if not found:
        print(f"没有找到含「{key}」的联系人")
        return
    print(f"\n找到 {len(found)} 条：")
    for c in found:
        print(" ", c)


while True:
    print("\n1.添加  2.查看  3.搜索  4.退出")
    choice = input("选择：").strip()
    if choice == '1':
        add()
    elif choice == '2':
        show()
    elif choice == '3':
        search()
    elif choice == '4':
        print("再见")
        break
    else:
        print("请输入 1~4")
```

</details>

## 这一章，你学会了什么

- **为什么需要文件**：变量在内存、程序结束即消失；文件在硬盘、关机还在
- **三种模式**：`'r'` 读（不存在会报错）、`'w'` 写（**会清空**）、`'a'` 追加（安全）
- **四种读法**：`read()` 全文、`readline()` 一行、`readlines()` 列表、**`for line in f` 最推荐**
- **写文件**：`write()` **不自动换行**，只能写字符串，数字要转
- **边界情况**：文件不存在、文件为空——真实程序最容易在这两种情况下崩溃

**下一章：`with` 语句与文件路径**——让文件操作更安全、更省心。
