# Chapter 6 test: the complete project

## Part 1 · Multiple choice

```quiz
type: choice
q: Which statement about to-do list data design is correct?
options:
- The array index can safely identify a task.
- A stable unique id such as a timestamp is required because the array is dynamic.
- The id need not be unique as long as the text differs.
- No id is needed; hold a direct reference to the DOM element.
answer: 1
explain: Deleting an element shifts every later index, so a stored index ends up pointing at the wrong task. The id must be stable and unique, and text may repeat.
```

```quiz
type: choice
q: Which statement about the data-driven view pattern is correct?
options:
- After every data change you must call render() to update the DOM.
- The DOM reacts to data changes automatically.
- You should manipulate the DOM directly to alter state.
- render() may be called only once; later changes need no further call.
answer: 0
explain: Data drives the view: change the data, then call render() to rebuild. JavaScript has no reactive system, so the call is mandatory. Mutating the DOM directly drifts it away from the data.
```

```quiz
type: choice
q: Which statement about handling JSON.parse on localStorage data is correct?
options:
- JSON.parse never throws.
- JSON.parse should sit inside try-catch so corrupted data yields a safe default.
- Data in localStorage cannot become corrupted.
- JSON.parse(null) throws an error.
answer: 1
explain: Illegal JSON makes JSON.parse throw. Other code or a user can damage the stored value, so try-catch stops one bad record from taking down the whole app.
```

```quiz
type: choice
q: When using event delegation, which statement about event.target is correct?
options:
- event.target is always the element the listener was attached to.
- event.target may be an element inside the row, such as a button, so use closest() to walk up.
- event.target is always the same as currentTarget.
- closest() can only match by class, never by tag name.
answer: 1
explain: event.target is the element that actually received the event and may sit inside the li. closest('li') finds the row. target and currentTarget are usually different.
```

```quiz
type: choice
q: Which statement about innerHTML versus createElement is correct?
options:
- innerHTML is always safe and XSS is not a concern.
- If the content came from a user, innerHTML creates an XSS risk; use textContent or escape it first.
- createElement is slower and should be avoided.
- innerHTML cannot set element attributes.
answer: 1
explain: innerHTML parses its argument as HTML, so user-supplied markup can execute scripts. textContent is safe by default, and any innerHTML input must be escaped first.
```

## Part 2 · Practical tasks

```quiz
type: js
q: Write a function createStore(initialState) that implements a small store. Return `{ getState, setState, subscribe }`. `getState` returns the current state. `setState` accepts a partial object and merges it into the current state, like Object.assign. `subscribe` accepts a listener and calls every listener when the state changes.
func: createStore
starter: |
  function createStore(initialState) {
      // return { getState, setState, subscribe }
      let state = { ...initialState };
      const listeners = [];
      return {};
  }
checks:
- (function(){const store=createStore({count:0,name:"test"});return store.getState().count===0&&store.getState().name==="test";})()
- (function(){const store=createStore({count:0});store.setState({count:5});return store.getState().count===5;})()
- (function(){const store=createStore({count:0});let called=false;store.subscribe(()=>{called=true;});store.setState({count:1});return called===true;})()
hint: getState() { return state; }, setState(partial) { Object.assign(state, partial); listeners.forEach(fn => fn(state)); }, subscribe(fn) { listeners.push(fn); }
explain: A minimal store: a closure holds state and the listener list. setState merges and notifies, which is the simplified core of libraries such as Redux and Vuex.
```

```quiz
type: js
q: Write a function toggleAll(todos, done) where todos is an array of `{id, text, done}` objects. Set the `done` field of every todo to the boolean passed in. Return a new array without mutating the original: use map to build fresh objects.
func: toggleAll
starter: |
  function toggleAll(todos, done) {
      // use map to return a new array with each todo's done set to done
  }
checks:
- JSON.stringify(toggleAll([{"id":1,"text":"a","done":false},{"id":2,"text":"b","done":true}],true)) === JSON.stringify([{"id":1,"text":"a","done":true},{"id":2,"text":"b","done":true}])
- JSON.stringify(toggleAll([{"id":1,"text":"a","done":true},{"id":2,"text":"b","done":true}],false)) === JSON.stringify([{"id":1,"text":"a","done":false},{"id":2,"text":"b","done":false}])
- JSON.stringify(toggleAll([],true)) === JSON.stringify([])
hint: return todos.map(todo => ({ ...todo, done }));
explain: Immutable updates: map returns new objects, spreading the old fields and overriding done. The original array is left untouched, which is the recommended style in frameworks such as React.
```

## Part 3 · Mini-project

```quiz
type: project
q: Write a function createTodoApp(container) where container is a DOM element. Build a complete to-do list inside it: an input with class `"todo-input"`, a button with class `"add-btn"` and text `"Add"`, and a ul with class `"todo-list"`. Clicking the button or pressing Enter adds the input value as a new task (each row has a checkbox and a delete button). Clicking the checkbox toggles the completed state and adds or removes the class `"completed"`. Clicking the delete button removes the row. Persist the tasks in localStorage under the key `'mini-todos'`. Return `{ getTodos }`, which returns the current todos array.
func: createTodoApp
starter: |
  function createTodoApp(container) {
      // build the complete to-do list application
      const todos = [];
      return { getTodos: () => todos };
  }
html: |
  <div id="app"></div>
checks:
- (function(){const app=createTodoApp(document.querySelector('#app'));return document.querySelector('.todo-input')!==null&&document.querySelector('.add-btn')!==null&&document.querySelector('.todo-list')!==null;})()
- (function(){const app=createTodoApp(document.querySelector('#app'));const input=document.querySelector('.todo-input');input.value="Buy milk";document.querySelector('.add-btn').click();return app.getTodos().length===1&&app.getTodos()[0].text==="Buy milk"&&document.querySelectorAll('.todo-list li').length===1;})()
- (function(){const app=createTodoApp(document.querySelector('#app'));const input=document.querySelector('.todo-input');input.value="Write code";document.querySelector('.add-btn').click();return JSON.parse(localStorage.getItem('mini-todos')).length===1;})()
hint: Build the DOM, wire the events, push { id: Date.now(), text: input.value, done: false } into todos on add, then save and render. render creates each li with a checkbox and delete button, the checkbox toggles done, and the delete button filters it out.
explain: The complete project: DOM creation, event wiring, data management, localStorage persistence, event delegation and rendering together cover every concept in this course. This is the full to-do application.
```
