# Chapter 2 test: arrays and objects

## Part 1 · Multiple choice

```quiz
type: choice
exam: true
q: Which statement about map, filter and reduce is correct?
options:
- map is for filtering arrays and filter is for transforming them
- map returns a transformed new array (same length), filter returns a new array of elements that satisfy the condition, and reduce folds the array into a single value
- map mutates the original array and filter does not
- filter always returns an array longer than the original
answer: 1
explain: map transforms each item and returns a same-length new array; filter returns a new array of length at most the original; reduce folds everything into one value via an accumulator. None of the three mutates the original array.
```

```quiz
type: choice
exam: true
q: Which statement about the array methods forEach and map is correct?
options:
- forEach returns a new array and map does not
- map returns a new array while forEach returns undefined (no new array)
- forEach can be interrupted with break, but map cannot
- forEach and map are exactly the same
answer: 1
explain: map returns the transformed new array; forEach always returns undefined. forEach cannot be broken out of with break (return only skips the current iteration), so use for...of when you need to break early.
```

```quiz
type: choice
exam: true
q: Which statement about string methods is correct?
options:
- 'hello'.split('') returns ['hello']
- 'hello'.charAt(0) returns "h", and 'hello'[0] also returns "h"
- 'hello'.substring(1, 3) returns "el"
- '  hello  '.trim() returns "  hello  "
answer: 2
explain: 'hello'.split('') returns ['h','e','l','l','o']; both charAt and index access retrieve a character; substring(1,3) takes indices 1 and 2 (3 excluded), giving "el"; trim() strips the surrounding spaces and returns "hello".
```

```quiz
type: choice
exam: true
q: Which statement about object destructuring is correct?
options:
- const { a, b } = { a: 1, c: 3 } throws an error
- You can give a destructured variable a default value: const { name = 'Anonymous' } = user
- Destructured variables cannot be renamed
- The order of object destructuring matters
answer: 1
explain: Destructuring a property that does not exist yields undefined rather than throwing. You can supply defaults such as { name = 'Anonymous' }. You can rename with { name: userName }. Object destructuring is unordered (unlike array destructuring).
```

```quiz
type: choice
exam: true
q: Which statement about the array methods find and findIndex is correct?
options:
- find returns the element that satisfies the condition, and findIndex returns the index of the element that satisfies the condition
- find returns an index and findIndex returns an element
- find returns -1 when it finds nothing
- findIndex returns undefined when it finds nothing
answer: 0
explain: find returns the first element satisfying the predicate (undefined if none); findIndex returns the index of the first such element (-1 if none).
```

## Part 2 · Hands-on

```quiz
type: js
exam: true
q: Write a function getActiveUsers(users) where users is an array of users [{id, name, isActive, age}]. Return the users whose isActive is true, sorted by age from highest to lowest, keeping only the {id, name, age} fields.
func: getActiveUsers
starter: |
  function getActiveUsers(users) {
      // filter active users, then sort, then keep only the specified fields
  }
checks:
- JSON.stringify(getActiveUsers([{id:1,name:"Alice",isActive:true,age:25},{id:2,name:"Bob",isActive:false,age:30},{id:3,name:"Carol",isActive:true,age:28}])) === JSON.stringify([{"id":3,"name":"Carol","age":28},{"id":1,"name":"Alice","age":25}])
- JSON.stringify(getActiveUsers([{id:1,name:"A",isActive:false,age:20}])) === JSON.stringify([])
hint: users.filter(u => u.isActive).sort((a,b) => b.age - a.age).map(u => ({id:u.id,name:u.name,age:u.age}))
explain: A chain: filter to select, sort to order, map to shape the output. This is the standard pipeline pattern for array processing.
```

```quiz
type: js
exam: true
q: Write a function groupByCity(users) where users is [{name, city}]. Return an object whose keys are cities and whose values are arrays of the names of people in that city. For example [{name:"Alice",city:"London"},{name:"Bob",city:"Paris"},{name:"Carol",city:"London"}] becomes {London:["Alice","Carol"], Paris:["Bob"]}.
func: groupByCity
starter: |
  function groupByCity(users) {
      // group by city, returning { city: [names] }
  }
checks:
- JSON.stringify(groupByCity([{name:"Alice",city:"London"},{name:"Bob",city:"Paris"},{name:"Carol",city:"London"}])) === JSON.stringify({"London":["Alice","Carol"],"Paris":["Bob"]})
- JSON.stringify(groupByCity([])) === JSON.stringify({})
- JSON.stringify(groupByCity([{name:"A",city:"York"},{name:"B",city:"York"}])) === JSON.stringify({"York":["A","B"]})
hint: Use reduce: acc[user.city] = acc[user.city] || []; acc[user.city].push(user.name); return acc;
explain: Grouping with reduce: the accumulator is an object; on each iteration you push the name into the array for that user's city.
```

## Part 3 · Mini-project

```quiz
type: project
exam: true
q: Write a function processOrders(orders) where orders is an array of orders [{id, product, price, qty, status}]. Return an object { totalRevenue, totalItems, topProduct, pendingCount } containing total revenue (sum of price*qty), total items (sum of qty), the product name with the highest sales volume (largest qty), and the number of pending orders (status==='pending').
func: processOrders
starter: |
  function processOrders(orders) {
      // return the statistics object
  }
checks:
- JSON.stringify(processOrders([{id:1,product:"Phone",price:2000,qty:2,status:"completed"},{id:2,product:"Earbuds",price:200,qty:5,status:"pending"},{id:3,product:"Phone",price:2000,qty:1,status:"completed"}])) === JSON.stringify({"totalRevenue":5000,"totalItems":8,"topProduct":"Phone","pendingCount":1})
- JSON.stringify(processOrders([])) === JSON.stringify({"totalRevenue":0,"totalItems":0,"topProduct":null,"pendingCount":0})
hint: Use reduce twice for totalRevenue and totalItems; use reduce to tally each product's total qty, then find the entry with the largest value; use filter to count pending orders.
explain: A combined exercise: reduce used several times plus an object tally. First reduce to get the revenue and item totals, then reduce again to build the per-product sales distribution, and finally reduce to find the product with the highest total.
```
