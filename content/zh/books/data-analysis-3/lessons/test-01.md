# 第 1 章 · 认识 matplotlib · 大测验

> 8 道题。这一章是 matplotlib 的地基：为什么要有图、figure/axes、画线、字体、保存。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: Anscombe 四重奏四组数据的统计量是怎样的？
options:
- 均值相同但方差不同
- 均值、方差、相关系数、回归斜率全部相同，但图形完全不同
- 相关系数不同，所以图形不同
- 是完全随机的，没有规律
answer: 1
explain: 这正是 Anscombe 四重奏的核心：四组数据的 x̄=9.0、ȳ=7.5、var(x)=11.0、var(y)=4.13、r=0.816、斜率=0.5 全部相同，画出来却是四个完全不同的故事（正常线性、非线性、离群值主导、单点绑架）。它用来说明统计量会丢信息。
```

```quiz
type: choice
q: 关于 figure 和 axes，正确的是？
options:
- figure 是坐标轴，axes 是整张画布
- figure 是整张画布，axes 是画布上的绘图区域
- 两者是同一个东西的两个名字
- axes 是 x 轴的别名
answer: 1
explain: Figure 是整张画布（一张纸），Axes 是画布上的绘图区域（含 x/y 轴刻度）。注意 Axes 是"一个坐标系"（单数语义）而不是复数"坐标轴"，复数坐标轴是 Axis。
```

```quiz
type: choice
q: 想在数据点很多的折线图上避免"标记挤成一团黑"，应该怎么做？
options:
- 把 linewidth 调大
- 去掉 marker，或设置 markevery 降采样
- 把 color 改成白色
- 多用几个子图
answer: 1
explain: 几百上千个 marker 叠在一起必然成一片黑。正确做法是干脆不画 marker，或用 markevery=10 每隔 10 个点画一个。linewidth 只影响线的粗细，跟点的密度无关。
```

```quiz
type: choice
q: 中文标题显示成方框，最可能的原因是？
options:
- 图片分辨率太低
- matplotlib 的默认字体不含中文字形，找不到字形就画方块
- 没有调用 fig.tight_layout()
- x 和 y 的数据类型不对
answer: 1
explain: matplotlib 默认字体是 DejaVu Sans，纯英文，没有"北""京"等字形，找不到就画豆腐块。解决方法是用 rcParams['font.sans-serif'] 指定带中文字形的字体，并在所有绘图之前执行。
```

```quiz
type: choice
q: 想把图存成矢量格式（放大不糊），应该选哪个扩展名？
options:
- .png
- .jpg
- .svg 或 .pdf
- .bmp
answer: 2
explain: PNG 和 JPG 是位图（像素图），放大就糊；SVG 和 PDF 是矢量格式，放大不糊，适合论文、打印和后续用 Illustrator 修改。存图表尤其推荐 SVG/PDF。JPG 因为压缩伪影，不推荐存线条图。
```

---

## 第二部分 · 动手题

```quiz
type: code
q: 用面向对象写法（fig, ax = plt.subplots()）画一条折线，设置标题为"北京门店销售"、x 轴标签为"月份"、y 轴标签为"销售额（万元）"，并保存到 out.png
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  months = ['1月', '2月', '3月', '4月', '5月', '6月']
  sales = [120, 135, 128, 160, 175, 190]
  
  # fig, ax = plt.subplots()
  # ax.plot(...)
  # ax.set_title / set_xlabel / set_ylabel
  # fig.savefig(...)
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "北京门店销售" in __out
- assert "月份" in __out
hint: 先 fig, ax = plt.subplots()，然后 ax.plot(months, sales)、ax.set_title('北京门店销售')、ax.set_xlabel('月份')、ax.set_ylabel('销售额（万元）')。最后 fig.savefig('out.png')。
explain: 这题练的是面向对象写法的完整链路：建图 → 画线 → 设标题标签 → 保存。title/xlabel/ylabel 都是方法要加括号，保存不能漏。
```

```quiz
type: code
q: 设置中文字体为 WenQuanYi Micro Hei 并关闭 unicode_minus，然后画一张 figsize=(8,5)、dpi=150、bbox_inches='tight' 的图，标题为"2025 销售"
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  # plt.rcParams['font.sans-serif'] = ...
  # plt.rcParams['axes.unicode_minus'] = ...
  
  fig, ax = plt.subplots(figsize=(8, 5))
  ax.plot([1, 2, 3], [1, 2, 3])
  ax.set_title('2025 销售')
  
  # fig.savefig(...)
  
  print("TODO：把这行改成你要打印的结果")
tests:
- assert "2025 销售" in __out
hint: 字体：plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']，unicode_minus：plt.rcParams['axes.unicode_minus'] = False。保存：fig.savefig('out.png', dpi=150, bbox_inches='tight')。
explain: 这题把第 4、5 两节合起来：字体配置 + 保存三要素（尺寸、dpi、裁边）。rcParams 的值是列表，传字符串无效。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「北京门店销售可视化」：建表 → 画折线（带 marker、虚线、红色）→ 设置中文字体 → 设标题和轴标签 → 标出峰值点（annotate）→ figsize=(8,5)、dpi=150、bbox_inches='tight' 保存
checklist:
- 设置了中文字体（font.sans-serif + unicode_minus）
- 用面向对象写法（fig, ax = plt.subplots()）
- 折线用了 marker 和 linestyle 参数
- 设置了标题和 x/y 轴标签（带单位）
- 用 annotate 在最高点标了"峰值"
- figsize=(8,5)、dpi=150、bbox_inches='tight' 保存
- 代码能跑通，没有报错
starter: |
  import matplotlib
  matplotlib.use('Agg')
  import matplotlib.pyplot as plt
  
  # 1. 设置中文字体
  # plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
  # plt.rcParams['axes.unicode_minus'] = False
  
  months = ['1月', '2月', '3月', '4月', '5月', '6月']
  sales = [120, 135, 128, 160, 175, 190]
  
  # 2. fig, ax = plt.subplots(figsize=(8, 5))
  # 3. ax.plot(...) 带 marker 和 linestyle
  # 4. ax.set_title / set_xlabel / set_ylabel
  # 5. ax.annotate 标峰值
  # 6. fig.savefig(..., dpi=150, bbox_inches='tight')
hint: 峰值在 6 月 190 万。annotate 用 ax.annotate('峰值', xy=('6月', 190), xytext=('3月', 205), arrowprops=dict(arrowstyle='->'))。保存参数：fig.savefig('out.png', dpi=150, bbox_inches='tight')。
explain: 这个项目串起第 1 章的全部要点：字体配置、面向对象写法、线型参数、自解释四要素、关键点标注、保存参数。走通一遍，你就掌握了"从建表到出图"的完整链路。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**动手题 1：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [120, 135, 128, 160, 175, 190]

fig, ax = plt.subplots()
ax.plot(months, sales)
ax.set_title('北京门店销售')
ax.set_xlabel('月份')
ax.set_ylabel('销售额（万元）')
fig.savefig('out.png')
```

**动手题 2：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
plt.rcParams['axes.unicode_minus'] = False

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1, 2, 3], [1, 2, 3])
ax.set_title('2025 销售')
fig.savefig('out.png', dpi=150, bbox_inches='tight')
```

**小项目：**

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei']
plt.rcParams['axes.unicode_minus'] = False

months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [120, 135, 128, 160, 175, 190]

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(months, sales, marker='o', linestyle='--', color='#e41a1c', linewidth=2)

ax.set_title('北京门店 2025 上半年销售额')
ax.set_xlabel('月份')
ax.set_ylabel('销售额（万元）')

ax.annotate('峰值', xy=('6月', 190), xytext=('3月', 205),
            arrowprops=dict(arrowstyle='->', color='#e41a1c'))

fig.savefig('out.png', dpi=150, bbox_inches='tight')
plt.close(fig)
print('done')
```

</details>

## 这一章，你学会了什么

- **为什么要有图**：Anscombe 四重奏说明统计量会丢信息，先画图再看数字
- **figure 与 axes**：画布与绘图区域的区别，以及面向对象写法为什么比 plt 接口更稳
- **画线**：marker、linestyle、color、linewidth 四个核心参数
- **中文字体**：`font.sans-serif` + `axes.unicode_minus`，字体名要确切、要传列表
- **保存**：figsize × dpi 决定清晰度，bbox_inches='tight' 防裁边，矢量用 svg/pdf

下一章讲**常用图表怎么选**——柱状、折线、散点、直方图、饼图各自的场景与坑。
