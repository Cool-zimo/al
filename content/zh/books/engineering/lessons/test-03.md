# 第 3 章 · 版本控制 · 大测验

> 8 道题。这一章解决的是"怎么和别人一起改代码、怎么保留历史、怎么不出乱子"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: git 的三个区域（按顺序）是？
options:
- 仓库 → 暂存区 → 工作区
- 工作区 → 暂存区 → 仓库
- 暂存区 → 工作区 → 仓库
- 工作区 → 仓库 → 暂存区
answer: 1
explain: 工作区是磁盘上正在编辑的文件，git add 进入暂存区，git commit 进入仓库（版本历史）。理解这个流程就不会问"我改了怎么没提交上"。
```

```quiz
type: choice
q: 关于提交粒度，正确的是？
options:
- 提交越粗越好，减少提交次数
- 一个提交只做一件可独立描述的事，方便单独 review 和回退
- 每次 commit 都应该包含至少 10 个文件的改动
- 提交信息只要写了就不会有问题，内容不重要
answer: 1
explain: 细粒度的提交让每个改动都是可回退、可 review 的独立单元。提交过粗会导致无法单独回退某个改动，丧失了版本控制的价值。
```

```quiz
type: choice
q: Conventional Commits 的提交信息格式，正确的是？
options:
- 任意文字都行，格式不重要
- <类型>(<作用域>): <主题>，正文讲 why 不讲 what
- type: subject 即可，不需要作用域和正文
- 标题写满 200 字，把所有细节都放标题里
answer: 1
explain: 标准格式是 type(scope): subject，scope 可省略。主题用祈使句、不超 72 字符；正文解释为什么这么改，不重复 diff 内容。
```

```quiz
type: choice
q: 什么时候应该用 rebase 而不是 merge？
options:
- 任何时候都用 rebase，历史更干净
- 对本地未推送的分支整理历史时用 rebase；对已推送的公开分支用 merge
- 对已推送的分支用 rebase 更安全
- merge 和 rebase 完全等价，随便选
answer: 1
explain: rebase 会改写提交历史（改变 commit hash），只适合本地未推送的提交。已推送的公开分支用 rebase 会破坏协作者的历史，必须用 merge。
```

```quiz
type: choice
q: 不小心把 .env 提交进了 Git 仓库，正确做法是？
options:
- git rm .env 再 commit 一次就够了
- 立即轮换所有密钥，用 git filter-repo 重写历史后强推，并通知协作者重新 clone
- 把 .env 改名为 .env.bak 就行
- 只要删掉那个分支就安全了
answer: 1
explain: 只删除当前提交，历史里仍保留旧版本。必须重写整个历史并强推，同时通知所有协作者重新 clone。公开仓库的历史不可信，轮换密钥是唯一可靠止损。
```

## 第二部分 · 动手题

```quiz
type: function
q: 实现一个函数 plan_merge(base_commits, branch_commits, strategy)，模拟合并计划。base_commits 是 main 上的提交数，branch_commits 是分支上的提交数。strategy 为 "merge" 时返回 {"commits": base_commits + branch_commits + 1, "note": "保留分叉历史"}；strategy 为 "rebase" 时返回 {"commits": base_commits + branch_commits, "note": "线性历史，改写提交哈希"}。其他策略返回 None。
func: plan_merge
starter: |
  def plan_merge(base_commits, branch_commits, strategy):
      # 在这里补全
      return None
cases: |
  (10, 3, "merge") -> {"commits": 14, "note": "保留分叉历史"}
  (10, 3, "rebase") -> {"commits": 13, "note": "线性历史，改写提交哈希"}
  (5, 2, "squash") -> None
hint: merge 多出一个合并提交（+1）；rebase 不产生合并提交；其他策略返回 None。
explain: 这是合并策略选择的简化模型：merge 保留分叉并产生合并提交，rebase 重演提交形成线性历史。
```

```quiz
type: function
q: 实现一个函数 review_summary(comments)，统计一组评审评论的情况。comments 是字符串列表，每条可能带前缀 blocking:/must:（阻塞）、nit:（轻微）、question:（提问），无前缀为普通建议。返回字典：{"total": 总条数, "blocking": 阻塞数, "nit": 轻微数, "question": 提问数, "suggestion": 普通建议数, "needs_work": 布尔（只要有 1 条阻塞即为 True）}。
func: review_summary
starter: |
  def review_summary(comments):
      result = {
          "total": 0,
          "blocking": 0,
          "nit": 0,
          "question": 0,
          "suggestion": 0,
          "needs_work": False,
      }
      # 在这里补全
      result["needs_work"] = result["blocking"] > 0
      return result
cases: |
  (["blocking: 缺校验", "nit: 命名", "普通建议", "MUST: 修 SQL 注入"]) -> {"total": 4, "blocking": 2, "nit": 1, "question": 0, "suggestion": 1, "needs_work": True}
  (["question: 为什么这样", "nit: 空格"]) -> {"total": 2, "blocking": 0, "nit": 1, "question": 1, "suggestion": 0, "needs_work": False}
  ([]) -> {"total": 0, "blocking": 0, "nit": 0, "question": 0, "suggestion": 0, "needs_work": False}
hint: 转小写后用 startswith 判断前缀（blocking 和 must 都算阻塞），统计各类数量，最后判断 needs_work。
explain: 评审系统常用这种统计来判断 PR 是否可合并：有阻塞意见就不能合并。
```

## 第三部分 · 小项目

```quiz
type: project
q: 在你的项目里完整走一遍 feature 分支工作流：从 main 开分支、做两次有意义的提交、发 PR、合并。验收清单如下。
checklist:
- 确保本地 main 是最新（git checkout main && git pull）
- 用约定式命名开分支，例如 feature/xxx 或 fix/xxx
- 在分支上完成一个完整小功能或修复，拆成 2 个独立提交（每个提交只做一件事）
- 每个提交信息用 Conventional Commits 格式：type(scope): subject
- 提交前本地跑一次格式化工具（black 或 ruff）和测试（pytest）
- 推送到远程（git push -u origin <分支名>）
- 如果是 GitHub/GitLab 项目，发一个 Pull Request / Merge Request 并描述改动
- 合并后删除分支，切回 main 并 pull 确认最新
starter: |
  # 参考命令顺序
  git checkout main
  git pull
  git checkout -b feature/your-feature
  # ... 编辑代码 ...
  git add <具体文件>
  git commit -m "feat(scope): 做了什么"
  # ... 再改一部分 ...
  git add <具体文件>
  git commit -m "test(scope): 补充测试"
  black . && pytest
  git push -u origin feature/your-feature
```
