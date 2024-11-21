// Initialize UI components
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const scoreDisplay = document.getElementById('scoreDisplay');
let score = 0; // Default score is 0

// Function to update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    console.log('Score updated:', score);  // Debugging line
}

// Update pet health in localStorage
function updatePetHealth(amount) {
    let currentHealth = parseInt(localStorage.getItem('petHealth')) || 100;
    currentHealth = Math.min(Math.max(currentHealth + amount, 0), 100); // Clamp between 0 and 100
    localStorage.setItem('petHealth', currentHealth);
}

// Save and load score using chrome.storage.sync
function saveScoreToStorage() {
    chrome.storage.sync.set({ score: score }, () => {
        console.log('Score saved to storage:', score); // Debugging line
    });
}

function loadScoreFromStorage() {
    chrome.storage.sync.get('score', (result) => {
        score = result.score || 0;  // Default score is 0 if not found
        updateScoreDisplay();  // Ensure score is displayed correctly after loading
    });
}

// Event listener for adding a task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    if (task && dueDate) {
        const dueDateObject = new Date(dueDate);
        if (dueDateObject < new Date()) {
            alert("Due date must be in the future.");
            return;
        }
        addTask(task, dueDate);
        taskInput.value = '';
        dueDateInput.value = '';
        saveTaskToStorage(task, dueDate);
    }
});

// Add task to list
function addTask(task, dueDate) {
    const li = document.createElement('li');
    li.textContent = `${task} - Due: ${new Date(dueDate).toLocaleString()}`;
    const checkBtn = document.createElement('button');
    checkBtn.textContent = '✓';
    checkBtn.className = 'check-btn';
    checkBtn.onclick = (e) => completeTask(e, 10, task, dueDate, true); // Increase health on completion

    const uncompleteBtn = document.createElement('button');
    uncompleteBtn.textContent = '✗';
    uncompleteBtn.className = 'uncomplete-btn';
    uncompleteBtn.onclick = (e) => completeTask(e, -10, task, dueDate, false); // Decrease health on failure

    li.append(checkBtn, uncompleteBtn);
    taskList.appendChild(li);
}

// Mark task as completed/failed
function completeTask(e, healthChange, task, dueDate, isCompleted) {
    console.log('completeTask called'); // Debugging line to check if this is being triggered
    e.target.parentElement.remove(); // Remove task from list
    
    // Update score based on task completion
    if (isCompleted) {
        score += 1; // Increment score if completed
        console.log('Task completed. Incremented score:', score); // Debugging line
    } else {
        score = Math.max(score - 1, 0); // Decrement score but not below zero
        console.log('Task failed. Decremented score:', score); // Debugging line
    }

    updateScoreDisplay();  // Update score display in real-time
    saveScoreToStorage();  // Save updated score to storage

    // Update pet health regardless of score
    updatePetHealth(healthChange); 

    // Get current tasks from storage
    chrome.storage.sync.get('tasks', (result) => {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.filter(t => {
            // Remove the task from the array if it is marked as completed or failed
            return !(t.task === task && t.dueDate === dueDate);
        });

        // Save the updated tasks (with the deleted task removed) to storage
        chrome.storage.sync.set({ tasks: updatedTasks });
    });
}

// Save/load tasks to/from chrome storage
function saveTaskToStorage(task, dueDate) {
    chrome.storage.sync.get('tasks', (result) => {
        const tasks = result.tasks || [];
        tasks.push({ task, dueDate });
        chrome.storage.sync.set({ tasks });
    });
}

function loadTasks() {
    chrome.storage.sync.get('tasks', (result) => {
        (result.tasks || []).forEach(({ task, dueDate }) => addTask(task, dueDate));
    });
}

// Open pet display
document.getElementById('petButton').addEventListener('click', () => {
    window.open('petDisplay.html', 'Pet Display', 'width=640,height=480');
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadScoreFromStorage();  // Load the score when the page loads
});