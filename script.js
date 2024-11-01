document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});
// Initialize UI components
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const scoreDisplay = document.getElementById('scoreDisplay'); // Display element for score

let score = 0; // Initialize the score

// Update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Save the score to Chrome storage
function saveScoreToStorage() {
    chrome.storage.sync.set({ score });
}

// Load the score from Chrome storage
function loadScoreFromStorage() {
    chrome.storage.sync.get('score', function(result) {
        score = result.score || 0; // Default to 0 if no score is saved
        updateScoreDisplay();
    });
}

// Load tasks and score from Chrome storage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadScoreFromStorage(); // Load the saved score
});

// Event listener for adding a task
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (task) {
        addTask(task);
        taskInput.value = ''; 
        saveTaskToStorage(task);
    }
});

// Function to add a task to the list
function addTask(task) {
    const li = document.createElement('li');
    li.textContent = task;

    // Checkmark button for completed tasks
    const checkBtn = document.createElement('button');
    checkBtn.textContent = '✓';
    checkBtn.className = 'check-btn';
    checkBtn.onclick = completeTask;

    // X button for uncompleted tasks
    const uncompleteBtn = document.createElement('button');
    uncompleteBtn.textContent = '✗';
    uncompleteBtn.className = 'uncomplete-btn';
    uncompleteBtn.onclick = uncompleteTask;

    // Delete button to remove task without affecting score
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = deleteTask;

    // Append buttons to the task item
    li.appendChild(checkBtn);
    li.appendChild(uncompleteBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to mark a task as completed
function completeTask(e) {
    const li = e.target.parentElement;
    const task = li.firstChild.textContent;

    // Increase the score for a completed task
    score++;
    updateScoreDisplay();
    saveScoreToStorage(); // Save the updated score to storage

    // Remove the task from the list and Chrome storage
    li.remove();
    removeTaskFromStorage(task);
}

// Function to mark a task as uncompleted
function uncompleteTask(e) {
    const li = e.target.parentElement;
    const task = li.firstChild.textContent;

    // Decrease the score for an uncompleted task
    score--;
    updateScoreDisplay();
    saveScoreToStorage(); // Save the updated score to storage

    // Remove the task from the list and Chrome storage
    li.remove();
    removeTaskFromStorage(task);
}

// Function to delete a task without affecting the score
function deleteTask(e) {
    const li = e.target.parentElement;
    const task = li.firstChild.textContent;

    // Remove from UI and storage without changing score
    li.remove();
    removeTaskFromStorage(task);
}

// Save the task to Chrome Storage
function saveTaskToStorage(task) {
    chrome.storage.sync.get('tasks', function(result) {
        const tasks = result.tasks || [];
        tasks.push(task);
        chrome.storage.sync.set({ tasks });
    });
}

// Load tasks from Chrome Storage
function loadTasks() {
    chrome.storage.sync.get('tasks', function(result) {
        const tasks = result.tasks || [];
        tasks.forEach(task => addTask(task));
    });
}

// Remove a task from Chrome Storage
function removeTaskFromStorage(task) {
    chrome.storage.sync.get('tasks', function(result) {
        let tasks = result.tasks || [];
        tasks = tasks.filter(t => t !== task);
        chrome.storage.sync.set({ tasks });
    });
}
