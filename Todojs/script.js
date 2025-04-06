document.addEventListener("DOMContentLoaded", loadTasks);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let category = document.getElementById("taskCategory").value;
    if (!taskInput) return;

    let task = { id: Date.now(), text: taskInput, category, completed: false };
    tasks.push(task);
    saveTasks();
    renderTasks();
    document.getElementById("taskInput").value = "";
}

function renderTasks(filter = "All") {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks
        .filter(task => filter === "All" || task.category === filter)
        .forEach(task => {
            let li = document.createElement("li");
            li.className = task.completed ? "completed" : "";
            li.draggable = true;
            li.setAttribute("data-id", task.id);
            
            li.innerHTML = `
                <input type="checkbox" onclick="toggleTask(${task.id})" ${task.completed ? "checked" : ""}>
                <span>${task.text} - <em>${task.category}</em></span>
                <button onclick="editTask(${task.id})">EDIT</button>
                <button onclick="deleteTask(${task.id})">DELETE</button>
            `;

            li.addEventListener("dragstart", dragStart);
            li.addEventListener("dragover", dragOver);
            li.addEventListener("drop", drop);
            taskList.appendChild(li);
        });
}

function toggleTask(id) {
    let task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

function editTask(id) {
    let task = tasks.find(t => t.id === id);
    let newText = prompt("Edit task:", task.text);
    if (newText !== null) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    renderTasks();
}

function filterTasks(category) {
    renderTasks(category);
}

// Drag & Drop functions
let draggedItem = null;

function dragStart(event) {
    draggedItem = event.target;
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let droppedId = event.dataTransfer.getData("text/plain");
    let droppedItem = document.querySelector(`[data-id="${droppedId}"]`);
    let taskList = document.getElementById("taskList");

    if (draggedItem !== droppedItem) {
        let children = [...taskList.children];
        let draggedIndex = children.indexOf(draggedItem);
        let droppedIndex = children.indexOf(droppedItem);

        if (draggedIndex > droppedIndex) {
            taskList.insertBefore(draggedItem, droppedItem);
        } else {
            taskList.insertBefore(draggedItem, droppedItem.nextSibling);
        }

        // Reorder tasks in array
        let draggedTask = tasks.find(t => t.id == droppedId);
        tasks = tasks.filter(t => t.id != droppedId);
        tasks.splice(droppedIndex, 0, draggedTask);

        saveTasks();
    }
}
