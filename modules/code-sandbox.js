// Code Sandbox Module - Safely executes user code
class CodeSandbox {
    constructor() {
        this.timeout = 5000; // 5 second timeout
        this.maxSteps = 10000; // Maximum operations
        this.consoleOutput = [];
        this.visualAPI = this.createVisualAPI();
    }

    createVisualAPI() {
        return {
            // Array operations
            compare: (index1, index2) => {
                this.consoleOutput.push(`🔍 Comparing elements at indices ${index1} and ${index2}`);
            },
            swap: (index1, index2) => {
                this.consoleOutput.push(`🔄 Swapping elements at indices ${index1} and ${index2}`);
            },
            highlight: (index, color = 'yellow') => {
                this.consoleOutput.push(`🌟 Highlighting element at index ${index} with color ${color}`);
            },
            setValue: (index, value) => {
                this.consoleOutput.push(`📝 Setting element at index ${index} to ${value}`);
            },
            
            // Linked list operations
            createNode: (value) => {
                this.consoleOutput.push(`🆕 Creating node with value ${value}`);
                return { value, next: null };
            },
            connectNodes: (node1, node2) => {
                this.consoleOutput.push(`🔗 Connecting nodes ${node1.value} -> ${node2.value}`);
            },
            
            // Tree operations
            createTreeNode: (value) => {
                this.consoleOutput.push(`🌳 Creating tree node with value ${value}`);
                return { value, left: null, right: null };
            },
            
            // Graph operations
            createGraphNode: (id) => {
                this.consoleOutput.push(`🕸️ Creating graph node ${id}`);
                return { id, edges: [] };
            },
            addEdge: (node1, node2, weight = 1) => {
                this.consoleOutput.push(`➕ Adding edge ${node1.id} -> ${node2.id} with weight ${weight}`);
            },
            
            // Utility
            wait: (ms) => {
                this.consoleOutput.push(`⏳ Waiting ${ms}ms`);
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            step: (description) => {
                this.consoleOutput.push(`📋 Step: ${description}`);
            }
        };
    }

    execute(code) {
        this.consoleOutput = [];
        const startTime = Date.now();
        let steps = 0;

        try {
            // Create a safe execution environment
            const sandbox = {
                console: {
                    log: (...args) => {
                        if (steps++ > this.maxSteps) {
                            throw new Error('Maximum step limit exceeded');
                        }
                        
                        if (Date.now() - startTime > this.timeout) {
                            throw new Error('Execution timeout');
                        }
                        
                        // Convert arguments to string
                        const message = args.map(arg => {
                            if (typeof arg === 'object') {
                                try {
                                    return JSON.stringify(arg, null, 2);
                                } catch {
                                    return String(arg);
                                }
                            }
                            return String(arg);
                        }).join(' ');
                        
                        this.consoleOutput.push(message);
                    },
                    error: (...args) => {
                        this.consoleOutput.push(`❌ ERROR: ${args.join(' ')}`);
                    },
                    warn: (...args) => {
                        this.consoleOutput.push(`⚠️ WARNING: ${args.join(' ')}`);
                    },
                    info: (...args) => {
                        this.consoleOutput.push(`ℹ️ INFO: ${args.join(' ')}`);
                    }
                },
                visual: this.visualAPI,
                
                // Safe Math functions
                Math: Object.freeze({
                    ...Math,
                    random: Math.random,
                    floor: Math.floor,
                    ceil: Math.ceil,
                    round: Math.round,
                    abs: Math.abs,
                    max: Math.max,
                    min: Math.min,
                    sqrt: Math.sqrt,
                    pow: Math.pow,
                    PI: Math.PI,
                    E: Math.E
                }),
                
                // Safe Array constructor
                Array: Array,
                
                // Safe Object constructor
                Object: Object,
                
                // Safe String constructor
                String: String,
                
                // Safe Number constructor
                Number: Number,
                
                // Safe Boolean constructor
                Boolean: Boolean,
                
                // Safe Date constructor (readonly)
                Date: class SafeDate {
                    constructor(...args) {
                        return new Date(...args);
                    }
                    static now() {
                        return Date.now();
                    }
                },
                
                // Safe JSON
                JSON: JSON,
                
                // Error handling
                Error: Error,
                TypeError: TypeError,
                RangeError: RangeError,
                
                // Promise (for async operations)
                Promise: Promise,
                
                // Set timeout limits
                setTimeout: (fn, delay) => {
                    if (delay > 1000) delay = 1000; // Cap at 1 second
                    return setTimeout(fn, delay);
                },
                clearTimeout: clearTimeout,
                setInterval: () => {
                    throw new Error('setInterval is not allowed in sandbox');
                }
            };

            // Wrap the user code in a function
            const wrappedCode = `
                (function() {
                    "use strict";
                    ${code}
                })();
            `;

            // Create a function from the wrapped code
            const func = new Function(...Object.keys(sandbox), wrappedCode);
            
            // Execute with sandboxed environment
            func(...Object.values(sandbox));
            
            return {
                success: true,
                output: this.consoleOutput.join('\n'),
                steps: steps,
                executionTime: Date.now() - startTime
            };
            
        } catch (error) {
            return {
                success: false,
                output: this.consoleOutput.join('\n') + `\n\n❌ Execution Error: ${error.message}`,
                error: error.message,
                executionTime: Date.now() - startTime
            };
        }
    }

    validateSyntax(code) {
        try {
            // Basic syntax validation
            new Function(code);
            return { valid: true, message: 'Syntax is valid' };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    getCodeMetrics(code) {
        const lines = code.split('\n').length;
        const chars = code.length;
        const words = code.split(/\s+/).filter(word => word.length > 0).length;
        
        // Count functions
        const functionMatches = code.match(/function\s+\w+|const\s+\w+\s*=\s*\(|let\s+\w+\s*=\s*\(|var\s+\w+\s*=\s*\(/g);
        const functions = functionMatches ? functionMatches.length : 0;
        
        // Count loops
        const loopMatches = code.match(/for\s*\(|while\s*\(|do\s*{/g);
        const loops = loopMatches ? loopMatches.length : 0;
        
        // Count conditionals
        const conditionalMatches = code.match(/if\s*\(|else\s*|switch\s*\(/g);
        const conditionals = conditionalMatches ? conditionalMatches.length : 0;
        
        return {
            lines,
            characters: chars,
            words,
            functions,
            loops,
            conditionals,
            complexity: Math.round((functions + loops + conditionals) / Math.max(lines, 1) * 100) / 100
        };
    }

    createExample(algorithm) {
        const examples = {
            bubbleSort: `function bubbleSort(arr) {
    let n = arr.length;
    console.log("Starting Bubble Sort...");
    
    for (let i = 0; i < n - 1; i++) {
        console.log(\`\\nPass \${i + 1}:\`);
        for (let j = 0; j < n - i - 1; j++) {
            visual.compare(j, j + 1);
            if (arr[j] > arr[j + 1]) {
                visual.swap(j, j + 1);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    console.log("✅ Sorting complete!");
    return arr;
}

// Test
const arr = [5, 3, 8, 4, 2];
console.log("Original:", arr);
console.log("Sorted:", bubbleSort(arr));`,

            linearSearch: `function linearSearch(arr, target) {
    console.log("Searching for", target, "in", arr);
    
    for (let i = 0; i < arr.length; i++) {
        visual.highlight(i);
        if (arr[i] === target) {
            console.log("✅ Found at index", i);
            return i;
        }
    }
    
    console.log("❌ Not found");
    return -1;
}

// Test
linearSearch([10, 20, 30, 40, 50], 30);`,

            linkedList: `class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        visual.createNode(value);
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }
    
    append(value) {
        const newNode = new Node(value);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            visual.connectNodes(current, newNode);
            current.next = newNode;
        }
        
        console.log("Appended:", value);
    }
}

// Test
const list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);`
        };

        return examples[algorithm] || examples.bubbleSort;
    }
}

export { CodeSandbox };