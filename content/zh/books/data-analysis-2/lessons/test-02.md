# 第 2 章 · 选取与筛选 · 大测验

> 8 道题。这一章的 loc/iloc 是 pandas 最大的混淆点，也是日常用得最多的。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 有一个 DataFrame 的列是 ['v']，行索引是 [0,1,2]。执行 df[1] 会怎样？
options:
- 取第 1 行
- 取名为 1 的列
- 报错 KeyError
- 取前 1 行
answer: 2
explain: 方括号优先当"取列"处理 —— 没有名为 1 的列，所以 KeyError。想取第 1 行要用 df.iloc[1] 或切片 df[1:2]。规矩：方括号里写列名或列表→取列；写切片或布尔→取行。
```

```quiz
type: choice
q: 关于 loc 和 iloc 的切片边界，正确的是？
options:
- 两者都含尾
- 两者都不含尾
- loc 含尾，iloc 不含尾
- loc 不含尾，iloc 含尾
answer: 2
explain: 最容易数错行数的地方：同样的 0:2，df.loc[0:2] 给 3 行（含 2），df.iloc[0:2] 给 2 行（不含 2）。loc 含尾是因为标签是名字，"从 a 到 c" 自然包含 c。
```

```quiz
type: choice
q: 要筛选"年龄>18 且 成绩>90"，正确的写法是？
options:
- df[df['年龄'] > 18 and df['成绩'] > 90]
- df[df['年龄'] > 18 & df['成绩'] > 90]
- df[(df['年龄'] > 18) & (df['成绩'] > 90)]
- df[(df['年龄'] > 18) && (df['成绩'] > 90)]
answer: 2
explain: 三个要点：① 不能用 and/or（那是对单个布尔值运算，对 Series 会报错），必须用 & / |；② 每个条件都要加括号，否则运算符优先级出错；③ 取反用 ~ 而不是 not。
```

```quiz
type: choice
q: 为什么 df[df['成绩']<60]['等级'] = '不及格' 可能改不动数据？
options:
- 语法错误
- df[条件] 返回的是副本，在副本上赋值不影响原表
- 列名写错了
- 条件有问题
answer: 1
explain: df[条件] 产生一个新 DataFrame（pandas 多数操作返回副本），在副本上赋值改不到原表。pandas 会提示 SettingWithCopyWarning，但这个警告有时不显示。一律用 df.loc[条件, '列'] = 值。
```

```quiz
type: choice
q: df.sort_values('成绩', ascending=False) 之后，索引会怎样？
options:
- 自动重新编号成 0,1,2...
- 保持原来的标签，跟着数据一起走
- 全部变成 NaN
- 按成绩重新编号
answer: 1
explain: 排序不重置索引 —— 原标签跟着数据移动。想重新编号要显式 .reset_index(drop=True)，且 drop=True 很关键，否则旧索引会变成新的一列叫 index。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写 filter_top(df, n)：返回成绩最高的 n 行（用 nlargest），保持原索引不变
func: filter_top
starter: |
  def filter_top(df, n):
      # 用 nlargest 按 '成绩' 列取前 n 行
      # 返回 DataFrame（保持原索引，不要 reset_index）
      return None
cases: |
  [{"姓名":["张三","李四","王五"],"成绩":[89.5,92.0,78.0]}], 2 -> [{"姓名":["李四","张三"],"成绩":[92.0,89.5]}]
hint: return df.nlargest(n, '成绩')。nlargest 直接返回前 N 大的完整行，比 sort_values(...).head(n) 更简洁，且不会重置索引。
explain: nlargest 是"取前 N 名"的专用方法。注意它返回完整行、索引保持原样 —— 这正好符合"不要 reset_index"的要求，也体现了 pandas 索引跟着数据走的默认行为。
```

```quiz
type: code
q: 用 loc 一步完成"筛选 + 选列 + 改值"：给成绩>=90 的人把等级设为"优"，打印等级列有几个"优"
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      '姓名': ['张三', '李四', '王五', '赵六'],
      '成绩': [89.5, 92.0, 95.0, 78.0]
  })
  
  # df.loc[df['成绩'] >= 90, '等级'] = '优'
  # 李四和赵六... 不对，是李四(92)和王五(95) → 2 个 '优'
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "2" in __out
hint: df.loc[df['成绩'] >= 90, '等级'] = '优'，然后 print((df['等级'] == '优').sum())。条件赋值格式固定：loc[行条件, 列名] = 新值。
explain: 条件赋值是最高频操作，格式固定为 df.loc[条件, '列名'] = 新值。不匹配的行保持 NaN（因为列是新建的）。这正是 loc 相对链式写法的价值 —— 链式会在副本上改，改不动。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「销售明细分析器」：建一张销售表 → 筛选指定类别 → 算销售额 → 给畅销品打标 → 按销售额排序 → 取每个城市的最高一笔
checklist:
- 用字典创建了含"城市/类别/单价/销量"的 DataFrame
- 用列间运算新增了"销售额"列
- 用多条件（& 或 |）筛选出了指定类别
- 用 loc 按条件给某列赋了新值（如打标"重点"）
- 用 sort_values 排了序
- 用"先排序再去重"取出了每个城市销售额最高的一笔
- 代码能跑通，没有报错
starter: |
  import pandas as pd
  
  df = pd.DataFrame({
      '城市': ['北京', '上海', '北京', '上海', '广州', '广州'],
      '类别': ['外设', '外设', '显示', '显示', '外设', '音频'],
      '单价': [199, 89, 1299, 999, 399, 599],
      '销量': [120, 500, 30, 45, 200, 80]
  })
  
  # 1. 新增销售额列
  df['销售额'] = df['单价'] * df['销量']
  
  # 2. 筛选：外设或音频（用 | 多条件）
  # 3. 给销售额 >= 40000 的打标"重点"
  # 4. 按销售额降序排序
  # 5. 每个城市取最高一笔（先排序再 drop_duplicates(subset=['城市'])）
hint: 筛选用 df[(df['类别']=='外设') | (df['类别']=='音频')]；打标用 df.loc[df['销售额']>=40000, '标记'] = '重点'；每城最高一笔用 df.sort_values('销售额', ascending=False).drop_duplicates(subset=['城市'])。
explain: 这个项目串起了第 2 章全部要点：列间运算、多条件筛选、loc 条件赋值、排序、以及"先排序再去重"取分组最大值。走通一遍，选取与筛选这套动作就成型了。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
def filter_top(df, n):
    return df.nlargest(n, '成绩')
```

**动手题：**

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '成绩': [89.5, 92.0, 95.0, 78.0]
})
df.loc[df['成绩'] >= 90, '等级'] = '优'
print((df['等级'] == '优').sum())
```

**小项目：**

```python
import pandas as pd

df = pd.DataFrame({
    '城市': ['北京', '上海', '北京', '上海', '广州', '广州'],
    '类别': ['外设', '外设', '显示', '显示', '外设', '音频'],
    '单价': [199, 89, 1299, 999, 45, 599],
    '销量': [120, 500, 30, 45, 200, 80]
})

df['销售额'] = df['单价'] * df['销量']

# 筛选外设或音频
sel = df[(df['类别'] == '外设') | (df['类别'] == '音频')]
print("--- 外设/音频 ---")
print(sel)

# 给高销售额打标
df.loc[df['销售额'] >= 40000, '标记'] = '重点'
print("\n--- 打标后 ---")
print(df)

# 每个城市最高一笔
top = df.sort_values('销售额', ascending=False).drop_duplicates(subset=['城市'])
print("\n--- 各城市最高一笔 ---")
print(top)
```

</details>

## 这一章，你学会了什么

- **取列取行**：方括号里写列名/列表→取列；写切片/布尔→取行。`df[1]` 会报错因为它被当成列名
- **`loc` vs `iloc`**：一个按标签（切片含尾）、一个按位置（切片不含尾），这是最大的混淆点
- **布尔索引**：`&` `|` `~`，每个条件必须加括号，`and`/`or`/`not` 不能用
- **赋值**：一律 `df.loc[条件, '列'] = 值`，链式赋值会在副本上改而失效
- **排序去重**：索引跟着数据走；"先排序再去重"能取出分组最大值所在行

**下一章：清洗与缺失值**——真实数据永远不干净，NaN、脏类型、重复值怎么收拾。
