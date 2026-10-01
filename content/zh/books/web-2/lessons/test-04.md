# 第 4 章章测：事件处理

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于事件冒泡和捕获，下列说法正确的是？
options:
- 事件先冒泡再捕获
- 事件先捕获（外→内），再到目标，最后冒泡（内→外）
- 所有事件都不冒泡
- addEventListener 第三个参数默认是 true（捕获）
answer: 1
explain: 事件流顺序：捕获阶段（从 document 向下）→ 目标阶段 → 冒泡阶段（从目标向上）。addEventListener 第三个参数默认 false（冒泡）。
```

```quiz
type: choice
exam: true
q: 关于事件委托，下列说法正确的是？
options:
- 事件委托需要给每个子元素都绑定监听器
- 事件委托利用冒泡机制，在父元素上绑定一次监听器管理所有子元素（含动态新增的）
- 事件委托只能处理 click 事件
- 事件委托不能处理动态添加的元素
answer: 1
explain: 事件委托利用冒泡：子元素的事件冒泡到父元素，父元素通过 event.target 判断具体子元素。动态新增的子元素也能响应，因为它们同样会冒泡到父监听器。
```

```quiz
type: choice
exam: true
q: 关于 preventDefault 和 stopPropagation，下列说法正确的是？
options:
- preventDefault 会阻止事件冒泡
- stopPropagation 会阻止浏览器默认行为
- preventDefault 阻止默认行为（如表单刷新），stopPropagation 阻止事件继续传播
- 两者功能完全一样
answer: 2
explain: preventDefault 只阻止默认行为（如表单刷新、链接跳转），事件仍会冒泡。stopPropagation 阻止事件继续传播到祖先元素。两者独立。
```

```quiz
type: choice
exam: true
q: 关于事件对象 event，下列说法正确的是？
options:
- event.target 是最早绑定监听器的元素
- event.target 是触发事件的元素（可能在内部），event.currentTarget 是绑定监听器的元素
- event.preventDefault() 只能在捕获阶段调用
- event.key 和 event.keyCode 都是推荐使用的属性
answer: 1
explain: event.target 是实际触发事件的元素（可能是子元素），event.currentTarget 是绑定监听器的元素。keyCode 已废弃，推荐用 key。
```

```quiz
type: choice
exam: true
q: 关于常见事件的触发时机，下列说法正确的是？
options:
- input 事件只在失去焦点时触发
- change 事件在每次按键都触发
- input 事件在每次输入变化时触发（包括按键、粘贴、删除）
- submit 事件不需要 preventDefault
answer: 2
explain: input 事件在每次输入变化时触发（按键、粘贴、删除、中文输入）。change 事件只在失去焦点且值变化时触发。submit 必须 preventDefault 否则刷新页面。
```

## 第二部分 · 动手题

```quiz
type: js
exam: true
q: 给定 HTML：<div id="menu"><button class="menu-item" data-action="save">保存</button><button class="menu-item" data-action="edit">编辑</button><button class="menu-item" data-action="delete">删除</button></div>，写一个函数 setupMenu()：给 #menu 绑定 click 事件（事件委托），点击 .menu-item 时把 data-action 的值存到 window.__action。同时给被点击的按钮添加 "active" 类，移除其他 .menu-item 的 "active" 类。
func: setupMenu
starter: |
  function setupMenu() {
      // 事件委托：closest('.menu-item') 找到目标
  }
html: |
  <div id="menu">
    <button class="menu-item" data-action="save">保存</button>
    <button class="menu-item" data-action="edit">编辑</button>
    <button class="menu-item" data-action="delete">删除</button>
  </div>
checks:
- (setupMenu(), document.querySelector('[data-action="edit"]').click(), window.__action === 'edit' && document.querySelector('[data-action="edit"]').classList.contains('active') && !document.querySelector('[data-action="save"]').classList.contains('active'))
hint: menu.addEventListener('click', e => { const item = e.target.closest('.menu-item'); if(!item) return; document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active')); item.classList.add('active'); window.__action = item.dataset.action; });
explain: 事件委托 + closest 实现菜单/工具栏：找到目标 → 清除兄弟状态 → 设置当前状态 → 存储值。这是工具条类组件的标准模式。
```

```quiz
type: js
exam: true
q: 给定 HTML：<div id="counter"><button id="decrement">-</button><span id="count">0</span><button id="increment">+</button></div>，写一个函数 setupCounter()：点击 #increment 时 count+1，点击 #decrement 时 count-1（不能小于 0）。count 显示在 #count 中。
func: setupCounter
starter: |
  function setupCounter() {
      // 绑定 increment 和 decrement 点击事件
  }
html: |
  <div id="counter">
    <button id="decrement">-</button>
    <span id="count">0</span>
    <button id="increment">+</button>
  </div>
checks:
- (setupCounter(), document.querySelector('#increment').click(), document.querySelector('#increment').click(), document.querySelector('#count').textContent === '2')
- (document.querySelector('#decrement').click(), document.querySelector('#count').textContent === '1')
hint: let count = 0; increment.addEventListener('click', () => { count++; countEl.textContent = count; }); decrement.addEventListener('click', () => { if(count>0) count--; countEl.textContent = count; });
explain: 计数器模式：用闭包变量保存状态，点击时修改状态并更新 DOM。decrement 时判断不能小于 0。
```

## 第三部分 · 小项目

```quiz
type: project
exam: true
q: 给定 HTML：<div id="accordion"><div class="panel" data-id="1"><div class="header">面板1</div><div class="content">内容1</div></div><div class="panel" data-id="2"><div class="header">面板2</div><div class="content">内容2</div></div><div class="panel" data-id="3"><div class="header">面板3</div><div class="content">内容3</div></div></div>，写一个函数 setupAccordion()：点击 .header 时，展开对应的 .content（显示），收起其他 panel 的 .content（隐藏）。给展开的 panel 添加 "expanded" 类。
func: setupAccordion
starter: |
  function setupAccordion() {
      // 事件委托：点击 header 展开对应 content，收起其他
  }
html: |
  <div id="accordion">
    <div class="panel" data-id="1">
      <div class="header">面板1</div>
      <div class="content">内容1</div>
    </div>
    <div class="panel" data-id="2">
      <div class="header">面板2</div>
      <div class="content">内容2</div>
    </div>
    <div class="panel" data-id="3">
      <div class="header">面板3</div>
      <div class="content">内容3</div>
    </div>
  </div>
checks:
- (setupAccordion(), document.querySelector('[data-id="2"] .header').click(), document.querySelector('[data-id="2"]').classList.contains('expanded') && !document.querySelector('[data-id="1"]').classList.contains('expanded'))
- (setupAccordion(), document.querySelector('[data-id="1"] .header').click(), document.querySelector('[data-id="1"]').classList.contains('expanded') && document.querySelector('[data-id="2"] .header').click(), document.querySelector('[data-id="2"]').classList.contains('expanded') && !document.querySelector('[data-id="1"]').classList.contains('expanded'))
hint: 用事件委托：找到 panel，遍历所有 panel 移除 expanded，给当前 panel 加 expanded。content 的显示隐藏通过 CSS 的 .expanded .content 控制。
explain: 手风琴组件：事件委托 + 状态切换。核心逻辑是"展开当前、收起其他"——遍历所有 panel 清除状态，只给当前 panel 加 expanded 类。这是折叠面板的标准实现。
```
