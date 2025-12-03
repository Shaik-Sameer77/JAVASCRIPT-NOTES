# JavaScript Engine & Event Loop: Complete Guide

## Core Concept: JavaScript is Single-Threaded

JavaScript executes **one piece of code at a time** because:

- It has **one Call Stack**
- It executes **one line at a time**
- Avoids race conditions and thread complications
- Async features (Promises, async/await, setTimeout) enable non-blocking operations

---

## How JavaScript Executes Code

### 🔵 Phase 1 — Memory Creation Phase (Hoisting)

**Before any code runs:**

- `var` variables: allocated with `undefined`
- `let`/`const` variables: allocated but not initialized (Temporal Dead Zone)
- Function declarations: fully stored in memory
- **No code execution** — only memory allocation

### 🔴 Phase 2 — Execution Phase

**Line-by-line execution:**

- Values are assigned
- Functions are executed
- Closures form
- Scope chain is referenced

---

## Key Components of JavaScript Runtime

### 1. Call Stack

- Executes synchronous code (LIFO - Last In, First Out)
- **Process:** push → execute → pop
- Stack overflow occurs with infinite recursion

### 2. Memory Heap

- Stores objects, arrays, closures, functions
- Dynamic memory allocation area

### 3. Web APIs / Node APIs

**Provided by browser/Node.js:**

- `setTimeout`, `setInterval`
- DOM events (click, scroll)
- `fetch()`, HTTP requests
- File system access (Node)
- These run in background, return results to queues

### 4. Task Queue (Macro Task Queue)

**Contains callbacks from:**

- `setTimeout`, `setInterval`
- DOM events
- I/O events
- Runs **after** microtasks

### 5. Microtask Queue (Higher Priority)

**Contains callbacks from:**

- Promises (`.then`, `.catch`, `.finally`)
- `queueMicrotask()`
- `MutationObserver`
- **Priority:** Runs **before** macrotasks

### 6. Event Loop (The Coordinator)

**Algorithm:**

1. Check if Call Stack is empty
2. If empty → drain **all** microtasks
3. If microtasks empty → run **one** macrotask
4. Repeat forever

---

## Execution Order Examples

### Example 1: Basic Order

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
// Output: A → C → B
```

### Example 2: Microtask Priority

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// Output: A → D → C → B
// Why: C (microtask) runs before B (macrotask)
```

### Example 3: Nested Microtasks

```javascript
Promise.resolve().then(() => {
  console.log("A");
  Promise.resolve().then(() => console.log("B"));
});
console.log("C");
// Output: C → A → B
```

---

## Critical Concepts

### 1. Why Promises Run Before setTimeout

- Promises → **Microtask Queue**
- Timers → **Task Queue**
- Event Loop prioritizes microtasks

### 2. JavaScript is Non-Blocking

- Long tasks are moved to Web APIs
- Executed asynchronously via event loop
- Main thread remains responsive

### 3. Microtask Starvation

```javascript
function loop() {
  Promise.resolve().then(loop);
}
loop();
// setTimeouts/UI events never run!
```

**Problem:** Microtasks keep spawning → macrotasks starve → UI freezes

### 4. `async/await` Behavior

```javascript
async function test() {
  console.log("1");
  await Promise.resolve(); // Pauses here
  console.log("2"); // Runs as microtask
}
console.log("3");
test();
console.log("4");
// Output: 3 → 1 → 4 → 2
```

---

## Practical Interview Questions

### Q1: How to prevent UI freezing during heavy operations?

**Solutions:**

- Use Web Workers for CPU-intensive tasks
- Break computations into chunks with `setTimeout`
- Use `requestIdleCallback()` for low-priority work
- Implement async processing with Promises

### Q2: Difference between Call Stack and Event Loop?

- **Call Stack:** Executes synchronous code
- **Event Loop:** Coordinates async operations, moves tasks from queues to stack

### Q3: What happens during `await`?

- Function pauses execution
- Continuation scheduled as microtask
- **Does NOT block main thread**

---

## Practice Problems

### Easy

1. **Predict Output:**

```javascript
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end");
// Answer: start → end → promise → timeout
```

### Medium

2. **Implement `sleep()` function:**

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Usage: await sleep(1000);
```

### Hard (Senior Level)

3. **Custom Scheduler:**

```javascript
class Scheduler {
  constructor() {
    this.microQ = [];
    this.taskQ = [];
  }

  scheduleMicro(fn) {
    this.microQ.push(fn);
    Promise.resolve().then(() => {
      while (this.microQ.length) this.microQ.shift()();
      if (this.taskQ.length) setTimeout(() => this.taskQ.shift()(), 0);
    });
  }

  scheduleTask(fn) {
    this.taskQ.push(fn);
  }
}
```

4. **Chunk Processing for Heavy Operations:**

```javascript
function chunkProcess(items, processFn, chunkSize = 100) {
  let i = 0;
  function doChunk() {
    const end = Math.min(i + chunkSize, items.length);
    for (; i < end; i++) processFn(items[i], i);
    if (i < items.length) setTimeout(doChunk, 0);
  }
  doChunk();
}
```

---

## Real-World Applications

### Video Streaming (Hotstar/Netflix)

- Buffer handling via async tasks
- Promise-based segment fetching
- Web Workers for video decoding
- Avoid blocking main thread for UI responsiveness

### Payment Processing (Razorpay/Paytm)

- Microtask starvation awareness
- Ensure UI events process during transactions
- Use requestAnimationFrame for smooth animations

### Food Delivery (Swiggy/Zomato)

- Async API polling for order updates
- WebSocket connections for real-time tracking
- Background sync for offline capabilities

---

## Key Takeaways

1. **Execution Order:** Sync code → All microtasks → One macrotask → Repeat
2. **Priority:** Microtasks > Macrotasks
3. **Non-blocking:** Achieved via event loop + Web APIs
4. **Starvation:** Infinite microtasks block UI events
5. **Performance:** Move heavy work to Workers or chunk processing

---

## Quick Reference

| Component           | Purpose              | Examples                 |
| ------------------- | -------------------- | ------------------------ |
| **Call Stack**      | Execute sync code    | Function calls           |
| **Microtask Queue** | High-priority async  | Promises, queueMicrotask |
| **Macrotask Queue** | Regular async        | setTimeout, DOM events   |
| **Event Loop**      | Coordinate execution | Checks stack → queues    |

**Golden Rule:** When Call Stack empties → drain all microtasks → run one macrotask → render → repeat.
