# Chapter 5 Test — String Fundamentals

> This test covers everything in Chapter 5: immutability and concatenation, counting and hashing, two pointers, palindromes, and the longest palindromic substring. You need 6 out of 8 to pass.

## Multiple Choice (5 questions)

The five questions in this section test your understanding of the core concepts. Pick the single best answer for each.

```quiz
type: choice
exam: true
q: Why is concatenating strings with `+=` inside a loop O(n²)?
options:
- Because string concatenation always takes quadratic time, even outside a loop
- Because strings are immutable, so each `+=` allocates and copies all the characters already accumulated
- Because Python has to sort the characters before concatenating them
- Because the `+=` operator itself is implemented as a nested loop
answer: 1
explain: Strings cannot be modified in place. Every s += x builds a brand-new string and copies the existing content into it. The i-th iteration copies i characters, so the total is 1+2+...+n ~ n²/2 = O(n²).
```

```quiz
type: choice
exam: true
q: Which function correctly counts how many times each character appears in a string?
options:
- `count = {}; for ch in s: count[ch] += 1`
- `count = {}; for ch in s: count[ch] = count.get(ch, 0) + 1`
- `count = []; for ch in s: count.append(ch)`
- `count = set(s)`
answer: 1
explain: The first option raises KeyError when ch is not yet in the dictionary. Using dict.get(ch, 0) returns 0 for a missing key, then adds 1 — the standard counting idiom. A list would only work for a known contiguous alphabet, and a set only tells you which characters appeared, not how many times.
```

```quiz
type: choice
exam: true
q: What is the best time and space complexity for deciding whether a string is a palindrome using two pointers?
options:
- O(n) time, O(n) space
- O(n²) time, O(1) space
- O(n) time, O(1) space
- O(1) time, O(n) space
answer: 2
explain: Two pointers meet in the middle after at most n/2 comparisons, so O(n) time. Only the two index variables are needed, so O(1) extra space. Reverse-and-compare also takes O(n) time but uses O(n) space because it builds a new string.
```

```quiz
type: choice
exam: true
q: Which of these is a valid English palindrome after ignoring case and keeping only letters and digits?
options:
- "race a car"
- "hello world"
- "A man a plan a canal Panama"
- "python"
answer: 2
explain: "A man a plan a canal Panama" cleans to "amanaplanacanalpanama", which reads the same forwards and backwards. "race a car" cleans to "raceacar" (r != a). The other two are not palindromes in any form.
```

```quiz
type: choice
exam: true
q: What is the time and space complexity of the center-expansion algorithm for the longest palindromic substring?
options:
- O(n³) time, O(1) space
- O(n²) time, O(n²) space
- O(n²) time, O(1) space
- O(n) time, O(1) space
answer: 2
explain: There are n centers to expand from, and each expansion can take up to n/2 steps, giving O(n²) time. Only a handful of index variables are used, so O(1) space. The dynamic-programming approach is also O(n²) time but needs O(n²) space.
```

## Hands-On Coding (2 questions)

Write real functions. Each submission is run against multiple test cases and compared to the expected output.

```quiz
type: function
exam: true
q: Write reverse_string(s) — reverse a string using two pointers. The function must not use slicing or the built-in reversed().
func: reverse_string
starter: |
  def reverse_string(s):
      # convert s to a list
      # use two pointers, left at 0 and right at the end
      # swap while left < right
      # join and return
      return ""
cases: |
  "racecar" -> "racecar"
  "algorithm" -> "mhtirogla"
  "a" -> "a"
  "" -> ""
hint: chars = list(s); left, right = 0, len(chars)-1; while left < right: chars[left], chars[right] = chars[right], chars[left]; left += 1; right -= 1; return "".join(chars).
explain: Converting to a list lets you swap in place. The empty string returns "" (range is empty, join of nothing is ""), and a single character is already reversed. This is O(n) time and O(n) space for the list.
```

```quiz
type: function
exam: true
q: Write is_anagram(s1, s2) — return True if s1 and s2 are anagrams (same characters, same counts, any order), False otherwise.
func: is_anagram
starter: |
  def is_anagram(s1, s2):
      # if the lengths differ, return False immediately
      # count the characters in s1
      # subtract the counts while walking s2
      # return True only if every count returned to 0
      return False
cases: |
  "listen", "silent" -> True
  "racecar", "carrace" -> True
  "hello", "world" -> False
  "a", "ab" -> False
  "" -> True
hint: if len(s1) != len(s2): return False. Then count = {}; for ch in s1: count[ch] = count.get(ch, 0) + 1. Then for ch in s2: if ch not in count or count[ch] == 0: return False; count[ch] -= 1. Finally return True.
explain: Checking the lengths first prunes every unequal pair immediately. Subtracting and testing for 0 catches the case where s2 has a character s1 does not (the count goes to 0 and the next copy makes it negative). This is O(n) time and O(n) space.
```

## Project (1 question)

Build a small but complete tool that ties together everything from this chapter.

```quiz
type: function
exam: true
q: Write a function `palindrome_report(s)` that returns a dictionary with three keys- `"is_palindrome"`: True if the string (cleaned: only alphanumerics, lowercased) is a palindrome- `"char_counts"`: a dictionary of character frequencies in the *original* string- `"longest_palindrome"`: the longest palindromic substring of the *original* string (use center expansion)For example, `palindrome_report("Racecar")` should return a dict whose `"is_palindrome"` is True, whose `"char_counts"` contains `'R'` or `'r'` keys as they appear in the original, and whose `"longest_palindrome"` is `"racecar"`. The function must use a list plus join for any string building (no `+=` loop) and must handle the empty string by returning a dict with `"is_palindrome"` True, `"char_counts"` as an empty dict, and `"longest_palindrome"` as "".
func: palindrome_report
starter: |
  def palindrome_report(s):
      # 1. check palindrome on the cleaned string (isalnum + lower)
      # 2. count characters in the original string with a dictionary
      # 3. find the longest palindromic substring with center expansion
      #    (build any intermediate result with a list, not +=)
      # 4. return a dict with the three keys
      return {}
cases: |
  "Racecar" -> {"is_palindrome": True, "char_counts": {"R": 1, "a": 2, "c": 2, "e": 1, "r": 1}, "longest_palindrome": "Racecar"}
  "babad" -> {"is_palindrome": False, "char_counts": {"b": 2, "a": 3, "d": 1}, "longest_palindrome": "bab"}
  "" -> {"is_palindrome": True, "char_counts": {}, "longest_palindrome": ""}
  "aabb" -> {"is_palindrome": False, "char_counts": {"a": 2, "b": 2}, "longest_palindrome": "aa"}
hint: cleaned = "".join(ch.lower() for ch in s if ch.isalnum()). Then two-pointer check on cleaned. Count the original with a dict and get. For longest palindrome, define expand(left,right) returning right-left-1, loop i from 0 to len(s)-1, track max_len and start = i - (max_len-1)//2. Build cleaned with a list comprehension so there is no += loop. Return the dict exactly with the three given keys.
explain: This project combines three chapter-5 skills: valid-palindrome cleaning (isalnum + lower + two pointers), character counting with dict.get, and center expansion for the longest palindrome. It also tests whether you avoid the O(n^2) += loop by using a list or a comprehension for any string you build. Note that char_counts reflects the ORIGINAL casing, while is_palindrome is checked on the cleaned lowercased version.
```
