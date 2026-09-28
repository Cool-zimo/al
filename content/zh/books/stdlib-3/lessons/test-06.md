# 第 6 章 · 综合实战 · 大测验

> 8 道题。这一章把前五章的东西拼成了一个能跑的工具：正则解析、Counter 统计、多格式输出、logging、argparse、unittest。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 做一个日志分析工具时，把「解析」「统计」「输出」分成三层，最大的好处是什么？
options:
- 代码行数更少
- 各层可以单独替换和测试，比如换了日志格式只改解析层，统计和输出都不用动
- 运行速度更快
- 可以少写注释
answer: 1
explain: 分层的价值在于解耦。日志格式变了只改解析层，想从控制台输出改成导出 JSON 只改输出层。如果全写在一个函数里，任何一处改动都要牵动全部——而且没法单独测试某一层的逻辑对不对。
```

```quiz
type: choice
q: 解析日志时遇到一行格式不对的记录，最好的处理方式是？
options:
- 直接 raise ValueError 终止程序，让问题暴露出来
- 把这一行收进「失败列表」，继续处理后面的行，最后报告有多少行没解析成功
- 静默跳过，什么都不记
- 返回一个空字符串假装成功
answer: 1
explain: 真实日志文件里几乎总有脏行。因为一行坏掉就终止整个分析，等于让工具不可用。正确做法是收集失败行继续跑，最后在报告里说明「1000 行里成功了 987 行，13 行格式无法识别」——这既让工具能用，也让问题可见。静默跳过则是把问题藏起来，最不可取。
```

```quiz
type: choice
q: 要统计日志里各级别（ERROR/INFO/WARN）出现的次数，最合适的做法是？
options:
- 对每个级别调用一次 list.count()
- 用普通 dict 手写 if key in dict 的判断
- 用 collections.Counter 一次遍历
- 先 sorted 排序再手动数
answer: 2
explain: Counter 一次遍历就能把所有级别都数出来，代码一行，而且自带 most_common() 拿 Top N。list.count() 对每个级别都要扫一遍全表，是 O(n×k)；手写 dict 判断没错但啰嗦；先排序更是把 O(n) 变成 O(n log n)。
```

```quiz
type: choice
q: 用 json.dumps 导出含中文的统计结果时，想要看到中文而不是 \uXXXX，应该？
options:
- json.dumps(data) 默认就能输出中文
- json.dumps(data, ensure_ascii=False)
- json.dumps(data, encoding="utf-8")
- 先把中文转成 bytes 再 dumps
answer: 1
explain: ensure_ascii 默认为 True，会把所有非 ASCII 字符转义成 \uXXXX。设成 False 才会直接输出中文。注意 encoding 不是 json.dumps 的参数——这是很多人记混的地方，编码是在写文件时（open 的 encoding=）才指定的。
```

```quiz
type: choice
q: argparse 里想让一个位置参数「可以不传，不传就是 None」，应该设置？
options:
- required=False
- nargs="?"
- optional=True
- action="store_true"
answer: 1
explain: 位置参数默认是必填的，给它加 nargs="?" 就变成可选（不传时为 default 指定的值，没设 default 则为 None）。required=False 只对可选参数（--xxx 那种）有意义；optional 和 store_true 都不是这么用的——store_true 是让一个开关参数出现即为 True。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 parse_log_lines(lines)：接收日志行的字符串列表，返回 {"entries": [...], "failed": [...]}。每行成功解析的格式为「2026-01-15 10:23:45 [ERROR] [auth] 登录失败」，解析出的每项为 {"timestamp":..., "level":..., "module":..., "message":...}。格式不对的行（含空行）放进 failed，不要抛异常
func: parse_log_lines
starter: |
  import re

  PATTERN = re.compile(
      r'^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})'
      r' \[([A-Z]+)\] \[(\w+)\] (.+)$'
  )

  def parse_log_lines(lines):
      entries = []
      failed = []
      for line in lines:
          # 先 strip，空行和格式不对的都归入 failed
          m = PATTERN.match(line.strip())
          if not m:
              failed.append(line)
              continue
          entries.append({
              "timestamp": m.group(1),
              "level": m.group(2),
              "module": m.group(3),
              "message": m.group(4),
          })
      return {"entries": entries, "failed": failed}
cases: |
  ["2026-01-15 10:23:45 [ERROR] [auth] 登录失败", "坏行", ""] -> {"entries": [{"timestamp": "2026-01-15 10:23:45", "level": "ERROR", "module": "auth", "message": "登录失败"}], "failed": ["坏行", ""]}
hint: 空行 strip 之后是空字符串，正则 match 不上，自然就进 failed 了——不用单独判断空行。分组用 () 捕获，非捕获用 (?:)，这里四个字段都要留下所以用捕获组。
explain: 这就是解析层的标准写法：一行一行地试，成功就结构化，失败就收集起来，绝不让单行的问题中断整批处理。注意 level 用 [A-Z]+ 而不是具体枚举级别，这样新增一个 DEBUG 级别也不用改代码。
```

```quiz
type: function
q: 写 analyze(entries)：接收已解析好的字典列表，返回统计字典，含三项：level_counts（各级别数量）、hourly_errors（ERROR 级别按小时统计，key 是两位小时字符串如 "10"）、top_errors（错误消息 Top 3，格式为 [(消息, 次数), ...]）
func: analyze
starter: |
  from collections import Counter

  def analyze(entries):
      level_counts = dict(Counter(e["level"] for e in entries))
      hourly_errors = dict(Counter(
          e["timestamp"][11:13]
          for e in entries if e["level"] == "ERROR"
      ))
      top_errors = Counter(
          e["message"] for e in entries if e["level"] == "ERROR"
      ).most_common(3)
      return {
          "level_counts": level_counts,
          "hourly_errors": hourly_errors,
          "top_errors": top_errors,
      }
cases: |
  [{"timestamp": "2026-01-15 10:00:00", "level": "ERROR", "module": "auth", "message": "登录失败"}, {"timestamp": "2026-01-15 10:05:00", "level": "ERROR", "module": "db", "message": "连接超时"}, {"timestamp": "2026-01-15 10:10:00", "level": "INFO", "module": "order", "message": "ok"}, {"timestamp": "2026-01-15 11:00:00", "level": "ERROR", "module": "auth", "message": "登录失败"}, {"timestamp": "2026-01-15 11:05:00", "level": "WARN", "module": "db", "message": "慢查询"}, {"timestamp": "2026-01-15 11:10:00", "level": "ERROR", "module": "payment", "message": "超时"}] -> {"level_counts": {"ERROR": 4, "INFO": 1, "WARN": 1}, "hourly_errors": {"10": 2, "11": 2}, "top_errors": [["登录失败", 2], ["连接超时", 1], ["超时", 1]]}
hint: 小时从 timestamp 的第 11 到 13 位取（"2026-01-15 10:00:00" 里 "10" 正好是 [11:13]）。top_errors 用 most_common(3)。
explain: 三个统计各用一次 Counter 就够，总共只遍历数据三遍，比手写循环清晰得多。hourly_errors 的 key 用字符串而不是整数，是为了导出 JSON 时键名不会变成数字——JSON 的键必须是字符串。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「迷你日志分析器」：把本章的解析层、统计层、输出层拼成一个单文件模块，并给它配上测试。
checklist:
- parse(lines) 能解析标准格式日志行，返回 (entries, failed) 两个列表，坏行不抛异常
- stats(entries) 返回 level_counts / hourly_errors / top_errors 三项统计
- to_json(stats) 返回 JSON 字符串，用了 ensure_ascii=False 所以中文能正常显示
- main(argv) 用 argparse 提供 analyze 和 export 两个子命令
- 用 logging 记录工具自身的运行信息（如「读取了 N 行，失败 M 行」），级别用 INFO
- 至少 3 个 unittest 用例覆盖 parse / stats / to_json
- 有 if __name__ == "__main__": 入口
starter: |
  import re
  import json
  import logging
  import argparse
  from collections import Counter

  logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
  log = logging.getLogger("logalyzer")

  PATTERN = re.compile(
      r'^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[([A-Z]+)\] \[(\w+)\] (.+)$'
  )


  def parse(lines):
      """解析层：把日志行变成结构化数据，坏行单独收集"""
      entries, failed = [], []
      for line in lines:
          m = PATTERN.match(line.strip())
          if not m:
              failed.append(line)
              continue
          entries.append({
              "timestamp": m.group(1),
              "level": m.group(2),
              "module": m.group(3),
              "message": m.group(4),
          })
      return entries, failed


  def stats(entries):
      """统计层：三个维度"""
      return {
          "level_counts": dict(Counter(e["level"] for e in entries)),
          "hourly_errors": dict(Counter(
              e["timestamp"][11:13] for e in entries if e["level"] == "ERROR"
          )),
          "top_errors": Counter(
              e["message"] for e in entries if e["level"] == "ERROR"
          ).most_common(3),
      }


  def to_json(data):
      """输出层：导出 JSON"""
      return json.dumps(data, ensure_ascii=False, indent=2)


  def main(argv=None):
      p = argparse.ArgumentParser(prog="logalyzer")
      sub = p.add_subparsers(dest="cmd")

      a = sub.add_parser("analyze", help="输出控制台报告")
      a.add_argument("--input", required=True)

      e = sub.add_parser("export", help="导出结构化文件")
      e.add_argument("--input", required=True)
      e.add_argument("--format", choices=["json", "csv"], default="json")

      args = p.parse_args(argv)
      if not args.cmd:
          p.print_help()
          return

      with open(args.input, encoding="utf-8") as f:
          lines = f.read().splitlines()

      entries, failed = parse(lines)
      log.info("读取 %d 行，成功 %d 行，失败 %d 行",
               len(lines), len(entries), len(failed))

      result = stats(entries)
      if args.cmd == "analyze":
          print("级别分布：", result["level_counts"])
          print("错误高峰时段：", result["hourly_errors"])
          print("Top 错误：", result["top_errors"])
      else:
          print(to_json(result) if args.format == "json" else result)


  if __name__ == "__main__":
      main()
```
