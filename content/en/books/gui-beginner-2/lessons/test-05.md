# Chapter 5 · Sprites and Collision · Final Quiz

> 8 questions. This chapter answers: how to manage multiple characters, how to detect who hit whom, and how to make the player move.
> **You must get all correct to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: When defining a pygame Sprite class, which group of operations is required?
options:
- Define a draw method and a __str__ method
- Call super().__init__() in __init__, and set self.image and self.rect
- Inherit from object and manually call pygame.display.flip() inside update
- Use pygame.sprite.Group as the parent class
answer: 1
explain: A Sprite subclass must call super().__init__() in __init__ to initialize the parent's internal data structures, and must at least set self.image (appearance) and self.rect (position) — Group.draw and collision detection both depend on rect. You don't define draw yourself, and flip is the main loop's job.
```

```quiz
type: choice
q: all_sprites is a pygame.sprite.Group containing several sprites. Which line makes every sprite execute its own update method once?
options:
- all_sprites.draw(screen)
- all_sprites.add(player)
- all_sprites.update()
- all_sprites.empty()
answer: 2
explain: Group.update() iterates over every sprite in the container and calls its update() method — a batch update. draw(screen) is batch drawing; add is for adding; empty is for clearing. None of those trigger update.
```

```quiz
type: choice
q: To detect whether two sprites have collided, which attribute of each is most convenient to use?
options:
- The pixel color of self.image
- self.rect, used with colliderect or groupcollide
- self.speed and self.color
- A pygame.mixer.Sound object
answer: 1
explain: pygame collision detection is based on Rect (rectangles), using rect.colliderect or the sprite.groupcollide / spritecollide functions. image is a pixel canvas; speed/color are custom attributes; Sound is an audio object — none are used for collision.
```

```quiz
type: choice
q: The player holds an arrow key to "move continuously". Which approach is better?
options:
- Add 5 inside the KEYDOWN event
- Use pygame.key.get_pressed() every frame to check, adding 5 while held
- Use time.sleep(0.1) to wait for a key
- Put movement inside the QUIT event
answer: 1
explain: KEYDOWN only fires once at the instant of pressing; holding it down won't trigger continuously. To achieve smooth continuous movement, use get_pressed() every frame to get a snapshot of "which keys are currently held". sleep will freeze the window.
```

```quiz
type: choice
q: In the "catch" game snippet below, which order of logic is correct?
options:
- Draw the ball, then check ball-paddle collision, then move the ball
- Each frame, move the ball and paddle, then check collision, then draw
- Only move inside KEYDOWN; no per-frame update needed
- fill the screen but never call flip
answer: 1
explain: The standard order for one frame is: handle events → update positions (move) → check collision (based on new positions) → clear/draw → flip. Drawing before checking means you draw the previous frame's position; collision should be judged after movement; flip must be called every frame or the screen never refreshes.
```

## Part 2 · Hands-On

```quiz
type: local
q: Build a "dodge the blocks" game skeleton: 700x500 black background. The player is a 40x40 cyan (0,200,255) Player sprite, starting near the bottom-center, moved continuously with arrow keys (bounds 0~660 / 0~460). Spawn 6 red (255,50,50) Enemy sprites at the top (y between -200 and -30, x random 0~670), each moving down 3px per frame; when one leaves the bottom, reset it to a random position at the top. Detect player-enemy collision; on hit, show "You Hit One!" in large red text (using font.render) at the center and stop movement (game pauses). Hint: use pygame.sprite.spritecollide or rect.colliderect. Note: A window can't open inside a web page — click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import pygame
  import random

  pygame.init()
  screen = pygame.display.set_mode((700, 500))
  clock = pygame.time.Clock()
  font = pygame.font.Font(None, 48)

  class Player(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((40, 40))
          self.image.fill((0, 200, 255))
          self.rect = self.image.get_rect(center=(350, 480))
      def update(self, keys):
          # Arrow key movement + boundary limits

  class Enemy(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((30, 30))
          self.image.fill((255, 50, 50))
          self.rect = self.image.get_rect(topleft=(random.randint(0,670), random.randint(-200,-30)))
      def update(self):
          # y+3, reset to top when out of bounds

  player = Player()
  enemies = pygame.sprite.Group(Enemy() for _ in range(6))
  all_sprites = pygame.sprite.Group(player, *enemies)

  running = True
  hit = False
  while running:
      keys = pygame.key.get_pressed()
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
      if not hit:
          player.update(keys)
          enemies.update()
          if pygame.sprite.spritecollideany(player, enemies):
              hit = True
      screen.fill((0, 0, 0))
      all_sprites.draw(screen)
      if hit:
          screen.blit(font.render("You Hit One!", True, (255, 50, 50)), (240, 220))
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- Player correctly inherits Sprite, with super().__init__, image, and rect all set
- Arrow key continuous movement with correct boundary limits
- Enemy correctly inherits Sprite and sets image and rect
- 6 enemies correctly spawned and added to Group
- Enemies fall each frame and reset to top when out of bounds
- Collision detection works; on hit, shows "You Hit One!"
- Handles QUIT, window doesn't freeze
- Ends with pygame.quit()
```

```quiz
type: local
q: Build a "catch ball" game: 600x500 black background. The Paddle is a 100x15 white sprite at the bottom of the window (y=470), moved continuously with left/right arrow keys (bounds 0~500). The Ball is a 20x20 yellow (255,220,0) sprite falling from a random x at the top (y speed 4), bouncing off the left/right walls. Catching the ball (ball and paddle collide) adds 10 points and resets the ball to a random x at the top; missing the ball (ball goes past the bottom) subtracts 5 points (not below 0) and resets the ball. Show the current score in the top-left corner. Hint: use spritecollideany or colliderect; reset with rect.center=(random.randint(20,580), 20). Note: A window can't open inside a web page — click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import pygame
  import random

  pygame.init()
  screen = pygame.display.set_mode((600, 500))
  clock = pygame.time.Clock()
  font = pygame.font.Font(None, 36)

  class Paddle(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((100, 15))
          self.image.fill((255, 255, 255))
          self.rect = self.image.get_rect(center=(300, 470))
      def update(self, keys):
          # Move left/right + boundary

  class Ball(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((20, 20))
          self.image.fill((255, 220, 0))
          self.rect = self.image.get_rect(center=(random.randint(20,580), 20))
          self.vy = 4
          self.vx = 3
      def update(self):
          # Move + bounce off left/right walls

  paddle = Paddle()
  ball = Ball()
  all_sprites = pygame.sprite.Group(paddle, ball)
  score = 0

  running = True
  while running:
      keys = pygame.key.get_pressed()
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
      paddle.update(keys)
      ball.update()
      # Collision detection and scoring
      screen.fill((0, 0, 0))
      all_sprites.draw(screen)
      screen.blit(font.render(f"Score {score}", True, (255, 255, 255)), (10, 10))
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- Paddle and Ball both correctly inherit Sprite and initialize image and rect
- Paddle moves continuously with arrow keys, correct boundary limits
- Ball bounces correctly off left/right walls
- Catching the ball adds 10 points and resets it
- Missing the ball subtracts 5 points (not below 0) and resets it
- Screen shows the current score
- Handles QUIT, window doesn't freeze
- Ends with pygame.quit()
```

## Part 3 · Mini Project

```quiz
type: project
q: Build a "complete dodge game": 800x600 black window. The player is a 40x40 green (0,255,100) sprite, moved continuously with arrow keys (bounds 0~760 / 0~560). Red (255,50,50) enemy blocks spawn from the top and fall each frame, increasing in number over time (hint: use a timer to add a new enemy to the Group every 60 frames). Score 1 point for every second survived (or use a simpler approach: if no collision, add 0 — instead, score based on survival time). Show "Survived: X sec" in the top-left and the current enemy count in the top-right. When the player hits any enemy, the game ends and shows "Game Over" and "Survived X sec — Press R to Restart" at the center; pressing R clears enemies and respawns them, returns the player to center, and resets the timer. Hint: use pygame.time.get_ticks for seconds; on restart, call enemies.empty() then re-add initial enemies. Note: A window can't open inside a web page — click 'Open in VS Code' to run it.
files: |
  main.py
starter: |
  import pygame
  import random

  pygame.init()
  screen = pygame.display.set_mode((800, 600))
  clock = pygame.time.Clock()
  font = pygame.font.Font(None, 36)

  class Player(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((40, 40))
          self.image.fill((0, 255, 100))
          self.rect = self.image.get_rect(center=(400, 560))
      def update(self, keys):
          pass   # Arrow key movement + boundary

  class Enemy(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((30, 30))
          self.image.fill((255, 50, 50))
          self.rect = self.image.get_rect(topleft=(random.randint(0,770), random.randint(-300,-30)))
      def update(self):
          self.rect.y += 3

  player = Player()
  enemies = pygame.sprite.Group()
  all_sprites = pygame.sprite.Group(player)

  # Initial enemies
  for _ in range(5):
      e = Enemy()
      enemies.add(e)
      all_sprites.add(e)

  running = True
  playing = True
  start_ticks = pygame.time.get_ticks()
  survive_seconds = 0
  frame_count = 0

  while running:
      keys = pygame.key.get_pressed()
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
          if event.type == pygame.KEYDOWN and event.key == pygame.K_r and not playing:
              # Restart: clear enemies, rebuild, return player, reset timer
              pass
      if playing:
          player.update(keys)
          enemies.update()
          frame_count += 1
          if frame_count % 60 == 0:
              e = Enemy()
              enemies.add(e)
              all_sprites.add(e)
          if pygame.sprite.spritecollideany(player, enemies):
              playing = False
              survive_seconds = (pygame.time.get_ticks() - start_ticks) // 1000
      screen.fill((0, 0, 0))
      all_sprites.draw(screen)
      screen.blit(font.render(f"Survived: {survive_seconds if not playing else (pygame.time.get_ticks()-start_ticks)//1000} sec", True, (255,255,255)), (10,10))
      screen.blit(font.render(f"Enemies: {len(enemies)}", True, (255,255,255)), (680,10))
      if not playing:
          screen.blit(font.render("Game Over", True, (255,50,50)), (300, 250))
          screen.blit(font.render("Press R to Restart", True, (200,200,200)), (320, 310))
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- 800x600 black window, Player/Enemy correctly inherit Sprite
- Player moves continuously with arrow keys, correct boundary limits
- Enemies fall continuously, increasing in number over time (timed spawning)
- Survival time scoring displayed in top-left
- Enemy count displayed in top-right
- On hitting an enemy, game ends and shows "Game Over"
- Pressing R fully restarts (clears enemies, rebuilds, returns player, resets timer)
- Handles QUIT, window doesn't freeze
- Ends with pygame.quit()
```
