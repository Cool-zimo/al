# 第 2 章 · 变量与数据类型 · 大测验

> 8 道题。选择题检验概念，动手题让你真的写出代码，最后一道小项目把整章串起来。
> **全对才算通过这一章** —— 没通过的题会自动进入你的复习计划。

## 第一部分 · 选择题

检验这章的概念有没有真正记住。

```quiz
type: choice
q: 执行完下面这段代码后，x 的值是多少？
code: |
  x = 5
  x = x + 1
  x = x * 2
options:
- 12
- 10
- 11
- 报错
answer: 0
explain: 一步一步来：x=5 → x+1 得 6 存回 x → x*2 得 12 存回 x。记住口诀：先算右边，再存左边。
```

```quiz
type: choice
q: 表达式 10 / 4 和 10 // 4 的结果分别是？
options:
- 2.5 和 2
- 2 和 2
- 2.5 和 2.5
- 2 和 2.5
answer: 0
explain: / 永远返回 float（Python 3 的规则），所以 10 / 4 = 2.5；// 是整除，只要商不要余数，所以 10 // 4 = 2。
```

```quiz
type: choice
q: 关于字符串，下面说法正确的是？
options:
- 字符串创建后可以用 text[0] = "H" 修改第一个字符
- text = "Hello"; text.upper() 会把 text 本身变成大写
- 字符串是不可变的，text.upper() 返回新字符串，原字符串不变
- 字符串和数字可以直接用 + 相加
answer: 2
explain: 字符串不可变。所有看似"修改"的方法（upper、strip、replace）都是返回一个新字符串，原字符串纹丝不动。想保留结果必须重新赋值：text = text.upper()。
```

```quiz
type: choice
q: 下面哪个值在 Python 里被当作 False？
options:
- "False"
- 0
- "0"
- -1
answer: 1
explain: 规则是"空的和零是假，其余是真"。0 是数字零所以是 False；"False" 和 "0" 都是非空字符串，反而是 True；-1 是非零数字，也是 True。
```

```quiz
type: choice
q: 用户输入后 age = input("年龄：")，接下来想比较 age > 18，应该怎么做？
options:
- 直接写 if age > 18 就行
- 写成 if int(age) > 18
- 写成 if str(age) > 18
- 写成 if age > "18"
answer: 1
explain: input() 返回的永远是字符串，字符串不能和数字比大小（会 TypeError）。必须先 int(age) 转成整数。这是本章最实用的一条铁律。
```

---

## 第二部分 · 动手题

不只是"看懂"，还要"写得出来"。这两道题由机器判分 —— 你改完代码点「运行并检查」，网页会真跑一遍看输出对不对。

```quiz
type: code
q: 用变量和 f-string 输出一张名片，包含姓名、年龄、城市三行信息
starter: |
  # 要求：
  # 1. 把"张三"、20、"杭州" 分别存进 name / age / city 三个变量
  # 2. 用 f-string 输出三行：
  #    姓名：张三
  #    年龄：20
  #    城市：杭州
  
  # 在这里写你的代码
tests:
- assert "姓名：张三" in __out
- assert "年龄：20" in __out
- assert "城市：杭州" in __out
hint: 先三行赋值，再三行 print(f"姓名：{name}") 这样。f-string 会自动把数字 20 转成文字，不用写 str()。
explain: 变量 + f-string 是 Python 里最常用的输出组合。变量负责"集中管理会变的数据"，f-string 负责"把数据自然地嵌进文字里"—— 两者配合，改一处就能改全部。
```

```quiz
type: code
q: 算出 100 秒等于几分钟零几秒
starter: |
  total_seconds = 100
  
  # 用 // 算分钟数，用 % 算剩下的秒数
  # 输出格式：100秒 = 1分40秒
  
  # 在这里写你的代码
tests:
- assert "1分" in __out
- assert "40秒" in __out
hint: minutes = total_seconds // 60，seconds = total_seconds % 60。然后 print(f"{total_seconds}秒 = {minutes}分{seconds}秒")。
explain: // 和 % 是处理"单位换算"的标准搭档：一个给大单位的数量，一个给剩下的零头。时间换算、进制转换、分页计算，全靠它俩。
```

---

## 第三部分 · 小项目

把这一章的东西做成一件"拿得出手"的完整作品。

```quiz
type: project
q: 做一个「个人信息卡片生成器」：用变量存自己的信息，再用字符串拼接和 f-string 输出一张漂亮的卡片
checklist:
- 至少用了 3 个变量（姓名、年龄、城市之类）
- 用 f-string 或 + 把变量和文字拼在一起
- 用 "=" * 30 或 "-" * 30 之类的技巧画了分隔线
- 至少用了一次字符串方法（strip / upper / lower / title 都行）
- 代码能跑通，没有报错
starter: |
  # 个人信息卡片生成器
  # 提示：可以先用 input() 让用户输入，也可以直接写死在变量里
  
  name = "你的名字"
  age = 18
  city = "你的城市"
  
  # 画一条分隔线
  print("=" * 30)
  
  # 用 f-string 输出卡片内容
  print(f"姓名：{name}")
  
  # 继续补充……
  
  print("=" * 30)
hint: 先保证能跑通，再考虑好不好看。分隔线用 "=" * 30 一行搞定；想让名字统一大写可以用 name.upper()。也可以加个 input() 让用户输入自己的信息。
explain: 这个项目把整章串起来了：变量存数据、字符串拼接成句子、乘法造分隔线、字符串方法做格式统一、f-string 让代码可读。看起来简单，但这是所有"生成文本"类程序的雏形 —— 报表、日志、配置文件，本质都是这套。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
name = "张三"
age = 20
city = "杭州"
print(f"姓名：{name}")
print(f"年龄：{age}")
print(f"城市：{city}")
```

**动手题 2：**

```python
total_seconds = 100
minutes = total_seconds // 60
seconds = total_seconds % 60
print(f"{total_seconds}秒 = {minutes}分{seconds}秒")
```

**小项目（一种参考实现）：**

```python
name = input("姓名：").strip()
age = int(input("年龄："))
city = input("城市：").strip()

line = "=" * 34
print(line)
print(f"  姓名：{name.title()}")
print(f"  年龄：{age}")
print(f"  城市：{city.upper()}")
print(line)
```

</details>

## 这一章，你学会了什么

- **变量**：给数据贴标签，`=` 是"放进去"不是"等于"，先算右边再存左边
- **int / float**：`/` 永远给小数，`//` 取商 `%` 取余，浮点数有精度问题不能直接用 `==`
- **str**：引号包起来的文字，不可变，索引从 0 开始，切片含左不含右，`[::-1]` 能反转
- **bool**：只有 True/False，来自比较运算，`and` / `or` / `not` 组合，"空和零是假"
- **类型转换**：`type()` 查类型，`int()` / `float()` / `str()` 做转换，**`input()` 永远是字符串**

一个提醒：**这一章全都是在跟"数据的种类"打交道**。往后学列表、字典、函数、类，本质上都是在这四种基本类型上做组合。地基打牢了，后面会轻松很多。
