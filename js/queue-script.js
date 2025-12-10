class Queue {
    constructor(size) {
        this.size = size;
        this.items = [];
        this.count = 0;
    }

    enqueue(data) {
        if (this.count >= this.size) {
            return { success: false, message: "Queue is full" };
        }
        this.items.push(data);
        this.count++;
        return { success: true, message: `Enqueued ${data}` };
    }

    dequeue() {
        if (this.count === 0) {
            return { success: false, message: "Queue is empty" };
        }
        const removed = this.items.shift();
        this.count--;
        return { success: true, message: `The value ${removed} has been removed` };
    }

    peek() {
        if (this.count === 0) {
            return { success: false, message: "Queue is empty" };
        }
        return { success: true, message: `The front value is ${this.items[0]}` };
    }

    isEmpty() {
        const empty = this.count === 0;
        return { success: true, message: empty ? "Queue is empty" : "Queue is not empty" };
    }

    isFull() {
        const full = this.count === this.size;
        return { success: true, message: full ? "The queue is full" : "The queue is not full" };
    }
}

let queue = null;

function initQueue() {
    const sizeInput = document.getElementById('queueSize');
    const size = parseInt(sizeInput.value);
    
    if (!size || size < 1 || size > 10) {
        showOutput("Please enter a valid size (1-10)", false);
        return;
    }
    
    queue = new Queue(size);
    document.getElementById('operations').classList.add('active');
    showOutput(`Queue initialized with size ${size}`, true);
    updateVisualization();
}

function enqueue() {
    if (!queue) {
        showOutput("Please initialize queue first", false);
        return;
    }
    
    const valueInput = document.getElementById('valueInput');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        showOutput("Please enter a valid number", false);
        return;
    }
    
    const result = queue.enqueue(value);
    showOutput(result.message, result.success);
    
    if (result.success) {
        valueInput.value = '';
        updateVisualization();
    }
}

function dequeue() {
    if (!queue) {
        showOutput("Please initialize queue first", false);
        return;
    }
    
    const result = queue.dequeue();
    showOutput(result.message, result.success);
    
    if (result.success) {
        updateVisualization();
    }
}

function peek() {
    if (!queue) {
        showOutput("Please initialize queue first", false);
        return;
    }
    
    const result = queue.peek();
    showOutput(result.message, result.success);
}

function isEmpty() {
    if (!queue) {
        showOutput("Please initialize queue first", false);
        return;
    }
    
    const result = queue.isEmpty();
    showOutput(result.message, true);
}

function isFull() {
    if (!queue) {
        showOutput("Please initialize queue first", false);
        return;
    }
    
    const result = queue.isFull();
    showOutput(result.message, true);
}

function showOutput(message, success) {
    const output = document.getElementById('output');
    output.innerHTML = `<i class="fas fa-${success ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
    output.style.color = success ? '#48bb78' : '#f56565';
    output.style.borderColor = success ? '#48bb78' : '#f56565';
}

function updateVisualization() {
    const visual = document.getElementById('queueVisual');
    const info = document.getElementById('queueInfo');
    
    if (!queue || queue.count === 0) {
        visual.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-arrow-right"></i>
                <p>Queue is empty</p>
            </div>
        `;
    } else {
        visual.innerHTML = queue.items.map((item, index) => 
            `<div class="queue-node ${index === 0 ? 'front' : ''}">${item}</div>`
        ).join('');
    }
    
    info.innerHTML = `
        <div class="info-item">
            <div class="label">Size</div>
            <div class="value">${queue ? queue.size : 0}</div>
        </div>
        <div class="info-item">
            <div class="label">Count</div>
            <div class="value">${queue ? queue.count : 0}</div>
        </div>
        <div class="info-item">
            <div class="label">Front</div>
            <div class="value">${queue && queue.count > 0 ? queue.items[0] : '-'}</div>
        </div>
        <div class="info-item">
            <div class="label">Rear</div>
            <div class="value">${queue && queue.count > 0 ? queue.items[queue.count - 1] : '-'}</div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateVisualization();
});