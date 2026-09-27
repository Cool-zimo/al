# 第 1 章测验：JSON 基础

## 第一部分 · 选择题

```quiz
type: choice
q: 为什么程序之间交换数据需要约定一种"数据格式"（比如 JSON）？
options:
- 因为 Python 只能处理字符串
- 因为内存里的对象（列表、字典）不能直接跨语言、跨网络传递，需要变成双方都能解析的文本
- 因为文件只能用文本方式打开
- 因为 JSON 比 Python 快
answer: 1
explain: 内存里的对象结构（嵌套字典、列表）是语言私有的，跨语言/跨网络时必须序列化成双方约定的文本格式，JSON 就是这种约定之一。
```

```quiz
type: choice
q: 要把一个 Python 字典转成 JSON 字符串，应该用哪一对函数？
options:
- json.encode / json.decode
- json.dumps / json.loads
- json.dump / json.load
- json.stringify / json.parse
answer: 1
explain: dumps（dump string）把对象序列化成字符串，loads（load string）把字符串反序列化回对象；dump/load 操作的是文件对象。
```

```quiz
type: choice
q: 把 Python 元组 (1, 2, 3) 用 json.dumps 序列化后再 json.loads 回来，类型变成？
options:
- 还是元组 tuple
- 列表 list
- 集合 set
- 报错
answer: 1
explain: JSON 只有数组（array），没有元组。元组序列化后变成 JSON 数组，回来就成了 list，不可变信息丢失。
```

```quiz
type: choice
q: 下面哪个可以作为 json.dumps 的字典键？
options:
- 整数 42
- 元组 (1, 2)
- 字符串 "name"
- 列表 [1, 2]
answer: 2
explain: JSON 对象的键必须是字符串。Python 的 dict 如果用非字符串键 dumps 会报 TypeError，只有字符串键能原样序列化。
```

```quiz
type: choice
q: 写入 JSON 文件时，ensure_ascii=False 和 indent=2 的作用分别是？
options:
- ensure_ascii 控制是否压缩空格，indent 控制中文转义
- ensure_ascii=False 让中文正常显示不被转成 \uXXXX，indent=2 让输出带 2 空格缩进更好看
- 两个都是用来加速的
- ensure_ascii=False 会让文件变小
answer: 1
explain: ensure_ascii 默认为 True，中文会被转成 \u4e2d\u6587；设为 False 保留原字符。indent 控制缩进层级，让 JSON 可读。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 dict_to_json(d)，接收一个字典，返回它的 JSON 字符串表示，要求 ensure_ascii=False、indent=2。
func: dict_to_json
starter: |
  import json

  def dict_to_json(d):
      return ""
cases:
- '{"name": "张三", "city": "北京"}' -> '{\n  "name": "张三",\n  "city": "北京"\n}'
- '{"a": 1}' -> '{\n  "a": 1\n}'
hint: json.dumps(d, ensure_ascii=False, indent=2)。
explain: ensure_ascii=False 保证中文可读，indent=2 保证格式化输出，这是配置文件写入的标准写法。
```

```quiz
type: function
q: 写一个函数 json_get(data_str, key)，接收 JSON 字符串和键名，返回对应的值；如果 JSON 解析失败或键不存在，返回 None。
func: json_get
starter: |
  import json

  def json_get(data_str, key):
      try:
          d = json.loads(data_str)
          return d.get(key)
      except (json.JSONDecodeError, AttributeError):
          return None
cases:
- '{"name": "张三"}' -> 'name' -> '张三'
- '{"age": 28}' -> 'city' -> None
- 'not json' -> 'name' -> None
hint: 用 try 包裹 loads 和 get，except 返回 None。
explain: 解析+取值两步都可能失败，统一用异常捕获返回 None 是防御式编程的常见模式。
```

## 第三部分 · 小项目

```quiz
type: code
q: 实现一个"成绩表"模块。写一个函数 make_report(scores)，接收一个字典列表，每个字典含 "name"（姓名）和 "score"（分数，整数）。函数返回一个 JSON 字符串，内容是：{"count": 人数, "average": 平均分（保留 1 位小数）, "highest": 最高分记录, "lowest": 最低分记录}。其中 highest 和 lowest 是完整的字典（含 name 和 score）。要求 ensure_ascii=False。
示例输入：[{"name": "张三", "score": 88}, {"name": "李四", "score": 92}, {"name": "王五", "score": 76}]
示例输出：{"count": 3, "average": 85.3, "highest": {"name": "李四", "score": 92}, "lowest": {"name": "王五", "score": 76}}
starter: |
  import json

  def make_report(scores):
      count = len(scores)
      if count == 0:
          return json.dumps({})
      total = sum(s["score"] for s in scores)
      average = round(total / count, 1)
      highest = max(scores, key=lambda s: s["score"])
      lowest = min(scores, key=lambda s: s["score"])
      report = {
          "count": count,
          "average": average,
          "highest": highest,
          "lowest": lowest,
      }
      return json.dumps(report, ensure_ascii=False)

  # 测试
  data = [
      {"name": "张三", "score": 88},
      {"name": "李四", "score": 92},
      {"name": "王五", "score": 76},
  ]
  print(make_report(data))
tests:
- assert '85.3' in __out
- assert '李四' in __out
- assert '王五' in __out
hint: sum + len 算平均，max/min 配 key=lambda 找最高最低。
explain: 综合考察字典构造、聚合计算、json.dumps 参数，是 JSON 数据处理的基础项目。
```
