# 第 1 章测验：编程是什么

> 这一章测验覆盖第 01~05 课的内容：代码执行、变量、数据类型、类型转换、输出调试。

## 选择题

```quiz
type: choice
q: `<script>` 标签推荐放在 HTML 的什么位置？
options:
- `<head>` 里
- `<body>` 最末尾
- 只能放在单独 .js 文件里
- 放在 `<title>` 里面
answer: 1
explain: 放 body 末尾能保证页面元素先被解析，代码再执行时不会找不到元素。
```

```quiz
type: choice
q: `let` 和 `const` 的区别是什么？
options:
- 两者完全一样
- `let` 声明的变量可以重新赋值，`const` 不可以
- `const` 声明的变量可以重新赋值，`let` 不可以
- `let` 只能用于数字
answer: 1
explain: const 是常量声明，值不可变；let 是变量声明，可以重新赋值。
```

```quiz
type: choice
q: `typeof "hello"` 的返回值是？
options:
- "number"
- "string"
- "boolean"
- undefined
answer: 1
explain: 加了引号的字符串，typeof 返回 "string"。
```

```quiz
type: choice
q: `"5" + 3` 的结果是什么？
options:
- 8
- "53"
- "8"
- 报错
answer: 1
explain: 有字符串参与时 + 做拼接，数字被转成字符串后拼接。
```

```quiz
type: choice
q: 代码报 `ReferenceError: xxx is not defined`，最可能的原因是？
options:
- 浏览器版本太低
- 变量名拼写错误或未声明
- 网络断了
- 内存不够
answer: 1
explain: is not defined 表示浏览器找不到这个变量，通常是拼写错或忘记声明。
```

## 动手题

```quiz
type: js
q: 写一个函数 convertToNumber，接收一个字符串参数 str（数字形式的字符串），把它转成数字后返回。
func: convertToNumber
starter: |
  function convertToNumber(str) {
      // 在这里写
  }
cases: |
  "100" -> 100
  "3.14" -> 3.14
hint: 用 Number() 转换
explain: Number() 把字符串形式的数字转成真正的数字。
```

```quiz
type: js
q: 写一个函数 greet，接收 name 和 age 两个参数，返回"你好，我叫XXX，今年YY岁"格式的字符串。
func: greet
starter: |
  function greet(name, age) {
      // 在这里写
  }
cases: |
  张三, 20 -> "你好，我叫张三，今年20岁"
  李四, 25 -> "你好，我叫李四，今年25岁"
hint: 用 + 拼接字符串
explain: 字符串拼接把变量嵌入到一段文字中。
```

## 小项目

```quiz
type: js
q: 写一个函数 priceCalculator，接收两个参数 price（字符串形式的数字）和 count（数字），先把 price 转成数字，然后计算总价（price * count）并返回。
func: priceCalculator
starter: |
  function priceCalculator(price, count) {
      // 在这里写
  }
cases: |
  "10", 3 -> 30
  "25.5", 4 -> 102
hint: 先 Number(price) 转成数字，再乘以 count
explain: 输入框读来的值都是字符串，算数学前必须先转换。
```
