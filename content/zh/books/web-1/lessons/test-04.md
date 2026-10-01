# 第 4 章 · 布局与排版 · 大测验

> 8 道题。这一章解决的是"怎么把页面元素放到想要的位置"的问题，从 display 三形态到 float 清除，从 position 定位到 Flex 弹性布局。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 以下哪个元素默认是 inline 元素？
options:
- <div>
- <p>
- <span>
- <section>
answer: 2
explain: span 默认 display 为 inline；div、p、section 默认都是 block。
```

```quiz
type: choice
q: 关于 inline-block 元素之间的间隙，下列说法正确的是？
options:
- 这是浏览器 bug，无法消除
- 间隙来自 HTML 中的换行符被解析为空格
- 间隙是 margin 默认值导致的
- 设置 width 后间隙自动消失
answer: 1
explain: inline-block 元素之间的换行和空格会被当成文本空格渲染出来。解决方法是父元素 font-size: 0 或使用 Flex 布局。
```

```quiz
type: choice
q: 清除浮动最通用且不污染 HTML 的方法是？
options:
- 给父元素设固定 height
- 在浮动元素后面加一个空 div 并设置 clear: both
- 使用 clearfix 伪元素（::after + clear: both）
- 给父元素设 margin-top
answer: 2
explain: clearfix 用 ::after 伪元素清除浮动，不需要在 HTML 中插入额外节点，也不裁切内容，是最通用的方案。
```

```quiz
type: choice
q: 一个 position: absolute 的元素，如果所有祖先的 position 都是 static，它会相对谁定位？
options:
- 父元素
- body 元素
- 视口（viewport）
- html 元素
answer: 2
explain: absolute 会向上查找最近的已定位（非 static）祖先，找不到则相对初始包含块，即视口。
```

```quiz
type: choice
q: 在 Flex 布局中，align-items 的默认值是？
options:
- flex-start
- center
- stretch
- baseline
answer: 2
explain: align-items 默认值是 stretch，即项目在交叉轴上拉伸填满容器。
```

## 第二部分 · 动手题

```quiz
type: css
q: 让三个按钮（.btn）用 Flex 布局水平居中排列，每个按钮宽度 100px、高度 40px、左右外边距 8px。
html: |
  <div class="btn-group">
    <button class="btn">保存</button>
    <button class="btn">取消</button>
    <button class="btn">提交</button>
  </div>
starter: |
  .btn-group {
  }
  .btn {
  }
checks:
- getComputedStyle(document.querySelector('.btn-group')).display === 'flex'
- getComputedStyle(document.querySelector('.btn-group')).justifyContent === 'center'
- getComputedStyle(document.querySelector('.btn')).width === '100px'
- getComputedStyle(document.querySelector('.btn')).height === '40px'
- getComputedStyle(document.querySelector('.btn')).marginLeft === '8px'
- getComputedStyle(document.querySelector('.btn')).marginRight === '8px'
hint: btn-group 用 display: flex + justify-content: center 让按钮组水平居中，btn 设宽度高度和外边距。
explain: Flex 容器水平居中整组按钮，每个按钮定宽高和间距形成整齐的按钮组。
```

```quiz
type: css
q: 做一个"图片 + 文字"的图文卡片：.card 是 relative 定位的容器（宽 300px、高 180px、边框 1px 灰色），.badge 是 absolute 定位的标签（top: 10px、right: 10px、背景红色、文字白色、padding 4px 8px）。
html: |
  <div class="card">
    <span class="badge">热销</span>
    <p>这是一段商品描述文字</p>
  </div>
starter: |
  .card {
  }
  .badge {
  }
checks:
- getComputedStyle(document.querySelector('.card')).position === 'relative'
- getComputedStyle(document.querySelector('.card')).width === '300px'
- getComputedStyle(document.querySelector('.card')).height === '180px'
- getComputedStyle(document.querySelector('.badge')).position === 'absolute'
- getComputedStyle(document.querySelector('.badge')).top === '10px'
- getComputedStyle(document.querySelector('.badge')).right === '10px'
- getComputedStyle(document.querySelector('.badge')).backgroundColor === 'rgb(255, 0, 0)'
- getComputedStyle(document.querySelector('.badge')).color === 'rgb(255, 255, 255)'
hint: card 设 position: relative 做参考，badge 设 position: absolute 钉在右上角，再设颜色和内边距。
explain: relative + absolute 是经典组合，badge 相对 card 定位在右上角，形成角标效果。
```

## 第三部分 · 小项目

```quiz
type: project
q: 用 Flex 布局做一个响应式导航栏：左侧是品牌名（.brand），右侧是导航链接（.nav-links 用 ul > li > a）。导航栏用 Flex 两端对齐（space-between），链接之间用 flex: 1 平均分配剩余空间。要求语义化标签正确（nav、ul、li），样式统一。
starter: |
  <nav class="navbar">
    <span class="brand">张三的博客</span>
    <ul class="nav-links">
      <li><a href="#">首页</a></li>
      <li><a href="#">文章</a></li>
      <li><a href="#">关于</a></li>
    </ul>
  </nav>
checklist:
- 使用了 nav、ul、li、a 语义化标签
- 导航栏使用 Flex 布局，两端对齐
- 链接区域使用 Flex 平均分配空间
- 导航栏有背景色和适当的内边距
- 链接有 hover 效果或至少样式清晰
```
