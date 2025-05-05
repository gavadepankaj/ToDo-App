let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function editTask(index, field, value) {
    tasks[index][field] = value.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showToast("Task Updated");
}

function renderTasks() {
    const incompleteDiv = document.getElementById("incomplete-tasks");
    const completedDiv = document.getElementById("completed-tasks");
    const filter = document.getElementById("filter-tasks").value;

    incompleteDiv.innerHTML = "";
    completedDiv.innerHTML = "";

    tasks.forEach((task, index) => {
        if (
            (filter === "completed" && !task.completed) ||
            (filter === "incomplete" && task.completed)
        ) return;

        const div = document.createElement("div");
        div.className = "task";
        div.draggable = true;
        div.ondragstart = (e) => drag(e, index);
        div.dataset.index = index;

        div.innerHTML = `
        <strong contenteditable="true" onblur="editTask(${index}, 'title', this.innerText)">${task.title}</strong><br>
        <span contenteditable="true" onblur="editTask(${index}, 'description', this.innerText)">${task.description || ""}</span>
        <button onclick="deleteTask(${index})" class="delete-btn">Delete Task</button>
      `;

        (task.completed ? completedDiv : incompleteDiv).appendChild(div);
    });
}

document.getElementById("filter-tasks").addEventListener("change", renderTasks);


function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    showToast("🗑️ Task Deleted");
}

function addTask(title, description) {
    tasks.push({ title, description, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    showToast("Task Created");
}

function drag(ev, index) {
    ev.dataTransfer.setData("text", index);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const index = ev.dataTransfer.getData("text");
    const parent = ev.target.closest(".task-list");
    const isCompleted = parent.id === "completed-tasks";
    tasks[index].completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    showToast(isCompleted ? " Task Moved to Completed" : " Task Moved to Incomplete");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

document.getElementById("task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    if (title) {
        addTask(title, description);
        document.getElementById("task-form").reset();
    }
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.checked = localStorage.getItem("theme") === "dark";
if (themeToggle.checked) document.body.classList.add("dark");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeToggle.checked);
    localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
});

renderTasks();
