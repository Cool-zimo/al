# 第 3 章 · 清洗与缺失值 · 大测验

> 8 道题。这一章是"真实数据"和"练习数据"的分界线。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 为什么不能用 df[df['成绩'] == np.nan] 筛选缺失值？
options:
- 语法不对
- NaN 不等于任何东西（包括它自己），这个比较永远是 False
- np.nan 在 pandas 里不存在
- 应该写 df['成绩'] = np.nan
answer: 1
explain: NaN 的定义就是"不等于任何东西"，np.nan == np.nan 返回 False。所以这个筛选永远得到空结果，而且不报错 —— 特别隐蔽。判断缺失一律用 isna() / notna()。
```

```quiz
type: choice
q: 有一列缺失了 60%，最好的处理方式是？
options:
- 用均值填补
- 用中位数填补
- 删掉这一列
- 填 0
answer: 2
explain: 缺失过半时这一列信息量已经很低，填补等于"用 40% 的数据猜 60%"，会严重误导分析。果断删列。核心原则：别为了让缺失消失而瞎填。
```

```quiz
type: choice
q: 想把含 NaN 的一列转成整数，正确的是？
options:
- 直接 astype(int)
- 先 fillna 再 astype(int)，或用 astype('Int64')
- 用 astype(str) 中转
- pandas 的整数列不支持任何转换
answer: 1
explain: int 没有"空"这个状态，列里有 NaN 时 astype(int) 会报 IntCastingNaNError。两条路：先填补再转（最常用），或转 Int64（大写 I）—— pandas 的可空整数类型。
```

```quiz
type: choice
q: 用 IQR 法找异常值，为什么比"偏离均值 3 个标准差"更可靠？
options:
- IQR 计算更快
- 标准差会被异常值本身撑大导致漏判，IQR 基于分位数不受影响
- IQR 是 pandas 内置的
- 标准差法已废弃
answer: 1
explain: 一个 999 会把 std 撑得极大，"3 倍标准差"的门槛跟着抬高到抓不到它 —— 这叫掩蔽效应。IQR 基于分位数（Q1/Q3 是位置而非数值），极端值动不了它。
```

```quiz
type: choice
q: df[df['商品'].str.contains('苹果')] 筛选时，"商品"列有空值会怎样？
options:
- 自动跳过空值
- 出问题，因为 contains 遇到 NaN 返回 NaN 而不是 True/False
- 把空值当 True
- 把空值当 False
answer: 1
explain: contains 遇到 NaN 返回 NaN（既非 True 也非 False），混进布尔 Series 后筛选会出问题。防御写法：contains('苹果', na=False)。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 clean_missing(df, col)：用该列的中位数填补缺失，返回填补后的 Series
func: clean_missing
starter: |
  def clean_missing(df, col):
      # 用 df[col] 的中位数填补缺失值
      # 返回填补后的 Series（不修改原 df）
      return None
cases: |
  [{"v":[1.0,None,3.0,None,5.0]}], "v" -> [{"v":[1.0,3.0,3.0,3.0,5.0]}]
hint: return df[col].fillna(df[col].median())。median() 会自动跳过 NaN，算出非空值的中位数；fillna 用它填补所有空位。
explain: 填中位数比填均值更抗异常值 —— 收入、房价这类有极端值的数据，均值会被拉偏，中位数不会。这是数值列缺失填补的首选方案。
```

```quiz
type: code
q: 清洗金额列：去掉 '¥' 和逗号后转成数字，打印转换后的最大值
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({'价格': ['¥1,299', '¥89', '暂无']})
  
  # 先 .str.replace 去符号和逗号，再 to_numeric(errors='coerce')
  # 1299 和 89 → 最大值 1299
  
  print("在这里改")
tests:
- assert "1299" in __out
hint: cleaned = df['价格'].str.replace('¥','').str.replace(',','')，然后 print(pd.to_numeric(cleaned, errors='coerce').max())。两步走：先清干扰字符，再转换。
explain: 清洗金额列的标准两步。注意 astype 不行 —— 它遇到 '暂无' 会整个崩溃，必须用 to_numeric(errors='coerce') 让转不动的变成 NaN。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「脏数据清洗流水线」：读一张脏表 → 查缺失 → 清洗金额列 → 查重删重 → 用 IQR 查异常 → 输出干净表 + 清洗报告
checklist:
- 用 isna().sum() 统计了每列缺失
- 用 .str + to_numeric(errors='coerce') 清洗了金额列
- 用 duplicated(subset=[...]) 查出并用 drop_duplicates 删了重复
- 用 quantile 算出 Q1/Q3/IQR 并划出了异常值边界
- 对异常值做了处理（删除或 clip 截断）
- 输出了清洗前后的行数对比
- 代码能跑通，没有报错
starter: |
  import pandas as pd
  import numpy as np
  
  df = pd.DataFrame({
      '订单号': ['A001', 'A002', 'A002', 'A003', 'A004', 'A005'],
      '金额': ['¥1,299', '¥89', '¥89', '¥99,999', '暂无', '¥150'],
      '城市': ['北京', '上海', '上海', '广州', '北京', '北京']
  })
  
  print("清洗前行数：", len(df))
  
  # 1. 缺失检查：df.isna().sum()
  # 2. 清洗金额：去 ¥ 和逗号 → to_numeric(errors='coerce')
  # 3. 查重删重：duplicated(subset=['订单号']) → drop_duplicates
  # 4. IQR 查异常：q1/q3/iqr → upper = q3 + 1.5*iqr
  # 5. 处理异常（删掉或 clip）
  # 6. 输出清洗后行数 + 各列缺失
hint: 金额清洗用 df['金额'].str.replace('¥','').str.replace(',','') 再 pd.to_numeric(..., errors='coerce')；异常值用 q1=df['金额'].quantile(0.25) 等算出边界后 df[df['金额']<=upper]。
explain: 这个项目把第 3 章五个课的知识点串成一条完整流水线 —— 真实工作里清洗数据就是这么一步步走的。走通一遍，"拿到脏数据该怎么办"就有了肌肉记忆。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
def clean_missing(df, col):
    return df[col].fillna(df[col].median())
```

**动手题：**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({'价格': ['¥1,299', '¥89', '暂无']})
cleaned = df['价格'].str.replace('¥', '').str.replace(',', '')
print(pd.to_numeric(cleaned, errors='coerce').max())
```

**小项目：**

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    '订单号': ['A001', 'A002', 'A002', 'A003', 'A004', 'A005'],
    '金额': ['¥1,299', '¥89', '¥89', '¥99,999', '暂无', '¥150'],
    '城市': ['北京', '上海', '上海', '广州', '北京', '北京']
})

print("清洗前行数：", len(df))

# 1. 缺失检查
print("\n--- 缺失 ---")
print(df.isna().sum())

# 2. 清洗金额
df['金额'] = pd.to_numeric(
    df['金额'].str.replace('¥', '').str.replace(',', ''),
    errors='coerce'
)
print("\n金额列类型：", df['金额'].dtype, "| 缺失：", df['金额'].isna().sum())

# 3. 查重删重
print("\n重复订单号：", df.duplicated(subset=['订单号']).sum())
df = df.drop_duplicates(subset=['订单号'], keep='first')
print("去重后：", len(df), "行")

# 4. IQR 查异常
q1, q3 = df['金额'].quantile(0.25), df['金额'].quantile(0.75)
iqr = q3 - q1
upper = q3 + 1.5 * iqr
print(f"\n金额正常上界：{upper}")
print("异常订单：")
print(df[df['金额'] > upper])

# 5. 处理异常（删掉）
df = df[df['金额'] <= upper]

# 6. 报告
print("\n=== 清洗报告 ===")
print("清洗后行数：", len(df))
print("剩余缺失：")
print(df.isna().sum())
print("\n金额均值：", df['金额'].mean())
```

</details>

## 这一章，你学会了什么

- **NaN 的本质**：不等于自己，判断只能用 `isna()`；整数列混进 NaN 会变 float
- **删还是填**：缺失超 50% 删列；数值填中位数；时间序列用 ffill；关键列缺失必须删
- **类型转换**：`to_numeric(errors='coerce')` 是清洗数字列的万能钥匙；NaN 转不了 int
- **重复与异常**：`duplicated(subset=...)` + `keep=False` 揪重复；IQR 划异常；`clip` 截断
- **文字清洗**：`.str` 访问器，`contains(na=False)` 防御空值，`split(expand=True)` 拆列

**下一章：分组与聚合**——`groupby` 是 pandas 最强大的功能，也是数据分析的核心动作。
