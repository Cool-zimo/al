# 第 3 章 · 让图会说话 · 大测验

> 8 道题。这一章解决的是"图能不能自解释、能不能讲清一个故事"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 用 plt.subplots(1, 3) 创建一行三列的子图，正确访问第一个子图的方式是？
options:
- axes[0, 0]
- axes[0]
- axes[:, 0]
- axes[1]
answer: 1
explain: 1 行或 1 列的 subplots 返回的是一维数组，用单下标 axes[0] 访问。axes[0, 0] 是二维写法，会报 IndexError。只有 nrows>1 且 ncols>1 时 axes 才是二维的。想统一处理，可用 axes.flat 迭代。
```

```quiz
type: choice
q: 关于网格线，推荐的做法是？
options:
- 用黑色实线，越粗越好，方便读数
- 用虚线 + 低透明度（如 alpha=0.4），只开一个方向，让它弱于数据
- 完全不用网格，网格是多余的
- 网格颜色用红色，最醒目
answer: 1
explain: 网格只是辅助读数的参考线，永远要弱于数据。推荐虚线+alpha 0.3~0.5，折线图通常只开横向（axis='y'）让眼睛沿数值方向对齐。黑粗网格会淹没数据，完全不用则读者难对齐数值。
```

```quiz
type: choice
q: 想在 y=150 的位置画一条横向参考线表示目标值，应该用哪个方法？
options:
- ax.axvline(y=150)
- ax.axhline(y=150)
- ax.axline(x=150)
- ax.annotate(y=150)
answer: 1
explain: axhline 画横向参考线（参数是 y 位置，定值），axvline 画纵向（参数是 x 位置）。axvline(y=150) 会报错（它只接受 x 参数）。annotate 是标文字加箭头，不是画参考线。
```

```quiz
type: choice
q: 想区分"北京、上海、广州"三个平等类别，应该用什么颜色方案？
options:
- 用 viridis 连续色带取三个点
- 用 tab10 或 Set1 等离散色板
- 用红色和绿色两种颜色
- 用灰度色
answer: 1
explain: 平等类别要用离散色板（tab10、Set1），三类在视觉上地位平等。viridis 是连续色带，取出来的颜色有明暗主次，会暗示"谁重要"。红绿对比是色盲雷区（约 8% 男性分不清）。灰度虽色盲友好但区分度不足。
```

```quiz
type: choice
q: 关于 df.plot() 和 matplotlib 的混用，正确的是？
options:
- df.plot() 会修改原 DataFrame
- df.plot(ax=ax) 可以把数据画到指定的坐标系上，并继续用 ax 的方法加工
- df.plot 只能画折线图
- df.plot 不需要 import matplotlib
answer: 1
explain: df.plot(ax=ax) 把数据渲染到指定的 Axes 对象上，返回该 ax，因此可以继续 ax.set_title / ax.legend / ax.annotate。它不会修改原 DataFrame（返回的是图，不是数据）。kind 参数支持 bar/box/scatter 等多种图型。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 创建 2×2 子图网格，在每个子图上各画一条折线（x=[1,2,3]），用 axes.flat 迭代，最后调用 tight_layout 并保存
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  fig, axes = plt.subplots(2, 2, figsize=(8, 8))
  
  # for ax in axes.flat:
  #     ax.plot([1, 2, 3], [1, 2, 3])
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "saved" in __out
hint: 用 for ax in axes.flat: ax.plot([1,2,3],[1,2,3]) 迭代画完，再 fig.tight_layout() 和 fig.savefig('out.png')。
explain: axes.flat 把 2×2 数组展平成迭代器，循环里画图最省事。tight_layout 必须放在所有绘图之后调用，否则新增内容会溢出。
```

```quiz
type: code
q: 画折线图并补齐全套自解释要素：标题"2025 上半年销售额对比"、x 轴标签"月份"、y 轴标签"销售额 / 万元"、legend、横向虚线网格 alpha=0.4
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  months = ['1月','2月','3月','4月','5月','6月']
  beijing = [120, 135, 128, 160, 175, 190]
  shanghai = [110, 118, 130, 140, 155, 168]
  
  fig, ax = plt.subplots()
  ax.plot(months, beijing, label='北京')
  ax.plot(months, shanghai, label='上海')
  
  # ax.set_title / set_xlabel / set_ylabel
  # ax.legend()
  # ax.grid(axis=..., linestyle=..., alpha=...)
  
  fig.savefig('out.png')
  print("saved")
tests:
- assert "saved" in __out
hint: 四个要素：ax.set_title('2025 上半年销售额对比')、ax.set_xlabel('月份')、ax.set_ylabel('销售额 / 万元')、ax.legend()。网格：ax.grid(axis='y', linestyle='--', alpha=0.4)。
explain: 自解释四要素各管一件事：标题交代"比什么"，轴标签交代"横竖轴是什么含单位"，legend 交代"哪条线是谁"，grid 帮读者对齐数值。缺一个就不是自解释的图。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「门店销售分析报告」：2×2 网格 → 折线图（标题含"对比"、自解释四要素齐全）→ barh 横向柱状图 → boxplot 三门店对比 → scatter 面积vs销售额（颜色映射租金、colorbar）。每图都设标题，整张图 suptitle，最后 tight_layout 保存为 figsize=(12,10)、dpi=150
checklist:
- 用 plt.subplots(2, 2, figsize=(12, 10)) 建网格
- 至少一张图用了 annotate 或 axhline 标注关键点
- 每张图都有标题、轴标签、图例或 colorbar
- 用了色盲友好配色（tab10/Set1）
- 去掉了上/右边框或设置了网格样式
- 调用了 fig.suptitle 和 fig.tight_layout
- 用 fig.savefig(..., dpi=150, bbox_inches='tight') 保存
- 代码能跑通，没有报错
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import numpy as np
  
  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False
  
  np.random.seed(42)
  months = ['1月','2月','3月','4月','5月','6月']
  beijing = [120, 135, 128, 160, 175, 190]
  shanghai = [110, 118, 130, 140, 155, 168]
  stores = ['北京', '上海', '广州', '深圳', '杭州']
  sales = [1280, 1520, 980, 1100, 860]
  area = np.random.uniform(50, 200, 100)
  rent = np.random.uniform(10, 50, 100)
  daily_bj = np.random.normal(120, 20, 200)
  daily_sh = np.random.normal(140, 30, 200)
  daily_gz = np.random.normal(110, 15, 200)
  
  cmap = plt.get_cmap('tab10')
  
  # fig, axes = plt.subplots(2, 2, figsize=(12, 10))
  # 折线图 / barh / boxplot / scatter
  # fig.suptitle(...) + fig.tight_layout()
  # fig.savefig(..., dpi=150, bbox_inches='tight')
hint: 折线用 cmap(0)/cmap(1) 配色；barh 记得 set_xlabel 带单位；boxplot 要 set_xticklabels；scatter 后 fig.colorbar；tight_layout 放最后。
explain: 这个项目是前三章的综合：网格布局、四要素、标注参考线、配色、df.plot/matplotlib 混用、保存参数。走通一遍，你就具备了"把数据讲成一个故事"的完整能力。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(8, 8))
for ax in axes.flat:
    ax.plot([1, 2, 3], [1, 2, 3])
fig.tight_layout()
fig.savefig('out.png')
```

**动手题 2：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

months = ['1月','2月','3月','4月','5月','6月']
beijing = [120, 135, 128, 160, 175, 190]
shanghai = [110, 118, 130, 140, 155, 168]

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(months, beijing, marker='o', label='北京')
ax.plot(months, shanghai, marker='s', linestyle='--', label='上海')

ax.set_title('2025 上半年销售额对比')
ax.set_xlabel('月份')
ax.set_ylabel('销售额 / 万元')
ax.legend()
ax.grid(axis='y', linestyle='--', alpha=0.4)

fig.tight_layout()
fig.savefig('out.png')
```

**小项目：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
plt.rcParams['axes.unicode_minus'] = False

np.random.seed(42)
months = ['1月','2月','3月','4月','5月','6月']
beijing = [120, 135, 128, 160, 175, 190]
shanghai = [110, 118, 130, 140, 155, 168]
stores = ['北京', '上海', '广州', '深圳', '杭州']
sales = [1280, 1520, 980, 1100, 860]
area = np.random.uniform(50, 200, 100)
rent = np.random.uniform(10, 50, 100)
daily_bj = np.random.normal(120, 20, 200)
daily_sh = np.random.normal(140, 30, 200)
daily_gz = np.random.normal(110, 15, 200)

cmap = plt.get_cmap('tab10')
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 折线图
axes[0, 0].plot(months, beijing, color=cmap(0), marker='o', label='北京')
axes[0, 0].plot(months, shanghai, color=cmap(1), marker='s', label='上海')
axes[0, 0].set_title('销售额趋势对比')
axes[0, 0].set_xlabel('月份')
axes[0, 0].set_ylabel('销售额 / 万元')
axes[0, 0].legend()
axes[0, 0].grid(axis='y', linestyle='--', alpha=0.4)

# 横向柱状图
axes[0, 1].barh(stores, sales, color=cmap(2))
axes[0, 1].set_title('各门店销售额')
axes[0, 1].set_xlabel('销售额 / 万元')

# 箱线图
axes[1, 0].boxplot([daily_bj, daily_sh, daily_gz],
                   labels=['北京', '上海', '广州'])
axes[1, 0].set_title('日销售额分布对比')
axes[1, 0].set_ylabel('日销售额 / 万元')

# 散点图
sc = axes[1, 1].scatter(area, sales, c=rent, cmap='viridis', alpha=0.6, s=50)
fig.colorbar(sc, ax=axes[1, 1], label='租金 / 万元')
axes[1, 1].set_title('面积 vs 销售额（颜色=租金）')
axes[1, 1].set_xlabel('面积 / ㎡')
axes[1, 1].set_ylabel('销售额 / 万元')

for ax in axes.flat:
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

fig.suptitle('门店销售分析报告')
fig.tight_layout()
fig.savefig('report.png', dpi=150, bbox_inches='tight')
plt.close(fig)
print('done')
```

</details>

## 这一章，你学会了什么

- **多子图**：`subplots` 三种排法、`sharex/sharey`、`GridSpec` 不规则布局、`tight_layout` 的时机
- **自解释四要素**：标题（主体+指标+时间）、轴标签（带单位）、图例、网格
- **标注与参考线**：`annotate` 三要素、`axhline/axvline`、文字位置留空间
- **配色**：色盲友好、colormap 的两种用法、seaborn 风格一行换全套
- **pandas 画图**：`df.plot(ax=ax)` 是快捷方式与 matplotlib 的桥梁

到这里，你已经具备了把数据讲成一个完整故事的能力。
