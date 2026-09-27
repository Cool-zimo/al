# 第 6 章 · 打包交付 · 大测验

> 8 道题。这一章解决的是"程序怎么变成能交付的产物、怎么稳定运行"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 PyInstaller 的 --onefile 与 --onedir，以下说法正确的是？
options:
- --onefile 启动更快，因为无需解压
- --onefile 启动时需要先把运行时解压到临时目录，启动通常比 --onedir 慢，但分发只需一个文件
- --onedir 会把程序压缩成单个文件
- 两者在体积上有巨大差异，--onefile 能省一半空间
answer: 1
explain: --onefile 每次启动都要把整个运行时解压到临时目录（如 %TEMP%/_MEIxxxxxx），所以启动慢；换来的是单个文件便于分发。--onedir 不解压、加载快，但分发要打包成文件夹。两者磁盘占用其实接近，onefile 只是多了一层压缩。
```

```quiz
type: choice
q: 给 tkinter 程序打包时，为什么调试阶段不建议加 --windowed？
options:
- --windowed 会让程序变慢
- --windowed 会隐藏控制台，导致 print 输出和未捕获异常的 traceback 全部不可见，难以排查
- --windowed 会增大体积
- --windowed 只能用于 macOS
answer: 1
explain: --windowed（或 --noconsole）告诉操作系统这是 GUI 子系统程序、不分配控制台。代价是所有 print 和异常 traceback 都无处可去。调试阶段应保留控制台，让错误信息暴露出来；确认无误后再加 --windowed 交付。
```

```quiz
type: choice
q: 一个 tkinter hello world 约 10MB，加入 matplotlib 后打包体积飙到 60MB 以上。关于体积优化，以下做法正确的是？
options:
- 用 --onefile 能大幅减小体积
- 用 --exclude-module matplotlib 可以把体积压到 30MB 左右，但前提是代码确实用不到被排除的模块
- 排除越多越好，反正用不到的都删掉
- UPX 压缩是必选项，能安全地把体积减半
answer: 1
explain: --exclude-module 能排除确定用不到的大块依赖，实测能把含 matplotlib 的 60MB 项目压到 30MB 左右。但排除的前提是代码确实不依赖它，否则运行时会 ModuleNotFoundError。--onefile 不减体积，排除要谨慎，UPX 不稳定且 PyInstaller 已默认不用。
```

```quiz
type: choice
q: 程序里用 open("data/config.json") 读取资源文件，打包后报 FileNotFoundError。正确的解决方式是？
options:
- 把文件改成绝对路径 C:\data\config.json
- 用 sys._MEIPASS 定位资源路径（打包后为临时解压目录），并通过 --add-data 显式附带资源
- 在代码里 try/except 忽略这个错误
- 把资源文件重命名为 .py 然后 import
answer: 1
explain: 打包后程序运行在临时解压目录 _MEIxxxxxx，源码里的相对路径全部失效。用 sys._MEIPASS 获取真实运行时的资源根目录，并用 --add-data 把资源文件显式打包进去，才能正确访问。
```

```quiz
type: choice
q: 关于发布清单，以下哪项是"必须"的？
options:
- 一个 README.md（功能说明、运行方式、打包命令）+ 一个 LICENSE（许可证）+ 明确的版本号
- 只需要把 exe 文件发给用户就行
- README 是可选的，专业项目才需要
- 许可证只要代码够好就不需要
answer: 0
explain: 一个可交付的项目至少要有 README（让用户知道这是什么、怎么用、怎么从源码跑起来）、LICENSE（声明使用权限）、明确的版本号。没有许可证的代码在法律上是"保留所有权利"，别人不敢使用或贡献。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 给记账本加全局异常处理 + 首次建库逻辑：用 logging 把未捕获异常写入 exe 同目录的 ledger_error.log；用 try/except 包裹主循环；程序启动时检测数据库文件是否存在，不存在则调用 init_db() 并弹一个欢迎提示。然后用 --onefile --windowed 打包并验证：故意制造一个异常，确认日志文件被写入。注意：PyInstaller 打包需本机环境，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import tkinter as tk
  import tkinter.ttk as ttk
  import logging
  import sys
  from pathlib import Path
  import sqlite3
  from tkinter import messagebox

  LOG_PATH = Path(sys.executable).parent / "ledger_error.log"
  logging.basicConfig(filename=str(LOG_PATH), level=logging.ERROR,
      format="%(asctime)s %(levelname)s %(message)s")

  DB_PATH = Path("ledger.db")

  def init_db():
      conn = sqlite3.connect(DB_PATH)
      conn.execute("""CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL, category TEXT NOT NULL, note TEXT DEFAULT '')""")
      conn.commit(); conn.close()

  def ensure_db():
      if not DB_PATH.exists():
          init_db()
          messagebox.showinfo("欢迎", "首次启动，已为您创建账本数据库")
      else:
          init_db()  # 确保表结构存在

  root = tk.Tk()
  root.title("记账本")
  root.geometry("400x200")

  def boom():
      return 1 / 0  # 故意触发异常

  ttk.Button(root, text="触发异常测试日志", command=boom).pack(expand=True)

  ensure_db()
  try:
      root.mainloop()
  except Exception:
      logging.exception("未捕获异常")
      raise
checklist:
- logging 配置为输出到 exe 同目录下的 ledger_error.log
- 主循环用 try/except 包裹，未捕获异常被记录完整 traceback
- ensure_db 检测数据库是否存在，不存在则 init_db 并弹欢迎提示
- 打包使用 --onefile --windowed
- 触发异常后日志文件确有内容
- 首次启动能自动建库并提示用户
```

```quiz
type: local
q: 完成发布材料四件套：为你的记账本项目（或任意一个 tkinter 项目）写 README.md（功能、运行、打包、许可证）、LICENSE（MIT）、_version.py（版本号单一来源）、.gitignore（含 *.db、build/、dist/、__pycache__/）。用 bash 脚本验证：在一个干净临时目录里解压/运行你的打包产物，完成一次完整录入流程，确认首次运行自动建库。注意：涉及文件写入与 PyInstaller，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  # _version.py
  VERSION = "1.0.0"

  # README.md 骨架（请补全）
  # =====================================
  # # 记账本
  # 一个 Python + tkinter 桌面记账软件。
  #
  # ## 功能
  # - ...
  #
  # ## 下载与运行
  # 从 Releases 下载 Ledger-1.0.0.zip ...
  #
  # ## 从源码运行
  # pip install -r requirements.txt
  # python main.py
  #
  # ## 打包
  # pyinstaller --onefile --windowed --icon=ledger.ico --name Ledger main.py
  #
  # ## 许可证
  # MIT

  # .gitignore 骨架
  # *.db
  # build/
  # dist/
  # __pycache__/
  # *.spec

  # 验证脚本 verify.sh
  #!/usr/bin/env bash
  set -e
  TMP=$(mktemp -d)
  echo "临时目录: $TMP"
  # TODO: 解压产物到临时目录并运行，完成一次录入
  echo "验证完成，产物可正常启动"
checklist:
- README.md 内容完整（功能、下载运行、源码运行、打包命令、许可证声明）
- LICENSE 文件存在且为 MIT（含年份与版权声明）
- _version.py 存在，界面关于区可读取并显示版本号
- .gitignore 包含 *.db、build/、dist/、__pycache__/、*.spec
- 验证脚本能在干净临时目录里运行产物
- 验证过程中确认首次运行自动建库
- 完成一次完整录入流程，数据能持久化
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 完成记账本的"正式发布"全流程：1) 补齐 README / LICENSE / _version.py / .gitignore；2) 用 logging 实现全局异常兜底；3) 用 sys._MEIPASS 处理所有资源文件（图标、默认数据），并配 --add-data；4) 用第 28、29 课学过的命令做 --onefile --windowed --icon 打包，产物命名含版本号；5) 用对照实验测量至少三种排除配置下的体积并打印对比表；6) 把最终产物打包成带版本号的 zip，写一段发布说明（功能、版本、已知问题、更新日志）。注意：PyInstaller 打包需本机环境，网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  #!/usr/bin/env bash
  # release.sh —— 一键发布脚本骨架
  set -e

  VERSION=$(python -c "import _version; print(_version.VERSION)")
  NAME="Ledger-$VERSION"

  echo "== 清理构建产物 =="
  rm -rf build dist __pycache__ *.db

  echo "== 打包（无排除，基准）=="
  pyinstaller --onefile --windowed --icon=ledger.ico --name "$NAME-full" main.py

  echo "== 打包（排除 matplotlib）=="
  pyinstaller --onefile --windowed --icon=ledger.ico --name "$NAME-nompl" \
      --exclude-module matplotlib main.py

  echo "== 测量体积对比 =="
  # TODO: 递归统计各 dist/$NAME-* 目录体积并打印对比表

  echo "== 打包成 zip =="
  # TODO: zip -r $NAME.zip dist/$NAME-* README.md LICENSE

  echo "== 写发布说明 =="
  # TODO: 生成 RELEASE_NOTES.md

  echo "发布完成: $NAME.zip"
checklist:
- 发布材料齐全：README / LICENSE / _version.py / .gitignore
- 全局异常兜底用 logging 写入日志文件
- 资源文件用 sys._MEIPASS 定位并配 --add-data 附带
- 打包命令使用 --onefile --windowed --icon，产物命名含版本号
- 至少三种排除配置的体积对照实验，结果以表格形式呈现
- 排除 matplotlib 后体积有显著下降（符合 60MB→30MB 量级）
- 最终产物是带版本号的 zip，含 README 与 LICENSE
- 发布说明文字清晰：功能、版本、已知问题、更新日志
- 在一个干净目录验证产物能正常启动并完成录入
```
