# Chapter 5 · Data Storytelling and Pitfalls · Major Quiz

> 8 questions. This chapter answers "how to turn data into plain language without lying".
> **You must get every question right to pass the chapter.**

## Part 1 · Multiple choice

---

```quiz
type: choice
exam: true
q: From a business question to the final chart, what is the correct first step?
options:
- Open Excel and turn the data into a bar chart
- Clarify "what question this chart is meant to answer" - start with the direction of the conclusion, then choose the chart type
- Export every table from the database first and decide later
- Pick an attractive colour scheme
answer: 1
explain: Before drawing, you must know what you are trying to answer. Is it a trend, a distribution or a category comparison? The question decides the chart type - trend uses a line, distribution uses a histogram or boxplot, and comparison uses bars or a scatter plot. A chart without a question is decoration, not analysis.
```

```quiz
type: choice
exam: true
q: What is the correct order in a complete EDA (exploratory data analysis) workflow?
options:
- Clean missing values -> draw charts -> group and aggregate -> write conclusions
- Understand the data (shape/head/describe/types) -> clean (missing, duplicates, types) -> univariate distribution -> multivariate relationships -> grouped insights -> conclusions
- Group and aggregate -> draw a heatmap -> drop unneeded columns -> export
- Import libraries -> write a title -> draw a chart -> submit
answer: 1
explain: The standard EDA workflow moves from the big picture to the detail and from data quality to business insight - first understand the data (shape, head, dtypes, describe), then clean (missing, duplicates, outliers, type conversion), then look at univariate distributions, then relationships between variables, and finally group and aggregate to find differences and draw conclusions. Skipping steps leads to wrong conclusions.
```

```quiz
type: choice
exam: true
q: Which of these is most likely to "lie"?
options:
- Truncating the Y axis so a tiny difference looks like a huge gap
- Labeling the exact values on a bar chart
- Using a logarithmic scale and noting "log scale" in the title
- Marking the full date range on the x axis of a line chart
answer: 0
explain: A truncated Y axis is the most common visual deception - setting the vertical start near the minimum instead of 0 makes two nearly equal bars look several times apart. By contrast, labeling values, noting a log scale and marking the full date range are all good practices that improve readability and honesty.
```

```quiz
type: choice
exam: true
q: What is the main risk of a dual Y-axis chart (one vertical axis on each side)?
options:
- It makes the chart too large
- The two scales have different visual baselines, so readers easily misread height differences as a quantitative relationship
- The colours clash
- It runs more slowly
answer: 1
explain: The biggest problem with a dual Y axis is that the left scale (say revenue) and the right scale (say footfall) use completely different units, yet readers unconsciously compare their "visual heights" and conclude things like "revenue and footfall are about the same". If you must draw it, split into two charts or use a standardised index.
```

```quiz
type: choice
exam: true
q: Store A has a 5% conversion rate on a sample of 2,000 visitors, while store B has 7% on a sample of 50. What is wrong with just comparing the percentages?
options:
- Store B's colour is unattractive
- Store B has only 50 samples, so 7% may be random noise - the small sample makes the conclusion unreliable
- The gap between 5% and 7% is too small to be worth plotting
- The two stores should be merged into one statistic
answer: 1
explain: A high percentage on a small sample is often unstable. With only 50 samples, store B's result swings sharply with one or two extra conversions. The sample size (bubble size, an n label, or side-by-side confidence intervals) must appear on the chart, otherwise small-sample noise becomes misleading.
```

## Part 2 · Hands-on

---

```quiz
type: function
exam: true
q: Write a function detect_truncated_yaxis that receives a list of bar heights, a Y-axis start y_min and a Y-axis end y_max, and decides whether the chart uses a "truncated Y axis" deception. Rule - if y_min > 0 and y_min > max(heights) * 0.3, treat it as excessive truncation and return True; otherwise return False.
func: detect_truncated_yaxis
starter: |
  def detect_truncated_yaxis(heights, y_min, y_max):
      return False
cases: |
  ([100, 120, 110], 95, 130) -> True
  ([100, 120, 110], 0, 140) -> False
  ([50, 55], 40, 60) -> True
  ([1000, 2000], 0, 2500) -> False
hint: return y_min > 0 and y_min > max(heights) * 0.3
explain: This function simulates the logic of automatically detecting a truncated Y axis. The threshold - a start above 30% of the maximum bar height - is an empirical rule for spotting charts that may mislead the reader.
```

```quiz
type: function
exam: true
q: Write a function sample_size_warning that receives conversion data for two stores (total visitors and conversions for each) and returns a message. If either store has fewer than 100 samples, return the string "sample too small, conclusion unreliable"; otherwise compute the percentage-point gap between the two conversion rates and return a string of the form "store A conversion X.X%, store B conversion Y.Y%, gap Z.Z percentage points".
func: sample_size_warning
starter: |
  def sample_size_warning(a_total, a_conv, b_total, b_conv):
      return ""
cases: |
  (2000, 100, 50, 4) -> "sample too small, conclusion unreliable"
  (2000, 100, 2000, 140) -> "store A conversion 5.0%, store B conversion 7.0%, gap 2.0 percentage points"
  (100, 5, 150, 9) -> "sample too small, conclusion unreliable"
  (500, 25, 500, 35) -> "store A conversion 5.0%, store B conversion 7.0%, gap 2.0 percentage points"
hint: if min(a_total,b_total)<100: return "sample too small, conclusion unreliable"; ra,rb=a_conv/a_total*100,b_conv/b_total*100; return f"store A conversion {ra:.1f}%, store B conversion {rb:.1f}%, gap {abs(ra-rb):.1f} percentage points"
explain: Sample-size checking is basic data storytelling. Judge whether the data is "eligible" for a conclusion before measuring the difference. Returning a formatted string rather than drawing a chart makes it easy to drop straight into a report script.
```

## Part 3 · Mini-project

---

```quiz
type: project
exam: true
q: Suppose you have quarterly sales data from five stores in London and New York, and you need a "dashboard page" that explains the performance gap between the two cities. Starting from the raw data, complete data loading, cleaning (handle missing values, standardise store names), grouped aggregation (quarterly revenue, average spend and orders for each store), visualisation (at least 3 charts - a bar chart comparing city revenue, a line chart showing the quarterly trend, and a heatmap of the store x quarter crosstab) and finally a conclusion of no more than 100 words in English. Avoid every "deceptive" practice covered in this chapter.
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import pandas as pd
  import numpy as np

  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False

  # Simulated raw data (contains dirty values)
  raw = pd.DataFrame({
      'store': ['London Camden', 'London Shoreditch', 'New York 5th Ave',
                'New York Wall St', 'London Camden ',
                'London-Shoreditch', 'New York-5th Ave', 'New York Wall St',
                'London Camden', 'New York 5th Ave'],
      'city': ['London', 'London', 'New York', 'New York', 'London',
               'London', 'New York', 'New York', 'London', 'New York'],
      'quarter': ['Q1', 'Q1', 'Q1', 'Q1', 'Q2', 'Q2', 'Q2', 'Q2', 'Q3', 'Q3'],
      'revenue': [120000, 98000, 150000, 200000, 135000, 110000, 160000, 220000,
                  np.nan, 105000, 170000, 230000, 142000, 180000],
      'orders': [1200, 980, 1500, 2000, 1350, 1100, 1600, 2200, 1420, 1050,
                 1700, 2300, 1420, 1800],
  })

  # TODO 1: clean - strip whitespace from store names, standardise the separator to "·", fill missing revenue

  # TODO 2: aggregate - group by city and summarise quarterly revenue and orders, compute average spend

  # TODO 3: visualisation 1 - bar chart comparing total revenue by city (Y axis starts at 0)

  # TODO 4: visualisation 2 - line chart showing the quarterly trend for both cities

  # TODO 5: visualisation 3 - heatmap of the store x quarter revenue crosstab (pivot_table)

  # TODO 6: conclusion - one line summarising the performance gap (<=100 words)
checklist:
- Was the data cleaned (whitespace removed, format standardised, missing values handled)?
- Were there any duplicates or missing values after cleaning?
- Did the aggregation compute revenue, orders and average spend together?
- Does the bar chart start the Y axis at 0 (not truncated)?
- Does the line chart show the quarterly trend clearly, with different colours for the two cities?
- Does the heatmap correctly use pivot_table for the crosstab?
- Is the conclusion under 100 words and does it mention both the size of the gap and a possible reason?
explain: This project simulates the real-world chain "receive dirty data -> clean -> aggregate -> chart -> conclude". The emphasis is on honest charts - no truncated Y axis, sample sizes labelled, complete information shown. The final concise conclusion is a core skill of data storytelling.
```
