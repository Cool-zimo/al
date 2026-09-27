# Chapter 6 Quiz

> A combined quiz covering the data pipeline toolkit + the full book recap.

## Part 1 · Multiple Choice

### 1. Which of the following is correct about the pipeline's layered design?

```quiz
type: choice
q: Which of the following is correct about the data pipeline's layered design?
options:
- The load layer and check layer can be merged since both process data
- Once layered, each layer can be tested and replaced independently, and faults are easy to locate
- More layers make the program run faster
- The four layers must execute in a fixed order and none can be skipped
answer: 1
explain: The purpose of layering is to give each layer a single responsibility and independent reasons to change, so each can be tested and replaced on its own and failures can be pinpointed to a specific layer.
```

### 2. What internal structure does the load layer output uniformly?

```quiz
type: choice
q: What internal structure does the load layer output uniformly?
options:
- A single dataclass instance
- list[dict], with keys being the standard names id/amount/status/qty
- A JSON string
- A CSV file object
answer: 1
explain: The load layer only converts files into a list of dicts and never touches the domain model. The standard keys are id/amount/status/qty.
```

### 3. What is the best practice for error handling in the check layer?

```quiz
type: choice
q: What is the best practice for error handling in the check layer?
options:
- Raise an exception and stop at the first error
- Collect every error for a record and produce a unified report at the end
- Skip all erroneous records without reporting them
- Print every error with print
answer: 1
explain: Collecting every error lets users see the full picture in one pass without repeated runs. Stopping immediately only exposes the first problem.
```

### 4. Which of the following is correct about logging levels?

```quiz
type: choice
q: Which of the following is correct about logging levels?
options:
- DEBUG is the highest level and CRITICAL is the lowest
- When level=WARNING, INFO and DEBUG logs are not shown
- basicConfig can be called multiple times, with each call overriding the previous configuration
- Logs can only be written to files, not to the terminal
answer: 1
explain: level=WARNING means only WARNING and above are output. basicConfig only takes effect on the first call.
```

### 5. What does sys.argv[0] represent?

```quiz
type: choice
q: What does sys.argv[0] represent?
options:
- The first command-line argument
- The script filename (path)
- A tuple of all arguments
- The total number of arguments
answer: 1
explain: sys.argv[0] is the script path; the real arguments begin at sys.argv[1].
```

## Part 2 · Hands-On

### 6. Multi-format unification

```quiz
type: function
q: Write a function normalize_keys(raw_list) that takes a list of dicts, each potentially using English keys (id/amount/status/qty) or aliases (order_no/amount_gbp/state/quantity). Unify them into a list of standard dicts, converting amount to str and qty to int.
func: normalize_keys
starter: |
  def normalize_keys(raw_list):
      return []

  data = [
      {"id": "T001", "amount": "19.90", "status": "paid", "qty": "2"},
      {"order_no": "T002", "amount_gbp": "5.00", "state": "pending", "quantity": "1"},
  ]
  print(normalize_keys(data))
cases:
- "[{'id':'T1','amount':'10','status':'paid','qty':'3'},{'order_no':'T2','amount_gbp':'20','state':'shipped','quantity':'5'}]" -> "[{'id': 'T1', 'amount': '10', 'status': 'paid', 'qty': 3}, {'id': 'T2', 'amount': '20', 'status': 'shipped', 'qty': 5}]"
hint: Use raw.get("id") or raw.get("order_no") to support both keys.
explain: Iterate over each record, use `or` to support both English and alias keys, convert amount to str and qty to int, then return the list.
```

### 7. Validation that collects errors

```quiz
type: function
q: Write a function validate_all(records) that takes a list of standard dicts (with id/amount/status/qty) and returns (passed_list, failed_list). Each element in the failed list is {"id": xxx, "errors": [...]}. Validation rules: id non-empty, amount is a valid Decimal and >= 0, qty > 0, status belongs to the Status enum (with PENDING/PAID/SHIPPED).
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
  print(f"passed: {len(passed)}, failed: {len(failed)}")
cases:
- "[{'id':'T001','amount':'10','status':'paid','qty':2},{'id':'T002','amount':'-1','status':'pending','qty':0}]" -> "([{'id': 'T001', 'amount': '10', 'status': 'paid', 'qty': 2}], [{'id': 'T002', 'errors': ['amount cannot be negative: -1', 'quantity must be greater than 0: 0']}])"
hint: Collect every error for each record; wrap Decimal and Enum construction in try/except.
explain: Iterate over each record, check id, amount, qty, and status in turn, catch Decimal and Enum construction exceptions with try/except, collect every error into a list, then split into passed and failed.
```

## Part 3 · Mini Project

### 8. A Mini Version of the Full Pipeline

```quiz
type: code
q: Implement a mini-pipeline function run_pipeline(raw_records) that takes a list of raw dicts (potentially using English or alias keys) and does the following: ① normalise ② validate (id non-empty, amount valid and >= 0, qty > 0, status belongs to the Status enum PENDING/PAID/SHIPPED) ③ return a tuple (passed_list, failed_list, report_string). The report format: "total: X records\npassed: Y records\nfailed: Z records\n--- failure details ---\n[ID]\n  ✗ error1\n  ✗ error2". When there are no failures, omit the failure-details section.
starter: |
  from decimal import Decimal, InvalidOperation
  from enum import Enum

  class Status(Enum):
      PENDING = "pending"
      PAID = "paid"
      SHIPPED = "shipped"

  def run_pipeline(raw_records):
      # 1. normalise
      records = []
      for raw in raw_records:
          records.append({
              "id": raw.get("id") or raw.get("order_no") or "",
              "amount": str(raw.get("amount") or raw.get("amount_gbp") or "0"),
              "status": str(raw.get("status") or raw.get("state") or "pending"),
              "qty": int(raw.get("qty") or raw.get("quantity") or 0),
          })
      # 2. validate
      passed = []
      failed = []
      for rec in records:
          errors = []
          # TODO: complete the validation logic
          if not rec["id"]:
              errors.append("missing id")
          # ... complete the amount/qty/status checks
          if errors:
              failed.append({"id": rec["id"] or "(no id)", "errors": errors})
          else:
              passed.append(rec)
      # 3. generate the report
      lines = [f"total: {len(passed)+len(failed)} records", f"passed: {len(passed)} records", f"failed: {len(failed)} records"]
      if failed:
          lines.append("--- failure details ---")
          for f in failed:
              lines.append(f"[{f['id']}]")
              for err in f["errors"]:
                  lines.append(f"  ✗ {err}")
      report = "\n".join(lines)
      return passed, failed, report

  data = [
      {"id": "T001", "amount": "19.90", "status": "paid", "qty": 2},
      {"order_no": "T002", "amount_gbp": "-5", "state": "pending", "quantity": "0"},
      {"id": "T003", "amount": "abc", "status": "UNKNOWN", "qty": 1},
      {"id": "T004", "amount": "9.99", "status": "shipped", "qty": 3},
  ]
  passed, failed, report = run_pipeline(data)
  print(report)
tests:
- assert 'passed: 2' in __out and 'failed: 2' in __out and '✗' in __out
hint: Complete the checks for amount (Decimal construction + non-negative), qty (> 0), and status (Enum lookup).
explain: The validation logic in order: id non-empty → amount constructed as Decimal and >= 0 → qty > 0 → status belongs to the Status enum. Collect every error, split into passed/failed, then generate the report.
```
