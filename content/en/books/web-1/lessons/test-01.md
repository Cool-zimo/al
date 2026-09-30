# Chapter 1 · How the Browser Turns Text into a Page · Big Quiz

> 8 questions. This chapter is about "how to write HTML structure and express semantics".
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Which statement about the division of labour between HTML, CSS and JavaScript is correct?
options:
- HTML handles presentation, CSS handles structure and JS handles behaviour
- HTML handles structure (semantics), CSS handles presentation and JS handles behaviour
- The three are exactly the same and have no division of labour
- HTML only handles text and CSS only handles colour
answer: 1
explain: HTML is structure and semantics, CSS is presentation, and JS is behaviour and interaction; each does its own job.
```

```quiz
type: choice
q: Where should DOCTYPE be placed?
options:
- Inside the body
- Between the head and the body
- At the very start of the document, with no blank line or space before it
- Anywhere is fine
answer: 2
explain: DOCTYPE is a document-type declaration and must come at the very start of the document, otherwise the browser may enter quirks mode.
```

```quiz
type: choice
q: What do h1-h6 express?
options:
- Font size
- The hierarchical relationship of the content (semantics)
- Text colour
- Whether the text is bold
answer: 1
explain: h1-h6 denote heading levels; they are semantic markers, and font size is only the default rendering.
```

```quiz
type: choice
q: You want to bold a piece of "important" text and have a screen reader announce its importance. Which should you use?
options:
- `<b>`
- `<i>`
- `<strong>`
- `<span>`
answer: 2
explain: strong expresses semantic importance and a screen reader adds vocal weight accordingly; b is only an appearance.
```

```quiz
type: choice
q: Which statement about an image's alt attribute is correct?
options:
- alt is optional
- alt is only shown when the image fails to load
- Informational images must have an alt description, as it affects accessibility and communication
- alt is used to set the image size
answer: 2
explain: alt is alternative text that serves three scenarios: load failure, screen reading and search engines.
```

## Part 2 · Hands-on

```quiz
type: html
q: Write a complete minimal HTML skeleton: doctype, html (lang "en"), head and body. Inside the head put a meta charset="UTF-8" and a title with the content "Alice's CV". Inside the body put an h1 with the content "Hello" and a p with the content "This is my CV".
starter: |
  <!DOCTYPE html>
  <html lang="en">
  </html>
checks:
- document.querySelectorAll('head').length === 1
- document.querySelectorAll('body').length === 1
- document.querySelector('meta[charset]') !== null
- document.querySelector('meta[charset]').getAttribute('charset').toUpperCase() === 'UTF-8'
- document.querySelector('title').textContent.trim() === 'Alice\'s CV'
- document.querySelector('h1').textContent.trim() === 'Hello'
- document.querySelector('p').textContent.trim() === 'This is my CV'
hint: Inside the html, place head and body side by side; put meta then title inside the head, and h1 then p inside the body.
explain: The full skeleton requires head and body to sit directly under html, with each tag's content matching exactly.
```

```quiz
type: html
q: Write an address block: a p with three lines of text, "100 Century Avenue, Pudong", "Shanghai" and "Postcode 200120", separated by br, with the p carrying the class "addr".
starter: |
  <p class="addr">
  </p>
checks:
- document.querySelectorAll('p.addr').length === 1
- document.querySelectorAll('br').length === 2
- document.querySelector('p.addr').textContent.replace(/\s+/g, '') === '100CenturyAvenue,PudongShanghaiPostcode200120'
hint: Two line breaks need two br tags, linking the three lines of text in order.
explain: br provides line breaks within the p, and the concatenated text should match the expected result.
```

## Part 3 · Mini project

```quiz
type: project
q: Build a "personal introduction for Alice" page skeleton: it should contain an h1 with the content "Alice", an h2 with the content "Front-end engineer", and two p elements with the content "Lives in Beijing" and "Loves programming and open source". Use meaningful tags to express the hierarchy; no styling is required.
checklist:
- Uses h1 as the main title with the exact content "Alice"
- Uses h2 as the subtitle with the exact content "Front-end engineer"
- Has two p tags with the content "Lives in Beijing" and "Loves programming and open source"
- The structure is correct: h1, h2 and the two p elements are all inside the body
starter: |
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Alice's personal introduction</title>
    </head>
    <body>
    </body>
  </html>
```
