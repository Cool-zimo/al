# Chapter 6 · End-to-End Practice · Major Quiz

> 8 questions. This chapter answers "how to chain every skill from the first five chapters into one pipeline - read dirty data, clean it, gain insight, visualise, deliver a report".
> **You must get every question right to pass the chapter.**

## Part 1 · Multiple choice

---

```quiz
type: choice
exam: true
q: When reading a GBK-encoded CSV file with pandas, what is the correct syntax?
options:
- pd.read_csv('data.csv', encoding='gbk')
- pd.read_csv('data.csv', code='gbk')
- pd.read_csv('data.csv', decode='gbk')
- pd.read_csv('data.csv').set_encoding('gbk')
answer: 0
explain: The read_csv argument for the file encoding is `encoding`. CSV files exported from a Chinese Windows environment are often GBK, and omitting it raises UnicodeDecodeError. Common values are 'utf-8', 'gbk', 'gb2312' and 'gb18030' (the broadest compatibility).
```

```quiz
type: choice
exam: true
q: A column that should be a date was read as object. Which approach converts it and extracts the "month" for grouping?
options:
- pd.to_datetime(df['date_col']) then .dt.month
- df['date_col'].astype(int).month
- df['date_col'].split('-')[1]
- A manual loop parsing each value
answer: 0
explain: pd.to_datetime() converts a string column to Timestamp in bulk, after which accessors such as .dt.month, .dt.year and .dt.dayofweek extract time features. This is the standard approach to time feature engineering, safer than manual string splitting and supportive of many date formats.
```

```quiz
type: choice
exam: true
q: When cleaning data, which approach to missing numeric values is least advisable?
options:
- Fill with the column median
- Fill with the column mean
- Call dropna on rows with missing values regardless of how many are missing
- Analyse the missing proportion and cause first, then decide on a filling strategy
answer: 2
explain: Blindly calling dropna throws away potentially valuable information, especially when the missing proportion is high. The correct approach is to analyse first - is the missingness random or systematic, and how large is the share? Then decide whether to use mean, median, mode, a model prediction or treat missingness as its own category.
```

```quiz
type: choice
exam: true
q: In an end-to-end report, what is the most efficient tool for finding differences in the "grouped insight" stage?
options:
- Printing the raw data row by row
- A pivot_table crosstab that puts "differences" into cell sizes
- Scatter-plot matrices for every column
- Computing only the overall mean
answer: 1
explain: pivot_table is two-dimensional grouped aggregation, which naturally exposes "who is high and who is low" in each cell. For example, a crosstab of store x channel shows at a glance which cells are large and which are small, making it the fastest way to find conclusions. Combined with sorting and share calculations, it quickly locates the Top and Bottom.
```

```quiz
type: choice
exam: true
q: When writing an analysis report, which practice most improves readability?
options:
- Pasting all the code into the report as-is
- Adding a line of "what was found" commentary next to each chart instead of just dropping the chart in
- Using as many charts as possible to look professional
- Putting all the data into an appendix table
answer: 1
explain: The core of a report is insight, not display. A line of interpretation beside each chart (for example "Q3 New York revenue rose 18% month on month, driven mainly by online") lets the reader grasp the point in 3 seconds. Code belongs in an appendix or script, and charts should be few and well chosen.
```

## Part 2 · Hands-on

---

```quiz
type: function
exam: true
q: Write a function clean_store_data that receives a DataFrame (with a "store" column whose names may have leading or trailing whitespace and inconsistent forms like "London-Shoreditch" versus "London Shoreditch", and which may contain duplicate rows) and returns the cleaned DataFrame. Cleaning rules - strip leading and trailing whitespace from store names, replace "-" with "" (empty string), remove fully duplicate rows, reset the index.
func: clean_store_data
starter: |
  import pandas as pd

  def clean_store_data(df):
      return df
cases: |
  pd.DataFrame({'store':['London Shoreditch','New York-5th Ave','London Shoreditch ','New York-5th Ave'],'revenue':[100,200,100,200]}) -> DataFrame with 2 rows, stores ['London Shoreditch','New York 5th Ave']
hint: df=df.copy(); df['store']=df['store'].str.strip().str.replace('-','',regex=False); df=df.drop_duplicates().reset_index(drop=True); return df
explain: String cleaning is a high-frequency operation in data cleaning. strip() removes whitespace, str.replace unifies the separator, and drop_duplicates removes duplicates - three steps that together cover the two typical problems of inconsistent store names and duplicate rows.
```

```quiz
type: function
exam: true
q: Write a function monthly_report that receives a cleaned sales DataFrame (with a "date" column and a "revenue" column), converts the date to datetime and extracts the month, summarises revenue by month (sum) and returns a dict whose keys are month numbers (int) and values are the monthly revenue (int).
func: monthly_report
starter: |
  import pandas as pd

  def monthly_report(df):
      return {}
cases: |
  pd.DataFrame({'date':['2024-01-05','2024-01-20','2024-02-10','2024-02-15'],'revenue':[100,200,300,400]}) -> {1:300,2:700}
  pd.DataFrame({'date':['2024-03-01'],'revenue':[999]}) -> {3:999}
hint: df=df.copy(); df['date']=pd.to_datetime(df['date']); df['month']=df['date'].dt.month; return {int(k):int(v) for k,v in df.groupby('month')['revenue'].sum().items()}
explain: Extracting time features and grouping for aggregation is the core of the end-to-end flow. pd.to_datetime converts the type, .dt.month extracts the month, and groupby aggregates - three steps that complete the most common analytical task of "summarising by time".
```

## Part 3 · Mini-project

---

```quiz
type: project
exam: true
q: Complete an end-to-end sales analysis - starting from simulated dirty data, read and convert types, clean (strip whitespace, standardise store names, fill missing revenue with the median, remove extreme high values), engineer features (extract month and quarter), gain grouped insight (revenue and orders by city x month, plus average spend), visualise (at least 3 charts - a line chart of monthly revenue by city, a city x month heatmap, and a bar chart of average spend by city) and finally write an analysis report of no more than 150 words. Every chart starts its Y axis at 0 and states the data source and definition.
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import pandas as pd
  import numpy as np

  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False

  np.random.seed(42)
  # Simulated dirty data
  n = 200
  raw = pd.DataFrame({
      'store': np.random.choice(['London Camden ', ' New York 5th Ave',
                                 'London-Shoreditch', 'New York Wall St'], n),
      'date': pd.date_range('2024-01-01', periods=n, freq='D').strftime('%Y-%m-%d').tolist(),
      'revenue': np.random.randint(1000, 50000, n).astype(float),
      'orders': np.random.randint(10, 500, n),
  })
  # Inject dirty values deliberately
  raw.loc[5, 'revenue'] = np.nan          # missing
  raw.loc[10, 'revenue'] = 9999999        # outlier
  raw.loc[15, 'store'] = 'London Camden '  # duplicate row

  # TODO 1: type conversion - date strings to datetime

  # TODO 2: cleaning -
  #   - strip whitespace from store names, replace "-" with ""
  #   - fill missing revenue (with the median)
  #   - remove values above the 3*IQR upper bound
  #   - remove fully duplicate rows

  # TODO 3: feature engineering - extract month and quarter

  # TODO 4: grouped insight - revenue and orders by city x month, compute average spend

  # TODO 5: visualisation 1 - line chart of monthly revenue by city (Y starts at 0)

  # TODO 6: visualisation 2 - heatmap of the city x month revenue crosstab

  # TODO 7: visualisation 3 - bar chart of average spend by city

  # TODO 8: report - summarise the findings in under 150 words
checklist:
- Was the date type converted (pd.to_datetime)?
- Were store names cleaned (whitespace stripped, separator standardised)?
- Was the missing revenue filled with the median?
- Were outliers removed using the IQR method?
- Were month and quarter features extracted successfully?
- Did the aggregation include revenue, orders and average spend together?
- Were all 3 charts generated with Y starting at 0?
- Is the report under 150 words and does it include a data-source note and main findings?
explain: This is the capstone project of the book, chaining reading, cleaning, feature engineering, aggregation, visualisation and report writing into one pipeline. The emphasis is on "engineering completeness" - no step can be skipped - and the report must state the data definition and cleaning method honestly.
```
