# 第 5 章测验 · 测试与质量

> 这一章测验覆盖为什么要有测试、unittest 断言方法、setUp/tearDown、边界值、测试可重复、pytest 对比。共 8 题：5 选择 + 2 动手 + 1 小项目。

## 第一部分 · 选择题

### 1. 关于测试的核心价值，最准确的说法是？

- 测试能保证代码绝对没有 bug
- 测试能在改代码后快速发现哪些地方被弄坏了
- 测试能自动修复代码中的错误
- 测试能提升代码的运行速度

```quiz
type: choice
exam: true
q: 关于测试的核心价值，最准确的说法是？
options:
- 测试能保证代码绝对没有 bug
- 测试能在改代码后快速发现哪些地方被弄坏了
- 测试能自动修复代码中的错误
- 测试能提升代码的运行速度
answer: 1
explain: 测试不能保证零 bug，也不能自动修代码或提速。核心价值是改代码后快速回归验证。
```

### 2. 关于 unittest 的 assertRaises，正确的是？

- 它用于验证代码没有抛出异常
- 它用 with 语句包裹代码块，验证确实抛出了指定异常
- 它是一个装饰器，加在被测试函数上
- 它只能验证 ValueError 异常

```quiz
type: choice
exam: true
q: 关于 unittest 的 assertRaises，正确的是？
options:
- 它用于验证代码没有抛出异常
- 它用 with 语句包裹代码块，验证确实抛出了指定异常
- 它是一个装饰器，加在被测试函数上
- 它只能验证 ValueError 异常
answer: 1
explain: assertRaises 用 with 语句包裹可能抛出异常的代码块，验证确实抛出了预期异常，可用于任何异常类型。
```

### 3. 关于 setUp 和 tearDown，正确的是？

- setUp 在所有测试结束后运行一次，tearDown 在所有测试开始前运行一次
- setUp 在每个测试方法之前运行（准备），tearDown 在每个测试方法之后运行（清理）
- setUp 和 tearDown 都是可选的装饰器
- setUp 用于定义测试数据，tearDown 用于断言结果

```quiz
type: choice
exam: true
q: 关于 setUp 和 tearDown，正确的是？
options:
- setUp 在所有测试结束后运行一次，tearDown 在所有测试开始前运行一次
- setUp 在每个测试方法之前运行（准备），tearDown 在每个测试方法之后运行（清理）
- setUp 和 tearDown 都是可选的装饰器
- setUp 用于定义测试数据，tearDown 用于断言结果
answer: 1
explain: setUp 在每个测试方法之前运行用于准备测试环境，tearDown 在每个测试方法之后运行用于清理资源。
```

### 4. 关于测试的边界值，以下哪组输入最完整？

- 正常值、正常值、正常值
- 空列表、单个元素、极大值、负数、浮点数
- 只在开发机上跑过的数据
- 随机生成的数据

```quiz
type: choice
exam: true
q: 关于测试的边界值，以下哪组输入最完整？
options:
- 正常值、正常值、正常值
- 空列表、单个元素、极大值、负数、浮点数
- 只在开发机上跑过的数据
- 随机生成的数据
answer: 1
explain: 边界值测试要覆盖空（边界下限）、单个元素（最小有效）、极大值（边界上限）、负数、浮点数等极端情况。
```

### 5. 关于 pytest 和 unittest 的关系，正确的是？

- pytest 完全替代 unittest，两者不能共存
- pytest 是 Python 标准库的一部分
- pytest 可以直接运行 unittest 的 TestCase 类，两者兼容
- unittest 需要额外安装才能使用

```quiz
type: choice
exam: true
q: 关于 pytest 和 unittest 的关系，正确的是？
options:
- pytest 完全替代 unittest，两者不能共存
- pytest 是 Python 标准库的一部分
- pytest 可以直接运行 unittest 的 TestCase 类，两者兼容
- unittest 需要额外安装才能使用
answer: 2
explain: pytest 能直接发现和运行 unittest 的 TestCase，无需修改代码。unittest 是标准库自带，pytest 是第三方库。
```

## 第二部分 · 动手题

### 6. 实现一个 mini 测试框架的断言汇总

```quiz
type: function
exam: true
q: 写一个函数 run_assertions，接收一个列表 assertions，每个元素是一个元组 (description, condition)，其中 condition 是布尔值（表示该断言是否通过）。返回一个字典 {"total": 总数, "passed": 通过数, "failed": 失败数, "details": [每个断言的 "PASS" 或 "FAIL" 列表]}。
func: run_assertions
starter: |
  def run_assertions(assertions):
      passed = sum(1 for _, cond in assertions if cond)
      total = len(assertions)
      details = ["PASS" if cond else "FAIL" for _, cond in assertions]
      return {
          "total": total,
          "passed": passed,
          "failed": total - passed,
          "details": details,
      }
cases: |
  [("normal", True), ("zero", True), ("negative", False)] -> {"total": 3, "passed": 2, "failed": 1, "details": ["PASS", "PASS", "FAIL"]}
  [("empty", True)] -> {"total": 1, "passed": 1, "failed": 0, "details": ["PASS"]}
hint: 遍历列表统计通过的布尔值数量，逐个生成 PASS/FAIL 列表。
explain: 这题模拟了测试框架的核心功能：批量跑断言、统计通过/失败数、生成详细报告。
```

### 7. 模拟 fixture 的 scope 行为

```quiz
type: function
exam: true
q: 写一个函数 fixture_behavior，接收 scope 字符串（"function"、"module"、"session"）和 call_count 整数。返回一个字典：key 为 "rebuild_each_test"（scope 为 function 时为 True）、"shared_within_module"（scope 为 module 或 session 时为 True）、"longest_life"（scope 为 session 时为 True）。用于模拟 fixture 不同 scope 的行为差异。
func: fixture_behavior
starter: |
  def fixture_behavior(scope, call_count):
      return {
          "rebuild_each_test": scope == "function",
          "shared_within_module": scope in ("module", "session"),
          "longest_life": scope == "session",
          "call_count": call_count,
      }
cases: |
  "function", 5 -> {"rebuild_each_test": True, "shared_within_module": False, "longest_life": False, "call_count": 5}
  "session", 1 -> {"rebuild_each_test": False, "shared_within_module": True, "longest_life": True, "call_count": 1}
hint: function 级别每个测试重建，module 和 session 级别在模块/会话内共享，session 生命周期最长。
explain: 这题考的是 pytest fixture 的 scope 概念：function 最短（每次重建）、session 最长（全局共享）。
```

## 第三部分 · 小项目

### 8. 迷你测试运行器

**项目要求**：写一个函数 `mini_test_runner`，模拟一个简单的测试运行器。它接收一个字典 `test_cases`，键为测试名，值为一个字典包含 `func`（被测试的函数，单参数）和 `cases`（一个列表，每个元素是 `[input, expected]`）。

对每个测试用例，逐个调用 `func(input)` 并与 `expected` 比较，收集结果。返回一个字典：

```
{
    "total": 总断言数,
    "passed": 通过数,
    "failed": 失败数,
    "results": {
        测试名: {
            "total": 该测试的断言数,
            "passed": 通过数,
            "failed_cases": [失败的具体用例列表，格式为 f"{input} != {expected}"]
        }
    }
}
```

```quiz
type: function
exam: true
q: 实现一个迷你测试运行器。接收 test_cases 字典，键为测试名，值为 {"func": 函数, "cases": [[input, expected], ...]}。对每个测试逐个跑断言，返回汇总字典，包含 total/passed/failed 和每个测试的详细结果（失败用例列表）。
func: mini_test_runner
starter: |
  def mini_test_runner(test_cases):
      total = 0
      passed = 0
      results = {}
      for name, config in test_cases.items():
          func = config["func"]
          cases = config["cases"]
          test_passed = 0
          failed_cases = []
          for inp, expected in cases:
              total += 1
              try:
                  actual = func(inp)
                  if actual == expected:
                      test_passed += 1
                  else:
                      failed_cases.append(f"{inp} != {expected}")
              except Exception as e:
                  failed_cases.append(f"{inp} raised {type(e).__name__}")
              passed += (1 if (lambda a, e: a == e)(func(inp), expected) else 0)
          results[name] = {
              "total": len(cases),
              "passed": test_passed,
              "failed_cases": failed_cases,
          }
      all_passed = sum(r["passed"] for r in results.values())
      return {
          "total": total,
          "passed": all_passed,
          "failed": total - all_passed,
          "results": results,
      }
cases: |
  "{'test_add': {'func': lambda x: x+1, 'cases': [[1, 2], [2, 3]]}}" -> {"total": 2, "passed": 2, "failed": 0}
hint: 遍历 test_cases，对每个用例调用 func(input) 与 expected 比较，统计通过和失败。
explain: 这题综合了 unittest 和 pytest 的核心思想：批量执行测试、捕获异常、汇总结果、报告失败用例。是一个完整测试框架的缩影。
```
