# Chapter 6 Test · Time series and the capstone

> Time has an order, and so does data. This chapter tests everything that makes a date actually useful.

## Part 1 · Multiple choice

```quiz
type: choice
q: What does pd.to_datetime(['2026-01-01', 'not-a-date', '2026-03-01'], errors='coerce') return?
options:
- It raises ValueError
- All three parse successfully
- 'not-a-date' becomes NaT and the other two parse normally
- It returns the original list of strings
answer: 2
explain: errors='coerce' forces unparseable dates into NaT (Not-a-Time) instead of raising, which makes it easy to clean up afterwards with dropna.
```

```quiz
type: choice
q: For a time series with a DatetimeIndex, which option fetches the data for March 2026?
options:
- ts['2026-03'] as a string slice
- ts.loc['2026-03']
- ts[ts.index.month == 3]
- All of the above
answer: 3
explain: A DatetimeIndex supports string slicing with '2026-03', .loc, and boolean indexing — all three will return March's data.
```

```quiz
type: choice
q: On a Series indexed by day, which is the correct way to call resample('ME').mean()?
options:
- resample('ME')
- resample('ME').mean()
- resample('ME').fillna()
- resample can be called without any following aggregation
answer: 1
explain: resample is a two-step call and must be followed by an aggregation (mean/sum/count, etc.). Calling it on its own returns a Resampler object, not a result.
```

```quiz
type: choice
q: What is the difference between s.rolling(7, min_periods=1).mean() and s.rolling(7).mean()?
options:
- They are identical
- With min_periods=1 the first 6 values still produce output; by default they are NaN
- min_periods=1 gives wrong results
- The latter raises an error
answer: 1
explain: The default min_periods=7 (equal to the window size), so fewer than 7 values means NaN; setting it to 1 means even a single value is enough to compute a mean.
```

```quiz
type: choice
q: What is pct_change() fundamentally?
options:
- s / s.cumsum() - 1
- s / s.shift(1) - 1
- s - s.shift(1)
- s.rolling(2).mean()
answer: 1
explain: pct_change is simply the current value divided by the previous value, minus 1 — equivalent to s / s.shift(1) - 1. diff() is the subtraction version.
```

## Part 2 · Hands-on

```quiz
type: function
q: Write a function monthly_mean(data) where data is a list of dicts with "date" (string) and "units" columns. Convert the date to datetime and set it as the index, resample by month ('ME'), compute the mean, and return the number of rows in the result
starter: |
  import pandas as pd

  def monthly_mean(data):
      return 0

cases: |
  [{"date":"2026-01-05","units":100},{"date":"2026-01-20","units":200},{"date":"2026-03-01","units":150}] -> 3
hint: df = pd.DataFrame(data); df['date'] = pd.to_datetime(df['date']); df = df.set_index('date'); r = df['units'].resample('ME').mean(); return len(r). Note that February has no data, but resample still emits a row for it (NaN), so the total is 3.
explain: resample('ME') creates monthly buckets: 2026-01-31 = (100+200)/2 = 150, 2026-02-28 has no data -> NaN, 2026-03-31 = 150, so 3 rows in total. Call .dropna() if you want to skip the empty months.
```

```quiz
type: function
q: Write a function rolling_mean(data, window) that takes a list of integers and returns the final value (as a Python float) of rolling(window, min_periods=1).mean()
starter: |
  import pandas as pd

  def rolling_mean(data, window):
      return 0.0

cases: |
  [10, 20, 30, 40, 50], 3 -> 40.0
hint: s = pd.Series(data); return float(s.rolling(window, min_periods=1).mean().iloc[-1]). The last three values are 30, 40, 50, averaging 40.0.
explain: Window 3 with min_periods=1 means the last row uses (30+40+50)/3 = 40.0.
```

## Part 3 · Mini-project

```quiz
type: function
q: Write a function full_analysis(data) where data is a list of dicts with "shop", "date" (string), and "revenue" columns. The function must: 1) convert date to datetime; 2) convert revenue to numeric (coerce); 3) resample by month ('ME') to compute total revenue per month; 4) compute the month-on-month growth rate with pct_change on those monthly totals; 5) return the final growth rate as a Python float (return None if it is NaN). Hint: first sum all shops' revenue by day, then aggregate by month
starter: |
  import pandas as pd
  import math

  def full_analysis(data):
      return None

cases: |
  [{"shop":"Camden","date":"2026-01-05","revenue":100},{"shop":"Camden","date":"2026-01-20","revenue":200},{"shop":"Camden","date":"2026-02-10","revenue":400}] -> 0.3333333333333333
hint: df = pd.DataFrame(data); df['date'] = pd.to_datetime(df['date']); df['revenue'] = pd.to_numeric(df['revenue'], errors='coerce'); df = df.dropna(subset=['revenue']); daily = df.groupby('date')['revenue'].sum().asfreq('D').fillna(0); monthly = daily.resample('ME').sum(); growth = monthly.pct_change(); v = growth.iloc[-1]; return None if pd.isna(v) else float(v).
explain: 2026-01 totals 300 (100+200) and 2026-02 totals 400, so growth = (400-300)/300 is approximately 0.3333. Note that you must sum by day first (there may be duplicates on the same day), then resample by month.
```
