class StackNode {
    constructor(data) {
        this.value = data;
        this.next = null;
    }
}

class Stack {
    constructor(size) {
        this.head = null;
        this.size = size;
        this.count = 0;
    }

    push(data) {
        if (this.count >= this.size) {
            return "Stack is full";
        }
        
        const newNode = new StackNode(data);
        newNode.next = this.head;
        this.head = newNode;
        this.count++;
        return `Pushed: ${data}`;
    }

    pop() {
        if (this.head === null) {
            return "Stack is empty";
        }
        
        const removedValue = this.head.value;
        this.head = this.head.next;
        this.count--;
        return `Removed: ${removedValue}`;
    }

    peek() {
        if (this.head === null) {
            return "Stack is empty";
        }
        return `Top value: ${this.head.value}`;
    }

    isEmpty() {
        return this.head === null ? "Stack is empty" : "Stack is not empty";
    }

    isFull() {
        return this.count === this.size ? "Stack is full" : "Stack is not full";
    }

    getStackArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.value);
            current = current.next;
        }
        return arr;
    }
}

let stack = null;

function initStack() {
    const size = parseInt(document.getElementById('stackSize').value);
    if (!size || size <= 0 || size > 10) {
        displayOutput("⚠️ Please enter a valid stack size (1-10)");
        return;
    }
    
    stack = new Stack(size);
    document.getElementById('operations').classList.add('show');
    displayOutput(`✅ Stack initialized with size: ${size}`);
    updateStackVisual();
    updateStackInfo();
}

function push() {
    if (!stack) {
        displayOutput("⚠️ Please initialize stack first");
        return;
    }
    
    const value = parseInt(document.getElementById('valueInput').value);
    if (isNaN(value)) {
        displayOutput("⚠️ Please enter a valid number");
        return;
    }
    
    const result = stack.push(value);
    displayOutput(result.includes('full') ? `❌ ${result}` : `✅ ${result}`);
    document.getElementById('valueInput').value = '';
    updateStackVisual();
    updateStackInfo();
}

function pop() {
    if (!stack) {
        displayOutput("⚠️ Please initialize stack first");
        return;
    }
    
    const result = stack.pop();
    displayOutput(result.includes('empty') ? `❌ ${result}` : `✅ ${result}`);
    updateStackVisual();
    updateStackInfo();
}

function peek() {
    if (!stack) {
        displayOutput("⚠️ Please initialize stack first");
        return;
    }
    
    const result = stack.peek();
    displayOutput(result.includes('empty') ? `❌ ${result}` : `👁️ ${result}`);
}

function isEmpty() {
    if (!stack) {
        displayOutput("⚠️ Please initialize stack first");
        return;
    }
    
    const result = stack.isEmpty();
    displayOutput(result.includes('empty') ? `✅ ${result}` : `❌ ${result}`);
}

function isFull() {
    if (!stack) {
        displayOutput("⚠️ Please initialize stack first");
        return;
    }
    
    const result = stack.isFull();
    displayOutput(result.includes('full') ? `✅ ${result}` : `❌ ${result}`);
}

function displayOutput(message) {
    document.getElementById('output').textContent = message;
}

function updateStackVisual() {
    const visual = document.getElementById('stackVisual');
    
    if (!stack) {
        visual.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-stack-overflow"></i>
                <p>Initialize stack to begin</p>
            </div>`;
        return;
    }
    
    const stackArray = stack.getStackArray();
    
    if (stackArray.length === 0) {
        visual.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Stack is empty</p>
            </div>`;
        return;
    }
    
    visual.innerHTML = '';
    stackArray.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = index === 0 ? 'stack-item top' : 'stack-item';
        item.textContent = value;
        item.title = index === 0 ? 'Top of stack' : `Position ${stackArray.length - index}`;
        visual.appendChild(item);
    });
}

function updateStackInfo() {
    const info = document.getElementById('stackInfo');
    if (!stack) {
        info.innerHTML = '';
        return;
    }
    
    info.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📊 Size: ${stack.count}/${stack.size}</span>
            <span>📈 Usage: ${Math.round((stack.count/stack.size)*100)}%</span>
        </div>`;
}