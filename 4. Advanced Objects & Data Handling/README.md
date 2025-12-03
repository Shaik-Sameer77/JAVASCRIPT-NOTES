# Advanced Objects & Data Handling - Comprehensive Guide

## 📚 Overview
Master advanced JavaScript techniques for working with objects and data. This guide covers modern syntax, performance considerations, and best practices for efficient data manipulation.

## 📋 Table of Contents
1. [Object Destructuring](#1-object-destructuring)
2. [Array Destructuring](#2-array-destructuring)
3. [Optional Chaining](#3-optional-chaining)
4. [Nullish Coalescing](#4-nullish-coalescing)
5. [Deep Copy vs Shallow Copy](#5-deep-copy-vs-shallow-copy)
6. [JSON (parse, stringify)](#6-json-parse-stringify)
7. [Spread vs Object.assign](#7-spread-vs-objectassign)
8. [Mutable vs Immutable Patterns](#8-mutable-vs-immutable-patterns)

---

## 1. Object Destructuring

### **What is Object Destructuring?**
Object destructuring is a JavaScript expression that allows you to extract properties from objects and assign them to variables in a concise way.

### **Basic Syntax**
```javascript
const person = {
    name: 'John',
    age: 30,
    city: 'New York',
    profession: 'Developer'
};

// Traditional way
const name = person.name;
const age = person.age;

// With destructuring
const { name, age } = person;
console.log(name); // 'John'
console.log(age);  // 30

// You can destructure multiple properties
const { name, age, city } = person;
```

### **Destructuring with Different Variable Names**
```javascript
const person = { firstName: 'Jane', lastName: 'Doe' };

// Assign to different variable names
const { firstName: first, lastName: last } = person;
console.log(first); // 'Jane'
console.log(last);  // 'Doe'

// Real-world example with API responses
const apiResponse = {
    userId: 123,
    userEmail: 'jane@example.com',
    userStatus: 'active'
};

const { 
    userId: id, 
    userEmail: email, 
    userStatus: status 
} = apiResponse;

console.log(id, email, status); // 123 'jane@example.com' 'active'
```

### **Default Values**
```javascript
const person = { name: 'John', age: 30 };

// Default value if property doesn't exist
const { name, age, city = 'Unknown' } = person;
console.log(city); // 'Unknown'

// Combining renaming with default values
const { name: fullName = 'Anonymous', age } = person;

// Default values only apply to undefined
const obj = { x: null, y: 0, z: undefined };
const { x = 10, y = 20, z = 30 } = obj;
console.log(x, y, z); // null, 0, 30 (z gets default)
```

### **Nested Destructuring**
```javascript
const user = {
    id: 1,
    info: {
        name: 'John',
        address: {
            city: 'NYC',
            zip: '10001'
        }
    }
};

// Nested destructuring
const {
    info: {
        name,
        address: { city, zip }
    }
} = user;

console.log(name, city, zip); // 'John' 'NYC' '10001'

// Partial nested destructuring
const {
    id,
    info: { name: userName }
} = user;
console.log(id, userName); // 1 'John'
```

### **Destructuring in Function Parameters**
```javascript
// Traditional function
function printUser(user) {
    console.log(`${user.name} is ${user.age} years old`);
}

// With destructuring in parameters
function printUser({ name, age }) {
    console.log(`${name} is ${age} years old`);
}

// With default values
function createUser({ name = 'Anonymous', age = 0, isAdmin = false }) {
    return { name, age, isAdmin };
}

// With nested destructuring
function processOrder({ id, customer: { name, email }, items }) {
    console.log(`Processing order ${id} for ${name} (${email})`);
}

// Optional destructuring with default empty object
function printUser({ name = 'Guest', age = 0 } = {}) {
    console.log(`${name} is ${age} years old`);
}

printUser(); // 'Guest is 0 years old' (no error)
```

### **Rest Operator with Destructuring**
```javascript
const person = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA',
    profession: 'Developer'
};

// Extract some properties, collect the rest
const { name, age, ...otherDetails } = person;
console.log(name, age); // 'John' 30
console.log(otherDetails); // {city: 'NYC', country: 'USA', profession: 'Developer'}

// Real-world use case: separating props in React
function UserProfile({ name, avatar, ...restProps }) {
    return (
        <div {...restProps}>
            <img src={avatar} alt={name} />
            <h2>{name}</h2>
        </div>
    );
}
```

### **Dynamic Property Destructuring**
```javascript
const propName = 'age';
const person = { name: 'John', age: 30 };

// Can't do this: const { propName } = person; // undefined

// Instead, use computed property names
const { [propName]: ageValue } = person;
console.log(ageValue); // 30

// With multiple dynamic properties
const keys = ['name', 'age'];
const [key1, key2] = keys;
const { [key1]: val1, [key2]: val2 } = person;
console.log(val1, val2); // 'John' 30
```

### **Destructuring in Loops**
```javascript
const users = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'Bob', age: 35 }
];

// Destructuring in for...of loop
for (const { name, age } of users) {
    console.log(`${name} is ${age} years old`);
}

// Destructuring in array methods
const names = users.map(({ name }) => name);
console.log(names); // ['John', 'Jane', 'Bob']

// With filter
const adults = users.filter(({ age }) => age >= 30);
console.log(adults); // [{name: 'John', age: 30}, {name: 'Bob', age: 35}]
```

### **Practical Examples**

#### **1. Configuration Objects**
```javascript
function createConnection(config = {}) {
    const {
        host = 'localhost',
        port = 3000,
        timeout = 5000,
        retries = 3,
        ...otherOptions
    } = config;
    
    return {
        host,
        port,
        timeout,
        retries,
        ...otherOptions
    };
}

const connection = createConnection({ 
    host: 'api.example.com', 
    ssl: true 
});
// {host: 'api.example.com', port: 3000, timeout: 5000, retries: 3, ssl: true}
```

#### **2. API Response Handling**
```javascript
async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const { data: user, status, error } = await response.json();
    
    if (status === 'success') {
        const { id, name, email, settings: { theme, notifications } } = user;
        return { id, name, email, theme, notifications };
    } else {
        throw new Error(error || 'Failed to fetch user');
    }
}
```

#### **3. Function Return Values**
```javascript
function processData(input) {
    // Calculate multiple values
    const sum = input.reduce((a, b) => a + b, 0);
    const average = sum / input.length;
    const max = Math.max(...input);
    const min = Math.min(...input);
    
    // Return as object
    return { sum, average, max, min };
}

// Destructure the return value
const { sum, average, max, min } = processData([1, 2, 3, 4, 5]);
console.log(`Sum: ${sum}, Average: ${average}`);
```

---

## 2. Array Destructuring

### **Basic Array Destructuring**
```javascript
const colors = ['red', 'green', 'blue', 'yellow'];

// Basic destructuring
const [firstColor, secondColor] = colors;
console.log(firstColor);  // 'red'
console.log(secondColor); // 'green'

// Skip elements
const [first, , third] = colors;
console.log(first, third); // 'red' 'blue'

// Rest operator with arrays
const [primary, ...otherColors] = colors;
console.log(primary);      // 'red'
console.log(otherColors);  // ['green', 'blue', 'yellow']
```

### **Default Values**
```javascript
const numbers = [10, 20];

// Default values for missing elements
const [a, b, c = 30, d = 40] = numbers;
console.log(a, b, c, d); // 10, 20, 30, 40

// Default values with empty slots
const empty = [];
const [x = 1, y = 2, z = 3] = empty;
console.log(x, y, z); // 1, 2, 3
```

### **Nested Array Destructuring**
```javascript
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Nested destructuring
const [[a, b, c], [d, e, f]] = matrix;
console.log(a, b, c, d, e, f); // 1 2 3 4 5 6

// Deep nesting
const nested = [1, [2, [3, 4]], 5];
const [first, [second, [third, fourth]], fifth] = nested;
console.log(first, second, third, fourth, fifth); // 1 2 3 4 5
```

### **Swapping Variables**
```javascript
let a = 1;
let b = 2;

// Traditional swapping with temp variable
let temp = a;
a = b;
b = temp;

// With destructuring
[a, b] = [b, a];
console.log(a, b); // 2, 1

// Swapping multiple variables
let x = 1, y = 2, z = 3;
[x, y, z] = [z, x, y];
console.log(x, y, z); // 3, 1, 2
```

### **Function Return Values**
```javascript
// Functions can return arrays
function getMinMax(numbers) {
    return [Math.min(...numbers), Math.max(...numbers)];
}

// Destructure the result
const [min, max] = getMinMax([5, 2, 8, 1, 9]);
console.log(`Min: ${min}, Max: ${max}`); // Min: 1, Max: 9

// Real-world example: useState in React
function useState(initialValue) {
    let value = initialValue;
    
    function setValue(newValue) {
        value = newValue;
    }
    
    return [value, setValue];
}

const [count, setCount] = useState(0);
console.log(count); // 0
setCount(5);
console.log(count); // 5 (in real React, this triggers re-render)
```

### **Destructuring with Iterables**
```javascript
// Strings are iterable
const [firstChar, secondChar] = 'Hello';
console.log(firstChar, secondChar); // 'H' 'e'

// Sets are iterable
const set = new Set([10, 20, 30]);
const [firstValue, secondValue] = set;
console.log(firstValue, secondValue); // 10, 20

// Maps are iterable (returns key-value pairs)
const map = new Map([['a', 1], ['b', 2]]);
const [[key1, val1], [key2, val2]] = map;
console.log(key1, val1, key2, val2); // 'a' 1 'b' 2
```

### **Practical Examples**

#### **1. Processing CSV Data**
```javascript
const csvLine = 'John,Doe,30,Developer,New York';
const [firstName, lastName, age, profession, city] = csvLine.split(',');

console.log(`${firstName} ${lastName}, ${age}, ${profession}, ${city}`);
// John Doe, 30, Developer, New York
```

#### **2. Parsing Dates**
```javascript
const dateString = '2024-12-25';
const [year, month, day] = dateString.split('-').map(Number);

console.log(`Year: ${year}, Month: ${month}, Day: ${day}`);
// Year: 2024, Month: 12, Day: 25
```

#### **3. Multiple Return Values from Regex**
```javascript
function parseUrl(url) {
    const regex = /^(https?):\/\/([^\/]+)\/(.*)$/;
    const [, protocol, hostname, path] = url.match(regex) || [];
    
    return { protocol, hostname, path };
}

const { protocol, hostname, path } = parseUrl('https://example.com/api/users');
console.log(protocol, hostname, path); // 'https' 'example.com' 'api/users'
```

#### **4. Rotating Array Elements**
```javascript
function rotateArray(arr, positions) {
    const [firstPart, secondPart] = [
        arr.slice(0, positions),
        arr.slice(positions)
    ];
    return [...secondPart, ...firstPart];
}

const rotated = rotateArray([1, 2, 3, 4, 5], 2);
console.log(rotated); // [3, 4, 5, 1, 2]
```

---

## 3. Optional Chaining

### **What is Optional Chaining?**
Optional chaining (`?.`) is a safe way to access nested object properties, even if an intermediate property doesn't exist. It short-circuits and returns `undefined` instead of throwing an error.

### **Basic Syntax**
```javascript
const user = {
    profile: {
        name: 'John',
        address: {
            city: 'NYC'
        }
    }
};

// Without optional chaining (risky)
const city = user.profile.address.city; // Works
const zip = user.profile.address.zipCode; // undefined (okay)

// What if profile or address is missing?
const badUser = {};
const city2 = badUser.profile.address.city; // TypeError!

// With optional chaining
const safeCity = badUser?.profile?.address?.city; // undefined (no error)
console.log(safeCity); // undefined
```

### **Different Forms of Optional Chaining**

#### **1. Optional Property Access (`?.`)**
```javascript
const obj = { a: { b: { c: 1 } } };

console.log(obj?.a?.b?.c); // 1
console.log(obj?.x?.y?.z); // undefined (instead of TypeError)
console.log(obj?.a?.b?.c?.d?.e); // undefined

// Works with bracket notation too
const key = 'b';
console.log(obj?.a?.[key]?.c); // 1
```

#### **2. Optional Function Call (`?.()`)**
```javascript
const obj = {
    method: function() {
        return 'Hello';
    }
};

console.log(obj.method?.()); // 'Hello'

const obj2 = {};
console.log(obj2.method?.()); // undefined (no error)

// With parameters
const api = {
    fetchData: (url) => `Data from ${url}`
};

console.log(api.fetchData?.('/users')); // 'Data from /users'
console.log(api.nonExistentMethod?.()); // undefined
```

#### **3. Optional Array Access (`?.[]`)**
```javascript
const arr = [1, 2, 3];
console.log(arr?.[0]); // 1
console.log(arr?.[5]); // undefined

const nullArray = null;
console.log(nullArray?.[0]); // undefined (no error)
console.log(nullArray?.[0]?.prop); // undefined

// Real example with uncertain array
const response = {
    data: {
        items: [
            { id: 1, name: 'Item 1' }
        ]
    }
};

const itemName = response?.data?.items?.[0]?.name;
console.log(itemName); // 'Item 1'

const missingName = response?.data?.items?.[5]?.name;
console.log(missingName); // undefined
```

### **Optional Chaining with Nullish Values**
```javascript
// Optional chaining only stops at null/undefined
const obj = {
    a: null,
    b: 0,
    c: '',
    d: false
};

console.log(obj?.a?.prop); // undefined (a is null)
console.log(obj?.b?.toString()); // '0' (b is 0, not null/undefined)
console.log(obj?.c?.length); // 0 (c is string)
console.log(obj?.d?.toString()); // 'false' (d is boolean)
```

### **Combining with Other Operators**

#### **With Nullish Coalescing (`??`)**
```javascript
const config = {
    settings: {
        theme: 'dark'
    }
};

// Without optional chaining
const theme1 = config.settings.theme || 'light'; // 'dark'
const theme2 = config.settings.nonExistent || 'light'; // 'light'

// Problem: empty string, 0, false would also use default
const config2 = { settings: { theme: '' } };
const theme3 = config2.settings.theme || 'light'; // 'light' (wrong!)

// With optional chaining and nullish coalescing
const theme4 = config2.settings?.theme ?? 'light'; // '' (correct!)
const theme5 = config2.settings?.nonExistent ?? 'light'; // 'light'
```

#### **With Default Parameters**
```javascript
function getUserTheme(user) {
    return user?.preferences?.theme ?? 'light';
}

console.log(getUserTheme({ preferences: { theme: 'dark' } })); // 'dark'
console.log(getUserTheme({ preferences: {} })); // 'light'
console.log(getUserTheme({})); // 'light'
console.log(getUserTheme(null)); // 'light'
```

### **Short-circuiting Behavior**
```javascript
let counter = 0;

const obj = {
    increment: () => {
        counter++;
        return counter;
    }
};

// Optional chaining short-circuits
console.log(obj?.nonExistent?.()); // undefined
console.log(counter); // 0 (increment wasn't called)

// Method exists, gets called
console.log(obj?.increment?.()); // 1
console.log(counter); // 1
```

### **Practical Examples**

#### **1. API Response Handling**
```javascript
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        // Safely access nested data
        const userName = data?.user?.profile?.name ?? 'Anonymous';
        const userEmail = data?.user?.contact?.email;
        const lastLogin = data?.user?.activity?.lastLogin;
        
        return { userName, userEmail, lastLogin };
    } catch (error) {
        console.error('Error:', error);
        return { userName: 'Error', userEmail: null, lastLogin: null };
    }
}
```

#### **2. Configuration with Fallbacks**
```javascript
const appConfig = {
    api: {
        baseUrl: process.env.API_URL,
        timeout: process.env.API_TIMEOUT
    }
};

// Safe configuration access
const config = {
    apiUrl: appConfig?.api?.baseUrl ?? 'https://api.default.com',
    timeout: parseInt(appConfig?.api?.timeout ?? '5000'),
    retries: appConfig?.api?.retries ?? 3
};

console.log(config);
```

#### **3. DOM Manipulation**
```javascript
// Safe DOM access
const element = document.querySelector('.optional-element');

// Without optional chaining
if (element) {
    element.style.color = 'red';
    element.addEventListener('click', handler);
}

// With optional chaining
element?.style?.color = 'red';
element?.addEventListener?.('click', handler);

// Safe method calls on potentially missing elements
document.getElementById('modal')?.showModal?.();
document.querySelector('.tooltip')?.setAttribute?.('title', 'Help text');
```

#### **4. Processing Nested Data Structures**
```javascript
const orders = [
    {
        id: 1,
        customer: {
            name: 'John',
            address: {
                city: 'NYC'
            }
        },
        items: [
            { product: 'Laptop', price: 999 }
        ]
    },
    {
        id: 2,
        customer: {
            name: 'Jane'
            // No address
        }
        // No items
    }
];

// Safe processing
orders.forEach(order => {
    const city = order?.customer?.address?.city ?? 'Unknown';
    const total = order?.items?.reduce((sum, item) => sum + (item?.price ?? 0), 0) ?? 0;
    
    console.log(`Order ${order.id}: ${city}, Total: $${total}`);
});
```

### **Limitations and Considerations**
```javascript
// Optional chaining is not a replacement for proper validation
const obj = null;

// This works
console.log(obj?.prop); // undefined

// But this might still fail
console.log(obj.prop?.method()); // TypeError: cannot read prop of null

// Solution: start with optional chaining
console.log(obj?.prop?.method?.()); // undefined

// Optional chaining on the left side of assignment
const data = {};
data?.user?.name = 'John'; // SyntaxError: Invalid left-hand side
// Can't assign to optional chain

// Use this instead
if (data?.user) {
    data.user.name = 'John';
}
```

---

## 4. Nullish Coalescing

### **What is Nullish Coalescing?**
The nullish coalescing operator (`??`) is a logical operator that returns its right-hand side operand when its left-hand side operand is `null` or `undefined`, otherwise returns its left-hand side operand.

### **Basic Usage**
```javascript
// Without nullish coalescing
const value = someValue || 'default';

// Problem: || considers falsy values (0, '', false)
const count = 0;
const defaultCount = count || 10; // 10 (wrong!)

// With nullish coalescing
const correctCount = count ?? 10; // 0 (correct!)
```

### **Nullish vs Falsy Values**
```javascript
// Falsy values in JavaScript: false, 0, '', null, undefined, NaN
// Nullish values: only null and undefined

console.log(false ?? 'default');     // false
console.log(0 ?? 'default');         // 0
console.log('' ?? 'default');        // ''
console.log(NaN ?? 'default');       // NaN
console.log(null ?? 'default');      // 'default'
console.log(undefined ?? 'default'); // 'default'

// Real-world example
const config = {
    timeout: 0,      // intentionally set to 0
    retries: null,   // not set
    theme: ''        // empty theme
};

const timeout = config.timeout ?? 5000;    // 0 (not 5000!)
const retries = config.retries ?? 3;       // 3
const theme = config.theme ?? 'light';     // '' (not 'light'!)
```

### **Combining with Optional Chaining**
```javascript
const user = {
    profile: {
        name: 'John',
        settings: {
            theme: null,  // explicitly set to null
            fontSize: 0   // intentionally 0
        }
    }
};

// Without nullish coalescing
const theme1 = user.profile.settings.theme || 'dark'; // 'dark' (wrong!)
const fontSize1 = user.profile.settings.fontSize || 16; // 16 (wrong!)

// With nullish coalescing
const theme2 = user.profile.settings.theme ?? 'dark'; // null (correct!)
const fontSize2 = user.profile.settings.fontSize ?? 16; // 0 (correct!)

// With optional chaining
const safeTheme = user?.profile?.settings?.theme ?? 'dark'; // null
const safeFontSize = user?.profile?.settings?.fontSize ?? 16; // 0
```

### **Common Use Cases**

#### **1. Function Default Parameters**
```javascript
// Traditional default parameters
function greet(name = 'Guest') {
    console.log(`Hello, ${name}`);
}

// Problem: empty string is valid but gets replaced
greet(''); // 'Hello, Guest' (wrong!)

// With nullish coalescing
function betterGreet(name) {
    name = name ?? 'Guest';
    console.log(`Hello, ${name}`);
}

betterGreet(''); // 'Hello, ' (correct!)
betterGreet(null); // 'Hello, Guest'
betterGreet(undefined); // 'Hello, Guest'
```

#### **2. Configuration Objects**
```javascript
function createApp(config = {}) {
    const defaults = {
        port: 3000,
        host: 'localhost',
        logging: false,
        maxConnections: 0
    };
    
    return {
        port: config.port ?? defaults.port,
        host: config.host ?? defaults.host,
        logging: config.logging ?? defaults.logging,
        maxConnections: config.maxConnections ?? defaults.maxConnections,
        // Ensure 0 is preserved if explicitly set
        timeout: config.timeout ?? 5000
    };
}

const app = createApp({
    port: 0,           // explicitly set to 0
    logging: false,    // explicitly false
    maxConnections: 0  // explicitly 0
});

console.log(app.port); // 0 (not 3000)
console.log(app.logging); // false (not true)
console.log(app.maxConnections); // 0 (not Infinity)
console.log(app.timeout); // 5000 (default)
```

#### **3. API Response Handling**
```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        return {
            items: data.items ?? [],
            total: data.total ?? 0,
            hasMore: data.hasMore ?? false,
            error: data.error ?? null
        };
    } catch (error) {
        return {
            items: [],
            total: 0,
            hasMore: false,
            error: error.message
        };
    }
}
```

#### **4. State Management**
```javascript
class UserStore {
    constructor(initialState = {}) {
        this.state = {
            user: initialState.user ?? null,
            isLoading: initialState.isLoading ?? false,
            error: initialState.error ?? null,
            retryCount: initialState.retryCount ?? 0
        };
    }
    
    setUser(user) {
        this.state.user = user ?? null; // Allow null, default to null
    }
    
    setLoading(isLoading) {
        this.state.isLoading = isLoading ?? false;
    }
}
```

### **Operator Precedence**
```javascript
// Nullish coalescing has lower precedence than most operators
// But higher precedence than conditional (ternary), assignment, and yield

const a = null;
const b = 'default';

// These are equivalent
const result1 = a ?? b;
const result2 = (a ?? b);

// Be careful with logical operators
console.log(true || false ?? 'default'); // SyntaxError
// Need parentheses
console.log((true || false) ?? 'default'); // true

console.log(null || undefined ?? 'default'); // SyntaxError
console.log((null || undefined) ?? 'default'); // 'default'

// Works fine with && and || when parenthesized
const config = { value: 0 };
console.log((config.value || 10) ?? 20); // 10
console.log((config.value ?? 10) || 20); // 20
```

### **Short-circuit Evaluation**
```javascript
let sideEffect = 0;

function getValue() {
    sideEffect++;
    return null;
}

// Right side is only evaluated if left is null/undefined
const result = getValue() ?? 'default';
console.log(result); // 'default'
console.log(sideEffect); // 1 (function was called)

// If left is not nullish, right side is not evaluated
function expensiveComputation() {
    console.log('Expensive computation!');
    return 'computed';
}

const value = 'already has value' ?? expensiveComputation();
console.log(value); // 'already has value'
// 'Expensive computation!' is never logged
```

### **Browser and Environment Defaults**
```javascript
// Get environment variables with fallbacks
const API_URL = process.env.API_URL ?? 'https://api.default.com';
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = parseInt(process.env.PORT ?? '3000');

// Browser environment detection
const isBrowser = typeof window !== 'undefined';
const userAgent = window?.navigator?.userAgent ?? 'Unknown';

// Feature detection
const prefersDarkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
const supportsWebP = document?.createElement('canvas')?.toDataURL('image/webp')?.indexOf('data:image/webp') === 0 ?? false;
```

### **Polyfill/Alternative for Older Environments**
```javascript
// Before nullish coalescing (??), people used:
function oldWay(value, defaultValue) {
    return value != null ? value : defaultValue;
    // Note: != null checks for both null AND undefined
}

// Or with logical operators (but has falsy problem)
const withOr = value || defaultValue;

// Modern polyfill approach
const nullishCoalesce = (value, defaultValue) => {
    return value !== null && value !== undefined ? value : defaultValue;
};

// Usage
const result = nullishCoalesce(someValue, 'default');
```

---

## 5. Deep Copy vs Shallow Copy

### **Understanding Copy Behavior**
```javascript
// Primitive types are copied by value
let a = 10;
let b = a; // Copy by value
b = 20;
console.log(a); // 10 (unchanged)

// Objects are copied by reference
let obj1 = { x: 10 };
let obj2 = obj1; // Copy by reference
obj2.x = 20;
console.log(obj1.x); // 20 (changed!)
```

### **Shallow Copy**
A shallow copy creates a new object but copies references to nested objects.

#### **Methods for Shallow Copy**
```javascript
const original = {
    name: 'John',
    age: 30,
    address: {
        city: 'NYC',
        zip: '10001'
    },
    hobbies: ['reading', 'coding']
};

// 1. Spread operator (...)
const copy1 = { ...original };

// 2. Object.assign()
const copy2 = Object.assign({}, original);

// 3. Array.prototype.slice() (for arrays only)
const arr = [1, 2, { x: 3 }];
const arrCopy = arr.slice();

// 4. Array.from() (for arrays only)
const arrCopy2 = Array.from(arr);

// Problem with shallow copy
copy1.name = 'Jane'; // Works - primitive
console.log(original.name); // 'John' (unchanged)

copy1.address.city = 'Boston'; // Modifies nested object
console.log(original.address.city); // 'Boston' (changed!)

copy1.hobbies.push('gaming');
console.log(original.hobbies); // ['reading', 'coding', 'gaming'] (changed!)
```

### **Deep Copy**
A deep copy creates a new object and recursively copies all nested objects.

#### **Methods for Deep Copy**

##### **1. JSON Methods (Limited)**
```javascript
const original = {
    name: 'John',
    age: 30,
    address: {
        city: 'NYC'
    },
    date: new Date(),
    func: function() { return 'hello'; },
    undef: undefined,
    infinity: Infinity,
    nan: NaN,
    regex: /pattern/gi
};

const deepCopy = JSON.parse(JSON.stringify(original));

console.log(deepCopy.name); // 'John'
console.log(deepCopy.address.city); // 'NYC'

// Problems with JSON methods:
console.log(deepCopy.date); // string (not Date object)
console.log(deepCopy.func); // undefined (functions lost)
console.log(deepCopy.undef); // undefined? Actually, property is missing
console.log(deepCopy.infinity); // null
console.log(deepCopy.nan); // null
console.log(deepCopy.regex); // {} (empty object)
```

##### **2. Recursive Function**
```javascript
function deepClone(obj, hash = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // Handle circular references
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj);
    }
    
    // Handle RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    
    // Handle Array
    if (Array.isArray(obj)) {
        const arrCopy = [];
        hash.set(obj, arrCopy);
        for (let i = 0; i < obj.length; i++) {
            arrCopy[i] = deepClone(obj[i], hash);
        }
        return arrCopy;
    }
    
    // Handle Object
    if (obj instanceof Object) {
        const objCopy = {};
        hash.set(obj, objCopy);
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                objCopy[key] = deepClone(obj[key], hash);
            }
        }
        return objCopy;
    }
    
    // Handle other object types (Map, Set, etc.)
    // This is a simplified version
    return obj;
}

// Usage
const complexObj = {
    name: 'Test',
    date: new Date(),
    regex: /test/gi,
    nested: { x: 1 },
    arr: [1, 2, { y: 3 }]
};

const cloned = deepClone(complexObj);
cloned.nested.x = 100;
console.log(complexObj.nested.x); // 1 (unchanged)
```

##### **3. Using `structuredClone()` (Modern Browsers/Node 17+)**
```javascript
// Native browser API for deep cloning
const original = {
    name: 'John',
    address: { city: 'NYC' },
    date: new Date(),
    arr: [1, 2, 3],
    set: new Set([1, 2, 3]),
    map: new Map([['key', 'value']])
};

try {
    const cloned = structuredClone(original);
    
    // Modify clone
    cloned.address.city = 'Boston';
    cloned.arr.push(4);
    
    console.log(original.address.city); // 'NYC' (unchanged)
    console.log(original.arr.length); // 3 (unchanged)
    
    // Limitations:
    // - Functions cannot be cloned
    // - DOM nodes cannot be cloned
    // - Property descriptors, getters/setters are lost
    // - Prototype chain is not preserved
} catch (error) {
    console.log('structuredClone not supported');
}
```

##### **4. Third-party Libraries**
```javascript
// Lodash: _.cloneDeep()
// import _ from 'lodash';
// const cloned = _.cloneDeep(original);

// jQuery: $.extend(true, {}, original)
// const cloned = $.extend(true, {}, original);
```

### **Performance Comparison**
```javascript
const largeObject = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    data: { nested: { value: Math.random() } }
}));

// Performance test
console.time('JSON deep clone');
const jsonClone = JSON.parse(JSON.stringify(largeObject));
console.timeEnd('JSON deep clone');

console.time('structuredClone');
const structuredCloneResult = structuredClone(largeObject);
console.timeEnd('structuredClone');

console.time('Recursive clone');
const recursiveClone = deepClone(largeObject);
console.timeEnd('Recursive clone');
```

### **When to Use Each**

#### **Use Shallow Copy When:**
```javascript
// 1. Only top-level properties need copying
const config = { theme: 'dark', apiUrl: '...' };
const userConfig = { ...config, userId: 123 };

// 2. You want to share references to nested objects
const defaultSettings = { theme: 'light', notifications: true };
const user1Settings = { ...defaultSettings, theme: 'dark' };
const user2Settings = { ...defaultSettings, theme: 'blue' };
// Both share the same notifications object (might be intentional)

// 3. Performance is critical and objects are simple
```

#### **Use Deep Copy When:**
```javascript
// 1. You need complete isolation
const originalState = { user: { name: 'John', preferences: { ... } } };
const newState = deepClone(originalState);
// Modify newState without affecting originalState

// 2. Working with mutable state (Redux, Vuex, etc.)
function reducer(state, action) {
    const newState = deepClone(state);
    // Modify newState
    return newState;
}

// 3. Serialization/deserialization
const serialized = JSON.stringify(original);
const deserialized = JSON.parse(serialized);
// Creates deep copy (with limitations)
```

### **Special Cases**

#### **Circular References**
```javascript
const circularObj = { name: 'Circular' };
circularObj.self = circularObj; // Circular reference

// JSON methods fail
// JSON.stringify(circularObj); // TypeError

// Our recursive function handles it (with WeakMap)
const clonedCircular = deepClone(circularObj);
console.log(clonedCircular.self === clonedCircular); // true

// structuredClone handles it
const structuredCloneCircular = structuredClone(circularObj);
console.log(structuredCloneCircular.self === structuredCloneCircular); // true
```

#### **Object with Methods**
```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return `Hello, ${this.name}`;
    }
}

const john = new Person('John');

// JSON methods lose methods
const jsonClone = JSON.parse(JSON.stringify(john));
console.log(jsonClone.greet); // undefined

// Need to preserve prototype
function cloneWithPrototype(obj) {
    const proto = Object.getPrototypeOf(obj);
    const clone = Object.create(proto);
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            clone[key] = typeof value === 'object' && value !== null 
                ? deepClone(value) 
                : value;
        }
    }
    
    return clone;
}

const properClone = cloneWithPrototype(john);
console.log(properClone.greet()); // 'Hello, John'
```

---

## 6. JSON (parse, stringify)

### **JSON.stringify()**
Converts a JavaScript object or value to a JSON string.

#### **Basic Usage**
```javascript
const obj = {
    name: 'John',
    age: 30,
    city: 'NYC',
    isAdmin: true,
    hobbies: ['reading', 'coding'],
    address: {
        street: '123 Main St',
        zip: '10001'
    }
};

const jsonString = JSON.stringify(obj);
console.log(jsonString);
// '{"name":"John","age":30,"city":"NYC","isAdmin":true,"hobbies":["reading","coding"],"address":{"street":"123 Main St","zip":"10001"}}'

// Pretty printing with indentation
const prettyJson = JSON.stringify(obj, null, 2);
console.log(prettyJson);
/*
{
  "name": "John",
  "age": 30,
  "city": "NYC",
  "isAdmin": true,
  "hobbies": [
    "reading",
    "coding"
  ],
  "address": {
    "street": "123 Main St",
    "zip": "10001"
  }
}
*/
```

#### **The Replacer Parameter**
```javascript
const data = {
    id: 1,
    name: 'Secret Project',
    apiKey: 'supersecret123',
    users: [
        { id: 1, name: 'John', password: 'hashed123' },
        { id: 2, name: 'Jane', password: 'hashed456' }
    ]
};

// 1. Replacer as an array (whitelist properties)
const safeData = JSON.stringify(data, ['id', 'name', 'users', 'id', 'name']);
console.log(safeData);
// Only includes id, name, users properties

// 2. Replacer as a function
const sanitized = JSON.stringify(data, (key, value) => {
    // Remove sensitive data
    if (key === 'apiKey' || key === 'password') {
        return undefined; // Property is omitted
    }
    
    // Transform values
    if (key === 'name' && typeof value === 'string') {
        return value.toUpperCase();
    }
    
    return value;
}, 2);

console.log(sanitized);
/*
{
  "id": 1,
  "name": "SECRET PROJECT",
  "users": [
    {
      "id": 1,
      "name": "JOHN"
    },
    {
      "id": 2,
      "name": "JANE"
    }
  ]
}
*/
```

#### **Handling Special Values**
```javascript
const specialObj = {
    date: new Date(),
    regex: /pattern/gi,
    func: function() { return 'hello'; },
    undefinedProp: undefined,
    infinity: Infinity,
    nan: NaN,
    nullVal: null,
    symbol: Symbol('test')
};

const result = JSON.stringify(specialObj, (key, value) => {
    if (value instanceof Date) {
        return { $type: 'Date', value: value.toISOString() };
    }
    if (value instanceof RegExp) {
        return { $type: 'RegExp', value: value.toString() };
    }
    if (typeof value === 'function') {
        return { $type: 'Function', value: value.toString() };
    }
    if (typeof value === 'symbol') {
        return { $type: 'Symbol', value: value.toString() };
    }
    // Infinity and NaN become null in JSON
    if (value === Infinity || value === -Infinity || Number.isNaN(value)) {
        return { $type: 'Number', value: String(value) };
    }
    return value;
});

console.log(result);
```

#### **The `toJSON()` Method**
```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }
    
    // Custom JSON serialization
    toJSON() {
        return {
            name: this.name,
            email: this.email,
            createdAt: this.createdAt.toISOString(),
            daysSinceCreation: Math.floor(
                (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)
            )
        };
    }
}

const user = new User('John', 'john@example.com');
console.log(JSON.stringify(user));
// Includes computed property 'daysSinceCreation'
```

### **JSON.parse()**
Parses a JSON string and returns a JavaScript object.

#### **Basic Usage**
```javascript
const jsonString = '{"name":"John","age":30,"city":"NYC"}';
const obj = JSON.parse(jsonString);
console.log(obj.name); // 'John'
console.log(obj.age);  // 30

// Parsing arrays
const arrayJson = '[1, 2, 3, 4, 5]';
const arr = JSON.parse(arrayJson);
console.log(arr[0]); // 1
```

#### **The Reviver Parameter**
```javascript
const jsonString = `{
    "name": "John",
    "age": 30,
    "birthDate": "1990-01-01T00:00:00.000Z",
    "metadata": {
        "$type": "Date",
        "value": "2023-01-01T00:00:00.000Z"
    }
}`;

const obj = JSON.parse(jsonString, (key, value) => {
    if (key === 'birthDate') {
        return new Date(value);
    }
    
    // Handle custom types
    if (value && value.$type === 'Date') {
        return new Date(value.value);
    }
    
    return value;
});

console.log(obj.birthDate instanceof Date); // true
console.log(obj.metadata instanceof Date); // true
```

### **Error Handling**
```javascript
function safeParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parse error:', error.message);
        return defaultValue;
    }
}

// Valid JSON
const valid = safeParse('{"name":"John"}');
console.log(valid); // {name: 'John'}

// Invalid JSON
const invalid = safeParse('{name: John}', { error: 'Invalid JSON' });
console.log(invalid); // {error: 'Invalid JSON'}

// Empty string or null
const empty = safeParse('');
console.log(empty); // null (default)
```

### **Practical Applications**

#### **1. Local Storage**
```javascript
class StorageService {
    constructor(namespace) {
        this.namespace = namespace;
    }
    
    set(key, value) {
        try {
            const fullKey = `${this.namespace}:${key}`;
            const serialized = JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
            return true;
        } catch (error) {
            console.error('Storage write error:', error);
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        try {
            const fullKey = `${this.namespace}:${key}`;
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage read error:', error);
            return defaultValue;
        }
    }
    
    remove(key) {
        const fullKey = `${this.namespace}:${key}`;
        localStorage.removeItem(fullKey);
    }
}

const storage = new StorageService('myApp');
storage.set('user', { name: 'John', preferences: { theme: 'dark' } });
const user = storage.get('user');
```

#### **2. API Communication**
```javascript
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Usage
const userData = await apiRequest('/api/users', 'POST', {
    name: 'John',
    email: 'john@example.com'
});
```

#### **3. Deep Comparison**
```javascript
function deepEqual(obj1, obj2) {
    // Quick reference check
    if (obj1 === obj2) return true;
    
    // JSON.stringify for deep comparison (with limitations)
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Better implementation
function deepEqualAdvanced(a, b) {
    if (a === b) return true;
    
    if (a == null || b == null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqualAdvanced(a[key], b[key])) {
            return false;
        }
    }
    
    return true;
}
```

#### **4. Clone with JSON (with caveats)**
```javascript
function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Use with awareness of limitations
const simpleObj = {
    name: 'John',
    age: 30,
    hobbies: ['reading', 'coding']
};

const cloned = jsonClone(simpleObj); // Works for simple objects
```

### **Performance Considerations**
```javascript
const largeObject = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    data: `Item ${i}`,
    nested: { value: Math.random() }
}));

console.time('JSON.stringify');
const jsonString = JSON.stringify(largeObject);
console.timeEnd('JSON.stringify');

console.time('JSON.parse');
const parsedObject = JSON.parse(jsonString);
console.timeEnd('JSON.parse');

// For very large objects, consider streaming or chunking
```

---

## 7. Spread vs Object.assign

### **Spread Operator (`...`)**
The spread operator allows an iterable to be expanded in places where zero or more arguments or elements are expected.

### **Object.assign()**
The `Object.assign()` method copies all enumerable own properties from one or more source objects to a target object and returns the target object.

### **Basic Comparison**
```javascript
const source = { a: 1, b: 2 };
const target = {};

// Using Object.assign
const result1 = Object.assign(target, source);
console.log(result1); // {a: 1, b: 2}
console.log(target);  // {a: 1, b: 2} (target modified!)

// Using spread operator
const result2 = { ...source };
console.log(result2); // {a: 1, b: 2}
// No target modification needed
```

### **Object Merging**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const obj3 = { d: 5 };

// Using spread
const merged1 = { ...obj1, ...obj2, ...obj3 };
console.log(merged1); // {a: 1, b: 3, c: 4, d: 5}

// Using Object.assign
const merged2 = Object.assign({}, obj1, obj2, obj3);
console.log(merged2); // {a: 1, b: 3, c: 4, d: 5}

// Important: Later properties overwrite earlier ones
```

### **Key Differences**

#### **1. Mutability**
```javascript
// Spread doesn't mutate
const original = { x: 1, y: 2 };
const copy = { ...original };
copy.x = 100;
console.log(original.x); // 1 (unchanged)

// Object.assign mutates first argument
const target = { x: 1 };
const source = { y: 2 };
Object.assign(target, source);
console.log(target); // {x: 1, y: 2} (mutated)
```

#### **2. Handling Null/Undefined**
```javascript
// Spread handles null/undefined gracefully
const merged = { ...null, ...undefined, ...{ a: 1 } };
console.log(merged); // {a: 1}

// Object.assign throws with null/undefined as sources
try {
    Object.assign({}, null, undefined, { a: 1 });
} catch (error) {
    console.error(error); // TypeError
}

// But you can use with falsy values
const safeMerge = Object.assign({}, 
    null && { a: 1 },  // null -> false, so && returns null
    undefined && { b: 2 }, 
    { c: 3 }
);
console.log(safeMerge); // {c: 3}
```

#### **3. Property Descriptors**
```javascript
const source = {};
Object.defineProperty(source, 'hidden', {
    value: 'secret',
    enumerable: false // non-enumerable
});

Object.defineProperty(source, 'readOnly', {
    value: 'cannot change',
    writable: false
});

// Spread copies only enumerable properties
const spreadCopy = { ...source };
console.log(spreadCopy.hidden); // undefined
console.log(spreadCopy.readOnly); // undefined (non-enumerable)

// Object.assign also copies only enumerable properties
const assignCopy = Object.assign({}, source);
console.log(assignCopy.hidden); // undefined
console.log(assignCopy.readOnly); // undefined

// To copy property descriptors, use Object.getOwnPropertyDescriptors
const descriptors = Object.getOwnPropertyDescriptors(source);
const properCopy = Object.defineProperties({}, descriptors);
console.log(properCopy.hidden); // 'secret'
```

#### **4. Getters and Setters**
```javascript
const source = {
    _value: 10,
    get value() {
        return this._value;
    },
    set value(newVal) {
        this._value = newVal;
    }
};

// Spread copies the VALUE of getters, not the getter itself
const spreadCopy = { ...source };
console.log(spreadCopy.value); // 10 (value, not getter)
spreadCopy.value = 20; // This sets a regular property
console.log(spreadCopy.value); // 20
console.log(source.value); // 10 (unchanged)

// Object.assign also copies values, not getters/setters
const assignCopy = Object.assign({}, source);
console.log(assignCopy.value); // 10 (value, not getter)
```

### **Performance Comparison**
```javascript
// For small objects, performance is similar
const smallObj = { a: 1, b: 2, c: 3 };

console.time('Spread small');
for (let i = 0; i < 1000000; i++) {
    const copy = { ...smallObj };
}
console.timeEnd('Spread small');

console.time('Object.assign small');
for (let i = 0; i < 1000000; i++) {
    const copy = Object.assign({}, smallObj);
}
console.timeEnd('Object.assign small');

// For large objects with many properties
const largeObj = {};
for (let i = 0; i < 1000; i++) {
    largeObj[`prop${i}`] = i;
}

console.time('Spread large');
const spreadCopy = { ...largeObj };
console.timeEnd('Spread large');

console.time('Object.assign large');
const assignCopy = Object.assign({}, largeObj);
console.timeEnd('Object.assign large');
```

### **Array Spread vs Array Methods**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Spread for arrays
const mergedArray = [...arr1, ...arr2];
console.log(mergedArray); // [1, 2, 3, 4, 5, 6]

// vs concat
const concatArray = arr1.concat(arr2);

// Performance: spread is generally faster for small arrays
// concat might be faster for very large arrays
```

### **Practical Use Cases**

#### **1. State Updates (React, Redux)**
```javascript
// React state update
const [state, setState] = useState({ count: 0, theme: 'light' });

function updateCount(newCount) {
    // Using spread (recommended)
    setState(prevState => ({
        ...prevState,
        count: newCount
    }));
    
    // Using Object.assign (alternative)
    setState(prevState => Object.assign({}, prevState, {
        count: newCount
    }));
}

// Redux reducer pattern
function reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            };
        default:
            return state;
    }
}
```

#### **2. Default Configuration**
```javascript
function createAppConfig(userConfig = {}) {
    const defaults = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
        logging: false
    };
    
    // Using spread (modern)
    const config = {
        ...defaults,
        ...userConfig
    };
    
    // Using Object.assign (alternative)
    const config2 = Object.assign({}, defaults, userConfig);
    
    return config;
}
```

#### **3. Removing Properties**
```javascript
const user = { id: 1, name: 'John', password: 'secret', email: 'john@example.com' };

// Remove password using destructuring and spread
const { password, ...safeUser } = user;
console.log(safeUser); // {id: 1, name: 'John', email: 'john@example.com'}

// Using Object.assign (more verbose)
const safeUser2 = Object.assign({}, user);
delete safeUser2.password;
```

#### **4. Prototype Chain Preservation**
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

const dog = new Animal('Dog');

// Spread loses prototype
const spreadCopy = { ...dog };
console.log(spreadCopy instanceof Animal); // false
// spreadCopy.speak(); // TypeError

// Object.assign also loses prototype
const assignCopy = Object.assign({}, dog);
console.log(assignCopy instanceof Animal); // false

// To preserve prototype
const protoCopy = Object.create(Object.getPrototypeOf(dog));
Object.assign(protoCopy, dog);
console.log(protoCopy instanceof Animal); // true
protoCopy.speak(); // Works
```

### **Edge Cases and Gotchas**

#### **1. Symbol Properties**
```javascript
const symbolKey = Symbol('unique');
const obj = {
    [symbolKey]: 'symbol value',
    regular: 'regular value'
};

// Both spread and Object.assign copy symbol properties
const spreadCopy = { ...obj };
console.log(spreadCopy[symbolKey]); // 'symbol value'

const assignCopy = Object.assign({}, obj);
console.log(assignCopy[symbolKey]); // 'symbol value'
```

#### **2. Non-enumerable Properties**
```javascript
const obj = {};
Object.defineProperty(obj, 'hidden', {
    value: 'not enumerable',
    enumerable: false
});

obj.visible = 'enumerable';

// Neither copies non-enumerable properties
const spreadCopy = { ...obj };
console.log('hidden' in spreadCopy); // false
console.log(spreadCopy.visible); // 'enumerable'

const assignCopy = Object.assign({}, obj);
console.log('hidden' in assignCopy); // false
console.log(assignCopy.visible); // 'enumerable'
```

#### **3. Inheritance**
```javascript
const parent = { inherited: 'from parent' };
const child = Object.create(parent);
child.own = 'own property';

// Spread copies only own enumerable properties
const spreadCopy = { ...child };
console.log(spreadCopy.inherited); // undefined
console.log(spreadCopy.own); // 'own property'

// Object.assign also copies only own enumerable properties
const assignCopy = Object.assign({}, child);
console.log(assignCopy.inherited); // undefined
console.log(assignCopy.own); // 'own property'
```

---

## 8. Mutable vs Immutable Patterns

### **Understanding Mutability**
```javascript
// Mutable: Can be changed after creation
const mutableArray = [1, 2, 3];
mutableArray.push(4); // Changes original
console.log(mutableArray); // [1, 2, 3, 4]

// Immutable: Cannot be changed after creation
const immutableString = 'Hello';
// immutableString[0] = 'J'; // Error in strict mode
const newString = 'J' + immutableString.slice(1); // Create new string
console.log(newString); // 'Jello'
console.log(immutableString); // 'Hello' (unchanged)
```

### **Why Immutability Matters**

#### **1. Predictability**
```javascript
// Mutable approach (unpredictable)
function addItemToCart(cart, item) {
    cart.push(item); // Mutates original
    return cart;
}

const cart = ['apple', 'banana'];
const newCart = addItemToCart(cart, 'orange');
console.log(cart === newCart); // true (same reference)
console.log(cart); // ['apple', 'banana', 'orange'] (changed!)

// Immutable approach (predictable)
function addItemToCartImmutable(cart, item) {
    return [...cart, item]; // Returns new array
}

const cart2 = ['apple', 'banana'];
const newCart2 = addItemToCartImmutable(cart2, 'orange');
console.log(cart2 === newCart2); // false (different reference)
console.log(cart2); // ['apple', 'banana'] (unchanged)
console.log(newCart2); // ['apple', 'banana', 'orange']
```

#### **2. Change Detection**
```javascript
// With mutable objects, change detection is hard
const user = { name: 'John', age: 30 };
const oldUser = user;

user.age = 31; // Mutation
console.log(user === oldUser); // true (same object)
// How to know if something changed?

// With immutable objects, change detection is easy
const newUser = { ...user, age: 31 }; // New object
console.log(user === newUser); // false
// Easy to detect changes: just compare references
```

#### **3. Undo/Redo Functionality**
```javascript
class HistoryTracker {
    constructor(initialState) {
        this.past = [];
        this.present = initialState;
        this.future = [];
    }
    
    commit(newState) {
        // Push current state to past
        this.past.push(this.present);
        // Set new state
        this.present = newState;
        // Clear future (new branch)
        this.future = [];
    }
    
    undo() {
        if (this.past.length === 0) return;
        
        // Move current to future
        this.future.unshift(this.present);
        // Restore from past
        this.present = this.past.pop();
    }
    
    redo() {
        if (this.future.length === 0) return;
        
        // Move current to past
        this.past.push(this.present);
        // Restore from future
        this.present = this.future.shift();
    }
}

// Usage with immutable state
const tracker = new HistoryTracker({ count: 0 });

tracker.commit({ ...tracker.present, count: 1 });
tracker.commit({ ...tracker.present, count: 2 });
console.log(tracker.present.count); // 2

tracker.undo();
console.log(tracker.present.count); // 1

tracker.redo();
console.log(tracker.present.count); // 2
```

### **Immutable Patterns in JavaScript**

#### **1. Using Spread Operator**
```javascript
// Objects
const original = { a: 1, b: { c: 2 } };

// Shallow immutable update
const updated = { ...original, a: 3 };
console.log(original.a); // 1 (unchanged)
console.log(updated.a);  // 3

// Nested updates require deeper copying
const updatedNested = {
    ...original,
    b: { ...original.b, c: 3 }
};
console.log(original.b.c); // 2 (unchanged)
console.log(updatedNested.b.c); // 3

// Arrays
const numbers = [1, 2, 3];

// Add item
const withFour = [...numbers, 4];

// Remove item (by index)
const withoutSecond = [...numbers.slice(0, 1), ...numbers.slice(2)];

// Update item
const updatedArray = numbers.map((item, index) => 
    index === 1 ? 99 : item
);
```

#### **2. Using `Object.freeze()`**
```javascript
// Shallow freeze
const obj = Object.freeze({ a: 1, b: { c: 2 } });

obj.a = 100; // Silently fails in non-strict mode
// TypeError in strict mode

// But nested objects are not frozen!
obj.b.c = 100; // This works!
console.log(obj.b.c); // 100

// Deep freeze function
function deepFreeze(obj) {
    // Retrieve property names
    const propNames = Object.getOwnPropertyNames(obj);
    
    // Freeze properties before freezing self
    for (const name of propNames) {
        const value = obj[name];
        
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    }
    
    return Object.freeze(obj);
}

const deepFrozen = deepFreeze({ a: 1, b: { c: 2 } });
// deepFrozen.b.c = 100; // Error in strict mode
```

#### **3. Using Immutable.js (Third-party Library)**
```javascript
// Example with Immutable.js
// import { Map, List } from 'immutable';

// const map1 = Map({ a: 1, b: 2, c: 3 });
// const map2 = map1.set('b', 50);

// console.log(map1.get('b')); // 2
// console.log(map2.get('b')); // 50

// const list1 = List([1, 2, 3]);
// const list2 = list1.push(4);
```

### **Mutable Patterns (When to Use)**

#### **1. Performance-Critical Code**
```javascript
// Sometimes mutation is necessary for performance
function processLargeArray(arr) {
    // Mutable but faster for large datasets
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i] * 2; // In-place mutation
    }
    return arr;
}

const bigArray = new Array(1000000).fill(1);
const processed = processLargeArray(bigArray); // Faster but mutates
```

#### **2. Building Objects Incrementally**
```javascript
// Building configuration objects
function createConfig(options) {
    const config = {
        baseUrl: 'https://api.example.com',
        timeout: 5000
    };
    
    // Mutable but clear
    if (options.apiKey) {
        config.headers = { 'Authorization': `Bearer ${options.apiKey}` };
    }
    
    if (options.retry) {
        config.retry = { attempts: 3, delay: 1000 };
    }
    
    return config;
}
```

#### **3. Working with DOM Elements**
```javascript
// DOM manipulation is inherently mutable
const element = document.createElement('div');
element.id = 'myElement'; // Mutation
element.className = 'container'; // Mutation
element.textContent = 'Hello World'; // Mutation

// Batch DOM updates for performance
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    fragment.appendChild(li); // Mutable but efficient
}
document.getElementById('list').appendChild(fragment);
```

### **Best Practices**

#### **1. Immutable Updates for State**
```javascript
function updateState(state, updates) {
    return {
        ...state,
        ...updates,
        // Handle nested updates
        profile: state.profile ? { ...state.profile, ...updates.profile } : updates.profile
    };
}

// Or use a utility function
function setIn(obj, path, value) {
    const [first, ...rest] = path;
    
    if (rest.length === 0) {
        return { ...obj, [first]: value };
    }
    
    return {
        ...obj,
        [first]: setIn(obj[first] || {}, rest, value)
    };
}

const state = { user: { profile: { name: 'John' } } };
const newState = setIn(state, ['user', 'profile', 'name'], 'Jane');
console.log(state.user.profile.name); // 'John' (unchanged)
console.log(newState.user.profile.name); // 'Jane'
```

#### **2. Use Const for References**
```javascript
// Good: const prevents reassignment
const items = [1, 2, 3];
// items = [4, 5, 6]; // Error: Assignment to constant

// But const doesn't prevent mutation!
items.push(4); // This works (mutates array)

// For true immutability, freeze or use immutable patterns
const frozenItems = Object.freeze([1, 2, 3]);
// frozenItems.push(4); // Error in strict mode
```

#### **3. Return New Objects from Functions**
```javascript
// Instead of mutating parameters
function badAddItem(list, item) {
    list.push(item); // Mutation
    return list;
}

// Return new arrays/objects
function goodAddItem(list, item) {
    return [...list, item];
}

// Or use functional programming patterns
const addItem = (list, item) => [...list, item];
const removeItem = (list, index) => [
    ...list.slice(0, index),
    ...list.slice(index + 1)
];
```

### **Performance Considerations**

```javascript
// Benchmark: mutable vs immutable
const largeArray = Array.from({ length: 100000 }, (_, i) => i);

console.time('Mutable push');
const mutableResult = [];
for (let i = 0; i < 100000; i++) {
    mutableResult.push(i * 2);
}
console.timeEnd('Mutable push');

console.time('Immutable spread');
let immutableResult = [];
for (let i = 0; i < 100000; i++) {
    immutableResult = [...immutableResult, i * 2]; // Creates new array each time!
}
console.timeEnd('Immutable spread');

console.time('Immutable with push (then freeze)');
const immutableWithPush = [];
for (let i = 0; i < 100000; i++) {
    immutableWithPush.push(i * 2);
}
Object.freeze(immutableWithPush);
console.timeEnd('Immutable with push (then freeze)');
```

### **Real-World Example: Shopping Cart**
```javascript
// Immutable shopping cart implementation
const initialState = {
    items: [],
    total: 0,
    discount: 0
};

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_ITEM':
            const newItem = action.payload;
            const updatedItems = [...state.items, newItem];
            return {
                ...state,
                items: updatedItems,
                total: state.total + newItem.price
            };
            
        case 'REMOVE_ITEM':
            const itemId = action.payload;
            const itemToRemove = state.items.find(item => item.id === itemId);
            if (!itemToRemove) return state;
            
            return {
                ...state,
                items: state.items.filter(item => item.id !== itemId),
                total: state.total - itemToRemove.price
            };
            
        case 'UPDATE_QUANTITY':
            const { itemId: id, quantity } = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === id);
            if (itemIndex === -1) return state;
            
            const oldItem = state.items[itemIndex];
            const updatedItem = { ...oldItem, quantity };
            const newItems = [
                ...state.items.slice(0, itemIndex),
                updatedItem,
                ...state.items.slice(itemIndex + 1)
            ];
            
            const priceDiff = (updatedItem.price * quantity) - 
                             (oldItem.price * oldItem.quantity);
            
            return {
                ...state,
                items: newItems,
                total: state.total + priceDiff
            };
            
        case 'APPLY_DISCOUNT':
            return {
                ...state,
                discount: action.payload
            };
            
        default:
            return state;
    }
}
```

---

## 🎯 Best Practices Summary

### **Destructuring**
- Use object destructuring for cleaner parameter handling
- Use array destructuring for multiple return values
- Combine with default values for robustness
- Use rest operator to collect remaining properties/elements

### **Optional Chaining & Nullish Coalescing**
- Use `?.` for safe property access in nested structures
- Use `??` for default values when you want to preserve falsy values
- Combine both for robust data handling: `data?.value ?? 'default'`

### **Copying Objects**
- Use spread (`...`) for shallow copies (most common case)
- Use `structuredClone()` for deep copies (modern browsers/Node)
- Be aware of JSON methods' limitations (loses functions, Dates, etc.)
- Consider performance implications for large objects

### **Immutability**
- Favor immutable patterns for state management
- Use const declarations to prevent reassignment
- Return new objects/arrays from functions instead of mutating
- Use `Object.freeze()` for true immutability when needed
- Consider mutable patterns only for performance-critical code

### **JSON Handling**
- Use `JSON.stringify()` with replacer for serialization control
- Use `JSON.parse()` with reviver for deserialization control
- Always handle JSON parsing errors with try-catch
- Be aware of circular reference limitations

### **Spread vs Object.assign**
- Prefer spread operator for readability and modern code
- Use `Object.assign()` when you need to mutate a target object
- Both have similar performance characteristics
- Neither copies non-enumerable properties or preserves getters/setters

---

## 📚 Additional Resources

### **Further Reading**
- [MDN: Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [MDN: Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [MDN: Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)

### **Practice Exercises**
1. Implement a deep merge function that handles circular references
2. Create an immutable state manager with undo/redo functionality
3. Build a configuration manager using destructuring and default values
4. Write a safe data access utility using optional chaining and nullish coalescing
5. Implement a JSON serializer that preserves Dates, RegExps, and Functions

---

## ✅ Progress Checklist

- [ ] **Object Destructuring**: Extract properties, rename variables, use defaults, handle nested objects
- [ ] **Array Destructuring**: Extract elements, skip items, use rest operator, swap variables
- [ ] **Optional Chaining**: Safely access nested properties, methods, and array elements
- [ ] **Nullish Coalescing**: Provide defaults for null/undefined while preserving falsy values
- [ ] **Deep Copy vs Shallow Copy**: Understand differences, use appropriate methods, handle edge cases
- [ ] **JSON**: Serialize/deserialize objects, handle special types, use replacer/reviver
- [ ] **Spread vs Object.assign**: Know when to use each, understand differences and limitations
- [ ] **Mutable vs Immutable Patterns**: Implement immutable updates, understand performance trade-offs

---

**Mastering these advanced object and data handling techniques will make you a more effective JavaScript developer. Practice implementing these patterns in real projects!** 🚀