# Chapter 4 Quiz: Configuration and Persistence

> This chapter covered `configparser`, `pickle`, `base64`, and `hashlib` — how to read configuration, how to persist objects, and how to verify data. Complete the 8 questions below to truly master the material.

## Part 1 · Multiple Choice

### 1. What type does configparser return?

```quiz
type: choice
q: When reading a config file with configparser, what type does get(section, option) return?
options:
- int
- float
- str
- bool
answer: 2
explain: Every value read by configparser is a string; you must convert types yourself, e.g. int(val) or float(val).
```

### 2. Case sensitivity of configparser option names

```quiz
type: choice
q: Which is correct about the case sensitivity of option names in configparser?
options:
- Strictly case-sensitive — Host and host are two different options
- Not case-sensitive — Host and host are treated as the same
- Automatically converted to upper case
- Automatically converted to lower case
answer: 1
explain: configparser normalises option names to lower case by default, so Host and host are the same option, while section names are case-sensitive.
```

### 3. What can pickle store?

```quiz
type: choice
q: Which is correct about the objects pickle can serialise?
options:
- Only basic types such as int, str, and list
- Almost any Python object, including instances of custom classes, functions, and nested structures
- Only JSON-compatible data
- Only numbers
answer: 1
explain: pickle is Python's dedicated serialisation protocol and can store nearly all Python objects, including custom class instances, functions, and nested structures — unlike JSON, which has type restrictions.
```

### 4. The pickle security red line

```quiz
type: choice
q: Which is correct about pickle security?
options:
- pickle data is signed, so it's safe to unpickle data from any source
- Never unpickle data from an untrusted source — malicious data can execute arbitrary code
- pickle can only write, not read, so there's no security risk
- As long as the file extension is .pkl, it's safe
answer: 1
explain: When unpickling, pickle executes logic such as __reduce__ embedded in the object; maliciously constructed data can run arbitrary code, so untrusted data must never be unpickled.
```

### 5. The purpose of base64

```quiz
type: choice
q: What is the primary purpose of base64 encoding?
options:
- Encrypting data to make it more secure
- Converting binary data into a plain-text (ASCII) form for transmission in text protocols
- Compressing data to reduce its size
- Verifying data integrity
answer: 1
explain: base64 is encoding, not encryption; it converts arbitrary binary data into printable ASCII characters for transport in email, URLs, JSON, and similar text contexts — and anyone can decode it.
```

## Part 2 · Hands-On

### 6. hashlib file verification

```quiz
type: function
q: Write a function calc_md5(data) that takes a string data and returns its MD5 hex digest string. Use hashlib.md5.
func: calc_md5
starter: |
  import hashlib

  def calc_md5(data):
      return ""
cases:
- "'hello'" -> "'5d41402abc4b2a76b9719d911017c592'"
hint: hashlib.md5(data.encode('utf-8')).hexdigest().
explain: First encode to bytes, then compute the digest with hashlib.md5 and convert to a hex string with hexdigest.
```

### 7. Secure password comparison

```quiz
type: function
q: Write a function check_password(stored_hash, password) where stored_hash is the stored sha256 digest (a hex string) and password is the plain-text input from the user. Compute the sha256 digest of password with hashlib and compare it with stored_hash; return True if they match, otherwise False. Never store passwords in plain text.
func: check_password
starter: |
  import hashlib

  def check_password(stored_hash, password):
      return False
cases:
- "'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'" -> "'password'" -> 'True'
hint: hashlib.sha256(password.encode()).hexdigest() then compare.
explain: Passwords must never be stored in plain text — only their hashes are stored; during verification, hash the input again and compare.
```

## Part 3 · Mini Project

### 8. Configuration file validator

```quiz
type: function
q: Write a function check_config(text) that takes an ini-formatted string text and parses it with configparser. Requirements: the [database] section must exist, and it must contain the host and port options; port must be convertible to int and be > 0. Return "ok" if all requirements are met; otherwise return the corresponding error string: "database section missing" if the section is absent, "host or port option missing" if an option is absent, and "port invalid" if port is invalid.
func: check_config
starter: |
  from configparser import ConfigParser

  def check_config(text):
      cp = ConfigParser()
      cp.read_string(text)
      return "ok"
cases:
- "'[database]\nhost=localhost\nport=3306\n'" -> "'ok'"
hint: has_section, has_option, int(port).
explain: Check section existence, option existence, and whether port can be parsed as a positive int — in that order.
```
