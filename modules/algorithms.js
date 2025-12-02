// Algorithms Module - Generates trace steps for visualization
class Algorithms {
    constructor() {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.currentTrace = [];
    }

    // Sorting Algorithms
    bubbleSort(arr) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.currentTrace = [];
        
        const n = arr.length;
        const trace = [];
        let array = [...arr];
        
        trace.push({
            type: 'init',
            array: [...array],
            description: 'Initial array'
        });
        
        for (let i = 0; i < n - 1; i++) {
            trace.push({
                type: 'highlight',
                indices: [i],
                description: `Starting pass ${i + 1}`
            });
            
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisonCount++;
                trace.push({
                    type: 'compare',
                    indices: [j, j + 1],
                    description: `Comparing arr[${j}] = ${array[j]} and arr[${j + 1}] = ${array[j + 1]}`
                });
                
                if (array[j] > array[j + 1]) {
                    this.swapCount++;
                    // Swap
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    
                    trace.push({
                        type: 'swap',
                        indices: [j, j + 1],
                        values: [array[j], array[j + 1]],
                        description: `Swapping arr[${j}] and arr[${j + 1}]`
                    });
                }
            }
            
            trace.push({
                type: 'sorted',
                indices: [n - i - 1],
                description: `Element arr[${n - i - 1}] is now in its final position`
            });
        }
        
        trace.push({
            type: 'final',
            array: [...array],
            description: 'Array is now sorted',
            metrics: {
                comparisons: this.comparisonCount,
                swaps: this.swapCount
            }
        });
        
        return trace;
    }

    selectionSort(arr) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.currentTrace = [];
        
        const n = arr.length;
        const trace = [];
        let array = [...arr];
        
        trace.push({
            type: 'init',
            array: [...array],
            description: 'Initial array'
        });
        
        for (let i = 0; i < n - 1; i++) {
            trace.push({
                type: 'highlight',
                indices: [i],
                description: `Starting iteration ${i + 1}, looking for minimum from position ${i}`
            });
            
            let minIdx = i;
            
            for (let j = i + 1; j < n; j++) {
                this.comparisonCount++;
                trace.push({
                    type: 'compare',
                    indices: [minIdx, j],
                    description: `Comparing arr[${minIdx}] = ${array[minIdx]} with arr[${j}] = ${array[j]}`
                });
                
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                    trace.push({
                        type: 'highlight',
                        indices: [minIdx],
                        description: `New minimum found at index ${minIdx}`
                    });
                }
            }
            
            if (minIdx !== i) {
                this.swapCount++;
                // Swap
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                
                trace.push({
                    type: 'swap',
                    indices: [i, minIdx],
                    values: [array[i], array[minIdx]],
                    description: `Swapping arr[${i}] with minimum at arr[${minIdx}]`
                });
            }
            
            trace.push({
                type: 'sorted',
                indices: [i],
                description: `Element arr[${i}] is now in its final position`
            });
        }
        
        trace.push({
            type: 'final',
            array: [...array],
            description: 'Array is now sorted',
            metrics: {
                comparisons: this.comparisonCount,
                swaps: this.swapCount
            }
        });
        
        return trace;
    }

    insertionSort(arr) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.currentTrace = [];
        
        const n = arr.length;
        const trace = [];
        let array = [...arr];
        
        trace.push({
            type: 'init',
            array: [...array],
            description: 'Initial array'
        });
        
        for (let i = 1; i < n; i++) {
            trace.push({
                type: 'highlight',
                indices: [i],
                description: `Processing element at index ${i}: ${array[i]}`
            });
            
            let key = array[i];
            let j = i - 1;
            
            trace.push({
                type: 'compare_start',
                indices: [i],
                description: `Finding correct position for ${key}`
            });
            
            while (j >= 0 && array[j] > key) {
                this.comparisonCount++;
                trace.push({
                    type: 'compare',
                    indices: [j],
                    description: `Comparing ${array[j]} with ${key}`
                });
                
                this.swapCount++;
                array[j + 1] = array[j];
                
                trace.push({
                    type: 'shift',
                    indices: [j, j + 1],
                    description: `Shifting arr[${j}] to arr[${j + 1}]`
                });
                
                j--;
            }
            
            array[j + 1] = key;
            
            trace.push({
                type: 'insert',
                indices: [j + 1],
                value: key,
                description: `Inserting ${key} at position ${j + 1}`
            });
            
            trace.push({
                type: 'partial_sorted',
                indices: Array.from({length: i + 1}, (_, idx) => idx),
                description: `First ${i + 1} elements are now sorted`
            });
        }
        
        trace.push({
            type: 'final',
            array: [...array],
            description: 'Array is now sorted',
            metrics: {
                comparisons: this.comparisonCount,
                swaps: this.swapCount
            }
        });
        
        return trace;
    }

    mergeSort(arr) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.currentTrace = [];
        
        const trace = [];
        const array = [...arr];
        
        trace.push({
            type: 'init',
            array: [...array],
            description: 'Initial array'
        });
        
        const mergeSortRecursive = (arr, left, right, depth = 0) => {
            if (left >= right) return;
            
            const mid = Math.floor((left + right) / 2);
            
            trace.push({
                type: 'divide',
                range: [left, right],
                mid: mid,
                depth: depth,
                description: `Dividing array from index ${left} to ${right}, mid = ${mid}`
            });
            
            mergeSortRecursive(arr, left, mid, depth + 1);
            mergeSortRecursive(arr, mid + 1, right, depth + 1);
            
            trace.push({
                type: 'merge_start',
                left: [left, mid],
                right: [mid + 1, right],
                description: `Merging sorted halves [${left}, ${mid}] and [${mid + 1}, ${right}]`
            });
            
            this.merge(arr, left, mid, right, trace, depth);
        };
        
        this.merge = (arr, left, mid, right, trace, depth) => {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);
            
            let i = 0, j = 0, k = left;
            
            while (i < leftArr.length && j < rightArr.length) {
                this.comparisonCount++;
                trace.push({
                    type: 'compare',
                    indices: [left + i, mid + 1 + j],
                    values: [leftArr[i], rightArr[j]],
                    description: `Comparing ${leftArr[i]} from left half with ${rightArr[j]} from right half`
                });
                
                if (leftArr[i] <= rightArr[j]) {
                    arr[k] = leftArr[i];
                    trace.push({
                        type: 'merge_move',
                        from: 'left',
                        index: k,
                        value: leftArr[i],
                        description: `Taking ${leftArr[i]} from left half`
                    });
                    i++;
                } else {
                    arr[k] = rightArr[j];
                    trace.push({
                        type: 'merge_move',
                        from: 'right',
                        index: k,
                        value: rightArr[j],
                        description: `Taking ${rightArr[j]} from right half`
                    });
                    j++;
                }
                k++;
            }
            
            while (i < leftArr.length) {
                arr[k] = leftArr[i];
                trace.push({
                    type: 'merge_remain',
                    from: 'left',
                    index: k,
                    value: leftArr[i],
                    description: `Copying remaining element ${leftArr[i]} from left half`
                });
                i++;
                k++;
            }
            
            while (j < rightArr.length) {
                arr[k] = rightArr[j];
                trace.push({
                    type: 'merge_remain',
                    from: 'right',
                    index: k,
                    value: rightArr[j],
                    description: `Copying remaining element ${rightArr[j]} from right half`
                });
                j++;
                k++;
            }
            
            trace.push({
                type: 'merged',
                range: [left, right],
                description: `Successfully merged indices ${left} to ${right}`,
                array: arr.slice(left, right + 1)
            });
        };
        
        mergeSortRecursive(array, 0, array.length - 1);
        
        trace.push({
            type: 'final',
            array: [...array],
            description: 'Array is now sorted',
            metrics: {
                comparisons: this.comparisonCount,
                swaps: this.swapCount
            }
        });
        
        return trace;
    }

    quickSort(arr) {
        this.comparisonCount = 0;
        this.swapCount = 0;
        this.currentTrace = [];
        
        const trace = [];
        const array = [...arr];
        
        trace.push({
            type: 'init',
            array: [...array],
            description: 'Initial array'
        });
        
        const quickSortRecursive = (arr, low, high, depth = 0) => {
            if (low < high) {
                const pi = this.partition(arr, low, high, trace, depth);
                
                trace.push({
                    type: 'pivot_settled',
                    index: pi,
                    value: arr[pi],
                    description: `Pivot ${arr[pi]} is now at its correct position ${pi}`
                });
                
                quickSortRecursive(arr, low, pi - 1, depth + 1);
                quickSortRecursive(arr, pi + 1, high, depth + 1);
            }
        };
        
        this.partition = (arr, low, high, trace, depth) => {
            const pivot = arr[high];
            
            trace.push({
                type: 'pivot_select',
                index: high,
                value: pivot,
                description: `Selecting pivot: arr[${high}] = ${pivot}`
            });
            
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
                this.comparisonCount++;
                trace.push({
                    type: 'compare',
                    indices: [j, high],
                    values: [arr[j], pivot],
                    description: `Comparing arr[${j}] = ${arr[j]} with pivot ${pivot}`
                });
                
                if (arr[j] < pivot) {
                    i++;
                    
                    if (i !== j) {
                        this.swapCount++;
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        
                        trace.push({
                            type: 'swap',
                            indices: [i, j],
                            values: [arr[i], arr[j]],
                            description: `Swapping arr[${i}] and arr[${j}]`
                        });
                    }
                }
            }
            
            this.swapCount++;
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            
            trace.push({
                type: 'pivot_swap',
                indices: [i + 1, high],
                description: `Moving pivot to its correct position at index ${i + 1}`
            });
            
            return i + 1;
        };
        
        quickSortRecursive(array, 0, array.length - 1);
        
        trace.push({
            type: 'final',
            array: [...array],
            description: 'Array is now sorted',
            metrics: {
                comparisons: this.comparisonCount,
                swaps: this.swapCount
            }
        });
        
        return trace;
    }

    // Searching Algorithms
    linearSearch(arr, target) {
        this.comparisonCount = 0;
        this.currentTrace = [];
        
        const trace = [];
        
        trace.push({
            type: 'init',
            array: [...arr],
            target: target,
            description: `Searching for ${target} in the array`
        });
        
        for (let i = 0; i < arr.length; i++) {
            this.comparisonCount++;
            trace.push({
                type: 'compare',
                indices: [i],
                description: `Checking arr[${i}] = ${arr[i]}`
            });
            
            if (arr[i] === target) {
                trace.push({
                    type: 'found',
                    index: i,
                    description: `Found ${target} at index ${i}!`
                });
                return trace;
            }
            
            trace.push({
                type: 'not_found',
                index: i,
                description: `${arr[i]} is not equal to ${target}, moving to next element`
            });
        }
        
        trace.push({
            type: 'not_found_final',
            description: `Target ${target} not found in the array`,
            metrics: {
                comparisons: this.comparisonCount
            }
        });
        
        return trace;
    }

    binarySearch(arr, target) {
        this.comparisonCount = 0;
        this.currentTrace = [];
        
        const trace = [];
        let left = 0;
        let right = arr.length - 1;
        
        trace.push({
            type: 'init',
            array: [...arr],
            target: target,
            description: `Searching for ${target} in sorted array using binary search`
        });
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            trace.push({
                type: 'range',
                range: [left, right],
                mid: mid,
                description: `Search range: [${left}, ${right}], mid = ${mid}`
            });
            
            this.comparisonCount++;
            trace.push({
                type: 'compare',
                indices: [mid],
                description: `Comparing arr[${mid}] = ${arr[mid]} with target ${target}`
            });
            
            if (arr[mid] === target) {
                trace.push({
                    type: 'found',
                    index: mid,
                    description: `Found ${target} at index ${mid}!`
                });
                return trace;
            }
            
            if (arr[mid] < target) {
                trace.push({
                    type: 'go_right',
                    oldLeft: left,
                    newLeft: mid + 1,
                    description: `${arr[mid]} < ${target}, searching in right half`
                });
                left = mid + 1;
            } else {
                trace.push({
                    type: 'go_left',
                    oldRight: right,
                    newRight: mid - 1,
                    description: `${arr[mid]} > ${target}, searching in left half`
                });
                right = mid - 1;
            }
        }
        
        trace.push({
            type: 'not_found_final',
            description: `Target ${target} not found in the array`,
            metrics: {
                comparisons: this.comparisonCount
            }
        });
        
        return trace;
    }

    // Linked List Operations
    createLinkedList(values) {
        const trace = [];
        const nodes = values.map((val, idx) => ({
            value: val,
            next: idx < values.length - 1 ? idx + 1 : null,
            id: `node_${idx}`
        }));
        
        trace.push({
            type: 'll_init',
            nodes: [...nodes],
            description: 'Creating linked list with given values'
        });
        
        return trace;
    }

    insertLinkedList(head, position, value) {
        const trace = [];
        
        trace.push({
            type: 'll_insert_start',
            position: position,
            value: value,
            description: `Inserting ${value} at position ${position}`
        });
        
        // Implementation would generate steps for traversal and insertion
        // This is simplified for the example
        
        return trace;
    }

    // Tree Operations
    binarySearchTreeInsert(values) {
        const trace = [];
        
        trace.push({
            type: 'bst_init',
            values: [...values],
            description: 'Building Binary Search Tree from given values'
        });
        
        // BST insertion trace generation
        values.forEach((value, idx) => {
            trace.push({
                type: 'bst_insert_start',
                value: value,
                description: `Inserting ${value} into BST`
            });
        });
        
        return trace;
    }

    treeTraversal(tree, type = 'inorder') {
        const trace = [];
        
        trace.push({
            type: 'traversal_start',
            traversalType: type,
            description: `Starting ${type} traversal`
        });
        
        // Traversal implementation would go here
        
        return trace;
    }

    // Graph Algorithms
    bfs(graph, startNode) {
        const trace = [];
        
        trace.push({
            type: 'bfs_init',
            startNode: startNode,
            description: `Starting Breadth-First Search from node ${startNode}`
        });
        
        // BFS implementation trace
        
        return trace;
    }

    dfs(graph, startNode) {
        const trace = [];
        
        trace.push({
            type: 'dfs_init',
            startNode: startNode,
            description: `Starting Depth-First Search from node ${startNode}`
        });
        
        // DFS implementation trace
        
        return trace;
    }

    // Utility methods
    generateRandomArray(size = 10, min = 1, max = 100) {
        return Array.from({length: size}, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    getAlgorithmInfo(algorithm) {
        const info = {
            'bubbleSort': {
                name: 'Bubble Sort',
                timeComplexity: {
                    best: 'O(n)',
                    average: 'O(n²)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(1)',
                stable: true,
                description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
            },
            'selectionSort': {
                name: 'Selection Sort',
                timeComplexity: {
                    best: 'O(n²)',
                    average: 'O(n²)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(1)',
                stable: false,
                description: 'Divides the input list into two parts: sorted and unsorted. Repeatedly selects the smallest element from unsorted part and moves it to sorted part.'
            },
            'insertionSort': {
                name: 'Insertion Sort',
                timeComplexity: {
                    best: 'O(n)',
                    average: 'O(n²)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(1)',
                stable: true,
                description: 'Builds the final sorted array one item at a time by comparisons.'
            },
            'mergeSort': {
                name: 'Merge Sort',
                timeComplexity: {
                    best: 'O(n log n)',
                    average: 'O(n log n)',
                    worst: 'O(n log n)'
                },
                spaceComplexity: 'O(n)',
                stable: true,
                description: 'Divide and conquer algorithm that divides input array into two halves, sorts them recursively, and then merges the sorted halves.'
            },
            'quickSort': {
                name: 'Quick Sort',
                timeComplexity: {
                    best: 'O(n log n)',
                    average: 'O(n log n)',
                    worst: 'O(n²)'
                },
                spaceComplexity: 'O(log n)',
                stable: false,
                description: 'Divide and conquer algorithm that picks an element as pivot and partitions the array around the pivot.'
            },
            'linearSearch': {
                name: 'Linear Search',
                timeComplexity: {
                    best: 'O(1)',
                    average: 'O(n)',
                    worst: 'O(n)'
                },
                spaceComplexity: 'O(1)',
                description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.'
            },
            'binarySearch': {
                name: 'Binary Search',
                timeComplexity: {
                    best: 'O(1)',
                    average: 'O(log n)',
                    worst: 'O(log n)'
                },
                spaceComplexity: 'O(1)',
                description: 'Search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.'
            }
        };
        
        return info[algorithm] || {
            name: 'Unknown Algorithm',
            timeComplexity: { best: '?', average: '?', worst: '?' },
            spaceComplexity: '?',
            description: 'No information available.'
        };
    }
}

export { Algorithms };