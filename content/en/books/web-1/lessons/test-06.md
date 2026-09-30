# Chapter 6 · Capstone · The Big Quiz

> 8 questions. This chapter brings together everything from the first five chapters in the "Personal CV Page" project — from design planning all the way to going live.
> **You only pass this chapter if you get every question right.**

## Part 1 · Multiple choice

```quiz
type: choice
q: Which statement about CSS custom properties (variables) is correct?
options:
- CSS variables can only be defined inside :root
- CSS variables are defined with --name and referenced with var(--name)
- CSS variables cannot be used as values inside a media query
- CSS variables always trigger a layout reflow
answer: 1
explain: A custom property is declared with a -- prefix and read with the var() function. It can be defined and overridden inside any selector, and it can be reassigned inside a media query.
```

```quiz
type: choice
q: In JavaScript, what does addEventListener do?
options:
- Adds a CSS class name to an element
- Watches for a specified event and runs a callback when that event fires
- Changes the HTML content of an element
- Sends a network request
answer: 1
explain: addEventListener registers an event listener on an element; when the named event (click, scroll, and so on) occurs, the callback you passed in is executed.
```

```quiz
type: choice
q: What special rule does GitHub Pages enforce about the repository name?
options:
- The repository must be named "project"
- A repository named in the username.github.io format is published directly to the root domain
- The repository must be private
- The repository must not contain a README file
answer: 1
explain: When the repository is named username.github.io, GitHub Pages automatically publishes it at https://username.github.io. An ordinary repository name is published under a subpath instead.
```

```quiz
type: choice
q: When toggling dark mode, why is "CSS variables + a class switch" the recommended approach?
options:
- Because JavaScript cannot modify CSS directly
- Because flipping one class is enough; every property that uses those variables is recalculated automatically
- Because CSS variables can only be defined with JavaScript
- Because toggling a class is faster than changing styles directly
answer: 1
explain: By toggling a class on the body (such as dark-mode), the custom properties under that class get new values, and every property that references them updates automatically — at very low maintenance cost.
```

```quiz
type: choice
q: According to the pre-launch checklist, which of the following is NOT an accessibility requirement?
options:
- Images have an alt attribute
- Every interactive element can be reached with the Tab key
- The page must have impressive, flashy animations
- Buttons carry understandable text
answer: 2
explain: Fancy animations are not an accessibility requirement; excessive motion can actually cause vestibular issues. Accessibility is about alt text, keyboard navigation, contrast, semantic tags and so on.
```

## Part 2 · Hands-on exercises

```quiz
type: js
q: Write a function formatDate(year, month, day) that joins three numbers into a date string like "2026-09-29", padding the month and day with a leading zero when they are less than ten.
func: formatDate
starter: |
  function formatDate(year, month, day) {
      return "";
  }
cases: |
  2026, 9, 29 -> "2026-09-29"
  2026, 1, 5 -> "2026-01-05"
  1999, 12, 31 -> "1999-12-31"
hint: If the month or day is below 10, pad it with a leading zero.
explain: Use String.padStart(2, '0') or a conditional check before concatenating, so the month and day are always two digits.
```

```quiz
type: css
q: Build dark mode with CSS variables plus a class switch. Define --bg-dark as #1a1a2e and --text-dark as #e0e0e0. When an element carries the dark-mode class, its background becomes --bg-dark and its text becomes --text-dark. Also define the light defaults --bg-light as #f8f9fa and --text-light as #333333.
html: |
  <div class="dark-mode">
    <h1>My CV</h1>
    <p>This is a paragraph of body text.</p>
  </div>
starter: |
  :root {
    --bg-light: #f8f9fa;
    --text-light: #333333;
    --bg-dark: #1a1a2e;
    --text-dark: #e0e0e0;
  }
  body {
    background: var(--bg-light);
    color: var(--text-light);
    transition: background 0.3s, color 0.3s;
  }
checks:
- getComputedStyle(document.querySelector('.dark-mode')).backgroundColor === 'rgb(26, 26, 46)'
- getComputedStyle(document.querySelector('.dark-mode')).color === 'rgb(224, 224, 224)'
hint: The light mode is active by default; check that body's background and color are reading from the light variables.
explain: Once the custom properties are defined, reference them with var(). The light variables apply by default; switching in the dark-mode class switches to the dark ones.
```

## Part 3 · Mini project

```quiz
type: project
q: Build the final version of your personal CV page: a semantic HTML skeleton (header / main / section / article / footer), a unified CSS-variable design system, a responsive layout (single column on phones, two columns on wide screens), a dark-mode toggle button implemented with JavaScript class switching, and a navigation highlight effect. Deploy it to GitHub Pages and verify its accessibility.
starter: |
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My CV</title>
  </head>
  <body>
  </body>
  </html>
checklist:
- Uses semantic tags such as header, main, section, article and footer
- Manages colour and spacing consistently through CSS variables
- Implements a responsive layout (at least a phone breakpoint and a desktop breakpoint)
- Implements dark-mode toggling (button + JavaScript + a CSS class)
- Navigation links have a hover/focus highlight effect
- Images have alt attributes and links have descriptive text
- Has been deployed to GitHub Pages and is reachable
- Shows no horizontal scrolling at phone sizes
```
