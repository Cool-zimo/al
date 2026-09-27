# Chapter 1 · Meet matplotlib · Master Quiz

> 8 questions. This chapter lays the foundation of matplotlib: why we visualise, figure/axes, drawing lines, fonts and saving.
> **You must get them all right to pass the chapter.**

## Part 1 · Multiple choice

```quiz
type: choice
q: What are the statistics of the four datasets in Anscombe's quartet?
options:
- They share the same mean but have different variances
- They share the same mean, variance, correlation and regression slope, yet their graphs are completely different
- They have different correlations, which is why their graphs differ
- They are completely random and follow no pattern
answer: 1
explain: This is the core of Anscombe's quartet: all four share x̄=9.0, ȳ=7.5, var(x)=11.0, var(y)=4.13, r=0.816 and slope 0.5, yet they tell four entirely different stories (linear, non-linear, outlier-dominated, single-point hijack). It demonstrates that statistics lose information.
```

```quiz
type: choice
q: Which statement about figure and axes is correct?
options:
- figure is the axis, axes is the whole canvas
- figure is the whole canvas, axes is the plotting region on the canvas
- They are two names for the same thing
- axes is an alias for the x-axis
answer: 1
explain: A figure is the whole canvas (a sheet of paper); an axes is the plotting region on it (with x/y ticks). Note that Axes is "one coordinate system" in the singular, not the plural "axes" — the plural for the axes themselves is Axis.
```

```quiz
type: choice
q: On a line chart with very many data points, how do you avoid markers turning into a black blob?
options:
- Increase the linewidth
- Remove the marker, or set markevery to downsample
- Change the colour to white
- Add more subplots
answer: 1
explain: Hundreds or thousands of markers drawn on top of one another inevitably become a solid black mass. The fix is to skip the markers or use markevery=10 to draw one every 10 points. Linewidth only changes line thickness and has nothing to do with point density.
```

```quiz
type: choice
q: A Chinese title renders as boxes. What is the most likely cause?
options:
- The image resolution is too low
- Matplotlib's default font has no CJK glyphs, so missing glyphs become squares
- fig.tight_layout() was not called
- The x and y data types are wrong
answer: 1
explain: Matplotlib's default font is DejaVu Sans, which is Latin-only and lacks glyphs such as "北" and "京", so missing glyphs become tofu squares. The fix is to set rcParams['font.sans-serif'] to a font containing CJK glyphs, before any plotting.
```

```quiz
type: choice
q: To save a chart as a vector image (sharp when enlarged), which extension should you use?
options:
- .png
- .jpg
- .svg or .pdf
- .bmp
answer: 2
explain: PNG and JPG are raster (pixel) formats that blur when enlarged; SVG and PDF are vector formats that stay sharp, ideal for papers, printing and later editing in Illustrator. SVG/PDF are especially recommended for charts. JPG produces compression artefacts, so it is not recommended for line art.
```

---

## Part 2 · Hands-on exercises

```quiz
type: code
q: Using the OO style (fig, ax = plt.subplots()) draw a line, set the title to "London Store Sales", the x-axis label to "Month" and the y-axis label to "Revenue (£10k)", then save to out.png
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  sales = [120, 135, 128, 160, 175, 190]
  
  # fig, ax = plt.subplots()
  # ax.plot(...)
  # ax.set_title / set_xlabel / set_ylabel
  # fig.savefig(...)
  
  print("TODO: replace this line with your output")
tests:
- assert "London Store Sales" in __out
- assert "Month" in __out
hint: Start with fig, ax = plt.subplots(), then ax.plot(months, sales), ax.set_title('London Store Sales'), ax.set_xlabel('Month'), ax.set_ylabel('Revenue (£10k)'). Finally fig.savefig('out.png').
explain: This drills the full OO chain: build the figure, draw the line, set title and labels, save. title/xlabel/ylabel are methods, so parentheses are required, and saving must not be skipped.
```

```quiz
type: code
q: Set the CJK font to WenQuanYi Micro Hei and disable unicode_minus, then draw a figure with figsize=(8,5), dpi=150 and bbox_inches='tight', titled "2025 Sales"
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  # plt.rcParams['font.sans-serif'] = ...
  # plt.rcParams['axes.unicode_minus'] = ...
  
  fig, ax = plt.subplots(figsize=(8, 5))
  ax.plot([1, 2, 3], [1, 2, 3])
  ax.set_title('2025 Sales')
  
  # fig.savefig(...)
  
  print("TODO: replace this line with your output")
tests:
- assert "2025 Sales" in __out
hint: Font: plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']; unicode_minus: plt.rcParams['axes.unicode_minus'] = False. Save: fig.savefig('out.png', dpi=150, bbox_inches='tight').
explain: This combines sections 4 and 5: font configuration plus the three essentials of saving (size, dpi, cropping). rcParams takes a list; passing a string does nothing.
```

---

## Part 3 · Mini-project

```quiz
type: project
q: Build a "London Store Sales" visualisation: create the data, draw a line chart (with marker, dashed line, red), configure the CJK font, set title and axis labels, annotate the peak point, and save with figsize=(8,5), dpi=150 and bbox_inches='tight'
checklist:
- Configured the CJK font (font.sans-serif + unicode_minus)
- Used the OO style (fig, ax = plt.subplots())
- The line uses marker and linestyle parameters
- Set title and x/y axis labels (with units)
- Used annotate to mark "peak" at the highest point
- Saved with figsize=(8,5), dpi=150 and bbox_inches='tight'
- The code runs without errors
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  # 1. Set the CJK font
  # plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  # plt.rcParams['axes.unicode_minus'] = False
  
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  sales = [120, 135, 128, 160, 175, 190]
  
  # 2. fig, ax = plt.subplots(figsize=(8, 5))
  # 3. ax.plot(...) with marker and linestyle
  # 4. ax.set_title / set_xlabel / set_ylabel
  # 5. ax.annotate to mark the peak
  # 6. fig.savefig(..., dpi=150, bbox_inches='tight')
hint: The peak is in June at 190. For annotate use ax.annotate('peak', xy=('Jun', 190), xytext=('Mar', 205), arrowprops=dict(arrowstyle='->')). Save with fig.savefig('out.png', dpi=150, bbox_inches='tight').
explain: This project ties together every point in chapter 1: font configuration, the OO style, line parameters, self-explanatory elements, key-point annotation and save parameters. Completing it once means you have mastered the full chain "from data to output image".
```

---

## Reference answers (read after completing)

<details>
<summary>Click to reveal a reference implementation</summary>

**Exercise 1:**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales = [120, 135, 128, 160, 175, 190]

fig, ax = plt.subplots()
ax.plot(months, sales)
ax.set_title('London Store Sales')
ax.set_xlabel('Month')
ax.set_ylabel('Revenue (£10k)')
fig.savefig('out.png')
```

**Exercise 2:**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
plt.rcParams['axes.unicode_minus'] = False

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1, 2, 3], [1, 2, 3])
ax.set_title('2025 Sales')
fig.savefig('out.png', dpi=150, bbox_inches='tight')
```

**Mini-project:**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
plt.rcParams['axes.unicode_minus'] = False

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales = [120, 135, 128, 160, 175, 190]

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(months, sales, marker='o', linestyle='--', color='#e41a1c', linewidth=2)

ax.set_title('London Store H1 2025 Sales')
ax.set_xlabel('Month')
ax.set_ylabel('Revenue (£10k)')

ax.annotate('peak', xy=('Jun', 190), xytext=('Mar', 205),
            arrowprops=dict(arrowstyle='->', color='#e41a1c'))

fig.savefig('out.png', dpi=150, bbox_inches='tight')
plt.close(fig)
print('done')
```

</details>

## What you learned in this chapter

- **Why visualise**: Anscombe's quartet shows that statistics lose information — plot before you read the numbers.
- **Figure and axes**: the difference between the canvas and the plotting region, and why the OO style is more reliable than the `plt` interface.
- **Drawing lines**: the four core parameters — marker, linestyle, color, linewidth.
- **CJK fonts**: `font.sans-serif` + `axes.unicode_minus`; font names must be exact and passed as a list.
- **Saving**: figsize × dpi determines sharpness; bbox_inches='tight' prevents cropping; use svg/pdf for vectors.

Chapter 2 covers **choosing the right chart** — bar, line, scatter, histogram and pie, along with their respective use cases and pitfalls.
