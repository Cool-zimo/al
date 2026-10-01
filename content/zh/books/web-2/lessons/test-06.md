# 第 6 章章测：综合项目

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于 Todo List 的数据设计，下列说法正确的是？
options:
- 可以用数组下标作为任务的唯一标识
- 必须用稳定的唯一 id（如时间戳），因为数组是动态的
- id 不需要唯一，text 不同就行
- 不需要 id，直接用 DOM 元素引用
answer: 1
explain: 数组删除元素后下标会变，用下标关联数据会导致错乱。id 必须稳定唯一。text 可能重复，不能作为标识。
```

```quiz
type: choice
exam: true
q: 关于"数据驱动视图"模式，下列说法正确的是？
options:
- 每次数据变化后必须手动调用 render() 更新 DOM
- DOM 会自动响应数据变化
- 应该直接操作 DOM 来修改数据状态
- render() 只能调用一次，之后数据变化不需要再调用
answer: 0
explain: 数据驱动视图：改数据 → 调 render() 重建 DOM。JS 没有响应式系统，必须手动调用 render()。直接操作 DOM 修改状态会让数据和视图不一致。
```

```quiz
type: choice
exam: true
q: 关于 localStorage 的 JSON.parse 异常处理，下列说法正确的是？
options:
- JSON.parse 永远不会报错
- 应该用 try-catch 包裹 JSON.parse，数据损坏时返回默认值
- localStorage 中的数据不会损坏
- JSON.parse(null) 会报错
answer: 1
explain: JSON.parse 在解析非法 JSON 时会抛异常。数据可能被其他代码或用户操作损坏。用 try-catch 保证应用不会因为存储数据损坏而崩溃。
```

```quiz
type: choice
exam: true
q: 关于事件委托时 event.target 的注意事项，下列说法正确的是？
options:
- event.target 一定是绑定监听器的父元素
- event.target 可能是子元素内部的元素（如 li 里的 button），需要用 closest() 向上查找
- event.target 总是等于 currentTarget
- closest() 只能查找 class，不能查找标签名
answer: 1
explain: event.target 是实际触发事件的子元素（可能是 li 内部的 button/span），需要用 closest('li') 向上找到目标元素。target 和 currentTarget 通常不同。
```

```quiz
type: choice
exam: true
q: 关于渲染时用 innerHTML 还是 createElement，下列说法正确的是？
options:
- innerHTML 总是安全的，不需要考虑 XSS
- 如果内容来自用户输入，innerHTML 有 XSS 风险，应该用 textContent 或先转义
- createElement 比 innerHTML 更慢，应该避免
- innerHTML 不能设置元素属性
answer: 1
explain: innerHTML 会把字符串解析为 HTML，如果包含用户输入的 <script> 标签可能执行恶意代码。应该用 textContent 或对用户输入做 HTML 转义。
```

## 第二部分 · 动手题

```quiz
type: js
exam: true
q: 写一个函数 createStore(initialState)：实现一个简单的状态管理。返回对象 { getState, setState, subscribe }。getState 返回当前状态；setState 接收对象，合并到当前状态（类似 Object.assign）；subscribe 接收一个监听器函数，当状态变化时调用它。setState 触发所有监听器。
func: createStore
starter: |
  function createStore(initialState) {
      // 返回 { getState, setState, subscribe }
      let state = { ...initialState };
      const listeners = [];
      return {};
  }
checks:
- (function(){const store=createStore({count:0,name:"test"});return store.getState().count===0&&store.getState().name==="test";})()
- (function(){const store=createStore({count:0});store.setState({count:5});return store.getState().count===5;})()
- (function(){const store=createStore({count:0});let called=false;store.subscribe(()=>{called=true;});store.setState({count:1});return called===true;})()
hint: getState(){return state;}, setState(partial){Object.assign(state,partial);listeners.forEach(fn=>fn(state));}, subscribe(fn){listeners.push(fn);}
explain: 简易状态管理：用闭包保存 state 和 listeners。setState 合并状态并通知所有订阅者。这是 Redux/Vuex 等状态管理库的核心思想简化版。
```

```quiz
type: js
exam: true
q: 写一个函数 toggleAll(todos, done)：todos 是 [{id,text,done}] 数组。将所有 todo 的 done 设为传入的 done 值（布尔）。返回新的 todos 数组（不要修改原数组，用 map 返回新数组）。
func: toggleAll
starter: |
  function toggleAll(todos, done) {
      // 用 map 返回新数组，每个 todo 的 done 设为 done
  }
checks:
- JSON.stringify(toggleAll([{id:1,text:"a",done:false},{id:2,text:"b",done:true}],true)) === JSON.stringify([{"id":1,"text":"a","done":true},{"id":2,"text":"b","done":true}])
- JSON.stringify(toggleAll([{id:1,text:"a",done:true},{id:2,text:"b",done:true}],false)) === JSON.stringify([{"id":1,"text":"a","done":false},{"id":2,"text":"b","done":false}])
- JSON.stringify(toggleAll([],true)) === JSON.stringify([])
hint: return todos.map(todo => ({ ...todo, done }));
explain: 不可变更新模式：用 map 遍历返回新对象（展开运算符复制原有属性，覆盖 done）。不修改原数组，保持数据不可变性。这是 React 等框架推荐的数据更新方式。
```

## 第三部分 · 小项目

```quiz
type: project
exam: true
q: 写一个函数 createTodoApp(container)：container 是一个 DOM 元素。创建一个完整的 Todo List 应用：包含一个 input（class="todo-input"）、一个 button（class="add-btn"，文本"添加"）、一个 ul（class="todo-list"）。功能：点击添加按钮或按 Enter 时，把 input 的值作为新任务添加到列表（每项有复选框和删除按钮），点击复选框切换完成状态（加/去 class "completed"），点击删除按钮移除该项。任务数据存到 localStorage 的 'mini-todos' key。返回对象 { getTodos } 返回当前 todos 数组。
func: createTodoApp
starter: |
  function createTodoApp(container) {
      // 创建完整的 Todo List 应用
      const todos = [];
      return { getTodos: () => todos };
  }
html: |
  <div id="app"></div>
checks:
- (function(){const app=createTodoApp(document.querySelector('#app'));return document.querySelector('.todo-input')!==null&&document.querySelector('.add-btn')!==null&&document.querySelector('.todo-list')!==null;})()
- (function(){const app=createTodoApp(document.querySelector('#app'));const input=document.querySelector('.todo-input');input.value="买牛奶";document.querySelector('.add-btn').click();return app.getTodos().length===1&&app.getTodos()[0].text==="买牛奶"&&document.querySelectorAll('.todo-list li').length===1;})()
hint: 创建 DOM 结构 → 绑定事件 → addBtn 点击时 push {id:Date.now(),text:input.value,done:false} 到 todos，save，render → render 遍历 todos 创建 li（checkbox+text+deleteBtn）→ checkbox 点击 toggle done → deleteBtn 点击 filter 掉
explain: 综合项目：从 DOM 结构创建、事件绑定、数据管理、localStorage 持久化、事件委托、渲染函数——涵盖整个课程的核心知识点。这是 Todo List 应用的完整实现。
```
