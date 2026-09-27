# 第 2 章 · 数据层 · 大测验

> 8 道题。这一章解决的是"数据怎么安全地存进去、取出来"的问题。
> **全对才算通过这一章。**

## 第一部分 · 选择题

```quiz
type: choice
q: 关于 sqlite3 中连接（connection）与游标（cursor）的关系，以下说法正确的是？
options:
- 一个连接可以有多个游标，每个游标独立维护自己的查询状态
- 一个连接只能有一个游标，用完必须关闭连接
- 游标负责建立与数据库的物理连接
- 连接对象可以直接执行 SQL，不需要游标
answer: 0
explain: 连接对象负责与数据库的物理通道，游标是执行 SQL 和遍历结果的工作对象。一个连接可以创建多个游标，各自独立。连接本身也有 execute 快捷方法（内部自动创建临时游标），但显式使用游标更清晰。
```

```quiz
type: choice
q: 在 sqlite3 中执行参数化查询的正确写法是？
options:
- cur.execute("INSERT INTO records VALUES (%s, %s)" % (amount, note))
- cur.execute("INSERT INTO records VALUES (?, ?)", (amount, note))
- cur.execute(f"INSERT INTO records VALUES ({amount}, '{note}')")
- cur.execute("INSERT INTO records VALUES (" + amount + ", " + note + ")")
answer: 1
explain: sqlite3 使用 ? 作为占位符，参数以元组形式作为第二个参数传入 execute。这是参数化查询的标准写法，数据库驱动会负责正确转义和类型处理，从根本上防止 SQL 注入。
```

```quiz
type: choice
q: 为什么必须用参数化查询，而不能用 f-string 拼 SQL？
options:
- f-string 性能更差
- 因为用户输入可能包含引号、分号等字符，拼接后会改变 SQL 语义，导致 SQL 注入攻击
- 因为 f-string 不能处理整数类型
- 因为拼接的 SQL 可读性不好
answer: 1
explain: 拼接 SQL 时，恶意输入（如备注里写 "'); DROP TABLE records;--"）会闭合原有语句并执行额外命令。参数化查询把数据与 SQL 结构分离，数据库不会把参数内容当作代码执行，这是防止注入的唯一可靠方式。
```

```quiz
type: choice
q: 关于事务（transaction），以下说法正确的是？
options:
- 每次 execute 都会立即把数据写入磁盘，无需 commit
- 多条修改应放在一个事务里，用 commit 提交、出错时用 rollback 回滚，保证原子性
- rollback 会回滚自程序启动以来的所有操作
- commit 之后数据依然在内存里，重启会丢失
answer: 1
explain: 默认连接是延迟提交模式，多条修改放在一个事务里能保证要么全成功要么全失败（原子性）。commit 提交持久化，出错时 rollback 撤销本次事务内的修改。commit 之后的数据已经写入磁盘。
```

```quiz
type: choice
q: 使用 with 语句管理 sqlite3 连接的典型好处是？
options:
- with 能自动建表
- with 语句结束时连接会自动关闭，且异常时会自动回滚未提交的事务
- with 能提高查询速度
- with 能防止 SQL 注入
answer: 1
explain: 把连接（或自定义包装类）实现上下文管理器，with 块结束时自动关闭连接、释放资源；在自定义实现里还可以在 __exit__ 中判断异常并 rollback，避免忘记提交或回滚导致的数据不一致。
```

---

## 第二部分 · 动手题

```quiz
type: local
q: 实现一个完整的 db.py 数据层：包含 init_db()（建四张表，含幂等判断）、add_record / list_records / update_record / delete_record 四个 CRUD 函数，全部使用参数化查询。用 :memory: 数据库测试：插入 3 条记录、列出全部、修改其中一条、删除一条，最后打印剩余记录验证。注意：涉及 sqlite3，请点"在 VS Code 里打开"运行。
starter: |
  import sqlite3

  SCHEMA = """
  CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  """

  CONN = sqlite3.connect(":memory:")
  CONN.row_factory = sqlite3.Row

  def init_db(conn):
      # TODO: 执行 CREATE TABLE IF NOT EXISTS
      pass

  def add_record(conn, amount, category, note=""):
      # TODO: 参数化 INSERT
      pass

  def list_records(conn):
      # TODO: SELECT * ORDER BY created_at DESC
      return []

  def update_record(conn, rid, **fields):
      # TODO: 动态构建 SET 子句，参数化
      pass

  def delete_record(conn, rid):
      # TODO: 参数化 DELETE
      pass

  if __name__ == "__main__":
      init_db(CONN)
      add_record(CONN, 12.5, "餐饮", "午饭")
      add_record(CONN, 3000, "工资", "月薪")
      add_record(CONN, 8.0, "交通", "地铁")
      print("全部记录:", [dict(r) for r in list_records(CONN)])
      update_record(CONN, 1, note="午饭（加鸡腿）")
      delete_record(CONN, 2)
      print("操作后剩余:", [dict(r) for r in list_records(CONN)])
checklist:
- init_db 使用 CREATE TABLE IF NOT EXISTS，可重复调用不报错
- 四张表全部建好（可扩展 schema）
- add_record 用参数化查询插入，返回新记录 id
- list_records 返回按时间倒序的记录列表
- update_record 能动态更新指定字段，仍用参数化
- delete_record 按 id 删除，用参数化
- 测试流程跑通：插入3条、改1条、删1条，最终剩2条且内容正确
```

```quiz
type: local
q: 写一个故意有 SQL 注入漏洞的函数和一个修复后的安全版本，用同一个内存数据库对比演示：用恶意输入 `"); DROP TABLE records;--` 作为备注，观察漏洞版是否会删表，安全版是否能正常存进去。最后 list_tables 验证表是否还在。注意：涉及 sqlite3，请点"在 VS Code 里打开"运行。
starter: |
  import sqlite3

  CONN = sqlite3.connect(":memory:")
  CONN.execute("CREATE TABLE records (id INTEGER PRIMARY KEY, note TEXT)")
  CONN.commit()

  def add_vulnerable(note):
      # TODO: 用字符串拼接，制造注入漏洞
      sql = "INSERT INTO records (note) VALUES ('" + note + "')"
      CONN.execute(sql)
      CONN.commit()

  def add_safe(note):
      # TODO: 参数化查询，正确存储
      CONN.execute("INSERT INTO records (note) VALUES (?)", (note,))
      CONN.commit()

  def list_tables():
      return [r["name"] for r in CONN.execute(
          "SELECT name FROM sqlite_master WHERE type='table'")]

  evil = '"); DROP TABLE records;--'
  print("漏洞版：")
  try:
      add_vulnerable(evil)
  except Exception as e:
      print("  报错:", e)
  print("  表列表:", list_tables())

  # 重建表
  CONN.execute("CREATE TABLE records (id INTEGER PRIMARY KEY, note TEXT)")

  print("安全版：")
  add_safe(evil)
  print("  表列表:", list_tables())
  print("  记录:", [dict(r) for r in CONN.execute("SELECT * FROM records")])
checklist:
- add_vulnerable 确实使用字符串拼接构造 SQL
- add_safe 使用 ? 占位符参数化查询
- 恶意输入 "); DROP TABLE records;-- 被正确演示
- 漏洞版演示后表被删除（或报错），证明注入成立
- 安全版演示后表仍存在、恶意字符串被完整存为普通文本
- 输出能清楚对比两种写法的后果
```

---

## 第三部分 · 小项目

```quiz
type: project
q: 实现记账本的"数据层 + 基础命令行交互"：完整 db.py（建表、CRUD、按条件筛选、按月份/分类汇总统计），并写一个 cli.py，用命令行完成"添加记录 / 列出本月记录 / 查看分类统计 / 退出"四个功能。要求全部使用参数化查询、带事务管理（with 或 try/except + rollback）、并在 cli.py 顶部写一个 init_db 的调用示例。数据存真实文件 ledger_test.db（测试完清理）。
starter: |
  # db.py 骨架
  import sqlite3
  from contextlib import contextmanager

  DB_PATH = "ledger_test.db"

  @contextmanager
  def get_conn():
      conn = sqlite3.connect(DB_PATH)
      conn.row_factory = sqlite3.Row
      try:
          yield conn
          conn.commit()
      except Exception:
          conn.rollback()
          raise
      finally:
          conn.close()

  def init_db(conn):
      # TODO: 建表
      pass

  def add_record(conn, amount, category, note=""):
      # TODO
      pass

  def list_records(conn, month=None, category=None):
      # TODO: 可选筛选
      return []

  def stats_by_category(conn, month=None):
      # TODO: GROUP BY category, sum(amount)
      return []

  # cli.py 骨架
  import db

  def main():
      with db.get_conn() as conn:
          db.init_db(conn)
      while True:
          print("\n1) 添加  2) 列出本月  3) 分类统计  4) 退出")
          c = input("> ")
          if c == "1":
              # TODO: 读取输入，调用 db.add_record
              pass
          elif c == "2":
              # TODO
              pass
          elif c == "3":
              # TODO
              pass
          elif c == "4":
              break

  if __name__ == "__main__":
      main()
checklist:
- db.py 建表完整（四张表或至少 records 表）
- 全部查询使用参数化（? 占位符），无字符串拼接
- 事务管理正确：正常 commit，异常 rollback
- cli.py 四个功能都能通过命令行交互完成
- 筛选功能支持按月份/分类条件
- 统计功能使用 SQL GROUP BY 汇总
- 数据存真实 ledger_test.db 文件，运行后可验证持久化
- 代码运行无报错，流程完整
```
