# Chapter 2 · CSS Basics · Big Quiz

> 8 questions. This chapter is about "how to write styles, which units to choose, and how boxes are calculated".
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Which statement about external stylesheets is correct?
options:
- An external stylesheet has the highest priority and overrides every other style
- An external stylesheet keeps styles maintained in one place, so a single change updates the whole site, and it can be cached by the browser
- An external stylesheet can only be used once and you cannot include more than one
- An external stylesheet cannot contain colours
answer: 1
explain: The core strengths of an external stylesheet are centralised maintenance, browser caching and separation of structure from style. Inline styles have the highest priority.
```

```quiz
type: choice
q: You want several elements to share the same style. Which selector should you use?
options:
- The id selector
- The tag selector
- The class selector
- The universal selector
answer: 2
explain: A class selector is reusable, so several elements can share one class. An id must be unique.
```

```quiz
type: choice
q: Which statement about em and rem is correct?
options:
- em is relative to the root element and rem is relative to the current element
- em is relative to the current element's font size and compounds when nested; rem is relative to the root element and does not compound
- The two have no difference at all
- rem cannot be used for font sizes
answer: 1
explain: em is relative to the current element and accumulates through nesting; rem is relative to the root element and does not change with nesting.
```

```quiz
type: choice
q: Which statement about the default box model (content-box) is correct?
options:
- width already includes padding and border
- width does not include padding and border, so the actual occupied width is larger
- padding takes up no space
- border is not part of the box model
answer: 1
explain: In content-box, width is only the content width; the actual width must also include the left and right padding and border.
```

```quiz
type: choice
q: Which statement about margin collapse is correct?
options:
- The top and bottom margins of two adjacent block elements are added together
- The top and bottom margins of two adjacent block elements collapse into the larger value
- Left and right margins collapse too
- Margins never collapse
answer: 1
explain: The vertical margins of adjacent block elements merge and take the larger value; left and right margins are added together.
```

## Part 2 · Hands-on

```quiz
type: css
q: Give elements with the class "card" a padding of 16px, a 1px solid border in rgb(224, 224, 224), a border radius of 8px, and set box-sizing to border-box.
html: |
  <div class="card">Card content</div>
starter: |
  .card {
  }
checks:
- getComputedStyle(document.querySelector('.card')).paddingTop === '16px'
- getComputedStyle(document.querySelector('.card')).borderTopWidth === '1px'
- getComputedStyle(document.querySelector('.card')).borderTopColor === 'rgb(224, 224, 224)'
- getComputedStyle(document.querySelector('.card')).borderTopStyle === 'solid'
- getComputedStyle(document.querySelector('.card')).borderRadius === '8px'
- getComputedStyle(document.querySelector('.card')).boxSizing === 'border-box'
hint: padding, border (width, style and colour separately), border-radius and box-sizing.
explain: A card style needs the combined effect of inner padding, the three parts of a border, a radius and the box model setting.
```

```quiz
type: css
q: Give p a font size of 1.125rem (with a root font size of 16px this is 18px), a line height of 1.7, a text colour of rgb(51, 51, 51) and a first-line indent of 2em.
html: |
  <p>Some text that needs formatting</p>
starter: |
  p {
  }
checks:
- getComputedStyle(document.querySelector('p')).fontSize === '18px'
- getComputedStyle(document.querySelector('p')).lineHeight === '30.6px'
- getComputedStyle(document.querySelector('p')).color === 'rgb(51, 51, 51)'
- getComputedStyle(document.querySelector('p')).textIndent === '36px'
hint: 18px x 1.7 = 30.6px; 2em = 36px.
explain: Font size, line height, colour and indent are set separately, with expected values filled in as computed values.
```

## Part 3 · Mini project

```quiz
type: project
q: Write a good-looking style for a "personal profile card": a div with the class "profile" containing an h2 (the name) and a p (the introduction). Requirements: profile has 24px padding, a 1px solid border in rgb(230, 230, 230), a 12px border radius, a background colour of rgb(250, 250, 250), a maximum width of 480px and auto left and right margins for centring. The h2 has a text colour of rgb(0, 121, 107) and a bottom margin of 12px. The p has a text colour of rgb(100, 100, 100) and a line height of 1.6.
checklist:
- profile has 24px of padding and a 12px border radius
- profile has a 1px solid border in rgb(230, 230, 230)
- profile has a background colour of rgb(250, 250, 250), a maximum width of 480px, and is centred with auto left and right margins
- h2 has a text colour of rgb(0, 121, 107) and a bottom margin of 12px
- p has a text colour of rgb(100, 100, 100) and a line height of 1.6
starter: |
  <div class="profile">
    <h2>Alice</h2>
    <p>Front-end developer who loves writing clear, maintainable code.</p>
  </div>
```
