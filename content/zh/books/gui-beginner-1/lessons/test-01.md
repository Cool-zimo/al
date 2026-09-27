# 第 1 章 · 第一个窗口 · 大测验

> 8 道题。这一章解决的是"从命令行到窗口"的问题：GUI 三要素、tkinter 怎么 import、`Tk()` 和 `mainloop()`、窗口属性、Label/Button 控件、Entry 交互。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 GUI 的三要素，下列说法正确的是？
options:
- 三要素是窗口、控件、事件
- 三要素是输入、处理、输出
- 三要素是变量、函数、类
- 三要素是文件、路径、编码
answer: 0
explain: GUI 由窗口（承载一切）、控件（用户操作的对象）、事件（用户的动作）三要素组成。选项 B 是一般程序的抽象流程，不是 GUI 特有的三要素。
```

```quiz
type: choice
q: 下面哪句代码能正确导入 tkinter 并创建一个标题为"测试"的窗口？
options:
- from tkinter import *；root = Tk()；root.title("测试")
- import tkinter as tk；root = tk.Tk()；root.title("测试")
- import Tkinter；root = Tkinter.Tk()
- import tkinter.ttk as tk；root = tk.Tk()
answer: 1
explain: 推荐写法是 import tkinter as tk 然后用 tk.Tk() 和 tk.title。选项 A 用 import * 污染命名空间，不推荐；选项 C 是 Python 2 的 Tkinter 写法；选项 D 错误，ttk 是子模块，不包含 Tk 类。
```

```quiz
type: choice
q: mainloop() 的作用是？
options:
- 让程序立即退出
- 启动事件循环，让窗口一直显示并响应用户操作
- 创建一个新窗口
- 关闭当前窗口
answer: 1
explain: mainloop() 启动事件循环，程序在这里停住等待用户操作，是窗口程序的"终点站"。选项 A 相反；选项 C 是 Tk() 的作用；选项 D 是 destroy() 的作用。
```

```quiz
type: choice
q: root.geometry("400x300+100+50") 中的各部分含义是？
options:
- 宽 400、高 300、位置 (100, 50)
- 宽 400、高 300、位置 (400, 300)
- 宽 400、高 300、最大尺寸 100x50
- 宽 100、高 50、位置 (400, 300)
answer: 0
explain: geometry 格式是"宽x高+X+Y"，x 前面是尺寸，+ 后面是位置。所以是宽 400 高 300、左上角在屏幕坐标 (100, 50)。
```

```quiz
type: choice
q: 想让窗口在屏幕居中，核心计算公式是？
options:
- x = 屏幕宽 / 2
- x = (屏幕宽 - 窗口宽) // 2
- x = 屏幕宽 + 窗口宽
- x = 0
answer: 1
explain: 居中要先算出屏幕和窗口的差值，再平分到左右两侧，所以是 (屏幕宽 - 窗口宽) // 2。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个程序：窗口标题为"第一章测验"，大小 500x400，锁定不可改大小，设最小尺寸 400x300，并在窗口里放一个 Label 显示"欢迎来到 GUI 世界"。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  # 在这里补全：标题、geometry、resizable、minsize、Label、mainloop
checklist:
- 标题为"第一章测验"
- 大小 500x400
- 锁定不可改大小 resizable(False, False)
- 最小尺寸 400x300
- Label 显示"欢迎来到 GUI 世界"
- 调用了 mainloop
```

```quiz
type: local
q: 写一个"点击计数器"：Label 初始显示"点击次数：0"，每点一次按钮计数加一并更新 Label。提示：用 global 声明计数器。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("点击计数器")
  count = 0

  # 在这里写：计数函数（global count）、Label、Button、mainloop
checklist:
- count 初始为 0
- 函数里用 global count
- Label 初始显示"点击次数：0"
- 点击后计数加一并更新 Label
- 调用了 mainloop
```

## 第三部分 · 小项目

```quiz
type: local
q: 综合项目：做一个"BMI 计算器"窗口。界面包含：一个 Label"身高(cm):"、一个 Entry；一个 Label"体重(kg):"、一个 Entry；一个 Button"计算"；一个 Label 显示结果。点击按钮后计算 BMI = 体重 / (身高/100)^2，结果保留两位小数。处理非数字和除零（身高为 0 或空），用红色文字提示错误。
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("BMI 计算器")

  # 在这里搭界面并写计算函数
checklist:
- 有身高、体重两个 Entry 输入框和对应 Label
- 有"计算"按钮，command 正确指向函数
- 有结果 Label 显示 BMI
- BMI 计算正确：体重 / (身高/100)^2，保留两位小数
- 处理了非数字和身高为 0 的情况，红色提示
- 界面控件都正确上架（pack/grid/place）
- 调用了 mainloop
```
