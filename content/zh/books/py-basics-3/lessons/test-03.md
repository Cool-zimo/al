# 第 3 章 · 出错是常态 · 大测验

> 8 道题。这一章决定你的程序是"一碰就碎"还是"打不垮"。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 看一段 traceback，应该先读哪里？
options:
- 第一行
- 最后一行（异常类型和说明）
- 中间
- 全部都一样重要
answer: 1
explain: 最后一行才是"到底出了什么事"（如 IndexError: list index out of range），上面那些只是"怎么走到这一步"。先读最后一行定位问题，再往上找源头。
```

```quiz
type: choice
q: 为什么不推荐写裸 except:（不指定异常类型）？
options:
- 会报错
- 会把所有错误都吞掉，包括没预料到的 bug，导致真正的问题被掩盖
- 运行慢
- 只能捕获一种错误
answer: 1
explain: 裸 except 连拼写错误（NameError）、Ctrl+C 都吞掉。你永远只看到"出错了"而找不到真正的 bug。要兜底就用 Exception —— 它至少不会吞掉 Ctrl+C。
```

```quiz
type: choice
q: else 和 finally 的区别是？
options:
- 完全一样
- else 只在没出错时执行，finally 无论是否出错都执行
- else 在出错时执行
- finally 只在出错时执行
answer: 1
explain: except 出错时、else 没出错时、finally 无论如何。else 把"不需要保护的代码"挪出 try（避免掩盖其他 bug），finally 做清理工作。
```

```quiz
type: choice
q: 什么情况下应该用 raise，而不是返回 None？
options:
- 所有情况
- 当情况"不该发生"（如参数不合理）时用 raise；"没找到"这类正常情况返回 None
- 只在文件操作时
- 永远不要用 raise
answer: 1
explain: raise 表示"这个输入是错误的，程序不该继续"，比如负数年龄。"搜索没结果"是正常业务情况，返回 None 更合适 —— 用 raise 反而要每次都写 try/except。
```

```quiz
type: choice
q: 一个健壮的程序，处理问题的正确层次是？
options:
- 全部用 try/except 包起来
- 能预先检查的用 if；外部不可控的用 try/except；不该发生的情况用 raise
- 全部用 raise
- 让它崩掉，反正是用户的问题
answer: 1
explain: 三层各有其位：自己能控制的逻辑用 if 预先检查（清晰）；外部输入/文件/网络用 try/except（全面）；参数不合规用 raise 明确拒绝。好代码三层都会用。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 to_int_safe(s)：尝试把 s 转成整数，成功返回该整数；失败返回 None
func: to_int_safe
starter: |
  def to_int_safe(s):
      # try to convert s to an int and return it
      # return None if it cannot be converted
      return None
cases: |
  "42" -> 42
hint: try: return int(s) except (ValueError, TypeError): return None。注意 None 本身也会让 int() 抛 TypeError。
explain: 类型转换是 ValueError 的高发区。捕获 ValueError（值不对）和 TypeError（类型就不对，比如传了 None）两种情况，返回 None 表示"转不动" —— 比让程序崩掉友好得多。
```

```quiz
type: code
q: 用 try/except/finally：int("abc") 失败时打印"转换失败"，无论如何打印"清理完成"
starter: |
  try:
      n = int("abc")
  except ValueError:
      print("转换失败")
  finally:
      print("在这里改")
tests:
- assert "清理完成" in __out and "转换失败" in __out
hint: finally: 后面写 print("清理完成")。finally 无论是否出错、有无 return 都执行。
explain: finally 是"无论如何都执行"的部分 —— 常用于关闭文件、断开连接。with 语句本质上就是 try/finally 的语法糖。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「打不垮的成绩管理器」：能添加学生成绩、查看全部、算平均分、保存到 JSON 并从 JSON 加载；要求——成绩输入非数字或超出 0~100 要提示重来、姓名不能为空、没有数据时点平均分不崩、文件不存在或损坏都能正常启动
checklist:
- 写一个 input_number 函数（while True + try/except，支持 min/max 范围）
- 添加时校验姓名非空、成绩在 0~100
- 平均分在没有数据时给出提示而不是崩溃
- 用 json 保存和加载（ensure_ascii=False, indent=2）
- 加载时处理三种情况：文件不存在、文件为空、内容不是合法 JSON
- 保存失败（OSError）时给出提示而不崩
- 用 while True + input 做菜单
starter: |
  import json
  
  FILE = 'students.json'
  
  
  def input_number(prompt, min_val=None, max_val=None):
      # while True: 读输入 → try 转 float → 失败 continue → 检查范围 → return
      pass
  
  
  def load():
      # FileNotFoundError → {}；空内容 → {}；JSONDecodeError → {}
      pass
  
  
  def save(data):
      # json.dump；捕获 OSError 返回 False
      pass
  
  
  students = load()
  
  while True:
      print("\n1.添加  2.查看  3.平均分  4.保存  5.退出")
      c = input("选择：")
      # ...
hint: 平均分那段用 if not students 提前返回；加载用三个 except 分别处理；input_number 里转换失败用 continue 重来。
explain: 这是第 3 章的总检验 —— "打不垮"的意思是把每一种用户可能做的傻事都考虑到：非数字、超范围、空姓名、空数据、坏文件。做完它，你写程序的档次会明显不一样。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
def to_int_safe(s):
    try:
        return int(s)
    except (ValueError, TypeError):
        return None
```

**动手题：**

```python
try:
    n = int("abc")
except ValueError:
    print("转换失败")
finally:
    print("清理完成")
```

**小项目：**

```python
import json

FILE = 'students.json'


def input_number(prompt, min_val=None, max_val=None):
    while True:
        raw = input(prompt).strip()
        try:
            n = float(raw)
        except ValueError:
            print("  ✗ 请输入数字")
            continue
        if min_val is not None and n < min_val:
            print(f"  ✗ 不能小于 {min_val}")
            continue
        if max_val is not None and n > max_val:
            print(f"  ✗ 不能大于 {max_val}")
            continue
        return n


def load():
    try:
        with open(FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return {}
    except PermissionError:
        print("没有权限读取")
        return {}
    if not content.strip():
        return {}
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("文件损坏，以空数据启动")
        return {}


def save(data):
    try:
        with open(FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except OSError as e:
        print(f"保存失败：{e}")
        return False


students = load()
print(f"已载入 {len(students)} 名学生")

while True:
    print("\n1.添加  2.查看  3.平均分  4.保存  5.退出")
    choice = input("选择：").strip()

    if choice == '1':
        name = input("姓名：").strip()
        if not name:
            print("  ✗ 姓名不能为空")
            continue
        score = input_number("成绩：", 0, 100)
        students[name] = score
        print(f"  ✓ 已添加 {name}")

    elif choice == '2':
        if not students:
            print("  还没有学生")
        for n, s in students.items():
            print(f"  {n}: {s}")

    elif choice == '3':
        if not students:
            print("  还没有成绩")
        else:
            avg = sum(students.values()) / len(students)
            print(f"  平均分：{avg:.1f}")

    elif choice == '4':
        if save(students):
            print("  ✓ 已保存")

    elif choice == '5':
        save(students)
        print("再见")
        break

    else:
        print("  请输入 1~5")
```

</details>

## 这一章，你学会了什么

- **异常是什么**：程序遇问题时的"停下并报告"；**读报错从最后一行读起**
- **`try/except`**：接住错误；**别用裸 except**；`as e` 拿详情；多个 except 时具体的写前面
- **`else` / `finally`**：前者没出错时执行，后者无论如何都执行（`with` 就是它的语法糖）
- **`raise`**：主动说"不行"，常用于参数校验；自定义异常继承 `Exception`
- **三个层次**：预先检查（if）→ 接住（try/except）→ 主动拒绝（raise）

**下一章：模块与 import**——把代码拆成多个文件来组织。
