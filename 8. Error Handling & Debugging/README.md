# Error Handling & Debugging - Comprehensive Guide

## 📚 Overview
Master the art of error handling and debugging in JavaScript. This comprehensive guide covers everything from understanding different error types to advanced debugging techniques that will make you a more effective developer.

## 📋 Table of Contents
1. [Types of Errors](#1-types-of-errors)
2. [Stack Trace Reading](#2-stack-trace-reading)
3. [Throwing Custom Errors](#3-throwing-custom-errors)
4. [Debugger & Breakpoints](#4-debugger--breakpoints)
5. [Try / Catch / Finally](#5-try--catch--finally)

---

## 1. Types of Errors

### **Error Hierarchy**
```javascript
// JavaScript Error Hierarchy
Error
├── SyntaxError
├── ReferenceError
├── TypeError
├── RangeError
├── URIError
├── EvalError
├── AggregateError (ES2021)
└── Custom Errors (User-defined)
```

### **SyntaxError**
Occurs when JavaScript code cannot be parsed due to incorrect syntax.

```javascript
// Examples of SyntaxError
1. // Missing parenthesis
function greet() {
    console.log("Hello"
} // SyntaxError: missing ) after argument list

2. // Invalid object literal
const obj = {
    name: "John"
    age: 30 // Missing comma
}; // SyntaxError: Unexpected identifier

3. // Reserved word misuse
const class = "Math"; // SyntaxError: Unexpected token 'class'

4. // Template literal errors
const str = `Hello ${name; // SyntaxError: Unexpected token

5. // Invalid JSON
JSON.parse('{name: "John"}'); // SyntaxError: Unexpected token n in JSON

// Common causes:
// - Missing brackets, parentheses, or braces
// - Missing commas in objects/arrays
// - Using reserved keywords as identifiers
// - Invalid template literals
// - Incorrect JSON syntax
```

### **ReferenceError**
Occurs when trying to access a variable that doesn't exist.

```javascript
// Examples of ReferenceError
1. // Using undeclared variable
console.log(nonExistentVariable); // ReferenceError: nonExistentVariable is not defined

2. // Accessing before declaration (let/const TDZ)
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

3. // Wrong scope access
function outer() {
    const secret = "hidden";
    function inner() {
        console.log(secret); // Works
    }
}
console.log(secret); // ReferenceError: secret is not defined

4. // Misspelled variable
const userName = "John";
console.log(usename); // ReferenceError: usename is not defined

5. // Module import errors
import { nonExistent } from './module.js'; // ReferenceError

// Common causes:
// - Typo in variable name
// - Accessing variable outside scope
// - TDZ violation for let/const
// - Missing imports
```

### **TypeError**
Occurs when an operation is performed on a value of the wrong type.

```javascript
// Examples of TypeError
1. // Calling non-function
const obj = { name: "John" };
obj(); // TypeError: obj is not a function

2. // Reading properties of null/undefined
const user = null;
console.log(user.name); // TypeError: Cannot read properties of null

3. // Changing read-only property
const obj = {};
Object.defineProperty(obj, 'readOnly', {
    value: 'immutable',
    writable: false
});
obj.readOnly = 'new value'; // TypeError: Cannot assign to read only property

4. // Invalid method invocation
const str = "hello";
str.toUpperCase(); // Works
str.push("!"); // TypeError: str.push is not a function

5. // Wrong constructor usage
const num = 42;
new num(); // TypeError: num is not a constructor

6. // Invalid arguments to built-in methods
const arr = [1, 2, 3];
arr.forEach(undefined); // TypeError: undefined is not a function

// Common causes:
// - Calling non-callable values
// - Accessing properties of null/undefined
// - Incorrect use of this
// - Invalid arguments to functions
```

### **RangeError**
Occurs when a value is not within the allowed range.

```javascript
// Examples of RangeError
1. // Array invalid length
const arr = new Array(-1); // RangeError: Invalid array length
const arr2 = new Array(2**32); // RangeError: Invalid array length

2. // Number precision issues
(123).toFixed(101); // RangeError: toFixed() digits argument must be between 0 and 100

3. // Date invalid values
new Date('invalid-date'); // RangeError: Invalid time value

4. // String methods
'hello'.repeat(-1); // RangeError: Invalid count value
'hello'.substring(10, 1); // No error, but returns empty string

5. // Recursion depth
function infiniteRecursion() {
    infiniteRecursion();
}
infiniteRecursion(); // RangeError: Maximum call stack size exceeded

// Common causes:
// - Invalid array length
// - Out of bounds arguments to number methods
// - Invalid date values
// - Infinite recursion
// - Stack overflow
```

### **URIError**
Occurs with incorrect use of URI handling functions.

```javascript
// Examples of URIError
1. // Invalid URI encoding
decodeURIComponent('%'); // URIError: URI malformed
decodeURI('%'); // URIError: URI malformed

2. // Incorrect percent encoding
encodeURI('\uD800'); // URIError: URI malformed (lone surrogate)

3. // Valid examples for comparison
decodeURIComponent('%20'); // " " (space)
encodeURIComponent('hello world'); // "hello%20world"

// Common causes:
// - Malformed URI sequences
// - Incorrect percent encoding
// - Lone surrogates in UTF-16
```

### **EvalError**
Historically used for errors in `eval()`, but not used much in modern JavaScript.

```javascript
// Example (rarely seen)
try {
    throw new EvalError('Eval error occurred');
} catch (error) {
    console.log(error instanceof EvalError); // true
}

// Note: In modern JS, syntax errors in eval() throw SyntaxError instead
```

### **AggregateError (ES2021)**
Represents multiple errors wrapped in a single error.

```javascript
// Example with Promise.any()
const promise1 = Promise.reject(new Error('Error 1'));
const promise2 = Promise.reject(new Error('Error 2'));
const promise3 = Promise.reject(new Error('Error 3'));

Promise.any([promise1, promise2, promise3])
    .catch(error => {
        console.log(error instanceof AggregateError); // true
        console.log(error.errors.length); // 3
        error.errors.forEach((err, i) => {
            console.log(`Error ${i + 1}:`, err.message);
        });
    });

// Creating AggregateError
const errors = [
    new Error('First error'),
    new TypeError('Second error'),
    new RangeError('Third error')
];

const aggregate = new AggregateError(
    errors,
    'Multiple errors occurred'
);

console.log(aggregate.message); // 'Multiple errors occurred'
console.log(aggregate.errors[0].message); // 'First error'
```

### **Checking Error Types**
```javascript
// Using instanceof
try {
    // Some operation that might throw
    JSON.parse('invalid json');
} catch (error) {
    if (error instanceof SyntaxError) {
        console.log('JSON syntax error:', error.message);
    } else if (error instanceof Error) {
        console.log('General error:', error.message);
    }
}

// Using constructor property
try {
    null.function();
} catch (error) {
    console.log(error.constructor.name); // "TypeError"
    console.log(error.constructor === TypeError); // true
}

// Duck typing with name property
function handleError(error) {
    switch (error.name) {
        case 'SyntaxError':
            console.log('Syntax error occurred');
            break;
        case 'ReferenceError':
            console.log('Reference error occurred');
            break;
        case 'TypeError':
            console.log('Type error occurred');
            break;
        case 'RangeError':
            console.log('Range error occurred');
            break;
        default:
            console.log('Unknown error:', error.name);
    }
}
```

### **Common Error Patterns and Prevention**

#### **1. Null/Undefined Access Prevention**
```javascript
// Dangerous
function getUserName(user) {
    return user.name; // TypeError if user is null/undefined
}

// Safe with optional chaining
function getUserNameSafe(user) {
    return user?.name; // Returns undefined if user is null/undefined
}

// Safe with default value
function getUserNameDefault(user) {
    return (user && user.name) || 'Anonymous';
}

// Using nullish coalescing
function getUserNameModern(user) {
    return user?.name ?? 'Anonymous';
}
```

#### **2. Function Argument Validation**
```javascript
// Unsafe function
function calculateArea(width, height) {
    return width * height; // NaN if arguments are not numbers
}

// Safe with validation
function calculateAreaSafe(width, height) {
    if (typeof width !== 'number' || typeof height !== 'number') {
        throw new TypeError('Width and height must be numbers');
    }
    
    if (width <= 0 || height <= 0) {
        throw new RangeError('Width and height must be positive numbers');
    }
    
    return width * height;
}

// Using default parameters
function calculateAreaWithDefaults(width = 0, height = 0) {
    return width * height;
}
```

#### **3. Array Bounds Checking**
```javascript
// Unsafe array access
function getFirstElement(arr) {
    return arr[0]; // Returns undefined for empty array
}

// Safe array access
function getFirstElementSafe(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('Argument must be an array');
    }
    
    if (arr.length === 0) {
        throw new RangeError('Array cannot be empty');
    }
    
    return arr[0];
}

// Using optional chaining and nullish coalescing
function getFirstElementModern(arr) {
    return arr?.[0] ?? null;
}
```

---

## 2. Stack Trace Reading

### **What is a Stack Trace?**
A stack trace is a report of the active stack frames at a certain point in time during the execution of a program.

### **Basic Stack Trace Example**
```javascript
function level1() {
    level2();
}

function level2() {
    level3();
}

function level3() {
    throw new Error('Something went wrong!');
}

try {
    level1();
} catch (error) {
    console.error(error.stack);
}

/*
Error: Something went wrong!
    at level3 (file.js:8:11)
    at level2 (file.js:4:5)
    at level1 (file.js:1:5)
    at file.js:12:5
*/
```

### **Anatomy of a Stack Trace**
```javascript
function example() {
    // Each stack frame shows:
    // 1. Function name (or <anonymous>)
    // 2. File location (file.js)
    // 3. Line number (:10)
    // 4. Column number (:15)
    throw new Error('Detailed error');
}

try {
    example();
} catch (error) {
    console.log(error.stack);
    /*
    Error: Detailed error
        at example (file.js:10:15)  // functionName (fileName:line:column)
        at file.js:15:5
    */
}
```

### **Async Stack Traces**
```javascript
// Traditional async (lost context)
function asyncOperation() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                throw new Error('Async error');
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

asyncOperation().catch(error => {
    console.log('Traditional async stack:');
    console.log(error.stack);
    /*
    Error: Async error
        at Timeout._onTimeout (file.js:5:23)
    ← Missing original call site!
    */
});

// Async/await with better stacks (Node.js 16+)
async function asyncWithAwait() {
    await Promise.resolve();
    throw new Error('Async/await error');
}

async function main() {
    try {
        await asyncWithAwait();
    } catch (error) {
        console.log('Async/await stack:');
        console.log(error.stack);
        /*
        Error: Async/await error
            at asyncWithAwait (file.js:25:11)
            at main (file.js:30:9)  ← Preserved async context!
        */
    }
}

main();
```

### **Error Stack Property**
```javascript
const error = new Error('Test error');

// Stack is a non-standard but widely supported property
console.log(typeof error.stack); // "string"

// Stack is generated when error is thrown/constructed
function checkStackGeneration() {
    const error1 = new Error('Error 1');
    console.log(error1.stack); // Has stack immediately
    
    // Stack includes constructor call
    // Error: Error 1
    //     at checkStackGeneration (file.js:2:20)
}

// Manipulating stack trace
Error.prepareStackTrace = function(error, structuredStackTrace) {
    // Custom stack trace formatting
    return structuredStackTrace.map(callSite => {
        return `${callSite.getFileName()}:${callSite.getLineNumber()}`;
    }).join('\n');
};

// Stack trace limit
Error.stackTraceLimit = 10; // Default is 10, can be increased
```

### **Reading Complex Stack Traces**
```javascript
// Example with multiple files and async operations
// server.js
const express = require('express');
const userService = require('./services/userService');

const app = express();

app.get('/users/:id', async (req, res) => {
    try {
        const user = await userService.getUser(req.params.id);
        res.json(user);
    } catch (error) {
        console.error('Stack trace:');
        console.error(error.stack);
        res.status(500).json({ error: error.message });
    }
});

// services/userService.js
const database = require('./database');

async function getUser(id) {
    if (!id) {
        throw new Error('User ID is required');
    }
    
    const user = await database.findUser(id);
    
    if (!user) {
        throw new Error(`User ${id} not found`);
    }
    
    return transformUser(user);
}

function transformUser(user) {
    // Simulate an error
    return user.nonExistentProperty.toUpperCase(); // TypeError
}

// database.js
async function findUser(id) {
    // Simulate database call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: 'John Doe' });
        }, 100);
    });
}

/*
Sample stack trace when accessing /users/123:

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at transformUser (/project/services/userService.js:15:37)
    at getUser (/project/services/userService.js:12:12)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async /project/server.js:10:24

Interpretation:
1. Error occurred in transformUser at line 15, column 37
2. Called from getUser at line 12
3. Through async promise handling
4. Original route handler at server.js line 10
*/
```

### **Stack Trace Analysis Tools**
```javascript
// Custom stack trace parser
function analyzeStackTrace(stackString) {
    const lines = stackString.split('\n');
    
    // Remove error message line
    const errorLine = lines[0];
    const stackLines = lines.slice(1);
    
    const analysis = {
        errorMessage: errorLine.replace('Error: ', ''),
        frames: [],
        containsNodeModules: false,
        containsAsync: false
    };
    
    stackLines.forEach(line => {
        const frame = parseStackFrame(line.trim());
        if (frame) {
            analysis.frames.push(frame);
            
            if (frame.file.includes('node_modules')) {
                analysis.containsNodeModules = true;
            }
            
            if (frame.function.includes('async') || 
                frame.function.includes('Promise')) {
                analysis.containsAsync = true;
            }
        }
    });
    
    return analysis;
}

function parseStackFrame(line) {
    // Match patterns like:
    // "at functionName (file.js:10:15)"
    // "at file.js:10:15"
    const match = line.match(/at\s+(.+?)\s+\((.+):(\d+):(\d+)\)/) ||
                  line.match(/at\s+(.+):(\d+):(\d+)/);
    
    if (!match) return null;
    
    return {
        function: match[1] || '<anonymous>',
        file: match[2] || match[1],
        line: parseInt(match[3] || match[2]),
        column: parseInt(match[4] || match[3])
    };
}

// Usage
try {
    throw new Error('Test error');
} catch (error) {
    const analysis = analyzeStackTrace(error.stack);
    console.log(analysis);
}
```

### **Source Maps and Stack Traces**
```javascript
// Source maps translate minified/transpiled code back to original source

// webpack.config.js - Source map configuration
module.exports = {
    devtool: 'source-map', // Generates .map files
    // Options:
    // 'eval' - Fastest, no source maps
    // 'source-map' - Complete source maps (production)
    // 'eval-source-map' - Good for development
    // 'cheap-module-source-map' - Faster, less detailed
};

// Error in minified code with source maps
/*
Minified error:
TypeError: Cannot read property 'n' of undefined
    at r (app.min.js:1:12345)
    at e (app.min.js:1:54321)

With source maps (browser dev tools show):
TypeError: Cannot read property 'name' of undefined
    at getUserName (src/utils.js:15:10)
    at renderProfile (src/components/Profile.js:42:5)
*/

// Source map debugging tips:
// 1. Ensure source maps are generated
// 2. Check source maps are served correctly
// 3. Verify browser dev tools can map sources
// 4. For Node.js, use --enable-source-maps flag
//    node --enable-source-maps app.js
```

### **Common Stack Trace Issues and Solutions**

#### **1. Missing Stack Traces in Promises**
```javascript
// Problem: Lost stack traces in promise chains
Promise.resolve()
    .then(() => {
        throw new Error('Promise error');
    })
    .catch(error => {
        console.log(error.stack); // Missing original context
    });

// Solution: Use async/await
async function promiseWithStack() {
    try {
        await Promise.resolve();
        throw new Error('Async error');
    } catch (error) {
        console.log(error.stack); // Preserves stack
    }
}

// Solution: Capture stack at error creation
function createErrorWithStack(message) {
    const error = new Error(message);
    Error.captureStackTrace(error, createErrorWithStack); // Node.js only
    return error;
}
```

#### **2. Truncated Stack Traces**
```javascript
// Problem: Deep recursion truncates stack
function recursiveFunction(depth) {
    if (depth <= 0) {
        throw new Error('Deep error');
    }
    return recursiveFunction(depth - 1);
}

try {
    recursiveFunction(50); // Might truncate
} catch (error) {
    console.log(error.stack.split('\n').length); // Might be limited
}

// Solution: Increase stack trace limit
Error.stackTraceLimit = 50; // Increase from default 10

// Solution: Use iterative approach for deep operations
function iterativeFunction(depth) {
    while (depth > 0) {
        depth--;
    }
    throw new Error('Iterative error');
}
```

#### **3. Unhelpful Anonymous Functions**
```javascript
// Problem: Anonymous functions in stack traces
const operations = {
    process: function() { // Anonymous in stack
        throw new Error('Processing error');
    }
};

// Solution: Use named function expressions
const operationsFixed = {
    process: function processData() { // Named
        throw new Error('Processing error');
    }
};

// Solution: Use arrow functions with variable names
const processData = () => {
    throw new Error('Processing error');
};

// Solution: Add displayName for debugging
const anonymousFunc = function() {
    throw new Error('Anonymous error');
};
anonymousFunc.displayName = 'dataProcessor';
```

---

## 3. Throwing Custom Errors

### **Basic Error Throwing**
```javascript
// Throwing built-in errors
throw new Error('Something went wrong');
throw new TypeError('Expected a number');
throw new RangeError('Value out of range');
throw new SyntaxError('Invalid syntax');

// Throwing any value (not recommended)
throw 'Simple string error'; // Becomes Error with string as message
throw 42; // Becomes Error with number as message
throw { code: 500, message: 'Server error' }; // Object as error

// Best practice: Always throw Error objects
function validateInput(input) {
    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string');
    }
    
    if (input.length === 0) {
        throw new Error('Input cannot be empty');
    }
    
    if (input.length > 100) {
        throw new RangeError('Input too long (max 100 characters)');
    }
}
```

### **Creating Custom Error Classes**
```javascript
// Basic custom error
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.timestamp = new Date().toISOString();
    }
}

// Usage
function validateAge(age) {
    if (typeof age !== 'number') {
        throw new ValidationError('Age must be a number');
    }
    
    if (age < 0) {
        throw new ValidationError('Age cannot be negative');
    }
    
    if (age > 150) {
        throw new ValidationError('Age seems unrealistic');
    }
}

try {
    validateAge(-5);
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(`Validation failed: ${error.message} at ${error.timestamp}`);
    }
}
```

### **Advanced Custom Error Patterns**

#### **1. Error with Additional Properties**
```javascript
class APIError extends Error {
    constructor(message, statusCode, url, details = {}) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.url = url;
        this.details = details;
        this.timestamp = new Date().toISOString();
        
        // Capture stack trace (Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError);
        }
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            url: this.url,
            timestamp: this.timestamp,
            details: this.details
        };
    }
    
    toString() {
        return `[${this.name}] ${this.message} (Status: ${this.statusCode})`;
    }
}

// Usage
async function fetchData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new APIError(
            `Request failed with status ${response.status}`,
            response.status,
            url,
            { headers: Object.fromEntries(response.headers) }
        );
    }
    
    return response.json();
}
```

#### **2. Hierarchical Error System**
```javascript
// Base application error
class AppError extends Error {
    constructor(message, code = 'APP_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.timestamp = new Date();
    }
}

// Specific error types
class DatabaseError extends AppError {
    constructor(message, query) {
        super(message, 'DATABASE_ERROR');
        this.query = query;
    }
}

class NetworkError extends AppError {
    constructor(message, url, statusCode) {
        super(message, 'NETWORK_ERROR');
        this.url = url;
        this.statusCode = statusCode;
    }
}

class AuthenticationError extends AppError {
    constructor(message, userId) {
        super(message, 'AUTHENTICATION_ERROR');
        this.userId = userId;
        this.isRetryable = false;
    }
}

class RateLimitError extends AppError {
    constructor(message, retryAfter) {
        super(message, 'RATE_LIMIT_ERROR');
        this.retryAfter = retryAfter;
        this.isRetryable = true;
    }
}

// Usage
async function getUserData(userId) {
    try {
        // Simulate database operation
        if (Math.random() > 0.8) {
            throw new DatabaseError('Connection failed', 'SELECT * FROM users');
        }
        
        // Simulate authentication
        if (!userId) {
            throw new AuthenticationError('User not authenticated', userId);
        }
        
        return { id: userId, name: 'John' };
        
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.error('Database issue:', error.query);
            // Retry logic
        } else if (error instanceof AuthenticationError) {
            console.error('Auth failed for user:', error.userId);
            // Redirect to login
        }
        throw error;
    }
}
```

#### **3. Error Factory Pattern**
```javascript
class ErrorFactory {
    static createValidationError(field, message, value) {
        const error = new Error(`Validation failed for ${field}: ${message}`);
        error.name = 'ValidationError';
        error.field = field;
        error.value = value;
        error.code = 'VALIDATION_ERROR';
        return error;
    }
    
    static createNotFoundError(resource, id) {
        const error = new Error(`${resource} with ID ${id} not found`);
        error.name = 'NotFoundError';
        error.resource = resource;
        error.id = id;
        error.code = 'NOT_FOUND';
        error.statusCode = 404;
        return error;
    }
    
    static createPermissionError(action, resource) {
        const error = new Error(`Permission denied for ${action} on ${resource}`);
        error.name = 'PermissionError';
        error.action = action;
        error.resource = resource;
        error.code = 'PERMISSION_DENIED';
        error.statusCode = 403;
        return error;
    }
    
    static wrapError(originalError, context) {
        const wrapped = new Error(`[${context}] ${originalError.message}`);
        wrapped.name = 'WrappedError';
        wrapped.originalError = originalError;
        wrapped.context = context;
        wrapped.stack = `${wrapped.stack}\nCaused by: ${originalError.stack}`;
        return wrapped;
    }
}

// Usage
function validateUser(user) {
    if (!user.email) {
        throw ErrorFactory.createValidationError(
            'email',
            'Email is required',
            user.email
        );
    }
    
    if (!user.email.includes('@')) {
        throw ErrorFactory.createValidationError(
            'email',
            'Invalid email format',
            user.email
        );
    }
}

async function findProduct(id) {
    const product = await database.find(id);
    if (!product) {
        throw ErrorFactory.createNotFoundError('Product', id);
    }
    return product;
}
```

### **Error Serialization and Logging**
```javascript
class SerializableError extends Error {
    constructor(message, metadata = {}) {
        super(message);
        this.name = this.constructor.name;
        this.metadata = metadata;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
            timestamp: this.timestamp,
            metadata: this.metadata
        };
    }
    
    static fromJSON(json) {
        const error = new SerializableError(json.message, json.metadata);
        error.name = json.name;
        error.stack = json.stack;
        error.timestamp = json.timestamp;
        return error;
    }
}

// Error logging service
class ErrorLogger {
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    
    log(error, context = {}) {
        const logEntry = {
            service: this.serviceName,
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...(error.toJSON ? error.toJSON() : {})
            },
            context: {
                userId: context.userId,
                requestId: context.requestId,
                url: context.url,
                ...context
            }
        };
        
        // Send to logging service
        this.sendToLoggingService(logEntry);
        
        // Also log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error logged:', logEntry);
        }
    }
    
    sendToLoggingService(logEntry) {
        // Implementation for services like:
        // - Sentry
        // - LogRocket
        // - Datadog
        // - CloudWatch
        console.log('Sending to logging service:', logEntry);
    }
}

// Usage
const logger = new ErrorLogger('user-service');

try {
    validateUser({});
} catch (error) {
    logger.log(error, {
        userId: '123',
        requestId: 'req-456',
        url: '/api/users'
    });
    
    // Re-throw for upstream handling
    throw error;
}
```

### **Error Recovery Strategies**
```javascript
class ResilientOperation {
    constructor(operation, options = {}) {
        this.operation = operation;
        this.maxRetries = options.maxRetries || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.retryableErrors = options.retryableErrors || [
            'NetworkError',
            'TimeoutError',
            'DatabaseError'
        ];
    }
    
    async execute(...args) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await this.operation(...args);
            } catch (error) {
                lastError = error;
                
                // Check if error is retryable
                if (!this.isRetryable(error) || attempt === this.maxRetries) {
                    throw error;
                }
                
                console.log(`Attempt ${attempt} failed, retrying in ${this.retryDelay}ms`);
                await this.delay(this.retryDelay * attempt); // Exponential backoff
            }
        }
        
        throw lastError;
    }
    
    isRetryable(error) {
        return this.retryableErrors.some(errorType => 
            error.name === errorType || error.constructor.name === errorType
        );
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage
const fetchWithRetry = new ResilientOperation(
    async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    },
    {
        maxRetries: 3,
        retryDelay: 1000,
        retryableErrors: ['Error', 'TypeError'] // Retry on network errors
    }
);

// Will retry on failure
try {
    const data = await fetchWithRetry.execute('https://api.example.com/data');
} catch (error) {
    console.error('All retries failed:', error);
}
```

### **Error Boundary Pattern (React-inspired)**
```javascript
class ErrorBoundary {
    constructor(handler, options = {}) {
        this.handler = handler;
        this.fallback = options.fallback || (() => null);
        this.maxErrors = options.maxErrors || 5;
        this.errorWindow = options.errorWindow || 60000; // 1 minute
        this.errorCount = 0;
        this.lastErrorTime = null;
    }
    
    execute(operation, ...args) {
        // Check rate limiting
        if (this.isRateLimited()) {
            return this.fallback();
        }
        
        try {
            const result = operation(...args);
            
            // Handle promises
            if (result && typeof result.then === 'function') {
                return result.catch(error => {
                    this.handleError(error);
                    return this.fallback();
                });
            }
            
            return result;
            
        } catch (error) {
            this.handleError(error);
            return this.fallback();
        }
    }
    
    handleError(error) {
        this.errorCount++;
        this.lastErrorTime = Date.now();
        
        // Call error handler
        this.handler(error, {
            count: this.errorCount,
            timestamp: this.lastErrorTime
        });
    }
    
    isRateLimited() {
        if (!this.lastErrorTime) return false;
        
        const timeSinceLastError = Date.now() - this.lastErrorTime;
        
        // Reset counter if window has passed
        if (timeSinceLastError > this.errorWindow) {
            this.errorCount = 0;
            this.lastErrorTime = null;
            return false;
        }
        
        // Check if max errors exceeded
        return this.errorCount >= this.maxErrors;
    }
    
    reset() {
        this.errorCount = 0;
        this.lastErrorTime = null;
    }
}

// Usage
const apiBoundary = new ErrorBoundary(
    (error, stats) => {
        console.error(`API Error (${stats.count} errors):`, error);
        // Send to monitoring service
    },
    {
        fallback: () => ({ data: null, error: true }),
        maxErrors: 10,
        errorWindow: 60000
    }
);

// Safe API call
const result = apiBoundary.execute(async () => {
    const response = await fetch('/api/data');
    return response.json();
});
```

---

## 4. Debugger & Breakpoints

### **Using the debugger Statement**
```javascript
// Basic debugger statement
function calculateTotal(items) {
    let total = 0;
    
    debugger; // Execution pauses here
    
    for (let item of items) {
        total += item.price * item.quantity;
        
        if (total > 1000) {
            debugger; // Conditional breakpoint
            console.log('Total exceeded 1000');
        }
    }
    
    return total;
}

// Debugger in loops
function processArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        debugger; // Pause on each iteration
        
        const item = arr[i];
        console.log(`Processing item ${i}:`, item);
    }
}

// Conditional debugging
const DEBUG = process.env.NODE_ENV === 'development';

function debugIfNeeded() {
    if (DEBUG) {
        debugger; // Only pauses in development
    }
    
    // Rest of the function
}
```

### **Browser DevTools Breakpoints**

#### **1. Line-of-Code Breakpoints**
```javascript
function processOrder(order) {
    // Set breakpoint on next line in DevTools
    const items = order.items;
    const subtotal = calculateSubtotal(items); // Line breakpoint here
    
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(order);
    
    const total = subtotal + tax + shipping;
    
    return {
        subtotal,
        tax,
        shipping,
        total
    };
}

// Multiple breakpoints
function complexCalculation(a, b, c) {
    let result = a + b;    // Breakpoint 1
    result *= c;          // Breakpoint 2
    
    if (result > 100) {
        result /= 2;      // Breakpoint 3
    }
    
    return result;        // Breakpoint 4
}
```

#### **2. Conditional Breakpoints**
```javascript
function findUser(users, userId) {
    for (let user of users) {
        // Set conditional breakpoint in DevTools:
        // Right-click line number → Add conditional breakpoint
        // Condition: user.id === 42
        
        if (user.id === userId) {
            return user;
        }
    }
    return null;
}

// Complex conditions
function filterProducts(products, category, minPrice) {
    return products.filter(product => {
        // Conditional breakpoint:
        // product.price > 100 && product.category === 'electronics'
        
        return product.category === category && 
               product.price >= minPrice;
    });
}
```

#### **3. DOM Breakpoints**
```html
<div id="content">
    <button id="myButton">Click me</button>
</div>

<script>
// In DevTools Elements panel:
// 1. Right-click element → Break on → Subtree modifications
// 2. Right-click element → Break on → Attribute modifications
// 3. Right-click element → Break on → Node removal

const button = document.getElementById('myButton');
const content = document.getElementById('content');

// These will trigger DOM breakpoints:
button.setAttribute('data-clicked', 'true'); // Attribute modification
content.innerHTML = '<p>Changed</p>'; // Subtree modification
button.remove(); // Node removal
</script>
```

#### **4. Event Listener Breakpoints**
```javascript
// In DevTools Sources panel:
// 1. Open "Event Listener Breakpoints" section
// 2. Expand categories (Mouse, Keyboard, etc.)
// 3. Check specific events

document.getElementById('myButton').addEventListener('click', function() {
    console.log('Button clicked'); // Pauses when event fires
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        console.log('Enter pressed'); // Pauses on keydown
    }
});

// XHR/Fetch breakpoints
// In DevTools → Sources → XHR/fetch Breakpoints
// Add URL containing "api" to break on all API calls

fetch('/api/users')
    .then(response => response.json())
    .then(data => {
        console.log('Users:', data); // Pauses when fetch starts
    });
```

### **Node.js Debugging**

#### **1. Using inspect flag**
```bash
# Start Node.js with inspector
node --inspect app.js
# Or for break on start
node --inspect-brk app.js

# With specific port
node --inspect=9229 app.js

# Then open Chrome and navigate to:
chrome://inspect
# Click "Open dedicated DevTools for Node"
```

#### **2. Debugging in VS Code**
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": ["<node_internals>/**"],
            "program": "${workspaceFolder}/app.js"
        },
        {
            "type": "node",
            "request": "attach",
            "name": "Attach to Process",
            "port": 9229,
            "skipFiles": ["<node_internals>/**"]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Current File",
            "program": "${file}",
            "console": "integratedTerminal"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Jest Tests",
            "program": "${workspaceFolder}/node_modules/.bin/jest",
            "args": ["--runInBand"],
            "console": "integratedTerminal"
        }
    ]
}
```

#### **3. Debugging with Nodemon**
```json
// package.json
{
    "scripts": {
        "dev:debug": "nodemon --inspect app.js"
    }
}

// Or with custom configuration
{
    "scripts": {
        "dev:debug": "nodemon --inspect=9229 --signal SIGINT app.js"
    }
}
```

### **Advanced Debugging Techniques**

#### **1. Watch Expressions**
```javascript
function calculateStatistics(numbers) {
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    
    for (let num of numbers) {
        sum += num;
        
        // In DevTools Watch panel, add:
        // sum, min, max, num
        
        if (num < min) min = num;
        if (num > max) max = num;
    }
    
    const average = sum / numbers.length;
    
    return { sum, average, min, max };
}

// Complex watch expressions
function processUserData(users) {
    // Watch expressions:
    // users.length
    // users.filter(u => u.active).length
    // users.map(u => u.age).reduce((a, b) => a + b, 0)
    // users.find(u => u.id === 42)
    
    return users
        .filter(user => user.active)
        .map(user => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`
        }));
}
```

#### **2. Call Stack Inspection**
```javascript
function levelOne() {
    const a = 1;
    levelTwo(a);
}

function levelTwo(x) {
    const b = x * 2;
    levelThree(b);
}

function levelThree(y) {
    const c = y + 3;
    debugger; // Inspect call stack here
    
    // In DevTools Call Stack panel:
    // 1. levelThree (current)
    // 2. levelTwo
    // 3. levelOne
    // 4. (anonymous) or global
    
    // Click on stack frames to see their local variables
    console.log(c);
}

levelOne();
```

#### **3. Scope Chain Debugging**
```javascript
const globalVar = 'I am global';

function outer() {
    const outerVar = 'I am in outer';
    
    function inner() {
        const innerVar = 'I am in inner';
        debugger; // Inspect scope chain
        
        // Scope chain in DevTools:
        // 1. Local (inner): innerVar
        // 2. Closure (outer): outerVar
        // 3. Global: globalVar, console, etc.
        
        console.log(innerVar, outerVar, globalVar);
    }
    
    inner();
}

outer();
```

### **Debugging Async Code**
```javascript
// Debugging promises
async function fetchUserData(userId) {
    debugger; // Breakpoint 1
    
    try {
        const response = await fetch(`/api/users/${userId}`);
        debugger; // Breakpoint 2 (after fetch)
        
        const data = await response.json();
        debugger; // Breakpoint 3 (after parsing)
        
        return data;
    } catch (error) {
        debugger; // Breakpoint 4 (error case)
        console.error('Failed to fetch user:', error);
        throw error;
    }
}

// Debugging event loops
function debugEventLoop() {
    console.log('1. Sync code');
    
    setTimeout(() => {
        console.log('2. setTimeout');
        debugger; // Macro task
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('3. Promise');
        debugger; // Micro task
    });
    
    console.log('4. More sync code');
}

// Using async call stack (DevTools settings)
// Enable "Async" checkbox in Call Stack panel
```

### **Performance Debugging**
```javascript
// Using console.time()
function expensiveOperation() {
    console.time('expensiveOperation');
    
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
    }
    
    console.timeEnd('expensiveOperation');
    return result;
}

// Performance marks
function measurePerformance() {
    performance.mark('start');
    
    // Code to measure
    const data = processLargeDataset();
    
    performance.mark('end');
    performance.measure('processData', 'start', 'end');
    
    const measures = performance.getEntriesByName('processData');
    console.log('Duration:', measures[0].duration, 'ms');
}

// Memory profiling
function checkMemoryUsage() {
    const used = process.memoryUsage(); // Node.js
    console.log({
        rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(used.external / 1024 / 1024)} MB`
    });
}
```

### **Debugging Tools and Utilities**

#### **1. Custom Debug Logger**
```javascript
class DebugLogger {
    constructor(namespace, options = {}) {
        this.namespace = namespace;
        this.enabled = options.enabled ?? process.env.NODE_ENV !== 'production';
        this.level = options.level || 'debug';
        this.colors = {
            debug: '\x1b[36m', // Cyan
            info: '\x1b[32m',  // Green
            warn: '\x1b[33m',  // Yellow
            error: '\x1b[31m', // Red
            reset: '\x1b[0m'   // Reset
        };
    }
    
    log(level, message, ...args) {
        if (!this.enabled || !this.shouldLog(level)) return;
        
        const timestamp = new Date().toISOString();
        const color = this.colors[level] || this.colors.reset;
        
        console.log(
            `${color}[${timestamp}] [${this.namespace}] [${level.toUpperCase()}] ${message}${this.colors.reset}`,
            ...args
        );
    }
    
    debug(message, ...args) {
        this.log('debug', message, ...args);
    }
    
    info(message, ...args) {
        this.log('info', message, ...args);
    }
    
    warn(message, ...args) {
        this.log('warn', message, ...args);
    }
    
    error(message, ...args) {
        this.log('error', message, ...args);
    }
    
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }
    
    enable() {
        this.enabled = true;
    }
    
    disable() {
        this.enabled = false;
    }
}

// Usage
const logger = new DebugLogger('API', { level: 'debug' });

async function fetchData(url) {
    logger.debug('Fetching data from:', url);
    
    try {
        const response = await fetch(url);
        logger.info('Response status:', response.status);
        
        const data = await response.json();
        logger.debug('Data received:', data);
        
        return data;
    } catch (error) {
        logger.error('Fetch failed:', error);
        throw error;
    }
}
```

#### **2. Debugging Proxy**
```javascript
function createDebugProxy(obj, name = 'Object') {
    return new Proxy(obj, {
        get(target, property) {
            const value = target[property];
            
            if (typeof value === 'function') {
                return function(...args) {
                    console.log(`[${name}] Calling ${property} with args:`, args);
                    
                    try {
                        const result = value.apply(target, args);
                        console.log(`[${name}] ${property} returned:`, result);
                        return result;
                    } catch (error) {
                        console.error(`[${name}] ${property} threw error:`, error);
                        throw error;
                    }
                };
            }
            
            console.log(`[${name}] Accessing property ${property}:`, value);
            return value;
        },
        
        set(target, property, value) {
            console.log(`[${name}] Setting ${property} to:`, value);
            target[property] = value;
            return true;
        }
    });
}

// Usage
const api = {
    getUser: async (id) => ({ id, name: 'John' }),
    saveUser: async (user) => ({ saved: true })
};

const debugApi = createDebugProxy(api, 'API');
await debugApi.getUser(123); // Logs calls and returns
```

---

## 5. Try / Catch / Finally

### **Basic Syntax**
```javascript
// Basic try-catch
try {
    // Code that might throw an error
    const result = riskyOperation();
    console.log('Success:', result);
} catch (error) {
    // Handle the error
    console.error('Error occurred:', error.message);
}

// With finally
try {
    console.log('Attempting operation...');
    const result = riskyOperation();
    console.log('Success:', result);
} catch (error) {
    console.error('Failed:', error.message);
} finally {
    console.log('Cleanup complete'); // Always executes
}

// Multiple operations in try
try {
    const data = fetchData();
    const processed = processData(data);
    const saved = saveData(processed);
    console.log('All operations successful');
} catch (error) {
    console.error('Operation failed:', error.message);
}
```

### **Error Object Properties**
```javascript
try {
    JSON.parse('invalid json');
} catch (error) {
    console.log('Error name:', error.name); // "SyntaxError"
    console.log('Error message:', error.message); // "Unexpected token i in JSON"
    console.log('Error stack:', error.stack); // Stack trace
    console.log('Constructor:', error.constructor.name); // "SyntaxError"
    
    // Additional properties for custom errors
    if (error.code) {
        console.log('Error code:', error.code);
    }
    
    if (error.timestamp) {
        console.log('Error timestamp:', error.timestamp);
    }
}
```

### **Nested Try-Catch**
```javascript
function processWithFallback(data) {
    try {
        // Primary processing
        return processData(data);
    } catch (primaryError) {
        console.log('Primary processing failed:', primaryError.message);
        
        try {
            // Fallback processing
            return fallbackProcess(data);
        } catch (fallbackError) {
            console.log('Fallback also failed:', fallbackError.message);
            
            // Ultimate fallback
            return { error: true, message: 'All processing failed' };
        }
    }
}

// Nested with different error types
try {
    try {
        // Inner try for specific operation
        const parsed = JSON.parse(userInput);
        console.log('Parsed:', parsed);
    } catch (parseError) {
        if (parseError instanceof SyntaxError) {
            console.log('Invalid JSON, using default');
            throw new Error('Invalid input format'); // Re-throw with custom message
        }
        throw parseError; // Re-throw other errors
    }
} catch (outerError) {
    console.log('Outer catch:', outerError.message);
}
```

### **Error Propagation**
```javascript
// Errors bubble up through call stack
function level1() {
    try {
        level2();
    } catch (error) {
        console.log('Level1 caught:', error.message);
        throw new Error('Enhanced error', { cause: error }); // ES2022
    }
}

function level2() {
    level3(); // Error bubbles up from here
}

function level3() {
    throw new Error('Original error from level3');
}

try {
    level1();
} catch (error) {
    console.log('Final catch:', error.message);
    console.log('Caused by:', error.cause?.message); // ES2022
}

// Async error propagation
async function asyncChain() {
    try {
        const data = await fetchData();
        const processed = await processAsync(data);
        return await saveAsync(processed);
    } catch (error) {
        console.log('Async chain error:', error.message);
        throw error; // Propagate to caller
    }
}

asyncChain().catch(error => {
    console.log('Top-level async catch:', error.message);
});
```

### **Finally Block Behavior**
```javascript
// Finally always executes
function testFinally() {
    try {
        console.log('Try block');
        throw new Error('Test error');
    } catch (error) {
        console.log('Catch block:', error.message);
        return 'Return from catch'; // Finally still executes
    } finally {
        console.log('Finally block - always executes');
    }
    
    console.log('This never runs'); // Unreachable
}

const result = testFinally();
console.log('Result:', result); // "Return from catch"

// Finally with return override
function finallyReturn() {
    try {
        return 'Try return';
    } finally {
        console.log('Finally executing');
        return 'Finally return'; // Overrides try return
    }
}

console.log(finallyReturn()); // "Finally return"

// Finally with throw
function finallyThrow() {
    try {
        throw new Error('Try error');
    } finally {
        throw new Error('Finally error'); // This wins
    }
}

try {
    finallyThrow();
} catch (error) {
    console.log('Caught:', error.message); // "Finally error"
}
```

### **Patterns and Best Practices**

#### **1. Resource Cleanup**
```javascript
// File handling
let fileHandle;
try {
    fileHandle = await openFile('data.txt');
    const content = await fileHandle.read();
    return processContent(content);
} catch (error) {
    console.error('File operation failed:', error);
    throw error;
} finally {
    if (fileHandle) {
        await fileHandle.close(); // Always close file
    }
}

// Database connections
let connection;
try {
    connection = await connectToDatabase();
    const result = await connection.query('SELECT * FROM users');
    return result;
} catch (error) {
    console.error('Database error:', error);
    throw error;
} finally {
    if (connection) {
        await connection.disconnect(); // Always disconnect
    }
}
```

#### **2. Transaction Pattern**
```javascript
class Transaction {
    constructor() {
        this.operations = [];
        this.committed = false;
    }
    
    addOperation(operation) {
        this.operations.push(operation);
    }
    
    async execute() {
        try {
            // Execute all operations
            const results = [];
            for (const op of this.operations) {
                results.push(await op());
            }
            
            this.committed = true;
            return results;
            
        } catch (error) {
            // Rollback on error
            await this.rollback();
            throw error;
        }
    }
    
    async rollback() {
        if (!this.committed) {
            console.log('Rolling back transaction');
            // Implement rollback logic
        }
    }
}

// Usage
async function transferMoney(fromAccount, toAccount, amount) {
    const transaction = new Transaction();
    
    transaction.addOperation(async () => {
        await withdraw(fromAccount, amount);
    });
    
    transaction.addOperation(async () => {
        await deposit(toAccount, amount);
    });
    
    try {
        await transaction.execute();
        console.log('Transfer successful');
    } catch (error) {
        console.error('Transfer failed:', error.message);
        // Transaction automatically rolled back
    }
}
```

#### **3. Error Recovery Patterns**
```javascript
// Retry pattern
async function withRetry(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) {
                break;
            }
            
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms`);
            await sleep(delay);
            delay *= 2; // Exponential backoff
        }
    }
    
    throw lastError;
}

// Fallback pattern
async function withFallback(primaryOperation, fallbackOperation) {
    try {
        return await primaryOperation();
    } catch (primaryError) {
        console.log('Primary operation failed, trying fallback:', primaryError.message);
        
        try {
            return await fallbackOperation();
        } catch (fallbackError) {
            throw new Error(`Both operations failed: ${primaryError.message}, ${fallbackError.message}`);
        }
    }
}

// Circuit breaker pattern
class CircuitBreaker {
    constructor(operation, options = {}) {
        this.operation = operation;
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 60000;
        this.failures = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    }
    
    async execute(...args) {
        if (this.state === 'OPEN') {
            const timeSinceFailure = Date.now() - this.lastFailureTime;
            
            if (timeSinceFailure > this.resetTimeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        
        try {
            const result = await this.operation(...args);
            
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }
    
    recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    
    reset() {
        this.failures = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
    }
}
```

### **Async/Await Error Handling**
```javascript
// Basic async error handling
async function fetchUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error; // Re-throw for caller
    }
}

// Multiple async operations
async function processMultiple() {
    try {
        const [user, posts, comments] = await Promise.all([
            fetchUser(1),
            fetchPosts(1),
            fetchComments(1)
        ]);
        
        return { user, posts, comments };
    } catch (error) {
        console.error('One or more requests failed:', error);
        throw error;
    }
}

// Error handling in async loops
async function processAllItems(items) {
    const results = [];
    const errors = [];
    
    for (const item of items) {
        try {
            const result = await processItem(item);
            results.push(result);
        } catch (error) {
            errors.push({ item, error });
            console.error(`Failed to process item ${item.id}:`, error.message);
            // Continue with next item
        }
    }
    
    return { results, errors };
}

// Using async/await with finally
async function withResource() {
    let resource;
    
    try {
        resource = await acquireResource();
        return await useResource(resource);
    } catch (error) {
        console.error('Resource operation failed:', error);
        throw error;
    } finally {
        if (resource) {
            await releaseResource(resource); // Always release
        }
    }
}
```

### **Error Boundary Pattern Implementation**
```javascript
class ErrorBoundary {
    constructor(component, onError) {
        this.component = component;
        this.onError = onError;
        this.hasError = false;
    }
    
    async execute(...args) {
        if (this.hasError) {
            // Can implement recovery logic here
            console.log('Component is in error state');
            return null;
        }
        
        try {
            return await this.component(...args);
        } catch (error) {
            this.hasError = true;
            
            // Log error
            this.onError?.(error);
            
            // Implement recovery strategies
            await this.attemptRecovery(error);
            
            // Re-throw or return fallback
            throw error;
        }
    }
    
    async attemptRecovery(error) {
        // Implement recovery strategies based on error type
        if (error.name === 'NetworkError') {
            console.log('Network error, will retry...');
            // Retry logic
        } else if (error.name === 'ValidationError') {
            console.log('Validation error, using defaults...');
            // Use default values
        }
        // Add more recovery strategies as needed
    }
    
    reset() {
        this.hasError = false;
    }
}

// Usage
const boundary = new ErrorBoundary(
    async (userId) => {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('NetworkError');
        return response.json();
    },
    (error) => {
        console.error('Error boundary caught:', error);
        // Send to monitoring service
    }
);

// Use the boundary
try {
    const user = await boundary.execute(123);
    console.log('User:', user);
} catch (error) {
    console.log('Operation failed despite boundary');
}
```

---

## 🎯 Best Practices Summary

### **Error Handling**
- Always throw `Error` objects (not strings or numbers)
- Create custom error classes for different error types
- Include useful context in error messages
- Use `try/catch/finally` for predictable cleanup
- Consider error boundaries for critical operations

### **Debugging**
- Use meaningful variable and function names
- Add strategic `debugger` statements
- Master browser DevTools (breakpoints, watch expressions, call stack)
- Use conditional breakpoints for specific scenarios
- Implement structured logging

### **Stack Traces**
- Understand how to read and interpret stack traces
- Preserve stack traces in async operations
- Use source maps for minified/transpiled code
- Add context to errors for better debugging

### **Error Recovery**
- Implement retry logic with exponential backoff
- Use fallback mechanisms for non-critical failures
- Consider circuit breaker patterns for external services
- Always clean up resources in `finally` blocks

### **Production Ready**
- Log errors with sufficient context
- Use error monitoring services
- Implement graceful degradation
- Test error scenarios
- Document expected errors and recovery strategies

---

## 📚 Additional Resources

### **Further Reading**
- [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)

### **Tools & Libraries**
- **Error Monitoring**: Sentry, LogRocket, Bugsnag
- **Debugging**: Chrome DevTools, VS Code Debugger, ndb
- **Logging**: Winston, Bunyan, pino
- **Validation**: Joi, Yup, zod

### **Practice Exercises**
1. Create a custom error hierarchy for an e-commerce application
2. Implement a retry mechanism with exponential backoff
3. Set up and use conditional breakpoints in a complex function
4. Create an error boundary for a React component
5. Implement a circuit breaker pattern for API calls
6. Write a debugging proxy to log all object interactions

---

## ✅ Progress Checklist

- [ ] **Types of Errors**: Identify and handle SyntaxError, ReferenceError, TypeError, RangeError
- [ ] **Stack Trace Reading**: Interpret stack traces, understand async stack traces
- [ ] **Throwing Custom Errors**: Create error hierarchies, add context, implement error factories
- [ ] **Debugger & Breakpoints**: Use DevTools effectively, set conditional breakpoints, debug async code
- [ ] **Try / Catch / Finally**: Implement proper error handling, resource cleanup, error recovery patterns

---

**Mastering error handling and debugging will make you a more confident and effective JavaScript developer. These skills are essential for building robust, production-ready applications!** 🚀