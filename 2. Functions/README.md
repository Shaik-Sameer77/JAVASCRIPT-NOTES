# JavaScript Functions - Comprehensive Guide

## 📚 Overview
An in-depth exploration of JavaScript functions - the fundamental building blocks of JavaScript programming. This guide covers everything from basic function definitions to advanced functional programming concepts.

## 📋 Table of Contents
1. [Function Declaration vs Expression](#1-function-declaration-vs-expression)
2. [Arrow Functions](#2-arrow-functions)
3. [Parameters vs Arguments](#3-parameters-vs-arguments)
4. [Default Parameters](#4-default-parameters)
5. [Rest & Spread Operators](#5-rest--spread-operators)
6. [IIFE](#6-iife-immediately-invoked-function-expression)
7. [Pure vs Impure Functions](#7-pure-vs-impure-functions)
8. [Higher-Order Functions](#8-higher-order-functions)
9. [Callback Functions](#9-callback-functions)

---

## 1. Function Declaration vs Expression

### **Function Declaration**
A function that's declared as a separate statement in the main code flow.

```javascript
// Syntax: function name(parameters) { body }
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("John")); // "Hello, John!"
```

**Key Characteristics:**
- Hoisted to the top of their scope
- Can be called before declaration
- Creates a variable with the function name in current scope
- Function name is mandatory

```javascript
// Hoisting example
console.log(square(5)); // 25 (works!)

function square(x) {
    return x * x;
}
```

### **Function Expression**
A function created inside an expression or as part of another construct.

```javascript
// Anonymous function expression
const greet = function(name) {
    return `Hello, ${name}!`;
};

// Named function expression
const factorial = function calcFactorial(n) {
    if (n <= 1) return 1;
    return n * calcFactorial(n - 1);
};

console.log(greet("Jane")); // "Hello, Jane!"
console.log(factorial(5));  // 120
```

**Key Characteristics:**
- Not hoisted (cannot be called before definition)
- Can be anonymous or named
- Can be used as values (assigned to variables, passed as arguments)
- Named function expressions are useful for:
  - Self-reference (recursion)
  - Better stack traces in debuggers
  - Self-documenting code

### **Comparison Table**

| Aspect | Function Declaration | Function Expression |
|--------|---------------------|---------------------|
| Hoisting | ✅ Yes | ❌ No |
| Name | Required | Optional |
| Can be anonymous | ❌ No | ✅ Yes |
| Use as value | Limited | ✅ Yes |
| Self-reference | ✅ Yes (via name) | ✅ Yes (if named) |
| Stack traces | Shows function name | Shows variable name or "anonymous" |

### **When to Use Which**

```javascript
// Function Declaration - When you need hoisting
setupEventListeners(); // Works even if defined later

function setupEventListeners() {
    // Event setup code
}

// Function Expression - When you need flexibility
const operations = {
    add: function(a, b) { return a + b; },
    multiply: function(a, b) { return a * b; }
};

// Immediately as callback
setTimeout(function() {
    console.log("Delayed execution");
}, 1000);
```

### **Advanced: Function Constructor**
```javascript
// Rarely used - creates functions from strings
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(2, 3)); // 5

// Security risk - avoid in production!
const userInput = "console.log('hacked!')";
const dangerous = new Function(userInput);
```

---

## 2. Arrow Functions

### **Basic Syntax**
```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function equivalent
const add = (a, b) => {
    return a + b;
};

// Even shorter (implicit return)
const add = (a, b) => a + b;

// Single parameter - parentheses optional
const square = x => x * x;

// No parameters - parentheses required
const greet = () => "Hello World!";

// Returning object literal - wrap in parentheses
const createUser = (name, age) => ({ name, age });
```

### **Key Differences from Regular Functions**

#### 1. **No `this` binding**
```javascript
const person = {
    name: "John",
    // Regular function - has its own 'this'
    greetTraditional: function() {
        console.log(`Hello, ${this.name}`);
    },
    // Arrow function - uses 'this' from surrounding scope
    greetArrow: () => {
        console.log(`Hello, ${this.name}`); // undefined!
    },
    
    // Common pattern: method uses regular function
    // Nested arrow function uses parent's 'this'
    greetDelayed: function() {
        setTimeout(() => {
            console.log(`Hello, ${this.name}`); // Works!
        }, 100);
    }
};

person.greetTraditional(); // "Hello, John"
person.greetArrow();       // "Hello, undefined"
person.greetDelayed();     // "Hello, John" (after 100ms)
```

#### 2. **No `arguments` object**
```javascript
function traditional() {
    console.log(arguments); // Array-like object
}

const arrow = () => {
    console.log(arguments); // ReferenceError!
};

// Use rest parameters instead
const arrowWithArgs = (...args) => {
    console.log(args); // Actual array
};
```

#### 3. **Cannot be used as constructors**
```javascript
function Person(name) {
    this.name = name;
}

const ArrowPerson = (name) => {
    this.name = name; // Error
};

const john = new Person("John"); // OK
const jane = new ArrowPerson("Jane"); // TypeError
```

#### 4. **No `prototype` property**
```javascript
function Traditional() {}
console.log(Traditional.prototype); // Exists

const Arrow = () => {};
console.log(Arrow.prototype); // undefined
```

#### 5. **Cannot use `yield` (not generator functions)**
```javascript
function* traditionalGenerator() {
    yield 1;
    yield 2;
}

const arrowGenerator = *() => {  // SyntaxError
    yield 1;
};
```

### **When to Use Arrow Functions**

```javascript
// Perfect for: Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// Perfect for: Simple one-liners
const getFullName = (firstName, lastName) => `${firstName} ${lastName}`;

// Perfect for: Lexical 'this' in callbacks
class Button {
    constructor() {
        this.clicked = false;
        this.button = document.createElement('button');
        // Arrow function preserves 'this'
        this.button.addEventListener('click', () => {
            this.clicked = true;
            console.log('Button clicked!');
        });
    }
}

// Avoid when: You need 'this' to be dynamic
const obj = {
    values: [1, 2, 3],
    // Bad - 'this' is not obj
    printValues: () => {
        this.values.forEach(v => console.log(v)); // Error
    },
    // Good - regular function
    printValuesGood: function() {
        this.values.forEach(v => console.log(v)); // Works
    }
};
```

---

## 3. Parameters vs Arguments

### **Definitions**
- **Parameters**: Variables listed in function definition
- **Arguments**: Actual values passed to function

```javascript
// Parameters: a and b
function multiply(a, b) {
    return a * b;
}

// Arguments: 5 and 3
const result = multiply(5, 3); // 15
```

### **The `arguments` Object (Traditional Functions Only)**
```javascript
function sumAll() {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }
    return total;
}

console.log(sumAll(1, 2, 3, 4)); // 10
console.log(sumAll(5, 10));      // 15

// Note: arguments is array-like, not actual array
function logArgs() {
    console.log(arguments.length);    // Works
    console.log(arguments[0]);        // Works
    console.log(arguments.map);       // undefined (no map method)
    
    // Convert to array
    const argsArray = Array.from(arguments);
    // or: const argsArray = [...arguments];
}
```

### **Named Parameters with Destructuring**
```javascript
// Traditional way
function createUser(name, age, isAdmin) {
    return { name, age, isAdmin };
}

// With destructuring (more flexible)
function createUser({ name, age, isAdmin = false }) {
    return { name, age, isAdmin };
}

// Calling with object
const user = createUser({
    name: "John",
    age: 30,
    isAdmin: true
});

// Benefits:
// 1. Order doesn't matter
// 2. Clear what each value represents
// 3. Easy to add/remove parameters
// 4. Default values work well
```

### **Parameter Passing Mechanism**
JavaScript uses **pass-by-value**, but for objects, it's "pass-by-value-of-reference":

```javascript
// Primitive parameters (value is copied)
function modifyPrimitive(x) {
    x = 100; // Doesn't affect original
}

let num = 10;
modifyPrimitive(num);
console.log(num); // 10 (unchanged)

// Object parameters (reference is copied)
function modifyObject(obj) {
    obj.value = 100; // Affects original object
    obj = { value: 200 }; // Doesn't affect original reference
}

let myObj = { value: 10 };
modifyObject(myObj);
console.log(myObj.value); // 100 (changed!)

// Array parameters
function addToArray(arr) {
    arr.push(4); // Affects original
    arr = [5, 6]; // Doesn't affect original reference
}

let numbers = [1, 2, 3];
addToArray(numbers);
console.log(numbers); // [1, 2, 3, 4]
```

---

## 4. Default Parameters

### **Basic Usage**
```javascript
// ES5 way (before default parameters)
function greet(name) {
    name = name || 'Guest';
    return `Hello, ${name}!`;
}

// ES6+ way
function greet(name = 'Guest') {
    return `Hello, ${name}!`;
}

console.log(greet("John")); // "Hello, John!"
console.log(greet());       // "Hello, Guest!"
console.log(greet(undefined)); // "Hello, Guest!"
console.log(greet(null));   // "Hello, null!"
```

### **Complex Default Values**
```javascript
// Expressions as defaults
function createMessage(text = 'Hello', times = text.length) {
    return text.repeat(times);
}

// Function calls as defaults
function getDefaultTime() {
    return new Date().toLocaleTimeString();
}

function logMessage(message, timestamp = getDefaultTime()) {
    console.log(`[${timestamp}] ${message}`);
}

logMessage("System started"); // Uses current time

// Previous parameters can be used
function createUser(name, id = generateId(), role = 'user') {
    return { name, id, role };
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
```

### **Default Parameters and the `arguments` Object**
```javascript
function example(a = 1, b = 2) {
    console.log(arguments.length);
    console.log(a, b);
}

example();           // arguments.length = 0, a=1, b=2
example(5);          // arguments.length = 1, a=5, b=2
example(5, undefined); // arguments.length = 2, a=5, b=2
example(5, null);    // arguments.length = 2, a=5, b=null
```

### **Default Parameters with Destructuring**
```javascript
// Object destructuring with defaults
function drawChart({
    size = 'big',
    coords = { x: 0, y: 0 },
    radius = 25
} = {}) { // Outer default for when no object passed
    console.log(size, coords, radius);
}

drawChart(); // Uses all defaults
drawChart({ size: 'small' }); // Overrides size only

// Array destructuring with defaults
function createMatrix([a = 1, b = 2, c = 3] = []) {
    return [a, b, c];
}

createMatrix();        // [1, 2, 3]
createMatrix([4, 5]);  // [4, 5, 3]
```

### **Temporal Dead Zone in Parameters**
```javascript
// This works
function example(a = 1, b = a * 2) {
    return a + b;
}
console.log(example(5)); // 15 (5 + 10)

// This doesn't work - TDZ violation
function invalid(a = b, b = 2) {
    return a + b;
}
console.log(invalid()); // ReferenceError: Cannot access 'b' before initialization
```

---

## 5. Rest & Spread Operators

### **Rest Parameters (`...`)**
Collects all remaining arguments into an array.

```javascript
// Basic rest parameter
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log.sum(1, 2, 3, 4, 5); // 15

// Rest parameter must be last
function logItems(first, second, ...rest) {
    console.log(`First: ${first}`);
    console.log(`Second: ${second}`);
    console.log(`Rest: ${rest}`);
}

logItems('A', 'B', 'C', 'D', 'E');
// First: A
// Second: B
// Rest: C,D,E

// Rest with destructuring
const [first, second, ...others] = [1, 2, 3, 4, 5];
console.log(first, second, others); // 1 2 [3, 4, 5]

const { name, age, ...otherProps } = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA'
};
console.log(otherProps); // {city: 'NYC', country: 'USA'}
```

### **Spread Operator (`...`)**
Expands an iterable into individual elements.

```javascript
// Spread in function calls
const numbers = [1, 2, 3, 4, 5];
console.log(Math.max(...numbers)); // 5

// Spread in array literals
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const withExtra = [0, ...arr1, 3.5, ...arr2, 7];

// Spread in object literals (ES2018+)
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // {a: 1, b: 2, c: 3, d: 4}

// With overriding
const defaults = { theme: 'light', fontSize: 16 };
const userSettings = { fontSize: 18, showSidebar: true };
const finalSettings = { ...defaults, ...userSettings };
// {theme: 'light', fontSize: 18, showSidebar: true}
```

### **Common Use Cases**

#### 1. **Copying Arrays and Objects**
```javascript
// Shallow copy array
const originalArray = [1, 2, 3];
const copyArray = [...originalArray];

// Shallow copy object
const originalObj = { x: 1, y: 2 };
const copyObj = { ...originalObj };

// Nested objects are still referenced!
const nested = { a: 1, b: { c: 2 } };
const shallowCopy = { ...nested };
shallowCopy.b.c = 99;
console.log(nested.b.c); // 99 (changed!)
```

#### 2. **Converting Array-like to Array**
```javascript
// NodeList to Array
const divs = document.querySelectorAll('div');
const divArray = [...divs];

// arguments to Array
function convertArgs() {
    return [...arguments];
}

// String to Array
const chars = [...'Hello']; // ['H', 'e', 'l', 'l', 'o']
```

#### 3. **Merging with Overrides**
```javascript
function createConfig(userConfig) {
    const defaults = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
    };
    
    return {
        ...defaults,
        ...userConfig, // User overrides defaults
        headers: {
            ...defaults.headers,
            ...userConfig.headers // Deep merge for headers
        }
    };
}
```

#### 4. **Rest with Arrow Functions**
```javascript
// Arrow functions don't have 'arguments', so use rest
const logAll = (...args) => {
    console.log(args);
};

// Practical example
const filterByType = (type, ...items) => {
    return items.filter(item => typeof item === type);
};

const stringsOnly = filterByType('string', 'hello', 42, true, 'world');
// ['hello', 'world']
```

---

## 6. IIFE (Immediately Invoked Function Expression)

### **Basic Syntax**
```javascript
// Classic IIFE
(function() {
    console.log('IIFE executed immediately!');
})();

// Alternative syntax
(function() {
    console.log('Also works');
}());

// Arrow function IIFE
(() => {
    console.log('Arrow IIFE');
})();

// Async IIFE
(async function() {
    const data = await fetchData();
    console.log(data);
})();
```

### **Why Use IIFE?**

#### 1. **Creating Private Scope**
```javascript
// Without IIFE - pollutes global scope
var counter = 0;
function increment() {
    return ++counter;
}

// With IIFE - private variables
const counterModule = (function() {
    let privateCounter = 0;
    
    function increment() {
        return ++privateCounter;
    }
    
    function getValue() {
        return privateCounter;
    }
    
    // Revealing Module Pattern
    return {
        increment,
        getValue
    };
})();

console.log(counterModule.getValue()); // 0
counterModule.increment();
console.log(counterModule.getValue()); // 1
// privateCounter is not accessible from outside
```

#### 2. **Avoiding Variable Collisions**
```javascript
// Library code (simulating jQuery)
(function(global) {
    const $ = function(selector) {
        // jQuery implementation
        return new jQuery(selector);
    };
    
    global.$ = $;
    
    function jQuery(selector) {
        this.elements = document.querySelectorAll(selector);
    }
    
    jQuery.prototype.hide = function() {
        this.elements.forEach(el => el.style.display = 'none');
    };
    
})(window);

// Your code can use $ without conflicts
```

#### 3. **Loop Variable Capture Problem**
```javascript
// Problem: All alerts show "Click 3"
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // Always 3
    }, 100);
}

// Solution 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 0, 1, 2
    }, 100);
}

// Solution 2: IIFE (before let existed)
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(function() {
            console.log(index); // 0, 1, 2
        }, 100);
    })(i);
}
```

#### 4. **Module Pattern**
```javascript
const UserModule = (function() {
    // Private variables
    let users = [];
    let nextId = 1;
    
    // Private functions
    function findUserIndex(id) {
        return users.findIndex(user => user.id === id);
    }
    
    // Public API
    return {
        addUser: function(name) {
            const user = { id: nextId++, name };
            users.push(user);
            return user;
        },
        
        removeUser: function(id) {
            const index = findUserIndex(id);
            if (index !== -1) {
                return users.splice(index, 1)[0];
            }
            return null;
        },
        
        getUser: function(id) {
            return users.find(user => user.id === id);
        },
        
        getAllUsers: function() {
            return [...users]; // Return copy
        }
    };
})();

// Usage
UserModule.addUser('John');
UserModule.addUser('Jane');
console.log(UserModule.getAllUsers());
```

### **Modern Alternatives to IIFE**
```javascript
// ES6 Modules (preferred for new code)
// module.js
let privateVar = 'secret';
export function publicMethod() {
    return privateVar;
}

// main.js
import { publicMethod } from './module.js';

// Block scope with let/const
{
    let privateData = 'hidden';
    const publicData = 'visible';
    // privateData not accessible outside
}
```

---

## 7. Pure vs Impure Functions

### **Pure Functions**
Functions that:
1. Always return the same output for the same input
2. Have no side effects

```javascript
// Pure function examples
function add(a, b) {
    return a + b;
}

function toUpperCase(str) {
    return str.toUpperCase();
}

function getFullName(user) {
    return `${user.firstName} ${user.lastName}`;
}

// Pure function with objects (returns new object)
function updateScore(player, points) {
    return {
        ...player,
        score: player.score + points
    };
}
```

### **Impure Functions**
Functions that:
1. May produce different outputs for same inputs
2. Have side effects

```javascript
// Impure function examples
let counter = 0;
function increment() {
    return ++counter; // Modifies external state
}

function getRandomNumber() {
    return Math.random(); // Different output each time
}

function updateDOM(element, content) {
    element.textContent = content; // Side effect: modifies DOM
}

function saveToDatabase(user) {
    database.save(user); // Side effect: I/O operation
}
```

### **Key Differences**

| Aspect | Pure Functions | Impure Functions |
|--------|---------------|-----------------|
| Deterministic | ✅ Always same output for same input | ❌ May vary |
| Side Effects | ❌ None | ✅ May have side effects |
| Referential Transparency | ✅ Can replace with value | ❌ Cannot replace |
| Testing | ✅ Easy (no dependencies) | ❌ Requires mocking |
| Caching/Memoization | ✅ Possible | ❌ Not possible |
| Parallel Execution | ✅ Safe | ❌ May cause race conditions |

### **Benefits of Pure Functions**

#### 1. **Predictability**
```javascript
// Pure - always predictable
function calculateTax(amount, rate) {
    return amount * rate;
}

console.log(calculateTax(100, 0.1)); // 10 (always)
```

#### 2. **Testability**
```javascript
// Pure function - easy to test
function filterEvenNumbers(arr) {
    return arr.filter(n => n % 2 === 0);
}

// Test
console.log(filterEvenNumbers([1, 2, 3, 4])); // [2, 4]
console.log(filterEvenNumbers([])); // []
```

#### 3. **Memoization/Caching**
```javascript
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log('Cache hit!');
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

// Works only with pure functions!
const memoizedAdd = memoize((a, b) => {
    console.log('Computing...');
    return a + b;
});

console.log(memoizedAdd(2, 3)); // Computing... 5
console.log(memoizedAdd(2, 3)); // Cache hit! 5
```

#### 4. **Parallel Execution**
```javascript
// Pure functions can run in parallel
const numbers = [1, 2, 3, 4, 5];

// These can run simultaneously
const doubled = numbers.map(n => n * 2);
const squared = numbers.map(n => n * n);

// Results are independent
```

### **Common Side Effects to Avoid**
```javascript
// 1. Modifying input parameters
function impureAddItem(arr, item) {
    arr.push(item); // Modifies input!
    return arr;
}

function pureAddItem(arr, item) {
    return [...arr, item]; // Returns new array
}

// 2. External variable mutation
let total = 0;
function impureAddToTotal(x) {
    total += x; // Side effect
    return total;
}

function pureAdd(x, y) {
    return x + y; // No side effects
}

// 3. I/O operations
function impureLog(message) {
    console.log(message); // Side effect: output
}

// 4. Network requests
async function impureFetchData(url) {
    const response = await fetch(url); // Side effect: I/O
    return response.json();
}
```

### **Making Functions More Pure**

```javascript
// Instead of this (impure):
const user = { name: 'John', score: 0 };
function addPoints(points) {
    user.score += points; // Modifies external state
    return user.score;
}

// Do this (pure):
function addPoints(user, points) {
    return {
        ...user,
        score: user.score + points
    };
}

const updatedUser = addPoints(user, 10);
```

---

## 8. Higher-Order Functions

### **Definition**
A function that:
1. Takes one or more functions as arguments, OR
2. Returns a function as its result

### **Functions as Arguments**
```javascript
// Array methods are higher-order functions
const numbers = [1, 2, 3, 4, 5];

// map: takes a function, returns new array
const doubled = numbers.map(function(n) {
    return n * 2;
});

// filter: takes a function, returns filtered array
const evens = numbers.filter(n => n % 2 === 0);

// reduce: takes a function, returns accumulated value
const sum = numbers.reduce((total, n) => total + n, 0);

// setTimeout: takes a function
setTimeout(() => {
    console.log('Delayed execution');
}, 1000);
```

### **Functions as Return Values**
```javascript
// Function that returns a function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Currying (partial function application)
function add(a) {
    return function(b) {
        return a + b;
    };
}

const add5 = add(5);
console.log(add5(3)); // 8
console.log(add5(10)); // 15
```

### **Custom Higher-Order Functions**

#### 1. **Function Composition**
```javascript
function compose(...fns) {
    return function(x) {
        return fns.reduceRight((acc, fn) => fn(acc), x);
    };
}

const toUpperCase = str => str.toUpperCase();
const exclaim = str => str + '!';
const repeat = str => str.repeat(2);

const shout = compose(repeat, exclaim, toUpperCase);
console.log(shout('hello')); // "HELLO!HELLO!"
```

#### 2. **Function Decorator**
```javascript
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with args:`, args);
        const result = fn(...args);
        console.log(`Result:`, result);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3);
// Calling add with args: [2, 3]
// Result: 5
```

#### 3. **Memoization Decorator**
```javascript
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

function expensiveCalculation(n) {
    console.log('Calculating...');
    return n * n;
}

const memoizedCalc = memoize(expensiveCalculation);
console.log(memoizedCalc(5)); // Calculating... 25
console.log(memoizedCalc(5)); // 25 (cached)
```

#### 4. **Rate Limiter**
```javascript
function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn(...args);
        }
        console.log('Too soon!');
    };
}

const throttledLog = throttle(console.log, 1000);
throttledLog('Hello'); // Logs immediately
throttledLog('World'); // "Too soon!" (within 1 second)
```

### **Real-World Examples**

#### 1. **Event Handler Factory**
```javascript
function createEventHandler(eventType) {
    return function(element, handler) {
        element.addEventListener(eventType, handler);
        return function() {
            element.removeEventListener(eventType, handler);
        };
    };
}

const onClick = createEventHandler('click');
const onHover = createEventHandler('mouseenter');

const button = document.querySelector('button');
const removeClick = onClick(button, () => console.log('Clicked!'));
const removeHover = onHover(button, () => console.log('Hovered!'));

// Later: removeClick(); to cleanup
```

#### 2. **Middleware Pattern**
```javascript
function createMiddlewarePipeline(...middlewares) {
    return function(context) {
        let index = 0;
        
        function next() {
            if (index < middlewares.length) {
                const middleware = middlewares[index++];
                return middleware(context, next);
            }
        }
        
        return next();
    };
}

const logger = (context, next) => {
    console.log('Request:', context);
    const result = next();
    console.log('Response:', result);
    return result;
};

const authenticator = (context, next) => {
    if (context.token) {
        return next();
    }
    throw new Error('Unauthorized');
};

const apiPipeline = createMiddlewarePipeline(logger, authenticator);

apiPipeline({ token: 'abc123', data: 'test' });
```

---

## 9. Callback Functions

### **Definition**
A function passed into another function as an argument, to be executed later.

### **Synchronous Callbacks**
```javascript
// Array methods use synchronous callbacks
const numbers = [1, 2, 3, 4, 5];

numbers.forEach(function(number) {
    console.log(number * 2);
});

// Custom function with callback
function processArray(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr));
    }
    return result;
}

const squared = processArray(numbers, function(n) {
    return n * n;
});
```

### **Asynchronous Callbacks**
```javascript
// Event handlers
button.addEventListener('click', function(event) {
    console.log('Button clicked!', event);
});

// Timers
setTimeout(function() {
    console.log('Executed after 1 second');
}, 1000);

setInterval(function() {
    console.log('Executed every 2 seconds');
}, 2000);

// File reading (Node.js example)
const fs = require('fs');
fs.readFile('file.txt', 'utf8', function(err, data) {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('File content:', data);
});
```

### **Error-First Callback Pattern**
```javascript
// Common in Node.js
function readConfig(callback) {
    // Simulating async operation
    setTimeout(() => {
        const error = Math.random() > 0.5 ? null : new Error('Failed');
        const data = error ? null : { port: 3000, host: 'localhost' };
        callback(error, data);
    }, 100);
}

// Usage
readConfig(function(err, config) {
    if (err) {
        console.error('Error reading config:', err);
        return;
    }
    console.log('Config loaded:', config);
});
```

### **Callback Hell (Pyramid of Doom)**
```javascript
// Nested callbacks become hard to read
getUser(1, function(user) {
    getPosts(user.id, function(posts) {
        getComments(posts[0].id, function(comments) {
            getReplies(comments[0].id, function(replies) {
                console.log('Nested callbacks:', replies);
            });
        });
    });
});

// Solutions:
// 1. Named functions
function handleUser(user) {
    getPosts(user.id, handlePosts);
}

function handlePosts(posts) {
    getComments(posts[0].id, handleComments);
}

function handleComments(comments) {
    getReplies(comments[0].id, handleReplies);
}

function handleReplies(replies) {
    console.log('Better structure:', replies);
}

getUser(1, handleUser);
```

### **Modern Alternatives to Callbacks**

#### 1. **Promises**
```javascript
function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ id, name: 'John' });
        }, 100);
    });
}

getUser(1)
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => console.log(comments))
    .catch(error => console.error(error));
```

#### 2. **Async/Await**
```javascript
async function loadUserData() {
    try {
        const user = await getUser(1);
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        console.log(comments);
    } catch (error) {
        console.error(error);
    }
}
```

### **When Callbacks Are Still Useful**

#### 1. **Event Listeners**
```javascript
// Callbacks are perfect for event-driven code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
});

element.addEventListener('input', function(event) {
    // Handle input changes
});
```

#### 2. **Simple Async Operations**
```javascript
// For simple cases, callbacks are fine
setTimeout(() => {
    console.log('Simple timeout');
}, 100);

// Array iteration
[1, 2, 3].forEach(item => {
    console.log(item);
});
```

#### 3. **Node.js Streams**
```javascript
// Stream processing often uses callbacks
const stream = fs.createReadStream('file.txt');
stream.on('data', chunk => {
    console.log('Received chunk:', chunk.length);
});
stream.on('end', () => {
    console.log('File reading complete');
});
```

### **Best Practices with Callbacks**

```javascript
// 1. Always handle errors
function asyncOperation(callback) {
    try {
        // Do something
        const result = 'success';
        callback(null, result); // Error-first pattern
    } catch (error) {
        callback(error, null);
    }
}

// 2. Avoid nesting - use named functions
function processData(data, callback) {
    // Instead of nesting:
    step1(data, function(result1) {
        step2(result1, function(result2) {
            step3(result2, callback);
        });
    });
    
    // Use named functions:
    function handleStep1(result1) {
        step2(result1, handleStep2);
    }
    
    function handleStep2(result2) {
        step3(result2, callback);
    }
    
    step1(data, handleStep1);
}

// 3. Use setTimeout for deferring execution
function defer(callback) {
    setTimeout(callback, 0);
}

// 4. Consider promises for complex async flows
function promisify(callbackBasedFunction) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            callbackBasedFunction(...args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}
```

---

## 🎯 Best Practices Summary

### **Function Design**
- Use function declarations for hoisting needs
- Use arrow functions for concise callbacks and lexical `this`
- Prefer pure functions when possible
- Use default parameters instead of `||` operators

### **Parameters & Arguments**
- Use destructuring for complex parameter objects
- Employ rest parameters instead of `arguments` object
- Use spread operator for array/object manipulation
- Implement error-first pattern for callbacks

### **Advanced Patterns**
- Use IIFE for encapsulation (though modules are preferred now)
- Create higher-order functions for reusable logic
- Avoid callback hell with named functions or promises
- Consider currying for function specialization

### **Performance & Readability**
- Memoize expensive pure functions
- Use meaningful function names
- Keep functions focused (Single Responsibility Principle)
- Document complex function behavior

---

## 📚 Additional Resources

### **Further Reading**
- [MDN Functions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [JavaScript.info Functions](https://javascript.info/function-basics)
- [Functional Programming in JavaScript](https://github.com/getify/Functional-Light-JS)

### **Practice Exercises**
1. Create a compose function that chains multiple functions
2. Implement memoization for recursive functions
3. Convert callback-based code to promise-based
4. Build a simple event emitter using higher-order functions

---

## ✅ Progress Checklist

- [ ] **Function Declaration vs Expression**: Know when to use each and their hoisting behavior
- [ ] **Arrow Functions**: Understand lexical `this`, proper use cases, and limitations
- [ ] **Parameters vs Arguments**: Differentiate between them, use `arguments` object appropriately
- [ ] **Default Parameters**: Implement with expressions, destructuring, and understand TDZ
- [ ] **Rest & Spread Operators**: Master collecting arguments and expanding iterables
- [ ] **IIFE**: Create private scopes, avoid global pollution, understand modern alternatives
- [ ] **Pure vs Impure Functions**: Write predictable, testable pure functions
- [ ] **Higher-Order Functions**: Create functions that take or return other functions
- [ ] **Callback Functions**: Handle async operations, avoid callback hell, use error-first pattern

---

**Remember: Functions are the heart of JavaScript. Mastering them is key to writing clean, efficient, and maintainable code!** 🚀