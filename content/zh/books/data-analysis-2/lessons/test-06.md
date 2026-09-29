# 第 6 章测验 · 时间序列与实战

> 时间是有顺序的，数据也是有顺序的。这一章考的是让日期"排上用场"的所有本事。

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: pd.to_datetime(['2026-01-01', '不是日期', '2026-03-01'], errors='coerce') 的结果是什么？
options:
- 抛出 ValueError
- 三个都正常解析
- '不是日期' 被解析成 NaT，其余正常
- 返回原始字符串列表
answer: 2
explain: errors='coerce' 会把无法解析的日期强制转成 NaT（Not-a-Time），而不是抛异常，方便后续 dropna 清理。
```

```quiz
type: choice
exam: true
q: 一个 DatetimeIndex 的时间序列，取 2026 年 3 月的数据该写哪个？
options:
- ts['2026-03'] 字符串切片
- ts.loc['2026-03']
- ts[ts.index.month == 3]
- 以上都可以
answer: 3
explain: DatetimeIndex 支持字符串切片 '2026-03'，也支持 .loc 和布尔索引，三种写法都能拿到 3 月的数据。
```

```quiz
type: choice
exam: true
q: 对按天索引的 Series 做 resample('ME').mean()，下面哪种写法是对的？
options:
- resample('ME')
- resample('ME').mean()
- resample('ME').fillna()
- resample 后面可以不跟任何聚合
answer: 1
explain: resample 是两段式，必须跟聚合函数（mean/sum/count 等），单独调用只返回一个 Resampler 对象，不是结果。
```

```quiz
type: choice
exam: true
q: s.rolling(7, min_periods=1).mean() 和 s.rolling(7).mean() 的区别？
options:
- 完全一样
- min_periods=1 时前 6 个值也有结果，默认前 6 个是 NaN
- min_periods=1 会算错
- 后者会报错
answer: 1
explain: 默认 min_periods=7（等于窗口大小），凑不够 7 个就 NaN；设成 1 则哪怕只有 1 个数据也算均值。
```

```quiz
type: choice
exam: true
q: s.pct_change() 的本质是什么？
options:
- s / s.cumsum() - 1
- s / s.shift(1) - 1
- s - s.shift(1)
- s.rolling(2).mean()
answer: 1
explain: pct_change 就是当前值除上一期值减 1，等价于 s / s.shift(1) - 1。diff() 才是相减。
```

## 第二部分 · 动手题

```quiz
type: function
exam: true
q: 写一个函数 月度均值(数据)，数据字典列表含 日期（字符串）、销量 两列，先把日期转 datetime 再设成索引，按月（'ME'）resample 求均值，返回结果的行数
starter: |
  import pandas as pd

  def 月度均值(数据):
      return 0

cases: |
  [{"日期":"2026-01-05","销量":100},{"日期":"2026-01-20","销量":200},{"日期":"2026-03-01","销量":150}] -> 3
hint: df = pd.DataFrame(数据); df['日期'] = pd.to_datetime(df['日期']); df = df.set_index('日期'); r = df['销量'].resample('ME').mean(); return len(r)。注意 2 月没有数据，resample 仍会产出该月一行（值为 NaN），所以共 3 行。
explain: resample('ME') 按月生成桶：2026-01-31=(100+200)/2=150，2026-02-28 无数据→NaN，2026-03-31=150，共 3 行。若想跳过空月，可 .dropna()。
```

```quiz
type: function
exam: true
q: 写一个函数 滚动均值(数据, 窗口)，数据是整数列表，返回 rolling(窗口, min_periods=1).mean() 结果的最后一个值（Python float）
starter: |
  import pandas as pd

  def 滚动均值(数据, 窗口):
      return 0.0

cases: |
  [10, 20, 30, 40, 50], 3 -> 40.0
hint: s = pd.Series(数据); return float(s.rolling(窗口, min_periods=1).mean().iloc[-1])。最后三数是 30,40,50，均值 40.0。
explain: 窗口 3、min_periods=1，最后一行取 (30+40+50)/3 = 40.0。
```

## 第三部分 · 小项目

```quiz
type: function
exam: true
q: 写一个函数 完整分析(数据)，数据字典列表含 门店、日期（字符串）、销售额 三列。要求：1) 日期转 datetime；2) 销售额转数值（coerce）；3) 按月 resample('ME') 求各月总销售额；4) 对月总销售额算环比增长率 pct_change；5) 返回环比增长率的最后一个值（Python float，NaN 时返回 None）。提示：先把所有门店销售额按天汇总再按月聚合
starter: |
  import pandas as pd
  import math

  def 完整分析(数据):
      return None

cases: |
  [{"门店":"中关村","日期":"2026-01-05","销售额":100},{"门店":"中关村","日期":"2026-01-20","销售额":200},{"门店":"中关村","日期":"2026-02-10","销售额":400}] -> 0.3333333333333333
hint: df = pd.DataFrame(数据); df['日期'] = pd.to_datetime(df['日期']); df['销售额'] = pd.to_numeric(df['销售额'], errors='coerce'); df = df.dropna(subset=['销售额']); 日 = df.groupby('日期')['销售额'].sum().asfreq('D').fillna(0); 月 = 日.resample('ME').sum(); 环比 = 月.pct_change(); v = 环比.iloc[-1]; return None if pd.isna(v) else float(v)。
explain: 2026-01 合计 300（100+200），2026-02 合计 400，环比 = (400-300)/300 ≈ 0.3333。注意先按天汇总（同天可能有重复），再按月 resample。
```
