# Chapter 1 · Canvas Drawing · Big Quiz

> 8 questions. This chapter answers: "how do you draw in tkinter, how do you make it move, and how do you place an image so it actually stays visible?"
> **You must answer every question correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: In a tkinter Canvas coordinate system, where is (0, 0) located, and which way does the y-axis point?
options:
- Bottom-left corner, y goes up
- Top-left corner, y goes down
- Centre, y goes up
- Bottom-right corner, y goes up
answer: 1
explain: The Canvas coordinate origin sits in the top-left corner, with x growing to the right and y growing downwards. This differs from the Cartesian system in mathematics, where y grows upward. Rectangle and oval coordinates both follow this rule.
```

```quiz
type: choice
q: Which line draws a square that is "transparent inside with only a black border" (top-left 10,10, bottom-right 60,60)?
options:
- canvas.create_rectangle(10, 10, 60, 60, fill="black")
- canvas.create_rectangle(10, 10, 60, 60)
- canvas.create_rectangle(10, 10, 60, 60, fill="", outline="black")
- canvas.create_rectangle(10, 10, 60, 60, outline="")
answer: 2
explain: For a transparent interior you must write fill="" explicitly, and for a black border you must write outline="black". A is solid black; B is transparent with a black border but only by default; D is a borderless transparent frame that is almost invisible.
```

```quiz
type: choice
q: Which code keeps the image visible on the canvas instead of letting it disappear through garbage collection?
options:
- Define img as a local variable inside a function and call create_image
- Store img as a global variable and then call create_image
- Use del img to delete the reference
- Convert the image to a string and paste that
answer: 1
explain: If a PhotoImage object is referenced only by a local variable and has no other reference after the function ends, Python's GC reclaims it and the image goes blank without raising an error. You must keep a reference: make it global, attach it to canvas.image, or store it as self.img.
```

```quiz
type: choice
q: To make the shape with ID 5 "move 20 pixels right and 10 pixels down", which is correct?
options:
- canvas.coords(5, 20, 10)
- canvas.move(5, 20, 10)
- canvas.itemconfig(5, x=20, y=10)
- canvas.delete(5, 20, 10)
answer: 1
explain: move(id, dx, dy) is relative movement, i.e. "take a few more steps". coords is absolute positioning and needs the full x1,y1,x2,y2; itemconfig changes properties such as fill and outline; delete only accepts an ID.
```

```quiz
type: choice
q: When drawing a line in a drawing pad, which mouse event is used while the mouse is being dragged?
options:
- <ButtonPress-1>
- <B1-Motion>
- <ButtonRelease-1>
- <Motion>
answer: 1
explain: <B1-Motion> fires while the left button is held down and the mouse moves, triggering at high frequency. Each time it fires, you draw a short line from the "previous point" to the "current point", which together form a stroke. ButtonPress-1 fires only at the moment of pressing, ButtonRelease-1 at the moment of release, and <Motion> is movement with no button held.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "target" shape: a 400x300 white canvas. Draw three concentric circles (ovals) whose bounding boxes are (150,50)-(250,150), (170,70)-(230,130) and (190,90)-(210,110), filled with "red", "white" and "red" respectively. Then add a borderless rectangle filled with "green" from (20,20) to (100,60), and a blue polyline from (10,180) to (120,180) to (120,280) with a line width of 3. Hint: use create_oval for ovals; a polygon closes automatically. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  canvas = tk.Canvas(root, width=400, height=300, bg="white")
  canvas.pack()

  # Draw the target here: three concentric circles + one rectangle + one polyline
checklist:
- The three ovals are filled red, white and red in that order
- The three ovals have the correct bounding-box coordinates and form a concentric layout
- The rectangle is filled green and has no border
- The polyline is blue, width 3, with the correct vertices
- mainloop was called
```

```quiz
type: local
q: Build a "colour-changing drawing pad": a 500x400 white canvas. Add three colour buttons labelled "Red", "Green" and "Blue"; clicking one changes the pen colour to match (use a global pen_color plus a lambda callback). While dragging, draw a line in that colour with a width of 2. Tag every stroke with "stroke" and add a "Clear" button that deletes only the strokes (nothing else on the canvas, and in this example there is nothing else). Hint: use a global variable to remember the previous point last_x/last_y and bind the three mouse events. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Colour-Changing Pad")
  canvas = tk.Canvas(root, width=500, height=400, bg="white")
  canvas.pack()

  pen_color = "black"
  last_x, last_y = None, None

  # Add the three colour buttons + the Clear button + bind the mouse events
checklist:
- There are three colour buttons that switch the pen colour when clicked
- Dragging draws a line in the chosen colour with width 2
- The Clear button works (use delete("stroke") to remove only the strokes)
- A global variable records the previous point
- A lambda callback was used
- mainloop was called
```

## Part 3 · Mini Project

```quiz
type: project
q: Build a "complete drawing tool": a 600x500 white canvas with a row of buttons at the top (Red, Blue, Green, Black, Clear). Clicking a colour button switches the pen colour. Drag the mouse to draw a line in that colour with a width of 3. Requirements: 1) tag every stroke "stroke" so the Clear button deletes only strokes; 2) add a "Text" feature — once the "Write Text" button is clicked, any further click on the canvas writes a blue line of text saying "Hello" at that position, centred (use create_text, font=("Arial", 18)); 3) add a "Circle" feature — once the "Draw Circle" button is clicked, draw an oval at the centre of the canvas with bounding box (250,200)-(350,300), filled orange. Hint: use a global state variable called mode to track whether you are in "draw", "text" or "circle", and branch on it inside the mouse-event handlers. Note — a window can't open inside a web page, so click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import tkinter as tk

  root = tk.Tk()
  root.title("Drawing Tool")

  canvas = tk.Canvas(root, width=600, height=500, bg="white")
  canvas.pack()

  pen_color = "black"
  last_x, last_y = None, None
  mode = "draw"   # draw / text / circle

  def set_mode(m):
      global mode
      mode = m

  def set_color(c):
      global pen_color
      pen_color = c

  def on_press(event):
      global last_x, last_y
      # Handle each mode: draw / text / circle

  def on_drag(event):
      global last_x, last_y
      # Join the segments in draw mode

  def on_release(event):
      global last_x, last_y
      last_x, last_y = None, None

  def clear():
      # Delete only the strokes

  # Button area + bind the events
checklist:
- The window is 600x500 with a white canvas
- The colour buttons switch the pen colour
- Dragging draws a line in the chosen colour with width 3
- Clear removes only the strokes (using the tag "stroke")
- In "Write Text" mode a centred blue "Hello" in Arial 18 is written where you click
- In "Draw Circle" mode an orange oval with the correct bounding box is drawn in the centre
- A global mode variable distinguishes the three modes
- The three mouse events are bound and global is used
- mainloop was called
```
