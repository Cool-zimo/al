# 第 2 章章测：数组与对象操作

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于 map、filter、reduce 的区别，下列说法正确的是？
options:
- map 用于过滤数组，filter 用于转换数组
- map 返回转换后的新数组（长度不变），filter 返回满足条件的元素组成的新数组，reduce 将数组归约为单个值
- map 会改变原数组，filter 不会
- filter 返回的数组一定比原数组长
answer: 1
explain: map 对每项转换后返回等长新数组；filter 筛选后返回长度≤原数组的新数组；reduce 通过累加器将数组归约为单一值。三者都不会改变原数组。
```

```quiz
type: choice
exam: true
q: 关于数组遍历方法 forEach 和 map 的区别，下列说法正确的是？
options:
- forEach 会返回新数组，map 不会
- map 返回新数组，forEach 返回 undefined（不返回新数组）
- forEach 可以用 break 中断，map 不可以
- forEach 和 map 完全一样
answer: 1
explain: map 返回转换后的新数组，forEach 总是返回 undefined。forEach 无法用 break 中断（用 return 只能跳过当前迭代），如果需要中断遍历应该用 for...of。
```

```quiz
type: choice
exam: true
q: 关于字符串方法，下列说法正确的是？
options:
- 'hello'.split('') 返回 ['hello']
- 'hello'.charAt(0) 返回 "h"，'hello'[0] 也返回 "h"
- 'hello'.substring(1, 3) 返回 "el"
- '  hello  '.trim() 返回 "  hello  "
answer: 2
explain: 'hello'.split('') 返回 ['h','e','l','l','o']；charAt 和索引访问都能取到字符；substring(1,3) 取索引 1 到 2（不含 3）即 "el"；trim() 去掉首尾空格返回 "hello"。
```

```quiz
type: choice
exam: true
q: 关于对象的解构赋值，下列说法正确的是？
options:
- const { a, b } = { a: 1, c: 3 } 会报错
- 可以给解构的变量设置默认值：const { name = '匿名' } = user
- 解构时不能重命名变量
- 对象解构的顺序很重要
answer: 1
explain: 解构不存在的属性不会报错，会得到 undefined。可以设默认值 { name = '匿名' }。可以重命名 { name: userName }。对象解构与顺序无关（和数组解构不同）。
```

```quiz
type: choice
exam: true
q: 关于数组的 find 和 findIndex 方法，下列说法正确的是？
options:
- find 返回满足条件的元素，findIndex 返回满足条件的元素的索引
- find 返回索引，findIndex 返回元素
- find 找不到时返回 -1
- findIndex 找不到时返回 undefined
answer: 0
explain: find 返回第一个满足条件的元素（找不到返回 undefined），findIndex 返回第一个满足条件的元素的索引（找不到返回 -1）。
```

## 第二部分 · 动手题

```quiz
type: js
exam: true
q: 写一个函数 getActiveUsers(users)：users 是用户数组 [{id, name, isActive, age}]。返回所有 isActive 为 true 的用户，且按 age 从大到小排序。只返回 {id, name, age} 字段。
func: getActiveUsers
starter: |
  function getActiveUsers(users) {
      // 过滤活跃用户 → 排序 → 只保留指定字段
  }
checks:
- JSON.stringify(getActiveUsers([{id:1,name:"张三",isActive:true,age:25},{id:2,name:"李四",isActive:false,age:30},{id:3,name:"王五",isActive:true,age:28}])) === JSON.stringify([{"id":3,"name":"王五","age":28},{"id":1,"name":"张三","age":25}])
- JSON.stringify(getActiveUsers([{id:1,name:"A",isActive:false,age:20}])) === JSON.stringify([])
hint: users.filter(u => u.isActive).sort((a,b) => b.age - a.age).map(u => ({id:u.id,name:u.name,age:u.age}))
explain: 链式调用：filter 过滤 → sort 排序 → map 提取字段。这是数组处理的标准管道模式。
```

```quiz
type: js
exam: true
q: 写一个函数 groupByCity(users)：users 是 [{name, city}]。返回一个对象，key 是 city，value 是该城市的人名数组。例如 [{name:"张三",city:"北京"},{name:"李四",city:"上海"},{name:"王五",city:"北京"}] → {北京:["张三","王五"], 上海:["李四"]}。
func: groupByCity
starter: |
  function groupByCity(users) {
      // 按 city 分组，返回 { city: [names] }
  }
checks:
- JSON.stringify(groupByCity([{name:"张三",city:"北京"},{name:"李四",city:"上海"},{name:"王五",city:"北京"}])) === JSON.stringify({"北京":["张三","王五"],"上海":["李四"]})
- JSON.stringify(groupByCity([])) === JSON.stringify({})
- JSON.stringify(groupByCity([{name:"A",city:"广州"},{name:"B",city:"广州"}])) === JSON.stringify({"广州":["A","B"]})
hint: 用 reduce：acc[user.city] = acc[user.city] || []; acc[user.city].push(user.name); return acc;
explain: reduce 实现分组：累加器是一个对象，遍历每个用户，把名字 push 到对应城市的数组中。
```

## 第三部分 · 小项目

```quiz
type: project
exam: true
q: 写一个函数 processOrders(orders)：orders 是订单数组 [{id, product, price, qty, status}]。返回一个对象 { totalRevenue, totalItems, topProduct, pendingCount }，分别是总营收（price*qty 求和）、总件数（qty 求和）、销量最高的产品名（qty 最多）、待处理订单数（status==='pending' 的数量）。
func: processOrders
starter: |
  function processOrders(orders) {
      // 返回统计对象
  }
checks:
- JSON.stringify(processOrders([{id:1,product:"手机",price:2000,qty:2,status:"completed"},{id:2,product:"耳机",price:200,qty:5,status:"pending"},{id:3,product:"手机",price:2000,qty:1,status:"completed"}])) === JSON.stringify({"totalRevenue":5000,"totalItems":8,"topProduct":"手机","pendingCount":1})
- JSON.stringify(processOrders([])) === JSON.stringify({"totalRevenue":0,"totalItems":0,"topProduct":null,"pendingCount":0})
hint: totalRevenue 和 totalItems 用 reduce 累加；topProduct 用 reduce 统计各产品总销量再找最大；pendingCount 用 filter 计数。
explain: 综合练习：reduce 多次使用 + 对象统计。先 reduce 算出总营收和总件数，再用 reduce 统计产品销量分布，最后 reduce 找最大值对应的产品名。
```
