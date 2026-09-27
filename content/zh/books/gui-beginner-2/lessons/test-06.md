# 第 6 章 · 收尾与下一步 · 大测验

> 8 道题。这一章解决的是"游戏怎么开口说话、怎么记住成绩、怎么不崩、怎么才算做完"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 想让"游戏结束"四个中文字正确显示在 pygame 窗口上，正确的做法是？
options:
- pygame.font.Font(None, 48).render("游戏结束", True, 白色)
- 指定一个带中文字形的字体文件，如 pygame.font.Font("msyh.ttc", 48)
- 先对字符串调 .encode("utf-8") 再传入 render
- render 里加参数 lang="zh"
answer: 1
explain: Font(None) 用的是不含中文的默认字体，会画出方块或缺字。必须指定带中文字形的字体文件。encode 和 lang 参数都不是 render 的合法用法。
```

```quiz
type: choice
q: 短促的"吃金币"音效用哪个 API 播放最合适？
options:
- pygame.mixer.music.play(-1)
- pygame.mixer.Sound("coin.wav").play()
- pygame.font.Font.render
- pygame.time.Clock.tick
answer: 1
explain: 短音效用 Sound 对象加载并 play()，可一次性播放。music.play(-1) 用于循环播放背景音乐；render 是文字；tick 是锁帧。
```

```quiz
type: choice
q: 游戏用 state 变量管理"菜单/游戏中/结束"三个画面时，为什么事件处理里推荐用 if/elif 而不是一串独立的 if？
options:
- elif 运行更快
- 防止同一个事件在 state 被修改后再次命中后续分支，造成误触发
- if 和 elif 行为完全一样
- elif 能减少代码行数
answer: 1
explain: 同一个事件对象会被后续独立 if 分支继续检查，state 改了以后旧事件仍可能命中 playing 分支，导致刚进游戏就触发技能/开火。elif 保证只进一个分支。
```

```quiz
type: choice
q: 读存档时，玩家用记事本把 save.json 改坏了，下面哪种写法最稳妥？
options:
- 不做任何处理，直接 json.load，让它报错
- 用 try/except 捕获 JSONDecodeError 等异常，读坏就返回默认存档
- 在记事本里手动修复
- 删掉整个程序重装
answer: 1
explain: 存档损坏是不可控输入，游戏应"读不出来就用默认值"而不是崩溃。try/except 捕获 JSONDecodeError（内容坏）、FileNotFoundError（没文件）、OSError（权限）后返回 DEFAULT，是最稳妥的降级处理。
```

```quiz
type: choice
q: 程序运行后窗口立刻"未响应"只能强退，最可能是哪个原因？
options:
- 每帧都调用了 pygame.display.flip()
- 主循环里没有处理 pygame.QUIT 事件，事件队列无人消费
- 用了 pygame.time.get_ticks()
- 加载图片前用 os.path.exists 检查了
answer: 1
explain: 窗口"未响应"几乎总是事件队列无人消费——系统消息（含重绘、关闭请求）堆积，系统判定窗口无响应。主循环必须遍历 event.get() 并处理 QUIT。
```

## 第二部分 · 动手题

```quiz
type: local
q: 做一个"会响会说的计分器"：500x400 黑底窗口。顶部居中显示"当前 0 最高 0"（中文，用中文字体，自己按系统选一行），按上下方向键让当前分 ±5，分数变化时重新 render 文字；当前分超过最高分就更新最高分（用变量记录即可，不用写文件）。按空格播放一次短音效（用 Sound 生成约 0.15 秒 buffer 占位）。画面底部显示一行白色小字"按上下加分 按空格发声"。提示：分数变了要在同一帧重新 blit 新文字。注意：网页里没有显示器也没有声卡，请点"在 VS Code 里打开"运行。
files: |
  main.py
starter: |
  import pygame

  pygame.init()
  pygame.mixer.init()
  screen = pygame.display.set_mode((500, 400))
  clock = pygame.time.Clock()

  # 按你的系统选一行中文字体
  # font = pygame.font.Font("C:/Windows/Fonts/msyh.ttc", 40)
  # font = pygame.font.Font("/System/Library/Fonts/PingFang.ttc", 40)
  font = pygame.font.Font(None, 40)
  small = pygame.font.Font(None, 24)

  score = 0
  high = 0
  beep = pygame.mixer.Sound(buffer=bytes([128] * 3300))   # ~0.15 秒占位

  running = True
  while running:
      for event in pygame.event.get():
          if event.type == pygame.QUIT:
              running = False
          if event.type == pygame.KEYDOWN:
              # 上 +5 / 下 -5（不低于0）/ 空格 beep.play()
              pass
      screen.fill((0, 0, 0))
      # blit 计分文字 + 底部提示
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- 窗口 500x400 黑底正常创建
- 用了带中文的字体，中文正常显示
- 按上加分、按下减分（不低于 0）
- 分数变化时文字正确更新
- 刷新最高分时更新最高分显示
- 空格播放声音
- 处理了 QUIT，窗口不卡死
- 结尾 pygame.quit()
```

```quiz
type: local
q: 做一个"三状态接球小游戏"：700x500 黑底。状态常量 MENU/PLAYING/GAMEOVER。菜单：显示"接球游戏"和"按空格开始"；游戏中：挡板 110x15 青色（0,200,255）在 y=470 用方向键持续移动（边界 0~590），球 22x22 黄色（255,220,0）从顶部随机 x 下落（vy=4，左右反弹），接住加 10 分、漏掉减 5 分（不低于0），画面显示分数和时间（30 秒倒计时）；时间到进结束画面显示"结束 得分 X 最高 Y"和"按 R 重开"。最高分存进 highscore.json，启动时读档（容错 + 安全写盘）。提示：进游戏重置分数/时间/球位置。注意：网页里没有显示器，请点"在 VS Code 里打开"运行。
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

  # Paddle / Ball 类

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
          # 三状态事件切换
      if state == PLAYING:
          # 挡板/球/碰撞/计分/计时
      screen.fill((0, 0, 0))
      # 三状态绘制
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- 三状态用常量管理，菜单画面正确
- 挡板方向键持续移动，边界限制正确
- 球左右反弹、下落正确
- 接球加分、漏球扣分（不低于0）并复位
- 30 秒倒计时并在画面显示
- 结束画面显示得分和最高分
- 最高分用容错+安全写盘存盘
- R 键能重开
- 处理了 QUIT，窗口不卡死
- 结尾 pygame.quit()
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"完整收官版接球游戏"：800x600 黑底窗口，把第 6 章所有知识点串起来。要求：①三状态（菜单/游戏中/结束），菜单显示中文标题"接球大作战"和"按空格开始"（用中文字体），结束画面显示得分、最高分和"按 R 重开/按 Q 回菜单"；②挡板 120x18 青色（0,200,255）在 y=570 用方向键持续移动（边界 0~680），球 24x24 金色（255,200,0）顶部随机 x 下落（vy=4，vx=3 左右反弹），接住加 10 分、漏掉扣 5 分（不低于0）；③撞到球时播放一次短音效（Sound buffer 占位），菜单有背景循环音（mixer.music 加载不了就用 Sound 循环播放替代，或留注释说明）；④30 秒倒计时并显示在左上角；⑤最高分用 save.json 存档，启动时读档，容错（JSONDecodeError/FileNotFoundError/OSError）+ 安全写盘（先写 tmp 再 replace）；⑥撞到球时球复位到顶部随机 x 且 vx 随机成 2~5 的整数保留方向符号；⑦代码分文件：sprites.py（Paddle/Ball 类）、save.py（load_save/save_high）、main.py（主循环）。提示：用 from sprites import Paddle, Ball 导入；进游戏时重置分数、时间、球和挡板位置。注意：网页里没有显示器也没有声卡，请点"在 VS Code 里打开"运行。
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
          # 三状态切换 + 进游戏重置
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
      # 三状态绘制
      pygame.display.flip()
      clock.tick(60)
  pygame.quit()
checklist:
- 三个文件分工清晰（sprites.py/save.py/main.py）
- 中文标题和中文提示正常显示
- 三状态切换完整（菜单/游戏/结束）
- 挡板持续移动且边界限制正确
- 球下落、左右反弹正确
- 接球加分、漏球扣分且复位
- 撞球有音效
- 30 秒倒计时并在画面显示
- 结束画面显示得分和最高分
- R 重开、Q 回菜单
- 存档容错（三种异常）+ 安全写盘（tmp+replace）
- 处理了 QUIT，窗口不卡死
- 结尾 pygame.quit()
```
