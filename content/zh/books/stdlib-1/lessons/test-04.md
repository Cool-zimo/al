# 第 4 章测验：配置与持久化

> 这一章覆盖了 `configparser`、`pickle`、`base64`、`hashlib`——配置怎么读、对象怎么存、数据怎么校验。做完下面 8 题，才算真正掌握。

## 第一部分 · 选择题

### 1. configparser 读出来的值是什么类型？

```quiz
type: choice
exam: true
q: 用 configparser 读配置文件，get(section, option) 返回的值是什么类型？
options:
- int
- float
- str
- bool
answer: 2
explain: configparser 读出来的所有值都是字符串，需要自己转换类型，如 int(val) 或 float(val)。
```

### 2. configparser 的 option 名大小写

```quiz
type: choice
exam: true
q: 关于 configparser 中 option 名的大小写，正确的是？
options:
- 严格区分大小写，Host 和 host 是两个不同 option
- 不区分大小写，Host 和 host 视为同一个
- 自动全部转大写
- 自动全部转小写
answer: 1
explain: configparser 默认把 option 名转成小写存储，Host 和 host 视为同一个 option，section 名则区分大小写。
```

### 3. pickle 能存什么

```quiz
type: choice
exam: true
q: 关于 pickle 能序列化的对象，正确的是？
options:
- 只能存基本类型，如 int、str、list
- 可以存几乎所有 Python 对象，包括自定义类的实例、函数、嵌套结构
- 只能存 JSON 兼容的数据
- 只能存数字
answer: 1
explain: pickle 是 Python 专用的序列化协议，几乎能存所有 Python 对象，包括自定义类实例、函数、嵌套结构，不像 JSON 有类型限制。
```

### 4. pickle 的安全红线

```quiz
type: choice
exam: true
q: 关于 pickle 的安全性，正确的是？
options:
- pickle 数据经过签名，可以安全 unpickle 任意来源的数据
- 绝不能 unpickle 不信任来源的数据，恶意数据可执行任意代码
- pickle 只能存不能取，不存在安全风险
- 只要文件后缀是 .pkl 就安全
answer: 1
explain: pickle 在 unpickle 时会执行对象里的 __reduce__ 等逻辑，恶意构造的数据可执行任意代码，绝对不能 unpickle 不信任的数据。
```

### 5. base64 的用途

```quiz
type: choice
exam: true
q: base64 编码的主要用途是？
options:
- 加密数据，让数据更安全
- 把二进制数据转成纯文本（ASCII）形式，便于在文本协议中传输
- 压缩数据，减小体积
- 校验数据完整性
answer: 1
explain: base64 是编码不是加密，作用是将任意二进制数据转成可打印的 ASCII 字符，便于在邮件、URL、JSON 等文本场景传输，任何人都能解码。
```

## 第二部分 · 动手题

### 6. hashlib 文件校验

```quiz
type: function
exam: true
q: 写一个函数 calc_md5(data)，接收字符串 data，返回它的 MD5 十六进制摘要字符串。用 hashlib.md5。
func: calc_md5
starter: |
  import hashlib

  def calc_md5(data):
      return ""
cases:
- "'hello'" -> "'5d41402abc4b2a76b9719d911017c592'"
hint: hashlib.md5(data.encode('utf-8')).hexdigest()。
explain: 先 encode 成 bytes，再用 hashlib.md5 算摘要并 hexdigest 转十六进制字符串。
```

### 7. 安全的密码比对

```quiz
type: function
exam: true
q: 写一个函数 check_password(stored_hash, password)，stored_hash 是存储的 sha256 摘要（hex 字符串），password 是用户输入的明文。用 hashlib 算 password 的 sha256 摘要并和 stored_hash 比对，一致返回 True，否则返回 False。禁止明文存密码。
func: check_password
starter: |
  import hashlib

  def check_password(stored_hash, password):
      return False
cases:
- "'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'" -> "'password'" -> 'True'
hint: hashlib.sha256(password.encode()).hexdigest() 后比较。
explain: 密码绝不明文存储，而是存哈希；验证时把输入再哈希一次做比对。
```

## 第三部分 · 小项目

### 8. 配置文件校验器

```quiz
type: function
exam: true
q: 写函数 check_config(text)，接收 ini 格式的字符串 text，用 configparser 解析。要求：必须存在 [database] 段，且该段有 host 和 port 两个 option；port 必须能转成 int 且 > 0。满足返回 "ok"，否则返回对应的错误字符串：缺段返回 "缺少 database 段"、缺 option 返回 "缺少 host 或 port"、port 非法返回 "port 非法"。
func: check_config
starter: |
  from configparser import ConfigParser

  def check_config(text):
      cp = ConfigParser()
      cp.read_string(text)
      return "ok"
cases:
- "'[database]\nhost=localhost\nport=3306\n'" -> "'ok'"
hint: has_section、has_option、int(port)。
explain: 依次检查段存在、option 存在、port 能转 int 且为正。
```
