# ✅ **100 JavaScript Coding Interview Questions with Multiple Solutions**

## **A. ARRAYS (1-20)**

### **1. Reverse an array without using reverse()**
```javascript
// Solution 1: Using for loop
function reverseArray(arr) {
    let result = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;
}

// Solution 2: Using while loop with swap
function reverseArray2(arr) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    return arr;
}

// Solution 3: Using reduce
function reverseArray3(arr) {
    return arr.reduce((acc, val) => [val, ...acc], []);
}
```

### **2. Find the second largest number in an array**
```javascript
// Solution 1: Sort and find
function secondLargest(arr) {
    const uniqueSorted = [...new Set(arr)].sort((a, b) => b - a);
    return uniqueSorted.length >= 2 ? uniqueSorted[1] : null;
}

// Solution 2: Single pass
function secondLargest2(arr) {
    let first = -Infinity, second = -Infinity;
    for (let num of arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num < first) {
            second = num;
        }
    }
    return second === -Infinity ? null : second;
}
```

### **3. Remove duplicates from an array**
```javascript
// Solution 1: Using Set
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

// Solution 2: Using filter
function removeDuplicates2(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Solution 3: Using reduce
function removeDuplicates3(arr) {
    return arr.reduce((acc, val) => {
        return acc.includes(val) ? acc : [...acc, val];
    }, []);
}
```

### **4. Check if two arrays are equal**
```javascript
// Solution 1: Using JSON.stringify
function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

// Solution 2: Manual comparison
function arraysEqual2(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, idx) => val === arr2[idx]);
}

// Solution 3: For deep equality (nested arrays)
function arraysEqual3(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!arraysEqual3(arr1[i], arr2[i])) return false;
        } else if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
```

### **5. Rotate array by k steps**
```javascript
// Solution 1: Using slice
function rotateArray(arr, k) {
    k = k % arr.length;
    return [...arr.slice(-k), ...arr.slice(0, arr.length - k)];
}

// Solution 2: Using reverse
function rotateArray2(arr, k) {
    k = k % arr.length;
    
    // Reverse entire array
    reverse(arr, 0, arr.length - 1);
    // Reverse first k elements
    reverse(arr, 0, k - 1);
    // Reverse remaining elements
    reverse(arr, k, arr.length - 1);
    
    return arr;
    
    function reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }
}

// Solution 3: Using pop/unshift
function rotateArray3(arr, k) {
    for (let i = 0; i < k; i++) {
        arr.unshift(arr.pop());
    }
    return arr;
}
```

### **6. Find intersection of two arrays**
```javascript
// Solution 1: Using Set
function intersection(arr1, arr2) {
    const set1 = new Set(arr1);
    return [...new Set(arr2.filter(x => set1.has(x)))];
}

// Solution 2: Using hash map for frequency
function intersection2(arr1, arr2) {
    const freq = {};
    const result = [];
    
    arr1.forEach(num => freq[num] = (freq[num] || 0) + 1);
    
    arr2.forEach(num => {
        if (freq[num] && freq[num] > 0) {
            result.push(num);
            freq[num]--;
        }
    });
    
    return result;
}
```

### **7. Find union of two arrays**
```javascript
// Solution 1: Using Set
function union(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])];
}

// Solution 2: Using object as set
function union2(arr1, arr2) {
    const seen = {};
    const result = [];
    
    [...arr1, ...arr2].forEach(item => {
        if (!seen[item]) {
            seen[item] = true;
            result.push(item);
        }
    });
    
    return result;
}
```

### **8. Find difference of two arrays**
```javascript
// Solution 1: Using filter
function arrayDifference(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x));
}

// Solution 2: Using Set
function arrayDifference2(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(x => !set2.has(x));
}

// Solution 3: Symmetric difference
function symmetricDifference(arr1, arr2) {
    const diff1 = arr1.filter(x => !arr2.includes(x));
    const diff2 = arr2.filter(x => !arr1.includes(x));
    return [...diff1, ...diff2];
}
```

### **9. Flatten nested array (infinite depth)**
```javascript
// Solution 1: Recursive
function flattenArray(arr) {
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

// Solution 2: Using reduce recursively
function flattenArray2(arr) {
    return arr.reduce((acc, val) => {
        return acc.concat(Array.isArray(val) ? flattenArray2(val) : val);
    }, []);
}

// Solution 3: Using stack (iterative)
function flattenArray3(arr) {
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
    
    return result.reverse();
}
```

### **10. Chunk array into groups of size k**
```javascript
// Solution 1: Using slice
function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

// Solution 2: Using while loop
function chunkArray2(arr, size) {
    const chunks = [];
    let index = 0;
    
    while (index < arr.length) {
        chunks.push(arr.slice(index, index + size));
        index += size;
    }
    
    return chunks;
}

// Solution 3: Using reduce
function chunkArray3(arr, size) {
    return arr.reduce((chunks, item, index) => {
        const chunkIndex = Math.floor(index / size);
        if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
        chunks[chunkIndex].push(item);
        return chunks;
    }, []);
}
```

### **11. Find frequency of elements in array**
```javascript
// Solution 1: Using reduce
function frequencyCounter(arr) {
    return arr.reduce((freq, item) => {
        freq[item] = (freq[item] || 0) + 1;
        return freq;
    }, {});
}

// Solution 2: Using Map
function frequencyCounter2(arr) {
    const freqMap = new Map();
    
    arr.forEach(item => {
        freqMap.set(item, (freqMap.get(item) || 0) + 1);
    });
    
    return Object.fromEntries(freqMap);
}

// Solution 3: Manual loop
function frequencyCounter3(arr) {
    const freq = {};
    
    for (let item of arr) {
        freq[item] = (freq[item] || 0) + 1;
    }
    
    return freq;
}
```

### **12. Move all zeros to end of array**
```javascript
// Solution 1: Two-pointer
function moveZeros(arr) {
    let nonZeroIndex = 0;
    
    // Move non-zero elements to front
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            arr[nonZeroIndex++] = arr[i];
        }
    }
    
    // Fill remaining positions with zeros
    for (let i = nonZeroIndex; i < arr.length; i++) {
        arr[i] = 0;
    }
    
    return arr;
}

// Solution 2: Using filter
function moveZeros2(arr) {
    const nonZeros = arr.filter(x => x !== 0);
    const zeros = arr.filter(x => x === 0);
    return [...nonZeros, ...zeros];
}

// Solution 3: Swap approach
function moveZeros3(arr) {
    let left = 0;
    
    for (let right = 0; right < arr.length; right++) {
        if (arr[right] !== 0) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
        }
    }
    
    return arr;
}
```

### **13. Sort array of 0s, 1s, and 2s (Dutch National Flag)**
```javascript
// Solution 1: Counting sort
function sortColors(arr) {
    let count = [0, 0, 0];
    
    // Count occurrences
    arr.forEach(num => count[num]++);
    
    // Reconstruct array
    let index = 0;
    for (let i = 0; i < count.length; i++) {
        while (count[i] > 0) {
            arr[index++] = i;
            count[i]--;
        }
    }
    
    return arr;
}

// Solution 2: Three-pointer (Dutch National Flag)
function sortColors2(arr) {
    let low = 0, mid = 0, high = arr.length - 1;
    
    while (mid <= high) {
        switch (arr[mid]) {
            case 0:
                [arr[low], arr[mid]] = [arr[mid], arr[low]];
                low++;
                mid++;
                break;
            case 1:
                mid++;
                break;
            case 2:
                [arr[mid], arr[high]] = [arr[high], arr[mid]];
                high--;
                break;
        }
    }
    
    return arr;
}
```

### **14. Check if array is sorted**
```javascript
// Solution 1: Ascending check
function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}

// Solution 2: Flexible (ascending/descending)
function isSorted2(arr, order = 'asc') {
    for (let i = 1; i < arr.length; i++) {
        if (order === 'asc' && arr[i] < arr[i - 1]) return false;
        if (order === 'desc' && arr[i] > arr[i - 1]) return false;
    }
    return true;
}

// Solution 3: Using every
function isSorted3(arr) {
    return arr.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
}
```

### **15. Implement Array.map() manually**
```javascript
// Solution 1: Using for loop
function customMap(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr));
    }
    return result;
}

// Solution 2: Using forEach
function customMap2(arr, callback) {
    const result = [];
    arr.forEach((item, index, array) => {
        result.push(callback(item, index, array));
    });
    return result;
}

// Solution 3: Adding to Array prototype
Array.prototype.myMap = function(callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};
```

### **16. Implement Array.filter() manually**
```javascript
// Solution 1: Using for loop
function customFilter(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }
    return result;
}

// Solution 2: Using reduce
function customFilter2(arr, callback) {
    return arr.reduce((acc, val, idx, array) => {
        if (callback(val, idx, array)) {
            acc.push(val);
        }
        return acc;
    }, []);
}
```

### **17. Implement Array.reduce() manually**
```javascript
// Solution 1: Using for loop
function customReduce(arr, callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : arr[0];
    let startIndex = initialValue !== undefined ? 0 : 1;
    
    for (let i = startIndex; i < arr.length; i++) {
        accumulator = callback(accumulator, arr[i], i, arr);
    }
    
    return accumulator;
}

// Solution 2: More robust implementation
Array.prototype.myReduce = function(callback, initialValue) {
    if (this.length === 0 && initialValue === undefined) {
        throw new TypeError('Reduce of empty array with no initial value');
    }
    
    let accumulator = initialValue !== undefined ? initialValue : this[0];
    let startIndex = initialValue !== undefined ? 0 : 1;
    
    for (let i = startIndex; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    
    return accumulator;
};
```

### **18. Find pair with sum = target**
```javascript
// Solution 1: Using hash map (two-pass)
function twoSum(arr, target) {
    const numMap = {};
    
    for (let i = 0; i < arr.length; i++) {
        const complement = target - arr[i];
        if (numMap[complement] !== undefined) {
            return [numMap[complement], i];
        }
        numMap[arr[i]] = i;
    }
    
    return null;
}

// Solution 2: Using Set (for values only)
function twoSum2(arr, target) {
    const seen = new Set();
    
    for (let num of arr) {
        const complement = target - num;
        if (seen.has(complement)) {
            return [complement, num];
        }
        seen.add(num);
    }
    
    return null;
}

// Solution 3: Two-pointer (requires sorted array)
function twoSum3(arr, target) {
    arr.sort((a, b) => a - b);
    let left = 0, right = arr.length - 1;
    
    while (left < right) {
        const sum = arr[left] + arr[right];
        if (sum === target) return [arr[left], arr[right]];
        else if (sum < target) left++;
        else right--;
    }
    
    return null;
}
```

### **19. Find longest consecutive sequence**
```javascript
// Solution 1: Using Set (optimal)
function longestConsecutive(nums) {
    const numSet = new Set(nums);
    let longest = 0;
    
    for (let num of numSet) {
        // Only start counting from beginning of sequence
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;
            
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }
            
            longest = Math.max(longest, currentStreak);
        }
    }
    
    return longest;
}

// Solution 2: Using sorting
function longestConsecutive2(nums) {
    if (nums.length === 0) return 0;
    
    nums.sort((a, b) => a - b);
    let longest = 1;
    let current = 1;
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) continue;
        
        if (nums[i] === nums[i - 1] + 1) {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
    }
    
    return longest;
}
```

### **20. Find majority element in array (appears > n/2 times)**
```javascript
// Solution 1: Boyer-Moore Voting Algorithm
function majorityElement(nums) {
    let count = 0;
    let candidate = null;
    
    for (let num of nums) {
        if (count === 0) {
            candidate = num;
        }
        count += (num === candidate) ? 1 : -1;
    }
    
    // Verify if candidate is actually majority
    count = 0;
    for (let num of nums) {
        if (num === candidate) count++;
    }
    
    return count > nums.length / 2 ? candidate : null;
}

// Solution 2: Using hash map
function majorityElement2(nums) {
    const freq = {};
    const majority = nums.length / 2;
    
    for (let num of nums) {
        freq[num] = (freq[num] || 0) + 1;
        if (freq[num] > majority) return num;
    }
    
    return null;
}

// Solution 3: Sorting
function majorityElement3(nums) {
    nums.sort((a, b) => a - b);
    return nums[Math.floor(nums.length / 2)];
}
```

## **B. STRINGS (21-40)**

### **21. Reverse a string**
```javascript
// Solution 1: Using built-in methods
function reverseString(str) {
    return str.split('').reverse().join('');
}

// Solution 2: Using for loop
function reverseString2(str) {
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// Solution 3: Using reduce
function reverseString3(str) {
    return str.split('').reduce((rev, char) => char + rev, '');
}
```

### **22. Check if string is palindrome**
```javascript
// Solution 1: Two-pointer
function isPalindrome(str) {
    let left = 0, right = str.length - 1;
    
    while (left < right) {
        if (str[left] !== str[right]) return false;
        left++;
        right--;
    }
    
    return true;
}

// Solution 2: Compare with reverse
function isPalindrome2(str) {
    return str === str.split('').reverse().join('');
}

// Solution 3: Recursive
function isPalindrome3(str) {
    if (str.length <= 1) return true;
    if (str[0] !== str[str.length - 1]) return false;
    return isPalindrome3(str.slice(1, -1));
}
```

### **23. Count vowels & consonants in a string**
```javascript
// Solution 1: Using regex
function countVowelsConsonants(str) {
    const vowels = str.match(/[aeiou]/gi)?.length || 0;
    const consonants = str.match(/[bcdfghjklmnpqrstvwxyz]/gi)?.length || 0;
    return { vowels, consonants };
}

// Solution 2: Using Set
function countVowelsConsonants2(str) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    let vowelCount = 0, consonantCount = 0;
    
    for (let char of str.toLowerCase()) {
        if (vowels.has(char)) {
            vowelCount++;
        } else if (char >= 'a' && char <= 'z') {
            consonantCount++;
        }
    }
    
    return { vowels: vowelCount, consonants: consonantCount };
}
```

### **24. Check if string is anagram of another**
```javascript
// Solution 1: Sort and compare
function isAnagram(str1, str2) {
    const normalize = str => str.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
    return normalize(str1) === normalize(str2);
}

// Solution 2: Character frequency
function isAnagram2(str1, str2) {
    if (str1.length !== str2.length) return false;
    
    const freq = {};
    
    for (let char of str1.toLowerCase()) {
        freq[char] = (freq[char] || 0) + 1;
    }
    
    for (let char of str2.toLowerCase()) {
        if (!freq[char]) return false;
        freq[char]--;
    }
    
    return true;
}
```

### **25. Find first non-repeating character**
```javascript
// Solution 1: Two-pass with frequency
function firstNonRepeating(str) {
    const freq = {};
    
    // First pass: count frequency
    for (let char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    
    // Second pass: find first with frequency 1
    for (let char of str) {
        if (freq[char] === 1) return char;
    }
    
    return null;
}

// Solution 2: Using Map to preserve order
function firstNonRepeating2(str) {
    const charMap = new Map();
    
    for (let char of str) {
        charMap.set(char, (charMap.get(char) || 0) + 1);
    }
    
    for (let [char, count] of charMap) {
        if (count === 1) return char;
    }
    
    return null;
}
```

### **26. Find first repeating character**
```javascript
// Solution 1: Using Set
function firstRepeating(str) {
    const seen = new Set();
    
    for (let char of str) {
        if (seen.has(char)) return char;
        seen.add(char);
    }
    
    return null;
}

// Solution 2: Using indexOf
function firstRepeating2(str) {
    for (let i = 0; i < str.length; i++) {
        if (str.indexOf(str[i]) !== i) return str[i];
    }
    
    return null;
}
```

### **27. Capitalize first letter of each word**
```javascript
// Solution 1: Using split and map
function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Solution 2: Using regex
function capitalizeWords2(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Solution 3: Manual loop
function capitalizeWords3(str) {
    let result = '';
    let capitalizeNext = true;
    
    for (let char of str) {
        if (char === ' ') {
            capitalizeNext = true;
            result += char;
        } else if (capitalizeNext) {
            result += char.toUpperCase();
            capitalizeNext = false;
        } else {
            result += char.toLowerCase();
        }
    }
    
    return result;
}
```

### **28. Longest word in a sentence**
```javascript
// Solution 1: Using split and reduce
function longestWord(sentence) {
    return sentence.split(' ')
        .reduce((longest, word) => 
            word.length > longest.length ? word : longest, '');
}

// Solution 2: Using sort
function longestWord2(sentence) {
    const words = sentence.split(' ');
    words.sort((a, b) => b.length - a.length);
    return words[0];
}

// Solution 3: Manual loop
function longestWord3(sentence) {
    let maxLength = 0;
    let longest = '';
    let word = '';
    
    for (let char of sentence + ' ') {
        if (char === ' ') {
            if (word.length > maxLength) {
                maxLength = word.length;
                longest = word;
            }
            word = '';
        } else {
            word += char;
        }
    }
    
    return longest;
}
```

### **29. Convert string to camelCase**
```javascript
// Solution 1: Using split and map
function toCamelCase(str) {
    return str.split(/[_\-\s]/)
        .map((word, index) => 
            index === 0 ? word.toLowerCase() : 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

// Solution 2: Using regex
function toCamelCase2(str) {
    return str.replace(/[_\-\s](.)/g, (_, char) => char.toUpperCase())
              .replace(/^./, char => char.toLowerCase());
}
```

### **30. Convert string to snake_case**
```javascript
// Solution 1: Using regex
function toSnakeCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2')
              .replace(/[\s\-]/g, '_')
              .toLowerCase();
}

// Solution 2: Step by step conversion
function toSnakeCase2(str) {
    return str.split('')
        .map((char, i) => {
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                return (i > 0 ? '_' : '') + char.toLowerCase();
            }
            return char.toLowerCase();
        })
        .join('')
        .replace(/[\s\-]/g, '_');
}
```

### **31. Check if string is rotation of another**
```javascript
// Solution 1: Concatenation trick
function isRotation(str1, str2) {
    if (str1.length !== str2.length) return false;
    return (str1 + str1).includes(str2);
}

// Solution 2: Manual check
function isRotation2(str1, str2) {
    if (str1.length !== str2.length) return false;
    
    for (let i = 0; i < str1.length; i++) {
        let isMatch = true;
        for (let j = 0; j < str1.length; j++) {
            if (str1[(i + j) % str1.length] !== str2[j]) {
                isMatch = false;
                break;
            }
        }
        if (isMatch) return true;
    }
    
    return false;
}
```

### **32. Remove all whitespace from string**
```javascript
// Solution 1: Using regex
function removeWhitespace(str) {
    return str.replace(/\s/g, '');
}

// Solution 2: Using split and join
function removeWhitespace2(str) {
    return str.split(' ').join('');
}

// Solution 3: Using filter
function removeWhitespace3(str) {
    return str.split('').filter(char => char !== ' ').join('');
}
```

### **33. Replace repeating characters with count (Run-length encoding)**
```javascript
// Solution 1: Using loop
function compressString(str) {
    let result = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1]) {
            count++;
        } else {
            result += str[i] + (count > 1 ? count : '');
            count = 1;
        }
    }
    
    return result;
}

// Solution 2: Using reduce
function compressString2(str) {
    return str.split('').reduce((acc, char, i, arr) => {
        if (i === 0 || char !== arr[i - 1]) {
            return acc + char;
        } else {
            const lastChar = acc.slice(-1);
            const beforeLast = acc.slice(0, -1);
            const count = parseInt(acc.slice(-1)) || 1;
            return beforeLast + (count + 1);
        }
    }, '');
}
```

### **34. Check if parentheses are balanced**
```javascript
// Solution 1: Using stack
function isBalanced(str) {
    const stack = [];
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (let char of str) {
        if (pairs[char]) {
            stack.push(char);
        } else if (Object.values(pairs).includes(char)) {
            if (stack.length === 0 || pairs[stack.pop()] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}

// Solution 2: Using counter for simple parentheses
function isBalanced2(str) {
    let balance = 0;
    
    for (let char of str) {
        if (char === '(') balance++;
        else if (char === ')') {
            if (balance === 0) return false;
            balance--;
        }
    }
    
    return balance === 0;
}
```

### **35. Validate email using regex**
```javascript
// Solution 1: Simple validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Solution 2: More strict validation
function isValidEmail2(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Solution 3: Step-by-step validation
function isValidEmail3(email) {
    if (!email.includes('@')) return false;
    
    const [local, domain] = email.split('@');
    if (!local || !domain) return false;
    if (!domain.includes('.')) return false;
    
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    if (domainParts[domainParts.length - 1].length < 2) return false;
    
    return true;
}
```

### **36. Reverse words in a sentence**
```javascript
// Solution 1: Using split and reverse
function reverseWords(sentence) {
    return sentence.split(' ').reverse().join(' ');
}

// Solution 2: Manual reversal
function reverseWords2(sentence) {
    const words = sentence.split(' ');
    let result = '';
    
    for (let i = words.length - 1; i >= 0; i--) {
        result += words[i] + (i > 0 ? ' ' : '');
    }
    
    return result;
}

// Solution 3: Without split (preserving multiple spaces)
function reverseWords3(sentence) {
    let result = '';
    let word = '';
    
    for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] === ' ') {
            result = word + (result ? ' ' + result : '');
            word = '';
        } else {
            word += sentence[i];
        }
    }
    
    return word + (result ? ' ' + result : '');
}
```

### **37. Longest substring without repeating characters**
```javascript
// Solution 1: Sliding window
function longestUniqueSubstring(str) {
    let maxLength = 0;
    let start = 0;
    const charIndex = {};
    
    for (let end = 0; end < str.length; end++) {
        const char = str[end];
        
        if (charIndex[char] !== undefined && charIndex[char] >= start) {
            start = charIndex[char] + 1;
        }
        
        charIndex[char] = end;
        maxLength = Math.max(maxLength, end - start + 1);
    }
    
    return maxLength;
}

// Solution 2: Set approach
function longestUniqueSubstring2(str) {
    let maxLength = 0;
    let left = 0;
    const charSet = new Set();
    
    for (let right = 0; right < str.length; right++) {
        while (charSet.has(str[right])) {
            charSet.delete(str[left]);
            left++;
        }
        
        charSet.add(str[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

### **38. Longest palindrome substring**
```javascript
// Solution 1: Expand around center
function longestPalindrome(str) {
    if (str.length < 2) return str;
    
    let start = 0, maxLength = 1;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < str.length && str[left] === str[right]) {
            const currentLength = right - left + 1;
            if (currentLength > maxLength) {
                start = left;
                maxLength = currentLength;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < str.length; i++) {
        expandAroundCenter(i, i);      // Odd length
        expandAroundCenter(i, i + 1);  // Even length
    }
    
    return str.substring(start, start + maxLength);
}

// Solution 2: Dynamic Programming
function longestPalindrome2(str) {
    const n = str.length;
    if (n < 2) return str;
    
    const dp = Array(n).fill().map(() => Array(n).fill(false));
    let start = 0, maxLength = 1;
    
    // All single characters are palindromes
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // Check for two character palindromes
    for (let i = 0; i < n - 1; i++) {
        if (str[i] === str[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLength = 2;
        }
    }
    
    // Check for longer palindromes
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (str[i] === str[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                start = i;
                maxLength = len;
            }
        }
    }
    
    return str.substring(start, start + maxLength);
}
```

### **39. Check if two strings are isomorphic**
```javascript
// Solution 1: Using two maps
function isIsomorphic(str1, str2) {
    if (str1.length !== str2.length) return false;
    
    const map1 = {};
    const map2 = {};
    
    for (let i = 0; i < str1.length; i++) {
        const char1 = str1[i];
        const char2 = str2[i];
        
        if (!map1[char1] && !map2[char2]) {
            map1[char1] = char2;
            map2[char2] = char1;
        } else if (map1[char1] !== char2 || map2[char2] !== char1) {
            return false;
        }
    }
    
    return true;
}

// Solution 2: Using index pattern
function isIsomorphic2(str1, str2) {
    if (str1.length !== str2.length) return false;
    
    function getPattern(str) {
        const map = {};
        let pattern = '';
        
        for (let i = 0; i < str.length; i++) {
            if (!map[str[i]]) {
                map[str[i]] = i + 1;
            }
            pattern += map[str[i]] + '-';
        }
        
        return pattern;
    }
    
    return getPattern(str1) === getPattern(str2);
}
```

### **40. Group anagrams from list of words**
```javascript
// Solution 1: Using sorted string as key
function groupAnagrams(words) {
    const groups = {};
    
    for (let word of words) {
        const key = word.split('').sort().join('');
        if (!groups[key]) groups[key] = [];
        groups[key].push(word);
    }
    
    return Object.values(groups);
}

// Solution 2: Using character count as key
function groupAnagrams2(words) {
    const groups = new Map();
    
    for (let word of words) {
        const count = Array(26).fill(0);
        
        for (let char of word) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        
        const key = count.join('#');
        
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(word);
    }
    
    return Array.from(groups.values());
}
```

## **C. OBJECTS & MAPS (41-55)**

### **41. Deep clone an object**
```javascript
// Solution 1: Using JSON methods (limited)
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Solution 2: Recursive clone
function deepClone2(obj, visited = new Map()) {
    // Handle primitives
    if (obj === null || typeof obj !== 'object') return obj;
    
    // Handle circular references
    if (visited.has(obj)) return visited.get(obj);
    
    // Handle Date
    if (obj instanceof Date) return new Date(obj);
    
    // Handle Array
    if (Array.isArray(obj)) {
        const clonedArray = [];
        visited.set(obj, clonedArray);
        obj.forEach((item, index) => {
            clonedArray[index] = deepClone2(item, visited);
        });
        return clonedArray;
    }
    
    // Handle Object
    const clonedObj = {};
    visited.set(obj, clonedObj);
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone2(obj[key], visited);
        }
    }
    
    return clonedObj;
}

// Solution 3: Using structuredClone (modern browsers)
function deepClone3(obj) {
    return structuredClone ? structuredClone(obj) : deepClone2(obj);
}
```

### **42. Convert object to array of key-value pairs**
```javascript
// Solution 1: Using Object.entries
function objectToPairs(obj) {
    return Object.entries(obj);
}

// Solution 2: Manual conversion
function objectToPairs2(obj) {
    const pairs = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            pairs.push([key, obj[key]]);
        }
    }
    return pairs;
}

// Solution 3: Using Map
function objectToPairs3(obj) {
    return Array.from(new Map(Object.entries(obj)));
}
```

### **43. Convert array of key-value pairs to object**
```javascript
// Solution 1: Using Object.fromEntries
function pairsToObject(pairs) {
    return Object.fromEntries(pairs);
}

// Solution 2: Using reduce
function pairsToObject2(pairs) {
    return pairs.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
}

// Solution 3: Manual conversion
function pairsToObject3(pairs) {
    const obj = {};
    for (let [key, value] of pairs) {
        obj[key] = value;
    }
    return obj;
}
```

### **44. Merge two objects without overwriting nested keys**
```javascript
// Solution 1: Deep merge recursive
function deepMerge(target, source) {
    const output = Object.assign({}, target);
    
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (isObject(source[key]) && isObject(target[key])) {
                output[key] = deepMerge(target[key], source[key]);
            } else {
                output[key] = source[key];
            }
        }
    }
    
    return output;
    
    function isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}

// Solution 2: Using spread operator for shallow merge
function shallowMerge(obj1, obj2) {
    return { ...obj1, ...obj2 };
}

// Solution 3: Merge multiple objects
function mergeAll(...objects) {
    return objects.reduce((acc, obj) => deepMerge(acc, obj), {});
}
```

### **45. Count occurrences of characters using object**
```javascript
// Solution 1: Using reduce
function charCount(str) {
    return str.split('').reduce((count, char) => {
        count[char] = (count[char] || 0) + 1;
        return count;
    }, {});
}

// Solution 2: Using for loop
function charCount2(str) {
    const count = {};
    
    for (let char of str) {
        count[char] = (count[char] || 0) + 1;
    }
    
    return count;
}

// Solution 3: Using Map
function charCount3(str) {
    const countMap = new Map();
    
    for (let char of str) {
        countMap.set(char, (countMap.get(char) || 0) + 1);
    }
    
    return Object.fromEntries(countMap);
}
```

### **46. Convert nested object into flat object**
```javascript
// Solution 1: Recursive flattening
function flattenObject(obj, prefix = '') {
    const result = {};
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(result, flattenObject(obj[key], newKey));
            } else {
                result[newKey] = obj[key];
            }
        }
    }
    
    return result;
}

// Solution 2: Using stack (iterative)
function flattenObject2(obj) {
    const result = {};
    const stack = [[obj, '']];
    
    while (stack.length) {
        const [current, prefix] = stack.pop();
        
        for (let key in current) {
            if (current.hasOwnProperty(key)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof current[key] === 'object' && current[key] !== null && !Array.isArray(current[key])) {
                    stack.push([current[key], newKey]);
                } else {
                    result[newKey] = current[key];
                }
            }
        }
    }
    
    return result;
}
```

### **47. Convert flat object back into nested**
```javascript
// Solution 1: Recursive unflattening
function unflattenObject(flatObj) {
    const result = {};
    
    for (let key in flatObj) {
        if (flatObj.hasOwnProperty(key)) {
            const keys = key.split('.');
            let current = result;
            
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                
                if (i === keys.length - 1) {
                    current[k] = flatObj[key];
                } else {
                    if (!current[k] || typeof current[k] !== 'object') {
                        current[k] = {};
                    }
                    current = current[k];
                }
            }
        }
    }
    
    return result;
}

// Solution 2: Using reduce
function unflattenObject2(flatObj) {
    return Object.keys(flatObj).reduce((result, key) => {
        const keys = key.split('.');
        let current = result;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k]) current[k] = {};
            current = current[k];
        }
        
        current[keys[keys.length - 1]] = flatObj[key];
        return result;
    }, {});
}
```

### **48. Remove keys with falsy values**
```javascript
// Solution 1: Using Object.entries and filter
function removeFalsyValues(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => Boolean(value))
    );
}

// Solution 2: Manual loop
function removeFalsyValues2(obj) {
    const result = {};
    
    for (let key in obj) {
        if (obj[key]) {
            result[key] = obj[key];
        }
    }
    
    return result;
}

// Solution 3: With specific falsy values to keep
function removeFalsyValues3(obj, keepZero = false) {
    const result = {};
    
    for (let key in obj) {
        const value = obj[key];
        if (value || (keepZero && value === 0)) {
            result[key] = value;
        }
    }
    
    return result;
}
```

### **49. Compare two objects for deep equality**
```javascript
// Solution 1: Recursive comparison
function deepEqual(obj1, obj2) {
    // Handle primitives
    if (obj1 === obj2) return true;
    
    // Check if both are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || 
        obj1 === null || obj2 === null) {
        return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    
    return true;
}

// Solution 2: Using JSON.stringify (limited)
function deepEqual2(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Solution 3: Handling special cases
function deepEqual3(obj1, obj2, visited = new Map()) {
    // Handle circular references
    if (visited.has(obj1) && visited.get(obj1) === obj2) return true;
    visited.set(obj1, obj2);
    
    // Rest of implementation similar to Solution 1
    // Add handling for Date, RegExp, ArrayBuffer, etc.
}
```

### **50. Implement simple LRU Cache using Map**
```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        
        return value;
    }
    
    put(key, value) {
        // If key exists, remove it first
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        
        // Add new key-value pair
        this.cache.set(key, value);
        
        // Remove least recently used if capacity exceeded
        if (this.cache.size > this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}

// Solution 2: Using doubly linked list for O(1) operations
class LRUCache2 {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = { key: null, value: null, prev: null, next: null };
        this.tail = { key: null, value: null, prev: this.head, next: null };
        this.head.next = this.tail;
    }
    
    // Implementation with linked list...
}
```

### **51. Implement memoization function**
```javascript
// Solution 1: Basic memoization
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Solution 2: With cache size limit
function memoizeWithLimit(fn, limit = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn.apply(this, args);
        
        // Remove oldest if limit reached
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}

// Usage example:
const memoizedFibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});
```

### **52. Convert JSON to query string**
```javascript
// Solution 1: Using URLSearchParams
function jsonToQueryString(params) {
    const searchParams = new URLSearchParams();
    
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach(val => searchParams.append(key, val));
            } else {
                searchParams.append(key, value);
            }
        }
    }
    
    return searchParams.toString();
}

// Solution 2: Manual implementation
function jsonToQueryString2(params) {
    const parts = [];
    
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            
            if (Array.isArray(value)) {
                value.forEach(val => {
                    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
                });
            } else {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
    }
    
    return parts.join('&');
}

// Solution 3: Handling nested objects
function jsonToQueryString3(params, prefix = '') {
    const parts = [];
    
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            const fullKey = prefix ? `${prefix}[${key}]` : key;
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                parts.push(jsonToQueryString3(value, fullKey));
            } else if (Array.isArray(value)) {
                value.forEach((val, index) => {
                    if (val && typeof val === 'object') {
                        parts.push(jsonToQueryString3(val, `${fullKey}[${index}]`));
                    } else {
                        parts.push(`${encodeURIComponent(fullKey)}[]=${encodeURIComponent(val)}`);
                    }
                });
            } else {
                parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
            }
        }
    }
    
    return parts.join('&');
}
```

### **53. Parse query string to JSON object**
```javascript
// Solution 1: Using URLSearchParams
function queryStringToJSON(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (let [key, value] of params) {
        // Handle array parameters (key[] or key)
        if (key.endsWith('[]')) {
            const cleanKey = key.slice(0, -2);
            if (!result[cleanKey]) result[cleanKey] = [];
            result[cleanKey].push(value);
        } else {
            result[key] = value;
        }
    }
    
    return result;
}

// Solution 2: Manual parsing with nested support
function queryStringToJSON2(queryString) {
    const result = {};
    
    if (!queryString) return result;
    
    const pairs = queryString.split('&');
    
    for (let pair of pairs) {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        
        // Parse nested keys like obj[key][nested]=value
        const keys = key.split(/\[|\]/).filter(k => k);
        let current = result;
        
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            
            if (i === keys.length - 1) {
                current[k] = value;
            } else {
                if (!current[k] || typeof current[k] !== 'object') {
                    // Check if next key is numeric for arrays
                    const nextKey = keys[i + 1];
                    current[k] = !isNaN(nextKey) && nextKey !== '' ? [] : {};
                }
                current = current[k];
            }
        }
    }
    
    return result;
}
```

### **54. Sort array of objects by key**
```javascript
// Solution 1: Using sort with compare function
function sortByKey(arr, key, order = 'asc') {
    return [...arr].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// Solution 2: Multiple keys sort
function sortByMultipleKeys(arr, keys) {
    return [...arr].sort((a, b) => {
        for (let { key, order = 'asc' } of keys) {
            const valA = a[key];
            const valB = b[key];
            
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

// Solution 3: Natural sort for strings with numbers
function naturalSort(arr, key) {
    return [...arr].sort((a, b) => {
        return a[key].localeCompare(b[key], undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    });
}
```

### **55. Group array of objects by a field**
```javascript
// Solution 1: Using reduce
function groupBy(arr, key) {
    return arr.reduce((groups, item) => {
        const groupKey = item[key];
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
}

// Solution 2: Using Map
function groupBy2(arr, key) {
    const groups = new Map();
    
    for (let item of arr) {
        const groupKey = item[key];
        if (!groups.has(groupKey)) groups.set(groupKey, []);
        groups.get(groupKey).push(item);
    }
    
    return Object.fromEntries(groups);
}

// Solution 3: Group by computed value
function groupBy3(arr, keyFn) {
    return arr.reduce((groups, item) => {
        const groupKey = keyFn(item);
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
}

// Usage example:
const products = [
    { category: 'fruit', name: 'apple' },
    { category: 'vegetable', name: 'carrot' },
    { category: 'fruit', name: 'banana' }
];
console.log(groupBy(products, 'category'));
```

## **D. MATHEMATICAL QUESTIONS (56-70)**

### **56. Check if number is prime**
```javascript
// Solution 1: Basic check
function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
}

// Solution 2: Sieve of Eratosthenes (generate primes up to n)
function sieveOfEratosthenes(limit) {
    const primes = Array(limit + 1).fill(true);
    primes[0] = primes[1] = false;
    
    for (let i = 2; i * i <= limit; i++) {
        if (primes[i]) {
            for (let j = i * i; j <= limit; j += i) {
                primes[j] = false;
            }
        }
    }
    
    return primes.reduce((acc, isPrime, num) => {
        if (isPrime) acc.push(num);
        return acc;
    }, []);
}
```

### **57. Generate Fibonacci series**
```javascript
// Solution 1: Iterative
function fibonacciSeries(n) {
    const series = [0, 1];
    
    for (let i = 2; i < n; i++) {
        series.push(series[i - 1] + series[i - 2]);
    }
    
    return series.slice(0, n);
}

// Solution 2: Using while loop
function fibonacciSeries2(n) {
    const series = [];
    let a = 0, b = 1, count = 0;
    
    while (count < n) {
        series.push(a);
        [a, b] = [b, a + b];
        count++;
    }
    
    return series;
}

// Solution 3: Using generator
function* fibonacciGenerator(n) {
    let a = 0, b = 1;
    
    for (let i = 0; i < n; i++) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Usage: [...fibonacciGenerator(10)]
```

### **58. Find nth Fibonacci number using DP**
```javascript
// Solution 1: Recursive with memoization (top-down DP)
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// Solution 2: Iterative DP (bottom-up)
function fibonacciDP(n) {
    if (n <= 1) return n;
    
    const dp = [0, 1];
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Solution 3: Space optimized
function fibonacciOptimized(n) {
    if (n <= 1) return n;
    
    let prev2 = 0, prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

### **59. Find factorial recursively & iteratively**
```javascript
// Solution 1: Recursive
function factorialRecursive(n) {
    if (n <= 1) return 1;
    return n * factorialRecursive(n - 1);
}

// Solution 2: Iterative
function factorialIterative(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Solution 3: Using reduce
function factorialReduce(n) {
    return Array.from({length: n}, (_, i) => i + 1)
        .reduce((acc, val) => acc * val, 1);
}

// Solution 4: Tail recursive (optimized)
function factorialTailRecursive(n, accumulator = 1) {
    if (n <= 1) return accumulator;
    return factorialTailRecursive(n - 1, n * accumulator);
}
```

### **60. Find GCD of two numbers**
```javascript
// Solution 1: Euclidean algorithm (recursive)
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

// Solution 2: Euclidean algorithm (iterative)
function gcd2(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Solution 3: Using subtraction method
function gcd3(a, b) {
    while (a !== b) {
        if (a > b) a -= b;
        else b -= a;
    }
    return a;
}

// Solution 4: For multiple numbers
function gcdArray(numbers) {
    return numbers.reduce((a, b) => gcd(a, b));
}
```

### **61. Find LCM of two numbers**
```javascript
// Solution 1: Using GCD
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Solution 2: Without GCD
function lcm2(a, b) {
    let max = Math.max(a, b);
    let min = Math.min(a, b);
    
    for (let i = max; ; i += max) {
        if (i % min === 0) return i;
    }
}

// Solution 3: For multiple numbers
function lcmArray(numbers) {
    return numbers.reduce((a, b) => lcm(a, b));
}
```

### **62. Check if number is Armstrong number**
```javascript
// Solution 1: Basic check
function isArmstrong(num) {
    const digits = num.toString().split('');
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => 
        acc + Math.pow(parseInt(digit), power), 0);
    
    return sum === num;
}

// Solution 2: Using while loop
function isArmstrong2(num) {
    let temp = num;
    let sum = 0;
    const digits = num.toString().length;
    
    while (temp > 0) {
        const digit = temp % 10;
        sum += Math.pow(digit, digits);
        temp = Math.floor(temp / 10);
    }
    
    return sum === num;
}
```

### **63. Perfect number checker**
```javascript
// Solution 1: Find divisors and sum
function isPerfectNumber(num) {
    if (num <= 1) return false;
    
    let sum = 1; // 1 is always a divisor
    
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) {
                sum += num / i;
            }
        }
    }
    
    return sum === num;
}

// Solution 2: More optimized
function isPerfectNumber2(num) {
    if (num <= 1) return false;
    if (num % 2 !== 0) return false; // Odd perfect numbers unknown
    
    let sum = 1;
    let i = 2;
    
    for (; i * i < num; i++) {
        if (num % i === 0) {
            sum += i + num / i;
        }
    }
    
    if (i * i === num) sum += i;
    
    return sum === num;
}
```

### **64. Convert decimal to binary**
```javascript
// Solution 1: Using toString
function decimalToBinary(num) {
    return num.toString(2);
}

// Solution 2: Manual conversion
function decimalToBinary2(num) {
    if (num === 0) return '0';
    
    let binary = '';
    let n = Math.abs(num);
    
    while (n > 0) {
        binary = (n % 2) + binary;
        n = Math.floor(n / 2);
    }
    
    return num < 0 ? '-' + binary : binary;
}

// Solution 3: Using bitwise operators
function decimalToBinary3(num) {
    let binary = '';
    
    for (let i = 31; i >= 0; i--) {
        binary += (num >> i) & 1;
    }
    
    return binary.replace(/^0+/, '') || '0';
}
```

### **65. Convert binary to decimal**
```javascript
// Solution 1: Using parseInt
function binaryToDecimal(binary) {
    return parseInt(binary, 2);
}

// Solution 2: Manual conversion
function binaryToDecimal2(binary) {
    let decimal = 0;
    let power = 0;
    
    for (let i = binary.length - 1; i >= 0; i--) {
        if (binary[i] === '1') {
            decimal += Math.pow(2, power);
        }
        power++;
    }
    
    return decimal;
}

// Solution 3: Using reduce
function binaryToDecimal3(binary) {
    return binary.split('').reverse().reduce((acc, digit, index) => {
        return acc + (parseInt(digit) * Math.pow(2, index));
    }, 0);
}
```

### **66. Generate random number within a range**
```javascript
// Solution 1: Using Math.random
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Solution 2: Inclusive range
function randomInRangeInclusive(min, max) {
    return Math.random() * (max - min) + min;
}

// Solution 3: Random integer with steps
function randomWithStep(min, max, step = 1) {
    const steps = Math.floor((max - min) / step) + 1;
    return min + (Math.floor(Math.random() * steps) * step);
}

// Solution 4: Using crypto API (more secure)
function secureRandomInRange(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const randomBytes = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(randomBytes);
    
    let randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
        randomValue = (randomValue << 8) | randomBytes[i];
    }
    
    return min + (randomValue % range);
}
```

### **67. Check if number is palindrome**
```javascript
// Solution 1: Convert to string
function isNumberPalindrome(num) {
    const str = num.toString();
    return str === str.split('').reverse().join('');
}

// Solution 2: Without string conversion
function isNumberPalindrome2(num) {
    if (num < 0) return false;
    
    let reversed = 0;
    let original = num;
    
    while (original > 0) {
        reversed = (reversed * 10) + (original % 10);
        original = Math.floor(original / 10);
    }
    
    return num === reversed;
}
```

### **68. Sum of digits of number**
```javascript
// Solution 1: Using string conversion
function sumOfDigits(num) {
    return num.toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Solution 2: Using modulo
function sumOfDigits2(num) {
    let sum = 0;
    let n = Math.abs(num);
    
    while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
    }
    
    return sum;
}

// Solution 3: Recursive
function sumOfDigits3(num) {
    if (num < 10) return num;
    return (num % 10) + sumOfDigits3(Math.floor(num / 10));
}
```

### **69. Reverse digits of a number**
```javascript
// Solution 1: Using string conversion
function reverseNumber(num) {
    const reversed = parseInt(
        Math.abs(num).toString().split('').reverse().join('')
    );
    return num < 0 ? -reversed : reversed;
}

// Solution 2: Using modulo
function reverseNumber2(num) {
    let reversed = 0;
    let n = Math.abs(num);
    
    while (n > 0) {
        reversed = (reversed * 10) + (n % 10);
        n = Math.floor(n / 10);
    }
    
    // Handle overflow (32-bit signed integer range)
    if (reversed > Math.pow(2, 31) - 1) return 0;
    
    return num < 0 ? -reversed : reversed;
}
```

### **70. Count number of set bits in integer**
```javascript
// Solution 1: Brian Kernighan's algorithm
function countSetBits(num) {
    let count = 0;
    let n = num;
    
    while (n) {
        n &= (n - 1); // Clears the lowest set bit
        count++;
    }
    
    return count;
}

// Solution 2: Using bitwise operators
function countSetBits2(num) {
    let count = 0;
    
    for (let i = 0; i < 32; i++) {
        if ((num >> i) & 1) {
            count++;
        }
    }
    
    return count;
}

// Solution 3: Lookup table (for repeated calls)
function createBitCountTable() {
    const table = new Array(256).fill(0);
    
    for (let i = 0; i < 256; i++) {
        table[i] = (i & 1) + table[Math.floor(i / 2)];
    }
    
    return table;
}

const BIT_COUNT_TABLE = createBitCountTable();

function countSetBits3(num) {
    return BIT_COUNT_TABLE[num & 0xFF] +
           BIT_COUNT_TABLE[(num >> 8) & 0xFF] +
           BIT_COUNT_TABLE[(num >> 16) & 0xFF] +
           BIT_COUNT_TABLE[(num >> 24) & 0xFF];
}
```

## **E. RECURSION (71-80)**

### **71. Reverse string using recursion**
```javascript
// Solution 1: Basic recursion
function reverseStringRecursive(str) {
    if (str === '') return '';
    return reverseStringRecursive(str.substr(1)) + str[0];
}

// Solution 2: Using slice
function reverseStringRecursive2(str) {
    if (str.length <= 1) return str;
    return reverseStringRecursive2(str.slice(1)) + str[0];
}

// Solution 3: Tail recursive
function reverseStringTailRecursive(str, acc = '') {
    if (str === '') return acc;
    return reverseStringTailRecursive(str.slice(0, -1), acc + str[str.length - 1]);
}
```

### **72. Reverse array using recursion**
```javascript
// Solution 1: Basic recursion
function reverseArrayRecursive(arr) {
    if (arr.length <= 1) return arr;
    const [first, ...rest] = arr;
    return [...reverseArrayRecursive(rest), first];
}

// Solution 2: Using slice
function reverseArrayRecursive2(arr) {
    if (arr.length <= 1) return arr;
    return [...reverseArrayRecursive2(arr.slice(1)), arr[0]];
}

// Solution 3: In-place recursion
function reverseArrayInPlace(arr, start = 0, end = arr.length - 1) {
    if (start >= end) return arr;
    
    [arr[start], arr[end]] = [arr[end], arr[start]];
    return reverseArrayInPlace(arr, start + 1, end - 1);
}
```

### **73. Flatten nested array using recursion**
```javascript
// Solution 1: Basic recursion
function flattenRecursive(arr) {
    let result = [];
    
    for (let item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flattenRecursive(item));
        } else {
            result.push(item);
        }
    }
    
    return result;
}

// Solution 2: Using reduce
function flattenRecursive2(arr) {
    return arr.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? flattenRecursive2(item) : item);
    }, []);
}

// Solution 3: With depth parameter
function flattenRecursiveWithDepth(arr, depth = Infinity) {
    if (depth === 0) return arr;
    
    return arr.reduce((acc, item) => {
        if (Array.isArray(item) && depth > 0) {
            return acc.concat(flattenRecursiveWithDepth(item, depth - 1));
        }
        return acc.concat(item);
    }, []);
}
```

### **74. Factorial using recursion**
```javascript
// Solution 1: Basic recursion
function factorialRecursive(n) {
    if (n <= 1) return 1;
    return n * factorialRecursive(n - 1);
}

// Solution 2: Tail recursive (optimized)
function factorialTailRecursive(n, acc = 1) {
    if (n <= 1) return acc;
    return factorialTailRecursive(n - 1, n * acc);
}

// Solution 3: With memoization
function createMemoizedFactorial() {
    const memo = { 0: 1, 1: 1 };
    
    function factorialMemoized(n) {
        if (n in memo) return memo[n];
        memo[n] = n * factorialMemoized(n - 1);
        return memo[n];
    }
    
    return factorialMemoized;
}

const memoizedFactorial = createMemoizedFactorial();
```

### **75. Fibonacci using recursion**
```javascript
// Solution 1: Basic recursion (inefficient)
function fibonacciRecursive(n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// Solution 2: With memoization
function createMemoizedFibonacci() {
    const memo = { 0: 0, 1: 1 };
    
    function fib(n) {
        if (n in memo) return memo[n];
        memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    }
    
    return fib;
}

const memoizedFibonacci = createMemoizedFibonacci();

// Solution 3: Tail recursive
function fibonacciTailRecursive(n, a = 0, b = 1) {
    if (n === 0) return a;
    if (n === 1) return b;
    return fibonacciTailRecursive(n - 1, b, a + b);
}
```

### **76. Find power of number using recursion**
```javascript
// Solution 1: Basic recursion
function power(base, exponent) {
    if (exponent === 0) return 1;
    if (exponent === 1) return base;
    return base * power(base, exponent - 1);
}

// Solution 2: Optimized (exponentiation by squaring)
function powerOptimized(base, exponent) {
    if (exponent === 0) return 1;
    if (exponent === 1) return base;
    
    const half = powerOptimized(base, Math.floor(exponent / 2));
    
    if (exponent % 2 === 0) {
        return half * half;
    } else {
        return base * half * half;
    }
}

// Solution 3: Handling negative exponents
function powerWithNegatives(base, exponent) {
    if (exponent === 0) return 1;
    
    const absExponent = Math.abs(exponent);
    const result = powerOptimized(base, absExponent);
    
    return exponent < 0 ? 1 / result : result;
}
```

### **77. Sum of array using recursion**
```javascript
// Solution 1: Basic recursion
function sumArrayRecursive(arr) {
    if (arr.length === 0) return 0;
    return arr[0] + sumArrayRecursive(arr.slice(1));
}

// Solution 2: Using index
function sumArrayRecursive2(arr, index = 0) {
    if (index === arr.length) return 0;
    return arr[index] + sumArrayRecursive2(arr, index + 1);
}

// Solution 3: Tail recursive
function sumArrayTailRecursive(arr, acc = 0) {
    if (arr.length === 0) return acc;
    return sumArrayTailRecursive(arr.slice(1), acc + arr[0]);
}
```

### **78. Find maximum element using recursion**
```javascript
// Solution 1: Basic recursion
function findMaxRecursive(arr) {
    if (arr.length === 1) return arr[0];
    
    const maxOfRest = findMaxRecursive(arr.slice(1));
    return arr[0] > maxOfRest ? arr[0] : maxOfRest;
}

// Solution 2: Using index
function findMaxRecursive2(arr, index = 0) {
    if (index === arr.length - 1) return arr[index];
    
    const maxOfRest = findMaxRecursive2(arr, index + 1);
    return arr[index] > maxOfRest ? arr[index] : maxOfRest;
}

// Solution 3: Divide and conquer
function findMaxDivideConquer(arr, start = 0, end = arr.length - 1) {
    if (start === end) return arr[start];
    
    const mid = Math.floor((start + end) / 2);
    const leftMax = findMaxDivideConquer(arr, start, mid);
    const rightMax = findMaxDivideConquer(arr, mid + 1, end);
    
    return Math.max(leftMax, rightMax);
}
```

### **79. Convert nested object's keys to uppercase using recursion**
```javascript
// Solution 1: Basic recursion
function keysToUpperCase(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => keysToUpperCase(item));
    }
    
    const newObj = {};
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const upperKey = key.toUpperCase();
            newObj[upperKey] = keysToUpperCase(obj[key]);
        }
    }
    
    return newObj;
}

// Solution 2: With option to preserve original
function keysToUpperCase2(obj, preserveOriginal = false) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => keysToUpperCase2(item, preserveOriginal));
    }
    
    const newObj = {};
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const upperKey = key.toUpperCase();
            newObj[upperKey] = keysToUpperCase2(obj[key], preserveOriginal);
            
            if (preserveOriginal && key !== upperKey) {
                newObj[key] = obj[key];
            }
        }
    }
    
    return newObj;
}
```

### **80. Deep comparison of objects using recursion**
```javascript
// Solution 1: Basic deep comparison
function deepEqual(obj1, obj2) {
    // Handle primitives
    if (obj1 === obj2) return true;
    
    // Check if both are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' ||
        obj1 === null || obj2 === null) {
        return false;
    }
    
    // Check constructor
    if (obj1.constructor !== obj2.constructor) return false;
    
    // Handle special objects
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }
    
    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.toString() === obj2.toString();
    }
    
    // Compare arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        return obj1.every((item, index) => deepEqual(item, obj2[index]));
    }
    
    // Compare objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => {
        return keys2.includes(key) && deepEqual(obj1[key], obj2[key]);
    });
}

// Solution 2: With circular reference handling
function deepEqualWithCircular(obj1, obj2, visited = new Map()) {
    const key = `${obj1}-${obj2}`;
    if (visited.has(key)) return true;
    visited.set(key, true);
    
    // Rest of implementation similar to Solution 1
    // Add visited parameter to recursive calls
}
```

## **F. ASYNC & PROMISES (81-90)**

### **81. Implement a delay() function using Promise**
```javascript
// Solution 1: Basic delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Solution 2: With return value
function delayWithValue(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Solution 3: Chainable delay
Promise.prototype.delay = function(ms) {
    return this.then(result => delayWithValue(ms, result));
};

// Usage example:
async function example() {
    console.log('Start');
    await delay(1000);
    console.log('After 1 second');
    
    const result = await delayWithValue(500, 'Hello');
    console.log(result); // 'Hello' after 500ms
    
    // Chainable usage
    Promise.resolve('Start')
        .delay(1000)
        .then(console.log); // 'Start' after 1 second
}
```

### **82. Implement retry logic for API calls**
```javascript
// Solution 1: Basic retry with exponential backoff
async function retryWithBackoff(fn, retries = 3, delayMs = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        
        await new Promise(resolve => 
            setTimeout(resolve, delayMs)
        );
        
        return retryWithBackoff(
            fn, 
            retries - 1, 
            delayMs * 2 // Exponential backoff
        );
    }
}

// Solution 2: With jitter
async function retryWithJitter(fn, retries = 3, baseDelay = 1000) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries) throw error;
            
            // Add jitter to prevent thundering herd
            const jitter = Math.random() * 1000;
            const delay = baseDelay * Math.pow(2, i) + jitter;
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Solution 3: With specific error types to retry
async function retryWithConditions(fn, options = {}) {
    const {
        retries = 3,
        delayMs = 1000,
        shouldRetry = (error) => true,
        onRetry = (error, attempt) => {}
    } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === retries || !shouldRetry(error)) {
                throw error;
            }
            
            onRetry(error, attempt);
            await new Promise(resolve => 
                setTimeout(resolve, delayMs * Math.pow(2, attempt - 1))
            );
        }
    }
}
```

### **83. Implement Promise.all manually**
```javascript
// Solution 1: Basic implementation
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises) || promises.length === 0) {
            return resolve([]);
        }
        
        const results = new Array(promises.length);
        let completed = 0;
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(result => {
                    results[index] = result;
                    completed++;
                    
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
}

// Solution 2: With early rejection
function promiseAll2(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let pending = promises.length;
        
        if (pending === 0) {
            resolve(results);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    pending--;
                    
                    if (pending === 0) {
                        resolve(results);
                    }
                })
                .catch(reject); // Rejects immediately on first error
        });
    });
}

// Solution 3: Handling non-promise values
function promiseAll3(values) {
    const promises = values.map(value => 
        Promise.resolve(value) // Convert non-promises to promises
    );
    
    return promiseAll2(promises);
}
```

### **84. Implement Promise.race manually**
```javascript
// Solution 1: Basic implementation
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises) || promises.length === 0) {
            return; // Never settles if empty array
        }
        
        promises.forEach(promise => {
            Promise.resolve(promise)
                .then(resolve)
                .catch(reject);
        });
    });
}

// Solution 2: With cleanup
function promiseRace2(promises) {
    return new Promise((resolve, reject) => {
        let settled = false;
        
        const settle = (fn) => (value) => {
            if (!settled) {
                settled = true;
                fn(value);
            }
        };
        
        promises.forEach(promise => {
            Promise.resolve(promise)
                .then(settle(resolve))
                .catch(settle(reject));
        });
    });
}
```

### **85. Convert callback-based function to Promise (promisify)**
```javascript
// Solution 1: Basic promisify
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn.call(this, ...args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Solution 2: With multiple result values
function promisifyMulti(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn.call(this, ...args, (error, ...results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length <= 1 ? results[0] : results);
                }
            });
        });
    };
}

// Solution 3: Node.js util.promisify style
function promisifyNodeStyle(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            const callback = (err, ...results) => {
                if (err) {
                    return reject(err);
                }
                
                // Support for callbacks with multiple success values
                if (results.length === 0) {
                    return resolve();
                }
                
                if (results.length === 1) {
                    return resolve(results[0]);
                }
                
                resolve(results);
            };
            
            try {
                fn.apply(this, [...args, callback]);
            } catch (err) {
                reject(err);
            }
        });
    };
}

// Usage example:
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
```

### **86. Implement debounce function**
```javascript
// Solution 1: Basic debounce
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Solution 2: With immediate option
function debounceWithOptions(func, wait, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const context = this;
        
        const later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) {
            func.apply(context, args);
        }
    };
}

// Solution 3: Cancelable debounce
function debounceCancelable(func, wait) {
    let timeout;
    
    const debounced = function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
    
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    
    return debounced;
}
```

### **87. Implement throttle function**
```javascript
// Solution 1: Basic throttle (leading)
function throttle(func, limit) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Solution 2: With trailing option
function throttleWithTrailing(func, limit) {
    let lastFunc;
    let lastRan;
    
    return function executedFunction(...args) {
        const context = this;
        
        if (!lastRan) {
            // Leading execution
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            
            lastFunc = setTimeout(function() {
                // Trailing execution
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Solution 3: With leading and trailing options
function throttleOptions(func, limit, options = {}) {
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const context = this;
        const now = Date.now();
        
        if (!previous && options.leading === false) {
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
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(() => {
                previous = options.leading === false ? 0 : Date.now();
                timeout = null;
                func.apply(context, args);
            }, remaining);
        }
    };
}
```

### **88. Implement custom EventEmitter class**
```javascript
// Solution 1: Basic EventEmitter
class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    
    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(listener);
        return this;
    }
    
    off(event, listener) {
        if (this.events.has(event)) {
            this.events.get(event).delete(listener);
        }
        return this;
    }
    
    emit(event, ...args) {
        if (this.events.has(event)) {
            for (let listener of this.events.get(event)) {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            }
        }
        return this;
    }
    
    once(event, listener) {
        const onceWrapper = (...args) => {
            this.off(event, onceWrapper);
            listener(...args);
        };
        return this.on(event, onceWrapper);
    }
    
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
        return this;
    }
}

// Solution 2: With max listeners warning
class EventEmitter2 extends EventEmitter {
    constructor(maxListeners = 10) {
        super();
        this.maxListeners = maxListeners;
    }
    
    on(event, listener) {
        if (this.events.has(event) && 
            this.events.get(event).size >= this.maxListeners) {
            console.warn(`Max listeners (${this.maxListeners}) reached for event: ${event}`);
        }
        return super.on(event, listener);
    }
}
```

### **89. Implement a job scheduler with concurrency limit**
```javascript
// Solution 1: Basic job scheduler
class JobScheduler {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.queue = [];
        this.running = 0;
    }
    
    add(job) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                job,
                resolve,
                reject
            });
            this.run();
        });
    }
    
    run() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { job, resolve, reject } = this.queue.shift();
            this.running++;
            
            Promise.resolve(job())
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.run();
                });
        }
    }
    
    get pending() {
        return this.queue.length;
    }
    
    get active() {
        return this.running;
    }
}

// Solution 2: With job priority
class PriorityJobScheduler {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.queue = [];
        this.running = 0;
    }
    
    add(job, priority = 0) {
        return new Promise((resolve, reject) => {
            this.queue.push({ job, priority, resolve, reject });
            this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
            this.run();
        });
    }
    
    run() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { job, resolve, reject } = this.queue.shift();
            this.running++;
            
            Promise.resolve(job())
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.run();
                });
        }
    }
}

// Usage example:
async function example() {
    const scheduler = new JobScheduler(3);
    
    const jobs = Array.from({ length: 10 }, (_, i) => () => 
        new Promise(resolve => 
            setTimeout(() => resolve(`Job ${i} completed`), Math.random() * 1000)
        )
    );
    
    const results = await Promise.all(
        jobs.map(job => scheduler.add(job))
    );
    
    console.log(results);
}
```

### **90. Implement polling function until condition matches**
```javascript
// Solution 1: Basic polling
async function poll(condition, fn, interval = 1000, timeout = 30000) {
    const startTime = Date.now();
    
    while (true) {
        const result = await fn();
        
        if (condition(result)) {
            return result;
        }
        
        if (Date.now() - startTime > timeout) {
            throw new Error('Polling timeout');
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}

// Solution 2: With exponential backoff
async function pollWithBackoff(condition, fn, options = {}) {
    const {
        initialInterval = 1000,
        maxInterval = 30000,
        maxAttempts = 10,
        timeout = 60000
    } = options;
    
    let interval = initialInterval;
    let attempts = 0;
    const startTime = Date.now();
    
    while (true) {
        attempts++;
        
        try {
            const result = await fn();
            
            if (condition(result)) {
                return result;
            }
        } catch (error) {
            // Log error but continue polling
            console.error(`Polling attempt ${attempts} failed:`, error);
        }
        
        if (attempts >= maxAttempts || Date.now() - startTime > timeout) {
            throw new Error('Polling timeout or max attempts reached');
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
        
        // Exponential backoff with jitter
        interval = Math.min(interval * 2, maxInterval);
        interval += Math.random() * 1000; // Add jitter
    }
}

// Solution 3: Cancellable polling
function createPolling(condition, fn, interval = 1000) {
    let timeoutId;
    let cancelled = false;
    
    const poll = async () => {
        if (cancelled) return;
        
        try {
            const result = await fn();
            
            if (condition(result)) {
                return result;
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
        
        timeoutId = setTimeout(poll, interval);
    };
    
    const cancel = () => {
        cancelled = true;
        clearTimeout(timeoutId);
    };
    
    return {
        start: poll,
        cancel
    };
}
```

## **G. DATA STRUCTURE DESIGN (91-100)**

### **91. Implement Stack (push, pop, peek)**
```javascript
// Solution 1: Using array
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

// Solution 2: Using linked list
class StackNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class StackLinkedList {
    constructor() {
        this.top = null;
        this.length = 0;
    }
    
    push(value) {
        const newNode = new StackNode(value);
        newNode.next = this.top;
        this.top = newNode;
        this.length++;
    }
    
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        
        const value = this.top.value;
        this.top = this.top.next;
        this.length--;
        return value;
    }
    
    peek() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        return this.top.value;
    }
    
    isEmpty() {
        return this.top === null;
    }
    
    size() {
        return this.length;
    }
}
```

### **92. Implement Queue (enqueue, dequeue)**
```javascript
// Solution 1: Using array
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(item) {
        this.items.push(item);
    }
    
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }
        return this.items[0];
    }
    
    rear() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

// Solution 2: Using linked list (efficient dequeue)
class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class QueueLinkedList {
    constructor() {
        this.front = null;
        this.rear = null;
        this.length = 0;
    }
    
    enqueue(value) {
        const newNode = new QueueNode(value);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }
        
        this.length++;
    }
    
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }
        
        const value = this.front.value;
        this.front = this.front.next;
        
        if (this.front === null) {
            this.rear = null;
        }
        
        this.length--;
        return value;
    }
    
    peek() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }
        return this.front.value;
    }
    
    isEmpty() {
        return this.front === null;
    }
    
    size() {
        return this.length;
    }
}
```

### **93. Implement Priority Queue**
```javascript
// Solution 1: Using array with sorting
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    enqueue(item, priority) {
        const element = { item, priority };
        let added = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (element.priority < this.items[i].priority) {
                this.items.splice(i, 0, element);
                added = true;
                break;
            }
        }
        
        if (!added) {
            this.items.push(element);
        }
    }
    
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('PriorityQueue is empty');
        }
        return this.items.shift().item;
    }
    
    front() {
        if (this.isEmpty()) {
            throw new Error('PriorityQueue is empty');
        }
        return this.items[0].item;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

// Solution 2: Using binary heap (more efficient)
class MinHeapPriorityQueue {
    constructor() {
        this.heap = [];
    }
    
    enqueue(item, priority) {
        const element = { item, priority };
        this.heap.push(element);
        this.bubbleUp(this.heap.length - 1);
    }
    
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('PriorityQueue is empty');
        }
        
        const min = this.heap[0];
        const end = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        
        return min.item;
    }
    
    peek() {
        if (this.isEmpty()) {
            throw new Error('PriorityQueue is empty');
        }
        return this.heap[0].item;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    size() {
        return this.heap.length;
    }
    
    bubbleUp(index) {
        const element = this.heap[index];
        
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            
            if (element.priority >= parent.priority) break;
            
            this.heap[parentIndex] = element;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }
    
    sinkDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];
        
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;
            let leftChild, rightChild;
            
            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIndex;
                }
            }
            
            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIndex;
                }
            }
            
            if (swap === null) break;
            
            this.heap[index] = this.heap[swap];
            this.heap[swap] = element;
            index = swap;
        }
    }
}
```

### **94. Implement Linked List (insert, delete)**
```javascript
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    
    // Add to end
    append(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.length++;
        return this;
    }
    
    // Add to beginning
    prepend(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        
        this.length++;
        return this;
    }
    
    // Insert at index
    insert(index, value) {
        if (index < 0 || index > this.length) {
            throw new Error('Index out of bounds');
        }
        
        if (index === 0) {
            return this.prepend(value);
        }
        
        if (index === this.length) {
            return this.append(value);
        }
        
        const newNode = new ListNode(value);
        const leader = this.traverseToIndex(index - 1);
        const holdingPointer = leader.next;
        
        leader.next = newNode;
        newNode.next = holdingPointer;
        
        this.length++;
        return this;
    }
    
    // Remove by index
    remove(index) {
        if (index < 0 || index >= this.length) {
            throw new Error('Index out of bounds');
        }
        
        if (index === 0) {
            const removedValue = this.head.value;
            this.head = this.head.next;
            this.length--;
            
            if (this.length === 0) {
                this.tail = null;
            }
            
            return removedValue;
        }
        
        const leader = this.traverseToIndex(index - 1);
        const nodeToRemove = leader.next;
        const removedValue = nodeToRemove.value;
        
        leader.next = nodeToRemove.next;
        
        if (index === this.length - 1) {
            this.tail = leader;
        }
        
        this.length--;
        return removedValue;
    }
    
    // Remove by value
    removeValue(value) {
        if (!this.head) return null;
        
        if (this.head.value === value) {
            this.head = this.head.next;
            this.length--;
            
            if (this.length === 0) {
                this.tail = null;
            }
            
            return value;
        }
        
        let current = this.head;
        
        while (current.next && current.next.value !== value) {
            current = current.next;
        }
        
        if (current.next) {
            const removedValue = current.next.value;
            current.next = current.next.next;
            
            if (!current.next) {
                this.tail = current;
            }
            
            this.length--;
            return removedValue;
        }
        
        return null;
    }
    
    // Search for value
    search(value) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }
        
        return -1;
    }
    
    // Get value at index
    get(index) {
        if (index < 0 || index >= this.length) {
            throw new Error('Index out of bounds');
        }
        
        const node = this.traverseToIndex(index);
        return node.value;
    }
    
    // Helper to traverse to index
    traverseToIndex(index) {
        let current = this.head;
        let count = 0;
        
        while (count < index) {
            current = current.next;
            count++;
        }
        
        return current;
    }
    
    // Convert to array
    toArray() {
        const result = [];
        let current = this.head;
        
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }
    
    // Reverse the linked list
    reverse() {
        if (!this.head || !this.head.next) return this;
        
        let prev = null;
        let current = this.head;
        let next = null;
        
        this.tail = this.head;
        
        while (current) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        
        this.head = prev;
        return this;
    }
    
    // Check if empty
    isEmpty() {
        return this.length === 0;
    }
    
    // Get size
    size() {
        return this.length;
    }
    
    // Clear the list
    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}
```

### **95. Detect cycle in linked list**
```javascript
// Solution 1: Floyd's Cycle Detection (Tortoise and Hare)
function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}

// Solution 2: Using Set
function hasCycleSet(head) {
    const visited = new Set();
    let current = head;
    
    while (current) {
        if (visited.has(current)) {
            return true;
        }
        visited.add(current);
        current = current.next;
    }
    
    return false;
}

// Solution 3: Find start of cycle if exists
function detectCycleStart(head) {
    if (!head || !head.next) return null;
    
    let slow = head;
    let fast = head;
    let hasCycle = false;
    
    // Detect cycle
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            hasCycle = true;
            break;
        }
    }
    
    // If no cycle, return null
    if (!hasCycle) return null;
    
    // Find start of cycle
    slow = head;
    
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}

// Solution 4: Using visited flag
function hasCycleFlag(head) {
    let current = head;
    
    while (current) {
        if (current.visited) {
            return true;
        }
        current.visited = true;
        current = current.next;
    }
    
    return false;
}
```

### **96. Reverse linked list**
```javascript
// Solution 1: Iterative
function reverseLinkedList(head) {
    let prev = null;
    let current = head;
    let next = null;
    
    while (current) {
        next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev; // New head
}

// Solution 2: Recursive
function reverseLinkedListRecursive(head) {
    if (!head || !head.next) {
        return head;
    }
    
    const newHead = reverseLinkedListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    
    return newHead;
}

// Solution 3: Using stack
function reverseLinkedListStack(head) {
    if (!head || !head.next) return head;
    
    const stack = [];
    let current = head;
    
    // Push all nodes to stack
    while (current) {
        stack.push(current);
        current = current.next;
    }
    
    // Set new head
    const newHead = stack.pop();
    current = newHead;
    
    // Pop from stack and link nodes
    while (stack.length > 0) {
        current.next = stack.pop();
        current = current.next;
    }
    
    current.next = null; // Important: set last node's next to null
    return newHead;
}

// Solution 4: Reverse in groups (k at a time)
function reverseKGroup(head, k) {
    if (!head || k <= 1) return head;
    
    let count = 0;
    let current = head;
    
    // Count nodes
    while (current && count < k) {
        current = current.next;
        count++;
    }
    
    // If we have k nodes, reverse them
    if (count === k) {
        // Reverse first k nodes
        let prev = null;
        current = head;
        
        for (let i = 0; i < k; i++) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        
        // Now head is the last node of reversed group
        // Recursively reverse remaining list
        head.next = reverseKGroup(current, k);
        
        // prev is new head of this group
        return prev;
    }
    
    // Not enough nodes, return as is
    return head;
}
```

### **97. Implement HashMap class**
```javascript
class HashMap {
    constructor(initialCapacity = 16, loadFactor = 0.75) {
        this.buckets = new Array(initialCapacity);
        this.size = 0;
        this.loadFactor = loadFactor;
        this.capacity = initialCapacity;
        this.threshold = Math.floor(initialCapacity * loadFactor);
    }
    
    // Hash function
    _hash(key) {
        let hash = 0;
        const keyString = String(key);
        
        for (let i = 0; i < keyString.length; i++) {
            hash = (hash << 5) - hash + keyString.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        
        return Math.abs(hash) % this.capacity;
    }
    
    // Put key-value pair
    put(key, value) {
        if (this.size >= this.threshold) {
            this._resize();
        }
        
        const index = this._hash(key);
        
        if (!this.buckets[index]) {
            this.buckets[index] = [];
        }
        
        const bucket = this.buckets[index];
        
        // Check if key already exists
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value;
                return;
            }
        }
        
        // Add new key-value pair
        bucket.push([key, value]);
        this.size++;
    }
    
    // Get value by key
    get(key) {
        const index = this._hash(key);
        const bucket = this.buckets[index];
        
        if (!bucket) return undefined;
        
        for (let [k, v] of bucket) {
            if (k === key) return v;
        }
        
        return undefined;
    }
    
    // Check if key exists
    has(key) {
        return this.get(key) !== undefined;
    }
    
    // Remove key-value pair
    remove(key) {
        const index = this._hash(key);
        const bucket = this.buckets[index];
        
        if (!bucket) return false;
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                this.size--;
                return true;
            }
        }
        
        return false;
    }
    
    // Get all keys
    keys() {
        const keys = [];
        
        for (let bucket of this.buckets) {
            if (bucket) {
                for (let [key] of bucket) {
                    keys.push(key);
                }
            }
        }
        
        return keys;
    }
    
    // Get all values
    values() {
        const values = [];
        
        for (let bucket of this.buckets) {
            if (bucket) {
                for (let [_, value] of bucket) {
                    values.push(value);
                }
            }
        }
        
        return values;
    }
    
    // Get all entries
    entries() {
        const entries = [];
        
        for (let bucket of this.buckets) {
            if (bucket) {
                for (let entry of bucket) {
                    entries.push(entry);
                }
            }
        }
        
        return entries;
    }
    
    // Clear the map
    clear() {
        this.buckets = new Array(this.capacity);
        this.size = 0;
    }
    
    // Get size
    getSize() {
        return this.size;
    }
    
    // Check if empty
    isEmpty() {
        return this.size === 0;
    }
    
    // Resize buckets when threshold reached
    _resize() {
        const oldBuckets = this.buckets;
        this.capacity *= 2;
        this.threshold = Math.floor(this.capacity * this.loadFactor);
        this.buckets = new Array(this.capacity);
        this.size = 0;
        
        // Rehash all entries
        for (let bucket of oldBuckets) {
            if (bucket) {
                for (let [key, value] of bucket) {
                    this.put(key, value);
                }
            }
        }
    }
}

// Usage example:
const map = new HashMap();
map.put('name', 'John');
map.put('age', 30);
console.log(map.get('name')); // 'John'
console.log(map.has('age')); // true
map.remove('age');
console.log(map.getSize()); // 1
```

### **98. Implement Trie (insert, search)**
```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    // Insert a word
    insert(word) {
        let current = this.root;
        
        for (let char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        
        current.isEndOfWord = true;
    }
    
    // Search for a complete word
    search(word) {
        let current = this.root;
        
        for (let char of word) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return current.isEndOfWord;
    }
    
    // Check if prefix exists
    startsWith(prefix) {
        let current = this.root;
        
        for (let char of prefix) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return true;
    }
    
    // Get all words with given prefix
    getAllWordsWithPrefix(prefix) {
        let current = this.root;
        
        // Navigate to the prefix node
        for (let char of prefix) {
            if (!current.children.has(char)) {
                return [];
            }
            current = current.children.get(char);
        }
        
        // Collect all words from this node
        const results = [];
        this._collectWords(current, prefix, results);
        return results;
    }
    
    // Helper to collect words recursively
    _collectWords(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push(prefix);
        }
        
        for (let [char, childNode] of node.children) {
            this._collectWords(childNode, prefix + char, results);
        }
    }
    
    // Delete a word
    delete(word) {
        return this._deleteRecursive(this.root, word, 0);
    }
    
    _deleteRecursive(current, word, index) {
        if (index === word.length) {
            // If end of word is not reached
            if (!current.isEndOfWord) {
                return false;
            }
            
            current.isEndOfWord = false;
            
            // If no children, node can be deleted
            return current.children.size === 0;
        }
        
        const char = word[index];
        const childNode = current.children.get(char);
        
        if (!childNode) {
            return false;
        }
        
        const shouldDeleteChild = this._deleteRecursive(childNode, word, index + 1);
        
        if (shouldDeleteChild) {
            current.children.delete(char);
            
            // If current node is not end of word and has no other children
            return !current.isEndOfWord && current.children.size === 0;
        }
        
        return false;
    }
    
    // Count words in trie
    countWords() {
        return this._countWordsRecursive(this.root);
    }
    
    _countWordsRecursive(node) {
        let count = node.isEndOfWord ? 1 : 0;
        
        for (let childNode of node.children.values()) {
            count += this._countWordsRecursive(childNode);
        }
        
        return count;
    }
    
    // Get all words in trie
    getAllWords() {
        return this.getAllWordsWithPrefix('');
    }
    
    // Clear trie
    clear() {
        this.root = new TrieNode();
    }
}

// Usage example:
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.insert('application');
console.log(trie.search('app')); // true
console.log(trie.search('appl')); // false
console.log(trie.startsWith('app')); // true
console.log(trie.getAllWordsWithPrefix('app'));
// ['app', 'apple', 'application']
```

### **99. Implement Binary Search Tree (insert, search, delete)**
```javascript
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    // Insert a value
    insert(value) {
        const newNode = new TreeNode(value);
        
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        
        let current = this.root;
        
        while (true) {
            if (value === current.value) {
                return undefined; // No duplicates allowed
            }
            
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }
    
    // Search for a value
    search(value) {
        if (!this.root) return false;
        
        let current = this.root;
        
        while (current) {
            if (value === current.value) {
                return true;
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return false;
    }
    
    // Find a value (returns node)
    find(value) {
        if (!this.root) return null;
        
        let current = this.root;
        
        while (current) {
            if (value === current.value) {
                return current;
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return null;
    }
    
    // Delete a value
    delete(value) {
        this.root = this._deleteNode(this.root, value);
    }
    
    _deleteNode(root, value) {
        if (!root) return null;
        
        if (value < root.value) {
            root.left = this._deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = this._deleteNode(root.right, value);
        } else {
            // Node to delete found
            
            // Case 1: No children or only one child
            if (!root.left) {
                return root.right;
            } else if (!root.right) {
                return root.left;
            }
            
            // Case 2: Two children
            // Find inorder successor (smallest in right subtree)
            root.value = this._minValue(root.right);
            
            // Delete the inorder successor
            root.right = this._deleteNode(root.right, root.value);
        }
        
        return root;
    }
    
    _minValue(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current.value;
    }
    
    // Traversals
    
    // Inorder (Left, Root, Right) - sorted order
    inorder() {
        const result = [];
        this._inorderRecursive(this.root, result);
        return result;
    }
    
    _inorderRecursive(node, result) {
        if (node) {
            this._inorderRecursive(node.left, result);
            result.push(node.value);
            this._inorderRecursive(node.right, result);
        }
    }
    
    // Preorder (Root, Left, Right)
    preorder() {
        const result = [];
        this._preorderRecursive(this.root, result);
        return result;
    }
    
    _preorderRecursive(node, result) {
        if (node) {
            result.push(node.value);
            this._preorderRecursive(node.left, result);
            this._preorderRecursive(node.right, result);
        }
    }
    
    // Postorder (Left, Right, Root)
    postorder() {
        const result = [];
        this._postorderRecursive(this.root, result);
        return result;
    }
    
    _postorderRecursive(node, result) {
        if (node) {
            this._postorderRecursive(node.left, result);
            this._postorderRecursive(node.right, result);
            result.push(node.value);
        }
    }
    
    // Level order (BFS)
    levelOrder() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.value);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return result;
    }
    
    // Get minimum value
    getMin() {
        if (!this.root) return null;
        
        let current = this.root;
        while (current.left) {
            current = current.left;
        }
        return current.value;
    }
    
    // Get maximum value
    getMax() {
        if (!this.root) return null;
        
        let current = this.root;
        while (current.right) {
            current = current.right;
        }
        return current.value;
    }
    
    // Get height of tree
    getHeight() {
        return this._getHeightRecursive(this.root);
    }
    
    _getHeightRecursive(node) {
        if (!node) return -1;
        
        const leftHeight = this._getHeightRecursive(node.left);
        const rightHeight = this._getHeightRecursive(node.right);
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    // Check if tree is balanced
    isBalanced() {
        return this._checkBalanced(this.root) !== -1;
    }
    
    _checkBalanced(node) {
        if (!node) return 0;
        
        const leftHeight = this._checkBalanced(node.left);
        const rightHeight = this._checkBalanced(node.right);
        
        if (leftHeight === -1 || rightHeight === -1 || 
            Math.abs(leftHeight - rightHeight) > 1) {
            return -1;
        }
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    // Clear tree
    clear() {
        this.root = null;
    }
    
    // Check if empty
    isEmpty() {
        return this.root === null;
    }
    
    // Get size (number of nodes)
    size() {
        return this._sizeRecursive(this.root);
    }
    
    _sizeRecursive(node) {
        if (!node) return 0;
        return 1 + this._sizeRecursive(node.left) + this._sizeRecursive(node.right);
    }
}

// Usage example:
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);

console.log(bst.search(7)); // true
console.log(bst.search(20)); // false
console.log(bst.inorder()); // [3, 5, 7, 10, 12, 15, 18]
console.log(bst.getMin()); // 3
console.log(bst.getMax()); // 18
console.log(bst.getHeight()); // 2

bst.delete(15);
console.log(bst.search(15)); // false
```

### **100. Implement Min Heap / Max Heap**
```javascript
// Solution 1: Min Heap
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    // Get parent index
    _parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    // Get left child index
    _leftChildIndex(index) {
        return 2 * index + 1;
    }
    
    // Get right child index
    _rightChildIndex(index) {
        return 2 * index + 2;
    }
    
    // Check if has parent
    _hasParent(index) {
        return this._parentIndex(index) >= 0;
    }
    
    // Check if has left child
    _hasLeftChild(index) {
        return this._leftChildIndex(index) < this.heap.length;
    }
    
    // Check if has right child
    _hasRightChild(index) {
        return this._rightChildIndex(index) < this.heap.length;
    }
    
    // Get parent value
    _parent(index) {
        return this.heap[this._parentIndex(index)];
    }
    
    // Get left child value
    _leftChild(index) {
        return this.heap[this._leftChildIndex(index)];
    }
    
    // Get right child value
    _rightChild(index) {
        return this.heap[this._rightChildIndex(index)];
    }
    
    // Swap two elements
    _swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = 
        [this.heap[index2], this.heap[index1]];
    }
    
    // Heapify up
    _heapifyUp() {
        let index = this.heap.length - 1;
        
        while (this._hasParent(index) && this._parent(index) > this.heap[index]) {
            const parentIndex = this._parentIndex(index);
            this._swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    // Heapify down
    _heapifyDown() {
        let index = 0;
        
        while (this._hasLeftChild(index)) {
            let smallerChildIndex = this._leftChildIndex(index);
            
            if (this._hasRightChild(index) && 
                this._rightChild(index) < this._leftChild(index)) {
                smallerChildIndex = this._rightChildIndex(index);
            }
            
            if (this.heap[index] < this.heap[smallerChildIndex]) {
                break;
            }
            
            this._swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }
    
    // Insert value
    insert(value) {
        this.heap.push(value);
        this._heapifyUp();
    }
    
    // Extract minimum
    extractMin() {
        if (this.isEmpty()) {
            throw new Error('Heap is empty');
        }
        
        const min = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._heapifyDown();
        }
        
        return min;
    }
    
    // Peek at minimum
    peek() {
        if (this.isEmpty()) {
            throw new Error('Heap is empty');
        }
        return this.heap[0];
    }
    
    // Get size
    size() {
        return this.heap.length;
    }
    
    // Check if empty
    isEmpty() {
        return this.heap.length === 0;
    }
    
    // Build heap from array
    buildHeap(array) {
        this.heap = array;
        
        // Start from the last non-leaf node
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this._heapifyDownFrom(i);
        }
    }
    
    _heapifyDownFrom(index) {
        let currentIndex = index;
        
        while (this._hasLeftChild(currentIndex)) {
            let smallerChildIndex = this._leftChildIndex(currentIndex);
            
            if (this._hasRightChild(currentIndex) && 
                this._rightChild(currentIndex) < this._leftChild(currentIndex)) {
                smallerChildIndex = this._rightChildIndex(currentIndex);
            }
            
            if (this.heap[currentIndex] < this.heap[smallerChildIndex]) {
                break;
            }
            
            this._swap(currentIndex, smallerChildIndex);
            currentIndex = smallerChildIndex;
        }
    }
    
    // Clear heap
    clear() {
        this.heap = [];
    }
}

// Solution 2: Max Heap (just reverse comparisons)
class MaxHeap extends MinHeap {
    _heapifyUp() {
        let index = this.heap.length - 1;
        
        while (this._hasParent(index) && this._parent(index) < this.heap[index]) {
            const parentIndex = this._parentIndex(index);
            this._swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    _heapifyDown() {
        let index = 0;
        
        while (this._hasLeftChild(index)) {
            let largerChildIndex = this._leftChildIndex(index);
            
            if (this._hasRightChild(index) && 
                this._rightChild(index) > this._leftChild(index)) {
                largerChildIndex = this._rightChildIndex(index);
            }
            
            if (this.heap[index] > this.heap[largerChildIndex]) {
                break;
            }
            
            this._swap(index, largerChildIndex);
            index = largerChildIndex;
        }
    }
    
    // For MaxHeap, we extract maximum
    extractMax() {
        return super.extractMin();
    }
    
    peekMax() {
        return super.peek();
    }
    
    _heapifyDownFrom(index) {
        let currentIndex = index;
        
        while (this._hasLeftChild(currentIndex)) {
            let largerChildIndex = this._leftChildIndex(currentIndex);
            
            if (this._hasRightChild(currentIndex) && 
                this._rightChild(currentIndex) > this._leftChild(currentIndex)) {
                largerChildIndex = this._rightChildIndex(currentIndex);
            }
            
            if (this.heap[currentIndex] > this.heap[largerChildIndex]) {
                break;
            }
            
            this._swap(currentIndex, largerChildIndex);
            currentIndex = largerChildIndex;
        }
    }
}

// Solution 3: Generic Heap with comparator
class Heap {
    constructor(comparator = (a, b) => a - b) {
        this.heap = [];
        this.comparator = comparator;
    }
    
    _parentIndex(index) { return Math.floor((index - 1) / 2); }
    _leftChildIndex(index) { return 2 * index + 1; }
    _rightChildIndex(index) { return 2 * index + 2; }
    _hasParent(index) { return this._parentIndex(index) >= 0; }
    _hasLeftChild(index) { return this._leftChildIndex(index) < this.heap.length; }
    _hasRightChild(index) { return this._rightChildIndex(index) < this.heap.length; }
    _parent(index) { return this.heap[this._parentIndex(index)]; }
    _leftChild(index) { return this.heap[this._leftChildIndex(index)]; }
    _rightChild(index) { return this.heap[this._rightChildIndex(index)]; }
    _swap(i, j) { [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]; }
    
    _heapifyUp() {
        let index = this.heap.length - 1;
        
        while (this._hasParent(index) && 
               this.comparator(this._parent(index), this.heap[index]) > 0) {
            const parentIndex = this._parentIndex(index);
            this._swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    _heapifyDown() {
        let index = 0;
        
        while (this._hasLeftChild(index)) {
            let childIndex = this._leftChildIndex(index);
            
            if (this._hasRightChild(index) && 
                this.comparator(this._rightChild(index), this._leftChild(index)) < 0) {
                childIndex = this._rightChildIndex(index);
            }
            
            if (this.comparator(this.heap[index], this.heap[childIndex]) <= 0) {
                break;
            }
            
            this._swap(index, childIndex);
            index = childIndex;
        }
    }
    
    insert(value) {
        this.heap.push(value);
        this._heapifyUp();
    }
    
    extract() {
        if (this.isEmpty()) throw new Error('Heap is empty');
        
        const value = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._heapifyDown();
        }
        
        return value;
    }
    
    peek() {
        if (this.isEmpty()) throw new Error('Heap is empty');
        return this.heap[0];
    }
    
    size() { return this.heap.length; }
    isEmpty() { return this.heap.length === 0; }
    clear() { this.heap = []; }
}

// Usage examples:
const minHeap = new MinHeap();
minHeap.insert(10);
minHeap.insert(5);
minHeap.insert(20);
minHeap.insert(1);
console.log(minHeap.extractMin()); // 1
console.log(minHeap.peek()); // 5

const maxHeap = new MaxHeap();
maxHeap.insert(10);
maxHeap.insert(5);
maxHeap.insert(20);
maxHeap.insert(1);
console.log(maxHeap.extractMax()); // 20
console.log(maxHeap.peekMax()); // 10

// Custom comparator for min heap of objects
const objectMinHeap = new Heap((a, b) => a.priority - b.priority);
objectMinHeap.insert({value: 'Task 1', priority: 3});
objectMinHeap.insert({value: 'Task 2', priority: 1});
objectMinHeap.insert({value: 'Task 3', priority: 2});
console.log(objectMinHeap.extract()); // {value: 'Task 2', priority: 1}
```

## **Key Takeaways:**

1. **Multiple approaches** for each problem demonstrate different trade-offs
2. **Time vs Space Complexity**: Always consider both when choosing solution
3. **Edge Cases**: Solutions handle edge cases like empty inputs, single elements, etc.
4. **Modern JavaScript**: Uses ES6+ features like arrow functions, destructuring, spread operator
5. **Readability**: Code is commented and structured for easy understanding
6. **Practicality**: Real-world considerations included (error handling, optimization)

This comprehensive collection covers the most frequently asked JavaScript coding interview questions with multiple solutions each. Practice these to master JavaScript fundamentals and ace your interviews!

# **Additional 50 JavaScript Coding Interview Questions with Multiple Solutions**

## **ARRAY MANIPULATION**

### **1. Implement Array.groupBy() (Polyfill)**
```javascript
// Solution 1: Using reduce
Array.prototype.groupBy = function(keyFn) {
    return this.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
};

// Solution 2: Using Map
Array.prototype.groupByMap = function(keyFn) {
    const map = new Map();
    
    this.forEach(item => {
        const key = keyFn(item);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
    });
    
    return Object.fromEntries(map);
};

// Solution 3: With value transformation
Array.prototype.groupByTransform = function(keyFn, valueFn = x => x) {
    return this.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) groups[key] = [];
        groups[key].push(valueFn(item));
        return groups;
    }, {});
};

// Usage:
const arr = [1, 2, 3, 4, 5];
console.log(arr.groupBy(x => x % 2 === 0 ? 'even' : 'odd'));
// { odd: [1, 3, 5], even: [2, 4] }
```

### **2. Implement Array.flatMap()**
```javascript
// Solution 1: Using reduce
Array.prototype.flatMap = function(callback) {
    return this.reduce((acc, item, index, array) => {
        const result = callback(item, index, array);
        return acc.concat(Array.isArray(result) ? result : [result]);
    }, []);
};

// Solution 2: Using map and flat
Array.prototype.flatMap2 = function(callback) {
    return this.map(callback).flat();
};

// Solution 3: Manual implementation
Array.prototype.flatMap3 = function(callback, thisArg) {
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        const mapped = callback.call(thisArg, this[i], i, this);
        
        if (Array.isArray(mapped)) {
            for (let j = 0; j < mapped.length; j++) {
                result.push(mapped[j]);
            }
        } else {
            result.push(mapped);
        }
    }
    
    return result;
};
```

### **3. Array partition based on condition**
```javascript
// Solution 1: Using reduce
function partition(arr, condition) {
    return arr.reduce((acc, item) => {
        acc[condition(item) ? 0 : 1].push(item);
        return acc;
    }, [[], []]);
}

// Solution 2: Using for loop
function partition2(arr, condition) {
    const truthy = [];
    const falsy = [];
    
    for (let item of arr) {
        if (condition(item)) {
            truthy.push(item);
        } else {
            falsy.push(item);
        }
    }
    
    return [truthy, falsy];
}

// Solution 3: Using filter
function partition3(arr, condition) {
    return [
        arr.filter(condition),
        arr.filter(item => !condition(item))
    ];
}

// Usage:
const numbers = [1, 2, 3, 4, 5, 6];
console.log(partition(numbers, x => x % 2 === 0));
// [[2, 4, 6], [1, 3, 5]]
```

### **4. Find all permutations of an array**
```javascript
// Solution 1: Heap's Algorithm (iterative)
function permutations(arr) {
    const result = [];
    const n = arr.length;
    const c = new Array(n).fill(0);
    
    result.push([...arr]);
    
    let i = 0;
    while (i < n) {
        if (c[i] < i) {
            if (i % 2 === 0) {
                [arr[0], arr[i]] = [arr[i], arr[0]];
            } else {
                [arr[c[i]], arr[i]] = [arr[i], arr[c[i]]];
            }
            result.push([...arr]);
            c[i]++;
            i = 0;
        } else {
            c[i] = 0;
            i++;
        }
    }
    
    return result;
}

// Solution 2: Recursive backtracking
function permutations2(arr) {
    const result = [];
    
    function backtrack(start) {
        if (start === arr.length - 1) {
            result.push([...arr]);
            return;
        }
        
        for (let i = start; i < arr.length; i++) {
            [arr[start], arr[i]] = [arr[i], arr[start]];
            backtrack(start + 1);
            [arr[start], arr[i]] = [arr[i], arr[start]];
        }
    }
    
    backtrack(0);
    return result;
}

// Solution 3: Using recursion with visited array
function permutations3(arr) {
    const result = [];
    const visited = new Array(arr.length).fill(false);
    
    function dfs(current) {
        if (current.length === arr.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < arr.length; i++) {
            if (!visited[i]) {
                visited[i] = true;
                current.push(arr[i]);
                dfs(current);
                current.pop();
                visited[i] = false;
            }
        }
    }
    
    dfs([]);
    return result;
}
```

### **5. Find all subsets/power set**
```javascript
// Solution 1: Bit manipulation
function powerSet(arr) {
    const result = [];
    const n = arr.length;
    const total = 1 << n; // 2^n
    
    for (let i = 0; i < total; i++) {
        const subset = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) {
                subset.push(arr[j]);
            }
        }
        result.push(subset);
    }
    
    return result;
}

// Solution 2: Recursive
function powerSet2(arr) {
    const result = [];
    
    function backtrack(start, current) {
        result.push([...current]);
        
        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// Solution 3: Using reduce
function powerSet3(arr) {
    return arr.reduce(
        (subsets, value) => subsets.concat(
            subsets.map(set => [...set, value])
        ),
        [[]]
    );
}
```

### **6. Find contiguous subarray with maximum sum (Kadane's Algorithm)**
```javascript
// Solution 1: Kadane's Algorithm
function maxSubarraySum(arr) {
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// Solution 2: With indices
function maxSubarraySumWithIndices(arr) {
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    let start = 0, end = 0, tempStart = 0;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxEndingHere + arr[i]) {
            maxEndingHere = arr[i];
            tempStart = i;
        } else {
            maxEndingHere = maxEndingHere + arr[i];
        }
        
        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
    }
    
    return {
        sum: maxSoFar,
        subarray: arr.slice(start, end + 1)
    };
}

// Solution 3: Divide and conquer
function maxSubarraySumDC(arr, left = 0, right = arr.length - 1) {
    if (left === right) return arr[left];
    
    const mid = Math.floor((left + right) / 2);
    
    const leftMax = maxSubarraySumDC(arr, left, mid);
    const rightMax = maxSubarraySumDC(arr, mid + 1, right);
    const crossMax = maxCrossingSum(arr, left, mid, right);
    
    return Math.max(leftMax, rightMax, crossMax);
    
    function maxCrossingSum(arr, left, mid, right) {
        let sum = 0;
        let leftSum = -Infinity;
        
        for (let i = mid; i >= left; i--) {
            sum += arr[i];
            if (sum > leftSum) leftSum = sum;
        }
        
        sum = 0;
        let rightSum = -Infinity;
        
        for (let i = mid + 1; i <= right; i++) {
            sum += arr[i];
            if (sum > rightSum) rightSum = sum;
        }
        
        return leftSum + rightSum;
    }
}
```

### **7. Find kth largest/smallest element in array**
```javascript
// Solution 1: Using sort
function kthLargest(arr, k) {
    const sorted = [...arr].sort((a, b) => b - a);
    return sorted[k - 1];
}

// Solution 2: Quickselect algorithm (O(n) average)
function kthLargest2(arr, k) {
    return quickSelect([...arr], 0, arr.length - 1, arr.length - k);
    
    function quickSelect(arr, left, right, k) {
        if (left === right) return arr[left];
        
        const pivotIndex = partition(arr, left, right);
        
        if (k === pivotIndex) {
            return arr[k];
        } else if (k < pivotIndex) {
            return quickSelect(arr, left, pivotIndex - 1, k);
        } else {
            return quickSelect(arr, pivotIndex + 1, right, k);
        }
    }
    
    function partition(arr, left, right) {
        const pivot = arr[right];
        let i = left;
        
        for (let j = left; j < right; j++) {
            if (arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
            }
        }
        
        [arr[i], arr[right]] = [arr[right], arr[i]];
        return i;
    }
}

// Solution 3: Using min/max heap
function kthLargestHeap(arr, k) {
    const minHeap = new MinHeap();
    
    for (let num of arr) {
        minHeap.insert(num);
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }
    
    return minHeap.peek();
}
```

### **8. Implement Array.shuffle() (Fisher-Yates)**
```javascript
// Solution 1: Fisher-Yates shuffle
Array.prototype.shuffle = function() {
    const arr = [...this];
    
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
};

// Solution 2: Durstenfeld shuffle (optimized)
Array.prototype.shuffle2 = function() {
    const arr = [...this];
    
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
};

// Solution 3: Using sort with random comparator
Array.prototype.shuffle3 = function() {
    return [...this].sort(() => Math.random() - 0.5);
};

// Solution 4: In-place shuffle
Array.prototype.shuffleInPlace = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};
```

### **9. Array sliding window maximum**
```javascript
// Solution 1: Brute force
function slidingWindowMax(arr, k) {
    const result = [];
    
    for (let i = 0; i <= arr.length - k; i++) {
        let max = arr[i];
        for (let j = 1; j < k; j++) {
            if (arr[i + j] > max) max = arr[i + j];
        }
        result.push(max);
    }
    
    return result;
}

// Solution 2: Using deque (monotonic queue)
function slidingWindowMax2(arr, k) {
    const result = [];
    const deque = []; // stores indices
    
    for (let i = 0; i < arr.length; i++) {
        // Remove indices outside window
        if (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove smaller elements from back
        while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add to result when window is formed
        if (i >= k - 1) {
            result.push(arr[deque[0]]);
        }
    }
    
    return result;
}

// Solution 3: Using max heap
function slidingWindowMax3(arr, k) {
    const result = [];
    const maxHeap = new MaxHeap();
    
    for (let i = 0; i < arr.length; i++) {
        maxHeap.insert({ value: arr[i], index: i });
        
        if (i >= k - 1) {
            // Remove elements outside window
            while (maxHeap.peek().index <= i - k) {
                maxHeap.extractMax();
            }
            result.push(maxHeap.peek().value);
        }
    }
    
    return result;
}
```

### **10. Array product except self**
```javascript
// Solution 1: Using division (not allowed if zeros exist)
function productExceptSelf(arr) {
    const totalProduct = arr.reduce((acc, num) => acc * num, 1);
    return arr.map(num => totalProduct / num);
}

// Solution 2: Prefix and suffix products
function productExceptSelf2(arr) {
    const n = arr.length;
    const result = new Array(n).fill(1);
    let leftProduct = 1;
    let rightProduct = 1;
    
    // Left pass
    for (let i = 0; i < n; i++) {
        result[i] = leftProduct;
        leftProduct *= arr[i];
    }
    
    // Right pass
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= arr[i];
    }
    
    return result;
}

// Solution 3: Two arrays approach
function productExceptSelf3(arr) {
    const n = arr.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);
    const result = new Array(n);
    
    // Fill left array
    for (let i = 1; i < n; i++) {
        left[i] = left[i - 1] * arr[i - 1];
    }
    
    // Fill right array
    for (let i = n - 2; i >= 0; i--) {
        right[i] = right[i + 1] * arr[i + 1];
    }
    
    // Combine
    for (let i = 0; i < n; i++) {
        result[i] = left[i] * right[i];
    }
    
    return result;
}
```

## **STRING MANIPULATION**

### **11. Implement String.prototype.includes()**
```javascript
// Solution 1: Using indexOf
String.prototype.includes = function(search, start = 0) {
    if (typeof search !== 'string') {
        throw new TypeError('search must be a string');
    }
    
    return this.indexOf(search, start) !== -1;
};

// Solution 2: Using regex
String.prototype.includes2 = function(search, start = 0) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const str = start > 0 ? this.substring(start) : this;
    return regex.test(str);
};

// Solution 3: Manual search
String.prototype.includes3 = function(search, start = 0) {
    if (search.length > this.length) return false;
    
    for (let i = start; i <= this.length - search.length; i++) {
        let found = true;
        for (let j = 0; j < search.length; j++) {
            if (this[i + j] !== search[j]) {
                found = false;
                break;
            }
        }
        if (found) return true;
    }
    
    return false;
};
```

### **12. Implement String.prototype.startsWith()**
```javascript
// Solution 1: Using slice
String.prototype.startsWith = function(search, position = 0) {
    return this.slice(position, position + search.length) === search;
};

// Solution 2: Using indexOf
String.prototype.startsWith2 = function(search, position = 0) {
    return this.indexOf(search, position) === position;
};

// Solution 3: Manual check
String.prototype.startsWith3 = function(search, position = 0) {
    if (search.length > this.length - position) return false;
    
    for (let i = 0; i < search.length; i++) {
        if (this[position + i] !== search[i]) return false;
    }
    
    return true;
};
```

### **13. Implement String.prototype.endsWith()**
```javascript
// Solution 1: Using slice
String.prototype.endsWith = function(search, length = this.length) {
    const end = length > this.length ? this.length : length;
    const start = end - search.length;
    
    if (start < 0) return false;
    return this.slice(start, end) === search;
};

// Solution 2: Using lastIndexOf
String.prototype.endsWith2 = function(search, length = this.length) {
    const str = length < this.length ? this.substring(0, length) : this;
    return str.lastIndexOf(search) === str.length - search.length;
};
```

### **14. Implement String.prototype.repeat()**
```javascript
// Solution 1: Using join
String.prototype.repeat = function(count) {
    if (count < 0) throw new RangeError('Invalid count');
    if (count === 0) return '';
    
    return Array(count + 1).join(this);
};

// Solution 2: Using while loop
String.prototype.repeat2 = function(count) {
    if (count < 0) throw new RangeError('Invalid count');
    if (count === 0) return '';
    
    let result = '';
    let str = this;
    
    while (count > 0) {
        if (count & 1) result += str;
        str += str;
        count >>= 1;
    }
    
    return result;
};

// Solution 3: Using for loop
String.prototype.repeat3 = function(count) {
    if (count < 0) throw new RangeError('Invalid count');
    
    let result = '';
    for (let i = 0; i < count; i++) {
        result += this;
    }
    return result;
};
```

### **15. Implement String.prototype.padStart()**
```javascript
// Solution 1: Basic implementation
String.prototype.padStart = function(targetLength, padString = ' ') {
    if (this.length >= targetLength) return String(this);
    
    const padCount = targetLength - this.length;
    let pad = '';
    
    if (padString !== '') {
        while (pad.length < padCount) {
            pad += padString;
        }
        pad = pad.slice(0, padCount);
    }
    
    return pad + this;
};

// Solution 2: Using repeat
String.prototype.padStart2 = function(targetLength, padString = ' ') {
    if (this.length >= targetLength) return String(this);
    
    const padCount = targetLength - this.length;
    const pad = padString.repeat(Math.ceil(padCount / padString.length))
                        .slice(0, padCount);
    
    return pad + this;
};
```

### **16. Implement String.prototype.trim()**
```javascript
// Solution 1: Using regex
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

// Solution 2: Manual implementation
String.prototype.trim2 = function() {
    let start = 0;
    let end = this.length - 1;
    
    // Find first non-whitespace
    while (start <= end && this[start] === ' ') start++;
    
    // Find last non-whitespace
    while (end >= start && this[end] === ' ') end--;
    
    return this.substring(start, end + 1);
};

// Solution 3: Trim all whitespace characters
String.prototype.trim3 = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

// Trim left only
String.prototype.trimLeft = function() {
    return this.replace(/^\s+/, '');
};

// Trim right only
String.prototype.trimRight = function() {
    return this.replace(/\s+$/, '');
};
```

### **17. String compression (run-length encoding)**
```javascript
// Solution 1: Basic run-length encoding
function compressString(str) {
    let result = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1]) {
            count++;
        } else {
            result += str[i] + (count > 1 ? count : '');
            count = 1;
        }
    }
    
    return result.length < str.length ? result : str;
}

// Solution 2: Using regex
function compressString2(str) {
    let result = '';
    let match;
    let i = 0;
    
    while (i < str.length) {
        match = str[i];
        let count = 0;
        
        while (i < str.length && str[i] === match) {
            count++;
            i++;
        }
        
        result += match + (count > 1 ? count : '');
    }
    
    return result.length < str.length ? result : str;
}

// Solution 3: Two-pointer approach
function compressString3(str) {
    const chars = str.split('');
    let index = 0;
    let i = 0;
    
    while (i < chars.length) {
        let j = i;
        
        while (j < chars.length && chars[j] === chars[i]) {
            j++;
        }
        
        chars[index++] = chars[i];
        
        if (j - i > 1) {
            const count = (j - i).toString();
            for (let c of count) {
                chars[index++] = c;
            }
        }
        
        i = j;
    }
    
    return chars.slice(0, index).join('');
}
```

### **18. String to integer (atoi)**
```javascript
// Solution 1: Parse with validation
function atoi(str) {
    str = str.trim();
    if (!str) return 0;
    
    let sign = 1;
    let i = 0;
    let result = 0;
    
    // Check sign
    if (str[i] === '+' || str[i] === '-') {
        sign = str[i] === '-' ? -1 : 1;
        i++;
    }
    
    // Parse digits
    while (i < str.length && str[i] >= '0' && str[i] <= '9') {
        result = result * 10 + (str.charCodeAt(i) - 48);
        i++;
    }
    
    result *= sign;
    
    // Clamp to 32-bit integer range
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    if (result > INT_MAX) return INT_MAX;
    if (result < INT_MIN) return INT_MIN;
    
    return result;
}

// Solution 2: Using parseInt with validation
function atoi2(str) {
    const num = parseInt(str, 10);
    
    if (isNaN(num)) return 0;
    
    const INT_MAX = Math.pow(2, 31) - 1;
    const INT_MIN = -Math.pow(2, 31);
    
    if (num > INT_MAX) return INT_MAX;
    if (num < INT_MIN) return INT_MIN;
    
    return num;
}
```

### **19. String zigzag conversion**
```javascript
// Solution 1: Row traversal
function zigzagConvert(s, numRows) {
    if (numRows === 1 || s.length <= numRows) return s;
    
    const rows = new Array(numRows).fill('');
    let currentRow = 0;
    let goingDown = false;
    
    for (let char of s) {
        rows[currentRow] += char;
        
        if (currentRow === 0 || currentRow === numRows - 1) {
            goingDown = !goingDown;
        }
        
        currentRow += goingDown ? 1 : -1;
    }
    
    return rows.join('');
}

// Solution 2: Visit by row
function zigzagConvert2(s, numRows) {
    if (numRows === 1) return s;
    
    const result = [];
    const cycleLen = 2 * numRows - 2;
    
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j + i < s.length; j += cycleLen) {
            result.push(s[j + i]);
            
            if (i !== 0 && i !== numRows - 1 && j + cycleLen - i < s.length) {
                result.push(s[j + cycleLen - i]);
            }
        }
    }
    
    return result.join('');
}
```

### **20. Count and say sequence**
```javascript
// Solution 1: Iterative
function countAndSay(n) {
    let result = '1';
    
    for (let i = 1; i < n; i++) {
        let temp = '';
        let count = 1;
        
        for (let j = 0; j < result.length; j++) {
            if (result[j] === result[j + 1]) {
                count++;
            } else {
                temp += count + result[j];
                count = 1;
            }
        }
        
        result = temp;
    }
    
    return result;
}

// Solution 2: Recursive
function countAndSay2(n) {
    if (n === 1) return '1';
    
    const prev = countAndSay2(n - 1);
    let result = '';
    let count = 1;
    
    for (let i = 0; i < prev.length; i++) {
        if (prev[i] === prev[i + 1]) {
            count++;
        } else {
            result += count + prev[i];
            count = 1;
        }
    }
    
    return result;
}

// Solution 3: Using regex
function countAndSay3(n) {
    let result = '1';
    
    for (let i = 1; i < n; i++) {
        result = result.replace(/(.)\1*/g, match => 
            match.length + match[0]
        );
    }
    
    return result;
}
```

## **OBJECT & FUNCTIONAL PROGRAMMING**

### **21. Implement Function.prototype.bind()**
```javascript
// Solution 1: Basic implementation
Function.prototype.bind = function(context, ...args) {
    const fn = this;
    
    return function(...innerArgs) {
        return fn.apply(context, [...args, ...innerArgs]);
    };
};

// Solution 2: With new operator support
Function.prototype.bind2 = function(context, ...args) {
    const fn = this;
    
    const bound = function(...innerArgs) {
        // Check if called with new
        const isNewCall = this instanceof bound;
        
        return fn.apply(
            isNewCall ? this : context,
            [...args, ...innerArgs]
        );
    };
    
    // Preserve prototype chain
    bound.prototype = Object.create(fn.prototype);
    
    return bound;
};

// Solution 3: Using Object.create
Function.prototype.bind3 = function(context, ...args) {
    const fn = this;
    
    const bound = function(...innerArgs) {
        return fn.call(
            this instanceof bound ? this : context,
            ...args,
            ...innerArgs
        );
    };
    
    if (fn.prototype) {
        bound.prototype = Object.create(fn.prototype);
    }
    
    return bound;
};
```

### **22. Implement Function.prototype.call()**
```javascript
// Solution 1: Using eval
Function.prototype.call = function(context, ...args) {
    context = context || window;
    const uniqueKey = Symbol('fn');
    context[uniqueKey] = this;
    
    const result = context[uniqueKey](...args);
    delete context[uniqueKey];
    
    return result;
};

// Solution 2: Using apply
Function.prototype.call2 = function(context, ...args) {
    return this.apply(context, args);
};

// Solution 3: Without spread operator
Function.prototype.call3 = function(context) {
    context = context || window;
    context.fn = this;
    
    const args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    
    const result = eval('context.fn(' + args + ')');
    delete context.fn;
    
    return result;
};
```

### **23. Implement Function.prototype.apply()**
```javascript
// Solution 1: Using call
Function.prototype.apply = function(context, args) {
    context = context || window;
    const uniqueKey = Symbol('fn');
    context[uniqueKey] = this;
    
    const result = context[uniqueKey](...(args || []));
    delete context[uniqueKey];
    
    return result;
};

// Solution 2: Without spread operator
Function.prototype.apply2 = function(context, args) {
    context = context || window;
    context.fn = this;
    
    let result;
    if (!args) {
        result = context.fn();
    } else {
        const argsArray = [];
        for (let i = 0; i < args.length; i++) {
            argsArray.push('args[' + i + ']');
        }
        result = eval('context.fn(' + argsArray + ')');
    }
    
    delete context.fn;
    return result;
};
```

### **24. Implement curry function**
```javascript
// Solution 1: Basic curry
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, [...args, ...args2]);
            };
        }
    };
}

// Solution 2: Placeholder support
function curryWithPlaceholder(fn) {
    return function curried(...args) {
        const complete = args.length >= fn.length &&
            !args.slice(0, fn.length).includes(curry.placeholder);
        
        if (complete) {
            return fn.apply(this, args);
        }
        
        return function(...args2) {
            const combined = [];
            let i = 0, j = 0;
            
            while (i < args.length || j < args2.length) {
                if (i < args.length && args[i] !== curry.placeholder) {
                    combined.push(args[i]);
                    i++;
                } else if (j < args2.length) {
                    combined.push(args2[j]);
                    j++;
                    i++;
                } else {
                    combined.push(curry.placeholder);
                    i++;
                }
            }
            
            return curried.apply(this, combined);
        };
    };
}

curryWithPlaceholder.placeholder = Symbol('_');

// Solution 3: Infinite curry
function infiniteCurry(fn) {
    return function curried(...args) {
        return function(...args2) {
            if (args2.length === 0) {
                return args.reduce((acc, arg) => fn(acc, arg));
            }
            return curried(...args, ...args2);
        };
    };
}

// Usage examples:
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
```

### **25. Implement pipe/compose functions**
```javascript
// Solution 1: Pipe (left to right)
function pipe(...fns) {
    return function(input) {
        return fns.reduce((acc, fn) => fn(acc), input);
    };
}

// Solution 2: Compose (right to left)
function compose(...fns) {
    return function(input) {
        return fns.reduceRight((acc, fn) => fn(acc), input);
    };
}

// Solution 3: Pipe with async support
function asyncPipe(...fns) {
    return async function(input) {
        let result = input;
        
        for (const fn of fns) {
            result = await fn(result);
        }
        
        return result;
    };
}

// Solution 4: Compose with multiple arguments
function composeWithArgs(...fns) {
    return fns.reduce((f, g) => (...args) => f(g(...args)));
}

// Usage:
const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

const myPipe = pipe(add5, multiply3, subtract2);
console.log(myPipe(10)); // (10 + 5) * 3 - 2 = 43

const myCompose = compose(subtract2, multiply3, add5);
console.log(myCompose(10)); // 10 + 5 = 15, 15 * 3 = 45, 45 - 2 = 43
```

### **26. Implement throttle with leading and trailing options**
```javascript
// Solution 1: Complete throttle implementation
function throttle(fn, delay, options = {}) {
    let lastCall = 0;
    let timeoutId;
    let lastArgs;
    let lastContext;
    
    const { leading = true, trailing = true } = options;
    
    return function throttled(...args) {
        const now = Date.now();
        lastContext = this;
        lastArgs = args;
        
        if (!lastCall && !leading) {
            lastCall = now;
        }
        
        const remaining = delay - (now - lastCall);
        
        if (remaining <= 0 || remaining > delay) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            lastCall = now;
            fn.apply(lastContext, lastArgs);
        } else if (!timeoutId && trailing) {
            timeoutId = setTimeout(() => {
                lastCall = leading ? Date.now() : 0;
                timeoutId = null;
                fn.apply(lastContext, lastArgs);
            }, remaining);
        }
    };
}

// Solution 2: Using requestAnimationFrame for smooth animations
function throttleRAF(fn) {
    let ticking = false;
    
    return function throttled(...args) {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                fn.apply(this, args);
                ticking = false;
            });
        }
    };
}

// Solution 3: Throttle with cancel and flush
function throttleWithControls(fn, delay) {
    let timeoutId;
    let lastCall = 0;
    let lastArgs;
    let lastContext;
    
    function throttled(...args) {
        const now = Date.now();
        lastContext = this;
        lastArgs = args;
        
        const remaining = delay - (now - lastCall);
        
        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            lastCall = now;
            fn.apply(lastContext, lastArgs);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                fn.apply(lastContext, lastArgs);
            }, remaining);
        }
    }
    
    throttled.cancel = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
    
    throttled.flush = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            fn.apply(lastContext, lastArgs);
        }
    };
    
    return throttled;
}
```

### **27. Implement debounce with immediate option**
```javascript
// Solution 1: Complete debounce implementation
function debounce(fn, delay, immediate = false) {
    let timeoutId;
    
    return function debounced(...args) {
        const context = this;
        
        const later = function() {
            timeoutId = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        };
        
        const callNow = immediate && !timeoutId;
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(later, delay);
        
        if (callNow) {
            fn.apply(context, args);
        }
    };
}

// Solution 2: Debounce with cancel and flush
function debounceWithControls(fn, delay, immediate = false) {
    let timeoutId;
    let lastArgs;
    let lastContext;
    let result;
    
    function debounced(...args) {
        lastContext = this;
        lastArgs = args;
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        if (immediate && !timeoutId) {
            timeoutId = setTimeout(() => {
                timeoutId = null;
            }, delay);
            result = fn.apply(lastContext, lastArgs);
        } else {
            timeoutId = setTimeout(() => {
                timeoutId = null;
                if (!immediate) {
                    result = fn.apply(lastContext, lastArgs);
                }
            }, delay);
        }
        
        return result;
    }
    
    debounced.cancel = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
    
    debounced.flush = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            if (!immediate) {
                result = fn.apply(lastContext, lastArgs);
            }
        }
        return result;
    };
    
    return debounced;
}

// Solution 3: Debounce with max wait
function debounceWithMaxWait(fn, delay, options = {}) {
    const { maxWait, immediate = false } = options;
    let timeoutId;
    let lastCall = 0;
    let maxTimeoutId;
    
    return function debounced(...args) {
        const context = this;
        const now = Date.now();
        
        const later = function() {
            timeoutId = null;
            if (!immediate || (maxWait && now - lastCall >= maxWait)) {
                fn.apply(context, args);
            }
        };
        
        const callNow = immediate && !timeoutId;
        
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(later, delay);
        
        if (maxWait && !maxTimeoutId) {
            maxTimeoutId = setTimeout(() => {
                maxTimeoutId = null;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                    fn.apply(context, args);
                }
            }, maxWait);
        }
        
        if (callNow) {
            fn.apply(context, args);
        }
        
        lastCall = now;
    };
}
```

### **28. Implement once function**
```javascript
// Solution 1: Basic once
function once(fn) {
    let called = false;
    let result;
    
    return function(...args) {
        if (!called) {
            called = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}

// Solution 2: Once with reset capability
function onceWithReset(fn) {
    let called = false;
    let result;
    
    function onceFn(...args) {
        if (!called) {
            called = true;
            result = fn.apply(this, args);
        }
        return result;
    }
    
    onceFn.reset = function() {
        called = false;
        result = undefined;
    };
    
    return onceFn;
}

// Solution 3: Once with cache key
function onceWithKey(fn, keyFn = (...args) => JSON.stringify(args)) {
    const cache = new Map();
    
    return function(...args) {
        const key = keyFn(...args);
        
        if (!cache.has(key)) {
            cache.set(key, fn.apply(this, args));
        }
        
        return cache.get(key);
    };
}

// Usage:
const initialize = once(() => {
    console.log('Initialized!');
    return Date.now();
});

console.log(initialize()); // "Initialized!" and timestamp
console.log(initialize()); // cached timestamp only
```

### **29. Implement memoize with cache size limit**
```javascript
// Solution 1: LRU cache implementation
function memoizeLRU(fn, cacheSize = 100) {
    const cache = new Map();
    
    return function memoized(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn.apply(this, args);
        
        // Remove oldest if cache size exceeded
        if (cache.size >= cacheSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}

// Solution 2: Memoize with TTL (time to live)
function memoizeTTL(fn, ttl = 60000) { // 1 minute default
    const cache = new Map();
    
    return function memoized(...args) {
        const key = JSON.stringify(args);
        const now = Date.now();
        
        if (cache.has(key)) {
            const { value, expiry } = cache.get(key);
            
            if (now < expiry) {
                return value;
            } else {
                cache.delete(key);
            }
        }
        
        const result = fn.apply(this, args);
        cache.set(key, {
            value: result,
            expiry: now + ttl
        });
        
        return result;
    };
}

// Solution 3: Memoize with custom cache key
function memoizeCustom(fn, options = {}) {
    const {
        cacheSize = Infinity,
        keyFn = (...args) => JSON.stringify(args),
        ttl
    } = options;
    
    const cache = new Map();
    
    return function memoized(...args) {
        const key = keyFn(...args);
        const now = Date.now();
        
        if (cache.has(key)) {
            const cached = cache.get(key);
            
            if (!ttl || now < cached.expiry) {
                return cached.value;
            }
            cache.delete(key);
        }
        
        const result = fn.apply(this, args);
        
        cache.set(key, {
            value: result,
            expiry: ttl ? now + ttl : Infinity
        });
        
        if (cache.size > cacheSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        return result;
    };
}
```

### **30. Implement deep freeze object**
```javascript
// Solution 1: Recursive deep freeze
function deepFreeze(obj) {
    // Retrieve property names defined on obj
    const propNames = Object.getOwnPropertyNames(obj);
    
    // Freeze properties before freezing self
    for (let name of propNames) {
        const value = obj[name];
        
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    }
    
    return Object.freeze(obj);
}

// Solution 2: Deep freeze with symbol support
function deepFreeze2(obj) {
    const props = [
        ...Object.getOwnPropertyNames(obj),
        ...Object.getOwnPropertySymbols(obj)
    ];
    
    for (let prop of props) {
        const value = obj[prop];
        
        if (value && typeof value === 'object') {
            deepFreeze2(value);
        }
    }
    
    return Object.freeze(obj);
}

// Solution 3: Deep seal (can modify properties but not add/delete)
function deepSeal(obj) {
    const propNames = Object.getOwnPropertyNames(obj);
    
    for (let name of propNames) {
        const value = obj[name];
        
        if (value && typeof value === 'object') {
            deepSeal(value);
        }
    }
    
    return Object.seal(obj);
}

// Solution 4: Deep prevent extensions
function deepPreventExtensions(obj) {
    const propNames = Object.getOwnPropertyNames(obj);
    
    for (let name of propNames) {
        const value = obj[name];
        
        if (value && typeof value === 'object') {
            deepPreventExtensions(value);
        }
    }
    
    return Object.preventExtensions(obj);
}
```

## **PROMISES & ASYNC**

### **31. Implement Promise.allSettled()**
```javascript
// Solution 1: Basic implementation
Promise.allSettled = function(promises) {
    return Promise.all(
        promises.map(promise => 
            Promise.resolve(promise)
                .then(
                    value => ({ status: 'fulfilled', value }),
                    reason => ({ status: 'rejected', reason })
                )
        )
    );
};

// Solution 2: Manual implementation
Promise.allSettled2 = function(promises) {
    return new Promise(resolve => {
        const results = new Array(promises.length);
        let completed = 0;
        
        if (promises.length === 0) {
            resolve(results);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(
                    value => {
                        results[index] = { status: 'fulfilled', value };
                    },
                    reason => {
                        results[index] = { status: 'rejected', reason };
                    }
                )
                .finally(() => {
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                });
        });
    });
};

// Solution 3: With early termination option
Promise.allSettled3 = function(promises, options = {}) {
    const { timeout } = options;
    
    return new Promise(resolve => {
        const results = new Array(promises.length).fill(undefined);
        let completed = 0;
        
        const checkComplete = () => {
            if (completed === promises.length) {
                resolve(results);
            }
        };
        
        let timeoutId;
        if (timeout) {
            timeoutId = setTimeout(() => {
                resolve(results);
            }, timeout);
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(
                    value => {
                        results[index] = { status: 'fulfilled', value };
                    },
                    reason => {
                        results[index] = { status: 'rejected', reason };
                    }
                )
                .finally(() => {
                    completed++;
                    
                    if (timeoutId && completed === promises.length) {
                        clearTimeout(timeoutId);
                    }
                    
                    checkComplete();
                });
        });
        
        if (promises.length === 0) {
            if (timeoutId) clearTimeout(timeoutId);
            resolve(results);
        }
    });
};
```

### **32. Implement Promise.any()**
```javascript
// Solution 1: Basic implementation
Promise.any = function(promises) {
    return new Promise((resolve, reject) => {
        const errors = [];
        let rejected = 0;
        
        if (promises.length === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(resolve)
                .catch(error => {
                    errors[index] = error;
                    rejected++;
                    
                    if (rejected === promises.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                });
        });
    });
};

// Solution 2: With early fulfillment
Promise.any2 = function(promises) {
    return new Promise((resolve, reject) => {
        const errors = new Array(promises.length);
        let pending = promises.length;
        
        if (pending === 0) {
            reject(new AggregateError([], 'No promises in iterable'));
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    resolve(value);
                })
                .catch(reason => {
                    errors[index] = reason;
                    pending--;
                    
                    if (pending === 0) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                });
        });
    });
};
```

### **33. Implement Promise.finally()**
```javascript
// Solution 1: Adding to Promise prototype
Promise.prototype.finally = function(onFinally) {
    return this.then(
        value => Promise.resolve(onFinally()).then(() => value),
        reason => Promise.resolve(onFinally()).then(() => { throw reason; })
    );
};

// Solution 2: With cleanup guarantee
Promise.prototype.finally2 = function(onFinally) {
    return this.then(
        value => {
            const promise = Promise.resolve(onFinally());
            return promise.then(() => value);
        },
        reason => {
            const promise = Promise.resolve(onFinally());
            return promise.then(() => Promise.reject(reason));
        }
    );
};
```

### **34. Implement async waterfall**
```javascript
// Solution 1: Using reduce
function asyncWaterfall(tasks, initialValue) {
    return tasks.reduce(
        (promiseChain, currentTask) => 
            promiseChain.then(chainResult => 
                currentTask(chainResult)
            ),
        Promise.resolve(initialValue)
    );
}

// Solution 2: Using async/await
async function asyncWaterfall2(tasks, initialValue) {
    let result = initialValue;
    
    for (const task of tasks) {
        result = await task(result);
    }
    
    return result;
}

// Solution 3: With error handling
function asyncWaterfallWithErrors(tasks, initialValue) {
    return new Promise((resolve, reject) => {
        let index = 0;
        let currentValue = initialValue;
        
        function next() {
            if (index >= tasks.length) {
                resolve(currentValue);
                return;
            }
            
            const task = tasks[index++];
            
            Promise.resolve(task(currentValue))
                .then(value => {
                    currentValue = value;
                    next();
                })
                .catch(reject);
        }
        
        next();
    });
}

// Usage:
asyncWaterfall([
    x => Promise.resolve(x + 1),
    x => Promise.resolve(x * 2),
    x => Promise.resolve(x - 3)
], 5).then(console.log); // ((5 + 1) * 2) - 3 = 9
```

### **35. Implement async parallel with concurrency limit**
```javascript
// Solution 1: Using async/await
async function parallelLimit(tasks, limit) {
    const results = new Array(tasks.length);
    const executing = [];
    let index = 0;
    
    for (let i = 0; i < Math.min(limit, tasks.length); i++) {
        executing.push(executeNext());
    }
    
    await Promise.all(executing);
    return results;
    
    async function executeNext() {
        while (index < tasks.length) {
            const currentIndex = index++;
            try {
                results[currentIndex] = await tasks[currentIndex]();
            } catch (error) {
                results[currentIndex] = error;
            }
        }
    }
}

// Solution 2: Using Promise.race
async function parallelLimit2(tasks, limit) {
    const results = [];
    const running = new Set();
    
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        
        if (running.size >= limit) {
            await Promise.race(running);
        }
        
        const promise = Promise.resolve(task()).then(
            result => {
                results[i] = result;
                running.delete(promise);
            },
            error => {
                results[i] = error;
                running.delete(promise);
            }
        );
        
        running.add(promise);
    }
    
    await Promise.all(Array.from(running));
    return results;
}

// Solution 3: With task retry option
async function parallelLimitWithRetry(tasks, limit, options = {}) {
    const { retries = 0, retryDelay = 1000 } = options;
    const results = new Array(tasks.length);
    const executing = [];
    let index = 0;
    
    async function executeTask(task, taskIndex, attempt = 0) {
        try {
            results[taskIndex] = await task();
        } catch (error) {
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return executeTask(task, taskIndex, attempt + 1);
            }
            results[taskIndex] = error;
        }
    }
    
    async function executeNext() {
        while (index < tasks.length) {
            const taskIndex = index++;
            await executeTask(tasks[taskIndex], taskIndex);
        }
    }
    
    for (let i = 0; i < Math.min(limit, tasks.length); i++) {
        executing.push(executeNext());
    }
    
    await Promise.all(executing);
    return results;
}
```

### **36. Implement async queue**
```javascript
class AsyncQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                task,
                resolve,
                reject
            });
            this.run();
        });
    }
    
    run() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { task, resolve, reject } = this.queue.shift();
            this.running++;
            
            Promise.resolve(task())
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.run();
                });
        }
    }
    
    clear() {
        this.queue = [];
    }
    
    get size() {
        return this.queue.length;
    }
    
    get pending() {
        return this.running;
    }
}

// Solution 2: Async queue with priority
class PriorityAsyncQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    add(task, priority = 0) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, priority, resolve, reject });
            this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
            this.run();
        });
    }
    
    run() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { task, resolve, reject } = this.queue.shift();
            this.running++;
            
            Promise.resolve(task())
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.run();
                });
        }
    }
}
```

### **37. Implement async semaphore**
```javascript
class AsyncSemaphore {
    constructor(maxConcurrency) {
        this.maxConcurrency = maxConcurrency;
        this.currentConcurrency = 0;
        this.waiting = [];
    }
    
    async acquire() {
        if (this.currentConcurrency < this.maxConcurrency) {
            this.currentConcurrency++;
            return () => this.release();
        }
        
        return new Promise(resolve => {
            this.waiting.push(() => {
                this.currentConcurrency++;
                resolve(() => this.release());
            });
        });
    }
    
    release() {
        this.currentConcurrency--;
        
        if (this.waiting.length > 0 && this.currentConcurrency < this.maxConcurrency) {
            const next = this.waiting.shift();
            next();
        }
    }
    
    async run(fn) {
        const release = await this.acquire();
        
        try {
            return await fn();
        } finally {
            release();
        }
    }
}

// Solution 2: Semaphore with timeout
class AsyncSemaphoreWithTimeout extends AsyncSemaphore {
    constructor(maxConcurrency, timeout = 0) {
        super(maxConcurrency);
        this.timeout = timeout;
    }
    
    async acquire() {
        if (this.currentConcurrency < this.maxConcurrency) {
            this.currentConcurrency++;
            return () => this.release();
        }
        
        if (this.timeout > 0) {
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    const index = this.waiting.findIndex(cb => cb === callback);
                    if (index > -1) {
                        this.waiting.splice(index, 1);
                    }
                    reject(new Error('Semaphore timeout'));
                }, this.timeout);
                
                const callback = () => {
                    clearTimeout(timeoutId);
                    this.currentConcurrency++;
                    resolve(() => this.release());
                };
                
                this.waiting.push(callback);
            });
        }
        
        return super.acquire();
    }
}
```

### **38. Implement async mutex (lock)**
```javascript
class AsyncMutex {
    constructor() {
        this.locked = false;
        this.waiting = [];
    }
    
    async acquire() {
        if (!this.locked) {
            this.locked = true;
            return () => this.release();
        }
        
        return new Promise(resolve => {
            this.waiting.push(() => {
                this.locked = true;
                resolve(() => this.release());
            });
        });
    }
    
    release() {
        if (this.waiting.length > 0) {
            const next = this.waiting.shift();
            next();
        } else {
            this.locked = false;
        }
    }
    
    async run(fn) {
        const release = await this.acquire();
        
        try {
            return await fn();
        } finally {
            release();
        }
    }
}

// Solution 2: Read-write lock
class AsyncReadWriteLock {
    constructor() {
        this.readers = 0;
        this.writer = false;
        this.readQueue = [];
        this.writeQueue = [];
    }
    
    async acquireRead() {
        if (!this.writer && this.writeQueue.length === 0) {
            this.readers++;
            return () => this.releaseRead();
        }
        
        return new Promise(resolve => {
            this.readQueue.push(() => {
                this.readers++;
                resolve(() => this.releaseRead());
            });
        });
    }
    
    async acquireWrite() {
        if (!this.writer && this.readers === 0) {
            this.writer = true;
            return () => this.releaseWrite();
        }
        
        return new Promise(resolve => {
            this.writeQueue.push(() => {
                this.writer = true;
                resolve(() => this.releaseWrite());
            });
        });
    }
    
    releaseRead() {
        this.readers--;
        this.processQueues();
    }
    
    releaseWrite() {
        this.writer = false;
        this.processQueues();
    }
    
    processQueues() {
        if (!this.writer && this.writeQueue.length > 0 && this.readers === 0) {
            const nextWrite = this.writeQueue.shift();
            nextWrite();
        } else if (!this.writer && this.readQueue.length > 0) {
            while (this.readQueue.length > 0) {
                const nextRead = this.readQueue.shift();
                nextRead();
            }
        }
    }
}
```

### **39. Implement async retry with exponential backoff**
```javascript
// Solution 1: Basic exponential backoff
async function retryWithExponentialBackoff(fn, options = {}) {
    const {
        retries = 3,
        initialDelay = 1000,
        maxDelay = 30000,
        factor = 2,
        jitter = true
    } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === retries) throw error;
            
            let delay = initialDelay * Math.pow(factor, attempt - 1);
            
            if (jitter) {
                delay = delay * (0.5 + Math.random());
            }
            
            delay = Math.min(delay, maxDelay);
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Solution 2: Retry with specific error types
async function retryWithCondition(fn, options = {}) {
    const {
        retries = 3,
        initialDelay = 1000,
        shouldRetry = (error) => true,
        onRetry = (error, attempt) => {}
    } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === retries || !shouldRetry(error)) {
                throw error;
            }
            
            onRetry(error, attempt);
            
            const delay = initialDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Solution 3: Retry with circuit breaker pattern
function createCircuitBreaker(fn, options = {}) {
    const {
        failureThreshold = 5,
        resetTimeout = 60000,
        timeout = 10000
    } = options;
    
    let state = 'CLOSED';
    let failureCount = 0;
    let nextAttempt = Date.now();
    
    return async function(...args) {
        if (state === 'OPEN') {
            if (Date.now() > nextAttempt) {
                state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        
        try {
            const promise = fn(...args);
            
            // Add timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout')), timeout);
            });
            
            const result = await Promise.race([promise, timeoutPromise]);
            
            if (state === 'HALF_OPEN') {
                state = 'CLOSED';
                failureCount = 0;
            }
            
            return result;
        } catch (error) {
            failureCount++;
            
            if (failureCount >= failureThreshold) {
                state = 'OPEN';
                nextAttempt = Date.now() + resetTimeout;
            }
            
            throw error;
        }
    };
}
```

### **40. Implement async rate limiter**
```javascript
class RateLimiter {
    constructor(limit, interval) {
        this.limit = limit;
        this.interval = interval;
        this.requests = [];
    }
    
    async acquire() {
        const now = Date.now();
        
        // Remove requests older than interval
        this.requests = this.requests.filter(time => 
            now - time < this.interval
        );
        
        if (this.requests.length < this.limit) {
            this.requests.push(now);
            return Promise.resolve();
        }
        
        const oldestRequest = this.requests[0];
        const waitTime = this.interval - (now - oldestRequest);
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.requests.shift();
                this.requests.push(Date.now());
                resolve();
            }, waitTime);
        });
    }
    
    async run(fn) {
        await this.acquire();
        return fn();
    }
}

// Solution 2: Token bucket rate limiter
class TokenBucketRateLimiter {
    constructor(tokensPerSecond, maxTokens) {
        this.tokensPerSecond = tokensPerSecond;
        this.maxTokens = maxTokens;
        this.tokens = maxTokens;
        this.lastRefill = Date.now();
    }
    
    refill() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000;
        const newTokens = timePassed * this.tokensPerSecond;
        
        this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
        this.lastRefill = now;
    }
    
    async acquire(tokens = 1) {
        this.refill();
        
        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return Promise.resolve();
        }
        
        const deficit = tokens - this.tokens;
        const waitTime = (deficit / this.tokensPerSecond) * 1000;
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.tokens = 0;
                this.lastRefill = Date.now();
                resolve();
            }, waitTime);
        });
    }
}

// Solution 3: Sliding window rate limiter
class SlidingWindowRateLimiter {
    constructor(limit, windowSize) {
        this.limit = limit;
        this.windowSize = windowSize;
        this.requests = [];
    }
    
    async acquire() {
        const now = Date.now();
        const windowStart = now - this.windowSize;
        
        // Remove requests outside window
        this.requests = this.requests.filter(time => time > windowStart);
        
        if (this.requests.length < this.limit) {
            this.requests.push(now);
            return Promise.resolve();
        }
        
        const oldestInWindow = this.requests[0];
        const waitTime = windowStart + this.windowSize - now;
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.requests.shift();
                this.requests.push(Date.now());
                resolve();
            }, waitTime);
        });
    }
}
```

## **DATA STRUCTURES & ALGORITHMS**

### **41. Implement Circular Buffer/Ring Buffer**
```javascript
class CircularBuffer {
    constructor(capacity) {
        this.capacity = capacity;
        this.buffer = new Array(capacity);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
    
    enqueue(item) {
        if (this.isFull()) {
            throw new Error('Buffer is full');
        }
        
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.size++;
        
        return this;
    }
    
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Buffer is empty');
        }
        
        const item = this.buffer[this.head];
        this.buffer[this.head] = undefined;
        this.head = (this.head + 1) % this.capacity;
        this.size--;
        
        return item;
    }
    
    peek() {
        if (this.isEmpty()) {
            throw new Error('Buffer is empty');
        }
        
        return this.buffer[this.head];
    }
    
    isFull() {
        return this.size === this.capacity;
    }
    
    isEmpty() {
        return this.size === 0;
    }
    
    clear() {
        this.buffer = new Array(this.capacity);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
    
    toArray() {
        const result = [];
        let current = this.head;
        
        for (let i = 0; i < this.size; i++) {
            result.push(this.buffer[current]);
            current = (current + 1) % this.capacity;
        }
        
        return result;
    }
    
    [Symbol.iterator]() {
        let index = 0;
        let current = this.head;
        
        return {
            next: () => {
                if (index < this.size) {
                    const value = this.buffer[current];
                    current = (current + 1) % this.capacity;
                    index++;
                    return { value, done: false };
                }
                return { done: true };
            }
        };
    }
}

// Solution 2: Circular Buffer with overwrite
class CircularBufferWithOverwrite extends CircularBuffer {
    constructor(capacity) {
        super(capacity);
    }
    
    enqueue(item) {
        if (this.isFull()) {
            this.dequeue(); // Remove oldest to make space
        }
        
        return super.enqueue(item);
    }
    
    forceEnqueue(item) {
        if (this.isFull()) {
            this.head = (this.head + 1) % this.capacity;
            this.size--;
        }
        
        return this.enqueue(item);
    }
}
```

### **42. Implement Bloom Filter**
```javascript
class BloomFilter {
    constructor(size = 1000, hashFunctions = 3) {
        this.size = size;
        this.hashFunctions = hashFunctions;
        this.bitArray = new Array(size).fill(false);
    }
    
    // Simple hash functions
    _hash1(item) {
        let hash = 0;
        for (let i = 0; i < item.length; i++) {
            hash = (hash << 5) - hash + item.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash) % this.size;
    }
    
    _hash2(item) {
        let hash = 5381;
        for (let i = 0; i < item.length; i++) {
            hash = (hash << 5) + hash + item.charCodeAt(i);
        }
        return Math.abs(hash) % this.size;
    }
    
    _hash3(item) {
        let hash = 0;
        for (let i = 0; i < item.length; i++) {
            hash = (hash << 7) - hash + item.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash) % this.size;
    }
    
    add(item) {
        const str = typeof item === 'string' ? item : JSON.stringify(item);
        
        this.bitArray[this._hash1(str)] = true;
        this.bitArray[this._hash2(str)] = true;
        this.bitArray[this._hash3(str)] = true;
        
        if (this.hashFunctions > 3) {
            for (let i = 3; i < this.hashFunctions; i++) {
                const hash = this._hash1(str + i);
                this.bitArray[hash] = true;
            }
        }
    }
    
    mightContain(item) {
        const str = typeof item === 'string' ? item : JSON.stringify(item);
        
        if (!this.bitArray[this._hash1(str)]) return false;
        if (!this.bitArray[this._hash2(str)]) return false;
        if (!this.bitArray[this._hash3(str)]) return false;
        
        for (let i = 3; i < this.hashFunctions; i++) {
            const hash = this._hash1(str + i);
            if (!this.bitArray[hash]) return false;
        }
        
        return true;
    }
    
    clear() {
        this.bitArray.fill(false);
    }
    
    get falsePositiveRate(itemsAdded) {
        const k = this.hashFunctions;
        const m = this.size;
        const n = itemsAdded;
        
        return Math.pow(1 - Math.exp(-k * n / m), k);
    }
}
```

### **43. Implement Disjoint Set (Union-Find)**
```javascript
class DisjointSet {
    constructor(size) {
        this.parent = new Array(size);
        this.rank = new Array(size);
        
        for (let i = 0; i < size; i++) {
            this.parent[i] = i;
            this.rank[i] = 1;
        }
    }
    
    find(x) {
        // Path compression
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        // Union by rank
        if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        return true;
    }
    
    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getSets() {
        const sets = new Map();
        
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            if (!sets.has(root)) {
                sets.set(root, []);
            }
            sets.get(root).push(i);
        }
        
        return Array.from(sets.values());
    }
    
    countSets() {
        const roots = new Set();
        
        for (let i = 0; i < this.parent.length; i++) {
            roots.add(this.find(i));
        }
        
        return roots.size;
    }
}

// Solution 2: Weighted Quick Union
class WeightedQuickUnion extends DisjointSet {
    constructor(size) {
        super(size);
        this.size = new Array(size).fill(1);
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        // Weighted union (by size)
        if (this.size[rootX] < this.size[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        } else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        }
        
        return true;
    }
}
```

### **44. Implement Graph (Adjacency List)**
```javascript
class Graph {
    constructor(directed = false) {
        this.directed = directed;
        this.adjacencyList = new Map();
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
        return this;
    }
    
    addEdge(vertex1, vertex2, weight = 1) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        
        this.adjacencyList.get(vertex1).push({ node: vertex2, weight });
        
        if (!this.directed) {
            this.adjacencyList.get(vertex2).push({ node: vertex1, weight });
        }
        
        return this;
    }
    
    removeVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) return this;
        
        // Remove edges pointing to this vertex
        for (let [v, edges] of this.adjacencyList) {
            this.adjacencyList.set(
                v,
                edges.filter(edge => edge.node !== vertex)
            );
        }
        
        this.adjacencyList.delete(vertex);
        return this;
    }
    
    removeEdge(vertex1, vertex2) {
        if (!this.adjacencyList.has(vertex1) || !this.adjacencyList.has(vertex2)) {
            return this;
        }
        
        this.adjacencyList.set(
            vertex1,
            this.adjacencyList.get(vertex1).filter(edge => edge.node !== vertex2)
        );
        
        if (!this.directed) {
            this.adjacencyList.set(
                vertex2,
                this.adjacencyList.get(vertex2).filter(edge => edge.node !== vertex1)
            );
        }
        
        return this;
    }
    
    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
    
    hasVertex(vertex) {
        return this.adjacencyList.has(vertex);
    }
    
    hasEdge(vertex1, vertex2) {
        if (!this.hasVertex(vertex1)) return false;
        
        return this.adjacencyList.get(vertex1)
            .some(edge => edge.node === vertex2);
    }
    
    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }
    
    getEdges() {
        const edges = [];
        
        for (let [vertex, neighbors] of this.adjacencyList) {
            for (let neighbor of neighbors) {
                if (this.directed || vertex <= neighbor.node) {
                    edges.push({
                        from: vertex,
                        to: neighbor.node,
                        weight: neighbor.weight
                    });
                }
            }
        }
        
        return edges;
    }
    
    // Depth First Search
    dfs(start, visited = new Set()) {
        visited.add(start);
        const result = [start];
        
        for (let neighbor of this.getNeighbors(start)) {
            if (!visited.has(neighbor.node)) {
                result.push(...this.dfs(neighbor.node, visited));
            }
        }
        
        return result;
    }
    
    // Breadth First Search
    bfs(start) {
        const visited = new Set([start]);
        const queue = [start];
        const result = [];
        
        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);
            
            for (let neighbor of this.getNeighbors(vertex)) {
                if (!visited.has(neighbor.node)) {
                    visited.add(neighbor.node);
                    queue.push(neighbor.node);
                }
            }
        }
        
        return result;
    }
    
    // Dijkstra's shortest path
    dijkstra(start, end) {
        const distances = new Map();
        const previous = new Map();
        const pq = new MinHeap();
        const visited = new Set();
        
        // Initialize distances
        for (let vertex of this.getVertices()) {
            distances.set(vertex, Infinity);
            previous.set(vertex, null);
        }
        distances.set(start, 0);
        
        pq.insert({ vertex: start, distance: 0 });
        
        while (!pq.isEmpty()) {
            const { vertex } = pq.extractMin();
            
            if (visited.has(vertex)) continue;
            visited.add(vertex);
            
            if (vertex === end) break;
            
            for (let neighbor of this.getNeighbors(vertex)) {
                const newDist = distances.get(vertex) + neighbor.weight;
                
                if (newDist < distances.get(neighbor.node)) {
                    distances.set(neighbor.node, newDist);
                    previous.set(neighbor.node, vertex);
                    pq.insert({ vertex: neighbor.node, distance: newDist });
                }
            }
        }
        
        // Reconstruct path
        const path = [];
        let current = end;
        
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
        
        return {
            path: path[0] === start ? path : [],
            distance: distances.get(end)
        };
    }
}
```

### **45. Implement Interval Tree**
```javascript
class Interval {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    
    overlaps(other) {
        return this.start <= other.end && other.start <= this.end;
    }
    
    contains(point) {
        return this.start <= point && point <= this.end;
    }
    
    length() {
        return this.end - this.start;
    }
}

class IntervalTreeNode {
    constructor(interval) {
        this.interval = interval;
        this.maxEnd = interval.end;
        this.left = null;
        this.right = null;
    }
}

class IntervalTree {
    constructor() {
        this.root = null;
    }
    
    insert(interval) {
        this.root = this._insert(this.root, interval);
    }
    
    _insert(node, interval) {
        if (!node) return new IntervalTreeNode(interval);
        
        if (interval.start < node.interval.start) {
            node.left = this._insert(node.left, interval);
        } else {
            node.right = this._insert(node.right, interval);
        }
        
        // Update maxEnd
        node.maxEnd = Math.max(
            node.interval.end,
            node.left ? node.left.maxEnd : -Infinity,
            node.right ? node.right.maxEnd : -Infinity
        );
        
        return node;
    }
    
    searchOverlapping(interval) {
        const result = [];
        this._searchOverlapping(this.root, interval, result);
        return result;
    }
    
    _searchOverlapping(node, interval, result) {
        if (!node) return;
        
        // If node's maxEnd is less than interval's start, no overlap in this subtree
        if (node.maxEnd < interval.start) return;
        
        // Check left subtree
        if (node.left && node.left.maxEnd >= interval.start) {
            this._searchOverlapping(node.left, interval, result);
        }
        
        // Check current node
        if (node.interval.overlaps(interval)) {
            result.push(node.interval);
        }
        
        // If interval's start is less than node's interval start, check right subtree
        if (interval.start <= node.interval.start || 
            (node.right && node.right.maxEnd >= interval.start)) {
            this._searchOverlapping(node.right, interval, result);
        }
    }
    
    searchPoint(point) {
        const result = [];
        this._searchPoint(this.root, point, result);
        return result;
    }
    
    _searchPoint(node, point, result) {
        if (!node) return;
        
        if (point > node.maxEnd) return;
        
        // Check left subtree
        if (node.left && node.left.maxEnd >= point) {
            this._searchPoint(node.left, point, result);
        }
        
        // Check current node
        if (node.interval.contains(point)) {
            result.push(node.interval);
        }
        
        // Check right subtree if point is within possible range
        if (point <= node.interval.start || 
            (node.right && node.right.maxEnd >= point)) {
            this._searchPoint(node.right, point, result);
        }
    }
    
    remove(interval) {
        this.root = this._remove(this.root, interval);
    }
    
    _remove(node, interval) {
        if (!node) return null;
        
        if (interval.start === node.interval.start && 
            interval.end === node.interval.end) {
            
            // Node with only one child or no child
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            
            // Node with two children
            const minNode = this._findMin(node.right);
            node.interval = minNode.interval;
            node.right = this._remove(node.right, minNode.interval);
        } else if (interval.start < node.interval.start) {
            node.left = this._remove(node.left, interval);
        } else {
            node.right = this._remove(node.right, interval);
        }
        
        // Update maxEnd
        if (node) {
            node.maxEnd = Math.max(
                node.interval.end,
                node.left ? node.left.maxEnd : -Infinity,
                node.right ? node.right.maxEnd : -Infinity
            );
        }
        
        return node;
    }
    
    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }
    
    getAllIntervals() {
        const result = [];
        this._inorder(this.root, result);
        return result;
    }
    
    _inorder(node, result) {
        if (!node) return;
        
        this._inorder(node.left, result);
        result.push(node.interval);
        this._inorder(node.right, result);
    }
}
```

### **46. Implement Skip List**
```javascript
class SkipListNode {
    constructor(value, level) {
        this.value = value;
        this.forward = new Array(level + 1).fill(null);
        this.level = level;
    }
}

class SkipList {
    constructor(maxLevel = 16, p = 0.5) {
        this.maxLevel = maxLevel;
        this.p = p;
        this.head = new SkipListNode(-Infinity, maxLevel);
        this.level = 0;
    }
    
    randomLevel() {
        let level = 0;
        while (Math.random() < this.p && level < this.maxLevel) {
            level++;
        }
        return level;
    }
    
    insert(value) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.head;
        
        // Find the position to insert
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        current = current.forward[0];
        
        // If value already exists
        if (current && current.value === value) {
            return false;
        }
        
        // Generate random level for new node
        const newLevel = this.randomLevel();
        
        // If new level is higher than current level
        if (newLevel > this.level) {
            for (let i = this.level + 1; i <= newLevel; i++) {
                update[i] = this.head;
            }
            this.level = newLevel;
        }
        
        // Create new node
        const newNode = new SkipListNode(value, newLevel);
        
        // Update forward pointers
        for (let i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }
        
        return true;
    }
    
    search(value) {
        let current = this.head;
        
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].value < value) {
                current = current.forward[i];
            }
        }
        
        current = current.forward[0];
        
        return current && current.value === value ? current : null;
    }
    
    delete(value) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.head;
        
        // Find the node to delete
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        current = current.forward[0];
        
        // If node not found
        if (!current || current.value !== value) {
            return false;
        }
        
        // Update forward pointers
        for (let i = 0; i <= this.level; i++) {
            if (update[i].forward[i] !== current) {
                break;
            }
            update[i].forward[i] = current.forward[i];
        }
        
        // Decrease level if needed
        while (this.level > 0 && this.head.forward[this.level] === null) {
            this.level--;
        }
        
        return true;
    }
    
    toArray() {
        const result = [];
        let current = this.head.forward[0];
        
        while (current) {
            result.push(current.value);
            current = current.forward[0];
        }
        
        return result;
    }
    
    print() {
        for (let i = this.level; i >= 0; i--) {
            let current = this.head.forward[i];
            const levelValues = [];
            
            while (current) {
                levelValues.push(current.value);
                current = current.forward[i];
            }
            
            console.log(`Level ${i}: ${levelValues.join(' -> ')}`);
        }
    }
}
```

### **47. Implement Fenwick Tree (Binary Indexed Tree)**
```javascript
class FenwickTree {
    constructor(size) {
        this.size = size;
        this.tree = new Array(size + 1).fill(0);
    }
    
    update(index, delta) {
        index++;
        
        while (index <= this.size) {
            this.tree[index] += delta;
            index += index & -index; // Add lowest set bit
        }
    }
    
    query(index) {
        index++;
        let sum = 0;
        
        while (index > 0) {
            sum += this.tree[index];
            index -= index & -index; // Remove lowest set bit
        }
        
        return sum;
    }
    
    rangeQuery(left, right) {
        if (left > right) return 0;
        if (left === 0) return this.query(right);
        return this.query(right) - this.query(left - 1);
    }
    
    findKthSmallest(k) {
        let pos = 0;
        let bitMask = 1 << (Math.log2(this.size) | 0);
        
        while (bitMask !== 0) {
            const nextPos = pos + bitMask;
            
            if (nextPos <= this.size && this.tree[nextPos] < k) {
                k -= this.tree[nextPos];
                pos = nextPos;
            }
            
            bitMask >>= 1;
        }
        
        return pos; // 0-based index
    }
    
    // Build from array
    static fromArray(arr) {
        const tree = new FenwickTree(arr.length);
        
        for (let i = 0; i < arr.length; i++) {
            tree.update(i, arr[i]);
        }
        
        return tree;
    }
    
    toArray() {
        const result = new Array(this.size);
        
        for (let i = 0; i < this.size; i++) {
            result[i] = this.rangeQuery(i, i);
        }
        
        return result;
    }
}

// Solution 2: 2D Fenwick Tree
class FenwickTree2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.tree = Array.from({ length: rows + 1 }, () => 
            new Array(cols + 1).fill(0)
        );
    }
    
    update(row, col, delta) {
        row++;
        col++;
        
        for (let i = row; i <= this.rows; i += i & -i) {
            for (let j = col; j <= this.cols; j += j & -j) {
                this.tree[i][j] += delta;
            }
        }
    }
    
    query(row, col) {
        row++;
        col++;
        let sum = 0;
        
        for (let i = row; i > 0; i -= i & -i) {
            for (let j = col; j > 0; j -= j & -j) {
                sum += this.tree[i][j];
            }
        }
        
        return sum;
    }
    
    rangeQuery(row1, col1, row2, col2) {
        return this.query(row2, col2) 
             - this.query(row1 - 1, col2)
             - this.query(row2, col1 - 1)
             + this.query(row1 - 1, col1 - 1);
    }
}
```

### **48. Implement Segment Tree**
```javascript
class SegmentTree {
    constructor(arr, operation = (a, b) => a + b, fallback = 0) {
        this.arr = arr;
        this.operation = operation;
        this.fallback = fallback;
        this.size = arr.length;
        this.tree = new Array(4 * this.size).fill(fallback);
        
        this.build(0, 0, this.size - 1);
    }
    
    build(node, start, end) {
        if (start === end) {
            this.tree[node] = this.arr[start];
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        this.build(leftChild, start, mid);
        this.build(rightChild, mid + 1, end);
        
        this.tree[node] = this.operation(
            this.tree[leftChild],
            this.tree[rightChild]
        );
    }
    
    update(index, value) {
        this._update(0, 0, this.size - 1, index, value);
    }
    
    _update(node, start, end, index, value) {
        if (start === end) {
            this.arr[index] = value;
            this.tree[node] = value;
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        if (index >= start && index <= mid) {
            this._update(leftChild, start, mid, index, value);
        } else {
            this._update(rightChild, mid + 1, end, index, value);
        }
        
        this.tree[node] = this.operation(
            this.tree[leftChild],
            this.tree[rightChild]
        );
    }
    
    query(left, right) {
        return this._query(0, 0, this.size - 1, left, right);
    }
    
    _query(node, start, end, left, right) {
        // No overlap
        if (right < start || left > end) {
            return this.fallback;
        }
        
        // Complete overlap
        if (left <= start && end <= right) {
            return this.tree[node];
        }
        
        // Partial overlap
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        const leftResult = this._query(leftChild, start, mid, left, right);
        const rightResult = this._query(rightChild, mid + 1, end, left, right);
        
        return this.operation(leftResult, rightResult);
    }
    
    // Range update with lazy propagation
    rangeUpdate(left, right, value) {
        this._rangeUpdate(0, 0, this.size - 1, left, right, value);
    }
    
    _rangeUpdate(node, start, end, left, right, value) {
        // TODO: Implement lazy propagation
        // This is a simplified version that updates all nodes
        if (start === end) {
            this.arr[start] = value;
            this.tree[node] = value;
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        if (right <= mid) {
            this._rangeUpdate(leftChild, start, mid, left, right, value);
        } else if (left > mid) {
            this._rangeUpdate(rightChild, mid + 1, end, left, right, value);
        } else {
            this._rangeUpdate(leftChild, start, mid, left, mid, value);
            this._rangeUpdate(rightChild, mid + 1, end, mid + 1, right, value);
        }
        
        this.tree[node] = this.operation(
            this.tree[leftChild],
            this.tree[rightChild]
        );
    }
}

// Different segment tree operations
class MaxSegmentTree extends SegmentTree {
    constructor(arr) {
        super(arr, Math.max, -Infinity);
    }
}

class MinSegmentTree extends SegmentTree {
    constructor(arr) {
        super(arr, Math.min, Infinity);
    }
}

class SumSegmentTree extends SegmentTree {
    constructor(arr) {
        super(arr, (a, b) => a + b, 0);
    }
}
```

### **49. Implement Trie with wildcard search**
```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class TrieWithWildcard {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let current = this.root;
        
        for (let char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        
        current.isEndOfWord = true;
    }
    
    search(word) {
        return this._search(this.root, word, 0);
    }
    
    _search(node, word, index) {
        if (index === word.length) {
            return node.isEndOfWord;
        }
        
        const char = word[index];
        
        if (char === '.') {
            // Wildcard: try all possible characters
            for (let child of node.children.values()) {
                if (this._search(child, word, index + 1)) {
                    return true;
                }
            }
            return false;
        }
        
        if (!node.children.has(char)) {
            return false;
        }
        
        return this._search(node.children.get(char), word, index + 1);
    }
    
    // Find all words matching pattern
    findWords(pattern) {
        const result = [];
        this._findWords(this.root, pattern, 0, '', result);
        return result;
    }
    
    _findWords(node, pattern, index, current, result) {
        if (index === pattern.length) {
            if (node.isEndOfWord) {
                result.push(current);
            }
            return;
        }
        
        const char = pattern[index];
        
        if (char === '.') {
            // Wildcard: try all possible characters
            for (let [childChar, childNode] of node.children) {
                this._findWords(childNode, pattern, index + 1, current + childChar, result);
            }
        } else {
            if (node.children.has(char)) {
                this._findWords(
                    node.children.get(char),
                    pattern,
                    index + 1,
                    current + char,
                    result
                );
            }
        }
    }
    
    // Auto-complete with prefix
    autoComplete(prefix) {
        let current = this.root;
        
        // Navigate to prefix node
        for (let char of prefix) {
            if (!current.children.has(char)) {
                return [];
            }
            current = current.children.get(char);
        }
        
        // Collect all words from this node
        const result = [];
        this._collectWords(current, prefix, result);
        return result;
    }
    
    _collectWords(node, prefix, result) {
        if (node.isEndOfWord) {
            result.push(prefix);
        }
        
        for (let [char, childNode] of node.children) {
            this._collectWords(childNode, prefix + char, result);
        }
    }
}
```

### **50. Implement LRU Cache with O(1) operations**
```javascript
class LRUCacheNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new LRUCacheNode(null, null);
        this.tail = new LRUCacheNode(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.size = 0;
    }
    
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        
        const node = this.cache.get(key);
        this._moveToHead(node);
        return node.value;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.value = value;
            this._moveToHead(node);
        } else {
            const newNode = new LRUCacheNode(key, value);
            this.cache.set(key, newNode);
            this._addToHead(newNode);
            this.size++;
            
            if (this.size > this.capacity) {
                const removed = this._removeTail();
                this.cache.delete(removed.key);
                this.size--;
            }
        }
    }
    
    _addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }
    
    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    _moveToHead(node) {
        this._removeNode(node);
        this._addToHead(node);
    }
    
    _removeTail() {
        const node = this.tail.prev;
        this._removeNode(node);
        return node;
    }
    
    clear() {
        this.cache.clear();
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.size = 0;
    }
    
    keys() {
        return Array.from(this.cache.keys());
    }
    
    values() {
        return Array.from(this.cache.values()).map(node => node.value);
    }
    
    entries() {
        const result = [];
        let current = this.head.next;
        
        while (current !== this.tail) {
            result.push([current.key, current.value]);
            current = current.next;
        }
        
        return result;
    }
    
    // Get cache statistics
    stats() {
        const keys = this.keys();
        const hits = keys.length;
        const capacity = this.capacity;
        const usage = (hits / capacity) * 100;
        
        return {
            size: this.size,
            capacity,
            usage: `${usage.toFixed(2)}%`,
            keys
        };
    }
}

// Solution 2: LFU Cache (Least Frequently Used)
class LFUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // key -> {value, frequency}
        this.frequencyMap = new Map(); // frequency -> Set of keys
        this.minFrequency = 0;
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        
        const entry = this.cache.get(key);
        const oldFreq = entry.frequency;
        
        // Update frequency
        entry.frequency++;
        
        // Remove from old frequency set
        this.frequencyMap.get(oldFreq).delete(key);
        if (this.frequencyMap.get(oldFreq).size === 0) {
            this.frequencyMap.delete(oldFreq);
            if (oldFreq === this.minFrequency) {
                this.minFrequency++;
            }
        }
        
        // Add to new frequency set
        if (!this.frequencyMap.has(entry.frequency)) {
            this.frequencyMap.set(entry.frequency, new Set());
        }
        this.frequencyMap.get(entry.frequency).add(key);
        
        return entry.value;
    }
    
    put(key, value) {
        if (this.capacity === 0) return;
        
        if (this.cache.has(key)) {
            const entry = this.cache.get(key);
            entry.value = value;
            this.get(key); // Update frequency
            return;
        }
        
        if (this.cache.size >= this.capacity) {
            // Remove least frequently used
            const keys = this.frequencyMap.get(this.minFrequency);
            const keyToRemove = keys.values().next().value;
            keys.delete(keyToRemove);
            this.cache.delete(keyToRemove);
            
            if (keys.size === 0) {
                this.frequencyMap.delete(this.minFrequency);
            }
        }
        
        // Add new entry
        this.cache.set(key, { value, frequency: 1 });
        this.minFrequency = 1;
        
        if (!this.frequencyMap.has(1)) {
            this.frequencyMap.set(1, new Set());
        }
        this.frequencyMap.get(1).add(key);
    }
}
```

## **Key Features of These Additional Questions:**

1. **Advanced Array Operations**: GroupBy, flatMap, partition, permutations, subsets
2. **String Utilities**: Polyfills for modern string methods
3. **Functional Programming**: Curry, pipe, compose, memoization patterns
4. **Async Patterns**: Advanced concurrency control, rate limiting, circuit breakers
5. **Data Structures**: Advanced trees (interval, segment, fenwick), graphs, skip lists
6. **Caching Strategies**: LRU, LFU, bloom filters
7. **Real-world Scenarios**: Rate limiting, retry logic, async queues

These questions cover advanced JavaScript concepts that frequently appear in senior-level interviews and focus on practical, real-world problem-solving scenarios.