# 第 3 章 · 让页面有结构 · 大测验

> 8 道题。这一章解决的是"怎么用合适的标签组织内容结构"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 导航菜单推荐用 ul + li 而不是一堆 div，主要原因是？
options:
- ul 会自动变成横向
- ul + li 语义上是并列的一组选项，读屏可识别
- div 不能放 a 标签
- ul 写起来更快
answer: 1
explain: 列表语义表达"一组并列项"，读屏可据此提示项数，这是 div 不具备的。
```

```quiz
type: choice
q: 表格的表头单元格应该用哪个标签？
options:
- `<td>`
- `<th>`
- `<tr>`
- `<thead>`
answer: 1
explain: th 是表头单元格，有语义且默认加粗居中；thead 是表头区域，不是单元格。
```

```quiz
type: choice
q: 关于表格布局，下列说法正确的是？
options:
- 表格布局是最现代的布局方式
- 表格只应���于表格形态的数据，不应作为布局手段
- 用表格布局可访问性最好
- 表格比 flex 更简单
answer: 1
explain: 表格只适合表格数据，布局应使用 flex/grid，用表格布局会误导语义。
```

```quiz
type: choice
q: 给 img 同时指定 width 和 height 的主要目的是？
options:
- 让图片更清晰
- 让浏览器提前预留空间，避免加载后页面抖动
- 减小图片文件体积
- width 和 height 是必填属性
answer: 1
explain: 提前预留宽高可防止图片加载完成后页面重排抖动，它们并非必填。
```

```quiz
type: choice
q: 关于语义化标签，下列说法正确的是？
options:
- 语义化标签只是装饰，没有实际作用
- 语义化标签帮助读屏和搜索引擎理解结构
- 语义化标签的显示效果与 div 完全不同
- 一个页面可以有任意多个 main
answer: 1
explain: 语义化提供结构与语义信息，提升可访问性与 SEO；main 每页应只有一个。
```

## 第二部分 · 动手题

```quiz
type: html
q: 写一个导航：nav 内放一个 ul，ul 内放三个 li，每个 li 内放一个 a 标签，链接文字分别为"首页""关于""联系"，href 分别为"/"、"/about"、"/contact"。
starter: |
  <nav>
  </nav>
checks:
- document.querySelector('nav > ul') !== null
- document.querySelectorAll('li').length === 3
- document.querySelectorAll('a').length === 3
- Array.from(document.querySelectorAll('a')).map(a => a.textContent.trim()).join(',') === '首页,关于,联系'
- Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href')).join(',') === '/,/about,/contact'
hint: nav 直接包含 ul，ul 内含三个 li，每个 li 内含一个 a。
explain: 导航的层级要求 nav > ul > li > a 关系正确，文字与链接都需匹配。
```

```quiz
type: html
q: 写一个 form，method 为"post"，action 为"/submit"。form 内放一个 label（for 为"phone"，文字"电话"）和一个 input（type 为"tel"、id 为"phone"、name 为"phone"），最后放一个 button（type 为"submit"，文字"提交"）。
starter: |
  <form method="post" action="/submit">
  </form>
checks:
- document.querySelector('form').getAttribute('method') === 'post'
- document.querySelector('form').getAttribute('action') === '/submit'
- document.querySelector('label').getAttribute('for') === 'phone'
- document.querySelector('input').getAttribute('type') === 'tel'
- document.querySelector('input').getAttribute('id') === 'phone'
- document.querySelector('input').getAttribute('name') === 'phone'
- document.querySelector('button').getAttribute('type') === 'submit'
- document.querySelector('button').textContent.trim() === '提交'
hint: label 的 for 与 input 的 id 对应，button 设置 type 与文字。
explain: 表单需具备正确的 method/action，label 与 input 关联，button 提交。
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"技能清单"区块：一个 section，内部包含一个 h2（内容"我的技能"）和一个无序列表 ul。ul 内包含四个 li：HTML、CSS、JavaScript、Python。要求语义结构正确，section 内先 h2 后 ul。
checklist:
- 使用了 section 作为容器
- section 内有一个 h2，内容精确为"我的技能"
- section 内有一个 ul，直接位于 section 下
- ul 内有四个 li，内容分别为 HTML、CSS、JavaScript、Python
- 层级关系为 section > h2、section > ul > li
starter: |
  <section>
  </section>
```
