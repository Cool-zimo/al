# Chapter 4 Quiz · Testing and Automation

> This chapter covers the three layers of the test pyramid, fixtures and parametrization, test isolation, when to mock and when not to, coverage, and CI. Eight questions total: five multiple choice, two hands-on, and one small project.

## Part 1 · Multiple choice

```quiz
type: choice
q: Top to bottom, what are the three layers of the test pyramid?
options:
- Unit tests, integration tests, end-to-end tests
- End-to-end tests, integration tests, unit tests
- Performance tests, security tests, functional tests
- Manual tests, automated tests, exploratory tests
answer: 0
explain: The bottom of the pyramid is the numerous, fast unit test; the middle is integration; the top is the small number of slow end-to-end tests. The higher you go, the fewer, the slower, and the more brittle.
```

```quiz
type: choice
q: Regarding pytest fixtures and @pytest.mark.parametrize, which is correct?
options:
- Fixtures prepare the test's dependencies (a database connection, a temp directory) and can be reused; parametrize runs the same test logic against multiple inputs.
- Fixtures can only be used inside classes, not functions; parametrize can only be used on classes.
- Fixtures parallelize tests; parametrize skips tests.
- They are two spellings of the same thing, so use either one.
answer: 0
explain: A fixture injects reusable test context through dependency injection; parametrize is data-driven, executing the same test function repeatedly with different argument combinations.
```

```quiz
type: choice
q: Which statement about test isolation is correct?
options:
- Tests may share global state as long as they run fast.
- Each test should be independent and runnable on its own, with no reliance on the execution order or leftover state of other tests.
- Tests must run in alphabetical order to count as isolated.
- Isolation just means putting test files in different directories, regardless of content.
answer: 1
explain: Isolation means every case is independent and runnable alone, with no ordering dependency. Shared state or leftover state causes intermittent failures that are hard to diagnose. Use a fixture's setup/teardown or tmp_path to guarantee isolation.
```

```quiz
type: choice
q: When should you NOT mock?
options:
- When you are testing the collaboration logic itself (e.g., you want to verify that you called a downstream dependency with the right arguments), more mocks are always better.
- When you are testing a core flow that crosses multiple real modules and whose correctness depends on real behavior (a database transaction, filesystem interaction), over-mocking lets the tests pass while the actual behavior is broken.
- You should always mock; real calls are too slow.
- You only need mocks when code has no dependencies.
answer: 1
explain: Mocks cut both ways: over-mocking turns tests into "verify the mock was called," detached from real behavior. Core integration flows and anything involving real side effects need real integration tests rather than layers of mocks.
```

```quiz
type: choice
q: What does "100% coverage" mean?
options:
- The code is absolutely bug-free and safe to release.
- Every line was executed, but that does not mean every branch, boundary, and semantic behavior is correct; 100% line coverage is not bug-free.
- Every function was called once, so the logic must be right.
- Coverage is merely decorative and completely meaningless.
answer: 1
explain: Coverage only says code was executed, not that the assertions are correct, boundaries are handled, or semantics match expectations. 100% line coverage can still hide logic errors; coverage is a lower bound, not proof of quality.
```

## Part 2 · Hands-on

```quiz
type: local
q: Write a minimal runnable pytest case that verifies add(a, b) is correct for integers, negatives, and zero. Requirements: use @pytest.mark.parametrize with three groups of arguments; running pytest -v should show the three cases passing separately. Submit the test file and the pytest output.
hint: Start with the function under test, add(a, b): return a + b, then write a parametrized test for it.
explain: A hands-on exercise in data-driven testing, pytest's most common idiom.
checklist:
- Write a test_add.py in pytest style (no need to import unittest).
- Cover at least four inputs: positive integer, negative, zero, float.
- Use parametrize to express all four inputs in a single test function.
- It must pass locally under pytest; deliberately breaking add should make the test fail.
```

```quiz
type: function
q: Implement analyze_coverage(report), which analyzes a coverage report. The report argument is a dict mapping each filename to another dict {"lines": total lines, "covered": covered lines}. Return a dict with: ① "total_coverage": the overall coverage across all files (sum of covered / sum of lines, as a percentage rounded to 1 decimal); ② "worst_file": the filename with the lowest coverage (on a tie, pick the lexicographically earlier name); ③ "below_threshold": the list of filenames whose coverage is strictly below the threshold (default 80), sorted ascending; ④ "all_covered": whether every file is 100% covered (bool). For example, with one file {"a.py": {"lines": 10, "covered": 8}} and threshold 80, that file is exactly equal to the threshold so it is not counted as below.
func: analyze_coverage
starter: |
  def analyze_coverage(report, threshold=80):
      # fill in here
      return {}
cases: |
  {"a.py": {"lines": 10, "covered": 10}, "b.py": {"lines": 20, "covered": 14}} -> {"total_coverage": 80.0, "worst_file": "b.py", "below_threshold": [], "all_covered": False}
  {"x.py": {"lines": 5, "covered": 3}} -> {"total_coverage": 60.0, "worst_file": "x.py", "below_threshold": ["x.py"], "all_covered": False}
  {"a.py": {"lines": 10, "covered": 10}, "b.py": {"lines": 20, "covered": 20}} -> {"total_coverage": 100.0, "worst_file": "a.py", "below_threshold": [], "all_covered": True}
  {"a.py": {"lines": 10, "covered": 8}, "b.py": {"lines": 10, "covered": 7}, "c.py": {"lines": 10, "covered": 6}} -> {"total_coverage": 70.0, "worst_file": "c.py", "below_threshold": ["b.py", "c.py"], "all_covered": False}
hint: Sum total_lines and total_covered first; compute each file's coverage; worst_file uses the minimum coverage (and lexicographic order on ties); below_threshold uses strictly less than; round the percentage with round(x, 1).
explain: Turning the abstract idea of "coverage" into computable data analysis reinforces the lesson: coverage is about execution, not correctness.
```

## Part 3 · Small project

```quiz
type: project
q: Build a complete test suite for a small Python module, calculator.py, that provides four functions: add, sub, mul, div. Requirements: ① use pytest with coverage of normal inputs, boundary cases (division by zero), and type exceptions; ② use a fixture to prepare a "test dataset" or a temporary log file; ③ use parametrize for multiple inputs; ④ run pytest --cov=calculator and produce a coverage report; ⑤ configure CI (GitHub Actions or GitLab CI) to run the tests on every push; ⑥ explain how to run the tests in the README. Submit the project's file listing and screenshots or logs of the pytest/CI runs.
checklist:
- calculator.py implements add/sub/mul/div.
- Tests cover normal cases, division by zero, and type exceptions.
- At least one fixture is used.
- @pytest.mark.parametrize is used.
- pytest runs and shows a passing result.
- A pytest --cov coverage report is included.
- A CI configuration file exists and triggers on push.
- The README explains how to run the tests.
hint: Division by zero should raise ZeroDivisionError; type exceptions can be asserted with pytest.raises. See lesson 20 for the CI configuration.
explain: A combined application of every topic in this chapter: pyramid (unit + a little integration), fixtures, parametrization, exception tests, coverage, and CI.
```
