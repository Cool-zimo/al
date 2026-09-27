# 第 1 章 · 认识 Series 与 DataFrame · 大测验

> 8 道题。这一章是 pandas 的地基。
> **全对才算通过这一章**。

## 第一部分 · 选择题

```quiz
type: choice
q: pandas 和 NumPy 的关系，正确的是？
options:
- pandas 取代了 NumPy，学会 pandas 就不用 NumPy 了
- pandas 建立在 NumPy 之上，DataFrame 每列的 .values 就是 ndarray
- 两者完全独立，没有任何关系
- NumPy 是 pandas 的简化版
answer: 1
explain: pandas 底层就是 NumPy —— df['列'].values 拿到的就是 ndarray。《数据分析 1》学的广播、axis、布尔索引在 pandas 里全部照用，这是打地基而不是被替代。
```

```quiz
type: choice
q: 两个 Series 相加时，pandas 是怎么对齐的？
options:
- 按位置对齐，和 NumPy 一样
- 按索引标签对齐，对不上的变成 NaN
- 按长度对齐，短的补 0
- 必须先排序才能相加
answer: 1
explain: 按标签对齐是 pandas 的核心特性：运算不会因为行顺序变化而算错。代价是标签对不上时结果静默变成 NaN，不会报错 —— 排查时要留意。
```

```quiz
type: choice
q: df['成绩'] 和 df[['成绩']] 有什么区别？
options:
- 完全一样
- 单方括号得到 Series，双方括号得到 DataFrame
- 单方括号会报错
- 双方括号是取行的
answer: 1
explain: 单方括号放单个列名得到一维 Series；双方括号放列表（哪怕只有一个元素）得到二维 DataFrame。后续运算中这个区别很重要 —— DataFrame 有 columns、能做多列运算，Series 不能。
```

```quiz
type: choice
q: 用 info() 检查时发现"价格"列是 object，但肉眼看着都是数字。最可能的原因是？
options:
- pandas 把所有数字都存成 object
- 这一列混入了千分位逗号、货币符号或"暂无"这类文字
- 数据量太大
- 这一列有缺失值
answer: 1
explain: pandas 只有在整列无法统一成数字时才退回 object。看着像数字却是 object，几乎总是混入了 '1,299'、'¥199' 或 '暂无'。用 head() 肉眼一看就能确认。
```

```quiz
type: choice
q: 关于 Series 的 idxmax()，正确的是？
options:
- 返回最大值的位置下标（第几行）
- 返回最大值的索引标签（那一行的名字）
- 返回最大值本身
- 返回最大值的列名
answer: 1
explain: idxmax 返回"标签"而不是位置，argmax 才返回位置。在表格里通常要的是名字（哪个城市卖得最好）而不是第几行，所以 idxmax 更常用。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 建一个 DataFrame 并新增一列"销售额"= 单价 × 销量，打印销售额总和
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      '商品': ['键盘', '鼠标'],
      '单价': [199, 89],
      '销量': [120, 500]
  })
  
  # df['销售额'] = df['单价'] * df['销量']
  # 总和应该是 199*120 + 89*500 = 68380
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "68380" in __out
hint: df['销售额'] = df['单价'] * df['销量']，然后 print(df['销售额'].sum())。两个 Series 相乘会按索引对齐后逐元素计算，赋值给新列名就是新增一列。
explain: 这是 pandas 最常用的动作之一：列间运算。不需要循环，pandas 自动按索引对齐。另一个高频动作是 df.loc[标签, 列名] 按名字取值。
```

```quiz
type: code
q: 用 idxmax 找出销量最高的城市名，打印它
starter: |
  import pandas as pd
  
  s = pd.Series([10, 20, 30], index=['北京', '上海', '广州'])
  
  # s.idxmax() 返回最大值的索引标签（不是位置）
  # 应该是 '广州'
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "广州" in __out
hint: print(s.idxmax())。idxmax 返回标签，argmax 返回位置 —— 表格里通常要的是名字，所以 idxmax 更常用。
explain: idxmax 返回"最大值的索引标签"而不是位置下标。想知道"卖得最好的是哪个城市"，要的是名字而不是第几行。对应还有 idxmin 找最小值。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「学生成绩表」：建表 → 新增总分列 → 用 idxmax 找最高分 → 用 describe 看统计 → 用 isna 查缺失 → 输出到 CSV
checklist:
- 用字典创建了 DataFrame
- 用列间运算新增了一列（如总分或平均分）
- 用 idxmax 找出了第一名是谁
- 用 describe() 输出了数值列的统计摘要
- 用 isna().sum() 检查了缺失
- 用 to_csv(index=False) 输出了文件
- 代码能跑通，没有报错
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({
      '姓名': ['张三', '李四', '王五', '赵六'],
      '语文': [80, 95, 88, 70],
      '数学': [90, 70, 85, 75],
      '英语': [85, 88, np.nan, 92]      # 故意留一个缺失
  })
  
  # 1. 新增"总分"列（注意有 NaN，用 sum(axis=1) 会自动跳过）
  df['总分'] = df[['语文', '数学', '英语']].sum(axis=1)
  
  # 2. 找出总分最高的人（用 idxmax）
  # 3. describe() 看统计
  # 4. isna().sum() 查缺失
  # 5. to_csv('report.csv', index=False)
hint: 最高分的人：i = df['总分'].idxmax() 得到索引，再用 df.loc[i, '姓名'] 取名字。describe 用 df.describe()。缺失用 df.isna().sum()。输出用 df.to_csv('report.csv', index=False)。
explain: 这个项目串起了第 1 章的全部要点：建表、列间运算、按标签取值、统计摘要、缺失检查、输出文件。走通一遍，你就掌握了拿到一张表格后"从建表到出报告"的完整链路。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题：**

```python
import pandas as pd

df = pd.DataFrame({
    '商品': ['键盘', '鼠标'],
    '单价': [199, 89],
    '销量': [120, 500]
})
df['销售额'] = df['单价'] * df['销量']
print(df['销售额'].sum())
```

```python
import pandas as pd
s = pd.Series([10, 20, 30], index=['北京', '上海', '广州'])
print(s.idxmax())
```

**小项目：**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '语文': [80, 95, 88, 70],
    '数学': [90, 70, 85, 75],
    '英语': [85, 88, np.nan, 92]
})

df['总分'] = df[['语文', '数学', '英语']].sum(axis=1)

top = df['总分'].idxmax()
print(f"第一名：{df.loc[top, '姓名']}，总分 {df.loc[top, '总分']}")

print("\n--- 统计摘要 ---")
print(df.describe())

print("\n--- 缺失检查 ---")
print(df.isna().sum())

df.to_csv('report.csv', index=False)
print("\n已输出 report.csv")
```

</details>

## 这一章，你学会了什么

- **为什么需要 pandas**：NumPy 一个数组只能一种类型，pandas 每列独立类型
- **Series**：带标签的一列，`.values` 是 ndarray，**运算按索引标签对齐**
- **DataFrame**：Series 的字典；`shape` / `columns` / `index` 三属性；单方括号取 Series、双方括号取 DataFrame
- **看数据**：`head` / `info` / `describe` / `isna().sum()` 这套固定流程
- **read_csv**：千分位、编码、占位文字、列数不一致这四大坑，以及 `thousands` / `encoding` / `na_values` / `to_numeric` 的解法

下一章讲**选取与筛选**——`loc` 与 `iloc` 的区别，这是 pandas 最大的混淆点。
