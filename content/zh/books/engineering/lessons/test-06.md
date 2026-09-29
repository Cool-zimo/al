# 第 6 章章测 · 上线前的最后一道关

> 三十课结束，这里是全章的验收。题目覆盖第 26~30 课的核心内容，并回顾全书的工程基本功：环境、配置、命名、lint、git、CI、版本号、Docker。做完了，这本书才算真正合上。

## 第一部分 · 选择题

```quiz
type: choice
q: 一段程序运行很慢，你的第一反应应该是？
options:
- 立刻把列表推导式改成手写 for 循环
- 先跑 cProfile 拿到真实的热点数据，再决定优化哪里
- 直接把 Python 换成 C++，一劳永逸
- 把 print 全删掉，性能自然就上来了
answer: 1
explain: 优化第一原则是先测量。cProfile 能定位真正的瓶颈，凭感觉改代码往往猜错方向。
```

```quiz
type: choice
q: 关于线上日志，正确的是？
options:
- 日志越详细越好，把请求体全文都记下来最方便排查
- 结构化日志带级别和上下文，敏感信息（密码、token）必须脱敏
- 用 print 和 logging 混着写没关系，效果一样
- 日志里记 token 方便排查鉴权问题，没有安全风险
answer: 1
explain: 生产日志需要结构化、带上下文、能检索；敏感信息进日志等于二次泄露，必须脱敏。
```

```quiz
type: choice
q: 下面哪个写法能同时防住 SQL 注入和命令注入？
options:
- 用字符串拼接 + 手动把单引号替换成两个单引号
- SQL 用参数化查询（%s / ?），命令调用用 subprocess 列表形式且避免 shell=True
- 前端做校验就够了，后端不用管
- 把用户输入先 json.dumps 再拼进 SQL 和 shell 命令
answer: 1
explain: SQL 注入用参数化查询，命令注入用 subprocess 列表传参并避免 shell=True，两者都是把输入当数据而非代码。
```

```quiz
type: choice
q: 发现密钥被误提交到了 Git 仓库，正确的处置是？
options:
- 只要把 .env 从工作区删除，再提交一次就行
- 从 Git 历史清理该文件，并立即轮换（重置）该密钥，老密钥作废
- 把密钥留在历史里也没关系，只要以后不加新的就行
- 修改一下密钥的值，但不用轮换，历史里的旧值还能用
answer: 1
explain: 仅删除文件无法清除历史、fork 和 CI 缓存中的副本；必须清理历史并轮换密钥，老密钥一律作废。
```

```quiz
type: choice
q: 一个 Web 服务刚部署就不断重启，最可能的原因是？
options:
- 健康检查端点写得太轻量，没做全表扫描
- restart 策略设为 always，而应用因配置错误启动即崩，陷入无限重启循环
- 镜像没有打 tag，导致无法回滚
- 日志没有结构化
answer: 1
explain: restart: always 会在启动即失败的应用上无限重启，应改用 on-failure / unless-stopped 并配退避。
```

## 第二部分 · 动手题

```quiz
type: local
q: 用 cProfile 给你的项目做一次"体检"。要求：① 选一个实际会跑的脚本（没有就写一个含循环 + 函数调用的 30 行脚本）；② 用 `python -m cProfile -s tottime your_script.py` 跑一遍；③ 记录输出中 tottime 排前三的函数；④ 判断热点是不是你原本以为的那个。把结论和 cProfile 输出截图/粘贴到作业区。
hint: 在 VS Code 终端或命令行执行；如果 tottime 排第一的是你自己没预料到的函数，那说明"先测再优化"的必要性。
checklist:
- 选一个真实会跑的脚本（不是空文件）
- 用 cProfile 跑出函数级耗时
- 找出 tottime 排前三的函数
- 记录优化前的基线耗时，优化后能对比
```

```quiz
type: local
q: 给你的项目加上结构化日志和请求 ID。要求：① 用 logging 模块（不要 print）输出 JSON 一行的结构化日志；② 定义一个敏感字段脱敏函数，对 password/token/api_key/secret 字段替换为 "***"；③ 用 contextvars.ContextVar 携带一个请求/任务 ID，让它出现在每条日志里；④ 故意写一行"错误"日志（含 password=xxx），验证脱敏后输出里看不到明文。把脱敏前后的日志输出贴到作业区。
hint: 用 logging.Filter 把 ContextVar 的值注入到每条 record；脱敏函数接收 dict、返回新 dict，不要原地修改。
checklist:
- 用 logging 而不是 print
- 日志格式含时间、级别、消息
- 每个请求有唯一 request_id，日志里能查到
- 日志里不出现密码、token 等敏感信息
```

## 第三部分 · 小项目

```quiz
type: project
q: 把一个你手头真实存在的小工具（爬虫、数据处理、CLI、自动化脚本都行）改造成"能上线"的状态，按第 1~30 课的全部工具走一遍，并完成 HEALTH.md 自检清单。
checklist:
- 创建独立虚拟环境，用 requirements.txt 或 pyproject.toml 锁定依赖
- .gitignore 排除 .env、__pycache__、.venv、构建产物
- 配置和密钥全部走环境变量，项目里无硬编码密钥
- 用 black / ruff 格式化并跑通，代码命名清晰、函数单一职责
- 关键路径有 pytest 测试，能在干净环境跑通
- 接 CI（GitHub Actions 或其他），自动跑测试 + lint
- 用 git 管理，提交信息清晰，关键改动经过评审或自评记录
- 版本号遵循语义化版本，CHANGELOG.md 记录本次改动
- 跑 pip-audit 无高危漏洞
- 日志用 logging + 结构化 + 脱敏，带任务 ID
- 有 /health 或等价就绪检查（若是批处理任务，写"任务完成 / 失败"的明确终态）
- 用 Dockerfile 或 systemd 配置进程托管，有 restart 策略
- 保留上一版本构建产物（镜像 tag 或归档），回滚步骤写过
- 逐条过项目健康度自检清单并截图 / 提交打勾后的 HEALTH.md
hint: 不要一次全做，按"控风险 → 补质量 → 补交付物"的顺序，一次只改一类，每步都跑得起来。改造前后用测试锁住行为。
explain: 这是全书的收官项目，目标是把零散知识点组合成一个完整可交付物。HEALTH.md 是验收依据，全绿才算通过。
```
