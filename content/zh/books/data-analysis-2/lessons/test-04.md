# 第 4 章 · 分组与聚合 · 大测验

> 8 道题。groupby 是 pandas 最强大的功能，也是"数据分析"真正开始的地方。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: groupby 的 count() 和 size() 有什么区别？
options:
- 完全一样
- count() 只数非空值，size() 数这一组的所有行数
- size() 只数非空值
- count() 用于数字列，size() 用于文字列
answer: 1
explain: 数据没缺失时两者相同；有缺失时 count() 会更小，因为它跳过 NaN。所以"这组有多少有效数据"用 count()，"这组共几行"用 size()。
```

```quiz
type: choice
q: 想给原表加一列"每个学生在班里的成绩排名百分比"，应该用？
options:
- groupby().mean()
- groupby().transform()
- groupby().filter()
- groupby().agg()
answer: 1
explain: 加列要求结果行数和原表一致 —— transform 正是为此设计的，它把聚合结果广播回同组的每一行。直接聚合每组只给一行，filter 会删行，都不行。
```

```quiz
type: choice
q: pivot_table 的 aggfunc 默认值是什么？
options:
- 'sum'
- 'mean'
- 'count'
- 'max'
answer: 1
explain: 从 Excel 转过来最容易踩的坑 —— Excel 透视表默认求和，pandas 的 pivot_table 默认是 mean（求平均）。想求和必须显式写 aggfunc='sum'。
```

```quiz
type: choice
q: unstack() 和 stack() 分别做什么？
options:
- unstack 把列变成索引，stack 把索引变成列
- unstack 把内层索引变成列（长变宽），stack 把列变回索引（宽变长）
- 两者都是排序
- 两者都是删除层级
answer: 1
explain: 互逆操作：unstack 把最内层索引摊成列（长变宽，适合展示），stack 把列收回去变成索引（宽变长，pandas 大多数分析操作更喜欢长表）。
```

```quiz
type: choice
q: 拿到一份新数据，正确的第一步是？
options:
- 直接 groupby 看汇总
- 先看结构（dtypes / head / isna），再清洗，最后才聚合
- 先画透视表
- 先删掉缺失行
answer: 1
explain: 不知道列是什么类型就动手一定出错 —— 比如"销售额"存成字符串（带 ¥ 和逗号），直接 groupby 求和会失败或算错。顺序永远是：看结构 → 清洗 → 补缺失 → 分组 → 透视 → 结论。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 city_total(df)：按"城市"分组求"销售额"总和，返回总额最高的城市名
func: city_total
starter: |
  def city_total(df):
      # group by '城市', sum the '销售额' column
      # return the NAME of the city with the highest total
      return None
cases: |
  [{"城市":["北京","上海","北京","上海"],"销售额":[100,200,150,300]}] -> 上海
hint: return df.groupby('城市')['销售额'].sum().idxmax()。idxmax 返回最大值的索引标签（城市名），而 argmax 返回的是位置。
explain: "哪个城市卖得最好"要的是名字而不是行号，所以用 idxmax 而非 argmax。这是 groupby 之后最常见的取值动作。
```

```quiz
type: code
q: 用 transform 给每行加上"所在城市的总额"，打印第 0 行的城市总额
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      '城市': ['北京', '上海', '北京', '上海'],
      '销售额': [100, 200, 150, 300]
  })
  
  # df.groupby('城市')['销售额'].transform('sum') 结果和原表一样长
  # 第 0 行是北京 → 北京总额 = 100 + 150 = 250
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "250" in __out
hint: df['城市总额'] = df.groupby('城市')['销售额'].transform('sum')，然后 print(df.loc[0,'城市总额'])。transform 把聚合结果广播回每一行。
explain: transform 和直接聚合的区别就是结果长度：直接聚合每组一行，transform 保持原表行数 —— 因为要把组级的值写回每一行。算"占所在组的百分比"就用它。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一份「销售分析报告」：清洗脏数据 → 按城市分组汇总（含 count）→ 用 transform 加占比列 → 做城市×类别透视表（含总计）→ 输出结论（总额、最高城市、占比）
checklist:
- 用 to_numeric + .str 清洗了带 ¥ 和逗号的销售额列
- 处理了缺失（删除或填补，并说明了依据）
- 用 groupby + agg 算出了各城市的总额、均值、笔数
- 用 transform 加了"占所在城市百分比"这一列
- 用 pivot_table 做了城市×类别透视表，带 margins 总计
- 用 idxmax 找出最高城市并算出其占比
- 代码能跑通，没有报错
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({
      '城市': ['北京', '上海', '北京', '上海', '广州', '广州'],
      '类别': ['外设', '显示', '外设', '显示', '音频', '外设'],
      '销售额': ['¥1,299', '¥8,999', '¥899', '¥12,999', '暂无', '¥599']
  })
  
  print("清洗前行数：", len(df))
  
  # 1. 清洗销售额（去 ¥ 和逗号 → to_numeric）
  # 2. 处理缺失（'暂无' 变 NaN → dropna）
  # 3. groupby + agg(['sum','mean','count'])
  # 4. transform 加占比列
  # 5. pivot_table(..., margins=True)
  # 6. idxmax 找最高城市，算占比
hint: 清洗用 df['销售额'].str.replace('¥','').str.replace(',','') 再 pd.to_numeric(errors='coerce')；透视表记得 aggfunc='sum' 和 fill_value=0。
explain: 这个项目串起了第 4 章全部要点 —— 更重要的是串起了**顺序**：先清洗再聚合，顺序错了结论就错。走通一遍，"拿到数据怎么分析"就有了完整的动作序列。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
def city_total(df):
    return df.groupby('城市')['销售额'].sum().idxmax()
```

**动手题：**

```python
import pandas as pd

df = pd.DataFrame({
    '城市': ['北京', '上海', '北京', '上海'],
    '销售额': [100, 200, 150, 300]
})
df['城市总额'] = df.groupby('城市')['销售额'].transform('sum')
print(df.loc[0, '城市总额'])
```

**小项目：**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    '城市': ['北京', '上海', '北京', '上海', '广州', '广州'],
    '类别': ['外设', '显示', '外设', '显示', '音频', '外设'],
    '销售额': ['¥1,299', '¥8,999', '¥899', '¥12,999', '暂无', '¥599']
})

print("清洗前行数：", len(df))

# 1. 清洗
df['销售额'] = pd.to_numeric(
    df['销售额'].str.replace('¥', '').str.replace(',', ''),
    errors='coerce'
)
print("清洗后缺失：", df['销售额'].isna().sum())

# 2. 缺失处理（销售额是核心指标，缺了没法分析）
df = df.dropna(subset=['销售额'])
print("处理后行数：", len(df))

# 3. 分组汇总（带上 count 看样本量）
g = df.groupby('城市')['销售额'].agg(['sum', 'mean', 'count'])
print("\n=== 各城市 ===")
print(g.sort_values('sum', ascending=False))

# 4. transform 加占比
df['城市总额'] = df.groupby('城市')['销售额'].transform('sum')
df['城市占比'] = (df['销售额'] / df['城市总额'] * 100).round(1)
print("\n=== 明细（含占比）===")
print(df)

# 5. 透视表
print("\n=== 城市 × 类别 ===")
print(df.pivot_table(index='城市', columns='类别', values='销售额',
                     aggfunc='sum', fill_value=0, margins=True,
                     margins_name='合计'))

# 6. 结论
s = df.groupby('城市')['销售额'].sum()
total = df['销售额'].sum()
print("\n=== 结论 ===")
print(f"总额 {total:,.0f}")
print(f"最高城市 {s.idxmax()}（{s.max():,.0f}，占比 {s.max()/total*100:.1f}%）")
```

</details>

## 这一章，你学会了什么

- **groupby 三步**：拆分 → 应用 → 合并；语法是 `groupby(按什么分)[算哪列].怎么算`
- **count vs size**：前者不含空，后者含
- **transform 加列、filter 删组**：前者行数不变，后者整组去留
- **多级索引**：`reset_index` 扁平化、`unstack`/`stack` 长宽互转
- **pivot_table**：就是 groupby + unstack，**默认 mean 不是 sum**；crosstab 数次数
- **分析流程的顺序**：看结构 → 清洗 → 补缺失 → 分组 → 透视 → 结论

**下一章：连接与重塑**——多个表怎么拼在一起（`merge` / `concat`）。
