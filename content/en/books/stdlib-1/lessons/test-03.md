# Chapter 3 Test: CSV

## Part 1 · Multiple Choice

```quiz
type: choice
q: Why can you not use line.split(",") to parse all CSV files?
options:
- Because split is slower than csv.reader
- Because CSV fields may contain commas or newlines wrapped in double quotes, which split cannot recognize
- Because split can only split on spaces
- Because CSV must be read in binary mode
answer: 1
explain: A comma inside quotes (e.g., "London,Camden") should count as one field, but split will cut it into two pieces; newlines inside fields will also break line-by-line splitting. The csv module implements the complete RFC 4180 rules.
```

```quiz
type: choice
q: When writing with csv.writer, why must newline="" be passed to open?
options:
- To support Chinese characters
- To disable Python's newline translation and avoid extra blank lines on Windows
- To make the file smaller
- To improve write speed
answer: 1
explain: Windows text mode translates \n into \r\n, while the csv module already writes \r\n itself. The two layers stack and produce an extra blank line between rows. newline="" disables Python's translation and hands it to csv.
```

```quiz
type: choice
q: What type is each row read by csv.DictReader?
options:
- A list
- A dict with header column names as keys
- A string
- A tuple
answer: 1
explain: DictReader uses the header as keys, turning each row into a {column_name: value} dict, accessed via row["column_name"] rather than by index.
```

```quiz
type: choice
q: When writing dictionaries with csv.DictWriter, what happens if you forget to call writeheader()?
options:
- The program crashes
- The output CSV is missing the header row; the first line is data directly
- All fields become empty strings
- Chinese characters become garbled
answer: 1
explain: writeheader() is responsible for outputting the header row. If you forget to call it, it starts writing from the first data entry, leaving the reader with no idea what each column means.
```

```quiz
type: choice
q: When opening a Chinese CSV in Excel and it appears garbled, what is the most appropriate write encoding?
options:
- encoding="ascii"
- encoding="utf-8-sig" (with BOM)
- encoding="latin-1"
- Not specifying the encoding parameter
answer: 1
explain: Excel decodes using GBK by default, so pure UTF-8 will be garbled. utf-8-sig includes a BOM, which Excel uses to recognize UTF-8 and decode correctly.
```

## Part 2 · Hands-On

```quiz
type: function
q: Write a function read_csv_rows(csv_text) that accepts CSV text (with a header) and returns a 2D list (the first row is the header, the rest is data). Use csv.reader + io.StringIO.
func: read_csv_rows
starter: |
  import csv
  import io

  def read_csv_rows(csv_text):
      reader = csv.reader(io.StringIO(csv_text))
      return list(reader)
cases: |
  'name,age\nAlice,28\n' -> [['name', 'age'], ['Alice', '28']]
  'a,b,c\n1,2,3\n' -> [['a', 'b', 'c'], ['1', '2', '3']]
hint: list(reader) directly gives you all the rows.
explain: csv.reader parses text into a 2D list, which is the foundation for list-based CSV processing.
```

```quiz
type: function
q: Write a function add_column_total(rows) that accepts a 2D list read by csv.reader (first row is the header, the rest is data, and the second field in each row is a numeric string). It returns a new 2D list: append to the end of each data row the sum of "the length of the first field + the numeric field" (converted to a string). Append "total" to the end of the header row.
func: add_column_total
starter: |
  def add_column_total(rows):
      result = [rows[0] + ["total"]]
      for r in rows[1:]:
          name_len = len(r[0])
          num = int(r[1])
          r.append(str(name_len + num))
          result.append(r)
      return result
cases: |
  '[["name", "score"], ["Alice", "10"], ["Bob", "20"]]' -> [['name', 'score', 'total'], ['Alice', '10', '15'], ['Bob', '20', '23']]
hint: Append "total" to the header, and append str(len(r[0]) + int(r[1])) to each data row.
explain: List-based CSV processing: handle the header separately, and append a new column by indexing into the data rows.
```

## Part 3 · Mini Project

```quiz
type: code
q: Implement a CSV analysis tool function analyze_csv(csv_text) that accepts CSV text (with a header, first column name, second column score as a numeric string) and returns a dictionary: {"names": [list of all names], "average": the average score (rounded to 1 decimal place), "passed": the number who passed (score>=60), "max_name": the name of the highest scorer}. Use csv.DictReader to read.
starter: |
  import csv
  import io

  def analyze_csv(csv_text):
      reader = csv.DictReader(io.StringIO(csv_text))
      records = list(reader)
      names = [r["name"] for r in records]
      scores = [int(r["score"]) for r in records]
      if not scores:
          return {}
      average = round(sum(scores) / len(scores), 1)
      passed = sum(1 for s in scores if s >= 60)
      max_idx = scores.index(max(scores))
      return {
          "names": names,
          "average": average,
          "passed": passed,
          "max_name": names[max_idx],
      }

  # Test
  text = 'name,score\nAlice,85\nBob,55\nCarol,92\n'
  print(analyze_csv(text))
tests:
- assert '77.3' in __out
- assert '2' in __out
- assert 'Carol' in __out
hint: Use list comprehensions to extract names and scores, sum/len for the average, count for passing, and index+max to find the top scorer's name.
explain: This combines DictReader reading, list comprehensions, and aggregate statistics — a complete exercise in the CSV data processing workflow.
```
