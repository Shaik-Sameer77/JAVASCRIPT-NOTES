// ⭐1. JavaScript Is Single-Threaded

// JavaScript can execute only one piece of code at a time because:

// It has one Call Stack

// It executes one line at a time

// It avoids race conditions and thread complications
// That’s why async features exist (Promises, async/await, setTimeout).

// ⭐ 2. How the JavaScript Engine Executes Code (Step-by-Step)

// Every JS program runs in two phases:

// 🔵 PHASE 1 — Memory Creation Phase (Hoisting Phase)

// Before executing the code:

// Variables are allocated memory

// var → initialized with undefined

// let, const → allocated but not initialized (TDZ)

// Function declarations → fully stored in memory

// No code runs here — only structure is prepared.

// 🔴 PHASE 2 — Execution Phase (Line-by-Line)

// During this:

// Actual code runs

// Values are assigned

// Functions get executed

// Closures form

// Scope chain is referenced

// ⭐ 3. The Call Stack

// The Call Stack executes synchronous code:

// 1. push -> execute -> pop
// 2. push -> execute -> pop


// If your JS code is:

console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");


// Order is: A → C → B

// Why?

// Because setTimeout is NOT executed by JS — it’s executed by Web APIs.

// ⭐ 4. Memory Heap

// All objects, arrays, closures, functions are stored in the heap.

// Heap = dynamic memory allocation area.

// ⭐ 5. Web APIs / Node APIs

// Browser or Node.js provides features that JS alone cannot:

// setTimeout

// setInterval

// DOM events (click, scroll)

// fetch()

// HTTP requests

// File system access (Node)

// Crypto APIs

// JS calls them → they run in background → they return results to queues.

// ⭐ 6. Task Queue (Macro Task Queue)

// Contains callbacks from:

// setTimeout

// setInterval

// DOM events

// I/O events

// MessageChannel

// These run after microtasks.

// ⭐ 7. Microtask Queue (Higher Priority)

// Contains callbacks from:

// Promises

// queueMicrotask()

// MutationObserver

// This queue has higher priority than macro tasks.

// ⭐ 8. Event Loop (Brain of JavaScript)

// Its job:

// ✔ Check if Call Stack is empty
// ✔ If empty → push Microtasks first
// ✔ If Microtasks empty → push Macrotasks
// ✔ Repeat forever

// This is why:

console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");

// Output:

// A
// D
// C   // microtask
// B   // macrotask

// 🚨 PART 2 — SENIOR LEVEL TRICK QUESTIONS

// (Companies love these)

// ❓ Q1: Why does Promise.then() execute before setTimeout?

// Because:

// Promises → Microtask Queue

// Timers → Task Queue
// Event Loop prioritizes Microtasks.

// ❓ Q2: Explain the difference between Call Stack and Event Loop.

// Call Stack executes synchronous code.
// Event Loop coordinates async operations and moves tasks from queues → stack.

// ❓ Q3: Why is JavaScript called non-blocking?

// Because long tasks are moved to Web APIs and executed asynchronously.

// ❓ Q4: What happens if the microtask queue never becomes empty?

// E.g.:
function loop() {
  Promise.resolve().then(loop);
}
loop();

// 👉 JS starves the Task Queue
// 👉 Browser may freeze
// 👉 Affects performance

// This tests deep understanding.

// ❓ Q5: What is starvation?

// When microtasks run infinitely, macrotasks never get chance.

// 🚀 PART 3 — Real-Life Scenario Questions (Senior Developers)
// 🟢 Scenario 1: Swiggy/Zomato

// “How will you ensure UI does not freeze during heavy API polling?”

// Expected Answer:

// Use async functions

// Move computation to WebWorkers

// Break long loops with setTimeout()

// Use requestIdleCallback

// 🟢 Scenario 2: Hotstar / Amazon

// “How will you design the video player to avoid UI lag?”

// Expected:

// Buffers handled by async tasks

// Promise-based fetch segments

// Use Web Workers for decoding

// Avoid blocking main thread

// 🟢 Scenario 3: Razorpay / Paytm

// “If a Promise keeps generating microtasks, what happens to user interactions?”

// Expected:

// Browser event callbacks sit in task queue

// Microtasks keep executing

// UI events freeze

// App becomes unresponsive

// 🚀 PART 4 — Interview Trick Snippets (Must Memorize)
// 🔥 SNIPPET 1 — Classic Microtask vs Task Trap

console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => console.log(3));

console.log(4);

// Output:

// 1
// 4
// 3
// 2

// 🔥 SNIPPET 2 — Nested Promises
Promise.resolve().then(() => {
  console.log("A");
  Promise.resolve().then(() => console.log("B"));
});
console.log("C");

// Output:
// C
// A
// B

// 🔥 SNIPPET 3 — Event Loop with async/await

async function test() {
  console.log("1");
  await Promise.resolve();
  console.log("2");
}

console.log("3");
test();
console.log("4");

// Output:

// 3
// 1
// 4
// 2

// 🔥 SNIPPET 4 — setTimeout inside Promise
Promise.resolve().then(() => {
  console.log("A");
  setTimeout(() => console.log("B"), 0);
});
console.log("C");


// Output:

// C
// A
// B

// 🔥 SNIPPET 5 — Event Loop Hell
setTimeout(() => console.log("MACRO"), 0);

Promise.resolve().then(() => {
  console.log("MICRO");
  Promise.resolve().then(() => console.log("MICRO2"));
});


// Output:

// MICRO
// MICRO2
// MACRO

// 4️⃣ Callback Hell vs Event Loop

setTimeout(() => {
  console.log("outer");
}, 0);

Promise.resolve().then(() => {
  setTimeout(() => console.log("inner"), 0);
});

// 7️⃣ Web API callback execution
document.body.addEventListener("click", () => console.log("click"));
Promise.resolve().then(() => console.log("promise"));
console.log("script");

// 9️⃣ MutationObserver Microtask
const obs = new MutationObserver(() => console.log("mutation"));
document.body.innerHTML = "hi";
console.log("end");

// 🔧 Quick recap: JS engine & runtime pieces

// Single-threaded JS — one main thread for JS execution.

// Call stack — runs synchronous code (LIFO).

// Memory heap — where objects are allocated.

// Browser/runtime provides:

// Web APIs: timers, fetch, DOM events, XHR, setImmediate (node), etc.

// Callback (task/macrotask) queue: timers, I/O callbacks, events.

// Microtask queue: Promise callbacks (.then/.catch/.finally), queueMicrotask, async/await continuations.

// Event loop: repeatedly checks call stack; when empty, first drains microtasks, then runs one macrotask, then repeats.

// Order: sync code → microtasks (all) → one macrotask → render (browser) → repeat.

// 🚀 PART 5 — 15 Problems to Practice (Interview-Level)
// EASY
// 1) Explain event loop with an example

// Concept(short):
// Event loop coordinates execution between the call stack and task queues so single - threaded JavaScript can handle asynchronous events without blocking.

// Concrete explanation:

// JS runs all synchronous code on the call stack.

// When async work is scheduled(e.g.setTimeout, fetch, Promise), the runtime handles the async operation and when it's done the callback is queued.

// When the call stack is empty, the event loop:

// drains the microtask queue(Promises) fully,

//   then processes a single macrotask(setTimeout, I / O),

//     then allows the browser to do layout / paint, then repeats.

// Minimal example(and explanation of order):

console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

console.log('end');


// Output:

// start
// end
// promise
// timeout


// Why: start / end sync → microtask(promise) runs before macrotask(timeout).

// Interview answer script:
// “JavaScript runs on a single thread.The event loop checks the call stack; when empty it runs all pending microtasks(Promises, queueMicrotask) then executes one macrotask(timers, I / O), renders, and repeats.So microtasks always have priority over macrotasks — that’s why Promise.then runs before setTimeout(..., 0).”

// 2) Predict output of setTimeout + Promise code

// Example:

console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');


// Output:

// A
// D
// C
// B


// Why: sync A / D → microtask C → macrotask B.

// Interview script: say the lines then explain microtask vs macrotask ordering.

// 3) Explain difference between microtask & macrotask

// Microtask(short):

// Priority queue that is drained completely after current task completes.

//   Examples: Promise callbacks, queueMicrotask, async / await continuations.

//     Macrotask(task)(short):

// Regular task queue: timers, I / O callbacks, UI events.

// One macrotask is processed, then microtasks are drained before next macrotask.

// Important rule: microtasks run before next macrotask and before rendering.

// Interview script: “Microtasks are higher - priority asynchronous callbacks(promises) that are drained fully once the current stack empties.Macrotasks include timers and events and are scheduled after microtasks.”

// 4) Why is JavaScript single - threaded ?

//   Concept :
//   Language runtime design — originally for UI scripting in browsers so code runs on a single main thread to avoid race conditions manipulating DOM.Concurrency is achieved by asynchronous non - blocking I / O coordinated by the event loop and background threads inside the runtime(browser / C++ threadpool or Node libuv) — not by multiple JS threads.

// Interview script: “JS itself runs single - threaded for deterministic access to shared mutable state(especially DOM).Concurrency is provided by asynchronous callbacks and background workers in the host environment(Web APIs / libuv) — enabling non - blocking I / O without multi - threaded JS state.”

// 5) What is call stack overflow ?

//   Concept :
//   When too many nested function calls push beyond the call stack limit(e.g., infinite recursion).Browser / Node throws RangeError: Maximum call stack size exceeded.

//     Example:

function recurse() { recurse(); }
recurse(); // causes call stack overflow


// How to answer in interview: define it, show small example, say remedies: convert recursion to iteration, use tail recursion(where supported), or use chunked / asynchronous processing.

//   MEDIUM
// 6) Implement a function that delays execution using Promises

// Goal: delay(ms).then(() => ...)

// Implementation:

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// usage
delay(500).then(() => console.log('500ms passed'));


// Interview script: show code and explain it creates a Promise that resolves after a timer(macrotask).

// 7) Implement sleep(ms) using async/await

// Implementation:

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function example() {
  console.log('before');
  await sleep(1000);
  console.log('after 1s');
}
example();


// Note: await yields control; it doesn’t block JS thread.

// Interview script: “Use Promise + setTimeout and await it.await schedules continuation as a microtask.”

// 8) Explain starvation with a code example

// Starvation: a lower - priority task never runs because higher - priority tasks keep being scheduled.In JS the classic example is microtask starvation: if you keep scheduling microtasks from microtasks, macrotasks(like timers) never get to run.

//   Example(microtask starvation):

let i = 0;

function spamMicrotask() {
  Promise.resolve().then(() => {
    i++;
    if (i < 1e6) spamMicrotask(); // keeps scheduling microtasks
  });
}

setTimeout(() => console.log('macrotask ran'), 0);

spamMicrotask();


// Here the setTimeout callback may be delayed because microtasks keep getting queued — effectively starving macrotasks and rendering.

// Interview script: explain that microtasks are drained fully; if they spawn more microtasks indefinitely, lower - priority tasks and rendering can starve.

// 9) Predict output: nested async / await + setTimeout

// Code:

console.log('1');

setTimeout(() => console.log('2'), 0);

(async function () {
  console.log('3');
  await Promise.resolve();
  console.log('4');
})();

console.log('5');


// Output reasoning:

// Sync: 1

// schedule macrotask for '2'

// enter async IIFE: logs 3, await Promise.resolve() queues continuation as microtask

// Sync: log 5

// microtask: log 4

// macrotask: log 2

// Final output:

// 1
// 3
// 5
// 4
// 2


// Interview script: step through sync → microtasks → macrotask.

// 10) Explain what happens if you run heavy loops in the main thread

// Answer:
// Heavy synchronous computations block the call stack — JS cannot process events, handle user interactions, or run timers.UI freezes, animations stutter, and input is unresponsive.For web UIs this leads to poor UX and watchdogs may kill long tasks.

// Mitigation strategies(short):

// Move heavy work to Web Workers(browser) or worker threads(Node).

// Chunk the work into smaller pieces and schedule via setTimeout / requestAnimationFrame / requestIdleCallback.

// Use streaming / incremental algorithms, or offload to server / WASM.

// Interview script: define blocking, show example, list solutions.

//   HARD(SENIOR LEVEL)
// 11) Build a custom scheduler that prioritizes microtasks

// Goal: Provide a small scheduler API that takes high - priority(microtask - like) and low - priority(task - like) jobs and schedules them with correct ordering.

// Key idea: Use Promise.resolve().then(...) for microtasks and setTimeout(..., 0) for macrotask fallback.

//   Implementation:

  class Scheduler {
    constructor() {
      this.microQ = [];
      this.taskQ = [];
      this.running = false;
    }

    scheduleMicro(fn) {
      this.microQ.push(fn);
      this._ensureFlush();
    }

    scheduleTask(fn) {
      this.taskQ.push(fn);
      this._ensureFlush();
    }

    _ensureFlush() {
      if (!this.running) {
        this.running = true;
        // Kick off: microtask flush
        Promise.resolve().then(() => this._flushMicro());
      }
    }

    _flushMicro() {
      while (this.microQ.length) {
        const fn = this.microQ.shift();
        try { fn(); } catch (e) { console.error(e); }
      }
      // After microtasks drained, schedule macrotask to handle tasks
      if (this.taskQ.length) {
        setTimeout(() => this._flushTask(), 0);
      } else {
        this.running = false;
      }
    }

    _flushTask() {
      const q = this.taskQ.splice(0);
      for (const fn of q) {
        try { fn(); } catch (e) { console.error(e); }
      }
      this.running = false;
    }
  }

// Usage
const s = new Scheduler();
s.scheduleTask(() => console.log('task'));
s.scheduleMicro(() => console.log('micro'));


// Output: micro then task.

// Interview script: explain how Promise - based microtasks run before macrotasks and how the scheduler follows that.

// 12) Explain how React uses microtasks for state batching

// Answer(concise):

// React batches state updates so multiple setState calls inside the same tick are coalesced into a single render.

// In modern React, updates triggered during event handlers are batched automatically.React often schedules state update flushes using microtasks (Promises) to ensure synchronous code finishes first and then perform a single render pass — this avoids redundant renders and reduces layout thrashing.

// Interview script: talk about batching for performance, microtask scheduling ensures updates are flushed after current sync work but before macrotasks / paint, giving deterministic updates.

// 13) Build your own asyncQueue processor

// Goal: Process tasks serially while allowing concurrency control and backpressure.

//   Implementation(bounded concurrency):

class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  push(task) {
    // task is function returning a Promise
    this.queue.push(task);
    this._next();
  }

  _next() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;
    const task = this.queue.shift();
    this.running++;
    task()
      .catch(e => console.error(e))
      .finally(() => {
        this.running--;
        this._next();
      });
  }
}

// Usage
const q = new AsyncQueue(2);
const makeTask = (i) => () => new Promise(r => setTimeout(() => { console.log('done', i); r(); }, 500));
for (let i = 0; i < 5; i++) q.push(makeTask(i));


// Explain: controls how many tasks run in parallel, useful for API rate - limits and constrained resources.

// 14) Simulate Event Loop execution in code

// Goal: Small simulator: two queues and a loop that drains microtasks then a macrotask.

//   Implementation:

class SimpleEventLoop {
  constructor() {
    this.micro = [];
    this.task = [];
    this.running = false;
  }

  enqueueMicro(fn) { this.micro.push(fn); }
  enqueueTask(fn) { this.task.push(fn); }

  runOnce() {
    // Drain microtasks
    while (this.micro.length) {
      const fn = this.micro.shift();
      try { fn(); } catch (e) { console.error(e); }
    }
    // Execute one macrotask
    if (this.task.length) {
      const fn = this.task.shift();
      try { fn(); } catch (e) { console.error(e); }
    }
  }

  // naive loop for demo; in real host the runtime schedules this.
  run() {
    const self = this;
    const tick = () => {
      self.runOnce();
      if (self.micro.length || self.task.length) {
        setTimeout(tick, 0); // emulate macrotask ticks
      }
    };
    tick();
  }
}


// Usage: enqueue micro and tasks and call run() to see ordering.

// Interview script: show you understand microtask drain, macrotask one-per-loop, and that rendering happens in between.

// 15) Handle millions of computations without blocking UI (strategies)

// Short list of strategies:

// Web Workers / Worker Threads — run computations off main thread (structured cloning for messages).

// Chunking / batching — break heavy loop into small chunks and schedule with setTimeout(…, 0) or requestAnimationFrame to yield to UI.

// requestIdleCallback — do low-priority work during idle windows (browser).

// Use streaming algorithms — process data in streams instead of all-at-once.

// Use WASM — for compute-heavy work with better performance.

// Server-side processing — offload to backend if possible.

// GPU based processing — WebGL/compute shaders if applicable.

// Example chunking:

function chunkProcess(items, processFn, chunkSize = 100) {
  let i = 0;
  function doChunk() {
    const end = Math.min(i + chunkSize, items.length);
    for (; i < end; i++) processFn(items[i], i);
    if (i < items.length) {
      setTimeout(doChunk, 0); // yield to event loop
    }
  }
  doChunk();
}


// Interview script: explain tradeoffs and pick a solution based on UX requirements and data size.

// SENIOR-LEVEL REAL WORLD QUESTIONS (detailed answers + how to answer)
// Q1: “Why does React use microtasks for state updates?”

// In-depth: React batches state updates to avoid multiple re-renders. Scheduling flush as a 
// microtask guarantees that synchronous code in the current stack finishes (avoids mid-stack renders),
// and that updates are applied before macrotasks/render steps, allowing deterministic and efficient rerendering. Microtasks provide small latency and high priority so multiple setState calls aggregated in same tick become one update.

// How to answer (concise): “For predictable, performant batching — microtasks let React wait until the current synchronous work finishes, coalesce updates, then flush once before the next macrotask/paint.”

// Q2: “Why is long synchronous code bad for user experience?”

// In-depth: The main thread executes JS and also handles UI events and rendering. Long synchronous tasks block the event loop preventing processing of input events, requestAnimationFrame callbacks, and micro/macrotasks. This leads to frozen UIs, skipped frames, and poor responsiveness. The browser may also consider tab unresponsive.

// How to answer (concise): “Because it blocks the event loop and prevents the browser from responding to user input or updating the screen — leading to janky/unresponsive UI. Use workers, chunking, or async patterns.”

// Q3: “How does Node.js use event loop phases?”

// In-depth (high-level): Node's libuv event loop has phases: timers (setTimeout), pending callbacks, idle/prepare, poll (I/O), check (setImmediate), and close callbacks. Between phases microtasks (Promise reactions) run after each callback. Timers execute if their threshold passed; poll waits for I/O; check runs setImmediate callbacks.

// How to answer: give a short-phase list, highlight difference: setTimeout vs setImmediate behavior (timers phase vs check phase) and mention microtasks run after each callback.

// Q4: “Why does await not block the main thread?”

// In-depth: await pauses the async function’s execution, but it schedules the continuation as a Promise resolution microtask. The current synchronous stack returns control to the event loop; the main thread is free to do other work. When the awaited Promise resolves, the continuation executes as a microtask.

// How to answer: “await yields control; the runtime schedules the continuation later (microtask) — it doesn’t block the thread.”

// Q5: “How does JavaScript achieve concurrency despite being single-threaded?”

// In-depth: Concurrency comes from the runtime providing asynchronous APIs (timers, network, filesystem, threads in C++ layer) that perform work in background and schedule callbacks to the event loop when done. Combined with microtask/macrotask model and message passing (workers), JS achieves concurrency without multi-threaded shared memory.

// How to answer: “Via background threads in the host (libuv/browser internals), non-blocking I/O, and message-passing. JS schedules callbacks on event loop — allowing concurrent I/O while the JS thread remains single-threaded.”

// Checklist: Short code snippets you’ll be asked to write/interview-prove

// sleep(ms) implementation (above).

// delay Promise wrapper (above).

// Predict outputs for mixed Promise/setTimeout examples (we covered).

// Chunk processing example (above).

// Web Worker example (explain message passing).

// Simple AsyncQueue (above).

// Scheduler (above).

// Microtask starvation demo (above).

// Serializing async tasks with reduce:

const tasks = [fn1, fn2]; // each returns a Promise
tasks.reduce((p, fn) => p.then(() => fn()), Promise.resolve());


// Bounded concurrency (AsyncQueue example).

// Final: How to speak answers in the interview (template)

// Start with a 1–2 sentence definition.

// Follow with a simple example or output.

// Then give one or two practical implications or tradeoffs.

// Finish with mitigation / best practice and a one-line summary.

// Example for the event loop:
// “Event loop coordinates the call stack and task queues in a single-threaded runtime.
// For example, Promise.then always runs before setTimeout(...,0)
// because microtasks are drained before macrotasks. The implication is that
// microtasks can starve rendering if abused, so you shouldn’t create infinite microtask
// loops. Best practice: keep expensive work off the main thread and use workers or chunking.
// In short: sync → microtasks → macrotask → paint.”