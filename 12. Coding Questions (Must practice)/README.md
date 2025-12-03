# JavaScript Coding Questions: Must-Practice Solutions

## Overview
Master these essential JavaScript coding patterns that frequently appear in technical interviews. Each section includes problem explanation, multiple solutions with complexity analysis, edge cases, and test cases.

## 📚 Table of Contents
1. [Reverse String / Number](#reverse-string--number)
2. [Palindrome Check](#palindrome-check)
3. [Flatten Nested Arrays](#flatten-nested-arrays)
4. [Deep Clone Object](#deep-clone-object)
5. [Curry Function](#curry-function)
6. [Debounce Function](#debounce-function)
7. [Throttle Function](#throttle-function)
8. [Promise Retry Logic](#promise-retry-logic)
9. [Memoization](#memoization)
10. [Grouping Array Items](#grouping-array-items)
11. [Frequency Map Patterns](#frequency-map-patterns)

---

## Reverse String / Number

### Problem Statement
Create a function that reverses a string or a number.

### Solutions

#### 1. Reverse a String

**Solution 1: Built-in Methods (Simplest)**
```javascript
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Time: O(n), Space: O(n)
// Test:
console.log(reverseString("hello")); // "olleh"
console.log(reverseString("12345")); // "54321"
```

**Solution 2: Two Pointers (In-place for arrays)**
```javascript
function reverseString(str) {
  const arr = str.split('');
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  
  return arr.join('');
}

// Time: O(n), Space: O(n) (because we create array)
```

**Solution 3: Recursive Approach**
```javascript
function reverseString(str) {
  if (str === '') return '';
  return reverseString(str.substr(1)) + str[0];
}

// Time: O(n²) - substr creates new string each time
// Space: O(n) - call stack
```

**Solution 4: Using Reduce**
```javascript
function reverseString(str) {
  return str.split('').reduce((reversed, char) => char + reversed, '');
}

// Time: O(n), Space: O(n)
```

**Solution 5: For Loop**
```javascript
function reverseString(str) {
  let reversed = '';
  
  for (let char of str) {
    reversed = char + reversed;
  }
  
  return reversed;
}

// Time: O(n), Space: O(n)
```

#### 2. Reverse a Number

**Solution 1: Using Math Operations**
```javascript
function reverseNumber(num) {
  const isNegative = num < 0;
  let reversed = 0;
  let absoluteNum = Math.abs(num);
  
  while (absoluteNum > 0) {
    const digit = absoluteNum % 10;
    reversed = reversed * 10 + digit;
    absoluteNum = Math.floor(absoluteNum / 10);
  }
  
  // Handle 32-bit integer overflow
  if (reversed > Math.pow(2, 31) - 1) return 0;
  
  return isNegative ? -reversed : reversed;
}

// Time: O(log₁₀ n), Space: O(1)
// Test:
console.log(reverseNumber(12345)); // 54321
console.log(reverseNumber(-12345)); // -54321
console.log(reverseNumber(1200)); // 21 (trailing zeros removed)
console.log(reverseNumber(1534236469)); // 0 (overflow)
```

**Solution 2: Using String Conversion**
```javascript
function reverseNumber(num) {
  const reversedStr = Math.abs(num)
    .toString()
    .split('')
    .reverse()
    .join('');
  
  const reversedNum = parseInt(reversedStr, 10);
  
  // Handle overflow
  if (reversedNum > Math.pow(2, 31) - 1) return 0;
  
  return num < 0 ? -reversedNum : reversedNum;
}
```

#### 3. Advanced: Reverse Words in a String

```javascript
function reverseWords(str) {
  // Remove extra spaces and split
  const words = str.trim().split(/\s+/);
  
  // Two pointers to reverse in place (in array)
  let left = 0;
  let right = words.length - 1;
  
  while (left < right) {
    [words[left], words[right]] = [words[right], words[left]];
    left++;
    right--;
  }
  
  return words.join(' ');
}

// Alternative one-liner
function reverseWords(str) {
  return str.trim().split(/\s+/).reverse().join(' ');
}

// Test:
console.log(reverseWords("the sky is blue")); // "blue is sky the"
console.log(reverseWords("  hello world  ")); // "world hello"
console.log(reverseWords("a good   example")); // "example good a"
```

### Edge Cases to Consider
- Empty string
- Single character string
- String with spaces
- Negative numbers
- Numbers with trailing zeros
- Large numbers (integer overflow)
- Unicode characters
- Palindrome strings

### Complexity Analysis
| Approach | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| Built-in methods | O(n) | O(n) |
| Two pointers | O(n) | O(n) or O(1) if in-place |
| Recursive | O(n²) | O(n) |
| Reduce | O(n) | O(n) |

---

## Palindrome Check

### Problem Statement
Check if a given string or number is a palindrome (reads the same forward and backward).

### Solutions

#### 1. String Palindrome Check

**Solution 1: Two Pointers (Optimal)**
```javascript
function isPalindrome(str) {
  // Clean the string: remove non-alphanumeric and lowercase
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}

// Time: O(n), Space: O(n) for cleaned string
// Test:
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome(" ")); // true (empty after cleaning)
```

**Solution 2: Compare with Reverse**
```javascript
function isPalindrome(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}
```

**Solution 3: Recursive Approach**
```javascript
function isPalindrome(str, left = 0, right = str.length - 1) {
  // Skip non-alphanumeric characters
  while (left < right && !/[a-zA-Z0-9]/.test(str[left])) {
    left++;
  }
  while (left < right && !/[a-zA-Z0-9]/.test(str[right])) {
    right--;
  }
  
  // Base case
  if (left >= right) return true;
  
  // Check characters (case insensitive)
  if (str[left].toLowerCase() !== str[right].toLowerCase()) {
    return false;
  }
  
  // Recursive call
  return isPalindrome(str, left + 1, right - 1);
}
```

#### 2. Number Palindrome Check

**Solution 1: Without String Conversion**
```javascript
function isNumberPalindrome(x) {
  // Negative numbers and numbers ending with 0 (except 0) are not palindromes
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false;
  }
  
  let reversed = 0;
  let original = x;
  
  while (original > 0) {
    const digit = original % 10;
    reversed = reversed * 10 + digit;
    original = Math.floor(original / 10);
  }
  
  return x === reversed;
}

// Time: O(log₁₀ n), Space: O(1)
// Test:
console.log(isNumberPalindrome(121)); // true
console.log(isNumberPalindrome(-121)); // false
console.log(isNumberPalindrome(10)); // false
console.log(isNumberPalindrome(0)); // true
```

**Solution 2: Optimized Half Reversal**
```javascript
function isNumberPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  
  let reversed = 0;
  
  // Only reverse half of the number
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  
  // For even digits: x === reversed
  // For odd digits: x === Math.floor(reversed / 10)
  return x === reversed || x === Math.floor(reversed / 10);
}
```

#### 3. Longest Palindromic Substring

```javascript
function longestPalindrome(s) {
  if (s.length < 1) return '';
  
  let start = 0;
  let end = 0;
  
  for (let i = 0; i < s.length; i++) {
    // Check for odd length palindrome
    const len1 = expandAroundCenter(s, i, i);
    // Check for even length palindrome
    const len2 = expandAroundCenter(s, i, i + 1);
    
    const len = Math.max(len1, len2);
    
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  
  return s.substring(start, end + 1);
}

function expandAroundCenter(s, left, right) {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  
  // When loop breaks, we've gone one step too far
  return right - left - 1;
}

// Test:
console.log(longestPalindrome("babad")); // "bab" or "aba"
console.log(longestPalindrome("cbbd")); // "bb"
```

### Edge Cases
- Empty string
- Single character
- Case sensitivity
- Non-alphanumeric characters
- Even vs odd length
- Unicode characters
- Very long strings

### Complexity Analysis
| Problem | Approach | Time Complexity | Space Complexity |
|---------|----------|----------------|------------------|
| String Palindrome | Two Pointers | O(n) | O(n) |
| String Palindrome | Compare Reverse | O(n) | O(n) |
| Number Palindrome | Full Reversal | O(log₁₀ n) | O(1) |
| Number Palindrome | Half Reversal | O(log₁₀ n) | O(1) |
| Longest Palindrome | Expand Center | O(n²) | O(1) |

---

## Flatten Nested Arrays

### Problem Statement
Convert a nested array into a flat array (remove all nesting).

### Solutions

#### 1. Basic Flatten (One Level Deep)

```javascript
function flattenOneLevel(arr) {
  return [].concat(...arr);
}

// Or using flat()
function flattenOneLevel(arr) {
  return arr.flat();
}

// Test:
console.log(flattenOneLevel([1, [2, 3], 4])); // [1, 2, 3, 4]
console.log(flattenOneLevel([[1, 2], [3, 4]])); // [1, 2, 3, 4]
```

#### 2. Deep Flatten (Recursive)

**Solution 1: Recursive with Reduce**
```javascript
function flattenDeep(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenDeep(item) : item);
  }, []);
}

// Time: O(n), Space: O(n) (call stack)
// Test:
console.log(flattenDeep([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
console.log(flattenDeep([[[1]], [[2]], 3])); // [1, 2, 3]
```

**Solution 2: Recursive with For Loop**
```javascript
function flattenDeep(arr) {
  const result = [];
  
  function flattenHelper(arr) {
    for (let item of arr) {
      if (Array.isArray(item)) {
        flattenHelper(item);
      } else {
        result.push(item);
      }
    }
  }
  
  flattenHelper(arr);
  return result;
}
```

**Solution 3: Using Stack (Iterative)**
```javascript
function flattenDeep(arr) {
  const stack = [...arr];
  const result = [];
  
  while (stack.length) {
    const next = stack.pop();
    
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }
  
  return result.reverse(); // To maintain original order
}

// Alternative without reverse (using shift)
function flattenDeep(arr) {
  const queue = [...arr];
  const result = [];
  
  while (queue.length) {
    const next = queue.shift();
    
    if (Array.isArray(next)) {
      queue.unshift(...next);
    } else {
      result.push(next);
    }
  }
  
  return result;
}
```

**Solution 4: Built-in flat() with Infinity**
```javascript
function flattenDeep(arr) {
  return arr.flat(Infinity);
}

// ES2019+, not available in all environments
```

#### 3. Flatten with Depth Limit

```javascript
function flattenDepth(arr, depth = 1) {
  // Base case: depth is 0 or arr is not an array
  if (depth === 0 || !Array.isArray(arr)) {
    return arr;
  }
  
  return arr.reduce((flat, item) => {
    return flat.concat(flattenDepth(item, depth - 1));
  }, []);
}

// Alternative iterative
function flattenDepth(arr, depth = 1) {
  let result = arr;
  
  for (let i = 0; i < depth; i++) {
    result = [].concat(...result);
  }
  
  return result;
}

// Test:
const nested = [1, [2, [3, [4]], 5]];
console.log(flattenDepth(nested, 1)); // [1, 2, [3, [4]], 5]
console.log(flattenDepth(nested, 2)); // [1, 2, 3, [4], 5]
console.log(flattenDepth(nested, 3)); // [1, 2, 3, 4, 5]
```

#### 4. Flatten with Custom Conditions

```javascript
// Flatten only arrays containing numbers
function flattenNumbersOnly(arr) {
  return arr.reduce((flat, item) => {
    if (Array.isArray(item)) {
      return flat.concat(flattenNumbersOnly(item));
    } else if (typeof item === 'number') {
      return flat.concat(item);
    }
    return flat;
  }, []);
}

// Flatten and transform
function flattenAndTransform(arr, transformFn) {
  const result = [];
  
  function flattenHelper(arr) {
    for (let item of arr) {
      if (Array.isArray(item)) {
        flattenHelper(item);
      } else {
        result.push(transformFn(item));
      }
    }
  }
  
  flattenHelper(arr);
  return result;
}

// Test:
const mixed = [1, [2, 'a', [3, 'b']], 4];
console.log(flattenNumbersOnly(mixed)); // [1, 2, 3, 4]
console.log(flattenAndTransform(mixed, x => 
  typeof x === 'number' ? x * 2 : x.toUpperCase()
)); // [2, 4, 'A', 6, 'B', 8]
```

#### 5. Flatten Object Arrays

```javascript
// Flatten array of objects by a key
function flattenByKey(arr, key) {
  return arr.reduce((flat, item) => {
    if (Array.isArray(item[key])) {
      return flat.concat(item[key]);
    }
    return flat;
  }, []);
}

// Deep flatten objects
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    
    return acc;
  }, {});
}

// Test:
const users = [
  { name: 'John', hobbies: ['reading', 'gaming'] },
  { name: 'Jane', hobbies: ['painting'] }
];

console.log(flattenByKey(users, 'hobbies')); // ['reading', 'gaming', 'painting']

const nestedObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
};

console.log(flattenObject(nestedObj));
// { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

### Edge Cases
- Empty arrays
- Arrays with null/undefined values
- Very deep nesting
- Mixed types
- Circular references (will cause stack overflow)
- Large arrays

### Complexity Analysis
| Approach | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| Recursive | O(n) | O(d) where d is depth (call stack) |
| Stack (iterative) | O(n) | O(n) for stack |
| flat(Infinity) | O(n) | O(n) |

---

## Deep Clone Object

### Problem Statement
Create a deep copy of an object (including nested objects, arrays, and special types).

### Solutions

#### 1. JSON-based Clone (Simple but Limited)

```javascript
function deepCloneJSON(obj) {
  // Limitations:
  // - No functions, undefined, Symbol
  // - No circular references
  // - Date becomes string
  // - RegExp, Map, Set not preserved
  // - Prototype chain lost
  return JSON.parse(JSON.stringify(obj));
}

// Test:
const obj = { 
  name: 'John',
  age: 30,
  hobbies: ['reading', 'gaming'],
  address: { city: 'NYC' }
};

const cloned = deepCloneJSON(obj);
console.log(cloned !== obj); // true
console.log(cloned.hobbies !== obj.hobbies); // true
console.log(cloned.address !== obj.address); // true
```

#### 2. Recursive Deep Clone

**Solution 1: Basic Recursive**
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
    return new Date(obj.getTime());
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
  
  // Handle plain Object
  const objCopy = {};
  hash.set(obj, objCopy);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key], hash);
    }
  }
  
  return objCopy;
}
```

**Solution 2: Complete with Special Types**
```javascript
function deepCloneComplete(obj, hash = new WeakMap()) {
  // Handle primitives
  if (Object(obj) !== obj) return obj;
  
  // Handle circular references
  if (hash.has(obj)) return hash.get(obj);
  
  // Special object types
  const Constructor = obj.constructor;
  
  switch (Constructor) {
    case Date:
      return new Date(obj.getTime());
    
    case RegExp:
      return new RegExp(obj.source, obj.flags);
    
    case Set: {
      const setCopy = new Set();
      hash.set(obj, setCopy);
      obj.forEach(value => {
        setCopy.add(deepCloneComplete(value, hash));
      });
      return setCopy;
    }
    
    case Map: {
      const mapCopy = new Map();
      hash.set(obj, mapCopy);
      obj.forEach((value, key) => {
        mapCopy.set(
          deepCloneComplete(key, hash),
          deepCloneComplete(value, hash)
        );
      });
      return mapCopy;
    }
    
    case Array: {
      const arrCopy = new Array(obj.length);
      hash.set(obj, arrCopy);
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = deepCloneComplete(obj[i], hash);
      }
      return arrCopy;
    }
    
    default: {
      // Handle plain objects and class instances
      const objCopy = Object.create(Object.getPrototypeOf(obj));
      hash.set(obj, objCopy);
      
      // Clone all properties including Symbols
      const allKeys = [
        ...Object.getOwnPropertyNames(obj),
        ...Object.getOwnPropertySymbols(obj)
      ];
      
      for (const key of allKeys) {
        objCopy[key] = deepCloneComplete(obj[key], hash);
      }
      
      return objCopy;
    }
  }
}
```

**Solution 3: Clone Functions (with limitations)**
```javascript
function cloneFunction(fn) {
  // Note: This doesn't preserve closure scope or bound context
  const fnString = fn.toString();
  const bodyStart = fnString.indexOf('{') + 1;
  const bodyEnd = fnString.lastIndexOf('}');
  const body = fnString.substring(bodyStart, bodyEnd);
  
  // Try to preserve parameters
  const paramStart = fnString.indexOf('(') + 1;
  const paramEnd = fnString.indexOf(')');
  const params = fnString.substring(paramStart, paramEnd).split(',').map(p => p.trim());
  
  return new Function(...params, body);
}

function deepCloneWithFunctions(obj, hash = new WeakMap()) {
  if (typeof obj === 'function') {
    return cloneFunction(obj);
  }
  
  // ... rest of deepCloneComplete implementation
}
```

#### 3. Iterative Deep Clone (Avoid Stack Overflow)

```javascript
function deepCloneIterative(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const stack = [{ original: obj, copy: null, parent: null, key: null }];
  const hash = new WeakMap();
  let rootCopy = null;
  
  while (stack.length) {
    const { original, copy, parent, key } = stack.pop();
    
    // Handle already cloned objects (circular references)
    if (hash.has(original)) {
      if (parent) {
        parent[key] = hash.get(original);
      }
      continue;
    }
    
    let newCopy;
    
    // Create appropriate copy
    if (original instanceof Date) {
      newCopy = new Date(original.getTime());
    } else if (original instanceof RegExp) {
      newCopy = new RegExp(original.source, original.flags);
    } else if (original instanceof Set) {
      newCopy = new Set();
    } else if (original instanceof Map) {
      newCopy = new Map();
    } else if (Array.isArray(original)) {
      newCopy = new Array(original.length);
    } else {
      newCopy = Object.create(Object.getPrototypeOf(original));
    }
    
    // Store in hash for circular reference detection
    hash.set(original, newCopy);
    
    // Set in parent if exists
    if (parent) {
      parent[key] = newCopy;
    } else {
      rootCopy = newCopy;
    }
    
    // Add children to stack
    if (original instanceof Set) {
      original.forEach(value => {
        stack.push({
          original: value,
          copy: newCopy,
          parent: newCopy,
          key: 'add' // Special key for Set
        });
      });
    } else if (original instanceof Map) {
      original.forEach((value, mapKey) => {
        stack.push({
          original: mapKey,
          copy: newCopy,
          parent: newCopy,
          key: { type: 'mapKey', value }
        });
        stack.push({
          original: value,
          copy: newCopy,
          parent: newCopy,
          key: { type: 'mapValue', key: mapKey }
        });
      });
    } else {
      const keys = [
        ...Object.getOwnPropertyNames(original),
        ...Object.getOwnPropertySymbols(original)
      ];
      
      for (const key of keys) {
        const value = original[key];
        if (value && typeof value === 'object') {
          stack.push({
            original: value,
            copy: newCopy,
            parent: newCopy,
            key
          });
        } else {
          newCopy[key] = value;
        }
      }
    }
  }
  
  return rootCopy;
}
```

#### 4. Using structuredClone API (Modern Browsers)

```javascript
function deepCloneModern(obj) {
  // Available in modern browsers (Chrome 98+, Firefox 94+, Safari 15.4+)
  // Handles: Array, Object, Date, RegExp, Map, Set, ArrayBuffer, etc.
  // Does NOT handle: Functions, DOM nodes, prototype chain
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  } else {
    // Fallback to custom implementation
    return deepCloneComplete(obj);
  }
}
```

#### 5. Clone with Performance Optimization

```javascript
function deepCloneOptimized(obj, options = {}) {
  const {
    maxDepth = 100,
    handleFunctions = false,
    cache = new WeakMap(),
    depth = 0
  } = options;
  
  // Prevent infinite recursion
  if (depth > maxDepth) {
    throw new Error('Maximum clone depth exceeded');
  }
  
  // Return primitives
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Check cache for circular references
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  // Create copy based on type
  let copy;
  const Constructor = obj.constructor;
  
  switch (Constructor) {
    case Date:
      copy = new Date(obj.getTime());
      break;
    
    case RegExp:
      copy = new RegExp(obj.source, obj.flags);
      break;
    
    case Set:
      copy = new Set();
      cache.set(obj, copy);
      obj.forEach(value => {
        copy.add(deepCloneOptimized(value, {
          ...options,
          depth: depth + 1,
          cache
        }));
      });
      return copy;
    
    case Map:
      copy = new Map();
      cache.set(obj, copy);
      obj.forEach((value, key) => {
        copy.set(
          deepCloneOptimized(key, { ...options, depth: depth + 1, cache }),
          deepCloneOptimized(value, { ...options, depth: depth + 1, cache })
        );
      });
      return copy;
    
    case Array:
      copy = new Array(obj.length);
      cache.set(obj, copy);
      for (let i = 0; i < obj.length; i++) {
        copy[i] = deepCloneOptimized(obj[i], {
          ...options,
          depth: depth + 1,
          cache
        });
      }
      return copy;
    
    default:
      // Handle plain objects and class instances
      copy = Object.create(Object.getPrototypeOf(obj));
      cache.set(obj, copy);
      
      // Clone own properties
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (descriptor.value && typeof descriptor.value === 'object') {
          descriptor.value = deepCloneOptimized(descriptor.value, {
            ...options,
            depth: depth + 1,
            cache
          });
        }
        Object.defineProperty(copy, key, descriptor);
      }
      
      // Handle Symbol properties
      const symbols = Object.getOwnPropertySymbols(obj);
      for (const symbol of symbols) {
        const value = obj[symbol];
        if (value && typeof value === 'object') {
          copy[symbol] = deepCloneOptimized(value, {
            ...options,
            depth: depth + 1,
            cache
          });
        } else {
          copy[symbol] = value;
        }
      }
  }
  
  return copy;
}
```

### Test Cases

```javascript
// Test all edge cases
const testObj = {
  // Primitives
  string: 'hello',
  number: 42,
  boolean: true,
  null: null,
  undefined: undefined,
  symbol: Symbol('test'),
  
  // Special objects
  date: new Date(),
  regex: /test/gi,
  set: new Set([1, 2, 3]),
  map: new Map([['key', 'value']]),
  
  // Nested structures
  array: [1, 2, { nested: 'object' }],
  object: { deep: { deeper: 'value' } },
  
  // Function (if supported)
  func: function() { return this.string; },
  
  // Class instance
  instance: (function() {
    class Person {
      constructor(name) { this.name = name; }
      greet() { return `Hello ${this.name}`; }
    }
    return new Person('John');
  })(),
  
  // Circular reference
  circular: null
};

testObj.circular = testObj;

// Test cloning
const cloned = deepCloneComplete(testObj);

console.log(cloned !== testObj); // true
console.log(cloned.date !== testObj.date); // true
console.log(cloned.set !== testObj.set); // true
console.log(cloned.array !== testObj.array); // true
console.log(cloned.array[2] !== testObj.array[2]); // true
console.log(cloned.circular === cloned); // true (circular preserved)
console.log(cloned.instance.greet()); // "Hello John"
```

### Edge Cases
- Circular references
- Function cloning
- Prototype preservation
- Symbol properties
- Non-enumerable properties
- Getters/setters
- Built-in objects (Date, RegExp, Map, Set, etc.)
- Class instances
- DOM elements (if in browser)
- Very deep nesting

### Complexity Analysis
| Approach | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| JSON-based | O(n) | O(n) |
| Recursive | O(n) | O(d) for call stack |
| Iterative | O(n) | O(n) for stack |
| structuredClone | O(n) | O(n) |

---

## Curry Function

### Problem Statement
Implement a curry function that transforms a function with multiple arguments into a sequence of functions each with a single argument.

### Solutions

#### 1. Basic Curry Implementation

```javascript
function curry(fn) {
  return function curried(...args) {
    // If enough arguments have been provided, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    
    // Otherwise, return a new function that collects remaining arguments
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Test:
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6
```

#### 2. Curry with Placeholder Support

```javascript
function curryWithPlaceholder(fn) {
  return function curried(...args) {
    // Filter out placeholder arguments
    const actualArgs = args.slice(0, fn.length);
    const hasPlaceholder = actualArgs.some(arg => 
      arg === curryWithPlaceholder.placeholder
    );
    
    // If all arguments are provided and no placeholders, call fn
    if (actualArgs.length >= fn.length && !hasPlaceholder) {
      return fn.apply(this, actualArgs);
    }
    
    // Otherwise, return a new function
    return function(...moreArgs) {
      // Combine args, replacing placeholders
      const combinedArgs = [];
      let argsIndex = 0;
      let moreArgsIndex = 0;
      
      for (let i = 0; i < args.length; i++) {
        if (args[i] === curryWithPlaceholder.placeholder && 
            moreArgsIndex < moreArgs.length) {
          combinedArgs.push(moreArgs[moreArgsIndex++]);
        } else {
          combinedArgs.push(args[i]);
        }
      }
      
      // Add any remaining moreArgs
      while (moreArgsIndex < moreArgs.length) {
        combinedArgs.push(moreArgs[moreArgsIndex++]);
      }
      
      return curried.apply(this, combinedArgs);
    };
  };
}

curryWithPlaceholder.placeholder = Symbol('placeholder');
const _ = curryWithPlaceholder.placeholder;

// Test:
function multiply(a, b, c, d) {
  return a * b * c * d;
}

const curriedMultiply = curryWithPlaceholder(multiply);

console.log(curriedMultiply(_, 2)(1, _, 4)(3)); // 24 (1 * 2 * 3 * 4)
console.log(curriedMultiply(2, 3)(4)(5)); // 120 (2 * 3 * 4 * 5)
```

#### 3. Auto-Curry (Curry All Functions)

```javascript
// Add curry method to Function prototype
Function.prototype.curry = function(...args) {
  const fn = this;
  const arity = fn.length;
  
  return (function curried(prevArgs) {
    return function(...nextArgs) {
      const allArgs = prevArgs.concat(nextArgs);
      
      if (allArgs.length >= arity) {
        return fn.apply(this, allArgs);
      }
      
      return curried(allArgs);
    };
  })(args);
};

// Test:
function subtract(a, b, c) {
  return a - b - c;
}

const curriedSubtract = subtract.curry();
console.log(curriedSubtract(10)(3)(2)); // 5
console.log(curriedSubtract(10, 3)(2)); // 5
```

#### 4. Advanced Curry with Context Preservation

```javascript
function curryAdvanced(fn, context) {
  return function curried(...args) {
    const ctx = context || this;
    
    if (args.length >= fn.length) {
      return fn.apply(ctx, args);
    }
    
    const boundFn = curried.bind(ctx);
    
    // Create a new function that remembers previous arguments
    const remembered = function(...moreArgs) {
      return boundFn.apply(ctx, args.concat(moreArgs));
    };
    
    // Add utility methods
    remembered.valueOf = function() {
      return boundFn.apply(ctx, args);
    };
    
    remembered.toString = function() {
      return `Curried function expecting ${fn.length - args.length} more arguments`;
    };
    
    return remembered;
  };
}

// Test:
const obj = {
  prefix: 'Result: ',
  add: function(a, b, c) {
    return this.prefix + (a + b + c);
  }
};

obj.add = curryAdvanced(obj.add, obj);
const addTwo = obj.add(1, 2);
console.log(addTwo(3)); // "Result: 6"
```

#### 5. Partial Application vs Curry

```javascript
// Partial application: fix some arguments immediately
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn.apply(this, fixedArgs.concat(remainingArgs));
  };
}

// Curry: always one argument at a time
function strictCurry(fn) {
  const arity = fn.length;
  
  function curried(prevArgs) {
    return function(arg) {
      const args = prevArgs.concat(arg);
      
      if (args.length === arity) {
        return fn.apply(this, args);
      }
      
      return curried(args);
    };
  }
  
  return curried([]);
}

// Test:
function greet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const partialGreet = partial(greet, 'Hello');
console.log(partialGreet('John', '!')); // "Hello, John!"

const curriedGreet = strictCurry(greet);
console.log(curriedGreet('Hello')('John')('!')); // "Hello, John!"
// curriedGreet('Hello', 'John')('!') would NOT work with strictCurry
```

#### 6. Real-World Curry Examples

```javascript
// 1. Logging utility
const createLogger = curry((prefix, message, level) => {
  console.log(`[${level.toUpperCase()}] ${prefix}: ${message}`);
});

const appLogger = createLogger('MyApp');
const errorLogger = appLogger('error');
const infoLogger = appLogger('info');

errorLogger('Something went wrong!'); // "[ERROR] MyApp: Something went wrong!"
infoLogger('App started'); // "[INFO] MyApp: App started"

// 2. URL builder
const createUrl = curry((baseUrl, path, queryParams) => {
  const url = new URL(path, baseUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
});

const apiUrl = createUrl('https://api.example.com');
const usersUrl = apiUrl('/users');
const usersWithLimit = usersUrl({ limit: 10 });

console.log(usersWithLimit); // "https://api.example.com/users?limit=10"

// 3. Data transformation pipeline
const processData = curry((validate, transform, format, data) => {
  if (!validate(data)) throw new Error('Invalid data');
  const transformed = transform(data);
  return format(transformed);
});

const validateUser = user => user && user.name && user.email;
const transformUser = user => ({ ...user, name: user.name.toUpperCase() });
const formatJson = data => JSON.stringify(data, null, 2);

const processUser = processData(validateUser, transformUser, formatJson);

const user = { name: 'john', email: 'john@example.com' };
console.log(processUser(user)); // Formatted JSON with uppercase name
```

#### 7. Performance Optimized Curry

```javascript
function curryOptimized(fn) {
  const arity = fn.length;
  const cache = new Map();
  
  function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    
    // Create a cache key from arguments
    const cacheKey = args.join('|');
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const nextCurried = function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
    
    cache.set(cacheKey, nextCurried);
    return nextCurried;
  }
  
  return curried;
}

// Test with performance measurement
function slowFunction(a, b, c, d, e) {
  // Simulate heavy computation
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += a + b + c + d + e;
  }
  return sum;
}

const curriedSlow = curryOptimized(slowFunction);
const withFirstTwo = curriedSlow(1, 2); // Computed once
const withFirstThree = withFirstTwo(3); // Computed once

console.time('First call');
console.log(withFirstThree(4, 5));
console.timeEnd('First call');

console.time('Cached call');
console.log(withFirstThree(4, 5)); // Should be faster
console.timeEnd('Cached call');
```

### Edge Cases
- Functions with no arguments
- Functions with variable arguments (using ...rest)
- Context (this) preservation
- Methods on objects
- Performance with deeply nested currying
- Placeholder arguments
- Function length property

### Complexity Analysis
| Approach | Time Complexity (per call) | Space Complexity |
|----------|---------------------------|------------------|
| Basic Curry | O(1) | O(n) for closure |
| With Placeholders | O(n) | O(n) |
| Optimized with Cache | O(1) after first call | O(m) for cache |

---

## Debounce Function

### Problem Statement
Implement a debounce function that delays the execution of a function until after a specified wait time has elapsed since the last time it was invoked.

### Solutions

#### 1. Basic Debounce Implementation

```javascript
function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    // Clear the previous timeout
    clearTimeout(timeout);
    
    // Set a new timeout
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Test:
const debouncedLog = debounce(console.log, 300);

// Rapid calls
debouncedLog('Call 1');
debouncedLog('Call 2');
debouncedLog('Call 3');
// Only "Call 3" will be logged after 300ms
```

#### 2. Debounce with Immediate Option

```javascript
function debounce(func, wait, immediate = false) {
  let timeout;
  let result;
  
  return function executedFunction(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      result = func.apply(context, args);
    }
    
    return result;
  };
}

// Test:
const searchInput = document.getElementById('search');
const search = debounce(function(query) {
  console.log('Searching for:', query);
  // API call would go here
}, 300);

// For instant feedback on first keystroke
const instantSearch = debounce(function(query) {
  console.log('Instant search:', query);
}, 300, true);

searchInput.addEventListener('input', (e) => {
  search(e.target.value);
  instantSearch(e.target.value);
});
```

#### 3. Advanced Debounce with Cancel and Flush

```javascript
function debounceAdvanced(func, wait, options = {}) {
  let timeout;
  let lastArgs;
  let lastThis;
  let result;
  let lastCallTime;
  
  const { leading = false, trailing = true, maxWait } = options;
  let lastInvokeTime = 0;
  
  // Invoke the function
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  // Check if we should invoke
  function shouldInvoke(time) {
    if (lastCallTime === undefined) return true;
    
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }
  
  // Timer expired handler
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    timeout = setTimeout(timerExpired, remainingWait(time));
  }
  
  // Calculate remaining wait time
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    
    return maxWait === undefined
      ? timeWaiting
      : Math.min(timeWaiting, maxWait - timeSinceLastInvoke);
  }
  
  // Trailing edge handler
  function trailingEdge(time) {
    timeout = undefined;
    
    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  // Cancel the debounced call
  function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = undefined;
    timeout = undefined;
  }
  
  // Flush the debounced call (invoke immediately)
  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now());
  }
  
  // Leading edge handler
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  
  // Main debounced function
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Handle invocations in maxWait gap
        clearTimeout(timeout);
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === undefined) {
      timeout = setTimeout(timerExpired, wait);
    }
    return result;
  }
  
  debounced.cancel = cancel;
  debounced.flush = flush;
  
  return debounced;
}

// Test:
const expensiveOperation = debounceAdvanced(
  function(data) {
    console.log('Processing:', data);
    return data * 2;
  },
  500,
  { leading: true, trailing: true, maxWait: 1000 }
);

// Cancel example
const cancelableOperation = debounceAdvanced(
  () => console.log('Operation executed'),
  1000
);

cancelableOperation();
setTimeout(() => cancelableOperation.cancel(), 500); // Operation won't execute

// Flush example
const flushableOperation = debounceAdvanced(
  () => 'Result',
  1000
);

flushableOperation();
setTimeout(() => {
  console.log(flushableOperation.flush()); // "Result" immediately
}, 500);
```

#### 4. Debounce with Promise Support

```javascript
function debouncePromise(func, wait, options = {}) {
  let timeout;
  let lastArgs;
  let lastThis;
  let lastCallTime;
  let pendingPromise;
  let resolvePending;
  let rejectPending;
  
  const { leading = false, trailing = true } = options;
  let lastInvokeTime = 0;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    
    if (pendingPromise) {
      try {
        const result = func.apply(thisArg, args);
        resolvePending(result);
      } catch (error) {
        rejectPending(error);
      } finally {
        pendingPromise = resolvePending = rejectPending = undefined;
      }
    }
    
    return pendingPromise;
  }
  
  // ... (rest of debounceAdvanced implementation)
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        resolvePending = resolve;
        rejectPending = reject;
      });
    }
    
    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
    }
    if (timeout === undefined) {
      timeout = setTimeout(timerExpired, wait);
    }
    
    return pendingPromise;
  }
  
  debounced.cancel = function() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    if (pendingPromise && rejectPending) {
      rejectPending(new Error('Debounced function cancelled'));
      pendingPromise = resolvePending = rejectPending = undefined;
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = undefined;
    timeout = undefined;
  };
  
  debounced.flush = function() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
      return trailingEdge(Date.now());
    }
    return pendingPromise;
  };
  
  return debounced;
}

// Test:
const asyncOperation = debouncePromise(async (query) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return `Results for: ${query}`;
}, 300);

async function search() {
  try {
    const result = await asyncOperation('search term');
    console.log(result);
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Multiple rapid calls will only execute once
search();
search();
search();
```

#### 5. Real-World Use Cases

```javascript
// 1. Search input
function createSearchHandler() {
  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');
  
  const search = debounce(async function(query) {
    if (!query.trim()) {
      resultsDiv.innerHTML = '';
      return;
    }
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, 300);
  
  searchInput.addEventListener('input', (e) => {
    search(e.target.value);
  });
}

// 2. Window resize
function handleResize() {
  const updateLayout = debounce(function() {
    console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
    // Update layout calculations
  }, 250);
  
  window.addEventListener('resize', updateLayout);
}

// 3. Auto-save
class AutoSave {
  constructor() {
    this.content = '';
    this.isDirty = false;
    
    this.save = debounce(async function() {
      if (!this.isDirty) return;
      
      console.log('Auto-saving...');
      try {
        await fetch('/api/save', {
          method: 'POST',
          body: JSON.stringify({ content: this.content })
        });
        this.isDirty = false;
        console.log('Saved successfully');
      } catch (error) {
        console.error('Save failed:', error);
      }
    }, 1000);
  }
  
  updateContent(newContent) {
    this.content = newContent;
    this.isDirty = true;
    this.save();
  }
}

// 4. Button click (prevent double-click)
function createButtonHandler() {
  const button = document.getElementById('submit');
  
  const submit = debounce(function() {
    console.log('Submitting form...');
    // Submit logic here
  }, 1000, true); // Leading edge to respond immediately to first click
  
  button.addEventListener('click', submit);
}
```

### Edge Cases
- Very short wait times
- Very long wait times
- Multiple debounced functions
- Memory leaks (cleaning up timeouts)
- Context (this) preservation
- Return values
- Promise rejection handling
- Concurrent invocations

### Complexity Analysis
| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Debounce call | O(1) | O(1) |
| Cancel | O(1) | O(1) |
| Flush | O(1) | O(1) |

---

## Throttle Function

### Problem Statement
Implement a throttle function that ensures a function is called at most once in a specified time period.

### Solutions

#### 1. Basic Throttle Implementation

```javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Test:
const throttledLog = throttle(console.log, 1000);

// Rapid calls
throttledLog('Call 1'); // Executes immediately
throttledLog('Call 2'); // Ignored
throttledLog('Call 3'); // Ignored

// After 1 second
setTimeout(() => throttledLog('Call 4'), 1000); // Executes
```

#### 2. Throttle with Leading and Trailing Options

```javascript
function throttle(func, limit, options = {}) {
  let timeout;
  let previous = 0;
  
  const { leading = true, trailing = true } = options;
  
  return function throttled(...args) {
    const context = this;
    const now = Date.now();
    
    if (!previous && !leading) {
      previous = now;
    }
    
    const remaining = limit - (now - previous);
    
    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = !leading ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

// Test:
// Leading: execute immediately on first call
// Trailing: execute at the end of the limit period
const logWithOptions = throttle(console.log, 1000, {
  leading: true,
  trailing: true
});

// Will log: 'First' immediately, then 'Second' after 1 second
logWithOptions('First');
logWithOptions('Second');
```

#### 3. Throttle with Cancel and Return Value

```javascript
function throttleAdvanced(func, limit) {
  let lastFunc;
  let lastRan;
  let timeout;
  let result;
  
  return function throttled(...args) {
    const context = this;
    
    if (!lastRan) {
      // First call
      result = func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          result = func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
    
    return result;
  };
}

// Add cancel method
throttled.cancel = function() {
  clearTimeout(timeout);
  lastRan = 0;
  timeout = null;
};
```

#### 4. Request Animation Frame Throttle

```javascript
function rafThrottle(func) {
  let ticking = false;
  let lastArgs;
  let lastContext;
  
  return function throttled(...args) {
    lastContext = this;
    lastArgs = args;
    
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(lastContext, lastArgs);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// Test for animations:
const animateElement = rafThrottle((position) => {
  element.style.transform = `translateX(${position}px)`;
});

// Smooth animation at 60fps
function animationLoop() {
  const position = Date.now() % 1000;
  animateElement(position);
  requestAnimationFrame(animationLoop);
}
```

#### 5. Throttle with Promise Support

```javascript
function throttlePromise(func, limit) {
  let lastCall = 0;
  let pendingPromise;
  let timeout;
  
  return function throttled(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    return new Promise((resolve, reject) => {
      if (timeSinceLastCall >= limit) {
        // Enough time has passed, execute immediately
        lastCall = now;
        try {
          const result = func.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      } else {
        // Schedule execution
        if (timeout) clearTimeout(timeout);
        
        timeout = setTimeout(() => {
          lastCall = Date.now();
          try {
            const result = func.apply(this, args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, limit - timeSinceLastCall);
      }
    });
  };
}

// Test:
const apiCall = throttlePromise(async (id) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
}, 1000); // Max 1 call per second

// Multiple calls will be throttled
apiCall(1).then(console.log);
apiCall(2).then(console.log); // Will wait before executing
```

#### 6. Real-World Use Cases

```javascript
// 1. Scroll event handling
function setupScrollHandler() {
  const handleScroll = throttle(() => {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Update UI based on scroll position
    updateProgressBar(scrollTop);
    lazyLoadImages(scrollTop, viewportHeight);
  }, 100); // Update at most every 100ms
  
  window.addEventListener('scroll', handleScroll);
}

// 2. Window resize with expensive calculations
function setupResizeHandler() {
  const calculateLayout = throttle(() => {
    // Expensive layout calculations
    const container = document.getElementById('container');
    const items = container.children;
    
    // Calculate optimal layout
    const layout = calculateOptimalLayout(items);
    applyLayout(items, layout);
  }, 500); // Recalculate at most every 500ms
  
  window.addEventListener('resize', calculateLayout);
}

// 3. Game input handling
class GameController {
  constructor() {
    this.keys = new Set();
    this.lastProcessed = 0;
    
    this.processInput = throttle(() => {
      // Process all pressed keys
      this.keys.forEach(key => {
        this.handleKeyPress(key);
      });
    }, 16); // ~60fps for smooth gameplay
    
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
      this.processInput();
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });
  }
  
  handleKeyPress(key) {
    // Update game state based on key
    console.log('Processing key:', key);
  }
}

// 4. API rate limiting
class RateLimitedAPI {
  constructor(baseURL, requestsPerSecond = 1) {
    this.baseURL = baseURL;
    this.limit = 1000 / requestsPerSecond;
    
    this.request = throttle(this._makeRequest.bind(this), this.limit);
  }
  
  async _makeRequest(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    return response.json();
  }
  
  // All calls through this method will be throttled
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

// Usage
const api = new RateLimitedAPI('https://api.example.com', 2); // 2 requests per second

// These will be automatically throttled
api.get('/users').then(console.log);
api.get('/posts').then(console.log); // Will wait if needed
```

### Comparison: Debounce vs Throttle

```javascript
// Visual comparison
function createComparison() {
  const events = [];
  
  // Simulate rapid events
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      events.push(`Event ${i}`);
    }, i * 100); // Events every 100ms
  }
  
  const debounced = debounce((event) => {
    console.log('Debounced:', event);
  }, 300);
  
  const throttled = throttle((event) => {
    console.log('Throttled:', event);
  }, 300);
  
  events.forEach((event, i) => {
    setTimeout(() => {
      debounced(event);
      throttled(event);
    }, i * 100);
  });
}

// Expected output pattern:
// Debounced: Only last event after 300ms pause
// Throttled: Every 300ms (Event 0, Event 3, Event 6, ...)
```

### Edge Cases
- Zero limit (should behave like immediate execution)
- Very small limits (sub-millisecond)
- Multiple throttled functions with same limit
- Memory cleanup
- Context preservation
- Return value consistency
- Concurrent execution

### Complexity Analysis
| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Throttle call | O(1) | O(1) |
| Cancel | O(1) | O(1) |

---

## Promise Retry Logic

### Problem Statement
Implement a retry mechanism for promises that retries a failed operation a specified number of times with optional delay between retries.

### Solutions

#### 1. Basic Promise Retry

```javascript
function retry(fn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = (attemptNumber) => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (attemptNumber >= retries) {
            reject(error);
          } else {
            console.log(`Attempt ${attemptNumber + 1} failed, retrying in ${delay}ms...`);
            setTimeout(() => attempt(attemptNumber + 1), delay);
          }
        });
    };
    
    attempt(1);
  });
}

// Test:
const unstableApiCall = () => {
  return new Promise((resolve, reject) => {
    const shouldFail = Math.random() > 0.5;
    if (shouldFail) {
      reject(new Error('API call failed'));
    } else {
      resolve('Success!');
    }
  });
};

retry(unstableApiCall, 3, 1000)
  .then(console.log)
  .catch(error => console.error('All attempts failed:', error));
```

#### 2. Retry with Exponential Backoff

```javascript
function retryWithBackoff(fn, retries = 5, baseDelay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = (attemptNumber) => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (attemptNumber >= retries) {
            reject(error);
          } else {
            const delay = baseDelay * Math.pow(2, attemptNumber - 1);
            const jitter = Math.random() * 100; // Add small random jitter
            const totalDelay = delay + jitter;
            
            console.log(`Attempt ${attemptNumber} failed, retrying in ${Math.round(totalDelay)}ms...`);
            
            setTimeout(() => attempt(attemptNumber + 1), totalDelay);
          }
        });
    };
    
    attempt(1);
  });
}

// Test with exponential backoff:
// Attempt 1: ~1000ms delay
// Attempt 2: ~2000ms delay
// Attempt 3: ~4000ms delay
// Attempt 4: ~8000ms delay
// Attempt 5: ~16000ms delay
```

#### 3. Advanced Retry with Configurable Strategies

```javascript
class RetryStrategy {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.backoffFactor = options.backoffFactor || 2;
    this.jitter = options.jitter || true;
    this.retryableErrors = options.retryableErrors || [];
    this.onRetry = options.onRetry || (() => {});
  }
  
  calculateDelay(attempt) {
    let delay = this.baseDelay * Math.pow(this.backoffFactor, attempt - 1);
    
    // Cap at maxDelay
    delay = Math.min(delay, this.maxDelay);
    
    // Add jitter (±10%)
    if (this.jitter) {
      const jitterAmount = delay * 0.1 * (Math.random() * 2 - 1);
      delay += jitterAmount;
    }
    
    return Math.max(0, delay);
  }
  
  shouldRetry(error, attempt) {
    if (attempt >= this.maxRetries) return false;
    
    // Check if error is in retryableErrors list
    if (this.retryableErrors.length > 0) {
      const errorType = error.constructor.name;
      const errorMessage = error.message;
      
      return this.retryableErrors.some(retryableError => {
        if (typeof retryableError === 'string') {
          return errorMessage.includes(retryableError);
        } else if (retryableError instanceof RegExp) {
          return retryableError.test(errorMessage);
        } else if (typeof retryableError === 'function') {
          return retryableError(error);
        }
        return false;
      });
    }
    
    // Default: retry on any error
    return true;
  }
  
  async execute(fn) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error, attempt)) {
          break;
        }
        
        if (attempt <= this.maxRetries) {
          const delay = this.calculateDelay(attempt);
          this.onRetry({ attempt, delay, error });
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

// Test:
const strategy = new RetryStrategy({
  maxRetries: 3,
  baseDelay: 100,
  backoffFactor: 2,
  maxDelay: 1000,
  retryableErrors: ['Network error', 'Timeout', /5\d\d/], // Retry on network errors and 5xx status codes
  onRetry: ({ attempt, delay, error }) => {
    console.log(`Retry ${attempt}/${3} after ${delay}ms:`, error.message);
  }
});

const flakyOperation = async () => {
  const shouldFail = Math.random() > 0.3;
  if (shouldFail) {
    throw new Error('Network error: Connection refused');
  }
  return 'Operation succeeded';
};

strategy.execute(flakyOperation)
  .then(console.log)
  .catch(error => console.error('Final error:', error.message));
```

#### 4. Retry with Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.timeout = options.timeout || 10000;
    this.resetTimeout = options.resetTimeout || 30000;
    this.failureThreshold = options.failureThreshold || 5;
    
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }
  
  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttemptTime) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const promise = this.fn(...args);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), this.timeout);
      });
      
      const result = await Promise.race([promise, timeoutPromise]);
      
      // Success - reset if in HALF_OPEN state
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
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.trip();
    }
  }
  
  trip() {
    this.state = 'OPEN';
    this.nextAttemptTime = Date.now() + this.resetTimeout;
    
    // Schedule reset attempt
    setTimeout(() => {
      this.state = 'HALF_OPEN';
      this.failureCount = 0;
    }, this.resetTimeout);
  }
  
  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }
  
  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }
}

// Test with retry:
const breaker = new CircuitBreaker(async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}, {
  timeout: 5000,
  resetTimeout: 30000,
  failureThreshold: 3
});

async function fetchWithRetryAndCircuitBreaker(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await breaker.call(url);
      return result;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = 1000 * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

#### 5. Retry with Async Function Wrapper

```javascript
function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    retryCondition = () => true,
    onRetry = () => {},
    retryDelay = (attempt) => 1000 * Math.pow(2, attempt - 1)
  } = options;
  
  return async function(...args) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const result = await fn(...args);
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt > maxRetries || !retryCondition(error, attempt)) {
          break;
        }
        
        const delay = typeof retryDelay === 'function' 
          ? retryDelay(attempt) 
          : retryDelay;
        
        onRetry({ attempt, error, delay, args });
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };
}

// Usage examples:

// 1. Simple retry
const fetchWithRetry = withRetry(fetch, { maxRetries: 3 });

// 2. Retry with condition
const fetchWithConditionalRetry = withRetry(fetch, {
  maxRetries: 3,
  retryCondition: (error) => {
    // Only retry on network errors or 5xx status codes
    return error.message.includes('Network') || 
           (error.status && error.status >= 500);
  },
  onRetry: ({ attempt, error }) => {
    console.log(`Retry ${attempt}: ${error.message}`);
  }
});

// 3. Retry with custom delay strategy
const fetchWithCustomDelay = withRetry(fetch, {
  maxRetries: 5,
  retryDelay: (attempt) => {
    // Exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    const jitter = delay * 0.2 * Math.random();
    return delay + jitter;
  }
});

// 4. Composable retry
const processData = withRetry(async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return transformData(data);
}, { maxRetries: 2 });
```

#### 6. Real-World Use Cases

```javascript
// 1. API Client with retry
class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.retryConfig = {
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      retryableStatusCodes: options.retryableStatusCodes || [500, 502, 503, 504]
    };
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const fetchWithRetry = withRetry(async () => {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}`);
          error.status = response.status;
          throw error;
        }
        
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    }, {
      maxRetries: this.retryConfig.maxRetries,
      retryCondition: (error) => {
        // Retry on timeout or retryable status codes
        return error.name === 'AbortError' ||
               (error.status && this.retryConfig.retryableStatusCodes.includes(error.status));
      },
      retryDelay: this.retryConfig.retryDelay
    });
    
    return fetchWithRetry();
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

// 2. Database operation retry
async function executeTransaction(operations, maxRetries = 3) {
  return withRetry(async () => {
    // Begin transaction
    await db.beginTransaction();
    
    try {
      // Execute all operations
      for (const operation of operations) {
        await operation();
      }
      
      // Commit transaction
      await db.commit();
      return { success: true };
    } catch (error) {
      // Rollback on error
      await db.rollback();
      throw error;
    }
  }, {
    maxRetries,
    retryCondition: (error) => {
      // Only retry on deadlock or timeout errors
      return error.code === 'ER_LOCK_DEADLOCK' || 
             error.code === 'ER_LOCK_WAIT_TIMEOUT';
    }
  })();
}

// 3. File upload with retry
async function uploadFileWithRetry(file, url, onProgress) {
  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  return withRetry(async () => {
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex);
      formData.append('totalChunks', totalChunks);
      formData.append('fileName', file.name);
      
      await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      onProgress({
        chunkIndex,
        totalChunks,
        progress: ((chunkIndex + 1) / totalChunks) * 100
      });
    }
    
    return { success: true, fileName: file.name };
  }, {
    maxRetries: 3,
    retryDelay: (attempt) => 2000 * attempt
  })();
}
```

### Edge Cases
- Zero retries (should behave like normal promise)
- Very large number of retries
- Immediate retry (delay = 0)
- Memory leaks from setTimeout
- Concurrent retry attempts
- Cancellation/abort support
- Different error types requiring different retry strategies

### Complexity Analysis
| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Single attempt | O(1) | O(1) |
| With retries | O(n) where n = retries | O(1) |
| Exponential backoff | O(n) | O(1) |

---

## Memoization

### Problem Statement
Implement memoization - an optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again.

### Solutions

#### 1. Basic Memoization

```javascript
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    // Create a cache key from arguments
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit for:', args);
      return cache.get(key);
    }
    
    console.log('Cache miss for:', args);
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

// Test:
function expensiveCalculation(n) {
  console.log(`Calculating ${n}...`);
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += Math.random();
  }
  return result;
}

const memoizedCalc = memoize(expensiveCalculation);

console.time('First call');
memoizedCalc(10);
console.timeEnd('First call'); // Slow

console.time('Second call');
memoizedCalc(10);
console.timeEnd('Second call'); // Fast (cached)
```

#### 2. Memoize with Custom Cache Key

```javascript
function memoizeWithKey(fn, getKey = JSON.stringify) {
  const cache = new Map();
  
  return function(...args) {
    const key = getKey(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

// Test with different key strategies:
const add = (a, b) => a + b;

// Default JSON.stringify key
const memoizedAdd1 = memoizeWithKey(add);

// Custom key function (only use first argument)
const memoizedAdd2 = memoizeWithKey(add, args => args[0]);

// Hash-based key
const memoizedAdd3 = memoizeWithKey(add, args => {
  let hash = 0;
  for (let arg of args) {
    const str = String(arg);
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
  }
  return hash;
});
```

#### 3. Memoize with LRU Cache (Least Recently Used)

```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }
  
  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // Update access order
    const index = this.accessOrder.indexOf(key);
    this.accessOrder.splice(index, 1);
    this.accessOrder.push(key);
    
    return this.cache.get(key);
  }
  
  set(key, value) {
    // If key exists, update value and access order
    if (this.cache.has(key)) {
      const index = this.accessOrder.indexOf(key);
      this.accessOrder.splice(index, 1);
    }
    // If cache is full, remove least recently used
    else if (this.cache.size >= this.maxSize) {
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }
    
    this.cache.set(key, value);
    this.accessOrder.push(key);
  }
  
  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }
  
  get size() {
    return this.cache.size;
  }
}

function memoizeLRU(fn, maxSize = 100) {
  const cache = new LRUCache(maxSize);
  
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

// Test LRU behavior:
const memoizedFibonacci = memoizeLRU(function fib(n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
}, 10);

// Will cache intermediate results
console.log(memoizedFibonacci(30)); // Calculates with caching
```

#### 4. Memoize with Time-based Expiry

```javascript
function memoizeWithExpiry(fn, ttl = 60000) { // Default 1 minute
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached) {
      const { value, expiry } = cached;
      
      if (Date.now() < expiry) {
        console.log('Cache hit (fresh)');
        return value;
      } else {
        console.log('Cache hit (expired)');
        cache.delete(key);
      }
    }
    
    console.log('Cache miss');
    const value = fn.apply(this, args);
    cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
    
    return value;
  };
}

// Test with expiry:
const getWeather = memoizeWithExpiry(async (city) => {
  console.log(`Fetching weather for ${city}...`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { temperature: Math.random() * 30 + 10, city };
}, 5000); // Cache for 5 seconds

// First call - cache miss
getWeather('London').then(console.log);

// Second call within 5 seconds - cache hit
setTimeout(() => {
  getWeather('London').then(console.log);
}, 2000);

// Third call after 5 seconds - cache miss
setTimeout(() => {
  getWeather('London').then(console.log);
}, 7000);
```

#### 5. Memoize for Recursive Functions

```javascript
function memoizeRecursive(fn) {
  const cache = new Map();
  const memoized = function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
  
  // Make memoized function available to recursive calls
  fn.memoized = memoized;
  
  return memoized;
}

// Test with factorial:
const factorial = memoizeRecursive(function fact(n) {
  console.log(`Calculating factorial(${n})`);
  if (n <= 1) return 1;
  return n * factorial.memoized(n - 1);
});

console.log(factorial(5)); // Calculates 5, 4, 3, 2, 1
console.log(factorial(6)); // Only calculates 6, uses cache for 5
```

#### 6. Advanced: Memoize with WeakMap for Object Keys

```javascript
function memoizeWeakMap(fn) {
  const cache = new WeakMap();
  
  return function(...args) {
    // Use first argument as key (must be an object)
    const key = args[0];
    
    if (!key || (typeof key !== 'object' && typeof key !== 'function')) {
      // Fallback to regular memoization for non-object keys
      const regularKey = JSON.stringify(args);
      if (!cache.has(regularKey)) {
        cache.set(regularKey, new Map());
      }
      const subCache = cache.get(regularKey);
      
      if (subCache.has(args)) {
        return subCache.get(args);
      }
      
      const result = fn.apply(this, args);
      subCache.set(args, result);
      return result;
    }
    
    if (!cache.has(key)) {
      cache.set(key, new Map());
    }
    
    const subCache = cache.get(key);
    const subKey = JSON.stringify(args.slice(1));
    
    if (subCache.has(subKey)) {
      return subCache.get(subKey);
    }
    
    const result = fn.apply(this, args);
    subCache.set(subKey, result);
    
    return result;
  };
}

// Test with object keys:
const getObjectProperty = memoizeWeakMap(function(obj, prop) {
  console.log(`Getting ${prop} from object`);
  return obj[prop];
});

const obj1 = { a: 1, b: 2 };
const obj2 = { a: 3, b: 4 };

console.log(getObjectProperty(obj1, 'a')); // Cache miss
console.log(getObjectProperty(obj1, 'a')); // Cache hit
console.log(getObjectProperty(obj2, 'a')); // Cache miss (different object)
```

#### 7. Real-World Use Cases

```javascript
// 1. Expensive calculations
const memoizedPrimeCheck = memoize(function isPrime(n) {
  console.log(`Checking if ${n} is prime...`);
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  
  return true;
});

// 2. API response caching
function createCachedApiClient(baseURL) {
  const cache = new Map();
  
  return {
    async get(endpoint) {
      const key = `${baseURL}${endpoint}`;
      
      if (cache.has(key)) {
        console.log('Cache hit for:', endpoint);
        return cache.get(key);
      }
      
      console.log('Cache miss for:', endpoint);
      const response = await fetch(key);
      const data = await response.json();
      
      cache.set(key, data);
      
      // Optional: set expiry
      setTimeout(() => {
        cache.delete(key);
      }, 60000); // 1 minute expiry
      
      return data;
    },
    
    invalidate(endpoint) {
      const key = `${baseURL}${endpoint}`;
      cache.delete(key);
    },
    
    clear() {
      cache.clear();
    }
  };
}

// 3. React/Vue component memoization
function createMemoizedComponent(Component) {
  const cache = new WeakMap();
  
  return function MemoizedComponent(props) {
    // Create a stable key from props
    const propKeys = Object.keys(props).sort();
    const key = propKeys.map(k => `${k}:${JSON.stringify(props[k])}`).join('|');
    
    if (!cache.has(props)) {
      cache.set(props, new Map());
    }
    
    const componentCache = cache.get(props);
    
    if (componentCache.has(key)) {
      return componentCache.get(key);
    }
    
    const result = Component(props);
    componentCache.set(key, result);
    
    return result;
  };
}

// 4. Database query caching
class DatabaseCache {
  constructor(db, options = {}) {
    this.db = db;
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 300000; // 5 minutes
    
    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60000);
  }
  
  async query(sql, params = []) {
    const key = `${sql}|${JSON.stringify(params)}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() < cached.expiry) {
      console.log('Query cache hit');
      return cached.results;
    }
    
    console.log('Query cache miss');
    const results = await this.db.query(sql, params);
    
    // Manage cache size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      results,
      expiry: Date.now() + this.ttl
    });
    
    return results;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now >= value.expiry) {
        this.cache.delete(key);
      }
    }
  }
  
  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Edge Cases
- Functions with no arguments
- Functions with many arguments
- Object arguments (reference vs value equality)
- Functions with side effects
- Memory management (cache size limits)
- Concurrent calls to same arguments
- Error caching (should we cache errors?)
- Functions returning promises

### Complexity Analysis
| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Cache hit | O(1) | O(n) for cache storage |
| Cache miss | O(f) where f = function time | O(n) |

---

## Grouping Array Items

### Problem Statement
Group array elements based on a criteria or key function.

### Solutions

#### 1. Group by Property Value

```javascript
function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = typeof keyFn === 'function' 
      ? keyFn(item)
      : item[keyFn];
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(item);
    return groups;
  }, {});
}

// Test:
const people = [
  { name: 'Alice', age: 25, city: 'NYC' },
  { name: 'Bob', age: 30, city: 'LA' },
  { name: 'Charlie', age: 25, city: 'NYC' },
  { name: 'David', age: 30, city: 'LA' }
];

// Group by age
console.log(groupBy(people, 'age'));
// {
//   '25': [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
//   '30': [{ name: 'Bob', ... }, { name: 'David', ... }]
// }

// Group by city using function
console.log(groupBy(people, person => person.city));
```

#### 2. Advanced Grouping with Transformation

```javascript
function groupByAdvanced(arr, keyFn, transformFn = item => item) {
  return arr.reduce((groups, item, index, array) => {
    const key = keyFn(item, index, array);
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    
    groups.get(key).push(transformFn(item, index, array));
    return groups;
  }, new Map());
}

// Test with Map output:
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const grouped = groupByAdvanced(
  numbers,
  n => n % 2 === 0 ? 'even' : 'odd',
  n => n * n
);

console.log(Array.from(grouped.entries()));
// [['odd', [1, 9, 25, 49, 81]], ['even', [4, 16, 36, 64, 100]]]
```

#### 3. Multi-level Grouping

```javascript
function groupByMultiple(arr, keys) {
  if (keys.length === 0) return arr;
  
  const [currentKey, ...remainingKeys] = keys;
  
  return arr.reduce((groups, item) => {
    const keyValue = typeof currentKey === 'function'
      ? currentKey(item)
      : item[currentKey];
    
    if (!groups[keyValue]) {
      groups[keyValue] = [];
    }
    
    groups[keyValue].push(item);
    return groups;
  }, {});
}

function deepGroupBy(arr, keys) {
  const result = {};
  
  function group(items, level, path = []) {
    if (level >= keys.length) {
      const key = path.join('.');
      result[key] = items;
      return;
    }
    
    const currentKey = keys[level];
    const grouped = groupByMultiple(items, [currentKey]);
    
    for (const [key, groupItems] of Object.entries(grouped)) {
      group(groupItems, level + 1, [...path, key]);
    }
  }
  
  group(arr, 0);
  return result;
}

// Test multi-level grouping:
const products = [
  { category: 'Electronics', subcategory: 'Phones', name: 'iPhone' },
  { category: 'Electronics', subcategory: 'Phones', name: 'Samsung' },
  { category: 'Electronics', subcategory: 'Laptops', name: 'MacBook' },
  { category: 'Clothing', subcategory: 'Shirts', name: 'T-Shirt' },
  { category: 'Clothing', subcategory: 'Pants', name: 'Jeans' }
];

console.log(deepGroupBy(products, ['category', 'subcategory']));
// {
//   'Electronics.Phones': [...],
//   'Electronics.Laptops': [...],
//   'Clothing.Shirts': [...],
//   'Clothing.Pants': [...]
// }
```

#### 4. Group with Aggregate Functions

```javascript
function groupByWithAggregate(arr, groupKeyFn, aggregateFns) {
  const groups = new Map();
  
  for (const item of arr) {
    const key = groupKeyFn(item);
    
    if (!groups.has(key)) {
      // Initialize with aggregate functions
      groups.set(key, Object.keys(aggregateFns).reduce((acc, fnName) => {
        acc[fnName] = aggregateFns[fnName].init();
        return acc;
      }, { items: [], key }));
    }
    
    const group = groups.get(key);
    group.items.push(item);
    
    // Update aggregates
    for (const [fnName, aggregateFn] of Object.entries(aggregateFns)) {
      group[fnName] = aggregateFn.update(group[fnName], item);
    }
  }
  
  // Finalize aggregates
  for (const group of groups.values()) {
    for (const [fnName, aggregateFn] of Object.entries(aggregateFns)) {
      if (aggregateFn.finalize) {
        group[fnName] = aggregateFn.finalize(group[fnName]);
      }
    }
  }
  
  return Array.from(groups.values());
}

// Test with aggregates:
const sales = [
  { product: 'A', amount: 100, quantity: 2 },
  { product: 'B', amount: 200, quantity: 1 },
  { product: 'A', amount: 150, quantity: 3 },
  { product: 'C', amount: 300, quantity: 1 }
];

const result = groupByWithAggregate(
  sales,
  item => item.product,
  {
    totalAmount: {
      init: () => 0,
      update: (sum, item) => sum + item.amount
    },
    totalQuantity: {
      init: () => 0,
      update: (sum, item) => sum + item.quantity
    },
    averageAmount: {
      init: () => ({ sum: 0, count: 0 }),
      update: (acc, item) => ({ sum: acc.sum + item.amount, count: acc.count + 1 }),
      finalize: (acc) => acc.sum / acc.count
    },
    items: {
      init: () => [],
      update: (arr, item) => [...arr, item]
    }
  }
);

console.log(result);
// [
//   {
//     key: 'A',
//     items: [...],
//     totalAmount: 250,
//     totalQuantity: 5,
//     averageAmount: 125
//   },
//   ...
// ]
```

#### 5. Group by Date/Time Intervals

```javascript
function groupByTimeInterval(data, dateKey, interval = 'day') {
  const groups = {};
  
  const getIntervalKey = (date) => {
    const d = new Date(date);
    
    switch (interval) {
      case 'year':
        return d.getFullYear();
      case 'month':
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      case 'week':
        // Get week number
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
      case 'day':
        return d.toISOString().split('T')[0];
      case 'hour':
        return `${d.toISOString().split('T')[0]} ${String(d.getHours()).padStart(2, '0')}:00`;
      default:
        throw new Error(`Unsupported interval: ${interval}`);
    }
  };
  
  for (const item of data) {
    const date = new Date(item[dateKey]);
    const key = getIntervalKey(date);
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(item);
  }
  
  return groups;
}

// Test with time-based data:
const events = [
  { id: 1, timestamp: '2024-01-15T10:30:00Z', event: 'login' },
  { id: 2, timestamp: '2024-01-15T11:45:00Z', event: 'purchase' },
  { id: 3, timestamp: '2024-01-16T09:15:00Z', event: 'login' },
  { id: 4, timestamp: '2024-01-16T14:20:00Z', event: 'logout' },
  { id: 5, timestamp: '2024-02-01T08:00:00Z', event: 'login' }
];

console.log(groupByTimeInterval(events, 'timestamp', 'day'));
// Groups events by date
```

#### 6. Group with Custom Equality

```javascript
function groupByCustom(arr, equalityFn, transformFn = x => x) {
  const groups = [];
  const groupKeys = [];
  
  for (const item of arr) {
    let groupIndex = -1;
    
    // Find existing group using custom equality
    for (let i = 0; i < groupKeys.length; i++) {
      if (equalityFn(groupKeys[i], item)) {
        groupIndex = i;
        break;
      }
    }
    
    if (groupIndex === -1) {
      // Create new group
      groupIndex = groups.length;
      groups.push([]);
      groupKeys.push(transformFn(item));
    }
    
    groups[groupIndex].push(item);
  }
  
  return groups;
}

// Test with custom equality:
const points = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 1, y: 2 }, // Duplicate
  { x: 3, y: 4 },
  { x: 2, y: 3 }  // Duplicate
];

const groupedPoints = groupByCustom(
  points,
  (a, b) => a.x === b.x && a.y === b.y,
  p => ({ x: p.x, y: p.y })
);

console.log(groupedPoints);
// [
//   [{x:1,y:2}, {x:1,y:2}],
//   [{x:2,y:3}, {x:2,y:3}],
//   [{x:3,y:4}]
// ]
```

#### 7. Real-World Use Cases

```javascript
// 1. Group products by category for display
function groupProductsByCategory(products) {
  return groupBy(products, 'category');
}

// 2. Group log entries by severity level
function analyzeLogs(logs) {
  const bySeverity = groupBy(logs, 'severity');
  const counts = Object.keys(bySeverity).reduce((acc, severity) => {
    acc[severity] = bySeverity[severity].length;
    return acc;
  }, {});
  
  return { groups: bySeverity, counts };
}

// 3. Group students by grade ranges
function groupStudentsByGrade(students) {
  return groupBy(students, student => {
    const grade = student.grade;
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  });
}

// 4. Group inventory items by stock status
function groupInventory(inventory) {
  return groupBy(inventory, item => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.reorderLevel) return 'low-stock';
    return 'in-stock';
  });
}

// 5. Group transactions by type and month
function analyzeTransactions(transactions) {
  // First group by type
  const byType = groupBy(transactions, 'type');
  
  // Then within each type, group by month
  const result = {};
  for (const [type, typeTransactions] of Object.entries(byType)) {
    result[type] = groupByTimeInterval(typeTransactions, 'date', 'month');
  }
  
  return result;
}
```

### Edge Cases
- Empty arrays
- Null/undefined values in grouping key
- Objects vs primitives as keys
- Very large arrays (performance)
- Nested grouping with many levels
- Case-sensitive vs case-insensitive grouping
- Date/time formatting variations

### Complexity Analysis
| Approach | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| Basic groupBy | O(n) | O(k) where k = unique groups |
| Multi-level grouping | O(n * m) where m = levels | O(k) |
| Group with custom equality | O(n²) worst case | O(n) |

---

## Frequency Map Patterns

### Problem Statement
Create frequency maps (count occurrences) and solve related problems.

### Solutions

#### 1. Basic Frequency Map

```javascript
function createFrequencyMap(arr) {
  const freq = new Map();
  
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  
  return freq;
}

// Alternative using reduce
function createFrequencyMapReduce(arr) {
  return arr.reduce((freq, item) => {
    freq.set(item, (freq.get(item) || 0) + 1);
    return freq;
  }, new Map());
}

// Test:
const numbers = [1, 2, 3, 2, 1, 3, 3, 3, 4];
const freqMap = createFrequencyMap(numbers);

console.log(Array.from(freqMap.entries()));
// [[1, 2], [2, 2], [3, 4], [4, 1]]
```

#### 2. Character Frequency in String

```javascript
function charFrequency(str) {
  const freq = new Map();
  
  for (const char of str) {
    if (char === ' ') continue; // Skip spaces
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  return freq;
}

// Case-insensitive version
function charFrequencyCaseInsensitive(str) {
  const freq = new Map();
  
  for (const char of str.toLowerCase()) {
    if (char === ' ') continue;
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  return freq;
}

// Test:
console.log(charFrequency('hello world'));
// Map { 'h' => 1, 'e' => 1, 'l' => 3, 'o' => 2, 'w' => 1, 'r' => 1, 'd' => 1 }
```

#### 3. Find Most Frequent Element

```javascript
function findMostFrequent(arr) {
  if (arr.length === 0) return null;
  
  const freq = createFrequencyMap(arr);
  let maxFreq = 0;
  let mostFrequent = arr[0];
  
  for (const [item, count] of freq.entries()) {
    if (count > maxFreq) {
      maxFreq = count;
      mostFrequent = item;
    }
  }
  
  return { item: mostFrequent, frequency: maxFreq };
}

// Find all modes (multiple items with same max frequency)
function findModes(arr) {
  if (arr.length === 0) return [];
  
  const freq = createFrequencyMap(arr);
  let maxFreq = 0;
  const modes = [];
  
  for (const [item, count] of freq.entries()) {
    if (count > maxFreq) {
      maxFreq = count;
      modes.length = 0; // Clear previous modes
      modes.push(item);
    } else if (count === maxFreq) {
      modes.push(item);
    }
  }
  
  return { modes, frequency: maxFreq };
}

// Test:
const data = [1, 2, 3, 2, 1, 3, 3, 4, 5, 4, 3];
console.log(findMostFrequent(data)); // { item: 3, frequency: 4 }
console.log(findModes(data)); // { modes: [3], frequency: 4 }
```

#### 4. Check for Anagrams

```javascript
function areAnagrams(str1, str2) {
  if (str1.length !== str2.length) return false;
  
  const freq1 = charFrequencyCaseInsensitive(str1);
  const freq2 = charFrequencyCaseInsensitive(str2);
  
  if (freq1.size !== freq2.size) return false;
  
  for (const [char, count] of freq1.entries()) {
    if (freq2.get(char) !== count) {
      return false;
    }
  }
  
  return true;
}

// Optimized version with single frequency map
function areAnagramsOptimized(str1, str2) {
  if (str1.length !== str2.length) return false;
  
  const freq = new Map();
  
  // Increment for str1
  for (const char of str1.toLowerCase()) {
    if (char === ' ') continue;
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  // Decrement for str2
  for (const char of str2.toLowerCase()) {
    if (char === ' ') continue;
    const count = freq.get(char);
    
    if (!count) return false; // Character not in str1 or already matched
    if (count === 1) {
      freq.delete(char);
    } else {
      freq.set(char, count - 1);
    }
  }
  
  return freq.size === 0;
}

// Test:
console.log(areAnagrams('listen', 'silent')); // true
console.log(areAnagrams('hello', 'world')); // false
console.log(areAnagrams('rail safety', 'fairy tales')); // true
```

#### 5. Find First Non-repeating Character

```javascript
function firstNonRepeatingChar(str) {
  const freq = new Map();
  const order = [];
  
  // First pass: build frequency and order
  for (const char of str) {
    if (!freq.has(char)) {
      freq.set(char, 1);
      order.push(char);
    } else {
      freq.set(char, freq.get(char) + 1);
    }
  }
  
  // Second pass: find first with frequency 1
  for (const char of order) {
    if (freq.get(char) === 1) {
      return char;
    }
  }
  
  return null;
}

// Single pass optimized version
function firstNonRepeatingCharOptimized(str) {
  const freq = new Map();
  const seenOnce = new Set();
  const seenMultiple = new Set();
  
  for (const char of str) {
    if (seenMultiple.has(char)) {
      continue;
    }
    
    if (seenOnce.has(char)) {
      seenOnce.delete(char);
      seenMultiple.add(char);
    } else {
      seenOnce.add(char);
    }
  }
  
  // Find first character in seenOnce
  for (const char of str) {
    if (seenOnce.has(char)) {
      return char;
    }
  }
  
  return null;
}

// Test:
console.log(firstNonRepeatingChar('swiss')); // 'w'
console.log(firstNonRepeatingChar('programming')); // 'p'
console.log(firstNonRepeatingChar('aabbcc')); // null
```

#### 6. Find Common Elements Between Arrays

```javascript
function findIntersection(arr1, arr2) {
  const freq1 = createFrequencyMap(arr1);
  const intersection = [];
  
  for (const item of arr2) {
    if (freq1.has(item) && freq1.get(item) > 0) {
      intersection.push(item);
      freq1.set(item, freq1.get(item) - 1);
      
      if (freq1.get(item) === 0) {
        freq1.delete(item);
      }
    }
  }
  
  return intersection;
}

// Find union of arrays (with duplicates)
function findUnion(arr1, arr2) {
  const freq = new Map();
  const union = [];
  
  // Add all from arr1
  for (const item of arr1) {
    freq.set(item, (freq.get(item) || 0) + 1);
    union.push(item);
  }
  
  // Add from arr2, respecting frequencies
  for (const item of arr2) {
    const count1 = freq.get(item) || 0;
    const count2 = createFrequencyMap(arr2).get(item);
    
    // Add extra occurrences from arr2
    if (count2 > count1) {
      for (let i = 0; i < count2 - count1; i++) {
        union.push(item);
      }
    }
  }
  
  return union;
}

// Test:
const arr1 = [1, 2, 2, 3, 4];
const arr2 = [2, 2, 3, 3, 5];

console.log(findIntersection(arr1, arr2)); // [2, 2, 3]
console.log(findUnion(arr1, arr2)); // [1, 2, 2, 3, 4, 3, 5]
```

#### 7. Top K Frequent Elements

```javascript
function topKFrequent(arr, k) {
  if (k <= 0) return [];
  
  const freq = createFrequencyMap(arr);
  
  // Create array of [element, frequency] pairs
  const pairs = Array.from(freq.entries());
  
  // Sort by frequency descending
  pairs.sort((a, b) => b[1] - a[1]);
  
  // Return top k elements
  return pairs.slice(0, k).map(pair => pair[0]);
}

// Optimized using bucket sort (O(n) time)
function topKFrequentOptimized(arr, k) {
  const freq = createFrequencyMap(arr);
  const n = arr.length;
  
  // Create buckets: index = frequency, value = array of elements
  const buckets = new Array(n + 1).fill().map(() => []);
  
  for (const [element, count] of freq.entries()) {
    buckets[count].push(element);
  }
  
  // Collect top k frequent elements
  const result = [];
  for (let i = n; i >= 0 && result.length < k; i--) {
    if (buckets[i].length > 0) {
      result.push(...buckets[i].slice(0, k - result.length));
    }
  }
  
  return result;
}

// Test:
const nums = [1, 1, 1, 2, 2, 3, 3, 3, 3, 4];
console.log(topKFrequent(nums, 2)); // [3, 1]
console.log(topKFrequentOptimized(nums, 3)); // [3, 1, 2]
```

#### 8. Frequency-based Problems

```javascript
// 1. Check if array has duplicates
function hasDuplicates(arr) {
  const seen = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      return true;
    }
    seen.add(item);
  }
  
  return false;
}

// 2. Find all duplicates
function findAllDuplicates(arr) {
  const freq = createFrequencyMap(arr);
  const duplicates = [];
  
  for (const [item, count] of freq.entries()) {
    if (count > 1) {
      duplicates.push(item);
    }
  }
  
  return duplicates;
}

// 3. Find unique elements
function findUnique(arr) {
  const freq = createFrequencyMap(arr);
  const unique = [];
  
  for (const [item, count] of freq.entries()) {
    if (count === 1) {
      unique.push(item);
    }
  }
  
  return unique;
}

// 4. Check if two arrays are permutations of each other
function arePermutations(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  
  const freq1 = createFrequencyMap(arr1);
  const freq2 = createFrequencyMap(arr2);
  
  if (freq1.size !== freq2.size) return false;
  
  for (const [item, count] of freq1.entries()) {
    if (freq2.get(item) !== count) {
      return false;
    }
  }
  
  return true;
}

// 5. Find missing number in array [1..n]
function findMissingNumber(arr, n) {
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

// Using frequency map for multiple missing numbers
function findMissingNumbers(arr, n) {
  const present = new Set(arr);
  const missing = [];
  
  for (let i = 1; i <= n; i++) {
    if (!present.has(i)) {
      missing.push(i);
    }
  }
  
  return missing;
}
```

#### 9. Real-World Use Cases

```javascript
// 1. Word frequency counter
function wordFrequency(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  return createFrequencyMap(words);
}

// 2. Analyze customer purchases
function analyzePurchases(purchases) {
  // Frequency of products purchased
  const productFreq = createFrequencyMap(purchases.map(p => p.productId));
  
  // Frequency of purchase by customer
  const customerFreq = createFrequencyMap(purchases.map(p => p.customerId));
  
  // Most popular product
  const popularProduct = findMostFrequent(
    purchases.map(p => p.productId)
  );
  
  return {
    productFreq: Array.from(productFreq.entries()),
    customerFreq: Array.from(customerFreq.entries()),
    popularProduct
  };
}

// 3. URL path frequency (for analytics)
function analyzeURLs(urls) {
  // Extract paths
  const paths = urls.map(url => {
    try {
      const parsed = new URL(url);
      return parsed.pathname;
    } catch {
      return url;
    }
  });
  
  const pathFreq = createFrequencyMap(paths);
  const topPaths = topKFrequentOptimized(paths, 10);
  
  return { pathFreq: Array.from(pathFreq.entries()), topPaths };
}

// 4. Error log analysis
function analyzeErrorLogs(logs) {
  // Group by error type
  const byErrorType = groupBy(logs, 'errorType');
  
  // Count frequencies
  const errorFreq = {};
  for (const [type, typeLogs] of Object.entries(byErrorType)) {
    errorFreq[type] = typeLogs.length;
  }
  
  // Find most common error
  const mostCommon = Object.entries(errorFreq)
    .sort((a, b) => b[1] - a[1])[0];
  
  return { errorFreq, mostCommon };
}
```

### Edge Cases
- Empty arrays/strings
- Case sensitivity
- Unicode characters
- Large datasets (performance)
- Floating point numbers as keys
- Null/undefined values
- Objects as keys (reference vs value)

### Complexity Analysis
| Problem | Solution | Time Complexity | Space Complexity |
|---------|----------|----------------|------------------|
| Basic frequency | Map iteration | O(n) | O(k) where k = unique items |
| Most frequent | Map + max search | O(n) | O(k) |
| Anagrams | Two frequency maps | O(n + m) | O(k) |
| Top K frequent | Sort | O(n log n) | O(n) |
| Top K frequent | Bucket sort | O(n) | O(n) |

---

## 🎯 Interview Practice Tips

### General Strategies

1. **Understand the Problem**
   - Ask clarifying questions
   - Identify edge cases
   - Restate the problem in your own words

2. **Plan Your Solution**
   - Discuss multiple approaches
   - Analyze time/space complexity
   - Choose the optimal approach

3. **Write Clean Code**
   - Use meaningful variable names
   - Add comments for complex logic
   - Follow consistent formatting

4. **Test Thoroughly**
   - Test with normal cases
   - Test with edge cases
   - Test with large inputs

### Common Patterns to Recognize

1. **Frequency Map Pattern**
   - Counting occurrences
   - Finding duplicates
   - Checking anagrams

2. **Two Pointers Pattern**
   - Palindrome checking
   - Array reversal
   - Finding pairs

3. **Recursive Pattern**
   - Tree/graph traversal
   - Divide and conquer
   - Backtracking

4. **Sliding Window Pattern**
   - Substring problems
   - Maximum/minimum in window

5. **Dynamic Programming Pattern**
   - Optimization problems
   - Overlapping subproblems

### Practice Resources

1. **Online Platforms**
   - LeetCode
   - HackerRank
   - Codewars
   - Exercism

2. **Books**
   - "Cracking the Coding Interview"
   - "Elements of Programming Interviews"
   - "JavaScript Data Structures and Algorithms"

3. **Mock Interviews**
   - Pramp
   - Interviewing.io
   - Peer practice with friends

### Remember

- Practice consistently (30-60 minutes daily)
- Focus on understanding, not memorization
- Learn from mistakes (review wrong answers)
- Time yourself to build speed
- Explain your thinking out loud

Good luck with your interview preparation! 🚀