# 第 2 章测验：让程序做判断

> 这一章测验覆盖第 06~10 课的内容：比较、if/else、逻辑运算、for 循环、while 循环。

## 选择题

```quiz
type: choice
q: `=` 和 `===` 的区别是什么？
options:
- 两者一样
- `=` 是赋值，`===` 是比较
- `===` 是赋值，`=` 是比较
- 只有 `==` 能用
answer: 1
explain: 单等号是赋值运算符，三等号是严格相等比较运算符。
```

```quiz
type: choice
q: `true && false || true` 的结果是什么？
options:
- true
- false
- 报错
- undefined
answer: 0
explain: && 优先级高于 ||，先算 true && false = false，再算 false || true = true。
```

```quiz
type: choice
q: `for (let i = 0; i < 5; i++)` 循环体执行几次？
options:
- 4 次
- 5 次
- 6 次
- 无限次
answer: 1
explain: i 从 0 到 4，共 5 次。
```

```quiz
type: choice
q: 以下哪种场景最适合用 while 循环？
options:
- 打印 1 到 100
- 从用户读取输入直到输入 quit
- 遍历已知长度的数组
- 计算 1 到 50 的和
answer: 1
explain: 不知道循环次数，只知道停止条件时用 while。
```

```quiz
type: choice
q: 死循环的常见原因是什么？
options:
- 循环条件永远不会变成 false
- 循环体太短
- 用了 let
- 变量名太长
answer: 0
explain: 条件永远为 true 导致循环永不停止，通常是因为忘记更新条件变量。
```

## 动手题

```quiz
type: js
q: 写一个函数 isEven，接收一个数字 n，如果 n 是偶数返回 true，否则返回 false。（提示：用 % 取余）
func: isEven
starter: |
  function isEven(n) {
      // 在这里写
  }
cases: |
  4 -> true
  7 -> false
  0 -> true
hint: n % 2 === 0 表示能被 2 整除
explain: % 取余运算符，n % 2 是 n 除以 2 的余数。
```

```quiz
type: js
q: 写一个函数 factorial，接收一个数字 n，用 while 循环计算 n 的阶乘（1*2*3*...*n）并返回。
func: factorial
starter: |
  function factorial(n) {
      // 在这里写
  }
cases: |
  5 -> 120
  4 -> 24
  3 -> 6
hint: let result = 1, i = 1; while (i <= n) { result *= i; i++; }
explain: while 循环里更新 result 和 i，最终返回 result。
```

## 小项目

```quiz
type: js
q: 写一个函数 fizzBuzz，接收数字 n，返回一个数组：对 1 到 n 的每个数字，如果能被 3 整除放"Fizz"，能被 5 整除放"Buzz"，能同时被 3 和 5 整除放"FizzBuzz"，否则放该数字本身。
func: fizzBuzz
starter: |
  function fizzBuzz(n) {
      // 在这里写
  }
cases: |
  5 -> ["1","2","Fizz","4","Buzz"]
  3 -> ["1","2","Fizz"]
hint: for 循环 + if/else if/else 判断 % 3 和 % 5
explain: 经典面试题，综合考察循环、条件判断和数组操作。
```
