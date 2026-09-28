# Chapter 5 Quiz · Testing and Quality

> This chapter quiz covers why tests matter, unittest assertion methods, setUp/tearDown, boundary values, test repeatability, and pytest comparison. Eight questions total: 5 multiple choice + 2 hands-on + 1 mini-project.

## Part 1 · Multiple Choice

### 1. What is the most accurate statement about the core value of testing?

- Tests guarantee that code has absolutely no bugs
- Tests let you quickly discover what broke after changing the code
- Tests automatically fix errors in the code
- Tests make code run faster

```quiz
type: choice
exam: true
q: What is the most accurate statement about the core value of testing?
options:
- Tests guarantee that code has absolutely no bugs
- Tests let you quickly discover what broke after changing the code
- Tests automatically fix errors in the code
- Tests make code run faster
answer: 1
explain: Tests can't guarantee zero bugs, can't auto-fix code, and don't speed it up. Their core value is fast regression verification after a change.
```

### 2. What is `unittest`'s `assertRaises`?

- It verifies that code did not raise an exception
- It wraps a block with a with statement to verify that the specified exception was raised
- It is a decorator applied to the function under test
- It can only verify ValueError exceptions

```quiz
type: choice
exam: true
q: What is unittest's assertRaises?
options:
- It verifies that code did not raise an exception
- It wraps a block with a with statement to verify that the specified exception was raised
- It is a decorator applied to the function under test
- It can only verify ValueError exceptions
answer: 1
explain: assertRaises uses a with statement to wrap code that may raise an exception, verifying that the expected exception was raised. It works with any exception type.
```

### 3. What is the correct statement about `setUp` and `tearDown`?

- setUp runs once after all tests; tearDown runs once before all tests
- setUp runs before each test method (preparation); tearDown runs after each test method (cleanup)
- setUp and tearDown are both optional decorators
- setUp defines test data; tearDown makes assertions about results

```quiz
type: choice
exam: true
q: What is the correct statement about setUp and tearDown?
options:
- setUp runs once after all tests; tearDown runs once before all tests
- setUp runs before each test method (preparation); tearDown runs after each test method (cleanup)
- setUp and tearDown are both optional decorators
- setUp defines test data; tearDown makes assertions about results
answer: 1
explain: setUp runs before each test method to prepare the environment; tearDown runs after each test method to clean up resources.
```

### 4. Which set of boundary-value inputs is the most complete?

- Normal value, normal value, normal value
- Empty list, single element, huge value, negative number, float
- Data that only ran on a development machine
- Randomly generated data

```quiz
type: choice
exam: true
q: Which set of boundary-value inputs is the most complete?
options:
- Normal value, normal value, normal value
- Empty list, single element, huge value, negative number, float
- Data that only ran on a development machine
- Randomly generated data
answer: 1
explain: Boundary-value testing should cover empty (lower bound), single element (minimum valid), huge values (upper bound), negatives, and floats — the extreme cases.
```

### 5. What is the relationship between `pytest` and `unittest`?

- pytest completely replaces unittest, and the two cannot coexist
- pytest is part of the Python standard library
- pytest can run unittest TestCase classes directly; the two are compatible
- unittest requires a separate installation to use

```quiz
type: choice
exam: true
q: What is the relationship between pytest and unittest?
options:
- pytest completely replaces unittest, and the two cannot coexist
- pytest is part of the Python standard library
- pytest can run unittest TestCase classes directly; the two are compatible
- unittest requires a separate installation to use
answer: 2
explain: pytest can discover and run unittest TestCases without code changes. unittest ships with the standard library; pytest is third-party.
```

## Part 2 · Hands-On

### 6. A Mini Test Framework: Summarising Assertions

```quiz
type: function
exam: true
q: Write a function run_assertions that takes a list assertions, where each element is a tuple (description, condition) and condition is a boolean (whether that assertion passes). Return a dictionary {"total": total count, "passed": passed count, "failed": failed count, "details": [a list of "PASS" or "FAIL" for each assertion]}.
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
hint: Iterate the list, count the booleans that are True, and generate a PASS/FAIL entry for each one.
explain: This simulates a test framework's core function: batch-running assertions, counting passes and failures, and producing a detailed report.
```

### 7. Simulating Fixture Scope Behaviour

```quiz
type: function
exam: true
q: Write a function fixture_behavior that takes a scope string ("function", "module", or "session") and a call_count integer. Return a dictionary with the keys: "rebuild_each_test" (True when scope is function), "shared_within_module" (True when scope is module or session), and "longest_life" (True when scope is session). Used to simulate how fixture scope changes behaviour.
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
hint: function scope rebuilds for every test; module and session scopes are shared within their module or session; session scope has the longest lifetime.
explain: This tests the concept of pytest fixture scope: function is shortest (rebuilt each time), session is longest (shared globally).
```

## Part 3 · Mini-Project

### 8. A Mini Test Runner

**Project requirements**: write a function `mini_test_runner` that simulates a simple test runner. It takes a dictionary `test_cases`, where keys are test names and values are dictionaries containing `func` (the function under test, single-argument) and `cases` (a list where each element is `[input, expected]`).

For each test case, call `func(input)` and compare the result with `expected`, collecting the outcomes. Return a dictionary:

```
{
    "total": total number of assertions,
    "passed": number passed,
    "failed": number failed,
    "results": {
        test_name: {
            "total": number of assertions in this test,
            "passed": number passed,
            "failed_cases": [list of failed cases, formatted as f"{input} != {expected}"]
        }
    }
}
```

```quiz
type: function
exam: true
q: Implement a mini test runner. It takes a test_cases dictionary where keys are test names and values are {"func": function, "cases": [[input, expected], ...]}. Run each test case, compare func(input) with expected, and return a summary dictionary containing total/passed/failed and detailed per-test results (with the list of failed cases).
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
hint: Iterate over test_cases, call func(input) for each case and compare with expected, counting passes and failures.
explain: This combines the core ideas of unittest and pytest: batch-executing tests, capturing exceptions, summarising results, and reporting failed cases. It is a distillation of a complete test framework.
```
