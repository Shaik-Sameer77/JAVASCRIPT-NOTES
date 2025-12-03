# Deep JavaScript Concepts - Comprehensive Guide

## 📚 Overview
A deep dive into JavaScript's core mechanisms and object-oriented features. This guide explores the language's inner workings, from execution context to advanced OOP patterns.

## 📋 Table of Contents
1. [Execution Context](#1-execution-context)
2. [Call Stack](#2-call-stack)
3. [Memory Heap](#3-memory-heap)
4. [Hoisting](#4-hoisting)
5. [Scope](#5-scope)
6. [Lexical Scope](#6-lexical-scope)
7. [Closures](#7-closures)
8. [The "this" keyword](#8-the-this-keyword)
9. [Bind, Call, Apply](#9-bind-call-apply)
10. [Prototypal Inheritance](#10-prototypal-inheritance)
11. [Prototype Chain](#11-prototype-chain)
12. [Constructor Functions](#12-constructor-functions)
13. [Classes (ES6)](#13-classes-es6)
14. [Static Methods](#14-static-methods)
15. [Encapsulation](#15-encapsulation)
16. [Polymorphism](#16-polymorphism)
17. [Getters & Setters](#17-getters--setters)

---

## 1. Execution Context

### **What is an Execution Context?**
An execution context is an abstract concept that holds information about the environment where JavaScript code is executed. It's created in two phases: creation phase and execution phase.

### **Types of Execution Contexts**
```javascript
// 1. Global Execution Context (GEC)
// Created when script first runs, represents global scope

// 2. Function Execution Context (FEC)
// Created each time a function is called

// 3. Eval Execution Context
// Created inside eval() (rarely used, avoid)
```

### **Execution Context Components**
Each execution context contains:

```javascript
// 1. Variable Environment
// - var declarations
// - function declarations
// - arguments object

// 2. Lexical Environment
// - let/const declarations
// - this binding
// - reference to outer environment

// 3. This Binding
// Value of 'this' keyword
```

### **Creation Phase vs Execution Phase**
```javascript
// Example code
console.log(a); // undefined
var a = 10;
console.log(b); // ReferenceError
let b = 20;
foo();

function foo() {
    console.log('Function called');
}
```

**Creation Phase:**
1. **Global Execution Context** is created
2. Memory is allocated for variables and functions
3. `var` declarations are initialized with `undefined`
4. Function declarations are stored in memory fully
5. `let` and `const` declarations are hoisted but not initialized (TDZ)
6. `this` is bound to global object (window in browsers)

**Execution Phase:**
1. Code is executed line by line
2. Variables are assigned values
3. Functions are invoked (creating new execution contexts)

### **Visualizing Execution Context**
```javascript
function outer() {
    var outerVar = 'I am outside';
    
    function inner() {
        var innerVar = 'I am inside';
        console.log(outerVar); // Can access outerVar
        console.log(innerVar); // Can access innerVar
    }
    
    inner();
    // console.log(innerVar); // Error: innerVar not accessible
}

outer();

// Execution contexts created:
// 1. Global EC
// 2. outer() EC when called
// 3. inner() EC when called
```

---

## 2. Call Stack

### **What is the Call Stack?**
The call stack is a data structure that tracks function calls in JavaScript. It follows the Last-In-First-Out (LIFO) principle.

```javascript
function first() {
    console.log('First function');
    second();
}

function second() {
    console.log('Second function');
    third();
}

function third() {
    console.log('Third function');
}

first();

// Call Stack progression:
// 1. first() is pushed
// 2. second() is pushed (inside first)
// 3. third() is pushed (inside second)
// 4. third() completes, popped off
// 5. second() completes, popped off
// 6. first() completes, popped off
```

### **Stack Overflow**
```javascript
// Recursive function without base case
function infiniteRecursion() {
    infiniteRecursion(); // Calls itself infinitely
}

// This causes stack overflow:
// RangeError: Maximum call stack size exceeded

// Proper recursive function
function countdown(n) {
    if (n <= 0) {
        console.log('Done!');
        return;
    }
    console.log(n);
    countdown(n - 1);
}

countdown(5); // Works correctly
```

### **Asynchronous Code and the Call Stack**
```javascript
console.log('Start');

setTimeout(function() {
    console.log('Timeout callback');
}, 0);

Promise.resolve().then(function() {
    console.log('Promise callback');
});

console.log('End');

// Output order:
// Start
// End
// Promise callback
// Timeout callback

// Why? Event loop handles async callbacks differently
```

### **Debugging with Call Stack**
```javascript
function calculate() {
    const x = 10;
    const y = process(x); // Line 3
    return y * 2;
}

function process(num) {
    const result = transform(num); // Line 8
    return result + 5;
}

function transform(value) {
    throw new Error('Debug this!'); // Line 13
}

try {
    calculate();
} catch (error) {
    console.error(error.stack);
    // Shows:
    // Error: Debug this!
    //     at transform (file.js:13)
    //     at process (file.js:8)
    //     at calculate (file.js:3)
}
```

---

## 3. Memory Heap

### **What is the Memory Heap?**
The memory heap is an unstructured region of memory where objects are stored. Unlike the stack, heap allocation is dynamic.

### **Stack vs Heap Allocation**
```javascript
// Primitive values go to STACK
let num = 42;           // Stack
let str = 'hello';      // Stack
let bool = true;        // Stack

// Objects go to HEAP (reference stored in stack)
let obj = { name: 'John' };     // Heap
let arr = [1, 2, 3];            // Heap
let func = function() {};       // Heap

// Copy behavior differences
let a = 10;
let b = a;      // b gets COPY of value (10)
b = 20;
console.log(a); // 10 (unchanged)

let obj1 = { x: 10 };
let obj2 = obj1; // obj2 gets REFERENCE to same object
obj2.x = 20;
console.log(obj1.x); // 20 (changed!)
```

### **Memory Lifecycle**
```javascript
// 1. Allocation
const user = { name: 'Alice', age: 30 }; // Heap allocation

// 2. Usage
user.age = 31; // Modifying heap memory

// 3. Release (Garbage Collection)
user = null; // Now eligible for garbage collection

// Circular reference example
function createCircularReference() {
    let objA = { name: 'A' };
    let objB = { name: 'B' };
    
    objA.ref = objB; // objA references objB
    objB.ref = objA; // objB references objA
    
    return 'Created circular reference';
}

// Even after function ends, objA and objB still reference each other
// Modern garbage collectors can handle this
```

### **Garbage Collection in JavaScript**
JavaScript uses automatic garbage collection. Main algorithms:

```javascript
// 1. Reference Counting (older)
// Counts references to each object
// Problem: Can't handle circular references

// 2. Mark-and-Sweep (modern)
// Marks reachable objects from roots (global object)
// Sweeps unmarked objects

// Example of memory leak
let theThing = null;
let replaceThing = function () {
    let originalThing = theThing;
    
    let unused = function () {
        if (originalThing) // Closure reference
            console.log("hi");
    };
    
    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
            console.log("message");
        }
    };
};

setInterval(replaceThing, 100); // Memory leak!
```

### **Managing Memory**
```javascript
// 1. Avoid global variables
// Bad
globalVar = 'I pollute global scope';

// Good
(function() {
    const localVar = 'I stay local';
})();

// 2. Clear intervals and timeouts
const intervalId = setInterval(() => {
    console.log('Running...');
}, 1000);

// Clear when done
clearInterval(intervalId);

// 3. Remove event listeners
function handleClick() {
    console.log('Clicked');
}

element.addEventListener('click', handleClick);
// Remove when no longer needed
element.removeEventListener('click', handleClick);

// 4. Use WeakMap and WeakSet for weak references
const weakMap = new WeakMap();
let obj = { data: 'important' };
weakMap.set(obj, 'metadata');

obj = null; // obj can be garbage collected
// weakMap entry automatically removed
```

---

## 4. Hoisting

### **What is Hoisting?**
Hoisting is JavaScript's behavior of moving declarations to the top of their scope during the compilation phase.

### **Variable Hoisting**
```javascript
// var hoisting
console.log(x); // undefined (not ReferenceError!)
var x = 5;
console.log(x); // 5

// What actually happens:
var x;          // Declaration hoisted
console.log(x); // undefined
x = 5;          // Assignment stays
console.log(x); // 5

// let/const hoisting (different behavior)
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

console.log(z); // ReferenceError
const z = 15;

// They ARE hoisted, but in Temporal Dead Zone (TDZ)
```

### **Temporal Dead Zone (TDZ)**
```javascript
// TDZ for let
console.log(a); // ReferenceError
let a = 10;

// TDZ for const
console.log(b); // ReferenceError
const b = 20;

// TDZ starts at beginning of scope
{
    // Start of block scope
    // TDZ for temp begins
    console.log(temp); // ReferenceError
    let temp = 30;
    // TDZ ends
}

// Function parameters have their own TDZ
function example(a = b, b = 2) {
    // ReferenceError: Cannot access 'b' before initialization
}
```

### **Function Hoisting**
```javascript
// Function declarations are fully hoisted
sayHello(); // "Hello!" (works!)

function sayHello() {
    console.log("Hello!");
}

// What actually happens:
function sayHello() {    // Entire function hoisted
    console.log("Hello!");
}
sayHello();              // Call works

// Function expressions are NOT hoisted the same way
sayHi(); // TypeError: sayHi is not a function

var sayHi = function() {
    console.log("Hi!");
};

// What happens:
var sayHi;               // Variable declaration hoisted
sayHi();                 // TypeError: sayHi is undefined
sayHi = function() {     // Assignment stays
    console.log("Hi!");
};
```

### **Class Hoisting**
```javascript
// Class declarations are hoisted but not initialized
const p = new Person(); // ReferenceError: Cannot access 'Person' before initialization

class Person {
    constructor(name) {
        this.name = name;
    }
}

// Class expressions have same behavior
const p2 = new Animal(); // ReferenceError
const Animal = class {
    constructor(type) {
        this.type = type;
    }
};
```

### **Hoisting Priority**
```javascript
// Function vs variable hoisting
console.log(typeof myFunc); // "function"
console.log(typeof myVar);  // "undefined"

var myVar = 'variable';
function myFunc() {
    return 'function';
}

// Order of precedence:
// 1. Function declarations
// 2. Variable declarations (var)
// 3. Assignments and other code

// What happens:
function myFunc() {         // Function hoisted first
    return 'function';
}
var myVar;                  // Variable declaration hoisted
console.log(typeof myFunc); // "function"
console.log(typeof myVar);  // "undefined"
myVar = 'variable';         // Assignment
```

### **Best Practices with Hoisting**
```javascript
// 1. Declare variables at top of scope
function goodPractice() {
    let name = 'John';
    const age = 30;
    var isAdmin = false;
    
    // Rest of code
}

// 2. Use const by default, let when needed
const PI = 3.14159;
let counter = 0;

// 3. Declare functions before using them
function calculateTotal(price, tax) {
    return price + (price * tax);
}

const total = calculateTotal(100, 0.1);

// 4. Use IIFE to avoid hoisting issues
(function() {
    const privateVar = 'hidden';
    // Code here
})();

// console.log(privateVar); // Error
```

---

## 5. Scope

### **What is Scope?**
Scope determines the accessibility (visibility) of variables, functions, and objects in different parts of your code.

### **Types of Scope**

#### **Global Scope**
```javascript
// Variables declared outside any function
var globalVar = 'I am global';
let globalLet = 'I am also global';
const globalConst = 'Me too';

function accessGlobal() {
    console.log(globalVar);   // Accessible
    console.log(globalLet);   // Accessible
    console.log(globalConst); // Accessible
}

// In browsers, global variables become properties of window
console.log(window.globalVar);   // 'I am global'
console.log(window.globalLet);   // undefined (let/const don't attach to window)
```

#### **Function Scope**
```javascript
function myFunction() {
    var functionScoped = 'I am function scoped';
    let alsoFunctionScoped = 'Me too';
    
    if (true) {
        var stillFunctionScoped = 'Still function scoped!';
        let blockScoped = 'I am block scoped';
    }
    
    console.log(functionScoped);       // Works
    console.log(alsoFunctionScoped);   // Works
    console.log(stillFunctionScoped);  // Works (var is function-scoped)
    // console.log(blockScoped);       // Error: blockScoped not defined
}

// console.log(functionScoped); // Error: functionScoped not defined
```

#### **Block Scope**
```javascript
// Block scope with let/const
if (true) {
    let blockLet = 'I am block scoped';
    const blockConst = 'Me too';
    var blockVar = 'I am function scoped'; // Still var
    
    console.log(blockLet);   // Works
    console.log(blockConst); // Works
    console.log(blockVar);   // Works
}

// console.log(blockLet);   // Error
// console.log(blockConst); // Error
console.log(blockVar);       // Works! (var escapes block)

// Block scope in loops
for (let i = 0; i < 3; i++) {
    // Each iteration has its own i
    setTimeout(() => console.log(i), 100); // 0, 1, 2
}

for (var j = 0; j < 3; j++) {
    // Same j shared across iterations
    setTimeout(() => console.log(j), 100); // 3, 3, 3
}
```

#### **Module Scope**
```javascript
// In ES6 modules, each file has its own scope
// module.js
const privateVar = 'I am private to module';
export const publicVar = 'I am exported';

// main.js
import { publicVar } from './module.js';
console.log(publicVar); // Works
// console.log(privateVar); // Error: not exported
```

### **Scope Chain**
```javascript
const globalVar = 'global';

function outer() {
    const outerVar = 'outer';
    
    function inner() {
        const innerVar = 'inner';
        
        console.log(innerVar);   // 'inner' - from current scope
        console.log(outerVar);   // 'outer' - from outer scope
        console.log(globalVar);  // 'global' - from global scope
        // console.log(notDefined); // Error: not in scope chain
    }
    
    inner();
    // console.log(innerVar); // Error: innerVar not accessible
}

outer();

// Scope chain for inner(): inner() scope → outer() scope → global scope
```

### **Shadowing**
```javascript
const name = 'Global';

function outer() {
    const name = 'Outer'; // Shadows global name
    
    function inner() {
        const name = 'Inner'; // Shadows outer name
        console.log(name); // 'Inner'
    }
    
    inner();
    console.log(name); // 'Outer'
}

outer();
console.log(name); // 'Global'

// Illegal shadowing
function example() {
    var x = 10;
    let x = 20; // SyntaxError: Identifier 'x' has already been declared
}

// Legal shadowing across scopes
let y = 10;
if (true) {
    let y = 20; // Different scope, allowed
    console.log(y); // 20
}
console.log(y); // 10
```

---

## 6. Lexical Scope

### **What is Lexical Scope?**
Lexical scope (also called static scope) means that the accessibility of variables is determined by the position of variables in the source code.

```javascript
const globalVar = 'global';

function outer() {
    const outerVar = 'outer';
    
    function inner() {
        const innerVar = 'inner';
        console.log(globalVar);  // Can access
        console.log(outerVar);   // Can access
        console.log(innerVar);   // Can access
    }
    
    inner();
    // console.log(innerVar);    // Cannot access - lexical position matters
}

outer();
```

### **Lexical Scope vs Dynamic Scope**
```javascript
// JavaScript uses LEXICAL scope (determined at write-time)
const x = 10;

function printX() {
    console.log(x); // Always 10 (lexical)
}

function dynamicExample() {
    const x = 20;
    printX(); // Still 10, not 20!
}

dynamicExample();

// If JavaScript used DYNAMIC scope (hypothetical):
// printX() would log 20 (based on calling context)
```

### **Nested Function Scope**
```javascript
function createCounter() {
    let count = 0;
    
    return {
        increment: function() {
            count++; // Can access parent's count
            return count;
        },
        decrement: function() {
            count--; // Same lexical scope
            return count;
        },
        getCount: function() {
            return count; // Same lexical scope
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
```

### **Lexical Scope in Practice**
```javascript
// Example 1: Module pattern
const Module = (function() {
    // Private due to lexical scope
    const privateData = 'secret';
    
    function privateMethod() {
        return privateData;
    }
    
    // Public API
    return {
        getData: function() {
            return privateMethod();
        }
    };
})();

console.log(Module.getData()); // 'secret'
// console.log(Module.privateData); // undefined

// Example 2: Event handlers
function setupButtons() {
    const buttons = document.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
        // Each handler has its own lexical scope with i
        buttons[i].addEventListener('click', function() {
            console.log(`Button ${i} clicked`);
        });
    }
}
```

---

## 7. Closures

### **What is a Closure?**
A closure is a function that retains access to its lexical scope even when the function is executed outside that scope.

```javascript
function outer() {
    const secret = 'I am a secret';
    
    // inner is a closure
    function inner() {
        console.log(secret); // Remembers secret
    }
    
    return inner;
}

const myClosure = outer();
myClosure(); // 'I am a secret'
// outer() has finished, but inner() remembers its scope
```

### **How Closures Work**
```javascript
function createCounter() {
    let count = 0; // This variable is "closed over"
    
    return function() {
        count++;    // Still has access to count
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each closure gets its own lexical environment
const counter1 = createCounter();
const counter2 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)
```

### **Common Use Cases**

#### **1. Data Privacy**
```javascript
function createBankAccount(initialBalance) {
    let balance = initialBalance;
    
    return {
        deposit: function(amount) {
            balance += amount;
            return balance;
        },
        withdraw: function(amount) {
            if (amount <= balance) {
                balance -= amount;
                return balance;
            }
            return 'Insufficient funds';
        },
        getBalance: function() {
            return balance;
        }
    };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500);
console.log(account.getBalance()); // 1500
// account.balance is not accessible directly!
```

#### **2. Function Factories**
```javascript
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

#### **3. Currying and Partial Application**
```javascript
function add(a) {
    return function(b) {
        return a + b;
    };
}

const add5 = add(5);
console.log(add5(3)); // 8
console.log(add5(10)); // 15

// Curried function for multiple arguments
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}

function sum(a, b, c) {
    return a + b + c;
}

const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
```

#### **4. Event Handlers and Callbacks**
```javascript
function setupButtons() {
    const buttons = document.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
        // Closure captures the current value of i
        buttons[i].addEventListener('click', (function(index) {
            return function() {
                console.log(`Button ${index} clicked`);
            };
        })(i));
    }
}
```

### **Closures in Loops - The Classic Problem**
```javascript
// Problem
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 3, 3, 3 (not 0, 1, 2!)
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

// Solution 3: Use forEach
[0, 1, 2].forEach(function(i) {
    setTimeout(function() {
        console.log(i); // 0, 1, 2
    }, 100);
});
```

### **Memory Considerations**
```javascript
// Closures keep their lexical environment alive
function createHeavyClosure() {
    const largeArray = new Array(1000000).fill('data');
    let count = 0;
    
    return function() {
        count++;
        // largeArray is kept in memory as long as closure exists
        return `Called ${count} times, array length: ${largeArray.length}`;
    };
}

const heavyFunction = createHeavyClosure();
// largeArray stays in memory even though we might not need it

// To release memory:
heavyFunction = null; // Now closure can be garbage collected

// Better pattern: don't close over unnecessary data
function createLightClosure() {
    let count = 0;
    // No large array in closure scope
    
    return function() {
        count++;
        return `Called ${count} times`;
    };
}
```

---

## 8. The "this" keyword

### **What is `this`?**
`this` is a special keyword that refers to the context in which a function is executed. Its value is determined by **how** a function is called.

### **Rules for Determining `this`**

#### **1. Global Context**
```javascript
console.log(this); // In browser: Window object
                   // In Node.js: global object

function globalFunction() {
    console.log(this); // In non-strict: Window/global
                       // In strict mode: undefined
}

globalFunction();
```

#### **2. Method Call (Object Method)**
```javascript
const person = {
    name: 'John',
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};

person.greet(); // 'Hello, John' (this = person)

const greetFunc = person.greet;
greetFunc(); // 'Hello, undefined' (this = Window/global)
```

#### **3. Constructor Call (with `new`)**
```javascript
function Person(name) {
    this.name = name;
    console.log(this); // New object instance
}

const john = new Person('John');
console.log(john.name); // 'John'
```

#### **4. Explicit Binding (call, apply, bind)**
```javascript
function introduce(language) {
    console.log(`I code in ${language}, my name is ${this.name}`);
}

const person = { name: 'Alice' };

introduce.call(person, 'JavaScript');    // Explicit this
introduce.apply(person, ['Python']);     // Explicit this with array
const boundFunc = introduce.bind(person); // Permanent binding
boundFunc('Java');
```

#### **5. Arrow Functions**
```javascript
const obj = {
    name: 'John',
    regularFunc: function() {
        console.log(this.name); // 'John' (obj)
        
        setTimeout(function() {
            console.log(this.name); // undefined (Window/global)
        }, 100);
    },
    
    arrowFunc: function() {
        console.log(this.name); // 'John' (obj)
        
        setTimeout(() => {
            console.log(this.name); // 'John' (lexical this from obj)
        }, 100);
    }
};

obj.regularFunc();
obj.arrowFunc();
```

#### **6. Event Handlers**
```javascript
button.addEventListener('click', function() {
    console.log(this); // The button element
});

button.addEventListener('click', () => {
    console.log(this); // Window/global (lexical this)
});
```

### **`this` in Strict Mode**
```javascript
'use strict';

function test() {
    console.log(this); // undefined (instead of Window)
}

test();

const obj = {
    method: function() {
        console.log(this); // obj
        function inner() {
            console.log(this); // undefined (strict mode)
        }
        inner();
    }
};

obj.method();
```

### **Common `this` Pitfalls**
```javascript
// 1. Method assigned to variable
const person = {
    name: 'John',
    greet: function() {
        console.log(this.name);
    }
};

const greetFunc = person.greet;
greetFunc(); // undefined (lost context)

// 2. Callback functions
const obj = {
    data: 'important',
    process: function() {
        [1, 2, 3].forEach(function(item) {
            console.log(item, this.data); // this is Window/global
        });
    }
};

obj.process(); // undefined for each

// Fix: use arrow function or bind
const obj2 = {
    data: 'important',
    process: function() {
        [1, 2, 3].forEach((item) => {
            console.log(item, this.data); // Works!
        });
    }
};

// 3. Nested functions
const calculator = {
    value: 10,
    double: function() {
        function helper() {
            this.value = this.value * 2; // Wrong this!
        }
        helper();
    }
};

calculator.double(); // TypeError or unexpected result

// Fix: arrow function or store this
const calculator2 = {
    value: 10,
    double: function() {
        const self = this; // Store reference
        function helper() {
            self.value = self.value * 2;
        }
        helper();
    }
};
```

---

## 9. Bind, Call, Apply

### **`call()` Method**
Calls a function with a given `this` value and arguments provided individually.

```javascript
function introduce(language, experience) {
    console.log(`My name is ${this.name}, I code in ${language} 
                 with ${experience} years experience`);
}

const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

// call() syntax: function.call(thisArg, arg1, arg2, ...)
introduce.call(person1, 'JavaScript', 5);
// "My name is Alice, I code in JavaScript with 5 years experience"

introduce.call(person2, 'Python', 3);
// "My name is Bob, I code in Python with 3 years experience"
```

### **`apply()` Method**
Similar to `call()`, but takes arguments as an array.

```javascript
function introduce(language, experience) {
    console.log(`My name is ${this.name}, I code in ${language} 
                 with ${experience} years experience`);
}

const person = { name: 'Charlie' };

// apply() syntax: function.apply(thisArg, [argsArray])
introduce.apply(person, ['TypeScript', 2]);
// "My name is Charlie, I code in TypeScript with 2 years experience"

// Real-world example: Find max in array
const numbers = [5, 1, 8, 3, 9];
const max = Math.max.apply(null, numbers); // 9

// With ES6 spread operator, apply() is less needed
const max2 = Math.max(...numbers); // 9
```

### **`bind()` Method**
Creates a new function with a bound `this` value and optionally preset arguments.

```javascript
function introduce(language, experience) {
    console.log(`My name is ${this.name}, I code in ${language} 
                 with ${experience} years experience`);
}

const person = { name: 'Diana' };

// bind() syntax: function.bind(thisArg, arg1, arg2, ...)
const boundIntroduce = introduce.bind(person);
boundIntroduce('Ruby', 4);
// "My name is Diana, I code in Ruby with 4 years experience"

// Partial application
const introduceWithJava = introduce.bind(person, 'Java');
introduceWithJava(6);
// "My name is Diana, I code in Java with 6 years experience"

const introduceWithAll = introduce.bind(person, 'Go', 1);
introduceWithAll();
// "My name is Diana, I code in Go with 1 years experience"
```

### **Comparison Table**

| Method | Invokes Immediately? | Arguments Format | Returns |
|--------|---------------------|-----------------|---------|
| `call()` | ✅ Yes | Individual | Function result |
| `apply()` | ✅ Yes | Array | Function result |
| `bind()` | ❌ No (returns new function) | Individual | New bound function |

### **Practical Examples**

#### **1. Borrowing Methods**
```javascript
const car = {
    brand: 'Toyota',
    getDescription: function(year, color) {
        return `${year} ${this.brand} in ${color}`;
    }
};

const bike = {
    brand: 'Honda'
};

// Borrow car's method for bike
const bikeDescription = car.getDescription.call(bike, 2022, 'red');
console.log(bikeDescription); // "2022 Honda in red"
```

#### **2. Constructor Chaining**
```javascript
function Product(name, price) {
    this.name = name;
    this.price = price;
}

function Food(name, price, category) {
    Product.call(this, name, price); // Call parent constructor
    this.category = category;
}

const pizza = new Food('Pizza', 15, 'Italian');
console.log(pizza); // {name: 'Pizza', price: 15, category: 'Italian'}
```

#### **3. Currying with `bind()`**
```javascript
function multiply(a, b, c) {
    return a * b * c;
}

// Create specialized functions
const double = multiply.bind(null, 2);
console.log(double(3, 4)); // 24 (2 * 3 * 4)

const triple = multiply.bind(null, 3);
console.log(triple(5, 6)); // 90 (3 * 5 * 6)

// Multiple arguments pre-bound
const multiplyByTwoAndThree = multiply.bind(null, 2, 3);
console.log(multiplyByTwoAndThree(4)); // 24 (2 * 3 * 4)
```

#### **4. Event Handlers with Context**
```javascript
class Button {
    constructor(text) {
        this.text = text;
        this.element = document.createElement('button');
        this.element.textContent = text;
        
        // Without bind: this would be the button element
        // With bind: this is the Button instance
        this.element.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick() {
        console.log(`Button "${this.text}" was clicked`);
    }
}

const myButton = new Button('Click me');
```

#### **5. Setting `this` for Callbacks**
```javascript
const dataProcessor = {
    data: [1, 2, 3, 4, 5],
    multiplier: 2,
    
    process: function() {
        // Without bind: this would be undefined in map callback
        return this.data.map(function(item) {
            return item * this.multiplier; // this is undefined!
        }.bind(this)); // Bind to dataProcessor
    }
};

console.log(dataProcessor.process()); // [2, 4, 6, 8, 10]

// Alternative with arrow function (no bind needed)
const dataProcessor2 = {
    data: [1, 2, 3, 4, 5],
    multiplier: 2,
    
    process: function() {
        return this.data.map(item => item * this.multiplier);
    }
};
```

### **Creating Polyfills**
```javascript
// Polyfill for bind() (simplified)
if (!Function.prototype.bind) {
    Function.prototype.bind = function(context, ...boundArgs) {
        const originalFunc = this;
        
        return function(...callArgs) {
            return originalFunc.apply(context, [...boundArgs, ...callArgs]);
        };
    };
}

// Usage
function greet(greeting, punctuation) {
    console.log(greeting + ' ' + this.name + punctuation);
}

const person = { name: 'John' };
const boundGreet = greet.bind(person, 'Hello');
boundGreet('!'); // "Hello John!"
```

---

## 10. Prototypal Inheritance

### **What is Prototypal Inheritance?**
JavaScript uses prototype-based inheritance, where objects can inherit properties and methods from other objects.

```javascript
// Every object has a prototype property
const animal = {
    eats: true,
    walk() {
        console.log('Animal walks');
    }
};

const rabbit = {
    jumps: true,
    __proto__: animal // Sets prototype (old way)
};

console.log(rabbit.eats); // true (inherited)
console.log(rabbit.jumps); // true (own property)
rabbit.walk(); // 'Animal walks' (inherited)
```

### **`__proto__` vs `prototype`**
```javascript
// __proto__ is a property on OBJECTS (the actual prototype)
// prototype is a property on FUNCTIONS (used when called with new)

function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound`);
};

const dog = new Animal('Dog');
console.log(dog.__proto__ === Animal.prototype); // true

// The prototype chain:
// dog -> Animal.prototype -> Object.prototype -> null
```

### **Creating Inheritance Chains**

#### **Constructor-based Inheritance**
```javascript
// Parent constructor
function Animal(name) {
    this.name = name;
    this.eats = true;
}

Animal.prototype.walk = function() {
    console.log(`${this.name} walks`);
};

// Child constructor
function Rabbit(name) {
    Animal.call(this, name); // Call parent constructor
    this.jumps = true;
}

// Set up prototype chain
Rabbit.prototype = Object.create(Animal.prototype);
Rabbit.prototype.constructor = Rabbit; // Fix constructor reference

Rabbit.prototype.hop = function() {
    console.log(`${this.name} hops`);
};

const bunny = new Rabbit('Bunny');
console.log(bunny.eats); // true (inherited)
console.log(bunny.jumps); // true (own)
bunny.walk(); // 'Bunny walks' (inherited)
bunny.hop(); // 'Bunny hops' (own)
```

#### **Object.create() Method**
```javascript
const animal = {
    eats: true,
    walk() {
        console.log('Animal walks');
    }
};

// Create object with specified prototype
const rabbit = Object.create(animal, {
    jumps: {
        value: true,
        enumerable: true
    },
    name: {
        value: 'Rabbit',
        enumerable: true
    }
});

console.log(rabbit.eats); // true
rabbit.walk(); // 'Animal walks'
console.log(rabbit.jumps); // true
```

### **Checking Prototype Relationships**
```javascript
function Animal() {}
function Rabbit() {}
Rabbit.prototype = Object.create(Animal.prototype);

const rabbit = new Rabbit();

console.log(rabbit instanceof Rabbit); // true
console.log(rabbit instanceof Animal); // true
console.log(rabbit instanceof Object); // true

console.log(Rabbit.prototype.isPrototypeOf(rabbit)); // true
console.log(Animal.prototype.isPrototypeOf(rabbit)); // true
console.log(Object.prototype.isPrototypeOf(rabbit)); // true

// Get prototype
console.log(Object.getPrototypeOf(rabbit) === Rabbit.prototype); // true
```

---

## 11. Prototype Chain

### **What is the Prototype Chain?**
The prototype chain is the mechanism JavaScript uses to look up properties and methods on objects.

```javascript
const grandparent = { a: 1 };
const parent = { b: 2, __proto__: grandparent };
const child = { c: 3, __proto__: parent };

console.log(child.a); // 1 (from grandparent)
console.log(child.b); // 2 (from parent)
console.log(child.c); // 3 (own property)

// The lookup chain: child -> parent -> grandparent -> Object.prototype -> null
```

### **Property Lookup Mechanism**
```javascript
const obj = {
    name: 'Object',
    
    toString() {
        return `Custom: ${this.name}`;
    }
};

console.log(obj.toString()); // 'Custom: Object'
console.log(obj.valueOf()); // {name: 'Object'} (from Object.prototype)
console.log(obj.hasOwnProperty('name')); // true (from Object.prototype)

// Lookup process:
// 1. Check own properties
// 2. Check prototype
// 3. Check prototype's prototype
// 4. Continue until null
```

### **Shadowing Properties**
```javascript
const animal = {
    eats: true,
    walk() {
        console.log('Animal walk');
    }
};

const rabbit = {
    __proto__: animal,
    walk() {
        super.walk(); // Call parent method
        console.log('Rabbit hop');
    }
};

rabbit.walk();
// 'Animal walk'
// 'Rabbit hop'

console.log(rabbit.eats); // true (inherited)
rabbit.eats = false; // Creates own property (shadows)
console.log(rabbit.eats); // false (own)
console.log(animal.eats); // true (unchanged)
```

### **The Ultimate Prototype: `Object.prototype`**
```javascript
// All objects inherit from Object.prototype (except those created with null prototype)
const obj = {};

// Methods from Object.prototype:
console.log(obj.toString()); // '[object Object]'
console.log(obj.valueOf()); // {}
console.log(obj.hasOwnProperty('toString')); // false (inherited)
console.log(obj.propertyIsEnumerable('toString')); // false

// Creating object with null prototype
const noProto = Object.create(null);
console.log(noProto.toString); // undefined
console.log('toString' in noProto); // false
```

### **Modifying Built-in Prototypes**
```javascript
// Generally NOT recommended, but possible
Array.prototype.customMap = function(callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};

const numbers = [1, 2, 3];
const doubled = numbers.customMap(n => n * 2);
console.log(doubled); // [2, 4, 6]

// Dangers:
// 1. Can break existing code
// 2. Conflicts with future JavaScript features
// 3. Performance issues

// Safer approach: utility functions
const arrayUtils = {
    customMap: function(arr, callback) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(callback(arr[i], i, arr));
        }
        return result;
    }
};
```

---

## 12. Constructor Functions

### **What are Constructor Functions?**
Constructor functions are regular functions that are used with the `new` keyword to create objects.

```javascript
// Constructor function (convention: PascalCase)
function Person(name, age) {
    // this refers to the new object being created
    this.name = name;
    this.age = age;
    
    // Methods inside constructor (not optimal)
    this.greet = function() {
        console.log(`Hello, I'm ${this.name}`);
    };
}

// Using new keyword
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

console.log(john.name); // 'John'
john.greet(); // 'Hello, I'm John'
```

### **What `new` Does**
```javascript
function Person(name) {
    // Under the hood when using 'new':
    // 1. Creates empty object: const this = {}
    // 2. Sets prototype: this.__proto__ = Person.prototype
    // 3. Executes constructor with this
    this.name = name;
    // 4. Returns this (unless another object is returned)
}

// Manual implementation of new
function myNew(constructor, ...args) {
    // 1. Create empty object with prototype
    const obj = Object.create(constructor.prototype);
    
    // 2. Call constructor with this
    const result = constructor.apply(obj, args);
    
    // 3. Return result if it's an object, otherwise obj
    return result instanceof Object ? result : obj;
}

const person = myNew(Person, 'Alice');
```

### **Adding Methods to Prototype**
```javascript
// Better approach: add methods to prototype
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Methods on prototype (shared across instances)
Person.prototype.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.getBirthYear = function() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.age;
};

const john = new Person('John', 30);
const jane = new Person('Jane', 25);

john.greet(); // 'Hello, I'm John'
jane.greet(); // 'Hello, I'm Jane'

console.log(john.greet === jane.greet); // true (same function)
```

### **Checking Constructor and Instance**
```javascript
function Animal(type) {
    this.type = type;
}

const dog = new Animal('dog');

console.log(dog.constructor === Animal); // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true

// The prototype chain
console.log(Object.getPrototypeOf(dog) === Animal.prototype); // true
console.log(Animal.prototype.constructor === Animal); // true
```

### **Returning Objects from Constructors**
```javascript
function Person(name) {
    this.name = name;
    
    // If constructor returns an object, new returns that object
    // instead of the automatically created this
    return { custom: 'object' };
}

const person = new Person('John');
console.log(person); // {custom: 'object'}
console.log(person.name); // undefined

function Person2(name) {
    this.name = name;
    
    // Returning primitive is ignored
    return 42;
}

const person2 = new Person2('Jane');
console.log(person2); // Person2 {name: 'Jane'}
```

### **Constructor Functions vs Factory Functions**
```javascript
// Constructor Pattern
function Car(make, model) {
    this.make = make;
    this.model = model;
}

Car.prototype.drive = function() {
    console.log(`${this.make} ${this.model} is driving`);
};

const myCar = new Car('Toyota', 'Camry');

// Factory Pattern (alternative)
function createCar(make, model) {
    return {
        make,
        model,
        drive() {
            console.log(`${make} ${model} is driving`);
        }
    };
}

const myCar2 = createCar('Honda', 'Civic');

// Comparison:
// Constructor: uses new, methods on prototype
// Factory: returns object directly, methods on each object
```

---

## 13. Classes (ES6)

### **Class Syntax**
```javascript
// Class declaration
class Person {
    // Constructor method (called with new)
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // Instance method
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
    
    // Static method
    static species() {
        return 'Homo sapiens';
    }
}

// Using the class
const john = new Person('John', 30);
john.greet(); // "Hello, I'm John"
console.log(Person.species()); // "Homo sapiens"
```

### **Class Expressions**
```javascript
// Named class expression
const Person = class PersonClass {
    constructor(name) {
        this.name = name;
    }
};

// Anonymous class expression
const Animal = class {
    constructor(type) {
        this.type = type;
    }
};
```

### **Class Inheritance**
```javascript
class Animal {
    constructor(name) {
        this.name = name;
        this.speed = 0;
    }
    
    run(speed) {
        this.speed = speed;
        console.log(`${this.name} runs at ${this.speed} km/h`);
    }
    
    stop() {
        this.speed = 0;
        console.log(`${this.name} stopped`);
    }
}

class Rabbit extends Animal {
    constructor(name, earLength) {
        super(name); // Must call super() before using this
        this.earLength = earLength;
    }
    
    hide() {
        console.log(`${this.name} hides`);
    }
    
    // Override parent method
    stop() {
        super.stop(); // Call parent method
        this.hide();
    }
}

const rabbit = new Rabbit('Bunny', 10);
rabbit.run(5); // "Bunny runs at 5 km/h" (inherited)
rabbit.stop(); // "Bunny stopped" then "Bunny hides"
console.log(rabbit.earLength); // 10
```

### **Class Fields (ES2022)**
```javascript
class User {
    // Instance field (per instance)
    name = 'Anonymous';
    
    // Private field (starts with #)
    #password = 'secret';
    
    // Static field
    static version = '1.0';
    
    constructor(name) {
        this.name = name;
    }
    
    // Private method
    #validatePassword(pass) {
        return pass === this.#password;
    }
    
    login(password) {
        if (this.#validatePassword(password)) {
            console.log('Login successful');
        } else {
            console.log('Login failed');
        }
    }
    
    getPassword() {
        // Cannot access private field directly
        // return this.#password; // SyntaxError
        return '******';
    }
}

const user = new User('John');
console.log(user.name); // 'John'
console.log(User.version); // '1.0'
user.login('secret'); // 'Login successful'
console.log(user.getPassword()); // '******'
```

### **Getters and Setters in Classes**
```javascript
class Temperature {
    constructor(celsius) {
        this.celsius = celsius;
    }
    
    get fahrenheit() {
        return this.celsius * 1.8 + 32;
    }
    
    set fahrenheit(value) {
        this.celsius = (value - 32) / 1.8;
    }
    
    static fromFahrenheit(value) {
        return new Temperature((value - 32) / 1.8);
    }
}

const temp = new Temperature(25);
console.log(temp.fahrenheit); // 77
temp.fahrenheit = 86;
console.log(temp.celsius); // 30
```

### **Classes vs Constructor Functions**
```javascript
// Class syntax (ES6)
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        console.log(`Hello ${this.name}`);
    }
}

// Equivalent constructor function (ES5)
function PersonES5(name) {
    this.name = name;
}

PersonES5.prototype.greet = function() {
    console.log(`Hello ${this.name}`);
};

// Both work similarly
const person1 = new Person('Alice');
const person2 = new PersonES5('Bob');

// But classes have additional features:
// 1. Cannot be called without new
// 2. Class methods are non-enumerable
// 3. Always use strict mode
// 4. No hoisting (unlike function declarations)
```

---

## 14. Static Methods

### **What are Static Methods?**
Static methods are called on the class itself, not on instances of the class. They are often utility functions.

```javascript
class MathUtils {
    // Static method
    static sum(a, b) {
        return a + b;
    }
    
    static multiply(a, b) {
        return a * b;
    }
    
    // Instance method
    square(x) {
        return x * x;
    }
}

// Using static methods
console.log(MathUtils.sum(5, 3)); // 8
console.log(MathUtils.multiply(4, 2)); // 8

// Cannot call static method on instance
const utils = new MathUtils();
console.log(utils.square(5)); // 25 (instance method)
// console.log(utils.sum(2, 3)); // TypeError
```

### **Static Properties**
```javascript
class Config {
    // Static property
    static apiUrl = 'https://api.example.com';
    static version = '1.0.0';
    
    // Static method using static property
    static getApiEndpoint(endpoint) {
        return `${this.apiUrl}/${endpoint}`;
    }
}

console.log(Config.apiUrl); // 'https://api.example.com'
console.log(Config.getApiEndpoint('users')); // 'https://api.example.com/users'
```

### **Static Methods in Inheritance**
```javascript
class Animal {
    static planet = 'Earth';
    
    static isAnimal(obj) {
        return obj instanceof this;
    }
}

class Rabbit extends Animal {
    static habitat = 'Forest';
}

console.log(Rabbit.planet); // 'Earth' (inherited)
console.log(Rabbit.habitat); // 'Forest' (own)

const rabbit = new Rabbit();
console.log(Rabbit.isAnimal(rabbit)); // true
console.log(Animal.isAnimal(rabbit)); // true
```

### **Use Cases for Static Methods**

#### **1. Factory Methods**
```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // Factory method
    static createFromJSON(json) {
        const data = JSON.parse(json);
        return new User(data.name, data.age);
    }
    
    static createAnonymous() {
        return new User('Anonymous', 0);
    }
}

const user1 = User.createFromJSON('{"name": "John", "age": 30}');
const user2 = User.createAnonymous();
```

#### **2. Utility Functions**
```javascript
class StringUtils {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    static reverse(str) {
        return str.split('').reverse().join('');
    }
    
    static isPalindrome(str) {
        const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === this.reverse(clean);
    }
}

console.log(StringUtils.capitalize('hello')); // 'Hello'
console.log(StringUtils.reverse('world')); // 'dlrow'
console.log(StringUtils.isPalindrome('racecar')); // true
```

#### **3. Singleton Pattern**
```javascript
class Database {
    static instance = null;
    
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        // Initialize connection
        this.connection = 'Connected to database';
        Database.instance = this;
    }
    
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    
    query(sql) {
        console.log(`Executing: ${sql}`);
    }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true (same instance)
```

#### **4. Validation Methods**
```javascript
class Validator {
    static isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    static isStrongPassword(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /[0-9]/.test(password);
    }
    
    static validateUser(user) {
        const errors = [];
        
        if (!this.isEmail(user.email)) {
            errors.push('Invalid email');
        }
        
        if (!this.isStrongPassword(user.password)) {
            errors.push('Password too weak');
        }
        
        return errors;
    }
}

const user = { email: 'test@example.com', password: 'StrongPass123' };
console.log(Validator.validateUser(user)); // []
```

---

## 15. Encapsulation

### **What is Encapsulation?**
Encapsulation is the bundling of data (properties) and methods (functions) that operate on that data within a single unit (object/class), restricting direct access to some components.

### **Private Fields and Methods**
```javascript
class BankAccount {
    // Private field (starts with #)
    #balance = 0;
    #accountNumber;
    
    constructor(accountNumber, initialBalance) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    // Public methods (interface)
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            return true;
        }
        return false;
    }
    
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return amount;
        }
        return 0;
    }
    
    getBalance() {
        return this.#balance;
    }
    
    // Private method
    #validateAmount(amount) {
        return amount > 0 && Number.isFinite(amount);
    }
}

const account = new BankAccount('12345', 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(account.#balance); // SyntaxError
// console.log(account.#validateAmount); // SyntaxError
```

### **Closures for Encapsulation (Pre-ES6)**
```javascript
function createBankAccount(initialBalance) {
    // Private variable (in closure)
    let balance = initialBalance;
    
    // Private function
    function isValidAmount(amount) {
        return amount > 0 && Number.isFinite(amount);
    }
    
    // Public API
    return {
        deposit: function(amount) {
            if (isValidAmount(amount)) {
                balance += amount;
                return balance;
            }
            return false;
        },
        
        withdraw: function(amount) {
            if (isValidAmount(amount) && amount <= balance) {
                balance -= amount;
                return amount;
            }
            return 0;
        },
        
        getBalance: function() {
            return balance;
        }
    };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500);
console.log(account.getBalance()); // 1500
// account.balance is not accessible
```

### **Protected Properties Convention**
```javascript
class CoffeeMachine {
    // Protected property (convention: start with _)
    _waterAmount = 0;
    
    constructor(power) {
        this._power = power;
    }
    
    set waterAmount(value) {
        if (value < 0) throw new Error("Negative water");
        this._waterAmount = value;
    }
    
    get waterAmount() {
        return this._waterAmount;
    }
    
    get power() {
        return this._power;
    }
}

// Still accessible but by convention should not be touched directly
const machine = new CoffeeMachine(100);
machine._waterAmount = 100; // Works, but shouldn't
```

### **Module Pattern for Encapsulation**
```javascript
const Module = (function() {
    // Private variables
    let privateCounter = 0;
    const privateArray = [];
    
    // Private function
    function privateIncrement() {
        privateCounter++;
    }
    
    // Public API
    return {
        increment: function() {
            privateIncrement();
        },
        
        getCount: function() {
            return privateCounter;
        },
        
        addItem: function(item) {
            privateArray.push(item);
        },
        
        getItems: function() {
            return [...privateArray]; // Return copy
        }
    };
})();

Module.increment();
console.log(Module.getCount()); // 1
Module.addItem('test');
console.log(Module.getItems()); // ['test']
// Module.privateCounter is not accessible
```

---

## 16. Polymorphism

### **What is Polymorphism?**
Polymorphism allows objects of different types to be treated as objects of a common super type, responding differently to the same method call.

### **Method Overriding**
```javascript
class Animal {
    makeSound() {
        console.log('Some generic animal sound');
    }
}

class Dog extends Animal {
    // Override parent method
    makeSound() {
        console.log('Woof! Woof!');
    }
}

class Cat extends Animal {
    // Override parent method
    makeSound() {
        console.log('Meow!');
    }
}

function animalSounds(animals) {
    animals.forEach(animal => animal.makeSound());
}

const animals = [new Animal(), new Dog(), new Cat()];
animalSounds(animals);
// Some generic animal sound
// Woof! Woof!
// Meow!
```

### **Polymorphism with Different Types**
```javascript
// Shape hierarchy
class Shape {
    area() {
        return 0;
    }
    
    perimeter() {
        return 0;
    }
    
    describe() {
        console.log(`Area: ${this.area()}, Perimeter: ${this.perimeter()}`);
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius ** 2;
    }
    
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
    
    perimeter() {
        return 2 * (this.width + this.height);
    }
}

class Triangle extends Shape {
    constructor(base, height, side1, side2, side3) {
        super();
        this.base = base;
        this.height = height;
        this.side1 = side1;
        this.side2 = side2;
        this.side3 = side3;
    }
    
    area() {
        return 0.5 * this.base * this.height;
    }
    
    perimeter() {
        return this.side1 + this.side2 + this.side3;
    }
}

// Polymorphic behavior
const shapes = [
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 4, 3, 4, 5)
];

shapes.forEach(shape => shape.describe());
// Each shape calculates area and perimeter differently
```

### **Duck Typing**
```javascript
// JavaScript uses duck typing: "If it looks like a duck and quacks like a duck, 
// it's a duck" (type determined by behavior, not class)

class Duck {
    quack() {
        console.log('Quack!');
    }
    
    swim() {
        console.log('Swimming');
    }
}

class Person {
    quack() {
        console.log('I can quack like a duck!');
    }
    
    swim() {
        console.log('I can swim');
    }
}

function makeItQuack(duckLike) {
    duckLike.quack();
}

const duck = new Duck();
const person = new Person();

makeItQuack(duck);    // 'Quack!'
makeItQuack(person);  // 'I can quack like a duck!'
```

### **Polymorphism with Composition**
```javascript
// Using composition instead of inheritance
const canEat = {
    eat() {
        console.log(`${this.name} is eating`);
        this.energy += 10;
    }
};

const canSleep = {
    sleep() {
        console.log(`${this.name} is sleeping`);
        this.energy += 20;
    }
};

const canPlay = {
    play() {
        console.log(`${this.name} is playing`);
        this.energy -= 5;
    }
};

function createAnimal(name, energy = 100) {
    const animal = {
        name,
        energy,
        ...canEat,
        ...canSleep
    };
    
    return animal;
}

function createDog(name, energy = 100) {
    const dog = createAnimal(name, energy);
    
    // Add dog-specific behavior
    Object.assign(dog, {
        ...canPlay,
        bark() {
            console.log(`${this.name} says Woof!`);
        }
    });
    
    return dog;
}

const dog = createDog('Buddy');
dog.eat();    // Polymorphic: from canEat mixin
dog.sleep();  // Polymorphic: from canSleep mixin
dog.bark();   // Dog-specific
```

---

## 17. Getters & Setters

### **What are Getters and Setters?**
Getters and setters are special methods that provide controlled access to object properties.

### **Object Getters/Setters**
```javascript
const person = {
    firstName: 'John',
    lastName: 'Doe',
    
    // Getter
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },
    
    // Setter
    set fullName(name) {
        const parts = name.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1] || '';
    },
    
    // Computed property with validation
    _age: 0,
    
    get age() {
        return this._age;
    },
    
    set age(value) {
        if (value < 0) {
            throw new Error('Age cannot be negative');
        }
        if (value > 150) {
            throw new Error('Age seems unrealistic');
        }
        this._age = value;
    }
};

console.log(person.fullName); // 'John Doe' (getter)
person.fullName = 'Jane Smith'; // setter
console.log(person.firstName); // 'Jane'
console.log(person.lastName); // 'Smith'

person.age = 30; // Works
// person.age = -5; // Error: Age cannot be negative
```

### **Class Getters/Setters**
```javascript
class User {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // Getter
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    // Setter
    set fullName(name) {
        const [first, ...rest] = name.split(' ');
        this.firstName = first;
        this.lastName = rest.join(' ');
    }
    
    // Getter-only property
    get initials() {
        return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }
}

const user = new User('John', 'Doe');
console.log(user.fullName); // 'John Doe'
user.fullName = 'Jane Ann Smith';
console.log(user.firstName); // 'Jane'
console.log(user.lastName); // 'Ann Smith'
console.log(user.initials); // 'JS'
```

### **Advanced Getter/Setter Patterns**

#### **1. Validation and Transformation**
```javascript
class Temperature {
    constructor(celsius) {
        this._celsius = celsius;
    }
    
    get celsius() {
        return this._celsius;
    }
    
    set celsius(value) {
        if (value < -273.15) {
            throw new Error('Temperature below absolute zero');
        }
        this._celsius = value;
    }
    
    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    }
    
    set fahrenheit(value) {
        this._celsius = (value - 32) * 5/9;
    }
    
    get kelvin() {
        return this._celsius + 273.15;
    }
    
    set kelvin(value) {
        this._celsius = value - 273.15;
    }
}

const temp = new Temperature(25);
console.log(temp.fahrenheit); // 77
temp.fahrenheit = 100;
console.log(temp.celsius); // 37.777...
```

#### **2. Lazy Evaluation**
```javascript
class ExpensiveComputation {
    constructor() {
        this._result = null;
        this._computed = false;
    }
    
    get result() {
        if (!this._computed) {
            console.log('Computing expensive result...');
            this._result = this._performComputation();
            this._computed = true;
        }
        return this._result;
    }
    
    _performComputation() {
        // Simulate expensive computation
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
            sum += Math.sqrt(i);
        }
        return sum;
    }
}

const comp = new ExpensiveComputation();
console.log(comp.result); // Computes once
console.log(comp.result); // Returns cached result
```

#### **3. Proxy Pattern with Getters/Setters**
```javascript
class ObservableObject {
    constructor(obj) {
        this._data = obj;
        this._listeners = {};
        
        // Create getters/setters for all properties
        for (const key in obj) {
            Object.defineProperty(this, key, {
                get: () => this._data[key],
                set: (value) => {
                    const oldValue = this._data[key];
                    this._data[key] = value;
                    this._notify(key, oldValue, value);
                }
            });
        }
    }
    
    observe(property, callback) {
        if (!this._listeners[property]) {
            this._listeners[property] = [];
        }
        this._listeners[property].push(callback);
    }
    
    _notify(property, oldValue, newValue) {
        if (this._listeners[property]) {
            this._listeners[property].forEach(callback => {
                callback(oldValue, newValue);
            });
        }
    }
}

const obj = new ObservableObject({ name: 'John', age: 30 });
obj.observe('name', (oldVal, newVal) => {
    console.log(`Name changed from ${oldVal} to ${newVal}`);
});

obj.name = 'Jane'; // Logs: Name changed from John to Jane
```

#### **4. Read-only Properties**
```javascript
class Product {
    constructor(id, name, price) {
        // Private fields (truly private)
        this._id = id;
        this._name = name;
        this._price = price;
        
        // Read-only getters
        Object.defineProperty(this, 'id', {
            get: () => this._id,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'name', {
            get: () => this._name,
            set: (value) => {
                if (typeof value === 'string' && value.length > 0) {
                    this._name = value;
                }
            },
            enumerable: true
        });
        
        Object.defineProperty(this, 'price', {
            get: () => this._price,
            set: (value) => {
                if (value >= 0) {
                    this._price = value;
                }
            },
            enumerable: true
        });
    }
}

const product = new Product(1, 'Laptop', 999);
console.log(product.id); // 1
product.id = 2; // Silent fail (in strict mode: TypeError)
console.log(product.id); // 1 (unchanged)
```

---

## 🎯 Best Practices Summary

### **Execution Context & Scope**
- Understand the difference between creation and execution phases
- Use `let` and `const` for block scoping
- Avoid hoisting surprises by declaring variables at the top

### **Memory Management**
- Be aware of closures keeping references alive
- Clean up event listeners and intervals
- Use weak references (`WeakMap`, `WeakSet`) when appropriate

### **`this` Context**
- Arrow functions don't have their own `this` (use for lexical `this`)
- Regular functions have dynamic `this` (use for methods)
- Use `bind()`, `call()`, `apply()` to explicitly set context

### **Prototypes & Inheritance**
- Use classes for cleaner OOP syntax
- Understand prototype chain for debugging
- Favor composition over inheritance when possible

### **Encapsulation**
- Use private fields (`#`) for true encapsulation
- Follow naming conventions (`_private`) when needed
- Provide controlled access via getters/setters

### **Polymorphism**
- Design interfaces that can work with multiple types
- Use method overriding for specialization
- Leverage duck typing for flexibility

---

## 📚 Additional Resources

### **Further Reading**
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript Visualized: Event Loop, Promises, Async/Await](https://dev.to/lydiahallie/javascript-visualized-event-loop-promises-async-await-5gke)

### **Practice Exercises**
1. Implement your own `bind`, `call`, and `apply` functions
2. Create a class hierarchy with proper encapsulation
3. Build a simple reactive system using getters/setters
4. Implement memoization with closures
5. Create a custom event emitter using prototypes

---

## ✅ Progress Checklist

- [ ] **Execution Context**: Understand creation vs execution phases, context types
- [ ] **Call Stack**: Visualize function calls, understand stack overflow
- [ ] **Memory Heap**: Differentiate stack vs heap, understand garbage collection
- [ ] **Hoisting**: Know var/let/const/function hoisting differences, understand TDZ
- [ ] **Scope**: Master global, function, block, and module scopes
- [ ] **Lexical Scope**: Understand static scoping vs dynamic scoping
- [ ] **Closures**: Create and use closures, understand memory implications
- [ ] **The "this" keyword**: Know all 6 rules for determining `this` value
- [ ] **Bind, Call, Apply**: Use for context binding, method borrowing, currying
- [ ] **Prototypal Inheritance**: Understand prototype-based inheritance model
- [ ] **Prototype Chain**: Navigate and understand property lookup
- [ ] **Constructor Functions**: Create and use constructors with `new`
- [ ] **Classes (ES6)**: Use class syntax, inheritance, private fields
- [ ] **Static Methods**: Create utility methods on classes
- [ ] **Encapsulation**: Implement data hiding with private fields/closures
- [ ] **Polymorphism**: Use method overriding and duck typing
- [ ] **Getters & Setters**: Create controlled property access with validation

---

**Remember: Understanding these deep concepts separates JavaScript developers from JavaScript masters. Practice each concept until it becomes second nature!** 🚀