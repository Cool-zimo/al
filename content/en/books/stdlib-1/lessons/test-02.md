# Chapter 2 Test: JSON Advanced Topics

## Part 1 · Multiple Choice

```quiz
type: choice
q: When retrieving data["users"][0]["address"]["city"] from nested JSON, if any level in the middle might be None or missing, what is the safest approach?
options:
- Use [] to force retrieval level by level, and let the user retry if it errors out
- Use chained get calls or wrap in try/except to avoid KeyError
- Convert the whole object to a string first and then regex-match
- Use a list instead of a dict
answer: 1
explain: Chained [] retrieval will throw a KeyError if any level is missing. Using d.get("users", []) or try/except safely handles missing keys, which is the standard defense for nested retrieval.
```

```quiz
type: choice
q: What is the purpose of the default parameter in json.dumps?
options:
- To specify the default value during deserialization
- To call a function that converts an unserializable object into a serializable value when encountered
- To set the default key for a dictionary
- To fill in default values when fields are missing from the JSON
answer: 1
explain: default is a function that receives an unserializable object and returns a serializable替代值 (e.g., converting a date to an ISO string). It does not fill in defaults for "missing fields."
```

```quiz
type: choice
q: Regarding what JSON cannot express, which of the following is correct?
options:
- JSON can express all data types in Python
- JSON cannot express datetime, bytes, sets, or circular references
- JSON can express circular references, just with complex syntax
- JSON can express binary data and will automatically base64-encode it
answer: 1
explain: JSON has only six types (object, array, string, number, boolean, null). datetime, bytes, sets, and circular references have no corresponding types and must be handled manually.
```

```quiz
type: choice
q: Which of the following JSON snippets is valid?
options:
- '"name": "Alice", "age": 28'
- '{"name": "Alice", "age": 28}'
- "{'name': 'Alice', 'age': 28}"
- '{name: "Alice", age: 28}'
answer: 1
explain: JSON must be a complete object (or array); both keys and strings must use double quotes; single quotes cannot be used, and keys cannot be unquoted.
```

```quiz
type: choice
q: When reading/writing config files, if the user only provides some fields (e.g., page_size is missing), what is the most reasonable way to fill in the rest?
options:
- Crash the program and提示 that the fields are incomplete
- Use a default-value dictionary as a base, then let the user's config override it with update
- Fill missing fields with None
- Delete the config file and recreate it
answer: 1
explain: dict(DEFAULTS) first builds the full set of defaults, then uses the user's config to update, so missing keys保持 default and existing keys get overridden — the standard pattern for config merging.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write a function safe_parse(json_str) that attempts to parse a JSON string. If parsing succeeds, return the parsed object. If parsing fails (JSONDecodeError), return the string "PARSE_ERROR". If the input is not a string, return "BAD_INPUT".
func: safe_parse
starter: |
  import json

  def safe_parse(json_str):
      if not isinstance(json_str, str):
          return "BAD_INPUT"
      try:
          return json.loads(json_str)
      except json.JSONDecodeError:
          return "PARSE_ERROR"
cases: |
  '{"a": 1}' -> {'a': 1}
  '{bad json}' -> 'PARSE_ERROR'
  42 -> 'BAD_INPUT'
hint: First check the type, then use try/except for JSONDecodeError.
explain: Layered defense — first validate the input type, then catch parsing exceptions, returning a clear marker value so the caller can branch accordingly.
```

```quiz
type: function
q: Write a function nested_sum(data) that accepts any structure resulting from JSON deserialization (could be a number, a list, or nested lists) and returns the sum of all numbers. If it is not a number and not a list, return 0.
func: nested_sum
starter: |
  def nested_sum(data):
      if isinstance(data, (int, float)):
          return data
      if isinstance(data, list):
          return sum(nested_sum(x) for x in data)
      return 0
cases: |
  '[1, 2, [3, 4], 5]' -> 15
  42 -> 42
  '[]' -> 0
hint: Recursion: numbers are the base case; for lists, recurse and sum each item.
explain: Recursion to handle arbitrary nesting depth is a core technique for processing JSON tree structures, combined with isinstance for type dispatch.
```

## Part 3 · Mini Project

```quiz
type: code
q: Implement a "user config" module with two functions. load_config(path) simulates reading: it accepts a config dictionary (simulating JSON that has already been read) and merges it with the default config {"theme": "light", "page_size": 20, "notifications": true} — defaults as the base, user overrides. save_config(config) simulates saving: it accepts a dictionary, returns its JSON string (ensure_ascii=False, indent=2), and validates that all values must be of type str/int/float/bool; if an illegal type is found, return the string "INVALID_VALUE".
starter: |
  import json

  DEFAULTS = {
      "theme": "light",
      "page_size": 20,
      "notifications": True,
  }

  def load_config(user_cfg):
      cfg = dict(DEFAULTS)
      if isinstance(user_cfg, dict):
          cfg.update(user_cfg)
      return cfg

  def save_config(config):
      for v in config.values():
          if not isinstance(v, (str, int, float, bool)):
              return "INVALID_VALUE"
      return json.dumps(config, ensure_ascii=False, indent=2)

  # Test
  cfg = load_config({"theme": "dark"})
  print(cfg)
  print(save_config(cfg))
tests:
- assert 'dark' in __out
- assert '20' in __out
- assert 'notifications' in __out
hint: load_config uses {**DEFAULTS, **user_cfg} or copies first then updates; save_config iterates over values for isinstance validation.
explain: This combines config merging (defaults as base + override), JSON serialization parameters, and pre-write validity checks — a complete small-scale config read/write module.
```
