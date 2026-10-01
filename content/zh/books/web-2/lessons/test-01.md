# 第 1 章章测：JS 基础语法

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于 let、const、var 的区别，下列说法正确的是？
options:
- const 声明的变量可以重新赋值
- let 和 const 有块级作用域，var 没有
- var 声明的变量不能重复声明
- let 声明的变量会自动提升并初始化为 undefined，可以在声明前访问
answer: 1
explain: let/const 有块级作用域且存在暂时性死区（声明前不可访问），var 只有函数作用域且会变量提升。const 声明后不能重新赋值。
```

```quiz
type: choice
exam: true
q: 关于 === 和 ==，下列说法正确的是？
options:
- == 和 === 没有任何区别
- === 会进行类型转换，== 不会
- === 不会进行类型转换（严格相等），== 会在比较前尝试类型转换
- == 比 === 更严格
answer: 2
explain: === 是严格相等，不会做类型转换；== 会尝试类型转换后再比较。如 0 == false 为 true，0 === false 为 false。
```

```quiz
type: choice
exam: true
q: 关于 NaN，下列说法正确的是？
options:
- NaN 表示 "Not a Number"，但 typeof NaN 返回 "number"
- NaN === NaN 返回 true
- isNaN("hello") 返回 false
- NaN 是一个数字类型的值
answer: 0
explain: NaN 的类型是 "number"（typeof NaN === "number"），且 NaN 不等于任何值包括它自己（NaN !== NaN）。判断是否为 NaN 用 Number.isNaN()。
```

```quiz
type: choice
exam: true
q: 关于 typeof null，下列说法正确的是？
options:
- typeof null 返回 "null"
- typeof null 返回 "undefined"
- typeof null 返回 "object"（历史遗留 bug）
- typeof null 返回 "boolean"
answer: 2
explain: typeof null 返回 "object"，这是 JS 的历史遗留问题。要检查是否为 null 应该用 === null。
```

```quiz
type: choice
exam: true
q: 关于函数声明和函数表达式，下列说法正确的是？
options:
- 函数表达式 function foo() {} 会被提升，可以在声明前调用
- 箭头函数没有自己的 this 绑定
- 函数声明 const foo = function() {} 会被完整提升
- 箭头函数可以当作构造函数用 new 调用
answer: 1
explain: 箭头函数没有自己的 this，它继承外层作用域的 this。函数声明（function foo(){}）会被提升，函数表达式不会被提升。箭头函数不能用作构造函数。
```

## 第二部分 · 动手题

```quiz
type: js
exam: true
q: 写一个函数 uniqueNumbers(arr)：返回一个新数组，包含 arr 中所有不重复的数字（去重），保持原顺序。例如 [1, 2, 2, 3, 1] → [1, 2, 3]。
func: uniqueNumbers
starter: |
  function uniqueNumbers(arr) {
      // 返回去重后的数组
  }
cases: |
  [1,2,2,3,1,4,3] -> [1,2,3,4]
  [] -> []
  [5] -> [5]
  [1,1,1,1] -> [1]
hint: 用 Set 或者 filter + indexOf。return [...new Set(arr)]; 是最简洁的写法。
explain: 数组去重是常见操作，用 Set 天然去重，展开运算符转回数组。也可以用 filter((item, index) => arr.indexOf(item) === index)。
```

```quiz
type: js
exam: true
q: 写一个函数 getFullName(user)：user 是对象 { firstName, lastName }。用对象解构取出 firstName 和 lastName，返回拼接的全名（中间加空格）。如果 lastName 不存在，只返回 firstName。
func: getFullName
starter: |
  function getFullName(user) {
      // 解构 user，返回全名
  }
checks:
- getFullName({firstName:"三",lastName:"张"}) === "三 张"
- getFullName({firstName:"李"}) === "李"
- getFullName({firstName:"四",lastName:"赵"}) === "四 赵"
hint: const { firstName, lastName } = user; return lastName ? `${firstName} ${lastName}` : firstName;
explain: 对象解构是从对象中提取属性的语法糖。条件运算符处理 lastName 可能不存在的情况。
```

## 第三部分 · 小项目

```quiz
type: project
exam: true
q: 写一个函数 analyzeNumbers(numbers)：numbers 是数字数组。返回一个对象 { sum, average, max, min, evenCount }，分别是总和、平均值（保留两位小数）、最大值、最小值、偶数个数。要求处理空数组返回 { sum:0, average:0, max:null, min:null, evenCount:0 }。
func: analyzeNumbers
starter: |
  function analyzeNumbers(numbers) {
      // 返回统计对象
  }
checks:
- JSON.stringify(analyzeNumbers([1,2,3,4,5])) === JSON.stringify({"sum":15,"average":3,"max":5,"min":1,"evenCount":2})
- JSON.stringify(analyzeNumbers([])) === JSON.stringify({"sum":0,"average":0,"max":null,"min":null,"evenCount":0})
- JSON.stringify(analyzeNumbers([2,4,6])) === JSON.stringify({"sum":12,"average":4,"max":6,"min":2,"evenCount":3})
- JSON.stringify(analyzeNumbers([7])) === JSON.stringify({"sum":7,"average":7,"max":7,"min":7,"evenCount":0})
hint: 空数组先判断返回默认值。sum 用 reduce，max/min 用 Math.max/min（展开数组），evenCount 用 filter(n=>n%2===0).length。
explain: 综合练习：数组统计。reduce 求和、Math.max/min 求极值、filter 计数。空数组边界处理是重点。
```
