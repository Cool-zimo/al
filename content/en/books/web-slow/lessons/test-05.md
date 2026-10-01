# Chapter 5 Test: The DOM

## Part One · Multiple Choice

```quiz
type: choice
q: To find the element whose id is app, which selector is correct?
options:
- document.querySelector("app")
- document.querySelector("#app")
- document.querySelector(".app")
- document.querySelector("*app")
answer: 1
explain: An id uses the hash #, written as '#app'; '.app' would look for a class.
```

```quiz
type: choice
q: What does querySelector return when it cannot find an element?
options:
- undefined
- null
- 0
- an empty array
answer: 1
explain: When no element is found, querySelector returns null, not an error and not undefined.
```

```quiz
type: choice
q: Why should you avoid assigning user input directly to innerHTML?
options:
- It causes an error
- Tags in the user input are parsed as real HTML, creating an XSS risk
- innerHTML can only read, not write
- It slows down the page
answer: 1
explain: innerHTML parses the string as HTML, so malicious scripts can execute — that is the XSS risk.
```

```quiz
type: choice
q: To toggle a class on an element (remove if present, add if absent), which method should you use?
options:
- classList.add
- classList.remove
- classList.toggle
- classList.has
answer: 2
explain: toggle means "remove if it exists, add if it does not" — one line implements an on/off switch.
```

```quiz
type: choice
q: What happens if you assign to onclick twice in a row?
options:
- Both handler functions take effect
- The second one overwrites the first
- It causes an error
- Only the first one takes effect
answer: 1
explain: onclick is a property assignment; assigning it a second time overwrites the first one.
```

## Part Two · Hands-on

```quiz
type: js
q: Given HTML <p id="msg">old content</p>, write a function update that changes its text to "updated".
func: update
html: |
  <p id="msg">old content</p>
starter: |
  function update() {
      // write your code here
  }
checks:
- (update(), document.querySelector('#msg').textContent === 'updated')
hint: Assign with textContent
explain: Assigning to textContent is immediately reflected on the page.
```

```quiz
type: js
q: Given HTML <button id="btn">Click me</button><span id="n">0</span>, write a function setup that binds a click listener to btn so each click increments the number in n by 1.
func: setup
html: |
  <button id="btn">Click me</button><span id="n">0</span>
starter: |
  function setup() {
      // write your code here
  }
checks:
- (setup(), document.querySelector('#n').textContent = '0', document.querySelector('#btn').click(), document.querySelector('#n').textContent === '1')
- (document.querySelector('#n').textContent = '0', document.querySelector('#btn').click(), document.querySelector('#btn').click(), document.querySelector('#n').textContent === '2')
hint: In the addEventListener, convert n's textContent to a number, add 1, then write it back
explain: The click callback manipulates n's content to implement a counter; clicking twice should give 2.
```

## Part Three · Mini Project

```quiz
type: js
q: Build an "image switcher". Given HTML <img id="pic" src="a.jpg"><button id="next">Next</button>, write a function setup2 that binds a click to the button, each click cycling the image src among three suffixes a/b/c (first click becomes b.jpg, second becomes c.jpg, third goes back to a.jpg). Put the button listener binding inside setup2.
func: setup2
html: |
  <img id="pic" src="a.jpg"><button id="next">Next</button>
starter: |
  function setup2() {
      // write your code here; use a closure variable to track the current image
  }
checks:
- (setup2(), document.querySelector('#next').click(), document.querySelector('#pic').src.endsWith('b.jpg'))
- (setup2(), document.querySelector('#next').click(), document.querySelector('#next').click(), document.querySelector('#pic').src.endsWith('c.jpg'))
hint: Use an outer variable index; on click do index = (index+1)%3, then build 'abc'[index]+'.jpg' and assign it to pic.src
explain: A closure variable tracks the current index; each click cycles through, demonstrating the event-plus-state idea.
```
