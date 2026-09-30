# Chapter 3 · Giving the Page Structure · Big Quiz

> 8 questions. This chapter is about "how to organise content structure with the right tags".
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Why is ul + li recommended for a navigation menu instead of a pile of divs?
options:
- A ul automatically becomes horizontal
- ul + li is semantically a set of parallel options that a screen reader can recognise
- A div cannot contain an a tag
- A ul is quicker to write
answer: 1
explain: List semantics express "a set of parallel items", and a screen reader can announce the number of items - something div cannot do.
```

```quiz
type: choice
q: Which tag should be used for a table's header cells?
options:
- `<td>`
- `<th>`
- `<tr>`
- `<thead>`
answer: 1
explain: th is the header cell; it carries semantics and is bold and centred by default. thead is the header section, not the cell itself.
```

```quiz
type: choice
q: Which statement about table-based layout is correct?
options:
- Table layout is the most modern layout method
- Tables should only be used for tabular data and must not be used as a layout tool
- Table layout offers the best accessibility
- Tables are simpler than flex
answer: 1
explain: Tables are only suitable for tabular data; layout should use flex or grid. Using a table for layout misleads semantically.
```

```quiz
type: choice
q: What is the main reason for setting both width and height on an img?
options:
- To make the image sharper
- To let the browser reserve space in advance and avoid a layout shift after loading
- To reduce the image file size
- width and height are required attributes
answer: 1
explain: Reserving the width and height in advance prevents the page from reflowing and jumping once the image has loaded; they are not required.
```

```quiz
type: choice
q: Which statement about semantic tags is correct?
options:
- Semantic tags are only decorative and serve no real purpose
- Semantic tags help screen readers and search engines understand the structure
- Semantic tags render completely differently from a div
- A page may have any number of main elements
answer: 1
explain: Semantics provide structural and semantic information, improving accessibility and SEO. main should appear only once per page.
```

## Part 2 · Hands-on

```quiz
type: html
q: Write a navigation block: a nav containing a ul, which contains three li elements. Each li holds an a tag with the link text "Home", "About" and "Contact", and href values "/", "/about" and "/contact".
starter: |
  <nav>
  </nav>
checks:
- document.querySelector('nav > ul') !== null
- document.querySelectorAll('li').length === 3
- document.querySelectorAll('a').length === 3
- Array.from(document.querySelectorAll('a')).map(a => a.textContent.trim()).join(',') === 'Home,About,Contact'
- Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href')).join(',') === '/,/about,/contact'
hint: nav directly contains ul, ul contains three li elements, and each li contains one a.
explain: The navigation hierarchy requires the nav > ul > li > a relationships to be correct, with both text and links matching.
```

```quiz
type: html
q: Write a form with method "post" and action "/submit". Inside the form put a label with for "phone" and text "Phone", an input of type "tel" with id "phone" and name "phone", and finally a button of type "submit" with the text "Submit".
starter: |
  <form method="post" action="/submit">
  </form>
checks:
- document.querySelector('form').getAttribute('method') === 'post'
- document.querySelector('form').getAttribute('action') === '/submit'
- document.querySelector('label').getAttribute('for') === 'phone'
- document.querySelector('input').getAttribute('type') === 'tel'
- document.querySelector('input').getAttribute('id') === 'phone'
- document.querySelector('input').getAttribute('name') === 'phone'
- document.querySelector('button').getAttribute('type') === 'submit'
- document.querySelector('button').textContent.trim() === 'Submit'
hint: The label's for matches the input's id, and the button needs a type and text.
explain: The form needs the correct method and action, a label associated with its input, and a submit button.
```

## Part 3 · Mini project

```quiz
type: project
q: Build a "skills list" block: a section containing an h2 with the content "My skills" and an unordered list ul. Inside the ul put four li elements: HTML, CSS, JavaScript and Python. The semantic structure must be correct, with the h2 first and the ul second inside the section.
checklist:
- Uses section as the container
- section contains an h2 with the exact content "My skills"
- section contains a ul that sits directly inside it
- ul contains four li elements with the content HTML, CSS, JavaScript and Python
- The hierarchy is section > h2 and section > ul > li
starter: |
  <section>
  </section>
```
