# Chapter 4 assessment: handling events

## Part 1 · Multiple choice

```quiz
type: choice
exam: true
q: Which statement about event bubbling and capturing is correct?
options:
- Events bubble before they capture
- Events capture first (outside in), then reach the target, then bubble (inside out)
- All events are non-bubbling
- addEventListener's third argument defaults to true (capture)
answer: 1
explain: The event flow is capture (document down to the target), then the target phase, then bubble (target back up to document). The third argument of addEventListener defaults to false, which means bubble.
```

```quiz
type: choice
exam: true
q: Which statement about event delegation is correct?
options:
- Event delegation requires attaching a listener to every child element
- Event delegation relies on bubbling, so one listener on a parent manages every child including those added later
- Event delegation only works for click events
- Event delegation cannot handle elements added dynamically
answer: 1
explain: Delegation works because child events bubble up to the parent, which identifies the actual child through event.target. Children added later bubble to the same parent, so they are handled too.
```

```quiz
type: choice
exam: true
q: Which statement about preventDefault and stopPropagation is correct?
options:
- preventDefault stops event propagation
- stopPropagation cancels the browser default action
- preventDefault cancels the default action (such as a page reload) while stopPropagation stops the event travelling further
- The two methods do exactly the same thing
answer: 2
explain: preventDefault only cancels the default action; the event still bubbles. stopPropagation stops the event from reaching ancestor elements. They are independent operations.
```

```quiz
type: choice
exam: true
q: Which statement about the event object is correct?
options:
- event.target is the element that was first given a listener
- event.target is the element that triggered the event (possibly an inner child); event.currentTarget is the element the listener is attached to
- event.preventDefault() can only be called during the capture phase
- event.key and event.keyCode are both recommended properties
answer: 1
explain: event.target is the actual trigger (possibly a child); event.currentTarget is the element whose listener is running. keyCode is deprecated - use key instead.
```

```quiz
type: choice
exam: true
q: Which statement about when common events fire is correct?
options:
- The input event only fires when the field loses focus
- The change event fires on every keystroke
- The input event fires on every value change (keystrokes, pasting, deleting)
- A submit handler does not need preventDefault
answer: 2
explain: input fires on every value change (typing, pasting, deleting, composing). change only fires on blur when the value has changed. submit must call preventDefault or the page reloads.
```

## Part 2 · Hands-on exercises

```quiz
type: js
exam: true
q: Given the HTML `<div id="menu"><button class="menu-item" data-action="save">Save</button><button class="menu-item" data-action="edit">Edit</button><button class="menu-item" data-action="delete">Delete</button></div>`, write a function setupMenu() that uses event delegation on #menu: when a .menu-item is clicked, store its data-action value in window.__action, add the class "active" to it, and remove "active" from every other .menu-item.
func: setupMenu
starter: |
  function setupMenu() {
      // delegate: use closest('.menu-item') to locate the target
  }
html: |
  <div id="menu">
    <button class="menu-item" data-action="save">Save</button>
    <button class="menu-item" data-action="edit">Edit</button>
    <button class="menu-item" data-action="delete">Delete</button>
  </div>
checks:
- (setupMenu(), document.querySelector('[data-action="edit"]').click(), window.__action === 'edit' && document.querySelector('[data-action="edit"]').classList.contains('active') && !document.querySelector('[data-action="save"]').classList.contains('active'))
hint: menu.addEventListener('click', e => { const item = e.target.closest('.menu-item'); if(!item) return; document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active')); item.classList.add('active'); window.__action = item.dataset.action; });
explain: Delegation plus closest drives a toolbar: locate the target, clear sibling state, set the current state, store the value. This is the standard pattern for toolbars and menus.
```

```quiz
type: js
exam: true
q: Given the HTML `<div id="counter"><button id="decrement">-</button><span id="count">0</span><button id="increment">+</button></div>`, write a function setupCounter() that increments #count when #increment is clicked and decrements it when #decrement is clicked (never below 0). The current value is shown inside #count.
func: setupCounter
starter: |
  function setupCounter() {
      // attach click listeners to increment and decrement
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
explain: Counter pattern: a closure variable holds the state; clicks update it and write the new value into the DOM. Decrement guards against going below zero.
```

## Part 3 · Mini-project

```quiz
type: project
exam: true
q: Given the HTML `<div id="accordion"><div class="panel" data-id="1"><div class="header">Panel 1</div><div class="content">Content 1</div></div><div class="panel" data-id="2"><div class="header">Panel 2</div><div class="content">Content 2</div></div><div class="panel" data-id="3"><div class="header">Panel 3</div><div class="content">Content 3</div></div></div>`, write a function setupAccordion() that uses event delegation: clicking a .header expands the matching .content and collapses every other panel's .content. Add the class "expanded" to the open panel.
func: setupAccordion
starter: |
  function setupAccordion() {
      // delegate: clicking a header expands its panel and collapses the others
  }
html: |
  <div id="accordion">
    <div class="panel" data-id="1">
      <div class="header">Panel 1</div>
      <div class="content">Content 1</div>
    </div>
    <div class="panel" data-id="2">
      <div class="header">Panel 2</div>
      <div class="content">Content 2</div>
    </div>
    <div class="panel" data-id="3">
      <div class="header">Panel 3</div>
      <div class="content">Content 3</div>
    </div>
  </div>
checks:
- (setupAccordion(), document.querySelector('[data-id="2"] .header').click(), document.querySelector('[data-id="2"]').classList.contains('expanded') && !document.querySelector('[data-id="1"]').classList.contains('expanded'))
- (setupAccordion(), document.querySelector('[data-id="1"] .header').click(), document.querySelector('[data-id="1"]').classList.contains('expanded') && document.querySelector('[data-id="2"] .header').click(), document.querySelector('[data-id="2"]').classList.contains('expanded') && !document.querySelector('[data-id="1"]').classList.contains('expanded'))
hint: Delegate the click, find the panel, remove 'expanded' from all panels, add 'expanded' to the current one; the CSS rule .expanded .content controls visibility.
explain: An accordion is delegation plus state toggling: expand the current panel while collapsing the rest. Clear every panel's state, then add 'expanded' to the one that was clicked.
```
