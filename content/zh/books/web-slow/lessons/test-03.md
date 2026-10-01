# 第 3 章测验：装东西的容器

> 这一章测验覆盖第 11~15 课的内容：数组、数组操作、对象、对象数组、综合应用。

## 选择题

```quiz
type: choice
q: 关于数组下标，下列说法正确的是？
options:
- 下标从 1 开始
- 下标从 0 开始
- 下标可以是任意数字
- 数组没有下标
answer: 1
explain: JS 数组下标从 0 开始，第一个元素是 arr[0]。
```

```quiz
type: choice
q: 关于 `push` 和 `pop` 操作，下列说法正确的是？
options:
- push 在开头添加，pop 从开头取出
- push 在末尾添加，pop 从末尾取出
- push 是删除，pop 是添加
- push 和 pop 都在中间操作
answer: 1
explain: push 在数组末尾添加一个元素，pop 从末尾取出并删除一个元素。
```

```quiz
type: choice
q: 有一个对象数组 `let users = [{name:"张三"}, {name:"李四"}]`，要取"李四"的 name，正确写法是？
options:
- users.name[1]
- users[1].name
- users["name"][1]
- users.name
answer: 1
explain: 先取下标 [1] 拿到第二个对象，再用 .name 取属性。
```

```quiz
type: choice
q: 遍历一个长度为 n 的数组，for 循环条件应该写？
options:
- i <= n
- i < n
- i >= n
- i === n
answer: 1
explain: 下标从 0 到 n-1，条件应为 i < n，即 i < arr.length。
```

```quiz
type: choice
q: 在对象数组中筛选符合条件的元素，标准做法是？
options:
- 用 delete 删除不符合的
- 遍历 + if 判断 + push 到新数组
- 用 splice 修改原数组
- 重新创建一个新数组手动赋值
answer: 1
explain: 遍历原数组，if 判断符合条件就 push 到结果数组，这是标准筛选模式。
```

## 动手题

```quiz
type: js
q: 写一个函数 sum，接收一个数字数组，返回所有元素的和。
func: sum
starter: |
  function sum(arr) {
      // 在这里写
  }
cases: |
  [1, 2, 3, 4, 5] -> 15
  [10, 20, 30] -> 60
hint: let total = 0; 遍历累加
explain: 遍历数组累加是数组统计的基础操作。
```

```quiz
type: js
q: 写一个函数 getOldest，接收一个学生对象数组（每个对象有 name 和 age），返回年龄最大的学生的 name。
func: getOldest
starter: |
  function getOldest(students) {
      // 在这里写
  }
cases: |
  [{"name":"张三","age":20},{"name":"李四","age":25},{"name":"王五","age":22}] -> "李四"
hint: 用变量记录当前最大年龄和对应名字，遍历时更新
explain: 遍历 + 比较 + 更新记录，是"找最大值"的标准模式。
```

## 小项目

```quiz
type: js
q: 写一个函数 classReport，接收一个学生对象数组（每个对象有 name、score、city），返回一个对象，包含：passCount（及格人数，score>=60）、avgScore（平均分）、beijingCount（来自北京的人数）。
func: classReport
starter: |
  function classReport(students) {
      // 在这里写
  }
cases: |
  [{"name":"张三","score":85,"city":"北京"},{"name":"李四","score":55,"city":"上海"},{"name":"王五","score":90,"city":"北京"}] -> {"passCount":2,"avgScore":76.66666666666667,"beijingCount":2}
hint: 遍历一次同时统计三个指标，最后返回对象
explain: 一次遍历完成多个统计任务，最后把结果打包成对象返回。
```
