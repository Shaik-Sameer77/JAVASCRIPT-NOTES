// Problem 1: Basic Scoping
console.log(a);
var a = 10;

console.log(b);
let b = 20;

console.log(c);
const c = 30;

// Problem 2: Scope Differences

function scopeTest() {
    if (true) {
        var x = "var inside block";
        let y = "let inside block";
        const z = "const inside block";
    }
    
    console.log(x); // What's output?
    console.log(y); // What's output?
    console.log(z); // What's output?
}

scopeTest();

// Problem 3: Redeclaration

var score = 100;
var score = 200;
console.log(score); // ?

let count = 5;
let count = 10; // What happens? ❌ SyntaxError (Duplicate declaration)
console.log(count);

const pi = 3.14;
const pi = 3.14159; // What happens? ❌ SyntaxError (Duplicate declaration)
console.log(pi);

// Problem 4: Temporal Dead Zone (TDZ)

let name = "Global";

function testTDZ() {
    console.log(name); // What's output? ❌ ReferenceError (Local name shadows global)
    let name = "Local";
}

testTDZ();

// Problem 5: Loop Variables

for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log("var i:", i); // What's output? ❌ 3 3 3 var shares the same reference
    }, 100);
}

for (let j = 0; j < 3; j++) {
    setTimeout(() => {
        console.log("let j:", j); // What's output? ✅ 0 1 2 let creates new binding per iteration
    }, 100);
}

// Problem 6: Const with Objects

const user = {
    name: "Alice",
    age: 25
};

user.age = 26;
user.city = "New York";

console.log(user); // What's output?

user = { name: "Bob" }; // What happens?  ❌ TypeError (reassignment)
// Problem 7: Block Scoping Challenge

let x = 1;

{
    let x = 2;
    console.log(x); // ?
    
    {
        let x = 3;
        console.log(x); // ?
    }
    
    console.log(x); // ?
}

console.log(x); // ?
// 🎯 Advanced Level
// Problem 8: Hoisting with Functions

function test() {
    console.log(a); // ?
    console.log(b); // ?
    console.log(c); // ?
    
    var a = function() { return 1; };
    let b = function() { return 2; };
    const c = function() { return 3; };
    
    console.log(a()); // ?
    console.log(b()); // ?
    console.log(c()); // ?
}

test();
// Problem 9: TDZ in Complex Scenario

const a = a; // What happens?

let b = b + 1; // What happens?

let c = 10;
{
    console.log(c); // ?
    let c = 20;
}
// Problem 10: Switch Statement Scoping

let value = 1;

switch(value) {
    case 1:
        let message = "First case";
        console.log(message);
        break;
    case 2:
        let message = "Second case"; // What happens?
        console.log(message);
        break;
}
// 🎯 Real-World Scenarios
// Problem 11: Module Pattern

// Counter module
const Counter = (function() {
    let privateCount = 0;
    
    function changeBy(val) {
        privateCount += val;
    }
    
    return {
        increment: function() {
            changeBy(1);
        },
        decrement: function() {
            changeBy(-1);
        },
        value: function() {
            return privateCount;
        }
    };
})();

Counter.increment();
Counter.increment();
console.log(Counter.value()); // ?
console.log(Counter.privateCount); // ?
// Problem 12: Closure with Var vs Let

function createFunctionsVar() {
    var functions = [];
    for (var i = 0; i < 3; i++) {
        functions.push(function() {
            return i;
        });
    }
    return functions;
}

function createFunctionsLet() {
    var functions = [];
    for (let i = 0; i < 3; i++) {
        functions.push(function() {
            return i;
        });
    }
    return functions;
}

const varFuncs = createFunctionsVar();
const letFuncs = createFunctionsLet();

console.log(varFuncs[0]()); // ?
console.log(varFuncs[1]()); // ?
console.log(varFuncs[2]()); // ?

console.log(letFuncs[0]()); // ?
console.log(letFuncs[1]()); // ?
console.log(letFuncs[2]()); // ?
// Problem 13: Object.freeze vs Const

const obj = {
    name: "Alice",
    details: {
        age: 25,
        city: "NYC"
    }
};

Object.freeze(obj);

obj.name = "Bob"; // What happens?
obj.details.age = 26; // What happens?
obj.details = {}; // What happens?

console.log(obj);
// Problem 14: Async/Await with Variables

async function fetchData() {
    const data = await Promise.resolve("Data loaded");
    console.log(data); // ?
    
    let processing = true;
    setTimeout(() => {
        processing = false;
        console.log("Processing complete");
    }, 100);
    
    console.log(processing); // ?
}

fetchData();
// Problem 15: Global Variable Pollution

// In browser context
var globalVar = "I'm global";
let globalLet = "I'm also global but...";
const globalConst = "Me too";

console.log(window.globalVar); // ?
console.log(window.globalLet); // ?
console.log(window.globalConst); // ?
// 🎯 Debugging Challenges
// Problem 16: Find the Bug

function calculateDiscount(price, discountPercent) {
    if (discountPercent > 0) {
        var discount = price * discountPercent / 100;
        var finalPrice = price - discount;
    }
    
    console.log("Discount:", discount); // Bug here?
    console.log("Final price:", finalPrice); // Bug here?
    
    return finalPrice;
}

calculateDiscount(100, 10);
// Problem 17: What's Wrong Here?

const settings = {
    theme: "dark",
    notifications: true
};

function updateSettings(newTheme) {
    if (newTheme) {
        const settings = { theme: newTheme }; // Problem?
        console.log("Updated:", settings);
    }
    
    console.log("Current:", settings); // What prints?
}

updateSettings("light");
// Problem 18: TDZ in Class

class Calculator {
    static multiply(a) {
        return a * multiplier; // Problem?
    }
}

const multiplier = 5;
console.log(Calculator.multiply(10)); // ?
// 🎯 Optimization Problems
// Problem 19: Memory Leak Prevention

function processLargeData() {
    var data = getHugeArray(); // 1GB array
    
    // Process data...
    let result = data.map(x => x * 2);
    
    // Clear memory
    data = null; // Does this help?
    
    return result;
}

// How would you rewrite this to be memory efficient?
Problem 20: Block Scope for Cleanup

function processUserData(userId) {
    // Expensive operation
    const userData = fetchUserData(userId); // Large object
    
    {
        // Only need name and email for this part
        const { name, email } = userData;
        sendWelcomeEmail(name, email);
    }
    
    {
        // Process differently
        const { orders, preferences } = userData;
        updateRecommendations(orders, preferences);
    }
    
    // Can userData be garbage collected earlier?
}
// 📝 Practice Snippets to Analyze
// Snippet 1: Predict the Output

var x = 1;
let y = 2;
const z = 3;

{
    var x = 10;
    let y = 20;
    const z = 30;
    
    console.log(x, y, z);
}

console.log(x, y, z);
// Snippet 2: Function Scoping

function test() {
    console.log(foo); // ?
    console.log(bar); // ?
    
    if (true) {
        var foo = "Hello";
        let bar = "World";
    }
    
    console.log(foo); // ?
    console.log(bar); // ?
}

test();
// Snippet 3: Const with Arrays

const numbers = [1, 2, 3];
numbers.push(4);
numbers[0] = 10;
numbers = [7, 8, 9]; // What happens?

console.log(numbers);
// Snippet 4: Loop with Const

for (const i = 0; i < 3; i++) { // What happens?
    console.log(i);
}

// How to fix it?
// Snippet 5: Multiple Declarations

let a = 1, b = 2, c = 3;
const x = 4, y = 5, z = 6;

// Are these valid?
let d = 4, let e = 5; // ?
const p = 7, const q = 8; // ?
// 🎯 Solutions Framework
// When solving these problems, ask yourself:

// What's the scope? (global, function, block)

// Is it hoisted? (var: yes with undefined, let/const: yes but TDZ)

// Is there redeclaration? (var: allowed, let/const: not allowed in same scope)

// Is there reassignment? (const: not allowed)

// Is there a TDZ issue? (accessing before declaration with let/const)

// What about closures? (var shares reference, let creates new each iteration)

🔧 Code Fixing Exercises
// Exercise 1: Fix the TDZ Error
// Broken code
function calculate() {
    console.log(total); // ReferenceError
    let total = 0;
    
    for (let i = 0; i < 10; i++) {
        total += i;
    }
    
    return total;
}

// Fix it
// Exercise 2: Prevent Global Pollution

// Problematic code
function setup() {
    config = { theme: "dark" }; // Implicit global!
    let settings = { notifications: true };
}

setup();
console.log(config); // Unexpected global
console.log(settings); // ?

// Fix it
// Exercise 3: Safe Variable Swapping

// Using only let/const, swap two variables
let a = 5;
let b = 10;

// Swap without using var or temporary variable declaration
// (Hint: Use destructuring)
// 🚀 Advanced Practice: Write Your Own
// Create a function that demonstrates:

// var hoisting and function scope

// let block scoping with closures

// const immutability patterns

// TDZ edge cases

// Pattern: Using IIFE to create private variables

Example structure:

function demonstrateScopes() {
    // Your code here
    // Should show at least 5 different behaviors
    // Include comments explaining each
}
