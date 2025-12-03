# JavaScript Memory Management: Complete Guide

## Overview
Understanding JavaScript memory management is crucial for writing efficient, performant applications. This guide covers garbage collection, memory leaks, allocation patterns, and modern memory management techniques.

## 📚 Table of Contents
1. [Garbage Collection Basics](#garbage-collection-basics)
2. [Memory Leaks](#memory-leaks)
3. [How JS Allocates Memory](#how-js-allocates-memory)
4. [WeakMap & WeakSet](#weakmap--weakset)
5. [Memory Profiling & Optimization](#memory-profiling--optimization)

---

## Garbage Collection Basics

### What is Garbage Collection?
Garbage Collection (GC) is an automatic memory management process that identifies and frees memory that is no longer in use by the program.

```javascript
// Example of memory that becomes garbage
function createUser() {
  const user = { name: 'John', age: 30 }; // Memory allocated
  console.log(user.name);
  // When function ends, 'user' is no longer accessible
  // Memory becomes eligible for garbage collection
}

createUser();
```

### How JavaScript Garbage Collection Works

#### 1. **Reference Counting (Historical, Not Used in Modern Browsers)**
```javascript
// Simple reference counting example
let obj1 = { name: 'John' }; // Ref count: 1
let obj2 = obj1;             // Ref count: 2

obj1 = null;                 // Ref count: 1
obj2 = null;                 // Ref count: 0 -> Garbage collectible

// Problem with reference counting: Circular references
function createCircularRef() {
  let objA = { name: 'A' };
  let objB = { name: 'B' };
  
  objA.ref = objB; // objA references objB
  objB.ref = objA; // objB references objA
  
  return null;
  // Even though unreachable, ref counts never reach 0
  // Memory leak in reference counting systems
}
```

#### 2. **Mark and Sweep Algorithm (Modern Approach)**
Modern JavaScript engines use a mark-and-sweep algorithm with generational collection.

```javascript
// Mark and sweep process
function demonstrateMarkAndSweep() {
  const root = { // Root object (global or active scope)
    user: { name: 'Alice' },
    data: [1, 2, 3]
  };
  
  // Mark phase: Start from roots, mark all reachable objects
  // root -> user (marked)
  // root -> data (marked)
  
  const temp = { temp: 'data' }; // Created but never linked to root
  
  // Sweep phase: Collect all unmarked objects
  // 'temp' is unmarked -> collected
  
  // After function ends:
  // 'root' goes out of scope -> unmarked -> collected
  // 'user' and 'data' become unreachable -> collected
}
```

#### 3. **Generational Collection (V8's Approach)**
Objects are divided into generations (young and old) based on their lifetime.

```javascript
// Generational collection in action
function generationalExample() {
  // Young generation (frequently collected)
  for (let i = 0; i < 1000; i++) {
    const temp = { id: i }; // Most die young
  }
  
  // Old generation (infrequently collected)
  const persistent = { data: 'long lived' };
  setTimeout(() => {
    console.log(persistent.data); // Keeps object alive
  }, 10000);
  
  // Scavenge (minor GC): Collects young generation
  // Mark-sweep-compact (major GC): Collects old generation
}
```

### Memory Lifecycle in JavaScript

```javascript
// 1. Allocation
function allocateMemory() {
  // Primitive values: Stack allocation
  const number = 42;         // Number
  const string = "hello";    // String (immutable, may be interned)
  const bool = true;         // Boolean
  const nullValue = null;    // Null
  const undefinedValue;      // Undefined
  const symbol = Symbol();   // Symbol
  
  // Objects: Heap allocation
  const object = {           // Object literal
    name: 'John',
    age: 30
  };
  
  const array = [1, 2, 3];   // Array
  const func = () => {};     // Function
  const date = new Date();   // Date object
  const regex = /pattern/;   // Regular expression
}

// 2. Usage
function useMemory() {
  const user = { name: 'Alice', scores: [95, 87, 92] };
  
  // Reading from memory
  console.log(user.name);           // Access property
  console.log(user.scores[0]);      // Access array element
  
  // Writing to memory
  user.age = 30;                    // Add new property
  user.scores.push(88);             // Modify array
  
  // Passing references
  processUser(user);                // Reference passed, not copied
}

// 3. Release (Garbage Collection)
function releaseMemory() {
  let bigArray = new Array(1000000).fill('data');
  
  // Explicitly allow GC (by removing references)
  bigArray = null;                  // Now eligible for GC
  
  // Or by going out of scope
  {
    const temp = { large: 'object' };
    // 'temp' becomes unreachable after block
  }
  
  // Function scope release
  function createTemp() {
    const tempData = new Array(1000).fill('temp');
    // 'tempData' released when function completes
  }
  createTemp();
}
```

### GC Triggers and Performance

```javascript
// When does GC run?
class GCTriggers {
  static demonstrateTriggers() {
    // 1. Allocation pressure
    const allocateHeavily = () => {
      const objects = [];
      for (let i = 0; i < 100000; i++) {
        objects.push({ id: i, data: 'x'.repeat(100) });
      }
      // May trigger GC due to heap pressure
    };
    
    // 2. Idle time (browser)
    // Modern browsers run GC during idle periods
    
    // 3. Memory threshold
    // When heap reaches certain size
    
    // 4. Manual suggestion (non-standard)
    if (window.gc) {
      window.gc(); // Chrome DevTools expose this
    }
    
    // 5. Tab/window close
    // All memory is reclaimed
  }
  
  static measureGCPerformance() {
    const iterations = 1000;
    let totalTime = 0;
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      // Create and immediately discard objects
      const temp = new Array(1000).fill({ data: 'test' });
      
      const end = performance.now();
      totalTime += (end - start);
      
      // Force minor GC by creating allocation pressure
      if (i % 100 === 0) {
        const pressure = new Array(10000).fill(null);
      }
    }
    
    console.log(`Average time per iteration: ${totalTime / iterations}ms`);
    console.log(`Total time: ${totalTime}ms`);
    console.log(`Potential GC pauses included`);
  }
}

// GC impact on performance
function demonstrateGCPause() {
  const button = document.getElementById('myButton');
  
  button.addEventListener('click', () => {
    // Critical animation frame
    requestAnimationFrame(() => {
      // If GC runs during this frame, animation may jank
      performAnimation();
    });
    
    // Heavy allocation that may trigger GC
    const data = processLargeDataset();
    // GC pause could happen here, affecting UI responsiveness
  });
}

// Minimizing GC impact
class GCPerformance {
  static objectPooling() {
    // Instead of creating/destroying objects, reuse them
    class ObjectPool {
      constructor(createFn, resetFn, size = 100) {
        this.pool = [];
        this.createFn = createFn;
        this.resetFn = resetFn;
        
        // Pre-allocate pool
        for (let i = 0; i < size; i++) {
          this.pool.push(createFn());
        }
      }
      
      acquire() {
        if (this.pool.length > 0) {
          return this.pool.pop();
        }
        return this.createFn();
      }
      
      release(obj) {
        this.resetFn(obj);
        this.pool.push(obj);
      }
    }
    
    // Usage: Particle system
    const particlePool = new ObjectPool(
      () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 }),
      (p) => { p.life = 100; }
    );
    
    // Instead of: new particles every frame
    // Use: particlePool.acquire() and particlePool.release()
  }
  
  static avoidAllocationInLoops() {
    // ❌ Bad: Allocates new object each iteration
    function processItemsBad(items) {
      const results = [];
      for (const item of items) {
        const processed = {      // New object each iteration
          value: item * 2,
          timestamp: new Date()  // New Date each iteration
        };
        results.push(processed);
      }
      return results;
    }
    
    // ✅ Better: Reuse objects
    function processItemsGood(items) {
      const results = [];
      const temp = { value: 0, timestamp: null };
      
      for (const item of items) {
        temp.value = item * 2;
        temp.timestamp = Date.now(); // Use primitive instead of Date object
        
        // Need to copy if storing in array
        results.push({ ...temp });
      }
      return results;
    }
    
    // ✅ Best: Pre-allocate array
    function processItemsBest(items) {
      const results = new Array(items.length);
      
      for (let i = 0; i < items.length; i++) {
        results[i] = items[i] * 2; // Store primitives only
      }
      return results;
    }
  }
}
```

### Modern GC Features

```javascript
// Concurrent and Incremental GC
class ModernGCFeatures {
  // Modern GC runs concurrently/incrementally to minimize pauses
  
  static demonstrateOrinoco() {
    // V8's Orinoco project features:
    // 1. Parallel GC: Uses multiple threads
    // 2. Incremental GC: Breaks work into chunks
    // 3. Concurrent GC: Runs alongside main thread
    // 4. Generational GC: Young/Old generations
    
    // Impact: Shorter, more predictable pauses
  }
  
  static measuringGCPauses() {
    // Using Performance Observer
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput === false) {
            // This might indicate GC-related layout shift
            console.log('Layout shift:', entry.value);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// Memory pressure API
function handleMemoryPressure() {
  // Check if Memory Pressure API is available
  if ('memory' in performance) {
    const memory = performance.memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
    });
  }
  
  // Memory pressure event (experimental)
  if ('MemoryPressureObserver' in window) {
    const observer = new MemoryPressureObserver((pressure) => {
      switch (pressure) {
        case 'critical':
          // Release caches, reduce quality
          releaseCaches();
          break;
        case 'moderate':
          // Be more conservative with allocations
          break;
        case 'normal':
          // Business as usual
          break;
      }
    });
    
    observer.observe();
  }
}

function releaseCaches() {
  // Example cache release strategy
  const caches = [
    imageCache,
    dataCache,
    computationCache
  ];
  
  caches.forEach(cache => {
    if (cache.clear) {
      cache.clear();
    } else if (cache.length > 100) {
      // Keep only most recent 50 items
      cache.splice(0, cache.length - 50);
    }
  });
}
```

---

## Memory Leaks

Memory leaks occur when memory that is no longer needed is not released back to the system. In JavaScript, this happens when references to objects are unintentionally kept alive.

### Common Causes of Memory Leaks

#### 1. **Accidental Global Variables**

```javascript
// ❌ Classic leak: Implicit global
function createGlobalLeak() {
  undeclaredVar = 'I become global'; // No var/let/const
  this.accidentalGlobal = 'Also global in non-strict mode';
}

createGlobalLeak();
console.log(window.undeclaredVar); // Accessible globally
console.log(window.accidentalGlobal); // Accessible globally

// ❌ Forgotten 'var/let/const' in loops
function loopLeak() {
  for (i = 0; i < 1000; i++) { // 'i' becomes global!
    // Process
  }
}
loopLeak();
console.log(window.i); // 1000 - Global variable!

// ✅ Prevention: Always declare variables
function safeFunction() {
  'use strict'; // Prevents accidental globals
  let localVar = 'I am local';
  const localConst = 'I am also local';
  
  // Explicit global if needed (rare)
  window.intentionalGlobal = 'I am intentionally global';
}

// ✅ Use linters (ESLint) to catch undeclared variables
// Add to .eslintrc: { "rules": { "no-undef": "error" } }
```

#### 2. **Forgotten Timers & Intervals**

```javascript
// ❌ Timer that keeps references alive
class TimerLeak {
  constructor(data) {
    this.data = new Array(10000).fill('large data');
    this.timerId = setInterval(() => {
      console.log('Timer running', this.data.length);
    }, 1000);
  }
  
  // ❌ Never clears the interval
  destroy() {
    // Missing: clearInterval(this.timerId);
    this.data = null; // Not enough - timer still has 'this' reference
  }
}

// Usage that causes leak
let instance = new TimerLeak();
instance.destroy();
instance = null;
// Timer still runs, keeping instance in memory

// ✅ Proper cleanup
class SafeTimer {
  constructor(data) {
    this.data = data;
    this.timerId = null;
  }
  
  start() {
    this.stop(); // Clear any existing timer
    this.timerId = setInterval(() => {
      this.process();
    }, 1000);
  }
  
  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  
  destroy() {
    this.stop();
    this.data = null;
  }
}

// ❌ setTimeout with closure that captures scope
function createTimeoutLeak() {
  const largeData = new Array(10000).fill('data');
  
  setTimeout(() => {
    console.log(largeData[0]); // Closure captures 'largeData'
  }, 10000);
  
  // 'largeData' stays in memory for 10 seconds
  // Even if we don't need it anymore
}

// ✅ Clear timeout when no longer needed
function safeTimeout() {
  const largeData = new Array(10000).fill('data');
  const timeoutId = setTimeout(() => {
    console.log(largeData[0]);
    largeData.length = 0; // Help GC
  }, 10000);
  
  // Clear if no longer needed
  function cancel() {
    clearTimeout(timeoutId);
    largeData.length = 0; // Remove references
  }
  
  return { cancel };
}
```

#### 3. **Closures Holding References**

```javascript
// ❌ Closure that unintentionally holds large objects
function createClosureLeak() {
  const largeData = new Array(1000000).fill('sensitive data');
  
  return function() {
    // Even though we don't use largeData, it's captured
    console.log('Hello');
    // 'largeData' stays in memory as long as this function exists
  };
}

const leakedFunction = createClosureLeak();
// 'largeData' cannot be GC'd while leakedFunction exists

// ✅ Be mindful of what closures capture
function createSafeClosure() {
  const largeData = new Array(1000000).fill('data');
  
  // Only capture what's needed
  const importantInfo = largeData[0]; // Extract primitive
  
  // Clear the large data
  largeData.length = 0;
  
  return function() {
    console.log(importantInfo); // Only captures primitive
    // 'largeData' can be GC'd
  };
}

// ❌ Common pattern: Event handlers in loops
function attachEventHandlers() {
  const buttons = document.querySelectorAll('.btn');
  const largeData = new Array(10000).fill('data');
  
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      console.log(largeData[index]); // Each handler captures 'largeData'
    });
  });
  
  // Even after removing buttons, 'largeData' stays in memory
}

// ✅ Solution 1: Extract needed data
function attachSafeHandlers1() {
  const buttons = document.querySelectorAll('.btn');
  const largeData = new Array(10000).fill('data');
  
  // Extract only what's needed
  const buttonData = buttons.map((_, i) => largeData[i]);
  
  buttons.forEach((button, index) => {
    const data = buttonData[index]; // Capture only needed value
    button.addEventListener('click', () => {
      console.log(data);
    });
  });
  
  // Allow largeData to be GC'd
  largeData.length = 0;
}

// ✅ Solution 2: Use event delegation
function attachSafeHandlers2() {
  const container = document.getElementById('container');
  const largeData = new Array(10000).fill('data');
  
  container.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn')) {
      const index = Array.from(container.children).indexOf(event.target);
      console.log(largeData[index]); // No closure captures largeData
    }
  });
  
  // Single handler, no closure per button
}

// ✅ Solution 3: Weak references in closures
function attachWeakHandlers() {
  const buttons = document.querySelectorAll('.btn');
  const largeData = new WeakMap();
  
  buttons.forEach((button, index) => {
    // Store data separately with button as key
    largeData.set(button, `data-${index}`);
    
    const handler = () => {
      console.log(largeData.get(button));
    };
    
    button.addEventListener('click', handler);
    
    // Store handler reference for cleanup
    button._clickHandler = handler;
  });
  
  // Cleanup function
  return function cleanup() {
    buttons.forEach(button => {
      if (button._clickHandler) {
        button.removeEventListener('click', button._clickHandler);
        delete button._clickHandler;
      }
      largeData.delete(button);
    });
  };
}
```

#### 4. **Detached DOM Elements**

```javascript
// ❌ Detached DOM subtree with JavaScript references
function createDetachedDOMLeak() {
  // Create element
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="content">
      <h1>Large Content</h1>
      ${'<p>Paragraph</p>'.repeat(1000)}
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(container);
  
  // Remove from DOM but keep reference
  document.body.removeChild(container);
  
  // ❌ 'container' still in memory with all its children
  // Can't be GC'd because we have a reference
  
  return container; // Returning it makes leak obvious
}

const leakedDOM = createDetachedDOMLeak();

// ✅ Proper cleanup
function handleDOMSafely() {
  const container = document.createElement('div');
  container.innerHTML = '<div>Content</div>';
  
  document.body.appendChild(container);
  
  // When done...
  document.body.removeChild(container);
  
  // Remove all references
  container.innerHTML = ''; // Clear content (breaks references)
  // container = null; // If possible
  
  // For event listeners, also need to remove them
}

// ❌ Event listeners on detached DOM
function createEventListenerLeak() {
  const element = document.createElement('div');
  const largeData = new Array(10000).fill('data');
  
  element.addEventListener('click', () => {
    console.log(largeData.length); // Closure captures largeData
  });
  
  document.body.appendChild(element);
  document.body.removeChild(element);
  
  // 'element' and 'largeData' stay in memory
  // Event listener keeps both alive
}

// ✅ Cleanup event listeners
function safeDOMWithEvents() {
  const element = document.createElement('div');
  const largeData = new Array(10000).fill('data');
  
  const clickHandler = () => {
    console.log(largeData.length);
  };
  
  element.addEventListener('click', clickHandler);
  document.body.appendChild(element);
  
  // Proper cleanup
  function cleanup() {
    element.removeEventListener('click', clickHandler);
    document.body.removeChild(element);
    element.innerHTML = '';
    largeData.length = 0;
  }
  
  return cleanup;
}

// Real-world example: Modal that leaks
class LeakyModal {
  constructor(content) {
    this.element = document.createElement('div');
    this.element.className = 'modal';
    this.element.innerHTML = `
      <div class="modal-content">
        <button class="close">×</button>
        ${content}
      </div>
    `;
    
    this.closeButton = this.element.querySelector('.close');
    this.closeButton.addEventListener('click', this.close.bind(this));
    
    document.body.appendChild(this.element);
  }
  
  close() {
    document.body.removeChild(this.element);
    // ❌ Forgot to remove event listener!
    // this.element still referenced by closeButton's event handler
  }
}

// Fixed Modal
class SafeModal {
  constructor(content) {
    this.element = document.createElement('div');
    this.element.className = 'modal';
    this.element.innerHTML = `
      <div class="modal-content">
        <button class="close">×</button>
        ${content}
      </div>
    `;
    
    this.closeButton = this.element.querySelector('.close');
    this.handleClose = this.close.bind(this);
    this.closeButton.addEventListener('click', this.handleClose);
    
    document.body.appendChild(this.element);
  }
  
  close() {
    this.closeButton.removeEventListener('click', this.handleClose);
    document.body.removeChild(this.element);
    this.element.innerHTML = '';
    this.element = null;
    this.closeButton = null;
    this.handleClose = null;
  }
}
```

#### 5. **Caches That Never Clear**

```javascript
// ❌ Simple cache that grows indefinitely
class LeakyCache {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      const value = this.computeExpensiveValue(key);
      this.cache.set(key, value);
    }
    return this.cache.get(key);
  }
  
  computeExpensiveValue(key) {
    // Expensive computation
    return key.split('').reverse().join('');
  }
  
  // ❌ No mechanism to limit cache size
  // Will eventually consume all memory
}

// ✅ Cache with size limit (LRU - Least Recently Used)
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    // If key exists, remove it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // If at capacity, remove least recently used
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Optional: Time-based expiration
  setWithExpiry(key, value, ttl = 60000) {
    this.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }
  
  getWithExpiry(key) {
    const item = this.get(key);
    if (!item) return undefined;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
}

// ✅ WeakMap for ephemeral caching
class EphemeralCache {
  constructor() {
    // WeakMap doesn't prevent keys from being GC'd
    this.cache = new WeakMap();
  }
  
  // Only works with objects as keys
  set(keyObject, value) {
    this.cache.set(keyObject, value);
  }
  
  get(keyObject) {
    return this.cache.get(keyObject);
  }
  
  // Automatically cleaned up when key objects are GC'd
}

// Real-world example: Image cache
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Max 50 images
    this.currentSize = 0;
  }
  
  async getImage(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    const image = await this.loadImage(url);
    
    // Check cache size
    if (this.currentSize >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(url, image);
    this.currentSize++;
    
    return image;
  }
  
  async loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }
  
  evictOldest() {
    const oldestKey = this.cache.keys().next().value;
    this.cache.delete(oldestKey);
    this.currentSize--;
  }
  
  clear() {
    this.cache.clear();
    this.currentSize = 0;
  }
}
```

#### 6. **Promises That Never Settle**

```javascript
// ❌ Promise that never resolves/rejects
function createPendingPromise() {
  return new Promise((resolve, reject) => {
    // Never calls resolve or reject
    // Promise stays in memory indefinitely
    // Any captured variables also stay
  });
}

const pendingPromise = createPendingPromise();
// Memory allocated for promise and its closure stays

// ✅ Always ensure promises settle
function createSafePromise() {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout'));
    }, 30000); // 30 second timeout
    
    // Do async work...
    
    // Always clear timeout
    function cleanup() {
      clearTimeout(timeoutId);
    }
    
    // Example: Fetch with timeout
    fetch('/api/data')
      .then(response => {
        cleanup();
        resolve(response.json());
      })
      .catch(error => {
        cleanup();
        reject(error);
      });
  });
}

// ❌ Forgotten promise chains
function createForgottenPromise() {
  const largeData = new Array(10000).fill('data');
  
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      console.log(data, largeData[0]); // Closure captures largeData
    });
  
  // If promise never settles or takes very long,
  // 'largeData' stays in memory
}

// ✅ Handle promise lifecycle
class PromiseManager {
  constructor() {
    this.pendingPromises = new Set();
  }
  
  track(promise) {
    this.pendingPromises.add(promise);
    
    // Auto-remove when settled
    promise.finally(() => {
      this.pendingPromises.delete(promise);
    });
    
    return promise;
  }
  
  cancelAll() {
    for (const promise of this.pendingPromises) {
      // Note: Can't actually cancel native promises
      // But we can ignore their results
    }
    this.pendingPromises.clear();
  }
  
  getPendingCount() {
    return this.pendingPromises.size;
  }
}

// Real-world example: Component with async operations
class AsyncComponent {
  constructor() {
    this.isMounted = false;
    this.pendingRequests = new Set();
  }
  
  mount() {
    this.isMounted = true;
    this.loadData();
  }
  
  unmount() {
    this.isMounted = false;
    
    // Cancel all pending requests
    for (const controller of this.pendingRequests) {
      controller.abort();
    }
    this.pendingRequests.clear();
  }
  
  async loadData() {
    if (!this.isMounted) return;
    
    const controller = new AbortController();
    this.pendingRequests.add(controller);
    
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      });
      
      if (!this.isMounted) return;
      
      const data = await response.json();
      this.render(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to load data:', error);
      }
    } finally {
      this.pendingRequests.delete(controller);
    }
  }
  
  render(data) {
    // Render logic
  }
}
```

### Detecting Memory Leaks

```javascript
// Manual detection techniques
class MemoryLeakDetector {
  // 1. Monitor memory usage
  static monitorMemory() {
    if (performance.memory) {
      const initialMemory = performance.memory.usedJSHeapSize;
      
      // Perform suspicious operation multiple times
      for (let i = 0; i < 100; i++) {
        performSuspiciousOperation();
      }
      
      // Force GC (in Chrome DevTools)
      if (window.gc) {
        window.gc();
      }
      
      const finalMemory = performance.memory.usedJSHeapSize;
      
      if (finalMemory > initialMemory * 2) {
        console.warn('Possible memory leak detected');
        console.log(`Initial: ${initialMemory}, Final: ${finalMemory}`);
      }
    }
  }
  
  // 2. Use Chrome DevTools Memory Profiler
  static explainDevToolsProfiling() {
    console.log(`
      Chrome DevTools Memory Profiling:
      
      1. Take Heap Snapshot
        - Shows all objects in memory
        - Compare snapshots to find growing objects
      
      2. Record Allocation Timeline
        - Shows objects allocated over time
        - Helps find allocations that aren't freed
      
      3. Record Allocation Sampling
        - Lightweight profiling
        - Shows allocation sites
      
      Tips:
      - Use "Comparison" view to compare snapshots
      - Look for growing Detached DOM trees
      - Check for accumulating event listeners
      - Watch for increasing array/object counts
    `);
  }
  
  // 3. Manual reference tracking
  static createLeakTracker() {
    const trackedObjects = new WeakMap();
    let idCounter = 0;
    
    return {
      track(obj, label) {
        const id = idCounter++;
        trackedObjects.set(obj, { id, label, timestamp: Date.now() });
        return id;
      },
      
      getTrackedInfo() {
        const info = [];
        // Note: Can't iterate WeakMap, need separate tracking
        return info;
      }
    };
  }
}

// Automated leak detection in tests
class MemoryLeakTests {
  static async testForLeaks(testFunction, iterations = 1000) {
    const initialSnapshot = await this.takeHeapSnapshot();
    
    for (let i = 0; i < iterations; i++) {
      await testFunction();
      
      // Allow GC some time (not guaranteed)
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // Force GC if available
    if (window.gc) {
      window.gc();
    }
    
    const finalSnapshot = await this.takeHeapSnapshot();
    
    return this.compareSnapshots(initialSnapshot, finalSnapshot);
  }
  
  static async takeHeapSnapshot() {
    // In real implementation, would use Chrome DevTools protocol
    // or performance.memory
    return {
      timestamp: Date.now(),
      memory: performance.memory ? performance.memory.usedJSHeapSize : 0
    };
  }
  
  static compareSnapshots(initial, final) {
    const growth = final.memory - initial.memory;
    const percentGrowth = (growth / initial.memory) * 100;
    
    return {
      growth,
      percentGrowth,
      hasLeak: percentGrowth > 50 // Arbitrary threshold
    };
  }
}

// Example of testing a component for leaks
async function testComponentForLeaks() {
  const detector = new MemoryLeakTests();
  
  const result = await detector.testForLeaks(async () => {
    // Create and destroy component
    const component = new MyComponent();
    await component.initialize();
    component.destroy();
  }, 100);
  
  if (result.hasLeak) {
    console.error(`Memory leak detected: ${result.percentGrowth.toFixed(1)}% growth`);
  } else {
    console.log(`No significant leak: ${result.growth} bytes growth`);
  }
}
```

### Preventing Memory Leaks: Best Practices

```javascript
// Memory management patterns
class MemorySafePatterns {
  // 1. Use Weak References when possible
  static useWeakReferences() {
    // For caches where keys are objects
    const metadataCache = new WeakMap();
    
    // For tracking without preventing GC
    const observedObjects = new WeakSet();
    
    // For event listener tracking
    const listenerRegistry = new WeakMap();
  }
  
  // 2. Implement disposable pattern
  static disposablePattern() {
    class DisposableResource {
      constructor() {
        this.isDisposed = false;
        this.listeners = [];
        this.timers = [];
        this.subscriptions = [];
      }
      
      addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
      }
      
      setTimeout(callback, delay) {
        const id = setTimeout(() => {
          if (!this.isDisposed) {
            callback();
          }
        }, delay);
        this.timers.push(id);
        return id;
      }
      
      dispose() {
        if (this.isDisposed) return;
        
        this.isDisposed = true;
        
        // Cleanup listeners
        this.listeners.forEach(({ element, event, handler }) => {
          element.removeEventListener(event, handler);
        });
        
        // Clear timers
        this.timers.forEach(id => clearTimeout(id));
        
        // Cancel subscriptions
        this.subscriptions.forEach(sub => sub.unsubscribe());
        
        // Clear arrays
        this.listeners.length = 0;
        this.timers.length = 0;
        this.subscriptions.length = 0;
        
        // Remove other references
        // this.someLargeData = null;
      }
    }
  }
  
  // 3. Use Object pooling for frequent allocations
  static objectPooling() {
    class Vector2DPool {
      constructor(poolSize = 100) {
        this.pool = [];
        this.activeCount = 0;
        
        // Pre-allocate
        for (let i = 0; i < poolSize; i++) {
          this.pool.push({ x: 0, y: 0 });
        }
      }
      
      acquire(x = 0, y = 0) {
        let vector;
        
        if (this.pool.length > 0) {
          vector = this.pool.pop();
        } else {
          vector = { x: 0, y: 0 }; // Fallback allocation
        }
        
        vector.x = x;
        vector.y = y;
        this.activeCount++;
        
        return vector;
      }
      
      release(vector) {
        vector.x = 0;
        vector.y = 0;
        this.pool.push(vector);
        this.activeCount--;
      }
      
      getStats() {
        return {
          total: this.pool.length + this.activeCount,
          inactive: this.pool.length,
          active: this.activeCount
        };
      }
    }
    
    // Usage in game loop
    const pool = new Vector2DPool(1000);
    
    function gameUpdate() {
      const positions = [];
      
      for (let i = 0; i < 100; i++) {
        const pos = pool.acquire(Math.random(), Math.random());
        positions.push(pos);
        
        // Update position...
        pos.x += 0.1;
        pos.y += 0.1;
      }
      
      // Release positions at end of frame
      positions.forEach(pos => pool.release(pos));
    }
  }
  
  // 4. Batch DOM operations
  static batchDOMOperations() {
    // ❌ Multiple reflows
    function updateDOMBad(items) {
      const container = document.getElementById('container');
      container.innerHTML = '';
      
      items.forEach(item => {
        const element = document.createElement('div');
        element.textContent = item;
        container.appendChild(element); // Reflow each time
      });
    }
    
    // ✅ Single reflow
    function updateDOMGood(items) {
      const container = document.getElementById('container');
      const fragment = document.createDocumentFragment();
      
      items.forEach(item => {
        const element = document.createElement('div');
        element.textContent = item;
        fragment.appendChild(element);
      });
      
      container.innerHTML = '';
      container.appendChild(fragment); // Single reflow
    }
    
    // ✅ Even better: Virtual DOM
    class VirtualDOM {
      constructor(container) {
        this.container = container;
        this.currentTree = null;
      }
      
      render(newTree) {
        const patches = this.diff(this.currentTree, newTree);
        this.applyPatches(patches);
        this.currentTree = newTree;
      }
      
      diff(oldTree, newTree) {
        // Diffing algorithm
        return [];
      }
      
      applyPatches(patches) {
        // Minimal DOM updates
      }
    }
  }
  
  // 5. Limit closure scope
  static limitClosureScope() {
    // ❌ Large closure scope
    function processDataBad(data) {
      const config = loadConfig(); // Large object
      const cache = createCache(); // Another large object
      
      return data.map(item => {
        // Closure captures config and cache
        return processItem(item, config, cache);
      });
    }
    
    // ✅ Extract only needed values
    function processDataGood(data) {
      const config = loadConfig();
      const cache = createCache();
      
      // Extract only what's needed
      const importantSetting = config.importantSetting;
      const cacheKey = cache.getKey();
      
      // Clear large objects
      config.cleanup?.();
      cache.clear?.();
      
      return data.map(item => {
        // Closure only captures primitives/small objects
        return processItem(item, importantSetting, cacheKey);
      });
    }
    
    // ✅ Use parameters instead of closures
    function processDataBest(data) {
      const processor = createProcessor();
      
      return data.map((item, index, array) => {
        // No closure, all data passed as parameters
        return processor.process(item, index, array);
      });
    }
  }
}

// Memory management in frameworks
class FrameworkMemoryManagement {
  // React example
  static reactBestPractices() {
    console.log(`
      React Memory Management:
      
      1. Cleanup in useEffect
        useEffect(() => {
          const timer = setInterval(() => {}, 1000);
          return () => clearInterval(timer); // Cleanup
        }, []);
      
      2. Avoid inline functions
        // ❌ Creates new function each render
        <button onClick={() => handleClick()}>Click</button>
        
        // ✅ Use useCallback
        const handleClick = useCallback(() => {}, []);
        <button onClick={handleClick}>Click</button>
      
      3. Memoize expensive computations
        const expensiveValue = useMemo(() => {
          return computeExpensiveValue(props.data);
        }, [props.data]);
      
      4. Virtualize long lists
        import { FixedSizeList } from 'react-window';
      
      5. Unsubscribe from observables
        useEffect(() => {
          const subscription = observable.subscribe();
          return () => subscription.unsubscribe();
        }, []);
    `);
  }
  
  // Vue example
  static vueBestPractices() {
    console.log(`
      Vue Memory Management:
      
      1. Cleanup in beforeUnmount/beforeDestroy
        beforeUnmount() {
          clearInterval(this.timer);
          this.eventBus.$off('event', this.handler);
        }
      
      2. Use v-once for static content
        <div v-once>{{ staticContent }}</div>
      
      3. Properly destroy components
        // Manually destroy if needed
        const app = createApp(Component);
        app.unmount();
      
      4. Clear references in destroyed()
        destroyed() {
          this.largeData = null;
          this.cache = null;
        }
      
      5. Use computed properties for derived data
        computed: {
          filteredItems() {
            return this.items.filter(i => i.active);
          }
        }
    `);
  }
  
  // Angular example
  static angularBestPractices() {
    console.log(`
      Angular Memory Management:
      
      1. Unsubscribe in ngOnDestroy
        private subscriptions: Subscription[] = [];
        
        ngOnInit() {
          this.subscriptions.push(
            this.service.data$.subscribe()
          );
        }
        
        ngOnDestroy() {
          this.subscriptions.forEach(s => s.unsubscribe());
        }
      
      2. Use async pipe for observables
        <div>{{ data$ | async }}</div>
      
      3. Implement OnDestroy interface
        export class MyComponent implements OnDestroy {
          ngOnDestroy() {
            // Cleanup
          }
        }
      
      4. Use ChangeDetectionStrategy.OnPush
        @Component({
          changeDetection: ChangeDetectionStrategy.OnPush
        })
      
      5. Destroy dynamically created components
        const componentRef = this.container.createComponent();
        // Later...
        componentRef.destroy();
    `);
  }
}
```

---

## How JS Allocates Memory

### Memory Structure in JavaScript

```javascript
// Understanding JavaScript memory layout
class MemoryLayout {
  static explainMemoryStructure() {
    console.log(`
      JavaScript Memory Structure:
      
      ┌─────────────────────────────────────┐
      │         STACK (Primitives)          │
      ├─────────────────────────────────────┤
      │  • Number                           │
      │  • String (small)                   │
      │  • Boolean                          │
      │  • Undefined                        │
      │  • Null                             │
      │  • Symbol                           │
      │  • Reference (pointer to heap)      │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │          HEAP (Objects)             │
      ├─────────────────────────────────────┤
      │  • Objects {}                       │
      │  • Arrays []                        │
      │  • Functions                        │
      │  • Strings (large)                  │
      │  • Closures                         │
      │  • DOM elements                     │
      └─────────────────────────────────────┘
    `);
  }
  
  // Stack allocation examples
  static stackAllocation() {
    // Primitive values allocated on stack (or stack-allocated in registers)
    const number = 42;           // Number
    const boolean = true;        // Boolean
    const nullValue = null;      // Null
    const undefinedValue = void 0; // Undefined
    const symbol = Symbol('id'); // Symbol
    
    // Small strings may be stack-allocated or interned
    const smallString = "hello";
    
    // References (pointers) are on stack
    const reference = { x: 10 }; // Reference points to heap object
    
    // Function parameters and local variables
    function add(a, b) {         // 'a' and 'b' on stack
      const result = a + b;      // 'result' on stack
      return result;
    }
    
    return { number, boolean, reference };
    // When function returns, stack frame is popped
    // Primitives are gone, heap object remains if referenced elsewhere
  }
  
  // Heap allocation examples
  static heapAllocation() {
    // All objects allocated on heap
    const object = {              // Object literal
      name: 'John',
      age: 30,
      address: {                  // Nested object
        street: '123 Main St',
        city: 'New York'
      }
    };
    
    const array = [1, 2, 3, 4, 5]; // Array
    const func = function() {      // Function
      return 'Hello';
    };
    
    const date = new Date();       // Date object
    const regex = /pattern/g;      // RegExp object
    const map = new Map();         // Map
    const set = new Set();         // Set
    
    // Large strings go to heap
    const largeString = 'x'.repeat(1000000);
    
    // Closures capture heap references
    function createClosure() {
      const captured = { data: 'large' };
      return () => captured.data; // Closure keeps 'captured' in heap
    }
    
    return {
      object,
      array,
      func,
      closure: createClosure()
    };
  }
}
```

### Memory Allocation Process

```javascript
// How JavaScript allocates memory
class AllocationProcess {
  // 1. Primitive allocation
  static allocatePrimitives() {
    // Immediate values (often in registers)
    let a = 10;         // Number
    let b = 'text';     // String (may be interned)
    let c = true;       // Boolean
    let d = null;       // Null
    let e = undefined;  // Undefined
    let f = Symbol();   // Symbol
    
    // Stack allocation (conceptual)
    // Each variable gets a slot on the stack
    // When scope ends, stack frame is popped
  }
  
  // 2. Object allocation
  static allocateObjects() {
    // Step 1: Calculate size
    const estimatedSize = this.estimateObjectSize({
      name: 'Alice',      // String: 5 characters * 2 bytes = 10 bytes
      age: 25,            // Number: 8 bytes
      scores: [95, 87]    // Array reference: 8 bytes + array overhead
    });
    
    // Step 2: Find free memory in heap
    // JavaScript engine's memory manager:
    // - Checks free lists
    // - Looks for contiguous free space
    // - May trigger GC if no space
    
    // Step 3: Allocate and initialize
    const user = {
      name: 'Alice',
      age: 25,
      scores: [95, 87]
    };
    
    // Hidden class created (V8)
    // Property storage allocated
    // References set up
    
    return user;
  }
  
  static estimateObjectSize(obj) {
    // Rough estimation (actual varies by engine)
    let size = 0;
    
    // Object overhead: ~12-24 bytes
    size += 16;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Key string
        size += key.length * 2;
        
        // Value
        const value = obj[key];
        if (typeof value === 'string') {
          size += value.length * 2;
        } else if (typeof value === 'number') {
          size += 8;
        } else if (Array.isArray(value)) {
          size += 16 + (value.length * 8); // Array overhead + references
        } else if (typeof value === 'object' && value !== null) {
          size += 8; // Reference
        }
      }
    }
    
    // Alignment padding
    size = Math.ceil(size / 8) * 8;
    
    return size;
  }
  
  // 3. Array allocation
  static allocateArrays() {
    // Dense arrays (contiguous storage)
    const denseArray = [1, 2, 3, 4, 5];
    // Allocated as contiguous block
    // Fast indexed access
    
    // Sparse arrays
    const sparseArray = [];
    sparseArray[0] = 'a';
    sparseArray[1000] = 'b';
    // May use hash table storage
    // Slower access
    
    // Typed arrays (different allocation)
    const typedArray = new Float64Array(1000);
    // Single contiguous memory block
    // Fixed type, no boxing
    
    return { denseArray, sparseArray, typedArray };
  }
  
  // 4. Function allocation
  static allocateFunctions() {
    // Function object allocation
    function regularFunction() {
      return 'Hello';
    }
    
    // Arrow function (different internal representation)
    const arrowFunction = () => 'Hello';
    
    // Function with closure
    function createClosure() {
      const secret = 'hidden';
      return function() {
        return secret;
      };
    }
    
    // Generator function
    function* generatorFunction() {
      yield 1;
      yield 2;
    }
    
    // Memory includes:
    // - Function object
    // - Scope chain
    // - Prototype link
    // - Code (may be shared between instances)
    
    return {
      regularFunction,
      arrowFunction,
      closure: createClosure(),
      generator: generatorFunction()
    };
  }
}
```

### Memory Optimization Techniques

```javascript
// Optimization patterns for memory allocation
class MemoryOptimization {
  // 1. Object shape optimization
  static objectShapeOptimization() {
    console.log(`
      V8 Hidden Classes (Shapes):
      
      Objects with same property order share hidden class
      This optimizes property access
    `);
    
    // ❌ Different property order = different hidden classes
    function createObjectsBad() {
      const obj1 = { a: 1, b: 2, c: 3 }; // Hidden class C0
      const obj2 = { b: 2, a: 1, c: 3 }; // Different hidden class C1
      
      // V8 creates two hidden classes
      // Slower property access
      return [obj1, obj2];
    }
    
    // ✅ Same property order = same hidden class
    function createObjectsGood() {
      const obj1 = { a: 1, b: 2, c: 3 }; // Hidden class C0
      const obj2 = { a: 4, b: 5, c: 6 }; // Same hidden class C0
      
      // V8 reuses hidden class
      // Faster property access
      return [obj1, obj2];
    }
    
    // ✅ Initialize all properties in constructor
    class OptimizedClass {
      constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        // Always in same order
      }
    }
    
    // ❌ Adding properties dynamically
    const obj = { a: 1 };
    obj.b = 2; // Transition to new hidden class
    obj.c = 3; // Another transition
    
    // ✅ Initialize all at once
    const optimizedObj = { a: 1, b: 2, c: 3 };
    
    return {
      bad: createObjectsBad(),
      good: createObjectsGood(),
      class: new OptimizedClass(1, 2, 3),
      dynamic: obj,
      static: optimizedObj
    };
  }
  
  // 2. Array optimization
  static arrayOptimization() {
    // Dense arrays vs sparse arrays
    
    // ❌ Creating sparse arrays
    const sparse = [];
    sparse[0] = 'a';
    sparse[10000] = 'b'; // Creates sparse array
    
    // ✅ Pre-allocate dense arrays
    const dense = new Array(10001);
    dense[0] = 'a';
    dense[10000] = 'b'; // Still dense (all elements defined)
    
    // ❌ Changing array types
    const array = [1, 2, 3];          // PACKED_SMI_ELEMENTS (small integers)
    array.push(4.5);                  // Transition to PACKED_DOUBLE_ELEMENTS
    array.push('text');               // Transition to PACKED_ELEMENTS (any type)
    
    // ✅ Keep consistent types
    const intArray = [1, 2, 3, 4];    // Stays PACKED_SMI_ELEMENTS
    const doubleArray = [1.1, 2.2];   // PACKED_DOUBLE_ELEMENTS
    const anyArray = ['a', {}, 1];    // PACKED_ELEMENTS
    
    // ❌ Deleting elements
    const arr = [1, 2, 3, 4, 5];
    delete arr[2];                    // Creates hole -> HOLEY_ELEMENTS
    
    // ✅ Use splice or set to undefined
    arr.splice(2, 1);                 // Removes element, keeps packed
    // OR
    arr[2] = undefined;               // No hole (value is undefined)
    
    // Use typed arrays for numeric data
    const floatArray = new Float64Array(1000);
    const intArrayTyped = new Int32Array(1000);
    
    return {
      sparseLength: sparse.length,      // 10001
      denseLength: dense.length,        // 10001
      arrayTypes: {
        int: intArray,
        double: doubleArray,
        any: anyArray,
        typed: floatArray
      }
    };
  }
  
  // 3. String optimization
  static stringOptimization() {
    // String interning (deduplication)
    
    const str1 = 'Hello World';
    const str2 = 'Hello World';
    // May point to same memory (interning)
    
    // Large strings
    const large = 'x'.repeat(1000000);
    // Allocated in heap, not interned
    
    // String building
    // ❌ Concatenation in loop (creates many intermediate strings)
    function buildStringBad(array) {
      let result = '';
      for (const item of array) {
        result += item; // New string each iteration
      }
      return result;
    }
    
    // ✅ Use array join
    function buildStringGood(array) {
      return array.join('');
    }
    
    // ✅ Use StringBuilder pattern for very large strings
    class StringBuilder {
      constructor() {
        this.parts = [];
      }
      
      append(str) {
        this.parts.push(str);
      }
      
      toString() {
        return this.parts.join('');
      }
    }
    
    return {
      sameString: str1 === str2,
      largeStringSize: large.length,
      builder: new StringBuilder()
    };
  }
  
  // 4. Function optimization
  static functionOptimization() {
    // Function reusability
    
    // ❌ Creating functions in loops
    function processArrayBad(array) {
      const results = [];
      for (const item of array) {
        // New function each iteration
        const processor = function(x) {
          return x * 2;
        };
        results.push(processor(item));
      }
      return results;
    }
    
    // ✅ Reuse function
    function processArrayGood(array) {
      const processor = function(x) {
        return x * 2;
      };
      
      const results = [];
      for (const item of array) {
        results.push(processor(item));
      }
      return results;
    }
    
    // ✅ Use built-in methods
    function processArrayBest(array) {
      return array.map(x => x * 2);
    }
    
    // Arrow functions vs regular functions
    // Arrow functions don't have 'this', 'arguments', 'super', 'new.target'
    // Smaller memory footprint
    
    const regularFunc = function() {
      return this.value;
    };
    
    const arrowFunc = () => {
      return 'value';
    };
    
    return {
      badResult: processArrayBad([1, 2, 3]),
      goodResult: processArrayGood([1, 2, 3]),
      bestResult: processArrayBest([1, 2, 3]),
      functions: { regularFunc, arrowFunc }
    };
  }
  
  // 5. Memory pooling
  static memoryPooling() {
    // For high-frequency allocation/deallocation
    
    class Vector2DPool {
      constructor(initialSize = 100) {
        this.pool = [];
        this.count = 0;
        
        // Pre-allocate
        for (let i = 0; i < initialSize; i++) {
          this.pool.push({ x: 0, y: 0 });
        }
      }
      
      acquire(x = 0, y = 0) {
        let vector;
        
        if (this.pool.length > 0) {
          vector = this.pool.pop();
        } else {
          // Grow pool
          vector = { x: 0, y: 0 };
        }
        
        vector.x = x;
        vector.y = y;
        this.count++;
        
        return vector;
      }
      
      release(vector) {
        vector.x = 0;
        vector.y = 0;
        this.pool.push(vector);
        this.count--;
      }
      
      getStats() {
        return {
          total: this.pool.length + this.count,
          available: this.pool.length,
          inUse: this.count
        };
      }
    }
    
    // Usage in game loop
    const pool = new Vector2DPool(1000);
    
    const vectors = [];
    for (let i = 0; i < 100; i++) {
      vectors.push(pool.acquire(i, i * 2));
    }
    
    // Process...
    
    // Release back to pool
    vectors.forEach(v => pool.release(v));
    
    return pool.getStats();
  }
}
```

### Engine-Specific Memory Allocation

```javascript
// V8 Memory Allocation
class V8MemoryAllocation {
  static explainV8Memory() {
    console.log(`
      V8 Memory Structure:
      
      ┌─────────────────────────────────────┐
      │         New Space (Young Gen)       │
      │  • 1-8 MB (small)                   │
      │  • Frequent GC (Scavenge)           │
      │  • Short-lived objects              │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │         Old Space (Old Gen)         │
      │  • Large (up to ~1.4GB 32-bit,      │
      │    ~8GB 64-bit)                     │
      │  • Infrequent GC (Mark-Sweep)       │
      │  • Long-lived objects               │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │         Large Object Space          │
      │  • Objects > 1MB                    │
      │  • Never moved                      │
      │  • Collected with Old Space         │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │           Code Space                │
      │  • Compiled code                    │
      │  • Never moved                      │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │           Map Space                 │
      │  • Hidden classes (Shapes)          │
      │  • Never moved                      │
      └─────────────────────────────────────┘
    `);
  }
  
  static v8OptimizationTips() {
    return `
      V8 Optimization Tips:
      
      1. Object Shapes
        • Keep property order consistent
        • Initialize all properties in constructor
        • Avoid deleting properties
        
      2. Arrays
        • Use dense arrays (contiguous indices)
        • Pre-allocate size when known
        • Use same type throughout array
        • Use typed arrays for numeric data
        
      3. Functions
        • Avoid creating functions in hot loops
        • Use arrow functions when possible
        • Reuse function objects
        
      4. Strings
        • Use array.join() for concatenation
        • Avoid string repetition in loops
        • Consider StringBuilder for large strings
        
      5. Memory
        • Use object pooling for frequent allocations
        • Release references when done
        • Use WeakMap/WeakSet for caches
    `;
  }
}

// SpiderMonkey (Firefox) Memory Allocation
class SpiderMonkeyMemory {
  static explainSpiderMonkeyMemory() {
    console.log(`
      SpiderMonkey Memory Structure:
      
      ┌─────────────────────────────────────┐
      │           Nursery (Young)           │
      │  • ~16MB                            │
      │  • Minor GC (Zeal)                  │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │           Tenured (Old)             │
      │  • Incremental GC                   │
      │  • Compacting                       │
      └─────────────────────────────────────┘
      
      ┌─────────────────────────────────────┐
      │         Large Allocation Heap       │
      │  • Objects > certain size           │
      └─────────────────────────────────────┘
      
      Features:
      • Incremental GC (slice-based)
      • Generational collection
      • Compacting to reduce fragmentation
    `);
  }
}

// JavaScriptCore (Safari) Memory Allocation
class JavaScriptCoreMemory {
  static explainJavaScriptCoreMemory() {
    console.log(`
      JavaScriptCore Memory Structure:
      
      ┌─────────────────────────────────────┐
      │        Butterfly (Properties)       │
      │  • Out-of-line property storage     │
      │  • Array indexing                   │
      └─────────────────────────────────────┐
      
      ┌─────────────────────────────────────┐
      │         Marked Blocks               │
      │  • 16KB blocks                      │
      │  • Bump allocation within blocks    │
      └─────────────────────────────────────┘
      
      Features:
      • Bump allocation (fast)
      • Copying collector
      • Sub-millisecond GC pauses
    `);
  }
}
```

---

## WeakMap & WeakSet

### Introduction to Weak Collections

```javascript
// WeakMap and WeakSet are collections that hold "weak" references
// They don't prevent their keys/values from being garbage collected

class WeakCollectionsIntroduction {
  static basicCharacteristics() {
    console.log(`
      WeakMap Characteristics:
      • Keys MUST be objects (not primitives)
      • Values can be anything
      • No iteration methods (keys(), values(), entries())
      • No size property
      • No clearing all items (no clear() method)
      • Automatic cleanup when keys are GC'd
      
      WeakSet Characteristics:
      • Values MUST be objects (not primitives)
      • No iteration methods
      • No size property
      • No clear() method
      • Automatic cleanup when values are GC'd
      
      Use Cases:
      • Private data storage
      • Metadata without memory leaks
      • Caching with automatic cleanup
      • Tracking objects without preventing GC
    `);
  }
}
```

### WeakMap Deep Dive

```javascript
// WeakMap: Collection of key-value pairs with weak keys
class WeakMapExplained {
  // Basic usage
  static basicUsage() {
    const weakMap = new WeakMap();
    
    // Keys must be objects
    const key1 = { id: 1 };
    const key2 = { id: 2 };
    const key3 = { id: 3 };
    
    // Setting values
    weakMap.set(key1, 'value for key1');
    weakMap.set(key2, { data: 'complex value' });
    weakMap.set(key3, ['array', 'value']);
    
    // Getting values
    console.log(weakMap.get(key1)); // 'value for key1'
    console.log(weakMap.get(key2)); // { data: 'complex value' }
    
    // Checking existence
    console.log(weakMap.has(key1)); // true
    console.log(weakMap.has({ id: 4 })); // false (different object)
    
    // Deleting entries
    weakMap.delete(key1);
    console.log(weakMap.has(key1)); // false
    
    // What you CAN'T do:
    // console.log(weakMap.size); // undefined
    // for (const [key, value] of weakMap) {} // Not iterable
    // weakMap.clear(); // No clear method
    // weakMap.keys(), .values(), .entries() // Don't exist
    
    return weakMap;
  }
  
  // Demonstration of automatic garbage collection
  static demonstrateGarbageCollection() {
    let weakMap = new WeakMap();
    
    // Track memory before
    const memoryBefore = performance.memory?.usedJSHeapSize || 0;
    
    (function() {
      // Create objects that will become garbage
      const tempKey1 = { id: 'temp1' };
      const tempKey2 = { id: 'temp2' };
      
      // Store in WeakMap with large values
      weakMap.set(tempKey1, new Array(1000000).fill('data1'));
      weakMap.set(tempKey2, new Array(1000000).fill('data2'));
      
      // Objects go out of scope here
      // They become eligible for GC
    })();
    
    // Force GC if available (Chrome DevTools)
    if (typeof gc === 'function') {
      gc();
    }
    
    // Wait a bit
    setTimeout(() => {
      const memoryAfter = performance.memory?.usedJSHeapSize || 0;
      console.log(`Memory before GC: ${memoryBefore}`);
      console.log(`Memory after GC: ${memoryAfter}`);
      console.log(`Memory freed: ${memoryBefore - memoryAfter}`);
      
      // The WeakMap entries are automatically removed
      // when their keys are garbage collected
    }, 1000);
  }
  
  // Real-world use case: Private data storage
  static privateDataStorage() {
    const privateData = new WeakMap();
    
    class User {
      constructor(name, email) {
        // Store private data in WeakMap
        privateData.set(this, {
          name: name,
          email: email,
          secretToken: Math.random().toString(36).substr(2),
          loginAttempts: 0
        });
      }
      
      // Public methods can access private data
      getName() {
        return privateData.get(this)?.name;
      }
      
      getEmail() {
        return privateData.get(this)?.email;
      }
      
      login(password) {
        const data = privateData.get(this);
        if (!data) return false;
        
        data.loginAttempts++;
        // Login logic...
        return true;
      }
      
      // Private method (convention)
      #validate() {
        const data = privateData.get(this);
        return data && data.secretToken;
      }
    }
    
    // Usage
    const user = new User('Alice', 'alice@example.com');
    console.log(user.getName()); // 'Alice'
    console.log(user.email); // undefined (truly private)
    
    // When user is garbage collected, its private data is too
    return User;
  }
  
  // DOM element metadata
  static domElementMetadata() {
    const elementMetadata = new WeakMap();
    
    class ElementTracker {
      static track(element, metadata) {
        elementMetadata.set(element, {
          ...metadata,
          created: new Date(),
          modified: new Date()
        });
      }
      
      static update(element, updates) {
        const current = elementMetadata.get(element) || {};
        elementMetadata.set(element, {
          ...current,
          ...updates,
          modified: new Date()
        });
      }
      
      static get(element, key) {
        const data = elementMetadata.get(element);
        return data ? data[key] : undefined;
      }
      
      static has(element) {
        return elementMetadata.has(element);
      }
    }
    
    // Usage with DOM elements
    const button = document.createElement('button');
    button.textContent = 'Click me';
    
    ElementTracker.track(button, {
      clickCount: 0,
      lastClick: null,
      customStyle: 'primary'
    });
    
    button.addEventListener('click', () => {
      const clicks = ElementTracker.get(button, 'clickCount') || 0;
      ElementTracker.update(button, {
        clickCount: clicks + 1,
        lastClick: new Date()
      });
    });
    
    // When button is removed from DOM and all references are gone,
    // the metadata is automatically cleaned up
    
    return { ElementTracker, trackedButton: button };
  }
  
  // Cache with automatic cleanup
  static createEphemeralCache() {
    const cache = new WeakMap();
    
    return {
      get(key, computeValue) {
        if (!cache.has(key)) {
          const value = computeValue();
          cache.set(key, value);
          return value;
        }
        return cache.get(key);
      },
      
      has(key) {
        return cache.has(key);
      },
      
      delete(key) {
        return cache.delete(key);
      },
      
      // Note: No size, no iteration, no clear
      // Automatic cleanup when keys are GC'd
    };
  }
  
  // Framework integration example
  static frameworkIntegration() {
    // Example: React component metadata
    const reactComponentMetadata = new WeakMap();
    
    // Hypothetical React integration
    class ComponentMetadata {
      static for(component) {
        if (!reactComponentMetadata.has(component)) {
          reactComponentMetadata.set(component, {
            subscriptions: new Set(),
            timers: new Set(),
            state: {},
            propsHistory: []
          });
        }
        return reactComponentMetadata.get(component);
      }
      
      static cleanup(component) {
        const metadata = reactComponentMetadata.get(component);
        if (metadata) {
          // Cleanup subscriptions and timers
          metadata.subscriptions.forEach(sub => sub.unsubscribe());
          metadata.timers.forEach(timer => clearTimeout(timer));
          reactComponentMetadata.delete(component);
        }
      }
    }
    
    // Usage in hypothetical component
    class MyComponent {
      constructor() {
        this.metadata = ComponentMetadata.for(this);
      }
      
      addSubscription(subscription) {
        this.metadata.subscriptions.add(subscription);
      }
      
      addTimer(timerId) {
        this.metadata.timers.add(timerId);
      }
      
      destroy() {
        ComponentMetadata.cleanup(this);
      }
    }
    
    return { ComponentMetadata, MyComponent };
  }
}
```

### WeakSet Deep Dive

```javascript
// WeakSet: Collection of objects with weak references
class WeakSetExplained {
  // Basic usage
  static basicUsage() {
    const weakSet = new WeakSet();
    
    // Values must be objects
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    
    // Adding objects
    weakSet.add(obj1);
    weakSet.add(obj2);
    weakSet.add(obj3);
    weakSet.add(obj1); // Duplicate - ignored
    
    // Checking membership
    console.log(weakSet.has(obj1)); // true
    console.log(weakSet.has(obj2)); // true
    console.log(weakSet.has({ id: 4 })); // false (different object)
    
    // Deleting
    weakSet.delete(obj1);
    console.log(weakSet.has(obj1)); // false
    
    // Limitations (same as WeakMap):
    // No size property
    // Not iterable
    // No clear() method
    
    return weakSet;
  }
  
  // Use case: Tracking objects without preventing GC
  static objectTracking() {
    const processedObjects = new WeakSet();
    
    class ObjectProcessor {
      process(obj) {
        // Skip if already processed
        if (processedObjects.has(obj)) {
          console.log('Object already processed, skipping');
          return;
        }
        
        // Mark as processed
        processedObjects.add(obj);
        
        // Process the object
        console.log('Processing object:', obj);
        
        // Object can still be GC'd when no longer needed
        // The WeakSet won't prevent it
      }
    }
    
    const processor = new ObjectProcessor();
    const obj = { data: 'test' };
    
    processor.process(obj); // Processes
    processor.process(obj); // Skips (already in WeakSet)
    
    // When 'obj' is no longer referenced elsewhere,
    // it will be removed from the WeakSet automatically
    
    return { processor, processedObjects };
  }
  
  // Use case: Preventing circular references in traversal
  static circularReferenceDetection() {
    const visitedObjects = new WeakSet();
    
    function deepClone(obj) {
      // Base case: not an object or null
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      // Check for circular reference
      if (visitedObjects.has(obj)) {
        throw new Error('Circular reference detected');
      }
      
      // Mark as visited
      visitedObjects.add(obj);
      
      // Create clone
      const clone = Array.isArray(obj) ? [] : {};
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clone[key] = deepClone(obj[key]);
        }
      }
      
      // Note: We don't need to remove from visitedObjects
      // because WeakSet automatically cleans up
      
      return clone;
    }
    
    // Test with circular reference
    const obj = { name: 'Parent' };
    obj.child = { name: 'Child', parent: obj }; // Circular
    
    try {
      const cloned = deepClone(obj);
      console.log('Clone successful');
    } catch (error) {
      console.log('Circular reference caught:', error.message);
    }
    
    return deepClone;
  }
  
  // Use case: Ensuring singleton instances
  static singletonEnforcement() {
    const singletonInstances = new WeakSet();
    
    class Singleton {
      constructor() {
        if (singletonInstances.has(this.constructor)) {
          throw new Error(`${this.constructor.name} is a singleton`);
        }
        singletonInstances.add(this.constructor);
      }
    }
    
    class DatabaseConnection extends Singleton {
      constructor() {
        super();
        this.connected = false;
      }
      
      connect() {
        this.connected = true;
      }
    }
    
    try {
      const db1 = new DatabaseConnection();
      db1.connect();
      
      const db2 = new DatabaseConnection(); // Throws error
    } catch (error) {
      console.log('Singleton enforcement:', error.message);
    }
    
    return Singleton;
  }
  
  // Use case: Event listener management
  static eventListenerManagement() {
    const listenerRegistry = new WeakSet();
    
    class EventManager {
      addListener(element, event, handler) {
        const listener = { element, event, handler };
        
        // Track without preventing GC
        listenerRegistry.add(listener);
        
        element.addEventListener(event, handler);
        
        return listener;
      }
      
      removeListener(listener) {
        if (listenerRegistry.has(listener)) {
          listener.element.removeEventListener(listener.event, listener.handler);
          // No need to delete from WeakSet - it will auto-clean
          return true;
        }
        return false;
      }
      
      // Check if listener is still registered
      hasListener(listener) {
        return listenerRegistry.has(listener);
      }
    }
    
    const manager = new EventManager();
    const button = document.createElement('button');
    
    const listener = manager.addListener(button, 'click', () => {
      console.log('Button clicked');
    });
    
    console.log('Listener registered:', manager.hasListener(listener));
    
    // When listener is no longer referenced, it's automatically
    // removed from the WeakSet (though event listener still exists)
    
    return { manager, button, listener };
  }
}
```

### Comparison: WeakMap vs WeakSet vs Map vs Set

```javascript
class CollectionComparison {
  static createComparisonTable() {
    console.log(`
      Collection Comparison:
      
      ┌─────────────┬────────────┬────────────┬────────────┬────────────┐
      │ Feature     │ Map        │ WeakMap    │ Set        │ WeakSet    │
      ├─────────────┼────────────┼────────────┼────────────┼────────────┤
      │ Key Type    │ Any        │ Objects    │ N/A        │ N/A        │
      │ Value Type  │ Any        │ Any        │ Any        │ Objects    │
      │ Iterable    │ Yes        │ No         │ Yes        │ No         │
      │ .size       │ Yes        │ No         │ Yes        │ No         │
      │ .clear()    │ Yes        │ No         │ Yes        │ No         │
      │ Prevents GC │ Yes        │ No         │ Yes        │ No         │
      │ Use Case    │ General    │ Private    │ Unique     │ Tracking   │
      │             │ storage    │ data,      │ values     │ objects    │
      │             │            │ metadata   │            │            │
      └─────────────┴────────────┴────────────┴────────────┴────────────┘
    `);
  }
  
  static performanceComparison() {
    const iterations = 100000;
    
    // Map performance
    console.time('Map set performance');
    const map = new Map();
    for (let i = 0; i < iterations; i++) {
      map.set({ id: i }, `value${i}`);
    }
    console.timeEnd('Map set performance');
    
    console.time('Map get performance');
    for (let i = 0; i < iterations; i++) {
      map.get({ id: i }); // Won't find (different object)
    }
    console.timeEnd('Map get performance');
    
    // WeakMap performance
    console.time('WeakMap set performance');
    const weakMap = new WeakMap();
    const keys = [];
    for (let i = 0; i < iterations; i++) {
      const key = { id: i };
      keys.push(key);
      weakMap.set(key, `value${i}`);
    }
    console.timeEnd('WeakMap set performance');
    
    console.time('WeakMap get performance');
    for (const key of keys) {
      weakMap.get(key);
    }
    console.timeEnd('WeakMap get performance');
    
    // Memory comparison (conceptual)
    console.log('\nMemory Considerations:');
    console.log('- Map/Set keep objects alive (prevent GC)');
    console.log('- WeakMap/WeakSet allow objects to be GC\'d');
    console.log('- Use Weak collections when you want automatic cleanup');
  }
  
  static useCaseGuidelines() {
    return `
      When to use each collection:
      
      Use Map when:
      • You need to iterate over keys/values
      • You need to know the size
      • Keys are primitives (strings, numbers)
      • You need to store data long-term
      • Example: Configuration, cache with size limit
      
      Use WeakMap when:
      • Keys are objects
      • You want automatic cleanup when keys are GC'd
      • You don't need to iterate or know size
      • Example: Private class data, DOM metadata
      
      Use Set when:
      • You need unique values
      • You need to iterate or know size
      • Values can be any type
      • Example: Collection of user IDs, tags
      
      Use WeakSet when:
      • Values are objects
      • You want automatic cleanup
      • You only need to check membership
      • Example: Tracking processed objects, visited nodes
    `;
  }
}
```

### Advanced WeakMap/WeakSet Patterns

```javascript
class AdvancedWeakPatterns {
  // 1. WeakMap for memoization with automatic cleanup
  static memoizationWithWeakMap() {
    const memoCache = new WeakMap();
    
    function memoize(fn) {
      return function(...args) {
        // Use first argument as key (must be object)
        const key = args[0];
        
        if (!key || typeof key !== 'object') {
          // Fallback to regular memoization for non-objects
          return fn(...args);
        }
        
        if (!memoCache.has(key)) {
          memoCache.set(key, new Map());
        }
        
        const subCache = memoCache.get(key);
        const cacheKey = JSON.stringify(args.slice(1));
        
        if (subCache.has(cacheKey)) {
          return subCache.get(cacheKey);
        }
        
        const result = fn(...args);
        subCache.set(cacheKey, result);
        
        return result;
      };
    }
    
    // Example: Expensive computation on objects
    const computeHash = memoize(function(obj, salt) {
      console.log('Computing hash...');
      // Expensive computation
      let hash = 0;
      for (const key in obj) {
        hash = (hash << 5) - hash + key.charCodeAt(0);
      }
      return hash + salt;
    });
    
    const obj = { a: 1, b: 2 };
    console.log(computeHash(obj, 123)); // Computes
    console.log(computeHash(obj, 123)); // Cached
    console.log(computeHash(obj, 456)); // Computes (different salt)
    
    // When obj is GC'd, its cache entries are automatically removed
    return { memoize, computeHash };
  }
  
  // 2. WeakSet for object registry with cleanup
  static objectRegistry() {
    class Registry {
      constructor() {
        this.registry = new WeakSet();
        this.metadata = new WeakMap();
      }
      
      register(obj, meta = {}) {
        if (this.registry.has(obj)) {
          return false;
        }
        
        this.registry.add(obj);
        this.metadata.set(obj, {
          ...meta,
          registeredAt: new Date()
        });
        
        return true;
      }
      
      unregister(obj) {
        const wasRegistered = this.registry.has(obj);
        this.registry.delete(obj);
        this.metadata.delete(obj);
        return wasRegistered;
      }
      
      isRegistered(obj) {
        return this.registry.has(obj);
      }
      
      getMetadata(obj) {
        return this.metadata.get(obj);
      }
      
      updateMetadata(obj, updates) {
        if (!this.registry.has(obj)) {
          return false;
        }
        
        const current = this.metadata.get(obj) || {};
        this.metadata.set(obj, {
          ...current,
          ...updates,
          updatedAt: new Date()
        });
        
        return true;
      }
    }
    
    // Usage: Plugin system
    const pluginRegistry = new Registry();
    
    class Plugin {
      constructor(name) {
        this.name = name;
        pluginRegistry.register(this, { enabled: true });
      }
      
      enable() {
        pluginRegistry.updateMetadata(this, { enabled: true });
      }
      
      disable() {
        pluginRegistry.updateMetadata(this, { enabled: false });
      }
      
      getStatus() {
        return pluginRegistry.getMetadata(this);
      }
    }
    
    const plugin1 = new Plugin('Analytics');
    console.log('Plugin registered:', pluginRegistry.isRegistered(plugin1));
    console.log('Plugin metadata:', plugin1.getStatus());
    
    // When plugin is no longer needed, it can be GC'd
    // and automatically removed from registry
    
    return { Registry, Plugin, example: plugin1 };
  }
  
  // 3. WeakMap for bidirectional relationships
  static bidirectionalRelationships() {
    // Maintain relationships without preventing GC
    
    class RelationshipManager {
      constructor() {
        this.forward = new WeakMap();  // A -> Set(B)
        this.backward = new WeakMap(); // B -> Set(A)
      }
      
      // Create relationship A -> B
      relate(a, b) {
        // Forward: A knows about B
        if (!this.forward.has(a)) {
          this.forward.set(a, new WeakSet());
        }
        this.forward.get(a).add(b);
        
        // Backward: B knows about A
        if (!this.backward.has(b)) {
          this.backward.set(b, new WeakSet());
        }
        this.backward.get(b).add(a);
      }
      
      // Remove relationship A -> B
      unrelate(a, b) {
        if (this.forward.has(a)) {
          this.forward.get(a).delete(b);
        }
        if (this.backward.has(b)) {
          this.backward.get(b).delete(a);
        }
      }
      
      // Get all Bs related to A
      getRelated(a) {
        if (!this.forward.has(a)) return [];
        
        // Note: Can't iterate WeakSet directly
        // In real implementation, would need additional tracking
        return []; // Simplified
      }
      
      // Check if A is related to B
      isRelated(a, b) {
        return this.forward.has(a) && this.forward.get(a).has(b);
      }
      
      // When A or B is GC'd, relationships are automatically cleaned
    }
    
    // Usage: Social network connections
    const network = new RelationshipManager();
    
    const user1 = { name: 'Alice' };
    const user2 = { name: 'Bob' };
    const user3 = { name: 'Charlie' };
    
    network.relate(user1, user2); // Alice follows Bob
    network.relate(user1, user3); // Alice follows Charlie
    network.relate(user2, user1); // Bob follows Alice
    
    console.log('Alice follows Bob?', network.isRelated(user1, user2));
    console.log('Bob follows Alice?', network.isRelated(user2, user1));
    
    // When users are no longer referenced,
    // their relationships are automatically cleaned up
    
    return { RelationshipManager, network };
  }
  
  // 4. Weak collections for cache invalidation
  static cacheInvalidation() {
    // Cache that automatically invalidates when objects change
    
    class SmartCache {
      constructor() {
        this.cache = new WeakMap();
        this.dependencies = new WeakMap();
      }
      
      // Compute value with dependencies
      compute(key, computeFn, deps = []) {
        // Check cache
        if (this.cache.has(key)) {
          const cached = this.cache.get(key);
          
          // Check if dependencies changed
          if (!this.haveDependenciesChanged(key, deps)) {
            return cached.value;
          }
        }
        
        // Compute new value
        const value = computeFn();
        
        // Store in cache
        this.cache.set(key, {
          value,
          timestamp: Date.now()
        });
        
        // Store dependencies
        this.dependencies.set(key, deps);
        
        return value;
      }
      
      haveDependenciesChanged(key, newDeps) {
        const oldDeps = this.dependencies.get(key) || [];
        
        // If dependencies are objects, we can check references
        // If they're primitives, need different strategy
        if (oldDeps.length !== newDeps.length) {
          return true;
        }
        
        for (let i = 0; i < oldDeps.length; i++) {
          if (oldDeps[i] !== newDeps[i]) {
            return true;
          }
        }
        
        return false;
      }
      
      invalidate(key) {
        this.cache.delete(key);
        this.dependencies.delete(key);
      }
      
      // Automatic invalidation when dependency objects are GC'd
    }
    
    // Usage: Computed property cache
    const cache = new SmartCache();
    
    const user = { id: 1, name: 'Alice' };
    const config = { format: 'uppercase' };
    
    function computeDisplayName() {
      console.log('Computing display name...');
      const name = user.name;
      return config.format === 'uppercase' 
        ? name.toUpperCase() 
        : name;
    }
    
    // First computation
    const result1 = cache.compute(
      { type: 'displayName', userId: user.id },
      computeDisplayName,
      [user, config] // Dependencies
    );
    
    // Second call - cached
    const result2 = cache.compute(
      { type: 'displayName', userId: user.id },
      computeDisplayName,
      [user, config] // Same dependencies
    );
    
    // Change dependency
    config.format = 'lowercase';
    
    // Third call - recomputes (dependency changed)
    const result3 = cache.compute(
      { type: 'displayName', userId: user.id },
      computeDisplayName,
      [user, config] // Changed dependency
    );
    
    console.log('Results:', { result1, result2, result3 });
    
    return { SmartCache, cache };
  }
}
```

---

## Memory Profiling & Optimization

### Memory Profiling Tools and Techniques

```javascript
class MemoryProfiling {
  // Using Chrome DevTools
  static chromeDevToolsGuide() {
    return `
      Chrome DevTools Memory Profiling Guide:
      
      1. Heap Snapshots
        • Take snapshot before and after operations
        • Compare to find memory leaks
        • Look for:
          - Growing number of objects
          - Detached DOM trees
          - Accumulating event listeners
      
      2. Allocation Timeline
        • Record allocations over time
        • Identify allocation patterns
        • Find allocations that aren't freed
      
      3. Allocation Sampling
        • Lightweight profiling
        • Shows allocation sites
        • Good for production profiling
      
      4. Performance Monitor
        • Real-time memory usage
        • JavaScript heap size
        • DOM node count
        • Event listener count
      
      Tips:
      • Use "Comparison" view for snapshots
      • Filter by constructor name
      • Look for retaining paths
      • Check distance from window
    `;
  }
  
  // Using performance.memory API
  static performanceMemoryAPI() {
    if (!performance.memory) {
      return 'performance.memory not available';
    }
    
    const memory = performance.memory;
    
    return {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
      
      // Calculate usage percentage
      usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100) + '%',
      
      // Monitor over time
      startMonitoring(interval = 1000) {
        const measurements = [];
        const intervalId = setInterval(() => {
          measurements.push({
            timestamp: Date.now(),
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize
          });
          
          if (measurements.length > 100) {
            measurements.shift();
          }
        }, interval);
        
        return {
          stop: () => clearInterval(intervalId),
          getMeasurements: () => measurements,
          getStats: () => {
            if (measurements.length === 0) return null;
            
            const usedValues = measurements.map(m => m.used);
            return {
              min: Math.min(...usedValues),
              max: Math.max(...usedValues),
              avg: usedValues.reduce((a, b) => a + b) / usedValues.length,
              trend: measurements[measurements.length - 1].used - measurements[0].used
            };
          }
        };
      }
    };
  }
  
  // Manual memory measurement
  static manualMeasurement() {
    return {
      // Track object counts
      objectCounts: new Map(),
      
      incrementCount(constructorName) {
        const count = this.objectCounts.get(constructorName) || 0;
        this.objectCounts.set(constructorName, count + 1);
      },
      
      decrementCount(constructorName) {
        const count = this.objectCounts.get(constructorName) || 0;
        if (count > 0) {
          this.objectCounts.set(constructorName, count - 1);
        }
      },
      
      getCounts() {
        return Array.from(this.objectCounts.entries())
          .sort((a, b) => b[1] - a[1]);
      },
      
      // Estimate memory usage
      estimateObjectSize(obj) {
        let size = 0;
        
        // Rough estimation (varies by engine)
        if (typeof obj === 'string') {
          size = obj.length * 2; // 2 bytes per character
        } else if (typeof obj === 'number') {
          size = 8; // 8 bytes for double
        } else if (typeof obj === 'boolean') {
          size = 4;
        } else if (Array.isArray(obj)) {
          size = 16; // Array overhead
          size += obj.length * 8; // Reference per element
          obj.forEach(item => {
            size += this.estimateObjectSize(item);
          });
        } else if (typeof obj === 'object' && obj !== null) {
          size = 16; // Object overhead
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              size += key.length * 2; // Key string
              size += this.estimateObjectSize(obj[key]);
            }
          }
        }
        
        return size;
      }
    };
  }
}
```

### Memory Optimization Checklist

```javascript
class MemoryOptimizationChecklist {
  static getChecklist() {
    return `
      Memory Optimization Checklist:
      
      ✅ Avoid Memory Leaks
        • Remove event listeners when done
        • Clear intervals/timeouts
        • Avoid circular references
        • Clean up detached DOM
        • Unsubscribe from observables
      
      ✅ Optimize Object Creation
        • Reuse objects when possible
        • Use object pooling for frequent allocations
        • Initialize all properties in constructor
        • Keep consistent property order
      
      ✅ Optimize Arrays
        • Use typed arrays for numeric data
        • Pre-allocate array size when known
        • Avoid sparse arrays
        • Use same type throughout array
      
      ✅ Optimize Strings
        • Use array.join() for concatenation
        • Avoid string repetition in loops
        • Consider StringBuilder for large strings
      
      ✅ Use Weak Collections
        • Use WeakMap for private data
        • Use WeakSet for object tracking
        • Use Weak references for caches
      
      ✅ Framework Best Practices
        React:
          • Clean up in useEffect return
          • Use useCallback/useMemo
          • Virtualize long lists
          • Unsubscribe from observables
        
        Vue:
          • Clean up in beforeUnmount
          • Clear references in destroyed
          • Use v-once for static content
        
        Angular:
          • Unsubscribe in ngOnDestroy
          • Use async pipe
          • Destroy dynamic components
      
      ✅ Monitoring
        • Regularly check memory usage
        • Profile with Chrome DevTools
        • Set up memory alerts
        • Test for leaks
      
      ✅ Production Considerations
        • Set memory limits
        • Implement graceful degradation
        • Use memory pressure API (when available)
        • Have cleanup strategies
    `;
  }
  
  static quickScan() {
    const issues = [];
    
    // Check for common issues
    if (typeof gc === 'function') {
      console.log('GC is exposed (development mode)');
    }
    
    if (performance.memory) {
      const mem = performance.memory;
      const usage = mem.usedJSHeapSize / mem.jsHeapSizeLimit;
      
      if (usage > 0.8) {
        issues.push('High memory usage (>80%)');
      }
    }
    
    // Check for global variables
    if (Object.keys(window).length > 1000) {
      issues.push('Many global variables');
    }
    
    // Check for event listeners
    const elementsWithListeners = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const listeners = getEventListeners?.(el);
        return listeners && Object.keys(listeners).length > 0;
      });
    
    if (elementsWithListeners.length > 100) {
      issues.push('Many elements with event listeners');
    }
    
    return {
      issues,
      hasIssues: issues.length > 0,
      recommendations: issues.length > 0 
        ? 'Consider running memory profiling'
        : 'No obvious issues detected'
    };
  }
}
```

## 🎯 Interview Questions & Answers

### Common Memory Management Interview Questions

**Q1: Explain how garbage collection works in JavaScript.**
**A:** Modern JavaScript engines use a mark-and-sweep algorithm with generational collection. Objects are divided into young and old generations. The young generation is collected frequently (minor GC/scavenge), while the old generation is collected less often (major GC). The collector marks all reachable objects starting from roots (global object, currently executing functions), then sweeps unmarked objects.

**Q2: What are common causes of memory leaks in JavaScript?**
**A:** Common causes include: 1) Accidental global variables, 2) Forgotten timers/intervals, 3) Closures holding references to large objects, 4) Detached DOM elements with JavaScript references, 5) Event listeners not removed, 6) Caches that never clear, and 7) Promises that never settle.

**Q3: How do WeakMap and WeakSet differ from Map and Set?**
**A:** WeakMap and WeakSet hold "weak" references to their keys/values, meaning they don't prevent garbage collection. They only accept objects as keys/values, don't have iteration methods or size property, and automatically clean up entries when keys/values are garbage collected.

**Q4: How would you detect a memory leak in a production application?**
**A:** Use Chrome DevTools Memory Profiler to take heap snapshots before and after suspicious operations, compare them to find growing object counts. Monitor memory usage over time using performance.memory API. Look for increasing DOM node counts, event listeners, or specific object types. Set up alerts for abnormal memory growth patterns.

**Q5: What's the difference between stack and heap allocation in JavaScript?**
**A:** Stack stores primitive values and references, has automatic allocation/deallocation (LIFO), is limited in size, and is fast. Heap stores objects, arrays, functions, and closures, requires manual memory management (GC), is larger but slower to access, and can have fragmentation.

### Practical Exercises

1. **Implement a memory-leak-free event handler system**
2. **Create an object pool for a particle system**
3. **Write a function that detects circular references**
4. **Implement LRU cache with size limit and TTL**
5. **Profile memory usage of a given function**

### Resources for Further Learning

- **V8 Blog**: Memory management articles
- **Chrome DevTools Documentation**: Memory profiling guide
- **MDN**: Memory Management, WeakMap, WeakSet
- **Books**: "JavaScript: The Definitive Guide" (Memory Management chapter)
- **Tools**: Chrome DevTools, Node.js --inspect, heapdump module

## 📝 Summary

Understanding JavaScript memory management is crucial for building performant, reliable applications. Key takeaways:

1. **Garbage Collection** is automatic but understanding it helps write better code
2. **Memory Leaks** are preventable with proper cleanup and awareness
3. **WeakMap/WeakSet** provide powerful patterns for memory-safe code
4. **Profiling Tools** are essential for identifying and fixing memory issues
5. **Optimization Patterns** like object pooling and consistent object shapes can significantly improve performance

Always profile before optimizing, and remember that the best memory optimization is often using less memory in the first place!