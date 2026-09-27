# 第 5 章测验：哈希表

> 哈希表是算法题的万能钥匙。这章测验覆盖了哈希的基本原理、冲突解决、Python 内置实现、解题套路和实战应用。

## 选择题

```quiz
type: choice
exam: true
q: 哈希表的平均查找时间复杂度是 O(1)，但最坏情况下会退化到 O(n)。以下哪种情况会导致最坏情况？
options:
- 所有 key 经过哈希函数后都映射到同一个位置（全部冲突）
- 哈希表的数组容量恰好是质数
- 哈希函数的输出分布非常均匀
- 负载因子小于 0.5
answer: 0
explain: 当所有 key 映射到同一位置时，无论用链地址法还是开放寻址，查找都退化为线性扫描，复杂度 O(n)。均匀分布和质数容量都有助于减少冲突。
```

```quiz
type: choice
exam: true
q: 关于 Python 3.7+ 的 dict 有序性，以下说法正确的是？
options:
- 遍历顺序等于插入顺序，但不等于按 key 排序
- 遍历顺序按 key 的字母/数字大小排序
- 遍历顺序是随机的，每次运行都不同
- 遍历顺序按 hash 值从小到大排列
answer: 0
explain: Python 3.7+ 的 dict 保证插入顺序（insertion order preservation），但不是排序。{'zebra':1, 'apple':2} 的遍历顺序是 zebra 在前、apple 在后，因为先插入 zebra。
```

```quiz
type: choice
exam: true
q: 以下哪个不能作为 Python dict 的 key？
options:
- 一个只包含 int 的 tuple
- 一个 frozenset
- 一个包含 dict 的 tuple
- 一个 str
answer: 2
explain: tuple 本身不可变，但如果里面包含可变对象（如 dict），整个 tuple 就不可哈希了。frozenset 是不可变的，可以当 key。int 和 str 天然可哈希。
```

```quiz
type: choice
exam: true
q: 在前缀和+哈希解决"子数组和为 K 的个数"问题时，初始化 prefix_count = {0: 1} 的作用是什么？
options:
- 当某个前缀和恰好等于 K 时，need = 0，需要有一个"前缀和为 0"的记录来匹配这种情况
- 防止字典为空时报 KeyError
- 为了提高哈希表的负载因子
- 为了让结果总是包含空数组
answer: 0
explain: 当 pref[i] == K 时，need = pref[i] - K = 0。如果 prefix_count 里没有 {0: 1}，这个合法的子数组就会被漏掉。{0: 1} 代表"数组开始前，前缀和为 0 出现了 1 次"。
```

```quiz
type: choice
exam: true
q: 关于哈希表的负载因子（load factor），以下说法正确的是？
options:
- 负载因子越接近 1，冲突概率越高，性能越差，通常超过 0.75 就需要扩容
- 负载因子越接近 0，查找速度越快，所以应该尽量保持负载因子接近 0
- 负载因子没有上限，可以超过 2 而不会影响性能
- 负载因子只影响插入速度，不影响查找速度
answer: 0
explain: 负载因子 = 元素数 / 容量。越接近 1（链地址法）或更高，每个桶里的元素越多，冲突越严重。负载因子接近 0 虽然快但浪费内存。超过阈值（通常 0.75）触发扩容。
```

## 编程题

```quiz
type: function
exam: true
q: 实现函数 contains_duplicate(nums)，判断一个整数数组中是否存在重复元素。如果存在任意两个相同的值，返回 True；否则返回 False。要求 O(n) 时间复杂度，用 set 实现。
func: contains_duplicate
starter: |
  def contains_duplicate(nums):
      # 在这里改
      return False
cases: |
  [1,2,3,1] -> True
  [1,2,3,4] -> False
  [] -> False
  [1,1,1,3,3,4,3,2,4,2] -> True
hint: 遍历 nums，用 set 记录已见过的元素。对每个 num，如果已在 set 中返回 True，否则加入 set。
explain: set 的查找和插入都是 O(1)，遍历一次 O(n)。如果元素已在 set 中说明有重复。
```

```quiz
type: function
exam: true
q: 实现函数 longest_consecutive(nums)，找出未排序整数数组中**最长连续序列**的长度。要求 O(n) 时间复杂度。例如 [100, 4, 200, 1, 3, 2] 的最长连续序列是 [1, 2, 3, 4]，返回 4。思路：先把所有数字放入 set，然后对每个数字，如果它是序列的起点（即 num-1 不在 set 中），就向后扩展计数。
func: longest_consecutive
starter: |
  def longest_consecutive(nums):
      # 在这里改
      return 0
cases: |
  [100,4,200,1,3,2] -> 4
  [0,3,7,2,5,8,4,6,0,1] -> 9
  [] -> 0
  [1,2,0,1] -> 3
hint: 先转 set。遍历 nums，对每个 num，如果 num-1 不在 set 中，说明 num 是起点。然后 while num+1 in set: num+=1 计数。
explain: 用 set 做 O(1) 查找。只从每个序列的起点开始扩展（num-1 not in set），避免重复计数。每个元素最多被访问两次（一次遍历，一次扩展），总 O(n)。
```

## 综合项目

```quiz
type: project
exam: true
q: 实现一个 LRU Cache（最近最少使用缓存）。要求实现两个方法：get(key) 返回 key 对应的值，如果 key 不存在返回 -1；put(key, value) 插入或更新 key-value。当缓存容量超过 capacity 时，移除**最久未使用**的 key（即最长时间没被 get 或 put 访问过的）。要求 get 和 put 都是 O(1) 时间复杂度。提示：用 dict（哈希表）存储 key→(value, node) 的映射，配合一个双向链表维护访问顺序。Python 中可以直接用 OrderedDict 或 dict + deque 简化实现，但建议使用 collections.OrderedDict 的 move_to_end 和 popitem 方法。
starter: |
  from collections import OrderedDict
  
  class LRUCache:
      def __init__(self, capacity):
          # 在这里改
          pass
      
      def get(self, key):
          # 在这里改
          return -1
      
      def put(self, key, value):
          # 在这里改
          pass
cases: |
  c=LRUCache(2); c.put(1,1); c.put(2,2); c.get(1); c.put(3,3); c.get(2) -> -1
  c=LRUCache(1); c.put(1,1); c.put(2,2); c.get(1); c.get(2) -> -1, 2
  c=LRUCache(2); c.put(1,1); c.put(1,10); c.get(1) -> 10
hint: 用 OrderedDict。get 时如果 key 存在，move_to_end(key) 然后返回值。put 时如果 key 已存在 move_to_end 并更新值；否则加入，如果 len > capacity 就 popitem(last=False)。
explain: OrderedDict 维护了插入/访问顺序。move_to_end(key) 把 key 移到末尾（最近使用），popitem(last=False) 移除最前面的（最久未使用）。get 命中时 move_to_end 表示最近用过。put 时容量超限就 popitem(last=False)。
```
