# DOM & Browser Concepts - Comprehensive Guide

## 📚 Overview
Master the Document Object Model (DOM) and browser APIs that are essential for React development and technical interviews. This guide covers everything from basic DOM manipulation to advanced browser rendering concepts.

## 📋 Table of Contents
1. [DOM Tree Structure](#1-dom-tree-structure)
2. [Selecting & Modifying Elements](#2-selecting--modifying-elements)
3. [Event Listeners](#3-event-listeners)
4. [Event Bubbling & Capturing](#4-event-bubbling--capturing)
5. [Event Delegation](#5-event-delegation)
6. [Browser Rendering](#6-browser-rendering)
7. [Reflow vs Repaint](#7-reflow-vs-repaint)
8. [Debouncing](#8-debouncing)
9. [Throttling](#9-throttling)
10. [localStorage, sessionStorage](#10-localstorage-sessionstorage)
11. [Cookies](#11-cookies)
12. [Web Workers](#12-web-workers)
13. [requestAnimationFrame](#13-requestanimationframe)
14. [requestIdleCallback](#14-requestidlecallback)

---

## 1. DOM Tree Structure

### **What is the DOM?**
The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page so that programs can change the document structure, style, and content.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
    <div class="container">
        <span>Text inside container</span>
    </div>
</body>
</html>
```

### **DOM Tree Representation**
```
Document
├── html
│   ├── head
│   │   └── title
│   │       └── "Sample Page"
│   └── body
│       ├── h1
│       │   └── "Hello World"
│       ├── p
│       │   └── "This is a paragraph."
│       └── div (class="container")
│           └── span
│               └── "Text inside container"
```

### **Node Types**
```javascript
// Common node types
const element = document.createElement('div');

// Node type constants
console.log(Node.ELEMENT_NODE);        // 1
console.log(Node.TEXT_NODE);           // 3
console.log(Node.COMMENT_NODE);        // 8
console.log(Node.DOCUMENT_NODE);       // 9
console.log(Node.DOCUMENT_TYPE_NODE);  // 10

// Checking node types
console.log(element.nodeType);         // 1 (ELEMENT_NODE)
console.log(element.nodeName);         // "DIV"
console.log(element.nodeValue);        // null for elements

const textNode = document.createTextNode('Hello');
console.log(textNode.nodeType);        // 3 (TEXT_NODE)
console.log(textNode.nodeName);        // "#text"
console.log(textNode.nodeValue);       // "Hello"
```

### **DOM Traversal**
```javascript
const element = document.querySelector('.container');

// Parent relationships
console.log(element.parentNode);      // Direct parent
console.log(element.parentElement);   // Parent element (null if not element)

// Child relationships
console.log(element.childNodes);      // NodeList of all children (including text nodes)
console.log(element.children);        // HTMLCollection of element children
console.log(element.firstChild);      // First child node
console.log(element.lastChild);       // Last child node
console.log(element.firstElementChild); // First child element
console.log(element.lastElementChild);  // Last child element

// Sibling relationships
console.log(element.previousSibling);    // Previous sibling node
console.log(element.nextSibling);        // Next sibling node
console.log(element.previousElementSibling); // Previous sibling element
console.log(element.nextElementSibling);     // Next sibling element

// Closest ancestor matching selector
console.log(element.closest('body')); // Returns closest body ancestor

// Checking contains
const child = element.firstElementChild;
console.log(element.contains(child)); // true
```

### **Shadow DOM**
```javascript
// Creating shadow DOM
const host = document.createElement('div');
const shadowRoot = host.attachShadow({ mode: 'open' });

// Add content to shadow DOM
shadowRoot.innerHTML = `
    <style>
        p { color: red; }
    </style>
    <p>Shadow DOM content</p>
`;

// Add to document
document.body.appendChild(host);

// Access shadow DOM
console.log(host.shadowRoot); // Returns shadow root

// Closed shadow DOM (cannot access from outside)
const closedHost = document.createElement('div');
const closedShadow = closedHost.attachShadow({ mode: 'closed' });
console.log(closedHost.shadowRoot); // null

// Real-world example: Web Components
class MyElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #ccc;
                }
            </style>
            <slot></slot>
        `;
    }
}

customElements.define('my-element', MyElement);
```

---

## 2. Selecting & Modifying Elements

### **Selecting Elements**

#### **Traditional Methods**
```javascript
// Get element by ID (fastest)
const header = document.getElementById('header');

// Get elements by class name (returns HTMLCollection)
const buttons = document.getElementsByClassName('btn');

// Get elements by tag name (returns HTMLCollection)
const paragraphs = document.getElementsByTagName('p');

// Get elements by name attribute
const forms = document.getElementsByName('search');

// Query selector (returns first match)
const firstButton = document.querySelector('.btn');

// Query selector all (returns NodeList)
const allButtons = document.querySelectorAll('.btn');
```

#### **Modern CSS Selectors**
```javascript
// Basic selectors
document.querySelector('div');                // Tag
document.querySelector('.class');             // Class
document.querySelector('#id');                // ID
document.querySelector('[data-test]');        // Attribute
document.querySelector('[data-test="value"]'); // Attribute with value

// Combinators
document.querySelector('div p');              // Descendant
document.querySelector('div > p');            // Child
document.querySelector('h1 + p');             // Adjacent sibling
document.querySelector('h1 ~ p');             // General sibling

// Pseudo-classes
document.querySelector('input:focus');        // Focused element
document.querySelector('button:hover');       // Hovered element
document.querySelector('li:nth-child(2)');    // Second child
document.querySelector('p:first-of-type');    // First of type
document.querySelector('a:not(.external)');   // Negation

// Pseudo-elements (note: querySelector doesn't select pseudo-elements)
// But you can check if element has pseudo-element content
```

#### **Live vs Static Collections**
```javascript
// HTMLCollection (live) - updates when DOM changes
const liveCollection = document.getElementsByClassName('item');
console.log(liveCollection.length); // Current count

// Add new element with same class
const newItem = document.createElement('div');
newItem.className = 'item';
document.body.appendChild(newItem);

console.log(liveCollection.length); // Automatically updated

// NodeList (static) - doesn't update (except querySelectorAll returns static NodeList)
const staticList = document.querySelectorAll('.item');
console.log(staticList.length); // Original count

// Add new element
const anotherItem = document.createElement('div');
anotherItem.className = 'item';
document.body.appendChild(anotherItem);

console.log(staticList.length); // Still original count
```

### **Modifying Elements**

#### **Content Modification**
```javascript
const element = document.querySelector('.content');

// innerHTML (parses HTML, can be dangerous)
element.innerHTML = '<strong>New content</strong>';
element.innerHTML += ' <em>Appended</em>';

// textContent (safer, doesn't parse HTML)
element.textContent = 'Plain text <script>alert("xss")</script>';

// innerText (considers CSS, performance intensive)
element.innerText = 'Text respecting visibility';

// insertAdjacentHTML (more control)
element.insertAdjacentHTML('beforebegin', '<p>Before</p>'); // Outside, before
element.insertAdjacentHTML('afterbegin', '<p>Inside, at beginning</p>'); // Inside, at beginning
element.insertAdjacentHTML('beforeend', '<p>Inside, at end</p>'); // Inside, at end
element.insertAdjacentHTML('afterend', '<p>After</p>'); // Outside, after
```

#### **Attributes and Properties**
```javascript
const element = document.querySelector('#myElement');

// Setting attributes
element.setAttribute('data-custom', 'value');
element.setAttribute('aria-label', 'Description');

// Getting attributes
console.log(element.getAttribute('data-custom')); // 'value'

// Removing attributes
element.removeAttribute('data-custom');

// Checking attributes
console.log(element.hasAttribute('data-custom')); // false

// Dataset (data-* attributes)
element.dataset.userId = '123';
element.dataset.userRole = 'admin';
console.log(element.dataset.userId); // '123'

// Properties vs Attributes
element.setAttribute('value', 'attribute value'); // Attribute
element.value = 'property value'; // Property
console.log(element.getAttribute('value')); // 'attribute value'
console.log(element.value); // 'property value'

// Style attribute
element.style.color = 'red';
element.style.backgroundColor = '#fff';
element.style.fontSize = '16px';

// Multiple styles at once
element.style.cssText = 'color: red; background: blue;';

// Class manipulation
element.className = 'class1 class2'; // Replace all classes
element.classList.add('new-class'); // Add class
element.classList.remove('old-class'); // Remove class
element.classList.toggle('active'); // Toggle class
element.classList.contains('active'); // Check if has class
```

#### **Creating and Inserting Elements**
```javascript
// Create element
const div = document.createElement('div');
div.textContent = 'New div';

// Different insertion methods
const container = document.querySelector('.container');

// append (multiple nodes, at end)
container.append(div, ' Text node', document.createElement('span'));

// prepend (multiple nodes, at beginning)
container.prepend('First child', document.createElement('p'));

// before (outside, before element)
container.before('Before container');

// after (outside, after element)
container.after('After container');

// replaceWith (replace element)
container.replaceWith(document.createElement('section'));

// insertAdjacentElement (more control)
container.insertAdjacentElement('beforeend', div);

// Cloning elements
const clone = container.cloneNode(true); // true = deep clone (with children)
const shallowClone = container.cloneNode(false); // false = shallow clone
```

#### **Removing Elements**
```javascript
const element = document.querySelector('.to-remove');

// remove() method (modern)
element.remove();

// removeChild() (traditional)
const parent = element.parentNode;
parent.removeChild(element);

// Clearing all children
const container = document.querySelector('.container');

// Fast method (clear text content)
container.textContent = '';

// Using while loop (preserves event listeners on children)
while (container.firstChild) {
    container.removeChild(container.firstChild);
}

// Using innerHTML (fastest but loses event listeners)
container.innerHTML = '';
```

### **Performance Considerations**
```javascript
// BAD: Multiple reflows
const container = document.getElementById('container');
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    container.appendChild(div); // Causes reflow each iteration
}

// GOOD: Use DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
}
container.appendChild(fragment); // Single reflow

// BETTER: Use innerHTML for bulk updates
let html = '';
for (let i = 0; i < 1000; i++) {
    html += `<div>Item ${i}</div>`;
}
container.innerHTML = html; // Single reflow

// BEST: Virtual DOM approach (React-like)
// Batch updates and minimize DOM operations
```

---

## 3. Event Listeners

### **Basic Event Listeners**
```javascript
const button = document.querySelector('button');

// Adding event listener
button.addEventListener('click', function(event) {
    console.log('Button clicked!', event);
    console.log('Target:', event.target);
    console.log('Current target:', event.currentTarget);
    console.log('Event type:', event.type);
});

// Arrow function (no 'this' binding)
button.addEventListener('click', (event) => {
    console.log('Arrow function handler');
    // 'this' refers to window, not the element
});

// Named function for reuse
function handleClick(event) {
    console.log('Named handler');
    this.textContent = 'Clicked!'; // 'this' refers to the element
}

button.addEventListener('click', handleClick);

// Removing event listener
button.removeEventListener('click', handleClick);

// One-time event listener
button.addEventListener('click', function() {
    console.log('This runs only once');
}, { once: true });
```

### **Event Object Properties**
```javascript
element.addEventListener('click', function(event) {
    // Event properties
    console.log('Event type:', event.type);
    console.log('Target element:', event.target);
    console.log('Current target:', event.currentTarget);
    console.log('Event phase:', event.eventPhase); // 1: capture, 2: target, 3: bubble
    
    // Mouse events
    console.log('Client X:', event.clientX);
    console.log('Client Y:', event.clientY);
    console.log('Page X:', event.pageX);
    console.log('Page Y:', event.pageY);
    console.log('Screen X:', event.screenX);
    console.log('Screen Y:', event.screenY);
    console.log('Button:', event.button); // 0: left, 1: middle, 2: right
    
    // Keyboard events
    console.log('Key:', event.key);
    console.log('Code:', event.code);
    console.log('Ctrl key:', event.ctrlKey);
    console.log('Shift key:', event.shiftKey);
    console.log('Alt key:', event.altKey);
    console.log('Meta key:', event.metaKey);
    
    // Form events
    console.log('Input value:', event.target.value);
    
    // Prevent default behavior
    event.preventDefault();
    
    // Stop propagation
    event.stopPropagation();
    
    // Stop immediate propagation
    event.stopImmediatePropagation();
});
```

### **Common Event Types**
```javascript
// Mouse events
element.addEventListener('click', handleClick);
element.addEventListener('dblclick', handleDoubleClick);
element.addEventListener('mousedown', handleMouseDown);
element.addEventListener('mouseup', handleMouseUp);
element.addEventListener('mousemove', handleMouseMove);
element.addEventListener('mouseenter', handleMouseEnter); // No bubbling
element.addEventListener('mouseleave', handleMouseLeave); // No bubbling
element.addEventListener('mouseover', handleMouseOver); // Bubbles
element.addEventListener('mouseout', handleMouseOut); // Bubbles

// Keyboard events
element.addEventListener('keydown', handleKeyDown);
element.addEventListener('keyup', handleKeyUp);
element.addEventListener('keypress', handleKeyPress); // Deprecated

// Form events
form.addEventListener('submit', handleSubmit);
input.addEventListener('input', handleInput);
input.addEventListener('change', handleChange);
input.addEventListener('focus', handleFocus);
input.addEventListener('blur', handleBlur);

// Window events
window.addEventListener('load', handleLoad);
window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);
window.addEventListener('hashchange', handleHashChange);

// Touch events (mobile)
element.addEventListener('touchstart', handleTouchStart);
element.addEventListener('touchmove', handleTouchMove);
element.addEventListener('touchend', handleTouchEnd);
element.addEventListener('touchcancel', handleTouchCancel);

// Custom events
const customEvent = new CustomEvent('myevent', {
    detail: { message: 'Hello' },
    bubbles: true,
    cancelable: true
});
element.dispatchEvent(customEvent);
```

### **Event Listener Options**
```javascript
// Third parameter options
element.addEventListener('click', handler, {
    capture: false,      // Use capturing phase (default: false)
    once: true,          // Remove after first trigger (default: false)
    passive: true,       // Never call preventDefault() (default: false)
    signal: abortSignal  // AbortController signal for removal
});

// Passive listeners for better scroll performance
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('wheel', handler, { passive: true });

// Using AbortController for cleanup
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });

// Later, remove all listeners with this signal
controller.abort();
```

### **Event Handler Patterns**

#### **1. Debounced Event Handler**
```javascript
function createDebouncedHandler(handler, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            handler.apply(this, args);
        }, delay);
    };
}

// Usage
input.addEventListener('input', createDebouncedHandler((event) => {
    console.log('Search:', event.target.value);
}, 300));
```

#### **2. Throttled Event Handler**
```javascript
function createThrottledHandler(handler, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            handler.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
window.addEventListener('scroll', createThrottledHandler(() => {
    console.log('Scroll position:', window.scrollY);
}, 100));
```

#### **3. Event Handler with Automatic Cleanup**
```javascript
class EventManager {
    constructor() {
        this.listeners = new Map();
    }
    
    add(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        
        if (!this.listeners.has(element)) {
            this.listeners.set(element, []);
        }
        this.listeners.get(element).push({ event, handler, options });
    }
    
    removeAll(element) {
        if (this.listeners.has(element)) {
            this.listeners.get(element).forEach(({ event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
            this.listeners.delete(element);
        }
    }
    
    cleanup() {
        this.listeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
        });
        this.listeners.clear();
    }
}

// Usage
const eventManager = new EventManager();
eventManager.add(button, 'click', () => console.log('Clicked'));
eventManager.removeAll(button); // Cleanup specific element
eventManager.cleanup(); // Cleanup all
```

---

## 4. Event Bubbling & Capturing

### **Event Flow Phases**
```javascript
/*
Event flow has three phases:
1. Capturing Phase (from window to target)
2. Target Phase (at the target element)
3. Bubbling Phase (from target back to window)
*/

// HTML structure
// <div id="grandparent">
//   <div id="parent">
//     <button id="child">Click me</button>
//   </div>
// </div>

const grandparent = document.getElementById('grandparent');
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// Event listeners with different phases
grandparent.addEventListener('click', () => {
    console.log('Grandparent captured');
}, true); // true = capturing phase

parent.addEventListener('click', () => {
    console.log('Parent bubbled');
}, false); // false = bubbling phase (default)

child.addEventListener('click', (event) => {
    console.log('Child target phase');
    // event.eventPhase: 1=capturing, 2=target, 3=bubbling
    console.log('Phase:', event.eventPhase);
});

// Clicking the button outputs:
// Grandparent captured (capturing phase)
// Child target phase (target phase)
// Parent bubbled (bubbling phase)
```

### **Visualizing Event Flow**
```javascript
/*
Event Flow Example:
window
  └── document
      └── html
          └── body
              └── div#grandparent (CAPTURING)
                  └── div#parent
                      └── button#child (TARGET)
                  └── div#parent (BUBBLING)
              └── body (BUBBLING)
          └── html (BUBBLING)
      └── document (BUBBLING)
  └── window (BUBBLING)
*/
```

### **stopPropagation()**
```javascript
// Preventing event propagation
child.addEventListener('click', (event) => {
    console.log('Child clicked');
    event.stopPropagation(); // Stops further propagation
});

parent.addEventListener('click', () => {
    console.log('Parent clicked - This will NOT fire if stopPropagation was called');
});

grandparent.addEventListener('click', () => {
    console.log('Grandparent clicked - This will NOT fire if stopPropagation was called');
});

// stopImmediatePropagation() - also prevents other handlers on same element
child.addEventListener('click', (event) => {
    console.log('First child handler');
    event.stopImmediatePropagation(); // Stops this and other handlers
});

child.addEventListener('click', () => {
    console.log('Second child handler - This will NOT fire');
});
```

### **Event Target vs Current Target**
```javascript
parent.addEventListener('click', function(event) {
    console.log('event.target:', event.target); // The element that triggered the event
    console.log('event.currentTarget:', event.currentTarget); // The element with the listener
    console.log('this:', this); // Same as currentTarget (in regular function)
    
    // target vs currentTarget example:
    // If you click the button inside parent:
    // - event.target = button (actual clicked element)
    // - event.currentTarget = parent (element with listener)
});

// Real-world example: Handling clicks anywhere in a container
const container = document.querySelector('.container');
container.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        console.log('Button clicked:', event.target.textContent);
    } else if (event.target.tagName === 'A') {
        console.log('Link clicked:', event.target.href);
    }
});
```

### **Preventing Default Behavior**
```javascript
// Prevent default browser actions
const link = document.querySelector('a');
link.addEventListener('click', (event) => {
    // Check if we should prevent default
    if (!confirm('Navigate to new page?')) {
        event.preventDefault(); // Prevent navigation
    }
});

// Form submission
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    if (!validateForm()) {
        event.preventDefault(); // Prevent form submission
    }
});

// Context menu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Disable right-click menu
    showCustomContextMenu(event.clientX, event.clientY);
});

// Combining preventDefault and stopPropagation
element.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default action
    event.stopPropagation(); // Stop event from bubbling
    // Custom behavior
});
```

---

## 5. Event Delegation

### **What is Event Delegation?**
Event delegation is a technique where you attach a single event listener to a parent element to handle events for multiple child elements.

### **Basic Example**
```html
<ul id="todo-list">
    <li>Task 1 <button class="delete">Delete</button></li>
    <li>Task 2 <button class="delete">Delete</button></li>
    <li>Task 3 <button class="delete">Delete</button></li>
    <!-- More items can be added dynamically -->
</ul>
```

```javascript
// WITHOUT event delegation (inefficient)
const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.remove();
    });
});

// Problem: Newly added items won't have event listeners

// WITH event delegation (efficient)
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (event) => {
    // Check if the clicked element is a delete button
    if (event.target.classList.contains('delete')) {
        // Remove the parent li element
        event.target.closest('li').remove();
    }
    
    // Also handle clicks on the list items
    if (event.target.tagName === 'LI') {
        event.target.classList.toggle('completed');
    }
});

// Now dynamically added items will work automatically
```

### **Advantages of Event Delegation**
```javascript
// 1. Memory efficiency
// Instead of 1000 event listeners:
items.forEach(item => item.addEventListener('click', handler)); // 1000 listeners

// Use 1 event listener:
container.addEventListener('click', (event) => {
    if (event.target.matches('.item')) {
        handler(event);
    }
});

// 2. Dynamic elements work automatically
function addNewItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    li.className = 'item';
    list.appendChild(li);
    // No need to add event listener - delegation handles it!
}

// 3. Simplified cleanup
// Instead of removing many listeners:
items.forEach(item => item.removeEventListener('click', handler));

// Just remove the one delegate listener:
container.removeEventListener('click', delegateHandler);
```

### **Using matches() for Complex Delegation**
```javascript
// Basic delegation
container.addEventListener('click', (event) => {
    if (event.target.matches('.delete-btn')) {
        handleDelete(event);
    }
});

// Delegation with complex selectors
container.addEventListener('click', (event) => {
    // Check if element matches selector or has ancestor that does
    const target = event.target;
    
    if (target.matches('.btn, .btn *')) {
        // Clicked on button or its child
        const button = target.closest('.btn');
        handleButtonClick(button, event);
    }
    
    if (target.matches('[data-action="save"]')) {
        handleSave(event);
    }
    
    if (target.matches('a:not(.external)')) {
        handleInternalLink(event);
    }
});

// matches() with vendor prefixes
function matches(element, selector) {
    return (
        element.matches ||
        element.matchesSelector ||
        element.msMatchesSelector ||
        element.mozMatchesSelector ||
        element.webkitMatchesSelector ||
        element.oMatchesSelector
    ).call(element, selector);
}
```

### **Performance Considerations**
```javascript
// BAD: Checking every possible selector
container.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.matches('.btn-primary')) {
        // ...
    } else if (target.matches('.btn-secondary')) {
        // ...
    } else if (target.matches('.btn-danger')) {
        // ...
    } else if (target.matches('.link')) {
        // ...
    }
    // ... many more checks
});

// BETTER: Use data attributes for categorization
container.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.dataset.action || target.closest('[data-action]')?.dataset.action;
    
    if (!action) return;
    
    switch (action) {
        case 'save':
            handleSave(event);
            break;
        case 'delete':
            handleDelete(event);
            break;
        case 'edit':
            handleEdit(event);
            break;
    }
});

// BEST: Delegate to specific handlers
const delegateHandlers = {
    'save': handleSave,
    'delete': handleDelete,
    'edit': handleEdit
};

container.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.dataset.action || target.closest('[data-action]')?.dataset.action;
    
    if (action && delegateHandlers[action]) {
        delegateHandlers[action](event);
    }
});
```

### **Event Delegation for Multiple Events**
```javascript
class EventDelegator {
    constructor(container) {
        this.container = container;
        this.handlers = new Map(); // Map<eventType, Map<selector, handler>>
    }
    
    on(eventType, selector, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Map());
            
            // Add global listener for this event type
            this.container.addEventListener(eventType, (event) => {
                const handlers = this.handlers.get(eventType);
                
                for (const [sel, hdlr] of handlers) {
                    if (event.target.matches(sel)) {
                        hdlr(event);
                        break;
                    }
                }
            });
        }
        
        this.handlers.get(eventType).set(selector, handler);
    }
    
    off(eventType, selector) {
        if (this.handlers.has(eventType)) {
            this.handlers.get(eventType).delete(selector);
        }
    }
}

// Usage
const delegator = new EventDelegator(document.body);

delegator.on('click', '.btn-save', (event) => {
    console.log('Save clicked');
});

delegator.on('click', '.btn-delete', (event) => {
    console.log('Delete clicked');
});

delegator.on('mouseover', '.tooltip', (event) => {
    showTooltip(event.target);
});
```

### **Real-World Example: Todo App**
```javascript
class TodoApp {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.setupEventDelegation();
    }
    
    setupEventDelegation() {
        // Single event listener for all todo interactions
        this.container.addEventListener('click', (event) => {
            const target = event.target;
            
            // Handle todo item toggle
            if (target.matches('.todo-item, .todo-item *')) {
                const todoItem = target.closest('.todo-item');
                this.toggleTodo(todoItem);
            }
            
            // Handle delete button
            if (target.matches('.delete-btn, .delete-btn *')) {
                const todoItem = target.closest('.todo-item');
                this.deleteTodo(todoItem);
            }
            
            // Handle edit button
            if (target.matches('.edit-btn, .edit-btn *')) {
                const todoItem = target.closest('.todo-item');
                this.editTodo(todoItem);
            }
        });
        
        // Input delegation
        this.container.addEventListener('input', (event) => {
            if (event.target.matches('.todo-edit')) {
                this.updateTodoText(event.target);
            }
        });
        
        // Keydown delegation
        this.container.addEventListener('keydown', (event) => {
            if (event.target.matches('.todo-edit') && event.key === 'Enter') {
                event.preventDefault();
                this.finishEditing(event.target);
            }
        });
    }
    
    toggleTodo(todoItem) {
        todoItem.classList.toggle('completed');
        // Update in database
    }
    
    deleteTodo(todoItem) {
        todoItem.remove();
        // Remove from database
    }
    
    // ... other methods
}
```

---

## 6. Browser Rendering

### **Critical Rendering Path**
```
1. HTML → DOM Tree
2. CSS → CSSOM Tree
3. DOM + CSSOM → Render Tree
4. Layout (Reflow) → Calculate positions
5. Paint → Fill pixels
6. Composite → Layer merging
```

### **DOM Construction**
```javascript
// HTML parsing and DOM construction
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
});

// Async and defer scripts
// <script src="script.js" async></script> - Download async, execute immediately
// <script src="script.js" defer></script> - Download async, execute after parsing

// Preload critical resources
// <link rel="preload" href="critical.css" as="style">
// <link rel="preload" href="critical.js" as="script">

// CSS blocking
// CSS is render-blocking by default
// Use media queries to unblock non-critical CSS:
// <link rel="stylesheet" href="print.css" media="print">

// JavaScript blocking
// JavaScript is parser-blocking by default
// Use async/defer or load dynamically
```

### **CSSOM Construction**
```javascript
/*
CSS Object Model (CSSOM) is like DOM but for CSS
- CSS is render-blocking
- CSS rules are cascading (specificity matters)
- CSSOM construction can be optimized
*/

// Inline critical CSS
<style>
  /* Above-the-fold styles here */
</style>

// Load non-critical CSS asynchronously
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Start as print, change after load
    link.onload = () => link.media = 'all';
    document.head.appendChild(link);
}

// CSS containment for performance
/*
.element {
  contain: layout style paint; /* Isolates element */
  content-visibility: auto; /* Skips rendering when offscreen */
}
*/
```

### **Render Tree**
```javascript
/*
Render Tree = DOM Tree + CSSOM Tree
- Only visible elements (no display: none, head, etc.)
- Each node has computed styles
*/

// Checking if element is in render tree
function isElementInRenderTree(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' &&
           element.offsetParent !== null;
}

// Force render tree update (for testing)
element.offsetHeight; // Reading layout properties forces reflow

// Render tree debugging in DevTools
// - Chrome: Rendering → Paint flashing
// - Firefox: Paint flashing in toolbox
```

### **Layout/Reflow**
```javascript
/*
Layout (Reflow) = Calculating positions and sizes
Triggers:
1. Adding/removing elements
2. Changing element dimensions
3. Changing content
4. Changing font
5. Activating CSS pseudo-classes (:hover)
6. Measuring elements (offsetWidth, etc.)
*/

// Minimizing layout thrashing
// BAD: Multiple reads/writes causing multiple reflows
for (let i = 0; i < 100; i++) {
    element.style.width = i + 'px'; // Write
    console.log(element.offsetWidth); // Read (causes reflow)
}

// GOOD: Batch reads and writes
let width = element.offsetWidth; // Read once
for (let i = 0; i < 100; i++) {
    width = i;
}
element.style.width = width + 'px'; // Write once

// Using requestAnimationFrame for visual changes
function animateWidth(element, targetWidth) {
    let currentWidth = element.offsetWidth;
    
    function update() {
        currentWidth += (targetWidth - currentWidth) * 0.1;
        element.style.width = currentWidth + 'px';
        
        if (Math.abs(targetWidth - currentWidth) > 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}
```

### **Paint**
```javascript
/*
Paint = Filling pixels
- Divided into layers
- Layers painted independently
- Uses GPU acceleration
*/

// Creating layers for GPU acceleration
/*
.element {
  will-change: transform; /* Hint to create layer */
  transform: translateZ(0); /* Force layer creation */
}
*/

// Paint areas debugging
// Chrome DevTools: Rendering → Layer borders

// Minimizing paint areas
// Use transforms instead of top/left for animations
// Bad:
element.style.left = x + 'px';
element.style.top = y + 'px';

// Good:
element.style.transform = `translate(${x}px, ${y}px)`;

// Paint profiling
// Chrome DevTools: Performance → Record → Check Painting
```

### **Composite**
```javascript
/*
Composite = Merging layers
- Layers combined in correct order
- GPU accelerated
- Cheapest operation in pipeline
*/

// Properties that trigger composite only (cheap)
/*
- transform
- opacity
- filter
- backdrop-filter
- perspective
*/

// Composite-only animations
function animateComposite(element) {
    let opacity = 0;
    
    function fadeIn() {
        opacity += 0.01;
        element.style.opacity = opacity;
        
        if (opacity < 1) {
            requestAnimationFrame(fadeIn);
        }
    }
    
    requestAnimationFrame(fadeIn);
}

// Layer management
// Too many layers → memory issues
// Too few layers → paint bottlenecks
```

### **Performance Monitoring**
```javascript
// Performance Observer
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(`${entry.name}:`, entry.startTime);
    }
});

observer.observe({ entryTypes: ['paint', 'layout', 'render'] });

// Measuring rendering performance
function measureRender(callback) {
    const start = performance.now();
    
    // Force synchronous layout
    document.body.offsetHeight;
    
    callback();
    
    // Force layout again to measure
    document.body.offsetHeight;
    
    const end = performance.now();
    console.log('Render time:', end - start, 'ms');
}

// Long tasks monitoring
const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // 50ms threshold
            console.warn('Long task detected:', entry);
        }
    }
});

longTaskObserver.observe({ entryTypes: ['longtask'] });
```

---

## 7. Reflow vs Repaint

### **What is Reflow?**
Reflow (also called layout) is the process of calculating the position and geometry of all elements in the document.

```javascript
// Operations that trigger reflow
const element = document.querySelector('.box');

// 1. Changing dimensions
element.style.width = '100px';
element.style.height = '100px';
element.style.padding = '10px';
element.style.margin = '20px';

// 2. Changing position
element.style.position = 'absolute';
element.style.top = '50px';
element.style.left = '50px';

// 3. Changing content
element.textContent = 'New content';
element.innerHTML = '<span>HTML</span>';

// 4. Adding/removing elements
document.body.appendChild(element);
element.remove();

// 5. Changing font
element.style.fontSize = '20px';
element.style.fontFamily = 'Arial';

// 6. Resizing window
window.addEventListener('resize', () => {
    // Triggers reflow
});

// 7. Reading layout properties (forces synchronous reflow)
const width = element.offsetWidth; // Triggers reflow
const height = element.offsetHeight;
const top = element.offsetTop;
const left = element.offsetLeft;
```

### **What is Repaint?**
Repaint occurs when changes are made to an element that affect its visibility but not its layout (position and size).

```javascript
// Operations that trigger repaint only
const element = document.querySelector('.box');

// 1. Changing color
element.style.color = 'red';
element.style.backgroundColor = 'blue';

// 2. Changing borders (without changing dimensions)
element.style.borderColor = 'green';
element.style.borderStyle = 'dashed';

// 3. Changing shadows
element.style.boxShadow = '10px 10px 5px grey';

// 4. Changing outline
element.style.outline = '2px solid red';

// 5. Changing background images
element.style.backgroundImage = 'url(image.jpg)';

// 6. Changing text decoration
element.style.textDecoration = 'underline';

// 7. Changing visibility (without changing layout)
element.style.visibility = 'hidden';
element.style.opacity = '0.5';
```

### **Performance Impact**
```javascript
// Reflow is more expensive than repaint
/*
Cost comparison (relative):
- Reflow: 10x to 100x more expensive than repaint
- Composite: Cheapest operation

Example impact:
1. Change color (repaint) → Fast
2. Change width (reflow + repaint) → Slower
3. Change width in loop (multiple reflows) → Very slow
*/

// Measuring reflow cost
function measureReflowCost() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const start = performance.now();
    
    // Trigger 1000 reflows
    for (let i = 0; i < 1000; i++) {
        container.style.width = i + 'px';
        void container.offsetWidth; // Force reflow
    }
    
    const end = performance.now();
    console.log('Reflow cost:', end - start, 'ms');
    
    container.remove();
}

// Comparing with batched updates
function measureBatchedCost() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const start = performance.now();
    
    // Batch updates
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.style.width = i + 'px';
        fragment.appendChild(div);
    }
    container.appendChild(fragment);
    
    const end = performance.now();
    console.log('Batched cost:', end - start, 'ms');
    
    container.remove();
}
```

### **Minimizing Reflows**
```javascript
// 1. Batch DOM changes
function batchUpdates() {
    // Bad: Multiple reflows
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.margin = '10px';
    
    // Good: Single reflow
    element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';
    
    // Better: Use class
    element.classList.add('new-styles');
}

// 2. Use DocumentFragment
function addManyItems(items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item;
        fragment.appendChild(div);
    });
    
    container.appendChild(fragment); // Single reflow
}

// 3. Hide element during updates
function updateHiddenElement(element) {
    element.style.display = 'none'; // Trigger reflow
    
    // Perform multiple updates
    element.style.width = '200px';
    element.style.height = '200px';
    element.innerHTML = 'New content';
    
    element.style.display = 'block'; // Trigger reflow
}

// 4. Use absolute/fixed positioning
// Elements taken out of flow don't affect others
function animateOutOfFlow() {
    element.style.position = 'absolute';
    // Animations won't trigger reflow on other elements
    animate(element);
}

// 5. Avoid table layouts
// Tables trigger reflows on all cells when one changes

// 6. Cache layout values
function efficientLoop() {
    // Bad: Reading in loop
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.width = elements[i].offsetWidth + 10 + 'px';
    }
    
    // Good: Cache values
    const widths = Array.from(elements).map(el => el.offsetWidth);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.width = widths[i] + 10 + 'px';
    }
}
```

### **Tools for Debugging**

#### **1. Chrome DevTools**
```javascript
// Enable in DevTools:
// 1. Performance panel → Record
// 2. Check "Enable advanced paint instrumentation"
// 3. Look for "Layout" and "Paint" events

// Console warnings
// Type in console:
// - console.profile() / console.profileEnd()
// - performance.mark() / performance.measure()

// Force repaint debugging
function forceRepaint() {
    // Reading certain properties forces repaint
    void document.body.offsetHeight;
}
```

#### **2. Layout Thrashing Detector**
```javascript
// Simple layout thrashing detector
let readCount = 0;
let writeCount = 0;

const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype, 
    'offsetWidth'
).get;

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: function() {
        readCount++;
        console.warn(`Layout read #${readCount} on`, this);
        return originalOffsetWidth.call(this);
    }
});

// Monitor write operations
const observer = new MutationObserver(() => {
    writeCount++;
    console.warn(`DOM write #${writeCount}`);
});

observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
});
```

### **CSS Properties and Their Impact**
```javascript
// Properties sorted by performance impact

// 1. Triggers Reflow + Repaint (Most expensive)
/*
- width, height
- padding, margin
- top, left, right, bottom
- position, float, clear
- font-size, font-family, line-height
- text-align, overflow
- display
*/

// 2. Triggers Repaint only (Moderate)
/*
- color, background-color
- border-color, border-style
- border-radius, box-shadow
- background-image, background-position
- outline, outline-color
- visibility, opacity
*/

// 3. Triggers Composite only (Cheapest)
/*
- transform
- opacity (when used with will-change or transform)
- filter
- backdrop-filter
- perspective
*/

// Example: Optimizing animations
// Bad: Animate width (reflow every frame)
element.animate(
    { width: ['0px', '100px'] },
    { duration: 1000 }
);

// Good: Animate transform (composite only)
element.animate(
    { transform: ['scaleX(0)', 'scaleX(1)'] },
    { duration: 1000 }
);
```

---

## 8. Debouncing

### **What is Debouncing?**
Debouncing ensures that a function is not called again until a certain amount of time has passed without it being called.

```javascript
// Basic debounce implementation
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

// Usage example
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
    console.log('Searching for:', query);
    // API call would go here
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
```

### **Debounce with Immediate Option**
```javascript
function debounce(func, wait, immediate = false) {
    let timeout;
    
    return function(...args) {
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

// Usage
const saveButton = document.getElementById('save');
const debouncedSave = debounce(() => {
    console.log('Saving data...');
    // Save operation
}, 1000, true); // Immediate: save on first click

saveButton.addEventListener('click', debouncedSave);
```

### **Advanced Debounce with Cancel**
```javascript
function advancedDebounce(func, wait, options = {}) {
    const {
        leading = false,
        trailing = true,
        maxWait = null
    } = options;
    
    let timeout;
    let lastCallTime;
    let lastInvokeTime = 0;
    let result;
    
    function invokeFunc(time) {
        const args = arguments;
        lastInvokeTime = time;
        result = func.apply(this, args);
        return result;
    }
    
    function startTimer(pendingFunc, wait) {
        clearTimeout(timeout);
        timeout = setTimeout(pendingFunc, wait);
    }
    
    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        
        return (
            lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxWait !== null && timeSinceLastInvoke >= maxWait)
        );
    }
    
    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        
        return maxWait === null
            ? timeWaiting
            : Math.min(timeWaiting, maxWait - timeSinceLastInvoke);
    }
    
    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        startTimer(timerExpired, remainingWait(time));
    }
    
    function trailingEdge(time) {
        timeout = undefined;
        
        if (trailing && lastCallTime !== undefined) {
            return invokeFunc(time);
        }
        return result;
    }
    
    function debounced(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);
        
        lastCallTime = time;
        
        if (isInvoking) {
            if (timeout === undefined && leading) {
                return invokeFunc(time);
            }
            if (maxWait !== null) {
                startTimer(timerExpired, wait);
                return invokeFunc(time);
            }
        }
        if (timeout === undefined) {
            startTimer(timerExpired, wait);
        }
        return result;
    }
    
    debounced.cancel = function() {
        clearTimeout(timeout);
        lastCallTime = 0;
        lastInvokeTime = 0;
        timeout = undefined;
    };
    
    debounced.flush = function() {
        return timeout === undefined ? result : trailingEdge(Date.now());
    };
    
    return debounced;
}

// Usage
const search = advancedDebounce((query) => {
    console.log('Search:', query);
}, 300, { leading: true, maxWait: 1000 });

// Cancel if needed
search.cancel();
```

### **Real-World Use Cases**

#### **1. Search Input**
```javascript
class SearchComponent {
    constructor(inputId, resultsId) {
        this.input = document.getElementById(inputId);
        this.results = document.getElementById(resultsId);
        this.setupDebouncedSearch();
    }
    
    setupDebouncedSearch() {
        this.debouncedSearch = debounce(async (query) => {
            if (query.length < 2) {
                this.clearResults();
                return;
            }
            
            try {
                const data = await this.fetchResults(query);
                this.displayResults(data);
            } catch (error) {
                console.error('Search failed:', error);
            }
        }, 300);
        
        this.input.addEventListener('input', (e) => {
            this.debouncedSearch(e.target.value);
        });
    }
    
    async fetchResults(query) {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    }
    
    displayResults(data) {
        // Update UI with search results
    }
    
    clearResults() {
        this.results.innerHTML = '';
    }
}
```

#### **2. Window Resize Handler**
```javascript
class ResponsiveLayout {
    constructor() {
        this.setupResizeHandler();
        this.currentBreakpoint = this.getBreakpoint();
    }
    
    setupResizeHandler() {
        this.debouncedResize = debounce(() => {
            const newBreakpoint = this.getBreakpoint();
            
            if (newBreakpoint !== this.currentBreakpoint) {
                this.currentBreakpoint = newBreakpoint;
                this.onBreakpointChange(newBreakpoint);
            }
            
            this.onResize();
        }, 150);
        
        window.addEventListener('resize', this.debouncedResize);
    }
    
    getBreakpoint() {
        const width = window.innerWidth;
        if (width >= 1200) return 'xl';
        if (width >= 992) return 'lg';
        if (width >= 768) return 'md';
        if (width >= 576) return 'sm';
        return 'xs';
    }
    
    onBreakpointChange(breakpoint) {
        console.log('Breakpoint changed to:', breakpoint);
        // Update layout, load different components, etc.
    }
    
    onResize() {
        // Handle resize within same breakpoint
    }
    
    destroy() {
        window.removeEventListener('resize', this.debouncedResize);
    }
}
```

#### **3. Form Auto-Save**
```javascript
class AutoSaveForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.saving = false;
        this.setupAutoSave();
    }
    
    setupAutoSave() {
        this.debouncedSave = debounce(async () => {
            if (this.saving) return;
            
            this.saving = true;
            this.showSavingIndicator();
            
            try {
                const formData = this.getFormData();
                await this.saveFormData(formData);
                this.showSuccess();
            } catch (error) {
                console.error('Save failed:', error);
                this.showError();
            } finally {
                this.saving = false;
                this.hideSavingIndicator();
            }
        }, 1000);
        
        // Listen to all form changes
        this.form.addEventListener('input', this.debouncedSave);
        this.form.addEventListener('change', this.debouncedSave);
    }
    
    getFormData() {
        return new FormData(this.form);
    }
    
    async saveFormData(formData) {
        const response = await fetch('/api/save', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Save failed');
        }
    }
    
    showSavingIndicator() {
        // Show saving UI
    }
    
    hideSavingIndicator() {
        // Hide saving UI
    }
    
    showSuccess() {
        // Show success message
    }
    
    showError() {
        // Show error message
    }
}
```

### **Performance Considerations**
```javascript
// Debounce timeout value guidelines
const DEBOUNCE_TIMES = {
    SEARCH: 300,      // User typing
    RESIZE: 150,      // Window resizing
    SCROLL: 100,      // Scroll events
    MOUSEMOVE: 50,    // Mouse movement
    KEYPRESS: 100,    // Key press (for games)
    TOUCH: 50,        // Touch events
    AUTO_SAVE: 1000,  // Form auto-save
};

// Memory management for many debounced functions
class DebounceManager {
    constructor() {
        this.debouncedFunctions = new Map();
    }
    
    getDebounced(key, func, wait) {
        if (!this.debouncedFunctions.has(key)) {
            this.debouncedFunctions.set(key, debounce(func, wait));
        }
        return this.debouncedFunctions.get(key);
    }
    
    cancel(key) {
        const debounced = this.debouncedFunctions.get(key);
        if (debounced && debounced.cancel) {
            debounced.cancel();
        }
        this.debouncedFunctions.delete(key);
    }
    
    cleanup() {
        this.debouncedFunctions.forEach((debounced) => {
            if (debounced.cancel) debounced.cancel();
        });
        this.debouncedFunctions.clear();
    }
}

// Usage
const manager = new DebounceManager();
const searchHandler = manager.getDebounced('search', performSearch, 300);
```

---

## 9. Throttling

### **What is Throttling?**
Throttling ensures a function is called at most once in a specified time period.

```javascript
// Basic throttle implementation
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage example
window.addEventListener('scroll', throttle(() => {
    console.log('Scroll position:', window.scrollY);
}, 100)); // Called at most every 100ms
```

### **Throttle with Leading/Trailing Options**
```javascript
function throttle(func, wait, options = {}) {
    let timeout;
    let previous = 0;
    const { leading = true, trailing = true } = options;
    
    return function(...args) {
        const now = Date.now();
        
        if (!previous && !leading) previous = now;
        
        const remaining = wait - (now - previous);
        const context = this;
        
        if (remaining <= 0 || remaining > wait) {
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

// Usage
const throttledScroll = throttle(() => {
    console.log('Throttled scroll');
}, 100, { leading: true, trailing: true });
```

### **Advanced Throttle with Cancel**
```javascript
function advancedThrottle(func, limit) {
    let lastCall = 0;
    let timeout;
    let pending = false;
    let lastArgs;
    let lastContext;
    
    function execute() {
        lastCall = Date.now();
        func.apply(lastContext, lastArgs);
        pending = false;
    }
    
    function throttled(...args) {
        lastContext = this;
        lastArgs = args;
        
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        
        if (timeSinceLastCall >= limit && !pending) {
            // Execute immediately if enough time has passed
            execute();
        } else if (!pending) {
            // Schedule execution
            pending = true;
            timeout = setTimeout(() => {
                execute();
            }, limit - timeSinceLastCall);
        }
    }
    
    throttled.cancel = function() {
        clearTimeout(timeout);
        pending = false;
        lastCall = 0;
    };
    
    return throttled;
}
```

### **Throttle vs Debounce**
```javascript
// Comparison visualization
/*
Event:   | | | | | | | | | | | (rapid events)
Time:    0---100---200---300---400ms

Debounce (100ms):
          |         |         |
          [..........][..........][..........]
          (waits for pause)   (executes)

Throttle (100ms):
          |   |   |   |   |
          [x][.][x][.][x][.][x][.][x]
          (executes at most every 100ms)

Leading Throttle:
          |   |   |   |   |
          [x][.][.][x][.][.][x][.][.][x]
          (executes immediately, then limits)

Trailing Throttle:
          |   |   |   |   |
          [.][.][x][.][.][x][.][.][x][.]
          (executes at end of interval)
*/

// Interactive example
class EventRateLimiter {
    constructor() {
        this.eventCount = 0;
        this.debounceCount = 0;
        this.throttleCount = 0;
    }
    
    setup() {
        const button = document.getElementById('rapidButton');
        
        // Count all events
        button.addEventListener('click', () => {
            this.eventCount++;
            this.updateCounts();
        });
        
        // Debounced handler
        const debouncedClick = debounce(() => {
            this.debounceCount++;
            this.updateCounts();
        }, 300);
        
        button.addEventListener('click', debouncedClick);
        
        // Throttled handler
        const throttledClick = throttle(() => {
            this.throttleCount++;
            this.updateCounts();
        }, 300);
        
        button.addEventListener('click', throttledClick);
    }
    
    updateCounts() {
        console.log(`Events: ${this.eventCount}, Debounced: ${this.debounceCount}, Throttled: ${this.throttleCount}`);
    }
}
```

### **Real-World Use Cases**

#### **1. Scroll-Based Animations**
```javascript
class ScrollAnimator {
    constructor() {
        this.animationElements = [];
        this.setupScrollHandler();
    }
    
    setupScrollHandler() {
        // Throttle scroll for performance
        this.throttledScroll = throttle(() => {
            this.checkAnimations();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', this.throttledScroll);
        
        // Initial check
        this.checkAnimations();
    }
    
    addElement(element, animationClass) {
        this.animationElements.push({ element, animationClass, animated: false });
    }
    
    checkAnimations() {
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        this.animationElements.forEach(item => {
            if (item.animated) return;
            
            const rect = item.element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            
            // Check if element is in viewport
            if (elementTop < scrollTop + viewportHeight * 0.8) {
                item.element.classList.add(item.animationClass);
                item.animated = true;
            }
        });
    }
    
    destroy() {
        window.removeEventListener('scroll', this.throttledScroll);
    }
}

// Usage
const animator = new ScrollAnimator();
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animator.addElement(el, 'animate');
});
```

#### **2. Infinite Scroll**
```javascript
class InfiniteScroll {
    constructor(containerId, loadMoreCallback) {
        this.container = document.getElementById(containerId);
        this.loadMoreCallback = loadMoreCallback;
        this.loading = false;
        this.setupScrollHandler();
    }
    
    setupScrollHandler() {
        // Throttle scroll checking
        this.throttledCheck = throttle(() => {
            this.checkScrollPosition();
        }, 100);
        
        window.addEventListener('scroll', this.throttledCheck);
        // Also check on resize
        window.addEventListener('resize', this.throttledCheck);
    }
    
    checkScrollPosition() {
        if (this.loading) return;
        
        const containerBottom = this.container.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight;
        
        // Load more when container is 300px from bottom
        if (containerBottom - viewportHeight < 300) {
            this.loadMore();
        }
    }
    
    async loadMore() {
        this.loading = true;
        this.showLoadingIndicator();
        
        try {
            await this.loadMoreCallback();
        } catch (error) {
            console.error('Failed to load more:', error);
        } finally {
            this.loading = false;
            this.hideLoadingIndicator();
        }
    }
    
    showLoadingIndicator() {
        // Show loading spinner
    }
    
    hideLoadingIndicator() {
        // Hide loading spinner
    }
    
    destroy() {
        window.removeEventListener('scroll', this.throttledCheck);
        window.removeEventListener('resize', this.throttledCheck);
    }
}
```

#### **3. Game Input Handling**
```javascript
class GameController {
    constructor() {
        this.keys = new Set();
        this.setupInputHandlers();
        this.gameLoop();
    }
    
    setupInputHandlers() {
        // Throttle key events for consistent game loop
        const throttledKeyHandler = throttle((event) => {
            if (event.type === 'keydown') {
                this.keys.add(event.code);
            } else {
                this.keys.delete(event.code);
            }
        }, 16); // Match game loop rate
        
        window.addEventListener('keydown', throttledKeyHandler);
        window.addEventListener('keyup', throttledKeyHandler);
    }
    
    gameLoop() {
        // Process inputs at consistent rate
        setInterval(() => {
            this.processInputs();
            this.updateGame();
            this.render();
        }, 16); // ~60fps
    }
    
    processInputs() {
        if (this.keys.has('ArrowUp')) {
            // Move player up
        }
        if (this.keys.has('ArrowDown')) {
            // Move player down
        }
        if (this.keys.has('Space')) {
            // Jump or shoot
        }
    }
    
    updateGame() {
        // Update game state
    }
    
    render() {
        // Render game
    }
}
```

### **Performance Optimized Throttle**
```javascript
// Using requestAnimationFrame for visual throttling
function animationThrottle(func) {
    let ticking = false;
    
    return function(...args) {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                func.apply(this, args);
                ticking = false;
            });
        }
    };
}

// Usage for scroll animations
window.addEventListener('scroll', animationThrottle(() => {
    // This runs at most once per frame
    updateParallax();
}));

// Using requestIdleCallback for non-critical work
function idleThrottle(func, timeout) {
    let scheduled = false;
    
    return function(...args) {
        if (!scheduled) {
            scheduled = true;
            requestIdleCallback(
                () => {
                    func.apply(this, args);
                    scheduled = false;
                },
                { timeout }
            );
        }
    };
}

// Usage for non-critical updates
document.addEventListener('visibilitychange', idleThrottle(() => {
    // Update analytics, sync data, etc.
    updateBackgroundTasks();
}, 1000));
```

---

## 10. localStorage, sessionStorage

### **localStorage**
Persistent storage that survives browser sessions.

```javascript
// Basic operations
localStorage.setItem('username', 'john_doe');
localStorage.setItem('theme', 'dark');

const username = localStorage.getItem('username');
console.log(username); // 'john_doe'

localStorage.removeItem('theme');

localStorage.clear(); // Remove all items

// Checking if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}
```

### **sessionStorage**
Temporary storage that clears when the session ends (tab/window closes).

```javascript
// Same API as localStorage
sessionStorage.setItem('sessionId', 'abc123');
const sessionId = sessionStorage.getItem('sessionId');
sessionStorage.removeItem('sessionId');
sessionStorage.clear();

// Key differences from localStorage:
// 1. Tab-specific (each tab has its own sessionStorage)
// 2. Cleared when tab closes
// 3. Not shared between tabs
```

### **Storage Event**
```javascript
// Listen for storage changes (fires in other tabs/windows)
window.addEventListener('storage', (event) => {
    console.log('Storage changed:', {
        key: event.key,
        oldValue: event.oldValue,
        newValue: event.newValue,
        url: event.url,
        storageArea: event.storageArea
    });
    
    // Sync changes across tabs
    if (event.key === 'theme') {
        applyTheme(event.newValue);
    }
});

// Note: storage event only fires in other tabs, not the tab that made the change
```

### **Advanced Storage Patterns**

#### **1. Storage Wrapper with Validation**
```javascript
class SafeStorage {
    constructor(storage = localStorage) {
        this.storage = storage;
    }
    
    set(key, value, options = {}) {
        const { ttl, encrypt = false } = options;
        
        const item = {
            value,
            timestamp: Date.now(),
            ttl: ttl || null
        };
        
        if (encrypt) {
            item.value = this.encrypt(JSON.stringify(value));
        }
        
        try {
            this.storage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Storage set failed:', error);
            this.handleQuotaExceeded();
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        try {
            const data = this.storage.getItem(key);
            if (!data) return defaultValue;
            
            const item = JSON.parse(data);
            
            // Check TTL
            if (item.ttl && Date.now() - item.timestamp > item.ttl) {
                this.remove(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (error) {
            console.error('Storage get failed:', error);
            return defaultValue;
        }
    }
    
    remove(key) {
        this.storage.removeItem(key);
    }
    
    clear() {
        this.storage.clear();
    }
    
    keys() {
        return Object.keys(this.storage);
    }
    
    size() {
        return JSON.stringify(this.storage).length;
    }
    
    encrypt(text) {
        // Simple XOR encryption for demonstration
        // In production, use Web Crypto API
        return btoa(text);
    }
    
    decrypt(text) {
        return atob(text);
    }
    
    handleQuotaExceeded() {
        // Clear old items when quota exceeded
        const keys = this.keys();
        const oldestKey = keys[0];
        this.remove(oldestKey);
    }
}

// Usage
const storage = new SafeStorage(localStorage);
storage.set('user', { id: 1, name: 'John' }, { ttl: 24 * 60 * 60 * 1000 }); // 24 hour TTL
const user = storage.get('user');
```

#### **2. Storage Manager with Versioning**
```javascript
class StorageManager {
    constructor(namespace, version = '1.0') {
        this.namespace = namespace;
        this.version = version;
        this.storageKey = `${namespace}_${version}`;
        this.migrateFromOldVersions();
    }
    
    migrateFromOldVersions() {
        // Check for old versions and migrate
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.namespace) && key !== this.storageKey) {
                this.migrateData(key);
            }
        }
    }
    
    migrateData(oldKey) {
        const oldData = localStorage.getItem(oldKey);
        const newData = this.transformData(oldData, oldKey);
        this.setData(newData);
        localStorage.removeItem(oldKey);
    }
    
    transformData(oldData, oldKey) {
        // Transform old data format to new format
        // This would be specific to your migration needs
        return JSON.parse(oldData);
    }
    
    setData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }
    
    update(key, value) {
        const data = this.getData() || {};
        data[key] = value;
        this.setData(data);
    }
    
    get(key) {
        const data = this.getData();
        return data ? data[key] : undefined;
    }
    
    remove(key) {
        const data = this.getData();
        if (data && data[key]) {
            delete data[key];
            this.setData(data);
        }
    }
    
    clear() {
        localStorage.removeItem(this.storageKey);
    }
}

// Usage
const userStorage = new StorageManager('user_settings', '2.0');
userStorage.update('theme', 'dark');
userStorage.update('notifications', true);
console.log(userStorage.get('theme')); // 'dark'
```

#### **3. Storage with Compression**
```javascript
class CompressedStorage {
    constructor(storage = localStorage) {
        this.storage = storage;
    }
    
    set(key, value) {
        const compressed = this.compress(JSON.stringify(value));
        this.storage.setItem(key, compressed);
    }
    
    get(key) {
        const compressed = this.storage.getItem(key);
        if (!compressed) return null;
        
        const decompressed = this.decompress(compressed);
        return JSON.parse(decompressed);
    }
    
    compress(text) {
        // Simple compression for demonstration
        // In production, use libraries like lz-string
        return btoa(encodeURIComponent(text));
    }
    
    decompress(text) {
        return decodeURIComponent(atob(text));
    }
}

// Usage for large data
const compressedStorage = new CompressedStorage();
const largeData = { /* large object */ };
compressedStorage.set('large_data', largeData);
const retrieved = compressedStorage.get('large_data');
```

### **Real-World Examples**

#### **1. User Preferences**
```javascript
class UserPreferences {
    constructor() {
        this.preferences = this.loadPreferences();
        this.setupAutoSave();
    }
    
    loadPreferences() {
        const defaults = {
            theme: 'light',
            language: 'en',
            fontSize: 16,
            reducedMotion: false,
            notifications: true
        };
        
        const saved = localStorage.getItem('user_preferences');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }
    
    get(key) {
        return this.preferences[key];
    }
    
    set(key, value) {
        this.preferences[key] = value;
        this.save();
    }
    
    save() {
        localStorage.setItem('user_preferences', JSON.stringify(this.preferences));
    }
    
    setupAutoSave() {
        // Auto-save when window closes
        window.addEventListener('beforeunload', () => {
            this.save();
        });
        
        // Auto-save periodically
        setInterval(() => {
            this.save();
        }, 30000); // Every 30 seconds
    }
    
    reset() {
        localStorage.removeItem('user_preferences');
        this.preferences = this.loadPreferences();
    }
}
```

#### **2. Shopping Cart**
```javascript
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.cartKey = 'shopping_cart';
    }
    
    loadCart() {
        const cart = localStorage.getItem(this.cartKey);
        return cart ? JSON.parse(cart) : [];
    }
    
    addItem(product, quantity = 1) {
        const existingIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            this.items[existingIndex].quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }
    
    clear() {
        this.items = [];
        this.saveCart();
    }
    
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.items));
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { items: this.items }
        }));
    }
    
    // Sync cart across tabs
    setupCrossTabSync() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.cartKey) {
                this.items = JSON.parse(event.newValue || '[]');
                window.dispatchEvent(new CustomEvent('cartUpdated', {
                    detail: { items: this.items }
                }));
            }
        });
    }
}
```

### **Storage Limits and Best Practices**
```javascript
// Storage limits
const STORAGE_LIMITS = {
    localStorage: 5 * 1024 * 1024, // 5MB per origin
    sessionStorage: 5 * 1024 * 1024, // 5MB per origin per tab
};

// Checking available space
function getAvailableSpace(storage = localStorage) {
    const testKey = '__test__';
    let total = '';
    
    try {
        // Try to fill storage
        while (true) {
            total += 'xxxxxxxxxx'; // 10 bytes
            storage.setItem(testKey, total);
        }
    } catch (e) {
        storage.removeItem(testKey);
        return total.length;
    }
}

// Best practices
const StorageBestPractices = {
    // 1. Always use try-catch
    safeSet: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },
    
    // 2. Compress large data
    compressData: (data) => {
        // Use compression for large objects
        return data;
    },
    
    // 3. Implement TTL for temporary data
    setWithTTL: (key, value, ttl) => {
        const item = {
            value,
            expires: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    // 4. Clean up expired items
    cleanup: () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const item = localStorage.getItem(key);
            
            try {
                const parsed = JSON.parse(item);
                if (parsed.expires && Date.now() > parsed.expires) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Not JSON, skip
            }
        }
    },
    
    // 5. Namespace your keys
    namespaceKey: (namespace, key) => {
        return `${namespace}:${key}`;
    }
};
```

---

## 11. Cookies

### **Basic Cookie Operations**
```javascript
// Setting a cookie
document.cookie = "username=John Doe; path=/; max-age=3600";

// Getting cookies
console.log(document.cookie); // "username=John Doe; theme=dark"

// Parsing cookies
function getCookies() {
    return document.cookie.split('; ').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=');
        cookies[name] = decodeURIComponent(value);
        return cookies;
    }, {});
}

// Deleting a cookie (set expiration in past)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### **Cookie Attributes**
```javascript
// Complete cookie with all attributes
document.cookie = 
    "sessionId=abc123" + // Name=Value
    "; expires=Fri, 31 Dec 2024 23:59:59 GMT" + // Expiration
    "; path=/" + // Path scope
    "; domain=.example.com" + // Domain scope
    "; Secure" + // HTTPS only
    "; HttpOnly" + // Not accessible via JavaScript
    "; SameSite=Strict"; // CSRF protection

// Cookie attributes explained:
// 1. expires/max-age: When cookie expires
// 2. path: URL path that must exist in requested URL
// 3. domain: Domain and subdomains that receive cookie
// 4. Secure: Only sent over HTTPS
// 5. HttpOnly: Not accessible via document.cookie (prevents XSS)
// 6. SameSite: CSRF protection (Strict/Lax/None)
```

### **Cookie Utility Class**
```javascript
class CookieManager {
    constructor() {
        this.cookies = this.parseCookies();
    }
    
    parseCookies() {
        return document.cookie.split('; ').reduce((cookies, cookie) => {
            const [name, ...valueParts] = cookie.split('=');
            const value = decodeURIComponent(valueParts.join('='));
            cookies[name] = value;
            return cookies;
        }, {});
    }
    
    set(name, value, options = {}) {
        const {
            expires,
            maxAge,
            path = '/',
            domain,
            secure = true,
            sameSite = 'Lax'
        } = options;
        
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        
        if (expires) {
            if (expires instanceof Date) {
                cookie += `; expires=${expires.toUTCString()}`;
            } else {
                cookie += `; expires=${expires}`;
            }
        }
        
        if (maxAge) {
            cookie += `; max-age=${maxAge}`;
        }
        
        cookie += `; path=${path}`;
        
        if (domain) {
            cookie += `; domain=${domain}`;
        }
        
        if (secure) {
            cookie += '; Secure';
        }
        
        if (sameSite) {
            cookie += `; SameSite=${sameSite}`;
        }
        
        document.cookie = cookie;
        this.cookies[name] = value;
    }
    
    get(name) {
        return this.cookies[name];
    }
    
    remove(name, options = {}) {
        this.set(name, '', {
            ...options,
            expires: new Date(0),
            maxAge: -1
        });
        delete this.cookies[name];
    }
    
    exists(name) {
        return name in this.cookies;
    }
    
    getAll() {
        return { ...this.cookies };
    }
    
    clear() {
        Object.keys(this.cookies).forEach(name => {
            this.remove(name);
        });
    }
}

// Usage
const cookies = new CookieManager();
cookies.set('user_id', '123', { maxAge: 3600, sameSite: 'Strict' });
const userId = cookies.get('user_id');
cookies.remove('user_id');
```

### **Cookie vs localStorage**
```javascript
// Comparison table
const STORAGE_COMPARISON = {
    localStorage: {
        capacity: '5-10MB',
        expiration: 'Never (until cleared)',
        accessibility: 'Client-side only',
        sentWithRequests: 'No',
        security: 'Vulnerable to XSS',
        useCase: 'Large client-side data'
    },
    sessionStorage: {
        capacity: '5-10MB',
        expiration: 'Tab/window close',
        accessibility: 'Client-side only',
        sentWithRequests: 'No',
        security: 'Vulnerable to XSS',
        useCase: 'Temporary tab data'
    },
    cookies: {
        capacity: '4KB per cookie',
        expiration: 'Manual setting',
        accessibility: 'Client and server',
        sentWithRequests: 'Yes (automatically)',
        security: 'HttpOnly, Secure, SameSite options',
        useCase: 'Authentication, small server data'
    }
};

// Choosing the right storage
function chooseStorage(data, requirements) {
    if (requirements.serverAccess) {
        return 'cookies';
    } else if (data.size > 4000) {
        return 'localStorage';
    } else if (requirements.sessionOnly) {
        return 'sessionStorage';
    } else {
        return 'localStorage';
    }
}
```

### **Real-World Cookie Examples**

#### **1. Authentication Token Storage**
```javascript
class AuthService {
    constructor() {
        this.tokenKey = 'auth_token';
        this.cookies = new CookieManager();
    }
    
    login(token, rememberMe = false) {
        const options = {
            secure: true,
            httpOnly: true,
            sameSite: 'Strict'
        };
        
        if (rememberMe) {
            options.maxAge = 30 * 24 * 60 * 60; // 30 days
        } else {
            // Session cookie (expires when browser closes)
            options.expires = 0;
        }
        
        // Note: HttpOnly cookies cannot be set via JavaScript
        // In real apps, these are set by server in HTTP response
        // This is just for demonstration
        this.cookies.set(this.tokenKey, token, options);
        
        // Also store in localStorage for client-side access
        // (if needed and safe to do so)
        if (!options.httpOnly) {
            localStorage.setItem(this.tokenKey, token);
        }
    }
    
    getToken() {
        // Try cookie first (more secure)
        let token = this.cookies.get(this.tokenKey);
        
        // Fallback to localStorage
        if (!token) {
            token = localStorage.getItem(this.tokenKey);
        }
        
        return token;
    }
    
    logout() {
        this.cookies.remove(this.tokenKey);
        localStorage.removeItem(this.tokenKey);
    }
    
    isAuthenticated() {
        return !!this.getToken();
    }
}
```

#### **2. Cookie Consent Management**
```javascript
class CookieConsent {
    constructor() {
        this.consentKey = 'cookie_consent';
        this.categories = ['necessary', 'analytics', 'marketing'];
        this.loadConsent();
    }
    
    loadConsent() {
        const saved = this.getConsent();
        if (!saved) {
            this.showBanner();
        } else {
            this.applyConsent(saved);
        }
    }
    
    getConsent() {
        const consent = localStorage.getItem(this.consentKey);
        return consent ? JSON.parse(consent) : null;
    }
    
    saveConsent(consent) {
        localStorage.setItem(this.consentKey, JSON.stringify(consent));
        this.applyConsent(consent);
        this.hideBanner();
    }
    
    applyConsent(consent) {
        this.categories.forEach(category => {
            if (consent[category]) {
                this.enableCategory(category);
            } else {
                this.disableCategory(category);
            }
        });
    }
    
    enableCategory(category) {
        switch (category) {
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'marketing':
                this.loadMarketing();
                break;
            case 'necessary':
                // Always enabled
                break;
        }
    }
    
    disableCategory(category) {
        switch (category) {
            case 'analytics':
                this.unloadAnalytics();
                break;
            case 'marketing':
                this.unloadMarketing();
                break;
        }
    }
    
    loadAnalytics() {
        // Load Google Analytics, etc.
        console.log('Loading analytics');
    }
    
    unloadAnalytics() {
        // Disable analytics tracking
        console.log('Unloading analytics');
    }
    
    showBanner() {
        // Show cookie consent banner
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <p>We use cookies to improve your experience.</p>
            <button onclick="acceptAll()">Accept All</button>
            <button onclick="showSettings()">Settings</button>
            <button onclick="rejectAll()">Reject Non-Essential</button>
        `;
        document.body.appendChild(banner);
        
        // Add global functions
        window.acceptAll = () => {
            const consent = this.categories.reduce((acc, cat) => {
                acc[cat] = true;
                return acc;
            }, {});
            this.saveConsent(consent);
        };
        
        window.rejectAll = () => {
            const consent = this.categories.reduce((acc, cat) => {
                acc[cat] = cat === 'necessary';
                return acc;
            }, {});
            this.saveConsent(consent);
        };
    }
    
    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.remove();
        }
    }
}
```

---

## 12. Web Workers

### **Basic Web Worker**
```javascript
// main.js
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] });

// Receive data from worker
worker.onmessage = (event) => {
    console.log('Result from worker:', event.data);
};

// Handle errors
worker.onerror = (error) => {
    console.error('Worker error:', error);
};

// Terminate worker when done
// worker.terminate();

// worker.js
self.onmessage = function(event) {
    const { type, data } = event.data;
    
    if (type === 'calculate') {
        // Perform heavy calculation
        const result = data.reduce((sum, num) => sum + num, 0);
        
        // Send result back
        self.postMessage({ type: 'result', result });
    }
};
```

### **Inline Web Worker**
```javascript
// Create worker from string
function createInlineWorker(workerFunction) {
    const workerCode = `
        self.onmessage = ${workerFunction.toString()};
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    
    // Clean up URL when worker is terminated
    worker.onterminate = () => {
        URL.revokeObjectURL(workerUrl);
    };
    
    return worker;
}

// Usage
const worker = createInlineWorker(function(event) {
    const data = event.data;
    // Process data
    const result = data * 2;
    self.postMessage(result);
});

worker.postMessage(42);
worker.onmessage = (event) => {
    console.log('Result:', event.data); // 84
};
```

### **Shared Web Workers**
```javascript
// Shared workers can be accessed by multiple tabs/windows
// main.js
const sharedWorker = new SharedWorker('shared-worker.js');

// Connect to shared worker
sharedWorker.port.start();

// Send message
sharedWorker.port.postMessage({ type: 'greet', name: 'Tab 1' });

// Receive messages
sharedWorker.port.onmessage = (event) => {
    console.log('From shared worker:', event.data);
};

// shared-worker.js
let connections = 0;

self.onconnect = function(event) {
    const port = event.ports[0];
    connections++;
    
    port.onmessage = function(event) {
        const { type, name } = event.data;
        
        if (type === 'greet') {
            port.postMessage(`Hello ${name}! You are connection #${connections}`);
        }
    };
    
    port.start();
};
```

### **Worker Pools**
```javascript
class WorkerPool {
    constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
        this.workerScript = workerScript;
        this.poolSize = poolSize;
        this.workers = [];
        this.taskQueue = [];
        this.setupWorkers();
    }
    
    setupWorkers() {
        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(this.workerScript);
            worker.busy = false;
            worker.id = i;
            
            worker.onmessage = (event) => {
                worker.busy = false;
                const { taskId, result } = event.data;
                
                // Resolve the promise
                const task = this.taskQueue.find(t => t.id === taskId);
                if (task) {
                    task.resolve(result);
                    this.taskQueue = this.taskQueue.filter(t => t.id !== taskId);
                }
                
                // Process next task
                this.processQueue();
            };
            
            worker.onerror = (error) => {
                worker.busy = false;
                const task = this.taskQueue.find(t => t.workerId === worker.id);
                if (task) {
                    task.reject(error);
                }
                this.processQueue();
            };
            
            this.workers.push(worker);
        }
    }
    
    processQueue() {
        if (this.taskQueue.length === 0) return;
        
        const availableWorker = this.workers.find(w => !w.busy);
        if (!availableWorker) return;
        
        const task = this.taskQueue.shift();
        availableWorker.busy = true;
        task.workerId = availableWorker.id;
        
        availableWorker.postMessage({
            taskId: task.id,
            data: task.data
        });
    }
    
    execute(data) {
        return new Promise((resolve, reject) => {
            const taskId = Date.now() + Math.random();
            
            this.taskQueue.push({
                id: taskId,
                data,
                resolve,
                reject
            });
            
            this.processQueue();
        });
    }
    
    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        this.taskQueue = [];
    }
}

// Usage
const pool = new WorkerPool('worker.js', 4);

// Execute multiple tasks
Promise.all([
    pool.execute([1, 2, 3]),
    pool.execute([4, 5, 6]),
    pool.execute([7, 8, 9]),
    pool.execute([10, 11, 12])
]).then(results => {
    console.log('All results:', results);
});
```

### **Real-World Web Worker Examples**

#### **1. Image Processing**
```javascript
// main.js
class ImageProcessor {
    constructor() {
        this.worker = new Worker('image-worker.js');
    }
    
    processImage(imageData, filter) {
        return new Promise((resolve, reject) => {
            this.worker.onmessage = (event) => {
                resolve(event.data);
            };
            
            this.worker.onerror = reject;
            
            this.worker.postMessage({
                imageData,
                filter
            });
        });
    }
}

// Usage
const processor = new ImageProcessor();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

processor.processImage(imageData, 'grayscale')
    .then(processedData => {
        ctx.putImageData(processedData, 0, 0);
    });

// image-worker.js
self.onmessage = function(event) {
    const { imageData, filter } = event.data;
    
    switch (filter) {
        case 'grayscale':
            applyGrayscale(imageData);
            break;
        case 'invert':
            applyInvert(imageData);
            break;
        case 'sepia':
            applySepia(imageData);
            break;
    }
    
    self.postMessage(imageData);
};

function applyGrayscale(imageData) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
    }
}
```

#### **2. Data Processing/Transformation**
```javascript
// main.js
class DataTransformer {
    constructor() {
        this.worker = this.createWorker();
    }
    
    createWorker() {
        const workerCode = `
            self.onmessage = function(event) {
                const { data, transform } = event.data;
                let result;
                
                switch (transform) {
                    case 'sort':
                        result = data.sort((a, b) => a - b);
                        break;
                    case 'filter':
                        result = data.filter(x => x > 50);
                        break;
                    case 'map':
                        result = data.map(x => x * 2);
                        break;
                    case 'reduce':
                        result = data.reduce((sum, x) => sum + x, 0);
                        break;
                }
                
                self.postMessage(result);
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    }
    
    transform(data, transformType) {
        return new Promise((resolve, reject) => {
            this.worker.onmessage = (event) => {
                resolve(event.data);
            };
            
            this.worker.onerror = reject;
            
            this.worker.postMessage({
                data,
                transform: transformType
            });
        });
    }
}

// Usage with large dataset
const transformer = new DataTransformer();
const largeArray = Array.from({ length: 1000000 }, () => Math.random() * 100);

transformer.transform(largeArray, 'sort')
    .then(sorted => {
        console.log('Sorted array:', sorted);
    });
```

#### **3. Real-time Analytics**
```javascript
// analytics-worker.js
let analyticsData = {
    pageViews: 0,
    clicks: 0,
    errors: 0,
    performance: []
};

self.onmessage = function(event) {
    const { type, data } = event.data;
    
    switch (type) {
        case 'pageView':
            analyticsData.pageViews++;
            break;
            
        case 'click':
            analyticsData.clicks++;
            break;
            
        case 'error':
            analyticsData.errors++;
            break;
            
        case 'performance':
            analyticsData.performance.push(data);
            // Keep only last 100 entries
            if (analyticsData.performance.length > 100) {
                analyticsData.performance.shift();
            }
            break;
            
        case 'getData':
            self.postMessage(analyticsData);
            break;
            
        case 'flush':
            // Send data to server
            self.postMessage({
                type: 'flush',
                data: analyticsData
            });
            analyticsData = {
                pageViews: 0,
                clicks: 0,
                errors: 0,
                performance: []
            };
            break;
    }
};

// Auto-flush every minute
setInterval(() => {
    self.postMessage({ type: 'autoFlush' });
}, 60000);

// main.js
class Analytics {
    constructor() {
        this.worker = new Worker('analytics-worker.js');
        this.setupAnalytics();
    }
    
    setupAnalytics() {
        // Track page views
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', (event) => {
            this.trackClick(event.target);
        });
        
        // Track errors
        window.addEventListener('error', (event) => {
            this.trackError(event.error);
        });
        
        // Performance monitoring
        this.monitorPerformance();
        
        // Get data periodically
        setInterval(() => {
            this.getData().then(data => {
                console.log('Analytics data:', data);
            });
        }, 5000);
    }
    
    trackPageView() {
        this.worker.postMessage({
            type: 'pageView'
        });
    }
    
    trackClick(element) {
        this.worker.postMessage({
            type: 'click',
            data: {
                tagName: element.tagName,
                className: element.className,
                id: element.id
            }
        });
    }
    
    trackError(error) {
        this.worker.postMessage({
            type: 'error',
            data: {
                message: error.message,
                stack: error.stack
            }
        });
    }
    
    monitorPerformance() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.worker.postMessage({
                    type: 'performance',
                    data: {
                        name: entry.name,
                        duration: entry.duration,
                        entryType: entry.entryType
                    }
                });
            });
        });
        
        observer.observe({ entryTypes: ['longtask', 'paint', 'layout'] });
    }
    
    getData() {
        return new Promise((resolve) => {
            this.worker.onmessage = (event) => {
                if (event.data && !event.data.type) {
                    resolve(event.data);
                }
            };
            
            this.worker.postMessage({ type: 'getData' });
        });
    }
    
    flush() {
        this.worker.postMessage({ type: 'flush' });
    }
}
```

---

## 13. requestAnimationFrame

### **Basic Animation**
```javascript
// Simple animation using requestAnimationFrame
function animate(element, duration = 1000) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Update element based on progress
        element.style.transform = `translateX(${progress * 200}px)`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Usage
const box = document.getElementById('box');
animate(box, 2000);
```

### **Animation Loop Pattern**
```javascript
class AnimationLoop {
    constructor(callback) {
        this.callback = callback;
        this.rafId = null;
        this.isRunning = false;
        this.lastTime = 0;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }
    
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        cancelAnimationFrame(this.rafId);
    }
    
    loop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Execute callback with delta time
        this.callback(deltaTime);
        
        // Continue loop
        this.rafId = requestAnimationFrame(this.loop.bind(this));
    }
}

// Usage
const loop = new AnimationLoop((deltaTime) => {
    // Update game/animation state
    updateGame(deltaTime);
    
    // Render
    render();
});

loop.start();
// Later: loop.stop();
```

### **Performance Monitoring**
```javascript
// Frame rate monitoring
class FrameRateMonitor {
    constructor() {
        this.frames = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.startMonitoring();
    }
    
    startMonitoring() {
        const update = (currentTime) => {
            this.frames++;
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
                this.frames = 0;
                this.lastTime = currentTime;
                
                this.onFPSUpdate(this.fps);
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
    }
    
    onFPSUpdate(fps) {
        console.log(`FPS: ${fps}`);
        
        if (fps < 30) {
            console.warn('Low frame rate detected');
        }
    }
}

// Usage
const monitor = new FrameRateMonitor();
```

### **Batched DOM Updates**
```javascript
// Batch multiple DOM updates in single frame
class BatchRenderer {
    constructor() {
        this.updates = [];
        this.scheduled = false;
    }
    
    scheduleUpdate(updateFn) {
        this.updates.push(updateFn);
        
        if (!this.scheduled) {
            this.scheduled = true;
            requestAnimationFrame(() => {
                this.processUpdates();
            });
        }
    }
    
    processUpdates() {
        const updates = this.updates.slice();
        this.updates.length = 0;
        this.scheduled = false;
        
        // Process all updates
        updates.forEach(update => update());
        
        // If more updates arrived while processing, schedule another batch
        if (this.updates.length > 0) {
            this.scheduled = true;
            requestAnimationFrame(() => {
                this.processUpdates();
            });
        }
    }
}

// Usage
const renderer = new BatchRenderer();

// Multiple updates will be batched
renderer.scheduleUpdate(() => updateElement1());
renderer.scheduleUpdate(() => updateElement2());
renderer.scheduleUpdate(() => updateElement3());
```

### **Real-World Examples**

#### **1. Smooth Scrolling**
```javascript
class SmoothScroller {
    constructor(target, duration = 1000, easing = 'easeInOutCubic') {
        this.target = target;
        this.duration = duration;
        this.easing = easing;
    }
    
    scrollTo(y) {
        const startY = window.scrollY;
        const distance = y - startY;
        const startTime = performance.now();
        
        const ease = this.getEasingFunction();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const easedProgress = ease(progress);
            
            window.scrollTo(0, startY + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    getEasingFunction() {
        const easings = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
        
        return easings[this.easing] || easings.easeInOutCubic;
    }
}

// Usage
const scroller = new SmoothScroller();
scroller.scrollTo(1000);
```

#### **2. Parallax Scrolling**
```javascript
class ParallaxEffect {
    constructor() {
        this.layers = [];
        this.setupParallax();
        this.animate();
    }
    
    addLayer(element, speed = 0.5) {
        this.layers.push({ element, speed });
    }
    
    setupParallax() {
        // Detect parallax elements
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            this.addLayer(element, speed);
        });
    }
    
    animate() {
        const update = () => {
            const scrollY = window.scrollY;
            
            this.layers.forEach(layer => {
                const y = scrollY * layer.speed;
                layer.element.style.transform = `translateY(${y}px)`;
            });
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
    }
}

// Usage
const parallax = new ParallaxEffect();
```

#### **3. Animation Sequencing**
```javascript
class AnimationSequence {
    constructor() {
        this.animations = [];
        this.currentIndex = 0;
        this.isRunning = false;
    }
    
    add(animationFn, duration) {
        this.animations.push({ animationFn, duration });
    }
    
    start() {
        if (this.isRunning || this.animations.length === 0) return;
        
        this.isRunning = true;
        this.currentIndex = 0;
        this.runNextAnimation();
    }
    
    runNextAnimation() {
        if (this.currentIndex >= this.animations.length) {
            this.isRunning = false;
            return;
        }
        
        const animation = this.animations[this.currentIndex];
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            animation.animationFn(progress);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                this.currentIndex++;
                this.runNextAnimation();
            }
        };
        
        requestAnimationFrame(update);
    }
}

// Usage
const sequence = new AnimationSequence();

sequence.add((progress) => {
    // First animation
    element1.style.opacity = progress;
}, 1000);

sequence.add((progress) => {
    // Second animation
    element2.style.transform = `translateX(${progress * 100}px)`;
}, 500);

sequence.add((progress) => {
    // Third animation
    element3.style.rotate = `${progress * 360}deg`;
}, 800);

sequence.start();
```

---

## 14. requestIdleCallback

### **Basic Usage**
```javascript
// Schedule non-critical work during browser idle periods
requestIdleCallback((deadline) => {
    console.log('Time remaining:', deadline.timeRemaining());
    
    while (deadline.timeRemaining() > 0) {
        // Perform non-critical work
        processNextItem();
    }
    
    // If there's more work, schedule another callback
    if (hasMoreWork()) {
        requestIdleCallback(processWork);
    }
});

// With timeout (execute even if browser never becomes idle)
requestIdleCallback(
    (deadline) => {
        // Work to do
    },
    { timeout: 2000 } // Execute after 2 seconds max
);
```

### **IdleCallback Utility**
```javascript
class IdleTaskScheduler {
    constructor() {
        this.tasks = [];
        this.isRunning = false;
    }
    
    addTask(task, priority = 0) {
        this.tasks.push({ task, priority });
        this.tasks.sort((a, b) => b.priority - a.priority); // Higher priority first
        
        if (!this.isRunning) {
            this.start();
        }
    }
    
    start() {
        this.isRunning = true;
        this.processTasks();
    }
    
    processTasks() {
        if (this.tasks.length === 0) {
            this.isRunning = false;
            return;
        }
        
        requestIdleCallback((deadline) => {
            while (deadline.timeRemaining() > 0 && this.tasks.length > 0) {
                const task = this.tasks.shift();
                task.task();
            }
            
            // Continue processing if there are more tasks
            if (this.tasks.length > 0) {
                this.processTasks();
            } else {
                this.isRunning = false;
            }
        }, { timeout: 1000 });
    }
    
    clear() {
        this.tasks = [];
    }
}

// Usage
const scheduler = new IdleTaskScheduler();

// Add background tasks
scheduler.addTask(() => {
    console.log('Processing analytics data');
}, 1);

scheduler.addTask(() => {
    console.log('Cleaning up old data');
}, 2);

scheduler.addTask(() => {
    console.log('Pre-caching images');
}, 3);
```

### **Real-World Examples**

#### **1. Background Data Processing**
```javascript
class BackgroundProcessor {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    enqueue(data, processor) {
        this.queue.push({ data, processor });
        this.scheduleProcessing();
    }
    
    scheduleProcessing() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        requestIdleCallback((deadline) => {
            while (deadline.timeRemaining() > 0 && this.queue.length > 0) {
                const task = this.queue.shift();
                task.processor(task.data);
            }
            
            this.processing = false;
            
            // If there's more work, schedule another pass
            if (this.queue.length > 0) {
                this.scheduleProcessing();
            }
        }, { timeout: 5000 });
    }
}

// Usage
const processor = new BackgroundProcessor();

// Process large datasets in background
processor.enqueue(largeDataset, (data) => {
    const processed = data.map(item => transformItem(item));
    saveProcessedData(processed);
});
```

#### **2. Lazy Loading with requestIdleCallback**
```javascript
class LazyLoader {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.setup();
    }
    
    setup() {
        // Find all lazy elements
        this.elements = Array.from(document.querySelectorAll('[data-lazy]'));
        
        // Load visible elements immediately
        this.loadVisible();
        
        // Set up IntersectionObserver for future elements
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        });
        
        // Observe all lazy elements
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
        
        // Use requestIdleCallback for non-visible elements
        this.scheduleBackgroundLoading();
    }
    
    loadVisible() {
        // Load elements that are already visible
        this.elements.forEach(element => {
            if (this.isElementVisible(element)) {
                this.loadElement(element);
            }
        });
    }
    
    scheduleBackgroundLoading() {
        requestIdleCallback(() => {
            this.elements.forEach(element => {
                if (!element.loaded) {
                    this.loadElement(element);
                }
            });
        }, { timeout: 3000 });
    }
    
    loadElement(element) {
        if (element.loaded) return;
        
        const src = element.dataset.src;
        if (src) {
            element.src = src;
        }
        
        element.loaded = true;
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }
}

// Usage
const lazyLoader = new LazyLoader();
```

#### **3. Progressive Enhancement**
```javascript
class ProgressiveEnhancer {
    constructor() {
        this.enhancements = [];
        this.setupEnhancements();
    }
    
    addEnhancement(selector, enhancer, priority = 0) {
        this.enhancements.push({ selector, enhancer, priority });
    }
    
    setupEnhancements() {
        // Sort by priority (higher first)
        this.enhancements.sort((a, b) => b.priority - a.priority);
        
        // Apply enhancements during idle time
        this.applyEnhancements();
    }
    
    applyEnhancements() {
        requestIdleCallback((deadline) => {
            let enhancementIndex = 0;
            
            while (deadline.timeRemaining() > 0 && enhancementIndex < this.enhancements.length) {
                const { selector, enhancer } = this.enhancements[enhancementIndex];
                const elements = document.querySelectorAll(selector);
                
                elements.forEach((element, index) => {
                    if (deadline.timeRemaining() <= 0) return;
                    
                    // Skip if already enhanced
                    if (element.dataset.enhanced) return;
                    
                    enhancer(element);
                    element.dataset.enhanced = true;
                });
                
                enhancementIndex++;
            }
            
            // Continue if there are more enhancements
            if (enhancementIndex < this.enhancements.length) {
                this.applyEnhancements();
            }
        }, { timeout: 2000 });
    }
}

// Usage
const enhancer = new ProgressiveEnhancer();

// Add progressive enhancements
enhancer.addEnhancement('.btn', (button) => {
    // Add hover effects
    button.classList.add('btn-enhanced');
}, 1);

enhancer.addEnhancement('img', (img) => {
    // Add lazy loading
    img.loading = 'lazy';
}, 2);

enhancer.addEnhancement('form', (form) => {
    // Add form validation
    form.addEventListener('submit', validateForm);
}, 3);
```

---

## 🎯 Best Practices Summary

### **DOM Manipulation**
- Batch DOM updates to minimize reflows
- Use DocumentFragment for multiple element insertions
- Cache DOM queries when reused
- Use event delegation for dynamic content

### **Event Handling**
- Use passive event listeners for scroll/touch events
- Implement debouncing for frequent events (input, resize)
- Use throttling for continuous events (scroll, mousemove)
- Clean up event listeners to prevent memory leaks

### **Storage**
- Prefer localStorage for client-side data
- Use cookies for server-required data (authentication)
- Implement storage cleanup to prevent quota exceeded errors
- Compress large data before storing

### **Performance**
- Use requestAnimationFrame for visual updates
- Use requestIdleCallback for background tasks
- Offload heavy computations to Web Workers
- Minimize paint areas and use transform/opacity for animations

### **Browser APIs**
- Use IntersectionObserver for lazy loading
- Implement Service Workers for offline capabilities
- Leverage Cache API for static assets
- Use Performance API for monitoring

---

## 📚 Additional Resources

### **Further Reading**
- [MDN: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [Google Developers: Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [requestAnimationFrame Guide](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### **Practice Exercises**
1. Implement a virtual list for large datasets
2. Create a custom drag-and-drop system with smooth animations
3. Build a real-time collaborative editor using WebSocket and OT
4. Implement a progressive web app with offline capabilities
5. Create a performance monitoring dashboard for web applications

---

## ✅ Progress Checklist

- [ ] **DOM Tree Structure**: Understand node types, traversal, and Shadow DOM
- [ ] **Selecting & Modifying Elements**: Master DOM querying and manipulation
- [ ] **Event Listeners**: Handle events efficiently with proper cleanup
- [ ] **Event Bubbling & Capturing**: Understand event flow phases
- [ ] **Event Delegation**: Implement efficient event handling for dynamic content
- [ ] **Browser Rendering**: Know the critical rendering path
- [ ] **Reflow vs Repaint**: Optimize layout and painting performance
- [ ] **Debouncing**: Implement for infrequent but rapid events
- [ ] **Throttling**: Implement for continuous events
- [ ] **localStorage, sessionStorage**: Use client-side storage effectively
- [ ] **Cookies**: Manage HTTP cookies with proper security
- [ ] **Web Workers**: Offload heavy computations to background threads
- [ ] **requestAnimationFrame**: Create smooth animations
- [ ] **requestIdleCallback**: Schedule non-critical background work

---

**Mastering DOM and browser concepts is essential for building high-performance web applications. These skills are particularly valuable for React development and technical interviews!** 🚀