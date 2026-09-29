# 第 5 章测验 · 连接与重塑

> 连接、合并、变长变宽——这是把"多张表变成一张表"的全部武器。

## 第一部分 · 选择题

```quiz
type: choice
exam: true
q: 用 concat 纵向拼接两个 DataFrame 后，索引重复怎么办？
options:
- 无法处理，只能手动改
- 用 pd.concat([a, b], ignore_index=True) 重新编号
- 必须先用 reset_index 再 concat
- 重复索引会被自动删除
answer: 1
explain: ignore_index=True 会丢弃原有索引，从 0 开始重新编号，是最直接的去重索引办法。
```

```quiz
type: choice
exam: true
q: 左连接 merge(how='left') 的行数跟什么有关？
options:
- 一定等于右表行数
- 一定等于两表行数的最小值
- 至少等于左表行数，右表匹配不上的填 NaN
- 一定等于左表加右表行数之和
answer: 2
explain: 左连接以左表为基准，左表每一行都保留，右表匹配不上的字段填 NaN。
```

```quiz
type: choice
exam: true
q: 一张订单表（订单ID 唯一）和一张明细表（同一订单ID 出现 3 行），按订单ID 做 inner join，结果行数会怎样？
options:
- 不变，还是订单表行数
- 变成明细表行数
- 行数变多，出现一对多膨胀
- 报错，因为键不唯一
answer: 2
explain: 订单表 1 行会复制成 3 行以匹配明细表，这就是一对多连接行数变多的原因。
```

```quiz
type: choice
exam: true
q: 两个 DataFrame 的连接键列名不同（左表叫 编号，右表叫 ID），该怎么写？
options:
- merge(on='编号') 即可，pandas 会自动识别
- merge(left_on='编号', right_on='ID')
- 把右表 ID 列改名为 编号 再 merge(on='编号')
- 只能用 concat
answer: 1
explain: left_on 和 right_on 专门用来处理两边键名不同的情况，是最直接的写法。改名也能达到同样效果。
```

```quiz
type: choice
exam: true
q: 一张表里 键 列有重复值 [1,1,2,3]，拿它跟自己按 键 做 merge，会发生什么？
options:
- 结果行数等于原表
- 产生笛卡尔积，行数膨胀
- 自动去重后连接
- 直接报错
answer: 1
explain: 两边都有重复键时，pandas 会做笛卡尔积：键 1 出现两次 × 两次 = 结果里 4 行键为 1 的记录。这是最容易踩的坑。
```

## 第二部分 · 动手题

```quiz
type: function
exam: true
q: 写一个函数 加总(表a, 表b)，接收两个字典列表（各含 姓名、分数），用 pd.concat 纵向拼接并 ignore_index，返回拼接后的总行数
starter: |
  import pandas as pd

  def 加总(表a, 表b):
      return 0

cases: |
  [{"姓名":"张三","分数":80}], [{"姓名":"李四","分数":90},{"姓名":"王五","分数":85}] -> 3
hint: pd.concat([pd.DataFrame(表a), pd.DataFrame(表b)], ignore_index=True)，返回 len。
explain: 1 + 2 = 3 行，ignore_index 后索引重新从 0 编号。
```

```quiz
type: function
exam: true
q: 写一个函数 融合(宽表)，宽表字典列表形如 [{"姓名":"张三","语文":80,"数学":90}]，用 pd.melt 把它变成长表，id_vars=['姓名']，返回 melt 后的行数
starter: |
  import pandas as pd

  def 融合(宽表):
      return 0

cases: |
  [{"姓名":"张三","语文":80,"数学":90},{"姓名":"李四","语文":70,"数学":85}] -> 4
hint: df = pd.DataFrame(宽表); m = pd.melt(df, id_vars=['姓名']); return len(m)。2 人 × 2 科 = 4 行。
explain: melt 把"语文/数学"两个列名变成 variable 列的值，每人展开成两行，共 4 行。
```

## 第三部分 · 小项目

```quiz
type: function
exam: true
q: 写一个函数 销售透视(数据)，数据字典列表形如 [{"门店":"中关村","月份":"1月","销售额":3000},{"门店":"中关村","月份":"2月","销售额":3200},{"门店":"国贸","月份":"1月","销售额":5000}]。用 pivot_table 按门店作行索引、月份作列，对销售额求和（aggfunc='sum'）。返回透视后国贸店 1月 的值（即 5000）。若 1月 不在列里或值为 NaN，返回 0
starter: |
  import pandas as pd

  def 销售透视(数据):
      return 0

cases: |
  [{"门店":"中关村","月份":"1月","销售额":3000},{"门店":"中关村","月份":"2月","销售额":3200},{"门店":"国贸","月份":"1月","销售额":5000}] -> 5000
hint: df = pd.DataFrame(数据); pt = pd.pivot_table(df, index='门店', columns='月份', values='销售额', aggfunc='sum', fill_value=0); 用 .get 或 .loc 取值，注意列名类型。
explain: pivot_table 会对相同 (门店,月份) 组合自动聚合（aggfunc='sum'），不会像 pivot 那样在重复组合时报错。国贸/1月 = 5000。
```
