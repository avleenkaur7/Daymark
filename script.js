const form = document.querySelector("#form");
const input = document.querySelector("#input");
const list = document.querySelector("#list");
const categoryBox = document.querySelector("#category");
const categoryButtons = document.querySelectorAll(".cat-btn");
const submitBtn = document.querySelector("#form button[type='submit']");
const cancelBtn = document.querySelector("#cancel");

let t = ["fitness", "study", "shopping", "work", "self-care", "meals"];

let pictures = [
    "fitness.png",
    "study.png",
    "shopping.png",
    "work.png",
    "self-care.png",
    "meals.png"
];

let tasks = [];
let selectedCategory = "";   // category chosen with the buttons
let editingId = null;        // key of the task being edited (null = adding new)

// ---------- category buttons ----------
function selectCategory(value) {
    selectedCategory = value;
    categoryButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.category === value);
    });
}

categoryButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        selectCategory(btn.dataset.category);
        categoryBox.classList.remove("need");
    });
});

// ---------- storage: one key per task ----------
function loadTasks() {
    tasks = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith("task_")) {
            const task = JSON.parse(localStorage.getItem(key));
            tasks.push({ ...task, id: key });
        }
    }

    tasks.sort((a, b) => a.id.localeCompare(b.id));
}

function saveTask(item) {
    localStorage.setItem(item.id, JSON.stringify({
        text: item.text,
        category: item.category,
        completed: item.completed
    }));
}

// ---------- edit mode ----------
function startEditing(item) {
    editingId = item.id;

    input.value = item.text;           // fill the input
    selectCategory(item.category);     // highlight the task's category

    submitBtn.textContent = "Save changes";
    cancelBtn.hidden = false;

    displayTasks();                    // highlights the task being edited

    form.scrollIntoView({ behavior: "smooth", block: "center" });
    input.focus({ preventScroll: true });
}

function stopEditing() {
    editingId = null;
    input.value = "";
    selectCategory("");

    submitBtn.textContent = "+ Add task";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", function () {
    stopEditing();
    displayTasks();
});

// ---------- show tasks ----------
function displayTasks() {
    list.innerHTML = "";

    tasks.forEach((item) => {
        const task = document.createElement("li");
        task.className = "task";

        if (item.id === editingId) {
            task.classList.add("editing");
        }

        const picIndex = t.indexOf(item.category);

        task.innerHTML = `
            <img src="${pictures[picIndex]}" alt="${item.category}" class="category-img">
            <input type="checkbox" ${item.completed ? "checked" : ""}>
            <span></span>
            <button class="delete">Delete</button>
            <button class="edit">Edit</button>
        `;

        const span = task.querySelector("span");
        span.textContent = item.text;

        if (item.completed) {
            span.classList.add("completed");
        }

        // tick / untick
        task.querySelector("input").addEventListener("change", function () {
            item.completed = this.checked;
            saveTask(item);
            displayTasks();
        });

        // delete
        task.querySelector(".delete").addEventListener("click", function () {
            localStorage.removeItem(item.id);

            if (item.id === editingId) {
                stopEditing();
            }

            loadTasks();
            displayTasks();
        });

        // edit: fill the form with this task
        task.querySelector(".edit").addEventListener("click", function () {
            startEditing(item);
        });

        list.appendChild(task);
    });
}

// ---------- add new task OR save changes ----------
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") return;

    if (!selectedCategory) {
        categoryBox.classList.add("need");   // red outline: pick a category
        return;
    }

    if (editingId) {
        // update the SAME task (same key), do not create a new one
        const item = tasks.find(function (x) {
            return x.id === editingId;
        });

        if (item) {
            item.text = text;
            item.category = selectedCategory;
            saveTask(item);
        }

        stopEditing();
    } else {
        const id = "task_" + Date.now();

        localStorage.setItem(id, JSON.stringify({
            text: text,
            category: selectedCategory,
            completed: false
        }));

        input.value = "";
    }

    loadTasks();
    displayTasks();
});

loadTasks();
displayTasks();