# 第 5 章 · 文件读写 · 大测验

> 8 道题。这一章是"让数据真正落地"的一章。
> **全对才算通过这一章**。

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 np.save / np.load 的后缀，正确的是？
options:
- 两者都可以省略 .npy
- save 会自动补 .npy，load 必须写全
- load 会自动补 .npy，save 必须写全
- 两者都必须写全
answer: 1
explain: 最容易踩的小坑：np.save('data', arr) 生成 data.npy，但 np.load('data') 会去找一个叫 data 的文件而报 FileNotFoundError。读的时候要写全 data.npy。
```

```quiz
type: choice
q: np.loadtxt 读一个全是整数的 CSV，读回来默认是什么类型？
options:
- int
- float
- str
- 自动判断
answer: 1
explain: loadtxt 默认全部读成 float64，即使文件里全是整数。想要整数必须显式写 dtype=int。npy 则不同 —— 它记住原始类型，读回来一模一样。
```

```quiz
type: choice
q: 关于 loadtxt 和 genfromtxt，正确的是？
options:
- 完全一样，只是名字不同
- loadtxt 遇到空字段会报错；genfromtxt 会把它变成 nan
- genfromtxt 更快，应总是优先使用
- genfromtxt 读不了 CSV
answer: 1
explain: 最关键的区别。loadtxt 更简单更快，但只要有一个空字段就崩 —— 而真实数据几乎总有缺失。数据干净用 loadtxt，有缺失用 genfromtxt。
```

```quiz
type: choice
q: 读一个只有一行的 CSV，loadtxt 返回的形状是？
options:
- (1, n)
- (n,)
- 报错
- 取决于 dtype
answer: 1
explain: 静默陷阱：单行文件读成一维 (n,)，若按二维处理（data[:, 0]）就会崩。用 np.atleast_2d() 可强制至少二维，写通用代码时值得养成习惯。
```

```quiz
type: choice
q: 填补缺失值时，为什么通常按"列均值"而不是"全表均值"？
options:
- 列均值算得更快
- 不同列的量级可能差别很大，用全表均值会互相污染
- 全表均值会报错
- 两者没有区别
answer: 1
explain: 比如 A 城市月销 800、B 城市 200，全表均值 500 会把 A 往下压、B 往上抬，两边统计都失真。按列填补才保留了每列自己的水平。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 用 genfromtxt 读一个含空字段的 CSV，打印读到的数组（缺失应变成 nan）
starter: |
  import numpy as np
  
  open('m.csv', 'w').write('1,2\\n3,\\n5,6\\n')
  
  # np.genfromtxt('m.csv', delimiter=',')
  # loadtxt 会报错，genfromtxt 把空字段变成 nan
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "nan" in __out
hint: print(np.genfromtxt('m.csv', delimiter=','))。np.loadtxt 遇到空字段会 ValueError，genfromtxt 则把它变成 nan。
explain: 这就是 genfromtxt 存在的理由：真实数据总有空缺。它把空缺变成 nan，正好接上 nanmean / nanstd / nanargmax 那一套工具。
```

```quiz
type: code
q: 读一个含哨兵值 -1 的 CSV，把 -1 替换成 nan，打印替换后是否还有 -1（应该是 False）
starter: |
  import numpy as np
  
  open('s.csv', 'w').write('1,2\n-1,4\n5,6\n')
  
  # 1. 用 np.genfromtxt('s.csv', delimiter=',') 读进来
  # 2. 把哨兵值 -1 替换成 nan：arr[arr == -1] = np.nan
  # 3. 打印 np.any(arr == -1)，应该是 False
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "False" in __out
hint: arr = np.genfromtxt('s.csv', delimiter=',') 然后 arr[arr == -1] = np.nan，最后 print(np.any(arr == -1))。布尔索引赋值是批量替换最直接的写法。
explain: 这是真实数据清洗的第一步：把各种"哨兵值"（-1、999、-999）统一换成 nan，让后续所有 nan 安全函数自动忽略它们。统一表示法是干净数据的前提 —— 如果有的缺失是 -1、有的是 999、有的是空，统计代码会写得极其痛苦。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「数据流水线」：生成脏数据写入 CSV → 读回 → 清洗缺失 → 统计 → 输出报告 → 存成 npy
checklist:
- 用 savetxt 写出了一个 CSV（带表头、指定 fmt）
- 用 genfromtxt 读回（跳过表头）
- 处理了缺失（nan 或哨兵值 → 按列均值填补）
- 至少算了 3 项统计（总额、均值、标准差或排名）
- 输出了格式整齐的报告
- 用 np.save 把清洗后的数据存了下来
- 代码能跑通，没有报错
starter: |
  import numpy as np
  
  np.random.seed(42)
  sales = np.random.randint(100, 1000, size=(12, 4)).astype(float)
  sales[2, 1] = np.nan      # 制造缺失
  sales[5, 2] = -1          # 制造录入错误
  
  cities = ['北京', '上海', '广州', '深圳']
  
  # 1. 写出 CSV
  np.savetxt('sales.csv', sales, delimiter=',', fmt='%.0f',
             header='北京,上海,广州,深圳', comments='')
  
  # 2. 读回来
  raw = np.genfromtxt('sales.csv', delimiter=',', skip_header=1)
  
  # 3. 清洗：-1 变 nan，再按列均值填补
  # 4. 统计：总额、月均、排名
  # 5. 报告 + np.save
hint: 清洗用 clean[clean == -1] = np.nan，然后用 np.where(np.isnan(clean)) 定位 + np.take(col_mean, inds[1]) 按列填补。排名用 np.argsort(totals)[::-1]。最后 np.save('clean.npy', clean)。
explain: 这是第 5 章的收官项目，把整本书串成一条真实流水线：写文件、读文件、清洗缺失、axis 统计、排名、输出、持久化。走通这一遍，你就具备独立处理一份结构化数据的完整能力了。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题：**

```python
import numpy as np
open('m.csv', 'w').write('1,2\n3,\n5,6\n')
print(np.genfromtxt('m.csv', delimiter=','))
```

**函数题：**

```python
import numpy as np

def load_and_clean(path):
    arr = np.genfromtxt(path, delimiter=',', skip_header=1)
    arr[arr == -1] = np.nan
    return arr
```

**小项目：**

```python
import numpy as np

np.random.seed(42)
sales = np.random.randint(100, 1000, size=(12, 4)).astype(float)
sales[2, 1] = np.nan
sales[5, 2] = -1
cities = ['北京', '上海', '广州', '深圳']

np.savetxt('sales.csv', sales, delimiter=',', fmt='%.0f',
           header='北京,上海,广州,深圳', comments='')

raw = np.genfromtxt('sales.csv', delimiter=',', skip_header=1)

clean = raw.copy()
clean[clean == -1] = np.nan
col_mean = np.nanmean(clean, axis=0)
inds = np.where(np.isnan(clean))
if len(inds[0]):
    clean[inds] = np.take(col_mean, inds[1])

totals = clean.sum(axis=0)
monthly = clean.sum(axis=1)

line = "=" * 38
print(line)
print(f"  总额 {clean.sum():,.0f}   月均 {monthly.mean():,.0f}")
print("  城市排名：")
for rank, i in enumerate(np.argsort(totals)[::-1], 1):
    print(f"    {rank}. {cities[i]}  {totals[i]:,.0f}")
print(f"  最佳月份：第 {np.argmax(monthly) + 1} 月")
print(line)
np.save('sales_clean.npy', clean)
```

</details>

## 这一章，你学会了什么

- **npy / npz**：二进制存档，快且保真；save 自动补后缀、load 必须写全；npz 像字典
- **CSV 读写**：`savetxt` 用 `fmt` 控格式、`comments=''` 去 #；`loadtxt` 默认读成 float，表头要 `skiprows`
- **genfromtxt**：有缺失就用它，空字段变 nan，`filling_values` 可直接填
- **读报错**：找不到文件看路径、列数不一致看行、转不了数字看表头、UnicodeDecodeError 换 gbk
- **完整流水线**：造/读 → 检查 → 清洗 → 统计 → 报告 → 存档

最后一章会做三个综合实战项目，并指出 NumPy 的边界在哪。
