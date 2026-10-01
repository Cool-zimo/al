# 第 1 章 · 浏览器怎么把文本变成页面 · 大测验

> 8 道题。这一章解决的是"HTML 结构怎么写、语义怎么表达"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 HTML、CSS、JavaScript 的分工，下列说法正确的是？
options:
- HTML 负责样式，CSS 负责结构，JS 负责行为
- HTML 负责结构（语义），CSS 负责样式，JS 负责行为
- 三者完全一样，没有分工
- HTML 只负责文字，CSS 只负责颜色
answer: 1
explain: HTML 是结构/语义，CSS 是样式，JS 是行为交互，三者各司其职。
```

```quiz
type: choice
q: DOCTYPE 应该放在哪里？
options:
- 放在 body 内部
- 放在 head 和 body 之间
- 放在文档最前面，前面不能有空行或空格
- 可以放在任何位置
answer: 2
explain: DOCTYPE 是文档类型声明，必须位于文档最前面，否则浏览器可能进入怪异模式。
```

```quiz
type: choice
q: h1~h6 表达的是？
options:
- 字号大小
- 内容的层级关系（语义）
- 文字颜色
- 是否加粗
answer: 1
explain: h1~h6 表示标题层级，是语义标记，字号只是默认渲染结果。
```

```quiz
type: choice
q: 给一段"重要"的文字加粗，且希望读屏软件能提示重要性，应该用？
options:
- `<b>`
- `<i>`
- `<strong>`
- `<span>`
answer: 2
explain: strong 表达语义上的重要性，读屏会据此加重语气；b 只表外观。
```

```quiz
type: choice
q: 图片的 alt 属性，下列说法正确的是？
options:
- alt 可有可无
- alt 只在图片加载失败时显示
- 内容性图片必须写 alt 描述，它关系到可访问性和信息传达
- alt 用来设置图片尺寸
answer: 2
explain: alt 是替代文本，在加载失败、读屏和搜索引擎三个场景都有作用。
```

## 第二部分 · 动手题

```quiz
type: html
q: 写一个完整的最小 HTML 骨架：doctype、html（lang 为 zh-CN）、head、body。head 里放一个 meta charset="UTF-8" 和一个 title（内容"张三的简历"）；body 里放一个 h1（内容"你好"）和一个 p（内容"这是我的简历"）。
starter: |
  <!DOCTYPE html>
  <html lang="zh-CN">
  </html>
checks:
- document.querySelectorAll('head').length === 1
- document.querySelectorAll('body').length === 1
- document.querySelector('meta[charset]') !== null
- document.querySelector('meta[charset]').getAttribute('charset').toUpperCase() === 'UTF-8'
- document.querySelector('title').textContent.trim() === '张三的简历'
- document.querySelector('h1').textContent.trim() === '你好'
- document.querySelector('p').textContent.trim() === '这是我的简历'
hint: html 内并列 head 与 body；head 内依次 meta 与 title；body 内依次 h1 与 p。
explain: 完整骨架要求 head/body 并列于 html 之下，各标签内容精确匹配。
```

```quiz
type: html
q: 写一个地址块：一个 p 内三行文本，分别是"上海市浦东新区""世纪大道 100 号""邮编 200120"，行之间用 br 分隔；p 的 class 为"addr"。
starter: |
  <p class="addr">
  </p>
checks:
- document.querySelectorAll('p.addr').length === 1
- document.querySelectorAll('br').length === 2
- document.querySelector('p.addr').textContent.replace(/\s+/g, '') === '上海市浦东新区世纪大道100号邮编200120'
hint: 两处换行需要两个 br，三行文本按顺序连接。
explain: p 内用 br 做段内换行，文本连起来应与预期一致。
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"张三的个人介绍"页面骨架：包含一个 h1（内容"张三"）、一个 h2（内容"前端工程师"）、两个 p（内容分别是"现居北京"和"热爱编程与开源"）。要求用有意义的标签表达层级，不要求加任何样式。
checklist:
- 用了 h1 作为主标题，内容精确为"张三"
- 用了 h2 作为副标题，内容精确为"前端工程师"
- 有两个 p 标签，内容分别为"现居北京"和"热爱编程与开源"
- 结构层级正确：h1、h2、两个 p 都在 body 内
starter: |
  <!DOCTYPE html>
  <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>张三的个人介绍</title>
    </head>
    <body>
    </body>
  </html>
```
