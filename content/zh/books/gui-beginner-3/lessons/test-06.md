# 第 6 章 · 打包交付 · 大测验

> 8 道题。这一章解决的是"把写好的程序变成一个用户能双击运行的产物，并且崩了不吓人、打包别太胖、发布别漏东西"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 给桌面程序装全局异常钩子，以下哪个写法是正确的？
options:
- try: ... except: pass，把一切异常都吞掉
- 用 sys.excepthook 设置处理函数，先打印完整堆栈、再弹友好提示框
- 只在 main 函数外层包一个 try，其他地方都不处理
- 把 traceback 原样弹给用户看，方便用户自己排查
answer: 1
explain: sys.excepthook 是最后一道防线：先 print 完整堆栈给开发者排查线索，再弹一个不含堆栈的友好 messagebox 给用户。裸 except 吞 bug、只在外层包 try 无针对性提示、把堆栈甩给用户既不友好也没意义。
```

```quiz
type: choice
q: 桌面程序的配置文件应该放在哪里？以下说法正确的是？
options:
- 为了方便直接放在程序安装目录下
- Windows 放 %APPDATA%，macOS 放 ~/Library/Application Support，Linux 放 ~/.config
- 账本数据库文件和 config.ini 必须放在同一个目录
- 配置文件必须用 pickle，因为读写最快
answer: 1
explain: 三个平台各有约定的用户配置目录，硬编码或用安装目录都是错的。账本属于用户数据应放文档目录而非配置目录；配置文件用文本格式（ini/json）而非 pickle，跨版本稳定。
```

```quiz
type: choice
q: 关于 PyInstaller 的 --onefile 和 --onedir，以下说法正确的是？
options:
- --onefile 启动更快，因为它不需要解压
- --onefile 启动时需要先把运行时解压到临时目录，因此通常比 --onedir 慢
- --onedir 会把程序压缩成单个文件方便分发
- 两者磁盘占用差异巨大，--onefile 能省一半空间
answer: 1
explain: --onefile 每次启动都要把整个运行时解压到 %TEMP%/_MEIxxxxxx，这是启动慢的根源；--onedir 无需解压秒开。两者磁盘占用其实差不多，onefile 只是多了一层压缩壳。
```

```quiz
type: choice
q: 用 PyInstaller 打包 tkinter 程序时，关于体积优化，以下哪个说法最符合实际？
options:
- 打包体积大头是开发者自己写的业务代码
- 一个 tkinter hello world 约 10MB，加 matplotlib 会到 60MB 以上，体积大头是依赖库
- --onefile 能显著减小磁盘占用，通常比 onedir 小一半
- 排除模块越多越好，反正用不到的就删掉
answer: 1
explain: 实测：tkinter hello world 约 10MB，加 matplotlib 后 60MB+。体积大头是 Python 运行时和依赖库（numpy、matplotlib 字体库等），业务代码压缩后不到 100KB。排除模块要谨慎，排除过头会导致运行时 ModuleNotFoundError。
```

```quiz
type: choice
q: 关于发布时资源文件的处理，以下做法正确的是？
options:
- 直接用相对路径 open("data/xxx.json")，打包后依然能找到
- 用 sys._MEIPASS 定位资源路径，并在打包时通过 --add-data 显式附带
- 把 data 目录写进 .gitignore，让 PyInstaller 自动忽略它
- 把数据库文件打进安装包，方便用户直接使用预置数据
answer: 1
explain: 打包后程序运行在临时解压目录 _MEIxxxxxx，源码里的相对路径全部失效。必须用 sys._MEIPASS 定位资源并用 --add-data 附带。数据库文件不应打进安装包（含测试数据、每次应新建），应加入 .gitignore。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 给你的记账本录入表单加完整的异常处理：1) 写 validate() 校验分类非空、金额能转 float 且 > 0、日期符合 YYYY-MM-DD（用 datetime.strptime）、备注不超过 200 字，校验失败弹 showwarning；2) on_save() 里用 try/except 捕获 ValueError（金额格式）和 OSError（磁盘满/权限），分别给不同提示；3) 装一个 sys.excepthook 全局钩子，把未捕获异常 print 到控制台并弹 showerror（钩子里判断 tk._default_root 是否存在，避免弹窗时也崩）。窗口程序在网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import sys, traceback
  import tkinter as tk
  import tkinter.ttk as ttk
  import tkinter.messagebox as mb
  from datetime import datetime

  def global_exc_handler(exc_type, exc_value, exc_tb):
      text = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))
      print("未捕获异常:\n", text)
      try:
          if tk._default_root is not None:
              mb.showerror("程序出错了", f"发生了一个意外错误：\n{exc_value}")
      except Exception:
          pass

  sys.excepthook = global_exc_handler

  class EntryForm(ttk.Frame):
      def __init__(self, master):
          super().__init__(master)
          self.category = tk.StringVar(value="餐饮")
          self.amount = tk.StringVar()
          self.date = tk.StringVar(value="2026-09-27")
          self.note = tk.StringVar()
          for label, var in [("分类", self.category), ("金额", self.amount),
                             ("日期", self.date), ("备注", self.note)]:
              ttk.Label(self, text=label).pack()
              ttk.Entry(self, textvariable=var).pack()
          ttk.Button(self, text="保存", command=self.on_save).pack(pady=6)
          ttk.Button(self, text="故意触发异常",
                     command=lambda: 1/0).pack()

      def validate(self):
          # TODO: 分类非空 / 金额 float>0 / 日期格式 / 备注长度
          return True

      def on_save(self):
          if not self.validate():
              return
          try:
              amt = float(self.amount.get())
              if amt <= 0:
                  raise ValueError("金额必须大于 0")
          except ValueError as e:
              mb.showwarning("输入有误", f"金额格式不对：{e}")
              return
          try:
              datetime.strptime(self.date.get(), "%Y-%m-%d")
          except ValueError:
              mb.showwarning("输入有误", "日期必须是 YYYY-MM-DD 格式")
              return
          # TODO: 模拟数据库写入，捕获 OSError
          mb.showinfo("成功", "已保存一条记录")

  root = tk.Tk()
  root.title("异常处理测试")
  EntryForm(root).pack()
  root.mainloop()
checklist:
- validate 检查了四项：分类、金额、日期、备注
- 日期用 datetime.strptime 校验格式，格式错给提示
- 金额非数字或 <=0 给出不同提示
- on_save 用 try/except 捕获 ValueError 和 OSError
- 装了 sys.excepthook，能弹窗并打印堆栈
- 钩子里判断了 tk._default_root，避免二次崩溃
- 点击"故意触发异常"按钮能触发全局钩子
```

```quiz
type: local
q: 实现配置系统的三个函数：config_dir()（三平台返回正确配置目录）、save_config()、load_config()（带 fallback 默认值）。在退出时通过 WM_DELETE_WINDOW 保存窗口 geometry 和上次选中的标签页。运行后打印读到的配置，然后手动修改 config.ini 再运行一次验证能读到修改。窗口程序在网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  import os, platform
  import tkinter as tk
  import tkinter.ttk as ttk
  import configparser
  from pathlib import Path

  def config_dir():
      app = "Ledger"
      sysname = platform.system()
      if sysname == "Windows":
          base = os.environ.get("APPDATA")
      elif sysname == "Darwin":
          base = os.path.expanduser("~/Library/Application Support")
      else:
          base = os.environ.get("XDG_CONFIG_HOME") or os.path.expanduser("~/.config")
      p = Path(base) / app
      p.mkdir(parents=True, exist_ok=True)
      return p

  def save_config(path, geometry, last_file, last_tab):
      cp = configparser.ConfigParser()
      cp["Window"] = {"geometry": geometry}
      cp["Recent"] = {"last_file": last_file, "last_tab": str(last_tab)}
      with open(path, "w", encoding="utf-8") as f:
          cp.write(f)

  def load_config(path):
      cp = configparser.ConfigParser()
      cp.read(path, encoding="utf-8")
      return {
          "geometry": cp.get("Window", "geometry", fallback="1000x650+100+100"),
          "last_file": cp.get("Recent", "last_file", fallback=""),
          "last_tab": cp.getint("Recent", "last_tab", fallback=0),
      }

  root = tk.Tk()
  root.title("配置系统测试")
  root.geometry("600x400")
  nb = ttk.Notebook(root)
  for name in ["录入", "统计", "设置"]:
      nb.add(ttk.Frame(nb), text=name)
  nb.pack(fill="both", expand=True)

  cfg = load_config(config_dir() / "config.ini")
  print("读取到的配置:", cfg)
  print("配置目录:", config_dir())

  def on_close():
      save_config(config_dir() / "config.ini",
                  root.geometry(), "", nb.index(nb.select()))
      print("已保存配置，geometry =", root.geometry(),
            "last_tab =", nb.index(nb.select()))
      root.destroy()

  root.protocol("WM_DELETE_WINDOW", on_close)
  root.mainloop()
checklist:
- config_dir 三平台分支正确（Windows APPDATA / macOS ~/Library / Linux ~/.config）
- save_config 写入 [Window] 和 [Recent] section 及键值
- load_config 用 fallback，文件不存在也不崩
- WM_DELETE_WINDOW 正确保存 geometry 和 last_tab
- 重开后配置能恢复（窗口大小或标签页位置）
- 手动修改 config.ini 后重新运行能读到新值
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 完成一次"发布就绪"检查：对你的记账本项目（或任意 tkinter 项目）补齐发布材料 + 做一次完整打包验证。要求：1) 写 README.md（含功能介绍、下载运行方式、从源码运行命令、PyInstaller 打包命令、许可证声明）；2) 添加 _version.py 作为版本号单一来源，在界面关于区显示"记账本 v1.0.0"；3) 添加 LICENSE 文件（MIT）；4) 添加 .gitignore（含 *.db、build/、dist/、__pycache__/、*.spec、config.ini）；5) 用 logging 配置日志输出到 exe 同目录的 ledger_error.log（用 sys.executable 定位）；6) 写一段 bash 或 Python 脚本执行"清理开发产物 → 读取版本号 → --onefile --windowed 打包 → 复制到干净目录验证启动"的完整流程。窗口程序在网页里跑不了，请点"在 VS Code 里打开"运行。
starter: |
  # 目录结构建议：
  #   ./main.py         主程序入口
  #   ./_version.py     版本号单一来源
  #   ./README.md       项目说明
  #   ./LICENSE         MIT 许可证
  #   ./.gitignore      忽略规则
  #
  # _version.py:
  #   VERSION = "1.0.0"
  #
  # main.py 骨架（含日志 + 关于区）:
  import tkinter as tk
  import tkinter.ttk as ttk
  import logging
  import sys
  from pathlib import Path
  from _version import VERSION

  log_path = Path(sys.executable).parent / "ledger_error.log"
  logging.basicConfig(
      filename=str(log_path),
      level=logging.ERROR,
      format="%(asctime)s %(levelname)s %(message)s",
  )

  def main():
      root = tk.Tk()
      root.title("记账本")
      root.geometry("400x200")
      ttk.Label(root, text=f"记账本 v{VERSION}", font=("", 16)).pack(expand=True)
      root.mainloop()

  if __name__ == "__main__":
      try:
          main()
      except Exception:
          logging.exception("未捕获的异常")
          raise

  # 发布脚本 build_release.sh 骨架:
  #   #!/usr/bin/env bash
  #   set -e
  #   rm -rf build dist __pycache__ *.db
  #   VERSION=$(python -c "import _version; print(_version.VERSION)")
  #   pyinstaller --onefile --windowed --name "Ledger-$VERSION" main.py
  #   mkdir -p /tmp/ledger_test
  #   cp "dist/Ledger-$VERSION" /tmp/ledger_test/
  #   echo "请在干净目录验证启动: /tmp/ledger_test/Ledger-$VERSION"
  #   zip -r "Ledger-$VERSION.zip" "dist/Ledger-$VERSION" README.md LICENSE
checklist:
- README.md 内容完整（功能、下载运行、源码运行、打包命令、许可证声明）
- _version.py 存在且界面关于区正确显示版本号
- LICENSE 文件存在且为合法 MIT 许可证文本
- .gitignore 包含 *.db、build/、dist/、__pycache__/、*.spec、config.ini
- logging 配置输出到 exe 同目录下的 ledger_error.log
- 发布脚本能清理开发产物、读取版本号、打包、复制验证
- 打包命令含 --onefile --windowed 且产物命名带版本号
- 最终产物是带版本号的 zip，内含 README 和 LICENSE
