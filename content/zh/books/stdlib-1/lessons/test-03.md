# 第 3 章测验：CSV

## 第一部分 · 选择题

```quiz
type: choice
q: 为什么不能用 line.split(",") 解析所有 CSV？
options:
- 因为 split 比 csv.reader 慢
- 因为 CSV 字段可能用双引号包裹含逗号或换行的内容，split 无法识别
- 因为 split 只能切空格
- 因为 CSV 必须用二进制读取
answer: 1
explain: 引号内的逗号（如 "北京,朝阳区"）应该算一个字段，split 会把它切成两段；字段内含换行也会让按行切分出错。csv 模块实现了完整的 RFC 4180 规则。
```

```quiz
type: choice
q: 用 csv.writer 写文件时，open 为什么要加 newline=""？
options:
- 为了支持中文
- 为了禁止 Python 做换行符转换，避免 Windows 上每行多一个空行
- 为了让文件变小
- 为了提高写入速度
answer: 1
explain: Windows 文本模式会把 \n 转成 \r\n，而 csv 模块自己已写 \r\n，两层叠加每行多空行。newline="" 禁用 Python 的转换，交给 csv 处理。
```

```quiz
type: choice
q: csv.DictReader 读出来的每一行是什么类型？
options:
- 列表 list
- 字典 dict，键是表头列名
- 字符串 str
- 元组 tuple
answer: 1
explain: DictReader 把表头当键，每行变成一个 {列名: 值} 的字典，取值用 row["列名"] 而不是索引。
```

```quiz
type: choice
q: 用 csv.DictWriter 写字典时，忘写 writeheader() 的后果？
options:
- 程序崩溃
- 输出的 CSV 缺少表头行，第一行直接是数据
- 所有字段变成空字符串
- 中文乱码
answer: 1
explain: writeheader() 负责输出表头行，忘调就从第一条数据开始写，读回时不知道列的含义。
```

```quiz
type: choice
q: 用 Excel 打开中文 CSV 乱码，最合适的写入编码是？
options:
- encoding="ascii"
- encoding="utf-8-sig"（带 BOM）
- encoding="latin-1"
- 不加 encoding 参数
answer: 1
explain: Excel 默认按 GBK 解码，纯 UTF-8 会乱码；utf-8-sig 带 BOM，Excel 据此识别 UTF-8 正确解码。
```

## 第二部分 · 动手题

```quiz
type: function
q: 写一个函数 read_csv_rows(csv_text)，接收 CSV 文本（含表头），返回一个二维列表（第一行为表头，之后为数据）。用 csv.reader + io.StringIO。
func: read_csv_rows
starter: |
  import csv
  import io

  def read_csv_rows(csv_text):
      reader = csv.reader(io.StringIO(csv_text))
      return list(reader)
cases:
- 'name,age\n张三,28\n' -> [['name', 'age'], ['张三', '28']]
- 'a,b,c\n1,2,3\n' -> [['a', 'b', 'c'], ['1', '2', '3']]
hint: list(reader) 直接拿到所有行。
explain: csv.reader 把文本解析成二维列表，是列表形式处理 CSV 的基础。
```

```quiz
type: function
q: 写一个函数 add_column_total(rows)，接收 csv.reader 读出的二维列表（第一行为表头，其余为数据，每行第二个字段是数字字符串），返回新二维列表：每个数据行末尾追加该行的 "第一个字段长度 + 数字字段" 的和（转成字符串）。表头行末尾追加 "total"。
func: add_column_total
starter: |
  def add_column_total(rows):
      result = [rows[0] + ["total"]]
      for r in rows[1:]:
          name_len = len(r[0])
          num = int(r[1])
          r.append(str(name_len + num))
          result.append(r)
      return result
cases:
- '[["name", "score"], ["张三", "10"], ["李四", "20"]]' -> [['name', 'score', 'total'], ['张三', '10', '12'], ['李四', '20', '22']]
hint: 表头直接追加 "total"，数据行追加 str(len(r[0]) + int(r[1]))。
explain: 列表形式的 CSV 处理：表头单独处理，数据行按索引取值并追加新列。
```

## 第三部分 · 小项目

```quiz
type: code
q: 实现一个 CSV 分析工具函数 analyze_csv(csv_text)，接收 CSV 文本（含表头，第一列 name，第二列 score 为数字字符串），返回一个字典：{"names": [所有姓名列表], "average": 平均分(保留1位小数), "passed": 及格人数(score>=60), "max_name": 最高分姓名}。用 csv.DictReader 读取。
starter: |
  import csv
  import io

  def analyze_csv(csv_text):
      reader = csv.DictReader(io.StringIO(csv_text))
      records = list(reader)
      names = [r["name"] for r in records]
      scores = [int(r["score"]) for r in records]
      if not scores:
          return {}
      average = round(sum(scores) / len(scores), 1)
      passed = sum(1 for s in scores if s >= 60)
      max_idx = scores.index(max(scores))
      return {
          "names": names,
          "average": average,
          "passed": passed,
          "max_name": names[max_idx],
      }

  # 测试
  text = 'name,score\n张三,85\n李四,55\n王五,92\n'
  print(analyze_csv(text))
tests:
- assert '85.5' in __out or '85.5' in __out
- assert '2' in __out
- assert '王五' in __out
hint: 列表推导提姓名和分数，sum/len 算平均，count 及格，index+max 找最高分姓名。
explain: 综合 DictReader 读取、列表推导、聚合统计，是 CSV 数据处理流程的完整演练。
```
