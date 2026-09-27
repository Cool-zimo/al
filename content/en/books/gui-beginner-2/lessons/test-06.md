# Chapter 6 · Wrapping Up and Next Steps · Final Quiz

> 8 questions. This chapter answers: how to make your game speak, how to remember the score, how to avoid crashes, and what "done" looks like.
> **You must get all correct to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: To correctly display the Chinese text "游戏结束" in a pygame window, the correct approach is?
options:
- pygame.font.Font(None, 48).render("游戏结束", True, white)
- Specify a font file with Chinese glyphs, e.g., pygame.font.Font("msyh.ttc", 48)
- First call .encode("utf-8") on the string, then pass to render
- Add a parameter lang="zh" to render
answer: 1
explain: Font(None) uses the default font which lacks Chinese glyphs, producing boxes or missing characters. You must specify a font file containing Chinese glyphs. encode and lang are not valid render usage.
```

```quiz
type: choice
q: For a short "coin pickup" sound effect, which API is most appropriate?
options:
- pygame.mixer.music.play(-1)
- pygame.mixer.Sound("coin.wav").play()
- pygame.font.Font.render
- pygame.time.Clock.tick
answer: 1
explain: Short sound effects use a Sound object loaded and played with play(), one-shot. music.play(-1) is for looping background music; render is for text; tick is for capping frame rate.
```

```quiz
type: choice
q: When managing "menu / playing / gameover" screens with a state variable, why is if/elif recommended over a series of independent if statements in event handling?
options:
- elif runs faster
- To prevent the same event from hitting a later branch after state changes, causing accidental triggers
- if and elif behave identically
- elif reduces line count
answer: 1
explain: The same event object gets checked by subsequent independent if branches; after state changes, the old event may still hit the playing branch, causing a skill to fire / shot to fire the instant the game starts. elif guarantees only one branch is entered.
```

```quiz
type: choice
q: When reading a save file, a player corrupts save.json using Notepad. Which approach is safest?
options:
- Do nothing; just json.load and let it error out
- Use try/except to catch JSONDecodeError and other exceptions, returning default saves on failure
- Manually fix it in Notepad
- Delete and reinstall the whole program
answer: 1
explain: Corrupted saves are uncontrolled input; the game should "use defaults when it can't read" rather than crash. try/except catches JSONDecodeError (bad content), FileNotFoundError (missing file), and OSError (permissions), then returns DEFAULT — the most robust graceful-degradation approach.
```

```quiz
type: choice
q: After running, the window immediately goes "Not Responding" and you must force-quit. Which is the most likely cause?
options:
- Called pygame.display.flip() every frame
- The main loop never handled pygame.QUIT, so the event queue was never consumed
- Used pygame.time.get_ticks()
- Checked with os.path.exists before loading an image
answer: 1
explain: "Not Responding" is almost always because the event queue isn't being consumed — system messages (including redraw and close requests) pile up, and the OS decides the window is unresponsive. The main loop must iterate event.get() and handle QUIT.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "talking scoreboard": 500x400 black window. Display "Score: 0  Best: 0" centered at the top (Chinese, pick a Chinese-capable font for your system), moving the current score up/down by 5 with the arrow keys and re-rendering the text when it changes; when the current score exceeds the best, update the best (just track it in a variable, no file writing needed). Pressing SPACE plays a short sound effect (generate a ~0.15 second buffer placeholder with Sound). Display a small white line of text at the bottom: "Up/Down to score, SPACE to sound off". Hint: when the score changes, blit the new text on the same frame. Note: A window can't open inside a web page — click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import pygame

  pygame.init()
  pygame.mixer.init()
  screen = pygame.display.set_mode((500, 400))
  clock = pygame.time.Clock()

  # Pick one Chinese-capable font for your system
  # font = pygame.font.Font("C:/Windows/Fonts/msyh.ttc", 40)
  # font = pygame.font.Font("/System/Library/Fonts/PingFang.ttc", 40)
  font = pygame.font.Font(None, 40)
  small = pygame.font.Font(None, 24)

  score = 0
  high = 0
  beep = pygame.mixer.Sound(buffer=bytes([128] * 3300))   # ~0.15 sec placeholder

  running = True
  while running:
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
          if event.type == pygame.KEYDOWN:
              # Up +5 / Down -5 (not below 0) / SPACE beep.play()
              pass
      screen.fill((0, 0, 0))
      # blit score text + bottom hint
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- 500x400 black window created successfully
- Uses a Chinese-capable font; Chinese displays correctly
- Up adds points, down subtracts points (not below 0)
- Text updates correctly when the score changes
- Updates best score display when a new best is reached
- SPACE plays sound
- Handles QUIT, window doesn't freeze
- Ends with pygame.quit()
```

```quiz
type: local
q: Build a "three-state catch game": 700x500 black window. State constants MENU/PLAYING/GAMEOVER. Menu: display "Catch Game" and "Press SPACE to Start"; Playing: paddle 110x15 cyan (0,200,255) at y=470, moved continuously with arrow keys (bounds 0~590), ball 22x22 yellow (255,220,0) falling from a random x at the top (vy=4, bouncing left/right), catch adds 10 points, miss subtracts 5 points (not below 0), display score and time (30-second countdown); when time runs out, enter the end screen showing "Game Over  Score: X  Best: Y" and "Press R to Restart". Save the best score to highscore.json, reading on startup (fault tolerance + safe write). Hint: reset score/time/ball position when entering the game. Note: A window can't open inside a web page — click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import json
  import os
  import random
  import pygame

  pygame.init()
  screen = pygame.display.set_mode((700, 500))
  clock = pygame.time.Clock()
  font = pygame.font.Font(None, 36)

  SAVE_FILE = "highscore.json"
  DEFAULT = {"high_score": 0}

  def load_save():
      try:
          with open(SAVE_FILE, "r", encoding="utf-8") as f:
              return json.load(f)
      except (json.JSONDecodeError, FileNotFoundError, OSError):
          return dict(DEFAULT)

  def save_high(score):
      data = load_save()
      if score > data["high_score"]:
          data["high_score"] = score
          tmp = SAVE_FILE + ".tmp"
          with open(tmp, "w", encoding="utf-8") as f:
              json.dump(data, f, ensure_ascii=False, indent=2)
          os.replace(tmp, SAVE_FILE)

  # Paddle / Ball classes

  MENU, PLAYING, GAMEOVER = 'menu', 'playing', 'gameover'
  state = MENU
  save = load_save()
  score = 0
  time_left = 30
  start_ticks = 0

  running = True
  while running:
      keys = pygame.key.get_pressed()
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
          # Three-state event switching
      if state == PLAYING:
          # Paddle/ball/collision/scoring/timer
      screen.fill((0, 0, 0))
      # Three-state rendering
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- Three states managed with constants, menu displays correctly
- Paddle moves continuously with arrow keys, correct boundary limits
- Ball bounces left/right and falls correctly
- Catching adds points, missing subtracts points (not below 0), and resets
- 30-second countdown displayed on screen
- End screen shows score and best score
- Best score saved with fault tolerance + safe write
- R key restarts
- Handles QUIT, window doesn't freeze
- Ends with pygame.quit()
```

## Part 3 · Mini Project

```quiz
type: project
q: Build a "complete final catch game": 800x600 black window, tying together every concept from Chapter 6. Requirements: 1) three states (menu/playing/gameover); menu shows the Chinese title "Catch Master" and "Press SPACE to Start" (using a Chinese font), end screen shows score, best score, and "Press R to Restart / Press Q to Menu"; 2) paddle 120x18 cyan (0,200,255) at y=570, moved continuously with arrow keys (bounds 0~680), ball 24x24 gold (255,200,0) falling from a random x at the top (vy=4, vx=3 bouncing left/right), catch adds 10 points, miss subtracts 5 (not below 0); 3) play a short sound effect on catch (Sound buffer placeholder); the menu has background loop audio (if mixer.music can't load, use a looping Sound as a substitute, or leave a comment); 4) 30-second countdown displayed in the top-left; 5) save best score to save.json, reading on startup with fault tolerance (JSONDecodeError/FileNotFoundError/OSError) + safe write (write tmp then replace); 6) on catch, reset the ball to a random x at the top and set vx to a random integer 2~5, preserving the sign; 7) split into files: sprites.py (Paddle/Ball), save.py (load_save/save_high), main.py (main loop). Hint: import with "from sprites import Paddle, Ball"; reset score, time, ball, and paddle on entering the game. Note: A window can't open inside a web page — click 'Open in VS Code' to run it.
files: |
  main.py
  sprites.py
  save.py
starter: |
  # === save.py ===
  import json, os

  SAVE_FILE = "save.json"
  DEFAULT = {"high_score": 0}

  def load_save():
      try:
          with open(SAVE_FILE, "r", encoding="utf-8") as f:
              return json.load(f)
      except (json.JSONDecodeError, FileNotFoundError, OSError):
          return dict(DEFAULT)

  def save_high(score):
      data = load_save()
      if score > data["high_score"]:
          data["high_score"] = score
          tmp = SAVE_FILE + ".tmp"
          with open(tmp, "w", encoding="utf-8") as f:
              json.dump(data, f, ensure_ascii=False, indent=2)
          os.replace(tmp, SAVE_FILE)

  # === sprites.py ===
  import pygame, random

  class Paddle(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((120, 18))
          self.image.fill((0, 200, 255))
          self.rect = self.image.get_rect(center=(400, 570))
      def update(self, keys):
          if keys[pygame.K_LEFT] and self.rect.left > 0:
              self.rect.x -= 7
          if keys[pygame.K_RIGHT] and self.rect.right < 800:
              self.rect.x += 7

  class Ball(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((24, 24))
          self.image.fill((255, 200, 0))
          self.rect = self.image.get_rect(center=(400, 30))
          self.vx = 3
          self.vy = 4
      def update(self):
          self.rect.x += self.vx
          self.rect.y += self.vy
          if self.rect.left <= 0 or self.rect.right >= 800:
              self.vx *= -1
      def reset(self):
          self.rect.center = (random.randint(24, 776), 30)
          self.vx = random.choice([-1, 1]) * random.randint(2, 5)

  # === main.py ===
  import pygame, random
  from sprites import Paddle, Ball
  from save import load_save, save_high

  pygame.init()
  pygame.mixer.init()
  screen = pygame.display.set_mode((800, 600))
  clock = pygame.time.Clock()
  font = pygame.font.Font(None, 40)

  MENU, PLAYING, GAMEOVER = 'menu', 'playing', 'gameover'
  state = MENU
  save = load_save()
  score = 0
  time_left = 30
  start_ticks = 0
  beep = pygame.mixer.Sound(buffer=bytes([128] * 4410))

  paddle = Paddle()
  ball = Ball()
  all_sprites = pygame.sprite.Group(paddle, ball)

  running = True
  while running:
      keys = pygame.key.get_pressed()
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
          # Three-state switching + reset on entering game
      if state == PLAYING:
          paddle.update(keys)
          ball.update()
          if ball.rect.colliderect(paddle.rect):
              score += 10
              beep.play()
              ball.reset()
          if ball.rect.top > 600:
              score = max(0, score - 5)
              ball.reset()
          elapsed = (pygame.time.get_ticks() - start_ticks) // 1000
          time_left = 30 - elapsed
          if time_left <= 0:
              save_high(score)
              save = load_save()
              state = GAMEOVER
      screen.fill((20, 20, 40))
      # Three-state rendering
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- Clear separation across three files (sprites.py/save.py/main.py)
- Chinese title and Chinese hints display correctly
- Three-state switching complete (menu/game/gameover)
- Paddle moves continuously with correct boundary limits
- Ball falls and bounces left/right correctly
- Catching adds points, missing subtracts points and resets
- Sound effect on catch
- 30-second countdown displayed on screen
- End screen shows score and best score
- R restarts, Q returns to menu
- Save fault tolerance (three exceptions) + safe write (tmp + replace)
- Handles QUIT, window doesn't freeze
- Ends with pygame.quit()
```
