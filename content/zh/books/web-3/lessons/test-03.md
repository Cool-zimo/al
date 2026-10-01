# 第 3 章章测：数据与存储进阶

## 选择题

```quiz
type: choice
q: JSON.parse(JSON.stringify(obj)) 深拷贝的缺陷是？
options:
- 会完美保留所有类型
- 遇到循环引用会抛错，且会丢弃函数、Date 等类型信息
- 会复制对象的 getter/setter
- 只能拷贝第一层
answer: 1
explain: JSON 深拷贝遇到循环引用抛错，会丢弃函数、undefined、Map、Set，Date 转成字符串。
```

```quiz
type: choice
q: 关于 Set 的去重，下列说法正确的是？
options:
- Set 按对象内容去重，两个内容相同的对象算一个
- Set 按引用相等去重，内容相同但引用不同的对象不算重复
- Set 的键会被强制转成字符串
- Set 可以直接 JSON.stringify
answer: 1
explain: Set 去重依据是引用相等，内容相同的不同对象不会去重；Set 本身也不能直接序列化。
```

```quiz
type: choice
q: localStorage 的容量大约是？
options:
- 无限制
- 约 5MB
- 约 500MB
- 约 50MB
answer: 1
explain: localStorage 每个源约 5MB，超出抛 QuotaExceededError。
```

```quiz
type: choice
q: 关于 JSON.parse 读取 localStorage，正确的是？
options:
- 存储的数据一定是合法 JSON，不需要 try/catch
- getItem 返回 null 时 JSON.parse(null) 抛错
- 读取应带默认值 + try/catch 保护
- localStorage 只能存数字
answer: 2
explain: 数据可能损坏或为 null，读取应带默认值并用 try/catch 保护。JSON.parse(null) 结果是 null 不抛错。
```

```quiz
type: choice
q: 乐观更新的正确顺序是？
options:
- 先发请求，成功后再改 UI
- 先改 UI，发请求，成功保留、失败回滚
- 先改 UI，然后忽略请求结果
- 先回滚，再发请求
answer: 1
explain: 乐观更新先立即更新界面，再发请求，成功保留、失败回滚。
```

## 动手题

```quiz
type: js
q: 写一个函数 dedupe(arr)，用 Set 对数组去重并返回去重后的数组。
func: dedupe
starter: |
  function dedupe(arr) {
      // 用 Set 去重返回数组
  }
cases: |
  [1,2,2,3,3] -> [1,2,3]
  ['a','a','b'] -> ['a','b']
```

```quiz
type: js
q: 给定 HTML：<div id="box"></div>，写一个函数 showStored(key)，从 localStorage 读取 key 对应的值：如果存在则把 #box 文本设为 '值: '+值；如果不存在则设为 '无数据'。不需要 JSON 解析，直接读字符串。
func: showStored
starter: |
  function showStored(key) {
      // 读取 localStorage，更新 #box
  }
html: |
  <div id="box"></div>
checks:
- (localStorage.setItem('name','张三'), showStored('name'), document.querySelector('#box').textContent === '值: 张三')
hint: 判断 getItem 是否为 null，分支设置 #box 文本。
explain: 读取 localStorage 并做存在性判断。
```

## 小项目

```quiz
type: project
q: 做一个"待办缓存应用"：页面有输入框（id="input"）、添加按钮（id="add"）、列表（id="list"）。点击添加时，把输入内容作为文本 append 一个 li 到 #list，同时把当前列表所有 li 的文本内容存到 localStorage 的 'todos' 键下（JSON.stringify 成数组）。刷新后能读到缓存并渲染。要求点击添加后 #list 新增对应 li。
html: |
  <input id="input" value="学习JS">
  <button id="add">添加</button>
  <ul id="list"></ul>
starter: |
  // 点击 #add：读输入 → append li → 把列表所有文本存到 localStorage
explain: 核心是 DOM 渲染与 localStorage 持久化的联动。
```
