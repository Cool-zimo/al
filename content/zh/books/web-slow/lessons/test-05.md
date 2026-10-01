# 第 5 章测验：网页与 DOM

## 选择题（5 题）

```quiz
type: choice
exam: false
q: 想找到 id 为 app 的元素，正确的选择器是？
options:
- document.querySelector("app")
- document.querySelector("#app")
- document.querySelector(".app")
- document.querySelector("*app")
answer: 1
explain: id 用井号 #，写成 '#app'；'.app' 是找 class。
```

```quiz
type: choice
exam: false
q: querySelector 找不到元素时返回什么？
options:
- undefined
- null
- 0
- 空数组
answer: 1
explain: 找不到元素返回 null，不是报错也不是 undefined。
```

```quiz
type: choice
exam: false
q: 为什么不应该把用户输入的内容直接赋值给 innerHTML？
options:
- 会报错
- 用户输入的标签会被当成真的 HTML 执行，造成 XSS
- innerHTML 只能读不能写
- 会让页面变慢
answer: 1
explain: innerHTML 会把字符串解析成 HTML，恶意脚本会被执行，这就是 XSS 风险。
```

```quiz
type: choice
exam: false
q: 想给元素切换一个 class（有则删、无则加），该用？
options:
- classList.add
- classList.remove
- classList.toggle
- classList.has
answer: 2
explain: toggle 就是"有就删、没有就加"，一句实现开关。
```

```quiz
type: choice
exam: false
q: 用 onclick 连续两次赋值，会怎样？
options:
- 两个处理函数都生效
- 后面的会覆盖前面的
- 会报错
- 只有第一次生效
answer: 1
explain: onclick 是属性赋值，赋值第二次会把第一次覆盖掉。
```

## 动手题（2 题）

```quiz
type: js
exam: false
q: 给定 HTML：<p id="msg">旧内容</p>，写函数 update，把它的文字改成"已更新"。
func: update
html: |
  <p id="msg">旧内容</p>
starter: |
  function update() {
      // 在这里写
  }
checks:
- (update(), document.querySelector('#msg').textContent === '已更新')
hint: 用 textContent 赋值
explain: textContent 赋值会立即反映到页面上。
```

```quiz
type: js
exam: false
q: 给定 HTML：<button id="btn">点我</button><span id="n">0</span>，写函数 setup，给 btn 绑 click 监听，每次点击把 n 的数字加 1。
func: setup
html: |
  <button id="btn">点我</button><span id="n">0</span>
starter: |
  function setup() {
      // 在这里写
  }
checks:
- (setup(), document.querySelector('#n').textContent = '0', document.querySelector('#btn').click(), document.querySelector('#n').textContent === '1')
- (document.querySelector('#n').textContent = '0', document.querySelector('#btn').click(), document.querySelector('#btn').click(), document.querySelector('#n').textContent === '2')
hint: addEventListener 里把 n 的 textContent 转成数字再加 1 再写回
explain: 点击回调里操作 n 的内容，实现计数器；点两次应该是 2。
```

## 小项目（1 题）

```quiz
type: js
exam: false
q: 做一个"图片切换器"。给定 HTML：<img id="pic" src="a.jpg"><button id="next">下一张</button>，写函数 setup2，给按钮绑 click，每次点击把图片 src 在后缀 a/b/c 三张之间循环切换（第一次点变 b.jpg，第二次变 c.jpg，第三次变回 a.jpg）。请把按钮监听的绑定写在 setup2 里。
func: setup2
html: |
  <img id="pic" src="a.jpg"><button id="next">下一张</button>
starter: |
  function setup2() {
      // 在这里写，用闭包变量记录当前是哪张
  }
checks:
- (setup2(), document.querySelector('#next').click(), document.querySelector('#pic').src.endsWith('b.jpg'))
- (setup2(), document.querySelector('#next').click(), document.querySelector('#next').click(), document.querySelector('#pic').src.endsWith('c.jpg'))
hint: 用一个外部变量 index，点击时 index = (index+1)%3，然后拼成 'abc'[index]+'.jpg' 赋给 pic.src
explain: 用闭包变量记录当前下标，点击时循环切换，体现事件 + 状态的思想。
```
