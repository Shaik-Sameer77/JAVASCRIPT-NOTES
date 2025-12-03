# Senior JavaScript Interview Questions & Real-World Scenarios

A comprehensive collection of **225+ questions** covering JavaScript fundamentals, advanced concepts, and practical implementation scenarios for senior-level positions.

## 📋 Table of Contents

1. [150 Conceptual JavaScript Questions](#-150-conceptual-javascript-questions)
   - [Core JavaScript](#a-core-javascript-basics--deep-concepts)
   - [ES6+ Advanced Concepts](#b-es6-advanced-concepts)
   - [Asynchronous JavaScript](#c-asynchronous-javascript-crucial-for-senior-roles)
   - [Browser JavaScript & Web APIs](#d-browser-javascript--web-apis)
   - [Node.js & Backend JS](#e-nodejs--backend-js)
   - [Architecture, Patterns & Performance](#f-architecture-patterns--performance)

2. [75 Real-World Scenario-Based Questions](#-75-real-world-scenario-based-questions)
   - [Asynchronous & Promise Scenarios](#a-asynchronous--promise-scenarios)
   - [Data Structures & Real Usage](#b-data-structures--real-usage)
   - [Architecture & Design Patterns](#c-architecture--design-patterns)
   - [Error Handling & Logging](#d-error-handling--logging)
   - [Performance Optimization](#e-performance-optimization)
   - [Security & Best Practices](#f-security--best-practices)
   - [DOM + Browser Scenarios](#g-dom--browser-scenarios)
   - [Node.js + Backend JS Scenarios](#h-nodejs--backend-js-scenarios)
   - [Testing & Debugging Scenarios](#i-testing--debugging-scenarios)

---

## 🧠 150 Conceptual JavaScript Questions

### A. Core JavaScript (Basics → Deep Concepts)

1. **What are the primitive data types in JavaScript?**
2. **Explain undefined vs null.**
3. **What is hoisting?**
4. **Explain the difference between var, let, and const.**
5. **What is the temporal dead zone (TDZ)?**
6. **Explain type coercion.**
7. **What is the difference between == and ===?**
8. **What is NaN? How to check for NaN?**
9. **What are template literals?**
10. **What is the difference between "mutable" and "immutable" data?**
11. **What are pure functions?**
12. **Explain pass-by-value vs pass-by-reference in JavaScript.**
13. **What is the event loop?**
14. **What are Microtasks vs Macrotasks?**
15. **What is a closure?**
16. **Give a practical example of closure in real applications.**
17. **What is scope? Block/Function/Global?**
18. **What is lexical scope?**
19. **What are Immediately Invoked Function Expressions (IIFE)?**
20. **What are higher-order functions?**
21. **What are callback functions?**
22. **Why are callbacks problematic? (Callback Hell)**
23. **What is "use strict"? What changes in strict mode?**
24. **What is the difference between shallow copy vs deep copy?**
25. **How does `this` behave in different contexts?**
26. **What is the global object in browsers vs Node.js?**
27. **What is prototype inheritance?**
28. **What is the difference between `__proto__` and `prototype`?**
29. **How does `new` work internally?**
30. **What is a polyfill?**
31. **What are Symbols and why do we use them?**
32. **What is a Map vs Object?**
33. **What is Set vs Array?**
34. **Explain WeakMap vs WeakSet.**
35. **Explain garbage collection in JavaScript.**
36. **Explain tail call optimization.**
37. **What are function borrowing methods: call, apply, bind?**
38. **What is currying?**
39. **What is debouncing?**
40. **What is throttling?**
41. **What is memoization?**
42. **Explain event delegation.**
43. **What is the DOM? How does it differ from the BOM?**
44. **What is the shadow DOM?**
45. **What is execution context?**
46. **What are phases of event propagation?**
47. **What are Web APIs?**
48. **Explain BigInt.**
49. **Explain optional chaining.**
50. **Explain nullish coalescing.**

### B. ES6+ Advanced Concepts

51. **What are arrow functions? How are they different?**
52. **Why don't arrow functions have their own `this`?**
53. **What is destructuring?**
54. **What are rest and spread operators?**
55. **Explain generators.**
56. **Explain iterators.**
57. **How does `for...of` work internally?**
58. **What are proxies?**
59. **What are Reflect APIs?**
60. **What is the `class` keyword in JS? How does it work behind the scenes?**
61. **Explain static methods.**
62. **What is a mixin?**
63. **What is the difference between default and named exports?**
64. **What are dynamic imports?**
65. **Explain Top-level await.**
66. **What is tree shaking?**
67. **What is the module resolution algorithm?**
68. **Explain WeakRef.**
69. **What is Promise combinators like `allSettled`, `any`, `race`?**

### C. Asynchronous JavaScript (Crucial for Senior Roles)

70. **What are Promises?**
71. **How do Promises work internally?**
72. **Explain async/await.**
73. **What happens if you forget await?**
74. **How to handle errors in async/await?**
75. **What is Promise chaining?**
76. **What is `Promise.all`?**
77. **Explain `Promise.race` vs `Promise.any`.**
78. **How to cancel a Promise?**
79. **What is an async iterator?**
80. **Explain concurrency vs parallelism in JS.**
81. **Explain the difference between synchronous and asynchronous code.**
82. **What is the task queue?**
83. **What are microtasks? What goes into microtask queue?**
84. **How does `setTimeout(fn, 0)` work?**
85. **Event loop differences in browser vs Node.js.**

### D. Browser JavaScript & Web APIs

86. **What is `localStorage` vs `sessionStorage`?**
87. **What is IndexedDB?**
88. **What is CORS?**
89. **Explain preflight requests.**
90. **What is same-origin policy?**
91. **How do cookies work? `HttpOnly`, `Secure`, `SameSite`?**
92. **Explain Web Workers.**
93. **Explain Service Workers.**
94. **How do Push Notifications work?**
95. **What is the fetch API?**
96. **What is long polling?**
97. **What is Server-Sent Events (SSE)?**
98. **What is WebSocket?**
99. **CSR vs SSR vs SSG?**
100. **What is lazy loading?**
101. **Explain page lifecycle events.**
102. **How does rendering pipeline work in browsers?**
103. **What is layout thrashing?**
104. **What are repaint vs reflow events?**
105. **How to optimize browser performance?**

### E. Node.js + Backend JS

106. **What is Node.js?**
107. **How is Node.js single-threaded but handles concurrency?**
108. **What is libuv?**
109. **What are worker threads?**
110. **What is clustering?**
111. **Difference between blocking and non-blocking code?**
112. **What is CommonJS vs ES Modules in Node?**
113. **What is the Node process model?**
114. **What are streams?**
115. **Explain types of streams.**
116. **What is event emitter?**
117. **How to handle errors in Node.js?**
118. **What is middleware?**
119. **What is the difference between `spawn`, `exec`, and `fork`?**
120. **How does Node handle memory management?**
121. **What is V8?**
122. **What is the call stack size limit?**
123. **What is buffer? How is it different from `ArrayBuffer`?**
124. **What is the purpose of `package.json`?**
125. **What is semantic versioning?**
126. **What are peer dependencies?**

### F. Architecture, Patterns & Performance

127. **What is functional programming?**
128. **What is object-oriented programming?**
129. **What is the module pattern?**
130. **What is the revealing module pattern?**
131. **Explain the observer pattern.**
132. **What is pub/sub?**
133. **Explain MVC, MVVM patterns.**
134. **What is dependency injection?**
135. **What is immutability and why is it important?**
136. **What is event-driven architecture?**
137. **Explain microfrontends.**
138. **Explain monorepos vs polyrepos.**
139. **What is memoization in React vs pure JavaScript?**
140. **How do you optimize a large JS codebase?**
141. **How do you reduce bundle size?**
142. **Why is runtime performance vs bundle performance important?**
143. **How to debug memory leaks in JavaScript?**
144. **What tools are used for performance profiling?**
145. **What are source maps?**
146. **What is code splitting?**
147. **What is a race condition? How to prevent it in JS?**
148. **What is deadlock? Can it happen in JS?**
149. **What is optimistic vs pessimistic UI updates?**
150. **How do you architect a scalable JavaScript application?**

---

## 🛠️ 75 Real-World Scenario-Based Questions

### A. Asynchronous & Promise Scenarios

1. **You have 3 API calls. The page should render only after all succeed, but if any one fails, show partial UI. How do you implement this?**
2. **An API sometimes returns data late. You must timeout the request after 3 seconds. How to implement promise timeout?**
3. **You want to call APIs in sequence, each using the previous response. How do you write clean async/await code?**
4. **You need to retry an API call 5 times with exponential backoff if it fails. Implement this.**
5. **You have to run 10 API calls in parallel, but only 3 at a time. Implement concurrency control.**
6. **How do you cancel a `fetch()` request mid-way?**
7. **A user clicks a button multiple times; you must ensure only the latest request updates the UI. Implement request cancellation.**
8. **Implement a debounced search bar that calls API when typing stops.**
9. **Implement a throttled scroll event for infinite scrolling.**
10. **You need to transform a callback-based API into a Promise-based API. How?**

### B. Data Structures & Real Usage

11. **You get a nested JSON of unknown depth. How do you flatten it?**
12. **Given an array of objects, remove duplicates by id.**
13. **Convert an array of objects into an object keyed by id.**
14. **Deep clone a large object safely without `JSON.parse(JSON.stringify())`.**
15. **You have to compare two JSON objects and return only changed keys.**
16. **Merge two deeply nested config objects with conflict rules.**
17. **You have a huge array (200k items). How do you process it without blocking UI?**
18. **You need to group data by category (similar to SQL GROUP BY).**
19. **Extract only specific keys from an object dynamically.**
20. **Transform a JSON response into a tree structure.**

### C. Architecture & Design Patterns

21. **You need to build a plugin system where external functions hook into your code. How would you architect it?**
22. **Build a simple Pub/Sub system from scratch.**
23. **Implement the Observer pattern for real-time UI updates.**
24. **Implement a feature flag system in pure JS.**
25. **How do you build a caching layer for repeated API calls?**
26. **Implement a request-level LRU cache.**
27. **How do you create a middleware pipeline similar to Express?**
28. **Implement a state manager without using Redux.**
29. **Build a global event bus for a microfrontend system.**
30. **Implement a module loader similar to RequireJS.**

### D. Error Handling & Logging

31. **API returns partial data and UI should render only valid fields. How to design safe access handling?**
32. **Implement a central error handler for async functions.**
33. **Log user actions but throttle logs to avoid overload.**
34. **Wrap untrusted code in a safe sandbox using try/catch.**
35. **How to detect memory leaks in a long-running JS app?**
36. **Implement a global error boundary like React's, but in vanilla JS.**
37. **You need to capture all unhandled Promise rejections. How?**

### E. Performance Optimization

38. **You have a huge table (50,000 rows). How do you render efficiently? (Virtualization)**
39. **A CPU-heavy JS function blocks UI. How do you offload it? (Web Workers)**
40. **Minimize reflows while updating DOM repeatedly.**
41. **Implement caching for expensive function calls (memoization).**
42. **How do you avoid layout thrashing?**
43. **How do you split a large function into microtasks?**
44. **You need to detect slow scripts and warn developers. How?**
45. **Implement lazy loading for large images.**

### F. Security & Best Practices

46. **Prevent user from injecting JS via form inputs.**
47. **You must store JWT securely. `localStorage` or cookies? Why?**
48. **Implement CSRF protection with SameSite cookies.**
49. **Sanitize dynamic HTML before inserting into DOM.**
50. **Remove sensitive data before logging objects.**

### G. DOM + Browser Scenarios

51. **Implement a custom event in the browser and dispatch it.**
52. **Implement drag and drop without libraries.**
53. **You need to track scroll depth for analytics.**
54. **Create a modal that traps focus inside for accessibility.**
55. **You must handle file uploads using JavaScript only.**
56. **Build a real-time search filter without API calls.**
57. **Sticky header logic implementation.**
58. **Infinite scrolling implementation using `IntersectionObserver`.**
59. **How to detect if an element is visible on screen?**
60. **Simulate a click event programmatically.**

### H. Node.js + Backend JS Scenarios

61. **You have to stream a large file (1GB) to the client. How?**
62. **Implement rate limiting using JavaScript (token bucket).**
63. **Implement a file watcher from scratch using fs APIs.**
64. **Convert callback-based FS methods to Promises.**
65. **Implement your own version of Express's `next()` middleware flow.**
66. **How do you detect event loop blocking in Node.js?**
67. **You need to create a job scheduler in Node (like cron).**
68. **Implement a simple in-memory database.**
69. **How do you safely share data across worker threads?**
70. **Implement API caching with expiry using JavaScript.**

### I. Testing & Debugging Scenarios

71. **Mock `fetch()` for unit testing.**
72. **Create a test that ensures an async function resolves within time.**
73. **Write a test to check deep object equality.**
74. **How do you debug intermittent async bugs?**
75. **Implement a test double for a database service.**

---

## 📊 How to Use This Repository

### For Interviewers:
- Use conceptual questions to assess fundamental knowledge depth
- Present scenario-based questions to evaluate problem-solving skills
- Mix both types to understand theoretical knowledge and practical application
- Focus on areas relevant to your specific tech stack

### For Candidates:
- Review each question category to identify knowledge gaps
- Practice explaining concepts out loud (as you would in an interview)
- Implement solutions for scenario-based questions
- Understand not just "what" but "why" and "how"

### For Study Groups:
- Use as discussion prompts
- Take turns explaining concepts
- Whiteboard solutions together
- Compare different approaches to the same problem

---

## 🎯 Skill Levels

| Level | Focus Areas |
|-------|-------------|
| **Junior** | Basic syntax, DOM manipulation, simple async |
| **Mid-Level** | ES6+, complex async patterns, basic architecture |
| **Senior** | Advanced patterns, performance optimization, system design |
| **Lead/Staff** | Scalability, cross-team architecture, mentoring, technical strategy |

---

## 🔄 Keeping Current

JavaScript evolves rapidly. Consider these areas for ongoing learning:
- **New ECMAScript proposals** (2023+ features)
- **TypeScript** and static typing
- **WebAssembly** integration
- **Edge computing** with JavaScript
- **AI/ML** in JavaScript (TensorFlow.js)
- **Real-time technologies** (WebRTC, WebTransport)
- **Performance monitoring** and observability

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Add new questions with clear categorization
3. Provide sample answers or implementation hints
4. Update outdated questions
5. Create pull requests with descriptive titles

---

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [Web APIs Documentation](https://developer.mozilla.org/en-US/docs/Web/API)

---

**Good luck with your interview preparation! Remember that senior roles evaluate not just technical knowledge, but also communication skills, system thinking, and practical problem-solving abilities.** 🚀