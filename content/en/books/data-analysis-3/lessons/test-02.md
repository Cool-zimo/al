# Chapter 2 · Choosing the Right Chart · Master Quiz

> 8 questions. This chapter answers the question "which chart should I use": bar, line, scatter, histogram and pie.
> **You must get them all right to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: You need a bar chart for 15 cities, and the city names are rather long. What is the most reasonable choice?
options:
- Draw vertical bars with a small figsize
- Draw horizontal bars with barh
- Use a line chart
- Use a pie chart
answer: 1
explain: With 15 categories drawn vertically, the x-axis ticks overlap into a mess; long city names make it worse. Switching to barh gives each city its own row, with no clashes. Once you have more than 7-8 categories, consider horizontal bars.
```

```quiz
type: choice
q: You want to show sales (£10k) and average price (£) on the same chart, and the two differ in scale by a factor of 100. What is the correct approach?
options:
- Set both y-axes to 0-300 and compress the average price
- Use ax1.twinx() to create a second y-axis sharing the x-axis
- Draw both directly on the same y-axis
- Use a pie chart
answer: 1
explain: twinx creates a coordinate system with a shared x-axis and independent y-axis, giving each differently scaled quantity its own ticks. Drawing both on one axis crushes one of them (the smaller scale becomes a line hugging the x-axis). Remember to colour the two axes separately and merge the legend handles.
```

```quiz
type: choice
q: You have 10000 scatter points to draw and want to see the density distribution at a glance. What is the most reasonable choice?
options:
- Draw all points with ax.scatter
- Use ax.hexbin to make a hexagonal density plot
- Use ax.bar to draw a bar chart
- Use ax.plot to draw a line
answer: 1
explain: Ten thousand points drawn with scatter overlap into a mess; even adding alpha struggles to reveal the density core. hexbin slices the plane into hexagonal cells coloured by point count, showing the density core clearly and running much faster than scatter.
```

```quiz
type: choice
q: You have 10000 data points for a histogram. How many bins is a reasonable choice?
options:
- bins=5
- bins=20
- bins=100
- bins=5000
answer: 1
explain: The empirical range is sqrt(n) to n/10: sqrt(10000)=100 and 10000/10=1000, so anything in the middle, such as 20-100, is reasonable. 20 lets you see the overall shape without being too coarse. bins=5 flattens the shape; bins=5000 leaves almost every point alone in its own bin, pure noise.
```

```quiz
type: choice
q: You need to show the composition of 8 categories. What is the most reasonable choice?
options:
- A pie chart split into 8 slices
- A horizontal bar chart
- A line chart
- A pie chart with the centre hollowed out as a donut
answer: 1
explain: Eight categories in a pie chart produce slices as thin as toothpicks with crowded labels, and angles are hard to compare precisely. A horizontal bar chart uses length for comparison, handles 8 categories easily and makes differences obvious. A donut is still angle comparison at heart, so none of the flaws go away.
```

---

## Part 2 · Hands-on exercises

```quiz
type: code
q: Draw a grouped bar chart: two stores (London, New York), two quarters (Q1, Q2), offset by w/2, with a legend and figsize=(8,5)
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import numpy as np
  
  stores = ['London', 'New York']
  q1 = [620, 710]
  q2 = [660, 810]
  
  # x = np.arange(...)
  # w = 0.35
  # ax.bar(x - w/2, ...)
  # ax.bar(x + w/2, ...)
  # ax.set_xticks / set_xticklabels
  # ax.legend
  
  print("TODO: replace this line with your output")
tests:
- assert "London" in __out
hint: x = np.arange(len(stores)), w = 0.35, offset the two groups by x-w/2 and x+w/2. Set xticks to x and xticklabels to stores. Do not skip ax.legend().
explain: The core of a grouped bar chart is "offset by half a bar width": x-w/2 and x+w/2 place the two groups side by side without overlap. xticks must return to integer positions, and xticklabels switch to the store names. The legend requires an explicit legend() call.
```

```quiz
type: code
q: Use twinx for a dual Y-axis: the left axis is a red line of months vs sales (£10k), the right axis is a blue line of months vs avg_price (£); set y-axis labels for both and save to out.png
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  months = ['Jan', 'Feb', 'Mar']
  sales = [120, 135, 128]
  avg_price = [320, 315, 340]
  
  # fig, ax1 = plt.subplots()
  # ax1.plot(..., color='#e41a1c')
  # ax2 = ax1.twinx()
  # ax2.plot(..., color='#377eb8')
  # set_ylabel on both axes
  
  print("TODO: replace this line with your output")
tests:
- assert "saved" in __out
hint: ax1 draws sales in red with y-label "Sales (£10k)"; ax2 = ax1.twinx() draws avg_price in blue with y-label "Avg Price (£)". Colour both axes with tick_params(axis='y', labelcolor=...) as well.
explain: The core of twinx is "shared x, independent y", and the second axis is created with ax1.twinx(). Both axes must be coloured (ticks and labels in matching colours), otherwise the reader cannot tell which line belongs to which axis. Saving is what actually renders the image.
```

---

## Part 3 · Mini-project

```quiz
type: project
q: Build a "Five-Store Business Analysis": a barh of each store's sales, a scatter of "area vs sales" (colour-mapped to rent, with a colorbar), a histogram of the sales distribution and a boxplot comparing daily sales across three stores. Combine the four charts into a 2x2 grid with figsize=(12,10) and suptitle "Store Business Analysis"
checklist:
- Used plt.subplots(2, 2) to create a 2x2 grid
- The top-left subplot is a barh horizontal bar chart
- The top-right subplot is a scatter with a third dimension colour-mapped and a colorbar added
- The bottom-left subplot is a histogram
- The bottom-right subplot is a boxplot
- Set fig.suptitle and fig.tight_layout
- The code runs without errors
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import numpy as np
  
  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False
  
  np.random.seed(42)
  stores = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney']
  sales = [1280, 1520, 980, 1100, 860]
  area = np.random.uniform(50, 200, 100)
  rent = np.random.uniform(10, 50, 100)
  london = np.random.normal(120, 20, 200)
  newyork = np.random.normal(140, 30, 200)
  tokyo = np.random.normal(110, 15, 200)
  
  # fig, axes = plt.subplots(2, 2, figsize=(12, 10))
  # axes[0, 0].barh(...)
  # axes[0, 1].scatter(..., c=rent, cmap='viridis') + fig.colorbar
  # axes[1, 0].hist(...)
  # axes[1, 1].boxplot([london, newyork, tokyo])
  # fig.suptitle(...) + fig.tight_layout()
hint: Iterating with axes.flat is the easiest approach; after scatter use fig.colorbar(sc, ax=axes[0,1]); for boxplot call set_xticklabels(['London','New York','Tokyo']). Call tight_layout after all plotting is done.
explain: This project combines every chart in chapter 2: barh for horizontal comparison, scatter for a third dimension, hist for distribution and boxplot for outliers. Composing them into one analysis page is the standard form of a real report.
```

---

## Reference answers (read after completing)

<details>
<summary>Click to reveal a reference implementation</summary>

**Exercise 1 (grouped bar chart):**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

stores = ['London', 'New York']
q1 = [620, 710]
q2 = [660, 810]

fig, ax = plt.subplots(figsize=(8, 5))
x = np.arange(len(stores))
w = 0.35
ax.bar(x - w/2, q1, w, label='Q1')
ax.bar(x + w/2, q2, w, label='Q2')
ax.set_xticks(x)
ax.set_xticklabels(stores)
ax.legend()
ax.set_ylabel('Sales (£10k)')
ax.set_title('Quarterly Sales by Store')
fig.savefig('out.png')
```

**Exercise 2 (dual Y-axis):**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar']
sales = [120, 135, 128]
avg_price = [320, 315, 340]

fig, ax1 = plt.subplots(figsize=(8, 5))
ax1.plot(months, sales, color='#e41a1c', marker='o', label='Sales')
ax1.set_ylabel('Sales (£10k)', color='#e41a1c')
ax1.tick_params(axis='y', labelcolor='#e41a1c')

ax2 = ax1.twinx()
ax2.plot(months, avg_price, color='#377eb8', marker='s', label='Avg Price')
ax2.set_ylabel('Avg Price (£)', color='#377eb8')
ax2.tick_params(axis='y', labelcolor='#377eb8')

fig.savefig('out.png')
```

**Mini-project:**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
plt.rcParams['axes.unicode_minus'] = False

np.random.seed(42)
stores = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney']
sales = [1280, 1520, 980, 1100, 860]
area = np.random.uniform(50, 200, 100)
rent = np.random.uniform(10, 50, 100)
london = np.random.normal(120, 20, 200)
newyork = np.random.normal(140, 30, 200)
tokyo = np.random.normal(110, 15, 200)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

axes[0, 0].barh(stores, sales, color='#377eb8')
axes[0, 0].set_title('Sales by Store')

sc = axes[0, 1].scatter(area, sales, c=rent, cmap='viridis', alpha=0.6, s=50)
fig.colorbar(sc, ax=axes[0, 1], label='Rent (£10k)')
axes[0, 1].set_title('Area vs Sales')

axes[1, 0].hist(london, bins=30, color='#4daf4a', edgecolor='white')
axes[1, 0].set_title('Sales Distribution')

axes[1, 1].boxplot([london, newyork, tokyo],
                   labels=['London', 'New York', 'Tokyo'])
axes[1, 1].set_title('Daily Sales: Three Stores')

fig.suptitle('Store Business Analysis')
fig.tight_layout()
fig.savefig('out.png')
plt.close(fig)
print('done')
```

</details>

## What you learned in this chapter

- **Bar chart `bar`/`barh`**: categorical comparison; use horizontal when there are many categories or long names.
- **Line chart `plot`**: showing trends; dual Y-axis via `twinx`.
- **Scatter `scatter`**: the relationship between two variables, with colour/size mapping a third dimension.
- **Histogram `hist`** and **box plot `boxplot`**: seeing distributions and outliers.
- **The pie-chart debate**: the eye is bad at comparing angles — use bar charts instead.

Chapter 3 covers **making charts speak** — multi-chart layouts, self-explanatory elements, annotations, colour schemes and pandas' `df.plot`.
