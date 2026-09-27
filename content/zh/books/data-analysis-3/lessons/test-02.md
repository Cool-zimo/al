# 第 2 章 · 常用图表怎么选 · 大测验

> 8 道题。这一章解决的是"该用哪张图"的问题：柱状、折线、散点、直方图、饼图。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 有 15 个城市要画柱状图，城市名还挺长，最合理的选择是？
options:
- 用 bar 纵向画，figsize 设小一点
- 用 barh 横向画
- 用折线图
- 用饼图
answer: 1
explain: 15 个类别纵向画，x 轴刻度会互相重叠糊成一片；城市名长更雪上加霜。换成 barh 横向后每个城市独占一行，互不干扰。类别超过 7–8 个就该考虑横向了。
```

```quiz
type: choice
q: 想在同一张图上同时展示销售额（万元）和客单价（元），两者量级差 100 倍，正确做法是？
options:
- 把两个 y 轴都设成 0-300，压缩客单价
- 用 ax1.twinx() 创建第二个共享 x 轴的 y 轴
- 直接画在同一根 y 轴上
- 用饼图
answer: 1
explain: twinx 创建共享 x 轴、独立 y 轴的坐标系，让两个量级不同的量各用各的刻度。直接画在同一轴上会压扁其中一个（量级小的变成贴着 x 轴的一条线）。记得两个轴要分别配色，图例要合并 handles。
```

```quiz
type: choice
q: 有 10000 个散点要画，想一眼看出密度分布，最合理的选择是？
options:
- 用 ax.scatter 把所有点都画出来
- 用 ax.hexbin 做六边形密度图
- 用 ax.bar 画柱状图
- 用 ax.plot 画折线
answer: 1
explain: 上万点用 scatter 会互相重叠糊成一片，即使加 alpha 也难看清密度核心。hexbin 把平面切六边形格子、按格子内点数上色，既能看出密度核心又比 scatter 快得多。
```

```quiz
type: choice
q: 有 10000 个数据点要画直方图，bins 选多少比较合理？
options:
- bins=5
- bins=20
- bins=100
- bins=5000
answer: 1
explain: 经验区间是 √n 到 n/10：10000 的开方是 100，10000/10 是 1000，取中间值 20–100 都合理。20 能看到整体形状又不至于太粗糙。bins=5 会把形状抹平，bins=5000 几乎每个点独占一个 bin，全是噪声。
```

```quiz
type: choice
q: 有 8 个类别的构成要展示，最合理的选择是？
options:
- 饼图，分成 8 块
- 横向条形图
- 折线图
- 饼图，但把中间挖空成环形
answer: 1
explain: 8 个类别画饼图，扇区会细得像牙签、标签挤成一团，而且角度难以精确比较。横向条形图用长度做对比，8 个类别轻松放下，差异一目了然。环形图本质上仍是角度比较，缺点一个没少。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 画分组柱状图：两个门店（北京、上海）、两个季度（Q1、Q2）的销售额，错开 w/2 排列，设置图例，figsize=(8,5)
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import numpy as np
  
  stores = ['北京', '上海']
  q1 = [620, 710]
  q2 = [660, 810]
  
  # x = np.arange(...)
  # w = 0.35
  # ax.bar(x - w/2, ...)
  # ax.bar(x + w/2, ...)
  # ax.set_xticks / set_xticklabels
  # ax.legend
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "北京" in __out
hint: x = np.arange(len(stores))，w = 0.35，两组用 x-w/2 和 x+w/2 错开。设置 xticks 为 x、xticklabels 为 stores。ax.legend() 不能漏。
explain: 分组柱状图的核心是"错开半个柱宽"：x-w/2 和 x+w/2 让两组柱子紧贴而不重叠。xticks 要放回整数位置、xticklabels 换成中文。图例必须显式调用 legend 才会显示。
```

```quiz
type: code
q: 用 twinx 画双 Y 轴：左轴红色折线 months 对应 sales（万元），右轴蓝色折线 months 对应 avg_price（元），两个 y 轴分别设标签，保存到 out.png
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  months = ['1月', '2月', '3月']
  sales = [120, 135, 128]
  avg_price = [320, 315, 340]
  
  # fig, ax1 = plt.subplots()
  # ax1.plot(..., color='#e41a1c')
  # ax2 = ax1.twinx()
  # ax2.plot(..., color='#377eb8')
  # 两个轴分别 set_ylabel
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "saved" in __out
hint: ax1 画 sales 用红色并设 y 标签"销售额（万元）"；ax2 = ax1.twinx() 画 avg_price 用蓝色并设 y 标签"客单价（元）"。两个轴分别 tick_params(axis='y', labelcolor=...) 染色。
explain: twinx 的核心是"共享 x、独立 y"，第二根轴用 ax1.twinx() 创建。两个轴要分别配色（刻度和标签都用对应颜色），否则读者分不清哪条线对应哪个轴。保存才能把图渲染出来。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「五门店经营分析」：barh 画各门店销售额 → scatter 画"面积 vs 销售额"（颜色映射租金、加 colorbar）→ hist 画销售额分布 → boxplot 画三门店日销售额对比。四张图合成一个 2×2 网格，figsize=(12,10)，suptitle 为"门店经营分析"
checklist:
- 用 plt.subplots(2, 2) 创建了 2×2 网格
- 左上子图画了 barh 横向柱状图
- 右上子图画了 scatter，颜色映射第三维，并添加了 colorbar
- 左下子图画了 hist 直方图
- 右下子图画了 boxplot 箱线图
- 设置了 fig.suptitle 和 fig.tight_layout
- 代码能跑通，没有报错
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import numpy as np
  
  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False
  
  np.random.seed(42)
  stores = ['北京', '上海', '广州', '深圳', '杭州']
  sales = [1280, 1520, 980, 1100, 860]
  area = np.random.uniform(50, 200, 100)
  rent = np.random.uniform(10, 50, 100)
  beijing = np.random.normal(120, 20, 200)
  shanghai = np.random.normal(140, 30, 200)
  guangzhou = np.random.normal(110, 15, 200)
  
  # fig, axes = plt.subplots(2, 2, figsize=(12, 10))
  # axes[0, 0].barh(...)
  # axes[0, 1].scatter(..., c=rent, cmap='viridis') + fig.colorbar
  # axes[1, 0].hist(...)
  # axes[1, 1].boxplot([beijing, shanghai, guangzhou])
  # fig.suptitle(...) + fig.tight_layout()
hint: 用 axes.flat 迭代最省事；scatter 后 fig.colorbar(sc, ax=axes[0,1])；boxplot 要 set_xticklabels(['北京','上海','广州'])。tight_layout 在所有绘图完成后调用。
explain: 这个项目串起第 2 章的全部图表：barh 横向对比、scatter 第三维映射、hist 看分布、boxplot 看异常。用网格合成一张分析页，是真实报告的标准形态。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1（分组柱状图）：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

stores = ['北京', '上海']
q1 = [620, 710]
q2 = [660, 810]

fig, ax = plt.subplots(figsize=(8, 5))
x = np.arange(len(stores))
w = 0.35
ax.bar(x - w/2, q1, w, label='第一季度')
ax.bar(x + w/2, q2, w, label='第二季度')
ax.set_xticks(x)
ax.set_xticklabels(stores)
ax.legend()
ax.set_ylabel('销售额（万元）')
ax.set_title('各门店季度销售额对比')
fig.savefig('out.png')
```

**动手题 2（双 Y 轴）：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

months = ['1月', '2月', '3月']
sales = [120, 135, 128]
avg_price = [320, 315, 340]

fig, ax1 = plt.subplots(figsize=(8, 5))
ax1.plot(months, sales, color='#e41a1c', marker='o', label='销售额')
ax1.set_ylabel('销售额（万元）', color='#e41a1c')
ax1.tick_params(axis='y', labelcolor='#e41a1c')

ax2 = ax1.twinx()
ax2.plot(months, avg_price, color='#377eb8', marker='s', label='客单价')
ax2.set_ylabel('客单价（元）', color='#377eb8')
ax2.tick_params(axis='y', labelcolor='#377eb8')

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
stores = ['北京', '上海', '广州', '深圳', '杭州']
sales = [1280, 1520, 980, 1100, 860]
area = np.random.uniform(50, 200, 100)
rent = np.random.uniform(10, 50, 100)
beijing = np.random.normal(120, 20, 200)
shanghai = np.random.normal(140, 30, 200)
guangzhou = np.random.normal(110, 15, 200)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

axes[0, 0].barh(stores, sales, color='#377eb8')
axes[0, 0].set_title('各门店销售额')

sc = axes[0, 1].scatter(area, sales, c=rent, cmap='viridis', alpha=0.6, s=50)
fig.colorbar(sc, ax=axes[0, 1], label='租金（万元）')
axes[0, 1].set_title('面积 vs 销售额')

axes[1, 0].hist(beijing, bins=30, color='#4daf4a', edgecolor='white')
axes[1, 0].set_title('销售额分布')

axes[1, 1].boxplot([beijing, shanghai, guangzhou],
                   labels=['北京', '上海', '广州'])
axes[1, 1].set_title('三门店日销售额对比')

fig.suptitle('门店经营分析')
fig.tight_layout()
fig.savefig('out.png')
plt.close(fig)
print('done')
```

</details>

## 这一章，你学会了什么

- **柱状图 `bar`/`barh`**：分类对比，类别多或名字长用横向
- **折线图 `plot`**：看趋势，双 Y 轴用 `twinx`
- **散点图 `scatter`**：两个变量的关系，颜色/大小映射第三维
- **直方图 `hist`** 与 **箱线图 `boxplot`**：看分布、看异常
- **饼图的争议**：人眼不擅长比角度，多用条形图替代

下一章讲**让图会说话**——多子图布局、自解释要素、标注、配色、以及 pandas 的 df.plot。
