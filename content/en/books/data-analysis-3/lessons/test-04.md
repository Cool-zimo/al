# Chapter 4 · Statistical plots with seaborn · Master quiz

> 8 questions. This chapter answers one question: "how do you produce the most informative, best-looking statistical plots with the least code?"
> **You must answer every question correctly to pass the chapter.**

## Part 1 · Multiple choice

---

```quiz
type: choice
exam: true
q: Now that matplotlib exists, why learn seaborn at all?
options:
- matplotlib cannot draw statistical plots
- seaborn adds statistical semantics on top of matplotlib (hue, faceting, density estimation), so one line produces grouped, fitted plots
- seaborn is ten times faster than matplotlib
- seaborn replaces matplotlib, and you can only pick one
answer: 1
explain: seaborn is not a replacement for matplotlib, it sits on top of it. It packages the high-frequency needs of statistical plotting - colouring by a column, drawing density curves, and faceting into a grid - into parameters such as hue, col, and kind, removing the boilerplate of manual loops, palettes, and legends. The underlying engine is still matplotlib, so the two can be mixed.
```

```quiz
type: choice
exam: true
q: You want to see both "the real frequency distribution of bill amounts" and "the smoothed density shape" at the same time. What is the recommended approach?
options:
- Draw two separate figures, one histplot and one kdeplot
- histplot(..., kde=True), overlaying the histogram and the density curve on one figure
- Only draw kdeplot because histograms are ugly
- Use displot(kind='ecdf')
answer: 1
explain: histplot has a built-in kde=True parameter that overlays a kernel density curve on the histogram, letting the reader see both "the raw frequencies" and "the fitted trend". This is not wrong, it is the officially recommended overlay. Two separate figures are harder to compare, and ECDF answers a cumulative-proportion question instead.
```

```quiz
type: choice
exam: true
q: Which group of functions is Figure-level (returning a FacetGrid and supporting faceting)?
options:
- histplot / kdeplot / ecdfplot
- relplot / displot / catplot
- scatterplot / boxplot / heatmap
- lineplot / barplot / countplot
answer: 1
explain: relplot, displot, and catplot are Figure-level functions. They return a FacetGrid object and support col/row faceting plus height/aspect sizing. scatterplot, lineplot, histplot, kdeplot, boxplot, violinplot, barplot, countplot, and heatmap are Axes-level functions: they draw into a supplied ax and do not facet on their own.
```

```quiz
type: choice
exam: true
q: You are drawing a scatter plot with relplot and want to colour points automatically by "smoker". Which parameter is correct?
options:
- color='smoker'
- hue='smoker'
- group='smoker'
- by='smoker'
answer: 1
explain: hue is seaborn's universal parameter for "colour by this column", supported by nearly every plotting function. color can only set one fixed colour, while group and by are not valid seaborn parameters.
```

```quiz
type: choice
exam: true
q: You are drawing a correlation matrix heatmap and want numeric values inside the cells and the upper triangle hidden to avoid duplicated information. Which parameter and operation should you use?
options:
- annot=True; set the upper-triangle positions of the matrix to NaN before passing it in
- annot=True; pass a boolean matrix whose upper triangle is True to the mask parameter
- fmt='.2f'; use col_wrap to hide the upper triangle
- linewidths=0; manually delete the upper-triangle columns
answer: 1
explain: annot=True annotates each cell (combined with fmt='.2f' to control decimal places). Hiding the upper triangle means building a mask with np.triu(np.ones_like(corr, dtype=bool)), whose upper triangle is True, then passing it to heatmap(mask=...), which leaves that area blank. This is the standard technique for displaying a correlation matrix.
```

## Part 2 · Hands-on

---

```quiz
type: function
exam: true
q: Write a function corr_info that takes a DataFrame and returns a tuple of the two column names with the largest absolute pairwise correlation, together with the absolute value of that correlation as a float rounded to 3 decimal places. If the DataFrame has fewer than two numeric columns, return None.
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
explain: Use corr() to build the correlation matrix, then k=1 on the upper triangle to keep only pairs of distinct columns. Two idxmax calls locate the maximum. This reproduces the "find the strongest correlation" operation behind the heatmap and returns a numeric result rather than an image.
```

```quiz
type: function
exam: true
q: Write a function grouped_means that takes a DataFrame, a categorical column name cat_col, and a numeric column name val_col. Return the mean of val_col for each group of cat_col, sorted from largest to smallest, as a dict whose keys are the group values and whose values are the means rounded to 2 decimal places.
func: grouped_means
starter: |
  import pandas as pd

  def grouped_means(df, cat_col, val_col):
      return {}
cases: |
  pd.DataFrame({'store':['London','London','New York','New York','Manchester'],'sales':[100,200,150,250,300]}) -> {'Manchester':300.0,'New York':200.0,'London':150.0}
  pd.DataFrame({'channel':['online','offline','online'],'conversion':[0.1,0.2,0.3]}) -> {'online':0.2,'offline':0.2}
hint: g=df.groupby(cat_col)[val_col].mean().sort_values(ascending=False); return {k:round(v,2) for k,v in g.items()}
explain: A single-column groupby followed by mean is the most basic grouped aggregation. sort_values descending and conversion to a dict gives the required shape. The result is graded numerically, with no plotting involved.
```

## Part 3 · Mini-project

---

```quiz
type: project
exam: true
q: Use seaborn to build a four-in-one exploratory visualisation of the tips dataset covering "distribution, relationship, categories, and correlation". In one script: load the data, draw a histogram of total_bill overlaid with a KDE curve, draw a scatter plot of total_bill vs tip coloured by sex, draw a boxplot grouped by day comparing total_bill, compute the correlation matrix of the numeric columns and draw an annotated heatmap with the upper triangle hidden. Save four PNG files and print a string stating which two columns have the strongest correlation.
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

  # 1. Histogram + KDE
  fig, ax = plt.subplots(figsize=(8, 5))
  # TODO: draw total_bill histogram, bins=20, kde=True
  ax.set_title('Bill amount distribution')
  fig.savefig('p1_hist.png')
  plt.close(fig)

  # 2. Scatter, coloured by sex
  fig, ax = plt.subplots(figsize=(8, 5))
  # TODO: relplot or scatterplot, x='total_bill', y='tip', hue='sex'
  fig.savefig('p2_scatter.png')
  plt.close(fig)

  # 3. Boxplot, grouped by day, comparing total_bill
  fig, ax = plt.subplots(figsize=(8, 5))
  # TODO: boxplot, x='day', y='total_bill'
  ax.set_title('Bill amount by day of week')
  fig.savefig('p3_box.png')
  plt.close(fig)

  # 4. Correlation matrix heatmap, annotated, upper triangle hidden
  num = tips.select_dtypes(include='number')
  corr = num.corr()
  mask = np.triu(np.ones_like(corr, dtype=bool), k=1)
  fig, ax = plt.subplots(figsize=(6, 5))
  # TODO: heatmap, annot=True, fmt='.2f', mask=mask
  ax.set_title('Numeric correlation matrix')
  fig.savefig('p4_heatmap.png')
  plt.close(fig)

  # 5. Print the strongest-correlation conclusion
  # TODO: find the pair with the largest absolute correlation (excluding the diagonal) and print the conclusion
checklist:
- Loaded the tips dataset successfully with no errors
- Histogram has bins=20 and an overlaid KDE curve (kde=True)
- Scatter uses hue='sex' with x and y mapped correctly
- Boxplot is grouped by day with total_bill on the y-axis
- Heatmap has annot=True and uses a mask to hide the upper triangle
- Prints a string stating which two columns have the strongest correlation
- All four PNG files were saved in the current directory
explain: This project chains the four core plot types of the chapter into one complete EDA visualisation workflow: distribution first (histplot+kde), then relationship (relplot/scatterplot+hue), then categorical comparison (boxplot), and finally a correlation matrix. Each step maps to a real analytical purpose rather than drawing for drawing's sake.
```
