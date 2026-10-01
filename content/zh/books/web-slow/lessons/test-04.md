# 第 4 章测验：函数

## 选择题（5 题）

```quiz
type: choice
exam: false
q: 下面哪行代码真正调用了函数 greet？
options:
- function greet() {}
- greet
- greet()
- def greet()
answer: 2
explain: 调用函数必须写名字加括号 greet()。只写 greet 只是一个函数名字。
```

```quiz
type: choice
exam: false
q: 调用 add(3) 时，3 叫做什么？
options:
- 形参
- 实参
- 返回值
- 函数名
answer: 1
explain: 调用时传进去的真值叫"实参"；函数定义里小括号里的名字才叫"形参"。
```

```quiz
type: choice
exam: false
q: 一个没有写 return 的函数，它的返回值是？
options:
- 0
- ""
- undefined
- null
answer: 2
explain: 函数执行到结尾也没遇到 return，返回值就是 undefined。
```

```quiz
type: choice
exam: false
q: 下面哪个函数调用返回 undefined？
options:
- function f(){ return 1; }
- function f(){ return true; }
- function f(){ console.log("hi"); }
- function f(){ return "ok"; }
answer: 2
explain: 只有 console.log 没有 return，函数返回 undefined。
```

```quiz
type: choice
exam: false
q: 想"把数组每一项都翻倍得到新数组"，该用哪个方法？
options:
- forEach
- map
- filter
- push
answer: 1
explain: map 把每一项变换后收集成新数组，正好用来"翻倍"。
```

## 动手题（2 题）

```quiz
type: js
exam: false
q: 写一个函数 sayHi，接收一个名字参数，用 console.log 打印"你好，" + 名字。
func: sayHi
starter: |
  function sayHi(name) {
      // 在这里写
  }
checks:
- (function(){ var logs = []; var orig = console.log; console.log = function (a) { logs.push(String(a)); }; try { sayHi('张三'); } finally { console.log = orig; } return logs.length === 1 && logs[0] === '你好，张三'; })()
- (function(){ var logs = []; var orig = console.log; console.log = function (a) { logs.push(String(a)); }; try { sayHi('李四'); } finally { console.log = orig; } return logs.length === 1 && logs[0] === '你好，李四'; })()
hint: 在函数体里 console.log('你好，' + name)
explain: 调用函数时函数体里的 console.log 会执行并输出。
```

```quiz
type: js
exam: false
q: 写一个函数 isOdd，接收数字 n，是奇数返回 true，偶数返回 false。
func: isOdd
starter: |
  function isOdd(n) {
      // 在这里写
  }
cases: |
  3 -> true
  4 -> false
  0 -> false
hint: 用取余 n % 2 !== 0
explain: 奇数除以 2 余数不为 0，判断结果本身就是布尔值，可直接 return。
```

## 小项目（1 题）

```quiz
type: js
exam: false
q: 做一个"成绩小工具"。写三个函数：1) average(scores) 返回平均分（数组求和除以长度）；2) topScorer(students) 接收学生对象数组 [{name,score}]，返回分数最高的学生名字；3) getPass(students) 返回分数 >=60 的学生数组。请把这三个函数都定义在同一个 starter 里。
func: average
starter: |
  function average(scores) {
      // 返回平均分
  }
  function topScorer(students) {
      // 返回分数最高的学生名字
  }
  function getPass(students) {
      // 返回分数 >=60 的学生数组
  }
checks:
- average([80,90,100]) === 90
- topScorer([{name:"张三",score:85},{name:"李四",score:92},{name:"王五",score:78}]) === '李四'
- getPass([{name:"张三",score:85},{name:"李四",score:55}]).length === 1
hint: average 遍历累加除以 length；topScorer 遍历比较记录最高分名字；getPass 用 filter 或遍历 push
explain: 三个小函数组合成一个"成绩小工具"，用到遍历、比较、筛选。
```
