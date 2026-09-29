# 第 5 章章测 · 交付与维护

> 本章覆盖语义化版本号、打包与发布、容器化、文档。共 8 题：5 道选择题、2 道动手题、1 个小项目。

## 第一部分 · 选择题

```quiz
type: choice
q: 语义化版本号 MAJOR.MINOR.PATCH 中，各自什么时候加？
options:
- MAJOR 是向后兼容的功能新增；MINOR 是修 bug；PATCH 是破坏性变更
- MAJOR 是做了不兼容的 API 变更；MINOR 是向后兼容的功能新增；PATCH 是向后兼容的 bug 修复
- 三者没有固定含义，随便跳
- MAJOR 只在代码量翻倍时加；MINOR 和 PATCH 看心情
answer: 1
explain: SemVer 规则：MAJOR=不兼容变更（如删除函数、改参数），MINOR=向后兼容新功能，PATCH=向后兼容的 bug 修复。版本号是给用户的契约。
```

```quiz
type: choice
q: 关于打包与发布，正确的是？
options:
- Python 项目只需把 .py 文件压缩发给别人就行，不需要元数据
- 现代 Python 打包用 pyproject.toml 描述项目元数据（名称、版本、依赖、入口），配合构建后端生成分发包，再用 twine 或构建工具上传
- setup.py 是唯一且永远正确的打包方式，其他都不行
- 打包会破坏代码，应该永远直接跑源码
answer: 1
explain: pyproject.toml 是 PEP 517/518 规定的标准配置文件，描述元数据与构建系统；setuptools/poetry/hatch 是常见后端；分发包用构建工具生成后上传到 PyPI。
```

```quiz
type: choice
q: Docker 中镜像（image）和容器（container）的关系，正确的是？
options:
- 镜像和容器是完全独立、毫无关系的两个概念
- 镜像是只读的静态模板，容器是镜像运行起来的实例；一个镜像可以启动多个容器
- 容器是静态文件，镜像才是运行中的进程
- 镜像只能有一个，容器可以有无限个但没法删除
answer: 1
explain: 镜像=模板（只读、可分发），容器=实例（运行中的进程）。一个镜像可以启动多个容器，容器停止后可保留或丢弃。
```

```quiz
type: choice
q: 关于"密钥不能进镜像"，正确的是？
options:
- 把密钥写在 Dockerfile 里，再 RUN rm 删掉就没问题了
- 密钥一旦 COPY/写入镜像层，即使后续删除也仍留在只读层里可被还原；正确做法是 .dockerignore 排除 + 运行时通过环境变量或密钥管理服务注入
- 镜像只有维护者能拉取，放进去也没关系
- 只要在 README 里注明有密钥就行
answer: 1
explain: 镜像分层且只读，删掉也不代表从历史层消失。`.dockerignore` 防止误复制，运行时注入环境变量或用 Secret 管理才安全；泄露后必须轮换密钥。
```

```quiz
type: choice
q: 关于 README 和 CHANGELOG，正确的是？
options:
- README 只要写项目名字，其他都不用；CHANGELOG 就是 git log 复制粘贴
- README 要让人能复制粘贴命令就跑起来（装、用、配、贡献、许可）；CHANGELOG 是给用户看的按版本倒序的变更说明
- README 是写给机器看的，CHANGELOG 才是写给人看的
- 两个都不重要，代码能跑就行
answer: 1
explain: README 是项目的门面和使用指南；CHANGELOG 面向用户记录每个版本的变更，帮助判断升级影响，不是 git log。
```

## 第二部分 · 动手题

```quiz
type: local
q: 为一个虚构的 Python 小项目写一份 Dockerfile 和 .dockerignore。要求：基础镜像锁版本（python:3.11-slim）、先复制 requirements.txt 安装依赖再复制代码、用 exec 形式 CMD、暴露 8000 端口；.dockerignore 至少排除 .git、.env、__pycache__、.venv。写完后用 docker build 构建并用 docker run --rm 启动验证"能跑起来"。请贴出两个文件内容和构建/运行日志。
hint: 参考第 23 课的 Dockerfile 模板；构建时用 -t 打标签便于引用。
explain: 动手实践容器化的两个核心文件，并验证密钥隔离与构建流程。
checklist:
- Dockerfile 指定基础镜像（如 python:3.12-slim）
- 先复制依赖文件再安装依赖（利用 Docker 层缓存）
- 不要把 .env 或任何密钥 COPY 进镜像
- 写了 .dockerignore，排除 __pycache__ / .git / .env
- 用 WORKDIR 而不是在根目录操作
```

```quiz
type: function
q: 实现一个函数 check_changelog(text)，检查一份 CHANGELOG 文本的格式是否正确。规则：① 必须以 "#" 开头的一级标题（Changelog 或 变更记录）开头；② 必须至少有一个版本块，版本块以 "## [" 开头（如 "## [1.3.0]"），且版本号符合 x.y.z 格式（x/y/z 为数字，可以有前导 0 但必须是数字）；③ 至少出现一个分类标签（Added/Changed/Fixed/Removed 之一）。返回字典：{"valid": 布尔, "issues": 问题列表}。issues 可能包含："missing_title"（无一级标题）、"no_version"（无版本块或格式不对）、"no_category"（无分类标签）。全合格返回 {"valid": True, "issues": []}。
func: check_changelog
starter: |
  def check_changelog(text):
      # 在这里补全
      return {"valid": True, "issues": []}
cases: |
  "# Changelog\n\n## [1.3.0]\n### Added\n- 新功能" -> {"valid": True, "issues": []}
  "## [1.3.0]\n### Fixed\n- 修了个 bug" -> {"valid": False, "issues": ["missing_title"]}
  "# Changelog\n### Added\n- 新功能" -> {"valid": False, "issues": ["no_version"]}
  "# Changelog\n## [1.3.0]" -> {"valid": False, "issues": ["no_category"]}
  "随便写点东西" -> {"valid": False, "issues": ["missing_title", "no_version", "no_category"]}
hint: 先按行拆；用正则 r"^## \[(\d+)\.(\d+)\.(\d+)\]" 判断版本块；标题判断以 "# " 开头的一行；分类判断任一行以 "### " 开头且后续词在集合里。注意 valid 为 True 时 issues 必须为空。
explain: 自动校验 CHANGELOG 格式，是发布流程 CI 门禁的常见需求，也是对本章规范的可执行理解。
```

## 第三部分 · 小项目

```quiz
type: project
q: 把一个真实的"能跑的脚本"（比如一个读取 CSV 做统计的脚本，或任何你手头的小工具）改造成可交付项目。要求：① 补单元测试（pytest）覆盖核心逻辑；② 加 GitHub Actions / GitLab CI 自动跑测试；③ 写完整 README（装、用、配、贡献）和 CHANGELOG；④ 用 SemVer 定版本号，改 pyproject.toml 的 version 字段；⑤ 加 .gitignore 并确认 .env/密钥不会进版本库；⑥（加分）写 Dockerfile 并验证能跑起来。完成后提交项目目录清单 + CI 日志 + 运行截图。
checklist:
- 有可运行的 pytest 测试覆盖核心逻辑
- CI 配置文件存在且 push 时能触发通过
- README 包含安装、使用、配置、贡献说明
- CHANGELOG 按版本倒序记录变更
- pyproject.toml 有正确的 version 字段
- .gitignore 已配置，敏感文件被排除
- （加分）Dockerfile 可构建并运行
hint: 参考第 25 课的改造顺序：先控风险，再补质量，最后补交付物。一次只做一类改造。
explain: 综合应用第 5 章全部知识，完成从脚本到可交付项目的完整闭环。
```
