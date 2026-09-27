# Chapter 4 · pygame Basics · Final Quiz

> 8 questions. This chapter answers: why tkinter can't make proper games, how to build and run a pygame window, what the three jobs of a game loop are each frame, how to paste images onto the screen, and how to control the frame rate.
> **You must get all correct to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Regarding "why games use pygame instead of tkinter", which statement is INCORRECT?
options:
- tkinter uses an event-driven model, while games need an active refresh loop every frame
- pygame has a Clock for precise frame control, while tkinter can only approximate with after
- tkinter has built-in sound playback and hardware acceleration, so it's actually better for games
- pygame uses Surface bitmaps for rendering, supports transparent PNGs, and has Rect collision detection
answer: 2
explain: tkinter is precisely the one without sound and with weak hardware acceleration — that's why it struggles with games. pygame's strengths are active refresh loops, precise Clock frame control, Surface bitmap rendering, built-in mixer sound, and Rect collision.
```

```quiz
type: choice
q: Which pygame code below will cause the window to be uncloseable (forcing you to kill the process)?
options:
- The loop has "for event in pygame.event.get():" and checks for QUIT
- The loop calls pygame.display.flip()
- "while running:" only does screen.fill((255,255,255)) and pygame.display.flip(), completely ignoring the event queue
- The end of the loop calls pygame.quit()
answer: 2
explain: pygame requires you to call pygame.event.get() in the loop to drain the event queue and check for QUIT; otherwise the OS's close request is ignored, the window won't close, and the program becomes unresponsive. Ignoring the event queue is the classic "zombie window" problem.
```

```quiz
type: choice
q: In what order should the three steps of a game loop execute each frame?
options:
- Redraw → Handle events → Update state
- Handle events → Update state → Redraw
- Update state → Redraw → Handle events
- Order doesn't matter; any way works
answer: 1
explain: The standard order is handle events → update state → render. Respond to input first, then compute the new state, then draw the latest state on screen. If you render before updating, this frame draws the previous frame's position, causing a one-frame delay.
```

```quiz
type: choice
q: Regarding Surface and blit, which statement is correct?
options:
- A Surface is just a window; loaded images are not Surfaces
- screen.blit(source, (x, y)) means paste the source pixel canvas onto screen at position (x, y)
- blit's job is to "cut out a chunk from the screen"
- After loading an image, no convert is needed; pygame auto-optimizes
answer: 1
explain: A Surface is a pixel canvas; both windows and loaded images are Surfaces. blit pastes source onto dest at the specified position (bit block transfer). After loading an image, you should call convert() or convert_alpha() to convert the pixel format for faster blitting.
```

```quiz
type: choice
q: Regarding pygame.time.Clock and tick, which statement is correct?
options:
- clock.tick(60) means "let the loop run at most 60 times per second", i.e., cap at ~60 frames
- clock.tick() must receive a negative number to take effect
- You can get a stable 60 FPS without calling tick
- tick returns a keyboard key object
answer: 0
explain: Clock usage: call clock.tick(60) at the end of each frame; it inserts delays where needed so the loop frequency stays at or below 60 times per second (~60 FPS), stabilizing the frame rate and yielding CPU time. tick returns the milliseconds elapsed since the last frame, not a key.
```

## Part 2 · Hands-On

```quiz
type: local
q: Write a pygame program: create a 640x480 window with the title "My Window", filled with sky blue (135,206,235). Handle QUIT in the event loop so it closes properly, and call pygame.display.flip() at the end of every frame. Initialization, window creation, event loop, fill, flip, and quit are all required. Note: A window can't open inside a web page — click 'Open in VS Code' to run it (install pygame first).
files: |
  main.py
starter: |
  import pygame

  # init + create window + event loop + fill sky blue + flip + quit
checklist:
- Called pygame.init()
- Window size 640x480
- Title "My Window"
- Background filled with sky blue (135,206,235)
- Handles QUIT event
- Calls flip every frame
- Calls pygame.quit() at the end
```

```quiz
type: local
q: Write a pygame program: 800x600 black window. A white ball (use pygame.draw.circle, center ball_y, radius 20) bounces vertically, adding dy (initial 4) to ball_y each frame, and reversing direction (dy = -dy) when it hits the top or bottom boundary (ball_y-radius <= 0 and ball_y+radius >= HEIGHT). The event loop only handles QUIT. Hint: remember the coordinate is the circle center, so include the radius in boundary checks. Note: A window can't open inside a web page — click 'Open in VS Code' to run it (install pygame first).
files: |
  main.py
starter: |
  import pygame

  pygame.init()
  WIDTH, HEIGHT = 800, 600
  screen = pygame.display.set_mode((WIDTH, HEIGHT))
  BLACK = (0, 0, 0)
  WHITE = (255, 255, 255)

  ball_y = 300
  dy = 4

  running = True
  while running:
      # Handle QUIT
      # Update ball_y, check top/bottom boundaries for bounce
      # fill + draw.circle + flip
  pygame.quit()
checklist:
- Handles QUIT event
- Ball bounces up and down vertically
- Top/bottom boundary checks correct (includes radius)
- fill + circle + flip every frame
- Ends with pygame.quit()
```

## Part 3 · Mini Project

```quiz
type: project
q: Build a "bouncing block" mini-game: 800x600 window, black background. A red block (use pygame.draw.rect, top-left at player_x/player_y, size 50x50) bounces horizontally back and forth: each frame player_x += speed (initial 5), reversing with speed = -speed when it hits the left or right boundary (accounting for block width). Add a Clock and call clock.tick(60) at the end of every frame to cap the rate. The event loop handles QUIT. Additionally: 1) pressing SPACE toggles the block color between red (255,0,0) and blue (0,0,255) (use KEYDOWN to detect K_SPACE); 2) the block slowly falls vertically at the same time (player_y += 2 each frame, bouncing off the bottom boundary); 3) draw a white ball (pygame.draw.circle, center at player_x+25, player_y-30, radius 15) above the block, following it. Hint: remember the coordinate is the top-left corner; use WIDTH-50 and HEIGHT-50 for boundaries. Note: A window can't open inside a web page — click 'Open in VS Code' to run it (install pygame first).
files: |
  main.py
starter: |
  import pygame

  pygame.init()
  WIDTH, HEIGHT = 800, 600
  screen = pygame.display.set_mode((WIDTH, HEIGHT))
  pygame.display.set_caption("Bouncing Block")

  clock = pygame.time.Clock()

  player_x, player_y = 375, 100
  speed_x = 5
  speed_y = 2
  color = (255, 0, 0)

  running = True
  while running:
      # Handle QUIT + SPACE toggles color
      # Update player_x / player_y, bounce off left/right and top/bottom
      # fill black + draw.rect block + draw.circle ball + flip
      # clock.tick(60)
  pygame.quit()
checklist:
- Handles QUIT event
- Created a Clock and calls clock.tick(60) every frame
- Block bounces horizontally with correct left/right boundary checks (includes width 50)
- Block falls vertically and bounces off the bottom boundary
- SPACE toggles block color (red/blue)
- White ball drawn above the block, following it
- fill + flip every frame
- Ends with pygame.quit()
```
