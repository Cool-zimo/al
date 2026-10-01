# 第 2 章章测：网络请求

## 选择题

```quiz
type: choice
q: fetch 返回的 Promise resolve 成什么？
options:
- 解析好的 JSON 对象
- Response 对象
- 状态码数字
- 请求头对象
answer: 1
explain: fetch 返回的 Promise resolve 的是 Response 对象，需要调用 res.json() 等方法读取响应体。
```

```quiz
type: choice
q: 关于 res.json()，正确的是？
options:
- 它同步返回解析好的对象
- 它返回 Promise，需要 await 或 .then
- 它只能在 POST 请求中使用
- 它会自动检查 res.ok
answer: 1
explain: res.json() 返回 Promise，必须 await 或 .then 才能拿到真数据。
```

```quiz
type: choice
q: fetch 在什么情况下会 reject？
options:
- HTTP 404
- HTTP 500
- 断网或服务器不可达
- 响应体不是合法 JSON
answer: 2
explain: fetch 只在网络层面失败时 reject（断网、不可达、CORS 拦截）。404/500 会正常 resolve，需手动检查 res.ok。
```

```quiz
type: choice
q: 用 fetch 发 POST 请求时，body 应该是什么类型？
options:
- 必须是 JS 对象
- 必须是字符串（如 JSON.stringify 后的结果）
- 必须是 FormData，不能是字符串
- 可以是任意类型，fetch 自动转换
answer: 1
explain: fetch 的 body 在网络传输层必须是字符串或二进制，发 JSON 需 JSON.stringify。
```

```quiz
type: choice
q: 关于 CORS，正确的是？
options:
- CORS 是服务端之间的策略
- CORS 报错时请求一定没发出去，重试即可
- CORS 是浏览器安全策略，报错需后端加响应头或走代理
- 只有跨域 POST 才会触发 CORS
answer: 2
explain: CORS 是浏览器策略；报错时请求已发出但响应被拦截；需后端加 Access-Control-Allow-Origin 头或走代理。
```

## 动手题

```quiz
type: js
q: 写一个函数 fetchJson(url)，返回 Promise：模拟 fetch 一个返回 JSON 的接口——延迟 80ms 后 resolve {data: 'mock'}，然后在 then 里调用 JSON.parse(JSON.stringify(...)) 模拟 res.json() 的效果。这里请直接返回一个延迟 80ms resolve 指定对象的 Promise 即可。
func: fetchJson
starter: |
  function fetchJson(url) {
      // 返回 Promise，80ms 后 resolve({data:'mock'})
  }
checks:
- (fetchJson('/api/x').then(v => window.__fetchVal = v), new Promise(r => setTimeout(() => { r(); }, 100)).then(() => window.__fetchVal && window.__fetchVal.data === 'mock'))
```

```quiz
type: js
q: 给定 HTML：<input id="kw"><button id="go">搜索</button><div id="out"></div>，写一个函数 bindSearch()：点击 #go 时读取 #kw 的值，把它 stringify 成 JSON 字符串 {"q":"值"} 的形式，设置到 #out 的 textContent。用 click 事件实现。
func: bindSearch
starter: |
  function bindSearch() {
      // 点击按钮时读输入，stringify 后展示在 #out
  }
html: |
  <input id="kw" value="北京">
  <button id="go">搜索</button>
  <div id="out"></div>
checks:
- (bindSearch(), document.querySelector('#go').click(), document.querySelector('#out').textContent === '{"q":"北京"}')
hint: 点击时读 input value，JSON.stringify({q: value}) 设 textContent。
explain: 模拟构造请求体字符串，点击后展示。
```

## 小项目

```quiz
type: project
q: 做一个"迷你请求状态演示"页面：有一个按钮（id="btn"）和一个 div（id="box"）。点击按钮后，box 的文本依次变为"加载中..."（立刻）、"成功"（延迟 200ms 后），模拟一次请求从开始到成功的过程。要求 box 最终文本为"成功"。
html: |
  <button id="btn">请求</button>
  <div id="box"></div>
starter: |
  // 点击按钮：立刻设 box 文本为"加载中..."，延迟 200ms 后设为"成功"
explain: 核心是点击后立即显示 loading，延迟后切换到 success 状态。
```
