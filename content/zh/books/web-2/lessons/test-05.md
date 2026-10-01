# 第 5 章章测：表单、存储、调试与定时器

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 关于表单取值，下列说法正确的是？
options:
- checkbox 是否勾选应该用 checkbox.value 判断
- checkbox 是否勾选应该用 checkbox.checked（布尔值）
- select.value 返回所有选项的文本
- input.value 返回的是数字类型
answer: 1
explain: checkbox 用 .checked 获取布尔值。select.value 返回选中项的 value 属性。input.value 返回字符串。
```

```quiz
type: choice
exam: true
q: 关于 localStorage，下列说法正确的是？
options:
- localStorage 可以直接存储 JavaScript 对象
- localStorage 只能存储字符串，存对象需要用 JSON.stringify
- localStorage 的容量是无限的
- localStorage 在标签页关闭后自动清除
answer: 1
explain: localStorage 只能存字符串，存对象必须 JSON.stringify，取出来用 JSON.parse。容量约 5MB。sessionStorage 才是关闭标签页后清除。
```

```quiz
type: choice
exam: true
q: 关于 setTimeout(fn, 0) 的执行时机，下列说法正确的是？
options:
- 回调会立即执行，在下一行代码之前
- 回调会在当前所有同步代码执行完毕后才执行
- 回调会在 0 毫秒后精确执行
- setTimeout 是阻塞的，会暂停主线程
answer: 1
explain: setTimeout(fn, 0) 的回调被放入事件队列，等当前所有同步代码执行完毕后才运行。它不是阻塞的，不会暂停主线程。
```

```quiz
type: choice
exam: true
q: 关于表单验证的错误提示，最佳实践是什么？
options:
- 用 alert("错误") 即可
- 提示要具体可读：指明哪个字段、什么问题、怎么改
- 只说"格式错误"让用户自己猜
- 不需要提示，静默处理即可
answer: 1
explain: 好的错误提示需要三要素：指明字段、说明问题、给出示例。alert("错误") 无法让用户理解具体问题。
```

```quiz
type: choice
exam: true
q: 关于报错信息的阅读方式，下列说法正确的是？
options:
- 从最顶部开始读，那是事件源头
- 从最底部开始读（事件源头），往上是调用链，最顶部是出错行
- 报错信息不需要看行号
- 报错栈的顺序是随机的
answer: 1
explain: JS 报错栈从下往上是调用链（最底部是事件源头如用户点击），最顶部是出错的具体行号和列号。调试时从底部往上追溯。
```

## 第二部分 · 动手题

```quiz
type: js
exam: true
q: 给定 HTML：<form id="profile"><input type="text" name="nickname" placeholder="昵称"><input type="email" name="email" placeholder="邮箱"><input type="checkbox" name="newsletter" id="news"><button type="submit">保存</button></form>，写一个函数 getProfileData()：返回对象 { nickname: 昵称输入框的value, email: 邮箱输入框的value, subscribe: checkbox的checked状态 }。
func: getProfileData
starter: |
  function getProfileData() {
      // 返回表单数据对象
  }
html: |
  <form id="profile">
    <input type="text" name="nickname" placeholder="昵称" value="小猫">
    <input type="email" name="email" placeholder="邮箱" value="cat@test.com">
    <input type="checkbox" name="newsletter" id="news" checked>
    <button type="submit">保存</button>
  </form>
checks:
- (JSON.stringify(getProfileData()) === JSON.stringify({nickname:"小猫",email:"cat@test.com",subscribe:true}))
hint: return { nickname: form.elements.nickname.value, email: form.elements.email.value, subscribe: document.querySelector('#news').checked };
explain: 综合表单取值：text 用 .value，checkbox 用 .checked。form.elements 是获取表单字段的便捷方式。
```

```quiz
type: js
exam: true
q: 写一个函数 debounce(fn, delay)：返回一个新函数，调用时延迟 delay 毫秒执行 fn，如果在这期间再次调用则重新计时。用 setTimeout 和 clearTimeout 实现。
func: debounce
starter: |
  function debounce(fn, delay) {
      // 返回防抖后的函数
      let timerId = null;
      return function(...args) {
          // 清除之前的定时器，设置新的
      };
  }
checks:
- (function(){ let count = 0; const inc = debounce(() => count++, 100); inc(); inc(); inc(); return new Promise(r => setTimeout(() => r(count === 1), 300)); })()
- (function(){ let n = 0; const f = debounce(() => n++, 100); f(); setTimeout(() => f(), 50); return new Promise(r => setTimeout(() => r(n === 1), 400)); })()
hint: return function(...args){ clearTimeout(timerId); timerId = setTimeout(()=>fn.apply(this,args), delay); };
explain: 防抖模式：每次调用先清除旧定时器再设新的。只有停止调用 delay 毫秒后才会真正执行。用于搜索框输入、窗口 resize 等高频事件。
```

## 第三部分 · 小项目

```quiz
type: project
exam: true
q: 写一个函数 createAutoSave(inputEl, delay)：inputEl 是输入框元素。实现防抖自动保存：用户停止输入 delay 毫秒后，把 inputEl.value 存到 localStorage 的 'autosave' key。同时把保存次数存到 window.__saveCount。返回对象 { destroy }，destroy 方法清除定时器。
func: createAutoSave
starter: |
  function createAutoSave(inputEl, delay) {
      // 绑定 input 事件，防抖保存
      let timerId = null;
      return {
          destroy() {
              // 清除定时器
          }
      };
  }
html: |
  <input id="note" value="初始内容">
checks:
- (function(){const input=document.querySelector('#note');const sa=createAutoSave(input,100);input.value="新内容";input.dispatchEvent(new Event('input'));setTimeout(()=>{const result=localStorage.getItem('autosave')==="新内容";sa.destroy();return result;},200);})()
hint: 在 input 事件回调里 clearTimeout(timerId) 然后 setTimeout 里执行 localStorage.setItem('autosave', inputEl.value) 并 window.__saveCount++。destroy 里 clearTimeout(timerId)。
explain: 综合应用：防抖 + localStorage + 事件绑定。这是"自动保存草稿"功能的完整实现，常见于富文本编辑器、笔记应用。
```
