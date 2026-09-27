# 第 6 章 · 综合实战与进阶 · 大测验

> 8 道题。这一章不考新 API，考的是"能不能把学过的东西组合起来"。
> **全对才算通过这一章**。

## 第一部分 · 选择题

```quiz
type: choice
q: 一个 (12, 5) 的销量表（12 个月 × 5 商品），想算"每个商品的年度总量"，应该用？
options:
- sum(axis=0)
- sum(axis=1)
- sum(axis=2)
- sum()
answer: 0
explain: axis=0 是"跨行（月份）加"，把 12 个月压成 1 个，剩下 5 个商品的年度总量。axis=1 会跨商品加，得到 12 个月各自的月度总量。口诀：axis=n 就是把第 n 维压掉。
```

```quiz
type: choice
q: np.convolve(x, kernel, mode='valid') 的结果长度是？
options:
- 和 x 一样长
- len(x) + len(kernel) - 1
- len(x) - len(kernel) + 1
- len(x) - len(kernel)
answer: 2
explain: valid 只在窗口与数据完全重叠处计算，长度 n - k + 1。做移动平均一律用 valid —— full 和 same 会在两端引入"只平均了一半数据"的失真值。
```

```quiz
type: choice
q: 一张 (1080, 1920, 3) 的图片，第 0 维代表什么？
options:
- 宽度（列）
- 高度（行）
- RGB 通道
- 图片数量
answer: 1
explain: 顺序是"高 × 宽 × 通道"。取像素要写 img[y, x]，先写行再写列 —— 这和数学里的 (x, y) 相反，是最容易搞混的地方。
```

```quiz
type: choice
q: 为什么不应该在循环里用 np.append？
options:
- 它会改变数组类型
- 它每次都新建更大的数组并复制全部内容，是 O(n²)
- 它只能追加一个元素
- 它会报错
answer: 1
explain: np.append 看起来像"就地添加"，实际每次都新建更大数组、把旧内容整个复制过去。循环 n 次就是 n 次完整复制。正确做法是预分配 np.empty(n)，或先收进 Python 列表最后一次性转换。
```

```quiz
type: choice
q: 关于 NumPy 和 pandas 的关系，正确的是？
options:
- pandas 会取代 NumPy，学了 pandas 就不用 NumPy 了
- pandas 建立在 NumPy 之上，Series 的 .values 就是 ndarray
- 两者完全独立
- NumPy 是 pandas 的简化版
answer: 1
explain: pandas 底层就是 NumPy —— df['列'].values 拿到的就是 ndarray。本课程学的广播、axis、布尔索引在 pandas 里全部照用，这是打地基而不是被替代。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 对 [1,2,3,4,5,6] 做 3 日移动平均（valid 模式），打印第二个值
starter: |
  import numpy as np
  
  x = np.array([1., 2., 3., 4., 5., 6.])
  k = np.ones(3) / 3
  
  # np.convolve(x, k, mode='valid') → [2, 3, 4, 5]
  # 第二个值是 3
  
  print("在这里改")
tests:
- assert "3" in __out
hint: print(np.convolve(x, k, mode='valid')[1])。valid 模式长度 n-k+1 = 4，结果是 [2,3,4,5]。
explain: 移动平均的本质是滑动窗口求平均。valid 丢掉两端不完整的窗口（那里只平均了 1~2 个数），换来每个结果都由完整 k 个数算出 —— 这才是可靠的均值。
```

```quiz
type: function
q: 写 top_n(scores, n)：返回分数最高的 n 个下标（从高到低）
func: top_n
starter: |
  import numpy as np
  
  def top_n(scores, n):
      # scores 是一维数组，n 是要取的个数
      # 返回分数最高的 n 个元素的下标，从高到低
      return None
cases: |
  [50,80,90,60], 2 -> [2, 1]
  [10,30,20], 1 -> [1]
hint: return np.argsort(np.array(scores))[::-1][:n]。argsort 升序，倒过来是降序，取前 n 个。
explain: 排行榜的标准实现。返回的是下标而不是值 —— 有了下标你就能回到原始表里取出这些人的姓名、班级等其它字段，这才是 argsort 真正的价值。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「销售数据看板」：生成 12 个月 × 5 商品的销量表，算出销售额、找出最佳月份和商品 Top3、做季度汇总并输出完整报告
checklist:
- 用广播把销量 × 单价 变成销售额
- 用 sum(axis=) 分别算出了月度总量和商品总量
- 用 argmax 找出了最佳月份
- 用 argsort(...)[::-1] 做了商品排名
- 用 reshape 做了季度分组并汇总
- 输出了格式整齐的报告（含占比或条形图）
- 代码能跑通，没有报错
starter: |
  import numpy as np
  
  np.random.seed(42)
  products = ['键盘', '鼠标', '显示器', '耳机', '摄像头']
  prices = np.array([199, 89, 1299, 399, 259])
  base = np.array([200, 500, 80, 300, 150])
  
  sales = np.random.randint(-30, 60, size=(12, 5)) + base
  sales = np.clip(sales, 0, None)          # 销量不能为负
  
  # 1. 销售额 = 销量 × 单价（广播）
  revenue = sales * prices
  
  # 2. 月度总量、商品总量
  monthly = revenue.sum(axis=1)
  by_product = revenue.sum(axis=0)
  
  # 3. 继续：找最佳月份、商品排名、季度汇总、输出报告
hint: 最佳月份用 np.argmax(monthly) + 1（下标从 0 起，月份从 1 起）。商品排名用 np.argsort(by_product)[::-1]。季度用 revenue.reshape(4, 3, 5).sum(axis=(1, 2))。报告里加占比：by_product / by_product.sum() * 100。
explain: 这是整本书的收官项目。它不引入任何新函数 —— 全部是前六章学过的广播、axis、argmax、argsort、reshape 的组合。能把这套跑通，说明你已经具备独立完成一份结构化数据分析的能力了。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题：**

```python
import numpy as np
x = np.array([1., 2., 3., 4., 5., 6.])
k = np.ones(3) / 3
print(np.convolve(x, k, mode='valid')[1])
```

**函数题：**

```python
import numpy as np

def top_n(scores, n):
    return np.argsort(np.array(scores))[::-1][:n]
```

**小项目：**

```python
import numpy as np

np.random.seed(42)
products = ['键盘', '鼠标', '显示器', '耳机', '摄像头']
prices = np.array([199, 89, 1299, 399, 259])
base = np.array([200, 500, 80, 300, 150])

sales = np.random.randint(-30, 60, size=(12, 5)) + base
sales = np.clip(sales, 0, None)
revenue = sales * prices

monthly = revenue.sum(axis=1)
by_product = revenue.sum(axis=0)
order = np.argsort(by_product)[::-1]
q_rev = revenue.reshape(4, 3, 5).sum(axis=(1, 2))

line = "=" * 48
print(line)
print(f"  全年总额 {revenue.sum():,.0f}   月均 {monthly.mean():,.0f}")
print(f"  最佳月份：第 {np.argmax(monthly) + 1} 月")
print("\n  商品贡献：")
for rank, i in enumerate(order, 1):
    share = by_product[i] / by_product.sum() * 100
    print(f"    {rank}. {products[i]:<5} {by_product[i]:>9,.0f}  ({share:>4.1f}%)")
print("\n  季度走势：")
for q, v in enumerate(q_rev, 1):
    print(f"    Q{q}  {v:>9,.0f}  {'█' * int(v / q_rev.max() * 28)}")
print(line)
```

</details>

## 《Python 数据分析 1》到这里结束

六章 30 课，你现在能：

- 用数组替代列表做数值计算，理解为什么快
- 用广播消除循环，让不同形状的数组一起运算
- 搞清楚 axis 到底在压掉哪一维
- 用布尔索引、花式索引、聚合函数做统计
- 把数据存进 npy / CSV，并处理真实数据里的缺失和脏值
- 独立完成"读取 → 清洗 → 统计 → 排名 → 报告"的完整流程
- 知道什么该用 NumPy、什么该交给 pandas

**下一步推荐**：《算法专攻 1》练解题思路，或《数据分析 2》学 pandas 处理真实表格。
