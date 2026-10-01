# 第 3 章章测：DOM 操作

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于 textContent 和 innerHTML 的区别，下列说法正确的是？
options:
- textContent 会解析 HTML 标签，innerHTML 不会
- textContent 只设置/获取纯文本（不解析标签），innerHTML 会解析 HTML 标签
- 两者完全一样
- innerHTML 比 textContent 更安全
answer: 1
explain: textContent 将内容作为纯文本处理（< 不会被解析为标签），innerHTML 会将字符串解析为 HTML。innerHTML 有 XSS 安全风险。
```

```quiz
type: choice
exam: true
q: 关于 DOM 查询方法，下列说法正确的是？
options:
- querySelector 返回所有匹配的元素，querySelectorAll 返回第一个
- querySelector 返回第一个匹配的元素，querySelectorAll 返回所有匹配的元素（NodeList）
- getElementById 比 querySelector 慢
- querySelectorAll 返回的是真正的数组，可以直接用 map、filter
answer: 1
explain: querySelector 返回第一个匹配元素，querySelectorAll 返回 NodeList。NodeList 不是数组（虽然可以 forEach），不能直接用 map/filter（需要 [...nodeList] 转数组）。
```

```quiz
type: choice
exam: true
q: 关于 DOM 元素的创建和删除，下列说法正确的是？
options:
- document.createElement('div') 会立即将元素添加到页面上
- removeChild 是从父元素上删除子元素，element.remove() 是直接删除自身
- appendChild 只能在 body 上调用
- createElement 创建的元素不需要 appendChild 就能显示在页面上
answer: 1
explain: createElement 只创建元素（不在 DOM 中），需要 appendChild 才加入页面。removeChild 是父节点的方法，element.remove() 是现代的删除自身方法。appendChild 可以在任何父元素上调用。
```

```quiz
type: choice
exam: true
q: 关于修改元素样式，下列说法正确的是？
options:
- element.style.color = 'red' 修改的是内联样式
- element.className = 'active' 会添加 class 而不会覆盖已有 class
- element.setAttribute('class', 'new-class') 和 element.className = 'new-class' 效果不同
- 通过 element.style 可以读取到 CSS 文件中的所有样式
answer: 0
explain: element.style.xxx 修改的是内联样式（style 属性）。className 赋值会覆盖所有 class。style 只能读取内联样式，CSS 文件中的样式需要通过 getComputedStyle 获取。
```

```quiz
type: choice
exam: true
q: 关于 dataset 属性，下列说法正确的是？
options:
- element.dataset.userName 对应 HTML 中的 data-username 属性
- dataset 可以设置任意类型的 JavaScript 对象
- element.dataset 只能读取不能修改
- data-id 属性的值通过 element.dataset.Id 访问
answer: 0
explain: dataset 将 data-xxx 属性映射到 JS 对象的属性，名称用 camelCase 转换（data-user-name → dataset.userName）。dataset 只能存字符串。
```

## 第二部分 · 动手题

```quiz
type: js
exam: true
q: 给定 HTML：<ul id="colors"><li>红色</li><li>蓝色</li><li>绿色</li></ul>，写一个函数 highlightFirst()：给 #colors 的第一个 li 添加 class "highlight"，其他 li 移除 "highlight" 类。
func: highlightFirst
starter: |
  function highlightFirst() {
      // 给第一个 li 加 highlight 类，其他移除
  }
html: |
  <ul id="colors">
    <li>红色</li>
    <li>蓝色</li>
    <li>绿色</li>
  </ul>
checks:
- (highlightFirst(), document.querySelector('#colors li').classList.contains('highlight') && !document.querySelector('#colors li:nth-child(2)').classList.contains('highlight') && !document.querySelector('#colors li:nth-child(3)').classList.contains('highlight'))
hint: const lis = document.querySelectorAll('#colors li'); lis.forEach((li, i) => { if(i===0) li.classList.add('highlight'); else li.classList.remove('highlight'); });
explain: 遍历所有 li，索引为 0 的加 highlight，其他移除。classList 的 add/remove 方法是操作 class 的标准方式。
```

```quiz
type: js
exam: true
q: 给定 HTML：<div id="box"></div>，写一个函数 createCard(title, content)：创建一个 div 卡片元素，设置 class 为 "card"，内部包含一个 h3（文本为 title）和一个 p（文本为 content）。最后 append 到 #box 并返回创建的卡片元素。
func: createCard
starter: |
  function createCard(title, content) {
      // 创建卡片元素并 append 到 #box
  }
html: |
  <div id="box"></div>
checks:
- (function(){const card=createCard("标题","内容");return card.className==="card"&&card.querySelector('h3').textContent==="标题"&&card.querySelector('p').textContent==="内容"&&document.querySelector('#box').contains(card);})()
hint: const card = document.createElement('div'); card.className='card'; card.innerHTML='<h3>'+title+'</h3><p>'+content+'</p>'; box.appendChild(card); return card;
explain: 动态创建复合元素：createElement 创建容器 → 设置 class → 用 innerHTML 填充子元素 → appendChild → return。注意这里 title/content 是可信数据，实际项目要注意 XSS。
```

## 第三部分 · 小项目

```quiz
type: project
exam: true
q: 给定 HTML：<table id="data-table"></table>，写一个函数 renderTable(data)：data 是数组 [{name, score, grade}]。在 #data-table 中渲染一个表格：thead 有一行 th（姓名、分数、等级），tbody 中每行对应一个数据对象。grade 为 'A' 或 'B' 的行加 class "excellent"，其他行加 class "normal"。
func: renderTable
starter: |
  function renderTable(data) {
      // 渲染表格到 #data-table
  }
html: |
  <table id="data-table"></table>
checks:
- (function(){renderTable([{name:"张三",score:95,grade:"A"},{name:"李四",score:70,grade:"C"},{name:"王五",score:88,grade:"B"}]);return document.querySelectorAll('#data-table tbody tr').length===3&&document.querySelectorAll('#data-table tbody tr.excellent').length===2&&document.querySelector('#data-table tbody tr.normal')!==null;})()
hint: 先创建 thead 和 tbody。thead 里 append 一个 tr 包含 3 个 th。tbody 遍历 data 创建 tr，根据 grade 判断加 excellent 还是 normal 类。
explain: 综合 DOM 操作：创建 table 结构（thead/tbody）、遍历数据创建行、根据条件动态添加 class。这是数据表格渲染的标准实现。
```
