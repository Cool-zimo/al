# 第 4 章章测 · 测试与自动化

> 本章覆盖测试金字塔三层、fixture 与参数化、测试隔离、mock 的取舍、覆盖率与 CI。共 8 题：5 道选择题、2 道动手题、1 个小项目。

## 第一部分 · 选择题

```quiz
type: choice
q: 测试金字塔从上到下三层通常是？
options:
- 单元测试、集成测试、端到端测试
- 端到端测试、集成测试、单元测试
- 性能测试、安全测试、功能测试
- 手动测试、自动测试、探索性测试
answer: 0
explain: 测试金字塔底层是量大、快速的单元测试；中层是集成测试；顶层是少量、慢的端到端测试。越往上数量越少、越慢、越脆弱。
```

```quiz
type: choice
q: 关于 pytest 的 fixture 和 @pytest.mark.parametrize，正确的是？
options:
- fixture 用于准备测试依赖的上下文（如数据库连接、临时目录）并可复用；parametrize 用于同一测试逻辑跑多组输入输出
- fixture 只能用在类里，不能用于函数；parametrize 只能用于类
- fixture 的作用是把测试并行化，parametrize 的作用是跳过测试
- 两者是同一个东西的两种写法，选一个用就行
answer: 0
explain: fixture 通过依赖注入提供可复用的测试上下文；parametrize 是数据驱动，用不同参数组合反复执行同一个测试函数。
```

```quiz
type: choice
q: 关于"测试隔离"，正确的是？
options:
- 测试之间可以共享全局状态，只要跑得快就行
- 每个测试应相互独立、可单独运行，不依赖其他测试的执行顺序或残留状态
- 测试必须按字母顺序执行才能算隔离
- 隔离只是指把测试文件放在不同目录，内容无所谓
answer: 1
explain: 测试隔离要求每个用例独立、可单独跑、不依赖顺序。共享状态或残留状态会导致偶发失败、难以定位问题。用 fixture 的 setup/teardown 或 tmp_path 来保证隔离。
```

```quiz
type: choice
q: 关于 mock，什么时候"不该 mock"？
options:
- 当要测试的就是那段协作逻辑本身时（比如要验证你确实按正确参数调用了下游），mock 用得越多越好
- 当你测的是一个跨越多个真实模块、依赖真实行为才能验证正确性的核心流程（如数据库事务、文件系统交互）时，过度 mock 会让测试通过但实际行为已坏
- 永远都应该 mock，真实调用太慢
- 只有当代码没有依赖时才需要 mock
answer: 1
explain: mock 是双刃剑：过度 mock 会让测试变成"验证 mock 被调用了"，与真实行为脱节。核心集成流程、涉及真实副作用的部分，需要真实集成测试而不是层层 mock。
```

```quiz
type: choice
q: "覆盖率 100%"意味着什么？
options:
- 代码绝对没有 bug，可以放心发布
- 每一行都被执行到了，但不代表所有分支、边界、语义都正确；100% 覆盖率 ≠ 没 bug
- 所有函数都被调用过一次，所以逻辑一定对
- 覆盖率只是个装饰性指标，完全没有意义
answer: 1
explain: 覆盖率只说明代码被执行过，不说明断言正确、边界处理对、语义符合预期。100% 行覆盖仍可能有逻辑错误；覆盖率是下限指标，不是质量证明。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个最小可运行的 pytest 用例来验证函数 add(a, b) 在整数、负数、零三种情况下都正确。要求：使用 @pytest.mark.parametrize 提供三组参数；运行 pytest -v 能看到三个用例分别通过。请写出测试文件内容并贴出 pytest 运行结果。
hint: 先写被测试函数 add(a,b): return a+b，再写带 parametrize 的测试函数。
explain: 动手练习 parametrize 数据驱动测试，是 pytest 最常用的写法。
checklist:
- 写一个 test_add.py，用 pytest 风格（不需要 import unittest）
- 至少覆盖：正整数、负数、零、浮点四种输入
- 用 parametrize 把四种输入写成一个测试函数
- 本地运行 pytest 能通过，故意把 add 改错时测试会失败
```

```quiz
type: function
q: 实现一个函数 analyze_coverage(report)，模拟分析一份覆盖率报告。参数 report 是一个字典，键为文件名，值为另一个字典 {"lines": 总行数, "covered": 覆盖行数}。返回一个字典：① "total_coverage"：全局覆盖率（所有文件覆盖行数之和 / 所有文件总行数，百分比，保留 1 位小数）；② "worst_file"：覆盖率最低的文件名（相同时取字典序靠前的）；③ "below_threshold"：覆盖率低于阈值（默认 80）的文件名列表，升序；④ "all_covered"：是否所有文件都是 100% 覆盖（布尔）。例如 report 只有一个文件 {"a.py": {"lines": 10, "covered": 8}}，阈值为 80 时，该文件正好等于阈值不算低于。
func: analyze_coverage
starter: |
  def analyze_coverage(report, threshold=80):
      # 在这里补全
      return {}
cases: |
  {"a.py": {"lines": 10, "covered": 10}, "b.py": {"lines": 20, "covered": 14}} -> {"total_coverage": 80.0, "worst_file": "b.py", "below_threshold": [], "all_covered": False}
  {"x.py": {"lines": 5, "covered": 3}} -> {"total_coverage": 60.0, "worst_file": "x.py", "below_threshold": ["x.py"], "all_covered": False}
  {"a.py": {"lines": 10, "covered": 10}, "b.py": {"lines": 20, "covered": 20}} -> {"total_coverage": 100.0, "worst_file": "a.py", "below_threshold": [], "all_covered": True}
  {"a.py": {"lines": 10, "covered": 8}, "b.py": {"lines": 10, "covered": 7}, "c.py": {"lines": 10, "covered": 6}} -> {"total_coverage": 70.0, "worst_file": "c.py", "below_threshold": ["b.py", "c.py"], "all_covered": False}
hint: 先汇总 total_lines 和 total_covered；逐个算各文件覆盖率；worst_file 用最小覆盖率（相等时用文件名字典序）；below_threshold 判断严格小于阈值；百分比用 round(x, 1)。
explain: 把抽象的"覆盖率"概念量化成可计算的数据分析，加深理解：覆盖率只是执行过，不代表正确。
```

## 第三部分 · 小项目

```quiz
type: project
q: 为一个小型 Python 模块 calculator.py（提供 add/sub/mul/div 四个函数）建立完整测试体系。要求：① 用 pytest 写测试，至少覆盖正常输入、边界（除零）、类型异常三类；② 使用 fixture 准备一个"测试数据集合"或临时日志文件；③ 用 parametrize 覆盖多组输入；④ 跑 pytest --cov=calculator 得到覆盖率报告；⑤ 配置 CI（GitHub Actions 或 GitLab CI）在每次 push 时自动跑测试；⑥ 在 README 里说明怎么跑测试。完成后提交项目目录清单和 pytest/CI 运行截图或日志。
checklist:
- calculator.py 实现 add/sub/mul/div 四个函数
- 测试覆盖正常、除零、类型异常
- 使用至少一个 fixture
- 使用 @pytest.mark.parametrize
- 能跑通 pytest 并显示通过
- 有 pytest --cov 覆盖率报告
- 有 CI 配置文件，push 时能触发
- README 写明测试运行方式
hint: 除零要抛 ZeroDivisionError；类型异常可用 pytest.raises 断言。CI 配置参考第 20 课。
explain: 综合应用本章全部知识点：金字塔（单元+少量集成）、fixture、parametrize、异常测试、覆盖率、CI。
```
