# test-06 第 6 章 · 校验、发布与维护

> 第 6 章 · 校验、发布与维护 —— 这一章的收尾测验。

```quiz
type: choice
q: 评审报告里的「警告」意味着什么？
options:
- 能发布，但通常说明有问题
- 必须修完才能发布
- 是系统的误报
- 不影响任何东西
answer: 0
```

```quiz
type: choice
multi: true
q: 想让书被机器人收录，需要哪些标记？（多选，3 个）
options:
- 仓库名 al-book- 开头
- topic: al-book
- albook.json 里 format 精确等于 al-book
- README.md 里写明作者
answer: 0, 1, 2
```

```quiz
type: choice
q: 刚发布完，最快多久能在书城看到自己的书？
options:
- 登录状态下书城会实时搜，立刻能看到
- 必须等 6 小时
- 24 小时后
- 一周
answer: 0
```

```quiz
type: fill
q: 报错「cases 里 "1 2 -> 3" 的参数要用逗号分隔」，应该把这一行改成什么？
answer: 1, 2 -> 3
placeholder: 完整的一行
hint: 参数之间加逗号
explain: 参数只按逗号切分，改成 1, 2 -> 3。
```

```quiz
type: choice
q: 读者的书内容来自哪里？
options:
- 作者的 GitHub 仓库，直读
- 主站保存的副本
- CDN 的固定缓存
- 本地下载的文件
answer: 0
```

```quiz
type: function
q: 写一个函数 fmt_report(errors, warnings)，返回一行摘要，形如 "3 错误 2 警告"
func: fmt_report
starter: |
  def fmt_report(errors, warnings):
      return ""
cases: |
  ["a", "b", "c"], ["x", "y"] -> "3 错误 2 警告"
  [], [] -> "0 错误 0 警告"
  ["a"], [] -> "1 错误 0 警告"
hint: 用 f-string 拼数量和文字
explain: f"{len(errors)} 错误 {len(warnings)} 警告"
```

```quiz
type: function
q: 写一个函数 is_valid_format(s)，判断 s 是不是合法的 format 值（必须精确等于 al-book，不能有首尾空格）
func: is_valid_format
starter: |
  def is_valid_format(s):
      return False
cases: |
  "al-book" -> True
  "albook" -> False
  "AL-BOOK" -> False
  "al-book " -> False
hint: 不要 strip，直接比
explain: 直接 s == "al-book"。strip 之后比较的话 "al-book " 会被误判为合法。
```

```quiz
type: project
q: 走完一遍完整流程：建一本新书 → 写 3 课 → 跑评审报告改到 0 错误 → 发布为公开仓库 → 确认能在书城搜到 → 改一课内容再发布 → 确认读者看到的是新版。
starter: |
  # 完整流程：
  #
  # 1. 开发者平台 → 新建
  # 2. 写几课（用题目库插题）
  # 3. 评审报告改到 0 错误
  # 4. 发布（选公开）
  # 5. 书城搜一下
  # 6. 改一课再发布，看是否生效
checklist: |
  - 评审报告 0 错误
  - 发布成功，仓库是公开的
  - 仓库有 topic: al-book
  - 在书城能搜到自己的书
  - 改内容再发布后，读者看到的是新版
  - 试过把可见性改成私有再改回公开
```
