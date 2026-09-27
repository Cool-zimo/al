# 第 5 章 · 精灵与碰撞 · 大测验

> 8 道题。这一章解决的是"角色多了怎么管、谁撞了谁怎么判、玩家怎么动起来"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 定义一个 pygame 精灵类时，下面哪组操作是必须的？
options:
- 定义 draw 方法和 __str__ 方法
- 在 __init__ 里调用 super().__init__()，并设置 self.image 和 self.rect
- 继承 object，并在 update 里手动调用 pygame.display.flip()
- 用 pygame.sprite.Group 当父类
answer: 1
explain: Sprite 子类必须在 __init__ 调用 super().__init__() 初始化父类的内部数据结构，并至少设置 self.image（样子）和 self.rect（位置）——Group.draw 和碰撞检测都依赖 rect。draw 不用自己定义，flip 是主循环的事。
```

```quiz
type: choice
q: all_sprites 是一个 pygame.sprite.Group，里面有若干精灵。下面哪句会让每个精灵都执行一次自己的 update 方法？
options:
- all_sprites.draw(screen)
- all_sprites.add(player)
- all_sprites.update()
- all_sprites.empty()
answer: 2
explain: Group.update() 会遍历容器内所有精灵并调用它们的 update() 方法，是批量更新。draw(screen) 是批量绘制；add 是加入；empty 是清空，都不会触发 update。
```

```quiz
type: choice
q: 想检测两个精灵有没有碰撞，用它们各自的什么属性做判断最方便？
options:
- self.image 的像素颜色
- self.rect，配合 colliderect 或 groupcollide
- self.speed 和 self.color
- pygame.mixer.Sound 对象
answer: 1
explain: pygame 的碰撞检测基于 Rect（矩形），用 rect.colliderect 或 sprite.groupcollide / spritecollide 函数。image 是像素画布、speed/color 是自定义属性、Sound 是声音对象，都不用于碰撞。
```

```quiz
type: choice
q: 玩家按住方向键要"持续移动"角色，下面哪种写法更合适？
options:
- 在 KEYDOWN 事件里 += 5
- 每帧用 pygame.key.get_pressed() 判断，按住就 += 5
- 用 time.sleep(0.1) 等按键
- 把移动写在 QUIT 事件里
answer: 1
explain: KEYDOWN 只在按下的那一瞬间触发一次，按住不放不会连续触发；要实现平滑持续移动，应该每帧用 get_pressed() 取"此刻哪些键正被按着"的快照。sleep 会卡死窗口。
```

```quiz
type: choice
q: 下面的"接球"游戏片段，哪一步逻辑顺序是对的？
options:
- 先 draw 球，再检测球和挡板碰撞，再移动球
- 每帧先移动球和挡板，再检测碰撞，再 draw
- 只在 KEYDOWN 里移动，不需要每帧 update
- 先 fill 画面，但从不调用 flip
answer: 1
explain: 一帧的标准顺序是：处理事件 → 更新位置（移动）→ 检测碰撞（基于新位置）→ 清空/绘制 → flip。先画再检测会导致"画的是上一帧的位置"；碰撞应在移动之后判断；flip 每帧都要调否则画面不刷新。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"躲避方块"小游戏骨架：700x500 黑底。玩家是一个 40x40 青色（0,200,255）的精灵 Player，初始在窗口底部中间，用方向键持续移动（边界限制 0~660 / 0~460）。随机生成 6 个 30x30 红色（255,50,50）的 Enemy 精灵，分布在顶部（y 在 -200~-30，x 随机 0~670），每帧 y+3，掉出底部就复位到顶部随机位置。检测玩家与敌人碰撞，撞到就在画面中央显示"撞到了！"红色大字（用 font.render）并停止移动（游戏暂停）。提示：用 pygame.sprite.spritecollide 或 rect.colliderect。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
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
          # 方向键移动 + 边界限制

  class Enemy(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((30, 30))
          self.image.fill((255, 50, 50))
          self.rect = self.image.get_rect(topleft=(random.randint(0,670), random.randint(-200,-30)))
      def update(self):
          # y+3，出界复位

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
          screen.blit(font.render("撞到了！", True, (255, 50, 50)), (240, 220))
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- Player 正确继承 Sprite，super().__init__、image、rect 齐全
- 方向键持续移动且边界限制正确
- Enemy 正确继承 Sprite 并设置了 image 和 rect
- 6 个敌人正确生成并加入 Group
- 敌人每帧下落，出界复位到顶部
- 碰撞检测有效，撞到显示"撞到了！"
- 处理了 QUIT，窗口不卡死
- 结尾 pygame.quit()
```

```quiz
type: local
q: 做一个"接球小游戏"：600x500 黑底。挡板 Paddle 是 100x15 白色精灵，在窗口底部（y=470），左右方向键持续移动（边界 0~500）。球 Ball 是 20x20 黄色（255,220,0）精灵，从顶部随机 x 位置下落（y 速度 4），左右边界反弹。接到球（球和挡板碰撞）加 10 分、球复位到顶部随机 x；漏掉球（球超出底部）减 5 分（不低于 0）、球复位。画面左上角显示当前分数。提示：用 spritecollideany 或 colliderect 判断；球复位用 rect.center=(random.randint(20,580), 20)。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
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
          # 左右移动 + 边界

  class Ball(pygame.sprite.Sprite):
      def __init__(self):
          super().__init__()
          self.image = pygame.Surface((20, 20))
          self.image.fill((255, 220, 0))
          self.rect = self.image.get_rect(center=(random.randint(20,580), 20))
          self.vy = 4
          self.vx = 3
      def update(self):
          # 移动 + 左右边界反弹

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
      # 碰撞检测与计分
      screen.fill((0, 0, 0))
      all_sprites.draw(screen)
      screen.blit(font.render(f"分数 {score}", True, (255, 255, 255)), (10, 10))
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- Paddle、Ball 都正确继承 Sprite 并初始化 image 和 rect
- 挡板用方向键持续移动，边界限制正确
- 球左右边界反弹正确
- 接到球加 10 分并复位球
- 漏掉球减 5 分（不低于 0）并复位球
- 画面显示当前分数
- 处理了 QUIT，窗口不卡死
- 结尾 pygame.quit()
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"完整版躲避游戏"：800x600 黑底窗口。玩家是 40x40 绿色（0,255,100）精灵，用方向键持续移动（边界 0~760 / 0~560）。从上方向下生成红色（255,50,50）敌人方块，每帧下落，越落越多（提示：用一个计时器，每隔 60 帧新增一个敌人加入 Group）。玩家每躲过一秒加 1 分（或用碰撞没发生就加分的方式，简化：每帧没撞就 score+=0 不做，改为存活时间计分）。画面左上角显示"存活时间 X 秒"，右上角显示当前敌人数量。撞到任何敌人游戏结束，画面中央显示"游戏结束"和"存活 X 秒 按 R 重开"，按 R 清空敌人重新生成、玩家回中央、时间清零。提示：pygame.time.get_ticks 计算秒数；重开时 enemies.empty() 再重新加初始敌人。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
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
          pass   # 方向键移动 + 边界

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

  # 初始敌人
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
              # 重开：清敌人、重建、玩家回位、计时归零
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
      screen.blit(font.render(f"存活时间 {survive_seconds if not playing else (pygame.time.get_ticks()-start_ticks)//1000} 秒", True, (255,255,255)), (10,10))
      screen.blit(font.render(f"敌人 {len(enemies)}", True, (255,255,255)), (680,10))
      if not playing:
          screen.blit(font.render("游戏结束", True, (255,50,50)), (300, 250))
          screen.blit(font.render("按 R 重开", True, (200,200,200)), (320, 310))
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- 窗口 800x600 黑底，Player/Enemy 正确继承 Sprite
- 玩家方向键持续移动且边界限制正确
- 敌人持续下落，越落越多（计时生成）
- 存活时间计分并显示在左上角
- 敌人数量显示在右上角
- 撞到敌人游戏结束并显示"游戏结束"
- 按 R 能完整重开（清敌人、重建、玩家归位、计时清零）
- 处理了 QUIT，窗口不卡死
- 结尾 pygame.quit()
```
