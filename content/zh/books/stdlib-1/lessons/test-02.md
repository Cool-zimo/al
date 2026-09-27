# 第 2 章测验：JSON 进阶

## 第一部分 · 选择题

```quiz
type: choice
q: 嵌套 JSON 里想取 data["users"][0]["address"]["city"]，如果中间某一层可能是 None 或不存在，最稳妥的写法是？
options:
- 一层层用 [] 硬取，报错就让用户重试
- 用 get 链式调用或 try/except 包裹，避免 KeyError
- 先把整个对象转成字符串再正则匹配
- 用 list 代替 dict
answer: 1
explain: 链式硬取任何一层缺失都会抛 KeyError；用 d.get("users", []) 或 try/except 能安全处理缺失键，是嵌套取值的标准防御。
```

```quiz
type: choice
q: json.dumps 的 default 参数作用是？
options:
- 指定反序列化时的默认值
- 当遇到无法序列化的对象时，调用该函数把它转成可序列化的值
- 设置字典的默认键
- 当 JSON 里缺字段时用它补默认值
answer: 1
explain: default 是一个函数，接收不可序列化的对象，返回一个可序列化的替代值（如把 date 转成 ISO 字符串）。它不是给"缺字段"补默认值。
```

```quiz
type: choice
q: 关于 JSON 表达不了的东西，下列正确的是？
options:
- JSON 能表达 Python 里的所有数据类型
- JSON 表达不了 datetime、bytes、set、循环引用
- JSON 能表达循环引用，只是写法复杂
- JSON 能表达二进制，会自动 base64
answer: 1
explain: JSON 只有六种类型（对象、数组、字符串、数字、布尔、null），datetime、bytes、set、循环引用都无对应类型，需手动处理。
```

```quiz
type: choice
q: 下面哪段 JSON 是合法的？
options:
- "name": "张三", "age": 28
- {"name": "张三", "age": 28}
- {'name': '张三', 'age': 28}
- {name: "张三", age: 28}
answer: 1
explain: JSON 必须是完整对象（或数组），键和字符串都用双引号，不能用单引号，键也不能不加引号。
```

```quiz
type: choice
q: 配置文件读写时，用户只提供了部分字段（缺 page_size），最合理的补全方式是？
options:
- 让程序崩溃，提示字段不全
- 用默认值字典先打底，再用用户配置 update 覆盖
- 给缺失字段填 None
- 删掉配置文件重新创建
answer: 1
explain: dict(DEFAULTS) 先建全量默认值，再用用户配置 update，缺失键自动保持默认、存在的键被覆盖，这是配置合并的标准写法。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 safe_parse(json_str)，尝试解析 JSON 字符串。解析成功返回解析后的对象；解析失败（JSONDecodeError）返回字符串 "PARSE_ERROR"；输入不是字符串返回 "BAD_INPUT"。
func: safe_parse
starter: |
  import json

  def safe_parse(json_str):
      if not isinstance(json_str, str):
          return "BAD_INPUT"
      try:
          return json.loads(json_str)
      except json.JSONDecodeError:
          return "PARSE_ERROR"
cases:
- '{"a": 1}' -> {'a': 1}
- '{bad json}' -> 'PARSE_ERROR'
- 42 -> 'BAD_INPUT'
hint: 先判断类型，再 try/except JSONDecodeError。
explain: 分层防御——先校验输入类型，再捕获解析异常，返回明确的标记值，调用方据此分支处理。
```

```quiz
type: function
q: 写一个函数 nested_sum(data)，接收任意 JSON 反序列化后的结构（可能是数字、列表、或列表的嵌套），返回所有数字的总和。如果不是数字也不是列表，返回 0。
func: nested_sum
starter: |
  def nested_sum(data):
      if isinstance(data, (int, float)):
          return data
      if isinstance(data, list):
          return sum(nested_sum(x) for x in data)
      return 0
cases:
- '[1, 2, [3, 4], 5]' -> 15
- '42' -> 42
- '[]' -> 0
hint: 递归：数字是 base case，列表就逐项递归求和。
explain: 递归处理任意嵌套深度是处理 JSON 树形结构的核心技巧，配合 isinstance 做类型分派。
```

## 第三部分 · 小项目

```quiz
type: code
q: 实现一个"用户配置"模块，包含两个函数。load_config(path) 模拟读取：接收配置字典（模拟已读出的 JSON），与默认配置 {"theme": "light", "page_size": 20, "notifications": True} 合并——默认打底、用户覆盖。save_config(config) 模拟保存：接收一个字典，返回它的 JSON 字符串（ensure_ascii=False, indent=2），并校验所有值的类型必须是 str/int/float/bool 之一，发现非法类型返回字符串 "INVALID_VALUE"。
starter: |
  import json

  DEFAULTS = {
      "theme": "light",
      "page_size": 20,
      "notifications": True,
  }

  def load_config(user_cfg):
      cfg = dict(DEFAULTS)
      if isinstance(user_cfg, dict):
          cfg.update(user_cfg)
      return cfg

  def save_config(config):
      for v in config.values():
          if not isinstance(v, (str, int, float, bool)):
              return "INVALID_VALUE"
      return json.dumps(config, ensure_ascii=False, indent=2)

  # 测试
  cfg = load_config({"theme": "dark"})
  print(cfg)
  print(save_config(cfg))
tests:
- assert 'dark' in __out
- assert '20' in __out
- assert 'notifications' in __out
hint: load_config 用 {**DEFAULTS, **user_cfg} 或先拷贝再 update；save_config 遍历值做 isinstance 校验。
explain: 综合了配置合并（默认值打底+覆盖）、JSON 序列化参数、以及写入前的合法性校验，是一个完整的小型配置读写模块。
```
