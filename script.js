document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});
// Initialize UI components
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Load tasks from Chrome Storage when the page is loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listener for adding a task
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent form submission from refreshing the page
    const task = taskInput.value.trim();
    if (task) {
        addTask(task);
        taskInput.value = ''; // Clear input after adding
        saveTaskToStorage(task);
    }
});

// Function to add a task to the list
function addTask(task) {
    const li = document.createElement('li');
    li.textContent = task;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = removeTask;

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to remove a task from the list and storage
function removeTask(e) {
    const li = e.target.parentElement;
    const task = li.firstChild.textContent;

    // Remove from UI
    li.remove();

    // Remove from Chrome Storage
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