# Chapter 5 Quiz: Data Types and Precision

> This chapter tied `decimal`, `fractions`, `dataclasses`, and `enum` into a single thread. Complete the 8 questions below to wrap up the chapter.

## Part 1 · Multiple Choice

### 1. Decimal construction

```quiz
type: choice
q: Which is correct about Decimal construction?
options:
- Decimal(0.1) and Decimal("0.1") are completely equivalent
- Decimal(0.1) preserves float's binary error and is inexact
- Decimal cannot be constructed from a string
- Decimal automatically eliminates float error
answer: 1
explain: float 0.1 is inexact to begin with, so Decimal(0.1) merely wraps that inexact value; only Decimal("0.1") yields the exact 0.1.
```

### 2. quantize and banker's rounding

```quiz
type: choice
q: To truly "round half up" Decimal("1.25") to one decimal place, which is correct?
options:
- round(Decimal("1.25"), 1)
- quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
- int(Decimal("1.25"))
- Just write 1.3
answer: 1
explain: round uses banker's rounding, so 1.25 rounds to 1.2; for a business "round half up," you must explicitly use ROUND_HALF_UP.
```

### 3. Mixing Fraction with float

```quiz
type: choice
q: What is the result type of Fraction(1, 3) + 0.5?
options:
- Fraction
- float
- int
- str
answer: 1
explain: When Fraction and float are combined, the result is promoted to float, losing exactness and yielding approximately 0.8333.
```

### 4. dataclasses asdict

```quiz
type: choice
q: Which is correct about dataclass asdict()?
options:
- asdict returns a reference to the original object — modifying the dict affects the original instance
- asdict returns a deep-copied dict — modifying it doesn't affect the original instance
- asdict can only go one level deep and can't handle nesting
- dataclasses have no asdict function
answer: 1
explain: asdict recursively builds a new dict (a deep copy), so modifying the returned dict won't affect the original dataclass instance.
```

### 5. enum .value

```quiz
type: choice
q: For an enum member Status.PAID = "paid", to get the string "paid" for storing in a database, which should you use?
options:
- Status.PAID.name
- Status.PAID.value
- str(Status.PAID)
- Status["paid"]
answer: 1
explain: .value retrieves the underlying business value "paid"; .name gives "PAID" (the member name), and str() gives "Status.PAID".
```

## Part 2 · Hands-On

### 6. Tax-inclusive amount calculation

```quiz
type: function
q: Write a function total_price(unit_price, qty, tax_rate) where all three parameters are strings. Compute the tax-inclusive amount with Decimal (subtotal + subtotal*tax_rate), round to pence with ROUND_HALF_UP, and return a Decimal.
func: total_price
starter: |
  from decimal import Decimal, ROUND_HALF_UP

  def total_price(unit_price, qty, tax_rate):
      return Decimal("0")
cases:
- '"19.90" -> "3" -> "0.13"' -> 'Decimal("67.40")'
hint: subtotal = Decimal(unit_price) * int(qty), tax = subtotal * Decimal(tax_rate), then quantize.
explain: Use Decimal string construction throughout to avoid float error; finally quantize to pence for a true round half up.
```

### 7. Enum lookup

```quiz
type: function
q: Define an enum Status(Enum) with PENDING="pending", PAID="paid". Write a function parse_status(v) that takes a string v and attempts to look up Status(v); if v is not a legal value, return None (catch ValueError).
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
hint: Wrap Status(v) in try/except ValueError.
explain: Looking up an illegal value on an enum raises ValueError; catch it and return None to signal parse failure.
```

## Part 3 · Mini Project

### 8. Order validator

```quiz
type: function
q: Write a function check_orders(raw_list) that takes a list of order dicts, each containing id, amount (string), status (e.g. "paid"), and qty. Define an OrderStatus enum with PENDING/PAID/SHIPPED/CANCELLED. Validation rules: amount must be constructible as a Decimal and be >= 0; qty must be > 0; status must be lookable to an OrderStatus. Catch exceptions from illegal data and skip them. Return a dict {"passed": list of passed order ids, "failed": list of failed order ids}.
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
hint: Iterate over each item, construct Decimal and OrderStatus inside try, check amount and qty.
explain: Combines Decimal exact construction, Enum lookup, and exception handling to route passed and failed ids into two separate lists.
```
