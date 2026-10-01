# Chapter 6 Test: Integrated Project

## Part One · Multiple Choice

```quiz
type: choice
q: What is the correct order for building a web project?
options:
- UI -> functions -> data
- data -> functions -> UI
- functions -> data -> UI
- It does not matter; any order works
answer: 1
explain: Design the data structure first, then the processing functions, and finally the UI — so data is the foundation.
```

```quiz
type: choice
q: When rendering a list, if you append without clearing the container first, what happens?
options:
- Nothing is displayed
- Elements accumulate and duplicate
- An error is thrown
- Only the last item is shown
answer: 1
explain: Without clearing, old elements remain and new ones are added on top — the list keeps growing.
```

```quiz
type: choice
q: After pushing an item into an array, the page does not change. What is the most likely reason?
options:
- Arrays cannot use push
- You forgot to call render again
- push is wrong
- You should have used innerHTML
answer: 1
explain: Changing array data does not automatically update the UI; you must call render again.
```

```quiz
type: choice
q: In a list where items can be added and removed, what is best for identifying an item?
options:
- index
- id
- length
- parent element
answer: 1
explain: An id is permanently unique; an index is temporary and shifts after an item is removed.
```

```quiz
type: choice
q: Which of the following is an "assignment" rather than a "comparison"?
options:
- a === b
- a = b
- a !== b
- a < b
answer: 1
explain: A single equals sign = assigns a value; three equals signs === is the strict comparison.
```

## Part Two · Hands-on

```quiz
type: js
q: Given HTML <ul id="list"></ul>, write renderList(items) that turns each item in the items array into an <li> attached to list (clear the container first).
func: renderList
html: |
  <ul id="list"></ul>
starter: |
  function renderList(items) {
      // write your code here
  }
checks:
- (renderList(["Apple","Banana"]), document.querySelectorAll('#list li').length === 2)
- (renderList(["Apple","Banana","Orange"]), document.querySelectorAll('#list li').length === 3)
- (renderList(["Apple"]), document.querySelector('#list li').textContent === 'Apple')
hint: First clear with list.innerHTML='', then loop over items to create li elements and attach them
explain: Clearing prevents accumulation; then iterate to generate each item.
```

```quiz
type: js
q: Given HTML <ul id="list"></ul>, write addItem(text) that pushes an object {id,text} into an internal array and then re-renders.
func: addItem
html: |
  <ul id="list"></ul>
starter: |
  let items = [];
  function addItem(text) {
      // write your code here
  }
checks:
- (addItem('Apple'), document.querySelectorAll('#list li').length === 1)
- (addItem('Banana'), document.querySelectorAll('#list li').length === 2)
hint: push into items then call render, which clears first and then loops to create li elements
explain: After changing the array you must re-render, and always clear the container first.
```

## Part Three · Mini Project

```quiz
type: js
q: Build a "todo list". HTML is provided <input id="todo-input" placeholder="Add a new task"><button id="add-btn">Add</button><ul id="todo-list"></ul>. Implement: 1) when the add button is clicked, push the input text as a new task object (with id and text) into the internal array, clear the input, and re-render; 2) each task item should have a delete button with class "del" in addition to the text; 3) clicking the delete button removes that item (located by id) and re-renders. You may put the button listener binding inside render or setup.
func: setup
html: |
  <input id="todo-input" placeholder="Add a new task"><button id="add-btn">Add</button><ul id="todo-list"></ul>
starter: |
  let todos = [];
  let input = document.querySelector('#todo-input');
  let addBtn = document.querySelector('#add-btn');
  let list = document.querySelector('#todo-list');

  function render() {
      // clear first, then loop over todos to generate li (with text and delete button)
  }

  function addTodo(text) {
      // push into todos and render
  }

  function deleteTodo(id) {
      // filter by id to remove and render
  }

  function setup() {
      // bind click to addBtn, read input.value, call addTodo, clear input
  }
checks:
- (setup(), todos.length = 0, render(), input.value = 'Shopping', addBtn.click(), document.querySelectorAll('#todo-list li').length === 1)
- (todos.length = 0, render(), input.value = 'Shopping', addBtn.click(), input.value = 'Coding', addBtn.click(), document.querySelectorAll('#todo-list li').length === 2)
- (todos.length = 0, render(), input.value = 'a', addBtn.click(), input.value = 'b', addBtn.click(), document.querySelectorAll('#todo-list li .del').length === 2)
hint: In render, first clear list.innerHTML='' then loop; for each item create an li, then create a button, set className='del', bind click to call deleteTodo(todo.id); in setup bind addBtn click
explain: This comprehensively tests data design, rendering, adding, deleting, and event binding — the capstone of the whole book.
```
