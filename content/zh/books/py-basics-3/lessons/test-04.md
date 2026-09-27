# 第 4 章 · 模块与 import · 大测验

> 8 道题。这一章让代码从"一个文件"变成"有组织的项目"。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 在 Python 里，"模块"是什么？
options:
- 一个特殊的函数
- 一个 .py 文件
- 一个文件夹
- 一个类
answer: 1
explain: 模块就是一个 .py 文件。装模块的文件夹叫"包"（package），一堆包组成"库"（library）。这三个层次常被混用，要分清。
```

```quiz
type: choice
q: 为什么不推荐 from 模块 import *？
options:
- 会报错
- 不知道导入了什么、容易覆盖已有名字，且看不出函数来自哪个模块
- 运行慢
- 只能导入函数
answer: 1
explain: import * 有两个致命问题：① 把模块里所有名字倒进当前空间，可能悄悄覆盖你已定义的函数；② 看代码时看不出 add() 来自哪个模块。调试时这两点会让人抓狂。
```

```quiz
type: choice
q: if __name__ == "__main__": 的作用是什么？
options:
- 定义主函数
- 区分"被 import"和"直接运行"：只有直接运行本文件时下面的代码才执行
- 让代码跑得更快
- 必须写的语法
answer: 1
explain: __name__ 由 Python 自动设置：直接运行该文件时是 "__main__"，被 import 时是模块名。所以这个判断让"入口代码/测试代码"只在直接运行时执行。
```

```quiz
type: choice
q: __init__.py 的作用是什么？
options:
- 必须写，否则包不能用
- 标记这是个包；可以在里面简化导入、定义 __all__
- 存放类定义
- 存放测试代码
answer: 1
explain: Python 3.3+ 之后没有它也能当包，但仍建议保留。它的真正价值是"简化导入" —— 在里面 from .helpers import format_date，外部就能直接 from utils import format_date。
```

```quiz
type: choice
q: requirements.txt 的作用是什么？
options:
- 记录项目用了哪些第三方库及版本，让别人能一键安装
- Python 必须的配置文件
- 存放代码
- 记录代码行数
answer: 0
explain: 没有它别人拿到代码会因缺库跑不起来。生成：pip freeze > requirements.txt；安装：pip install -r requirements.txt。每个正经项目都该有。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 word_count(text)：用 collections.Counter 统计单词出现次数，返回出现最多的那个单词
func: word_count
starter: |
  def word_count(text):
      # count word frequencies with collections.Counter
      # return the single most common word
      return None
cases: |
  "a b a c a" -> "a"
hint: from collections import Counter; return Counter(text.split()).most_common(1)[0][0]。most_common 返回 [(词, 次数), ...] 的列表。
explain: Counter(...).most_common(1) 返回形如 [('a', 3)] 的列表，所以要 [0][0] 才拿到单词本身。这是标准库里最省事的计数工具 —— 比手写 dict 循环短得多。
```

```quiz
type: code
q: 用 math 模块求 2 的 10 次方（用 pow）并打印
starter: |
  import math
  
  # math.pow(2, 10) 应该是 1024.0
  
  print("在这里改")
tests:
- assert "1024" in __out
hint: print(math.pow(2, 10))。或者用内置的 2 ** 10，但这里用 math 演示模块调用。
explain: import math 后用 math.函数名 调用。模块名作为前缀，既是命名空间（避免冲突），也让读代码的人一眼看出函数来源。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「多文件的任务管理器」：拆成 config.py（常量）、storage.py（JSON 读写）、tasks.py（业务逻辑）、main.py（菜单入口），并用 if __name__ == "__main__" 保护入口
checklist:
- 至少拆成 3 个模块，各管一件事（常量 / 存储 / 逻辑）
- 用 from ... import ... 或 import ... 互相导入
- storage.py 里的读写做了异常处理（文件不存在、内容非法）
- 每个模块都有 if __name__ == "__main__": 用于自测
- main.py 提供菜单（添加/列出/完成/退出）
- 常量（如文件名、最大长度）放在 config.py 且用全大写
- 代码能跑通，没有报错
starter: |
  # config.py
  FILE = 'tasks.json'
  MAX_TITLE = 50
  
  # storage.py
  import json
  import os
  from config import FILE
  
  
  def load():
      # 文件不存在 → []；空 → []；非法 JSON → []
      pass
  
  
  def save(tasks):
      pass
  
  
  # tasks.py
  from storage import load, save
  
  
  def add(title):
      pass
  
  
  def list_all():
      pass
  
  
  # main.py
  from tasks import add, list_all
  
  
  def main():
      pass
  
  
  if __name__ == "__main__":
      main()
hint: 由于网页里只有一个文件运行，这里把各模块内容写在一个文件里即可（用注释标明分界）。重点是体现"分层"：常量 → 存储 → 逻辑 → 入口。
explain: 这个项目检验的是"组织代码"的能力 —— 同一份功能，拆成四层之后每层都很薄、很好改。__name__ == "__main__" 让每个模块既能被导入，也能单独跑自测。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
from collections import Counter


def word_count(text):
    return Counter(text.split()).most_common(1)[0][0]
```

**动手题：**

```python
import math
print(math.pow(2, 10))
```

**小项目（合在一处演示分层）：**

```python
import json
import os

# ===== config.py =====
FILE = 'tasks.json'
MAX_TITLE = 50


# ===== storage.py =====
def load():
    try:
        with open(FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return []
    if not content.strip():
        return []
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return []


def save(tasks):
    try:
        with open(FILE, 'w', encoding='utf-8') as f:
            json.dump(tasks, f, ensure_ascii=False, indent=2)
        return True
    except OSError as e:
        print(f"保存失败：{e}")
        return False


# ===== tasks.py =====
def add(title):
    title = title.strip()
    if not title:
        return "标题不能为空"
    if len(title) > MAX_TITLE:
        return f"标题不能超过 {MAX_TITLE} 字"
    tasks = load()
    tasks.append({'title': title, 'done': False})
    save(tasks)
    return f"已添加：{title}"


def list_all():
    tasks = load()
    if not tasks:
        return "还没有任务"
    lines = []
    for i, t in enumerate(tasks, 1):
        mark = '✓' if t['done'] else ' '
        lines.append(f"{i}. [{mark}] {t['title']}")
    return "\n".join(lines)


# ===== main.py =====
def main():
    while True:
        print("\n1.添加  2.列出  3.退出")
        c = input("选择：").strip()
        if c == '1':
            print(add(input("标题：")))
        elif c == '2':
            print(list_all())
        elif c == '3':
            break
        else:
            print("请输入 1~3")


if __name__ == "__main__":
    main()
```

</details>

## 这一章，你学会了什么

- **模块 = 一个 `.py` 文件**；包 = 装模块的文件夹
- **四种 import**：`import m`（推荐）、`import m as x`、`from m import f`、`from m import *`（**别用**）
- **`if __name__ == "__main__"`**：区分被导入与直接运行
- **`__init__.py`**：标记包、简化导入、定义 `__all__`
- **pip**：装第三方库；**requirements.txt** 记录依赖
- **标准库很全**：`math` `random` `datetime` `os` `json` `collections` `re` …

**下一章：类与对象**——把数据和操作打包在一起。
