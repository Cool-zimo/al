# 第 6 章 · 综合实战 · 大测验

> 8 道题。这一章是把前 5 章的知识综合运用到"个人简历页"项目中，从设计规划到上线部署的完整流程。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 CSS 变量，以下说法正确的是？
options:
- CSS 变量只能在 :root 中定义
- CSS 变量用 --name 定义，用 var(--name) 引用
- CSS 变量不能用于 media query 中的值
- CSS 变量会触发布局重排
answer: 1
explain: CSS 变量用 -- 前缀定义，var() 函数引用。它可以在任何选择器内定义和覆盖，也可以在媒体查询中重新赋值。
```

```quiz
type: choice
q: JavaScript 中 addEventListener 的作用是什么？
options:
- 给元素添加 CSS 类名
- 监听指定事件并在事件发生时执行回调函数
- 修改元素的 HTML 内容
- 发送网络请求
answer: 1
explain: addEventListener 为元素注册事件监听器，当指定事件（如 click、scroll）触发时执行传入的回调函数。
```

```quiz
type: choice
q: GitHub Pages 对仓库名有什么特殊要求？
options:
- 必须叫 project
- 使用 用户名.github.io 格式的仓库名可直接发布到根域名
- 必须是私有仓库
- 不能有 README 文件
answer: 1
explain: 仓库名格式为 用户名.github.io 时，GitHub Pages 自动将其发布到 https://用户名.github.io。普通仓库名则发布到子路径。
```

```quiz
type: choice
q: 深色模式切换时，为什么推荐用 CSS 变量 + class 切换？
options:
- 因为 JS 不能直接修改 CSS
- 因为只需切换一个 class，CSS 变量自动让所有使用它的属性重新计算
- 因为 CSS 变量只能用 JS 定义
- 因为 class 切换比直接改样式快
answer: 1
explain: 通过切换 body 上的 class（如 dark-mode），该 class 下的 CSS 变量重新赋值，所有引用这些变量的属性自动更新，维护成本极低。
```

```quiz
type: choice
q: 上线前检查清单中，关于可访问性的要求不包括以下哪项？
options:
- 图片有 alt 属性
- 可以用 Tab 键遍历所有可交互元素
- 页面必须有炫酷的动画效果
- 按钮有可理解的文字
answer: 2
explain: 炫酷动画不是可访问性要求，过度动画反而可能导致眩晕问题。可访问性关注 alt 属性、键盘导航、对比度、语义标签等。
```

## 第二部分 · 动手题

```quiz
type: js
q: 写一个函数 formatDate(year, month, day)：把三个数字拼成形如 "2026-09-29" 的日期字符串，月和日不足两位时前面补 0
func: formatDate
starter: |
  function formatDate(year, month, day) {
      return "";
  }
cases: |
  2026, 9, 29 -> "2026-09-29"
  2026, 1, 5 -> "2026-01-05"
  1999, 12, 31 -> "1999-12-31"
hint: 月份和日期如果小于 10，前面补 0。
explain: 用 String.padStart(2, '0') 或直接判断拼接，保证月日始终是两位。
```

```quiz
type: css
q: 用 CSS 变量 + class 切换实现深色模式：定义 --bg-dark 为 #1a1a2e、--text-dark 为 #e0e0e0。当元素带 dark-mode 类时，背景变为 --bg-dark、文字变为 --text-dark。同时定义浅色默认值 --bg-light 为 #f8f9fa、--text-light 为 #333333。
html: |
  <div class="dark-mode">
    <h1>我的简历</h1>
    <p>这是一段正文内容</p>
  </div>
starter: |
  :root {
    --bg-light: #f8f9fa;
    --text-light: #333333;
    --bg-dark: #1a1a2e;
    --text-dark: #e0e0e0;
  }
  body {
    background: var(--bg-light);
    color: var(--text-light);
    transition: background 0.3s, color 0.3s;
  }
checks:
- getComputedStyle(document.querySelector('.dark-mode')).backgroundColor === 'rgb(26, 26, 46)'
- getComputedStyle(document.querySelector('.dark-mode')).color === 'rgb(224, 224, 224)'
hint: 默认浅色模式生效，检查 body 的 background 和 color 是否用了浅色变量。
explain: CSS 变量定义后通过 var() 引用，默认使用浅色变量，切换 dark-mode 类后使用深色变量。
```

## 第三部分 · 小项目

```quiz
type: project
q: 完成个人简历页的最终版：包含语义化 HTML 骨架（header/main/section/article/footer）、统一的 CSS 变量设计系统、响应式布局（手机单列、宽屏双列）、深色模式切换按钮（用 JS 实现 class 切换）、导航高亮效果。部署到 GitHub Pages 并验证可访问性。
starter: |
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人简历</title>
  </head>
  <body>
  </body>
  </html>
checklist:
- HTML 使用了 header、main、section、article、footer 等语义化标签
- 使用了 CSS 变量统一管理颜色和间距
- 实现了响应式布局（至少包含手机和桌面两种断点）
- 实现了深色模式切换功能（按钮 + JS + CSS class）
- 导航链接有 hover/focus 高亮效果
- 图片有 alt 属性，链接有描述性文字
- 已部署到 GitHub Pages 并可正常访问
- 在手机尺寸下无横向滚动
```
