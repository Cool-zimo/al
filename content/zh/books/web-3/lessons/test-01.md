# 第 1 章章测：异步

## 选择题

```quiz
type: choice
q: JS 单线程意味着什么？
options:
- 一次只能发起一个网络请求
- 同一时刻只能执行一条指令，耗时同步操作会卡死页面
- 无法使用多线程库
- 所有代码都必须写在回调里
answer: 1
explain: 单线程指同一时刻只能执行一条指令。渲染、事件、JS 执行共享主线程，同步耗时操作会阻塞页面。
```

```quiz
type: choice
q: 以下代码的输出顺序是什么？console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); console.log('D');
options:
- A → B → C → D
- A → D → C → B
- A → C → D → B
- A → D → B → C
answer: 1
explain: 同步代码 A、D 先执行；微任务 C 在宏任务 B 之前执行。
```

```quiz
type: choice
q: 回调地狱的本质问题是什么？
options:
- 回调函数的名字太长
- 多层嵌套导致缩进失控、错误处理冗余、难以复用
- 回调不能传参数
- 回调函数必须同步执行
answer: 1
explain: 回调地狱是多层异步嵌套产生的向右箭头式代码，主要问题是缩进失控、错误处理冗余、难以复用。
```

```quiz
type: choice
q: 关于 Promise 状态，下列说法正确的是？
options:
- 状态可以从 fulfilled 变回 pending
- 状态一旦确定就不可逆
- 可以同时处于 fulfilled 和 rejected
- new Promise 时状态已经是 fulfilled
answer: 1
explain: Promise 三种状态：pending、fulfilled、rejected，一旦从 pending 转为后两者就不可逆。
```

```quiz
type: choice
q: 关于 async/await 和 Promise.all，正确的是？
options:
- await 可以在普通函数内使用
- Promise.all([await a(), await b()]) 能实现并行
- async 函数返回值自动包装成 Promise
- Promise.all 是"一成一成"
answer: 2
explain: async 函数返回值自动包装成 Promise；await 需用在 async 函数内；Promise.all 需传入 Promise 本身才并行，且一败全败。
```

## 动手题

```quiz
type: js
q: 写一个函数 delay(ms)，返回一个 Promise：延迟 ms 毫秒后 resolve 字符串 'done'。
func: delay
starter: |
  function delay(ms) {
      // 返回 Promise，延迟 ms 后 resolve('done')
  }
checks:
- (delay(100).then(v => window.__delayVal = v), new Promise(r => setTimeout(() => { r(); }, 150)).then(() => window.__delayVal === 'done'))
- (delay(50).then(v => window.__delayVal2 = v), new Promise(r => setTimeout(() => { r(); }, 80)).then(() => window.__delayVal2 === 'done'))
```

```quiz
type: js
q: 给定 HTML：<button id="btn">点击</button><div id="out"></div>，写一个函数 bindBtn()：点击 #btn 后，用 Promise 延迟 100 毫秒，然后把 #out 的 textContent 设为 '已点击'，并把按钮的 disabled 设为 true。
func: bindBtn
starter: |
  function bindBtn() {
      // 点击按钮后延迟 100ms 改 #out 文本并禁用按钮
  }
html: |
  <button id="btn">点击</button><div id="out"></div>
checks:
- (bindBtn(), new Promise(r => setTimeout(() => { r(); }, 50)).then(() => document.querySelector('#btn').click()).then(() => new Promise(r => setTimeout(() => { r(); }, 150))).then(() => document.querySelector('#out').textContent === '已点击' && document.querySelector('#btn').disabled === true))
hint: 监听 click，在回调里 new Promise(resolve => setTimeout(...)) 延迟后改 DOM。
explain: 异步操作要等延迟完成后才改 DOM，判分需分步等待。
```

## 小项目

```quiz
type: project
q: 做一个"异步任务队列演示"页面：页面上有 3 个按钮（id 分别为 t1、t2、t3）和一个空列表（id="log"）。点击任意按钮后，往 log 里 append 一个 li，文本为该按钮的 id（表示"任务开始"）；然后用延迟模拟异步执行（延迟 200 毫秒），执行完毕后再 append 一个 li，文本为"id 完成"。要求：点击 t1 后 log 依次出现 t1、t1 完成。
html: |
  <button id="t1">任务1</button>
  <button id="t2">任务2</button>
  <button id="t3">任务3</button>
  <ul id="log"></ul>
starter: |
  // 给三个按钮绑定点击，点击后往 #log append li，延迟 200ms 再 append 完成项
explain: 核心是点击后先追加"开始"项，延迟后再追加"完成"项，模拟异步任务的生命周期。
```
