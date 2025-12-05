
---

## 1. How does JavaScript work / Event loop

**Short explanation:** JS is single-threaded (one main thread for executing JS). The **event loop** coordinates execution between:

* **Call stack** — where functions execute.
* **Web APIs / runtime** — timers, DOM events, XHR, etc.
* **Callback (task) queue / microtask queue** — callbacks ready to run.
* **Event loop** — picks tasks: microtasks (Promises `.then`) first, then macrotasks (setTimeout callbacks), and pushes them to call stack.

**Example sequence:**

```js
console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(()=> console.log('promise'));

console.log('end');
// Output:
// start
// end
// promise
// timeout
```

Microtasks (`then`) run before macrotasks (`setTimeout`) even with 0ms.

---

## 2. Execution context

**Explanation:** An execution context is the environment where JS code runs. Three main types:

1. **Global execution context** — created first (global object, `this`).
2. **Function execution context** — every time a function is called.
3. **Eval execution context** — (rare) created by `eval`.

Each execution context has:

* **Variable Environment** (declarations)
* **Lexical Environment** (scope chain — see next)
* **This binding**

**Creation phases:**

* **Creation (memory)**: hoisting variables and functions; setting up `this`.
* **Execution**: running code, assigning values, evaluating expressions.

**Example:**

```js
var a = 1;
function foo() {
  var b = 2;
  function bar() { return a + b; }
  return bar;
}
const f = foo(); // returns bar with closure over b
console.log(f()); // 3
```

---

## 3. Hoisting

**Explanation:** JS “hoists” declarations (not initializations). `var` declarations are hoisted and initialized to `undefined`. Function declarations are hoisted with the full function. `let`/`const` are hoisted to the top of the block but remain uninitialized (TDZ — temporal dead zone).

**Example:**

```js
console.log(x); // undefined (var hoisted)
var x = 5;

console.log(foo()); // works: function hoisted
function foo(){ return 'hi' }

console.log(y); // ReferenceError (TDZ)
let y = 3;
```

---

## 4. Scope chain

**Explanation:** The scope chain is how JS resolves identifiers: current lexical environment → parent environment → ... → global. Lexical scoping means inner functions remember the environment where they were defined.

**Example:**

```js
const a = 1;
function outer() {
  const b = 2;
  function inner() {
    const c = 3;
    console.log(a + b + c); // looks up through scope chain
  }
  inner();
}
outer(); // 6
```

---

## 5. `var`, `let`, `const`, Temporal Dead Zone (TDZ)

**Explanation:**

* `var`: function-scoped or global-scoped; hoisted and initialized with `undefined`.
* `let`: block-scoped; hoisted but not initialized until declaration (TDZ).
* `const`: like `let` but immutable binding (value can be an object that mutates).

**TDZ example:**

```js
{
  console.log(x); // ReferenceError
  let x = 2; // x in TDZ until this line
}
```

---

## 6. `this` keyword

**Explanation:** `this` depends on call-site:

* In global function (non-strict): `this` = global object (window in browsers). In strict mode, `undefined`.
* As method: `this` = object before dot.
* Constructor (`new`): `this` = newly created object.
* `call`/`apply`/`bind` can set `this`.
* Arrow functions: lexically bind `this` from surrounding scope (no own `this`).

**Example:**

```js
const obj = {
  val: 42,
  method() { console.log(this.val); } // this -> obj
};
obj.method(); // 42

function f(){ console.log(this); }
f(); // global or undefined in strict mode

const arrow = () => console.log(this); // lexical
```

---

## 7. `call`, `apply`, `bind`

**Explanation:**

* `fn.call(thisArg, arg1, arg2, ...)` — invoke with `thisArg`.
* `fn.apply(thisArg, [argsArray])` — same with array of args.
* `fn.bind(thisArg, ...args)` — returns a new function permanently bound to `thisArg`.

**Example:**

```js
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}
const user = { name: 'Alice' };
greet.call(user, 'Hello', '!'); // Hello, Alice!
greet.apply(user, ['Hi', '...']); // Hi, Alice...
const bound = greet.bind(user, 'Hey');
bound('?'); // Hey, Alice?
```

---

## 8. Closure

**Explanation:** A closure is a function with access to its lexical scope even after the outer function has returned.

**Example:**

```js
function counter() {
  let count = 0;
  return function() {
    count += 1;
    return count;
  };
}

const inc = counter();
console.log(inc()); // 1
console.log(inc()); // 2
```

`inc` closes over `count`.

---

## 9. Constructor functions, classes

**Constructor function example:**

```js
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() { return 'Hi ' + this.name; };

const p = new Person('Sam');
console.log(p.greet()); // Hi Sam
```

**ES6 classes (syntactic sugar over prototypal):**

```js
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hi ${this.name}`; }
}
```

---

## 10. Prototypal inheritance

**Explanation:** Objects inherit directly from other objects via prototype chain (`__proto__` or `Object.getPrototypeOf`). Methods placed on prototype are shared.

**Example:**

```js
const proto = { sayHi() { return 'hi'; } };
const obj = Object.create(proto);
console.log(obj.sayHi()); // 'hi'
```

---

## 11. Implement debounce

**Goal:** Run function after `wait` ms since last call.

**Implementation:**

```js
function debounce(fn, wait = 200) {
  let timer = null;
  const debounced = function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

// Usage
const save = debounce((value) => console.log('Saved', value), 300);
save('a'); save('b'); // only 'b' after 300ms
```

---

## 12. Implement throttle

**Goal:** Ensure function runs at most once per `limit` ms.

**Implementation (timestamp approach):**

```js
function throttle(fn, limit = 200) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// Usage
const onScroll = throttle(() => console.log('scroll'), 100);
```

Another variant uses setTimeout to handle trailing calls.

---

## 13. Polyfill for `map`, `reduce`, `filter`, `forEach`

**Implementations:**

```js
// forEach
Array.prototype.myForEach = function(cb, thisArg) {
  if (this == null) throw new TypeError('Array is null');
  for (let i = 0; i < this.length; i++) {
    if (i in this) cb.call(thisArg, this[i], i, this);
  }
};

// map
Array.prototype.myMap = function(cb, thisArg) {
  if (this == null) throw new TypeError('Array is null');
  const res = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) res[i] = cb.call(thisArg, this[i], i, this);
  }
  return res;
};

// filter
Array.prototype.myFilter = function(cb, thisArg) {
  if (this == null) throw new TypeError('Array is null');
  const res = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      const val = this[i];
      if (cb.call(thisArg, val, i, this)) res.push(val);
    }
  }
  return res;
};

// reduce
Array.prototype.myReduce = function(cb, initial) {
  if (this == null) throw new TypeError('Array is null');
  let i = 0, acc;
  if (arguments.length >= 2) {
    acc = initial;
  } else {
    // find first present element
    while (i < this.length && !(i in this)) i++;
    if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];
  }
  for (; i < this.length; i++) {
    if (i in this) acc = cb(acc, this[i], i, this);
  }
  return acc;
};
```

---

## 14. Polyfill for `call`, `apply`, `bind`

**Implementations:**

```js
Function.prototype.myCall = function(thisArg, ...args) {
  thisArg = thisArg || globalThis;
  const fnSym = Symbol('fn');
  thisArg[fnSym] = this;
  const result = thisArg[fnSym](...args);
  delete thisArg[fnSym];
  return result;
};

Function.prototype.myApply = function(thisArg, argsArray) {
  thisArg = thisArg || globalThis;
  const fnSym = Symbol('fn');
  thisArg[fnSym] = this;
  const result = argsArray ? thisArg[fnSym](...argsArray) : thisArg[fnSym]();
  delete thisArg[fnSym];
  return result;
};

Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this;
  function bound(...args) {
    // support new
    const isNew = this instanceof bound;
    return fn.apply(isNew ? this : thisArg, boundArgs.concat(args));
  }
  bound.prototype = Object.create(fn.prototype);
  return bound;
};
```

---

## 15. Polyfill for `flat` method

**Shallow flatten (depth = 1):**

```js
Array.prototype.myFlat = function(depth = 1) {
  const res = [];
  (function flat(arr, d) {
    for (const item of arr) {
      if (Array.isArray(item) && d > 0) flat(item, d-1);
      else res.push(item);
    }
  })(this, depth);
  return res;
};
```

---

## 16. Infinite depth flatten and flatten by a certain number

**Infinite depth:**

```js
function flattenDeep(arr) {
  const res = [];
  (function recurse(a) {
    for (const v of a) {
      if (Array.isArray(v)) recurse(v);
      else res.push(v);
    }
  })(arr);
  return res;
}
```

**Flatten to depth `n`** — use `myFlat(depth)` above.

---

## 17. Implement both recursive and iterative approaches

**Recursive (sum example):**

```js
function sumRecursive(arr) {
  if (arr.length === 0) return 0;
  const [head, ...tail] = arr;
  return head + sumRecursive(tail);
}
```

**Iterative:**

```js
function sumIterative(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total;
}
```

**Recursive flatten shown earlier; iterative flatten using stack:**

```js
function flattenIterative(arr) {
  const stack = [...arr];
  const res = [];
  while (stack.length) {
    const el = stack.pop();
    if (Array.isArray(el)) {
      // push children reversed to preserve order
      for (let i = el.length - 1; i >= 0; i--) stack.push(el[i]);
    } else res.push(el);
  }
  return res.reverse();
}
```

---

## 18. Currying

**Explanation:** Transform `f(a,b,c)` → `f(a)(b)(c)`.

**Implementation:**

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return function(...rest) { return curried.apply(this, args.concat(rest)); };
  };
}

// Usage
function add(a,b,c) { return a+b+c; }
const cur = curry(add);
console.log(cur(1)(2)(3)); // 6
console.log(cur(1,2)(3));  // 6
```

---

## 19. Given an object make the keys as values and values as keys. Handle duplicates, assuming values are only strings

**Explanation:** When values collide, group keys into arrays.

**Implementation:**

```js
function invert(obj) {
  const res = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (res[val]) {
        res[val].push(key);
      } else {
        res[val] = [key];
      }
    }
  }
  return res;
}

// Example
console.log(invert({a:'x', b:'y', c:'x'})); // { x: ['a','c'], y: ['b'] }
```

---

## 20. Implement observable (not very common, good to have)

**Simple Observable pattern (subscribe/next/unsubscribe):**

```js
function Observable() {
  this.subscribers = new Set();
}
Observable.prototype.subscribe = function(fn) {
  this.subscribers.add(fn);
  return { unsubscribe: () => this.subscribers.delete(fn) };
};
Observable.prototype.next = function(val) {
  for (const s of this.subscribers) s(val);
};

// Usage
const obs = new Observable();
const sub = obs.subscribe(x => console.log('got', x));
obs.next(1);
sub.unsubscribe();
```

This is tiny compared to RxJS, but shows concept.

---

## 21. Promises

**Explanation:** Promise is an object representing eventual completion (resolve) or failure (reject). `.then`, `.catch`, `.finally`.

**Example:**

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 100);
});
p.then(val => console.log(val)).catch(err => console.error(err));
```

---

## 22. Polyfill for Promises

**Simplified Promise polyfill** (educational — not production-ready):

```js
function SimplePromise(executor) {
  this.state = 'pending';
  this.value = undefined;
  this.handlers = [];

  const resolve = (value) => {
    if (this.state !== 'pending') return;
    if (value && typeof value.then === 'function') {
      return value.then(resolve, reject);
    }
    this.state = 'fulfilled';
    this.value = value;
    this.handlers.forEach(h => h.onFulfilled(value));
  };

  const reject = (err) => {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    this.value = err;
    this.handlers.forEach(h => h.onRejected(err));
  };

  try {
    executor(resolve, reject);
  } catch (err) { reject(err); }
}

SimplePromise.prototype.then = function(onFulfilled, onRejected) {
  return new SimplePromise((resolve, reject) => {
    const handler = {
      onFulfilled: (val) => {
        try { resolve(onFulfilled ? onFulfilled(val) : val); } catch (e) { reject(e); }
      },
      onRejected: (err) => {
        try { if (onRejected) resolve(onRejected(err)); else reject(err); } catch (e) { reject(e); }
      }
    };
    if (this.state === 'pending') this.handlers.push(handler);
    else if (this.state === 'fulfilled') handler.onFulfilled(this.value);
    else handler.onRejected(this.value);
  });
};
```

(Real polyfills handle microtasks and many edge cases — above is simplified.)

---

## 23. Polyfill for `Promise.all`, `Promise.allSettled`, etc.

**`Promise.all` simplified:**

```js
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        completed++;
        if (completed === promises.length) resolve(results);
      }, reject);
    });
    if (promises.length === 0) resolve([]);
  });
};
```

**`Promise.allSettled` simplified:**

```js
Promise.myAllSettled = function(promises) {
  return Promise.all(promises.map(p =>
    Promise.resolve(p).then(
      v => ({ status: 'fulfilled', value: v }),
      e => ({ status: 'rejected', reason: e })
    )));
};
```

**Note:** `Promise.race`, `Promise.any` can be similarly implemented.

---

## 24. Implement curry (already shown earlier) — alternate approach

**Point-free curry for variadic usage:**

```js
function curryN(fn, arity = fn.length) {
  return function nextCurried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => nextCurried(...args, ...more);
  };
}
```

---

## 25. Spread, rest, destructuring

**Examples:**

```js
// spread (arrays)
const a = [1,2];
const b = [...a, 3]; // [1,2,3]

// spread (objects)
const obj = { x:1 };
const obj2 = { ...obj, y:2 }; // {x:1, y:2}

// rest in function args
function sum(...nums) { return nums.reduce((s,n)=>s+n,0); }

// destructuring
const [x, y] = [10, 20];
const { name, age } = { name: 'A', age: 30 };
```

---

## 26. Event delegation and event bubbling

**Explanation:**

* **Bubbling:** events propagate from target up to root.
* **Delegation:** attach a listener to a common ancestor and handle events for many children via `event.target` — efficient.

**Example:**

```html
<ul id="list">
  <li data-id="1">One</li>
  <li data-id="2">Two</li>
</ul>
<script>
document.getElementById('list').addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  console.log('clicked', li.dataset.id);
});
</script>
```

---

## 27. Implement `setInterval` using `setTimeout`

**Why:** `setTimeout` based interval can avoid drift.

**Implementation:**

```js
function mySetInterval(fn, delay) {
  let active = true;
  function tick() {
    if (!active) return;
    const start = Date.now();
    Promise.resolve().then(() => fn()); // call
    const elapsed = Date.now() - start;
    setTimeout(tick, Math.max(0, delay - elapsed));
  }
  setTimeout(tick, delay);
  return { clear: () => active = false };
}

// Usage
const t = mySetInterval(() => console.log('tick'), 1000);
setTimeout(() => t.clear(), 5000);
```

---

## 28. Memoize any function

**Simple memoize:**

```js
function memoize(fn, resolver = JSON.stringify) {
  const cache = new Map();
  return function(...args) {
    const key = resolver(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example
const fib = memoize(function(n) {
  if (n < 2) return n;
  return fib(n-1) + fib(n-2);
});
```

---

## 29. Implement async series

**Goal:** Run async functions in sequence, passing results or just ensuring order.

**Implementation (array of functions returning promises):**

```js
async function asyncSeries(tasks) {
  const results = [];
  for (const t of tasks) {
    results.push(await t());
  }
  return results;
}

// usage
const tasks = [
  () => Promise.resolve(1),
  () => new Promise(r=>setTimeout(()=>r(2), 100)),
  () => Promise.resolve(3)
];
asyncSeries(tasks).then(console.log); // [1,2,3]
```

**Alternate (reduce):**

```js
tasks.reduce((p, t) => p.then(r => t().then(res => r.concat(res))), Promise.resolve([]));
```

---

## 30. Generator functions

**Explanation:** Generators (`function*`) yield values lazily and can be resumed. Useful for iterators, async control flows (pre-`async/await`), or building custom iterators.

**Example:**

```js
function* idMaker() {
  let id = 0;
  while (true) yield ++id;
}
const gen = idMaker();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

**Using generators to consume async** (small demo pattern):

```js
function run(genFn) {
  const gen = genFn();
  function step(nextF, arg) {
    let next;
    try { next = nextF(arg); } catch (e) { return Promise.reject(e); }
    if (next.done) return Promise.resolve(next.value);
    return Promise.resolve(next.value).then(v => step(gen.next.bind(gen), v), e => step(gen.throw.bind(gen), e));
  }
  return step(gen.next.bind(gen));
}
// usage with yields of promises
run(function*() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(a + 1);
  return b;
}).then(console.log); // 2
```

---

### Final notes & tips

* For **interviews**, explain trade-offs and edge cases (e.g., `bind` usage when using constructors, TDZ behavior, Promise microtask ordering).
* For polyfills and Promise implementations, emphasize that a **production-ready** polyfill handles many spec edge cases (microtasks queue, subclassing, proper `then` resolution, etc.). The provided implementations are simplified to show understanding.
* Practice mentally tracing **event loop** examples and closure examples — interviewers often ask you to explain output.


---

## **1️⃣ Call, Apply, Bind → Difference + Polyfill**

**Difference:**

| Method  | Context (`this`) | Arguments           |
| ------- | ---------------- | ------------------- |
| `call`  | Explicitly set   | Comma-separated     |
| `apply` | Explicitly set   | Array or array-like |
| `bind`  | Returns new fn   | Comma-separated     |

**Example:**

```js
const person = { name: "John" };
function greet(greeting, city) {
  console.log(`${greeting}, I am ${this.name} from ${city}`);
}

greet.call(person, "Hello", "NY");   // Hello, I am John from NY
greet.apply(person, ["Hi", "LA"]);   // Hi, I am John from LA

const boundGreet = greet.bind(person, "Hey");
boundGreet("Chicago");                // Hey, I am John from Chicago
```

**Polyfill for `call`:**

```js
Function.prototype.myCall = function(context, ...args) {
  context = context || globalThis;
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

greet.myCall(person, "Hello", "NY"); // Works like call
```

**Polyfill for `bind`:**

```js
Function.prototype.myBind = function(context, ...args1) {
  const fn = this;
  return function(...args2) {
    return fn.apply(context, [...args1, ...args2]);
  };
};
```

---

## **2️⃣ Flatten an Array without `Array.flat()`**

**Input:** `[1,2,3,[4,5,6,[7,8,[10,11]]],9]`
**Output:** `[1,2,3,4,5,6,7,8,10,11,9]`

**Recursive Implementation:**

```js
function flatten(arr) {
  let result = [];
  for (let el of arr) {
    if (Array.isArray(el)) result = result.concat(flatten(el));
    else result.push(el);
  }
  return result;
}

const arr = [1,2,3,[4,5,6,[7,8,[10,11]]],9];
console.log(flatten(arr));
```

**Output:** `[1,2,3,4,5,6,7,8,10,11,9]`

---

## **3️⃣ Inline 5 divs in a row without flex/margin/padding**

```html
<div style="display:inline-block;width:50px;height:50px;background:red;"></div>
<div style="display:inline-block;width:50px;height:50px;background:green;"></div>
<div style="display:inline-block;width:50px;height:50px;background:blue;"></div>
<div style="display:inline-block;width:50px;height:50px;background:orange;"></div>
<div style="display:inline-block;width:50px;height:50px;background:purple;"></div>
```

**Explanation:**

* `display:inline-block` allows divs to sit horizontally like text.

---

## **4️⃣ Find sum of numbers without a `for` loop**

**Using `reduce()`:**

```js
const numbers = [1,2,3,4,5];
const sum = numbers.reduce((acc, val) => acc + val, 0);
console.log(sum); // 15
```

**Using recursion:**

```js
function sumArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumArray(arr.slice(1));
}
```

---

## **5️⃣ Deep Copy vs Shallow Copy**

**Shallow Copy:** Copies references for nested objects.

```js
const obj = { a: 1, b: { c: 2 } };
const shallow = { ...obj };
shallow.b.c = 5;
console.log(obj.b.c); // 5 → reference shared
```

**Deep Copy:** Copies all levels independently.

```js
const deep = JSON.parse(JSON.stringify(obj));
deep.b.c = 10;
console.log(obj.b.c); // 5 → original unaffected
```

**Better Approach (handles functions, dates):** `structuredClone(obj)` in modern JS.

---

## **6️⃣ Promise & Async/Await Output Puzzle**

**Example:**

```js
async function test() {
  console.log(1);
  const p = new Promise((resolve) => resolve(2));
  p.then(console.log);
  console.log(3);
}

test();
// Output: 1,3,2
```

**Explanation:**

* Synchronous logs: 1 → 3
* Microtask queue handles promise resolution: 2

---

## **7️⃣ Find First Repeating Character**

```js
function firstRepeatingChar(str) {
  const map = {};
  for (let ch of str) {
    if (map[ch]) return ch;
    map[ch] = 1;
  }
}

console.log(firstRepeatingChar("success")); // "c"
```

---

## **8️⃣ Stopwatch Implementation**

```html
<div id="timer">0:00</div>
<button id="start">Start</button>
<button id="stop">Stop</button>
<button id="reset">Reset</button>

<script>
let seconds = 0, interval;

function updateTimer() {
  const min = Math.floor(seconds/60);
  const sec = seconds % 60;
  document.getElementById("timer").textContent = `${min}:${sec < 10 ? '0'+sec : sec}`;
  seconds++;
}

document.getElementById("start").onclick = () => interval = setInterval(updateTimer, 1000);
document.getElementById("stop").onclick = () => clearInterval(interval);
document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  seconds = 0;
  document.getElementById("timer").textContent = "0:00";
}
</script>
```

---

## **9️⃣ Build a To-Do List (React optimized)**

```jsx
import React, { useState, memo } from "react";

const TodoItem = memo(({ todo }) => <li>{todo}</li>);

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    setTodos(prev => [...prev, input]);
    setInput("");
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((t, i) => <TodoItem key={i} todo={t} />)}
      </ul>
    </div>
  );
}
```

**Optimization:** `memo` prevents re-rendering unchanged items.

---

## **🔟 Currying for Infinite Sum**

```js
function sum(a) {
  let total = a || 0;

  function inner(b) {
    if (b === undefined) return total;
    total += b;
    return inner;
  }

  return inner;
}

console.log(sum(10)(20)(30)());          // 60
console.log(sum(10)(20)(30)(40)(50)(60)()); // 210
```

**Explanation:**

* Returns a function for chaining until empty call `()` is made.

---

These solutions cover **classic JavaScript, functional programming, recursion, async/await, and React optimization techniques**—perfect for interviews.

---


---

## **1️⃣ Implement `Promise.all` polyfill**

`Promise.all` resolves when **all promises succeed**, or rejects immediately if **any fail**.

```js
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let completed = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
};

// Example
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
Promise.myAll([p1, p2]).then(console.log); // [1,2]
```

---

## **2️⃣ Implement `Promise.any` polyfill**

`Promise.any` resolves with **first fulfilled promise** and rejects if **all fail**.

```js
Promise.myAny = function(promises) {
  return new Promise((resolve, reject) => {
    let errors = [];
    let rejectedCount = 0;

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(resolve)
        .catch(err => {
          errors[i] = err;
          rejectedCount++;
          if (rejectedCount === promises.length) reject(errors);
        });
    });
  });
};
```

---

## **3️⃣ Implement `Array.prototype.reduce` polyfill**

```js
Array.prototype.myReduce = function(callback, initial) {
  let acc = initial === undefined ? this[0] : initial;
  let start = initial === undefined ? 1 : 0;

  for (let i = start; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

console.log([1,2,3].myReduce((a,b)=>a+b, 0)); // 6
```

---

## **4️⃣ Implement Lodash’s `flatten` method**

```js
function flatten(arr) {
  let result = [];
  for (let el of arr) {
    if (Array.isArray(el)) result = result.concat(flatten(el));
    else result.push(el);
  }
  return result;
}

flatten([1, [2, 3, [4, 5]]]); // [1,2,3,4,5]
```

---

## **5️⃣ Implement auto-retry for promises**

```js
function retry(promiseFn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      promiseFn()
        .then(resolve)
        .catch(err => {
          if (n === 0) reject(err);
          else setTimeout(() => attempt(n - 1), delay);
        });
    }
    attempt(retries);
  });
}
```

---

## **6️⃣ Throttle promises by batching**

```js
function throttlePromises(promises, batchSize = 2) {
  const results = [];
  let index = 0;

  function nextBatch() {
    const batch = promises.slice(index, index + batchSize).map(p => p());
    return Promise.all(batch).then(res => {
      results.push(...res);
      index += batchSize;
      if (index < promises.length) return nextBatch();
      return results;
    });
  }

  return nextBatch();
}
```

---

## **7️⃣ Debouncing Implementation**

```js
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Example
window.addEventListener("resize", debounce(() => console.log("Resized!"), 300));
```

---

## **8️⃣ Throttling Implementation**

```js
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// Example
window.addEventListener("scroll", throttle(() => console.log("Scroll!"), 500));
```

---

## **9️⃣ Execute N callback-based async tasks in series**

```js
function series(tasks) {
  return tasks.reduce((p, task) => p.then(() => new Promise(task)), Promise.resolve());
}

// Example
const tasks = [
  cb => setTimeout(() => { console.log("1"); cb(); }, 100),
  cb => setTimeout(() => { console.log("2"); cb(); }, 100)
];
series(tasks);
```

---

## **🔟 Output prediction for tricky JS snippets**

**Example:**

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);

// Output: 1, 4, 3, 2
```

**Explanation:**

* Synchronous first: 1 → 4
* Microtask queue (Promise) → 3
* Task queue (setTimeout) → 2

---

## **1️⃣1️⃣ Object vs Map differences**

| Feature     | Object                         | Map                            |
| ----------- | ------------------------------ | ------------------------------ |
| Key type    | Strings / Symbols              | Any (incl. objects)            |
| Order       | Not guaranteed                 | Insertion order preserved      |
| Iteration   | `for..in` / `Object.keys`      | `map.forEach` / `for..of`      |
| Performance | Slower for frequent add/delete | Faster for frequent add/delete |

---

## **1️⃣2️⃣ Difference between `PATCH` and `PUT`**

| Method | Purpose                      |
| ------ | ---------------------------- |
| PUT    | Replace the entire resource  |
| PATCH  | Update only specified fields |

---

## **1️⃣3️⃣ Difference between debounce and throttle**

* **Debounce:** Executes **after a pause** in events.
* **Throttle:** Executes **at most once per interval**.

---

## **1️⃣4️⃣ How does the JavaScript Engine work?**

1. **Parsing:** JS code → AST
2. **Compilation:** Converts to bytecode
3. **Execution:** JS runtime executes bytecode, manages memory
4. **Garbage collection:** Frees unused memory

---

## **1️⃣5️⃣ Event Loop & Microtask Queue**

* **Call Stack:** Where functions execute
* **Task Queue (macrotask):** setTimeout, setInterval, I/O
* **Microtask Queue:** Promises, MutationObserver → executed **before next macrotask**

**Flow:** Stack empty → Microtasks → Next macrotask

---

## **1️⃣6️⃣ Virtual DOM & Diffing**

* JS representation of real DOM
* Updates **efficiently** by diffing new vs old tree
* Only changed nodes are patched

---

## **1️⃣7️⃣ Control tab order in DOM (`tabIndex`)**

```html
<input tabindex="1">
<input tabindex="2">
<input tabindex="3">
```

* Positive → custom order
* 0 → default focus order
* Negative → cannot be focused

---

## **1️⃣8️⃣ Event Capturing & Bubbling**

* **Capturing:** From root → target
* **Bubbling:** Target → root (default)

```js
div.addEventListener('click', fn, true); // capturing
div.addEventListener('click', fn, false); // bubbling
```

---

## **1️⃣9️⃣ Override `toString` on `String.prototype`**

```js
String.prototype.toString = function() { return "Overridden: " + this.valueOf(); };
console.log("Hello".toString()); // Overridden: Hello
```

---

## **2️⃣0️⃣ OAuth & How it works**

* **OAuth:** Authorization protocol, allows apps to access resources **without sharing password**
* Flow:

  1. App requests token
  2. User authenticates with provider
  3. Token granted → access API

---

## **2️⃣1️⃣ How SSO works**

* **Single Sign-On:** One authentication → multiple apps
* Uses **tokens (JWT/SAML)** to share session securely

---

## **2️⃣2️⃣ REST API Methods**

| Method | Purpose          |
| ------ | ---------------- |
| GET    | Read resource    |
| POST   | Create resource  |
| PUT    | Replace resource |
| PATCH  | Update resource  |
| DELETE | Delete resource  |

---

## **2️⃣3️⃣ Principles of Functional Programming**

1. Pure functions
2. No side effects
3. Immutability
4. First-class functions
5. Function composition

---

## **2️⃣4️⃣ Microservices**

* Break app into **independent, small services**
* Each service has own DB, API
* Advantages: Scalability, maintainability, independent deployments

---
