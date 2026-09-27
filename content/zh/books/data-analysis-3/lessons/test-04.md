# 第 4 章 · seaborn 统计图 · 大测验

> 8 道题。这一章解决的是"用最少的代码，画出信息密度最高、最好看的统计图"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

---

```quiz
type: choice
exam: true
q: 已经有 matplotlib，为什么还要学 seaborn？
options:
- matplotlib 画不出统计图
- seaborn 在 matplotlib 之上封装了统计语义（hue、分面、密度估计），一行代码就能画出带分组和拟合的图
- seaborn 比 matplotlib 快 10 倍
- seaborn 是 matplotlib 的替代品，二者只能选一个
answer: 1
explain: seaborn 不是替代 matplotlib，而是站在它肩上。它把"按某列分色""画密度曲线""分面成网格"这些统计绘图的高频需求封装成参数（hue、col、kind），省去手动循环、配色、图例的样板代码。底层仍然是 matplotlib，两者可以混用。
```

```quiz
type: choice
exam: true
q: 想同时看到"账单金额的真实频次分布"和"平滑的密度形状"，最推荐的做法是？
options:
- 分别画两张图：一张 histplot，一张 kdeplot
- histplot(..., kde=True)，在一张图上叠加直方图和密度曲线
- 只画 kdeplot，直方图太丑
- 用 displot(kind='ecdf')
answer: 1
explain: histplot 内置 kde=True 参数，会在直方图上叠加一条核密度曲线，让读图的人同时看到"原始频次"和"拟合趋势"。这不是错误写法，而是官方推荐的叠加方式。两张图分开画对比不便，ECDF 则回答的是累计占比问题。
```

```quiz
type: choice
exam: true
q: 下面哪组函数是 Figure-level（返回 FacetGrid，可以分面）？
options:
- histplot / kdeplot / ecdfplot
- relplot / displot / catplot
- scatterplot / boxplot / heatmap
- lineplot / barplot / countplot
answer: 1
explain: relplot、displot、catplot 是 Figure-level 函数，返回 FacetGrid 对象，支持 col/row 分面、height/aspect 调尺寸。而 scatterplot、lineplot、histplot、kdeplot、boxplot、violinplot、barplot、countplot、heatmap 是 Axes-level 函数，只能画在指定的 ax 上，不自带分面能力。
```

```quiz
type: choice
exam: true
q: 用 relplot 画散点图，想按"吸烟与否"自动分色，正确参数是？
options:
- color='smoker'
- hue='smoker'
- group='smoker'
- by='smoker'
answer: 1
explain: hue 是 seaborn 里"按某列分色"的通用参数名，几乎所有绘图函数都支持。color 只能指定一个固定颜色，group 和 by 不是 seaborn 的有效参数。
```

```quiz
type: choice
exam: true
q: 画相关矩阵热力图，想在格子里显示相关系数数值，并且隐藏上三角（避免信息重复），分别要用哪些参数/操作？
options:
- annot=True；把矩阵的上三角位置设为 NaN 再传入
- annot=True；mask 参数传入一个上三角为 True 的布尔矩阵
- fmt='.2f'；用 col_wrap 隐藏上三角
- linewidths=0；手动删除上三角的列
answer: 1
explain: annot=True 会在每个格子里标注数值（可配合 fmt='.2f' 控制小数位）。隐藏上三角的做法是用 np.triu(np.ones_like(corr, dtype=bool)) 生成一个上三角为 True 的 mask 矩阵，传给 heatmap(mask=...) 即可把上三角变成空白。这是显示相关矩阵的标准技巧。
```

## 第二部分 · 动手题

---

```quiz
type: function
exam: true
q: 写一个函数 corr_info，接收 DataFrame，返回各数值列两两之间绝对值最大的那对组合的列名（元组）和对应相关系数的绝对值（float，保留 3 位小数）。若 DataFrame 不足 2 列数值列，返回 None。
func: corr_info
starter: |
  import pandas as pd
  import numpy as np

  def corr_info(df):
      return None
cases: |
  pd.DataFrame({'a':[1,2,3,4,5],'b':[2,4,6,8,10],'c':[1,1,2,2,3]}) -> (('a','b'), 1.0)
  pd.DataFrame({'x':[1,2,3],'y':[3,2,1]}) -> (('x','y'), 1.0)
  pd.DataFrame({'a':[1,2,3]}) -> None
hint: corr=df.corr(); mask=np.triu(np.ones(corr.shape,dtype=bool),k=1); mc=corr.abs().where(mask); v=mc.max().max(); i=mc.stack().idxmax(); return (tuple(sorted(i)), round(float(v),3))
explain: 用 corr() 算相关矩阵，上三角取 k=1 只保留不同列之间的配对，用 idxmax 两次定位最大值位置。这个函数复现了热力图中"找最强相关"的操作，返回的是数值结果而非图片。
```

```quiz
type: function
exam: true
q: 写一个函数 grouped_means，接收 DataFrame 和一个分类列名 cat_col、一个数值列名 val_col，返回按 cat_col 分组后各组 val_col 的均值，结果按均值从大到小排列，以 dict 形式返回（键为分组值，值为均值，保留 2 位小数）。
func: grouped_means
starter: |
  import pandas as pd

  def grouped_means(df, cat_col, val_col):
      return {}
cases: |
  pd.DataFrame({'门店':['北京','北京','上海','上海','广州'],'销售额':[100,200,150,250,300]}) -> {'广州':300.0,'上海':200.0,'北京':150.0}
  pd.DataFrame({'渠道':['线上','线下','线上'],'转化':[0.1,0.2,0.3]}) -> {'线上':0.2,'线下':0.2}
hint: g=df.groupby(cat_col)[val_col].mean().sort_values(ascending=False); return {k:round(v,2) for k,v in g.items()}
explain: groupby 单列 + mean 是最基础的分组聚合，sort_values 降序后转成 dict。用数值结果判分，不涉及绘图。
```

## 第三部分 · 小项目

---

```quiz
type: project
exam: true
q: 用 seaborn 对 tips 数据集做一份"分布 + 关系 + 分类 + 相关"四合一探索性可视化。要求在一个脚本里完成：加载数据，画出 total_bill 的直方图并叠加 KDE 曲线，画 total_bill 与 tip 的散点图并按 sex 分色，画按 day 分组的箱线图比较 total_bill，计算数值列的相关矩阵并画带数值标注的热力图（隐藏上三角）。最终保存 4 张 PNG，并输出"哪两列相关性最强"的结论字符串。
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import seaborn as sns
  import pandas as pd
  import numpy as np

  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False

  tips = sns.load_dataset('tips')

  # 1. 直方图 + KDE
  fig, ax = plt.subplots(figsize=(8, 5))
  # TODO: 画 total_bill 直方图，bins=20，kde=True
  ax.set_title('账单金额分布')
  fig.savefig('p1_hist.png')
  plt.close(fig)

  # 2. 散点图，按 sex 分色
  fig, ax = plt.subplots(figsize=(8, 5))
  # TODO: relplot 或 scatterplot，x='total_bill', y='tip', hue='sex'
  fig.savefig('p2_scatter.png')
  plt.close(fig)

  # 3. 箱线图，按 day 分组比较 total_bill
  fig, ax = plt.subplots(figsize=(8, 5))
  # TODO: boxplot，x='day', y='total_bill'
  ax.set_title('各星期账单金额箱线图')
  fig.savefig('p3_box.png')
  plt.close(fig)

  # 4. 相关矩阵热力图，标注数值，隐藏上三角
  num = tips.select_dtypes(include='number')
  corr = num.corr()
  mask = np.triu(np.ones_like(corr, dtype=bool), k=1)
  fig, ax = plt.subplots(figsize=(6, 5))
  # TODO: heatmap，annot=True，fmt='.2f'，mask=mask
  ax.set_title('数值列相关矩阵')
  fig.savefig('p4_heatmap.png')
  plt.close(fig)

  # 5. 输出最强相关结论
  # TODO: 从 corr 中找出绝对值最大的配对（排除对角线），打印结论
checklist:
- 是否成功加载了 tips 数据集，没有报错
- 直方图是否正确设置了 bins=20 且叠加了 KDE 曲线（kde=True）
- 散点图是否用 hue='sex' 分色，且 x/y 映射正确
- 箱线图是否按 day 分组、y 轴为 total_bill
- 热力图是否设置了 annot=True 且用 mask 隐藏了上三角
- 是否输出了"哪两列相关性最强"的结论字符串
- 4 张 PNG 是否都成功保存到当前目录
explain: 这个项目把本章四类核心图形串成一条完整的 EDA 可视化链路：先看分布（histplot+kde），再看关系（relplot/scatterplot+hue），再看分类比较（boxplot），最后用相关矩阵收尾。每一步都对应一个真实的分析目的，而不是为了画图而画图。
```
