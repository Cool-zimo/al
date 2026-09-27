# 第 5 章测验：数据类型与精度

> 这一章把 `decimal`、`fractions`、`dataclasses`、`enum` 串成一条线。做完 8 题，本章收工。

## 第一部分 · 选择题

### 1. Decimal 的构造

```quiz
type: choice
exam: true
q: 关于 Decimal 的构造，正确的是？
options:
- Decimal(0.1) 和 Decimal("0.1") 完全等价
- Decimal(0.1) 会保留 float 的二进制误差，不精确
- Decimal 不能从字符串构造
- Decimal 会自动把 float 误差消除
answer: 1
explain: float 0.1 本身就不精确，Decimal(0.1) 只是包装了这个不精确值；只有 Decimal("0.1") 能得到精确的 0.1。
```

### 2. quantize 与银行家舍入

```quiz
type: choice
exam: true
q: 想把 Decimal("1.25") 真正"四舍五入"到一位小数，正确的是？
options:
- round(Decimal("1.25"), 1)
- quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
- int(Decimal("1.25"))
- 直接写 1.3
answer: 1
explain: round 用的是银行家舍入，1.25 会舍到 1.2；业务里的"四舍五入"要显式用 ROUND_HALF_UP。
```

### 3. Fraction 与 float 混算

```quiz
type: choice
exam: true
q: Fraction(1, 3) + 0.5 的结果类型是？
options:
- Fraction
- float
- int
- str
answer: 1
explain: Fraction 与 float 运算时结果会提升为 float，精确性丢失，得到约 0.8333。
```

### 4. dataclasses asdict

```quiz
type: choice
exam: true
q: 关于 dataclass 的 asdict()，正确的是？
options:
- asdict 返回的是原对象的引用，修改 dict 会影响原实例
- asdict 返回深拷贝的 dict，修改 dict 不影响原实例
- asdict 只能转一层，不能处理嵌套
- dataclass 没有 asdict 函数
answer: 1
explain: asdict 会递归生成新的 dict（深拷贝），修改返回的 dict 不会影响原 dataclass 实例。
```

### 5. enum 的 .value

```quiz
type: choice
exam: true
q: 枚举成员 Status.PAID = "paid"，要拿到字符串 "paid" 用于存数据库，应该用？
options:
- Status.PAID.name
- Status.PAID.value
- str(Status.PAID)
- Status["paid"]
answer: 1
explain: .value 拿到枚举背后的业务值 "paid"；.name 拿到的是 "PAID"（成员名），str() 得到 "Status.PAID"。
```

## 第二部分 · 动手题

### 6. 含税金额计算

```quiz
type: function
exam: true
q: 写函数 total_price(unit_price, qty, tax_rate)，三个参数都是字符串，用 Decimal 计算含税金额（subtotal + subtotal*tax_rate），用 ROUND_HALF_UP 精确到分返回 Decimal。
func: total_price
starter: |
  from decimal import Decimal, ROUND_HALF_UP

  def total_price(unit_price, qty, tax_rate):
      return Decimal("0")
cases:
- '"19.90" -> "3" -> "0.13"' -> 'Decimal("67.40")'
hint: subtotal = Decimal(unit_price) * int(qty)，tax = subtotal * Decimal(tax_rate)，再 quantize。
explain: 全程用 Decimal 字符串构造，避免 float 误差，最后 quantize 到分做真正四舍五入。
```

### 7. 枚举反查

```quiz
type: function
exam: true
q: 定义枚举 Status(Enum)，PENDING="pending"、PAID="paid"。写函数 parse_status(v)，接收一个字符串 v，尝试用 Status(v) 反查；若 v 不是合法值返回 None（捕获 ValueError）。
func: parse_status
starter: |
  from enum import Enum

  class Status(Enum):
      PENDING = "pending"
      PAID = "paid"

  def parse_status(v):
      return None
cases:
- "'paid'" -> 'Status.PAID'
hint: 用 try/except ValueError，返回 Status(v)。
explain: 枚举反查非法值会抛 ValueError，捕获后返回 None 表示解析失败。
```

## 第三部分 · 小项目

### 8. 订单校验器

```quiz
type: function
exam: true
q: 写函数 check_orders(raw_list)，接收订单字典列表，每条含 id、amount（字符串）、status（如 "paid"）、qty。定义枚举 OrderStatus 含 PENDING/PAID/SHIPPED/CANCELLED。校验规则：amount 用 Decimal 构造必须 >= 0；qty 必须 > 0；status 必须能反查到 OrderStatus。非法数据捕获异常并跳过。返回字典 {"passed": 通过订单 id 列表, "failed": 失败订单 id 列表}。
func: check_orders
starter: |
  from decimal import Decimal
  from enum import Enum

  class OrderStatus(Enum):
      PENDING = "pending"
      PAID = "paid"
      SHIPPED = "shipped"
      CANCELLED = "cancelled"

  def check_orders(raw_list):
      return {"passed": [], "failed": []}
cases:
- "[{'id':'A','amount':'10','status':'paid','qty':1},{'id':'B','amount':'-1','status':'pending','qty':0}]" -> "{'passed': ['A'], 'failed': ['B']}"
hint: 遍历每条，try 构造 Decimal 和 OrderStatus，判断 amount 和 qty。
explain: 综合运用 Decimal 精确构造、Enum 反查、异常处理，把通过和失败的 id 分流到两个列表。
```
