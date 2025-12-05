Here’s a **detailed guide** with solutions for the **21 most frequently asked JavaScript programs** in L1/L2 interviews. Each solution includes **clear explanation and code**.

---

## **1. Find the longest word in a sentence**

```javascript
function longestWord(sentence) {
  const words = sentence.split(' ');
  let longest = '';
  for (const word of words) {
    if (word.length > longest.length) longest = word;
  }
  return longest;
}
console.log(longestWord("I love programming in JavaScript")); // "programming"
```

---

## **2. Check if a string is a palindrome**

```javascript
function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}
console.log(isPalindrome("level")); // true
```

---

## **3. Remove duplicates from an array**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
console.log(removeDuplicates([1,2,2,3,4,4])); // [1,2,3,4]
```

---

## **4. Reverse a string without built-in methods**

```javascript
function reverseString(str) {
  let reversed = '';
  for(let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
console.log(reverseString("hello")); // "olleh"
```

---

## **5. Max count of consecutive 1s in an array**

```javascript
function maxConsecutiveOnes(arr) {
  let max = 0, count = 0;
  for(const num of arr) {
    if(num === 1) count++;
    else count = 0;
    if(count > max) max = count;
  }
  return max;
}
console.log(maxConsecutiveOnes([1,1,0,1,1,1])); // 3
```

---

## **6. Factorial of a number**

```javascript
function factorial(n) {
  if(n === 0) return 1;
  return n * factorial(n-1);
}
console.log(factorial(5)); // 120
```

---

## **7. Merge two sorted arrays**

```javascript
function mergeSorted(arr1, arr2) {
  return [...arr1, ...arr2].sort((a,b) => a-b);
}
console.log(mergeSorted([0,3,4,31],[4,6,30])); // [0,3,4,4,6,30,31]
```

---

## **8. Check squared values in two arrays**

```javascript
function sameFrequency(arr1, arr2) {
  if(arr1.length !== arr2.length) return false;
  let count1 = {}, count2 = {};
  for(let num of arr1) count1[num] = (count1[num] || 0) + 1;
  for(let num of arr2) count2[num] = (count2[num] || 0) + 1;
  for(let key in count1) {
    if(count2[key**2] !== count1[key]) return false;
  }
  return true;
}
console.log(sameFrequency([1,2,3],[1,4,9])); // true
```

---

## **9. Check if two strings are anagrams**

```javascript
function isAnagram(str1, str2) {
  const sortStr = str => str.split('').sort().join('');
  return sortStr(str1) === sortStr(str2);
}
console.log(isAnagram("listen","silent")); // true
```

---

## **10. Get unique objects from an array**

```javascript
function uniqueObjects(arr) {
  const seen = new Set();
  return arr.filter(obj => {
    const key = JSON.stringify(obj);
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
console.log(uniqueObjects([{name:"sai"},{name:"Nang"},{name:"sai"}]));
```

---

## **11. Find maximum number in an array**

```javascript
const maxNumber = arr => Math.max(...arr);
console.log(maxNumber([1,3,5,7])); // 7
```

---

## **12. Filter even numbers from an array**

```javascript
const evens = arr => arr.filter(n => n % 2 === 0);
console.log(evens([1,2,3,4])); // [2,4]
```

---

## **13. Check if a number is prime**

```javascript
function isPrime(n) {
  if(n <= 1) return false;
  for(let i=2;i<=Math.sqrt(n);i++){
    if(n%i===0) return false;
  }
  return true;
}
console.log(isPrime(11)); // true
```

---

## **14. Find largest element in nested array**

```javascript
function largestInNested(arr) {
  const flat = arr.flat(Infinity);
  return Math.max(...flat);
}
console.log(largestInNested([[3,4,58],[709,8,9,[10,11]],[111,2]])); // 709
```

---

## **15. Fibonacci sequence up to n terms**

```javascript
function fibonacci(n) {
  const seq = [0,1];
  for(let i=2;i<n;i++){
    seq[i] = seq[i-1]+seq[i-2];
  }
  return seq.slice(0,n);
}
console.log(fibonacci(5)); // [0,1,1,2,3]
```

---

## **16. Count character occurrences in a string**

```javascript
function charCount(str) {
  const count = {};
  for(let char of str){
    count[char] = (count[char] || 0) + 1;
  }
  return count;
}
console.log(charCount("hello")); // {h:1,e:1,l:2,o:1}
```

---

## **17. Sort array ascending**

```javascript
const ascending = arr => arr.sort((a,b)=>a-b);
console.log(ascending([4,2,1])); // [1,2,4]
```

---

## **18. Sort array descending**

```javascript
const descending = arr => arr.sort((a,b)=>b-a);
console.log(descending([4,2,1])); // [4,2,1]
```

---

## **19. Reverse words in a sentence**

```javascript
function reverseWords(sentence) {
  return sentence.split(' ').reduce((acc, word) => [word,...acc],[]).join(' ');
}
console.log(reverseWords("I love JavaScript")); // "JavaScript love I"
```

---

## **20. Flatten a nested array**

```javascript
function flattenArray(arr) {
  let result = [];
  arr.forEach(el => Array.isArray(el) ? result.push(...flattenArray(el)) : result.push(el));
  return result;
}
console.log(flattenArray([1, [2, [3,4]], 5])); // [1,2,3,4,5]
```

---

## **21. Convert string path to object**

```javascript
function pathToObject(path, value) {
  const keys = path.split('.');
  return keys.reduceRight((acc, key) => ({[key]: acc}), value);
}
console.log(pathToObject("a.b.c","someValue")); // {a:{b:{c:"someValue"}}}
```

---

✅ These **21 programs** cover most common **JS interview tasks** for L1 & L2 roles.

