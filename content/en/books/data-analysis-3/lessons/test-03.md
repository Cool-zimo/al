# Chapter 3 · Making the plot tell the story · Master quiz

> 8 questions. This chapter answers one question: "can the plot explain itself, and can it tell a story?"
> **You must answer every question correctly to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: You create one row of three panels with plt.subplots(1, 3). Which is the correct way to reach the first panel?
options:
- axes[0, 0]
- axes[0]
- axes[:, 0]
- axes[1]
answer: 1
explain: A layout with a single row or a single column returns a one-dimensional axes array, so a single index axes[0] is correct. axes[0, 0] is the two-dimensional syntax and raises IndexError. axes only becomes two-dimensional when both nrows>1 and ncols>1. To handle both cases uniformly, iterate with axes.flat.
```

```quiz
type: choice
q: Which is the recommended approach to grid lines?
options:
- Use a thick black solid line, the thicker the better, for easy reading
- Use a dashed line with low opacity (e.g. alpha=0.4), enable only one axis, so it stays weaker than the data
- Never use a grid at all, it is redundant
- Make the grid red, that is the most visible colour
answer: 1
explain: The grid is only a reading aid, so it must always stay weaker than the data. Dashed lines plus alpha 0.3 to 0.5 is the standard recommendation; line charts usually only need the horizontal direction (axis='y') so the eye can travel along the value axis. A thick black grid drowns the data, and no grid at all forces the reader to guess the values.
```

```quiz
type: choice
q: You want a horizontal reference line at y=150 to represent a target value. Which method should you use?
options:
- ax.axvline(y=150)
- ax.axhline(y=150)
- ax.axline(x=150)
- ax.annotate(y=150)
answer: 1
explain: axhline draws a horizontal reference line (its parameter is the y position, a fixed value); axvline draws a vertical one (its parameter is x). axvline(y=150) raises an error because it only accepts x. annotate draws text with an arrow, not a reference line.
```

```quiz
type: choice
q: You need to distinguish three peer categories: London, New York, and Manchester. Which colour scheme should you use?
options:
- Sample three points from the continuous viridis colormap
- Use a discrete palette such as tab10 or Set1
- Use only red and green
- Use a grayscale
answer: 1
explain: Peer categories call for a discrete palette (tab10, Set1) so all three sit at the same visual level. viridis is continuous, so its sampled colours carry an implied brightness ranking. Red-green is a colour-blind trap (about 8% of men cannot separate them). Grayscale is colour-blind-safe but lacks contrast.
```

```quiz
type: choice
q: Which statement about mixing df.plot() with matplotlib is correct?
options:
- df.plot() modifies the original DataFrame
- df.plot(ax=ax) draws data onto the specified Axes, and you can keep using Axes methods afterwards
- df.plot can only draw line charts
- df.plot does not require importing matplotlib
answer: 1
explain: df.plot(ax=ax) renders the data into the given Axes object and returns it, so you can continue with ax.set_title, ax.legend, and ax.annotate. It does not modify the original DataFrame (it returns a plot, not data). The kind parameter supports bar, box, scatter, and more.
```

---

## Part 2 · Hands-on

```quiz
type: code
q: Create a 2x2 grid of subplots and draw one line on each panel (x=[1,2,3]), using axes.flat to iterate. Then call tight_layout and save the figure.
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt

  fig, axes = plt.subplots(2, 2, figsize=(8, 8))

  # for ax in axes.flat:
  #     ax.plot([1, 2, 3], [1, 2, 3])

  print("edit here")
tests:
- assert "saved" in __out
hint: Iterate with `for ax in axes.flat: ax.plot([1,2,3],[1,2,3])`, then fig.tight_layout() and fig.savefig('out.png').
explain: axes.flat flattens the 2x2 array into an iterator, which makes the loop the shortest possible solution. tight_layout must run after all drawing is done, otherwise new content overflows.
```

```quiz
type: code
q: Draw a line chart with all four self-explaining elements: title "H1 2025 sales comparison", x-axis label "Month", y-axis label "Sales / £10k", a legend, and a dashed horizontal grid with alpha=0.4.
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  london = [120, 135, 128, 160, 175, 190]
  new_york = [110, 118, 130, 140, 155, 168]

  fig, ax = plt.subplots()
  ax.plot(months, london, label='London')
  ax.plot(months, new_york, label='New York')

  # ax.set_title / set_xlabel / set_ylabel
  # ax.legend()
  # ax.grid(axis=..., linestyle=..., alpha=...)

  fig.savefig('out.png')
  print("saved")
tests:
- assert "saved" in __out
hint: Four elements: ax.set_title('H1 2025 sales comparison'), ax.set_xlabel('Month'), ax.set_ylabel('Sales / £10k'), ax.legend(). Grid: ax.grid(axis='y', linestyle='--', alpha=0.4).
explain: The four self-explaining elements each do one job: the title says what is being compared, the axis labels say what the axes mean (including units), the legend says which line is which, and the grid helps the eye align values. Leave one out and the plot stops explaining itself.
```

---

## Part 3 · Mini-project

```quiz
type: project
q: Build a "store sales analysis report": a 2x2 grid -> line chart (title containing "comparison", all four self-explaining elements present) -> barh horizontal bars -> boxplot comparing three stores -> scatter of floor area vs sales (colour mapped to rent, with a colourbar). Every panel gets a title and the whole figure gets a suptitle. Finally apply tight_layout and save at figsize=(12,10), dpi=150.
checklist:
- Uses plt.subplots(2, 2, figsize=(12, 10)) to build the grid
- At least one panel uses annotate or axhline to mark a key point
- Every panel has a title, axis labels, and a legend or colourbar
- Uses a colour-blind-friendly palette (tab10/Set1)
- Drops the top/right spines or sets a grid style
- Calls fig.suptitle and fig.tight_layout
- Saves with fig.savefig(..., dpi=150, bbox_inches='tight')
- The code runs without errors
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import numpy as np

  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False

  np.random.seed(42)
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  london = [120, 135, 128, 160, 175, 190]
  new_york = [110, 118, 130, 140, 155, 168]
  stores = ['London', 'New York', 'Manchester', 'Bristol', 'Leeds']
  sales = [1280, 1520, 980, 1100, 860]
  area = np.random.uniform(50, 200, 100)
  rent = np.random.uniform(10, 50, 100)
  daily_london = np.random.normal(120, 20, 200)
  daily_newyork = np.random.normal(140, 30, 200)
  daily_manchester = np.random.normal(110, 15, 200)

  cmap = plt.get_cmap('tab10')

  # fig, axes = plt.subplots(2, 2, figsize=(12, 10))
  # line / barh / boxplot / scatter
  # fig.suptitle(...) + fig.tight_layout()
  # fig.savefig(..., dpi=150, bbox_inches='tight')
hint: Use cmap(0)/cmap(1) for the line colours; remember set_xlabel with the unit for barh; boxplot needs set_xticklabels; scatter followed by fig.colorbar; tight_layout goes last.
explain: This project combines everything from chapters 1 to 3: grid layout, the four self-explaining elements, annotations and reference lines, colour choices, mixing df.plot with matplotlib, and save parameters. Once it runs end to end, you have the full ability to turn data into a story.
```

---

## Answer key (peek after you finish)

<details>
<summary>Click to reveal a reference implementation</summary>

**Hands-on 1:**

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

**Hands-on 2:**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
london = [120, 135, 128, 160, 175, 190]
new_york = [110, 118, 130, 140, 155, 168]

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(months, london, marker='o', label='London')
ax.plot(months, new_york, marker='s', linestyle='--', label='New York')

ax.set_title('H1 2025 sales comparison')
ax.set_xlabel('Month')
ax.set_ylabel('Sales / £10k')
ax.legend()
ax.grid(axis='y', linestyle='--', alpha=0.4)

fig.tight_layout()
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
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
london = [120, 135, 128, 160, 175, 190]
new_york = [110, 118, 130, 140, 155, 168]
stores = ['London', 'New York', 'Manchester', 'Bristol', 'Leeds']
sales = [1280, 1520, 980, 1100, 860]
area = np.random.uniform(50, 200, 100)
rent = np.random.uniform(10, 50, 100)
daily_london = np.random.normal(120, 20, 200)
daily_newyork = np.random.normal(140, 30, 200)
daily_manchester = np.random.normal(110, 15, 200)

cmap = plt.get_cmap('tab10')
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Line chart
axes[0, 0].plot(months, london, color=cmap(0), marker='o', label='London')
axes[0, 0].plot(months, new_york, color=cmap(1), marker='s', label='New York')
axes[0, 0].set_title('Sales trend comparison')
axes[0, 0].set_xlabel('Month')
axes[0, 0].set_ylabel('Sales / £10k')
axes[0, 0].legend()
axes[0, 0].grid(axis='y', linestyle='--', alpha=0.4)

# Horizontal bar chart
axes[0, 1].barh(stores, sales, color=cmap(2))
axes[0, 1].set_title('Sales by store')
axes[0, 1].set_xlabel('Sales / £10k')

# Boxplot
axes[1, 0].boxplot([daily_london, daily_newyork, daily_manchester],
                   labels=['London', 'New York', 'Manchester'])
axes[1, 0].set_title('Distribution of daily sales')
axes[1, 0].set_ylabel('Daily sales / £10k')

# Scatter
sc = axes[1, 1].scatter(area, sales, c=rent, cmap='viridis', alpha=0.6, s=50)
fig.colorbar(sc, ax=axes[1, 1], label='Rent / £10k')
axes[1, 1].set_title('Floor area vs sales (colour = rent)')
axes[1, 1].set_xlabel('Floor area / sqm')
axes[1, 1].set_ylabel('Sales / £10k')

for ax in axes.flat:
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

fig.suptitle('Store sales analysis report')
fig.tight_layout()
fig.savefig('report.png', dpi=150, bbox_inches='tight')
plt.close(fig)
print('done')
```

</details>

## What you learned in this chapter

- **Multiple panels**: the three `subplots` layouts, `sharex`/`sharey`, irregular layouts with `GridSpec`, and the right moment to call `tight_layout`
- **The four self-explaining elements**: title (subject + metric + time), axis labels (with units), legend, and grid
- **Annotations and reference lines**: the three parts of `annotate`, `axhline`/`axvline`, and leaving room for labels
- **Colour**: colour-blind safety, the two uses of a colormap, and swapping the whole look with one seaborn style line
- **Plotting with pandas**: `df.plot(ax=ax)` as the bridge between a shortcut and matplotlib

You now have the ability to turn data into a complete story.
