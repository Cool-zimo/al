# 第 4 章 · pygame 入门 · 大测验

> 8 道题。这一章解决的是"为什么 tkinter 做不了正经游戏、pygame 怎么建窗口跑起来，以及游戏循环每帧到底要干哪三件事、画面怎么贴图、帧率怎么控住"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于"为什么游戏用 pygame 而不是 tkinter"，下列说法不正确的是？
options:
- tkinter 是事件驱动模型，而游戏需要的是每帧主动刷新的循环
- pygame 有 Clock 可以精确控制帧率，tkinter 靠 after 只能近似
- tkinter 内置了声音播放和硬件加速，所以做游戏其实更合适
- pygame 用 Surface 位图渲染，支持透明 PNG 和 Rect 碰撞检测
answer: 2
explain: tkinter 恰恰是没有声音、硬件加速弱的那个，这才是它做游戏的瓶颈。pygame 的优势正是主动刷新循环、Clock 精确控帧、Surface 位图渲染、内置 mixer 声音和 Rect 碰撞。
```

```quiz
type: choice
q: 下面哪段 pygame 代码会导致窗口关不掉（必须杀进程）？
options:
- 循环里写了 for event in pygame.event.get(): 并判断 QUIT
- 循环里调用了 pygame.display.flip()
- while running: 里只做了 screen.fill((255,255,255)) 和 pygame.display.flip()，完全没处理事件队列
- 循环末尾调用了 pygame.quit()
answer: 2
explain: pygame 必须在循环里调用 pygame.event.get() 排空事件队列并判断 QUIT，否则操作系统发来的关闭请求被忽略，窗口关不掉、程序无响应。不处理事件队列是最典型的"窗口僵尸"问题。
```

```quiz
type: choice
q: 游戏循环每帧应该按什么顺序执行？
options:
- 重绘 → 处理事件 → 更新状态
- 处理事件 → 更新状态 → 重绘
- 更新状态 → 重绘 → 处理事件
- 顺序无所谓，怎么写效果都一样
answer: 1
explain: 标准顺序是处理事件→更新状态→渲染。先响应输入，再算新状态，最后把最新状态画出来。如果先渲染再更新，这一帧画的是上一帧的位置，会有一帧延迟。
```

```quiz
type: choice
q: 关于 Surface 和 blit，下列说法正确的是？
options:
- Surface 只是窗口，加载的图片不是 Surface
- screen.blit(source, (x, y)) 表示把 source 这块像素画布贴到 screen 的 (x, y) 位置
- blit 的作用是"把 source 从 screen 上裁掉一块"
- 加载图片后不需要 convert，pygame 会自动优化
answer: 1
explain: Surface 就是一块像素画布，窗口和加载的图片都是 Surface。blit 是把 source 贴到 dest 的指定位置（bit block transfer）。加载图片后应 convert() 或 convert_alpha() 转换像素格式以加速 blit。
```

```quiz
type: choice
q: 关于 pygame.time.Clock 和 tick，下列说法正确的是？
options:
- clock.tick(60) 的意思是"让循环每秒最多跑 60 次"，即限制到约 60 帧
- clock.tick() 必须传一个负数才生效
- 不调用 tick 也能稳定 60 帧
- tick 返回的是键盘按键对象
answer: 0
explain: Clock 的用法是每帧末尾调用 clock.tick(60)，它会在需要的地方插入延时，使循环频率不超过 60 次/秒（即约 60 FPS），从而稳定帧率并让出 CPU。tick 返回的是距上一帧经过的毫秒数，不是按键。
```

## 第二部分 · 动手题

```quiz
type: local
q: 写一个 pygame 程序：创建 640x480 的窗口，标题"我的窗口"，背景填充天蓝色 (135,206,235)。事件循环里处理 QUIT 能正常关闭，每帧结尾都调用 pygame.display.flip()。初始化、建窗口、事件循环、fill、flip、quit 一个都不能少。注意：网页里没有显示器，请点"在 VS Code 里打开"运行（需先 pip install pygame）。
files: |
  main.py
starter: |
  import pygame

  # 初始化 + 建窗口 + 事件循环 + 填充天蓝色 + flip + quit
checklist:
- 调用了 pygame.init()
- 窗口尺寸 640x480
- 标题"我的窗口"
- 背景填充天蓝色 (135,206,235)
- 处理了 QUIT 事件
- 每帧调用了 flip
- 结尾调用 pygame.quit()
```

```quiz
type: local
q: 写一个 pygame 程序：800x600 黑底窗口。一个白色小球（用 pygame.draw.circle，中心 ball_y、半径 20）在垂直方向上下弹跳，每帧 ball_y 加 dy（初始 4），碰到上下边界（ball_y-radius <= 0 和 ball_y+radius >= HEIGHT）就反弹（dy = -dy）。事件循环只处理 QUIT。提示：注意坐标指圆心，边界判断要算上半径。注意：网页里没有显示器，请点"在 VS Code 里打开"运行（需 pip install pygame）。
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
      # 处理 QUIT
      # 更新 ball_y，判断上下边界反弹
      # fill + draw.circle + flip
  pygame.quit()
checklist:
- 处理了 QUIT 事件
- 球在垂直方向上下弹跳
- 上下边界反弹判断正确（含半径）
- 每帧 fill 清空 + circle + flip
- 结尾 pygame.quit()
```

## 第三部分 · 小项目

```quiz
type: project
q: 做一个"弹跳方块"小游戏：800x600 窗口，黑底。画面里有一个红色方块（用 pygame.draw.rect，左上角 player_x/player_y，尺寸 50x50），它在水平方向来回弹跳：每帧 player_x += speed（初始 5），碰到左右边界（算上方块宽度）就 speed = -speed 反弹。加一个 Clock，每帧末尾 clock.tick(60) 限制帧率。事件循环处理 QUIT。另外：1）按空格键时把方块颜色在红色 (255,0,0) 和蓝色 (0,0,255) 之间切换（用 KEYDOWN 判断 K_SPACE）；2）方块同时在垂直方向慢慢往下掉（player_y 每帧加 2，碰到下边界时 y 反弹）；3）在方块上方画一个白色小球（pygame.draw.circle，圆心 player_x+25, player_y-30，半径 15）跟着方块走。提示：注意坐标指左上角，边界用 WIDTH-50 和 HEIGHT-50。注意：网页里没有显示器，请点"在 VS Code 里打开"运行（需 pip install pygame）。
files: |
  main.py
starter: |
  import pygame

  pygame.init()
  WIDTH, HEIGHT = 800, 600
  screen = pygame.display.set_mode((WIDTH, HEIGHT))
  pygame.display.set_caption("弹跳方块")

  clock = pygame.time.Clock()

  player_x, player_y = 375, 100
  speed_x = 5
  speed_y = 2
  color = (255, 0, 0)

  running = True
  while running:
      # 处理 QUIT + SPACE 切换 color
      # 更新 player_x / player_y，左右上下边界反弹
      # fill 黑底 + draw.rect 方块 + draw.circle 小球 + flip
      # clock.tick(60)
  pygame.quit()
checklist:
- 处理了 QUIT 事件
- 创建了 Clock 并每帧 clock.tick(60)
- 方块水平来回弹跳，左右边界判断含宽度 50
- 方块垂直下落并在下边界反弹
- 按空格键切换方块颜色（红/蓝）
- 方块上方画了白色小球跟随方块
- 每帧 fill + flip
- 结尾 pygame.quit()
```
