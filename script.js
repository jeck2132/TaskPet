document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});

// Initialize UI components
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');
const scoreDisplay = document.getElementById('scoreDisplay');

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
    chrome.storage.sync.get('score', function (result) {
        score = result.score || 0; // Default to 0 if no score is saved
        updateScoreDisplay();
    });
}

// Load tasks and score from Chrome storage when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    loadScoreFromStorage();
});

// Event listener for adding a task
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const task = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (task && dueDate) {
        const dueDateObject = new Date(dueDate);

        // Check if the due date is in the future
        if (dueDateObject < new Date()) {
            alert("Due date must be in the future.");
            return; // Exit if the due date is not valid
        }

        addTask(task, dueDate);
        taskInput.value = ''; // Clear input
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
    deleteBtn.onclick = () => removeTask(li, task, dueDate);

    li.appendChild(checkBtn);
    li.appendChild(uncompleteBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to mark a task as completed
function completeTask(e) {
    const li = e.target.parentElement;
    score++;
    updateScoreDisplay();
    saveScoreToStorage();
    li.remove();
}

// Function to mark a task as uncompleted
function uncompleteTask(e) {
    const li = e.target.parentElement;
    score--;
    updateScoreDisplay();
    saveScoreToStorage();
    li.remove();
}

// Function to remove a task without affecting the score
function removeTask(li, task, dueDate) {
    li.remove();
    removeTaskFromStorage(task, dueDate);
}

// Save the task to Chrome Storage
function saveTaskToStorage(task, dueDate) {
    chrome.storage.sync.get('tasks', function (result) {
        const tasks = result.tasks || [];
        tasks.push({ task, dueDate });
        chrome.storage.sync.set({ tasks });
    });
}

// Load tasks from Chrome Storage
function loadTasks() {
    chrome.storage.sync.get('tasks', function (result) {
        const tasks = result.tasks || [];
        tasks.forEach(({ task, dueDate }) => addTask(task, dueDate));
    });
}

// Remove a task from Chrome Storage
function removeTaskFromStorage(task, dueDate) {
    chrome.storage.sync.get('tasks', function (result) {
        let tasks = result.tasks || [];
        tasks = tasks.filter(t => !(t.task === task && t.dueDate === dueDate));
        chrome.storage.sync.set({ tasks });
    });
}
