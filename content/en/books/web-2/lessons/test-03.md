# Chapter 3 test: DOM manipulation

## Part 1 · Multiple choice

```quiz
type: choice
exam: true
q: Which statement about textContent and innerHTML is correct?
options:
- textContent parses HTML tags and innerHTML does not
- textContent only sets/gets plain text (tags are not parsed), while innerHTML parses its content as HTML
- The two are exactly the same
- innerHTML is safer than textContent
answer: 1
explain: textContent treats content as plain text (< is not parsed as a tag), while innerHTML parses the string as HTML. innerHTML carries an XSS risk.
```

```quiz
type: choice
exam: true
q: Which statement about DOM query methods is correct?
options:
- querySelector returns every matching element, and querySelectorAll returns the first
- querySelector returns the first matching element, and querySelectorAll returns every matching element (a NodeList)
- getElementById is slower than querySelector
- querySelectorAll returns a true array, so map and filter are available directly
answer: 1
explain: querySelector returns the first match; querySelectorAll returns a NodeList. A NodeList is not an array (though it has forEach), so map and filter require converting it with [...nodeList].
```

```quiz
type: choice
exam: true
q: Which statement about creating and removing DOM elements is correct?
options:
- document.createElement('div') immediately adds the element to the page
- removeChild removes a child from a parent element, while element.remove() removes the element itself
- appendChild can only be called on the body
- An element created with createElement is visible on the page without calling appendChild
answer: 1
explain: createElement only creates the element (it is not yet in the DOM) and needs appendChild to be inserted. removeChild is called on the parent, while element.remove() is the modern self-removal method. appendChild can be called on any parent element.
```

```quiz
type: choice
exam: true
q: Which statement about changing an element's style is correct?
options:
- element.style.color = 'red' modifies an inline style
- element.className = 'active' adds a class without overwriting existing classes
- element.setAttribute('class', 'new-class') behaves differently from element.className = 'new-class'
- element.style can read every style defined in a CSS file
answer: 0
explain: element.style.xxx modifies an inline style (the style attribute). Assigning to className overwrites all classes. style can only read inline styles; styles from a CSS file must be read with getComputedStyle.
```

```quiz
type: choice
exam: true
q: Which statement about the dataset property is correct?
options:
- element.dataset.userName corresponds to the data-username attribute in HTML
- dataset can hold arbitrary JavaScript objects
- element.dataset is read-only
- The data-id attribute is accessed via element.dataset.Id
answer: 0
explain: dataset maps data-xxx attributes to JS properties using camelCase conversion (data-user-name becomes dataset.userName). dataset can only store strings.
```

## Part 2 · Hands-on

```quiz
type: js
exam: true
q: Given the HTML <ul id="colours"><li>Red</li><li>Blue</li><li>Green</li></ul>, write a function highlightFirst() that adds the class "highlight" to the first li inside #colours and removes "highlight" from the other li elements.
func: highlightFirst
starter: |
  function highlightFirst() {
      // add highlight to the first li and remove it from the others
  }
html: |
  <ul id="colours">
    <li>Red</li>
    <li>Blue</li>
    <li>Green</li>
  </ul>
checks:
- (highlightFirst(), document.querySelector('#colours li').classList.contains('highlight') && !document.querySelector('#colours li:nth-child(2)').classList.contains('highlight') && !document.querySelector('#colours li:nth-child(3)').classList.contains('highlight'))
hint: const lis = document.querySelectorAll('#colours li'); lis.forEach((li, i) => { if(i===0) li.classList.add('highlight'); else li.classList.remove('highlight'); });
explain: Walk every li; add highlight at index 0 and remove it from the rest. classList's add/remove methods are the standard way to manage classes.
```

```quiz
type: js
exam: true
q: Given the HTML <div id="box"></div>, write a function createCard(title, content) that creates a card div element, gives it the class "card", and puts an h3 (with text title) and a p (with text content) inside it. Then append it to #box and return the created card element.
func: createCard
starter: |
  function createCard(title, content) {
      // create the card element and append it to #box
  }
html: |
  <div id="box"></div>
checks:
- (function(){const card=createCard("Title","Content");return card.className==="card"&&card.querySelector('h3').textContent==="Title"&&card.querySelector('p').textContent==="Content"&&document.querySelector('#box').contains(card);})()
hint: const card = document.createElement('div'); card.className='card'; card.innerHTML='<h3>'+title+'</h3><p>'+content+'</p>'; box.appendChild(card); return card;
explain: Building a composite element dynamically: createElement for the container, set its class, fill the children with innerHTML, appendChild, then return it. Note that title and content are trusted data here; in real projects, watch out for XSS.
```

## Part 3 · Mini-project

```quiz
type: project
exam: true
q: Given the HTML <table id="data-table"></table>, write a function renderTable(data) where data is an array [{name, score, grade}]. Render a table into #data-table: the thead contains one tr with th cells for Name, Score and Grade, and the tbody has one tr for each data object. Rows whose grade is 'A' or 'B' get the class "excellent"; all other rows get the class "normal".
func: renderTable
starter: |
  function renderTable(data) {
      // render the table into #data-table
  }
html: |
  <table id="data-table"></table>
checks:
- (function(){renderTable([{name:"Alice",score:95,grade:"A"},{name:"Bob",score:70,grade:"C"},{name:"Carol",score:88,grade:"B"}]);return document.querySelectorAll('#data-table tbody tr').length===3&&document.querySelectorAll('#data-table tbody tr.excellent').length===2&&document.querySelector('#data-table tbody tr.normal')!==null;})()
hint: Create the thead and tbody first. Append a tr to the thead containing three th cells. Walk the data to build tr rows, and based on the grade add either the excellent class or the normal class.
explain: A combined DOM exercise: build the table structure (thead/tbody), create rows from the data, and add classes conditionally. This is the standard implementation for rendering a data table.
```
