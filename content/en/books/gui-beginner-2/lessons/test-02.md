# Chapter 2 · Animation and Timing · Big Quiz

> 8 questions. This chapter answers: "how do you make a shape move by itself, why does the same animation run at different speeds on different computers, and how do you control a square with the keyboard?"
> **You must answer every question correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Why must a tkinter program avoid using while True with time.sleep to produce animation?
options:
- while True raises a syntax error
- time.sleep loses Python's precision
- while True hogs the event loop, freezing the interface so it cannot redraw or respond
- tkinter does not support loop statements
answer: 2
explain: tkinter is a single-threaded, event-driven model, and mainloop is responsible for fetching events, processing them and redrawing. while True blocks that loop so it cannot escape; the window cannot redraw and cannot respond to the mouse or the close button. The correct approach is to use after() to register future tasks without blocking.
```

```quiz
type: choice
q: To make the ball bounce back when it hits the right wall (canvas width 400), which is correct?
options:
- if x2 > 400: dx = dx + 1
- if x2 >= 400: dx = -dx
- if x2 >= 400: dx = abs(dx)
- if x2 >= 400: dy = -dy
answer: 1
explain: A bounce reverses the velocity: dx = -dx. A is acceleration, not a bounce; C's abs keeps the velocity positive (always right), which is not a bounce; D changes dy, which is the vertical direction and unrelated to a horizontal bounce. Using >= tolerates the ball overshooting the boundary slightly.
```

```quiz
type: choice
q: An animation "moves 3 pixels per frame". On a 60-frames-per-second machine it moves 180 pixels per second. If the same fixed-step code runs on a 30-frames-per-second machine, how many pixels per second does the ball move?
options:
- 3
- 30
- 90
- 180
answer: 2
explain: Fixed step means 3px per frame. At 30 frames per second the machine produces 30 frames per second, so the ball moves 3*30 = 90 pixels per second, half as fast as at 60 fps. This is exactly the "speed changes with frame rate" problem that delta time solves.
```

```quiz
type: choice
q: When using delta time for a constant-speed animation, how should the movement per frame be calculated?
options:
- Speed divided by the frame count
- Speed multiplied by dt (current time minus the previous frame's time, in seconds)
- Speed plus dt
- Always a fixed 4 pixels
answer: 1
explain: Delta time (dt) = current time minus the previous frame's time. Movement = speed * dt, with units of "pixels per second * seconds = pixels". A large dt (long interval) means a large movement; a small dt means a small movement; the average speed stays constant and is consistent across devices.
```

```quiz
type: choice
q: Which is the correct way to bind "pressing the left arrow key" to the move_left function?
options:
- root.bind("<Left>", move_left())
- root.bind("<Left>", move_left)
- root.bind("Left", move_left)
- root.bind("<Left>", lambda: move_left)
answer: 1
explain: bind expects a function object, so move_left is written without parentheses. A calls it immediately and passes the return value in; C is missing the angle brackets, so the key name format is wrong; D's lambda does not pass the event parameter, so triggering it raises TypeError.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "move then stop" square: a 400x200 canvas with an orange rectangle that moves from (10,80) to (350,80), 10 pixels per step, one step every 30 milliseconds. When x reaches 350 it stops automatically (no further after). Hint: in move_step, use canvas.coords to read the coordinates and return without re-registering once the boundary is passed. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  canvas = tk.Canvas(root, width=400, height=200, bg="white")
  canvas.pack()

  rect = canvas.create_rectangle(10, 80, 60, 130, fill="orange")

  # Move recursively with after and stop at the boundary
checklist:
- after is used recursively (not while True / time.sleep)
- Each move is 10 pixels with a 30ms interval
- It stops once x reaches about 350 (no further after is scheduled)
- mainloop was called
```

```quiz
type: local
q: Build a "gravity ball": a 400x400 canvas with a green ball starting at (190,10 to 230,50) that falls. Each frame add 0.5 to dy (gravity) so it accelerates downwards; when it hits the floor (y2>=400) reverse dy and multiply by 0.9 (energy loss), simulating a few bounces before coming to rest. Hint: drive it with recursive after(20, ...); stop recursing once dy tends to 0. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  canvas = tk.Canvas(root, width=400, height=400, bg="white")
  canvas.pack()

  ball = canvas.create_oval(190, 10, 230, 50, fill="green")
  dy = 0

  # Each frame: dy += 0.5; on hitting the floor: dy = -dy*0.9
checklist:
- The ball accelerates downward under gravity
- It bounces on the floor, with the speed multiplied by 0.9
- It eventually stops after several bounces (no further after once dy tends to 0)
- after drives it recursively
- mainloop was called
```

## Part 3 · Mini Project

```quiz
type: project
q: Build a "keyboard-controlled pong game": a 500x400 white canvas. The ball is a 20x20 red oval (bounding box 240,190 to 260,210) that initially moves 4 pixels right and 3 pixels down per frame, bouncing off both side walls and both top/bottom walls (dx=-dx / dy=-dy). Use the arrow keys to control an 80x15 blue paddle that moves only horizontally (not vertically), starting at (210,370) in the middle of the bottom, step 15, clamped between 0 and 420. When the ball collides with the paddle (use coords to test whether the ball and paddle intersect), it bounces upward (dy reverses). Add a score display: +10 points each time the ball hits the paddle, shown in real time at the top-left with create_text (blue, Arial 18-point). Drive it with recursive after(20, ...). Hint: collision detection means testing whether two rectangles intersect — ball x2 >= paddle x1, ball x1 <= paddle x2, and ball y2 >= paddle y1. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Pong Game")
  canvas = tk.Canvas(root, width=500, height=400, bg="white")
  canvas.pack()

  ball = canvas.create_oval(240, 190, 260, 210, fill="red")
  paddle = canvas.create_rectangle(210, 370, 290, 385, fill="blue")
  dx, dy = 4, 3
  score = 0
  score_text = canvas.create_text(10, 10, text="Score 0", font=("Arial", 18), fill="blue", anchor=tk.NW)
  paddle_x = 210

  def animate():
      global dx, dy, score
      # Move the ball + bounce off walls + detect paddle collision + update the score

  def on_key(event):
      global paddle_x
      # Move the paddle with the arrow keys, clamped between 0 and 420

  root.bind("<Key>", on_key)
  animate()
  root.mainloop()
checklist:
- The ball moves each frame and bounces off all four walls (dx/dy reverse)
- The arrow keys move the paddle horizontally, step 15, clamped between 0 and 420
- The ball bounces upward when it hits the paddle (dy reverses)
- Collision detection uses coordinate checks for rectangle intersection
- Each paddle hit adds 10 to the score and updates the display
- after(20, ...) drives it recursively, not while/sleep
- The score text is at the top-left, blue, Arial 18-point
- mainloop was called
```
