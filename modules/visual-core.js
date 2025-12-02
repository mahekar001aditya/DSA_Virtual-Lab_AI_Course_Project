// Visualization Core Module - Renders traces on canvas
class VisualCore {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.currentTrace = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.speed = 1.0;
        this.animationId = null;
        
        this.colors = {
            default: '#3b82f6',
            compare: '#f59e0b',
            swap: '#ef4444',
            sorted: '#10b981',
            highlight: '#8b5cf6',
            pivot: '#ec4899',
            found: '#10b981',
            background: '#f8fafc',
            text: '#0f172a'
        };
        
        this.setupCanvas();
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    loadTrace(trace) {
        this.currentTrace = trace;
        this.currentStep = 0;
        this.isPlaying = false;
        this.render();
    }

    play() {
        if (this.isPlaying || this.currentStep >= this.currentTrace.length - 1) return;
        
        this.isPlaying = true;
        this.animateStep();
    }

    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    stepForward() {
        if (this.currentStep < this.currentTrace.length - 1) {
            this.currentStep++;
            this.render();
        }
    }

    stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    goToStep(step) {
        if (step >= 0 && step < this.currentTrace.length) {
            this.currentStep = step;
            this.render();
        }
    }

    reset() {
        this.currentStep = 0;
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.render();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    animateStep() {
        if (!this.isPlaying || this.currentStep >= this.currentTrace.length - 1) {
            this.isPlaying = false;
            return;
        }

        const stepDuration = 1000 / this.speed; // ms per step
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= stepDuration) {
                this.currentStep++;
                this.render();
                
                if (this.currentStep < this.currentTrace.length - 1 && this.isPlaying) {
                    this.animationId = requestAnimationFrame(() => this.animateStep());
                } else {
                    this.isPlaying = false;
                }
            } else {
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    render() {
        this.clearCanvas();
        
        if (this.currentTrace.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        const currentStep = this.currentTrace[this.currentStep];
        
        switch (currentStep.type) {
            case 'init':
            case 'final':
                this.renderArray(currentStep.array, currentStep);
                break;
            case 'compare':
                this.renderArrayCompare(currentStep);
                break;
            case 'swap':
                this.renderArraySwap(currentStep);
                break;
            case 'sorted':
                this.renderArraySorted(currentStep);
                break;
            case 'highlight':
                this.renderArrayHighlight(currentStep);
                break;
            case 'divide':
                this.renderArrayDivide(currentStep);
                break;
            case 'merge':
                this.renderArrayMerge(currentStep);
                break;
            case 'll_init':
                this.renderLinkedList(currentStep.nodes);
                break;
            case 'bst_init':
                this.renderBST(currentStep);
                break;
            default:
                this.renderArray(currentStep.array || [], currentStep);
        }
        
        this.renderStepInfo(currentStep);
    }

    clearCanvas() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderEmptyState() {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'No visualization data. Run an algorithm to see it visualized.',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    renderArray(array, stepInfo) {
        const n = array.length;
        const barWidth = Math.min(40, (this.canvas.width - 40) / n);
        const maxHeight = this.canvas.height - 100;
        const maxValue = Math.max(...array);
        const spacing = 5;
        
        // Draw bars
        for (let i = 0; i < n; i++) {
            const x = 20 + i * (barWidth + spacing);
            const height = (array[i] / maxValue) * maxHeight;
            const y = this.canvas.height - 80 - height;
            
            // Bar color
            let color = this.colors.default;
            if (stepInfo.type === 'final') {
                color = this.colors.sorted;
            }
            
            // Draw bar
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, height);
            
            // Draw bar outline
            this.ctx.strokeStyle = this.colors.text;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, barWidth, height);
            
            // Draw value
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                array[i],
                x + barWidth / 2,
                y - 5
            );
            
            // Draw index
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '11px Inter';
            this.ctx.fillText(
                `[${i}]`,
                x + barWidth / 2,
                this.canvas.height - 60
            );
        }
    }

    renderArrayCompare(step) {
        const array = this.currentTrace[0].array;
        const n = array.length;
        const barWidth = Math.min(40, (this.canvas.width - 40) / n);
        const maxHeight = this.canvas.height - 100;
        const maxValue = Math.max(...array);
        const spacing = 5;
        
        for (let i = 0; i < n; i++) {
            const x = 20 + i * (barWidth + spacing);
            const height = (array[i] / maxValue) * maxHeight;
            const y = this.canvas.height - 80 - height;
            
            // Determine color
            let color = this.colors.default;
            if (step.indices.includes(i)) {
                color = this.colors.compare;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, height);
            
            this.ctx.strokeStyle = this.colors.text;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, barWidth, height);
            
            // Highlight comparison
            if (step.indices.includes(i)) {
                this.ctx.strokeStyle = this.colors.compare;
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(x - 2, y - 2, barWidth + 4, height + 4);
                
                // Draw comparison arrow
                if (step.indices.length === 2) {
                    const idx1 = step.indices[0];
                    const idx2 = step.indices[1];
                    if (i === idx1 || i === idx2) {
                        const x1 = 20 + idx1 * (barWidth + spacing) + barWidth / 2;
                        const x2 = 20 + idx2 * (barWidth + spacing) + barWidth / 2;
                        const arrowY = this.canvas.height - 80 - maxHeight - 20;
                        
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = this.colors.compare;
                        this.ctx.lineWidth = 2;
                        this.ctx.setLineDash([5, 3]);
                        this.ctx.moveTo(x1, arrowY);
                        this.ctx.lineTo(x2, arrowY);
                        this.ctx.stroke();
                        this.ctx.setLineDash([]);
                        
                        // Draw comparison symbol
                        this.ctx.fillStyle = this.colors.compare;
                        this.ctx.font = 'bold 16px Inter';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText('?', (x1 + x2) / 2, arrowY - 10);
                    }
                }
            }
            
            // Draw value and index
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(array[i], x + barWidth / 2, y - 5);
            this.ctx.font = '11px Inter';
            this.ctx.fillText(`[${i}]`, x + barWidth / 2, this.canvas.height - 60);
        }
    }

    renderArraySwap(step) {
        const array = this.currentTrace[0].array;
        const n = array.length;
        const barWidth = Math.min(40, (this.canvas.width - 40) / n);
        const maxHeight = this.canvas.height - 100;
        const maxValue = Math.max(...array);
        const spacing = 5;
        
        // Temporarily update array for visualization
        const tempArray = [...array];
        if (step.values) {
            tempArray[step.indices[0]] = step.values[0];
            tempArray[step.indices[1]] = step.values[1];
        }
        
        for (let i = 0; i < n; i++) {
            const x = 20 + i * (barWidth + spacing);
            const height = (tempArray[i] / maxValue) * maxHeight;
            const y = this.canvas.height - 80 - height;
            
            // Determine color
            let color = this.colors.default;
            if (step.indices.includes(i)) {
                color = this.colors.swap;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, height);
            
            this.ctx.strokeStyle = this.colors.text;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, barWidth, height);
            
            // Animate swap with arrow
            if (step.indices.includes(i) && step.indices.length === 2) {
                const idx1 = step.indices[0];
                const idx2 = step.indices[1];
                
                // Draw swap arrow
                const x1 = 20 + idx1 * (barWidth + spacing) + barWidth / 2;
                const x2 = 20 + idx2 * (barWidth + spacing) + barWidth / 2;
                const arrowY = this.canvas.height - 80 - maxHeight - 40;
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.colors.swap;
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([]);
                
                if (i === idx1) {
                    // Arrow from idx1 to idx2
                    this.drawArrow(x1, arrowY, x2, arrowY, this.colors.swap);
                }
            }
            
            // Draw value and index
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(tempArray[i], x + barWidth / 2, y - 5);
            this.ctx.font = '11px Inter';
            this.ctx.fillText(`[${i}]`, x + barWidth / 2, this.canvas.height - 60);
        }
    }

    renderArraySorted(step) {
        const array = this.currentTrace[0].array;
        const n = array.length;
        const barWidth = Math.min(40, (this.canvas.width - 40) / n);
        const maxHeight = this.canvas.height - 100;
        const maxValue = Math.max(...array);
        const spacing = 5;
        
        for (let i = 0; i < n; i++) {
            const x = 20 + i * (barWidth + spacing);
            const height = (array[i] / maxValue) * maxHeight;
            const y = this.canvas.height - 80 - height;
            
            // Determine color
            let color = this.colors.default;
            if (step.indices && step.indices.includes(i)) {
                color = this.colors.sorted;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, height);
            
            this.ctx.strokeStyle = this.colors.text;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, barWidth, height);
            
            // Draw checkmark for sorted elements
            if (step.indices && step.indices.includes(i)) {
                this.ctx.fillStyle = this.colors.sorted;
                this.ctx.font = 'bold 16px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('✓', x + barWidth / 2, y - 25);
            }
            
            // Draw value and index
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(array[i], x + barWidth / 2, y - 5);
            this.ctx.font = '11px Inter';
            this.ctx.fillText(`[${i}]`, x + barWidth / 2, this.canvas.height - 60);
        }
    }

    renderArrayHighlight(step) {
        const array = this.currentTrace[0].array;
        const n = array.length;
        const barWidth = Math.min(40, (this.canvas.width - 40) / n);
        const maxHeight = this.canvas.height - 100;
        const maxValue = Math.max(...array);
        const spacing = 5;
        
        for (let i = 0; i < n; i++) {
            const x = 20 + i * (barWidth + spacing);
            const height = (array[i] / maxValue) * maxHeight;
            const y = this.canvas.height - 80 - height;
            
            // Determine color
            let color = this.colors.default;
            if (step.indices && step.indices.includes(i)) {
                color = this.colors.highlight;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, height);
            
            this.ctx.strokeStyle = this.colors.text;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, barWidth, height);
            
            // Highlight with glow effect
            if (step.indices && step.indices.includes(i)) {
                this.ctx.strokeStyle = this.colors.highlight;
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(x - 2, y - 2, barWidth + 4, height + 4);
            }
            
            // Draw value and index
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(array[i], x + barWidth / 2, y - 5);
            this.ctx.font = '11px Inter';
            this.ctx.fillText(`[${i}]`, x + barWidth / 2, this.canvas.height - 60);
        }
    }

    renderLinkedList(nodes) {
        const nodeRadius = 30;
        const startX = 100;
        const startY = this.canvas.height / 2;
        const spacing = 100;
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const x = startX + i * spacing;
            const y = startY;
            
            // Draw node circle
            this.ctx.beginPath();
            this.ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors.default;
            this.ctx.fill();
            this.ctx.strokeStyle = this.colors.text;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw node value
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.value, x, y);
            
            // Draw node ID
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '11px Inter';
            this.ctx.fillText(`ID: ${node.id}`, x, y + nodeRadius + 15);
            
            // Draw pointer arrow
            if (node.next !== null && i < nodes.length - 1) {
                const nextX = startX + (i + 1) * spacing;
                this.drawArrow(
                    x + nodeRadius,
                    y,
                    nextX - nodeRadius,
                    y,
                    this.colors.text
                );
                
                // Draw "next" label
                this.ctx.fillStyle = this.colors.text;
                this.ctx.font = '12px Inter';
                this.ctx.fillText('next', (x + nextX) / 2, y - 20);
            }
            
            // Draw null pointer for last node
            if (node.next === null && i === nodes.length - 1) {
                this.ctx.fillStyle = this.colors.text;
                this.ctx.font = '14px Inter';
                this.ctx.fillText('NULL', x + nodeRadius + 40, y);
                
                this.ctx.beginPath();
                this.ctx.moveTo(x + nodeRadius, y);
                this.ctx.lineTo(x + nodeRadius + 30, y);
                this.ctx.strokeStyle = this.colors.text;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
        
        // Draw head pointer
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px Inter';
        this.ctx.fillText('head', startX - 50, startY);
        
        this.drawArrow(
            startX - 30,
            startY,
            startX - nodeRadius,
            startY,
            this.colors.highlight
        );
    }

    renderBST(step) {
        // Simplified BST rendering - would be more complex in full implementation
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Building BST with values: ${step.values.join(', ')}`,
            this.canvas.width / 2,
            50
        );
        
        this.ctx.fillStyle = this.colors.default;
        this.ctx.font = '14px Inter';
        this.ctx.fillText(
            'BST visualization would be shown here',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    renderStepInfo(step) {
        // Draw step info at top
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 18px Inter';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(
            `Step ${this.currentStep + 1} of ${this.currentTrace.length}`,
            20,
            30
        );
        
        // Draw description
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '14px Inter';
        this.ctx.textAlign = 'left';
        
        const description = step.description || 'No description available';
        const maxWidth = this.canvas.width - 40;
        const lines = this.wrapText(description, maxWidth);
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 20, 60 + index * 22);
        });
        
        // Draw metrics if available
        if (step.metrics) {
            this.ctx.font = '12px Inter';
            this.ctx.fillStyle = this.colors.text;
            
            let metricY = 60 + lines.length * 22 + 10;
            Object.entries(step.metrics).forEach(([key, value], idx) => {
                this.ctx.fillText(
                    `${key}: ${value}`,
                    20,
                    metricY + idx * 18
                );
            });
        }
    }

    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = this.ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }

    drawArrow(fromX, fromY, toX, toY, color) {
        const headLength = 10;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw arrow head
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}

export { VisualCore };