# 第 6 章测验：综合实战

## 选择题（5 题）

```quiz
type: choice
exam: false
q: 做网页项目的正确顺序应该是？
options:
- 界面 → 函数 → 数据
- 数据 → 函数 → 界面
- 函数 → 数据 → 界面
- 随便，哪个都行
answer: 1
explain: 先设计数据结构，再设计处理函数，最后实现界面，这样数据才是地基。
```

```quiz
type: choice
exam: false
q: 渲染列表时，如果不先清空容器就直接追加，会发生什么？
options:
- 什么都不显示
- 元素会重复累加
- 会报错
- 只显示最后一项
answer: 1
explain: 不清空就追加，旧元素还在，新元素又加一遍，越加越多。
```

```quiz
type: choice
exam: false
q: 往数组 push 了一项之后，页面没变化，最可能的原因是？
options:
- 数组不能 push
- 忘了重新调用 render
- push 是错的
- 应该用 innerHTML
answer: 1
explain: 改了数组数据不会自动反映到界面，必须再调一次 render。
```

```quiz
type: choice
exam: false
q: 在会增删的列表里，定位某一项最好用？
options:
- 下标 index
- id
- length
- 父元素
answer: 1
explain: id 是永久唯一的；下标是临时的，删掉一项后下标就错位了。
```

```quiz
type: choice
exam: false
q: 下面哪个是"赋值"而不是"比较"？
options:
- a === b
- a = b
- a !== b
- a < b
answer: 1
explain: 一个等号 = 是赋值，三个等号 === 才是严格比较。
```

## 动手题（2 题）

```quiz
type: js
exam: false
q: 给定 HTML：<ul id="list"></ul>，写 renderList(items)，把 items 数组的每一项变成一个 <li> 挂到 list 里（先清空容器）。
func: renderList
html: |
  <ul id="list"></ul>
starter: |
  function renderList(items) {
      // 在这里写
  }
checks:
- (renderList(["苹果","香蕉"]), document.querySelectorAll('#list li').length === 2)
- (renderList(["苹果","香蕉","橙子"]), document.querySelectorAll('#list li').length === 3)
- (renderList(["苹果"]), document.querySelector('#list li').textContent === '苹果')
hint: 先 list.innerHTML='' 清空，再遍历 items 创建 li 挂上
explain: 清空防累加，遍历生成每一项。
```

```quiz
type: js
exam: false
q: 给定 HTML：<ul id="list"></ul>，写 addItem(text)，往内部数组 push 一项 {id,text}，然后重新渲染。
func: addItem
html: |
  <ul id="list"></ul>
starter: |
  let items = [];
  function addItem(text) {
      // 在这里写
  }
checks:
- (addItem('苹果'), document.querySelectorAll('#list li').length === 1)
- (addItem('香蕉'), document.querySelectorAll('#list li').length === 2)
hint: push 进 items 后调 render，render 里先清空再遍历创建 li
explain: 改数组后必须重新渲染，且先清空容器。
```

## 小项目（1 题）

```quiz
type: js
exam: false
q: 做一个"待办清单"。HTML 已提供：<input id="todo-input" placeholder="添加新任务"><button id="add-btn">添加</button><ul id="todo-list"></ul>。请实现：1) 点击添加按钮（或按钮的 click 事件）时，把输入框文字作为新任务 push 进内部数组（对象含 id、text），清空输入框并重新渲染；2) 每个任务项除了文字还要有一个 class 为 del 的删除按钮；3) 点击删除按钮，删掉该项（用 id 定位）并重新渲染。把按钮的监听绑定写在 render 里或 setup 里均可。
func: setup
html: |
  <input id="todo-input" placeholder="添加新任务"><button id="add-btn">添加</button><ul id="todo-list"></ul>
starter: |
  let todos = [];
  let input = document.querySelector('#todo-input');
  let addBtn = document.querySelector('#add-btn');
  let list = document.querySelector('#todo-list');

  function render() {
      // 先清空，再遍历 todos 生成 li（含文字和删除按钮）
  }

  function addTodo(text) {
      // push 进 todos 并 render
  }

  function deleteTodo(id) {
      // 用 filter 按 id 删除并 render
  }

  function setup() {
      // 给 addBtn 绑 click，读 input.value，调 addTodo，清空 input
  }
checks:
- (setup(), todos.length = 0, render(), input.value = '买菜', addBtn.click(), document.querySelectorAll('#todo-list li').length === 1)
- (todos.length = 0, render(), input.value = '买菜', addBtn.click(), input.value = '写代码', addBtn.click(), document.querySelectorAll('#todo-list li').length === 2)
- (todos.length = 0, render(), input.value = 'a', addBtn.click(), input.value = 'b', addBtn.click(), document.querySelectorAll('#todo-list li .del').length === 2)
hint: render 里先 list.innerHTML='' 再遍历；每项创建 li 后创建 button 设 className='del' 绑 click 调 deleteTodo(todo.id)；setup 里绑 addBtn click
explain: 综合考查数据设计、渲染、添加、删除、事件绑定，是整册的集大成。
```
