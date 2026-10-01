# 第 6 章章测：综合实战

## 第一部分 · 选择题

```quiz
type: choice
q: 前端直接调用第三方 API 时，必须确认的是？
options:
- 接口响应速度要小于 100ms
- 响应头包含允许跨域的 CORS 头
- 接口必须返回 XML
- 接口只能 POST
answer: 1
explain: 浏览器同源策略会拦截无 CORS 的跨域响应，选 API 要先确认 Access-Control-Allow-Origin。
```

```quiz
type: choice
q: 关于 fetch 的错误处理，正确的是？
options:
- fetch 遇到 404 会自动抛错进入 catch
- 只有网络层失败 fetch 才 reject，HTTP 错误需手动检查 res.ok
- await fetch(url) 直接返回解析好的 JSON
- fetch 会阻塞页面渲染直到完成
answer: 1
explain: fetch 只在网络层失败时 reject；404/500 属于成功响应，要手动判断 res.ok。
```

```quiz
type: choice
q: 把用户输入的城市名显示到页面，最安全的做法是？
options:
- el.innerHTML = city
- el.textContent = city
- document.write(city)
- el.outerHTML = city
answer: 1
explain: textContent 把内容当纯文本不会解析 HTML，避免 XSS；innerHTML 有注入风险。
```

```quiz
type: choice
q: 搜索场景下"后发先至"问题，正确解法是？
options:
- 用 setTimeout 延迟所有请求
- 每个请求带序列号，回调时校验是否为最新，否则丢弃
- 把请求改成同步
- 请求失败时 alert
answer: 1
explain: 取号+校验模式：新请求递增 seq，回调比对 seq，丢弃过期的旧结果。
```

```quiz
type: choice
q: localStorage 使用时必须注意？
options:
- 可以直接存对象无需转换
- 只能存字符串，对象需 JSON.stringify；读取要 try/catch 防坏数据
- 存储容量无限
- 跨域共享同一份数据
answer: 1
explain: localStorage 只能存字符串；JSON.parse 可能抛异常，要包 try/catch 兜底。
```

## 第二部分 · 动手题

```quiz
type: js
q: 写一个纯函数 normalizeWeather(raw)，把原始天气对象 {name, main:{temp}, weather:[{description}], main:{humidity}} 转成 {city, temp, condition, humidity}。temp 用 Math.round 取整，condition 取 weather[0].description。
func: normalizeWeather
starter: |
  function normalizeWeather(raw) {
      // name / main.temp / weather[0].description / main.humidity
  }
cases: |
  {"name": "北京", "main": {"temp": 23.6, "humidity": 45}, "weather": [{"description": "晴"}]} -> {"city":"北京","temp":24,"condition":"晴","humidity":45}
  {"name": "上海", "main": {"temp": 19.2, "humidity": 80}, "weather": [{"description": "多云"}]} -> {"city":"上海","temp":19,"condition":"多云","humidity":80}
```

```quiz
type: js
q: 给定 HTML：<div id="box"></div><input id="kw" value="广州">。写一个函数 showKeyword()，把 #kw 的 value 用 textContent 写入 #box，并让 #box 的 className 设为 'active'，最后返回 #box.textContent。
func: showKeyword
starter: |
  function showKeyword() {
      // 读 input 值，写 textContent，设 className，返回 textContent
  }
html: |
  <div id="box"></div>
  <input id="kw" value="广州">
checks:
- (showKeyword(), document.querySelector('#box').textContent === '广州' && document.querySelector('#box').className === 'active')
hint: box.textContent=kw.value；box.className='active'；返回 box.textContent。
explain: 验证 textContent 赋值与 className 设置。
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"带缓存的天气卡片"：页面有输入框（id="city"）、按钮（id="go"）、状态区（id="status"）、卡片区（id="card"）。点击按钮时读取 #city 的值：先检查 localStorage（key="w_cache"，存的是 JSON 字符串，格式 {"city":名,"temp":数,"savedAt":时间戳}），若缓存存在且未过期（当前时间 - savedAt <= 60000 毫秒）且城市相同，就把 #card 显示出来并把 #card 的 textContent 设为"缓存: " + city + ", " + temp + "℃"，同时 #status 设为"来自缓存"；否则把 #status 设为"加载中"，然后用 fetch 模拟（直接构造一个 Promise.resolve 返回 {city, temp: Math.round(Math.random()*30)}）取数据，写入缓存并显示。要求连续点击不出现竞态：用 seq 序列号，只有最新请求的结果才更新页面。
html: |
  <input id="city" value="北京">
  <button id="go">查询</button>
  <div id="status"></div>
  <div id="card" hidden></div>
starter: |
  // 实现：缓存读写 + seq 竞态保护 + 状态切换 + 渲染
explain: 核心是缓存判断、seq 序列号校验防竞态、状态区分"来自缓存/加载中"。
```
