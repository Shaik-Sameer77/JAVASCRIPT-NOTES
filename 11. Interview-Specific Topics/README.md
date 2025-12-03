# JavaScript Interview-Specific Topics: Deep Dive Guide

## Overview
Master these advanced JavaScript concepts to excel in technical interviews. Each topic includes fundamental explanations, implementation details, and common interview questions.

## 📚 Table of Contents
1. [How JavaScript Works Internally](#how-javascript-works-internally)
2. [Runtime vs Compile Time](#runtime-vs-compile-time)
3. [Synchronous vs Asynchronous](#synchronous-vs-asynchronous)
4. [Polyfills](#polyfills)
5. [Debounce & Throttle Implementation](#debounce--throttle-implementation)
6. [Event Loop Deep Explanation](#event-loop-deep-explanation)
7. [Deep Clone Implementation](#deep-clone-implementation)
8. [Promise.all / Promise.race / Promise.any](#promiseall--promiserace--promiseany)
9. [Creating a Mini Redux Store](#creating-a-mini-redux-store)
10. [Implementing Your Own EventEmitter](#implementing-your-own-eventemitter)

---

## How JavaScript Works Internally

### JavaScript Engine Architecture

```
┌─────────────────────────────────────────┐
│           JavaScript Engine              │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Parser  │→ │AST      │→ │Inter-  │  │
│  │         │  │         │  │preter  │  │
│  └─────────┘  └─────────┘  └─────────┘  │
│       ↓            ↓            ↓        │
│  ┌─────────────────────────────────────┐│
│  │        Just-In-Time (JIT)           ││
│  │         Compiler (V8)               ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│            Memory Heap                   │
│            Call Stack                    │
│            Event Loop                    │
│            Callback Queue                │
│            Microtask Queue               │
└─────────────────────────────────────────┘
```

### Key Components Explained

#### 1. **Parser**
- Converts source code into Abstract Syntax Tree (AST)
- Syntax validation and early error detection

#### 2. **Interpreter (Ignition in V8)**
- Converts AST to Bytecode
- Executes code line by line
- Fast startup but slower execution

#### 3. **Compiler (TurboFan in V8)**
- Optimizes hot code paths (functions called repeatedly)
- Creates optimized machine code
- Uses inline caching and hidden classes

#### 4. **Memory Management**
```javascript
// Stack vs Heap memory
function example() {
  let primitive = 42;        // Stack allocation
  let object = { value: 42 }; // Heap allocation
  
  // Garbage Collection: Mark and Sweep algorithm
  // Reference counting (older)
  // Generational collection (young & old generations)
}
```

#### 5. **Execution Contexts**
```javascript
// Global Execution Context (GEC)
// Function Execution Context (FEC)
// Eval Execution Context

// Creation Phase:
// 1. Create Variable Object (VO)
// 2. Create Scope Chain
// 3. Determine 'this' value

// Execution Phase:
// 1. Variable assignment
// 2. Function execution
```

### Hidden Classes & Inline Caching
```javascript
// V8 optimization: Hidden Classes
function Point(x, y) {
  this.x = x;
  this.y = y;
}

const p1 = new Point(1, 2); // Creates hidden class C0
const p2 = new Point(3, 4); // Reuses hidden class C0

// Different property order creates new hidden class
const p3 = new Point();
p3.y = 5; // Creates C1 (different order)
p3.x = 6;

// Inline Caching
function getX(point) {
  return point.x; // IC remembers location of x in hidden class
}
```

### Interview Questions & Answers

**Q: How does V8 optimize JavaScript code?**
**A:** V8 uses JIT compilation with Ignition (interpreter) and TurboFan (optimizing compiler). It creates hidden classes for objects, uses inline caching for property access, and profiles hot functions for optimization.

**Q: What's the difference between interpreted and compiled languages?**
**A:** JavaScript is JIT-compiled. The interpreter executes bytecode initially, while the compiler optimizes frequently executed code into machine code.

**Q: How does garbage collection work in JavaScript?**
**A:** Modern JavaScript engines use generational garbage collection with mark-and-sweep algorithm, separating objects into young and old generations.

---

## Runtime vs Compile Time

### Compile Time (Static Analysis)
```javascript
// What happens during compilation:
// 1. Syntax checking
// 2. Scope resolution
// 3. Hoisting setup
// 4. Early errors

// Example of compile-time errors:
// console.log(myVar); // ReferenceError if not declared (in strict mode)
// const x = ;         // SyntaxError: missing initializer
// function() {        // SyntaxError: function statement requires name

// Hoisting (compile-time behavior)
console.log(a); // undefined (not ReferenceError)
var a = 10;

// Function declarations are fully hoisted
foo(); // Works
function foo() {
  console.log("Hello");
}

// Function expressions are not fully hoisted
bar(); // TypeError: bar is not a function
var bar = function() {
  console.log("World");
};
```

### Runtime (Dynamic Behavior)
```javascript
// What happens during execution:
// 1. Variable assignment
// 2. Function invocation
// 3. Dynamic type checking
// 4. Exception handling

// Dynamic typing (runtime)
let value = 42;        // Number type
value = "Hello";       // String type (changed at runtime)
value = { key: "val" }; // Object type

// Runtime errors
function divide(a, b) {
  return a / b; // Runtime error if b is 0 (Infinity, not error in JS)
}

try {
  JSON.parse("invalid json"); // SyntaxError at runtime
} catch (error) {
  console.log("Runtime error caught");
}

// Dynamic property access
const obj = { x: 10, y: 20 };
const key = "x";
console.log(obj[key]); // Resolved at runtime
```

### Key Differences Table

| Aspect | Compile Time | Runtime |
|--------|-------------|---------|
| **Timing** | Before code execution | During code execution |
| **Errors** | Syntax errors, early reference errors | Type errors, logical errors, exceptions |
| **Optimization** | Static analysis, dead code elimination | JIT compilation, inline caching |
| **Scope** | Lexical scope determined | Execution context created |
| **Types** | No type checking (in JS) | Dynamic type checking |
| **Hoisting** | Setup occurs | Assignment occurs |

### TypeScript: Compile-Time Type Checking
```typescript
// TypeScript adds compile-time type checking
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return `Hello ${user.name}`;
}

// Compile-time error:
// greet({ name: "John" }); // Error: Property 'age' is missing

// Transpiles to JavaScript, types erased at runtime
```

### Common Interview Questions

**Q: What's the difference between compile-time and runtime errors?**
**A:** Compile-time errors are detected during parsing/compilation (syntax errors, missing declarations). Runtime errors occur during execution (type errors, network failures, undefined behavior).

**Q: How does hoisting work in JavaScript?**
**A:** During compilation, variable and function declarations are moved to the top of their scope. `var` declarations are hoisted with `undefined`, while `let/const` are hoisted but not initialized (Temporal Dead Zone).

**Q: Can you catch compile-time errors in JavaScript?**
**A:** No, compile-time errors prevent code execution. They must be fixed before the code can run.

---

## Synchronous vs Asynchronous

### Synchronous Execution (Blocking)
```javascript
// Code executes line by line
console.log("Start");

function syncTask() {
  console.log("Task 1");
  console.log("Task 2");
  console.log("Task 3");
}

syncTask(); // Blocks until complete

console.log("End");

// Output:
// Start
// Task 1
// Task 2
// Task 3
// End
```

### Asynchronous Execution (Non-blocking)
```javascript
// Using callbacks
console.log("Start");

setTimeout(() => {
  console.log("Async Task");
}, 0);

console.log("End");

// Output:
// Start
// End
// Async Task (executes after sync code)
```

### Evolution of Async Patterns

#### 1. Callbacks (Callback Hell)
```javascript
// Nested callbacks become hard to read
function getUserData(userId, callback) {
  getUser(userId, (user) => {
    getPosts(user.id, (posts) => {
      getComments(posts[0].id, (comments) => {
        callback({ user, posts, comments });
      });
    });
  });
}
```

#### 2. Promises
```javascript
// Chainable async operations
function getUserData(userId) {
  return getUser(userId)
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => ({ user, posts, comments }));
}
```

#### 3. Async/Await
```javascript
// Synchronous-looking async code
async function getUserData(userId) {
  const user = await getUser(userId);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  return { user, posts, comments };
}
```

### Microtasks vs Macrotasks
```javascript
console.log("Script start");

// Macrotask (setTimeout)
setTimeout(() => {
  console.log("setTimeout");
}, 0);

// Microtask (Promise)
Promise.resolve()
  .then(() => {
    console.log("Promise 1");
  })
  .then(() => {
    console.log("Promise 2");
  });

console.log("Script end");

// Output order:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout
```

### Async Patterns Comparison

```javascript
// 1. Parallel execution
async function parallelRequests() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
  return { user, posts };
}

// 2. Sequential with error handling
async function sequentialWithRetry() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error("Failed:", error);
    throw error;
  }
}

// 3. Race conditions
async function raceRequests() {
  const result = await Promise.race([
    fetchWithTimeout("/api/data", 5000),
    timeout(3000) // Rejects after 3s
  ]);
  return result;
}
```

### Common Interview Questions

**Q: What's the difference between synchronous and asynchronous code?**
**A:** Synchronous code executes sequentially and blocks further execution. Asynchronous code allows other operations to run while waiting for tasks to complete.

**Q: Explain the event loop and how it handles async operations.**
**A:** The event loop continuously checks the call stack and task queues. When the call stack is empty, it pushes tasks from the microtask queue (Promises) first, then the macrotask queue (setTimeout, I/O).

**Q: How do Promises differ from callbacks?**
**A:** Promises provide better error handling, avoid callback hell, support chaining, and have built-in methods for handling multiple async operations.

---

## Polyfills

### What are Polyfills?
Polyfills are code that provide modern functionality in older browsers that don't natively support it.

### Implementing Array.prototype.map
```javascript
// Polyfill for Array.prototype.map
if (!Array.prototype.myMap) {
  Array.prototype.myMap = function(callback, thisArg) {
    // 1. Check if `this` is null or undefined
    if (this == null) {
      throw new TypeError('Array.prototype.myMap called on null or undefined');
    }
    
    // 2. Check if callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    // 3. Convert `this` to object
    const array = Object(this);
    const length = array.length >>> 0; // Convert to uint32
    
    // 4. Create new array for results
    const result = new Array(length);
    
    // 5. Iterate through array
    for (let i = 0; i < length; i++) {
      // Skip empty slots in sparse arrays
      if (i in array) {
        // Call callback with proper context
        result[i] = callback.call(thisArg, array[i], i, array);
      }
    }
    
    return result;
  };
}

// Usage
const numbers = [1, 2, 3];
const doubled = numbers.myMap(num => num * 2);
console.log(doubled); // [2, 4, 6]
```

### Implementing Array.prototype.filter
```javascript
// Polyfill for Array.prototype.filter
if (!Array.prototype.myFilter) {
  Array.prototype.myFilter = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.myFilter called on null or undefined');
    }
    
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const array = Object(this);
    const length = array.length >>> 0;
    const result = [];
    
    for (let i = 0; i < length; i++) {
      if (i in array) {
        const element = array[i];
        if (callback.call(thisArg, element, i, array)) {
          result.push(element);
        }
      }
    }
    
    return result;
  };
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.myFilter(num => num % 2 === 0);
console.log(evens); // [2, 4]
```

### Implementing Array.prototype.reduce
```javascript
// Polyfill for Array.prototype.reduce
if (!Array.prototype.myReduce) {
  Array.prototype.myReduce = function(callback, initialValue) {
    if (this == null) {
      throw new TypeError('Array.prototype.myReduce called on null or undefined');
    }
    
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    const array = Object(this);
    const length = array.length >>> 0;
    
    let accumulator;
    let startIndex = 0;
    
    // Handle initial value
    if (arguments.length >= 2) {
      accumulator = initialValue;
    } else {
      // Find first existing element
      while (startIndex < length && !(startIndex in array)) {
        startIndex++;
      }
      
      if (startIndex >= length) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      
      accumulator = array[startIndex++];
    }
    
    // Iterate through remaining elements
    for (let i = startIndex; i < length; i++) {
      if (i in array) {
        accumulator = callback(accumulator, array[i], i, array);
      }
    }
    
    return accumulator;
  };
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.myReduce((acc, num) => acc + num, 0);
console.log(sum); // 15
```

### Implementing Function.prototype.bind
```javascript
// Polyfill for Function.prototype.bind
if (!Function.prototype.myBind) {
  Function.prototype.myBind = function(context, ...bindArgs) {
    // `this` refers to the function being bound
    const originalFunc = this;
    
    // Check if originalFunc is callable
    if (typeof originalFunc !== 'function') {
      throw new TypeError('Function.prototype.bind called on non-function');
    }
    
    // Return bound function
    return function boundFunc(...callArgs) {
      // Determine `this` value for bound function
      // Use context for bound function, but allow `new` keyword
      const isConstructorCall = new.target !== undefined;
      const thisContext = isConstructorCall ? this : context;
      
      // Combine bound arguments and call arguments
      const allArgs = bindArgs.concat(callArgs);
      
      // Call original function with proper context
      return originalFunc.apply(thisContext, allArgs);
    };
  };
}

// Usage
const person = {
  name: 'John',
  greet: function(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

const boundGreet = person.greet.myBind(person, 'Hello');
console.log(boundGreet('!')); // "Hello, John!"
```

### Implementing Object.assign
```javascript
// Polyfill for Object.assign
if (typeof Object.myAssign !== 'function') {
  Object.defineProperty(Object, 'myAssign', {
    value: function(target, ...sources) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      const to = Object(target);
      
      for (let source of sources) {
        if (source != null) {
          for (let key in source) {
            // Check if property is own property (not inherited)
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              to[key] = source[key];
            }
          }
          
          // Handle Symbol properties
          const symbols = Object.getOwnPropertySymbols(source);
          for (let symbol of symbols) {
            to[symbol] = source[symbol];
          }
        }
      }
      
      return to;
    },
    writable: true,
    configurable: true
  });
}

// Usage
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: 3 };

const result = Object.myAssign({}, obj1, obj2, obj3);
console.log(result); // { a: 1, b: 2, c: 3 }
```

### Common Interview Questions

**Q: What's the difference between polyfill and transpiler?**
**A:** Polyfills add missing functionality at runtime, while transpilers convert modern syntax to older syntax during build time (e.g., Babel).

**Q: How would you implement Promise polyfill?**
**A:** Implement a class with `then`, `catch`, `finally` methods, maintaining state (pending, fulfilled, rejected) and callbacks queue.

**Q: When should you use polyfills vs feature detection?**
**A:** Use feature detection to check if a feature exists, then load polyfill only when needed. Modern approach: use tools like Polyfill.io.

---

## Debounce & Throttle Implementation

### Debounce Implementation
```javascript
/**
 * Debounce: Execute function only after a certain wait time
 * has passed since the last time it was invoked.
 */
function debounce(func, wait, immediate = false) {
  let timeout = null;
  let result;
  
  return function executedFunction(...args) {
    const context = this;
    
    // Clear the previous timeout
    const later = function() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      result = func.apply(context, args);
    }
    
    return result;
  };
}

// Enhanced version with cancel and flush
function debounceAdvanced(func, wait, options = {}) {
  let timeout = null;
  let lastArgs = null;
  let lastThis = null;
  let result;
  
  const { leading = false, trailing = true, maxWait } = options;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    
    return maxWait ?
      Math.min(timeWaiting, maxWait - timeSinceLastInvoke) :
      timeWaiting;
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait && timeSinceLastInvoke >= maxWait)
    );
  }
  
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = setTimeout(timerExpired, remainingWait(time));
  }
  
  function trailingEdge(time) {
    timeout = null;
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = null;
    return result;
  }
  
  function cancel() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = null;
    timeout = null;
  }
  
  function flush() {
    return timeout === null ? result : trailingEdge(Date.now());
  }
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        clearTimeout(timeout);
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }
    return result;
  }
  
  debounced.cancel = cancel;
  debounced.flush = flush;
  
  return debounced;
}

// Usage examples
const searchInput = document.getElementById('search');
const log = debounce((value) => {
  console.log('Searching for:', value);
  // API call would go here
}, 300);

searchInput.addEventListener('input', (e) => {
  log(e.target.value);
});

// Immediate execution on first call
const saveSettings = debounce((settings) => {
  console.log('Saving:', settings);
}, 1000, true);
```

### Throttle Implementation
```javascript
/**
 * Throttle: Execute function at most once per specified interval.
 */
function throttle(func, limit) {
  let inThrottle = false;
  let lastFunc;
  let lastRan;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      // First call or enough time has passed
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      // Clear previous timeout
      clearTimeout(lastFunc);
      
      // Set new timeout
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Enhanced throttle with leading and trailing options
function throttleAdvanced(func, wait, options = {}) {
  let timeout = null;
  let previous = 0;
  
  const { leading = true, trailing = true } = options;
  
  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    const context = this;
    
    if (remaining <= 0 || remaining > wait) {
      // Time has passed, execute immediately
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      // Schedule execution for remaining time
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

// Request Animation Frame based throttle (for animations)
function rafThrottle(func) {
  let ticking = false;
  
  return function throttled(...args) {
    const context = this;
    
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(context, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// Usage examples
// Scroll event throttling
window.addEventListener('scroll', throttle(() => {
  console.log('Scrolling at:', window.scrollY);
}, 100));

// Resize event with leading and trailing
window.addEventListener('resize', throttleAdvanced(() => {
  console.log('Window resized:', window.innerWidth);
}, 250, { leading: true, trailing: true }));

// Animation with requestAnimationFrame
const animate = rafThrottle((timestamp) => {
  // Smooth animation logic
  element.style.transform = `translateX(${timestamp % 1000}px)`;
});

function animationLoop() {
  animate(performance.now());
  requestAnimationFrame(animationLoop);
}
animationLoop();
```

### Debounce vs Throttle Comparison

```javascript
// Visual comparison
function logEvent(eventName) {
  console.log(`${eventName} at ${Date.now()}`);
}

const debouncedLog = debounce(() => logEvent('Debounced'), 100);
const throttledLog = throttle(() => logEvent('Throttled'), 100);

// Simulate rapid events
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    debouncedLog();
    throttledLog();
  }, i * 30);
}

// Output:
// Throttled at time X (executes immediately)
// Throttled at time X+100
// Throttled at time X+200
// Debounced at time X+270 (after last event + wait)
```

### Use Cases

#### Debounce Use Cases:
1. **Search inputs**: Wait for user to stop typing
2. **Window resize**: Update layout after resize completes
3. **Form validation**: Validate after user finishes typing
4. **Auto-save**: Save after user stops editing

#### Throttle Use Cases:
1. **Scroll events**: Update UI during scroll
2. **Mouse move**: Track cursor position
3. **Game controls**: Limit button press rate
4. **API rate limiting**: Prevent excessive requests

### Common Interview Questions

**Q: What's the difference between debounce and throttle?**
**A:** Debounce delays execution until after a wait period without new calls. Throttle ensures execution happens at most once per specified interval.

**Q: When would you use debounce vs throttle?**
**A:** Use debounce for events that should trigger after user completes an action (typing, resizing). Use throttle for events that need regular updates during continuous actions (scrolling, mousemove).

**Q: How would you implement debounce with immediate execution option?**
**A:** Add a parameter that executes immediately on first call, then debounces subsequent calls.

---

## Event Loop Deep Explanation

### JavaScript Runtime Model

```
┌───────────────────────────┐
│        Call Stack         │  (LIFO)
│   - Global execution     │
│   - Function calls       │
│   - Synchronous code     │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│        Web APIs           │  (Browser provided)
│   - setTimeout          │
│   - DOM events          │
│   - fetch/XHR           │
│   - etc.                │
└───────────────────────────┘
            ↓ (Callbacks)
┌───────────────────────────┐
│     Task Queue            │  (Callback Queue / Macrotask)
│   - setTimeout callbacks│
│   - I/O callbacks       │
│   - UI rendering        │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Microtask Queue         │  (Job Queue)
│   - Promise callbacks    │
│   - MutationObserver     │
│   - queueMicrotask      │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│      Event Loop           │
│   while (true) {         │
│     if (callStack.empty)│
│       runNextTask()     │
│   }                      │
└───────────────────────────┘
```

### Detailed Event Loop Phases (Node.js)

```javascript
// Node.js Event Loop Phases:
// 1. Timers: setTimeout, setInterval
// 2. Pending callbacks: I/O callbacks deferred to next loop
// 3. Idle, prepare: internal use
// 4. Poll: retrieve new I/O events
// 5. Check: setImmediate callbacks
// 6. Close callbacks: socket.on('close')

// Browser Event Loop:
// 1. Execute a task from task queue
// 2. Execute all microtasks
// 3. Render if needed
// 4. Repeat
```

### Microtasks vs Macrotasks

```javascript
console.log('Script start');

// Macrotask
setTimeout(() => {
  console.log('setTimeout');
}, 0);

// Microtask
Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    
    // Nested microtask
    Promise.resolve()
      .then(() => console.log('Promise 1.1'));
  })
  .then(() => {
    console.log('Promise 2');
  });

// Another macrotask
setTimeout(() => {
  console.log('setTimeout 2');
  
  // Microtask inside macrotask
  Promise.resolve()
    .then(() => console.log('Promise inside setTimeout'));
}, 0);

// Microtask queue continues
queueMicrotask(() => {
  console.log('queueMicrotask');
});

console.log('Script end');

// Output order:
// Script start
// Script end
// Promise 1
// Promise 1.1
// Promise 2
// queueMicrotask
// setTimeout
// setTimeout 2
// Promise inside setTimeout
```

### Render Pipeline Integration

```javascript
// How rendering fits into event loop
function expensiveOperation() {
  // Blocks rendering
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }
}

// Using requestAnimationFrame for smooth animations
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 1;
  
  if (position < 100) {
    requestAnimationFrame(animate); // Syncs with repaint
  }
}

// Using requestIdleCallback for non-critical work
function processBackgroundTasks(deadline) {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    task();
  }
  
  if (tasks.length > 0) {
    requestIdleCallback(processBackgroundTasks);
  }
}

requestIdleCallback(processBackgroundTasks);
```

### Starvation and Prevention

```javascript
// Microtask starvation example (what NOT to do)
function recursiveMicrotask() {
  Promise.resolve().then(() => {
    console.log('Microtask');
    recursiveMicrotask(); // Never yields to macrotasks!
  });
}

// recursiveMicrotask(); // This would block!

// Proper yielding
function processInChunks(array, chunkSize) {
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + chunkSize, array.length);
    
    for (; index < end; index++) {
      // Process array[index]
    }
    
    if (index < array.length) {
      // Yield to event loop
      setTimeout(processChunk, 0);
    }
  }
  
  processChunk();
}
```

### Event Loop in Practice

```javascript
// Understanding execution order
async function asyncExample() {
  console.log('2');
  
  await Promise.resolve();
  console.log('4');
  
  setTimeout(() => console.log('7'), 0);
  
  Promise.resolve()
    .then(() => console.log('5'))
    .then(() => console.log('6'));
}

console.log('1');
asyncExample();
console.log('3');

// Output: 1, 2, 3, 4, 5, 6, 7

// Explanation:
// 1. console.log('1') - sync
// 2. asyncExample() call
// 3. console.log('2') - sync inside async
// 4. await Promise.resolve() - returns promise
// 5. console.log('3') - sync continues
// 6. Microtask: console.log('4')
// 7. Microtask chain: console.log('5'), console.log('6')
// 8. Macrotask: console.log('7')
```

### Node.js vs Browser Event Loop

```javascript
// Node.js specific: setImmediate vs setTimeout
console.log('start');

setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

process.nextTick(() => {
  console.log('nextTick');
});

console.log('end');

// Node.js output:
// start
// end
// nextTick (highest priority microtask in Node)
// Promise
// setTimeout
// setImmediate

// Browser output (if setImmediate existed):
// start
// end
// Promise
// setTimeout
// setImmediate
```

### Common Interview Questions

**Q: Explain the event loop in JavaScript.**
**A:** JavaScript has a single-threaded event loop that processes tasks from the call stack, microtask queue, and task queue. It continuously checks if the call stack is empty, then executes microtasks (Promises) first, followed by one macrotask (setTimeout, events), and repeats.

**Q: What's the difference between microtasks and macrotasks?**
**A:** Microtasks (Promises, queueMicrotask) execute immediately after the current task, before rendering. Macrotasks (setTimeout, events) execute on the next event loop iteration.

**Q: How does async/await work with the event loop?**
**A:** Async functions return promises. The code after `await` is wrapped in a `.then()` callback, making it a microtask.

---

## Deep Clone Implementation

### Shallow vs Deep Clone

```javascript
const original = {
  name: "John",
  address: {
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "gaming"],
  date: new Date(),
  regex: /hello/gi,
  set: new Set([1, 2, 3]),
  map: new Map([["key", "value"]]),
  func: function() { return "hello"; },
  symbol: Symbol("id"),
  infinity: Infinity,
  nan: NaN,
  undefined: undefined,
  null: null
};

// Shallow clone (spread operator)
const shallow = { ...original };
shallow.address.city = "London"; // Affects original!
console.log(original.address.city); // "London"

// Deep clone needed for nested objects
```

### Simple Deep Clone (JSON-based)
```javascript
function deepCloneJSON(obj) {
  // Limitations:
  // - No functions, undefined, Symbol
  // - No circular references
  // - Date becomes string
  // - RegExp, Map, Set not preserved
  return JSON.parse(JSON.stringify(obj));
}

const cloned = deepCloneJSON(original);
cloned.address.city = "Paris";
console.log(original.address.city); // "New York" (unchanged)
```

### Recursive Deep Clone
```javascript
function deepCloneRecursive(obj, hash = new WeakMap()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    const arrCopy = [];
    hash.set(obj, arrCopy);
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepCloneRecursive(obj[i], hash);
    }
    return arrCopy;
  }
  
  // Handle Set
  if (obj instanceof Set) {
    const setCopy = new Set();
    hash.set(obj, setCopy);
    obj.forEach(value => {
      setCopy.add(deepCloneRecursive(value, hash));
    });
    return setCopy;
  }
  
  // Handle Map
  if (obj instanceof Map) {
    const mapCopy = new Map();
    hash.set(obj, mapCopy);
    obj.forEach((value, key) => {
      mapCopy.set(
        deepCloneRecursive(key, hash),
        deepCloneRecursive(value, hash)
      );
    });
    return mapCopy;
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle plain Object
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    const objCopy = {};
    hash.set(obj, objCopy);
    
    // Clone own properties including Symbols
    const allKeys = [
      ...Object.getOwnPropertyNames(obj),
      ...Object.getOwnPropertySymbols(obj)
    ];
    
    for (const key of allKeys) {
      objCopy[key] = deepCloneRecursive(obj[key], hash);
    }
    
    // Preserve prototype
    Object.setPrototypeOf(objCopy, Object.getPrototypeOf(obj));
    
    return objCopy;
  }
  
  // Return other objects (like built-ins) as-is or throw
  return obj;
}

// Usage
const complexObj = {
  arr: [1, 2, { nested: 'object' }],
  date: new Date(),
  set: new Set([1, 2, 3]),
  map: new Map([['key', 'value']]),
  regex: /test/gi,
  [Symbol('id')]: 123,
  func: function() { return this.nested; },
  nested: { deep: 'value' }
};

// Create circular reference
complexObj.circular = complexObj;

const clonedComplex = deepCloneRecursive(complexObj);
console.log(clonedComplex !== complexObj); // true
console.log(clonedComplex.arr !== complexObj.arr); // true
console.log(clonedComplex.circular === clonedComplex); // true (circular preserved)
```

### Structured Clone API (Modern)
```javascript
// Browser API for deep cloning
function deepCloneStructured(obj) {
  // Supported in modern browsers
  // Handles: Array, Object, Date, RegExp, Map, Set, ArrayBuffer, etc.
  // Does NOT handle: Functions, DOM nodes, prototype chain
  return structuredClone(obj);
}

// Polyfill for older browsers
if (typeof structuredClone !== 'function') {
  window.structuredClone = function(obj) {
    // Fallback to custom implementation
    return deepCloneRecursive(obj);
  };
}
```

### Performance Optimized Clone
```javascript
// For large objects, optimize performance
function deepCloneOptimized(obj, options = {}) {
  const {
    maxDepth = 100,
    handleFunctions = false,
    cache = new WeakMap(),
    depth = 0
  } = options;
  
  // Prevent infinite recursion
  if (depth > maxDepth) {
    throw new Error('Maximum clone depth exceeded');
  }
  
  // Return primitives
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Check cache for circular references
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  // Special object types
  const constructor = obj.constructor;
  
  switch (constructor) {
    case Date:
      return new Date(obj.getTime());
    
    case RegExp:
      return new RegExp(obj.source, obj.flags);
    
    case Set: {
      const setCopy = new Set();
      cache.set(obj, setCopy);
      obj.forEach(value => {
        setCopy.add(deepCloneOptimized(value, {
          ...options,
          depth: depth + 1,
          cache
        }));
      });
      return setCopy;
    }
    
    case Map: {
      const mapCopy = new Map();
      cache.set(obj, mapCopy);
      obj.forEach((value, key) => {
        mapCopy.set(
          deepCloneOptimized(key, { ...options, depth: depth + 1, cache }),
          deepCloneOptimized(value, { ...options, depth: depth + 1, cache })
        );
      });
      return mapCopy;
    }
    
    case Array: {
      const arrCopy = new Array(obj.length);
      cache.set(obj, arrCopy);
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = deepCloneOptimized(obj[i], {
          ...options,
          depth: depth + 1,
          cache
        });
      }
      return arrCopy;
    }
    
    default: {
      // Handle plain objects and class instances
      const objCopy = Object.create(Object.getPrototypeOf(obj));
      cache.set(obj, objCopy);
      
      // Get all properties (including non-enumerable)
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (descriptor.value && typeof descriptor.value === 'object') {
          descriptor.value = deepCloneOptimized(descriptor.value, {
            ...options,
            depth: depth + 1,
            cache
          });
        }
        Object.defineProperty(objCopy, key, descriptor);
      }
      
      // Handle Symbol properties
      const symbols = Object.getOwnPropertySymbols(obj);
      for (const symbol of symbols) {
        const value = obj[symbol];
        if (value && typeof value === 'object') {
          objCopy[symbol] = deepCloneOptimized(value, {
            ...options,
            depth: depth + 1,
            cache
          });
        } else {
          objCopy[symbol] = value;
        }
      }
      
      return objCopy;
    }
  }
}
```

### Clone with Function Handling
```javascript
// Clone functions (with limitations)
function cloneFunction(fn) {
  // Note: This doesn't preserve closure scope
  const fnString = fn.toString();
  const argsStart = fnString.indexOf('(') + 1;
  const argsEnd = fnString.indexOf(')');
  const bodyStart = fnString.indexOf('{') + 1;
  const bodyEnd = fnString.lastIndexOf('}');
  
  const args = fnString.substring(argsStart, argsEnd);
  const body = fnString.substring(bodyStart, bodyEnd);
  
  return new Function(args, body);
}

function deepCloneWithFunctions(obj, hash = new WeakMap()) {
  if (typeof obj === 'function') {
    return cloneFunction(obj);
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (hash.has(obj)) return hash.get(obj);
  
  // ... rest of deepCloneRecursive implementation
  // with function handling in object properties
}
```

### Common Interview Questions

**Q: What's the difference between shallow and deep clone?**
**A:** Shallow clone creates a new object but copies references to nested objects. Deep clone creates new copies of all nested objects recursively.

**Q: What are the limitations of JSON.parse(JSON.stringify()) for cloning?**
**A:** It doesn't handle functions, undefined, Symbols, circular references, Date objects (converts to string), RegExp, Map, Set, or class instances.

**Q: How would you handle circular references in deep clone?**
**A:** Use a WeakMap to track visited objects. When encountering an object already in the map, return the cloned reference instead of cloning again.

---

## Promise.all / Promise.race / Promise.any

### Promise.all Implementation
```javascript
// Promise.all: Wait for all promises to resolve, or reject if any fails
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    // Handle non-iterable input
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    
    const results = [];
    let completed = 0;
    const total = promises.length;
    
    // Handle empty array
    if (total === 0) {
      return resolve(results);
    }
    
    for (let i = 0; i < total; i++) {
      // Convert non-promise values to promises
      Promise.resolve(promises[i])
        .then(value => {
          results[i] = value;
          completed++;
          
          if (completed === total) {
            resolve(results);
          }
        })
        .catch(reject); // Reject immediately on any error
    }
  });
};

// Enhanced version with early termination
Promise.myAllSettled = function(promises) {
  return new Promise(resolve => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    
    const results = [];
    let completed = 0;
    const total = promises.length;
    
    if (total === 0) {
      return resolve(results);
    }
    
    const processResult = (index, status, valueOrReason) => {
      results[index] = status === 'fulfilled' ? 
        { status, value: valueOrReason } : 
        { status, reason: valueOrReason };
      
      completed++;
      
      if (completed === total) {
        resolve(results);
      }
    };
    
    for (let i = 0; i < total; i++) {
      Promise.resolve(promises[i])
        .then(
          value => processResult(i, 'fulfilled', value),
          reason => processResult(i, 'rejected', reason)
        );
    }
  });
};

// Usage examples
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.myAll(promises)
  .then(results => console.log(results)) // [1, 2, 3]
  .catch(error => console.error(error));

// With mixed results
const mixedPromises = [
  Promise.resolve('Success 1'),
  Promise.reject('Error 1'),
  Promise.resolve('Success 2')
];

Promise.myAllSettled(mixedPromises)
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 'Success 1' },
    //   { status: 'rejected', reason: 'Error 1' },
    //   { status: 'fulfilled', value: 'Success 2' }
    // ]
  });
```

### Promise.race Implementation
```javascript
// Promise.race: Resolve or reject with first settled promise
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    
    for (const promise of promises) {
      Promise.resolve(promise)
        .then(resolve, reject); // First to settle wins
    }
  });
};

// Promise.any: Resolve with first fulfilled promise, reject if all reject
Promise.myAny = function(promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    
    const errors = [];
    let rejectedCount = 0;
    const total = promises.length;
    
    if (total === 0) {
      return reject(new AggregateError([], 'All promises were rejected'));
    }
    
    for (let i = 0; i < total; i++) {
      Promise.resolve(promises[i])
        .then(resolve) // First success resolves
        .catch(error => {
          errors[i] = error;
          rejectedCount++;
          
          if (rejectedCount === total) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    }
  });
};

// Usage examples
const fast = new Promise(resolve => 
  setTimeout(() => resolve('Fast'), 100)
);
const slow = new Promise(resolve => 
  setTimeout(() => resolve('Slow'), 500)
);

Promise.myRace([fast, slow])
  .then(result => console.log(result)); // "Fast"

// Rejection race
const errorFirst = new Promise((_, reject) => 
  setTimeout(() => reject('Error'), 50)
);

Promise.myRace([fast, errorFirst])
  .then(console.log)
  .catch(error => console.error(error)); // "Error"

// Promise.any example
const failures = [
  Promise.reject('Error 1'),
  Promise.reject('Error 2'),
  Promise.resolve('Success!')
];

Promise.myAny(failures)
  .then(result => console.log(result)) // "Success!"
  .catch(aggregateError => {
    console.error(aggregateError.errors); // ['Error 1', 'Error 2']
  });
```

### Advanced Promise Utilities
```javascript
// Promise.withResolvers (TC39 proposal polyfill)
Promise.withResolvers = function() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

// Promise.try - synchronous errors become rejections
Promise.try = function(fn) {
  return new Promise(resolve => {
    resolve(fn());
  });
};

// Sequential promise execution
Promise.sequence = function(promises) {
  return promises.reduce((chain, promise, index) => {
    return chain.then(results => {
      return Promise.resolve(promise).then(result => {
        results.push(result);
        return results;
      });
    });
  }, Promise.resolve([]));
};

// Parallel with concurrency limit
Promise.map = function(array, mapper, concurrency = Infinity) {
  return new Promise((resolve, reject) => {
    const results = new Array(array.length);
    let index = 0;
    let active = 0;
    let completed = 0;
    let rejected = false;
    
    function next() {
      if (rejected) return;
      
      while (active < concurrency && index < array.length) {
        const currentIndex = index++;
        active++;
        
        Promise.resolve(mapper(array[currentIndex], currentIndex))
          .then(result => {
            results[currentIndex] = result;
          })
          .catch(error => {
            rejected = true;
            reject(error);
          })
          .finally(() => {
            active--;
            completed++;
            
            if (completed === array.length) {
              resolve(results);
            } else {
              next();
            }
          });
      }
    }
    
    if (array.length === 0) {
      resolve(results);
    } else {
      next();
    }
  });
};

// Usage
const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5'];

Promise.map(urls, async (url) => {
  const response = await fetch(url);
  return response.json();
}, 2) // Max 2 concurrent requests
  .then(results => console.log(results));
```

### Promise Patterns and Anti-patterns
```javascript
// Good patterns
async function goodPatterns() {
  // 1. Handle errors properly
  try {
    const result = await somePromise();
  } catch (error) {
    // Handle error
  }
  
  // 2. Run independent promises in parallel
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
  
  // 3. Timeout pattern
  const timeout = (ms) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  
  await Promise.race([fetchData(), timeout(5000)]);
}

// Anti-patterns to avoid
async function antiPatterns() {
  // ❌ Unnecessary await
  const result = await Promise.resolve(42); // Just use Promise.resolve(42)
  
  // ❌ Nested promises
  somePromise().then(result => {
    anotherPromise(result).then(innerResult => {
      // Callback hell in promise form
    });
  });
  
  // ❌ Not returning from then chain
  somePromise()
    .then(result => {
      process(result);
      // Missing return!
    })
    .then(nextResult => {
      // nextResult is undefined!
    });
  
  // ❌ Mixing async/await with .then()
  const result = await somePromise().then(r => r); // Just use await
}
```

### Common Interview Questions

**Q: What's the difference between Promise.all and Promise.allSettled?**
**A:** Promise.all rejects immediately if any promise rejects. Promise.allSettled waits for all promises to settle and returns results for each.

**Q: When would you use Promise.race vs Promise.any?**
**A:** Use Promise.race when you need the first settled promise (could be fulfillment or rejection). Use Promise.any when you need the first fulfilled promise and want to ignore rejections unless all fail.

**Q: How would you implement a timeout for a promise?**
**A:** Use Promise.race with the original promise and a timeout promise that rejects after a delay.

---

## Creating a Mini Redux Store

### Core Redux Concepts

```javascript
// Redux three principles:
// 1. Single source of truth (store)
// 2. State is read-only (actions)
// 3. Changes are made with pure functions (reducers)
```

### Basic Store Implementation
```javascript
function createStore(reducer, preloadedState, enhancer) {
  // Handle enhancer middleware
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function');
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  
  let currentState = preloadedState;
  let currentReducer = reducer;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;
  
  // Ensure listeners can be safely modified during dispatch
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  
  function getState() {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing.'
      );
    }
    return currentState;
  }
  
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function');
    }
    
    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing.'
      );
    }
    
    let isSubscribed = true;
    
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      
      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing.'
        );
      }
      
      isSubscribed = false;
      
      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  
  function dispatch(action) {
    if (typeof action !== 'object') {
      throw new Error('Actions must be plain objects.');
    }
    
    if (typeof action.type === 'undefined') {
      throw new Error('Actions must have a type property.');
    }
    
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }
    
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    
    const listeners = currentListeners = nextListeners;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
    
    return action;
  }
  
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function');
    }
    
    currentReducer = nextReducer;
    dispatch({ type: '@@redux/INIT' });
  }
  
  // Initialize state
  dispatch({ type: '@@redux/INIT' });
  
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  };
}
```

### Middleware Implementation
```javascript
// applyMiddleware implementation
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed.'
      );
    };
    
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    
    return {
      ...store,
      dispatch
    };
  };
}

// Compose utility
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  
  if (funcs.length === 1) {
    return funcs[0];
  }
  
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// Logger middleware example
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('Previous state:', store.getState());
  console.log('Action:', action);
  
  const result = next(action);
  
  console.log('Next state:', store.getState());
  console.groupEnd();
  
  return result;
};

// Thunk middleware for async actions
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  
  return next(action);
};
```

### Reducer Utilities
```javascript
// combineReducers implementation
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  
  // Filter out non-function reducers
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  
  const finalReducerKeys = Object.keys(finalReducers);
  
  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      
      if (typeof nextStateForKey === 'undefined') {
        throw new Error(`Reducer "${key}" returned undefined`);
      }
      
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    
    return hasChanged ? nextState : state;
  };
}

// Redux Toolkit style createSlice
function createSlice(options) {
  const { name, initialState, reducers } = options;
  
  const actions = {};
  const caseReducers = {};
  
  Object.keys(reducers).forEach(reducerName => {
    const reducer = reducers[reducerName];
    caseReducers[reducerName] = reducer;
    actions[reducerName] = (payload) => ({
      type: `${name}/${reducerName}`,
      payload
    });
  });
  
  function sliceReducer(state = initialState, action) {
    const { type } = action;
    
    if (type.startsWith(`${name}/`)) {
      const reducerName = type.slice(name.length + 1);
      const reducer = caseReducers[reducerName];
      
      if (reducer) {
        return reducer(state, action);
      }
    }
    
    return state;
  }
  
  return {
    name,
    reducer: sliceReducer,
    actions
  };
}
```

### Complete Example Usage
```javascript
// Define action types
const ActionTypes = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER'
};

// Action creators
const addTodo = (text) => ({
  type: ActionTypes.ADD_TODO,
  payload: { text }
});

const toggleTodo = (id) => ({
  type: ActionTypes.TOGGLE_TODO,
  payload: { id }
});

// Reducer
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      return [
        ...state,
        {
          id: state.length + 1,
          text: action.payload.text,
          completed: false
        }
      ];
    
    case ActionTypes.TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    
    default:
      return state;
  }
};

// Create store with middleware
const store = createStore(
  combineReducers({
    todos: todosReducer
  }),
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

// Usage
store.dispatch(addTodo('Learn Redux'));
store.dispatch(addTodo('Build something'));

console.log(store.getState());
// {
//   todos: [
//     { id: 1, text: 'Learn Redux', completed: false },
//     { id: 2, text: 'Build something', completed: false }
//   ]
// }

store.dispatch(toggleTodo(1));

// Subscribe to changes
const unsubscribe = store.subscribe(() => {
  console.log('State updated:', store.getState());
});
```

### React Integration Example
```javascript
// React context provider for Redux store
const ReduxContext = React.createContext();

function Provider({ store, children }) {
  const [state, setState] = React.useState(store.getState());
  
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    
    return unsubscribe;
  }, [store]);
  
  return (
    <ReduxContext.Provider value={{ store, state }}>
      {children}
    </ReduxContext.Provider>
  );
}

// Custom hook to use Redux store
function useRedux() {
  const context = React.useContext(ReduxContext);
  
  if (!context) {
    throw new Error('useRedux must be used within a Provider');
  }
  
  const { store, state } = context;
  
  const dispatch = React.useCallback((action) => {
    return store.dispatch(action);
  }, [store]);
  
  return [state, dispatch];
}

// Selector hook
function useSelector(selector) {
  const { state } = React.useContext(ReduxContext);
  return selector(state);
}

function useDispatch() {
  const { store } = React.useContext(ReduxContext);
  return store.dispatch;
}
```

### Common Interview Questions

**Q: What are the three principles of Redux?**
**A:** 1) Single source of truth, 2) State is read-only, 3) Changes are made with pure functions (reducers).

**Q: How does middleware work in Redux?**
**A:** Middleware sits between dispatching an action and the reducer. It receives the store's dispatch and getState methods, and can intercept, modify, or dispatch new actions.

**Q: What's the difference between Redux and Context API?**
**A:** Redux provides predictable state management with middleware, time-travel debugging, and devtools. Context is simpler but can cause unnecessary re-renders without careful optimization.

---

## Implementing Your Own EventEmitter

### Basic EventEmitter Implementation
```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;
  }
  
  // Add listener
  on(eventName, listener, options = {}) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const listeners = this.events.get(eventName);
    
    // Check for max listeners
    if (listeners.length >= this.maxListeners && !this._warned) {
      console.warn(`Possible memory leak detected. ${listeners.length} listeners added for event "${eventName}". Use emitter.setMaxListeners() to increase limit.`);
      this._warned = true;
    }
    
    const listenerObj = {
      fn: listener,
      once: options.once || false,
      prepend: options.prepend || false
    };
    
    if (options.prepend) {
      listeners.unshift(listenerObj);
    } else {
      listeners.push(listenerObj);
    }
    
    return this;
  }
  
  // Add one-time listener
  once(eventName, listener) {
    return this.on(eventName, listener, { once: true });
  }
  
  // Prepend listener
  prependListener(eventName, listener) {
    return this.on(eventName, listener, { prepend: true });
  }
  
  // Prepend one-time listener
  prependOnceListener(eventName, listener) {
    return this.on(eventName, listener, { once: true, prepend: true });
  }
  
  // Remove listener
  off(eventName, listener) {
    if (!this.events.has(eventName)) {
      return this;
    }
    
    const listeners = this.events.get(eventName);
    
    if (!listener) {
      // Remove all listeners for this event
      this.events.delete(eventName);
      return this;
    }
    
    // Find and remove specific listener
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i].fn === listener) {
        listeners.splice(i, 1);
      }
    }
    
    // Clean up empty arrays
    if (listeners.length === 0) {
      this.events.delete(eventName);
    }
    
    return this;
  }
  
  // Emit event
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) {
      // Return false if no listeners
      if (eventName === 'error' && !this.events.has('error')) {
        throw new Error('Unhandled error event');
      }
      return false;
    }
    
    const listeners = this.events.get(eventName);
    const onceListeners = [];
    
    // Call all listeners
    for (let i = 0; i < listeners.length; i++) {
      const listenerObj = listeners[i];
      
      try {
        listenerObj.fn.apply(this, args);
      } catch (error) {
        // Emit error event if listener throws
        this.emit('error', error);
      }
      
      if (listenerObj.once) {
        onceListeners.push(listenerObj.fn);
      }
    }
    
    // Remove once listeners
    onceListeners.forEach(listener => {
      this.off(eventName, listener);
    });
    
    return true;
  }
  
  // Get all listeners for an event
  listeners(eventName) {
    if (!this.events.has(eventName)) {
      return [];
    }
    
    return this.events.get(eventName).map(obj => obj.fn);
  }
  
  // Get listener count
  listenerCount(eventName) {
    if (!this.events.has(eventName)) {
      return 0;
    }
    
    return this.events.get(eventName).length;
  }
  
  // Remove all listeners or for specific event
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
    
    return this;
  }
  
  // Set maximum listeners
  setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
      throw new TypeError('n must be a positive number');
    }
    
    this.maxListeners = n;
    return this;
  }
  
  // Get maximum listeners
  getMaxListeners() {
    return this.maxListeners;
  }
  
  // Event names
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  // Raw listeners (including once status)
  rawListeners(eventName) {
    if (!this.events.has(eventName)) {
      return [];
    }
    
    return this.events.get(eventName).slice();
  }
}
```

### Advanced Features
```javascript
class AdvancedEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.asyncEvents = new Set();
  }
  
  // Async event emission with await
  async emitAsync(eventName, ...args) {
    if (!this.events.has(eventName)) {
      return [];
    }
    
    const listeners = this.events.get(eventName);
    const results = [];
    const onceListeners = [];
    
    for (const listenerObj of listeners) {
      try {
        const result = await listenerObj.fn.apply(this, args);
        results.push(result);
      } catch (error) {
        this.emit('error', error);
        results.push(Promise.reject(error));
      }
      
      if (listenerObj.once) {
        onceListeners.push(listenerObj.fn);
      }
    }
    
    // Clean up once listeners
    onceListeners.forEach(listener => {
      this.off(eventName, listener);
    });
    
    return results;
  }
  
  // Wait for event (returns a promise)
  waitFor(eventName, timeout = 0) {
    return new Promise((resolve, reject) => {
      let timeoutId;
      
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          this.off(eventName, listener);
          reject(new Error(`Timeout waiting for event "${eventName}"`));
        }, timeout);
      }
      
      const listener = (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(args.length <= 1 ? args[0] : args);
      };
      
      this.once(eventName, listener);
    });
  }
  
  // Pipe events to another emitter
  pipe(eventName, targetEmitter, targetEventName = eventName) {
    return this.on(eventName, (...args) => {
      targetEmitter.emit(targetEventName, ...args);
    });
  }
  
  // Forward events from another emitter
  forward(sourceEmitter, eventName, targetEventName = eventName) {
    return sourceEmitter.on(eventName, (...args) => {
      this.emit(targetEventName, ...args);
    });
  }
  
  // Debounced event emission
  debouncedEmit(eventName, wait) {
    let timeout;
    let lastArgs;
    
    return (...args) => {
      lastArgs = args;
      
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(() => {
        this.emit(eventName, ...lastArgs);
        timeout = null;
      }, wait);
    };
  }
  
  // Throttled event emission
  throttledEmit(eventName, limit) {
    let lastCall = 0;
    let timeout;
    let lastArgs;
    
    return (...args) => {
      const now = Date.now();
      lastArgs = args;
      
      if (now - lastCall >= limit) {
        // Enough time has passed
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        
        this.emit(eventName, ...args);
        lastCall = now;
      } else if (!timeout) {
        // Schedule for remaining time
        timeout = setTimeout(() => {
          this.emit(eventName, ...lastArgs);
          timeout = null;
          lastCall = Date.now();
        }, limit - (now - lastCall));
      }
    };
  }
}
```

### Use Cases and Examples
```javascript
// Example 1: Basic usage
const emitter = new EventEmitter();

// Add listeners
emitter.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

emitter.once('connect', () => {
  console.log('Connected!');
});

// Emit events
emitter.emit('connect'); // Logs: Connected!
emitter.emit('connect'); // No output (once listener removed)

emitter.emit('data', 'Hello'); // Logs: Received chunk: Hello
emitter.emit('data', 'World'); // Logs: Received chunk: World

// Example 2: Error handling
emitter.on('error', (error) => {
  console.error('Emitter error:', error.message);
});

// This will trigger error event
emitter.on('test', () => {
  throw new Error('Something went wrong');
});

emitter.emit('test'); // Logs: Emitter error: Something went wrong

// Example 3: Async events
const asyncEmitter = new AdvancedEventEmitter();

asyncEmitter.on('process', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return data * 2;
});

asyncEmitter.on('process', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return data + 10;
});

asyncEmitter.emitAsync('process', 5)
  .then(results => {
    console.log('All processed:', results); // [10, 15]
  });

// Example 4: Wait for event
async function exampleWait() {
  setTimeout(() => {
    emitter.emit('ready', { status: 'ok' });
  }, 1000);
  
  const result = await emitter.waitFor('ready', 2000);
  console.log('Ready with:', result); // { status: 'ok' }
}

// Example 5: Event piping
const source = new EventEmitter();
const target = new EventEmitter();

source.pipe('update', target);

target.on('update', (data) => {
  console.log('Target received update:', data);
});

source.emit('update', { version: '1.0' }); // Logs: Target received update: { version: '1.0' }
```

### Performance Optimized Version
```javascript
class PerformanceEventEmitter {
  constructor() {
    this._events = Object.create(null);
    this._maxListeners = 10;
    this._count = 0;
  }
  
  on(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    
    let events = this._events[eventName];
    
    if (!events) {
      events = this._events[eventName] = [];
      this._count++;
    }
    
    // Performance optimization: inline listener properties
    const listenerWrapper = {
      fn: listener,
      next: null
    };
    
    if (events.length === 0) {
      events[0] = listenerWrapper;
    } else {
      let current = events[0];
      while (current.next) {
        current = current.next;
      }
      current.next = listenerWrapper;
    }
    
    // Check max listeners
    if (events.length > this._maxListeners && !this._warned) {
      console.warn(`Max listeners (${this._maxListeners}) exceeded for event "${eventName}"`);
      this._warned = true;
    }
    
    return this;
  }
  
  emit(eventName, ...args) {
    const events = this._events[eventName];
    
    if (!events || events.length === 0) {
      return false;
    }
    
    // Fast iteration using linked list
    let current = events[0];
    while (current) {
      try {
        current.fn.apply(this, args);
      } catch (err) {
        // Handle errors
        if (eventName !== 'error') {
          this.emit('error', err);
        }
      }
      current = current.next;
    }
    
    return true;
  }
  
  // ... other methods optimized similarly
}
```

### Common Interview Questions

**Q: How does Node.js EventEmitter differ from DOM EventTarget?**
**A:** Node.js EventEmitter supports multiple listeners per event, custom events, once listeners, and emitter methods. DOM EventTarget is simpler and browser-focused.

**Q: What are memory leaks in EventEmitter and how to prevent them?**
**A:** Memory leaks occur when listeners aren't removed. Prevent by: 1) Using once() for one-time events, 2) Always removing listeners when done, 3) Setting maxListeners, 4) Using weak references in advanced implementations.

**Q: How would you implement event bubbling/capturing in EventEmitter?**
**A:** Add parent/child relationships between emitters and implement emit methods that propagate events up or down the hierarchy with option to stop propagation.

---

## 🎯 Interview Practice Questions

1. **Explain how JavaScript's event loop works with an example of setTimeout, Promise, and async/await.**

2. **Implement a deep clone function that handles circular references and special objects like Date, RegExp, Map, and Set.**

3. **Write a debounce function that supports immediate execution and cancellation.**

4. **Implement Promise.all from scratch with proper error handling.**

5. **Create a mini Redux store with middleware support and combineReducers utility.**

6. **Design an EventEmitter class with once(), prependListener(), and removeAllListeners() methods.**

7. **Explain the difference between compile-time and runtime in JavaScript with examples.**

8. **Write polyfills for Array.prototype.map, Function.prototype.bind, and Object.assign.**

9. **How would you prevent UI freezing when processing a large array? Implement a solution.**

10. **Compare and contrast synchronous vs asynchronous JavaScript patterns (callbacks, promises, async/await).**

## 📚 Additional Resources

### Books
- "You Don't Know JS" series by Kyle Simpson
- "JavaScript: The Definitive Guide" by David Flanagan
- "Eloquent JavaScript" by Marijn Haverbeke

### Articles & Documentation
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript Event Loop Explained](https://javascript.info/event-loop)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [V8 Blog](https://v8.dev/blog)

### Tools for Practice
- [JavaScript Visualizer](https://www.jsv9000.app/)
- [Loupe (Event Loop Visualization)](http://latentflip.com/loupe/)
- [ES6 Compatibility Table](https://kangax.github.io/compat-table/es6/)

### Interview Platforms
- [LeetCode](https://leetcode.com/)
- [HackerRank](https://www.hackerrank.com/)
- [Frontend Interview Handbook](https://www.frontendinterviewhandbook.com/)

---

**Remember**: Understanding these concepts deeply is more important than memorizing implementations. Practice explaining them in your own words, draw diagrams, and build small projects using these patterns. Good luck with your interviews!