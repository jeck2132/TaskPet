document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});

// Initialize UI components
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const scoreDisplay = document.getElementById('scoreDisplay');
let score = 0;

// Update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Update pet health in localStorage
function updatePetHealth(amount) {
    let currentHealth = parseInt(localStorage.getItem('petHealth')) || 100;
    currentHealth = Math.min(Math.max(currentHealth + amount, 0), 100); // Clamp between 0 and 100
    localStorage.setItem('petHealth', currentHealth);
}

// Save and load score
function saveScoreToStorage() {
    chrome.storage.sync.set({ score });
}

function loadScoreFromStorage() {
    chrome.storage.sync.get('score', (result) => {
        score = result.score || 0;
        updateScoreDisplay();
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
    checkBtn.onclick = (e) => completeTask(e, 10); // Increase health
    const uncompleteBtn = document.createElement('button');
    uncompleteBtn.textContent = '✗';
    uncompleteBtn.className = 'uncomplete-btn';
    uncompleteBtn.onclick = (e) => completeTask(e, -10); // Decrease health
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => removeTask(li, task, dueDate);
    li.append(checkBtn, uncompleteBtn, deleteBtn);
    taskList.appendChild(li);
}

// Mark task as completed/failed
function completeTask(e, healthChange) {
    e.target.parentElement.remove();
    score += healthChange > 0 ? 1 : -1;
    updateScoreDisplay();
    saveScoreToStorage();
    updatePetHealth(healthChange);
}

// Save/load tasks
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
    loadScoreFromStorage();
});