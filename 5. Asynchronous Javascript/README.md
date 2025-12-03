# Asynchronous JavaScript - Comprehensive Guide

## 📚 Overview
Master the art of handling asynchronous operations in JavaScript. This guide covers everything from basic timers to advanced async patterns, error handling, and the underlying event loop mechanics.

## 📋 Table of Contents
1. [setTimeout & setInterval](#1-settimeout--setinterval)
2. [Callback Hell](#2-callback-hell)
3. [Promises](#3-promises)
4. [Promise Chaining](#4-promise-chaining)
5. [async/await](#5-asyncawait)
6. [Error Handling](#6-error-handling-trycatch)
7. [Microtask Queue vs Callback Queue](#7-microtask-queue-vs-callback-queue)
8. [Event Loop](#8-event-loop)
9. [Job Queue](#9-job-queue)
10. [Web APIs](#10-web-apis)
11. [Fetch API](#11-fetch-api)
12. [AbortController](#12-abortcontroller)

---

## 1. setTimeout & setInterval

### **setTimeout**
Executes a function once after a specified delay.

```javascript
// Basic syntax: setTimeout(callback, delay, arg1, arg2, ...)
console.log('Start');

setTimeout(() => {
    console.log('This runs after 2 seconds');
}, 2000);

console.log('End');
// Output: Start, End, This runs after 2 seconds
```

### **Detailed Parameters**
```javascript
function greet(name, punctuation) {
    console.log(`Hello ${name}${punctuation}`);
}

// Passing arguments
setTimeout(greet, 1000, 'John', '!'); // Hello John!

// Clear timeout
const timeoutId = setTimeout(() => {
    console.log('This will not run');
}, 5000);

// Cancel before execution
clearTimeout(timeoutId);
console.log('Timeout cleared');

// Zero delay doesn't mean immediate execution
setTimeout(() => {
    console.log('Zero delay timeout');
}, 0);

console.log('This runs first');
// Output: This runs first, Zero delay timeout
```

### **setInterval**
Repeatedly executes a function at specified intervals.

```javascript
let count = 0;

// Basic interval
const intervalId = setInterval(() => {
    count++;
    console.log(`Count: ${count}`);
    
    if (count === 5) {
        clearInterval(intervalId);
        console.log('Interval stopped');
    }
}, 1000);

// With arguments
function updateCounter(step, max) {
    // Implementation
}
setInterval(updateCounter, 1000, 1, 10);

// Dynamic interval adjustment
let delay = 1000;
let counter = 0;

function dynamicInterval() {
    console.log(`Counter: ${counter}, Delay: ${delay}ms`);
    counter++;
    
    // Increase delay every 3 iterations
    if (counter % 3 === 0) {
        delay += 500;
        clearInterval(intervalId);
        intervalId = setInterval(dynamicInterval, delay);
    }
}

let intervalId = setInterval(dynamicInterval, delay);
```

### **Advanced Patterns**

#### **Debouncing**
```javascript
function debounce(func, wait) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// Usage: Prevent rapid-fire events
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
    console.log(`Searching for: ${query}`);
    // API call would go here
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
```

#### **Throttling**
```javascript
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage: Limit function calls
window.addEventListener('scroll', throttle(() => {
    console.log('Scroll handler called');
    // Expensive DOM operations
}, 1000));
```

#### **Polling with setTimeout**
```javascript
function poll(condition, callback, interval = 1000, timeout = 30000) {
    const startTime = Date.now();
    
    function check() {
        if (condition()) {
            callback();
        } else if (Date.now() - startTime < timeout) {
            setTimeout(check, interval);
        } else {
            console.log('Polling timeout');
        }
    }
    
    check();
}

// Usage: Wait for element to appear
poll(
    () => document.querySelector('.dynamic-content'),
    () => {
        console.log('Content loaded!');
        // Initialize content
    },
    500,  // Check every 500ms
    10000 // Timeout after 10 seconds
);
```

### **Performance Considerations**
```javascript
// Nested timeouts for better performance than setInterval
let iteration = 0;

function processNext() {
    // Do work
    console.log(`Processing iteration ${iteration}`);
    iteration++;
    
    // Schedule next iteration
    if (iteration < 10) {
        setTimeout(processNext, 100);
    }
}

processNext();

// vs setInterval which can overlap
let overlappingCount = 0;
const problematicInterval = setInterval(() => {
    // Simulate async work that takes varying time
    const workTime = Math.random() * 2000;
    
    setTimeout(() => {
        overlappingCount++;
        console.log(`Overlap count: ${overlappingCount}`);
        
        if (overlappingCount >= 5) {
            clearInterval(problematicInterval);
        }
    }, workTime);
}, 1000); // This can cause overlaps!
```

---

## 2. Callback Hell

### **What is Callback Hell?**
Callback hell (also known as pyramid of doom) occurs when you have multiple nested callbacks, making code hard to read and maintain.

```javascript
// Classic callback hell example
getUser(1, (user) => {
    getPosts(user.id, (posts) => {
        getComments(posts[0].id, (comments) => {
            getReplies(comments[0].id, (replies) => {
                console.log('All data:', { user, posts, comments, replies });
            }, (error) => {
                console.error('Error getting replies:', error);
            });
        }, (error) => {
            console.error('Error getting comments:', error);
        });
    }, (error) => {
        console.error('Error getting posts:', error);
    });
}, (error) => {
    console.error('Error getting user:', error);
});
```

### **Problems with Callback Hell**
1. **Hard to read and understand**
2. **Error handling becomes complex**
3. **Difficult to maintain and modify**
4. **Hard to reason about execution flow**
5. **Callback functions can be called multiple times**

### **Solutions to Callback Hell**

#### **1. Named Functions (Modularization)**
```javascript
function handleUser(user) {
    getPosts(user.id, handlePosts, handlePostsError);
}

function handlePosts(posts) {
    getComments(posts[0].id, handleComments, handleCommentsError);
}

function handleComments(comments) {
    getReplies(comments[0].id, handleReplies, handleRepliesError);
}

function handleReplies(replies) {
    console.log('All data loaded');
}

// Error handlers
function handleUserError(error) {
    console.error('Error getting user:', error);
}

function handlePostsError(error) {
    console.error('Error getting posts:', error);
}

// Usage
getUser(1, handleUser, handleUserError);
```

#### **2. Using Async.js Library**
```javascript
// Async.js provides control flow functions
// npm install async

// Example with waterfall pattern
async.waterfall([
    function(callback) {
        getUser(1, callback);
    },
    function(user, callback) {
        getPosts(user.id, (err, posts) => {
            callback(err, user, posts);
        });
    },
    function(user, posts, callback) {
        getComments(posts[0].id, (err, comments) => {
            callback(err, user, posts, comments);
        });
    }
], function(err, user, posts, comments) {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('All data:', { user, posts, comments });
    }
});
```

#### **3. Promises (Modern Solution)**
```javascript
getUser(1)
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => getReplies(comments[0].id))
    .then(replies => {
        console.log('All data loaded');
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

#### **4. Async/Await (Cleanest Solution)**
```javascript
async function loadAllData() {
    try {
        const user = await getUser(1);
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        const replies = await getReplies(comments[0].id);
        
        console.log('All data:', { user, posts, comments, replies });
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### **Callback Best Practices**

#### **1. Error-First Callbacks (Node.js Convention)**
```javascript
function readFile(path, callback) {
    // Simulating async operation
    setTimeout(() => {
        if (Math.random() > 0.5) {
            // Success
            callback(null, `Contents of ${path}`);
        } else {
            // Error
            callback(new Error('File read failed'), null);
        }
    }, 1000);
}

// Usage
readFile('/path/to/file', (error, data) => {
    if (error) {
        console.error('Error reading file:', error);
        return;
    }
    console.log('File contents:', data);
});
```

#### **2. Ensure Callbacks are Called Once**
```javascript
function processRequest(data, callback) {
    let callbackCalled = false;
    
    // Simulate async work
    setTimeout(() => {
        if (!callbackCalled) {
            callbackCalled = true;
            callback(null, 'Processed: ' + data);
        }
    }, 1000);
    
    // Another async operation
    setTimeout(() => {
        if (!callbackCalled) {
            callbackCalled = true;
            callback(new Error('Second callback'), null);
        }
    }, 500);
}

// Better: Use a wrapper
function once(fn) {
    let called = false;
    
    return function(...args) {
        if (!called) {
            called = true;
            fn.apply(this, args);
        }
    };
}

function safeProcess(data, callback) {
    const safeCallback = once(callback);
    
    // Now safeCallback can only be called once
    setTimeout(() => safeCallback(null, 'Result 1'), 100);
    setTimeout(() => safeCallback(null, 'Result 2'), 200);
}
```

#### **3. Avoid Callbacks in Loops**
```javascript
// Problem: Callbacks in loops can lead to closure issues
for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i); // Always 5
    }, 100);
}

// Solution 1: Use let (block scope)
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i); // 0, 1, 2, 3, 4
    }, 100);
}

// Solution 2: IIFE (before let existed)
for (var i = 0; i < 5; i++) {
    (function(index) {
        setTimeout(() => {
            console.log(index); // 0, 1, 2, 3, 4
        }, 100);
    })(i);
}

// Solution 3: Use forEach
[0, 1, 2, 3, 4].forEach(i => {
    setTimeout(() => {
        console.log(i); // 0, 1, 2, 3, 4
    }, 100);
});
```

---

## 3. Promises

### **What is a Promise?**
A Promise is an object representing the eventual completion or failure of an asynchronous operation.

### **Promise States**
1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

### **Creating Promises**
```javascript
// Basic promise creation
const promise = new Promise((resolve, reject) => {
    // Async operation
    setTimeout(() => {
        const success = Math.random() > 0.5;
        
        if (success) {
            resolve('Operation succeeded!');
        } else {
            reject(new Error('Operation failed'));
        }
    }, 1000);
});

// Using the promise
promise
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error.message);
    })
    .finally(() => {
        console.log('Promise settled (success or failure)');
    });
```

### **Promise Static Methods**

#### **Promise.resolve()**
```javascript
// Creates a resolved promise
const resolvedPromise = Promise.resolve('Immediate value');

// Equivalent to:
const equivalent = new Promise(resolve => {
    resolve('Immediate value');
});

// Useful for converting values to promises
function fetchData(id) {
    if (!id) {
        return Promise.resolve(null); // Return resolved promise
    }
    // Actual async operation
}

// Also works with thenables
const thenable = {
    then: function(resolve, reject) {
        resolve('Thenable resolved');
    }
};

Promise.resolve(thenable).then(value => {
    console.log(value); // 'Thenable resolved'
});
```

#### **Promise.reject()**
```javascript
// Creates a rejected promise
const rejectedPromise = Promise.reject(new Error('Failed immediately'));

// Equivalent to:
const equivalent = new Promise((resolve, reject) => {
    reject(new Error('Failed immediately'));
});

// Useful for error handling patterns
function validateInput(input) {
    if (!input) {
        return Promise.reject(new Error('Input required'));
    }
    return processInput(input);
}
```

#### **Promise.all()**
```javascript
// Waits for all promises to resolve, or rejects if any fails
const promises = [
    fetch('/api/users/1'),
    fetch('/api/users/2'),
    fetch('/api/users/3')
];

Promise.all(promises)
    .then(responses => {
        // All promises resolved
        return Promise.all(responses.map(r => r.json()));
    })
    .then(users => {
        console.log('All users:', users);
    })
    .catch(error => {
        // If any promise rejects, catch is called immediately
        console.error('One request failed:', error);
    });

// Real example with different async operations
async function loadDashboardData() {
    const [user, posts, notifications] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchNotifications()
    ]);
    
    return { user, posts, notifications };
}
```

#### **Promise.allSettled()**
```javascript
// Waits for all promises to settle (resolve or reject)
const promises = [
    Promise.resolve('Success 1'),
    Promise.reject(new Error('Failure 1')),
    Promise.resolve('Success 2')
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index}:`, result.value);
            } else {
                console.log(`Promise ${index} failed:`, result.reason);
            }
        });
    });

// Useful for batch operations where you want all results
async function batchUpdate(items) {
    const promises = items.map(item => updateItem(item));
    const results = await Promise.allSettled(promises);
    
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason);
    
    return { successful, failed };
}
```

#### **Promise.race()**
```javascript
// Returns first promise that settles (resolve or reject)
const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 5000);
});

const fetchPromise = fetch('/api/data');

Promise.race([fetchPromise, timeout])
    .then(response => {
        console.log('Data fetched before timeout');
        return response.json();
    })
    .catch(error => {
        console.error('Error or timeout:', error.message);
    });

// Real-world: Implement timeout for any promise
function withTimeout(promise, timeoutMs, timeoutMessage = 'Operation timed out') {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}
```

#### **Promise.any()**
```javascript
// Returns first promise that fulfills (resolves)
// Only rejects if ALL promises reject
const promises = [
    Promise.reject(new Error('Error 1')),
    new Promise(resolve => setTimeout(() => resolve('First success'), 100)),
    new Promise(resolve => setTimeout(() => resolve('Second success'), 50))
];

Promise.any(promises)
    .then(firstSuccess => {
        console.log('First successful result:', firstSuccess);
    })
    .catch(errors => {
        // errors is an AggregateError
        console.log('All promises rejected:', errors.errors);
    });

// Useful for redundant requests
function fetchFromMultipleSources(urls) {
    const promises = urls.map(url => fetch(url).then(r => r.json()));
    return Promise.any(promises);
}
```

### **Promise Instance Methods**

#### **.then()**
```javascript
// Can take two arguments: onFulfilled and onRejected
promise.then(
    value => {
        console.log('Resolved with:', value);
        return value * 2; // Return value for next .then()
    },
    error => {
        console.error('Rejected with:', error);
        throw new Error('New error'); // Can rethrow
    }
);

// Chaining
fetch('/api/data')
    .then(response => response.json())
    .then(data => processData(data))
    .then(result => saveResult(result))
    .then(saved => console.log('Saved:', saved));
```

#### **.catch()**
```javascript
// Catches any rejection in the chain
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        if (!data.valid) {
            throw new Error('Invalid data');
        }
        return data;
    })
    .catch(error => {
        console.error('Error in chain:', error);
        return { fallback: 'data' }; // Provide fallback
    })
    .then(data => {
        // Receives either real data or fallback
        console.log('Processing:', data);
    });
```

#### **.finally()**
```javascript
// Runs regardless of promise outcome
let isLoading = true;

fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
    .finally(() => {
        isLoading = false;
        console.log('Request completed (success or failure)');
    });

// Cannot modify the result
fetch('/api/data')
    .finally(() => {
        console.log('Cleaning up');
        // Return value is ignored unless it's a rejected promise
    })
    .then(result => {
        // result is from the original promise
    });
```

### **Promise Patterns**

#### **1. Promise Memoization**
```javascript
function memoizeAsync(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const promise = fn.apply(this, args);
        cache.set(key, promise);
        
        // Remove from cache if promise rejects
        promise.catch(() => cache.delete(key));
        
        return promise;
    };
}

// Usage
const expensiveApiCall = memoizeAsync(async (id) => {
    const response = await fetch(`/api/items/${id}`);
    return response.json();
});

// Same ID = same promise
expensiveApiCall(1).then(console.log);
expensiveApiCall(1).then(console.log); // Uses cached promise
```

#### **2. Promise Pool (Rate Limiting)**
```javascript
class PromisePool {
    constructor(maxConcurrent) {
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.running = 0;
    }
    
    add(promiseFactory) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promiseFactory,
                resolve,
                reject
            });
            this.run();
        });
    }
    
    run() {
        while (this.queue.length && this.running < this.maxConcurrent) {
            const task = this.queue.shift();
            this.running++;
            
            task.promiseFactory()
                .then(task.resolve)
                .catch(task.reject)
                .finally(() => {
                    this.running--;
                    this.run();
                });
        }
    }
}

// Usage
const pool = new PromisePool(3); // Max 3 concurrent promises

for (let i = 0; i < 10; i++) {
    pool.add(() => fetch(`/api/items/${i}`).then(r => r.json()))
        .then(data => console.log(`Item ${i}:`, data));
}
```

#### **3. Promise Retry**
```javascript
function retry(fn, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        const attempt = (attemptNumber) => {
            fn()
                .then(resolve)
                .catch(error => {
                    if (attemptNumber >= retries) {
                        reject(error);
                        return;
                    }
                    
                    console.log(`Attempt ${attemptNumber} failed, retrying in ${delay}ms`);
                    
                    setTimeout(() => {
                        attempt(attemptNumber + 1);
                    }, delay);
                });
        };
        
        attempt(1);
    });
}

// Usage with exponential backoff
function retryWithBackoff(fn, retries = 5, baseDelay = 1000) {
    return new Promise((resolve, reject) => {
        const attempt = (attemptNumber) => {
            fn()
                .then(resolve)
                .catch(error => {
                    if (attemptNumber >= retries) {
                        reject(error);
                        return;
                    }
                    
                    const delay = baseDelay * Math.pow(2, attemptNumber - 1);
                    console.log(`Attempt ${attemptNumber} failed, retrying in ${delay}ms`);
                    
                    setTimeout(() => {
                        attempt(attemptNumber + 1);
                    }, delay);
                });
        };
        
        attempt(1);
    });
}
```

---

## 4. Promise Chaining

### **Basic Chaining**
```javascript
// Each .then() returns a new promise
fetch('/api/data')
    .then(response => {
        console.log('Response received');
        return response.json(); // Returns promise
    })
    .then(data => {
        console.log('Data parsed:', data);
        return processData(data); // Returns promise
    })
    .then(result => {
        console.log('Data processed:', result);
        return saveResult(result); // Returns promise
    })
    .then(savedId => {
        console.log('Saved with ID:', savedId);
    })
    .catch(error => {
        console.error('Error in chain:', error);
    });
```

### **Return Values in Chains**
```javascript
// Returning a value
Promise.resolve(10)
    .then(value => {
        console.log(value); // 10
        return value * 2; // 20 (wrapped in promise)
    })
    .then(value => {
        console.log(value); // 20
        return value + 5; // 25
    })
    .then(value => {
        console.log(value); // 25
        // No return = undefined
    })
    .then(value => {
        console.log(value); // undefined
    });

// Returning a promise
Promise.resolve(1)
    .then(value => {
        return new Promise(resolve => {
            setTimeout(() => resolve(value * 2), 1000);
        });
    })
    .then(value => {
        console.log(value); // 2 (after 1 second)
    });
```

### **Error Handling in Chains**
```javascript
// Errors propagate through the chain
Promise.reject(new Error('Initial error'))
    .then(value => {
        console.log('This never runs');
        return value;
    })
    .then(value => {
        console.log('This also never runs');
        return value;
    })
    .catch(error => {
        console.error('Caught error:', error.message); // Initial error
        return 'Recovered value';
    })
    .then(value => {
        console.log('Chain continues:', value); // Recovered value
    });

// Throwing errors
Promise.resolve('data')
    .then(value => {
        if (!value) {
            throw new Error('No data');
        }
        return value.toUpperCase();
    })
    .then(value => {
        console.log('Uppercase:', value);
        throw new Error('Intentional error');
    })
    .catch(error => {
        console.error('Caught:', error.message); // Intentional error
    });
```

### **Multiple Chains vs Single Chain**
```javascript
// Single chain (sequential)
fetchUser()
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .then(comments => console.log(comments));

// Multiple independent chains (parallel)
const userPromise = fetchUser();
const postsPromise = fetchPosts();
const commentsPromise = fetchComments();

userPromise.then(user => console.log('User:', user));
postsPromise.then(posts => console.log('Posts:', posts));
commentsPromise.then(comments => console.log('Comments:', comments));

// Wait for all
Promise.all([userPromise, postsPromise, commentsPromise])
    .then(([user, posts, comments]) => {
        console.log('All data:', { user, posts, comments });
    });
```

### **Advanced Chaining Patterns**

#### **1. Conditional Chaining**
```javascript
function fetchData(needsAuth) {
    return Promise.resolve()
        .then(() => {
            if (needsAuth) {
                return checkAuth();
            }
            // Return undefined to continue chain
        })
        .then(auth => {
            if (needsAuth && !auth) {
                throw new Error('Unauthorized');
            }
            return fetch('/api/data');
        })
        .then(response => response.json());
}
```

#### **2. Pipeline Pattern**
```javascript
const pipeline = (...functions) => 
    (initialValue) => 
        functions.reduce(
            (promise, fn) => promise.then(fn),
            Promise.resolve(initialValue)
        );

// Usage
const processUser = pipeline(
    id => fetch(`/api/users/${id}`).then(r => r.json()),
    user => validateUser(user),
    user => enrichUserData(user),
    user => saveUser(user)
);

processUser(123)
    .then(user => console.log('Processed user:', user))
    .catch(error => console.error('Processing failed:', error));
```

#### **3. Tap Pattern (Side Effects)**
```javascript
// Utility function for side effects
const tap = (fn) => (value) => {
    fn(value);
    return value;
};

// Usage
fetch('/api/data')
    .then(response => response.json())
    .then(tap(data => console.log('Raw data:', data)))
    .then(processData)
    .then(tap(result => console.log('Processed:', result)))
    .then(saveData);
```

#### **4. Retry with Exponential Backoff in Chain**
```javascript
function fetchWithRetry(url, retries = 3) {
    let attempt = 0;
    
    function attemptFetch() {
        attempt++;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                if (attempt >= retries) {
                    throw error;
                }
                
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`Retry ${attempt} in ${delay}ms`);
                
                return new Promise(resolve => {
                    setTimeout(() => resolve(attemptFetch()), delay);
                });
            });
    }
    
    return attemptFetch();
}
```

### **Common Pitfalls**

#### **1. Forgetting to Return**
```javascript
// BAD: Forgetting return in .then()
fetch('/api/data')
    .then(response => {
        response.json(); // Missing return!
    })
    .then(data => {
        console.log(data); // undefined
    });

// GOOD: Always return
fetch('/api/data')
    .then(response => {
        return response.json(); // Return the promise
    })
    .then(data => {
        console.log(data); // Actual data
    });
```

#### **2. Nesting Promises Unnecessarily**
```javascript
// BAD: Nested promises
fetch('/api/data')
    .then(response => {
        response.json().then(data => {
            processData(data).then(result => {
                console.log(result);
            });
        });
    });

// GOOD: Flatten the chain
fetch('/api/data')
    .then(response => response.json())
    .then(data => processData(data))
    .then(result => console.log(result));
```

#### **3. Not Handling Errors**
```javascript
// BAD: No error handling
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data));

// GOOD: Always handle errors
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Fetch failed:', error))
    .finally(() => console.log('Request completed'));
```

---

## 5. async/await

### **Basic Syntax**
```javascript
// async function always returns a promise
async function fetchData() {
    // await pauses execution until promise settles
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
}

// Usage
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Async function expressions
const fetchUser = async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
};

// Async arrow functions
const processItem = async item => {
    const result = await processAsync(item);
    return result;
};
```

### **await Behavior**
```javascript
// await only works inside async functions
async function example() {
    // Waits for promise to resolve
    const value = await Promise.resolve(42);
    console.log(value); // 42
    
    // If promise rejects, throws error
    try {
        await Promise.reject(new Error('Failed'));
    } catch (error) {
        console.error('Caught:', error.message);
    }
    
    // Non-promise values are converted to resolved promises
    const str = await 'hello'; // Works fine
    console.log(str); // 'hello'
}

// Parallel execution with await
async function parallel() {
    // Start all promises
    const promise1 = fetch('/api/data1');
    const promise2 = fetch('/api/data2');
    const promise3 = fetch('/api/data3');
    
    // Wait for all to complete
    const [data1, data2, data3] = await Promise.all([
        promise1,
        promise2,
        promise3
    ]);
    
    return { data1, data2, data3 };
}
```

### **Error Handling Patterns**
```javascript
// 1. try/catch block
async function fetchWithTryCatch() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch failed:', error);
        // Return fallback or rethrow
        return { fallback: true };
    }
}

// 2. .catch() on the returned promise
async function fetchData() {
    const response = await fetch('/api/data');
    return response.json();
}

fetchData().catch(error => {
    console.error('Failed:', error);
});

// 3. Higher-order function for error handling
function withErrorHandling(fn) {
    return async function(...args) {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Error in', fn.name, ':', error);
            // Handle error or return fallback
            return null;
        }
    };
}

const safeFetchData = withErrorHandling(fetchData);
```

### **Async Iteration**
```javascript
// for-await-of loop
async function processItems(items) {
    for await (const item of items) {
        const result = await processAsync(item);
        console.log('Processed:', result);
    }
}

// Async generators
async function* asyncGenerator() {
    let i = 0;
    while (i < 3) {
        // Simulate async data
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield i++;
    }
}

(async () => {
    for await (const num of asyncGenerator()) {
        console.log(num); // 0, 1, 2 (with 1 second delay)
    }
})();
```

### **Advanced Patterns**

#### **1. Async Pool (Concurrency Control)**
```javascript
async function asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];
    
    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item));
        ret.push(p);
        
        if (poolLimit <= array.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            
            if (executing.length >= poolLimit) {
                await Promise.race(executing);
            }
        }
    }
    
    return Promise.all(ret);
}

// Usage
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
asyncPool(2, urls, async url => {
    const response = await fetch(url);
    return response.json();
}).then(results => {
    console.log('All results:', results);
});
```

#### **2. Async Retry Pattern**
```javascript
async function retryAsync(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            
            console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Exponential backoff
            delay *= 2;
        }
    }
}

// Usage
const data = await retryAsync(
    () => fetch('/api/data').then(r => r.json()),
    5,  // 5 retries
    100 // Initial 100ms delay
);
```

#### **3. Async Timeout**
```javascript
function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout after ${ms}ms`));
        }, ms);
        
        promise
            .then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(timer));
    });
}

// Usage with async/await
async function fetchWithTimeout(url, timeoutMs = 5000) {
    try {
        const response = await timeout(timeoutMs, fetch(url));
        return await response.json();
    } catch (error) {
        console.error('Fetch failed or timed out:', error);
        throw error;
    }
}
```

#### **4. Async Queue**
```javascript
class AsyncQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    enqueue(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        const { task, resolve, reject } = this.queue.shift();
        
        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.processing = false;
            this.process();
        }
    }
}

// Usage
const queue = new AsyncQueue();

// All tasks will execute sequentially
queue.enqueue(() => fetch('/api/task1'));
queue.enqueue(() => fetch('/api/task2'));
queue.enqueue(() => fetch('/api/task3'));
```

### **Common Mistakes**

#### **1. Unnecessary await**
```javascript
// BAD: Unnecessary sequential execution
async function processAll(items) {
    const results = [];
    for (const item of items) {
        // Each await waits for previous to complete
        results.push(await processItem(item));
    }
    return results;
}

// GOOD: Process in parallel
async function processAllParallel(items) {
    const promises = items.map(item => processItem(item));
    return Promise.all(promises);
}

// GOOD: Limited concurrency
async function processAllWithLimit(items, concurrency = 3) {
    const results = [];
    
    for (let i = 0; i < items.length; i += concurrency) {
        const chunk = items.slice(i, i + concurrency);
        const chunkResults = await Promise.all(
            chunk.map(item => processItem(item))
        );
        results.push(...chunkResults);
    }
    
    return results;
}
```

#### **2. Forgetting await**
```javascript
// BAD: Missing await
async function getData() {
    const response = fetch('/api/data'); // Missing await!
    return response.json(); // Error: response is a promise
}

// GOOD: Proper await
async function getData() {
    const response = await fetch('/api/data');
    return response.json();
}
```

#### **3. Not handling promise rejections**
```javascript
// BAD: Unhandled promise rejection
async function riskyOperation() {
    const data = await fetch('/api/data');
    return data.json();
}

// No error handling - rejection will be unhandled

// GOOD: Proper error handling
async function safeOperation() {
    try {
        const data = await fetch('/api/data');
        return await data.json();
    } catch (error) {
        console.error('Operation failed:', error);
        throw error; // Or return fallback
    }
}
```

---

## 6. Error Handling (try/catch)

### **Basic try/catch with Async**
```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        // Rethrow or return fallback
        throw error;
    } finally {
        console.log('Fetch attempt completed');
    }
}

// Usage
fetchData()
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Outer catch:', error));
```

### **Error Types in Async Code**
```javascript
async function demonstrateErrors() {
    try {
        // 1. Network errors
        const response = await fetch('https://invalid-url');
        
        // 2. HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // 3. JSON parsing errors
        const data = await response.json();
        
        // 4. Business logic errors
        if (!data.valid) {
            throw new Error('Invalid data format');
        }
        
        // 5. Runtime errors
        undefined.function(); // TypeError
        
        return data;
    } catch (error) {
        // Handle different error types
        if (error instanceof TypeError) {
            console.error('Type error:', error.message);
        } else if (error instanceof SyntaxError) {
            console.error('JSON parsing error:', error.message);
        } else if (error.name === 'AbortError') {
            console.error('Request aborted');
        } else {
            console.error('Unknown error:', error);
        }
        
        // Add context
        error.context = { timestamp: new Date().toISOString() };
        throw error;
    }
}
```

### **Global Error Handling**

#### **Window Error Events**
```javascript
// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent browser logging
});

// Global errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to error tracking service
    // logErrorToService(event.error);
});
```

#### **Node.js Error Handling**
```javascript
// In Node.js
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Should restart the process in production
    process.exit(1);
});
```

### **Error Boundaries (React)**
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        // Log error to service
        console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <div>Something went wrong: {this.state.error.message}</div>;
        }
        
        return this.props.children;
    }
}

// Usage
<ErrorBoundary>
    <MyAsyncComponent />
</ErrorBoundary>
```

### **Custom Error Classes**
```javascript
class NetworkError extends Error {
    constructor(message, statusCode, url) {
        super(message);
        this.name = 'NetworkError';
        this.statusCode = statusCode;
        this.url = url;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            url: this.url,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

class ValidationError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}

// Usage
async function fetchWithCustomError() {
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new NetworkError(
                'Request failed',
                response.status,
                '/api/data'
            );
        }
        
        const data = await response.json();
        
        if (!data.valid) {
            throw new ValidationError('Invalid data', 'valid', data.valid);
        }
        
        return data;
    } catch (error) {
        if (error instanceof NetworkError) {
            console.error('Network error:', error.toJSON());
        } else if (error instanceof ValidationError) {
            console.error('Validation error:', error.field, error.value);
        }
        throw error;
    }
}
```

### **Error Recovery Strategies**
```javascript
async function resilientFetch(url, options = {}) {
    const { retries = 3, fallbackData = null, timeout = 5000 } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Add timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt === retries) {
                console.log('All attempts failed, using fallback');
                return fallbackData;
            }
            
            // Exponential backoff
            const delay = Math.pow(2, attempt) * 100;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
```

### **Error Logging and Monitoring**
```javascript
class ErrorLogger {
    constructor(serviceUrl) {
        this.serviceUrl = serviceUrl;
        this.queue = [];
        this.flushing = false;
    }
    
    log(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            context: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                ...context
            }
        };
        
        this.queue.push(errorEntry);
        this.flush();
    }
    
    async flush() {
        if (this.flushing || this.queue.length === 0) return;
        
        this.flushing = true;
        
        try {
            // Send errors in batches
            const batch = this.queue.splice(0, 10);
            
            await fetch(this.serviceUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errors: batch })
            });
            
        } catch (error) {
            console.error('Failed to send errors:', error);
            // Requeue failed entries
            this.queue.unshift(...batch);
        } finally {
            this.flushing = false;
            
            // If more errors accumulated while flushing
            if (this.queue.length > 0) {
                setTimeout(() => this.flush(), 1000);
            }
        }
    }
}

// Usage
const logger = new ErrorLogger('/api/errors');

async function safeOperation() {
    try {
        // Operation that might fail
    } catch (error) {
        logger.log(error, { operation: 'safeOperation' });
        throw error;
    }
}
```

---

## 7. Microtask Queue vs Callback Queue

### **Understanding the Event Loop Queues**
```javascript
console.log('Script start'); // 1

setTimeout(() => {
    console.log('setTimeout'); // 5
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise 1'); // 3
    })
    .then(() => {
        console.log('Promise 2'); // 4
    });

console.log('Script end'); // 2

// Output order:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout
```

### **Microtask Queue**
Microtasks are executed after the current task completes and before the next task from the callback queue.

**What goes to microtask queue:**
- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- `MutationObserver` callbacks
- `process.nextTick()` (Node.js)

```javascript
// Microtask example
console.log('Start');

Promise.resolve().then(() => {
    console.log('Microtask 1');
});

queueMicrotask(() => {
    console.log('Microtask 2');
});

console.log('End');

// Output: Start, End, Microtask 1, Microtask 2
```

### **Callback Queue (Task Queue)**
Callbacks are executed after all microtasks from the current task are complete.

**What goes to callback queue:**
- `setTimeout` and `setInterval` callbacks
- DOM event handlers (click, scroll, etc.)
- `requestAnimationFrame` callbacks
- I/O operations (Node.js)
- `setImmediate` (Node.js)

```javascript
// Callback queue example
console.log('Start');

setTimeout(() => {
    console.log('Timeout callback');
}, 0);

console.log('End');

// Output: Start, End, Timeout callback
```

### **Visualizing the Difference**
```javascript
console.log('1: Sync code');

setTimeout(() => console.log('2: Timeout (Task Queue)'), 0);

Promise.resolve()
    .then(() => console.log('3: Promise (Microtask Queue)'));

queueMicrotask(() => console.log('4: queueMicrotask (Microtask Queue)'));

console.log('5: Sync code');

// Output:
// 1: Sync code
// 5: Sync code
// 3: Promise (Microtask Queue)
// 4: queueMicrotask (Microtask Queue)
// 2: Timeout (Task Queue)
```

### **Nested Queues**
```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout 1');
    
    Promise.resolve().then(() => {
        console.log('Promise inside timeout');
    });
}, 0);

setTimeout(() => {
    console.log('Timeout 2');
}, 0);

Promise.resolve().then(() => {
    console.log('Promise 1');
    
    queueMicrotask(() => {
        console.log('queueMicrotask inside Promise');
    });
});

Promise.resolve().then(() => {
    console.log('Promise 2');
});

console.log('End');

/*
Output:
Start
End
Promise 1
Promise 2
queueMicrotask inside Promise
Timeout 1
Promise inside timeout
Timeout 2
*/
```

### **Real-World Implications**

#### **1. UI Blocking**
```javascript
// BAD: Long-running microtasks block UI
button.addEventListener('click', () => {
    // This blocks UI updates until complete
    Promise.resolve().then(() => {
        let sum = 0;
        for (let i = 0; i < 1000000000; i++) {
            sum += i;
        }
        console.log('Sum:', sum);
    });
});

// BETTER: Break up work
button.addEventListener('click', async () => {
    function chunkedWork(start, end) {
        return new Promise(resolve => {
            // Use setTimeout to yield to UI
            setTimeout(() => {
                let sum = 0;
                for (let i = start; i < end; i++) {
                    sum += i;
                }
                resolve(sum);
            }, 0);
        });
    }
    
    const total = 1000000000;
    const chunkSize = 10000000;
    let result = 0;
    
    for (let i = 0; i < total; i += chunkSize) {
        result += await chunkedWork(i, Math.min(i + chunkSize, total));
    }
    
    console.log('Sum:', result);
});
```

#### **2. Rendering Priority**
```javascript
// Update DOM in microtask vs task
const element = document.getElementById('myElement');

// Using microtask (renders after both updates)
Promise.resolve().then(() => {
    element.style.color = 'red';
});

Promise.resolve().then(() => {
    element.textContent = 'Updated';
});

// Using setTimeout (may cause separate renders)
setTimeout(() => {
    element.style.color = 'blue';
}, 0);

setTimeout(() => {
    element.textContent = 'Updated again';
}, 0);
```

### **queueMicrotask API**
```javascript
// queueMicrotask is a modern alternative to Promise.resolve().then()
console.log('Before microtask');

queueMicrotask(() => {
    console.log('Microtask executed');
});

console.log('After microtask');

// vs Promise
Promise.resolve().then(() => {
    console.log('Promise microtask');
});

// Benefits of queueMicrotask:
// 1. More explicit intent
// 2. Slightly better performance
// 3. No promise overhead

// Example: Ensure code runs after current task
function defer(callback) {
    queueMicrotask(callback);
}

defer(() => {
    console.log('Deferred execution');
});
```

### **Priority Order in Practice**
```javascript
// Complete example showing all priorities
console.log('1: Script start');

// Macro tasks (callback queue)
setTimeout(() => console.log('2: setTimeout'), 0);
setImmediate(() => console.log('3: setImmediate (Node.js)'));
requestAnimationFrame(() => console.log('4: requestAnimationFrame'));

// Micro tasks
Promise.resolve().then(() => console.log('5: Promise'));
queueMicrotask(() => console.log('6: queueMicrotask'));

// Sync code
console.log('7: Script end');

// Event listener (macro task)
button.addEventListener('click', () => {
    console.log('8: Click event');
});

/*
Typical browser output:
1: Script start
7: Script end
5: Promise
6: queueMicrotask
4: requestAnimationFrame (before paint)
2: setTimeout
8: Click event (when clicked)

Node.js output (different order):
1: Script start
7: Script end
5: Promise
6: queueMicrotask
3: setImmediate
2: setTimeout
*/
```

---

## 8. Event Loop

### **What is the Event Loop?**
The event loop is JavaScript's concurrency model that allows non-blocking I/O operations despite JavaScript being single-threaded.

### **Visual Representation**
```
┌───────────────────────────┐
│     Call Stack            │
│  (LIFO - Last In First Out)│
└───────────────────────────┘
            │
            ▼
┌───────────────────────────┐
│     Event Loop            │
│ 1. Execute run-to-completion│
│ 2. Check Callback Queue   │
│ 3. Check Microtask Queue  │
└───────────────────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌─────────┐   ┌─────────┐
│ Callback│   │Microtask│
│  Queue  │   │  Queue  │
│ (Tasks) │   │         │
└─────────┘   └─────────┘
    │               │
    ▼               ▼
Web APIs/Timers   Promises
```

### **Event Loop Phases**
```javascript
// The event loop processes different phases
console.log('1: Start');

// Timer phase
setTimeout(() => console.log('2: Timer'), 0);

// I/O callbacks phase (Node.js)
// File reading, network requests

// Idle, prepare phase (internal)

// Poll phase (retrieve new I/O events)

// Check phase (setImmediate callbacks)
setImmediate(() => console.log('3: setImmediate'));

// Close callbacks phase (cleanup)

// Microtasks run after each phase
Promise.resolve().then(() => console.log('4: Microtask'));

console.log('5: End');

// Node.js output varies based on phase timing
```

### **Browser vs Node.js Event Loop**
```javascript
// Browser has one main thread with:
// - Call stack
// - Web APIs
// - Callback queue
// - Microtask queue

// Node.js has additional phases:
console.log('Comparing environments:');

// In browser:
setTimeout(() => console.log('Browser: Timeout'), 0);
Promise.resolve().then(() => console.log('Browser: Promise'));

// In Node.js:
setTimeout(() => console.log('Node: Timeout'), 0);
setImmediate(() => console.log('Node: setImmediate'));
Promise.resolve().then(() => console.log('Node: Promise'));
```

### **Blocking the Event Loop**
```javascript
// BAD: Synchronous blocking code
function blockingOperation() {
    console.log('Starting blocking operation');
    
    // This blocks the event loop
    const end = Date.now() + 5000;
    while (Date.now() < end) {
        // Busy wait
    }
    
    console.log('Blocking operation complete');
}

// Event listeners won't fire during blocking
button.addEventListener('click', () => {
    console.log('Click!'); // Won't fire until blocking ends
});

// GOOD: Non-blocking alternative
async function nonBlockingOperation() {
    console.log('Starting non-blocking operation');
    
    // Yield to event loop
    await new Promise(resolve => {
        setTimeout(resolve, 5000);
    });
    
    console.log('Non-blocking operation complete');
}

// Event listeners can fire during operation
button.addEventListener('click', () => {
    console.log('Click!'); // Can fire during setTimeout
});
```

### **Event Loop in Practice**

#### **1. Animation Frames**
```javascript
// Using requestAnimationFrame for smooth animations
let startTime = null;

function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    
    const progress = timestamp - startTime;
    
    // Update animation based on progress
    element.style.transform = `translateX(${progress / 10}px)`;
    
    if (progress < 2000) { // Animate for 2 seconds
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);

// vs setTimeout for animation (less smooth)
function animateWithTimeout() {
    // Update position
    position += 1;
    element.style.transform = `translateX(${position}px)`;
    
    if (position < 200) {
        setTimeout(animateWithTimeout, 16); // ~60fps
    }
}
```

#### **2. Long-running Task Chunking**
```javascript
function processLargeArray(array, callback) {
    const chunkSize = 1000;
    let index = 0;
    
    function processChunk() {
        const end = Math.min(index + chunkSize, array.length);
        
        // Process chunk
        for (; index < end; index++) {
            callback(array[index], index);
        }
        
        // If more to process, schedule next chunk
        if (index < array.length) {
            // Yield to event loop
            setTimeout(processChunk, 0);
        }
    }
    
    processChunk();
}

// Usage
processLargeArray(hugeArray, item => {
    // Process each item
});
```

#### **3. Debounced Event Handling**
```javascript
function createDebouncedHandler(delay) {
    let timeoutId;
    let lastArgs;
    let lastThis;
    
    return function(...args) {
        lastArgs = args;
        lastThis = this;
        
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            // Actual handler runs in next event loop cycle
            handler.apply(lastThis, lastArgs);
        }, delay);
    };
}

// Event handlers are scheduled in callback queue
input.addEventListener('input', createDebouncedHandler(300));
```

### **Monitoring Event Loop Health**
```javascript
class EventLoopMonitor {
    constructor() {
        this.lagThreshold = 50; // ms
        this.lastCheck = Date.now();
        this.monitorInterval = null;
    }
    
    start() {
        this.monitorInterval = setInterval(() => {
            const now = Date.now();
            const lag = now - this.lastCheck - 1000; // Expected 1000ms
            
            if (lag > this.lagThreshold) {
                console.warn(`Event loop lag: ${lag}ms`);
                // Report to monitoring service
            }
            
            this.lastCheck = now;
        }, 1000);
    }
    
    stop() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
    }
}

// Usage
const monitor = new EventLoopMonitor();
monitor.start();

// Stop when needed
// monitor.stop();
```

---

## 9. Job Queue

### **What is the Job Queue?**
The Job Queue (also called Promise Jobs Queue) is where promise reactions are stored. It's a special queue that has higher priority than the callback queue but is technically part of the microtask queue concept.

### **Promise Jobs Execution**
```javascript
console.log('Script start');

// Promise jobs go to job queue
const promise = new Promise((resolve) => {
    console.log('Promise executor');
    resolve('Promise resolved');
});

// .then() callbacks are promise jobs
promise.then(value => {
    console.log('Promise job 1:', value);
    return value.toUpperCase();
}).then(value => {
    console.log('Promise job 2:', value);
});

setTimeout(() => {
    console.log('Timeout callback');
}, 0);

console.log('Script end');

/*
Output:
Script start
Promise executor
Script end
Promise job 1: Promise resolved
Promise job 2: PROMISE RESOLVED
Timeout callback
*/
```

### **Job Queue vs Microtask Queue**
```javascript
// In modern JavaScript engines, job queue is essentially
// the microtask queue for promise reactions

console.log('Start');

// Promise reaction (goes to job queue/microtask queue)
Promise.resolve().then(() => {
    console.log('Promise 1');
    
    // Nested promise reaction
    Promise.resolve().then(() => {
        console.log('Promise 2 (nested)');
    });
});

// queueMicrotask (also microtask queue)
queueMicrotask(() => {
    console.log('queueMicrotask');
});

setTimeout(() => {
    console.log('setTimeout');
}, 0);

console.log('End');

/*
Output:
Start
End
Promise 1
Promise 2 (nested)
queueMicrotask
setTimeout
*/
```

### **Promise Reaction Order**
```javascript
// Promise reactions are processed in order of enqueueing
const p1 = Promise.resolve();
const p2 = Promise.resolve();

p1.then(() => {
    console.log('p1 then 1');
});

p2.then(() => {
    console.log('p2 then 1');
});

p1.then(() => {
    console.log('p1 then 2');
});

p2.then(() => {
    console.log('p2 then 2');
});

// Output order is guaranteed:
// p1 then 1, p2 then 1, p1 then 2, p2 then 2
```

### **Immediate vs Deferred Promise Reactions**
```javascript
// Immediate settlement
const immediatePromise = Promise.resolve('immediate');

// .then() called after promise is already settled
immediatePromise.then(value => {
    console.log('Immediate:', value);
});

// Deferred settlement
const deferredPromise = new Promise(resolve => {
    setTimeout(() => {
        resolve('deferred');
        console.log('Deferred resolved');
    }, 1000);
});

// .then() called before promise is settled
deferredPromise.then(value => {
    console.log('Deferred:', value);
});

console.log('Script end');

/*
Output:
Script end
Immediate: immediate
Deferred resolved
Deferred: deferred
*/
```

---

## 10. Web APIs

### **What are Web APIs?**
Web APIs are browser-provided interfaces that allow JavaScript to interact with browser features, most of which are asynchronous.

### **Common Web APIs**

#### **1. DOM API**
```javascript
// Asynchronous DOM operations
const element = document.getElementById('myElement');

// MutationObserver (microtask)
const observer = new MutationObserver((mutations) => {
    console.log('DOM changed:', mutations);
});

observer.observe(element, {
    attributes: true,
    childList: true,
    subtree: true
});

// Trigger async
setTimeout(() => {
    element.style.color = 'red';
    element.textContent = 'Updated';
}, 1000);
```

#### **2. Fetch API**
```javascript
// Network requests
async function fetchData() {
    try {
        const response = await fetch('/api/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // Other options: mode, cache, credentials, etc.
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}
```

#### **3. Storage API**
```javascript
// Asynchronous storage
async function saveData(key, value) {
    try {
        // LocalStorage (synchronous, but can be wrapped)
        localStorage.setItem(key, JSON.stringify(value));
        
        // IndexedDB (asynchronous)
        const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open('MyDatabase', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('store')) {
                    db.createObjectStore('store');
                }
            };
        });
        
        const transaction = db.transaction('store', 'readwrite');
        const store = transaction.objectStore('store');
        
        await new Promise((resolve, reject) => {
            const request = store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        
    } catch (error) {
        console.error('Storage error:', error);
    }
}
```

#### **4. Geolocation API**
```javascript
// Asynchronous location data
function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

// Usage
getLocation()
    .then(location => console.log('Location:', location))
    .catch(error => console.error('Failed:', error));
```

#### **5. Canvas API**
```javascript
// Asynchronous image processing
async function processImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image
            ctx.drawImage(img, 0, 0);
            
            // Process asynchronously
            setTimeout(() => {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Apply filter (example: grayscale)
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                    imageData.data[i] = avg;     // R
                    imageData.data[i + 1] = avg; // G
                    imageData.data[i + 2] = avg; // B
                }
                
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL());
            }, 0);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
    });
}
```

#### **6. Web Workers API**
```javascript
// Background thread execution
function runInWorker(script, data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(script);
        
        worker.postMessage(data);
        
        worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
        };
        
        worker.onerror = (error) => {
            reject(new Error(`Worker error: ${error.message}`));
            worker.terminate();
        };
        
        // Timeout
        setTimeout(() => {
            worker.terminate();
            reject(new Error('Worker timeout'));
        }, 10000);
    });
}

// worker.js
self.onmessage = function(event) {
    // Heavy computation
    const result = heavyComputation(event.data);
    self.postMessage(result);
};

// Usage
runInWorker('worker.js', largeDataSet)
    .then(result => console.log('Result:', result))
    .catch(error => console.error('Worker failed:', error));
```

#### **7. WebSocket API**
```javascript
// Real-time bidirectional communication
class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);
            
            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                resolve();
            };
            
            this.socket.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
            this.socket.onclose = () => {
                console.log('WebSocket disconnected');
                this.attemptReconnect();
            };
        });
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            
            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, delay);
        }
    }
    
    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket not connected');
        }
    }
}
```

#### **8. Service Workers API**
```javascript
// Background scripts for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registered:', registration);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New service worker installing');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New content available
                            console.log('New content available');
                        } else {
                            // Content cached for offline use
                            console.log('Content cached for offline');
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    });
}

// Service worker file (sw.js)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
```

---

## 11. Fetch API

### **Basic Usage**
```javascript
// Simplest GET request
fetch('https://api.example.com/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// With async/await
async function getData() {
    try {
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
}
```

### **Request Configuration**
```javascript
// Full request options
fetch('https://api.example.com/data', {
    method: 'POST', // GET, POST, PUT, DELETE, etc.
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'value'
    },
    body: JSON.stringify({
        key1: 'value1',
        key2: 'value2'
    }),
    mode: 'cors', // cors, no-cors, same-origin
    cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, same-origin, omit
    redirect: 'follow', // manual, follow, error
    referrerPolicy: 'no-referrer-when-downgrade',
    // Other options
    signal: abortController.signal, // For aborting
    keepalive: true, // For background requests
})
.then(response => response.json())
.then(data => console.log(data));
```

### **Response Handling**
```javascript
async function handleResponse(response) {
    // Check status
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Get headers
    const contentType = response.headers.get('content-type');
    const rateLimit = response.headers.get('x-rate-limit-remaining');
    
    // Handle different content types
    if (contentType.includes('application/json')) {
        return await response.json();
    } else if (contentType.includes('text/html')) {
        return await response.text();
    } else if (contentType.includes('application/octet-stream')) {
        return await response.blob();
    } else {
        return await response.text();
    }
}

// Stream response
async function streamResponse() {
    const response = await fetch('/api/large-data');
    const reader = response.body.getReader();
    
    while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Process chunk
        console.log('Received chunk:', new TextDecoder().decode(value));
    }
}
```

### **Error Handling Strategies**
```javascript
class FetchError extends Error {
    constructor(message, status, url) {
        super(message);
        this.name = 'FetchError';
        this.status = status;
        this.url = url;
    }
}

async function robustFetch(url, options = {}) {
    const { retries = 3, timeout = 10000, ...fetchOptions } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new FetchError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    url
                );
            }
            
            return response;
            
        } catch (error) {
            if (attempt === retries) throw error;
            
            // Exponential backoff
            const delay = Math.pow(2, attempt) * 100;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            console.log(`Retry ${attempt} for ${url}`);
        }
    }
}
```

### **Advanced Patterns**

#### **1. Parallel Requests with Progress**
```javascript
async function fetchWithProgress(urls) {
    const total = urls.length;
    let completed = 0;
    
    const promises = urls.map((url, index) => 
        fetch(url)
            .then(response => response.json())
            .then(data => {
                completed++;
                const progress = (completed / total) * 100;
                console.log(`Progress: ${progress.toFixed(1)}%`);
                return { index, data };
            })
    );
    
    const results = await Promise.all(promises);
    return results.sort((a, b) => a.index - b.index).map(r => r.data);
}
```

#### **2. Request Queue**
```javascript
class RequestQueue {
    constructor(maxConcurrent = 3) {
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.active = 0;
    }
    
    add(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({ request, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        if (this.active >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }
        
        this.active++;
        const { request, resolve, reject } = this.queue.shift();
        
        try {
            const response = await fetch(request.url, request.options);
            resolve(response);
        } catch (error) {
            reject(error);
        } finally {
            this.active--;
            this.process();
        }
    }
}

// Usage
const queue = new RequestQueue(2); // Max 2 concurrent requests

const requests = [
    { url: '/api/data1' },
    { url: '/api/data2' },
    { url: '/api/data3' },
    { url: '/api/data4' }
];

requests.forEach(request => {
    queue.add(request)
        .then(response => response.json())
        .then(data => console.log('Data:', data));
});
```

#### **3. Cache with Fetch**
```javascript
class CachedFetch {
    constructor(cacheName = 'api-cache', ttl = 300000) { // 5 minutes
        this.cacheName = cacheName;
        this.ttl = ttl;
    }
    
    async get(url, options = {}) {
        const cacheKey = `${url}-${JSON.stringify(options)}`;
        const cached = this.getFromCache(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            console.log('Cache hit:', url);
            return cached.data;
        }
        
        console.log('Cache miss:', url);
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        this.saveToCache(cacheKey, data);
        
        return data;
    }
    
    async getFromCache(key) {
        try {
            const item = localStorage.getItem(`cache-${this.cacheName}-${key}`);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    }
    
    saveToCache(key, data) {
        try {
            const item = JSON.stringify({
                data,
                timestamp: Date.now()
            });
            localStorage.setItem(`cache-${this.cacheName}-${key}`, item);
        } catch (error) {
            console.error('Cache save failed:', error);
        }
    }
    
    clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(`cache-${this.cacheName}-`))
            .forEach(key => localStorage.removeItem(key));
    }
}

// Usage
const cachedFetch = new CachedFetch();

// First call fetches, subsequent calls use cache
cachedFetch.get('/api/data')
    .then(data => console.log('Data:', data));
```

---

## 12. AbortController

### **What is AbortController?**
AbortController allows you to abort one or more Web requests as and when desired.

### **Basic Usage**
```javascript
// Create controller
const controller = new AbortController();
const signal = controller.signal;

// Fetch with abort signal
fetch('/api/data', { signal })
    .then(response => response.json())
    .then(data => console.log('Data:', data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
    });

// Abort the request
setTimeout(() => {
    controller.abort();
    console.log('Request aborted');
}, 1000); // Abort after 1 second
```

### **Multiple Requests with Single Controller**
```javascript
// Abort multiple requests
const controller = new AbortController();
const { signal } = controller;

// Start multiple requests
const requests = [
    fetch('/api/data1', { signal }),
    fetch('/api/data2', { signal }),
    fetch('/api/data3', { signal })
];

// Abort all after timeout
setTimeout(() => {
    controller.abort();
    console.log('All requests aborted');
}, 5000);

// Handle results
Promise.allSettled(requests)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Request ${index} succeeded`);
            } else {
                console.log(`Request ${index} failed:`, result.reason.name);
            }
        });
    });
```

### **Timeout Implementation**
```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const { signal } = controller;
    
    // Timeout abort
    const timeoutId = setTimeout(() => {
        controller.abort();
        console.log(`Request to ${url} timed out after ${timeout}ms`);
    }, timeout);
    
    // Fetch with signal
    return fetch(url, { ...options, signal })
        .then(response => {
            clearTimeout(timeoutId);
            return response;
        })
        .catch(error => {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            
            throw error;
        });
}

// Usage
fetchWithTimeout('/api/data', {}, 3000)
    .then(response => response.json())
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Error:', error.message));
```

### **AbortController with Other APIs**
```javascript
// XMLHttpRequest
const xhrController = new AbortController();

const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data');
xhr.responseType = 'json';

// Listen for abort
xhrController.signal.addEventListener('abort', () => {
    xhr.abort();
});

xhr.onload = () => console.log('Response:', xhr.response);
xhr.onerror = () => console.error('Request failed');

xhr.send();

// Later...
xhrController.abort();

// WebSocket
const wsController = new AbortController();
const socket = new WebSocket('wss://example.com');

wsController.signal.addEventListener('abort', () => {
    socket.close();
});

// Later...
wsController.abort();
```

### **Reusable Abort Controller**
```javascript
class AbortableFetch {
    constructor() {
        this.controller = null;
    }
    
    fetch(url, options = {}) {
        // Abort previous request if exists
        if (this.controller) {
            this.controller.abort();
        }
        
        // Create new controller
        this.controller = new AbortController();
        
        return fetch(url, {
            ...options,
            signal: this.controller.signal
        })
        .then(response => {
            this.controller = null;
            return response;
        })
        .catch(error => {
            this.controller = null;
            throw error;
        });
    }
    
    abort() {
        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }
    }
}

// Usage
const fetcher = new AbortableFetch();

// Start request
fetcher.fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log('Data:', data));

// If needed, abort
setTimeout(() => {
    fetcher.abort();
    console.log('Request aborted');
}, 1000);
```

### **Advanced Pattern: Debounced Search with Abort**
```javascript
function createSearchHandler() {
    let controller = null;
    let timeoutId = null;
    
    return async function(searchTerm) {
        // Cancel previous request and timeout
        if (controller) {
            controller.abort();
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        if (!searchTerm.trim()) {
            return [];
        }
        
        return new Promise((resolve, reject) => {
            timeoutId = setTimeout(async () => {
                controller = new AbortController();
                
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, {
                        signal: controller.signal
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const results = await response.json();
                    resolve(results);
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        reject(error);
                    }
                } finally {
                    controller = null;
                }
            }, 300); // Debounce delay
        });
    };
}

// Usage
const search = createSearchHandler();
const input = document.getElementById('search');

input.addEventListener('input', async (e) => {
    try {
        const results = await search(e.target.value);
        console.log('Search results:', results);
    } catch (error) {
        console.error('Search failed:', error);
    }
});
```

### **AbortController with Event Listeners**
```javascript
// AbortController can also abort event listeners
function addAbortableEventListener(element, eventType, handler, signal) {
    const wrappedHandler = (...args) => {
        if (!signal.aborted) {
            handler(...args);
        }
    };
    
    element.addEventListener(eventType, wrappedHandler);
    
    // Cleanup when signal aborts
    signal.addEventListener('abort', () => {
        element.removeEventListener(eventType, wrappedHandler);
    });
    
    return () => {
        element.removeEventListener(eventType, wrappedHandler);
    };
}

// Usage
const controller = new AbortController();
const button = document.getElementById('myButton');

addAbortableEventListener(button, 'click', () => {
    console.log('Button clicked');
}, controller.signal);

// Later, to remove event listener:
controller.abort();
```

### **Cleanup Pattern**
```javascript
// Using AbortSignal for resource cleanup
function createResource(signal) {
    const resources = [];
    
    // Cleanup when signal aborts
    signal.addEventListener('abort', () => {
        console.log('Cleaning up resources');
        resources.forEach(resource => {
            // Cleanup each resource
            if (resource.close) resource.close();
            if (resource.disconnect) resource.disconnect();
        });
    });
    
    // Add resource to cleanup list
    function trackResource(resource) {
        resources.push(resource);
        return resource;
    }
    
    return { trackResource };
}

// Usage
const controller = new AbortController();
const { trackResource } = createResource(controller.signal);

// Track resources that need cleanup
const timer = trackResource(setInterval(() => {
    console.log('Timer tick');
}, 1000));

const socket = trackResource(new WebSocket('wss://example.com'));

// Later, abort to cleanup all resources
setTimeout(() => {
    controller.abort();
    console.log('All resources cleaned up');
}, 5000);
```

---

## 🎯 Best Practices Summary

### **Async Patterns**
- Use `async/await` for cleaner, more readable code
- Prefer promises over callbacks for complex async flows
- Use `Promise.all()` for parallel independent operations
- Use `Promise.allSettled()` when you need all results regardless of failures

### **Error Handling**
- Always handle promise rejections with `.catch()` or `try/catch`
- Use specific error types for better debugging
- Implement retry logic with exponential backoff for network requests
- Set timeouts for all external requests

### **Performance**
- Be mindful of microtask queue blocking the event loop
- Break up long-running tasks using `setTimeout()` or `queueMicrotask()`
- Use Web Workers for CPU-intensive operations
- Implement debouncing and throttling for frequent events

### **Memory Management**
- Cancel unnecessary requests with `AbortController`
- Clean up event listeners and intervals
- Use weak references where appropriate
- Implement request pooling for rate-limited APIs

### **Browser APIs**
- Use `fetch()` with proper error handling and timeouts
- Leverage Service Workers for offline capabilities
- Consider WebSocket for real-time communication
- Use `requestAnimationFrame()` for smooth animations

---

## 📚 Additional Resources

### **Further Reading**
- [MDN: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [JavaScript.info: Async/Await](https://javascript.info/async-await)
- [Philip Roberts: What the heck is the event loop?](https://youtu.be/8aGhZQkoFbQ)
- [Google Developers: The JavaScript Event Loop](https://developers.google.com/web/fundamentals/performance/rendering)

### **Practice Exercises**
1. Implement a promise pool with concurrency control
2. Create a robust fetch wrapper with retry, timeout, and caching
3. Build a task scheduler using the event loop
4. Implement observable pattern using async iterators
5. Create a real-time dashboard with WebSocket and Service Workers

---

## ✅ Progress Checklist

- [ ] **setTimeout & setInterval**: Understand timing, clear methods, and use cases
- [ ] **Callback Hell**: Recognize and avoid pyramid of doom patterns
- [ ] **Promises**: Create, chain, and handle promises effectively
- [ ] **Promise Chaining**: Master sequential and parallel promise execution
- [ ] **async/await**: Write clean async code with proper error handling
- [ ] **Error Handling**: Implement robust error handling for async operations
- [ ] **Microtask Queue vs Callback Queue**: Understand execution order and priorities
- [ ] **Event Loop**: Grasp JavaScript's concurrency model
- [ ] **Job Queue**: Understand promise job scheduling
- [ ] **Web APIs**: Work with browser APIs asynchronously
- [ ] **Fetch API**: Make HTTP requests with proper configuration
- [ ] **AbortController**: Cancel requests and cleanup resources

---

**Mastering asynchronous JavaScript is crucial for building responsive, efficient web applications. Practice these concepts until they become second nature!** 🚀