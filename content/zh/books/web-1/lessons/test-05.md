# 第 5 章 · 响应式与动效 · 大测验

> 8 道题。这一章解决的是"怎么让页面在不同设备上好看、怎么让它动起来"的问题，涵盖响应式设计、viewport、媒体查询、相对单位、Grid 布局和动画。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: viewport meta 标签中，width=device-width 的作用是什么？
options:
- 设置页面初始缩放为 2 倍
- 让浏览器使用设备的真实宽度作为视口宽度
- 禁止用户缩放页面
- 设置页面最小宽度为 980px
answer: 1
explain: width=device-width 告诉浏览器以设备的实际宽度渲染页面，是移动端网页的基础配置。
```

```quiz
type: choice
q: 关于 rem 和 em，以下说法正确的是？
options:
- rem 和 em 都相对根元素的字体大小
- rem 相对根元素字体大小，em 相对当前元素字体大小，嵌套使用 em 会层层放大
- em 相对视口宽度，rem 相对视口高度
- rem 只能用于 font-size，em 只能用于 margin
answer: 1
explain: rem 始终相对 html 根元素的字号；em 相对当前元素的字号，嵌套时会基于父级逐级放大。
```

```quiz
type: choice
q: Grid 和 Flex 的核心区别是什么？
options:
- Grid 只能用于图片，Flex 只能用于文字
- Grid 是二维布局（同时控制行和列），Flex 是一维布局（一次管一行或一列）
- Grid 需要 JavaScript，Flex 纯 CSS
- 两者完全一样
answer: 1
explain: Grid 同时管理行和列两个维度，适合整体页面骨架；Flex 一次只管一个方向，适合一组元素的排列。
```

```quiz
type: choice
q: 以下哪个属性不适合用 transition 做过渡？
options:
- background-color
- opacity
- display
- transform
answer: 2
explain: display 是离散属性（none 和 block 之间没有中间值），无法插值，transition 不生效。应使用 opacity + visibility 或 max-height 代替。
```

```quiz
type: choice
q: 手机优先的响应式策略通常使用哪个媒体查询条件？
options:
- max-width
- min-width
- only screen
- device-width
answer: 1
explain: 手机优先先写基础样式（面向窄屏），再用 min-width 断点在更宽的屏幕上逐步增强。
```

## 第二部分 · 动手题

```quiz
type: css
q: 写一个响应式图片：最大宽度 100%，高度自动保持比例，圆角 12px，鼠标 hover 时放大 1.05 倍（transform: scale(1.05)），过渡 0.3s ease。（hover 效果请自己在浏览器里试，自动检查只验证过渡设置）
html: |
  <img src="avatar.jpg" class="avatar">
starter: |
  .avatar {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }
checks:
- getComputedStyle(document.querySelector('.avatar')).maxWidth === '100%'
- getComputedStyle(document.querySelector('.avatar')).borderRadius === '12px'
- getComputedStyle(document.querySelector('.avatar')).transition.startsWith('transform 0.3s')
hint: 在 hover 状态下设置 transform: scale(1.05)，并给元素加 transition 监听 transform。
explain: 图片弹性缩放 + hover 放大效果，transform 性能优于直接改 width/height。
```

```quiz
type: css
q: 用 Grid 做一个三列卡片网格：.grid 用 repeat(3, 1fr) 定义三列等宽，gap 为 20px。每个 .card 背景浅灰、内边距 16px、圆角 8px。
html: |
  <div class="grid">
    <div class="card">前端开发</div>
    <div class="card">后端开发</div>
    <div class="card">运维部署</div>
  </div>
starter: |
  .grid {
  }
  .card {
  }
checks:
- getComputedStyle(document.querySelector('.grid')).display === 'grid'
- getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length === 3
- Math.abs(parseFloat(getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ')[0]) - parseFloat(getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ')[2])) < 2
- getComputedStyle(document.querySelector('.grid')).gap === '20px'
- getComputedStyle(document.querySelector('.card')).padding === '16px'
- getComputedStyle(document.querySelector('.card')).borderRadius === '8px'
hint: grid 用 repeat(3, 1fr) 创建三列等宽网格，gap 设间距，card 设内边距和圆角。
explain: Grid 的 repeat 函数配合 fr 单位能快速创建等宽列网格，gap 统一间距。
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个响应式的产品展示页：使用 Grid 布局，手机上单列（grid-template-columns: 1fr），屏幕 >= 768px 时三列（repeat(3, 1fr)）。每个产品卡片包含图片（用 div 占位即可）、标题和价格，卡片有 hover 上浮效果（transform: translateY(-4px)）。要求语义化标签正确、间距统一。
starter: |
  <section class="products">
    <article class="product-card">
      <div class="img-placeholder"></div>
      <h3>无线耳机</h3>
      <p class="price">¥299</p>
    </article>
    <article class="product-card">
      <div class="img-placeholder"></div>
      <h3>机械键盘</h3>
      <p class="price">¥599</p>
    </article>
    <article class="product-card">
      <div class="img-placeholder"></div>
      <h3>人体工学椅</h3>
      <p class="price">¥1299</p>
    </article>
  </section>
checklist:
- 使用了 section、article、h3 等语义化标签
- 默认单列布局，宽屏断点改为三列
- 卡片有 hover 上浮效果
- 卡片有统一的内边距和圆角
- 图片占位区域有固定宽高比或最小高度
- 价格使用 ¥ 符号
```
