document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const dueDateInput = document.getElementById('dueDateInput');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthBar = document.getElementById('healthBar');
const healthDisplay = document.getElementById('healthDisplay');

let score = 0;
let health = 100;

// Update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Save the score to Chrome storage
function saveScoreToStorage() {
    chrome.storage.local.set({ score });
}

// Load the score from Chrome storage
function loadScoreFromStorage() {
    chrome.storage.local.get('score', function(result) {
        score = result.score || 0;
        updateScoreDisplay();
    });
}

// Update the health display
function updateHealthDisplay() {
    healthDisplay.textContent = `Health: ${health}`;
    healthBar.style.width = `${health}%`;

    // Update health bar color
    if (health >= 60) {
        healthBar.style.backgroundColor = 'green';
    } else if (health >= 20) {
        healthBar.style.backgroundColor = 'yellow';
    } else {
        healthBar.style.backgroundColor = 'red';
    }
}

// Increase health when a task is completed
function increaseHealth() {
    health = Math.min(health + 10, 100); // Cap health at 100
    updateHealthDisplay();
}

// Decrease health when a task is uncompleted or removed
function decreaseHealth() {
    health = Math.max(health - 10, 0); // Prevent negative health
    updateHealthDisplay();
}

// Load tasks and score from Chrome storage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadScoreFromStorage();
    updateHealthDisplay();
});

// Event listener for adding a task
taskForm.addEventListener('submit', function(e) {
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

// Function to add a task to the list
function addTask(task, dueDate) {
    const li = document.createElement('li');
    const dueDateObject = new Date(dueDate);
    const formattedDueDate = `${dueDateObject.toLocaleDateString()} - ${dueDateObject.toLocaleTimeString()}`;
    li.textContent = `${task} - Due: ${formattedDueDate}`;

    // Store task and due date in data attributes for easy access
    li.dataset.task = task;
    li.dataset.dueDate = dueDate;

    const checkBtn = document.createElement('button');
    checkBtn.textContent = '✓';
    checkBtn.className = 'check-btn';
    checkBtn.onclick = completeTask;

    const uncompleteBtn = document.createElement('button');
    uncompleteBtn.textContent = '✗';
    uncompleteBtn.className = 'uncomplete-btn';
    uncompleteBtn.onclick = uncompleteTask;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => removeTask(li);

    li.appendChild(checkBtn);
    li.appendChild(uncompleteBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to mark a task as completed
function completeTask(e) {
    const li = e.target.parentElement;
    const task = li.dataset.task;
    const dueDate = li.dataset.dueDate;

    increaseHealth(); // Increase health for a completed task
    score++;
    updateScoreDisplay();
    saveScoreToStorage();

    li.remove();// Remove from DOM
    removeTaskFromStorage(task, dueDate); // Remove from storage
    showNotification(`Task "${task}" marked as completed!`);
}
// Function to mark a task as uncompleted
function uncompleteTask(e) {
    const li = e.target.parentElement;
    const task = li.dataset.task;
    const dueDate = li.dataset.dueDate;

    decreaseHealth(); // Decrease health for an uncompleted task
    score = Math.max(score - 1, 0);
    updateScoreDisplay();
    saveScoreToStorage();

    li.remove();// Remove from DOM
    removeTaskFromStorage(task, dueDate); // Remove from storage
    showNotification(`Task "${task}" marked as uncompleted!`);
}

// Remove task from storage
function removeTaskFromStorage(task, dueDate) {
    chrome.storage.local.get('tasks', function(result) {
        let tasks = result.tasks || [];
        // Filter out the completed task
        tasks = tasks.filter(t => t.task !== task || t.dueDate !== dueDate);
        // Save the updated tasks list back to local storage
        chrome.storage.local.set({ tasks });
    });
}

// Function to remove a task from the list and storage
function removeTask(li) {
    const task = li.dataset.task;
    const dueDate = li.dataset.dueDate;
    
    li.remove(); // Remove from DOM
    removeTaskFromStorage(task, dueDate); // Remove from storage
}

// Save task to storage
function saveTaskToStorage(task, dueDate) {
    chrome.storage.local.get('tasks', function(result) {
        const tasks = result.tasks || [];
        tasks.push({ task, dueDate });
        chrome.storage.local.set({ tasks });
    });
}

// Load tasks from Chrome Storage
function loadTasks() {
    chrome.storage.local.get('tasks', function(result) {
        const tasks = result.tasks || [];
        tasks.forEach(({ task, dueDate }) => addTask(task, dueDate));
    });
}

// Function to show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    
    sidebar.classList.toggle('open');
    content.classList.toggle('shifted');
}

document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});