# Modules & Tooling - Comprehensive Guide

## 📚 Overview
Master modern JavaScript module systems, bundlers, and package management. This guide covers everything from basic module syntax to advanced build tooling concepts essential for modern web development.

## 📋 Table of Contents
1. [ES Modules (import/export)](#1-es-modules-importexport)
2. [CommonJS (require/module.exports)](#2-commonjs-requiremoduleexports)
3. [Bundlers: Webpack / Vite (basics)](#3-bundlers-webpack--vite-basics)
4. [Package Management (npm/yarn/pnpm)](#4-package-management-npmyarnpnpm)

---

## 1. ES Modules (import/export)

### **What are ES Modules?**
ES Modules (ECMAScript Modules) are the official, standardized module system for JavaScript. They use `import` and `export` statements and are natively supported in modern browsers and Node.js.

### **Export Types**

#### **Named Exports**
```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

export function divide(a, b) {
    if (b === 0) throw new Error('Cannot divide by zero');
    return a / b;
}

// Alternative: Export at the end
const secretValue = 42;
export { secretValue };

// Renaming exports
export { secretValue as THE_ANSWER };

// Export multiple
export { add, subtract, multiply, divide };
```

#### **Default Export**
```javascript
// Calculator.js
class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(x) {
        this.result += x;
        return this;
    }
    
    subtract(x) {
        this.result -= x;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}

// Default export (one per module)
export default Calculator;

// Alternative syntax
// export { Calculator as default };
```

#### **Mixed Exports**
```javascript
// utils.js
export const VERSION = '1.0.0';

export function formatDate(date) {
    return date.toISOString().split('T')[0];
}

export default function logger(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}
```

### **Import Types**

#### **Named Imports**
```javascript
// Import specific exports
import { add, subtract, PI } from './math.js';

console.log(PI); // 3.14159
console.log(add(5, 3)); // 8

// Import with aliasing
import { add as sum, multiply as product } from './math.js';
console.log(sum(2, 3)); // 5

// Import all named exports as object
import * as MathFunctions from './math.js';
console.log(MathFunctions.PI); // 3.14159
console.log(MathFunctions.add(10, 5)); // 15

// Import from node_modules
import { useState, useEffect } from 'react';
```

#### **Default Imports**
```javascript
// Import default export (any name)
import Calculator from './Calculator.js';
import MyLogger from './utils.js'; // default import from utils.js

const calc = new Calculator();
calc.add(5).subtract(2);
console.log(calc.getResult()); // 3

// Import both default and named
import logger, { VERSION, formatDate } from './utils.js';

logger('App started');
console.log(`Version: ${VERSION}`);
console.log(formatDate(new Date()));
```

#### **Dynamic Imports**
```javascript
// Dynamic import returns a promise
const loadModule = async () => {
    try {
        // Import module conditionally or on-demand
        const mathModule = await import('./math.js');
        console.log(mathModule.add(2, 3)); // 5
        
        // With destructuring
        const { multiply, divide } = await import('./math.js');
        console.log(multiply(4, 5)); // 20
        
    } catch (error) {
        console.error('Failed to load module:', error);
    }
};

// Useful for code splitting and lazy loading
button.addEventListener('click', async () => {
    const heavyModule = await import('./heavy-module.js');
    heavyModule.process();
});

// Import with webpack magic comments (for chunk naming)
const module = await import(
    /* webpackChunkName: "my-chunk" */ 
    /* webpackPrefetch: true */ 
    './module.js'
);
```

### **Re-exporting (Aggregating Modules)**
```javascript
// math/index.js - Barrel file
export { add, subtract } from './operations.js';
export { PI, E } from './constants.js';
export { default as Calculator } from './Calculator.js';

// Import from barrel
import { add, PI, Calculator } from './math/index.js';

// Re-export with renaming
export { add as sum, subtract as difference } from './operations.js';

// Re-export default as named
export { default as MyComponent } from './Component.js';

// Re-export named as default
export { Calculator as default } from './Calculator.js';
```

### **Module Characteristics**
```javascript
// Modules have their own scope
// variables are not shared unless exported

// module1.js
let privateVar = 'secret'; // Not accessible from outside
export let publicVar = 'shared';

// module2.js
import { publicVar } from './module1.js';
console.log(publicVar); // 'shared'
// console.log(privateVar); // Error: not defined

// Modules are evaluated only once
// First import loads and executes, subsequent imports get cached value

// counter.js
export let count = 0;
export function increment() {
    count++;
    console.log(`Count: ${count}`);
}

// main.js
import { count, increment } from './counter.js';
import { count as count2 } from './counter.js'; // Same reference

increment(); // Count: 1
console.log(count, count2); // 1, 1 (same value)
```

### **Top-Level Await**
```javascript
// In modules, you can use await at top level
// data-loader.js
const response = await fetch('https://api.example.com/data');
export const data = await response.json();

// main.js
import { data } from './data-loader.js';
console.log(data); // Already loaded

// Error handling with top-level await
let config;
try {
    const response = await fetch('/config.json');
    config = await response.json();
} catch (error) {
    config = { fallback: true };
}
export { config };
```

### **HTML Integration**
```html
<!-- Inline module script -->
<script type="module">
    import { greet } from './greet.js';
    greet('World');
</script>

<!-- External module -->
<script type="module" src="./main.js"></script>

<!-- Module attributes -->
<script type="module" async defer src="./app.js"></script>

<!-- Differences from regular scripts -->
<!--
1. Deferred by default (executes after HTML parsing)
2. Use strict mode by default
3. Have their own scope
4. Support top-level await
5. CORS restrictions apply
6. Only execute once even if included multiple times
-->
```

### **Module Resolution**
```javascript
// Different import path types

// Relative paths
import './local-module.js'; // Same directory
import '../parent/module.js'; // Parent directory
import './utils/helpers.js'; // Subdirectory

// Absolute paths (from project root, depends on environment)
import '/src/components/Button.js'; // Webpack/Vite may resolve this

// Package imports
import React from 'react'; // From node_modules
import lodash from 'lodash-es'; // ES Module version

// URL imports (browser only)
import moment from 'https://cdn.skypack.dev/moment';

// Import maps (browser-only feature)
<!-- index.html -->
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
    "app/": "/src/"
  }
}
</script>

<!-- Now you can use -->
<script type="module">
import { createApp } from 'vue'; // Resolves to CDN URL
import Component from 'app/components/Component.js'; // Resolves to /src/components/Component.js
</script>
```

### **Advanced Patterns**

#### **1. Module Factory Pattern**
```javascript
// factory.js
export function createLogger(prefix = '') {
    return {
        log: (message) => console.log(`[${prefix}] ${message}`),
        error: (message) => console.error(`[${prefix}] ERROR: ${message}`)
    };
}

export function createCounter(initialValue = 0) {
    let count = initialValue;
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count,
        reset: () => { count = initialValue; }
    };
}

// Usage
import { createLogger, createCounter } from './factory.js';

const appLogger = createLogger('APP');
const counter = createCounter(10);

appLogger.log('Started');
counter.increment();
console.log(counter.getValue()); // 11
```

#### **2. Plugin System**
```javascript
// plugin-system.js
const plugins = new Map();

export function registerPlugin(name, plugin) {
    plugins.set(name, plugin);
}

export function getPlugin(name) {
    return plugins.get(name);
}

export function usePlugin(name, ...args) {
    const plugin = plugins.get(name);
    if (!plugin) throw new Error(`Plugin ${name} not found`);
    return plugin(...args);
}

// plugin-a.js
import { registerPlugin } from './plugin-system.js';

registerPlugin('format', (text) => text.toUpperCase());

// plugin-b.js
import { registerPlugin } from './plugin-system.js';

registerPlugin('validate', (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
});

// main.js
import './plugin-a.js';
import './plugin-b.js';
import { usePlugin } from './plugin-system.js';

const formatted = usePlugin('format', 'hello');
console.log(formatted); // HELLO

const isValid = usePlugin('validate', 'test@example.com');
console.log(isValid); // true
```

#### **3. Module State Management**
```javascript
// store.js - Singleton pattern
let state = {
    user: null,
    preferences: {},
    cart: []
};

const subscribers = new Set();

export function getState() {
    return { ...state }; // Return copy to prevent direct mutation
}

export function setState(newState) {
    state = { ...state, ...newState };
    notifySubscribers();
}

export function subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback); // Unsubscribe function
}

function notifySubscribers() {
    subscribers.forEach(callback => callback(state));
}

// Usage across modules
import { getState, setState, subscribe } from './store.js';

// Module A
subscribe((state) => {
    console.log('State changed:', state);
});

// Module B
setState({ user: { name: 'John' } });

// Module C
console.log(getState().user); // { name: 'John' }
```

---

## 2. CommonJS (require/module.exports)

### **What is CommonJS?**
CommonJS is a module system primarily used in Node.js. It uses `require()` to import modules and `module.exports` or `exports` to export values.

### **Export Types**

#### **Exporting a Single Value**
```javascript
// calculator.js
class Calculator {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
}

// Export the class
module.exports = Calculator;

// Alternative: Export object with multiple properties
module.exports = {
    Calculator,
    version: '1.0.0',
    author: 'John Doe'
};

// Using exports shortcut (only for adding properties)
exports.Calculator = Calculator;
exports.version = '1.0.0';
```

#### **Exporting Multiple Values**
```javascript
// math.js
const PI = 3.14159;

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

// Export multiple values
module.exports = {
    PI,
    add,
    multiply,
    // Can also export functions directly
    square: (x) => x * x
};

// Alternative using exports object
exports.PI = PI;
exports.add = add;
exports.multiply = multiply;
```

#### **Exporting Functions Directly**
```javascript
// logger.js
module.exports = function(message) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
};

// factory.js
module.exports = (prefix) => {
    return {
        log: (msg) => console.log(`[${prefix}] ${msg}`),
        error: (msg) => console.error(`[${prefix}] ERROR: ${msg}`)
    };
};
```

### **Import Types**

#### **Basic require()**
```javascript
// Import entire module
const math = require('./math.js');
console.log(math.PI); // 3.14159
console.log(math.add(2, 3)); // 5

// Import with destructuring (Node.js 6+)
const { add, multiply, PI } = require('./math.js');
console.log(PI); // 3.14159

// Import default/ single export
const Calculator = require('./calculator.js');
const calc = new Calculator();

// Import built-in modules
const fs = require('fs');
const path = require('path');
const http = require('http');

// Import from node_modules
const axios = require('axios');
const lodash = require('lodash');
```

#### **Dynamic require()**
```javascript
// Dynamic requires (can be conditional)
let config;
if (process.env.NODE_ENV === 'production') {
    config = require('./config.prod.js');
} else {
    config = require('./config.dev.js');
}

// require in functions (not recommended - breaks static analysis)
function loadModule(moduleName) {
    return require(moduleName);
}

// require.cache - Module caching
console.log(require.cache); // Shows cached modules

// Clear module cache (useful for testing)
delete require.cache[require.resolve('./config.js')];
const freshConfig = require('./config.js');
```

#### **Circular Dependencies**
```javascript
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');

// b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');

// main.js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j', a.done, b.done);

/*
Output:
main starting
a starting
b starting
in b, a.done = false  // a not fully loaded yet
b done
in a, b.done = true
a done
in main, a.done=true, b.done=true
*/
```

### **Module Wrapper**
```javascript
// What Node.js actually does with your module
(function(exports, require, module, __filename, __dirname) {
    // Your module code here
    module.exports = {};
});

// Available variables in CommonJS modules:
console.log(__filename); // Absolute path of current file
console.log(__dirname); // Directory of current file
console.log(module); // Current module object
console.log(require); // require function
console.log(exports); // exports object (alias to module.exports)
```

### **CommonJS vs ES Modules Comparison**
```javascript
// Feature comparison table
const COMPARISON = {
    syntax: {
        commonjs: 'require() / module.exports',
        esm: 'import / export'
    },
    loading: {
        commonjs: 'Synchronous',
        esm: 'Asynchronous (supports top-level await)'
    },
    scope: {
        commonjs: 'Function wrapper scope',
        esm: 'Module scope'
    },
    hoisting: {
        commonjs: 'No hoisting of imports',
        esm: 'Imports are hoisted'
    },
    staticAnalysis: {
        commonjs: 'Dynamic - harder to analyze',
        esm: 'Static - better for tooling'
    },
    treeShaking: {
        commonjs: 'Limited support',
        esm: 'Fully supported'
    },
    browserSupport: {
        commonjs: 'No native support (needs bundler)',
        esm: 'Native support in modern browsers'
    },
    nodeSupport: {
        commonjs: 'Native support',
        esm: 'Native support (.mjs or package.json type)'
    }
};
```

### **Interoperability**

#### **CommonJS importing ES Modules**
```javascript
// In Node.js with ES Modules enabled
// Can use dynamic import() to load ES modules

async function loadESM() {
    // ES Modules can be loaded with dynamic import
    const esModule = await import('./es-module.mjs');
    console.log(esModule.default);
    console.log(esModule.namedExport);
}

// Or using import() directly
import('./es-module.mjs').then(module => {
    console.log(module.default);
});

// Note: require() cannot load .mjs files directly
```

#### **ES Modules importing CommonJS**
```javascript
// ES Modules can import CommonJS modules
import cjsModule from './commonjs-module.cjs';
import * as cjsModule2 from './commonjs-module.cjs';

// CommonJS exports become default export
console.log(cjsModule); // Entire module.exports object

// Named imports work for properties
import { namedExport } from './commonjs-module.cjs'; // If module.exports has namedExport property
```

### **Migration Patterns**

#### **1. Dual Package (ESM + CommonJS)**
```javascript
// package.json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module", // Default to ES modules
  "exports": {
    ".": {
      "import": "./dist/esm/index.js", // ESM entry point
      "require": "./dist/cjs/index.js" // CommonJS entry point
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/cjs/index.js", // Fallback for older Node.js
  "module": "./dist/esm/index.js" // For bundlers
}

// Build both versions
// ESM version: src/index.js -> dist/esm/index.js
// CommonJS version: src/index.js -> dist/cjs/index.js
```

#### **2. Conditional Exports**
```javascript
// Advanced package.json exports
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs",
      "default": "./index.js"
    },
    "./feature": {
      "browser": "./feature-browser.js",
      "node": "./feature-node.js",
      "default": "./feature.js"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

### **Real-World Examples**

#### **1. Configuration Loader**
```javascript
// config-loader.js
const fs = require('fs');
const path = require('path');

function loadConfig() {
    const env = process.env.NODE_ENV || 'development';
    const configPath = path.join(__dirname, `config.${env}.json`);
    
    try {
        const configFile = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configFile);
    } catch (error) {
        console.warn(`Config file not found: ${configPath}, using defaults`);
        return {
            port: 3000,
            database: {
                host: 'localhost',
                port: 5432
            }
        };
    }
}

module.exports = loadConfig();

// Usage
const config = require('./config-loader');
console.log(config.port);
```

#### **2. Plugin System**
```javascript
// plugin-manager.js
const path = require('path');
const fs = require('fs');

class PluginManager {
    constructor(pluginsDir) {
        this.pluginsDir = pluginsDir;
        this.plugins = new Map();
    }
    
    loadPlugins() {
        const pluginFiles = fs.readdirSync(this.pluginsDir);
        
        pluginFiles.forEach(file => {
            if (file.endsWith('.js')) {
                try {
                    const pluginPath = path.join(this.pluginsDir, file);
                    const plugin = require(pluginPath);
                    this.plugins.set(plugin.name, plugin);
                    console.log(`Loaded plugin: ${plugin.name}`);
                } catch (error) {
                    console.error(`Failed to load plugin ${file}:`, error);
                }
            }
        });
    }
    
    getPlugin(name) {
        return this.plugins.get(name);
    }
    
    executePlugin(name, ...args) {
        const plugin = this.getPlugin(name);
        if (plugin && typeof plugin.execute === 'function') {
            return plugin.execute(...args);
        }
        throw new Error(`Plugin ${name} not found or has no execute method`);
    }
}

module.exports = PluginManager;

// plugin-example.js
module.exports = {
    name: 'logger',
    execute: function(message) {
        console.log(`[PLUGIN] ${new Date().toISOString()}: ${message}`);
    }
};
```

---

## 3. Bundlers: Webpack / Vite (basics)

### **What are Bundlers?**
Bundlers are tools that combine multiple JavaScript files and their dependencies into a single (or few) optimized files for browser consumption.

### **Webpack Basics**

#### **Core Concepts**
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Entry point
    entry: './src/index.js',
    
    // Output configuration
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Clean dist folder before build
        publicPath: '/'
    },
    
    // Mode
    mode: 'production', // 'development' | 'production' | 'none'
    
    // Module rules
    module: {
        rules: [
            // JavaScript/JSX files
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            
            // CSS files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            
            // SCSS files
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            
            // Images
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ]
    },
    
    // Plugins
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    
    // Development server
    devServer: {
        static: './dist',
        hot: true,
        port: 3000,
        historyApiFallback: true
    },
    
    // Resolve extensions
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@components': path.resolve(__dirname, 'src/components/')
        }
    },
    
    // Optimization
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: 'single'
    }
};
```

#### **Loaders**
```javascript
// Loaders transform files
module: {
    rules: [
        // Babel loader for modern JS
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { targets: "defaults" }],
                        '@babel/preset-react'
                    ],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            }
        },
        
        // TypeScript
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        
        // CSS with modules
        {
            test: /\.module\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]__[local]__[hash:base64:5]'
                        }
                    }
                }
            ]
        },
        
        // File loader (deprecated, use asset modules)
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }
            ]
        },
        
        // URL loader (inline small files)
        {
            test: /\.svg$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // Inline if < 8KB
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }
            ]
        }
    ]
}
```

#### **Plugins**
```javascript
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        // Clean dist folder
        new CleanWebpackPlugin(),
        
        // Generate HTML file
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        }),
        
        // Extract CSS to separate file
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css',
            chunkFilename: '[id].css'
        }),
        
        // Define environment variables
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.API_URL': JSON.stringify(process.env.API_URL)
        }),
        
        // Copy static assets
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '',
                    globOptions: {
                        ignore: ['**/index.html'] // Don't copy index.html
                    }
                }
            ]
        }),
        
        // Provide global variables
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            React: 'react'
        }),
        
        // Ignore certain modules
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        })
    ]
};
```

#### **Code Splitting**
```javascript
// Dynamic imports for code splitting
const loadModule = async () => {
    const { heavyFunction } = await import(
        /* webpackChunkName: "heavy-module" */
        /* webpackPrefetch: true */
        './heavyModule'
    );
    heavyFunction();
};

// Route-based splitting (React example)
const HomePage = React.lazy(() => import('./pages/Home'));
const AboutPage = React.lazy(() => import('./pages/About'));

// Webpack configuration for splitting
optimization: {
    splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        cacheGroups: {
            defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            },
            // Custom cache group
            react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all'
            }
        }
    },
    runtimeChunk: 'single'
}
```

### **Vite Basics**

#### **Core Concepts**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    // Root directory
    root: './src',
    
    // Base public path
    base: '/',
    
    // Build options
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                about: resolve(__dirname, 'src/about.html')
            },
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) {
                            return 'vendor-react';
                        }
                        if (id.includes('lodash')) {
                            return 'vendor-lodash';
                        }
                        return 'vendor';
                    }
                }
            }
        },
        sourcemap: true,
        minify: 'terser',
        target: 'es2020'
    },
    
    // Plugins
    plugins: [
        react({
            babel: {
                plugins: ['@babel/plugin-transform-runtime']
            }
        })
    ],
    
    // Server options
    server: {
        port: 3000,
        open: true,
        cors: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    
    // Preview options
    preview: {
        port: 3000,
        open: true
    },
    
    // Resolve options
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, 'src/components')
        }
    },
    
    // CSS options
    css: {
        modules: {
            localsConvention: 'camelCase'
        },
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`
            }
        }
    },
    
    // Environment variables
    envPrefix: 'VITE_',
    
    // Public directory
    publicDir: 'public'
});
```

#### **Vite vs Webpack Comparison**
```javascript
const COMPARISON = {
    // Build time
    buildTime: {
        webpack: 'Slower (bundle-based)',
        vite: 'Faster (ESM-based, no bundling in dev)'
    },
    
    // Development server
    devServer: {
        webpack: 'Bundle-based HMR',
        vite: 'Native ESM HMR, instant server start'
    },
    
    // Configuration
    config: {
        webpack: 'Complex, many options',
        vite: 'Simpler, opinionated defaults'
    },
    
    // Ecosystem
    ecosystem: {
        webpack: 'Mature, vast plugin ecosystem',
        vite: 'Growing, uses Rollup ecosystem'
    },
    
    // Learning curve
    learning: {
        webpack: 'Steep',
        vite: 'Gentle'
    },
    
    // Best for
    bestFor: {
        webpack: 'Large, complex applications',
        vite: 'Modern web apps, quick prototyping'
    }
};
```

#### **Vite Plugins**
```javascript
// Common Vite plugins
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import svelte from '@vitejs/plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
    plugins: [
        // Framework plugins
        react(), // React
        vue(), // Vue
        svelte(), // Svelte
        
        // PWA support
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            manifest: {
                name: 'My App',
                short_name: 'App',
                description: 'My Awesome App',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            }
        }),
        
        // Code analysis
        eslint({
            cache: false,
            include: ['src/**/*.js', 'src/**/*.jsx']
        }),
        
        // Type checking
        checker({
            typescript: true,
            eslint: {
                lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
            }
        }),
        
        // Bundle visualization
        visualizer({
            filename: './dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true
        })
    ]
});
```

#### **Environment Variables**
```javascript
// .env files in Vite
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// .env.development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

// .env.production
VITE_API_URL=https://api.production.com
VITE_ANALYTICS_ID=UA-XXXXX-Y

// Access in code
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.MODE); // 'development' | 'production'
console.log(import.meta.env.PROD); // boolean
console.log(import.meta.env.DEV); // boolean
console.log(import.meta.env.BASE_URL);
console.log(import.meta.env.SSR); // boolean (server-side rendering)
```

### **Build Optimization**

#### **Tree Shaking**
```javascript
// Webpack tree shaking (enabled by default in production)
// package.json sideEffects flag
{
  "name": "my-package",
  "sideEffects": false, // No side effects
  // or
  "sideEffects": [
    "*.css", // CSS files have side effects
    "*.scss"
  ]
}

// Vite tree shaking (Rollup-based, automatic)
// ES Modules are required for effective tree shaking

// Example of tree-shakable code
// utils.js
export function usedFunction() {
    return 'I am used';
}

export function unusedFunction() {
    return 'I am not used';
}

// main.js
import { usedFunction } from './utils.js';
console.log(usedFunction());
// unusedFunction will be removed from bundle
```

#### **Asset Optimization**
```javascript
// Image optimization
// Using image-webpack-loader for Webpack
{
    test: /\.(jpe?g|png|gif|svg)$/i,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
                outputPath: 'images/'
            }
        },
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                optipng: {
                    enabled: false
                },
                pngquant: {
                    quality: [0.65, 0.90],
                    speed: 4
                },
                gifsicle: {
                    interlaced: false
                },
                webp: {
                    quality: 75
                }
            }
        }
    ]
}

// Vite image optimization (using plugins)
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
    plugins: [imagetools()]
});

// Usage in code
import image from './image.jpg?w=400&h=300&format=webp';
```

#### **Caching Strategies**
```javascript
// Webpack content hashing
output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
}

// Vite content hashing
build: {
    rollupOptions: {
        output: {
            entryFileNames: `[name].[hash].js`,
            chunkFileNames: `[name].[hash].js`,
            assetFileNames: `[name].[hash].[ext]`
        }
    }
}

// Service Worker for caching
// Using Workbox with Webpack
const WorkboxPlugin = require('workbox-webpack-plugin');

plugins: [
    new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                    }
                }
            }
        ]
    })
]
```

### **Development Workflow**

#### **Hot Module Replacement (HMR)**
```javascript
// Webpack HMR configuration
devServer: {
    hot: true,
    liveReload: false
}

// Vite HMR (automatic)
// No configuration needed

// React Fast Refresh (Webpack)
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

plugins: [
    new ReactRefreshWebpackPlugin()
],
module: {
    rules: [
        {
            test: /\.[jt]sx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['react-refresh/babel']
                    }
                }
            ]
        }
    ]
}

// Custom HMR handling
if (module.hot) {
    module.hot.accept('./module', () => {
        // Custom update logic
        console.log('Module updated');
    });
}
```

#### **Source Maps**
```javascript
// Webpack source maps
devtool: 'source-map', // Production
devtool: 'cheap-module-source-map', // Development

// Options:
// - 'eval': Fastest, no source maps
// - 'source-map': Complete source maps
// - 'eval-source-map': Good for development
// - 'cheap-source-map': Faster, no column mapping
// - 'cheap-module-source-map': Similar to cheap, but loader source maps

// Vite source maps
build: {
    sourcemap: true, // boolean | 'inline' | 'hidden'
    minify: 'terser',
    terserOptions: {
        compress: {
            drop_console: true,
            drop_debugger: true
        }
    }
}
```

---

## 4. Package Management (npm/yarn/pnpm)

### **npm (Node Package Manager)**

#### **Basic Commands**
```bash
# Initialize a new project
npm init
npm init -y  # Skip prompts

# Install packages
npm install package-name
npm i package-name  # Short version
npm install  # Install all dependencies from package.json

# Install types
npm install --save-dev @types/package-name

# Global install
npm install -g package-name

# Uninstall
npm uninstall package-name

# Update packages
npm update
npm update package-name

# Check outdated packages
npm outdated

# Audit security
npm audit
npm audit fix

# List packages
npm list
npm list --depth=0  # Show only top-level
npm list package-name  # Check specific package
```

#### **package.json**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "prepare": "husky install",
    "prepublishOnly": "npm test && npm run lint",
    "preversion": "npm run lint",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags"
  },
  "keywords": ["javascript", "node", "web"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/node": "^20.3.1",
    "@types/react": "^18.2.0",
    "@types/lodash": "^4.14.195",
    "webpack": "^5.85.0",
    "webpack-cli": "^5.1.1",
    "typescript": "^5.1.3",
    "jest": "^29.5.0",
    "eslint": "^8.42.0",
    "prettier": "^2.8.8",
    "husky": "^8.0.3",
    "lint-staged": "^13.2.2"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "optionalDependencies": {
    "fsevents": "^2.3.2"
  },
  "bundledDependencies": ["package-a", "package-b"],
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "os": ["darwin", "linux"],
  "cpu": ["x64", "arm64"],
  "private": true,
  "workspaces": ["packages/*"],
  "files": ["dist", "src"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  },
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  "homepage": "https://github.com/username/repo#readme",
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  }
}
```

#### **Version Management**
```json
{
  "dependencies": {
    // Exact version
    "package": "1.2.3",
    
    // Caret (compatible with major version)
    "package": "^1.2.3", // >=1.2.3 <2.0.0
    
    // Tilde (compatible with minor version)
    "package": "~1.2.3", // >=1.2.3 <1.3.0
    
    // Greater than
    "package": ">1.2.3",
    
    // Range
    "package": ">=1.2.3 <2.0.0",
    
    // OR
    "package": "1.2.3 || 2.0.0",
    
    // Pre-release
    "package": "1.2.3-beta.1",
    
    // Git
    "package": "git+https://github.com/user/repo.git",
    "package": "github:user/repo",
    "package": "git+ssh://git@github.com:user/repo.git#commit-hash",
    
    // File
    "package": "file:../local-package",
    
    // Tarball
    "package": "https://example.com/package.tar.gz"
  }
}
```

#### **npm Configuration**
```bash
# View configuration
npm config list
npm config get registry

# Set configuration
npm config set registry https://registry.npmjs.org/
npm config set save-exact true
npm config set fund false

# Common configurations
# .npmrc file
registry=https://registry.npmjs.org/
save-exact=true
package-lock=true
fund=false
progress=false
audit=false

# Organization scopes
@myorg:registry=https://registry.myorg.com/
//registry.myorg.com/:_authToken=${NPM_TOKEN}
```

### **Yarn**

#### **Basic Commands**
```bash
# Initialize
yarn init
yarn init -y

# Install
yarn add package-name
yarn add package-name --dev  # devDependencies
yarn add package-name --peer  # peerDependencies
yarn add package-name --optional  # optionalDependencies

# Remove
yarn remove package-name

# Update
yarn upgrade
yarn upgrade package-name
yarn upgrade-interactive  # Interactive update

# Global
yarn global add package-name
yarn global remove package-name

# Workspaces
yarn workspaces info
yarn workspace workspace-name add package-name

# Check
yarn check
yarn audit
yarn outdated

# Cache
yarn cache list
yarn cache clean
```

#### **yarn.lock vs package-lock.json**
```javascript
// yarn.lock (deterministic)
"package-name@^1.2.3":
  version "1.2.4"
  resolved "https://registry.npmjs.org/package-name/-/package-name-1.2.4.tgz"
  integrity sha512-...
  dependencies:
    dependency-name "~2.0.0"

// package-lock.json (detailed tree)
{
  "name": "project",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "project",
      "version": "1.0.0",
      "dependencies": {
        "package-name": "^1.2.3"
      }
    },
    "node_modules/package-name": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/package-name/-/package-name-1.2.4.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "dependency-name": "~2.0.0"
      }
    }
  }
}
```

#### **Yarn Workspaces**
```json
{
  "name": "monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "yarn workspaces foreach run build",
    "test": "yarn workspaces foreach run test",
    "lint": "yarn workspaces foreach run lint"
  }
}

// packages/web/package.json
{
  "name": "@monorepo/web",
  "version": "1.0.0",
  "dependencies": {
    "@monorepo/shared": "*", // Workspace reference
    "react": "^18.2.0"
  }
}

// packages/shared/package.json
{
  "name": "@monorepo/shared",
  "version": "1.0.0"
}
```

### **pnpm**

#### **Basic Commands**
```bash
# Initialize
pnpm init

# Install
pnpm add package-name
pnpm add -D package-name  # devDependencies
pnpm add -O package-name  # optionalDependencies

# Remove
pnpm remove package-name

# Update
pnpm update
pnpm update package-name
pnpm update --interactive

# Global
pnpm add -g package-name
pnpm remove -g package-name

# Workspaces
pnpm -r add package-name  # Add to all packages
pnpm --filter package-name add dependency

# Audit
pnpm audit
pnpm audit --fix

# Store management
pnpm store path
pnpm store prune
```

#### **pnpm-lock.yaml**
```yaml
lockfileVersion: '6.0'
settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false
packages:
  /lodash/4.17.21:
    resolution: {integrity: sha512-...}
    engines: {node: '>=4.0.0'}
dependencies:
  lodash: 4.17.21
packages:
  /axios/1.4.0:
    resolution: {integrity: sha512-...}
    dependencies:
      follow-redirects: 1.15.2
      form-data: 4.0.0
```

#### **pnpm Workspaces**
```json
{
  "name": "monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test"
  },
  "pnpm": {
    "overrides": {
      "react": "18.2.0",
      "react-dom": "18.2.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["react"]
    },
    "packageExtensions": {
      "package-name": {
        "peerDependencies": {
          "react": "*"
        }
      }
    }
  }
}
```

### **Comparison Table**
```javascript
const PACKAGE_MANAGER_COMPARISON = {
    // Installation method
    installation: {
        npm: 'Nested node_modules',
        yarn: 'Flat node_modules',
        pnpm: 'Content-addressable store'
    },
    
    // Speed
    speed: {
        npm: 'Slowest',
        yarn: 'Fast',
        pnpm: 'Fastest (uses hard links)'
    },
    
    // Disk space
    diskSpace: {
        npm: 'High (duplicate packages)',
        yarn: 'Medium',
        pnpm: 'Low (shared store)'
    },
    
    // Deterministic installs
    determinism: {
        npm: 'Yes (package-lock.json)',
        yarn: 'Yes (yarn.lock)',
        pnpm: 'Yes (pnpm-lock.yaml)'
    },
    
    // Workspaces
    workspaces: {
        npm: 'Native (npm v7+)',
        yarn: 'Native (good support)',
        pnpm: 'Native (excellent support)'
    },
    
    // Security
    security: {
        npm: 'Good (audit, ci)',
        yarn: 'Good',
        pnpm: 'Good (strict mode)'
    },
    
    // Features
    features: {
        npm: 'Mature, widely supported',
        yarn: 'Plugins, workspaces',
        pnpm: 'Efficiency, strictness'
    }
};
```

### **Best Practices**

#### **1. Lock Files**
```bash
# Always commit lock files
git add package-lock.json  # npm
git add yarn.lock          # yarn
git add pnpm-lock.yaml     # pnpm

# Use CI with frozen lockfile
npm ci                     # npm
yarn install --frozen-lockfile  # yarn
pnpm install --frozen-lockfile  # pnpm

# Update lockfile
npm update                 # npm
yarn upgrade               # yarn
pnpm update               # pnpm
```

#### **2. Dependency Management**
```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm", // Enforce package manager
    "prepare": "husky install"           // Git hooks
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "volta": {                             // Version management
    "node": "18.16.0",
    "npm": "9.5.1"
  }
}
```

#### **3. Security**
```bash
# Regular security checks
npm audit
yarn audit
pnpm audit

# Automate security updates
# Using Dependabot (GitHub)
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

# Using npm-check-updates
npx npm-check-updates
npx npm-check-updates -u  # Update package.json
```

#### **4. Monorepo Setup**
```json
// package.json (root)
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "dev": "turbo run dev --parallel",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}

// Using Turborepo
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

### **Advanced Topics**

#### **1. Package Publishing**
```json
{
  "name": "@scope/package-name",
  "version": "1.0.0",
  "description": "My package",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "keywords": ["javascript", "utility"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/package.git"
  },
  "bugs": {
    "url": "https://github.com/username/package/issues"
  },
  "homepage": "https://github.com/username/package#readme",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "scripts": {
    "prepublishOnly": "npm run build",
    "build": "tsc",
    "test": "jest"
  }
}
```

#### **2. Conditional Exports**
```json
{
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts",
      "default": "./dist/cjs/index.js"
    },
    "./package.json": "./package.json",
    "./styles.css": "./dist/styles.css",
    "./light.css": {
      "import": "./dist/light.css",
      "require": "./dist/light.css"
    },
    "./utils": {
      "node": "./dist/node/utils.js",
      "browser": "./dist/browser/utils.js",
      "default": "./dist/utils.js"
    }
  }
}
```

#### **3. Script Hooks**
```json
{
  "scripts": {
    // Lifecycle scripts
    "prepublish": "",      // Before publish
    "prepare": "",         // Before publish and install
    "prepublishOnly": "",  // Before publish only
    "postpublish": "",     // After publish
    
    // Install scripts
    "preinstall": "",      // Before install
    "install": "",         // During install
    "postinstall": "",     // After install
    
    // Version scripts
    "preversion": "",      // Before bump version
    "version": "",         // After bump version, before commit
    "postversion": "",     // After commit tag
    
    // Custom hooks
    "prebuild": "",        // Before build
    "build": "",           // Build
    "postbuild": ""        // After build
  }
}
```

---

## 🎯 Best Practices Summary

### **Module Systems**
- Use ES Modules for new projects
- Understand CommonJS for legacy Node.js code
- Use dynamic imports for code splitting
- Implement proper error handling for module loading

### **Bundlers**
- Choose Webpack for complex, large-scale applications
- Choose Vite for modern, fast development experience
- Implement code splitting for better performance
- Use appropriate source maps for debugging
- Optimize assets (images, fonts, CSS)

### **Package Management**
- Commit lock files to version control
- Use exact versions in production (`npm ci`, `--frozen-lockfile`)
- Regularly update dependencies and audit for security
- Use workspaces for monorepos
- Choose package manager based on project needs:
  - npm: Default, good for most projects
  - yarn: Good for workspaces, deterministic installs
  - pnpm: Best for disk space, speed, strictness

### **Development Workflow**
- Set up proper scripts in package.json
- Use pre-commit hooks for linting/testing
- Implement CI/CD with proper caching
- Monitor bundle size and performance
- Keep dependencies up to date

---

## 📚 Additional Resources

### **Further Reading**
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Webpack Documentation](https://webpack.js.org/concepts/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [npm Documentation](https://docs.npmjs.com/)
- [Yarn Documentation](https://yarnpkg.com/getting-started)
- [pnpm Documentation](https://pnpm.io/motivation)

### **Practice Exercises**
1. Convert a CommonJS project to ES Modules
2. Set up a monorepo with multiple packages
3. Configure Webpack/Vite for a React/TypeScript project
4. Create and publish an npm package
5. Implement code splitting in a large application
6. Set up a CI/CD pipeline with proper caching

---

## ✅ Progress Checklist

- [ ] **ES Modules**: Master import/export syntax, dynamic imports, module resolution
- [ ] **CommonJS**: Understand require/module.exports, interoperability with ES Modules
- [ ] **Webpack**: Configure loaders, plugins, code splitting, optimization
- [ ] **Vite**: Set up development server, plugins, build optimization
- [ ] **npm**: Manage dependencies, scripts, versioning, publishing
- [ ] **Yarn**: Understand workspaces, lockfiles, commands
- [ ] **pnpm**: Utilize content-addressable store, workspaces, efficiency features

---

**Mastering modules and tooling is essential for modern JavaScript development. These skills will make you more productive and help you build better, more maintainable applications!** 🚀