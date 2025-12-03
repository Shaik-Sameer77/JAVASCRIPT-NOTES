# JavaScript Object-Oriented Programming & Built-in Data Structures

## Overview
Master JavaScript's unique approach to Object-Oriented Programming and understand the powerful built-in data structures that are essential for modern JavaScript development and technical interviews.

## 📚 Table of Contents
1. [OOP Core Concepts](#oop-core-concepts)
2. [Map](#map)
3. [Set](#set)
4. [WeakMap](#weakmap)
5. [WeakSet](#weakset)
6. [Other Data Structures](#other-data-structures)
7. [Practical OOP/DS Implementations](#practical-oopds-implementations)

---

## OOP Core Concepts

### What is OOP in JavaScript (Prototype-based OOP)
JavaScript uses prototype-based OOP rather than class-based OOP. Every object has a prototype (another object) from which it inherits properties and methods.

```javascript
// Prototype chain visualization
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true
console.log(obj.__proto__.__proto__); // null (end of chain)

// Prototype chain for arrays
const arr = [];
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.__proto__ === Object.prototype); // true

// Prototype chain for functions
function foo() {}
console.log(foo.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true
```

### Constructor Functions
The traditional way to create objects with shared behavior before ES6 classes.

```javascript
// Constructor function (convention: PascalCase)
function Person(name, age) {
  // Instance properties
  this.name = name;
  this.age = age;
  
  // Instance method (created for each instance - inefficient!)
  this.greet = function() {
    console.log(`Hello, my name is ${this.name}`);
  };
}

// Adding method to prototype (shared across all instances)
Person.prototype.sayAge = function() {
  console.log(`I am ${this.age} years old`);
};

// Adding static method
Person.compareAges = function(person1, person2) {
  return person1.age - person2.age;
};

// Creating instances
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

console.log(john.name); // 'John'
john.greet(); // 'Hello, my name is John'
john.sayAge(); // 'I am 30 years old' (from prototype)
console.log(Person.compareAges(john, jane)); // 5

// Checking prototype chain
console.log(john instanceof Person); // true
console.log(john.__proto__ === Person.prototype); // true
console.log(john.hasOwnProperty('sayAge')); // false (inherited)
console.log(john.hasOwnProperty('name')); // true (own property)
```

### ES6 Classes
Syntactic sugar over prototype-based inheritance. More readable and familiar to developers from class-based languages.

```javascript
class Person {
  // Private field (ES2022)
  #secret;
  
  // Static property
  static species = 'Homo sapiens';
  
  // Constructor (called when new instance is created)
  constructor(name, age) {
    // Instance properties
    this.name = name;
    this.age = age;
    
    // Private field initialization
    this.#secret = 'My secret';
    
    // Public field (ES2022)
    this.createdAt = new Date();
  }
  
  // Instance method
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
  
  // Getter (computed property)
  get birthYear() {
    return new Date().getFullYear() - this.age;
  }
  
  // Setter
  set birthYear(year) {
    this.age = new Date().getFullYear() - year;
  }
  
  // Private method (ES2022)
  #think() {
    console.log('Thinking...');
  }
  
  // Static method
  static compareAges(person1, person2) {
    return person1.age - person2.age;
  }
  
  // Method using private field
  revealSecret() {
    return this.#secret;
  }
  
  // Method calling private method
  thinkAndGreet() {
    this.#think();
    this.greet();
  }
}

// Creating instances
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

john.greet(); // 'Hello, my name is John'
console.log(john.birthYear); // Calculated: 1994

john.birthYear = 1990;
console.log(john.age); // 34

console.log(Person.species); // 'Homo sapiens'
console.log(Person.compareAges(john, jane)); // 9

console.log(john.revealSecret()); // 'My secret'
// john.#secret; // SyntaxError: Private field '#secret' must be declared
// john.#think(); // SyntaxError: Private field '#think' must be declared

// Inheritance demonstration
class Employee extends Person {
  constructor(name, age, position, salary) {
    super(name, age); // Call parent constructor
    this.position = position;
    this.salary = salary;
  }
  
  // Override parent method
  greet() {
    console.log(`Hello, I'm ${this.name}, a ${this.position}`);
  }
  
  // New method
  work() {
    console.log(`${this.name} is working as a ${this.position}`);
  }
  
  // Access parent method
  introduce() {
    super.greet(); // Call parent's greet method
    console.log(`I work as a ${this.position}`);
  }
  
  // Static method override
  static compareAges(emp1, emp2) {
    const ageDiff = super.compareAges(emp1, emp2);
    return `${ageDiff} years difference`;
  }
}

const manager = new Employee('Alice', 35, 'Manager', 80000);
manager.greet(); // 'Hello, I'm Alice, a Manager'
manager.work(); // 'Alice is working as a Manager'
manager.introduce(); // Calls parent greet then adds info

console.log(Employee.compareAges(manager, jane)); // '10 years difference'
```

### Prototypes & Prototype Chain
Understanding prototypes is crucial for JavaScript OOP.

```javascript
// Prototype chain demonstration
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} is barking`);
  }
}

const rex = new Dog('Rex', 'German Shepherd');

// Prototype chain visualization:
// rex -> Dog.prototype -> Animal.prototype -> Object.prototype -> null

console.log(rex.__proto__ === Dog.prototype); // true
console.log(Dog.prototype.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null

// Checking inheritance
console.log(rex instanceof Dog); // true
console.log(rex instanceof Animal); // true
console.log(rex instanceof Object); // true

// Property lookup mechanism
rex.eat(); // 1. Look in rex object -> not found
           // 2. Look in Dog.prototype -> not found
           // 3. Look in Animal.prototype -> found!

// Adding to prototype affects all instances
Dog.prototype.fetch = function() {
  console.log(`${this.name} is fetching`);
};

rex.fetch(); // Works even though rex was created before method was added

// Modifying built-in prototypes (generally not recommended)
Array.prototype.customMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

const numbers = [1, 2, 3];
console.log(numbers.customMap(n => n * 2)); // [2, 4, 6]
```

### Inheritance (extends, super)

```javascript
// Multi-level inheritance
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  
  start() {
    console.log(`${this.make} ${this.model} starting...`);
  }
  
  static isVehicle(obj) {
    return obj instanceof Vehicle;
  }
}

class Car extends Vehicle {
  constructor(make, model, year, doors) {
    super(make, model, year); // Must call super before using 'this'
    this.doors = doors;
    this.engineOn = false;
  }
  
  // Override with extension
  start() {
    super.start(); // Call parent method
    this.engineOn = true;
    console.log('Engine is running');
  }
  
  honk() {
    console.log('Beep beep!');
  }
}

class ElectricCar extends Car {
  constructor(make, model, year, doors, batteryCapacity) {
    super(make, model, year, doors);
    this.batteryCapacity = batteryCapacity;
    this.chargeLevel = 100;
  }
  
  // Override completely
  start() {
    if (this.chargeLevel > 0) {
      console.log(`${this.make} ${this.model} starting silently...`);
      this.engineOn = true;
    } else {
      console.log('Battery too low to start');
    }
  }
  
  // New method
  charge(percent) {
    this.chargeLevel = Math.min(100, this.chargeLevel + percent);
    console.log(`Charged to ${this.chargeLevel}%`);
  }
  
  // Static method inheritance
  static isElectricCar(obj) {
    return obj instanceof ElectricCar;
  }
}

const tesla = new ElectricCar('Tesla', 'Model S', 2023, 4, 100);
tesla.start(); // 'Tesla Model S starting silently...'
tesla.honk(); // 'Beep beep!' (inherited from Car)
tesla.charge(20); // 'Charged to 100%'

console.log(tesla instanceof ElectricCar); // true
console.log(tesla instanceof Car); // true
console.log(tesla instanceof Vehicle); // true
console.log(ElectricCar.isElectricCar(tesla)); // true
console.log(Vehicle.isVehicle(tesla)); // true
```

### Encapsulation (Private Fields #, Closures)

```javascript
// 1. Using Closures (pre-ES2022)
function BankAccount(initialBalance) {
  // Private variable using closure
  let balance = initialBalance;
  
  // Private function
  function validateAmount(amount) {
    return typeof amount === 'number' && amount > 0;
  }
  
  // Public interface
  return {
    deposit(amount) {
      if (validateAmount(amount)) {
        balance += amount;
        console.log(`Deposited ${amount}. New balance: ${balance}`);
      } else {
        console.log('Invalid deposit amount');
      }
    },
    
    withdraw(amount) {
      if (validateAmount(amount) && amount <= balance) {
        balance -= amount;
        console.log(`Withdrew ${amount}. New balance: ${balance}`);
        return amount;
      } else {
        console.log('Insufficient funds or invalid amount');
        return 0;
      }
    },
    
    getBalance() {
      return balance;
    }
  };
}

const account = BankAccount(1000);
account.deposit(500); // 'Deposited 500. New balance: 1500'
console.log(account.getBalance()); // 1500
// account.balance; // undefined (private)
// account.validateAmount(100); // Error (private)

// 2. Using ES2022 Private Fields (#)
class BankAccountClass {
  // Private fields (must be declared at top)
  #balance;
  #transactionHistory = [];
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  // Private method
  #validateAmount(amount) {
    return typeof amount === 'number' && amount > 0;
  }
  
  // Private static field
  static #bankName = 'MyBank';
  
  // Public methods
  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
      this.#transactionHistory.push({
        type: 'deposit',
        amount,
        timestamp: new Date()
      });
      console.log(`Deposited ${amount}. New balance: ${this.#balance}`);
    }
  }
  
  withdraw(amount) {
    if (this.#validateAmount(amount) && amount <= this.#balance) {
      this.#balance -= amount;
      this.#transactionHistory.push({
        type: 'withdrawal',
        amount,
        timestamp: new Date()
      });
      console.log(`Withdrew ${amount}. New balance: ${this.#balance}`);
      return amount;
    }
    console.log('Insufficient funds or invalid amount');
    return 0;
  }
  
  getBalance() {
    return this.#balance;
  }
  
  getTransactionCount() {
    return this.#transactionHistory.length;
  }
  
  // Static method accessing private static field
  static getBankName() {
    return this.#bankName;
  }
}

const acc = new BankAccountClass(1000);
acc.deposit(500); // 'Deposited 500. New balance: 1500'
console.log(acc.getBalance()); // 1500
console.log(acc.getTransactionCount()); // 1
console.log(BankAccountClass.getBankName()); // 'MyBank'
// acc.#balance; // SyntaxError
// acc.#validateAmount(100); // SyntaxError

// 3. Using Symbols for "private" properties
const _balance = Symbol('balance');
const _transactions = Symbol('transactions');

class AccountWithSymbols {
  constructor(initialBalance) {
    this[_balance] = initialBalance;
    this[_transactions] = [];
  }
  
  deposit(amount) {
    this[_balance] += amount;
    this[_transactions].push({ type: 'deposit', amount });
  }
  
  getBalance() {
    return this[_balance];
  }
}

const symAccount = new AccountWithSymbols(1000);
symAccount.deposit(500);
console.log(symAccount.getBalance()); // 1500

// Symbols provide some privacy but can still be accessed
const symbols = Object.getOwnPropertySymbols(symAccount);
console.log(symAccount[symbols[0]]); // 1500 (can still access)
```

### Polymorphism

```javascript
// Polymorphism: Different classes can be used interchangeably
class Shape {
  constructor(color) {
    this.color = color;
  }
  
  // Abstract method (convention in JS)
  getArea() {
    throw new Error('Method "getArea" must be implemented');
  }
  
  draw() {
    console.log(`Drawing a ${this.color} shape`);
  }
  
  // Polymorphic method
  describe() {
    console.log(`I am a ${this.color} shape with area ${this.getArea()}`);
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  
  getArea() {
    return Math.PI * this.radius * this.radius;
  }
  
  // Override draw
  draw() {
    console.log(`Drawing a ${this.color} circle with radius ${this.radius}`);
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }
  
  getArea() {
    return this.width * this.height;
  }
  
  // Override draw
  draw() {
    console.log(`Drawing a ${this.color} rectangle ${this.width}x${this.height}`);
  }
  
  // New method specific to Rectangle
  isSquare() {
    return this.width === this.height;
  }
}

class Triangle extends Shape {
  constructor(color, base, height) {
    super(color);
    this.base = base;
    this.height = height;
  }
  
  getArea() {
    return 0.5 * this.base * this.height;
  }
}

// Polymorphic behavior
const shapes = [
  new Circle('red', 5),
  new Rectangle('blue', 4, 6),
  new Triangle('green', 3, 4),
  new Circle('yellow', 3)
];

// Each shape behaves according to its type
shapes.forEach(shape => {
  shape.draw(); // Different implementation for each shape
  console.log(`Area: ${shape.getArea()}`); // Different calculation
  shape.describe(); // Common method with different results
});

// Type checking and casting
shapes.forEach(shape => {
  if (shape instanceof Circle) {
    console.log(`${shape.color} circle has radius ${shape.radius}`);
  } else if (shape instanceof Rectangle) {
    console.log(`${shape.color} rectangle ${shape.width}x${shape.height}`);
    if (shape.isSquare()) {
      console.log('  It\'s a square!');
    }
  }
});

// Duck typing (if it looks like a duck and quacks like a duck...)
function calculateTotalArea(shapes) {
  return shapes.reduce((total, shape) => {
    // Doesn't care about type, just needs getArea method
    if (typeof shape.getArea === 'function') {
      return total + shape.getArea();
    }
    return total;
  }, 0);
}

console.log(`Total area: ${calculateTotalArea(shapes)}`);
```

### Abstraction (Practical Usage)

```javascript
// 1. Abstract base class pattern
class AbstractDatabase {
  constructor() {
    if (new.target === AbstractDatabase) {
      throw new Error('Cannot instantiate abstract class');
    }
  }
  
  // Abstract methods
  connect() {
    throw new Error('Method "connect" must be implemented');
  }
  
  query(sql) {
    throw new Error('Method "query" must be implemented');
  }
  
  disconnect() {
    throw new Error('Method "disconnect" must be implemented');
  }
  
  // Common implementation
  execute(sql) {
    this.connect();
    const result = this.query(sql);
    this.disconnect();
    return result;
  }
}

class MySQLDatabase extends AbstractDatabase {
  connect() {
    console.log('Connecting to MySQL database...');
  }
  
  query(sql) {
    console.log(`Executing MySQL query: ${sql}`);
    return { rows: ['data1', 'data2'] };
  }
  
  disconnect() {
    console.log('Disconnecting from MySQL...');
  }
}

class MongoDBDatabase extends AbstractDatabase {
  connect() {
    console.log('Connecting to MongoDB...');
  }
  
  query(command) {
    console.log(`Executing MongoDB command: ${command}`);
    return { documents: ['doc1', 'doc2'] };
  }
  
  disconnect() {
    console.log('Disconnecting from MongoDB...');
  }
  
  // Additional MongoDB-specific method
  aggregate(pipeline) {
    console.log('Running aggregation pipeline');
    return { result: 'aggregated data' };
  }
}

// Usage
const mysql = new MySQLDatabase();
const result = mysql.execute('SELECT * FROM users');
console.log(result);

const mongo = new MongoDBDatabase();
mongo.execute('find users');

// 2. Interface-like pattern using composition
const Validator = {
  required(value) {
    return value !== undefined && value !== null && value !== '';
  },
  
  minLength(value, length) {
    return String(value).length >= length;
  },
  
  maxLength(value, length) {
    return String(value).length <= length;
  },
  
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
};

class FormField {
  constructor(name, value, rules = []) {
    this.name = name;
    this.value = value;
    this.rules = rules;
    this.errors = [];
  }
  
  validate() {
    this.errors = [];
    
    for (const rule of this.rules) {
      if (typeof Validator[rule.type] !== 'function') {
        throw new Error(`Unknown validation rule: ${rule.type}`);
      }
      
      if (!Validator[rule.type](this.value, rule.value)) {
        this.errors.push(rule.message || `Validation failed: ${rule.type}`);
      }
    }
    
    return this.errors.length === 0;
  }
}

// Usage
const emailField = new FormField('email', 'test@example.com', [
  { type: 'required', message: 'Email is required' },
  { type: 'email', message: 'Invalid email format' }
]);

console.log(emailField.validate()); // true
console.log(emailField.errors); // []

const passwordField = new FormField('password', '123', [
  { type: 'minLength', value: 6, message: 'Password must be at least 6 characters' }
]);

console.log(passwordField.validate()); // false
console.log(passwordField.errors); // ['Password must be at least 6 characters']

// 3. Abstraction through factory pattern
class PaymentProcessor {
  processPayment(amount) {
    throw new Error('Method must be implemented');
  }
}

class CreditCardProcessor extends PaymentProcessor {
  processPayment(amount) {
    console.log(`Processing credit card payment of $${amount}`);
    // Actual credit card processing logic
    return { success: true, transactionId: 'CC_' + Date.now() };
  }
}

class PayPalProcessor extends PaymentProcessor {
  processPayment(amount) {
    console.log(`Processing PayPal payment of $${amount}`);
    // Actual PayPal processing logic
    return { success: true, transactionId: 'PP_' + Date.now() };
  }
}

class CryptoProcessor extends PaymentProcessor {
  processPayment(amount) {
    console.log(`Processing cryptocurrency payment of $${amount}`);
    // Actual crypto processing logic
    return { success: true, transactionId: 'CRYPTO_' + Date.now() };
  }
}

class PaymentFactory {
  static createProcessor(type) {
    switch (type) {
      case 'creditcard':
        return new CreditCardProcessor();
      case 'paypal':
        return new PayPalProcessor();
      case 'crypto':
        return new CryptoProcessor();
      default:
        throw new Error(`Unknown payment type: ${type}`);
    }
  }
}

// Client code doesn't need to know implementation details
const paymentType = 'creditcard';
const processor = PaymentFactory.createProcessor(paymentType);
const result = processor.processPayment(100);
console.log(result);
```

### Static Methods

```javascript
// Static methods belong to the class, not instances
class MathUtils {
  // Static property
  static PI = 3.14159;
  static description = 'A utility class for mathematical operations';
  
  // Static method
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
  
  static max(array) {
    return Math.max(...array);
  }
  
  static min(array) {
    return Math.min(...array);
  }
  
  // Static method using other static methods
  static average(array) {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, val) => this.add(acc, val), 0);
    return sum / array.length;
  }
  
  // Static method that creates instances (factory pattern)
  static createRandomPoint() {
    return new Point(Math.random(), Math.random());
  }
  
  // Static getter
  static get randomNumber() {
    return Math.random();
  }
}

// Using static methods and properties
console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.add(5, 3)); // 8
console.log(MathUtils.multiply(4, 2)); // 8
console.log(MathUtils.max([1, 5, 3, 9, 2])); // 9
console.log(MathUtils.average([1, 2, 3, 4, 5])); // 3
console.log(MathUtils.randomNumber); // Random number

// Cannot call static methods on instances
const utils = new MathUtils();
// utils.add(1, 2); // TypeError: utils.add is not a function

// Static methods in inheritance
class AdvancedMath extends MathUtils {
  // Override static method
  static add(a, b) {
    console.log('Using advanced addition');
    return super.add(a, b); // Call parent static method
  }
  
  // New static method
  static power(base, exponent) {
    return Math.pow(base, exponent);
  }
  
  // Static property override
  static description = 'An advanced math utility class';
}

console.log(AdvancedMath.add(5, 3)); // 'Using advanced addition' then 8
console.log(AdvancedMath.power(2, 3)); // 8
console.log(AdvancedMath.description); // 'An advanced math utility class'

// Real-world example: Database connection pool
class DatabaseConnection {
  static #pool = [];
  static #maxConnections = 5;
  static #connectionCount = 0;
  
  constructor(name) {
    this.name = name;
    this.connected = false;
  }
  
  connect() {
    if (DatabaseConnection.#connectionCount >= DatabaseConnection.#maxConnections) {
      throw new Error('Connection pool exhausted');
    }
    
    this.connected = true;
    DatabaseConnection.#pool.push(this);
    DatabaseConnection.#connectionCount++;
    console.log(`Connected: ${this.name}`);
  }
  
  disconnect() {
    this.connected = false;
    const index = DatabaseConnection.#pool.indexOf(this);
    if (index > -1) {
      DatabaseConnection.#pool.splice(index, 1);
      DatabaseConnection.#connectionCount--;
    }
    console.log(`Disconnected: ${this.name}`);
  }
  
  // Static factory method
  static createConnection(name) {
    return new DatabaseConnection(name);
  }
  
  // Static method to get pool status
  static getPoolStatus() {
    return {
      current: DatabaseConnection.#connectionCount,
      max: DatabaseConnection.#maxConnections,
      available: DatabaseConnection.#maxConnections - DatabaseConnection.#connectionCount
    };
  }
  
  // Static method to close all connections
  static closeAll() {
    DatabaseConnection.#pool.forEach(conn => conn.disconnect());
  }
}

// Usage
const conn1 = DatabaseConnection.createConnection('Connection 1');
const conn2 = DatabaseConnection.createConnection('Connection 2');

conn1.connect();
conn2.connect();

console.log(DatabaseConnection.getPoolStatus()); // { current: 2, max: 5, available: 3 }

conn1.disconnect();
console.log(DatabaseConnection.getPoolStatus()); // { current: 1, max: 5, available: 4 }

DatabaseConnection.closeAll();
console.log(DatabaseConnection.getPoolStatus()); // { current: 0, max: 5, available: 5 }
```

---

## Map

### What is Map
A Map is a collection of key-value pairs where keys can be any data type (objects, functions, primitives), unlike Objects which only allow strings and Symbols as keys.

### Why use Map instead of object
```javascript
// Key differences:
// 1. Key types: Map accepts any type, Object only strings/Symbols
// 2. Size: Map has .size property
// 3. Iteration: Map is iterable, maintains insertion order
// 4. Performance: Better for frequent additions/removals
// 5. Default keys: Map doesn't have prototype chain keys
```

### Map Methods: set, get, has, delete, clear

```javascript
// Creating a Map
const map = new Map();

// 1. set() - Add or update key-value pair
map.set('name', 'John');
map.set(42, 'The answer');
map.set({ id: 1 }, 'Object key');
map.set([1, 2, 3], 'Array key');
map.set(() => {}, 'Function key');
map.set(null, 'null key');
map.set(undefined, 'undefined key');
map.set(NaN, 'NaN key'); // NaN is a valid key!

// 2. get() - Retrieve value by key
console.log(map.get('name')); // 'John'
console.log(map.get(42)); // 'The answer'
console.log(map.get(NaN)); // 'NaN key' (works!)
console.log(map.get({ id: 1 })); // undefined (different object reference)

// 3. has() - Check if key exists
console.log(map.has('name')); // true
console.log(map.has('age')); // false

// 4. delete() - Remove key-value pair
map.delete('name');
console.log(map.has('name')); // false

// 5. clear() - Remove all entries
map.clear();
console.log(map.size); // 0

// Re-populate for examples
map.set('a', 1).set('b', 2).set('c', 3); // Chainable
```

### Iterating through Map
```javascript
const userMap = new Map([
  ['name', 'Alice'],
  ['age', 30],
  ['city', 'New York'],
  ['isAdmin', true]
]);

// 1. forEach() - Iterate values
userMap.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 2. for...of loop with entries (default)
for (const [key, value] of userMap) {
  console.log(`${key}: ${value}`);
}

// 3. for...of with entries() method
for (const [key, value] of userMap.entries()) {
  console.log(`${key}: ${value}`);
}

// 4. Iterate keys only
for (const key of userMap.keys()) {
  console.log(key);
}

// 5. Iterate values only
for (const value of userMap.values()) {
  console.log(value);
}

// 6. Convert to array
const entriesArray = Array.from(userMap);
console.log(entriesArray); // [['name', 'Alice'], ['age', 30], ...]

const keysArray = Array.from(userMap.keys());
const valuesArray = Array.from(userMap.values());
```

### Map vs Object (memory, speed, keys type)

```javascript
// Performance comparison
const size = 1000000;
console.time('Map creation');
const map = new Map();
for (let i = 0; i < size; i++) {
  map.set(`key${i}`, `value${i}`);
}
console.timeEnd('Map creation');

console.time('Object creation');
const obj = {};
for (let i = 0; i < size; i++) {
  obj[`key${i}`] = `value${i}`;
}
console.timeEnd('Object creation');

// Lookup performance
console.time('Map lookup');
for (let i = 0; i < size; i++) {
  map.get(`key${i}`);
}
console.timeEnd('Map lookup');

console.time('Object lookup');
for (let i = 0; i < size; i++) {
  const val = obj[`key${i}`];
}
console.timeEnd('Object lookup');

// Memory comparison
function getMemoryUsage() {
  const used = process.memoryUsage().heapUsed;
  return Math.round(used / 1024 / 1024 * 100) / 100 + ' MB';
}

// Key differences table:
/*
| Feature                | Map                          | Object                      |
|------------------------|------------------------------|-----------------------------|
| Key types              | Any value                    | String or Symbol           |
| Key order              | Insertion order preserved    | Own integer keys sorted, others creation order |
| Size                   | .size property               | Manual calculation          |
| Iteration              | Built-in iterable            | Object.keys(), etc.         |
| Default keys           | None                         | Prototype chain             |
| Serialization          | Not natively JSON serializable | JSON.stringify works       |
| Performance            | Better for frequent adds/dels | Better for some operations  |
| Use case               | When keys are unknown/any type | When keys are known strings |
*/
```

### Practical Map Examples

```javascript
// 1. Counting frequencies
function countFrequency(arr) {
  const freq = new Map();
  
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  
  return freq;
}

const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitCounts = countFrequency(fruits);
console.log(Array.from(fruitCounts.entries()));

// 2. Caching/memoization with complex keys
function expensiveOperation(a, b, options = {}) {
  // Create cache key from all arguments
  const cacheKey = JSON.stringify([a, b, options]);
  
  if (!expensiveOperation.cache.has(cacheKey)) {
    console.log('Cache miss - computing...');
    const result = a * b * (options.multiplier || 1);
    expensiveOperation.cache.set(cacheKey, result);
  }
  
  return expensiveOperation.cache.get(cacheKey);
}
expensiveOperation.cache = new Map();

console.log(expensiveOperation(2, 3, { multiplier: 2 })); // Cache miss
console.log(expensiveOperation(2, 3, { multiplier: 2 })); // Cache hit

// 3. Object metadata storage
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const userMetadata = new Map();

// Store additional data without modifying objects
users.forEach(user => {
  userMetadata.set(user, {
    lastLogin: new Date(),
    loginCount: 0,
    preferences: {}
  });
});

// Update metadata
const alice = users[0];
aliceMetadata = userMetadata.get(alice);
aliceMetadata.loginCount++;
aliceMetadata.lastLogin = new Date();

// 4. Implementing LRU Cache
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
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first entry)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  display() {
    console.log(Array.from(this.cache.entries()));
  }
}

const cache = new LRUCache(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
cache.display(); // [['a', 1], ['b', 2], ['c', 3]]

cache.get('a'); // Moves 'a' to end
cache.display(); // [['b', 2], ['c', 3], ['a', 1]]

cache.put('d', 4); // Removes 'b' (LRU)
cache.display(); // [['c', 3], ['a', 1], ['d', 4]]
```

---

## Set

### What is Set
A Set is a collection of unique values (no duplicates) where each value can occur only once. It maintains insertion order.

### When to use Set
```javascript
// Use Set when:
// 1. You need unique values
// 2. You need to check existence efficiently
// 3. You need to perform set operations (union, intersection, difference)
// 4. Order of insertion matters
// 5. You're dealing with object references
```

### Set Methods: add, has, delete, clear

```javascript
// Creating a Set
const set = new Set();

// 1. add() - Add value (ignores duplicates)
set.add(1);
set.add(2);
set.add(3);
set.add(2); // Duplicate - ignored
set.add('hello');
set.add({ name: 'John' });
set.add([1, 2, 3]);
set.add(NaN);
set.add(NaN); // NaN is considered equal to NaN in Set

console.log(set.size); // 7 (1, 2, 3, 'hello', {name: 'John'}, [1,2,3], NaN)

// 2. has() - Check if value exists
console.log(set.has(1)); // true
console.log(set.has(4)); // false
console.log(set.has(NaN)); // true
console.log(set.has({ name: 'John' })); // false (different object)

// 3. delete() - Remove value
set.delete(1);
console.log(set.has(1)); // false

// 4. clear() - Remove all values
set.clear();
console.log(set.size); // 0

// Re-populate
set.add('a').add('b').add('c'); // Chainable
```

### Removing duplicates using Set

```javascript
// Simple array deduplication
const numbers = [1, 2, 2, 3, 4, 4, 5, 5, 5];
const uniqueNumbers = [...new Set(numbers)];
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]

// String deduplication
const text = 'hello world';
const uniqueChars = [...new Set(text)].join('');
console.log(uniqueChars); // 'helo wrd'

// Complex objects (by reference)
const objects = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 2 }];
const uniqueObjects = [...new Set(objects)];
console.log(uniqueObjects.length); // 4 (all different references)

// Deduplication with transformation
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John' }, // Duplicate ID
  { id: 3, name: 'Bob' }
];

// Remove duplicates by id
const uniqueById = [...new Map(users.map(user => [user.id, user])).values()];
console.log(uniqueById); // 3 users

// Using JSON.stringify for deep comparison (careful with order)
const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 1, y: 2 } // Duplicate
];

const uniqueData = [...new Set(data.map(item => JSON.stringify(item)))]
  .map(str => JSON.parse(str));
console.log(uniqueData); // 2 objects
```

### Set vs Array

```javascript
// Performance comparison
const size = 1000000;

// Array search vs Set lookup
const array = [];
const set = new Set();

for (let i = 0; i < size; i++) {
  array.push(i);
  set.add(i);
}

const searchValue = size - 1;

console.time('Array includes');
array.includes(searchValue);
console.timeEnd('Array includes');

console.time('Set has');
set.has(searchValue);
console.timeEnd('Set has');

// Adding duplicates
console.time('Array push with duplicates');
for (let i = 0; i < 100000; i++) {
  if (!array.includes(i)) {
    array.push(i);
  }
}
console.timeEnd('Array push with duplicates');

console.time('Set add with duplicates');
for (let i = 0; i < 100000; i++) {
  set.add(i);
}
console.timeEnd('Set add with duplicates');

// Key differences:
/*
| Feature                | Set                          | Array                      |
|------------------------|------------------------------|----------------------------|
| Uniqueness             | Guaranteed                   | Not guaranteed             |
| Order                  | Insertion order              | Index-based order          |
| Lookup performance     | O(1) average                 | O(n) for includes/indexOf  |
| Storage                | Only values                  | Indexed values             |
| Use case               | Unique collections, membership | Ordered collections, duplicates |
| Memory                 | More efficient for uniqueness | More flexible              |
*/
```

### Practical Set Examples

```javascript
// 1. Set operations
class SetOperations {
  static union(setA, setB) {
    return new Set([...setA, ...setB]);
  }
  
  static intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
  }
  
  static difference(setA, setB) {
    return new Set([...setA].filter(x => !setB.has(x)));
  }
  
  static symmetricDifference(setA, setB) {
    return new Set(
      [...SetOperations.difference(setA, setB),
       ...SetOperations.difference(setB, setA)]
    );
  }
  
  static isSubset(setA, setB) {
    return [...setA].every(x => setB.has(x));
  }
  
  static isSuperset(setA, setB) {
    return SetOperations.isSubset(setB, setA);
  }
}

// Usage
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

console.log([...SetOperations.union(setA, setB)]); // [1, 2, 3, 4, 5, 6]
console.log([...SetOperations.intersection(setA, setB)]); // [3, 4]
console.log([...SetOperations.difference(setA, setB)]); // [1, 2]
console.log([...SetOperations.symmetricDifference(setA, setB)]); // [1, 2, 5, 6]
console.log(SetOperations.isSubset(new Set([3, 4]), setA)); // true

// 2. Tag system
class TagManager {
  constructor() {
    this.tags = new Set();
  }
  
  addTag(tag) {
    const normalized = tag.toLowerCase().trim();
    if (normalized) {
      this.tags.add(normalized);
    }
  }
  
  addTags(...tags) {
    tags.forEach(tag => this.addTag(tag));
  }
  
  removeTag(tag) {
    this.tags.delete(tag.toLowerCase().trim());
  }
  
  hasTag(tag) {
    return this.tags.has(tag.toLowerCase().trim());
  }
  
  getTags() {
    return [...this.tags];
  }
  
  getTagsAsString() {
    return [...this.tags].join(', ');
  }
  
  clearTags() {
    this.tags.clear();
  }
  
  // Find common tags with another TagManager
  commonTags(other) {
    return SetOperations.intersection(this.tags, other.tags);
  }
}

const postTags = new TagManager();
postTags.addTags('JavaScript', 'Programming', 'Web Development', 'javascript');
console.log(postTags.getTags()); // ['javascript', 'programming', 'web development']

// 3. User permissions/roles
class PermissionSystem {
  constructor() {
    this.userPermissions = new Map(); // userId -> Set of permissions
    this.rolePermissions = new Map(); // role -> Set of permissions
  }
  
  defineRole(role, permissions) {
    this.rolePermissions.set(role, new Set(permissions));
  }
  
  assignRole(userId, role) {
    if (!this.rolePermissions.has(role)) {
      throw new Error(`Role "${role}" not defined`);
    }
    
    const rolePerms = this.rolePermissions.get(role);
    const userPerms = this.userPermissions.get(userId) || new Set();
    
    // Add all role permissions to user
    rolePerms.forEach(perm => userPerms.add(perm));
    this.userPermissions.set(userId, userPerms);
  }
  
  grantPermission(userId, permission) {
    const perms = this.userPermissions.get(userId) || new Set();
    perms.add(permission);
    this.userPermissions.set(userId, perms);
  }
  
  revokePermission(userId, permission) {
    const perms = this.userPermissions.get(userId);
    if (perms) {
      perms.delete(permission);
    }
  }
  
  hasPermission(userId, permission) {
    const perms = this.userPermissions.get(userId);
    return perms ? perms.has(permission) : false;
  }
  
  getUserPermissions(userId) {
    return [...(this.userPermissions.get(userId) || [])];
  }
}

// Usage
const perms = new PermissionSystem();
perms.defineRole('admin', ['create', 'read', 'update', 'delete', 'manage_users']);
perms.defineRole('editor', ['create', 'read', 'update']);
perms.defineRole('viewer', ['read']);

perms.assignRole('user1', 'admin');
perms.assignRole('user2', 'editor');

console.log(perms.hasPermission('user1', 'delete')); // true
console.log(perms.hasPermission('user2', 'delete')); // false

perms.grantPermission('user2', 'delete'); // Grant extra permission
console.log(perms.hasPermission('user2', 'delete')); // true

// 4. Finding unique visitors
class VisitorTracker {
  constructor() {
    this.dailyVisitors = new Map(); // date -> Set of visitorIds
  }
  
  visit(date, visitorId) {
    const dateKey = date.toDateString();
    
    if (!this.dailyVisitors.has(dateKey)) {
      this.dailyVisitors.set(dateKey, new Set());
    }
    
    this.dailyVisitors.get(dateKey).add(visitorId);
  }
  
  getDailyCount(date) {
    const dateKey = date.toDateString();
    const visitors = this.dailyVisitors.get(dateKey);
    return visitors ? visitors.size : 0;
  }
  
  getReturningVisitors(date1, date2) {
    const key1 = date1.toDateString();
    const key2 = date2.toDateString();
    
    const set1 = this.dailyVisitors.get(key1) || new Set();
    const set2 = this.dailyVisitors.get(key2) || new Set();
    
    return SetOperations.intersection(set1, set2);
  }
  
  getTotalUniqueVisitors() {
    const allVisitors = new Set();
    
    for (const visitorSet of this.dailyVisitors.values()) {
      visitorSet.forEach(visitor => allVisitors.add(visitor));
    }
    
    return allVisitors.size;
  }
}

const tracker = new VisitorTracker();
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

tracker.visit(today, 'user1');
tracker.visit(today, 'user2');
tracker.visit(today, 'user1'); // Duplicate
tracker.visit(yesterday, 'user1');
tracker.visit(yesterday, 'user3');

console.log(tracker.getDailyCount(today)); // 2
console.log(tracker.getReturningVisitors(today, yesterday).size); // 1 (user1)
console.log(tracker.getTotalUniqueVisitors()); // 3
```

---

## WeakMap

### What is WeakMap
A WeakMap is a collection of key-value pairs where keys must be objects and are held weakly (doesn't prevent garbage collection). Values can be any type.

### Why keys must be objects
```javascript
// WeakMap keys must be objects to enable garbage collection
// The reference to the key is "weak" - doesn't count toward reference counting
const weakMap = new WeakMap();

const obj = { id: 1 };
weakMap.set(obj, 'some value');

// This works
console.log(weakMap.get(obj)); // 'some value'

// But this doesn't work
// weakMap.set('string', 'value'); // TypeError: Invalid value used as weak map key
// weakMap.set(123, 'value'); // TypeError
```

### Garbage Collection Behavior

```javascript
// Demonstration of garbage collection
function demonstrateGarbageCollection() {
  let obj = { data: 'important' };
  const weakMap = new WeakMap();
  const regularMap = new Map();
  
  // Store reference in both
  weakMap.set(obj, 'WeakMap value');
  regularMap.set(obj, 'Regular Map value');
  
  console.log('Before nulling reference:');
  console.log('WeakMap has obj:', weakMap.has(obj)); // true
  console.log('Map has obj:', regularMap.has(obj)); // true
  
  // Remove the only strong reference to the object
  obj = null;
  
  // Force garbage collection (in Node.js with flags: --expose-gc)
  if (global.gc) {
    global.gc();
  }
  
  // The object should still exist in regularMap (prevents GC)
  // but may be collected from WeakMap
  console.log('\nAfter nulling reference:');
  // Can't check weakMap.has() because we don't have the object anymore
  console.log('Map size:', regularMap.size); // Still 1 (prevents GC)
  
  // Regular Map keeps object alive, WeakMap doesn't
  console.log('First entry in Map:', regularMap.entries().next().value);
}

// In browser, you can see memory behavior in DevTools
```

### When to use (private data storage)

```javascript
// 1. Private data for objects
const PrivateData = new WeakMap();

class User {
  constructor(name, age) {
    // Store private data in WeakMap with instance as key
    PrivateData.set(this, {
      name: name,
      age: age,
      secret: 'This is private'
    });
  }
  
  getName() {
    return PrivateData.get(this).name;
  }
  
  getAge() {
    return PrivateData.get(this).age;
  }
  
  // Private method data
  #privateMethod() {
    const data = PrivateData.get(this);
    console.log(`Private method accessing: ${data.secret}`);
  }
  
  publicMethod() {
    this.#privateMethod();
  }
}

const user = new User('John', 30);
console.log(user.getName()); // 'John'
console.log(user.getAge()); // 30
user.publicMethod(); // 'Private method accessing: This is private'

// Cannot access private data directly
console.log(user.secret); // undefined
// console.log(PrivateData.get(user)); // Works but PrivateData is not exported

// When user is garbage collected, its private data is automatically cleaned

// 2. Caching with automatic cleanup
function createExpensiveObjectCache() {
  const cache = new WeakMap();
  
  return {
    getOrCreate(key, createFn) {
      if (!cache.has(key)) {
        const value = createFn();
        cache.set(key, value);
        console.log('Created new cached value');
        return value;
      }
      
      console.log('Returning cached value');
      return cache.get(key);
    },
    
    // No need for cleanup method - automatic!
    invalidate(key) {
      cache.delete(key);
    }
  };
}

const objCache = createExpensiveObjectCache();

const expensiveObject = {
  data: new Array(1000000).fill('x').join('') // Large object
};

const key = { id: 1 };
const value1 = objCache.getOrCreate(key, () => expensiveObject);
const value2 = objCache.getOrCreate(key, () => expensiveObject); // Cached

// When key is no longer referenced, cache entry is automatically removed
key = null;
// Eventually garbage collected

// 3. Metadata for DOM elements
class DOMElementTracker {
  #elementData = new WeakMap();
  
  attachData(element, data) {
    this.#elementData.set(element, data);
  }
  
  getData(element) {
    return this.#elementData.get(element);
  }
  
  updateData(element, updates) {
    const current = this.#elementData.get(element) || {};
    this.#elementData.set(element, { ...current, ...updates });
  }
  
  // No need to clean up when DOM elements are removed
}

const tracker = new DOMElementTracker();

// In a real app:
// const button = document.getElementById('myButton');
// tracker.attachData(button, { clickCount: 0, lastClicked: null });
// 
// button.addEventListener('click', () => {
//   const data = tracker.getData(button);
//   tracker.updateData(button, { 
//     clickCount: data.clickCount + 1,
//     lastClicked: new Date()
//   });
// });
// 
// When button is removed from DOM, its data is automatically cleaned

// 4. Listener management
class EventListenerManager {
  #listeners = new WeakMap();
  
  addListener(element, event, handler) {
    if (!this.#listeners.has(element)) {
      this.#listeners.set(element, new Map());
    }
    
    const elementListeners = this.#listeners.get(element);
    
    if (!elementListeners.has(event)) {
      elementListeners.set(event, new Set());
    }
    
    elementListeners.get(event).add(handler);
    element.addEventListener(event, handler);
  }
  
  removeListener(element, event, handler) {
    const elementListeners = this.#listeners.get(element);
    if (!elementListeners) return;
    
    const eventListeners = elementListeners.get(event);
    if (!eventListeners) return;
    
    eventListeners.delete(handler);
    element.removeEventListener(event, handler);
    
    if (eventListeners.size === 0) {
      elementListeners.delete(event);
    }
    
    if (elementListeners.size === 0) {
      this.#listeners.delete(element);
    }
  }
  
  removeAllListeners(element) {
    const elementListeners = this.#listeners.get(element);
    if (!elementListeners) return;
    
    for (const [event, handlers] of elementListeners.entries()) {
      for (const handler of handlers) {
        element.removeEventListener(event, handler);
      }
    }
    
    this.#listeners.delete(element);
  }
  
  // Automatic cleanup when elements are removed from DOM
}

// 5. Object metadata without memory leaks
class ObjectMetadata {
  static #metadata = new WeakMap();
  
  static setMetadata(obj, key, value) {
    if (!this.#metadata.has(obj)) {
      this.#metadata.set(obj, new Map());
    }
    
    this.#metadata.get(obj).set(key, value);
  }
  
  static getMetadata(obj, key) {
    const objMetadata = this.#metadata.get(obj);
    return objMetadata ? objMetadata.get(key) : undefined;
  }
  
  static hasMetadata(obj, key) {
    const objMetadata = this.#metadata.get(obj);
    return objMetadata ? objMetadata.has(key) : false;
  }
  
  static deleteMetadata(obj, key) {
    const objMetadata = this.#metadata.get(obj);
    if (objMetadata) {
      objMetadata.delete(key);
      if (objMetadata.size === 0) {
        this.#metadata.delete(obj);
      }
    }
  }
}

// Usage
const obj1 = {};
const obj2 = {};

ObjectMetadata.setMetadata(obj1, 'created', new Date());
ObjectMetadata.setMetadata(obj1, 'creator', 'system');
ObjectMetadata.setMetadata(obj2, 'created', new Date());

console.log(ObjectMetadata.getMetadata(obj1, 'created'));
console.log(ObjectMetadata.hasMetadata(obj1, 'creator'));

// When obj1 is garbage collected, its metadata is automatically cleaned
```

---

## WeakSet

### What is WeakSet
A WeakSet is a collection of objects where each object can occur only once. Objects are held weakly (doesn't prevent garbage collection).

### Only objects as values
```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);
weakSet.add(obj1); // Duplicate - ignored

console.log(weakSet.has(obj1)); // true
console.log(weakSet.has(obj2)); // true

// Cannot add primitives
// weakSet.add('string'); // TypeError
// weakSet.add(123); // TypeError

// Cannot iterate or get size
// console.log(weakSet.size); // undefined
// for (const item of weakSet) {} // TypeError: weakSet is not iterable
```

### Automatic Garbage Collection

```javascript
// WeakSet allows objects to be garbage collected
function demonstrateWeakSetGC() {
  const weakSet = new WeakSet();
  const regularSet = new Set();
  
  function createObjects() {
    const tempObj = { data: 'temporary' };
    weakSet.add(tempObj);
    regularSet.add(tempObj);
    
    // tempObj goes out of scope here
  }
  
  createObjects();
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // regularSet still holds reference, preventing GC
  // weakSet doesn't prevent GC
  console.log('Regular set size:', regularSet.size); // 1 (still exists)
  // Can't check weakSet size or contents
}

// In practice, WeakSet is useful for marking/tagging objects
// without preventing their garbage collection
```

### When to use (tracking objects)

```javascript
// 1. Tracking visited objects (circular reference detection)
class ObjectTracker {
  #visited = new WeakSet();
  
  deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    // Check for circular reference
    if (this.#visited.has(obj)) {
      throw new Error('Circular reference detected');
    }
    
    this.#visited.add(obj);
    
    const clone = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = this.deepClone(obj[key]);
      }
    }
    
    return clone;
  }
  
  // Reset tracker
  reset() {
    // No need to clear WeakSet - it automatically releases memory
    // But we can't clear it either (no clear method)
    // So we create a new instance
    this.#visited = new WeakSet();
  }
}

const tracker = new ObjectTracker();
const obj = { a: 1 };
obj.self = obj; // Circular reference

try {
  tracker.deepClone(obj);
} catch (error) {
  console.log(error.message); // 'Circular reference detected'
}

// 2. Ensuring objects are only processed once
class ProcessManager {
  #processed = new WeakSet();
  
  process(obj) {
    if (this.#processed.has(obj)) {
      console.log('Object already processed, skipping');
      return;
    }
    
    console.log('Processing object:', obj);
    // Perform expensive operation
    this.#processed.add(obj);
  }
  
  // No need to clean up - automatically handles garbage collection
}

const manager = new ProcessManager();
const data1 = { id: 1, value: 'test' };
const data2 = { id: 2, value: 'test2' };

manager.process(data1); // 'Processing object: {...}'
manager.process(data1); // 'Object already processed, skipping'
manager.process(data2); // 'Processing object: {...}'

// When data1 is no longer referenced, it's removed from WeakSet automatically

// 3. Detecting memory leaks by tracking object lifetimes
class MemoryLeakDetector {
  #expectedLifetime = new WeakSet();
  #actualLifetime = new Set();
  
  expectToBeCollected(obj, description) {
    this.#expectedLifetime.add(obj);
    this.#actualLifetime.add({ obj, description, expected: true });
    
    // Create a finalization registry to detect when object is collected
    const registry = new FinalizationRegistry((description) => {
      console.log(`✓ Object collected: ${description}`);
      this.#actualLifetime.delete(description);
    });
    
    registry.register(obj, description);
  }
  
  checkLeaks() {
    console.log('\nChecking for memory leaks...');
    let leaks = 0;
    
    for (const entry of this.#actualLifetime) {
      if (entry.expected && this.#expectedLifetime.has(entry.obj)) {
        console.log(`⚠ Potential leak: ${entry.description}`);
        leaks++;
      }
    }
    
    console.log(`Found ${leaks} potential leaks`);
    return leaks;
  }
}

// 4. Validating object state transitions
class StateMachine {
  #validTransitions = new WeakMap();
  #currentStates = new WeakMap();
  
  constructor() {
    // Define valid transitions
    const transitions = new Map();
    transitions.set('pending', new Set(['processing', 'cancelled']));
    transitions.set('processing', new Set(['completed', 'failed']));
    transitions.set('completed', new Set([]));
    transitions.set('failed', new Set(['retrying']));
    transitions.set('retrying', new Set(['processing', 'failed']));
    transitions.set('cancelled', new Set([]));
    
    this.#validTransitions = transitions;
  }
  
  createObject(obj, initialState = 'pending') {
    this.#currentStates.set(obj, initialState);
  }
  
  transition(obj, newState) {
    const currentState = this.#currentStates.get(obj);
    
    if (!currentState) {
      throw new Error('Object not registered with state machine');
    }
    
    const allowedTransitions = this.#validTransitions.get(currentState);
    
    if (!allowedTransitions || !allowedTransitions.has(newState)) {
      throw new Error(`Invalid transition from ${currentState} to ${newState}`);
    }
    
    this.#currentStates.set(obj, newState);
    console.log(`Transitioned ${obj.constructor.name} from ${currentState} to ${newState}`);
  }
  
  getState(obj) {
    return this.#currentStates.get(obj);
  }
  
  // When objects are garbage collected, their state is automatically cleaned
}

// Usage
const machine = new StateMachine();
const task1 = { id: 1, name: 'Task 1' };
const task2 = { id: 2, name: 'Task 2' };

machine.createObject(task1);
machine.createObject(task2, 'processing');

console.log(machine.getState(task1)); // 'pending'
machine.transition(task1, 'processing'); // Valid
machine.transition(task1, 'completed'); // Valid
// machine.transition(task1, 'pending'); // Error: Invalid transition

// 5. Managing subscriptions/observers without memory leaks
class Observable {
  #observers = new WeakSet();
  
  subscribe(observer) {
    if (typeof observer !== 'object' || observer === null) {
      throw new Error('Observer must be an object');
    }
    
    if (typeof observer.update !== 'function') {
      throw new Error('Observer must have an update method');
    }
    
    this.#observers.add(observer);
    console.log('Observer subscribed');
  }
  
  unsubscribe(observer) {
    this.#observers.delete(observer);
    console.log('Observer unsubscribed');
  }
  
  notify(data) {
    // We can't iterate WeakSet directly, so we need another approach
    // In real implementation, you'd store observers differently
    // This is simplified to show the concept
    
    // Alternative: Use FinalizationRegistry to track
    const registry = new FinalizationRegistry((observer) => {
      this.#observers.delete(observer);
    });
    
    // The key point: when observer objects are garbage collected,
    // they're automatically removed from the WeakSet
  }
}

// The main advantage: if an observer goes out of scope/is garbage collected,
// it's automatically removed from the observable's tracking
```

---

## Other Data Structures in JS

### Typed Arrays (Uint8Array, Float32Array)
Typed arrays provide a way to work with raw binary data in JavaScript.

```javascript
// Creating typed arrays
const uint8 = new Uint8Array(8); // 8 bytes, values 0-255
uint8[0] = 255;
uint8[1] = 128;
console.log(uint8); // Uint8Array(8) [255, 128, 0, 0, 0, 0, 0, 0]

const int16 = new Int16Array(4); // 4 16-bit integers, values -32768 to 32767
int16[0] = 32767;
int16[1] = -32768;

const float32 = new Float32Array(4); // 4 32-bit floating point numbers
float32[0] = 3.14159;
float32[1] = 2.71828;

const float64 = new Float64Array(2); // 2 64-bit floating point numbers
float64[0] = Number.MAX_SAFE_INTEGER;

// Available typed arrays:
/*
| Constructor     | Description                     | Range                          |
|-----------------|---------------------------------|--------------------------------|
| Int8Array       | 8-bit signed integer           | -128 to 127                   |
| Uint8Array      | 8-bit unsigned integer         | 0 to 255                      |
| Uint8ClampedArray | 8-bit unsigned integer (clamped) | 0 to 255 (clamps values)    |
| Int16Array      | 16-bit signed integer          | -32768 to 32767              |
| Uint16Array     | 16-bit unsigned integer        | 0 to 65535                   |
| Int32Array      | 32-bit signed integer          | -2^31 to 2^31-1              |
| Uint32Array     | 32-bit unsigned integer        | 0 to 2^32-1                  |
| Float32Array    | 32-bit floating point          | ~1.2×10^-38 to ~3.4×10^38    |
| Float64Array    | 64-bit floating point          | ~5.0×10^-324 to ~1.8×10^308  |
| BigInt64Array   | 64-bit signed integer          | -2^63 to 2^63-1              |
| BigUint64Array  | 64-bit unsigned integer        | 0 to 2^64-1                  |
*/

// Initializing with values
const buffer = new ArrayBuffer(16); // 16 bytes
const view32 = new Int32Array(buffer); // 4 elements (4 bytes each)
view32[0] = 42;
view32[1] = 1337;

// Working with multiple views on same buffer
const view8 = new Uint8Array(buffer);
view8[0] = 255; // Modifies first byte, affecting view32[0]

console.log(view32[0]); // Different value now

// Methods similar to regular arrays
const typed = new Int32Array([1, 2, 3, 4, 5]);
console.log(typed.length); // 5
console.log(typed.byteLength); // 20 (5 * 4 bytes)

// Map, filter, reduce work (return new typed array)
const doubled = typed.map(x => x * 2);
console.log(doubled); // Int32Array(5) [2, 4, 6, 8, 10]

// But push/pop don't work (fixed size)
// typed.push(6); // TypeError

// Subarray (shallow copy)
const sub = typed.subarray(1, 4);
console.log(sub); // Int32Array(3) [2, 3, 4]

// Set from another array
const target = new Int32Array(10);
target.set([1, 2, 3], 2); // Start at index 2
console.log(target); // [0, 0, 1, 2, 3, 0, 0, 0, 0, 0]
```

### ArrayBuffer
ArrayBuffer represents a generic, fixed-length raw binary data buffer.

```javascript
// Creating ArrayBuffer
const buffer = new ArrayBuffer(16); // 16 bytes
console.log(buffer.byteLength); // 16

// Can't directly access bytes
// buffer[0] = 1; // Doesn't work

// Need a view to access
const view = new Uint8Array(buffer);
view[0] = 255;
view[1] = 128;

// Multiple views can share same buffer
const int16View = new Int16Array(buffer);
int16View[0] = 0x1234; // Sets bytes 0 and 1

console.log(view[0].toString(16)); // '34'
console.log(view[1].toString(16)); // '12' (endianness matters!)

// Copying buffers
const buffer1 = new ArrayBuffer(8);
const view1 = new Uint8Array(buffer1);
view1.set([1, 2, 3, 4, 5, 6, 7, 8]);

const buffer2 = buffer1.slice(0); // Copy
const view2 = new Uint8Array(buffer2);

// Modify original
view1[0] = 255;
console.log(view2[0]); // Still 1 (different buffer)

// Transfer (moves ownership, original becomes detached)
const buffer3 = new ArrayBuffer(16);
const transferred = buffer3.transfer(); // New method
// buffer3.byteLength is now 0 (detached)
```

### DataView
DataView provides a low-level interface for reading and writing multiple number types in an ArrayBuffer.

```javascript
// Creating DataView
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);

// Writing different data types at specific byte offsets
view.setInt8(0, 127); // Write 8-bit signed integer at byte 0
view.setUint8(1, 255); // Write 8-bit unsigned integer at byte 1
view.setInt16(2, 32767); // Write 16-bit signed integer at byte 2
view.setUint32(4, 4294967295); // Write 32-bit unsigned integer at byte 4
view.setFloat64(8, 3.141592653589793); // Write 64-bit float at byte 8

// Reading back
console.log(view.getInt8(0)); // 127
console.log(view.getUint8(1)); // 255
console.log(view.getInt16(2)); // 32767
console.log(view.getUint32(4)); // 4294967295
console.log(view.getFloat64(8)); // 3.141592653589793

// Little-endian vs big-endian
view.setInt32(0, 0x12345678, false); // Big-endian (default)
console.log(view.getUint8(0).toString(16)); // '12'

view.setInt32(0, 0x12345678, true); // Little-endian
console.log(view.getUint8(0).toString(16)); // '78'

// Practical example: Parsing binary file format
function parsePNGHeader(buffer) {
  const view = new DataView(buffer);
  
  // Check PNG signature (first 8 bytes)
  const signature = [
    view.getUint8(0),  // 137
    view.getUint8(1),  // 80 (P)
    view.getUint8(2),  // 78 (N)
    view.getUint8(3),  // 71 (G)
    view.getUint8(4),  // 13 (CR)
    view.getUint8(5),  // 10 (LF)
    view.getUint8(6),  // 26 (EOF)
    view.getUint8(7)   // 10 (LF)
  ];
  
  const isPNG = signature[0] === 137 &&
                signature[1] === 80 &&
                signature[2] === 78 &&
                signature[3] === 71;
  
  if (!isPNG) {
    throw new Error('Not a PNG file');
  }
  
  // Read IHDR chunk (starts at byte 8)
  const chunkLength = view.getUint32(8, false); // Big-endian
  const chunkType = String.fromCharCode(
    view.getUint8(12),
    view.getUint8(13),
    view.getUint8(14),
    view.getUint8(15)
  );
  
  if (chunkType !== 'IHDR') {
    throw new Error('First chunk must be IHDR');
  }
  
  // Read image dimensions
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  const bitDepth = view.getUint8(24);
  const colorType = view.getUint8(25);
  
  return {
    width,
    height,
    bitDepth,
    colorType,
    compression: view.getUint8(26),
    filter: view.getUint8(27),
    interlace: view.getUint8(28)
  };
}
```

### Performance Differences vs Normal Arrays

```javascript
// Performance benchmark
function benchmark() {
  const size = 1000000;
  
  // Regular array
  console.time('Regular array creation');
  const regularArray = new Array(size);
  for (let i = 0; i < size; i++) {
    regularArray[i] = i;
  }
  console.timeEnd('Regular array creation');
  
  // Typed array
  console.time('Typed array creation');
  const typedArray = new Int32Array(size);
  for (let i = 0; i < size; i++) {
    typedArray[i] = i;
  }
  console.timeEnd('Typed array creation');
  
  // Iteration
  let sum = 0;
  console.time('Regular array iteration');
  for (let i = 0; i < size; i++) {
    sum += regularArray[i];
  }
  console.timeEnd('Regular array iteration');
  
  sum = 0;
  console.time('Typed array iteration');
  for (let i = 0; i < size; i++) {
    sum += typedArray[i];
  }
  console.timeEnd('Typed array iteration');
  
  // Mathematical operations
  console.time('Regular array map');
  const doubledRegular = regularArray.map(x => x * 2);
  console.timeEnd('Regular array map');
  
  console.time('Typed array map');
  const doubledTyped = typedArray.map(x => x * 2);
  console.timeEnd('Typed array map');
  
  // Memory usage
  console.log('\nMemory estimates:');
  console.log('Regular array:', Math.round((size * 8) / 1024), 'KB approx');
  console.log('Typed array:', Math.round((size * 4) / 1024), 'KB approx');
}

benchmark();

// Key differences:
/*
| Aspect               | Regular Array               | Typed Array                 |
|----------------------|-----------------------------|-----------------------------|
| Element types        | Any type                    | Single numeric type         |
| Memory               | More overhead               | Fixed, predictable          |
| Performance          | Good for general use        | Excellent for numeric ops   |
| Browser optimization | Optimized by JS engines     | Hardware accelerated        |
| Flexibility          | Dynamic size, mixed types   | Fixed size, single type     |
| Use cases            | General purpose             | Graphics, audio, binary I/O |
*/

// Real-world use cases for typed arrays:

// 1. Image processing
function applyBrightness(imageData, factor) {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    // RGB channels
    data[i] = Math.min(255, data[i] * factor);     // Red
    data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
    data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
    // Alpha channel (i + 3) unchanged
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

// 2. Audio processing
function processAudioBuffer(audioBuffer) {
  const channelData = audioBuffer.getChannelData(0); // Float32Array
  const processed = new Float32Array(channelData.length);
  
  // Apply gain
  const gain = 0.5;
  for (let i = 0; i < channelData.length; i++) {
    processed[i] = channelData[i] * gain;
  }
  
  return processed;
}

// 3. WebGL/WebGPU buffers
class GLBuffer {
  constructor(gl, data, type = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    
    gl.bindBuffer(type, this.buffer);
    
    // If data is a typed array, use it directly
    if (ArrayBuffer.isView(data)) {
      gl.bufferData(type, data, usage);
    } else {
      // Convert regular array to typed array
      const typedData = new Float32Array(data);
      gl.bufferData(type, typedData, usage);
    }
  }
  
  bind(type = this.gl.ARRAY_BUFFER) {
    this.gl.bindBuffer(type, this.buffer);
  }
}

// 4. Network protocol parsing
class BinaryProtocol {
  static parsePacket(buffer) {
    const view = new DataView(buffer);
    
    // Parse header
    const version = view.getUint8(0);
    const type = view.getUint8(1);
    const length = view.getUint16(2, true); // Little-endian
    
    // Parse payload based on type
    let payload;
    switch (type) {
      case 1: // Integer array
        payload = new Int32Array(buffer, 4, length / 4);
        break;
      case 2: // Float array
        payload = new Float32Array(buffer, 4, length / 4);
        break;
      case 3: // String
        const decoder = new TextDecoder();
        payload = decoder.decode(new Uint8Array(buffer, 4, length));
        break;
    }
    
    return { version, type, length, payload };
  }
  
  static createPacket(type, data) {
    let payloadBuffer;
    let payloadLength;
    
    switch (type) {
      case 1: // Integer array
        payloadBuffer = new Int32Array(data).buffer;
        payloadLength = data.length * 4;
        break;
      case 2: // Float array
        payloadBuffer = new Float32Array(data).buffer;
        payloadLength = data.length * 4;
        break;
      case 3: // String
        const encoder = new TextEncoder();
        const encoded = encoder.encode(data);
        payloadBuffer = encoded.buffer;
        payloadLength = encoded.length;
        break;
    }
    
    const header = new ArrayBuffer(4);
    const headerView = new DataView(header);
    headerView.setUint8(0, 1); // Version
    headerView.setUint8(1, type);
    headerView.setUint16(2, payloadLength, true); // Little-endian
    
    // Combine header and payload
    const packet = new Uint8Array(header.byteLength + payloadLength);
    packet.set(new Uint8Array(header), 0);
    packet.set(new Uint8Array(payloadBuffer), 4);
    
    return packet.buffer;
  }
}
```

---

## Practical OOP / DS Implementations

### Custom Stack using Class

```javascript
class Stack {
  constructor() {
    this.items = [];
    this.count = 0;
  }
  
  // Push element onto stack
  push(element) {
    this.items[this.count] = element;
    this.count++;
    return this;
  }
  
  // Pop element from stack
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    this.count--;
    const removed = this.items[this.count];
    delete this.items[this.count];
    return removed;
  }
  
  // Peek at top element without removing
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    return this.items[this.count - 1];
  }
  
  // Check if stack is empty
  isEmpty() {
    return this.count === 0;
  }
  
  // Get stack size
  size() {
    return this.count;
  }
  
  // Clear stack
  clear() {
    this.items = [];
    this.count = 0;
    return this;
  }
  
  // Convert stack to array
  toArray() {
    return this.items.slice(0, this.count);
  }
  
  // Print stack (for debugging)
  print() {
    console.log(this.toArray().join(' -> '));
  }
  
  // Iterator support
  [Symbol.iterator]() {
    let index = this.count - 1;
    
    return {
      next: () => {
        if (index >= 0) {
          return { value: this.items[index--], done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Search for element
  search(element) {
    for (let i = this.count - 1; i >= 0; i--) {
      if (this.items[i] === element) {
        return this.count - 1 - i; // Position from top
      }
    }
    return -1;
  }
}

// Advanced Stack with capacity limit
class BoundedStack extends Stack {
  constructor(capacity) {
    super();
    this.capacity = capacity;
  }
  
  push(element) {
    if (this.isFull()) {
      throw new Error('Stack overflow');
    }
    
    return super.push(element);
  }
  
  isFull() {
    return this.size() >= this.capacity;
  }
  
  getCapacity() {
    return this.capacity;
  }
}

// Stack usage examples
console.log('=== Stack Implementation ===');
const stack = new Stack();

stack.push(10).push(20).push(30);
console.log('Stack:', stack.toArray()); // [10, 20, 30]
console.log('Size:', stack.size()); // 3
console.log('Peek:', stack.peek()); // 30
console.log('Pop:', stack.pop()); // 30
console.log('After pop:', stack.toArray()); // [10, 20]
console.log('Is empty?', stack.isEmpty()); // false
console.log('Search 10:', stack.search(10)); // 1 (position from top)

// Using iterator
for (const item of stack) {
  console.log('Iterating:', item); // 20, then 10
}

// Bounded stack
const boundedStack = new BoundedStack(2);
boundedStack.push(1).push(2);
// boundedStack.push(3); // Error: Stack overflow

// Practical use cases
function reverseString(str) {
  const stack = new Stack();
  
  // Push all characters
  for (const char of str) {
    stack.push(char);
  }
  
  // Pop all characters (reverse order)
  let reversed = '';
  while (!stack.isEmpty()) {
    reversed += stack.pop();
  }
  
  return reversed;
}

console.log('Reversed "hello":', reverseString('hello')); // 'olleh'

function isBalancedParentheses(expression) {
  const stack = new Stack();
  const pairs = {
    '(': ')',
    '[': ']',
    '{': '}'
  };
  
  for (const char of expression) {
    if (pairs[char]) {
      // Opening bracket
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      // Closing bracket
      if (stack.isEmpty() || pairs[stack.pop()] !== char) {
        return false;
      }
    }
  }
  
  return stack.isEmpty();
}

console.log('Balanced "({[]})":', isBalancedParentheses('({[]})')); // true
console.log('Balanced "({[})":', isBalancedParentheses('({[})')); // false
```

### Custom Queue using Class

```javascript
class Queue {
  constructor() {
    this.items = [];
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }
  
  // Enqueue element
  enqueue(element) {
    this.items[this.rear] = element;
    this.rear++;
    this.size++;
    return this;
  }
  
  // Dequeue element
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    const removed = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    this.size--;
    
    // Reset if queue is empty
    if (this.isEmpty()) {
      this.front = 0;
      this.rear = 0;
    }
    
    return removed;
  }
  
  // Peek at front element
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    return this.items[this.front];
  }
  
  // Check if queue is empty
  isEmpty() {
    return this.size === 0;
  }
  
  // Get queue size
  getSize() {
    return this.size;
  }
  
  // Clear queue
  clear() {
    this.items = [];
    this.front = 0;
    this.rear = 0;
    this.size = 0;
    return this;
  }
  
  // Convert to array
  toArray() {
    return this.items.slice(this.front, this.rear);
  }
  
  // Print queue
  print() {
    console.log(this.toArray().join(' <- '));
  }
  
  // Iterator support
  [Symbol.iterator]() {
    let index = this.front;
    
    return {
      next: () => {
        if (index < this.rear) {
          return { value: this.items[index++], done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Search for element
  search(element) {
    for (let i = this.front; i < this.rear; i++) {
      if (this.items[i] === element) {
        return i - this.front;
      }
    }
    return -1;
  }
}

// Circular Queue (fixed size)
class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }
  
  enqueue(element) {
    if (this.isFull()) {
      throw new Error('Queue is full');
    }
    
    this.items[this.rear] = element;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
    return this;
  }
  
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    const removed = this.items[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return removed;
  }
  
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    return this.items[this.front];
  }
  
  isEmpty() {
    return this.size === 0;
  }
  
  isFull() {
    return this.size === this.capacity;
  }
  
  getSize() {
    return this.size;
  }
  
  clear() {
    this.items = new Array(this.capacity);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }
  
  toArray() {
    const result = [];
    for (let i = 0; i < this.size; i++) {
      const index = (this.front + i) % this.capacity;
      result.push(this.items[index]);
    }
    return result;
  }
}

// Priority Queue
class PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.items = [];
    this.comparator = comparator;
  }
  
  enqueue(element, priority = element) {
    const item = { element, priority };
    
    // Find correct position (binary search would be more efficient)
    let inserted = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.comparator(priority, this.items[i].priority) < 0) {
        this.items.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
    
    if (!inserted) {
      this.items.push(item);
    }
    
    return this;
  }
  
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    return this.items.shift().element;
  }
  
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    
    return this.items[0].element;
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  getSize() {
    return this.items.length;
  }
  
  clear() {
    this.items = [];
  }
  
  toArray() {
    return this.items.map(item => item.element);
  }
}

// Queue usage examples
console.log('\n=== Queue Implementation ===');
const queue = new Queue();

queue.enqueue(10).enqueue(20).enqueue(30);
console.log('Queue:', queue.toArray()); // [10, 20, 30]
console.log('Size:', queue.getSize()); // 3
console.log('Peek:', queue.peek()); // 10
console.log('Dequeue:', queue.dequeue()); // 10
console.log('After dequeue:', queue.toArray()); // [20, 30]

// Circular queue
const circularQueue = new CircularQueue(3);
circularQueue.enqueue(1).enqueue(2).enqueue(3);
console.log('Circular queue full?', circularQueue.isFull()); // true
console.log('Circular queue:', circularQueue.toArray()); // [1, 2, 3]
circularQueue.dequeue();
circularQueue.enqueue(4);
console.log('After operations:', circularQueue.toArray()); // [2, 3, 4]

// Priority queue
const priorityQueue = new PriorityQueue();
priorityQueue.enqueue('Low priority task', 3);
priorityQueue.enqueue('High priority task', 1);
priorityQueue.enqueue('Medium priority task', 2);

console.log('Priority queue dequeue order:');
while (!priorityQueue.isEmpty()) {
  console.log(priorityQueue.dequeue());
}
// High -> Medium -> Low

// Practical use cases
class TaskScheduler {
  constructor() {
    this.taskQueue = new Queue();
    this.running = false;
  }
  
  addTask(task) {
    this.taskQueue.enqueue(task);
    if (!this.running) {
      this.processNext();
    }
  }
  
  async processNext() {
    if (this.taskQueue.isEmpty()) {
      this.running = false;
      return;
    }
    
    this.running = true;
    const task = this.taskQueue.dequeue();
    
    try {
      await task();
    } catch (error) {
      console.error('Task failed:', error);
    }
    
    // Process next task
    this.processNext();
  }
}

// Breadth-first search example
function bfs(graph, start) {
  const queue = new Queue();
  const visited = new Set();
  const result = [];
  
  queue.enqueue(start);
  visited.add(start);
  
  while (!queue.isEmpty()) {
    const node = queue.dequeue();
    result.push(node);
    
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue(neighbor);
      }
    }
  }
  
  return result;
}

const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [],
  E: ['F'],
  F: []
};

console.log('BFS traversal:', bfs(graph, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F']
```

### Custom HashMap Implementation

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
  #hash(key) {
    let hash = 0;
    const keyString = String(key);
    
    for (let i = 0; i < keyString.length; i++) {
      hash = (hash << 5) - hash + keyString.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    
    return Math.abs(hash) % this.capacity;
  }
  
  // Create entry
  #createEntry(key, value) {
    return { key, value, next: null };
  }
  
  // Resize buckets if needed
  #resize() {
    if (this.size < this.threshold) return;
    
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.threshold = Math.floor(this.capacity * this.loadFactor);
    this.buckets = new Array(this.capacity);
    this.size = 0;
    
    // Rehash all entries
    for (const bucket of oldBuckets) {
      let current = bucket;
      while (current) {
        this.set(current.key, current.value);
        current = current.next;
      }
    }
  }
  
  // Set key-value pair
  set(key, value) {
    this.#resize();
    
    const index = this.#hash(key);
    
    if (!this.buckets[index]) {
      // Empty bucket
      this.buckets[index] = this.#createEntry(key, value);
      this.size++;
      return this;
    }
    
    // Collision - traverse linked list
    let current = this.buckets[index];
    let prev = null;
    
    while (current) {
      if (current.key === key) {
        // Update existing key
        current.value = value;
        return this;
      }
      prev = current;
      current = current.next;
    }
    
    // Key not found, add to end of chain
    prev.next = this.#createEntry(key, value);
    this.size++;
    return this;
  }
  
  // Get value by key
  get(key) {
    const index = this.#hash(key);
    let current = this.buckets[index];
    
    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    
    return undefined;
  }
  
  // Check if key exists
  has(key) {
    return this.get(key) !== undefined;
  }
  
  // Delete key-value pair
  delete(key) {
    const index = this.#hash(key);
    
    if (!this.buckets[index]) {
      return false;
    }
    
    let current = this.buckets[index];
    let prev = null;
    
    while (current) {
      if (current.key === key) {
        if (prev) {
          // Remove from middle/end
          prev.next = current.next;
        } else {
          // Remove from head
          this.buckets[index] = current.next;
        }
        
        this.size--;
        return true;
      }
      
      prev = current;
      current = current.next;
    }
    
    return false;
  }
  
  // Clear all entries
  clear() {
    this.buckets = new Array(this.capacity);
    this.size = 0;
    return this;
  }
  
  // Get all keys
  keys() {
    const keys = [];
    
    for (const bucket of this.buckets) {
      let current = bucket;
      while (current) {
        keys.push(current.key);
        current = current.next;
      }
    }
    
    return keys;
  }
  
  // Get all values
  values() {
    const values = [];
    
    for (const bucket of this.buckets) {
      let current = bucket;
      while (current) {
        values.push(current.value);
        current = current.next;
      }
    }
    
    return values;
  }
  
  // Get all entries
  entries() {
    const entries = [];
    
    for (const bucket of this.buckets) {
      let current = bucket;
      while (current) {
        entries.push([current.key, current.value]);
        current = current.next;
      }
    }
    
    return entries;
  }
  
  // Get size
  getSize() {
    return this.size;
  }
  
  // Get capacity
  getCapacity() {
    return this.capacity;
  }
  
  // Get load factor
  getLoadFactor() {
    return this.loadFactor;
  }
  
  // Calculate actual load
  getActualLoad() {
    return this.size / this.capacity;
  }
  
  // Iterator support
  [Symbol.iterator]() {
    const entries = this.entries();
    let index = 0;
    
    return {
      next: () => {
        if (index < entries.length) {
          return { value: entries[index++], done: false };
        }
        return { done: true };
      }
    };
  }
  
  // ForEach support
  forEach(callback) {
    for (const [key, value] of this) {
      callback(value, key, this);
    }
  }
}

// Enhanced HashMap with better hash function
class EnhancedHashMap extends HashMap {
  #hash(key) {
    if (typeof key === 'number') {
      return key % this.capacity;
    }
    
    if (typeof key === 'string') {
      let hash = 5381;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) + hash + key.charCodeAt(i);
      }
      return Math.abs(hash) % this.capacity;
    }
    
    if (typeof key === 'object' && key !== null) {
      // Use object reference as hash (not ideal but works for demo)
      return Math.abs(key.toString().length) % this.capacity;
    }
    
    return super.#hash(key);
  }
}

// HashMap usage examples
console.log('\n=== HashMap Implementation ===');
const map = new HashMap(8);

// Basic operations
map.set('name', 'John');
map.set('age', 30);
map.set('city', 'New York');
map.set('occupation', 'Developer');

console.log('Size:', map.getSize()); // 4
console.log('Capacity:', map.getCapacity()); // 16 (doubled from 8)
console.log('Load factor:', map.getActualLoad()); // ~0.25

console.log('Get name:', map.get('name')); // 'John'
console.log('Has age?', map.has('age')); // true
console.log('Has gender?', map.has('gender')); // false

// Collision test
for (let i = 0; i < 100; i++) {
  map.set(`key${i}`, `value${i}`);
}
console.log('After adding 100 items, size:', map.getSize());

// Delete
map.delete('name');
console.log('After delete, has name?', map.has('name')); // false

// Iteration
console.log('Keys:', map.keys().slice(0, 5)); // First 5 keys
console.log('Values:', map.values().slice(0, 5)); // First 5 values

for (const [key, value] of map) {
  if (key.startsWith('key0')) {
    console.log(`Entry: ${key} = ${value}`);
  }
}

// Performance comparison
function benchmarkHashMap() {
  const size = 10000;
  const customMap = new HashMap();
  const nativeMap = new Map();
  
  console.time('Custom HashMap set');
  for (let i = 0; i < size; i++) {
    customMap.set(`key${i}`, `value${i}`);
  }
  console.timeEnd('Custom HashMap set');
  
  console.time('Native Map set');
  for (let i = 0; i < size; i++) {
    nativeMap.set(`key${i}`, `value${i}`);
  }
  console.timeEnd('Native Map set');
  
  console.time('Custom HashMap get');
  for (let i = 0; i < size; i++) {
    customMap.get(`key${i}`);
  }
  console.timeEnd('Custom HashMap get');
  
  console.time('Native Map get');
  for (let i = 0; i < size; i++) {
    nativeMap.get(`key${i}`);
  }
  console.timeEnd('Native Map get');
}

// Practical use cases
class Cache {
  constructor(maxSize = 100, ttl = 60000) {
    this.cache = new HashMap();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.accessOrder = [];
  }
  
  set(key, value) {
    // Remove oldest if at max size
    if (this.cache.getSize() >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
    
    // Update access order
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }
  
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) return undefined;
    
    // Check expiry
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      return undefined;
    }
    
    // Update access order
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }
    
    return cached.value;
  }
  
  delete(key) {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }
  
  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }
  
  size() {
    return this.cache.getSize();
  }
}

// Word frequency counter using HashMap
function wordFrequency(text) {
  const freq = new HashMap();
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  
  return freq;
}

const sampleText = "the quick brown fox jumps over the lazy dog the quick brown fox";
const frequencies = wordFrequency(sampleText);

console.log('\nWord frequencies:');
for (const [word, count] of frequencies) {
  console.log(`${word}: ${count}`);
}
```

### Custom LinkedList Class

```javascript
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
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
    const newNode = new ListNode(value, this.head);
    this.head = newNode;
    
    if (!this.tail) {
      this.tail = newNode;
    }
    
    this.length++;
    return this;
  }
  
  // Insert at index
  insertAt(index, value) {
    if (index < 0 || index > this.length) {
      throw new Error('Index out of bounds');
    }
    
    if (index === 0) {
      return this.prepend(value);
    }
    
    if (index === this.length) {
      return this.append(value);
    }
    
    const prev = this.#traverseToIndex(index - 1);
    const newNode = new ListNode(value, prev.next);
    prev.next = newNode;
    this.length++;
    
    return this;
  }
  
  // Get value at index
  getAt(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    
    const node = this.#traverseToIndex(index);
    return node.value;
  }
  
  // Remove from end
  removeLast() {
    if (!this.head) {
      return undefined;
    }
    
    if (this.length === 1) {
      const value = this.head.value;
      this.head = null;
      this.tail = null;
      this.length = 0;
      return value;
    }
    
    const prev = this.#traverseToIndex(this.length - 2);
    const value = this.tail.value;
    prev.next = null;
    this.tail = prev;
    this.length--;
    
    return value;
  }
  
  // Remove from beginning
  removeFirst() {
    if (!this.head) {
      return undefined;
    }
    
    const value = this.head.value;
    this.head = this.head.next;
    
    if (!this.head) {
      this.tail = null;
    }
    
    this.length--;
    return value;
  }
  
  // Remove at index
  removeAt(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    
    if (index === 0) {
      return this.removeFirst();
    }
    
    if (index === this.length - 1) {
      return this.removeLast();
    }
    
    const prev = this.#traverseToIndex(index - 1);
    const value = prev.next.value;
    prev.next = prev.next.next;
    this.length--;
    
    return value;
  }
  
  // Remove by value (first occurrence)
  remove(value) {
    if (!this.head) {
      return false;
    }
    
    if (this.head.value === value) {
      this.removeFirst();
      return true;
    }
    
    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
      if (!current.next) {
        this.tail = current;
      }
      this.length--;
      return true;
    }
    
    return false;
  }
  
  // Check if contains value
  contains(value) {
    return this.indexOf(value) !== -1;
  }
  
  // Find index of value
  indexOf(value) {
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
  
  // Reverse linked list
  reverse() {
    if (this.length <= 1) {
      return this;
    }
    
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
  
  // Get size
  size() {
    return this.length;
  }
  
  // Check if empty
  isEmpty() {
    return this.length === 0;
  }
  
  // Clear list
  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    return this;
  }
  
  // Convert to array
  toArray() {
    const array = [];
    let current = this.head;
    
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    
    return array;
  }
  
  // Print list
  print() {
    console.log(this.toArray().join(' -> '));
  }
  
  // Iterator support
  [Symbol.iterator]() {
    let current = this.head;
    
    return {
      next: () => {
        if (current) {
          const value = current.value;
          current = current.next;
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
  
  // Helper: Traverse to index
  #traverseToIndex(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index out of bounds');
    }
    
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    
    return current;
  }
  
  // Find middle node
  findMiddle() {
    if (!this.head) {
      return undefined;
    }
    
    let slow = this.head;
    let fast = this.head;
    
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    
    return slow.value;
  }
  
  // Detect cycle (Floyd's cycle detection)
  hasCycle() {
    if (!this.head) {
      return false;
    }
    
    let slow = this.head;
    let fast = this.head;
    
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
      
      if (slow === fast) {
        return true;
      }
    }
    
    return false;
  }
  
  // Create cycle for testing
  createCycle(pos) {
    if (pos < 0 || pos >= this.length) {
      throw new Error('Invalid position for cycle');
    }
    
    const node = this.#traverseToIndex(pos);
    this.tail.next = node;
    return this;
  }
}

// Doubly Linked List
class DoublyListNode {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  append(value) {
    const newNode = new DoublyListNode(value, this.tail);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail.next = newNode;
    }
    
    this.tail = newNode;
    this.length++;
    return this;
  }
  
  prepend(value) {
    const newNode = new DoublyListNode(value, null, this.head);
    
    if (this.head) {
      this.head.prev = newNode;
    } else {
      this.tail = newNode;
    }
    
    this.head = newNode;
    this.length++;
    return this;
  }
  
  // Other methods similar to singly linked list but with prev pointers
  
  // Remove node
  removeNode(node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    
    this.length--;
    return node.value;
  }
  
  // Move to front (for LRU cache)
  moveToFront(node) {
    if (node === this.head) {
      return;
    }
    
    // Remove from current position
    this.removeNode(node);
    
    // Add to front
    node.next = this.head;
    node.prev = null;
    
    if (this.head) {
      this.head.prev = node;
    }
    
    this.head = node;
    
    if (!this.tail) {
      this.tail = node;
    }
    
    this.length++;
  }
}

// LinkedList usage examples
console.log('\n=== LinkedList Implementation ===');
const list = new LinkedList();

list.append(10).append(20).append(30).prepend(5);
console.log('List:', list.toArray()); // [5, 10, 20, 30]
console.log('Size:', list.size()); // 4
console.log('Head:', list.head.value); // 5
console.log('Tail:', list.tail.value); // 30

list.insertAt(2, 15);
console.log('After insert at index 2:', list.toArray()); // [5, 10, 15, 20, 30]

console.log('Get at index 3:', list.getAt(3)); // 20
console.log('Index of 15:', list.indexOf(15)); // 2
console.log('Contains 25?', list.contains(25)); // false

list.removeFirst();
console.log('After remove first:', list.toArray()); // [10, 15, 20, 30]

list.removeLast();
console.log('After remove last:', list.toArray()); // [10, 15, 20]

list.reverse();
console.log('After reverse:', list.toArray()); // [20, 15, 10]

console.log('Middle node:', list.findMiddle()); // 15

// Iterator
console.log('Iterating:');
for (const value of list) {
  console.log(value); // 20, 15, 10
}

// Cycle detection
console.log('Has cycle?', list.hasCycle()); // false
list.createCycle(1); // Create cycle from tail to index 1
console.log('Has cycle after creating?', list.hasCycle()); // true

// Practical use cases
class LRUCacheLinkedList {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.list = new DoublyLinkedList();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    const node = this.cache.get(key);
    this.list.moveToFront(node);
    return node.value.value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value.value = value;
      this.list.moveToFront(node);
      return;
    }
    
    if (this.list.size() >= this.capacity) {
      const lruNode = this.list.tail;
      if (lruNode) {
        this.cache.delete(lruNode.value.key);
        this.list.removeNode(lruNode);
      }
    }
    
    const newNode = this.list.prepend({ key, value });
    this.cache.set(key, newNode);
  }
  
  display() {
    const items = [];
    let current = this.list.head;
    
    while (current) {
      items.push(`${current.value.key}:${current.value.value}`);
      current = current.next;
    }
    
    console.log(items.join(' <-> '));
  }
}

console.log('\n=== LRU Cache with LinkedList ===');
const lru = new LRUCacheLinkedList(3);
lru.put('a', 1);
lru.put('b', 2);
lru.put('c', 3);
lru.display(); // c:3 <-> b:2 <-> a:1

lru.get('a'); // Moves a to front
lru.display(); // a:1 <-> c:3 <-> b:2

lru.put('d', 4); // Removes b (LRU)
lru.display(); // d:4 <-> a:1 <-> c:3

// Polynomial representation
class Polynomial {
  constructor() {
    this.terms = new LinkedList();
  }
  
  addTerm(coefficient, exponent) {
    if (coefficient === 0) return;
    
    // Insert in descending order of exponent
    let current = this.terms.head;
    let prev = null;
    let index = 0;
    
    while (current && current.value.exponent > exponent) {
      prev = current;
      current = current.next;
      index++;
    }
    
    if (current && current.value.exponent === exponent) {
      // Combine like terms
      current.value.coefficient += coefficient;
      if (current.value.coefficient === 0) {
        this.terms.removeAt(index);
      }
    } else {
      // Insert new term
      const term = { coefficient, exponent };
      if (prev === null) {
        this.terms.prepend(term);
      } else {
        this.terms.insertAt(index, term);
      }
    }
  }
  
  add(other) {
    const result = new Polynomial();
    
    // Add all terms from this polynomial
    for (const term of this.terms) {
      result.addTerm(term.coefficient, term.exponent);
    }
    
    // Add all terms from other polynomial
    for (const term of other.terms) {
      result.addTerm(term.coefficient, term.exponent);
    }
    
    return result;
  }
  
  toString() {
    const terms = [];
    
    for (const term of this.terms) {
      const { coefficient, exponent } = term;
      
      if (coefficient === 0) continue;
      
      let termStr = '';
      
      if (terms.length === 0) {
        termStr = coefficient.toString();
      } else {
        termStr = coefficient > 0 ? `+ ${coefficient}` : `- ${-coefficient}`;
      }
      
      if (exponent === 1) {
        termStr += 'x';
      } else if (exponent > 1) {
        termStr += `x^${exponent}`;
      }
      
      terms.push(termStr);
    }
    
    return terms.join(' ') || '0';
  }
}

const poly1 = new Polynomial();
poly1.addTerm(3, 2); // 3x^2
poly1.addTerm(2, 1); // 2x
poly1.addTerm(1, 0); // 1

const poly2 = new Polynomial();
poly2.addTerm(1, 2); // x^2
poly2.addTerm(-2, 1); // -2x
poly2.addTerm(3, 0); // 3

const sum = poly1.add(poly2);
console.log(`(${poly1.toString()}) + (${poly2.toString()}) = ${sum.toString()}`);
// (3x^2 + 2x + 1) + (x^2 - 2x + 3) = 4x^2 + 4
```

### Implement EventEmitter using Class

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;
    this.warned = false;
  }
  
  // Add event listener
  on(eventName, listener, options = {}) {
    this.validateListener(listener);
    
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const listeners = this.events.get(eventName);
    const listenerObj = {
      fn: listener,
      once: options.once || false,
      prepend: options.prepend || false
    };
    
    // Check for max listeners
    this.checkMaxListeners(eventName, listeners);
    
    if (listenerObj.prepend) {
      listeners.unshift(listenerObj);
    } else {
      listeners.push(listenerObj);
    }
    
    return this;
  }
  
  // Add one-time listener
  once(eventName, listener) {
    return this.on(eventName, listener, { once: true });
  }
  
  // Prepend listener
  prependListener(eventName, listener) {
    return this.on(eventName, listener, { prepend: true });
  }
  
  // Prepend one-time listener
  prependOnceListener(eventName, listener) {
    return this.on(eventName, listener, { once: true, prepend: true });
  }
  
  // Remove event listener
  off(eventName, listener) {
    if (!this.events.has(eventName)) {
      return this;
    }
    
    const listeners = this.events.get(eventName);
    
    if (!listener) {
      // Remove all listeners for this event
      this.events.delete(eventName);
      return this;
    }
    
    // Find and remove specific listener
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i].fn === listener) {
        listeners.splice(i, 1);
      }
    }
    
    // Clean up empty arrays
    if (listeners.length === 0) {
      this.events.delete(eventName);
    }
    
    return this;
  }
  
  // Emit event
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) {
      // Special handling for error events
      if (eventName === 'error') {
        const error = args[0] instanceof Error ? args[0] : new Error(String(args[0]));
        throw error;
      }
      return false;
    }
    
    const listeners = this.events.get(eventName).slice(); // Copy to avoid mutation during iteration
    const onceListeners = [];
    
    for (const listenerObj of listeners) {
      try {
        listenerObj.fn.apply(this, args);
      } catch (error) {
        // Emit error event if listener throws
        this.emit('error', error);
      }
      
      if (listenerObj.once) {
        onceListeners.push(listenerObj.fn);
      }
    }
    
    // Remove once listeners
    for (const listener of onceListeners) {
      this.off(eventName, listener);
    }
    
    return true;
  }
  
  // Get all listeners for an event
  listeners(eventName) {
    if (!this.events.has(eventName)) {
      return [];
    }
    
    return this.events.get(eventName).map(obj => obj.fn);
  }
  
  // Get raw listeners (including once status)
  rawListeners(eventName) {
    if (!this.events.has(eventName)) {
      return [];
    }
    
    return this.events.get(eventName).slice();
  }
  
  // Get listener count
  listenerCount(eventName) {
    if (!this.events.has(eventName)) {
      return 0;
    }
    
    return this.events.get(eventName).length;
  }
  
  // Remove all listeners
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
    
    return this;
  }
  
  // Set maximum listeners
  setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
      throw new TypeError('n must be a positive number');
    }
    
    this.maxListeners = n;
    return this;
  }
  
  // Get maximum listeners
  getMaxListeners() {
    return this.maxListeners;
  }
  
  // Get event names
  eventNames() {
    return Array.from(this.events.keys());
  }
  
  // Add alias for removeListener
  removeListener(eventName, listener) {
    return this.off(eventName, listener);
  }
  
  // Async emit that returns promises for all listeners
  async emitAsync(eventName, ...args) {
    if (!this.events.has(eventName)) {
      return [];
    }
    
    const listeners = this.events.get(eventName);
    const results = [];
    const onceListeners = [];
    
    for (const listenerObj of listeners) {
      try {
        const result = await listenerObj.fn.apply(this, args);
        results.push(result);
      } catch (error) {
        this.emit('error', error);
        results.push(Promise.reject(error));
      }
      
      if (listenerObj.once) {
        onceListeners.push(listenerObj.fn);
      }
    }
    
    // Clean up once listeners
    for (const listener of onceListeners) {
      this.off(eventName, listener);
    }
    
    return results;
  }
  
  // Wait for event (returns a promise)
  waitFor(eventName, timeout = 0) {
    return new Promise((resolve, reject) => {
      let timeoutId;
      
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          this.off(eventName, listener);
          reject(new Error(`Timeout waiting for event "${eventName}"`));
        }, timeout);
      }
      
      const listener = (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(args.length === 1 ? args[0] : args);
      };
      
      this.once(eventName, listener);
    });
  }
  
  // Private helper methods
  validateListener(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
  }
  
  checkMaxListeners(eventName, listeners) {
    if (listeners.length >= this.maxListeners && !this.warned) {
      console.warn(
        `Possible memory leak detected. ${listeners.length} listeners added for event "${eventName}". ` +
        `Use emitter.setMaxListeners() to increase limit.`
      );
      this.warned = true;
    }
  }
}

// Enhanced EventEmitter with advanced features
class EnhancedEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.defaultMaxListeners = 10;
  }
  
  // Chain multiple emitters
  pipe(eventName, targetEmitter, targetEventName = eventName) {
    return this.on(eventName, (...args) => {
      targetEmitter.emit(targetEventName, ...args);
    });
  }
  
  // Forward events from another emitter
  forward(sourceEmitter, eventName, targetEventName = eventName) {
    return sourceEmitter.on(eventName, (...args) => {
      this.emit(targetEventName, ...args);
    });
  }
  
  // Debounced emit
  debouncedEmit(eventName, wait) {
    let timeout;
    let lastArgs;
    
    return (...args) => {
      lastArgs = args;
      
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(() => {
        this.emit(eventName, ...lastArgs);
        timeout = null;
      }, wait);
    };
  }
  
  // Throttled emit
  throttledEmit(eventName, limit) {
    let lastCall = 0;
    let timeout;
    let lastArgs;
    
    return (...args) => {
      const now = Date.now();
      lastArgs = args;
      
      if (now - lastCall >= limit) {
        // Enough time has passed
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        
        this.emit(eventName, ...args);
        lastCall = now;
      } else if (!timeout) {
        // Schedule for remaining time
        timeout = setTimeout(() => {
          this.emit(eventName, ...lastArgs);
          timeout = null;
          lastCall = Date.now();
        }, limit - (now - lastCall));
      }
    };
  }
  
  // Batch events
  batchEvents(eventName, timeout = 0) {
    let batch = [];
    let batchTimeout;
    
    const flush = () => {
      if (batch.length > 0) {
        this.emit(eventName, batch);
        batch = [];
      }
      batchTimeout = null;
    };
    
    return (data) => {
      batch.push(data);
      
      if (!batchTimeout) {
        batchTimeout = setTimeout(flush, timeout);
      }
    };
  }
}

// EventEmitter usage examples
console.log('\n=== EventEmitter Implementation ===');
const emitter = new EnhancedEventEmitter();

// Basic event handling
emitter.on('data', (chunk) => {
  console.log('Received data chunk:', chunk);
});

emitter.once('connect', () => {
  console.log('Connected! (once)');
});

emitter.emit('data', 'Hello');
emitter.emit('data', 'World');
emitter.emit('connect');
emitter.emit('connect'); // Won't trigger (once listener)

// Error handling
emitter.on('error', (error) => {
  console.error('Emitter error:', error.message);
});

emitter.on('test', () => {
  throw new Error('Something went wrong');
});

emitter.emit('test'); // Triggers error event

// Async events
emitter.on('async', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('Processed async:', data);
});

emitter.emitAsync('async', 'test data').then(() => {
  console.log('All async listeners completed');
});

// Wait for event
setTimeout(() => {
  emitter.emit('ready', { status: 'ok' });
}, 1000);

emitter.waitFor('ready', 2000)
  .then(result => {
    console.log('Ready with:', result);
  })
  .catch(error => {
    console.error('Timeout:', error.message);
  });

// Piping events
const source = new EnhancedEventEmitter();
const target = new EnhancedEventEmitter();

source.pipe('update', target);
target.on('update', (data) => {
  console.log('Target received update:', data);
});

source.emit('update', { version: '1.0' });

// Debounced emit
const debouncedUpdate = emitter.debouncedEmit('debounced', 300);
debouncedUpdate('Call 1');
debouncedUpdate('Call 2');
debouncedUpdate('Call 3'); // Only this one will emit after 300ms

emitter.on('debounced', (data) => {
  console.log('Debounced:', data);
});

// Batch events
const batchUpdate = emitter.batchEvents('batch', 500);
emitter.on('batch', (batch) => {
  console.log('Batch received:', batch);
});

batchUpdate('item1');
batchUpdate('item2');
batchUpdate('item3');
// All three will be emitted together after 500ms

// Practical application: API client with events
class APIClient extends EnhancedEventEmitter {
  constructor(baseURL) {
    super();
    this.baseURL = baseURL;
    this.requestCount = 0;
  }
  
  async request(endpoint, options = {}) {
    this.emit('request:start', { endpoint, options });
    
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      this.emit('request:success', { endpoint, data });
      this.emit(`request:success:${endpoint}`, data);
      
      return data;
    } catch (error) {
      this.emit('request:error', { endpoint, error });
      this.emit(`request:error:${endpoint}`, error);
      throw error;
    } finally {
      this.requestCount++;
      this.emit('request:complete', { endpoint });
    }
  }
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

// Usage
const api = new APIClient('https://api.example.com');

// Log all requests
api.on('request:start', ({ endpoint }) => {
  console.log(`Starting request to ${endpoint}`);
});

api.on('request:success', ({ endpoint, data }) => {
  console.log(`Request to ${endpoint} succeeded`);
});

api.on('request:error', ({ endpoint, error }) => {
  console.error(`Request to ${endpoint} failed:`, error.message);
});

// Specific endpoint handling
api.on('request:success:/users', (users) => {
  console.log(`Got ${users.length} users`);
});

// In a real app:
// api.get('/users').then(users => console.log(users));
```

### Create Your Own Promise Class (Interview-Level)

```javascript
// Promise states
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    const resolve = (value) => {
      if (this.state !== PENDING) return;
      
      // Handle thenable objects
      if (value && typeof value.then === 'function') {
        value.then(resolve, reject);
        return;
      }
      
      this.state = FULFILLED;
      this.value = value;
      
      // Execute all callbacks
      this.onFulfilledCallbacks.forEach(callback => callback(this.value));
      this.onFulfilledCallbacks = [];
    };
    
    const reject = (reason) => {
      if (this.state !== PENDING) return;
      
      this.state = REJECTED;
      this.reason = reason;
      
      // Execute all callbacks
      this.onRejectedCallbacks.forEach(callback => callback(this.reason));
      this.onRejectedCallbacks = [];
    };
    
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    // Ensure callbacks are functions
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
    
    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      
      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      
      if (this.state === FULFILLED) {
        handleFulfilled();
      } else if (this.state === REJECTED) {
        handleRejected();
      } else { // PENDING
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
    
    return promise2;
  }
  
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  
  finally(onFinally) {
    return this.then(
      value => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
    );
  }
  
  // Promise resolution procedure
  resolvePromise(promise2, x, resolve, reject) {
    // Prevent circular reference
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected'));
    }
    
    let called = false;
    
    if (x && (typeof x === 'object' || typeof x === 'function')) {
      try {
        const then = x.then;
        
        if (typeof then === 'function') {
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  }
  
  // Static methods
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    
    return new MyPromise(resolve => {
      resolve(value);
    });
  }
  
  static reject(reason) {
    return new MyPromise((_, reject) => {
      reject(reason);
    });
  }
  
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      if (promises.length === 0) {
        return resolve([]);
      }
      
      const results = new Array(promises.length);
      let completed = 0;
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value;
            completed++;
            
            if (completed === promises.length) {
              resolve(results);
            }
          },
          reject // Reject immediately on any error
        );
      });
    });
  }
  
  static allSettled(promises) {
    return new MyPromise((resolve) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      if (promises.length === 0) {
        return resolve([]);
      }
      
      const results = new Array(promises.length);
      let completed = 0;
      
      const processResult = (index, status, valueOrReason) => {
        results[index] = status === FULFILLED ? 
          { status, value: valueOrReason } : 
          { status, reason: valueOrReason };
        
        completed++;
        
        if (completed === promises.length) {
          resolve(results);
        }
      };
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => processResult(index, FULFILLED, value),
          reason => processResult(index, REJECTED, reason)
        );
      });
    });
  }
  
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
  
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }
      
      if (promises.length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'));
      }
      
      const errors = [];
      let rejectedCount = 0;
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          resolve, // First success resolves
          reason => {
            errors[index] = reason;
            rejectedCount++;
            
            if (rejectedCount === promises.length) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          }
        );
      });
    });
  }
  
  static withResolvers() {
    let resolve, reject;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
}

// AggregateError polyfill for older environments
class AggregateError extends Error {
  constructor(errors, message) {
    super(message);
    this.name = 'AggregateError';
    this.errors = errors;
  }
}

// MyPromise usage examples
console.log('\n=== MyPromise Implementation ===');

// Basic usage
const promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise1
  .then(value => {
    console.log('Promise resolved:', value); // 'Success!'
    return value + ' Again';
  })
  .then(value => {
    console.log('Chained:', value); // 'Success! Again'
    throw new Error('Oops!');
  })
  .catch(error => {
    console.error('Caught error:', error.message); // 'Oops!'
    return 'Recovered';
  })
  .finally(() => {
    console.log('Finally block');
  })
  .then(value => {
    console.log('After recovery:', value); // 'Recovered'
  });

// Static methods
const p1 = MyPromise.resolve(42);
const p2 = new MyPromise(resolve => setTimeout(() => resolve(100), 500));
const p3 = MyPromise.reject(new Error('Failed'));

// Promise.all
MyPromise.all([p1, p2])
  .then(values => {
    console.log('Promise.all:', values); // [42, 100]
  });

// Promise.allSettled
MyPromise.allSettled([p1, p2, p3])
  .then(results => {
    console.log('Promise.allSettled:', results);
    // [
    //   { status: 'fulfilled', value: 42 },
    //   { status: 'fulfilled', value: 100 },
    //   { status: 'rejected', reason: Error: Failed }
    // ]
  });

// Promise.race
MyPromise.race([p2, p3])
  .then(
    value => console.log('Promise.race resolved:', value),
    reason => console.error('Promise.race rejected:', reason.message)
  );

// Promise.any
MyPromise.any([p3, p1])
  .then(value => {
    console.log('Promise.any:', value); // 42 (first fulfilled)
  })
  .catch(aggregateError => {
    console.error('All promises rejected:', aggregateError.errors);
  });

// Advanced: Promise with timeout
function timeout(ms) {
  return new MyPromise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`));
    }, ms);
  });
}

function fetchWithTimeout(url, ms) {
  return MyPromise.race([
    fetch(url).then(response => response.json()),
    timeout(ms)
  ]);
}

// Advanced: Promise retry
function retry(fn, retries = 3, delay = 1000) {
  return new MyPromise((resolve, reject) => {
    const attempt = (attemptNumber) => {
      fn().then(resolve).catch(error => {
        if (attemptNumber >= retries) {
          reject(error);
        } else {
          console.log(`Attempt ${attemptNumber} failed, retrying in ${delay}ms...`);
          setTimeout(() => attempt(attemptNumber + 1), delay);
        }
      });
    };
    
    attempt(1);
  });
}

// Advanced: Promise pool (concurrency control)
class PromisePool {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }
  
  add(task) {
    return new MyPromise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }
  
  run() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;
      
      task().then(
        value => {
          resolve(value);
          this.running--;
          this.run();
        },
        error => {
          reject(error);
          this.running--;
          this.run();
        }
      );
    }
  }
}

// Test promise pool
const pool = new PromisePool(2);
const tasks = Array.from({ length: 5 }, (_, i) => () => 
  new MyPromise(resolve => {
    setTimeout(() => {
      console.log(`Task ${i} completed`);
      resolve(i);
    }, 1000);
  })
);

tasks.forEach(task => {
  pool.add(task).then(result => {
    console.log(`Task ${result} finished`);
  });
});

// Compatibility with native Promise
MyPromise.prototype[Symbol.toStringTag] = 'Promise';

// Test with async/await
async function testAsyncAwait() {
  try {
    const result = await new MyPromise(resolve => {
      setTimeout(() => resolve('Async/Await works!'), 500);
    });
    
    console.log('Async/Await result:', result);
    
    // Multiple awaits
    const [a, b] = await MyPromise.all([
      MyPromise.resolve(1),
      MyPromise.resolve(2)
    ]);
    
    console.log('Multiple values:', a, b);
    
  } catch (error) {
    console.error('Async/Await error:', error);
  }
}

testAsyncAwait();
```

## 🎯 Interview Preparation Tips

### Common OOP Interview Questions

1. **Explain prototype-based inheritance in JavaScript**
   - Discuss `__proto__`, `prototype`, constructor functions
   - Demonstrate the prototype chain

2. **Difference between classical and prototypal inheritance**
   - Classical: Classes as blueprints, instances
   - Prototypal: Objects inherit from other objects

3. **When to use classes vs factory functions**
   - Classes: When you need `instanceof`, inheritance hierarchies
   - Factory functions: When you need privacy, flexibility

4. **Implement inheritance without using `class` syntax**
   - Use constructor functions and `Object.create()`

### Common Data Structure Questions

1. **When to use Map vs Object**
   - Map: Any key type, maintains order, better performance for frequent adds/removes
   - Object: String/Symbol keys, JSON serialization, simpler syntax

2. **When to use Set vs Array**
   - Set: Need uniqueness, fast existence checks
   - Array: Need order, duplicates, index-based access

3. **Explain WeakMap/WeakSet use cases**
   - Private data storage, metadata, caching without memory leaks

4. **Implement common data structures**
   - Practice implementing Stack, Queue, LinkedList, HashMap

### Performance Considerations

1. **Time Complexity**
   - Map/Set: O(1) average for get/set/has
   - Array: O(n) for includes/indexOf, O(1) for indexed access
   - Object: O(1) average for property access

2. **Memory Usage**
   - Typed arrays: Fixed memory, efficient
   - Regular arrays: Dynamic, more overhead
   - Weak collections: Don't prevent garbage collection

3. **Iteration Performance**
   - Map/Set: Maintain insertion order
   - Object: Property order can be unexpected

### Real-World Applications

1. **Use Map for:**
   - Caching/memoization
   - Metadata storage
   - Frequency counting
   - Relationship mapping

2. **Use Set for:**
   - Removing duplicates
   - Membership testing
   - Mathematical set operations
   - Tracking visited items

3. **Use WeakMap for:**
   - Private class fields
   - DOM element metadata
   - Caching with automatic cleanup

4. **Use Typed Arrays for:**
   - Image/audio processing
   - WebGL/WebGPU buffers
   - Binary protocol parsing
   - Performance-critical numeric operations

## 📚 Additional Resources

### Books
- "You Don't Know JS: this & Object Prototypes" by Kyle Simpson
- "JavaScript: The Definitive Guide" by David Flanagan
- "Eloquent JavaScript" by Marijn Haverbeke

### Documentation
- [MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)

### Practice Platforms
- LeetCode (Data Structures & Algorithms)
- HackerRank (JavaScript challenges)
- Codewars (JavaScript katas)
- Exercism (JavaScript track)

Remember: Understanding these concepts deeply and being able to implement them from scratch is more valuable than memorizing syntax. Practice explaining your code and reasoning during interviews!