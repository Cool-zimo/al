# 第 2 章 · CSS 基础 · 大测验

> 8 道题。这一章解决的是"样式怎么写、单位怎么选、盒子怎么算"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于外链样式表，下列说法正确的是？
options:
- 外链样式表优先级最高，能盖掉所有样式
- 外链样式表把样式集中维护，一处修改全站生效，且可被浏览器缓存
- 外链样式表只能用一次，不能引入多个
- 外链样式表不能写颜色
answer: 1
explain: 外链样式表的核心是集中维护、可缓存、结构与样式分离；优先级最高的是内联样式。
```

```quiz
type: choice
q: 想给多个元素共享同一种样式，应该用什么选择器？
options:
- id 选择器
- 标签选择器
- 类选择器
- 通配选择器
answer: 2
explain: 类选择器可复用，多个元素可共享同一个 class；id 必须唯一。
```

```quiz
type: choice
q: 关于 em 和 rem，下列说法正确的是？
options:
- em 相对根元素字号，rem 相对当前元素字号
- em 相对当前元素字号会嵌套放大，rem 相对根元素不会嵌套放大
- 两者没有任何区别
- rem 不能用于字号
answer: 1
explain: em 相对当前元素、会随嵌套累积放大；rem 相对根元素、不随嵌套变化。
```

```quiz
type: choice
q: 关于默认盒模型（content-box），下列说法正确的是？
options:
- width 已经包含了 padding 和 border
- width 不含 padding 和 border，实际占用宽度更大
- padding 不会占用空间
- border 不属于盒模型
answer: 1
explain: content-box 下 width 只是内容区宽度，实际宽度需加上左右 padding 和 border。
```

```quiz
type: choice
q: 关于 margin 折叠，下列说法正确的是？
options:
- 两个相邻块级元素的上下 margin 会相加
- 两个相邻块级元素的上下 margin 会折叠成较大值
- 左右 margin 也会折叠
- margin 永远不会折叠
answer: 1
explain: 上下相邻块级元素的垂直 margin 取较大值合并；左右 margin 会相加。
```

## 第二部分 · 动手题

```quiz
type: css
q: 让 class 为"card"的元素有 16px 的内边距、1px 的实线边框（颜色 rgb(224, 224, 224)）、8px 的圆角，并设置 box-sizing 为 border-box。
html: |
  <div class="card">卡片内容</div>
starter: |
  .card {
  }
checks:
- getComputedStyle(document.querySelector('.card')).paddingTop === '16px'
- getComputedStyle(document.querySelector('.card')).borderTopWidth === '1px'
- getComputedStyle(document.querySelector('.card')).borderTopColor === 'rgb(224, 224, 224)'
- getComputedStyle(document.querySelector('.card')).borderTopStyle === 'solid'
- getComputedStyle(document.querySelector('.card')).borderRadius === '8px'
- getComputedStyle(document.querySelector('.card')).boxSizing === 'border-box'
hint: padding、border（分宽度、样式、颜色）、border-radius、box-sizing。
explain: 卡片样式需要内边距、边框三要素、圆角和盒模型设置共同作用。
```

```quiz
type: css
q: 让 p 的字号为 1.125rem（根字号 16px，即 18px）、行高为 1.7、文字颜色为 rgb(51, 51, 51)、首行缩进 2em。
html: |
  <p>一段需要排版的文字内容</p>
starter: |
  p {
  }
checks:
- getComputedStyle(document.querySelector('p')).fontSize === '18px'
- getComputedStyle(document.querySelector('p')).lineHeight === '30.6px'
- getComputedStyle(document.querySelector('p')).color === 'rgb(51, 51, 51)'
- getComputedStyle(document.querySelector('p')).textIndent === '36px'
hint: 18px × 1.7 = 30.6px；2em = 36px。
explain: 字号、行高、颜色、缩进四个属性分别设置，期望值按计算值填写。
```

## 第三部分 · 小项目

```quiz
type: project
q: 给一个"个人简介卡片"写好看的样式：class 为"profile"的 div，内部包含一个 h2（姓名）和一个 p（简介）。要求：profile 有 24px 内边距、1px 实线边框（rgb(230, 230, 230)）、12px 圆角、背景色 rgb(250, 250, 250)、最大宽度 480px、左右外边距 auto 居中；h2 文字颜色为 rgb(0, 121, 107)、下外边距 12px；p 文字颜色为 rgb(100, 100, 100)、行高 1.6。
checklist:
- profile 有 24px 的内边距和 12px 的圆角
- profile 有 1px 实线边框，颜色为 rgb(230, 230, 230)
- profile 背景色为 rgb(250, 250, 250)，最大宽度 480px，左右外边距 auto 居中
- h2 文字颜色为 rgb(0, 121, 107)，下外边距 12px
- p 文字颜色为 rgb(100, 100, 100)，行高 1.6
starter: |
  <div class="profile">
    <h2>张三</h2>
    <p>前端开发工程师，热爱写清晰可维护的代码。</p>
  </div>
```
