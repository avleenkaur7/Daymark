const form = document.querySelector("#form");
const input = document.querySelector("#input");
const list = document.querySelector("#list");
const category = document.querySelector("#category");

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

function loadTasks() {
    tasks = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith("task_")) {
            const task = JSON.parse(localStorage.getItem(key));

            tasks.push({
                ...task,
                id: key
            });
        }
    }
}
function displayTasks() {
    list.innerHTML = "";

    tasks.forEach((item, index) => {
        const task = document.createElement("li");
        task.className = "task";

        task.innerHTML = `
            <input type="checkbox" ${item.completed ? "checked" : ""}>
            <span></span>
            <button class="delete">Delete</button>
            <button class="edit">Edit</button>
        `;

        const span = task.querySelector("span");
        const emojiIndex = t.indexOf(item.category);

        span.innerHTML = `<img src="${pictures[emojiIndex]}" alt="${item.category}" class="category-img"> ${item.text}`;

        if (item.completed) {
            span.classList.add("completed");
        }

        task.querySelector("input").addEventListener("change", function () {
            tasks[index].completed = this.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            displayTasks();
        });

        task.querySelector(".delete").addEventListener("click", function () {
            localStorage.removeItem(item.id);

            loadTasks();
            displayTasks();
        });

        task.querySelector(".edit").addEventListener("click", function () {
            const newText = prompt("Edit your task:", item.text);

            if (newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim();
                localStorage.setItem("tasks", JSON.stringify(tasks));
                displayTasks();
            }
        });

        list.appendChild(task);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (input.value.trim() === "") return;

    const selectedCategory = category.value;

    if (!selectedCategory) return;

    const id = "task_" + Date.now();

    const newTask = {
        text: input.value.trim(),
        category: selectedCategory,
        completed: false
    };

    localStorage.setItem(id, JSON.stringify(newTask));

    loadTasks();
    displayTasks();

    input.value = "";
});

displayTasks();
