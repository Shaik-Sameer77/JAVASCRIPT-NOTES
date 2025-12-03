# Core JavaScript Interview Concepts

## 1\. What are the primitive data types in JavaScript?

JavaScript has **seven** primitive data types:

  * **`string`**: Represents textual data (e.g., `"hello"`).
  * **`number`**: Represents both integer and floating-point numbers (e.g., `10`, `3.14`).
  * **`bigint`**: Represents whole numbers larger than $2^{53} - 1$ (the max for `number`).
  * **`boolean`**: Represents logical entities and can only be `true` or `false`.
  * **`undefined`**: Indicates a variable has been declared but not yet assigned a value.
  * **`symbol`**: Represents a unique and immutable value, often used as object property keys.
  * **`null`**: Represents the intentional absence of any object value. (Note: `typeof null` returns `"object"`, which is a historical bug).

**Non-Primitive Data Type:**

  * **`object`**: Used to store collections of data and more complex entities. Functions and Arrays are technically subtypes of `object`.

-----

## 2\. Explain undefined vs null.

| Feature | `undefined` | `null` |
| :--- | :--- | :--- |
| **Meaning** | Value *has not been assigned*. | Intentional *absence* of a value or object. |
| **Type** | $typeof$ returns `"undefined"`. | $typeof$ returns `"object"` (a historical JS bug). |
| **Assignment** | Usually set by the JS engine (e.g., declared variables without an initial value). | Must be explicitly set by the **developer**. |
| **Coercion** | Coerces to `NaN` in numeric context. | Coerces to `0` in numeric context. |
| **Equality** | `undefined == null` is `true`. | `undefined === null` is `false`. |

-----

## 3\. What is hoisting?

**Hoisting** is a JavaScript mechanism where **variable and function declarations** are moved to the top of their containing scope during the compilation phase, **before** the code is executed.

  * **Function declarations** are hoisted completely (both name and definition).
  * **`var` declarations** are hoisted, but only the declaration is moved (the variable is initialized to `undefined`). The assignment stays in place.
  * **`let` and `const`** declarations are also hoisted, but they are not initialized. Attempting to access them before the actual declaration results in a `ReferenceError` due to the **Temporal Dead Zone (TDZ)**.

-----

## 4\. Explain the difference between var, let, and const.

| Feature | `var` | `let` | `const` |
| :--- | :--- | :--- | :--- |
| **Scope** | **Function-scoped** or **Global-scoped**. | **Block-scoped** ($\{\}$). | **Block-scoped** ($\{\}$). |
| **Hoisting** | Hoisted and initialized to `undefined`. | Hoisted but not initialized (in the TDZ). | Hoisted but not initialized (in the TDZ). |
| **Re-declaration** | **Allowed** (can lead to bugs). | **Not allowed** in the same scope. | **Not allowed** in the same scope. |
| **Re-assignment** | **Allowed** | **Allowed** | **Not allowed** (must be initialized on declaration). |
| **Global Object** | Creates a property on the **global object** (in the global scope). | Does **not** create a property on the global object. | Does **not** create a property on the global object. |

-----

## 5\. What is the temporal dead zone (TDZ)?

The **Temporal Dead Zone (TDZ)** is the period of time during which **`let` and `const`** variables exist in the execution scope but cannot be accessed.

It starts at the beginning of the scope (the block) and ends when the variable's declaration is executed. Accessing a variable within the TDZ will result in a `ReferenceError`. This makes code less error-prone compared to `var`'s hoisting behavior.

-----

## 6\. Explain type coercion.

**Type coercion** is the automatic or implicit conversion of values from one data type to another (e.g., from `string` to `number`, `boolean` to `number`).

  * **Implicit Coercion:** Happens automatically by the JavaScript engine when operands of different types are involved in an operation.
    ```javascript
    '5' + 1; // '51' (number 1 is coerced to string '1')
    '5' - 1; // 4 (string '5' is coerced to number 5)
    if ('0') { /* runs, because '0' is truthy */ }
    ```
  * **Explicit Coercion:** Done manually by the developer using built-in functions like `Number()`, `String()`, or `Boolean()`.
    ```javascript
    Number('10'); // 10
    ```

-----

## 7\. What is the difference between $==$ and $===$?

  * **$==$ (Abstract Equality Operator):** Performs a **loose comparison**. It checks for equality after performing **type coercion** if the operands are of different types.

  * **$===$ (Strict Equality Operator):** Performs a **strict comparison**. It checks for equality **without type coercion**. Both the **value** and the **type** of the operands must be the same for it to return `true`.

| Example | $==$ (Loose) | $===$ (Strict) | Explanation |
| :--- | :--- | :--- | :--- |
| $1 == '1'$ | `true` | `false` | $==$ coerces `'1'` to $1$. |
| $null == undefined$ | `true` | `false` | JS specification defines these as loosely equal. |
| $0 == false$ | `true` | `false` | $==$ coerces `false` to $0$. |

**Best Practice:** Always use $===$ to prevent unexpected results from implicit type coercion.

-----

## 8\. What is NaN? How to check for NaN?

**NaN** stands for **Not a Number**. It's a special value of the `number` type that represents an undefined or unrepresentable numerical result (e.g., the result of dividing $0$ by $0$, or trying to convert a non-numeric string to a number).

**Key property:** `NaN` is the *only* value in JavaScript that is not equal to itself.

$$NaN === NaN \quad \text{is } \quad \text{false}$$

### How to check for NaN:

1.  **`Number.isNaN(value)` (Recommended):** This is the most reliable way. It returns `true` only if the value is explicitly the `NaN` number type.
2.  **`isNaN(value)` (Legacy):** This function is less reliable because it coerces the argument to a number *first*. It returns `true` for values that are *not* `NaN` but will be coerced into it (e.g., `isNaN('hello')` is `true`).
3.  **Self-inequality (The Hack):** Leverage the unique property:
    ```javascript
    const isNaNValue = (value) => value !== value;
    ```

-----

## 9\. What are template literals?

**Template literals** (also known as template strings) are a way to create strings in JavaScript using **backticks (\` \`)** instead of single or double quotes.

They offer three key advantages:

1.  **String Interpolation:** Allows embedding expressions inside the string using the `${expression}` syntax.
2.  **Multi-line Strings:** Strings can span multiple lines without needing the `\n` character.
3.  **Tagged Templates:** A more advanced form where a function can process the template literal before it's converted to a string.

<!-- end list -->

```javascript
const name = 'Alice';
const greeting = `Hello, ${name}!
How are you today?`;
// greeting is a two-line string: "Hello, Alice!\nHow are you today?"
```

-----

## 10\. What is the difference between "mutable" and "immutable" data?

| Feature | Mutable Data | Immutable Data |
| :--- | :--- | :--- |
| **Definition** | Data that **can be changed** *after* it is created. | Data that **cannot be changed** *after* it is created. |
| **Change Method** | Changes are made **in place**. The memory reference remains the same. | Changes require creating a **brand new copy** with the modifications. |
| **JS Types** | **Objects** (including Arrays and Functions) are generally mutable. | **Primitives** (string, number, boolean, null, undefined, symbol, bigint) are all immutable. |

**Example:**

```javascript
// Mutable (Object)
const obj = { a: 1 };
obj.a = 2; // Mutated in place

// Immutable (String)
let str = 'hello';
str.toUpperCase(); // returns 'HELLO', but str is still 'hello'
str = 'HELLO'; // This is a new assignment, not mutation of the original string
```

-----

## 11\. What are pure functions?

A **pure function** is a function that adheres to two main principles:

1.  **Deterministic (Same Input, Same Output):** Given the same arguments, it will always return the same result. It does not rely on any state other than the passed-in arguments.
2.  **No Side Effects:** It does not cause any observable changes outside its local scope. This means it doesn't:
      * Mutate global state or passed-in arguments.
      * Perform I/O operations (like API calls or logging to the console).
      * Modify the DOM.

**Benefits:** They are easier to test, debug, and reason about, as they are fully isolated.

-----

## 12\. Explain pass-by-value vs pass-by-reference in JavaScript.

JavaScript uses **pass-by-value** for **all** arguments passed to a function, but the *value* for objects is actually a **reference** (an address in memory). This leads to behavior often described as "pass-by-sharing."

### 1\. Primitives (Truly Pass-by-Value)

  * The actual value is copied.
  * Changing the variable inside the function **does not** affect the original variable outside the function.

### 2\. Objects (Pass-by-Reference-Value / Pass-by-Sharing)

  * The **memory address (reference)** is copied (the "value" being passed is the reference).
  * If you **reassign** the parameter inside the function, the outside object is **not** affected.
  * If you **mutate** a property of the object inside the function, the original object **is** affected, because both variables point to the same object in memory.

-----

## 13\. What is the event loop?

The **Event Loop** is a fundamental mechanism in JavaScript that allows it to perform **non-blocking asynchronous operations** despite being single-threaded.

### Key Components:

  * **Call Stack:** Where synchronous code is executed. Functions are pushed onto the stack and popped off when they return.
  * **Web APIs (or Node APIs):** Provided by the browser/Node environment (e.g., `setTimeout`, DOM events, `fetch`). These handle asynchronous operations.
  * **Callback Queue (or Message Queue / Macrotask Queue):** Stores callback functions that are ready to be executed (e.g., `setTimeout` callbacks, DOM event handlers).
  * **Job Queue (or Microtask Queue):** Stores higher-priority callbacks (e.g., Promises, `queueMicrotask`).

### Event Loop's Job:

The Event Loop continuously checks if the **Call Stack is empty**. If it is, it takes the first task from the **Job Queue** (Microtasks) or the **Callback Queue** (Macrotasks) and pushes it onto the Call Stack for execution. It prioritizes the **Microtask Queue** over the **Macrotask Queue**.

-----

## 14\. What are Microtasks vs Macrotasks?

Both queues hold asynchronous operations that are waiting to be executed by the Event Loop, but they have different priority levels.

| Feature | Microtasks (Job Queue) | Macrotasks (Task Queue/Message Queue) |
| :--- | :--- | :--- |
| **Priority** | **High Priority**. Executed immediately after the current script finishes and before the next Macrotask. | **Lower Priority**. Only one Macrotask is processed per turn of the Event Loop. |
| **Sources** | **Promises** (`.then()`, `.catch()`, `.finally()`), `queueMicrotask`, `MutationObserver`. | **`setTimeout()`**, **`setInterval()`**, **I/O**, **UI Rendering**, **DOM Events** (`click`, `load`). |
| **Execution** | The Event Loop will empty the **entire Microtask queue** *before* moving on to the next Macrotask. | Only **one** Macrotask is processed per iteration of the Event Loop. |

-----

## 15\. What is a closure?

A **closure** is the combination of a function and the **lexical environment** (scope) in which that function was declared.

In simpler terms, a function forms a closure when it "remembers" and can access variables from its outer scope, **even after the outer function has finished executing**.

```javascript
function outer() {
  const outerVar = 'I am closed over';
  function inner() {
    console.log(outerVar); // inner has access to outerVar
  }
  return inner;
}

const myClosure = outer();
myClosure(); // 'I am closed over' - outer() has finished, but inner() still holds its scope.
```

-----

## 16\. Give a practical example of closure in real applications.

A very practical use case for closures is to implement **private methods** or **data encapsulation** (like a private counter).

### Example: Counter Module

```javascript
function createCounter() {
  let count = 0; // This variable is 'private'

  return {
    increment: function() {
      count++;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counterA = createCounter();
console.log(counterA.increment()); // 1
console.log(counterA.increment()); // 2
console.log(counterA.count);       // undefined (cannot be accessed directly)
```

The inner functions (`increment`, `getCount`) are closures. They maintain a reference to the `count` variable from their lexical environment, while the variable itself is inaccessible from the outside.

-----

## 17\. What is scope? Block/Function/Global?

**Scope** determines the accessibility of variables, objects, and functions within different parts of your code.

  * **Global Scope:** Variables declared outside any function or block. They are accessible from anywhere in the code.
    ```javascript
    var globalVar = 'Global'; // Global scope
    ```
  * **Function Scope:** Variables declared with `var` inside a function. They are accessible only within that function (including nested functions).
    ```javascript
    function funcScope() {
      var funcVar = 'Function'; // Function scope
    }
    ```
  * **Block Scope (ES6):** Variables declared with `let` and `const` inside a code block (delineated by curly braces, e.g., in `if` statements, `for` loops, or just standalone blocks). They are accessible only within that block.
    ```javascript
    if (true) {
      let blockVar = 'Block'; // Block scope
    }
    ```

-----

## 18\. What is lexical scope?

**Lexical scope** (or static scope) means that the scope of a variable is determined by **where it is written in the code** (its location at declaration/definition), not where it is called from.

In JavaScript, nested functions are lexically bound to their outer function's scope. This is the mechanism that enables **closures** (as described in Q15), allowing an inner function to look up variables in its surrounding scopes, all the way up to the global scope.

-----

## 19\. What are Immediately Invoked Function Expressions (IIFE)?

An **Immediately Invoked Function Expression (IIFE)** is a JavaScript function that runs as soon as it is defined.

### Structure:

```javascript
(function () {
  // code to be executed immediately
})();
```

The two surrounding parentheses (`()`) turn the function declaration into an expression, and the final pair of parentheses (`()`) executes it.

### Purpose:

The primary use of IIFE is to create a **private scope** for variables, preventing them from polluting the global scope. This is useful for module patterns where you want to protect your internal logic and variables.

-----

## 20\. What are higher-order functions?

A **higher-order function (HOF)** is a function that does at least one of the following:

1.  **Takes one or more functions as arguments.**
2.  **Returns a function as its result.**

**Examples:**

  * **Array Methods:** `map`, `filter`, `reduce` are common HOFs because they accept a callback function as an argument.
  * **`setTimeout`** and **`Event Handlers`** are also HOFs, as they take a function to be executed later.
  * **Factory functions** that create and return other functions.

-----

## 21\. What are callback functions?

A **callback function** is a function that is **passed as an argument** to another function, and is intended to be executed (or "called back") later.

Callbacks are the foundation of JavaScript's **asynchronous programming** model, enabling non-blocking operations:

  * **Asynchronous:** Handling API responses, timers (`setTimeout`), and event listeners.
  * **Synchronous:** Used in HOFs like `map`, `filter`, and `reduce`.

<!-- end list -->

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = 'some data';
    callback(data); // Execute the callback when data is ready
  }, 1000);
}

fetchData((result) => {
  console.log('Received:', result); // This is the callback function
});
```

-----

## 22\. Why are callbacks problematic? (Callback Hell)

Callbacks become problematic in scenarios involving multiple nested asynchronous operations, leading to a structure known as **Callback Hell** or the "Pyramid of Doom."

### Issues:

  * **Readability:** The deeply nested code is extremely difficult to read and follow.
  * **Maintainability:** Making changes becomes complex and error-prone.
  * **Error Handling:** Catching errors consistently across multiple nesting levels is challenging.
  * **Inversion of Control:** The outer function is responsible for calling the callback, which can be an issue if the outer function calls it too many times, too few times, or never.

**Modern Solution:** **Promises** and **`async/await`** were introduced to flatten the structure and resolve Callback Hell.

-----

## 23\. What is "use strict"? What changes in strict mode?

**`'use strict'`** is a literal expression that can be placed at the beginning of a script or a function to enable **Strict Mode**. It makes JavaScript code run in a stricter parsing and execution context, leading to safer and more robust code.

### Key Changes/Restrictions in Strict Mode:

1.  **Eliminates "silent errors"** by turning them into exceptions (e.g., trying to assign to a non-writable property).
2.  **Disallows implicit global variables:** Variables must be declared with `var`, `let`, or `const`. Without them, assignments to undeclared variables fail.
3.  **Restricts `this`:** The value of `this` inside functions (when not explicitly set with `call`, `apply`, or `bind`) is `undefined` instead of the global object.
4.  **Disallows `with` statement** and explicit use of `arguments.caller` or `arguments.callee`.
5.  **Disallows duplicate parameter names** in functions.

-----

## 24\. What is the difference between shallow copy vs deep copy?

These concepts relate to how objects/arrays are copied, especially when they contain nested objects or arrays.

| Feature | Shallow Copy | Deep Copy |
| :--- | :--- | :--- |
| **Definition** | A new object is created, but it only copies the **top-level** properties' *values*. | A new object is created, and it recursively copies **all** properties and nested objects. |
| **Nested Objects** | The nested objects in the copy are still **references** to the original objects. | Nested objects are also copied, so the original and the copy are **completely independent**. |
| **Mutation** | Modifying a nested object in the copy will **affect** the original. | Modifying a nested object in the copy will **not affect** the original. |
| **Implementation** | **`Object.assign()`**, **Spread syntax (`...`)**, **`Array.prototype.slice()`**. | **`JSON.parse(JSON.stringify(obj))`** (common but limited) or dedicated library functions (e.g., Lodash's `_.cloneDeep()`). |

-----

## 25\. How does `this` behave in different contexts?

The value of `this` is not fixed; it is determined dynamically by **how a function is called** (the execution context).

| Context | `this` Value | Example |
| :--- | :--- | :--- |
| **Global Scope** | Global object (`window` in browsers, `global` in Node.js). | `console.log(this)` $\rightarrow$ Global Object |
| **Simple Function Call** | In **strict mode**, `undefined`. In **non-strict mode**, the global object. | `function f() { console.log(this); } f()` |
| **Method Call** | The object that owns the method. | `obj.method()` $\rightarrow$ `this` is `obj` |
| **Constructor Call** | The **newly created object** instance. | `new MyClass()` $\rightarrow$ `this` is the instance |
| **Explicit Binding** | The object explicitly passed as the first argument to `call()`, `apply()`, or `bind()`. | `func.call(someObj)` $\rightarrow$ `this` is `someObj` |
| **Arrow Functions (ES6)** | `this` is **lexically scoped**. It inherits `this` from the surrounding (enclosing) scope and **cannot** be rebound. | `const af = () => { console.log(this); }` $\rightarrow$ `this` is whatever `this` is outside the arrow function. |

-----

## 26\. What is the global object in browsers vs Node.js?

The **Global Object** is the object that sits at the top of the scope chain and provides functions and variables that are available everywhere.

| Environment | Global Object Name | Key Differences |
| :--- | :--- | :--- |
| **Browser** | **`window`** (or `self`, `frames` for cross-window contexts). | Contains properties like `document`, `location`, `setTimeout`, and all global variables declared with `var`. |
| **Node.js** | **`global`** | Contains properties like `process`, `require`, `setTimeout`. Variables declared in the main module are **not** added to `global` by default. |
| **Universal (ES2020)** | **`globalThis`** | A standardized property that refers to the global object in any JavaScript environment, providing a consistent way to access it. |

-----

## 27\. What is prototype inheritance?

**Prototype inheritance** is the mechanism in JavaScript where objects inherit properties and methods from other objects.

  * Every object in JavaScript has an internal property called `[[Prototype]]` (exposed as `__proto__`) which points to another object, its **prototype**.
  * When you try to access a property on an object, if the property isn't found directly on the object, JavaScript looks it up on the object's prototype, then the prototype's prototype, and so on, until it hits the end of the chain (which is `null`). This is called the **prototype chain**.
  * **Classes** introduced in ES6 are just **syntactic sugar** over this underlying prototype inheritance model.

-----

## 28\. What is the difference between $\text{\_\_proto\_\_}$ and $\text{prototype}$?

These two terms are frequently confused, but they serve distinct purposes in the prototype inheritance model.

| Property | $\text{\_\_proto\_\_}$ | $\text{prototype}$ |
| :--- | :--- | :--- |
| **What it is** | An object's **actual** link to its prototype object (the *instance* property). | A property on a **constructor function** or **class** that holds the properties/methods to be inherited (the *template*). |
| **Usage** | Used by the **instance** to look up methods/properties. | Used by the `new` operator to establish the prototype link for **newly created instances**. |
| **Accessibility** | Found on **object instances**. (It's a legacy property; standard is `Object.getPrototypeOf(obj)`). | Found only on **constructor functions** and **classes**. |

```javascript
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { ... }; // 1. prototype is on the constructor

const alice = new Person('Alice');           // 2. alice is an instance
// alice.__proto__ === Person.prototype      // 3. __proto__ links the instance to the template
alice.sayHi();                               // 4. sayHi is found via the __proto__ chain
```

-----

## 29\. How does `new` work internally?

The `new` keyword is used to create an instance of a constructor function (or a class). When `new MyConstructor(...)` is called, four things happen internally:

1.  **A new, empty object is created.**
2.  **The new object is linked to the constructor's prototype.** The new object's internal `[[Prototype]]` (i.e., `__proto__`) is set to the `MyConstructor.prototype` object. This establishes the inheritance chain.
3.  **The constructor function is executed with the new object as its `this` context.** Properties and methods are added to the new object (`this.prop = value`).
4.  **The new object is returned.** If the constructor explicitly returns an object, that object is returned instead; otherwise, the newly created object from step 1 is returned.

-----

## 30\. What is a polyfill?

A **polyfill** is a piece of code (usually JavaScript) that provides the functionality of a newer, standard feature to older environments that don't natively support it.

It essentially "fills in" the gap to make sure an application can use a modern feature across various environments (especially older browsers).

**Example:**
To use `Promise`s in an old browser that doesn't support them, a polyfill would implement the `Promise` constructor using older JavaScript features, allowing developers to write modern code without worrying about compatibility.

-----

## 31\. What are Symbols and why do we use them?

**Symbols** are a primitive data type introduced in ES6. A Symbol value is **unique** and **immutable**.

### Why we use them:

1.  **Unique Object Property Keys:** The primary use is to create private or unique object property keys that **will not clash** with other keys, including those from libraries or other code.
      * Unlike strings, every time you call `Symbol()`, a new, unique Symbol is created.
      * Symbols are not included in property enumeration methods like `for...in` loops or `Object.keys()`, which helps prevent unintended exposure.
2.  **Well-Known Symbols:** Used internally by JavaScript to represent language behaviors (e.g., `Symbol.iterator`, `Symbol.toPrimitive`).

-----

## 32\. What is a Map vs Object?

Both `Map` and `Object` store key/value pairs, but they have significant differences.

| Feature | `Object` | `Map` |
| :--- | :--- | :--- |
| **Key Type** | Keys must be `string` or `Symbol`. Other types are coerced to strings. | Keys can be **any data type** (objects, functions, numbers, etc.). |
| **Order** | Order of keys is not guaranteed (mostly insertion order in modern JS, but historically not). | Keys are **ordered** by insertion. |
| **Size** | Manual counting (`Object.keys().length`). | Built-in size property (`map.size`). |
| **Iteration** | Less direct; need `Object.keys()` or `Object.entries()`. | Directly iterable; returns keys, values, and entries in insertion order. |
| **Prototype Chain** | Has a prototype chain, which can lead to key collisions (e.g., if a key is named `"toString"`). | Does **not** have a default prototype; only contains the keys explicitly added. |

-----

## 33\. What is Set vs Array?

Both `Set` and `Array` are collections of values, but they have fundamental differences in their purpose and constraints.

| Feature | `Array` | `Set` |
| :--- | :--- | :--- |
| **Duplicate Values** | **Allowed**. | **Disallowed**. Every value must be unique. |
| **Order** | Order is maintained and based on insertion index. | Order is maintained based on insertion order. |
| **Key/Index** | Uses a numerical index for access. | Does not use keys/indices; values are retrieved by iteration. |
| **Primary Use** | Ordered lists, manipulating groups of data, and using array methods (`map`, `filter`). | Storing unique elements, checking for presence, and easily removing duplicates. |
| **Size** | `array.length` | `set.size` |

-----

## 34\. Explain WeakMap vs WeakSet.

`WeakMap` and `WeakSet` are similar to `Map` and `Set`, but they allow for **garbage collection** of their keys/values if there are no other references to them.

| Feature | WeakMap | WeakSet |
| :--- | :--- | :--- |
| **Keys/Values** | Keys must be **objects**. Values can be any type. | Values must be **objects**. |
| **References** | Keys are held **weakly**. | Values are held **weakly**. |
| **Garbage Collection** | If an object used as a key is no longer referenced anywhere else, it and its corresponding value are automatically removed (garbage collected) from the map. | If an object in the set is no longer referenced anywhere else, it is removed from the set. |
| **Methods** | Does not have iteration methods (`keys()`, `values()`, `entries()`) or a `size` property because their content can change unexpectedly due to GC. | Lacks iteration methods and a `size` property. |
| **Primary Use** | Storing metadata associated with an object without preventing that object from being garbage collected (e.g., caching, private data). | Tracking object instances (e.g., to manage a set of active objects). |

-----

## 35\. Explain garbage collection in JavaScript.

**Garbage collection** is the process of automatically reclaiming memory that is no longer being used by a program. Since JavaScript is a high-level language, the developer doesn't need to manually allocate or free memory.

### How it Works (Mark and Sweep):

Modern JavaScript engines (like V8) typically use a **Mark-and-Sweep** algorithm:

1.  **Marking:** The garbage collector starts from a set of "roots" (like global variables, the current function's parameters, etc.) and traverses the object graph. Any object reachable from these roots is "marked" as being in use.
2.  **Sweeping:** All unmarked objects are considered "garbage" (unreachable) and the memory they occupy is reclaimed (swept).

**The key principle is "reachability":** If an object cannot be reached by the application, it is considered safe to delete.

-----

## 36\. Explain tail call optimization.

**Tail call optimization (TCO)** is a computer science concept where a function call in the **tail position** (the very last operation in the function) can be executed without adding a new stack frame to the Call Stack.

  * When a function calls itself recursively, this can lead to a **Stack Overflow** error if the recursion is too deep (the stack runs out of memory).
  * With TCO, the engine can reuse the existing stack frame for the recursive call, effectively turning unbounded recursion into an iteration, preventing stack overflow.

**In JavaScript:** ES6 technically mandates TCO, but its implementation is **not universally available** across all JavaScript engines (notably, not in V8/Chrome or Node.js), mainly due to complications in debugging and call stack tracing.

-----

## 37\. What are function borrowing methods: call, apply, bind?

These three methods are used to explicitly set the `this` value for a function call and enable **function borrowing** (letting one object use a method written for another object).

| Method | Purpose | Arguments | Execution |
| :--- | :--- | :--- | :--- |
| **`call(thisArg, arg1, arg2, ...)`** | Invokes the function immediately, setting `this` and passing arguments **individually**. | Passed **individually**. | **Immediate**. |
| **`apply(thisArg, [argsArray])`** | Invokes the function immediately, setting `this` and passing arguments as an **array**. | Passed as an **array**. | **Immediate**. |
| **`bind(thisArg, arg1, arg2, ...)`** | **Does not** invoke the function immediately. Returns a **new function** permanently bound to the specified `this` value. | Passed **individually** (partially, if desired, called **partial application**). | **Deferred**. |

-----

## 38\. What is currying?

**Currying** is a functional programming technique where a function that takes multiple arguments is transformed into a sequence of functions, each taking a single argument.

It allows you to create specialized, reusable functions by "locking in" an initial set of parameters.

```javascript
// Normal function
const add = (a, b, c) => a + b + c;

// Curried version
const curriedAdd = (a) => (b) => (c) => a + b + c;

// Usage 1: All at once
curriedAdd(1)(2)(3); // 6

// Usage 2: Partial Application/Specialization
const addTen = curriedAdd(10);
addTen(5)(2); // 17
```

-----

## 39\. What is debouncing?

**Debouncing** is a technique used to **limit the rate** at which a function is executed by ensuring that the function is called **only after a specific amount of time has passed without any new function calls**.

### Practical Use:

Often used for events that fire rapidly, like:

  * Typing into a search bar (`keyup` event): The search logic should only run after the user pauses typing for, say, 300ms.
  * Window resizing.

<!-- end list -->

```javascript
// Debounce function implementation (simplified concept)
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer); // Reset the timer on every call
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay); // Only run after 'delay' if no new calls occur
  };
}
```

-----

## 40\. What is throttling?

**Throttling** is a technique used to **limit the rate** at which a function is executed to **at most once in a given period of time**. The function is guaranteed to execute at most once per defined time interval.

### Practical Use:

Often used for continuous events:

  * Scrolling: Event handler runs at most once every, say, 100ms, regardless of how fast the user scrolls.
  * Game updates.

The function will fire on the first event, then wait for the interval, and fire again if another event occurred during that interval.

-----

## 41\. What is memoization?

**Memoization** is an optimization technique used to speed up computer programs by **caching the results of expensive function calls** and returning the cached result when the same inputs occur again.

It is particularly effective for **pure functions** that perform complex computations and are called frequently with the same arguments.

```javascript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args); // Create a unique key for the arguments
    if (cache[key]) {
      return cache[key]; // Return cached result
    }
    const result = fn.apply(this, args); // Execute original function
    cache[key] = result; // Cache the result
    return result;
  };
}
```

-----

## 42\. Explain event delegation.

**Event delegation** is a pattern where, instead of attaching an event listener to every single child element, you attach a **single event listener** to a **common ancestor** element.

### How it Works:

Since events in the DOM **bubble up** the hierarchy (see Q46), the ancestor listener can catch the event after it has propagated from the target child element. Inside the handler, you use the `event.target` property to identify which specific child element was clicked and then perform the appropriate action.

### Benefits:

  * **Performance:** Fewer event handlers are attached, saving memory.
  * **Simplicity:** Simplifies code, especially when dealing with dynamically added elements (elements added after the listener was set up will still work).

-----

## 43\. What is the DOM? How does it differ from the BOM?

### Document Object Model (DOM)

The **DOM** is a **cross-platform and language-independent interface** that treats an HTML, XML, or SVG document as a tree-structure where each node is an object representing a part of the document (element, text, attribute, etc.).

  * It is used to **interact with the document's content, structure, and styles**.
  * The root of the DOM is the **`document`** object.

### Browser Object Model (BOM)

The **BOM** represents the browser environment and provides methods to interact with the browser window itself.

  * It is **not standardized** (though many features are de facto standards).
  * The root of the BOM is the **`window`** object (the global object).
  * BOM objects include `window` (for global methods/properties), `navigator` (browser info), `screen` (screen info), `location` (URL/history), and `history`.

**In short: DOM is for the document content; BOM is for the browser/window.**

-----

## 44\. What is the shadow DOM?

The **Shadow DOM** is a feature that allows a component to have its own hidden DOM tree, which is kept separate from the main document DOM. This hidden tree is called the **Shadow Tree**, and the element it is attached to is the **Shadow Host**.

### Purpose:

  * **Encapsulation:** It prevents the component's internal structure and styling from being affected by external CSS and JavaScript, and vice-versa.
  * **Web Components:** It is a key technology used to build robust, self-contained **Web Components**.

Elements like `<video>`, `<input type="range">`, and other complex browser controls often use Shadow DOM internally to manage their UI structure and styling.

-----

## 45\. What is execution context?

An **Execution Context (EC)** is an abstract concept that holds the necessary environment for a piece of JavaScript code to be executed. Every time a function is called or a script is executed, a new Execution Context is created.

### Execution Context Stack:

  * **Global Execution Context (GEC):** The base context, created first. It is where global variables, functions, and the global object (`window`/`global`) reside.
  * **Function Execution Context (FEC):** Created every time a function is called.

### Creation Phases:

1.  **Creation Phase:** The EC is created but not yet executed.
      * **Lexical Environment** is created (scope).
      * **Variable Environment** is created (hoisting happens).
      * **`this` binding** is determined.
2.  **Execution Phase:** The code is run, and variable assignments/mutations occur.

-----

## 46\. What are phases of event propagation?

**Event propagation** is the order in which event listeners are triggered on nested elements. There are three phases:

1.  **Capturing Phase:** The event travels **down** from the global `window` object through the ancestor elements to the target element. Listeners attached with the `useCapture` flag set to `true` (or the third argument in `addEventListener` being `true`) fire here.
2.  **Target Phase:** The event reaches the actual element where it originated (the **event target**). Listeners attached directly to the target fire here.
3.  **Bubbling Phase (Default):** The event travels **up** from the target element back to the global `window` object. This is the **default** phase for event listeners in most cases.

**Key:** If an event is not stopped (e.g., with `event.stopPropagation()`), it completes all three phases.

-----

## 47\. What are Web APIs?

**Web APIs** (Application Programming Interfaces) are a collection of functions, objects, and interfaces provided by the **browser environment** that allow JavaScript to interact with the outside world and the browser's functionality. They are *not* part of the core JavaScript language.

### Examples:

  * **DOM API:** For manipulating HTML and CSS.
  * **`setTimeout`/`setInterval`:** For timed execution.
  * **`fetch`:** For making network requests.
  * **Console API:** For logging messages.
  * **Geolocation API:** For accessing the user's location.

**How they interact with JS:** When you call a Web API function (e.g., `setTimeout`), the operation is handled by the browser's internal engine, and the callback (if any) is placed into the **Callback Queue** for the Event Loop to process later.

-----

## 48\. Explain BigInt.

**BigInt** is a primitive data type introduced in ES2020 that allows JavaScript to represent whole numbers **larger than** the maximum safe integer for the `number` type, which is $2^{53} - 1$ (accessible as `Number.MAX_SAFE_INTEGER`).

### Key Features:

  * **Declaration:** A BigInt is created by appending **`n`** to the end of an integer literal or by calling the `BigInt()` constructor.
    ```javascript
    const hugeNum = 123456789012345678901234567890n;
    ```
  * **Restriction:** You **cannot** mix BigInts and standard `number` types in mathematical operations; you must convert one or the other.
  * **Use Case:** Essential for applications dealing with large integer IDs, timestamps, or high-precision mathematical/cryptographic calculations.

-----

## 49\. Explain optional chaining.

**Optional chaining (`?.`)** is a feature introduced in ES2020 that allows you to safely access properties deep within a chain of connected objects **without having to check if each intermediate property exists**.

If any property in the chain is `null` or `undefined`, the expression immediately **short-circuits** and evaluates to `undefined`, instead of throwing a `TypeError`.

### Before Optional Chaining:

```javascript
const city = user && user.address && user.address.city;
```

### With Optional Chaining:

```javascript
const city = user?.address?.city; // Returns undefined if user or address is null/undefined
```

-----

## 50\. Explain nullish coalescing.

**Nullish coalescing (`??`)** is a logical operator introduced in ES2020 that provides a way to define a **default value** for a variable that is either **`null` or `undefined`** (the "nullish" values).

It is a stricter alternative to the logical OR operator (`||`).

### Key Difference from `||`:

  * The `||` operator returns the right-hand side operand if the left-hand side is any **falsy** value (`0`, `''`, `false`, `null`, `undefined`, `NaN`).
  * The `??` operator only returns the right-hand side operand if the left-hand side is **`null` or `undefined`**. It treats `0`, `''`, and `false` as valid values.

<!-- end list -->

```javascript
const userInput = 0;

const resultOR = userInput || 'default value'; // 'default value' (because 0 is falsy)
const resultNC = userInput ?? 'default value'; // 0 (because 0 is not nullish)
```

## B. ES6+ Advanced Concepts

-----

## 51\. What are arrow functions? How are they different?

**Arrow functions** (introduced in ES6) are a concise alternative to traditional function expressions.

### Key Differences:

1.  **Concise Syntax:** Implicit `return` for single-expression bodies, and no need for parentheses around a single argument.
    ```javascript
    // Traditional
    const add = function(a, b) { return a + b; };
    // Arrow
    const add = (a, b) => a + b;
    ```
2.  **No `arguments` Object:** Arrow functions do not have their own local `arguments` object. They rely on the `arguments` object of the nearest enclosing non-arrow function (if needed, the **Rest Operator** must be used).
3.  **Cannot be Constructors:** They cannot be used with the `new` keyword and do not have a `prototype` property.
4.  **No Own `this` Binding (Lexical `this`):** **This is the most important difference.**

-----

## 52\. Why don't arrow functions have their own `this`?

Arrow functions were designed to solve the common pain point of losing the correct `this` context inside callbacks or nested functions, especially in object methods.

They do not create their own `this` binding. Instead, they inherit the `this` value from the **surrounding lexical scope** (the scope they were defined in) at the time they are created. This is known as **lexical `this`**.

This behavior is particularly useful in method definitions or event handlers where you want the inner function to retain the `this` context of the outer class or object.

-----

## 53\. What is destructuring?

**Destructuring** is an ES6 feature that allows us to unpack values from arrays or properties from objects into distinct variables using a concise syntax. It makes it easier to extract data from data structures.

### Array Destructuring:

```javascript
const colors = ['red', 'green', 'blue'];
const [first, second] = colors;
// first is 'red', second is 'green'
```

### Object Destructuring:

```javascript
const user = { name: 'Alice', age: 30, city: 'NY' };
const { name, age } = user;
// name is 'Alice', age is 30
```

It's often used in function parameter lists to immediately extract arguments.

-----

## 54\. What are rest and spread operators?

Both the **Rest** and **Spread** operators use the same `...` syntax, but they perform opposite functions and are determined by **where they are used**.

### 1\. Spread Operator (`...`)

  * **Usage:** Used when **calling** a function or creating an array/object literal.
  * **Function:** **Expands** an iterable (like an array or string) or object properties into its individual elements.
    ```javascript
    const arr1 = [1, 2];
    const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4] (spreads arr1's elements)

    const obj = { a: 1, b: 2 };
    const newObj = { ...obj, c: 3 }; // { a: 1, b: 2, c: 3 } (spreads obj's properties)
    ```

### 2\. Rest Operator (`...`)

  * **Usage:** Used in a **function definition** or an **array/object destructuring assignment**.
  * **Function:** **Collects** remaining elements/properties into a single new array or object.
    ```javascript
    function sum(first, ...restOfNumbers) { // collects remaining args into an array
      console.log(restOfNumbers);
    }
    sum(1, 2, 3, 4); // logs [2, 3, 4]
    ```

-----

## 55\. Explain generators.

**Generators** are special functions (denoted by `function*`) that can be paused and resumed, allowing them to produce a sequence of values over time rather than a single value.

  * **Definition:** A generator function uses the `yield` keyword.
  * **Returns:** When called, a generator function does not execute immediately; it returns an **Iterator** object (called a **Generator Object**).
  * **`yield`:** Pauses the execution of the generator and returns the value specified. The local state is saved.
  * **`next()`:** When the `next()` method is called on the iterator, the function resumes execution from where it was paused until the next `yield` or `return`.

Generators are excellent for creating lazy-loaded, infinite sequences, and for implementing custom iterators.

-----

## 56\. Explain iterators.

An **Iterator** is an object that implements the **Iterator Protocol**, which is a way to define a standard for accessing elements of a collection one at a time and tracking the current position.

### Iterator Protocol:

An object is an iterator if it has a `next()` method that returns an object with two properties:

1.  **`value`**: The next item in the sequence.
2.  **`done`**: A boolean indicating whether the iteration is complete (`true`) or not (`false`).

### Iterable Protocol:

Any object that has a method defined by the `Symbol.iterator` key (which returns an iterator) is an **Iterable**. Examples include Arrays, Strings, Maps, and Sets.

-----

## 57\. How does `for...of` work internally?

The `for...of` loop, introduced in ES6, is specifically designed to iterate over **Iterable** objects (like Arrays, Strings, Maps, Sets, and Generators).

Internally, `for...of` works by leveraging the **Iterable and Iterator Protocols**:

1.  It first calls the iterable object's **`[Symbol.iterator]()`** method to get the corresponding **Iterator** object.
2.  It repeatedly calls the iterator's **`next()`** method.
3.  In each loop iteration, it assigns the `value` property returned by `next()` to the loop variable.
4.  It continues until the `done` property returned by `next()` is `true`.

<!-- end list -->

```javascript
for (const element of iterable) { /* ... */ }
// is conceptually similar to:
let iterator = iterable[Symbol.iterator]();
while (true) {
  let result = iterator.next();
  if (result.done) break;
  const element = result.value;
  // ...
}
```

-----

## 58\. What are proxies?

**Proxies** (introduced in ES6) are objects that essentially **wrap** another object (the **target**) and allow you to **intercept and customize** fundamental operations on that target object.

A Proxy is created with two arguments: the `target` and a `handler` object.

```javascript
const handler = {
  get: function(target, prop, receiver) {
    console.log(`Getting property: ${prop}`);
    return target[prop];
  },
  set: function(target, prop, value, receiver) {
    if (prop === 'age' && value < 18) {
      throw new Error('Age must be 18+');
    }
    return Reflect.set(target, prop, value, receiver);
  }
};

const targetObject = { name: 'Bob', age: 25 };
const proxiedObject = new Proxy(targetObject, handler);

proxiedObject.name; // Logs "Getting property: name"
proxiedObject.age = 15; // Throws error
```

They are used for tasks like validation, logging, tracing, and implementing features like ORMs (Object-Relational Mappers).

-----

## 59\. What are Reflect APIs?

The **Reflect** object is a built-in object that provides a set of **static methods** for intercepting JavaScript operations. It is often used in conjunction with **Proxies**.

For almost every **trap** (method) available in a Proxy handler, there is a corresponding method on the `Reflect` object (e.g., `Reflect.get`, `Reflect.set`, `Reflect.has`).

### Why use Reflect?

1.  **Cleaner Code:** Provides a more object-oriented, functional way to perform operations that previously required operator syntax (`delete obj.prop`) or methods on `Object` (e.g., `Object.defineProperty`).
2.  **Facilitates Proxies:** When writing a Proxy handler trap, using the corresponding `Reflect` method is the recommended way to invoke the default behavior on the target object. This ensures the correct context and return values are maintained.

-----

## 60\. What is the `class` keyword in JS? How does it work behind the scenes?

The **`class` keyword** (introduced in ES6) is a piece of **syntactic sugar** over JavaScript's existing **prototype-based inheritance** mechanism.

### Behind the Scenes:

1.  **Constructor:** The `constructor` method becomes the actual constructor function.
2.  **Methods:** Methods defined within the class body are added to the **`Class.prototype`** object. This ensures all instances inherit the method and do not duplicate it.
3.  **Inheritance (`extends`):** The `extends` keyword sets up the prototype chain. It links the subclass's prototype to the superclass's prototype using `Object.setPrototypeOf(SubClass.prototype, SuperClass.prototype)`.

**Crucially, JavaScript is still prototype-based; the `class` keyword simply offers a clearer, familiar syntax for object creation and inheritance.**

-----

## 61\. Explain static methods.

**Static methods** are methods defined on the **class itself** rather than on instances of the class.

  * They are defined using the `static` keyword inside the class body.
  * They are accessed directly on the class (e.g., `MyClass.staticMethod()`).
  * They are often used for utility or helper functions that don't require access to instance-specific data (i.e., they cannot access `this.instanceProperty`).

**Example:**

```javascript
class Calculator {
  static sum(a, b) {
    return a + b;
  }
}

Calculator.sum(5, 3); // 8
// const c = new Calculator();
// c.sum(5, 3); // Error: c.sum is not a function
```

-----

## 62\. What is a mixin?

A **Mixin** is a pattern for reusing class capabilities (methods and properties) by **composing** them into a new class without using traditional inheritance.

Since JavaScript only supports single inheritance (a class can only `extend` one other class), mixins allow a class to "mix in" behavior from multiple sources.

### Implementation:

In JavaScript, mixins are typically implemented as **functions** that take a target class constructor as an argument, add methods to that class's prototype, and return the enhanced class.

```javascript
// A mixin function
const Jumper = (BaseClass) => class extends BaseClass {
  jump() { console.log('Jumping!'); }
};

class User {}
class SuperUser extends Jumper(User) {} // Mix in the Jumper capability

const bob = new SuperUser();
bob.jump();
```

-----

## 63\. What is the difference between default and named exports?

In ES Modules, exports define what a module makes available to other modules.

| Feature | Named Export | Default Export |
| :--- | :--- | :--- |
| **Syntax** | `export const name = ...;` or `export { name1, name2 };` | `export default expression;` (Only one per module) |
| **Importing** | Must use the **exact name** in curly braces: `import { name } from './module';` | Can be imported with **any name** (since there is only one): `import anyName from './module';` |
| **Usage** | Best for exporting **multiple** utilities, components, or constants. | Best for exporting the **primary entity** of the module (e.g., a React component, a Class). |

-----

## 64\. What are dynamic imports?

**Dynamic imports** (using the `import()` function) are a feature that allows you to load modules **asynchronously** and **on demand** (lazy loading), rather than loading everything at application startup.

  * **Syntax:** `import('./path/to/module.js')`
  * **Return Value:** It returns a **Promise** that resolves to the module object.
  * **Purpose:** Primarily used for **code splitting** in modern bundlers (like Webpack or Rollup). It helps reduce the initial load time of an application by only loading necessary code when a user interaction (like clicking a button or navigating a route) demands it.

<!-- end list -->

```javascript
document.getElementById('btn').addEventListener('click', () => {
  import('./heavy-utility.js').then(module => {
    module.runHeavyTask();
  });
});
```

-----

## 65\. Explain Top-level await.

**Top-level `await`** is an ES2022 feature that allows the use of the `await` keyword in the **top-level body of a module** (i.e., outside of an `async` function).

### Before TLA:

You could only use `await` inside an `async` function.

### With TLA:

The module itself effectively becomes an `async` function, and any module that imports it must wait for the current module's top-level code to execute and resolve its promises before it can proceed.

**Use Cases:**

1.  **Resource Initialization:** A module can fetch data or load another module before any code that depends on it executes.
    ```javascript
    const config = await fetch('/config.json').then(res => res.json());
    // All other modules importing this one will wait for config to be ready.
    ```
2.  **Dynamic Dependency Loading:** Conditional loading of dependencies.

-----

## 66\. What is tree shaking?

**Tree shaking** (or live code inclusion) is a form of **dead code elimination** used by modern JavaScript bundlers (Webpack, Rollup, Parcel).

  * **Goal:** To automatically analyze the import and export statements in a module graph and determine which pieces of code are actually being used by the application.
  * **Process:** Any exported code that is **not imported and used** by any part of the application is considered "dead code" and is **omitted** from the final bundle.
  * **Benefit:** Significantly reduces the final JavaScript bundle size, improving application performance and load times.

Tree shaking works best with **ES Modules** (`import`/`export`) because they use static analysis (the bundler can determine dependencies without running the code).

-----

## 67\. What is the module resolution algorithm?

The **module resolution algorithm** is the set of rules used by JavaScript environments (browsers or Node.js) or bundlers (Webpack) to locate the file corresponding to the module path provided in an `import` statement.

### Key Steps (Simplified for Node.js/Bundlers):

1.  **Relative Path (`./`, `../`):** The engine looks for the file relative to the current module's location.
2.  **Bare Specifier (`import 'lodash'`):** The engine typically assumes this is a package reference and looks for it inside a special directory, usually **`node_modules`**.
3.  **`package.json`:** If a match is found in `node_modules`, the engine looks inside the package's `package.json` file, usually checking the **`main`** or **`exports`** field to find the entry point file.

The exact algorithm is complex and varies slightly between environments, but its purpose is always to translate a module specifier into a concrete file path.

-----

## 68\. Explain WeakRef.

**`WeakRef`** (Weak Reference) is a feature introduced in ES2021 that allows you to create a reference to an object that **does not prevent that object from being garbage collected (GC)**.

  * **Normal Reference:** If you have a variable pointing to an object, the object is considered reachable and cannot be garbage collected.
  * **Weak Reference:** A `WeakRef` allows you to access an object's value, but if all *other* strong references to that object disappear, the object will be collected, and the `WeakRef` will become ineffective (its value will be `undefined`).

### Use Case:

Managing a large cache of objects where you don't want the cache itself to prevent those objects from being freed from memory if they are no longer actively used elsewhere in the application.

-----

## 69\. What is Promise combinators like `allSettled`, `any`, `race`?

**Promise combinators** are static methods on the `Promise` object that take an iterable of Promises and return a single Promise that executes different logic based on the behavior of the input Promises.

| Combinator | Behavior | When does the returned Promise **Resolve**? | When does it **Reject**? |
| :--- | :--- | :--- | :--- |
| **`Promise.all(iterable)`** | Waits for **all** Promises to succeed. | When **all** input Promises have resolved. | If **any** input Promise rejects (immediately). |
| **`Promise.race(iterable)`** | Returns the result of the **first** Promise to settle (resolve or reject). | When the first Promise resolves. | When the first Promise rejects (immediately). |
| **`Promise.allSettled(iterable)`** | Waits for **all** Promises to settle (resolve or reject). | When **all** input Promises have either resolved or rejected. Returns an array of objects describing each result (`status` and `value` or `reason`). | Never. |
| **`Promise.any(iterable)`** | Returns the result of the **first** Promise to resolve. | When the **first** input Promise resolves. | If **all** input Promises reject (returns an `AggregateError`). |

-----

## C. Asynchronous JavaScript (Crucial for Senior Roles)

-----

## 70\. What are Promises?

**Promises** are objects that represent the eventual completion (or failure) of an asynchronous operation and its resulting value. They are a fundamental building block for modern asynchronous programming in JavaScript.

A Promise is in one of three mutually exclusive states:

1.  **`pending`**: Initial state, neither fulfilled nor rejected.
2.  **`fulfilled` (resolved)**: The operation completed successfully.
3.  **`rejected`**: The operation failed.

Once a Promise is fulfilled or rejected, it is **settled** and its state cannot change again.

-----

## 71\. How do Promises work internally?

When a Promise is created, the function passed to the constructor (the **executor**) is executed synchronously. This function receives two arguments: `resolve` and `reject`.

1.  **State Management:** The Promise object internally tracks its current state (`pending`, `fulfilled`, `rejected`) and the eventual result (`value` or `reason`).
2.  **Callback Queueing:** When `.then()`, `.catch()`, or `.finally()` are called on the Promise, their respective callback functions are internally registered.
3.  **Microtask Queue:** Once the asynchronous operation completes, if the Promise is settled (by calling `resolve` or `reject`), the registered callbacks are placed onto the **Microtask Queue** (Job Queue) to be processed by the Event Loop.
4.  **Immutability:** Once settled, the Promise's state and value are immutable, ensuring reliable and predictable behavior.

-----

## 72\. Explain async/await.

**`async/await`** (introduced in ES2017) is syntactic sugar built on top of Promises, designed to make asynchronous code look and behave more like synchronous code, thereby improving readability and maintainability.

  * **`async` Keyword:** Used to declare an asynchronous function. An `async` function implicitly returns a **Promise**.
      * If the function returns a value, the Promise resolves with that value.
      * If the function throws an error, the Promise rejects with that error.
  * **`await` Keyword:** Can **only** be used inside an `async` function. It pauses the execution of the `async` function until the Promise it is waiting for is resolved or rejected. It then extracts the resolved value.

-----

## 73\. What happens if you forget await?

If you forget to use `await` inside an `async` function when calling another asynchronous function (which returns a Promise), two things happen:

1.  **No Blocking:** The calling `async` function **does not pause**. It continues execution immediately, executing the next line of code.
2.  **Return Value:** The variable that was supposed to receive the resolved value instead receives the **Promise object itself** (still in a `pending` state). Any subsequent code expecting the resolved *value* will likely fail or behave unpredictably because it is operating on a Promise object instead of the data.

**Example:**

```javascript
async function getData() {
  const result = fetch('...'); // Forgot 'await'!
  // result is now a Promise, not the Response object.
  const data = await result.json(); // Throws error because Promise doesn't have .json()
}
```

-----

## 74\. How to handle errors in async/await?

Since `await` pauses execution, error handling in `async/await` is done using the familiar **synchronous** control flow of **`try...catch`** blocks.

If a Promise awaited within the `try` block is rejected, the execution immediately jumps to the `catch` block, where the rejection reason can be handled.

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // You can re-throw or return a default value here
    throw error; // Re-throw the error to be caught by the caller
  }
}
```

-----

## 75\. What is Promise chaining?

**Promise chaining** is the technique of linking multiple asynchronous operations together sequentially using the **`.then()`** method.

  * Each `.then()` returns a **new Promise**, allowing the next `.then()` to be attached to it.
  * The resolved value from one `.then()` block is passed as the input argument to the next `.then()` block.
  * If a `.then()` callback returns a value, the next Promise resolves with that value.
  * If a `.then()` callback returns another **Promise**, the chain waits for that inner Promise to settle before moving to the next block (this is key for chaining sequential async steps).
  * A single `.catch()` at the end can handle errors from any Promise in the chain.

-----

## 76\. What is `Promise.all`?

**`Promise.all`** is a Promise combinator that takes an iterable (usually an array) of Promises and returns a single Promise.

  * **Behavior:** It waits for **all** of the input Promises to successfully resolve.
  * **Resolution:** If all input Promises resolve, the returned Promise resolves with an **array of their resolved values**, in the same order as the input array.
  * **Rejection:** If **any** of the input Promises reject, the returned Promise immediately rejects with the reason of the first rejected Promise, and the results of the other Promises are ignored (short-circuiting).

This is used for running multiple, independent asynchronous tasks **concurrently** and aggregating their results.

-----

## 77\. Explain `Promise.race` vs `Promise.any`.

Both are Promise combinators that involve a "race" among promises, but they handle the settling of the promises differently.

| Feature | `Promise.race(iterable)` | `Promise.any(iterable)` |
| :--- | :--- | :--- |
| **Success Condition** | Returns the result of the **first** Promise to **settle** (resolve OR reject). | Returns the result of the **first** Promise to **resolve**. |
| **Failure Condition** | Rejects if the first Promise to settle **rejects**. | Rejects **only if all** of the input Promises reject (returns an `AggregateError`). |
| **Purpose** | Used for timing out operations or getting the fastest response, regardless of success. | Used for getting the first successful result from multiple sources. |

-----

## 78\. How to cancel a Promise?

**Promises in JavaScript are not inherently cancelable.** Once created, a standard Promise will either fulfill or reject, and there is no built-in mechanism to stop an ongoing asynchronous process it represents.

### Common Workarounds:

1.  **AbortController (Recommended for modern APIs):** For APIs like `fetch`, the `AbortController` and its signal property are the standardized way to cancel the underlying asynchronous request.
2.  **Ignoring the Result:** The most common practice is to use a flag or state variable to check if the result of the Promise should still be processed when it eventually resolves. The Promise still runs, but the application ignores its outcome.
3.  **External Libraries:** Some libraries provide their own cancellable Promise implementations.

-----

## 79\. What is an async iterator?

An **Async Iterator** is an object that implements the **Async Iterator Protocol**, which is similar to the standard Iterator Protocol but allows for **asynchronous** fetching of data.

  * It has an **`next()`** method that returns a **Promise** that resolves to an object with the standard `{ value, done }` shape.
  * This is used to iterate over asynchronous data sources, like streaming data from a file or a database cursor, where each step of the iteration might take time.
  * They are consumed using the **`for await...of`** loop, which waits for the Promise returned by each `next()` call to resolve before proceeding to the next iteration.

-----

## 80\. Explain concurrency vs parallelism in JS.

| Concept | Concurrency | Parallelism |
| :--- | :--- | :--- |
| **Definition** | The ability to handle **multiple tasks over the same period** by interleaving their execution. | The ability to execute **multiple tasks simultaneously** (literally at the same moment). |
| **Execution** | Tasks make progress by taking turns on a **single CPU core**. (Achieved via the Event Loop). | Tasks are executed literally at the same time on **multiple CPU cores** or different processors. |
| **In JS** | **JavaScript is inherently concurrent.** The single-threaded nature means it uses the Event Loop to handle many tasks non-blockingly. | **JavaScript core is not parallel.** Parallelism can only be achieved via mechanisms like **Web Workers** (which run on separate OS threads). |

**Simply:** Concurrency is like a single waiter serving many tables; Parallelism is like having multiple waiters serving many tables simultaneously.

-----

## 81\. Explain the difference between synchronous and asynchronous code.

| Feature | Synchronous Code | Asynchronous Code |
| :--- | :--- | :--- |
| **Execution Flow** | **Sequential.** Each operation must complete before the next one starts. | **Non-sequential.** Operations can start now and finish later, without blocking the main thread. |
| **Blocking** | **Blocks** the main execution thread. | **Non-blocking.** Operations are offloaded and handled outside the main thread (e.g., by Web APIs). |
| **Example** | Simple variable assignment, math operations, most Array methods. | `setTimeout`, `fetch`, Promises, AJAX requests, DOM events. |

JavaScript runs synchronously by default. Asynchronous operations are necessary for tasks that take a long time, preventing the application from freezing.

-----

## 82\. What is the task queue?

The **Task Queue** (also known as the **Callback Queue** or **Macrotask Queue**) is part of the Event Loop mechanism.

  * It is where **Macrotasks** (like callbacks from `setTimeout`, `setInterval`, I/O, and UI rendering events) are placed after their assigned delay or event is triggered by the browser/Node environment (Web APIs).
  * The Event Loop moves tasks from the Task Queue to the **Call Stack** **only when the Call Stack is empty** and **after the Microtask Queue is completely empty**.

-----

## 83\. What are microtasks? What goes into microtask queue?

**Microtasks** are small, short-lived asynchronous tasks that are handled with higher priority than Macrotasks (Task Queue).

  * They are stored in the **Microtask Queue** (also called the **Job Queue**).
  * **Sources:**
    1.  **Promise callbacks** (`.then()`, `.catch()`, `.finally()`).
    2.  `queueMicrotask()`.
    3.  `MutationObserver` callbacks (DOM changes).

The Event Loop executes all pending microtasks **immediately** after the Call Stack is empty and **before** it processes the next macrotask (Task Queue). This ensures Promises are handled quickly.

-----

## 84\. How does `setTimeout(fn, 0)` work?

Even when a delay of $0$ milliseconds is specified in `setTimeout(fn, 0)`, the function `fn` is **not executed immediately**.

1.  **Web API Offload:** `setTimeout` is a **Macrotask**. The function `fn` is immediately passed to the Web API environment.
2.  **Timer Expiration:** The timer technically expires immediately, but the callback `fn` is then placed into the **Task Queue** (Macrotask Queue).
3.  **Event Loop Wait:** The function `fn` must wait for the **Call Stack** to be empty, **and** for the **entire Microtask Queue** to be empty before the Event Loop can move it from the Task Queue onto the Call Stack for execution.

This is why `setTimeout(fn, 0)` is often used to **defer** execution until the current synchronous code and any pending microtasks have completed.

-----

## 85\. Event loop differences in browser vs Node.js.

While the core principles (Call Stack, Web APIs/Node APIs, Microtasks, Macrotasks) are the same, Node.js has a more complex, phase-based Event Loop structure tailored for I/O and networking, unlike the simpler browser model focused on rendering and DOM events.

| Feature | Browser Event Loop | Node.js Event Loop |
| :--- | :--- | :--- |
| **Macrotasks** | **Single Task Queue** for all macrotasks (timers, I/O, UI). | **Multiple Phases** (timers, I/O callbacks, idle/prepare, poll, check, close callbacks). |
| **`check` Phase** | N/A | Dedicated phase for **`setImmediate()`** callbacks. |
| **`poll` Phase** | N/A | Handles I/O related tasks (e.g., file system, network). |
| **I/O** | Handled by **Web APIs**. | Handled by the underlying **libuv** library's thread pool. |
| **`setImmediate`** | Not available. | Executes after the `poll` phase and before the `close callbacks` phase (similar to `setTimeout(fn, 0)` but more reliable). |

## D. Browser JavaScript & Web APIs

---

## 86. What is `localStorage` vs `sessionStorage`?

Both `localStorage` and `sessionStorage` are mechanisms within the **Web Storage API** that allow applications to store key/value string pairs locally within the user's browser, persisting across sessions.

| Feature | `localStorage` | `sessionStorage` |
| :--- | :--- | :--- |
| **Persistence** | **Persistent.** Data remains even after the browser window is closed and reopened. | **Session-based.** Data is cleared when the **browser tab** is closed. |
| **Scope** | **Global.** Data is shared across all tabs and windows from the same origin. | **Per-tab/window.** Data is isolated to the specific tab that created it. |
| **Capacity** | Approximately 5MB to 10MB (browser-dependent). | Approximately 5MB to 10MB (browser-dependent). |

---

## 87. What is IndexedDB?

**IndexedDB** is a low-level, client-side storage API for storing significant amounts of structured data, including files/blobs.

* **Key Features:**
    * **Transactional:** Operations are guaranteed to be atomic (either all succeed or all fail), ensuring data integrity.
    * **Asynchronous:** All operations are non-blocking, making them suitable for large datasets without freezing the main thread.
    * **Key-Value Store:** It's a structured storage system that uses indexes, allowing for efficient lookups and querying.

It is typically used when `localStorage` is insufficient (due to size or the need for complex queries/structured data).

---

## 88. What is CORS?

**CORS (Cross-Origin Resource Sharing)** is an HTTP-header based mechanism that allows a server to indicate any **origins** (domain, protocol, and port) other than its own from which a browser should permit loading resources.

* **Problem:** Browsers enforce the **Same-Origin Policy** (Q90), which normally blocks JavaScript code from making requests to a different origin.
* **Solution:** CORS provides a secure, explicit way for the server to grant permission to specific third-party clients. This is done by the server including the `Access-Control-Allow-Origin` header in its response.

---

## 89. Explain preflight requests.

A **preflight request** is a CORS mechanism where the browser automatically sends an exploratory **HTTP `OPTIONS` request** to the server **before** sending the actual data-carrying request.

* **Purpose:** To determine if the server supports the actual request the client intends to send (e.g., if it uses a non-standard HTTP method like `PUT` or includes custom headers).
* **Server Response:** The server responds to the `OPTIONS` request with `Access-Control-*` headers, detailing what methods, headers, and origins it accepts.
* **Execution:** If the server's response indicates that the intended request is safe, the browser proceeds to send the actual request. If not, the request is blocked.

---

## 90. What is same-origin policy?

The **Same-Origin Policy (SOP)** is a critical security mechanism enforced by web browsers. It dictates that a web browser can only load resources or interact with data from a different domain (origin) if the **protocol, domain (hostname), and port** are identical.

* **Goal:** To prevent malicious scripts on one web page from accessing sensitive data on another page (e.g., blocking a script on `evil.com` from reading cookies or form data from `banking.com`).
* **Exceptions:** Certain cross-origin operations are allowed, like loading images (`<img>`), CSS (`<link>`), or scripts (`<script>`), but reading the data from these is restricted. CORS (Q88) is the standard exception for AJAX requests.

---

## 91. How do cookies work? `HttpOnly`, `Secure`, `SameSite`?

**Cookies** are small pieces of text data sent from a server and stored by the web browser. They are primarily used for three things: session management (login state), personalization, and tracking.

* **Mechanism:** When the server sends an HTTP response, it includes the `Set-Cookie` header. The browser automatically includes the cookie in the `Cookie` header of subsequent requests to the same domain.

### Security Attributes:

1.  **`HttpOnly`**: Prevents client-side JavaScript (`document.cookie`) from accessing the cookie. This protects against **Cross-Site Scripting (XSS)** attacks, as a malicious script cannot steal the cookie.
2.  **`Secure`**: Ensures that the cookie is **only sent over secure HTTPS connections**. It prevents the cookie from being transmitted over unencrypted HTTP, where it could be intercepted.
3.  **`SameSite`**: Controls how cookies are sent in cross-site requests. It prevents browsers from sending cookies along with cross-site requests, mitigating **Cross-Site Request Forgery (CSRF)** attacks. Values include:
    * `Strict`: Cookie is only sent with requests originating from the same site.
    * `Lax` (Default): Cookie is sent with top-level navigation GET requests from external sites, but not other types (e.g., embeds, iframes).
    * `None`: Cookie is sent with all requests, including cross-site (must also set `Secure`).

---

## 92. Explain Web Workers.

**Web Workers** are a browser feature that allows a developer to run JavaScript in a **background thread**, separate from the main thread that handles the UI and DOM manipulation.

* **Purpose:** To perform CPU-intensive tasks (e.g., complex calculations, heavy data processing) without blocking the main thread, thus preventing the UI from freezing.
* **Communication:** Workers cannot directly access the DOM. They communicate with the main script thread using an **event-driven model** via the `postMessage()` method.
* **Types:** The most common is the **Dedicated Worker**, tied to a single script.

---

## 93. Explain Service Workers.

**Service Workers** are a type of Web Worker that acts as a **proxy** between the browser, the web application, and the network.

* **Key Features:**
    * **Installation:** Once installed, they run in the background, independent of the web page.
    * **Interception:** They can intercept and handle network requests made by the application using the `fetch` event.
    * **Caching:** They are central to creating **Progressive Web Apps (PWAs)**, enabling reliable caching strategies that allow the application to work offline (`Cache API`).
    * **Push Notifications:** They can handle push messages from a server even when the application is closed.

---

## 94. How do Push Notifications work?

Web Push Notifications are handled by **Service Workers** (Q93) and involve three main parties: the client, the browser vendor, and the application server. 

1.  **Subscription (Client Side):** The web app registers a Service Worker and requests user permission for notifications. It then uses the **Push API** to subscribe to the browser vendor's Push Service, receiving a unique **endpoint URL** and encryption keys.
2.  **Key Storage:** The application sends this endpoint URL and keys to the **application server** for storage.
3.  **Sending (Server Side):** When the application server wants to send a notification, it creates a payload and sends it as an HTTP request to the stored Push Service endpoint URL (e.g., Google's FCM, Mozilla's Autopush).
4.  **Delivery:** The Push Service delivers the message to the **browser** (even if the app is closed).
5.  **Handling:** The browser's Service Worker intercepts the message with a **`push` event** and then uses the **Notifications API** to display the notification to the user.

---

## 95. What is the fetch API?

The **Fetch API** is a modern, Promise-based interface for making network requests (like AJAX) in the browser. It is intended to replace the older, callback-based `XMLHttpRequest (XHR)`.

* **Key Features:**
    * **Promise-based:** `fetch()` returns a `Promise` that resolves to the **`Response`** object (representing the HTTP response).
    * **Two Steps:** Getting the response is the first step (`.then(response => ...)`); extracting the data (e.g., JSON, text) requires a second asynchronous step (`.then(data => ...)`).
    * **Does not reject on HTTP error:** The Promise only rejects if a network error occurs (e.g., no internet). It resolves even for HTTP error codes like 404 or 500; you must check the `response.ok` property manually.

---

## 96. What is long polling?

**Long Polling** is a technique used to simulate real-time communication by overcoming the limitations of traditional short polling.

1.  **Client Request:** The client sends an asynchronous HTTP request to the server.
2.  **Server Hold:** The server **holds the connection open** until data becomes available (or a timeout occurs).
3.  **Server Response:** Once data is available (e.g., a new message arrives), the server sends a complete response and immediately closes the connection.
4.  **Client Reconnect:** The client processes the data and immediately initiates a new long poll request to the server.

This is more efficient than short polling (where the client repeatedly asks the server every few seconds) but is less efficient than a persistent connection like WebSocket.

---

## 97. What is Server-Sent Events (SSE)?

**Server-Sent Events (SSE)** is an HTML5 API that enables a server to push data updates to a client over a **single, long-lived HTTP connection**.

* **Direction:** **Unidirectional** (data flows only from server to client).
* **Protocol:** Uses standard HTTP/2 (or HTTP/1.1) but relies on the `text/event-stream` MIME type.
* **Mechanism:** The server keeps the connection open and continuously sends plain text data blocks to the client. The browser automatically handles re-establishing the connection if it drops.
* **Use Case:** Ideal for scenarios where the client only needs to receive updates (e.g., stock tickers, news feeds, stream logs).

---

## 98. What is WebSocket?

**WebSocket** is a communication protocol that provides **full-duplex (bi-directional), persistent communication channels** over a single TCP connection.

* **Handshake:** It starts as a regular HTTP request (`Upgrade` header), which is "upgraded" to a WebSocket connection.
* **Direction:** **Bi-directional.** Both the client and the server can send and receive messages at any time.
* **Protocol:** Once the connection is established, data frames are sent directly over the TCP connection, resulting in very low overhead and minimal latency compared to HTTP.
* **Use Case:** Essential for highly interactive, real-time applications requiring low latency (e.g., multiplayer games, collaborative editing, chat).

---

## 99. CSR vs SSR vs SSG?

These terms describe different approaches to **when and where** the HTML content of a web page is generated.

| Method | Client-Side Rendering (CSR) | Server-Side Rendering (SSR) | Static Site Generation (SSG) |
| :--- | :--- | :--- | :--- |
| **Generation Time** | **Browser runtime** (After initial fetch). | **Per-request** on the server. | **Build time** (Before deployment). |
| **Workflow** | Browser fetches minimal HTML/CSS + JS bundle. JS executes, fetches data, and builds the DOM. | Server fetches data, renders complete HTML on the fly, and sends it to the browser. | Site is pre-built into static HTML, CSS, and JS files. |
| **Time to First Byte (TTFB)** | Fast (minimal HTML). | Slower (waits for server processing). | **Fastest** (pre-built file). |
| **SEO** | Poor to Moderate (requires search engine to execute JS). | **Excellent** (full HTML served). | **Excellent** (full HTML served). |
| **Use Case** | Complex web apps, dashboards. | Highly dynamic sites, personalized content (e.g., e-commerce cart). | Blogs, documentation, marketing sites. |

---

## 100. What is lazy loading?

**Lazy loading** (or on-demand loading) is an optimization technique used to **defer the loading of resources** (like images, components, or JavaScript modules) until they are actually needed or are about to become visible to the user.

### Examples:

1.  **Images:** Using `IntersectionObserver` or the `loading="lazy"` attribute to only load images when they enter the viewport.
2.  **Code Splitting:** Using dynamic `import()` (Q64) in JavaScript applications to load route-specific code bundles only when the user navigates to that route.

**Benefit:** Reduces initial page load time, decreases memory usage, and conserves bandwidth.

---

## 101. Explain page lifecycle events.

The **page lifecycle** is the sequence of stages a web page goes through from initial loading to being unloaded. Key events allow scripts to interact with these stages:

1.  **`DOMContentLoaded`**: Fires when the **initial HTML document has been completely loaded and parsed**, and all scripts are ready to run. **Does not wait** for stylesheets, images, or sub-frames to finish loading. (Best time to initialize application logic).
2.  **`load`**: Fires when the **entire page has finished loading**, including all dependent resources (stylesheets, images, videos, etc.). (Used for tasks that require the full page to be rendered).
3.  **`beforeunload`**: Fires when the user is about to leave the page (e.g., closing the tab, navigating away). Used to confirm if the user really wants to leave.
4.  **`unload`**: Fires when the user navigates away from the page. Used for cleanup tasks (e.g., sending usage analytics).

---

## 102. How does rendering pipeline work in browsers?

The browser's **critical rendering pipeline** is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen.

1.  **Construction:**
    * **DOM Tree:** HTML is parsed into the **Document Object Model (DOM)** tree.
    * **CSSOM Tree:** CSS is parsed into the **CSS Object Model (CSSOM)** tree.
2.  **Tree Combination:**
    * **Render Tree (or Layout Tree):** The DOM and CSSOM are combined to form the Render Tree, which contains only the visual elements in their correct style. Non-visual elements (like `<head>`, `display: none`) are omitted.
3.  **Layout (or Reflow):**
    * Calculates the **exact position and size** of every object in the Render Tree (the box model).
4.  **Paint (or Rasterization):**
    * Fills in the pixels—drawing colors, borders, shadows, and images onto individual layers.
5.  **Compositing:**
    * If layers were created (for elements like `position: fixed` or 3D transforms), the browser composites these layers into a final image for display.

---

## 103. What is layout thrashing?

**Layout thrashing** (or forced synchronous layout) is a performance anti-pattern that occurs when JavaScript repeatedly performs a sequence of:

1.  **Writing** (modifying the DOM, e.g., `element.style.width = '100px'`).
2.  **Reading** (querying a computed style that forces the browser to immediately recalculate the layout, e.g., `element.offsetWidth` or `window.getComputedStyle`).

Since the browser wants to return the correct, updated value for the read operation, it is forced to interrupt its asynchronous layout/render queue and perform a **synchronous Reflow** (layout calculation). Doing this repeatedly in a loop is expensive and severely degrades performance.

**Solution:** **Read all computed styles first, then write all changes.**

---

## 104. What are repaint vs reflow events?

These are two different types of costs that occur during the browser rendering pipeline (Q102) in response to DOM or CSS changes.

| Event | Repaint (Redraw) | Reflow (Layout) |
| :--- | :--- | :--- |
| **What it is** | Recalculating the **visibility** of elements. | Recalculating the **position and geometry** of elements. |
| **Triggered by** | Changes to styles that do **not** affect layout (e.g., `color`, `background-color`, `visibility`). | Changes to styles that **affect the layout** (e.g., `width`, `height`, `font-size`, adding/removing DOM nodes, querying offsets). |
| **Cost** | **Relatively low cost** (only affects the element itself). | **High cost** (often affects neighboring or even descendant elements). |
| **Pipeline Step** | **Paint** | **Layout** (followed by Paint). |

**Goal:** Minimize reflows, and when they are necessary, try to isolate them to a small part of the DOM.

---

## 105. How to optimize browser performance?

Optimizing browser performance generally focuses on speeding up the rendering pipeline and minimizing the main thread's workload.

1.  **Reduce Reflows/Repaints:** Batch DOM changes, avoid layout thrashing (Q103), and use CSS properties that trigger only Compositing/Paint (e.g., `transform`, `opacity`).
2.  **Minimize Main Thread Blocking:** Use **Web Workers** (Q92) for heavy computation and use **`requestAnimationFrame`** for smooth UI updates.
3.  **Optimize Asset Loading:**
    * **Lazy Load** (Q100) images, components, and off-screen content.
    * Use modern image formats (e.g., WebP) and compress assets.
    * Use resource hints (`<link rel="preload">`, `<link rel="preconnect">`).
4.  **Code Optimization:** Implement **debouncing** and **throttling** (Q39, Q40) on expensive event handlers (scroll, resize, input).
5.  **Use CDNs:** Serve assets from a Content Delivery Network for faster geographical delivery.
6.  **Avoid Large, Complex Layouts:** Keep the DOM size small and minimize the use of computationally expensive CSS selectors.

---

## E. Node.js + Backend JS

---

## 106. What is Node.js?

**Node.js** is an open-source, cross-platform JavaScript **runtime environment** that executes JavaScript code **outside of a web browser**.

* It is built on the **V8 JavaScript engine** (the same engine used in Chrome).
* It allows developers to use JavaScript for server-side programming, networking, command-line tools, and more.
* It utilizes an **event-driven, non-blocking I/O model** that makes it lightweight and efficient for building scalable network applications.

---

## 107. How is Node.js single-threaded but handles concurrency?

Node.js is often described as single-threaded because the **JavaScript execution** (the code you write) runs entirely on a single thread—the **Event Loop** (Q13, Q85).

It achieves high **concurrency** through the following mechanisms:

1.  **Asynchronous Operations:** All I/O operations (file system, network, database) are handled asynchronously using callbacks, Promises, or `async/await`.
2.  **libuv:** Node.js delegates these heavy, blocking I/O tasks to a separate C++ library called **libuv** (Q108).
3.  **Thread Pool:** libuv uses a **thread pool** (a pool of worker threads) to handle the actual synchronous I/O operations in the background. Once the I/O is complete, the result's callback is placed into the Node.js Event Loop queue, keeping the main JavaScript thread non-blocking and free to handle new requests. 

---

## 108. What is libuv?

**libuv** is a cross-platform C library that provides Node.js with its core asynchronous I/O and concurrency capabilities.

* It acts as an abstraction layer between Node's JavaScript and the underlying operating system's I/O facilities.
* **Key Responsibilities:**
    * Implements the Node.js **Event Loop** (Q85).
    * Manages the **Thread Pool** for handling costly synchronous operations (like file system I/O, DNS lookups, and some crypto tasks).
    * Handles asynchronous network sockets (TCP/UDP).

libuv ensures that I/O operations don't block the main JavaScript thread, which is fundamental to Node's performance.

---

## 109. What are worker threads?

**Worker Threads** is a Node.js module (introduced as stable in v12) that allows developers to spawn **separate, independent JavaScript execution threads** in the background.

* **Purpose:** To handle **CPU-bound tasks** (heavy calculations, large loops) that would otherwise block the main Event Loop.
* **Mechanism:** Each worker thread has its own V8 instance, Event Loop, and memory space. They communicate with the main thread (and each other) via a message passing system (`postMessage`).
* **Difference from libuv Thread Pool:** Worker threads are explicit JavaScript threads created by the developer for CPU work, whereas the libuv thread pool is used internally by Node for I/O tasks.

---

## 110. What is clustering?

**Clustering** is a mechanism in Node.js that allows multiple copies of the Node application to run concurrently on the same machine and **share the same server port**.

* **Mechanism:** The built-in **`cluster` module** utilizes the `fork()` method to spawn multiple child processes, each running an instance of the app. A master process handles incoming connections and distributes the load among the workers using a round-robin approach.
* **Purpose:** To fully utilize **multi-core CPUs** on the host machine. Since Node is single-threaded, one process can only use one CPU core. Clustering overcomes this limitation, significantly improving the scalability and resilience of the application.

---

## 111. Difference between blocking and non-blocking code?

| Feature | Blocking (Synchronous) | Non-blocking (Asynchronous) |
| :--- | :--- | :--- |
| **Execution** | The program execution halts until the operation completes. | The program execution continues immediately without waiting for the operation to complete. |
| **I/O Handling** | The main thread is busy waiting for the I/O response. | The main thread offloads the I/O and handles other tasks while waiting for a callback/Promise resolution. |
| **Node.js API** | APIs ending in `Sync` (e.g., `fs.readFileSync`). | Standard APIs (e.g., `fs.readFile`, network requests using Promises). |
| **Impact** | Can freeze the application and limit concurrency. | Maintains a responsive Event Loop and high concurrency. |

In Node.js, the best practice is to always prefer non-blocking code, especially for I/O operations.

---

## 112. What is CommonJS vs ES Modules in Node?

These are two different module systems used to organize and reuse code in JavaScript.

| Feature | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Keywords** | `require()` and `module.exports` or `exports` | `import` and `export` |
| **Node Default** | Historically the default, used in `.js` or `.cjs` files. | Now the standard, used in `.mjs` files or `.js` files when `type: "module"` is in `package.json`. |
| **Loading** | **Synchronous** loading (blocking). | **Asynchronous** loading (non-blocking). |
| **Binding** | **Dynamic** (exports are a copy/value at the time of `require`). | **Static** (exports are resolved at compile time, enabling Tree Shaking). |

Node.js supports both, but **ES Modules** are the modern, standard choice, offering static analysis benefits like tree shaking (Q66).

---

## 113. What is the Node process model?

The Node process model refers to how Node applications typically execute and scale, based on its architecture:

1.  **Single-Process/Single-Threaded Core:** A single Node instance runs in a single process on a single thread (the Event Loop).
2.  **Non-Blocking I/O:** The use of libuv's thread pool ensures that I/O doesn't block the main thread.
3.  **Scaling with Clustering:** To utilize multi-core CPUs, the **Clustering model** is used, where a master process manages multiple worker processes (Q110), effectively distributing the load and handling concurrency at the operating system level.
4.  **Shared-Nothing Architecture:** Each Node process/worker operates independently, not sharing memory or state with other workers, which simplifies scaling and management.

---

## 114. What are streams?

**Streams** are abstract interfaces in Node.js for handling reading and writing sequential data. They are fundamental to Node's design philosophy of handling I/O efficiently.

* **Key Concept:** Streams don't load the entire data (e.g., a large file) into memory all at once. Instead, they process data in **small, manageable chunks**.
* **Purpose:** Reduces memory footprint and time delay when dealing with large volumes of data (e.g., streaming a video file, handling a massive CSV upload).

---

## 115. Explain types of streams.

There are four fundamental types of streams in Node.js, based on their read/write capabilities:

1.  **`Readable` Streams:** Used for reading data (source). Examples: `fs.createReadStream()`, HTTP responses (on the client), standard input (`process.stdin`).
2.  **`Writable` Streams:** Used for writing data (destination). Examples: `fs.createWriteStream()`, HTTP requests (on the client), standard output (`process.stdout`).
3.  **`Duplex` Streams:** Implement both `Readable` and `Writable` interfaces. Examples: Network sockets (`net.Socket`).
4.  **`Transform` Streams:** A type of Duplex stream that can modify or transform the data as it is being written and read. Examples: Compression (e.g., `zlib.createGzip()`).

Streams are often connected using the `pipe()` method, which automatically handles the flow of data between a Readable and a Writable stream.

---

## 116. What is event emitter?

The **`EventEmitter`** is a core class in Node.js that implements the **Observer pattern**. It is a fundamental building block for many of Node's modules (like Streams, Servers, etc.).

* **Mechanism:** Objects that extend `EventEmitter` can:
    1.  **Emit** named events (`emitter.emit('event_name', data)`).
    2.  **Subscribe** (listen) to those events (`emitter.on('event_name', listenerFunction)`).
* **Purpose:** Allows for decoupled communication between different parts of the application, which is central to Node's event-driven architecture.

---

## 117. How to handle errors in Node.js?

Error handling in Node.js is complex due to its asynchronous nature. The approach depends on the context:

1.  **Asynchronous I/O (Callbacks):** Errors are traditionally passed as the **first argument** to the callback function (`if (err) { ... }`).
2.  **Promises/Async Await:** Handled using `.catch()` for Promises or **`try...catch`** blocks for `async/await` (Q74).
3.  **Streams:** Errors are handled by listening for the **`error`** event on the stream (`stream.on('error', handler)`). **Crucially, if an error event is not handled, Node.js will crash the process.**
4.  **Uncaught Exceptions:** For synchronous code that throws an error, the error bubbles up to the global scope. This is caught using the **`process.on('uncaughtException', handler)`** listener, which should be used to log the error, shut down I/O gracefully, and exit the process.
5.  **Unhandled Rejections:** For Promises rejected without a `.catch()`, the **`process.on('unhandledRejection', handler)`** listener is used.

---

## 118. What is middleware?

**Middleware** is a function that sits in the middle of a request-response cycle (usually in a web framework like Express.js or Koa.js) and can execute code, modify request/response objects, end the cycle, or call the next middleware in the stack.

* **Structure:** A middleware function typically takes three arguments: `(req, res, next)`.
* **Key Action:** Calling `next()` passes control to the next middleware function or the final route handler.
* **Common Use Cases:**
    * Logging requests.
    * Authentication and authorization checks.
    * Parsing request bodies (e.g., JSON parsing).
    * Handling CORS or compression.

---

## 119. What is the difference between `spawn`, `exec`, and `fork`?

These are all methods in Node's **`child_process` module** used to run external commands or separate Node scripts.

| Method | Purpose | Execution | Communication | Output |
| :--- | :--- | :--- | :--- | :--- |
| **`spawn(command, [args])`** | Runs an external command (e.g., `git`, `ls`). | **Asynchronously** and **streams** I/O. Best for large data. | Uses standard I/O streams. | Returns a `ChildProcess` object. |
| **`exec(command)`** | Runs an external command. | **Asynchronously** and **buffers** all output before returning it. | Uses standard I/O streams. | Returns the output via a callback. Best for small data. |
| **`fork(modulePath)`** | **Spawns a new Node.js process** that runs a specified Node module. | **Asynchronously**. | Creates a **special communication channel** for message passing (`send()`/`on('message')`). | Used primarily for the **Cluster module** (Q110). |

---

## 120. How does Node handle memory management?

Node.js relies on the **V8 JavaScript engine** (Q121) for memory management, which uses a combination of techniques:

1.  **Garbage Collection (GC):** V8 automatically reclaims memory that is no longer reachable. It uses a **generational collector** with two main spaces:
    * **Young Generation (Nursery):** Where new objects are created. Uses a fast **Scavenge/Minor GC** that runs often.
    * **Old Generation (Heap):** Stores objects that survive the Young Generation. Uses a slower, less frequent **Mark-Sweep/Major GC**.
2.  **Heap Size:** Node.js has a configurable limit on the maximum size of the heap memory V8 can use. This prevents processes from consuming excessive resources, although large, long-lived data structures can still lead to memory leaks if not managed correctly (e.g., unbounded closures, unhandled references).
3.  **Streams:** The use of **Streams** (Q114) for I/O is a memory management technique, ensuring large files don't overload the memory.

---

## 121. What is V8?

**V8** is Google's open-source, high-performance **JavaScript and WebAssembly engine**, written in C++.

* **Purpose:** It takes JavaScript code and compiles it into highly efficient **machine code** before executing it, rather than interpreting it line by line.
* **Used in:** Google Chrome, Node.js, and many other projects.
* **Key Components:**
    * **Ignition (Interpreter):** Executes code and collects type feedback.
    * **Turbofan (Optimizing Compiler):** Uses the type feedback to generate highly optimized machine code for frequently executed functions.
    * **Garbage Collector:** Manages memory automatically (Q120).

V8 is what gives Node.js its speed and efficiency.

---

## 122. What is the call stack size limit?

The **call stack** is a part of the memory space used by V8 to keep track of the current execution context (Q45) and function calls.

The call stack size limit is a **hardcoded limit** (which varies by Node/browser version and configuration, typically around 1MB in Node.js) to prevent the application from consuming infinite memory in cases of **uncontrolled recursion**.

* When a function calls itself recursively too many times, the call stack grows beyond this limit, causing a **Stack Overflow Error**.
* This limit is one reason why **tail call optimization (TCO)** is an important concept (Q36), though TCO is not fully supported in V8/Node.js.

---

## 123. What is buffer? How is it different from `ArrayBuffer`?

### Buffer (Node.js)
A **Buffer** is a global class in Node.js used to handle raw **binary data** (raw memory allocation).

* **Key Feature:** A Buffer is similar to an array of integers, where each integer represents a byte of data. It is essential for interacting with streams and performing I/O operations (e.g., reading/writing files, handling network packets).
* **Structure:** It's allocated outside the V8 heap, making it efficient for direct memory manipulation.

### ArrayBuffer (JavaScript/Browser)
An **`ArrayBuffer`** is a generic, fixed-length container for raw binary data in the JavaScript language specification (ES6).

* **Key Feature:** It is just a raw data container and **cannot be directly manipulated** by JavaScript. You need a **Typed Array** (like `Uint8Array` or `Float64Array`) or a `DataView` to read and write its contents.
* **Relationship to Buffer:** Node's `Buffer` class is technically an optimized subclass of `Uint8Array`, which itself is a view on top of an `ArrayBuffer`.

---

## 124. What is the purpose of `package.json`?

The **`package.json`** file is the manifest (metadata) for a Node.js project or NPM package. It lives at the root of the project and provides crucial information for tools, Node.js, and other developers.

### Key Fields:

* **`name` and `version`:** The unique identifier and version number (following SemVer, Q125).
* **`dependencies`:** Packages required for the application to run in production.
* **`devDependencies`:** Packages required only for development and testing (e.g., testing frameworks, linters).
* **`scripts`:** Custom commands (e.g., `npm run start`, `npm run build`).
* **`main`:** The entry point file for the package (if it's a library).
* **`type`:** Specifies whether the project uses **CommonJS** or **ES Modules** (Q112).

---

## 125. What is semantic versioning?

**Semantic Versioning (SemVer)** is a standardized scheme for assigning version numbers to software releases. It uses a three-part format: **`MAJOR.MINOR.PATCH`**.

The rules dictate how version numbers change:

1.  **PATCH (x.y.Z):** Incremented for **backward-compatible bug fixes** (e.g., $1.0.1 \rightarrow 1.0.2$).
2.  **MINOR (x.Y.z):** Incremented for **backward-compatible new features** (e.g., $1.2.0 \rightarrow 1.3.0$).
3.  **MAJOR (X.y.z):** Incremented for changes that include **backward-incompatible/breaking API changes** (e.g., $2.0.0 \rightarrow 3.0.0$).

This system allows developers to understand the scope of changes and the risk of upgrading a package just by looking at the version number.

---

## 126. What are peer dependencies?

**Peer dependencies** are listed in `package.json` and specify that the current package **needs a specific version of a host tool or library to function correctly**, but it expects the *consuming project* (the project that installs this package) to provide that dependency.

* **Use Case:** Often used in plugins, libraries, or component frameworks (e.g., a React component library) that rely on the main library (React) being present in the host application.
* **Example:** A `react-carousel` package might list `react` as a peer dependency, ensuring that the host app is using a compatible version of React, without the carousel package bundling its own separate version of React.

## F. Architecture, Patterns & Performance

-----

## 127\. What is functional programming?

**Functional Programming (FP)** is a programming paradigm where programs are constructed by applying and composing functions. It treats computation as the evaluation of mathematical functions and avoids changing state and mutable data.

### Core Concepts:

  * **Pure Functions:** Functions that are deterministic (same input always gives same output) and have no side effects (Q11).
  * **Immutability:** Data cannot be changed after creation (Q135).
  * **First-Class and Higher-Order Functions:** Functions can be treated like variables (passed as arguments, returned from other functions) (Q20).
  * **Referential Transparency:** An expression can be replaced by its result without changing the program's behavior.

-----

## 128\. What is object-oriented programming?

**Object-Oriented Programming (OOP)** is a paradigm centered around the concept of **"objects"**, which can contain data (attributes/properties) and code (methods).

### Core Pillars:

1.  **Encapsulation:** Bundling data and methods that operate on the data into a single unit (the object) and restricting direct access to some of the object's components (using private fields).
2.  **Inheritance:** Mechanism where a new class (subclass) derives properties and behavior from an existing class (superclass).
3.  **Abstraction:** Hiding complex implementation details and showing only essential features to the user.
4.  **Polymorphism:** The ability of an object to take on many forms; allowing the same method name to behave differently based on the context or the object it's called on.

-----

## 129\. What is the module pattern?

The **Module Pattern** is one of the oldest and most popular design patterns in JavaScript for achieving better organization and encapsulation by using **closures** (Q15).

  * **Mechanism:** It typically involves an **Immediately Invoked Function Expression (IIFE)** (Q19) that returns an object containing the public methods.
  * **Encapsulation:** Variables and functions defined inside the IIFE but **not returned** are kept private and cannot be accessed from the outside, but they can be accessed by the public methods via the closure.

<!-- end list -->

```javascript
const module = (function() {
  let privateCounter = 0; // Private variable

  function privateMethod() { /* ... */ }

  return { // Public API
    increment: function() { privateCounter++; },
    getCount: function() { return privateCounter; }
  };
})();
```

-----

## 130\. What is the revealing module pattern?

The **Revealing Module Pattern** is a variation of the Module Pattern (Q129) where all variables and methods are defined **privately** first, and the returned object simply maps the internal private functions and variables to their desired public names.

  * **Advantage:** It offers cleaner syntax at the end of the module because you can clearly see the public API at a glance.
  * **Mechanism:** Instead of defining public methods inside the returned object, the module defines a public object at the end that "reveals" the private implementations.

-----

## 131\. Explain the observer pattern.

The **Observer Pattern** (often implemented in JS using the **EventEmitter** pattern in Node.js) is a behavioral design pattern where an object, called the **Subject** (or **Observable**), maintains a list of its dependents, called **Observers** (or **Subscribers**), and notifies them automatically of any state changes, usually by calling one of their methods.

  * **Decoupling:** It establishes a **one-to-many** dependency between objects without them knowing details about each other.
  * **Use Cases:** Event handling in GUIs, managing state updates in front-end frameworks (like Redux, which uses a form of the Observer pattern), and implementing custom events.

-----

## 132\. What is pub/sub?

**Pub/Sub (Publish-Subscribe)** is a messaging pattern that is similar to the Observer pattern but introduces a **third component**: a message **Broker** or **Event Channel**.

  * **Difference from Observer:** In the Observer pattern, the Subject directly manages and notifies its Observers. In Pub/Sub, the **Publishers** send messages to the Broker, and the **Subscribers** listen for messages *on the Broker* via named topics. The Publisher and Subscriber are entirely decoupled and do not know about each other.
  * **Advantage:** Greater scalability and flexibility, as the communication is entirely routed through an intermediary channel.
  * **Use Cases:** Distributed systems, microservice communication, and large-scale event buses in front-end apps.

-----

## 133\. Explain MVC, MVVM patterns.

These are structural architectural patterns used to separate the concerns of an application, making it more modular and maintainable.

### 1\. Model-View-Controller (MVC)

  * **Model:** Manages the application data, business logic, and rules. It's unaware of the View or Controller.
  * **View:** The UI representation. Displays data from the Model and captures user input.
  * **Controller:** Acts as an intermediary, receiving input from the View, executing logic on the Model, and telling the View what to display.

### 2\. Model-View-ViewModel (MVVM)

  * **Model:** Same as MVC.
  * **View:** Same as MVC (the UI).
  * **ViewModel:** An abstraction of the View. It holds the View's state and behavior and exposes data from the Model in a consumable format for the View. It uses **Data Binding** to automatically synchronize state between the View and the ViewModel, eliminating the need for a Controller to manually update the View. (Popular in React, Vue, and Angular).

-----

## 134\. What is dependency injection?

**Dependency Injection (DI)** is an architectural pattern where an object receives the objects it depends on (its **dependencies**) from an external source, rather than creating them itself.

  * **Mechanism:** Instead of a class creating an instance of its dependency inside its constructor (`const service = new Service();`), the dependency is "injected" from outside, usually through the constructor or a setter method.
  * **Inversion of Control (IoC):** DI is a form of IoC, as it shifts the responsibility of creating and managing dependencies away from the component itself.
  * **Benefits:** Makes code easier to test (dependencies can be easily swapped with mock objects), increases modularity, and reduces coupling between components.

-----

## 135\. What is immutability and why is it important?

**Immutability** is the principle that once a piece of data (an object, array, or primitive) is created, it **cannot be changed**. Any operation that appears to modify the data actually returns a brand-new copy of the data with the modifications applied.

### Importance:

1.  **Predictability:** Mutable state makes it difficult to track where and when data was changed, leading to bugs. Immutability makes state changes transparent and predictable.
2.  **Simplified Debugging:** Knowing that a past state will never change makes debugging easier.
3.  **Performance Optimization (in Frameworks):** Immutability is crucial for frameworks like React. If the old state object and the new state object are different *references* (because it was immutable), the framework can quickly determine that components need to re-render (Shallow comparison). If they were the same reference (mutable), a deep comparison would be required, which is slow.
4.  **Concurrency:** Eliminates complex thread synchronization issues, as multiple threads can safely read the same immutable data.

-----

## 136\. What is event-driven architecture?

**Event-Driven Architecture (EDA)** is a software design pattern centered around the production, detection, consumption of, and reaction to **events**. An event is a significant change in state (e.g., "User Signed Up," "Order Placed").

  * **Core Components:**
      * **Event Producers (Publishers):** Emit events when a state change occurs.
      * **Event Consumers (Subscribers):** Listen for specific events and react to them.
      * **Event Channel/Broker:** Manages the routing of events between Producers and Consumers (Pub/Sub, Q132).
  * **Benefits:** High decoupling, responsiveness, and scalability, making it popular for microservices (Q137) and complex, distributed systems.

-----

## 137\. Explain microfrontends.

**Microfrontends** is an architectural style where a single, large front-end application is composed of **multiple smaller, independently developed, and deployed applications** (or "micro-apps").

  * **Motivation:** To apply the principles of microservices to the frontend.
  * **Benefits:**
      * **Independent Teams:** Teams can work, deploy, and scale their parts of the application independently using different technologies if needed.
      * **Easier Maintenance:** Smaller, self-contained codebases are easier to manage and update.
      * **Incremental Upgrades:** Allows older parts of the application to be gradually rewritten without a complete monolithic overhaul.
  * **Implementation:** Typically achieved via techniques like Web Components, iframes, or module federation (in Webpack 5).

-----

## 138\. Explain monorepos vs polyrepos.

These describe two different strategies for organizing source code repositories.

| Feature | Monorepo (Mono-Repository) | Polyrepo (Poly-Repository) |
| :--- | :--- | :--- |
| **Structure** | A single repository containing **all** code for every project, module, and application (e.g., frontend, backend, shared libraries). | Multiple repositories, where **each project or service** has its own dedicated repository. |
| **Code Sharing** | **Easy** (import directly from a shared library in the same repo). | **Harder** (requires publishing and consuming packages via NPM). |
| **Refactoring** | **Atomic commits** across projects are easy. | Refactoring across services requires multiple pull requests. |
| **Tooling** | Requires specialized tooling (e.g., Lerna, Nx) to manage dependencies and builds efficiently. | Standard Git/NPM workflow. |
| **Use Case** | Ideal for tightly coupled services or small organizations. | Ideal for loosely coupled microservices or highly distributed teams. |

-----

## 139\. What is memoization in React vs pure JavaScript?

**Memoization** is the optimization technique of caching function results based on inputs (Q41). The core concept is the same, but the implementation and context differ.

| Context | Pure JavaScript Memoization | React Memoization |
| :--- | :--- | :--- |
| **Goal** | Cache the result of a **function** to avoid re-computation. | Prevent a **function component** or **specific calculation** from executing (re-rendering/re-running) if its inputs haven't changed. |
| **Tools** | Custom Higher-Order Function (HOC) that manages a cache object (Q41). | **`React.memo`** (for components), **`useMemo`** (for values/calculations), **`useCallback`** (for functions). |
| **Mechanism** | Simple cache lookup based on serialized arguments. | Shallow comparison of the component's **props** or the hook's **dependency array**. |

-----

## 140\. How do you optimize a large JS codebase?

Optimizing a large codebase involves improving both developer experience (DX) and runtime performance (Q142).

1.  **Architecture:** Enforce strict architectural patterns (e.g., Microfrontends, layered architecture) to maintain separation of concerns and prevent unintended coupling.
2.  **Modularity & Tree Shaking:** Use **ES Modules** and ensure code is structured for effective **tree shaking** (Q66) to remove dead code.
3.  **Code Splitting & Lazy Loading:** Use dynamic `import()` and route-based splitting to load code only when needed (Q100, Q146).
4.  **Refactoring:** Aggressively remove unused features, deprecated libraries, and eliminate redundant logic.
5.  **Performance:**
      * Review hot paths for performance bottlenecks (Q144).
      * Introduce memoization strategically (Q139).
      * Migrate heavy computations to **Web Workers** (Q92) or **Worker Threads** (Q109).

-----

## 141\. How do you reduce bundle size?

Reducing the final size of the application's compiled JavaScript file is crucial for faster initial load times.

1.  **Tree Shaking:** Ensure your bundler (Webpack/Rollup) is correctly configured to eliminate unused exports/code (Q66).
2.  **Code Splitting/Lazy Loading:** Break the main bundle into smaller chunks that are loaded on demand (Q146).
3.  **Dependency Analysis:** Use tools (e.g., `webpack-bundle-analyzer`) to visualize and identify large, unnecessary, or duplicate dependencies. Replace large libraries (like Moment.js) with lighter alternatives (like `date-fns`).
4.  **Transpilation Targets:** Configure Babel/TypeScript to target modern browsers whenever possible to avoid unnecessarily large polyfills for old features (Q30).
5.  **Minification and Compression:** Ensure the code is aggressively **minified** (removing whitespace, renaming variables) and served with **gzip** or **Brotli** compression.

-----

## 142\. Why is runtime performance vs bundle performance important?

Both are critical, but they affect different stages of the user experience.

| Performance Metric | Bundle Performance (Load Time) | Runtime Performance (Execution Speed) |
| :--- | :--- | :--- |
| **Focus** | How quickly the app becomes **interactive** (Time to Interactive, First Contentful Paint). | How smoothly the app runs **after** it has loaded (FPS, response latency). |
| **Optimization Goal** | Reducing **bundle size** and initial **network activity** (Q141). | Reducing **CPU usage**, avoiding **layout thrashing** (Q103), and preventing **main thread blocking**. |
| **Impact** | Affects **first impressions**, SEO, and conversion rates. | Affects **user satisfaction**, perceived responsiveness, and long-term usability. |

A large, slow bundle (poor bundle performance) is a barrier to entry, while a janky, unresponsive UI (poor runtime performance) causes user frustration.

-----

## 143\. How to debug memory leaks in JavaScript?

A memory leak occurs when the application unintentionally holds references to objects that are no longer needed, preventing the Garbage Collector (Q35) from freeing up that memory.

1.  **Use DevTools Memory Tab:** Use the **Heap Snapshot** tool in Chrome DevTools to capture memory at two different states (e.g., before and after an action). Compare the snapshots to find objects that were created and should have been garbage collected but are still present.
2.  **Identify Causes:** Look for common culprits:
      * **Global Variables:** Accidental creation of globals.
      * **Unremoved Event Listeners:** Event handlers (especially on `window` or `document`) that were never removed when a component unmounted.
      * **Unterminated Timers:** `setInterval` or open Web Sockets that were never cleared.
      * **Out-of-Scope Closures:** Closures holding on to references of large objects unnecessarily.

-----

## 144\. What tools are used for performance profiling?

**Performance profiling** involves measuring and analyzing the time and resources consumed by the application to identify bottlenecks.

1.  **Chrome DevTools Performance Tab:** The primary tool for analyzing the main thread activity, rendering pipeline, network, and memory usage. It captures a **timeline recording** of CPU usage, function calls, and layout/paint events.
2.  **Lighthouse/WebPageTest:** Tools for generating aggregate performance scores (e.g., Core Web Vitals) and actionable audits based on simulated network conditions.
3.  **Memory Heap Snapshot:** Used specifically to debug memory leaks by identifying retained objects (Q143).
4.  **Node.js Profilers:** Tools like the built-in V8 profiler (`--prof`) or external tools like `flamebearer` can generate flame graphs to visualize where CPU time is being spent in the backend code.

-----

## 145\. What are source maps?

**Source maps** are files that provide a mapping between a bundled, minified, or transpiled JavaScript file (the file the browser executes) and the original source code files (the files the developer wrote).

  * **Mechanism:** When a browser throws an error, it points to a line in the minified code. The source map allows the browser (or DevTools) to translate this back to the corresponding file, line number, and column in the original, readable source code.
  * **Purpose:** Essential for **debugging production code**. Without source maps, debugging would involve sifting through a single, unreadable, highly optimized file.

-----

## 146\. What is code splitting?

**Code splitting** is a technique that breaks the application's single, large JavaScript bundle into multiple, smaller bundles (chunks) that can be loaded on demand.

  * **Goal:** Improve initial page load time by delivering only the code that is strictly necessary for the user's current view.
  * **Implementation:** Achieved using bundler features (like Webpack's dynamic `import()`) that create a separate chunk for a specific dependency or module.
  * **Types:**
      * **Route-based splitting:** Loading code required for a page route only when the user navigates to it.
      * **Component-based splitting:** Loading an entire component tree only when it is rendered (often achieved with React's `lazy` and `Suspense`).

-----

## 147\. What is a race condition? How to prevent it in JS?

A **race condition** is a scenario where the output of a program is unexpectedly and critically dependent on the sequence or timing of two or more interleaved asynchronous tasks.

### Prevention in JS:

Since JavaScript is single-threaded, true thread-level race conditions are usually only an issue in **Web Workers** or **Worker Threads** (where memory access needs to be synchronized).

For **main thread async code** (Promises, network calls), the issue is usually **out-of-order state updates**. Prevention involves:

1.  **Request Cancellation:** For multiple requests of the same type (e.g., search queries), canceling the older, pending requests using `AbortController` (Q78, Q150-7) ensures only the latest result is processed.
2.  **Debouncing/Throttling:** Limit the rate of function execution to avoid overwhelming the system with competing tasks (Q39, Q40).
3.  **State Management:** Use atomic updates or sequential processing (e.g., Promise chaining) to guarantee order.

-----

## 148\. What is deadlock? Can it happen in JS?

A **deadlock** is a state where two or more computing processes are waiting indefinitely for each other to release a resource, resulting in a permanent halt.

  * **Can it happen in JS?**
      * **Main Thread:** **No.** Because the main JavaScript thread is single-threaded and non-preemptive (it runs one task to completion), the typical resource locking required for a deadlock does not occur.
      * **Worker Threads/Shared Memory:** **Yes.** When using **SharedArrayBuffer** and **Atomics** in Web Workers or Node.js Worker Threads, if two threads are blocked waiting for each other to release a lock (mutex or semaphore), a classic deadlock can occur.

-----

## 149\. What is optimistic vs pessimistic UI updates?

These are two strategies for handling UI updates in response to user actions that require an API call.

| Strategy | Optimistic Update | Pessimistic Update |
| :--- | :--- | :--- |
| **User Experience** | **Better.** UI updates immediately, providing instant feedback. | **Worse.** User sees a loader/spinner while waiting for API response. |
| **Workflow** | **Update UI first $\rightarrow$ Send API request.** If the API fails, the UI is rolled back (reverted). | **Send API request first $\rightarrow$ Wait for server response $\rightarrow$ Update UI.** |
| **Risk** | Higher risk of showing an incorrect state if the API fails, requiring complex rollback logic. | Minimal risk of inconsistent state. |
| **Use Case** | Actions with low failure rates (e.g., liking a post, toggling a setting). | Actions with high consequence or high failure rates (e.g., submitting a payment, deleting critical data). |

-----

## 150\. How do you architect a scalable JavaScript application?

A scalable application must handle increasing user load and increasing developer team size/code complexity.

1.  **Microservices/Microfrontends:** Decouple the application into independent, small services/apps that can be developed and scaled horizontally (Q136, Q137).
2.  **Stateless Servers:** Ensure all backend Node.js servers are **stateless**. Session data should be stored externally (e.g., Redis) so that any server instance can handle any request.
3.  **Horizontal Scaling (Clustering):** Utilize Node.js **Clustering** (Q110) or containerization (Kubernetes) to run multiple instances of the application to leverage multi-core processors.
4.  **Asynchronous I/O:** Fully embrace the non-blocking nature of Node.js and leverage streams (Q114) to process large datasets without high memory use.
5.  **Caching:** Implement multiple levels of caching: CDN (Edge), Reverse Proxy (Varnish/Nginx), and In-Memory/Distributed Cache (Redis).
6.  **Immutable Data:** Use immutable state management in the frontend to optimize rendering and simplify data flow (Q135).

-----

## 🛠️ 75 Real-World Scenario-Based Questions

## A. Asynchronous & Promise Scenarios

-----

## 1\. You have 3 API calls. The page should render only after all succeed, but if any one fails, show partial UI. How do you implement this?

I would use **`Promise.allSettled()`** because it waits for all promises to conclude, regardless of resolution or rejection, allowing us to process all results and determine the partial UI state.

```javascript
async function fetchAllData() {
  const promises = [apiCall1(), apiCall2(), apiCall3()];
  const results = await Promise.allSettled(promises);

  const successfulData = results
    .filter(res => res.status === 'fulfilled')
    .map(res => res.value);

  const hasFailures = results.some(res => res.status === 'rejected');

  // Logic to render:
  if (successfulData.length > 0) {
    renderPartialUI(successfulData);
  }
  if (hasFailures) {
    logFailures(results);
    showFailureMessage();
  }
}
```

-----

## 2\. An API sometimes returns data late. You must timeout the request after 3 seconds. How to implement promise timeout?

I would use **`Promise.race()`** to race the API call against a manual timeout Promise.

```javascript
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
}

function fetchWithTimeout(apiPromise, ms) {
  return Promise.race([
    apiPromise,
    timeout(ms)
  ]);
}

// Usage:
const delayedApi = fetch('/data');
fetchWithTimeout(delayedApi, 3000)
  .then(data => console.log('Data:', data))
  .catch(error => console.error(error.message)); // Catches timeout error
```

-----

## 3\. You want to call APIs in sequence, each using the previous response. How do you write clean async/await code?

I would use **`async/await`** with a single `try...catch` block to ensure the flow is sequential and readable, making error handling straightforward.

```javascript
async function sequentialCalls(userId) {
  try {
    // 1. Get user details
    const userResponse = await fetch(`/api/users/${userId}`);
    const userData = await userResponse.json();

    // 2. Use user ID to get their orders
    const ordersResponse = await fetch(`/api/orders?userId=${userData.id}`);
    const orders = await ordersResponse.json();

    // 3. Use the first order ID to get details
    const firstOrderId = orders[0]?.id;
    const detailResponse = await fetch(`/api/order-details/${firstOrderId}`);
    const orderDetails = await detailResponse.json();

    return { user: userData, orders, orderDetails };
  } catch (error) {
    console.error('Sequential API failed:', error);
    throw error;
  }
}
```

-----

## 4\. You need to retry an API call 5 times with exponential backoff if it fails. Implement this.

I would implement a recursive function that uses a `try...catch` block for retries and `setTimeout` for exponential backoff.

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryFetch(url, retries = 5, backoff = 300) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (retries > 0) {
      const delayTime = backoff * (5 - retries) + backoff; // Exponential backoff (300, 600, 900, ...)
      console.warn(`Retrying in ${delayTime}ms... Retries left: ${retries - 1}`);
      await delay(delayTime);
      return retryFetch(url, retries - 1, backoff); // Recursive call
    }
    throw new Error('All retries failed.');
  }
}
```

-----

## 5\. You have to run 10 API calls in parallel, but only 3 at a time. Implement concurrency control.

This is best implemented using a queue/pool pattern that controls the maximum number of simultaneously pending promises.

```javascript
async function runWithConcurrency(tasks, limit) {
  const activePromises = [];
  const results = [];

  for (const task of tasks) {
    const p = task();
    activePromises.push(p);

    p.then(res => {
        results.push(res);
        // Remove the promise from the active list when it settles (resolve/reject)
        activePromises.splice(activePromises.indexOf(p), 1);
    }).catch(err => {
        results.push(err); // Store the error if needed
        activePromises.splice(activePromises.indexOf(p), 1);
    });

    if (activePromises.length >= limit) {
      // Wait for the first promise to settle before proceeding
      await Promise.race(activePromises);
    }
  }

  // Wait for all remaining active promises to finish
  await Promise.allSettled(activePromises);

  return results; // Note: Results order might not match input order
}

// tasks should be an array of functions that return a Promise
const apiTasks = Array(10).fill(0).map((_, i) => () => fetch(`/api/data/${i}`));
// runWithConcurrency(apiTasks, 3);
```

-----

## 6\. How do you cancel a `fetch()` request mid-way?

I would use the **`AbortController`** API, which is the standardized way to cancel `fetch` requests.

1.  **Create Controller:** Instantiate a new `AbortController`.
2.  **Attach Signal:** Pass the controller's `signal` to the `fetch` options.
3.  **Abort:** Call `controller.abort()` when cancellation is desired.

<!-- end list -->

```javascript
const controller = new AbortController();
const signal = controller.signal;

function startFetch() {
  fetch('/api/data', { signal })
    .then(response => response.json())
    .then(data => console.log('Data:', data))
    .catch(err => {
      if (err.name === 'AbortError') {
        console.log('Fetch request was cancelled');
      } else {
        console.error('Fetch error:', err);
      }
    });
}

// To cancel:
controller.abort();
```

-----

## 7\. A user clicks a button multiple times; you must ensure only the latest request updates the UI. Implement request cancellation.

This requires tracking the active `AbortController` and aborting the previous request before starting a new one.

```javascript
let currentController = null;

async function handleSearch(query) {
  // 1. Cancel the previously pending request
  if (currentController) {
    currentController.abort();
  }

  // 2. Create a new controller and assign it
  currentController = new AbortController();
  const signal = currentController.signal;

  try {
    const response = await fetch(`/api/search?q=${query}`, { signal });
    const data = await response.json();

    // 3. Update UI only if the request succeeded
    console.log('Updated UI with latest search results:', data);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Older request successfully cancelled.');
    } else {
      console.error('Request failed:', error);
    }
  } finally {
    // 4. Clear controller reference if the request completed normally
    if (currentController && !currentController.signal.aborted) {
       currentController = null;
    }
  }
}
```

-----

## 8\. Implement a debounced search bar that calls API when typing stops.

I would use a **debounce function** (Q39) to wrap the API call logic, ensuring it only fires after a fixed period of inactivity (e.g., 300ms) has passed since the last input event.

```javascript
function debounce(func, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const callSearchApi = (query) => {
  // In a real app, this would be an API call
  console.log(`Searching for: ${query}`);
};

const debouncedSearch = debounce(callSearchApi, 300);

// document.getElementById('search-input').addEventListener('input', (e) => {
//   debouncedSearch(e.target.value);
// });
```

-----

## 9\. Implement a throttled scroll event for infinite scrolling.

I would use a **throttle function** (Q40) to limit the scroll handler to run at most once every, say, 200ms, checking if the user is near the bottom of the page.

```javascript
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight - 500) { // If 500px from bottom
    console.log('Time to load more data!');
    // loadMoreData();
  }
};

// window.addEventListener('scroll', throttle(handleScroll, 200));
```

-----

## 10\. You need to transform a callback-based API into a Promise-based API. How?

I would use the **Promise constructor** to wrap the callback-based function. Inside the executor function, I'd call the original function, and based on the arguments received in the callback, I'd either call `resolve` or `reject`.

```javascript
// Original callback-based API
function callbackBasedApi(data, callback) {
  setTimeout(() => {
    if (data) {
      callback(null, `Processed: ${data}`); // Error first convention (err, data)
    } else {
      callback(new Error('No data provided'));
    }
  }, 500);
}

// Promised version
function promiseBasedApi(data) {
  return new Promise((resolve, reject) => {
    callbackBasedApi(data, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

// Usage: promiseBasedApi('test').then(...).catch(...)
```

-----

## B. Data Structures & Real Usage

-----

## 11\. You get a nested JSON of unknown depth. How do you flatten it?

I would use a **recursive function** that iterates over the object's properties. If a property's value is an object, the function calls itself; otherwise, it assigns the key-value pair to the result object.

```javascript
function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, result); // Recurse
    } else {
      result[newKey] = value; // Assign value
    }
  }
  return result;
}

// Example: { a: 1, b: { c: 2, d: { e: 3 } } } => { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

-----

## 12\. Given an array of objects, remove duplicates by id.

I would use a **`Map`** or a `Set` combined with `reduce` to efficiently store and retrieve unique objects, prioritizing the last object found (or first, depending on requirements).

```javascript
function removeDuplicatesById(arr) {
  // Use a Map to store unique objects, keying by id
  const map = new Map();
  for (const item of arr) {
    map.set(item.id, item);
  }
  // Convert Map values back to an array
  return Array.from(map.values());
}

// Alternative (more FP style):
// return Array.from(new Map(arr.map(item => [item.id, item])).values());
```

-----

## 13\. Convert an array of objects into an object keyed by id.

I would use the **`Array.prototype.reduce()`** method, which is the standard, clean way to transform an array into a single object.

```javascript
const data = [{ id: 'a', value: 10 }, { id: 'b', value: 20 }];

const keyedObject = data.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// keyedObject will be: { a: { id: 'a', value: 10 }, b: { id: 'b', value: 20 } }
```

-----

## 14\. Deep clone a large object safely without `JSON.parse(JSON.stringify())`.

The `JSON` methods are unsafe because they fail on circular references and lose data types like `Date`, `Map`, `Set`, and function definitions. I would use the modern **`structuredClone()`** API, or a library like Lodash's `cloneDeep` for maximum compatibility.

```javascript
function deepCloneSafe(obj) {
  // structuredClone is the modern, built-in, and safest choice.
  // It handles cyclical references and many built-in types (Date, RegExp, Map, Set, ArrayBuffer).
  try {
    return structuredClone(obj);
  } catch (e) {
    console.error("structuredClone failed, falling back to JSON serialization:", e);
    // Fallback or use a library
    return JSON.parse(JSON.stringify(obj));
  }
}
```

-----

## 15\. You have to compare two JSON objects and return only changed keys.

I would use a **recursive function** to deep-compare the two objects and gather keys where the values differ.

```javascript
function getChangedKeys(oldObj, newObj, prefix = '') {
  let changes = {};

  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const oldVal = oldObj[key];
    const newVal = newObj[key];
    const currentKey = prefix ? `${prefix}.${key}` : key;

    // Check for deep object comparison
    if (typeof oldVal === 'object' && oldVal !== null &&
        typeof newVal === 'object' && newVal !== null) {
      
      const nestedChanges = getChangedKeys(oldVal, newVal, currentKey);
      changes = { ...changes, ...nestedChanges };

    } else if (oldVal !== newVal) {
      // Key is new, removed, or value changed (primitive check)
      changes[currentKey] = { oldValue: oldVal, newValue: newVal };
    }
  }

  return changes;
}
```

-----

## 16\. Merge two deeply nested config objects with conflict rules.

I would use a **recursive merge function** that handles deep nesting and allows for explicit conflict rules (e.g., preference for the second object).

```javascript
function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      // Rule: If both are objects, recurse.
      if (typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue) &&
          typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
        
        // Prefer source's properties in the merge
        target[key] = deepMerge(targetValue, sourceValue); 
      } else {
        // Rule: For arrays or primitives, the source value wins.
        target[key] = sourceValue;
      }
    }
  }
  return target;
}

// Note: Requires cloning the target object first if mutation of the original is undesirable.
```

-----

## 17\. You have a huge array (200k items). How do you process it without blocking UI?

Processing such a large array synchronously will cause the main thread to freeze. I would implement a **chunking mechanism** using **`setTimeout`** or **`requestIdleCallback`** (browser API) to break the work into small batches and yield control back to the Event Loop/UI thread after each batch.

```javascript
function processChunked(array, processItem, chunkSize = 1000) {
  let index = 0;

  function processNextChunk() {
    const startTime = performance.now();
    let endIndex = Math.min(index + chunkSize, array.length);
    
    for (let i = index; i < endIndex; i++) {
      processItem(array[i], i);
    }
    
    index = endIndex;

    if (index < array.length) {
      // Yield control back to the browser to prevent blocking
      // Use requestIdleCallback for lower priority tasks, setTimeout for guaranteed timing.
      setTimeout(processNextChunk, 0); 
    } else {
      console.log('Finished processing huge array.');
    }
  }

  processNextChunk();
}
```

-----

## 18\. You need to group data by category (similar to SQL GROUP BY).

I would use the **`Array.prototype.reduce()`** method to iterate through the array and build an accumulator object where keys are the grouping criteria.

```javascript
const transactions = [
  { category: 'Food', amount: 50 },
  { category: 'Travel', amount: 200 },
  { category: 'Food', amount: 30 }
];

const groupedData = transactions.reduce((acc, transaction) => {
  const key = transaction.category;
  
  if (!acc[key]) {
    acc[key] = []; // Initialize array if key doesn't exist
  }
  
  acc[key].push(transaction);
  return acc;
}, {});

/*
Result: 
{
  "Food": [{ category: 'Food', amount: 50 }, { category: 'Food', amount: 30 }],
  "Travel": [{ category: 'Travel', amount: 200 }]
}
*/
```

-----

## 19\. Extract only specific keys from an object dynamically.

I would use the **`Array.prototype.reduce()`** method or **`Object.fromEntries()`** combined with `map` to iterate over the desired keys array and reconstruct a new object.

```javascript
const user = { name: 'Alice', age: 30, city: 'NY', email: 'a@a.com' };
const keysToExtract = ['name', 'email'];

// Using reduce (Traditional)
const extractedDataReduce = keysToExtract.reduce((acc, key) => {
  if (user.hasOwnProperty(key)) {
    acc[key] = user[key];
  }
  return acc;
}, {});

// Using Object.fromEntries (Modern)
const extractedDataEntries = Object.fromEntries(
  keysToExtract.map(key => [key, user[key]])
);

// Result: { name: 'Alice', email: 'a@a.com' }
```

-----

## 20\. Transform a JSON response into a tree structure.

This typically involves processing a flat array where each item has an ID and a `parentId`. I would first create a map of all items keyed by ID for quick lookups, then iterate to build the hierarchy.

```javascript
function arrayToTree(flatArray, rootParentId = null) {
  // 1. Map items by their ID for O(1) lookup
  const map = new Map();
  flatArray.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  const tree = [];

  // 2. Build the tree
  for (const item of map.values()) {
    if (item.parentId === rootParentId) {
      // It's a root node
      tree.push(item);
    } else {
      // Find the parent and attach the current item as a child
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(item);
      }
    }
  }
  return tree;
}

/*
// Example Input: [{ id: 1, parentId: null }, { id: 2, parentId: 1 }, { id: 3, parentId: 1 }]
// Example Output: [{ id: 1, parentId: null, children: [{ id: 2, ... }, { id: 3, ... }] }]
*/
```

## C. Architecture & Design Patterns

-----

## 21\. You need to build a plugin system where external functions hook into your code. How would you architect it?

I'd architect a plugin system using an **Event Emitter** pattern combined with a **Registration mechanism**. This allows plugins to register their functionality at specific execution points (hooks) within the core logic without modifying the core code itself.

1.  **Core Object/Emitter:** The main application class acts as an **Event Emitter** or holds an internal list of hooks.
2.  **`registerPlugin` Method:** This public method accepts a plugin object.
3.  **Hooks:** The core code defines specific **events** (`'onBeforeLoad'`, `'onDataProcessed'`, `'onAfterRender'`) where plugins can attach their logic.
4.  **Execution:** The core logic uses a central method (e.g., `executeHook('onBeforeLoad', data)`) which iterates through all registered plugin handlers for that specific hook and executes them sequentially.

<!-- end list -->

```javascript
class PluginSystem {
  constructor() {
    this.hooks = {};
  }

  // 1. Core provides a method for plugins to attach handlers
  on(hookName, callback) {
    if (!this.hooks[hookName]) {
      this.hooks[hookName] = [];
    }
    this.hooks[hookName].push(callback);
  }

  // 2. Core calls the hooks at designated execution points
  async execute(hookName, data) {
    if (this.hooks[hookName]) {
      let currentData = data;
      for (const callback of this.hooks[hookName]) {
        // Plugins can modify data before passing it to the next handler
        currentData = await callback(currentData); 
      }
      return currentData;
    }
    return data;
  }
}
// Plugin registration: system.on('onDataProcessed', (data) => data.toUpperCase());
```

-----

## 22\. Build a simple Pub/Sub system from scratch.

A simple **Pub/Sub (Publish-Subscribe)** system requires a central broker object (`EventBroker`) to manage subscriptions and message broadcasting.

```javascript
class EventBroker {
  constructor() {
    this.subscribers = {}; // Stores topic name -> [list of handlers]
  }

  // 1. Allow components to listen to a topic
  subscribe(topic, handler) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(handler);
    
    // Return an unsubscribe function
    return () => {
      this.subscribers[topic] = this.subscribers[topic].filter(cb => cb !== handler);
    };
  }

  // 2. Allow components to broadcast a message to a topic
  publish(topic, data) {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach(handler => {
        handler(data);
      });
    }
  }
}

// const broker = new EventBroker();
// const unsubscribe = broker.subscribe('USER_LOGIN', (data) => console.log('Welcome:', data.username));
// broker.publish('USER_LOGIN', { username: 'alice' });
// unsubscribe();
```

-----

## 23\. Implement the Observer pattern for real-time UI updates.

The Observer pattern is ideal for managing state that needs to be reflected across multiple UI components.

1.  **Subject (State):** The observable object that holds the data and methods to add/remove observers.
2.  **Observer:** Components that subscribe to the subject.
3.  **`notify` Method:** Called when the subject's state changes, iterating through all observers and triggering their update method.

<!-- end list -->

```javascript
class ObservableState {
  constructor(initialValue) {
    this.value = initialValue;
    this.observers = [];
  }

  // Adds an observer (a function)
  subscribe(observer) {
    this.observers.push(observer);
    observer(this.value); // Run immediately with current value
  }

  // Updates the state and notifies
  setValue(newValue) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.notify(newValue);
    }
  }

  notify(value) {
    this.observers.forEach(observer => observer(value));
  }
}

// const counterState = new ObservableState(0);
// const uiComponent = (count) => { document.getElementById('count').textContent = count; };
// counterState.subscribe(uiComponent);
// counterState.setValue(1); // UI updates automatically
```

-----

## 24\. Implement a feature flag system in pure JS.

A feature flag system allows features to be enabled or disabled dynamically without deploying new code. I'd use a simple global object or a closure to manage the flags.

```javascript
// FeatureFlagManager.js
const featureFlags = {
  'NEW_CHECKOUT_FLOW': false,
  'ASYNC_IMAGE_LOADING': true,
  'BETA_DASHBOARD': false
};

const FeatureFlagManager = (function() {
  // Can load feature flags from an API or environment variable here

  return {
    // 1. Check if a feature is enabled
    isEnabled: (flagName) => {
      return featureFlags[flagName] === true;
    },

    // 2. Override for testing/local development (optional)
    setFlag: (flagName, value) => {
      featureFlags[flagName] = value;
    }
  };
})();

// Usage:
// if (FeatureFlagManager.isEnabled('NEW_CHECKOUT_FLOW')) {
//   // Render new component
// } else {
//   // Render old component
// }
```

-----

## 25\. How do you build a caching layer for repeated API calls?

I'd use a **Map** or a plain JavaScript object as an in-memory store, checking for a cached response before making a new `fetch` request.

```javascript
const apiCache = new Map(); // Key: URL + JSON.stringify(options), Value: { timestamp, data }
const CACHE_LIFETIME = 60000; // 60 seconds

async function fetchWithCache(url, options = {}) {
  const cacheKey = JSON.stringify({ url, options });
  const cached = apiCache.get(cacheKey);
  const now = Date.now();

  // 1. Check if cached data exists and is still valid
  if (cached && (now - cached.timestamp < CACHE_LIFETIME)) {
    console.log(`Cache hit for ${url}`);
    return cached.data;
  }

  // 2. Fetch new data
  console.log(`Cache miss for ${url}. Fetching...`);
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Fetch failed');

  const data = await response.json();

  // 3. Update cache
  apiCache.set(cacheKey, {
    timestamp: now,
    data: data
  });

  return data;
}
```

-----

## 26\. Implement a request-level LRU cache.

An **LRU (Least Recently Used)** cache is ideal for requests because it automatically discards the least-used item when the cache reaches its capacity limit. This is best implemented using a **`Map`** (for quick lookup) combined with a **Doubly Linked List** logic (natively implemented by the Map's insertion order in modern JS) or simply relying on Map's key insertion order for LRU approximation.

```javascript
class LruCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Stores key-value pairs
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const value = this.cache.get(key);
    
    // 1. Mark as recently used: delete and re-insert key
    this.cache.delete(key);
    this.cache.set(key, value); 
    
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } 
    
    // 2. Eviction: Remove the oldest item (first key in the Map) if capacity is exceeded
    if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, value);
  }
}
```

-----

## 27\. How do you create a middleware pipeline similar to Express?

I'd build a pipeline where each middleware function takes the current state (`req`, `res`) and a `next()` function, which is responsible for moving to the next handler in the sequence.

```javascript
class Pipeline {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  // Entry point to execute the pipeline
  execute(req, res, finalHandler) {
    let index = -1;

    // The 'next' function recursively calls the next middleware
    const next = () => {
      index++;
      if (index < this.middlewares.length) {
        this.middlewares[index](req, res, next);
      } else if (finalHandler) {
        // Run the final route handler if no middleware ended the response
        finalHandler(req, res);
      }
    };

    next();
  }
}

// Example Middleware:
// pipeline.use((req, res, next) => { console.log('Log 1'); next(); });
// pipeline.execute(request, response, finalRoute);
```

-----

## 28\. Implement a state manager without using Redux.

I'd implement a simple, centralized state manager using the **Observable Pattern** (Q23) to manage state immutably and notify subscribers of changes.

```javascript
const Store = {
  state: {
    user: null,
    loading: false
  },
  subscribers: [],

  // Getter
  getState() {
    return this.state;
  },

  // State update method (action dispatcher)
  dispatch(action) {
    this.state = this._reducer(this.state, action);
    this._notifySubscribers();
  },

  // Subscriber method (Observable pattern)
  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.state); // Initial call
  },
  
  _notifySubscribers() {
    // Notify all listeners with the new state
    this.subscribers.forEach(callback => callback(this.state));
  },
  
  // Simple Reducer logic
  _reducer(state, action) {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      default:
        return state;
    }
  }
};

// Usage: Store.subscribe(newState => { /* update UI */ });
// Store.dispatch({ type: 'SET_USER', payload: { name: 'Bob' } });
```

-----

## 29\. Build a global event bus for a microfrontend system.

For a Microfrontend (MFE) system, the global event bus must communicate across isolated modules. I'd use the **Pub/Sub pattern** (Q22), and for truly global, cross-origin communication, leverage the **Browser's `CustomEvent` API** or the **`BroadcastChannel` API**.

```javascript
// Using BroadcastChannel for cross-tab/cross-origin MFE communication
class GlobalEventBus {
  constructor(channelName = 'mfe-global-bus') {
    // BroadcastChannel allows communication between different browser contexts
    this.channel = new BroadcastChannel(channelName); 
    this.listeners = new Map();
    
    this.channel.onmessage = this._handleIncomingMessage.bind(this);
  }

  _handleIncomingMessage(event) {
    const { topic, data } = event.data;
    if (this.listeners.has(topic)) {
      this.listeners.get(topic).forEach(handler => handler(data));
    }
  }

  publish(topic, data) {
    this.channel.postMessage({ topic, data });
  }

  subscribe(topic, handler) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, []);
    }
    this.listeners.get(topic).push(handler);
    // Note: Returning an unsubscribe function is more complex here but possible.
  }
}

// Usage in MFE 1: const bus = new GlobalEventBus(); bus.publish('NAVIGATE', '/profile');
// Usage in MFE 2: bus.subscribe('NAVIGATE', (path) => router.go(path));
```

-----

## 30\. Implement a module loader similar to RequireJS.

A basic module loader simulates the synchronous loading pattern of CommonJS (`require`). It requires a central cache to prevent redundant loading and uses a `Function` constructor or `eval` to run the module code with controlled scope.

```javascript
const moduleCache = {};

function define(name, dependencies, factory) {
  // 1. Resolve dependencies recursively
  const resolvedDeps = dependencies.map(depName => require(depName));

  // 2. Execute the module factory function
  const exports = factory(...resolvedDeps);

  // 3. Cache the module export
  moduleCache[name] = exports;
}

function require(moduleName) {
  if (moduleCache[moduleName]) {
    return moduleCache[moduleName];
  }
  
  // In a real loader, you'd fetch the module file here and run 'define'
  throw new Error(`Module ${moduleName} not found or not defined.`);
}

// Example usage:
// define('util', [], () => ({ add: (a, b) => a + b }));
// define('app', ['util'], (util) => { console.log(util.add(1, 2)); });
// require('app'); // Loads 'util' first, then 'app'
```

-----

## D. Error Handling & Logging

-----

## 31\. API returns partial data and UI should render only valid fields. How to design safe access handling?

I would implement **defensive coding** using the **Optional Chaining (`?.`)** and **Nullish Coalescing (`??`)** operators to provide safe defaults and prevent runtime errors when accessing potentially missing or `null` nested properties.

```javascript
const apiData = {
  user: {
    profile: null, // profile is null
    settings: { theme: 'dark' }
  },
  posts: []
};

// 1. Optional Chaining for deep properties
const theme = apiData.user?.settings?.theme; // 'dark'
const bio = apiData.user?.profile?.bio; // undefined (no error thrown)

// 2. Nullish Coalescing for safe defaults
const postCount = apiData.posts?.length ?? 0; // 0, not undefined or null
const username = apiData.user?.profile?.name ?? 'Guest User'; // 'Guest User'

// Render logic:
if (apiData.user?.settings) {
  // Render settings UI
}
```

-----

## 32\. Implement a central error handler for async functions.

A central handler should wrap the async function to automatically catch errors and log/report them, eliminating the need for repetitive `try...catch` blocks in every single async function.

```javascript
function withErrorHandler(asyncFn) {
  return async function(...args) {
    try {
      return await asyncFn(...args);
    } catch (error) {
      // 1. Centralized logging/reporting (e.g., Sentry, internal logs)
      console.error('Async operation failed:', error.message, {
        function: asyncFn.name,
        arguments: args
      });
      
      // 2. Can trigger a non-blocking UI notification here
      // 3. Re-throw the error if necessary for local handling or Promise rejection
      throw error; 
    }
  };
}

// Usage:
// const fetchUser = withErrorHandler(async (id) => { /* fetch logic */ });
// fetchUser(123); // Error is handled centrally
```

-----

## 33\. Log user actions but throttle logs to avoid overload.

I would use the **Throttle function** (Q40) to limit the frequency of the logging mechanism itself, ensuring that even if a user triggers many micro-actions, the log file or API endpoint only receives updates periodically.

```javascript
// Assume this is the API/File logging function
const sendLogsToApi = (logs) => {
  // POST logs array to /api/log
  console.log('Sending logs batch:', logs.length);
};

// Use throttle to limit API calls to max once every 5 seconds
const throttledLogSender = throttle(sendLogsToApi, 5000);

let logQueue = [];

function logUserAction(actionDetails) {
  logQueue.push({ timestamp: Date.now(), ...actionDetails });
  
  // Call the throttled function, which will fire the logging API 
  // only after the throttle period has passed.
  throttledLogSender(logQueue); 
}

// The throttle implementation from Q40/Q9:
// function throttle(func, limit) { /* ... implementation ... */ }
```

-----

## 34\. Wrap untrusted code in a safe sandbox using try/catch.

The simplest form of sandboxing is using a **synchronous `try...catch` block** to execute the untrusted code and gracefully handle any synchronous errors (syntax errors, runtime exceptions) it throws.

```javascript
function runInSandbox(codeString) {
  let result = null;
  let error = null;

  try {
    // Use Function constructor to execute code safely without access to the outer scope's local variables
    // Note: It still has access to the global window/global scope.
    const untrustedFunc = new Function(codeString);
    result = untrustedFunc();

  } catch (e) {
    error = e;
    console.error('Untrusted code failed:', e.message);
  }

  return { result, error };
}

// Example usage:
// runInSandbox('return 1 + 1'); // { result: 2, error: null }
// runInSandbox('throw new Error("Oops!")'); // { result: null, error: Error object }
```

-----

## 35\. How to detect memory leaks in a long-running JS app?

Memory leaks are typically detected by monitoring and comparing heap usage over time and identifying unintended object retention.

1.  **Heap Snapshots (Chrome DevTools):** The primary method. Take a snapshot of the memory heap *before* a high-risk action (e.g., opening a modal) and *after* closing it. If the number of objects created by the action (e.g., the modal component) does not return to the baseline, there is a leak.
2.  **Timeline Recording:** Use the Performance Monitor in DevTools to record usage over time while the user performs repetitive actions. A memory profile that shows a **continuously increasing, saw-toothed baseline** is a strong indicator of a leak.
3.  **WeakMap/WeakSet:** Use these structures to hold references to objects that should be garbage collected. If the objects remain accessible via other means, the leak is confirmed.

-----

## 36\. Implement a global error boundary like React's, but in vanilla JS.

A global error boundary captures synchronous rendering errors in a component tree and displays a fallback UI instead of crashing the application. In vanilla JS, this is achieved by using a **global `window.onerror` handler** and controlling the UI presentation.

```javascript
function setupErrorBoundary() {
  const rootElement = document.getElementById('app-root');
  
  // Fallback UI to show on error
  const renderFallback = (error) => {
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #fee; border: 1px solid #f00;">
        <h1>Application Error</h1>
        <p>Something went wrong. Please try refreshing.</p>
        <pre>${error.message}</pre>
      </div>
    `;
  };

  // 1. Capture synchronous runtime errors
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error Boundary caught:', error);
    renderFallback(error || new Error(message));
    return true; // Return true to prevent the browser's default error handling
  };
  
  // 2. Capture unhandled Promise rejections (Q37)
  window.onunhandledrejection = function(event) {
    console.error('Unhandled Promise Rejection caught:', event.reason);
    renderFallback(event.reason);
  };
}
```

-----

## 37\. You need to capture all unhandled Promise rejections. How?

I would use the **`window.onunhandledrejection`** event listener, which is specifically designed to capture Promise rejections that have not been handled by a `.catch()` block.

```javascript
window.onunhandledrejection = (event) => {
  // The 'event.reason' property contains the reason (error object) for the rejection.
  const reason = event.reason;
  
  console.error('Unhandled Promise Rejection detected:', reason);
  
  // 1. Send the error to a centralized logging service immediately
  // logService.report(reason);

  // Optional: Prevent the default browser console error output (usually not recommended)
  // event.preventDefault(); 
};
```

-----

## E. Performance Optimization

-----

## 38\. You have a huge table (50,000 rows). How do you render efficiently? (Virtualization)

I would use **UI Virtualization** (or windowing). Instead of rendering all 50,000 rows into the DOM, I would only render the small subset of rows (e.g., 20-50 rows) that are currently visible within the user's viewport.

1.  **Calculate Visible Range:** Use the scroll position, viewport height, and fixed row height to calculate the start index and end index of the visible rows.
2.  **Dynamic Rendering:** Only iterate through the data array from the start index to the end index to render the visible DOM elements.
3.  **Spacing Element:** Place a large, hidden element (or use CSS padding) above the visible rows to ensure the scrollbar size reflects the total height of all 50,000 rows, allowing the user to scroll normally.

-----

## 39\. A CPU-heavy JS function blocks UI. How do you offload it? (Web Workers)

The only way to execute a CPU-heavy task without blocking the main (UI) thread is by running it in a **Web Worker**.

1.  **Create Worker:** Instantiate a `Worker` object pointing to a separate JS file.
2.  **Send Data:** Use `worker.postMessage(data)` to send input data to the worker thread.
3.  **Process:** The worker executes the synchronous, CPU-intensive function in the background.
4.  **Receive Result:** The worker sends the result back to the main thread using its own `postMessage(result)`.
5.  **Main Thread Listener:** The main thread listens for the result using `worker.onmessage`.

<!-- end list -->

```javascript
// Main Thread Logic
const worker = new Worker('worker.js');

worker.onmessage = function(e) {
  console.log('Result from worker:', e.data);
  // Re-enable UI, update component state
};

// Start the heavy calculation
worker.postMessage({ largeArray: [/* 1M items */] }); 

// The UI remains responsive while this runs
```

-----

## 40\. Minimize reflows while updating DOM repeatedly.

To minimize expensive **Reflows (Layouts)**, I would apply two main techniques:

1.  **Batch DOM Reads and Writes:** Use the **FastDOM pattern** (Q42). Read all necessary layout properties (e.g., `offsetWidth`, `scrollLeft`) first, then execute all DOM writes (e.g., `element.style.width = '10px'`).
2.  **Use DocumentFragment:** When adding multiple elements, create them off-screen using a **`DocumentFragment`** and append the fragment to the DOM in a single operation (one Reflow).
3.  **CSS Optimization:** Use CSS properties that only trigger **Repaints (Paints)** or **Compositing** instead of Reflows (e.g., `transform`, `opacity`, `filter`). For major updates, temporarily apply `content-visibility: hidden` to the container.

-----

## 41\. Implement caching for expensive function calls (memoization).

**Memoization** caches the results of a pure function based on its input arguments, returning the cached result if the same arguments are used again.

```javascript
function memoize(func) {
  const cache = new Map();

  return function(...args) {
    // 1. Create a unique key from arguments (JSON.stringify works for simple args)
    const key = JSON.stringify(args); 

    // 2. Check cache
    if (cache.has(key)) {
      console.log('Cache hit for key:', key);
      return cache.get(key);
    }

    // 3. Compute result and update cache
    console.log('Cache miss. Computing...');
    const result = func.apply(this, args);
    cache.set(key, result);

    return result;
  };
}

// Example usage:
// const memoizedHeavyFunction = memoize(heavyFunction);
// memoizedHeavyFunction(5); // computes and caches
// memoizedHeavyFunction(5); // returns cached result
```

-----

## 42\. How do you avoid layout thrashing?

**Layout thrashing** (Q103) occurs when the code rapidly alternates between reading computed styles/geometry and writing styles to the DOM, forcing synchronous, expensive Reflows.

The solution is to **separate DOM reads from DOM writes** (The FastDOM strategy):

```javascript
function avoidLayoutThrashing() {
  const elements = Array.from(document.querySelectorAll('.item'));
  
  // 1. BATCH ALL READS
  const readData = elements.map(el => ({
    element: el,
    currentWidth: el.offsetWidth, // Forces a synchronous layout if a write happened before
  }));

  // 2. BATCH ALL WRITES
  readData.forEach(item => {
    // Perform calculation based on the stable read data
    const newWidth = item.currentWidth * 1.1; 
    
    // Perform the DOM write
    item.element.style.width = `${newWidth}px`;
  });
}
// Crucially, never interleave a read (offsetWidth) with a write (style.width) inside a loop.
```

-----

## 43\. How do you split a large function into microtasks?

While `setTimeout(fn, 0)` breaks a function into Macrotasks (Q84), splitting into **Microtasks** is primarily done using **Promise resolution** or the newer **`queueMicrotask()`** API. This allows the split parts to run immediately after the current script finishes, but before the browser performs rendering or processes the next macrotask.

```javascript
function processLargeDataAsMicrotasks(data) {
  let index = 0;
  
  function processNext() {
    if (index < data.length) {
      // Process a small chunk
      const chunk = data.slice(index, index + 100);
      chunk.forEach(item => {
        // ... heavy synchronous work on item
      });
      index += 100;

      // Queue the next chunk as a microtask
      queueMicrotask(processNext);
    } else {
      console.log('Microtask processing complete.');
    }
  }

  processNext();
}
```

-----

## 44\. You need to detect slow scripts and warn developers. How?

I would use the **User Timing API (`performance.mark()`, `performance.measure()`)** to instrument key function calls and track their execution time.

```javascript
function trackExecutionTime(fn, fnName) {
  return function(...args) {
    const startMark = `start-${fnName}`;
    const endMark = `end-${fnName}`;
    
    performance.mark(startMark);
    const result = fn.apply(this, args);
    performance.mark(endMark);
    
    // Create a measurement between the two marks
    performance.measure(fnName, startMark, endMark);

    // Get the duration
    const measurement = performance.getEntriesByName(fnName).pop();
    const duration = measurement.duration;
    
    // Alert threshold (e.g., 50ms)
    if (duration > 50) {
      console.warn(`[PERF WARNING] ${fnName} took ${duration.toFixed(2)}ms!`);
      // Can report this to a monitoring service
    }

    return result;
  };
}

// const slowFunction = trackExecutionTime(myHeavyFunction, 'heavyDOMUpdate');
```

-----

## 45\. Implement lazy loading for large images.

I would use the **`IntersectionObserver` API** to efficiently detect when an image element scrolls into the user's viewport, triggering its load only at that point.

1.  **HTML Setup:** Use a placeholder (e.g., small, inline image or empty URI) and store the real source in a custom attribute (`data-src`).
    ```html
    <img data-src="large-image.jpg" src="placeholder.png" class="lazy">
    ```
2.  **Observer Setup:**
    ```javascript
    const lazyImages = document.querySelectorAll('.lazy');

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // 1. Swap the source from data-src
          img.src = img.dataset.src; 
          img.removeAttribute('data-src');

          // 2. Stop observing this image once it's loaded
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));
    ```

-----

## F. Security & Best Practices

-----

## 46\. Prevent user from injecting JS via form inputs.

This is primarily a **server-side concern**, known as preventing **Cross-Site Scripting (XSS)**. However, client-side hardening is also good practice.

1.  **Server-Side Sanitization (CRITICAL):** Before saving user input to the database or rendering it back to another user, sanitize all input (escaping HTML, removing tags like `<script>`, `onerror`, etc.).
2.  **Content Security Policy (CSP):** Use the HTTP response header `Content-Security-Policy` to restrict the sources from which executable scripts can be loaded, blocking malicious external scripts.
3.  **Client-Side Escape:** When outputting user input to the DOM, always use browser APIs that automatically escape content (e.g., setting `textContent` instead of `innerHTML`).

-----

## 47\. You must store JWT securely. `localStorage` or cookies? Why?

**Cookies (specifically `HttpOnly` cookies)** are the most secure way to store a **JWT access token**.

| Feature | `localStorage` | `HttpOnly` Cookies |
| :--- | :--- | :--- |
| **Security Risk** | Vulnerable to **Cross-Site Scripting (XSS)**. Any malicious script running on the page can access and steal the token (`localStorage.getItem('jwt')`). | **Immune to XSS** because JavaScript cannot access the cookie. |
| **Sending Token** | Must be manually attached to every request via JS. | Automatically sent with every request to the appropriate domain by the browser. |
| **CSRF Risk** | Low (if the token is manually handled). | Vulnerable to **CSRF** unless **`SameSite=Lax/Strict`** is set (Q48). |

**Conclusion:** Use **`HttpOnly` cookies** for the access token, often combined with a short expiration time and refreshing mechanisms, as they isolate the token from client-side JS.

-----

## 48\. Implement CSRF protection with SameSite cookies.

**Cross-Site Request Forgery (CSRF)** protection prevents an attacker from tricking a user's browser into executing unwanted actions on an authenticated site.

1.  **SameSite Cookie Attribute (Primary Defense):** Set the `SameSite` attribute on the session cookie (or JWT cookie) to **`Lax`** (default for modern browsers) or **`Strict`**.

      * `SameSite=Strict`: Prevents the browser from sending the cookie with *any* cross-site request (even a top-level GET request).
      * `SameSite=Lax`: Prevents cookies from being sent on most cross-site requests, but allows them for top-level GET navigations (user clicking a link).

2.  **Anti-CSRF Tokens (Secondary Defense):** For complex or critical endpoints, the server generates a random token and:

      * Includes it in a cookie (readable by JS).
      * Embeds it in the HTML form/request body.
      * The server verifies the token in the cookie matches the token in the body/header for all state-changing requests.

-----

## 49\. Sanitize dynamic HTML before inserting into DOM.

Never use `innerHTML` directly with user-provided or third-party HTML, as it introduces XSS vulnerabilities. You must **sanitize** the HTML by stripping out malicious tags and attributes.

I would use a specialized library designed for this purpose, like **DOMPurify**, which is battle-tested and secure.

```javascript
// Install: npm install dompurify
// In browser: import DOMPurify from 'dompurify';

const userInput = '<img src=x onerror="alert(\'Hacked\')">Hello<script>evil()</script>';

// 1. Sanitization
const cleanHtml = DOMPurify.sanitize(userInput, { 
    // Configuration options (e.g., allowing specific tags)
}); 

// 2. Safe insertion
document.getElementById('content').innerHTML = cleanHtml;
// cleanHtml result: <img>Hello
```

-----

## 50\. Remove sensitive data before logging objects.

Before sending any object (like a request body, user profile, or error payload) to a centralized logging service, I would recursively iterate through the object and redact any key known to contain sensitive information.

```javascript
const SENSITIVE_KEYS = ['password', 'token', 'jwt', 'ccNumber', 'socialSecurity', 'pin'];

function redactSensitiveData(obj) {
  // Create a deep clone to avoid modifying the original object
  const cleanedObj = structuredClone(obj); 

  const traverse = (current) => {
    if (typeof current !== 'object' || current === null) {
      return;
    }
    
    for (const key in current) {
      if (!current.hasOwnProperty(key)) continue;

      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        current[key] = '[REDACTED]';
      } else if (typeof current[key] === 'object' && current[key] !== null) {
        // Recurse into nested objects
        traverse(current[key]);
      }
    }
  };
  
  traverse(cleanedObj);
  return cleanedObj;
}

// const logPayload = redactSensitiveData(userProfile);
// logService.send(logPayload);
```

-----

## G. DOM + Browser Scenarios

-----

## 51\. Implement a custom event in the browser and dispatch it.

I would use the **`CustomEvent`** constructor to create the event and the **`dispatchEvent()`** method on a target element (or `window`) to fire it.

```javascript
// 1. Define the event name
const EVENT_NAME = 'user:profileUpdate';

// 2. Create the CustomEvent instance
// The 'detail' property is used to pass arbitrary data
const profileEvent = new CustomEvent(EVENT_NAME, {
  bubbles: true, // Allows event to bubble up the DOM tree
  cancelable: true,
  detail: { 
    userId: 42,
    newStatus: 'Active'
  }
});

const targetElement = document.getElementById('user-dashboard');

// 3. Listen for the custom event
targetElement.addEventListener(EVENT_NAME, (e) => {
  console.log('Profile update received:', e.detail);
});

// 4. Dispatch the event
targetElement.dispatchEvent(profileEvent);
```

-----

## 52\. Implement drag and drop without libraries.

I would use the native HTML Drag and Drop API, primarily relying on three event types:

1.  **`draggable="true"`:** Set on the element to be dragged.
2.  **`dragstart`:** On the draggable element. Stores the ID/data of the dragged item using `event.dataTransfer.setData()`.
3.  **`dragover`:** On the drop target. **Crucially, call `event.preventDefault()`** to make the element a valid drop target.
4.  **`drop`:** On the drop target. Retrieves the data using `event.dataTransfer.getData()` and manipulates the DOM to move the element.

<!-- end list -->

```javascript
// On Drag Source
// element.addEventListener('dragstart', (e) => {
//   e.dataTransfer.setData('text/plain', e.target.id);
//   setTimeout(() => e.target.classList.add('dragging'), 0);
// });

// On Drop Target
// target.addEventListener('dragover', (e) => e.preventDefault()); // MUST prevent default
// target.addEventListener('drop', (e) => {
//   e.preventDefault();
//   const data = e.dataTransfer.getData('text/plain');
//   const draggedElement = document.getElementById(data);
//   e.currentTarget.appendChild(draggedElement);
// });
```

-----

## 53\. You need to track scroll depth for analytics.

I would track the scroll depth using two events: the **`scroll` event** (throttled) and the **`load` event** (for initial height).

1.  **Calculate Max Depth:** Determine the document's total height and set a variable for the maximum scroll position reached so far.
2.  **Throttled Scroll:** Use a throttled handler (Q9) to check the current `window.scrollY`.
3.  **Update Max:** If the current scroll position is greater than the recorded maximum, update the maximum and log the new depth (e.g., in 25% increments).

<!-- end list -->

```javascript
let maxScrollY = 0;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;

const trackScrollDepth = () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > maxScrollY) {
    maxScrollY = currentScrollY;
    const depthPercent = Math.round((maxScrollY / docHeight) * 100);
    
    if (depthPercent >= 25 && depthPercent % 25 === 0) {
      console.log(`Scroll depth reached: ${depthPercent}%`);
      // sendAnalytics(depthPercent);
    }
  }
};

// window.addEventListener('scroll', throttle(trackScrollDepth, 100));
```

-----

## 54\. Create a modal that traps focus inside for accessibility.

Trapping focus (often called a **focus trap**) is essential for accessibility (WCAG). It ensures that when a modal is open, tabbing cannot lead to elements outside the modal.

1.  **Identify Boundary:** Determine the first focusable element (A) and the last focusable element (Z) inside the modal.
2.  **Event Listener:** Listen for the **`keydown`** event on the modal when open.
3.  **Trap Logic:** If the key pressed is **Tab**:
      * If focus is on Z and the user presses Tab, move focus back to A.
      * If focus is on A and the user presses Shift + Tab, move focus back to Z.
4.  **Initial Focus:** When the modal opens, set focus to the first interactive element or the modal container itself.

-----

## 55\. You must handle file uploads using JavaScript only.

I would use the **`fetch` API** with a **`FormData`** object to construct the request body, which correctly handles multipart file data.

```javascript
async function uploadFile(fileInputId) {
  const fileInput = document.getElementById(fileInputId);
  const file = fileInput.files[0];

  if (!file) {
    console.error('Please select a file.');
    return;
  }

  // 1. Create a FormData container
  const formData = new FormData();
  // 2. Append the file with its field name ('file' in this case)
  formData.append('file', file); 
  // 3. Append other data if necessary
  formData.append('userId', 123); 

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      // The 'Content-Type' header is usually omitted; fetch/browser sets the boundary automatically for FormData
      body: formData 
    });
    
    if (!response.ok) throw new Error('Upload failed');
    const result = await response.json();
    console.log('Upload successful:', result);
    
  } catch (error) {
    console.error('Error during upload:', error);
  }
}
```

-----

## 56\. Build a real-time search filter without API calls.

For client-side filtering (e.g., a local list of items), I would listen to the **`input` event** on the search field and use an immediate update to hide/show list items. I'd debounce the actual filtering logic to improve performance (Q8).

```javascript
const items = Array.from(document.querySelectorAll('.item'));

function filterItems(query) {
  const lowerQuery = query.toLowerCase();
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    
    if (text.includes(lowerQuery)) {
      item.style.display = ''; // Show
    } else {
      item.style.display = 'none'; // Hide
    }
  });
}

// document.getElementById('search-input').addEventListener('input', (e) => {
//   // Use debouncing for efficiency on very large lists
//   filterItems(e.target.value); 
// });
```

-----

## 57\. Sticky header logic implementation.

The modern and most performant way to implement a sticky header is using **CSS `position: sticky`**. If client-side JS is required (e.g., to add a class when sticking starts), I would use the **`IntersectionObserver` API**.

### CSS Only Solution (Preferred):

```css
.header {
  position: sticky;
  top: 0; /* Tells the browser where to stick the element */
  z-index: 100; 
  background: white;
}
```

### JS Solution (Using IntersectionObserver):

1.  Place a small sentinel element **just before** the header.
2.  Observe the sentinel.
3.  When the sentinel element is no longer visible (`isIntersecting: false`), the header has scrolled off the screen, so you add the `sticky` class.
4.  When the sentinel reappears (`isIntersecting: true`), remove the `sticky` class.

-----

## 58\. Infinite scrolling implementation using `IntersectionObserver`.

**`IntersectionObserver`** provides an efficient, non-blocking way to detect when a load trigger element (the sentinel) enters the viewport, signaling that more data should be fetched.

1.  **Sentinel:** Place a hidden element (the "loading" element or "sentinel") at the bottom of the current content.
2.  **Observer:** Create an observer instance focused on the sentinel.
3.  **Callback:** The observer callback checks if the sentinel is visible (`entry.isIntersecting`).
4.  **Fetch Data:** If visible, call the `loadMoreData()` API function and then reposition the sentinel element or re-observe it.

<!-- end list -->

```javascript
const sentinel = document.getElementById('loading-sentinel');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(sentinel); // Stop observing temporarily
      console.log('Sentinel is visible. Fetching page...');
      // loadMoreData().finally(() => observer.observe(sentinel)); // Re-observe after load
    }
  });
}, {
  rootMargin: '0px 0px 100px 0px' // Start loading when 100px away from bottom
});

observer.observe(sentinel);
```

-----

## 59\. How to detect if an element is visible on screen?

I would use the **`IntersectionObserver` API** (Q58) as the modern, high-performance method, or for a simpler one-off check, **`Element.getBoundingClientRect()`**.

### 1\. `IntersectionObserver` (Asynchronous, Efficient)

The `isIntersecting` property of the `IntersectionObserverEntry` tells you if the element is currently visible within its root (usually the viewport).

### 2\. `getBoundingClientRect()` (Synchronous, Less Efficient)

This method returns the size of an element and its position relative to the viewport.

```javascript
function isVisible(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
```

-----

## 60\. Simulate a click event programmatically.

To simulate a click on an element, I would use the **`click()`** method, which is the shortest and most direct way to trigger the associated action.

If I needed to simulate the full lifecycle of a synthetic event for testing or specialized cases, I would use the **`MouseEvent` constructor** and **`dispatchEvent()`**.

### Direct Method (Preferred):

```javascript
document.getElementById('my-button').click();
```

### Synthetic Event Method (Full Lifecycle Simulation):

```javascript
const button = document.getElementById('my-button');

const clickEvent = new MouseEvent('click', {
  view: window,
  bubbles: true, // Key for simulating real events
  cancelable: true
});

button.dispatchEvent(clickEvent);
```

## H. Node.js + Backend JS Scenarios

-----

## 61\. You have to stream a large file (1GB) to the client. How?

In Node.js, handling large files efficiently is done by using **Streams**. Reading the entire 1GB file into memory (`fs.readFile`) would consume excessive RAM, potentially crashing the server.

1.  **Create a Read Stream:** Use `fs.createReadStream()` to open the file and read it in small, manageable chunks (e.g., 64KB).
2.  **Pipe to Response:** **Pipe** the read stream directly to the response object, which is a writable stream (`res`). This pushes data to the client chunk-by-chunk, minimizing memory footprint and reducing time-to-first-byte (TTFB).

<!-- end list -->

```javascript
const fs = require('fs');

function streamLargeFile(filePath, res) {
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('File Not Found');
  }
  
  // Set headers for streaming and content type
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Length': fs.statSync(filePath).size // Optional, but good practice
  });

  // Create readable stream and pipe it to the writable response stream
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
  
  // Handle stream errors (e.g., connection reset)
  readStream.on('error', (err) => {
    console.error('File stream error:', err);
    res.end('Server Error');
  });
}
```

-----

## 62\. Implement rate limiting using JavaScript (token bucket).

The **Token Bucket** algorithm is a common and effective way to implement rate limiting. It involves maintaining a bucket of tokens that represent request capacity.

1.  **State:** Use a `Map` to store the bucket state per user/IP (e.g., `lastRefillTime`, `tokens`).
2.  **Refill:** Before processing a request, calculate how many tokens should have been added since the last request based on a fixed rate.
3.  **Consume:** If enough tokens are available, consume one, update the state, and allow the request. Otherwise, reject the request with a 429 status code.

<!-- end list -->

```javascript
const userBuckets = new Map();
const RATE_PER_SECOND = 5; // Max 5 requests per second
const MAX_TOKENS = 5;

function isRateLimited(userId) {
  const now = Date.now();
  let bucket = userBuckets.get(userId) || { tokens: MAX_TOKENS, lastRefill: now };

  // 1. Refill Logic: Calculate elapsed time and add tokens
  const timeElapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(timeElapsed / 1000 * RATE_PER_SECOND);
  
  bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  // 2. Consume Logic: Check if tokens are available
  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    userBuckets.set(userId, bucket);
    return false; // Request allowed
  } else {
    userBuckets.set(userId, bucket); // Store updated bucket state
    return true; // Request denied
  }
}
```

-----

## 63\. Implement a file watcher from scratch using fs APIs.

I would use Node.js's native **`fs.watch`** or the higher-level **`fs.watchFile`** API. `fs.watch` uses OS-native mechanisms and is generally more efficient, while `fs.watchFile` is polling-based but more reliable for detecting changes across different systems.

```javascript
const fs = require('fs');

function watchFile(filePath) {
  try {
    // fs.watch is preferred for efficiency as it uses OS notifications
    const watcher = fs.watch(filePath, (eventType, filename) => {
      console.log(`File change detected: ${filename}`);
      console.log(`Event type: ${eventType}`);

      if (eventType === 'change') {
        // Reload configuration, restart service, or trigger compilation
        console.log('Reloading application resources...');
      } else if (eventType === 'rename') {
        // File may have been deleted or moved.
        console.warn('File renamed or deleted. Stopping watcher.');
        watcher.close();
      }
    });

    watcher.on('error', (err) => {
      console.error('Watcher error:', err);
    });

    console.log(`Watching file: ${filePath}`);

  } catch (err) {
    console.error(`Could not watch file ${filePath}: ${err.message}`);
  }
}

// watchFile('config.json');
```

-----

## 64\. Convert callback-based FS methods to Promises.

I would use Node.js's built-in **`util.promisify`** method, which is the official and simplest way to convert any function that follows the Node.js standard error-first callback convention (`(err, result) => ...`) into a Promise-returning function.

```javascript
const fs = require('fs');
const util = require('util');

// 1. Promisify the specific callback-based method (e.g., fs.readFile)
const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

// 2. Use the Promised function with async/await
async function copyFile(src, dest) {
  try {
    console.log(`Reading ${src}...`);
    // The Promise version handles errors via try/catch
    const data = await readFilePromise(src, 'utf8');
    
    console.log(`Writing to ${dest}...`);
    await writeFilePromise(dest, data, 'utf8');
    
    console.log('File copied successfully!');
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
}

// copyFile('input.txt', 'output.txt');
```

-----

## 65\. Implement your own version of Express's `next()` middleware flow.

This requires implementing a **Chain of Responsibility** pattern (Q27) where the `next` function recursively executes the next handler in the sequence.

```javascript
function createMiddlewareChain(middlewares) {
  // Return the main execution function
  return (req, res) => {
    let index = -1;

    // The 'next' function acts as the iterator
    const next = (err) => {
      if (err) {
        // Optional: Handle errors by jumping to an error handler middleware
        console.error('Middleware chain interrupted by error:', err);
        return; 
      }
      
      index++;
      const middleware = middlewares[index];

      if (middleware) {
        // Call the middleware, passing req, res, and the next function
        middleware(req, res, next);
      } else {
        // End of the chain
        console.log('Request processing complete.');
        // If a final route handler was passed, it would run here
      }
    };

    // Start the chain
    next();
  };
}

// Example Middleware:
// const logger = (req, res, next) => { console.log('LOG:', req.url); next(); };
// const auth = (req, res, next) => { if (req.user) next(); else res.end(401); };
// const pipeline = createMiddlewareChain([logger, auth]);
// pipeline(request, response);
```

-----

## 66\. How do you detect event loop blocking in Node.js?

Event loop blocking (or "starvation") occurs when a synchronous task runs for too long on the main thread, delaying I/O operations and responsiveness.

1.  **Event Loop Monitoring Libraries:** Use specialized libraries like **`event-loop-lag`** or **`blocked-at`**. These libraries periodically measure the delay between when a function is scheduled and when it actually executes, reporting the latency.
2.  **Built-in Diagnostics:** Utilize Node.js's experimental **`perf_hooks`** API, specifically `performance.eventLoopUtilization()`, which provides metrics on how much time the event loop is actively busy.
3.  **Simple Time Check:** Implement a simple check by scheduling a `setTimeout(..., 0)` and comparing the current time with the expected execution time. If the difference is high (e.g., \> 10ms), the loop was blocked.

<!-- end list -->

```javascript
// Simple Detection
const start = Date.now();
setTimeout(() => {
  const lag = Date.now() - start;
  if (lag > 10) { 
    console.warn(`Event loop blocked for ${lag}ms!`);
  }
}, 0);

// synchronousBlocker(); // This is the function causing the issue
```

-----

## 67\. You need to create a job scheduler in Node (like cron).

I would use the **`node-schedule`** library (or similar alternatives like `agenda` for persistence) because it allows scheduling tasks based on standard cron syntax directly within the Node.js process.

If external persistence and high availability were required (common for production backend systems), I would use a dedicated message queue/broker (like Redis, RabbitMQ, or AWS SQS) and a worker process to manage the job processing, decoupled from the main web server.

```javascript
// Example using node-schedule (pseudocode)
const schedule = require('node-schedule');

function startJobScheduler() {
  // Schedule a job to run every day at 2:30 AM
  const job = schedule.scheduleJob('30 2 * * *', function(){
    console.log('Running daily backup process...');
    // Execute the async function for the backup
    performBackup().catch(err => console.error('Backup failed:', err));
  });

  console.log('Job scheduler started. Next run:', job.nextInvocation());
}
```

-----

## 68\. Implement a simple in-memory database.

A simple in-memory database can be implemented using a JavaScript **`Map`** or an object within a module-scoped closure to ensure data persistence across requests and encapsulation.

```javascript
// database.js
const storage = new Map(); // Stores data: key -> {id: key, data...}
let currentId = 0;

const InMemoryDB = {
  // Create (insert)
  create(data) {
    const id = ++currentId;
    const record = { id, ...data };
    storage.set(id, record);
    return record;
  },

  // Read (get by id)
  get(id) {
    return storage.get(id);
  },

  // Read all (find)
  findAll(filter = {}) {
    // Basic filtering implementation
    return Array.from(storage.values()).filter(record => {
      return Object.keys(filter).every(key => record[key] === filter[key]);
    });
  },

  // Update
  update(id, updates) {
    if (!storage.has(id)) return null;
    const record = storage.get(id);
    const updatedRecord = { ...record, ...updates };
    storage.set(id, updatedRecord);
    return updatedRecord;
  },

  // Delete
  delete(id) {
    return storage.delete(id);
  }
};

module.exports = InMemoryDB;
```

-----

## 69\. How do you safely share data across worker threads?

Worker Threads (Q92) in Node.js do not share memory by default. Safe and efficient data sharing requires specific mechanisms.

1.  **`postMessage()` (Message Passing):** This is the safest way. Data is cloned and sent between the main thread and workers. It's safe but introduces the overhead of copying large objects.
2.  **`SharedArrayBuffer`:** For true memory sharing of raw binary data. This is the **most performant** method for large datasets. It requires using the **`Atomics`** API to ensure thread-safe operations (preventing race conditions and deadlocks) by locking access during modification.
3.  **`MessagePort`:** Used to establish a direct, two-way communication channel between threads for ongoing messaging.
4.  **External Store:** Use an external, centralized data store like **Redis** for structured data that needs to be accessed by all threads.

**Safest Method:** Use `postMessage()` for small, frequent messages and `SharedArrayBuffer` with `Atomics` for large datasets requiring high-speed access, carefully managing synchronization.

-----

## 70\. Implement API caching with expiry using JavaScript.

I would enhance the basic cache (Q25) to include an expiration timestamp and add a cleanup mechanism. This ensures that stale data is not served after its time-to-live (TTL).

```javascript
class ExpiringCache {
  constructor(defaultTTL = 300000) { // Default 5 minutes
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    // 1. Check for expiration
    if (Date.now() > entry.expiryTime) {
      console.log(`Cache expired for ${key}.`);
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key, data, ttl = this.defaultTTL) {
    const expiryTime = Date.now() + ttl;
    this.cache.set(key, { data, expiryTime });
    
    // 2. Optional: Schedule a cleanup for the exact time (or rely on 'get' check)
    // For simplicity, we rely on the 'get' check (lazy eviction).
  }
}

// const apiCache = new ExpiringCache();
// apiCache.set('/users', [{ name: 'A' }], 60000); // Expires in 60s
```

-----

## I. Testing & Debugging Scenarios

-----

## 71\. Mock `fetch()` for unit testing.

The standard and most reliable way to mock `fetch` for unit tests is using a popular library like **`jest-fetch-mock`** (if using Jest) or a general-purpose library like **`sinon`** to replace the global `fetch` function with a mock implementation.

### Using Jest Mocking:

```javascript
// Test file: myApi.test.js

describe('API Tests', () => {
  // Set up the mock before each test
  beforeEach(() => {
    // 1. Mock fetch to return a resolved Promise with JSON data
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'Test User' }),
      })
    );
  });

  test('should fetch user data correctly', async () => {
    const data = await fetchUser(1); // The function under test
    
    // 2. Assert the request was made
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    
    // 3. Assert the response data
    expect(data.name).toBe('Test User');
  });
});
```

-----

## 72\. Create a test that ensures an async function resolves within time.

Most testing frameworks provide a mechanism for timeouts, but for testing the actual resolution time of an async function, I would use the framework's time functions combined with Node.js's **`setTimeout`** within the test promise.

### Using Jest/Vitest:

```javascript
const TIMEOUT_MS = 50;

test('async operation resolves within 50ms', async () => {
  // Use Promise.race to race the function against a timeout promise
  await expect(
    Promise.race([
      myAsyncFunction(), // Function being tested
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), TIMEOUT_MS)
      )
    ])
  ).resolves.toBeDefined(); // Expect the async function to win the race
}, TIMEOUT_MS + 100); // Set test runner timeout higher than operation timeout
```

-----

## 73\. Write a test to check deep object equality.

Most modern testing frameworks (Jest, Mocha with Chai, Vitest) provide a specific assertion for deep equality, which is crucial for comparing complex data structures like JSON objects or nested arrays.

### Using Jest/Vitest's `toEqual`:

```javascript
test('deep object equality check', () => {
  const expected = {
    user: { id: 1, roles: ['admin', 'dev'] },
    status: 200,
    timestamp: new Date('2025-01-01')
  };
  
  const result = getApiResponse(); 
  
  // 1. toEqual checks recursively for equality of all properties/elements
  // This is preferred over toBe, which only checks object reference (strict equality).
  expect(result).toEqual(expected); 
});

test('should match object structure', () => {
  // 2. Use objectContaining for partial deep checks
  expect(getApiResponse()).toEqual(
    expect.objectContaining({
      user: expect.objectContaining({
        roles: expect.arrayContaining(['admin'])
      }),
      status: 200
    })
  );
});
```

-----

## 74\. How do you debug intermittent async bugs?

Intermittent (flaky) async bugs are often caused by race conditions (Q147), unhandled side effects, or external network instability. Debugging them requires a systemic, non-intrusive approach.

1.  **Logging and Context:** The most crucial step. Implement detailed, contextual logging (Q33) that tracks the start, finish, and intermediate state of all relevant asynchronous operations, including timestamps. Log unique request IDs to trace the flow end-to-end.
2.  **Instrumentation:** Use a profiling tool (e.g., `performance.mark` (Q44) or APM services like Sentry) to identify unexpectedly slow async calls that might be leading to timeouts or out-of-order execution.
3.  **Controlled Environment:** Attempt to reproduce the bug locally by:
      * **Throttling Network:** Use browser DevTools (or tools like `toxiproxy` for backend) to intentionally introduce network latency or failures, forcing race conditions to occur more reliably.
      * **Repeated Execution:** Run the test suite or the flaky code path hundreds or thousands of times in a loop to increase the chance of the timing-dependent bug manifesting.

-----

## 75\. Implement a test double for a database service.

A **test double** for a database service should be a **Mock** or a **Stub**. I prefer creating a **Mock Repository** class that mirrors the public API of the real database, allowing me to fully control the return values and assert that the methods were called correctly.

```javascript
// MockRepository.js
class MockUserRepository {
  constructor(initialData = []) {
    this.data = initialData;
    // Spies/Mocks to track calls
    this.findById = jest.fn(this.findById.bind(this));
    this.create = jest.fn(this.create.bind(this));
  }

  // Stubbed implementation for findById
  findById(id) {
    const user = this.data.find(u => u.id === id);
    if (!user) {
      return Promise.resolve(null);
    }
    return Promise.resolve(user);
  }

  // Stubbed implementation for create
  create(userData) {
    const newUser = { id: 99, ...userData };
    this.data.push(newUser);
    return Promise.resolve(newUser);
  }
  
  // Method to check if a call was made (used by test runner)
  wasCalled(methodName) {
    return this[methodName].mock.calls.length > 0;
  }
}

// Usage in test:
// const mockRepo = new MockUserRepository([{ id: 1, name: 'Test' }]);
// const service = new UserService(mockRepo); // Inject the mock

// await service.getUser(1);
// expect(mockRepo.findById).toHaveBeenCalledWith(1);
```