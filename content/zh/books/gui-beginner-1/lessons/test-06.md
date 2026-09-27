# 章节测验六：实战——文本统计工具

> 这一章你用 5 节课做出了一个完整的文本统计工具。现在来检验一下掌握程度。本章共 8 题：5 道选择题 + 2 道编程题 + 1 道毕业项目。

---

## 选择题（每题 2 分，共 10 分）

```quiz
type: choice
exam: true
q: 关于"需求拆解"，以下说法正确的是？
options:
- 拿到需求应该立刻写代码，边写边改效率最高
- 需求拆解包括列功能清单、画界面草图、写函数签名
- 功能优先级只分"做"和"不做"两档就够了
- 需求清单写完就不能改了，改了等于失败
answer: 1
explain: 需求拆解的核心步骤是：列功能清单 → 画界面草图 → 写函数签名 → 逐个实现。功能优先级建议分 P0/P1/P2 三档，且需求清单是活的文档，随着理解深入可以调整。
```

```quiz
type: choice
exam: true
q: 同一���容器里，下面哪段代码会报 `_tkinter.TclError`？
options:
- label.grid(row=0, column=0); button.grid(row=1, column=0)
- label.pack(); button.pack()
- label.pack(); button.grid(row=0, column=0)
- label.grid(row=0, column=0); button.grid(row=0, column=1)
answer: 2
explain: 同一个父容器里不能同时混用 pack 和 grid。选项 A、B、D 都是统一使用一种布局管理器，只有选项 C 混用了 pack 和 grid，会触发 TclError。
```

```quiz
type: choice
exam: true
q: 用户在文件对话框中点了"取消"，`filedialog.askopenfilename()` 返回什么？
options:
- None
- 空字符串 ""
- 抛出异常
- False
answer: 1
explain: filedialog 的用户取消返回空字符串 ""，不是 None 也不是异常。正确写法是 if not filepath: return。如果写成 if filepath is None 就不会生效。
```

```quiz
type: choice
exam: true
q: 关于 tkinter 的多线程，以下说法正确的是？
options:
- 可以在后台线程里直接调用 text_input.insert() 修改控件
- tkinter 是线程安全的，任何线程都能操作控件
- 后台线程操作控件前必须用 root.after(0, ...) 把操作投递回主线程
- 多线程会让程序运行更快，所以所有回调都应该用线程
answer: 2
explain: tkinter 不是线程安全的，只有主线程能操作控件。后台线程要更新界面必须用 root.after(0, callback) 把更新操作投递回主线程执行。选项 D 错误——不是所有操作都需要线程，只有耗时的才需要。
```

```quiz
type: choice
exam: true
q: 为什么建议把业务逻辑写成"纯函数"（不依赖 tkinter）？
options:
- 因为纯函数运行速度更快
- 因为纯函数可以独立测试、复用和维护，不依赖界面
- 因为 tkinter 不支持在函数里调用
- 因为纯函数可以省内存
answer: 1
explain: 纯函数（输入确定、输出确定、不依赖外部状态）的核心优势是可测试性（可以脱离 GUI 单独验证）、可复用性（换界面也能用）、可维护性（改界面不影响逻辑）。性能和内存不是主要原因。
```

---

## 编程题（每题 15 分，共 30 分）

窗口程序跑不了网页，请在 VS Code 里动手。

```quiz
type: local
exam: true
q: 写一个"单词计数器"程序：一个 Text 输入框（多行），一个 Button 文字"统计"，一个只读 Text 结果区。点击后统计输入文本中的：总字符数、总行数、英文单词数（按空格切分）、最长单词长度，分行显示在结果区。要求：统计逻辑写成纯函数（至少抽出一个 count_all(text) 函数），结果区只读，写入前解锁写完锁定，状态栏显示"统计完成"。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  word_counter.py
starter: |
  import tkinter as tk
  from tkinter import ttk

  # 在这里写：纯函数 count_all(text) -> dict，以及完整界面层
  # 提示：英文单词按 text.split() 切分，空文本返回 0 个单词

  if __name__ == "__main__":
      app = create_app()
      app.mainloop()
checklist:
- 有 count_all(text) 纯函数，返回字典含字符数/行数/单词数/最长单词长度
- 该函数内没有 tkinter 相关代码
- 界面层回调只做取数据、调函数、更新显示
- 结果区是只读 Text，写入前解锁、写完锁定
- 有状态栏 Label，统计完成后显示"统计完成"
- 调用了 mainloop
```

```quiz
type: local
exam: true
q: 扩展"文本统计工具"：在现有功能基础上，给"打开文件"和"保存结果"两个操作都加上：① 用后台线程执行文件读写（threading.Thread + daemon=True + root.after），② 操作期间状态栏显示"正在加载..."或"正在保存..."，③ 完整的异常处理。界面其他部分保持不变。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  tool_async.py
starter: |
  import tkinter as tk
  from tkinter import ttk, filedialog
  import threading

  # 在这里写：后台线程版本的 on_open 和 on_save
  # 提示：worker 函数里读/写文件，完成后用 root.after(0, update) 回主线程更新

  if __name__ == "__main__":
      app = create_app()
      app.mainloop()
checklist:
- 打开文件用了后台线程（threading.Thread）
- 线程设了 daemon=True
- 用 root.after(0, ...) 在主线程更新界面
- 保存结果也用了后台线程
- 操作期间状态栏有提示（"正在加载..."/"正在保存..."）
- 两个操作都有异常处理，出错时在状态栏显示错误信息
- 调用了 mainloop
```

---

## 毕业项目（40 分）

窗口程序跑不了网页，请在 VS Code 里动手。

```quiz
type: local
exam: true
q: 综合运用本课程的所学知识，完成一个"增强版文本统计工具"。要求：

1. **界面布局**：用 Frame 分区 + grid 布局。至少包含：输入区（Text）、按钮区（4 个按钮：打开文件 / 开始统计 / 保存结果 / 清空）、结果区（只读 Text）、状态栏（Label）。

2. **逻辑分离**：统计逻辑（字符数、行数、词频 Top N、平均行长度）必须写成纯函数，界面层只做取数据、调函数、更新显示。词频的 N 通过 Entry 控件让用户自己输入（默认 5），非法输入时提示。

3. **文件读写**：打开文件和保存结果都用 `filedialog`，一律指定 `encoding="utf-8"`，判断用户取消，加异常处理。打开大文件时用后台线程 + `root.after(0, ...)` 防卡死。

4. **异常处理**：用 `@safe_call` 装饰器或类似机制，给所有回调加全局异常兜底。空输入给友好提示。

5. **用户体验**：状态栏实时反馈每一步操作结果；只读区域写入前解锁、写完锁定；窗口拉伸时输入框和结果框能自动变宽。

6. **额外加分项（可选）**：
   - 词频结果做成表格（用 Treeview 展示 排名/字符/次数/占比）
   - 加一个"导出为 CSV"功能（用 csv 模块）
   - 加菜单栏（Menu 控件）组织功能
   - 支持拖拽文件到窗口自动加载

注意：网页里没有显示器，请点"在 VS Code 里打开"运行。

files: |
  final_project.py
starter: |
  import tkinter as tk
  from tkinter import ttk, filedialog
  from collections import Counter
  import threading
  import traceback

  # ==================== 业务逻辑层 ====================
  # 在这里写纯函数：count_chars / count_lines / count_word_freq / avg_line_len / format_result

  # ==================== 工具函数 ====================
  # 在这里写 safe_call 装饰器

  # ==================== 界面层 ====================
  # 在这里写 create_app()，用 Frame + grid 搭建完整界面
  # 含：打开文件（后台线程）/ 开始统计 / 保存结果 / 清空 / 状态栏

  if __name__ == "__main__":
      app = create_app()
      app.mainloop()
checklist:
- 界面用 Frame 分区 + grid 布局（至少 4 个区域：输入/按钮/结果/状态栏）
- 有 4 个按钮：打开文件 / 开始统计 / 保存结果 / 清空
- 统计逻辑是纯函数（无 tkinter 依赖），至少含字符数、行数、词频 Top N、平均行长度
- 词频 N 通过 Entry 让用户输入，非法输入有提示
- 打开文件和保存结果都用 filedialog，指定 utf-8，判断取消，有异常处理
- 打开大文件用了后台线程（daemon=True）+ root.after(0, ...) 防卡死
- 有全局异常兜底（@safe_call 或类似机制）
- 空输入有友好提示（不默默统计）
- 状态栏实时反馈操作结果
- 只读区域写入前解锁、写完锁定
- 窗口拉伸时输入框和结果框能自动变宽（columnconfigure + sticky）
- 调用了 mainloop
```

---

## 评分标准

| 题型 | 题号 | 分值 |
|---|---|---|
| 选择题 | 1-5 | 每题 2 分，共 10 分 |
| 编程题 | 6-7 | 每题 15 分，共 30 分 |
| 毕业项目 | 8 | 40 分 |
| **总分** | | **80 分** |

**及格线：48 分（60%）**

**评分要点（毕业项目）：**

- 基本功能完整、能正常运行：20 分
- 逻辑与界面分离、纯函数清晰：8 分
- 文件读写 + 异常处理完备：6 分
- 多线程防卡死实现正确：4 分
- 用户体验细节（状态栏、只读锁定、响应式布局）：2 分
- **完成加分项，每项额外 +2 分，最多 +4 分**

---

## 你完成了什么

回顾这 6 章 30 课，你从一个 tkinter 小白，到能独立做出一个具备以下能力的工具：

✅ 界面分区布局（Frame + grid）
✅ 事件驱动交互（按钮回调）
✅ 逻辑与界面分离（纯函数 + 闭包）
✅ 文件读写（filedialog + 异常处理）
✅ 多线程防卡死（后台线程 + after）
✅ 用户体验细节（状态栏、空输入兜底、响应式布局）

**这就是一个合格 Python GUI 开发者的起点。** 接下来可以去学 PyQt6 做更专业的桌面应用，也可以用学到的思想去做 Web 前端。无论哪条路，你已经掌握了最核心的东西：**把想法变成用户能点击、能看见、能用的程序。**
