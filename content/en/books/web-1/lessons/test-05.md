# Chapter 5 · Responsive Design and Motion · Big Quiz

> 8 questions. This chapter is about "how to make a page look good on every device and how to make it move": responsive design, the viewport, media queries, relative units, Grid layout and animation.
> **You must answer all of them correctly to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: In the viewport meta tag, what does width=device-width do?
options:
- Sets the initial page zoom to 2x
- Tells the browser to use the device's real width as the viewport width
- Prevents the user from zooming the page
- Sets the minimum page width to 980px
answer: 1
explain: width=device-width tells the browser to render at the device's actual width, which is the basic configuration for any mobile page.
```

```quiz
type: choice
q: Which statement about rem and em is correct?
options:
- Both rem and em are relative to the root element's font size
- rem is relative to the root element's font size; em is relative to the current element's font size, and nested em compounds
- em is relative to the viewport width and rem is relative to the viewport height
- rem can only be used for font-size and em can only be used for margin
answer: 1
explain: rem is always relative to the html root's font size; em is relative to the current element's font size and compounds level by level when nested.
```

```quiz
type: choice
q: What is the core difference between Grid and Flex?
options:
- Grid is only for images and Flex is only for text
- Grid is two-dimensional (controlling rows and columns at once); Flex is one-dimensional (one row or one column at a time)
- Grid requires JavaScript and Flex is pure CSS
- The two are exactly the same
answer: 1
explain: Grid manages two dimensions — rows and columns — at once, which suits an overall page skeleton; Flex manages one direction at a time, which suits arranging a set of elements.
```

```quiz
type: choice
q: Which property is not suitable for a transition?
options:
- background-color
- opacity
- display
- transform
answer: 2
explain: display is a discrete property (there is no in-between between none and block), so it cannot be interpolated and the transition has no effect. Use opacity + visibility or max-height instead.
```

```quiz
type: choice
q: Which media query condition does the mobile-first responsive strategy usually use?
options:
- max-width
- min-width
- only screen
- device-width
answer: 1
explain: Mobile-first writes the base styles first (for narrow screens), then uses min-width breakpoints to enhance the layout progressively on wider screens.
```

## Part 2 · Hands-on

```quiz
type: css
q: Build a responsive image: maximum width 100%, automatic height to keep the aspect ratio, 12px border radius, and a hover effect that scales it to 1.05 times (transform: scale(1.05)) with a 0.3s ease transition. (Test the hover effect yourself in the browser; the automatic check only verifies the transition setup.)
html: |
  <img src="avatar.jpg" class="avatar">
starter: |
  .avatar {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }
checks:
- getComputedStyle(document.querySelector('.avatar')).maxWidth === '100%'
- getComputedStyle(document.querySelector('.avatar')).borderRadius === '12px'
- getComputedStyle(document.querySelector('.avatar')).transition.startsWith('transform 0.3s')
hint: Set transform: scale(1.05) in the hover state and add a transition that watches transform on the element itself.
explain: Fluid image scaling plus a hover zoom effect — transform performs better than changing width or height directly.
```

```quiz
type: css
q: Use Grid to build a three-column card grid: .grid uses repeat(3, 1fr) for three equal columns and a gap of 20px. Each .card has a light-grey background, 16px of padding and an 8px border radius.
html: |
  <div class="grid">
    <div class="card">Front-end</div>
    <div class="card">Back-end</div>
    <div class="card">DevOps</div>
  </div>
starter: |
  .grid {
  }
  .card {
  }
checks:
- getComputedStyle(document.querySelector('.grid')).display === 'grid'
- getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length === 3
- Math.abs(parseFloat(getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ')[0]) - parseFloat(getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ')[2])) < 2
- getComputedStyle(document.querySelector('.grid')).gap === '20px'
- getComputedStyle(document.querySelector('.card')).padding === '16px'
- getComputedStyle(document.querySelector('.card')).borderRadius === '8px'
hint: grid uses repeat(3, 1fr) to create three equal columns, gap sets the spacing and card sets the padding and radius.
explain: Grid's repeat function combined with the fr unit quickly builds an equal-column grid, and gap gives uniform spacing.
```

## Part 3 · Mini project

```quiz
type: project
q: Build a responsive product showcase page using Grid: a single column on phones (grid-template-columns: 1fr) and three columns (repeat(3, 1fr)) at screen widths >= 768px. Each product card contains an image (a div placeholder is fine), a title and a price, with a hover lift effect (transform: translateY(-4px)). Use correct semantic tags and consistent spacing.
starter: |
  <section class="products">
    <article class="product-card">
      <div class="img-placeholder"></div>
      <h3>Wireless earbuds</h3>
      <p class="price">£299</p>
    </article>
    <article class="product-card">
      <div class="img-placeholder"></div>
      <h3>Mechanical keyboard</h3>
      <p class="price">£599</p>
    </article>
    <article class="product-card">
      <div class="img-placeholder"></div>
      <h3>Ergonomic chair</h3>
      <p class="price">£1299</p>
    </article>
  </section>
checklist:
- Uses semantic tags section, article and h3
- Single-column layout by default, switching to three columns at the wide breakpoint
- Cards have a hover lift effect
- Cards have consistent padding and border radius
- The image placeholder has a fixed aspect ratio or a minimum height
- Prices use the £ symbol
```
