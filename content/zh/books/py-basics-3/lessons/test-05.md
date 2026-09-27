# 第 5 章 · 类与对象 · 大测验

> 8 道题。这一章是"会写代码"到"会组织代码"的分界。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 类和对象的关系是？
options:
- 完全一样
- 类是"图纸/模板"，对象是按图纸造出来的具体东西
- 对象是模板，类是具体东西
- 类是文件，对象是函数
answer: 1
explain: 一个类可以造出无数个对象。每个对象有自己的数据（属性），共享同一套操作（方法）。就像一张设计图能盖很多栋房。
```

```quiz
type: choice
q: self 参数是怎么传进去的？
options:
- 要自己传：d.bark(d)
- Python 自动把对象作为第一个参数传入，所以定义时写 self、调用时不传
- self 是关键字，不用管
- self 指向类，不指向对象
answer: 1
explain: d.bark() 实际执行的是 Dog.bark(d) —— Python 自动把 d 填进第一个参数。所以定义时第一个参数必须是 self，调用时完全不用管它。
```

```quiz
type: choice
q: 类里写 tricks = [] 作为类属性，每个实例的 learn() 往里 append，会怎样？
options:
- 每个对象有自己的列表
- 所有对象共享同一个列表，一个对象加的东西会出现在所有对象身上
- 报错
- tricks 永远是空的
answer: 1
explain: 可变对象（列表/字典/集合）当类属性时，所有实例共享同一个对象。self.tricks.append 找不到实例属性就用了类属性那个列表。正确做法：在 __init__ 里 self.tricks = []。
```

```quiz
type: choice
q: __str__ 和 __repr__ 的区别是？
options:
- 完全一样
- __str__ 面向用户（友好），__repr__ 面向开发者（应能看出如何重建对象）
- __repr__ 用于 print，__str__ 用于日志
- __str__ 必须写，__repr__ 可选
answer: 1
explain: print() 和 f-string 用 __str__；列表里显示、交互式环境直接回车用 __repr__。只写一个时写 __repr__ —— __str__ 未定义时会退回到它。
```

```quiz
type: choice
q: 为什么存 JSON 前需要 to_dict() 转换？
options:
- JSON 更快
- JSON 只能存基本类型（dict/list/str/int 等），存不了自定义对象
- 为了加密
- 必须这样做
answer: 1
explain: json.dump 遇到自定义对象会报 TypeError: Object of type X is not JSON serializable。用 to_dict() 转字典再存，读回时用 from_dict() 还原 —— 所有对象持久化都是这个套路。
```

---

## 第二部分 · 动手题

```quiz
type: function
q: 写一个 Student 类，有 name 和 scores；再写函数 top_student(students) 返回平均分最高的学生对象
func: top_student
starter: |
  class Student:
      def __init__(self, name, scores):
          self.name = name
          self.scores = scores
      
      @property
      def average(self):
          if not self.scores:
              return 0
          return sum(self.scores) / len(self.scores)
  
  
  def top_student(students):
      # return the student with the highest average
      return None
cases: |
  [{"name":"Ann","scores":[80,90]},{"name":"Bob","scores":[95,95]}] -> Bob
hint: return max(students, key=lambda s: s.average)。max 的 key 参数指定"按什么比较"。
explain: max(可迭代对象, key=函数) 是"按某个规则取最大"的标准写法，比手写循环清晰。注意 average 是 @property，所以用 s.average 而不是 s.average()。
```

```quiz
type: code
q: 定义 Rectangle 类：__init__ 接收 w 和 h，有 area() 方法；创建 3x5 的实例打印面积
starter: |
  class Rectangle:
      def __init__(self, w, h):
          # self.w = w; self.h = h
          pass
      
      def area(self):
          # 返回 w * h
          pass
  
  r = Rectangle(3, 5)
  # print(r.area()) 应该是 15
  
  print("在这里改")
tests:
- assert "15" in __out
hint: __init__ 里 self.w = w; self.h = h；area 里 return self.w * self.h；然后 print(r.area())。
explain: 方法通过 self 访问同一对象的属性 —— self.w 和 self.h 都是 __init__ 里存好的。这就是"数据和操作打包在一起"的具体体现。
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 做一个「班级成绩系统」：Student 类（name/sid/scores，有 average 只读属性和 to_dict/from_dict）、Classroom 类（add/find/search/average/save/load），数据存 JSON，用 if __name__ == "__main__" 做菜单入口
checklist:
- Student 有 add_score（0~100 校验）、average 只读属性、to_dict / from_dict
- Classroom 有 add（学号重复要拒绝）、find（按学号）、search（按姓名关键词）
- Classroom 的 average 是只读属性，没有成绩时返回 None
- save / load 用 json，加载时处理"文件不存在/为空/非法 JSON"三种情况
- 有 __str__ 让 print(对象) 显示有意义的信息
- 用 while True + input 做菜单（添加/查看/搜索/班级平均/保存/退出）
- 代码能跑通，没有报错
starter: |
  import json
  
  
  class Student:
      def __init__(self, name, sid):
          self.name = name
          self.sid = sid
          self.scores = []
      
      def add_score(self, score):
          # 0~100 校验
          pass
      
      @property
      def average(self):
          # 没成绩返回 None
          pass
      
      def to_dict(self):
          pass
      
      @classmethod
      def from_dict(cls, d):
          pass
  
  
  class Classroom:
      def __init__(self, name):
          self.name = name
          self.students = []
      
      def add(self, student):
          # 学号重复 → raise ValueError
          pass
      
      def find(self, sid):
          pass
  
  
  if __name__ == "__main__":
      # 菜单
      pass
hint: average 用 @property 且空列表返回 None；from_dict 用 cls(...) 造对象；load 里三层判断（FileNotFoundError / 空内容 / JSONDecodeError）。
explain: 这个项目把"类"和"持久化"结合起来 —— 两个类各管一层，to_dict/from_dict 负责对象与 JSON 的转换。做完你就理解了为什么真实项目都要先设计类。
```

---

## 参考答案（做完再看）

<details>
<summary>点开看看参考实现</summary>

**函数题：**

```python
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    @property
    def average(self):
        if not self.scores:
            return 0
        return sum(self.scores) / len(self.scores)


def top_student(students):
    return max(students, key=lambda s: s.average)
```

**动手题：**

```python
class Rectangle:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h


r = Rectangle(3, 5)
print(r.area())
```

**小项目：**

```python
import json


class Student:
    def __init__(self, name, sid):
        self.name = name
        self.sid = sid
        self.scores = []

    def add_score(self, score):
        if not 0 <= score <= 100:
            raise ValueError(f"成绩必须在 0~100，收到 {score}")
        self.scores.append(score)

    @property
    def average(self):
        if not self.scores:
            return None
        return sum(self.scores) / len(self.scores)

    def to_dict(self):
        return {'name': self.name, 'sid': self.sid, 'scores': self.scores}

    @classmethod
    def from_dict(cls, d):
        s = cls(d['name'], d['sid'])
        s.scores = d['scores']
        return s

    def __str__(self):
        avg = self.average
        text = f"{avg:.1f}" if avg is not None else "无成绩"
        return f"{self.name}（{self.sid}）平均 {text}"


class Classroom:
    def __init__(self, name):
        self.name = name
        self.students = []

    def add(self, student):
        if self.find(student.sid):
            raise ValueError(f"学号 {student.sid} 已存在")
        self.students.append(student)

    def find(self, sid):
        for s in self.students:
            if s.sid == sid:
                return s
        return None

    def search(self, keyword):
        return [s for s in self.students if keyword in s.name]

    @property
    def average(self):
        avgs = [s.average for s in self.students if s.average is not None]
        if not avgs:
            return None
        return sum(avgs) / len(avgs)

    def save(self, filename):
        data = [s.to_dict() for s in self.students]
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self, filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            return
        if not content.strip():
            return
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            print("文件损坏，以空班级启动")
            return
        self.students = [Student.from_dict(d) for d in data]

    def __str__(self):
        return f"{self.name}：{len(self.students)} 名学生"


if __name__ == "__main__":
    room = Classroom("高三(1)班")
    room.load('classroom.json')
    print(room)

    while True:
        print("\n1.添加  2.查看  3.搜索  4.班级平均  5.保存  6.退出")
        c = input("选择：").strip()
        if c == '1':
            s = Student(input("姓名："), input("学号："))
            try:
                room.add(s)
            except ValueError as e:
                print(f"  ✗ {e}")
                continue
            while True:
                raw = input("  成绩（回车结束）：").strip()
                if not raw:
                    break
                try:
                    s.add_score(float(raw))
                except ValueError as e:
                    print(f"    {e}")
        elif c == '2':
            for i, s in enumerate(room.students, 1):
                print(f"{i}. {s}")
        elif c == '3':
            key = input("关键词：").strip()
            for s in room.search(key):
                print(" ", s)
        elif c == '4':
            print(room.average if room.average is not None else "还没有成绩")
        elif c == '5':
            room.save('classroom.json')
            print("  ✓ 已保存")
        elif c == '6':
            room.save('classroom.json')
            break
```

</details>

## 这一章，你学会了什么

- **为什么用类**：把数据和操作打包；一堆函数都传同一个数据结构就是信号
- **`class` / `__init__` / `self`**：self 代表"这个对象"，调用时自动传入
- **类属性 vs 实例属性**：共享 vs 各自一份；**可变对象别当类属性**
- **`__str__` / `__repr__`**：决定对象怎么显示
- **`@property`**：用起来像属性，实际走检查逻辑；只写 getter 就是只读
- **`to_dict` / `from_dict`**：对象与 JSON 之间的桥梁

**下一章：继承**——让类之间产生关系，复用代码。
