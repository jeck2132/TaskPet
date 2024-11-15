document.getElementById('alertButton').addEventListener('click', () => {
    alert('Button clicked!');
});

// Initialize UI components
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const dueDateInput = document.getElementById('dueDateInput');

// Load tasks from Chrome Storage when the page is loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listener for adding a task
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent form submission from refreshing the page

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

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    // assign removeTask function with the task and dueDate parameters
    deleteBtn.onclick = () => removeTask(li, task, dueDate);

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Function to remove a task or due date from the list and storage
function removeTask(li, task, dueDate) {
    li.remove();
    removeTaskFromStorage(task, dueDate);
}

// Save the task to Chrome Storage
function saveTaskToStorage(task, dueDate) {
    chrome.storage.sync.get('tasks', function(result) {
        const tasks = result.tasks || [];
        tasks.push({ task, dueDate });
        chrome.storage.sync.set({ tasks });
    });
}

// Load tasks from Chrome Storage
function loadTasks() {
    chrome.storage.sync.get('tasks', function(result) {
        const tasks = result.tasks || [];
        tasks.forEach(({ task, dueDate }) => addTask(task, dueDate));
    });
}

// Remove a task from Chrome Storage
function removeTaskFromStorage(task, dueDate) {
    chrome.storage.sync.get('tasks', function(result) {
        let tasks = result.tasks || [];
        tasks = tasks.filter(t => !(t.task === task && t.dueDate === dueDate));
        chrome.storage.sync.set({ tasks });
    });
}