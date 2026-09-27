# 第 6 章 · 端到端实战 · 大测验

> 8 道题。这一章解决的是"把前 5 章所有技能串成一条完整流水线：读脏数据 → 清洗 → 洞察 → 可视化 → 出报告"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

---

```quiz
type: choice
exam: true
q: 用 pandas 读取一份编码为 GBK 的 CSV 文件时，正确写法是？
options:
- pd.read_csv('data.csv', encoding='gbk')
- pd.read_csv('data.csv', code='gbk')
- pd.read_csv('data.csv', decode='gbk')
- pd.read_csv('data.csv').set_encoding('gbk')
answer: 0
explain: read_csv 的 encoding 参数用于指定文件编码。中文 Windows 环境导出的 CSV 常为 GBK 编码，不指定会报 UnicodeDecodeError。常见取值：'utf-8'、'gbk'、'gb2312'、'gb18030'（兼容性最好）。
```

```quiz
type: choice
exam: true
q: 数据中某列本应是日期类型，却被读成了 object。用哪种方式可以转换并提取出"月份"用于分组？
options:
- pd.to_datetime(df['日期列']) 后再用 .dt.month
- df['日期列'].astype(int).month
- df['日期列'].split('-')[1]
- 手动写循环逐个解析
answer: 0
explain: pd.to_datetime() 能把字符串列批量转为 Timestamp 类型，转换后通过 .dt.month、.dt.year、.dt.dayofweek 等 accessor 提取时间特征。这是时间特征工程的标准做法，比手动字符串分割安全且支持各种日期格式。
```

```quiz
type: choice
exam: true
q: 清洗数据时，对于数值列中的缺失值，以下哪种做法最不可取？
options:
- 用该列的中位数填充（median fill）
- 用该列均值填充（mean fill）
- 直接删除含有缺失值的行（dropna），无论缺失多少
- 先分析缺失比例和缺失原因，再决定填充策略
answer: 2
explain: 不问青红皂白直接 dropna 会丢失大量可能有价值的信息，尤其当缺失比例很高时。正确的做法先分析：缺失是随机的还是系统性的？缺失比例多大？再决定用均值/中位数/众数填充，还是用模型预测，还是保留缺失作为一个类别。
```

```quiz
type: choice
exam: true
q: 一份端到端数据分析报告的"分组洞察"环节，最高效的找差异工具是？
options:
- 逐行打印原始数据
- pivot_table 做交叉表，把"差异"摆在格子大小上
- 把所有列画成散点图矩阵
- 只算总均值
answer: 1
explain: pivot_table 是二维分组聚合，天然把"谁高谁低"暴露在每个格子里。比如"门店 × 渠道"的交叉销售额表，哪个格子大哪个小一目了然，是找结论最快的方式。配合排序和占比计算，能快速定位 Top/Bottom。
```

```quiz
type: choice
exam: true
q: 写分析报告时，以下哪个做法最能提升报告的可读性？
options:
- 把所有代码原样粘贴进报告
- 每个图表配一段"发现了什么"的文字解读，而不是只放图
- 用尽可能多的图表（越多越显专业）
- 把所有数据都放进附录表格
answer: 1
explain: 报告的核心是"洞察"而非"展示"。每张图旁边配一段结论性文字（如"Q3 上海门店销售额环比增长 18%，主要由线上渠道驱动"），让读者 3 秒抓住重点。代码放附录或脚本里，图表求精不求多。
```

## 第二部分 · 动手题

---

```quiz
type: function
exam: true
q: 写一个函数 clean_store_data，接收 DataFrame（含"门店"列，门店名可能有首尾空格和"北京-海淀"与"北京海淀"的不一致写法，还可能有重复行），返回清洗后的 DataFrame。清洗规则：去除门店名首尾空格、把"-"替换为""（空字符串）、去除完全重复的行、重置索引。
func: clean_store_data
starter: |
  import pandas as pd

  def clean_store_data(df):
      return df
cases: |
  pd.DataFrame({'门店':['北京海淀','上海-南京路','北京海淀 ','上海-南京路'],'销售额':[100,200,100,200]}) -> 行数为2的DataFrame，门店为['北京海淀','上海南京路']
hint: df=df.copy(); df['门店']=df['门店'].str.strip().str.replace('-','',regex=False); df=df.drop_duplicates().reset_index(drop=True); return df
explain: 字符串清洗是数据清洗的高频操作。strip() 去空格、str.replace 统一分隔符、drop_duplicates 去重，三步组合覆盖了门店名不一致和重复行两个典型问题。
```

```quiz
type: function
exam: true
q: 写一个函数 monthly_report，接收清洗后的销售 DataFrame（含"日期"列和"销售额"列），先将日期转为 datetime 并提取月份，再按月汇总销售额（求和），返回 dict，键为月份数字（int），值为该月销售额（int）。
func: monthly_report
starter: |
  import pandas as pd

  def monthly_report(df):
      return {}
cases: |
  pd.DataFrame({'日期':['2024-01-05','2024-01-20','2024-02-10','2024-02-15'],'销售额':[100,200,300,400]}) -> {1:300,2:700}
  pd.DataFrame({'日期':['2024-03-01'],'销售额':[999]}) -> {3:999}
hint: df=df.copy(); df['日期']=pd.to_datetime(df['日期']); df['月']=df['日期'].dt.month; return {int(k):int(v) for k,v in df.groupby('月')['销售额'].sum().items()}
explain: 时间特征提取 + 分组聚合是端到端流程的核心环节。pd.to_datetime 转类型、.dt.month 提取月份、groupby 聚合，三步完成"按时间维度汇总"这个最常见的分析需求。
```

## 第三部分 · 小项目

---

```quiz
type: project
exam: true
q: 完成一次端到端的销售数据分析：从模拟的脏数据出发，完成数据读取与类型转换、清洗（去空格、统一门店名、填充缺失销售额用中位数、去除异常高值）、特征工程（提取月份和季度）、分组洞察（按城市×月份汇总销售额和订单数，算客单价）、可视化（至少 3 张图：城市月度趋势折线图、城市×月份热力图、客单价对比柱状图）、最后输出一段 150 字以内的分析报告。所有图表 Y 轴从 0 开始，标注数据来源和口径。
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  import pandas as pd
  import numpy as np

  plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  plt.rcParams['axes.unicode_minus'] = False

  np.random.seed(42)
  # 模拟脏数据
  n = 200
  raw = pd.DataFrame({
      '门店': np.random.choice(['北京朝阳店 ', ' 上海南京路店', '北京-海淀店', '上海陆家嘴店'], n),
      '日期': pd.date_range('2024-01-01', periods=n, freq='D').strftime('%Y-%m-%d').tolist(),
      '销售额': np.random.randint(1000, 50000, n).astype(float),
      '订单数': np.random.randint(10, 500, n),
  })
  # 人为制造脏数据
  raw.loc[5, '销售额'] = np.nan          # 缺失值
  raw.loc[10, '销售额'] = 9999999        # 异常值
  raw.loc[15, '门店'] = '北京朝阳店 '     # 重复行

  # TODO 1: 类型转换——日期字符串转 datetime

  # TODO 2: 清洗——
  #   - 门店名去空格、把"-"替换为""
  #   - 填充缺失销售额（用中位数）
  #   - 剔除销售额超过 3 倍 IQR 上界的异常值
  #   - 去除完全重复行

  # TODO 3: 特征工程——提取月份和季度

  # TODO 4: 分组洞察——按城市×月份汇总销售额和订单数，算客单价

  # TODO 5: 可视化 1——折线图：各城市月度销售额趋势（Y 轴从 0 开始）

  # TODO 6: 可视化 2——热力图：城市 × 月份销售额交叉表

  # TODO 7: 可视化 3——柱状图：各城市客单价对比

  # TODO 8: 输出报告——150 字以内总结发现
checklist:
- 是否完成了日期类型转换（pd.to_datetime）
- 是否完成了门店名清洗（去空格、统一分隔符）
- 是否用中位数填充了缺失值
- 是否用 IQR 方法去除了异常值
- 是否成功提取了月份和季度特征
- 分组聚合是否同时包含销售额、订单数和客单价
- 3 张图是否全部生成且 Y 轴从 0 开始
- 报告是否在 150 字以内，包含数据来源说明和主要结论
explain: 这是全书的收官项目，把读数据、清洗、特征工程、聚合、可视化、报告写作全部串成一条流水线。重点检验的是"工程完整性"——每一步都不能漏，且要在报告中诚实说明数据口径和清洗方式。
```
