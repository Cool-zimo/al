# Chapter 4 · Layout and Typography · Big Quiz

> 8 questions. This chapter is about "how to put page elements where you want them": from the three display forms to clearing floats, from position-based placement to Flex layout.
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Which of the following elements is inline by default?
options:
- <div>
- <p>
- <span>
- <section>
answer: 2
explain: span is inline by default; div, p and section are all block-level.
```

```quiz
type: choice
q: Which statement about the gaps between inline-block elements is correct?
options:
- It is a browser bug that cannot be removed
- The gap comes from newline characters in the HTML being parsed as spaces
- The gap is caused by default margin values
- The gap disappears automatically once width is set
answer: 1
explain: Newlines and spaces between inline-block elements are rendered as text spaces. The fix is to set font-size: 0 on the parent or use Flex layout instead.
```

```quiz
type: choice
q: Which is the most general way to clear floats without polluting the HTML?
options:
- Give the parent a fixed height
- Insert an empty div after the floats and set clear: both on it
- Use the clearfix pseudo-element (::after + clear: both)
- Give the parent a margin-top
answer: 2
explain: clearfix uses the ::after pseudo-element to clear floats without inserting extra nodes into the HTML and without clipping content, making it the most general solution.
```

```quiz
type: choice
q: For an element with position: absolute, if every ancestor has position: static, what does it position against?
options:
- Its parent element
- The body element
- The viewport
- The html element
answer: 2
explain: absolute walks up the ancestor chain looking for the nearest positioned (non-static) ancestor; if it finds none it uses the initial containing block, which is the viewport.
```

```quiz
type: choice
q: In a Flex layout, what is the default value of align-items?
options:
- flex-start
- center
- stretch
- baseline
answer: 2
explain: The default value of align-items is stretch, meaning items stretch to fill the container along the cross axis.
```

## Part 2 · Hands-on

```quiz
type: css
q: Arrange three buttons (.btn) horizontally in a row using Flex, each 100px wide, 40px tall and with 8px of left and right margin.
html: |
  <div class="btn-group">
    <button class="btn">Save</button>
    <button class="btn">Cancel</button>
    <button class="btn">Submit</button>
  </div>
starter: |
  .btn-group {
  }
  .btn {
  }
checks:
- getComputedStyle(document.querySelector('.btn-group')).display === 'flex'
- getComputedStyle(document.querySelector('.btn-group')).justifyContent === 'center'
- getComputedStyle(document.querySelector('.btn')).width === '100px'
- getComputedStyle(document.querySelector('.btn')).height === '40px'
- getComputedStyle(document.querySelector('.btn')).marginLeft === '8px'
- getComputedStyle(document.querySelector('.btn')).marginRight === '8px'
hint: Make the btn-group display: flex with justify-content: center to centre the group, then set the width, height and margins on btn.
explain: The Flex container centres the whole button group horizontally, while each button gets a fixed size and spacing for a tidy row.
```

```quiz
type: css
q: Build an image-plus-text card: .card is a relatively positioned container (300px wide, 180px tall, a 1px grey border); .badge is an absolutely positioned label (top: 10px, right: 10px, red background, white text, padding 4px 8px).
html: |
  <div class="card">
    <span class="badge">Best seller</span>
    <p>This is a short product description</p>
  </div>
starter: |
  .card {
  }
  .badge {
  }
checks:
- getComputedStyle(document.querySelector('.card')).position === 'relative'
- getComputedStyle(document.querySelector('.card')).width === '300px'
- getComputedStyle(document.querySelector('.card')).height === '180px'
- getComputedStyle(document.querySelector('.badge')).position === 'absolute'
- getComputedStyle(document.querySelector('.badge')).top === '10px'
- getComputedStyle(document.querySelector('.badge')).right === '10px'
- getComputedStyle(document.querySelector('.badge')).backgroundColor === 'rgb(255, 0, 0)'
- getComputedStyle(document.querySelector('.badge')).color === 'rgb(255, 255, 255)'
hint: Give the card position: relative as the reference point and the badge position: absolute to pin it to the top-right corner, then set the colour and padding.
explain: relative plus absolute is the classic combo: the badge positions against the card's top-right corner to create a corner-label effect.
```

## Part 3 · Mini project

```quiz
type: project
q: Build a responsive navigation bar with Flex: on the left is the brand name (.brand), on the right are the navigation links (.nav-links, using ul > li > a). The navbar uses Flex with space-between justification, and flex: 1 distributes the remaining space evenly among the links. Use the correct semantic tags (nav, ul, li) and keep the styling consistent.
starter: |
  <nav class="navbar">
    <span class="brand">Alice's Blog</span>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Articles</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>
checklist:
- Uses semantic tags nav, ul, li and a
- The navbar uses Flex layout with space-between justification
- The link area uses Flex to distribute space evenly
- The navbar has a background colour and appropriate padding
- The links have a hover effect or at least a clear style
```
