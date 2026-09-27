# Chapter 5 · Classes and objects · Chapter Test

> Eight questions. This chapter is the line between "can write code" and "can organise code".
> **All correct to pass.**

## Part 1 · Multiple choice

```quiz
type: choice
q: What's the relationship between a class and an object?
options:
- They're the same thing
- A class is the blueprint; an object is a concrete thing built from it
- An object is the template and the class is the concrete thing
- A class is a file, an object is a function
answer: 1
explain: One class can produce endless objects. Each object has its own data (attributes) but shares the same methods — like one drawing used to build many houses.
```

```quiz
type: choice
q: How does the self parameter get passed?
options:
- You pass it yourself: d.bark(d)
- Python passes the object as the first argument automatically — write it when defining, skip it when calling
- self is a keyword you can ignore
- self refers to the class, not the object
answer: 1
explain: d.bark() actually runs Dog.bark(d) — Python fills in d. So the first parameter must be self, but at the call site you never think about it.
```

```quiz
type: choice
q: If tricks = [] is a class attribute and each instance's learn() appends to it, what happens?
options:
- Each object has its own list
- All objects share one list, so what one adds appears for every object
- It raises
- tricks stays empty
answer: 1
explain: A mutable object as a class attribute is shared by every instance. self.tricks.append finds no instance attribute, so it uses the class one. Correct: self.tricks = [] inside __init__.
```

```quiz
type: choice
q: What's the difference between __str__ and __repr__?
options:
- They're identical
- __str__ is user-facing (friendly); __repr__ is developer-facing and should suggest how to rebuild the object
- __repr__ is for print, __str__ for logging
- __str__ is required, __repr__ optional
answer: 1
explain: print() and f-strings use __str__; objects shown inside a list use __repr__. Write only one? Write __repr__ — __str__ falls back to it.
```

```quiz
type: choice
q: Why do you need to_dict() before storing JSON?
options:
- JSON is faster
- JSON holds only basic types (dict, list, str, int…) — it can't store custom objects
- To encrypt it
- It's compulsory
answer: 1
explain: json.dump raises TypeError: Object of type X is not JSON serializable on a custom object. Convert with to_dict() before storing, rebuild with from_dict() when loading.
```

---

## Part 2 · Hands-on

```quiz
type: function
q: Given a Student class with name and scores (and an average property), write top_student(students) returning the student with the highest average
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
hint: return max(students, key=lambda s: s.average). The key argument says what to compare by.
explain: max(iterable, key=function) is the standard way to take "the largest by some rule" — clearer than a hand-written loop. Note average is a @property, so use s.average, not s.average().
```

```quiz
type: code
q: Define a Rectangle class: __init__ takes w and h, area() returns the area; create a 3x5 one and print it
starter: |
  class Rectangle:
      def __init__(self, w, h):
          # self.w = w; self.h = h
          pass
      
      def area(self):
          # return w * h
          pass
  
  r = Rectangle(3, 5)
  # print(r.area()) → 15
  
  print("TODO: replace this line with your output")
tests:
- assert "15" in __out
hint: In __init__: self.w = w; self.h = h. In area: return self.w * self.h. Then print(r.area()).
explain: A method reaches the same object's other attributes through self — self.w and self.h were stored in __init__. That's "data and operations bundled together" in practice.
```

---

## Part 3 · Mini project

```quiz
type: project
q: Build a "class record system": a Student class (name/sid/scores with a read-only average and to_dict/from_dict) and a Classroom class (add/find/search/average/save/load); store in JSON; guard the menu entry with if __name__ == "__main__"
checklist:
- Student has add_score (validating 0-100), a read-only average, and to_dict / from_dict
- Classroom has add (rejecting duplicate ids), find (by id) and search (by name keyword)
- Classroom's average is a read-only property returning None when there are no scores
- save / load use json and handle three cases: missing file, empty file, invalid JSON
- __str__ makes print(object) show something useful
- A menu with while True + input (add / list / search / class average / save / quit)
- The code runs clean with no errors
starter: |
  import json
  
  
  class Student:
      def __init__(self, name, sid):
          self.name = name
          self.sid = sid
          self.scores = []
      
      def add_score(self, score):
          # validate 0-100
          pass
      
      @property
      def average(self):
          # None when there are no scores
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
          # duplicate id → raise ValueError
          pass
      
      def find(self, sid):
          pass
  
  
  if __name__ == "__main__":
      # menu
      pass
hint: average is a @property returning None for an empty list; from_dict builds with cls(...); load checks three cases (FileNotFoundError / empty content / JSONDecodeError).
explain: This project combines classes with persistence — two classes, one layer each, and to_dict/from_dict bridging objects to JSON. Finish it and you'll understand why real projects design their classes first.
```

---

## Reference answers (open after you finish)

<details>
<summary>Click to see one solution</summary>

**Function:**

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

**Hands-on:**

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

**Mini project:**

```python
import json


class Student:
    def __init__(self, name, sid):
        self.name = name
        self.sid = sid
        self.scores = []

    def add_score(self, score):
        if not 0 <= score <= 100:
            raise ValueError(f"score must be 0-100, got {score}")
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
        text = f"{avg:.1f}" if avg is not None else "no scores"
        return f"{self.name} ({self.sid}) average {text}"


class Classroom:
    def __init__(self, name):
        self.name = name
        self.students = []

    def add(self, student):
        if self.find(student.sid):
            raise ValueError(f"id {student.sid} already exists")
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
            print("corrupt file — starting empty")
            return
        self.students = [Student.from_dict(d) for d in data]

    def __str__(self):
        return f"{self.name}: {len(self.students)} students"


if __name__ == "__main__":
    room = Classroom("Class 1")
    room.load('classroom.json')
    print(room)

    while True:
        print("\n1.add  2.list  3.search  4.average  5.save  6.quit")
        c = input("choose: ").strip()
        if c == '1':
            s = Student(input("name: "), input("id: "))
            try:
                room.add(s)
            except ValueError as e:
                print(f"  ✗ {e}")
                continue
            while True:
                raw = input("  score (blank to finish): ").strip()
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
            for s in room.search(input("keyword: ").strip()):
                print(" ", s)
        elif c == '4':
            print(room.average if room.average is not None else "no scores yet")
        elif c == '5':
            room.save('classroom.json')
            print("  ✓ saved")
        elif c == '6':
            room.save('classroom.json')
            break
```

</details>

## What you learned in this chapter

- **Why classes**: bundle data with operations; many functions taking the same structure is the signal
- **`class` / `__init__` / `self`**: self means "this object" and arrives automatically
- **Class vs instance attributes**: shared versus one each; **no mutable class attributes**
- **`__str__` / `__repr__`**: how an object displays itself
- **`@property`**: reads like an attribute, runs your logic; getter only means read-only
- **`to_dict` / `from_dict`**: the bridge between objects and JSON

**Next chapter: inheritance** — relating classes and reusing code.
