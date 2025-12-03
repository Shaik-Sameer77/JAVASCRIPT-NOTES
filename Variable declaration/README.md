# JavaScript Variable Declarations: `var`, `let`, and `const`

## Quick Comparison Table

| Feature       | `var`                            | `let`                          | `const`                        |
| ------------- | -------------------------------- | ------------------------------ | ------------------------------ |
| **Scope**     | Function                         | Block                          | Block                          |
| **Hoisted?**  | Yes (initialized as `undefined`) | Yes (TDZ - Temporal Dead Zone) | Yes (TDZ - Temporal Dead Zone) |
| **Redeclare** | Yes                              | No                             | No                             |
| **Reassign**  | Yes                              | Yes                            | No                             |

---

## 🔍 Detailed Breakdown

### 1. Scope: Where Variables Live

#### **`var` - Function Scope**

```javascript
function example() {
  if (true) {
    var x = 10; // Available throughout the function
  }
  console.log(x); // 10 - Works! (function scope)
}
```

#### **`let` & `const` - Block Scope**

```javascript
function example() {
  if (true) {
    let y = 20;
    const z = 30;
    console.log(y, z); // 20, 30 - Works
  }
  console.log(y); // ReferenceError - Block scope!
  console.log(z); // ReferenceError - Block scope!
}
```

**Block Scope Includes:** `{}`, `if`, `for`, `while`, `switch`, or any curly braces.

---

### 2. Hoisting: The "Lifting" Mechanism

#### **`var` - Hoisted with `undefined`**

```javascript
console.log(a); // undefined (no error!)
var a = 5;
console.log(a); // 5

// Behind the scenes:
var a = undefined; // Hoisting
console.log(a); // undefined
a = 5;
console.log(a); // 5
```

#### **`let` & `const` - Hoisted but in TDZ**

```javascript
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;

console.log(c); // ReferenceError: Cannot access 'c' before initialization
const c = 15;
```

---

## 🚫 Temporal Dead Zone (TDZ) - The Critical Concept

### What is TDZ?

The **Temporal Dead Zone** is the period between entering a scope and the variable declaration where accessing the variable throws a `ReferenceError`.

### Visualizing TDZ

```javascript
// Start of scope - TDZ begins for 'value'
{
  // TDZ for 'value' (can't access it here)
  console.log(value); // ❌ ReferenceError

  let value; // TDZ ends here

  console.log(value); // ✅ undefined (declared but not assigned)
  value = 42;
  console.log(value); // ✅ 42
} // End of scope
```

### Real-World TDZ Examples

#### Example 1: Common Mistake

```javascript
let x = 10;

function print() {
  console.log(x); // ❌ ReferenceError (TDZ!)
  let x = 20; // Creates new 'x' in function scope
}

print();
```

**Why?** The inner `let x` is hoisted, creating a TDZ for `x` in the entire function scope.

#### Example 2: TDZ with `const`

```javascript
const person = {
  name: "Alice",
  age: calculateAge(), // ❌ ReferenceError (TDZ!)
};

const calculateAge = () => 25;
// 'calculateAge' is in TDZ when object is created
```

#### Example 3: Safe Pattern

```javascript
// ✅ Safe: Declare at the top
let firstName;
let lastName;

// Later assignments
firstName = "John";
lastName = "Doe";

// ✅ Or: Declare and initialize together
const MAX_USERS = 100;
const API_URL = "https://api.example.com";
```

---

## 🎯 Best Practices & Common Pitfalls

### 1. **Always Prefer `const` by Default**

```javascript
// ✅ Good
const users = [];
const API_KEY = "abc123";
const config = { theme: "dark" };

// Can still modify objects/arrays
users.push("Alice"); // ✅ Allowed
config.theme = "light"; // ✅ Allowed
```

### 2. **Use `let` When You Need Reassignment**

```javascript
// ✅ Use let for counters, flags, accumulators
let count = 0;
let isLoading = true;
let userInput = "";

count++; // ✅ Allowed
isLoading = false; // ✅ Allowed
```

### 3. **Avoid `var` in Modern Code**

```javascript
// ❌ Avoid - Creates confusion
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100); // Logs 5,5,5,5,5
}

// ✅ Use let instead
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100); // Logs 0,1,2,3,4
}
```

### 4. **TDZ Traps to Avoid**

#### Trap 1: Variable in Same Block

```javascript
// ❌ Wrong
let x = x + 1; // ReferenceError: 'x' is not defined

// ✅ Correct
let x;
x = x + 1; // NaN (but no error)
```

#### Trap 2: Functions Using Variables Before Declaration

```javascript
// ❌ Problematic
function createUser() {
  return { name: "Alice", id: userId }; // ❌ TDZ for 'userId'
}
const userId = 123;
createUser();

// ✅ Solution
const userId = 123;
function createUser() {
  return { name: "Alice", id: userId }; // ✅ userId is defined
}
```

---

## 🧪 Advanced Scenarios

### 1. **Re-declaration in Different Scopes**

```javascript
let x = 1;
{
  let x = 2; // ✅ Allowed - different block scope
  console.log(x); // 2
}
console.log(x); // 1

// ❌ Not allowed in same scope
let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared
```

### 2. **`const` with Objects and Arrays**

```javascript
const arr = [1, 2, 3];
const obj = { name: "John" };

// ✅ Allowed - Modifying content
arr.push(4); // [1, 2, 3, 4]
obj.age = 30; // { name: "John", age: 30 }

// ❌ Not allowed - Reassignment
arr = []; // TypeError: Assignment to constant variable
obj = {}; // TypeError: Assignment to constant variable
```

### 3. **`let` in For Loops**

```javascript
// Creates a NEW 'i' for each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// vs var (shares the SAME 'i')
for (var j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // 3, 3, 3
}
```

### 4. **Global Scope Behavior**

```javascript
// In browser global scope
var globalVar = "I'm on window"; // window.globalVar
let globalLet = "I'm not on window"; // not accessible as window.globalLet
const globalConst = "Me neither"; // not accessible as window.globalConst
```

---

## 📊 Memory & Performance Considerations

### 1. **Memory Allocation**

- `var`: Hoisted to function top, exists for entire function lifetime
- `let`/`const`: Only exist within their block, can be garbage collected earlier

### 2. **Performance Optimization**

```javascript
// ❌ Less efficient
function process() {
  // Variables exist throughout function
  var temp;
  var result;

  // ... lots of code ...

  temp = calculateTemp();
  result = processResult(temp);

  return result;
}

// ✅ More efficient
function process() {
  // Variables only exist when needed
  const temp = calculateTemp(); // Created here
  const result = processResult(temp); // Created here

  return result;
  // temp & result can be garbage collected earlier
}
```

---

## 🔧 Debugging Tips

### 1. **Identifying TDZ Errors**

```javascript
// Error message tells you it's TDZ
console.log(myVar); // ReferenceError: Cannot access 'myVar' before initialization
//                                                           ↑ TDZ clue!

// vs undeclared variable
console.log(unknownVar); // ReferenceError: unknownVar is not defined
```

### 2. **Using `typeof` Safely**

```javascript
// With var (safe but weird)
console.log(typeof undeclaredVar); // "undefined"

// With let/const in TDZ
console.log(typeof letVar); // ReferenceError (in TDZ)
let letVar;

// Best practice: Check after declaration
let myVar;
if (typeof myVar !== "undefined") {
  // Safe to use
}
```

---

## 📝 Summary: When to Use What

| Use Case                     | Recommendation | Example                       |
| ---------------------------- | -------------- | ----------------------------- |
| **Constant value**           | `const`        | `const PI = 3.14;`            |
| **Loop counters**            | `let`          | `for (let i = 0; ...)`        |
| **Variables that change**    | `let`          | `let score = 0; score = 100;` |
| **Module/global config**     | `const`        | `const API_CONFIG = {...}`    |
| **Avoid hoisting surprises** | `let`/`const`  | Prefer over `var`             |
| **Backward compatibility**   | `var`          | Legacy code only              |

### Golden Rules:

1. **Always use `const` unless you need to reassign**
2. **Use `let` when you need reassignment**
3. **Avoid `var` in new code**
4. **Declare variables at the top of their scope** to avoid TDZ issues
5. **Initialize `const` when declaring** (it's required!)

---

## 🚀 Modern JavaScript Patterns

### Pattern 1: Destructuring with `const`

```javascript
// ✅ Clean and immutable references
const { name, age } = getUser();
const [first, second] = getArray();
```

### Pattern 2: Block Scoping for Memory Efficiency

```javascript
function processData(data) {
  // Heavy processing in isolated block
  let result;
  {
    const temp = expensiveCalculation(data);
    result = transform(temp);
    // 'temp' can be garbage collected after this block
  }

  // Continue with 'result'
  return finalize(result);
}
```

### Pattern 3: Loop Variables

```javascript
// Use let for proper closure in loops
const buttons = document.querySelectorAll("button");
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    console.log(`Button ${index} clicked`); // Works correctly with let
  });
});
```
