# JavaScript Basics - Comprehensive Guide

## 📚 Overview
A detailed, in-depth guide to fundamental JavaScript concepts. This guide explores each topic with thorough explanations, examples, and best practices.

## 📋 Table of Contents
1. [Variables](#1-variables)
2. [Data Types](#2-data-types)
3. [Type Conversion & Coercion](#3-type-conversion--coercion)
4. [Operators](#4-operators)
5. [Template Literals](#5-template-literals)
6. [Conditionals](#6-conditionals)
7. [Loops](#7-loops)
8. [Arrays](#8-arrays)
9. [Strings](#9-strings)
10. [Objects](#10-objects)

---

## 1. Variables

### **Declaration and Scope**

#### `var` (ES5 and earlier)
```javascript
var x = 10;
var x = 20; // Re-declaration allowed (potential bug source)
function example() {
    var y = 30;
    if (true) {
        var y = 40; // Same variable, block doesn't create new scope
        console.log(y); // 40
    }
    console.log(y); // 40 (not 30!) - Hoisted to function scope
}
```

**Key Characteristics:**
- Function-scoped (or global if declared outside function)
- Hoisted to top of function/global context with `undefined` initialization
- Can be re-declared within same scope
- Creates properties on the global object (`window` in browsers)

#### `let` (ES6+)
```javascript
let x = 10;
// let x = 20; // SyntaxError: Identifier 'x' has already been declared
x = 20; // Reassignment allowed

if (true) {
    let y = 30;
    let y = 40; // SyntaxError: Cannot re-declare in same block
}
```

**Key Characteristics:**
- Block-scoped (`{}` creates new scope)
- Not hoisted in the same way as `var` (Temporal Dead Zone)
- Cannot be re-declared in same scope
- Doesn't create properties on global object

#### `const` (ES6+)
```javascript
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

const user = { name: "John" };
user.name = "Jane"; // Allowed - object properties can change
// user = { name: "Bob" }; // Not allowed - cannot reassign reference
```

**Key Characteristics:**
- Block-scoped like `let`
- Must be initialized at declaration
- Cannot be reassigned after declaration
- For objects/arrays: reference is constant, but contents can change
- Use `Object.freeze()` for true immutability

### **Temporal Dead Zone (TDZ)**
```javascript
console.log(a); // undefined (var is hoisted)
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;
```
The TDZ is the time between entering scope and variable initialization where the variable cannot be accessed.

---

## 2. Data Types

### **Primitive Types (7 Total)**

#### 1. **String** - Textual data
```javascript
let str1 = 'Single quotes';
let str2 = "Double quotes";
let str3 = `Template literal ${expression}`;
```

#### 2. **Number** - Floating-point numbers (double precision 64-bit)
```javascript
let num = 42;
let float = 3.14;
let infinity = Infinity;
let nan = NaN; // Not a Number (type is still Number)
let bigInt = 9007199254740991n; // BigInt literal
```

#### 3. **Boolean** - Logical values
```javascript
let isTrue = true;
let isFalse = false;
```

#### 4. **Undefined** - Variable declared but not assigned
```javascript
let x;
console.log(x); // undefined
console.log(typeof x); // "undefined"
```

#### 5. **Null** - Intentional absence of value
```javascript
let y = null;
console.log(typeof y); // "object" (historical bug!)
console.log(y === null); // true
```

#### 6. **Symbol** - Unique, immutable identifier (ES6+)
```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false (always unique)

// Well-known symbols
Symbol.iterator;
Symbol.toStringTag;
```

#### 7. **BigInt** - Arbitrary precision integers (ES2020+)
```javascript
const bigNum = 1234567890123456789012345678901234567890n;
const bigNum2 = BigInt("123456789012345678901234567890");
```

### **Non-Primitive Types**

#### **Object** - Collection of key-value pairs
```javascript
// Object literal
let obj = {
    name: "John",
    age: 30,
    isAdmin: true
};

// Arrays (special type of object)
let arr = [1, 2, 3];

// Functions (callable objects)
function greet() {
    return "Hello";
}

// Dates, Regular Expressions, etc.
```

### **Type Detection**
```javascript
typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object" (bug!)
typeof Symbol()     // "symbol"
typeof 123n         // "bigint"
typeof {}           // "object"
typeof []           // "object"
typeof function(){} // "function"

// Better array detection
Array.isArray([])   // true
```

---

## 3. Type Conversion & Coercion

### **Explicit (Manual) Conversion**

#### To String
```javascript
String(123);        // "123"
String(true);       // "true"
String(null);       // "null"
String(undefined);  // "undefined"
(123).toString();   // "123" (except null/undefined)
```

#### To Number
```javascript
Number("123");      // 123
Number("123abc");   // NaN
Number(true);       // 1
Number(false);      // 0
Number(null);       // 0
Number(undefined);  // NaN

parseInt("123px");  // 123
parseFloat("3.14em"); // 3.14
```

#### To Boolean
```javascript
Boolean(0);         // false
Boolean(1);         // true
Boolean("");        // false
Boolean("hello");   // true
Boolean([]);        // true
Boolean({});        // true
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
```

### **Implicit (Automatic) Coercion**

#### String Context
```javascript
"value: " + 42;     // "value: 42"
"3" + 4 + 5;        // "345" (left-to-right)
3 + 4 + "5";        // "75"
```

#### Number Context
```javascript
"42" - 2;           // 40
"42" * 2;           // 84
"42" / 2;           // 21
"42" > 40;          // true (comparison)
```

#### Boolean Context (Truthy/Falsy)
**Falsy values:**
- `false`
- `0`, `-0`, `0n`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

**Everything else is truthy:**
```javascript
if ([]) {           // true
    console.log("Array is truthy!");
}
```

---

## 4. Operators

### **Equality Operators**

#### `==` (Loose Equality) - Coercion happens
```javascript
5 == "5";           // true
0 == false;         // true
null == undefined;  // true
"" == 0;            // true
[] == 0;            // true ([] → "" → 0)
```

#### `===` (Strict Equality) - No coercion
```javascript
5 === "5";          // false
0 === false;        // false
null === undefined; // false
"" === 0;           // false
[] === 0;           // false
```

**Comparison Algorithm:**
```javascript
// == Algorithm (simplified)
1. If types are same: compare like ===
2. If null/undefined: return true
3. If number/string: convert string to number
4. If boolean: convert to number (true→1, false→0)
5. If object: call valueOf()/toString()
```

### **Logical Operators**

#### `&&` (Logical AND)
```javascript
true && true;       // true
true && false;      // false

// Returns first falsy value or last truthy
0 && "hello";       // 0
"hello" && "world"; // "world"
```

#### `||` (Logical OR)
```javascript
true || false;      // true
false || false;     // false

// Returns first truthy value or last falsy
0 || "hello";       // "hello"
"" || null || 0;    // 0 (last falsy)
```

#### `!` (Logical NOT)
```javascript
!true;              // false
!!"hello";          // true (double NOT for boolean conversion)
```

### **Nullish Coalescing `??` (ES2020)**
```javascript
null ?? "default";      // "default"
undefined ?? "default"; // "default"
0 ?? "default";         // 0 (different from ||)
"" ?? "default";        // "" (different from ||)
```

### **Optional Chaining `?.` (ES2020)**
```javascript
const user = {
    profile: {
        name: "John"
    }
};

console.log(user?.profile?.name);    // "John"
console.log(user?.address?.city);    // undefined (no error)
```

---

## 5. Template Literals

### **Basic Syntax**
```javascript
const name = "John";
const age = 30;

// Basic interpolation
console.log(`My name is ${name} and I'm ${age} years old.`);

// Expression evaluation
console.log(`Next year I'll be ${age + 1}.`);

// Function calls
console.log(`Hello, ${name.toUpperCase()}!`);
```

### **Multi-line Strings**
```javascript
// Before ES6
const oldWay = "Line 1\n" +
               "Line 2\n" +
               "Line 3";

// With template literals
const newWay = `Line 1
Line 2
Line 3`;
```

### **Tagged Templates**
```javascript
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i] ? `<strong>${values[i]}</strong>` : '';
        return result + str + value;
    }, '');
}

const name = "John";
const score = 95;
console.log(highlight`Player ${name} scored ${score} points.`);
// Player <strong>John</strong> scored <strong>95</strong> points.
```

### **Advanced Features**
```javascript
// Raw strings
console.log`Hello\nWorld`;      // Hello\nWorld (as raw string)
console.log(String.raw`Hello\nWorld`); // Same as above

// Nested template literals
const isError = false;
const message = `Status: ${isError ? `ERROR: ${errorCode}` : 'OK'}`;
```

---

## 6. Conditionals

### **if/else if/else**
```javascript
const score = 85;

if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}
```

### **Ternary Operator**
```javascript
const age = 20;
const status = age >= 18 ? "Adult" : "Minor";

// Nested ternary (use cautiously)
const grade = score >= 90 ? "A" :
              score >= 80 ? "B" :
              score >= 70 ? "C" : "F";
```

### **switch Statement**
```javascript
const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of work week");
        break;
    case "Friday":
        console.log("Almost weekend!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Midweek day");
}

// Switch with expressions
switch (true) {
    case score >= 90:
        console.log("Excellent");
        break;
    case score >= 70:
        console.log("Good");
        break;
    default:
        console.log("Needs improvement");
}
```

### **Short-circuit Evaluation for Conditionals**
```javascript
// Default values
const username = userInput || "Anonymous";

// Conditional execution
isLoggedIn && showDashboard();

// Nullish coalescing for defaults
const displayName = username ?? "Guest";
```

---

## 7. Loops

### **for Loop**
```javascript
// Traditional
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// Multiple variables
for (let i = 0, j = 10; i < j; i++, j--) {
    console.log(i, j);
}

// Infinite loop (avoid!)
for (;;) {
    // Need break statement
    break;
}
```

### **while Loop**
```javascript
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// Do-while (executes at least once)
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 5);
```

### **for...of Loop (ES6)**
```javascript
// Arrays
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
    console.log(fruit);
}

// Strings
for (const char of "Hello") {
    console.log(char);
}

// Iterables (Maps, Sets, etc.)
```

### **for...in Loop**
```javascript
const person = {
    name: "John",
    age: 30,
    city: "NYC"
};

// Iterates over enumerable properties (including inherited)
for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}

// Use hasOwnProperty to avoid inherited properties
for (const key in person) {
    if (person.hasOwnProperty(key)) {
        console.log(key);
    }
}
```

### **Loop Control Statements**
```javascript
// break - exit loop entirely
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i); // 0,1,2,3,4
}

// continue - skip to next iteration
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    console.log(i); // 0,1,3,4
}

// Labels for nested loops
outerLoop: for (let i = 0; i < 3; i++) {
    innerLoop: for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) break outerLoop;
        console.log(i, j);
    }
}
```

---

## 8. Arrays

### **Essential Methods**

#### `map()` - Transform each element
```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2); // [2, 4, 6]

const users = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 }
];
const names = users.map(user => user.name); // ["John", "Jane"]
```

#### `filter()` - Select elements based on condition
```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(num => num % 2 === 0); // [2, 4]

const activeUsers = users.filter(user => user.isActive);
```

#### `reduce()` - Accumulate values
```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 10

// Group by property
const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 25 }
];

const groupedByAge = people.reduce((acc, person) => {
    const age = person.age;
    if (!acc[age]) acc[age] = [];
    acc[age].push(person);
    return acc;
}, {});
// {25: [{...}, {...}], 30: [{...}]}
```

#### `some()` - Check if any element passes test
```javascript
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(num => num % 2 === 0); // true
const hasNegative = numbers.some(num => num < 0);   // false
```

#### `every()` - Check if all elements pass test
```javascript
const numbers = [2, 4, 6, 8];
const allEven = numbers.every(num => num % 2 === 0); // true

const ages = [18, 21, 25, 30];
const allAdults = ages.every(age => age >= 18);      // true
```

### **Other Important Methods**

#### `find()` / `findIndex()`
```javascript
const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];
const user = users.find(u => u.id === 2); // {id: 2, name: "Jane"}
const index = users.findIndex(u => u.id === 2); // 1
```

#### `forEach()`
```javascript
const numbers = [1, 2, 3];
numbers.forEach((num, index) => {
    console.log(`numbers[${index}] = ${num}`);
});
// Note: Cannot break out of forEach
```

#### `slice()` / `splice()`
```javascript
// slice - returns new array (non-mutating)
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3);    // [2, 3] (start inclusive, end exclusive)
arr.slice(-2);      // [4, 5] (negative index from end)

// splice - modifies original array
const arr2 = [1, 2, 3, 4, 5];
arr2.splice(2, 1);          // removes 1 element at index 2 ; output: [1,2,4,5]
arr2.splice(1, 0, 'a', 'b'); // inserts at index 1 ; output: [1,"a","b",2,4,5]
```

### **Array Destructuring**
```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a]; // a=2, b=1

// Default values
const [x = 10, y = 20] = [5];
console.log(x, y); // 5, 20
```

---

## 9. Strings

### **Common Methods**

#### Length and Access
```javascript
const str = "Hello World";
str.length;                 // 11
str[0];                     // "H"
str.charAt(0);              // "H"
str.charCodeAt(0);          // 72 (Unicode)
str.at(-1);                 // "d" (ES2022, negative indexing)
```

#### Searching
```javascript
const str = "Hello World";

str.indexOf("World");       // 6
str.lastIndexOf("o");       // 7
str.search(/World/);        // 6 (regex support)

str.includes("Hello");      // true (ES6)
str.startsWith("He");       // true (ES6)
str.endsWith("ld");         // true (ES6)
```

#### Extraction
```javascript
const str = "Hello World";

str.slice(6, 11);          // "World"
str.substring(6, 11);      // "World"
str.substr(6, 5);          // "World" (deprecated)

// slice vs substring differences
str.slice(2, -1);          // "llo Worl" (negative indices)
str.substring(2, -1);      // "He" (negative treated as 0)
```

#### Modification
```javascript
const str = "Hello World";

str.toLowerCase();          // "hello world"
str.toUpperCase();          // "HELLO WORLD"

"  Hello  ".trim();         // "Hello"
"  Hello  ".trimStart();    // "Hello  " (ES2019)
"  Hello  ".trimEnd();      // "  Hello" (ES2019)

str.replace("World", "JS"); // "Hello JS"
str.replace(/o/g, "0");     // "Hell0 W0rld"
```

#### Splitting and Joining
```javascript
const str = "apple,banana,orange";

str.split(",");             // ["apple", "banana", "orange"]
str.split(",", 2);          // ["apple", "banana"] (limit)

["Hello", "World"].join(" "); // "Hello World"
```

### **Template Literals (Revisited with String Methods)**
```javascript
const name = "John";
const message = `Hello ${name}`.toUpperCase(); // "HELLO JOHN"

// Multiline with padding
const code = `
function hello() {
    console.log("Hello World");
}
`.trim();
```

### **Unicode and Special Characters**
```javascript
// Unicode escape sequences
"\u0041";                   // "A"
"\u{1F600}";                // "😀" (ES6)

// String iteration handles Unicode properly
for (const char of "😀🎉") {
    console.log(char);      // 😀, then 🎉
}

// Normalization
"café".normalize();         // Unicode normalization
```

---

## 10. Objects

### **Basic Object Operations**
```javascript
const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    greet: function() {
        return `Hello, I'm ${this.firstName}`;
    }
    // ES6 shorthand:
    // greet() { return `Hello...`; }
};

// Access
person.firstName;           // "John"
person["firstName"];        // "John" (computed property)

// Modification
person.age = 31;
person["country"] = "USA";

// Delete
delete person.age;
```

### `Object.keys()`, `Object.values()`, `Object.entries()`
```javascript
const person = {
    name: "John",
    age: 30,
    city: "NYC"
};

Object.keys(person);    // ["name", "age", "city"]
Object.values(person);  // ["John", 30, "NYC"]
Object.entries(person); // [["name", "John"], ["age", 30], ["city", "NYC"]]

// Practical use cases
for (const [key, value] of Object.entries(person)) {
    console.log(`${key}: ${value}`);
}

// Convert object to map
const map = new Map(Object.entries(person));
```

### **Object Destructuring**
```javascript
const user = {
    id: 1,
    name: "John",
    age: 30,
    address: {
        city: "NYC",
        zip: "10001"
    }
};

// Basic destructuring
const { name, age } = user;

// Renaming variables
const { name: userName, age: userAge } = user;

// Default values
const { name, country = "USA" } = user;

// Nested destructuring
const { address: { city, zip } } = user;

// Rest operator
const { id, ...rest } = user;
```

### **Spread Operator and Object Methods**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

// Merge objects (ES2018)
const merged = { ...obj1, ...obj2 }; // {a: 1, b: 3, c: 4}

// Clone object (shallow)
const clone = { ...obj1 };

// Object.assign() alternative
const merged2 = Object.assign({}, obj1, obj2);

// Object methods
Object.freeze(obj1);       // Prevents modification
Object.seal(obj1);         // Prevents adding/removing properties
Object.is(obj1, obj2);     // Strict equality check
```

### **Property Descriptors**
```javascript
const obj = {};

Object.defineProperty(obj, 'readOnly', {
    value: 42,
    writable: false,
    enumerable: true,
    configurable: false
});

// Get all property descriptors
Object.getOwnPropertyDescriptors(obj);

// Make all properties read-only
Object.freeze(obj);
```

### **Prototypes and Inheritance**
```javascript
// Creating objects with prototype
const animal = {
    eats: true,
    walk() {
        console.log("Animal walks");
    }
};

const rabbit = Object.create(animal, {
    jumps: {
        value: true,
        enumerable: true
    }
});

console.log(rabbit.eats); // true (inherited)
rabbit.walk(); // "Animal walks"

// Checking prototype
console.log(Object.getPrototypeOf(rabbit) === animal); // true
```

---

## 🎯 Best Practices Summary

### **Variables**
- Use `const` by default
- Use `let` when reassignment is needed
- Avoid `var` in modern code
- Initialize variables when declaring them

### **Types & Operators**
- Always use `===` instead of `==`
- Be explicit with type conversions
- Understand truthy/falsy values
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### **Functions & Methods**
- Prefer array methods (`map`, `filter`, `reduce`) over loops
- Use template literals for string concatenation
- Destructure objects and arrays for cleaner code
- Use spread operator for copying/merging

### **Objects**
- Use object shorthand syntax
- Prefer `Object.keys/values/entries` over `for...in`
- Use `Object.freeze()` for immutability when needed
- Consider `Map` and `Set` for specific use cases

---

## 📚 Additional Resources

### **Official Documentation**
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ECMAScript Specification](https://tc39.es/ecma262/)

### **Books**
- "JavaScript: The Definitive Guide" by David Flanagan
- "Eloquent JavaScript" by Marijn Haverbeke
- "You Don't Know JS" (series) by Kyle Simpson

### **Practice Platforms**
- [Codewars](https://www.codewars.com/)
- [LeetCode](https://leetcode.com/)
- [Exercism](https://exercism.org/tracks/javascript)

---

## ✅ Progress Checklist

- [ ] **Variables**: Understand scope, hoisting, and when to use var/let/const
- [ ] **Data Types**: Know all 7 primitives and object behavior
- [ ] **Type Conversion**: Master explicit vs implicit coercion
- [ ] **Operators**: Know difference between ==/===, use logical operators effectively
- [ ] **Template Literals**: Use interpolation, multi-line strings, and tagged templates
- [ ] **Conditionals**: Write clean conditional logic with if/else and switch
- [ ] **Loops**: Choose appropriate loop type for each scenario
- [ ] **Arrays**: Master map, filter, reduce, and other essential methods
- [ ] **Strings**: Use string methods effectively, handle Unicode
- [ ] **Objects**: Work with object methods, destructuring, and prototypes

---

**Happy Coding! Remember: Practice is key to mastering JavaScript!** 🚀
