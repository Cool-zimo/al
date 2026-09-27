# 第 2 章 · with、路径与数据格式 · 大测验

> 8 道题。这一章解决"怎么安全、正确地找到并读写文件"。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 相比手写 open() + close()，with 的最大好处是什么？
options:
- 代码更短
- 离开 with 块时保证关闭文件，即使块内出错
- 运行更快
- 能同时打开多个文件
answer: 1
explain: "代码更短"也算好处，但核心是保证收尾 —— 手写 close 时只要中间报错就执行不到，数据可能丢失、文件一直被占用。with 由语言保证，出错也关闭。
```

```quiz
type: choice
q: 相对路径是相对于什么？
options:
- 相对于代码文件所在目录
- 相对于当前工作目录（运行程序时所在的目录）
- 相对于 C 盘
- 相对于 Python 安装目录
answer: 1
explain: 这是"明明文件就在旁边却找不到"的根源 —— 相对路径看的是你在哪个目录运行程序，而不是代码文件放在哪。换目录运行同一个脚本，相对路径就失效。
```

```quiz
type: choice
q: os.mkdir('a/b') 和 os.makedirs('a/b') 的区别是？
options:
- 完全一样
- makedirs 会连不存在的父目录一起创建，mkdir 不会
- mkdir 更快
- makedirs 只能建一层
answer: 1
explain: a 不存在时 mkdir('a/b') 会报错，makedirs 则把 a 和 a/b 都建出来。日常用 makedirs + exist_ok=True 最省心 —— 目录已存在也不崩。
```

```quiz
type: choice
q: 用 csv 模块写文件时，为什么必须加 newline=''？
options:
- 不加会报错
- Windows 下 csv 写的 \r\n 会被文本模式再转义一次，导致每行之间多一个空行
- 为了更快
- 为了让编码生效
answer: 1
explain: csv 模块自己写 \r\n，Windows 的文本模式又把 \n 转成 \r\n —— 变成 \r\r\n，每行之间多一个空行。newline='' 让 Python 不做这个转换。
```

```quiz
type: choice
q: json.dump 时为什么推荐加 ensure_ascii=False？
options:
- 不加会报错
- 不加的话中文会被转义成 \u5f20\u4e09，人看不懂（虽然能读回来）
- 为了压缩文件
- 为了兼容 Python 2
answer: 1
explain: 默认 json 会把非 ASCII 字符转义成 \uXXXX。数据能正确读回，但文件打开全是转义码，没法人工检查。加上 ensure_ascii=False 就直接存中文。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 read_json_safe(path)：读 JSON 文件返回对象；文件不存在或内容为空时返回空字典 {}
func: read_json_safe
starter: |
  def read_json_safe(path):
      # read the JSON file and return the object
      # return {} if the file is missing or empty
      return None
cases: |
  "u.json" -> {"name": "Ann", "age": 20}
hint: import os, json; if not os.path.exists(path): return {}; 读内容后 if not content.strip(): return {}; 再 json.loads(content)。
explain: 真实场景里 JSON 文件常有"不存在"和"空文件"两种情况，json.load 对后者会直接报错。先判断再解析是标准防御写法 —— 你的程序不该因为一个空文件就崩。
```

```quiz
type: code
q: 用 with 写入一个字典到 JSON 文件（ensure_ascii=False），再读回来打印其中的 age
starter: |
  import json
  
  user = {'name': 'Ann', 'age': 20}
  
  # with open('u.json','w',encoding='utf-8') as f:
  #     json.dump(user, f, ensure_ascii=False, indent=2)
  # 再读回来
  
  print("在这里改")
tests:
- assert "20" in __out
hint: 写用 json.dump(user, f, ensure_ascii=False, indent=2)；读用 json.load(f)，然后 print(d['age'])。
explain: 这是 JSON 持久化的最小闭环。两个关键点：ensure_ascii=False 让中文可读，indent=2 让文件有缩进便于人工检查。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「JSON 版待办清单」：任务存在 JSON 文件里（每条含 title 和 done），能添加、列出、标记完成、删除；程序重启后任务仍在；文件不存在或为空时正常启动
checklist:
- 用 json.dump / json.load 读写任务列表（ensure_ascii=False, indent=2）
- 每条任务是字典，含 title 和 done 两个字段
- 能添加新任务（追加到列表后保存）
- 能列出全部（带序号和 ✓ 标记）
- 能按序号标记完成 / 删除
- 文件不存在或为空时返回空列表，程序正常启动
- 用 while True + input 做菜单
starter: |
  import json
  import os
  
  FILE = 'tasks.json'
  
  
  def load():
      # 文件不存在 → []；内容为空 → []；否则 json.loads
      pass
  
  
  def save(tasks):
      # json.dump(tasks, f, ensure_ascii=False, indent=2)
      pass
  
  
  while True:
      print("\n1.添加  2.列出  3.完成  4.删除  5.退出")
      c = input("选择：")
      # ...
hint: load 里先 os.path.exists(FILE) 判断，读完再 if not content.strip() 判空；删除用 tasks.pop(i-1)；完成后 save(tasks) 保存。
explain: 这个项目把 JSON 持久化和边界处理（文件不存在 / 空文件）串在一起 —— 正是"能用的小程序"和"练习代码"的分界。做完它，你的程序第一次真正"记得住事"。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
import os
import json


def read_json_safe(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.strip():
        return {}
    return json.loads(content)
```

**动手题：**

```python
import json

user = {'name': 'Ann', 'age': 20}
with open('u.json', 'w', encoding='utf-8') as f:
    json.dump(user, f, ensure_ascii=False, indent=2)

with open('u.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(data['age'])
```

**小项目：**

```python
import json
import os

FILE = 'tasks.json'


def load():
    if not os.path.exists(FILE):
        return []
    with open(FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    if not content.strip():
        return []
    return json.loads(content)


def save(tasks):
    with open(FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


while True:
    print("\n1.添加  2.列出  3.完成  4.删除  5.退出")
    choice = input("选择：").strip()

    tasks = load()

    if choice == '1':
        title = input("任务内容：").strip()
        if title:
            tasks.append({'title': title, 'done': False})
            save(tasks)
            print("已添加 ✓")

    elif choice == '2':
        if not tasks:
            print("还没有任务")
        for i, t in enumerate(tasks, 1):
            mark = '✓' if t['done'] else ' '
            print(f"{i}. [{mark}] {t['title']}")

    elif choice == '3':
        n = int(input("第几个已完成？"))
        if 1 <= n <= len(tasks):
            tasks[n - 1]['done'] = True
            save(tasks)
            print("已标记 ✓")

    elif choice == '4':
        n = int(input("删除第几个？"))
        if 1 <= n <= len(tasks):
            removed = tasks.pop(n - 1)
            save(tasks)
            print(f"已删除：{removed['title']}")

    elif choice == '5':
        print("再见")
        break

    else:
        print("请输入 1~5")
```

</details>

## 这一章，你学会了什么

- **`with`**：自动关闭文件，**出错也保证**；一行可开多个文件
- **路径**：相对路径看"运行位置"而非"代码位置"；**统一用 `/`**；`os.path.join` 跨平台拼接
- **`os` 模块**：`makedirs(exist_ok=True)` 建目录、`listdir` / `walk` 遍历、`isfile` / `isdir` 判断
- **CSV**：表格数据；`DictReader` / `DictWriter` 最清楚；**写时必须 `newline=''`**
- **JSON**：嵌套结构；`dump`/`load` 管文件、`dumps`/`loads` 管字符串；**`ensure_ascii=False`**

**下一章：出错是常态**——`try` / `except` / `finally`，让程序遇到意外也不崩。
