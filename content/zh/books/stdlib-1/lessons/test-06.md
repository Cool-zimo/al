# 第 6 章 章测

> 数据管道工具 + 全书回顾综合测验

## 第一部分 · 选择题

### 1. 关于数据管道的分层设计，以下说法正确的是？

```quiz
type: choice
q: 关于数据管道的分层设计，以下说法正确的是？
options:
- 读取层和校验层可以合并，因为都在处理数据
- 分层后每层可独立测试、独立替换，出错易定位
- 分层越多程序跑得越快
- 四层必须按固定顺序执行，不能跳过
answer: 1
explain: 分层的目的是让每层单一职责、独立变化，可独立测试替换，出错时快速定位到具体层级。
```

### 2. 读取层统一输出的内部结构是什么？

```quiz
type: choice
q: 读取层统一输出的内部结构是什么？
options:
- 一个 dataclass 实例
- list[dict]，key 为标准名 id/amount/status/qty
- 一个 JSON 字符串
- 一个 CSV 文件对象
answer: 1
explain: 读取层只负责把文件变成 dict 列表，不碰业务模型。标准 key 为 id/amount/status/qty。
```

### 3. 关于校验层的错误处理策略，最佳实践是什么？

```quiz
type: choice
q: 关于校验层的错误处理策略，最佳实践是什么？
options:
- 遇到第一个错误就 raise 终止
- 收集一条记录的所有错误，最后统一出报告
- 跳过所有错误记录，不报告
- 用 print 打印每个错误
answer: 1
explain: 收集所有错误能让用户一次性看到全部问题，不用反复跑程序。直接中断只能暴露第一个问题。
```

### 4. 关于 logging 的级别，以下说法正确的是？

```quiz
type: choice
q: 关于 logging 的级别，以下说法正确的是？
options:
- DEBUG 级别最高，CRITICAL 级别最低
- 设 level=WARNING 时，INFO 和 DEBUG 的日志不会显示
- basicConfig 可以多次调用，每次都会覆盖之前的配置
- 日志只能输出到文件，不能输出到终端
answer: 1
explain: level=WARNING 表示只有 WARNING 及以上级别会输出。basicConfig 只有第一次调用生效。
```

### 5. sys.argv[0] 表示什么？

```quiz
type: choice
q: sys.argv[0] 表示什么？
options:
- 第一个命令行参数
- 脚本文件名（路径）
- 所有参数的元组
- 参数的总个数
answer: 1
explain: sys.argv[0] 是脚本路径，真正的参数从 sys.argv[1] 开始。
```

## 第二部分 · 动手题

### 6. 多格式统一

```quiz
type: function
q: 写一个函数 normalize_keys(raw_list)，接收 dict 列表，每个 dict 可能有英文 key(id/amount/status/qty) 或中文 key(订单号/金额/状态/数量)，统一转成标准 dict 列表，amount 转 str、qty 转 int。
func: normalize_keys
starter: |
  def normalize_keys(raw_list):
      return []

  data = [
      {"id": "T001", "amount": "19.90", "status": "paid", "qty": "2"},
      {"订单号": "T002", "金额": "5.00", "状态": "pending", "数量": "1"},
  ]
  print(normalize_keys(data))
cases:
- "[{'id':'T1','amount':'10','status':'paid','qty':'3'},{'订单号':'T2','金额':'20','状态':'shipped','数量':'5'}]" -> "[{'id': 'T1', 'amount': '10', 'status': 'paid', 'qty': 3}, {'id': 'T2', 'amount': '20', 'status': 'shipped', 'qty': 5}]"
hint: 用 raw.get("id") or raw.get("订单号") 兼容两种 key。
explain: 遍历每条记录，用 or 兼容英文和中文 key，amount 转 str、qty 转 int 后返回列表。
```

### 7. 校验收集错误

```quiz
type: function
q: 写函数 validate_all(records)，接收标准 dict 列表（含 id/amount/status/qty），返回 (通过列表, 失败列表)。失败列表中每个元素为 {"id": xxx, "errors": [...]}. 校验规则：id 非空、amount 为合法 Decimal 且 >= 0、qty > 0、status 属于 Status 枚举（含 PENDING/PAID/SHIPPED）。
func: validate_all
starter: |
  from decimal import Decimal, InvalidOperation
  from enum import Enum

  class Status(Enum):
      PENDING = "pending"
      PAID = "paid"
      SHIPPED = "shipped"

  def validate_all(records):
      return [], []

  data = [
      {"id": "T001", "amount": "19.90", "status": "paid", "qty": 2},
      {"id": "T002", "amount": "-5", "status": "pending", "qty": 0},
      {"id": "T003", "amount": "abc", "status": "UNKNOWN", "qty": 1},
  ]
  passed, failed = validate_all(data)
  print(f"通过: {len(passed)}, 失败: {len(failed)}")
cases:
- "[{'id':'T001','amount':'10','status':'paid','qty':2},{'id':'T002','amount':'-1','status':'pending','qty':0}]" -> "([{'id': 'T001', 'amount': '10', 'status': 'paid', 'qty': 2}], [{'id': 'T002', 'errors': ['金额不能为负: -1', '数量必须大于 0: 0']}])"
hint: 每条记录收集所有错误，try/except 兜住 Decimal 和 Enum 构造。
explain: 遍历每条记录，依次检查 id、amount、qty、status，用 try/except 捕获 Decimal 和 Enum 构造异常，收集所有错误到列表，最后按通过/失败分流。
```

## 第三部分 · 小项目

### 8. 完整管道 mini 版

```quiz
type: code
q: 实现一个 mini 管道函数 run_pipeline(raw_records)，接收原始 dict 列表（可能有英文或中文 key），完成：① normalize 标准化 ② 校验（id非空、amount合法且>=0、qty>0、status属于Status枚举PENDING/PAID/SHIPPED）③ 返回 tuple (通过列表, 失败列表, 报告字符串)。报告格式："总计: X 条\n通过: Y 条\n失败: Z 条\n--- 失败详情 ---\n[ID]\n  ✗ 错误1\n  ✗ 错误2"。没有失败时不需要失败详情部分。
starter: |
  from decimal import Decimal, InvalidOperation
  from enum import Enum

  class Status(Enum):
      PENDING = "pending"
      PAID = "paid"
      SHIPPED = "shipped"

  def run_pipeline(raw_records):
      # 1. normalize
      records = []
      for raw in raw_records:
          records.append({
              "id": raw.get("id") or raw.get("订单号") or "",
              "amount": str(raw.get("amount") or raw.get("金额") or "0"),
              "status": str(raw.get("status") or raw.get("状态") or "pending"),
              "qty": int(raw.get("qty") or raw.get("数量") or 0),
          })
      # 2. validate
      passed = []
      failed = []
      for rec in records:
          errors = []
          # TODO: 补全校验逻辑
          if not rec["id"]:
              errors.append("缺少 id")
          # ... 补全 amount/qty/status 校验
          if errors:
              failed.append({"id": rec["id"] or "(无id)", "errors": errors})
          else:
              passed.append(rec)
      # 3. 生成报告
      lines = [f"总计: {len(passed)+len(failed)} 条", f"通过: {len(passed)} 条", f"失败: {len(failed)} 条"]
      if failed:
          lines.append("--- 失败详情 ---")
          for f in failed:
              lines.append(f"[{f['id']}]")
              for err in f["errors"]:
                  lines.append(f"  ✗ {err}")
      report = "\n".join(lines)
      return passed, failed, report

  data = [
      {"id": "T001", "amount": "19.90", "status": "paid", "qty": 2},
      {"订单号": "T002", "金额": "-5", "状态": "pending", "数量": "0"},
      {"id": "T003", "amount": "abc", "status": "UNKNOWN", "qty": 1},
      {"id": "T004", "amount": "9.99", "status": "shipped", "qty": 3},
  ]
  passed, failed, report = run_pipeline(data)
  print(report)
tests:
- assert '通过: 2' in __out and '失败: 2' in __out and '✗' in __out
hint: 补全 amount（Decimal 构造+非负）、qty（>0）、status（Enum 反查）的校验。
explain: 校验逻辑依次为：id 非空 → amount 用 Decimal 构造且 >=0 → qty > 0 → status 属于 Status 枚举。收集所有错误后分流，生成报告。
```
