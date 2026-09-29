# 第 2 章 · 代码质量 · 大测验

> 8 道题。这一章解决的是"怎么把代码写得让人看得懂、改得动、不出错"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于布尔变量命名，以下哪个最符合惯例？
options:
- enabled_flag = True
- is_enabled = True
- e = True
- enable = True
answer: 1
explain: is_ 前缀直接表达"是否"语义，读起来像自然语言。enabled_flag 的 _flag 后缀是冗余信息；单字母 e 看不出含义；enable 更像动词/动作。
```

```quiz
type: choice
q: 什么时候应该把一个函数拆成多个？
options:
- 函数超过 10 行就必须拆
- 当函数描述里出现"并且""然后"，或者函数内同时混杂了控制流细节和高层流程调用时
- 函数有注释就应该拆
- 参数超过 1 个就应该拆
answer: 1
explain: 判断标准是抽象层级是否统一，而非行数硬指标。函数里既写流程又写控制流细节，说明层级混乱；参数多是另一个独立问题（考虑打包成对象）。
```

```quiz
type: choice
q: 关于注释和 docstring，正确的是？
options:
- docstring 是普通注释的一种，运行时会被执行
- docstring 是 """ 包裹的字符串，能被 help() 和 IDE 读取；注释是 # 开头，运行时不可见
- 注释应该详细描述每一行代码在做什么
- 改了代码后注释不用同步更新，因为它只是参考
answer: 1
explain: docstring 是特殊字符串字面量，放在模块/类/函数开头，help() 能读到。注释讲 why 不讲 what，且必须与代码同步。
```

```quiz
type: choice
q: 关于 black 和 ruff 的定位，正确的是？
options:
- black 只做静态检查不改代码，ruff 只能格式化
- black 主要做格式化（改代码），ruff 既能格式化也能做静态检查且更快
- ruff 是用 Python 写的，速度慢但准确
- black 和 ruff 功能完全一样，用哪个都行
answer: 1
explain: black 的核心是自动格式化（改写代码）；ruff 是 Rust 写的现代化工具，同时具备格式化和 lint 能力，速度远快于同类 Python 工具。
```

```quiz
type: choice
q: 关于异常处理，正确的是？
options:
- 应该用 except: pass 吞掉所有异常，保证程序不崩溃
- assert 和 raise 效果完全一样，可以互换
- 只在能处理异常的地方捕获；不该用裸 except 吞掉异常；参数校验用 if + raise
- 自定义异常没必要，全部用 Exception 就行
answer: 2
explain: 异常只在该处理时捕获；裸 except 会吞 KeyboardInterrupt 且掩盖问题；assert 在 -O 模式下会被删除不能用于参数校验；自定义异常让调用方能精确区分错误类型。
```

## 第二部分 · 动手题

```quiz
type: function
q: 实现一个函数 refactor_name(old_name)，给出变量名重构建议。规则：如果 old_name 是单字符且在集合 {"l", "O", "I"} 中，返回 "BAD_NAME"（这些字符容易和数字混淆）；如果 old_name 是全大写的常量且全是大写字母，返回原名字（符合常量命名）；如果 old_name 是小写且全小写，返回原名字；其他情况返回 "OK"。
func: refactor_name
starter: |
  def refactor_name(old_name):
      bad = {"l", "O", "I"}
      # 在这里补全
      return "OK"
cases: |
  ("l") -> "BAD_NAME"
  ("O") -> "BAD_NAME"
  ("MAX_RETRY") -> "MAX_RETRY"
  ("user_name") -> "user_name"
  ("i") -> "OK"
hint: 先判断是否单字符且在 bad 集合里；再判断是否全大写字母（且长度>1）；再判断是否全小写字母；都不符合返回 OK。
explain: 这是命名检查的简化逻辑，用于静态分析工具提示"容易混淆的单字符命名"。
```

```quiz
type: function
q: 实现一个函数 analyze_function_body(lines)，分析一个函数体（字符串列表，每行一条语句）。返回元组 (is_pure, side_effects)：is_pure 为 True 当且仅当函数体里没有任何 "print("、"db."、"file."、"smtp." 调用（即没有 I/O 副作用）；side_effects 是检测到的副作用类型列表（按出现顺序，去重），类型包括 "print"、"db"、"file"、"smtp"。
func: analyze_function_body
starter: |
  def analyze_function_body(lines):
      effects = []
      # 在这里补全
      is_pure = len(effects) == 0
      return is_pure, effects
cases: |
  (["x = a + b", "return x * 2"]) -> (True, [])
  (["print('hi')", "db.save(x)", "smtp.send('ok')"]) -> (False, ["print", "db", "smtp"])
  (["file.write('x')", "y = 1"]) -> (False, ["file"])
hint: 逐行检查是否包含 "print("、"db."、"file."、"smtp." 子串，按序去重记录类型。
explain: 静态分析工具常需要判断函数是否纯函数、有哪些副作用，这是检测逻辑的简化版。
```

## 第三部分 · 小项目

```quiz
type: project
q: 在你的项目里选一个"大函数"（超过 50 行、或者一个函数做了三件以上事情），按本章讲的规则重构它。验收清单如下。
checklist:
- 找到函数里"并且""然后"出现的地方，按职责拆成 2~3 个小函数
- 每个函数只在一个抽象层级上工作（顶层函数读起来像流程清单）
- 给布尔变量统一加上 is_/has_/can_ 前缀
- 给拆出来的核心函数写 docstring，包含 Args、Returns、Raises
- 配置编辑器保存时自动格式化（black 或 ruff），然后对整个文件执行一次格式化
- 用 ruff 或 flake8 扫描文件，确认没有 F401（未使用 import）和 E501（行过长）问题
- 把改动拆成 2~3 个提交，每个提交只做一件事，提交信息用 Conventional Commits 格式
starter: |
  # 参考流程
  # 1. 在编辑器中保存文件，观察是否自动格式化
  # 2. 运行 ruff 检查
  ruff check your_file.py
  # 3. 按职责拆分函数，每拆一个提交一次
  git add -p
  git commit -m "refactor(xxx): 拆分 XXX 函数"
```
