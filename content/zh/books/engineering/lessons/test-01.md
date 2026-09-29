# 第 1 章 · 环境与依赖 · 大测验

> 8 道题。这一章解决的是"项目在哪跑、需要什么、怎么管"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于虚拟环境和系统 Python 的关系，正确的是？
options:
- 虚拟环境是系统 Python 的副本，两者完全独立，互不影响
- 虚拟环境复用系统 Python 解释器，但拥有独立的包目录，避免污染系统
- 虚拟环境必须在系统 Python 里 pip install 才能生效
- 系统 Python 坏了不会影响虚拟环境，所以随便往系统装包也没关系
answer: 1
explain: 虚拟环境是用系统 Python 可执行文件创建的，但 site-packages 是独立的，装包装在虚拟环境自己的目录里。它和系统是隔离的，但不是完全独立副本。
```

```quiz
type: choice
q: 为什么不应该把 .env 文件提交到 Git 仓库？
options:
- .env 文件太大，会拖慢 clone 速度
- .env 通常包含密钥和敏感配置，提交后等于泄露，且会留在 Git 历史中
- .env 是二进制文件，Git 不支持
- .env 只能在 Windows 上读取
answer: 1
explain: .env 里放的是 API Key、数据库密码等敏感信息。一旦提交，任何能访问仓库的人都能看到，且删除文件也无法从历史中清除。
```

```quiz
type: choice
q: requirements.txt 和 pyproject.toml 的主要区别是？
options:
- 两者完全等价，只是后缀不同
- requirements.txt 主要是安装清单，pyproject.toml 还能描述项目元信息（名称、版本、作者等）
- pyproject.toml 只能被 poetry 读取，pip 不支持
- requirements.txt 能写作者和许可证信息
answer: 1
explain: requirements.txt 专注于声明依赖供 pip 安装；pyproject.toml 是 PEP 621 标准的项目完整描述，包含依赖、项目名称、版本、作者、许可证等。
```

```quiz
type: choice
q: 关于 pip freeze 的输出，正确的是？
options:
- pip freeze 只输出你直接 pip install 的包
- pip freeze 会输出当前环境里所有包及其精确版本，包括间接依赖
- pip freeze 会自动忽略间接依赖
- pip freeze 的输出可以直接作为开发依赖清单长期使用
answer: 1
explain: pip freeze 导出环境内全部包的精确版本，包括 requests 依赖的 urllib3、certifi 等间接依赖。直接当手写清单用会钉死间接依赖版本。
```

```quiz
type: choice
q: uv 相比传统 pip + venv 的主要优势是？
options:
- uv 用 Rust 实现依赖解析和安装，速度大幅提升，且能管理环境和锁文件
- uv 能绕过 Python 版本限制，在任何系统上跑任意版本
- uv 安装包不需要联网
- uv 是 pip 的官方替代品，由 Python 核心团队维护
answer: 0
explain: uv 的核心优势是用 Rust 重写了依赖解析（求解速度）和并行安装，同时集成了虚拟环境管理、项目初始化、锁文件等一体化能力。
```

## 第二部分 · 动手题

```quiz
type: function
q: 实现一个函数 env_priority(env_value, default_value)，模拟配置读取的优先级逻辑。env_value 是环境变量的值（字符串，可能为空字符串），default_value 是默认值。规则：env_value 非空时返回 env_value；env_value 为空字符串时返回 default_value；env_value 为 None 时也返回 default_value。
func: env_priority
starter: |
  def env_priority(env_value, default_value):
      # 在这里补全
      return default_value
cases: |
  ("prod", "dev") -> "prod"
  ("", "dev") -> "dev"
  (None, 8000) -> 8000
  ("true", False) -> "true"
hint: 判断 env_value 是否为 None 或等于空字符串，是则返回 default_value，否则返回 env_value。
explain: 这是环境变量优先级的简化逻辑，常用于配置加载：环境变量存在则用，否则回落默认值。
```

```quiz
type: function
q: 实现一个函数 normalize_dep(spec)，把依赖声明统一规范化。spec 是字符串，可能带版本约束或没有。返回字典 {"name": 包名, "constraint": 约束串或 None}。约束串指第一个版本运算符（== >= <= ~= < >）及其后面的部分；没有版本运算符则 constraint 为 None。包名统一转小写。例如 "Django>=4.0,<5.0" 的约束是 ">=4.0,<5.0"。
func: normalize_dep
starter: |
  def normalize_dep(spec):
      import re
      result = {"name": "", "constraint": None}
      # 在这里补全
      return result
cases: |
  ("Django>=4.0,<5.0") -> {"name": "django", "constraint": ">=4.0,<5.0"}
  ("requests==2.31.0") -> {"name": "requests", "constraint": "==2.31.0"}
  ("pandas") -> {"name": "pandas", "constraint": None}
  ("Flask~=3.0") -> {"name": "flask", "constraint": "~=3.0"}
hint: 找到第一个版本运算符的位置（遍历字符串找 >=、<=、==、~=、<、>），运算符前是包名，后是约束。注意 >= 和 <= 要优先匹配（2 字符），否则会被 > 和 < 抢先。
explain: 依赖解析器需要先统一解析包名和约束，这是规范化步骤的简化版。
```

## 第三部分 · 小项目

```quiz
type: project
q: 在你的电脑上用命令行建一个符合 src 布局的 Python 项目骨架，包含：虚拟环境、依赖清单、.gitignore、README。验收清单如下。
checklist:
- 在项目根目录用 python3 -m venv .venv 创建虚拟环境，并激活它
- 创建 src/<项目名>/ 目录，内含 __init__.py 和一个空的 main.py
- 创建 tests/ 目录，内含 __init__.py 和一个空的 test_main.py
- 写一份 requirements.txt，列出至少 2 个真实依赖（如 requests、pytest）
- 写一份 .gitignore，至少忽略 .venv/、__pycache__/、.env
- 写一份 README.md，包含项目名称、一句话简介、"安装"和"运行"两段
- 执行 git init && git add . && git status，确认 .venv 目录没有出现在待提交列表中
starter: |
  # 参考命令顺序（在项目根目录下执行）
  python3 -m venv .venv
  source .venv/bin/activate
  mkdir -p src/myproject tests
  touch src/myproject/__init__.py src/myproject/main.py
  touch tests/__init__.py tests/test_main.py
  # 然后创建 requirements.txt / .gitignore / README.md
  git init
  git add .
  git status
```
