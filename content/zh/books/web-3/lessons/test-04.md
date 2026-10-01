# 第 4 章章测：现代 JS 特性

## 选择题

```quiz
type: choice
q: 关于可选链 ?. 和空值合并 ??，正确的是？
options:
- ?? 会把 0 和 '' 都当成需要兜底的值
- ?. 在 null/undefined 处短路返回 undefined
- || 和 ?? 行为完全一致
- ?? 会在左侧为 0 时用右侧兜底
answer: 1
explain: ?. 在 null/undefined 处短路；?? 只认 null/undefined，0 和 '' 会被 || 覆盖但 ?? 保留。
```

```quiz
type: choice
q: 展开运算符 ... 做的是什么拷贝？
options:
- 深拷贝，嵌套对象也独立
- 浅拷贝，只复制第一层，嵌套对象共享引用
- 会拷贝 getter/setter
- 完全等价于 structuredClone
answer: 1
explain: ... 展开只复制第一层，嵌套对象是引用共享，不是深拷贝。
```

```quiz
type: choice
q: 关于生成器，正确的是？
options:
- 生成器用 function 声明
- yield 会一次性返回所有值
- 生成器是惰性求值的，用 yield 逐个产出
- for...of 不能遍历生成器
answer: 2
explain: 生成器用 function*，惰性求值、逐个 yield；for...of 可遍历生成器。
```

```quiz
type: choice
q: class 子类构造函数里，正确的是？
options:
- 可以不写 super()
- 必须先调用 super() 才能用 this
- super() 必须写在最后一行
- 子类不能用 extends
answer: 1
explain: 子类构造函数必须先 super() 才能访问 this，这是 ES6 硬性规定。
```

```quiz
type: choice
q: 关于防抖和节流，正确的是？
options:
- 防抖是固定间隔执行，节流是安静后执行
- 防抖适合滚动监听
- 防抖是停止触发后才执行，适合搜索联想
- 两者都保证先发的请求先到
answer: 2
explain: 防抖是安静后执行一次，适合搜索联想；节流是固定间隔最多一次，适合滚动。
```

## 动手题

```quiz
type: js
q: 写一个函数 getLast(arr)，用 arr.at(-1) 返回数组最后一个元素；空数组返回 undefined。
func: getLast
starter: |
  function getLast(arr) {
      // 用 at(-1)
  }
cases: |
  [1,2,3] -> 3
  ["a"] -> "a"
  [] -> undefined
```

```quiz
type: js
q: 给定 HTML：<ul id="list"></ul>，写一个函数 renderFlatDemo(items)，把嵌套数组 items 用 flat() 拍平，然后每个元素作为 li 的 textContent append 到 #list。例如 [1,[2,3]] 渲染 2 个 li，文本为 '1'、'2'。
func: renderFlatDemo
starter: |
  function renderFlatDemo(items) {
      // flat + append li
  }
html: |
  <ul id="list"></ul>
checks:
- (renderFlatDemo([1,[2,3]]), document.querySelectorAll('#list li').length === 3)
hint: items.flat() 遍历 append li。注意 [1,[2,3]].flat() 是 [1,2,3] 共 3 个元素。
explain: 拍平后渲染，验证 li 数量。
```

## 小项目

```quiz
type: project
q: 做一个"节流计数器"：页面有按钮（id="btn"）和显示数字的元素（id="num"）。点击按钮时 #num 的数字 +1，但用节流限制：无论多快点击，每 200ms 内最多只 +1 一次。要求连续快速点击 5 次，在 200ms 内最终 num 增加不超过 1。
html: |
  <button id="btn">点击</button>
  <span id="num">0</span>
starter: |
  // 实现 throttle 并绑定到 #btn 点击，控制 #num 增加频率
explain: 核心是 throtttle 函数：记录上次执行时间，未到间隔则忽略。
```
