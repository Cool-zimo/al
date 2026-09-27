# Chapter 1 Test: JSON Fundamentals

## Part 1 · Multiple Choice

```quiz
type: choice
q: Why do programs need to agree on a "data format" (like JSON) to exchange data?
options:
- Because Python can only handle strings
- Because in-memory objects (lists, dicts) cannot be passed across languages or networks directly, and must be turned into text that both sides can parse
- Because files can only be opened in text mode
- Because JSON is faster than Python
answer: 1
explain: In-memory object structures (nested dicts, lists) are language-private. When crossing language/network boundaries, they must be serialized into an agreed-upon text format, and JSON is one such agreement.
```

```quiz
type: choice
q: To convert a Python dictionary into a JSON string, which pair of functions should you use?
options:
- json.encode / json.decode
- json.dumps / json.loads
- json.dump / json.load
- json.stringify / json.parse
answer: 1
explain: dumps (dump string) serializes an object into a string, and loads (load string) deserializes a string back into an object; dump/load operate on file objects.
```

```quiz
type: choice
q: If you serialize the Python tuple (1, 2, 3) with json.dumps and then deserialize it back with json.loads, what type does it become?
options:
- Still a tuple
- A list
- A set
- It raises an error
answer: 1
explain: JSON only has arrays, not tuples. A tuple is serialized into a JSON array and comes back as a list, losing its immutability information.
```

```quiz
type: choice
q: Which of the following can be used as a dictionary key for json.dumps?
options:
- The integer 42
- The tuple (1, 2)
- The string "name"
- The list [1, 2]
answer: 2
explain: JSON object keys must be strings. If a Python dict uses non-string keys, dumps will raise a TypeError; only string keys can be serialized as-is.
```

```quiz
type: choice
q: When writing to a JSON file, what do ensure_ascii=False and indent=2 do, respectively?
options:
- ensure_ascii controls space compression; indent controls Chinese escaping
- ensure_ascii=False makes Chinese display normally without being converted to \uXXXX; indent=2 makes the output indented by 2 spaces for readability
- Both are used to speed things up
- ensure_ascii=False makes the file smaller
answer: 1
explain: ensure_ascii defaults to True, which converts Chinese to \uXXXX escapes; setting it to False preserves the original characters. indent controls the indentation level, making JSON readable.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write a function dict_to_json(d) that accepts a dictionary and returns its JSON string representation, with ensure_ascii=False and indent=2.
func: dict_to_json
starter: |
  import json

  def dict_to_json(d):
      return ""
cases: |
  '{"name": "Alice", "city": "London"}' -> '{\n  "name": "Alice",\n  "city": "London"\n}'
  '{"a": 1}' -> '{\n  "a": 1\n}'
hint: json.dumps(d, ensure_ascii=False, indent=2).
explain: ensure_ascii=False ensures Chinese is readable, and indent=2 ensures formatted output — the standard pattern for writing config files.
```

```quiz
type: function
q: Write a function json_get(data_str, key) that accepts a JSON string and a key name, returning the corresponding value. If JSON parsing fails or the key does not exist, return None.
func: json_get
starter: |
  import json

  def json_get(data_str, key):
      try:
          d = json.loads(data_str)
          return d.get(key)
      except (json.JSONDecodeError, AttributeError):
          return None
cases: |
  '{"name": "Alice"}' -> 'name' -> 'Alice'
  '{"age": 28}' -> 'city' -> None
  'not json' -> 'name' -> None
hint: Wrap loads and get in a try block, and return None in the except clause.
explain: Both parsing and retrieval can fail;统一 catching exceptions and returning None is a common defensive programming pattern.
```

## Part 3 · Mini Project

```quiz
type: code
q: Implement a "grade report" module. Write a function make_report(scores) that accepts a list of dictionaries, each containing "name" (student name) and "score" (integer). The function returns a JSON string with the following content: {"count": number of students, "average": average score (rounded to 1 decimal place), "highest": the record with the highest score, "lowest": the record with the lowest score}. Both highest and lowest are complete dictionaries (including name and score). ensure_ascii=False is required.
Example input: [{"name": "Alice", "score": 88}, {"name": "Bob", "score": 92}, {"name": "Carol", "score": 76}]
Example output: {"count": 3, "average": 85.3, "highest": {"name": "Bob", "score": 92}, "lowest": {"name": "Carol", "score": 76}}
starter: |
  import json

  def make_report(scores):
      count = len(scores)
      if count == 0:
          return json.dumps({})
      total = sum(s["score"] for s in scores)
      average = round(total / count, 1)
      highest = max(scores, key=lambda s: s["score"])
      lowest = min(scores, key=lambda s: s["score"])
      report = {
          "count": count,
          "average": average,
          "highest": highest,
          "lowest": lowest,
      }
      return json.dumps(report, ensure_ascii=False)

  # Test
  data = [
      {"name": "Alice", "score": 88},
      {"name": "Bob", "score": 92},
      {"name": "Carol", "score": 76},
  ]
  print(make_report(data))
tests:
- assert '85.3' in __out
- assert 'Bob' in __out
- assert 'Carol' in __out
hint: Use sum + len for the average, and max/min with key=lambda to find the highest and lowest.
explain: This comprehensively tests dictionary construction, aggregate calculations, and json.dumps parameters — a foundational project for JSON data processing.
```
