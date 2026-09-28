# 第 4 章测验 · 日志与命令行

> 这一章测验覆盖 logging 五级别、basicConfig、logger/handler/formatter、不要每模块 basicConfig、argparse 参数类型与 choices、子命令。共 8 题：5 选择 + 2 动手 + 1 小项目。

## 第一部分 · 选择题

### 1. 关于 logging 五个级别的默认行为，正确的是？

- 默认级别是 DEBUG，所有级别都会输出
- 默认级别是 WARNING，WARNING 及以上（WARNING/ERROR/CRITICAL）会输出
- 默认级别是 ERROR，只有 ERROR 和 CRITICAL 会输出
- 默认级别是 INFO，INFO 及以上都会输出

```quiz
type: choice
exam: true
q: 关于 logging 五个级别的默认行为，正确的是？
options:
- 默认级别是 DEBUG，所有级别都会输出
- 默认级别是 WARNING，WARNING 及以上（WARNING/ERROR/CRITICAL）会输出
- 默认级别是 ERROR，只有 ERROR 和 CRITICAL 会输出
- 默认级别是 INFO，INFO 及以上都会输出
answer: 1
explain: logging 的默认级别是 WARNING，所以 WARNING、ERROR、CRITICAL 会被输出，DEBUG 和 INFO 默认被屏蔽。
```

### 2. 关于 basicConfig 的正确用法，正确的是？

- 可以在每个模块里都调用 basicConfig，每个模块独立配置
- basicConfig 只在第一次 log 调用前生效，之后调用会被忽略，所以只在程序入口配置一次
- basicConfig 可以动态修改已有 logger 的级别
- basicConfig 必须每次输出日志前都调用一次

```quiz
type: choice
exam: true
q: 关于 basicConfig 的正确用法，正确的是？
options:
- 可以在每个模块里都调用 basicConfig，每个模块独立配置
- basicConfig 只在第一次 log 调用前生效，之后调用会被忽略，所以只在程序入口配置一次
- basicConfig 可以动态修改已有 logger 的级别
- basicConfig 必须每次输出日志前都调用一次
answer: 1
explain: basicConfig 是全局唯一的，只在第一次调用 logging 时生效，重复调用无效。正确做法是在程序入口配置一次。
```

### 3. 同一条日志被输出了三遍，最可能的原因是？

- 日志级别设得太高
- 同一个 logger 被重复 addHandler，且子 logger 的 propagate 为 True 导致冒泡到父 logger
- 格式字符串写错了
- 没有调用 basicConfig

```quiz
type: choice
exam: true
q: 同一条日志被输出了三遍，最可能的原因是？
options:
- 日志级别设得太高
- 同一个 logger 被重复 addHandler，且子 logger 的 propagate 为 True 导致冒泡到父 logger
- 格式字符串写错了
- 没有调用 basicConfig
answer: 1
explain: 重复输出的两大元凶：同一 logger 挂了多个 handler 都放行该级别；或子 logger 的 propagate 为 True，消息冒泡到父 logger 的 handler 又输出一遍。
```

### 4. 关于 argparse 的 choices 参数，正确的是？

- 它会自动把参数转成整数
- 它限制参数只能取指定的几个值，取错会报错
- 它设置参数的默认值
- 它决定参数是否必填

```quiz
type: choice
exam: true
q: 关于 argparse 的 choices 参数，正确的是？
options:
- 它会自动把参数转成整数
- 它限制参数只能取指定的几个值，取错会报错
- 它设置参数的默认值
- 它决定参数是否必填
answer: 1
explain: choices 用于限定参数的取值范围，用户输入不在范围内的值时，argparse 会自动生成报错信息。
```

### 5. 关于 argparse 子命令的 dest 参数，正确的是？

- dest 是可选参数，不设置也能正常获取子命令名
- dest="command" 用于记录用户选了哪个子命令，没有 dest 就没有 command 属性
- dest 用于设置子命令的默认值
- dest 用于限制子命令的参数类型

```quiz
type: choice
exam: true
q: 关于 argparse 子命令的 dest 参数，正确的是？
options:
- dest 是可选参数，不设置也能正常获取子命令名
- dest="command" 用于记录用户选了哪个子命令，没有 dest 就没有 command 属性
- dest 用于设置子命令的默认值
- dest 用于限制子命令的参数类型
answer: 1
explain: dest="command" 记录用户选了哪个子命令，解析结果中通过 args.command 获取。没有 dest 就没有 command 属性。
```

## 第二部分 · 动手题

### 6. 配置一个 logger 并添加 handler

```quiz
type: function
exam: true
q: 写一个函数 setup_logger，接收一个字符串 name。函数内创建一个名为 name 的 logger，清空已有 handler，添加一个 StreamHandler（级别 WARNING，格式 "%(levelname)s: %(message)s"），并把 logger 级别设为 DEBUG。返回该 logger 的级别数值。
func: setup_logger
starter: |
  import logging

  def setup_logger(name):
      logger = logging.getLogger(name)
      logger.handlers.clear()
      handler = logging.StreamHandler()
      handler.setLevel(logging.WARNING)
      handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
      logger.addHandler(handler)
      logger.setLevel(logging.DEBUG)
      return logger.level
cases: |
  "app" -> 10
  "test" -> 10
hint: logger.setLevel(logging.DEBUG) 后 logger.level 就是 10。
explain: 这题考的是 logger 的级别设置、handler 挂载和格式化器的配合。
```

### 7. 解析带 choices 和 store_true 的命令行参数

```quiz
type: function
exam: true
q: 写一个函数 parse_tool_args，接收列表 argv。用 argparse 定义：位置参数 "action"（choices 为 ["encrypt", "decrypt"]）、可选参数 "--key"（type=str，default="secret"）、可选参数 "--verbose"（action="store_true"）。返回字典 {"action": ..., "key": ..., "verbose": ...}。
func: parse_tool_args
starter: |
  import argparse

  def parse_tool_args(argv):
      parser = argparse.ArgumentParser()
      parser.add_argument("action", choices=["encrypt", "decrypt"])
      parser.add_argument("--key", type=str, default="secret")
      parser.add_argument("--verbose", action="store_true")
      args = parser.parse_args(argv)
      return {"action": args.action, "key": args.key, "verbose": args.verbose}
cases: |
  ["encrypt"] -> {"action": "encrypt", "key": "secret", "verbose": False}
  ["decrypt", "--key", "mykey", "--verbose"] -> {"action": "decrypt", "key": "mykey", "verbose": True}
hint: 位置参数必填，--key 有默认值，--verbose 是 store_true 开关。
explain: 这题把位置参数、choices 校验、type 转换、default 和 store_true 结合，是 argparse 综合用法。
```

## 第三部分 · 小项目

### 8. 迷你 CLI 工具：日志分析器

**项目要求**：写一个函数 `log_analyzer`，接收命令行参数列表 `argv`，用 argparse 解析以下参数：

- 位置参数 `logfile`：日志文件路径（字符串）
- 可选参数 `--level`：type=str，choices 为 `["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]，default="INFO"
- 可选参数 `--follow`：action="store_true"，是否持续监控
- 可选参数 `--limit`：type=int，default=100，最多显示多少行

返回一个字典包含解析结果：`{"logfile": ..., "level": ..., "follow": ..., "limit": ...}`。

然后**扩展功能**：定义一个子命令 `stats`，它有位置参数 `logfile` 和可选参数 `--top`（type=int，default=10，显示最频繁的 N 个错误）。子命令 `tail` 有位置参数 `logfile` 和可选参数 `--lines`（type=int，default=50）。主解析器（不带子命令）直接返回文件分析参数。

最终函数签名：`def log_analyzer(argv):`，根据 argv 第一个元素是否为子命令名来决定走哪条解析路径。返回解析后的字典。

```quiz
type: function
exam: true
q: 写一个完整的日志分析 CLI 解析器。要求：1) 主命令支持位置参数 logfile、--level（choices 五级别，default INFO）、--follow（store_true）、--limit（type=int，default 100）；2) 子命令 stats（参数 logfile 和 --top，type=int，default 10）；3) 子命令 tail（参数 logfile 和 --lines，type=int，default 50）。根据 argv 判断走主命令还是子命令，返回对应字典。
func: log_analyzer
starter: |
  import argparse

  def log_analyzer(argv):
      parser = argparse.ArgumentParser()
      parser.add_argument("logfile")
      parser.add_argument("--level", choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], default="INFO")
      parser.add_argument("--follow", action="store_true")
      parser.add_argument("--limit", type=int, default=100)

      sub = parser.add_subparsers(dest="cmd")

      p_stats = sub.add_parser("stats")
      p_stats.add_argument("logfile")
      p_stats.add_argument("--top", type=int, default=10)

      p_tail = sub.add_parser("tail")
      p_tail.add_argument("logfile")
      p_tail.add_argument("--lines", type=int, default=50)

      args = parser.parse_args(argv)

      if args.cmd == "stats":
          return {"cmd": "stats", "logfile": args.logfile, "top": args.top}
      elif args.cmd == "tail":
          return {"cmd": "tail", "logfile": args.logfile, "lines": args.lines}
      else:
          return {"logfile": args.logfile, "level": args.level, "follow": args.follow, "limit": args.limit}
cases: |
  ["app.log", "--level", "ERROR", "--limit", "50"] -> {"logfile": "app.log", "level": "ERROR", "follow": False, "limit": 50}
  ["stats", "app.log", "--top", "5"] -> {"cmd": "stats", "logfile": "app.log", "top": 5}
  ["tail", "app.log", "--lines", "20"] -> {"cmd": "tail", "logfile": "app.log", "lines": 20}
  ["app.log", "--follow"] -> {"logfile": "app.log", "level": "INFO", "follow": True, "limit": 100}
hint: 子命令通过 dest="cmd" 区分，args.cmd 为 None 时走主命令路径。
explain: 这题是本章的综合项目，把 argparse 的位置参数、choices、store_true、type、default、子命令全部串起来，模拟一个真实 CLI 工具的参数解析层。
```
