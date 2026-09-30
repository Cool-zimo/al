# Chapter 5 Test: Canvas

## Part One · Multiple Choice

```quiz
type: choice
q: Which statement about Canvas paths is correct?
options:
- beginPath is optional and has no effect if omitted
- Skipping beginPath causes new and old sub-paths to accumulate on the same path
- The angle of arc is measured in degrees (0-360)
- The path is cleared automatically after each stroke
answer: 1
explain: beginPath must be called or the trajectories accumulate; arc uses radians; stroke does not call beginPath automatically.
```

```quiz
type: choice
q: Which statement about requestAnimationFrame and setInterval is correct?
options:
- requestAnimationFrame loops forever automatically without being called again
- requestAnimationFrame is automatically paused when the tab is sent to the background
- setInterval is perfectly in sync with the screen refresh rate
- cancelAnimationFrame clears the canvas automatically
answer: 1
explain: rAF schedules a single callback and must be called again from inside it; it pauses in background tabs; cancelling only prevents the next callback and does not clear the canvas.
```

```quiz
type: choice
q: When drawing a bar chart on Canvas, where should the top edge of a bar sit?
options:
- padT + plotH + h
- padT + plotH - h
- padT + h
- plotH - padL
answer: 1
explain: The y-axis points downward, so bars grow upward from the axis. The top edge is at padT + plotH - h.
```

```quiz
type: choice
q: Which statement about fillText is correct?
options:
- (x, y) is the top-left corner of the text box
- font and fillStyle must be set before fillText
- measureText returns the text height
- A single Chinese font name is enough to guarantee correct rendering
answer: 1
explain: In immediate mode, styles take effect at the moment fillText is called; (x, y) is the baseline position; Chinese fonts need a fallback list.
```

```quiz
type: choice
q: When drawing an image with drawImage, what must you watch out for?
options:
- Assigning the src is enough to call drawImage immediately afterward
- You must wait until img.onload fires before calling drawImage, otherwise the canvas stays blank
- drawImage can only draw same-origin images
- The image must first be converted to base64
answer: 1
explain: Image loading is asynchronous. Calling drawImage before onload leaves the canvas blank.
```

## Part Two · Hands-on

```quiz
type: js
q: Write a pure function valueToHeight(v, max, plotH) that maps a value v into the plotting area height, returning (v / max) * plotH. With plotH=200 and max=100, v=50 returns 100.
func: valueToHeight
starter: |
  function valueToHeight(v, max, plotH) {
      // (v / max) * plotH
  }
cases: |
  0, 100, 200 -> 0
  50, 100, 200 -> 100
  100, 100, 200 -> 200
  25, 100, 200 -> 50
```

```quiz
type: js
q: Given the HTML `<canvas id="c" width="300" height="200"></canvas>`, write a function drawScene(ctx) that performs one frame of animation logic: clear the whole canvas, then draw a red square moving right starting from x=10. Use the global variable pos (initially 0): each call adds 5 to pos, then sets fillStyle to 'rgb(244, 67, 54)' and fills a 20x20 rectangle at (pos, 80).
func: drawScene
starter: |
  let pos = 0;
  function drawScene(ctx) {
      // pos += 5; clearRect; fillStyle; fillRect
  }
html: |
  <canvas id="c" width="300" height="200"></canvas>
checks:
- (function(){ var ctx = document.querySelector('#c').getContext('2d'); drawScene(ctx); var d = ctx.getImageData(pos + 10, 90, 1, 1).data; return pos === 5 && d[0] > 200 && d[1] < 100 && d[2] < 100; })()
hint: pos += 5; clearRect(0, 0, 300, 200); fillStyle red; fillRect(pos, 80, 20, 20).
explain: Verifies both the per-frame state update and the red square being drawn.
```

## Part Three · Mini Project

```quiz
type: project
q: Build a "Canvas counter square": the page has a button (id="btn") and a canvas (id="c", 300 by 100). When the button is clicked, animate a blue square (20x20, fillStyle 'rgb(33, 150, 243)') smoothly from x=0 to x=200 using requestAnimationFrame: each frame move x by 4, clear the canvas, and redraw; stop and cancel further frames once x reaches 200. Rapid repeated clicks must not start overlapping animations - guard with a boolean isAnimating and only start when no animation is running.
html: |
  <button id="btn">Start</button>
  <canvas id="c" width="300" height="100"></canvas>
starter: |
  // Implement the animation: isAnimating guards against re-entry, each frame does x += 4, clearRect, fillRect, and cancels rAF at the boundary
explain: The core is a re-entry guard plus per-frame clear/redraw and rAF cancellation at the boundary.
```
